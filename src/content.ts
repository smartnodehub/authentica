// Mapping: Project=Authentica | Domains=fastingclock.com,auditexpertai.com,smartlotteri.com | AdSenseSlot=3748465240 | AdSensePublisher=ca-pub-7058115116105378
// File: src/content.ts
export type Lang = 'en' | 'fi' | 'et';

type Dict = Record<
  Lang,
  {
    reportTitle: string;
    clarity: string;
    looksClear: string;
    repetition: string;
    lowRepetition: string;
    toxicityRisk: string;
    noToxicity: string;
    selfOverlap: string;
    selfOverlapDesc: string; // {percent} placeholder
    noteLocalHistory: string;

    potentialClaims: string;
    basics: string;
    words: string;
    sentences: string;
    readingEase: string;

    analyzeAnother: string;

    // Rewrite (LLM) block
    rewriteTitle: string;
    tone: string;
    notConfigured: string;
    result: string;
    working: string;
    rewriteBtn: string;

    // Errors
    requestFailedPrefix: string; // "Request failed" / "Päring ebaõnnestus" / "Pyyntö epäonnistui"
    httpPrefix: string;          // "HTTP"
  }
>;

export const content: Dict = {
  en: {
    reportTitle: 'Analysis Report',
    clarity: 'Clarity',
    looksClear: 'Looks clear.',
    repetition: 'Repetition',
    lowRepetition: 'Low repetition.',
    toxicityRisk: 'Toxicity risk',
    noToxicity: 'No obvious toxicity.',
    selfOverlap: 'Self-overlap',
    selfOverlapDesc: 'Estimated overlap with your previous inputs (same browser): {percent}%',
    noteLocalHistory: 'Note: This demo compares only against your local history (not the web).',

    potentialClaims: 'Potential factual claims',
    basics: 'Basics',
    words: 'Words',
    sentences: 'Sentences',
    readingEase: 'Reading ease',

    analyzeAnother: 'Analyze another',

    rewriteTitle: 'Rewrite (LLM)',
    tone: 'Tone',
    notConfigured: 'Not configured: set OPENAI_API_KEY in Vercel → Project → Settings → Environment Variables.',
    result: 'Result',
    working: 'Working…',
    rewriteBtn: 'Rewrite',

    requestFailedPrefix: 'Request failed',
    httpPrefix: 'HTTP',
  },

  fi: {
    reportTitle: 'Analyysiraportti',
    clarity: 'Selkeys',
    looksClear: 'Näyttää selkeältä.',
    repetition: 'Toisto',
    lowRepetition: 'Vähän toistoa.',
    toxicityRisk: 'Myrkyllisyyden riski',
    noToxicity: 'Ei ilmeistä toksisuutta.',
    selfOverlap: 'Oman tekstin päällekkäisyys',
    selfOverlapDesc: 'Arvioitu päällekkäisyys aiempien syötteidesi kanssa (samassa selaimessa): {percent}%',
    noteLocalHistory: 'Huom: Tämä demo vertaa vain paikalliseen historiaasi (ei verkosta).',

    potentialClaims: 'Mahdolliset väitteet',
    basics: 'Perustiedot',
    words: 'Sanat',
    sentences: 'Lauseet',
    readingEase: 'Luettavuus',

    analyzeAnother: 'Analysoi toinen',

    rewriteTitle: 'Uudelleenkirjoitus (LLM)',
    tone: 'Sävy',
    notConfigured: 'Ei konfiguroitu: lisää OPENAI_API_KEY Verceliin → Project → Settings → Environment Variables.',
    result: 'Tulos',
    working: 'Työstetään…',
    rewriteBtn: 'Uudelleenkirjoita',

    requestFailedPrefix: 'Pyyntö epäonnistui',
    httpPrefix: 'HTTP',
  },

  et: {
    reportTitle: 'Analüüsiraport',
    clarity: 'Selgus',
    looksClear: 'Paistab selge.',
    repetition: 'Kordus',
    lowRepetition: 'Vähe kordust.',
    toxicityRisk: 'Toksilisuse risk',
    noToxicity: 'Ilmselge toksilisus puudub.',
    selfOverlap: 'Iseendaga kattuvus',
    selfOverlapDesc: 'Hinnanguline kattuvus sinu varasemate sisenditega (samas brauseris): {percent}%',
    noteLocalHistory: 'Märkus: See demo võrdleb ainult sinu kohaliku ajaloo vastu (mitte veebiga).',

    potentialClaims: 'Võimalikud faktilised väited',
    basics: 'Põhiandmed',
    words: 'Sõnu',
    sentences: 'Lauseid',
    readingEase: 'Loetavus',

    analyzeAnother: 'Analüüsi veel',

    rewriteTitle: 'Ümberkirjutus (LLM)',
    tone: 'Toon',
    notConfigured: 'Pole seadistatud: lisa OPENAI_API_KEY Vercel → Project → Settings → Environment Variables.',
    result: 'Tulemus',
    working: 'Töötan…',
    rewriteBtn: 'Kirjuta ümber',

    requestFailedPrefix: 'Päring ebaõnnestus',
    httpPrefix: 'HTTP',
  },
};

// Turvaline tõlkefunktsioon: fi/et puudumisel kukub tagasi inglise keelele
export function t(lang: Lang, key: keyof Dict['en'], vars?: Record<string, string | number>) {
  const base = content.en[key];
  const localized = (content[lang]?.[key] ?? base) as string;
  if (!vars) return localized;
  return Object.keys(vars).reduce(
    (s, k) => s.replace(new RegExp(`\{${k}\}`, 'g'), String(vars[k])),
    localized
  );
}
