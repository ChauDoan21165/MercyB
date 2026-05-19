# CUSTOMER — Gift-victim outreach send-side ops (A3b)

> Agent: A3b · Branch: `chore/gift-outreach-ops` · Date: 2026-05-19
> Labels: money-path, customer-incident, outreach, ops
> Pairs with: PR #799 — `reports/CUSTOMER-gift-victim-apply-package.md`
>            (Block 4 is the source-of-truth email copy; this file is **send-side procedure only**, not copy)

## What this is — and what it isn't

This is the **operational runbook** for sending the gift-victim apology
once `reports/CUSTOMER-gift-victim-apply-package.md` Block 3 has committed
(victims are entitled again).

It covers: which inbox, in what order, with what subject, how to handle a
reply, what to log, and when to abort.

It does **NOT** redefine the email body. If anything below disagrees with
PR #799 Block 4, PR #799 wins — fix this doc, not the copy.

## 1. Sender configuration

| Field | Value | Source |
|---|---|---|
| Provider | Resend | `supabase/functions/email-broadcast/index.ts` (imports `Resend`, reads `RESEND_API_KEY`) |
| From-address | `Mercy Blade <admin@mercyblade.com>` | canonical pattern in `referral-recognition-email`, `trial-expiry-emails`, `email-reengagement`, `email-broadcast`, `send-feedback-reply`, `send-security-email`, `email-automations` |
| Reply-To | `admin@mercyblade.com` | same |
| Inbox | `admin@mercyblade.com` → forwarded to Chau's personal inbox via Cloudflare Email Routing | `CLAUDE.md` (DNS section) |
| Bounce / complaint visibility | Resend dashboard | Resend account |

**Do NOT send from `hello@mercyblade.app`** — legacy artifact in
`send-redeem-email/index.ts`. Memory: `project_sending_address` — always
`admin@mercyblade.com`, never `hello@`.

### Pre-send DNS + reputation verification (do BEFORE the first send)

Code comments call `admin@mercyblade.com` a "verified Resend domain"
(see headers in `referral-recognition-email/index.ts` /
`email-reengagement/index.ts` / `trial-expiry-emails/index.ts`). The DNS
records themselves live in the Cloudflare zone for `mercyblade.com`, not
in this repo — verify them out-of-band before the first apology lands.

Run these from a normal terminal (not the SQL Editor):

```bash
# 1. SPF — should include Resend
dig +short TXT mercyblade.com | grep -i 'v=spf1'
# expect: a record containing `include:_spf.resend.com` (or `include:resend.com`)
# if missing or "softfail" instead of `~all` / `-all`, STOP and fix DNS first

# 2. DKIM — Resend uses a selector under `resend._domainkey`
dig +short TXT resend._domainkey.mercyblade.com
# expect: a CNAME -> resend.com (or a long TXT with `v=DKIM1; k=rsa; p=...`)
# if empty, STOP — DKIM is what stops Gmail/Outlook from spam-folder-ing the apology

# 3. DMARC — should be at least `p=none` so failures are reported,
#    not silently delivered to spam
dig +short TXT _dmarc.mercyblade.com
# expect: a record with `v=DMARC1` and a `rua=mailto:...` reporting address
# if missing, send is still possible but quality-of-service is worse;
# not a blocker, but raise to Chau

# 4. Resend dashboard — confirm domain still shows "Verified" (green),
#    not "Pending" / "Failed". Resend revokes verification on DNS drift.
#    https://resend.com/domains -> mercyblade.com
```

If any of (1) or (2) is missing/wrong, **abort the send** and reconfigure
DNS in Cloudflare first. A bounced or spam-foldered apology is worse than
a same-day delayed one.

## 2. Send order — smallest exposure first

Cohort size = the row count of `AUDIT-gift-victims-A13.sql` Query 1 after
Chau runs it. With ~100 total profiles, victims are a strict subset (only
gift-code redeemers who currently have no honored entitlement) — expect
single digits to low double digits.

Three waves, escalating exposure:

