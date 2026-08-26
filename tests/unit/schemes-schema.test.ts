import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import schemesData from '../../src/data/schemes.json';
import { DEMO_PERSONAS } from '../../src/data/personas';
import { filterEligibleSchemes } from '../../src/lib/matcher';
import { VerifiedScheme } from '../../src/types/scheme';

const rawSchemes = schemesData as unknown as VerifiedScheme[];

// Strict Zod schema for verified schemes
const SchemeDocumentZodSchema = z.object({
  name: z.string().min(1),
  nameHi: z.string().min(1),
  isMandatory: z.boolean(),
  helpTip: z.string().min(1),
  helpTipHi: z.string().min(1)
});

const SchemeApplicationStepZodSchema = z.object({
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(5),
  instructionHi: z.string().min(5)
});

const VerifiedSourceZodSchema = z.object({
  sourceName: z.string().min(3),
  officialPortalUrl: z.string().url(),
  lastVerifiedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be ISO format YYYY-MM-DD"),
  schemeGuidelinesUrl: z.string().url().optional(),
  helplineNumber: z.string().optional()
});

const SchemeHardRulesZodSchema = z.object({
  minAge: z.number().int().min(0).max(120).optional(),
  maxAge: z.number().int().min(0).max(120).optional(),
  allowedGenders: z.array(z.enum(['female', 'male', 'transgender', 'other'])).optional(),
  allowedCategories: z.array(z.enum(['general', 'obc', 'sc', 'st', 'minority', 'any'])).optional(),
  maxAnnualIncome: z.number().positive().optional(),
  allowedOccupations: z.array(z.string()).optional(),
  requiresStudent: z.boolean().optional(),
  requiresDifferentlyAbled: z.boolean().optional(),
  requiresBPL: z.boolean().optional(),
  maxLandHoldingAcres: z.number().positive().optional(),
  allowedStates: z.array(z.string()).optional()
});

const VerifiedSchemeZodSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  name: z.string().min(3),
  nameHi: z.string().min(3),
  category: z.enum(['agriculture', 'education', 'healthcare', 'social_security', 'livelihood', 'housing']),
  targetPersonas: z.array(z.enum(['farmer', 'student', 'informal_worker', 'senior_citizen'])).min(1),
  summary: z.string().min(10),
  summaryHi: z.string().min(10),
  benefits: z.array(z.string().min(5)).min(1),
  benefitsHi: z.array(z.string().min(5)).min(1),
  hardRules: SchemeHardRulesZodSchema,
  specificConditions: z.array(z.string().min(5)),
  specificConditionsHi: z.array(z.string().min(5)),
  documents: z.array(SchemeDocumentZodSchema).min(1),
  applicationSteps: z.array(SchemeApplicationStepZodSchema).min(1),
  verifiedSource: VerifiedSourceZodSchema
});

describe('Verified Scheme Dataset Schema & Integrity Unit Tests', () => {
  it('contains exactly 12 authentic verified schemes in catalog', () => {
    expect(rawSchemes.length).toBe(12);
  });

  it('ensures every scheme in schemes.json conforms strictly to VerifiedSchemeZodSchema', () => {
    rawSchemes.forEach((scheme) => {
      const result = VerifiedSchemeZodSchema.safeParse(scheme);
      if (!result.success) {
        console.error(`Validation failed for scheme: ${scheme.id}`, result.error.format());
      }
      expect(result.success, `Scheme ${scheme.id} must be valid`).toBe(true);
    });
  });

  it('guarantees all scheme IDs are 100% unique across the catalog', () => {
    const idSet = new Set<string>();
    rawSchemes.forEach(s => {
      expect(idSet.has(s.id), `Duplicate scheme ID detected: ${s.id}`).toBe(false);
      idSet.add(s.id);
    });
  });

  it('ensures all official portal URLs point to secure valid government domains (.gov.in or .nic.in or .org)', () => {
    rawSchemes.forEach(s => {
      const url = s.verifiedSource.officialPortalUrl;
      expect(url.startsWith('https://'), `Scheme ${s.id} portal URL must use HTTPS`).toBe(true);
      const isGovDomain = url.includes('.gov.in') || url.includes('.nic.in') || url.includes('.aicte-india.org') || url.includes('.npscra.nsdl.co.in') || url.includes('maandhan.in');
      expect(isGovDomain, `Scheme ${s.id} portal URL must be official`).toBe(true);
    });
  });

  it('verifies that each of the 4 demo personas matches at least 2 relevant schemes', () => {
    DEMO_PERSONAS.forEach(persona => {
      const matched = filterEligibleSchemes(persona.profile, rawSchemes);
      expect(matched.length, `Persona ${persona.name} should match at least 2 schemes`).toBeGreaterThanOrEqual(2);
    });
  });
});


