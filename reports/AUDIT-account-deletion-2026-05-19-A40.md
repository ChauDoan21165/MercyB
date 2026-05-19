# Account Deletion — Re-audit (A40)

**Date:** 2026-05-19
**Auditor:** A40 (audit-only — no code changes)
**Base:** `origin/main` @ `4fbc3a41f`
**Predecessor:** `reports/account-deletion-audit-2026-04-26.md` (A6)
**Trigger:** PRINCIPLES #9 (status docs drift) + verify A17 entitlements table is covered before it ships to prod.

---

## TL;DR

The deletion flow is **still real, still end-to-end, and is now *more* hardened** than the 2026-04-26 audit described (a new aal=2 / TOTP gate, issue #233, was added). Most prior assertions are still true in substance; their **line numbers have all drifted** (expected — exactly the PRINCIPLES #9 case).

**Two material findings — both HIGH:**

- **B1 — A17 `entitlements` table is NOT in the deletion manifest.** Branch `feat/entitlements-table-migration` (= A17) creates `public.entitlements` and does **not** touch `user-data-manifest.ts`. Runtime data is still erased (FK `ON DELETE CASCADE` from `profiles`), so this is *not* a GDPR/PDPD data-leak — but it violates the manifest's own stated invariant and must be listed explicitly before the table goes to prod.
- **B2 — the "CI guard" the prior audit relied on does not run anywhere.** `scripts/check-delete-account-coverage.mjs` is wired into **nothing**: not `package.json`, not the prebuild hook, not any `.github/workflows/*`, not a vitest test. The 2026-04-26 verdict of "unusually strong coverage … A CI guard prevents new tables from silently bypassing the manifest" is **now-false**. Nothing will catch B1 — or any future user-id table — automatically.

Privacy compliance (incl. Vietnam PDPD): **the flow itself is compliant** (immediate hard-delete, no soft-delete tombstone; legal-retention rows anonymized; now disclosed in Vietnamese). No privacy blocker.

---

## 1. Prior-assertion status table

| # | 2026-04-26 assertion | Status | Note |
|---|---|---|---|
| 1 | `AccountPage.tsx:715-726` — visible "Delete my account / Xóa tài khoản của tôi" button | **partial** | Still present; now at **`:848`** (BiLabel). Line drift only. |
| 2 | `AppRouter.tsx:653` — `/account` route | **partial** | Still present; now at **`:1167-1171`**. |
| 3 | Route gated by `<RequireAuth>` (`AppRouter.tsx:655`) | **still-true (strengthened)** | Now `<RequireAuth>` **+ `<RequireAal2>`** at `:1169-1170`. |
| 4 | `AccountPage.tsx:828-902` — bilingual confirm modal, type `DELETE` | **partial** | Still present + correct; now ~**`:948-1021`**. |
| 5 | `AccountPage.tsx:276-300` — `handleDeleteAccount`: JWT → invoke `delete-account` w/ Bearer → `signOut()` → `nav("/")` | **partial (strengthened)** | Now **`:213-268`**. Same shape; uses `supabase.functions.invoke` (auto-Bearer), `nav("/", {replace:true})`, and now handles `aal2_required` / `aal_check_unavailable`. |
| 6 | `Account.tsx` is a 7-line legacy re-export shim | **still-true** | Exactly 7 lines, re-exports `AccountPage`. |
| 7 | `delete-account/index.ts` Deno fn, Apple/GDPR docstring lines 2-15 | **still-true** | Docstring still at lines 2-15 verbatim-equivalent. |
| 8 | 4-pass flow at `:85-97 / :105-123 / :126-136 / :139-148` | **partial (strengthened)** | 4 passes intact; now `:123-135 / :143-161 / :163-174 / :176-186`. A new **aal=2 gate (`:83-115`, issue #233)** is inserted *before* Pass 1. |
| 9 | Per-table errors recorded in `report.errors`, do not halt passes | **still-true** | Unchanged (`:125-134`, `:151-160`). |
| 10 | Manifest = "133 classifications", 4 actions (`delete/anonymize/skip_view/skip_admin`) | **now-false (count) / still-true (shape)** | Now **154 entries**: 72 delete, 32 anonymize, 49 skip_view, 1 skip_admin. All 4 actions still present. Entry≠distinct-table (3 tables appear twice for 2 columns). |
| 11 | "~73 tables marked delete" | **still-true** | 72 delete entries — within rounding. |
| 12 | `check-delete-account-coverage.mjs` is a CI script that **fails the build** | **NOW-FALSE → see B2** | Logic exists (exit 1 on missing) but is invoked by **no** CI/build/test. Manual-run only. |
| 13 | `src/lib/security/rightToBeForgotten.ts` (157 ln, zero callers) — dead code | **resolved (stale)** | File **deleted** from main. Report's cleanup PR + "Question #2" now MOOT. |
| 14 | `Terms.tsx:71-76` — "Account Deletion" section names the path | **still-true** | Now `Terms.tsx:78-81`; wording still accurate. |
| 15 | `Privacy.tsx:77-82` — generic "Your Rights" boilerplate, does NOT name path / immediacy | **now-false (improved)** | Now `Privacy.tsx:310-329`: explicitly names "Account → Delete my account", states "Deletion is immediate and permanent", discloses anonymize-for-legal exception, **with full Vietnamese translation**. Report's recommendation #1 + "Question #1" now MOOT. |

**Tally:** 15 prior assertions → **6 still-true**, **6 partial (substance true, locations drifted)**, **2 now-false** (#10 count, #12 CI guard), **1 resolved/stale** (#13 dead code already deleted). Plus #15 is "now-false" in the favorable direction (already improved).

---

## 2. Blocker findings

### B1 — A17 `entitlements` table missing from the deletion manifest — HIGH

**A17** = branch `origin/feat/entitlements-table-migration`. It adds exactly one migration, `supabase/migrations/20260519230000_create_entitlements_table.sql`, creating:

```sql
create table if not exists public.entitlements (
  user_id  uuid not null references public.profiles(id) on delete cascade,
  app_id   text not null default 'mercy_blade',
  ... status / is_premium / expires_at / computed_at ...
  primary key (user_id, app_id)
);
```

`git diff origin/main origin/feat/entitlements-table-migration` confirms the branch touches **only** the migration + `redeem-gift-code/*` — it does **not** modify `user-data-manifest.ts` or `delete-account/index.ts`. The bare table name `entitlements` is **not** in the current manifest (the manifest has `entitlement_events`, `user_entitlements`, `user_entitlements_raw`, `user_entitlements_raw_20260301_181303` — all `anonymize` — but no `entitlements`).

**Severity nuance — this is a *manifest-completeness* blocker, not a runtime data-leak.** The new table is `references public.profiles(id) on delete cascade`. Deletion Pass 3 (`DELETE FROM profiles WHERE id = userId`) and Pass 4 (`auth.admin.deleteUser` → cascades `auth.users → profiles → entitlements`) will both physically delete the user's `entitlements` row. So GDPR Art.17 / PDPD erasure is satisfied at runtime *by the cascade*. **But** the manifest's own contract — file header: *"Every table … with a user-identifying column MUST appear here exactly once"* — is violated, the manifest is the documented source of truth for audits/reviewers, and the omission is invisible (see B2).

**Remediation (one line, same PR as A17):**

```ts
{ table: "entitlements", action: "delete", column: "user_id",
  reason: "materialized per-user entitlement state; reconstructable from anonymized event tables, not a financial record. FK ON DELETE CASCADE from profiles already wipes it; listed explicitly per the manifest's exactly-once invariant." },
```

`delete` (not `anonymize`) is correct: `entitlements` is current-state derived data, not a tax/audit record (those are the already-anonymized `entitlement_events` / `subscriptions` / `payment_*`).

### B2 — the manifest CI guard is orphaned — HIGH (corrects prior audit)

The 2026-04-26 audit's headline strength — *"A CI guard prevents new tables from silently bypassing the manifest … This is stronger than what most apps ship"* — does not hold on current main:

- `scripts/check-delete-account-coverage.mjs` is **not** in `package.json` (no script, not in `prebuild`).
- **No** `.github/workflows/*` references `delete-account` or the coverage script.
- **No** vitest/spec test exercises the manifest. The only test under `delete-account/__tests__/` is `aal-gate.test.ts` (covers the new #233 logic only).
- It self-skips (`exit 0`) when `SUPABASE_SERVICE_ROLE_KEY` is absent — so even if invoked in a generic CI step it would no-op without secrets.

Net: the script *can* detect an unclassified user-id table (exit 1) but **nothing runs it**. Every user-id table added since 2026-04-26 — and A17's `entitlements` — bypasses the manifest silently. This is what makes B1 a real blocker rather than "CI will catch it."

**Remediation options (pick one):**
1. Add `node scripts/check-delete-account-coverage.mjs` as a dedicated job in `ci.yml` (the canonical PR workflow) with `SUPABASE_SERVICE_ROLE_KEY` + `VITE_SUPABASE_URL` repo secrets. Lowest effort, matches the script's existing design.
2. Convert it to a vitest test that diffs the manifest against a checked-in schema snapshot (no secrets, deterministic, but snapshot must be refreshed on schema change).
3. At minimum, add it to the `prebuild` hook alongside `rooms:check` so production builds fail closed.

---

## 3. Vietnamese PDPD compliance (step 7)

**Verdict: compliant — no blocker.** Decree 13/2023/NĐ-CP gives the data subject a right to erasure (Art. 16) with deletion expected within 72 hours of request unless a legal-retention exemption applies (Art. 16.4).

- The flow performs an **immediate, synchronous hard `DELETE`** of personal-data tables and a real `auth.admin.deleteUser()` — **not** a disabled flag, not a soft-delete tombstone, no grace window. This satisfies "actual deletion, not soft-delete" and is well inside the 72h expectation.
- Financial / security / audit rows are **anonymized** (`user_id → NULL` + `scrub_columns` overlay) and retained — permitted under Art. 16.4 (retention required by tax/legal obligation); severing the personal-data link is the stronger posture.
- This is now **disclosed in Vietnamese** to the user — `Privacy.tsx:322-329`: *"Việc xóa diễn ra ngay lập tức và không thể hoàn tác — hồ sơ tài chính và an ninh…"* — satisfying the Vietnamese-first non-negotiable and PDPD transparency.

**Forward-looking caution (not a current gap):** the predecessor audit's deferred "(b) FULL" option proposes a *30-day undo window (soft-delete tombstone)*. If that is ever built, the soft-delete state must not delay **actual** deletion beyond what PDPD permits without an explicit legal basis. Recording here so a future builder does not regress PDPD by adding a long grace window. The current immediate-delete design is the PDPD-safe one — do not "improve" it into a soft-delete by default.

---

## 4. Net changes since 2026-04-26 (informational)

- **Added (improvement):** aal=2 / TOTP re-challenge gate on the edge function (`aal-gate.ts` + `index.ts:83-115`, issue #233, PR #748) + `RequireAal2` route guard + frontend `aal2_required` handling. Predates the prior audit entirely; no regression. Well-tested (`aal-gate.test.ts`).
- **Removed (cleanup done):** `rightToBeForgotten.ts` dead code — prior audit's Question #2 resolved.
- **Improved (copy):** `Privacy.tsx` §6 rewritten to name the path, state immediacy, disclose the anonymize exception, in EN + VI — prior audit's recommendation #1 / Question #1 resolved.
- **Grew:** manifest 133 → 154 entries (schema growth absorbed manually, *without* the CI guard catching anything — see B2).

---

## 5. Recommended remediation (priority order)

| Pri | Gap | Fix | Owner |
|---|---|---|---|
| **P0** | B2 — CI guard runs nowhere | Wire `check-delete-account-coverage.mjs` into `ci.yml` (or prebuild) with Supabase secrets | Infra (one workflow edit) |
| **P0** | B1 — `entitlements` unclassified | Add the one manifest line above **inside the A17 PR** before it merges/applies to prod | A17 author |
| P2 | Prior audit doc is stale (line nums, CI claim, dead-code, Privacy) | Supersede `account-deletion-audit-2026-04-26.md` with this file (already an operator artifact) | n/a |
| P3 | Manifest entry-count assertions will keep drifting | Once B2 lands, the guard self-documents; no manual count needed | n/a |

Sequencing: **B2 should land first** — once the guard actually runs, B1 becomes self-enforcing (the A17 PR will go red until the manifest line is added), which is the correct end-state.

---

╔══════════════════════════════════════════════════════════╗
║  📋 Chau Report from A40 — Account-deletion re-audit      ║
╚══════════════════════════════════════════════════════════╝
- Doc: `reports/AUDIT-account-deletion-2026-05-19-A40.md`
- Prior assertions: **6 still-true · 6 partial (line-drift only) · 2 now-false · 1 resolved**
- Blockers: **2 HIGH** — B1: A17 `entitlements` table not in deletion manifest (data still cascades, but manifest invariant broken); B2: the manifest CI guard is wired into nothing → prior audit's "strong CI coverage" verdict is now-false, nothing catches B1
- PDPD: **compliant** (immediate hard-delete, no soft-delete; legal rows anonymized; now disclosed in VI) — no privacy blocker
- Recommend: wire the guard into CI first (P0), then it self-enforces the A17 manifest line
