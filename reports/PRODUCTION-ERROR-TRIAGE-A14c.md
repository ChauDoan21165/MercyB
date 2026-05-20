# Production error pattern triage (A14c)

**Reviewer:** A14c (read-only)
**Worktree:** `/private/tmp/A14c-prod-triage` off `origin/main` @ `10f0b1533`
**Date:** 2026-05-19 / late session
**Trigger:** A14 chain follow-up — Sentry inbox screenshot showed 6 unresolved production issues; classify each and recommend handler widening / Sentry-side suppression / fix PRs.

---

## TL;DR

```
╔══════════════════════════════════════════════════════════════╗
║ 📋  6 PATTERNS  ·  0 🔴 UNHANDLED  ·  1 🟡 REAL FIX (PR-able) ║
║      4 chunk-load = HANDLED-BUT-NOISY (already downgraded)   ║
║      1 auth-lock  = A17 owns (in flight, do not duplicate)   ║
║      1 insertBefore = handler widening, ~1 line fix          ║
╚══════════════════════════════════════════════════════════════╝
```

**No P0 escalation.** Most volume is already routed to `warning` level by the existing `enrichEventTags` chunk-recovery downgrade. Only one true handler gap exists: the `looksLikeDomMutationExtensionNoise` filter catches `removeChild` but not the sibling `insertBefore` variant of React-DOM/extension races.

---

## 1. Per-pattern triage

### Pattern 1 — `TypeError: Failed to fetch dynamically imported module` (×3) — 🟢 HANDLED-BUT-NOISY

**Mechanism:** stale chunk hash after a deploy; the browser still has the old `index.html` referencing chunks the new deploy renamed.

**Existing handlers (3 layers):**

- **Tier-1A** (`src/lib/lazyWithRetry.ts:65`): wraps `React.lazy`. On chunk-load failure, calls `scheduleOneTimeChunkReload` once per session, returns a pending promise.
- **Tier-1B** (`src/main.tsx:267,412`): global `window.error` + `unhandledrejection` listener. Same path — `looksLikeChunkLoadFailure` → `scheduleOneTimeChunkReload` (cache-busting reload via `cacheBustingReload`, after unregistering the SW).
- **Tier-2** (`src/components/ErrorBoundary.tsx:145-188`): if both Tier-1s fail and React Suspense re-throws into the boundary, escalates to a second cache-bust + SW-unregister, then a calm Vietnamese "Đang cập nhật Mercy Blade" screen. After Tier-2 also fails, shows a manual-retry CTA.

**User experience:** never a dark crash screen. Either a transparent reload (Tier-1) or the calm "updating" screen for ≤1 sec then auto-reload (Tier-2).

**Sentry behavior (`sentryInit.ts:856-868`):** `enrichEventTags` matches `looksLikeChunkLoadFailure` and rewrites the event:
- `chunkRecovery=attempted` → `event.level = "warning"`, `priority=P3` (Tier-1 fired, recovery in progress)
- `chunkRecovery=exhausted` → `event.level = "error"`, `priority=P1` (Tier-2 also failed — real tail)
- Distinct `fingerprint` so the warning-volume doesn't drown the small error tail.

**Net status:** the 3 occurrences in the Sentry inbox are tagged `attempted` (most likely) and already downgraded. The screenshot showing them as P1-color is a Sentry UI default that ignores `priority` — they're already at `warning` level in event payload.

**Classification: 🟢 HANDLED-BUT-NOISY.** Recommendation: optional **Sentry-side inbox filter** by `priority:P3` or `level:warning` so the inbox is only P1+. No code change.

If any of the 3 carry `chunkRecovery=exhausted` → they'd be real users stuck on stale HTML through two failed reloads (offline, CDN purged the deployed chunk, etc.) — that would warrant a separate dispatch to investigate the Tier-2 escape path. **Chau-operator step:** open one of the 3 events, check the `chunkRecovery` tag.

### Pattern 2 — `TypeError: Importing a module script failed` — 🟢 HANDLED-BUT-NOISY

