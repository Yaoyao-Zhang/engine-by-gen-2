"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

export function StepLoanAmount() {
  const { setValue, watch, formState: { errors } } = useFormContext<LoanApplicationFormData>();
  const amount = watch("loanAmount");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        How much do you want to borrow?
      </h1>

      <div className="text-center my-8">
        <span className="text-lg text-gray-400 align-top">$</span>
        <span className="text-5xl font-light text-gray-900">
          {amount.toLocaleString()}
        </span>
      </div>

      <div className="px-2">
        <input
          type="range"
          min={1000}
          max={100000}
          step={1000}
          value={amount}
          onChange={(e) => setValue("loanAmount", Number(e.target.value), { shouldValidate: true })}
          className="w-full accent-indigo-600 cursor-pointer"
          style={{
            background: `linear-gradient(to right, #4338ca 0%, #4338ca ${((amount - 1000) / (100000 - 1000)) * 100}%, #e5e7eb ${((amount - 1000) / (100000 - 1000)) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>1K</span>
          <span>100K</span>
        </div>
      </div>

      {errors.loanAmount && (
        <p className="text-red-500 text-sm mt-2">{errors.loanAmount.message}</p>
      )}
    </div>
  );
}
