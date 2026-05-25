# MercyB App Logic Flow

This document explains the intended product flow for MercyB. It is a guardrail for judging whether the app is logical, smart, simple, and well organized.

The main rule is simple: Mercy Kids and AI Tutor are separate products for different learners. Do not mix the kid flow with the advanced tutor flow.

## Product Split

MercyB has two primary learning flows:

- Mercy Kids is for very young kids.
- AI Tutor is for older learners and adults.

These flows must stay separate because the learner needs are different.

Mercy Kids should feel like a simple picture-and-speak activity. AI Tutor should feel like an advanced Teacher Mercy learning workspace with target languages, modes, corrections, voice practice, logic explanations, and summary memory.

```text
Home
├── Mercy Kids
│   └── Simple picture speaking flow for very young kids
│
└── AI Tutor
    └── Advanced Teacher Mercy flow for older learners/adults
```

## Mercy Kids Flow

Mercy Kids must be simple enough for a 2-year-old.

Route:

```text
/kids/vi-english
```

Expected flow:

```text
Home
└── Mercy Kids
    ├── Choose picture
    ├── Tap speak
    ├── Kid speaks
    ├── Mercy responds
    └── Reward / next picture
```

The main screen should have only two main columns:

```text
Mercy Kids
├── Choose picture
└── Speak
```

Mercy Kids rules:

- Use pictures as the main entry point.
- Keep the action obvious: choose a picture, tap speak, speak, hear Mercy, get reward, continue.
- Do not show Journey / Grammar / Speak / Logic tabs.
- Do not make advanced correction panels the main kid flow.
- Do not place an AI Tutor CTA inside the Mercy Kids card.
- Do not ask a very young child to manage target-language settings or advanced learning modes.

Mercy Kids can still use supportive feedback, rewards, and simple repetition, but it must not become the AI Tutor interface.

## AI Tutor Flow

AI Tutor is the advanced Teacher Mercy flow.

Routes:

```text
/ai-tutor
/ai-tutor?target=fr
/ai-tutor?target=zh
```

Other supported target languages use the same target-language routing pattern:

```text
/ai-tutor?target=<language-code>
```

Expected flow:

```text
Home
└── AI Tutor
    ├── Choose target language
    ├── Choose mode
    ├── Practice or ask
    ├── Mercy responds
    └── Memory summary updates locally
```

Mode logic:

- Journey = conversation practice.
- Grammar = correction and sentence repair.
- Speak = speaking practice.
- Logic = deep English logic explanation to avoid Vietlish.

Logic mode is not speaking practice. It should explain why natural English works, why the Vietlish structure is wrong or unnatural, what pattern the learner should remember, and examples that compare Vietnamese thinking with English thinking.

Logic mode must not show speaker, TTS, mic, or fallback voice labels.

```text
AI Tutor
├── Journey
│   └── Conversation practice
├── Grammar
│   └── Correction and sentence repair
├── Speak
│   └── Speaking practice
├── Logic
│   └── English logic / Vietlish reasoning, no audio UI
└── Memory summary
    └── Local safe aggregate summary only
```

## Full App Diagram

```text
Home
├── Mercy Kids
│   ├── Choose picture
│   ├── Tap speak
│   ├── Kid speaks
│   ├── Mercy responds
│   └── Reward / next picture
│
└── AI Tutor
    ├── Choose target language
    ├── Journey
    ├── Grammar
    ├── Speak
    ├── Logic
    └── Memory summary
```

## Voice Rules

Voice features must stay learner-facing and safe.

Speaker behavior:

- Speaker reads only clean learner-facing text.
- Speaker must not read raw learner input.
- Speaker must not read labels, headings, metadata, hidden UI copy, or internal formatting text.
- Speaker should read the corrected sentence, natural reply, or clear practice prompt when that is the intended learner-facing output.

Logic mode voice behavior:

- Do not show speaker/TTS controls in Logic mode.
- Do not auto-speak in Logic mode.
- Do not show mic controls in Logic mode.
- Do not show fallback voice labels in Logic mode.
- Do not show "Mercy voice" or device fallback labels in Logic mode.

Voice-source labeling:

- Do not claim "Mercy voice" unless cloud audio succeeds.
- Device voice fallback is allowed only as a fallback.
- Device voice fallback must be labeled clearly when it is used.

```text
Clean learner-facing text
└── Speaker may read it

Raw input / labels / metadata / hidden copy
└── Speaker must not read it

Logic mode
└── No speaker, no TTS, no mic, no fallback labels
```

## Memory Rules

M3 memory is local summary-only memory.

There are two separate summary/memory concepts:

- `mercy_user_facts` / episodic memory is semantic person memory: what Mercy remembers about the learner/person.
- Study OS event summaries are local behavioral summaries: what the learner has been doing recently in study flows.

Study OS event summaries are not semantic memory. They must not read from, write to, merge with, or backfill `mercy_user_facts` unless a later explicit reviewed design approves that boundary crossing. They must not become an indirect memory sync layer.

M3 may store safe aggregate summary fields only:

- strongest topic
- topic needing review
- last practiced
- practice count
- suggested next focus

