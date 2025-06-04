import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { analysisPrompt } from '@/server/promptTemplates';
import { score } from '@/server/score';

export const runtime = 'edge';

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