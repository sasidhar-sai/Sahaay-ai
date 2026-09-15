# Sahaay AI
### AI-Powered Welfare Scheme Discovery & Eligibility Matching Platform

---

## 1. Project Overview

Finding and accessing government welfare programs in India is often difficult for the citizens who need them most. Citizens frequently have to navigate fragmented portals across multiple ministries, interpret dense legal criteria, and guess whether their socio-economic profile qualifies them for benefits.

**Sahaay AI** bridges this gap through a unified, privacy-first discovery platform. By collecting a basic demographic and socio-economic profile in-memory, Sahaay AI deterministically filters statutory eligibility rules and uses **Google Gemini 2.5 Flash** to provide personalized, bilingual explanations, document checklists, and direct links to official government portals.

> **Important Notice:** Sahaay AI is an independent discovery and advisory platform. Final statutory eligibility, application acceptance, and benefit disbursement are determined exclusively by the respective government ministries and official authorities.

---

## 2. Problem

Indian citizens face several persistent barriers when seeking public welfare benefits:

* **Fragmented Scheme Information:** Welfare programs are dispersed across dozens of central and state departmental portals with inconsistent structures and updates.
* **Complicated Statutory Rules:** Eligibility guidelines involve complex combinations of age brackets, income ceilings, landholding caps, social categories, and occupation rules that are difficult for laypersons to interpret.
* **Lack of Contextual Relevance:** Traditional portals provide static program listings without clarifying *why* a particular program is relevant to an individual's specific household situation.
* **Document and Application Uncertainty:** Citizens frequently abandon applications due to unclear document prerequisites, missing mandatory certificates, or lack of awareness about e-KYC steps.
* **Language and Accessibility Hurdles:** Information is often available only in formal bureaucratic language without voice narration or printable formats for low-literacy or offline communities.

---

## 3. Solution

Sahaay AI converts a simple citizen profile into structured, relevant, and actionable welfare guidance through an intentional **two-engine pipeline**:

1. **Deterministic Rule Engine:** Accurately evaluates statutory criteria (income limits, age thresholds, land caps, occupation requirements) so that ineligible schemes are excluded before AI reasoning begins.
2. **Contextual Intelligence Engine:** Leverages Gemini 2.5 Flash to synthesize clear, personalized rationales explaining scheme relevance, cautioning about common pitfalls (e.g., Aadhaar bank seeding), and outlining step-by-step application checklists in English and Hindi.
3. **Official Portals Direct Access:** Links citizens directly to authoritative `.gov.in` and `.nic.in` portals alongside offline-ready printable checklists and speech audio playback.

---

## 4. Key Features

* **Personalized Scheme Matching:** Evaluates individual attributes (age, gender, state, rural/urban area, annual family income, occupation, social category, landholding, BPL card status, and welfare needs).
* **Deterministic Eligibility Filtering:** Statutory requirements are strictly verified via hard-coded rule sets. AI never determines or overrides statutory eligibility constraints.
* **Transparent Relevance Scoring:** Matches receive an explainable profile-alignment score (0–100%) reflecting persona alignment, income thresholds, vulnerable-group priority, and expressed needs.
* **Verified Government Sources:** Every scheme entry links to verified government portals (`.gov.in` / `.nic.in`), published dates, source ministry metadata, and helpline contacts.
* **Bilingual Support (English & Hindi):** Full interface and AI insight translation across English and Hindi (`हिन्दी`), selectable via a single toggle.
* **Accessibility Features:** Web Speech API voice playback in English and Hindi, print-friendly offline document checklists, and clean contrast.
* **Gemini-Powered Explanations:** Gemini 2.5 Flash generates tailored *"Why Relevant"* rationales, key caveats (e.g., land records, e-KYC), and recommended next steps.
* **Privacy-First Design:** Zero persistent database storage. Citizen profile data is evaluated strictly in-memory during the active browser session.
* **Deterministic Fallback:** If the Gemini API key is not configured or network calls fail, the system automatically falls back to rule-based contextual insights with zero service disruption.