Same root cause as Pattern 1. `looksLikeChunkLoadFailure` matches `"importing a module script failed"` substring (`src/lib/chunkLoadError.ts:14`). Same Tier-1/Tier-2 handling, same Sentry downgrade.

**Classification: 🟢 HANDLED-BUT-NOISY.** No code change.

### Pattern 3 — `AbortError: Lock was stolen by another request` — 🟡 PARTIAL-HANDLER (A17 owns)

**Mechanism:** Web Locks API steal — a newer tab/client took the auth lock from this one. Designed cross-tab behavior; the older tab should yield silently.

**Existing handlers:**

- **`supabaseClient.ts:168-186`**: `createAuthLock()`'s catch block matches the AbortError + steal message and silently resolves (the older tab yields without propagating).
- **`ErrorBoundary.tsx:68-74,116-135`**: `isAuthLockAbortError()` catches anything that escapes Layer-1, forces a clean remount via `authLockRecovery` key, captures as `level: "warning"` for frequency tracking.

**Sentry behavior:** explicit `captureError(... level: "warning")` from the ErrorBoundary recovery path. The events ARE intentional ops-signal beacons, not crash reports.

**Variant escaping today:** A17 dispatch (per A14c dispatch note "A17 is fixing this variant") suggests there's a substring or call-path variant that escapes the existing matchers. A14c **defers** to A17 — touching this in parallel would race.

**Classification: 🟡 PARTIAL-HANDLER.** A17 owns. A14c does NOT open a fix PR here.

### Pattern 4 — `NotFoundError: Failed to execute insertBefore` — 🟡 PARTIAL-HANDLER ✏️ **FIX CANDIDATE**

**Mechanism:** React-DOM tries to insert a node into a parent whose child list a third-party extension (Google Translate, Grammarly, etc.) has rewritten out-of-band. The exception fires inside our `react-*.js` chunk but the bug is in the extension.

**Existing handler (`sentryInit.ts:504-526`):**

```ts
const DOM_MUTATION_NOISE_MESSAGE_RE =
  /removeChild|The object can not be found|NotFoundError/i;
const REACT_BUNDLE_RE = /\breact-[^/\\]+\.js\b/i;

// AND-gated: top frame in react-*.js AND message matches regex → drop event.
```

The existing regex catches:
- `removeChild` — the most common Translate-extension symptom
- `The object can not be found` — the long-form WebKit-flavored message
- `NotFoundError` — the literal DOMException name

It does NOT catch the `insertBefore` family. The browser-emitted message for that case is `"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."` — none of the three alternatives match.

`Error.name` IS `"NotFoundError"`, but `event.exception.values[0].value` in Sentry is the **message** (not name+message concat). So `/NotFoundError/i` against the message doesn't fire on `insertBefore` events.

**User experience today:** unhandled → ErrorBoundary crash screen (dark Vietnamese-labeled stack dump). Not a calm recovery.

Wait — does it actually reach the crash screen? Let me re-check `looksLikeDomMutationExtensionNoise` — it's a Sentry `beforeSend` filter (drops the EVENT), not an ErrorBoundary catcher (doesn't suppress the React render error). So even with the regex widened, the React render still crashes. The Sentry filter only stops the **event** from reaching Sentry.

So the actual user impact today:
- React render crashes due to extension DOM mutation → ErrorBoundary catches → dark crash screen shown
- The event reaches Sentry because the existing regex doesn't match `insertBefore`

Widening the regex would:
- Stop the noisy Sentry beacon
- NOT improve the user experience (still dark crash screen)

To improve user experience, we'd need to add `insertBefore` detection to `ErrorBoundary` and trigger a silent remount (similar to auth-lock recovery). That's a bigger change with risk of masking real bugs.

**Recommended scope for A14c-fix-1:** widen the regex ONLY (suppress the Sentry noise). The user-experience side is a separate follow-up if frequency justifies it.

**Fix sketch (~3 lines):**

```ts
const DOM_MUTATION_NOISE_MESSAGE_RE =
  /removeChild|insertBefore|The object can not be found|NotFoundError/i;
```

