# Continuous Logic Flow Map

Date: 2026-05-24

Source of truth:

- [APP_LOGIC_FLOW.md](./APP_LOGIC_FLOW.md)
- [FLOW_COMPLIANCE_PLAYBOOK.md](./FLOW_COMPLIANCE_PLAYBOOK.md)
- [FLOW_COMPLIANCE_AUDIT.md](./FLOW_COMPLIANCE_AUDIT.md)
- [TEACHER_MERCY_LEARNING_OS.md](./TEACHER_MERCY_LEARNING_OS.md)
- [STRATEGY.md](../../STRATEGY.md)

This document connects MercyB as one product logic flow: product vision -> user routes -> screens -> components -> buttons/CTAs -> engines -> memory/voice -> tests -> safety boundaries.

Core rule: Mercy Kids and AI Tutor are separate products. Shared Teacher Mercy systems may support both, but the user-facing flows must not merge into one confusing workspace.

## Master Map

```text
Home
├── Mercy Kids
│   ├── Route: `/kids/vi-english`
│   ├── User: very young kids / parent-assisted children
│   ├── First action: choose picture
│   ├── Second action: tap speak
│   ├── Flow:
│   │   ├── choose picture
│   │   ├── tap speak
│   │   ├── kid speaks
│   │   ├── Mercy responds
│   │   └── reward / next picture
│   └── Must never show:
│       ├── Journey / Grammar / Speak / Logic tabs
│       ├── adult AI Tutor shell
│       ├── textarea as main flow
│       ├── advanced correction panel
│       ├── memory card as main child flow
│       └── product/level selector confusion
│
├── AI Tutor Adult
│   ├── Route: `/ai-tutor`
│   ├── Target routes:
│   │   ├── `/ai-tutor?target=fr`
│   │   ├── `/ai-tutor?target=zh`
│   │   └── other supported target languages
│   ├── User: older learners / adults
│   ├── First action: Today’s Lesson or choose mode
│   ├── Flow:
│   │   ├── Today’s Lesson
│   │   ├── short practice
│   │   ├── correction
│   │   ├── retry
│   │   ├── Vietlish logic explanation
│   │   ├── safe memory summary
│   │   └── next recommended lesson
│   ├── Modes:
│   │   ├── Journey = conversation practice
│   │   ├── Grammar = correction / sentence repair
│   │   ├── Speak = speaking practice
│   │   └── Logic = English/Vietlish reasoning only
│   └── Must never show:
│       ├── Kids picture+speak as the adult main flow
│       ├── raw learner input as spoken corrected text
│       ├── Logic mode TTS/mic/speaker/fallback labels
│       └── unsafe memory sync
│
├── Floating Mercy Helper
│   ├── Purpose: guidance/navigation only
│   ├── May show:
│   │   ├── Teacher Mercy / Mercy Guide identity
│   │   ├── close/minimize
│   │   ├── simple helper text
│   │   ├── CTA to Mercy Kids
│   │   └── CTA to AI Tutor
│   └── Must never become:
│       ├── product mode selector
│       ├── Kids workspace
│       ├── Vietnamese explanation level selector
│       ├── tree/leaf level system
│       └── mixed Kids + AI Tutor panel
│
├── Voice System
│   ├── Speaker reads clean learner-facing text only
│   ├── Allowed speakable fields:
│   │   ├── correctedText
│   │   ├── naturalReply
│   │   └── nextQuestion
│   ├── Fallback must be labeled honestly
│   └── Must never:
│       ├── read raw wrong learner input as corrected
│       ├── read labels/headings/metadata
│       ├── expose provider secrets client-side
│       ├── store raw audio
│       └── appear in Logic mode
│
├── Memory System
│   ├── Local summary-only memory
│   ├── Semantic memory boundary:
│   │   ├── mercy_user_facts = what Mercy remembers about the learner/person
│   │   └── Study OS event summaries = recent local study behavior
│   ├── Allowed:
│   │   ├── strongest topic
│   │   ├── topic needing review
│   │   ├── practice count
│   │   ├── last practiced
│   │   ├── suggested next focus
│   │   ├── mastery/weak pattern summary
│   │   └── safe counts/booleans/timestamps from local events
│   └── Must never:
│       ├── store raw audio
│       ├── store full transcript
│       ├── show raw learner text in memory card
│       ├── store corrected sentence text
│       ├── merge Study OS summaries with mercy_user_facts
│       ├── Supabase sync without approval
│       ├── external analytics without privacy review
│       └── Placement writeback
│
├── Safe Learning Events
│   ├── Local-only summary event engine
│   ├── Contract events:
│   │   ├── lesson_started / lesson_resumed
│   │   ├── lesson_completed / lesson_restarted
│   │   ├── mode_selected
│   │   ├── mistake_retried
│   │   ├── logic_insight_viewed
│   │   ├── next_focus_viewed
│   │   ├── placement_cta_clicked
│   │   ├── kids_picture_selected
│   │   └── kids_speak_clicked
│   └── Must never:
│       ├── sync to Supabase or external analytics without approval
│       ├── store raw learner text, corrected text, transcript, or audio
│       ├── store PII, Supabase user IDs, JWTs, provider keys, or secrets
│       └── write back to Placement
│
└── Study OS
    ├── What the learner knows
    ├── What the learner is weak at
    ├── What to study next
    ├── How to review
    ├── Behavioral signal layer: #1109 local event summaries only
    └── Future parent/teacher dashboard
```

