import { z } from "zod";

function validatePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
  if (normalized.length !== 10) return false;
  const areaCode = normalized.slice(0, 3);
  if (areaCode[0] === areaCode[1] && areaCode[1] === areaCode[2]) return false;
  return true;
}

const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;
const INVALID_SSNS = ["123-45-6789", "219-09-9999", "078-05-1120"];

const ZIPCODE_REGEX = /^\d{5}(-\d{4})?$/;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
  "DC","PR","VI",
] as const;

export const LOAN_PURPOSES = [
  { value: "debt_consolidation", label: "Credit card payoff" },
  { value: "home_improvement", label: "Home improvement" },
  { value: "large_purchases", label: "Major purchase" },
  { value: "moving", label: "Moving expenses" },
  { value: "business", label: "Business Loan" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
  { value: "refinance", label: "Loan consolidation" },
] as const;

export const EMPLOYMENT_STATUSES = [
  { value: "employed", label: "Employed" },
  { value: "not_employed", label: "Not currently working" },
  { value: "military", label: "Military" },
  { value: "retired", label: "Retired" },
  { value: "self_employed", label: "Self-employed" },
] as const;

export const PAY_FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "twice_monthly", label: "Twice monthly" },
  { value: "monthly", label: "Monthly" },
] as const;

export const PROPERTY_STATUSES = [
  { value: "rent", label: "Rent" },
  { value: "own", label: "Own" },
  { value: "own_with_mortgage", label: "Own with mortgage" },
] as const;

function validateSSN(ssn: string): boolean {
  if (!SSN_REGEX.test(ssn)) return false;
  if (INVALID_SSNS.includes(ssn)) return false;

  const [g1, g2, g3] = ssn.split("-");

  // All digits in each group cannot be identical across the whole SSN
  const allDigits = ssn.replace(/-/g, "");
  if (new Set(allDigits.split("")).size === 1) return false;

  if (g1 === "000" || g1 === "666" || g1[0] === "9") return false;
  if (g2 === "00") return false;
  if (g3 === "0000") return false;

  return true;
}

export const loanApplicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().refine(validatePhone, "Please enter a valid 10-digit US phone number"),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in yyyy-mm-dd format")
    .refine((dob) => {
      const date = new Date(dob);
      const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return age >= 18;
    }, "You must be at least 18 years old"),
  ssn: z.string().refine(validateSSN, "Please enter a valid Social Security Number (###-##-####)"),
  address1: z.string().min(1, "Street address is required").max(200),
  address2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(100),
  state: z.enum(US_STATES, { message: "Please select a valid US state" }),
  zipcode: z.string().regex(ZIPCODE_REGEX, "Please enter a valid zip code (##### or #####-####)"),

  // Loan Information
  loanPurpose: z.string().min(1, "Please select a loan purpose"),
  loanAmount: z.number().int().min(1000, "Minimum loan amount is $1,000").max(100000, "Maximum loan amount is $100,000"),

  // Mortgage Information
  propertyStatus: z.string().min(1, "Please select your property status"),

  // Credit Information
  creditScore: z.number().int().min(300, "Credit score must be at least 300").max(850, "Credit score cannot exceed 850"),

  // Financial Information
  employmentStatus: z.string().min(1, "Please select your employment status"),
  employmentPayFrequency: z.string().min(1, "Please select your pay frequency"),
  annualIncome: z.number().int().min(10000, "Minimum annual income is $10,000").max(500000, "Maximum annual income is $500,000"),

  // Legal Information
  consentsToFcra: z.literal(true, { message: "FCRA consent is required to proceed" }),
  consentsToTcpa: z.boolean(),
});

export type LoanApplicationFormData = z.infer<typeof loanApplicationSchema>;

export function creditScoreToRating(score: number): string {
  if (score >= 720) return "excellent";
  if (score >= 660) return "good";
  if (score >= 620) return "fair";
  return "poor";
}
