"use client";

export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-1 bg-gray-100">
      <div
        className="h-full bg-indigo-600 transition-all duration-500 ease-out"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}
