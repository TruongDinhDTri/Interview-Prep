# ⚔️ HADRIEL'S STAR(R) WORKSHOP ⚔️

This is our **Training Ground**.
Here we dump raw memories, refine them into the STAR(R) structure, and polish them before moving the final versions to the `STAR-stories/` folder.

---

## 🏗️ The Framework: STAR(R)

| Stage | What It Is | What Interviewers Look For | The "Vibe" | Weight |
|-------|-----------|---------------------------|-----------|--------|
| **S**ituation | The Context | A recent challenge or situation you found yourself in. Keep it brief — this is setup, not the story. | "Once upon a time..." | 10% |
| **T**ask | The Challenge | What were you required to achieve? 💡 **Pro tip:** Describe a *Target you set yourself* (not just an externally imposed task) — this signals intrinsic motivation and proactivity. | "The monster appeared..." | 10% |
| **A**ction | **YOUR** Work | What did you do? **Why** did you do it? What were the **alternatives** you considered? — These are the *repeatable behaviors* the company wants to hire for THEIR projects. | "I drew my sword and..." | **50%** |
| **R**esult | The Outcome | What was the outcome? What did you achieve? What did you **learn**? What steps did you take to **improve** after the experience? | "And peace was restored." (Numbers!) | 15% |
| **R**eflection | The Growth | The principle you extracted — how it changed your approach going forward. This is your **seniority signal**: juniors describe what happened, seniors extract lasting wisdom. | "Looking back, I learned..." | **15%** |

> ⚡ **Actions = Repeatable Behaviors.** The company is NOT hiring you to repeat the same project you've done before. They want to see the *behaviors* embedded in your Actions — initiative, problem decomposition, cross-team coordination — so they can predict how you'll behave on *their* projects.

> ⚠️ **Common Mistakes:** Spending too much time on S/T (max 30 sec combined) · Saying "We" instead of "I" in the Action · Skipping the Reflection · No numbers in the Result.

---

## 🧠 Brainstorming Zone

> **Strategy Note:** Unlike coding prep, drilling 30 questions has limited value. Instead, master 3-5 key stories from your career — each story should be high-impact, high-complexity, and highly personal. One story can answer 5-8 different questions depending on the angle you lead with.

### Story 1: The High-Impact Project (Efficiency & ROI) 🚀
- **Raw Memory:** Jarvis-Bot. Automated manual timesheets for 20+ people. Went from 3 hours/week to 30 seconds. Saved 3,120 hours/year. Led to a salary increase.
- **Why chosen:** Covers *High-Impact Project* (measurable ROI, team-wide adoption) + *Leadership Moment* (self-initiated, drove 20+ people) + *Proactivity* (nobody asked, I measured the cost and built it anyway)

### Story 2: The Technical Challenge (Deep Engineering) 🛠️
- **Raw Memory:** JS-Injection Extension. Intercepting production sites to inject local/staging code. Bypassing CORS and blocking original scripts to speed up dev cycles by 90%.
- **Why chosen:** Covers *Challenging Situation* (CORS/CORB/CSP technical blockers with no clear solution path) + *Unstructured Environment* (no spec, invented the problem definition + architecture) + *Perseverance* (multiple technical walls, kept pushing)

### Story 3: The Innovation (AI-Native) 🧠
- **Raw Memory:** Second Brain Investigator. Semantic search over 1M+ Notion notes using Gemini. Solved keyword-search failure. Shared source with 10 colleagues.
- **Why chosen:** Covers *High-Impact Project* (10 senior colleagues adopted it) + *Motivation* (built because genuinely excited about AI augmenting memory) + *Unstructured Environment* (no playbook for RAG at this scale, figured it out)

### Story 4: The Conflict (Setting Boundaries) 🛡️
- **Raw Memory:** The Disrespectful Leader. Shouted at me in front of the team. I held back, de-escalated, and addressed it professionally in the review. Established boundaries.
- **Why chosen:** The ONLY story dedicated to *Conflict Resolution & Empathy* — but it's a strong one. CEO involvement = Senior scope. Strategic timing of confrontation = leadership maturity signal.

