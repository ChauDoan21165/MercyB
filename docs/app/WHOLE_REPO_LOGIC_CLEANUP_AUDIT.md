# Whole Repo Logic Cleanup Audit

Date: 2026-05-24
Branch: `a11-whole-repo-logic-cleanup-audit`
Baseline: `origin/main` at `4386787da` (`docs: add continuous app logic inspection system (#1095)`)

## Final Verdict

NEEDS CLEANUP BEFORE NEXT PHASE

The active `/kids/vi-english`, `/ai-tutor`, and floating helper entry points mostly match the merged MercyB logic map. The repo as a whole is not clean yet. There are stale open PRs, legacy MercyGuide surfaces, orphan candidates, duplicate AI Tutor/Kids flow code, and a high-risk legacy memory path that can confuse future agents or regress the product.

Direct answer: the whole repo does not fully match the MercyB logic map yet. The visible primary product routes are mostly aligned, but stale/duplicate/orphaned pieces remain and should be cleaned before the next Study OS build layer.

## Source Of Truth Read

- `docs/app/APP_LOGIC_FLOW.md`
- `docs/app/CONTINUOUS_LOGIC_FLOW_MAP.md`
- `docs/app/REPO_LOGIC_INSPECTION_PROTOCOL.md`
- `docs/app/FLOW_COMPLIANCE_PLAYBOOK.md`
- `STRATEGY.md`
- `ROADMAP.md`

`docs/app/STUDY_FLOW_PSYCHOLOGY_PLAYBOOK.md` was requested but is not present on current `main`. PR #1091 adds it.

## Commands Run

```sh
git status --short --branch
git fetch origin main
gh pr list --state open --limit 100 --json number,title,headRefName,isDraft,updatedAt,url,mergeStateStatus
gh pr view <requested-pr> --json number,title,state,isDraft,headRefName,baseRefName,updatedAt,mergeStateStatus,url
gh pr diff <requested-pr> --name-only
rg -n "path=.*ai-tutor|kids/vi-english|AiTutor|ViKidsEnglishTutor|MercyGuide" src/router src/pages src/components -S
rg -n "Mercy Kids|AI Tutor|Journey|Grammar|Speak|Logic|Mercy đọc|Device voice|Mercy voice|mic|microphone|textarea|memory|Mở AI Tutor|Vào Mercy Kids|/ai-tutor|/kids/vi-english|level|leaf|tree|support|explain" src docs/app -S
rg -n "speak\\(|speechSynthesis|Audio\\(|fetchCloudTtsUrl|mercy-tts|localStorage|indexedDB|supabase|placement|transcript|raw audio|rawAudio|learner text" src/components src/lib src/pages supabase/functions -S
git diff --check
```

## Active App Alignment

| Area | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Mercy Kids `/kids/vi-english` | PASS | `src/router/AppRouter.tsx` routes to `src/pages/kids/ViKidsEnglishTutorPage.tsx`, which renders `src/components/kids/ViKidsEnglishTutor.tsx`. The component states picture + speak, has no tabs and no textarea. | Visible route matches picture + speak only. |
| Mercy Kids no advanced shell | PASS | `ViKidsEnglishTutor.tsx` does not import `TeacherMercyLearningShell`, `ConversationMode`, `CorrectionMode`, or `TutorMemoryCard`. | No main Kids memory card or adult tutor shell. |
| AI Tutor `/ai-tutor` modes | PASS | `src/pages/AiTutor.tsx` derives modes from `aiTutorConfig` and renders Journey, Grammar, Speak, Logic. | Adult flow owns modes. |
| AI Tutor Today's Lesson | PASS | `src/pages/AiTutor.tsx` renders `TutorTodayLessonCard`; `src/components/ai-tutor/TutorMemoryCard.tsx` calls `planTodayLesson`. | Visible Today’s Lesson is present. |
| AI Tutor Logic no voice UI | PASS | `ConversationMode.tsx` sets `isLogicMode`, hides `TeacherMercyVoiceControls`, and only renders TTS labels when `allowTts` is true. `AiTutor.tsx` also blocks `handleConversationSpeak` in logic mode. | Logic is text-only in current adult route. |
| Floating Mercy Helper routing | PASS | `src/components/mercy-guide/MercyGuidePanel.tsx` links `Vào Mercy Kids` to `/kids/vi-english` and `Mở AI Tutor` to `/ai-tutor`. | Current floating panel is navigation/helper only. |
| Memory safety in active AI Tutor | PASS | `src/lib/ai-tutor/learningMemory.ts` uses IndexedDB `mb-ai-tutor`, summary fields, and comments explicitly reject raw audio, raw text, transcripts, PII, JWTs, and user IDs. | M3 AI Tutor memory is local summary-only. |
| Product config consistency | FAIL P1 | `src/lib/tutor/productConfigs.ts` has `viKidsEnglish.modes = ["conversation", "grammar", "speak", "logic"]`, and `src/lib/kids/viKidsTutorCopy.ts` maps those into `VI_KIDS_TUTOR_TABS`. | Not live on `/kids/vi-english`, but this is a regression trap. |
| Legacy Teacher Mercy memory boundary | FAIL P0 | `src/components/mercy-guide/hooks/useMercyMemory.ts` stores `lastSubmittedText`, `lastCorrectedText`, `lastEnhancedText`, `lastPracticeLine`, and syncs `teacher_memory` via Supabase `.select`, `.upsert`, and `.delete`. | Violates current local summary-only/no Supabase memory sync rule unless separately approved. |

