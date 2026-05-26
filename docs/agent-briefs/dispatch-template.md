# Dispatch-Brief Template — the structure every brief must carry

> Status: living convention. Established by B44 (2026-05-19) after B34's
> not-recoverable audit found B21, B12, and A94 each repeated A77's
> evidence-loss pattern **after** the recon-doc convention already existed.
> The convention was not the gap; **the dispatch brief not enforcing it**
> was. This doc moves enforcement out of agent discipline and into the
> brief skeleton itself. Sibling of
> [preflight-checklist.md](./preflight-checklist.md) (B8),
> [recon-doc-convention.md](./recon-doc-convention.md) (B16),
> [sql-remediation-convention.md](./sql-remediation-convention.md) (B29),
> and [pr-body-template.md](./pr-body-template.md) (B31). Indexed in
> [INDEX.md](./INDEX.md).

## The problem this solves

A convention that lives in a doc but not in the brief is a convention that
depends on the receiving agent already knowing it. That dependency failed
repeatedly:

- B16 codified the recon-doc convention (commit the verdict, or it dies with
  the worktree). It is correct and complete.
- **B21, B12, and A94 still lost diagnostic output the same way A77 did** —
  *after* B16 shipped. None of their briefs contained the line that would
  have forced the commit. Each agent did exactly what its brief said; the
  brief just never said "commit the recon doc."

