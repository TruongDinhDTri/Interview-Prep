# 🗡️ Time Based Key-Value Store — Complete Session Archive

> **Pattern:** Binary Search (boundary / rightmost-≤-target) + HashMap | **Difficulty:** Medium | **LeetCode:** #981 | **Date:** 2026-06-02
> **Path Taken:** First Principles → derived half-elimination himself | **⏱️ Mode:** Interview (strict) | **🎯 Target:** 25 min

---

> 🔴 **CRITICAL — Confidence 1/5 — NEEDS REDO.** 🔴
>
> Wiganz could NOT recognize this was Binary Search at the start ("I can't even know it's Binary Search"). He DERIVED the half-elimination property himself in both directions, held the Blueprint phase (breaking his LCA/3Sum skip pattern), and caught BOTH of his logged weak-area bugs himself in Verify — the `<= t` boundary AND the infamous infinite loop. He even reached for the upper-mid fix on his own. The thinking was strong. The **boundary-binary-search muscle is still fragile.** Re-observe the binary search + BOUNDARY pattern VERY carefully — this is the critical thing to drill.

---

# 🧠 The Curated Journey

## 📖 Step 1 — Understand

**Problem:** Design a `TimeMap`. `set(key, value, ts)` stores a value at a timestamp. `get(key, ts)` returns the value stored at the **largest timestamp ≤ ts**. If none exists (or the key was never set) → return `""`.

**Key constraints that mattered:**

- Timestamps for `set` are **STRICTLY INCREASING per key** → the per-key list is already sorted. No sorting needed. This is the seed of the whole solution.
- `1 ≤ timestamp ≤ 1e7`, up to `2e5` total calls → a linear scan per `get` (O(n) × 2e5 calls) is too slow. We need sub-linear `get`.

```
set("foo","a",1) → set("foo","b",2) → set("foo","x",7) → set("foo","z",12)

internally per key "foo":
  [("a",1), ("b",2), ("x",7), ("z",12)]   ← already sorted by ts (strictly increasing)
```

**Wiganz's locked abstract (saved as the canonical phrasing):**

> "Per key: a sorted list of timestamps with values. For a query t, return the value at the largest timestamp ≤ t, else ''."

That abstract IS the spec. Sorted list + "largest ≤ t" is the entire problem, story stripped.

---

## 🧭 Step 2 — Approach — "I can't even know it's Binary Search"

This is the honest moment. The 3-Gate failed — Wiganz couldn't name a pattern. So we went **First Principles**, and the killer question was about the sorted list:

> **H:** "You have a sorted list of timestamps. For a query `t`, you pick a middle one. If that middle timestamp is bigger than `t` — what do you now KNOW about everything to its right?"
> **W:** "Everything to the right is even bigger... so none of them can be ≤ t. I can throw them all away."
> → 💥 That's **half-elimination**. He derived it himself. No formula handed over.

Then we pushed the mirror direction:

> **H:** "And if the middle timestamp is ≤ t?"
> **W:** "Then everything to the LEFT is smaller, so they're all valid too — but middle is a better candidate, so I keep middle and look right for something even closer to t."
> → 💥 Both branches derived. **This earned the Step-2 gate.** Sorted + halving the search space each step = Binary Search, discovered, not pattern-matched.

→ **Decision:** FIRST PRINCIPLES → landed on **Binary Search (boundary variant)** + a `defaultdict(list)` so each key owns its own sorted list.

---

## 🔥 The 4 Rules (Discovered From First Principles)

```
Rule 1: middle ts >  t   → kill everything ≥ middle   → go LEFT   (right = mid - 1, or right = mid)
Rule 2: middle ts <= t   → kill everything <  middle  → go RIGHT  (left  = mid,     or left  = mid + 1)
Rule 3: invariant — always keep the BEST candidate so far (largest ts ≤ t found yet)
Rule 4: final check must be <= t  (NOT == t) — we want the largest ≤ t, exact match is not required
```

**Why Rule 1 + Rule 2 (the half-elimination)?** Because the list is sorted. If the middle timestamp is already bigger than `t`, every timestamp to its right is *even bigger* — none can be ≤ t, so the whole right half dies. If the middle is ≤ t, it's a valid answer AND a better one than anything to its left, so we keep it and hunt right for something even closer to `t`. Each comparison throws away half → O(log n).

