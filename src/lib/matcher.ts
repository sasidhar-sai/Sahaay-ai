import { UserProfile } from '@/types/profile';
import { VerifiedScheme } from '@/types/scheme';
import { RelevanceScoreResult, ScoreContribution } from '@/types/match';

/**
 * Evaluates whether a user profile strictly meets ALL authoritative hard constraints
 * defined for a given scheme.
 * 
 * Hard eligibility rules are completely deterministic; Gemini does NOT override these.
 */
export function checkHardEligibility(profile: UserProfile, scheme: VerifiedScheme): { isEligible: boolean; disqualificationReason?: string } {
  const rules = scheme.hardRules;

  // 1. Hard Age Constraints
  if (rules.minAge !== undefined && profile.age < rules.minAge) {
    return {
      isEligible: false,
      disqualificationReason: `Minimum age required is ${rules.minAge} (user is ${profile.age})`
    };
  }
  if (rules.maxAge !== undefined && profile.age > rules.maxAge) {
    return {
      isEligible: false,
      disqualificationReason: `Maximum age allowed is ${rules.maxAge} (user is ${profile.age})`
    };
  }

  // 2. Hard Gender Constraints
  if (rules.allowedGenders && rules.allowedGenders.length > 0) {
    if (!rules.allowedGenders.includes(profile.gender)) {
      return {
        isEligible: false,
        disqualificationReason: `Scheme is restricted to: ${rules.allowedGenders.join(', ')} (user is ${profile.gender})`
      };
    }
  }

  // 3. Hard Social Category Constraints
  if (rules.allowedCategories && rules.allowedCategories.length > 0 && !rules.allowedCategories.includes('any')) {
    if (!rules.allowedCategories.includes(profile.socialCategory)) {
      return {
        isEligible: false,
        disqualificationReason: `Scheme is restricted to categories: ${rules.allowedCategories.join(', ')} (user is ${profile.socialCategory})`
      };
    }
  }

  // 4. Hard Income Ceilings
  if (rules.maxAnnualIncome !== undefined && profile.annualFamilyIncome > rules.maxAnnualIncome) {
    return {
      isEligible: false,
      disqualificationReason: `Annual family income ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} exceeds the ceiling of ₹${rules.maxAnnualIncome.toLocaleString('en-IN')}`
    };
  }

  // 5. Hard Student Requirement
  if (rules.requiresStudent) {
    const isEnrolledStudent = profile.isStudent || profile.occupation === 'student';
    if (!isEnrolledStudent) {
      return {
        isEligible: false,
        disqualificationReason: `Requires active enrollment as a student`
      };
    }
  }

  // 6. Hard Occupation Constraints
  if (rules.allowedOccupations && rules.allowedOccupations.length > 0) {
    const occupationMatches = rules.allowedOccupations.includes(profile.occupation);
    // Also consider senior citizens who may identify by occupation or age
    const isSeniorMatch = rules.allowedOccupations.includes('senior_citizen') && profile.age >= 60;
    
    if (!occupationMatches && !isSeniorMatch) {
      return {
        isEligible: false,
        disqualificationReason: `Restricted to occupations: ${rules.allowedOccupations.join(', ')} (user is ${profile.occupation})`
      };
    }
  }

  // 7. Hard BPL / Poverty Line Requirement
  if (rules.requiresBPL) {
    const isLowIncome = profile.annualFamilyIncome <= 100000;
    if (!profile.hasBPLCard && !isLowIncome) {
      return {
        isEligible: false,
        disqualificationReason: `Requires Below Poverty Line (BPL) status or annual income under ₹1,00,000`
      };
    }
  }

  // 8. Hard Landholding Limit (for agricultural schemes)
  if (rules.maxLandHoldingAcres !== undefined && profile.landHoldingAcres !== undefined) {
    if (profile.landHoldingAcres > rules.maxLandHoldingAcres) {
      return {
        isEligible: false,
        disqualificationReason: `Land holding ${profile.landHoldingAcres} acres exceeds maximum ${rules.maxLandHoldingAcres} acres`
      };
    }
  }

  // 9. Hard State Constraints (if not 'All India')
  if (rules.allowedStates && rules.allowedStates.length > 0 && !rules.allowedStates.includes('All India')) {
    if (!rules.allowedStates.includes(profile.state)) {
      return {
        isEligible: false,
        disqualificationReason: `Scheme is restricted to states: ${rules.allowedStates.join(', ')}`
      };
    }
  }

  return { isEligible: true };
}

