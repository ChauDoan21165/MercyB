# AI Tutor — Session Protocol Contract

> **Document type:** Protocol Contract (locked)
> **Date:** 2026-05-22
> **Phase:** A (contract-only — reconciled)
> **Author:** A2 — Product Tutor Designer
> **Status:** Awaiting A10 (lane/boundary) + A6 (validation audit) + A7 (safety/privacy) + A8 (cost/reliability) + A1 (final park) review
> **Reconciliation sources:** A4 (Conversation Architecture), A5 (Phase 1 Plan), A6 (Validation Audit), A7 (Safety & Privacy), A8 (Cost & Reliability)
> **Note:** `docs/ai-tutor-design.md` is a parked design draft — TUTOR_CONTRACT.md and TUTOR_V4_INTEGRATION.md are the authoritative Phase A contracts.
> **Read after:** `src/lib/ai-tutor/types.ts`, `docs/ai-tutor/TUTOR_V4_INTEGRATION.md`

---

## 1. Purpose

This document defines the AI Tutor session protocol — the exact contract for how tutor sessions are created, how messages flow, how state transitions work, and what guarantees the tutor surface makes to callers.

It is a **contract-only** document. Phase A produces zero runtime behavior, zero AI calls, zero Supabase migrations. All implementation is gated behind `AI_TUTOR_ENABLED=false` in `src/lib/ai-tutor/types.ts`.

---

## 2. Feature Flag

```
AI_TUTOR_ENABLED = false   (src/lib/ai-tutor/types.ts)
```

This is the single master kill-switch. All tutor code paths (present and future) MUST check this flag before executing any behavior.

Pattern (mirrors `src/lib/placement/v5/v5FeatureFlag.ts`):
- Module-level `const boolean`, not an env read, not a runtime toggle
- Tree-shakeable — bundled removes all tutor code when `false`
- No storage, no network, no side effects

When `AI_TUTOR_ENABLED` is `false`:
- No tutor tab appears in MercyGuidePanel
- No tutor edge function calls are possible
- All tutor imports resolve to inert no-ops or are tree-shaken

---

## 3. Session Lifecycle

### 3.1 State Machine

```
                  ┌──────────┐
                  │   idle   │  Session created, no messages
                  └────┬─────┘
                       │ SESSION_START
                  ┌────▼─────┐
                  │ greeting │  Showing greeting card
                  └────┬─────┘
                       │ GREETING_DISMISSED
                  ┌────▼─────┐
          ┌───────│  ready   │◄──────────────────┐
          │       └────┬─────┘                   │
          │            │ LEARNER_MESSAGE_SENT     │
          │       ┌────▼─────┐                   │
          │       │ thinking  │                   │
          │       └────┬─────┘                   │
          │            │ RESPONSE_RECEIVED        │
          │       ┌────▼─────┐                   │
          │       │suggesting│                   │
          │       └────┬─────┘                   │
          │            │ NEXT_STEP_SELECTED       │
          │            └──────────────────────────┘
          │
          │       ┌──────────┐
          ├──────►│  error   │──RETRY_REQUESTED──► thinking
          │       └──────────┘
          │
          │       ┌─────────────────┐
          ├──────►│ budget_exceeded │  (terminal for session)
          │       └─────────────────┘
          │
          │       ┌────────────────┐
          ├──────►│ safety_blocked │  Session may continue or end
          │       └────────────────┘
          │
          │       ┌──────────┐
          └──────►│  ended   │  Session concluded
                  └──────────┘
```

### 3.2 State Definitions

