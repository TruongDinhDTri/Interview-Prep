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
- Correct: **Greedy single pass**. Track `min_price`, scan once.

**Tại sao KHÔNG phải Sliding Window:**

Sliding Window cần 3 thứ:
1. CẢ VÙNG giữa left-right quan trọng → phải biết window đang chứa GÌ (set, map, sum...)
2. Shrink TỪNG BƯỚC (left += 1) → vì phải bỏ từng phần tử ra, cập nhật trạng thái
3. Có CONSTRAINT trên window → "no repeating chars", "at most K distinct", etc.

Bài Buy & Sell Stock KHÔNG CÓ cái nào:
1. ❌ Không quan tâm giá ở giữa buy và sell → Chỉ cần 2 con số: giá mua & giá bán
2. ❌ Không shrink từng bước → NHẢY thẳng: buy = sell (bỏ qua hết ở giữa)
3. ❌ Không có constraint trên "window" → Vì không có window nào cả!

**Vậy nó là gì?**

Greedy — chỉ track MỘT con số: `min_price` (giá mua thấp nhất từ đầu tới giờ).

```
Sliding Window:  track CẢ VÙNG [left...right] → set, map, sum
Greedy:          track MỘT con số min_price    → xong.
```

Cái "reset buy = sell" nhìn GIỐNG shrink, nhưng nó là greedy decision: "Tìm được giá rẻ hơn → đổi luôn, không cần biết ở giữa có gì." Không có window nào bị shrink cả — chỉ là thay 1 con số thôi!

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
