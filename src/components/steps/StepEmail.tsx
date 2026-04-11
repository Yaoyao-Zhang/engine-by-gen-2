"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

export function StepEmail() {
  const { register, formState: { errors } } = useFormContext<LoanApplicationFormData>();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Let&apos;s create your account to save your progress.
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        We&apos;ll send your personalized rates to this email address.
      </p>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          Email Address
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-900"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6 leading-relaxed">
        I have read, understood and consent to the language and authorizations outlined in
        the E-Sign Consent, Privacy Policy, Terms of Use, and Arbitration Agreement.
        We recommend that you retain a copy for your reference.
      </p>
    </div>
  );
}
