import { z } from 'zod';

export const GenderSchema = z.enum(['female', 'male', 'transgender', 'other']);

export const SocialCategorySchema = z.enum(['general', 'obc', 'sc', 'st', 'minority', 'any']);

export const OccupationSchema = z.enum([
  'farmer',
  'student',
  'street_vendor',
  'daily_wage_worker',
  'unemployed',
  'homemaker',
  'salaried',
  'self_employed',
  'senior_citizen'
]);

export const AreaTypeSchema = z.enum(['rural', 'urban', 'semi_urban']);

export const LanguageSchema = z.enum(['en', 'hi']);

export const UserProfileInputSchema = z.object({
  age: z.coerce.number().int().min(0, "Age must be at least 0").max(120, "Age must be 120 or under"),
  gender: GenderSchema,
  state: z.string().trim().min(1, "State is required").max(100).default("All India"),
  area: AreaTypeSchema,
  socialCategory: SocialCategorySchema,
  annualFamilyIncome: z.coerce.number().min(0, "Income must be at least 0").max(100000000, "Income exceeds maximum threshold"),
  occupation: OccupationSchema,
  isStudent: z.boolean().default(false),
  isDifferentlyAbled: z.boolean().default(false),
  landHoldingAcres: z.coerce.number().min(0).max(10000).optional(),
  hasBPLCard: z.boolean().default(false),
  specificNeeds: z.array(z.string().trim().max(100)).max(20).optional().default([]),
  preferredLanguage: LanguageSchema.default('en')
});

export type ValidatedUserProfile = z.infer<typeof UserProfileInputSchema>;

// Schema for validating structured Gemini AI output
export const GeminiSchemeInsightSchema = z.object({
  schemeId: z.string(),
  whyRelevant: z.string().min(10),
  whyRelevantHi: z.string().min(10),
  keyConsiderations: z.array(z.string()),
  keyConsiderationsHi: z.array(z.string()),
  recommendedNextSteps: z.array(z.string()),
  recommendedNextStepsHi: z.array(z.string())
});

export const GeminiMatchResponseSchema = z.object({
  insights: z.array(GeminiSchemeInsightSchema)
});

export type GeminiMatchResponse = z.infer<typeof GeminiMatchResponseSchema>;
