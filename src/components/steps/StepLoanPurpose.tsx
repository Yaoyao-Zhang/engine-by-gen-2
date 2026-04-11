"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";
import { LOAN_PURPOSES } from "@/lib/validation";

const ICONS: Record<string, string> = {
  debt_consolidation: "💳",
  refinance: "👛",
  home_improvement: "🔨",
  large_purchases: "🏷️",
  moving: "🏠",
  business: "🔑",
  education: "🍎",
  other: "📋",
};

export function StepLoanPurpose({ onSelect }: { onSelect: () => void }) {
  const { setValue, watch } = useFormContext<LoanApplicationFormData>();
  const selected = watch("loanPurpose");

  function handleSelect(value: string) {
    setValue("loanPurpose", value, { shouldValidate: true });
    setTimeout(onSelect, 150);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        How are you planning to use these funds?
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {LOAN_PURPOSES.map((purpose) => (
          <button
            key={purpose.value}
            type="button"
            onClick={() => handleSelect(purpose.value)}
            className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all hover:shadow-md ${
              selected === purpose.value
                ? "border-emerald-500 bg-emerald-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-3xl mb-3">{ICONS[purpose.value] || "📋"}</span>
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">
              {purpose.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
