# CONTEXT — The Problem-Solving Road

## Hadriel's Teaching Reference for Interview Problem Solving

---

## 1. The Road System

Wiganz uses `the-problem-solving-road.html` as his visual reference. This file is Hadriel's teaching protocol — it mirrors the HTML exactly so CLI teaching aligns with what Wiganz practices.

**Sources:** Tech Interview Handbook — [Cheatsheet](https://www.techinterviewhandbook.org/coding-interview-cheatsheet/), [Techniques](https://www.techinterviewhandbook.org/coding-interview-techniques/), [Rubrics](https://www.techinterviewhandbook.org/coding-interview-rubrics/)

**File:** `the-problem-solving-road.html` (standalone companion page)

---

## 2. The Complete Process

```
BEFORE ──────── Prepare. Self-intro. Environment. Mindset.
STEP 1: UNDERSTAND ── Clarify. Rephrase. Abstract. Trace example.
STEP 2: APPROACH ──── Pattern or first principles?
        │                            │
   YES to all 3              NO to any
        │                            │
   PATTERN PATH           FIRST PRINCIPLES
   (3P: Match, 4P: Reason)  (3F: Explore — 6 techniques)
        │                            │
        └──────── MERGE ─────────────┘
                    │
           🧯 IF STUCK: 6 lifelines (before proceeding)
                    │
STEP 3: DISCUSS ─── Present approach + WHY it works. Tradeoffs. Green light.
STEP 4: CODE ─────── Blueprint (comments first) → Implement with narration.
STEP 5: VERIFY ───── Scan → trace out loud → edge cases → complexity.
STEP 6: OPTIMIZE ─── 6-question checklist. Re-read your code first.
         └──── Better approach? → Discuss → Code → Verify ──┘
REVIEW ─────────── (Post-interview) Repeat from memory. Deep-study techniques.
```

### Step Details

| Step | Name | Core Question | Key Actions |
|------|------|---------------|-------------|
| Before | Prepare | "Am I set up?" | Self-intro (under 1 min), environment check, mindset: "first 3-5 min = understanding, don't touch keyboard yet" |
| Step 1 | Understand | "Do I actually understand what's being asked?" | Paraphrase, ask 9 specific constraint questions, strip the story → abstract version, trace 1-2 examples by hand |
| Step 2 | Approach | "Do I recognize a pattern?" | 3-question gate: abstract shape match? can I name it + why? solved something like this? YES all 3 → Pattern Path. NO to any → First Principles. |
| 3P | Match | "What signals point to which pattern?" | Signal keywords → pattern name + why. "I see [signal] which tells me [pattern] because [reason]" |
| 4P | Reason | "WHY does this pattern work?" | A: brute force + why bad. B: what pattern does instead. C: invariant (what rule keeps it valid). |
| 3F | Explore | "How would I solve without patterns?" | 6 techniques IN ORDER: A) Visualize/Draw, B) Manual Solve step-by-step, C) Generate more examples, D) Try common data structures, E) Decompose, F) Brute force first. Stop when something clicks. |
| 🧯 Stuck | 6 Lifelines | "Nothing's clicking yet" | State what you know → state brute force → draw it → ask what DS fits → break it down → ask for a hint. Pre-built phrases ready. |
| Step 3 | Discuss | "Have I explained my approach AND gotten the green light?" | 4 parts in order: name approach → walk through numbered steps → state complexity (time + space) → get green light. Explain WHY (brute force vs insight vs invariant). |
| Step 4 | Code | "Am I narrating decisions, not keystrokes?" | Phase 1 Blueprint: write function signature + numbered comments (transcribe what you said in Discuss). Phase 2: implement under each comment, narrate INTENT ("Cooking Show Rule"). |
| Step 5 | Verify | "Have I traced through a real example out loud?" | Protocol: quick scan (silent) → fix bugs → trace example out loud (variable by variable) → test edge cases by type → state complexity confidently. |
| Step 6 | Optimize | "Is my code correct first, and can I make it faster?" | Re-read first. Then 6-question checklist: BTTC? repeated work? better DS? redundant work? space? still stuck? If better found → loop: Discuss → Code → Verify. |
| Review | Post-interview | "Can I explain this without looking?" | Close everything, repeat from memory (practice only). Study deep optimization techniques. |

