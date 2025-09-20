// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/report/[id]/page.tsx
// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/report/[id]/page.tsx
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { analyzeText, type AnalysisResult } from '@/lib/analysis/local';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { ScoreCard } from '@/components/ScoreCard';
import { ClaimList } from '@/components/ClaimList';
import { OverlapSummary } from '@/components/OverlapSummary';

function ReportClient() {
  const params = useParams<{ id: string }>();
  const sp = useSearchParams();
  const lang = (sp.get('lang') ?? 'en') as 'en' | 'fi' | 'et';

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [original, setOriginal] = useState<string>('');

  const t = useMemo(() => ({
    en: { title: 'Analysis report', back: 'Analyze another', clearHist: 'Clear self-overlap history' },
    fi: { title: 'Analyysiraportti', back: 'Analysoi toinen', clearHist: 'Tyhjennä itse-vertailun historia' },
    et: { title: 'Analüüsiraport', back: 'Analüüsi uut teksti', clearHist: 'Tühjenda enesekattuvuse ajalugu' },
  }[lang]), [lang]);

  useEffect(() => {
    const raw = localStorage.getItem(`authentica_doc_${params.id}`);
    if (!raw) return;
    const { text } = JSON.parse(raw) as { text: string };
    setOriginal(text);
    setResult(analyzeText(text, lang));
  }, [params.id, lang]);

  function clearHistory() {
    localStorage.removeItem('authentica_text_history');
    if (original) setResult(analyzeText(original, lang));
  }

  if (!result) {
    return <main><p className="text-slate-400">No data found. Go back to Analyze.</p></main>;
  }

  return (
    <main className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">{t.title}</h1>
        <LanguageSwitch />
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <ScoreCard title="Clarity" value={result.clarityScore} hint={result.hints.clarity}/>
        <ScoreCard title="Repetition" value={result.repetitionScore} hint={result.hints.repetition}/>
        <ScoreCard title="Toxicity risk" value={result.toxicityRisk} hint={result.hints.toxicity}/>
      </div>

      <OverlapSummary percent={result.selfOverlapPercent} bestMatch={result.bestMatchSnippet} />

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Potential factual claims</h2>
        <ClaimList claims={result.claims}/>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Basics</h2>
        <p className="text-slate-300 text-sm">
          Words: {result.wordCount} • Sentences: {result.sentenceCount} • Reading ease: {result.readingEase}
        </p>
      </section>

      <div className="flex gap-3">
        <a href={`/analyze?lang=${lang}`} className="rounded-xl bg-indigo-500 px-5 py-3 font-medium hover:bg-indigo-600">
          {t.back}
        </a>
        <button onClick={clearHistory} className="rounded-xl border border-slate-700 px-5 py-3 font-medium hover:bg-slate-800">
          {t.clearHist}
        </button>
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<main className="text-slate-400">Loading…</main>}>
      <ReportClient />
    </Suspense>
  );
}
