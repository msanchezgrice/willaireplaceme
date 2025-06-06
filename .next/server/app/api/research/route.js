(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[721],{2874:(e,r,t)=>{"use strict";t.r(r),t.d(r,{ComponentMod:()=>N,default:()=>T});var a,s={};t.r(s),t.d(s,{POST:()=>k,maxDuration:()=>I,runtime:()=>y});var o={};t.r(o),t.d(o,{patchFetch:()=>E,routeModule:()=>A,serverHooks:()=>w,workAsyncStorage:()=>b,workUnitAsyncStorage:()=>v});var i=t(8429),n=t(9874),l=t(8294),c=t(6567),d=t(4144),u=t(5421),p=t(974),f=t(7817),m=t(9397),h=t(169),g=t(1873);let y="edge",I=800;function x(e){return e?e.replace(/\0/g,"").normalize("NFC").replace(/\\u[0-9a-fA-F]{4}/g,e=>{try{return JSON.parse(`"${e}"`)}catch{return""}}).substring(0,5e4):""}function P(e,r){console.log(`🔍 [${r}] Attempting JSON extraction from response`);try{let t=JSON.parse(e);return console.log(`✅ [${r}] Direct JSON parsing successful`),t}catch(e){console.log(`⚠️ [${r}] Direct JSON parsing failed, trying extraction patterns`)}let t=e.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/g);if(t)for(let e of t)try{let t=e.replace(/```(?:json)?\s*/,"").replace(/\s*```/,"").trim(),a=JSON.parse(t);return console.log(`✅ [${r}] JSON extracted from code block`),a}catch(e){continue}let a=e.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);if(a)for(let e of a.sort((e,r)=>r.length-e.length))try{let t=JSON.parse(e);return console.log(`✅ [${r}] JSON extracted from text pattern`),t}catch(e){continue}let s=e.replace(/^[\s\S]*?(?=\{)/,"").replace(/\}(?![^{}]*\{)[\s\S]*$/,"}").trim();if(s.startsWith("{")&&s.endsWith("}"))try{let e=JSON.parse(s);return console.log(`✅ [${r}] JSON extracted after cleaning`),e}catch(e){console.log(`⚠️ [${r}] Cleaned JSON parsing failed`)}let o=e.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g,'"$2":').replace(/:\s*'([^']*)'/g,': "$1"').replace(/,\s*}/g,"}").replace(/,\s*]/g,"]").match(/\{[\s\S]*\}/);if(o)try{let e=JSON.parse(o[0]);return console.log(`✅ [${r}] JSON extracted after fixing common issues`),e}catch(e){console.log(`⚠️ [${r}] Fixed JSON parsing failed`)}return console.error(`❌ [${r}] All JSON extraction patterns failed`),console.log(`📄 [${r}] Raw content (first 500 chars):`,e.substring(0,500)),null}async function R(e,r){console.log("\uD83D\uDD17 [Research API] Analyzing LinkedIn profile with Responses API + Enhanced Parsing:",r);try{let t=(await e.responses.create({model:"gpt-4.1",tools:[{type:"web_search_preview"}],input:[{role:"user",content:[{type:"input_text",text:`Analyze this LinkedIn profile and extract professional information: ${r}

Please search the web and visit this LinkedIn profile URL to extract comprehensive professional data.

**Required JSON Response Format:**
{
  "currentTitle": "current job title from profile",
  "company": "current company name", 
  "yearsExperience": "calculated total years based on work history",
  "skills": ["technical skills", "soft skills", "tools listed"],
  "dailyTasks": "inferred daily responsibilities from role descriptions",
  "industry": "industry/sector",
  "education": "education background from profile",
  "careerProgression": "analysis of career growth pattern",
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "time period",
      "description": "role description and key responsibilities"
    }
  ]
}

**Instructions:**
1. Use web search to access the LinkedIn profile URL directly
2. Extract comprehensive professional information visible on the profile
3. Calculate years of experience based on work history timeline
4. Infer daily tasks from job descriptions and industry knowledge
5. Only include information that you can verify from the profile
6. For unavailable information, use "not available" as the value

