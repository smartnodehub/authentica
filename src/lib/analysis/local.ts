// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/lib/analysis/local.ts
export type AnalysisResult = {
  wordCount: number;
  sentenceCount: number;
  readingEase: number;
  clarityScore: number;      // 0–100 (higher better)
  repetitionScore: number;   // 0–100 (lower better repetition → higher score)
  toxicityRisk: number;      // 0–100 (lower better)
  selfOverlapPercent: number;// 0–100
  bestMatchSnippet?: string;
  claims: string[];
  hints: { clarity: string; repetition: string; toxicity: string };
};

const FILLERS = [
  'actually','basically','literally','very','really','just','kind of','sort of',
  'obviously','clearly','in fact','honestly'
];

const TOXIC_WORDS = [
  'idiot','stupid','dumb','trash','hate','kill','useless','shut up','loser'
];

function sentencesOf(text: string): string[] {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[\.!\?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function wordsOf(text: string): string[] {
  return text.toLowerCase().match(/[a-zäöõüšžà-ÿ0-9']+/gi) ?? [];
}

function fleschReadingEase(words: number, sentences: number, syllables: number): number {
  // English Flesch approximation; for FI/ET this is a rough proxy.
  if (sentences === 0 || words === 0) return 0;
  return Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words))));
}

function approxSyllables(word: string): number {
  const m = word.toLowerCase().match(/[aeiouyäöõüioaeu]+/g);
  return Math.max(1, m ? m.length : 1);
}

function shingles(tokens: string[], k = 3): string[] {
  const arr: string[] = [];
  for (let i = 0; i <= tokens.length - k; i++) arr.push(tokens.slice(i, i + k).join(' '));
  return arr;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = new Set([...a].filter(x => b.has(x)));
  const uni = new Set([...a, ...b]);
  if (uni.size === 0) return 0;
  return inter.size / uni.size;
}

function history(): string[] {
  try {
    return JSON.parse(localStorage.getItem('authentica_text_history') || '[]') as string[];
  } catch { return []; }
}

function bestSelfOverlap(text: string): { percent: number; snippet?: string } {
  const tokens = wordsOf(text);
  const shA = new Set(shingles(tokens, 3));
  let best = 0;
  let bestSnippet: string | undefined;

  for (const h of history()) {
    const shB = new Set(shingles(wordsOf(h), 3));
    const jac = jaccard(shA, shB);
    if (jac > best) {
      best = jac;
      // Take a common 3-gram as snippet
      const common = [...shA].find(s => shB.has(s));
      bestSnippet = common;
    }
  }
  return { percent: Math.round(best * 100), snippet: bestSnippet };
}

function claimCandidates(text: string): string[] {
  const sents = sentencesOf(text);
  const claims: string[] = [];
  for (const s of sents) {
    const hasNumber = /\b\d{1,4}([.,]\d+)?\b/.test(s);
    const hasDate = /\b(20\d{2}|19\d{2})\b/.test(s);
    const patterns = /( is | are | equals | results in | causes | proves | shows | claims | väidab | on | ovat )/i.test(s);
    if ((hasNumber || hasDate || patterns) && s.length > 20) claims.push(s);
  }
  return claims.slice(0, 25);
}

export function analyzeText(text: string, _lang: 'en'|'fi'|'et'): AnalysisResult {
  void _lang; // märgib muutujat "kasutatuks" – käitumist ei muuda
  const sents = sentencesOf(text);
  const words = wordsOf(text);
  const syllables = words.reduce((acc, w) => acc + approxSyllables(w), 0);
  const readingEase = fleschReadingEase(words.length, sents.length, syllables);

  // Clarity (100 → clear). Penalize long sentences and fillers.
  const avgLen = sents.length ? words.length / sents.length : words.length;
  const fillerHits = FILLERS.reduce((n, f) => n + (text.toLowerCase().includes(f) ? 1 : 0), 0);
  const clarity = 100 - Math.min(60, Math.max(0, Math.round((avgLen - 20) * 2))) - Math.min(20, fillerHits * 3);

  // Repetition (100 → low repetition). Penalize repeated 3-grams.
  const sh = shingles(words, 3);
  const counts = new Map<string, number>();
  for (const g of sh) counts.set(g, (counts.get(g) || 0) + 1);
  const repeats = [...counts.values()].filter(v => v > 1).length;
  const repetition = Math.max(10, 100 - Math.min(70, repeats * 2));

  // Toxicity risk (0 → no risk). Count toxic words.
  const toxicHits = TOXIC_WORDS.reduce((n, w) => n + (text.toLowerCase().includes(w) ? 1 : 0), 0);
  const toxicity = Math.min(100, toxicHits * 15);

  // Self-overlap vs prior inputs (local demo only)
  const { percent: overlap, snippet } = bestSelfOverlap(text);

  // Hints
  const hints = {
    clarity: clarity < 70 ? 'Shorten long sentences, remove fillers, prefer active voice.' : 'Looks clear.',
    repetition: repetition < 70 ? 'Reduce repeated phrases or restructure paragraphs.' : 'Low repetition.',
    toxicity: toxicity > 0 ? 'Remove or rephrase potentially harmful words.' : 'No obvious toxicity.',
  };

  return {
    wordCount: words.length,
    sentenceCount: sents.length,
    readingEase,
    clarityScore: Math.max(0, Math.min(100, Math.round(clarity))),
    repetitionScore: Math.max(0, Math.min(100, Math.round(repetition))),
    toxicityRisk: Math.max(0, Math.min(100, Math.round(toxicity))),
    selfOverlapPercent: overlap,
    bestMatchSnippet: snippet,
    claims: claimCandidates(text),
    hints,
  };
}