### Story 5: The Failure/Growth (Ownership) 🌱
- **Raw Memory:** The Dependency Trap. Relied on a senior to set up WSL/Env. It crashed. I was helpless. Learned to own the tools. Now I teach interns the "Why", not just the "How".
- **Why chosen:** Covers *Learning Experience* (formative failure that created a lasting principle) + *Challenging Situation* (crisis under deadline, mentor unreachable) + *Leadership Moment* (20+ interns now mentored differently because of this failure)

---

## 🎯 Why These 5 Stories — The TIH Selection Framework

TIH says to pick 3-5 projects based on 4 category types. Here's how your 5 stories map:

| TIH Category | What It Covers | Your Stories |
|-------------|---------------|-------------|
| **High-Impact Projects** | Major launches, significant refactors, decisions that influenced multiple teams | S1: Jarvis-Bot, S3: Second Brain |
| **Challenging Situations** | Tight deadlines, technical failures, ambiguous requirements, uncertain success | S2: JS-Injection, S5: Dependency Trap |
| **Leadership Moments** | Mentoring, driving initiatives, times others looked to you for direction | S1: Jarvis-Bot, S5: Dependency Trap |
| **Learning Experiences** | Mistakes that led to growth, feedback that changed your approach, skills under pressure | S5: Dependency Trap |

> **The Overlap Is the Point.** S5 (Dependency Trap) alone covers 3 of 4 categories — that's why one story can answer "failure", "ambiguity", "leadership", and "growth" questions. Don't try to have a different story for every question. Drill these 5 until you can tell each one from any angle.

---

## 🏆 The Big Three — Must-Prep Questions

These appear in nearly EVERY behavioral interview. Prepare them until they're natural, not memorized:

| Question | Story to Use | Timing |
|---------|-------------|--------|
| **"Tell me about yourself"** | Self-Introduction (not a STAR story — see `../Self-Introduction/Elevator-Pitch.md`) | ~60 sec |
| **"Tell me about your most impactful project"** | S1: Jarvis-Bot (for impact) or S3: Second Brain (for innovation) | ~3 min |
| **"Tell me about a time you dealt with conflict"** | S4: The Conflict | ~3 min |

> **Full polished answers with exact timing:** `../Common-Questions/Big-Three-Answers.md`

> 💡 **Practice tip:** Don't memorize — write bullet points and verbalize near the interview. Memorized answers sound robotic. Bullet-pointed answers sound natural.

---

## 🛠️ Drafting Table (Complete Arsenal)

### 1. Jarvis-Bot: The 3,000-Hour Automation (High Impact)

**S - Situation:**
At NewITVN, a team of 20+ developers and managers spent roughly 3 hours every week manually creating timesheets. This involved cross-referencing Slack messages with project codes and formatting them into complex Japanese-standard CSVs.

**T - Task:**
I calculated that this was wasting over 60 engineering hours a week. I set out to build a serverless automation tool that would reduce this task to under a minute while maintaining 100% accuracy for management.

**A - Action:**
- **Initiative:** Proposed and built "Jarvis-Bot" as a serverless Slack bot using Python and Firebase Functions.
- **NLP Engine:** Developed a custom parser using Regex and string logic to extract task codes (e.g., BCLIST-XXX) from conversational Slack threads.
- **Integration:** Integrated Google Drive and Sheets APIs to handle the data flow and generate localized CSVs (UTF-8-BOM for Japanese characters).
- **Cost Optimization:** Reduced cloud costs by aggressively tuning resources:
    - **Resource Allocation:** Lowered memory to **256MB** and timeout to **120s** to match actual usage.
    - **Event Filtering:** Removed unnecessary event subscriptions (listening only to `app_mention`), preventing "cold starts" and billing for irrelevant messages.
    - **Algorithmic Efficiency:** Optimized Regex parsing and in-memory CSV generation to minimize calculation time.
