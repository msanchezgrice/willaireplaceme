(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[721],{1873:(e,r,i)=>{"use strict";i.d(r,{U4:()=>t,v1:()=>s});let t=({role:e,tasks:r,resume:i})=>`
You are an AI researcher conducting a comprehensive analysis of AI automation risk for the role: ${e}.

**ROLE CONTEXT:**
- Position: ${e}
- Weekly task breakdown: ${JSON.stringify(r)}
- Professional background: ${i?.slice(0,800)}

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

Focus on concrete, recent developments with credible sources. Avoid speculation.`,s=(e,r)=>`
You are an expert AI risk analyst conducting a comprehensive, personalized career assessment. Use O3-style step-by-step reasoning to analyze this specific professional's unique situation.

**INPUT DATA:** ${e}

**USER PROFILE CONTEXT:**
${r?`
- Role: ${r.role}
- Experience Level: ${r.yearsExperience}
- Company Size: ${r.companySize||"Not specified"}
- Daily Work Summary: ${r.dailyWorkSummary?.slice(0,500)}
- Key Skills: ${r.keySkills||"Not specified"}
- Resume/Background: ${r.resume?.slice(0,800)}
- LinkedIn Profile: ${r.linkedinData?"Analyzed":"Not provided"}
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

Generate the complete personalized analysis now:`},2874:(e,r,i)=>{"use strict";i.r(r),i.d(r,{ComponentMod:()=>w,default:()=>E});var t,s={};i.r(s),i.d(s,{POST:()=>I,runtime:()=>g});var o={};i.r(o),i.d(o,{patchFetch:()=>P,routeModule:()=>R,serverHooks:()=>S,workAsyncStorage:()=>v,workUnitAsyncStorage:()=>A});var a=i(8429),n=i(9874),c=i(8294),l=i(6567),d=i(4144),p=i(5421),u=i(9079),f=i(7817),m=i(169),h=i(1873);let g="edge";function y(e){return e?e.replace(/\0/g,"").normalize("NFC").replace(/\\u[0-9a-fA-F]{4}/g,e=>{try{return JSON.parse(`"${e}"`)}catch{return""}}).substring(0,5e4):""}async function k(e,r){console.log("\uD83D\uDD17 [Research API] Analyzing LinkedIn profile:",r);try{let i=(await e.chat.completions.create({model:"gpt-4o",temperature:.1,messages:[{role:"system",content:`You are a professional profile analyzer. I will give you a LinkedIn URL and you need to extract professional information from it. 

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

If you cannot access the profile or extract information, return {"error": "Unable to analyze profile", "reason": "explanation"}.`},{role:"user",content:`Please analyze this LinkedIn profile and extract professional information: ${r}`}]})).choices[0].message.content;if(!i)throw Error("Empty response from LinkedIn analysis");try{let e=JSON.parse(i);return console.log("✅ [Research API] LinkedIn profile analyzed successfully"),e}catch(e){return console.error("❌ [Research API] Failed to parse LinkedIn analysis:",e),console.log("\uD83D\uDCC4 [Research API] Raw response:",i),{error:!1,rawAnalysis:i,extractedInfo:"LinkedIn profile analysis completed but in text format"}}}catch(e){return console.error("❌ [Research API] LinkedIn analysis failed:",e),{error:!0,reason:e instanceof Error?e.message:"Unknown error during LinkedIn analysis"}}}async function I(e){console.log("\uD83D\uDD0D [Research API] Starting request...");try{let r=await e.json();console.log("\uD83D\uDCCB [Research API] Request body:",JSON.stringify(r,null,2));let{role:i,tasks:t,resume:s,linkedinUrl:o,profileData:a}=r;if(!i)return console.error("❌ [Research API] Missing role field"),u.Rp.json({error:"Role is required"},{status:400});let n=y(i),c=y(s||"");console.log("\uD83E\uDDF9 [Research API] Text sanitization complete"),console.log("\uD83D\uDCCF [Research API] Sanitized resume length:",c.length),console.log("\uD83D\uDD17 [Research API] LinkedIn URL provided:",!!o),console.log("\uD83D\uDD17 [Research API] Creating Supabase client...");let l=(0,f.UU)(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);console.log("✅ [Research API] Supabase client created"),console.log("\uD83E\uDD16 [Research API] Creating OpenAI client...");let d=new m.Ay({apiKey:process.env.OPENAI_API_KEY,timeout:15e3}),p=null;if(o&&o.trim()){console.log("\uD83D\uDD17 [Research API] Processing LinkedIn profile...");try{(p=await Promise.race([k(d,o.trim()),new Promise((e,r)=>setTimeout(()=>r(Error("LinkedIn analysis timeout")),1e4))]))&&!p.error?(console.log("✅ [Research API] LinkedIn data extracted successfully"),p.dailyTasks&&(c+=`

LinkedIn Profile Insights:
${p.dailyTasks}`),p.skills&&Array.isArray(p.skills)&&(c+=`

Key Skills: ${p.skills.join(", ")}`),p.careerProgression&&(c+=`

Career Progression: ${p.careerProgression}`),console.log("\uD83D\uDCCF [Research API] Enhanced resume length after LinkedIn:",c.length)):console.log("⚠️ [Research API] LinkedIn analysis failed, continuing without LinkedIn data")}catch(e){console.log("⚠️ [Research API] LinkedIn analysis timeout/error, continuing without LinkedIn data:",e),p=null}}console.log("\uD83D\uDCBE [Research API] Inserting profile into database...");let{data:g,error:I}=await l.from("profiles").insert([{role:n,resume:c,task_hours:t||{},email:null,profile_data:a?{careerCategory:a.careerCategory,yearsExperience:a.yearsExperience,companySize:a.companySize,dailyWorkSummary:a.dailyWorkSummary,keySkills:a.keySkills,linkedinUrl:o}:null,linkedin_data:p&&!p.error?p:null}]).select().single();if(I)return console.error("❌ [Research API] Database error:",I),u.Rp.json({error:"Database error: "+I.message},{status:500});console.log("✅ [Research API] Profile created:",g),console.log("\uD83D\uDCDD [Research API] Starting AI research and analysis...");try{let e=(async()=>{let e;console.log("\uD83D\uDCDD [Research API] Generating research prompt...");let r=(0,h.U4)({role:n,tasks:t,resume:c,linkedinData:p||null,profileData:a||null});console.log("\uD83D\uDCC4 [Research API] Prompt length:",r.length),console.log("\uD83D\uDE80 [Research API] Calling OpenAI API...");let i=await d.chat.completions.create({model:"gpt-4o",temperature:.2,messages:[{role:"system",content:r}]});console.log("✅ [Research API] OpenAI response received"),console.log("\uD83D\uDCCA [Research API] Response usage:",i.usage);let s=i.choices[0].message.content;if(console.log("\uD83D\uDCC4 [Research API] Response content:",s?.substring(0,500)+"..."),!s)throw Error("Empty response from OpenAI");console.log("\uD83D\uDD27 [Research API] Parsing JSON response...");try{e=JSON.parse(s),console.log("✅ [Research API] JSON parsed successfully"),p&&!p.error&&(e.linkedinProfile=p)}catch(e){throw console.error("❌ [Research API] JSON parse error:",e),console.log("\uD83D\uDCC4 [Research API] Raw content that failed to parse:",s),e}console.log("\uD83D\uDD25 [Research API] Calling analyze API directly...");let o=`${process.env.NEXT_PUBLIC_SITE_URL}/api/analyze`;console.log("\uD83C\uDFAF [Research API] Analysis URL:",o);let l=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile_id:g.id,evidence:e})});if(!l.ok){let e=await l.text();throw console.error("❌ [Research API] Analysis failed:",l.status,e),Error(`Analysis API failed: ${l.status} ${e}`)}let u=await l.json();return console.log("✅ [Research API] Analysis completed successfully:",u),u})();await Promise.race([e,new Promise((e,r)=>setTimeout(()=>r(Error("Analysis timeout after 30 seconds")),3e4))]),console.log("✅ [Research API] Full analysis pipeline completed")}catch(e){console.error("\uD83D\uDCA5 [Research API] Analysis failed:",e),console.log("⚠️ [Research API] Continuing despite analysis failure")}return console.log("✅ [Research API] Request completed successfully"),u.Rp.json({status:"processing",profile_id:g.id,message:"Analysis started, results will be available shortly"})}catch(e){return console.error("\uD83D\uDCA5 [Research API] Unexpected error:",e),console.error("\uD83D\uDCDA [Research API] Error stack:",e instanceof Error?e.stack:"No stack trace"),u.Rp.json({error:"Internal server error: "+(e instanceof Error?e.message:String(e))},{status:500})}}let R=new l.AppRouteRouteModule({definition:{kind:d.A.APP_ROUTE,page:"/api/research/route",pathname:"/api/research",filename:"route",bundlePath:"app/api/research/route"},resolvedPagePath:"/Users/miguel/Downloads/AICareerShield/app/api/research/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:v,workUnitAsyncStorage:A,serverHooks:S}=R;function P(){return(0,p.V5)({workAsyncStorage:v,workUnitAsyncStorage:A})}let b=null==(t=self.__RSC_MANIFEST)?void 0:t["/api/research/route"],x=(e=>e?JSON.parse(e):void 0)(self.__RSC_SERVER_MANIFEST);b&&x&&(0,n.fQ)({page:"/api/research/route",clientReferenceManifest:b,serverActionsManifest:x,serverModuleMap:(0,a.e)({serverActionsManifest:x})});let w=o,E=c.s.wrap(R,{nextConfig:{env:{},webpack:null,eslint:{ignoreDuringBuilds:!1},typescript:{ignoreBuildErrors:!1,tsconfigPath:"tsconfig.json"},distDir:".next",cleanDistDir:!0,assetPrefix:"",cacheMaxMemorySize:0x3200000,configOrigin:"next.config.js",useFileSystemPublicRoutes:!0,generateEtags:!0,pageExtensions:["tsx","ts","jsx","js"],poweredByHeader:!0,compress:!0,images:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:60,formats:["image/webp"],dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",remotePatterns:[],unoptimized:!1},devIndicators:{position:"bottom-left"},onDemandEntries:{maxInactiveAge:6e4,pagesBufferLength:5},amp:{canonicalBase:""},basePath:"",sassOptions:{},trailingSlash:!1,i18n:null,productionBrowserSourceMaps:!1,excludeDefaultMomentLocales:!0,serverRuntimeConfig:{},publicRuntimeConfig:{},reactProductionProfiling:!1,reactStrictMode:null,reactMaxHeadersLength:6e3,httpAgentOptions:{keepAlive:!0},logging:{},expireTime:31536e3,staticPageGenerationTimeout:60,modularizeImports:{"@mui/icons-material":{transform:"@mui/icons-material/{{member}}"},lodash:{transform:"lodash/{{member}}"}},outputFileTracingRoot:"/Users/miguel/Downloads/AICareerShield",experimental:{nodeMiddleware:!1,cacheLife:{default:{stale:300,revalidate:900,expire:0xfffffffe},seconds:{stale:0,revalidate:1,expire:60},minutes:{stale:300,revalidate:60,expire:3600},hours:{stale:300,revalidate:3600,expire:86400},days:{stale:300,revalidate:86400,expire:604800},weeks:{stale:300,revalidate:604800,expire:2592e3},max:{stale:300,revalidate:2592e3,expire:0xfffffffe}},cacheHandlers:{},cssChunking:!0,multiZoneDraftMode:!1,appNavFailHandling:!1,prerenderEarlyExit:!0,serverMinification:!0,serverSourceMaps:!1,linkNoTouchStart:!1,caseSensitiveRoutes:!1,clientSegmentCache:!1,dynamicOnHover:!1,preloadEntriesOnStart:!0,clientRouterFilter:!0,clientRouterFilterRedirects:!1,fetchCacheKeyPrefix:"",middlewarePrefetch:"flexible",optimisticClientCache:!0,manualClientBasePath:!1,cpus:13,memoryBasedWorkersCount:!1,imgOptConcurrency:null,imgOptTimeoutInSeconds:7,imgOptMaxInputPixels:0xfff8001,imgOptSequentialRead:null,isrFlushToDisk:!0,workerThreads:!1,optimizeCss:!1,nextScriptWorkers:!1,scrollRestoration:!1,externalDir:!1,disableOptimizedLoading:!1,gzipSize:!0,craCompat:!1,esmExternals:!0,fullySpecified:!1,swcTraceProfiling:!1,forceSwcTransforms:!1,largePageDataBytes:128e3,typedRoutes:!1,typedEnv:!1,parallelServerCompiles:!1,parallelServerBuildTraces:!1,ppr:!1,authInterrupts:!1,webpackMemoryOptimizations:!1,optimizeServerReact:!0,useEarlyImport:!1,viewTransition:!1,routerBFCache:!1,staleTimes:{dynamic:0,static:300},serverComponentsHmrCache:!0,staticGenerationMaxConcurrency:8,staticGenerationMinPagesPerWorker:25,dynamicIO:!1,inlineCss:!1,useCache:!1,optimizePackageImports:["lucide-react","date-fns","lodash-es","ramda","antd","react-bootstrap","ahooks","@ant-design/icons","@headlessui/react","@headlessui-float/react","@heroicons/react/20/solid","@heroicons/react/24/solid","@heroicons/react/24/outline","@visx/visx","@tremor/react","rxjs","@mui/material","@mui/icons-material","recharts","react-use","effect","@effect/schema","@effect/platform","@effect/platform-node","@effect/platform-browser","@effect/platform-bun","@effect/sql","@effect/sql-mssql","@effect/sql-mysql2","@effect/sql-pg","@effect/sql-squlite-node","@effect/sql-squlite-bun","@effect/sql-squlite-wasm","@effect/sql-squlite-react-native","@effect/rpc","@effect/rpc-http","@effect/typeclass","@effect/experimental","@effect/opentelemetry","@material-ui/core","@material-ui/icons","@tabler/icons-react","mui-core","react-icons/ai","react-icons/bi","react-icons/bs","react-icons/cg","react-icons/ci","react-icons/di","react-icons/fa","react-icons/fa6","react-icons/fc","react-icons/fi","react-icons/gi","react-icons/go","react-icons/gr","react-icons/hi","react-icons/hi2","react-icons/im","react-icons/io","react-icons/io5","react-icons/lia","react-icons/lib","react-icons/lu","react-icons/md","react-icons/pi","react-icons/ri","react-icons/rx","react-icons/si","react-icons/sl","react-icons/tb","react-icons/tfi","react-icons/ti","react-icons/vsc","react-icons/wi"]},htmlLimitedBots:"Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti",bundlePagesRouterDependencies:!1,configFile:"/Users/miguel/Downloads/AICareerShield/next.config.js",configFileName:"next.config.js",serverExternalPackages:["pdf-parse"],turbopack:{root:"/Users/miguel/Downloads/AICareerShield"}}})},5356:e=>{"use strict";e.exports=require("node:buffer")},5521:e=>{"use strict";e.exports=require("node:async_hooks")},6487:()=>{},8335:()=>{}},e=>{var r=r=>e(e.s=r);e.O(0,[319,817,169],()=>r(2874));var i=e.O();(_ENTRIES="undefined"==typeof _ENTRIES?{}:_ENTRIES)["middleware_app/api/research/route"]=i}]);
//# sourceMappingURL=route.js.map