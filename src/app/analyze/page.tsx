// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/analyze/page.tsx
// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/analyze/page.tsx
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import DetectionResult from '@/components/DetectionResult';
import { formatDetectionResponse } from '@/lib/formatDetection';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function AnalyzeClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const lang = (sp.get('lang') ?? 'en') as 'en' | 'fi' | 'et';
  const [text, setText] = useState('');
  const [detectionResult, setDetectionResult] = useState<any>(null);

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
  }), []);

  useEffect(() => {
    if (text) {
      const timeout = setTimeout(() => {
        fetch('/api/detect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, lang }),
        })
          .then((res) => res.json())
          .then((data) => {
            setDetectionResult(data);
            router.replace(`/analyze?lang=${lang}&uid=${uid()}`);
          });
      }, 300);

      return () => clearTimeout(timeout);
    } else {
      setDetectionResult(null);
    }
  }, [text, lang, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Suspense fallback={<div>Loading...</div>}>
        <LanguageSwitch />
      </Suspense>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          {t[lang].title}
        </h1>

        <div className="mt-6 flex max-w-4xl flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t[lang].placeholder}
            className="w-full rounded-md border-2 border-gray-300 p-4 text-lg focus:border-blue-500 focus:outline-none"
            rows={10}
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setText('')}
              className="rounded-md bg-red-500 px-4 py-2 text-white transition-all hover:bg-red-600"
            >
              {t[lang].clear}
            </button>

            <button
              onClick={() => {
                if (text) {
                  fetch('/api/detect', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text, lang }),
                  })
                    .then((res) => res.json())
                    .then((data) => setDetectionResult(data));
                }
              }}
              className="rounded-md bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600"
            >
              {t[lang].analyze}
            </button>
          </div>
        </div>

        {detectionResult && (
          <div className="mt-10 w-full max-w-4xl rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-2xl font-semibold">
              Detection Result
            </h2>

            <div className="mt-4">
              <DetectionResult
                label={detectionResult.label}
                score={detectionResult.score}
                reasons={detectionResult.reasons}
              />
            </div>
          </div>
        )}

        <div className="mt-10 text-sm text-gray-500">
          {t[lang].note}
        </div>
      </main>
    </div>
  );
}

export default AnalyzeClient;
