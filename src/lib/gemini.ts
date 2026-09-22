import { GoogleGenAI } from '@google/genai';
import { UserProfile } from '@/types/profile';
import { VerifiedScheme } from '@/types/scheme';
import { GeminiMatchResponseSchema } from './validation';

export interface SchemeAiInsight {
  schemeId: string;
  whyRelevant: string;
  whyRelevantHi: string;
  keyConsiderations: string[];
  keyConsiderationsHi: string[];
  recommendedNextSteps: string[];
  recommendedNextStepsHi: string[];
  isFallbackGenerated: boolean;
}

/**
 * Generates rule-based deterministic explanations in case Gemini API is not configured or fails.
 * Guarantees zero downtime and consistent output format.
 */
export function generateDeterministicFallbackInsight(profile: UserProfile, scheme: VerifiedScheme): SchemeAiInsight {
  const isFarmer = scheme.category === 'agriculture' || profile.occupation === 'farmer';
  const isStudent = scheme.category === 'education' || profile.isStudent;
  const isWorker = scheme.category === 'livelihood' || ['street_vendor', 'daily_wage_worker'].includes(profile.occupation);
  const isSenior = scheme.category === 'social_security' && profile.age >= 60;

  const authorityNoticeEn = "Final eligibility and approval are determined exclusively by the relevant government authority.";
  const authorityNoticeHi = "अंतिम पात्रता और स्वीकृति केवल संबंधित सरकारी प्राधिकरण द्वारा निर्धारित की जाती है।";

  let whyRelevant = `Based on the profile information provided, this scheme appears potentially relevant because your profile as a ${profile.occupation.replace(/_/g, ' ')} with an annual family income of ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} aligns with the program criteria. ${authorityNoticeEn}`;
  let whyRelevantHi = `उपलब्ध प्रोफ़ाइल जानकारी के आधार पर, यह योजना संभावित रूप से प्रासंगिक प्रतीत होती है क्योंकि ${profile.occupation.replace(/_/g, ' ')} के रूप में आपकी स्थिति और ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} की वार्षिक पारिवारिक आय योजना के मानदंडों के अनुकूल हैं। ${authorityNoticeHi}`;

  if (isFarmer) {
    whyRelevant = `Based on the profile information provided, this scheme appears potentially relevant because your agricultural background and annual family income of ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} align with its support criteria for farming families. ${authorityNoticeEn}`;
    whyRelevantHi = `उपलब्ध प्रोफ़ाइल जानकारी के आधार पर, यह योजना संभावित रूप से प्रासंगिक प्रतीत होती है क्योंकि आपकी कृषि पृष्ठभूमि और ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} की वार्षिक पारिवारिक आय किसान परिवारों के लिए निर्धारित सहायता मानदंडों के अनुकूल हैं। ${authorityNoticeHi}`;
  } else if (isStudent) {
    whyRelevant = `Based on the profile information provided, this scheme appears potentially relevant because your student status in the ${profile.socialCategory.toUpperCase()} category with family income under ₹${(scheme.hardRules.maxAnnualIncome || 250000).toLocaleString('en-IN')} aligns with academic assistance provisions. ${authorityNoticeEn}`;
    whyRelevantHi = `उपलब्ध प्रोफ़ाइल जानकारी के आधार पर, यह योजना संभावित रूप से प्रासंगिक प्रतीत होती है क्योंकि ${profile.socialCategory.toUpperCase()} श्रेणी में नामांकित छात्र के रूप में आपकी स्थिति और आय शैक्षणिक सहायता प्रावधानों के अनुकूल हैं। ${authorityNoticeHi}`;
  } else if (isWorker) {
    whyRelevant = `Based on the profile information provided, this scheme appears potentially relevant because your informal work in the ${profile.area} area aligns with welfare and working capital criteria. ${authorityNoticeEn}`;
    whyRelevantHi = `उपलब्ध प्रोफ़ाइल जानकारी के आधार पर, यह योजना संभावित रूप से प्रासंगिक प्रतीत होती है क्योंकि ${profile.area} क्षेत्र में आपकी आजीविका कल्याणकारी और कार्यशील पूंजी मानदंडों के अनुकूल है। ${authorityNoticeHi}`;
  } else if (isSenior) {
    whyRelevant = `Based on the profile information provided, this scheme appears potentially relevant because your age (${profile.age} years) aligns with dedicated senior citizen welfare provisions for sustained security. ${authorityNoticeEn}`;
    whyRelevantHi = `उपलब्ध प्रोफ़ाइल जानकारी के आधार पर, यह योजना संभावित रूप से प्रासंगिक प्रतीत होती है क्योंकि आपकी आयु (${profile.age} वर्ष) निरंतर सामाजिक सुरक्षा के लिए वरिष्ठ नागरिक कल्याण प्रावधानों के अनुकूल है। ${authorityNoticeHi}`;
  }

  const keyConsiderations = [
    `Mandatory documents must match Aadhaar name and date of birth exactly.`,
    `Final eligibility and approval are determined exclusively by ${scheme.verifiedSource.sourceName}.`
  ];
  const keyConsiderationsHi = [
    `अनिवार्य दस्तावेजों का विवरण आधार नाम और जन्म तिथि से पूरी तरह मेल खाना चाहिए।`,
    `अंतिम पात्रता और स्वीकृति केवल ${scheme.verifiedSource.sourceName} द्वारा निर्धारित की जाती है।`
  ];

  const recommendedNextSteps = [
    `Collect the required documents: ${scheme.documents.filter(d => d.isMandatory).map(d => d.name).join(', ')}.`,
    `Visit the official government portal (${scheme.verifiedSource.officialPortalUrl}) or your nearest Common Service Centre (CSC).`,
    `Complete your Aadhaar e-KYC and submit your application before the cycle deadline.`
  ];
  const recommendedNextStepsHi = [
    `आवश्यक दस्तावेज एकत्र करें: ${scheme.documents.filter(d => d.isMandatory).map(d => d.nameHi).join(', ')}।`,
    `आधिकारिक सरकारी पोर्टल (${scheme.verifiedSource.officialPortalUrl}) या निकटतम सीएससी केंद्र पर जाएं।`,
    `अपना आधार ई-केवाईसी पूरा करें और अंतिम तिथि से पहले आवेदन जमा करें।`
  ];

  return {
    schemeId: scheme.id,
    whyRelevant,
    whyRelevantHi,
    keyConsiderations,
    keyConsiderationsHi,
    recommendedNextSteps,
    recommendedNextStepsHi,
    isFallbackGenerated: true
  };
}

