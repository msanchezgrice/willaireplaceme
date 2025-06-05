import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { researchPrompt, linkedinPrompt } from '@/server/promptTemplates';

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

// Function to analyze LinkedIn profile using web browsing
async function analyzeLinkedInProfile(openai: OpenAI, linkedinUrl: string): Promise<any> {
  console.log('🔗 [Research API] Analyzing LinkedIn profile:', linkedinUrl);
  
  try {
    // Use GPT-4 with web browsing to analyze LinkedIn profile
    const linkedinAnalysis = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `You are a professional profile analyzer. I will give you a LinkedIn URL and you need to extract professional information from it. 

Extract the following information:
- Current job title and company
- Years of experience (estimate from career progression)
- Key skills and technologies
- Daily responsibilities (infer from job titles and descriptions)
- Industry and functional area
- Education background
- Career progression pattern

Return the information in a structured JSON format like this:
{
  "currentTitle": "job title",
  "company": "company name",
  "yearsExperience": "estimated years",
  "skills": ["skill1", "skill2"],
  "dailyTasks": "inferred daily responsibilities",
  "industry": "industry sector",
  "education": "education background",
  "careerProgression": "career trajectory analysis"
}

If you cannot access the profile or extract information, return {"error": "Unable to analyze profile", "reason": "explanation"}.`
        },
        {
          role: 'user',
          content: `Please analyze this LinkedIn profile and extract professional information: ${linkedinUrl}`
        }
      ]
    });

    const responseContent = linkedinAnalysis.choices[0].message.content;
    if (!responseContent) {
      throw new Error('Empty response from LinkedIn analysis');
    }

    try {
      const profileData = JSON.parse(responseContent);
      console.log('✅ [Research API] LinkedIn profile analyzed successfully');
      return profileData;
    } catch (parseError) {
      console.error('❌ [Research API] Failed to parse LinkedIn analysis:', parseError);
      console.log('📄 [Research API] Raw response:', responseContent);
      
      // Return the raw text if JSON parsing fails
      return {
        error: false,
        rawAnalysis: responseContent,
        extractedInfo: "LinkedIn profile analysis completed but in text format"
      };
    }
  } catch (error) {
    console.error('❌ [Research API] LinkedIn analysis failed:', error);
    return {
      error: true,
      reason: error instanceof Error ? error.message : 'Unknown error during LinkedIn analysis'
    };
  }
}

export async function POST(req: NextRequest) {
  console.log('🔍 [Research API] Starting request...');
  
  try {
    const body = await req.json();
    console.log('📋 [Research API] Request body:', JSON.stringify(body, null, 2));
    
    const { role, tasks, resume, linkedinUrl, profileData } = body;

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
      timeout: 15000 // Shorter timeout for faster response
    });

    // LinkedIn Profile Analysis (with timeout)
    let linkedinData = null;
    if (linkedinUrl && linkedinUrl.trim()) {
      console.log('🔗 [Research API] Processing LinkedIn profile...');
      try {
        linkedinData = await Promise.race([
          analyzeLinkedInProfile(openai, linkedinUrl.trim()),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('LinkedIn analysis timeout')), 10000)
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

    // Do the AI research and analysis synchronously with timeout
    console.log('📝 [Research API] Starting AI research and analysis...');
    
    try {
      // Set a timeout for the entire analysis process
      const analysisPromise = (async () => {
        console.log('📝 [Research API] Generating research prompt...');
        const prompt = researchPrompt({ 
          role: sanitizedRole, 
          tasks, 
          resume: sanitizedResume,
          linkedinData: linkedinData || null,
          profileData: profileData || null
        });
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
          throw new Error('Empty response from OpenAI');
        }

        console.log('🔧 [Research API] Parsing JSON response...');
        let evidence;
        try {
          evidence = JSON.parse(responseContent);
          console.log('✅ [Research API] JSON parsed successfully');
          
          // Add LinkedIn data to evidence if available
          if (linkedinData && !linkedinData.error) {
            evidence.linkedinProfile = linkedinData;
          }
        } catch (parseError) {
          console.error('❌ [Research API] JSON parse error:', parseError);
          console.log('📄 [Research API] Raw content that failed to parse:', responseContent);
          throw parseError;
        }

        console.log('🔥 [Research API] Calling analyze API directly...');
        const analysisUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/analyze`;
        console.log('🎯 [Research API] Analysis URL:', analysisUrl);
        
        const analysisResponse = await fetch(analysisUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: profile.id, evidence }),
        });

        if (!analysisResponse.ok) {
          const errorText = await analysisResponse.text();
          console.error('❌ [Research API] Analysis failed:', analysisResponse.status, errorText);
          throw new Error(`Analysis API failed: ${analysisResponse.status} ${errorText}`);
        }

        const result = await analysisResponse.json();
        console.log('✅ [Research API] Analysis completed successfully:', result);
        return result;
      })();

      // Wait for analysis with 30 second timeout
      await Promise.race([
        analysisPromise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Analysis timeout after 30 seconds')), 30000)
        )
      ]);

      console.log('✅ [Research API] Full analysis pipeline completed');
      
    } catch (analysisError) {
      console.error('💥 [Research API] Analysis failed:', analysisError);
      // Don't fail the entire request if analysis fails - user can retry
      console.log('⚠️ [Research API] Continuing despite analysis failure');
    }

    console.log('✅ [Research API] Request completed successfully');
    return NextResponse.json({ 
      status: 'processing', 
      profile_id: profile.id,
      message: 'Analysis started, results will be available shortly'
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