# C3-STRATEGY.md

Owner: Chau. Enforcer: every C3 brief. Written 2026-07-07, the day the audit
showed 91/91 factory workpacks touched zero product files.
This file exists so that never happens again.

---

## 1. NORTH STAR

**Every C3 work session must change something a MercyBlade learner, developer,
or CI pipeline actually consumes.**

C3 exists to harden and build MercyBlade infrastructure — not to build,
measure, govern, or validate itself. If a week of C3 work disappeared and no
learner, no developer, and no pipeline would notice, that week was waste.

The single measure of C3's value:
**product-consumed changes landed on origin/main.**
Not ledger rows. Not PASS proofs. Not health scores. Commits on main that
something real consumes.

---

## 2. THE LAWS (violating any of these = stop the session)

Each law exists because of a specific failure that already happened.

**LAW 1 — The Dispatch Gate.** No work starts unless all three are answered:
(a) the named artifact that will exist when done,
(b) the consumer that ALREADY exists and will use it,
(c) the command that verifies it is real.
*Failure it prevents: 91 workpacks whose only consumer was the factory itself.*

**LAW 2 — C3 never generates its own work.** All workpacks come from a human
or a human-approved queue. Idle is correct when the bottleneck is human
judgment. An idle agent is cheap; a self-tasking agent built the fake factory.
*Failure it prevents: the entire Smart F Control Plane.*

**LAW 3 — No infrastructure that measures C3.** No ledgers, judges,
authorization packets, health scores, dashboards, governance layers, or
"CEO cycles." The measurement of C3 is Law 1's verification command plus
`git log origin/main`. Nothing else.
*Failure it prevents: governance paperwork validating governance paperwork,
e.g. `check("deterministic_on_rerun", true)`.*

**LAW 4 — A gate must run the thing, not check the thing exists.**
`fs.existsSync('vite.config.ts')` is not a build gate. `npm run build`
exiting 0 is. Every validation in a C3 brief must execute the real command.
*Failure it prevents: 73 existence probes reported as engineering gates.*

**LAW 5 — origin/main is the only truth.** Before any fix: `git fetch origin`
and verify the premise against origin/main, never against a local branch or
memory. If reality diverges from the brief, STOP and report — do not force
the brief.
*Failure it prevents: pushing 15aca1e7, which would have regressed main's
typecheck:app from 12288 to 4096. Caught three separate times on 2026-07-07.*

**LAW 6 — No fix without reproduction.** If the reported bug does not
reproduce, report that finding and stand down. Never fabricate a fix, a
test, or a premise.
*Failure it prevents: "fixing" the home-page language bug that turned out
to be intentional bilingual design with guarding tests.*

**LAW 7 — Measure before choosing values.** Heap sizes, timeouts, caps,
thresholds: run the measurement, then decide. Never guess a number onto a
shared branch.
*Failure it prevents: shipping ci-heap=4096 when the real peak was 2.9 GB
on a smaller tree than main's.*

**LAW 8 — Scope is sacred.** One brief = the named files only. Stage
surgically, preserve rejected work as a patch, never discard silently,
never push without the brief authorizing that exact branch name.

**LAW 9 — Self-reports are never evidence.** Every claim by any agent
(including C3) is verified by artifact: file on disk, commit on origin,
command exit code. "Session ran" and "report says PASS" prove nothing.

**LAW 10 — Product data outlives the device; factory data never enters
the repo.** Learner data belongs in Supabase (durable, RLS-protected).
Factory/agent state (queues, ledgers, reports) never gets committed to
the product repo — .gitignore it.

---

## 3. ROADMAP (numbered, in order — each unblocks the next)

### Phase 1 — Close the open threads (this week)
1.1 Land `fix/typecheck-ci-heap` (ci heap → 12288) on main via MR. *(in flight)*
1.2 H2: Supabase env guard coverage — every entry path fails with a clear
    message, never a stack trace. *(brief written, ready)*
1.3 H7: .gitignore factory-state paths so agent runtime data can never be
    committed to the product repo again. *(trivial, same session as 1.2)*

### Phase 2 — The strategic build: durable learning-event sink
2.1 Design: `learning_events` table in Supabase — schema, RLS (learner reads
    own rows only), sanitized payloads, mandatory `rule_or_detector_id`
    provenance. Migration via SQL Editor only (never `supabase db push`).
2.2 Sync client: extend the existing `recordLearningEvent` path
    (localStorage stays as offline queue) with batch flush to Supabase.
    Consumer already exists: the write path writes today; Lane A's Reflex
    Arc reads tomorrow.
