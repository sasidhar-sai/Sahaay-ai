'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ProfileWizard } from '@/components/wizard/ProfileWizard';
import { SchemeCard } from '@/components/results/SchemeCard';
import { ExportChecklist } from '@/components/results/ExportChecklist';
import { Language, DICTIONARY } from '@/lib/i18n';
import { UserProfile } from '@/types/profile';
import { MatchApiResponse, MatchedSchemeResult } from '@/types/match';
import {
  CheckCircle2,
  AlertCircle,
  Filter,
  ArrowLeft,
  RotateCcw,
  Info
} from 'lucide-react';

export default function CheckPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const dict = DICTIONARY[currentLang];

  const [isLoading, setIsLoading] = useState(false);
  const [matchResponse, setMatchResponse] = useState<MatchApiResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle Form Submission
  const handleProfileSubmit = async (profile: UserProfile) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: MatchApiResponse = await response.json();
      setMatchResponse(data);
      setSelectedCategory('all');

      // Smooth scroll down to results
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    } catch (err) {
      setApiError(
        currentLang === 'hi'
          ? "योजना मिलान करते समय एक त्रुटि उत्पन्न हुई। कृपया पुनः प्रयास करें।"
          : "An error occurred while evaluating schemes. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetResults = () => {
    setMatchResponse(null);
    setApiError(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter schemes by selected category
  const filteredSchemes: MatchedSchemeResult[] = matchResponse
    ? selectedCategory === 'all'
      ? matchResponse.matchedSchemes
      : matchResponse.matchedSchemes.filter(item => item.scheme.category === selectedCategory)
    : [];

  const categoryCounts = matchResponse
    ? matchResponse.matchedSchemes.reduce<Record<string, number>>((acc, item) => {
        acc[item.scheme.category] = (acc[item.scheme.category] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Disclaimer Alert */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-xs no-print">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold mr-1">{dict.disclaimerTitle}:</span>
            {dict.disclaimerText}
          </div>
        </div>

        {/* PROFILE WIZARD SECTION */}
        <section aria-label="Profile Assessment">
          <ProfileWizard
            currentLang={currentLang}
            onSubmit={handleProfileSubmit}
            isLoading={isLoading}
          />
        </section>

        {/* API ERROR MESSAGE */}
        {apiError && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        {/* RESULTS SECTION */}
        {matchResponse && (
          <section className="mt-14 space-y-8" aria-label="Assessment Results">
            {/* Results Header Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{matchResponse.deterministicPassedCount} {dict.matchedCount}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      (Analyzed in {matchResponse.processingTimeMs}ms)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                    {dict.resultsTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {dict.resultsSubtitle}
                  </p>
                </div>

                {/* Right Actions: Export Checklist Button */}
                <div className="flex items-center gap-3">
                  <ExportChecklist
                    matchedSchemes={matchResponse.matchedSchemes}
                    currentLang={currentLang}
                  />
                  <button
                    type="button"
                    onClick={handleResetResults}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors no-print"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{dict.btnReset}</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Chips */}
              {matchResponse.matchedSchemes.length > 0 && (
                <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 no-print">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold pr-2 border-r border-slate-200 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span>Filter:</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-govblue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {dict.filterAll} ({matchResponse.matchedSchemes.length})
                  </button>

                  {Object.entries(categoryCounts).map(([cat, count]) => (
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
                      {cat.replace(/_/g, ' ')} ({count})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Matched Scheme Cards Grid */}
            {filteredSchemes.length > 0 ? (
              <div className="space-y-6">
                {filteredSchemes.map((matchedItem) => (
                  <SchemeCard
                    key={matchedItem.scheme.id}
                    matchedItem={matchedItem}
                    currentLang={currentLang}
                  />
                ))}
              </div>
            ) : (
              /* No Match State */
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {dict.noMatchTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {dict.noMatchDesc}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetResults}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-govblue-600 text-white text-xs font-bold hover:bg-govblue-700 transition-colors shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{currentLang === 'hi' ? 'पुनः विवरण भरें' : 'Adjust Profile Criteria'}</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
}
