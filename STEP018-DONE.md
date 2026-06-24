# Step 018 — DONE: Integration evaluation report

## Files changed
None — diagnostic evaluation only. No code edits.

## Tests run
- **Command:** `npx vitest run src/lib/tutor/tests/ src/lib/tutor/__tests__/ src/lib/ai-tutor/__tests__/`
- **Result:** 2137 passed, 1 failed, 1 todo (105 test files)
- **One failure:** `studyOsBoundary.test.ts` — "scans only the intended production tutor files"
  - Root cause: stale expected-file-list. `correctionExperienceEnricher.ts` and `teacherMercyAuditGate.ts` were added but the test's hardcoded array wasn't updated. Not a runtime bug.
- **Typecheck:** `tsc --noEmit --project tsconfig.typecheck.json` → exit 0 (clean)

## Commit hash
`44875301` — `feat(tutor): add Teacher Mercy contract and rubric audit gate`
(on branch `ai-tutor/teacher-mercy-step018-20260622-103454-47158`)

## Integration wiring report

### How the layers connect

The main integration hub is `src/pages/AiTutor.tsx`. It imports from **37 modules** across `src/lib/tutor/`, `src/lib/ai-tutor/`, and `src/components/ai-tutor/`. Two orchestrator services sit underneath:

- `src/lib/tutor/tutorEngine.ts` — imports `correctionEngine.ts`, `speakableText.ts`, `tutorTypes.ts`
- `src/lib/ai-tutor/aiTutorService.ts` — imports `sessionRuntime.ts`, `promptAssembly.ts`, `safety.ts`, `mockProvider.ts`, `costLimits.ts`, `emotionalResponse.ts`, `types.ts`

The `aiTutorService` is consumed via `src/components/mercy-guide/hooks/useAITutor.ts`.

---

### ✅ WIRED — Intelligence layers with live runtime code paths

These modules execute when a learner uses the AI Tutor:

| Module | Wired through | Path |
|---|---|---|
| `bilingualSalienceDetector.ts` | AiTutor.tsx (line 108) | Direct — detects bilingual salience pivots in learner text |
| `contentAwarePivots.ts` | conversationTurnPolicy.ts → ai-conversation/client.ts | Indirect — content-aware pivot logic drives turn policy |
| `conversationAiClient.ts` | ai-conversation/client.ts | Indirect — AI conversation client |
| `conversationPromptTemplates.ts` | ai-conversation/client.ts | Indirect — prompt composition for AI calls |
| `conversationPronunciationAdapter.ts` | ai-conversation/client.ts | Indirect — pronunciation scoring adapter |
| `conversationTelemetry.ts` | AiConversationScenarioPanel.tsx | Indirect — telemetry logging |
| `conversationTurnPolicy.ts` | ai-conversation/client.ts | Indirect — turn-taking logic |
| `conversationWarmth.ts` | ai-conversation/client.ts, emotionalResponse.ts | Indirect — warmth tone scoring |
| **`correctionEngine.ts`** | AiTutor.tsx (line 69), tutorEngine.ts | Direct — rule-based correction pipeline |
| **`correctionTimingIntegration.ts`** | AiTutor.tsx (line 76) | Direct — bridges correction + timing decision |
| `emotionalResponseBoundary.ts` | AiTutor.tsx (line 110), emotionalResponse.ts | Direct — classifies learner response stance |
| `englishOnlyTts.ts` | 7 files (SpeakPracticeMode, MercySpeakTab, etc.) | Direct — English-only TTS enforcement |
| **`followUpIntelligence.ts`** | speakFollowups.ts (line 299) → AiTutor.tsx | Indirect — quality-gates AI follow-up questions |
| `languageRegistry.ts` | AiTutorCtaBanner, AiTutor.tsx, voiceEngine | Direct — language config registry |
| `learnerHistoryProfile.ts` | StudyPathCard, masteryScorer, learnerEvidence | Direct — learner history/profile |
| `learnerProfileBuilder.ts` | AiTutor.tsx (line 20), serverInterferenceMemory | Direct — syncs profile with server data |
| `learningEventSummary.ts` | TutorMemoryCard, AiTutor.tsx (line 95) | Direct — summaries for memory cards |
| `learningEvents.ts` | Home.tsx, AiTutor.tsx (line 91) | Direct — records learning events |
| **`lessonRecommendationIntelligence.ts`** | learnerEvidence.ts | Indirect — feeds lesson recommendations into evidence path |
| `masteryGraph.ts` | todayLessonPlanner.ts → learnerEvidence.ts | Indirect — mastery tracking for planning |
| `nextLessonRecommender.ts` | AiConversationScenarioPanel, AiTutor.tsx (line 21), learnerEvidence | Direct — next-lesson recommendations |
| `pivotPromptSafety.ts` | AiTutor.tsx (line 115) | Direct — safety guard on pivot prompts |
| `productConfigs.ts` | ViKidsEnglishTutor, AiTutor.tsx (line 61) | Direct — product/language configs |
| `speakConversationState.ts` | AiTutor.tsx (line 54) | Direct — conversation state machine |
| `speakFollowups.ts` | AiTutor.tsx (line 106) | Direct — follow-up question generation |
| `speakTopicLibrary.ts` | ai-conversation/scenarios.ts | Indirect — topic library for scenarios |
| `speakableText.ts` | voiceEngine.ts, tutorEngine.ts | Direct — speakable text utilities |
| `studySessionState.ts` | AiTutor.tsx (line 90) | Direct — session state management |
| **`teacherMercyAuditGate.ts`** | AiTutor.tsx (lines 2267, 2358) | Direct — audits corrections against contract |
| **`teacherMercyContract.ts`** | teacherMercyAuditGate.ts → AiTutor.tsx | Indirect — 10-rule behavior contract |
| **`teacherMercyCorrectionTiming.ts`** | correctionTimingIntegration.ts → AiTutor.tsx | Indirect — decides when to show corrections |
| **`teacherMercyRubric.ts`** | teacherMercyAuditGate.ts → AiTutor.tsx | Indirect — 7-dimension human-evaluable rubric |
| `todayLessonPlanner.ts` | learnerEvidence.ts | Indirect — daily lesson planning |
| `tutorCopy.ts` | AiTutor.tsx (line 41) | Direct — UI copy strings |
| `tutorEngine.ts` | AiTutor.tsx (line 49) | Direct — tutor correction engine |
| `tutorTypes.ts` | ConversationMode, CorrectionMode, AiTutor.tsx | Direct — type definitions |
| `vietlishCorpus.ts` | vietlishLogicEngine.ts → AiTutor.tsx | Indirect — Vietlish error corpus |
| `vietlishCuratedLogic.ts` | LogicMode.tsx | Direct — curated Vietnamese-English logic |
| `vietlishLogicEngine.ts` | ConversationMode.tsx, AiTutor.tsx (line 80) | Direct — Vietlish logic engine |

