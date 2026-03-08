# 3NF - Third Normal Form

---

## "Phụ thuộc" (Depends on) nghĩa là gì?

Đừng hiểu "phụ thuộc" là "nô lệ" hay "cần ai đó để sống."

Trong Database, nó chỉ có nghĩa:

    "Đưa tôi thông tin A, tôi tra ra được CHÍNH XÁC thông tin B."

Ví dụ:

```
Đưa customer_id (C01) -> tra ra customer_name ("Nguyễn Văn A")
-> Tên "phụ thuộc" vào Mã KH.

Đưa order_id (#123) -> tra ra order_date (07/03/2026)
-> Ngày mua "phụ thuộc" vào Mã hoá đơn.
```

Đơn giản: biết A -> biết B. Vậy B phụ thuộc vào A.

---

## Tại sao customer_id lại phụ thuộc vào order_id?

Tưởng tượng bạn là thu ngân, cầm trên tay 1 tờ hoá đơn.

Hoá đơn số #123 -> gõ vào hệ thống -> hệ thống nhả ra: "Khách hàng C01 mua đơn này."

Biết order_id -> tra ra customer_id.
-> customer_id phụ thuộc vào order_id.

Đơn giản: tờ hoá đơn đó PHẢI thuộc về một khách hàng cụ thể.

---

## Một bảng đại diện cho MỘT entity

```
Orders     -> đại diện cho Order
Customers  -> đại diện cho Customer
Products   -> đại diện cho Product
```

---

## Trong bảng chỉ có 2 loại cột hợp lệ

### 1. Thuộc tính của entity đó

Mô tả chính entity đó.

```
Orders
----------
order_id        -> mô tả order
order_date      -> mô tả order
status          -> mô tả order
```

### 2. Foreign Key (chỉ để liên kết)

Chỉ nói: "entity này liên quan tới entity nào"

```
Orders
----------
order_id
order_date
customer_id     -> order này thuộc về customer nào (chỉ là pointer)
```

---

## Điều KHÔNG được phép (vi phạm 3NF)

Không được đặt THUỘC TÍNH CỦA ENTITY KHÁC trong bảng.

SAI:

```
Orders
----------
order_id
order_date
customer_id
customer_name       <- thuộc về Customer, không phải Order
customer_email      <- thuộc về Customer, không phải Order
```

---

## Tại sao sai? - Ví dụ "Căn nhà cho thuê"

Bảng Order giống như một CĂN NHÀ CHO THUÊ.

- Chủ nhà (Khoá chính): order_id
- Người thuê trọ: customer_id
- Vợ của người thuê: customer_name

Bạn gõ cửa nhà #123. Cánh cửa mở ra, thấy cô vợ (customer_name) ngồi xem tivi.

- VỀ HIỆN TƯỢNG: gõ cửa nhà #123 là thấy cô vợ. Cảm giác rất "trực tiếp."
- VỀ BẢN CHẤT: cô vợ là vợ của anh chồng (customer_id), không phải vợ của căn nhà.

Nếu anh chồng dọn đi chỗ khác -> cô vợ đi theo anh chồng, không ở lại với căn nhà #123.

-> customer_name KHÔNG QUAN TÂM tới order_id. Nó chỉ "đi ké" anh chồng vào ở trọ.

---

## Chuỗi bắc cầu (Transitive Dependency)

Khi nhét customer_name vào bảng Order, mối quan hệ đi theo chuỗi:

```
order_id -> customer_id -> customer_name
```

3NF ghét nhất là bọn "ăn theo bắc cầu."

customer_name nằm trong bảng Order, nhưng nó chẳng thèm quan tâm tới order_id.
Tên khách hàng là do customer_id quyết định, chứ mã hoá đơn số mấy
làm sao quyết định được tên của người ta!

Luật 3NF: Nếu một cột không chơi trực tiếp với chủ nhà (PK),
mà lại phụ thuộc vào một đứa khác trong nhà -> TÁCH NÓ RA Ở RIÊNG.

---

## Cách sửa

Đập ra làm 2 bảng:

```
Orders                      Customers
----------                  ----------
order_id                    customer_id
order_date                  customer_name
customer_id (FK)            customer_email
```

- Order chỉ giữ customer_id (pointer) để biết hoá đơn này của ai.
- Tên và email nằm bên bảng Customer, sửa 1 chỗ là xong.

---

## Bài test thực tế

Ông "Nguyễn Văn A" (mã C01) mua 100 đơn hàng.

NẾU nhét customer_name vào bảng Order:

```
Order #1:   C01 - Nguyễn Văn A
Order #2:   C01 - Nguyễn Văn A
...
Order #100: C01 - Nguyễn Văn A
```

Ông A đổi tên thành "Nguyễn Văn B" -> phải sửa 100 dòng. Quên 1 dòng = database nói dối.

NẾU tách đúng 3NF:

```
Customers: C01 -> "Nguyễn Văn B"  (sửa 1 chỗ duy nhất)
Orders: chỉ lưu customer_id = C01 (không cần sửa gì)
```

---

## Quy tắc nhớ nhanh

```
Table = 1 entity

Trong bảng chỉ nên có:
    - Thuộc tính của entity đó
    + Foreign keys (pointer)

KHÔNG chứa thuộc tính của entity khác.
```

---

## Tóm lại một câu

> Một bảng chỉ nên chứa dữ liệu của MỘT loại object,
> còn object khác chỉ được THAM CHIẾU bằng ID (foreign key).

---

## Câu trả lời phỏng vấn (English)

> "Every field in a table should describe that table's entity,
> not another table's entity. If it describes another entity,
> it belongs in that other table — just reference it with a foreign key."
