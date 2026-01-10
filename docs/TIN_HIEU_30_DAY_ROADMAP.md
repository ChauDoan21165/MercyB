# TÍN HIỆU — LỘ TRÌNH XÂY DỰNG 30 NGÀY

## Mục tiêu
Xây dựng v1 của ứng dụng **Tín Hiệu**:  
một hệ thống thu thập – sắp xếp – ưu tiên ý kiến để **lãnh đạo và đội ngũ ra quyết định tốt hơn**.

Ứng dụng phục vụ:
- Lãnh đạo (CEO / quản lý): nhìn thấy tín hiệu quan trọng
- Nhân sự: hiểu rõ ưu tiên, giảm nhiễu
- Ý kiến đầu vào có thể đến từ nội bộ hoặc khách hàng

---

## Phạm vi công việc
- Chỉ làm **logic sản phẩm + UI**
- Không làm payment
- Không làm email
- Không mở rộng tính năng ngoài danh sách này

---

## Nguyên tắc bắt buộc
1. Mỗi ngày phải có **kết quả kiểm tra được**
2. Không để việc “đang làm dở” kéo dài nhiều ngày
3. Không tự ý thêm tính năng
4. Code rõ ràng, dễ đọc
5. **Không hardcode text** (chuẩn bị cho đa ngôn ngữ)

---

## TUẦN 1 — NỀN TẢNG (Ngày 1–7)
**Mục tiêu:** Core flow chạy được từ đầu đến cuối

### Ngày 1
- Khởi tạo project
- Cấu trúc thư mục rõ ràng
- README mô tả app (1 trang)

### Ngày 2
- Thiết kế data model:
  - Ý kiến (feedback)
  - Trạng thái: mới / xem xét / lên kế hoạch / hoàn thành
  - Nhóm / danh mục
- Chốt schema

### Ngày 3
- Form nhập ý kiến (nội bộ)
- Lưu dữ liệu
- Hiển thị danh sách

### Ngày 4
- Màn hình staff:
  - Xem danh sách
  - Lọc theo trạng thái
  - Sắp xếp cơ bản

### Ngày 5
- Chỉnh sửa / xoá ý kiến
- Đổi trạng thái
- Đảm bảo dữ liệu nhất quán

### Ngày 6
- Logic ưu tiên (vote / điểm)
- Hiển thị số liệu rõ ràng

### Ngày 7
- Test toàn bộ luồng:
  nhập → xem → ưu tiên → cập nhật

**Kết quả tuần 1:** Core logic hoạt động ổn định.

---

## TUẦN 2 — SẢN PHẨM HÓA (Ngày 8–14)
**Mục tiêu:** Dùng được cho lãnh đạo & đội ngũ

### Ngày 8
- Phân vai:
  - Staff
  - Lãnh đạo (chỉ xem / quyết định)

### Ngày 9
- Dashboard cho lãnh đạo:
  - Ý kiến nổi bật
  - Xu hướng

### Ngày 10
- Nhãn / nhóm ý kiến
- Gom ý kiến trùng

### Ngày 11
- Màn hình roadmap:
  - Đã làm
  - Đang làm
  - Sẽ làm

### Ngày 12
- Changelog:
  - Gắn với mục “đã hoàn thành”

### Ngày 13
- View chỉ đọc (đơn giản)

### Ngày 14
- Dọn code
- Loại bỏ logic thừa

**Kết quả tuần 2:** App dùng được để ra quyết định nội bộ.

---

## TUẦN 3 — ỔN ĐỊNH & UX (Ngày 15–21)
**Mục tiêu:** Dùng lâu dài, không gây khó chịu

### Ngày 15
- Dọn UI cơ bản (khoảng cách, nhãn)

### Ngày 16
- Empty state:
  - Chưa có dữ liệu
  - Chưa có ưu tiên

### Ngày 17
- Xử lý lỗi:
  - Xoá
  - Trùng
  - Dữ liệu thiếu

### Ngày 18
- Kiểm tra hiệu năng
- Tránh truy vấn thừa

### Ngày 19
- Giao diện dùng được trên mobile

### Ngày 20
- Áp dụng language keys
- Chỉ có tiếng Việt nhưng sẵn sàng mở rộng

### Ngày 21
- Test lại toàn bộ
- Fix bug

**Kết quả tuần 3:** v1 ổn định, dùng được hàng ngày.

---

## TUẦN 4 — HOÀN THIỆN & BÀN GIAO (Ngày 22–30)
**Mục tiêu:** Sẵn sàng đưa cho người dùng thật

### Ngày 22
- Công cụ quản trị cơ bản

### Ngày 23
- Kiểm tra phân quyền lần cuối

### Ngày 24
- Tạo dữ liệu mẫu
- Demo flow hoàn chỉnh

### Ngày 25
- Viết hướng dẫn sử dụng (cho người dùng)

### Ngày 26
- Tối ưu 3 luồng quan trọng nhất

### Ngày 27
- Fix toàn bộ lỗi tồn đọng

