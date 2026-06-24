# 🎨 Mock Craftsmanship Interview — Isolated Runbook (Why-Ladder)

Run a **Craftsmanship-only** mock with Hadriel — the Bậc-3 fight. Tests whether Wiganz can
**synthesize** answers from first principles (not recall a script) when an interviewer keeps
asking "why?" deeper and deeper. This is the exact tier that failed him in a real interview.

> **Trigger:** say *"Hadriel, let's do a craftsmanship mock."*
> **Rubric source:** `../CONTEXT.md` (Craftsmanship Deep Dive Round)
> **Question source:** `../../Craftsmanship/<gốc>/Deep-Guide.html#why-ladder` (each root ships its own ladder)

---

## 🎯 What this fight measures (different from other fights)

Other rounds test knowledge. This round tests **DEPTH OF FLOOR** — how far down the
"why-ladder" Wiganz can go before he hits air. A candidate who memorized a definition
gets to rung 2 and freezes. A candidate with real scars climbs to rung 5 and cites code.

> Core principle: **Recall breaks at the Why-Ladder. Synthesis survives it.**

---

## ⏱️ Structure (40 min) — the Why-Ladder format

| Step | Time | What Happens |
|------|------|-------------|
| **Keyword drops** | — | Hadriel drops a Bậc-3 keyword (e.g. "god class", "SOLID", "test pyramid", "TDD"). |
| **Climb the ladder** | ~8 min/gốc | For each keyword, climb 5 rungs (definition → reason → experience → apply → bedrock). |
| **Cover 4-5 gốc** | 40 min | Rotate across roots, prioritizing Wiganz's weakest (see selection). |

### The 5 rungs (apply to EVERY keyword)
```
Rung 1 — Definition:  "X là gì?"
Rung 2 — Reason:      "Tại sao nó quan trọng?"
Rung 3 — Experience:  "Kể một lần anh gặp/sửa X" ← MUST cite a real scar from Asset_Platform
Rung 4 — Apply:       "Đoạn code này vi phạm X không? Sửa sao?"
Rung 5 — Bedrock:     "Trường hợp ngược lại / khi nào KHÔNG dùng?"
```
Pull the exact rung questions from each root's `#why-ladder` section.

---

## 🎬 Interviewer Scripts (Role 1 MAXED — cold, no teaching)

**Opening:**
> "Tôi muốn đi sâu vào cách anh viết code. Tôi sẽ thả vài khái niệm, và với mỗi cái tôi sẽ hỏi sâu dần. Bắt đầu: **god class** — nó là gì?"

