// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/analyze/page.tsx
// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/analyze/page.tsx
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LanguageSwitch } from '@/components/LanguageSwitch';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function AnalyzeClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const lang = (sp.get('lang') ?? 'en') as 'en' | 'fi' | 'et';
  const [text, setText] = useState('');

  const t = useMemo(() => ({
    en: {
      title: 'Paste your text',
      placeholder: 'Paste or type text here…',
      analyze: 'Analyze',
      clear: 'Clear',
      note: 'Local demo: your text is processed only in this browser.',
    },
    fi: {
      title: 'Liitä tekstisi',
      placeholder: 'Liitä tai kirjoita teksti tähän…',
      analyze: 'Analysoi',
      clear: 'Tyhjennä',
      note: 'Paikallinen demo: teksti käsitellään vain tässä selaimessa.',
    },
    et: {
      title: 'Kleebi oma tekst',
      placeholder: 'Kleebi või kirjuta tekst siia…',
      analyze: 'Analüüsi',
      clear: 'Tühjenda',
      note: 'Kohalik demo: sinu teksti töödeldakse ainult selles brauseris.',
    },
  }[lang]), [lang]);

  useEffect(() => {
    const d = localStorage.getItem('authentica_last_draft');
    if (d) setText(d);
  }, []);

  function onAnalyze() {
    const id = uid();
    const payload = { id, lang, text, createdAt: Date.now() };
    localStorage.setItem(`authentica_doc_${id}`, JSON.stringify(payload));
    const histKey = 'authentica_text_history';
    const history = JSON.parse(localStorage.getItem(histKey) || '[]') as string[];
    history.unshift(text);
    localStorage.setItem(histKey, JSON.stringify(history.slice(0, 10)));
    localStorage.setItem('authentica_last_draft', text);
    router.push(`/report/${id}?lang=${lang}`);
  }

  function onClear() {
    setText('');
    localStorage.removeItem('authentica_last_draft');
  }

  return (
    <main className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">{t.title}</h1>
        <LanguageSwitch />
      </header>

      <textarea
        className="w-full min-h-[280px] rounded-xl bg-slate-900 border border-slate-700 p-4 outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={t.placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={onAnalyze}
          disabled={!text.trim()}
          className="rounded-xl bg-indigo-500 px-5 py-3 font-medium hover:bg-indigo-600 disabled:opacity-50"
        >
          {t.analyze}
        </button>
        <button
          onClick={onClear}
          className="rounded-xl border border-slate-700 px-5 py-3 font-medium hover:bg-slate-800"
        >
          {t.clear}
        </button>
      </div>

      <p className="text-sm text-slate-400">{t.note}</p>
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<main className="text-slate-400">Loading…</main>}>
      <AnalyzeClient />
    </Suspense>
  );
}
