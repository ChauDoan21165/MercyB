# Flow Compliance Audit

Date: 2026-05-24

Source of truth: [APP_LOGIC_FLOW.md](./APP_LOGIC_FLOW.md)

Scope:

- `src/router/AppRouter.tsx`
- `src/pages/Home.tsx`
- `src/pages/MarketingLandingPage.tsx`
- `src/pages/AiTutor.tsx`
- `src/components/ai-tutor/*`
- `src/components/kids/*`
- `src/components/languages/AITutorCtaBanner.tsx`
- `src/components/MercyGuide.tsx`
- `src/components/mercy-guide/*`
- `src/lib/tutor/*`
- `src/lib/ai-tutor/*`

Commands used:

```bash
rg -n "AI Tutor|Mercy Kids|Mở AI Tutor|Vào Mercy Kids|Journey|Grammar|Speak|Logic|Mercy đọc|Device voice fallback|Mercy voice|mic|microphone|memory|textarea|/ai-tutor|/kids/vi-english" src docs/app -S
rg -n "path=|/ai-tutor|kids/vi-english|TeacherMercy|MercyGuide|mercy-guide|language" src/router src/pages src/components -S
rg -n "speak\\(|speechSynthesis|Audio\\(|fetchCloudTtsUrl|mercy-tts|localStorage|indexedDB|supabase|placement" src/components src/lib src/pages -S
```

## Route Inventory

| Route | Target user | First action | Buttons/tabs/toggles/voice/memory | CTA routing | Status |
| --- | --- | --- | --- | --- | --- |
| `/` | Returning learners / public users after onboarding gate | Open Teacher Mercy, AI Tutor, placement, language tracks, or exam packs | Home includes Teacher Mercy card, AI Tutor CTA, Mercy Guide floating entry, language/exam CTAs, progress widgets for signed-in flows | AI Tutor card routes to `/ai-tutor`; marketing try-pronunciation routes to `/?trypron=1`; language discovery routes to `/languages` | PASS |
| `/ai-tutor` | Older learners/adults | Choose mode and enter practice text or speech | AI Tutor shell renders mode tabs, Grammar correction, Journey/Speak/Logic conversation panels, local memory slots, mic/TTS where allowed | Internal mode buttons only; target defaults through product config | PASS |
| `/ai-tutor?target=fr` | Older learners/adults learning French | Practice in AI Tutor with French target | Same AI Tutor shell with target language resolved from query | Language CTA pattern routes here from French lessons | PASS |
| `/ai-tutor?target=zh` | Older learners/adults learning Chinese | Practice in AI Tutor with Chinese target | Same AI Tutor shell with target language resolved from query | Language CTA pattern routes here from Chinese lessons | PASS |
| `/kids/vi-english` | Very young Vietnamese-first kids | Pick a picture, then tap mic to speak | Two columns: choose picture and speak; mic button; optional Mercy-read response; no mode tabs or memory card | No AI Tutor CTA observed in main kid card | PASS |
| `/languages/*` with AI Tutor banner | Language learners | Continue lesson or open AI Tutor CTA | Lesson page CTA banner points to target-aware AI Tutor | `/ai-tutor?target=<resolved-language>` | PASS |
| `/mercy` | Auth-required Teacher Mercy thread users | Open Mercy thread | Separate Teacher Mercy product surface | No direct Kids/AI Tutor route in route declaration | NEEDS REVIEW |
| `/mercy/chat` | Teacher Mercy chat users | Type or speak in unified chat | Unified Mercy chat has mic/send and inline help | Separate Teacher Mercy chat route | NEEDS REVIEW |

## Findings

