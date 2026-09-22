'use client';

import React from 'react';
import { MatchedSchemeResult, MatchApiResponse } from '@/types/match';
import { UserProfile } from '@/types/profile';
import { DEMO_PERSONAS, DemoPreset } from '@/data/personas';
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
  CheckCircle2,
  PhoneCall,
  SlidersHorizontal,
  RotateCcw,
  Cpu,
  GraduationCap,
  Sprout,
  Store,
  HeartPulse,
  User
} from 'lucide-react';

export const getPersonaIcon = (iconName: string) => {
  switch (iconName) {
    case 'GraduationCap': return <GraduationCap className="w-3.5 h-3.5 text-purple-600" />;
    case 'Sprout': return <Sprout className="w-3.5 h-3.5 text-emerald-600" />;
    case 'Store': return <Store className="w-3.5 h-3.5 text-amber-600" />;
    case 'HeartPulse': return <HeartPulse className="w-3.5 h-3.5 text-blue-600" />;
    default: return <Sparkles className="w-3.5 h-3.5 text-govblue-600" />;
  }
};

export const getOccupationLabel = (occ: string, lang: Language) => {
  const dict = DICTIONARY[lang];
  switch (occ) {
    case 'farmer': return dict.occFarmer;
    case 'student': return dict.occStudent;
    case 'street_vendor': return dict.occStreetVendor;
    case 'daily_wage': return dict.occDailyWage;
    case 'unemployed': return dict.occUnemployed;
    case 'homemaker': return dict.occHomemaker;
    case 'salaried': return dict.occSalaried;
    case 'self_employed': return dict.occSelfEmployed;
    case 'senior_citizen': return dict.occSeniorCitizen;
    default: return occ;
  }
};

export const getAreaLabel = (area: string, lang: Language) => {
  const dict = DICTIONARY[lang];
  switch (area) {
    case 'rural': return dict.areaRural;
    case 'urban': return dict.areaUrban;
    case 'semi_urban': return dict.areaSemiUrban;
    default: return area;
  }
};

export const getCategoryLabel = (cat: string, lang: Language) => {
  const dict = DICTIONARY[lang];
  switch (cat) {
    case 'general': return dict.catGeneral;
    case 'obc': return dict.catOBC;
    case 'sc': return dict.catSC;
    case 'st': return dict.catST;
    case 'minority': return dict.catMinority;
    default: return cat;
  }
};

// =========================================================================
// ACTIVE PROFILE BAR COMPONENT
// =========================================================================
export interface ActiveProfileBarProps {
  activeProfile: UserProfile;
  activePersonaId?: string;
  currentLang: Language;
  onEditProfile: () => void;
  onReset: () => void;
  onSelectPersona: (persona: DemoPreset) => void;
  isLoading?: boolean;
}