## Open PR Table

| PR | Title | Status | Classification | Recommendation |
| --- | --- | --- | --- | --- |
| #1096 | Make AI Tutor start with today's lesson | Open, blocked | merge after review | Rebase/resolve, then review as the focused UI layer for Today's Lesson. Touches only AI Tutor files. |
| #1091 | docs(app): add study flow psychology playbook | Open, clean | keep | Merge after docs review; this fills the missing requested source-of-truth doc. |
| #1084 | Audit adult AI Tutor study flow | Open, clean | keep | Merge or fold into current audit if not duplicative. Docs-only. |
| #1083 | Add OpenAI Realtime voice chat for AI Tutor | Open, dirty | close as unsafe/stale for now | Optional realtime voice is later-only, conflicts, touches Kids test, edge function, migration, and provider flow. Hold until Journey/Speak voice phase is explicitly approved. |
| #1082 | A3 refresh app flow alignment audit | Open, blocked | close as superseded | Same output path as #1081 and superseded by #1095 plus this audit. |
| #1081 | A3 app flow alignment audit | Open, clean | close as superseded or manual owner decision | Earlier audit doc; likely superseded by #1095/current audit unless owner wants archive history. |
| #1074 | Clean AI Tutor speakable text | Open, dirty | merge after review | Safety-relevant, but must rebase against current voice/Logic changes and verify raw input guard is wired. |
| #1067 | Add tutor target-language copy packs | Open, dirty | close as superseded | Main already has `feat(ai-tutor): use target language copy packs (#1073)`. Do not merge stale branch. |
| #1066 | Add Google TTS Teacher Mercy voice engine | Open, dirty | close as superseded | Current main already has `supabase/functions/mercy-tts/googleProvider.ts` and Google TTS code. |
| #1065 | Add tutor product config layer | Open, dirty | needs manual owner decision | Product config drift remains, but branch touches Kids and AI Tutor and predates current map. Rebuild a tiny config cleanup PR instead. |
| #1064 | Audit Teacher Mercy tutor architecture | Open, dirty | close as superseded | Code portion stale; extract audit doc only if still useful. |
| #1063 | Scope tutor memory by product and language | Open, clean | needs manual owner decision | Current `learningMemory.ts` already scopes product + language. Review if only tests remain useful; otherwise close as superseded. |
| #1061 | Add TutorTurn contract and tutor engine | Open, clean | close as superseded | Current main already has `tutorEngine.ts` and `tutorTypes.ts` from foundation. |
| #1060 | Add tutor correction engine | Open, dirty | close as superseded | Current main already has `correctionEngine.ts` and rules. |
| #1059 | Fix AI Tutor shell and voice state | Open, dirty | close as superseded | Foundation/current map already owns shell and voice state. |
| #1038 | AI Tutor Voice Phase 1 | Open, dirty | close as superseded | Later PRs #1039-#1095 supersede route, CTA, voice, and memory work. |
| #992 | test(v4): add deterministic V4 telemetry harness fixtures | Open, dirty | needs manual owner decision | Placement/V4 test harness. Keep out of Study OS cleanup unless Placement owner approves. |
| #987 | docs: add principle 19 | Open, clean | needs manual owner decision | Governance docs, not Study OS. Owner can merge independently. |
| #983 | docs: add single-agent handoff principle | Open, dirty | needs manual owner decision | Governance docs, not Study OS; likely conflicts in `PRINCIPLES.md`. |
| #967 | feat(placement-v3): add live runner replay audit | Open, clean, base is #965 | needs manual owner decision | Stacked Placement PR. Do not merge during Study OS cleanup. |
| #965 | feat(placement-v3): harden live validation runner | Open, clean, base is #959 | needs manual owner decision | Stacked Placement PR. Do not merge during Study OS cleanup. |
| #964 | feat(placement-v3): land A29 non-writing graders on origin | Open, dirty | needs manual owner decision | Large Placement function stack. Out of scope and merge-risky. |
| #963 | feat(placement-v3): add persistence burn-in runner | Open, dirty | needs manual owner decision | Placement scripts and audio fixture. Out of scope. |
| #961 | feat(placement-v3): add Azure speaking burn-in | Open, dirty | needs manual owner decision | Placement Azure speaking burn-in. Out of scope. |
| #959 | feat(placement-v3): add live validation runner | Open, dirty | needs manual owner decision | Placement live runner. Out of scope. |
| #954 | feat(placement-v3): add endurance + regression burn-in tooling | Open draft, dirty, diff too large for PR diff API | close as unsafe/stale or owner decision | Draft Placement PR over 300 files. Do not merge in Study OS phase. |

