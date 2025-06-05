import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { analysisPrompt } from '@/server/promptTemplates';
import { score } from '@/server/score';

export const runtime = 'edge';
export const maxDuration = 900; // 15 minutes for edge function

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
      timeout: 300000 // 5 minutes timeout instead of 60 seconds
    });

    console.log('📝 [Analyze API] Generating enhanced analysis prompt with user context...');
    const prompt = analysisPrompt(JSON.stringify(evidence), enhancedProfile);
    console.log('📄 [Analyze API] Enhanced prompt length:', prompt.length);

    console.log('🚀 [Analyze API] Calling OpenAI Responses API with Web Search + Enhanced Parsing...');
    
    const analysis = await openai.responses.create({
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

**REQUIRED OUTPUT FORMAT:**
The response must contain exactly two sections separated by "---FULL_REPORT---":

1. PREVIEW SECTION (before the separator):
   - Maximum 300 words
   - Professional preview with key insights
   - Risk score interpretation
   - One actionable tip
   - Inline citations using [1], [2], etc.

2. FULL REPORT SECTION (after the separator):
   - Complete comprehensive markdown analysis
   - All required sections with web search insights
   - Enhanced with current market data

Example format:
[Preview content here...]

---FULL_REPORT---

[Full comprehensive report here...]

Ensure both sections incorporate current web search findings for accuracy and relevance.`
        }]
      }]
    });

    console.log('✅ [Analyze API] OpenAI response received with web search + enhanced parsing');

    const responseContent = analysis.output_text;
    if (!responseContent) {
      console.error('❌ [Analyze API] No response content received from analysis');
      return NextResponse.json({ error: 'No analysis response received' }, { status: 500 });
    }

    console.log('🔧 [Analyze API] Splitting response into preview and full report...');
    const [preview, fullReport] = responseContent.split('---FULL_REPORT---');
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