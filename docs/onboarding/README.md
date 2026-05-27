# Developer Onboarding

> Welcome. This is the **first stop** for anyone — human contributor or
> AI agent — who has just cloned MercyBlade and wants to start
> contributing.
>
> The architecture docs (`docs/architecture/`) explain *what's here*
> and *where it lives*. This onboarding set explains *how to get
> running*, *what's different about this repo*, and *how to make your
> first change land safely*.

---

## What MercyBlade is, in one paragraph

MercyBlade is a Vietnamese-first language-learning app. The flagship
pair is **Vietnamese learners studying English** (~95% of effort);
the matrix also covers English speakers studying Vietnamese, and
secondary tracks for Japanese, Korean, Chinese, French, German, and
Spanish (`STRATEGY.md` §4). Live web app: `https://mercyblade.com`.
Capacitor 8 ships the same SPA as iOS and Android apps. Backend is
Supabase (Postgres, Auth, Storage, Edge Functions). Hosting is
Vercel Pro. Stack: React 18 + Vite 6 + TypeScript 5 + TanStack Query
5 + React Router 6.

## What makes this repo different

These are the surprises a new contributor runs into. Each one is
real and each has shipped pain when ignored:

- **Two living strategic documents.** `STRATEGY.md` and
  `PRINCIPLES.md` are the source-of-truth for product direction and
  collaboration rules. Read them **before** you read code. The five
  "non-negotiables" in `CLAUDE.md` are not aspirational — a feature
  that violates any of them is rejected.
- **Vietnamese-first means Vietnamese-first.** UI copy, error
  messages, lesson examples, support replies — Vietnamese is
  primary, English is secondary. The lone exception is internal
  developer-facing code / comments / commit messages, which stay
  in English.
- **No VIP tier.** Users live at `profiles.tier = 0..N`. Any code
  referencing `'vip'` / `'all_vip'` as a *cohort* is legacy. Room
  filenames like `vip6_*.json` are historical filename patterns,
  not tier labels — leave them alone.
- **Kids mode is sacred.** Offline-first, no login friction, no
  monetization CTAs, no AI Tutor entry. If a feature change might
  reach the kids surface, treat it as a different product.
- **Mobile-first.** Every feature must work at 375–414 px viewport.
  Install size matters (Google Play caps base modules at 200 MB).
- **Outcomes over engagement.** No streak guilt, no XP coercion, no
  dark patterns. Streaks exist as a quiet retention helper, never as
  the primary loop.
- **Repo is on GitLab, not GitHub.** `origin = git@gitlab.com:cd12536/mercyB.git`.
  The historical GitHub remote is preserved as `old-origin`. Use
  `glab` for merge requests, not `gh`.
- **Branch-per-task with isolated git worktrees.** Parallel agents
  use `git worktree add` under `~/MercyB-<task>` or `/private/tmp/`
  rather than checking out branches in-place. This is enforced by
  `PRINCIPLES.md` §13.
- **`npm run typecheck:ci` ≠ `npm run typecheck`.** CI runs the
  former (bare `tsc --noEmit`, includes config files). Always run
  it before push.
- **Audio for adult + kids + music all resolves through Supabase
  (post-d2951ddd).** A "small" change that re-localizes audio re-bloats
  the bundle past the Play store cap. See
  `CLAUDE.md` "Audio resolution pipeline".

## The four onboarding docs

Read them in order:

1. **[local-setup.md](./local-setup.md)** — Clone, env vars
   (including the gotcha that the canonical Supabase keys aren't in
   `.env.example` — see the doc), `npm install`, dev server, common
   first-run errors.
2. **[your-first-contribution.md](./your-first-contribution.md)** —
   A walkthrough: pick a small change, make a worktree, edit, run
   the gates, push, open an MR. Friendly senior-dev tone — meant to
   be read straight through.
