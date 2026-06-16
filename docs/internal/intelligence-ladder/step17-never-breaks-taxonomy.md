# Step 17 Never-Breaks Regression Taxonomy

Date: 2026-06-15
Job: L17-never-breaks-taxonomy
Scope: protected AI Tutor and tutor regression behaviors mapped to existing tests and fixtures

## Final Status

Final status: never-breaks taxonomy created, with protected behaviors mapped to real tests and fixtures; missing coverage remains explicit.

This artifact is a regression taxonomy, not a new product claim. A behavior is listed as protected only when there is an existing test, fixture, or verifier that can fail in CI. Where the current coverage is partial, the taxonomy says so directly.

## Protection Rule

Never weaken a gate to make this taxonomy pass. Never replace a real runtime, contract, or fixture assertion with a wording-only check. Never claim coverage from a pending fixture unless a test imports or validates that fixture. Never use this artifact to justify broad correction rewrites, pronunciation changes, Azure or edge-function changes, auth, billing, RLS, deploy, or broad refactors.

Protected means:

- a named behavior has a concrete source surface;
- the taxonomy maps it to one or more real test or fixture files;
- at least one focused CI command can exercise that mapping;
- any known gap is listed under "Missing Coverage".

## Taxonomy

| Protected behavior | Never-break invariant | Current tests and fixtures | Coverage level |
| --- | --- | --- | --- |
| VN->EN correction detectors | Vietnamese L1 grammar detectors must stay narrow, tag real Step 5 VN->EN transfer, and abstain on unrelated or already-correct inputs. | `src/lib/ai-tutor/__tests__/step5VnEnDetectors.test.ts`; `tests/regression/correction-golden.test.ts`; `tests/regression/golden-set/correction-rules/vn-past-marker-regular-verb.json`; `tests/regression/golden-set/correction-rules/has-past-time-marker.json`; `tests/regression/golden-set/correction-rules/topic-comment.json`; `tests/regression/golden-set/correction-rules/quantity-plural-s.json`; `tests/regression/golden-set/correction-rules/missing-singular-article.json` | Strong for enumerated deterministic rules and detector abstentions; not exhaustive for every VN transfer. |
| VN-accent transcript correction | Transcript sanity must correct only high-confidence VN-accent confusions in read-back or vocab-grounded contexts, and must abstain without enough context. | `src/lib/ai-tutor/__tests__/transcriptSanity.test.ts` | Strong for the enumerated transcript sanity cases; does not prove full ASR quality. |
| Vietlish corpus and prompt grounding | Vietlish examples must remain schema-valid, deduped, capped, and selected into conversation prompt grounding without duplicate injections. | `src/lib/tutor/__tests__/conversationPromptTemplates.test.ts`; `src/lib/tutor/__tests__/conversationIntegrationContracts.test.ts`; `src/lib/tutor/__tests__/step11VietlishCorpusD4Wave4.test.ts` through `src/lib/tutor/__tests__/step11VietlishCorpusD4Wave19.test.ts`; `tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave-200.json` through `tests/regression/golden-set/_pending-guards/step11-vietlish-corpus-d4-wave19-200.json` | Strong for schema/dedupe/selection contracts; pending-guard JSON is review-queue coverage, not live learner behavior. |
| Vietlish deterministic corrections | High-frequency Vietlish corrections must stay fixture-backed with positive and negative cases, including preposition, collocation, discourse, article, plural, and word-order transfer. | `tests/regression/correction-golden.test.ts`; `tests/regression/golden-set/correction-rules/vietlish-very-like.json`; `tests/regression/golden-set/correction-rules/vietlish-very-verb-really.json`; `tests/regression/golden-set/correction-rules/vietlish-duration-since-for.json`; `tests/regression/golden-set/correction-rules/vietlish-discourse-according-to-me.json`; `tests/regression/golden-set/correction-rules/vietlish-discourse-reason-is-because.json`; `tests/regression/golden-set/correction-rules/vietlish-age-have-be.json`; `tests/regression/golden-set/correction-rules/vietlish-double-comparative.json`; `tests/regression/golden-set/correction-rules/vietlish-double-superlative-most-est.json`; `tests/regression/golden-set/correction-rules/vietlish-collocation-do-homework.json`; `tests/regression/golden-set/correction-rules/vietlish-collocation-make-mistake.json`; `tests/regression/golden-set/correction-rules/vietlish-collocation-take-photo.json` | Strong for fixture-backed rules; no fake claim that all Vietlish can be corrected deterministically. |
| Speak follow-up behavior | Speak follow-ups must stay grounded in the learner's latest topic, avoid repeating asked questions, cap depth, pivot when needed, and preserve topic libraries. | `src/lib/tutor/__tests__/speakFollowups.test.ts`; `src/lib/tutor/__tests__/speakConversationState.test.ts`; topic-level speak tests under `src/lib/tutor/__tests__/speak*.test.ts` | Strong for deterministic follow-up selection and topic library contracts; not a live voice-session E2E proof. |
| Logic mode | Logic mode must explain supported Vietnamese-transfer patterns gently, expose stable pattern ids, and return a safe beginner fallback for unknown text. | `src/lib/tutor/tests/vietlishLogicEngine.test.ts`; `src/lib/tutor/tests/learningEventSummary.test.ts`; `src/lib/tutor/__tests__/vietlishCuratedLogic.test.ts` | Strong for the current curated logic engine and learning-event summary; not proof of broad reasoning quality. |
| AI Tutor state machine | The AI Tutor reducer must keep explicit states, reject invalid transitions, guard terminal sessions, derive modes, compress history safely, and remain deterministic. | `src/lib/ai-tutor/__tests__/sessionRuntime.test.ts` | Strong for reducer/state-machine behavior; does not prove UI wiring for every route. |
| AI Tutor state/reset behavior | In-session L1 follow-up state must start clean, advance only from detector evidence, cap drill depth, offer move-on, release focus, and avoid persistence/network writes. | `src/lib/ai-tutor/__tests__/l1FollowUpLoop.test.ts`; `docs/internal/intelligence-ladder/step16-observable-adaptation.md`; `scripts/ci/verify-step16-observable-adaptation.mjs` | Strong for in-session reducer behavior; explicitly not persistent personalization. |
| AI Tutor stale-session reset/notice | Corrections must be blocked when the running app hash is stale and a Vietnamese reload notice must be shown; matching or unavailable version checks must not hard-block. | `src/lib/ai-tutor/__tests__/staleSessionGuard.test.tsx`; `src/lib/ai-tutor/WIRING_SPEC_STALE_SESSION_GUARD.md` | Strong for guard logic and component notice; not a full browser cache E2E proof. |
| AI Tutor memory boundaries | AI Tutor summaries must avoid raw learner text/PII leaks and must keep product-language memory partitions separate. | `src/lib/ai-tutor/__tests__/learningMemory.test.ts`; `src/lib/tutor/tests/studyOsBoundary.test.ts` | Strong for pure summary and boundary contracts; storage backend behavior is outside this taxonomy. |
| Privacy and consent already covered | Conversation capture must fail closed, require opt-in, treat non-`true` values as no consent, and keep safety/privacy contracts testable. | `src/lib/tutor/__tests__/conversationIntegrationContracts.test.ts`; `src/lib/ai-tutor/__tests__/safety.test.ts`; `src/lib/ai-tutor/__tests__/learningMemory.test.ts`; `src/lib/tutor/__tests__/emotionalResponseBoundary.test.ts` | Covered where tests already exist; this taxonomy does not add new consent surfaces. |

