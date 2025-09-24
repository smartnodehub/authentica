import { NextRequest, NextResponse } from "next/server";

const BRAVE_API_KEY = process.env.BRAVE_API_KEY!;

function makeShingles(text: string, n = 8) {
  const toks = text.replace(/\s+/g, " ").trim().split(" ");
  const out: string[] = [];
  for (let i = 0; i <= toks.length - n; i++) out.push(toks.slice(i, i + n).join(" "));
  return out.slice(0, 8); // piirame 8 päringuga, et odavam oleks
}

export async function POST(req: NextRequest) {
  try {
    if (!BRAVE_API_KEY) return NextResponse.json({ error: "BRAVE_API_KEY missing" }, { status: 500 });
    const { text } = await req.json();
    if (!text || typeof text !== "string") return NextResponse.json({ error: "Missing 'text'" }, { status: 400 });

    const shingles = makeShingles(text);
    const matches: Record<string, string[]> = {};

    for (const s of shingles) {
      const url = new URL("https://api.search.brave.com/res/v1/web/search");
      url.searchParams.set("q", `"${s}"`);
      url.searchParams.set("count", "5");
      const r = await fetch(url.toString(), { headers: { "X-Subscription-Token": BRAVE_API_KEY } });
      if (!r.ok) continue;
      const data = await r.json();
      const hits = (data?.web?.results || []).map((x: any) => x.url);
      if (hits.length) matches[s] = hits;
    }

    const uniqueUrls = Array.from(new Set(Object.values(matches).flat()));
    return NextResponse.json({ shinglesChecked: shingles.length, matches, uniqueUrls });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}