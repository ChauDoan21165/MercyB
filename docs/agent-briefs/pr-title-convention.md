# PR Title Convention — for dispatch-driven PRs

> Status: living convention. Established by B50 (2026-05-19) after a ~80-agent
> / ~50-PR session. The smaller sibling of
> [pr-body-template.md](./pr-body-template.md) (B31): the **title** is to the
> merge queue what the **body** is to a future archaeologist. Also a sibling
> of [preflight-checklist.md](./preflight-checklist.md) (B8) and
> [recon-doc-convention.md](./recon-doc-convention.md) (B16); indexed in
> [INDEX.md](./INDEX.md).

## Premise correction (the brief was stale — `stale-audit-note`)

The dispatch's premise: *"PR titles follow no consistent prefix pattern …
the ones that DO use conventional commit prefixes are easier to parse than
the ones that don't."*

Ground truth, measured against the **last 100 merged PRs** (#648–#772,
`gh pr list --state merged --limit 100`, verified against `origin/main`
@ `5cfa27e3f`):

| Property | Count | % |
|---|---:|---:|
| Uses a `type:` / `type(scope):` conventional shape | 100 / 100 | **100%** |
| Uses a *standard* type {feat, fix, docs, chore, test, ci, perf, refactor} | 98 / 100 | **98%** |
| Includes an explicit `(scope)` | 96 / 100 | **96%** |
| Carries an agent / dispatch provenance token | ≈60 / 100 | **≈60%** |
| Custom bracket prefix (`[B25]`) **or no prefix at all** | 0 / 100 | **0%** |

So prefix adoption is **already effectively solved** — there is no "PRs that
don't use a prefix" cohort to convert. Treating that as the problem would
have sent this agent to fix something that isn't broken (the exact failure
[B8](./preflight-checklist.md) exists to stop — ~1 in 3 briefs carries a
stale load-bearing claim; this was one). Per
[B31](./pr-body-template.md)'s own matrix, a stale brief premise makes a
Premise-correction section **mandatory** and the PR carries
`stale-audit-note`. It does.

**The real, narrower inconsistency the merge queue actually suffers from:**

1. **Scope vocabulary is uncontrolled.** Across 96 scoped titles the scope
   token freely mixes *feature areas* (`billing`, `placement`, `email`),
   *directories* (`_shared`, `room-spec`), and *quality axes* (`a11y`,
   `dead-code`, `types`, `honest`). Two PRs touching the same code can carry
   different scopes; `gh pr list` can't be filtered by area reliably.
