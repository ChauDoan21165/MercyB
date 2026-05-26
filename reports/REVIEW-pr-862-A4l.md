# Review — PR #862 (manifest flip: 4 audit tables delete → anonymize)

**Reviewer:** A4 (self-review of a PR I authored as A4j — applying a deliberately clean eye)
**Branch:** `review/862-manifest-flip` (off `origin/main` @ `cc4f03a02`)
**Subject:** [PR #862](https://github.com/ChauDoan21165/MercyB/pull/862) — `fix/audit-tables-manifest-anonymize` — `fix(privacy): flip 4 audit tables delete→anonymize after #837 migration (A4j)`
**Subject head:** `418fd7c8d` (single commit on the branch)
**Date:** 2026-05-19

---

## TL;DR — VERDICT: ✅ APPROVE (code-merits), ⚠️ FLAG on draft state

Code change is exactly what the brief specified — 4 tables flipped, comment block rewritten, A6d / A4j decision record cited, tests still pass. **However, the PR is no longer in GitHub draft state** (Chau marked it ready_for_review at 2026-05-19T22:49:28Z, per the issue timeline). The in-body hard-gate text "DO NOT MERGE until #837 applied" is now the only safety mechanism. Surfacing for awareness — Chau may have intended this (e.g., #837 already applied) or it may want to be re-drafted.

---

## CI status snapshot

| Field | Value |
|---|---|
| `isDraft` (via `gh pr view`) | `false` |
| `state` | `OPEN` |
| `mergeable` | `true` |
| `mergeable_state` | `unstable` (CI in progress per GitHub semantics) |
| Last ready_for_review event | `actor=ChauDoan21165, at=2026-05-19T22:49:28Z` |

I deliberately did NOT investigate whether #837 is now merged + applied in prod — that's an out-of-scope state check. The review focuses on whether #862's code change is correct AND whether the gate apparatus is structurally sound.

---

## 1. Diff scope (brief check 2)

✅ **Exactly one file changed**: `supabase/functions/delete-account/user-data-manifest.ts` (+10 / −8, 1 file).

No other files touched (no test changes, no migrations, no edge function logic, no manifest entries outside the SCHEMA-BLOCKED → anonymize block).

---

## 2. The 4 flipped tables (brief check 2)

✅ **Exactly 4 entries changed, all in the previously-SCHEMA-BLOCKED block:**

Block-scoped extraction via regex over the new "Audit / deliverability / fraud-detection → ANONYMIZE" section:

```
  email_sends_log     → anonymize
  push_send_log       → anonymize
  referral_audit_log  → anonymize
  speech_analysis_logs → anonymize
```

Confirmed match with the brief's named list — no extras, none missed.

---

## 3. Action change verification (brief check 3)

✅ **All 4 entries have `action: "anonymize"`** in the new state.

In the prior state on main (commit `418fd7c8d`'s parent `dafa9b540`), the same 4 entries had `action: "delete"` — `git diff` confirms the action-field swap for each row.

Other fields per entry:
- `column: "user_id"` — unchanged (same column targeted)
- `reason` — rewritten for each, citing A6d retention rationale + "post-#837 migration" + the A4j decision record

No `scrub_columns` added on any of the 4 — correct per the brief's rationale that these tables have no PII columns to scrub beyond `user_id` (the actual PII surface is the row's existence + the linkage; anonymize-by-null-user_id is the entire scrub).

---

## 4. SCHEMA-BLOCKED comment removal + replacement (brief check 4)

✅ **The 4-line SCHEMA-BLOCKED header block is removed** and replaced with a 6-line "Audit / deliverability / fraud-detection → ANONYMIZE" header that:

- Cites #837 explicitly: "unblocked by #837 nullable migration"
- States the new FK behavior: "FK softened CASCADE → SET NULL"
- Explains the runtime outcome: "Each row survives account deletion with user_id NULL — the audit / cost / anti-abuse signal is retained, the linkage to the deleted user is gone"
- **Carries an inline DO-NOT-MERGE note**: "DO NOT MERGE THIS PR until #837 is applied in prod — until then these UPDATEs runtime-error on NOT NULL"

The new header is more informative than the old one and points to the right next-step recourse (which is exactly what a future agent debugging an error log should find here). ✅

The per-entry `reason` fields also reference "A6d / A4j decision record" — meaning the policy chain (A6d classification → A4 #811 schema-blocked → A4e #837 migration → A4j flip) is traceable in-file without leaving the manifest.

---

## 5. Tests still pass (brief check 5)

✅ **21/21 pass** with the PR branch's manifest applied:

```
✓ index-wiring.test.ts          (5 tests)   — #771 aal=2 gate wiring lock
✓ aal-gate.test.ts              (10 tests)  — pure aal=2 decision logic
✓ user-data-manifest.test.ts    (6 tests)   — #811 manifest regression lock
```

`npm run typecheck:ci` also clean.

The `user-data-manifest.test.ts` coverage assertion targets table NAMES via the `REQUIRED_B1_TABLES` constant — not actions. So the action flip doesn't disturb it. Confirms my A4j claim that the flip is regression-test-safe.

---

## 6. Hard-gate note (brief check 6)

✅ **In-body hard-gate text intact** (verified via `gh pr view 862 --json body`):

> **⚠️ HARD GATE — DO NOT MERGE until #837 is applied to prod via SQL Editor**
> 
> **Hard gate:** [#837 prod-apply.] Until #837's migration runs in prod (Chau-applied via SQL Editor — see #837's own apply protocol), `user_id` is still `NOT NULL` on these 4 tables, and the `anonymize` UPDATE this PR enables will runtime-error on every account deletion (the row rolls back atomically against the NOT NULL constraint). Per-row error gets appended to `report.errors[]` and Pass 4's `auth.users` CASCADE then deletes the row anyway — net effect = same as `delete` with error noise + zero audit retention achieved.

Plus a **sequencing checklist** in the body with 5 steps numbered.

The in-body language is unambiguous and explains the failure mode in technical detail. A merger who reads it would understand exactly what breaks if they merge prematurely. ✅

---

## 7. ⚠️ Observation — PR is no longer in draft state (NOT in brief, surfacing anyway)

The brief described #862 as "draft, gated on #837 SQL apply." Live state contradicts that:

```
isDraft: false
state: OPEN
mergeable: true
mergeable_state: unstable
```

Timeline event log shows: `ready_for_review | actor=ChauDoan21165 | at=2026-05-19T22:49:28Z`

This is a **deliberate Chau action**, not a regression or my A4j oversight. I verified #862 was `isDraft: true` at creation time in my A4j report. Sometime after, Chau clicked "Ready for review" on the GitHub UI.

**Implications:**
- The GitHub-level merge block (draft state) is no longer active
- The PR body's "DO NOT MERGE until #837 applied" text is now the only gate
- If a CI-gate or branch-protection rule requires reviews/approvals, those still apply
- The PR is technically merge-eligible from GitHub's perspective (`mergeable: true`)

**Possible reasons Chau un-drafted (speculation, not findings):**
1. #837 was already applied and the gate is now satisfied
2. Wants the PR to show as merge-ready for the review queue
3. Accidental click

**Recommendation:** Confirm with Chau whether the un-draft was intentional + whether #837 has been applied. If #837 is applied, the in-body gate is no longer load-bearing and the PR can move to merge. If #837 is NOT applied yet, consider re-drafting via `gh pr ready 862 --undo` to restore the structural block until step 3 of the sequencing checklist completes.

This is **NOT a defect in the PR content** — the code change is correct. It's a state observation worth surfacing.

---

## 8. VERDICT — ✅ APPROVE (with the §7 flag)

All 6 brief-mandated checks pass:

| Brief check | Status |
|---|---|
| `gh pr diff 862` reviewed | ✅ |
| Exactly 4 tables flipped | ✅ verified empirically |
| Action `delete` → `anonymize` for each | ✅ verified |
| SCHEMA-BLOCKED comment removed + replaced with A6d citation | ✅ verified |
| Test still passes (coverage by table name, not action) | ✅ 21/21 pass |
| Hard gate note "DO NOT MERGE until #837 applied" present in body | ✅ verified |

Plus one non-brief observation:
- ⚠️ PR un-drafted by Chau at 22:49:28Z — surfacing so Chau knows it's now in-body-gate-only

**Self-review honesty note:** I authored this PR as A4j. Two findings I deliberately checked against my own work:
1. **Is the per-row `reason` overstating the post-#837 state?** No — each reason hedges with "post-#837 migration" so a reader knows the state is conditional. ✅
2. **Did I miss any of A6d's flagged tables?** A6d identified exactly these 4 as schema-blocked. The PR flips exactly these 4. ✅

---

## References

- [PR #862](https://github.com/ChauDoan21165/MercyB/pull/862) — the subject of this review (my A4j authorship)
- [PR #837](https://github.com/ChauDoan21165/MercyB/pull/837) — the schema prerequisite migration
- [PR #859](https://github.com/ChauDoan21165/MercyB/pull/859) — A4 self-review APPROVE of #837
- [PR #811](https://github.com/ChauDoan21165/MercyB/pull/811) — manifest with the original SCHEMA-BLOCKED group (MERGED `dafa9b540`)
- [PR #847](https://github.com/ChauDoan21165/MercyB/pull/847) — pipeline map naming this PR as the queued follow-up
- `reports/PRIVACY-b1-manifest-classification-A6d.md` — A6d retention classifications
- Memory: `project_db_schema_drift_audit` — context for the schema-drift sensitivity
