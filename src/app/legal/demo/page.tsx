// Mapping: Project=Authentica | Repo=https://github.com/smartnodehub/authentica | Domain=https://authentica-gamma.vercel.app
// File: src/app/legal/demo/page.tsx
export default function DemoLimitations() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Demo limitations</h1>
      <ul className="list-disc pl-5 space-y-2 text-slate-300">
        <li>No external APIs are used. Analysis runs locally in your browser.</li>
        <li>Self-overlap compares only against your own local history (this browser).</li>
        <li>We do not claim “plagiarism-free” or “detector bypass”. Results are advisory.</li>
        <li>Robots set to <code>noindex</code> until launch.</li>
      </ul>
    </main>
  );
}