- **Reliability:** Implemented retry logic and exponential backoff to handle Firebase's timeout limits and ensure 100% delivery.

**R - Result:**
The process went from 3 hours to 30 seconds. It was adopted by the entire team and management. We saved an estimated 3,120 hours annually, providing over $240k in productivity value. This project was a key factor in my recent salary increase.

**R - Reflection:**
This project crystallized a principle I now apply everywhere: **"Measure the invisible tax."** Teams often accept painful manual processes because no one quantifies the cost. By calculating the 3,120 hours/year figure *before* building anything, I could justify the engineering investment and get buy-in. Now, whenever I see a repetitive workflow, my first instinct is to measure its true cost — that number is what turns a "nice to have" into an "urgent priority." I also learned that the best automation isn't the most complex — it's the one that fits seamlessly into existing workflows (Slack, where the team already lived).

---

### 2. JS-Injection: Hacking the Dev Cycle (Technical Challenge)

**S - Situation:**
At BuyeeConnect, we supported 1,285+ vendor sites. Testing a fix was painful: we had to deploy to a CDN, invalidate cache, and wait (15-30 mins) just to see if a single line of JavaScript worked in production.

**T - Task:**
I needed a way to "hot-swap" production code with my local code instantly, directly in the browser, bypassing the entire deployment pipeline for testing.

**A - Action:**
- **Architecture:** Built a Manifest V3 Chrome Extension to intercept network requests.
- **The Challenge:** The browser blocks cross-origin scripts (CORS/CORB) and CSP (Content Security Policy).
- **The Solution:** I used the `chrome.scripting` API and a Service Worker proxy to inject my local script *as if* it were part of the page.
- **The Hack:** Implemented a "Block & Replace" logic using `webRequest` blocking listeners to cancel the request for the *original* production script and immediately inject my local version, ensuring no race conditions.

**R - Result:**
Dev cycle time dropped from 30 minutes to **30 seconds**.
It became the daily driver tool for the entire team.
We eliminated "blind deployments" and production bugs caused by environment differences.

**R - Reflection:**
This taught me that **the best developer tools are born from frustration, not from planning meetings.** I didn't ask permission to build it — I saw a pain point, prototyped a solution over a weekend, and let the results speak. The key insight was that developer productivity isn't just about writing faster code; it's about shortening the feedback loop. Now I evaluate every tool and process through this lens: "How long is the feedback loop, and can I compress it?" This project also taught me that browser APIs are far more powerful than most developers realize — understanding platform capabilities deeply unlocks creative solutions.

---

### 3. Second Brain: AI-Powered Knowledge Retrieval (Innovation)

**S - Situation:**
I am an "AI-Native" learner, documenting everything in Notion. However, as my workspace grew to 1M+ notes, keyword search became a bottleneck. I suffered from "Information Silos"—I knew I had the answer, but couldn't retrieve it, forcing me to re-solve problems I'd already fixed.

**T - Task:**
I decided to architect a **Second Brain Investigator**. My goal wasn't just a search bar; I wanted a system that could perform **Semantic Retrieval**—understanding the *intent* of my question and providing an answer synthesized from my private knowledge base.

**A - Action:**
- **Bleeding-Edge Stack:** Built a full-stack app using **React 19**, **TypeScript**, and **Flask**.
- **The RAG Pipeline:** Engineered a custom **Retrieval-Augmented Generation (RAG)** pipeline. I used the Notion API for ingestion and integrated **Google's Gemini Pro** for semantic embeddings and generation.
- **The Technical Hurdle:** Solved the "Context Window" challenge by implementing logic to filter and rank only the most relevant note snippets, keeping answers precise and latency low.
- **The Interface:** Designed a "chat-first" UX, making my notes feel like a living mentor I could spar with.

