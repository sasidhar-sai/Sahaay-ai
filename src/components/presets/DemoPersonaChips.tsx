'use client';

import React from 'react';
import { DEMO_PERSONAS, DemoPreset } from '@/data/personas';
import { UserProfile } from '@/types/profile';
import { Language } from '@/lib/i18n';
import { GraduationCap, Sprout, Store, HeartPulse, Sparkles } from 'lucide-react';

interface DemoPersonaChipsProps {
  currentLang: Language;
  onSelectPersona: (profile: UserProfile, persona: DemoPreset) => void;
  selectedPersonaId?: string;
}

export const DemoPersonaChips: React.FC<DemoPersonaChipsProps> = ({
  currentLang,
  onSelectPersona,
  selectedPersonaId
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'Sprout':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'Store':
        return <Store className="w-4 h-4 text-amber-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-blue-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-govblue-600" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {currentLang === 'hi' ? '1-क्लिक जज / मूल्यांकन टेस्ट प्रोफाइल:' : '1-Click Evaluation Presets (For Reviewers & Judges):'}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          {currentLang === 'hi' ? 'तुरंत फॉर्म भरने के लिए क्लिक करें' : 'Click to autofill realistic test profile'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {DEMO_PERSONAS.map((persona) => {
          const isSelected = selectedPersonaId === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelectPersona({ ...persona.profile, preferredLanguage: currentLang }, persona)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-govblue-600 bg-govblue-50/70 shadow-sm ring-1 ring-govblue-500'
                  : 'border-slate-200 bg-white hover:border-govblue-300 hover:bg-slate-50/80 shadow-xs'
              }`}
              aria-pressed={isSelected}
            >
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors shrink-0 mt-0.5 border border-slate-200">
                {getIcon(persona.avatarIcon)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {currentLang === 'hi' ? persona.nameHi : persona.name}
                  </h4>
                  {isSelected && (
                    <span className="text-[10px] bg-govblue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium text-slate-600 truncate">
                  {currentLang === 'hi' ? persona.roleTitleHi : persona.roleTitle}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                  {currentLang === 'hi' ? persona.descriptionHi : persona.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
