export type Gender = 'female' | 'male' | 'transgender' | 'other';

export type SocialCategory = 'general' | 'obc' | 'sc' | 'st' | 'minority' | 'any';

export type Occupation =
  | 'farmer'
  | 'student'
  | 'street_vendor'
  | 'daily_wage_worker'
  | 'unemployed'
  | 'homemaker'
  | 'salaried'
  | 'self_employed'
  | 'senior_citizen';

export type AreaType = 'rural' | 'urban' | 'semi_urban';

export interface UserProfile {
  age: number;
  gender: Gender;
  state: string;               // e.g. "All India", "Uttar Pradesh", "Maharashtra", etc.
  area: AreaType;
  socialCategory: SocialCategory;
  annualFamilyIncome: number;  // in INR (e.g. 80000)
  occupation: Occupation;
  isStudent: boolean;
  isDifferentlyAbled: boolean;
  landHoldingAcres?: number;   // Relevant for agricultural schemes
  hasBPLCard?: boolean;        // Below Poverty Line or Antyodaya Ration Card
  specificNeeds?: string[];    // e.g., ["higher_education", "healthcare", "business_loan", "crop_insurance", "pension", "housing"]
  preferredLanguage: 'en' | 'hi';
}
