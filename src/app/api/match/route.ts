import { NextRequest, NextResponse } from 'next/server';
import schemesData from '@/data/schemes.json';
import { VerifiedScheme } from '@/types/scheme';
import { MatchApiResponse, MatchedSchemeResult } from '@/types/match';
import { UserProfileInputSchema } from '@/lib/validation';
import { filterEligibleSchemes, calculateRelevanceScore } from '@/lib/matcher';
import { generateGeminiSchemeInsights } from '@/lib/gemini';
import { DICTIONARY } from '@/lib/i18n';

// Static load of authentic schemes catalog
const verifiedCatalog: VerifiedScheme[] = schemesData as unknown as VerifiedScheme[];

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const rawBody = await request.json();

    // Step 1: Input Validation & Sanitization via Zod
    const validationResult = UserProfileInputSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid profile data provided.",
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const profile = validationResult.data;

    // Step 2: Authoritative Deterministic Eligibility Pre-Filter
    // Hard constraints (age, income ceilings, occupation, student status, category) are strictly enforced.
    // Gemini does NOT override hard rules.
    const eligibleCandidates = filterEligibleSchemes(profile, verifiedCatalog);

    // Step 3: Compute Transparent Profile Relevance Scores
    const scoredCandidates = eligibleCandidates.map(scheme => ({
      scheme,
      relevanceScore: calculateRelevanceScore(profile, scheme)
    }));

    // Sort by relevance score descending
    scoredCandidates.sort((a, b) => b.relevanceScore.score - a.relevanceScore.score);

    // Step 4: AI Reasoning with Gemini 2.5 Flash (@google/genai)
    const topCandidates = scoredCandidates.map(sc => sc.scheme);
    const aiInsightsMap = await generateGeminiSchemeInsights(profile, topCandidates);

    // Step 5: Format Final Results ensuring Strict Separation of Verified Data and AI Reasoning
    const matchedSchemes: MatchedSchemeResult[] = scoredCandidates.map(({ scheme, relevanceScore }) => {
      const aiInsight = aiInsightsMap.get(scheme.id);

      return {
        scheme,
        relevanceScore,
        aiInsights: {
          whyRelevant: aiInsight?.whyRelevant || scheme.summary,
          whyRelevantHi: aiInsight?.whyRelevantHi || scheme.summaryHi,
          keyConsiderations: aiInsight?.keyConsiderations || [],
          keyConsiderationsHi: aiInsight?.keyConsiderationsHi || [],
          recommendedNextSteps: aiInsight?.recommendedNextSteps || [],
          recommendedNextStepsHi: aiInsight?.recommendedNextStepsHi || [],
          isFallbackGenerated: aiInsight?.isFallbackGenerated ?? false
        }
      };
    });

    const response: MatchApiResponse = {
      success: true,
      totalCatalogCount: verifiedCatalog.length,
      deterministicPassedCount: eligibleCandidates.length,
      matchedSchemes,
      disclaimer: {
        en: DICTIONARY.en.disclaimerText,
        hi: DICTIONARY.hi.disclaimerText
      },
      processingTimeMs: Date.now() - startTime
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // Note: No user profile PII is logged to console or logs
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred during scheme matching assessment."
      },
      { status: 500 }
    );
  }
}
