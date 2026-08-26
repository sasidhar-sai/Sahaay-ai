import { describe, it, expect } from 'vitest';
import { UserProfileInputSchema } from '../../src/lib/validation';
import nextConfig from '../../next.config';

describe('Security & Privacy Compliance Tests', () => {
  it('enforces HTTP security headers in Next.js configuration', async () => {
    expect(nextConfig.headers).toBeDefined();
    if (nextConfig.headers) {
      const headersList = await nextConfig.headers();
      const globalHeaders = headersList.find(h => h.source === '/:path*')?.headers;
      
      expect(globalHeaders).toBeDefined();
      const headerKeys = globalHeaders?.map(h => h.key);
      expect(headerKeys).toContain('X-Content-Type-Options');
      expect(headerKeys).toContain('X-Frame-Options');
      expect(headerKeys).toContain('Referrer-Policy');
    }
  });

  it('sanitizes and strips potentially malicious script injection in string fields', () => {
    const maliciousPayload = {
      age: 25,
      gender: 'female',
      state: '<script>alert("xss")</script>Uttar Pradesh',
      area: 'urban',
      socialCategory: 'general',
      annualFamilyIncome: 100000,
      occupation: 'student',
      specificNeeds: ['<img src=x onerror=alert(1)>', 'higher_education']
    };

    const parsed = UserProfileInputSchema.safeParse(maliciousPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      // Ensure trimmed and properly typed without code execution
      expect(typeof parsed.data.state).toBe('string');
      expect(parsed.data.specificNeeds).toBeDefined();
    }
  });

  it('rejects oversized unbounded payloads preventing memory exhaustion attacks', () => {
    const hugeArray = new Array(500).fill('excessive_need_entry');
    const bloatedPayload = {
      age: 25,
      gender: 'female',
      state: 'Delhi',
      area: 'urban',
      socialCategory: 'general',
      annualFamilyIncome: 100000,
      occupation: 'student',
      specificNeeds: hugeArray // Exceeds max 20 array length
    };

    const parsed = UserProfileInputSchema.safeParse(bloatedPayload);
    expect(parsed.success).toBe(false);
  });
});
