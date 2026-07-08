# Safe Learning Events Plan

Status: docs-first plan. This document defines the safe event contract for a future implementation. It does not approve analytics storage, Supabase sync, Placement writeback, or any product code instrumentation by itself.

Source of truth:

- `docs/app/APP_LOGIC_FLOW.md`
- `docs/app/CONTINUOUS_LOGIC_FLOW_MAP.md`
- `docs/app/REPO_LOGIC_INSPECTION_PROTOCOL.md`
- `docs/app/STUDY_FLOW_PSYCHOLOGY_PLAYBOOK.md`
- `docs/app/TEACHER_MERCY_LEARNING_OS.md`

## Purpose

Study OS needs lightweight learning events so Mercy can measure whether the guided study loop is helping learners practice, retry, view logic insights, and continue to the next focus.

Events must describe safe learning behavior only. They must never contain raw learner text, raw audio, transcripts, provider payloads, client-side secrets, Supabase memory sync, or Placement writeback.

## Event Names

The first safe event set is:

- `lesson_started`
- `lesson_completed`
- `mistake_retried`
- `logic_insight_viewed`
- `next_focus_clicked`

No other event names are approved by this plan.

## Non-Goals

> **SUPERSEDED (2026-07-08, WP-PHASE2-01 v2):** The two Non-Goals below —
> "No network transport approval" and "No Supabase event table approval" — are
> **no longer in force.** Per Chau's standing strategy ruling, the durable
> learning-event sink is approved strategic infrastructure. The `learning_events`
> table + RLS are defined in `supabase/migrations/20260708000000_learning_events.sql`
> and the client transport in `src/lib/learning/eventSink.ts` (flag
> `VITE_LEARNING_EVENT_SINK_ENABLED`, default off). All *other* Non-Goals below —
> especially the raw-text / raw-audio / transcript prohibitions — remain fully
> in force: the sink transmits only the allowlisted, sanitized payload.

- No implementation in this PR.
- No analytics provider selection.
- ~~No network transport approval.~~ **Superseded by WP-PHASE2-01 v2** (see note above).
- ~~No Supabase event table approval.~~ **Superseded by WP-PHASE2-01 v2** (see note above).
- No Supabase memory sync.
- No Placement read or write behavior.
- No raw learner text collection.
- No raw audio collection.
- No transcript collection.
- No Mercy Kids analytics instrumentation unless separately approved.

## Shared Safe Payload Contract

Future implementation should use an allowlisted payload shape. Unknown keys should be dropped before an event is queued or sent.

Allowed shared fields:

| Field | Type | Notes |
| --- | --- | --- |
| `eventName` | safe event name | One of the approved event names in this document. |
| `eventVersion` | string | Start with `1`. Increment only when the payload contract changes. |
| `occurredAt` | ISO timestamp | Generated at emit time. Do not include a detailed interaction trace. |
| `product` | string | For this plan, use `ai_tutor` only. |
| `targetLanguage` | language code | Example: `en`, `fr`, `zh`, `de`, `ja`, `ko`, `es`, `vi`. |
| `mode` | mode id | `journey`, `grammar`, `speak`, or `logic`. |
| `lessonId` | safe id | Generated or deterministic safe lesson id. Must not contain user text. |
| `currentStep` | string | Safe step id such as `prompt`, `feedback`, `retry`, or `summary`. |
| `retryCount` | number | Aggregate count only. |
| `completedPromptsCount` | number | Aggregate count only. |
| `safeTopicTag` | string | Controlled topic tag, not a sentence. |
| `suggestedNextFocus` | string | Safe focus label or topic id. |
| `recommendedMode` | mode id | Safe mode recommendation. |
| `logicPatternId` | string | Controlled pattern id such as `very-like` or `missing-to-school`. |
| `confidenceLevel` | string | Coarse level such as `low`, `medium`, or `high`. |
| `masteryScoreBucket` | string | Coarse bucket only, not a precise behavioral trace. |
| `source` | string | Safe UI source such as `today_lesson`, `mode_tab`, or `memory_card`. |
| `resumed` | boolean | Whether a lesson was resumed from local safe session state. |
| `sessionStateVersion` | string | Version of the local safe session state contract. |

Forbidden fields:

- `learnerText`
- `rawInput`
- `originalSentence`
- `correctedText`
- `naturalReply`
- `transcript`
- `conversation`
- `message`
- `audioBlob`
- `audioUrl`
- `audioDurationMs` from raw capture
- `voiceProviderPayload`
- `providerResponse`
- `email`
- `name`
- `userId`
- JWTs, tokens, cookies, API keys, or auth payloads
- Supabase row ids unless separately approved for analytics
- Placement session ids, result ids, scores, or writeback state

## Event Contracts

### `lesson_started`

Trigger:

- Learner starts Today's Lesson.
- Learner resumes a saved local Today's Lesson session.

Allowed event-specific fields:

- `lessonId`
- `targetLanguage`
- `recommendedMode`
- `mode`
- `safeTopicTag`
- `suggestedNextFocus`
- `currentStep`
- `resumed`
- `sessionStateVersion`
- `source`

