# AUDIT — Support-inbox & community search for gift-code silent-failure complaints

> Agent: A39 · Branch: `a39/support-inbox-gift-audit` · **No PR (operator artifact)**
> Date: 2026-05-19 · Labels: money-path, customer-incident, reputation, outreach
> Companions (read for consistency):
> - `reports/AUDIT-gift-victims-A13.sql` — the SQL victim list (run in Supabase SQL Editor)
> - `reports/OUTREACH-gift-victims-A13.md` — the proactive apology email (A13)
> - A28 `a28/gift-victim-repair-sql` — the repair SQL that makes the promise true
> - PR #787 (`4fbc3a41f`) — the code fix (B22 narrow)

---

## Why this audit exists (the reputation gap A13/A28 don't close)

A7 found gift-code redemption was **100% silently broken** for ~6 weeks. A13
produces the victim list from the database; A28 repairs them; A13's email
apologizes to them. But all three of those start from
`gift_codes.used_by` rows in the DB.

**The customers this audit is about never make it into that list, or are worse
off inside it:**

- The screen lied to them: it said *"🎁 Mã quà tặng đã được kích hoạt! Chào
  mừng bạn đến với Premium! 💛"* — then nothing unlocked. They don't know it
  was a bug. They think **they** did something wrong, or that we cheated them.
- Some of them emailed / messaged us asking why. **Those messages are sitting
  unanswered.** Silence from a founder who sells trust, to a paying gift
  recipient in our home market, on our primary distribution channel (220K
  Facebook diaspora, STRATEGY §9/§11). This is the single highest-reputation-
  cost surface of the whole incident.
- A subset cannot be found in A13's SQL at all (deleted account, changed
  email, gave up before the code burned, buyer-not-recipient, test code).
  A13's Query 1 `JOIN auth.users` silently drops deleted accounts. These
  people must be resolved **from the inbound message**, not from the DB.

This document is the manual sweep Chau runs across the human channels, plus
ready-to-send replies that match A13's tone and promise exactly.

---

## What the customer actually saw (so you recognize the complaint)

These are the literal strings from the codebase — customers will quote or
paraphrase them. Source: `src/components/GiftCodeModal.tsx`,
`src/components/gift/RedeemGiftForm.tsx`, `supabase/functions/redeem-gift-code`.

**Phase A — during the bug (2026-04-03 → 2026-05-19, fake success):**
- `🎁 Mã quà tặng đã được kích hoạt! / Gift code applied!`
- `Chào mừng bạn đến với <gói>! / Welcome to <tier>! 💛`
- `Đã kích hoạt <N> tháng MercyBlade!`
- → then: still locked, still asked to pay, "Premium" features greyed out.

**Phase B — after PR #787 (honest errors; a victim retrying now hits these):**
- `Không kích hoạt được / Could not redeem` (toast title)
- `Mã đã được dùng rồi. / This code has already been redeemed.`  ← **the loud
  one** — the code was burned by their own earlier *fake* success, so an
  innocent victim now looks like a cheater to the system.
- `Mã đã hết hạn. / This code has expired.`
- `Không tìm thấy mã. / Code not found.`

A complaint that quotes **"Chào mừng" + "vẫn không dùng được"** or
**"đã được dùng rồi" + "nhưng tôi chưa bao giờ dùng"** is almost certainly
this incident.

---

## 1. Channels to search (in priority order) + exact search terms

Per STRATEGY §9 the support-bearing surfaces are, highest-signal first:

| # | Channel | How Chau reaches it | Priority |
|---|---|---|---|
| 1 | **`admin@mercyblade.com` mailbox** | Cloudflare Email Routing → personal inbox. Search the forwarded inbox + the `gift@`/`hello@`/`support@` aliases if any forward there. | **Highest** — written, traceable, replyable |
| 2 | **Facebook Page / Messenger DMs** | Chau's 220K-follower page inbox (Meta Business Suite → Inbox) | **Highest** — primary diaspora channel, public reputation |
| 3 | **Facebook comments & post replies** | On any gift / Premium / launch post; also tagged mentions | High — public, others read it |
| 4 | **Zalo** | Community/announcement OA + 1:1 chats (STRATEGY §9 lists Zalo as support) | High |
| 5 | **Facebook IELTS / English-learning groups** | Groups Chau posts in — search the group + Chau's notifications/mentions | Medium |
| 6 | **In-app feedback** (`mercy-feedback`) | `mercy_feedback` table — query directly, see §1a | Medium — DB-backed, the one channel an agent *can* check |
| 7 | TikTok / YouTube comments & DMs | Comments under gift/Premium clips | Lower (less likely to carry a redeem code, but check) |
| 8 | Email replies to the redeem-confirmation email | `send-redeem-email` was the auto-mail; replies land at admin@ | Medium |

