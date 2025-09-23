export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-xl font-semibold mb-3">How it works</h2>
      <ol className="grid md:grid-cols-3 gap-4">
        <li className="card">1) Paste your text</li>
        <li className="card">2) We compute clarity/repetition/risk</li>
        <li className="card">3) Review results or rewrite</li>
      </ol>
    </section>
  );
}