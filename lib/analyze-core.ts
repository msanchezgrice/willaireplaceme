import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { analysisPrompt } from '@/server/promptTemplates';
import { score } from '@/server/score';

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

export async function performAnalysis(profile_id: string, evidence: any) {
  console.log('🔬 [Analyze Core] Starting analysis for profile:', profile_id);
  console.log('📊 [Analyze Core] Evidence received:', {
    keys: Object.keys(evidence),
    evidence_size: JSON.stringify(evidence).length
  });
  
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  console.log('📦 [Analyze Core] Supabase client created');

  // Fetch user profile data for personalized analysis
  console.log('👤 [Analyze Core] Fetching user profile data...');
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profile_id)
    .single();

  if (profileError) {
    console.error('❌ [Analyze Core] Error fetching profile:', profileError);
    throw new Error('Profile not found');
  }

  console.log('✅ [Analyze Core] Profile data fetched');
  console.log('👤 [Analyze Core] Profile details:', {
    id: profileData.id,
    role: profileData.role,
    user_id: profileData.user_id,
    resume_length: profileData.resume?.length || 0,
    has_linkedin_data: !!profileData.linkedin_data,
    created_at: profileData.created_at
  });

  // Prepare enhanced user profile for analysis
  const enhancedProfile = {
    role: profileData.role,
    resume: profileData.resume,
    taskHours: profileData.task_hours,
    yearsExperience: profileData.profile_data?.yearsExperience,
    companySize: profileData.profile_data?.companySize,
    dailyWorkSummary: profileData.profile_data?.dailyWorkSummary,
    keySkills: profileData.profile_data?.keySkills,
    careerCategory: profileData.profile_data?.careerCategory,
    linkedinUrl: profileData.profile_data?.linkedinUrl,
    linkedinData: profileData.linkedin_data,
    createdAt: profileData.created_at
  };

  console.log('🤖 [Analyze Core] Creating OpenAI client...');
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 300000 // 5 minutes timeout
  });
  console.log('✅ [Analyze Core] OpenAI client created with 5-minute timeout');

  console.log('📝 [Analyze Core] Generating analysis prompt...');
  const prompt = analysisPrompt(JSON.stringify(evidence), enhancedProfile);
  console.log('📄 [Analyze Core] Analysis prompt generated, length:', prompt.length);

  console.log('🚀 [Analyze Core] Calling OpenAI Responses API...');
  try {
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

    console.log('✅ [Analyze Core] OpenAI response received');
    console.log('📏 [Analyze Core] Response content length:', analysis.output_text?.length || 0);

    const responseContent = analysis.output_text;
    if (!responseContent) {
      console.error('❌ [Analyze Core] No analysis response received');
      throw new Error('No analysis response received');
    }

    console.log('📄 [Analyze Core] Raw response content (first 200 chars):', responseContent.substring(0, 200));

    console.log('🔧 [Analyze Core] Splitting response into preview and full report...');
    const [preview, fullReport] = responseContent.split('---FULL_REPORT---');

    console.log('📏 [Analyze Core] Split results:', {
      preview_length: preview?.length || 0,
      full_report_length: fullReport?.length || 0,
      has_separator: responseContent.includes('---FULL_REPORT---')
    });

    // Sanitize the text outputs
    const sanitizedPreview = sanitizeText(preview?.trim() || 'Analysis preview not available');
    const sanitizedFullReport = sanitizeText(fullReport?.trim() || 'Full report not available');

    console.log('🧮 [Analyze Core] Calculating risk score...');
    const scoreVal = score(evidence);
    console.log('📊 [Analyze Core] Risk score calculated:', scoreVal);

    console.log('💾 [Analyze Core] Saving report to database...');
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
      console.error('❌ [Analyze Core] Database error:', dbError);
      throw new Error('Database error: ' + dbError.message);
    }

    console.log('✅ [Analyze Core] Report saved successfully:', report?.id);
    console.log('📊 [Analyze Core] Final report details:', {
      report_id: report?.id,
      profile_id: report?.profile_id,
      score: report?.score,
      preview_length: report?.preview?.length || 0,
      full_report_length: report?.full_report?.length || 0
    });
    
    return { ok: true, report_id: report?.id };
  } catch (openaiError) {
    console.error('💥 [Analyze Core] OpenAI API call failed:', openaiError);
    console.error('📚 [Analyze Core] OpenAI error details:', {
      error: openaiError instanceof Error ? openaiError.message : String(openaiError),
      stack: openaiError instanceof Error ? openaiError.stack : 'No stack trace',
      name: openaiError instanceof Error ? openaiError.name : 'Unknown error type'
    });
    throw openaiError;
  }
} 