// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/page.tsx
'use client';

import Link from 'next/link';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function HomeClient() {
  const sp = useSearchParams();
  const lang = (sp.get('lang') ?? 'en') as 'en' | 'fi' | 'et';

  const t = {
    en: {
      h1: 'Authentica — Text Analysis (Demo)',
      p: 'Analyze clarity, repetition, risk signals and self-overlap. All local — no external APIs.',
      cta: 'Analyze text',
      legal: 'Demo limitations',
    },
    fi: {
      h1: 'Authentica — Tekstianalyysi (Demo)',
      p: 'Analysoi selkeyttä, toistoa, riskisignaaleja ja omaa päällekkäisyyttä. Kaikki paikallisesti.',
      cta: 'Analysoi teksti',
      legal: 'Demon rajoitukset',
    },
    et: {
      h1: 'Authentica — Tekstianalüüs (Demo)',
      p: 'Analüüsi selgust, kordusi, riskimärke ja enesekattuvust. Kõik töötab lokselt brauseris.',
      cta: 'Analüüsi teksti',
      legal: 'Demo piirangud',
    },
  }[lang];

  return (
    <main className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">{t.h1}</h1>
        <LanguageSwitch />
      </header>

      <p className="text-slate-300 max-w-3xl">{t.p}</p>

      <div className="flex gap-4">
        <Link
          href={`/analyze?lang=${lang}`}
          className="rounded-xl bg-indigo-500 px-5 py-3 font-medium hover:bg-indigo-600 transition"
        >
          {t.cta}
        </Link>
        <Link
          href="/legal/demo"
          className="rounded-xl border border-slate-700 px-5 py-3 font-medium hover:bg-slate-800 transition"
        >
          {t.legal}
        </Link>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<main className="text-slate-400">Loading…</main>}>
      <HomeClient />
    </Suspense>
  );
}
