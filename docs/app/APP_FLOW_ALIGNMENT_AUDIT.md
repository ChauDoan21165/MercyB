# App Flow Alignment Audit

## Overall Verdict

**Not aligned**

This refresh audits current `origin/main` against `docs/app/APP_LOGIC_FLOW.md`.

PR status checked during refresh:

- #1080 App Logic Flow doc: **merged**.
- #1079 Mercy Kids two-column picture + speak flow: **open**, not present on current main.
- #1077 AI Tutor Logic no-TTS/no-mic/no-speaking UI: **open**, not fully present on current main.

The source-of-truth document now exists, which resolves the previous audit's "missing flow doc" blocker. The major product-flow mismatches remain in Mercy Kids and AI Tutor Logic mode.

## Checklist

| Area | Expected behavior from `APP_LOGIC_FLOW.md` | Actual behavior on current main | Status | File/component evidence |
| --- | --- | --- | --- | --- |
| Source flow doc | `docs/app/APP_LOGIC_FLOW.md` is the source of truth. | File exists and defines Mercy Kids vs AI Tutor split, Kids picture/speak flow, Logic no-audio rule, voice safety, and memory boundaries. | Pass | `docs/app/APP_LOGIC_FLOW.md` |
| PR #1080 | App Logic Flow doc should be merged before refresh. | #1080 is merged on current main. | Resolved | `gh pr view 1080` returned `state: MERGED`; current HEAD includes `docs(app): add app logic flow guide`. |
| PR #1079 | Mercy Kids two-column picture + speak flow should be available before marking Kids resolved. | #1079 is still open and its two-column implementation is not on current main. | Needs review | `gh pr view 1079` returned `state: OPEN`; `src/components/kids/ViKidsEnglishTutor.tsx` still uses tutor shell and tabs. |
| PR #1077 | AI Tutor Logic should have no TTS/no mic/no speaking UI before marking Logic resolved. | #1077 is still open. Current main hides speaker/TTS in Logic, but still renders mic UI and starter conversation content. | Needs review | `gh pr view 1077` returned `state: OPEN`; `src/components/ai-tutor/ConversationMode.tsx` |
| Mercy Kids route | `/kids/vi-english` is the Mercy Kids flow. | Route exists and renders `ViKidsEnglishTutorPage`. | Pass | `src/router/AppRouter.tsx`, `src/pages/kids/ViKidsEnglishTutorPage.tsx` |
| Mercy Kids simple flow | Flow should be choose picture -> tap speak -> kid speaks -> Mercy responds -> reward / next picture. | Current page renders `TeacherMercyLearningShell`, mode tabs, conditional grammar/speak/logic panels, memory slots, and a correction textarea. No picture choice or reward/next-picture flow is present in the inspected component. | Fail | `src/components/kids/ViKidsEnglishTutor.tsx:57`, `src/components/kids/ViKidsEnglishTutor.tsx:64`, `src/components/kids/ViKidsEnglishTutor.tsx:67`, `src/components/kids/ViKidsEnglishTutor.tsx:93`, `src/components/kids/ViKidsEnglishTutor.tsx:119`, `src/components/kids/ViKidsEnglishTutor.tsx:153`, `src/components/kids/ViKidsEnglishTutor.tsx:161` |
| Mercy Kids two columns | Main screen should have only two main columns: Choose picture and Speak. | Current Kids screen is a single max-width tutor card with conditional mode sections and one textarea, not two main picture/speak columns. | Fail | `src/components/kids/ViKidsEnglishTutor.tsx:72`, `src/components/kids/ViKidsEnglishTutor.tsx:161` |
| Mercy Kids no advanced modes | Kids must not show Journey / Grammar / Speak / Logic tabs. | Kids copy defines Journey, Grammar, Speak, and Logic tabs and passes them to `TeacherMercyLearningShell`. | Fail | `src/lib/kids/viKidsTutorCopy.ts:5`, `src/components/kids/ViKidsEnglishTutor.tsx:64` |
| Mercy Kids no AI Tutor correction panels | Advanced correction panels must not be the main kid flow. | Kids imports AI Tutor memory card and shows grammar correction, explanation, logic task, speak controls, and a correction textarea. | Fail | `src/components/kids/ViKidsEnglishTutor.tsx:2`, `src/components/kids/ViKidsEnglishTutor.tsx:93`, `src/components/kids/ViKidsEnglishTutor.tsx:103`, `src/components/kids/ViKidsEnglishTutor.tsx:119`, `src/components/kids/ViKidsEnglishTutor.tsx:153`, `src/components/kids/ViKidsEnglishTutor.tsx:161` |
| Mercy Kids no AI Tutor CTA | No AI Tutor CTA inside Mercy Kids card. | No explicit AI Tutor CTA was found in the inspected Kids files. | Pass | `rg "ai-tutor\|AI Tutor" src/components/kids src/pages/kids src/lib/kids` |
| AI Tutor routes | `/ai-tutor`, `/ai-tutor?target=fr`, and `/ai-tutor?target=zh` work. | Route exists; `AiTutorPage` resolves `target` from query string; existing tests cover French and Chinese target behavior. | Pass | `src/router/AppRouter.tsx`, `src/pages/AiTutor.tsx:138`, `src/pages/__tests__/AiTutor.test.tsx` |
| AI Tutor mode split | Journey = conversation, Grammar = correction, Speak = speaking, Logic = English logic/Vietlish reasoning. | The four mode tabs exist; Grammar uses `CorrectionMode`; Journey/Speak/Logic all use `ConversationMode`. Logic does not have a dedicated logic response path. | Needs review | `src/pages/AiTutor.tsx:195`, `src/pages/AiTutor.tsx:422`, `src/pages/AiTutor.tsx:457` |
| Logic no speaker/TTS labels | Logic must not show speaker/TTS controls, `Mercy đọc`, "Mercy voice", or device fallback labels. | `ConversationMode` sets `allowTts = mode !== "logic"` and guards speaker controls plus voice labels. This part is aligned on current main. | Pass | `src/components/ai-tutor/ConversationMode.tsx:60`, `src/components/ai-tutor/ConversationMode.tsx:160`, `src/components/ai-tutor/ConversationMode.tsx:184` |
| Logic no mic/audio UI | Logic must not show mic controls. | `ConversationMode` renders `TeacherMercyVoiceControls kind="mic"` unconditionally in the footer for Journey/Speak/Logic. | Fail | `src/components/ai-tutor/ConversationMode.tsx:223` |
| Logic no starter conversation | Logic should not show the morning starter question. | `AiTutorPage` initializes shared `conversationMessages` with `createOpeningMessage(...)`; Logic reuses that message set. | Fail | `src/pages/AiTutor.tsx:162`, `src/pages/AiTutor.tsx:457` |
| Logic English reasoning | Logic should explain English structure and Vietlish contrast without speaking practice. | Logic has separate title/description/input copy, but response handling still uses conversation/correction flow and target-language next-question templates. No dedicated English-logic/Vietlish response builder was found. | Fail | `src/components/ai-tutor/ConversationMode.tsx:78`, `src/pages/AiTutor.tsx:115`, `src/pages/AiTutor.tsx:351`, `src/pages/AiTutor.tsx:457` |
| Voice clean text | Speaker reads only clean learner-facing text, not raw input, labels, headings, metadata, or hidden copy. | Correction turns read corrected text only; conversation turns build `shouldReadAloudText` from corrected text, natural reply, and next question; `getSpeakableText` validates/sanitizes before speaking. | Pass | `src/lib/tutor/tutorEngine.ts`, `src/lib/tutor/speakableText.ts`, `src/pages/AiTutor.tsx:383` |
| Voice source labeling | Do not claim "Mercy voice" unless cloud audio succeeds; label device fallback only when used. | Voice state maps cloud success to `"mercy"` and fallback success to `"device"`; UI labels render only when `ttsVoiceSource` exists. | Pass | `src/lib/teacher-mercy/voiceEngine.ts`, `src/lib/ai-tutor/useTtsSpeaker.ts`, `src/components/ai-tutor/CorrectionMode.tsx`, `src/components/ai-tutor/ConversationMode.tsx` |
| Memory local summary only | M3 memory stores only safe local aggregate summary fields; no raw audio, full transcripts, raw learner text, Supabase memory sync, or Placement writeback. | AI Tutor memory uses IndexedDB summary rows and `TutorMemoryCard` displays aggregate counts/topics only. No Supabase memory sync was found in AI Tutor memory code. | Pass | `src/lib/ai-tutor/learningMemory.ts`, `src/components/ai-tutor/TutorMemoryCard.tsx` |

