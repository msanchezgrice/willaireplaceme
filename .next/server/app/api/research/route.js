(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[721],{1873:(e,r,t)=>{"use strict";t.d(r,{U4:()=>s,v1:()=>i});let s=({role:e,tasks:r,resume:t})=>`
You are an AI researcher conducting a comprehensive analysis of AI automation risk for the role: ${e}.

**ROLE CONTEXT:**
- Position: ${e}
- Weekly task breakdown: ${JSON.stringify(r)}
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

Focus on concrete, recent developments with credible sources. Avoid speculation.`,i=e=>`
You are an expert AI risk analyst generating a comprehensive career assessment report.

**INPUT DATA:** ${e}

**SCORING FORMULA:**
Calculate risk score: S = Σ(task_hours \xd7 risk_weight) / total_hours \xd7 100
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

Generate the complete analysis now:`},2874:(e,r,t)=>{"use strict";t.r(r),t.d(r,{ComponentMod:()=>E,default:()=>T});var s,i={};t.r(i),t.d(i,{POST:()=>A,runtime:()=>h});var a={};t.r(a),t.d(a,{patchFetch:()=>b,routeModule:()=>k,serverHooks:()=>v,workAsyncStorage:()=>P,workUnitAsyncStorage:()=>S});var o=t(8429),n=t(9874),c=t(8294),l=t(6567),d=t(4144),p=t(5421),u=t(9079),f=t(7817),m=t(169),g=t(1873);let h="edge";function y(e){return e?e.replace(/\0/g,"").normalize("NFC").replace(/\\u[0-9a-fA-F]{4}/g,e=>{try{return JSON.parse(`"${e}"`)}catch{return""}}).substring(0,5e4):""}async function I(e,r){console.log("\uD83D\uDD17 [Research API] Analyzing LinkedIn profile:",r);try{let t=(await e.chat.completions.create({model:"gpt-4o",temperature:.1,messages:[{role:"system",content:`You are a professional profile analyzer. I will give you a LinkedIn URL and you need to extract professional information from it. 

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

If you cannot access the profile or extract information, return {"error": "Unable to analyze profile", "reason": "explanation"}.`},{role:"user",content:`Please analyze this LinkedIn profile and extract professional information: ${r}`}]})).choices[0].message.content;if(!t)throw Error("Empty response from LinkedIn analysis");try{let e=JSON.parse(t);return console.log("✅ [Research API] LinkedIn profile analyzed successfully"),e}catch(e){return console.error("❌ [Research API] Failed to parse LinkedIn analysis:",e),console.log("\uD83D\uDCC4 [Research API] Raw response:",t),{error:!1,rawAnalysis:t,extractedInfo:"LinkedIn profile analysis completed but in text format"}}}catch(e){return console.error("❌ [Research API] LinkedIn analysis failed:",e),{error:!0,reason:e instanceof Error?e.message:"Unknown error during LinkedIn analysis"}}}async function R(e,r){console.log("\uD83D\uDD25 [Research API] Starting direct analysis trigger...");try{let t=`${process.env.NEXT_PUBLIC_SITE_URL}/api/analyze`;console.log("\uD83C\uDFAF [Research API] Analysis URL:",t);let s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile_id:e,evidence:r})});if(!s.ok){let e=await s.text();throw console.error("❌ [Research API] Analysis failed:",s.status,e),Error(`Analysis failed: ${s.status} ${e}`)}let i=await s.json();return console.log("✅ [Research API] Analysis triggered successfully:",i),i}catch(e){throw console.error("\uD83D\uDCA5 [Research API] Analysis trigger error:",e),e}}async function A(e){console.log("\uD83D\uDD0D [Research API] Starting request...");try{let r,t=await e.json();console.log("\uD83D\uDCCB [Research API] Request body:",JSON.stringify(t,null,2));let{role:s,tasks:i,resume:a,linkedinUrl:o,profileData:n}=t;if(!s)return console.error("❌ [Research API] Missing role field"),u.Rp.json({error:"Role is required"},{status:400});let c=y(s),l=y(a||"");console.log("\uD83E\uDDF9 [Research API] Text sanitization complete"),console.log("\uD83D\uDCCF [Research API] Sanitized resume length:",l.length),console.log("\uD83D\uDD17 [Research API] LinkedIn URL provided:",!!o),console.log("\uD83D\uDD17 [Research API] Creating Supabase client...");let d=(0,f.UU)(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);console.log("✅ [Research API] Supabase client created"),console.log("\uD83E\uDD16 [Research API] Creating OpenAI client...");let p=new m.Ay({apiKey:process.env.OPENAI_API_KEY,timeout:3e4}),h=null;o&&o.trim()&&(console.log("\uD83D\uDD17 [Research API] Processing LinkedIn profile..."),(h=await I(p,o.trim()))&&!h.error?(console.log("✅ [Research API] LinkedIn data extracted successfully"),h.dailyTasks&&(l+=`

LinkedIn Profile Insights:
${h.dailyTasks}`),h.skills&&Array.isArray(h.skills)&&(l+=`

Key Skills: ${h.skills.join(", ")}`),h.careerProgression&&(l+=`

Career Progression: ${h.careerProgression}`),console.log("\uD83D\uDCCF [Research API] Enhanced resume length after LinkedIn:",l.length)):console.log("⚠️ [Research API] LinkedIn analysis failed, continuing without LinkedIn data")),console.log("\uD83D\uDCBE [Research API] Inserting profile into database...");let{data:A,error:k}=await d.from("profiles").insert([{role:c,resume:l,task_hours:i||{},email:null}]).select().single();if(k)return console.error("❌ [Research API] Database error:",k),u.Rp.json({error:"Database error: "+k.message},{status:500});console.log("✅ [Research API] Profile created:",A),console.log("\uD83D\uDCDD [Research API] Generating research prompt...");let P=(0,g.U4)({role:c,tasks:i,resume:l,linkedinData:h||null,profileData:n||null});console.log("\uD83D\uDCC4 [Research API] Prompt length:",P.length),console.log("\uD83D\uDE80 [Research API] Calling OpenAI API...");let S=await p.chat.completions.create({model:"gpt-4o",temperature:.2,messages:[{role:"system",content:P}]});console.log("✅ [Research API] OpenAI response received"),console.log("\uD83D\uDCCA [Research API] Response usage:",S.usage);let v=S.choices[0].message.content;if(console.log("\uD83D\uDCC4 [Research API] Response content:",v?.substring(0,500)+"..."),!v)return console.error("❌ [Research API] Empty response from OpenAI"),u.Rp.json({error:"Empty response from AI"},{status:500});console.log("\uD83D\uDD27 [Research API] Parsing JSON response...");try{r=JSON.parse(v),console.log("✅ [Research API] JSON parsed successfully"),h&&!h.error&&(r.linkedinProfile=h)}catch(e){return console.error("❌ [Research API] JSON parse error:",e),console.log("\uD83D\uDCC4 [Research API] Raw content that failed to parse:",v),u.Rp.json({error:"Invalid AI response format"},{status:500})}console.log("\uD83D\uDD25 [Research API] Triggering analysis...");try{await R(A.id,r),console.log("✅ [Research API] Analysis completed successfully")}catch(e){console.error("❌ [Research API] Analysis failed, but profile created:",e)}return console.log("✅ [Research API] Request completed successfully"),u.Rp.json({status:"processing",profile_id:A.id})}catch(e){return console.error("\uD83D\uDCA5 [Research API] Unexpected error:",e),console.error("\uD83D\uDCDA [Research API] Error stack:",e instanceof Error?e.stack:"No stack trace"),u.Rp.json({error:"Internal server error: "+(e instanceof Error?e.message:String(e))},{status:500})}}let k=new l.AppRouteRouteModule({definition:{kind:d.A.APP_ROUTE,page:"/api/research/route",pathname:"/api/research",filename:"route",bundlePath:"app/api/research/route"},resolvedPagePath:"/Users/miguel/Downloads/AICareerShield/app/api/research/route.ts",nextConfigOutput:"",userland:i}),{workAsyncStorage:P,workUnitAsyncStorage:S,serverHooks:v}=k;function b(){return(0,p.V5)({workAsyncStorage:P,workUnitAsyncStorage:S})}let w=null==(s=self.__RSC_MANIFEST)?void 0:s["/api/research/route"],x=(e=>e?JSON.parse(e):void 0)(self.__RSC_SERVER_MANIFEST);w&&x&&(0,n.fQ)({page:"/api/research/route",clientReferenceManifest:w,serverActionsManifest:x,serverModuleMap:(0,o.e)({serverActionsManifest:x})});let E=a,T=c.s.wrap(k,{nextConfig:{env:{},webpack:null,eslint:{ignoreDuringBuilds:!1},typescript:{ignoreBuildErrors:!1,tsconfigPath:"tsconfig.json"},distDir:".next",cleanDistDir:!0,assetPrefix:"",cacheMaxMemorySize:0x3200000,configOrigin:"next.config.js",useFileSystemPublicRoutes:!0,generateEtags:!0,pageExtensions:["tsx","ts","jsx","js"],poweredByHeader:!0,compress:!0,images:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:60,formats:["image/webp"],dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",remotePatterns:[],unoptimized:!1},devIndicators:{position:"bottom-left"},onDemandEntries:{maxInactiveAge:6e4,pagesBufferLength:5},amp:{canonicalBase:""},basePath:"",sassOptions:{},trailingSlash:!1,i18n:null,productionBrowserSourceMaps:!1,excludeDefaultMomentLocales:!0,serverRuntimeConfig:{},publicRuntimeConfig:{},reactProductionProfiling:!1,reactStrictMode:null,reactMaxHeadersLength:6e3,httpAgentOptions:{keepAlive:!0},logging:{},expireTime:31536e3,staticPageGenerationTimeout:60,modularizeImports:{"@mui/icons-material":{transform:"@mui/icons-material/{{member}}"},lodash:{transform:"lodash/{{member}}"}},outputFileTracingRoot:"/Users/miguel/Downloads/AICareerShield",experimental:{nodeMiddleware:!1,cacheLife:{default:{stale:300,revalidate:900,expire:0xfffffffe},seconds:{stale:0,revalidate:1,expire:60},minutes:{stale:300,revalidate:60,expire:3600},hours:{stale:300,revalidate:3600,expire:86400},days:{stale:300,revalidate:86400,expire:604800},weeks:{stale:300,revalidate:604800,expire:2592e3},max:{stale:300,revalidate:2592e3,expire:0xfffffffe}},cacheHandlers:{},cssChunking:!0,multiZoneDraftMode:!1,appNavFailHandling:!1,prerenderEarlyExit:!0,serverMinification:!0,serverSourceMaps:!1,linkNoTouchStart:!1,caseSensitiveRoutes:!1,clientSegmentCache:!1,dynamicOnHover:!1,preloadEntriesOnStart:!0,clientRouterFilter:!0,clientRouterFilterRedirects:!1,fetchCacheKeyPrefix:"",middlewarePrefetch:"flexible",optimisticClientCache:!0,manualClientBasePath:!1,cpus:13,memoryBasedWorkersCount:!1,imgOptConcurrency:null,imgOptTimeoutInSeconds:7,imgOptMaxInputPixels:0xfff8001,imgOptSequentialRead:null,isrFlushToDisk:!0,workerThreads:!1,optimizeCss:!1,nextScriptWorkers:!1,scrollRestoration:!1,externalDir:!1,disableOptimizedLoading:!1,gzipSize:!0,craCompat:!1,esmExternals:!0,fullySpecified:!1,swcTraceProfiling:!1,forceSwcTransforms:!1,largePageDataBytes:128e3,typedRoutes:!1,typedEnv:!1,parallelServerCompiles:!1,parallelServerBuildTraces:!1,ppr:!1,authInterrupts:!1,webpackMemoryOptimizations:!1,optimizeServerReact:!0,useEarlyImport:!1,viewTransition:!1,routerBFCache:!1,staleTimes:{dynamic:0,static:300},serverComponentsHmrCache:!0,staticGenerationMaxConcurrency:8,staticGenerationMinPagesPerWorker:25,dynamicIO:!1,inlineCss:!1,useCache:!1,optimizePackageImports:["lucide-react","date-fns","lodash-es","ramda","antd","react-bootstrap","ahooks","@ant-design/icons","@headlessui/react","@headlessui-float/react","@heroicons/react/20/solid","@heroicons/react/24/solid","@heroicons/react/24/outline","@visx/visx","@tremor/react","rxjs","@mui/material","@mui/icons-material","recharts","react-use","effect","@effect/schema","@effect/platform","@effect/platform-node","@effect/platform-browser","@effect/platform-bun","@effect/sql","@effect/sql-mssql","@effect/sql-mysql2","@effect/sql-pg","@effect/sql-squlite-node","@effect/sql-squlite-bun","@effect/sql-squlite-wasm","@effect/sql-squlite-react-native","@effect/rpc","@effect/rpc-http","@effect/typeclass","@effect/experimental","@effect/opentelemetry","@material-ui/core","@material-ui/icons","@tabler/icons-react","mui-core","react-icons/ai","react-icons/bi","react-icons/bs","react-icons/cg","react-icons/ci","react-icons/di","react-icons/fa","react-icons/fa6","react-icons/fc","react-icons/fi","react-icons/gi","react-icons/go","react-icons/gr","react-icons/hi","react-icons/hi2","react-icons/im","react-icons/io","react-icons/io5","react-icons/lia","react-icons/lib","react-icons/lu","react-icons/md","react-icons/pi","react-icons/ri","react-icons/rx","react-icons/si","react-icons/sl","react-icons/tb","react-icons/tfi","react-icons/ti","react-icons/vsc","react-icons/wi"]},htmlLimitedBots:"Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti",bundlePagesRouterDependencies:!1,configFile:"/Users/miguel/Downloads/AICareerShield/next.config.js",configFileName:"next.config.js",serverExternalPackages:["pdf-parse"],turbopack:{root:"/Users/miguel/Downloads/AICareerShield"}}})},5356:e=>{"use strict";e.exports=require("node:buffer")},5521:e=>{"use strict";e.exports=require("node:async_hooks")},6487:()=>{},8335:()=>{}},e=>{var r=r=>e(e.s=r);e.O(0,[319,817,169],()=>r(2874));var t=e.O();(_ENTRIES="undefined"==typeof _ENTRIES?{}:_ENTRIES)["middleware_app/api/research/route"]=t}]);
//# sourceMappingURL=route.js.map