# A-side Monetization + Auth Release Gate Tracker

Last updated: 2026-05-27

Scope: A-side release/security lane only. This tracker covers monetization,
auth, Supabase security criticals, and Android release checks that can block
the A-side release gate. It does not govern Kids/C-side work.

## Gate state

**A-side monetization/auth release gate is blocked.** The referral leaderboard
`auth_users_exposed` Critical is closed, but the gate remains red until Profiles
POST RLS is accepted or explicitly waived by Chau, Android Studio checks are
either passed or removed from the release gate, and documented
monetization/auth follow-ups are resolved or reclassified.

**C-side Stage 3A/3B progress is separate and is not blocked by the A-side
security lane.** Stage 3A/3B may continue under its own tracker and acceptance
criteria. Chau merges A-side MRs separately from C-side MRs.

**Each Supabase Critical must be one MR.** Do not combine multiple Supabase
Criticals in a single MR, even if the fixes are small or adjacent.

## Supabase Criticals / Advisor Findings

| Critical | Status | MR rule | Gate effect | Next action |
|---|---|---|---|---|
| `Mercy Blade Real auth_users_exposed referral leaderboard` | CLOSED | Completed as MR !32 plus Phase 2 destructive SQL after explicit Chau approval | No longer blocks on this Critical | Phase 2 destructive SQL completed successfully. Old legacy matviews dropped: `public.monthly_referral_leaderboard`, `public.all_time_referral_leaderboard`. Old browser grants gone. Legacy cron gone/absent. Safe projections remain live and browser-selectable: `public.referral_leaderboard_monthly_public`, `public.referral_leaderboard_all_time_public`. API postflight: old anon routes return 404; safe anon routes return 200. Dependency postflight: no remaining public referral leaderboard dependency on `auth.users`. Supabase Advisor postflight did not show referral leaderboard `auth_users_exposed`. |
| `security_definer_view` | active Advisor backlog | Separate follow-up lane from referral leaderboard | Backlog gate item; do not combine with referral leaderboard MR | Scope and remediate independently in a separate follow-up lane. |
| `authenticated_security_definer_function_executable` | active Advisor backlog | Separate follow-up lane | Backlog gate item; unrelated to referral leaderboard closure | Scope and remediate independently. |
| `auth_leaked_password_protection` | active Advisor backlog | Separate follow-up lane | Backlog gate item; unrelated to referral leaderboard closure | Scope and remediate independently. |
| `mercy-ai rls_disabled_in_public` | not confirmed current critical | No MR until exact current finding is reproduced | Blocked pending evidence if still claimed | Live Advisor returns none; require exact current screenshot/project before treating as active. |
| `mercy-ai sensitive_columns_exposed` | not confirmed current critical | No MR until exact current finding is reproduced | Hardening backlog, not confirmed current Critical | Live Advisor returns none; risky admin/billing surfaces remain hardening backlog. |

## A-side Observations / Acceptance Gates

| Gate | State | Evidence / source | Next action |
|---|---|---|---|
| Profiles POST RLS acceptance/observation | open observation | Local tests include profile RLS contract coverage; production acceptance not recorded in this tracker. | Chau or assigned DB owner records acceptance, rejection, or required MR. |
| Android Studio release checks | still part of release gate | `docs/migration/release-freeze-note.md`; A4 verification found missing local Gradle project files, no device attached, AAB version mismatch, and packaged Capacitor `appId` mismatch. | Chau reruns Android Studio checklist or explicitly removes Android from this release gate. |
| Play Console acceptance readiness | unknown | No Play Console access/status recorded here. | Chau records package acceptance plus version acceptance or exact rejection. |
| Native Sentry probe | scoped/deferred | Owner scope exists; deferred behind Supabase Critical work. | Resume after the confirmed Supabase Critical lane is cleared or Chau explicitly reprioritizes. |
| A-side DB reads/new-object creation | unblocked | Service key located in `.env.validation`. | Reads and new-object creation may proceed in the A-side lane. Destructive DB operations still require explicit Chau per-operation approval. |

## Already Documented Monetization/Auth Gate Items

