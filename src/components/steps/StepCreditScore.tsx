"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

function getRatingLabel(score: number): string {
  if (score >= 720) return "Excellent (720 - 850)";
  if (score >= 660) return "Good (660 - 719)";
  if (score >= 620) return "Fair (620 - 659)";
  return "Poor (300 - 619)";
}

function getGradientPosition(score: number): number {
  return ((score - 300) / (850 - 300)) * 100;
}

export function StepCreditScore() {
  const { setValue, watch, formState: { errors } } = useFormContext<LoanApplicationFormData>();
  const score = watch("creditScore");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        What&apos;s your credit rating?
      </h1>

      <div className="text-center my-8">
        <span className="text-5xl font-light text-gray-900">{score}</span>
      </div>

      <div className="px-2">
        <div className="relative">
          <div
            className="h-3 rounded-full"
            style={{
              background: "linear-gradient(to right, #f87171 0%, #f87171 20%, #fbbf24 20%, #fbbf24 45%, #86efac 45%, #86efac 65%, #22c55e 65%, #22c55e 80%, #16a34a 80%, #16a34a 100%)",
            }}
          />
          <input
            type="range"
            min={300}
            max={850}
            value={score}
            onChange={(e) => setValue("creditScore", Number(e.target.value), { shouldValidate: true })}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ height: "24px", marginTop: "-6px" }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-300 shadow-md pointer-events-none"
            style={{ left: `calc(${getGradientPosition(score)}% - 12px)` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <span className={score < 620 ? "font-semibold text-gray-800" : ""}>Poor</span>
          <span className={score >= 620 && score < 660 ? "font-semibold text-gray-800" : ""}>Fair</span>
          <span className={score >= 660 && score < 720 ? "font-semibold text-gray-800" : ""}>Good</span>
          <span className={score >= 720 ? "font-semibold text-gray-800" : ""}>Excellent</span>
        </div>
      </div>

      {errors.creditScore && (
        <p className="text-red-500 text-sm mt-2">{errors.creditScore.message}</p>
      )}
    </div>
  );
}
