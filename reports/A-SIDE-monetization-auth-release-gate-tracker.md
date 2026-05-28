# A-side Monetization/Auth Release Gate Tracker

Owner lane: ChatGPT / A-side
Scope: monetization, auth, entitlement, referral, and A-side release-gate security work
Status date: 2026-05-28

## Purpose

This tracker records the A-side monetization/auth release-gate state. It is the
A-side slice only, not the full C-side/Claude-side security-audit surface.

Ignore C-side/Claude-side reports and docs for this lane unless Chau explicitly
reassigns them to A-side.

## Operating Split

- ChatGPT owns A-side only.
- Claude owns C-side and Kids.
- A-side must not touch Kids/C-side unless Chau explicitly reassigns.
- GitLab/Netlify are the production path.
- GitHub/Vercel are historical/inactive unless restored.

## Production DB Safety Rule

Future production applies need one owner only. Avoid parallel production applies.

Destructive production SQL requires Chau's exact phrase:

> Approve Phase 2 destructive SQL for <task>.

This applies to:

- `DROP`
- `REVOKE`
- `DELETE`
- `TRUNCATE`
- RLS tightening that removes access
- destructive schema cutover/migration

This does not apply to:

- read-only queries
- new-object creation
- additive policies
- merging an MR that contains SQL but does not auto-apply it

Even with service-role access, agents must not run destructive production SQL
without the exact approval phrase.

## Current Gate State

A-side has no active Critical blockers recorded in this tracker.

Latest A-side release-gate verification found one non-Critical release-gate
ledger item pending: `20260702000000` did not appear in the linked Supabase
migration ledger output.

## Critical Tracker

### `public.subscriptions`

Status: CLOSED.

Closure state:

- MR !86 merged the additive Phase 1 RLS lane.
- MR !104 Phase 2 merged, production-applied, and final postflight passed.
- Legacy policy absent:
  - `subscriptions_admin_read`
- Remaining policies:
  - `subscriptions_self_select`
  - `subscriptions_admin_select`
- Final evidence:
  - RLS enabled.
  - Authenticated self-read works.
  - Authenticated cross-user read blocked.
  - Broad authenticated `raw_payload` visibility blocked.
  - `service_role` read works.

Do not reopen this Critical unless new production evidence shows
`public.subscriptions` is again broadly authenticated-readable or RLS-disabled.

### Referral Leaderboard `auth_users_exposed`

Status: CLOSED.

Closure state:

- Completed as MR !32 plus Phase 2 destructive SQL after explicit Chau approval.
- Old legacy matviews dropped:
  - `public.monthly_referral_leaderboard`
  - `public.all_time_referral_leaderboard`
- Old browser grants gone.
- Legacy cron gone/absent.
- Safe projections remain live and browser-selectable:
  - `public.referral_leaderboard_monthly_public`
  - `public.referral_leaderboard_all_time_public`
- API postflight: old anon routes return 404; safe anon routes return 200.
- Dependency postflight: no remaining public referral leaderboard dependency on
  `auth.users`.
- Supabase Advisor postflight did not show referral leaderboard
  `auth_users_exposed`.

Do not reopen this Critical unless new production evidence shows the referral
leaderboard again exposes `auth.users`.

## Completed A-side Security Items

### MR !112 Admin Security Health Auth Fix

Status: MERGED.

MR !112 admin-security-health auth fix is merged.

Authenticated visual `/admin` Security Health check still needs Chau/admin
browser session. The anon-bearer 401 bug is fixed in deployed bundle
`b53bac466`.

### MR !85 Entitlement/User-rank Phase A

Status: PRODUCTION-APPLIED / POSTFLIGHT PASSED.

Scope:

- `public.user_entitlements`
- `public.user_entitlements_v`
- `public.v_user_ai_monthly_meter`
- `public.mb_user_effective_rank`
- `public.get_my_ai_monthly_meter()`

Closure state:

- MR !85 entitlement/user-rank Phase A merged.
- Production SQL applied.
- Postflight passed.

## C7 Corrected Residuals

### SECURITY DEFINER Functions Without Caller-check

Corrected residual count: 3.

Residual functions:

- `get_admin_level`
- `check_admin_email_rate_limit`
- `referral_owner_grants_in_year`

False positives / already caller-checked:

- `grant_referral_reward`
- `kick_study_group_member`
- `apply_referral_code`

Previous count was 6. Use the corrected residual count of 3 going forward.

### SECURITY DEFINER Views Without `security_invoker`

Corrected residual count: 1.

Residual view:

- `v_user_pronunciation_stats`

False positive / already hardened:

- `vip3_public_profiles`, hardened on 2025-12-07

Previous count was 2. Use the corrected residual count of 1 going forward.

### Draft SQL Status

`docs/rls-fix-drafts/` contains drafts only.

Do not treat files in `docs/rls-fix-drafts/` as migrations to apply. Review
each draft when ready to ship.

## A-side Observations / Release Gates

