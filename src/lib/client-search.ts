export async function getEvidence(query: string, lang?: "en"|"fi"|"et"|"de", country?: string) {
  const res = await fetch("/api/search/evidence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, lang, country, minItems: 3 })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function checkPlagiarism(text: string, lang?: "en"|"fi"|"et"|"de", country?: string) {
  const res = await fetch("/api/search/plagiarism", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, lang, country, topK: 5 })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
