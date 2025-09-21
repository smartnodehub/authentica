import { fetchWithRetry } from "./http";

export type TavilyResult = {
  title: string;
  url: string;
  content?: string;     // summary/snippet, kui olemas
  score?: number;       // kui API tagastab hinnangu
  raw?: unknown;        // debug/diag
};

export async function tavilySearch(query: string, lang?: string) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("Missing TAVILY_API_KEY");

  const body = {
    query,
    search_depth: "basic",
    include_answer: true,
    include_images: false,
    include_domains: [],
    exclude_domains: [],
    max_results: 8,
    // Tavily on geo-agnostiline; keele vihje
    // (kui sinu plaanis on ‘lang’ parameeter lubatud):
    ...(lang ? { language: lang } : {})
  };

  const res = await fetchWithRetry("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Tavily-Api-Key": apiKey
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tavily error ${res.status}: ${text}`);
  }

  const data = await res.json();
  // Normaliseeri
  const items: TavilyResult[] = (data?.results ?? []).map((r: Record<string, unknown>) => ({
    title: String(r.title),
    url: String(r.url),
    content: typeof r.content === 'string' ? r.content : (typeof r.snippet === 'string' ? r.snippet : ''),
    score: typeof r.score === 'number' ? r.score : undefined,
    raw: r
  }));

  const answer: string | undefined = data?.answer;
  return { items, answer, raw: data };
}