Study OS event summaries may be derived from #1109 safe local learning events. They must stay local-only, time-windowed, behavioral/activity-based, and limited to safe counts, booleans, timestamps, and derived aggregate fields.

M3 must not store:

- raw audio
- full transcripts
- raw learner text in the memory card
- full conversation history
- corrected sentence text
- PII
- child identity
- Placement result, status, or writeback
- provider secrets
- Supabase-synced memory
- external analytics payloads

M3 memory is meant to help the learner continue practicing without storing sensitive raw content.

M4 is planning/docs only unless separately approved. Do not build M4 sync behavior, Supabase memory sync, or broader memory writeback just because M3 summary exists.

```text
Practice event
└── Safe aggregate summary
    ├── strongest topic
    ├── topic needing review
    ├── last practiced
    ├── practice count
    └── suggested next focus

Raw audio / raw text / transcript
└── Do not store
```

## Safe Learning Events

Safe learning events are local-only summary signals. They are allowed to help future Study OS decisions, but they are not approved as external analytics, Supabase sync, or Placement writeback.

Contract event names:

- `lesson_started`
- `lesson_resumed`
- `lesson_completed`
- `lesson_restarted`
- `mode_selected`
- `mistake_retried`
- `logic_insight_viewed`
- `next_focus_viewed`
- `placement_cta_clicked`
- `kids_picture_selected`
- `kids_speak_clicked`

Allowed event fields are limited to summary-style fields such as event type, product, target language, mode, safe topic tag, timestamp, local anonymous session key, and count/value.

Events must not store raw learner text, corrected sentence text, transcripts, raw audio, PII, Supabase user IDs, JWTs, provider keys/secrets, or Placement writeback data.

#1109 added the local engine contract only. It is not wired into AI Tutor, Mercy Kids, or external analytics unless a later PR explicitly does that.

## Placement Entry Points

Placement entry points must use the shared placement availability source in `src/lib/placement/availability.ts`.

- Home Placement CTA uses shared placement availability.
- AI Tutor Placement CTA uses shared placement availability.
- `/placement` route guards use the same availability source.
- No user-facing CTA should point to unavailable `/placement`.
- Placement availability should remain centralized through the shared helper.
- Placement CTAs and route guards must not introduce Placement writeback.

## Safety Boundaries

These boundaries apply across the app:

- No client-side provider secrets.
- No raw audio storage.
- No full transcript storage.
- No Supabase memory sync.
- No Placement writeback.
- No admin dashboard consumption of raw local Study OS summaries.
- No external analytics from Study OS summaries without a separate privacy-reviewed design.
- No kid flow mixed with the advanced AI Tutor flow.
- No advanced AI Tutor tabs inside Mercy Kids.
- No AI Tutor CTA inside the Mercy Kids card.

If a change needs provider access, cloud memory sync, transcript storage, raw audio storage, or Placement writeback, it must be explicitly approved as a separate task.

## Do / Do Not

| Do | Do Not |
| --- | --- |
| Keep Mercy Kids simple, visual, and tap-based. | Put Journey / Grammar / Speak / Logic tabs in Mercy Kids. |
| Use `/kids/vi-english` for the Mercy Kids Vietnamese-to-English kid flow. | Mix AI Tutor target-language routing into the kid card. |
| Keep AI Tutor as the advanced Teacher Mercy workspace. | Put advanced correction panels as the main Mercy Kids flow. |
| Use Journey for conversation practice. | Treat Logic as speaking practice. |
| Use Grammar for correction and sentence repair. | Let speaker read raw learner input, labels, metadata, or hidden copy. |
| Use Speak for speaking practice. | Claim "Mercy voice" when cloud audio did not succeed. |
| Use Logic for English reasoning and Vietlish contrast. | Show speaker/TTS/mic/fallback labels in Logic mode. |
| Store only safe local M3 aggregate memory. | Store raw audio, full transcripts, or raw learner text in memory. |
| Use local-only, allowlisted safe learning events when explicitly wired. | Send learning events to external analytics or store raw/corrected text, transcripts, audio, PII, Supabase IDs/JWTs, provider secrets, or Placement writeback data. |
| Use shared Placement availability for Home, AI Tutor, and `/placement` route guards. | Show user-facing `/placement` CTAs when Placement is unavailable. |
| Treat M4 as planning/docs only unless separately approved. | Add Supabase memory sync or Placement writeback without approval. |

## Review Checklist

Use this checklist when reviewing related product or code changes:

- Mercy Kids still has a simple choose-picture and speak flow.
- Mercy Kids does not show AI Tutor modes or advanced correction panels as the main flow.
- AI Tutor still starts from target language plus mode selection.
- Journey, Grammar, Speak, and Logic each have distinct jobs.
- Logic explains English reasoning and Vietlish contrast without audio UI.
- Speaker reads only clean learner-facing text.
- Device fallback voice is clearly labeled when used.
- Memory remains local summary-only M3 memory.
- Safe learning events, if touched, remain local-only and allowlisted.
- Placement CTAs and route guards use the shared availability helper.
- No raw audio, full transcript, raw learner text, Supabase memory sync, or Placement writeback was added.