2. **Agent provenance is present in only ~60%.** ~40% of merged PRs cannot be
   traced from the title back to the dispatch that produced them. The two
   outlier *types* (`ops:` #696, `content(cyrus_v3):` #666) are a minor third
   issue.

This convention therefore standardizes **scope** and **provenance**, not
prefix adoption — making it the precise title-level counterpart of B31, which
standardizes provenance in the body.

## The problem this solves

A title is read far more often than a body — in `gh pr list`, in the merge
queue, in `git log --oneline`, in release notes, in a session-summary doc six
hours later. When 40% of titles drop the dispatch ID, the next session
reading the queue cannot answer *"which agent shipped this, and was it from a
recon I can read?"* without opening every PR. When scope is ad hoc, the queue
can't be triaged by area. The fix is not "write longer titles" — the
best-formed titles in the audit were not the longest. They were the ones
where the queue reader learns, in one line: **what kind of change, where,
what it does, and who sent it.**

The best-formed titles in the corpus (all four facets present, summary in
imperative mood):

- `fix(billing): invoice period_end field order in getCurrentPeriodEnd (B5 class bug)` (#770) — names the exact symbol *and* the failure class.
- `chore(dead-code): delete 13 confirmed-orphan files (sweep R3, A37)` (#722) — verb-led, quantified, recon-ref + agent.
- `fix(security): enforce aal=2 on delete-account when MFA factor present (A65, #233)` (#748) — agent + issue.
- `feat(plc2): browser client + pure flow controller (PR 10)` (#732) — PR-series provenance.
- `docs(honest): real project README + de-Lovable SETUP/deploy/rollback (A35)` (#686).

The gold-standard pattern, from the brief itself:
`fix(billing): premium gates read entitlement, not stale profiles.tier (B17 PR1)`.

## The convention

```
<type>(<scope>): <imperative summary> (<agent-id>)
```

Every dispatch-driven PR title is exactly these four parts, in this order.
None is optional for a dispatch-driven PR (which, this session, is ~all of
them). A non-dispatch PR (a human hotfix) may drop `(<agent-id>)`.

### 1. `type` — required, from a small fixed set

The eight standard conventional-commit types, plus **one** domain addition:

| type | use for |
|---|---|
| `feat` | new user-facing or API capability |
| `fix` | a bug, regression, or incorrect behavior |
| `docs` | docs / process / briefs only — no code touched |
| `chore` | deps, config, scaffolding, dead-code deletion, asset hygiene |
| `test` | adds/repairs tests with no production-code change |
| `ci` | workflow / pipeline / deploy-config changes |
| `perf` | a change whose primary purpose is speed/size |
| `refactor` | behavior-preserving restructure |
| `content` | room / lesson / corpus authoring (the ~476-room domain — a real recurring class, kept per B31's "add a column when a class recurs" rule) |

Rulings on the two observed outliers, so they don't recur:

- **`ops:` is not a type.** It is `chore` or `ci` with `scope=ops`
  (e.g. `chore(ops): disable broken-unsubscribe cron emails`). (#696)
- **`content` is kept**, not folded into `feat` — room authoring recurs often
  enough to deserve its own queue filter (#666 precedent).

`refactor` vs `chore`: `refactor` changes code structure; `chore` changes
things around the code (deps/config/dead-file removal). A pure orphan
deletion is `chore`, not `refactor`.

### 2. `scope` — required, kebab-case, a *feature area*

One scope per title — the **dominant product/feature area**, not a directory
path and not a quality axis when an area is available. Prefer this controlled
vocabulary (extend it in this doc when a new area recurs, never ad hoc in a
title):

`billing` · `rls` · `placement` · `native` · `email` · `onboarding` ·
`a11y` · `i18n` · `boot` · `search` · `db` · `pricing` · `paywall` ·
`telemetry` · `analytics` · `marketing` · `guide-assistant` · `mercy` ·
`room` · `agent-briefs` · `dead-code` · `ci` · `deps`

- Choose the area a human would say the change is *about*
  (`fix(billing): …`), not the folder it lives in (`fix(src-lib): …`).
- **`dead-code`** is the sanctioned scope for orphan-deletion sweeps —
  it is a real recurring class with its own B31 body rules; keep it.
- Multi-area only when two areas are genuinely co-equal: `fix(a11y+i18n): …`
  is a *tolerated documented exception* (#737), not a pattern to reach for.
  When one area dominates, pick it.

### 3. `summary` — imperative present tense, the change not the journey

- **Imperative mood**: "add", "fix", "delete", "enforce", "route" — the same
  tense `git` itself uses ("Merge branch…"). Not "added", not "fixes", not
  "this PR adds".
- Name the symbol / route / file when it sharpens the line — `#770`'s
  `getCurrentPeriodEnd` is why it scored highest. Vague beats nothing;
  specific beats vague.
- ≤ ~70 chars after the prefix. No trailing period.
- The *change*, not the path you took to find it (mirrors B31's `## What`
  one-line rule — the title is that line, compressed).

### 4. `agent-id` — required, trailing parenthetical, last token

The dispatch label that produced the PR, in parentheses, as the final token:

- Single agent: `(A65)`, `(B5)`.
- PR series: `(B17 PR1)`, `(PR 10)`, `(PR-V2-7)`, `(Cat-4 N4)`.
- May fold in the failure class or driving issue when it adds triage value:
  `(B5 class bug)`, `(A65, #233)`, `(sweep R2, A37)`.
- This is the title-level mirror of B31's body rule that **Why** must name
  the dispatching agent. If the body must say who sent it, so must the line
  the queue actually reads. ~40% of merged titles dropped this — that is the
  single highest-value habit this doc adds.

## 10 examples spanning the prefix set

```
feat(placement): adaptive item selector — MFI + content balance (A40 PR5)
fix(billing): read entitlement, not stale profiles.tier, in premium gate (B17 PR1)
docs(agent-briefs): PR title convention for dispatch-driven PRs (B50)
chore(dead-code): delete 13 zero-importer orphan components (sweep R3, A37)
test(billing): cover recomputeAndPersistEntitlement hot path (A24)
ci(edge-fn): real deploy pipeline + PR drift gate (A18)
perf(boot): route-gate Sentry so static pages fetch 0 SDK bytes (A20)
refactor(guide-assistant): extract envelope reconciliation into pure module (A52)
content(cyrus_v3): author full EN+VI for the Cyrus leadership room (A13, #641)
fix(rls): revoke anon SELECT on internal billing/admin views (A32, money-path)
```

Each is `type(scope): imperative summary (agent-id)` — scope is a feature
area, summary leads with a verb, the dispatch is traceable from the queue
without opening the PR.

## Cross-reference: B31 PR body template

This doc and [pr-body-template.md](./pr-body-template.md) are the same
discipline at two granularities. The body's mandatory facets each have a
title-level echo:

| B31 body section | Title-level echo here |
|---|---|
| `## What` (one line, the change not the journey) | the `summary` — the same sentence, compressed to ≤70 chars |
| `## Why` (names dispatching agent) | the `(agent-id)` token |
| `Premise correction` IFF brief stale → `stale-audit-note` | a stale premise is recorded in the body; the title still ships under the *corrected* scope (this PR: `docs(agent-briefs)`, not a phantom "add prefixes") |
| `Labels:` line (A92 vocabulary) | the failure class **may** ride in `(agent-id)` (`(B5 class bug)`, `…, money-path`) but the authoritative record is the body's Labels line + `gh pr edit --add-label` — the title hints, the body+labels bind |

The hinge: a title is the body's `## What` + `## Why` collapsed to one line.
If you cannot write a four-part title, the body's What/Why aren't yet sharp —
fix the thinking, not the string.

## Cross-reference: B8 preflight ↔ B16 recon

- [B8](./preflight-checklist.md): if the brief's premise was verified stale
  (as it was here), the *title* still ships under the true scope — never
  under the briefed-but-false framing. A title that encodes a stale premise
  propagates it into the queue and every release note downstream.
- [B16](./recon-doc-convention.md): when a PR implements a recon doc, fold the
  dispatch into `(agent-id)` (`(sweep R2, A37)`, `(B5 class bug)`); the body
  carries the full `reports/RECON-*.md` path + SHA citation. Title = pointer,
  body = evidence.

## Checklist (paste into the brief, and self-check before opening the PR)

```
[ ] type ∈ {feat,fix,docs,chore,test,ci,perf,refactor,content} — no `ops:`
[ ] scope is a feature AREA from the controlled list, not a directory/axis
[ ] one scope (multi-area `a+b` only if genuinely co-equal — rare)
[ ] summary is imperative present ("add"/"fix"/"delete"), no trailing period
[ ] summary names the symbol/route when it sharpens the line; ≤ ~70 chars
[ ] (agent-id) present and is the LAST token — the dispatch is traceable
[ ] if the brief premise was stale: title uses the CORRECTED scope, and the
    body carries Premise correction + stale-audit-note (B31)
[ ] title == the body's `## What` + `## Why`, collapsed to one line
```

## Maintaining this doc

A convention, not a rulebook that grows. The two lists that may change:
the **type set** (add a type only when a class recurs across many PRs, as
`content` did — never for a one-off) and the **scope vocabulary** (add a
recurring feature area here, in this doc, so titles stay filterable). When a
rule proves to be noise across many PRs, demote it with one line of evidence.
Refresh the audit percentages and the best-formed exemplars once per large
multi-agent session; replace the gold-standard examples only when a later PR
is unambiguously sharper on the same four facets.

## Related

- [pr-body-template.md](./pr-body-template.md) (B31) — the larger sibling;
  the title is its `## What`+`## Why` in one line.
- [preflight-checklist.md](./preflight-checklist.md) (B8) — verify the brief
  premise *before* the title can encode it falsely.
- [recon-doc-convention.md](./recon-doc-convention.md) (B16) — where the
  evidence behind a `(agent-id)` token durably lives.
- [INDEX.md](./INDEX.md) — the process-doc map; this doc is a row of §1.
- The A92 label set (`gh label list`) — the failure-class vocabulary a title
  may hint at and a body must bind.