3. **[glossary.md](./glossary.md)** — Every project-specific term
   you'll meet in our architecture docs ("Stage 3A", "L1 signal",
   "placement v3", "weak-at", "mercy-guide", "mercy_user_facts",
   "pair matrix", "lane", …). Skim once; reference later.
4. *(this file)* — Comes back here when you forget where to start.

## Read order for the rest of the docs

After you finish the four onboarding docs above, work your way
through the docs in this order. Each builds on the previous one.

1. **[`STRATEGY.md`](../../STRATEGY.md)** at the repo root — *why*
   MercyBlade exists, who it serves, how it positions against
   Duolingo, what "done" looks like for the Vietnamese flagship
   (§15). Sections 4 (the pair matrix), 5 (product strategy), 12
   (Study OS and Placement boundaries), 14 (the decision
   framework), and 15 (Definition of Done) are the load-bearing
   ones.
2. **[`PRINCIPLES.md`](../../PRINCIPLES.md)** — 19 principles for
   how Chau, Claude, and any agent (A1, A2, A3…) collaborate. The
   spreadsheet-as-source-of-truth rule (§19), the parallel-worktrees
   rule (§13), the diagnose-before-patching rule (§5), and the
   "trust the working contract" rule (§6) are the ones agents
   forget first.
3. **[`CLAUDE.md`](../../CLAUDE.md)** — Architecture invariants,
   audio-resolver doctrine, Mercy Speak-tab dual invariant, traps
   the repo has recently hit. **You will reach for this often.**
4. **[`ROADMAP.md`](../../ROADMAP.md)** — Long-term vision (the
   "ladder" from Stage 1 Lesson App to Stage 11 AI Legacy System),
   the Stage 3 Study OS sequence (3A → 3B → 3C → 3D), and the
   strict local-only posture for Stage 3.
5. **[`README.md`](../../README.md)** at the repo root — concise
   stack summary + canonical commands. Use as a daily reference.
6. **[`SETUP.md`](../../SETUP.md)** — Hand-written setup notes,
   pre-commit hooks, room JSON conventions, troubleshooting.
7. **[`ROOM_GUIDE.md`](../../ROOM_GUIDE.md)** — Canonical reference
   for the room JSON format (the ~488 lesson files under
   `public/data/*.json`).
8. **[`SECURITY.md`](../../SECURITY.md)** + **[`docs/SECURITY_HARDENING_2025.md`](../SECURITY_HARDENING_2025.md)**
   — Security monitoring + the canonical env-var list.
9. **[`docs/architecture/system-overview.md`](../architecture/system-overview.md)**
   — The map of every major system (~24 sections). Read once
   end-to-end so you know where things are; come back to specific
   sections later.
10. **[`docs/architecture/data-flow.md`](../architecture/data-flow.md)**
    — How learner signal moves through the app (anonymous →
    Stage 3A → Stage 3B → practice route), the Supabase boundary
    contract, the entitlement derivation rule.
11. **[`docs/contributing/agent-handoff.md`](../contributing/agent-handoff.md)**
    — Lane map (A-side / C-side / Kids / Platform), skill index,
    parallel-agent etiquette. Whether you're an AI agent or a
    human, this short doc is worth reading.
12. **[`docs/architecture/systems/`](../architecture/systems/)** —
    Nine deep-dives, one per system. Read the one for the system
    you're changing, not all nine at once.

## "I just want to fix one bug" — the short path

If you want to skip everything above and just start editing:

1. Read **`CLAUDE.md`** end-to-end (~20 minutes). It's the
   highest-density doc in the repo; it'll save you from the most
   common traps.
2. Read **[local-setup.md](./local-setup.md)**, follow it through
   "dev server running".
3. Read **[your-first-contribution.md](./your-first-contribution.md)**.
4. Make the change.

You can always come back to the strategy/roadmap reading once
you've shipped something small.

## Audience for these docs

Each onboarding doc is written for a specific reader:

