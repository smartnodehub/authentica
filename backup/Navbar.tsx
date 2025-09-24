export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur bg-white/70 dark:bg-black/30 border-b border-black/10 dark:border-white/10 h-[var(--nav-h)] flex items-center">
      <div className="mx-auto w-full max-w-6xl px-4 flex items-center justify-between">
        <div className="font-semibold">Authentica</div>
        <button className="btn-primary">Sign up</button>
      </div>
    </nav>
  );
}