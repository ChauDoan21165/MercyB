# DP INT Live Readiness Map — CORRECTION

**Runner:** A6 | **Date:** 2026-07-08 | **Mode:** CORRECTION — supersedes the LIVE column of `DP_INT_LIVE_READINESS_MAP.md`

> This file **corrects** `DP_INT_LIVE_READINESS_MAP.md` (2026-07-07). The original is
> preserved unchanged for history. Where the two disagree, **this file wins.**

---

## What the original got wrong

The original map's **LIVE (116 WPs, 14 files)** table asserts that `tm-int/*` modules are
"Imported by real components/pages. Already serving users," and names consumers such as
**AudioPlayer, MercyChat, CornerTalker, MercyGuide, Bilingual, WeeklyProgressWidget**, etc.

That consumer column is **fabricated.** Verified by import inspection (reading the files, not
a keyword grep):

- **AudioPlayer, MercyChat, CornerTalker, MercyGuide import zero `tm-int` modules.** None of the
  named components in the LIVE table import from `@/lib/tm-int/*`.
- The **only** importer of `tm-int` anywhere under `src/components/` or `src/pages/` is a test:
  `src/components/placement/v3/__tests__/runtimeIntegration.test.ts`. There is **no live
  (non-test) component or page** that imports `tm-int`.

Therefore the "LIVE — already serving users" classification for those 14 files was not true at
the time the map was written. `tm-int` reached a learner through exactly one path — placement.

## The actual live chain (hand-verified, by line)

Only `src/lib/placement/v3/*` bridges into `tm-int`, via this call chain:

```
src/lib/placement/v3/clientStub.ts:280   export async function submitResponse(...)
  └─ :297  calls applyRuntimeToResults(...)
src/lib/placement/v3/clientStub.ts:176   function applyRuntimeToResults(results)
  └─ :178  calls buildPlacementTeacherContext(timeline, results.completedAt)
src/lib/placement/v3/runtimeIntegration.ts:195   export function buildPlacementTeacherContext(...)
  └─ :6    imports { buildTeacherContext } from "@/lib/tm-int/runtime"
src/lib/tm-int/runtime/contextBuilder.ts:23   export function buildTeacherContext(observationPacket)
```

Notes:
- The entry into `tm-int` is **`buildTeacherContext`**, not `runRuntimeDecisionPipeline` /
  `decisionPipeline.ts` — the latter remains **WIREABLE-FEATURE (unwired)**, consistent with the
  original map's own "no live call site" finding.
- The original map already corrected one related error in its "Key Finding" section
  (`runtimeIntegration.ts` is WIREABLE, not LIVE via a UI import). This correction extends that:
  the `tm-int` LIVE table as a whole overstated live reach.

## Did the output reach a learner?

- **Pre-A7: 0%.** The placement chain computed a runtime decision, but nothing surfaced it to the
  learner — the results page did not render it.
- **A7 (merged `b04446352`, feat `2a6b734c3`) surfaces it**, gated behind
  `FEATURE_FLAGS.PLACEMENT_DECISION_VISIBLE` (`src/lib/featureFlags.ts:98`,
  `readEnvBool("VITE_PLACEMENT_DECISION_VISIBLE", false)`), rendered at
  `src/components/placement/v3/ResultsProfile.tsx:215`. The flag **defaults OFF**, so the decision
  is live-capable but not yet learner-visible until the env var is flipped.

## Net

| Claim in original map | Corrected status |
|---|---|
| 14 `tm-int` files LIVE, serving users via AudioPlayer/MercyChat/CornerTalker/MercyGuide/… | **False.** Zero live components import `tm-int`; only a placement test does. |
| Placement is the live surface | **True**, via the `clientStub → runtimeIntegration → buildTeacherContext` chain above. |
| `tm-int` output reached learners | **0% pre-A7.** A7 makes it surfaceable; flag OFF, so still not learner-visible. |

**Supersede pattern:** original preserved as-is; this file corrects it. See the warning line
atop `DP_INT_LIVE_READINESS_MAP.md`.
