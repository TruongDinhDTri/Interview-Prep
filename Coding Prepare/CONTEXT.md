# CONTEXT — The Problem-Solving Road

## Elara's Teaching Memory for Interview Problem Solving

---

## 1. The Agreement

Wiganz's original Pattern Recognition Process (PRP) in `the-reality-canvas.html` only covered pattern-based DSA problems (the 15 patterns). When he encountered "Busiest Time in The Mall" — a problem with no pattern fit — we designed a **complete 8-step system** with a fork for pattern vs first-principles solving.

**Sources:** Tech Interview Handbook — [Cheatsheet](https://www.techinterviewhandbook.org/coding-interview-cheatsheet/), [Techniques](https://www.techinterviewhandbook.org/coding-interview-techniques/), [Rubrics](https://www.techinterviewhandbook.org/coding-interview-rubrics/)

**File:** `the-problem-solving-road.html` (standalone companion page linked from Reality Canvas Root Cause #3)

---

## 2. The Complete Process

```
BEFORE: PREPARE ── Self-intro. Environment. Mindset.
STEP 0: GROUND ──── Understand the problem. Paraphrase. Clarify.
STEP 1: DECODE ──── Strip the story. Abstract it.
STEP 2: ROUTE ───── Do I recognize a pattern?
        │                            │
   YES to all 3              NO to any
        │                            │
   Step 3P: MATCH          Step 3F: EXPLORE
   Step 4P: REASON         Step 4F: BUILD
        │                            │
        └──────── MERGE ─────────────┘
STEP 5: DISCUSS ── Present approaches. Tradeoffs. Get green light.
STEP 6: PLAN ───── Key steps to execute. Then code it.
STEP 7: VERIFY ─── Test, edge cases, complexity.
STEP 8: PROVE ──── Close everything. Repeat from memory.
```

### Step Details

| Step | Name | Core Question | Key Actions |
|------|------|---------------|-------------|
| Before | Prepare | "Am I set up?" | Self-intro (under 1 min), environment check, mindset: "first 3-5 min = understanding" |
| 0 | Ground | "Do I understand what's being asked?" | Paraphrase, ask 9 specific constraint questions (sorted? dupes? nulls? size? return type?), trace 1-2 examples |
| 1 | Decode | "What is this *really* asking?" | Strip story words, abstract to math/logic. 4 concrete examples provided. |
| 2 | Route | "Do I recognize a pattern?" | 3-question gate: shape match? name + why? solved before? |
| 3P | Match | "What signals point to which pattern?" | Signal tags → pattern name. Concrete example: "Longest Substring" → Sliding Window |
| 4P | Reason | "WHY does this pattern work?" | 3 concrete answers: A) brute force + why bad, B) what pattern does instead, C) invariant |
| 3F | Explore | "How would I solve without patterns?" | 6 techniques with concrete examples: HTML timeline visualization, step-by-step manual solve, generate examples, data structure decision table, decompose, brute force with bug-to-fix code |
| 4F | Build | "How do I optimize?" | 4 optimization techniques: BTTC analysis, overlapping computation, data structure swaps, redundant work elimination (with code examples) |
| 5 | Discuss | "Have I discussed my approach and gotten the green light?" | Present 2+ approaches with time/space complexity, explain tradeoffs, use BTTC to justify, get explicit green light |
| 6 | Plan & Code | "What are the key steps to execute?" | Phase 1: outline key steps out loud. Phase 2: skeleton first, descriptive names, narrate every line, real code not pseudocode |
| 7 | Verify | "Does it work? What breaks it?" | Common bug checklist (7 items), edge case table by data type, concrete trace walkthrough |
| 8 | Prove | "Can I explain without looking?" | Close everything, repeat from memory (practice only) |

---

## 3. The 4 Scoring Dimensions

Interviewers score on 4 SEPARATE dimensions. Every step must serve at least one.

| Dimension | What They Grade | Strong Hire Signal | Steps |
|-----------|----------------|-------------------|-------|
| **Communication** | Clarifications, approach explanation, narration | "Thorough, well-organized, succinct and clear" | ALL steps |
| **Problem Solving** | Systematic approach, optimization, trade-offs | Multiple solutions + trade-off analysis | Steps 0-5 |
| **Technical Competency** | Working code, clean implementation, DRY | Clean code with minimal bugs | Step 6 |
| **Testing** | Typical cases, corner cases, bug identification | Effortless testing + corner case coverage | Step 7 |

**Critical:** Communication is NOT one step — it's scored across the ENTIRE interview. Every step has a "SAY THIS" prompt.

---

## 4. Teaching Philosophy — How Elara Guides

When Wiganz brings a problem, walk him through the road step by step:

1. **Before:** Check environment, practice self-intro
2. **Step 0 (Ground):** Ask him to paraphrase and ask the 9 constraint questions. "What constraints should we confirm?"
3. **Step 1 (Decode):** Ask him to strip the story. "What's the abstract version? Kill the story words."
4. **Step 2 (Route):** Ask honestly — does this match a pattern? "Can you name a pattern AND explain why it applies? Have you solved something like it?"
5. **If Pattern Path:** Guide through Match → Reason (A: brute force, B: what pattern does, C: invariant)
6. **If First Principles:** Guide through 6 Explore techniques in order (visualize → manual solve → examples → data structures → decompose → brute force). Then optimize with BTTC, overlapping computation, data structure swaps, redundant work elimination. Stop when something clicks.
7. **Step 5 (Discuss):** Present 2+ approaches, state time/space for each, explain tradeoffs, get green light before coding.
8. **Step 6 (Plan & Code):** Outline key execution steps out loud, then code with narration. Skeleton first. Descriptive names. Real code.
9. **Step 7 (Verify):** Scan for common bugs. Test edge cases from the table. Trace through one example. State complexity.
10. **Step 8 (Prove):** Ask him to close everything and repeat from memory.