**Why Rule 4 (`<= t` not `== t`)?** The contract is "largest timestamp ≤ t" — the exact `t` may never have been `set`. `get("foo", 8)` must return the value at ts `7`, not `""`. An `== t` check breaks even the happy path. (This was Bug C2 below — caught by tracing.)

---

## 🗣️ Step 3 — Discuss

**Presentation (as told to interviewer):**

1. "`set` just appends `(value, timestamp)` to that key's list. Because timestamps are strictly increasing, the list stays sorted for free — O(1)."
2. "`get` binary-searches that key's sorted list for the rightmost timestamp ≤ t."
3. "If the search lands on a valid candidate, return its value; otherwise return `''`."

**Complexity:**

| | Complexity | Reason |
| --- | --- | --- |
| ⏱️ `set` | O(1) | append to end of list |
| ⏱️ `get` | O(log n) | binary search over the sorted list |
| 📦 Space | O(n) | every `set` stores one entry — this IS BTTC, we must keep all data |

**⚡ Almost trap noticed here:** "binary search for the rightmost ≤ t" *sounds* simple in English, but the boundary template hides two traps that only surfaced in Verify — the `== t` vs `<= t` check (Rule 4) and the infinite loop. Sounding correct ≠ being correct.

---

## 💻 Step 4 — Code (Blueprint HELD ✅ — broke the skip pattern)

Wiganz did NOT skip the Blueprint this time (recurring LCA/3Sum weakness — see memory). He wrote the steps as comments first, then filled them in. 🔥

### Solution A — `left = mid` style (needs CEIL mid)

```python
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.timemap = defaultdict(list)

    def set(self, key, value, timestamp):
        self.timemap[key].append((value, timestamp))

    def get(self, key, timestamp):
        values = self.timemap[key]
        if not values:
            return ""                       # key never set → guard against IndexError
        left, right = 0, len(values) - 1
        while left < right:
            mid = (left + right + 1) // 2    # CEIL mid — REQUIRED because branch keeps via left = mid
            if values[mid][1] > timestamp:
                right = mid - 1              # middle too big → kill right half
            else:
                left = mid                   # middle valid → keep it, hunt right
        return values[left][0] if values[left][1] <= timestamp else ""
```

### Solution B — `left = mid + 1` bisect style (RECOMMENDED DEFAULT — never infinite-loops)

```python
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.timemap = defaultdict(list)

    def set(self, key, value, timestamp):
        self.timemap[key].append((value, timestamp))

    def get(self, key, timestamp):
        values = self.timemap[key]
        left, right = 0, len(values)         # right = len, NOT len-1  (boundaries, not indices)
        while left < right:
            mid = (left + right) // 2        # floor mid — SAFE here because branch advances via mid + 1
            if values[mid][1] <= timestamp:
                left = mid + 1               # valid → push left past it
            else:
                right = mid                  # too big → pull right down
        return values[left - 1][0] if left > 0 else ""   # left = count of ts ≤ t
```

| | Complexity | Reason |
| --- | --- | --- |
| ⏱️ Time | O(log n) per `get`, O(1) per `set` | halving search / append |
| 📦 Space | O(n) | store every entry |
| 🎯 BTTC | O(log n) get / O(n) space | sorted-search floor is log n; must retain all data |

---

## 🔍 Step 5 — Verify — where BOTH logged weaknesses got caught

Test set traced by hand against the code:

```
list for "foo": [("a",1), ("b",2), ("x",7), ("z",12)]   indices 0..3
get("foo", 8)  → expect "x"  (ts 7, largest ≤ 8)
get("foo", 13) → expect "z"  (ts 12, ALL valid → last element)
get("foo", 0)  → expect ""   (none valid, even index 0 has ts 1 > 0)
get("bar", 5)  → expect ""   (key never set)
```

**Trace of `get("foo", 13)` on Solution B (the "all valid" case):**

| step | left | right | mid | values[mid][1] | ≤ 13? | action |
| --- | --- | --- | --- | --- | --- | --- |
| init | 0 | 4 | — | — | — | right = len = 4 |
| 1 | 0 | 4 | 2 | 7 | ✅ | left = 3 |
| 2 | 3 | 4 | 3 | 12 | ✅ | left = 4 |
| stop | 4 | 4 | — | — | — | left == len → return values[3] = "z" ✅ |

