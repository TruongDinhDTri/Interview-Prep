# Valid Palindrome — Mistakes & Insights

**Pattern:** Two Pointers / String Clean | **Difficulty:** Easy | **Date:** 2026-04-14

---

## ❌ Mistakes Made

**1. Used `=` instead of `==` in return**
```python
# Wrong
return clean_text = clean_text[::-1]

# Correct
return clean_text.lower() == clean_text[::-1].lower()
```

**2. Forgot `.lower()` — case sensitivity**
- `isalnum()` only filters non-alphanumeric chars. It does NOT normalize case.
- `"A"` != `"a"` without `.lower()` → wrong result on "Panama" type inputs.

---

## ✅ Clean Solution

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        clean_text = ''.join(c for c in s if c.isalnum())
        return clean_text.lower() == clean_text[::-1].lower()
```

**Time:** O(n) | **Space:** O(n)
