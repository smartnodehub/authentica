"use client";
/* Mapping (reaalsed väärtused – selles commitis pole reklaami/makseid)
   Domeenid: fastingclock.com, auditexpertai.com, smartlotteri.com  → ei kasutata siin
   AdSense: slot 3748465240, publisher ca-pub-7058115116105378     → ei kasutata siin
   Stripe env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET            → ei kasutata siin
   Resend: RESEND_API_KEY                                          → ei kasutata siin
*/

"use client";
import AutoTextarea from '@/components/AutoTextarea';
import React, { useEffect, useRef, useState } from 'react';

function useHeaderHeight() {
  const [h, setH] = useState(64);
  useEffect(() => {
    const el = document.querySelector('header');
    const measure = () => setH(el ? Math.max(56, Math.round(el.getBoundingClientRect().height)) : 64);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return h;
}

function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1A2B] dark:bg-[#0F1A2B] px-4 py-3 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium glow-label">{label}</div>
        <div className="text-xs text-gray-400 mt-1 truncate">{note}</div>
      </div>
      <div className="text-3xl font-extrabold glow-number">{value}</div>
    </div>
  );
}

function MiniCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0F1A2B] dark:bg-[#0F1A2B] px-4 py-2 flex items-center justify-between">
      <div className="text-sm font-medium glow-label">{label}</div>
      <div className="text-2xl font-extrabold glow-number">{value}</div>
    </div>
  );
}

export default function ReportPage() {
  const headerH = useHeaderHeight();
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-6xl px-4"
      style={{ minHeight: `calc(100vh - ${headerH}px)` }} // KOGU raport mahub ekraanile
    >
      {/* ÜLEMINE RIDA: väikesed kaardid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4">
        {/* 3 mõõdikut – väiksemad kaardid */}
        <div className="md:col-span-4">
          <MetricCard label="Selgus" value={100} note="Looks clear." />
        </div>
        <div className="md:col-span-4">
          <MetricCard label="Kordus" value={100} note="Low repetition." />
        </div>
        <div className="md:col-span-4">
          <MetricCard label="Toksilisuse risk" value={0} note="No obvious toxicity." />
        </div>

        {/* Self-overlap – MINI boks (madal) */}
        <div className="md:col-span-12">
          <div className="rounded-xl border border-white/10 bg-[#0F1A2B] dark:bg-[#0F1A2B] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold">Self-overlap</div>
              <div className="text-2xl font-extrabold glow-number">0%</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Estimated overlap with your previous inputs (same browser).
            </div>
          </div>
        </div>
      </div>

      {/* ALUMINE RIDA: ÜMBERKIRJUTUS – palju suurem paneel */}
      <section id="rewrite" className="section-offset mt-4">
        <div className="rounded-xl border border-white/10 bg-[#0B1220] dark:bg-[#181F2A] p-4">
          {/* Üla: toon + nupp */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold">Ümberkirjutus (LLM)</h3>
            <div className="flex items-center gap-2">
              <label className="ui-contrast text-sm">Toon</label>
              <select className="ui-surface ui-select">
                <option>Neutral</option>
                <option>Friendly</option>
                <option>Bold</option>
                <option>Formal</option>
              </select>
              <button className="btn-primary">Kirjuta ümber</button>
            </div>
          </div>

          {/* Sisu: tekstikast – venib vertikaalselt, vajadusel leht kerib */}
          <div className="rounded-xl border border-white/10 bg-black/20 dark:bg-[#222] p-4 writing-safe-bottom">
            <AutoTextarea
              defaultValue="Siia läheb ümberkirjutuse sisu/UI. Tekstikasti saab nurgast venitada. Kui sisu on väga pikk, auto-kasv töötab kuni ~80vh, sealt edasi scrollib kast ise."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
