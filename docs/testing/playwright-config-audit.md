# Playwright config audit — `tests/e2e/` vs legacy `e2e/`

**Audit date:** 2026-05-27
**Audit branch:** `test/e2e-p2-routes-and-config-audit`
**Scope:** Diagnostic only. No specs moved, no configs merged, no files deleted in this MR. The proposal at the bottom is for Chau to decide on before any migration.

## TL;DR

The repo has **two Playwright suites under two configs**, sharing the same dev server but with different goals, browsers, and parallelism. They drifted in scope over time:

| | `tests/e2e/` (smoke) | `e2e/` (legacy / visual regression) |
|---|---|---|
| **Config** | `playwright.smoke.config.ts` | `playwright.config.ts` |
| **npm script** | `npm run test:e2e` (only this one is wired) | none — runs only via direct `npx playwright test` |
| **Browsers** | chromium @ 1280×800 | chromium / firefox / webkit + Pixel 5 + iPhone 12 |
| **Parallelism** | sequential (workers: 1, shared DB state) | parallel (fullyParallel: true) |
| **Spec count** | **20** (15 prior + 5 new in this MR) | 6 |
| **Spec LOC** | ~2,200 | ~1,103 |
| **Per-test timeout** | 60 s | 30 s |
| **External-svc stubbing** | yes (`fixtures/mocks.ts` — OpenAI / Anthropic / Stripe) | no |
| **Test goals** | feature flows, anon render smoke, RLS-aware happy paths | visual snapshots, navigation regression, 404 / error edges |
| **Auth/Supabase posture** | env-gated (`TEST_*` vars), `test.skip(!hasSupabaseTestCreds())` | none — no auth fixtures, anon only |
| **Reuses fixtures dir** | `tests/e2e/fixtures/{env,auth,db,mocks,test}.ts` | none |
| **Uses real test Supabase project** | yes (when env present) | no |

## How they diverged

Reading the `playwright.config.ts` and `playwright.smoke.config.ts` headers:

- `e2e/` is the **original** suite — primarily visual regression (`visual-regression.spec.ts`) and navigation flows (`navigation.spec.ts`, `room-loading.spec.ts`). The header explicitly says "for the newer end-to-end smoke suite under ./tests/e2e, see playwright.smoke.config.ts."
- `tests/e2e/` is the **smoke suite** added later. Has a real test-account env-var contract, a fixtures dir, and integrates with the test Supabase project.

Both run against `127.0.0.1:3107` via `npm run dev:frontend`.

## Spec inventory

### `tests/e2e/` (20 specs)

