=== C4 HARDEN ROLLUP — FINAL: BATCH NOT MERGED ===

generated: 2026-07-07

OUTCOME: The 182-commit hardening roll-up on c4/harden-rollup is NOT merged to main.
Final full-suite verdict was RED; targeted re-run confirmed the batch introduces real
behavior changes, not just test-assertion noise. No batch content was shipped. Nothing
deployed. C4 never pushed to main.

RUN STATS:
- 361 c4/harden/* branches processed
- 172 merged onto staging (+prior = 182 integrated commits)
- 165 conflicted (preserved, listed in C4-HARDEN-CONFLICT-BRANCHES-FOR-APPROVAL.md, awaiting Chau)
- 24 already-applied
- 0 gate failures at the per-branch (typecheck/lint/depcruise) level
- Full suite on integrated staging: RED, 9 test files failing
  (isolated re-run: 7 confirmed real regressions + 2 contention flakes that passed clean —
   the 2 flakes were src/lib/pronunciation/…/vietnameseToneReference{Evidence,Ingestion};
   the 7 real ones are exactly the buckets below)

WHY ABANDONED — the failures split into two buckets:

Bucket A — cosmetic (behavior-preserving; test asserts on incidental call shape):
- referralClient generateCode: rpc(name) -> rpc(name, undefined); identical runtime
- subscriptionRepository: extra query filter arg (likely behavior-preserving)
- multiAccent: accent-order array reordered (US-first -> GB-first) — cosmetic ONLY if
  default-accent order is not user-facing; flagged as needs-judgment

Bucket B — REAL behavior changes (these are why the batch is unsafe to merge):
- referralClient applyReferralCode: TypeError "Cannot read properties of undefined
  (reading 'error')" at referralClient.ts:199 — a hardening commit introduced a real
  runtime CRASH in grantReferralReward.
- singleLanguageRender.smoke + uiLanguageToggle.smoke + normalizeTitle: three suites
  can no longer find bilingual/Chinese lesson content ("no Chinese lesson with
  native+romanization", "no bilingual probe", "Chinese C1 lesson undefined") — a
  hardening commit to src/languages/chinese/* broke lesson-content structure.
- verify-step13-18-privacy-register-gates: the fail-closed `catch { return false }`
  privacy/consent guard no longer matches — a hardening commit weakened a
  security-adjacent fail-closed guard.

DECISION: Type-safety cleanup is not worth a referral crash, broken Chinese lesson
content, and a weakened privacy guard. The good and bad commits are interleaved across
182, so a partial merge would drag real bugs along. Batch abandoned. No batch content
on main.

DISPOSITION:
- Staging branch c4/harden-rollup: PRESERVED for reference, NOT merged, NOT deleted.
- If specific hardening fixes are wanted later, cherry-pick them individually with
  their tests passing — never as a batch.
- The Bucket B breaks are documented here so they are NOT silently reintroduced by a
  future run.
- 165 conflict branches: still awaiting Chau's separate drop-approval decision. None deleted.

MAIN STATE — VERIFIED 2026-07-07 (accuracy note; differs from the "stays at bc8bf514" assumption):
- The roll-up is NOT merged to main (git branch -r --merged origin/main → 0 hits for c4/harden-rollup).
- origin/main is NOT bc8bf514. It is 7a840d56 — advanced by 15 commits since bc8bf514
  (which remains a direct ancestor). Those 15 are INDEPENDENT Admin/CI/OBS work landed
  during the run, NOT this batch. Examples: hardening/supabase-env-guard, fix/typecheck-ci-heap,
  ci vitest-shard/esbuild-OOM fixes, and fix(admin-tests): make 4 admin-factory tests hermetic
  (the Admin-factory handoff was acted on).
- The single "C4 hardening:" commit visible on main (cebda9b3, C4-HARDEN-F-SRC-164-src-lib-retry)
  PREDATES this batch — it is already contained in bc8bf514 and was merged independently
  earlier; it is not part of the abandoned roll-up.
- Net: C4 contributed nothing to main. Main is clean of this batch. Main moving to 7a840d56
  is other teams' work, not a C4 rollup merge.

ROOT-CAUSE NOTE: the generator loop that created the 361 branches is DORMANT (verified:
c4_refill_200 one-shot deleted, launchd workers unloaded). It will not regenerate.
If ever revived, fix its output to emit one branch per directory (batched) AND run the
full test suite per-workpack, not just typecheck/lint/depcruise — the per-branch gate
missed all 5 real breaks because it never ran the tests.