| Gate | State | Evidence / source | Next action |
|---|---|---|---|
| `public.subscriptions` RLS | CLOSED | MR !104 Phase 2 merged, production-applied, and final postflight passed; `subscriptions_admin_read` absent; `subscriptions_self_select` and `subscriptions_admin_select` remain; RLS enabled; authenticated self-read works; cross-user read and broad authenticated `raw_payload` visibility blocked; `service_role` read works. | No action unless new evidence reopens it. |
| Referral leaderboard `auth_users_exposed` | CLOSED | MR !32 plus approved Phase 2 destructive SQL; postflight showed safe projections live and no remaining public dependency on `auth.users`. | No action unless new evidence reopens it. |
| MR !112 admin-security-health auth fix | MERGED | MR !112 merged; deployed bundle `b53bac466` fixes the anon-bearer 401 bug. | Authenticated visual `/admin` Security Health check still needs Chau/admin browser session. |
| MR !85 entitlement/user-rank Phase A | CLOSED | Production-applied and postflight passed. | No tracker blocker. |
| Profiles POST RLS acceptance/observation | open observation | Local tests include profile RLS contract coverage; production acceptance not recorded in this tracker. | Chau or assigned DB owner records acceptance, rejection, or required MR. |
| Android Studio release checks | still part of release gate | A4 verification found missing local Gradle project files, no device attached, AAB version mismatch, and packaged Capacitor `appId` mismatch. | Chau reruns Android Studio checklist or explicitly removes Android from this release gate. |
| Play Console acceptance readiness | unknown | No Play Console access/status recorded here. | Chau records package acceptance plus version acceptance or exact rejection. |
| Native Sentry probe | scoped/deferred | Owner scope exists; deferred behind previous Supabase Critical work. | Resume if Chau prioritizes native release evidence. |

## Latest A-side Release-gate Verification

Run date: 2026-05-28 UTC.

Scope: A-side only. No SQL writes. No product code. No C-side work.

| Check | Result | Evidence / notes |
|---|---|---|
| MR !134 | PASS | MR !134 is merged; branch and merge-request pipelines were green. |
| `/admin` live deploy | PASS | `https://mercyblade.com/admin` returned HTTP 200 from Netlify with current asset set `index-ksR59SgW.js`, `supabase-DXjt-d6_.js`, `ui-DMtyoxMb.js`, `vendor-DiQ1t48U.js`, `react-Blmy93np.js`; HTML ETag changed to `b82438f0862539f93f45100d2059c780-ssl`. |
| Security Health `admin-security-feed` 401 | MANUAL CHECK PENDING | Anonymous `/admin` reaches the admin gate and does not call `admin-security-health`; no 401 is shown in that flow. Authenticated visual Security Health verification still needs Chau/admin browser session. Direct unauthenticated edge-function call still returns the expected 401. |
| Monetization/auth surfaces | PASS | Live route smoke returned HTTP 200 for `/pricing`, `/signin`, `/billing`, and `/account`; protected `/billing` and `/account` redirected to `/signin?returnTo=...` as expected when unauthenticated. |
| Referral leaderboard surface | PASS | `/leaderboard/referral` returned HTTP 200 and rendered the referral leaderboard surface. |
| MR !85 entitlement/user-rank Phase A | PASS | Anon REST reads of `user_entitlements`, `user_entitlements_v`, `v_user_ai_monthly_meter`, and `mb_user_effective_rank` returned 401; service-role reads of all four returned 200. `get_my_ai_monthly_meter()` returned 401 to anon and 200 to service role. |
| `public.subscriptions` closure | PASS | Closure remains based on A2 final evidence: `subscriptions_admin_read` absent; `subscriptions_self_select` and `subscriptions_admin_select` present; RLS enabled; authenticated self-read works; authenticated cross-user read blocked; broad authenticated `raw_payload` visibility blocked. A4 live REST recheck: anon `subscriptions` read returned 401; service-role `subscriptions` reads returned 200 including `raw_payload`. Direct `pg_policy` recheck was not rerun because no DB password is available and Supabase schema dump is blocked by Docker not running. |
| Referral leaderboard closure | PASS | Anon REST safe routes returned 200: `referral_leaderboard_monthly_public`, `referral_leaderboard_all_time_public`. Legacy routes returned 404: `monthly_referral_leaderboard`, `all_time_referral_leaderboard`. |
| Migration ledger `20260630000000` | PASS | `supabase migration list --linked` showed remote `20260630000000`. |
| Migration ledger `20260701000000` | PASS | `supabase migration list --linked` showed remote `20260701000000`. |
| Migration ledger `20260702000000` | FAIL / PENDING | `supabase migration list --linked` did not show `20260702000000` in the filtered output. This is a release-gate ledger item, not a newly observed live Critical. |

## MR / Merge Rules

- A-side monetization/auth MRs are merged by Chau separately from C-side Stage
  3A/3B MRs.
- Do not bundle Supabase Criticals together. One confirmed Critical equals one
  MR and one verification record.
- Do not include Kids/C-side changes in A-side monetization/auth MRs.
- Do not use a documentation-only MR to claim a Supabase Critical is fixed. The
  fixing MR must include the actual SQL/config/policy change and evidence.
- This tracker is documentation only and does not apply SQL.

## Stale Contradictions Corrected Here

- `public.subscriptions` is CLOSED after MR !104 Phase 2 merged,
  production-applied, and final postflight passed.
- Referral leaderboard `auth_users_exposed` remains CLOSED.
- MR !112 admin-security-health auth fix is merged.
- MR !85 entitlement/user-rank Phase A is production-applied and postflight
  passed.
- A-side has no active Critical blockers recorded in this tracker.
- Future production applies need one owner only; avoid parallel applies.