---

## 3. The 4 Scoring Dimensions

Interviewers score on 4 SEPARATE dimensions. Every step must serve at least one.

| Dimension | What They Grade | Strong Hire Signal | Steps |
|-----------|----------------|-------------------|-------|
| **Communication** | Clarifications, approach explanation, narration | "Thorough, well-organized, succinct and clear" | ALL steps |
| **Problem Solving** | Systematic approach, optimization, trade-offs | Multiple solutions + trade-off analysis | Steps 1–3, 6 |
| **Technical Competency** | Working code, clean implementation, DRY | Clean code with minimal bugs | Step 4 |
| **Testing** | Typical cases, corner cases, bug identification | Effortless testing + corner case coverage | Step 5 |

**Critical:** Communication is NOT one step — it's scored across the ENTIRE interview.

---

## 4. Teaching Philosophy — How Hadriel Guides

**Core rule:** Never give direct answers. Always guide to discovery through Socratic questions. Every step below includes: what Hadriel ASKS, what Wiganz SHOULD SAY (SAY THIS), and what to watch for.

**Always emphasize:** SPEAK OUT LOUD at every step. Silence = Strong No Hire.
**Always connect to scoring:** "This step earns you [Communication / Problem Solving / Technical / Testing] points."

---

### BEFORE — Prepare

**Hadriel checks:**
- "Are you in a quiet room? Headphones on? Pen and paper ready?"
- "Let's do the self-intro — 30 seconds, go."

**Wiganz's self-intro template (memorize this exactly):**
> "Hi, I'm Tri. I'm a software developer with 2-3 years of experience working with Python/Django and React. I've built full-stack applications and recently been focused on system design and algorithms. Excited to be here."

**Environment checklist Hadriel asks:**
- Pen and paper ready? (for drawing data structures)
- Familiar with the coding platform shortcuts (CoderPad, CodePen, HackerRank)?
- Water nearby?

**Mindset anchors Hadriel drills:**
- "The first 3–5 minutes are for understanding. Do NOT touch the keyboard yet."
- "Silence = Strong No Hire. Every thought must be spoken out loud."
- "It's a conversation, not a test. The interviewer wants you to succeed."

---

### STEP 1 — Understand

**Scoring:** 💬 Communication + 🧩 Problem Solving

**Hadriel asks:**
- "Paraphrase the problem back to me. What's it actually asking?"
- "Now strip the story. What's the ABSTRACT version? Kill the story words."
- "What 9 constraint questions should you ask the interviewer?"
- "Trace through the given example by hand. Tell me each step."

**4 moves Wiganz must do in order:**
1. Paraphrase the problem
2. Ask the 9 constraint questions
3. Strip the story → abstract version
4. Trace 1–2 examples by hand, write expected output and WHY

**The 9 Constraint Questions (ask EVERY time):**
1. Is the input sorted?
2. Can values be negative? Zero? Floating point?
3. Can there be duplicates?
4. Can the input be empty or null?
5. Can I modify the original input/data structure?
6. How is the input stored? (array, linked list, tree, graph with cycles?)
7. What's the expected input size? (affects whether O(n²) is acceptable)
8. What should I return? (index, value, boolean, new array, in-place?)
9. Is there only one valid answer, or could there be multiple?

**Strip the Story — Abstract Examples:**
| Problem Title | Strip the story → Abstract |
|---|---|
| "Fruits Into Baskets" | "Longest subarray with at most K distinct elements" |
| "Busiest Time in The Mall" | "Given timestamped +/− events, find timestamp where running total is maximum (group same-timestamp events before checking)" |
| "Number of Islands" | "Count connected components in a 2D binary matrix" |
| "Two Sum" | "Find two indices whose values sum to target" |

**Wiganz's SAY THIS:**
> "Let me make sure I understand. [Paraphrase the problem]. So stripping the story, this is really asking: [abstract version]. A few questions: Is the input sorted? Can values be negative? Can the input be empty?..."

**Hadriel watches for:**
- Wiganz jumping to solution before clarifying → stop and redirect: "Wait — what constraints did you confirm?"
- Abstract version still has story words → ask: "What's the pure math/logic version?"
- Skipping the trace → "Walk me through the first example by hand. Step. By. Step."

