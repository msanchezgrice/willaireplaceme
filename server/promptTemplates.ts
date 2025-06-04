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