## Previous Mismatches Resolved

- **Missing source-of-truth doc resolved:** `docs/app/APP_LOGIC_FLOW.md` now exists on main via #1080.
- **Logic speaker/TTS labels resolved on current main:** Logic mode hides speaker/TTS controls and voice-source labels through `allowTts = mode !== "logic"`.

## Remaining Mismatches

1. **Mercy Kids still does not match the simple picture-and-speak product flow.**
   The page still uses `TeacherMercyLearningShell`, AI Tutor memory components, Journey/Grammar/Speak/Logic tabs, conditional advanced panels, and a correction textarea.

2. **Mercy Kids still does not have the required two-column Choose picture / Speak layout.**
   The inspected implementation has one tutor card surface and no picture-choice reward/next-picture loop.

3. **AI Tutor Logic mode still renders mic UI.**
   TTS is guarded, but the mic voice control is still rendered for Logic through shared `ConversationMode`.

4. **AI Tutor Logic mode still reuses conversation starter content.**
   The opening morning question is created for shared conversation messages and displayed when Logic uses `ConversationMode`.

5. **AI Tutor Logic mode still lacks a dedicated English-logic/Vietlish reasoning response path.**
   Logic mode is copy-distinguished but behaviorally still rides the conversation/correction machinery.

## Recommended Fixes

### P0 Blocking

- Land or rework #1079 so `/kids/vi-english` becomes a Kids-specific two-column picture + speak flow.
- Remove Journey / Grammar / Speak / Logic tabs and advanced correction textarea from the primary Mercy Kids screen.
- Land or rework #1077 so Logic mode hides mic/audio UI and does not show starter conversation content.

### P1 Important

- Split Logic into a dedicated component/flow that explains English structure and Vietlish contrast instead of using shared conversation messages.
- Add regression tests for `/kids/vi-english` confirming no advanced AI Tutor tabs, no correction textarea, and visible picture/speak columns.
- Add regression tests for Logic confirming no speaker/TTS, no mic, no voice labels, and no morning starter question.

### P2 Polish

- Add router-level smoke tests for `/kids/vi-english`, `/ai-tutor`, `/ai-tutor?target=fr`, and `/ai-tutor?target=zh`.
- Keep this audit updated after #1079 and #1077 are merged or closed.

## Safety Notes

- Product code was not changed.
- No Placement files were modified.
- No provider, environment, secrets, access, memory sync, Supabase, raw audio, or transcript storage changes were made.