---

### STEP 2 — Approach

**Scoring:** 🧩 Problem Solving

**Hadriel asks:**
- "Does this problem have a pattern signature? What signals do you see?"
- "Can you NAME the pattern AND explain WHY it fits?"
- "Have you solved something like this before?"

**The 3-Question Gate:**
1. Does the abstract shape match a pattern signature?
2. Can I name the pattern AND explain why it applies?
3. Have I solved something like this with that pattern?

→ **YES to all 3**: Pattern Path (3P → 4P)
→ **NO to any**: First Principles Path (3F)

**Wiganz's SAY THIS (even 10 seconds of this earns Problem Solving points):**
> "I can think of two approaches. Brute force would be [X] in O(n²). But I see [signal keyword] — that's a [Pattern] signature, which would bring it to O(n). I'd like to go with the optimized approach — does that sound good?"

**Hadriel watches for:**
- Forcing a pattern that doesn't fit → "Wait. Can you really explain WHY it applies? Answer the 3 gates."
- Immediately jumping to brute force and coding → "Stop. Before code — do you recognize ANY pattern?"
- Only saying "Two Pointers" without explaining why → "I need the WHY. Say: 'I see [signal] which tells me [pattern] because [reason].'"

---

### PATTERN PATH — Step 3P: Match

**Scoring:** 🧩 Problem Solving

**Hadriel asks:**
- "What signal keywords do you see in the abstract version?"
- "What pattern do they point to?"
- "Say the full sentence: 'I see [X] which tells me [Y] because [Z].'"

**Wiganz's SAY THIS:**
> "I see 'substring' and 'contiguous' — that's a Sliding Window signature. The constraint is 'no repeating characters,' which tells me when to shrink the window. I'll use a HashSet to track what's in the current window."

**Signal → Pattern cheat sheet:**
| Signal Keywords | Pattern |
|---|---|
| substring, contiguous, longest/shortest window, constraint on range | Sliding Window |
| sorted array + target sum, two ends moving inward | Two Pointers |
| sorted input, find element, search space halving | Binary Search |
| cycle detection, linked list mid, start of cycle | Fast & Slow Pointers |
| overlapping intervals, merge/insert/find intersection | Merge Intervals |
| top-K, K-smallest/largest, median, priority | Top K / Heap |
| level order, shortest path, connected components | BFS |
| traversal, DFS, path sum, tree height, all combinations | DFS / Backtracking |
| need next greater/smaller, monotone sequence | Monotonic Stack |
| running totals, subarray sums, range queries | Prefix Sum |
| indices as values, find missing/duplicate | Cyclic Sort |

---

### PATTERN PATH — Step 4P: Reason

**Scoring:** 🧩 Problem Solving + 💬 Communication

**Hadriel asks (before a single line of code is written):**
- "A: What does brute force look like, and why is it too slow?"
- "B: What does this pattern do instead? What changes?"
- "C: What INVARIANT keeps the solution valid at every step?"

**Wiganz must answer all three before coding:**

**A — Brute Force + Why Bad:**
> "Check every possible substring, verify each has unique characters. That's O(n³) — O(n²) substrings × O(n) to check each. Way too slow."

**B — What Pattern Does Instead:**
> "Sliding Window: maintain one window with two pointers. Expand the right pointer to include new characters. When a duplicate is found, shrink from the left until the duplicate is removed. Each character is visited at most twice → O(n)."

**C — The Invariant:**
> "The window must contain only unique characters at all times. The moment a character repeats, we shrink from the left. This invariant guarantees every valid window is checked without rechecking old substrings."

**Hadriel watches for:**
- Wiganz answering only A → "Good. Now B — what does Sliding Window actually DO instead of brute force?"
- Wiganz skipping to code after A+B → "Wait — what's the invariant? What RULE keeps this correct at every step?"
- Weak invariant statement → "Make it concrete. At any moment, what is ALWAYS true about the window?"

---

### FIRST PRINCIPLES — Step 3F: Explore

**Scoring:** 🧩 Problem Solving + 💬 Communication

**Hadriel guides through 6 techniques in order. Stop when something clicks.**