Additional open PRs outside the requested/high-risk list:

| PR | Title | Status | Classification | Recommendation |
| --- | --- | --- | --- | --- |
| #1098 | fix(ui): separate floating Mercy helper from Kids | Open, blocked | needs manual owner decision | Related to this audit's helper/Kids boundary, but not inspected deeply here. Review before any duplicate cleanup. |
| #1097 | Connect Vietlish logic engine to AI Tutor Logic mode | Open, blocked | needs manual owner decision | Related to Study OS, but blocked; review separately as a small engine-to-UI PR. |
| #953 | feat(placement-v3): add runtime observability and forensic tooling | Open draft, dirty | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #952 | docs(placement-v3): add A37 shadow replay readiness report | Open, dirty | needs manual owner decision | Placement docs; do not merge into this cleanup stream. |
| #951 | feat(placement-v3): add data-quality audit + integrity tooling | Open draft, clean | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #950 | test: stabilize Placement V3 test harness and E2E reliability | Open, dirty | needs manual owner decision | Placement tests; do not merge into this cleanup stream. |
| #948 | chore(placement-v3): add merge-readiness audit for PR stack | Open draft, clean | needs manual owner decision | Placement docs; do not merge into this cleanup stream. |
| #946 | feat(placement-v3): add adaptive item generation gauntlet scaffold | Open draft, unstable | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #944 | feat(placement-v3): add benchmarking infrastructure scaffold | Open draft, clean | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #943 | feat(placement-v3): add grading drift replay harness | Open draft, dirty | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #940 | feat(placement-v3): full UI implementation (A30) | Open draft, dirty | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #939 | feat(placement-v3): conversational Mercy assessment mode (A32) | Open draft, dirty | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #938 | feat(placement-v3): session orchestrator + state machine (A31) | Open draft, dirty | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #937 | feat(placement-v3): prompt library + calibration corpus (A25) | Open draft, dirty | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #936 | feat(placement-v3): recommendation engine + lesson index (A26) | Open draft, dirty | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #935 | feat(placement-v3): storage schema + migrations + RLS (A24) | Open draft, dirty | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #934 | feat(placement-v3): Vietnamese L1 interference taxonomy (A23) | Open draft, unstable | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #933 | feat(placement-v3): AI CEFR grading core for writing assessment | Open draft, unstable | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #932 | docs(placement): v3 design - DET-class AI-graded placement (A22) | Open draft, unstable | needs manual owner decision | Placement; do not merge into this cleanup stream. |
| #926 | docs(observability): chunk recovery instrumentation audit (A14d-audit) | Open, blocked | needs manual owner decision | Observability backlog; owner review required. |
| #924 | feat(public-api-validation): zod schemas for l1-detect (A11c-l1-detect) | Open, blocked | needs manual owner decision | Public API backlog; owner review required. |
| #923 | ci(boundaries): promote Module Boundaries to required-check ruleset (A13-promote) | Open draft, unstable | needs manual owner decision | CI backlog; owner review required. |
| #922 | test(billing): raise src/billing coverage to 75%+ via subscriptionRepository seam tests | Open draft, blocked | needs manual owner decision | Billing tests; owner review required. |
| #916 | feat(admin-validation): zod schemas for admin-list-* trio | Open, blocked | needs manual owner decision | Admin validation backlog; owner review required. |
| #915 | docs(audit): HTTP-200-on-failure pattern sweep across edge functions | Open, blocked | needs manual owner decision | Edge/security docs; owner review required. |
| #914 | feat(admin-validation): zod schemas for admin-management | Open, blocked | needs manual owner decision | Admin validation backlog; owner review required. |
| #911 | feat(admin-validation): zod schemas for admin-hide-room | Open, blocked | needs manual owner decision | Admin validation backlog; owner review required. |
| #910 | feat(admin-validation): zod schemas for admin-publish-room | Open, blocked | needs manual owner decision | Admin validation backlog; owner review required. |
| #907 | feat(admin-validation): zod schemas for admin-set-tier | Open, blocked | needs manual owner decision | Admin validation backlog; owner review required. |
| #906 | feat(sentry): widen DOM-mutation noise filter to include insertBefore | Open, blocked | needs manual owner decision | Observability backlog; owner review required. |
| #905 | docs(skills): formalize agent dispatch discipline | Open, blocked | needs manual owner decision | Governance docs; owner review required. |
| #904 | docs(observability): production error pattern triage | Open, blocked | needs manual owner decision | Observability docs; owner review required. |
| #903 | chore(dead-code): delete dead Teacher-Mercy widget subsystem | Open, blocked | needs manual owner decision | Potentially relevant dead-code cleanup, but predates current map; inspect separately. |
| #902 | docs(security): anon-readable tables investigation | Open, blocked | needs manual owner decision | Security docs; owner review required. |
| #901 | feat(sentry): pin plugin + runtime release.name explicitly | Open, blocked | needs manual owner decision | Observability backlog; owner review required. |
| #897 | docs(security): canonical RLS reference + inline policy documentation | Open, blocked | needs manual owner decision | Security docs; owner review required. |
| #896 | chore(process): PR template soft-enforcement + weekly compliance observability | Open, blocked | needs manual owner decision | Process backlog; owner review required. |
| #895 | feat(webhook): zod runtime validation for RevenueCat payloads | Open, blocked | needs manual owner decision | Billing/webhook backlog; owner review required. |
| #894 | test(billing): raise _billing coverage to 60%+ | Open, blocked | needs manual owner decision | Billing tests; owner review required. |
| #893 | feat(webhook): zod runtime validation for Stripe payloads | Open, blocked | needs manual owner decision | Billing/webhook backlog; owner review required. |
| #892 | docs(audit): Sentry release + sourcemap pipeline audit | Open, blocked | needs manual owner decision | Observability docs; owner review required. |
| #891 | feat(webhook): zod runtime validation for Google RTDN payloads | Open, blocked | needs manual owner decision | Billing/webhook backlog; owner review required. |
| #890 | docs(pr-template): codify real-device verification gate | Open, blocked | needs manual owner decision | Process docs; owner review required. |
| #889 | docs(audit): native Sentry init audit - iOS + Android | Open, blocked | needs manual owner decision | Observability docs; owner review required. |
| #888 | docs(security): edge function security + validation audit | Open, blocked | needs manual owner decision | Security docs; owner review required. |
| #886 | feat(webhook): zod runtime validation for Apple payloads | Open, blocked | needs manual owner decision | Billing/webhook backlog; owner review required. |
| #885 | feat(observability): slow-query instrumentation for Supabase calls | Open, blocked | needs manual owner decision | Observability backlog; owner review required. |
| #884 | ci(coverage): add Vitest coverage gate with per-folder ratchet | Open, dirty | needs manual owner decision | CI backlog; owner review required. |
| #882 | chore(types): regenerate database.types.ts post #789+#832 apply | Open, blocked | needs manual owner decision | Types backlog; owner review required. |
| #881 | chore(principles): P16 sub-clause rebase | Open, dirty | needs manual owner decision | Governance docs; owner review required. |
| #877 | feat(billing): A18 PR2 stripe-webhook repoint | Open draft, dirty | needs manual owner decision | Billing backlog; owner review required. |
| #876 | docs(principles): P18 boxed headline required on every report | Open, dirty | needs manual owner decision | Governance docs; owner review required. |
| #875 | docs(billing): A18 PR2 scope | Open, blocked | needs manual owner decision | Billing docs; owner review required. |
| #857 | chore(sentry): remove smoke-test scaffold | Open draft, dirty | needs manual owner decision | Observability cleanup; owner review required. |
| #829 | docs(principles): P16 sub-clause - harness-policy seam handling | Open, dirty | needs manual owner decision | Governance docs; owner review required. |
| #801 | docs(customer): mylinh apply-ready package | Open, blocked | needs manual owner decision | Customer ops docs; owner review required. |
| #783 | docs: session-end principles refresh | Open, dirty | needs manual owner decision | Governance docs; owner review required. |
| #782 | docs(agent-briefs): premise correction protocol added to preflight checklist | Open draft, dirty | needs manual owner decision | Agent docs; owner review required. |
| #781 | docs(agent-briefs): PR title convention for dispatch-driven PRs | Open, dirty | needs manual owner decision | Agent docs; owner review required. |

