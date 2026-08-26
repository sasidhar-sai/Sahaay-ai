'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DemoPersonaChips } from '../components/presets/DemoPersonaChips';
import { Language, DICTIONARY } from '../lib/i18n';
import { UserProfile } from '../types/profile';
import { DemoPreset } from '../data/personas';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  FileCheck2,
  Sprout,
  GraduationCap,
  Store,
  HeartPulse,
  Landmark,
  Layers
} from 'lucide-react';

export default function LandingPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const dict = DICTIONARY[currentLang];
  const router = useRouter();

  const handleSelectPreset = (profile: UserProfile, persona: DemoPreset) => {
    // Save to session storage and navigate to check page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sahaay_prefill_profile', JSON.stringify(profile));
      sessionStorage.setItem('sahaay_selected_persona_id', persona.id);
    }
    router.push('/check');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-slate-50 pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Top Pill Badges */}
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-govblue-50 text-govblue-800 border border-govblue-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-govblue-600" />
                <span>Powered by Google Gemini 2.5 Flash</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Authoritative Deterministic Rule Engine</span>
              </span>
            </div>

            {/* Main Hero Header */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
                {dict.heroTitle}
              </h1>
              <p className="mt-5 text-sm sm:text-lg text-slate-600 leading-relaxed font-normal">
                {dict.heroSubtitle}
              </p>

              {/* Primary Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/check"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-govblue-700 to-govblue-600 hover:from-govblue-800 hover:to-govblue-700 text-white font-extrabold text-base shadow-xl shadow-govblue-200 transition-all hover:scale-[1.02]"
                >
                  <span>{dict.ctaStart}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/schemes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm transition-all hover:border-slate-400"
                >
                  <Landmark className="w-4 h-4 text-govblue-600" />
                  <span>{dict.ctaBrowse}</span>
                </Link>
              </div>
            </div>

            {/* 1-CLICK DEMO PERSONA PRESETS CARD */}
            <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8">
              <div className="text-center sm:text-left mb-4">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                  <Cpu className="w-4 h-4 text-govblue-600" />
                  <span>{dict.demoPresetsTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {dict.demoPresetsSubtitle}
                </p>
              </div>

              <DemoPersonaChips
                currentLang={currentLang}
                onSelectPersona={handleSelectPreset}
              />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-govblue-600 bg-govblue-50 px-3 py-1 rounded-full border border-govblue-200">
                Architectural Transparency
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight mt-3">
                {dict.howItWorksTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-govblue-100 text-govblue-700 flex items-center justify-center font-black text-lg">
                  1
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {dict.step1Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {dict.step1Desc}
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                  2
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {dict.step2Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {dict.step2Desc}
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-8 rounded-3xl bg-purple-50/60 border border-purple-200/80 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-lg">
                  3
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {dict.step3Title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {dict.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST, PRIVACY & VERIFICATION ASSURANCE BANNER */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-emerald-400 shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Zero Persistent PII Storage</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    We do not store user demographic or income data on any database. Processing occurs strictly in-memory during your session.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-govblue-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Verified Official Sources</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Every scheme links directly to official government portals (.gov.in / .nic.in) with published guidelines and verified dates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 shrink-0">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Offline Checklist & Audio</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Print ready checklists with required documents and listen to scheme benefits in Hindi or English using integrated voice narration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
}