**ai-tutor/ subsystem modules (wired through aiTutorService.ts):**
- `aiTutorService.ts` — consumed via `useAITutor.ts` hook
- `sessionRuntime.ts` — imported by aiTutorService and useAITutor
- `promptAssembly.ts` — imported by aiTutorService
- `safety.ts` — imported by aiTutorService
- `mockProvider.ts` — imported by aiTutorService and useAITutor
- `costLimits.ts` — imported by aiTutorService
- `emotionalResponse.ts` — imported by aiTutorService

**ai-tutor/ modules wired directly to AiTutor.tsx:**
- `l1FollowUpLoop.ts` → AiTutor.tsx (line 128)
- `detectorHint.ts` → AiTutor.tsx (line 122), l1FollowUpLoop
- `learningMemory.ts` → 7 files across components/pages/lib
- `step5VnEnDetectors.ts` → AiTutor.tsx (line 123)
- `teacherMercyHandoff.ts` → AiTutor.tsx (line 25), RoomRenderer
- `freeFormStt.ts` → AiTutor.tsx (line 24)
- `transcriptSanity.ts` → AiTutor.tsx (line 23)
- `tutorUiCopy.ts` → AiTutor.tsx (line 40)
- `studyPath.ts` → StudyPathCard.tsx
- `useBrowserStt.ts` → AiTutor.tsx (line 22)
- `useTtsSpeaker.ts` → AiTutor.tsx (line 26)

**Total wired: ~55 modules** across `src/lib/tutor/` and `src/lib/ai-tutor/`.

---

### ❌ UNWIRED — Intelligence layers with NO runtime code path

These modules exist on disk and have tests but never execute in the learner app:

| Module | Status | Why unwired |
|---|---|---|
| **`correctionExperienceEnricher.ts`** | Dead code | Not imported by any runtime file. Has a self-referencing commented-out import on its own line 30. Imports `weaknessMemoryTags` types but is itself disconnected from the app. |
| **`weaknessMemoryTags.ts`** | Transitively dead | Only imported by `correctionExperienceEnricher.ts` (which is dead). The commit `cb06b6ff` says "wire weakness memory and Vietnamese interference explanations into correction experience" — but the target module (`correctionExperienceEnricher`) was never wired to `correctionEngine.ts`, `AiTutor.tsx`, or `tutorEngine.ts`. |
| **`vietnameseInterferenceExplanation.ts`** | Dead code | No runtime imports exist. Only a commented-out usage suggestion on its own line 11: `// import { explainInterference, ... } from "./vietnameseInterferenceExplanation"`. Zero callers. |
| **`goldenConversationSimulations.ts`** | Simulation-only | Only imported by test files (`goldenConversationSimulations.test.ts`, `goldenFlowRegression.test.ts`). Uses `teacherMercyContract` and `teacherMercyRubric` types but is not wired to any runtime path. Explicitly built as simulation/test infrastructure, not runtime. |
| **`staleSessionGuard.ts`** + **`AiTutorStaleSessionNotice.tsx`** | Orphaned component | `staleSessionGuard.ts` is only imported by `AiTutorStaleSessionNotice.tsx`, which itself is never imported by any page, component, or route. The stale-session detection logic and its UI notice are both unreachable. |