2.3 Verification (Law 4 style): record event on device → query row in
    Supabase → wipe localStorage → row survives.
2.4 Why this outranks everything: MercyBlade's moat is learner-weakness
    data, and today that data evaporates in 30 days / 200 events per
    device. Every day without the sink is permanent data loss. This is
    the prerequisite ("#0") for the entire intelligence sequence.

### Phase 3 — Remaining hardening debt
3.1 H3: pre-commit hook vs 2-minute agent timeout — targeted lint/
    incremental typecheck so scoped commits complete in the foreground.
3.2 H6: CI disk-space precheck + verify the disk-clean guard actually
    fires on both runner machines.
3.3 H5: `searchRooms calculateScore()` +0.5 hasData defect — BLOCKED on
    Chau's ranking-floor decision. Stays frozen until that decision.

### Phase 4 — Intelligence infrastructure (only after Phase 2 proves out)
4.1 Support Lane A's Reflex Arc v2 with the sink as its durable store.
4.2 Prune-priority / retention logic for high-surprise events (rides with
    Lane A unless Chau grants a one-file exception).
4.3 Nightly consolidation infrastructure — ONLY when Lane A's surprise-
    ranking metric has passed its own acceptance test. No pre-building.

### What is permanently OUT of the roadmap
- Rebuilding any factory apparatus (control planes, ledgers, judges,
  CEO/HQ orchestration — all retired vocabulary).
- Anything under `src/lib/tutor/**` (Lane A's exclusive surface).
- Judge/Coverage/TM INT systems (C2's surface).
- Open-ended "scan for problems" hunts — every brief names its target.

---

## 4. CELL INTELLIGENCE — DOES IT HELP C3? (verdict)

Two different things share the word "cell." Keep them separate:

**4.1 The product concept: KEEP.** "Cell" as a curriculum unit is real —
`learnerReadinessPolicy` predicts learner success *per Cell*, with
prerequisites and mastery. A registry of curriculum Cells with stable IDs
and prerequisite edges ("genome") is genuinely valuable: it is what
placement, readiness gating, and weakness tracking hang off. But it is
**Lane A's surface**, and it only earns investment when a named product
consumer reads it (the readiness policy, the placement flow).

**4.2 The cell-os apparatus: RETIRED.** The frozen `cell-os/` code
(registry validators, canonical-cell-map, relationship graphs) has zero
product consumers today — the audit confirmed it validates an Admin
inventory nothing reads. One file was genuinely well-built
(`canonical-cell-map-validator.mjs`), which proves the point: good code
with no consumer is still waste. Law 1 applies.

**4.3 The salvage path, if ever wanted:** the day Lane A needs a formal
Cell registry (IDs, prerequisites, mastery thresholds) as input to
readiness/placement, the validator's schema-checking logic can be lifted
out of cell-os and wired to that real consumer — as a Lane A workpack
with a named reader, not as a C3 platform. Until that day: HOLD, touch
nothing.

**Bottom line: cell intelligence helps MercyBlade (via Lane A, later);
it does not help C3 work. C3's leverage is Phase 2 — making learner data
durable — not modeling curriculum genomes.**

---

## 5. THE ONE-LINE TEST (read before every session)

Before dispatching anything to C3, ask:
**"If this succeeds, what does a learner, developer, or pipeline get that
they don't have today?"**

If the answer contains the words *ledger, judge, governance, health,
packet, wave, batch, or dashboard* — stop. That is the factory rebuilding
itself. Point C3 back at the roadmap.

---

## 6. JULY 2026 OPERATING AMENDMENTS

Run this first in every fresh shell:
`source scripts/factory/factory-env.sh && node scripts/factory/host-preflight.mjs`.

Every brief starts with a lane declaration. The intake test gains:
**"Is this my lane?"** If not, stop or hand off.

Every brief carries a `PREMISE FIRST` block: verify the stated surface against
`origin/main` before building, then report the current file map and behavior.

No WP closes on merge state. The done-condition is a named, observed runtime
artifact stated in the WP up front. Merged != deployed != applied != observed.

When a defect resists one diagnosis pass, the next MR is structured logging on
that path, then resume diagnosis from observed logs.

Every fix-class MR ships its scanner check in the same MR or the next MR, so
the class is enforced instead of remembered.

Accepted residual risk is written down under `ACCEPTED-RISKS` with one-line
reasons, so future scans do not re-litigate the same verified acceptances.

Use `docs/factory/BRIEF-TEMPLATE.md` as the canonical dispatch skeleton.