### Search terms — paste each into the channel's search box

**Vietnamese (primary — ~95% of complaints will be here):**

```
mã quà tặng
mã quà
gift code
mã không kích hoạt được
không kích hoạt được
chưa kích hoạt
đã kích hoạt nhưng
đã sử dụng nhưng
mã đã được dùng rồi
mã đã được sử dụng
nhưng tôi chưa dùng
chưa bao giờ dùng mã
không dùng được
vẫn chưa dùng được
không vào được Premium
không lên được Premium
vẫn bị khóa
Chào mừng nhưng
báo thành công nhưng
mất tiền
mua quà tặng
tặng tài khoản
mã hết hạn
không tìm thấy mã
nâng cấp không được
lừa đảo        ← worst-case wording; search it, these need fastest reply
```

**English (fallback — gift recipients abroad, English-side users):**

```
gift code
gift card
redeem
didn't activate
did not activate
not activated
already redeemed
already used
code used but
never used the code
still locked
no premium
not premium
upgrade not working
welcome message but
said success but
scammed / scam / fraud
```

> Tip: in Gmail/Meta inbox search, combine: `(gift OR "mã quà" OR redeem)
> after:2026/03/25 before:2026/05/27`. Search the **subject and body** — many
> users put the code in the body, not the subject.

### 1a. The one channel an agent *can* pull now — in-app feedback

If Chau wants the DB-backed slice immediately, run in Supabase SQL Editor
(read-only; complements A13's SQL — this finds people who reported it in-app
rather than by email):

```sql
-- In-app feedback mentioning gift redemption, during/after the incident
SELECT id, created_at, user_id, email, message
FROM   public.mercy_feedback
WHERE  created_at >= '2026-03-25'
  AND (
        message ILIKE '%mã quà%'    OR message ILIKE '%gift code%'
     OR message ILIKE '%kích hoạt%' OR message ILIKE '%redeem%'
     OR message ILIKE '%đã được dùng%' OR message ILIKE '%already used%'
     OR message ILIKE '%premium%'   OR message ILIKE '%nâng cấp%'
      )
ORDER BY created_at DESC;
```

(Confirm the table/column names against `mercy_feedback` before running — the
schema is the live one A12 restored 2026-05-19; adjust `email`/`message` if
the columns differ.)

---

## 2. Time window

| Boundary | Date | Reason |
|---|---|---|
| Incident start (dispatch) | **2026-04-03** | Bug went live (A7 "~6 weeks broken"; 2026-05-19 − 6wk ≈ 2026-04-07, consistent) |
| Code fix landed | **2026-05-19** | PR #787 (`4fbc3a41f`) on `main` — honest errors from here on |
| **Search FROM** | **2026-04-01** | Pad the start: A7's window is approximate; a complaint can predate a tidy date. **Note:** A13's SQL ties the DB fingerprint to migration `20260510020000` (2026-05-10). The incident may have **two flavors** (pre- and post-migration). For a *support search* do **not** narrow to 2026-05-10 — search the full window; the SQL is what's date-precise, the inbox is not. |
| **Search TO** | **2026-05-26** | Pad the end ~1 week: users email days/weeks after the failure, and post-#787 retries throw `"Mã đã được dùng rồi"`, generating a *fresh* wave of complaints from old victims **after** the fix. |

**Recommended search window: `2026-04-01` → `2026-05-26`.** Re-sweep once more
~1 week after A28's repair lands, to catch the lag tail.

---

## 3. Response templates (Vietnamese-primary)

Tone, sender, and promise are **locked to A13's `OUTREACH-gift-victims-A13.md`**
so a customer who emailed *and* also receives A13's proactive mail does not get
two different stories:

- Send/reply-to: **`admin@mercyblade.com`** (never `hello@`).
- Voice: personal apology from **Châu** the founder, not a support macro.
- Promise: **manual activation of the intended tier, full 1-year duration, code
  stays credited, customer does nothing.** (The function hard-codes +1 year —
  do not promise a different length.)
- Vietnamese only for VN recipients (delete the EN block). EN block is the
  fallback for the rare non-VN gift recipient.

### Sequencing rule (important — don't promise before A28 runs)

A13's operator note says: don't send the make-good until the repair can
actually be executed, so the promise is true on arrival. These customers,
however, are **already waiting and already angry** — silence is its own damage.
Resolve the tension with **two steps**:

