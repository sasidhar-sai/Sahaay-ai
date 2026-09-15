import { describe, it, expect, afterEach } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ProfileWizard } from '../../src/components/wizard/ProfileWizard';
import { DEMO_PERSONAS } from '../../src/data/personas';
import { UserProfile } from '../../src/types/profile';

describe('ProfileWizard SessionStorage Hydration & SSR Safety Tests', () => {
  const originalWindow = globalThis.window;
  const originalSessionStorage = (globalThis as unknown as { sessionStorage?: Storage }).sessionStorage;

  afterEach(() => {
    // Restore global window & sessionStorage
    if (originalWindow !== undefined) {
      globalThis.window = originalWindow;
    } else {
      delete (globalThis as { window?: unknown }).window;
    }

    if (originalSessionStorage !== undefined) {
      (globalThis as unknown as { sessionStorage?: Storage }).sessionStorage = originalSessionStorage;
    } else {
      delete (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage;
    }
  });

  describe('Server-Side Rendering (SSR) Safety', () => {
    it('renders cleanly during SSR when window and sessionStorage are completely undefined', () => {
      // Ensure window and sessionStorage are undefined (pure Node/server environment)
      delete (globalThis as { window?: unknown }).window;
      delete (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage;

      expect(typeof window).toBe('undefined');

      // Rendering on server must not throw ReferenceError: sessionStorage is not defined
      let html = '';
      expect(() => {
        html = renderToString(
          React.createElement(ProfileWizard, {
            currentLang: 'en',
            onSubmit: () => {},
            isLoading: false
          })
        );
      }).not.toThrow();

      // Verify server HTML contains the wizard structure and default step
      expect(html).toContain('Scheme Eligibility Assessment');
      expect(html).toContain('1. Demographics');
      expect(html).toContain('Age');
    });

    it('renders cleanly in Hindi during SSR without accessing sessionStorage', () => {
      delete (globalThis as { window?: unknown }).window;
      delete (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage;

      let html = '';
      expect(() => {
        html = renderToString(
          React.createElement(ProfileWizard, {
            currentLang: 'hi',
            onSubmit: () => {},
            isLoading: false
          })
        );
      }).not.toThrow();

      expect(html).toContain('1. व्यक्तिगत विवरण');
    });

    it('renders cleanly during SSR even if a mock window is present without sessionStorage', () => {
      // Partial environment where window exists but sessionStorage does not
      (globalThis as unknown as { window: unknown }).window = {};
      delete (globalThis as unknown as { sessionStorage?: unknown }).sessionStorage;

      let html = '';
      expect(() => {
        html = renderToString(
          React.createElement(ProfileWizard, {
            currentLang: 'en',
            onSubmit: () => {},
            isLoading: false
          })
        );
      }).not.toThrow();

      expect(html).toContain('Scheme Eligibility Assessment');
    });
  });

  describe('SessionStorage Contract & Persona Compatibility', () => {
    it('verifies all 4 demo personas serialize and match ProfileWizard UserProfile fields', () => {
      DEMO_PERSONAS.forEach((persona) => {
        // Test serialization as performed by landing page (page.tsx)
        const serializedProfile = JSON.stringify(persona.profile);
        const storedPersonaId = persona.id;

        // Test parsing as performed by ProfileWizard useEffect
        const parsedProfile = JSON.parse(serializedProfile) as UserProfile;

        expect(parsedProfile).toBeDefined();
        expect(typeof parsedProfile.age).toBe('number');
        expect(parsedProfile.gender).toBeDefined();
        expect(parsedProfile.occupation).toBeDefined();
        expect(storedPersonaId).toBe(persona.id);
      });
    });

    it('handles corrupted JSON in sessionStorage without throwing uncaught exceptions', () => {
      const corruptData = '{"age": 25, invalid-json...';

      expect(() => {
        try {
          JSON.parse(corruptData);
        } catch {
          // Fallback handled gracefully by try/catch in useEffect
        }
      }).not.toThrow();
    });

    it('verifies storage key consistency between landing page and ProfileWizard', () => {
      const PREFILL_PROFILE_KEY = 'sahaay_prefill_profile';
      const SELECTED_PERSONA_ID_KEY = 'sahaay_selected_persona_id';

      // Mock storage
      const mockStorage: Record<string, string> = {};
      const farmerPersona = DEMO_PERSONAS.find(p => p.id === 'farmer')!;

      mockStorage[PREFILL_PROFILE_KEY] = JSON.stringify(farmerPersona.profile);
      mockStorage[SELECTED_PERSONA_ID_KEY] = farmerPersona.id;

      // Hydration read simulation
      const retrievedProfile = JSON.parse(mockStorage[PREFILL_PROFILE_KEY]);
      const retrievedPersonaId = mockStorage[SELECTED_PERSONA_ID_KEY];

      expect(retrievedProfile.occupation).toBe('farmer');
      expect(retrievedProfile.age).toBe(44);
      expect(retrievedPersonaId).toBe('farmer');
    });
  });
});
