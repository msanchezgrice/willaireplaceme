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
    model: 'gpt-4o',
    temperature: 0.2,
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