## Orphan Candidate Table

| File/component | Evidence | Risk | Recommendation |
| --- | --- | --- | --- |
| `src/lib/kids/viKidsTutorCopy.ts` | `rg` finds only its own exports. It defines `VI_KIDS_TUTOR_TABS` from Kids product config modes. | ORPHAN_CANDIDATE. Reintroduces Journey/Grammar/Speak/Logic into Kids if imported later. | Remove or rewrite in a focused cleanup PR after owner confirms no hidden import path. |
| `src/components/mercy-guide/tabs/AITutorTab.tsx` and `src/components/mercy-guide/hooks/useAITutor.ts` | `AITutorTab` imports `useAITutor`; no route or current panel imports `AITutorTab`. Active AI Tutor is `src/pages/AiTutor.tsx`. | ORPHAN_CANDIDATE and duplicate AI Tutor implementation. | Close over the standalone `/ai-tutor` route; delete after snapshot/import review. |
| `src/components/mercy-guide/MercyGuideTab.tsx` | Only found as its own export; current `MercyGuidePanel.tsx` is a launcher and does not render tab content. | ORPHAN_CANDIDATE. Legacy tab UI can confuse future agents. | Remove after confirming no dynamic imports. |
| `src/components/mercy-guide/MercyEnglishTab.tsx` and `src/components/mercy-guide/MercySuggestTab.tsx` | Only own exports found in targeted scan. | ORPHAN_CANDIDATE. Old helper surfaces duplicate current route guidance. | Review with MercyGuide owner; delete if unreachable. |
| `src/components/mercy-guide/LearningSupportMode.tsx` | Exports `LearningSupportModePicker`; targeted scan finds no import. | ORPHAN_CANDIDATE. Product/level/support selector conflicts with floating helper rule. | Remove if not used by legacy full-page `/mercy/chat`. |
| `src/components/mercy-guide/tabs/FrenchLessonsTab.tsx`, `GermanLessonsTab.tsx`, `LanguageLessonsView.tsx` | Language lesson pages import only `LessonUiLang` type from `LanguageLessonsView`; no current floating panel import found. | ORPHAN_CANDIDATE / static duplicate. Language pages already own lesson routing. | Keep type or move shared type; remove unused tab renderers if confirmed unreachable. |
| `src/components/mercy-guide/MercyGuideReplyLibraryDebug.tsx` | Only own export found. | ORPHAN_CANDIDATE. Debug UI should not ship as reachable product surface. | Delete or gate under dev-only route after owner review. |
| `src/components/mercy-guide/kids/kidPage*Data.ts` and `kidsDataLoader.ts` | Current Kids route uses hardcoded `PICTURES` in `ViKidsEnglishTutor.tsx`; loader comments say used by legacy MercySpeak/MercyTeacher tabs. | ORPHAN_CANDIDATE / legacy Kids content. Could reintroduce non-canonical Kids flow. | Inventory with MercyGuide owner; keep only if still used by approved classic guide. |