The lesson is not "write better conventions." It is
[For_Chau_Study.md](../For_Chau_Study.md) **Lesson 11 — stacked silent
failures** (B33, PR #775, in-flight): a known failure class keeps recurring
when the safeguard exists but nothing in the workflow makes it non-optional.
The fix is structural: the dispatch-writer (Claude) owns the brief, so the
enforcement clause belongs in the brief template the dispatch-writer uses —
not in a doc the agent may never read.

This template is that structure. **Filling it out is how the dispatch-writer
discharges Lesson 11.** Per-task-type, the MANDATORY clauses below are
copied into the brief verbatim — not summarized, not assumed.

## The dispatch-brief skeleton

Every brief has these blocks, in this order. Bracketed parts are filled per
dispatch; the MANDATORY clauses (§ Task-type matrix) are pasted verbatim for
the brief's type.

```
To <AGENT-ID>

LABEL FOR TERMINAL TITLE: <AGENT-ID>
Start every report with: <exact prefix, e.g. "Chau — Report from B44">

<one-paragraph problem statement: what is wrong / unknown, and why now>

TASK TYPE: <IMPLEMENTATION | DIAGNOSTIC | SCOPING | META | CLEANUP>
<paste the MANDATORY clause(s) for this type — verbatim, from §matrix>

PRE-FLIGHT (dispatch-writer ran these; results inlined OR demoted to
"agent: verify against current origin/main before acting"):
<the 5-command sweep results, or the demotion instruction — see §preflight>

Steps:
1. Worktree: git worktree add /private/tmp/<AGENT-ID>-<slug> \
     -b <agent-id>/<slug> origin/main
2. sleep $((RANDOM % 60)) before npm ci   (jitter avoids concurrent-agent
   npm collisions; or symlink the shared gitignored node_modules read-only
   for docs-only/no-dep tasks — never `npm install` the shared repo)
3..N. <the actual work, smallest-safe-diff first>

Gates: <typecheck:ci | lint | build | test — name the ones that apply>
Labels: <A92 failure-class label(s) + process label(s) — see §labels>
Worktree disposition: <pruned | hold-for-followup <dispatch> | blocked-on <X>>
Authorized: <push + PR open upfront  |  HOLD for Chau go — no autonomous exec>

Report format: <PR # + URL | recon-doc path + SHA | scoping verdict + options>
```

## Pre-flight verification block

The dispatch-writer runs this **before sending the brief**. Authority and
full method: [preflight-checklist.md](./preflight-checklist.md) (B8) — this
is the 5-command operational core, not a restatement of B8's reasoning,
evidence table, or demote rule. Read B8 for *why*; run this for *what*.

Always first (universal):

```bash
git fetch origin --quiet
git log origin/main --oneline -40 | rg -i '<brief topic keyword>'   # already shipped? → brief moot, stop
```

Then, only the rows whose claim type the brief actually makes:

```bash
# 1. Schema / data-shape   — newest migration wins, not memory
rg -ln '\b<table>\b' supabase/migrations -g'*.sql' | sort | tail -3
# 2. Code-path liveness    — 0 non-router/non-test hits = dead code, not a funnel
rg -n "from ['\"].*<module>|import .*<module>" src --type ts --type tsx | rg -v '__tests__|\.test\.'
# 3. File location         — empty = file does not exist
git ls-files | rg -i '<filename>'
# 4. PR / branch state     — did the commit truly land on main?
gh pr view <N> --json state,mergeable,mergeStateStatus,headRefOid,baseRefName
# 5. Test coverage         — a test must exercise the behavior, not just compile
rg -ln '<symbol>' $(git ls-files '*test*' '*.test.*' '*spec*')
```

Any load-bearing claim not VERIFIED by the matching command is **demoted to
an agent instruction** ("Brief assumes X; verify X against current
`origin/main` first, if false report and stop") — never asserted as fact.
This is [For_Chau_Study.md](../For_Chau_Study.md) **Lesson 9 — agent
ground-truth beats brief narrative**: the demotion is what makes the agent's
read the safety net by design instead of by luck. B8's full rule (including
counts-vs-examples and the one-session evidence table) governs; do not
duplicate it here.

## Task-type matrix — requirements per type

The dispatch-writer classifies the brief into exactly one type and pastes
that type's MANDATORY clause(s) into the brief **verbatim**. These clauses
are non-negotiable; they exist because the safeguard-without-enforcement gap
(§problem) is real and recurring.

| Type | What it is | MANDATORY clause(s) — paste verbatim into the brief |
|---|---|---|
| **IMPLEMENTATION** | Ships code/content through review→merge→deploy. | Gates `typecheck:ci` + `lint` + `build` green before commit; one PR per concern; PR body per [pr-body-template.md](./pr-body-template.md) (B31). |
| **DIAGNOSTIC** | Investigates a question, reaches a verdict; may produce no code. | **"Before terminal close, commit recon doc per `docs/agent-briefs/recon-doc-convention.md`. NO exceptions."** Six required sections; `reports/RECON-<topic>-<agent>.md`; commit-don't-PR (draft PR only if it is the spec for a follow-up build). Report states path **and commit SHA**. |
| **SCOPING** | Sizes/plans an approach for a human decision. | **Explicit hold-for-Chau-go: the agent produces options + a recommendation and STOPS. No autonomous execution of the chosen option.** Output is a scoping doc/recon doc, committed; the brief states the decision and the options, never buries them. |
| **META** | Changes process docs / the workflow itself (this doc's own type). | Docs-only; no repo code change; reference B8/B16/B29/B31 as authority, do not duplicate them; update [INDEX.md](./INDEX.md) if a new process doc is added. |
| **CLEANUP** | Removes dead code / artifacts / stale docs. | Confirm zero importers before deletion (`rg -n "from.*<module>" src`); restore-before-redesign; small logical commits; gated behind any in-flight PR that still references the target. |

Additional clause, **orthogonal to type — applies whenever the task may
produce prod-write SQL** (most often DIAGNOSTIC, but any type):

> **MANDATORY for SQL-producing tasks:** "Apply
> `docs/agent-briefs/sql-remediation-convention.md` to all prod-write SQL.
> Commit per B29 pattern." — `reports/REMEDIATION-<topic>-<agent>.sql`, all
> seven mandatory parts, PK-targeted not predicate, `BEGIN…ROLLBACK→COMMIT`
> wrapper, HANDOFF-ONLY header. There is **no unattended SQL path to this
> Supabase**; Chau applies once via the SQL Editor after human review. The
> report states the `.sql` path + SHA and does **not** claim it was applied.

## Labels block

Every brief names its labels using the **A92 failure-class vocabulary**
(authority: [INDEX.md](./INDEX.md) §1; definitions live in each
`gh label` description). Pick the class label(s) for the defect the dispatch
addresses, plus any process label:

- **Failure-class:** `silent-failure`, `dead-code`, `fake-green-test`,
  `coverage-gap`, `restore-before-redesign`, `stale-audit-note`,
  `money-path`.
- **Process:** `follow-up`, `infra`, `testing`, `pre-launch`,
  `needs-authoring`, `legal`, `i18n`.

A brief acting on an audit note that current `main` has already overtaken is
the `stale-audit-note` class — label it, report the divergence, do not
silently follow the stale note (this brief's own label is `stale-audit-note`
for exactly that reason).

## Worktree disposition — state it explicitly

The brief ends with one explicit disposition so the periodic cleanup pass
knows whether the worktree is safe to remove (mirrors the recon-doc
convention's required "Worktree disposition" section):

- `pruned` — work fully captured in the PR/commit; worktree disposable.
- `hold-for-followup <dispatch>` — a named next dispatch needs this tree.
- `blocked-on <X>` — kept until X (a merge, a Chau decision) resolves.

Silence here is the default failure: an unstated disposition is how
worktrees (and the uncommitted evidence in them) get pruned by surprise.

## Related

- [preflight-checklist.md](./preflight-checklist.md) (B8) — the 5-command
  sweep's full method, demote rule, and one-session evidence table. **The**
  authority for the pre-flight block above.
- [recon-doc-convention.md](./recon-doc-convention.md) (B16) — what the
  DIAGNOSTIC MANDATORY clause points at: file path, six sections,
  commit-don't-PR. The authority, not duplicated here.
- [sql-remediation-convention.md](./sql-remediation-convention.md) (B29) —
  what the SQL-producing MANDATORY clause points at: seven parts,
  PK-targeting, the `BEGIN…ROLLBACK` wrapper. The authority.
- [pr-body-template.md](./pr-body-template.md) (B31) — the IMPLEMENTATION
  PR-body structure.
- [INDEX.md](./INDEX.md) — the process-doc map and the A92 label set.
- [For_Chau_Study.md](../For_Chau_Study.md): **Lesson 11** (stacked silent
  failures — B33, PR #775 in-flight: why a safeguard that exists but isn't
  enforced keeps failing — the reason this template exists), **Lesson 10**
  (a recon doc is the commit, not the file — the DIAGNOSTIC clause makes
  this non-optional at dispatch time), **Lesson 9** (agent ground-truth
  beats brief narrative — why unverified claims are demoted, not asserted).
- CLAUDE.md → "Operating discipline" (small diffs over smart diffs;
  checkpoint every risky step; permissions are product logic) is the
  *policy*; this template is the *shape* that makes the policy enforceable
  at the moment a brief is written.
