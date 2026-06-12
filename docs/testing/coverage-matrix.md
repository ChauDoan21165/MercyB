# User-Facing Test Coverage Matrix

Last audited: 2026-06-12 from `origin/main` `465a16167`.

Purpose: inventory user-facing MercyBlade surfaces before adding tests. The
matrix records what exists now, what user-visible risk remains, and which next
test layer should close it.

Layer key:
- **Playwright UI flow**: browser-level route/journey test.
- **Simulated-learner invariant harness**: deterministic learner/session model
  that asserts product promises across inputs without browser cost.
- **Audio fixture test**: fixed local audio/blob/TTS/STT fixture that exercises
  recorder, playback, scoring, or transcript paths without live microphones.

## Matrix

| Surface | Routes / entry points | Coverage now | Gap | Closing layer |
|---|---|---|---|---|
| Home, onboarding, first-run pair selection | `/`, `/onboarding` | Playwright: `homepage`, `marketing-landing-anon`, `onboarding-anon`, `onboarding-pair-matrix`; unit: `AnonymousOnboardingGate`, `OnboardingPage.*`, `LanguageTrackHome`, `HomePlacementCta`. | First-run to recommended next action is covered in pieces, but not as one durable learner journey across anon/new account states. | Playwright UI flow |
| Auth, signup, password reset, account conversion | `/signin`, `/signup`, `/reset-password`, `/auth/save-progress`, `/auth/*` | Playwright: `auth-signin`, `signin`, `auth-and-placement`; unit: route aliases, auth helpers, `EmailBlock`, conversion tests, delete-account flow. | OAuth/anonymous conversion conflict handling is mostly unit-level; UI flow does not preserve placement/result history through conversion. | Playwright UI flow |
| Placement v3 test | `/placement`, `/placement/who`, `/placement/test/:sessionId`, `/placement/results/:sessionId`, `/placement/resume`, `/placement/skip` | Playwright: `placement-v3`, `placement-v3-vertical`, `placement-to-first-lesson`; unit: placement route shell, who-for, results resume, task cards, v3 recommender/lesson index, v4/v5 telemetry harnesses. | Strongest surface today, but the browser flow does not yet assert every modality card and the post-results recommended lesson path across learner types. | Playwright UI flow |
| AI Tutor shell and modes | `/ai-tutor` | Playwright: `ai-tutor`, `ai-tutor-authenticated`; golden/quality: `prod-golden-flows`, `goldenFlowRegression`, correction echo guard; unit: `AiTutor.test`, page guards, Conversation/Speak/Correction/Logic components, tutor engine, prompt/session/safety/cost tests. | Broad but scattered. Need a single simulated learner invariant for mode switching, honest failure, no echo-as-correction, and English-only TTS across Journey/Grammar/Speak/Logic. | Simulated-learner invariant harness |
| Sua cau / correction | AI Tutor Grammar mode, correction engine | Unit/golden: `correctionEngine`, `suaCauContractTests`, correction golden set, echo guard, eval set v5. | Engine is well covered; UI only has partial coverage that corrected/abstained results render with the right learner-facing affordance. | Playwright UI flow |
| Roleplay | `/roleplay` | Playwright: `roleplay-anon`; unit: `RoleplaySession.voiceFallback`; tutor topic suites cover conversation content families. | No authenticated roleplay session invariant asserting scenario selection, turn progression, retry/fallback, and summary. | Simulated-learner invariant harness |
| Pronunciation grading and speech drills | `/speak`, `/practice/pronunciation`, `/practice/phoneme/:phonemeSlug`, `/pronunciation/srs`, `/speech/history` | Playwright: `pronunciation-anon`, `pronunciation-full-flow`, `self-compare-recorder-playback`; unit/audio: pronunciation scorer/recognizer/cloud scorer, tone and minimal pair tests, `SpeechDrill*`, recorder tests, Azure smoke. | Audio scoring has deep unit coverage, but browser-level audio fixture coverage is thin for failed mic permission, upload retry, and score feedback rendering. | Audio fixture test |
| Listening library | `/listening`, `/listening/:clipId` | Unit: `ClipPlayer`; data tests for listening clips; audio/CSP e2e exists. | No user journey from library to clip playback/transcript/fallback state. | Playwright UI flow |
| Rooms and lesson renderer | `/rooms`, room pages, universal room chrome | Unit: room loader/resolver/snapshot/corruption, room renderer, active entry audio playback, `AllRooms`; Playwright deep routes and route smoke. | Need one route-level flow that opens a real room, plays/handles audio, navigates lesson sections, and verifies locked/free state. | Playwright UI flow |
| Language switching and language lessons | `/languages`, `/languages/:language`, global VI/EN chrome toggle, account language pair | Playwright: `languages-anon`; unit: language pair, anonymous pair, language lesson renderer, UI language toggle, native content, individual language page smoke tests. | Coverage validates rendering, but not a full learner switch from pair selection to language lesson to AI tutor CTA. | Playwright UI flow |
| Profession lesson packs | `/professions`, `/professions/*`, `/pack/nail-tech` | Playwright: `professions-anon`; content tests for profession packs; tutor speak-topic suites by domain. | Public browse is covered; auth-gated pack path and paid/free gate are not covered as a journey. | Playwright UI flow |
| Kids Vietnamese-English tutor | `/kids/vi-english` | Unit: `ViKidsEnglishTutor`; Mercy guide kids safety tests. | No browser flow for parent/kid safe entry, audio absence/fallback, and lesson selection. | Playwright UI flow |
| Parent view / family bridge | `/parent/:learnerId`, parent nav/home entry | Unit/golden: parent view render golden, state components, family bridge, thresholds, locale, entitlement golden. | No authenticated browser flow from account/home entry to parent dashboard with empty, active, and premium-gated states. | Playwright UI flow |
| Account and settings | `/account`, `/account/notifications`, `/account/push-preferences`, `/account/security`, `/auth/security`, `/auth/challenge`, `/auth/recover` | Unit: delete account, notification preferences render path, MFA/security helpers, tracking consent panel, language pair settings; route guards. | No account-settings UI journey covering plan status, language pair, notifications, 2FA challenge handoff, and destructive delete guard. | Playwright UI flow |
| Billing, pricing, gifts, family plan | `/pricing`, `/upgrade`, `/billing`, `/billing/success`, `/gift*`, `/family` | Unit: pricing language, savings badge, billing/entitlement invariants, Stripe map, family entitlement, gift logic; Playwright `pricing-anon`. | Billing-critical browser path is missing: free -> checkout/portal error handling, iOS Apple card vs web Stripe, billing success refresh. | Playwright UI flow |
| Writing feedback and writing practice | `/writing-feedback`, `/writing`, `/writing/:promptId` | Unit: writing feedback scoring, retention guards for writing practice, components for essay input/feedback. | No browser flow for prompt selection, draft submission, feedback render, and honest AI failure state. | Simulated-learner invariant harness |
| Mercy chat / Mercy guide | `/mercy`, `/mercy/chat`, home Mercy guide panel | Unit/golden: Mercy conversation client/cost cap/progress context, Teacher Mercy, guide panel, unified chat, guide tabs, voice fallback/mobile audio. | No route-level flow proving unified chat can start, continue, hit cost/failure boundaries, and preserve learner context. | Simulated-learner invariant harness |
| Review, vocabulary, streak, progress, weak-at | `/review/*`, `/vocabulary`, `/vocabulary/review`, `/progress`, `/weak-at`, `/challenge`, `/challenge/history`, `/xp` | Unit: review store/session/overview, vocabulary review session, streak rules/history, weak-at page, stage 3A/3B/4 invariants; Playwright `stage-3a-weak-at`, `streak-flow`. | Review/vocabulary are mostly component-level; no browser flow through a complete review session and progress update. | Playwright UI flow |
| Mock interview / interview | `/interview/*`, `/mock-interview`, `/mock-interview/:scenarioId`, `/mock-interview/community` | Unit: interview session/rubric, mock interview room, scenarios. | No full interview session flow with prompt, answer, feedback/summary, and weekly/free gate. | Simulated-learner invariant harness |
| IELTS premium practice | `/exam/ielts/*` | Data tests for IELTS structure, band descriptors, listening, reading, speaking; component pages exist; one audio test for IELTS listening item. | Practice routes lack browser coverage for premium gate, section navigation, listening audio fallback, writing/speaking task interaction, and estimator. | Playwright UI flow |
| IELTS public content packs | `/exam-prep/ielts/{speaking,listening,reading,writing}` and detail routes | Data tests for IELTS content; SEO route smoke only covers generic SEO pages, not exam content packs. | No route smoke for all content pack index/detail pages; audio fixture only exists for one listening item. | Playwright UI flow |
| TOEFL premium practice | `/exam/toefl/*` | TOEFL data files exist; pages/components exist; older doc notes scaffolding. | No tests found for TOEFL data integrity, routes, premium gate, or section interactions. | Playwright UI flow |
| TOEFL public content packs | `/exam-prep/toefl/{speaking,listening,reading,writing}` and detail routes | Data files and pages exist. | No route smoke/content integrity tests found. High risk because TOEFL was explicitly scaffolded and may look shipped. | Playwright UI flow |
| TOEIC and VSTEP exam prep | `/exam/toeic/*`, `/exam-prep/toeic`, `/exam/vstep/*`, SEO topic routes | TOEIC data tests, timed practice component test, VSTEP data tests, VSTEP estimator unit, SEO topic routes registered. | TOEIC/VSTEP have content tests but no browser journey for premium gate, timed practice, estimator, and public pack detail. | Playwright UI flow |
| Public marketing, SEO, blog, stories, support/legal | `/seo/*`, `/blog*`, `/stories*`, `/support`, legal pages | Playwright: SEO landings, blog anon, stories anon, support anon, marketing landing; unit: legal/static, story share. | Good route smoke; missing only conversion-path assertions from content pages into placement/signup. | Playwright UI flow |
| Admin, teacher portal, forensics, observability | `/admin/*`, teacher review routes, placement forensics dashboard | Unit: admin auth/security health, analytics, teacher queue/item, edge-fn anon-bearer regressions; Playwright: admin flag control, placement forensics dashboard. | Admin breadth is large; only critical auth/forensics paths are covered. Lower learner priority. | Playwright UI flow |

