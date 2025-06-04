(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[786],{1873:(e,t,i)=>{"use strict";i.d(t,{U4:()=>r,v1:()=>a});let r=({role:e,tasks:t,resume:i})=>`
You are an AI researcher conducting a comprehensive analysis of AI automation risk for the role: ${e}.

**ROLE CONTEXT:**
- Position: ${e}
- Weekly task breakdown: ${JSON.stringify(t)}
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

Focus on concrete, recent developments with credible sources. Avoid speculation.`,a=e=>`
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

Generate the complete analysis now:`},2530:(e,t,i)=>{"use strict";i.r(t),i.d(t,{ComponentMod:()=>w,default:()=>x});var r,a={};i.r(a),i.d(a,{POST:()=>A,runtime:()=>h});var o={};i.r(o),i.d(o,{patchFetch:()=>P,routeModule:()=>v,serverHooks:()=>S,workAsyncStorage:()=>I,workUnitAsyncStorage:()=>k});var s=i(8429),n=i(9874),l=i(8294),c=i(6567),p=i(4144),d=i(5421),u=i(9079),m=i(7817),f=i(169),g=i(1873);let h="edge";function y(e){return e?e.replace(/\0/g,"").normalize("NFC").substring(0,5e4):""}async function A(e){console.log("\uD83D\uDD2C [Analyze API] Starting analysis request...");try{let t=await e.json();console.log("\uD83D\uDCCB [Analyze API] Request body keys:",Object.keys(t)),console.log("\uD83D\uDCCB [Analyze API] Profile ID:",t.profile_id),console.log("\uD83D\uDCCB [Analyze API] Evidence type:",typeof t.evidence);let{profile_id:i,evidence:r}=t;if(!i)return console.error("❌ [Analyze API] Missing profile_id"),u.Rp.json({error:"Profile ID is required"},{status:400});if(!r)return console.error("❌ [Analyze API] Missing evidence"),u.Rp.json({error:"Evidence is required"},{status:400});console.log("\uD83D\uDD17 [Analyze API] Creating Supabase client...");let a=(0,m.UU)(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);console.log("✅ [Analyze API] Supabase client created"),console.log("\uD83E\uDD16 [Analyze API] Creating OpenAI client...");let o=new f.Ay({apiKey:process.env.OPENAI_API_KEY,timeout:6e4});console.log("\uD83D\uDCDD [Analyze API] Generating analysis prompt...");let s=(0,g.v1)(JSON.stringify(r));console.log("\uD83D\uDCC4 [Analyze API] Prompt length:",s.length),console.log("\uD83D\uDE80 [Analyze API] Calling OpenAI API (gpt-4o model)...");let n=await o.chat.completions.create({model:"gpt-4o",temperature:0,messages:[{role:"system",content:s}]});console.log("✅ [Analyze API] OpenAI response received"),console.log("\uD83D\uDCCA [Analyze API] Response usage:",n.usage);let l=n.choices[0].message.content;if(console.log("\uD83D\uDCC4 [Analyze API] Response content length:",l?.length),!l)return console.error("❌ [Analyze API] Empty response from OpenAI"),u.Rp.json({error:"Empty analysis response"},{status:500});console.log("\uD83D\uDD27 [Analyze API] Splitting response into preview and full report...");let[c,p]=l.split("---FULL_REPORT---");console.log("\uD83D\uDCC4 [Analyze API] Preview length:",c?.length),console.log("\uD83D\uDCC4 [Analyze API] Full report length:",p?.length);let d=y(c?.trim()||"Analysis preview not available"),h=y(p?.trim()||"Full report not available");console.log("\uD83E\uDDEE [Analyze API] Calculating risk score...");let A=function(e){if(!e||!e.taskFacts)return 0;let t=0,i=0;for(let r of e.taskFacts){let e=r.hours||1,a=0;switch(r.riskRating){case"High":a=1;break;case"Moderate":a=.6;break;case"Low":a=.3;break;default:a=.5}t+=e*a,i+=e}return 0===i?0:Math.round(t/i*100)}(r);console.log("\uD83D\uDCCA [Analyze API] Calculated score:",A),console.log("\uD83D\uDCBE [Analyze API] Saving report to database...");let{data:v,error:I}=await a.from("reports").insert([{profile_id:i,score:A,preview:d,full_report:h,evidence:r}]).select().single();if(I)return console.error("❌ [Analyze API] Database error:",I),u.Rp.json({error:"Database error: "+I.message},{status:500});return console.log("✅ [Analyze API] Report saved successfully:",v?.id),console.log("✅ [Analyze API] Analysis completed successfully"),u.Rp.json({ok:!0,report_id:v?.id})}catch(e){return console.error("\uD83D\uDCA5 [Analyze API] Unexpected error:",e),console.error("\uD83D\uDCDA [Analyze API] Error stack:",e instanceof Error?e.stack:"No stack trace"),u.Rp.json({error:"Analysis failed: "+(e instanceof Error?e.message:String(e))},{status:500})}}let v=new c.AppRouteRouteModule({definition:{kind:p.A.APP_ROUTE,page:"/api/analyze/route",pathname:"/api/analyze",filename:"route",bundlePath:"app/api/analyze/route"},resolvedPagePath:"/Users/miguel/Downloads/AICareerShield/app/api/analyze/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:I,workUnitAsyncStorage:k,serverHooks:S}=v;function P(){return(0,d.V5)({workAsyncStorage:I,workUnitAsyncStorage:k})}let R=null==(r=self.__RSC_MANIFEST)?void 0:r["/api/analyze/route"],b=(e=>e?JSON.parse(e):void 0)(self.__RSC_SERVER_MANIFEST);R&&b&&(0,n.fQ)({page:"/api/analyze/route",clientReferenceManifest:R,serverActionsManifest:b,serverModuleMap:(0,s.e)({serverActionsManifest:b})});let w=o,x=l.s.wrap(v,{nextConfig:{env:{},webpack:null,eslint:{ignoreDuringBuilds:!1},typescript:{ignoreBuildErrors:!1,tsconfigPath:"tsconfig.json"},distDir:".next",cleanDistDir:!0,assetPrefix:"",cacheMaxMemorySize:0x3200000,configOrigin:"next.config.js",useFileSystemPublicRoutes:!0,generateEtags:!0,pageExtensions:["tsx","ts","jsx","js"],poweredByHeader:!0,compress:!0,images:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:60,formats:["image/webp"],dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",remotePatterns:[],unoptimized:!1},devIndicators:{position:"bottom-left"},onDemandEntries:{maxInactiveAge:6e4,pagesBufferLength:5},amp:{canonicalBase:""},basePath:"",sassOptions:{},trailingSlash:!1,i18n:null,productionBrowserSourceMaps:!1,excludeDefaultMomentLocales:!0,serverRuntimeConfig:{},publicRuntimeConfig:{},reactProductionProfiling:!1,reactStrictMode:null,reactMaxHeadersLength:6e3,httpAgentOptions:{keepAlive:!0},logging:{},expireTime:31536e3,staticPageGenerationTimeout:60,modularizeImports:{"@mui/icons-material":{transform:"@mui/icons-material/{{member}}"},lodash:{transform:"lodash/{{member}}"}},outputFileTracingRoot:"/Users/miguel/Downloads/AICareerShield",experimental:{nodeMiddleware:!1,cacheLife:{default:{stale:300,revalidate:900,expire:0xfffffffe},seconds:{stale:0,revalidate:1,expire:60},minutes:{stale:300,revalidate:60,expire:3600},hours:{stale:300,revalidate:3600,expire:86400},days:{stale:300,revalidate:86400,expire:604800},weeks:{stale:300,revalidate:604800,expire:2592e3},max:{stale:300,revalidate:2592e3,expire:0xfffffffe}},cacheHandlers:{},cssChunking:!0,multiZoneDraftMode:!1,appNavFailHandling:!1,prerenderEarlyExit:!0,serverMinification:!0,serverSourceMaps:!1,linkNoTouchStart:!1,caseSensitiveRoutes:!1,clientSegmentCache:!1,dynamicOnHover:!1,preloadEntriesOnStart:!0,clientRouterFilter:!0,clientRouterFilterRedirects:!1,fetchCacheKeyPrefix:"",middlewarePrefetch:"flexible",optimisticClientCache:!0,manualClientBasePath:!1,cpus:13,memoryBasedWorkersCount:!1,imgOptConcurrency:null,imgOptTimeoutInSeconds:7,imgOptMaxInputPixels:0xfff8001,imgOptSequentialRead:null,isrFlushToDisk:!0,workerThreads:!1,optimizeCss:!1,nextScriptWorkers:!1,scrollRestoration:!1,externalDir:!1,disableOptimizedLoading:!1,gzipSize:!0,craCompat:!1,esmExternals:!0,fullySpecified:!1,swcTraceProfiling:!1,forceSwcTransforms:!1,largePageDataBytes:128e3,typedRoutes:!1,typedEnv:!1,parallelServerCompiles:!1,parallelServerBuildTraces:!1,ppr:!1,authInterrupts:!1,webpackMemoryOptimizations:!1,optimizeServerReact:!0,useEarlyImport:!1,viewTransition:!1,routerBFCache:!1,staleTimes:{dynamic:0,static:300},serverComponentsHmrCache:!0,staticGenerationMaxConcurrency:8,staticGenerationMinPagesPerWorker:25,dynamicIO:!1,inlineCss:!1,useCache:!1,optimizePackageImports:["lucide-react","date-fns","lodash-es","ramda","antd","react-bootstrap","ahooks","@ant-design/icons","@headlessui/react","@headlessui-float/react","@heroicons/react/20/solid","@heroicons/react/24/solid","@heroicons/react/24/outline","@visx/visx","@tremor/react","rxjs","@mui/material","@mui/icons-material","recharts","react-use","effect","@effect/schema","@effect/platform","@effect/platform-node","@effect/platform-browser","@effect/platform-bun","@effect/sql","@effect/sql-mssql","@effect/sql-mysql2","@effect/sql-pg","@effect/sql-squlite-node","@effect/sql-squlite-bun","@effect/sql-squlite-wasm","@effect/sql-squlite-react-native","@effect/rpc","@effect/rpc-http","@effect/typeclass","@effect/experimental","@effect/opentelemetry","@material-ui/core","@material-ui/icons","@tabler/icons-react","mui-core","react-icons/ai","react-icons/bi","react-icons/bs","react-icons/cg","react-icons/ci","react-icons/di","react-icons/fa","react-icons/fa6","react-icons/fc","react-icons/fi","react-icons/gi","react-icons/go","react-icons/gr","react-icons/hi","react-icons/hi2","react-icons/im","react-icons/io","react-icons/io5","react-icons/lia","react-icons/lib","react-icons/lu","react-icons/md","react-icons/pi","react-icons/ri","react-icons/rx","react-icons/si","react-icons/sl","react-icons/tb","react-icons/tfi","react-icons/ti","react-icons/vsc","react-icons/wi"]},htmlLimitedBots:"Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti",bundlePagesRouterDependencies:!1,configFile:"/Users/miguel/Downloads/AICareerShield/next.config.js",configFileName:"next.config.js",serverExternalPackages:["pdf-parse"],turbopack:{root:"/Users/miguel/Downloads/AICareerShield"}}})},5356:e=>{"use strict";e.exports=require("node:buffer")},5521:e=>{"use strict";e.exports=require("node:async_hooks")},6487:()=>{},8335:()=>{}},e=>{var t=t=>e(e.s=t);e.O(0,[319,817,169],()=>t(2530));var i=e.O();(_ENTRIES="undefined"==typeof _ENTRIES?{}:_ENTRIES)["middleware_app/api/analyze/route"]=i}]);
//# sourceMappingURL=route.js.map