1. **T-0 (send immediately on finding the message): Template 0 — holding
   acknowledgement.** Confirms it's our fault, commits to a fix, promises **no
   date**. Safe to send before A28 runs. Stops the bleeding.
2. **T-1 (after A28's repair SQL has run for that user): Template 1/2/3** —
   the make-good, "it's done."

If A28's repair is already applied for that user by the time you reach the
message, skip Template 0 and send the make-good directly.

---

### Template 0 — Immediate holding reply (send the moment you find the message)

> Use for **every** archetype below as the first contact. Promises a fix, not a
> timeline. True even before A28 runs.

**Tiếng Việt:**

> Chào bạn,
>
> Mình là Châu, người làm MercyBlade. Cảm ơn bạn đã nhắn cho mình — và mình
> xin lỗi.
>
> Bạn nhắn đúng: mã quà tặng của bạn **không phải lỗi của bạn**. Hệ thống của
> mình đã có một lỗi kỹ thuật khiến mã bị ghi nhận là "đã dùng" nhưng gói
> Premium **không hề được bật lên**, dù màn hình báo "thành công". Đây hoàn
> toàn là lỗi từ phía mình.
>
> Mình đang xử lý trực tiếp từng trường hợp, **tự tay kích hoạt lại** đúng gói
> và đủ thời hạn (1 năm) mà món quà đáng lẽ mang lại. Bạn **không cần làm gì
> cả** — không cần nhập lại mã, mã của bạn vẫn được ghi nhận. Mình sẽ nhắn lại
> cho bạn ngay khi tài khoản của bạn đã được bật.
>
> Để mình tìm đúng tài khoản của bạn nhanh hơn, nếu tiện bạn gửi giúp mình:
> **(1)** mã quà tặng, **(2)** email bạn dùng để đăng nhập MercyBlade. Nếu
> không nhớ mã cũng không sao — mình vẫn tìm được.
>
> Cảm ơn bạn đã kiên nhẫn và vẫn tin MercyBlade. Mình đã sửa lỗi gốc để chuyện
> này không xảy ra với ai nữa.
>
> Châu — MercyBlade
> admin@mercyblade.com

**English (fallback — delete for VN recipients):**

> Hi,
>
> I'm Chau, the person who builds MercyBlade. Thank you for writing — and I'm
> sorry.
>
> You're right, and **this was not your fault**. A technical bug on our side
> marked your gift code as "used" but never actually switched on Premium, even
> though the screen said "success." That's entirely on us.
>
> I'm fixing each case by hand — manually activating the correct plan for the
> full duration the gift was meant to give (1 year). You **don't need to do
> anything**; your code is still credited to you. I'll message you the moment
> your account is switched on.
>
> To find your account faster, if you can, send me: **(1)** the gift code,
> **(2)** the email you use to sign in to MercyBlade. If you don't have the
> code anymore, that's fine — I can still find you.
>
> Thank you for your patience and for still trusting MercyBlade. I've fixed the
> underlying bug so this can't happen to anyone again.
>
> Chau — MercyBlade
> admin@mercyblade.com

---

### Template 1 — Make-good: classic victim (in A13's SQL list)

> Customer: *"I redeemed, saw 'Chào mừng', but Premium never worked."* This is
> the A13 list. After A28 repairs them, this is the "it's done" reply. It is
> A13's email, lightly re-voiced to acknowledge **they reported it** (don't
> make them feel ignored, and thank them — they did us a favor).

**Tiếng Việt:**

> Chào {{TEN}},
>
> Mình là Châu. Cảm ơn bạn — chính nhờ bạn báo mà mình biết rõ ai bị ảnh hưởng.
>
> Bạn đã dùng mã **{{MA}}** (gói **{{GOI}}**) ngày **{{NGAY}}**. Màn hình báo
> "Chào mừng — đã kích hoạt", nhưng điều đó **không đúng**: lỗi hệ thống đã
> tiêu mã của bạn mà không bật gói. Lỗi từ phía mình, không phải của bạn.
>
> **Mình đã kích hoạt xong gói {{GOI}} cho tài khoản của bạn**, đủ thời hạn 1
> năm kể từ ngày bạn dùng mã. Bạn đăng nhập lại (hoặc tải lại trang) là thấy.
> Mã **{{MA}}** vẫn được ghi nhận cho bạn.
>
> Nếu vẫn chưa thấy Premium sau khi đăng nhập lại, trả lời thẳng email này —
> mình xử lý ngay. Mình đã sửa lỗi gốc để không ai gặp lại chuyện này.
>
> Cảm ơn bạn đã tin MercyBlade.
>
> Châu — MercyBlade
> admin@mercyblade.com

