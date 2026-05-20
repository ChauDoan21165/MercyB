# RECON — Visual-regression current state (Issue #635 precursor)

**Agent:** B35
**Branch:** `b35/vr-current-state-audit` (off `origin/main` @ 4a64212fb)
**Date:** 2026-05-19
**Phase:** Diagnostic + inventory only — no infra, no code changed
**Method:** Static audit of current HEAD. `ripgrep`/`grep` across `e2e/`, `tests/e2e/`, `.github/workflows/`, `git ls-files`, both Playwright configs, `.gitignore`, `package.json`. `npm ci` deliberately skipped — pure read-only audit, no gates run, no PR (per worktree-gates-node_modules: deps only when a gate/build needs them).
**Scope note:** This is the narrow precursor for B2. B2 owns the strategic recommendation; this report only maps what exists today and hands B2 the facts.

---

## Bottom line up front

**A fully-written 27-assertion visual-regression suite exists but is operationally inert.** It is not "missing" — it is dormant: no committed baselines, a non-gating push-only CI workflow, and stale legacy targets. If a UI regresses today, **nothing automated catches it**; the only real detection path is manual eyeball on a preview/prod deploy. Effective automated VR coverage today ≈ **0%** despite the code being present.

B2's decision is therefore *not* "build VR from scratch" — it's "revive, correct, and gate an existing dormant suite, or formally retire it."

---

## Verdict — how much VR coverage exists, on what surfaces

| Dimension | State |
|---|---|
| VR spec authored | **Yes** — `e2e/visual-regression.spec.ts`, 27 `toHaveScreenshot` assertions, **no** skip/only markers |
| Surfaces targeted | Room grids (free + `vip1/2/3`), individual rooms (adhd/anxiety/confidence/sexuality/strategy/finance), back-button header, feedback section, mobile/tablet viewports, dark mode, per-browser |
| Committed baselines | **None.** 0 baseline PNGs in `git ls-files`. No `e2e/__screenshots__/` dir. No Playwright-default `*-snapshots/` dir. |
| Wired into npm scripts | **No.** `package.json` only has `test:e2e` → `playwright.smoke.config.ts` (the *other* suite). The VR config is the unscripted default config. |
| Wired into CI | **Partially / non-gating.** `playwright.yml` runs the VR config but only on `push: [main]`, never on PRs. Not a required check. |
| Effective regression signal | **Zero.** No retained baseline → self-regenerating every run. |

---

## Evidence — file paths + counts

### Screenshot/snapshot API inventory

| API | Count | Location | Classification |
|---|---|---|---|
| `expect(page\|locator).toHaveScreenshot(...)` | **27** | `e2e/visual-regression.spec.ts` (lines 19,30,41,52,63,78,89,100,111,122,133,147,157,170,183,195,207,224,238,252,263,277 …) | **Intended-active baseline comparison → operationally passive** (see Impact: no committed baseline + `retries:2` ⇒ first-run failure self-heals on retry against an ephemeral just-written PNG) |
| `page.screenshot()` | **0** | — | n/a |
| `toMatchSnapshot()` | **0** | — | n/a |
| `screenshot: "only-on-failure"` | 2 | `playwright.config.ts` + `playwright.smoke.config.ts` (config `use:` block) | **Test artifact only** — failure-triage capture, never compared |
| screenshot/snapshot in `tests/e2e/*` smoke specs | **0** | — | none |
| screenshot/snapshot in other `e2e/*` specs (navigation, room-loading, error-handling, user-journey) | **0** | — | none |

So all VR lives in exactly one file (`e2e/visual-regression.spec.ts`); everything else under `e2e/` and `tests/e2e/` has zero screenshot assertions.

### Two Playwright configs (intentionally separate)

- `playwright.config.ts` — **default config**, `testDir: ./e2e`, 5 browser projects (chromium/firefox/webkit/mobile-chrome/mobile-safari). This is the VR suite. **Not referenced by any npm script.** Invoked only by bare `npx playwright test`.
- `playwright.smoke.config.ts` — `testDir: ./tests/e2e`, chromium-only, feature-flow smoke. Invoked by `npm run test:e2e` (manual; not in any CI workflow).

