# ⚔️ HADRIEL'S STAR WORKSHOP ⚔️

This is our **Training Ground**. 
Here we dump raw memories, refine them into the STAR structure, and polish them before moving the final versions to the `STAR-stories/` folder.

---

## 🏗️ The Framework: STAR

| Stage | What it is | The "Vibe" | Weight |
|-------|------------|------------|--------|
| **S**ituation | The Context | "Once upon a time..." (Keep it brief!) | 10% |
| **T**ask | The Challenge | "The monster appeared..." | 10% |
| **A**ction | **YOUR** Work | "I drew my sword and..." (The Hero's journey) | **60%** |
| **R**esult | The Outcome | "And peace was restored." (Numbers/Impact) | 20% |

> ⚠️ **Common Mistake:** Spending too much time on S/T and saying "We" instead of "I" in the Action.

---

## 🧠 Brainstorming Zone

### Story 1: The High-Impact Project (Efficiency & ROI) 🚀
- **Raw Memory:** Jarvis-Bot. Automated manual timesheets for 20+ people. Went from 3 hours/week to 30 seconds. Saved 3,120 hours/year. Led to a salary increase.

### Story 2: The Technical Challenge (Deep Engineering) 🛠️
- **Raw Memory:** JS-Injection Extension. Intercepting production sites to inject local/staging code. Bypassing CORS and blocking original scripts to speed up dev cycles by 90%.

### Story 3: The Innovation (AI-Native) 🧠
- **Raw Memory:** Second Brain Investigator. Semantic search over 1M+ Notion notes using Gemini. Solved keyword-search failure. Shared source with 10 colleagues.

### Story 4: The Conflict (Setting Boundaries) 🛡️
- **Raw Memory:** The Disrespectful Leader. Shouted at me in front of the team. I held back, de-escalated, and addressed it professionally in the review. Established boundaries.

### Story 5: The Failure/Growth (Ownership) 🌱
- **Raw Memory:** The Dependency Trap. Relied on a senior to set up WSL/Env. It crashed. I was helpless. Learned to own the tools. Now I teach interns the "Why", not just the "How".

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