## CI Verifier

The Step 17 verifier is `scripts/ci/verify-step17-never-breaks-taxonomy.mjs`.

It checks that:

- this artifact exists and keeps the required sections;
- every required protected behavior appears by name;
- every mapped test or fixture path exists;
- the artifact contains an explicit "Missing Coverage" section;
- prohibited claims such as exhaustive coverage or universal personalization proof are absent;
- focused existing tests for the mapped behaviors pass.

The verifier is also covered by `tests/scripts/verify-step17-never-breaks-taxonomy.test.mjs`.

## Focused CI Command

Run:

```sh
node scripts/ci/verify-step17-never-breaks-taxonomy.mjs
```

The verifier runs a focused Vitest set covering the mapped surfaces rather than the whole suite.

## Missing Coverage

- No full live AI Tutor browser E2E currently proves every taxonomy row together in one learner journey.
- Pending Vietlish corpus JSON files prove staged review-queue shape and disjointness only when their associated tests import them; they do not prove promotion into learner-facing behavior.
- VN->EN deterministic correction coverage is strong for enumerated fixtures, but the taxonomy does not claim exhaustive Vietnamese L1 transfer coverage.
- Transcript sanity coverage is deterministic and context-bound; it does not prove ASR provider quality or microphone behavior.
- Speak follow-up coverage is deterministic unit/contract coverage; it does not prove live speech recognition, TTS playback, or route-level UX.
- Logic mode coverage proves curated pattern explanations and fallback behavior, not broad model reasoning.
- AI Tutor memory coverage proves safe summaries and partition keys, not a full storage lifecycle or deletion audit.
- Privacy/consent is listed only where already covered by tests; this artifact does not create new privacy guarantees.

## Status Rule

Step 17 may be described as "never-breaks regression taxonomy created" only while this artifact, the mapped files, and `scripts/ci/verify-step17-never-breaks-taxonomy.mjs` pass. Any claim stronger than the table above requires new tests or fixtures before the claim is added here.
