# RUNBOOK — Gift-code victim incident: the operator sweep Chau runs

> Operator artifact · Branch `b54/pending-chau-actions` · **No PR** (recon/runbook
> convention #768). Date 2026-05-19 · Labels: money-path, customer-incident,
> reputation, outreach.
>
> This is the single doc Chau works the human steps from. It consolidates
> A39's §4 runbook, **corrects A39's broken §1a**, and gives the
> currently-sendable reply inline. It deliberately does **not** duplicate
> A13/A28 — it points at them.
>
> Companions (do not skip):
> - `reports/REMEDIATION-gift-victim-repair-A28-CORRECTED.sql` — the repair
>   write, **paste-ready** (A28 + 2 CTE-scope fixes). Supersedes
>   `REMEDIATION-gift-victim-repair-A28.sql` for the apply.
> - `reports/AUDIT-gift-victims-A13.sql` @ `a13/gift-redemption-victims` —
>   the victim list (Query 1). Read-only.
> - `reports/OUTREACH-gift-victims-A13.md` @ `a13/gift-redemption-victims` —
>   the proactive apology mail (the DB-found cohort).
> - `reports/AUDIT-support-inbox-gift-search-A39.md` @
>   `a39/support-inbox-gift-audit` — full archetype/template detail
>   (Templates 1/2/3). **Its §1a is wrong — see "A39 §1a correction" below.**

---

## TL;DR — what is and isn't true right now

| | State |
|---|---|
| Code fix (forward) | ✅ **PR #787 merged to `main`** — no *new* victims; redeem now errors honestly instead of faking success. |
| Historical victims repaired | ❌ **Not yet.** A28's write is HANDOFF-only and (as committed) un-runnable through its own GATE. The corrected, paste-ready version is `…-A28-CORRECTED.sql`. |
| Make-good replies (T1/T2/T3) sendable | ❌ **Not until A28-CORRECTED is applied.** Promising "it's done" before the row is fixed = a second lie. |
| Holding reply (Template 0) sendable | ✅ **Yes, now.** Promises a fix, **no date** — true even before A28 runs. Steps 2 & 7 of the incident brief are *only* Template 0 until A28 lands. |
| Sweep automatable by an agent | ❌ **No channel is.** All 8 require Chau (see A39 §1a correction). |

**Order of operations:** ① Run A13 Q1 → transcribe into A28-CORRECTED → clear
its GATE → apply once → only **then** ② send make-goods. The §1 sweep + Template
0 can run **in parallel** with ①, because Template 0 promises no date.

---

## PART 1 — Unblock & apply the repair (the real critical path)

This is the only thing that actually closes the incident. Template 0 just
stops the bleeding while you do this.

1. **Run A13 Query 1** (`reports/AUDIT-gift-victims-A13.sql`, the
   `QUERY 1 — OUTREACH LIST` block) in the **Supabase SQL Editor**. It is
   read-only. Also run Query 2 (blast-radius counts) to size N. Needs
   `auth` schema read ⇒ SQL Editor / service role, not an anon client.
2. For **each** returned row, classify by the `failure_mode` column:
   - `is_gift_redemption=false (THE #787 fingerprint)` → an **UPDATE-class**
     victim → goes in `victims_update`.
   - `no_subscription_row (deleted/never persisted)` → an **INSERT-class**
     victim → goes in `victims_insert`.
   - anything else (`status=… (not active)`, `expired/no period_end`,
     `other`, or `intended_tier_id_besteffort` is NULL) → **do not put it
     in either list.** Resolve by hand (route through Template 3 / A39 §3
     sub-types). Note it.
3. Open `reports/REMEDIATION-gift-victim-repair-A28-CORRECTED.sql`.
   Transcribe each victim — `user_id`, `redeemed_at`,
   `intended_tier_id_besteffort` — into the **6 sites** the file's header
   lists (① PART-A update preview, ② PART-A insert preview, ③ B1 UPDATE,
   ④ B2 INSERT, ⑤ D1 victims_all, ⑥ D2 victims_all). **All 6 must be
   byte-identical.** This 6-way duplication is forced by Postgres
   statement-scoped CTEs — it is the single biggest operator-error risk;
   fill once, then diff all 6 before running.
   - *Why 6 and not 4:* A28-as-committed forgot the `WITH` on PART-A's
     insert preview and on D2 GUARD — both error `relation … does not
     exist` and make GATE steps 2 & 3 impossible. The CORRECTED file adds
     the two missing `WITH` blocks (« CORRECTION 1/2 »); diff it against
     the original to confirm nothing else changed.
4. Clear the in-file **GATE 1–5** (PREVIEW under `ROLLBACK`; verify D1
   honored=true / D2=0 rows / D3=0; period-decision GATE 4). Only then flip
   the single `ROLLBACK;` → `COMMIT;` and re-run **once**.
5. Banner the applied file (`-- APPLIED via SQL Editor <date> — verified
   <N> rows; do not re-run`). The repair is one-shot; the file is then
   cohort history.

> Hard rule (CLAUDE.md → Supabase; memory `project_578_rls_applied`):
> by hand, in the SQL Editor, after reading it. Never `supabase db push`.
> Never an agent. No exceptions for money-path writes.

---

## PART 2 — The human-channel sweep (Chau-only; runs in parallel with Part 1)

### Time window

| Boundary | Date |
|---|---|
| Search **FROM** | **2026-04-01** (pad start — A7's "~6 weeks" is approximate) |
| Search **TO** | **2026-05-26** (pad end — users complain days/weeks late; post-#787 retries throw a *fresh* "đã được dùng rồi" wave from old victims) |

Re-sweep once **~1 week after A28-CORRECTED is applied** to catch the lag tail.
Gmail/Meta search idiom: `(gift OR "mã quà" OR redeem) after:2026/03/25 before:2026/05/27` — search **subject and body**.

### Channels (priority order) — **all require Chau; none agent-checkable**

1. **`admin@mercyblade.com` mailbox** (Cloudflare-forwarded inbox + any
   gift@/hello@/support@ aliases) — highest: written, replyable.
2. **Facebook Page / Messenger DMs** (Meta Business Suite → Inbox) —
   highest: 220K diaspora channel, public reputation.
3. **Facebook comments & post replies** (gift/Premium/launch posts,
   tagged mentions) — public; others read it.
4. **Zalo** (OA announcements + 1:1).
5. **Facebook IELTS / English-learning groups** (Chau's posts + mentions).
6. **In-app feedback** — ⚠️ **see A39 §1a correction — NOT a complaint
   channel; do not waste a query on it.**
7. **TikTok / YouTube** comments & DMs.
8. **Replies to the redeem-confirmation email** (`send-redeem-email`) →
   land at admin@.

### Search terms — paste into each channel's search box

**Vietnamese (primary — ~95% of complaints):**
```
mã quà tặng · mã quà · gift code · mã không kích hoạt được ·
không kích hoạt được · chưa kích hoạt · đã kích hoạt nhưng ·
đã sử dụng nhưng · mã đã được dùng rồi · mã đã được sử dụng ·
nhưng tôi chưa dùng · chưa bao giờ dùng mã · không dùng được ·
vẫn chưa dùng được · không vào được Premium · không lên được Premium ·
vẫn bị khóa · Chào mừng nhưng · báo thành công nhưng · mất tiền ·
mua quà tặng · tặng tài khoản · mã hết hạn · không tìm thấy mã ·
nâng cấp không được · lừa đảo   ← fastest reply, see Part 4
```
**English (fallback — gift recipients abroad):**
```
gift code · gift card · redeem · didn't activate · not activated ·
already redeemed · already used · code used but · never used the code ·
still locked · no premium · upgrade not working · welcome message but ·
said success but · scam / fraud
```

### Recognising the complaint (literal strings the customer saw)

- **During the bug:** `🎁 Mã quà tặng đã được kích hoạt!` / `Chào mừng bạn
  đến với <gói>! 💛` / `Đã kích hoạt <N> tháng` → then still locked.
- **After #787 (a victim retrying now):** `Mã đã được dùng rồi.` ← the loud
  one — their *own* fake success burned the code, so the system now calls
  an innocent victim a cheater. This is the sharpest insult of the incident;
  Template 2 (A39) must explicitly absolve them.

### Tracking log — keep this for every hit

| date | channel | handle / email | code (if given) | screen they reported | in A13 Q1? (Y/N/?) | T0 sent? | class (B1/B2/3a-e) | make-good sent? |
|---|---|---|---|---|---|---|---|---|

---

## PART 3 — The only reply you can send today: Template 0

> Send the moment you find a message. Apology + commitment, **no date** —
> true even before A28 runs. Locked to A13's sender/voice/promise
> (admin@mercyblade.com, founder personal voice, manual activation, intended
> tier, **1 year**, code stays credited, user does nothing). VN recipients:
> send the Vietnamese block only.

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

**Make-good replies (Templates 1 / 2 / 3, 3a–3e):** in
`reports/AUDIT-support-inbox-gift-search-A39.md` §3. **Do not send any of
them until A28-CORRECTED is applied for that user** (Part 1). Until then,
every hit gets Template 0 and goes in the tracking log.

---

## PART 4 — Worst-case wording first

Any message containing **"lừa đảo" / "scam" / "fraud"**, or **any public
Facebook comment**, gets **Template 0 within hours, not days** — it is
public, in the home market, on the 220K channel. Reply first, log second.

---

## A39 §1a correction (this supersedes A39's "in-app feedback" claim)

A39 §1a says an agent can pull a DB-backed slice from a `public.mercy_feedback`
table with `email` / `message` columns. **That is wrong:**

- The live table is **`mercy_feedback_events`** (per `api/mercy-feedback.ts`).
  Its searchable text columns are `feedback_reason` and `answer_text_snapshot`
  — **AI-answer thumbs-up/down telemetry**, not a free-text support inbox.
  There is **no `message` and no `email` column**.
- A39's §1a SQL therefore (a) errors on the wrong table name, and (b) even
  rewritten against the real table would **not** surface gift-code
  complaints — that data is not captured there. (Consistent with memory
  `project_mercy_feedback_blocked`: `mercy_feedback_events` is the AI-vote
  table A12 restored 2026-05-19, not a complaint channel.)
- **Net:** there is **no agent-checkable channel** for this incident.
  Channel #6 is struck. **All 8 channels require Chau.** Do not run A39 §1a.

A39's templates and §3 archetypes are unaffected and remain canonical.

---

## Consistency (vs A13 / A28-CORRECTED) — confirmed

Sender `admin@mercyblade.com`, founder personal voice, 100%-our-fault
attribution, promise = manual activation of the intended tier for **1 year**
with the code staying credited and the user doing nothing, "đã sửa lỗi gốc",
and the timing discipline (Template 0 no-date → make-good only after the
repair runs) all match A13's `OUTREACH-gift-victims-A13.md` and the period
semantics of `…-A28-CORRECTED.sql` (code-faithful `used_at + 1 year`, GATE-4
goodwill is a deliberate per-run Chau decision, never automatic).

*End — operator runbook. Committed-not-PR'd so it survives `git worktree
prune`. The repair (Part 1) is what closes the incident; everything else
buys the time to do it without losing the customer.*
