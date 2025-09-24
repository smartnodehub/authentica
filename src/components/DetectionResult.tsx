import React from "react";

type DetectionProps = {
  label: "likely_human" | "mixed" | "likely_ai";
  score: number;
  reasons: string[];
};

const labelMap = {
  likely_human: { text: "Likely Human", color: "bg-green-100 text-green-800" },
  mixed: { text: "Mixed / Unclear", color: "bg-yellow-100 text-yellow-800" },
  likely_ai: { text: "Likely AI", color: "bg-red-100 text-red-800" },
};

export default function DetectionResult({ label, score, reasons }: DetectionProps) {
  const { text, color } = labelMap[label];

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-2">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
          {text}
        </span>
        <span className="text-gray-700 dark:text-gray-200 font-bold">
          {Math.round(score * 100)}%
        </span>
      </div>
      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
        {reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}