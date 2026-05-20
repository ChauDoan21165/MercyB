# Placement v3 Integration Bugs

Date: 2026-05-20

## Bugs Found and Fixed

1. UI client was still a localStorage stub.
   - Symptom: A30 UI could complete without calling `placement-v3-session`; no session rows/responses/profile could exist.
   - Fix: `src/lib/placement/v3/clientStub.ts` now calls `/functions/v1/placement-v3-session` and maps real orchestrator envelopes into the UI view model.

2. Placement v3 flags could not be enabled from the smoke test server.
   - Symptom: `/placement` redirected to home even with `VITE_PLACEMENT_TEST_ENABLED=true`.
   - Cause: `featureFlags.ts` used dynamic `import.meta.env[key]`, while `vite.config.ts` only inlined explicit env keys.
   - Fix: placement flags now use direct `import.meta.env.VITE_*` reads and `vite.config.ts` defines the placement/E2E env keys.

3. Playwright browser reused stale service-worker state.
   - Symptom: E2E kept loading the home route/stale bundle while a manual browser could reach `/placement`.
   - Fix: `playwright.smoke.config.ts` blocks service workers for smoke tests.

4. Orchestrator prompt ids were generated stubs.
   - Symptom: persisted responses used `stub_*` ids instead of #937 prompt ids; E2E could not prove prompt catalog integration.
   - Fix: `modality.ts` now builds `PromptTask[]` from `PLACEMENT_V3_PROMPTS`.

5. Orchestrator recommendation finalization used `recommendLessonsStub`.
   - Symptom: completed profiles stored synthetic `placement-a2-*` lessons.
   - Fix: `persistence.ts` adapts aggregate profile evidence to the #936 recommender contract.

6. A32 conversation grader returned a different assessment shape.
   - Symptom: `cefr`, `perSkill`, and `l1Interference` did not match orchestrator `overallLevel`, `criteria`, and `l1InterferenceFlags`.
   - Fix: `graderClient.ts` calls `placement-v3-mercy-conversation` for conversation responses and normalizes the result.

7. A29 non-writing graders are missing from `origin`.
   - Symptom: speaking/reading/listening real grader endpoints cannot be wired.
   - Fix in this branch: keep orchestrator fallbacks for those modalities and document the gap. Follow-up PR should replace `stubGrade` for those modalities once A29 exists on `origin`.

8. E2E text entry raced the route transition from `/placement/who` to `/placement/test/:sessionId`.
   - Symptom: submit button stayed disabled because the test filled before the active task input was mounted.
   - Fix: vertical spec waits for the test URL and active writing input, then fills visible task fields via DOM input/change events.

## Follow-Up Bugs Not Fixed Here

- #936 recommender is still app/Vite-oriented (`lessonIndex` uses app data and Vite globals). The integration imports it from the edge-function type gate by extending `tsconfig.functions.json`, but Supabase deployment packaging should be reviewed before production deploy.
- A29 grader absence means speaking/reading/listening are not truly AI-graded in the integrated vertical yet.
- UI task rendering still receives simplified orchestrator `PromptTask` data. Rich reading/listening options and bilingual prompt metadata are preserved in `metadata`, but the client mapper does not yet render every #937 prompt-specific field.
