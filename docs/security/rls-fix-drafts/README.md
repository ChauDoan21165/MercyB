# RLS Fix Drafts — companion to !84

> **⚠️ THESE ARE DRAFTS. NOT MIGRATIONS TO APPLY.**
>
> Every `.sql` file in this directory is documentation. They live in
> `docs/security/rls-fix-drafts/`, **not** `supabase/migrations/` —
> placing them in `migrations/` would imply they're ready to apply.
>
> **C-side cannot apply destructive SQL.** Per the tracker rule
> (`reports/A-SIDE-monetization-auth-release-gate-tracker.md`):
> *"Destructive DB operations require explicit Chau per-operation
> approval."* and *"Each Supabase Critical must be one MR."*
>
> The role of this MR is to give A-side / ChatGPT pre-written,
> reviewable SQL artifacts so the per-finding remediation MRs can move
> faster. A-side reads, decides scope/timing, and — if accepted —
> copies the operative parts into a new timestamped file under
> `supabase/migrations/`, applies via Supabase SQL Editor, and records
> the result in the tracker.

## Cross-reference

| Source | What it is |
|---|---|
| **!84** (`docs/security/rls-audit-surface.md`) | The audit. 11 findings, risk-ranked. |
| **This directory** | One draft .sql per LIVE finding from !84. |
| **A-side tracker** (`reports/A-SIDE-monetization-auth-release-gate-tracker.md`) | The release-gate state machine. Each `security_definer_view` / `authenticated_security_definer_function_executable` row gets updated once the corresponding MR is applied. |

## Drafts in this directory

| File | Finding | Severity | Real fix? |
|---|---|---|---|
| `01-subscriptions-enable-rls.sql` | !84 §1 #1 — `public.subscriptions` no RLS | **CRITICAL** | Yes — `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + 2 policies |
| `02-security-definer-views-needs-review.sql` | !84 §3D — view w/o `security_invoker = true` | HIGH | Yes — `v_user_pronunciation_stats` recreate with the flag |
| `03-security-definer-functions-caller-check.sql` | !84 §3B — SECURITY DEFINER fns taking user-id params | MEDIUM | Yes — inline caller checks on 3 functions |
| `04-record-login-attempt-rate-limit.sql` | !84 §1 #4 — anon DoS via lockout flood | MEDIUM-HIGH | Yes — re-use `incr_ip_rate_limit` |
| `05-get-admin-level-tightening.sql` | !84 §1 #5 — admin enumeration | MEDIUM | **Alternative shape** to draft 03 (Shape B vs Shape A); A-side picks one |
| `06-unsubscribe-token-entropy-review.sql` | !84 §1 #6 — mass unsubscribe if weak tokens | MEDIUM | **No fix needed** — verified 192-bit pgcrypto entropy |

## Audit corrections discovered during drafting

While drafting these files I had to read every flagged function body in
detail. The deeper read invalidated three findings from !84 §3B —
those functions are **already safe** because they already enforce the
caller-equals-subject check the audit flagged as missing.

| !84 §3B row | Actual state | Where the check lives |
|---|---|---|
| `grant_referral_reward(uuid)` — "HIGH — must validate caller" | ✅ Already safe | `IF v_caller <> p_referred_user_id THEN error` in `referral_engagement_gate.sql:144` |
| `kick_study_group_member(uuid, uuid)` — "HIGH — must validate caller is group owner" | ✅ Already safe | `IF v_owner <> v_caller THEN error` in `study_groups.sql:322` |
| `apply_referral_code(text)` — "MEDIUM — must validate caller" | ✅ Already safe (different concern) | Takes a code, uses `auth.uid()` as the referred user by construction; also has `self_referral` block |

So the actual residual `authenticated_security_definer_function_executable`
payload is **3 functions, not 6**: `get_admin_level`,
`check_admin_email_rate_limit`, `referral_owner_grants_in_year`.
Draft 03 addresses those three.

Similarly, !84 §3D listed **two** NEEDS-REVIEW views; on re-read,
`vip3_public_profiles` had already been hardened on 2025-12-07 with
`WITH (security_invoker = true)` in
`supabase/migrations/20251207003729_*.sql`. Draft 02 addresses only
`v_user_pronunciation_stats`.

These corrections **reduce** the risk surface !84 reported. They do
not constitute a NEW critical finding — they reflect that the existing
code is already partially defended. A future audit pass should read
function bodies, not just signatures, before flagging.

## How A-side should consume this directory

For each draft file:

1. **Read the file's header comment**. Every draft starts with the
   finding context, why this pattern was chosen, and the alternatives
   considered.
2. **Re-verify the evidence** against current `supabase/migrations/`
   state — the drafts were written against the post-!84 main; if
   anything has shipped between then and your read, the baseline may
   have moved.
3. **Check the call sites** the draft references. Drafts 01 and 05 in
   particular have pre-apply audit checklists embedded.
4. **Copy** (don't symlink, don't move) the operative SQL into a new
   `supabase/migrations/{YYYYMMDDHHMMSS}_…sql` file in its own MR per
   the tracker's one-MR-per-Critical rule.
5. **Apply via SQL Editor** with explicit Chau approval; record the
   apply result and post-apply verification (each draft has a
   verification section) in the tracker.

## What's NOT in this directory

- A draft for the `auth_leaked_password_protection` Advisor finding —
  it's a Supabase Auth dashboard setting, not a repo migration. Chau
  toggles it in the Supabase dashboard.
- A draft for closing the stale `refresh-referral-leaderboards-daily`
  cron job referenced in !84 §6B — that's a `SELECT cron.unschedule(...)`
  call; trivial enough to bundle into whichever drift-cleanup MR
  A-side ships next.
- Drafts for the historical-closed findings (`feature_flags` PII window,
  referral-leaderboard `auth_users_exposed`) — those are CLOSED, no
  fix needed.
- Drafts for `mercy-ai rls_disabled_in_public` /
  `mercy-ai sensitive_columns_exposed` — per the tracker, those are
  "not confirmed current Critical" without exact Advisor evidence.

## A note for the next auditor

The pattern that pays off: read the function BODY before judging the
function. The signature `public.foo(p_user_id uuid)` returns
SECURITY DEFINER tells you the surface; only the body tells you the
mitigation. If you can spare the time, this entire directory could
become a parameterized template — `sql/audit-helpers.sql` that emits
the same drafts from the actual current state. Not in scope for !84
follow-up but worth noting.
