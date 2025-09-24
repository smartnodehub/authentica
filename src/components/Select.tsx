"use client";

type Opt = { value: string; label: string };

export default function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: any) => void;
  options: Opt[];
}) {
  return (
    <label className="inline-flex">
      <select
        aria-label="Select option"
        className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}