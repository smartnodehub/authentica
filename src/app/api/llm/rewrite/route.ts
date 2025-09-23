function readApiKey(): string | null {
  const raw = (process.env.OPENAI_API_KEY ?? '').trim();
  if (!raw) return null;
  if (/\r|\n/.test(raw)) return null;   // keelab CR/LF sees
  if (!/^sk-/.test(raw)) return null;   // peab algama sk-
  return raw;
}
// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/api/llm/rewrite/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = { text: string; style?: 'concise'|'neutral'|'friendly'|'formal'; lang?: 'en'|'fi'|'et' };
type OpenAIResponse = { choices: { message?: { content?: string } }[] };

export async function POST(req: NextRequest) {
  const apiKey = readApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY invalid or not configured (check Vercel Settings → Environment Variables)' },
      { status: 503 }
    );
  }

  let body: Body | undefined;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const text = body?.text?.toString() ?? '';
  const style = (body?.style ?? 'neutral') as Body['style'];
  const lang = (body?.lang ?? 'en') as Body['lang'];

  if (text.trim().length < 5) {
    return NextResponse.json({ error: 'Text too short' }, { status: 400 });
  }

  const system = [
    'You are a careful rewriting assistant.',
    'Preserve meaning, factual content, and any citations.',
    'Improve clarity and flow.',
    'Do not fabricate facts. Do not claim detector bypass.',
    'Return ONLY the rewritten text.',
  ].join(' ');

  const toneMap: Record<NonNullable<Body['style']>, string> = {
    concise: 'Make the result shorter and to the point.',
    neutral: 'Use a neutral, professional tone.',
    friendly: 'Use a warm, approachable tone without slang.',
    formal:  'Use a formal tone suitable for business writing.',
  };
  const tone = toneMap[style ?? 'neutral'];

  const userPrompt = [
    `Language: ${lang}`,
    tone,
    'Rewrite the following text. Return ONLY the rewritten text.',
    '---',
    text,
  ].join('\n');

  // Timeout kaitse
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 800,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    clearTimeout(timer);

    if (!resp.ok) {
      // Proovi JSON-i lugeda, kui pole, siis tekst
      const ct = resp.headers.get('content-type') || '';
      let upstream: unknown;
      try {
        upstream = ct.includes('application/json') ? await resp.json() : await resp.text();
      } catch {
        upstream = `Upstream error with status ${resp.status}`;
      }
      let message: string;
      if (typeof upstream === 'string') {
        message = upstream;
      } else if (upstream && typeof upstream === 'object') {
        // Try to extract error.message or message
        const errObj = upstream as { error?: { message?: string }; message?: string };
        message = errObj.error?.message || errObj.message || JSON.stringify(upstream);
      } else {
        message = JSON.stringify(upstream);
      }
      return NextResponse.json(
        { error: `OpenAI error (HTTP ${resp.status}): ${message}` },
        { status: 502 }
      );
    }

    const data = (await resp.json()) as OpenAIResponse;
    const rewritten = data?.choices?.[0]?.message?.content?.trim();
    if (!rewritten) {
      return NextResponse.json({ error: 'No content from model' }, { status: 502 });
    }

    return NextResponse.json({ rewritten });
  } catch (e: unknown) {
    clearTimeout(timer);
    const msg = e instanceof Error ? e.message : String(e);
    // Kui abort → timeout
    const timeout = /aborted|The user aborted a request|signal/i.test(msg) ? ' (timeout)' : '';
    console.error('[rewrite] error:', msg);
    return NextResponse.json({ error: `Rewrite failed${timeout}: ${msg}` }, { status: 502 });
  }
}