Plus 1-2 new test cases in `sentryInit.test.ts` (mirroring the existing `removeChild` test).

**Classification: 🟡 PARTIAL-HANDLER.** Fix is one regex alternation + tests. **A14c will ship this as a follow-up PR.**

---

## 2. Coordination notes

- **A17 (auth-lock substring widening):** in flight per dispatch context. A14c skipped Pattern 3's fix entirely. If A17 changes `isAuthLockAbortError` or adds a `looksLikeAuthLockSteal` matcher to the Sentry `beforeSend` filter, those land in A17's PR, not A14c.
- **ErrorBoundary central logic:** A14c constraint per dispatch explicitly says don't touch it. The proposed `insertBefore` widening is in `sentryInit.ts`'s `DOM_MUTATION_NOISE_MESSAGE_RE` — Sentry filter, not the boundary.
- **PRINCIPLES §3 one-bug-per-PR:** the audit is one PR (this doc). The regex widening is a separate, scoped PR.

---

## 3. Volume reduction estimate

If the chunk-load events are mostly `chunkRecovery=attempted` (warning-level), the Sentry **inbox** at default severity-error filtering would already drop them. Real inbox-volume reduction depends on whether Chau's view shows warnings:

| Action | Estimated inbox drop |
|---|---|
| Chau filters inbox to `level:error` only | 60-70% (drops the 4 warning-level chunk-load entries) |
| Ship A14c-fix-1 (widen regex to include `insertBefore`) | additional 5-10% (the 1 insertBefore beacon) |
| A17's auth-lock widening | additional 5-10% (the 1 auth-lock variant) |
| Combined (filter + A14c-fix-1 + A17) | 70-90% noise reduction |

The volume math depends heavily on whether Chau's screenshot showed all 6 issues or only the most recent — the dispatch said 6+ unresolved, so this is a conservative estimate.

---

## 4. Recommended Phase-2 dispatch

**ONE follow-up PR:** `feat(sentry): widen DOM-mutation noise filter to include insertBefore (A14c-fix-1)`

Touches:
- `src/lib/monitoring/sentryInit.ts:504-505` — add `insertBefore` to the regex alternation
- `src/lib/monitoring/__tests__/sentryInit.test.ts` — add a positive test case (insertBefore message → filtered) and a negative case (insertBefore in a non-react bundle → not filtered)

**Diff: ~5 lines.** Gates: typecheck, lint, full test suite.

**Not P0.** Defers naturally to "next session" if Chau prefers; this is noise-volume work, not a user-facing bug. But it's small enough to ship in the same A14c chain.

---

## 5. Things I deliberately did NOT do

- **Touched `ErrorBoundary.tsx`:** dispatch constraint. The boundary's central logic + chunk-recovery state machine are correct and tested.
- **Added Sentry-side `beforeSend` for chunk-load:** the existing `enrichEventTags` already routes by `chunkRecovery` tag; adding a hard drop would lose the volume-tracking signal entirely. Better to filter Sentry inbox client-side.
- **Touched the auth-lock matchers:** A17 owns. Even a `insertBefore`-style widening of `isAuthLockAbortError` would race A17.
- **Investigated the underlying React-DOM/extension interaction:** the root cause is third-party (Translate / Grammarly / similar). No fix is possible from inside our page; the Sentry filter is the only available action.

---

## 6. References

- `src/lib/chunkLoadError.ts` (matcher source-of-truth)
- `src/lib/lazyWithRetry.ts:65` (Tier-1A)
- `src/main.tsx:267,412,449` (Tier-1B)
- `src/components/ErrorBoundary.tsx:68-74,116-188` (auth-lock + Tier-2)
- `src/lib/monitoring/sentryInit.ts:504-526` (DOM mutation filter — fix target)
- `src/lib/monitoring/sentryInit.ts:856-868` (chunk-recovery downgrade)
- `src/lib/chunkReload.ts` (cache-busting reload)
- `src/lib/swRecovery.ts` (SW unregister)
- A14 sourcemap audit PR #892
- A14 release pin PR #901
- A17 (parallel agent, auth-lock variant — coordinate)
