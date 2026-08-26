import { describe, it, expect } from 'vitest';
import { checkHardEligibility, filterEligibleSchemes } from '../../src/lib/matcher';
import schemesData from '../../src/data/schemes.json';
import { VerifiedScheme } from '../../src/types/scheme';
import { UserProfile } from '../../src/types/profile';

const catalog = schemesData as unknown as VerifiedScheme[];

describe('Authoritative Deterministic Matcher Unit Tests', () => {
  const pmKisan = catalog.find(s => s.id === 'pm-kisan')!;
  const pragatiGirls = catalog.find(s => s.id === 'pragati-scholarship-girls')!;
  const postMatric = catalog.find(s => s.id === 'post-matric-scholarship')!;
  const oldAgePension = catalog.find(s => s.id === 'ignoaps-old-age-pension')!;

  it('strictly rejects non-farmers from PM-KISAN regardless of other fields', () => {
    const profile: UserProfile = {
      age: 30,
      gender: 'male',
      state: 'Uttar Pradesh',
      area: 'rural',
      socialCategory: 'general',
      annualFamilyIncome: 50000,
      occupation: 'student', // NOT a farmer
      isStudent: true,
      isDifferentlyAbled: false,
      preferredLanguage: 'en'
    };

    const result = checkHardEligibility(profile, pmKisan);
    expect(result.isEligible).toBe(false);
    expect(result.disqualificationReason).toContain('Restricted to occupations');
  });

  it('strictly accepts eligible landholding farmers for PM-KISAN', () => {
    const profile: UserProfile = {
      age: 40,
      gender: 'male',
      state: 'Uttar Pradesh',
      area: 'rural',
      socialCategory: 'general',
      annualFamilyIncome: 80000,
      occupation: 'farmer',
      isStudent: false,
      isDifferentlyAbled: false,
      landHoldingAcres: 2.0,
      preferredLanguage: 'en'
    };

    const result = checkHardEligibility(profile, pmKisan);
    expect(result.isEligible).toBe(true);
  });

  it('strictly rejects male applicants from female-only Pragati scholarship', () => {
    const profile: UserProfile = {
      age: 20,
      gender: 'male', // Female only
      state: 'Maharashtra',
      area: 'urban',
      socialCategory: 'general',
      annualFamilyIncome: 150000,
      occupation: 'student',
      isStudent: true,
      isDifferentlyAbled: false,
      preferredLanguage: 'en'
    };

    const result = checkHardEligibility(profile, pragatiGirls);
    expect(result.isEligible).toBe(false);
    expect(result.disqualificationReason).toContain('female');
  });

  it('strictly rejects high-income applicants from Post-Matric scholarship exceeding ₹2.5L ceiling', () => {
    const profile: UserProfile = {
      age: 21,
      gender: 'female',
      state: 'Bihar',
      area: 'rural',
      socialCategory: 'sc',
      annualFamilyIncome: 600000, // Exceeds ₹2,50,000 ceiling
      occupation: 'student',
      isStudent: true,
      isDifferentlyAbled: false,
      preferredLanguage: 'en'
    };

    const result = checkHardEligibility(profile, postMatric);
    expect(result.isEligible).toBe(false);
    expect(result.disqualificationReason).toContain('exceeds the ceiling');
  });

  it('strictly rejects applicants under 60 from Old Age Pension (IGNOAPS)', () => {
    const profile: UserProfile = {
      age: 45, // Must be 60+
      gender: 'male',
      state: 'Bihar',
      area: 'rural',
      socialCategory: 'general',
      annualFamilyIncome: 30000,
      occupation: 'daily_wage_worker',
      isStudent: false,
      isDifferentlyAbled: false,
      hasBPLCard: true,
      preferredLanguage: 'en'
    };

    const result = checkHardEligibility(profile, oldAgePension);
    expect(result.isEligible).toBe(false);
    expect(result.disqualificationReason).toContain('Minimum age required is 60');
  });

  it('correctly filters all eligible candidate schemes for a senior BPL citizen', () => {
    const profile: UserProfile = {
      age: 68,
      gender: 'male',
      state: 'Bihar',
      area: 'rural',
      socialCategory: 'general',
      annualFamilyIncome: 35000,
      occupation: 'senior_citizen',
      isStudent: false,
      isDifferentlyAbled: false,
      hasBPLCard: true,
      preferredLanguage: 'en'
    };

    const eligibleSchemes = filterEligibleSchemes(profile, catalog);
    const eligibleIds = eligibleSchemes.map(s => s.id);

    expect(eligibleIds).toContain('ignoaps-old-age-pension');
    expect(eligibleIds).toContain('ayushman-bharat-pmjay');
    // Non-matching schemes should NOT be included
    expect(eligibleIds).not.toContain('pragati-scholarship-girls');
    expect(eligibleIds).not.toContain('post-matric-scholarship');
  });
});
