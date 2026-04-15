# Best Time to Buy and Sell Stock — Mistakes & Insights

**Pattern:** Greedy, Single Pass | **Difficulty:** Easy | **Date:** 2026-04-14

---

## 🔑 The Invariant (LOCK THIS IN)

> At every step `j`, `min_price` = the lowest price seen in `prices[0..j]`
>
> That's what guarantees correctness. You never need to go back — because at every sell day, you already have the best possible buy price.

---

## ❌ Mistakes Made

**1. Wrong pattern name** — Called it Sliding Window. It's not.
- No "contiguous subarray" constraint. No shrinking window.
- Correct: **Greedy single pass**. Track `min_price`, scan once.

**2. Thought "must sell" was required** — Misread the problem.
- If prices only go down → return `0`. You choose NOT to trade.

**3. Initialized `sell = 0` unnecessarily** — Redundant. The `for` loop overwrites it.
- Only need `buy = 0` and `max_profit = 0`.

**4. Mixed tabs/spaces** — Caused `IndentationError` in LeetCode. Always use spacebar only.

---

## 💡 Key Insight

A lower buy price **strictly dominates** any higher one.
For any future sell day, buying lower always gives more profit → never need to revisit old buy days → O(n).

---

## ✅ Clean Solution

```python
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        max_profit = 0
        buy = 0

        for sell in range(len(prices)):
            if prices[sell] < prices[buy]:
                buy = sell
            price = prices[sell] - prices[buy]
            max_profit = max(max_profit, price)
        return max_profit
```

**Time:** O(n) | **Space:** O(1)
