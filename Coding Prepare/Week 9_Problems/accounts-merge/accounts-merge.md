# 🏝️ Accounts Merge — Complete Session Archive

> **Pattern:** Connected Components (Graph DFS) | **Difficulty:** Medium | **LeetCode:** #721 | **Date:** 2026-06-03
> **Path Taken:** Pattern Path ("this is Number of Islands") | **⏱️ Mode:** Teaching @ Start (REDO) | **🎯 Target:** muscle, not speed

---

> Sáng nay Wiganz gục: *"thề không hiểu gì, đầu óc trống rỗng."* Không phải dốt — kiệt sức + lần đầu phải **TỰ DỰNG graph từ input thô** (Clone Graph cho sẵn `node.neighbors`, Number of Islands cho sẵn lưới — đây phải tự xây). Chiều quay lại bằng Teaching Mode @ Start và **đập nát nó**. Vũ khí thắng trận: **trace tay Phase 1 như một cái máy ngu** — và chính cái máy ngu đó làm rớt ra cả 3 con bug. This IS Number of Islands. Chỉ thêm một bước: build the bridges.

---

# 🧠 The Curated Journey

## 🌅 The Two Sessions — Sáng Gục, Chiều Đập

Đây là một bài REDO. Buổi sáng Wiganz đã làm gần hết Step 1 + Step 2 sạch sẽ (paraphrase, clarify cả câu xịn *"email có case-sensitive không?"*, tự vẽ graph, tự gọi tên **connected components**, tự suy node=email / edge=chung-account). Nhưng đụng đúng bức tường: **chưa từng tự tay dựng adjacency list từ input thô.** Quá tải → gục.

Chiều, Teaching Mode @ Start, vẫn bám Road — nhưng dồn lửa vào đúng chỗ tường: **Step 4, build the graph, từng viên gạch một.**

> 🔗 **Anchor cả buổi:** "Đây CHÍNH LÀ Number of Islands." Wiganz đã đập con đó 2 lần. Lưới → đồ thị. `'1'` kế nhau → email chung account. Đếm đảo → đếm cụm người. Cùng một muscle.

### 📖 Step 1 — Understand

**Problem:** Cho danh sách account `[name, email1, email2, ...]`. Hai account là CÙNG một người nếu chia sẻ ít nhất một email chung. Gộp lại → mỗi người một dòng: `[name, ...emails-sorted]`. Tên có thể trùng nhau nhưng KHÁC người.

**Key constraints:** quan hệ **transitive** (A–B, B–C ⇒ A,B,C cùng người); tên trùng ≠ cùng người; email phải sort; account có thể chỉ có 1 email.

```python
accounts = [
    ["John","johnsmith@mail.com","john_newyork@mail.com"],
    ["John","johnsmith@mail.com","john00@mail.com"],
    ["Mary","mary@mail.com"],
    ["John","johnnybravo@mail.com"],
]
# → John: [john00, john_newyork, johnsmith]  (3 account chung johnsmith → 1 người)
# → Mary: [mary]
# → John: [johnnybravo]  (trùng tên nhưng KHÔNG chung email → người khác!)
```

→ 4 account → **3 người**. Wiganz tự trace ra điều này từ sáng. Understand = ✅.

### 🧭 Step 2 — Approach

> **The click:** "email = node, chung account = edge, gộp nhóm = connected components." Wiganz tự gọi tên nó từ sáng.

3-Gate: (1) abstract shape match? ✅ "count/gather connected components" (2) name + why? ✅ Graph DFS, vì cần lan theo các cạnh transitive (3) solved before? ✅ **Number of Islands ×2.**

→ **Decision: PATTERN PATH** — Connected Components qua DFS.

**4P — The invariant:** một `visited` set đảm bảo mỗi email được DFS **đúng một lần**. DFS lan từ một email ra hết cụm nối với nó = một người trọn vẹn. Hết cụm → người tiếp theo.

---

## 🌉 The Wall — Build The Graph From Scratch (lần đầu trong đời)

Đây là cái MỚI thật sự. Hai bài graph trước được phát graph sẵn:

