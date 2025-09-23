// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/components/ScoreCard.tsx
export function ScoreCard({ title, value, hint }: { title: string; value: number; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-700 p-4 bg-slate-900">
      <div className="flex items-baseline justify-between">
<<<<<<< HEAD
  <h3 className="text-sm" style={{ color: '#9FFF00', textShadow: '0 0 8px #AFFF4F, 0 0 16px #9FFF00' }}>{title}</h3>
  <span className="text-4xl font-extrabold glow-number">{value}</span>
=======
        <h3 className="text-sm text-slate-400">{title}</h3>
        <span className="text-xl font-semibold">{value}</span>
>>>>>>> bad37e7dfe6b4f2598f52e103eeb498fe8e0d4b5
      </div>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