## Flow Boundaries

| Product area | User promise | Allowed first action | Forbidden first action |
| --- | --- | --- | --- |
| Mercy Kids | Picture + speak for very young children | Choose a picture | Choose an adult mode |
| AI Tutor Adult | Guided study with modes, memory, correction, logic, and progress | Continue Today’s Lesson or choose a mode | Manage child picture cards |
| Floating Mercy Helper | Route guidance only | Open Kids or AI Tutor | Configure product, level, or mixed modes |
| Logic mode | English/Vietlish reasoning | Type a sentence or choose a reasoning prompt | Speak, record, play TTS, or show fallback voice |
| Voice | Read clean learner-facing text | Read corrected text, natural reply, or next question | Read raw learner input, labels, metadata, or hidden text |
| Memory | Local aggregate summary | Store topic tags, counts, last practiced, next focus | Store raw audio, transcript, raw learner text, corrected sentence text, or sync to Supabase |
| Safe learning events | Local aggregate study signals | Store allowlisted event type, product, target language, mode, topic tag, timestamp, local session key, count/value | Store raw/corrected text, transcripts, audio, PII, Supabase IDs/JWTs, provider secrets, external analytics, or Placement writeback |
| Study OS event summaries | Local behavioral signal layer | Derive time-windowed counts, booleans, and timestamps from safe local learning events | Become semantic memory, merge into `mercy_user_facts`, sync to Supabase, feed raw admin dashboards, or write to Placement |

## File Ownership Map

### Mercy Kids

- `src/components/kids/ViKidsEnglishTutor.tsx`
- `src/components/kids/__tests__/ViKidsEnglishTutor.test.tsx`
- `src/pages/kids/ViKidsEnglishTutorPage.tsx`
- `src/router/AppRouter.tsx` route: `/kids/vi-english`

Ownership rule: this route owns the very young child picture + speak loop. It must not import or render AI Tutor mode tabs, advanced correction panels, or memory cards as the main child flow.

### AI Tutor

- `src/pages/AiTutor.tsx`
- `src/pages/__tests__/AiTutor.test.tsx`
- `src/pages/__tests__/AiTutor.pageGuard.test.tsx`
- `src/components/ai-tutor/ConversationMode.tsx`
- `src/components/ai-tutor/CorrectionMode.tsx`
- `src/components/ai-tutor/TutorMemoryCard.tsx`
- `src/components/teacher-mercy/TeacherMercyLearningShell.tsx`
- `src/router/AppRouter.tsx` route: `/ai-tutor`

Ownership rule: AI Tutor owns older learner/adult modes, target-language routing, correction, conversation, speak practice, Logic mode, Today’s Lesson, and safe memory summary.

### Floating Helper

- `src/components/MercyGuide.tsx`
- `src/components/mercy-guide/MercyGuidePanel.tsx`
- `src/components/mercy-guide/__tests__/MercyGuidePanel.launcher.test.tsx`
- `src/components/mercy-guide/types.ts`
- related MercyGuide tests

Ownership rule: the floating helper guides users to the correct product route. It must not become a product selector, child workspace, adult AI Tutor workspace, support-level selector, or tree/leaf level system.

### Tutor Engines