| Route | Component/file | Observed UI/action | Expected behavior from logic map | Status | Severity | Recommended fix |
| --- | --- | --- | --- | --- | --- | --- |
| `/kids/vi-english` | `src/components/kids/ViKidsEnglishTutor.tsx` | Main UI is two columns: `1. Chọn hình` and `2. Bấm để nói`; no tabs are rendered. | Mercy Kids must be picture + speak only with two main columns. | PASS | P0 | Keep this boundary covered with a regression test. |
| `/kids/vi-english` | `src/components/kids/ViKidsEnglishTutor.tsx` | Kid flow has mic control and an optional `Mercy đọc` button after Mercy responds. | Kids may speak and hear Mercy; no raw audio storage or adult tabs. | PASS | P1 | Confirm future voice labels stay kid-facing and do not introduce fallback metadata. |
| `/kids/vi-english` | `src/lib/tutor/productConfigs.ts` | `viKidsEnglish` product config still lists `conversation`, `grammar`, `speak`, and `logic`; the current Kids UI does not render these modes. | Mercy Kids config should not advertise adult modes if future UI consumes it. | FAIL | P1 | In a code PR, align `viKidsEnglish.modes` with the picture+speak contract or keep Kids from consuming mode tabs permanently. |
| `/ai-tutor` | `src/pages/AiTutor.tsx` | AI Tutor mode tabs derive from product config and render Journey, Grammar, Speak, Logic. | Adult AI Tutor should expose separated guided modes. | PASS | P1 | Keep config-driven tabs; add guard tests for enabled/disabled modes. |
| `/ai-tutor` | `src/components/ai-tutor/ConversationMode.tsx` | Logic mode sets `allowTts = false`, hides `TeacherMercyVoiceControls`, and hides TTS/fallback labels. | Logic mode must be text-only: no TTS, mic, speaker, or fallback labels. | PASS | P0 | Keep a dedicated Logic no-audio regression test. |
| `/ai-tutor` | `src/pages/AiTutor.tsx` | Logic mode opening message is English/Vietlish reasoning and does not start a speaking practice prompt. | Logic should explain English logic / Vietlish reasoning only. | PASS | P1 | Keep starter prompts reasoning-focused. |
| `/ai-tutor` | `src/components/ai-tutor/CorrectionMode.tsx` | Grammar mode includes textarea, mic control, correction result, TTS for clean corrected output, and practice follow-up. | Grammar is correction and sentence repair; voice may read clean learner-facing output only. | PASS | P1 | Confirm TTS source remains `getSpeakableText(result)`, not raw input. |
| `/ai-tutor` | `src/pages/AiTutor.tsx` | Conversation sends raw learner message to the UI transcript but TTS handler speaks `getSpeakableText(message)` for Mercy messages only. | Speaker must not read raw learner input. | PASS | P0 | Keep speaker button scoped to Mercy messages. |
| `/ai-tutor` | `src/lib/ai-tutor/learningMemory.ts` | IndexedDB stores aggregate summary fields, topic tags, counts, generated IDs, product, target language, and timestamps. Comments explicitly reject raw audio, raw text, transcripts, PII, JWTs, and user IDs. | Memory must be local summary-only with safe aggregate fields. | PASS | P0 | Keep persistence limited to safe tags and aggregate counters. |
| `/ai-tutor` | `src/lib/ai-tutor/learningMemory.ts` | Memory storage uses local IndexedDB `mb-ai-tutor`; no Supabase memory sync was observed in this path. | No Supabase memory sync unless separately approved. | PASS | P0 | Continue keeping sync out of M3 memory. |
| `/languages/*` | `src/components/languages/AITutorCtaBanner.tsx` | Visible CTA says Practice with AI Tutor and routes to `/ai-tutor?target=${resolveTutorTargetLanguage(target)}`. | Language CTA text and route should both point to AI Tutor Adult. | PASS | P1 | Keep CTA label explicit that it opens adult AI Tutor. |
| `/` | `src/pages/Home.tsx` | Teacher Mercy hero copy says `Mở AI Tutor để luyện câu với Mercy` and button routes to `/ai-tutor`. | CTA text says AI Tutor and routes to AI Tutor. | PASS | P1 | None. |
| `/` | `src/pages/MarketingLandingPage.tsx` and `src/pages/Home.tsx` | `Nói thử ngay` path routes to `/?trypron=1`, which opens Mercy Guide pronunciation tab. | Teacher Mercy Guide / CTA may route to guide entry points as long as product identity is clear. | NEEDS REVIEW | P2 | In visual QA, confirm the landing CTA does not imply Mercy Kids or AI Tutor Adult. |
| `/mercy/chat` | `src/components/mercy-guide/UnifiedMercyChat.tsx` | Unified Mercy chat includes mic and send controls. | Teacher Mercy Guide is a separate product surface; it must not be confused with Logic mode. | NEEDS REVIEW | P1 | Inspector should verify labels distinguish general Teacher Mercy chat from AI Tutor Logic. |
| `/mercy` and Home floating guide | `src/components/MercyGuide.tsx`, `src/components/mercy-guide/*` | Mercy Guide has Teacher/Grammar/Pronunciation/Logic style surfaces and kid image assets in legacy guide code. | Mercy Guide / CTA is allowed as separate product identity, but must not mix child flow into AI Tutor or Kids route. | NEEDS REVIEW | P1 | Future audit should screenshot Mercy Guide tabs and verify product labels, especially any Kids entry in the floating panel. |
| all learning routes | `src/router/AppRouter.tsx` | Placement routes are separate from `/ai-tutor` and `/kids/vi-english`; no AI Tutor writeback to Placement was observed in inspected paths. | No Placement writeback or accidental coupling. | PASS | P0 | Leave Placement V3/V4 files out of flow cleanup PRs unless explicitly assigned. |
| all learning routes | `src/lib/ai-tutor/useTtsSpeaker.ts`, `src/lib/teacher-mercy/voiceEngine` references | TTS wrapper delegates to Teacher Mercy voice engine and exposes voice source labels as Mercy/device. | No client-side provider secrets; fallback labels only when source is device. | NEEDS REVIEW | P0 | Separate security audit should inspect voice engine and `/api/mercy-tts` end to end for secret boundaries and fallback labeling. |

