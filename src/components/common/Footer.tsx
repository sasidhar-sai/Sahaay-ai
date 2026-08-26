'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, Info, Heart } from 'lucide-react';
import { Language, DICTIONARY } from '@/lib/i18n';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const dict = DICTIONARY[currentLang];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 no-print">
      {/* Prominent Legal Disclaimer Banner */}
      <div className="bg-amber-950/60 border-b border-amber-800/50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <span className="font-semibold text-amber-300 mr-1">{dict.disclaimerTitle}:</span>
            {dict.disclaimerText}
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-govblue-500 flex items-center justify-center text-white font-bold text-sm">
                सं
              </div>
              <span className="font-bold text-lg text-white">Sahaay AI</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {dict.heroSubtitle}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{dict.privacyNote}</span>
            </div>
          </div>

          {/* Official Government Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {currentLang === 'hi' ? 'प्रमुख सरकारी पोर्टल' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>PM-KISAN Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://scholarships.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>National Scholarship Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmsvanidhi.mohua.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>PM SVANidhi Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://beneficiary.nha.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Ayushman Bharat Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Technology & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {currentLang === 'hi' ? 'तकनीक व सुरक्षा' : 'Tech & Cloud'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Google Gemini 2.5 Flash through server-side GenAI SDK. Hosted on Google Cloud Run with zero persistent PII storage.
            </p>
            <div className="pt-1 text-[11px] text-slate-500">
              Built for social impact hackathon.
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Sahaay AI. Released under Open Impact License.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for citizen welfare empowerment.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
