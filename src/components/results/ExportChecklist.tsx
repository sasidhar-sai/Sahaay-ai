'use client';

import React from 'react';
import { MatchedSchemeResult } from '@/types/match';
import { Language, DICTIONARY } from '@/lib/i18n';
import { Printer } from 'lucide-react';

interface ExportChecklistProps {
  matchedSchemes: MatchedSchemeResult[];
  currentLang: Language;
}

export const ExportChecklist: React.FC<ExportChecklistProps> = ({
  matchedSchemes,
  currentLang
}) => {
  const dict = DICTIONARY[currentLang];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs transition-all hover:border-slate-400 no-print"
        title="Print this page or save as PDF"
      >
        <Printer className="w-4 h-4 text-slate-600" />
        <span>{dict.printChecklist}</span>
      </button>
    </div>
  );
};
