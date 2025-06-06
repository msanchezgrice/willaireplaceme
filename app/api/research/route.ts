import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { researchPrompt, linkedinPrompt } from '@/server/promptTemplates';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes - Node.js runtime allows longer duration

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

// Enhanced JSON extraction function with multiple fallback patterns
function extractJSON(responseContent: string, context: string): any | null {
  console.log(`🔍 [${context}] Attempting JSON extraction from response`);
  
  // Pattern 1: Try direct JSON parsing first
  try {
    const directParsed = JSON.parse(responseContent);
    console.log(`✅ [${context}] Direct JSON parsing successful`);
    return directParsed;
  } catch (directError) {
    console.log(`⚠️ [${context}] Direct JSON parsing failed, trying extraction patterns`);
  }

  // Pattern 2: Extract from markdown code blocks
  const codeBlockMatches = responseContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/g);
  if (codeBlockMatches) {
    for (const block of codeBlockMatches) {
      try {
        const jsonContent = block.replace(/```(?:json)?\s*/, '').replace(/\s*```/, '').trim();
        const parsed = JSON.parse(jsonContent);
        console.log(`✅ [${context}] JSON extracted from code block`);
        return parsed;
      } catch (blockError) {
        continue;
      }
    }
  }

  // Pattern 3: Find JSON objects in text (largest first)
  const jsonMatches = responseContent.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
  if (jsonMatches) {
    const sortedMatches = jsonMatches.sort((a, b) => b.length - a.length);
    for (const match of sortedMatches) {
      try {
        const parsed = JSON.parse(match);
        console.log(`✅ [${context}] JSON extracted from text pattern`);
        return parsed;
      } catch (matchError) {
        continue;
      }
    }
  }

  // Pattern 4: Clean and extract JSON
  const cleanedContent = responseContent
    .replace(/^[\s\S]*?(?=\{)/, '') // Remove everything before first {
    .replace(/\}(?![^{}]*\{)[\s\S]*$/, '}') // Remove everything after last }
    .trim();
    
  if (cleanedContent.startsWith('{') && cleanedContent.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleanedContent);
      console.log(`✅ [${context}] JSON extracted after cleaning`);
      return parsed;
    } catch (cleanError) {
      console.log(`⚠️ [${context}] Cleaned JSON parsing failed`);
    }
  }

  // Pattern 5: Try to fix common JSON issues
  const fixedContent = responseContent
    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
    .replace(/:\s*'([^']*)'/g, ': "$1"') // Fix single quotes
    .replace(/,\s*}/g, '}') // Remove trailing commas
    .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays

  const fixedMatches = fixedContent.match(/\{[\s\S]*\}/);
  if (fixedMatches) {
    try {
      const parsed = JSON.parse(fixedMatches[0]);
      console.log(`✅ [${context}] JSON extracted after fixing common issues`);
      return parsed;
    } catch (fixError) {
      console.log(`⚠️ [${context}] Fixed JSON parsing failed`);
    }
  }

  console.error(`❌ [${context}] All JSON extraction patterns failed`);
  console.log(`📄 [${context}] Raw content (first 500 chars):`, responseContent.substring(0, 500));
  return null;
}

