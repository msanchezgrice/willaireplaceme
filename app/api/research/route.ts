import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
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

// Function to analyze LinkedIn profile using Responses API with structured outputs
async function analyzeLinkedInProfile(openai: OpenAI, linkedinUrl: string): Promise<any> {
  console.log('🔗 [Research API] Analyzing LinkedIn profile with Responses API + Structured Outputs:', linkedinUrl);
  
  try {
    // Define structured output schema for LinkedIn profile data
    const linkedinSchema = {
      type: "object",
      properties: {
        currentTitle: {
          type: "string",
          description: "Current job title from profile"
        },
        company: {
          type: "string", 
          description: "Current company name"
        },
        yearsExperience: {
          type: "string",
          description: "Calculated total years based on work history"
        },
        skills: {
          type: "array",
          items: { type: "string" },
          description: "Technical skills, soft skills, and tools listed"
        },
        dailyTasks: {
          type: "string",
          description: "Inferred daily responsibilities from role descriptions"
        },
        industry: {
          type: "string",
          description: "Industry/sector"
        },
        education: {
          type: "string",
          description: "Education background from profile"
        },
        careerProgression: {
          type: "string",
          description: "Analysis of career growth pattern"
        },
        experience: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              company: { type: "string" },
              duration: { type: "string" },
              description: { type: "string" }
            },
            required: ["title", "company", "duration", "description"]
          },
          description: "Work experience history"
        }
      },
      required: ["currentTitle", "company", "yearsExperience", "skills", "dailyTasks", "industry", "education", "careerProgression", "experience"]
    };

    // Use Responses API with structured outputs for guaranteed JSON
    const linkedinAnalysis = await openai.responses.parse({
      model: "gpt-4.1",
      tools: [{"type": "web_search_preview"}],
      input: [{
        role: "user",
        content: [{
          type: "input_text",
          text: `Analyze this LinkedIn profile and extract professional information: ${linkedinUrl}

Please search the web and visit this LinkedIn profile URL to extract comprehensive professional data.

**Instructions:**
1. Use web search to access the LinkedIn profile URL directly
2. Extract comprehensive professional information visible on the profile
3. Calculate years of experience based on work history timeline
4. Infer daily tasks from job descriptions and industry knowledge
5. Only include information that you can verify from the profile
6. For unavailable information, use "not available" as the value

Provide a complete professional analysis based on the structured format required.`
        }]
      }],
      output_schema: linkedinSchema
    });

    if (linkedinAnalysis.output_parsed) {
      console.log('✅ [Research API] LinkedIn profile analyzed successfully with structured outputs');
      return linkedinAnalysis.output_parsed;
    } else {
      throw new Error('No structured output received from LinkedIn analysis');
    }
  } catch (error) {
    console.error('❌ [Research API] LinkedIn analysis with structured outputs failed:', error);
    return {
      error: true,
      reason: error instanceof Error ? error.message : 'Unable to analyze LinkedIn profile with structured outputs'
    };
  }
}