## Ranked Half-Day Gap Briefs

1. **TOEFL route/content smoke.** Add Playwright coverage for `/exam/toefl`,
   all `/exam/toefl/*` section pages, and public `/exam-prep/toefl/*` index
   plus one detail per section. DONE-WHEN: routes render real TOEFL headings,
   no 404/skeleton-only state, and premium-gated routes show the correct auth
   or paywall behavior.
2. **IELTS practice and content journey.** Add Playwright coverage for
   `/exam/ielts/*` premium practice gates and public `/exam-prep/ielts/*`
   index/detail pages, including one listening audio fallback assertion.
3. **Billing/account browser safety path.** Add Playwright flow for `/account`
   -> `/pricing` -> `/billing`, mocked checkout/portal failures, billing success
   refresh copy, and iOS-vs-web payment surface split.
4. **Review/vocabulary complete-session flow.** Add Playwright flow that starts
   a vocabulary or review session, answers at least two cards, completes, and
   verifies progress/streak-facing UI changes.
5. **Writing practice learner invariant.** Add a simulated learner harness for
   prompt selection, draft submission, feedback render, and AI failure honesty
   across `/writing` and `/writing-feedback` logic seams.
6. **Roleplay authenticated session invariant.** Add a deterministic harness
   for scenario selection, turn progression, retry/fallback, and summary output.
7. **Pronunciation audio fixture coverage.** Add audio fixture tests for mic
   denial, upload retry, scoring response, and rendered feedback in the speech
   drill/pronunciation surfaces.
8. **Parent dashboard browser flow.** Add Playwright flow from account/home
   parent entry to `/parent/:learnerId` covering empty, active, and premium
   gate states.
9. **Language pair to lesson to AI Tutor CTA.** Add Playwright flow from
   onboarding pair selection through `/languages`, one language lesson page,
   UI language toggle, and AI Tutor CTA handoff.
10. **Room lesson/audio route flow.** Add Playwright flow that opens a real room
    from `/rooms`, verifies free/locked affordance, navigates a lesson section,
    and asserts audio playback or explicit fallback.

## Notes

- Do not count a unit test as end-user coverage unless it renders the learner
  affordance and failure copy.
- Do not add live microphone or live payment tests. Use fixtures and mocked
  provider responses.
- Conversation-engine changes remain A1 territory; gaps above should test
  behavior at seams without changing tutor logic.
