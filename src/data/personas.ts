import { UserProfile } from '@/types/profile';

export interface DemoPreset {
  id: string;
  name: string;
  nameHi: string;
  roleTitle: string;
  roleTitleHi: string;
  avatarIcon: string; // lucide icon identifier
  badgeColor: string;
  description: string;
  descriptionHi: string;
  expectedMatches: string[];
  profile: UserProfile;
}

export const DEMO_PERSONAS: DemoPreset[] = [
  {
    id: 'student',
    name: 'Priya Sharma',
    nameHi: 'प्रिया शर्मा',
    roleTitle: 'Low-Income College Student',
    roleTitleHi: 'कम आय वाली कॉलेज छात्रा',
    avatarIcon: 'GraduationCap',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    description: '20-year-old female undergraduate college student from an OBC family (income ₹1.2L/yr), seeking education financial aid and scholarships.',
    descriptionHi: 'ओबीसी परिवार (वार्षिक आय ₹1.2 लाख) की 20 वर्षीय स्नातक छात्रा, जो शिक्षा सहायता और छात्रवृत्ति की तलाश में है।',
    expectedMatches: [
      'Post-Matric Scholarship for SC/ST/OBC',
      'AICTE Pragati Scholarship for Girl Students',
      'PM Vidyalaxmi Scheme'
    ],
    profile: {
      age: 20,
      gender: 'female',
      state: 'Uttar Pradesh',
      area: 'semi_urban',
      socialCategory: 'obc',
      annualFamilyIncome: 120000,
      occupation: 'student',
      isStudent: true,
      isDifferentlyAbled: false,
      hasBPLCard: false,
      specificNeeds: ['higher_education', 'fee_reimbursement'],
      preferredLanguage: 'en'
    }
  },
  {
    id: 'farmer',
    name: 'Ramesh Patel',
    nameHi: 'रमेश पटेल',
    roleTitle: 'Smallholder Marginal Farmer',
    roleTitleHi: 'सीमांत / छोटे किसान',
    avatarIcon: 'Sprout',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: '44-year-old farmer in rural Madhya Pradesh cultivating 1.8 acres of land with ₹85,000 annual income, seeking crop insurance and input credit.',
    descriptionHi: 'मध्य प्रदेश के 44 वर्षीय किसान जो 1.8 एकड़ भूमि पर खेती करते हैं (वार्षिक आय ₹85,000), फसल सुरक्षा और खाद/बीज ऋण की तलाश में हैं।',
    expectedMatches: [
      'PM Kisan Samman Nidhi (PM-KISAN)',
      'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      'Kisan Credit Card (KCC) Scheme',
      'Ayushman Bharat (AB-PMJAY)'
    ],
    profile: {
      age: 44,
      gender: 'male',
      state: 'Madhya Pradesh',
      area: 'rural',
      socialCategory: 'general',
      annualFamilyIncome: 85000,
      occupation: 'farmer',
      isStudent: false,
      isDifferentlyAbled: false,
      landHoldingAcres: 1.8,
      hasBPLCard: false,
      specificNeeds: ['crop_insurance', 'credit_support', 'agricultural_inputs'],
      preferredLanguage: 'en'
    }
  },
  {
    id: 'informal_worker',
    name: 'Sunita Devi',
    nameHi: 'सुनीता देवी',
    roleTitle: 'Street Vendor / Informal Worker',
    roleTitleHi: 'स्ट्रीट वेंडर / दिहाड़ी कामगार',
    avatarIcon: 'Store',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    description: '36-year-old female street vendor in Delhi with an annual income of ₹70,000 and BPL card, needing micro-credit working capital and health coverage.',
    descriptionHi: 'दिल्ली की 36 वर्षीय स्ट्रीट वेंडर (वार्षिक आय ₹70,000, बीपीएल कार्ड धारक), जिन्हें कार्यशील पूंजी ऋण और स्वास्थ्य सुरक्षा की आवश्यकता है।',
    expectedMatches: [
      'PM SVANidhi (Street Vendor Loan)',
      'Ayushman Bharat (AB-PMJAY)',
      'PM Shram Yogi Maan-dhan (PM-SYM)'
    ],
    profile: {
      age: 36,
      gender: 'female',
      state: 'Delhi',
      area: 'urban',
      socialCategory: 'sc',
      annualFamilyIncome: 70000,
      occupation: 'street_vendor',
      isStudent: false,
      isDifferentlyAbled: false,
      hasBPLCard: true,
      specificNeeds: ['business_loan', 'healthcare', 'pension'],
      preferredLanguage: 'en'
    }
  },
  {
    id: 'senior_citizen',
    name: 'Gopal Das',
    nameHi: 'गोपाल दास',
    roleTitle: 'Low-Income Senior Citizen',
    roleTitleHi: 'वरिष्ठ नागरिक (बीपीएल)',
    avatarIcon: 'HeartPulse',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    description: '68-year-old retired informal worker living in rural Bihar with ₹38,000 annual income and BPL status, seeking monthly pension and shelter assistance.',
    descriptionHi: 'बिहार के 68 वर्षीय वृद्ध नागरिक (वार्षिक आय ₹38,000, बीपीएल कार्ड), जो मासिक वृद्धावस्था पेंशन और पक्के मकान की तलाश में हैं।',
    expectedMatches: [
      'Indira Gandhi National Old Age Pension (IGNOAPS)',
      'Ayushman Bharat (AB-PMJAY)',
      'Pradhan Mantri Awas Yojana (PMAY)'
    ],
    profile: {
      age: 68,
      gender: 'male',
      state: 'Bihar',
      area: 'rural',
      socialCategory: 'general',
      annualFamilyIncome: 38000,
      occupation: 'senior_citizen',
      isStudent: false,
      isDifferentlyAbled: false,
      hasBPLCard: true,
      specificNeeds: ['pension', 'healthcare', 'housing'],
      preferredLanguage: 'en'
    }
  }
];
