// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/api/llm/rewrite/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // vältimaks Edge'i CORS/stream eripärasid
export const dynamic = 'force-dynamic';

type Body = { text: string; style?: 'concise'|'neutral'|'friendly'|'formal'; lang?: 'en'|'fi'|'et' };

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI not configured' }, { status: 503 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { text, style = 'neutral', lang = 'en' } = body || {};
  if (!text || typeof text !== 'string' || text.trim().length < 5) {
    return NextResponse.json({ error: 'Text too short' }, { status: 400 });
  }

  // Reeglid: tõetruudus ja ausus, ei mingit “detector bypass” jms.
  const system = [
    'You are a careful rewriting assistant.',
    'Preserve meaning, factual content, and citations if present.',
    'Improve clarity, readability, and flow.',
    'Do not fabricate facts. Do not promise detector bypass.',
    'Keep language simple and direct. Respect the requested tone.',
  ].join(' ');

  const toneMap: Record<string,string> = {
    concise: 'Make the result shorter and to the point.',
    neutral: 'Use a neutral, professional tone.',
    friendly: 'Use a warm, approachable tone without slang.',
    formal:  'Use a formal tone suitable for business writing.',
  };

  const tone = toneMap[style] ?? toneMap.neutral;

  const userPrompt = [
    `Language: ${lang}`,
    `${tone}`,
    'Rewrite the following text. Return ONLY the rewritten text. No preface or explanation.',
    '---',
    text,
  ].join('\n');

  // REST-kõne OpenAI Chat Completions API-le (ei vaja lisadepende).
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 800,         // kulukaitse
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => 'OpenAI error');
    return NextResponse.json({ error: `Upstream error: ${err}` }, { status: 502 });
  }

  type OpenAIResponse = {
    choices: { message?: { content?: string } }[];
  };

  const data = await resp.json() as OpenAIResponse;
  const rewritten = data?.choices?.[0]?.message?.content?.trim();
  if (!rewritten) {
    return NextResponse.json({ error: 'No content from model' }, { status: 502 });
  }

  return NextResponse.json({ rewritten });
}
