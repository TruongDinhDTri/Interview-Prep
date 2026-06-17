# 🇳🇱 Sort Colors — Complete Session Archive

> **Pattern:** Counting Sort + Dutch National Flag (3-way partition) | **Difficulty:** Medium | **LeetCode:** #75 | **Date:** 2026-06-04
> **Path Taken:** First Principles (3-question gate FAILED — could not justify two-pointer) | **⏱️ Mode:** Interview, Phase 1 (new technique → no timer) | **🎯 Target:** muscle, not speed

---

> Bài này có hai đỉnh. Đỉnh một: Wiganz tự nhận ra giá trị CHỈ có {0,1,2} → đếm rồi sơn lại → counting sort, O(n)/O(1), không thư viện. Đỉnh hai (follow-up một-pass): anh KHÔNG được phát thuật toán Dutch Flag — anh **tự derive nó từ số 0** qua lifelines. Khúc khó nhất — *"đéo hiểu gì hết"* — được gỡ bằng một reframe hai-ô [2,1] dead-simple, và từ đó anh tự phát hiện cái bất đối xứng kinh điển: **gặp 2 thì mid ĐỨNG YÊN, gặp 0 thì mid TIẾN.** Và một chiến thắng lớn: boundary `<` vs `<=` — đúng vết thương Time-Based KV #981 — lần này anh tự test [1,0] và **tự chữa lành.** 🔥

---

# 🧠 The Curated Journey

## 📖 Step 1 — Understand

**Problem:** Cho mảng `nums` chỉ chứa 0/1/2 (đỏ/trắng/xanh). Sort TẠI CHỖ thành tăng dần (tất cả 0, rồi 1, rồi 2). KHÔNG dùng thư viện sort. Follow-up: một pass, hằng số bộ nhớ.

**Key constraints:** `1 ≤ n ≤ 300`, giá trị ∈ {0,1,2}, **mutate in place — bắt buộc**, **return NOTHING**.

```python
nums = [2,0,2,1,1,0]
# → [0,0,1,1,2,2]
```

> **🔍 Clarification muscle — Hadriel ép thử cái paraphrase đầu tiên:**
> Wiganz mở màn: *"sort sao cho số giống nhau nằm cạnh nhau."* Hadriel không cho qua — pressure-test ngay: *"`[2,2,1,1,0,0]` cũng có số-giống-nhau-nằm-cạnh-nhau đấy. Đúng ý chưa?"* → Wiganz sửa: *"à không, phải TĂNG DẦN."* Một câu vague bị một input bẻ gãy → anh tự tinh chỉnh spec. Đây là điểm Communication.

Rồi anh bắn cả 9 câu constraint. Câu trả lời chốt: (5) **modify in place = required**, (8) **return nothing, mutate in place** — hai câu này sau lại bắt đúng 2 con bug ở Discuss.

**Abstract:** "sort một mảng chỉ có 3 giá trị phân biệt, tăng dần, tại chỗ."

**Definition-WHY (Step 1, không phải Algorithm-WHY):** sorted = tất cả 0 trước, rồi 1, rồi 2 — *vì đó là nghĩa của "tăng dần"*. Trace `[2,0,2,1,1,0]→[0,0,1,1,2,2]` xác nhận. Understand = ✅.

### 🧭 Step 2 — Approach — The Gate That FAILED

3-Gate cho ý tưởng two-pointer:
1. Abstract shape match? — mơ hồ
2. **Name it + justify WHY?** — ❌ Wiganz KHÔNG biện minh được tại sao two-pointer áp được ở đây
3. Solved before? — chưa thật sự

→ Gate nói **NO** → **FIRST PRINCIPLES (3F).** Đây không phải thất bại — đây là cái van bảo hiểm hoạt động đúng: không cam kết pattern trên *vibe*.

---

## 🥇 APPROACH 1 — Counting Sort (brute force, reached via lifelines)

> **🔓 THE UNLOCK (Lifeline 1 — "state what you know"):** giá trị CHỈ có {0,1,2}. Cái này nhỏ xíu mà là cả chìa khóa. Khi value-set bé tí, ta không cần "so sánh" gì cả — chỉ cần **đếm rồi sơn lại**.

