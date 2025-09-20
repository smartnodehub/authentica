// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/components/OverlapSummary.tsx
export function OverlapSummary({ percent, bestMatch }:{ percent:number; bestMatch?:string }) {
  return (
    <section className="rounded-xl border border-slate-700 p-4 bg-slate-900">
      <h2 className="text-lg font-semibold mb-2">Self-overlap</h2>
      <p className="text-slate-300 text-sm">Estimated overlap with your previous inputs (same browser): <b>{percent}%</b></p>
      {bestMatch && <p className="mt-2 text-xs text-slate-400">Example shared phrase: “{bestMatch}”</p>}
      <p className="mt-2 text-xs text-slate-500">Note: This demo compares only against your local history (not the web).</p>
    </section>
  );
}
