# MercyBlade Product Contract

> Status: CEO directive. This is the product contract for tutor-facing work.
> Any agent brief touching tutor surfaces must cite this file.

## Non-Negotiables

### C1. Voice

Tutor surfaces use Azure Speech.

- Vietnamese text uses a `vi-VN` voice.
- English uses a natural English voice.
- Silent fallback to browser TTS is a failure.
- If cloud voice is unavailable, surface a retry or error. Never quietly switch to a robotic device voice.

### C2. Follows The Learner

Conversation openers and turns build on what the user actually said.

- Preset scenarios are used only when the user explicitly picks one.
- An off-topic jump is a contract breach.
- The Step 9 directive applies: Mercy follows the learner's latest input before advancing the lesson or scenario.

### C3. Vietnamese-First

All learner-facing Vietnamese is fully diacritic'd.

- Vietnamese labels, hints, errors, explanations, and gate copy must preserve proper diacritics.
- Unaccented Vietnamese placeholders are not acceptable learner-facing copy.

### C4. Trust Floor

Mercy never presents a confident claim that is likely wrong.

- Abstention redirects warmly.
- Uncertainty never dead-ends the learner.
- Numeric scores, ML-style judgments, and per-phoneme claims require real gated evidence.

### C5. Gate

Entitlement is checked before processing.

- The gate is product UI, never Mercy's speech.
- Gated attempts do not consume turns.
- Gated attempts do not call paid model or scoring providers.

### C6. No Canned Replies

Pre-written reply strings never ship as Mercy's speech.

- Content libraries, themes, interference notes, and Vietlish corpora are grounding injected into the model prompt.
- User-facing tutor replies are generated live by the model in context of what the user said.
- This includes openers, warmth phrases, encouragement, and transitions.
- Identical opener strings across sessions are a contract breach unless the learner explicitly selected a fixed scripted drill.
- Known violations to purge include the preset scenario opener and pre-gate warmth template.

## Golden-Flow Enforcement

Deploy is not complete until `scripts/golden-flows.sh` is green against production.

The production golden flows are:

- TTS: POST Vietnamese text to `/api/tts`; assert an Azure audio response, not fallback or empty audio.
- Follow: send a conversation turn about topic X; assert Mercy references X and does not jump to a preset scenario.
- Gate: submit a free-account conversation turn; assert premium gating happens before processing.
- No canned replies: opener varies across sessions and references learner context. This A10-owned check should fail if two generated sessions return identical canned strings.

Red golden flows mean the deploy is not done. Fix the product breach before moving to unrelated work.

## Provider Directive

DeepSeek must be available in the provider layer when the provider work is implemented:

- OpenAI-compatible endpoint.
- `DEEPSEEK_API_KEY`.
- Per-surface configurability alongside OpenAI and Gemini.
- Chau sets the key in the Cloudflare dashboard when ready.
