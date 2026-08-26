import { describe, it, expect } from 'vitest';
import { calculateRelevanceScore } from '../../src/lib/matcher';
import schemesData from '../../src/data/schemes.json';
import { VerifiedScheme } from '../../src/types/scheme';
import { UserProfile } from '../../src/types/profile';

const catalog = schemesData as unknown as VerifiedScheme[];

describe('Transparent Relevance Scorer Unit Tests', () => {
  const pmKisan = catalog.find(s => s.id === 'pm-kisan')!;
  const svanidhi = catalog.find(s => s.id === 'pm-svanidhi')!;

  it('calculates high relevance score for perfectly aligned farmer profile', () => {
    const farmerProfile: UserProfile = {
      age: 42,
      gender: 'male',
      state: 'Madhya Pradesh',
      area: 'rural',
      socialCategory: 'general',
      annualFamilyIncome: 75000,
      occupation: 'farmer',
      isStudent: false,
      isDifferentlyAbled: false,
      landHoldingAcres: 1.5,
      specificNeeds: ['crop_insurance', 'credit_support'],
      preferredLanguage: 'en'
    };

    const scoreResult = calculateRelevanceScore(farmerProfile, pmKisan);

    expect(scoreResult.score).toBeGreaterThanOrEqual(75);
    expect(scoreResult.label).toBe('High Match');
    expect(scoreResult.contributions.length).toBeGreaterThan(0);

    // Verify point contributions breakdown
    const occupationContrib = scoreResult.contributions.find(c => c.factor.includes('Persona'));
    expect(occupationContrib).toBeDefined();
    expect(occupationContrib?.points).toBe(35);
  });

  it('calculates score with stated welfare needs synergy', () => {
    const vendorProfile: UserProfile = {
      age: 35,
      gender: 'female',
      state: 'Delhi',
      area: 'urban',
      socialCategory: 'sc',
      annualFamilyIncome: 65000,
      occupation: 'street_vendor',
      isStudent: false,
      isDifferentlyAbled: false,
      hasBPLCard: true,
      specificNeeds: ['business_loan'],
      preferredLanguage: 'en'
    };

    const scoreResult = calculateRelevanceScore(vendorProfile, svanidhi);

    expect(scoreResult.score).toBeGreaterThanOrEqual(80);
    const needContrib = scoreResult.contributions.find(c => c.factor.includes('Needs'));
    expect(needContrib).toBeDefined();
    expect(needContrib?.points).toBe(20);
  });

  it('ensures score is bounded strictly between 0 and 100', () => {
    const edgeProfile: UserProfile = {
      age: 18,
      gender: 'female',
      state: 'All India',
      area: 'rural',
      socialCategory: 'st',
      annualFamilyIncome: 10000,
      occupation: 'farmer',
      isStudent: false,
      isDifferentlyAbled: true,
      hasBPLCard: true,
      specificNeeds: ['crop_insurance', 'credit_support', 'healthcare', 'pension', 'housing'],
      preferredLanguage: 'en'
    };

    const scoreResult = calculateRelevanceScore(edgeProfile, pmKisan);
    expect(scoreResult.score).toBeLessThanOrEqual(100);
    expect(scoreResult.score).toBeGreaterThanOrEqual(0);
  });
});