**A — Visualize / Draw It**
- Hadriel: "Draw the data structure. For arrays, boxes with values. For trees, nodes and edges. For matrices, the grid."
- Key for: trees, graphs, matrices, linked lists, any spatial relationship problem
- Mall problem → Draw the timeline. Color-code enter/exit. Track running count visually.

**B — Solve It Manually**
- Hadriel: "Pretend you're NOT a programmer. Walk through the input step by step. What's the count after each event? WRITE IT DOWN."
- Force Wiganz to find "Rules Discovered": concrete rules that emerge from the manual trace
- Mall example Rules Discovered: "Add on enter, subtract on exit. Only check for peak when timestamp changes. DON'T check mid-timestamp."

**C — Generate More Examples**
- Hadriel: "Give me a normal case. Now an edge case. Now a TRICKY case — where would a naive solution break?"
- The tricky case is where the insight lives.
- Mall: tricky case = same-timestamp events → must batch ALL before checking peak

**D — Try Common Data Structures**
- Hadriel: "Go through the decision table. Do you need lookup? Priority? Order? Connections?"

| If you need... | Try... | Example |
|---|---|---|
| O(1) lookup, counting, grouping | HashMap | Two Sum: store {value: index} |
| Parsing nested structure, matching | Stack | Valid Parentheses: push/pop |
| Top-K, min-K, median, priority | Heap | K Closest Points: max-heap of size K |
| Uniqueness, set operations | Set | Longest Substring: chars in window |
| String prefix lookup | Trie | Autocomplete: search by prefix |
| Relationships, connections, paths | Graph + BFS/DFS | Number of Islands: DFS from each '1' |

**E — Decompose**
- Hadriel: "Break it into 2 smaller independent pieces. What are they? Solve each separately."
- Mall: (1) process each event, (2) detect timestamp boundaries, (3) check peak at boundary
- Group Anagrams: (1) hash each string to canonical form, (2) group by hash

**F — Brute Force First**
- Hadriel: "Just get SOMETHING working. What's the simplest possible solution, even O(n³)?"
- Key insight: the bug in brute force often reveals the optimal fix
- Mall brute force bug: checking peak after every event → fix: check only at timestamp boundary → THAT IS the optimal solution

**Hadriel watches for:**
- Wiganz skipping straight to E or F → "Let's draw it first. What does the data look like visually?"
- Wiganz saying "I don't see anything" → "What did your manual trace REVEAL? What rules did you discover?"
- Giving up after 2 techniques → "We have 6 techniques. We've tried 2. What does the data structure table say?"

---

### 🧯 IF STUCK — 6 Lifelines

Use in ORDER before asking Hadriel for a hint.

1. **State what you know** — restate constraints, inputs, expected outputs out loud
2. **State the brute force** — there is ALWAYS one. "I could check every pair in O(n²)..."
3. **Draw it** — trace through the small example on paper. What changes at each step?
4. **Ask: what data structure fits?** — lookup→HashMap, priority→Heap, order→Stack, connections→Graph
5. **Break it down** — can you split into two smaller sub-problems? Solve each separately?
6. **Ask for a hint** — use the pre-built phrase below

**Pre-built phrases Wiganz says (never go silent):**
> "Give me a moment to think through this..."
>
> "My first instinct is [brute force] — that's O(X). Let me see if I can improve on that."
>
> "I'd like to start with [brute force] and optimize from there. Sound good?"
>
> "Let me work through a small example by hand to see if I can spot the pattern..."
>
> "I'm stuck on finding an efficient approach. Could you give me a hint on the direction?"

---

### STEP 3 — Discuss

**Scoring:** 💬 Communication + 🧩 Problem Solving

**Hadriel says:** "Don't touch the keyboard yet. Present your plan. Get the green light."

**Wiganz's 4-part structure (in order):**
1. **Name the approach** — "I'll use a sliding window with a HashSet"
2. **Walk through numbered steps** — "Step 1: initialize... Step 2: expand right... Step 3: shrink left when duplicate..."
3. **State complexity** — time AND space: "Time O(n), space O(k)"
4. **Get the green light** — "Does that make sense? Shall I code it?"

