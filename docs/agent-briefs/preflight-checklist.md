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

## Premise Correction Protocol (receiving-agent side)

Everything above is for the dispatch-writer, *before* the brief goes out. This
section is for the agent who finds the stale claim *after* the brief arrives —
the safety net that [For_Chau_Study.md](../For_Chau_Study.md) Lesson 9 ("agent
ground-truth beats brief narrative") is counting on. About 1 in 3 briefs needs
this; it is routine, not an escalation. Premise correction is a distinct move
from the writer-side verification above: the writer *prevents* a stale claim;
the receiving agent *catches one that got through* and has to decide what to do
about it without a second dispatch round-trip.

### When a discrepancy is a premise correction

You have a premise correction the moment **you read X in current
`origin/main` and the brief asserts not-X as the basis for the work**. It
almost always sits in one of three loci — check these first:

- **(a) Claims about prior work / "what's already done."** *"PR #N is
  redundant", "table T already has column C", "this shipped in #M".*
  (A97/#743: the brief called the PR redundant; it was the **only** fix for the
  docs-side gap. A31/#717: "add a new unsubscribe table" — already shipped on
  `profiles`, 3 wired consumers. A72/#754: the briefed CHECK set was wider than
  the real one. B15: `billing_mrr_inputs_v` "timestamp collision" was a
  sequential dead-vs-canonical view, not a race.)
- **(b) Claims about code-path liveness.** *"route R is the funnel", "widget W
  is mounted", "X consumes Y".* (B1/#763: `/mercy/chat` had zero inbound links
  anywhere in `src` — an orphan, not a funnel. Same class: M2-sweep and
  companion-widget "critical-path" components with zero mounts.)
- **(c) Claims about user / architectural framing.** *"Option A is ~20 LOC",
  "this is a thin wrapper", "the table is too thin".* (B1/#763: "Option A ≈ 20
  LOC" was a ~150–400-LOC central refactor. A96: "the table is too thin" was a
  deliberate idempotency design, not a defect.)

A tone, a label, or a non-load-bearing aside is **not** a premise correction —
fix it in passing and move on. A premise correction is specifically a *false
factual basis the planned work rests on*.

### How to flag it

1. **Verdict-correction on the first line of the report**, before any work
   product: `Verdict-correction: brief assumed X; current main shows Y.` This
   is the same lead-with-the-verdict discipline the recon-doc convention
   requires of its Verdict section
   ([recon-doc-convention.md](./recon-doc-convention.md) §2 — "Lead with it; no
   preamble"). Do not bury it in paragraph three.
2. **Evidence inline, not narrated.** Paste the command and its one-line output
   that proves Y — `git ls-files | rg <file>` (empty), `gh pr view <N> --json
   state` (`OPEN`), the migration line. The reader must not have to re-run
   anything to believe the correction (same bar as the recon-doc Evidence
   section).
3. **Carry it into the PR body.** A dispatch-driven PR whose premise was
   corrected states the correction in its body — see the PR-body template's
   mandatory premise-correction section (B31, PR #777, in-flight as of
   2026-05-19; forward reference, same convention this directory's INDEX uses
   for unmerged siblings).

### Stop vs. proceed — the rule of thumb

> **Stop and ask Chau if the correction changes the scope or the risk.
> Proceed on the corrected understanding if it only refines.**

- **Refines → proceed (report it, don't wait).** Same deliverable, same blast
  radius; the brief just narrated a detail wrong. Counts-vs-examples
  disagreements, a misnamed line number, a cross-ref that points at an in-flight
  PR. Do the work against ground truth and note the correction in the report.
- **Changes scope or risk → stop, author the work product apply-ready,
  recommend, ask.** The corrected premise makes the briefed deliverable
  impossible, collision-prone, or materially larger/riskier: the target file
  is not on `main` (a same-name ADD off `main` collides with the upstream PR —
  the squash-orphan trap, #595/#596→#597), "~20 LOC" is a central refactor,
  the "redundant" PR is the only fix, an `src/`-only change now needs
  `ios/`/`android/` edits. An upfront "push + PR authorized" does **not**
  override this — authorization assumes the briefed premise held.

The asymmetry is deliberate. Proceeding on a *refinement* costs one sentence in
the report; proceeding on a *scope change* ships a wrong or colliding PR that
costs re-lands (the i18n fix took three: #595/#596→#597). When you cannot tell
which side a correction is on, treat it as scope-changing — the downside is one
question, not three PRs. This is the agent-side mirror of "When you cannot
verify in 60 seconds": demote, don't guess.

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
| File location + PR/branch state (this section's own brief) | "extend `docs/agent-briefs/preflight-checklist.md`, branch off `origin/main`" | The file is not on `main`; it is B8 **PR #764 (OPEN)**. A same-name ADD off `main` collides with #764 — failed checklist rows 3 & 4 — **B49** (this PR, held draft gated on #764) |

Pattern: any brief sentence stating a strong fact about repo or prod state has
about a 30% chance of being stale. The sweep above is the cheapest insurance
against acting on the stale 30%.
