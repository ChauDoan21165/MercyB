# MercyB Layer Model (L0–L7) — canonical home

> **Migrated 2026-06-05 (V3 forward-fix).** This is the canonical rehome of the
> L0–L7 layer model and 11-stage ladder that previously lived in the deleted
> `ROADMAP.md` (removed in the V3 STRATEGY adoption, commit `d73f91674`). Content
> below is preserved **verbatim** from `ROADMAP.md@d73f91674^` so no invariant text
> lives only in git history. Layer-detail for L4/L5/L6 also has dedicated homes
> (`L4-diagnostic-intervention-layer.md`, `L5-pedagogy-decision-record.md`,
> `L6-parent-teacher-family-layer.md`); this doc is the full-model index they anchor to.
> Strategic direction is governed by the V3 `STRATEGY.md`; the Vietnamese-flagship
> Definition of Done now lives in `CURRENT-STATE.md`.

# MercyB Roadmap

> **Restructured 2026-05-27.** This roadmap replaces the prior
> sequential 11-stage ladder with an 8-layer model (L0–L7) that
> separates **substrate** from **active build** from
> **research-needed** from **parallel opportunity** from
> **emergent identity**. The previous 11-stage table is preserved
> under § Previous structure for reference.
>
> **Read this alongside:**
> - `STRATEGY.md` — product mission, pair matrix, Definition of Done
>   (`CURRENT-STATE.md` §15), Duolingo competition strategy
>   (`STRATEGY.md` (V3 — Competitive thesis)), and the compressed
>   build-progress roadmap (§7 — a different artifact from this
>   layer model; the two coexist).
> - `PRINCIPLES.md` — collaboration rules.
> - `CLAUDE.md` — architecture invariants.
> - `docs/architecture/system-overview.md` — where each system lives.

---

## What changed in this version

Prior structure: a sequential ladder ordered by build sequence
(11 named stages — preserved in § Previous structure below). It
read like "do step 1, then step 2, then step 3" — which obscured
that some layers are **substrate** (must always be true, never
"done"), some are **active engineering** (the next brick), some
are **research-blocked** (need owner decisions before code can
land), some are **parallel opportunities** (not gated on the
sequential predecessor), and some are **emergent** (not directly
buildable; they appear when their inputs land).

The new structure makes those distinctions explicit. What this
restructure says out loud:

- **L1 is substrate, not polish.** Bilingual VI/EN and
  privacy-by-default are foundational. Erosion compromises product
  identity, not just polish.
- **L3 is shipped passive, not "shipped."** The diagnostic signal
  is captured and surfaced at `/weak-at`. The diagnostic loop is
  ~30% closed — the learner has to visit the surface to see it.
  L4 is where the loop becomes directive.
- **L5 is owner-decision-heavy, not just engineering.** The
  pedagogy layer cannot be completed by engineering alone.
- **L6 is a parallel-track candidate, not a sequential successor.**
  Differentiation-per-effort may be the highest in the roadmap.
