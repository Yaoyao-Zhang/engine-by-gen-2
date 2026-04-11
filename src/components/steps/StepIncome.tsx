"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";
import { PAY_FREQUENCIES } from "@/lib/validation";

export function StepIncome() {
  const { setValue, watch, formState: { errors } } = useFormContext<LoanApplicationFormData>();
  const income = watch("annualIncome");
  const payFreq = watch("employmentPayFrequency");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        What&apos;s your total annual income?
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Tell us how much you make in a year, before taxes. You can include wage income, bonus,
        commissions, and all other income. This information will be verified later.
      </p>

      <div className="text-center my-6">
        <span className="text-lg text-indigo-500 align-top">$</span>
        <span className="text-5xl font-light text-indigo-700">
          {income.toLocaleString()}
        </span>
      </div>

      <div className="px-2 mb-6">
        <input
          type="range"
          min={10000}
          max={500000}
          step={5000}
          value={income}
          onChange={(e) => setValue("annualIncome", Number(e.target.value), { shouldValidate: true })}
          className="w-full accent-indigo-600 cursor-pointer"
          style={{
            background: `linear-gradient(to right, #312e81 0%, #312e81 ${((income - 10000) / (500000 - 10000)) * 100}%, #e5e7eb ${((income - 10000) / (500000 - 10000)) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>$10K</span>
          <span>$500K</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Pay frequency</label>
        <select
          value={payFreq}
          onChange={(e) => setValue("employmentPayFrequency", e.target.value, { shouldValidate: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white text-gray-900"
        >
          {PAY_FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Alimony, child support or separate maintenance income need not be revealed if you do not
        wish to have it considered as a basis for repaying this obligation.
      </p>

      {errors.annualIncome && (
        <p className="text-red-500 text-sm mt-2">{errors.annualIncome.message}</p>
      )}
    </div>
  );
}
