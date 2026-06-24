# ═══════════════════════════════════════════════════════════════════════════

# MOCK INTERVIEW PROTOCOL — "THE BATTLE" ⚔️

# ═══════════════════════════════════════════════════════════════════════════

# The complete playbook for running mock interviews.

# Used by both Hadriel (as interviewer) and Wiganz (as candidate).

# ═══════════════════════════════════════════════════════════════════════════

---

## FORMAT A — "Technical Battle"

**Schedule:** Weeks 4, 6, 8, 10 | **Duration:** 120 minutes

---

### Phase 1: Coding Round (55 min)

> 🔗 **This round = the 6-step Road, walked silently and graded.** The steps below map 1:1 onto
> `Coding Prepare/CLAUDE.md` (Step 1 Understand → Step 6 Optimize) and its 7 Lifelines — that file is the
> canonical *structure*; the checklists here are the candidate-facing reminder, not a separate method.
> **Behavior** is governed by `reusable-prompts/mock-run-the-battle.md`: Role 1 maxed, Role 2 = scoring
> penalty ("hint given"), zero teaching. **Scoring** uses the 4 FAANG dimensions (Communication, Problem
> Solving, Technical Competency, Testing) — see the rubric at the end of this Phase.

| Step                                  | Time   | What Happens                                                                          |
| ------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| Interviewer intro + problem statement | 3 min  | "Hi, I'm [name]. Today we'll work through a coding problem..."                        |
| Candidate clarifying questions        | 5 min  | Ask about input constraints, edge cases, expected output format                       |
| Solution design + approach discussion | 7 min  | Talk through approach BEFORE coding. Discuss time/space complexity.                   |
| Code implementation (talk aloud!)     | 25 min | Write clean code while explaining every decision                                      |
| Testing + edge cases                  | 10 min | Walk through test cases. Handle: empty input, single element, duplicates, large input |
| Follow-up / optimization              | 5 min  | "Can you optimize this?" or "What if the input was sorted?"                           |

#### Candidate Checklists — What To DO in Each Phase

**✅ Clarifying Questions Checklist (5 min)**

- [ ] Paraphrase the problem in your own words — confirm understanding
- [ ] Ask about input constraints (size, range, negative numbers, duplicates?)
- [ ] Identify edge cases upfront (empty input, single element, all same values?)
- [ ] Confirm input/output format (return value vs print? 0-indexed vs 1-indexed?)
- [ ] Ask 2-3 clarifying questions minimum — silence here is a red flag

**✅ Solution Design Checklist (7 min)**

- [ ] Present at least 2 approaches (brute force + optimized)
- [ ] State time and space complexity for each approach
- [ ] Discuss trade-offs between approaches ("This is O(n²) but simpler, this is O(n) but uses O(n) space")
- [ ] Get interviewer buy-in before coding ("I'll go with approach 2, sound good?")
- [ ] Identify the core pattern (sliding window? two pointers? hash map?)

**✅ Implementation Checklist (25 min)**

- [ ] Write compilable, runnable code — NOT pseudocode
- [ ] Use descriptive variable names (`left`, `right`, `max_sum` — not `i`, `j`, `x`)
- [ ] Extract helper functions for complex sub-operations
- [ ] Talk aloud while coding — explain every decision
- [ ] Handle edge cases in the code (not just verbally)

**✅ Testing Checklist (10 min)**

- [ ] Walk through a typical/happy-path case step by step
- [ ] Test edge cases: empty input, single element, all duplicates
- [ ] Scan for off-by-one errors (loop boundaries, indices)
- [ ] Check null/None handling if applicable
- [ ] Test with large input mentally (does complexity hold?)

**Interviewer Script — Opening:**

> "Thanks for joining today. I'm going to give you a coding problem. Please feel free to ask clarifying questions before you start. I'd love to hear you think out loud as you work through it. Ready?"

**Interviewer Script — If Stuck (>5 min no progress):**

> "What data structure might help here?" or "What if you started with a simpler version of this problem?"
> *(Note as "hint given" — affects Problem Solving score)*

