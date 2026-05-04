"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function StepSSN() {
  const { setValue, watch, formState: { errors } } = useFormContext<LoanApplicationFormData>();
  const [showSSN, setShowSSN] = useState(false);
  const ssn = watch("ssn");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatSSN(e.target.value);
    setValue("ssn", formatted, { shouldValidate: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        What&apos;s your Social Security number?
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        To verify your info and give you an accurate quote, each of our{" "}
        <span className="underline cursor-pointer">partners</span> will obtain a copy of your
        credit report from a credit reporting agency. You can also use an ITIN. Checking your
        rate will not affect your credit score and your information is transmitted securely.
      </p>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          Social Security Number
        </label>
        <div className="relative">
          <input
            type={showSSN ? "text" : "password"}
            value={ssn}
            onChange={handleChange}
            placeholder="###-##-####"
            maxLength={11}
            className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 ${
              errors.ssn ? "border-red-400" : "border-gray-300 focus:border-emerald-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowSSN(!showSSN)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showSSN ? "Hide SSN" : "Show SSN"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {showSSN ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              )}
            </svg>
          </button>
        </div>
        {errors.ssn && (
          <p className="text-red-500 text-sm mt-1">{errors.ssn.message}</p>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6 flex items-center gap-1.5">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="underline cursor-pointer">Learn more about how we protect your information.</span>
      </p>
    </div>
  );
}
