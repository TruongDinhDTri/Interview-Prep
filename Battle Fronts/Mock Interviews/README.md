# Mock Interview System — "THE BATTLE" ⚔️

Your complete mock interview training system. 18 hours of structured practice across Weeks 4-12.

**Read this file first.** It explains how everything works, why Hadriel behaves differently during mocks, and exactly how to start a session.

---

## ⚔️ Pick Your Fight — How to Start Each Mock

Hadriel loads files on-demand, so **what you SAY is what triggers the right battle.** Four ways to mock:

| Mock | Say to Hadriel | Rubric / runbook |
|------|----------------|------------------|
| ⚔️ **Full Combined** (Format A / B / Dress) | *"Hadriel, let's do a full mock"* | `Mock-Interview-Protocol.md` + `CONTEXT.md` |
| 🗣️ **Behavioral-only** | *"let's do a behavioral mock"* | `Behavioral/Mock-Behavioral-Guide.md` |
| ⚙️ **Technical-only** (Backend / Frontend) | *"let's do a technical mock"* | `Technical/Mock-Technical-Guide.md` |
| 🏗️ **System Design-only** | *"let's do a system design mock"* | `System Design/Mock-SystemDesign-Guide.md` |

Each fight keeps its **OWN rubric** — they do *not* share one. This arena only shares the *shell*: the
timer, the interviewer→debrief ritual, and your score history in `../memory/mock-performance.json`.

