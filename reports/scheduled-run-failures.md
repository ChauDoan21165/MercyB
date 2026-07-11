# Scheduled Synthetic-Learner Pipeline Failures — Diagnosis

## Verdict (one paragraph)

**(a) Why add68789 and not "latest main": add68789d IS the current `origin/main` HEAD**
(the run-9 submit-selector merge; zero commits after it), so the schedule is *not* pinned
to an old commit — it runs `main` HEAD hourly. The premise that scheduled runs "never got
the run-9 fix" is moot because **the `prod-synthetic-learner` job is SKIPPED on schedule**
(gated off; 0s in every scheduled pipeline) — run #10's passing 6/6 was a **manual/web**
pipeline that *ran* that job, not a scheduled one. **(b) Which jobs fail and why: NOT the
synthetic-learner journey at all.** The scheduled pipeline reds on two *other*, long-standing
jobs — `production-e2e` and `production-placement-smoke` — failing on three checks: (1)
`homepage.spec.ts` — `getByRole("img",{name:/mercy blade/i})` (mandatory space) no longer
matches the actual logo accessible name **"MercyBlade"** (one word); the page renders fine
(ARIA shows the logo + Sign In link present). (2) `ai-tutor.spec.ts` — anonymous `/ai-tutor`
renders the **"Choose Your Language" onboarding picker** (the exact gate from run #8b), so
`getByTestId("ai-tutor-shell")` never mounts. (3) `placement-imitation-user.spec.ts` — a
**deliberate throw**: prod placement is sign-in-gated and the scheduled runner has no
`PROD_SMOKE_EMAIL/PASSWORD/SUPABASE_ANON_KEY` canary creds. **(c) Real-vs-harness: all three
are HARNESS, none are a prod/app break.** (1) and (2) are stale test-drift (accessible-name
change; onboarding-gate added after the e2e was written) — fixed here in-spec. (3) is a
**CONFIG** gap (missing canary creds) — not a code fix; reported for Chau. These failures are
**chronic**, not a run-9 regression: the same two jobs have failed on scheduled runs for days
(c1a56b76c, 6b642d8cf, 7a840d569 — 07-08 → 07-11).

## Evidence

### (a) Schedule is on main HEAD; synthetic-learner is skipped
- `git log origin/main -1` → **add68789d** (run-9 merge). No commits after it.
- Scheduled pipeline 2669466084 job matrix:
  | job | status | dur |
  |---|---|---|
  | prod-synthetic-learner | **skipped** | 0s |
  | golden-flows-prod | skipped | 0s |
  | production-placement-smoke | **failed** | 121s |
  | production-e2e | **failed** | 146s |
  | nightly-full-suite | success | 510s |
  | nightly-db-backup | success | 402s |
- The ~8–9 min job the runs "run then fail" on is `nightly-full-suite` (510s) — which **passes**
  (failed once at 2669420878, otherwise green → flaky, not the cause).

### (b/c) The three failing checks — all harness
1. **homepage** (`production-e2e`, arm64 host): locator `getByRole("img",{name:/mercy blade/i})`.
   ARIA at failure: `img "MercyBlade" [ref=e7]` present and visible, `link "Sign In" → /login`
   present. → **accessible-name drift**: alt is "MercyBlade" (no space), regex requires a space.
2. **ai-tutor** (`production-e2e`): locator `getByTestId("ai-tutor-shell")`. ARIA at failure:
   `heading "Choose Your Language"` / `link "Choose Language →"` — the onboarding picker
   (`AiTutor.tsx`: `if (!hasUrlPair && !hasStoredPair)`). The anon e2e has no language pair →
   picker, not shell. → **stale pre-gate test** (same gate as run #8b).
3. **placement-smoke** (`production-placement-smoke`, amd64 host): the test itself throws
   `AUTH GATE: the adult placement test requires sign-in… Set PROD_SMOKE_EMAIL /
   PROD_SMOKE_PASSWORD / PROD_SMOKE_SUPABASE_ANON_KEY (canary account)`. → **CONFIG**: prod
   placement is sign-in-gated; the scheduled runner is not provisioned with canary creds.

### Chronic, not a run-9 regression
- 2669049762 (c1a56b76c): FAILED = [placement-smoke, e2e]
- 2666470009 (6b642d8cf): FAILED = [placement-smoke, e2e]
- 2660495398 (7a840d569): FAILED = [e2e]
- …scheduled `main` pipelines show `failed` back to 2026-07-06.

## Fix (SPEC only, no app code) — MR

`tests/e2e/homepage.spec.ts` — `/mercy blade/i` → `/mercy\s*blade/i` (matches both the
one-word "MercyBlade" and the spaced "Mercy Blade" used elsewhere).

`tests/e2e/ai-tutor.spec.ts` — seed the language pair before navigating (proven run-8b
approach), so the tutor shell renders instead of the onboarding picker:
```ts
await page.addInitScript(() => {
  localStorage.setItem("mercyblade.languagePair", JSON.stringify({ native: "vi", targets: ["en"] }));
  localStorage.setItem("mercyblade.nativeLang", "vi");
});
```

This turns `production-e2e` green. No app code touched.

## What turns the scheduled pipeline green

`production-e2e` is the **only gating failure**. `production-placement-smoke` carries
`allow_failure: true` (job-level) — a non-blocking monitor by design — so its failure does
**not** fail the pipeline. Therefore **this MR alone turns the scheduled pipeline green**
(verified: the `production-e2e` job was re-run on this branch with the fix via
`RUN_PROD_E2E=true`). The scheduled pipeline's `failed` status was driven entirely by the
gating `production-e2e` job.

## HOLD / report (not fixed here) — CONFIG, Chau's action

`production-placement-smoke` will keep failing (non-blocking) until the scheduled runner has
the canary creds `PROD_SMOKE_EMAIL` / `PROD_SMOKE_PASSWORD` / `PROD_SMOKE_SUPABASE_ANON_KEY`
(CI variables). The test is *intentionally* loud (hard throw, not skip) to force provisioning,
so I did **not** soften it to a skip — that's a product/ops decision: either (i) add the canary
CI variables (recommended — restores full audio+results coverage), or (ii) if prod placement is
*meant* to be anonymous and the sign-in gate is itself a regression, that's a real app signal
to trace separately. Flagging, not deciding. This is monitor coverage going dark, **not** a
merge blocker.

## Note

None of this touches the synthetic-learner journey (a)–(f) work; that job doesn't run on the
schedule. If the intent is for the scheduled pipeline to exercise the synthetic learner,
that's a separate change (enable `SYNTHETIC_LEARNER_ENABLED` on the schedule) — flagging as a
possible gap, not actioned here.
