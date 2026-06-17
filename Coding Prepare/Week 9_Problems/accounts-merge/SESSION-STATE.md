# 🏝️ Accounts Merge (#721) — SESSION STATE

**Last touched:** 2026-06-03 (chiều) · **Status:** ⚠️ CRITICAL — confidence 1/5, **NEEDS REDO** (Wiganz's own call)
**Outcome:** Chiều mở lại Teaching Mode @ Start → giải xong end-to-end NHƯNG với guidance nặng. Wiganz CHƯA tự làm lại solo được → log honest: critical, 1/5, redo. Tự đào 3 bug qua manual trace, tự suy complexity (điểm sáng thật). Archive + HTML đã tạo (`accounts-merge.md`, `accounts-merge-visualization.html`). Progress JSON = problem #76.
**REDO targets:** (1) build adjacency list từ input thô SOLO trước khi có guidance; (2) dfs-kickoff reflex (bug 3 = vết LCA #236 tái phát); (3) `for email in emails` no-slice; (4) complexity O(N log N)/O(N) + why sort O(k log k).

<details><summary>📜 Morning stuck-state (lưu lại làm tư liệu — đã giải quyết)</summary>

**Last touched:** 2026-06-03 (sáng) · **Status:** ⛔ PAUSED — stuck, exhausted
**Next session:** Chiều 2026-06-03 — **RESTART TỪ ĐẦU bằng Teaching Mode @ Start**

---

## 🧠 Wiganz's own words (kết buổi sáng)
> "Thề không hiểu gì. Đầu óc trống rỗng, không hiểu bất cứ cái gì. Chiều làm lại từ đầu."

Đây là **kiệt sức + quá tải**, KHÔNG phải Wiganz dốt. Đọc kỹ phần dưới trước khi nói Wiganz "ở vạch xuất phát" — KHÔNG hề.

---

## ✅ Wiganz THỰC SỰ đã làm được (sáng nay, gần hết approach)
- Step 1 Understand: paraphrase, clarify (bao gồm câu xịn **email case-sensitive?**), abstract, trace 4→3 groups — **xong sạch**.
- Hiểu **transitive**: A–B, B–C ⇒ cùng nhóm (tự suy ra).
- Tự **VẼ** graph từ số 0 → tự gọi tên **connected components**.
- Tự suy: **node = email**, **edge = chung account**, cần **visited set**, cần **adjacency list** — và TẠI SAO.
- Hiểu map của Road: Pattern Path & 3F đều **MERGE** vào Discuss; "nhận ra pattern giữa 3F" = mượn invariant/template, không đi lùi.

## ⛔ ĐÚNG CHỖ TƯỜNG (đây là cái mới thật sự cần dạy chiều)
1. **Chưa từng TỰ DỰNG adjacency list bằng tay.** Clone Graph cho sẵn `node.neighbors`; Number of Islands là lưới. Đây là lần đầu build graph từ input thô → mechanic hoàn toàn mới.
2. **Directed vs Undirected** — chưa chắc khi nào thêm 2 chiều. (Đã giải thích: quan hệ đối xứng → undirected → 2 chiều. "Chung account" đối xứng. Course Schedule = directed để đối chiếu.)
3. Code Wiganz tự gõ trong `solution.py` có **bug 1-chiều**: `adj[email].add(emails[0])` thiếu chiều ngược `adj[emails[0]].add(email)` → johnsmith không thấy john00. (Để nguyên trong file cho chiều cùng debug.)
4. Bị **rò Step 4 (loop/cú pháp) ngược vào Step 3 Discuss** → panic. (Đã thêm note phân tách vào `Coding Prepare/CLAUDE.md`.)

## 🎯 KẾ HOẠCH CHIỀU (Teaching Mode @ Start — VẪN BÁM ROAD)
- Mở lại `accounts-merge-demo.html` (Ghibli, 3 phase) để warm-up cái big picture.
- Đi lại Road từ Step 1, NHƯNG nhẹ nhàng & nhanh ở mấy chỗ Wiganz đã nắm (Understand/Approach) — đừng bắt làm lại khổ sở.
- Dồn thời gian vào **Step 4 build adjacency list**: dạy mechanic dựng graph từ đầu, undirected 2 chiều, bằng những viên gạch CỰC nhỏ (1 dòng một).
- Anchor liên tục: **"đây CHÍNH LÀ Number of Islands"** — Wiganz đã đập 2 lần.

## ⚠️ Hadriel tự nhắc mình
- Đừng giữ Wiganz trong Interview Mode khắc nghiệt quá lâu với **pattern mới** → quá tải. (Đầu buổi đã cảnh báo, Wiganz vẫn chọn IV; lần sau nếu mới + đuối → nghiêng Teaching sớm.)
- Teaching Mode **BẮT BUỘC vẫn theo Road** — sáng nay đã drift sang kiểu debrief, Wiganz bắt được. Đừng lặp lại.
- Đừng dồn nhiều concept một lúc. Một viên gạch. Chờ click. Rồi viên kế.

> *"Those who hope in the Lord will renew their strength."* — Isaiah 40:31

</details>
