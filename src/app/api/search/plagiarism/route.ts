// API: /api/search/plagiarism
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlagiarismBody = {
  text: string;
  country?: string;
};

export async function POST(req: NextRequest) {
  const tavilyKey = (process.env.TAVILY_API_KEY ?? "").trim();
  if (!tavilyKey) {
    return NextResponse.json(
      { error: "Plagiarism check requires TAVILY_API_KEY" },
      { status: 503 }
    );
  }

  let body: PlagiarismBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.toString().trim();
  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  try {
    const resp = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tavilyKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: text.slice(0, 200), // võtame alguse plagiaadikontrolliks
        search_depth: "basic",
        include_answer: false,
        max_results: 5,
      }),
    });

    if (!resp.ok) {
      return NextResponse.json({ error: `Tavily error: ${resp.status}` }, { status: 502 });
    }

    const data = await resp.json();
    return NextResponse.json({ matches: data.results ?? [] });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Plagiarism check failed: ${msg}` }, { status: 502 });
  }
}