| Spec | Goal | Auth? |
|---|---|---|
| `admin-flag-control.spec.ts` | Admin flag toggle propagates | TEST_ADMIN_* + TEST_USER_* |
| `auth-and-placement.spec.ts` | Signup → placement | TEST_USER_* signup |
| `blog-anon.spec.ts` (P1) | Blog index render | anon |
| `culture-vn-anon.spec.ts` (P2 NEW) | `/culture/vn` hero + pack list | anon |
| `grammar-and-l1-detection.spec.ts` | Grammar tab → L1 hint | TEST_USER_* |
| `languages-anon.spec.ts` (P1) | Languages hub + 7 sub-route links | anon |
| `marketing-landing-anon.spec.ts` (P0) | Marketing brand line + dual CTAs | anon |
| `onboarding-anon.spec.ts` (P0) | Onboarding picker → target step | anon |
| `placement-forensics-dashboard.spec.ts` | Admin forensics view | TEST_ADMIN_* |
| `placement-to-first-lesson.spec.ts` | Placement → first lesson | anon → signup |
| `placement-v3-vertical.spec.ts` | Placement vertical flow | TEST_USER_* |
| `placement-v3.spec.ts` | Placement /placement /who shells | anon |
| `practice-with-mercy-flow.spec.ts` | IELTS speaking → /speak | TEST_USER_* |
| `pricing-anon.spec.ts` (P0) | Pricing hero + trust strip | anon |
| `professions-anon.spec.ts` (P1) | Professions hub + active card links | anon |
| `pronunciation-full-flow.spec.ts` | /speak → phoneme feedback | TEST_USER_* |
| `roleplay-anon.spec.ts` (P2 NEW) | Roleplay heading in either flag state | anon |
| `seo-landings-anon.spec.ts` (P2 NEW) | All 5 /seo/* landings + UTM CTAs | anon |
| `stage-3a-weak-at.spec.ts` | /weak-at empty/populated/partial | anon (localStorage-seeded) |
| `stories-anon.spec.ts` (P2 NEW) | /stories hero + filter region | anon |
| `streak-flow.spec.ts` | Streak trigger → Home badge | TEST_USER_* |
| `support-anon.spec.ts` (P1) | /support hero + contact channels | anon |
| `tier-map-anon.spec.ts` (P2 NEW) | /tiers heading + Upgrade CTA + trio | anon |
| `weekly-digest-anon.spec.ts` (P1) | /blog/weekly-digest header + state | anon |

### `e2e/` (6 legacy specs)

| Spec | Goal | Auth? | Likely overlap with `tests/e2e/` |
|---|---|---|---|
| `error-handling.spec.ts` | 404 / malformed slug / network failure on /chat/:roomId | anon | **None** — chat-room edge cases are not covered in `tests/e2e/` |
| `kids-foundation.spec.ts` | /kids/vi-english picture + speak flow | anon | **None** — kids surface is sacred (CLAUDE.md non-negotiable #2) and has no `tests/e2e/` analogue |
| `navigation.spec.ts` | VIP3 tier nav + /sexuality-culture + /rooms-vip3 (legacy URLs) | anon | **Possible**: visits some routes that no longer exist (`/rooms-vip3`, `/sexuality-culture` — pre-tier-rename URLs); needs verification |
| `room-loading.spec.ts` | /chat/god-with-us-free load behaviour | anon | **None** — room-content rendering is not exercised in `tests/e2e/` |
| `user-journey.spec.ts` | Homepage → /tiers → /rooms; tier card click flows | anon | **Partial overlap**: `tier-map-anon.spec.ts` (new in this MR) covers `/tiers` render; this legacy spec exercises click-throughs into specific tier-card targets |
| `visual-regression.spec.ts` | Pixel snapshots across /rooms, /rooms-vipN, /chat/:roomId | anon | **None** — visual regression has no analogue in the smoke suite |

### Coverage that exists ONLY in `e2e/`

After this MR's additions, four legacy specs cover ground the smoke suite does not:

- **Visual regression snapshots** (`visual-regression.spec.ts`)
- **Kids surface render** (`kids-foundation.spec.ts`)
- **/chat/:roomId error edges** (`error-handling.spec.ts`)
- **Per-room load behaviour** (`room-loading.spec.ts`)

`navigation.spec.ts` and `user-journey.spec.ts` likely contain **stale URLs** (`/rooms-vip3`, `/sexuality-culture`, `/subscribe`) that pre-date the tier rename and the `/upgrade` → `/pricing` consolidation. Confirm with `grep` before any migration.

## Operational issues

1. **Only one suite is wired into `package.json`.** `test:e2e` runs the smoke suite. The legacy suite has no npm script — it runs only via direct `npx playwright test` with no `-c` flag, which silently picks up `playwright.config.ts` (legacy). This means CI almost certainly does not run the legacy suite, and a developer who runs `npm run test:e2e` never sees the visual-regression coverage at all.
2. **`fullyParallel: true` in the legacy config conflicts with the smoke suite's sequential contract**, so the two cannot trivially merge into one config — the smoke suite shares DB state across tests.
3. **The legacy suite is 5-browser** (chromium / firefox / webkit + Pixel 5 + iPhone 12). The smoke suite is chromium-only. Combining browsers would 5× the smoke run time on every PR.
4. **Two `webServer` entries** in two configs both spin up the same dev server. If a developer runs both back-to-back the second invocation hits "port 3107 already taken" (strictPort) unless `reuseExistingServer` is set — which it is, so it works in practice. Worth knowing for future config consolidation.

## Migration proposal (NOT executed in this MR)

If Chau wants to consolidate, the cleanest path is **NOT a merge**. Keep two configs, but rename + clarify intent:

