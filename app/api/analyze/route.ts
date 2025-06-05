import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { analysisPrompt } from '@/server/promptTemplates';
import { score } from '@/server/score';

export const runtime = 'edge';

// Function to sanitize text for database insertion
function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove null bytes and other problematic Unicode characters
    .replace(/\0/g, '')
    // Normalize Unicode
    .normalize('NFC')
    // Limit length to prevent oversized content
    .substring(0, 50000);
}

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

    // Fetch user profile data for personalized analysis
    console.log('👤 [Analyze API] Fetching user profile data...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profile_id)
      .single();

    if (profileError) {
      console.error('❌ [Analyze API] Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    console.log('✅ [Analyze API] Profile data fetched:', {
      role: profileData.role,
      hasResume: !!profileData.resume,
      taskCount: Object.keys(profileData.task_hours || {}).length,
      hasProfileData: !!profileData.profile_data,
      hasLinkedinData: !!profileData.linkedin_data
    });

    // Prepare enhanced user profile for analysis
    const enhancedProfile = {
      role: profileData.role,
      resume: profileData.resume,
      taskHours: profileData.task_hours,
      // Extract from profile_data JSON
      yearsExperience: profileData.profile_data?.yearsExperience,
      companySize: profileData.profile_data?.companySize,
      dailyWorkSummary: profileData.profile_data?.dailyWorkSummary,
      keySkills: profileData.profile_data?.keySkills,
      careerCategory: profileData.profile_data?.careerCategory,
      linkedinUrl: profileData.profile_data?.linkedinUrl,
      // Include LinkedIn analysis if available
      linkedinData: profileData.linkedin_data,
      createdAt: profileData.created_at
    };

    console.log('🤖 [Analyze API] Creating OpenAI client...');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000 // 60 second timeout for analysis
    });

    console.log('📝 [Analyze API] Generating enhanced analysis prompt with user context...');
    const prompt = analysisPrompt(JSON.stringify(evidence), enhancedProfile);
    console.log('📄 [Analyze API] Enhanced prompt length:', prompt.length);

    console.log('🚀 [Analyze API] Calling OpenAI Responses API with Web Search + Structured Outputs...');
    
    // Define structured output schema for analysis response
    const analysisSchema = {
      type: "object",
      properties: {
        preview: {
          type: "string",
          description: "Professional preview section (maximum 300 words) with polished analysis, key findings, risk score interpretation, and actionable tip"
        },
        fullReport: {
          type: "string", 
          description: "Comprehensive markdown report with all sections: Executive Summary, Risk Assessment, Career Context Analysis, Timeline & Impact, Mitigation Strategies, 90-Day Action Plan, Skill Development Roadmap, etc."
        }
      },
      required: ["preview", "fullReport"]
    };

    const analysis = await openai.responses.parse({
      model: "gpt-4.1",
      tools: [{"type": "web_search_preview"}],
      input: [{
        role: "user", 
        content: [{
          type: "input_text",
          text: `${prompt}

**ENHANCED ANALYSIS WITH WEB SEARCH:**
Use web search to find the most current information to enhance this personalized career risk analysis:

1. Search for latest 2024-2025 developments in AI automation for: "${enhancedProfile.role}"
2. Find recent salary and job market trends for this role
3. Look up current skills in demand for career advancement
4. Search for real case studies of AI implementation in this industry
5. Find current certification programs and learning resources

Incorporate these real-time insights into the comprehensive analysis.

**OUTPUT FORMAT:**
Return a structured response with exactly two sections:
1. "preview" - Polished 300-word preview with key insights and risk score interpretation
2. "fullReport" - Complete comprehensive markdown analysis with all required sections

Both sections should incorporate current web search findings for accuracy and relevance.`
        }]
      }],
      output_schema: analysisSchema
    });

    console.log('✅ [Analyze API] OpenAI response received with structured outputs');

    if (!analysis.output_parsed) {
      console.error('❌ [Analyze API] No structured output received from analysis');
      return NextResponse.json({ error: 'No structured analysis response received' }, { status: 500 });
    }

    const { preview, fullReport }: { preview: string; fullReport: string } = analysis.output_parsed;
    console.log('📄 [Analyze API] Preview length:', preview?.length);
    console.log('📄 [Analyze API] Full report length:', fullReport?.length);

    // Sanitize the text outputs
    const sanitizedPreview = sanitizeText(preview?.trim() || 'Analysis preview not available');
    const sanitizedFullReport = sanitizeText(fullReport?.trim() || 'Full report not available');

    console.log('🧮 [Analyze API] Calculating risk score...');
    const scoreVal = score(evidence);
    console.log('📊 [Analyze API] Calculated score:', scoreVal);

    console.log('💾 [Analyze API] Saving report to database...');
    const { data: report, error: dbError } = await supabase
      .from('reports')
      .insert([{
        profile_id,
        score: scoreVal,
        preview: sanitizedPreview,
        full_report: sanitizedFullReport,
        evidence: evidence
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