/**
 * Filter an entire scheme catalog by authoritative hard rules.
 */
export function filterEligibleSchemes(profile: UserProfile, catalog: VerifiedScheme[]): VerifiedScheme[] {
  return catalog.filter(scheme => checkHardEligibility(profile, scheme).isEligible);
}

/**
 * Calculates a transparent, deterministic profile-relevance score (0 - 100)
 * with an itemized point breakdown.
 * 
 * NOTE: This is NOT a legal probability of approval. It measures profile alignment.
 */
export function calculateRelevanceScore(profile: UserProfile, scheme: VerifiedScheme): RelevanceScoreResult {
  const contributions: ScoreContribution[] = [];
  let totalScore = 0;

  // 1. Occupation & Persona Target Match (up to 35 points)
  const isPrimaryOccupationMatch = scheme.hardRules.allowedOccupations?.includes(profile.occupation);
  const isTargetPersonaMatch = scheme.targetPersonas.some(tp => {
    if (tp === 'farmer' && profile.occupation === 'farmer') return true;
    if (tp === 'student' && (profile.isStudent || profile.occupation === 'student')) return true;
    if (tp === 'informal_worker' && ['street_vendor', 'daily_wage_worker', 'self_employed', 'unemployed'].includes(profile.occupation)) return true;
    if (tp === 'senior_citizen' && (profile.age >= 60 || profile.occupation === 'senior_citizen')) return true;
    return false;
  });

  if (isPrimaryOccupationMatch || isTargetPersonaMatch) {
    const pts = 35;
    totalScore += pts;
    contributions.push({
      factor: "Primary Target Persona Alignment",
      factorHi: "लक्षित लाभार्थी वर्ग मिलान",
      points: pts,
      description: `Direct match for target group: ${scheme.targetPersonas.join(', ')} (${profile.occupation})`,
      descriptionHi: `लक्षित वर्ग से सीधा मिलान: ${scheme.targetPersonas.join(', ')} (${profile.occupation})`
    });
  } else {
    const pts = 10;
    totalScore += pts;
    contributions.push({
      factor: "General Population Eligibility",
      factorHi: "सामान्य नागरिक पात्रता",
      points: pts,
      description: "Scheme is accessible to broad demographic groups",
      descriptionHi: "यह योजना व्यापक नागरिक समूहों के लिए सुलभ है"
    });
  }

  // 2. Income Bracket Match (up to 25 points)
  if (scheme.hardRules.maxAnnualIncome) {
    const ceiling = scheme.hardRules.maxAnnualIncome;
    const ratio = profile.annualFamilyIncome / ceiling;
    let pts = 15;
    if (ratio <= 0.5) pts = 25; // Well within income limits
    else if (ratio <= 0.8) pts = 20;

    totalScore += pts;
    contributions.push({
      factor: "Income Ceiling Alignment",
      factorHi: "आय सीमा मिलान",
      points: pts,
      description: `Income ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} is within ₹${ceiling.toLocaleString('en-IN')} threshold`,
      descriptionHi: `आय ₹${profile.annualFamilyIncome.toLocaleString('en-IN')}, अधिकतम सीमा ₹${ceiling.toLocaleString('en-IN')} के भीतर है`
    });
  } else {
    const pts = 20;
    totalScore += pts;
    contributions.push({
      factor: "Universal Income Eligibility",
      factorHi: "सार्वभौमिक आय पात्रता",
      points: pts,
      description: "No restrictive income ceiling specified",
      descriptionHi: "कोई प्रतिबंधात्मक आय सीमा निर्धारित नहीं है"
    });
  }

  // 3. Stated Need & Benefit Category Synergy (up to 20 points)
  const needs = profile.specificNeeds || [];
  let matchedNeedCount = 0;

  if (scheme.category === 'agriculture' && needs.some(n => n.includes('crop') || n.includes('credit') || n.includes('agricult'))) {
    matchedNeedCount++;
  }
  if (scheme.category === 'education' && needs.some(n => n.includes('education') || n.includes('fee') || n.includes('scholarship'))) {
    matchedNeedCount++;
  }
  if (scheme.category === 'healthcare' && needs.some(n => n.includes('health') || n.includes('medical') || n.includes('hospital'))) {
    matchedNeedCount++;
  }
  if (scheme.category === 'social_security' && needs.some(n => n.includes('pension') || n.includes('security') || n.includes('insurance'))) {
    matchedNeedCount++;
  }
  if (scheme.category === 'livelihood' && needs.some(n => n.includes('business') || n.includes('loan') || n.includes('vendor'))) {
    matchedNeedCount++;
  }
  if (scheme.category === 'housing' && needs.some(n => n.includes('house') || n.includes('shelter') || n.includes('housing'))) {
    matchedNeedCount++;
  }

  if (matchedNeedCount > 0) {
    const pts = 20;
    totalScore += pts;
    contributions.push({
      factor: "Expressed Welfare Needs Match",
      factorHi: "व्यक्त कल्याणकारी जरूरतों का मिलान",
      points: pts,
      description: `Directly solves your requested priorities in ${scheme.category}`,
      descriptionHi: `${scheme.category} क्षेत्र में आपकी प्राथमिकताओं का सीधा समाधान करता है`
    });
  } else if (needs.length === 0) {
    const pts = 10;
    totalScore += pts;
    contributions.push({
      factor: "Category Relevance",
      factorHi: "श्रेणी प्रासंगिकता",
      points: pts,
      description: `General benefit aligned with ${scheme.category}`,
      descriptionHi: `${scheme.category} से संबंधित सामान्य लाभ`
    });
  }

  // 4. Age & Vulnerability Status Bonus (up to 20 points)
  let ageAndVulnerabilityPts = 0;
  if (profile.hasBPLCard && (scheme.hardRules.requiresBPL || scheme.category === 'healthcare' || scheme.category === 'housing')) {
    const pts = 10;
    ageAndVulnerabilityPts += pts;
    contributions.push({
      factor: "BPL Priority Alignment",
      factorHi: "बीपीएल प्राथमिकता संरेखण",
      points: pts,
      description: "BPL card holders receive priority allocation",
      descriptionHi: "बीपीएल कार्ड धारकों को प्राथमिकता आवंटन प्राप्त होता है"
    });
  } else if (profile.isDifferentlyAbled) {
    const pts = 5;
    ageAndVulnerabilityPts += pts;
    contributions.push({
      factor: "Differently-Abled Inclusivity",
      factorHi: "दिव्यांग समावेशन",
      points: pts,
      description: "Dedicated accommodations available under public welfare norms",
      descriptionHi: "कल्याणकारी मानकों के तहत विशेष सुविधाएं उपलब्ध"
    });
  }

  totalScore = Math.min(100, totalScore + ageAndVulnerabilityPts);

  // Determine score tier label
  let label: 'High Match' | 'Moderate Match' | 'Potential Match' = 'High Match';
  let labelHi: 'उच्च मिलान' | 'मध्यम मिलान' | 'संभावित मिलान' = 'उच्च मिलान';

  if (totalScore < 60) {
    label = 'Potential Match';
    labelHi = 'संभावित मिलान';
  } else if (totalScore < 80) {
    label = 'Moderate Match';
    labelHi = 'मध्यम मिलान';
  }

  return {
    score: totalScore,
    label,
    labelHi,
    contributions
  };
}
