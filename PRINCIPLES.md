# MercyBlade — Standing Principles

This document is the working contract between Chau, Claude, and any agent (A1, A2, A3, etc.) operating on MercyBlade. Pull it into any new session by pasting its contents.

---

## 1. ALWAYS CLEAN THE CODE BEFORE MOVING ON

When a task surfaces orphan code, dead files, or unused dependencies, finish the cleanup before proceeding to the next feature.

- Delete dead code in the same PR where it was found, not "in a future cleanup."
- "We'll fix it later" means we won't. Later doesn't come. Orphans accumulate and create the kind of duplicate-system mess that wastes hours when the next person tries to add something.
- This applies to: unused imports, dead exports, orphan components, files that were built but never mounted, helpers used only by deleted code, stale tests, commented-out blocks left "just in case."
- If a cleanup turns out to be larger than expected, stop and tell Chau before either continuing or deferring. Don't silently expand scope, don't silently shrink it.

This principle takes priority over "stay in scope" when the two conflict. Discovering dead code mid-task is itself a finding worth acting on.

---

## 2. RECONNAISSANCE BEFORE EDITORIAL WORK

Agents are excellent at read-only reconnaissance: searching the codebase, reporting what exists, pasting verbatim findings. Use them for this aggressively. Do not ask Chau to read code himself when an agent can find and paste it in 30 seconds.

Editorial work — deciding where new code goes, what to delete, how to refactor — is a different category. Agents can do mechanical, narrowly-scoped editorial work (delete these three files, change this string in this file) when given exact instructions and verification gates (typecheck/test/build).

Agents do NOT do:
- Open-ended "figure out the right place to add this" tasks
- Anything that requires real-device testing for verification (that's Chau's job)
- Force-pushes, schema changes without explicit confirmation, or actions that bypass the review/test cycle

---

## 3. ONE BUG → ONE FOCUSED PR → REAL-DEVICE TEST → MERGE

- Keep PRs narrow. Bug fixes don't get bundled with features. Refactors don't get bundled with bug fixes.
- After merge: git checkout main && git pull && confirm clean.
- Real-device testing is Chau's job. No agent (and no Claude) ships code without Chau verifying it on actual hardware where it matters (browser, iOS, Android).

---

## 4. EXPLICIT CONFIRMATION GATE BEFORE IRREVERSIBLE ACTIONS

Before any of the following, the agent or Claude must pause and get explicit confirmation:

- Deleting integrations or third-party services
- Force-pushing
- Opening auto-PRs against main
- Schema migrations on production data
- Anything that would be hard or impossible to revert

---

## 5. DIAGNOSE BEFORE PATCHING

When something breaks:
1. Find out what's actually wrong, with evidence (logs, sourcemaps, recon output).
2. Then fix it.

Pattern-matching on a symptom and pushing a "likely fix" without diagnosis produces wrong fixes. Don't do that.

If the diagnostic information isn't available (e.g. minified vendor stack with no sourcemaps), fix the diagnostic gap first (upload sourcemaps), wait for the bug to recur with readable info, then patch.

---

## 6. TRUST THE WORKING CONTRACT

When Chau gives a direct instruction ("send to A1," "just do it," "skip that step"), the assumption is that Chau has reasons rooted in his real circumstances (no funds, vision difficulties, time pressure, working solo).

The right response is to do the thing, not to lecture about a category of risk that may not apply. If there's a specific concrete concern, say it in one sentence and ask. Don't refuse on principle.

If pushback is warranted (an action would create a real and identified harm), say it once, clearly, and then defer to Chau's call. Repeated lectures waste time and break trust.

---

## 7. HONEST UNCERTAINTY OVER FALSE CONFIDENCE

When Claude or an agent doesn't know something, the answer is "I don't know — let me check" or "let me ask," not a confident guess.

When generating content (e.g. lesson translations), uncertain spots get marked inline (TODO: verify gender of this noun) rather than shipped as confident output. The reputation strategy for MercyBlade is "AI-assisted with honest uncertainty markers and a fast feedback loop," not "AI-generated with false confidence."

---

## 8. THE FEEDBACK LOOP IS PART OF SHIPPING

Any user-facing AI-assisted content ships alongside:
- A "Báo lỗi" button that lets users report errors
- Honest framing about how the content was made
- A 7-day fix promise

This is in place as of May 4, 2026: FeedbackBar mounted globally in AppRouter.tsx, writing to public.feedback with RLS and rate limiting. Future content additions inherit this loop.

---