**This is insight #7 in action:** `left` ends as `4` = the COUNT of timestamps ≤ 13 = all of them → answer is `values[left-1]` = last element.

**Edge Cases:**

| Case | Handled? |
| --- | --- |
| `get` on key never set (empty list) | ✅ `if not values` (A) / `left == 0` (B) |
| t smaller than ALL timestamps (`t=0`) | ✅ `left == 0` → `""` (B) / final `<=` check fails → `""` (A) |
| t ≥ ALL timestamps (`t=13`) | ✅ `left == len` → last element |
| exact match exists | ✅ `<=` catches it |
| `left == 0` Python `values[-1]` wrap-around | ✅ guard prevents silent return of LAST element |

---

## ⚡ Step 6 — Optimize

Already at BTTC. `get` is O(log n) — the floor for searching a sorted list. `set` is O(1). Space O(n) is unavoidable: we must retain every stored value to answer future queries. No optimization possible — this is the ceiling. ✅

---

# 📋 Quick Reference

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

#### 🐛 C1: Final check `== t` instead of `<= t`

> **Context:** Step 5 Verify, tracing `get("foo", 8)`. The code returned `""` but the hand-trace said `"x"` (ts 7). Code disagreed with the human.

| | |
| --- | --- |
| **What** | Final guard written as `values[left][1] == timestamp` |
| **Wrong** | *`get("foo", 8)` → `""` (because ts 7 ≠ 8)* |
| **Right** | *`get("foo", 8)` → `"x"` (ts 7 is the largest ≤ 8)* |
| **Why** | `boundary-contract-misread` — the contract is "largest **≤** t", exact match is NOT required. `==` silently broke even the happy path. |
| **Cost** | Caught fast via trace, but would have failed ~half of all test cases silently. |

> **Prevention**
> - **Rule:** "Largest ≤ t" problems use `<=` in the final check, never `==`.
> - **Trick:** *"≤ in the spec → ≤ in the code. If the word is 'largest ≤', `==` is a lie."*
> - **Edge Cases:** Query a timestamp that was never `set` (e.g. `t=8` when only ts 7 exists) — `==` returns `""`, `<=` returns the right value.

#### 🐛 C2: Infinite loop — floor mid + `left = mid`

> **Context:** Step 5 Verify, tracing `get("foo", 13)` on the `left = mid` version. left stuck at 3, right at 4, forever. This is Wiganz's **#1 logged weakness — boundary-search infinite loop.** He caught it himself.

| | |
| --- | --- |
| **What** | `while left < right` + `mid = (left+right)//2` (floor) + `left = mid` |
| **Wrong** | *left=3, right=4 → mid=(3+4)//2=3=left → `left = mid` = 3 → NO MOVEMENT → loops forever* |
| **Right** | *Ceil mid `(left+right+1)//2` → mid=4 → left can advance past 3* |
| **Why** | `floor-mid-drifts-left` — integer division truncates toward zero, so the midpoint of two ADJACENT indices rounds to the LOWER (left) one. `left = mid` then re-assigns left to itself = stall. |
| **Cost** | Hard infinite loop = TLE / hang. The single most dangerous boundary-search bug. |

> **Prevention**
> - **Rule:** If a branch keeps via `left = mid` (no `+1`), you MUST use CEIL mid `(left+right+1)//2`. If you use floor mid, the keeping branch must be `left = mid + 1`.
> - **Trick:** *"Floor mid sits on LEFT's lap. `left = mid` = left hugging itself = nobody moves. Push mid right with `+1` so left can escape."*
> - **Edge Cases:** Any `get` whose answer is the LAST element (`t ≥ all ts`) drives left,right to adjacent → triggers the stall.

### 🔧 Implementation Mistakes

#### 🐛 I1: Wrong object / missing `self` (three NameError/index variants)

> **Context:** First coding pass. Three sibling typos all from the same root — referencing the wrong name for the per-key list.

