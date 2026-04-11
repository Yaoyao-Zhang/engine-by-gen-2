import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loanApplicationSchema } from "@/lib/validation";
import { encryptSSN } from "@/lib/encryption";
import { submitToEngine, pollForOffers, FCRA_LANGUAGE, TCPA_LANGUAGE } from "@/lib/engine-api";
import type { LoanOffer } from "@/lib/engine-api";

function getMockOffers(): LoanOffer[] {
  return [
    {
      uuid: "mock-offer-1",
      originator: {
        key: "lendingclub",
        name: "LendingClub",
        images: [{ sizeKey: "120x40", url: "" }],
        disclaimer: "All loans made by LendingClub are subject to credit review and approval. Your actual rate depends on credit score, loan amount, loan term, and credit usage and history.",
        description: "",
      },
      termLength: 84,
      termUnit: "month",
      maxAmount: 29000,
      minAmount: 29000,
      maxApr: 35.99,
      minApr: 7.9,
      meanApr: 15.0,
      monthlyPayment: 351,
      maxMonthlyPayment: 351,
      minMonthlyPayment: 351,
      preQualified: true,
      preApproved: false,
      url: "#",
      productType: "loan",
      productSubType: "personal_loan",
      aprType: "fixed",
      sponsored: false,
      termDescription: null,
      aprDescription: null,
      monthlyPaymentDescription: null,
    },
    {
      uuid: "mock-offer-2",
      originator: {
        key: "sofi",
        name: "SoFi",
        images: [{ sizeKey: "120x40", url: "" }],
        disclaimer: "SoFi Personal Loans are originated by SoFi Bank, N.A. Member FDIC. Terms and conditions apply.",
        description: "",
      },
      termLength: 84,
      termUnit: "month",
      maxAmount: 29000,
      minAmount: 29000,
      maxApr: 35.49,
      minApr: 8.74,
      meanApr: 16.0,
      monthlyPayment: 574,
      maxMonthlyPayment: 574,
      minMonthlyPayment: 574,
      preQualified: true,
      preApproved: false,
      url: "#",
      productType: "loan",
      productSubType: "personal_loan",
      aprType: "fixed",
      sponsored: false,
      termDescription: null,
      aprDescription: null,
      monthlyPaymentDescription: null,
    },
    {
      uuid: "mock-offer-3",
      originator: {
        key: "lendingpoint",
        name: "LendingPoint",
        images: [{ sizeKey: "120x40", url: "" }],
        disclaimer: "LendingPoint loans are subject to credit review and approval.",
        description: "",
      },
      termLength: 72,
      termUnit: "month",
      maxAmount: 29000,
      minAmount: 29000,
      maxApr: 35.99,
      minApr: 7.99,
      meanApr: 14.5,
      monthlyPayment: 573,
      maxMonthlyPayment: 573,
      minMonthlyPayment: 573,
      preQualified: true,
      preApproved: false,
      url: "#",
      productType: "loan",
      productSubType: "personal_loan",
      aprType: "fixed",
      sponsored: false,
      termDescription: null,
      aprDescription: null,
      monthlyPaymentDescription: null,
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loanApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "0.0.0.0";
    const userAgent = request.headers.get("user-agent") || "Unknown";

    const { encrypted, iv, tag } = encryptSSN(data.ssn);

    const application = await prisma.loanApplication.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        ssnEncrypted: encrypted,
        ssnIv: iv,
        ssnTag: tag,
        address1: data.address1,
        address2: data.address2 || null,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        loanPurpose: data.loanPurpose,
        loanAmount: data.loanAmount,
        propertyStatus: data.propertyStatus,
        creditScore: data.creditScore,
        employmentStatus: data.employmentStatus,
        employmentPayFrequency: data.employmentPayFrequency,
        annualIncome: data.annualIncome,
        consentsToFcra: Boolean(data.consentsToFcra),
        fcraLanguage: FCRA_LANGUAGE,
        consentsToTcpa: data.consentsToTcpa,
        tcpaLanguage: data.consentsToTcpa ? TCPA_LANGUAGE : null,
        ipAddress,
        userAgent,
      },
    });

    let offers: LoanOffer[] = [];
    let usedMock = false;

    try {
      const postResponse = await submitToEngine(data, data.ssn, ipAddress, userAgent);

      await prisma.loanApplication.update({
        where: { id: application.id },
        data: {
          engineLeadUuid: postResponse.leadUuid,
          engineRateTableUuid: postResponse.uuid,
        },
      });

      const rateTable = await pollForOffers(postResponse.uuid);
      offers = rateTable.loanOffers;
    } catch (apiError) {
      console.error("Engine API call failed, falling back to mock offers:", apiError);
      offers = getMockOffers();
      usedMock = true;
    }

    if (offers.length > 0) {
      await prisma.loanOffer.createMany({
        data: offers.map((offer) => ({
          applicationId: application.id,
          offerUuid: offer.uuid,
          originatorKey: offer.originator?.key || null,
          originatorName: offer.originator?.name || null,
          originatorLogo: offer.originator?.images?.[0]?.url || null,
          originatorDisclaimer: offer.originator?.disclaimer || null,
          termLength: offer.termLength,
          termUnit: offer.termUnit,
          maxAmount: offer.maxAmount,
          minAmount: offer.minAmount,
          maxApr: offer.maxApr,
          minApr: offer.minApr,
          meanApr: offer.meanApr,
          monthlyPayment: offer.monthlyPayment,
          maxMonthlyPayment: offer.maxMonthlyPayment,
          minMonthlyPayment: offer.minMonthlyPayment,
          preQualified: offer.preQualified,
          preApproved: offer.preApproved,
          url: offer.url,
          productType: offer.productType,
          productSubType: offer.productSubType,
          aprType: offer.aprType,
          sponsored: offer.sponsored,
          rawResponse: JSON.stringify(offer),
        })),
      });
    }

    return NextResponse.json({
      applicationId: application.id,
      offers: offers.map((o) => ({
        uuid: o.uuid,
        originator: {
          name: o.originator?.name,
          logo: o.originator?.images?.[0]?.url,
          disclaimer: o.originator?.disclaimer,
        },
        termLength: o.termLength,
        termUnit: o.termUnit,
        maxAmount: o.maxAmount,
        maxApr: o.maxApr,
        minApr: o.minApr,
        monthlyPayment: o.maxMonthlyPayment,
        preQualified: o.preQualified,
        preApproved: o.preApproved,
        url: o.url,
        productSubType: o.productSubType,
        aprType: o.aprType,
      })),
      mock: usedMock,
    });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