**Wiganz also explains WHY it works (3 parts):**
- What does brute force do?
- What does your approach do INSTEAD? (the insight)
- What's the invariant? (if there is one)

**3 Scenario Phrases:**

*Found the optimal approach:*
> "My approach is [X]. Time O(n), space O(n). Since we need to look at every element at least once, O(n) is the theoretical floor — this is optimal. Shall I code this up?"

*Found better than brute force:*
> "Brute force would check every pair — O(n²). But I noticed [insight], so I can use [approach] for O(n) time with O(n) space. The tradeoff is extra memory, but we gain a lot on time. I'll go with the optimized version — sound good?"

*Only have brute force:*
> "My current approach is [brute force] at O(n²). I think there might be a way to optimize this, but I'd like to get a working solution first. Does that work for you?"

**DO / DON'T:**

| ✅ DO | ❌ DON'T |
|---|---|
| Mention time AND space complexity | Start coding before getting buy-in |
| Explain the key insight, not just the steps | Give only the complexity without the reasoning |
| Briefly acknowledge brute force | Over-explain every detail — keep it 30–60 seconds |
| Ask for confirmation before coding | Say "I think this might work" — be confident |

**Hadriel watches for:**
- Wiganz starting to code without saying "shall I?" → "Stop. Did you get the green light?"
- Stating complexity without the insight → "WHY does it work? What's the key insight vs. brute force?"
- Wiganz saying "I think this might work" → "Don't hedge. State it. If you're unsure, say 'I believe this is correct — let me verify after coding.'"

---

### STEP 4 — Code

**Scoring:** ⌨️ Technical Competency + 💬 Communication

**Phase 1 — Blueprint (3 steps):**
1. Write the **function signature**
2. Write **numbered comments** — transcribe the exact steps you said in Discuss
3. Add **guard clauses** at the top if needed (edge cases)

**Bridge mantra: Spoken → Written → Code**

> "Let me write out the steps as comments first — I find it helps to see the plan before I fill in the code."

**Example Blueprint (Longest Substring):**
```python
def lengthOfLongestSubstring(s):
    # Edge: empty string → return 0
    # 1. Initialize left=0, seen={char:index}, max_len=0
    # 2. Expand right pointer through string
    # 3. If char in seen AND inside window → jump left to seen[char]+1
    # 4. Update seen[char] = right, update max_len
    # 5. Return max_len
```

**If Wiganz freezes in Discuss and has no steps — 5 recovery questions:**
1. What's my function signature?
2. What state do I need to track? (variables, data structures)
3. What does my main loop do at each step?
4. What are my edge cases? (guard clauses at the top)
5. What do I return, and when?

**Phase 2 — The Cooking Show Rule (narrate INTENT, not ACTION):**

| ✅ SAY THIS (intent) | ❌ NOT THIS (action) |
|---|---|
| "I'm using a HashMap here because I need O(1) lookup for complements." | "I'm creating a variable called hashmap equals open curly brace..." |
| "This condition handles the edge case where the input is empty." | "I'm typing if len s equals zero..." |
| "I'm writing a helper function because this logic will repeat." | "Now I'm defining a function..." |

**NARRATE WHEN:**
- Starting a new section of logic
- Making a data structure choice
- Handling an edge case
- Writing a loop — state what it iterates and WHY
- Making a tradeoff decision

**STAY SILENT WHEN:**
- Typing obvious boilerplate (imports, function signature already explained)
- Writing simple syntax you've already described
- Deeply concentrating — "Give me a second to think through this condition" is always acceptable

**DO / DON'T:**

| ✅ DO | ❌ DON'T |
|---|---|
| Use meaningful variable names | Go silent for more than 30 seconds without saying anything |
| Modularize when logic repeats | Narrate every single keystroke |
| Handle edge cases as you encounter them (or flag them) | Start over mid-implementation without flagging it |
| Keep the interviewer oriented — brief updates | Write unreadable one-liners to look clever |

**Hadriel watches for:**
- Wiganz going silent → "Talk to me. What are you doing? Why that variable?"
- Wiganz narrating keystrokes ("I'm typing for i in range...") → "Tell me WHY the loop, not what you're typing."
- Wiganz starting over without warning → "If you need to restart, say so: 'I realize my approach has an issue — let me adjust the structure.' Don't just silently rewrite."
- Wiganz skipping Blueprint → "Wait. Comments first. Transcribe exactly what you said in Discuss."

