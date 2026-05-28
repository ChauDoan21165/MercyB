# A-side Monetization/Auth Release Gate Tracker

Owner lane: ChatGPT / A-side
Scope: monetization, auth, entitlement, referral, and A-side release-gate security work
Status date: 2026-05-27

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

## Closed Criticals

### `public.subscriptions`

Status: CLOSED.

Closure state:

- MR !86 merged the additive Phase 1 RLS lane.
- MR !104 Phase 2 merged, production-applied, and postflight passed.
- RLS is enabled on `public.subscriptions`.
- `subscriptions_self_select` is present and effective.
- `subscriptions_admin_select` is present and effective.
- Postflight passed after production application.

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
| `public.subscriptions` RLS | CLOSED | MR !104 Phase 2 merged/applied/postflight passed. | No action unless new evidence reopens it. |
| Referral leaderboard `auth_users_exposed` | CLOSED | MR !32 plus approved Phase 2 destructive SQL; postflight showed safe projections live and no remaining public dependency on `auth.users`. | No action unless new evidence reopens it. |
| MR !112 admin-security-health auth fix | MERGED | MR !112 merged. | No tracker blocker. |
| MR !85 entitlement/user-rank Phase A | CLOSED | Production-applied and postflight passed. | No tracker blocker. |
| Profiles POST RLS acceptance/observation | open observation | Local tests include profile RLS contract coverage; production acceptance not recorded in this tracker. | Chau or assigned DB owner records acceptance, rejection, or required MR. |
| Android Studio release checks | still part of release gate | A4 verification found missing local Gradle project files, no device attached, AAB version mismatch, and packaged Capacitor `appId` mismatch. | Chau reruns Android Studio checklist or explicitly removes Android from this release gate. |
| Play Console acceptance readiness | unknown | No Play Console access/status recorded here. | Chau records package acceptance plus version acceptance or exact rejection. |
| Native Sentry probe | scoped/deferred | Owner scope exists; deferred behind previous Supabase Critical work. | Resume if Chau prioritizes native release evidence. |

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
  production-applied, and postflight passed.
- Referral leaderboard `auth_users_exposed` remains CLOSED.
- MR !112 admin-security-health auth fix is merged.
- MR !85 entitlement/user-rank Phase A is production-applied and postflight
  passed.
- A-side has no active Critical blockers recorded in this tracker.
- Future production applies need one owner only; avoid parallel applies.