| State | Description | Accepts input? | LLM call? |
|---|---|---|---|
| `idle` | Session object created, no context loaded | No | No |
| `greeting` | Greeting card visible, awaiting dismiss or entry point tap | Yes (entry points) | No |
| `ready` | Awaiting learner text input or entry point selection | Yes | No |
| `thinking` | LLM call in flight | No | Yes |
| `responding` | Streaming LLM response arriving | No (read-only display) | Yes |
| `suggesting` | Response complete, next-step chips visible | Yes (chip taps, new message) | No |
| `error` | LLM call failed or edge function returned error | Yes (retry or new message) | No |
| `budget_exceeded` | Daily AI budget exhausted | No (pricing link only) | No |
| `safety_blocked` | Input or output blocked by safety filter | Yes (new topic) | No |
| `ended` | Session concluded (learner closed or timed out) | No | No |

### 3.3 State Transitions

```
TRANSITION TABLE:

FROM              EVENT                      TO              SIDE EFFECTS
─────              ─────                      ──              ────────────
idle              SESSION_START              greeting        Create session, load TutorContext
greeting          CONTEXT_LOADED             greeting        Context available for greeting render
greeting          GREETING_DISMISSED         ready           Hide greeting card
greeting          ENTRY_POINT_SELECTED       ready           Set entryPoint + conversationMode
ready             LEARNER_MESSAGE_SENT       thinking        Dispatch to edge function
ready             ENTRY_POINT_SELECTED       ready           Update entryPoint (no message sent yet)
ready             MODE_CHANGED               ready           Update mode
ready             CONVERSATION_MODE_CHANGED  ready           Update conversationMode
ready             SAFETY_TRIGGERED           safety_blocked  Show safety message; may continue
thinking          RESPONSE_RECEIVED          suggesting      Append mercy message, decrement turns
thinking          ERROR_OCCURRED             error           Show error with retry option
thinking          BUDGET_EXCEEDED            budget_exceeded Show budget message + pricing link
thinking          SAFETY_TRIGGERED           safety_blocked  Blocked by output safety filter
thinking          FALLBACK_TRIGGERED         suggesting      Show static fallback response
suggesting        NEXT_STEP_SELECTED         ready           Execute action, reset for next input
suggesting        LEARNER_MESSAGE_SENT       thinking        Skip next-step, continue chat
suggesting        MODE_CHANGED               suggesting      Update mode (next response uses new mode)
error             RETRY_REQUESTED            thinking        Re-send last message
error             LEARNER_MESSAGE_SENT       thinking        Abandon failed message, send new one
error             FALLBACK_TRIGGERED         suggesting      Deliver static fallback
error             SESSION_ENDED              ended           Learner gave up
safety_blocked    LEARNER_MESSAGE_SENT       thinking        Learner chose new topic
safety_blocked    SESSION_ENDED              ended           Learner closed
budget_exceeded   SESSION_ENDED              ended           Learner closed
any               SESSION_ENDED              ended           Clean up, persist if needed
```

### 3.4 Invariant: No State Is Skipped

Every state transition flows through the sequence above. The tutor never jumps from `ready` directly to `suggesting`. All LLM-bound paths go through `thinking`. All safety events are explicitly modeled as `safety_blocked` state.

---

## 4. Conversation Modes (A4 §6)

The tutor operates in five distinct conversation modes. Each mode has a trigger condition, behavior contract, and output format.

### 4.1 Mode Definitions

| Mode | Trigger | Behavior | Output format |
|---|---|---|---|
| `general_chat` | Default. Any input not matching modes 2-5. | Open-ended Q&A. Light correction (1 error max). Standard 3-part response (acknowledge → teach → invite). | `TutorResponse` with `vi`, optional `en`, optional `correctedSentence` |
| `sentence_correction` | Learner sends "Sửa giúp mình câu này" or explicit correction request. | Structured correction format. One error per response (most impactful first). After correction, invite retry or question. | `TutorResponse` with `correctedSentence`, `transferErrorNote`, `grammarPoints` |
| `writing_feedback` | Learner sends paragraph (>50 words) or requests writing feedback. | Pattern-focused feedback. Overall impression + 2-3 specific improvements + one pattern observation. Do NOT correct every error. | `TutorResponse` with `grammarPoints`, `detailedExplanation` |
| `pronunciation_coaching` | Learner clicks "Luyện phát âm" or says "Luyện phát âm với từ [word]". | Phoneme breakdown, mouth position description, minimal pair contrast. Phase 1: text-only. Phase 2+: audio. | `TutorResponse` with `practiceSentence` |
| `lesson_guidance` | Learner clicks "Học bài" or navigates to a specific lesson/room. | Stay within lesson scope. Introduce lesson, guide through content, offer recap. Do not introduce unrelated grammar points. | `TutorResponse` with `nextSteps` pointing to `room` and `drill` actions |

