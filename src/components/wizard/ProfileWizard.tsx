'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, Gender, SocialCategory, Occupation, AreaType } from '@/types/profile';
import { Language, DICTIONARY } from '@/lib/i18n';
import { DemoPersonaChips } from '@/components/presets/DemoPersonaChips';
import { DemoPreset } from '@/data/personas';
import {
  User,
  Home,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Search,
  RotateCcw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface ProfileWizardProps {
  currentLang: Language;
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const INDIAN_STATES = [
  "All India",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

export const ProfileWizard: React.FC<ProfileWizardProps> = ({
  currentLang,
  onSubmit,
  isLoading
}) => {
  const dict = DICTIONARY[currentLang];
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState<UserProfile>({
    age: 24,
    gender: 'female',
    state: 'All India',
    area: 'rural',
    socialCategory: 'general',
    annualFamilyIncome: 100000,
    occupation: 'farmer',
    isStudent: false,
    isDifferentlyAbled: false,
    landHoldingAcres: 1.0,
    hasBPLCard: false,
    specificNeeds: [],
    preferredLanguage: currentLang
  });

  // Hydrate prefilled persona from sessionStorage safely after mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedProfile = sessionStorage.getItem('sahaay_prefill_profile');
      const savedPersonaId = sessionStorage.getItem('sahaay_selected_persona_id');

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed && typeof parsed === 'object') {
          setFormData(prev => ({
            ...prev,
            ...parsed,
            preferredLanguage: currentLang
          }));
        }
      }

      if (savedPersonaId) {
        setSelectedPersonaId(savedPersonaId);
      }
    } catch (err) {
      console.error('Failed to read prefill profile from sessionStorage:', err);
    }
  }, []);

  // Handle Demo Persona Preset Click
  const handleSelectPreset = (profile: UserProfile, persona: DemoPreset) => {
    setFormData({
      ...profile,
      preferredLanguage: currentLang
    });
    setSelectedPersonaId(persona.id);
    setErrors({});
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('sahaay_prefill_profile', JSON.stringify(profile));
        sessionStorage.setItem('sahaay_selected_persona_id', persona.id);
      } catch {
        // Ignore storage errors in restricted browser contexts
      }
    }
  };

  // Field change handler
  const handleChange = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setSelectedPersonaId(undefined); // Clear active preset if user modifies manually
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Toggle specific need tag
  const toggleNeed = (needId: string) => {
    const currentNeeds = formData.specificNeeds || [];
    if (currentNeeds.includes(needId)) {
      handleChange('specificNeeds', currentNeeds.filter(n => n !== needId));
    } else {
      handleChange('specificNeeds', [...currentNeeds, needId]);
    }
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (formData.age === undefined || isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
        newErrors.age = currentLang === 'hi' ? "कृपया 0 से 120 के बीच वैध आयु दर्ज करें।" : "Please enter a valid age between 0 and 120.";
      }
      if (!formData.gender) {
        newErrors.gender = currentLang === 'hi' ? "कृपया लिंग चुनें।" : "Please select a gender.";
      }
    }

    if (step === 2) {
      if (
        formData.annualFamilyIncome === undefined ||
        isNaN(formData.annualFamilyIncome) ||
        formData.annualFamilyIncome < 0
      ) {
        newErrors.annualFamilyIncome = currentLang === 'hi' ? "कृपया वैध वार्षिक आय दर्ज करें।" : "Please enter a valid annual income (₹).";
      }
    }

    if (step === 3) {
      if (!formData.occupation) {
        newErrors.occupation = currentLang === 'hi' ? "कृपया मुख्य व्यवसाय चुनें।" : "Please select an occupation.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep < 3) {
        setActiveStep((activeStep + 1) as 1 | 2 | 3);
      }
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep((activeStep - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(activeStep)) {
      onSubmit({
        ...formData,
        preferredLanguage: currentLang
      });
    }
  };

  const handleReset = () => {
    setFormData({
      age: 24,
      gender: 'female',
      state: 'All India',
      area: 'rural',
      socialCategory: 'general',
      annualFamilyIncome: 100000,
      occupation: 'farmer',
      isStudent: false,
      isDifferentlyAbled: false,
      landHoldingAcres: 1.0,
      hasBPLCard: false,
      specificNeeds: [],
      preferredLanguage: currentLang
    });
    setSelectedPersonaId(undefined);
    setActiveStep(1);
    setErrors({});
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('sahaay_prefill_profile');
        sessionStorage.removeItem('sahaay_selected_persona_id');
      } catch {
        // Ignore storage errors in restricted browser contexts
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Demo Presets Bar */}
      <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-200">
        <DemoPersonaChips
          currentLang={currentLang}
          onSelectPersona={handleSelectPreset}
          selectedPersonaId={selectedPersonaId}
        />
      </div>

      {/* Wizard Header & Progress Bar */}
      <div className="p-6 sm:p-8 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {dict.wizardTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {dict.wizardSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{dict.btnReset}</span>
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-6" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeStep === 1}
            onClick={() => validateStep(activeStep) && setActiveStep(1)}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              activeStep === 1
                ? 'bg-govblue-600 text-white border-govblue-600 shadow-sm'
                : activeStep > 1
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">{dict.step1Tab}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeStep === 2}
            onClick={() => validateStep(activeStep) && setActiveStep(2)}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              activeStep === 2
                ? 'bg-govblue-600 text-white border-govblue-600 shadow-sm'
                : activeStep > 2
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className="truncate">{dict.step2Tab}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeStep === 3}
            onClick={() => validateStep(activeStep) && setActiveStep(3)}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              activeStep === 3
                ? 'bg-govblue-600 text-white border-govblue-600 shadow-sm'
                : 'bg-slate-50 text-slate-500 border-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span className="truncate">{dict.step3Tab}</span>
          </button>
        </div>
      </div>

      {/* Wizard Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: DEMOGRAPHICS */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {dict.ageLabel} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium bg-slate-50/50 focus:bg-white transition-all ${
                    errors.age ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300 focus:border-govblue-600'
                  }`}
                  placeholder={dict.agePlaceholder}
                  required
                />
                {errors.age && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.age}</span>
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {dict.genderLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as Gender)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white focus:border-govblue-600 transition-all"
                  required
                >
                  <option value="female">{dict.genderFemale}</option>
                  <option value="male">{dict.genderMale}</option>
                  <option value="transgender">{dict.genderTransgender}</option>
                  <option value="other">{dict.genderOther}</option>
                </select>
              </div>

              {/* State / UT */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {dict.stateLabel}
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white focus:border-govblue-600 transition-all"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {dict.areaLabel}
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value as AreaType)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white focus:border-govblue-600 transition-all"
                >
                  <option value="rural">{dict.areaRural}</option>
                  <option value="urban">{dict.areaUrban}</option>
                  <option value="semi_urban">{dict.areaSemiUrban}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: HOUSEHOLD & INCOME */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Annual Family Income */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {dict.incomeLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={formData.annualFamilyIncome}
                    onChange={(e) => handleChange('annualFamilyIncome', parseInt(e.target.value) || 0)}
                    className={`w-full pl-8 pr-4 py-3 rounded-xl border text-sm font-medium bg-slate-50/50 focus:bg-white transition-all ${
                      errors.annualFamilyIncome
                        ? 'border-rose-500 ring-1 ring-rose-500'
                        : 'border-slate-300 focus:border-govblue-600'
                    }`}
                    placeholder={dict.incomePlaceholder}
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {dict.incomeHelp}
                </p>
                {errors.annualFamilyIncome && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.annualFamilyIncome}</span>
                  </p>
                )}
              </div>

              {/* Social Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {dict.socialCategoryLabel}
                </label>
                <select
                  value={formData.socialCategory}
                  onChange={(e) => handleChange('socialCategory', e.target.value as SocialCategory)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white focus:border-govblue-600 transition-all"
                >
                  <option value="general">{dict.catGeneral}</option>
                  <option value="obc">{dict.catOBC}</option>
                  <option value="sc">{dict.catSC}</option>
                  <option value="st">{dict.catST}</option>
                  <option value="minority">{dict.catMinority}</option>
                  <option value="any">{dict.catAny}</option>
                </select>
              </div>

              {/* BPL Card Status */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {dict.bplLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('hasBPLCard', true)}
                    className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                      formData.hasBPLCard
                        ? 'border-govblue-600 bg-govblue-50 text-govblue-900 ring-1 ring-govblue-500'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${formData.hasBPLCard ? 'text-govblue-600' : 'text-slate-400'}`}
                    />
                    <span>{dict.bplYes}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('hasBPLCard', false)}
                    className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                      !formData.hasBPLCard
                        ? 'border-govblue-600 bg-govblue-50 text-govblue-900 ring-1 ring-govblue-500'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${!formData.hasBPLCard ? 'text-govblue-600' : 'text-slate-400'}`}
                    />
                    <span>{dict.bplNo}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: OCCUPATION & SPECIFIC NEEDS */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Occupation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {dict.occupationLabel} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => {
                    const occ = e.target.value as Occupation;
                    handleChange('occupation', occ);
                    if (occ === 'student') handleChange('isStudent', true);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white focus:border-govblue-600 transition-all"
                  required
                >
                  <option value="farmer">{dict.occFarmer}</option>
                  <option value="student">{dict.occStudent}</option>
                  <option value="street_vendor">{dict.occStreetVendor}</option>
                  <option value="daily_wage_worker">{dict.occDailyWage}</option>
                  <option value="senior_citizen">{dict.occSeniorCitizen}</option>
                  <option value="self_employed">{dict.occSelfEmployed}</option>
                  <option value="salaried">{dict.occSalaried}</option>
                  <option value="homemaker">{dict.occHomemaker}</option>
                  <option value="unemployed">{dict.occUnemployed}</option>
                </select>
              </div>

              {/* Conditional Land Holding (if Farmer) */}
              {formData.occupation === 'farmer' ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {dict.landLabel}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.landHoldingAcres || 0}
                    onChange={(e) => handleChange('landHoldingAcres', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white focus:border-govblue-600 transition-all"
                    placeholder={dict.landPlaceholder}
                  />
                </div>
              ) : (
                /* Disability Status */
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {dict.disabilityLabel}
                  </label>
                  <select
                    value={formData.isDifferentlyAbled ? 'yes' : 'no'}
                    onChange={(e) => handleChange('isDifferentlyAbled', e.target.value === 'yes')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium bg-slate-50/50 focus:bg-white focus:border-govblue-600 transition-all"
                  >
                    <option value="no">{dict.disabilityNo}</option>
                    <option value="yes">{dict.disabilityYes}</option>
                  </select>
                </div>
              )}

              {/* Specific Needs Selection Chips */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {dict.needsLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    { id: 'higher_education', label: dict.needHigherEd },
                    { id: 'crop_insurance', label: dict.needCropInsurance },
                    { id: 'credit_support', label: dict.needCredit },
                    { id: 'healthcare', label: dict.needHealthcare },
                    { id: 'pension', label: dict.needPension },
                    { id: 'housing', label: dict.needHousing }
                  ].map((need) => {
                    const isChecked = formData.specificNeeds?.includes(need.id);
                    return (
                      <button
                        key={need.id}
                        type="button"
                        onClick={() => toggleNeed(need.id)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between gap-2 ${
                          isChecked
                            ? 'border-govblue-600 bg-govblue-50 text-govblue-900 ring-1 ring-govblue-500 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="leading-snug">{need.label}</span>
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${isChecked ? 'text-govblue-600' : 'text-slate-300'}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Strip */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap">
          {activeStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dict.btnPrev}</span>
            </button>
          ) : (
            <div />
          )}

          {activeStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-govblue-600 hover:bg-govblue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-govblue-200 transition-all hover:shadow-lg"
            >
              <span>{dict.btnNext}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-govblue-600 text-white text-sm font-extrabold shadow-lg shadow-govblue-300 transition-all hover:scale-[1.01] ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:from-brand-700 hover:to-govblue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{dict.btnLoading}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{dict.btnSubmit}</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
