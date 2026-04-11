"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";
import { EMPLOYMENT_STATUSES } from "@/lib/validation";

const ICONS: Record<string, string> = {
  employed: "💼",
  not_employed: "📱",
  military: "⭐",
  retired: "🌿",
  self_employed: "🏢",
};

export function StepEmployment({ onSelect }: { onSelect: () => void }) {
  const { setValue, watch } = useFormContext<LoanApplicationFormData>();
  const selected = watch("employmentStatus");

  function handleSelect(value: string) {
    setValue("employmentStatus", value, { shouldValidate: true });
    setTimeout(onSelect, 150);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        What&apos;s your employment status?
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {EMPLOYMENT_STATUSES.map((status) => (
          <button
            key={status.value}
            type="button"
            onClick={() => handleSelect(status.value)}
            className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all hover:shadow-md ${
              selected === status.value
                ? "border-emerald-500 bg-emerald-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-3xl mb-3">{ICONS[status.value] || "💼"}</span>
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">
              {status.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
