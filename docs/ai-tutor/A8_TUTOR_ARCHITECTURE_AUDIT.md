# A8 Tutor Architecture Audit

## Scope

Audited the Teacher Mercy tutor architecture across the shared Teacher Mercy shell, AI Tutor components, Viet Kids English components, tutor libraries, AI Tutor runtime, Kids copy, route wiring, language CTAs, cloud TTS, and local memory.

## Low-Risk Fixes Applied

- AI Tutor tabs now derive from `aiTutor.modes` instead of a hardcoded page-local tab list.
- Viet Kids English tabs now derive from `viKidsEnglish.modes`; disabled `logic` and correction modes do not render.
- AI Tutor correction TTS no longer passes raw learner input into the speaker path. The voice call receives only corrected/speakable tutor text.
- Product config coverage was tightened for AI Tutor, Viet Kids English, IELTS Speaking, and TOEIC Practice placeholders, including safe storage flags and fail-safe unknown-product behavior.

## Audit Findings

### Language Maps

`src/lib/tutor/languageRegistry.ts` is the canonical target-language registry for codes, labels, STT locale, TTS locale, placeholders, examples, browser TTS support, and cloud TTS support.

Copy remains split across `src/lib/ai-tutor/tutorUiCopy.ts`, `src/lib/tutor/tutorCopy.ts`, and `src/lib/kids/viKidsTutorCopy.ts`. That is acceptable for current products, but new IELTS/TOEIC surfaces should not introduce another language registry.

### Voice Maps

`src/config/mercyVoices.ts` owns client-side voice IDs and configuration checks. `supabase/functions/mercy-tts/index.ts` duplicates edge-function voice settings because the Deno function cannot import app modules. That duplication is documented.

Remaining risk: cloud TTS currently maps non-Vietnamese tutor targets into the English cloud voice contract. Browser fallback still uses the target locale, but true multilingual cloud voice routing needs a separate provider-design PR.

### Raw Audio and Transcript Storage

AI Tutor and Kids use browser STT only. No raw microphone audio upload or raw audio storage was found in these tutor paths.

No full transcript storage was found. AI Tutor memory stores aggregate topic tags and counters in IndexedDB through `src/lib/ai-tutor/learningMemory.ts`; it does not store raw learner text, full transcripts, corrected full sentences, PII, JWTs, user IDs, or Supabase rows.

### Speaker Safety

Conversation speaker buttons only render for Mercy messages and use `getSpeakableText`, so learner chat messages are not read by the assistant speaker.

Correction speaker now receives corrected/speakable tutor text only. The raw learner input is no longer passed into the voice call from `AiTutor.tsx`.

### Client-Side Secrets and Providers

The client invokes `mercy-tts` through Supabase Edge Functions. Provider secrets remain in edge-function environment variables. No provider key was found in client-side tutor code.

This PR does not change providers, env vars, feature flags, access rules, or Supabase schemas.

### Placement V3 Coupling

Placement V3 files are unrelated to this tutor architecture cleanup and should be left out. `AppRouter.tsx` contains separate Placement V3 routes/gates, and AI Tutor types mention placement only as optional CEFR context. No AI Tutor or Kids Tutor writeback into Placement V3 was found.

## Remaining Risks

- Multilingual cloud TTS routing is not truly target-language-aware yet.
- Product copy is still split across several copy modules.
- Legacy Teacher Mercy host modules use localStorage/sessionStorage for non-AI-Tutor room memory; that should remain separate from AI Tutor/Kids product memory unless a migration is explicitly designed.
- `mercy-tts` stores generated TTS cache files by hash in Supabase Storage. This is generated audio cache, not raw microphone audio, but retention should remain part of future privacy review.

## Recommendation

Keep this PR limited to tutor shell/config cleanup and audit documentation. Leave Placement V3, provider settings, Supabase schema changes, and broad voice-provider work out of scope.
