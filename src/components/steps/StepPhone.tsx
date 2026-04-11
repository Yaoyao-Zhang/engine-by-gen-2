"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function StepPhone() {
  const { setValue, watch, formState: { errors } } = useFormContext<LoanApplicationFormData>();
  const firstName = watch("firstName");
  const phone = watch("phone");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted, { shouldValidate: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Hi {firstName || "there"}! What&apos;s your phone number?
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        We&apos;ll only reach out if we have questions about this loan application.
      </p>

      <div>
        <input
          type="tel"
          value={phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 ${
            errors.phone ? "border-red-400" : "border-gray-300 focus:border-emerald-500"
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4 leading-relaxed">
        We ask this so that we, our partners and their affiliated companies can contact you
        about the products and services you inquired about, even if your telephone number is
        listed on any Do-Not Call list. Contact may be made through automatic dialing systems,
        artificial or prerecorded voice messaging, or text message.
      </p>
    </div>
  );
}
