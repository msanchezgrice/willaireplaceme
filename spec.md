# AICareerShield MVP – Spec & Scaffold  
*(single-file copy for Cursor import)*

---

## 0. TL;DR checklist for Cursor agent

1. **Clone** the repo from GitHub (or create if fresh).  
2. **Add** Supabase: `supabase init`. Commit the generated `supabase/config.toml`.  
3. **Apply** `sql/000_initial.sql` (see §4). Push migration: `supabase db push`.  
4. **Create** environment secrets in Vercel → *Project Settings → Environment*:  
   `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,  
   `OPENAI_ORG`, `ENABLE_BROWSING=true`.  
5. **Copy** `/server` & `/app/(forms|api)` folders below into repo.  
6. `pnpm i @supabase/supabase-js openai zod` (or `npm`).  
7. **Set up** GitHub Actions workflow (§8) for lint + type-check + Vercel deploy.  
8. **Run** locally: `pnpm dev` → sign up → test intake → get preview.  
9. **Open** Supabase → confirm `profiles`, `reports` rows appear.  
10. **Merge** PR → Vercel production.

⏱️  New users can go from landing page to preview in ~40 s (streaming).  
Full report behind Stripe pay-wall is optional in slice 1.

---

## 1. Architecture snapshot
📦 root
┣━━ app/              # Next 13 (RSC) front-end
┃   ┣━━ page.tsx      # Landing (hero copy)
┃   ┣━━ (forms)/intake/page.tsx
┃   ┣━━ (forms)/paywall/page.tsx
┃   ┗━━ (api)/
┃        ┣━━ research/route.ts   # GPT-4.1 + browsing
┃        ┗━━ analyze/route.ts    # o3 analysis
┣━━ server/
┃   ┣━━ promptTemplates.ts
┃   ┗━━ score.ts
┣━━ sql/000_initial.sql          # Supabase schema
┣━━ .github/workflows/deploy.yml # CI → Vercel
┗━━ README.md                    # this file

---

## 2. Data-flow diagram

```mermaid
sequenceDiagram
    participant U as User (browser)
    participant F as Next.js API
    participant O as OpenAI 4.1 (browse)
    participant A as OpenAI o3
    participant S as Supabase
    U->>F: POST /api/research
    F->>O: prompt #1 (research)
    O-->>F: JSON evidence
    F->>S: INSERT profiles + evidence
    U-->>F: spinner
    F->>A: prompt #2 (analysis)
    A-->>F: preview + full
    F->>S: INSERT reports
    F-->>U: stream preview

    Latency 4.1 + browse ≈ 7 s · o3 ≈ 5 s · preview streams as soon as score ready.

⸻

3. Prompt templates (server/promptTemplates.ts)
export const researchPrompt = ({ role, tasks, resume }: any) => `
You are an AI researcher gathering *verifiable* evidence (URLs required).
Role: ${role}
Weekly task split: ${JSON.stringify(tasks)}
Resume snippet: ${resume?.slice(0, 600)}

Instructions:
1. For each task list
   a) risk rating (High | Moderate | Low)
   b) real product/tool proof
   c) source URL.
2. Provide 3-5 macro stats on AI adoption or job-impact for this role.
3. Return strict JSON: {"taskFacts":[...],"macroStats":[...]}
NO speculation—only sources you can cite.
`;

export const analysisPrompt = (json: string) => `
SYSTEM: Generate AI-replacement analysis with no hallucination.
INPUT_JSON = ${json}

Rules:
• Compute score S = Σ(hours × weight), High 1 · Moderate 0.6 · Low 0.3.
• Output:
   PREVIEW ≤180 words + score + 1 tip
   ---FULL_REPORT---
   full markdown report (headings, timeline, mitigation, citations)
• Inline-cite using [1], [2] matching INPUT_JSON URLs.
• If no sources → reply "INSUFFICIENT DATA".
`;
Scoring helper (server/score.ts):
create table profiles (
  id uuid primary key default gen_random_uuid(),
  email text references auth.users(email),
  role text,
  resume text,
  task_hours jsonb,
  created_at timestamp default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  score numeric,
  preview text,
  full_report text,
  evidence jsonb,
  created_at timestamp default now()
);

5. API routes (Edge)

/app/(api)/research/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { researchPrompt } from '@/server/promptTemplates';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { role, tasks, resume } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase
    .from('profiles')
    .insert([{ role, resume, task_hours: tasks }])
    .select()
    .single();

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const research = await openai.chat.completions.create({
    model: 'gpt-4o-browsing',
    temperature: 0.2,
    tools: [{ type: 'browser' }],
    messages: [{ role: 'system', content: researchPrompt({ role, tasks, resume }) }]
  });

  const evidence = JSON.parse(research.choices[0].message.content!);

  // Fire-and-forget analysis
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile_id: profile.id, evidence })
  });

  return NextResponse.json({ status: 'processing', profile_id: profile.id });
}
/app/(api)/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { analysisPrompt } from '@/server/promptTemplates';
import { score } from '@/server/score';

export async function POST(req: NextRequest) {
  const { profile_id, evidence } = await req.json();
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const analysis = await openai.chat.completions.create({
    model: 'o3',
    temperature: 0,
    messages: [{ role: 'system', content: analysisPrompt(JSON.stringify(evidence)) }]
  });

  const [preview, full] = analysis.choices[0].message.content!.split('---FULL_REPORT---');
  const scoreVal = score(evidence);

  await supabase.from('reports').insert([
    { profile_id, score: scoreVal, preview, full_report: full, evidence }
  ]);

  return NextResponse.json({ ok: true });
}
6. Front-end pages to add
	•	app/(forms)/intake/page.tsx – multi-step intake; POST to /api/research.
	•	app/(forms)/waiting/page.tsx – poll Supabase for reports row, stream preview.
	•	app/(forms)/paywall/page.tsx – Stripe checkout; after success, fetch full_report.

UI components = shadcn/ui (already in your zip).

⸻

7. GitHub Actions → Vercel

.github/workflows/deploy.yml
name: CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          prod: true

    8. Commit log suggestion
    feat(intake): add profile & task intake screens
feat(api): research route w/ GPT-4.1 evidence gathering
feat(api): analyze route using o3 + deterministic scoring
chore(db): initial Supabase schema
chore(ci): GitHub Actions → Vercel deploy

9. Evidence-based task grids & weights (copy to /server/taskCatalog.ts)

(abridged: PM, Designer, Software Eng, Marketing, Accounting, Legal – with risk weights, tools, citations)
(see original spec if you need full table text)

⸻

10. Merge instructions for your existing front-end zip
	1.	Unzip AICareerShield.zip locally – contains /app, /public, Tailwind config.
	2.	Copy those folders into repo before running TL;DR Step 2.
	3.	Keep existing tailwind.config.ts; Cursor will merge presets.
	4.	Replace/merge package.json: keep UI deps, add backend deps.
	5.	Commit branch feat/mvp-backend-integration → open PR → CI → merge → Vercel deploy.

⸻