## Button And CTA Summary

| Visible label | Route/action | Expected route/action | Status |
| --- | --- | --- | --- |
| `Mở AI Tutor` / `Vào AI Tutor mới để luyện câu với Mercy` | `nav("/ai-tutor")` from Home | Open Adult AI Tutor | PASS |
| `Practice with AI Tutor` / `Luyện với AI Tutor` | Link to `/ai-tutor?target=<language>` | Open Adult AI Tutor with selected target | PASS |
| `Mercy đọc` in Kids | Speaks Mercy's short kid-facing response | Allowed for Kids speak feedback, not Logic mode | PASS |
| AI Tutor `Journey`, `Grammar`, `Speak`, `Logic` | Switches AI Tutor modes | Adult AI Tutor modes only | PASS |
| Logic send button | Sends text-only reasoning request | No mic/TTS controls | PASS |

## Remaining Risks

- `viKidsEnglish` product config advertises advanced modes even though the current `/kids/vi-english` UI does not render them. This can cause future UI duplication or accidental adult-mode tabs in Kids.
- Mercy Guide and Unified Mercy Chat are broader legacy surfaces with their own mic/chat affordances. They need screenshot-level inspection to ensure users can distinguish them from AI Tutor Logic and Mercy Kids.
- Voice engine and `/api/mercy-tts` should receive a separate focused security/path audit for provider-secret and fallback-label guarantees.
- Product copy is split across Tutor copy, Kids component copy, Mercy Guide copy, and language CTA copy. Future product-config work should reduce drift.

## Safety Verification

- Provider/env/secrets/access changes: not changed in this audit PR.
- Client-side secrets: no new secrets added.
- Raw audio storage: no new storage added; no raw audio storage observed in AI Tutor/Kids inspected paths.
- Transcript storage: no new transcript storage added; AI Tutor memory stores aggregate summary only.
- Supabase memory sync: none added; no sync observed in AI Tutor memory path.
- Placement writeback: none added; Placement files are unrelated and should be left out.