### Baseline directory status

- **No committed baseline directory.** `git ls-files | grep -i '\.png$'` for screenshot/snapshot/baseline/visual → 0 hits (the one match, `public/images/mercy-kids-page-30/k30_056_screenshot_this.png`, is unrelated kids content).
- Playwright's default snapshot path would be `e2e/visual-regression.spec.ts-snapshots/` (no `snapshotPathTemplate` set) — **does not exist, and is not gitignored**.
- `e2e/README.md` documents a `e2e/__screenshots__/` layout (lines 158–168) that **does not exist** anywhere and is **not** in `.gitignore` — README is aspirational/fictional on this point.
- `.gitignore` 55–57: only `playwright-report/`, `playwright-smoke-report/`, `test-results/` are ignored (report/artifact dirs, not baselines).

### CI status — `.github/workflows/playwright.yml`

- Trigger: **`on: push: branches: [main]` only** — **no `pull_request` trigger**. Cannot gate a PR.
- Step `Run Playwright tests`: `npx playwright test` with **no `-c`** → resolves to default `playwright.config.ts` = the VR suite.
- Artifacts: `playwright-report/` uploaded `if: always()` (30d); `test-results/` uploaded `if: failure()` (7d). So a failed run *is* post-hoc viewable as a downloadable artifact — but with **no notification** (see next).
- "Comment PR with results" step is gated on `github.event_name == 'pull_request'` — **dead code**: the workflow never runs in a PR context, so this notifier never fires.
- Not listed as a required status check (no PR trigger ⇒ structurally cannot block merges).
- The smoke config is invoked by **no** workflow.

---

## Impact — if a UI regresses today, what's the path to finding it?

1. **At PR time: nothing.** `playwright.yml` has no `pull_request` trigger; the smoke suite contains zero VR and isn't in PR CI either. A visual regression merges with no automated objection.
2. **Post-merge on `main`:** `playwright.yml` runs the VR suite, but with **no committed baseline** every `toHaveScreenshot` fails on attempt 1 ("snapshot doesn't exist, writing actual"), then `retries: 2` re-runs and the just-written ephemeral PNG now exists, so it can pass. The comparison reference is whatever that same run produced — **no retained ground truth, so no diff can ever fire.** The PR-comment notifier is dead code (no PR context). Artifacts upload but nobody is alerted.
3. **Compounding staleness:** the spec navigates to `/rooms-vip1`, `/rooms-vip2`, `/rooms-vip3` — **legacy VIP routes** (CLAUDE.md non-negotiable #5: no VIP tier). These likely 404/redirect now, so `waitForSelector('[class*="grid"]')` times out (30s) → failures/flake unrelated to pixels, further drowning any signal.
4. **Realistic detection = manual eyeball** on a preview deployment or production. There is no CI path that surfaces a visual regression to a human before or after merge.

---

## Recommendation — pass-through context for B2 (not a strategy)

Hand B2 these precursor facts so it scopes the strategic call correctly. **Do not treat #635 as greenfield.** The decision space is "revive/correct/gate a dormant suite vs. formally retire it," not "build VR." Specifically, B2 should weigh:

- **Baselines:** there are none. B2 must choose a storage strategy (commit PNGs to git? LFS? a baseline-update workflow with `--update-snapshots`?) before VR can compare anything. Until then `toHaveScreenshot` is theater.
- **Trigger:** VR only catches anything if it runs on `pull_request` (or as a gating check). Today it's push-only and non-blocking.
- **Stale targets:** `/rooms-vip1|2|3` violate CLAUDE.md #5 — any revival must remap to the current `profiles.tier` model first, or the suite fails for reasons unrelated to visuals.
- **Doc drift:** `e2e/README.md`'s `e2e/__screenshots__/` layout is fictional; reconcile with Playwright's real default snapshot path.
- **Flake budget:** 5 browser projects × 27 shots = 135 image comparisons, `fullPage` on text-heavy room content — historically the highest-flake VR shape. Whether that's worth it on which surfaces is **B2's strategic call** — left intentionally to B2.

No code or infra changed by this task. Diagnostic only.
