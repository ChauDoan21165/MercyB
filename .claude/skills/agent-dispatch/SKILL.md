---
name: agent-dispatch
description: Discipline checklist for writing an agent dispatch brief (A1, A2, A16, …) on MercyBlade. Use when planner-Claude is about to send a task to an agent — covers worktree isolation, branch hygiene, surface declaration, single-concern scope, smoke-testing, and soft-then-hard gate rollouts. Codifies what tonight's PR template + observability work (PRs #890 and #896) had to do correctly to ship cleanly.
---

# Agent Dispatch Discipline

Pull this skill into any session where planner-Claude is composing a dispatch brief for an agent (A1, A2, A16, etc.). The disciplines below are extracted from `PRINCIPLES.md` and from session-level lessons that aren't yet promoted to principles. Each rule cites concrete evidence — usually a PR number from the night it was learned.

## How to use

When writing a dispatch brief, walk through sections 1–10 in order. Each section gives you:

- **Rule** — the one-line invariant.
- **Example dispatch language** — phrasing you can lift verbatim into a brief.
- **Evidence** — a PR or moment from tonight's session that proves the rule earns its keep.

If a brief fails any of these checks, fix the brief before sending. The cost of a 30-second re-read here is far smaller than a misdirected agent.

---

## 1. Isolated worktree per dispatch

**Rule.** Every parallel agent works in its own `/private/tmp/<label>-<task>` worktree. Never share `/Users/admin/MercyB`.

**Why.** Per `PRINCIPLES.md §13`: two agents in the same working tree can hijack each other's `HEAD` between `git checkout -b` and `git commit`. The structural fix is worktrees — independent working dirs, shared object DB.

**Example dispatch language:**
```
git fetch origin
git worktree add /private/tmp/<LABEL>-<task> origin/main
cd /private/tmp/<LABEL>-<task>
git checkout -b <branch-name>
sleep $((RANDOM % 30))
```