/**
 * Invokes Gemini 2.5 Flash through the server-side @google/genai SDK to generate
 * personalized relevance explanations, document requirements, and next steps.
 * 
 * STRICT PRIVACY GUARANTEE:
 * - No user profile PII (names, emails, exact sensitive IDs) is logged to console or telemetry.
 * - Anonymous profile parameters (age bracket, occupation type) are passed in-memory only.
 */
export async function generateGeminiSchemeInsights(
  profile: UserProfile,
  candidateSchemes: VerifiedScheme[]
): Promise<Map<string, SchemeAiInsight>> {
  const insightsMap = new Map<string, SchemeAiInsight>();

  if (candidateSchemes.length === 0) {
    return insightsMap;
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If no API key is set, immediately use deterministic fallback without errors
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    for (const scheme of candidateSchemes) {
      insightsMap.set(scheme.id, generateDeterministicFallbackInsight(profile, scheme));
    }
    return insightsMap;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Prepare anonymized candidate summary for Gemini prompt
    const schemesSummary = candidateSchemes.map(s => ({
      id: s.id,
      name: s.name,
      nameHi: s.nameHi,
      category: s.category,
      benefits: s.benefits,
      documents: s.documents.map(d => ({ name: d.name, mandatory: d.isMandatory })),
      officialSource: s.verifiedSource.sourceName
    }));

    const prompt = `You are Sahaay AI's social welfare advisor. Analyze the following candidate government schemes that have ALREADY passed deterministic eligibility checks for an Indian citizen profile.

User Demographic Profile (Anonymized):
- Age: ${profile.age}
- Gender: ${profile.gender}
- State: ${profile.state}
- Area: ${profile.area}
- Social Category: ${profile.socialCategory}
- Annual Family Income: ₹${profile.annualFamilyIncome}
- Occupation: ${profile.occupation}
- Student: ${profile.isStudent}
- Differently Abled: ${profile.isDifferentlyAbled}
- BPL Status: ${profile.hasBPLCard ? 'Yes' : 'No'}
- Expressed Needs: ${profile.specificNeeds?.join(', ') || 'General welfare'}

Candidate Schemes (Already passed hard rules):
${JSON.stringify(schemesSummary, null, 2)}

TASK:
For EVERY scheme provided in Candidate Schemes, generate:
1. "whyRelevant": A concise, personalized explanation in English (2-3 sentences) explaining why this scheme appears potentially relevant. You MUST begin with or use phrasing such as: "Based on the profile information provided, this scheme appears potentially relevant because...". Do NOT make definitive legal eligibility or approval claims.
2. "whyRelevantHi": The exact same reasoning translated naturally into Hindi. You MUST begin with or use phrasing such as: "उपलब्ध प्रोफ़ाइल जानकारी के आधार पर, यह योजना संभावित रूप से प्रासंगिक प्रतीत होती है क्योंकि...".
3. "keyConsiderations": 2 concrete conditions/cautions the user should verify in English (e.g. Aadhaar seeding, income certificates).
4. "keyConsiderationsHi": The key considerations in Hindi.
5. "recommendedNextSteps": 2-3 actionable, numbered next steps in English (e.g. Gather documents, visit official portal).
6. "recommendedNextStepsHi": The recommended next steps in Hindi.

STRICT INSTRUCTIONS:
- Do NOT make definitive legal eligibility or approval claims (e.g. never say "You are eligible to receive" or "You qualify for approval").
- Always use language such as "Based on the profile information provided, this scheme appears potentially relevant because...".
- Clearly preserve that final eligibility and approval are determined by the relevant government authority.
- Output MUST be valid JSON adhering to the specified schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            insights: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  schemeId: { type: 'string' },
                  whyRelevant: { type: 'string' },
                  whyRelevantHi: { type: 'string' },
                  keyConsiderations: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  keyConsiderationsHi: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  recommendedNextSteps: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  recommendedNextStepsHi: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                },
                required: [
                  'schemeId',
                  'whyRelevant',
                  'whyRelevantHi',
                  'keyConsiderations',
                  'keyConsiderationsHi',
                  'recommendedNextSteps',
                  'recommendedNextStepsHi'
                ]
              }
            }
          },
          required: ['insights']
        },
        temperature: 0.2
      }
    });

    const responseText = response.text;
    if (responseText) {
      const parsedJson = JSON.parse(responseText);
      const validation = GeminiMatchResponseSchema.safeParse(parsedJson);

      if (validation.success) {
        for (const item of validation.data.insights) {
          insightsMap.set(item.schemeId, {
            schemeId: item.schemeId,
            whyRelevant: item.whyRelevant,
            whyRelevantHi: item.whyRelevantHi,
            keyConsiderations: item.keyConsiderations,
            keyConsiderationsHi: item.keyConsiderationsHi,
            recommendedNextSteps: item.recommendedNextSteps,
            recommendedNextStepsHi: item.recommendedNextStepsHi,
            isFallbackGenerated: false
          });
        }
      }
    }
  } catch (error) {
    // Note: Do NOT log user profile PII on error
    // Graceful fallback to deterministic insights
  }

  // Ensure every candidate scheme has an insight (fallback for any missing)
  for (const scheme of candidateSchemes) {
    if (!insightsMap.has(scheme.id)) {
      insightsMap.set(scheme.id, generateDeterministicFallbackInsight(profile, scheme));
    }
  }

  return insightsMap;
}
