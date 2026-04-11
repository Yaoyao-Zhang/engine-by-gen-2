import type { LoanApplicationFormData } from "./validation";
import { creditScoreToRating } from "./validation";

const ENGINE_API_BASE = "https://api.engine.tech";

const FCRA_LANGUAGE =
  "By checking this box/clicking 'agree' I hereby consent to the 'E-Sign Agreement', the 'Credit Authorization Agreement', the Terms of Service and Privacy Policy, and I am providing written consent under the Fair Credit Reporting Act (FCRA) for Engine by MoneyLion and its partners and financial institutions to obtain consumer report information from my credit profile. I request that my information be provided to their partners, lenders, and financial services partners to provide me with financial recommendations, which may also include debt relief, credit repair, credit monitoring or other related services.";

const TCPA_LANGUAGE =
  "I agree to be contacted by Engine by MoneyLion and its partners and their affiliated companies and financial institutions via email, postal mail service and/or at the telephone number(s) I have provided above to explore various financial products and services I inquired about, including contact through automatic dialing systems, artificial or pre-recorded voice messaging, or text message. Consent is not required as a condition to utilize the service.";

export { FCRA_LANGUAGE, TCPA_LANGUAGE };

interface EnginePostResponse {
  uuid: string;
  leadUuid: string;
}

export interface LoanOffer {
  uuid: string;
  originator: {
    key: string;
    name: string;
    description?: string;
    images: { sizeKey: string; url: string }[];
    disclaimer?: string;
  };
  termLength: number | null;
  termUnit: string | null;
  maxAmount: number | null;
  minAmount: number | null;
  maxApr: number | null;
  minApr: number | null;
  meanApr: number | null;
  monthlyPayment: number | null;
  maxMonthlyPayment: number | null;
  minMonthlyPayment: number | null;
  preQualified: boolean;
  preApproved: boolean;
  url: string;
  productType: string;
  productSubType: string;
  aprType: string | null;
  sponsored: boolean;
  termDescription: string | null;
  aprDescription: string | null;
  monthlyPaymentDescription: string | null;
}

interface EngineRateTableResponse {
  uuid: string;
  leadUuid: string;
  loanOffers: LoanOffer[];
  specialOffers: unknown[];
  pendingResponses: unknown[];
}

function buildRequestBody(
  data: LoanApplicationFormData,
  ssn: string,
  ipAddress: string,
  userAgent: string
) {
  const phone = data.phone.replace(/[\s().-]/g, "").replace(/^1/, "");

  return {
    productTypes: ["loan", "other"],
    personalInformation: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      city: data.city,
      state: data.state,
      primaryPhone: phone,
      address1: data.address1,
      address2: data.address2 || undefined,
      zipcode: data.zipcode,
      dateOfBirth: data.dateOfBirth,
      ssn,
    },
    loanInformation: {
      purpose: data.loanPurpose,
      loanAmount: data.loanAmount,
    },
    mortgageInformation: {
      propertyStatus: data.propertyStatus,
    },
    creditInformation: {
      providedNumericCreditScore: data.creditScore,
      providedCreditRating: creditScoreToRating(data.creditScore),
    },
    financialInformation: {
      employmentStatus: data.employmentStatus,
      employmentPayFrequency: data.employmentPayFrequency,
      annualIncome: data.annualIncome,
    },
    legalInformation: {
      consentsToFcra: true,
      fcraLanguage: FCRA_LANGUAGE,
      consentsToTcpa: data.consentsToTcpa,
      ...(data.consentsToTcpa ? { tcpaLanguage: TCPA_LANGUAGE } : {}),
    },
    sessionInformation: {
      ipAddress,
      userAgent,
    },
  };
}

export async function submitToEngine(
  data: LoanApplicationFormData,
  ssn: string,
  ipAddress: string,
  userAgent: string
): Promise<EnginePostResponse> {
  const token = process.env.ENGINE_API_TOKEN;
  if (!token) throw new Error("ENGINE_API_TOKEN is not configured");

  const body = buildRequestBody(data, ssn, ipAddress, userAgent);

  const response = await fetch(`${ENGINE_API_BASE}/leads/rateTables`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Engine API POST error: ${response.status}`, errorBody);
    throw new Error(`Engine API returned ${response.status}: ${errorBody}`);
  }

  return response.json();
}

export async function pollForOffers(
  rateTableUuid: string,
  maxAttempts = 30,
  intervalMs = 1000
): Promise<EngineRateTableResponse> {
  const token = process.env.ENGINE_API_TOKEN;
  if (!token) throw new Error("ENGINE_API_TOKEN is not configured");

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(
      `${ENGINE_API_BASE}/originator/rateTables/${rateTableUuid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Engine API GET error: ${response.status}`, errorBody);
      throw new Error(`Engine API returned ${response.status}: ${errorBody}`);
    }

    const data: EngineRateTableResponse = await response.json();

    if (data.pendingResponses.length === 0) {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Timed out waiting for Engine API offers");
}
