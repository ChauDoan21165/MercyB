# PR Body Template — for dispatch-driven PRs

> Status: living convention. Established by B31 (2026-05-19) after a ~50-PR
> multi-agent session shipped with no shared PR-body structure. Sibling of
> [preflight-checklist.md](./preflight-checklist.md) (B8) and
> [recon-doc-convention.md](./recon-doc-convention.md) (B16); indexed in
> [INDEX.md](./INDEX.md).

## The problem this solves

A session merged ~50 PRs. Their bodies were individually good and collectively
incoherent. An audit of 10 random merged PRs against 7 structural criteria
(What / Why / cites-dispatching-agent / recon-or-audit ref / labels line /
Verification / out-of-scope) found:

- **Only 2 of 10 carried a labels line.** The A92 failure-class vocabulary
  (`money-path`, `silent-failure`, `fake-green-test`, …) was applied in the
  *work* but not recorded in the *body*, so `gh pr list` triage can't see it.
- **Agent provenance was inconsistent.** Some bodies opened with "B5
  root-caused …"; others never named the dispatching agent or the audit, so
  the next session can't trace why the change was made.
- **Recon-doc / audit references were ad hoc.** #703 cited
  `dead-code-sweep-r2.md` by name and SHA; #748 referenced only an issue
  number; most cited nothing — defeating B16's whole point that the commit is
  the durable evidence.
- **Section names drifted.** `## What` / `## Why` / `## Summary` / a bare H2 /
  no header at all, all used interchangeably for the same role.