---

## 5. Two-Engine Architecture

The fundamental technical differentiator of Sahaay AI is the **strict architectural separation of statutory compliance from generative intelligence**.

```text
User Profile (In-Memory Demographics & Socio-Economic Input)
                           ↓
Deterministic Eligibility Filtering (Hard Age, Income, Land, Category Rules)
                           ↓
Eligible Scheme Candidates (Statutorily Validated Candidate Cohort)
                           ↓
Gemini AI Reasoning (Contextual In-Memory Synthesis via Gemini 2.5 Flash)
                           ↓
Personalized Explanations (Bilingual Rationale, Caveats & Actionable Next Steps)
                           ↓
Verified Recommendations (Official .gov.in Portals & Printable Checklists)
```

### The Core Principle
> **"Rules determine eligibility. AI explains and personalizes."**

* **Deterministic Engine Responsibility:** Evaluates non-negotiable statutory rules (age boundaries, income ceilings, land caps, social categories, BPL status). If a user does not meet a mandatory legal rule, the scheme is filtered out deterministically.
* **Handover Guarantee:** **AI receives only eligible candidates.** Gemini is never asked to decide whether a citizen qualifies under statutory law.
* **Generative Engine Responsibility:** Gemini 2.5 Flash is invoked solely over the pre-filtered candidate subset to personalize explanations, highlight critical warnings (e.g., Aadhaar-mobile linkage), and structure application workflows.
* **Boundary Enforcement:** AI reasoning cannot override or loosen statutory eligibility rules, preventing generative misattribution of legal qualifications.
* **Statutory Authority:** Final statutory eligibility, application review, and benefit approval remain exclusively with the governing authority.

---

## 6. How It Works

```text
[Step 1: Profile Input] → [Step 2: Rule Engine] → [Step 3: Scoring] → [Step 4: Gemini AI] → [Step 5: Official Action]
```

1. **Enter Profile:** The citizen fills out a streamlined 3-step wizard (or chooses a 1-click demo persona) covering demographics, income, landholding, and specific welfare needs.
2. **Deterministic Evaluation:** The deterministic engine tests the profile against statutory requirements across the verified scheme catalog. Ineligible schemes are excluded immediately.
3. **Relevance Scoring:** Remaining eligible schemes are ranked using a multi-factor scoring formula that factors in income bands, occupational category, BPL status, and expressed needs.
4. **Gemini AI Synthesis:** Candidate schemes are sent server-side to Gemini 2.5 Flash with strict JSON schema enforcement to produce bilingual explanations and checklists.
5. **Direct Citizen Action:** The user reviews matched schemes, listens to voice guidance, prints the offline checklist, and navigates directly to the official government portal (`.gov.in`) to apply.

---

## 7. Schemes Covered

Sahaay AI currently supports **12 verified social welfare schemes** across key sectors:

| Category | Schemes Included | Primary Target Beneficiaries |
| :--- | :--- | :--- |
| **Agriculture** | • PM Kisan Samman Nidhi (PM-KISAN)<br>• PM Fasal Bima Yojana (PMFBY)<br>• Kisan Credit Card (KCC) Scheme | Small and marginal landholding farmers |
| **Education** | • Post-Matric Scholarship for SC/ST/OBC<br>• AICTE Pragati Scholarship for Girls<br>• PM Vidyalaxmi Scheme | Underprivileged students, female scholars, and higher-education aspirants |
| **Livelihood** | • PM SVANidhi (Street Vendor Loan) | Urban informal workers and micro-vendors |
| **Healthcare** | • Ayushman Bharat PM-JAY | Low-income and vulnerable families needing secondary/tertiary hospital care |
| **Social Security** | • PM Shram Yogi Maan-dhan (PM-SYM)<br>• Indira Gandhi National Old Age Pension (IGNOAPS)<br>• Atal Pension Yojana (APY) | Unorganized workers and elderly citizens below poverty line |
| **Housing** | • Pradhan Mantri Awas Yojana (PMAY-G / PMAY-U) | Homeless and kutcha house residents |