| Item | Current state from repo docs | Gate effect | Source |
|---|---|---|---|
| Monetization Step 9 / entitlement Phase A | Phase A merged: entitlement gates, `_shared/entitlement.ts`, honest gift errors, invoice `period_end`. | Not blocking by itself; keep as baseline. | `STRATEGY.md` §6/§7 |
| Monetization Phase B | In flight: entitlements table, T2 retirement, monotonic payload, currency unit fix. | Blocks if any item is required for the current A-side money-path release. | `STRATEGY.md` §7 |
| A18 recompute entitlement implementation | `WAIT-FOR-X`: #789 merged and A17 entitlements migration/RPC applied; PR-B not a hard A18 blocker. | Blocks recompute writer dispatch until prerequisites are green. | `reports/A18-recompute-impl-readiness-A8c.md` |
| Gift-code silent-failure customer remediation | Forward fix merged; historical victim apply package and outreach ops documented. | Blocks customer-remediation closure until Chau applies/records outcome. | `STRATEGY.md` §6; `reports/CUSTOMER-gift-victim-apply-package.md`; `reports/CUSTOMER-gift-outreach-ops-A3b.md` |
| Native marketing tracker verification | Device verification checklist exists for iOS/Android native tracker silence and privacy-paperwork redo. | Blocks native submission/privacy readiness until Chau captures device evidence. | `reports/NATIVE-tracker-verify-checklist-A6b.md` |
| Delete-account/auth privacy pipeline | Delete-account pipeline and pending privacy gaps documented; direct `auth.users` deletion is part of the final pass. | Blocks privacy/auth release claims until pending merges/apply steps are closed or waived. | `reports/PRIVACY-delete-account-pipeline-A4g.md` |
| 2FA security review | Phase 2 security review exists. | Gate state depends on Chau/owner acceptance of the review. | `reports/2fa-phase-2-security-review.md` |

## MR / Merge Rules

- A-side monetization/auth MRs are merged by Chau separately from C-side Stage
  3A/3B MRs.
- Do not bundle Supabase Criticals together. One confirmed Critical equals one
  MR and one verification record.
- Do not include Kids/C-side changes in A-side monetization/auth MRs.
- Do not use a documentation-only MR to claim a Supabase Critical is fixed.
  The fixing MR must include the actual SQL/config/policy change and evidence.

## Android Gate Snapshot

Current A4 verification result: Android Studio blocker is not cleared.

- Clean Gradle sync/build: unknown from local checkout because `android/gradlew`,
  `android/settings.gradle*`, and `android/app/build.gradle*` were absent.
- Merged AAB manifest package: observed `com.mercyapps.mercyblade`.
- Release AAB version: observed `versionCode 22` and `versionName 1.0.7`,
  which does not match the requested `versionCode 16` and `versionName 1.0.6`.
- Packaged Capacitor config: observed `appId: com.chaudoan.mercyblade`, which
  conflicts with the expected Android application ID.
- Device launcher/OAuth smoke: unknown because no device/emulator was attached.
- Play Console acceptance: unknown.

## Stale Contradictions Corrected Here

- Android release checks remain part of the release gate until Chau says
  otherwise; they are not cleared by the presence of `app-release.aab`.
- C-side Stage 3A/3B progress is not gated by the A-side security lane.
- `mercy-ai rls_disabled_in_public` and `mercy-ai sensitive_columns_exposed`
  are not confirmed current Criticals from live Advisor output; do not track
  them as active without exact screenshot/project evidence.
- Referral leaderboard `auth_users_exposed` is CLOSED. Phase 2 destructive SQL
  completed successfully after explicit Chau approval.
- Old legacy matviews dropped: `public.monthly_referral_leaderboard` and
  `public.all_time_referral_leaderboard`.
- Old browser grants are gone; legacy cron is gone/absent.
- Safe projections remain live and browser-selectable:
  `public.referral_leaderboard_monthly_public` and
  `public.referral_leaderboard_all_time_public`.
- API postflight: old anon routes return 404; safe anon routes return 200.
- Dependency postflight: no remaining public referral leaderboard dependency on
  `auth.users`.
- Supabase Advisor postflight did not show referral leaderboard
  `auth_users_exposed`.
- Remaining Advisor backlog is unrelated: `security_definer_view`,
  `authenticated_security_definer_function_executable`, and
  `auth_leaked_password_protection`.
- Service key is located in `.env.validation`; A-side DB reads and new-object
  creation are unblocked.
- Destructive DB operations require explicit Chau per-operation approval.
- A-side Supabase Criticals are not a batch MR; each confirmed Critical must
  be remediated and verified independently.
