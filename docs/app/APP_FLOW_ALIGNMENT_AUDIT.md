# App Flow Alignment Audit

## Overall Verdict

**Not aligned**

`docs/app/APP_LOGIC_FLOW.md` does not exist on the audited base commit, so this audit uses the expected behaviors from the A3 task brief as the comparison source. The largest gaps are in Mercy Kids and AI Tutor Logic mode. AI Tutor target-language routing, voice sanitation, and local summary-only memory are mostly aligned with the expected flow.

## Checklist

| Area | Expected behavior | Actual behavior | Status | File/component evidence |
| --- | --- | --- | --- | --- |
| Source flow doc | Audit against `docs/app/APP_LOGIC_FLOW.md`. | `docs/app/APP_LOGIC_FLOW.md` and `docs/app/` were absent on `origin/main` when audited. | Needs review | `sed docs/app/APP_LOGIC_FLOW.md` failed with file not found; this audit creates `docs/app/APP_FLOW_ALIGNMENT_AUDIT.md`. |
| Mercy Kids route | `/kids/vi-english` renders Mercy Kids. | Route exists and renders `ViKidsEnglishTutorPage`. | Pass | `src/router/AppRouter.tsx:1092`, `src/pages/kids/ViKidsEnglishTutorPage.tsx:1` |
| Mercy Kids simplicity | Main kid flow should be choose picture -> tap speak -> kid speaks -> Mercy responds -> reward / next picture. | Current page is a Teacher Mercy tutor shell with mode tabs, memory slots, correction textarea, grammar card, logic task, speaker/mic controls. No picture-choice or reward/next-picture flow found in inspected component. | Fail | `src/components/kids/ViKidsEnglishTutor.tsx:57`, `src/components/kids/ViKidsEnglishTutor.tsx:64`, `src/components/kids/ViKidsEnglishTutor.tsx:93`, `src/components/kids/ViKidsEnglishTutor.tsx:119`, `src/components/kids/ViKidsEnglishTutor.tsx:153`, `src/components/kids/ViKidsEnglishTutor.tsx:161` |
| Mercy Kids layout | UI should have two main columns: choose picture and speak. | Component renders a single max-width card section with conditional mode panels and one textarea, not two choose/speak columns. | Fail | `src/components/kids/ViKidsEnglishTutor.tsx:72`, `src/components/kids/ViKidsEnglishTutor.tsx:161` |
| Mercy Kids tabs | No Journey / Grammar / Speak / Logic tabs. | Kids copy defines Journey, Grammar, Speak, Logic tabs and passes them into `TeacherMercyLearningShell`. | Fail | `src/lib/kids/viKidsTutorCopy.ts:5`, `src/components/kids/ViKidsEnglishTutor.tsx:64` |
| Mercy Kids advanced correction panels | No advanced AI Tutor-style correction panels as the main kid flow. | Kids imports AI Tutor memory and voice infrastructure, shows grammar correction content, explanation content, and correction textarea. | Fail | `src/components/kids/ViKidsEnglishTutor.tsx:2`, `src/components/kids/ViKidsEnglishTutor.tsx:93`, `src/components/kids/ViKidsEnglishTutor.tsx:103`, `src/components/kids/ViKidsEnglishTutor.tsx:161` |
| Mercy Kids AI Tutor CTA | No AI Tutor CTA inside Mercy Kids card. | No explicit `/ai-tutor` or "AI Tutor" CTA found in `src/components/kids`, `src/pages/kids`, or `src/lib/kids`. | Pass | `rg "ai-tutor\|AI Tutor" src/components/kids src/pages/kids src/lib/kids` |
| AI Tutor route | `/ai-tutor` works. | Route exists behind `FEATURE_FLAGS.AI_TUTOR_UI_ENABLED`. | Pass | `src/router/AppRouter.tsx:1113` |
| AI Tutor target routes | `/ai-tutor?target=fr` and `/ai-tutor?target=zh` work. | Page resolves `target` from `window.location.search`; tests cover French and Chinese target copy and Journey starters. | Pass | `src/pages/AiTutor.tsx:138`, `src/pages/__tests__/AiTutor.test.tsx:280`, `src/pages/__tests__/AiTutor.test.tsx:292`, `src/pages/__tests__/AiTutor.test.tsx:314`, `src/pages/__tests__/AiTutor.test.tsx:325` |
| AI Tutor mode separation | Journey = conversation, Grammar = correction, Speak = speaking practice, Logic = deep English logic / Vietlish explanation with no voice UI. | AI Tutor has the four mode tabs. Grammar routes to `CorrectionMode`; Journey/Speak/Logic all route through `ConversationMode`, so Logic shares conversation messages and input flow. | Needs review | `src/pages/AiTutor.tsx:195`, `src/pages/AiTutor.tsx:422`, `src/pages/AiTutor.tsx:457` |
| Logic TTS/speaker UI | Logic mode must not show speaker/TTS button, `Mercy đọc`, or voice fallback label. | `ConversationMode` sets `allowTts = mode !== "logic"` and guards speaker button plus voice labels. Existing test asserts no speaker controls or fallback labels. | Pass | `src/components/ai-tutor/ConversationMode.tsx:60`, `src/components/ai-tutor/ConversationMode.tsx:160`, `src/components/ai-tutor/ConversationMode.tsx:184`, `src/pages/__tests__/AiTutor.test.tsx:334` |
| Logic mic/audio UI | Logic mode must not show mic/audio UI. | `ConversationMode` always renders `TeacherMercyVoiceControls kind="mic"` in the input footer, regardless of mode. | Fail | `src/components/ai-tutor/ConversationMode.tsx:223`, `src/components/ai-tutor/ConversationMode.tsx:224` |
| Logic starter question | Logic mode must not show morning starter question. | AI Tutor initializes `conversationMessages` with `createOpeningMessage(...)`; Logic reuses those messages. The current test expects the morning starter question in Logic mode. | Fail | `src/pages/AiTutor.tsx:162`, `src/pages/__tests__/AiTutor.test.tsx:334` |
| Logic content | Logic mode should explain English structure and avoid Vietlish. | Logic mode has separate title/description/input copy, but reply generation still uses `buildConversationReply`, target-specific correction, natural replies, and next-question templates. No dedicated English-structure-only logic engine was found. | Fail | `src/components/ai-tutor/ConversationMode.tsx:78`, `src/pages/AiTutor.tsx:115`, `src/pages/AiTutor.tsx:457` |
| Voice clean text | Speaker reads only clean learner-facing text, not raw learner input, labels/headings, metadata, or hidden UI copy. | Correction turns set `shouldReadAloudText` to corrected text only. Conversation turns build speakable text from corrected text, natural reply, and next question, then `getSpeakableText` validates against raw user text and sanitizes labels. | Pass | `src/lib/tutor/tutorEngine.ts:76`, `src/lib/tutor/tutorEngine.ts:93`, `src/lib/tutor/tutorEngine.ts:138`, `src/lib/tutor/speakableText.ts:1`, `src/pages/AiTutor.tsx:383` |
| Voice fallback label | Device fallback label appears only when cloud voice fails. | `useTtsSpeaker` sets `voiceSource` to `"mercy"` only when cloud playback succeeds and `"device"` only when fallback succeeds; UI labels render only when `ttsVoiceSource` exists. | Pass | `src/lib/ai-tutor/useTtsSpeaker.ts:104`, `src/components/ai-tutor/CorrectionMode.tsx:195`, `src/components/ai-tutor/ConversationMode.tsx:184` |
| Mercy voice claim | App does not claim Mercy voice unless cloud audio succeeds. | `speakTutorText` returns `cloud: true` only after `playCloudAudio` succeeds; `useTtsSpeaker` maps that result to `voiceSource: "mercy"`. | Pass | `src/lib/teacher-mercy/voiceEngine.ts:299`, `src/lib/teacher-mercy/voiceEngine.ts:301`, `src/lib/ai-tutor/useTtsSpeaker.ts:107` |
| Memory locality | Memory is local summary-only; no Supabase sync. | AI Tutor memory uses IndexedDB `mb-ai-tutor` and stores summary rows in `memorySummaries`. No Supabase calls were found under `src/lib/ai-tutor/learningMemory.ts`. | Pass | `src/lib/ai-tutor/learningMemory.ts:1`, `src/lib/ai-tutor/learningMemory.ts:7`, `src/lib/ai-tutor/learningMemory.ts:118` |
| Memory safe card | Memory card shows strongest topic, topic needing review, last practiced, practice count, suggested next focus; no raw learner text/full transcript/raw audio. | Memory summary type stores aggregate tags/counts only. Card displays total corrections, practiced count, strongest topic, topic needing review, last topic, and suggested next focus. It does not display raw text or transcripts. | Pass | `src/lib/ai-tutor/learningMemory.ts:15`, `src/components/ai-tutor/TutorMemoryCard.tsx:26`, `src/components/ai-tutor/TutorMemoryCard.tsx:34`, `src/components/ai-tutor/TutorMemoryCard.tsx:39`, `src/components/ai-tutor/TutorMemoryCard.tsx:44`, `src/components/ai-tutor/TutorMemoryCard.tsx:50` |
| M4 scope | M4 remains docs/planning only. | No M4 memory sync code was found in `src/lib/ai-tutor`, `src/pages/AiTutor.tsx`, or `src/components/ai-tutor`. Placement V5 memory docs/code exist outside AI Tutor scope. | Pass | `rg "M4\|memory sync\|Supabase memory" docs src/lib/ai-tutor src/pages/AiTutor.tsx src/components/ai-tutor`; `docs/placement/v5/*` is separate Placement documentation. |