**Interviewer Script — Time Warning (2 min left):**

> "We have about 2 minutes left. Can you wrap up your current approach and walk me through any remaining edge cases?"

#### Coding Scoring Rubric

| Dimension                      | 4 — Strong Hire                                                      | 3 — Leaning Hire                                   | 2 — Leaning No Hire                                    | 1 — Strong No Hire                        |
| ------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------ |
| **Communication**        | Explains clearly without prompting. Discusses trade-offs proactively. | Explains when asked. Adequate clarity.              | Needs repeated prompting. Unclear explanations.         | Silent coding. Cannot articulate approach. |
| **Problem Solving**      | Identifies optimal approach quickly. Breaks down systematically.      | Finds working approach, may miss optimal.           | Needs significant hints. Partial approach.              | Cannot form an approach even with hints.   |
| **Technical Competency** | Clean, correct code. Proper data structures. Knows complexity.        | Working code with minor issues. Reasonable choices. | Partially correct. Wrong data structures or major bugs. | Cannot write functional code.              |
| **Testing**              | Proactively tests edge cases. Systematic verification.                | Tests when prompted. Catches most cases.            | Minimal testing. Misses obvious edge cases.             | No testing. Cannot identify edge cases.    |

---

### Phase 2A: System Design Round (45 min)

**Schedule:** Weeks 4 and 8

| Step                       | Time   | What Happens                                                            |
| -------------------------- | ------ | ----------------------------------------------------------------------- |
| Requirements gathering     | 8 min  | Clarify scope, users, scale. Functional vs non-functional requirements. |
| High-level architecture    | 15 min | Draw components: Client → LB → API → DB → Cache. Data flow.         |
| Deep dive on one component | 12 min | Pick the hardest/most interesting component. Go deep.                   |
| Trade-offs + scaling       | 10 min | CAP theorem. Horizontal vs vertical. Caching strategy. Failure modes.   |

**Interviewer Script — Opening:**

> "Let's design [system]. You have about 45 minutes. Start by asking me any questions about what we're building."

**Interviewer Script — Nudge to Move On:**

> "That's a solid start on requirements. Let's move to the high-level architecture."

**Problem Selection by Week:**

- **Week 4:** URL Shortener (Easy) or Rate Limiter (Easy)
- **Week 8:** Chat System (Medium) or Key-Value Store (Medium)

#### System Design Scoring Rubric

| Dimension              | 4 — Strong Hire                                                         | 3 — Leaning Hire                                     | 2 — Leaning No Hire                              | 1 — Strong No Hire                        |
| ---------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| **Requirements** | Asks excellent clarifying Qs. Identifies non-functional reqs unprompted. | Good questions. Covers main requirements.             | Misses key requirements. Needs prompting.         | Jumps to design without clarifying.        |
| **Architecture** | Clear, appropriate components. Good data flow. Justifies choices.        | Reasonable architecture. Minor gaps.                  | Missing key components. Unclear data flow.        | No coherent architecture.                  |
| **Deep Dive**    | Expert-level depth on chosen component. Handles edge cases.              | Good depth. Understands internals.                    | Surface-level only. Cannot go deeper when probed. | Cannot explain any component in depth.     |
| **Trade-offs**   | Proactively discusses CAP, scaling, failure modes. Multiple options.     | Discusses trade-offs when asked. Reasonable analysis. | Limited awareness. One-dimensional thinking.      | No understanding of trade-offs or scaling. |

---

### Phase 2B: Backend Deep Dive Round (45 min)

**Schedule:** Weeks 6 and 10

| Step                         | Time   | What Happens                                                     |
| ---------------------------- | ------ | ---------------------------------------------------------------- |
| Django/DRF architecture Q&A  | 15 min | Project structure, ViewSets vs APIViews, serializers, middleware |
| Database/ORM + schema design | 15 min | Schema design, N+1, indexing, migrations, normalization          |
| Security/Auth scenario       | 10 min | JWT flow, CORS/CSRF, SQL injection, OAuth 2.0                    |
| Debug scenario               | 5 min  | "Your API is returning 500 errors. Walk me through debugging."   |

