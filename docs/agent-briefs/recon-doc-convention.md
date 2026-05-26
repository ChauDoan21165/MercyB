# Recon Doc Convention — for diagnostic dispatches

> Status: living convention. Established by B16 (2026-05-19) after A77/B5/B7
> showed diagnostic findings dying with their worktrees. Owns the
> `reports/RECON-*.md` namespace.

## The problem this solves

Diagnostic ("recon") dispatches investigate a question — a money-path bug, a
schema drift, a webhook forensics trail — and reach a verdict. Too often the
verdict lived only in:

- raw JSON dumps and probe `.sh` scripts in `/private/tmp/A<N>-*` (A77), or
- the terminal transcript with nothing on disk (B5), or
- an uncommitted file in the worktree (A91's `RECON-…-A91.md`, B7's
  `reports/SCOPING-…md` — both written, neither committed).

When the worktree is pruned, the evidence is gone. The next agent sent back to
the same question **re-runs the entire diagnostic from scratch** (A94 had to
redo half of A77's webhook attribution work). The investigation cost is paid
twice.

**The fix is not "write a file." It is "commit the file to the branch."** A
well-named doc that is never committed dies exactly like a JSON dump. The
commit is the deliverable.

## The convention

### 1. File path

```
reports/RECON-<topic-slug>-<agent-id>.md
```

- `reports/` — not the repo root. (Legacy root-level `RECON-*.md` exist from
  before this convention; 13 of 19 already live in `reports/`. New recon docs
  go in `reports/`. Do not migrate the legacy ones as a side effect.)
- `<topic-slug>` — kebab-case, the investigation subject, not the symptom.
  e.g. `monotonic-concurrent-modification`, `webhook-forensics-scoping`,
  `mylinh-paid-but-free`.
- `<agent-id>` — the dispatch label (`A91`, `B5`, …). Makes the filename
  unique so two agents investigating overlapping topics never collide on the
  same file, and so provenance is readable from `ls`.
- **Never** write to the generic tracked `RECON.md`. It is shared/legacy;
  overwriting it destroys other context. One topic, one suffixed file.

Examples that followed this correctly:
`reports/RECON-monotonic-concurrent-modification-A91.md`,
`reports/RECON-A96-webhook-forensics-scoping.md`.

### 2. Required sections

A recon doc that omits any of these is incomplete — the next agent can't act
on it without re-deriving the missing part.

| Section | Content |
|---|---|
| **Verdict** | One sentence. The answer to the question the dispatch asked. Lead with it; no preamble. |
| **Evidence** | The actual DB queries run (verbatim SQL), payload citations (quote the row/JSON, don't paraphrase), log lines, file:line refs. Enough that the reader does not have to re-run anything to believe the verdict. |
| **Root cause** | The mechanism, separated by layer (loading / rendering / permissions / data shape / ownership / external) per CLAUDE.md operating discipline. |
| **Impact** | Who/what is affected, blast radius, severity. If money or auth: quantify. |
| **Fix recommendation** | The smallest safe change. If it needs a human decision, state the decision and the options — do not bury it. |
| **Worktree disposition** | One of: `prune` (findings fully captured here, worktree disposable) / `keep — spec for <follow-up dispatch>` / `keep — blocked on <X>`. Tells the cleanup pass whether the worktree is safe to remove. |

### 3. Commit, do not PR

- **Commit the recon doc to the agent's own branch.** This is the load-bearing
  step. `git add reports/RECON-<topic>-<agent>.md && git commit`. The commit is
  what survives `git worktree prune`; the branch ref keeps it reachable.
- **Do not open a PR for pure recon.** Recon is exploration, not production
  code. A PR invites review cycles on an artifact that is not meant to ship.
- **Exception — recon as spec.** If the recon doc *is* the specification for a
  follow-up implementation dispatch (someone will be told "implement
  `reports/RECON-x-A91.md`"), push it as a **draft PR** so the implementer has
  a stable URL to work against. Mark it draft; it is a spec, not a merge
  candidate.

### 4. Lifecycle

- Recon docs accumulate in `reports/`. They are cheap; keeping them is the
  point — the next investigator reads instead of re-running.
- They are **not** cleaned up by the authoring agent. A separate periodic
  cleanup dispatch (every N sessions) prunes recon docs whose
  `Worktree disposition` is `prune` and whose finding has been actioned or
  superseded. Authoring agents never delete another agent's recon doc.
- A recon doc is stale, not wrong, once its fix lands. Leave it; add a
  one-line `> SUPERSEDED by PR #NNN (date)` banner at the top instead of
  deleting, so the history of "why we looked here" is preserved.

## Checklist for a diagnostic dispatch (paste into the brief)

```
[ ] Findings written to reports/RECON-<topic-slug>-<agent-id>.md
[ ] Doc has all 6 sections: Verdict, Evidence, Root cause, Impact,
    Fix recommendation, Worktree disposition
[ ] Evidence quotes real queries/payloads (reader need not re-run)
[ ] Committed to the agent's branch (NOT just written to disk)
[ ] No PR opened — UNLESS this recon is the spec for a follow-up
    implementation dispatch, then: draft PR
[ ] Report states the recon doc path + commit SHA
```

## Related

- `docs/agent-briefs/` also holds the dispatch-writer preflight checklist (B8).
- CLAUDE.md → "Operating discipline" (separate layers before fixing; debug by
  narrowing; source-of-truth hierarchy) is the *method*; this doc is how the
  method's output is made durable.
- `docs/For_Chau_Study.md` Lesson 10 is the human-facing summary of why this
  exists.