### 4.2 Mode Mapping

```typescript
entryPointToMode('ask')           → 'general_chat'
entryPointToMode('fix_grammar')   → 'sentence_correction'
entryPointToMode('speak')         → 'pronunciation_coaching'
entryPointToMode('resume')        → 'lesson_guidance'
entryPointToMode('direct')        → 'general_chat'
```

### 4.3 Mode Switching

The conversation mode can change mid-session via `CONVERSATION_MODE_CHANGED` event. The mode is attached to every `TutorLearnerMessage` and `TutorMercyMessage` for traceability.

---

## 5. Message Protocol

### 5.1 Message Types

Three roles, discriminated by `role`:

```typescript
type TutorMessage =
  | { role: 'learner'; ts: number; content: string; entryPoint: TutorEntryPoint | null; mode: TutorConversationMode }
  | { role: 'mercy';  ts: number; response: TutorResponse; source: 'guide-assistant' | 'ai-chat'; requestId: string | null; mode: TutorConversationMode }
  | { role: 'system'; ts: number; event: TutorSystemEvent };
```

### 5.2 Message Ordering

- Messages are strictly ordered by `ts` (monotonic, client-generated).
- System messages may appear at any position.
- Learner and Mercy messages alternate.
- The greeting is rendered from `TutorSession.context`, not as a message.

### 5.3 Response Shape

See `TutorResponse` in `src/lib/ai-tutor/types.ts`. The shape is mode-aware: different modes populate different optional fields.

### 5.4 Next-Step Actions

| Action | Payload | What happens |
|---|---|---|
| `speak` | Sentence string | Opens `MercySpeakTab` with `initialPracticeLine={payload}` |
| `logic` | Sentence string | Opens `EnglishLogicTab` with sentence pre-loaded |
| `write` | Sentence string | Opens `GrammarWritingTab` with prefill text |
| `room` | Room ID string | Navigates to `/room/{payload}` |
| `drill` | Phoneme string | Launches pronunciation drill for `/θ/`, `/ð/`, etc. |

---

## 6. Session Context

### 6.1 Loading

`TutorContext` is loaded ONCE at session start (during the `SESSION_START → greeting` transition). Loading is best-effort — all fields are nullable. The tutor degrades gracefully when data is missing.

### 6.2 Context Shape

See `TutorContext` in `src/lib/ai-tutor/types.ts`.

---

## 7. Tier Gating

| Tier | Available modes | Turns/day | Memory | Progress coaching |
|---|---|---|---|---|
| `free` | `gentle` only | 30 (A8) | Session-only (not persisted) | No |
| `paid` | `gentle`, `guided`, `immersion` | 200 (A8) | Persisted across sessions | Yes |

Enforcement: client-side limits mode switcher and decrements `turnsRemaining`. Server-side enforcement via `checkAiBudget` RPC (V4, frozen).

---

## 8. Safety & Privacy Contract (A7)

### 8.1 Data Allowlist

Only these fields may be sent to the AI model. The prompt assembly function must enforce an **allowlist**, not a denylist — any field not listed is excluded by default. See `TutorPromptAllowlistField` in `types.ts`.

### 8.2 Data Denylist

These fields MUST NEVER reach the AI model: email, fullName, phoneNumber, profileId (raw UUID), ipAddress, deviceId, sessionToken, serviceRoleKey, apiKey, paymentData, subscriptionTier, adminLevel, otherLearnerData, fullConversationHistory beyond current session, rawAudioRecording.