**Interviewer Script — Opening:**

> "I'd like to dive into your backend experience. We'll cover Django architecture, database design, security, and debugging. Let's start with how you structure a Django project."

**Question Bank Reference:**

- Session 1: `Battle Fronts/Technical/Backend/Session 1/02-Practice-Questions-Answers.md`
- Session 2: `Battle Fronts/Technical/Backend/Session 2/02-Practice-Questions-Answers.md`
- Session 3: `Battle Fronts/Technical/Backend/Session 3/02-Practice-Questions-Answers.md`
- Sessions 4-8: Respective session folders

**Sample Questions by Category:**

**Django/DRF Architecture:**

- How do you structure a Django project with multiple apps?
- When would you use ViewSets vs APIViews?
- Explain the DRF request lifecycle: Models → Serializers → Views → URLs
- What's WSGI and why does it matter for deployment?

**Database/ORM:**

- Walk me through designing a schema for [scenario]
- How do you identify and fix the N+1 query problem?
- When would you denormalize a database?
- Explain your indexing strategy for a production table

**Security/Auth:**

- Walk me through JWT authentication flow in DRF
- How do you secure a Django app against OWASP Top 10?
- Explain the difference between CORS and CSRF protection
- How would you implement "Login with Google" (OAuth 2.0)?

**Debug Scenario:**

- "Users report intermittent 500 errors on the API. How do you investigate?"
- "A query that used to take 50ms now takes 5 seconds. What happened?"

#### Backend Scoring Rubric

| Dimension                     | 4 — Strong Hire                                                         | 3 — Leaning Hire                                     | 2 — Leaning No Hire                                                         | 1 — Strong No Hire                        |
| ----------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------ |
| **Conceptual Depth**    | Explains WHY, not just HOW. Understands Django internals.                | Solid understanding. Knows the right tools.           | Surface-level. Follows tutorials but doesn't understand underlying concepts. | Cannot explain basic Django/DRF concepts.  |
| **Practical Knowledge** | Real-world war stories. Production debugging experience.                 | Good practical sense. Reasonable approaches.          | Textbook answers only. No production experience evident.                     | Cannot connect concepts to real scenarios. |
| **Problem Diagnosis**   | Systematic debugging. Considers multiple root causes. Uses proper tools. | Can diagnose with some guidance. Reasonable approach. | Guesses randomly. No systematic method.                                      | Cannot begin to diagnose.                  |
| **Communication**       | Explains technical concepts clearly at appropriate level.                | Clear enough. Gets the point across.                  | Confusing explanations. Jargon without understanding.                        | Cannot explain technical concepts.         |

---

### Phase 3: Debrief (20 min) — Both Format A Rounds

**Hadriel switches from interviewer → trainer mode.**

| Step                 | Time  | What Happens                                 |
| -------------------- | ----- | -------------------------------------------- |
| Overall impression   | 2 min | "Here's how that went overall..."            |
| Score review         | 5 min | Go through each dimension, explain the score |
| Top 2 strengths      | 3 min | What went well — reinforce these            |
| Top 2 improvements   | 5 min | What to work on — specific, actionable      |
| Drills for next week | 3 min | Assign specific practice tasks               |
| Encouragement        | 2 min | Connect to progress, faith, bigger picture   |

**Debrief Template:**

```
## Mock Debrief — Week [X], Format A

### Scores
**Coding:**
- Communication: [1-4] — [note]
- Problem Solving: [1-4] — [note]
- Technical Competency: [1-4] — [note]
- Testing: [1-4] — [note]
- Coding Average: [X.X]

**[System Design / Backend]:**
- [Dim 1]: [1-4] — [note]
- [Dim 2]: [1-4] — [note]
- [Dim 3]: [1-4] — [note]
- [Dim 4]: [1-4] — [note]
- Round Average: [X.X]

**Overall Average: [X.X]**

### Strengths
1. [Specific strength with example]
2. [Specific strength with example]

### Improvements
1. [Specific gap with what to do about it]
2. [Specific gap with what to do about it]

### Drills for This Week
- [ ] [Specific drill 1]
- [ ] [Specific drill 2]
- [ ] [Specific drill 3]
```