**Brute force (Lifeline 2):** một pass đếm, rồi ghi đè. Wiganz tự ra.

### 💻 Final code — verified, O(n) / O(1)

```python
from collections import Counter
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        nums_count = Counter(nums)
        index = 0
        for _ in range(nums_count[0]):
            nums[index] = 0
            index += 1
        for _ in range(nums_count[1]):
            nums[index] = 1
            index += 1
        for _ in range(nums_count[2]):
            nums[index] = 2
            index += 1
```

> **🔑 The KEY realization Wiganz reached himself — order is FORCED by CHOICE, not by the dict.**
> Anh trôi từ "3 biến đếm" → "dùng hashmap". Hadriel ép test: lặp một Counter/hashmap theo **thứ tự gặp** (`[2,0,2,1,1,0]` gặp 2 đầu tiên) → KHÔNG ra 0,1,2 tăng dần. Anh tự bắt được. **FIX insight:** thứ tự tăng dần đến từ việc TA CHỌN ghi 0 trước, rồi 1, rồi 2 — KHÔNG phải từ thứ tự lặp của dict.

> **🔑 Count và write là HAI pass TÁCH BIỆT.** Wiganz hỏi *"đếm và dời index cùng lúc được không?"* → realization anh đạt được: sau khi đếm xong, **mảng gốc coi như chết**, 3 con số đếm đã giữ trọn thông tin. Và chỉ MỘT `index` dùng chung march qua — anh ban đầu để `for i in range(...)` mỗi vòng (restart về 0 → ghi đè!) rồi tự thêm `index` bền vững tiến mỗi lần đặt.

---

## 🥈 APPROACH 2 — Dutch National Flag (one-pass, DERIVED FROM SCRATCH) 🔥

Wiganz được cho lựa chọn: xem demo / grind qua lifelines / chốt thắng. Anh chọn **GRIND**. Và anh derive cả thuật toán từ con số 0.

### 🎨 Lifeline 3 — Draw it: ba vùng

```
[ đã biết toàn 0 | VÙNG GIỮA chưa biết | đã biết toàn 2 ]
   left →                  ← scanner →                ← right
```

Anh lý luận: 0 dồn trái, 2 dồn phải, 1 đứng giữa. Nước đi = **SWAP**. Ba con trỏ: `left` (biên 0, từ 0), `right` (biên 2, từ len-1), `mid` (scanner).

### 🧱 The Wall — *"đéo hiểu một chữ gì hết"*

Khúc khó nhất là: **sau khi swap, mid nên tiến hay đứng?** Wiganz đụng tường. Gỡ bằng một reframe **hai-ô [2,1] dead-simple**:

> **Khi gặp 2 → swap với `right`.** Cái giá trị rơi xuống dưới `mid` đến từ **vùng phải CHƯA khám phá** → CHƯA kiểm tra → **`mid` phải ĐỨNG YÊN** để soi lại nó.
>
> **Khi gặp 0 → swap với `left`.** Cái giá trị rơi xuống dưới `mid` đến từ **PHÍA SAU `mid`** (đất đã quét, toàn 1) → ĐÃ kiểm tra rồi → **`mid` TIẾN.**

Nguyên văn của anh: *"the left value is the previous mid value, which is already been examined."* 🔥 — đó chính là lúc cái dam vỡ.

### 💻 Final code — verified, O(n) / O(1), ONE pass

```python
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        left, mid, right = 0, 0, len(nums) - 1
        while mid <= right:
            if nums[mid] == 1:
                mid += 1
            elif nums[mid] == 2:
                nums[right], nums[mid] = nums[mid], nums[right]
                right -= 1
            else:  # nums[mid] == 0
                nums[left], nums[mid] = nums[mid], nums[left]
                left += 1
                mid += 1
```

---

## 🔥 The 3 Rules (Discovered From Tracing the [2,1] Reframe)