**Total unwired: 6 files (5 modules)**

---

### What got smarter (recent commits vs wiring reality)

| Commit | Claims | Wiring reality |
|---|---|---|
| `44875301` — add Teacher Mercy contract and rubric audit gate | Contract + rubric + audit gate | ✅ Audit gate IS wired to AiTutor.tsx (lines 2267, 2358). Contract and rubric are transitively wired through audit gate. |
| `1ab5842a` — wire followUpIntelligence quality gate | Follow-up quality gating | ✅ Wired through `speakFollowups.ts` → `AiTutor.tsx`. `isAcceptableFollowUp()` called at line 299. |
| `cb06b6ff` — wire weakness memory and Vietnamese interference explanations | Enricher + weakness tags + VN interference | ❌ `correctionExperienceEnricher.ts` is NOT imported by anything. `weaknessMemoryTags.ts` and `vietnameseInterferenceExplanation.ts` are transitively dead. The wire point was built but never connected to the pipeline. |
| `3f711110` — wire lesson recommendation intelligence | Lesson recommendations into evidence path | ✅ `lessonRecommendationIntelligence.ts` IS imported by `learnerEvidence.ts`, which is used by `AiTutor.tsx`. |
| `a8f835ba` — wire correction timing into conversation flow | Correction timing decisions | ✅ `correctionTimingIntegration.ts` IS imported by `AiTutor.tsx` (line 76), which imports `teacherMercyCorrectionTiming.ts`. |

### Learner UI behavior visibility

- **Visible to learner:** Correction engine (rule-based + AI fallback), follow-up questions (quality-gated), lesson recommendations (via evidence path), correction timing (immediate vs deferred), audit gate (runs silently in background), bilingual salience pivots, emotional response boundary classification, English-only TTS enforcement, conversation warmth scoring, language-specific product configs, speak practice state machine.
- **Simulation-only:** Golden conversation simulations (test fixtures, not visible). Contract/rubric compliance scoring (audit gate runs but results are void — no UI surface, no dashboard, no teacher feedback loop).
- **Dead (no runtime effect):** Weakness memory tagging, Vietnamese interference explanations, correction experience enrichment, stale session guard/notice.

---

### What still needs Chau review

1. **`correctionExperienceEnricher.ts` is orphaned** — Was built to combine `weaknessMemoryTags` and `vietnameseInterferenceExplanation` into the correction flow, but `correctionEngine.ts` never imports it. Either wire it into `correctionEngine.ts` or `tutorEngine.ts`, or delete the dead modules.

2. **`staleSessionGuard.ts` + `AiTutorStaleSessionNotice.tsx` are orphaned** — The guard logic and its UI component exist but nothing imports the notice component. Wire it into `AiTutor.tsx` or delete both files.

3. **`studyOsBoundary.test.ts` is stale** — Expected file list doesn't include `correctionExperienceEnricher.ts` and `teacherMercyAuditGate.ts`. Simple fix: update the array.

4. **`teacherMercyAuditGate` runs silently** — `auditCorrectionQuick()` is called at lines 2267 and 2358 of `AiTutor.tsx` via `void` (fire-and-forget). The audit results are computed but never surfaced to teacher or learner. Decide whether this is intentional (diagnostic shadow mode) or needs a UI surface.

5. **Golden conversation simulations are test-only** — Built explicitly as simulations. Confirm this is the intended scope; if simulations should also serve as regression gates in CI, wire them into a pre-commit or CI check.

6. **`teacherMercyCorrectionTiming.ts` is wired but thin** — It's imported and used by `correctionTimingIntegration.ts` which is called from `AiTutor.tsx`, but the timing decision logic (immediate/delay/defer) should be verified with real learner sessions to confirm it produces sensible behavior.

CHAU ↓↓↓ COPY FROM HERE
- 55 tutor/ai-tutor modules are runtime-wired to the learner app
- 6 files (5 modules) are dead code: `correctionExperienceEnricher.ts`, `weaknessMemoryTags.ts`, `vietnameseInterferenceExplanation.ts`, `goldenConversationSimulations.ts` (test-only by design), `staleSessionGuard.ts` + `AiTutorStaleSessionNotice.tsx`
- The commit `cb06b6ff` ("wire weakness memory and Vietnamese interference") wired modules into `correctionExperienceEnricher.ts` but never connected that enricher to `correctionEngine.ts` or any runtime path — the wire is built but the plug isn't in the socket
- Decision needed: delete the 5 dead modules or finish wiring them into the conversation pipeline
- Audit gate runs silently (void calls) — no teacher/learner surface for contract compliance results