## Duplicate Flow Table

| Area | Files/components | Risk | Recommendation |
| --- | --- | --- | --- |
| Kids learning flow | `src/components/kids/ViKidsEnglishTutor.tsx`, `src/lib/kids/viKidsTutorCopy.ts`, `src/lib/tutor/productConfigs.ts` `viKidsEnglish.modes` | Current route is clean, but config/copy still encode adult tabs for Kids. | Build a focused config cleanup PR: Kids config should not expose adult modes. |
| AI Tutor shell | `src/pages/AiTutor.tsx`, `src/components/mercy-guide/tabs/AITutorTab.tsx`, `src/components/mercy-guide/hooks/useAITutor.ts` | Duplicate AI Tutor job; future agents may wire old tab instead of canonical route. | Mark old MercyGuide AI Tutor tab for deletion. |
| Floating helper vs full Teacher Mercy chat | `src/components/mercy-guide/MercyGuidePanel.tsx`, `src/components/MercyGuide.tsx`, `src/pages/mercy/MercyUnifiedPage.tsx`, `UnifiedMercyChat.tsx` | Floating helper is now a route launcher, but legacy `/mercy/chat` has mic/chat/modes and can be mistaken for AI Tutor Logic. | Keep `/mercy/chat` only if product-owned; otherwise document or retire separately. |
| Voice/TTS path | `src/lib/ai-tutor/useTtsSpeaker.ts`, `src/lib/teacher-mercy/voiceEngine.ts`, `src/lib/mercyVoice.ts`, `src/lib/pronunciation/tts.ts`, `src/components/mercy-guide/MercySpeakTab.tsx` | Multiple voice entry points with different safety assumptions. | Keep AI Tutor on `getSpeakableText` + voice engine; audit legacy pronunciation voice separately. |
| Memory summary | `src/lib/ai-tutor/learningMemory.ts`, `src/components/ai-tutor/TutorMemoryCard.tsx`, `src/components/mercy-guide/hooks/useMercyMemory.ts` | M3 is local summary-only; legacy MercyGuide memory stores raw fields and syncs Supabase. | Separate PR to disable or isolate legacy Supabase memory sync from Study OS. |
| Mode config/copy | `src/lib/tutor/productConfigs.ts`, `src/lib/tutor/tutorCopy.ts`, `src/lib/kids/viKidsTutorCopy.ts`, `src/lib/ai-tutor/tutorUiCopy.ts` | Multiple sources define labels/modes; Kids copy conflicts with product rule. | Consolidate source of truth after current audit, one product at a time. |
| CTA routing | `src/components/mercy-guide/MercyGuidePanel.tsx`, `src/components/languages/AITutorCtaBanner.tsx`, `src/pages/Home.tsx` | Current main looks aligned; stale PRs still contain old CTA work. | Close superseded CTA PRs; keep route labels covered by tests. |

