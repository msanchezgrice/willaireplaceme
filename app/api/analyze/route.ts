import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { analysisPrompt } from '@/server/promptTemplates';
import { score } from '@/server/score';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  console.log('🔬 [Analyze API] Starting analysis request...');
  
  try {
    const body = await req.json();
    console.log('📋 [Analyze API] Request body keys:', Object.keys(body));
    console.log('📋 [Analyze API] Profile ID:', body.profile_id);
    console.log('📋 [Analyze API] Evidence type:', typeof body.evidence);
    
    const { profile_id, evidence } = body;

    // Validate required fields
    if (!profile_id) {
      console.error('❌ [Analyze API] Missing profile_id');
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    if (!evidence) {
      console.error('❌ [Analyze API] Missing evidence');
      return NextResponse.json({ error: 'Evidence is required' }, { status: 400 });
    }

    console.log('🔗 [Analyze API] Creating Supabase client...');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('✅ [Analyze API] Supabase client created');

    console.log('🤖 [Analyze API] Creating OpenAI client...');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000 // 60 second timeout for analysis
    });

    console.log('📝 [Analyze API] Generating analysis prompt...');
    const prompt = analysisPrompt(JSON.stringify(evidence));
    console.log('📄 [Analyze API] Prompt length:', prompt.length);

    console.log('🚀 [Analyze API] Calling OpenAI API (o3 model)...');
    const analysis = await openai.chat.completions.create({
      model: 'o3',
      temperature: 0,
      messages: [{ role: 'system', content: prompt }]
    });

    console.log('✅ [Analyze API] OpenAI response received');
    console.log('📊 [Analyze API] Response usage:', analysis.usage);

    const responseContent = analysis.choices[0].message.content;
    console.log('📄 [Analyze API] Response content length:', responseContent?.length);

    if (!responseContent) {
      console.error('❌ [Analyze API] Empty response from OpenAI');
      return NextResponse.json({ error: 'Empty analysis response' }, { status: 500 });
    }

    console.log('🔧 [Analyze API] Splitting response into preview and full report...');
    const [preview, full] = responseContent.split('---FULL_REPORT---');
    console.log('📄 [Analyze API] Preview length:', preview?.length);
    console.log('📄 [Analyze API] Full report length:', full?.length);

    console.log('🧮 [Analyze API] Calculating risk score...');
    const scoreVal = score(evidence);
    console.log('📊 [Analyze API] Calculated score:', scoreVal);

    console.log('💾 [Analyze API] Saving report to database...');
    const { data: report, error: dbError } = await supabase
      .from('reports')
      .insert([{
        profile_id,
        score: scoreVal,
        preview: preview?.trim() || 'Analysis preview not available',
        full_report: full?.trim() || 'Full report not available',
        evidence
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ [Analyze API] Database error:', dbError);
      return NextResponse.json({ error: 'Database error: ' + dbError.message }, { status: 500 });
    }

    console.log('✅ [Analyze API] Report saved successfully:', report?.id);
    console.log('✅ [Analyze API] Analysis completed successfully');

    return NextResponse.json({ ok: true, report_id: report?.id });

  } catch (error) {
    console.error('💥 [Analyze API] Unexpected error:', error);
    console.error('📚 [Analyze API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Analysis failed: ' + (error instanceof Error ? error.message : String(error)) }, 
      { status: 500 }
    );
  }
} 