- **L7 is emergent, not buildable.** Positional identity (the
  product MercyBlade IS) rather than comparative (what it isn't).
- **"Above Duolingo" is dropped from the canonical structure.** It
  defined the product comparatively. The replacement is positional
  (L7). The comparative framing is preserved as internal motivation
  in § Competitive context.

---

## Layer Structure

### L0 — Foundation

**Status: largely complete.**

The platform substrate underneath everything else:

- Auth — Supabase auth with anonymous bootstrap
  (`src/lib/auth/anonymousBootstrap.ts`) and the post-2026-05-26
  OAuth-chain hardening per `docs/runbooks/disaster-recovery.md` §4.
- Production path — Netlify-primary deploys, Vercel as documented
  recovery host, GitLab as canonical repo. See
  `.github/workflows/DEPLOYMENT.md`.
- Security hardening — #578 profiles RLS freeze, #562 access-codes
  admin RLS, the RLS-denial Sentry alert rules (`17072095`,
  `17072096`).
- L1 detector rule packs — `src/lib/feedback/rule-packs/vi/`
  (Vietnamese-side, 15 grammar families) and
  `src/lib/feedback/rule-packs/en-vn/` (English-side, 8 detector
  rules). These are *inputs* to higher layers; the rule packs
  themselves are foundation.
- Native identity — `com.chaudoan.mercyblade` (iOS) /
  `com.mercyapps.mercyblade` (Android), locked-divergent. See
  `docs/architecture/systems/native-shells.md`.
- Release gates — the three required CI checks (ci.yml legacy +
  the GitLab CI port in flight), `npm run typecheck:ci`, the
  `evals/.baseline.json` golden eval that gates the L1 detector
  surface (§15 Bar #2).

Closed across late 2026-04 through 2026-05 in the security backlog
clearance + the RLS hardening + the §15 Axis 1 Bar #1 / #2 / #5
closure waves. New work in L0 is exceptional rather than ongoing.

### L1 — Bilingual + Privacy Substrate

**Status: largely shipped, never "finished" — substrate, not polish.**

The non-negotiables every higher layer sits on:

- **VI/EN parity in every user-facing surface.** Vietnamese is
  primary, English is secondary; not the other way around. The
  picker is the anonymous entry point (Locked #14). The chrome
  language (`nativeLang`) and lesson UI gloss (`lessonUiLang`)
  are distinct axes that must both work.
- **Shame-language guardrails.** The tutor, Stage 3 surfaces,
  and the Mercy persona are scrubbed of "behind" / "you should
  have" / "you failed" framings. Mercy is warm, encouraging,
  teacher-voiced.
- **Local-only-by-default behavioral signal.** Stage 3A adapters
  (`src/lib/stage-3a/adapters/`) write only to `localStorage`.
  `mercy_user_facts` (semantic person memory) and Study OS event
  summaries (behavioral signal) are **separate stores** and never
  cross-write. See `docs/architecture/systems/study-os-stage-3.md`
  + `study-os-stage-3.md` (Study OS Summary Boundary).
- **No surveillance.** Marketing/tracking consent is per-device
  localStorage (memory:
  [[project_marketing_consent_is_tracking]]). No cross-device
  behavioral tracking without explicit, separate opt-in.
- **No streaks / XP / badges as primary loops.** Streaks may exist
  as quiet retention helpers; they are never the primary motivator.
  Per `STRATEGY.md` (V3 — Competitive thesis) — *"Duolingo tells you to keep a streak.
  MercyBlade tells Vietnamese learners why they keep making the
  same English mistake."*

**This layer is substrate.** It does not have a "done" state. The
bilingual sweeps continue (memory:
[[project_vi_sweep_policies]]). The privacy posture is encoded in
adapter / engine contracts; every future feature must clear the
boundary review or compromise the substrate.

Erosion compromises product identity, not just polish. If an L1
contract is loosened to satisfy a higher-layer feature, the higher
layer is in scope-violation territory.

### L2 — Learning OS

**Status: active / stabilizing.**

The current production learning surface:

- **Rooms.** ~488 JSON files under `public/data/` rendered via
  `src/components/room/RoomRendererUI.tsx`. Route: `/room/:roomId`.
  Audio resolves through `src/lib/roomAudioResolver.ts` to the
  Supabase `room-audio` bucket (post-d2951ddd; kids + music
  included; offline-after-first-play via the PWA service worker).
- **AI Tutor.** Live `guide-assistant` Supabase edge function
  serves production today. The Phase B pure-function library at
  `src/lib/ai-tutor/` (gated `AI_TUTOR_ENABLED=false`) is the
  next-generation surface and carries the §15 Axis 1 Bar #3 L1
  injection. See `docs/architecture/systems/ai-tutor.md` for the
  dual-layer reality.
- **Placement v3.** The server-side 2PL IRT engine at
  `supabase/functions/placement-session/engine/*` + the browser
  recommender at `src/lib/placement/v3/`. §15 Bar #5 (placement →
  lesson routing E2E) closed via PR #1143. See
  `docs/architecture/systems/placement-v3.md`.
- **L1 detector consumption.** Bar #3 closed: the Vietnamese L1
  profile (`vietnameseL1Profile`) is injected into the tutor's
  system prompt by `promptAssembly.ts:295`. The English-side
  EN→VN rule pack ships in isolation (`detectEnVnError`); wiring
  into the live tutor is a follow-up.
- **Pronunciation boundaries.** Cloud scorer (Azure via
  `supabase/functions/azure-phoneme`) + local Needleman-Wunsch
  fallback (`src/lib/pronunciation/scorer.ts`). The §5 pain points
  ship as discrimination drills (Bar #4 closed). Tone production
  (Axis 2 Bar #2) remains open after two scoring redesigns.
- **Study OS.** Stage 3A signal mirroring is the L2 surface that
  feeds L3 (see below).

§15 Axis 1: 5 of 7 bars closed (Bar #1 detectors, #2 eval baseline,
#3 tutor L1 injection, #4 pronunciation drills, #5 placement
routing). Bars #6 (native crash telemetry confirmed on-device) and
#7 (named Vietnamese learner outcome) remain owner-gated.

### L3 — Diagnostic Signal Layer

**Status: shipped — passive surface only.**

The diagnostic loop's first half:

- **Stage 3A — Local Weakness Map.** Signal capture: three
  local-only adapters under `src/lib/stage-3a/adapters/` mirror
  the L1 detector tag stream, the latest Placement v3 snapshot,
  and the recent pronunciation phoneme attempts into
  `localStorage` ring buffers (cap 50 / single-object / cap 100
  respectively). The aggregator reduces those three signals into
  a weakness map. The `/weak-at` route is the learner-facing UI.
- **Stage 3B — Suggested Practice.** Engine + navigation. The
  `(c+)` trigger semantics — *context-triggered AND
  learner-controllable* — surface **one** soft suggestion when
  fresh local evidence + a useful next action exist. The
  suggestion routes the learner to a `/practice/*` URL.

**Currently a PULL system.** The learner has to visit `/weak-at`
to see the diagnostic. The engine surfaces suggestions, but the
learner has to engage with them. Closes **~30% of the diagnostic
loop**. The remaining ~70% is L4.

See § Layer detail: L3 below for the per-brick treatment
(3A / 3B / 3C / 3D), and
`docs/architecture/systems/study-os-stage-3.md` for the
implementation deep-dive.

### L4 — Diagnostic Intervention Layer

**Status: NEXT — closes the remaining ~70% of the diagnostic loop.**

The planner that turns signal into behavior change:

- **Bias what the learner sees next.** If the L1 detector flagged
  "future-time word order" repeatedly this week, the room queue
  and tutor prompt assembly bias toward that pattern next session.
- **Modify AI Tutor suggestions.** The tutor's "next steps" chips
  and follow-up question selection lean into recent weakness.
- **Influence placement resampling.** When the placement v3
  engine re-tests, it preferentially samples patterns flagged as
  fragile.

AI Tutor architecture: see `docs/architecture/AI-TUTOR-architecture.md` (four-tab seed-grown design, Phase 1 in flight).

**Push system, not pull.** L3 said "here's what you're weak at."
L4 says "let's go work on it." This is where Stage 3A/3B signals
stop being informational and become directive.

**The hard part of L3 was always L4.** L3 ships as a feature in
its own right (the marketing artifact, the diagnostic
transparency); L4 makes that diagnostic *act* on behalf of the
learner.

**Status today: prep underway.** Engineering can author L4 once
L5 produces planning principles. Without L5, L4's nudges will be
either too aggressive (re-test the same pattern five sessions in
a row) or too random (no signal of when to leave a pattern
alone). The pedagogy floor in L5 is the prerequisite.

### L5 — Pedagogy Layer

**Status: research-required, owner-decision-heavy.**

Curriculum decisions, sequencing rules, spaced-repetition policy,
L1-transfer-aware scheduling, motivation-aware pacing.

**Engineering cannot complete this layer alone.** Requires
explicit pedagogy decisions from Chau (or a pedagogy adviser):

- What is the success metric for "good planning"? Is it
  competency-on-target by week N? Engagement minutes? Self-reported
  understanding? Number of correctly-completed rooms?
- What does a "well-planned week" look like for a Vietnamese
  intermediate-English learner — five 15-minute sessions of mixed
  surface practice? Two 30-minute placement-style assessments
  plus three drills? A focus rotation across grammar / pronunciation
  / vocabulary?
- How should L1-transfer-aware scheduling weight a known weakness
  vs. a new pattern the learner hasn't seen? Is the goal
  *remediation* of existing errors, *coverage* of new material,
  or some learner-controlled mix?
- How does motivation-aware pacing detect frustration without the
  surveillance L1 substrate forbids? Local-only signals only —
  what's the signal set?

**Until those decisions land, L4 will be too aggressive or too
random.** This layer is research-blocked, not engineering-blocked.
Calendar time + decision quality, not lines of code.

### L6 — Parent / Teacher / Family Intelligence

**Status: parallel-track candidate, not sequential successor to L5.**

The differentiation-per-effort here is potentially the highest in
the roadmap.

**No competitor has a real parent view explaining a Vietnamese
kid's progress to a Vietnamese-speaking parent without shame,
gamification, or behind-framing.** Duolingo has a parent surface
that's gamified-with-streaks. Cambly's parent surface is just
"you paid for X hours." There is no equivalent for "your kid is
getting `vi_l1_topic_comment_fronting` wrong because of how
Vietnamese topicalization works — here's a 90-second video in
Vietnamese explaining what that means."

**Vietnamese diaspora + in-country parent market is large, sticky,
pays, refers.** Parents pay where learners don't. Diaspora
parents in particular pay for surfaces that bridge English
mastery to family literacy.

**Promoting from "later" to a parallel track with L4/L5 is worth
considering.** L5 is research-blocked; L6 is design-blocked but
not pedagogy-research-blocked. They run on different
dependencies.

Prior framing (Stage 5 Parent/Teacher View in the previous
structure) was directionally aligned; the restructure promotes it
from "after L5 ships" to "could run alongside L5." See § Layer
detail: L6 below for the preserved Stage 5 substance.

### L7 — Differentiation

**Status: not buildable directly — emerges from L4 + L5 + L6.**

Positional identity, not comparative. The product MercyBlade IS,
not the product it isn't:

- **"Mercy understands you as a Vietnamese speaker learning
  English, not as a generic learner."** Emerges when L1's
  bilingual substrate + L2's L1 detector + L4's directive
  intervention all converge. The tutor, the suggestions, the
  pacing all reflect that the learner's first language is
  Vietnamese. Generic global apps cannot do this at the same
  depth.
- **"Mercy plans what you should learn next, not just what you'd
  enjoy tapping."** Emerges when L4 (intervention) is grounded by
  L5 (pedagogy). The product is a tutor that *plans*, not just an
  app that *entertains*.
- **"Mercy explains your progress to people who matter to you,
  not just to you."** Emerges when L6 (parent / teacher / family)
  ships. The product is a learning surface that bridges to family
  literacy, not just an individual learner's daily ritual.

**The previous framing "Above Duolingo" is dropped from the
canonical structure.** It defined the product comparatively
(better than what?). The replacement is positional. *Above
Duolingo* is preserved as internal motivation in § Competitive
context but is not the canonical layer.

L7 is **not directly buildable**. It is what people say about
MercyBlade once L4 + L5 + L6 are real. Trying to "ship L7" is a
category error.

---

## Current effort (as of 2026-05-27)

- **L3 shipped passive.** Stage 3A Local Weakness Map and Stage 3B
  Suggested Practice are on `main`. `/weak-at` route is live and
  linked from Home. The marketing-visible demo artifact lives at
  `docs/stage-3a/marketing-screenshot-spec.md`.
- **L4 prep underway.** The planner that turns signal into
  directive nudges is the next engineering target. Gated on L5
  decisions for default-heuristic floor.
- **L5 needs pedagogy decisions before serious engineering can
  start.** This is a Chau-side or pedagogy-adviser-side task.
  Without it, L4 ships heuristics that are good enough to be
  shippable but not good enough to be defensible.
- **L6 is a candidate to promote.** Could run alongside L5 since
  the two have different blockers (research vs. design). No
  current engineering allocated.
- **L0, L1, L2 are stabilizing, not building.** Ongoing
  maintenance: §15 Axis 1 Bar #6/#7 (owner-gated), Axis 2 Bar #2
  (tone production, two scoring redesigns failed), Axis 2 Bar #5
  (named English-speaker outcome).

---

## What's missing from this roadmap

**Timelines, milestones, and success metrics per layer are not in
this document.** That is a separate planning artifact:

- **For build-progress timelines**, see `STRATEGY.md` §7 — the
  compressed Step 1–14 percentage roadmap. The §7 artifact is
  build-shape framing; this roadmap is layer-shape framing. They
  coexist deliberately.
- **For per-feature success metrics**, see the specific
  dispatch / MR description. Layer-level success metrics ("when
  is L5 done?") are owner decisions that have not been made.
- **For Definition of Done across pairs**, see `CURRENT-STATE.md` §15
  (Vietnamese flagship DoD).

This roadmap is the **layer model + status calls**, not the
execution plan.

---

## Layer detail: L3 — Diagnostic Signal Layer (Study OS Sequence)

The original "Stage 3 — Study OS Sequence" was a four-brick spec:
3A → 3B → 3C → 3D. Stage 3A and 3B are L3 today; 3C and 3D are
future L3/L4 candidates.

### 3A — "What I'm Weak At" / Local Weakness Map

Read-only, local-only, descriptive. Surfaces top Vietnamese↔English
weakness patterns from L1 detector + Placement + pronunciation
signals. No recommendations, no scores, no streaks at this stage —
descriptive only.

Ships with a marketing-visible demo artifact: one screen, one
story, one sentence — *"Duolingo tells you to keep a streak.
MercyBlade tells Vietnamese learners why they keep making the
same English mistake."*

**Hard prereq:** §15 Bar #1 (L1 grammar coverage gap closed) must
tick — both #1164 (`vi_l1_future_adverb_bare`) and #1169
(`vi_l1_subject_gender`) merged. Otherwise 3A ships with an
incomplete detector surface and misrepresents the wedge.

**Status (2026-05-26):** Signal layer complete. The three adapter
PRs (#1201 L1 detector tag mirror, #1202 Placement v3 snapshot
mirror, #1203 pronunciation phoneme mirror) are on `main`. Wave 2
closed the reducer side: the local weakness aggregator (reducer
over the three adapter signals) and the learner-language taxonomy
the aggregator references both merged on 2026-05-26, alongside
test-coverage adds for `vi_l1_co_transfer` (#1187) and
`vi_l1_no_aux_negation` (#1189). Local-only input seams +
aggregator + taxonomy are in place. Day 4 — the user-facing
route/screen — is the next slice.

**Status (2026-05-27):** Stage 3A shipped. The Local Weakness Map
UI component, the `/weak-at` route (linked from Home), and
lightweight performance instrumentation around the aggregator are
all on `main`. The marketing-visible demo artifact specification
lives at `docs/stage-3a/marketing-screenshot-spec.md` —
pre-screenshot seed data, viewport, framing copy, and per-platform
posting checklist. The E2E + invariant-guard test pass is still
pending (separate MR); it gates audit confidence but not the
launch artifact, since the screenshot is captured against a
developer-seeded device store rather than CI state. The next
brick is Stage 3B Suggested Practice — soft suggestions only,
`(c+)` trigger semantics — already fully specified in §3B below;
no design pass needed before authoring begins.

### 3B — Suggested Practice (not Planner)

Soft suggestions only. *"You may want to practice…"* never *"You
must complete…"* No streaks, no XP, no guilt, no daily coercion.

**Trigger semantics (c+): context-triggered and learner-controllable.**

**Operational rule:** Suggested Practice appears only when there
is fresh local evidence and a useful next action.

Trigger conditions:
- Learner completes a lesson, tutor turn, placement step, or
  pronunciation exercise.
- Local detector / pronunciation / placement signal identifies a
  repeated or high-confidence weakness.
- App shows one soft suggestion in learner-facing language (e.g.
  *"You may want to practice future-time word order next."* /
  *"This keeps showing up in your English: final consonant
  sounds. Want a 2-minute review?"*).

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

### 3C — Review Queue (future L3/L4 candidate)

Local spaced repetition over flagged items and errors. Scheduled
against the learner's L1 errors and pronunciation pain points,
not against generic word frequency or streak mechanics. No XP. No
streak pressure. Ships under L3 if it stays passive (the learner
opens the queue); ships under L4 if Mercy actively surfaces queue
items into the learning flow.

### 3D — Mastery Map (future L4/L5 candidate)

Deferred until Stages 3A–C have produced enough signal. Shows
what the learner appears to know — not a fake score, not a level,
not a percentile. **Hardest brick of the four; depends on the
others producing signal first.** Requires L5 pedagogy decisions to
say what "mastery" means — competency at the §15 Bar #2 detector
eval level? Performance on a held-out placement bank? Subjective
self-rating?

---

## Layer detail: L6 — Parent / Teacher / Family Intelligence

Built only after Stage 3 produces trustworthy signal and the safety
rules are clearly established. The competitive function is
**diagnostic transparency, not gamified motivation** — *"Here is
what this learner actually struggles with"* — which Duolingo
cannot offer because they do not have a mastery model.

For Vietnamese diaspora families specifically, where learning is
heavily mediated by parents and family members, diagnostic
transparency is a stronger viral loop than streaks or XP. This is
where the economic case becomes real — parents pay where learners
don't.

**Restructure note:** prior framing put this work after Stage 5
in the sequential ladder. The L6 framing promotes it to a
parallel-track candidate alongside L4 / L5, since the blockers
differ (L5 is pedagogy-research-blocked; L6 is design-blocked).

---

## Cross-cutting constraints

These constraints apply across multiple layers. They are not a
layer themselves; they shape what's allowed in L1–L7.

### Study OS boundaries

Stage 3 Study OS is four related directions, not one vague
analytics blob:

- What the learner knows.
- What the learner is weak at.
- What to study next.
- How to review.

Safe local event summaries, such as summaries derived from #1109
local learning events, are only the behavioral signal layer for
Study OS. They may later inform progress, momentum, or next-focus
UI, but they do not replace the four directions above.

Study OS event summaries must stay:

- local-only
- time-windowed
- behavioral/activity-based
- derived from safe counts, booleans, and timestamps only

Study OS event summaries must not include raw learner content,
full transcripts, raw audio, corrected sentence text, PII, child
identity, Placement result/status/writeback, Supabase sync, or
external analytics.

`mercy_user_facts` / episodic memory is semantic person memory:
what Mercy remembers about the learner/person. Study OS event
summaries are not semantic memory: they describe what the learner
has been doing recently in study flows. Do not read, write,
merge, or sync Study OS event summaries with `mercy_user_facts`
unless a later explicit reviewed design approves it.

### Local-only posture (L1 substrate constraint)

The local-only posture is preserved through all of Stage 3 (L3
today, L4 tomorrow). It is broken only when a **named,
high-value reason** emerges — not when it feels ready, not when
it would be convenient. The current Boundaries section is a
strength, not a constraint to engineer around.

No recommendation/coaching/scoring/streak/shame mechanics. No
Supabase sync. No external analytics. No memory write. No
Placement writeback.

This is an L1 constraint, not just a Stage 3 invariant. It binds
every layer above L1.

### §15 (CURRENT-STATE.md) relationship to the layer model

§15 (Vietnamese flagship Definition of Done, in CURRENT-STATE.md)
closure gates **"second pair work"** — starting serious work on
Korean / Japanese / Chinese / French / German / Spanish.

§15 closure does **not** gate Stage 3A / L3 within the
Vietnamese flagship. Stage 3A is depth-within-pair; §15
second-pair gating is breadth-across-pairs. The two run on
different axes.

Stage 3A began as soon as Bar #1 ticked. Bars #6 (native Sentry
on-device) and #7 (named Vietnamese learner outcome) run on
owner timeline and do not block Stage 3A / L3 progression to L4.

### Rule

Big vision is allowed. Execution stays focused on the next brick.

---

## Competitive context (internal motivation; not the canonical structure)

> Preserved from the prior structure as **internal motivation**,
> not as the canonical roadmap framing. L7 (above) replaces this
> as the positional identity.

**MercyBlade beats Duolingo for Vietnamese↔English learners because
it understands L1 interference, pronunciation pain, placement, and
learner weakness.**

The reachable game is Definition B: own the Vietnamese↔English pair
on both axes (VN→EN for the diaspora and Vietnam-resident English
learners; EN→VN for English speakers learning Vietnamese), because
Duolingo's Vietnamese coverage is shallow on pronunciation and does
not model Vietnamese L1 interference at all.

Use this framing for marketing, agent-dispatch context, and
strategic communication. **Do not use it as the structural model
for layer planning.** Comparative framings break when the
competitor pivots; positional framings (L7) hold regardless.

---

## Previous structure (historical, 2026-05-27)

> Preserved for reference. The 11-stage sequential ladder framing
> below is **superseded** by the L0–L7 layer model above.

The previous structure ordered all forward work as a single
build-sequence ladder from "Lesson App" through "AI Legacy
System." It read as if each stage was a sequential predecessor of
the next. The restructure replaces this with the layer model
that separates substrate / active / research / parallel /
emergent.

The 11-stage ladder, preserved as-was:

| Stage | Name | What it does | Maps roughly to |
|-------|------|-------------|------------------|
| 1 | **Lesson App** | Basic lessons and exercises. | L0 + L2 |
| 2 | **AI Tutor** | Teacher Mercy answers, corrects, and guides the learner. | L2 |
| 3 | **Study OS** | Controls the study path — what the learner knows, what they are weak at, what to study next, how to review. | L3 (3A/3B shipped) + future L4 (3C/3D) |
| 4 | **Learning Intelligence Platform** | Learns which teaching method works best for each learner, age, language background, and mistake pattern. | L4 + L5 |
| 5 | **Education Ecosystem** | Connects students, parents, teachers, classes, curriculum, and progress. | L6 |
| 6 | **Personal AI School** | A full personal school experience that adapts to each learner. | L6 + L7 |
| 7 | **AI Education Civilization Layer** | AI education infrastructure for many learners, families, teachers, and schools. | Beyond current layer model |
| 8 | **AI Human Potential Infrastructure** | Helps learners grow beyond language: thinking, confidence, career, creativity, life skills. | Beyond current layer model |
| 9 | **AI Civilization Partner** | Supports families, communities, schools, and larger systems with better learning and decisions. | Beyond current layer model |
| 10 | **AI Co-Evolution System** | Humans improve the AI, and AI improves humans, continuously. | Beyond current layer model |
| 11 | **AI Legacy System** | Preserves and transfers family wisdom, language, culture, and values across generations. | Beyond current layer model |

The prior "Current Build Path" was:

1. Finish foundation (Stages 1–2, substantially done; §15
   Vietnamese flagship is the polish on this).
2. Build Study OS in the 3A → 3B → 3C → 3D sequence.
3. Hold Stage 4 (Learning Intelligence Platform) until Stage 3
   ships signal worth learning from.
4. Build Stage 5 Parent/Teacher View only after Stage 3 signal is
   trustworthy and safety rules are clear.
5. Do not sequence Stages 6–11 in execution terms until Stage 5
   ships. They remain on the horizon, not in the queue.

The new layer model corrects two things this old build path
implied:

1. **Stage 5 doesn't have to wait for Stage 4** — L6 (Parent /
   Teacher / Family) is a parallel-track candidate to L4
   (Intervention) / L5 (Pedagogy).
2. **Stage 4 isn't a single engineering task** — it splits into
   L4 (Intervention; engineering-bounded) and L5 (Pedagogy;
   owner-decision-bounded). Conflating them produced the prior
   "build Stage 4 next" impulse that papered over the real
   research gap.

The Stage-1–11 ladder remains useful as a long-arc framing for
strategic communication. It is not the canonical model for build
planning.

---

## Cross-references

- **`STRATEGY.md`** — product mission, pair matrix (§4), product
  strategy (§5), the build-progress roadmap (§7 — a separate
  artifact from this layer model), Duolingo competition strategy
  (`STRATEGY.md` (V3 — Competitive thesis)), Definition of Done
  (`CURRENT-STATE.md` §15).
- **`PRINCIPLES.md`** — collaboration rules; §13 (worktree
  isolation), §16 (push authorization), §17 (free-agent
  redispatch), §19 (spreadsheet as source of truth).
- **`CLAUDE.md`** — architecture invariants; the five
  non-negotiables; operating discipline.
- **`docs/architecture/system-overview.md`** — where each system
  lives (24 sections).
- **`docs/architecture/data-flow.md`** — anon → Stage 3A → Stage
  3B → practice signal flow; the Supabase boundary; entitlement
  derivation.
- **`docs/architecture/systems/study-os-stage-3.md`** — L3
  implementation deep-dive (3A adapter contracts, 3B engine,
  v1 weakness recommender as parallel server-state surface).
- **`docs/architecture/systems/ai-tutor.md`** — L2 tutor
  deep-dive (dual-layer: live `guide-assistant` + dark Phase B).
- **`docs/architecture/systems/placement-v3.md`** — L2 placement
  engine deep-dive.
- **`docs/architecture/systems/billing-entitlement.md`** — L0/L2
  entitlement contract; Stripe webhook host verification.
- **`docs/runbooks/disaster-recovery.md`** — L0 platform
  recovery (provider outages, account lockouts).
- **`docs/onboarding/README.md`** — new-contributor entry; layer
  context for first-time work.