### 8.3 Input Moderation

Before any learner text reaches the AI model:

| Check | Action |
|---|---|
| Profanity / hate speech (VI + EN) | `SAFETY_TRIGGERED` → polite refusal |
| Self-harm / suicidal content | `SAFETY_TRIGGERED` → crisis resource message (A7 §3.3) |
| PII in free-text (email, phone, address) | Strip before sending; log for admin review |
| URL / link in free-text | Strip; log for admin review |
| Prompt injection patterns | `SAFETY_TRIGGERED` → polite refusal; log incident |
| >2000 chars | Truncate with notice |
| Repeated identical input (spam) | Rate-limit; return cached response after 3 repeats |

### 8.4 Output Moderation

Before any AI response is displayed:

| Check | Action |
|---|---|
| Profanity / hate speech in output | Replace with generic response; flag provider |
| Personal advice (medical, legal, financial) | Append disclaimer |
| Model claims to be human | Strip; replace with role-appropriate framing |
| Hallucinated PII (email, phone) | Strip before display; log incident |
| Response >3000 chars | Truncate with "..." and offer to continue |

### 8.5 Kids Mode

When Kids Mode is active: no external links, no personal questions, no fear-based motivation, simple vocabulary (A1-A2), positive reinforcement only. Kids mode never routes to the AI Tutor — it uses offline pre-recorded content only.

### 8.6 Crisis Resources

If self-harm detection triggers:
```
Mercy is an English learning app and cannot provide crisis support.
If you're struggling, please reach out to someone who can help:
- Ngày mai Foundation: 09 7626 2828 (Vietnam mental health support)
- Samaritans: 116 123 (UK, English)
- Crisis Text Line: text HOME to 741741 (US, English)
```

### 8.7 Refusal Behavior

Six disallowed request types with consistent refusal responses (A7 §3.4):
- Inappropriate/NSFW content → polite refusal
- Impersonation → "I'm Mercy, your English teacher."
- Execute code → "I'm a language teacher."
- Reveal system prompts → redirect to learning
- Politics/religion → redirect to language topic
- Translate harmful content → refusal

All refusals: polite, consistent, bilingual, in the learner's UI language.

### 8.8 Logging Redaction

Every logging path must apply `TUTOR_LOG_REDACTION_RULES` (see `types.ts`):
- Email → `[EMAIL]`
- Phone (VN + intl) → `[PHONE]`
- JWT → `[JWT]`
- API keys → `[API_KEY]`
- IP → `[IP]`

Extends V4's existing `SECRET_KEY_PATTERN` / `SECRET_VALUE_PATTERN` from `providerRegistry.ts`.

---

## 9. Cost & Reliability Contract (A8)

### 9.1 Phase 1 Provider

Single provider: **DeepSeek-V3**. Rationale: lowest cost ($0.14/$0.28 per 1M tokens), best Vietnamese quality. V4 `providerRegistry` abstraction is used but multi-provider failover is deferred to Phase 2.

See `TUTOR_PHASE1_PROVIDER` in `types.ts`.

### 9.2 Token Budgets

Per-request-type budgets defined in `TUTOR_TOKEN_BUDGETS` (see `types.ts`):

| Request type | Max input | Max output | Max total |
|---|---|---|---|
| Grammar correction | 500 | 300 | 800 |
| Speaking practice | 200 | 400 | 600 |
| Translation | 1000 | 1000 | 2000 |
| Tutoring explanation | 800 | 600 | 1400 |
| Pronunciation feedback | 300 | 200 | 500 |
| Lesson generation | 2000 | 1500 | 3500 |
| General chat | 1000 | 800 | 1800 |

### 9.3 Per-Tier Limits

See `TUTOR_TIER_LIMITS` in `types.ts`:

