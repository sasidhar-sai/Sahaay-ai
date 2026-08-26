import { describe, it, expect } from 'vitest';
import { UserProfileInputSchema, GeminiMatchResponseSchema } from '../../src/lib/validation';

describe('Zod Validation Schemas Unit Tests', () => {
  it('successfully validates a complete valid user profile payload', () => {
    const validProfile = {
      age: 25,
      gender: 'female',
      state: 'Uttar Pradesh',
      area: 'rural',
      socialCategory: 'obc',
      annualFamilyIncome: 120000,
      occupation: 'student',
      isStudent: true,
      isDifferentlyAbled: false,
      hasBPLCard: false,
      specificNeeds: ['higher_education'],
      preferredLanguage: 'hi'
    };

    const result = UserProfileInputSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('rejects invalid age below 0 or above 120', () => {
    const invalidProfile = {
      age: -5, // Invalid negative age
      gender: 'male',
      state: 'Delhi',
      area: 'urban',
      socialCategory: 'general',
      annualFamilyIncome: 50000,
      occupation: 'farmer'
    };

    const result = UserProfileInputSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });

  it('rejects negative income values', () => {
    const invalidProfile = {
      age: 30,
      gender: 'male',
      state: 'Delhi',
      area: 'urban',
      socialCategory: 'general',
      annualFamilyIncome: -50000, // Invalid negative income
      occupation: 'farmer'
    };

    const result = UserProfileInputSchema.safeParse(invalidProfile);
    expect(result.success).toBe(false);
  });

  it('validates structured Gemini AI response schema', () => {
    const validAiResponse = {
      insights: [
        {
          schemeId: 'pm-kisan',
          whyRelevant: 'As a farmer cultivating agricultural land, this scheme provides direct income support.',
          whyRelevantHi: 'एक किसान के रूप में, यह योजना आपको प्रत्यक्ष आय सहायता प्रदान करती है।',
          keyConsiderations: ['Ensure Aadhaar is linked to bank account', 'Verify land revenue record'],
          keyConsiderationsHi: ['सुनिश्चित करें कि आधार बैंक खाते से जुड़ा है', 'भूमि रिकॉर्ड सत्यापित करें'],
          recommendedNextSteps: ['Visit pmkisan.gov.in', 'Complete eKYC verification'],
          recommendedNextStepsHi: ['pmkisan.gov.in पर जाएं', 'ईकेवाईसी सत्यापन पूरा करें']
        }
      ]
    };

    const result = GeminiMatchResponseSchema.safeParse(validAiResponse);
    expect(result.success).toBe(true);
  });
});