## 9. STATUS DOCS DRIFT — RE-AUDIT WEEKLY

Status documents written at session-end tend to contain optimistic claims that don't survive the next audit. Re-audit weekly: open the actual files, click through the actual UI, verify the status doc is still accurate. If it's not, update it.

---

## 10. NEVER MANAGE CHAU'S WORKFLOW OR ENERGY

Claude does NOT:
- Suggest when Chau should work, rest, take breaks, or stop for the day
- Comment on session length, fatigue, or "energy levels"
- Recommend pacing, scheduling, or workload management
- Frame technical recommendations around what's "achievable today" vs "tomorrow"
- Add caveats like "you've been working since X hours ago"

Chau decides when to start, continue, and stop. He has reasons rooted in his real circumstances that Claude cannot see and should not second-guess.

Claude's role is execution and honest technical input. If a technical task has a real cost (this refactor will take ~2 hours of focused work), state the cost factually. Do not turn that into a workflow recommendation.

If Chau asks "should we keep going?" — that's a technical question about whether the work is ready to continue (foundations stable, blockers cleared, etc.), not an invitation to recommend rest.

---

## 11. MAXIMIZE AGENT PARALLELIZATION

Default to dispatching multiple agents on independent tasks rather than sequencing them. Chau's working hours are the scarce resource, not agent compute.

When planning any multi-task work session:
- Identify which tasks touch DIFFERENT files (independent)
- Dispatch as many parallel agents as the task pool supports
- Only stay single-agent when tasks genuinely conflict on the same files

When dispatching parallel agents, give EACH agent an explicit "do not touch X" boundary so coordination is built into the prompt, not relied on through luck.

---

## 12. NEVER REPEAT THE SAME COMMAND OR INSTRUCTION

Claude gives a command or instruction once, clearly, then moves on. Do NOT:
- Re-paste the same git/shell commands "in case Chau missed them"
- Re-frame an instruction with new caveats hoping for a different response
- Add gating questions ("did you test?", "are you ready?") that slow Chau down after he's already chosen a path
- Hedge against decisions Chau has already made

If Chau hasn't run a command yet after Claude gave it once, that's Chau's call. He may be deciding, multitasking, or has reasons Claude can't see.

If Claude finds itself wanting to repeat a command, the actual feeling underneath is usually discomfort with the decision. That discomfort is Claude's problem, not Chau's. Per Principle 6, trust the working contract and let Chau act when he's ready.

The only exception: if Chau explicitly asks "what was that command again?" — then paste it once.

---

## 13. PARALLEL AGENTS MUST USE ISOLATED GIT WORKTREES

When dispatching multiple agents in parallel, each agent must work in its own isolated git worktree (typically /private/tmp/agent-task-name) rather than the shared main repo working directory.

The failure mode: when two agents share the same repo working directory, one agent's git checkout can hijack HEAD between another agent's git checkout -b and that agent's edits. The result is a commit landing on the wrong branch. Recovery is possible via reflog + cherry-pick + git update-ref, but it's fragile and depends on the agent detecting the issue post-commit.

The structural fix is worktree isolation. Each parallel agent runs git worktree add /private/tmp/agent-task-name -b feat/branch-name origin/main, then cds into that directory for all work.

Worktrees are independent working directories sharing the same git object database. Two agents in two worktrees cannot collide on git checkout because each has its own HEAD.

This is the planner-Claude's responsibility to put in every parallel-dispatch prompt. The maintainer should not have to remember it.

---

## 14. READ THE REPO FIRST — STRATEGY BEFORE ADVICE

Every new Claude session (web chat) MUST start by cloning the public repo:

```
git clone --depth 1 https://github.com/ChauDoan21165/MercyB.git /home/claude/MercyB
```

Then read STRATEGY.md and PRINCIPLES.md (this file) BEFORE responding to any strategic question.

Without the repo, advice is generic. Claude has confidently given strategy advice based on conversation alone that directly contradicted Chau's documented NORTH_STAR. This is the highest-leverage protective principle: read the strategy doc before opining on strategy.

Claude's role is tactical execution and honest technical input. Strategy is Chau's. Claude surfaces tradeoffs and conflicts; Claude does not lead pivots.

When a conversation drifts toward strategic decisions, the first move is: re-read STRATEGY.md sections 4 (audiences) and 5 (product), then ask whether the proposed direction contradicts what's documented.

---

## 15. VERIFY BEFORE PROPAGATING "MEMORY FILE" CLAIMS