| Tier | Req/min | Req/day | Tokens/day | Max cost/day (USD) |
|---|---|---|---|---|
| Free | 3 | 30 | 15,000 | $0.05 |
| Paid | 10 | 200 | 100,000 | $0.50 |

### 9.4 Timeouts & Retry

See `TUTOR_TIMEOUT_CONFIG` in `types.ts`:
- Provider API call: 15s timeout
- Streaming first byte: 5s timeout
- Total request: 25s timeout
- Max retries: 2 (on 5xx/timeout only)
- Backoff: 1s base, exponential

### 9.5 Phase 1 Exclusions

| Feature | Phase 1 | Phase 2+ |
|---|---|---|
| Multi-provider failover | No (single provider) | Yes |
| Streaming responses | No (non-streaming) | Yes |
| Shared cache | No | Supabase `ai_tutor_cache` table |
| Circuit breaker | No | Yes |
| Per-user cost quotas | Server-side only | Client-side soft caps |
| A/B provider testing | No | Yes |

### 9.6 Cost Monitoring

Per-request logging (A8 §7): `request_id`, `user_id`, `feature`, `provider`, `model`, `input_tokens`, `output_tokens`, `cache_hit`, `duration_ms`, `status`, `error_code`. Phase A/B: logged to `console.log` only. V5 `provider_decisions` integration is future-only — not a Phase A or Phase B dependency. A1 must explicitly approve before any tutor code writes to V5 tables.

Alert thresholds: daily cost >$50 (warn), >$100 (critical). Error rate >5% (critical).

---

## 10. Error Handling

### 10.1 Error Categories

See `TutorErrorKind` in `types.ts`:

| Error kind | State transition | Retryable? |
|---|---|---|
| `provider_5xx` | `thinking → error` | Yes (max 2 retries) |
| `provider_timeout` | `thinking → error` | Yes (max 1 retry) |
| `provider_rate_limited` | `thinking → error` | Yes (after Retry-After) |
| `network_failure` | `thinking → error` | Yes |
| `budget_exceeded` | `thinking → budget_exceeded` | No |
| `trial_expired` | `ready → error` | No |
| `safety_blocked` | `ready → safety_blocked` | No |
| `invalid_input` | No state change | Yes (with valid input) |
| `empty_response` | `thinking → fallback` | No (fallback delivered) |
| `unknown` | `thinking → error` | Yes (1 retry) |

### 10.2 Retry Behavior

- Retry re-sends the last learner message to the same edge function.
- Does NOT create a new conversation or decrement turns.
- After 3 consecutive retries on the same message → `retryable: false` → suggest new topic.
- Fallback tier escalation: after 2 failed provider calls → `FALLBACK_TRIGGERED` with static response.

---

## 11. Session Persistence

### 11.1 Phase A

Tutor sessions are **in-memory only**. No persistence to Supabase.

### 11.2 Future Phase

When persistence is added:
- `TutorSession` → `mercy_conversations` (V4, frozen)
- `TutorMessage` → `mercy_messages` (V4, frozen)
- Memory facts read via `getActiveFactsForUser()` (V4, frozen)
- Progress context via `buildProgressContext()` (V4, frozen)
- Cost logs via V5 `provider_decisions` table (future-only; requires A1 explicit approval; not a Phase A/B dependency)

---

## 12. What the Tutor MUST NOT Do

### 12.1 Must NOT mutate V4 state

All V4 consumption is read-only. The tutor reads profiles, facts, progress, and persona config. It does NOT write to any V4 table, storage bucket, or state.

### 12.2 Must NOT redefine V4 types

V4 types are re-exported via `export type` in `types.ts`. No alternate definitions, no extension via inheritance, no casting without mapping functions.

### 12.3 Must NOT import from V5

V5 (`src/lib/placement/v5/`) is a separate concern. Zero V5 imports.

### 12.4 Must NOT make AI calls (Phase A)

Phase A is type-only. Zero edge function calls, zero provider API calls, zero streaming.