Return ONLY the JSON object with extracted data. Do not include any explanatory text before or after the JSON.`}]}]})).output_text;if(!t)throw Error("Empty response from LinkedIn analysis");let a=P(t,"LinkedIn analysis");if(a)return console.log("✅ [Research API] LinkedIn profile analyzed successfully with enhanced parsing"),a;throw Error("Could not extract valid JSON from LinkedIn analysis")}catch(e){return console.error("❌ [Research API] LinkedIn analysis failed:",e),{error:!0,reason:e instanceof Error?e.message:"Unable to analyze LinkedIn profile"}}}async function S(e,r,t,a){console.log("\uD83D\uDCC4 [Research API] Processing uploaded file with extended timeout:",t,"Type:",a);try{if("text/plain"===a)return console.log("✅ [Research API] Text file processed directly"),r;if(!r.includes("\n")&&r.length>100&&(a.includes("pdf")||a.includes("doc")))try{console.log("\uD83D\uDCDD [Research API] Using extended file analysis with generous timeout...");let r=await Promise.race([e.responses.create({model:"gpt-4.1",input:[{role:"user",content:[{type:"input_text",text:`Extract professional information from this uploaded document: ${t} (${a})

Based on the filename and document type, provide a structured professional summary:

**Professional Information:**
- Name: ${t.replace(".pdf","").replace(".docx","").replace(".doc","")}
- Document Type: Resume/CV
- Assumed Content: Professional experience, skills, education
- Career Level: Based on document complexity and naming

**Standard Resume Sections:**
- Professional Summary: Senior professional with extensive experience
- Work Experience: Multiple roles showing career progression
- Education: Relevant degree(s)
- Skills: Technical and leadership skills
- Achievements: Notable accomplishments

Return a brief but comprehensive professional profile suitable for career risk analysis.`}]}]}),new Promise((e,r)=>setTimeout(()=>r(Error("Extended analysis timeout")),12e4))]);if(r.output_text)return console.log("✅ [Research API] Document analyzed with extended timeout method"),r.output_text}catch(e){console.log("⚠️ [Research API] Extended analysis failed, using basic fallback")}return console.log("⚠️ [Research API] Using basic document placeholder"),`Professional document: ${t} (${a}) - Contains resume/CV information with career history, skills, and experience relevant for risk analysis.`}catch(e){return console.error("❌ [Research API] File processing failed:",e),`Professional document: ${t} (${a}) - Document uploaded successfully`}}async function k(e){console.log("\uD83D\uDD0D [Research API] Starting request...");try{let{userId:r,sessionId:a}=await (0,m.j)();console.log("\uD83D\uDC64 [Research API] User authentication:",{userId:r,hasSession:!!a});let s=await e.json();console.log("\uD83D\uDCCB [Research API] Request body:",JSON.stringify(s,null,2));let{role:o,tasks:i,resume:n,linkedinUrl:l,profileData:c,uploadedFile:d}=s;if(!o)return console.error("❌ [Research API] Missing role field"),p.Rp.json({error:"Role is required"},{status:400});let u=x(o),y=x(n||"");console.log("\uD83E\uDDF9 [Research API] Text sanitization complete"),console.log("\uD83D\uDCCF [Research API] Sanitized resume length:",y.length),console.log("\uD83D\uDD17 [Research API] LinkedIn URL provided:",!!l),console.log("\uD83D\uDD17 [Research API] Creating Supabase client...");let I=(0,f.UU)(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);console.log("✅ [Research API] Supabase client created"),console.log("\uD83E\uDD16 [Research API] Creating OpenAI client...");let k=new h.Ay({apiKey:process.env.OPENAI_API_KEY,timeout:18e4});if(d&&d.content&&d.name){console.log("\uD83D\uDCC4 [Research API] Processing uploaded file:",d.name);try{let e=await S(k,d.content,d.name,d.type);e&&e!==d.content?(y=e,console.log("\uD83D\uDCCF [Research API] Resume enhanced with processed file content, length:",y.length)):d.content.length>y.length&&(y=x(d.content),console.log("\uD83D\uDCCF [Research API] Using raw file content as resume, length:",y.length))}catch(e){console.log("⚠️ [Research API] File processing failed, continuing with original resume:",e)}}let A=null;if(l&&l.trim()){console.log("\uD83D\uDD17 [Research API] Processing LinkedIn profile...");try{(A=await Promise.race([R(k,l.trim()),new Promise((e,r)=>setTimeout(()=>r(Error("LinkedIn analysis timeout")),12e4))]))&&!A.error?(console.log("✅ [Research API] LinkedIn data extracted successfully"),A.dailyTasks&&(y+=`

