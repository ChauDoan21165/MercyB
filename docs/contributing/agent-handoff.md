# Agent Handoff

> Short briefing for a Claude / GPT / human agent joining MercyBlade
> mid-project. Read this **before** your first dispatch.
>
> Other docs to read in order:
>
> 1. `STRATEGY.md` — *why* this product exists, who it serves, what the
>    flagship Definition of Done is. Sections 4 (matrix), 5 (product),
>    15 (DoD), 12 (Duolingo strategy + Study OS / Placement
>    boundaries).
> 2. `PRINCIPLES.md` — *how* agents and humans collaborate. All 19
>    principles. The "spreadsheet is source of truth" + "free agent =
>    immediate next dispatch" + "verify memory file claims" rules are
>    load-bearing.
> 3. `CLAUDE.md` — *what* invariants the codebase enforces.
> 4. `docs/architecture/system-overview.md` — *where* each system
>    lives.
> 5. `docs/architecture/data-flow.md` — *what flows* between systems.
>
> This doc is the cheat-sheet for the working contract — not a
> replacement for any of the above.

---

## 1. The lane map (who works on what)

MercyBlade splits work across coarse owner-lanes. Identify your lane
before you open files.

| Lane         | What it owns                                         | Pace                                                 |
|--------------|------------------------------------------------------|------------------------------------------------------|
| **A-side**   | Vietnamese-native learners studying English          | ~95% of effort. The flagship. Most dispatches.       |
| **C-side**   | English-native learners studying KO/JA/ZH/FR/DE/ES/VN | ~5% of effort. Maintain + keep discoverable.         |
| **Kids**     | Mercy Kids surface                                   | Sacred. Always-on guard. No new gating.              |
| **Platform** | Auth, billing, observability, routing, caching, CI/CD, native shells | Cross-cutting. Don't break.                          |

`STRATEGY.md` §4 lists the full matrix of pairs (up to 16). The lane
table above is the **operational** version of it.

When a brief says *"you are A4"* or *"you are C2"*, the digit is
agent-identity; the letter is hint at the lane. *"A1 — Audit Sentinel"*,
*"A2 — Ops Restorer"*, etc., are defined in `PRINCIPLES.md` §18 —
read those tags before claiming you belong to a lane.

---

## 2. Skill index — pick the right one

A user-invocable skill is a documented workflow. When you would
otherwise improvise, see if a skill already exists. The fleet has many
— a few load-bearing ones:

**MercyBlade-specific (top of the list every time):**

- `tech` — debugging, code fixes, deployments, Supabase queries, audio
  audits, dependency updates. The catch-all for MercyBlade
  engineering. Use when the user reports a bug or asks for a code
  change.
- `email` — drafting Vietnamese emails to MercyBlade users. Outputs a
  Supabase SQL query for cohort selection + subject + body + exclusion
  notes.
- `content` — 60–90s Vietnamese tutorial video scripts.
- `copywriting`, `copy-editing` — marketing copy (new) and copy review
  (existing).

**Cross-cutting tools:**

- `supabase` — anything involving Supabase products (DB, Auth, Edge
  Functions, Realtime, Storage, Vectors, Cron, Queues).
- `supabase-postgres-best-practices` — query/schema review.
- `sentry:seer`, `sentry:sentry-workflow`, `sentry:sentry-sdk-setup` —
  Sentry triage, SDK install, alert config.
- `stripe:stripe-best-practices`, `stripe:explain-error`,
  `stripe:test-cards` — Stripe integration help.
- `vercel:*` — deployments, env vars, AI Gateway, Functions, etc.

**Code review & cleanup:**

- `code-review` — review the current diff at low/medium/high/ultra
  effort. `--comment` to post inline PR comments; `--fix` to apply the
  findings.
- `simplify` — apply review-style fixes to the current diff.
- `security-review` — full security review of the pending branch
  changes.
- `repo-cleanup` — dead-code / unused-deps / outdated-docs workflows.

**Ops:**

- `verify` — verify a change actually works by running the app +
  observing.
- `run` — launch and drive the app for a screenshot or behavior check.
- `loop` / `schedule` — recurring tasks / cron-like remote agents.
- `update-config` — settings/hooks/permissions on the Claude harness.
- `fewer-permission-prompts` — scan transcripts and produce a project
  allowlist.

When the user types `/<skill-name>`, invoke it via the Skill tool. Do
not invent skills.

---

## 3. The five non-negotiables (CLAUDE.md, distilled)

