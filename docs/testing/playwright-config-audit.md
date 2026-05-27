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

## Open questions for Chau

- **Q1.** Does the legacy `e2e/` suite still run in CI? If not, the visual-regression snapshots may have drifted from production for many releases without anyone noticing. Worth checking the GitHub Actions logs.
- **Q2.** Is the multi-browser matrix (firefox / webkit / mobile-chrome / mobile-safari) still load-bearing? Each adds run-time + storage. If only one prod regression in the last year came from a non-chromium browser, the matrix may be cargo.
- **Q3.** Are the legacy specs' VIP / `/rooms-vipN` URLs intentional? CLAUDE.md non-negotiable #5 says "no VIP tier" — if those routes are dead, the specs are testing 404 pages.
- **Q4.** Should `tests/e2e/` start gating PRs (currently optional)? The new anon specs in !36 + !41 + this MR are stable and don't require any `TEST_*` env (they `test.skip` cleanly when env is absent on the auth-required specs).

## Maintenance note

Whenever a contributor adds a Playwright spec, route the decision via the table above:

- **Anon render or anon click-through, no DB state needed** → `tests/e2e/<route>-anon.spec.ts`. No env vars required.
- **Signed-in flow, exercises Supabase** → `tests/e2e/<flow>.spec.ts`. `test.skip(!hasSupabaseTestCreds())` at the top.
- **Visual pixel snapshot, multi-browser** → `e2e/<flow>.spec.ts`.
- **404 / error edges on `/chat/:roomId`** → either suite is defensible; lean toward smoke if it asserts DOM rather than pixels.

This audit closes the diagnostic loop. Migration steps are deferred until Chau acks the open questions above.
