import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MODEL = "gpt-4o-mini";

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 500 });
    const { text } = await req.json();
    if (!text || typeof text !== "string") return NextResponse.json({ error: "Missing 'text'" }, { status: 400 });

    const sys = `You are an AI-writing signal estimator. 
Return a JSON object with:
- "label": one of ["likely_human","mixed","likely_ai"]
- "score_ai": 0..1 (higher means more likely AI)
- "reasons": short bullet points referencing patterns (burstiness, perplexity-like cues, repetition, template phrases).
Be conservative; avoid false accusations. This is a heuristic, not a forensic claim.`;

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
        temperature: 0,
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ error: err }, { status: resp.status });
    }
    const data = await resp.json();
    const json = JSON.parse(data.choices?.[0]?.message?.content || "{}");
    return NextResponse.json(json);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}