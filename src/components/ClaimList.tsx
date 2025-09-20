// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/components/ClaimList.tsx
export function ClaimList({ claims }: { claims: string[] }) {
  if (!claims.length) return <p className="text-slate-400 text-sm">No clear claim candidates found.</p>;
  return (
    <ol className="list-decimal pl-5 space-y-1">
      {claims.map((c, i) => (
        <li key={i} className="text-slate-200">{c}</li>
      ))}
    </ol>
  );
}
