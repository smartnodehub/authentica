import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
// Kasuta sobivat mudelit (nt "gpt-4o-mini"); vajadusel muuda.
const MODEL = "gpt-4o-mini";

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });

    const { text, level = "Intermediate" } = await req.json();
    if (!text || typeof text !== "string") return NextResponse.json({ error: "Missing 'text'" }, { status: 400 });

    const styleByLevel: Record<string, string> = {
      Beginner:
        "Use short sentences, common words, concrete examples. Avoid jargon. Target CEFR A2–B1.",
      Intermediate:
        "Use clear, natural language with moderate vocabulary. Vary sentence length. Target CEFR B2.",
      Advanced:
        "Use rich vocabulary, precise terminology, and nuanced structure. Target CEFR C1–C2.",
    };

    const sys = `Rewrite the user's text to sound natural and human, preserving meaning and facts.
Style guide: ${styleByLevel[level] ?? styleByLevel.Intermediate}
Do not invent facts. Keep original intent.`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: text },
        ],
        temperature: 0.5,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ error: err }, { status: resp.status });
    }

    const data = await resp.json();
    const out = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ output: out, level });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}