| | |
| --- | --- |
| **What** | `list_value = timestamp[key]` (indexed the int param `timestamp`), then `t` used when param was `timestamp` (NameError), then `timemap[key]` missing `self.` (NameError) |
| **Wrong** | *`timestamp[key]` → `'int' object is not subscriptable`; bare `timemap` / `t` → `NameError`* |
| **Right** | *`values = self.timemap[key]` — correct object, correct `self.`, correct param name* |
| **Why** | `name-binding-slip` — reached for the value `timestamp` instead of the store `self.timemap`, and dropped `self.` / used a nickname `t` that wasn't the parameter. |
| **Cost** | Minor — caught immediately at run, but three separate fixes to chase down. |

> **Prevention**
> - **Rule:** The store is `self.timemap`; the query value is `timestamp`. Never index `timestamp`. Always `self.` on instance state.
> - **Trick:** *"`timemap` is the SHELF, `timestamp` is the TICKET. You read the shelf, you don't index the ticket."*
> - **Edge Cases:** Any first run crashes instantly — these die on the very first `get`.

#### 🐛 I2: Empty list / key-never-set → IndexError

> **Context:** Verify, `get("bar", 5)` on a key never `set`. `values` is `[]`, indexing it throws.

| | |
| --- | --- |
| **What** | Indexing `values[left]` (or `values[-1]`) when `values == []` |
| **Wrong** | *`IndexError` on a key that was never set* |
| **Right** | *`if not values: return ""` (Sol A) or `left == 0 → return ""` (Sol B)* |
| **Why** | `missing-empty-guard` — `defaultdict(list)` happily returns `[]` for an unseen key; no guard = crash. |
| **Cost** | Crash on a documented spec case ("key never set → ''"). |

> **Prevention**
> - **Rule:** Guard the empty list before any index. `defaultdict` gives you `[]`, not a KeyError — so YOU must check emptiness.
> - **Trick:** *"`left == 0` guard does double duty: it catches 'none valid' AND blocks Python's `values[-1]` silent wrap to the LAST element."*
> - **Edge Cases:** `get` on any never-set key; query `t` below all timestamps.

### ⏱️ Time Management Mistakes

None this session ✅ — Blueprint was held (broke the recurring skip), and the derivation stayed systematic.

### ⚠️ Wrong Assumptions

| Assumed | Reality | Cost | Revealed by |
| --- | --- | --- | --- |
| "Exact timestamp match needed" | Largest **≤ t** — exact match never required | → Bug C1 | Tracing `get("foo",8)` by hand |
| "floor mid is always safe" | floor mid + `left = mid` = infinite loop | → Bug C2 | Tracing `get("foo",13)` edge case |

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
| --- | --- | --- | --- |
| 🧠 Conceptual | 2 | C2 infinite loop | **YES — boundary-binary-search is the #1 recurring weak area** |
| 🔧 Implementation | 2 | I1 wrong object | name/self slips on first pass; empty-guard reflex still developing |
| ⏱️ Time Management | 0 | — | Blueprint discipline improving 🔥 |

---

## 💡 Aha Moments (Summary)

- **💡 1. Half-elimination, both directions** — Before: "I can't even know it's Binary Search" → Trigger: *"if the middle ts is bigger than t, what do you know about everything to its right?"* → After: derived "kill the whole right half" AND its mirror himself → earned the pattern.
- **💡 2. WHY mid always drifts LEFT** (Wiganz flagged: *cực kì quan trọng*) — Before: floor vs ceil felt arbitrary → Trigger: integer division truncates toward zero → After: "the midpoint of two adjacent indices ROUNDS DOWN to the lower one — mid lives on left's side."
- **💡 3. The asymmetry of stalling** — Before: thought any `= mid` could loop → Trigger: comparing which pointer freezes → After: "only the pointer that assigns `= mid` with NO `±1` can freeze. `left = mid` + floor-mid freezes; `right = mid` + floor-mid is SAFE because right gets pulled DOWN = progress." This is WHY First Bad Version / Find Peak (which use `right = mid`) never worried, but this problem (which used `left = mid`) did.
- **💡 4. `left` = the COUNT of valid elements** — Before: confused why `right = len` not `len-1` → Trigger: thinking of left/right as BOUNDARIES BETWEEN elements (0..len = len+1 slots) → After: "in Sol B, `left` ends = count of ts ≤ t = first index where ts > t. `left == 0` → none → ''. `left == len` → all valid → last element."

**🗣️ The "1 điều duy nhất cần nhớ" (the one core lesson, locked):**

