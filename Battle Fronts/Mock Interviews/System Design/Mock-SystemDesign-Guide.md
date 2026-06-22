# 🏗️ Mock System Design Interview — Isolated Runbook

Run a **System-Design-only** mock with Hadriel. This is the focused single-domain fight — extracted
from the combined battle so you can drill System Design alone.

> **Trigger:** say *"Hadriel, let's do a system design mock."*
> **Rubric source:** `../CONTEXT.md` (System Design Round) · **Full combined playbook:** `../Mock-Interview-Protocol.md`

---

## ⏱️ Structure (45 min) — the 4-Step Framework

| Step | Time | What Happens |
|------|------|-------------|
| **Requirements gathering** | 8 min | Clarify scope, users, scale. Functional vs non-functional requirements. |
| **High-level architecture** | 15 min | Draw components: Client → LB → API → DB → Cache. Data flow. |
| **Deep dive on one component** | 12 min | Pick the hardest/most interesting component. Go deep. |
| **Trade-offs + scaling** | 10 min | CAP theorem. Horizontal vs vertical. Caching strategy. Failure modes. |

> Framework shorthand: **Requirements → High-Level Design → Deep Dive → Trade-offs & Scaling.**

---

## 🎬 Interviewer Scripts

**Opening:**
> "Let's design [system]. You have about 45 minutes. Start by asking me any questions about what we're building."

**Nudge to move on:**
> "That's a solid start on requirements. Let's move to the high-level architecture."

**If stuck (>5 min no progress):**
> "What's the single most important thing this system must do well? Start there."
> *(Note as "hint given" — affects the score.)*

**Time warning (2 min left in a step):**
> "Let's lock this in and move to [next step]."

---

## 🎯 Problem Selection

Pull from `../../System Design/` chapters + `../../System Design/Common Questions/`. 10 problems (Easy→Hard):

| # | Problem | Level | | # | Problem | Level |
|---|---------|-------|--|---|---------|-------|
| 1 | URL Shortener | Easy | | 6 | Key-Value Store | Medium |
| 2 | Social Media Feed | Medium | | 7 | Notification System | Medium |
| 3 | Chat System | Medium | | 8 | Search System | Hard |
| 4 | Video Streaming | Hard | | 9 | File Storage | Hard |
| 5 | Rate Limiter | Easy | | 10 | Ride-Sharing System | Hard |

**Suggested by week:** Week 4 → URL Shortener / Rate Limiter (Easy) · Week 8 → Chat System / Key-Value Store (Medium).

---

## 📊 Scoring Rubric — System Design Round (4 Dimensions)
*Custom rubric — no official TIH rubric exists for system design. Source of truth: `../CONTEXT.md`.*

| Dimension | 4 — Strong Hire | 3 — Leaning Hire | 2 — Leaning No Hire | 1 — Strong No Hire |
|-----------|----------------|------------------|---------------------|-------------------|
| **Requirements** | Asks excellent clarifying Qs. Identifies non-functional reqs unprompted. | Good questions. Covers main requirements. | Misses key requirements. Needs prompting. | Jumps to design without clarifying. |
| **Architecture** | Clear, appropriate components. Good data flow. Justifies choices. | Reasonable architecture. Minor gaps. | Missing key components. Unclear data flow. | No coherent architecture. |
| **Deep Dive** | Expert-level depth on chosen component. Handles edge cases. | Good depth. Understands internals. | Surface-level only. Cannot go deeper when probed. | Cannot explain any component in depth. |
| **Trade-offs** | Proactively discusses CAP, scaling, failure modes. Multiple options. | Discusses trade-offs when asked. Reasonable analysis. | Limited awareness. One-dimensional thinking. | No understanding of trade-offs or scaling. |

**Scale:** 4 = Strong Hire · 3 = Leaning Hire · 2 = Leaning No Hire · 1 = Strong No Hire.
**Targets:** Wk 4-5 → 2.0+ · Wk 6-7 → 2.5+ · Wk 8-9 → 3.0+ · Wk 10-12 → 3.5+ (interview-ready).

---

## 📝 Debrief Template (after the mock — Hadriel switches to trainer mode)

```markdown
## 🏗️ Mock System Design Debrief — [Date] — [System designed]

### Scores (1-4)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Requirements | [ ] | |
| Architecture | [ ] | |
| Deep Dive | [ ] | |
| Trade-offs | [ ] | |
| **Average** | **[ ]** | |

### 💪 Top 2 Strengths
1. …
2. …

### ⚠️ Top 2 Improvements
1. …
2. …

### 🎯 Drills Before Next Mock
- [ ] …
```

---

## 🚀 How to Run with Hadriel

Say: **"Hadriel, let's do a system design mock."**

Hadriel will:
1. Pick a problem suited to your level (or take your request).
2. Run the 45-min 4-step framework in **interviewer mode** — no teaching, hints cost score.
3. Probe your weakest step (usually Deep Dive or Trade-offs).
4. Switch to trainer mode and debrief with honest scores + drills.
5. Track scores in `../../../memory/mock-performance.json`.

> Optional: *"system design mock — [specific system]"* to drill a chosen problem.
