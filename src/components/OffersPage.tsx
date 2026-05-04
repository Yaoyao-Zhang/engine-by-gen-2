"use client";

import { useState } from "react";
import type { OfferData } from "@/app/page";

function formatCurrency(amount: number | null): string {
  if (amount == null) return "N/A";
  return `$${Math.round(amount).toLocaleString()}`;
}

function formatAprRange(minApr: number | null, maxApr: number | null): string {
  if (minApr == null && maxApr == null) return "N/A";
  if (minApr != null && maxApr != null && minApr !== maxApr) {
    return `${minApr}-${maxApr}%`;
  }
  return `${maxApr ?? minApr}%`;
}

function formatTerm(termLength: number | null, termUnit: string | null): string {
  if (termLength == null) return "N/A";
  const unit = termUnit === "month" ? "Months" : termUnit || "Months";
  return `${termLength} ${unit}`;
}

function getDesignation(offer: OfferData): string | null {
  if (offer.preApproved) return "Pre-Approved";
  if (offer.preQualified) return "Pre-Qualified";
  return null;
}

const ORIGINATOR_COLORS: Record<string, string> = {
  LendingClub: "#003A5C",
  SoFi: "#4C00C2",
  LendingPoint: "#1A1A2E",
};

function OfferCard({ offer }: { offer: OfferData }) {
  const [showDetails, setShowDetails] = useState(false);
  const designation = getDesignation(offer);
  const brandColor = ORIGINATOR_COLORS[offer.originator.name] || "#1f2937";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Originator */}
          <div className="sm:w-40 flex-shrink-0">
            <h3
              className="text-xl font-bold"
              style={{ color: brandColor }}
            >
              {offer.originator.name}
            </h3>
            {designation && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                {designation}
              </span>
            )}
            <a
              href={offer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              GET STARTED
            </a>
          </div>

          {/* Offer details grid */}
          <div className="flex-1 grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                APR Range
              </p>
              <p className="text-xl font-bold text-gray-900">
                {formatAprRange(offer.minApr, offer.maxApr)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Term
              </p>
              <p className="text-xl font-bold text-gray-900">
                {offer.termLength != null
                  ? `${offer.termLength > 60 ? "24 - " : ""}${offer.termLength} Months`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Monthly
              </p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(offer.monthlyPayment)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Show details toggle */}
      <div className="border-t border-gray-100">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-gray-50 transition-colors tracking-wider"
        >
          {showDetails ? "HIDE DETAILS" : "SHOW DETAILS"}
        </button>

        {showDetails && (
          <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium text-gray-700">Loan Amount: </span>
                {formatCurrency(offer.maxAmount)}
              </div>
              <div>
                <span className="font-medium text-gray-700">APR Type: </span>
                {offer.aprType ? offer.aprType.charAt(0).toUpperCase() + offer.aprType.slice(1) : "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-700">Term: </span>
                {formatTerm(offer.termLength, offer.termUnit)}
              </div>
              <div>
                <span className="font-medium text-gray-700">Product: </span>
                {offer.productSubType?.replace(/_/g, " ") || "Personal Loan"}
              </div>
            </div>
            {offer.originator.disclaimer && (
              <div
                className="text-xs text-gray-400 mt-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: offer.originator.disclaimer }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function OffersPage({ offers }: { offers: OfferData[] }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900 tracking-tight">Engine</span>
          <span className="text-sm font-medium text-gray-400">by MoneyLion</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {offers.length > 0 ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your personalized loan offers
              </h1>
              <p className="text-gray-500">
                Based on your profile, here are the best offers from our lending partners. Checking
                these rates did not affect your credit score.
              </p>
            </div>

            <div className="space-y-4">
              {offers.map((offer) => (
                <OfferCard key={offer.uuid} offer={offer} />
              ))}
            </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <p>
                If you did not receive an offer from a specific Lending Partner, they may not have
                been able to determine whether you qualified for a personal loan based on the
                information you provided. No credit decision has been made. You may still qualify
                for a personal loan from our partners.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No offers available right now
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Unfortunately, our lending partners were unable to generate offers based on the
              information provided. This does not reflect a credit decision and you may still
              qualify for a personal loan.
            </p>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-6 text-xs text-gray-400 leading-relaxed">
        <p className="mb-3">
          <strong>Advertiser Disclosure:</strong> The offers that appear are from companies which
          this site and its partners receive compensation. This compensation may influence the
          selection, appearance, and order of appearance of the offers listed.
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
          based on your credit worthiness, loan size, amongst other variables.
        </p>
        <p>
          All rates, fees, and terms are presented without guarantee and are subject to change
          pursuant to each provider&apos;s discretion. There is no guarantee you will be approved or
          qualify for the advertised rates, fees, or terms presented. This website does not include
          all lending companies or all available lending offers.
        </p>
      </footer>
    </div>
  );
}