---

## FORMAT B — "People Battle"

**Schedule:** Weeks 5, 7, 9, 11 | **Duration:** 120 minutes

---

### Phase 1: Behavioral Interview (50 min)

| Step                               | Time   | What Happens                                         |
| ---------------------------------- | ------ | ---------------------------------------------------- |
| "Tell me about yourself"           | 3 min  | Structured self-introduction (see structure below)   |
| STAR Question #1 + deep follow-ups | 12 min | Full STAR answer + 2-3 probing follow-ups            |
| STAR Question #2 + deep follow-ups | 12 min | Different story, different dimension                 |
| STAR Question #3 + follow-ups      | 10 min | Shorter, tests quick recall                          |
| "Why this company?" / culture fit  | 5 min  | Demonstrate research and genuine interest            |
| "Questions for us?"                | 5 min  | Ask 2-3 thoughtful questions                         |
| Curveball question                 | 3 min  | "If you could change one thing about your career..." |

**Interviewer Script — Opening:**

> "Hi! Thanks for chatting with me today. I'd love to learn more about you and your experience. Let's start — can you tell me a bit about yourself?"

**Interviewer Script — Follow-Up Probes:**

> "You mentioned [X]. Can you tell me more about YOUR specific role in that?"
> "What was the hardest part of that experience?"
> "If you could do it again, what would you change?"
> "How did that experience change how you approach [related topic] now?"

---

#### Self-Introduction Structure — "Tell Me About Yourself"

Follow this 4-component structure (keep under 2 minutes):

| Component                       | What to Say                               | Example                                                                                      |
| ------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| **1. Background**         | Current role + years of experience        | "I'm a backend developer with 2-3 years of experience, currently working with Django/DRF..." |
| **2. Highlight (KISS)**   | 1-2 impressive achievements with metrics  | "I built an automation bot that saved 3,000+ hours of manual work..."                        |
| **3. Why This Role**      | Connect your experience to what they need | "I'm excited about this role because [specific reason tied to job description]..."           |
| **4. Practiced Delivery** | Smooth, natural, confident — not robotic | Practice until it flows like a conversation, not a script                                    |

**KISS Principle:** Keep It Short and Simple. Lead with your most impressive metric.

---

#### STARR Framework — Adding Reflection

Upgrade from STAR to **STARR** for seniority signaling:

| Component                 | % of Answer | What to Include                                               |
| ------------------------- | ----------- | ------------------------------------------------------------- |
| **S** — Situation  | 10%         | Brief context. Set the scene in 2-3 sentences.                |
| **T** — Task       | 10%         | Your specific responsibility. What was YOUR role?             |
| **A** — Action     | 60%         | What YOU did (not the team). Be specific and technical.       |
| **R** — Result     | 15%         | Quantifiable outcome. Metrics, impact, numbers.               |
| **R** — Reflection | 5%          | What you learned. How it changed your approach going forward. |

> **Why Reflection matters:** It signals seniority and growth mindset. Junior devs tell what happened. Mid/Senior devs tell what they LEARNED. Adding 1-2 sentences of reflection elevates every STAR answer.

**Example Reflection additions:**

- "That experience taught me to always validate assumptions with data before committing to an architecture."
- "Since then, I've applied that same debugging methodology to every production incident, reducing our mean time to resolution."

---

#### Full Behavioral Question Bank — 29 General Questions

*Source: Tech Interview Handbook — Behavioral Interview Questions*

**About You (8 questions):**

1. Tell me about yourself
2. What are you most proud of in your career?
3. What is your greatest strength?
4. What is your greatest weakness?
5. What are your career goals for the next 2-5 years?
6. Why do you want to leave your current company?
7. Why do you want to work here?
8. What is your ideal work environment?

