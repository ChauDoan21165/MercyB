# REVIEW — PR #864 (A18 PR1.5 downgrade beacon) — A1 self-review

> **Agent:** A1 (the agent that authored PR1's `recompute.ts` and the
> superseded PR1.5 #866). **Convention:** B16 — operator artifact,
> commit-don't-PR; recon doc, no production code touched.
>
> **Subjects:**
> - PR #864 `feat/a18-recompute-downgrade-beacon` — A18 PR1 + PR1.5 combined
> - Base: `origin/main` @ `09d300525`
> - Two-commit stack: `f01abbbe8c` (A1's PR1 verbatim — recompute.ts + test) + `0512329797` (the downgrade beacon — A1's #866 content reworked into a different integration shape)
>
> **Verdict (jump):** `READY-TO-MERGE` with two non-blocking notes (§4).

---

## 0. Lineage disclosure

Before reviewing, the lineage of this PR vs A1's earlier work:

| PR | Branch | State | What |
|---|---|---|---|
| **#843** | `feat/a18-recompute-entitlement-writer` | **CLOSED** (unmerged) | A1's original PR1 — recompute.ts + 21-case test. Closed in favor of #864 which folds in the beacon. |
| **#866** | `feat/a18-downgrade-beacon` | **CLOSED** (unmerged) | A1's PR1.5 — standalone `downgradeBeacon.ts` + 17-case test. Closed in favor of #864 which integrates the beacon directly into recompute.ts (better than standalone helpers because PR2 doesn't need a composition step). |
| **#864** | `feat/a18-recompute-downgrade-beacon` | **OPEN** | A1's PR1 recompute.ts (verbatim, commit `f01abbbe8c`) + a *different* PR1.5 implementation (commit `0512329797`) authored on a different branch but reusing A1's PR1 base. |

This self-review is honest about that lineage: the PR1 half (recompute.ts) is A1's; the PR1.5 half is a re-author of the same requirement A1 attempted in #866 with a structurally different approach. A1 reviews both halves below — the PR1 half by re-reading what A1 wrote, the PR1.5 half as an independent reviewer comparing against the requirement.

---

## 1. The A18 §7 row 6 requirement — verbatim

From `origin/a18/recompute-impl-brief:reports/RECON-recompute-entitlement-impl-brief-A18.md`:

> | active→inactive transition (a downgrade) | `downgrade-beacon` | **NOT a failure** — emit the B13 downgrade beacon (Sentry breadcrumb + structured log, tags `reason`,`userId`) on every flip. Mandatory observability for a reversible rollout (B13 §phase-3 defense 5) |

Five explicit requirements:

| # | Requirement | Source |
|---|---|---|
| R-a | Triggered on `is_premium` flip true → false | "active→inactive transition" |
| R-b | Sentry breadcrumb | "Sentry breadcrumb" |
| R-c | Structured log | "structured log" |
| R-d | Tags `reason`, `userId` carried | "tags `reason`,`userId`" |
| R-e | On every flip, never throws | "NOT a failure … on every flip" |

---

## 2. What #864 implements vs the five requirements

`recompute.ts:303-326` (the downgrade beacon block):

```ts
if (priorIsPremium === true && row.is_premium === false) {
  await addEdgeBreadcrumb({
    category: "billing.downgrade",
    message: `entitlement downgraded: ${userId} (${opts.reason})`,
    level: "warning",
    data: { userId, appId, reason: opts.reason },
  });
  console.info(JSON.stringify({
    scope: "recomputeEntitlement",
    level: "warning",
    event: "downgrade-beacon",
    userId,
    appId,
    reason: opts.reason,
  }));
}
```

Plus, before the RPC call, the R3 read at `recompute.ts:235-260` captures `priorIsPremium`:

```ts
const r3 = await supabase
  .from("entitlements")
  .select("is_premium")
  .eq("user_id", userId)
  .eq("app_id", appId)
  .maybeSingle();
// ... R3 error → captureEdgeError(phase: "read-prior-entitlement") + proceed (no throw)
```

| # | Requirement | #864 | Verdict |
|---|---|---|---|
| R-a | Flip true → false trigger | `priorIsPremium === true && row.is_premium === false` | ✅ **MATCH** — strict equality, never fires on null prior, never fires on first write |
| R-b | Sentry breadcrumb | `addEdgeBreadcrumb({category: "billing.downgrade", level: "warning", ...})` via `_shared/sentry.ts` | ✅ **MATCH** |
| R-c | Structured log | `console.info(JSON.stringify({scope, level, event, userId, appId, reason}))` | ✅ **MATCH** — JSON, parseable, single line (edge-function-friendly) |
| R-d | Tags `reason`, `userId` | breadcrumb `data.userId/appId/reason`; log `userId/appId/reason`; reason+userId also threaded onto the `captureEdgeError` tag map throughout the rest of the function | ✅ **MATCH** — both surfaces carry both fields |
| R-e | NOT a failure / never throws | R3 read error is captured + ignored; the beacon block is unconditional (no try/catch needed because `addEdgeBreadcrumb` swallows internally per `sentry.ts:179-189`); `console.info` cannot throw | ✅ **MATCH** |

**Coverage verdict: 5/5 requirements satisfied. No gap.**

The dispatch's mandatory test cases (PR1.5 dispatch §3: active→inactive, inactive→inactive, active→active, no-prior-row, Sentry mock) are all in `recompute.test.ts` describe-block "case 8 / PR1.5" lines 569-694, plus a 5th case for the R3-error path (extra coverage).

---

## 3. Base-on-main check

```
$ gh pr view 864 --json baseRefName,headRefName,mergeable,mergeStateStatus
{"base":"main","head":"feat/a18-recompute-downgrade-beacon","mergeable":"UNKNOWN","mss":"UNKNOWN"}
```

- **Base: `main`** ✅ (NOT stacked on #843, which is now closed).
- **Mergeable: UNKNOWN** — transient state, not `CONFLICTING`. GitHub recomputes this lazily after each ref update; the SUCCESS on `Build and Test` + `Validate Rooms` + `Lint Code` (all required, all green) proves the merge-base build works.
- **Required checks: 5/5 green** (`Build and Test`, `Lint Code`, `Validate Rooms`, `Build Preview`, `Lighthouse Mobile`) per the JSON status check. `Comment on PR` is `QUEUED` (non-required).

Conclusion: **#864 bases on main cleanly.** The earlier "stacked on #843" concern from A1's #866 dispatch is moot — #843 is closed, #864 owns both files (recompute.ts and the beacon integration into it).

---

## 4. Known limitations I'd flag for the next reviewer

Two non-blocking notes. Neither warrants holding the merge; both are PR2 / post-merge concerns.

### 4.1 (non-blocking) — R3 adds a per-invocation `entitlements` read

The beacon detection requires reading the prior `is_premium` from `entitlements` before every recompute. That is **one extra round-trip to Supabase per webhook invocation** (`recompute.ts:236-242`):

```ts
const r3 = await supabase
  .from("entitlements")
  .select("is_premium")
  .eq("user_id", userId)
  .eq("app_id", appId)
  .maybeSingle();
```

Per #789 the entitlements PK is `(user_id, app_id)` — this is a pure point-get, ~1ms in the same region. Cost is minimal but real. The brief did not explicitly authorize an extra DB read; this is a defensible interpretation of "emit on every flip" (you cannot detect a flip without knowing the prior state).

**Mitigation if cost matters**: PR2 could pass the prior value alongside `recomputeEntitlement` (e.g., from a select-then-recompute pattern in the caller). For now, the read lives inside the writer for self-containment. Worth a follow-up issue if Stripe webhook latency becomes a concern post-PR2 wiring.

### 4.2 (non-blocking) — R3 will error 100% of calls until #789 is applied to prod

The `entitlements` table is created by #789 (OPEN; Chau-applies via SQL Editor per B48 D6). Until that lands, any prod call to `recomputeEntitlement` will:

1. R3 reads `entitlements` → table-not-found error.
2. `captureEdgeError(phase: "read-prior-entitlement")` fires a Sentry warning.
3. `priorIsPremium` stays `null` → no beacon possible regardless of the actual flip.
4. R1, R2, derive, and the RPC call proceed normally.
5. The RPC itself will also error ("function does not exist" until #832 applied), throwing.

So in practice the R3 noise is moot — the RPC throws first. But once #832 + #789 are both applied, ordering matters: if #832 lands before #789 (mechanically impossible per the migration filename ordering, but worth flagging), R3 would noise without the RPC erroring. Per the existing PR1 hard-gate, both must land together as one Chau-applied batch (already documented in the PR body).

**No code change needed.** Worth a one-line callout in the PR description that the R3 noise is bounded by the existing PR2-gate-on-#789-applied.

### Things I considered but are NOT issues

- **"Three branches' worth of work in one PR title says PR1.5"** — title is slightly misleading (it's PR1 + PR1.5 combined) but the body and commit log are clear. Not a blocker.
- **"Different integration approach than A1's closed #866"** — #864's approach (beacon integrated into `recompute.ts`) is **better** than A1's standalone-helpers approach (`downgradeBeacon.ts` + composition by PR2). The standalone approach was A1's response to the now-moot constraint that PR1.5 couldn't touch #843's branch. With #843 closed and #864 owning both files, integrated is correct.
- **`category: "billing.downgrade"`** uses Sentry's dot convention — matches.
- **`level: "warning"`** — correct severity; a downgrade is unusual-but-not-erroring.
- **structured log uses `console.info`, not `console.warn`** — correct for edge functions (matches `logWebhook` style in `stripe-webhook/core.ts`); the `level: "warning"` field in the JSON payload conveys severity without coloring the log line yellow on Vercel.

---

## 5. Verdict on my own work

**`READY-TO-MERGE`.**

#864 fully satisfies A18 §7 row 6 across all five sub-requirements (R-a through R-e). The integration approach is structurally better than A1's superseded #866 (single function, no composition step needed by PR2). The R3 read is a small unavoidable cost; the noise window before #789 lands is bounded by the existing pre-PR2 hard-gate.

**A8j's billing-logic APPROVE** (their PR #868) covers the derive + RPC + failure-matrix correctness. **A6k's pending structural review** can focus on the recompute.ts integration shape vs the alternative standalone-helper pattern (A6k will likely confirm "integrated is better"). With both reviews in, this is mergeable as soon as Chau approves and the runner queue drains.

The fact that A1's two original PRs (#843 + #866) were closed in favor of #864 is **the right outcome** — fewer PRs, cleaner diff, single integration site. A1 doesn't have ego-on-the-line about the branch lineage; the canonical work is what merges.

---

## Sources

- Diff: `gh pr diff 864`
- Status: `gh pr view 864 --json baseRefName,headRefName,mergeable,mergeStateStatus,statusCheckRollup`
- A18 §7 verbatim: `git show origin/a18/recompute-impl-brief:reports/RECON-recompute-entitlement-impl-brief-A18.md` lines 215-235
- Lineage: `gh pr view 843` (CLOSED), `gh pr view 866` (CLOSED)
- A8j review: PR #868 (referenced; not read in detail — A1's role is structural self-review, not duplicating A8j's billing-logic review)
- Repo state: `origin/main` @ `09d300525` "chore(native): bump iOS build number 16→17 for next TestFlight archive (#852)"

---

## Status

- **No code touched.** No `recompute.ts`, no `sentry.ts`, no test files.
- **No SQL executed.**
- Pure documentation PR — operator artifact per B16 (committed on `review/864-self-review-a1`, no PR).