1. **Rename** `playwright.config.ts` → `playwright.visual.config.ts` and `e2e/` → `tests/visual/`. Update its `testDir` accordingly. This makes the "smoke vs visual" split explicit.
2. **Wire `test:visual` npm script** so the legacy suite actually runs from a documented entry point. Decide if it gates PRs or is on-demand.
3. **Audit `navigation.spec.ts` and `user-journey.spec.ts` for stale URLs** (`/rooms-vip3`, `/sexuality-culture`, `/subscribe`). Fix or delete the dead-route tests.
4. **Keep `kids-foundation.spec.ts` in the visual suite** — it has multi-browser value (kids is sacred, Safari/iOS regressions would be expensive). Optionally write a thinner anon-smoke companion in `tests/e2e/kids-anon.spec.ts` that runs on every PR while the visual variant stays on-demand.
5. **Move `error-handling.spec.ts` + `room-loading.spec.ts` to the smoke suite** (`tests/e2e/`) — they're behavioural, not visual. Drop them from the visual config to avoid duplicate execution.
6. **Keep `visual-regression.spec.ts` in the visual suite** — that's its actual purpose. Pin the snapshot baseline to a single browser (chromium) to keep storage costs in check; the multi-browser matrix can be opt-in.
7. **Document the split** in a top-level `docs/testing/README.md` (does not exist today) so the next contributor doesn't have to read both configs to understand which suite to extend.

Total churn: ~6 file moves, 2 config edits, 1 docs add, 1 npm-script add. Each item is independently shippable — no big-bang migration is required.

## Phase 1 status — 2026-05-27

This follow-up MR (`chore/legacy-e2e-migration-phase-1`) executes the **lowest-risk** steps of the proposal above. **No deletions** — only deprecation markers + the answered open questions below.

### Actions taken