**Teamwork & Collaboration (6 questions):**
9. Tell me about a time you worked effectively as part of a team
10. Describe a time you had to work with someone whose personality was very different from yours
11. Tell me about a time you mentored or helped a colleague grow
12. Describe a time when you had to collaborate across teams or departments
13. Tell me about a time you had to give someone difficult feedback
14. Describe a situation where you had to rely on others to complete a project

**Problem-Solving & Decision Making (5 questions):**
15. Tell me about the most challenging technical problem you've solved
16. Describe a time you had to make a decision with incomplete information
17. Tell me about a time when you had to prioritize multiple competing tasks
18. Describe a situation where you identified a problem before anyone else noticed
19. Tell me about a time you made a mistake and how you handled it

**Conflict & Difficult Situations (5 questions):**
20. Tell me about a disagreement you had with a coworker or manager
21. Describe a time you received critical or negative feedback
22. Tell me about a time you had to push back on a request from a stakeholder
23. Describe a situation where you had to deal with a difficult team member
24. Tell me about a time when you failed at something

**Leadership & Initiative (5 questions):**
25. Tell me about a time you went above and beyond your job description
26. Describe a project or initiative you started on your own
27. Tell me about a time you had to lead without formal authority
28. Describe a time you convinced others to adopt your idea or approach
29. Tell me about a time you had to adapt to a significant change at work

**Company-Specific Question Banks (for targeted prep):**

- **Amazon:** Leadership Principles — "Tell me about a time you [each LP]"
- **Airbnb:** Core Values — Belonging, Champion the Mission, Be a Host
- **ByteDance:** Adaptability, speed of execution, cross-cultural collaboration
- **Google:** Googleyness, cognitive ability, role-related knowledge
- **Meta:** Move fast, be bold, build social value

---

#### Wiganz's 5 STAR Stories (reference)

