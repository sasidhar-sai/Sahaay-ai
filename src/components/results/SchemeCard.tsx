'use client';

import React from 'react';
import { MatchedSchemeResult } from '@/types/match';
import { Language, DICTIONARY } from '@/lib/i18n';
import { ScoreBreakdownBadge } from './ScoreBreakdownBadge';
import { DocumentChecklist } from './DocumentChecklist';
import { AudioReader } from '@/components/common/AudioReader';
import {
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Landmark,
  CheckCircle,
  PhoneCall
} from 'lucide-react';

interface SchemeCardProps {
  matchedItem: MatchedSchemeResult;
  currentLang: Language;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ matchedItem, currentLang }) => {
  const dict = DICTIONARY[currentLang];
  const { scheme, relevanceScore, aiInsights } = matchedItem;

  const schemeTitle = currentLang === 'hi' ? scheme.nameHi : scheme.name;
  const schemeSummary = currentLang === 'hi' ? scheme.summaryHi : scheme.summary;
  const whyRelevantText = currentLang === 'hi' ? aiInsights.whyRelevantHi : aiInsights.whyRelevant;
  const considerations = currentLang === 'hi' ? aiInsights.keyConsiderationsHi : aiInsights.keyConsiderations;
  const nextSteps = currentLang === 'hi' ? aiInsights.recommendedNextStepsHi : aiInsights.recommendedNextSteps;
  const benefits = currentLang === 'hi' ? scheme.benefitsHi : scheme.benefits;

  const fullTextForSpeech = `${schemeTitle}. ${schemeSummary}. Why potentially relevant: ${whyRelevantText}. Key benefits include: ${benefits.join(
    '. '
  )}`;

  return (
    <article className="scheme-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* SECTION 1: VERIFIED OFFICIAL GOVERNMENT SOURCE HEADER */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Verified Official Source Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{dict.verifiedSourceBadge}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>
                {dict.lastVerifiedOn}: {scheme.verifiedSource.lastVerifiedDate}
              </span>
            </span>

            {scheme.verifiedSource.helplineNumber && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                <PhoneCall className="w-3 h-3 text-slate-500" />
                <span>{scheme.verifiedSource.helplineNumber}</span>
              </span>
            )}
          </div>

          {/* Relevance Score Badge */}
          <div>
            <ScoreBreakdownBadge scoreResult={relevanceScore} currentLang={currentLang} />
          </div>
        </div>

        {/* Scheme Title & Ministry */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5 text-xs text-govblue-300 font-semibold mb-1">
            <Landmark className="w-3.5 h-3.5 text-govblue-400" />
            <span>{scheme.verifiedSource.sourceName}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
            {schemeTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {schemeSummary}
          </p>
        </div>

        {/* Action strip inside header: Audio Readout & Official Portal Link */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <AudioReader textToRead={fullTextForSpeech} lang={currentLang} label={schemeTitle} />

          <a
            href={scheme.verifiedSource.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-govblue-600 hover:bg-govblue-500 px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <span>{dict.viewOfficialPortal}</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/80" />
          </a>
        </div>
      </div>

      {/* SECTION 2: AI-POWERED CONTEXTUAL RELEVANCE INSIGHTS */}
      <div className="bg-purple-50/50 p-5 border-b border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>{dict.aiAnalysisBadge} (Gemini 2.5 Flash)</span>
          </span>
          <span className="text-[11px] text-slate-500 italic">
            {aiInsights.isFallbackGenerated
              ? '(Deterministic Fallback Reasoner)'
              : '(Personalized to Your Profile)'}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              {dict.whyRelevantTitle}:
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-white/80 p-3 rounded-xl border border-purple-200/70">
              {whyRelevantText}
            </p>
          </div>

          {considerations.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs space-y-1">
              <h5 className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{dict.keyCaveatsTitle}:</span>
              </h5>
              <ul className="list-disc list-inside space-y-0.5 text-amber-950 pl-1 text-[11px]">
                {considerations.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: KEY VERIFIED BENEFITS & ELIGIBILITY DETAILS */}
      <div className="p-5 space-y-6">
        {/* Verified Benefits */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{dict.keyBenefitsTitle}</span>
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {benefits.map((benefit, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Interactive Required Documents Checklist */}
        <div>
          <DocumentChecklist
            documents={scheme.documents}
            currentLang={currentLang}
            schemeId={scheme.id}
          />
        </div>

        {/* Recommended Actionable Next Steps */}
        {nextSteps.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              {dict.nextStepsTitle}:
            </h4>
            <ol className="space-y-2 text-xs text-slate-700">
              {nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-govblue-100 text-govblue-800 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Bottom CTA & Direct Portal Link */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-[11px] text-slate-500 italic text-center sm:text-left">
            * {currentLang === 'hi' ? 'आवेदन करने से पूर्व आधिकारिक पोर्टल पर पुष्टि करें' : 'Verify final criteria and active cycle on official portal'}
          </div>

          <a
            href={scheme.verifiedSource.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-govblue-600 hover:bg-govblue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
          >
            <span>{dict.applyCTA}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