## Specific Mismatches Found

1. **Mercy Kids is implemented as an advanced Teacher Mercy tutor shell, not a toddler-simple picture/speak flow.**
   The `/kids/vi-english` page renders `TeacherMercyLearningShell`, mode tabs, memory slots, grammar/logic/speak panels, and a correction textarea. The expected two-column "choose picture" and "speak" flow is not present in the inspected Kids implementation.

2. **Mercy Kids exposes Journey / Grammar / Speak / Logic tabs.**
   `VI_KIDS_TUTOR_TAB_LABELS` defines all four labels and `ViKidsEnglishTutor` passes them to the shared shell.

3. **AI Tutor Logic mode still shows mic UI.**
   `ConversationMode` disables TTS in Logic via `allowTts`, but the mic control is rendered unconditionally in the footer.

4. **AI Tutor Logic mode still starts from the conversation starter question.**
   `AiTutorPage` initializes `conversationMessages` with `createOpeningMessage(...)`, and Logic mode reuses `ConversationMode`. The existing test explicitly expects "What do you usually do in the morning?" after clicking Logic.

5. **AI Tutor Logic mode does not have a dedicated logic response path.**
   Logic mode uses `ConversationMode` and `buildConversationReply`, which are conversation/correction oriented. No separate English-structure-only logic engine or response builder was found in the inspected files.

