"""🏧 STUB vs FAKE — cùng một cây ATM giả, hai cách làm."""

# ══════════════════════════════════════════════════════════
# 📜 STUB — con vẹt. Câu trả lời do TA cài sẵn.
# ══════════════════════════════════════════════════════════
class StubATM:
    def __init__(self, cau_tra_loi_cai_san):
        self.cau_tra_loi = cau_tra_loi_cai_san   # ← không có TRÍ NHỚ, chỉ có 1 câu thoại

    def so_du(self):
        return self.cau_tra_loi               # hỏi gì cũng đáp câu đó

    def rut(self, tien):
        return "ok"                            # gật đại, KHÔNG tính toán gì


# ══════════════════════════════════════════════════════════
# 🏗️ FAKE — máy đồ chơi CHẠY THẬT. Có trí nhớ + có logic.
# ══════════════════════════════════════════════════════════
class FakeATM:
    def __init__(self, so_du_ban_dau):
        self._so_du = so_du_ban_dau            # ← TRÍ NHỚ (state)

    def so_du(self):
        return self._so_du                     # đọc từ trí nhớ, không phải câu cài sẵn

    def rut(self, tien):
        if tien > self._so_du:                 # ← LOGIC: tự biết từ chối
            return "Không đủ tiền!"
        self._so_du -= tien                    # ← LOGIC: tự làm toán
        return "ok"


# ══════════════════════════════════════════════════════════
# 🧪 Cùng một kịch bản, chạy trên cả hai
# ══════════════════════════════════════════════════════════
def kich_ban(atm, ten):
    print(f"\n{ten}")
    print(f"  Số dư ban đầu       → {atm.so_du():,}")
    print(f"  Rút 500,000         → {atm.rut(500_000)}")
    print(f"  Hỏi lại số dư       → {atm.so_du():,}   <-- ĐÚNG phải là 500,000")
    print(f"  Rút 999,000,000     → {atm.rut(999_000_000)}   <-- ĐÚNG phải là 'Không đủ tiền!'")


kich_ban(StubATM(cau_tra_loi_cai_san=1_000_000), "📜 STUB (con vẹt 🦜)")
kich_ban(FakeATM(so_du_ban_dau=1_000_000),       "🏗️ FAKE (máy đồ chơi chạy thật)")