| Bài | Graph đến từ đâu |
| --- | --- |
| Clone Graph | Đề cho sẵn `node.neighbors` — chỉ việc đi |
| Number of Islands | Đề cho sẵn lưới 2D — hàng xóm = ô kế bên |
| **Accounts Merge (đây)** | **KHÔNG có graph. Phải TỰ DỰNG từ list account thô.** |

**Viên gạch cốt lõi — undirected = 2 chiều:**

```python
for account in accounts:
    name = account[0]
    emails = account[1:]
    for email in emails:
        email_to_name[email] = name
        adj[email].add(emails[0])      # nối email này → email mỏ neo
        adj[emails[0]].add(email)      # VÀ chiều ngược lại ← đây là chỗ chết
```

> **Vì sao phải thêm CẢ HAI chiều?** "Chung account" là quan hệ **đối xứng** — nếu A chung account với B thì B cũng chung với A. Đối xứng → **undirected** → cạnh 2 chiều. Nếu chỉ thêm 1 chiều, `johnsmith` thấy `john00` nhưng `john00` KHÔNG thấy ngược lại → DFS lan không tới → vỡ cụm.
>
> 🔗 **Đối chiếu: Course Schedule = DIRECTED** (1 chiều). "A phải học trước B" KHÔNG đối xứng → chỉ thêm `adj[A].add(B)`. Cùng adjacency list, khác số chiều — vì quan hệ khác bản chất.

---

## 🐛 The Manual Trace — Cái Máy Ngu Làm Rớt 3 Con Bug

Đây là **trái tim của buổi chiều**, và là bằng chứng cơ Verify/Testing của Wiganz. Sau khi gõ lại solution, Wiganz **không lý luận** — anh đóng vai *cái máy ngu*: chạy Phase 1 từng dòng với giá trị thật. Và 3 con bug tự rơi ra.

> **Quy trình thắng trận (lặp lại được):**
> 1. Gõ lại solution
> 2. **Trace tay Phase 1** như một cái máy — đừng suy luận, cứ điền giá trị thật vào từng dòng
> 3. Trace làm rớt **bug 1 & 2**
> 4. Trace tiếp Phase 2 → làm rớt **bug 3**
> 5. Chạy code thật để xác nhận
> 6. Tự suy complexity từ first principles

### 🪲 Bug 1 + 2 — `emails[1:]` cắt mất mỏ neo và làm Mary biến mất

Code Wiganz gõ ban đầu lặp `for email in emails[1:]`. Trace tay phơi bày 2 vết cùng lúc:

```python
# WRONG
emails = account[1:]
for email in emails[1:]:        # ⚠️ cắt LẦN NỮA → bỏ qua emails[0]
    email_to_name[email] = name
    adj[email].add(emails[0])
    adj[emails[0]].add(email)
```

- **Bug 1:** `emails[1:]` bỏ qua `emails[0]` (= johnsmith) → **johnsmith không bao giờ vào `email_to_name`** → Phase 3 tra tên crash/sai.
- **Bug 2:** Account của Mary = `["Mary","mary@mail.com"]` → `emails = ["mary@mail.com"]` → `emails[1:]` = `[]` → vòng lặp **không chạy lần nào** → **Mary không bao giờ vào `adj`** → **Mary BIẾN MẤT khỏi output.** 😱

```python
# CORRECT — bỏ slice
for email in emails:            # emails[0] cũng được tên, account 1-email cũng chạy
    email_to_name[email] = name
    adj[email].add(emails[0])
    adj[emails[0]].add(email)
```

> **Vì sao fix này giết cả 2 con cùng lúc?** Bỏ slice → `emails[0]` được gán tên (giết bug 1), VÀ account 1-email chạy vòng lặp đúng 1 lần, tạo self-loop vô hại `adj[mary] = {mary}` — bị `visited` guard chặn ngay, nên không hại gì, nhưng đủ để mary lọt vào `adj` và xuất hiện ở output (giết bug 2).

### 🪲 Bug 3 — `def dfs` ĐỊNH NGHĨA nhưng KHÔNG GỌI (vết thương tái phát từ LCA #236)

```python
# WRONG
for email in adj:
    if email not in visited:
        component = []
        def dfs(email): ...      # định nghĩa hàm
        # … rồi KHÔNG có dòng gọi
        result.append(component) # component vẫn rỗng []!
# → Phase 3: component[0] → IndexError 💥
```