**R - Result:**
I achieved **"Infinite Recall."** I reduced retrieval time from minutes to seconds—finding a bug fix from 2 years ago just by describing symptoms. When I demoed it, **10 senior colleagues** asked for the source code, establishing me as the go-to person for **AI implementation** in the team.

**R - Reflection:**
This project taught me that **AI isn't about replacing workflows — it's about augmenting human memory.** The most impactful AI applications solve problems people have accepted as "just the way it is." I also learned that building for yourself first creates the most authentic products — I was my own power user, so every design decision was grounded in real need. Going forward, I apply the "Eat your own dog food" principle: if I wouldn't use it daily, it's not ready. The RAG pipeline experience also gave me deep conviction that AI-native development is the future — not as a buzzword, but as a practical engineering skill that multiplies individual output.

---

### 4. The Conflict: Professional Boundaries (Conflict Resolution)

**S - Situation:**
During a casual work conversation, my Team Leader, under severe deadline pressure, suddenly stood up and shouted derogatory, personal insults at me in front of the entire office, including interns and the CTO.

**T - Task:**
I felt humiliated and furious. My instinct was to retaliate, but I knew causing a scene would damage the team culture and my professional reputation. I needed to address this toxic behavior firmly but professionally.

**A - Action:**
- **Restraint:** In the moment, I chose absolute de-escalation. I remained silent and returned to work, demonstrating control.
- **Confrontation:** I waited for my formal Performance Review with the CEO/CTO to raise the issue in the proper forum.
- **Boundary Setting:** When the leader excused his behavior as "stress" or "character," I pushed back: *"Stress is not an excuse for disrespect. I value our working relationship, but I do not accept personal insults. I expect an apology because professional standards demand it."*

**R - Result:**
The CEO backed me immediately. The leader apologized. More importantly, the behavior never repeated. I established myself as a professional who demands respect without losing composure.

**R - Reflection:**
This experience taught me that **professional boundaries are not optional — they're infrastructure.** Just like you wouldn't deploy without error handling, you shouldn't work without clear behavioral expectations. I learned that the *timing* of confrontation matters as much as the *content*: addressing it in the formal review (not in the heat of the moment) gave me credibility and leverage. Now, in any team dynamic, I proactively establish communication norms early — it's preventive engineering for team culture. I also learned that standing up for yourself professionally doesn't damage relationships; it strengthens them by setting clear expectations.

---

### 5. The Failure: The Dependency Trap (Growth/Mentorship)

**S - Situation:**
As a fresher on a Windows machine for a Mac-based project, I was overwhelmed by the setup (WSL, Oracle). A senior colleague kindly set it up for me. I let him do it without understanding the "Why."

**T - Task:**
Six months later, a disk error wiped my configuration before a deadline. My mentor was unreachable. I was stranded with a broken toolset I didn't understand.

**A - Action:**
- **The Shift:** I stopped looking for a savior. I spent a full day dissecting the stack: *Why WSL? How does the port forwarding work?*
- **The Fix:** I rebuilt the environment from scratch, documenting every step.
- **The Application:** As a mentor later at NewITVN, I vowed never to just "fix it" for my interns. I explain the architecture and force them to drive the keyboard, ensuring they don't fall into the same dependency trap.

**R - Result:**
I met the deadline independently. I transformed from a dependent junior into an empowering mentor. My 20+ interns now onboard faster because they are taught to own their tools, not just use them.

**R - Reflection:**
This was the most formative failure of my career. It taught me the principle I now live by: **"Never outsource understanding."** Convenience is the enemy of competence. When someone "fixes it for you," you're not being helped — you're being made fragile. As a mentor, I now deliberately make the learning process slightly uncomfortable: I explain the *why*, then make the intern drive. It takes longer upfront but produces engineers who can debug their own systems. This experience also shaped my learning philosophy — I always ask "Why does this work?" not just "How do I use it?" — which is exactly why I approach interview prep through understanding patterns, not memorizing solutions.