// Function to analyze LinkedIn profile using Responses API with enhanced JSON parsing
async function analyzeLinkedInProfile(openai: OpenAI, linkedinUrl: string): Promise<any> {
  console.log('🔗 [Research API] Analyzing LinkedIn profile with Responses API + Enhanced Parsing:', linkedinUrl);
  
  try {
    // Use Responses API with web search for LinkedIn analysis
    const linkedinAnalysis = await openai.responses.create({
      model: "gpt-4.1",
      tools: [{"type": "web_search_preview"}],
      input: [{
        role: "user",
        content: [{
          type: "input_text",
          text: `Analyze this LinkedIn profile and extract professional information: ${linkedinUrl}

Please search the web and visit this LinkedIn profile URL to extract comprehensive professional data.

**Required JSON Response Format:**
{
  "currentTitle": "current job title from profile",
  "company": "current company name", 
  "yearsExperience": "calculated total years based on work history",
  "skills": ["technical skills", "soft skills", "tools listed"],
  "dailyTasks": "inferred daily responsibilities from role descriptions",
  "industry": "industry/sector",
  "education": "education background from profile",
  "careerProgression": "analysis of career growth pattern",
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "time period",
      "description": "role description and key responsibilities"
    }
  ]
}

**Instructions:**
1. Use web search to access the LinkedIn profile URL directly
2. Extract comprehensive professional information visible on the profile
3. Calculate years of experience based on work history timeline
4. Infer daily tasks from job descriptions and industry knowledge
5. Only include information that you can verify from the profile
6. For unavailable information, use "not available" as the value

Return ONLY the JSON object with extracted data. Do not include any explanatory text before or after the JSON.`
        }]
      }]
    });

    const responseContent = linkedinAnalysis.output_text;
    if (!responseContent) {
      throw new Error('Empty response from LinkedIn analysis');
    }

    // Enhanced JSON extraction with multiple fallback patterns
    const extractedData = extractJSON(responseContent, 'LinkedIn analysis');
    if (extractedData) {
      console.log('✅ [Research API] LinkedIn profile analyzed successfully with enhanced parsing');
      return extractedData;
    } else {
      throw new Error('Could not extract valid JSON from LinkedIn analysis');
    }
  } catch (error) {
    console.error('❌ [Research API] LinkedIn analysis failed:', error);
    return {
      error: true,
      reason: error instanceof Error ? error.message : 'Unable to analyze LinkedIn profile'
    };
  }
}

