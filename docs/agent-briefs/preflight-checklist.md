# Brief Preflight Verification Checklist

Run this **before sending a dispatch brief to an agent**. It is for the
dispatch-writer (Claude), not the receiving agent.

## Why this exists

Across a single multi-agent session, roughly **1 in 3 briefs carried a
load-bearing factual claim about the repo or prod that was already stale** by
the time the agent opened it. Briefs are written from session memory, audit
notes in `/private/tmp/*.md`, or another agent's report — all of which go stale
the moment `main` moves. This is the operational layer beneath
[For_Chau_Study.md](../For_Chau_Study.md) Lesson 4 ("verify against current
main, not stale audit notes"): that lesson says *verify*; this checklist says
*how, in under 60 seconds*.

## The rule

Every sentence in a brief that asserts a fact about the code, schema, or PR
state is a **claim**. Before the brief goes out, each load-bearing claim must be
in one of two states:

- **VERIFIED** — you ran the command below and pasted the one-line result into
  the brief, or
- **REWRITTEN AS AN INSTRUCTION** — the brief tells the agent
  *"verify X against current `origin/main` before coding; if stale, stop and
  report"* instead of asserting X as settled fact.

Never ship a brief whose plan depends on an unverified factual claim stated as
fact. A wrong premise stated as fact sends the agent down a path; the same
premise stated as "verify first" makes the agent your safety net.

Always start the sweep with the two universal preflights:

```bash
git fetch origin --quiet
git log origin/main --oneline -40 | rg -i '<brief topic keyword>'   # already shipped?
```

If the topic already merged, the brief is moot — stop here.

## The 5 claim types and their 60-second verification

> Run only the rows whose claim type your brief actually makes. Most briefs
> touch 1–2 categories, so the real cost is ~15–30s, not 60.

### 1. Schema / data-shape claim
*"table `X` has column `Y`", "view `V` joins on `Z`", "the CHECK allows A|B"*

No prod `psql` is available to agents (no unattended catalog path). The source
of truth is the migration set, latest-wins:

```bash
rg -n '(create table|alter table|create .*view|add column|check ).{0,60}\b<table>\b' \
   supabase/migrations -g'*.sql' | tail -20
rg -ln '\b<table>\b' supabase/migrations -g'*.sql' | sort | tail -3   # newest authority
```

Read the newest matching migration, not memory. *(A72/#754: the real
`system_logs` CHECK set, not the briefed one, bounded the RPC. The Stripe MRR
miss / #700: a view `LEFT JOIN`ed a renamed column — invisible until the schema
was actually read.)*

### 2. Code-path liveness claim
*"`X` is a live consumer of `Y`", "route `R` is a signup funnel", "this widget
is mounted"*

```bash
rg -n "from ['\"].*<module>|import .*<module>" src --type ts --type tsx | rg -v '__tests__|\.test\.'
rg -n '<RouteOrSymbol>' src --type ts --type tsx | rg -v 'router/|routes\.tsx'   # 0 → orphan/dead
```

Zero non-router, non-test hits = dead code or an orphan route — not a funnel.
*(B1/#763 vs A89/#759: `/mercy/chat` had zero inbound links anywhere in `src`;
the brief treated it as a reachable funnel. Same class: M2-sweep and
companion-widget "critical-path" components that turned out to have zero
mounts.)*

### 3. File-location claim
*"`X` lives at `path/P`", "AppRouter line 27 lazy-loads mercy-guide"*

```bash
git ls-files | rg -i '<filename>'                 # empty → file does not exist
rg -n '<symbol>' <claimed/path/file.tsx> | head   # symbol actually there?
```

*(A21: briefed `AppRouter:27 = mercy-guide`; line 27 was a 0-byte type-only
import. A70: "clean up the flag system" — no `featureFlags.ts` file existed.)*

### 4. PR / branch-state claim
*"PR #N is mergeable / superseded / already merged / has conflicts"*

```bash
gh pr view <N> --json state,mergeable,mergeStateStatus,headRefOid,baseRefName
git branch -r --contains <sha> | rg 'origin/main'   # did the commit truly land on main?
gh pr list --state all --search '<topic>'            # superseded by a newer PR?
```

A brief that stacks new work on a branch already squash-merged orphans the
stack off `main` (cost the i18n fix 3 re-lands, #595/#596→#597). Confirm the
base SHA is on `main` before briefing "stack on top of #N".

### 5. Test-coverage claim
*"`X` is covered by tests", "gates are green on main"*

```bash
rg -ln '<symbol>' $(git ls-files '*test*' '*.test.*' '*spec*')   # any test references it?
```

"Covered" means a test exercises the behavior, not that a file with the name
exists and compiles (compile ≠ runtime-verified). And before declaring
"main is RED": a stale symlinked `node_modules` produces a false module-not-found
— reproduce with a clean `npm ci` in an un-symlinked tree first.

## When you cannot verify in 60 seconds

Do not delete the claim and do not assert it anyway. Demote it: rewrite the
sentence as an explicit agent instruction —
*"Brief assumes X. Verify X against current `origin/main` first; if X is false,
report and stop before coding."* The agent's ground truth then beats the
brief's narrative by design instead of by luck.

## Counts vs. examples

When a brief gives both a count and named examples and they disagree
("~9 hardcoded strings" + 5 named files), the **named examples are the intent**;
the count is an estimate. Scope to the verified examples, not the number.

---

## Evidence — briefs corrected within one session

| Claim type | Brief said | Ground truth (who caught it) |
|---|---|---|
| Schema / data-shape | system_logs / login_attempts write path & shape | Real table CHECK set + the deferred-decision context bounded the fix — **A72 #754** (also A77) |
| Code-path liveness | `/mercy/chat` is a reachable feedback funnel, Option A ≈ 20 LOC | Orphan route, zero inbound links; LLM hard-401s anon, est. off by 10× — **B1 #763** vs **A89 #759** |
| Redundancy / already-exists | "add a new `email_unsubscribe_tokens` table" | `profiles.email_unsubscribe_token` already shipped (#190), consumed by 3 wired fns — **A31 #717** |
| File location | "lazy-load mercy-guide at `AppRouter:27`" / "the flag system" | Line 27 was a 0-byte type import; no `featureFlags.ts` exists — **A21**, **A70** |
| PR / branch state | "stack on top of #N" | #N squash-merged → stack orphaned off `main`, 3 re-lands — **#595/#596 → #597** |
| Test coverage | "RLS verified" / "main is RED" | SQL-level only, no route-level e2e; "RED" was a stale symlinked `node_modules` false negative |
| Redundancy (perf) | "39 KB mercy-guide eager leak, lazy-load it" | Already closed by PR #636; the 39 KB was a misread shared chunk — **A46/A21** |

Pattern: any brief sentence stating a strong fact about repo or prod state has
about a 30% chance of being stale. The sweep above is the cheapest insurance
against acting on the stale 30%.