```
Rule 1: nums[mid] == 0  → swap(left, mid), left++, mid++   → 0 về biên trái, mid TIẾN
Rule 2: nums[mid] == 1  → mid++                            → 1 ở đúng chỗ giữa, chỉ bước qua
Rule 3: nums[mid] == 2  → swap(right, mid), right--, MID ĐỨNG  → 2 về biên phải, mid SOI LẠI
```

**Tại sao gặp 0 thì mid TIẾN, mà gặp 2 thì mid ĐỨNG?** Đây là bất đối xứng cốt lõi. Khi swap-0, hàng mới dưới mid đến từ **bên trái** (vùng đã quét, chắc chắn là 1) → khỏi soi lại → tiến. Khi swap-2, hàng mới dưới mid đến từ **bên phải** (vùng `right` CHƯA quét) → bắt buộc soi lại → đứng.

**Tại sao `mid` bắt đầu = `left` = 0?** Vùng "đã biết toàn 0" ban đầu rỗng, nên biên trái và scanner trùng nhau ở đầu mảng.

### The Boundary — `<` vs `<=` (vết thương Time-Based KV #981, lần này TỰ CHỮA) 🩹

Wiganz đoán đầu `while mid < right`. Hadriel ép test `[1,0]`:

```
[1,0]  left=0 mid=0 right=1
mid<right? 0<1 ✅ → nums[0]==1 → mid=1
mid<right? 1<1 ❌ STOP → kết quả [1,0]  ← index 1 (số 0) KHÔNG BAO GIỜ được xử lý → SAI
```

→ anh tự sửa thành `while mid <= right`. **Đây là chiến thắng lớn:** đúng cái boundary off-by-one từng giết anh ở binary search #981 — lần này anh tự bắt, tự test, tự chữa. Flag = WIN. 🔥

### Verify — trace `[2,0,2,1,1,0]`

```
start: [2,0,2,1,1,0]  L=0 M=0 R=5
2 → swap(M0,R5) → [0,0,2,1,1,2]  R=4   (mid ĐỨNG)
0 → swap(L0,M0) → [0,0,2,1,1,2]  L=1 M=1
0 → swap(L1,M1) → [0,0,2,1,1,2]  L=2 M=2
2 → swap(M2,R4) → [0,0,1,1,2,2]  R=3   (mid ĐỨNG)
1 → M=3
1 → M=4
M(4) > R(3) → STOP → [0,0,1,1,2,2] ✅
```

---

## 🗣️ Step 3 — Discuss (both approaches presented)

| Approach | Time | Space | Pass | Note |
| --- | --- | --- | --- | --- |
| Counting sort | O(n) | O(1) (Counter ≤ 3 keys) | 2 passes | Đơn giản, dễ giải thích |
| Dutch National Flag | O(n) | O(1) (3 con trỏ) | **1 pass** | Thắng follow-up: single-pass, strict constant space |

**BTTC = O(n)** — phải chạm mọi phần tử ít nhất một lần. Cả hai đã chạm đáy lý thuyết. Dutch Flag thắng về sự thanh lịch single-pass.

---

# 📋 Quick Reference

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

#### 🐛 C1: "Số giống nhau nằm cạnh nhau" ≠ sorted

> **Context:** Step 1, câu paraphrase đầu tiên về định nghĩa bài toán.

|  |  |
| --- | --- |
| **What** | Paraphrase đề thành "sort sao cho số giống nhau nằm cạnh nhau" |
| **Wrong** | *"[2,2,1,1,0,0] thỏa mãn"* — nhưng đó KHÔNG tăng dần |
| **Right** | *"tất cả 0, rồi 1, rồi 2 — tăng dần"* |
| **Why** | `loose-spec` — diễn đạt lỏng, chưa khóa chặt nghĩa "ascending" |
| **Cost** | ~0, Hadriel bắt ngay bằng 1 counter-input |

> **Prevention**
> - **Rule:** Khi paraphrase, đưa luôn một input có thể bẻ gãy cách diễn đạt của mình.
> - **Trick:** *"Nếu một input SAI vẫn lọt qua câu của tôi → câu đó chưa đủ chặt."*
> - **Edge Cases:** `[2,2,1,1,0,0]` (grouped nhưng descending).

