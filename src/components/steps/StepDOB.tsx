"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

export function StepDOB() {
  const { register, formState: { errors } } = useFormContext<LoanApplicationFormData>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        What&apos;s your date of birth?
      </h1>

      <div>
        <input
          type="date"
          {...register("dateOfBirth")}
          placeholder="Date of birth"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 ${
            errors.dateOfBirth ? "border-red-400" : "border-gray-300 focus:border-emerald-500"
          }`}
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
        )}
      </div>
    </div>
  );
}
