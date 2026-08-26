'use client';

import React from 'react';
import { Language } from '@/lib/i18n';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
      <div className="flex items-center gap-1.5 px-2 text-slate-500 text-xs font-medium border-r border-slate-200">
        <Languages className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
        <span className="hidden sm:inline">Lang</span>
      </div>
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          currentLang === 'en'
            ? 'bg-govblue-600 text-white shadow-sm'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
        }`}
        aria-pressed={currentLang === 'en'}
        aria-label="Switch language to English"
      >
        EN (English)
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange('hi')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
          currentLang === 'hi'
            ? 'bg-govblue-600 text-white shadow-sm'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
        }`}
        aria-pressed={currentLang === 'hi'}
        aria-label="Switch language to Hindi"
      >
        HI (हिंदी)
      </button>
    </div>
  );
};
