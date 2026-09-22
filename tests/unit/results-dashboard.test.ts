import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { SchemeCard, ActiveProfileBar, TwoEngineFunnel } from '../../src/components/results/SchemeCard';
import CheckPage from '../../src/app/check/page';
import { DICTIONARY } from '../../src/lib/i18n';
import { DEMO_PERSONAS } from '../../src/data/personas';
import { MatchedSchemeResult, MatchApiResponse } from '../../src/types/match';
import { VerifiedScheme } from '../../src/types/scheme';
import { UserProfile } from '../../src/types/profile';
import { generateDeterministicFallbackInsight } from '../../src/lib/gemini';

// Mock next/navigation for SSR
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockScheme: VerifiedScheme = {
  id: 'pm-kisan',
  name: 'PM Kisan Samman Nidhi (PM-KISAN)',
  nameHi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
  ministry: 'Ministry of Agriculture and Farmers Welfare',
  ministryHi: 'कृषि एवं किसान कल्याण मंत्रालय',
  category: 'agriculture',
  summary: 'Financial support of ₹6,000 per year in three equal installments to farmer families.',
  summaryHi: 'किसान परिवारों को तीन समान किस्तों में ₹6,000 प्रति वर्ष की प्रत्यक्ष वित्तीय सहायता।',
  benefits: ['Direct Bank Transfer of ₹6,000 per year', 'Paid in 3 equal installments of ₹2,000 each'],
  benefitsHi: ['₹6,000 प्रति वर्ष का प्रत्यक्ष बैंक हस्तांतरण (DBT)', '₹2,000 की 3 समान किस्तों में भुगतान'],
  eligibilityCriteria: {
    minAge: 18,
    maxAge: 100,
    occupations: ['farmer'],
    maxIncome: 2000000,
    states: ['All India'],
  },
  documents: [
    {
      name: 'Aadhaar Card',
      nameHi: 'आधार कार्ड',
      isMandatory: true,
      helpTip: 'Must be linked with active bank account',
      helpTipHi: 'सक्रिय बैंक खाते से लिंक होना अनिवार्य है'
    }
  ],
  verifiedSource: {
    sourceName: 'Department of Agriculture & Farmers Welfare, GoI',
    officialPortalUrl: 'https://pmkisan.gov.in',
    lastVerifiedDate: '2026-03-01',
    helplineNumber: '155261'
  }
};

const mockMatchedItem: MatchedSchemeResult = {
  scheme: mockScheme,
  relevanceScore: {
    score: 95,
    label: 'High Match',
    labelHi: 'उच्च मिलान',
    contributions: [
      {
        factor: 'Occupation Alignment',
        factorHi: 'व्यवसाय संरेखण',
        points: 40,
        description: 'Profile matches farming requirement',
        descriptionHi: 'प्रोफ़ाइल कृषि आवश्यकता से मेल खाती है'
      }
    ]
  },
  aiInsights: {
    whyRelevant: 'Based on the profile information provided, this scheme appears potentially relevant because your agricultural background aligns with direct income support provisions.',
    whyRelevantHi: 'उपलब्ध प्रोफ़ाइल जानकारी के आधार पर, यह योजना संभावित रूप से प्रासंगिक प्रतीत होती है क्योंकि आपकी कृषि पृष्ठभूमि प्रत्यक्ष आय सहायता प्रावधानों के अनुकूल है।',
    keyConsiderations: ['Ensure Aadhaar is NPCI-seeded to your bank account.'],
    keyConsiderationsHi: ['सुनिश्चित करें कि आधार आपके बैंक खाते से एनपीसीआई-सीडेड है।'],
    recommendedNextSteps: ['Visit pmkisan.gov.in and click New Farmer Registration.'],
    recommendedNextStepsHi: ['pmkisan.gov.in पर जाएं और न्यू फार्मर रजिस्ट्रेशन पर क्लिक करें।'],
    isFallbackGenerated: false
  }
};

