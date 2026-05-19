# OUTREACH — Gift-code silent-failure victims (draft for Chau to send)

> Agent: A13 · Branch: `a13/gift-redemption-victims` · No PR (operator artifact)
> Date: 2026-05-19 · Companion to `reports/AUDIT-gift-victims-A13.sql`
> Labels: money-path, customer-incident, outreach

## Operator notes (NOT part of the email)

- **Send from / reply-to:** `admin@mercyblade.com` (canonical MercyBlade
  address — never `hello@`).
- **Vietnamese is the email.** The English block below it is a fallback for
  the rare non-VN recipient; for VN users, send the Vietnamese only (delete
  the EN block before sending).
- **Personalize per row from the SQL output** (`reports/AUDIT-gift-victims-A13.sql`
  Query 1):
  | Placeholder | SQL column |
  |---|---|
  | `{{TEN}}` | recipient name if known, else delete the greeting word — fall back to `Bạn` |
  | `{{MA}}` | `gift_code_value` |
  | `{{GOI}}` | `intended_tier` (`Level 2` / `Level 3`) |
  | `{{NGAY}}` | `redeemed_at` (format `dd/mm/yyyy`) |
  | send-to | `current_email` (use `email_at_redeem` only if `current_email` is null) |
- The email **promises a fix and asks the customer to do nothing** — the
  repair (re-granting the correct tier) is the separate follow-up task. Do not
  send this until Chau is ready to actually run that repair, so the promise is
  true when it lands.
- Tone is a personal apology from the founder, not a support macro. Keep it.

---

## SUBJECT

**Tiếng Việt (chính):**
`Lỗi từ phía MercyBlade — mình sẽ kích hoạt lại quà tặng cho bạn`

**English (fallback):**
`A mistake on our side — we're restoring your MercyBlade gift`

---

## BODY — Tiếng Việt (gửi bản này cho người dùng Việt)

Chào {{TEN}},

Mình là Châu, người làm MercyBlade. Mình viết email này để xin lỗi bạn một
cách thẳng thắn.

Bạn đã dùng mã quà tặng **{{MA}}** (gói **{{GOI}}**) vào ngày **{{NGAY}}**.
Màn hình lúc đó hiện "Chào mừng bạn! Quyền truy cập đã được kích hoạt" — nhưng
**điều đó không đúng**. Hệ thống của mình có một lỗi: mã của bạn đã bị đánh dấu
là "đã dùng", nhưng phần mở khóa gói **{{GOI}}** lại **không hề được kích hoạt**.
Nói thẳng: mã đã bị tiêu, còn bạn thì không nhận được gì. Đây hoàn toàn là lỗi
kỹ thuật từ phía mình, không phải lỗi của bạn.

Đây là điều mình sẽ làm:

- Mình sẽ **tự tay kích hoạt gói {{GOI}}** cho tài khoản của bạn, đầy đủ
  thời hạn mà món quà đáng lẽ phải mang lại (1 năm).
- Bạn **không cần làm gì cả** — không cần nhập lại mã, không cần đăng ký lại.
  Mã **{{MA}}** vẫn được ghi nhận cho bạn.
- Khi gói đã được bật, mình sẽ báo lại cho bạn.

Mình thật sự xin lỗi vì sự cố này, và xin lỗi vì màn hình đã báo "thành công"
trong khi thực tế không phải vậy. Một công cụ học tiếng Anh thì không được phép
nói dối người dùng — kể cả vô tình. Mình đã sửa lỗi gốc để chuyện này không
xảy ra với bất kỳ ai nữa.

Nếu bạn có bất kỳ câu hỏi nào, cứ trả lời thẳng email này — email về đúng hộp
thư của mình.

Cảm ơn bạn đã tin tưởng MercyBlade.

Châu
MercyBlade — admin@mercyblade.com

---

## BODY — English (fallback only — delete for VN recipients)

Hi {{TEN}},

I'm Chau, the person who builds MercyBlade. I'm writing to apologize to you
directly and honestly.

You redeemed gift code **{{MA}}** (the **{{GOI}}** plan) on **{{NGAY}}**. The
screen said "Welcome! Your access is now active" — but **that was not true**.
A bug in our system marked your code as used, but **never actually unlocked
{{GOI}}**. Plainly: the code was burned and you received nothing. This was
entirely a technical fault on our side, not anything you did wrong.

Here's what I'm doing about it:

- I will **manually activate {{GOI}}** on your account, for the full duration
  the gift was meant to give you (1 year).
- You **don't need to do anything** — no re-entering the code, no signing up
  again. Code **{{MA}}** is still credited to you.
- I'll let you know once it's switched on.

I'm genuinely sorry this happened, and sorry the screen claimed "success" when
it hadn't. An English-learning tool should never lie to its users — even by
accident. I've fixed the underlying bug so this can't happen to anyone else.

If you have any questions, just reply straight to this email — it reaches me.

Thank you for trusting MercyBlade.

Chau
MercyBlade — admin@mercyblade.com
