"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Select from "./Select";

type Tool = "humanizer" | "detector" | "research" | "plaglite";

const TOOL_LABEL: Record<Tool, string> = {
  humanizer: "Humanize",
  detector: "Detect AI",
  research: "Research",
  plaglite: "Check Plagiarism",
};

const TOOL_BADGE: Record<Tool, string> = {
  humanizer: "Humanizer (OpenAI)",
  detector: "AI Detector (OpenAI)",
  research: "Research (Tavily + Brave)",
  plaglite: "Plagiarism-lite (Brave)",
};

const WRITING_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export default function Humanizer() {
  // aktiivne tööriist
  const [selected, setSelected] = useState<Tool>("humanizer");
  const [level, setLevel] = useState<(typeof WRITING_LEVELS)[number]>("Intermediate");

  // menüü
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [openUp, setOpenUp] = useState(false);

  // IO
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // väljasklõps ja ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) { if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false); }
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") setMenuOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => { document.removeEventListener("mousedown", onDocClick); document.removeEventListener("keydown", onEsc); };
  }, []);

  // automaatne "flip" – kui all pole ruumi, ava menüü üles
  useEffect(() => {
    if (!menuOpen || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const estimatedMenuH = 260;
    const below = window.innerHeight - r.bottom;
    const above = r.top;
    setOpenUp(below < estimatedMenuH && above > below);
  }, [menuOpen]);

  const wordsUsed = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);

  // -------- API-kutsed --------
  async function apiHumanize() {
    const r = await fetch("/api/humanize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, level }),
    });
    const j = await r.json();
    return j.output || JSON.stringify(j, null, 2);
  }
  async function apiDetect() {
    // Kui kasutad mocki: "/api/detect"
    // Kui päris OpenAI route: "/api/detect/llm"
    const r = await fetch("/api/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const j = await r.json();
    return JSON.stringify(j, null, 2);
  }
  async function apiResearch() {
    const r = await fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text }),
    });
    const j = await r.json();
    const lines = (j.links || []).map((l: any) => `• ${l.title} — ${l.url}`).join("\n");
    return lines || JSON.stringify(j, null, 2);
  }
  async function apiPlagLite() {
    const r = await fetch("/api/plaglite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const j = await r.json();
    return JSON.stringify(j, null, 2);
  }

  // käivita aktiivne tööriist
  async function runSelected(tool: Tool = selected) {
    if (!text.trim()) return;
    setIsLoading(true); setOut("");
    try {
      const result =
        tool === "humanizer" ? await apiHumanize()
        : tool === "detector" ? await apiDetect()
        : tool === "research" ? await apiResearch()
        : await apiPlagLite();
      setOut(result);
    } catch (e: any) {
      setOut(`${TOOL_LABEL[tool]} error: ${e?.message || e}`);
    } finally {
      setIsLoading(false);
    }
  }

  // valik rippmenüüst:
  // 1) uuendab aktiivse tööriista
  // 2) sulgeb menüü
  // 3) kui tekst on olemas → KÄIVITAB KOHE analüüsi
  async function onPick(tool: Tool) {
    setSelected(tool);
    setMenuOpen(false);
    if (text.trim()) await runSelected(tool);
  }

  const primaryLabel = TOOL_LABEL[selected]; // püsinupp vahetab teksti vastavalt valikule

  return (
    <section className="mt-10 rounded-2xl bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* INPUT */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <label htmlFor="input" className="font-semibold">Your Text</label>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              Selected: {TOOL_BADGE[selected]}
            </span>
          </div>

          <div className="p-4">
            <textarea
              id="input"
              aria-label="Input text"
              className="w-full h-[360px] resize-none rounded-lg border border-slate-300 dark:border-slate-600 p-3 bg-white dark:bg-slate-950"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Bottom bar */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="text-sm text-slate-500">{wordsUsed} / 2000 words</div>

              <div className="flex items-center gap-2">
                {/* MORE TOOLS */}
                <div className="relative" ref={menuRef}>
                  <button
                    ref={triggerRef}
                    className="btn-ghost"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(v => !v)}
                  >
                    More tools ▾
                  </button>

                  {menuOpen && (
                    <div
                      role="menu"
                      className={
                        "absolute right-0 z-30 w-72 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg p-2 " +
                        (openUp ? "bottom-full mb-2 origin-bottom-right" : "top-full mt-2 origin-top-right")
                      }
                      style={{ maxHeight: 320, overflow: "auto" }}
                    >
                      <div className="px-2 py-1 text-xs font-semibold text-slate-500">Tools</div>

                      <button
                        role="menuitemradio"
                        aria-checked={selected === "humanizer"}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          selected === "humanizer" ? "font-semibold" : ""
                        }`}
                        onClick={() => onPick("humanizer")}
                      >
                        Humanizer (OpenAI)
                      </button>
                      <button
                        role="menuitemradio"
                        aria-checked={selected === "detector"}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          selected === "detector" ? "font-semibold" : ""
                        }`}
                        onClick={() => onPick("detector")}
                      >
                        Detect AI (OpenAI)
                      </button>
                      <button
                        role="menuitemradio"
                        aria-checked={selected === "research"}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          selected === "research" ? "font-semibold" : ""
                        }`}
                        onClick={() => onPick("research")}
                      >
                        Research (Tavily + Brave)
                      </button>
                      <button
                        role="menuitemradio"
                        aria-checked={selected === "plaglite"}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          selected === "plaglite" ? "font-semibold" : ""
                        }`}
                        onClick={() => onPick("plaglite")}
                      >
                        Plagiarism-lite (Brave)
                      </button>

                      <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

                      <div className="px-2 py-1 text-xs font-semibold text-slate-500">Writing Level</div>
                      <div className="px-2 pb-2">
                        <Select
                          value={level}
                          onChange={setLevel}
                          options={WRITING_LEVELS.map(v => ({ value: v, label: v }))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PRIMARY – muutub vastavalt valitud tööriistale */}
                <button
                  onClick={() => runSelected()}
                  disabled={isLoading || !text.trim()}
                  aria-busy={isLoading}
                  className="btn-primary disabled:opacity-60"
                  type="button"
                >
                  {isLoading ? "Working…" : primaryLabel}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold">Output</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              Selected: {TOOL_BADGE[selected]}
            </span>
          </div>
          <div className="p-4" aria-live="polite">
            <div className="h-[360px] overflow-auto whitespace-pre-wrap">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-slate-500">
                  <span className="spinner mr-2" /> Running…
                </div>
              ) : (
                <>{out || <span className="text-slate-400">Your result will appear here…</span>}</>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
