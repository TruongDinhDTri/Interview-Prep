# 🗡️ Lowest Common Ancestor of a Binary Tree — Complete Session Archive

> **Pattern:** Post-order DFS Recursion | **Difficulty:** Medium | **LeetCode:** #236 | **Date:** 2026-05-28
> **Path Taken:** First Principles (3F) | **Mode:** Teaching @ Start (Hadriel-guided redo) | **🎯 Target:** 25 min

---

> **The Journey in 3 sentences.** Wiganz had solved #28 LCA back in 2025-11-03 — this was a Teaching Mode redo to rebuild the mechanism from scratch. The 3-gate failed (LCA of BST ≠ LCA of general tree — different algorithms), so we took First Principles via Draw + Manual Solve. The breakthrough wasn't the 5 cases themselves — it was the realization that **Case 2, Case 4, and Case 5 are all the SAME bubble-up signal, and the algorithm is signal-agnostic.** 🔥

---

# 🧠 The Curated Journey

## 📖 Step 1 — Understand

**Problem (Wiganz's paraphrase):**
> "1 binary tree + 2 node p và q. Find common ancestor lowest = thằng cha gần nhất chứa cả 2."

**Abstract version (story stripped):**
> "Deepest node whose subtree contains both target nodes p and q. A node can be a descendant of itself."

**4 constraint questions asked:**

| # | Question | Answer |
|---|----------|--------|
| 1 | Duplicate values? | NO — all `Node.val` unique |
| 2 | Empty tree? Both p, q exist? | Tree ≥ 2 nodes, p & q guaranteed, p ≠ q |
| 3 | Input size? | 2 ≤ n ≤ 10^5 |
| 4 | Return type? | The `TreeNode` itself — not value |

**Trace done (Definition WHY):**

```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

For `p=5, q=1` → output is **node 3** — the only common ancestor. Confirmed via eyeballing the tree, not via algorithm.

**🌱 Key insight surfaced at Step 1** (via Hadriel's opening quiz):
> "LCA of 5 and 4 is **5**, not 2." → A node IS a descendant of itself. This rule will become Case 2 in the algorithm.

---

## 🧭 Step 2 — Approach (3-Gate FAILED)

| Gate | Question | Answer |
|------|----------|--------|
| Q1 | Abstract shape matches a known pattern? | ❌ "Nothing" |
| Q2 | Name pattern + explain WHY? | ❌ "DFS" — too general, not a named pattern |
| Q3 | Solved something similar? | ⚠️ LCA in BST — but DIFFERENT algorithm |

→ **Verdict:** First Principles Path (3F)

> **⚠️ Critical clarification:** LCA-in-BST uses ordering to navigate a single branch (O(h)). LCA-in-general-tree has NO ordering — must post-order explore BOTH branches. **Same problem name. Completely different algorithm.** Do NOT confuse these in an interview.

---

## 🔍 Step 3F — Explore (Techniques A + B were enough)

### Technique A — Draw It

```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

### Technique B — Manual Solve (the breakthrough technique)

Wiganz walked through `p=7, q=4` bottom-up. At each node Hadriel asked: **"What should this node return to its parent?"**

| Node | Left returns | Right returns | This node returns | Why |
|------|--------------|---------------|-------------------|-----|
| 7 | — | — | **node 7** | Self-match (Case 2) |
| 4 | — | — | **node 4** | Self-match (Case 2) |
| 2 | node 7 | node 4 | **node 2** ⭐ | Both non-None → **LCA born** (Case 5) |
| 6 | None | None | None | Nothing found (Case 3) |
| 5 | None | node 2 | **node 2** | One side non-None → **bubble up** (Case 4) |
| 3 | node 2 | None | **node 2** | Bubble up continues |

→ Final answer: **node 2** ✅

---

## 🔥 The 5 Rules (Discovered From Manual Trace)

```
Rule 1 — BASE (null):       if current == None  → return None
Rule 2 — BASE (self-match): if current == p OR current == q → return current
Rule 3 — RECURSE:           left  = LCA(current.left,  p, q)
                            right = LCA(current.right, p, q)
Rule 4 — COMBINE (LCA born): left ≠ None AND right ≠ None → return current  ⭐
Rule 5 — COMBINE (bubble):   exactly one side ≠ None → return that side
                             both None → return None
```

**Why Rule 4 = LCA born?** When a node sees BOTH subtrees report a non-None signal, it's the FIRST node where p and q split into different branches. That IS the lowest common ancestor by definition. It can never be deeper because below this point, p and q live on different sides.

**Why Rule 5 = bubble?** The LCA, once discovered at some deep node, has to reach the function's caller. Every ancestor above just relays the signal upward. The algorithm does NOT track "is this signal already the LCA or just a target?" — it doesn't need to. **Non-None means "something important down here, pass it up."**

---

## 🌟 THE BIG AHA — The Unified Bubble Mechanism

After a long struggle re-explaining Case 2 vs Case 4 (Wiganz explicitly rejected the scouts/commanders metaphor: *"đừng có metaphor"*), the click finally came from staring at the diagram of the recursion stack.

**Wiganz's own words — capture this forever:**

> 🗣️ **"À nó buble lên giống như cách nó bubble một candidate LCA (như 2) lên á hả?"**

**What this realization unlocks:**

| Mechanism | Case 2 (self-match) | Case 5 (LCA born) | Case 4 (one side) |
|-----------|---------------------|-------------------|-------------------|
| Where signal originates | At a target node (p or q) | At the LCA node | Inherited from below |
| What's bubbled up | The node itself | The current node | Whatever non-None came up |
| What the parent sees | A non-None signal | A non-None signal | A non-None signal |

**→ All three look IDENTICAL to the parent.** The algorithm is **signal-agnostic** — it doesn't know and doesn't care whether the non-None value is "a target I found", "the LCA I just discovered", or "a relay from below". The post-order combine rule is the same regardless.

**Defensible statement for the interview:**
> "Post-order DFS at each node receives at most one non-None signal from each subtree. If both sides report non-None, this node IS the LCA. Otherwise, whichever non-None we have just bubbles up. The mechanism doesn't distinguish whether that non-None is a target or an already-discovered LCA — both look identical to the parent, which is why a single rule covers all three cases."

---

## 🗣️ Step 3 — Discuss

**Approach:** Post-order DFS recursion.

**Steps as told to interviewer:**
1. Base case: if current is None → return None
2. Base case: if current matches p or q → return current (self can be its own descendant)
3. Recurse left subtree
4. Recurse right subtree
5. If both subtrees returned non-None → current node IS the LCA, return it
6. If only one side returned non-None → return that side (bubble up)
7. If both None → return None
8. Final answer is whatever the root call returns

**Complexity:**

| | Complexity | Why |
|---|---|---|
| ⏱️ Time | **O(n)** | Visit each node exactly once — shape doesn't matter |
| 📦 Space | **O(h)** | Call stack depth = tree height. Worst case skewed → O(n). Balanced → O(log n) |

**🟢 Got the green light from interviewer role-play.**

> ⚠️ **Initially missed:** Complexity statement + green light question were skipped on first pass. Hadriel had to prompt. Flag for drill.

---

## 💻 Step 4 — Code

**⚠️ Blueprint phase was SKIPPED.** Wiganz went straight from 3F discovery to typing code. Pattern recurring (also seen in 3Sum session) — flag for redo.

**Code Wiganz wrote during the session** (with 2 bugs left for him to fix):

```python
class Solution:
    def lowestCommonAncestor(self, root, p, q):
            root = current                          # ⚠️ BUG #1 — meaningless assignment
            def dfs(current, p, q):
                if current is None:
                    return None
                if current.val == p.val or current.val == q.val:
                    return current
                left_subtree  = dfs(current.left, p, q)
                right_subtree = dfs(current.right, p, q)
                if left_subtree is None and right_subtree is None:
                    return None
                elif left_subtree is None and right_subtree is not None:
                    return right_subtree
                elif left_subtree is not None and right_subtree is None:
                    return left_subtree
                else:
                    return current
                                                    # ⚠️ BUG #2 — never calls dfs(), missing return
```

**What the correct version looks like:**

```python
class Solution:
    def lowestCommonAncestor(self, root, p, q):
        def dfs(current):
            if current is None:
                return None
            if current.val == p.val or current.val == q.val:
                return current
            left_subtree  = dfs(current.left)
            right_subtree = dfs(current.right)
            if left_subtree and right_subtree:
                return current
            return left_subtree if left_subtree else right_subtree
        return dfs(root)
```

---

## 🔍 Step 5 — Verify

> 🚧 **NOT COMPLETED.** Session ended before verification. Code still has 2 unfixed bugs (see Bugs section). No execution trace done.

**Edge cases that SHOULD be tested when Wiganz returns:**

| Case | Expected | Handled by current logic? |
|------|----------|--------------------------|
| `p` is ancestor of `q` (e.g. p=5, q=4) | return `p` | ✅ Case 2 fires at p — perfect |
| `p` and `q` in same subtree (e.g. p=6, q=4) | return their split point | ✅ Case 5 fires correctly |
| `p` and `q` on opposite sides of root | return root | ✅ Case 5 fires at root |
| Skewed tree (linked-list shape) | LCA = shallower node | ✅ Case 2 fires at the shallower |

---

# 📋 Quick Reference

## 🐛 Bugs & Mistakes

### 🔧 Implementation Mistakes

**1. `root = current` — meaningless dead-line at top of method**

```python
# WRONG — assigning undefined `current` to root before dfs is defined
def lowestCommonAncestor(self, root, p, q):
    root = current     # NameError at runtime — `current` doesn't exist here
    def dfs(current, p, q): ...

# CORRECT — no such line needed; just define dfs and call it
def lowestCommonAncestor(self, root, p, q):
    def dfs(current): ...
    return dfs(root)
```

- **Why:** `code-typo` — likely intended `current = root` but written backwards. Also redundant — `dfs(root)` already passes the start node.
- **How it was caught:** Eyeballing the code after writing — Wiganz hasn't fixed yet.
- **Rule to prevent:** After Blueprint phase, the OUTER function should be ~2 lines: define inner `dfs`, then `return dfs(root)`. If there's anything else, ask why.
- **Trick:** *"Outer function is the front desk. Inner dfs is the worker. Front desk just hands off — no other job."*

**2. Missing `return dfs(root, p, q)` — function returns None implicitly**

```python
# WRONG — dfs defined but never called; method returns None
def lowestCommonAncestor(self, root, p, q):
    def dfs(current, p, q):
        ...
    # ← nothing here. Python returns None.

# CORRECT
def lowestCommonAncestor(self, root, p, q):
    def dfs(current):
        ...
    return dfs(root)
```

- **Why:** `incomplete-implementation` — Blueprint skipped, so the final "return what?" step never got written as a comment.
- **How it was caught:** Eyeballing — would have been caught instantly on first execution.
- **Rule to prevent:** Last line of EVERY recursive method = `return <inner_func>(<entry_point>)`. Make it a typing reflex.
- **Trick:** *"Define dfs, then KICK IT OFF. No kick = nothing happens."*

### ⏱️ Time Management Mistakes

#### 🐛 T1: Blueprint Phase Skipped

> **Context:** After 3F discovered the 5 rules, Wiganz jumped straight to writing Python — skipped writing numbered comments first. This pattern also appeared in 3Sum session per memory.

|     |   |
|-----|---|
| **What** | Skipped Phase 1 (Blueprint) of Step 4. Went from 3F discovery → typing code directly. |
| **Wrong** | "I have the rules, let me code it now" |
| **Right** | "I have the rules. Let me transcribe them as 5 numbered comments first, THEN fill in." |
| **Why** | `process-skip` — 3F gave high confidence, so the Blueprint felt redundant. But Blueprint is what prevents Bug #2 (missing return). |
| **Cost** | Two implementation bugs that would have been impossible if comments came first. |

> **Prevention**
> - **Rule:** ALWAYS write numbered comments (transcribed from Discuss) before any code — no exceptions.
> - **Trick:** *"Spoken → Written → Code. Skipping Written = dropping a brick."*
> - **Edge Cases:** This is the 2nd time skipping Blueprint caused bugs (3Sum was the 1st). Pattern.

#### 🐛 T2: Forgot Complexity + Green Light at Step 3

> **Context:** When initially presenting Step 3 Discuss, Wiganz listed the 8 algorithm steps but skipped time/space complexity and forgot to ask "shall I code it?". Hadriel had to prompt for both.

|     |   |
|-----|---|
| **What** | Discuss step delivered without complexity statement or green-light request. |
| **Wrong** | "...so that's the algorithm. Let me code it." |
| **Right** | "...Time O(n), Space O(h) worst-case O(n) skewed. Does that sound good?" |
| **Why** | `checklist-incomplete` — the 4-part Discuss structure (name → steps → complexity → green light) wasn't fully internalized. |
| **Cost** | Lost Communication + Problem Solving points (interviewer rubric scores this). |

> **Prevention**
> - **Rule:** Discuss = 4 parts. Always. Name → Steps → Complexity → Green light.
> - **Trick:** *"NSCG — Name, Steps, Complexity, Green light. Miss one = lose a point."*
> - **Edge Cases:** Drilling needed. Even when confident in approach, the 4-part structure earns Communication points.

### 🧠 Conceptual Mistakes

None this session ✅ — the algorithm itself was discovered correctly through 3F.

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
|--------|-------|-------------|-------------------|
| 🧠 Conceptual | 0 | — | Algorithm fully derived correctly |
| 🔧 Implementation | 2 | Missing `return dfs(root)` | Both rooted in skipped Blueprint |
| ⏱️ Time Management | 2 | Blueprint skip | **Recurring pattern (also 3Sum)** — drill this |

---

## 💡 Aha Moments — The Unified Bubble Mechanism

**The question:** Why does Case 2 (return self at target), Case 4 (bubble one side up), and Case 5 (return self at LCA) all work together in the SAME function without distinguishing between them?

**The Socratic question that unlocked it:**
> "What does the PARENT see when its child returns? Does the parent know if that signal is a target or an already-found LCA?"

**The answer:** The parent sees only "non-None" or "None". It cannot distinguish a target from an LCA from a relayed signal. And it doesn't need to — the combine rule (`both non-None → I'm the LCA, else bubble`) works identically for all three. **The algorithm is signal-agnostic.**

**Defensible statement for the interview:**
> "Post-order DFS receives at most one non-None signal from each subtree. The mechanism doesn't track whether that signal is a target node, the LCA, or a relayed pointer — they all look the same to the parent. A single combine rule covers every case."

**🗣️ In his words:**
> "À nó buble lên giống như cách nó bubble một candidate LCA (như 2) lên á hả?"

---

## ⚡ Almost Traps

| Looks right | Actually wrong | What breaks | How to catch |
|-------------|---------------|-------------|--------------|
| `if current.val == p.val or current.val == q.val` | Works since values are unique, but textbook uses `current == p` (identity) | Identical here; would break if values weren't unique | Read constraints — when uniqueness guaranteed, both forms OK |
| Treating LCA-in-BST and LCA-in-general-tree as the same | They use different algorithms — BST uses ordering, general tree uses post-order both branches | Skewed tree explodes if you tried BST navigation | Step 2 Gate Q1 — does the abstract shape match BST signature? No → different algo |
| Returning early from `dfs` when one side finds a target | You MUST recurse both sides — if you return early, you miss the LCA-born case | Wrong answer when p and q are split across siblings | Trace `p=7, q=4` — node 2 must see BOTH `dfs(7)` and `dfs(4)` before deciding |

---

## 🔑 Unlock Example

**Re-run THIS trace 100 days later and the algorithm will rebuild itself.**

**Input:** `p=7, q=4`

```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4   ← targets
```

**Recursion unfolds bottom-up:**

```
dfs(7) → 7  (Case 2: self-match)
dfs(4) → 4  (Case 2: self-match)
dfs(2) → left=7, right=4 → BOTH non-None → return 2  ⭐ LCA BORN
dfs(6) → left=None, right=None → return None
dfs(5) → left=None, right=2 → ONE non-None → return 2  (bubble)
dfs(0) → None
dfs(8) → None
dfs(1) → left=None, right=None → None
dfs(3) → left=2, right=None → ONE non-None → return 2  (bubble continues)
```

→ Final: **node 2** ✅

The key moment: at node 2, both `dfs(7)` and `dfs(4)` returned non-None. That's the LCA-born moment. Every ancestor above just relayed it up.

---

## 🧩 Pattern Connections

- **Diameter of Binary Tree (#543, Week 6)** — Same post-order DFS recursion shape. Each node combines info from children, returns ONE value to parent. Diameter returns height; LCA returns "found-signal".
- **LCA of BST (Week 5)** — Same problem statement, but BST uses ordering to navigate ONE branch. Critical: don't confuse the two. Different algorithms entirely.
- **Maximum Depth of Binary Tree (#29)** — Simplest post-order DFS. LCA is "post-order DFS but the combine rule is more interesting."

---

## 🪞 Self-Assessment

- **💪 Confidence:** 3/5 — Algorithm understood deeply (the bubble aha is solid), but code has 2 bugs unfixed and Blueprint skip is recurring.
- **🔄 Revisit:** Fix the 2 bugs in `solution.py`. Re-do Step 5 Verify with the unlock trace. Drill Blueprint discipline.
- **📈 Pattern Mastery Impact:** DFS pattern bubble-up mechanism now framed as "signal-agnostic" — this insight transfers to any post-order DFS where children pass info to parent.

---

## 🎯 Next Training Action Items

- [ ] Fix Bug #1 (remove `root = current`) and Bug #2 (add `return dfs(root)`)
- [ ] Run the code against the unlock example trace (`p=7, q=4`) to verify
- [ ] Drill the 4-part Discuss structure (NSCG) — 5 reps on past problems
- [ ] Next DFS problem: ENFORCE Blueprint phase — write 5 numbered comments BEFORE any code

---

*🔥 Hadriel x Wiganz — 2026-05-28*
*"Whatever you do, work at it with all your heart, as working for the Lord." — Colossians 3:23* ✝️