- `src/lib/tutor/todayLessonPlanner.ts`
- `src/lib/tutor/tests/todayLessonPlanner.test.ts`
- `src/lib/tutor/vietlishLogicEngine.ts`
- `src/lib/tutor/tests/vietlishLogicEngine.test.ts`
- `src/lib/tutor/tutorEngine.ts`
- `src/lib/tutor/correctionEngine.ts`
- `src/lib/tutor/correctionRules/en.ts`
- related tutor tests under `src/lib/tutor/tests/`

Ownership rule: engines produce structured learning decisions and learner-facing outputs. They should not store raw audio, full transcripts, or write to Placement.

### Voice

- `src/lib/ai-tutor/useTtsSpeaker.ts`
- `src/lib/teacher-mercy/voiceEngine.ts`
- `src/lib/mercyVoice.ts`
- `src/lib/tutor/speakableText.ts`
- `supabase/functions/mercy-tts/*`
- voice and TTS tests where present

Ownership rule: voice may read clean learner-facing output only. Cloud provider access must stay server-side. Device fallback must be labeled honestly and must not appear in Logic mode.

### Memory

- `src/lib/ai-tutor/learningMemory.ts`
- memory tests under `src/lib/ai-tutor/` and `src/pages/__tests__/AiTutor.test.tsx`
- `src/components/ai-tutor/TutorMemoryCard.tsx`

Ownership rule: memory is local and summary-only. It may hold safe topic tags, aggregate counts, last practiced, and suggested next focus. It must not hold raw learner text, full transcripts, raw audio, user IDs, JWTs, or Supabase memory sync.

Study OS event summaries are a separate local behavioral signal layer. They describe recent study-flow activity, not learner identity or semantic facts. They may be derived from #1109 safe local learning events and must remain local-only, time-windowed, count/boolean/timestamp based, and free of raw learner content, transcript/audio, corrected sentence text, PII, child identity, Placement result/status/writeback, Supabase sync, and external analytics. They must not read/write/merge with `mercy_user_facts` unless a later explicit reviewed design authorizes that crossing.

### Routes/CTA

- `src/router/AppRouter.tsx`
- `src/lib/placement/availability.ts`
- `src/pages/Home.tsx`
- `src/pages/MarketingLandingPage.tsx`
- `src/components/languages/AITutorCtaBanner.tsx`
- language pages that render `AITutorCtaBanner`

Ownership rule: CTA labels must match destinations. Kids CTAs route to `/kids/vi-english`; AI Tutor CTAs route to `/ai-tutor` or `/ai-tutor?target=<language-code>`. Home and AI Tutor Placement CTAs must use the same shared placement availability source as the `/placement` route guard, and no user-facing CTA should point to unavailable `/placement`.

### Safe Learning Events

- `src/lib/tutor/learningEvents.ts`
- `src/lib/tutor/tests/learningEvents.test.ts`

Ownership rule: learning events are local-only summary signals. #1109 added the engine contract but did not wire events into AI Tutor or Mercy Kids flows. Future wiring must keep the allowlisted payload shape and must not add raw learner text, corrected sentence text, transcripts, raw audio, PII, Supabase user IDs, JWTs, provider keys/secrets, external analytics providers, Supabase sync, or Placement writeback.

### Docs/Guardrails

- `docs/app/APP_LOGIC_FLOW.md`
- `docs/app/FLOW_COMPLIANCE_PLAYBOOK.md`
- `docs/app/FLOW_COMPLIANCE_AUDIT.md`
- `docs/app/CONTINUOUS_LOGIC_FLOW_MAP.md`
- `docs/app/REPO_LOGIC_INSPECTION_PROTOCOL.md`
- `docs/app/STUDY_FLOW_PSYCHOLOGY_PLAYBOOK.md` if present
- `docs/app/TEACHER_MERCY_LEARNING_OS.md`
- `STRATEGY.md`
- `ROADMAP.md`

Ownership rule: docs define product boundaries before code expands. If code and docs disagree, open an audit/fix PR rather than widening product scope silently.

## Initial Repo Logic Scan

This is a small first application of the inspection protocol, not a full compliance audit.

