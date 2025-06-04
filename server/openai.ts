import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key" 
});

interface CareerProfile {
  careerCategory: string;
  jobTitle: string;
  yearsExperience: string;
  dailyWorkSummary: string;
  keySkills: string;
  resumeText: string;
}

interface RiskAnalysis {
  riskScore: number;
  riskBreakdown: {
    taskAutomation: number;
    creativeRequirements: number;
    humanInteraction: number;
    strategicThinking: number;
  };
  timeline: string;
  recommendations: string;
  fullAnalysis: string;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // PDF extraction temporarily disabled - return empty string
    console.log('PDF upload received but extraction not available');
    return '';
  } catch (error) {
    console.error('PDF extraction error:', error);
    return '';
  }
}

export async function analyzeCareerRisk(profile: CareerProfile): Promise<RiskAnalysis> {
  try {
    // Step 1: Research current AI developments with GPT-4
    const researchPrompt = `
You are an AI research assistant. Research and analyze the current state of AI automation and agentic AI developments specifically for ${profile.careerCategory} roles, particularly ${profile.jobTitle}.

Consider:
- Latest AI tools and technologies in this field
- Automation trends and capabilities
- Agentic AI developments that could impact this role
- Current industry adoption rates
- Future projections for AI in this sector

Job Context:
- Role: ${profile.jobTitle}
- Experience: ${profile.yearsExperience}
- Daily work: ${profile.dailyWorkSummary}
- Key skills: ${profile.keySkills}
- Resume context: ${profile.resumeText.substring(0, 2000)}

Provide a comprehensive research summary in JSON format with the following structure:
{
  "currentAICapabilities": "string",
  "industryTrends": "string", 
  "automationRisks": "string",
  "agenticAIImpact": "string",
  "timelineFactors": "string"
}
`;

    const researchResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: researchPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const researchData = JSON.parse(researchResponse.choices[0].message.content || '{}');

    // Step 2: Deep analysis with O1 model for reasoning and risk assessment
    const analysisPrompt = `
You are an expert career analyst specializing in AI impact assessment. Based on the research provided and the professional profile, conduct a comprehensive risk analysis.

Research Context:
${JSON.stringify(researchData, null, 2)}

Professional Profile:
- Career Category: ${profile.careerCategory}
- Job Title: ${profile.jobTitle}
- Years of Experience: ${profile.yearsExperience}
- Daily Work Summary: ${profile.dailyWorkSummary}
- Key Skills: ${profile.keySkills}
- Resume Content: ${profile.resumeText.substring(0, 3000)}

Analyze the AI replacement risk across these dimensions:
1. Task Automation (0-100): How easily can AI automate their daily tasks?
2. Creative Requirements (0-100): How much creativity/human insight is required? (LOWER score = HIGHER protection)
3. Human Interaction (0-100): How much human-to-human interaction is needed? (LOWER score = HIGHER protection)
4. Strategic Thinking (0-100): How much high-level strategy/judgment is required? (LOWER score = HIGHER protection)

Calculate an overall risk score (0-100) where:
- 0-33 = Low Risk (AI unlikely to replace in next 10+ years)
- 34-66 = Moderate Risk (AI may significantly impact in 3-7 years)
- 67-100 = High Risk (AI likely to automate major portions in 1-4 years)

Provide detailed reasoning, evidence, timeline estimates, and specific recommendations for career protection/advancement.

Return analysis in JSON format:
{
  "riskScore": number,
  "riskBreakdown": {
    "taskAutomation": number,
    "creativeRequirements": number,
    "humanInteraction": number,
    "strategicThinking": number
  },
  "reasoning": "string",
  "evidence": "string",
  "timeline": "string",
  "recommendations": "string",
  "actionSteps": "string",
  "skillsToFocus": "string",
  "careerPivotOptions": "string"
}
`;

    const analysisResponse = await openai.chat.completions.create({
      model: "o1-preview",
      messages: [{ role: "user", content: analysisPrompt }],
      temperature: 0.1,
    });

    const analysisData = JSON.parse(analysisResponse.choices[0].message.content || '{}');

    // Construct full analysis text
    const fullAnalysis = `
## Executive Summary
${analysisData.reasoning}

## Evidence and Research
${analysisData.evidence}

## Timeline Analysis
${analysisData.timeline}

## Detailed Recommendations
${analysisData.recommendations}

## Action Steps
${analysisData.actionSteps}

## Skills to Focus On
${analysisData.skillsToFocus}

## Career Pivot Options
${analysisData.careerPivotOptions}

## Research Context
Based on current AI developments:
- **Current AI Capabilities**: ${researchData.currentAICapabilities}
- **Industry Trends**: ${researchData.industryTrends}
- **Automation Risks**: ${researchData.automationRisks}
- **Agentic AI Impact**: ${researchData.agenticAIImpact}
`;

    return {
      riskScore: Math.min(100, Math.max(0, analysisData.riskScore)),
      riskBreakdown: {
        taskAutomation: Math.min(100, Math.max(0, analysisData.riskBreakdown.taskAutomation)),
        creativeRequirements: Math.min(100, Math.max(0, analysisData.riskBreakdown.creativeRequirements)),
        humanInteraction: Math.min(100, Math.max(0, analysisData.riskBreakdown.humanInteraction)),
        strategicThinking: Math.min(100, Math.max(0, analysisData.riskBreakdown.strategicThinking)),
      },
      timeline: analysisData.timeline || "Analysis timeline not available",
      recommendations: analysisData.recommendations || "Recommendations not available",
      fullAnalysis: fullAnalysis,
    };

  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Fallback analysis if API fails
    const fallbackScore = 50; // moderate risk as default
    return {
      riskScore: fallbackScore,
      riskBreakdown: {
        taskAutomation: 60,
        creativeRequirements: 40,
        humanInteraction: 45,
        strategicThinking: 35,
      },
      timeline: "3-5 years for significant impact",
      recommendations: "AI analysis temporarily unavailable. We recommend focusing on developing strategic thinking, creative problem-solving, and human relationship skills to future-proof your career.",
      fullAnalysis: "Full analysis temporarily unavailable due to technical issues. Please try again later or contact support.",
    };
  }
}
