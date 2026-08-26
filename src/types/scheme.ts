import { Gender, SocialCategory, Occupation } from './profile';

export type SchemeCategory =
  | 'agriculture'
  | 'education'
  | 'healthcare'
  | 'social_security'
  | 'livelihood'
  | 'housing';

export type TargetPersona =
  | 'farmer'
  | 'student'
  | 'informal_worker'
  | 'senior_citizen';

export interface VerifiedSource {
  sourceName: string;            // e.g. "Ministry of Agriculture & Farmers Welfare"
  officialPortalUrl: string;     // e.g. "https://pmkisan.gov.in"
  lastVerifiedDate: string;      // ISO Date string e.g. "2025-02-15"
  schemeGuidelinesUrl?: string;  // Direct link to official PDF/gazette
  helplineNumber?: string;       // e.g. "155261 / 011-24300606"
}

export interface SchemeHardRules {
  minAge?: number;
  maxAge?: number;
  allowedGenders?: Gender[];
  allowedCategories?: SocialCategory[];
  maxAnnualIncome?: number;      // Maximum annual family income in INR
  allowedOccupations?: Occupation[];
  requiresStudent?: boolean;
  requiresDifferentlyAbled?: boolean;
  requiresBPL?: boolean;
  maxLandHoldingAcres?: number;
  allowedStates?: string[];      // ['All India'] or specific states
}

export interface SchemeDocument {
  name: string;
  nameHi: string;
  isMandatory: boolean;
  helpTip: string;
  helpTipHi: string;
}

export interface SchemeApplicationStep {
  stepNumber: number;
  instruction: string;
  instructionHi: string;
}

export interface VerifiedScheme {
  id: string;
  name: string;
  nameHi: string;
  category: SchemeCategory;
  targetPersonas: TargetPersona[];
  summary: string;
  summaryHi: string;
  benefits: string[];
  benefitsHi: string[];
  hardRules: SchemeHardRules;
  specificConditions: string[];
  specificConditionsHi: string[];
  documents: SchemeDocument[];
  applicationSteps: SchemeApplicationStep[];
  verifiedSource: VerifiedSource;
}