---

### STEP 5 — Verify

**Scoring:** 🧪 Testing + 💬 Communication

**Hadriel says:** "Don't just say 'I think it works.' Prove it. Follow the protocol."

**5-Phase Verify Protocol (follow this order):**

| Phase | Duration | Out Loud? | What to do |
|---|---|---|---|
| Quick scan | ~15–30 sec | Silent | Eyeball for obvious bugs: off-by-one, missing return, wrong variable name |
| Fix if needed | Quick | Brief narration | "Ah, this should be `<=` not `<`" — fix it, move on |
| Trace example | 1–2 min | OUT LOUD | Walk through variable by variable with the original example input |
| Edge cases | ~30 sec | OUT LOUD | Test empty, single element, all same values, tricky boundary |
| State complexity | ~10 sec | OUT LOUD | "Time O(n), space O(1)." State it clearly and confidently. |

**6 Common Bugs to Scan For:**
1. Off-by-one errors — `<` vs `<=`? Starts at 0 or 1?
2. Missing return statement — returned at ALL base cases?
3. Wrong variable — using `i` when you meant `j`? Stale variable name?
4. Null/empty not handled — what if input is empty list or None?
5. Mutation bug — modifying input when you shouldn't be?
6. Integer overflow — sum of large ints? (mention if Java/C++)

**Edge Cases by Data Type:**

| Data Type | Edge Cases to Test |
|---|---|
| Array / String | Empty, length 1, all same elements, sorted/reverse-sorted, duplicates |
| Tree | null root, single node, only left children, only right children, skewed tree |
| Linked List | Empty list, single node, two nodes, even/odd length |
| Graph | No edges, single node, disconnected graph, cycle |
| Number | Zero, negative, maximum int, minimum int |

**Pre-built Verify Phrases:**
> "Let me trace through this with the example input..."
>
> "At i=0, count becomes [X]. At i=1, count becomes [Y]..."
>
> "Let me check the edge case — what if the input is empty?"
>
> "I want to check one tricky case — what if all elements are the same?"
>
> "Time complexity is O(n) — one pass. Space is O(k) where k is the character set size."

**Hadriel watches for:**
- Wiganz saying "looks good" without tracing → "Trace it. Out loud. Variable by variable."
- Wiganz testing only the happy path → "What about empty input? All duplicates? Single element?"
- Wiganz forgetting to state complexity → "Before we move on — what's the time and space complexity?"
- Wiganz finding a bug and going silent → "Say what you found: 'I see a bug here — this should be X because Y.' Then fix it."

---

### STEP 6 — Optimize

**Scoring:** 🧩 Problem Solving + 💬 Communication

**Hadriel says:** "Re-read your code FIRST. Make sure it's correct before making it faster."

**Critical warning:** If the interviewer says "can we do better?" — they might mean there's a BUG, not asking for time complexity improvement. Re-read before optimizing.

**The 6-Question Checklist:**
1. **BTTC** — What's the Best Theoretical Time Complexity for this problem? Am I already there?
2. **Repeated work** — Am I computing the same thing multiple times? Could I cache or precompute?
3. **Better data structure** — Would a HashMap / Heap / Set speed up my bottleneck operation?
4. **Redundant work** — Can I terminate early? Unnecessary checks? Can I move work outside a loop?
5. **Space** — Can I modify in-place? Would a different structure use less memory?
6. **Still stuck** — Use the pre-built phrase and ask for a hint.

**If better found → LOOP:** Discuss (Step 3) → Code (Step 4) → Verify (Step 5)

**BTTC Reference:**
| Problem Type | BTTC | Reasoning |
|---|---|---|
| Find one element in unsorted array | O(n) | Must check every element |
| Find element in sorted array | O(log n) | Binary search possible |
| Compare all pairs | O(n²) | n*(n-1)/2 pairs exist |
| Sort any comparison-based data | O(n log n) | Comparison sort lower bound |
| Process every element once | O(n) | Can't skip any element |