### 12.5 Must NOT create Supabase migrations

No `.sql` files, no schema changes, no new RPCs.

---

## 13. Rollback Plan

### 13.1 Single-flag disable

```
Flip AI_TUTOR_ENABLED = false
↓
All tutor code paths dead (tree-shaken or gated)
↓
Tutor tab removed from MercyGuidePanel
↓
Zero runtime impact. Zero cleanup needed.
```

### 13.2 Full removal

```
Delete src/lib/ai-tutor/
Delete docs/ai-tutor/
Remove flag check in MercyGuidePanel.tsx
↓
No other V4 files modified. No migrations to revert. No edge functions to tear down.
```

---

## 14. Validation Gates (A6)

### 14.1 Safety Gates (MUST PASS — blocking)

- [ ] Output safety classifier passes on 1000 adversarial prompts (0% unsafe)
- [ ] Kids-mode guard: no adult-tier responses in kids context
- [ ] PII redaction: no learner identifiers in provider-bound prompts
- [ ] Provider zero-retention: contract confirmed for configured provider
- [ ] `AI_TUTOR_ENABLED=false` → tutor code path returns no-op
- [ ] Rollback procedure tested

### 14.2 Teaching Quality Gates (MUST PASS — blocking)

- [ ] VI-language: 100% of responses to VI learners are in Vietnamese
- [ ] Correction ratio: ≤1 correction per 3 learner utterances
- [ ] Every correction includes "why" in Vietnamese
- [ ] 0% vocabulary exceeds learner CEFR band +1
- [ ] 0% hallucinated progress claims
- [ ] 100% of referenced lessons exist in LESSON_INDEX

### 14.3 Performance Gates (MUST PASS — blocking)

- [ ] p95 latency <5s for explanations
- [ ] p95 latency <2s for short responses
- [ ] Graceful degradation: static fallback within 1s of total provider failure

### 14.4 Regression Gates (MUST PASS — blocking)

- [ ] All V4 tests pass
- [ ] All V5 tests pass
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Mobile bundle size increase <50KB

### 14.5 Cost Gates (advisory)

- [ ] Cost model documented: projected at 1K/10K/100K DAU
- [ ] Per-session token budget enforced
- [ ] Prompt caching strategy documented

### 14.6 A6 Verdict Criteria

A6 will **BLOCK** merge if:
1. Any safety gate fails
2. Any teaching quality gate fails
3. Any performance gate exceeds threshold
4. Any V4/V5 regression test fails
5. Architecture has no documented owner for output safety
6. Architecture has no documented provider failover path
7. Architecture has no documented rollback procedure
8. PII reaches a provider (audit confirms)
9. Kids-mode guard can be bypassed

---

## 15. Validation Checklist

To be verified by A10, A6, A7, A8, and A1 before Phase A is accepted:

```
☐ types.ts compiles in isolation (full project typecheck)
☐ No runtime imports in types.ts — all `import type` for external modules
☐ AI_TUTOR_ENABLED === false — confirmed by grep
☐ Zero AI provider imports (openai, gemini, claude, deepseek SDK)
☐ Zero Supabase client imports
☐ Zero edge function references
☐ Zero .sql files in tutor directory tree
☐ Zero V5 imports
☐ V5_ENABLED unchanged
☐ All re-exported V4 types resolve correctly
☐ No circular imports
☐ TutorMode is a strict subset of LearningSupportMode values
☐ TutorTier uses 'free'/'paid' (no 'vip' references)
☐ A4: 5 conversation modes defined
☐ A7: Data allowlist/denylist documented
☐ A7: Log redaction rules defined
☐ A8: Token budgets, tier limits, provider descriptor, timeout config defined
☐ A6: Validation gates documented in §14
☐ Rollback plan documented and verifiable
```

---

*This document is locked. Changes require a new Phase with explicit justification and A10/A6/A7/A8/A1 re-review.*