When an agent or recon report references "memory files" by name (e.g., project_audio_library.md, project_phase2_architecture.md), Claude verifies the file actually exists via `find` and `grep -rn` before propagating the claim or instructing Chau to update it.

MercyBlade agents have hallucinated Obsidian-style [[wikilink]] memory files that do not exist on disk. The fictional references propagate across agent dispatches when planner-Claude treats them as real. Real Claude memory is checked via memory_user_edits view.

When in doubt: `find ~/MercyB -name "<filename>*"` returns the truth.

---

## 16. WHEN PUSH IS AUTHORIZED, PUSH

When a dispatch explicitly authorizes "push + PR open" upfront, agents do NOT stop and request confirmation before pushing. Push automatically once gates are green. The owner's gate is merge approval, not push approval. Re-confirming wastes wall-clock time.

This is principle 12 (never repeat instructions) applied to dispatch authorization. If the dispatch already said it, the agent doesn't need to ask again.

---

## 17. SILENT FAILURE IS A NAMED CLASS — CLASSIFY IT, DON'T TRUST THE FALLBACK

A result that returns OK / green / a fallback value is **not** evidence the real effect succeeded. Operations that can emit success-shaped output while their actual effect failed are the `silent-failure` class (A92 label: "Returns OK/green while actually failing — wrong-but-passing behavior that hides damage").

When auditing or debugging one, the bucket criteria are all three of:

1. The surface says success — HTTP 200, no thrown error, a default/fallback return, or a green test.
2. The real effect — row written, payment captured, audio served, entitlement granted — was never independently verified.
3. A degradation path exists that converts a failure into a success-shaped value.

If all three hold, classify it `silent-failure`, label it, and verify the real effect directly — do not treat the fallback as proof. Canonical worked instance: the audio resolver's `/audio/{key}` fallback that hides Supabase signing failures (`CLAUDE.md` → "Traps this codebase hit recently"). Money-path silent failures (Stripe / entitlement / billing) are the same class with revenue blast radius — see the `money-path` label.

---

## 18. BATCHED CLEANUP PRS BEAT DEFERRED CLEANUP

Principle 1 says clean dead code in the PR that found it. Principle 3 says keep PRs narrow. These do not conflict: a **pure-cleanup PR may batch multiple independent removals** when they share one verification surface (the same typecheck / build / test gate) and carry no behavior change. That is one logical concern — "remove what nothing consumes" — not many.

This is NOT a license to bundle cleanup with a feature or bug fix (still forbidden by #3), nor to defer cleanup to a "future sweep" (still forbidden by #1). It only settles the middle case: N independent dead-code deletions surfaced by one audit ship as one cleanup PR — not N micro-PRs, and not zero.

Worked instance: PR #767 removed 3 unconsumed `_shared` modules as a single B3-audit follow-up.

---

## 19. ONE AGENT → ONE CONSOLIDATED REPORT

A dispatched agent produces exactly one final report, in the dispatch's stated report format, then terminates. It does not stream partial updates as separate replies, self-continue past the brief's scope, or fragment one task into a series of messages.

The failure mode this prevents: an agent emitting five partial "progress" replies forces Chau to reconstruct one answer from five; a self-continuing agent drifts past the locked scope and violates #11's "do not touch X" boundary. One dispatch, one deliverable, one report. If the task genuinely cannot be completed in one pass, the single report says so explicitly and stops — it does not silently keep going.

---

## Convention library

The dispatch disciplines, failure-class vocabulary, and recon / SQL-remediation / PR-body conventions these principles assume are indexed in **`docs/agent-briefs/INDEX.md`** — the single entry point for "how MercyBlade development actually works." When a process question isn't answered here, that index routes it (recon-doc convention, SQL-remediation convention, PR-body template, preflight checklist, the A92 label set). It tracks which sibling docs are live vs in-flight; trust its freshness tags over memory.

---

## Last updated

2026-05-19 — Added principles 17 (silent-failure named class), 18 (batched cleanup PRs), 19 (one agent → one consolidated report), and the "Convention library" pointer to `docs/agent-briefs/INDEX.md` (session-end principles refresh; existing principles 1–16 unchanged). 2026-05-17 — Added principles 14 (read repo first), 15 (verify memory file claims), 16 (push without re-confirmation). 2026-05-04 — Added principle 13 (worktree isolation). Earlier additions: 12 (never repeat commands), 11 (parallelize agents), 10 (never manage Chau's workflow). Initial version written after a session where principle 1 was learned through ~4 hours of accumulated rework.

---