## Forbidden UI Findings

| Finding ID | Severity | File | Observed | Expected | Recommended fix |
| --- | --- | --- | --- | --- | --- |
| F-001 | P1 | `src/lib/tutor/productConfigs.ts` | `viKidsEnglish.modes` lists `conversation`, `grammar`, `speak`, `logic`. | Mercy Kids is picture + speak only, no Journey/Grammar/Speak/Logic. | Remove adult modes from Kids config or make it impossible for Kids UI to consume mode tabs. |
| F-002 | P1 | `src/lib/kids/viKidsTutorCopy.ts` | Defines `VI_KIDS_TUTOR_TABS` with Journey, Grammar, Speak, Logic labels. | Kids copy should not advertise adult tutor modes. | Delete or rewrite as picture + speak copy only. |
| F-003 | P0 | `src/components/mercy-guide/hooks/useMercyMemory.ts` | Stores raw-ish fields (`lastSubmittedText`, `lastCorrectedText`, `lastEnhancedText`, `lastPracticeLine`) and syncs to Supabase `teacher_memory`. | Memory must be local summary-only unless separately approved; no full transcript/raw learner text storage. | Disable Supabase sync and remove raw fields, or quarantine legacy Teacher Mercy memory behind explicit approval. |
| F-004 | P1 | `src/components/mercy-guide/types.ts` and legacy tabs | `MercyGuideTab` still includes `grammar`, `pronunciation`, `logic`; legacy guide tabs still exist while floating panel is a launcher. | Floating helper should be navigation/helper only, not product/mode selector. | Confirm whether `/mercy/chat` owns these; delete unreachable floating-helper tabs. |
| F-005 | P2 | `src/components/mercy-guide/tabs/AITutorTab.tsx` | Old AI Tutor chat interface exists under MercyGuide. | Canonical AI Tutor is `/ai-tutor`. | Remove old tab after owner confirms it is unreachable. |
| F-006 | P2 | `src/components/mercy-guide/tabs/FrenchLessonsTab.tsx`, `GermanLessonsTab.tsx` | Language lesson tab renderers exist inside MercyGuide area. | Language pages own language lesson navigation; floating helper should not be a lesson browser. | Move any shared type out, then delete unreachable tab renderers. |
| F-007 | P2 | `src/components/MercyGuide.tsx` | Still passes many classic tab props into `MercyGuidePanel`, but current panel ignores them. | Floating helper implementation should match launcher-only role. | Simplify parent component after confirming no classic panel needs these props. |

