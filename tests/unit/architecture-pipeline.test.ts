import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ArchitecturePipeline } from '../../src/components/home/ArchitecturePipeline';
import LandingPage from '../../src/app/page';
import { DICTIONARY } from '../../src/lib/i18n';

// Mock next/navigation for LandingPage SSR rendering
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const renderComponent = (element: React.ReactElement) => {
  const rawHtml = renderToString(element);
  return {
    raw: rawHtml,
    decoded: rawHtml
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&ldquo;/g, '“')
      .replace(/&rdquo;/g, '”'),
  };
};

describe('Two-Engine Architecture Pipeline Tests', () => {
  describe('Server-Side Rendering (SSR) & Accessibility', () => {
    it('renders cleanly in English during SSR without throwing exceptions', () => {
      let result = { raw: '', decoded: '' };
      expect(() => {
        result = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'en' }));
      }).not.toThrow();

      expect(result.raw).toContain('role="region"');
      expect(result.raw).toContain(DICTIONARY.en.archTitle);
      expect(result.decoded).toContain(DICTIONARY.en.archCorePrinciple);
    });

    it('renders cleanly in Hindi during SSR without throwing exceptions', () => {
      let result = { raw: '', decoded: '' };
      expect(() => {
        result = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'hi' }));
      }).not.toThrow();

      expect(result.raw).toContain('role="region"');
      expect(result.raw).toContain(DICTIONARY.hi.archTitle);
      expect(result.decoded).toContain(DICTIONARY.hi.archCorePrinciple);
    });
  });

  describe('Core Principle Banner', () => {
    it('displays the exact core message in English', () => {
      const { decoded } = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'en' }));

      // Core message: "Rules determine eligibility. AI explains and personalizes."
      expect(decoded).toContain(DICTIONARY.en.archCorePrinciple);
      expect(decoded).toContain('Rules determine eligibility. AI explains and personalizes.');
      expect(decoded).toContain(DICTIONARY.en.archCorePrincipleTitle);
      expect(decoded).toContain(DICTIONARY.en.archCorePrincipleDesc);
      expect(decoded).toContain('Google Gemini 2.5 Flash');
      expect(decoded).toContain('Deterministic Engine');
    });

    it('displays the exact core message in Hindi', () => {
      const { decoded } = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'hi' }));

      expect(decoded).toContain(DICTIONARY.hi.archCorePrinciple);
      expect(decoded).toContain('पात्रता नियम तय करते हैं, एआई समझाता और व्यक्तिगत बनाता है।');
      expect(decoded).toContain(DICTIONARY.hi.archCorePrincipleTitle);
      expect(decoded).toContain(DICTIONARY.hi.archCorePrincipleDesc);
    });
  });

  describe('Two-Engine Pipeline Structure', () => {
    it('renders Engine 1 (Deterministic) and Engine 2 (AI Intelligence) headers and badges', () => {
      const { decoded } = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'en' }));

      // Engine 1
      expect(decoded).toContain(DICTIONARY.en.archEngineDeterministicTitle);
      expect(decoded).toContain(DICTIONARY.en.archEngineDeterministicBadge);
      expect(decoded).toContain(DICTIONARY.en.archEngineDeterministicDesc);

      // Engine 2
      expect(decoded).toContain(DICTIONARY.en.archEngineAiTitle);
      expect(decoded).toContain(DICTIONARY.en.archEngineAiBadge);
      expect(decoded).toContain(DICTIONARY.en.archEngineAiDesc);

      // Handover guarantee between engines
      expect(decoded).toContain(DICTIONARY.en.archHandoverText);
      expect(decoded).toContain('AI receives only eligible candidates');
    });

    it('renders all 6 pipeline stages in sequential order', () => {
      const { decoded } = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'en' }));

      // Stage 1: User Profile
      expect(decoded).toContain(DICTIONARY.en.archStage1Title);
      expect(decoded).toContain(DICTIONARY.en.archStage1Subtitle);
      expect(decoded).toContain(DICTIONARY.en.archStage1Desc);

      // Stage 2: Rule-Based Eligibility Filtering
      expect(decoded).toContain(DICTIONARY.en.archStage2Title);
      expect(decoded).toContain(DICTIONARY.en.archStage2Subtitle);
      expect(decoded).toContain(DICTIONARY.en.archStage2Desc);

      // Stage 3: Eligible Scheme Candidates
      expect(decoded).toContain(DICTIONARY.en.archStage3Title);
      expect(decoded).toContain(DICTIONARY.en.archStage3Subtitle);
      expect(decoded).toContain(DICTIONARY.en.archStage3Desc);

      // Stage 4: Gemini AI Reasoning
      expect(decoded).toContain(DICTIONARY.en.archStage4Title);
      expect(decoded).toContain(DICTIONARY.en.archStage4Subtitle);
      expect(decoded).toContain(DICTIONARY.en.archStage4Desc);

      // Stage 5: Personalized Explanations
      expect(decoded).toContain(DICTIONARY.en.archStage5Title);
      expect(decoded).toContain(DICTIONARY.en.archStage5Subtitle);
      expect(decoded).toContain(DICTIONARY.en.archStage5Desc);

      // Stage 6: Verified Recommendations
      expect(decoded).toContain(DICTIONARY.en.archStage6Title);
      expect(decoded).toContain(DICTIONARY.en.archStage6Subtitle);
      expect(decoded).toContain(DICTIONARY.en.archStage6Desc);

      // Output Pill
      expect(decoded).toContain('Official Portals');
    });

    it('renders all 6 pipeline stages correctly in Hindi', () => {
      const { decoded } = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'hi' }));

      expect(decoded).toContain(DICTIONARY.hi.archStage1Title);
      expect(decoded).toContain(DICTIONARY.hi.archStage2Title);
      expect(decoded).toContain(DICTIONARY.hi.archStage3Title);
      expect(decoded).toContain(DICTIONARY.hi.archStage4Title);
      expect(decoded).toContain(DICTIONARY.hi.archStage5Title);
      expect(decoded).toContain(DICTIONARY.hi.archStage6Title);
      expect(decoded).toContain(DICTIONARY.hi.archHandoverText);
    });
  });

  describe('Wording Guardrails (Technically Defensible Claims)', () => {
    it('does NOT contain "0% hallucination" or "zero-hallucination" in English or Hindi', () => {
      const { decoded: decodedEn } = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'en' }));
      const { decoded: decodedHi } = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'hi' }));

      const forbiddenPhrases = [
        '0% hallucination',
        'zero hallucination',
        'zero-hallucination',
        'zero hallucination guarantee',
        '100% hallucination free',
      ];

      for (const phrase of forbiddenPhrases) {
        expect(decodedEn.toLowerCase()).not.toContain(phrase);
        expect(decodedHi.toLowerCase()).not.toContain(phrase);
      }
    });

    it('contains strictly technically defensible claims', () => {
      const { decoded } = renderComponent(React.createElement(ArchitecturePipeline, { currentLang: 'en' }));

      // Technically defensible wording
      expect(decoded).toContain('Deterministic Eligibility Engine');
      expect(decoded).toContain('Rule-Based Eligibility Filtering');
      expect(decoded).toContain('AI receives only eligible candidates');
      expect(decoded).toContain('AI does not determine statutory eligibility');
    });
  });

  describe('Landing Page Integration', () => {
    it('integrates ArchitecturePipeline section into the landing page', () => {
      const { raw, decoded } = renderComponent(React.createElement(LandingPage));

      // Architecture Pipeline section exists on page
      expect(raw).toContain('id="architecture"');
      expect(decoded).toContain(DICTIONARY.en.archBadge);
      expect(decoded).toContain(DICTIONARY.en.archTitle);
      expect(decoded).toContain(DICTIONARY.en.archSubtitle);

      // Renders the pipeline component inside
      expect(decoded).toContain(DICTIONARY.en.archCorePrinciple);
      expect(decoded).toContain(DICTIONARY.en.archEngineDeterministicTitle);
      expect(decoded).toContain(DICTIONARY.en.archEngineAiTitle);
    });
  });

  describe('i18n Dictionary Parity', () => {
    it('ensures all arch* keys exist and are non-empty in both English and Hindi', () => {
      const enArchKeys = Object.keys(DICTIONARY.en).filter((k) => k.startsWith('arch')) as (keyof typeof DICTIONARY.en)[];
      const hiArchKeys = Object.keys(DICTIONARY.hi).filter((k) => k.startsWith('arch')) as (keyof typeof DICTIONARY.hi)[];

      expect(enArchKeys.length).toBeGreaterThan(0);
      expect(enArchKeys.sort()).toEqual(hiArchKeys.sort());

      for (const key of enArchKeys) {
        const enVal = DICTIONARY.en[key];
        const hiVal = DICTIONARY.hi[key];

        expect(typeof enVal).toBe('string');
        expect(enVal.trim().length).toBeGreaterThan(0);
        expect(typeof hiVal).toBe('string');
        expect(hiVal.trim().length).toBeGreaterThan(0);
      }
    });
  });
});
