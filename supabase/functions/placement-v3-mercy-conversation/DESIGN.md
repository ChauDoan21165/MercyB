# Conversational Mercy Placement V3 Design

## Goal

This edge function adds a fifth placement mode: a multi-turn Teacher Mercy conversation. The existing DET-style modalities measure discrete skills. This mode measures interactive English use: comprehension, range, robustness, fluency, vocabulary, grammar, and Vietnamese L1 transfer under a natural conversation.

## API

Single function: `placement-v3-mercy-conversation`.

Actions:

- `start`: returns initial state plus Mercy's opening turn.
- `turn`: accepts prior state and user text, extracts turn signals, generates the next Mercy turn, and returns updated state.
- `grade`: accepts state or transcript and returns a holistic `CEFRAssessment`.

The function is intentionally state-in/state-out. A31 owns persistence/orchestration, so this function does not write placement tables or sessions.

## Files

- `index.ts`: Deno entry, `chatJsonWithFailover`, auth, Sentry wrapper.
- `core.ts`: HTTP routing and validation; pure enough for Vitest.
- `conversationState.ts`: lifecycle state, transcript append, turn-pair count.
- `mercyPersona.ts`: guardrails and deterministic Mercy fallback turns.
- `adaptiveLogic.ts`: explicit ADVANCE/HOLD/BACKOFF/TARGET/COMFORT/WRAP triggers.
- `signalExtractor.ts`: per-user-turn CEFR evidence extraction.
- `turnGenerator.ts`: next-turn decision and optional AI generation.
- `conversationGrader.ts`: holistic final assessment.
- `types.ts`: local contracts compatible with placement CEFR output.

## Lifecycle

1. Opening: Mercy frames the interaction as a conversation, not a test.
2. Probe: 4-8 open questions gather broad signal.
3. Targeted: underdiagnosed subskills are probed with natural questions.
4. Comfort: easier topic restores confidence near the end.
5. Wrap: warm close. No score is shown in the conversation.

## Signal Extraction

Each user turn produces:

- `estimated_cefr_this_turn`
- confidence
- grammar/vocab/fluency/comprehension subskill signals
- Vietnamese L1 interference flags
- strengths, gaps, off-topic/comprehension signal
- code-switch and safety flags

The deterministic extractor is deliberately transparent for tests and calibration. Production can layer AI extraction later, but the core cannot depend on AI availability to stay usable.

## Adaptive Logic

Triggers are explicit:

- `ADVANCE`: two recent confident turns at/above running estimate.
- `HOLD`: learner is near the edge; continue current difficulty.
- `BACKOFF`: empty, off-topic, low-confidence, abusive, or confusion signal.
- `TARGET`: after enough broad evidence, a subskill has low coverage.
- `COMFORT`: within two turn-pairs of target session length.
- `WRAP`: target turn-pair count reached or phase already closing.

The target CEFR moves one step harder/easier for ADVANCE/BACKOFF/COMFORT. TARGET holds the running estimate but changes the subskill.

## Holistic Grading

The grader is not a per-turn average. It starts from confidence-weighted signal summary, then adjusts for:

- trajectory: improving late turns get a small lift; declining late turns get a caution.
- range: shallow topic coverage lowers confidence and may lower the level.
- robustness: persistent errors lower the final estimate.
- self-correction: repeated self-repair adds evidence of control.
- interaction: wrong-language or off-topic turns affect comprehension.

`holisticNotAverage` is true when these factors change the result meaningfully.

## Fixture Corpus

Tests include 10 Vietnamese L1 learner transcripts across A1-C2:

- A1 short survival answers
- A2 code-switch and simple routine
- B1 everyday narrative
- B1 improving after warm-up
- B2 opinion and comparison
- B2 rich vocabulary with grammar gaps
- C1 academic/work argument
- C1 tired-user decline
- C2 nuanced abstract conversation
- wrong-language/repair flow

The corpus includes hesitations, Vietnamese code-switches, L1 transfer, self-correction, shallow answers, and late fatigue.

## Boundaries

This function does not build UI, persist sessions, modify other modality graders, touch migrations, or alter shared placement storage. It is a bounded A32 slice.

## Trigger Table

