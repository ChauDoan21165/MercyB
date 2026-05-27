# MercyB Roadmap

## Competitive Positioning

**MercyBlade beats Duolingo for Vietnamese↔English learners because it understands L1 interference, pronunciation pain, placement, and learner weakness.**

This is the canonical positioning sentence. It is not "Duolingo competitor" in the broad sense. The reachable game is Definition B: own the Vietnamese↔English pair on both axes (VN→EN for the diaspora and Vietnam-resident English learners; EN→VN for English speakers learning Vietnamese), because Duolingo's Vietnamese coverage is shallow on pronunciation and does not model Vietnamese L1 interference at all.

Stages 1–11 below remain the long arc. The competitive frame is what "winning" means before the long arc is climbed.

## Long-term Vision — The Ladder

| Stage | Name | What it does |
|-------|------|-------------|
| 1 | **Lesson App** | Basic lessons and exercises. |
| 2 | **AI Tutor** | Teacher Mercy answers, corrects, and guides the learner. |
| 3 | **Study OS** | Controls the study path — what the learner knows, what they are weak at, what to study next, how to review. |
| 4 | **Learning Intelligence Platform** | Learns which teaching method works best for each learner, age, language background, and mistake pattern. |
| 5 | **Education Ecosystem** | Connects students, parents, teachers, classes, curriculum, and progress. |
| 6 | **Personal AI School** | A full personal school experience that adapts to each learner. |
| 7 | **AI Education Civilization Layer** | AI education infrastructure for many learners, families, teachers, and schools. |
| 8 | **AI Human Potential Infrastructure** | Helps learners grow beyond language: thinking, confidence, career, creativity, life skills. |
| 9 | **AI Civilization Partner** | Supports families, communities, schools, and larger systems with better learning and decisions. |
| 10 | **AI Co-Evolution System** | Humans improve the AI, and AI improves humans, continuously. |
| 11 | **AI Legacy System** | Preserves and transfers family wisdom, language, culture, and values across generations. |

## Current Build Path

1. Finish foundation (Stages 1–2, substantially done; §15 Vietnamese flagship is the polish on this).
2. Build Study OS in the 3A → 3B → 3C → 3D sequence below.
3. Hold Stage 4 (Learning Intelligence Platform) until Stage 3 ships signal worth learning from.
4. Build Stage 5 Parent/Teacher View only after Stage 3 signal is trustworthy and safety rules are clear.
5. Do not sequence Stages 6–11 in execution terms until Stage 5 ships. They remain on the horizon, not in the queue.

## Stage 3 — Study OS Sequence

Stage 3 is four bricks, sequenced. Each brick has a name, a posture, and a non-negotiable safety rule encoded in the name itself.

### 3A — "What I'm Weak At" / Local Weakness Map

Read-only, local-only, descriptive. Surfaces top Vietnamese↔English weakness patterns from L1 detector + Placement + pronunciation signals. No recommendations, no scores, no streaks at this stage — descriptive only.

Ships with a marketing-visible demo artifact: one screen, one story, one sentence — *"Duolingo tells you to keep a streak. MercyBlade tells Vietnamese learners why they keep making the same English mistake."*

**Hard prereq:** §15 Bar #1 (L1 grammar coverage gap closed) must tick — both #1164 (`vi_l1_future_adverb_bare`) and #1169 (`vi_l1_subject_gender`) merged. Otherwise 3A ships with an incomplete detector surface and misrepresents the wedge.

