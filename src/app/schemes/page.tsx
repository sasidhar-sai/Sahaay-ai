'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import schemesData from '@/data/schemes.json';
import { VerifiedScheme } from '@/types/scheme';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { AudioReader } from '@/components/common/AudioReader';
import { Language, DICTIONARY } from '@/lib/i18n';
import {
  ShieldCheck,
  Calendar,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Landmark,
  CheckCircle,
  FileText
} from 'lucide-react';

const catalog = schemesData as unknown as VerifiedScheme[];

export default function SchemesDirectoryPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const dict = DICTIONARY[currentLang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSchemes = catalog.filter((scheme) => {
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      scheme.name.toLowerCase().includes(q) ||
      scheme.nameHi.includes(q) ||
      scheme.summary.toLowerCase().includes(q) ||
      scheme.verifiedSource.sourceName.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-govblue-50 text-govblue-800 border border-govblue-200 mb-3">
            <Landmark className="w-3.5 h-3.5 text-govblue-600" />
            <span>Verified Central & State Schemes Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {currentLang === 'hi' ? 'सभी सत्यापित सरकारी योजनाएं' : 'Browse All Verified Schemes'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            {currentLang === 'hi'
              ? 'प्रत्येक योजना आधिकारिक सरकारी स्रोतों, स्पष्ट पात्रता मानदंडों और आधिकारिक पोर्टल लिंक के साथ सत्यापित है।'
              : 'Every scheme in Sahaay AI is verified against authentic official government guidelines with direct portal links.'}
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === 'hi' ? 'योजना का नाम या मंत्रालय खोजें...' : 'Search scheme name or ministry...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:border-govblue-600 transition-all font-medium"
              />
            </div>

            {/* CTA to Check Eligibility */}
            <Link
              href="/check"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-govblue-600 hover:bg-govblue-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
            >
              <span>{dict.ctaStart}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold pr-2 border-r border-slate-200 shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Category:</span>
            </div>

            {['all', 'agriculture', 'education', 'healthcare', 'social_security', 'livelihood', 'housing'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize shrink-0 transition-all ${
                    selectedCategory === cat
                      ? 'bg-govblue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? dict.filterAll : cat.replace(/_/g, ' ')}
                </button>
              )
            )}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => {
            const title = currentLang === 'hi' ? scheme.nameHi : scheme.name;
            const summary = currentLang === 'hi' ? scheme.summaryHi : scheme.summary;
            const benefits = currentLang === 'hi' ? scheme.benefitsHi : scheme.benefits;

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-6 space-y-4">
                  {/* Top verified source metadata */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{dict.verifiedSourceBadge}</span>
                    </span>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{dict.lastVerifiedOn}: {scheme.verifiedSource.lastVerifiedDate}</span>
                    </span>
                  </div>

                  {/* Title & Ministry */}
                  <div>
                    <div className="text-[11px] font-semibold text-govblue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Landmark className="w-3 h-3" />
                      <span>{scheme.verifiedSource.sourceName}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-1.5">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{dict.keyBenefitsTitle}</span>
                    </h3>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {benefits.slice(0, 2).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Documents count badge */}
                  <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{scheme.documents.length} required verification documents</span>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <AudioReader
                    textToRead={`${title}. ${summary}. Benefits: ${benefits.join('. ')}`}
                    lang={currentLang}
                    label={title}
                  />

                  <a
                    href={scheme.verifiedSource.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-govblue-700 hover:text-govblue-900 bg-white hover:bg-govblue-50 px-3.5 py-1.5 rounded-xl border border-slate-300 transition-colors shadow-2xs"
                  >
                    <span>{dict.viewOfficialPortal}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
}