**Pre-built Optimize Phrases:**
> "Let me re-read my code first to make sure the logic is correct, then I'll look at where I can optimize..."
>
> "I notice I'm computing [X] twice. If I cache it, I can bring this from O(n²) to O(n). The tradeoff is O(n) extra space. Want me to update the code?"
>
> "I've checked repeated computation, data structure alternatives, and redundant work. My solution is O(n) and BTTC is O(n) — I believe this is optimal."
>
> "I'm not immediately seeing a further optimization. Could you point me toward what I might be missing — is it time, space, or correctness?"
>
> "Actually, let me trace through one more time. I want to confirm the logic is correct before optimizing."

**Hadriel watches for:**
- Wiganz trying to optimize before verifying correctness → "Wait. Did you verify it's correct first? Don't optimize a broken solution."
- Wiganz saying "I'm done" without checking BTTC → "Are you already at the theoretical floor? State the BTTC for this type of problem."
- Wiganz finding something better and immediately recoding → "Stop — Discuss it first. Say it out loud and get the green light before changing the code."

---

### REVIEW — Post-Interview (Practice Only)

**Not a live interview step. Use after practice sessions.**

**Immediately after the session:**
1. Close everything — editor, notes, everything. Fresh slate.
2. Repeat the problem from memory — what was it actually asking?
3. Explain your solution from memory — out loud, no peeking. Where did you stumble?
4. Write down ONE thing you'd do differently next time.

**Deep Optimization Techniques to Study (not for in-interview use):**
- **BTTC analysis** — know the floor before you start
- **Overlapping computation** — cache repeated work (Two-pass prefix product for Product of Array Except Self)
- **Data structure swaps** — sort O(n log n) → max-heap O(n log k) when K << n (K Closest Points)
- **Early termination** — return as soon as answer is known (has_duplicate with set)
- **Memoization** — recursive overlapping subproblems (fib with lru_cache)
- **Move work outside loop** — precompute `n = len(arr)` once
- **In-place modification** — eliminate auxiliary DS when input can be modified (Dutch National Flag / Sort Colors)
- **Trie for prefix problems** — O(m) lookup where m = key length, far better than O(n×m) for n strings

---

## 5. The Two Demo Problems

### Pattern Path: "Longest Substring Without Repeating Characters"

| Step | What Wiganz Says |
|------|-----------------|
| Understand | "Given a string, find length of longest substring with all unique chars. Abstract: longest contiguous slice where all chars are unique. ASCII or Unicode? Empty string → return 0? Return length or substring? → return length, all ASCII, empty = 0." |
| Approach | "'Substring' + 'contiguous' + 'no repeating' → Sliding Window signature. YES to all 3 gates → Pattern Path." |
| Match (3P) | "I see 'substring' and 'contiguous' — that's Sliding Window. 'No repeating characters' tells me when to shrink the window. I'll use a HashMap char→last index." |
| Reason (4P) | "A: Brute force O(n³) — O(n²) substrings × O(n) to check each. B: Sliding Window processes each char once — expand right, shrink left on duplicate, O(n). C: Window must contain only unique chars at all times — the moment a char repeats, shrink from left." |
| Discuss | "Sliding window with HashMap. Steps: 1) left=0, seen={}, max_len=0. 2) Expand right, add s[right] to seen. 3) If duplicate: jump left to seen[s[right]]+1. 4) Update max_len. 5) Return max_len. Time O(n), space O(k). Shall I code it?" |
| Code | Blueprint: write 5 comment steps first. Then fill in. Narrate: "I'm mapping char to index instead of a set so I can jump the left pointer directly." |
| Verify | Trace "abcab" → 3. Edge cases: ""→0, "a"→1, "aaa"→1. Time O(n), Space O(min(n,charset)). |

```python
def lengthOfLongestSubstring(s):
    seen = {}
    left = 0
    max_len = 0
    for right in range(len(s)):
        if s[right] in seen and seen[s[right]] >= left:
            left = seen[s[right]] + 1
        seen[s[right]] = right
        max_len = max(max_len, right - left + 1)
    return max_len
```

### First Principles: "Busiest Time in The Mall"