| Decision | Trigger | Next behavior |
|---|---|---|
| `ADVANCE` | Two recent answers are coherent, confident enough, and at or above the running estimate. | Ask one level harder while keeping one natural conversational question. |
| `HOLD` | Evidence is usable but not comfortably above the current estimate. | Stay at the current estimate and gather another comparable sample. |
| `BACKOFF` | Empty answer, off-topic answer, low confidence, visible confusion, or abusive input. | Ask an easier repair question; for A1-A2, one short Vietnamese bridge is allowed. |
| `TARGET` | Four or more turn-pairs collected and one subskill has low coverage. | Probe that subskill without naming it to the learner. |
| `COMFORT` | Session is within two turn-pairs of target length. | Ask a safer, easier question so the learner does not end on struggle. |
| `WRAP` | Target turn-pair count reached or phase is already wrapping. | End warmly; do not reveal result. |

## Prompt Contract

When AI generation is available, `turnGenerator.ts` sends:

- persona system prompt
- recent transcript only, not full database state
- signal summary
- adaptive decision
- required JSON shape

If AI fails, returns invalid JSON, reveals grading language, or uses Vietnamese outside allowed repair, deterministic fallback and `enforcePersona()` keep the user-visible turn safe.

## Safety Handling

This is not a crisis-intervention function. It marks abusive and self-harm language as signal metadata so the orchestrator can route safety policy. For abusive input, Mercy redirects to a calm lower-stakes question. For self-harm, future A31 orchestration should stop placement and route to the app's existing safety/crisis surface.

## Calibration Notes

The first implementation uses transparent heuristics because this PR's IP is the conversation model and fixture corpus, not a hidden prompt. Heuristics are intentionally inspectable:

- word count and sentence length are fluency proxies
- connectors and tense/aspect range support B1-B2 evidence
- abstract lexis and controlled argument support C1-C2 evidence
- persistent L1 transfer lowers grammar robustness
- Vietnamese-only answers lower interaction/comprehension confidence
- late fatigue changes trajectory notes more than it erases earlier ability

These rules are not final empirical cut scores. They are a deterministic baseline so fixture regressions are visible in CI before AI calibration data exists.

## Accuracy Gate Results

Current local gate results:

- 10 transcript fixtures graded within one CEFR band.
- A1/A2/B1/B2/C1/C2 coverage present.
- Holistic grading differs from naive averaging for trajectory-sensitive fixtures.
- Persona tests block visible grading language.
- Signal tests cover empty, off-topic, code-switch, self-correction, L1 transfer, and abusive input.
- Integration tests cover start, turn, grade, interrupted transcript, wrong-language flow, and abusive redirect.

## Future Calibration Hooks

The state shape keeps all per-turn signals in `state.signals`; A31 can persist those without exposing them to the learner. Once real conversations accumulate, calibration can replace constants in `signalExtractor.ts` with empirical weights while keeping the same output contract.

The AI path can also be expanded to run a second-pass extractor. That should remain fail-soft: the deterministic extractor must continue to provide a complete assessment if provider keys are missing or failover is exhausted.

## Fixture Authoring Rules

The fixture corpus is meant to behave like product IP, not filler text. Each transcript should:

- sound like a Vietnamese L1 learner, including natural transfer errors
- include Mercy turns that could appear in the real app
- include enough turns to show interaction, not just monologue quality
- avoid caricature; lower-level learners still have adult thoughts
- keep Vietnamese code-switching scoped to authentic confusion or lexical gaps
- cover at least one learner goal: exam, work, study abroad, family, confidence

When adding fixtures, update the expected CEFR only after reading the full transcript. Do not tune expected levels to satisfy the current heuristic. The fixture should be the benchmark; the extractor should move toward it.

## Review Checklist

Before deploying a prompt or heuristic change:

- Run the six local tests under `__tests__`.
- Check that no Mercy turn contains score, grade, CEFR, or rubric language.
- Check that B1+ generated turns do not default to Vietnamese.
- Check that at least one trajectory-sensitive fixture keeps `holisticNotAverage = true`.
- Read one A1, one B2, and one C2 transcript manually for authenticity.
- Confirm the API still accepts state-in/state-out for A31 orchestration.
