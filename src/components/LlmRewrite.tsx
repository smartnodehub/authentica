// Mapping: Project=Authentica | Domains=fastingclock.com,auditexpertai.com,smartlotteri.com | AdSenseSlot=3748465240 | AdSensePublisher=ca-pub-7058115116105378
// File: src/components/LlmRewrite.tsx
'use client';

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
    <section className="rounded-xl border border-slate-700 p-4 bg-slate-900 space-y-3">
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
          <label className="text-sm text-slate-400" htmlFor="rewrite-out">
            {t(lang, 'result')}
          </label>
          <textarea
            id="rewrite-out"
            className="mt-1 w-full min-h-[160px] rounded-xl bg-slate-950 border border-slate-700 p-3 text-slate-100"
            value={out}
            onChange={(e) => setOut(e.target.value)}
          />
        </div>
      )}
    </section>
  );
}
// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/components/LlmRewrite.tsx
'use client';

import { useState } from 'react';

type Tone = 'concise' | 'neutral' | 'friendly' | 'formal';
type RewriteJson = { rewritten?: string; error?: string };

export function LlmRewrite({ source, lang }: { source: string; lang: 'en' | 'fi' | 'et' }) {
  const [style, setStyle] = useState<Tone>('neutral');
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Removed unused 'available' state and related effect

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
        setError('OpenAI is not configured. Add OPENAI_API_KEY in Vercel → Settings → Environment Variables.');
        return;
      }
      if (!r.ok) {
        const txt = await r.text();
        setError(`Request failed: ${txt}`);
        return;
      }
      const j: RewriteJson = await r.json();
      setOut(j.rewritten ?? '');
      if (!j.rewritten && j.error) setError(j.error);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function onToneChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    const next = ev.target.value as Tone;
    setStyle(next);
  }

  return (
    <section className="rounded-xl border border-slate-700 p-4 bg-slate-900 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rewrite (LLM)</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400" htmlFor="tone">
            Tone
          </label>
          <select
            id="tone"
            value={style}
            onChange={onToneChange}
            className="rounded border border-slate-700 bg-slate-800 text-slate-200 px-2 py-1 text-sm"
            disabled={loading}
          >
            <option value="concise">Concise</option>
            <option value="neutral">Neutral</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
          </select>
        </div>
      </div>
      <button
        className="mt-2 px-4 py-2 rounded bg-blue-600 text-white disabled:bg-blue-900"
        onClick={run}
        disabled={loading}
      >
        {loading ? 'Rewriting...' : 'Rewrite'}
      </button>
      {error && (
        <div className="mt-2 text-red-400 text-sm">{error}</div>
      )}
      {out && (
        <div className="mt-2 p-2 bg-slate-800 rounded text-slate-100 whitespace-pre-line">{out}</div>
      )}
    </section>
  );
}