---

## 8. Technology Stack

The project uses a modern, strictly typed web stack:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Standalone output configuration)
* **User Interface:** [React 19](https://react.dev/), [TypeScript 5.7](https://www.typescriptlang.org/), [Tailwind CSS 3.4](https://tailwindcss.com/)
* **Component Styling & Icons:** [Lucide React](https://lucide.dev/), `tailwind-merge`, `clsx`
* **AI & LLM Integration:** Google GenAI SDK ([`@google/genai`](https://www.npmjs.com/package/@google/genai) v2.18) powered by **Gemini 2.5 Flash** (`gemini-2.5-flash`)
* **Schema Validation:** [Zod 3.24](https://zod.dev/) for request sanitization, response parsing, and structured JSON output validation
* **Internationalization (i18n):** Native bilingual in-memory dictionary architecture (English and Hindi)
* **Accessibility:** Native Web Speech API integration for text-to-speech voice narration
* **Testing:** [Vitest 3.0](https://vitest.dev/) for unit tests, SSR safety, security audits, and persona integration tests
* **Containerization:** Multi-stage Alpine Dockerfile with Node.js 22 and non-root execution

---

## 9. Privacy & Security

Sahaay AI follows strict privacy-by-design standards:

* **Zero Persistent PII Storage:** The application does not maintain a database for user submissions. Demographic, occupation, and financial data exist only in memory during the browser session.
* **No Telemetry PII Leaks:** User demographic and income parameters are never output to console logs or error monitoring telemetry.
* **Server-Side API Key Handling:** All Gemini API interactions execute strictly in Next.js server-side API routes (`/api/match`). Client bundles never receive or expose the API key.
* **Environment Isolation:** Secrets are provided exclusively via server environment variables (`GEMINI_API_KEY`). The `.env.local` file is explicitly gitignored and must never be committed.
* **HTTP Security Headers:** Configured with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 10. Local Development

### Prerequisites
* **Node.js**: v20 or higher (v22+ recommended)
* **npm**: v10 or higher
* **OS**: Windows (PowerShell), macOS, or Linux

### Quick Start (PowerShell / Windows)

```powershell
# 1. Clone repository and navigate to root
cd C:\Users\DELL\Desktop\Sahaay-ai

# 2. Install dependencies
npm.cmd install

# 3. Start local development server
npm.cmd run dev
```

Once started, the application is accessible locally at:
```text
http://localhost:3000
```

---

## 11. Environment Variables

To enable Google Gemini AI reasoning, configure `GEMINI_API_KEY` in `.env.local` at the root of the project:

```bash
# Create or edit .env.local in the project root
GEMINI_API_KEY=your_gemini_api_key_here
```

### Security Guidelines:
* Create `.env.local` only on your local workstation or CI/CD secrets manager.
* **Never** commit `.env.local` or any file containing actual keys to version control.
* **Never** prefix the key with `NEXT_PUBLIC_`, which would bundle it into client-side code.
* If `GEMINI_API_KEY` is not supplied, Sahaay AI automatically engages its deterministic fallback engine without crashing.

---

## 12. Testing

The repository maintains an automated test suite verifying deterministic rule logic, schema conformance, security compliance, hydration safety, and the two-engine pipeline.

Run the test suite with:

```powershell
npm.cmd test -- --run
```

### Verified Test Status:
* **Test Suites:** 8 passed (8 total)
* **Total Tests:** 45 passed (45 total)
* **Coverage Areas:**
  * `tests/unit/deterministic-matcher.test.ts` — Hard rule filtering and boundaries
  * `tests/unit/relevance-scorer.test.ts` — Multi-factor weighting and score calculation
  * `tests/unit/schemes-schema.test.ts` — Catalog schema conformance and data integrity
  * `tests/unit/validation.test.ts` — Zod input sanitization and boundary rejection
  * `tests/unit/profile-wizard-hydration.test.ts` — SSR safety and sessionStorage hydration
  * `tests/unit/architecture-pipeline.test.ts` — Two-Engine pipeline stages, wording guardrails, and i18n parity
  * `tests/security/security-checks.test.ts` — Security headers, XSS sanitization, and payload limits
  * `tests/e2e/happy-path-personas.test.ts` — End-to-end evaluation of all 4 vulnerable citizen personas

---

## 13. Production Build

To verify production compilation and asset optimization:

```powershell
npm.cmd run build
```

This generates an optimized standalone production build in `.next/standalone`, verifying TypeScript types, linting rules, and static page generation.

---

## 14. Deployment

Sahaay AI includes a production-ready, multi-stage `Dockerfile` configured for container environments such as **Google Cloud Run**.

### Example Cloud Run Deployment Commands

*(Note: The following commands illustrate how to containerize and deploy the application to Cloud Run when ready; deployment is not automatically active.)*

```bash
# 1. Build and push image to Google Artifact Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/sahaay-ai:latest

# 2. Deploy service to Google Cloud Run
gcloud run deploy sahaay-ai \
  --image gcr.io/YOUR_PROJECT_ID/sahaay-ai:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_production_gemini_api_key"
```

---

## 15. Demo Flow for Judges

For evaluators and hackathon judges, Sahaay AI provides pre-configured, real-world citizen personas to test the two-engine pipeline immediately:

1. **Select a Demo Persona:** On the landing page or wizard, click one of the 4 persona chips (e.g., *Ramesh Patel – Smallholder Farmer* or *Priya Sharma – Low-Income Student*).
2. **Execute Deterministic Filtering:** Click **"Find Matched Schemes"** to initiate assessment. Watch the deterministic engine instantly exclude schemes outside statutory bounds.
3. **Inspect Relevance Scores:** Review ranked results with transparent breakdown badges showing occupation match, income alignment, and vulnerability factors.
4. **Examine Gemini AI Insights:** Read the tailored *"Why Relevant"* reasoning, vital caution notices (e.g., land records linkage, Aadhaar seeding), and numbered application steps in English or Hindi.
5. **Access Official Government Portal:** Click the verified official portal link (e.g., `pmkisan.gov.in` or `scholarships.gov.in`) or print the offline document checklist.

---

## 16. Why This Architecture

Combining statutory rule evaluation with generative AI provides crucial advantages over pure LLM or pure keyword systems:

* **Predictable Eligibility Filtering:** Hard statutory limits (such as an age limit of 60 or an annual income cap of ₹2,50,000) are enforced mathematically. An LLM cannot inadvertently bypass statutory limits.
* **Explainability:** Scoring and candidate selection criteria are transparent and inspectable rather than hidden inside an opaque prompt.
* **Reduced Risk of Rule Hallucination:** Because the AI model never decides statutory eligibility and receives only validated candidates, the risk of false qualification claims is architecturally mitigated.
* **Contextual Natural-Language Guidance:** While rules provide eligibility decisions, Gemini delivers what static databases cannot: empathetic, plain-language explanations tailored to a citizen's personal context.
* **Clean Separation of Concerns:** Business logic changes in scheme rules remain in auditable JSON schemas, while prompt engineering focuses entirely on tone, clarity, and bilingual localization.

---

## 17. Project Status

Sahaay AI is currently in **Public Beta** as a social impact hackathon prototype. The platform demonstrates technical feasibility, high-assurance architecture, and bilingual civic utility. Ongoing development focuses on expanding state-specific scheme coverage, offline caching, and regional language support.

---

## 18. Disclaimer

Sahaay AI is an independent, non-governmental technological initiative designed for educational and informational purposes. Scheme guidelines, eligibility rules, funding allocations, and application deadlines are determined solely by the respective central and state government authorities. Users must verify all requirements, official notifications, and documentation on respective official portals (`.gov.in` / `.nic.in`) before submitting applications.