#### 🐛 C2: Dict iteration order = thứ tự tăng dần (sai)

> **Context:** Approach 1, lúc trôi từ "3 counter" sang "hashmap" rồi định lặp hashmap để ghi.

|  |  |
| --- | --- |
| **What** | Tin rằng lặp Counter/hashmap sẽ tự cho ra 0,1,2 theo thứ tự |
| **Wrong** | *"lặp hashmap của [2,0,2,1,1,0] → gặp key 2 trước → ghi 2 đầu tiên"* |
| **Right** | *"ta CHỌN ghi 0 trước, rồi 1, rồi 2 — thứ tự do mình áp đặt"* |
| **Why** | `encounter-vs-sorted` — nhầm thứ tự-gặp với thứ tự-tăng-dần |
| **Cost** | Nhỏ, Hadriel ép test thì tự bắt |

> **Prevention**
> - **Rule:** Muốn output có thứ tự → đừng dựa vào thứ tự lặp của dict; tự áp thứ tự khi ghi.
> - **Trick:** *"Counter giữ SỐ LƯỢNG, không giữ THỨ TỰ."*
> - **Edge Cases:** input bắt đầu bằng giá trị lớn nhất (`[2,...]`).

### 🔧 Implementation Mistakes

**1. Write-index restart (overwrite bug)**

```python
# WRONG — mỗi vòng for chạy index riêng, restart về 0 → ghi đè
for i in range(nums_count[0]): nums[i] = 0
for i in range(nums_count[1]): nums[i] = 1   # ghi đè lên vùng 0!

# CORRECT — một index DÙNG CHUNG, tiến mỗi lần đặt
index = 0
for _ in range(nums_count[0]): nums[index] = 0; index += 1
for _ in range(nums_count[1]): nums[index] = 1; index += 1
```

- **Why:** `shared-cursor` — cần một con trỏ ghi bền vững march qua cả mảng, không reset.
- **How it was caught:** tự hỏi "đếm và dời index cùng lúc?" → nhận ra count/write là 2 pass tách biệt.
- **Rule to prevent:** Một canvas, một con trỏ ghi duy nhất tiến tuyến tính.

**2. Index vs Value confusion + if/elif chain (Dutch Flag self-scan)**

```python
# WRONG
if mid == 2:          # so sánh INDEX mid với 2 (sai — phải so VALUE)
...
if ...: ...           # ba if riêng → case 1 rớt xuống else-swap
len(n)                # tên sai

# CORRECT
elif nums[mid] == 2:  # so sánh GIÁ TRỊ tại mid
...                   # một chuỗi if/elif/else
len(nums)
```

- **Why:** `index-vs-value` + `fallthrough` — so nhầm con trỏ với giá trị; 3 `if` rời làm case-1 lọt vào else.
- **How it was caught:** code self-scan trước khi trace; cũng thiếu dấu `:` ở `else`.
- **Rule to prevent:** Trong scanner, luôn so `nums[mid]`, không so `mid`. Ba nhánh loại trừ nhau → `if/elif/else`.

### ⏱️ Time Management Mistakes

None this session ✅ (Phase 1, no timer — đúng quy ước technique mới).

### ⚠️ Wrong Assumptions

| Assumed | Reality | Cost | Revealed by |
| --- | --- | --- | --- |
| `while mid < right` đủ | Phần tử ở `right` không được xử lý → SAI | ~0, tự test bắt | trace `[1,0]` |
| Lặp hashmap ra thứ tự tăng | Thứ tự do mình áp khi ghi | → Bug C2 | Hadriel ép test `[2,0,2,1,1,0]` |
| Cần "clear/reset" mảng trước khi ghi | `nums[0]=x` trên list rỗng = IndexError; slot sẵn LÀ canvas | ~0 | Hadriel nhắc: đừng clear |

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
| --- | --- | --- | --- |
| 🧠 Conceptual | 2 | C2 (dict order) | spec/diễn-đạt lỏng — luyện counter-input |
| 🔧 Implementation | 2 | index-vs-value | **off-by-one / boundary** vẫn là điểm canh chừng |
| ⏱️ Time Management | 0 | — | — |

