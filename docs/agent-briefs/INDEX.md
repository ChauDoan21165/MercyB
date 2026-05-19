# Agent Briefs — Process Documentation Index

> One map of **how MercyBlade development actually works** — the dispatch
> discipline, the failure-class vocabulary, and the lessons behind both.
> If a process doc isn't linked here, it isn't load-bearing process.

Tonight's multi-agent hardening wave produced institutional knowledge that
landed in five different places. This file is the single entry point so the
next agent (or a second contributor) doesn't have to reconstruct it from
scattered worktrees and memory.

A note on freshness, because it is the recurring failure: the **canonical**
docs below are verified against current `origin/main`; the **archived** ones
are history, not direction; per-session `memory/` reflects what was true when
each note was written. When a doc and current `main` disagree, `main` wins —
that rule has its own label (`stale-audit-note`) for a reason.

---

## 1. The process-doc map

### Canonical — current direction and discipline (read these as authority)

| Doc | What it covers | Status |
|---|---|---|
| `STRATEGY.md` | Product strategy: who we serve, what we will and won't build. The "what". | Live, canonical (post-2026-05-17) |
| `PRINCIPLES.md` | The non-negotiable principles strategy decisions are checked against. Paired with STRATEGY.md. | Live, canonical (post-2026-05-17) |
| `CLAUDE.md` (repo root) | The operating manual for agents on this repo: 5 non-negotiables, operating discipline, commands, architecture invariants, traps, git discipline. | Live, canonical |
| `docs/mercy-ai-company-lessons-log.md` | The full operating-discipline source. CLAUDE.md's "Operating discipline" section is the condensed form of this. | Live, canonical |
| `docs/For_Chau_Study.md` | 9 numbered lessons (newest first): the mistakes and disciplines this session learned the hard way. Human-facing "why". | Live (PR #753 on main) |
| `docs/agent-briefs/preflight-checklist.md` | How a dispatch-writer verifies every load-bearing claim in a brief in <60s before sending it. The operational "how" beneath For-Chau Lesson 4. | **In-flight — PR #764** |
| `docs/agent-briefs/recon-doc-convention.md` | How diagnostic dispatches make their findings survive worktree pruning: `reports/RECON-<topic>-<agent>.md`, commit-don't-PR, required sections. | **In-flight — PR #768** |
| `docs/agent-briefs/pr-title-convention.md` | The `type(scope): summary (agent-id)` title grammar — the one-line sibling of B31's body template (PR #777). | **In-flight — PR #781** |
| GitHub labels (A92 set) | The named failure-class vocabulary: `silent-failure`, `dead-code`, `fake-green-test`, `coverage-gap`, `restore-before-redesign`, `stale-audit-note`, `money-path`, plus process labels (`follow-up`, `infra`, `testing`, `pre-launch`, `needs-authoring`, `legal`, `i18n`). | Live (`gh label list`) |

### Reference — authoring and setup (consult when the task touches them)

| Doc | What it covers |
|---|---|
| `ROOM_GUIDE.md` | Canonical room/lesson content system — the authoring + validation process for the ~476-room corpus. |
| `PROJECT_NOTES.md` | Outstanding-work tracker and project-level context (owner, domain, infra). |
| `SECURITY.md` | Security policy / disclosure. |
| `SETUP.md` | Local dev environment setup. |
| `README.md` | Repo entry point (de-Lovable'd in PR #686). |
| `reports/RECON-*.md`, `reports/*-audit-*.md` | Accumulated diagnostic and audit outputs. Governed by the recon-doc convention above. Legacy root-level `RECON-*.md` predate the convention — leave them, don't migrate. |
| `~/.claude/projects/-Users-admin-MercyB/memory/` (`MEMORY.md` + topic files) | Per-session auto-loaded memory: accumulated rules, project state, user preferences. Background context, not instructions; reflects when written — verify named files/flags still exist. |

### Archived — history, NOT current direction

| Doc | Note |
|---|---|
| `reports/archive/NORTH_STAR-v1.3-2026-04-20.md` | Superseded by STRATEGY.md + PRINCIPLES.md on 2026-05-17. Consult for history (deferred tech debt, migration-drift notes), never as current direction. |
| `reports/archive/PLAN-v1-2026-05-10.md` | Same — archived historical plan. |

**`CONTRIBUTING.md` does not exist** (parked Scope-C residue, per the docs-honesty pass). If a brief references it, that's a stale premise — treat as the `stale-audit-note` class.

---

## 2. Which file answers which question

| If you're asking… | Canonical source |
|---|---|
| "What should we build / not build, and why?" | `STRATEGY.md`, then `PRINCIPLES.md` |
| "How do I write a dispatch brief that won't send an agent down a stale path?" | `docs/agent-briefs/preflight-checklist.md` (PR #764) |
| "I ran a diagnostic — where do the findings go so they survive?" | `docs/agent-briefs/recon-doc-convention.md` (PR #768) |
| "How should I title a dispatch-driven PR?" | `docs/agent-briefs/pr-title-convention.md` (PR #781) |
| "What failure classes do we name / label?" | The A92 label set (§1) — definitions are in each label's description |
| "What mistakes have we learned from?" | `docs/For_Chau_Study.md` (the principle) → `docs/mercy-ai-company-lessons-log.md` (the discipline) |
| "What are the hard rules for this codebase (invariants, traps, git)?" | `CLAUDE.md` |
| "How do I author/validate room content?" | `ROOM_GUIDE.md` |
| "What's still outstanding at project level?" | `PROJECT_NOTES.md` |
| "Was this already decided / done?" | `git log origin/main`, `gh pr list` — **not** an audit note (see `stale-audit-note`) |

---

## 3. New agent picking up this codebase tonight — read in this order

1. **`CLAUDE.md`** — the rules. 5 non-negotiables and operating discipline are the floor; everything else assumes you've internalized these.
2. **`STRATEGY.md` + `PRINCIPLES.md`** — what success looks like and the principles every decision is checked against.
3. **`docs/For_Chau_Study.md`** — the 9 lessons (newest first). This is the cheapest way to not re-make tonight's mistakes.
4. **`docs/agent-briefs/preflight-checklist.md`** (PR #764) — if you write or receive briefs. The single highest-leverage habit: ~1 in 3 briefs carries a stale load-bearing claim; this is the 60-second insurance.
5. **`docs/agent-briefs/recon-doc-convention.md`** (PR #768) — if your dispatch is diagnostic. The commit is the deliverable, not the file.
6. **The A92 label set** (`gh label list`) — the shared vocabulary for triage. Apply the failure-class label when you find the class.
7. Skim **`docs/mercy-ai-company-lessons-log.md`** for the long-form reasoning behind CLAUDE.md's discipline section, and **`PROJECT_NOTES.md`** for current outstanding work.

Stop point: if anything above contradicts current `origin/main`, current `main` is the truth and the doc is the `stale-audit-note`. Report the divergence; don't silently follow either.

---

## 4. In-flight coordination (as of 2026-05-19)

The two `docs/agent-briefs/` siblings are not yet on `main`:

- **B8 — PR #764** `docs/agent-briefs/preflight-checklist.md` (OPEN)
- **B16 — PR #768** `docs/agent-briefs/recon-doc-convention.md` (OPEN)
- **B31 — PR #777** `docs/agent-briefs/pr-body-template.md` (OPEN; B31 owns its
  own §1/§2 INDEX rows — not added here, to avoid a parallel-PR table conflict)
- **B50 — PR #781** `docs/agent-briefs/pr-title-convention.md` (OPEN;
  this PR — the one-line sibling of B31's body template)

This INDEX adds a third file to the same directory and conflicts with neither
(distinct filenames, no shared lines). Whichever order they merge, this index
is correct; the only volatility is the "in-flight" tags above — drop them to
"Live" once #764/#768 land.

Forward reference to be aware of: `recon-doc-convention.md` cites
"`docs/For_Chau_Study.md` Lesson 10". `For_Chau_Study.md` on `main` currently
has **9** lessons; Lesson 10 is itself in flight (A98, `a98/study-file-update`).
Not an error — a documented dependency between two unmerged docs.

---

## 5. Maintaining this index

This file is an index, not content. When a new process doc is created:
add one row to §1, one routing line to §2, and (only if it's foundational)
one step to §3. Keep descriptions to one line. Move the "in-flight" tag to
"Live" when the referenced PR lands. Never let this file accumulate the
content it's supposed to point at.