- **README.md** *(this file)* — first-time visitor. Don't know yet
  whether to invest time in this repo.
- **[local-setup.md](./local-setup.md)** — has decided to set up
  locally; needs commands + workarounds.
- **[your-first-contribution.md](./your-first-contribution.md)** —
  ready to ship something. Needs a friendly walkthrough, not a
  reference manual.
- **[glossary.md](./glossary.md)** — has read architecture docs and
  hit a term they don't recognise. Look up, leave.

If you're an AI agent dispatched on a specific task, the more
focused doc for you is **`docs/contributing/agent-handoff.md`** —
read that *first*, then come back to these onboarding docs only
for the specific terms / setup steps you need.

## Why is this onboarding doc structured this way?

Because the strategy docs (`STRATEGY.md`, `PRINCIPLES.md`,
`CLAUDE.md`) explain the *project*, and the architecture docs
(`docs/architecture/*`) explain the *code*, but neither explains
*how to get from a fresh clone to a green CI run*. That gap is
what these four docs close. Every confused new contributor
question that gets asked a second time deserves a paragraph here.

If you ran into something this doc didn't explain — that's the
single best PR you can open. Tell the next person what tripped
you up.

---

## Quick links

| If you want to…                            | Read                                                                                |
|--------------------------------------------|-------------------------------------------------------------------------------------|
| Get the dev server running                 | [local-setup.md](./local-setup.md)                                                  |
| Ship your first PR                         | [your-first-contribution.md](./your-first-contribution.md)                          |
| Understand a project-specific term         | [glossary.md](./glossary.md)                                                        |
| Understand what the product is             | [`STRATEGY.md`](../../STRATEGY.md)                                                  |
| Understand how Chau wants to collaborate   | [`PRINCIPLES.md`](../../PRINCIPLES.md)                                              |
| Understand what *not* to break             | [`CLAUDE.md`](../../CLAUDE.md)                                                      |
| See where each system lives                | [`docs/architecture/system-overview.md`](../architecture/system-overview.md)        |
| Deep-dive a specific system                | [`docs/architecture/systems/`](../architecture/systems/)                            |
| Onboard as an AI agent                     | [`docs/contributing/agent-handoff.md`](../contributing/agent-handoff.md)            |
| Set up room JSON content                   | [`ROOM_GUIDE.md`](../../ROOM_GUIDE.md)                                              |
| Submit to App Store / Play                 | [`docs/app-store-submission/SUBMISSION_RUNBOOK.md`](../app-store-submission/SUBMISSION_RUNBOOK.md) |
| Triage a Sentry event                      | [`docs/OBSERVABILITY.md`](../OBSERVABILITY.md) + the [observability deep-dive](../architecture/systems/observability.md) |

## Conventions you'll see in our docs

- File paths and command names live in `code fences` or `inline
  code`. Click-jumping from the docs to the file is the
  intended UX in editors that support it.
- We never invent file paths. If a doc cites
  `src/lib/foo/bar.ts:line`, the line really exists. If it doesn't,
  that's a doc bug.
- **PRs** in our docs usually refer to merge requests — historical
  ones may say "PR #123" (from the GitHub era) and current ones may
  say "MR !456" (GitLab). Both styles coexist.
- "Memory" referenced in docs means our agent memory store at
  `~/.claude/projects/-Users-admin-MercyB/memory/MEMORY.md`. Not
  publicly visible; cited so that AI agents reading the doc can
  cross-reference.

## A note on tone

These docs are written like a friendly senior dev showing a junior
the ropes — direct, specific, occasionally opinionated. We assume
you can read English and TypeScript. We don't assume you've worked
on a Vietnamese-first product before, or that you know what an L1
detector is, or that you've used Capacitor. When in doubt, the
docs over-explain rather than under-explain.

If you find that a doc *under*-explains, that's also a bug — open
the PR.

Welcome aboard.