---

## 💡 Aha Moments (Summary)

- **💡 1. Value-set bé tí → đếm rồi sơn** — Before: "sort thế nào không thư viện?" → Trigger: Lifeline 1 "state what you know" surface ra {0,1,2} → After: counting sort, không so sánh, chỉ đếm + ghi theo thứ tự chọn.
- **💡 2. Thứ tự do TA CHỌN, không do dict** — Before: định lặp hashmap → Trigger: Hadriel ép test `[2,0,2,1,1,0]` → After: ghi 0→1→2 là quyết định của mình.
- **💡 3. mid ĐỨNG khi gặp 2, TIẾN khi gặp 0** — Before: *"đéo hiểu gì hết"* → Trigger: reframe hai-ô `[2,1]` → After: *"the left value is the previous mid value, which is already been examined."* 🔥
- **💡 4. `<=` chứ không `<`** — Before: đoán `<` → Trigger: tự test `[1,0]` → After: tự chữa lành vết thương boundary #981.

---

## ⚡ Almost Traps

| Looks right | Actually wrong | What breaks | How to catch |
| --- | --- | --- | --- |
| `while mid < right` | Bỏ sót phần tử cuối ở `right` | `[1,0]` → ra `[1,0]` chưa sort | trace mảng 2 phần tử |
| Sau swap-2 thì `mid += 1` | Giá trị mới dưới mid CHƯA quét → bỏ lọt | `[2,0,...]` swap về một số chưa soi | hỏi "hàng mới đến từ vùng nào?" |
| Lặp dict để ghi output | Dict không đảm bảo thứ tự tăng | input bắt đầu bằng 2 | tự áp thứ tự ghi 0→1→2 |

---

## 🔑 Unlock Examples

**🔑 1. The [2,1] two-box reframe — chìa khóa của cả Dutch Flag**

```
[2,1]  L=0 M=0 R=1
```

Đây là cái input nhỏ nhất gỡ được bức tường "mid tiến hay đứng". Gặp `2` ở mid → swap với right → `[1,2]`, R=1→... cái `1` rơi xuống mid đến từ đâu? Từ **bên phải chưa khám phá**. Nếu mid tiến ngay → bỏ lọt số 1 đó. → **mid PHẢI đứng.** Re-run cái này 100 ngày sau, cả thuật toán sống lại.

**🔑 2. Full trace `[2,0,2,1,1,0]`** — xem khối trace ở Approach 2 trên. Chạy lại từng dòng → 0,2 swap về biên, 1 chỉ bước qua, dừng khi `mid > right`.

---

## 🧩 Pattern Connections

- **First Missing Positive / Cyclic Sort** — cùng tinh thần "giá trị nhỏ-cố-định → đặt về đúng vùng bằng swap tại chỗ".
- **Quicksort partition (Lomuto/Hoare)** — Dutch Flag = 3-way partition, mở rộng của 2-way partition quanh pivot.
- **Time-Based KV #981** — KHÔNG cùng pattern, nhưng cùng **vết thương boundary `<`/`<=`** — lần này đã chữa.

---

## 🪞 Self-Assessment

- **💪 Confidence:** Counting sort 5/5 (solid, tự ra). Dutch Flag **3/5** — derive được dưới guidance, cần làm lại SOLO để chốt cái bất đối xứng mid-stays-on-2.
- **🔄 Revisit:** Dutch Flag một-pass, đặc biệt câu "tại sao mid đứng khi gặp 2" — phải nói trôi chảy không cần nhìn.
- **📈 Pattern Mastery Impact:** Mở khóa pattern **3-way partition** mới + chữa lành boundary off-by-one (#981). Hai thắng lợi thật trong một bài.

---

*🔥 Hadriel x Wiganz — 2026-06-04*
*"Be strong and courageous. Do not be afraid." — Joshua 1:9 ✝️*