```python
# CORRECT
        def dfs(email): ...
        dfs(email)               # ← BẤM NÚT CHẠY
        result.append(component)
```

> 🔁 **Đây CHÍNH LÀ vết thương LCA #236** ("quên `return dfs(root)`"). Gốc rễ: **bỏ qua Blueprint phase** ở Step 4 — không viết comment "gọi dfs(email)" trước, nên gõ xong `def` là quên bấm nút.
>
> ⚠️ **"Code in your head ≠ code on disk":** Wiganz sửa trong chat nhưng FILE chưa save — chạy code thật vẫn crash đến khi dòng `dfs(email)` thực sự được ghi vào đĩa. Bài học nhỏ mà thật: cái fix chỉ tính khi nó nằm trong file.

---

## 🔀 TWO Styles of DFS — Hiểu Cái Này Thì Hết Quên Bấm Nút

Đây là cú click lớn nhất của buổi chiều, giải thích TẠI SAO LCA cần `return` mà bài này thì không.

| | **(A) MUTATION style** — THIS problem | **(B) RETURN-VALUE style** — LCA #236 |
| --- | --- | --- |
| `dfs` trả về gì | `None` | đáp án CHÍNH LÀ giá trị return |
| Đáp án nằm ở đâu | tích lũy vào **biến NGOÀI** (`component`) | nằm trong cái return của dfs |
| Gọi sao cho đúng | `dfs(x)` — **chỉ cần gọi, KHỎI return** | `return dfs(x)` — **phải bắt và chuyền tiếp** |
| Gọi sai thành | (không có cách gọi sai — chỉ cần đừng quên gọi) | `dfs(x)` trần → tính xong rồi **vứt đáp án**, ngoài trả `None` |

```python
# (A) MUTATION — bài này
component = []                 # biến ngoài hứng kết qua
def dfs(email):
    visited.add(email)
    component.append(email)    # ghi vào biến ngoài
    for nb in adj[email]:
        if nb not in visited:
            dfs(nb)            # chỉ gọi — không cần return
dfs(email)                     # bấm nút. xong.

# (B) RETURN-VALUE — LCA
def dfs(node):
    if not node: return None
    left  = dfs(node.left)     # phải BẮT giá trị
    right = dfs(node.right)
    ...
    return answer              # đáp án là return
return dfs(root)               # phải return để chuyền ra ngoài
```

> 🧠 **Self-check reflex (đã drill):** Sau khi viết `def dfs`, hỏi 2 câu:
> 1. **Đã bấm nút chạy chưa?** (đã GỌI nó chưa?)
> 2. **Kết quả có nối dây ra ngoài chưa?** (mutation biến-ngoài, hay return?)
>
> Hai câu này bắt sống cả bug 3 lẫn vết thương LCA.

---

## 🔢 Complexity — Wiganz Tự Derive Từng Bước

Wiganz tự suy ra, không phải nghe đọc. Gọi **N = tổng số email trên tất cả account.**

| Phase | Việc | Cost |
| --- | --- | --- |
| 1 — build graph | duyệt mọi email một lần | O(N) |
| 2 — DFS | `visited` guard ⇒ mỗi email DFS **đúng 1 lần** ⇒ N lời gọi | O(N) |
| 3 — sort | sort email trong các cụm | **O(N log N)** ← thống trị |

**Cộng lại:** O(N) + O(N) + O(N log N) → **số hạng lớn nhất thắng** → **Time = O(N log N)** (do sort).
**Space = O(N)** — `adj` + `visited` + recursion stack.

> 💡 **Cú click quan trọng — DEPTH ≠ TOTAL CALLS.** Ở Phase 2, *tổng số lời gọi* = N (time). Nhưng *độ sâu đệ quy* (stack space, số tầng chồng **cùng lúc**) = chuỗi dài nhất = O(N) ở worst case (tất cả email trong một cụm xếp thành chuỗi). Hai thứ này KHÁC NHAU dù ở đây cùng bằng N: một cái là *tổng công* (time), một cái là *cao nhất tại một thời điểm* (space).

### 📐 Vì sao sort = O(k log k) — đào tới gốc bằng merge-sort

