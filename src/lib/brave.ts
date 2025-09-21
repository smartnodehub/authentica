import { fetchWithRetry } from "./http";

export type BraveResult = {
  title: string;
  url: string;
  description?: string;
  raw?: unknown;
};

type BraveOpts = {
  country?: string; // "FI", "US" jne (oma loogika, Brave API ei vaja alati)
  lang?: string;    // "fi", "en" jne (oma loogika)
  count?: number;   // mitu tulemust
};

export async function braveSearch(query: string, opts: BraveOpts = {}) {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) throw new Error("Missing BRAVE_API_KEY");

  const params = new URLSearchParams({
    q: query,
    count: String(opts.count ?? 8),
    // Brave ametlikud parameetrid on minimaalsed; osa geo/keele loogikast on sinu kihis.
    // Lisaparameetreid (freshness, safesearch jmt) võid lisada hiljem.
  });

  const res = await fetchWithRetry(`https://api.search.brave.com/res/v1/web/search?${params.toString()}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "X-Subscription-Token": apiKey
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brave error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const web = data?.web?.results ?? [];

  const items: BraveResult[] = web.map((r: Record<string, unknown>) => ({
    title: String(r.title),
    url: String(r.url),
    description: typeof r.description === 'string' ? r.description : undefined,
    raw: r
  }));

  return { items, raw: data };
}