const mockProfileFarmer: UserProfile = {
  age: 44,
  gender: 'male',
  state: 'Madhya Pradesh',
  area: 'rural',
  socialCategory: 'general',
  annualFamilyIncome: 85000,
  occupation: 'farmer',
  landHoldingAcres: 1.8,
  hasBPLCard: false,
  isStudent: false,
  isDifferentlyAbled: false,
  specificNeeds: ['crop_insurance', 'credit_support'],
  preferredLanguage: 'en'
};

const renderComponent = (element: React.ReactElement) => {
  const rawHtml = renderToString(element);
  return {
    raw: rawHtml,
    decoded: rawHtml
      .replace(/<!-- -->/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
  };
};

describe('Two-Engine Results Dashboard & Active Persona Bar (Improvement #7)', () => {
  describe('Active Profile Bar Rendering & Context', () => {
    it('renders profile attributes (occupation, income, state, area, BPL status) in English', () => {
      const { decoded } = renderComponent(
        React.createElement(ActiveProfileBar, {
          activeProfile: mockProfileFarmer,
          activePersonaId: 'farmer',
          currentLang: 'en',
          onEditProfile: vi.fn(),
          onReset: vi.fn(),
          onSelectPersona: vi.fn(),
        })
      );

      expect(decoded).toContain(DICTIONARY.en.activeProfileTitle);
      expect(decoded).toContain(DICTIONARY.en.btnEditProfile);
      expect(decoded).toContain('85,000');
      expect(decoded).toContain('Madhya Pradesh');
      expect(decoded).toContain(DICTIONARY.en.areaRural);
      expect(decoded).toContain(DICTIONARY.en.occFarmer);
      expect(decoded).toContain('1.8 Acres');
      expect(decoded).toContain(DICTIONARY.en.profileBplNo);
      expect(decoded).toContain('Ramesh Patel');
    });

    it('renders profile attributes properly in Hindi', () => {
      const { decoded } = renderComponent(
        React.createElement(ActiveProfileBar, {
          activeProfile: mockProfileFarmer,
          activePersonaId: 'farmer',
          currentLang: 'hi',
          onEditProfile: vi.fn(),
          onReset: vi.fn(),
          onSelectPersona: vi.fn(),
        })
      );

      expect(decoded).toContain(DICTIONARY.hi.activeProfileTitle);
      expect(decoded).toContain(DICTIONARY.hi.btnEditProfile);
      expect(decoded).toContain(DICTIONARY.hi.occFarmer);
      expect(decoded).toContain('रमेश पटेल');
    });

    it('displays custom profile badge when no persona preset is selected', () => {
      const { decoded } = renderComponent(
        React.createElement(ActiveProfileBar, {
          activeProfile: mockProfileFarmer,
          activePersonaId: undefined,
          currentLang: 'en',
          onEditProfile: vi.fn(),
          onReset: vi.fn(),
          onSelectPersona: vi.fn(),
        })
      );

      expect(decoded).toContain(DICTIONARY.en.customProfileLabel);
    });

    it('renders 1-click persona switcher buttons for all 4 demo personas', () => {
      const { decoded } = renderComponent(
        React.createElement(ActiveProfileBar, {
          activeProfile: mockProfileFarmer,
          activePersonaId: 'farmer',
          currentLang: 'en',
          onEditProfile: vi.fn(),
          onReset: vi.fn(),
          onSelectPersona: vi.fn(),
        })
      );

      expect(decoded).toContain(DICTIONARY.en.quickSwitchPersona);
      expect(decoded).toContain('Priya Sharma');
      expect(decoded).toContain('Ramesh Patel');
      expect(decoded).toContain('Sunita Devi');
      expect(decoded).toContain('Gopal Das');
    });
  });

  describe('Dynamic Two-Engine Funnel Component', () => {
    it('dynamically calculates evaluated, passed, and excluded scheme counts', () => {
      const mockResponse: MatchApiResponse = {
        success: true,
        totalCatalogCount: 12,
        deterministicPassedCount: 4,
        matchedSchemes: [mockMatchedItem],
        disclaimer: { en: 'test', hi: 'test' },
        processingTimeMs: 45
      };

      const { decoded } = renderComponent(
        React.createElement(TwoEngineFunnel, {
          matchResponse: mockResponse,
          currentLang: 'en'
        })
      );

      // Verify title & badges
      expect(decoded).toContain(DICTIONARY.en.funnelTitle);
      expect(decoded).toContain(DICTIONARY.en.engine1FunnelTitle);
      expect(decoded).toContain(DICTIONARY.en.engine2FunnelTitle);

      // Verify dynamic counts
      expect(decoded).toContain('12'); // Total evaluated
      expect(decoded).toContain('4');  // Passed deterministic
      expect(decoded).toContain('8');  // Excluded by rules: 12 - 4 = 8
      expect(decoded).toContain(DICTIONARY.en.funnelAiRoleNote);
    });

    it('displays dynamic counts correctly for another catalog size (no hardcoding)', () => {
      const mockResponseCustom: MatchApiResponse = {
        success: true,
        totalCatalogCount: 20,
        deterministicPassedCount: 6,
        matchedSchemes: [mockMatchedItem],
        disclaimer: { en: 'test', hi: 'test' },
        processingTimeMs: 50
      };

      const { decoded } = renderComponent(
        React.createElement(TwoEngineFunnel, {
          matchResponse: mockResponseCustom,
          currentLang: 'en'
        })
      );

      expect(decoded).toContain('20'); // Total evaluated
      expect(decoded).toContain('6');  // Passed
      expect(decoded).toContain('14'); // Excluded: 20 - 6 = 14
    });

    it('shows Gemini connected status when Gemini generated explanations', () => {
      const mockResponseGemini: MatchApiResponse = {
        success: true,
        totalCatalogCount: 12,
        deterministicPassedCount: 1,
        matchedSchemes: [
          {
            ...mockMatchedItem,
            aiInsights: { ...mockMatchedItem.aiInsights, isFallbackGenerated: false }
          }
        ],
        disclaimer: { en: 'test', hi: 'test' },
        processingTimeMs: 40
      };

      const { decoded } = renderComponent(
        React.createElement(TwoEngineFunnel, {
          matchResponse: mockResponseGemini,
          currentLang: 'en'
        })
      );

      expect(decoded).toContain(DICTIONARY.en.funnelStatusConnected);
      expect(decoded).toContain('Gemini 2.5 Flash Active');
    });

    it('shows deterministic fallback status when fallback engine was used', () => {
      const mockResponseFallback: MatchApiResponse = {
        success: true,
        totalCatalogCount: 12,
        deterministicPassedCount: 1,
        matchedSchemes: [
          {
            ...mockMatchedItem,
            aiInsights: { ...mockMatchedItem.aiInsights, isFallbackGenerated: true }
          }
        ],
        disclaimer: { en: 'test', hi: 'test' },
        processingTimeMs: 40
      };

      const { decoded } = renderComponent(
        React.createElement(TwoEngineFunnel, {
          matchResponse: mockResponseFallback,
          currentLang: 'en'
        })
      );

      expect(decoded).toContain(DICTIONARY.en.funnelStatusFallback);
      expect(decoded).toContain('Deterministic Fallback');
      expect(decoded).not.toContain('Active (Deterministic Fallback)');
      expect(decoded).toContain(DICTIONARY.en.engine1FunnelBadge);
      expect(decoded).toContain('Deterministic Eligibility Rules');
      expect(decoded).not.toContain('Statutory Rules');
    });

    it('shows no candidates status when 0 candidates qualified', () => {
      const mockResponseEmpty: MatchApiResponse = {
        success: true,
        totalCatalogCount: 12,
        deterministicPassedCount: 0,
        matchedSchemes: [],
        disclaimer: { en: 'test', hi: 'test' },
        processingTimeMs: 30
      };

      const { decoded } = renderComponent(
        React.createElement(TwoEngineFunnel, {
          matchResponse: mockResponseEmpty,
          currentLang: 'en'
        })
      );

      expect(decoded).toContain(DICTIONARY.en.funnelStatusNone);
    });
  });

  describe('Deterministic Eligibility Badge & Official Disclaimers', () => {
    it('renders exact phrase "Deterministic Eligibility Rules: Passed" on SchemeCard', () => {
      const { decoded } = renderComponent(
        React.createElement(SchemeCard, { matchedItem: mockMatchedItem, currentLang: 'en' })
      );

      expect(decoded).toContain('Deterministic Eligibility Rules: Passed');
      expect(decoded).toContain(DICTIONARY.en.deterministicPassedBadge);
    });

    it('NEVER contains the forbidden phrase "Statutory Eligibility: Verified"', () => {
      const { decoded: decodedEn } = renderComponent(
        React.createElement(SchemeCard, { matchedItem: mockMatchedItem, currentLang: 'en' })
      );
      const { decoded: decodedHi } = renderComponent(
        React.createElement(SchemeCard, { matchedItem: mockMatchedItem, currentLang: 'hi' })
      );

      expect(decodedEn).not.toContain('Statutory Eligibility: Verified');
      expect(decodedHi).not.toContain('Statutory Eligibility: Verified');
    });

    it('displays notice that final eligibility and approval are determined exclusively by the relevant government authority', () => {
      const { decoded: decodedEn } = renderComponent(
        React.createElement(SchemeCard, { matchedItem: mockMatchedItem, currentLang: 'en' })
      );
      const { decoded: decodedHi } = renderComponent(
        React.createElement(SchemeCard, { matchedItem: mockMatchedItem, currentLang: 'hi' })
      );

      expect(decodedEn).toContain(DICTIONARY.en.officialApprovalNotice);
      expect(decodedEn).toContain('government authority');
      expect(decodedHi).toContain(DICTIONARY.hi.officialApprovalNotice);
    });

    it('clearly separates relevance score from legal eligibility with explanatory notice', () => {
      const { decoded } = renderComponent(
        React.createElement(SchemeCard, { matchedItem: mockMatchedItem, currentLang: 'en' })
      );

      expect(decoded).toContain(DICTIONARY.en.alignmentScoreLabel);
      expect(decoded).toContain(DICTIONARY.en.notLegalEligibilityNotice);
      expect(decoded).toContain('95%');
    });

    it('renders correctly in Hindi with localized badge and content', () => {
      const { decoded } = renderComponent(
        React.createElement(SchemeCard, { matchedItem: mockMatchedItem, currentLang: 'hi' })
      );

      expect(decoded).toContain(mockScheme.nameHi);
      expect(decoded).toContain(DICTIONARY.hi.alignmentScoreLabel);
      expect(decoded).toContain(DICTIONARY.hi.notLegalEligibilityNotice);
    });
  });

  describe('Demo Persona Switching Data & Integrity', () => {
    it('provides all 4 core demo personas with realistic profiles', () => {
      expect(DEMO_PERSONAS.length).toBeGreaterThanOrEqual(4);
      const personaIds = DEMO_PERSONAS.map(p => p.id);
      expect(personaIds).toContain('student');
      expect(personaIds).toContain('farmer');
      expect(personaIds).toContain('informal_worker');
      expect(personaIds).toContain('senior_citizen');
    });

    it('each persona contains bilingual names and complete socio-economic profile criteria', () => {
      DEMO_PERSONAS.forEach(persona => {
        expect(persona.name).toBeTruthy();
        expect(persona.nameHi).toBeTruthy();
        expect(persona.roleTitle).toBeTruthy();
        expect(persona.roleTitleHi).toBeTruthy();
        expect(persona.profile.age).toBeGreaterThan(0);
        expect(persona.profile.gender).toBeTruthy();
        expect(persona.profile.state).toBeTruthy();
        expect(persona.profile.occupation).toBeTruthy();
        expect(persona.profile.annualFamilyIncome).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('English / Hindi i18n Key Parity', () => {
    it('maintains exact 1-to-1 key parity between English and Hindi dictionaries', () => {
      const enKeys = Object.keys(DICTIONARY.en).sort();
      const hiKeys = Object.keys(DICTIONARY.hi).sort();

      const missingInHi = enKeys.filter(k => !(k in DICTIONARY.hi));
      const missingInEn = hiKeys.filter(k => !(k in DICTIONARY.en));

      expect(missingInHi).toEqual([]);
      expect(missingInEn).toEqual([]);
      expect(enKeys).toEqual(hiKeys);
    });

    it('contains non-empty translations for all Improvement #7 dashboard keys in both languages', () => {
      const newKeys: (keyof typeof DICTIONARY.en)[] = [
        'activeProfileTitle',
        'activePersonaLabel',
        'customProfileLabel',
        'btnEditProfile',
        'quickSwitchPersona',
        'profileAge',
        'profileGender',
        'profileState',
        'profileArea',
        'profileIncome',
        'profileCategory',
        'profileOccupation',
        'profileLand',
        'profileBpl',
        'profileBplYes',
        'profileBplNo',
        'profileNeeds',
        'funnelTitle',
        'funnelSubtitle',
        'engine1FunnelTitle',
        'engine1FunnelBadge',
        'funnelTotalEvaluated',
        'funnelPassedRules',
        'funnelExcludedRules',
        'engine2FunnelTitle',
        'engine2FunnelBadge',
        'funnelCandidatesReceived',
        'funnelAiStatus',
        'funnelStatusConnected',
        'funnelStatusFallback',
        'funnelStatusNone',
        'funnelAiRoleNote',
        'deterministicPassedBadge',
        'officialApprovalNotice',
        'alignmentScoreLabel',
        'notLegalEligibilityNotice'
      ];

      newKeys.forEach(key => {
        expect(DICTIONARY.en[key]).toBeTruthy();
        expect(DICTIONARY.hi[key]).toBeTruthy();
        expect(typeof DICTIONARY.en[key]).toBe('string');
        expect(typeof DICTIONARY.hi[key]).toBe('string');
      });
    });
  });

  describe('SSR Safety & Accessibility', () => {
    it('renders CheckPage during SSR without throwing any exceptions', () => {
      let result = { raw: '', decoded: '' };
      expect(() => {
        result = renderComponent(React.createElement(CheckPage));
      }).not.toThrow();

      expect(result.raw).toContain('main');
      expect(result.decoded).toContain(DICTIONARY.en.wizardTitle);
    });
  });

  describe('Advisory Non-Definitive Relevance Explanations', () => {
    it('generates advisory language without definitive eligibility claims in fallback mode', () => {
      const insight = generateDeterministicFallbackInsight(mockProfileFarmer, mockScheme);

      // Must start with advisory phrasing
      expect(insight.whyRelevant).toContain('Based on the profile information provided, this scheme appears potentially relevant because');
      expect(insight.whyRelevantHi).toContain('उपलब्ध प्रोफ़ाइल जानकारी के आधार पर, यह योजना संभावित रूप से प्रासंगिक प्रतीत होती है क्योंकि');

      // Must NOT contain definitive entitlement statements
      expect(insight.whyRelevant.toLowerCase()).not.toContain('you are eligible to receive');
      expect(insight.whyRelevant.toLowerCase()).not.toContain('you qualify for');

      // Must preserve the government authority disclaimer
      expect(insight.whyRelevant).toContain('Final eligibility and approval are determined exclusively by the relevant government authority.');
      expect(insight.whyRelevantHi).toContain('अंतिम पात्रता और स्वीकृति केवल संबंधित सरकारी प्राधिकरण द्वारा निर्धारित की जाती है।');
    });
  });
});