A feature that violates any of these is rejected. Treat them as
preconditions, not suggestions.

1. **Vietnamese-first, always.** Never generic English features
   that happen to be translated.
2. **Kids mode is sacred.** Offline-first, no login friction, no
   monetization CTAs, no AI Tutor entry, age-appropriate. Parents trust
   us.
3. **Mobile-first.** Every feature must work at 375–414 px. Install
   size matters.
4. **Outcomes over engagement.** No dark gamification, no
   streak-shaming. If a feature boosts retention but hurts learning,
   reject it.
5. **No VIP tier.** `profiles.tier = 0..N` (0 = free, higher = paid).
   Code referencing `'vip'` / `'all_vip'` as an audience/cohort is
   legacy — skip it. (Room-name prefixes like `vip6_…` are fine —
   historical filename pattern, not a tier.)

---

## 4. Codebase invariants that have bitten people

Each of these has a specific PR / incident behind it. They are not
style preferences.

- **Idempotent `toAudioKey`.** The while-loop on `audio/` is
  load-bearing — call sites use it defensively. Don't "simplify" it.
- **Kids / music audio resolves via Supabase.** ALL audio (adult-room,
  `kids/*`, `music/*`) flows through the Supabase `room-audio` public
  bucket. Re-localizing re-bloats the bundle past Google Play's 200 MB
  cap. See `src/lib/roomAudioResolver.ts:9–16` and CLAUDE.md.
- **`mercy_user_facts` ≠ Study OS event summaries.** Semantic person
  memory vs. behavioral signal. Do not cross-write. See
  `STRATEGY.md` §12.
- **Placement writeback is directional.** Only the placement edge
  function may write `profiles.placement_*` / `placement_sessions` /
  `placement_responses`. Other surfaces read.
- **Entitlement is derived from `status` + `current_period_end` +
  `provider`.** Never `price_id`, never `profiles.tier`. See
  `docs/architecture/data-flow.md` §3.
- **`mb.stage3a.*` ring buffers are local-only.** No Supabase, no
  network, no `mercy_user_facts` touch, no placement writeback.
- **The `AnonymousOnboardingGate` doctrine** (file head comment) is
  the post-2026-05-18 marketing-landing fix. Don't "restore" the old
  `/onboarding` redirect.
