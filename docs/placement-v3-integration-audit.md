# Placement v3 Integration Audit

Date: 2026-05-20  
Branch: `feat/placement-v3-integration`  
Base: `origin/main` at `a360783ca`

## Dependency Graph

```text
#932 design
  -> informs all branches

#934 VN L1 taxonomy
  -> #937 prompts/calibration references L1 ids
  -> #933/#A29 graders emit L1 flags
  -> #936 recommender matches diagnostic flags to lessons
  -> #938 orchestrator stores aggregate flags
  -> A30 UI renders flags

#935 storage schema
  -> #938 persistence writes placement_v3_sessions/responses/profiles
  -> A30 UI indirectly reads sessions/profiles through #938
  -> vertical E2E verifies rows

#937 prompts/calibration
  -> #933 writing grader calibration fixtures
  -> #938 modality prompt selection should use real prompt catalog
  -> A30 UI task rendering needs bilingual prompts/options
  -> vertical E2E fixtures

#933 writing grader
  -> #938 graderClient HTTP call

#936 recommender
  -> #938 profile finalization
  -> A30 ResultsProfile/RecommendedLessonsList

#938 session orchestrator
  -> A30 client
  -> A32 conversation modality entry point
  -> vertical E2E

A29 speaking/reading/listening graders
  -> #938 graderClient for non-writing modalities

A32 Mercy conversation
  -> #938 conversation modality grading/generation
  -> A30 ConversationTaskCard

A30 UI
  -> #938 public session endpoint
  -> #936 recommendation/profile shape
```

## Branch Audit

### #932 `origin/design/A22-placement-v3`

- Ships: `docs/placement-test-v3-design.md`, the DET-class product/system design.
- Imports from other PRs: none.
- Consumers: all implementation branches.
- Stubs/placeholders: design-only sections for final scoring, retention policy, provider/model config, objective item bank reuse.
- Type contracts: conceptual profile shape with `overall`, per-skill CEFR confidence bands, L1 flags, and recommendations.

### #934 `origin/feat/placement-v3-vn-l1-taxonomy`

- Ships: `src/data/placement/vnL1Interference.ts`, taxonomy doc, tests.
- Imports from other PRs: none.
- Consumers: prompt calibration, graders, recommender, UI flags.
- Stubs/placeholders: no runtime detector integration; taxonomy is data-only.
- Type contracts: `VNL1Pattern.id`, `severity: "low" | "med" | "high"`, lesson tags.

### #935 `origin/feat/placement-v3-storage`

- Ships: `placement_v3_sessions`, `placement_v3_responses`, `placement_v3_profiles` migrations; browser-safe `src/types/placement-v3.ts`; delete-account manifest update.
- Imports from other PRs: none, but `src/types/placement-v3.ts` has TODO to align with server `_shared/cefr/types`.
- Consumers: orchestrator persistence, recommender, UI result types.
- Stubs/placeholders: TODO for CEFR type re-export once server shared module exists.
- Type contracts: session rows use `language_pair jsonb`, `current_modality text`, `flow_state text`; response rows store `ai_assessment jsonb`; profile rows store `recommended_lessons jsonb`.

### #937 `origin/feat/placement-v3-prompts-and-calibration`

- Ships: prompt catalogs and calibration corpora for writing/speaking/reading/listening/conversation.
- Imports from other PRs: implicitly depends on #934 L1 ids matching `KNOWN_L1_INTERFERENCE_IDS`.
- Consumers: orchestrator prompt selection, graders, E2E fixtures.
- Stubs/placeholders: no edge-function import path; prompt objects are React/Vite-side TypeScript under `src/data`.
- Type contracts: `PlacementPrompt` uses `promptText`/`promptTextVi`, `targetLevel`, `minResponseLength`; reading/listening add questions/options.

### #933 `origin/feat/placement-v3-grade-writing`

- Ships: `placement-v3-grade-writing` edge function, shared CEFR rubric/types/prompt builder, unit fixtures.
- Imports from other PRs: none at compile time; depends on placement prompt fields by request shape.
- Consumers: orchestrator `graderClient.ts`.
- Stubs/placeholders: model provider implementation is environment driven; no direct storage write.
- Type contracts: request `{ promptId, taskText, userResponse, userId?, targetLanguage }`; response `{ ok: true, assessment, modelTrace }`; raw `assessment` shape is nested `_shared/cefr` with `overall.level`, `subskills`, `l1InterferenceFlags[].pattern/severity/examples`.

### #936 `origin/feat/placement-v3-recommender`

- Ships: lesson index, `recommendLessons(ctx)`, recommendation tests, algorithm doc.
- Imports from other PRs: `CEFRAssessment` from `@/types/placement-v3` provided by #935.
- Consumers: orchestrator finalization, UI results.
- Stubs/placeholders: `placement-v3-types.d.ts` path shim; not edge-function safe as written because it imports app aliases and browser-side source files.
- Type contracts: input `RecommendationContext { assessment: CEFRAssessment, recentLessonHistory?, userPreferences? }`; output `Recommendation[]` with `lessonId`, `lessonTitle`, `reason`, numeric `priority` in 0..1, `category`, `cefrLevel`, `matchedDiagnostics`.

### #938 `origin/feat/placement-v3-session-orchestrator`

