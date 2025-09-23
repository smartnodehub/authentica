'use client';
import { useMemo, useState } from 'react';

export default function DemoExample() {
  const [txt, setTxt] = useState('');

  const { clarity, repetition, risks } = useMemo(() => {
    const words = txt.toLowerCase().split(/\s+/).filter(Boolean);
    const unique = new Set(words).size || 1;
    const repRatio = words.length ? 1 - unique / words.length : 0;

    const clarityScore = Math.max(0, Math.min(100, 100 - Math.floor(repRatio * 60)));
    const repetitionScore = Math.max(0, Math.min(100, Math.floor(repRatio * 100)));
    const riskScore = 0;

    return { clarity: clarityScore, repetition: repetitionScore, risks: riskScore };
  }, [txt]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Your Text</h3>
        <textarea
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          placeholder="Paste your text here…"
          className="w-full min-h-[12rem] rounded border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/40 p-3
                     text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3">Analysis Report</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl p-3 text-center bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <div className="text-sm" style={{ color: '#9FFF00' }}>Clarity</div>
            <div className="text-2xl font-bold glow-number">{clarity}</div>
          </div>
          <div className="rounded-xl p-3 text-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
            <div className="text-sm" style={{ color: '#9FFF00' }}>Repetition</div>
            <div className="text-2xl font-bold glow-number">{repetition}</div>
          </div>
          <div className="rounded-xl p-3 text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
            <div className="text-sm" style={{ color: '#9FFF00' }}>Risk</div>
            <div className="text-2xl font-bold glow-number">{risks}</div>
          </div>
        </div>
      </div>
    </section>
  );
}