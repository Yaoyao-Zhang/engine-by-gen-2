"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";
import { PROPERTY_STATUSES } from "@/lib/validation";

const ICONS: Record<string, string> = {
  rent: "🏢",
  own: "🏠",
  own_with_mortgage: "🏡",
};

export function StepHousing({ onSelect }: { onSelect: () => void }) {
  const { setValue, watch } = useFormContext<LoanApplicationFormData>();
  const selected = watch("propertyStatus");

  function handleSelect(value: string) {
    setValue("propertyStatus", value, { shouldValidate: true });
    setTimeout(onSelect, 150);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Do you rent or own?
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {PROPERTY_STATUSES.map((status) => (
          <button
            key={status.value}
            type="button"
            onClick={() => handleSelect(status.value)}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all hover:shadow-md ${
              selected === status.value
                ? "border-emerald-500 bg-emerald-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-3xl mb-3">{ICONS[status.value]}</span>
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">
              {status.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