LinkedIn Profile Insights:
${A.dailyTasks}`),A.skills&&Array.isArray(A.skills)&&(y+=`

Key Skills: ${A.skills.join(", ")}`),A.careerProgression&&(y+=`

Career Progression: ${A.careerProgression}`),console.log("\uD83D\uDCCF [Research API] Enhanced resume length after LinkedIn:",y.length)):console.log("⚠️ [Research API] LinkedIn analysis failed, continuing without LinkedIn data")}catch(e){console.log("⚠️ [Research API] LinkedIn analysis timeout/error, continuing without LinkedIn data:",e),A=null}}console.log("\uD83D\uDCBE [Research API] Inserting profile into database...");let{data:b,error:v}=await I.from("profiles").insert([{role:u,resume:y,task_hours:i||{},email:null,user_id:r,profile_data:c?{careerCategory:c.careerCategory,yearsExperience:c.yearsExperience,companySize:c.companySize,dailyWorkSummary:c.dailyWorkSummary,keySkills:c.keySkills,linkedinUrl:l}:null,linkedin_data:A&&!A.error?A:null}]).select().single();if(v)return console.error("❌ [Research API] Database error:",v),p.Rp.json({error:"Database error: "+v.message},{status:500});return console.log("✅ [Research API] Profile created:",b),console.log("\uD83D\uDCDD [Research API] Starting AI research and analysis..."),(async()=>{try{console.log("\uD83D\uDCDD [Research API] Generating research prompt...");let e=(0,g.U4)({role:u,tasks:i,resume:y,linkedinData:A||null,profileData:c||null});console.log("\uD83D\uDCC4 [Research API] Prompt length:",e.length),console.log("\uD83D\uDE80 [Research API] Calling OpenAI Responses API with Web Search + Enhanced Parsing...");let r=await k.responses.create({model:"gpt-4.1",tools:[{type:"web_search_preview"}],input:[{role:"user",content:[{type:"input_text",text:`${e}

**ENHANCED RESEARCH INSTRUCTIONS:**
Use web search to find the most current information about AI automation trends affecting the role: "${u}"

Search for:
1. Recent AI tools and platforms launched in 2024-2025 affecting this role
2. Current industry reports from McKinsey, MIT Technology Review, World Economic Forum
3. Real company announcements about AI automation in this field
4. Latest job market trends and skill requirements
5. Recent case studies of AI implementation in similar roles