**Evidence.** Tonight, `/private/tmp/A16-expiry-flip-count` was already claimed by another A16. Three subsequent A16 dispatches used `A16b-pr-template` (PR #890), `A16c-pr-template-observe` (PR #896), `A16d-skill` (this PR) — no collision, no `HEAD` race.

---

## 2. Branch off fresh `origin/main`, not stale local

**Rule.** Always `git fetch origin` first. Branch from `origin/main`, never from a local `main` that may be hours behind.

**Why.** Local `main` drifts the moment any other PR merges. Branching off it ships a stale base. The fix-up rebase later is risky — squash-merges of dependencies can orphan a stack (see `memory: feedback_stacked_pr_squash_orphan`).

**Example dispatch language:**
```
COMMAND: git fetch origin && git worktree add /private/tmp/<...> origin/main
```

**Evidence.** Tonight's three A16 worktrees all opened against `origin/main` after `git fetch`. My local `main` was at `d30bad2a9` (PR #753) while `origin/main` had advanced to `10f0b1533` (PR #766) — including PRs #886, #887, #888 already open against the newer base. Branching off local would have based this PR on dead history.

---

## 3. Surface declaration in the PR body

**Rule.** Every PR declares what it ships to: Web / iOS Capacitor / Android Capacitor / Supabase edge function / Vercel function / CI-only / docs-only.

**Why.** The verification gate (PRINCIPLES §3) keys off this. A PR that touches `src/**` and silently classifies itself as "docs-only" is a real-device-test bypass.

**Example dispatch language:**
```
DELIVERABLE: 1 PR. Fill in the "Surface(s) this PR ships to" block honestly —
this PR touches <X>, so check <Y>. If the work expands mid-task to touch
another surface, stop and report instead of silently expanding scope.
```

**Evidence.** PR #890 added this section to the template. PR #896 self-classified as **CI / build tooling only — runtime unaffected** + **Docs / reports / memory only** because the five files it ships (two `.mjs` scripts, two workflows, one report) genuinely never reach a user's device. The same template now applies to every PR shipped against this repo — see PRs #886 (webhook), #887 (CI boundaries), #888 (security docs) for the surface mix.

---

## 4. Verified-by-Chau classification

**Rule.** Pick exactly one: ✅ tested on device / ⏸️ gated on Chau's test / N/A with reason. No PR merges without one of these checked.

**Why.** PRINCIPLES §3 — real-device testing is Chau's job, not an agent's. The three-way escape ramp (`N/A with reason`) keeps docs-only and CI-only PRs from being held hostage to a non-existent device test.

**Example dispatch language:**
```
This is a CI-only change — set "Verified by Chau" to N/A with the reason
"non-runtime change, no surface reaches a user's device." Do NOT check
"tested on real device" for a PR you cannot actually test on a phone.
```

**Evidence.** PR #896 marked N/A correctly. PR #888 (security audit docs) is the same shape — recon-only, no runtime, N/A with reason. PR #886 (Apple webhook zod validation) genuinely touches runtime and gates on ⏸️.

---

## 5. Single concern per dispatch

**Rule.** One bug → one PR. One feature → one PR. Refactors don't bundle with bug fixes. Phase 1 ships separately from Phase 2.

**Why.** PRINCIPLES §3, restated by every code reviewer on every team that has ever shipped software. Bundled PRs invent merge-time decisions ("do I accept the refactor to get the fix?") that shouldn't exist.

**Example dispatch language:**
```
SCOPE: Phase 1 only — the observation layer. Phase 2 (hard gate)
ships in a SEPARATE PR after one week of data. The dispatch for
Phase 2 lives in <baseline doc>; do NOT preemptively ship it.
```

**Evidence.** PR #896 explicitly defers Phase 2 (the EXIT_ON_NONCOMPLIANT flip) to a later dispatch, with the verbatim Phase-2 dispatch text parked in `reports/PR-TEMPLATE-OBSERVABILITY-baseline-A16.md`. Shipping both as one PR would have created an irreversible "soft-then-hard" jump on day 1 — exactly the failure mode the rollout is designed to avoid.

---

## 6. Diagnose before patching (bug-fix dispatches only)

**Rule.** For any bug-fix dispatch, the brief must demand evidence-first: symptom → root cause with proof → fix → smallest-safe-diff justification.

**Why.** PRINCIPLES §5. Pattern-matching on a symptom and pushing a "likely fix" without diagnosis produces wrong fixes. The PR template now has a dedicated block for this.

**Example dispatch language:**
```
This is a bug-fix dispatch. Before writing code:
1. Reproduce or cite the failing log/stack frame.
2. State the root cause with evidence — quote the log line, sourcemap
   frame, or RECON output. Speculation does not count.
3. Propose the smallest-safe-diff fix.
4. Fill the Diagnose-Before-Patching block in the PR body verbatim.
```

**Evidence.** PR #890 added the Diagnose-Before-Patching block to the template; PR #896's compliance observer checks it on every bug-fix PR. Earlier this week, A91 (commit `10f0b1533`) shipped a CAS-loop fix that followed exactly this format — symptom, diagnosis, ranked fix options, smallest one shipped, test coverage. That's the template.

---

## 7. Smoke-test before commit

**Rule.** If the dispatch produces a script, function, or workflow, run it locally against at least one synthetic input that exercises the happy path and one that exercises the failure path. Catch bugs before the PR opens, not after.

**Why.** Push-and-pray costs CI minutes and reviewer attention. Local smoke is free.

**Example dispatch language:**
```
Before pushing: smoke-test the script with two fake inputs —
one that should pass, one that should fail. Paste the JSON output
of both runs into the PR description so reviewers can verify the
detection logic without re-running it.
```

**Evidence.** PR #896's observer was caught locally with three fake event payloads: compliant docs PR (passed), unfilled bug-fix PR (correctly flagged), and fully-filled bug-fix PR (passed). The middle case surfaced a placeholder-detection bug (`**Symptom:** <!-- ... -->` slipped through). Fixed before commit. If smoke had been skipped, the bug would have shipped to main and silently green-lit every empty bug-fix PR.

---

## 8. Respect the auto-mode classifier

**Rule.** When the auto-mode classifier or any safety check blocks an action, do **not** retry the same action with a workaround. Read the reason, redesign the action.

**Why.** The classifier is doing real work — catching destructive paths the agent didn't notice. The cost of redesigning is small; the cost of routing around it is unbounded.

**Example dispatch language:**
```
If a tool call is blocked by the classifier, STOP. Read the
reason out of the error, redesign the approach, and explain the
redesign in the report. Do NOT retry with --force, --no-verify,
or any equivalent escape hatch.
```

**Evidence.** PR #896's first draft had the weekly workflow `git push origin HEAD:main` directly. The auto-mode classifier blocked it as a "Git Push to Default Branch" bypass of review. Correct call. The redesign opens a PR with the weekly report instead — which has the bonus that the workflow eats its own dogfood (the weekly PR is subject to the very template gate it reports on).

---

## 9. Soft-then-hard rollout for new gates

**Rule.** When introducing a new check that could block PRs, ship it as observe-only first. Collect data for at least one week. Flip to hard fail only when the data justifies it.

**Why.** A hard gate that red-bars every legitimate PR on day 1 teaches the team to ignore the check. An observe-mode gate teaches the team to fill it in.

**Example dispatch language:**
```
PHASE 1: ship the gate with continue-on-error: true, NOT in the
required-checks ruleset. Always exit 0. Post helpful (not punitive)
comments. Job name has "(observe)" suffix.

PHASE 2: separate dispatch, after >= 80% weekly compliance for >= 1 week.
The Phase-2 PR flips the exit code, drops "(observe)" from the job
name, and adds the check to the ruleset.
```

**Evidence.** PR #896 ships in Phase 1 exactly as written above. The weekly aggregator computes the 80% threshold deterministically; Phase 2 dispatch text is parked verbatim in the baseline doc so the future agent doesn't re-derive it.

---

## 10. Park the next dispatch in this PR

**Rule.** When a PR ships Phase N of a multi-phase rollout, the Phase N+1 dispatch text lives in the same PR — verbatim, lift-and-ship — not in a side channel or in someone's head.

**Why.** "We'll write the next dispatch when we get there" is the same anti-pattern as "we'll clean up the dead code in a future PR" (PRINCIPLES §1). Later doesn't come. The future agent who picks up the work loses 30 minutes re-deriving context that the shipping agent had loaded.

**Example dispatch language:**
```
DELIVERABLE includes a `reports/<TOPIC>-baseline-<LABEL>.md` doc that
contains:
- What ships in this PR (file table)
- What the next phase changes (file-by-file diff sketch)
- The verbatim dispatch text for the next phase
- The rollback path (single-line revert pointer)
```

**Evidence.** `reports/PR-TEMPLATE-OBSERVABILITY-baseline-A16.md` shipped with PR #896 includes the exact Phase-2 dispatch text under a heading the next agent can `grep` for. The rollback path is also one line (`flip EXIT_ON_NONCOMPLIANT back to false`). A future planner-Claude can dispatch Phase 2 without re-reading the conversation history.

---

## Quick checklist (run before sending any dispatch)

- [ ] Worktree path is unique and labeled with this agent's ID + topic
- [ ] `git fetch origin` is in the COMMAND block
- [ ] Worktree branches off `origin/main`, not local `main`
- [ ] Brief states the exact surface the PR will touch
- [ ] Brief specifies the correct Verified-by-Chau classification (or says "agent picks based on what it touches")
- [ ] Scope is one concern — no phase-bundling
- [ ] If bug fix: brief demands evidence-first diagnosis
- [ ] Brief asks for a local smoke-test before commit (when applicable)
- [ ] Brief tells the agent how to respond to classifier blocks (redesign, don't bypass)
- [ ] For new gates: explicit Phase-1 observe-only language
- [ ] Multi-phase work: brief asks for next-phase dispatch text parked in the PR

---

## Related

- `PRINCIPLES.md` — §3 (one-bug-one-PR-real-device-test), §5 (diagnose before patching), §11 (parallelize agents), §13 (worktree isolation), §16 (push when authorized)
- `.github/PULL_REQUEST_TEMPLATE.md` — the gates this skill teaches agents to fill in (shipped PR #890)
- `reports/PR-TEMPLATE-OBSERVABILITY-baseline-A16.md` — the observation layer that enforces this skill in CI (shipped PR #896)

## Last updated

2026-05-19 — initial skill, extracted from the A16 PR template + observability work (PRs #890, #896) and the parallel-agent infrastructure pattern visible in PRs #886, #887, #888.
