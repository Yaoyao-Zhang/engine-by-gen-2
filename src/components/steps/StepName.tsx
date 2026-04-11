"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

export function StepName() {
  const { register, formState: { errors } } = useFormContext<LoanApplicationFormData>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        What&apos;s your name?
      </h1>
      <p className="text-gray-500 text-sm mb-8">Please use your full legal name.</p>

      <div className="space-y-5">
        <div>
          <input
            type="text"
            {...register("firstName")}
            placeholder="First name"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 ${
              errors.firstName ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-emerald-500"
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("lastName")}
            placeholder="Last name"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 ${
              errors.lastName ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-emerald-500"
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
