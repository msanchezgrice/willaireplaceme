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

export const analysisPrompt = (json: string, userProfile?: any) => `
You are an expert AI risk analyst conducting a comprehensive, personalized career assessment. Use O3-style step-by-step reasoning to analyze this specific professional's unique situation.

**INPUT DATA:** ${json}

**USER PROFILE CONTEXT:**
${userProfile ? `
- Role: ${userProfile.role}
- Experience Level: ${userProfile.yearsExperience}
- Company Size: ${userProfile.companySize || 'Not specified'}
- Daily Work Summary: ${userProfile.dailyWorkSummary?.slice(0, 500)}
- Key Skills: ${userProfile.keySkills || 'Not specified'}
- Resume/Background: ${userProfile.resume?.slice(0, 800)}
- LinkedIn Profile: ${userProfile.linkedinData ? 'Analyzed' : 'Not provided'}
` : 'Limited profile data available'}

**REASONING METHODOLOGY:**
Apply step-by-step analysis with explicit reasoning traces:

1. **Profile Analysis**: Examine the user's specific background, skills, and current role
2. **Task Mapping**: Map their daily work to automation risk categories
3. **Evidence Evaluation**: Assess research evidence against their specific context
4. **Risk Calculation**: Apply weighted scoring based on their actual task distribution
5. **Personalized Recommendations**: Generate advice specific to their career stage and skills

**SCORING FORMULA:**
Calculate risk score: S = Σ(task_hours × risk_weight) / total_hours × 100
- High Risk = 1.0 weight
- Moderate Risk = 0.6 weight  
- Low Risk = 0.3 weight

**OUTPUT REQUIREMENTS:**
Generate exactly two sections separated by "---FULL_REPORT---":

**SECTION 1: PREVIEW (Maximum 300 words)**
Create a polished, professional preview with:
- Opening statement about AI transformation in their specific field/role
- 3-4 key findings directly relevant to their background
- Risk score with interpretation specific to their experience level
- One immediately actionable tip based on their current skills
- Inline citations using [1], [2], etc.

**SECTION 2: FULL REPORT (Comprehensive Markdown)**
Generate a detailed, personalized markdown report with these sections:

## Executive Summary
- Brief overview of findings specific to this professional's background
- How their experience level and company context affects risk
- Key differentiators in their current role

## Personalized Risk Assessment
**Overall Risk Score: [X]/100 ([Risk Level])**

### Your Specific Situation
**Reasoning Trace:**
1. **Current Role Analysis**: [Analyze their specific job title and responsibilities]
2. **Experience Factor**: [How their years of experience affects automation risk]
3. **Company Context**: [How their company size/type impacts risk timeline]
4. **Skill Portfolio**: [Assessment of their current skills vs. automation trends]

### Task-by-Task Analysis
For each of their reported tasks:
- **[Specific Task from their daily work]** - Risk Level: High/Moderate/Low
  - **Your Context**: How you currently perform this task
  - **AI Capabilities**: Current automation tools affecting this work
  - **Timeline**: When this might impact your specific role
  - **Evidence**: Research findings [1]

## Your Career Context Analysis
### Background Assessment
- **Professional Journey**: Analysis of their career progression
- **Current Positioning**: Strengths and vulnerabilities in their role
- **Industry Context**: How their specific industry/company type affects risk

### Skills Gap Analysis
**Your Current Skills vs. Future Needs:**
- **Strengths to Leverage**: Skills that remain valuable
- **Areas for Development**: Specific gaps to address
- **Strategic Advantages**: Unique aspects of their background

## Timeline & Impact Projections
**For Your Specific Role:**

**Immediate (0-12 months):**
- Tools likely to affect your daily work
- Immediate actions based on your current situation

**Medium-term (1-3 years):**
- Changes specific to your role and industry
- Strategic positioning opportunities

**Long-term (3-5 years):**
- Transformation outlook for your career path
- Evolution opportunities based on your background

## Personalized Mitigation Strategies
### High-Priority Actions (Based on Your Profile)
1. **Skill Development**: Specific to your current level and background
2. **Career Positioning**: Leveraging your existing experience
3. **Industry Adaptation**: Relevant to your sector and company type

### Your 90-Day Action Plan
**Immediate Steps (Based on Your Current Role):**
- [Specific actions relevant to their daily work]
- [Skills to start developing given their background]
- [Tools to explore in their current context]

**Medium-term Goals (Leveraging Your Experience):**
- [Career development specific to their experience level]
- [Networking strategies for their industry]
- [Skill certifications relevant to their field]

### Recommended Focus Areas for [Their Role]
- **Technical Skills**: Specific to their reported tools and tasks
- **Strategic Capabilities**: Building on their experience level
- **Industry Knowledge**: Deepening expertise in their sector
- **Leadership/Management**: If appropriate for their experience level

## Market Intelligence for Your Industry
- **Adoption Rates**: In companies similar to theirs
- **Competitive Landscape**: Relevant to their sector
- **Investment Trends**: Affecting their industry specifically

## Evidence-Based Reasoning
### Research Evaluation Process
1. **Relevance Assessment**: How each piece of evidence applies to their situation
2. **Timeline Validation**: Realistic timelines given their industry context
3. **Impact Probability**: Likelihood of affecting their specific role

### Key Findings Interpretation
**For Your Background:**
- [Specific interpretation of research for their role]
- [How general trends apply to their specific situation]
- [Unique factors in their case]

## Strategic Recommendations
### Career Evolution Path
**Building on Your [X] Years of Experience:**
- **Short-term positioning** (6-12 months)
- **Medium-term pivots** (1-2 years)  
- **Long-term strategy** (3-5 years)

### Competitive Differentiation
**Your Unique Value Proposition:**
- How to leverage current experience and skills
- Areas where human expertise remains critical in their field
- Strategic positioning for the AI era

## Sources & References
[1] [Source description with specific relevance to their role] - URL
[2] [Source description] - URL
[etc.]

**CRITICAL REQUIREMENTS:**
- Reference their specific daily tasks, skills, and background throughout
- Make all recommendations contextual to their experience level and industry
- Include step-by-step reasoning for risk assessments
- Provide actionable advice specific to their current situation
- Use their actual job title, company context, and reported skills
- Show clear logical connections between evidence and their specific case
- If insufficient personalization data: note limitations but provide best possible analysis

Generate the complete personalized analysis now:`;

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