Đây là một aha thật trong buổi:

```
merge-sort chia đôi liên tục:   8 → 4 → 2 → 1
                                 └── 3 lần chia ──┘   = log₂(8) = 3
```

- **`log k` = số TẦNG** = số lần chia đôi k cho tới khi còn 1. `8→4→2→1` là 3 lần = `log₂8 = 3`. Đó CHÍNH LÀ định nghĩa của log.
- **`k` = công MERGE** ở mỗi tầng — mỗi tầng đụng tới cả k phần tử đúng một lần.
- **Nhân lại:** (k công/tầng) × (log k tầng) = **k log k**. Đây là sàn BTTC của mọi comparison sort.

---

### 💻 Step 4 — The Final Code

```python
from collections import defaultdict

class Solution:
    def accountsMerge(self, accounts):
        # ── PHASE 1: BUILD THE GRAPH (undirected → 2 chiều) ──
        adj = defaultdict(set)
        email_to_name = {}
        for account in accounts:
            name = account[0]
            emails = account[1:]
            for email in emails:              # KHÔNG slice — giết bug 1 & 2
                email_to_name[email] = name
                adj[email].add(emails[0])
                adj[emails[0]].add(email)

        # ── PHASE 2: DFS — GATHER CONNECTED COMPONENTS ──
        visited = set()
        result = []
        for email in adj:
            if email not in visited:
                component = []
                def dfs(email):               # MUTATION style: ghi vào component
                    visited.add(email)
                    component.append(email)
                    for neighbor in adj[email]:
                        if neighbor not in visited:
                            dfs(neighbor)
                dfs(email)                    # ← BẤM NÚT (giết bug 3)
                result.append(component)

        # ── PHASE 3: FORMAT OUTPUT ──
        final_output = []
        for component in result:
            name = email_to_name[component[0]]
            row = [name] + sorted(component)
            final_output.append(row)
        return final_output
```

| | Complexity | Reason |
| --- | --- | --- |
| ⏱️ Time | O(N log N) | sort thống trị O(N)+O(N)+O(N log N) |
| 📦 Space | O(N) | adj + visited + recursion stack |
| 🎯 BTTC | O(N log N) | output phải sort email → sàn của comparison sort |

### 🔍 Step 5 — Verify (chính là vũ khí thắng trận)

```python
accounts = [
    ["John","johnsmith@mail.com","john_newyork@mail.com"],
    ["John","johnsmith@mail.com","john00@mail.com"],
    ["Mary","mary@mail.com"],
    ["John","johnnybravo@mail.com"],
]
```

**Phase 1 trace (cái máy ngu):**

```
acct0: johnsmith↔john_newyork ;  name[johnsmith]=name[john_newyork]=John
acct1: johnsmith↔john00       ;  name[john00]=John   (johnsmith giờ 2 hàng xóm = cầu transitive)
acct2: mary↔mary (self-loop)  ;  name[mary]=Mary     ← bug 2 từng làm mary biến mất tại đây
acct3: johnnybravo↔johnnybravo;  name[johnnybravo]=John
```

**Phase 2 trace:** DFS(johnsmith) → {johnsmith, john_newyork, john00}; DFS(mary) → {mary}; DFS(johnnybravo) → {johnnybravo}. 3 cụm.

**Edge Cases:**

| Case | Handled? |
| --- | --- |
| Account chỉ 1 email (Mary) | ✅ (sau khi bỏ slice) |
| emails[0] có vào name map | ✅ (sau khi bỏ slice) |
| Tên trùng, khác người (2× John) | ✅ visited tách cụm |
| Cụm dài thành chuỗi → đệ quy sâu | ✅ O(N) stack, chấp nhận |

### ⚡ Step 6 — Optimize

Đã chạm BTTC O(N log N) (bắt buộc sort output). Union-Find là một lối thay thế nhưng KHÔNG nhanh hơn vì sort vẫn thống trị. Dừng ở đây.

---

# 📋 Quick Reference

## 🐛 Bugs & Mistakes

### 🧠 Conceptual Mistakes

#### 🐛 C1: Undirected = phải thêm 2 chiều

> **Context:** Đang build adjacency list ở Phase 1, code morning chỉ có `adj[email].add(emails[0])` thiếu chiều ngược.

