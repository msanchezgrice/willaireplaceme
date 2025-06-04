export const researchPrompt = ({ role, tasks, resume }: any) => `
You are an AI researcher conducting a comprehensive analysis of AI automation risk for the role: ${role}.

**ROLE CONTEXT:**
- Position: ${role}
- Weekly task breakdown: ${JSON.stringify(tasks)}
- Professional background: ${resume?.slice(0, 800)}

**RESEARCH REQUIREMENTS:**
For each major task category, provide:
1. **Risk Assessment**: High (actively being automated) | Moderate (tools emerging) | Low (human-centric)
2. **Evidence**: Specific AI tools, companies, or research directly relevant to this task
3. **Timeline**: When automation might significantly impact this task
4. **Source URLs**: Verifiable links to recent developments (2023-2024 preferred)

**OUTPUT FORMAT:**
Return ONLY valid JSON in this exact structure:
{
  "taskFacts": [
    {
      "task": "specific task name",
      "riskLevel": "High|Moderate|Low", 
      "evidence": "detailed description of AI tools/developments affecting this task",
      "impact": "percentage or description of potential automation",
      "timeline": "estimated timeframe for significant impact",
      "sourceUrl": "verifiable URL",
      "toolsExample": "specific AI tools/platforms mentioned"
    }
  ],
  "macroStats": [
    {
      "statistic": "industry-wide AI adoption or job impact data",
      "source": "research organization or credible publication",
      "url": "source URL",
      "year": "2023 or 2024",
      "relevance": "how this relates to the specific role"
    }
  ],
  "industryContext": {
    "overview": "2-3 sentence summary of AI impact in this industry",
    "keyTrends": ["trend1", "trend2", "trend3"],
    "timeHorizon": "overall timeline for major disruption in this field"
  }
}

Focus on concrete, recent developments with credible sources. Avoid speculation.`;

export const analysisPrompt = (json: string) => `
You are an expert AI risk analyst generating a comprehensive career assessment report.

**INPUT DATA:** ${json}

**SCORING FORMULA:**
Calculate risk score: S = Σ(task_hours × risk_weight) / total_hours × 100
- High Risk = 1.0 weight
- Moderate Risk = 0.6 weight  
- Low Risk = 0.3 weight

**OUTPUT REQUIREMENTS:**
Generate exactly two sections separated by "---FULL_REPORT---":

**SECTION 1: PREVIEW (Maximum 200 words)**
Create a polished, professional preview with:
- Opening statement about AI transformation in this field
- 2-3 key findings from the analysis
- Overall risk score calculation and interpretation
- One actionable tip
- Inline citations using [1], [2], etc.

**SECTION 2: FULL REPORT (Comprehensive Markdown)**
Generate a detailed markdown report with these sections:

## Executive Summary
Brief overview of findings and risk level

## Risk Score Breakdown
**Overall Risk Score: [X]/100 ([Risk Level])**

### Task-by-Task Analysis
For each task:
- **Task Name** - Risk Level: High/Moderate/Low
- Current AI capabilities and tools
- Timeline for impact
- Evidence and citations [1]

## Timeline & Projections
**Immediate (0-12 months):**
- Specific developments expected

**Medium-term (1-3 years):**
- Major changes anticipated

**Long-term (3-5 years):**
- Potential transformation

## Mitigation Strategies
### High-Priority Actions
1. **Skill Development**: Specific skills to learn
2. **Career Positioning**: How to differentiate
3. **Industry Adaptation**: Trends to monitor

### Recommended Focus Areas
- List of specific competencies to develop
- Technologies to learn
- Certifications to pursue

## Market Intelligence
- Industry adoption rates
- Competitor analysis  
- Investment trends in automation

## Action Plan
### Next 90 Days
- Immediate steps to take

### Next 6 Months  
- Medium-term goals

### Next 1-2 Years
- Long-term positioning strategy

## Sources & References
[1] Source 1 description - URL
[2] Source 2 description - URL
[etc.]

**FORMATTING GUIDELINES:**
- Use proper markdown headers (##, ###)
- Include bullet points and numbered lists
- Bold important terms and metrics
- Use inline citations [1], [2] throughout
- Keep language professional but accessible
- Include specific, actionable recommendations
- If insufficient data: respond with "INSUFFICIENT_DATA_FOR_ANALYSIS"

Generate the complete analysis now:`;

export const linkedinPrompt = (profileData: string) => `
You are analyzing a LinkedIn profile to extract professional information for AI replacement risk assessment.

**LINKEDIN PROFILE DATA:**
${profileData}

**EXTRACTION REQUIREMENTS:**
Extract and structure the following information:

{
  "personalInfo": {
    "name": "full name",
    "currentTitle": "current job title",
    "company": "current company",
    "location": "current location"
  },
  "experience": {
    "yearsTotal": "total years of experience",
    "currentRole": {
      "title": "current position",
      "company": "company name", 
      "duration": "time in current role",
      "description": "role description and responsibilities"
    },
    "previousRoles": [
      {
        "title": "job title",
        "company": "company name",
        "duration": "time period",
        "keyResponsibilities": ["responsibility1", "responsibility2"]
      }
    ]
  },
  "skills": {
    "technical": ["technical skill 1", "technical skill 2"],
    "soft": ["soft skill 1", "soft skill 2"],
    "tools": ["tool 1", "tool 2"],
    "certifications": ["cert 1", "cert 2"]
  },
  "education": [
    {
      "degree": "degree type",
      "field": "field of study", 
      "institution": "school name",
      "year": "graduation year"
    }
  ],
  "dailyTasks": "inferred daily responsibilities based on current and recent roles",
  "careerCategory": "best matching category: designer|product-manager|marketing|accounting|legal|other",
  "companySize": "inferred company size: startup|small|medium|large"
}

Focus on extracting concrete, specific information. If data is missing, mark as "not_available".`;

export const webBrowsePrompt = (linkedinUrl: string) => `
Browse this LinkedIn profile URL and extract comprehensive professional information: ${linkedinUrl}

Focus on:
1. Current job title and company
2. Work experience and career progression  
3. Skills and technical competencies
4. Education and certifications
5. Key responsibilities and achievements
6. Industry and functional area

Return the extracted information in a structured format that can be used for AI replacement risk analysis.`; 