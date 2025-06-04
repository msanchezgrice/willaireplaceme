import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { researchPrompt } from '@/server/promptTemplates';

export const runtime = 'edge';

// Function to sanitize text for database insertion
function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove null bytes and other problematic Unicode characters
    .replace(/\0/g, '')
    // Normalize Unicode
    .normalize('NFC')
    // Remove or replace problematic escape sequences
    .replace(/\\u[0-9a-fA-F]{4}/g, (match) => {
      try {
        return JSON.parse(`"${match}"`);
      } catch {
        return '';
      }
    })
    // Limit length to prevent oversized content
    .substring(0, 50000);
}

export async function POST(req: NextRequest) {
  console.log('🔍 [Research API] Starting request...');
  
  try {
    const body = await req.json();
    console.log('📋 [Research API] Request body:', JSON.stringify(body, null, 2));
    
    const { role, tasks, resume } = body;

    // Validate required fields
    if (!role) {
      console.error('❌ [Research API] Missing role field');
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Sanitize text inputs
    const sanitizedRole = sanitizeText(role);
    const sanitizedResume = sanitizeText(resume || '');
    
    console.log('🧹 [Research API] Text sanitization complete');
    console.log('📏 [Research API] Sanitized resume length:', sanitizedResume.length);

    console.log('🔗 [Research API] Creating Supabase client...');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('✅ [Research API] Supabase client created');

    console.log('💾 [Research API] Inserting profile into database...');
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .insert([{ 
        role: sanitizedRole, 
        resume: sanitizedResume, 
        task_hours: tasks || {},
        email: null // We're not collecting email in the current flow
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ [Research API] Database error:', dbError);
      return NextResponse.json({ error: 'Database error: ' + dbError.message }, { status: 500 });
    }

    console.log('✅ [Research API] Profile created:', profile);

    console.log('🤖 [Research API] Creating OpenAI client...');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000 // 30 second timeout
    });

    console.log('📝 [Research API] Generating research prompt...');
    const prompt = researchPrompt({ role: sanitizedRole, tasks, resume: sanitizedResume });
    console.log('📄 [Research API] Prompt length:', prompt.length);

    console.log('🚀 [Research API] Calling OpenAI API...');
    const research = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.2,
      messages: [{ role: 'system', content: prompt }]
    });

    console.log('✅ [Research API] OpenAI response received');
    console.log('📊 [Research API] Response usage:', research.usage);

    const responseContent = research.choices[0].message.content;
    console.log('📄 [Research API] Response content:', responseContent?.substring(0, 500) + '...');

    if (!responseContent) {
      console.error('❌ [Research API] Empty response from OpenAI');
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    console.log('🔧 [Research API] Parsing JSON response...');
    let evidence;
    try {
      evidence = JSON.parse(responseContent);
      console.log('✅ [Research API] JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ [Research API] JSON parse error:', parseError);
      console.log('📄 [Research API] Raw content that failed to parse:', responseContent);
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 });
    }

    console.log('🔥 [Research API] Triggering analysis (fire-and-forget)...');
    // Fire-and-forget analysis
    const analysisUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/analyze`;
    console.log('🎯 [Research API] Analysis URL:', analysisUrl);
    
    fetch(analysisUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profile.id, evidence })
    }).catch(error => {
      console.error('❌ [Research API] Analysis trigger failed:', error);
    });

    console.log('✅ [Research API] Request completed successfully');
    return NextResponse.json({ status: 'processing', profile_id: profile.id });

  } catch (error) {
    console.error('💥 [Research API] Unexpected error:', error);
    console.error('📚 [Research API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) }, 
      { status: 500 }
    );
  }
} 