**English:** (same as A13 `OUTREACH` EN body, with the opening line
*"Thank you — your message is how I knew exactly who was hit."* and past-tense
*"I have now activated {{GOI}} on your account…"*)

Placeholders map to A13's SQL Query 1 columns: `{{MA}}`=`gift_code_value`,
`{{GOI}}`=`intended_tier`, `{{NGAY}}`=`redeemed_at` (dd/mm/yyyy),
`{{TEN}}`=name or `bạn`.

---

### Template 2 — "Mã đã được dùng rồi" rejection (post-#787 retry victim)

> Customer: *"It says my code is **already used**, but I never used it / I only
> tried once and it failed."* They are a victim whose code their **own** fake-
> success burned. They are usually in A13's list (used_by = them). This reply
> must explicitly absolve them — being called a cheater by the system is the
> sharpest insult of this whole incident.

**Tiếng Việt:**

> Chào bạn,
>
> Mình là Châu. Mình hiểu vì sao bạn bực — hệ thống báo mã của bạn "đã được
> dùng rồi" trong khi bạn **chưa từng dùng được nó**. Bạn nói đúng, và mình
> xin lỗi.
>
> Chuyện xảy ra thế này: lần trước bạn nhập mã, màn hình báo "thành công" —
> nhưng đó là báo sai. Mã của bạn **bị tiêu ngay lúc đó** do lỗi hệ thống, mà
> gói Premium thì không hề được bật. Nên bây giờ nhập lại, máy tưởng mã "đã
> dùng". **Bạn không làm gì sai cả** — không ai dùng trộm mã của bạn, chính lỗi
> của mình đã đốt nó.
>
> Mình **không yêu cầu bạn nhập lại mã**. Mình sẽ tự tay bật gói đúng cho bạn,
> đủ 1 năm. {{nếu đã xong: "Mình đã bật xong — bạn đăng nhập lại là thấy."}}
> {{nếu chưa xong: "Mình sẽ nhắn lại ngay khi xong."}}
>
> Gửi giúp mình email bạn đăng nhập + mã (nếu còn nhớ) để mình khớp đúng tài
> khoản. Cảm ơn bạn đã báo và vẫn cho MercyBlade một cơ hội.
>
> Châu — MercyBlade
> admin@mercyblade.com

**English:** *"…The system says your code is 'already redeemed' but you never
got to use it. You're right, and I'm sorry. Here's what happened: your earlier
attempt showed 'success' but that was false — the bug burned your code at that
moment while never switching Premium on. Nobody stole your code; our bug
consumed it. You did nothing wrong. I won't ask you to re-enter it — I'll
activate the correct plan by hand for the full year…"*

---

### Template 3 — Not in A13's victim list (the hard cases — §3 sub-types)

A13's Query 1 is `gift_codes JOIN auth.users JOIN/LEFT user_subscriptions`.
A customer is **absent** from it for these reasons — handle each:

