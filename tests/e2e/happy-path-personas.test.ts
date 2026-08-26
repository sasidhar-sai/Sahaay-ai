import { describe, it, expect } from 'vitest';
import { DEMO_PERSONAS } from '../../src/data/personas';
import { filterEligibleSchemes, calculateRelevanceScore } from '../../src/lib/matcher';
import schemesData from '../../src/data/schemes.json';
import { VerifiedScheme } from '../../src/types/scheme';

const catalog = schemesData as unknown as VerifiedScheme[];

describe('End-to-End Happy-Path Persona Verification Tests', () => {
  it('correctly matches Low-Income Student persona (Priya Sharma)', () => {
    const studentPreset = DEMO_PERSONAS.find(p => p.id === 'student')!;
    const eligibleSchemes = filterEligibleSchemes(studentPreset.profile, catalog);
    const matchedIds = eligibleSchemes.map(s => s.id);

    // Should match student scholarships and loans
    expect(matchedIds).toContain('post-matric-scholarship');
    expect(matchedIds).toContain('pragati-scholarship-girls');
    expect(matchedIds).toContain('pm-vidyalaxmi');

    // Should NOT match farmer or senior citizen schemes
    expect(matchedIds).not.toContain('pm-kisan');
    expect(matchedIds).not.toContain('ignoaps-old-age-pension');

    // Verify top scheme has high relevance score
    const topScheme = eligibleSchemes[0];
    const scoreResult = calculateRelevanceScore(studentPreset.profile, topScheme);
    expect(scoreResult.score).toBeGreaterThanOrEqual(70);
  });

  it('correctly matches Smallholder Farmer persona (Ramesh Patel)', () => {
    const farmerPreset = DEMO_PERSONAS.find(p => p.id === 'farmer')!;
    const eligibleSchemes = filterEligibleSchemes(farmerPreset.profile, catalog);
    const matchedIds = eligibleSchemes.map(s => s.id);

    // Should match agricultural welfare schemes
    expect(matchedIds).toContain('pm-kisan');
    expect(matchedIds).toContain('pm-fasal-bima');
    expect(matchedIds).toContain('kisan-credit-card');

    // Should NOT match student scholarships
    expect(matchedIds).not.toContain('post-matric-scholarship');
    expect(matchedIds).not.toContain('pragati-scholarship-girls');
  });

  it('correctly matches Daily-Wage Worker / Street Vendor persona (Sunita Devi)', () => {
    const vendorPreset = DEMO_PERSONAS.find(p => p.id === 'informal_worker')!;
    const eligibleSchemes = filterEligibleSchemes(vendorPreset.profile, catalog);
    const matchedIds = eligibleSchemes.map(s => s.id);

    // Should match urban vendor micro-loan and healthcare
    expect(matchedIds).toContain('pm-svanidhi');
    expect(matchedIds).toContain('ayushman-bharat-pmjay');
    expect(matchedIds).toContain('pm-sym-pension');
  });

  it('correctly matches Senior Citizen persona (Gopal Das)', () => {
    const seniorPreset = DEMO_PERSONAS.find(p => p.id === 'senior_citizen')!;
    const eligibleSchemes = filterEligibleSchemes(seniorPreset.profile, catalog);
    const matchedIds = eligibleSchemes.map(s => s.id);

    // Should match Old Age Pension and Ayushman Bharat
    expect(matchedIds).toContain('ignoaps-old-age-pension');
    expect(matchedIds).toContain('ayushman-bharat-pmjay');
    expect(matchedIds).toContain('pm-awas-yojana');
  });
});
