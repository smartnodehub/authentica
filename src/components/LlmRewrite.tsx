
'use client';
// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/components/LlmRewrite.tsx

import { useEffect, useState } from 'react';
import { t, Lang } from '@/content';

type Tone = 'concise' | 'neutral' | 'friendly' | 'formal';
type StatusJson = { openaiConfigured: boolean };
type RewriteJson = { rewritten?: string; error?: string };

export function LlmRewrite({ source, lang }: { source: string; lang: Lang }) {
  const [available, setAvailable] = useState<boolean>(false);
  const [style, setStyle] = useState<Tone>('neutral');
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then((j: StatusJson) => setAvailable(!!j.openaiConfigured))
      .catch(() => setAvailable(false));
  }, []);

  async function run() {
    setLoading(true);
    setError('');
    setOut('');
    try {
      const r = await fetch('/api/llm/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: source, style, lang }),
      });

      if (r.status === 503) {
        setError(t(lang, 'notConfigured'));
        return;
      }

      const ct = r.headers.get('content-type') || '';
      if (!r.ok) {
        const payload = ct.includes('application/json') ? await r.json() : await r.text();
        const message =
          typeof payload === 'string'
            ? payload || '(empty body)'
            : (payload?.error as string) || JSON.stringify(payload);
        setError(`${t(lang, 'requestFailedPrefix')}: ${t(lang, 'httpPrefix')} ${r.status} — ${message}`);
        return;
      }

      const j: RewriteJson = ct.includes('application/json')
        ? await r.json()
        : { error: 'Unexpected content-type from API' };

      if (j.error) {
        setError(j.error);
        return;
      }
      setOut(j.rewritten ?? '');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(`${t(lang, 'requestFailedPrefix')}: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  function onToneChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    const next = ev.target.value as Tone;
    setStyle(next);
  }

  return (
<<<<<<< HEAD
    <div className="glow-text-green">
      <section className="rounded-xl border border-slate-700 p-4 bg-slate-900 space-y-3">
=======
    <section className="rounded-xl border border-slate-700 p-4 bg-slate-900 space-y-3">
>>>>>>> bad37e7dfe6b4f2598f52e103eeb498fe8e0d4b5
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t(lang, 'rewriteTitle')}</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400" htmlFor="tone">
            {t(lang, 'tone')}
          </label>
          <select
            id="tone"
            value={style}
            onChange={onToneChange}
            className="rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-sm"
          >
            <option value="neutral">Neutral</option>
            <option value="concise">Concise</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
          <button
            onClick={run}
            disabled={!available || !source?.trim() || loading}
            className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-600 disabled:opacity-50"
            title={available ? '' : t(lang, 'notConfigured')}
          >
            {loading ? t(lang, 'working') : t(lang, 'rewriteBtn')}
          </button>
        </div>
      </div>

      {!available && (
        <p className="text-xs text-amber-400">
          {t(lang, 'notConfigured')}
        </p>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {out && (
        <div>
<<<<<<< HEAD
          <label className="text-sm" htmlFor="rewrite-out">
=======
          <label className="text-sm text-slate-400" htmlFor="rewrite-out">
>>>>>>> bad37e7dfe6b4f2598f52e103eeb498fe8e0d4b5
            {t(lang, 'result')}
          </label>
          <textarea
            id="rewrite-out"
<<<<<<< HEAD
            className="mt-1 w-full min-h-[160px] rounded-xl bg-slate-950 border border-slate-700 p-3"
=======
            className="mt-1 w-full min-h-[160px] rounded-xl bg-slate-950 border border-slate-700 p-3 text-slate-100"
>>>>>>> bad37e7dfe6b4f2598f52e103eeb498fe8e0d4b5
            value={out}
            onChange={(e) => setOut(e.target.value)}
          />
        </div>
      )}
<<<<<<< HEAD
      </section>
    </div>
=======
    </section>
>>>>>>> bad37e7dfe6b4f2598f52e103eeb498fe8e0d4b5
  );
}