| Sub-case | Why they're not in the SQL | What to do |
|---|---|---|
| **3a. Account deleted / email changed** | `JOIN auth.users` drops a code whose `used_by` no longer resolves; `current_email` is stale | Ask for: code + the email used at redeem + any new email. Resolve from `gift_codes.used_by_email` snapshot; recreate/relink account, then grant. |
| **3b. Never burned the code (gave up / network 500 / closed tab mid-redeem)** | `gift_codes.used_at IS NULL` → excluded by `WHERE gc.used_at IS NOT NULL`. Their code may **still be valid**. | Confirm the code is unburned; tell them it works now (post-#787) and to try once; if it errors, they reply with the code and Chau redeems server-side for them. |
| **3c. Buyer ≠ recipient** (Chau's friend bought a gift, recipient redeemed/failed) | The complainer isn't `used_by` at all — the recipient is | Get the **recipient's** sign-in email + the code; resolve on the recipient's account; CC/keep the buyer informed. |
| **3d. Staff / test code** | A13's SQL doesn't filter test codes, but a real human may have used a code Chau treated as a test | Verify against known test codes; if genuinely a test with no real purchase, reply kindly, explain, offer a goodwill grant if it's a real learner. No silent ignore. |
| **3e. Wrong path — `access_codes`, not `gift_codes`** | Different redemption path (`redeem_access_code_atomic` RPC). **Not** the #787 bug. A13 explicitly scopes this out. | Triage: if the code looks like an access code, it's a *separate* matter — do not promise the #787 make-good. Use the neutral holding reply below and investigate access_codes separately. |

**Template 3 — universal "help me find you" reply (covers 3a/3b/3c):**

**Tiếng Việt:**

> Chào bạn,
>
> Mình là Châu, người làm MercyBlade. Cảm ơn bạn đã báo, và mình xin lỗi vì
> món quà chưa dùng được — đây là lỗi hệ thống phía mình trong mấy tuần qua,
> không phải lỗi của bạn.
>
> Trường hợp của bạn mình muốn xử lý cho đúng người, nên phiền bạn gửi giúp:
>
> 1. **Mã quà tặng** (nếu còn — không nhớ cũng được).
> 2. **Email đăng nhập MercyBlade** của người sẽ dùng gói (nếu bạn mua tặng
>    người khác thì là email của người nhận).
> 3. Bạn đã từng bấm "Kích hoạt" và thấy màn hình báo gì chưa (báo "thành
>    công", báo "đã được dùng", báo lỗi, hay chưa bấm được)?
>
> Mình sẽ tự tay kích hoạt đúng gói, đủ 1 năm, cho đúng tài khoản — bạn không
> cần làm gì thêm sau khi gửi thông tin này. Mình nhắn lại ngay khi xong.
>
> Cảm ơn bạn đã kiên nhẫn với MercyBlade.
>
> Châu — MercyBlade
> admin@mercyblade.com

**English:** *"…I want to fix this for the right account, so could you send me:
(1) the gift code if you still have it, (2) the MercyBlade sign-in email of the
person who'll use the plan (the recipient's, if you bought it as a gift),
(3) what the screen showed when you pressed Redeem (success / already-used /
an error / couldn't get that far). I'll activate the correct plan for the full
year on the right account by hand…"*

**Template 3e — neutral holding reply for a *non-#787* access-code issue
(don't over-promise on the wrong incident):**

**Tiếng Việt:**

> Chào bạn, mình là Châu. Cảm ơn bạn đã báo. Mình đang kiểm tra trực tiếp mã
> của bạn để biết chính xác chuyện gì xảy ra — phiền bạn gửi giúp mã và email
> đăng nhập. Mình sẽ phản hồi bạn sớm với hướng xử lý cụ thể. Xin lỗi vì sự bất
> tiện này. — Châu, MercyBlade · admin@mercyblade.com

---

## 4. Operator runbook (the order to do this in)

1. **Sweep** channels §1 with the §2 window + §1 search terms. Log each hit:
   channel, date, person handle/email, code (if given), what screen they
   reported. A spreadsheet column for `in_A13_list? (Y/N/unknown)`.
2. For **every** hit, send **Template 0** now (safe, no date promised).
3. Run A13's `AUDIT-gift-victims-A13.sql` Query 1. Match each complainer:
   - **Matched** → after A28's repair runs for them → **Template 1** (or
     **Template 2** if their complaint was the "already used" rejection).
   - **Not matched** → **Template 3** to collect identifying info, then route
     to A28 as a manual one-off (note 3a/3b/3c/3d/3e), then make-good reply.
4. **Reconcile with A13's proactive list:** anyone who emailed *and* is in
   A13's list will *also* get A13's proactive apology. Either (a) suppress the
   A13 proactive mail for people you've already personally replied to, or
   (b) make sure Template 1's wording can't read as a contradiction of A13's
   (it can't — same sender, same promise, same 1-year duration; that alignment
   is by design here).
5. Re-sweep ~1 week after A28's repair lands (post-fix retry complaints + lag).
6. Worst-case wording first: any message containing **"lừa đảo" / "scam" /
   "fraud" / a public Facebook comment** gets Template 0 within hours, not
   days — public, in the home market, on the 220K channel.

## 5. Consistency check vs A13 / A28 (done)

| Dimension | A13 outreach | A39 replies | Match |
|---|---|---|---|
| Sender / reply-to | admin@mercyblade.com | admin@mercyblade.com | ✓ |
| Voice | Founder personal apology | Founder personal apology | ✓ |
| Fault attribution | 100% our bug, not the user | 100% our bug, not the user | ✓ |
| Promise | Manual activation, intended tier, **1 year**, code stays credited, user does nothing | Identical | ✓ |
| "Welcome was a lie" acknowledged | Yes | Yes (Template 1/2) | ✓ |
| Root cause fixed | "đã sửa lỗi gốc" | "đã sửa lỗi gốc" | ✓ |
| Timing discipline | Don't promise before repair runs | Template 0 (no date) → make-good after A28 | ✓ (extends A13's rule to reactive case) |

A39 adds nothing A13/A28 must change. It only covers the people their
DB-first pipeline structurally cannot see.

---

*End — A39. Operator artifact; committed on `a39/support-inbox-gift-audit`, no PR.*
