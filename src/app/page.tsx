"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanApplicationSchema, type LoanApplicationFormData } from "@/lib/validation";
import { ProgressBar } from "@/components/ProgressBar";
import { StepLoanPurpose } from "@/components/steps/StepLoanPurpose";
import { StepLoanAmount } from "@/components/steps/StepLoanAmount";
import { StepEmployment } from "@/components/steps/StepEmployment";
import { StepIncome } from "@/components/steps/StepIncome";
import { StepEmail } from "@/components/steps/StepEmail";
import { StepName } from "@/components/steps/StepName";
import { StepHousing } from "@/components/steps/StepHousing";
import { StepAddress } from "@/components/steps/StepAddress";
import { StepPhone } from "@/components/steps/StepPhone";
import { StepDOB } from "@/components/steps/StepDOB";
import { StepCreditScore } from "@/components/steps/StepCreditScore";
import { StepSSN } from "@/components/steps/StepSSN";
import { StepConsent } from "@/components/steps/StepConsent";
import { OffersPage } from "@/components/OffersPage";

const STEPS = [
  "loanPurpose",
  "loanAmount",
  "employment",
  "income",
  "email",
  "name",
  "housing",
  "address",
  "phone",
  "dob",
  "creditScore",
  "ssn",
  "consent",
] as const;

const STEP_VALIDATION_FIELDS: Record<string, (keyof LoanApplicationFormData)[]> = {
  loanPurpose: ["loanPurpose"],
  loanAmount: ["loanAmount"],
  employment: ["employmentStatus", "employmentPayFrequency"],
  income: ["annualIncome"],
  email: ["email"],
  name: ["firstName", "lastName"],
  housing: ["propertyStatus"],
  address: ["address1", "city", "state", "zipcode"],
  phone: ["phone"],
  dob: ["dateOfBirth"],
  creditScore: ["creditScore"],
  ssn: ["ssn"],
  consent: ["consentsToFcra"],
};

export interface OfferData {
  uuid: string;
  originator: { name: string; logo: string; disclaimer: string };
  termLength: number | null;
  termUnit: string | null;
  maxAmount: number | null;
  maxApr: number | null;
  minApr: number | null;
  monthlyPayment: number | null;
  preQualified: boolean;
  preApproved: boolean;
  url: string;
  productSubType: string;
  aprType: string | null;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [offers, setOffers] = useState<OfferData[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stressResults, setStressResults] = useState<{ allowed: boolean }[] | null>(null);

  const methods = useForm<LoanApplicationFormData>({
    resolver: zodResolver(loanApplicationSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      ssn: "",
      address1: "",
      address2: "",
      city: "",
      state: undefined,
      zipcode: "",
      loanPurpose: "",
      loanAmount: 29000,
      propertyStatus: "",
      creditScore: 760,
      employmentStatus: "",
      employmentPayFrequency: "biweekly",
      annualIncome: 100000,
      consentsToFcra: false as unknown as true,
      consentsToTcpa: true,
    },
  });

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  async function goNext() {
    const stepKey = STEPS[currentStep];
    const fieldsToValidate = STEP_VALIDATION_FIELDS[stepKey] || [];
    const valid = await methods.trigger(fieldsToValidate);
    if (valid) {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  }

  function goBack() {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    const valid = await methods.trigger();
    if (!valid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const data = methods.getValues();
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.status === 429) {
        const minutes = Math.ceil((result.retryAfterMs as number) / 60000);
        throw new Error(
          `Too many applications submitted. Please wait ${minutes} minute${minutes !== 1 ? "s" : ""} before trying again.`
        );
      }

      if (!response.ok) {
        throw new Error(result.error || "Submission failed");
      }

      setOffers(result.offers);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function runStressTest() {
    setStressResults(null);
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }).then((r) => ({ allowed: r.status !== 429 }))
      )
    );
    setStressResults(results);
  }

  if (offers) {
    return <OffersPage offers={offers} />;
  }

  const stepComponents: Record<string, React.ReactNode> = {
    loanPurpose: <StepLoanPurpose onSelect={goNext} />,
    loanAmount: <StepLoanAmount />,
    employment: <StepEmployment onSelect={goNext} />,
    income: <StepIncome />,
    email: <StepEmail />,
    name: <StepName />,
    housing: <StepHousing onSelect={goNext} />,
    address: <StepAddress />,
    phone: <StepPhone />,
    dob: <StepDOB />,
    creditScore: <StepCreditScore />,
    ssn: <StepSSN />,
    consent: <StepConsent onSubmit={handleSubmit} isSubmitting={isSubmitting} />,
  };

  const currentStepKey = STEPS[currentStep];
  const autoAdvanceSteps = ["loanPurpose", "employment", "housing"];
  const showNextButton = !autoAdvanceSteps.includes(currentStepKey) && currentStepKey !== "consent";

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-xl font-bold text-gray-900 tracking-tight">Engine</span>
            <span className="text-sm font-medium text-gray-400">by MoneyLion</span>
          </div>
          <ProgressBar progress={progress} />
        </header>

        <main className="max-w-xl mx-auto px-4 py-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1 text-emerald-600 font-medium text-sm mb-6 hover:text-emerald-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              BACK
            </button>
          )}

          {stepComponents[currentStepKey]}

          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500">
              <p className="font-semibold mb-2 text-gray-600">DSA Demo — Sliding Window Rate Limiter</p>
              <p className="mb-3">Fire 5 simultaneous requests. Only 3 are allowed per 10-minute window.</p>
              <button
                type="button"
                onClick={runStressTest}
                className="px-3 py-1.5 bg-gray-700 text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors"
              >
                Run Stress Test (5 requests)
              </button>
              {stressResults && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {stressResults.map((r, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded text-white font-mono ${r.allowed ? "bg-emerald-600" : "bg-red-500"}`}
                    >
                      #{i + 1} {r.allowed ? "✓ allowed" : "✗ blocked"}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {showNextButton && (
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={goNext}
                className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                NEXT
              </button>
            </div>
          )}
        </main>

        <footer className="max-w-xl mx-auto px-4 py-6 text-xs text-gray-400 leading-relaxed">
          <p className="mb-3">
            <strong>Advertiser Disclosure:</strong> The offers that appear are from companies which
            this site and its partners receive compensation. This compensation may influence the
            selection, appearance, and order of appearance of the offers listed. However, this
            compensation also facilitates the provision of certain services to you at no charge.
          </p>
          <p className="mb-3">
            <strong>Representative Example:</strong> If you borrow $5,000 on a 36 month repayment
            term and at a 10% APR, the monthly repayment will be $161.34. Total repayment will be
            $5,808.24. Total interest paid will be $808.24.
          </p>
          <p className="mb-3">
            <strong>APR Disclosure:</strong> The Annual Percentage Rate is the rate at which your
            loan accrues interest. It is based upon the amount of your loan, the cost of the loan,
            term of the loan, repayment amounts and timing of payments and payoff. Rates will vary
            based on your credit worthiness, loan size, amongst other variables, with the lowest
            rates available to customers with excellent credit.
          </p>
          <p>
            All rates, fees, and terms are presented without guarantee and are subject to change
            pursuant to each provider&apos;s discretion. There is no guarantee you will be approved or
            qualify for the advertised rates, fees, or terms presented.
          </p>
        </footer>
      </div>
    </FormProvider>
  );
}
