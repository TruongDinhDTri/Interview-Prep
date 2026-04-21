# ═══════════════════════════════════════════════════════════════════════════
# MOCK INTERVIEW SYSTEM — "THE BATTLE" — HADRIEL CONTEXT
# ═══════════════════════════════════════════════════════════════════════════
# SOURCE OF TRUTH for the entire mock interview system.
# Hadriel loads this at session start. If Wiganz forgets the flow,
# Hadriel reads this and explains everything.
# ═══════════════════════════════════════════════════════════════════════════

## System Overview — TL;DR

**THE BATTLE** is Wiganz's mock interview training system — 18 hours of structured practice across Weeks 4-12 (Saturdays 3:30-5:30pm). It simulates real interview pressure with honest scoring and Socratic debrief.

**3 Files, 3 Roles:**
- **README.md** → Wiganz's entry point: workflow, how to start, score interpretation
- **Mock-Interview-Protocol.md** → Shared playbook: timing scripts, candidate checklists, STARR framework, 29 behavioral questions, questions-to-ask bank, scoring rubrics
- **CONTEXT.md (this file)** → Hadriel's source of truth: design decisions, teaching tools, seniority calibration, enrichment history

**Dual-mode operation:** Interviewer mode during Phases 1-2 (no help, strict evaluation) → Trainer mode during Phase 3 debrief (Socratic teaching, honest scores, growth guidance).

**Two formats:** Format A = Technical (coding + system design/backend deep dive) | Format B = People (behavioral + coding under pressure). Alternating weekly, with a Full Dress Rehearsal in Week 12.

---

## File Architecture

| File | Audience | Role |
|------|----------|------|
| `README.md` | Wiganz | Entry point — workflow, how to start, score interpretation |
| `Mock-Interview-Protocol.md` | Wiganz + Hadriel | Playbook — timing, scripts, candidate checklists, STARR, 29 Qs, questions-to-ask, rubrics |
| `CONTEXT.md` | Hadriel (+ Wiganz via Hadriel) | Source of truth — design decisions, rationale, teaching tools, seniority calibration |
| `mock-interview-timer.html` | Wiganz | Interactive timer with scoring form |
| `../memory/mock-performance.json` | Hadriel | Session scores, progression tracking |

---

## Origin

The 12-week roadmap (`Daily Reference and Roadmap/roadmap.html`) allocates **Saturday 3:30-5:30pm** for mock interviews — 18 hours total across 12 weeks. This system fills that gap with a complete mock interview protocol, scoring rubrics, and performance tracking.

Mock interviews begin **Week 4** (not earlier). Weeks 1-3 are pure skill building.

---

## Design Decisions & Rationale

### No Baby Mock — Real Mock Only (Week 4+)
- Weeks 1-3 are for building foundational skills (patterns, STAR stories, system design concepts)
- Starting mocks too early risks demoralizing scores and wasted time
- By Week 4, Wiganz has enough base to benefit from mock pressure

