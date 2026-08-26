'use client';

import React, { useState } from 'react';
import { SchemeDocument } from '@/types/scheme';
import { Language } from '@/lib/i18n';
import { CheckSquare, Square, FileText, Info } from 'lucide-react';

interface DocumentChecklistProps {
  documents: SchemeDocument[];
  currentLang: Language;
  schemeId: string;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  documents,
  currentLang,
  schemeId
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleDoc = (docIndex: number) => {
    const key = `${schemeId}-${docIndex}`;
    setCheckedDocs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-govblue-600" />
          <span>{currentLang === 'hi' ? 'आवश्यक दस्तावेज चेकलिस्ट' : 'Required Document Checklist'}</span>
        </h5>
        <span className="text-[10px] text-slate-500">
          {currentLang === 'hi' ? 'दस्तावेज तैयार होने पर टिक करें' : 'Check off as you prepare'}
        </span>
      </div>

      <div className="space-y-1.5">
        {documents.map((doc, idx) => {
          const isChecked = !!checkedDocs[`${schemeId}-${idx}`];
          return (
            <div
              key={idx}
              onClick={() => toggleDoc(idx)}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                isChecked
                  ? 'bg-emerald-50/80 border-emerald-300 text-slate-900'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleDoc(idx);
                }
              }}
            >
              <div className="mt-0.5 shrink-0 text-slate-400">
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-semibold ${isChecked ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                    {currentLang === 'hi' ? doc.nameHi : doc.name}
                  </span>
                  {doc.isMandatory ? (
                    <span className="text-[10px] uppercase font-bold bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded border border-rose-200">
                      {currentLang === 'hi' ? 'अनिवार्य' : 'Mandatory'}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                      {currentLang === 'hi' ? 'वैकल्पिक' : 'Optional'}
                    </span>
                  )}
                </div>

                {(doc.helpTip || doc.helpTipHi) && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 leading-snug">
                    <Info className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{currentLang === 'hi' ? doc.helpTipHi : doc.helpTip}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
