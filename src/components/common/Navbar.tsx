'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, BookOpen, Search, Home } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { Language, DICTIONARY } from '@/lib/i18n';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang, onLanguageChange }) => {
  const dict = DICTIONARY[currentLang];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-govblue-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-govblue-600 to-saffron-500 flex items-center justify-center text-white font-bold shadow-md shadow-govblue-200">
              <span className="text-xl tracking-tighter">सं</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">Sahaay AI</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded border border-brand-200">
                  Public Beta
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {currentLang === 'hi' ? 'नागरिक कल्याण खोज मंच' : 'Civic Welfare Discovery Portal'}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-govblue-600 transition-colors"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>{dict.navHome}</span>
            </Link>
            <Link
              href="/check"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-govblue-600 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>{dict.navCheck}</span>
            </Link>
            <Link
              href="/schemes"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-govblue-600 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>{dict.navDirectory}</span>
            </Link>
          </nav>

          {/* Right Action: Language Switcher & Trust Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-PII Storage</span>
            </div>

            <LanguageToggle currentLang={currentLang} onLanguageChange={onLanguageChange} />
          </div>
        </div>
      </div>
    </header>
  );
};
