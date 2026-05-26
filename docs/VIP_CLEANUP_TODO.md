# VIP → Level Naming Cleanup (Deferred)

This file tracks the remaining `"vip"` references in the codebase from the legacy
tier naming. The canonical tier model today is numeric: `profiles.tier = 0..N`
(level 0 = free, higher = paid). Any runtime code still branching on the literal
string `"vip"` / `"all_vip"` / `"VIP"` is legacy and should be replaced.

**This is a deferred refactor.** Do not fix these opportunistically — batch them
into a dedicated cleanup PR so the diff is reviewable.

## Why it's safe to defer

The current app works end-to-end because none of the paths below are on the
critical user journey: **a Vietnamese learner opens the app, opens a room, does
a lesson.** That journey never touches email-campaign audience routing, tier
upgrade ceremonies, admin health dashboards, or the legacy auto-generated
`app_role` enum. The `"vip"` references are either:

- dead branches in email/admin tooling (silently wrong, but not user-facing on
  the learning path),
- cosmetic labels that default to `"VIP"` in edge cases,
- auto-generated types mirroring a stale DB enum.

None of them break a lesson. Fix when the email / admin surfaces get their next
real round of work.

## Scope note

Room filenames with legacy `vipN_` prefixes in `public/data/*.json` and keyword
strings containing `vipN` are **out of scope** per `CLAUDE.md` — they are
historical filename patterns, not tier values. One-off `scripts/validate-vip*`,
`scripts/import-*-vip9.ts`, `scripts/fix-vip*` utilities are also out of scope;
they're not runtime code.

---

## 🔴 HIGH — silently wrong behavior when the path is exercised

### 1. Email campaign audience: legacy `"vip"` branch

- **File:** `supabase/functions/send-email-campaign/index.ts:75`
- **What's wrong:** `if (campaign.audience_type === "vip") { … }` — branches on the
  legacy string. If campaigns are inserted with the current naming, this branch
  never fires and the campaign resolves to 0 recipients.
- **Proposed fix:** Replace `"vip"` with the new audience enum (e.g. `"paid"` or
  a level-based predicate `tier >= 1`), aligned with `email-broadcast`.
- **Blast radius if unfixed:** A VIP-style broadcast silently sends to nobody.
  No error, no bounce — just zero emails delivered.

### 2. Email broadcast audience enum mixes legacy + new

- **File:** `supabase/functions/email-broadcast/index.ts:40, 114`
- **What's wrong:** Type literal `audience_type: "level2" | "level3" | "all_vip" | "manual"`
  and `else if (audience_type === "all_vip") { … }`. Mixed legacy/new — already
  flagged in `CLAUDE.md` as broken.
- **Proposed fix:** Replace `"all_vip"` with `"all_paid"` (or `tier >= 1`
  predicate) and reconcile with `send-email-campaign` so both functions share
  one enum.
- **Blast radius if unfixed:** "All paid users" broadcasts target the wrong
  cohort or none at all. The two campaign functions disagree, so whichever one
  gets invoked determines correctness.

### 3. Mercy host tier-upgrade encouragement never fires

- **File:** `src/lib/mercy-host/engine.ts:667`
- **What's wrong:** `else if (newTier.startsWith('vip') && !state.silenceMode) { … }`
  gates the generic upgrade encouragement. If current tier strings are
  `"level3"` etc., the condition is false and the encouragement is skipped.
- **Proposed fix:** Swap `startsWith('vip')` for the current tier predicate
  (e.g. `startsWith('level')` or `numericTier(newTier) >= 1`).
- **Blast radius if unfixed:** Users who upgrade don't see the "welcome to
  level N" encouragement unless a specific ceremony handler fires first. Soft
  UX regression, not a crash.

### 4. Room header tier badge parses legacy prefix

- **File:** `src/components/RoomHeaderStandard.tsx:49, 57, 58`
- **What's wrong:** Tier label normalized via `.replace('vip', 'vip')` (no-op)
  and then parsed with `startsWith("vip")` + `.replace("vip", "").trim()`. If
  `room.tier === "level3"`, the `startsWith` check fails and the badge
  fallback path runs.
- **Proposed fix:** Rewrite the tier-label parser to handle `"levelN"` (and
  ideally drop the legacy branch entirely once room JSON is normalized).
- **Blast radius if unfixed:** Room header shows a fallback or wrong badge
  label for modern-tier rooms. Visual-only; doesn't block the lesson.

### 5. Audit / health jobs undercount rooms by legacy prefix

- **Files:**
  - `supabase/functions/audit-db-health/index.ts:142, 320`
  - `supabase/functions/room-health-summary/index.ts:824`
- **What's wrong:** Group/filter rooms by `tier.includes("vip")` /
  `tier.startsWith("vip")`. Modern-tier rooms are excluded from counts.
- **Proposed fix:** Replace substring checks with the canonical tier predicate
  (numeric parse of `level` / `vip` suffix, or a shared helper).
- **Blast radius if unfixed:** Health metrics and audit reports report
  incorrect tier distributions. Observability lies; no user impact.

---

## 🟡 MEDIUM — user-visible text or admin dashboards miscount

### 6. Admin sync / link health filters hide modern-tier rooms

- **Files:**
  - `src/components/admin/SyncHealthSummary.tsx:147` — `normalizedTier.startsWith("vip")`
  - `src/components/admin/RoomLinkHealth.tsx:128` — `room.tier.toLowerCase().includes('vip')`
- **What's wrong:** Admin panels filter in/out by legacy substring. Modern-tier
  rooms don't appear in the relevant groupings.
- **Proposed fix:** Use the canonical tier predicate (numeric or `startsWith('level')`).
- **Blast radius if unfixed:** Admin dashboards silently misreport coverage.
  Chau-facing only.

