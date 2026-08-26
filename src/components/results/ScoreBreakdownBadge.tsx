'use client';

import React, { useState } from 'react';
import { RelevanceScoreResult } from '@/types/match';
import { Language } from '@/lib/i18n';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScoreBreakdownBadgeProps {
  scoreResult: RelevanceScoreResult;
  currentLang: Language;
}

export const ScoreBreakdownBadge: React.FC<ScoreBreakdownBadgeProps> = ({
  scoreResult,
  currentLang
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Score color styles
  const getBadgeStyle = (score: number) => {
    if (score >= 80) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100';
    } else if (score >= 60) {
      return 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100';
    } else {
      return 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs ${getBadgeStyle(
          scoreResult.score
        )}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="Click to view transparent score point breakdown"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-current"></span>
          <span>{scoreResult.score}%</span>
          <span className="font-medium text-[11px] opacity-90">
            ({currentLang === 'hi' ? scoreResult.labelHi : scoreResult.label})
          </span>
        </span>
        <HelpCircle className="w-3.5 h-3.5 opacity-70" />
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Breakdown Popover */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-govblue-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  {currentLang === 'hi' ? 'पारदर्शी प्रोफ़ाइल मिलान स्कोर' : 'Transparent Profile Match Score'}
                </h4>
              </div>
              <span className="text-xs font-extrabold text-govblue-700 bg-govblue-50 px-2 py-0.5 rounded-md border border-govblue-200">
                {scoreResult.score} / 100
              </span>
            </div>

            {/* Disclaimer on score */}
            <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>
                {currentLang === 'hi'
                  ? 'यह स्कोर प्रोफ़ाइल विशेषताओं के मिलान को दर्शाता है। यह सरकारी पात्रता की कानूनी गारंटी नहीं है।'
                  : 'This score measures profile attribute alignment only. It is not a legal probability or guarantee of government approval.'}
              </span>
            </div>

            {/* Breakdown item list */}
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
              {scoreResult.contributions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50/70 border border-slate-100 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{currentLang === 'hi' ? item.factorHi : item.factor}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {currentLang === 'hi' ? item.descriptionHi : item.description}
                    </p>
                  </div>
                  <span className="font-bold text-emerald-700 text-xs shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    +{item.points}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-govblue-600 hover:text-govblue-800 px-2 py-1"
              >
                {currentLang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
