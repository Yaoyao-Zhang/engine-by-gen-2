-- CreateTable
CREATE TABLE "LoanApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "ssnEncrypted" TEXT NOT NULL,
    "ssnIv" TEXT NOT NULL,
    "ssnTag" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "loanPurpose" TEXT NOT NULL,
    "loanAmount" INTEGER NOT NULL,
    "propertyStatus" TEXT NOT NULL,
    "creditScore" INTEGER NOT NULL,
    "employmentStatus" TEXT NOT NULL,
    "employmentPayFrequency" TEXT NOT NULL,
    "annualIncome" INTEGER NOT NULL,
    "consentsToFcra" BOOLEAN NOT NULL,
    "fcraLanguage" TEXT NOT NULL,
    "consentsToTcpa" BOOLEAN NOT NULL,
    "tcpaLanguage" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "engineLeadUuid" TEXT,
    "engineRateTableUuid" TEXT
);

-- CreateTable
CREATE TABLE "LoanOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" TEXT NOT NULL,
    "originatorKey" TEXT,
    "originatorName" TEXT,
    "originatorLogo" TEXT,
    "originatorDisclaimer" TEXT,
    "offerUuid" TEXT,
    "termLength" INTEGER,
    "termUnit" TEXT,
    "maxAmount" REAL,
    "minAmount" REAL,
    "maxApr" REAL,
    "minApr" REAL,
    "meanApr" REAL,
    "monthlyPayment" REAL,
    "maxMonthlyPayment" REAL,
    "minMonthlyPayment" REAL,
    "preQualified" BOOLEAN NOT NULL DEFAULT false,
    "preApproved" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "productType" TEXT,
    "productSubType" TEXT,
    "aprType" TEXT,
    "sponsored" BOOLEAN NOT NULL DEFAULT false,
    "rawResponse" TEXT,
    CONSTRAINT "LoanOffer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "LoanApplication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "LoanApplication_email_idx" ON "LoanApplication"("email");

-- CreateIndex
CREATE INDEX "LoanApplication_createdAt_idx" ON "LoanApplication"("createdAt");

-- CreateIndex
CREATE INDEX "LoanApplication_loanPurpose_idx" ON "LoanApplication"("loanPurpose");

-- CreateIndex
CREATE INDEX "LoanApplication_creditScore_idx" ON "LoanApplication"("creditScore");

-- CreateIndex
CREATE INDEX "LoanOffer_applicationId_idx" ON "LoanOffer"("applicationId");

-- CreateIndex
CREATE INDEX "LoanOffer_createdAt_idx" ON "LoanOffer"("createdAt");