| Area | Current evidence | Initial status | Notes |
| --- | --- | --- | --- |
| `/kids/vi-english` | `src/router/AppRouter.tsx` routes to `src/pages/kids/ViKidsEnglishTutorPage.tsx`, which renders `src/components/kids/ViKidsEnglishTutor.tsx`. The component comments and UI show a two-column picture + speak flow with no textarea or AI Tutor tabs. | Appears aligned | `ViKidsEnglishTutor.tsx` still uses local STT/TTS for the child speak loop. Keep tests focused on no tabs, no textarea, no AI Tutor CTA in the kid card. |
| `/ai-tutor` | `src/pages/AiTutor.tsx` derives `AI_TUTOR_MODES` from `aiTutorConfig.modes` and uses `TeacherMercyLearningShell`, `CorrectionMode`, `ConversationMode`, and `TutorMemoryCard`. | Appears aligned | Adult route owns Journey, Grammar, Speak, Logic, Today’s Lesson, and memory. |
| AI Tutor target routes | `src/pages/AiTutor.tsx` resolves target from search params; `src/components/languages/AITutorCtaBanner.tsx` links to `/ai-tutor?target=${resolveTutorTargetLanguage(target)}`. | Appears aligned | Covers `/ai-tutor?target=fr`, `/ai-tutor?target=zh`, and supported target languages. |
| Logic mode | `src/components/ai-tutor/ConversationMode.tsx` sets `allowTts = mode !== "logic"` and hides `TeacherMercyVoiceControls` when `isLogicMode` is true. | Appears aligned | Logic mode still uses a textarea for reasoning input, which is allowed for AI Tutor Logic and forbidden only as the Kids main flow. |
| Floating Mercy helper | `src/components/mercy-guide/MercyGuidePanel.tsx` now renders a neutral Teacher Mercy launcher with `Vào Mercy Kids` -> `/kids/vi-english` and `Mở AI Tutor` -> `/ai-tutor`. | Appears aligned | #1093 is reflected on main. Old product/level selector UI is not present in this panel. |
| Voice ownership | `src/lib/tutor/tutorEngine.ts` builds `shouldReadAloudText` from corrected text, natural reply, and next question; `src/lib/teacher-mercy/voiceEngine.ts` sanitizes speakable text and refuses raw input when provided as a guard. | Appears aligned, needs focused security review | `src/lib/mercyVoice.ts` invokes `supabase.functions.invoke("mercy-tts")`; provider keys are in `supabase/functions/mercy-tts/*`. A separate voice security audit should verify no client-side provider key path exists. |
| Memory ownership | `src/lib/ai-tutor/learningMemory.ts` states it stores aggregate summary only and rejects raw audio, raw text, transcripts, PII, JWT content, and user IDs. `TutorMemoryCard.tsx` displays topic/count summaries. | Appears aligned | No Supabase memory sync observed in this targeted scan. |
| Today’s Lesson Planner | `src/lib/tutor/todayLessonPlanner.ts` maps safe memory summary fields to lesson title, target skill, reason, steps, mode, and next focus. | Appears aligned | It uses summary fields, not raw learner text. |
| Vietlish Logic Engine | `src/lib/tutor/vietlishLogicEngine.ts` provides beginner-friendly diagnoses for four common patterns plus fallback. | Appears aligned | It is reusable by Logic mode and Today’s Lesson later; current scan did not confirm it is wired into UI. |
| Duplicate/orphan candidates | `src/components/mercy-guide/tabs/AITutorTab.tsx`, `src/components/mercy-guide/hooks/useAITutor.ts`, and legacy `MercyGuide` tab types still exist while `MercyGuidePanel.tsx` is now a route launcher. | Needs review | Do not delete in this PR. Future Inspector should determine whether these are reachable through other MercyGuide surfaces or stale PR leftovers. |
| Product config drift | `src/lib/tutor/productConfigs.ts` has `viKidsEnglish.modes` including `conversation`, `grammar`, `speak`, and `logic` while the live Kids route is picture + speak only. | Needs review | This is not a live UI regression in the inspected route, but it is a duplication/regression risk if future UI consumes that config. |
| Home Kids CTA | `src/pages/Home.tsx` has AI Tutor CTA text/routing; this targeted scan did not find a direct Home `Mercy Kids` CTA outside the floating helper. | Needs review | If product wants visible homepage cards for both products, add a future product/UI PR. Do not mix this with the docs system PR. |

## Current Safety Boundaries

- Provider/env/secrets/access changes: not part of this map.
- Client-side provider secrets: forbidden; voice provider keys must remain in edge functions.
- Raw audio storage: forbidden.
- Full transcript storage: forbidden.
- Supabase memory sync: forbidden unless separately approved.
- Placement writeback: forbidden.
- Product code changes: forbidden in docs-only flow mapping PRs.