Must not include:

- The lesson prompt text if it contains learner-authored content.
- Any previous answer.
- Any transcript or audio state.

### `lesson_completed`

Trigger:

- Learner completes the guided Today's Lesson loop.

Allowed event-specific fields:

- `lessonId`
- `targetLanguage`
- `recommendedMode`
- `mode`
- `completedPromptsCount`
- `retryCount`
- `safeTopicTag`
- `suggestedNextFocus`
- `confidenceLevel`
- `masteryScoreBucket`
- `source`

Must not include:

- The final learner answer.
- The correction text.
- A full sequence of step timestamps.
- Any transcript or audio state.

### `mistake_retried`

Trigger:

- Learner retries a mistake or submits a retry attempt in Today's Lesson, Grammar, or Logic-supported practice.

Allowed event-specific fields:

- `lessonId`
- `targetLanguage`
- `mode`
- `currentStep`
- `retryCount`
- `safeTopicTag`
- `logicPatternId`
- `source`

Must not include:

- The original mistake.
- The retry sentence.
- The corrected sentence.
- Any quoted user input.

### `logic_insight_viewed`

Trigger:

- Learner sees a Vietlish or English logic insight in Logic mode, Grammar feedback, or Today's Lesson feedback.

Allowed event-specific fields:

- `lessonId`
- `targetLanguage`
- `mode`
- `logicPatternId`
- `safeTopicTag`
- `source`
- `insightType`: `known_pattern` or `fallback`

Must not include:

- The learner sentence that triggered the insight.
- The full insight text.
- The full correction text.

### `next_focus_clicked`

Trigger:

- Learner clicks the suggested next focus from Today's Lesson, memory summary, progress summary, or lesson completion state.

Allowed event-specific fields:

- `lessonId`
- `targetLanguage`
- `recommendedMode`
- `suggestedNextFocus`
- `safeTopicTag`
- `source`

Must not include:

- Prior learner answer text.
- Raw memory details.
- Any transcript or audio state.

## Safe Data Sources

Future implementation may derive events from existing safe structures:

- `src/lib/tutor/todayLessonPlanner.ts` for recommended mode, safe focus, topic tags, and lesson ids.
- `src/lib/tutor/vietlishLogicEngine.ts` for controlled pattern ids or fallback insight type.
- `src/lib/tutor/masteryGraph.ts` for coarse mastery signals and recommended mode.
- `src/lib/ai-tutor/studySessionState.ts` for local safe session progress.
- `src/lib/ai-tutor/learningMemory.ts` for local summary-only memory fields.

Events must not derive payloads from raw form values, transcript arrays, speech recognition text, TTS provider responses, or raw correction messages.

## Storage And Transport Phases

### Phase 0: Contract Only

This document is Phase 0. It approves only the event names, field allowlist, and safety rules.

### Phase 1: Local Safe Queue

A later PR may add a local-only event queue if explicitly assigned.

Rules:

- Store only allowlisted event payloads.
- Prefer memory or session storage for short-lived debugging.
- If localStorage is used, keep retention short and document cleanup.
- Do not store raw learner text, audio, transcripts, provider payloads, or Placement ids.
- Do not send events over the network.

### Phase 2: Approved Analytics Sink

A later PR may add an analytics sink only after separate approval.

Required approvals before Phase 2:

- Destination and provider.
- Retention period.
- Whether any pseudonymous session id is allowed.
- Whether Supabase is allowed for analytics events.
- Privacy review of the final serialized event payload.

Supabase memory sync remains forbidden unless separately approved. Placement writeback remains forbidden.

## Implementation Guardrails

Future code should use:

- A TypeScript union for approved event names.
- Event-specific TypeScript payload types.
- A runtime sanitizer that copies only allowlisted keys.
- A denylist test for forbidden field names.
- A maximum serialized payload size.
- Controlled enums for `mode`, `product`, `source`, `logicPatternId`, and `safeTopicTag`.
- A test fixture proving raw learner text is not serialized.

Suggested future files:

- `src/lib/tutor/safeLearningEvents.ts`
- `src/lib/tutor/tests/safeLearningEvents.test.ts`

Do not wire UI instrumentation in the same PR as the base event library unless the task explicitly allows it.

## Validation Checklist For Future PRs

Every implementation PR must confirm:

- No raw learner text is serialized.
- No raw audio is serialized.
- No full transcript is serialized.
- No provider secrets or provider payloads are serialized.
- No Supabase memory sync is added.
- No Placement writeback is added.
- Logic mode still has no TTS, mic, speaker button, or fallback voice labels.
- Mercy Kids is not changed unless the task explicitly assigns it.
- Tests cover each approved event name.
- Tests cover sanitizer behavior for forbidden keys.

## Open Decisions

These questions remain intentionally unapproved:

- Which analytics destination, if any, should receive events?
- Should events stay local-only for product QA?
- Is a pseudonymous session id allowed?
- What retention window is acceptable?
- Should Mercy Kids ever emit safe aggregate events?
- Should Supabase be considered for analytics events separately from memory sync?

Until those decisions are approved, events remain a docs-only contract and must not be synced.