| | |
| --- | --- |
| **What** | Chỉ thêm 1 chiều: `adj[email].add(emails[0])`, thiếu `adj[emails[0]].add(email)` |
| **Wrong** | *"johnsmith thấy john00, nhưng john00 KHÔNG thấy johnsmith"* |
| **Right** | *"chung account = đối xứng → undirected → thêm CẢ HAI chiều"* |
| **Why** | `directed-vs-undirected` — không nhận ra quan hệ "chung account" là đối xứng |
| **Cost** | DFS lan không tới → vỡ cụm; phát hiện trong trace |

> **Prevention**
> - **Rule:** Quan hệ đối xứng → cạnh 2 chiều. Hỏi "A liên quan B thì B có tự động liên quan A không?"
> - **Trick:** "Chung account = bắt tay — bắt tay luôn 2 người." Course Schedule = mũi tên 1 chiều.
> - **Edge Cases:** Cụm transitive A–B–C: thiếu chiều ngược thì C không bao giờ về tới A.

### 🔧 Implementation Mistakes

**1. `emails[1:]` cắt mất mỏ neo + nuốt account 1-email**

```python
# WRONG
for email in emails[1:]:   # bỏ qua emails[0]; account 1-email → loop không chạy
# CORRECT
for email in emails:
```

- **Why:** `off-by-slice` — tưởng phải bỏ phần tử neo, nhưng neo cũng cần tên, và slice rỗng giết account 1-email.
- **How it was caught:** Manual Phase-1 trace — Mary biến mất khỏi output, johnsmith thiếu tên.
- **Rule to prevent:** Lặp TẤT CẢ email; để self-loop vô hại cho `visited` xử lý.
- **Trick:** *"Account 1-email vẫn phải tự xuất hiện — đừng để slice nuốt nó."*

**2. `def dfs` định nghĩa nhưng không gọi**

```python
# WRONG
def dfs(email): ...
# (thiếu dòng gọi) → component = [] → component[0] IndexError
# CORRECT
def dfs(email): ...
dfs(email)
```

- **Why:** `blueprint-skip` — không viết comment "gọi dfs" trước khi code → gõ xong def là quên bấm nút.
- **How it was caught:** Phase 2 trace + chạy thật → IndexError.
- **Rule to prevent:** Sau khi viết `def dfs`, hỏi ngay 2 câu self-check (đã bấm nút? đã nối dây kết quả?).
- **Trick:** *"Định nghĩa cái nút ≠ bấm cái nút."* + *"code trong đầu ≠ code trên đĩa"* (phải SAVE file).

### ⏱️ Time Management Mistakes

#### 🐛 T1: Step 4 rò ngược vào Step 3 (đã xảy ra buổi sáng)

> **Context:** Buổi sáng, đang ở Discuss thì hoảng vì "loop thế méo nào / cú pháp ra sao" → panic → quá tải → gục.

| | |
| --- | --- |
| **What** | Lo lắng cú pháp/loop (việc của Step 4) trong khi đang ở Step 3 Discuss |
| **Why** | `altitude-mixing` — không tách độ cao: Discuss = kể ý định, Code = lo cú pháp |
| **Cost** | Panic, blank-page freeze, góp phần làm buổi sáng gục |

> **Prevention**
> - **Rule:** Discuss chỉ kể Ý ĐỊNH ("đi qua mỗi account, nối email lại") — chuyện gõ-thế-nào để Step 4.
> - **Trick:** *"Kể chuyện cho bạn nghe, chưa cầm bàn phím."*
> - **Edge Cases:** Khi thấy mình lo cú pháp ở Discuss → kéo lên độ cao đúng.

### ⚠️ Wrong Assumptions

| Assumed | Reality | Cost | Revealed by |
| --- | --- | --- | --- |
| Phải bỏ qua email neo trong loop (`emails[1:]`) | Email neo cũng cần tên + account 1-email cần chạy loop | → Bug I1 (Mary biến mất) | Manual Phase-1 trace |
| `def dfs` là đủ để nó chạy | Định nghĩa ≠ gọi | → Bug I2 (IndexError) | Phase-2 trace + chạy thật |

### 📊 Mistake Summary