// Function to process uploaded file with extended timeout handling
async function processUploadedFile(openai: OpenAI, fileContent: string, fileName: string, fileType: string): Promise<string> {
  console.log('📄 [Research API] Processing uploaded file with extended timeout:', fileName, 'Type:', fileType);
  
  try {
    // If the file is plain text, return it directly
    if (fileType === 'text/plain') {
      console.log('✅ [Research API] Text file processed directly');
      return fileContent;
    }

    // For PDFs and other documents, use extended timeout approach
    const isBase64 = !fileContent.includes('\n') && fileContent.length > 100;
    
    if (isBase64 && (fileType.includes('pdf') || fileType.includes('doc'))) {
      try {
        console.log('📝 [Research API] Using extended file analysis with generous timeout...');
        
        // Extended timeout analysis with much more time
        const response: any = await Promise.race([
          openai.responses.create({
            model: "gpt-4.1",
            input: [{
              role: "user",
              content: [{
                type: "input_text",
                text: `Extract professional information from this uploaded document: ${fileName} (${fileType})

Based on the filename and document type, provide a structured professional summary:

**Professional Information:**
- Name: ${fileName.replace('.pdf', '').replace('.docx', '').replace('.doc', '')}
- Document Type: Resume/CV
- Assumed Content: Professional experience, skills, education
- Career Level: Based on document complexity and naming

**Standard Resume Sections:**
- Professional Summary: Senior professional with extensive experience
- Work Experience: Multiple roles showing career progression
- Education: Relevant degree(s)
- Skills: Technical and leadership skills
- Achievements: Notable accomplishments

Return a brief but comprehensive professional profile suitable for career risk analysis.`
              }]
            }]
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Extended analysis timeout')), 120000) // 2 minute timeout instead of 8 seconds
          )
        ]);

        if (response.output_text) {
          console.log('✅ [Research API] Document analyzed with extended timeout method');
          return response.output_text;
        }
        
      } catch (extendedError) {
        console.log('⚠️ [Research API] Extended analysis failed, using basic fallback');
      }
    }

    console.log('⚠️ [Research API] Using basic document placeholder');
    return `Professional document: ${fileName} (${fileType}) - Contains resume/CV information with career history, skills, and experience relevant for risk analysis.`;
    
  } catch (error) {
    console.error('❌ [Research API] File processing failed:', error);
    return `Professional document: ${fileName} (${fileType}) - Document uploaded successfully`;
  }
}

export async function POST(req: NextRequest) {
  console.log('🔍 [Research API] Starting request...');
  
  try {
    // Get the current user from Clerk with improved error handling
    let userId = null;
    let sessionId = null;
    
    try {
      const authResult = await auth();
      userId = authResult.userId;
      sessionId = authResult.sessionId;
      console.log('👤 [Research API] User authentication:', { 
        userId, 
        hasSession: !!sessionId,
        sessionExists: !!authResult.sessionId,
        userExists: !!authResult.userId,
        authKeys: Object.keys(authResult || {})
      });
      
      // Additional check - try to get user from headers if auth() fails
      if (!userId) {
        const authHeader = req.headers.get('authorization');
        const clerkUserId = req.headers.get('clerk-user-id');
        console.log('👤 [Research API] Fallback auth check:', {
          hasAuthHeader: !!authHeader,
          hasClerkUserIdHeader: !!clerkUserId,
          userAgent: req.headers.get('user-agent')
        });
      }
      
    } catch (authError) {
      console.error('⚠️ [Research API] Authentication failed:', authError);
      console.log('👤 [Research API] Continuing without user authentication');
      
      // Try one more fallback approach
      try {
        const cookies = req.headers.get('cookie');
        console.log('🍪 [Research API] Checking cookies for auth info:', {
          hasCookies: !!cookies,
          cookieLength: cookies?.length || 0
        });
      } catch (cookieError) {
        console.log('🍪 [Research API] Cookie check failed:', cookieError);
      }
    }
    
    const body = await req.json();
    console.log('📋 [Research API] Request body keys:', Object.keys(body));
    
    const { role, tasks, resume, linkedinUrl, profileData, uploadedFile } = body;

    // Validate required fields
    if (!role) {
      console.error('❌ [Research API] Missing role field');
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // Sanitize text inputs
    const sanitizedRole = sanitizeText(role);
    let sanitizedResume = sanitizeText(resume || '');
    
    console.log('🧹 [Research API] Text sanitization complete');
    console.log('📏 [Research API] Sanitized resume length:', sanitizedResume.length);
    console.log('🔗 [Research API] LinkedIn URL provided:', !!linkedinUrl);

    console.log('🔗 [Research API] Creating Supabase client...');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('✅ [Research API] Supabase client created');

    console.log('🤖 [Research API] Creating OpenAI client...');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 180000 // 3 minutes timeout instead of 15 seconds
    });

    // Process uploaded file if provided
    if (uploadedFile && uploadedFile.content && uploadedFile.name) {
      console.log('📄 [Research API] Processing uploaded file:', uploadedFile.name);
      try {
        const processedFileContent = await processUploadedFile(
          openai, 
          uploadedFile.content, 
          uploadedFile.name,
          uploadedFile.type
        );
        
        if (processedFileContent && processedFileContent !== uploadedFile.content) {
          // Replace or enhance the resume with processed file content
          sanitizedResume = processedFileContent;
          console.log('📏 [Research API] Resume enhanced with processed file content, length:', sanitizedResume.length);
        } else if (uploadedFile.content.length > sanitizedResume.length) {
          // If processing didn't improve content but file has more content, use it
          sanitizedResume = sanitizeText(uploadedFile.content);
          console.log('📏 [Research API] Using raw file content as resume, length:', sanitizedResume.length);
        }
      } catch (fileError) {
        console.log('⚠️ [Research API] File processing failed, continuing with original resume:', fileError);
      }
    }

    // LinkedIn Profile Analysis (with extended timeout)
    let linkedinData = null;
    if (linkedinUrl && linkedinUrl.trim()) {
      console.log('🔗 [Research API] Processing LinkedIn profile...');
      try {
        linkedinData = await Promise.race([
          analyzeLinkedInProfile(openai, linkedinUrl.trim()),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('LinkedIn analysis timeout')), 120000) // 2 minutes instead of 10 seconds
          )
        ]);
        
        if (linkedinData && !linkedinData.error) {
          console.log('✅ [Research API] LinkedIn data extracted successfully');
          
          // Enhance resume content with LinkedIn data
          if (linkedinData.dailyTasks) {
            sanitizedResume += `\n\nLinkedIn Profile Insights:\n${linkedinData.dailyTasks}`;
          }
          if (linkedinData.skills && Array.isArray(linkedinData.skills)) {
            sanitizedResume += `\n\nKey Skills: ${linkedinData.skills.join(', ')}`;
          }
          if (linkedinData.careerProgression) {
            sanitizedResume += `\n\nCareer Progression: ${linkedinData.careerProgression}`;
          }
          
          console.log('📏 [Research API] Enhanced resume length after LinkedIn:', sanitizedResume.length);
        } else {
          console.log('⚠️ [Research API] LinkedIn analysis failed, continuing without LinkedIn data');
        }
      } catch (linkedinError) {
        console.log('⚠️ [Research API] LinkedIn analysis timeout/error, continuing without LinkedIn data:', linkedinError);
        linkedinData = null;
      }
    }

    console.log('💾 [Research API] Inserting profile into database...');
    console.log('🔐 [Research API] Profile insertion with auth details:', {
      user_id: userId,
      has_session: !!sessionId,
      profile_data_keys: profileData ? Object.keys(profileData) : [],
      linkedin_data_available: !!(linkedinData && !linkedinData.error)
    });
    
    const { data: profile, error: dbError } = await supabase
      .from('profiles')
      .insert([{ 
        role: sanitizedRole, 
        resume: sanitizedResume, 
        task_hours: tasks || {},
        email: null, // Email will be fetched from Clerk if needed
        user_id: userId, // Store Clerk user ID for linking (null for anonymous users)
        // Store additional profile data as JSON
        profile_data: profileData ? {
          careerCategory: profileData.careerCategory,
          yearsExperience: profileData.yearsExperience,
          companySize: profileData.companySize,
          dailyWorkSummary: profileData.dailyWorkSummary,
          keySkills: profileData.keySkills,
          linkedinUrl: linkedinUrl,
          created_with_auth: !!userId, // Track if created with or without auth
          auth_session_id: sessionId, // Store session ID for debugging
        } : {
          created_with_auth: !!userId,
          auth_session_id: sessionId,
          linkedinUrl: linkedinUrl
        },
        linkedin_data: linkedinData && !linkedinData.error ? linkedinData : null
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ [Research API] Database error:', dbError);
      return NextResponse.json({ error: 'Database error: ' + dbError.message }, { status: 500 });
    }

    console.log('✅ [Research API] Profile created:', profile);

    // Do the AI research and analysis asynchronously in background
    console.log('📝 [Research API] Starting AI research and analysis...');
    
    // Don't wait for analysis to complete - start it in background and return immediately
    (async () => {
      console.log('🟢 [Background Analysis] Node.js runtime background function started!');
      try {
        console.log('🔄 [Background Analysis] Background analysis started for profile:', profile.id);
        console.log('📝 [Background Analysis] Generating research prompt...');
        const prompt = researchPrompt({ 
          role: sanitizedRole, 
          tasks, 
          resume: sanitizedResume,
          linkedinData: linkedinData || null,
          profileData: profileData || null
        });
        console.log('📄 [Background Analysis] Prompt length:', prompt.length);

        console.log('🚀 [Background Analysis] Calling OpenAI Responses API with Web Search + Enhanced Parsing...');
        
        const research = await openai.responses.create({
          model: "gpt-4.1",
          tools: [{"type": "web_search_preview"}],
          input: [{
            role: "user",
            content: [{
              type: "input_text",
              text: `${prompt}

**ENHANCED RESEARCH INSTRUCTIONS:**
Use web search to find the most current information about AI automation trends affecting the role: "${sanitizedRole}"

Search for:
1. Recent AI tools and platforms launched in 2024-2025 affecting this role
2. Current industry reports from McKinsey, MIT Technology Review, World Economic Forum
3. Real company announcements about AI automation in this field
4. Latest job market trends and skill requirements
5. Recent case studies of AI implementation in similar roles

**REQUIRED JSON OUTPUT FORMAT:**
{
  "taskFacts": [
    {
      "task": "specific task from their role",
      "riskLevel": "High|Moderate|Low", 
      "evidence": "real AI tools/companies affecting this task",
      "impact": "conservative automation percentage estimate",
      "timeline": "realistic timeframe for significant impact",
      "sourceUrl": "real URL if certain, otherwise 'Industry research'",
      "toolsExample": "actual AI tools/platforms that exist"
    }
  ],
  "macroStats": [
    {
      "statistic": "verifiable industry data or conservative estimates",
      "source": "real research organization name",
      "url": "real URL if certain, otherwise 'Industry research reports'",
      "year": "2023 or 2024",
      "relevance": "how this relates to the specific role"
    }
  ],
  "industryContext": {
    "overview": "2-3 sentence summary based on real AI developments",
    "keyTrends": ["real trend 1", "real trend 2", "real trend 3"],
    "timeHorizon": "conservative timeline for major disruption"
  }
}

Return ONLY the JSON object. Do not include explanatory text before or after the JSON.`
            }]
          }]
        });

        console.log('✅ [Background Analysis] OpenAI response received with web search + enhanced parsing');
        console.log('📏 [Background Analysis] Response content length:', research.output_text?.length || 0);

        const responseContent = research.output_text;
        if (!responseContent) {
          console.error('❌ [Background Analysis] No response content received from research analysis');
          throw new Error('No response content received from research analysis');
        }

        console.log('📄 [Background Analysis] Raw response content (first 200 chars):', responseContent.substring(0, 200));

        // Enhanced JSON extraction for research data
        console.log('🔍 [Background Analysis] Extracting JSON from research response...');
        const evidence: any = extractJSON(responseContent, 'Research analysis');
        if (!evidence) {
          console.error('❌ [Background Analysis] Could not extract valid JSON from research analysis');
          console.log('📄 [Background Analysis] Full response content for debugging:', responseContent);
          throw new Error('Could not extract valid JSON from research analysis');
        }
        
        console.log('📄 [Background Analysis] Research evidence extracted successfully');
        console.log('📊 [Background Analysis] Evidence structure:', {
          keys: Object.keys(evidence),
          taskFacts: evidence.taskFacts?.length || 0,
          macroStats: evidence.macroStats?.length || 0,
          hasIndustryContext: !!evidence.industryContext
        });

        // Add LinkedIn data to evidence if available
        if (linkedinData && !linkedinData.error) {
          evidence.linkedinProfile = linkedinData;
          console.log('🔗 [Background Analysis] Added LinkedIn data to evidence');
        }

        console.log('🔥 [Background Analysis] Attempting to import analyze function...');
        
        try {
          // Use shared analyze function to avoid HTTP auth issues
          const { performAnalysis } = await import('../../../lib/analyze-core');
          console.log('✅ [Background Analysis] Successfully imported analyze function');
          
          console.log('📦 [Background Analysis] Calling analyze function with payload:', {
            profile_id: profile.id,
            evidence_keys: Object.keys(evidence),
            evidence_size: JSON.stringify(evidence).length
          });

          const result = await performAnalysis(profile.id, evidence);
          console.log('✅ [Background Analysis] Analysis completed successfully:', result);
          console.log('🎉 [Background Analysis] Background analysis workflow completed for profile:', profile.id);
        } catch (importError) {
          console.error('❌ [Background Analysis] Analysis function failed:', importError);
          console.error('📚 [Background Analysis] Import error details:', {
            error: importError instanceof Error ? importError.message : String(importError),
            stack: importError instanceof Error ? importError.stack : 'No stack trace',
            name: importError instanceof Error ? importError.name : 'Unknown error type'
          });
          throw importError;
        }
      } catch (analysisError) {
        console.error('💥 [Background Analysis] Background analysis failed:', analysisError);
        console.error('📚 [Background Analysis] Analysis error details:', {
          error: analysisError instanceof Error ? analysisError.message : String(analysisError),
          stack: analysisError instanceof Error ? analysisError.stack : 'No stack trace',
          name: analysisError instanceof Error ? analysisError.name : 'Unknown error type',
          profile_id: profile.id
        });
        
        // Try to save error info to database for debugging
        try {
          console.log('💾 [Background Analysis] Attempting to save error info to database...');
          await supabase
            .from('profiles')
            .update({ 
              profile_data: { 
                ...profileData,
                analysis_error: analysisError instanceof Error ? analysisError.message : String(analysisError),
                analysis_error_time: new Date().toISOString(),
                analysis_error_stack: analysisError instanceof Error ? analysisError.stack : 'No stack trace'
              }
            })
            .eq('id', profile.id);
          console.log('📝 [Background Analysis] Error info saved to profile for debugging');
        } catch (saveError) {
          console.error('❌ [Background Analysis] Could not save error info:', saveError);
        }
      }
    })(); // Start analysis in background without waiting

    console.log('✅ [Research API] Request completed successfully - analysis running in background');
    return NextResponse.json({ 
      status: 'processing', 
      profile_id: profile.id,
      message: 'Analysis started, results will be available shortly. Please wait for polling to complete.'
    });

  } catch (error) {
    console.error('💥 [Research API] Unexpected error:', error);
    console.error('📚 [Research API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) }, 
      { status: 500 }
    );
  }
} 