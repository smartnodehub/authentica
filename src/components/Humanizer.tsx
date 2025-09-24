"use client";

import { useState, useMemo } from "react";
import Select from "./Select";

const WRITING_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export default function Humanizer() {
  const [level, setLevel] = useState<(typeof WRITING_LEVELS)[number]>("Intermediate");
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const wordsUsed = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);

  function humanizeNow() {
    setIsLoading(true);
    setOut("");
    setTimeout(() => {
      const tweaked = text + `\n\n[${level}]`;
      setOut(tweaked);
      setIsLoading(false);
    }, 800);
  }

  return (
    <section className="mt-10 rounded-2xl bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Input */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <label htmlFor="input" className="font-semibold">Your Text</label>
          </div>
          <div className="p-4">
            <textarea
              id="input"
              aria-label="Input text"
              className="w-full h-[360px] resize-none rounded-lg border border-slate-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-950"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* LEFT: sõnaloendur */}
              <div className="text-sm text-slate-500">{wordsUsed} / 2000 words</div>

              {/* RIGHT: Writing Level + Humanize nupp reas koos */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-sm text-slate-500">Writing Level</div>
                <Select
                  value={level}
                  onChange={setLevel}
                  options={WRITING_LEVELS.map(v => ({ value: v, label: v }))}
                />
                <button
                  onClick={humanizeNow}
                  disabled={isLoading || !text.trim()}
                  aria-busy={isLoading}
                  className="btn-primary disabled:opacity-60"
                  type="button"
                >
                  {isLoading ? "Working…" : "Humanize"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold">Output</h3>
          </div>
          <div className="p-4">
            {/* Automaatne scroll: fikseeritud kõrgus + overflow-auto */}
            <div className="h-[360px] overflow-auto whitespace-pre-wrap">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-slate-500">
                  <span className="spinner mr-2" /> Humanizing
                </div>
              ) : (
                <>{out || <span className="text-slate-400">Your humanized text will appear here…</span>}</>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}