## Safety Findings

| Safety item | Status | Evidence | Recommendation |
| --- | --- | --- | --- |
| Client-side provider secrets in active Study OS paths | PASS in inspected active paths | AI Tutor voice calls `fetchCloudTtsUrl`, which invokes `mercy-tts`; provider keys live in edge functions. | Keep provider keys server-side. |
| Raw audio storage in active AI Tutor/Kids | PASS in inspected active paths | Kids footer says no audio storage; AI Tutor memory has no audio fields. | Keep audio transient. |
| Full transcript storage in AI Tutor M3 | PASS | `learningMemory.ts` stores summary aggregates and generated IDs only. | Keep M3 local summary-only. |
| Supabase memory sync | FAIL P0 outside AI Tutor M3 | `useMercyMemory.ts` reads/upserts/deletes `teacher_memory`. | Remove/disable/quarantine unless separately approved. |
| Raw learner text in memory card | PASS for AI Tutor M3 | `TutorMemoryCard.tsx` renders topic/count summary fields. | Keep card summary-only. |
| Raw learner text in legacy memory | FAIL P0 | `useMercyMemory.ts` and `GrammarWritingTab.tsx` use `lastSubmittedText`, `lastCorrectedText`, `lastEnhancedText`. | Remove raw fields from persistent memory. |
| Raw learner input spoken as corrected text | PASS in active AI Tutor route | `AiTutor.tsx` uses `getSpeakableText(result/message)` and `ConversationMode` speaker button only on Mercy messages; Logic blocks speak. | Wire `rawUserInput` guard into `useTtsSpeaker` in a future safety PR if needed. |
| Placement writeback from Study OS | PASS in inspected Study OS paths | No Placement imports in AI Tutor/Kids active route files. | Keep Placement work isolated. |

## Recommended Cleanup PRs

### PR 1: Stale PR Closure List

Close or explicitly supersede:

- #1082
- #1081 unless owner wants archive history
- #1067
- #1066
- #1064
- #1061
- #1060
- #1059
- #1038

Hold/manual owner decision:

- #1083
- #1065
- #1063
- Placement PRs #992, #967, #965, #964, #963, #961, #959, #954
- governance PRs #987, #983

### PR 2: Orphan Removal Candidate Review

Review and remove only after import/screenshot confirmation:

- `src/lib/kids/viKidsTutorCopy.ts`
- `src/components/mercy-guide/tabs/AITutorTab.tsx`
- `src/components/mercy-guide/hooks/useAITutor.ts`
- `src/components/mercy-guide/MercyGuideTab.tsx`
- `src/components/mercy-guide/MercyEnglishTab.tsx`
- `src/components/mercy-guide/MercySuggestTab.tsx`
- `src/components/mercy-guide/LearningSupportMode.tsx`
- `src/components/mercy-guide/MercyGuideReplyLibraryDebug.tsx`
- legacy MercyGuide language lesson tabs if unreachable

### PR 3: Duplicate Flow Consolidation

Keep focused:

- Align Kids product config/copy with picture + speak only.
- Keep canonical AI Tutor at `/ai-tutor`.
- Keep floating helper as route launcher only.
- Do not touch Placement.

### PR 4: Safety Cleanup For Legacy MercyGuide Memory

This should come before broad Study OS memory work:

- Stop unapproved Supabase `teacher_memory` sync.
- Remove raw submitted/corrected/enhanced text from persistent memory.
- Keep only summary-safe local fields if the legacy guide remains.

## Blockers / Remaining Risks

- The audit did not close PRs directly, per instruction.
- `gh pr diff 954 --name-only` failed because the diff exceeds GitHub's 300-file API limit.
- Full visual QA was not run; findings are code/search based.
- No build was run because this PR is docs-only.

## Validation

```sh
git diff --check
```

Result: passed.
