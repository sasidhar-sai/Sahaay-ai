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

  let whyRelevant = `This scheme matches your profile as a ${profile.occupation.replace(/_/g, ' ')} with an annual family income of ₹${profile.annualFamilyIncome.toLocaleString('en-IN')}.`;
  let whyRelevantHi = `यह योजना आपकी प्रोफ़ाइल (${profile.occupation.replace(/_/g, ' ')}) और ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} की वार्षिक पारिवारिक आय से मेल खाती है।`;

  if (isFarmer) {
    whyRelevant = `As an agricultural practitioner with ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} income, you are eligible to receive direct agricultural assistance and financial security under ${scheme.name}.`;
    whyRelevantHi = `एक कृषि व्यवसायी के रूप में ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} आय के साथ, आप ${scheme.nameHi} के तहत प्रत्यक्ष कृषि सहायता प्राप्त करने के पात्र हैं।`;
  } else if (isStudent) {
    whyRelevant = `As an active student in the ${profile.socialCategory.toUpperCase()} category with family income under ₹${(scheme.hardRules.maxAnnualIncome || 250000).toLocaleString('en-IN')}, ${scheme.name} can subsidize your education and academic costs.`;
    whyRelevantHi = `${profile.socialCategory.toUpperCase()} श्रेणी में नामांकित छात्र के रूप में, ${scheme.nameHi} आपके शैक्षणिक खर्चों में आर्थिक सहायता प्रदान कर सकती है।`;
  } else if (isWorker) {
    whyRelevant = `As an informal worker/vendor in ${profile.area} area, ${scheme.name} provides vital financial liquidity and welfare support for your household.`;
    whyRelevantHi = `${profile.area} क्षेत्र में एक अनौपचारिक कामगार/विक्रेता के रूप में, ${scheme.nameHi} आपके परिवार के लिए आवश्यक वित्तीय और कल्याणकारी सहायता प्रदान करती है।`;
  } else if (isSenior) {
    whyRelevant = `At age ${profile.age}, you qualify for dedicated senior citizen welfare benefits under ${scheme.name} to ensure sustained monthly income and security.`;
    whyRelevantHi = `${profile.age} वर्ष की आयु में, आप निरंतर मासिक आय और सुरक्षा सुनिश्चित करने के लिए ${scheme.nameHi} के तहत वरिष्ठ नागरिक लाभों के पात्र हैं।`;
  }

  const keyConsiderations = [
    `Mandatory documents must match Aadhaar name and date of birth exactly.`,
    `Official approval is subject to document verification by ${scheme.verifiedSource.sourceName}.`
  ];
  const keyConsiderationsHi = [
    `अनिवार्य दस्तावेजों का विवरण आधार नाम और जन्म तिथि से पूरी तरह मेल खाना चाहिए।`,
    `अंतिम अनुमोदन ${scheme.verifiedSource.sourceName} द्वारा दस्तावेज सत्यापन के अधीन है।`
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
1. "whyRelevant": A concise, encouraging, personalized explanation in English (2-3 sentences) explaining why this scheme is relevant to the user's specific socio-economic profile.
2. "whyRelevantHi": The exact same reasoning translated naturally into Hindi.
3. "keyConsiderations": 2 concrete conditions/cautions the user should verify in English (e.g. Aadhaar seeding, income certificates).
4. "keyConsiderationsHi": The key considerations in Hindi.
5. "recommendedNextSteps": 2-3 actionable, numbered next steps in English (e.g. Gather documents, visit official portal).
6. "recommendedNextStepsHi": The recommended next steps in Hindi.

STRICT INSTRUCTIONS:
- Do NOT claim legal guarantee of eligibility.
- Always frame results as "potentially relevant" or "subject to official portal verification".
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