- **`e2e/navigation.spec.ts`** — marked `// DEPRECATED`. Every URL it navigates to is dead (`/rooms-vip{1,2,3}`, `/sexuality-culture`, redirect-only `/chat/<id>-vip3*`). No `tests/e2e/` analogue is needed — VIP-tier navigation is a deleted product surface (CLAUDE.md non-negotiable #5), not a regressed feature.
- **`e2e/user-journey.spec.ts`** — marked `// DEPRECATED`. Heavy reliance on dead `/subscribe` and `/vip1`; the surviving `/tiers` / `/` / `/rooms` portions are now covered by focused smoke specs (`tier-map-anon.spec.ts`, `marketing-landing-anon.spec.ts`, legacy `room-loading.spec.ts`). The brittle `text=Mercy Blade` assertion also no longer matches the live brand spelling (`MercyBlade`, no space).
- **Open questions Q1–Q4** answered in-doc with reasoning. Q2 and Q4 carry `REQUIRES_OWNER_DECISION` flags on specific sub-choices (multibrowser policy, gate-vs-report).
- **No actual deletions** — the dispatch explicitly defers deletion to a separate Phase-2 MR after Chau reviews this one. The deprecated specs remain discoverable by `npx playwright test -c playwright.config.ts` and will continue to fail; that failure is the correct signal that cleanup is pending.

### What this MR did NOT change

- The other four legacy specs (`error-handling`, `kids-foundation`, `room-loading`, `visual-regression`) — kept as-is per the migration proposal (kids is the only CI-gated spec; the other three cover ground the smoke suite does not yet).
- `playwright.config.ts` and `playwright.smoke.config.ts` — left untouched. The proposed rename + npm script wiring is Phase 2 work.
- `.github/workflows/playwright.yml` — unchanged. The chromium-only opt-in into `kids-foundation.spec.ts` continues; expanding to `tests/e2e/*-anon.spec.ts` per Q4 is Phase 2a.
- No source code touched outside `tests/` and `docs/` (per dispatch).

### Next dispatch (Phase 2 — after Chau reviews)

1. Delete `e2e/navigation.spec.ts` and `e2e/user-journey.spec.ts`.
2. Add `test:visual` npm script + CI-job extension to run anon `tests/e2e/*-anon.spec.ts` on every PR.
3. Decide multibrowser policy (Q2 sub-choice).
4. Decide gate-vs-report (Q4 sub-choice).
5. Rename `playwright.config.ts` → `playwright.visual.config.ts` and `e2e/` → `tests/visual/`.

## Phase 2 status — 2026-05-27

This follow-up MR (`chore/legacy-e2e-migration-phase-2`) executes the deletions deferred from Phase 1 and addresses Q1 by expanding CI coverage. The Q2 + Q4 owner sub-choices remain deferred — see "What this MR did NOT change" below.

### Actions taken

- **Deleted `e2e/navigation.spec.ts`** — every URL was dead per the Phase-1 audit and the `// DEPRECATED` marker shipped in !55. Verified again 2026-05-27 against `src/router/AppRouter.tsx` — no resurrected routes.
- **Deleted `e2e/user-journey.spec.ts`** — same reasoning. Surviving coverage lives in `tests/e2e/{marketing-landing,tier-map,pricing}-anon.spec.ts` and the legacy `e2e/room-loading.spec.ts`.
- **Expanded `.github/workflows/playwright.yml`** to address Q1:
  - Added `pull_request` to the trigger list (was `push: main` only — CI never gated PRs).
  - Renamed workflow from "Playwright Visual Regression Tests" to "Playwright (kids + anon smoke)" to reflect dual purpose.
  - Added a second `playwright test` step that runs the anon smoke suite from `tests/e2e/` (`*-anon.spec.ts` glob + `stage-3a-weak-at.spec.ts` + `placement-forensics-dashboard.spec.ts`, chromium only). Auth-required specs in `tests/e2e/` are intentionally excluded — none of the smoke env vars are wired into CI yet, and the cleanest signal is to enumerate exactly the specs we know are deterministic.
  - Artifact-upload step extended to include `playwright-smoke-report/` alongside the existing `playwright-report/`.
- **Annotated `playwright.config.ts`** with a "Dead-config note" header flagging the four non-chromium project entries (`firefox`, `webkit`, `mobile-chrome`, `mobile-safari`) as not exercised by any CI workflow. The entries are NOT removed — that's the Q2 owner decision.
- **Updated `e2e/README.md`** and `docs/testing/e2e-coverage-map.md` to drop dangling references to the deleted specs.

### What this MR did NOT change

- **Q2 (multibrowser policy)** — the four non-chromium projects remain in `playwright.config.ts`. The new header comment names them as dead, but the prune is an explicit owner decision (keep an opt-in `multibrowser` job for release-candidate branches? or collapse to chromium-only?).
- **Q4 (gate-on-merge vs report-only)** sub-choice — this MR defaults to **gate-on-merge** for the anon smoke (per the Phase-1 Q4 answer "defaults to block-on-merge"). The workflow run is now PR-blocking. If Chau wants report-only first, a follow-up flips `if: failure()` semantics or adds a `continue-on-error` to the smoke step. The default is the simpler, stricter pattern; reverting is one line.
- **The Phase-1 proposal items 1 (rename configs), 4 (kids visual companion), 5 (move behavioural specs from `e2e/` into `tests/e2e/`), 6 (visual snapshot baseline pin), 7 (top-level `docs/testing/README.md`)** — deferred to Phase 3. Not blocking.
- No source code touched outside `tests/`, `e2e/`, `docs/`, and `.github/workflows/` (per dispatch — "tests + docs only" plus the CI workflow Q1 fix).

### CI workflow contract after this MR

| Trigger | What runs | Project | Blocks PR? |
|---|---|---|---|
| `push: main` | kids visual + anon smoke (~15 specs) | chromium | n/a (post-merge) |
| `pull_request` | kids visual + anon smoke (~15 specs) | chromium | yes (gate) |

Auth specs in `tests/e2e/` still gate on `hasSupabaseTestCreds()` and skip cleanly when the test Supabase project secrets are absent — those will switch on automatically once Phase 3b provisions the CI secret.

### Phase 3 backlog (owner-gated)

1. **Q2 resolution:** prune `playwright.config.ts` projects array OR add an opt-in `multibrowser` workflow.
2. **Q4 follow-up:** confirm gate-on-merge is the right posture; revert to report-only if any spec turns out to be flaky in CI.
3. **Config rename:** `playwright.config.ts` → `playwright.visual.config.ts`, `e2e/` → `tests/visual/`. Carries `test:visual` npm script + workflow path updates.
4. **Behavioural spec migration:** move `e2e/error-handling.spec.ts` + `e2e/room-loading.spec.ts` into `tests/e2e/` (they're behavioural, not visual — see the Phase-1 proposal item 5).
5. **Visual baseline regeneration:** if Q2 lands as "chromium only", regenerate visual-regression baselines pinned to chromium.
6. **Top-level `docs/testing/README.md`** — index for the split.

## Open questions — resolved 2026-05-27 (Phase 1 follow-up MR)

### Q1. Does the legacy `e2e/` suite still run in CI?

**ANSWER:** Mostly no. Only `e2e/kids-foundation.spec.ts` runs in CI, chromium only — see `.github/workflows/playwright.yml:43`:

```yaml
- name: Run Playwright tests
  run: npx playwright test e2e/kids-foundation.spec.ts --project=chromium
```

The other five legacy specs (`navigation`, `user-journey`, `room-loading`, `error-handling`, `visual-regression`) are **not** executed by any workflow. The multi-browser matrix in `playwright.config.ts` is declarative-only — CI explicitly opts into `--project=chromium`. The `tests/e2e/` smoke suite is also not currently CI-gated.

**Implication for migration:** the legacy suite's 5 non-kids specs have been silently dark for an unknown period. The visual-regression snapshots have probably drifted; expect baseline noise on the first re-enable. `navigation.spec.ts` and `user-journey.spec.ts` are already broken-by-construction (every URL is dead — see Phase 1 below) and CI never noticed because CI never ran them.

### Q2. Is the multi-browser matrix (firefox / webkit / mobile-chrome / mobile-safari) load-bearing?

**ANSWER:** No, not currently. Per Q1, CI runs chromium only. The four extra browser projects in `playwright.config.ts` are dead config — nothing exercises them. Strategy-aligned recommendation: collapse the matrix to chromium only when the migration's Phase 2 lands (or move firefox/webkit to an opt-in `--project=multibrowser` job that only runs on release-candidate branches). Mobile coverage on iOS lives in the Capacitor build/native simulator path, not in browser Playwright, so dropping `mobile-safari` is safe.

**REQUIRES_OWNER_DECISION:** whether to keep a single `multibrowser` opt-in job (for pre-release smoke) or drop the matrix entirely. Either is defensible.

### Q3. Are the legacy specs' VIP / `/rooms-vipN` URLs intentional?

**ANSWER:** No. CLAUDE.md non-negotiable #5 ("No VIP tier") supersedes the tier-naming model these specs encode. Verified 2026-05-27 against `src/router/AppRouter.tsx`:

- `/rooms-vip1`, `/rooms-vip2`, `/rooms-vip3` — zero matching routes
- `/sexuality-culture` — zero matching routes
- `/subscribe`, `/vip1` (referenced by `user-journey.spec.ts`) — zero matching routes

These specs are dead. Phase 1 of this MR adds `// DEPRECATED` markers; Phase 2 deletes them.

### Q4. Should `tests/e2e/` start gating PRs?

**ANSWER:** Yes for the anon specs, not yet for the auth specs. Two-step rollout:

1. **Phase 2a (this MR's natural follow-up):** add a new workflow that runs the **anon** specs only — `tests/e2e/*-anon.spec.ts` matches 10 specs after !47 — chromium, on every PR. They have no `TEST_*` env-var dependency, average ~3-4 seconds per spec, and total wall time is well under 5 minutes. Net cost is small for the regression coverage.
2. **Phase 2b (when the test Supabase project is wired into CI):** extend to the full `tests/e2e/` suite. The auth specs `test.skip` cleanly when env is absent, so we can land the workflow before the secrets are provisioned — the suite just runs degraded until then.

**REQUIRES_OWNER_DECISION:** whether to gate-on-merge (block PR) or report-only (post a comment) at first. Defaults to "block on merge" for anon — these specs are deliberately written to fail loudly.

## Maintenance note

Whenever a contributor adds a Playwright spec, route the decision via the table above:

- **Anon render or anon click-through, no DB state needed** → `tests/e2e/<route>-anon.spec.ts`. No env vars required.
- **Signed-in flow, exercises Supabase** → `tests/e2e/<flow>.spec.ts`. `test.skip(!hasSupabaseTestCreds())` at the top.
- **Visual pixel snapshot, multi-browser** → `e2e/<flow>.spec.ts`.
- **404 / error edges on `/chat/:roomId`** → either suite is defensible; lean toward smoke if it asserts DOM rather than pixels.

This audit closes the diagnostic loop. Migration steps are deferred until Chau acks the open questions above.
