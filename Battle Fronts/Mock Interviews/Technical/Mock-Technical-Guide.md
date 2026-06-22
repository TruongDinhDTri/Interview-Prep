# ⚙️ Mock Technical Interview — Isolated Runbook

Run a **Technical-only** mock with Hadriel — the domain-knowledge fight (Backend / Frontend), separate
from coding and system design. Extracted from the combined battle so you can drill ONE domain alone.

> **Trigger:** *"Hadriel, let's do a technical mock"* (defaults to Backend) ·
> *"...technical mock — frontend"* for the Frontend track.
> **Rubric source:** `../CONTEXT.md` (Backend Deep Dive Round) · **Full playbook:** `../Mock-Interview-Protocol.md`

---

# 🐍 BACKEND TRACK (Django / DRF)

## ⏱️ Structure (45 min)

| Step | Time | What Happens |
|------|------|-------------|
| **Django/DRF architecture Q&A** | 15 min | Project structure, ViewSets vs APIViews, serializers, middleware |
| **Database/ORM + schema design** | 15 min | Schema design, N+1, indexing, migrations, normalization |
| **Security/Auth scenario** | 10 min | JWT flow, CORS/CSRF, SQL injection, OAuth 2.0 |
| **Debug scenario** | 5 min | "Your API is returning 500 errors. Walk me through debugging." |

**Opening script:**
> "I'd like to dive into your backend experience. We'll cover Django architecture, database design, security, and debugging. Let's start with how you structure a Django project."

## 🎯 Question Sources & Samples

Pull from `../../Technical/Backend/Session N/02-Practice-Questions-Answers.md` (Sessions 1-8).

- **Django/DRF Architecture:** project structure with multiple apps · ViewSets vs APIViews · DRF request lifecycle (Models → Serializers → Views → URLs) · WSGI & deployment
- **Database/ORM:** schema design for a scenario · identify & fix N+1 · when to denormalize · indexing strategy for a production table
- **Security/Auth:** JWT flow in DRF · OWASP Top 10 hardening · CORS vs CSRF · "Login with Google" (OAuth 2.0)
- **Debug:** "intermittent 500 errors — how do you investigate?" · "a 50ms query now takes 5s — what happened?"

## 📊 Scoring Rubric — Backend Deep Dive (4 Dimensions)
*Custom rubric based on Backend Talking Points sessions. Source of truth: `../CONTEXT.md`.*

| Dimension | 4 — Strong Hire | 3 — Leaning Hire | 2 — Leaning No Hire | 1 — Strong No Hire |
|-----------|----------------|------------------|---------------------|-------------------|
| **Conceptual Depth** | Explains WHY, not just HOW. Understands Django internals. | Solid understanding. Knows the right tools. | Surface-level. Follows tutorials but doesn't understand underlying concepts. | Cannot explain basic Django/DRF concepts. |
| **Practical Knowledge** | Real-world war stories. Production debugging experience. | Good practical sense. Reasonable approaches. | Textbook answers only. No production experience evident. | Cannot connect concepts to real scenarios. |
| **Problem Diagnosis** | Systematic debugging. Considers multiple root causes. Uses proper tools. | Can diagnose with some guidance. Reasonable approach. | Guesses randomly. No systematic method. | Cannot begin to diagnose. |
| **Communication** | Explains technical concepts clearly at appropriate level. | Clear enough. Gets the point across. | Confusing explanations. Jargon without understanding. | Cannot explain technical concepts. |

---

# 🎨 FRONTEND TRACK (React / Web)

## ⏱️ Structure (~45 min)
Question sources: `../../Technical/Frontend/` (Performance Optimization session, growing).

| Step | Time | What Happens |
|------|------|-------------|
| **Component design exercise** | 15 min | Design a reusable UI component (autocomplete, modal, carousel). Props/state boundaries, API. |
| **State management + data flow** | 12 min | Where state lives, local vs global, data flow through the tree. |
| **Rendering & performance** | 10 min | Re-renders, memoization, bundle size, Core Web Vitals, loading states. |
| **API integration scenario** | 8 min | Fetch + render data: loading/error/empty states, caching, race conditions. |

**Opening script:**
> "Let's go deep on your frontend. We'll design a component, talk state and data flow, performance, and how you wire up data. Start by designing [component] — ask me anything about requirements first."

## 📊 Scoring Rubric — Frontend Deep Dive (4 Dimensions)
*Custom rubric (Wiganz's 4 picks), grounded in GreatFrontEnd's front-end evaluation axes. Source of truth: `../CONTEXT.md`.*

| Dimension | 4 — Strong Hire | 3 — Leaning Hire | 2 — Leaning No Hire | 1 — Strong No Hire |
|-----------|----------------|------------------|---------------------|-------------------|
| **Component Design** | Cleanly composed, reusable components with clear responsibilities & prop/state boundaries; designs for extension. | Reasonable breakdown; mostly clear responsibilities, minor coupling. | Monolithic/muddled components; unclear boundaries; little reuse. | Cannot decompose a UI into sensible components. |
| **State Management** | Right state location (local/lifted/global) with clean data flow; justifies tool choice; avoids prop-drilling & over-globalizing. | Workable state model; reasonable choices, minor redundancy. | Confused data flow; over-uses global state or prop-drills; bugs. | No coherent state model; can't reason about where state lives. |
| **Rendering & Performance** | Proactively reasons about re-renders, memoization, bundle size, Core Web Vitals; handles loading/empty states. | Aware of perf issues; applies common fixes when prompted. | Limited awareness; needless re-renders go unnoticed. | No understanding of rendering behavior or performance. |
| **API Integration** | Robust data fetching — loading/error/empty states, caching, race-condition & retry handling. | Fetches correctly; handles main loading/error states; minor gaps. | Happy-path only; ignores errors and race conditions. | Cannot integrate or reason about async data. |

---

## 📊 Scoring Scale & Targets (both tracks)
**Scale:** 4 = Strong Hire · 3 = Leaning Hire · 2 = Leaning No Hire · 1 = Strong No Hire.
**Targets:** Wk 4-5 → 2.0+ · Wk 6-7 → 2.5+ · Wk 8-9 → 3.0+ · Wk 10-12 → 3.5+ (interview-ready).

## 📝 Debrief Template (Hadriel switches to trainer mode after the mock)

```markdown
## ⚙️ Mock Technical Debrief — [Date] — [Backend / Frontend]

### Scores (1-4)
| Dimension | Score | Notes |
|-----------|-------|-------|
| … | [ ] | |
| **Average** | **[ ]** | |

### 💪 Strengths · ⚠️ Improvements · 🎯 Drills before next mock
```

## 🚀 How to Run with Hadriel
Say **"Hadriel, let's do a technical mock"** (Backend) or **"...technical mock — frontend."**
Hadriel runs the round in **interviewer mode** (no teaching, hints cost score), then debriefs with
honest scores + drills, tracked in `../../../memory/mock-performance.json`.
