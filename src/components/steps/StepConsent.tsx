"use client";

import { useFormContext } from "react-hook-form";
import type { LoanApplicationFormData } from "@/lib/validation";

const FCRA_DISPLAY_TEXT =
  "By checking this box and selecting the \"Continue\" button below, I agree that:\n\n" +
  "I authorize Lantern by SoFi to deliver my information to the various lending providers below in order to help me search for the loan options I have requested.\n\n" +
  "I authorize Engine and each of the lending providers within its networks to obtain my consumer credit report, under the Fair Credit Reporting Act. This is known as a \"soft\" credit pull. If I choose to continue my application directly with a lending provider, they may obtain my full credit report, known as a \"hard\" credit pull, which could affect my credit score.\n\n" +
  "I agree to Engine's Terms of Use and Privacy Policy, and consent to receive Electronic Communications.";

const TCPA_DISPLAY_TEXT =
  "I agree to be contacted by Engine by MoneyLion and its partners and their affiliated companies and financial institutions via email, postal mail service and/or at the telephone number(s) I have provided above to explore various financial products and services I inquired about, including contact through automatic dialing systems, artificial or pre-recorded voice messaging, or text message. Consent is not required as a condition to utilize the service.";

export function StepConsent({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const { setValue, watch, formState: { errors } } = useFormContext<LoanApplicationFormData>();
  const fcra = watch("consentsToFcra");
  const tcpa = watch("consentsToTcpa");

  return (
    <div>
      <div className="flex items-start gap-4 mb-8">
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          Almost there! Your rate is just a click away. Please review your information below.
        </h1>
      </div>

      <div className="space-y-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={fcra === true}
            onChange={(e) =>
              setValue("consentsToFcra", e.target.checked as unknown as true, {
                shouldValidate: true,
              })
            }
            className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 flex-shrink-0"
          />
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {FCRA_DISPLAY_TEXT}
          </div>
        </label>
        {errors.consentsToFcra && (
          <p className="text-red-500 text-sm ml-8">{errors.consentsToFcra.message}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={tcpa}
            onChange={(e) =>
              setValue("consentsToTcpa", e.target.checked, { shouldValidate: true })
            }
            className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 flex-shrink-0"
          />
          <div className="text-sm text-gray-600 leading-relaxed">
            {TCPA_DISPLAY_TEXT}
          </div>
        </label>
      </div>

      <p className="text-xs text-gray-400 mt-6 leading-relaxed">
        Lantern by SoFi is owned and operated by SoFi Lending Corp. SoFi will be paid a fee
        for a referral or if you obtain a loan, financial product, or service through the Lantern
        marketplace. All rates, terms, and conditions vary by provider.{" "}
        <span className="underline cursor-pointer">See terms and license info.</span>
      </p>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !fcra}
          className={`px-10 py-3 font-semibold rounded-lg transition-colors shadow-sm ${
            isSubmitting || !fcra
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Checking rates...
            </span>
          ) : (
            "CONTINUE"
          )}
        </button>
      </div>
    </div>
  );
}
