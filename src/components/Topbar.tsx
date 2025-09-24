"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Lang = { code: string; label: string; flag: string };

const LANGS: Lang[] = [
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "fi-FI", label: "Suomi",       flag: "🇫🇮" },
  { code: "de-DE", label: "Deutsch",     flag: "🇩🇪" },
  { code: "et-EE", label: "Eesti",       flag: "🇪🇪" },
  { code: "sv-SE", label: "Svenska",     flag: "🇸🇪" },
];

export default function Topbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<string>("en-US");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // --- Dark mode init + persist ---
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as "light" | "dark" | null;
    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
  }, []);
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Language init + persist ---
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("lang")) as string | null;
    if (stored && LANGS.some(l => l.code === stored)) setLang(stored);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("lang", lang);
  }, [lang]);

  // Close dropdown on click outside / Esc
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const current = LANGS.find(l => l.code === lang) ?? LANGS[0];

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Logo → viib alati "/" peale */}
        <Link
          href="/"
          aria-label="Go to home"
          className="text-lg font-semibold inline-flex items-center gap-2 px-2 py-1 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          Authentica
        </Link>

        {/* Parempoolsed nupud */}
        <nav className="relative flex items-center gap-3 sm:gap-4">
          <a className="btn-ghost" href="/login" aria-label="Log in">Log in</a>

          {/* Language dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              className="btn-ghost"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label="Language menu"
              onClick={() => setOpen(v => !v)}
            >
              <span className="mr-2" aria-hidden>{current.flag}</span>
              {current.label}
              <span className="ml-2" aria-hidden>▾</span>
            </button>

            {open && (
              <ul
                role="listbox"
                className="absolute right-0 mt-2 z-30 min-w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-1"
              >
                {LANGS.map(l => (
                  <li key={l.code}>
                    <button
                      role="option"
                      aria-selected={lang === l.code}
                      className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${lang === l.code ? "font-semibold" : ""}`}
                      onClick={() => { setLang(l.code); setOpen(false); }}
                    >
                      <span className="mr-2" aria-hidden>{l.flag}</span>
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <a className="btn-ghost" href="/pricing" aria-label="Pricing">Pricing</a>
          <button
            className="btn-accent"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-pressed={theme === "dark"}
            aria-label="Toggle light or dark theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </nav>
      </div>
    </header>
  );
}