**Status (2026-05-26):** Signal layer complete. The three adapter PRs (#1201 L1 detector tag mirror, #1202 Placement v3 snapshot mirror, #1203 pronunciation phoneme mirror) are on `main`. Wave 2 closed the reducer side: the local weakness aggregator (reducer over the three adapter signals) and the learner-language taxonomy the aggregator references both merged on 2026-05-26, alongside test-coverage adds for `vi_l1_co_transfer` (#1187) and `vi_l1_no_aux_negation` (#1189). Local-only input seams + aggregator + taxonomy are in place. Day 4 — the user-facing route/screen — is the next slice.

**Status (2026-05-27):** Stage 3A shipped. The Local Weakness Map UI component, the `/weak-at` route (linked from Home), and lightweight performance instrumentation around the aggregator are all on `main`. The marketing-visible demo artifact specification lives at `docs/stage-3a/marketing-screenshot-spec.md` — pre-screenshot seed data, viewport, framing copy, and per-platform posting checklist. The E2E + invariant-guard test pass is still pending (separate MR); it gates audit confidence but not the launch artifact, since the screenshot is captured against a developer-seeded device store rather than CI state. The next brick is Stage 3B Suggested Practice — soft suggestions only, `(c+)` trigger semantics — already fully specified in §3B below; no design pass needed before authoring begins.

### 3B — Suggested Practice (not Planner)

Soft suggestions only. *"You may want to practice…"* never *"You must complete…"* No streaks, no XP, no guilt, no daily coercion.

**Trigger semantics (c+): context-triggered and learner-controllable.**

**Operational rule:** Suggested Practice appears only when there is fresh local evidence and a useful next action.

Trigger conditions:
- Learner completes a lesson, tutor turn, placement step, or pronunciation exercise.
- Local detector / pronunciation / placement signal identifies a repeated or high-confidence weakness.
- App shows one soft suggestion in learner-facing language (e.g. *"You may want to practice future-time word order next."* / *"This keeps showing up in your English: final consonant sounds. Want a 2-minute review?"*).

Guardrails:
- No daily requirement.
- No streak language.
- No XP / reward loop.
- No shame or guilt copy.
- No pushy modal.
- No server write.
- No global learner score.
- Dismissible every time.
- Learner can turn suggestions off entirely.

### 3C — Review Queue

Local spaced repetition over flagged items and errors. Scheduled against the learner's L1 errors and pronunciation pain points, not against generic word frequency or streak mechanics. No XP. No streak pressure.

### 3D — Mastery Map

Deferred until Stages 3A–C have produced enough signal. Shows what the learner appears to know — not a fake score, not a level, not a percentile. Hardest brick of the four; depends on the others producing signal first.

## Stage 5 — Parent/Teacher View

Built only after Stage 3 produces trustworthy signal and the safety rules are clearly established. The competitive function is **diagnostic transparency, not gamified motivation** — *"Here is what this learner actually struggles with"* — which Duolingo cannot offer because they do not have a mastery model.

For Vietnamese diaspora families specifically, where learning is heavily mediated by parents and family members, diagnostic transparency is a stronger viral loop than streaks or XP. This is where Definition B becomes economically real.

## Stage 3 Study OS Boundaries

Stage 3 Study OS is four related directions, not one vague analytics blob:

- What the learner knows.
- What the learner is weak at.
- What to study next.
- How to review.

Safe local event summaries, such as summaries derived from #1109 local learning events, are only the behavioral signal layer for Study OS. They may later inform progress, momentum, or next-focus UI, but they do not replace the four directions above.

Study OS event summaries must stay:

- local-only
- time-windowed
- behavioral/activity-based
- derived from safe counts, booleans, and timestamps only

Study OS event summaries must not include raw learner content, full transcripts, raw audio, corrected sentence text, PII, child identity, Placement result/status/writeback, Supabase sync, or external analytics.

`mercy_user_facts` / episodic memory is semantic person memory: what Mercy remembers about the learner/person. Study OS event summaries are not semantic memory: they describe what the learner has been doing recently in study flows. Do not read, write, merge, or sync Study OS event summaries with `mercy_user_facts` unless a later explicit reviewed design approves it.

## Local-Only Posture

The local-only posture is preserved through all of Stage 3. It is broken only when a **named, high-value reason** emerges — not when it feels ready, not when it would be convenient. The current Boundaries section is a strength, not a constraint to engineer around.

No recommendation/coaching/scoring/streak/shame mechanics. No Supabase sync. No external analytics. No memory write. No Placement writeback.

## §15 Relationship

§15 (Vietnamese flagship Definition of Done, in STRATEGY.md) closure gates **"second pair work"** — starting serious work on Korean / Japanese / Chinese / French / German / Spanish.

§15 closure does **not** gate Stage 3A within the Vietnamese flagship. Stage 3A is depth-within-pair; §15 second-pair gating is breadth-across-pairs. The two run on different axes.

Stage 3A begins as soon as Bar #1 ticks. Bars #6 (native Sentry on-device) and #7 (named Vietnamese learner outcome) run on owner timeline and do not block Stage 3A.

## Rule

Big vision is allowed. Execution stays focused on the next brick.