**Always emphasize:** SPEAK OUT LOUD at every step. Silence = Strong No Hire.
**Always connect to scoring:** "This is what earns you Communication/Problem Solving/Testing points."

---

## 5. The Two Demo Problems

### Pattern Path: "Longest Substring Without Repeating Characters"

| Step | What Wiganz Says |
|------|-----------------|
| Ground | "Given a string, find length of longest substring with all unique chars. ASCII or Unicode? Return length. Can string be empty? → return 0." |
| Decode | "Longest contiguous sequence where no character appears more than once" |
| Route | "'Substring' + 'contiguous' + constraint → Pattern Path" |
| Match | "Sliding Window with HashSet" |
| Reason | A: Brute force O(n³). B: One window, expand/shrink O(n). C: Window = all unique chars at all times. |
| Discuss | "Two approaches: brute force O(n³) vs sliding window O(n). Window trades a HashSet O(min(n,charset)) space for massive time improvement. Going with sliding window. Sound good?" |
| Plan | "1) left=0, HashSet, max_length=0. 2) Expand right, add to set. 3) While dup: remove left, advance. 4) Update max_length. 5) Return." |
| Code | `left=0, char_set=set(), max_length=0`. Expand right, if dup → remove left chars. Track max. |
| Verify | ""→0, "a"→1, "aaa"→1, "abcabcbb"→3. Time O(n), Space O(min(n,charset)). |

```python
def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_length = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    return max_length
```

### First Principles: "Busiest Time in The Mall"

| Step | What Wiganz Says |
|------|-----------------|
| Ground | "Timestamped enter/exit events, sorted. Multiple same-timestamp events. Return timestamp with most visitors. Confirmed: sorted, earliest peak on tie, count ≥ 1." |
| Decode | "+/- events grouped by timestamp, find max running total" |
| Route | "No pattern fits. First Principles." |
| Explore | "Drew timeline. Manually counted. Key insight: process ALL same-timestamp events before checking peak." |
| Build | "BTTC = O(n). My approach IS O(n), single pass. Space O(1). Trick: check only at timestamp boundaries." |
| Discuss | "Single pass approach — running count, check peak at timestamp boundaries. O(n) time, O(1) space. Already at BTTC. Shall I code this up?" |
| Plan | "1) count=0, max_count=0, max_time=0. 2) Loop each event. 3) Add/subtract. 4) If next timestamp differs or last: check peak. 5) Return max_time." |
| Code | count, max_count, max_time. Loop, add/sub. Check at timestamp boundary. |
| Verify | Traced [[t1,14,1],[t1,4,0],[t1,2,0],[t2,10,1]]. Edge: single event, all same timestamp. Time O(n), Space O(1). |

```python
def find_busiest_period(data):
    count = 0
    max_count = 0
    max_time = 0
    for i in range(len(data)):
        if data[i][2] == 1:
            count += data[i][1]
        else:
            count -= data[i][1]
        if i == len(data) - 1 or data[i][0] != data[i + 1][0]:
            if count > max_count:
                max_count = count
                max_time = data[i][0]
    return max_time
```

---

## 6. Key Content Additions (v2 & v3)

- **Before the Interview section:** Self-intro script, environment setup, mindset
- **9 specific clarifying questions** (not generic "clarify constraints")
- **Concrete examples throughout:** Mall problem as running First Principles example, Longest Substring for Pattern, decode table with 4 problems
- **6 Explore techniques** with concrete examples and data structure decision table
- **HTML timeline visualization** in Visualize technique (styled divs with colored event boxes and count tracker)
- **Step-by-step manual solve** with numbered walkthrough and "rules discovered" takeaway
- **Brute force with bug-to-fix code** showing how the naive approach reveals the optimal solution
- **4 optimization techniques** from Techniques page: BTTC, overlapping computation, data structure swaps, redundant work elimination (with code)
- **DISCUSS step (v3):** Present 2+ approaches with time/space, explain tradeoffs, get green light
- **PLAN phase (v3):** Outline key execution steps out loud before coding
- **DO/DON'T lists** from Cheatsheet for both Discuss and Code steps
- **Common bug checklist** (7 items) and **edge case table** by data type
- **Trace walkthrough** with step-by-step variable states (pre-wrap fix for proper rendering)
- **Complete working code** for both demo problems

---

## 7. Layout Decisions

- **Container:** 1200px max-width (wider for tables and code blocks)
- **Spacing:** 2rem section padding (tighter than v1's 4rem)
- **Dividers:** 1rem thin lines (not v1's 3rem padded dividers)
- **Hero:** 40vh min-height (not v1's 60vh)
- **Sticky nav:** Horizontal navigation bar at top, scrollable on mobile
- **Same visual style** as Reality Canvas (Cormorant Garamond + Inter, warm earth tones, prp-cards)

---

## 8. Key Design Decisions

- **Separate HTML file** (not embedded in Reality Canvas) — keeps therapeutic doc clean
- **Named "The Problem-Solving Road"** — road with a fork metaphor
- **Linked from Root Cause #3's Path Forward section** in `the-reality-canvas.html`
- **Both paths merge at Step 5** (Discuss) — one unified road, not two separate processes
- **"SAY THIS" prompts on every step** — Communication is the meta-skill
- **Step 8 (Prove) is for practice only** — not scored in interviews, but makes Steps 0-7 stick
- **No placeholders** — every step shows a REAL example with concrete content
- **Techniques page content integrated** into Steps 3F/4F — not a separate reference
