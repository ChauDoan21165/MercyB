# Review — PR #864 (A18 PR1.5 — downgrade beacon) — structural / test-quality angle

**Reviewer:** A4 (third perspective — test quality + `sentry.ts` extension)
**Branch:** `review/864-structural-a4` (off `origin/main` @ `09d300525`)
**Subject:** [PR #864](https://github.com/ChauDoan21165/MercyB/pull/864) — `feat/a18-recompute-downgrade-beacon` — `feat(billing): A18 PR1.5 — downgrade beacon for recomputeEntitlement (A18 §7 row 6)`
**Author:** A18 track
**Companion reviews:** A8j (#868, billing-logic angle, APPROVE); A6k (structural angle, in flight)
**Date:** 2026-05-19

---

## TL;DR — VERDICT: ✅ APPROVE

`sentry.ts` extension follows the established safe-no-op pattern exactly. `recompute.ts`'s prior-state SELECT correctly uses `.maybeSingle()` (not `.single()`). The 5 transition cases are tested with full payload-shape assertions, not just call counts. No `SupabaseClientLike` duplication on main. All 26 tests pass against the PR branch's code.

CI snapshot: **7 pass, 1 pending** (Comment on PR — typical post-deploy lag). Build and Test (4m32s), Lint, Validate Rooms, Build Preview, Lighthouse Mobile, edge-function drift report, Vercel — all green.

---

## 1. `sentry.ts` — `addEdgeBreadcrumb` safe-no-op (brief check 1)

✅ **Verified.** Pattern match with `captureEdgeError`:

```ts
export async function addEdgeBreadcrumb(crumb: BreadcrumbOptions): Promise<void> {
  const sdk = await ensureInit();
  if (!sdk) return;                    // ← early-return when DSN unset
  try {
    sdk.addBreadcrumb({ … });
  } catch (err) {
    console.warn('[sentry-edge] breadcrumb failed', err);
  }
}
```

Three layers of "never throws from the helper":
1. `ensureInit()` returns `null` when `SENTRY_DSN` is unset; the early return makes the helper a true no-op
2. The actual `sdk.addBreadcrumb(…)` call is wrapped in `try/catch`
3. The catch handler logs to `console.warn` and returns normally — never re-throws

This matches `captureEdgeError`'s pattern (lines 156-186 of the original `sentry.ts` per the diff context). ✅

**Type-safety additions also clean:**
- `BreadcrumbOptions` interface exported, typed with required `category`+`message` and optional `level`+`data`
- `SentryShape` extended with `addBreadcrumb` carrying the exact Sentry SDK shape (`fatal | error | warning | info | debug` literal union)
- Default level `'info'` when caller omits — sensible

✅ Extension is API-compatible — purely additive to `SentryShape` and the module's exported surface; no existing callers can be broken.

---

## 2. `recompute.ts` — prior-state SELECT uses `maybeSingle()` (brief check 2)

✅ **Verified.** The R3 (prior entitlement) read uses `.maybeSingle()`:

```ts
const r3 = await supabase
  .from("entitlements")
  .select("is_premium")
  .eq("user_id", userId)
  .eq("app_id", appId)
  .maybeSingle();                       // ← NOT .single()
```

This is **critical and correct** because:
- `.single()` throws when 0 rows are returned (the typical first-write case where no prior entitlement exists yet)
- `.maybeSingle()` returns `{data: null, error: null}` cleanly on 0 rows
- A throw on the first-write case would crash the recompute, which would be wrong — the downgrade beacon is **observability, not correctness**

The handler also correctly **does not throw on r3.error**:

```ts
if (r3.error) {
  await captureEdgeError(r3.error, { … tags: { phase: "read-prior-entitlement", reason: opts.reason } });
  // Do NOT throw — proceed without prior-state knowledge.
} else if (r3.data) {
  priorIsPremium = (r3.data as { is_premium?: unknown }).is_premium === true;
}
```

Plus the first-write protection:
```ts
let priorIsPremium: boolean | null = null;  // default null
// …
if (priorIsPremium === true && row.is_premium === false) { /* fire beacon */ }
```

The `=== true` check (rather than truthy check) means `null` and `undefined` priorIsPremium values cannot trigger a spurious beacon. ✅

---

## 3. Test file — 5 transition cases with explicit assertions (brief check 3)

✅ **Verified.** The downgrade-beacon section (`describe("recomputeEntitlement — downgrade beacon (case 8 / PR1.5)")`) has exactly 5 tests covering:

| # | Case | Beacon expected? | Payload assertion |
|---|---|---|---|
| 1 | `active→inactive` | YES | Full `.category` / `.message` / `.level` / `.data` shape on breadcrumb + 5-field JSON.parse on console.info |
| 2 | `inactive→inactive` | NO | `not.toHaveBeenCalled` on both breadcrumb + console.info |
| 3 | `active→active` | NO | `not.toHaveBeenCalled` on both |
| 4 | First write (no prior row) | NO | `not.toHaveBeenCalled` on both |
| 5 | R3 read error | NO + warning | `captureEdgeError` called once with `tags.phase === 'read-prior-entitlement'` AND `tags.reason === opts.reason` |

The **active→inactive** test specifically asserts the breadcrumb payload shape (the brief's concern):

```ts
const [crumb] = addEdgeBreadcrumbMock.mock.calls[0];
expect(crumb.category).toBe("billing.downgrade");
expect(crumb.message).toBe(`entitlement downgraded: ${USER_ID} (stripe-webhook)`);
expect(crumb.level).toBe("warning");
expect(crumb.data).toEqual({
  userId: USER_ID,
  appId: DEFAULT_APP_ID,
  reason: "stripe-webhook",
});

const logged = JSON.parse(consoleInfoSpy.mock.calls[0][0] as string);
expect(logged.event).toBe("downgrade-beacon");
expect(logged.userId).toBe(USER_ID);
expect(logged.reason).toBe("stripe-webhook");
expect(logged.level).toBe("warning");
expect(logged.scope).toBe("recomputeEntitlement");
```

Not just `.toHaveBeenCalledTimes(1)` — it actually destructures the call args and asserts on each field of the breadcrumb + JSON-parses the structured log and asserts on each field. ✅

For "no beacon" cases (#2–4), `not.toHaveBeenCalled()` is the correct assertion (you can't check a payload that doesn't exist). For the R3 error case (#5), the captured error's `tags.phase` AND `tags.reason` AND `capturedErr === r3err` reference identity are all explicitly asserted. ✅

---

## 4. `SupabaseClientLike` duplication check (brief check 4)

✅ **No duplicate on main.**

```
grep -rEn "SupabaseClientLike|export interface .*Client.*Like" --include="*.ts" supabase/ src/
# (zero matches on origin/main)
```

The PR branch introduces exactly one declaration:

```
supabase/functions/_shared/entitlement/recompute.ts:109:export interface SupabaseClientLike { … }
```

#843 is closed (per brief), so no parallel branch is staging a competing declaration. When #864 lands, `SupabaseClientLike` will be a unique name in the repo — no merge conflict, no shadowing, no type ambiguity. ✅

---

## 5. Empirical verification — tests actually pass

Ran the PR branch's three files against vitest from a fresh worktree:

```
✓ supabase/functions/_shared/entitlement/__tests__/recompute.test.ts (26 tests) 6ms
Test Files  1 passed (1)
     Tests  26 passed (26)
```

**26/26 pass** in 6ms. Test count matches the structural breakdown: 1 idempotency + 3 injected-clock + 1 monotonic + 1 convergence + 4 failure-paths + 4 gift-inconsistency + 2 RPC-null + 5 downgrade-beacon + 5 surface = 26. ✅

---

## 6. Additional positive findings

Beyond the brief's checks, three deliberate engineering choices stood out:

1. **`addEdgeBreadcrumb` AND `console.info` are both fired in the downgrade path.** Breadcrumbs only attach to subsequent captured events in the same isolate — a recompute that succeeds (the normal case) wouldn't generate an event, so the breadcrumb alone would be invisible to Sentry. The structured `console.info` JSON gives standalone observability for log aggregation (e.g., Vercel logs, Supabase dashboard logs) regardless of whether Sentry sees anything. This is the right belt-and-suspenders shape for a downgrade beacon that needs to be discoverable post-hoc.

2. **`addEdgeBreadcrumb` is `await`ed in `recompute.ts`** — important because edge isolates tear down quickly after the response is sent, and a fire-and-forget breadcrumb could be lost. The helper's internal `try/catch` means awaiting is safe (no throw propagation).

3. **The R3 (prior-state) read happens AFTER R1 (subscriptions) and R2 (gifts) but BEFORE the RPC.** That ordering is intentional — if R1 or R2 fails, the recompute throws before we waste an entitlements read. The R3 read is also independent of derive (it only reads `is_premium`, not the rows that determine the new state), so it can fail without contaminating the new computation.

---

## 7. Caveats and risks (none blocking)

1. **`SupabaseClientLike` uses `any` return types.** The interface declares `from(table: string): any` and `rpc(fn: string, ...): any`. This is documented as a deliberate trade-off (`// deno-lint-ignore no-explicit-any` comment) and is justified because typing the full supabase-js fluent chain in a structural interface is hostile. The trade-off is acceptable — the structural typing's main job is to keep the module esm.sh-free for vitest, and the rest of `recompute.ts` doesn't depend on chain-call type narrowing.

2. **The downgrade beacon fires AFTER the RPC commit.** This means a successful downgrade write WILL emit the beacon, but if the function crashes BETWEEN the RPC and the beacon, the downgrade silently lands without observability. Edge cases this could miss: (a) network drop between RPC and beacon (rare); (b) a future code change inserts a throwing line between RPC and beacon. Mitigation: the R3 read happened BEFORE the RPC, so the priorIsPremium=true signal IS persisted to a captureEdgeError if any subsequent step fails — meaning the downgrade context survives via the Sentry error event even if the dedicated breadcrumb doesn't fire. Acceptable today.

3. **`opts.reason` is required.** The `RecomputeOptions` type makes `reason` non-optional. Callers MUST pass one of 6 enum values. Good — no anonymous "unknown" recomputes can sneak through. PR2 wiring needs to be careful to pass the right reason from each caller, but that's correctly scoped to PR2.

Neither caveat blocks this PR.

---

## 8. VERDICT — ✅ APPROVE

All 4 brief-mandated checks pass:

| Brief check | Status |
|---|---|
| `addEdgeBreadcrumb` is safe-no-op when DSN unset (same pattern as `captureEdgeError`) | ✅ verified — 3 layers of defense |
| Prior-state SELECT uses `.maybeSingle()` (not `.single()`) | ✅ verified at line 1001 of diff |
| 5 transition cases tested with explicit payload assertions (not just call counts) | ✅ verified — active→inactive case asserts 4 breadcrumb fields + 5 log fields; "no beacon" cases use `not.toHaveBeenCalled`; R3 error case asserts `tags.phase` + `tags.reason` + error identity |
| No duplicate `SupabaseClientLike` on main (since #843 closed) | ✅ verified — zero pre-existing declarations |

Plus empirical confirmation: 26/26 tests pass against the PR branch in <10ms.

The change is well-scoped: 3 files, +1122/-0, all additive. No existing call site touched, no manifest change, no migration. Aligns cleanly with A18 §7 row 6's downgrade-beacon spec and the established `_shared/sentry.ts` conventions.

---

## References

- [PR #864](https://github.com/ChauDoan21165/MercyB/pull/864) — the subject of this review
- [PR #868](https://github.com/ChauDoan21165/MercyB/pull/868) — A8j's companion review (billing-logic angle, APPROVE)
- A6k's structural review (in flight per brief)
- [PR #843](https://github.com/ChauDoan21165/MercyB/pull/843) — A18 PR1 (CLOSED per brief — context for the duplicate-declaration check)
- [PR #789](https://github.com/ChauDoan21165/MercyB/pull/789), [PR #832](https://github.com/ChauDoan21165/MercyB/pull/832) — the schema + RPC prerequisites the prod dispatch is hard-gated on
- `supabase/functions/_shared/sentry.ts` — the file extended by this PR
- `supabase/functions/_shared/entitlement/entitlement.ts` — the single derive owner imported by `recompute.ts`