- **`profiles.tier` is read-only from the browser.** Hardened
  server-side via RLS (PR #578). The browser write path was removed in
  `fix/profiles-rls-auth-backfill`.
- **Auth email templates live in the Supabase dashboard, not the
  repo.** Must keep `{{ .Token }}` — the app uses 6-digit OTP entry,
  not link.
- **Sentry SDK is route-gated.** Static legal / marketing pages must
  not fetch it. CI green pre-#657 cannot be trusted.
- **Repo is on GitLab.** `origin = git@gitlab.com:cd12536/mercyB.git`;
  the old GitHub remote is `old-origin`. Use `glab` for MRs.
- **`npm run typecheck` excludes `vite.config.ts` etc.** Always run
  `npm run typecheck:ci` before push.

---

## 5. Parallel-agent etiquette

Multiple agents share this repo. Follow these or you'll collide:

- **Use isolated worktrees.** `git worktree add ~/MercyB-<agent>-<task> -b <branch> origin/main`. Per `PRINCIPLES.md` §13.
- **Branch off `origin/main`, not local `main`.** Always
  `git fetch origin` first; never trust a stale local main (memory:
  [[feedback_branch_hygiene]]).
- **Check for an existing worktree on the branch you want.**
  `git worktree list | grep <branch>`. If a stale worktree holds it,
  prune it rather than inventing an alternate name (memory:
  [[feedback_worktree_prune_check]]).
- **Symlink the main repo's `node_modules`** into your worktree
  (gitignored, read-only). If your task requires a dependency change,
  `rm` the symlink and `npm ci` in-tree (memory:
  [[feedback_worktree_gates_node_modules]]).
- **Same-directory collision is detectable.** Use porcelain (committed
  vs. active), `find -mmin -2`, and reflog before alarming about
  another CC writing in the same place — not just `ps | grep claude`.
- **Wait for upstream agents** when your brief says *"after A<N>
  merged"* or names a file an upstream agent owns. Don't rebuild their
  shared infra.
- **Respect territory.** When parallel dispatches give each agent a
  *"do not touch X"*, treat it as binding. Stub out conflicts with an
  agreed-on contract before either side starts.
- **Report with the agreed prefix.** Fleet-wide:
  `Report from <id>` (per `PRINCIPLES.md` and the universal
  report-prefix memory). Some agents add a box-drawing banner with
  📋 — match what the dispatcher asks for.

---

## 6. The dispatch contract

Every dispatch a user gives you should make these explicit. If any are
missing, ask once and then proceed:

- **Agent identity.** *"You are A4."* / *"You are C2."* Affects your
  report prefix.
- **Worktree path + branch name.** Always under `~/MercyB-<agent>-<task>`
  or `/private/tmp/<agent>-<task>`, branched off `origin/main`.
- **Read-first list.** Files / docs to scan before changing anything.
- **Deliverables.** What lands and where (file paths, MR body
  contents).
- **Constraints.** Don't-touch list, scope boundaries, "docs only,"
  etc.
- **Gates.** Which of `typecheck`, `typecheck:ci`, `lint`, `test`,
  `rooms:check` must stay green.
- **Push authorization.** Per `PRINCIPLES.md` §16, if the dispatch says
  *"push + MR open"* upfront, push **without** re-confirming. The
  owner's gate is merge approval, not push approval.

If push is **not** authorized, hard-stop after `git commit` and report
the diff for review.

---

## 7. Verification — how to know your change works

Compile success ≠ runtime verified (memory:
[[feedback_testing_discipline]]). Walk the verification ladder in
order; do not skip steps:

1. **Type and lint.** `npm run typecheck:ci && npm run lint`. CI runs
   `typecheck:ci`. Skipping this is how config-file type errors slip
   through.
2. **Unit tests.** `npm test` or `npx vitest run <path>`.
3. **Detector eval (if you touched a rule pack).** The relevant
   `evals/*-grammar-cases.json` and `evals/.baseline.json` must stay
   green. §15 Axis 1 Bar #2 is the gate.
4. **E2E (if you touched a critical flow).** `npx playwright test`.
   The placement-to-first-lesson spec is the canonical Bar #5 gate.
5. **Local dev run.** `npm run dev` (Vite + grammar server) and
   click through the change at 375 px.
6. **Real-device test.** Per `PRINCIPLES.md` §3 — this is the
   **user's** job, not yours. Wait for the user to confirm before
   declaring the work done. Don't claim "verified on iOS" if you
   haven't been handed a screenshot.

If you can't run a step (no GUI, no device), say so explicitly in your
report. Don't claim success.

---

## 8. PRs (MRs) — what a good one looks like

- **One concern per MR.** Bug fixes don't get bundled with features.
  Refactors don't get bundled with bug fixes.
- **Base off `origin/main`**, not a stacked branch that may get
  squashed under you (memory:
  [[feedback_stacked_pr_squash_orphan]]).
- **Title is short**, under ~70 chars. Detail goes in the body.
- **Body has** a Summary (1–3 bullets) and a Test plan (a markdown
  checklist of what you ran / what's left for the user to run on
  device).
- **Co-author trailer.** Commit as
  `Chau Doan <239713933+ChauDoan21165@users.noreply.github.com>`
  (per memory: [[feedback_commit_email_noreply]] —
  `cd12536@gmail.com` gets push-rejected for email privacy).
- **Add `Co-Authored-By:`** trailer (`Co-Authored-By: Claude Opus 4.7
  (1M context) <noreply@anthropic.com>` or the agent's identity) per
  CLAUDE.md.
- **Never push to main directly.** Always feature branch + MR.
- **Never force-push** to `main` or `master` (per the git safety
  protocol). Don't `--no-verify` unless the user explicitly asks.

---

## 9. Memory — the auto-loaded system

The Claude harness auto-loads `MEMORY.md` (under
`~/.claude/projects/-Users-admin-MercyB/memory/`) every session. It's
an index of one-line pointers to per-topic memory files.

Memory **types** that exist:

- `user` — who Chau is and how he wants to collaborate.
- `feedback` — guidance Chau has given (corrections AND validated
  approaches). Save both, not just corrections.
- `project` — ongoing work / goals / incidents not derivable from
  code.
- `reference` — pointers to external systems.

Memory **rules** worth absorbing now:

- Verify before recommending. Memory that names a file or symbol is a
  claim it existed *when written*. Grep / read before acting on it.
  Per `PRINCIPLES.md` §15.
- Update memory when you learn it's wrong. Don't leave stale entries
  to mislead the next agent.
- Don't save derivable facts (project structure, git history, recent
  changes). Memory is for *non-obvious* and *non-derivable* context.
- Don't save ephemeral state. That's what plans and tasks are for.

You may save memory mid-session via the `Write` tool to
`~/.claude/projects/-Users-admin-MercyB/memory/<slug>.md` plus an index
line in `MEMORY.md`. Keep index entries to one line under ~200 chars.

---

## 10. Post-merge verification

After a merge, do **not** assume the world is consistent:

1. `git fetch origin` and read the latest log. Confirm the commit you
   expected is on `origin/main`.
2. If the change shipped a language lesson under `src/languages/`,
   the `sync-lessons.yml` workflow pushes it to prod Supabase
   automatically (memory: [[project_lessons_autosync_prod]]). No
   manual ship step.
3. If the change shipped an edge function and the
   `supabase-functions.yml` deploy pipeline (PR #669) is in place,
   the function ships on first relevant change. If the pipeline is
   not yet in place, **don't assume** the edge function is deployed
   from the code being on `main` — memory:
   [[project_edge_fn_ci_deploy]] tracks the 0/115-drift status.
4. If the change shipped a Supabase migration, **do not** assume
   `supabase db push` was run. CLI state drifts (memory:
   [[project_db_schema_drift_audit]]). RLS migrations are applied via
   SQL Editor by Chau, not by agents.
5. If the change shipped UI, hand it to Chau for the real-device test
   (PRINCIPLES.md §3). Your job ends at the green CI build.

---

## 11. When to stop and ask

Auto-mode is the default, but it doesn't override task coherence.
Stop and ask when:

- The brief names a branch or file that doesn't match your current
  understanding (memory: [[feedback_pause_on_branch_mismatch]]).
- The brief references another agent's worktree, branch, or
  `A<N>`-label that isn't yours. **Refuse** with a ⚠️ banner; don't
  execute (memory: [[feedback_refuse_mispasted_commands]]).
- A "small" change starts pulling in §4 (detectors) + §6 (Stage 3A) +
  §8 (placement). That's a strategy edit, not a refactor — confirm
  before proceeding.
- A cleanup discovers more dead code than the brief named, or the
  scope materially shrinks. Per `PRINCIPLES.md` §1 — don't silently
  expand or shrink.
- Memory and current code disagree. Verify current state and update
  memory; don't act on the stale claim.

---

## 12. Common failure modes to avoid

A non-exhaustive list, each cited from a real incident:

- **Dead-code wiring.** Don't "fix" a module that has zero importers;
  `grep -r 'from.*moduleName' src` first.
- **Patch-and-retry without evidence.** Per PRINCIPLES §5 — diagnose
  before patching. Three speculative fixes is slower than one
  evidence-led fix.
- **Hallucinated memory files.** Don't propagate `[[wikilink]]`
  references you haven't `find`-verified.
- **Stacked PRs on squashed-merge branches.** Always base on
  `origin/main`; verify the SHA is on `main` post-merge.
- **Re-applying strategically-reversed migrations.** Onboarding
  default 'vi' (PR #590) was reversed under Locked #14. Never
  re-apply.
- **Cohort-sizing compliance findings down.** CASL + Gmail RFC 8058
  are real at any scale. Don't soften compliance work because the
  cohort is small (memory: [[feedback_compliance_risk_framing]]).
- **Trusting `ps | grep claude`** as evidence of a concurrent agent in
  the same worktree. Use porcelain + mtime + reflog (memory:
  [[feedback_concurrent_agent_forensics]]).
- **Stale shared `node_modules` symlinks** producing false-RED type
  errors. `npm ci` in an un-symlinked worktree before flagging *"main
  broken"* (memory:
  [[feedback_stale_shared_node_modules_false_red]]).

---

## 13. The final report

When your dispatch completes, the report is two sections (fleet-wide
since 2026-05-25, memory: [[feedback_report_terse_done_undone]]):

```
Report from <id>

Done: <few words>
Undone (with reason): <few words>
```

If the report is the final task report and the dispatcher uses the
banner convention, wrap the header inside a box-drawing banner with
📋 (memory: [[feedback_visual_report_banner]] +
[[feedback_report_banner_title_inside]]):

```
╔══════════════════════════════╗
║ 📋 Report from <id> — <title> ║
╚══════════════════════════════╝

Done: …
Undone (with reason): …
```

Mid-task updates skip the banner.

---

## Last words

This codebase exists to make MercyBlade the language-learning app
Vietnamese learners credit for their outcomes. Every dispatch you take
should leave the repo in a better state for the next agent. Read the
strategy doc, respect the lanes, follow the invariants, verify before
declaring success, and ask when you're unsure.