### Ngày 28
- Review cuối
- Loại bỏ tính năng chưa hoàn tất

### Ngày 29
- Deploy
- Smoke test

### Ngày 30
- Bàn giao
- Checklist hoàn tất

---

## Tiêu chí hoàn thành
- Core flow hoạt động ổn định
- Logic rõ ràng, dễ mở rộng
- Không lỗi nghiêm trọng
- Có thể demo và dùng thật

---

## Ghi chú cuối
Mục tiêu của **Tín Hiệu** là:
> **Biến nhiều ý kiến thành tín hiệu rõ ràng để ra quyết định.**

Không chạy theo nhiều tính năng.  
Chỉ làm những gì giúp quyết định tốt hơn.



Phần ôgn sẽ pót pópópópópópópóp pópópópópópópóp
---

## HƯỚNG DẪN SỬ DỤNG CHATGPT (BẮT BUỘC ĐỌC)

Phần này dành cho **người trực tiếp xây dựng app Tín Hiệu**.

Bạn sẽ sử dụng ChatGPT như **giáo viên cá nhân**, vì bạn **không cần có kiến thức IT trước đó**.

---

## PROMPT CHO CHATGPT (COPY & DÁN NGUYÊN VĂN)

> **LƯU Ý:**  
> Mỗi ngày làm việc, bạn mở ChatGPT, dán toàn bộ prompt dưới đây, rồi làm theo hướng dẫn.  
> Không tự suy đoán. Không bỏ bước.

---

### PROMPT BẮT ĐẦU

Bạn là **giáo viên cá nhân của tôi**.

Tôi **KHÔNG có kiến thức về IT, lập trình, hay xây dựng app**.  
Hãy coi tôi là người bắt đầu từ số 0.

---

## Tôi đang xây dựng app gì?

Tôi đang xây dựng một ứng dụng tên là **“Tín Hiệu”**.

**Mục đích của app (nói đơn giản):**
- Thu thập ý kiến (feedback)
- Sắp xếp và gom nhóm ý kiến
- Xác định đâu là ý kiến quan trọng
- Giúp lãnh đạo và đội ngũ **ra quyết định tốt hơn**

Đây **KHÔNG phải** là:
- App khảo sát
- App chat
- Mạng xã hội
- App AI

Đây là **hệ thống hỗ trợ ra quyết định**.

---

## Vai trò và giới hạn của tôi

- Tôi làm việc theo **lộ trình 30 ngày**
- Tôi **chỉ làm logic sản phẩm và giao diện**
- Tôi **KHÔNG làm**:
  - Payment
  - Email
  - Hạ tầng phức tạp
- Tôi phải bám **đúng roadmap đã có**

---

## Cách bạn PHẢI dạy tôi (RẤT QUAN TRỌNG)

1. Giả định tôi **không biết gì**
2. Giải thích thuật ngữ trước khi dùng
3. Chia việc thành **các bước rất nhỏ**
4. **Mỗi lần chỉ làm một việc**
5. Luôn nói rõ:
   - Tôi đang làm gì
   - Vì sao phải làm việc đó
6. Dùng **ngôn ngữ đơn giản**, không dùng từ chuyên môn nếu không cần
7. Nếu tôi nói “tôi không hiểu”, hãy giải thích **đơn giản hơn nữa**
8. **Không được nhảy bước**

---

## Cách làm việc mỗi ngày

Mỗi ngày bạn phải:
1. Nói rõ **mục tiêu của ngày hôm nay**
2. Đưa ra **các bước cụ thể**
3. Chờ tôi làm xong
4. Kiểm tra kết quả
5. Chỉ khi xong mới chuyển sang bước tiếp theo

Nếu việc của hôm nay **chưa xong**, KHÔNG được sang ngày mới.

---

## Quy tắc kỹ thuật (không thay đổi nếu chưa được hỏi)

- App web đơn giản
- Công nghệ phổ biến
- Code dễ đọc
- Không tối ưu sớm
- **KHÔNG hardcode text** (phải dùng key để chuẩn bị đa ngôn ngữ)

---

## Điều kiện thành công

Sau 30 ngày:
- App chạy được
- Người khác dùng được
- Lãnh đạo nhìn ra ưu tiên
- Logic đúng
- App đơn giản, ổn định

---

## Việc đầu tiên bạn phải làm NGAY BÂY GIỜ

Bắt đầu với **Ngày 1** và giải thích:
- App là gì
- Một app gồm những phần nào
- Tôi cần cài đặt gì
- Làm sao biết là tôi làm đúng

Hãy đi **chậm**, rõ ràng, từng bước.  
Dạy tôi như một người **chưa từng làm app bao giờ**.

### KẾT THÚC PROMPT

---

## LƯU Ý CUỐI CÙNG CHO NGƯỜI LÀM

- Không đoán mò
- Không “làm đại”
- Không nhảy bước
- Không thêm ý tưởng mới

Mục tiêu duy nhất:
> **Làm đúng, làm rõ, làm xong.**