- Ships: `placement-v3-session` edge function, state machine, persistence, scoring, modality prompt stubs, writing grader HTTP client.
- Imports from other PRs: duplicated #934 taxonomy files; expects #935 tables; calls #933 writing function; contains temporary stubs for #937 prompts and #936 recommender.
- Consumers: A30 UI, vertical E2E.
- Stubs/placeholders: `modality.ts` has generated `stub_*` prompts; `persistence.ts recommendLessons()` calls `recommendLessonsStub`; non-writing modalities use `stubGrade()`; A29 graders absent; conversation not wired to A32.
- Type contracts: request actions `start/respond/abandon/resume/status`; public edge response is not identical to internal `OrchestratorResponse`; grading normalized to `CEFRAssessment { overallLevel, confidence, criteria?, strengths?, gaps?, l1InterferenceFlags? }`.

### A29 `feat/placement-v3-multi-modality-calibration`

- Ships: local branch currently points at the same commit as `origin/feat/placement-v3-grade-writing`; no speaking/reading/listening grader files in that branch.
- Imports from other PRs: none visible.
- Consumers: orchestrator non-writing grader integration.
- Stubs/placeholders: all non-writing graders remain a gap unless the untracked files in another worktree become a real branch/PR.
- Type contracts: not available on `origin`; expected contract must be the orchestrator `GraderInput -> GraderResult` shape.

### A32 `origin/feat/placement-v3-mercy-conversation`

- Ships: `placement-v3-mercy-conversation` edge function, adaptive turn generation, signal extraction, conversation grader, persona docs/tests.
- Imports from other PRs: none.
- Consumers: orchestrator conversation modality and UI conversation card.
- Stubs/placeholders: standalone conversation session state; no bridge from placement-v3-session.
- Type contracts: actions `start | turn | grade`; `grade` returns `{ ok: true, assessment }` where assessment uses `cefr`, `perSkill`, `l1Interference`, `recommendedFocus`, not orchestrator `overallLevel`.

### A30 `origin/feat/placement-v3-ui`

- Ships: placement v3 routes/pages/components/hooks, UI tests, Playwright UI spec, `clientStub.ts`.
- Imports from other PRs: expects feature flags; otherwise self-contained localStorage stub.
- Consumers: users and E2E.
- Stubs/placeholders: `clientStub.ts` stores sessions/results in localStorage and hard-codes tasks/results; UI test mocks local behavior, not orchestrator.
- Type contracts: UI session uses `{ sessionId, status, currentTask, answeredCount, estimatedTotal }`; UI task uses bilingual fields and `type`; UI result uses `overallCefr`, `skills[]`, bilingual recommendations keyed by `roomId`.

## Mismatches Found

1. UI `clientStub.ts` and orchestrator public endpoint disagree on every top-level response shape. UI expects `PlacementV3Session`; orchestrator `start` returns `{ sessionId, currentTask, totalTasks, progress }`.
2. UI task shape is bilingual (`instruction`, `prompt`, `type`, `options`), while orchestrator `PromptTask` is English-only (`promptText`, `expectedResponse`, `cefr`).
3. Orchestrator prompt selection uses generated `stub_*` prompts, not #937 prompt catalog ids or bilingual prompt metadata.
4. Writing grader raw assessment shape is nested (`overall.level`, `subskills`) and uses flag fields `pattern/examples`; orchestrator scoring requires flat `overallLevel` and `patternId/evidence`. `graderClient.ts` partially normalizes this and must remain the bridge.
5. Shared CEFR types are duplicated: #935 `src/types/placement-v3.ts`, #933 `_shared/cefr/types.ts`, #938 local `types.ts`, and A30 UI `types.ts` are all separate.
6. Recommender output is richer than orchestrator/storage `Recommendation` (`lessonTitle`, `category`, `cefrLevel`, `matchedDiagnostics` vs only `lessonId`, `reason`, `priority`).
7. Recommender imports browser app alias `@/types/placement-v3`; edge functions cannot import it directly without a copy/adapter.
8. Recommender expects a `CEFRAssessment`, but orchestrator finalization has an aggregate `PlacementV3Profile`. The adapter must convert profile evidence into assessment-like context.
9. Taxonomy severity uses `"med"` while orchestrator/storage/UI use `"medium"`. Normalization is required at grader boundaries.
10. #937 prompt L1 ids include aliases such as `missing-articles`; #934 canonical ids include forms such as `missing-subject-verb-agreement` and `plural-s-omission`. Recommender has some aliases but not full taxonomy coverage.
11. A29 non-writing graders are not available on `origin`; the local branch named multi-modality currently equals the writing grader branch.
12. A32 conversation assessment uses `cefr` and `l1Interference`; orchestrator needs `overallLevel` and `l1InterferenceFlags`.
13. A32 conversation state is standalone and not persisted in `placement_v3_sessions.metadata`; orchestrator conversation flow needs a bridge or remains single-turn.
14. Storage RLS grants authenticated users limited direct update, but orchestrator uses service role. UI must call the edge function, not write tables directly.
15. Orchestrator duplicate response behavior returns the current prompt without reconciling UI answered count. Client retry handling must tolerate idempotent responses.

## Cycles and Leaks

- Type cycle risk: #935 browser types import desire from #933 server shared types, while #936 imports #935 browser types and #938 needs #936 from an edge function. A shared pure contract package/file is needed later; this integration should use adapters.
- Prompt leak: #937 prompt data lives under `src/data`, but #938 is a Supabase edge function. Direct import would leak Vite alias assumptions into Deno unless copied or adapted.
- Recommendation leak: #936 is app-side logic over app lesson index. Calling it from an edge function is not Deno-safe without bundling changes.
- UI leak: A30 uses result and recommendation view models, not storage/domain models. Client mapping should be the boundary.
