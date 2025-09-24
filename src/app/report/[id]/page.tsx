"use client";

import { useMemo, useState } from "react";
import Select from "@/components/Select";

const WRITING_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const LANGS = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "fi-FI", label: "Suomi" },
  { code: "de-DE", label: "Deutsch" },
] as const;

export default function Page() {
  // Controls
  const [level, setLevel] = useState<(typeof WRITING_LEVELS)[number]>("Intermediate");
  const [lang, setLang] = useState("en-US");

  // Text IO
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [out, setOut] = useState("");

  // Counter
  const wordsUsed = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);

  function humanizeNow() {
    setIsLoading(true);
    setOut("");
    setTimeout(() => {
      const tweaked =
        (text || "").replace(/\bAI\b/g, "the system").concat(
          `\n\n[${level} · ${LANGS.find((l) => l.code === lang)?.label}]`
        );
      setOut(tweaked);
      setIsLoading(false);
    }, 900);
  }

  return (
    <div className="space-y-8">
      {/* HERO TEXT – asetus topbari ja paneelide vahel */}
      <section className="text-center pt-6">
        <span className="inline-block text-xs font-bold tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 px-3 py-1 rounded-full">
          TRUSTED BY 350,000+ USERS
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold">
          Humanize AI Text & Outsmart AI Detectors
        </h1>
        <p className="mt-3 max-w-3xl mx-auto text-slate-600 dark:text-slate-300">
          Convert machine-sounding drafts into clear, natural writing—without losing your meaning.
        </p>
      </section>

      {/* HUMANIZER CARD */}
      <section className="rounded-2xl bg-white/85 dark:bg-slate-900/70 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-lg">
        {/* Header controls (right side like screenshot two) */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Writing Level</span>
            <Select value={level} onChange={setLevel} options={WRITING_LEVELS.map(v => ({ value: v, label: v }))} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Default</span>
            <Select value={lang} onChange={setLang} options={LANGS.map(l => ({ value: l.code, label: l.label }))} />
          </div>
        </div>

        {/* Two panels (equal height, auto-scroll on overflow) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* INPUT */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <label htmlFor="humanizer-input" className="font-semibold">Your Text</label>
            </div>
            <div className="p-4">
              <div className="h-[420px]">
                <textarea
                  id="humanizer-input"
                  aria-label="Input text"
                  className="w-full h-full resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 p-3"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => { /* optional AI check */ }}
                  className="btn-ghost"
                  type="button"
                >
                  Check for AI
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">{wordsUsed} / 2000 words</span>
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

          {/* OUTPUT */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold">Output</h3>
            </div>

            <div className="p-4">
              <div className="h-[420px] overflow-auto whitespace-pre-wrap">
                {isLoading ? (
                  <div className="h-full w-full flex items-center justify-center gap-3 text-slate-500">
                    <span className="spinner" aria-hidden />
                    <span>Humanizing</span>
                  </div>
                ) : (
                  <div className="text-slate-800 dark:text-slate-100">
                    {out || <span className="text-slate-400">Your humanized text will appear here…</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