| Wave | Recipient | Purpose | Wait before next |
|---|---|---|---|
| 0 — self-test | `admin@mercyblade.com` (Chau's own inbox) | Confirm DNS, rendering, links, no template artifacts (no stray `{{TEN}}`, no broken accents) | render OK + delivered to inbox not spam |
| 1 — single canary | ONE real victim, picked deliberately: lowest blast radius if reply goes badly (e.g. earliest `redeemed_at`, smallest `intended_tier`, friendly account if known) | Live test of: real send, real Resend logs, real reply path | 24h or until they reply, whichever comes first |
| 2 — remainder | the rest, one at a time | Personalized; no merge-merge batch | n/a |

**Cadence inside Wave 2:** send one email, log it (§5), wait at least
30 seconds before the next. Reasons: (a) gives Resend time to register a
hard-bounce so you can pause if delivery is broken, (b) keeps Chau's
inbox responsive if a reply comes in mid-batch, (c) avoids any per-second
rate-limit on the shared Resend account.

**Never** auto-send the whole list in a loop. Each Wave 2 email is a
deliberate copy-paste-into-Resend-dashboard (or `curl`) operation. This
is a ~10-customer apology, not a campaign.

## 3. Subject lines (first-party MercyBlade copy only)

These are reproduced from PR #799 Block 4 verbatim — first-party
MercyBlade language, no external IP / lyrics / quoted material:

- **Vietnamese (primary, send for VN recipients):**
  `Lỗi từ phía MercyBlade — mình sẽ kích hoạt lại quà tặng cho bạn`
- **English (fallback, only for non-VN recipients):**
  `A mistake on our side — we're restoring your MercyBlade gift`

Do **not** alter the subjects per-recipient. They are part of the apology's
honesty (the screen previously said "Welcome!" — this subject deliberately
contradicts that, and Chau's name should be consistent across the cohort
so a later reply chain on either side can be matched up).

## 4. Reply handling

**Who handles replies:** Chau, personally. `admin@mercyblade.com` forwards
to Chau's personal inbox — no support queue, no shared mailbox, no
templates. The apology is a founder-to-customer letter; the reply chain
stays a founder-to-customer letter.

**Default response posture (per STRATEGY §1 outcomes-first):**

The apology already promises the **right thing** — full gift duration
re-granted, no action required. After Block 3 commits, that's literally
true on their account. So most replies will be "thanks, all good" or
"how do I check it's active?" — answer those in one or two sentences,
confirm the new `current_period_end`, move on.

**Escalation ladder (use only if a victim asks for more):**

| Victim asks for | Default reply | Concession (use only on second push-back) |
|---|---|---|
| "Show me it's active" | Reply with their new `current_period_end` date from `user_subscriptions` (you can read it for them) and a screenshot if helpful | n/a |
| "I want a longer gift" | The full year has been restored; no further extension is automatic | Add **+90 days** to `current_period_end` for that single user (one-off SQL UPDATE, log it). Do not exceed +90d without Chau's deliberate decision. |
| "I want my money back" | Gift codes have no purchase on this side (the gifter paid). If they were the gifter, route via Stripe refund per `RECON-billing-architecture-as-built-B45.md` | Stripe refund is the last resort — confirm with Chau before issuing |
| "I want to delete my account" | Honor it. Point them at `/account/delete`. Do not lobby. | n/a |
| Anything ambiguous | Reply: "Mình muốn chắc — bạn muốn mình làm gì tiếp theo?" / "I want to make sure — what would you like me to do next?" | n/a |

**Tone:** Direct, low-formality, first-person ("mình" / "I"). Same voice
as the apology. Never deflect to "support" — there isn't one. Never use
"we apologize for the inconvenience" — the apology already named the
incident as "lying to users, even by accident", and the reply chain has
to stay at that register or it reads as walked back.

**What NOT to offer:**

- A coupon for an unrelated product.
- An "upgrade to Level 3 II" — that's a different tier with a different
  promise; mixing it in muddles the apology.
- A "we'll send you a survey" — never on an apology thread.

## 5. Tracking — what to log, where, with what privacy guard

Log every Wave-1/2 send into a SINGLE append-only file in this repo:

```
reports/CUSTOMER-gift-outreach-log.md
```

Create the file with this exact header on the first send (re-use on
subsequent sends, never re-create):

```markdown
# CUSTOMER — Gift-victim outreach log

> Append-only. One row per send. No raw emails / names — recipient hash only.
> Reference: reports/CUSTOMER-gift-victim-apply-package.md (PR #799) Block 4.

| sent_at (UTC) | wave | recipient_hash | gift_code_value | intended_tier | resend_message_id | reply_status | notes |
|---|---|---|---|---|---|---|---|
```

Field rules:

| Field | Value | Privacy note |
|---|---|---|
| `sent_at` | ISO-8601 UTC, e.g. `2026-05-19T14:32:11Z` | non-PII |
| `wave` | `0` / `1` / `2` (per §2) | non-PII |
| `recipient_hash` | `sha256(lower(trim(current_email)) + "::gift-outreach")` — first 12 hex chars only | non-reversible; do NOT log raw email |
| `gift_code_value` | from A13 Q1 — already burned, no power | already non-secret post-redeem |
| `intended_tier` | `Level 2` / `Level 3` | non-PII |
| `resend_message_id` | from Resend API response | non-PII |
| `reply_status` | `pending` / `replied:<short>` / `bounced` / `escalated` | summarize content, don't paste it |
| `notes` | short free-form — e.g. `"asked for +90d, granted"` | summarize, don't paste raw user text |

**Generating the hash:**

```bash
printf '%s::gift-outreach' "$(echo 'name@example.com' | tr '[:upper:]' '[:lower:]' | xargs)" \
  | shasum -a 256 | head -c 12
```

(`xargs` here trims whitespace; result is the first 12 hex chars only —
collisions are practically zero at a cohort of ~10.)

**Do NOT log:**

- Raw recipient email.
- The literal apology text — it is in PR #799, no need to duplicate.
- Reply contents verbatim — paraphrase in `notes` if relevant.
- Bank / payment / passport / govt-id details — if any appear in a reply,
  redact in the inbox conversation, do not transcribe.

## 6. Abort conditions

**Stop sending immediately and escalate to Chau** if any of the following
appear, on any single reply or any bounce report:

| Signal | Why it stops everything |
|---|---|
| Reply mentions a **lawyer** / "legal action" / "consumer-protection" / Cục Quản lý cạnh tranh / Toà án / "I will report this" | Any further unilateral apology can be turned into evidence. Lawyer-to-founder, not founder-to-customer. |
| Reply mentions a **journalist / media / báo chí / Facebook public post planned** | Switches the matter from private remediation to public posture — a different decision frame. |
| Repeated **hard bounces** (e.g. 3 in a row in one wave) | Likely DNS regression (SPF/DKIM drift) — re-run §1 verification before another send. |
| Resend domain status flips off "Verified" in the dashboard | Same — stop and reverify before sending another. |
| Any victim says they were **double-charged** (Stripe + gift) | That's not this incident; it's a different defect that needs a Stripe refund + separate apology. Pause this cohort, surface the case. |
| Any signal that the **wrong person** received the apology (e.g. an old email-routing artifact) | Stop, reconfirm the A13 Q1 victim list before continuing. |

"Escalate to Chau" here means: same human who is running this runbook
flags the case to themselves explicitly and stops the send loop. There is
no external escalation path — Chau is both operator and final owner.

## 7. Source of truth — copy + repair

| Artifact | Lives in | Role |
|---|---|---|
| Email body (VI primary + EN fallback) + subject lines | PR #799 — `reports/CUSTOMER-gift-victim-apply-package.md` Block 4 | source of truth for the **text** — do not retype it here, copy from #799 |
| Repair SQL (Block 3 of #799) | same | must have COMMITted before any Wave-1/2 send |
| Audit SQL (Block 1 of #799) | same | victim list — drives §2 (send order) and §5 (log fields) |
| Forward fix | PR #787 — `redeem-gift-code` returns honest errors | unrelated to outreach, but mention it in any reply that asks "how do I know it won't happen again" |
| This file | PR #<assigned on push> | **send-side procedure only** — no copy, no SQL |

## Lifecycle

When the last Wave-2 send is done, append a final line at the bottom of
`reports/CUSTOMER-gift-outreach-log.md`:

```
> COMPLETE — last send <date> · <N> victims contacted · <M> replied · <K> escalated
```

And banner the top of THIS file:

```
> APPLIED — runbook executed <date>; do not re-run without a new incident
```

Keep both files committed as incident history.