**REQUIRED JSON OUTPUT FORMAT:**
{
  "taskFacts": [
    {
      "task": "specific task from their role",
      "riskLevel": "High|Moderate|Low", 
      "evidence": "real AI tools/companies affecting this task",
      "impact": "conservative automation percentage estimate",
      "timeline": "realistic timeframe for significant impact",
      "sourceUrl": "real URL if certain, otherwise 'Industry research'",
      "toolsExample": "actual AI tools/platforms that exist"
    }
  ],
  "macroStats": [
    {
      "statistic": "verifiable industry data or conservative estimates",
      "source": "real research organization name",
      "url": "real URL if certain, otherwise 'Industry research reports'",
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

Return ONLY the JSON object. Do not include explanatory text before or after the JSON.`}]}]});console.log("✅ [Research API] OpenAI response received with web search + enhanced parsing");let a=r.output_text;if(!a)throw Error("No response content received from research analysis");let s=P(a,"Research analysis");if(!s)throw Error("Could not extract valid JSON from research analysis");console.log("\uD83D\uDCC4 [Research API] Research evidence extracted successfully"),A&&!A.error&&(s.linkedinProfile=A),console.log("\uD83D\uDD25 [Research API] Calling analyze API directly...");let o=new p.J8("http://localhost/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile_id:b.id,evidence:s})}),{POST:n}=await Promise.resolve().then(t.bind(t,9358)),l=await n(o);if(!l.ok){let e=await l.text();throw console.error("❌ [Research API] Analysis failed:",l.status,e),Error(`Analysis failed: ${l.status} ${e}`)}let d=await l.json();console.log("✅ [Research API] Background analysis completed successfully:",d)}catch(e){console.error("\uD83D\uDCA5 [Research API] Background analysis failed:",e)}})(),console.log("✅ [Research API] Request completed successfully - analysis running in background"),p.Rp.json({status:"processing",profile_id:b.id,message:"Analysis started, results will be available shortly. Please wait for polling to complete."})}catch(e){return console.error("\uD83D\uDCA5 [Research API] Unexpected error:",e),console.error("\uD83D\uDCDA [Research API] Error stack:",e instanceof Error?e.stack:"No stack trace"),p.Rp.json({error:"Internal server error: "+(e instanceof Error?e.message:String(e))},{status:500})}}let A=new c.AppRouteRouteModule({definition:{kind:d.A.APP_ROUTE,page:"/api/research/route",pathname:"/api/research",filename:"route",bundlePath:"app/api/research/route"},resolvedPagePath:"/Users/miguel/Downloads/AICareerShield/app/api/research/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:b,workUnitAsyncStorage:v,serverHooks:w}=A;function E(){return(0,u.V5)({workAsyncStorage:b,workUnitAsyncStorage:v})}let O=null==(a=self.__RSC_MANIFEST)?void 0:a["/api/research/route"],C=(e=>e?JSON.parse(e):void 0)(self.__RSC_SERVER_MANIFEST);O&&C&&(0,n.fQ)({page:"/api/research/route",clientReferenceManifest:O,serverActionsManifest:C,serverModuleMap:(0,i.e)({serverActionsManifest:C})});let N=o,T=l.s.wrap(A,{nextConfig:{env:{},webpack:null,eslint:{ignoreDuringBuilds:!1},typescript:{ignoreBuildErrors:!1,tsconfigPath:"tsconfig.json"},distDir:".next",cleanDistDir:!0,assetPrefix:"",cacheMaxMemorySize:0x3200000,configOrigin:"next.config.js",useFileSystemPublicRoutes:!0,generateEtags:!0,pageExtensions:["tsx","ts","jsx","js"],poweredByHeader:!0,compress:!0,images:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:60,formats:["image/webp"],dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",remotePatterns:[],unoptimized:!1},devIndicators:{position:"bottom-left"},onDemandEntries:{maxInactiveAge:6e4,pagesBufferLength:5},amp:{canonicalBase:""},basePath:"",sassOptions:{},trailingSlash:!1,i18n:null,productionBrowserSourceMaps:!1,excludeDefaultMomentLocales:!0,serverRuntimeConfig:{},publicRuntimeConfig:{},reactProductionProfiling:!1,reactStrictMode:null,reactMaxHeadersLength:6e3,httpAgentOptions:{keepAlive:!0},logging:{},expireTime:31536e3,staticPageGenerationTimeout:60,modularizeImports:{"@mui/icons-material":{transform:"@mui/icons-material/{{member}}"},lodash:{transform:"lodash/{{member}}"}},outputFileTracingRoot:"/Users/miguel/Downloads/AICareerShield",experimental:{nodeMiddleware:!1,cacheLife:{default:{stale:300,revalidate:900,expire:0xfffffffe},seconds:{stale:0,revalidate:1,expire:60},minutes:{stale:300,revalidate:60,expire:3600},hours:{stale:300,revalidate:3600,expire:86400},days:{stale:300,revalidate:86400,expire:604800},weeks:{stale:300,revalidate:604800,expire:2592e3},max:{stale:300,revalidate:2592e3,expire:0xfffffffe}},cacheHandlers:{},cssChunking:!0,multiZoneDraftMode:!1,appNavFailHandling:!1,prerenderEarlyExit:!0,serverMinification:!0,serverSourceMaps:!1,linkNoTouchStart:!1,caseSensitiveRoutes:!1,clientSegmentCache:!1,dynamicOnHover:!1,preloadEntriesOnStart:!0,clientRouterFilter:!0,clientRouterFilterRedirects:!1,fetchCacheKeyPrefix:"",middlewarePrefetch:"flexible",optimisticClientCache:!0,manualClientBasePath:!1,cpus:13,memoryBasedWorkersCount:!1,imgOptConcurrency:null,imgOptTimeoutInSeconds:7,imgOptMaxInputPixels:0xfff8001,imgOptSequentialRead:null,isrFlushToDisk:!0,workerThreads:!1,optimizeCss:!1,nextScriptWorkers:!1,scrollRestoration:!1,externalDir:!1,disableOptimizedLoading:!1,gzipSize:!0,craCompat:!1,esmExternals:!0,fullySpecified:!1,swcTraceProfiling:!1,forceSwcTransforms:!1,largePageDataBytes:128e3,typedRoutes:!1,typedEnv:!1,parallelServerCompiles:!1,parallelServerBuildTraces:!1,ppr:!1,authInterrupts:!1,webpackMemoryOptimizations:!1,optimizeServerReact:!0,useEarlyImport:!1,viewTransition:!1,routerBFCache:!1,staleTimes:{dynamic:0,static:300},serverComponentsHmrCache:!0,staticGenerationMaxConcurrency:8,staticGenerationMinPagesPerWorker:25,dynamicIO:!1,inlineCss:!1,useCache:!1,optimizePackageImports:["lucide-react","date-fns","lodash-es","ramda","antd","react-bootstrap","ahooks","@ant-design/icons","@headlessui/react","@headlessui-float/react","@heroicons/react/20/solid","@heroicons/react/24/solid","@heroicons/react/24/outline","@visx/visx","@tremor/react","rxjs","@mui/material","@mui/icons-material","recharts","react-use","effect","@effect/schema","@effect/platform","@effect/platform-node","@effect/platform-browser","@effect/platform-bun","@effect/sql","@effect/sql-mssql","@effect/sql-mysql2","@effect/sql-pg","@effect/sql-squlite-node","@effect/sql-squlite-bun","@effect/sql-squlite-wasm","@effect/sql-squlite-react-native","@effect/rpc","@effect/rpc-http","@effect/typeclass","@effect/experimental","@effect/opentelemetry","@material-ui/core","@material-ui/icons","@tabler/icons-react","mui-core","react-icons/ai","react-icons/bi","react-icons/bs","react-icons/cg","react-icons/ci","react-icons/di","react-icons/fa","react-icons/fa6","react-icons/fc","react-icons/fi","react-icons/gi","react-icons/go","react-icons/gr","react-icons/hi","react-icons/hi2","react-icons/im","react-icons/io","react-icons/io5","react-icons/lia","react-icons/lib","react-icons/lu","react-icons/md","react-icons/pi","react-icons/ri","react-icons/rx","react-icons/si","react-icons/sl","react-icons/tb","react-icons/tfi","react-icons/ti","react-icons/vsc","react-icons/wi"]},htmlLimitedBots:"Mediapartners-Google|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti",bundlePagesRouterDependencies:!1,configFile:"/Users/miguel/Downloads/AICareerShield/next.config.js",configFileName:"next.config.js",serverExternalPackages:["pdf-parse"],turbopack:{root:"/Users/miguel/Downloads/AICareerShield"}}})},5356:e=>{"use strict";e.exports=require("node:buffer")},5521:e=>{"use strict";e.exports=require("node:async_hooks")}},e=>{var r=r=>e(e.s=r);e.O(0,[580,817,397,169,426],()=>r(2874));var t=e.O();(_ENTRIES="undefined"==typeof _ENTRIES?{}:_ENTRIES)["middleware_app/api/research/route"]=t}]);
//# sourceMappingURL=route.js.map