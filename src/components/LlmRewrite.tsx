// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/components/LlmRewrite.tsx
'use client';

import { useEffect, useState } from 'react';
type RewriteResponse = {
  rewritten?: string;
  error?: string;
};

export function LlmRewrite({ source, lang }:{ source:string; lang:'en'|'fi'|'et' }) {
  const [available, setAvailable] = useState<boolean>(false);
  const [style, setStyle] = useState<'concise'|'neutral'|'friendly'|'formal'>('neutral');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RewriteResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/api/status').then(r=>r.json()).then(j=>setAvailable(!!j.openaiConfigured)).catch(()=>setAvailable(false));
  }, []);

  async function run() {
    setLoading(true); setError(''); setResult(null);
    try {
      const r = await fetch('/api/llm/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: source, style, lang }),
      });
      if (r.status === 503) {
        setError('OpenAI is not configured. Add OPENAI_API_KEY in Vercel → Settings → Environment Variables.');
      } else if (!r.ok) {
        const txt = await r.text();
        setError(`Request failed: ${txt}`);
      } else {
        const data: RewriteResponse = await r.json();
        setResult(data);
      }
    } catch (e: unknown) {
      setError(String((e as Error)?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-700 p-4 bg-slate-900 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Rewrite (LLM)</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Tone</label>
          <select
            value={style}
            onChange={e=>setStyle(e.target.value as any)}
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
            title={available ? '' : 'Add OPENAI_API_KEY in Vercel settings'}
          >
            {loading ? 'Working…' : 'Rewrite'}
          </button>
        </div>
      </div>

      {!available && (
        <p className="text-xs text-amber-400">
          Not configured: set <code>OPENAI_API_KEY</code> in Vercel → Project → Settings → Environment Variables.
        </p>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}

      {result?.rewritten && (
        <div>
          <label className="text-sm text-slate-400">Result</label>
          <textarea
            className="mt-1 w-full min-h-[160px] rounded-xl bg-slate-950 border border-slate-700 p-3 text-slate-100"
            value={result.rewritten}
            onChange={(e)=>setResult({ ...result, rewritten: e.target.value })}
          />
        </div>
      )}
    </section>
  );
}
