# First Bad Version — Complete Session Archive

**Pattern:** Binary Search (Leftmost True) | **Difficulty:** Easy | **Date:** 2026-04-21

---

## 🗺️ The Journey — How Understanding Built

This problem looked simple but hid two traps: (1) n is NOT an array, and (2) the loop exit condition `left < right` vs `left <= right` causes an infinite loop if wrong. Understanding came through the "two soldiers analogy."

---

## 🎯 Step 1 — Understand

### Paraphrase
> "Given n versions, find the first one that's bad. I can call `isBadVersion(version)` to check. Minimize the number of API calls."

### Constraint Questions Asked
- Is the input sorted? → YES — bad versions are monotonic: once bad, all after are bad
- What to return? → Integer — the version number of the first bad version
- Only 1 valid answer? → YES
- Can n be 1? → YES — handle single version
- n range? → 1 ≤ n ≤ 2³¹ - 1 (huge! → O(log n) needed)
- isBadVersion already defined? → YES — just call it

### Strip the Story
> "Given a monotonic boolean sequence on [1..n] — `[F, F, F, T, T, T]` — find the index of the **leftmost True**."

**MONOTONIC** is the key word. Once True, ALWAYS True after. That's what makes Binary Search valid — without monotonicity, cutting the space in half could skip the answer entirely.

### Signal → Pattern
> "I see we must eliminate half of the search space based on the middle value — that tells me **Binary Search** because that's exactly what Binary Search does."

- Signal: sorted/ordered space + "minimize API calls" + find boundary
- "Minimize calls" = minimize steps = O(log n) = Binary Search

---

## 🧠 Step 2 — Approach (4P Reason)

**A — Brute force + why bad:**
> Check every version 1 to n by calling `isBadVersion` on each. That's O(n) calls — for n = 1,000,000,000, that's a billion API calls. Way too slow.

**B — What Binary Search does instead:**
> Check the middle version. If it's bad, the answer is in the left half (including mid). If it's good, the answer is in the right half (excluding mid). Each step cuts the search space in half → O(log n) calls.

**C — The invariant:**
> The sequence is **monotonic**: `[F, F, F, ..., T, T, T]`. Once a version is bad, all versions after it are also bad. This guarantees that cutting the space in half never skips the first bad version.

---

## ❌ Mistakes Made

**1. Treated `n` as an array**
```python
# Wrong — n is an INTEGER, not an array
left, right = 0, len(n) - 1

# Correct — versions are numbered [1..n], no array exists
left, right = 1, n
```
- `n` is just a number. Search space is `[1, 2, ..., n]`. Never do `len(n)` or `n - 1`.
- **Rule:** When a problem says "n versions", there is NO array — just a count and an API.
- **How the click happened:** Hadriel asked "what should `left` start at?" → Wiganz realized "1, because it's not an array!"

**2. Infinite loop trap — `left <= right` + `right = mid`**
```python
# BROKEN — causes infinite loop when left == right
while left <= right:
    mid = ...
    if isBadVersion(mid):
        right = mid   # ← if left=4, right=4, mid=4 → right=4 → NOTHING MOVES 💀
```
- When `left == right == mid` and `isBadVersion(mid)` is True:
  - `right = mid` → right stays at 4
  - `left <= right` → still True
  - Same state forever → **INFINITE LOOP**
- **How Wiganz understood it:** "ok so mid is 4. left <= right still True. mid AGAIN is 4 again. Infinite?"

**3. Variable name inconsistency — `middle` vs `mid`**
```python
# Wrong — defined as `middle`, used as `mid`
middle = left + (right - left) // 2
if isBadVersion(middle):
    right = mid   # ← NameError! `mid` doesn't exist

# Correct — consistent naming
mid = left + (right - left) // 2
if isBadVersion(mid):
    right = mid
```

**4. Skipped the out-loud trace in Step 5**
- In a real interview, skipping the trace loses **Testing** points.
- The interviewer needs to SEE you prove it works. 30 seconds out loud. Never skip it.

---

## 💡 Aha Moments & Click Points

### The "Two Soldiers" Analogy — Why `left < right` (not `left <= right`) 🎯

This is what finally made `left < right` click:

```
n=5, bad=4: [G, G, G, B, B]
              1  2  3  4  5

left=1, right=5

Step 1: mid=3, isBad(3)=False → left = 4
        [G, G, G, B, B]
                 ↑
              left=4, right still=5

Step 2: mid=4, isBad(4)=True → right = 4
        [G, G, G, B, B]
                 ↑
              left=4, right=4

left < right → 4 < 4 → FALSE → EXIT → return left = 4 ✅
```

- `left` only moves RIGHT when mid is **GOOD** → left is always saying *"everything before me is confirmed good"*
- `right` only moves LEFT when mid is **BAD** → right is always saying *"I'm sitting on a bad version"*
- When they **meet**: left has confirmed everything to its left is good, right is sitting on bad. **Same spot = first bad.** 🎯

**In Wiganz's own words (THE INVARIANT):**
> *"right is saying I'm sitting on the bad. left is saying everything before me is good. The spot where right = left meets is the right spot."*

### Why `right = mid` (not `right = mid - 1`) in Convergence approach
> *"mid might BE the answer — so I can't throw it away. I hit `right = mid` to keep mid in the search space."*

Wiganz said this himself. That's the exact correct reasoning.

---

## 🔄 The Two Valid Approaches

| Approach | Loop condition | When True | Return |
|---|---|---|---|
| **Convergence** ✅ | `left < right` | `right = mid` | `return left` |
| **Track result** | `left <= right` | `result = mid`, `right = mid - 1` | `return result` |

**The fix for the infinite loop is NOT fixing the logic — it's fixing the EXIT condition.** Change `<=` to `<`.

---

## ✅ Clean Solution

```python
def firstBadVersion(self, n: int) -> int:
    left = 1
    right = n
    while left < right:
        mid = left + (right - left) // 2   # overflow-safe
        if isBadVersion(mid):
            right = mid       # mid might BE the answer — keep it
        else:
            left = mid + 1    # mid confirmed good — exclude it
    return left
```

**Time:** O(log n) | **Space:** O(1) — already at BTTC

---

## 📚 Overflow-Safe Mid

```python
# Risky in Java/C++ for large n
mid = (left + right) // 2

# Safe everywhere
mid = left + (right - left) // 2
```
- In Python this doesn't matter (arbitrary precision ints), but mention it in interviews anyway — it signals awareness of low-level constraints.

---

## 🔥 Edge Cases

| Case | Input | Expected | Handled? |
|---|---|---|---|
| Only 1 version | `n=1, bad=1` | `1` | ✅ Loop never runs, returns `left=1` immediately |
| First version is bad | `n=5, bad=1` | `1` | ✅ right keeps shrinking left until `left=right=1` |
| Last version is bad | `n=5, bad=5` | `5` | ✅ left keeps growing right until `left=right=5` |