### 7. Navigation tab literally labeled "VIP"

- **File:** `src/app/navigation/TabsNavigator.tsx:90, 107, 110`
- **What's wrong:** `navigation.navigate('VIP', …)`, `name="VIP"`,
  `tabBarLabel: 'VIP'`. User-visible label contradicts the no-VIP brand.
- **Proposed fix:** Rename route + label to the current tier term (e.g.
  `"Levels"` / `"Pro"`). Update every `navigate('VIP', …)` call site.
- **Blast radius if unfixed:** Users see a "VIP" tab in the app, which
  undermines the positioning. Requires cross-file rename.

### 8. Locked banner defaults to "VIP"

- **File:** `src/components/room/LockedBanner.tsx:31`
- **What's wrong:** `const tierLabel = roomTier?.toUpperCase() || "VIP"`.
  When `roomTier` is missing, the banner reads "VIP LOCKED".
- **Proposed fix:** Replace fallback with `"LOCKED"` or the current default
  tier name.
- **Blast radius if unfixed:** Edge-case rooms (missing tier field) show
  "VIP LOCKED" to users.

### 9. Email templates default tier name to "VIP"

- **Files:**
  - `supabase/functions/_shared/emailTemplates.ts:149`
  - `supabase/functions/email-automations/index.ts:207, 331`
- **What's wrong:** Default `"VIP"` string when `tierMap` / `allTierMap`
  lookup fails (`pick(variables, "tier", "VIP")`,
  `tierMap.get(sub.tier_id) || "VIP"`).
- **Proposed fix:** Replace fallback with a generic label (e.g. `"your level"`
  in Vietnamese, or the numeric tier).
- **Blast radius if unfixed:** Transactional emails can go out saying "VIP"
  when tier lookup fails — user-facing copy regression.

### 10. Auto-generated `app_role` enum still includes `'vip'` — **WON'T FIX (accepted debt)**

- **Files:**
  - `src/integrations/supabase/types.ts:10042, 10206`
  - `supabase/functions/_shared/database.types.ts:10042, 10206`
- **What's wrong:** `app_role: "admin" | "user" | "vip"` — mirrors a DB enum
  that still has `'vip'`. Types are auto-generated, so the source of truth is
  the DB.
- **Status (2026-04-21):** Prod DB confirmed has the `'vip'` enum value but
  **zero `user_roles` rows reference it**. No application code assigns or
  compares against `'vip'`.
- **Why we're not fixing:** Postgres does not support dropping an enum value.
  Removing `'vip'` requires rebuilding the entire `app_role` type, which
  cascades through the `user_roles.role` column, the `has_role()` function,
  and every RLS policy that casts `'admin'::app_role` (dozens of policies
  across many tables). The blast radius of a failed rebuild is app-wide auth
  breakage. The benefit is cosmetic — one stale literal in two auto-generated
  type files. Not worth the risk.
- **Guard:** Any future writer of `app_role = 'vip'` would still compile. This
  TODO entry is the guard. If the footgun is ever tripped, the clean fix is
  to rebuild the enum with a proper backup + staging rehearsal, not to
  opportunistically "just drop it".

---

## 🟢 LOW — cosmetic or dead wiring

### 11. Host API destructures unused `vip_rank`

- **File:** `src/app/api/host/route.ts:80, 98`
- **What's wrong:** `const { systemPrompt, plan, vip_rank } = …` then
  `vipRank: Number(vip_rank ?? 0)`. Likely dead wiring if the host response
  no longer includes `vip_rank`.
- **Proposed fix:** Remove `vip_rank` destructuring and `vipRank` field if
  downstream consumers don't read it; otherwise rename to the current field.
- **Blast radius if unfixed:** None — defaults to `0` silently.

### 12. Design-token audit hook queries for `vip` classes

- **File:** `src/hooks/useDesignTokenAudit.ts:69`
- **What's wrong:** `document.querySelectorAll('[class*="vip"], [data-tier*="vip"]')`
  — audits for `vip`-named classes/attrs.
- **Proposed fix:** Update the selector to match the current tier class/attr
  naming, or drop the check if no such classes exist anymore.
- **Blast radius if unfixed:** Audit returns empty; no runtime effect.

### 13. Test asserts legacy `vip_upgrade` log field

- **File:** `src/__tests__/mercy-logs-and-teacher.test.ts:41`
- **What's wrong:** `expect(summary.vip_upgrade).toBe(0)` — asserts the log
  summary field is still named `vip_upgrade`.
- **Proposed fix:** Rename both the log field and the test when tier-upgrade
  logs are modernized.
- **Blast radius if unfixed:** Test still passes (field exists); breaks only
  when the field is renamed.

### 14. `vipCeremonies` module name (not content)

- **Files:** `src/lib/mercy-host/vipCeremonies.ts`, `src/__tests__/mercy-rituals.test.ts`
- **What's wrong:** Module exports (`getVipCeremony`, `executeVipCeremony`)
  and filename still say "vip". Tests already pass `"level1"` / `"level9"` as
  inputs, so the functions work — only the naming is stale.
- **Proposed fix:** Rename module + exports to `tierCeremonies` /
  `getTierCeremony` / `executeTierCeremony` and update every import site.
- **Blast radius if unfixed:** None — runtime is correct. Pure naming debt.

---

## Related context

- `CLAUDE.md` § "The five non-negotiables" #5 — "No VIP tier" rule.
- `CLAUDE.md` § "Email system" — already flags items #1 and #2 as the known
  disagreement between `send-email-campaign` and `email-broadcast`.
- `STRATEGY.md` — authoritative brand / tier positioning.