The fix is not "write more". The best bodies in the audit (#770, 7/7) were not
the longest — they were the ones where a future archaeologist could answer, in
order: *what changed, why, who sent it, was the premise true, is it proven,
what's deliberately left.* This template makes that order the default.

## The skeleton

Copy this. Delete the optional sections that don't apply to your PR class
(the matrix below says which). Keep the order — it is the reading order a
next-session agent needs.

```markdown
## What
<One line. The change, not the journey. "<verb> <thing> so <outcome>".>

## Why
<The bug, gap, or risk this closes. Lead with the symptom a human would
notice or the invariant at stake. Name the dispatching agent + audit here:
"B5 root-caused … as a class bug" / "A40's read-only sweep
`dead-code-sweep-r2.md` (@ <sha>)".>

## Premise correction        ← REQUIRED iff the brief's premise was stale
<"The dispatch asked for X. Ground truth: Y (verified against origin/main
@ <sha> / migration <file>). This PR does Y." Silently following a stale
brief is the failure this whole doc family exists to stop.>

## Root cause                ← REQUIRED for bug-fixes; omit for feat/chore
<The mechanism, separated by layer (loading / rendering / permissions /
data-shape / ownership / external) per CLAUDE.md operating discipline.
Quote real values — don't paraphrase the evidence.>

## What ships
<Table or bullets: file → change. One row per touched concern.>

## Verification
<Gates line with concrete counts and provenance:
`typecheck:ci ✓ · lint ✓ (0 errors) · test ✓ (N files / M tests) · build ✓`
"(fresh `npm ci` in worktree off origin/main @ <sha>)".>

### RED-then-GREEN           ← REQUIRED for money-path / auth / silent-failure
<Prove the test fails without the fix, with the exact assertion:
"Reverting the field order fails test #1: expected '…' to be '…'."
A test that's only ever been green proves nothing (`fake-green-test`).>

## Out of scope / Follow-up  ← REQUIRED for scoped fixes & dead-code sweeps
<What you deliberately did NOT do and why. Symmetric concerns, backfills,
parked buckets. The reader must not have to guess whether an omission was
an oversight or a decision.>

## Apply / Post-merge        ← REQUIRED for any migration or edge-fn change
<"Migration `<file>` applied by hand via Supabase SQL Editor post-merge
(NOT `supabase db push`) — project convention." / edge-fn deploy path.>

Labels: `label-a` `label-b`   ← REQUIRED, always — see §"Labels"

> Follow-up (out of scope, flagged): <one-line forward pointer if any>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Required vs optional, by PR class

The brief's failure class determines which conditional sections are mandatory.
"Optional" never means "omit silently" — it means "include only if it applies".

| Section | money-path / auth | bug-fix (non-money) | rls / migration | dead-code / cleanup | types / lint chore | feat (product) | docs / process |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **What** (1 line) | ● | ● | ● | ● | ● | ● | ● |
| **Why** (+ agent/audit) | ● | ● | ● | ● | ● | ● | ● |
| **Premise correction** | if stale | if stale | if stale | if stale | if stale | if stale | if stale |
| **Root cause** (by layer) | ● | ● | ● | ○ | ○ | ○ | ✗ |
| **What ships** | ● | ● | ● | ● | ● | ● | ● |
| **Verification** (gates) | ● | ● | ● | ● | ● | ● | lint+build only ¹ |
| **RED-then-GREEN** | **● MUST** | ● | ○ | N/A ² | ○ | ● behavior tests | N/A |
| **Out of scope / Follow-up** | ● | ○ | ○ | **● MUST** ³ | ○ | ● deferred sub-feat | ○ |
| **Apply / Post-merge** | if migration | ✗ | **● MUST** | ✗ | ✗ | if migration | ✗ |
| **Labels line** | ● | ● | ● | ● | ● | ● | ● |

● required · ○ recommended/if-applicable · ✗ omit · N/A not meaningful

¹ Docs-only PRs run `lint` + `build` and **state "docs-only, no code touched"**.
Do not fabricate a test count — `eslint` doesn't lint `.md`; pretending
otherwise is its own `fake-green-test`. (Exemplar: #768.)

² A pure deletion of a true orphan is a no-op for compiler/test/build — *that
green is the proof*. RED-then-GREEN is replaced by an **independent
cross-check** ("a separate Explore agent re-grepped all N basenames →
N/N clean") + per-batch green. (Exemplar: #703.)

³ Dead-code PRs MUST fence the blind-spots they did **not** touch (dynamic
imports, CI-synced trees, server-only graphs). An unscoped "deleted dead code"
is indistinguishable from a regression. (Exemplar: #703 "Explicitly out of
scope".)

## Cross-reference: B8 preflight ↔ this template

B8's [preflight-checklist.md](./preflight-checklist.md) is the **input** side —
the dispatch-writer verifies each load-bearing claim *before* sending. This
template is the **output** side — the PR body *reports how each claim
resolved against ground truth*. The five B8 claim categories map one-to-one
onto sections here:

| B8 claim type | Where it closes the loop in the PR body |
|---|---|
| **1. Schema / data-shape** | **Root cause** / **What ships** — state the *verified* schema, cite the newest migration (not the briefed sketch). e.g. #754: "`system_logs` has **no `category` column** (verified across every migration)". |
| **2. Code-path liveness** | **What** / **Why** — confirm the consumer/route is live; if it was an orphan, that becomes a **Premise correction**. |
| **3. File-location** | **What ships** — the *real* path touched, not the briefed one. |
| **4. PR / branch-state** | **Verification** provenance line — "off `origin/main` @ `<sha>`", "supersedes #N", base SHA confirmed on main. |
| **5. Test-coverage** | **RED-then-GREEN** — "covered" means the test fails without the fix, not that a named file compiles. |

The hinge: B8 found **~1 in 3 briefs carry a stale load-bearing claim**.
Therefore the **Premise correction** section is not a nicety — it is the
mandatory landing site for the 30%. A PR that quietly built on a stale brief
*and didn't say so* is the exact failure both docs exist to stop. When the
premise was stale, the body says so **and the PR carries `stale-audit-note`.**

## Cross-reference: recon docs (B16)

If a diagnostic dispatch produced a `reports/RECON-<topic>-<agent>.md`
([B16 convention](./recon-doc-convention.md)) and this PR implements its fix
recommendation, the **Why** section must cite it by path **and commit SHA**,
and the recon doc gets a `> SUPERSEDED by PR #NNN (date)` banner (B16 §4).
"Found in the audit" with no path is not a citation — #703 did this right
(`dead-code-sweep-r2.md` @ `6c8fb258`); most of the audited 10 did not.

## Labels

Always end the body with a `Labels:` line **and** apply the same labels with
`gh pr edit <N> --add-label`. The body line is the human-readable record that
survives even if labels are later re-triaged; the applied labels drive
`gh pr list` filtering. Use the A92 vocabulary verbatim:

- **Failure class** (apply the one the work *found*): `silent-failure`,
  `dead-code`, `fake-green-test`, `coverage-gap`, `restore-before-redesign`,
  `stale-audit-note`, `money-path`.
- **Process / area**: `follow-up`, `infra`, `testing`, `pre-launch`,
  `needs-authoring`, `legal`, `i18n`, `accessibility`, `mobile`, `content`,
  `documentation`.

A money-path bug found via a green-but-meaningless test is
`money-path` + `silent-failure` + `fake-green-test` — exactly #770's set.
Don't reach for `bug`/`enhancement`; the A92 classes carry the diagnosis.

---

## Worked example — PR #770 (B11, implementing B5's recon)

[#770](https://github.com/ChauDoan21165/MercyB/pull/770) scored 7/7 in the
audit. It is the gold standard because every section earns its place. Below,
the real body annotated with the template section each part fills:

> **## Summary** → *the **What** + **Why**, fused into the lead:*
> "B5 root-caused `mylinh.nutrition@gmail.com`'s **paid-but-free** as a
> **class bug, not an instance bug**. Every monthly Stripe renewer is
> affected. Silent — no error, no failed webhook."
> *(Names the dispatching agent **B5** and the failure class in sentence one.
> A future archaeologist knows who, what, and blast radius before line 2.)*

> **## The Stripe gotcha** + **## Root cause** → the **Root cause**, separated
> by layer (external API contract → data-shape → the two readers disagreeing),
> with the resolver precedence quoted verbatim and a table of **real
> anonymized values** from `evt_1TV59K` — not a paraphrase. Closes B8 claim
> type 1 (data-shape) by stating the *verified* invoice shape.

> **## The fix (TASK A)** → **What ships**: the one field-order line, the
> verbatim module extraction, and an explicit "behaviour for subscription
> objects is unchanged" — scope stated, not implied.

> **## Regression test (TASK B)** + "**Verified RED without the fix**" →
> the **RED-then-GREEN** block, mandatory for money-path:
> *"reverting to the old field order fails test #1 with the exact bug
> signature — `expected '2026-05-09…' to be '2026-06-09…'` — while the 7
> subscription-object guards stay green. Not a fake-green test."*
> This is the section 8 of 10 audited PRs were weakest on.

> **## Gates** → **Verification** provenance:
> `typecheck ✓ · typecheck:ci ✓ · lint ✓ (0 errors) · vitest ✓ (357 files /
> 6473 tests) · build ✓` — concrete counts, not "gates green".

> **Labels: `silent-failure` `money-path` `fake-green-test`** → the
> **Labels line**. (Audit note: #770's body had this line but the GH labels
> field was empty — the one gap even the exemplar had. *Apply them too.*)

> **> Follow-up (out of scope, flagged):** `getCurrentPeriodStart` has the
> analogous shape; a backfill of already-corrupted rows is still needed →
> the **Out of scope / Follow-up** section. The reader knows precisely what
> this PR does *not* heal.

### Why the other exemplars work

- **[#768](https://github.com/ChauDoan21165/MercyB/pull/768)** (docs-only,
  7/7): proves the matrix's docs row — explicit `## What` / `## Why` / `##
  Files` / `## Gates` ("lint → 0 errors; build ✓; docs-only, no code
  touched"), no fabricated test count, `stale-audit-note` applied **and**
  noted, and a forward-looking "retroactive backlog" as its Out-of-scope.
- **[#703](https://github.com/ChauDoan21165/MercyB/pull/703)** (dead-code,
  6/7): the canonical Out-of-scope section — fences SSR cluster, dynamic
  Kids imports, CI-synced lesson trees, Bucket B/C — plus an independent
  Explore-agent cross-check standing in for RED-then-GREEN, and the recon doc
  cited by name **and SHA**.
- **[#710](https://github.com/ChauDoan21165/MercyB/pull/710)** (rls, 5.5/7):
  the cleanest literal `## What` / `## Why` / `## Verification` headers in
  the corpus — the skeleton above is essentially #710's spine generalized.
- **[#717](https://github.com/ChauDoan21165/MercyB/pull/717)** (email,
  5/7): the model **Premise correction** — "The dispatch asked for a new
  table. That conflicts with already-merged #190 … This PR reuses the
  existing token" — flagged, not silently followed.

## Checklist (paste into the brief, and self-check before opening the PR)

```
[ ] ## What is ONE line: the change, not the journey
[ ] ## Why names the dispatching agent + the audit/recon doc (path + SHA)
[ ] Premise correction section IFF any brief claim was stale
    → and stale-audit-note label applied
[ ] Root cause separated by layer (bug-fixes); evidence quoted, not paraphrased
[ ] Verification: gates line with real counts + "fresh npm ci in worktree" prov.
[ ] RED-then-GREEN with the exact failing assertion  (MUST for money/auth)
[ ] Out of scope / Follow-up fences every deliberate omission (MUST for dead-code)
[ ] Apply / Post-merge note for any migration or edge-fn (SQL-Editor, not db push)
[ ] Labels: line in body  AND  gh pr edit --add-label  (A92 vocabulary)
[ ] Co-Authored / 🤖 trailer present
```

## Maintaining this doc

This is a template, not a rulebook that grows. When a new PR class recurs
often enough to need its own column, add the column to the matrix — do not
add prose. When a section proves to be noise across many PRs, demote it from
● to ○ with one line of evidence. Keep the worked example pointed at the
current best PR of the session; replace #770 only if a later PR is
unambiguously stronger on the same 7 criteria.

## Related

- [preflight-checklist.md](./preflight-checklist.md) (B8) — the input side:
  verify claims *before* the brief goes out. This doc is the output side.
- [recon-doc-convention.md](./recon-doc-convention.md) (B16) — where a
  diagnostic dispatch's evidence lives so a PR can cite it durably.
- [INDEX.md](./INDEX.md) — the process-doc map; this doc is row 4 of §1.
- `CLAUDE.md` → "Operating discipline" — small diffs, restore-before-redesign,
  separate-layers-before-fixing. The PR body is where an agent *demonstrates*
  it followed them.
- The A92 label set (`gh label list`) — the failure-class vocabulary the
  Labels line draws from.
