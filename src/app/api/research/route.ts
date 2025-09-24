import { NextRequest, NextResponse } from "next/server";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY!;
const BRAVE_API_KEY  = process.env.BRAVE_API_KEY!;

async function tavilySearch(q: string) {
  if (!TAVILY_API_KEY) return null;
  const r = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${TAVILY_API_KEY}` },
    body: JSON.stringify({ query: q, search_depth: "basic", max_results: 5 }),
  });
  if (!r.ok) return null;
  return r.json();
}

async function braveSearch(q: string) {
  if (!BRAVE_API_KEY) return null;
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", q);
  url.searchParams.set("count", "5");
  const r = await fetch(url.toString(), {
    headers: { "X-Subscription-Token": BRAVE_API_KEY, "Accept": "application/json" },
  });
  if (!r.ok) return null;
  return r.json();
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") return NextResponse.json({ error: "Missing 'query'" }, { status: 400 });

    const tav = await tavilySearch(query);
    if (tav?.results?.length) {
      const links = tav.results.map((r: any) => ({ title: r.title, url: r.url, snippet: r.content?.slice(0, 200) || "" }));
      return NextResponse.json({ provider: "tavily", links });
    }

    const br = await braveSearch(query);
    if (br?.web?.results?.length) {
      const links = br.web.results.map((r: any) => ({ title: r.title, url: r.url, snippet: r.description || "" }));
      return NextResponse.json({ provider: "brave", links });
    }

    return NextResponse.json({ provider: null, links: [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}