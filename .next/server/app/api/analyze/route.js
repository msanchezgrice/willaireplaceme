(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[786],{1873:(e,i,t)=>{"use strict";t.d(i,{U4:()=>r,v1:()=>o});let r=({role:e,tasks:i,resume:t})=>`
You are an AI researcher conducting a comprehensive analysis of AI automation risk for the role: ${e}.

**ROLE CONTEXT:**
- Position: ${e}
- Weekly task breakdown: ${JSON.stringify(i)}
- Professional background: ${t?.slice(0,800)}

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

Focus on concrete, recent developments with credible sources. Avoid speculation.`,o=(e,i)=>`
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

Generate the complete personalized analysis now:`},2530:(e,i,t)=>{"use strict";t.r(i),t.d(i,{ComponentMod:()=>x,default:()=>w});var r,o={};t.r(o),t.d(o,{POST:()=>k,runtime:()=>h});var a={};t.r(a),t.d(a,{patchFetch:()=>R,routeModule:()=>v,serverHooks:()=>I,workAsyncStorage:()=>A,workUnitAsyncStorage:()=>S});var s=t(8429),n=t(9874),l=t(8294),c=t(6567),p=t(4144),d=t(5421),u=t(9079),f=t(7817),m=t(169),g=t(1873);let h="edge";function y(e){return e?e.replace(/\0/g,"").normalize("NFC").substring(0,5e4):""}async function k(e){console.log("\uD83D\uDD2C [Analyze API] Starting analysis request...");try{let i=await e.json();console.log("\uD83D\uDCCB [Analyze API] Request body keys:",Object.keys(i)),console.log("\uD83D\uDCCB [Analyze API] Profile ID:",i.profile_id),console.log("\uD83D\uDCCB [Analyze API] Evidence type:",typeof i.evidence);let{profile_id:t,evidence:r}=i;if(!t)return console.error("❌ [Analyze API] Missing profile_id"),u.Rp.json({error:"Profile ID is required"},{status:400});if(!r)return console.error("❌ [Analyze API] Missing evidence"),u.Rp.json({error:"Evidence is required"},{status:400});console.log("\uD83D\uDD17 [Analyze API] Creating Supabase client...");let o=(0,f.UU)(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);console.log("✅ [Analyze API] Supabase client created"),console.log("\uD83D\uDC64 [Analyze API] Fetching user profile data...");let{data:a,error:s}=await o.from("profiles").select("*").eq("id",t).single();if(s)return console.error("❌ [Analyze API] Error fetching profile:",s),u.Rp.json({error:"Profile not found"},{status:404});console.log("✅ [Analyze API] Profile data fetched:",{role:a.role,hasResume:!!a.resume,taskCount:Object.keys(a.task_hours||{}).length,hasProfileData:!!a.profile_data,hasLinkedinData:!!a.linkedin_data});let n={role:a.role,resume:a.resume,taskHours:a.task_hours,yearsExperience:a.profile_data?.yearsExperience,companySize:a.profile_data?.companySize,dailyWorkSummary:a.profile_data?.dailyWorkSummary,keySkills:a.profile_data?.keySkills,careerCategory:a.profile_data?.careerCategory,linkedinUrl:a.profile_data?.linkedinUrl,linkedinData:a.linkedin_data,createdAt:a.created_at};console.log("\uD83E\uDD16 [Analyze API] Creating OpenAI client...");let l=new m.Ay({apiKey:process.env.OPENAI_API_KEY,timeout:6e4});console.log("\uD83D\uDCDD [Analyze API] Generating enhanced analysis prompt with user context...");let c=(0,g.v1)(JSON.stringify(r),n);console.log("\uD83D\uDCC4 [Analyze API] Enhanced prompt length:",c.length),console.log("\uD83D\uDE80 [Analyze API] Calling OpenAI API (gpt-4o model)...");let p=await l.chat.completions.create({model:"gpt-4o",temperature:0,messages:[{role:"system",content:c}]});console.log("✅ [Analyze API] OpenAI response received"),console.log("\uD83D\uDCCA [Analyze API] Response usage:",p.usage);let d=p.choices[0].message.content;if(console.log("\uD83D\uDCC4 [Analyze API] Response content length:",d?.length),!d)return console.error("❌ [Analyze API] Empty response from OpenAI"),u.Rp.json({error:"Empty analysis response"},{status:500});console.log("\uD83D\uDD27 [Analyze API] Splitting response into preview and full report...");let[h,k]=d.split("---FULL_REPORT---");console.log("\uD83D\uDCC4 [Analyze API] Preview length:",h?.length),console.log("\uD83D\uDCC4 [Analyze API] Full report length:",k?.length);let v=y(h?.trim()||"Analysis preview not available"),A=y(k?.trim()||"Full report not available");console.log("\uD83E\uDDEE [Analyze API] Calculating risk score...");let S=function(e){if(!e||!e.taskFacts)return 0;let i=0,t=0;for(let r of e.taskFacts){let e=r.hours||1,o=0;switch(r.riskRating){case"High":o=1;break;case"Moderate":o=.6;break;case"Low":o=.3;break;default:o=.5}i+=e*o,t+=e}return 0===t?0:Math.round(i/t*100)}(r);console.log("\uD83D\uDCCA [Analyze API] Calculated score:",S),console.log("\uD83D\uDCBE [Analyze API] Saving report to database...");let{data:I,error:R}=await o.from("reports").insert([{profile_id:t,score:S,preview:v,full_report:A,evidence:r}]).select().single();if(R)return console.error("❌ [Analyze API] Database error:",R),u.Rp.json({error:"Database error: "+R.message},{status:500});return console.log("✅ [Analyze API] Report saved successfully:",I?.id),console.log("✅ [Analyze API] Analysis completed successfully"),u.Rp.json({ok:!0,report_id:I?.id})}catch(e){return console.error("\uD83D\uDCA5 [Analyze API] Unexpected error:",e),console.error("\uD83D\uDCDA [Analyze API] Error stack:",e instanceof Error?e.stack:"No stack trace"),u.Rp.json({error:"Analysis failed: "+(e instanceof Error?e.message:String(e))},{status:500})}}let v=new c.AppRouteRouteModule({definition:{kind:p.A.APP_ROUTE,page:"/api/analyze/route",pathname:"/api/analyze",filename:"route",bundlePath:"app/api/analyze/route"},resolvedPagePath:"/Users/miguel/Downloads/AICareerShield/app/api/analyze/route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:A,workUnitAsyncStorage:S,serverHooks:I}=v;function R(){return(0,d.V5)({workAsyncStorage:A,workUnitAsyncStorage:S})}let b=null==(r=self.__RSC_MANIFEST)?void 0:r["/api/analyze/route"],P=(e=>e?JSON.parse(e):void 0)(self.__RSC_SERVER_MANIFEST);b&&P&&(0,n.fQ)({page:"/api/analyze/route",clientReferenceManifest:b,serverActionsManifest:P,serverModuleMap:(0,s.e)({serverActionsManifest:P})});let x=a,w=l.s.wrap(v,{nextConfig:{env:{},webpack:null,eslint:{ignoreDuringBuilds:!1},typescript:{ignoreBuildErrors:!1,tsconfigPath:"tsconfig.json"},distDir:".next",cleanDistDir:!0,assetPrefix:"",cacheMaxMemorySize:0x3200000,configOrigin:"next.config.js",useFileSystemPublicRoutes:!0,generateEtags:!0,pageExtensions:["tsx","ts","jsx","js"],poweredByHeader:!0,compress:!0,images:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:60,formats:["image/webp"],dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",remotePatterns:[],unoptimized:!1},devIndicators:{position:"bottom-left"},onDemandEntries:{maxInactiveAge:6e4,pagesBufferLength:5},amp:{canonicalBase:""},basePath:"",sassOptions:{},trailingSlash:!1,i18n:null,productionBrowserSourceMaps:!1,excludeDefaultMomentLocales:!0,serverRuntimeConfig:{},publicRuntimeConfig:{},reactProductionProfiling:!1,reactStrictMode:null,reactMaxHeadersLength:6e3,httpAgentOptions:{keepAlive:!0},logging:{},expireTime:31536e3,staticPageGenerationTimeout:60,modularizeImports:{"@mui/icons-material":{transform:"@mui/icons-material/{{member}}"},lodash:{transform:"lodash/{{member}}"}},outputFileTracingRoot:"/Users/miguel/Downloads/AICareerShield",experimental:{nodeMiddleware:!1,cacheLife:{default:{stale:300,revalidate:900,expire:0xfffffffe},seconds:{stale:0,revalidate:1,expire:60},minutes:{stale:300,revalidate:60,expire:3600},hours:{stale:300,revalidate:3600,expire:86400},days:{stale:300,revalidate:86400,expire:604800},weeks:{stale:300,revalidate:604800,expire:2592e3},max:{stale:300,revalidate:2592e3,expire:0xfffffffe}},cacheHandlers:{},cssChunking:!0,multiZoneDraftMode:!1,appNavFailHandling:!1,prerenderEarlyExit:!0,serverMinification:!0,serverSourceMaps:!1,linkNoTouchStart:!1,caseSensitiveRoutes:!1,clientSegmentCache:!1,dynamicOnHover:!1,preloadEntriesOnStart:!0,clientRouterFilter:!0,clientRouterFilterRedirects:!1,fetchCacheKeyPrefix:"",middlewarePrefetch:"flexible",optimisticClientCache:!0,manualClientBasePath:!1,cpus:13,memoryBasedWorkersCount:!1,imgOptConcurrency:null,imgOptTimeoutInSeconds:7,imgOptMaxInputPixels:0xfff8001,imgOptSequentialRead:null,isrFlushToDisk:!0,workerThreads:!1,optimizeCss:!1,nextScriptWorkers:!1,scrollRestoration:!1,externalDir:!1,disableOptimizedLoading:!1,gzipSize:!0,craCompat:!1,esmExternals:!0,fullySpecified:!1,swcTraceProfiling:!1,forceSwcTransforms:!1,largePageDataBytes:128e3,typedRoutes:!1,typedEnv:!1,parallelServerCompiles:!1,parallelServerBuildTraces:!1,ppr:!1,authInterrupts:!1,webpackMemoryOptimizations:!1,optimizeServerReact:!0,useEarlyImport:!1,viewTransition:!1,routerBFCache:!1,staleTimes:{dynamic:0,static:300},serverComponentsHmrCache:!0,staticGenerationMaxConcurrency:8,staticGenerationMinPagesPerWorker:25,dynamicIO:!1,inlineCss:!1,useCache:!1,optimizePackageImports:["lucide-react","date-fns","lodash-es","ramda","antd","react-bootstrap","ahooks","@ant-design/icons","@headlessui/react","@headlessui-float/react","@heroicons/react/20/solid","@heroicons/react/24/solid","@heroicons/react/24/outline","@visx/visx","@tremor/react","rxjs","@mui/material","@mui/icons-material","recharts","react-use","effect","@effect/schema","@effect/platform","@effect/platform-node","@effect/platform-browser","@effect/platform-bun","@effect/sql","@effect/sql-mssql","@effect/sql-mysql2","@effect/sql-pg","@effect/sql-squlite-node","@effect/sql-squlite-bun","@effect/sql-squlite-wasm","@effect/sql-squlite-react-native","@effect/rpc","@effect/rpc-http","@effect/typeclass","@effect/experimental","@effect/opentelemetry","@material-ui/core","@material-ui/icons","@tabler/icons-react","mui-core","react-icons/ai","react-icons/bi","react-icons/bs","react-icons/cg","react-icons/ci","react-icons/di","react-icons/fa","react-icons/fa6","react-icons/fc","react-icons/fi","react-icons/gi","react-icons/go","react-icons/gr","react-icons/hi","react-icons/hi2","react-icons/im","react-icons/io","react-icons/io5","react-icons/lia","react-icons/lib","react-icons/lu","react-icons/md","react-icons/pi","react-icons/ri","react-icons/rx","react-icons/si","react-icons/sl","react-icons/tb","react-icons/tfi","react-icons/ti","react-icons/vsc","react-icons/wi"]},htmlLimitedBots:"Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti",bundlePagesRouterDependencies:!1,configFile:"/Users/miguel/Downloads/AICareerShield/next.config.js",configFileName:"next.config.js",serverExternalPackages:["pdf-parse"],turbopack:{root:"/Users/miguel/Downloads/AICareerShield"}}})},5356:e=>{"use strict";e.exports=require("node:buffer")},5521:e=>{"use strict";e.exports=require("node:async_hooks")},6487:()=>{},8335:()=>{}},e=>{var i=i=>e(e.s=i);e.O(0,[319,817,169],()=>i(2530));var t=e.O();(_ENTRIES="undefined"==typeof _ENTRIES?{}:_ENTRIES)["middleware_app/api/analyze/route"]=t}]);
//# sourceMappingURL=route.js.map