export const ActiveProfileBar: React.FC<ActiveProfileBarProps> = ({
  activeProfile,
  activePersonaId,
  currentLang,
  onEditProfile,
  onReset,
  onSelectPersona,
  isLoading
}) => {
  const dict = DICTIONARY[currentLang];
  const activePersona = activePersonaId
    ? DEMO_PERSONAS.find(p => p.id === activePersonaId)
    : undefined;

  return (
    <section aria-label="Active Profile Bar" className="mb-8 no-print">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all">
        {/* Profile Header Strip */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-govblue-600/30 border border-govblue-400/40 flex items-center justify-center text-govblue-300 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-govblue-300">
                  {dict.activeProfileTitle}
                </span>
                {activePersona ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-govblue-500/30 text-govblue-200 border border-govblue-400/30">
                    {dict.activePersonaLabel}: {currentLang === 'hi' ? activePersona.nameHi : activePersona.name}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {dict.customProfileLabel}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {activePersona
                  ? (currentLang === 'hi' ? activePersona.roleTitleHi : activePersona.roleTitle)
                  : `${getOccupationLabel(activeProfile.occupation, currentLang)} • ${activeProfile.state}`}
              </h3>
            </div>
          </div>

          {/* Edit & Reset Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onEditProfile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-govblue-600 hover:bg-govblue-500 rounded-xl transition-colors shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{dict.btnEditProfile}</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              title={dict.btnReset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{dict.btnReset}</span>
            </button>
          </div>
        </div>

        {/* Profile Attributes Chips Grid */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200/80">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* Occupation */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{dict.profileOccupation}</span>
              <span className="font-bold text-slate-800 truncate block mt-0.5">
                {getOccupationLabel(activeProfile.occupation, currentLang)}
              </span>
            </div>

            {/* Income */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{dict.profileIncome}</span>
              <span className="font-bold text-slate-800 block mt-0.5">
                ₹{activeProfile.annualFamilyIncome.toLocaleString('en-IN')}/yr
              </span>
            </div>

            {/* State & Area */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{dict.profileState} / {dict.profileArea}</span>
              <span className="font-bold text-slate-800 truncate block mt-0.5">
                {activeProfile.state} ({getAreaLabel(activeProfile.area, currentLang)})
              </span>
            </div>

            {/* Social Category */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{dict.profileCategory}</span>
              <span className="font-bold text-slate-800 uppercase block mt-0.5">
                {getCategoryLabel(activeProfile.socialCategory, currentLang)}
              </span>
            </div>

            {/* BPL Status */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{dict.profileBpl}</span>
              <span className="font-bold text-slate-800 block mt-0.5">
                {activeProfile.hasBPLCard ? dict.profileBplYes : dict.profileBplNo}
              </span>
            </div>

            {/* Land or Age */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {activeProfile.occupation === 'farmer' ? dict.profileLand : dict.profileAge}
              </span>
              <span className="font-bold text-slate-800 block mt-0.5">
                {activeProfile.occupation === 'farmer' && activeProfile.landHoldingAcres !== undefined
                  ? `${activeProfile.landHoldingAcres} Acres`
                  : `${activeProfile.age} Years`}
              </span>
            </div>
          </div>
        </div>

        {/* 1-Click Demo Persona Switcher Bar */}
        <div className="p-4 sm:px-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-slate-700">
              {dict.quickSwitchPersona}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
            {DEMO_PERSONAS.map((persona) => {
              const isSelected = activePersonaId === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => onSelectPersona(persona)}
                  disabled={isLoading}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-govblue-600 text-white shadow-xs ring-2 ring-govblue-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
                  } disabled:opacity-50`}
                >
                  {getPersonaIcon(persona.avatarIcon)}
                  <span>{currentLang === 'hi' ? persona.nameHi : persona.name}</span>
                  <span className="text-[10px] opacity-75 font-normal hidden sm:inline">
                    ({currentLang === 'hi' ? persona.roleTitleHi : persona.roleTitle})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// =========================================================================
// DYNAMIC TWO-ENGINE FUNNEL COMPONENT
// =========================================================================
export interface TwoEngineFunnelProps {
  matchResponse: MatchApiResponse;
  currentLang: Language;
}

export const TwoEngineFunnel: React.FC<TwoEngineFunnelProps> = ({
  matchResponse,
  currentLang
}) => {
  const dict = DICTIONARY[currentLang];

  // Dynamic funnel metrics computed from actual response
  const totalEvaluated = matchResponse.totalCatalogCount;
  const passedDeterministic = matchResponse.deterministicPassedCount;
  const excludedByRules = Math.max(0, totalEvaluated - passedDeterministic);
  const candidatesPassedToGemini = passedDeterministic;

  // Determine Gemini AI reasoning vs fallback state
  const isFallbackActive = matchResponse.matchedSchemes.length > 0
    ? matchResponse.matchedSchemes.every(s => s.aiInsights.isFallbackGenerated)
    : false;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-govblue-50 text-govblue-800 border border-govblue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-govblue-600" />
            <span>{dict.archBadge}</span>
          </span>
          <span className="text-xs text-slate-400">
            ({matchResponse.processingTimeMs}ms evaluation pipeline)
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
          {dict.funnelTitle}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {dict.funnelSubtitle}
        </p>
      </div>

      {/* Two Engines Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Engine 1: Deterministic Eligibility Engine */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-extrabold text-slate-900">
                {dict.engine1FunnelTitle}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {dict.engine1FunnelBadge}
            </span>
          </div>

          {/* Engine 1 Dynamic Counts */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">
                {dict.funnelTotalEvaluated}
              </span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                {totalEvaluated}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block truncate">
                {dict.funnelPassedRules}
              </span>
              <span className="text-xl font-black text-emerald-700 mt-1 block">
                {passedDeterministic}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">
                {dict.funnelExcludedRules}
              </span>
              <span className="text-xl font-black text-slate-600 mt-1 block">
                {excludedByRules}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            {dict.archEngineDeterministicDesc}
          </p>
        </div>

        {/* Engine 2: Generative Intelligence Engine */}
        <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-extrabold text-slate-900">
                {dict.engine2FunnelTitle}
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              {dict.engine2FunnelBadge}
            </span>
          </div>

          {/* Engine 2 Dynamic Metrics */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-xl border border-purple-200 text-center">
              <span className="text-[10px] font-bold text-purple-700 uppercase block truncate">
                {dict.funnelCandidatesReceived}
              </span>
              <span className="text-xl font-black text-purple-900 mt-1 block">
                {candidatesPassedToGemini}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-purple-200 text-center">
              <span className="text-[10px] font-bold text-purple-700 uppercase block truncate">
                {dict.funnelAiStatus}
              </span>
              <div className="mt-1 flex items-center justify-center">
                {candidatesPassedToGemini === 0 ? (
                  <span className="text-xs font-bold text-slate-500">
                    {dict.funnelStatusNone}
                  </span>
                ) : isFallbackActive ? (
                  <span className="text-xs font-bold text-amber-700">
                    {dict.funnelStatusFallback}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700">
                    {dict.funnelStatusConnected}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-purple-950/80 leading-relaxed font-medium">
            {dict.funnelAiRoleNote}
          </p>
        </div>
      </div>

      {/* Handover Notice Strip */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
        <span className="font-semibold text-slate-800">
          {dict.archCorePrinciple}:
        </span>
        <span className="text-slate-500">
          {dict.archHandoverText} ({candidatesPassedToGemini} {dict.matchedCount})
        </span>
      </div>
    </div>
  );
};

// =========================================================================
// SCHEME CARD COMPONENT
// =========================================================================
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
      {/* SECTION 1: VERIFIED OFFICIAL GOVERNMENT SOURCE & ELIGIBILITY HEADER */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          {/* Eligibility & Verified Official Source Badges */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Deterministic Eligibility Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{dict.deterministicPassedBadge}</span>
              </span>

              {/* Official Source Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-govblue-400" />
                <span>{dict.verifiedSourceBadge}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
              <span className="inline-flex items-center gap-1 font-medium">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>
                  {dict.lastVerifiedOn}: {scheme.verifiedSource.lastVerifiedDate}
                </span>
              </span>

              {scheme.verifiedSource.helplineNumber && (
                <span className="inline-flex items-center gap-1 font-medium">
                  <PhoneCall className="w-3 h-3 text-slate-500" />
                  <span>{scheme.verifiedSource.helplineNumber}</span>
                </span>
              )}
            </div>
          </div>

          {/* Relevance / Profile Alignment Score Badge (Clearly distinguished from legal eligibility) */}
          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-300 font-semibold">
                {dict.alignmentScoreLabel}:
              </span>
              <ScoreBreakdownBadge scoreResult={relevanceScore} currentLang={currentLang} />
            </div>
            <span className="text-[10px] text-slate-400 italic">
              *{dict.notLegalEligibilityNotice}
            </span>
          </div>
        </div>

        {/* Scheme Title & Ministry */}
        <div className="mt-4">
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
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>
              {aiInsights.isFallbackGenerated
                ? `${dict.aiAnalysisBadge} (Fallback Reasoner)`
                : `${dict.aiAnalysisBadge} (Gemini 2.5 Flash)`}
            </span>
          </span>
          <span className="text-[11px] text-slate-500 italic">
            {aiInsights.isFallbackGenerated
              ? '(Deterministic Fallback Reasoner - Context Only)'
              : '(Personalized to Your Profile - Non-Statutory Guidance)'}
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
          <div className="text-[11px] text-slate-500 italic text-center sm:text-left max-w-xl">
            * {dict.officialApprovalNotice}
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