// Function to process uploaded file using OpenAI File Search with Vector Stores
async function processUploadedFile(openai: OpenAI, fileContent: string, fileName: string, fileType: string): Promise<string> {
  console.log('📄 [Research API] Processing uploaded file with File Search API:', fileName, 'Type:', fileType);
  
  try {
    // If the file is plain text, return it directly
    if (fileType === 'text/plain') {
      console.log('✅ [Research API] Text file processed directly');
      return fileContent;
    }

    // For PDFs and other documents, use the advanced File Search approach
    const isBase64 = !fileContent.includes('\n') && fileContent.length > 100;
    
    if (isBase64 && (fileType.includes('pdf') || fileType.includes('doc'))) {
      try {
        console.log('📤 [Research API] Creating vector store for document analysis...');
        
        // Create a vector store for this document
        const vectorStore = await openai.vectorStores.create({
          name: `career_analysis_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
        });
        
        console.log('✅ [Research API] Vector store created:', vectorStore.id);

        // Convert base64 to buffer and create file for upload
        const buffer = Buffer.from(fileContent, 'base64');
        const blob = new Blob([buffer], { type: fileType });
        const file = new File([blob], fileName, { type: fileType });
        
        console.log('📤 [Research API] Uploading file to OpenAI Files API...');
        const uploadedFile = await openai.files.create({
          file: file,
          purpose: "assistants"
        });
        
        console.log('✅ [Research API] File uploaded successfully, ID:', uploadedFile.id);

        // Add file to vector store
        console.log('📚 [Research API] Adding file to vector store...');
        await openai.vectorStores.files.create(
          vectorStore.id,
          { file_id: uploadedFile.id }
        );

        console.log('✅ [Research API] File added to vector store successfully');

        // Use file search to analyze the document
        console.log('🔍 [Research API] Analyzing document with file search...');
        const response = await openai.responses.create({
          model: "gpt-4.1",
          tools: [{
            "type": "file_search",
            "vector_store_ids": [vectorStore.id]
          }],
          input: [{
            role: "user",
            content: [{
              type: "input_text",
              text: `Analyze this professional document (${fileName}) for career risk assessment.

Extract and structure the following information:

**Professional Information:**
- Personal/Contact details (name, location, email if visible)
- Professional summary or objective
- Current and previous job titles with companies
- Employment history with dates and descriptions
- Key responsibilities and achievements
- Technical skills and tools
- Education background (degrees, institutions, dates)
- Certifications and professional development
- Notable projects or accomplishments

**Career Analysis:**
- Years of total professional experience
- Career progression pattern and growth
- Industry expertise and functional areas
- Leadership experience and team management
- Key competencies and expertise areas

**Format Requirements:**
Return a comprehensive professional profile that can be used for AI automation risk analysis. Include specific details about:
- Daily tasks and responsibilities from job descriptions
- Technical skills and software proficiency
- Industry knowledge and specializations
- Career trajectory and advancement pattern

Organize the information clearly with headers and bullet points for easy analysis.`
            }]
          }]
        });

        if (response.output_text) {
          console.log('✅ [Research API] Document analyzed successfully with file search');
          
          // Cleanup: Delete the vector store after analysis (optional)
          try {
            await openai.vectorStores.delete(vectorStore.id);
            console.log('🧹 [Research API] Vector store cleaned up');
          } catch (cleanupError) {
            console.log('⚠️ [Research API] Vector store cleanup failed:', cleanupError);
          }
          
          return response.output_text;
        }
        
      } catch (fileSearchError) {
        console.error('❌ [Research API] File search processing failed:', fileSearchError);
        // Fall back to simpler processing
      }
    }

    // Fallback: Use text-based analysis for other content types or failures
    if (!isBase64 || fileContent.length < 50000) {
      console.log('📝 [Research API] Using fallback text analysis...');
      const response = await openai.responses.create({
        model: "gpt-4.1",
        input: [{
          role: "user",
          content: [{
            type: "input_text",
            text: `Extract and structure professional information from this document content:

Filename: ${fileName}
Type: ${fileType}
Content: ${fileContent.substring(0, 12000)}

Extract:
- Professional Summary
- Work Experience with dates and descriptions
- Education and certifications
- Skills and Technologies
- Achievements and projects

Format as a structured professional profile for career risk analysis.`
          }]
        }]
      });

      if (response.output_text) {
        console.log('✅ [Research API] File content processed with fallback analysis');
        return response.output_text;
      }
    }

    console.log('⚠️ [Research API] No content extracted from file');
    return `Professional document uploaded: ${fileName} (${fileType}) - File uploaded but detailed analysis not available`;
    
  } catch (error) {
    console.error('❌ [Research API] File processing failed:', error);
    return `Professional document uploaded: ${fileName} (${fileType}) - Processing error occurred`;
  }
}

export async function POST(req: NextRequest) {
  console.log('🔍 [Research API] Starting request...');
  
  try {
    // Get the current user from Clerk
    const { userId, sessionId } = await auth();
    console.log('👤 [Research API] User authentication:', { userId, hasSession: !!sessionId });
    
    const body = await req.json();
    console.log('📋 [Research API] Request body:', JSON.stringify(body, null, 2));
    
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
      timeout: 15000 // Shorter timeout for faster response
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
        email: null, // Email will be fetched from Clerk if needed
        user_id: userId, // Store Clerk user ID for linking
        // Store additional profile data as JSON
        profile_data: profileData ? {
          careerCategory: profileData.careerCategory,
          yearsExperience: profileData.yearsExperience,
          companySize: profileData.companySize,
          dailyWorkSummary: profileData.dailyWorkSummary,
          keySkills: profileData.keySkills,
          linkedinUrl: linkedinUrl
        } : null,
        linkedin_data: linkedinData && !linkedinData.error ? linkedinData : null
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

        console.log('🚀 [Research API] Calling OpenAI Responses API with Web Search + Structured Outputs...');
        
        // Define structured output schema for research data
        const researchSchema = {
          type: "object",
          properties: {
            taskFacts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  task: { type: "string", description: "Specific task from their role" },
                  riskLevel: { type: "string", enum: ["High", "Moderate", "Low"] },
                  evidence: { type: "string", description: "Real AI tools/companies affecting this task" },
                  impact: { type: "string", description: "Conservative automation percentage estimate" },
                  timeline: { type: "string", description: "Realistic timeframe for significant impact" },
                  sourceUrl: { type: "string", description: "Real URL if certain, otherwise 'Industry research'" },
                  toolsExample: { type: "string", description: "Actual AI tools/platforms that exist" }
                },
                required: ["task", "riskLevel", "evidence", "impact", "timeline", "sourceUrl", "toolsExample"]
              }
            },
            macroStats: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  statistic: { type: "string", description: "Verifiable industry data or conservative estimates" },
                  source: { type: "string", description: "Real research organization name" },
                  url: { type: "string", description: "Real URL if certain, otherwise 'Industry research reports'" },
                  year: { type: "string", description: "2023 or 2024" },
                  relevance: { type: "string", description: "How this relates to the specific role" }
                },
                required: ["statistic", "source", "url", "year", "relevance"]
              }
            },
            industryContext: {
              type: "object",
              properties: {
                overview: { type: "string", description: "2-3 sentence summary based on real AI developments" },
                keyTrends: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Array of real trends"
                },
                timeHorizon: { type: "string", description: "Conservative timeline for major disruption" }
              },
              required: ["overview", "keyTrends", "timeHorizon"]
            }
          },
          required: ["taskFacts", "macroStats", "industryContext"]
        };

        const research = await openai.responses.parse({
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

Provide ONLY verifiable information from your web searches. Include real URLs when available.

Return structured data according to the defined schema with verified information only.`
            }]
          }],
          output_schema: researchSchema
        });

        console.log('✅ [Research API] OpenAI response received with structured outputs');

        if (!research.output_parsed) {
          throw new Error('No structured output received from research analysis');
        }

        const evidence: any = research.output_parsed;
        console.log('📄 [Research API] Structured evidence received');

        // Add LinkedIn data to evidence if available
        if (linkedinData && !linkedinData.error) {
          evidence.linkedinProfile = linkedinData;
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