> **Floor mid → mid trôi về bên trái (drifts left) → `left = mid` đứng yên (stalls) → fix bằng `+1`.**
> Either ceil the mid (`(left+right+1)//2`) so `left = mid` can advance, OR keep floor mid but advance with `left = mid + 1`. Pick ONE template and never mix them.

---

## ⚡ Almost Traps

| Looks right | Actually wrong | What breaks | How to catch |
| --- | --- | --- | --- |
| `while left < right` + floor mid + `left = mid` | floor mid == left when adjacent → no movement | infinite loop on "answer is last element" (`t ≥ all`) | trace the t=13 (all-valid) case explicitly |
| final check `== t` | spec is "largest **≤** t" | every query whose exact ts wasn't `set` returns `""` | trace `get("foo",8)` where only ts 7 exists |
| `right = len - 1` in Sol B | left/right are BOUNDARIES (0..len), need the extra slot | "all valid" (left should reach `len`) becomes unreachable | trace t ≥ all timestamps — left must hit `len` |
| `values[left-1]` without `left > 0` guard | Python `values[-1]` silently wraps to LAST element | `t` below all ts returns last value instead of `""` | trace `get("foo",0)` |

---

## 🔑 Unlock Examples

**🔑 1. The infinite-loop driver — re-run this and the whole boundary lesson comes back**

```
list "foo": [("a",1),("b",2),("x",7),("z",12)]   indices 0..3
get("foo", 13)   with the BAD template: while left<right, floor mid, left = mid
```

```
left=0 right=3 → mid=(0+3)//2=1, ts=2 ≤13 → left=1
left=1 right=3 → mid=(1+3)//2=2, ts=7 ≤13 → left=2
left=2 right=3 → mid=(2+3)//2=2, ts=7 ≤13 → left=2   ← STALL BEGINS
left=2 right=3 → mid=2 again → left=2 → ... FOREVER 🔁
```

Floor mid `(2+3)//2 = 2 = left`. `left = mid` re-assigns left to itself. Nothing moves. **This is the single trace that rebuilds the entire "floor mid drifts left → stall → +1 fix" insight.**

**🔑 2. The three boundary outcomes (Solution B mental model)**

```
list "foo": [("a",1),("b",2),("x",7),("z",12)]   (ts: 1,2,7,12)

t=0   → no ts ≤ 0   → left ends at 0   → left==0 → return ""      (none valid)
t=8   → ts 1,2,7 ≤8 → left ends at 3   → values[3-1]=values[2]="x" (middle)
t=13  → all ts ≤13  → left ends at 4   → values[4-1]=values[3]="z" (last element)
```

`left` is literally the **count of timestamps ≤ t**. 0 → none. `len` → all. In between → answer is `values[left-1]`.

---

## 🧩 Pattern Connections

- **First Bad Version** — same boundary binary search, but uses `right = mid` (with floor mid) → SAFE, never stalls. This problem used `left = mid`, which is exactly the dangerous mirror. The contrast IS the lesson.
- **Find Peak Element** — also `right = mid` style → never had the infinite-loop worry. Same reason as First Bad Version.
- **`bisect_right`** — Solution B is hand-rolled `bisect.bisect_right` on the timestamps; `left` is exactly what `bisect_right` returns. (`bisect.bisect_right([t for _,t in values], timestamp)` then `left-1`.)

---

## 🪞 Self-Assessment

- **💪 Confidence:** 1/5 — *NEEDS REDO.* The thinking was strong (derived half-elimination, held Blueprint, self-caught both weak-area bugs), but the boundary-binary-search template is still fragile under pressure.
- **🔄 Revisit:** Re-observe the binary search + **BOUNDARY** pattern VERY carefully. Drill the floor-mid/ceil-mid/`left=mid`/`left=mid+1` matrix until it's instinct. Default to **Solution B** (bisect style) because it can never infinite-loop.
- **📈 Pattern Mastery Impact:** Confirmed boundary binary search as the #1 weak area. Big conceptual wins logged (why mid drifts left, the stall asymmetry, left = count) — but they need to convert from "understood" to "automatic." Pair with First Bad Version redo to cement the `right=mid` vs `left=mid` contrast.

---

*🔥 Hadriel x Wiganz — 2026-06-02*
*"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." — Joshua 1:9 ✝️*
