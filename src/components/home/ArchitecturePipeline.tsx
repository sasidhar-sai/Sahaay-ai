'use client';

import React from 'react';
import { Language, DICTIONARY } from '@/lib/i18n';
import {
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Filter,
  Layers,
  Cpu,
  Languages,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  Scale
} from 'lucide-react';

interface ArchitecturePipelineProps {
  currentLang: Language;
}

export const ArchitecturePipeline: React.FC<ArchitecturePipelineProps> = ({ currentLang }) => {
  const dict = DICTIONARY[currentLang];

  return (
    <section
      role="region"
      aria-label={dict.archTitle}
      className="space-y-6"
    >
      {/* 1. TOP HERO: THE CORE PRINCIPLE BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-govblue-50/80 via-white to-purple-50/80 rounded-3xl border border-slate-200/90 p-6 sm:p-8 md:p-10 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-govblue-800 border border-govblue-200 shadow-2xs">
            <Scale className="w-3.5 h-3.5 text-govblue-600" />
            <span>{dict.archCorePrincipleTitle}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Google Gemini 2.5 Flash</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deterministic Engine</span>
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-snug">
          &ldquo;{dict.archCorePrinciple}&rdquo;
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          {dict.archCorePrincipleDesc}
        </p>
      </div>

      {/* 2. THE TWO-ENGINE PIPELINE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* ========================================================= */}
        {/* ENGINE 1: DETERMINISTIC ELIGIBILITY ENGINE                */}
        {/* ========================================================= */}
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/25 p-6 sm:p-8 flex flex-col justify-between shadow-xs relative">
          <div>
            {/* Engine 1 Header */}
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {dict.archEngineDeterministicTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {dict.archEngineDeterministicDesc}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {dict.archEngineDeterministicBadge}
              </span>
            </div>

            {/* Stages 1, 2, 3 */}
            <div className="mt-6 space-y-3">
              {/* STAGE 1 */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs transition-all hover:border-emerald-300">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-govblue-50 text-govblue-700 border border-govblue-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-govblue-600 shrink-0" />
                        <span>{dict.archStage1Title}</span>
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                        {dict.archStage1Subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                      {dict.archStage1Desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center py-0.5">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100/70 text-emerald-700">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* STAGE 2 */}
              <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-2xs ring-1 ring-emerald-100 transition-all hover:border-emerald-400">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{dict.archStage2Title}</span>
                      </h5>
                      <span className="text-[10px] font-semibold text-emerald-600 shrink-0">
                        {dict.archStage2Subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                      {dict.archStage2Desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center py-0.5">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100/70 text-emerald-700">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* STAGE 3 */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs transition-all hover:border-emerald-300">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{dict.archStage3Title}</span>
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                        {dict.archStage3Subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                      {dict.archStage3Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Handover Pill for Desktop */}
          <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between gap-2 text-[11px] text-emerald-900 font-semibold bg-emerald-100/40 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{dict.archHandoverText}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-emerald-600 shrink-0 lg:hidden" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* ENGINE 2: CONTEXTUAL INTELLIGENCE ENGINE (GEMINI AI)      */}
        {/* ========================================================= */}
        <div className="rounded-3xl border border-purple-200 bg-purple-50/25 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            {/* Engine 2 Header */}
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 border border-purple-200">
                  <Sparkles className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {dict.archEngineAiTitle}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {dict.archEngineAiDesc}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                {dict.archEngineAiBadge}
              </span>
            </div>

            {/* Stages 4, 5, 6 */}
            <div className="mt-6 space-y-3">
              {/* STAGE 4 */}
              <div className="bg-white rounded-2xl border border-purple-200 p-4 shadow-2xs ring-1 ring-purple-100 transition-all hover:border-purple-400">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    4
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{dict.archStage4Title}</span>
                      </h5>
                      <span className="text-[10px] font-semibold text-purple-600 shrink-0">
                        {dict.archStage4Subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                      {dict.archStage4Desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center py-0.5">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100/70 text-purple-700">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* STAGE 5 */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs transition-all hover:border-purple-300">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    5
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>{dict.archStage5Title}</span>
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                        {dict.archStage5Subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                      {dict.archStage5Desc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-center py-0.5">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100/70 text-purple-700">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* STAGE 6 */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs transition-all hover:border-purple-300">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-govblue-50 text-govblue-800 border border-govblue-200 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    6
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{dict.archStage6Title}</span>
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                        {dict.archStage6Subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                      {dict.archStage6Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Output Pill */}
          <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between gap-2 text-[11px] text-purple-900 font-semibold bg-purple-100/40 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>{dict.archStage6Subtitle}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-purple-700 bg-white px-2 py-0.5 rounded-md border border-purple-200">
              Official Portals
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