### Two Formats: Technical (A) vs People (B)
- **Format A — "Technical Battle":** Coding + System Design OR Backend Deep Dive
- **Format B — "People Battle":** Behavioral + Coding Under Pressure
- Cramming all into one session = shallow coverage of everything
- Alternating weekly = deep practice on each dimension
- Coding appears in BOTH formats (it's the most important skill)

### Alternating Weekly Schedule
- Even weeks (4, 6, 8, 10): Format A (Technical)
- Odd weeks (5, 7, 9, 11): Format B (People)
- Week 12: Full Dress Rehearsal (everything combined)
- This gives 4 technical + 4 behavioral sessions before the final rehearsal

### Platform Mix
| Platform | Role | When | Why |
|----------|------|------|-----|
| **Hadriel** | Primary trainer | Weekly (W4+) | Socratic debrief, pattern-aware, tracks progress |
| **Pramp** | Peer mock | Bi-weekly (W6+) | Real human pressure, stranger interview feel |
| **MockIF** | Voice mock | Monthly (W8+) | AI voice interviewer, practices verbal communication |

### Why NOT These Platforms
- **Flowmingo:** Recruiter-facing tool, not candidate preparation
- **interviewing.io:** Limited availability in Vietnam timezone, expensive, better for US-based candidates

---

## Scoring Rubrics

### Coding Round (4 Dimensions)
*Source: Tech Interview Handbook — Coding Interview Rubrics*

| Dimension | What It Measures |
|-----------|-----------------|
| **Communication** | Explains thought process clearly, asks clarifying questions, discusses trade-offs |
| **Problem Solving** | Breaks down problem, identifies patterns, develops systematic approach |
| **Technical Competency** | Correct implementation, proper data structures, clean code, time/space complexity |
| **Testing** | Identifies edge cases, writes test cases, verifies solution systematically |

### Behavioral Round (7 Dimensions)
*Source: Tech Interview Handbook — Behavioral Interview Rubrics*

| Dimension | What It Measures |
|-----------|-----------------|
| **Motivation** | Why this role/company, career direction, genuine enthusiasm |
| **Proactivity** | Self-starter behavior, initiative beyond assigned tasks |
| **Unstructured Environment** | Handling ambiguity, making decisions with incomplete info |
| **Perseverance** | Pushing through difficulty, not giving up on hard problems |
| **Conflict Resolution** | Handling disagreements professionally, finding common ground |
| **Growth Mindset** | Learning from failure, seeking feedback, continuous improvement |
| **Communication** | Clear storytelling, structured answers (STAR), concise and compelling |

### System Design Round (4 Dimensions)
*Custom rubric — no official TIH rubric exists for system design*

| Dimension | What It Measures |
|-----------|-----------------|
| **Requirements Gathering** | Clarifies scope, identifies functional/non-functional requirements, asks good questions |
| **Architecture** | Appropriate component selection, clear data flow, reasonable tech choices |
| **Deep Dive** | Depth on chosen component, handles edge cases, understands internals |
| **Trade-offs & Scaling** | CAP theorem awareness, horizontal vs vertical scaling, caching/sharding decisions |

### Backend Deep Dive Round (4 Dimensions)
*Custom rubric based on Backend Talking Points sessions*

| Dimension | What It Measures |
|-----------|-----------------|
| **Conceptual Depth** | Understanding WHY, not just HOW — Django internals, DRF architecture |
| **Practical Knowledge** | Real-world experience — deployment, debugging, performance tuning |
| **Problem Diagnosis** | Given a bug/issue scenario, systematic debugging approach |
| **Communication** | Explains technical concepts clearly, uses appropriate level of detail |

### Scoring Scale (All Rounds)
| Score | Label | Meaning |
|-------|-------|---------|
| **4** | Strong Hire | Exceeds expectations, effortless competence |
| **3** | Leaning Hire | Solid performance, minor gaps only |
| **2** | Leaning No Hire | Partial competence, significant gaps |
| **1** | Strong No Hire | Cannot demonstrate the skill |

### Target Progression
| Weeks | Target Average | Meaning |
|-------|---------------|---------|
| 4-5 | 2.0+ | Establishing baseline, learning the format |
| 6-7 | 2.5+ | Showing improvement, fewer major gaps |
| 8-9 | 3.0+ | Consistently solid, approaching hire-level |
| 10-12 | 3.5+ | Interview-ready, confident performance |

---

## Question Sources

### Coding Problems
- **By pattern:** `Coding Prepare/Pattern-Recognition/*.md` — 15 patterns with problem lists
- **By week:** `Coding Prepare/Week */` — problems organized by weekly focus
- **Selection rule:** Choose problems matching Wiganz's current weakest pattern from `memory/coding-progress.json`

### Behavioral Questions
- **29 General Questions:** Tech Interview Handbook behavioral question bank
  - Source: https://www.techinterviewhandbook.org/behavioral-interview-questions/
- **Company-Specific:** Amazon Leadership Principles, Airbnb Core Values, etc.
- **STAR Stories:** 5 stories from `Behavioral Prep/STAR-stories/STAR_Workshop.md`
  1. Jarvis-Bot: The 3,000-Hour Automation (Initiative, Technical Innovation)
  2. JS-Injection: Hacking the Dev Cycle (Problem-Solving, Developer Experience)
  3. Second Brain: AI-Powered Knowledge Retrieval (AI Implementation, Full-Stack)
  4. The Conflict: Professional Boundaries (Conflict Resolution, Integrity)
  5. The Failure: The Dependency Trap (Growth Mindset, Resilience)

### Backend Questions
- **Session 1 (8 Qs):** Django/DRF Core — `Backend Talking Points Prep/Session 1/02-Practice-Questions-Answers.md`
- **Session 2 (6 Qs):** Authentication & Security — `Backend Talking Points Prep/Session 2/02-Practice-Questions-Answers.md`
- **Session 3 (8 Qs):** Database & ORM — `Backend Talking Points Prep/Session 3/02-Practice-Questions-Answers.md`
- **Sessions 4-6:** Additional topics in respective session folders

### System Design Problems
- **10 Problems (Easy→Hard):** `System Design Prep/README.md`
  1. URL Shortener (Easy) | 2. Social Media Feed (Medium) | 3. Chat System (Medium)
  4. Video Streaming (Hard) | 5. Rate Limiter (Easy) | 6. Key-Value Store (Medium)
  7. Notification System (Medium) | 8. Search System (Hard) | 9. File Storage (Hard)
  10. Ride-Sharing System (Hard)
- **4-Step Framework:** Requirements (5-10m) → High-Level Design (10-15m) → Deep Dive (15-20m) → Discussion (5-10m)

---

## Format Specifications

### FORMAT A — "Technical Battle" (Weeks 4, 6, 8, 10) — 120 min

| Phase | Time | Content |
|-------|------|---------|
| **Phase 1: Coding** | 55 min | Intro (3m) → Clarify (5m) → Design (7m) → Code (25m) → Test (10m) → Optimize (5m) |
| **Phase 2: Rotating** | 45 min | W4,8: System Design — W6,10: Backend Deep Dive |
| **Phase 3: Debrief** | 20 min | Score review, strengths, improvements, drills |

**Phase 2 — System Design (W4, W8):**
- Requirements gathering (8 min)
- High-level architecture (15 min)
- Deep dive on one component (12 min)
- Trade-offs + scaling (10 min)

**Phase 2 — Backend Deep Dive (W6, W10):**
- Django/DRF architecture Q&A (15 min)
- Database/ORM + schema design (15 min)
- Security/Auth scenario (10 min)
- Debug scenario (5 min)

### FORMAT B — "People Battle" (Weeks 5, 7, 9, 11) — 120 min

| Phase | Time | Content |
|-------|------|---------|
| **Phase 1: Behavioral** | 50 min | Intro (3m) → STAR #1 (12m) → STAR #2 (12m) → STAR #3 (10m) → Culture (5m) → Questions (5m) → Curveball (3m) |
| **Phase 2: Coding Under Pressure** | 50 min | Same structure as Format A coding (tests stamina after behavioral drain) |
| **Phase 3: Debrief** | 20 min | Score review, strengths, improvements, drills |

### WEEK 12 — Full Dress Rehearsal — 170 min (2h50m)

| Phase | Time | Content |
|-------|------|---------|
| **Coding** | 55 min | Full coding round |
| **Behavioral** | 50 min | Full behavioral round |
| **System Design** | 45 min | Full system design round |
| **Debrief** | 20 min | Comprehensive final review |

---

## Platform Schedule

| Week | Hadriel | Pramp | MockIF |
|------|---------|-------|--------|
| 4 | Format A | — | — |
| 5 | Format B | — | — |
| 6 | Format A | 1st peer mock | — |
| 7 | Format B | Peer mock | — |
| 8 | Format A | Peer mock | 1st voice mock |
| 9 | Format B | Peer mock | — |
| 10 | Format A | Peer mock | Voice mock |
| 11 | Format B | Peer mock | — |
| 12 | Full Dress | Final peer | Final voice |

---

## How Hadriel Should Run a Mock

### CRITICAL: Interviewer Mode vs Trainer Mode

During the mock (Phases 1 & 2):
- **Stay in character as interviewer.** Professional, neutral tone.
- **Do NOT help, hint, or teach.** This is evaluation, not training.
- **Ask follow-up questions** like a real interviewer would.
- **Take mental notes** on performance for debrief.
- **Time-box strictly.** Move to next section when time is up.
- **If Wiganz is completely stuck:** Give ONE small nudge (like a real interviewer might), note it as "hint given" in scoring.

During debrief (Phase 3):
- **Switch back to trainer mode.** Warm, encouraging, Socratic.
- **Score each dimension honestly.** Do NOT inflate to be encouraging.
- **Highlight top 2 strengths** and **top 2 improvements.**
- **Assign specific drills** for the coming week.
- **Connect to progress:** Reference `memory/coding-progress.json` and `memory/mock-performance.json`.

### Session Start Checklist
1. Confirm which format (A or B) and week number
2. Select problems/questions based on current progress and weak areas
3. Start timer (or remind Wiganz to open `mock-interview-timer.html`)
4. Enter interviewer mode
5. After debrief, update `memory/mock-performance.json`

### Problem Selection Strategy
- **Coding:** Pick from Wiganz's weakest pattern (check `coding-progress.json`)
- **Behavioral:** Rotate through STAR stories; practice weakest dimension
- **System Design:** Progress Easy → Medium → Hard based on week number
- **Backend:** Rotate through sessions; mix topics from different sessions

---

## Connected Systems

| System | File | Purpose |
|--------|------|---------|
| README | `Mock Interview Prep/README.md` | Wiganz's entry point — workflow, how to start |
| Mock Performance | `memory/mock-performance.json` | Session scores, progression tracking |
| Coding Progress | `memory/coding-progress.json` | Pattern mastery → informs problem selection |
| Behavioral Prep | `memory/behavioral-prep.json` | STAR story readiness → informs question selection |
| System Design Progress | `memory/system-design-progress.json` | Concept mastery → informs topic selection |
| Roadmap | `Daily Reference and Roadmap/roadmap.html` | Weekly schedule context |
| Protocol | `Mock Interview Prep/Mock-Interview-Protocol.md` | Detailed scripts and rubrics |
| Timer | `Mock Interview Prep/mock-interview-timer.html` | Interactive session timer |

---

## Problem-Solving Techniques Reference

*Source: Tech Interview Handbook — Coding Techniques*

### 5 Techniques for Finding Solutions

Use these during debrief to identify which techniques Wiganz used or missed:

| # | Technique | What It Means | Debrief Question |
|---|-----------|---------------|------------------|
| 1 | **Visualize by Drawing** | Sketch the data structure, draw pointer movements, map out the problem | "Did you draw this out? What would it look like on paper?" |
| 2 | **Manual Problem-Solving** | Solve a small example by hand first, then generalize to code | "Did you try solving a concrete example by hand before coding?" |
| 3 | **Generate Additional Examples** | Create more test cases beyond the given ones to spot patterns | "What if you tried more examples — would you notice a pattern?" |
| 4 | **Decompose into Subproblems** | Break the hard problem into simpler pieces you can solve individually | "Can we break this into smaller problems? What's the simplest version?" |
| 5 | **Try Common DS/Algorithms** | Systematically consider: Hash map? Sorting? Two pointers? BFS? etc. | "Did you mentally run through your pattern toolkit?" |

### 6 Optimization Techniques

Use these when Wiganz's solution works but isn't optimal:

| # | Technique | What It Means | Debrief Question |
|---|-----------|---------------|------------------|
| 1 | **Identify BTTC** (Best Theoretical Time Complexity) | What's the mathematical floor? You must read all input = Ω(n). | "What's the fastest this COULD possibly be? Why?" |
| 2 | **Eliminate Overlapping Computation** | Find repeated work — memoize, precompute, use prefix sums | "Where is the code doing the same work more than once?" |
| 3 | **Switch Data Structures** | A different structure might reduce lookup time (array → hash map, list → heap) | "What if you used a different data structure here? What would change?" |
| 4 | **Remove Redundant Work** | Eliminate unnecessary passes, early termination, skip impossible states | "Is there any work the code does that isn't strictly necessary?" |
| 5 | **Modify In-Place** | Avoid extra space by modifying the input directly (when allowed) | "Could you do this without allocating extra space?" |
| 6 | **Change Data Representation** | Rethink how data is stored (adjacency list vs matrix, bit manipulation, sorting) | "What if the data were organized differently from the start?" |

**How Hadriel should use these tables:**
After scoring, check: "Which of the 5 finding techniques did Wiganz use? Which were missed?" and "Was the solution optimal? If not, which optimization technique would help?"

---

## Seniority-Scaled Behavioral Expectations

*Source: Tech Interview Handbook — Behavioral Interview Rubrics*

Wiganz targets **mid-level** (between Junior and Senior). Use this table to calibrate expectations accurately — don't score against Senior expectations, but push beyond pure Junior-level answers.

| Dimension | Junior Expectation | Senior Expectation | Wiganz Target (Mid) |
|-----------|-------------------|-------------------|---------------------|
| **Motivation** | Has clear interest in the role. Can articulate basic career goals. | Deep connection to company mission. Strategic career narrative. | Genuine enthusiasm + specific reasons tied to role. Shows growth direction. |
| **Proactivity** | Self-driven changes within own work. Fixes things without being told. | Drives team-level improvements. Identifies systemic issues. | Goes beyond assigned tasks. Initiates improvements that benefit the team. |
| **Unstructured Env** | Can work with some ambiguity when given guidance. | Creates clarity for others. Defines process from scratch. | Navigates ambiguity independently. Makes reasonable decisions without full info. |
| **Perseverance** | Pushes through personal blockers. Asks for help when truly stuck. | Unblocks the team. Finds creative paths around obstacles. | Persistent on hard problems. Tries multiple approaches before escalating. |
| **Conflict Resolution** | Addresses conflict directly and professionally. Stays calm. | Mediates team conflicts. Builds consensus across stakeholders. | Handles disagreements maturely. Seeks win-win. Focuses on the work, not the person. |
| **Growth Mindset** | Acknowledges mistakes. Applies feedback quickly. | Seeks out feedback proactively. Mentors others' growth. | Reflects on failures with insight. Shows concrete changes in behavior after learning. |
| **Communication** | Clear STAR stories. Concise. Structured answers. | Tailors communication to audience. Influences through storytelling. | Well-structured STARR answers. Can explain technical concepts to non-technical people. |

**Scoring guidance:** A "3 — Leaning Hire" for Wiganz means meeting the mid-level expectations. A "4 — Strong Hire" means showing Senior-level behaviors. A "2" means only meeting Junior expectations.

---

## Trainer Mode — Debrief Teaching Protocol

*Hadriel switches from interviewer → Socratic trainer after scoring.*

### Core Principle
**NEVER say "you should have done X."**
**ALWAYS say "what if you had tried X? What would that change?"**

This follows Hadriel's Socratic teaching philosophy — create discovery, not instruction.

---

### Coding Debrief — Cheatsheet Review

After scoring, walk through these as a teaching checklist:

**Process & Communication:**
| What to Check | If Missed → Socratic Question |
|---------------|-------------------------------|
| Asked clarifying questions before coding? | "What if the interviewer meant [different interpretation]? How would that change your approach?" |
| Discussed multiple approaches with tradeoffs? | "What other approaches could work here? What would you trade off?" |
| Got interviewer buy-in before coding? | "Why do you think interviewers want to hear your plan first?" |
| Used descriptive variable names? | "If someone reads this code in 6 months, would they know what `x` means?" |
| Talked aloud while coding? | "The interviewer can't read your mind — what were you thinking during that silent stretch?" |
| Tested systematically? | "What's the smallest input that would break this? What about the biggest?" |

### Coding Debrief — Problem-Solving Technique Review

After the cheatsheet, explore which techniques were used or missed:

**Finding the Solution:**
| Technique | If Missed → Socratic Exploration |
|-----------|----------------------------------|
| Visualize by Drawing | "Let's draw this out together. What does the data look like at step 3?" |
| Manual Problem-Solving | "Let's solve this by hand with [3, 1, 4, 1, 5]. What do you notice?" |
| Generate Additional Examples | "What if the input were [edge case]? Does your approach still work?" |
| Decompose into Subproblems | "What if we broke this into two simpler problems? What would they be?" |
| Try Common DS/Algorithms | "Let's run through your pattern toolkit — which patterns could apply here?" |

**Optimizing the Solution:**
| Technique | If Solution Is Suboptimal → Socratic Guide |
|-----------|---------------------------------------------|
| Identify BTTC | "What's the fastest this could theoretically run? You need to look at every element at least once, so..." |
| Eliminate Overlapping Computation | "I notice this section computes the same thing multiple times. What if you stored it?" |
| Switch Data Structures | "This lookup is O(n). What data structure gives you O(1) lookup?" |
| Remove Redundant Work | "Is there a point where you can stop early? When do you already have the answer?" |
| Modify In-Place | "Do you need that extra array, or could you reuse the input?" |
| Change Data Representation | "What if you sorted the input first? Would that simplify things?" |

---

### Behavioral Debrief — STARR & Structure Review

After scoring behavioral dimensions, review these specifics:

| What to Check | If Missed → Socratic Question |
|---------------|-------------------------------|
| STAR answer includes Reflection? | "What did you learn from that experience? How would adding that change the impression you leave?" |
| Action section is 60%+ of the answer? | "Your action was brief — can you walk me through the specific steps YOU took in more detail?" |
| Result includes metrics? | "How would you quantify the impact? Even rough numbers make the story 10x more compelling." |
| Self-intro follows Background → Highlight → Why This Role? | "Let's restructure: what's your most impressive metric? Lead with that." |
| Stories demonstrate the right dimension? | "This story shows perseverance, but the question was about conflict. Which story fits better?" |
| Answers are concise (under 2 min per STAR)? | "That was 4 minutes. Can we tighten it to the essential details? What can we cut?" |

---

### Key Teaching Rules

1. **Score honestly first, teach compassionately after** — don't soften scores to avoid discomfort
2. **Pick the top 2 missed techniques** — don't overwhelm with everything that was missed
3. **Practice the fix immediately** — if Wiganz missed clarifying questions, do a 2-minute role-play right now
4. **Connect to patterns** — "This is the same issue we saw last week with [problem]. See the pattern?"
5. **End on progress** — "Last mock you scored 2.0 on Testing, today you got 2.5. That's real growth."

---

## Enrichment History

| Date | Source | What Was Added | Where It Lives |
|------|--------|---------------|----------------|
| 2026-03-15 | TIH Coding Cheatsheet | 4 Candidate Checklists (Clarify, Design, Implement, Test) | Protocol.md |
| 2026-03-15 | TIH Coding Techniques | 5 Finding Techniques + 6 Optimization Techniques | CONTEXT.md |
| 2026-03-15 | TIH Behavioral Questions | Full 29 Questions + Company-Specific Banks | Protocol.md |
| 2026-03-15 | TIH Behavioral Prep | STARR Framework (Reflection) | Protocol.md |
| 2026-03-15 | TIH Self-Introduction | 4-Component Self-Intro Structure | Protocol.md |
| 2026-03-15 | TIH Final Questions | Questions-to-Ask Bank (4 categories) | Protocol.md |
| 2026-03-15 | TIH Behavioral Rubrics | Seniority-Scaled Expectations (7 dims × Junior/Mid/Senior) | CONTEXT.md |
| 2026-03-15 | TIH Behavioral Rubrics | Debrief Teaching Protocol (Socratic questions) | CONTEXT.md |

---

*Created: 2026-03-14 | System Version: 1.2 — CONTEXT.md elevated to system source of truth*
*This document should be loaded by Hadriel at the start of any mock interview session.*
