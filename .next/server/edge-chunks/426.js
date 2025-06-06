(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[426],{1873:(e,i,t)=>{"use strict";t.d(i,{U4:()=>r,v1:()=>o});let r=({role:e,tasks:i,resume:t,linkedinData:r,profileData:o})=>`
You are an AI researcher conducting comprehensive analysis of AI automation risk for: ${e}.

**ROLE CONTEXT:**
- Position: ${e}
- Weekly task breakdown: ${JSON.stringify(i)}
- Professional background: ${t?.slice(0,800)}
${r?`- LinkedIn Analysis: ${JSON.stringify(r)}`:""}
${o?`- Additional Profile Data: ${JSON.stringify(o)}`:""}

**CRITICAL REQUIREMENT: REAL SOURCES ONLY**
You must ONLY reference verifiable sources that actually exist. Do not create fake URLs, company names, or statistics. If you cannot find current information, state that research is limited and focus on general AI automation trends you know are accurate.

**RESEARCH REQUIREMENTS:**
For each major task category, provide:
1. **Risk Assessment**: High (actively automated) | Moderate (tools emerging) | Low (human-centric)
2. **Evidence**: Real AI tools/companies you know exist (OpenAI, Anthropic, Microsoft, Google, etc.)
3. **Timeline**: Conservative estimates based on actual technology progress
4. **Sources**: ONLY real URLs you're certain exist, or reference organization names without URLs

**ACCEPTABLE REAL SOURCES:**
- OpenAI, Anthropic, Microsoft, Google official announcements
- McKinsey Global Institute, MIT Technology Review, Stanford AI Index
- Bureau of Labor Statistics, World Economic Forum reports
- Major tech publications (TechCrunch, Wired, MIT Technology Review)
- If uncertain about URLs, use format: "Organization Name Research" instead

**OUTPUT FORMAT - RETURN VALID JSON ONLY:**
{
  "taskFacts": [
    {
      "task": "specific task from their role",
      "riskLevel": "High|Moderate|Low", 
      "evidence": "real AI tools/companies affecting this (actual names only)",
      "impact": "conservative automation percentage estimate",
      "timeline": "realistic timeframe for significant impact",
      "sourceUrl": "real URL only if certain it exists, otherwise 'Industry research'",
      "toolsExample": "actual AI tools/platforms you know exist"
    }
  ],
  "macroStats": [
    {
      "statistic": "verifiable industry data or conservative estimates",
      "source": "real research organization name",
      "url": "real URL only if certain, otherwise 'Industry research reports'",
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

Focus on concrete developments with real companies/tools. Be conservative with estimates. Quality over quantity - fewer real sources is better than many fake ones.`,o=(e,i)=>`
You are an expert AI risk analyst conducting a comprehensive, personalized career assessment. Use O3-style step-by-step reasoning to analyze this specific professional's unique situation.

**INPUT DATA:** ${e}

**USER PROFILE CONTEXT:**
${i?`
- Role: ${i.role}
- Experience Level: ${i.yearsExperience}
- Company Size: ${i.companySize||"Not specified"}
- Daily Work Summary: ${i.dailyWorkSummary?.slice(0,500)}
- Key Skills: ${i.keySkills||"Not specified"}
- Resume/Background: ${i.resume?.slice(0,800)}
- LinkedIn Profile: ${i.linkedinData?"Analyzed":"Not provided"}
`:"Limited profile data available"}

**REASONING METHODOLOGY:**
Apply step-by-step analysis with explicit reasoning traces:

1. **Profile Analysis**: Examine the user's specific background, skills, and current role
2. **Task Mapping**: Map their daily work to automation risk categories
3. **Evidence Evaluation**: Assess research evidence against their specific context
4. **Risk Calculation**: Apply weighted scoring based on their actual task distribution
5. **Personalized Recommendations**: Generate advice specific to their career stage and skills

**SCORING FORMULA:**
Calculate risk score: S = Σ(task_hours \xd7 risk_weight) / total_hours \xd7 100
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

## 90-Day Action Plan
### Phase 1: Immediate Actions (Days 1-30)
**Skill Assessment & Foundation Building:**
1. **Audit Current Skills**: Create inventory of technical and soft skills
   - Complete LinkedIn Skills Assessment in [relevant areas]
   - Use tools like [specific skill assessment platforms for their field]
   - Document current proficiency levels

2. **AI Tool Familiarization**: 
   - Start using [specific AI tools relevant to their role] daily
   - Take free courses on [platform recommendations]
   - Join [specific communities/forums for their field]

3. **Network Activation**:
   - Reach out to 5 professionals in AI-adjacent roles in your industry
   - Join [specific professional groups/communities]
   - Attend [relevant virtual events/webinars]

**Resources:**
- [LinkedIn Learning: Specific courses for their role]
- [Coursera: AI specializations for their industry]
- [Industry-specific forums and communities]

### Phase 2: Skill Development (Days 31-60)
**Strategic Capability Building:**
1. **Core Competency Enhancement**:
   - Enroll in [specific certification program]
   - Practice [high-value skills that are harder to automate]
   - Build portfolio showcasing [strategic thinking/creativity]

2. **AI Collaboration Skills**:
   - Learn prompt engineering for [their field]
   - Understand AI limitations in [their area]
   - Develop human-AI workflow optimization

3. **Industry Intelligence**:
   - Subscribe to [industry-specific AI newsletters]
   - Follow key thought leaders: [specific names for their field]
   - Monitor job postings for evolving skill requirements

**Resources:**
- [Professional certification programs]
- [Industry-specific training platforms]
- [Thought leader recommendations and resources]

### Phase 3: Strategic Positioning (Days 61-90)
**Career Future-Proofing:**
1. **Specialized Expertise Development**:
   - Focus on [specific niche areas with lower AI risk]
   - Develop expertise in [human-centric aspects of their role]
   - Create thought leadership content

2. **Strategic Networking**:
   - Establish mentorship relationships
   - Speak at [industry events/webinars]
   - Share insights on [professional platforms]

3. **Portfolio/Profile Enhancement**:
   - Update LinkedIn with new skills and AI knowledge
   - Create case studies showing AI-human collaboration
   - Develop personal brand around [strategic positioning]

**Resources:**
- [Speaking opportunities platforms]
- [Content creation tools and platforms]
- [Personal branding resources]

## Skill Development Roadmap
### Core Skills to Develop (Priority Order)
1. **AI Collaboration & Prompt Engineering**
   - **What**: Learn to effectively work with AI tools
   - **Why**: Essential for staying relevant in AI-augmented workflows
   - **How**: 
     - Complete [specific prompt engineering course]
     - Practice with [relevant AI tools for their role]
     - Join [prompt engineering communities]
   - **Timeline**: 2-4 weeks
   - **Resources**: 
     - [OpenAI Prompt Engineering Guide]
     - [Specific course recommendations]
     - [Tool-specific tutorials]

2. **[Role-Specific Strategic Skill]**
   - **What**: [Specific skill that leverages human judgment]
   - **Why**: [Explanation of why this skill remains valuable]
   - **How**: [Specific learning path and resources]
   - **Timeline**: [Realistic timeframe]
   - **Resources**: [Specific courses, books, platforms]

3. **Data Analysis & Interpretation**
   - **What**: Understanding and interpreting AI-generated insights
   - **Why**: Critical for making strategic decisions with AI assistance
   - **How**: [Learning path specific to their role]
   - **Timeline**: 4-6 weeks
   - **Resources**: [Specific analytics courses and tools]

4. **[Industry-Specific Future Skill]**
   - **What**: [Emerging skill in their field]
   - **Why**: [Future market demand]
   - **How**: [Specific development approach]
   - **Timeline**: [Timeline]
   - **Resources**: [Specific resources]

### Learning Resources & Platforms
**Free Resources:**
- [Coursera: Specific free courses for their field]
- [edX: Relevant specializations]
- [YouTube: Curated channel recommendations]
- [Podcasts: Industry-specific shows]

**Paid Resources (High ROI):**
- [Professional certification programs]
- [Premium learning platforms]
- [Industry conferences and workshops]
- [Mentorship programs]

**Books & Reading:**
- [5-7 specific book recommendations for their field]
- [Industry reports and whitepapers]
- [Research publications relevant to AI in their sector]

### Skill Measurement & Progress Tracking
**Monthly Assessments:**
- Complete skill assessments on [specific platforms]
- Track project outcomes using new skills
- Gather feedback from colleagues/supervisors
- Update professional profiles with new competencies

**Success Metrics:**
- [Specific, measurable goals for their role]
- Portfolio projects demonstrating new capabilities
- Recognition or feedback from industry peers
- Job market competitiveness indicators

## Professional Development Network
### Key Communities to Join
1. **[Industry-Specific AI Groups]**
   - LinkedIn: [Specific group names]
   - Discord/Slack: [Community recommendations]
   - Reddit: [Relevant subreddits]

2. **Skill-Specific Communities**
   - [Communities for emerging skills in their field]
   - [Professional associations adapting to AI]

3. **Thought Leadership Platforms**
   - [Where to share insights and build reputation]
   - [Speaking opportunity platforms]

### Mentorship & Guidance
**Finding Mentors:**
- [Platforms for finding industry mentors]
- [Networking strategies for their field]
- [Professional associations with mentorship programs]

**Reverse Mentoring:**
- Mentor others in traditional skills while learning AI
- Knowledge exchange opportunities
- Building leadership reputation

## Implementation Timeline
### Month 1: Foundation
- Complete initial skill assessments
- Begin AI tool familiarization
- Join key professional communities
- Start first priority skill development

### Month 2: Development  
- Deepen technical skill development
- Begin strategic networking
- Apply learnings to current role
- Measure progress and adjust

### Month 3: Positioning
- Showcase new capabilities
- Establish thought leadership
- Expand professional network
- Plan long-term career strategy

### Months 4-6: Advanced Development
- [Extended roadmap for continued growth]
- [Advanced skill development areas]
- [Leadership opportunity development]
- [Industry contribution goals]

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

Generate the complete personalized analysis now:`},6487:()=>{},8335:()=>{},9358:(e,i,t)=>{"use strict";t.r(i),t.d(i,{POST:()=>p,maxDuration:()=>l,runtime:()=>a});var r=t(974),o=t(7817),n=t(169),s=t(1873);let a="edge",l=800;function c(e){return e?e.replace(/\0/g,"").normalize("NFC").substring(0,5e4):""}async function p(e){console.log("\uD83D\uDD2C [Analyze API] Starting analysis request...");try{let i=await e.json();console.log("\uD83D\uDCCB [Analyze API] Request body keys:",Object.keys(i)),console.log("\uD83D\uDCCB [Analyze API] Profile ID:",i.profile_id),console.log("\uD83D\uDCCB [Analyze API] Evidence type:",typeof i.evidence);let{profile_id:t,evidence:a}=i;if(!t)return console.error("❌ [Analyze API] Missing profile_id"),r.Rp.json({error:"Profile ID is required"},{status:400});if(!a)return console.error("❌ [Analyze API] Missing evidence"),r.Rp.json({error:"Evidence is required"},{status:400});console.log("\uD83D\uDD17 [Analyze API] Creating Supabase client...");let l=(0,o.UU)(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);console.log("✅ [Analyze API] Supabase client created"),console.log("\uD83D\uDC64 [Analyze API] Fetching user profile data...");let{data:p,error:d}=await l.from("profiles").select("*").eq("id",t).single();if(d)return console.error("❌ [Analyze API] Error fetching profile:",d),r.Rp.json({error:"Profile not found"},{status:404});console.log("✅ [Analyze API] Profile data fetched:",{role:p.role,hasResume:!!p.resume,taskCount:Object.keys(p.task_hours||{}).length,hasProfileData:!!p.profile_data,hasLinkedinData:!!p.linkedin_data});let u={role:p.role,resume:p.resume,taskHours:p.task_hours,yearsExperience:p.profile_data?.yearsExperience,companySize:p.profile_data?.companySize,dailyWorkSummary:p.profile_data?.dailyWorkSummary,keySkills:p.profile_data?.keySkills,careerCategory:p.profile_data?.careerCategory,linkedinUrl:p.profile_data?.linkedinUrl,linkedinData:p.linkedin_data,createdAt:p.created_at};console.log("\uD83E\uDD16 [Analyze API] Creating OpenAI client...");let m=new n.Ay({apiKey:process.env.OPENAI_API_KEY,timeout:3e5});console.log("\uD83D\uDCDD [Analyze API] Generating enhanced analysis prompt with user context...");let f=(0,s.v1)(JSON.stringify(a),u);console.log("\uD83D\uDCC4 [Analyze API] Enhanced prompt length:",f.length),console.log("\uD83D\uDE80 [Analyze API] Calling OpenAI Responses API with Web Search + Enhanced Parsing...");let h=await m.responses.create({model:"gpt-4.1",tools:[{type:"web_search_preview"}],input:[{role:"user",content:[{type:"input_text",text:`${f}

**ENHANCED ANALYSIS WITH WEB SEARCH:**
Use web search to find the most current information to enhance this personalized career risk analysis:

1. Search for latest 2024-2025 developments in AI automation for: "${u.role}"
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

Ensure both sections incorporate current web search findings for accuracy and relevance.`}]}]});console.log("✅ [Analyze API] OpenAI response received with web search + enhanced parsing");let g=h.output_text;if(!g)return console.error("❌ [Analyze API] No response content received from analysis"),r.Rp.json({error:"No analysis response received"},{status:500});console.log("\uD83D\uDD27 [Analyze API] Splitting response into preview and full report...");let[y,k]=g.split("---FULL_REPORT---");console.log("\uD83D\uDCC4 [Analyze API] Preview length:",y?.length),console.log("\uD83D\uDCC4 [Analyze API] Full report length:",k?.length);let A=c(y?.trim()||"Analysis preview not available"),v=c(k?.trim()||"Full report not available");console.log("\uD83E\uDDEE [Analyze API] Calculating risk score...");let I=function(e){if(!e||!e.taskFacts)return 0;let i=0,t=0;for(let r of e.taskFacts){let e=r.hours||1,o=0;switch(r.riskRating){case"High":o=1;break;case"Moderate":o=.6;break;case"Low":o=.3;break;default:o=.5}i+=e*o,t+=e}return 0===t?0:Math.round(i/t*100)}(a);console.log("\uD83D\uDCCA [Analyze API] Calculated score:",I),console.log("\uD83D\uDCBE [Analyze API] Saving report to database...");let{data:S,error:w}=await l.from("reports").insert([{profile_id:t,score:I,preview:A,full_report:v,evidence:a}]).select().single();if(w)return console.error("❌ [Analyze API] Database error:",w),r.Rp.json({error:"Database error: "+w.message},{status:500});return console.log("✅ [Analyze API] Report saved successfully:",S?.id),console.log("✅ [Analyze API] Analysis completed successfully"),r.Rp.json({ok:!0,report_id:S?.id})}catch(e){return console.error("\uD83D\uDCA5 [Analyze API] Unexpected error:",e),console.error("\uD83D\uDCDA [Analyze API] Error stack:",e instanceof Error?e.stack:"No stack trace"),r.Rp.json({error:"Analysis failed: "+(e instanceof Error?e.message:String(e))},{status:500})}}}}]);
//# sourceMappingURL=426.js.map