| Step | What Wiganz Says |
|------|-----------------|
| Understand | "Timestamped enter/exit events, sorted. Multiple same-timestamp events possible. Return timestamp with most visitors. Confirmed: sorted, earliest peak on tie, count ≥ 1, return timestamp." |
| Approach | "No pattern fits cleanly. NO to gate → First Principles." |
| Explore (3F) | "A: Drew timeline — t1 has 3 events, must batch all before checking. B: Manual solve: +14→-4→-8, check=8. Then +10, check=18. Rules: add/subtract, only check at timestamp boundary. C: Tricky example: same-timestamp events must ALL process before peak check." |
| Discuss | "Single pass — running count, check peak only at timestamp boundaries. O(n) time, O(1) space. BTTC is O(n) — already optimal. Shall I code this up?" |
| Code | Blueprint comments: 1) init count/max_count/max_time. 2) loop. 3) add/subtract. 4) if boundary or last: check peak. 5) return. Narrate: "I'm checking at timestamp boundaries because same-timestamp events must be batched." |
| Verify | Trace [[t1,14,1],[t1,4,0],[t1,2,0],[t2,10,1]] → t2. Edge: single event, all same timestamp. Time O(n), Space O(1). |

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

## 6. Key Content in the HTML (v3)

- **Before section:** Self-intro script ("Hi, I'm Tri. 2-3 years Python/Django and React..."), environment setup checklist, mindset anchors
- **9 clarifying questions** (sorted? dupes? nulls? size? return type? modifiable? stored how? only one answer?)
- **Strip the Story table:** 4 concrete decode examples (Fruits→Baskets, Mall, Islands, Two Sum)
- **6 Explore techniques** with concrete Mall Problem examples for each
- **HTML timeline visualization** in Technique A (styled divs, color-coded enter/exit, count tracker)
- **Manual solve walkthrough** with numbered steps and "Rules Discovered" box
- **Brute force with bug-to-fix code** — naive approach reveals the optimal solution
- **BTTC** (Best Theoretical Time Complexity) used in Approach, Discuss, and Optimize
- **Blueprint Phase** (Step 4 Phase 1): "Spoken → Written → Code" bridge. Write comments first, then fill in.
- **Cooking Show Rule** (Step 4 Phase 2): Narrate WHY (intent), not WHAT (action). Table of examples.
- **Verify protocol table**: 5 phases with duration and out-loud guidance
- **Common bug checklist** (off-by-one, missing return, wrong variable, null/empty, mutation, overflow)
- **Edge case table** by data type (Array, Tree, Linked List, Graph, Number)
- **Step 6 Optimize checklist** (6 questions: BTTC, repeated work, better DS, redundant work, space, stuck?)
- **Optimize loop:** Found better? → Discuss (Step 3) → Code (Step 4) → Verify (Step 5) → repeat
- **Pre-built phrases** on every step ("SAY THIS" sections throughout)
- **Do/Don't lists** from Cheatsheet for Discuss, Code steps
- **Two complete demo walkthroughs** — Pattern Path + First Principles, all steps shown

---

## 7. Layout Decisions (HTML)

- **Container:** 1560px max-width (wider for tables and code blocks)
- **Spacing:** 2rem section padding
- **Dividers:** 1rem thin lines
- **Hero:** 40vh min-height
- **Sticky nav:** Horizontal, scrollable on mobile
- **Visual style:** Cormorant Garamond + Inter, warm earth tones, prp-cards with color-coded steps

---

## 8. Key Design Decisions

- **Discuss moved to Step 3** (was merge point at Step 5) — present and get green light BEFORE deep code reasoning
- **Optimize is now Step 6** (was not in old system) — re-read for correctness first, then 6-question checklist
- **Blueprint Phase added** — write comments from Discuss verbatim before any code. Removes blank-page freeze.
- **"Cooking Show Rule"** — the narration principle. Intent not action. Named and defined.
- **6 Lifelines** — explicit ordered protocol for when stuck. Removes panic, restores systematic thinking.
- **Review replaces Prove** — post-interview repetition from memory is practice, not a live step
- **Both paths merge before Discuss** — the fork is only in Understand/Approach, not after
- **"SAY THIS" prompts on every step** — Communication is the meta-skill scored across all steps
- **No placeholders** — every step shows a REAL example with concrete content
