# Valid Anagram — Mistakes & Insights

**Pattern:** Hash Maps / Frequency Counting | **Difficulty:** Easy | **Date:** 2026-04-15

---

## ❌ Mistakes Made

**1. Skipped Blueprint — jumped straight to code**
- Wrote code directly without writing comments first.
- Rule: **Spoken → Written → Code**. Always write numbered comments before implementing.

**2. Used `=` instead of `==` in return**
```python
# Wrong
return s_counter = t_counter

# Correct
return s_counter == t_counter
```
- `=` is assignment. `==` is comparison. Caught by narrating intent out loud.

**3. `counter` instead of `Counter` (case sensitivity)**
```python
# Wrong
from collections import counter

# Correct
from collections import Counter
```
- Python is case-sensitive. `Counter` is a class — always capitalize.

---

## ✅ Clean Solution

```python
from collections import Counter

def isAnagram(s, t):
    # 1. Count frequencies of both strings
    s_counter = Counter(s)
    t_counter = Counter(t)
    # 2. Compare if counts are equal
    return s_counter == t_counter
```

**Time:** O(n) | **Space:** O(1) (bounded by 26 lowercase letters)

---

## 💡 Key Insights

- **Abstract version:** "Check if character frequencies in s equal character frequencies in t"
- **Signal → Pattern:** Frequency counting → HashMap
- **Brute force:** Sort both strings → O(n log n). HashMap is O(n) — already at BTTC.
- **Invariant:** Every character's frequency in s must equal its frequency in t.
- **Empty string:** `Counter("") == Counter("")` → `{} == {}` → `True`. Handled automatically, no special case needed.
