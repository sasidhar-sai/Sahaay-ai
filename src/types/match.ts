import { VerifiedScheme } from './scheme';

export interface ScoreContribution {
  factor: string;
  factorHi: string;
  points: number;
  description: string;
  descriptionHi: string;
}

export interface RelevanceScoreResult {
  score: number; // 0 to 100
  label: 'High Match' | 'Moderate Match' | 'Potential Match';
  labelHi: 'उच्च मिलान' | 'मध्यम मिलान' | 'संभावित मिलान';
  contributions: ScoreContribution[];
}

export interface MatchedDocumentItem {
  name: string;
  nameHi: string;
  isMandatory: boolean;
  helpTip: string;
  helpTipHi: string;
  obtainedOrRequiredNote?: string;
}

export interface MatchedSchemeResult {
  scheme: VerifiedScheme;
  relevanceScore: RelevanceScoreResult;
  // AI-generated contextual insights (strictly separated from verified scheme data)
  aiInsights: {
    whyRelevant: string;
    whyRelevantHi: string;
    keyConsiderations: string[];
    keyConsiderationsHi: string[];
    recommendedNextSteps: string[];
    recommendedNextStepsHi: string[];
    isFallbackGenerated: boolean;
  };
}

export interface MatchApiResponse {
  success: boolean;
  totalCatalogCount: number;
  deterministicPassedCount: number;
  matchedSchemes: MatchedSchemeResult[];
  disclaimer: {
    en: string;
    hi: string;
  };
  processingTimeMs: number;
}