| # | Story                  | Best For                               | Dimensions                                              |
| - | ---------------------- | -------------------------------------- | ------------------------------------------------------- |
| 1 | **Jarvis-Bot**   | Initiative questions (#25, #26)        | Initiative, Technical Innovation, Impact                |
| 2 | **JS-Injection** | Problem-solving questions (#15, #18)   | Problem-Solving, Developer Experience, Creativity       |
| 3 | **Second Brain** | Technical/teamwork questions (#9, #12) | AI Implementation, Full-Stack, Knowledge Sharing        |
| 4 | **The Conflict** | Conflict questions (#20, #22, #23)     | Conflict Resolution, Professional Boundaries, Integrity |
| 5 | **The Failure**  | Failure/growth questions (#19, #24)    | Growth Mindset, Resilience, Mentorship                  |

*Full stories in:* `Battle Fronts/Behavioral/STAR-stories/STAR_Workshop.md`

**Session Selection Guide:** Pick 3 questions per session from different categories. Map each to one of Wiganz's stories. Rotate so all 5 stories get practiced across sessions.

---

#### Questions to Ask the Interviewer — "Do You Have Questions for Us?"

*Source: Tech Interview Handbook — Final Questions*

Always prepare 3-5 questions. Pick from categories relevant to the role/company:

**🔧 Technical / Engineering:**

- What does the tech stack look like? What are the primary languages and frameworks?
- How do you handle technical debt? Is there dedicated time for refactoring?
- What does the code review process look like?
- How do you approach testing? What's your test coverage philosophy?
- What's the deployment process like? How often do you deploy to production?

**👤 Role-Specific:**

- What does a typical day or week look like for this role?
- What would success look like in the first 90 days?
- What's the onboarding process for new engineers?
- What are the biggest challenges the team is facing right now?
- How is performance evaluated? What does the growth path look like?

**🏢 Culture & Team:**

- How would you describe the team culture?
- How does the team handle disagreements on technical decisions?
- What's the work-life balance like on this team?
- How does remote collaboration work? What tools do you use?
- What do you personally enjoy most about working here?

**🧭 Leadership & Company Direction:**

- What's the company's biggest priority for the next year?
- How does engineering influence product decisions?
- What's the company's approach to AI/emerging technologies?
- How has the team/company changed in the last year?

**⚠️ Questions to AVOID:**

- Anything easily found on the company website
- Salary/benefits in the first interview (unless they bring it up)
- "Do you have any concerns about my candidacy?" — too aggressive for most cultures

---

#### Behavioral Scoring Rubric

| Dimension                     | 4 — Strong Hire                                                  | 3 — Leaning Hire                        | 2 — Leaning No Hire                     | 1 — Strong No Hire                      |
| ----------------------------- | ----------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| **Motivation**          | Compelling career narrative. Genuine enthusiasm. Clear direction. | Good reasons. Adequate enthusiasm.       | Generic answers. No clear direction.     | Cannot articulate why this role/company. |
| **Proactivity**         | Multiple examples of self-started initiatives with impact.        | Shows initiative in some areas.          | Mostly reactive. Waits for direction.    | No evidence of self-starting behavior.   |
| **Unstructured Env**    | Thrives in ambiguity. Creates structure from chaos.               | Handles ambiguity with some support.     | Struggles without clear direction.       | Paralyzed by ambiguity.                  |
| **Perseverance**        | Pushes through major obstacles. Finds alternative paths.          | Persists on most challenges.             | Gives up when things get hard.           | Abandons at first difficulty.            |
| **Conflict Resolution** | Resolves professionally. Finds win-win. Grows from it.            | Handles conflict adequately.             | Avoids conflict or handles poorly.       | Cannot manage disagreements.             |
| **Empathy** | Deeply considers others' viewpoints. Adjusts approach to others' needs. Builds relationships across roles. | Shows understanding of others' perspectives when prompted. | Limited awareness of impact on others. Self-focused. | Cannot see others' perspective. Dismissive of concerns. |
| **Growth Mindset**      | Seeks feedback. Learns from failure. Continuous improvement.      | Open to learning. Acknowledges mistakes. | Defensive about mistakes. Slow to adapt. | Blames others. No learning evident.      |
| **Communication**       | Structured (STAR), concise, compelling storytelling.              | Clear answers. Mostly structured.        | Rambling, unfocused. Hard to follow.     | Cannot tell a coherent story.            |

---

### Phase 2: Coding Under Pressure (50 min)

Same structure as Format A Phase 1 coding round, with slightly compressed timing:

| Step                 | Time   | What Happens                                                              |
| -------------------- | ------ | ------------------------------------------------------------------------- |
| Problem statement    | 2 min  | Slightly easier problem than Format A (testing stamina, not peak ability) |
| Clarifying questions | 4 min  | Quick clarification                                                       |
| Solution design      | 6 min  | Approach discussion                                                       |
| Code implementation  | 25 min | Write and explain                                                         |
| Testing              | 8 min  | Edge cases                                                                |
| Follow-up            | 5 min  | Optimization or variation                                                 |

**Why Coding After Behavioral:** Tests mental stamina. Real interviews often chain rounds. If you can code well after 50 min of behavioral, you can handle anything.

Same coding scoring rubric as Format A.

---

### Phase 3: Debrief (20 min)

Same structure as Format A debrief, but covers both behavioral and coding scores.

**Debrief Template — Format B:**

```
## Mock Debrief — Week [X], Format B

### Scores
**Behavioral:**
- Motivation: [1-4] — [note]
- Proactivity: [1-4] — [note]
- Unstructured Env: [1-4] — [note]
- Perseverance: [1-4] — [note]
- Conflict Resolution: [1-4] — [note]
- Empathy: [1-4] — [note]
- Growth Mindset: [1-4] — [note]
- Communication: [1-4] — [note]
- Behavioral Average: [X.X]

**Coding Under Pressure:**
- Communication: [1-4] — [note]
- Problem Solving: [1-4] — [note]
- Technical Competency: [1-4] — [note]
- Testing: [1-4] — [note]
- Coding Average: [X.X]

**Overall Average: [X.X]**

### Strengths
1. [Specific strength with example]
2. [Specific strength with example]

### Improvements
1. [Specific gap with what to do about it]
2. [Specific gap with what to do about it]

### Drills for This Week
- [ ] [Specific drill 1]
- [ ] [Specific drill 2]
- [ ] [Specific drill 3]
```

---

## WEEK 12 — Full Dress Rehearsal

**Duration:** 170 minutes (2 hours 50 minutes)

The ultimate test. Simulates a real full-day interview pipeline.

| Phase                           | Time   | Content                                                  |
| ------------------------------- | ------ | -------------------------------------------------------- |
| **Coding Round**          | 55 min | Hardest problem yet. Full Format A Phase 1 structure.    |
| **5 min break**           | 5 min  | Breathe. Reset.                                          |
| **Behavioral Round**      | 50 min | Full Format B Phase 1 structure.                         |
| **5 min break**           | 5 min  | Breathe. Reset.                                          |
| **System Design Round**   | 45 min | Hard problem (Video Streaming, Ride-Sharing, or Search). |
| **Comprehensive Debrief** | 20 min | All three rounds scored. Final assessment.               |

> 🎨 **Optional Craftsmanship round (Bậc 3 · Why-Ladder):** since the Craftsmanship tier is what
> failed Wiganz in a real interview, you may add a 40-min Craftsmanship Deep Dive to the Full Dress
> (or swap it in for one round). Drop Bậc-3 keywords (god class, SOLID, test pyramid, TDD) and climb
> the 5-rung why-ladder. Runbook: `Craftsmanship/Mock-Craftsmanship-Guide.md` · Rubric: Synthesis,
> Floor Depth, Real Scars, Communication (see `CONTEXT.md`).

**Debrief Template — Full Dress:**

```
## Mock Debrief — Week 12, Full Dress Rehearsal

### Coding: [X.X avg]
[4 dimension scores + notes]

### Behavioral: [X.X avg]
[8 dimension scores + notes]

### System Design: [X.X avg]
[4 dimension scores + notes]

### Overall Average: [X.X]
### Target: 3.5+

### Final Assessment
- Ready for interviews? [Yes / Almost / Not yet]
- Strongest area: [...]
- Area needing most work: [...]
- Recommended focus for remaining prep: [...]
```

---

## Scoring Quick Reference

### Scale

| Score | Label           | Meaning                   |
| ----- | --------------- | ------------------------- |
| 4     | Strong Hire     | Exceeds expectations      |
| 3     | Leaning Hire    | Solid, minor gaps         |
| 2     | Leaning No Hire | Partial, significant gaps |
| 1     | Strong No Hire  | Cannot demonstrate        |

### Dimensions by Round

| Round         | Dimensions                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| Coding        | Communication, Problem Solving, Technical Competency, Testing                                               |
| Behavioral    | Motivation, Proactivity, Unstructured Env, Perseverance, Conflict Resolution, Empathy, Growth Mindset, Communication |
| System Design | Requirements, Architecture, Deep Dive, Trade-offs                                                           |
| Backend       | Conceptual Depth, Practical Knowledge, Problem Diagnosis, Communication                                     |
| Frontend      | Component Design, State Management, Rendering & Performance, API Integration                                |
| Craftsmanship | Synthesis, Floor Depth, Real Scars, Communication  *(Bậc 3 · Why-Ladder — runbook: `Craftsmanship/Mock-Craftsmanship-Guide.md`)* |

### Target Progression

| Weeks | Target Average |
| ----- | -------------- |
| 4-5   | 2.0+           |
| 6-7   | 2.5+           |
| 8-9   | 3.0+           |
| 10-12 | 3.5+           |

---

*Protocol Version: 1.1 | Created: 2026-03-14 | Enriched: 2026-03-15*
*See CONTEXT.md for system source of truth — design decisions, teaching tools, and rationale.*
*See README.md for how-to-use guide.*