6. **The requested source document is missing.**
   `docs/app/APP_LOGIC_FLOW.md` is not present on the current main branch. That makes the task brief the only available expected-flow source for this audit.

## Recommended Fixes

### P0 Blocking

- Replace `/kids/vi-english` with a Kids-specific flow that does not use `TeacherMercyLearningShell` mode tabs as the main interaction. The main surface should be only picture choice and speak.
- Remove Journey / Grammar / Speak / Logic tabs from Mercy Kids.
- Remove advanced correction textarea and grammar/logic panels from the primary Mercy Kids experience.
- Hide mic/audio UI in AI Tutor Logic mode.
- Remove the conversation starter question from Logic mode.

### P1 Important

- Add a dedicated Logic mode component or response path instead of reusing conversation messages. It should focus on English structure and Vietlish explanation rules without TTS/mic UI.
- Add tests that assert Mercy Kids does not render `teacher-mercy-mode-tabs`, "Grammar", "Speak", "Logic", correction textarea, or AI Tutor-style correction panels.
- Add tests that assert Logic mode does not render the mic control and does not show the morning starter question.
- Add route smoke coverage for `/kids/vi-english`, `/ai-tutor?target=fr`, and `/ai-tutor?target=zh` through the real router, not only component-level URL setup.

### P2 Polish

- Restore or create `docs/app/APP_LOGIC_FLOW.md` so future audits can compare against a stable source of truth.
- Align naming between `journey` and `conversation` across product config, UI copy, and component props to reduce ambiguity.
- Consider a Kids-specific memory/reminder treatment if memory remains enabled; current Kids uses the AI Tutor memory card component.

## Audit Scope Notes

- Product code was not changed.
- No Placement files were modified.
- No provider, environment, secrets, access, memory sync, Supabase, raw audio, or transcript storage changes were made.
