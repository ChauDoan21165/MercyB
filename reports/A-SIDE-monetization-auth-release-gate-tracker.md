# A-side Monetization/Auth Release Gate Tracker

Owner lane: ChatGPT / A-side
Scope: monetization, auth, entitlement, referral, and A-side release-gate security work
Status date: 2026-05-27

## Purpose

This tracker records the A-side monetization/auth release-gate state that was previously held in session memory but was not present on `main`.

It complements the Claude-side security tracking work, including:

- `subscriptions-rls-callsite-verification` / MR !94
- in-flight `rls-audit-surface.md`

This file is the A-side monetization/auth slice, not the full security-audit surface.

## Operating split

- ChatGPT owns A-side only.
- Claude owns C-side and Kids.
- A-side must not touch Kids/C-side unless Chau explicitly reassigns.
- GitLab/Netlify are the production path.
- GitHub/Vercel are historical/inactive unless restored.

## Production DB safety rule

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

Even with service-role access, agents must not run destructive production SQL without the exact approval phrase.

## Current ACTIVE CRITICAL: `public.subscriptions`

### Status

`public.subscriptions` is ACTIVE CRITICAL / NOT CLOSED.

MR !86 is merged, but production is not closed. The production apply failed before the intended SQL execution, and the intended production state has not been verified.

A2 postflight failed.

### Intended MR !86 migration

Migration:

```text
supabase/migrations/20260701000000_subscriptions_rls_select_policies.sql
```

Intended Phase 1 fix remains additive:

- enable RLS on `public.subscriptions`
- add authenticated self SELECT policy
- add admin SELECT policy

No destructive-SQL approval phrase is required for the implementation MR because the intended Phase 1 implementation does not use `DROP`, `REVOKE`, `DELETE`, `TRUNCATE`, or destructive migration steps. Production apply still requires normal review discipline.

### Current verification state

Expected policies are missing:

- `subscriptions_self_select`
- `subscriptions_admin_select`

Unexpected/legacy policy observed:

- `subscriptions_admin_read`

Authenticated self-read failed in simulation.

### Closure requirements

Do not mark `public.subscriptions` closed until production verification records:

- RLS enabled on `public.subscriptions`
- `subscriptions_self_select` present and effective
- `subscriptions_admin_select` present and effective
- `subscriptions_admin_read` either removed, superseded, or explicitly accepted as harmless by Chau/DB owner
- authenticated self-read simulation passes
- admin read simulation passes
- no unintended browser-readable exposure remains

## Closed Critical: referral leaderboard `auth_users_exposed`

Referral leaderboard is CLOSED.

Closure state:

- completed as MR !32 plus Phase 2 destructive SQL after explicit Chau approval
- old legacy matviews dropped: `public.monthly_referral_leaderboard`, `public.all_time_referral_leaderboard`
- old browser grants gone
- legacy cron gone/absent
- safe projections remain live and browser-selectable:
  - `public.referral_leaderboard_monthly_public`
  - `public.referral_leaderboard_all_time_public`
- API postflight: old anon routes return 404; safe anon routes return 200
- dependency postflight: no remaining public referral leaderboard dependency on `auth.users`
- Supabase Advisor postflight did not show referral leaderboard `auth_users_exposed`

Do not reopen this Critical unless new production evidence shows the referral leaderboard again exposes `auth.users`.

## MR !85 entitlement/user-rank Phase A

MR !85 is merged but not production-applied.

Keep MR !85 in the A-side monetization/auth release-gate backlog until production application and verification are recorded. Do not claim production closure from merge status alone.

## C7 corrected residuals

### SECURITY DEFINER functions without caller-check

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

### SECURITY DEFINER views without `security_invoker`

Corrected residual count: 1.

Residual view:

- `v_user_pronunciation_stats`

False positive / already hardened:

- `vip3_public_profiles`, hardened on 2025-12-07

Previous count was 2. Use the corrected residual count of 1 going forward.

### Draft SQL status

`docs/rls-fix-drafts/` contains drafts only.

Do not treat files in `docs/rls-fix-drafts/` as migrations to apply. Review each draft when ready to ship.

## Priority order

Keep the A-side security priority order:

1. `public.subscriptions` ACTIVE CRITICAL
2. C7 residuals in corrected risk order
3. remaining `security_definer_view` backlog
4. other monetization/auth release-gate items

## A-side observations / release gates

| Gate | State | Evidence / source | Next action |
|---|---|---|---|
| `public.subscriptions` RLS | ACTIVE CRITICAL / NOT CLOSED | MR !86 merged; production apply failed before intended SQL execution; A2 postflight failed; expected policies missing; authenticated self-read simulation failed. | Apply and verify the additive Phase 1 fix in production through normal reviewed deployment discipline. |
| Referral leaderboard `auth_users_exposed` | CLOSED | MR !32 plus approved Phase 2 destructive SQL; postflight showed safe projections live and no remaining public dependency on `auth.users`. | No action unless new evidence reopens it. |
| MR !85 entitlement/user-rank Phase A | merged, not production-applied | Merge recorded; production application and verification not recorded. | Keep open until production application and verification are documented. |
| Profiles POST RLS acceptance/observation | open observation | Local tests include profile RLS contract coverage; production acceptance not recorded in this tracker. | Chau or assigned DB owner records acceptance, rejection, or required MR. |
| Android Studio release checks | still part of release gate | `docs/migration/release-freeze-note.md`; A4 verification found missing local Gradle project files, no device attached, AAB version mismatch, and packaged Capacitor `appId` mismatch. | Chau reruns Android Studio checklist or explicitly removes Android from this release gate. |
| Play Console acceptance readiness | unknown | No Play Console access/status recorded here. | Chau records package acceptance plus version acceptance or exact rejection. |
| Native Sentry probe | scoped/deferred | Owner scope exists; deferred behind Supabase Critical work. | Resume after confirmed Supabase Critical lane is cleared or Chau explicitly reprioritizes. |

## MR / merge rules

- A-side monetization/auth MRs are merged by Chau separately from C-side Stage 3A/3B MRs.
- Do not bundle Supabase Criticals together. One confirmed Critical equals one MR and one verification record.
- Do not include Kids/C-side changes in A-side monetization/auth MRs.
- Do not use a documentation-only MR to claim a Supabase Critical is fixed. The fixing MR must include the actual SQL/config/policy change and evidence.
- This tracker is documentation only and does not apply SQL.

## Stale contradictions corrected here

- `public.subscriptions` remains ACTIVE CRITICAL / NOT CLOSED even though MR !86 merged.
- MR !86 production apply failed before intended SQL execution.
- A2 postflight failed.
- `subscriptions_self_select` and `subscriptions_admin_select` are missing.
- `subscriptions_admin_read` is unexpected/legacy.
- authenticated self-read failed in simulation.
- referral leaderboard `auth_users_exposed` is CLOSED.
- MR !85 is merged but not production-applied.
- C7 SECURITY DEFINER function residual count is 3, not 6.
- C7 SECURITY DEFINER view residual count is 1, not 2.
- destructive production SQL still requires Chau's exact approval phrase.
