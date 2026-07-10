# App-test factory (SL-001)

A two-tier automated tester for the MercyBlade app. **Tier 1 (this MR)** is a
deterministic, zero-AI-cost path crawler. **Tier 2** (next MR) is a capped,
nightly AI-persona quality check — built only after Tier 1 is green.

## Tier 1 — path crawler

Enumerates **every** route from `src/router/AppRouter.tsx` automatically (no hand
list — a new `<Route>` is picked up with no crawler changes), loads each one, and
records 404s, JS crashes, console errors, network failures, and blank/dead-end
renders. Output is one artifact: a pass/fail map of every path with reproduction
steps.

### Run it

```bash
# Anonymous sweep against prod (default). Writes reports/app-test-factory/tier1-path-map.md
npm run test:crawl

# Against a local build:
CRAWL_BASE_URL=http://127.0.0.1:3107 npm run test:crawl

# Bounded smoke (first N routes):
CRAWL_LIMIT=20 npm run test:crawl

# Regenerate just the route manifest:
npm run generate:route-manifest   # → tests/e2e/generated/route-manifest.json
```

### What runs where

| Part | Trigger | Creds |
| --- | --- | --- |
| Route enumeration + manifest | `generate:route-manifest`, and crawler startup | none |
| Anonymous route sweep | `test:crawl` | none — runs against prod today |
| Known-defect reproduction proof | main CI (vitest) — `tests/crawler/knownDefects.reproduction.test.ts` | none |
| Authenticated re-crawl of gated routes | `test:crawl` | `TEST_SUPABASE_*` (skips cleanly without) |

### Synthetic accounts, never real ones

The authenticated pass signs up a **throwaway** account via
`newUserEmail("crawl")` (`smoke+<ts>.<rand>@mercyblade-smoke.test`) on the
**dedicated test Supabase project** (`TEST_SUPABASE_URL`) and deletes it after.
It never touches a real or canary account. Without `TEST_SUPABASE_*` the gated
pass **skips** — CI stays green. This is the same convention as the rest of
`tests/e2e/` (see `tests/e2e/README.md`).

### Verification (reproduction of known errors)

`tests/crawler/knownDefects.reproduction.test.ts` proves the crawler detects the
errors already found by hand (seeded in `knownDefects.ts`): the
placement-v3-session `net::ERR_FAILED`/CORS drop, the CSP `blob:` worker
violation, and the listening-audio `0:00` hang. A console signal matching one of
these is tagged a **known-defect reproduction**; anything else is a **NEW**
failure in the report. The crawler hard-fails (red) only on unambiguous breakage
(unexpected 404 / JS crash / blank render); console/network findings are recorded
in the artifact for admin, not gated on (live prod always has some console
noise).

### Known gaps (explicit, never silently dropped)

The path map lists every un-crawlable route with a reason. v1 resolves only
`:roomId` params (sampled from `public/data`); other params (`:topicId`,
`:slug`, `:sessionId`, …) are reported as `unresolvable-param` gaps for a follow-up
that wires their fixtures. Auth-route gating classification is coarse (a route
that bounces to `/signin` is marked `gated`); refining per-route entitlement
tiers is future work.

## Tier 2 — AI persona quality check (next MR)

A cheap LLM plays a Vietnamese learner with a realistic error profile, runs a
real tutor session on the test project, and judges whether corrections are
grammatically correct and pedagogically sound. Capped sessions/night, cost logged
per run, defect report for admin. Absolute synthetic isolation. **Metric-or-cut:**
must surface ≥1 real grammar defect admin agrees with, or it is cut. Not built
until Tier 1 is green.