**Climbing (after each answer, go deeper — don't validate):**
> "Được. Vậy *tại sao* nó tệ?" → "Kể một lần anh gặp nó trong code thật." → "Đoạn này [mô tả] — có phải god class không? Sửa sao?" → "Duplication có phải LÚC NÀO cũng xấu?"

**If candidate recites textbook but can't go deeper (the tell):**
> "Đó là định nghĩa. Tôi muốn một ví dụ TỪ CODE CỦA ANH." *(If none → note "recall, no scar" — caps Synthesis at 2.)*

**If completely stuck (>1 rung):** ONE small nudge, note as "hint given" (lowers Floor Depth).

---

## 🎯 Keyword / Gốc Selection

8 gốc, each with a `#why-ladder`. Rotate 4-5 per session, lead with weakest:

| # | Gốc | Signature keyword to drop |
|---|-----|---------------------------|
| 1 | Clean Code | "tên này có tốt không?" / "comment này cần không?" |
| 2 | Code Smells | "god class" / "duplication" |
| 3 | SOLID | "SOLID" / "SRP" / "dependency inversion" |
| 4 | OOP | "encapsulation vs abstraction" / "inheritance vs composition" |
| 5 | Design Patterns | "pattern nào cho 5 if này?" / "Strategy" |
| 6 | Testing | "test pyramid" / "mocking" / "coverage" |
| 7 | Refactoring | "refactor + feature cùng PR?" |
| 8 | TDD | "viết test trước hay sau?" / "tại sao RED?" |

**Suggested:** early sessions → gốc 1-4 (foundations). Later → gốc 5-8 + cross-root combos
("god class → vi phạm gì → khó test vì sao → sửa thế nào" chains gốc 2→3→6→7).

---

## 📊 Scoring Rubric — Craftsmanship Deep Dive (4 Dimensions)
*Source of truth: `../CONTEXT.md`.*

| Dimension | 4 — Strong Hire | 3 — Leaning Hire | 2 — Leaning No Hire | 1 — Strong No Hire |
|-----------|----------------|------------------|---------------------|-------------------|
| **Synthesis** (suy ra, không học vẹt) | Tự suy ra mọi rung từ first principles. Không cần nhớ script. | Suy được phần lớn, vài chỗ dựa định nghĩa thuộc. | Trả lời định nghĩa trơn nhưng không suy ra được khi đổi góc. | Chỉ đọc thuộc; lệch script là đứng hình. |
| **Floor Depth** (leo bao sâu) | Lên tới rung 5 (bedrock: biết khi nào KHÔNG dùng). | Tới rung 4 (áp dụng tại chỗ). | Dừng ở rung 2-3. | Tụt ở rung 1. |
| **Real Scars** (dẫn code thật) | Dẫn nhiều ví dụ cụ thể từ Asset_Platform, sống động. | Dẫn được ≥1 scar thật. | Ví dụ chung chung, không từ code mình. | Không có ví dụ thật nào. |
| **Communication** | Cấu trúc rõ, thừa nhận trade-off, "tùy ngữ cảnh" có lý. | Rõ ràng đủ. | Lan man hoặc dùng buzzword không hiểu. | Không diễn đạt được. |

**Scale:** 4 = Strong Hire · 3 = Leaning Hire · 2 = Leaning No Hire · 1 = Strong No Hire.
**Targets:** Wk 4-5 → 2.0+ · Wk 6-7 → 2.5+ · Wk 8-9 → 3.0+ · Wk 10-12 → 3.5+ (interview-ready).

> **The killer signal:** rung 3 (real scar) + rung 5 (bedrock) together. If he climbs to 5
> AND cites Asset_Platform code, the gốc is in his hands — pass. If he recites to rung 2
> then freezes, it's recall — fail, regardless of how polished the definition was.

---

## 📝 Debrief Template (Trainer Mode after the mock)

```markdown
## 🎨 Mock Craftsmanship Debrief — [Date] — [gốc covered]

### Scores (1-4)
| Dimension | Score | Notes |
|-----------|-------|-------|
| Synthesis | [ ] | |
| Floor Depth | [ ] | highest rung reached per gốc |
| Real Scars | [ ] | which Asset_Platform examples cited |
| Communication | [ ] | |
| **Average** | **[ ]** | |

### 🪜 Per-gốc ladder reached
| Gốc | Highest rung | Recall or Synthesis? |
|-----|--------------|----------------------|

### 💪 Top 2 Strengths · ⚠️ Top 2 Improvements
### 🎯 Drills before next mock
- [ ] Gốc that capped at rung ≤3 → go build a scar (Scar-Journal entry) before retry
```

---

## 🚀 How to Run with Hadriel

Say: **"Hadriel, let's do a craftsmanship mock."**

Hadriel will:
1. Pick 4-5 gốc (lead with weakest from `mock-performance.json`).
2. Drop keywords, climb the 5-rung ladder per gốc in **interviewer mode** — cold, no teaching, hints cost score.
3. Hunt the recall-vs-synthesis tell: demand a real scar at rung 3.
4. Switch to trainer mode, score 4 dims honestly, assign drills (capped gốc → build a scar first).
5. Track scores in `../../../memory/mock-performance.json`.

> Optional: *"craftsmanship mock — SOLID"* to drill one gốc deep, or *"...— cross-root"* for chained combos.

> **The one line:** *Lý thuyết cho anh rung 1-2. Chỉ vết sẹo (build→fail→refactor) mới cho anh rung 3-5. Mock này đo cái sàn đó.*