> 🤖 **Behind the scenes (you don't need to touch this):** when you speak a trigger above, Hadriel loads
> his battle operating-manual `reusable-prompts/mock-run-the-battle.md` — which flips him to *Role 1
> maxed, Role 2 = scoring penalty, zero teaching*. You just say the phrase; he handles the rest. In a
> fresh/manual session, you *can* paste that file to **force** battle-mode (same way you'd paste
> `coding-prep-follow-road.md` to force drill-mode).

---

## How THE BATTLE Works — The Two Modes

During regular practice, Hadriel is your **trainer** — he hints, teaches, asks guiding questions, creates "aha moments." But real interviews don't have trainers. They have **interviewers** who evaluate silently.

THE BATTLE simulates this reality:

```
┌─────────────────────────────────────────────────────────┐
│  PHASE 1 & 2: INTERVIEWER MODE                         │
│  ─────────────────────────────────                      │
│  Hadriel becomes a professional interviewer.            │
│  • No hints, no teaching, no encouragement              │
│  • Asks follow-up questions like a real interviewer      │
│  • Strict time-boxing — moves on when time is up        │
│  • Takes mental notes for scoring                       │
│                                                         │
│  WHY: You need to practice performing WITHOUT support.  │
│  The pressure is the point.                             │
├─────────────────────────────────────────────────────────┤
│  PHASE 3: TRAINER MODE (DEBRIEF)                        │
│  ─────────────────────────────────                      │
│  Hadriel switches back to your Socratic trainer.        │
│  • Scores each dimension honestly (1-4 scale)           │
│  • Guides you to discover what went wrong (not "you     │
│    should have done X" but "what if you tried X?")      │
│  • Assigns specific drills for next week                │
│  • Uses problem-solving techniques as teaching tools    │
│                                                         │
│  WHY: The learning happens HERE, not during the mock.   │
│  Honest scores + Socratic teaching = real growth.       │
└─────────────────────────────────────────────────────────┘
```

**This dual-mode approach mirrors real life:** you perform under pressure, then review with a coach afterward. Don't be surprised when Hadriel feels "cold" during the mock — that's intentional.

---

## What's In This Folder?

| File | Who Reads It | What It Contains |
|------|-------------|-----------------|
| `README.md` | **You (Wiganz)** | This file — workflow, how to start, how to understand your scores |
| `Mock-Interview-Protocol.md` | **You + Hadriel** | The complete playbook — timing, scripts, candidate checklists, STARR framework, 29 behavioral questions, self-intro structure, questions-to-ask bank, scoring rubrics |
| `mock-interview-timer.html` | **You** | Interactive browser timer with built-in scoring form |
| `CONTEXT.md` | **Hadriel only** | Source of truth for the entire system — design decisions, teaching tools, scoring calibration. Ask Hadriel to explain anything from here. |
| `../memory/mock-performance.json` | **Hadriel** | Your scores across all sessions — Hadriel tracks progression here |

---

## The Workflow — Step by Step

### Before the Mock (5 min prep)

**1. Know your format:**

| Week | Format | What You'll Do |
|------|--------|---------------|
| 4 | **A — Technical** | Coding (55 min) + System Design (45 min) + Debrief (20 min) |
| 5 | **B — People** | Behavioral (50 min) + Coding Under Pressure (50 min) + Debrief (20 min) |
| 6 | **A — Technical** | Coding (55 min) + Backend Deep Dive (45 min) + Debrief (20 min) |
| 7 | **B — People** | Behavioral (50 min) + Coding Under Pressure (50 min) + Debrief (20 min) |
| 8 | **A — Technical** | Coding + System Design + Debrief |
| 9 | **B — People** | Behavioral + Coding Under Pressure + Debrief |
| 10 | **A — Technical** | Coding + Backend Deep Dive + Debrief |
| 11 | **B — People** | Behavioral + Coding Under Pressure + Debrief |
| 12 | **Full Dress** | Coding + Behavioral + System Design + Debrief (170 min total) |

**2. Review your tools in `Mock-Interview-Protocol.md`:**

For **Format A** (Technical):
- Review the **Candidate Checklists** — 4 checklists telling you exactly what to DO in each coding phase (Clarify → Design → Implement → Test)

For **Format B** (People):
- Review the **Self-Introduction Structure** — 4 components: Background → Highlight → Why This Role → Practice
- Review the **STARR Framework** — Situation (10%) → Task (10%) → Action (60%) → Result (15%) → Reflection (5%)
- Review the **Questions to Ask** bank — pick 3-5 questions relevant to the mock company/role

**3. Open the timer:** Open `mock-interview-timer.html` in your browser. Select your format.

### Starting the Mock

Tell Hadriel:

> "Let's do a Format A mock, Week 6"

or

> "Mock interview time — Format B, Week 7"

Hadriel will confirm the format, select problems based on your weak areas, and enter **interviewer mode**.

### During the Mock (100-120 min)

The timer guides you through each phase. Your job:

**In every coding round:**
- Talk aloud — explain your thinking (Communication score depends on this)
- Follow the Candidate Checklists from Protocol.md
- Don't skip testing at the end

**In behavioral rounds:**
- Use STARR structure — especially the Reflection at the end
- Keep each answer under 2 minutes
- Make Action 60% of your answer — specific things YOU did

**If you get stuck:** Hadriel may give one small nudge (noted as "hint given" in scoring). That's it — no teaching during the mock.

### The Debrief (20 min)

This is where the real learning happens. Hadriel:
1. Scores each dimension (1-4) with honest notes
2. Highlights your top 2 strengths with specific examples
3. Identifies top 2 improvements with actionable guidance
4. Uses Socratic questions to help you discover what you missed
5. Assigns specific drills for the coming week
6. Connects your progress to previous sessions

### After the Mock

1. **Score in the timer** → Fill in each dimension (1-4) with notes
2. **Export JSON** → Click the export button in the timer
3. **Update tracking** → Paste results into `memory/mock-performance.json` (or ask Hadriel to update)
4. **Do your drills** → Practice the weak areas before next mock

---

## External Platforms — Adding Real Pressure

Hadriel is your primary trainer, but you also need practice with strangers and voice:

| Platform | What | When | Why |
|----------|------|------|-----|
| **Hadriel** | AI interviewer + Socratic debrief | Weekly (W4+) | Best debrief, tracks progress, pattern-aware |
| **Pramp** | Free peer-to-peer with real humans | Bi-weekly (W6+) | Real stranger pressure, practice being interviewed by someone who doesn't know you |
| **MockIF** | AI voice interviewer | Monthly (W8+) | Practices speaking fluency — many real interviews are verbal, not typed |

### How to Use Pramp
1. Sign up at [pramp.com](https://www.pramp.com)
2. Match interview type to your current week's focus (Format A → "Data Structures & Algorithms" or "System Design"; Format B → "Behavioral")
3. Schedule for Saturday or Sunday (Vietnam timezone — look for evening slots)
4. After the session, note what felt different about human pressure vs Hadriel

**Tip:** Being the interviewer on Pramp teaches you what interviewers look for — valuable perspective.

### How to Use MockIF
1. Sign up at MockIF
2. Configure for "Software Engineer" technical interviews
3. Focus on: speaking clearly, thinking aloud, managing silence
4. Good for: commute, breaks, anytime you can't type

### Full Platform Schedule

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

## Understanding Your Scores

### What the Numbers Mean

| Score | Label | What It Feels Like | What It Means |
|-------|-------|-------------------|--------------|
| **4** | Strong Hire | "I could do this in my sleep" | Exceeds expectations — effortless competence |
| **3** | Leaning Hire | "I got it but stumbled a bit" | Solid with minor gaps — this is the target |
| **2** | Leaning No Hire | "I knew some but struggled" | Partial, significant gaps — needs focused drilling |
| **1** | Strong No Hire | "I was lost" | Cannot demonstrate — go back to fundamentals |

### Where You Should Be Each Week

| Weeks | Target Average | What It Means |
|-------|---------------|--------------|
| 4-5 | 2.0+ | Learning the format, establishing your baseline |
| 6-7 | 2.5+ | Showing real improvement, fewer major gaps |
| 8-9 | 3.0+ | Consistently solid, approaching hire-level |
| 10-12 | 3.5+ | Interview-ready — confident, polished performance |

### When to Celebrate
- First time averaging 3.0+ in any round
- Scoring 4 on any dimension
- Improving 0.5+ from one session to the next
- Completing Week 12 Full Dress Rehearsal

---

## FAQ

**Q: What if I run out of time in a phase?**
A: Move on. Real interviews have hard cutoffs. The timer will transition you. Note the time management issue in debrief.

**Q: What if I completely bomb a round?**
A: That's what training is for! A 1.5 average in Week 4 is expected. Focus on the debrief — what specifically went wrong? Drill that area before next mock.

**Q: Can I redo a mock?**
A: No re-dos in the same week. But you can ask Hadriel for a "mini drill" on your weakest dimension anytime during the week. Save full mocks for Saturday.

**Q: Should I use Hadriel or Pramp for System Design?**
A: Both. Hadriel gives better debrief and progress tracking. Pramp gives real human pressure. They complement each other.

**Q: What if Hadriel is too easy/hard?**
A: Tell him. "Push me harder next time" or "Scale back, I need to build confidence first." He'll adjust.

**Q: Why does Hadriel feel so different during mocks?**
A: By design. During regular practice, he's your trainer (hints, teaches, guides). During mocks, he's an interviewer (evaluates, no help). The debrief bridges both. See "How THE BATTLE Works" above.

**Q: What should I review in Protocol.md before each mock?**
A: For Format A: the Candidate Checklists (4 coding phase checklists). For Format B: Self-Introduction Structure, STARR Framework, and Questions to Ask bank. These are your tools — use them.

---

*System created: 2026-03-14 | Enriched: 2026-03-15 | See Mock-Interview-Protocol.md for the full playbook.*