| Pillar | Count | Most Costly | Pattern Emerging? |
| --- | --- | --- | --- |
| 🧠 Conceptual | 1 | C1 undirected 2 chiều | Lần đầu build graph thô — mechanic mới |
| 🔧 Implementation | 2 | I2 quên gọi dfs | **Blueprint skip tái phát** (giống LCA #236) |
| ⏱️ Time Management | 1 | T1 rò Step 4→3 | Trộn độ cao Discuss/Code khi pattern mới + mệt |

---

## 💡 Aha Moments (Summary)

- **💡 1. Undirected 2 chiều** — Before: chỉ nối 1 chiều → Trigger: "chung account đối xứng không?" → After: đối xứng ⇒ thêm cả 2 chiều; Course Schedule directed để đối chiếu.
- **💡 2. Hai kiểu DFS** — Before: quên bấm nút/quên return → Trigger: so sánh side-by-side mutation vs return-value → After: bài này dùng biến ngoài nên chỉ cần GỌI; LCA dùng return nên phải `return dfs`.
- **💡 3. DEPTH ≠ TOTAL CALLS** — Before: gộp time với space → Trigger: derive Phase 2 → After: tổng lời gọi (time) ≠ tầng chồng cùng lúc (space), dù đều = N.
- **💡 4. sort = k log k tới gốc** — Before: nhớ công thức → Trigger: merge-sort 8→4→2→1 → After: log k = số tầng chia đôi, k = công merge/tầng, nhân = k log k.

> 🗣️ **In his words (sáng):** *"Thề không hiểu gì. Đầu óc trống rỗng."* → (chiều) đập nát nó bằng trace tay. 🙏

---

## 🔑 Unlock Examples

**🔑 1. Phase-1 manual trace — "cái máy ngu" làm rớt mọi bug**

```python
accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],
            ["John","johnsmith@mail.com","john00@mail.com"],
            ["Mary","mary@mail.com"],
            ["John","johnnybravo@mail.com"]]
```

```
Đóng vai cái máy, điền giá trị thật từng dòng:
acct0 → adj: johnsmith↔john_newyork           name: johnsmith,john_newyork → John
acct1 → adj: johnsmith↔john00                 name: john00 → John   (johnsmith = cầu 2 hàng xóm)
acct2 → adj: mary↔mary (self-loop vô hại)     name: mary → Mary   ← bug 2 từng nuốt mary Ở ĐÂY
acct3 → adj: johnnybravo↔johnnybravo          name: johnnybravo → John
DFS: {johnsmith,john_newyork,john00} | {mary} | {johnnybravo} = 3 người ✅
```

> Re-run trace này 100 ngày sau → toàn bộ bài (undirected 2 chiều, slice bug, cụm transitive) sống lại.

---

## 🧩 Pattern Connections

- **Number of Islands** — "Đây CHÍNH LÀ Number of Islands" + một bước build graph. Lưới → đồ thị, đếm đảo → đếm cụm người.
- **Clone Graph (#133)** — cũng DFS đồ thị nhưng được phát sẵn `node.neighbors`; bài này phải tự dựng adjacency list.
- **Course Schedule** — đối chiếu directed: 1 chiều vì "học trước" không đối xứng (đây là 2 chiều vì "chung account" đối xứng).
- **LCA Binary Tree (#236)** — cùng vết thương "quên kích hoạt dfs/return"; ở đó là RETURN-VALUE style, đây là MUTATION style.

---

## 🪞 Self-Assessment

- **💪 Confidence:** 4/5 — sáng 1/5 (gục), chiều lên 4/5. Build-graph-from-scratch giờ đã có hình.
- **🔄 Revisit:** Blueprint phase (vết thương tái phát thứ 2 sau LCA — phải drill "viết comment gọi-dfs TRƯỚC khi code"). Tự code lại từ memory không nhìn.
- **📈 Pattern Mastery Impact:** Connected Components lần đầu áp dụng với graph TỰ DỰNG — nâng tầm hiểu adjacency list + undirected/directed. BFS/DFS pattern thêm vững.

---

*🔥 Hadriel × Wiganz — 2026-06-03*
*"Those who hope in the Lord will renew their strength; they will soar on wings like eagles." — Isaiah 40:31 ✝️*
