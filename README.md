# Sahaay AI 🇮🇳

### AI-Powered Welfare Scheme Discovery & Eligibility Matching Platform

Sahaay AI helps Indian citizens discover government welfare schemes that may be relevant to their personal situation.

Instead of searching through multiple government websites and trying to understand complicated eligibility requirements, users can enter their basic profile and receive relevant scheme recommendations with eligibility information, required documents, official sources, and application steps.

> Sahaay AI is a discovery and guidance platform. Final eligibility and approval are determined by the respective government authority.

---

## 🚀 Key Features

### 1. Personalized Scheme Matching

Users provide basic information such as:

- Age
- Gender
- State
- Rural / Urban location
- Income
- Social category
- Student status
- Occupation
- BPL status
- Landholding
- Welfare needs

Sahaay AI uses this information to identify potentially relevant welfare schemes.

### 2. Deterministic Eligibility Filtering

Eligibility rules are evaluated before AI recommendations.

Hard constraints such as:

- Age limits
- Income limits
- Occupation
- Gender
- Student status
- Social category
- BPL status
- Landholding limits

are evaluated deterministically.

AI does not override these hard eligibility rules.

### 3. Transparent Relevance Score

Each matched scheme receives a profile-alignment score from 0–100%.

The score considers factors such as:

- Occupation / persona alignment
- Income alignment
- Stated welfare needs
- Vulnerability / BPL indicators

The score is a relevance indicator and is not a legal guarantee of eligibility.

### 4. Verified Government Sources

Scheme information includes:

- Official government source
- Official portal
- Last verified date
- Helpline information
- Required documents
- Application steps

Users are directed to official portals for final verification and application.

### 5. Multilingual Support

The platform supports:

- English
- Hindi

Users can switch languages across the application interface and scheme information.

### 6. Accessibility

Sahaay AI includes:

- Text-to-speech narration
- English and Hindi voice support
- Printable scheme checklists
- Clear document requirements
- Step-by-step application guidance

### 7. AI-Powered Explanations

Gemini 2.5 Flash generates personalized:

- Why this scheme may be relevant
- Important caveats
- Suggested next steps

A deterministic fallback is available when the AI API is unavailable.

### 8. Privacy

The application is designed so that user demographic and income information is not written to console logs or application telemetry.

---

## 🏛️ Schemes Covered

Sahaay AI currently contains 12 verified schemes across multiple categories:

| Category | Schemes |
|---|---|
| Agriculture | PM-KISAN, PM Fasal Bima Yojana, Kisan Credit Card |
| Education | Post-Matric Scholarship, AICTE Pragati Scholarship, PM Vidyalaxmi |
| Livelihood | PM SVANidhi |
| Healthcare | Ayushman Bharat PM-JAY |
| Social Security | PM Shram Yogi Maandhan, Old Age Pension, Atal Pension Yojana |
| Housing | PM Awas Yojana |

---

## 🧠 How Sahaay AI Works

```text
User Profile
     ↓
Eligibility Rules
     ↓
Deterministic Filtering
     ↓
Relevance Scoring
     ↓
Candidate Schemes
     ↓
Gemini AI Explanation
     ↓
Personalized Results
     ↓
Documents + Application Steps
     ↓
Official Government Portal
