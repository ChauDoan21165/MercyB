# AI Tutor — V4 Integration Contract

> **Document type:** Integration Contract (locked)
> **Date:** 2026-05-22
> **Phase:** A (contract-only — reconciled)
> **Author:** A2 — Product Tutor Designer
> **Status:** Awaiting A10 (lane/boundary) + A6 (validation audit) + A7 (safety/privacy) + A8 (cost/reliability) + A1 (final park) review
> **Reconciliation sources:** A7 (Safety & Privacy data flow), A8 (Cost & Reliability provider strategy)
> **Note:** `docs/ai-tutor-design.md` is a parked design draft — TUTOR_CONTRACT.md and TUTOR_V4_INTEGRATION.md are the authoritative Phase A contracts.
> **Read after:** `docs/ai-tutor/TUTOR_CONTRACT.md`, `src/lib/ai-tutor/types.ts`

---

## 1. Purpose

This document defines the exact V4 integration surface the AI Tutor will consume. Every V4 module, type, function, and constant listed here is **frozen** — the tutor may read from it, but must not mutate or redefine it.

V4 files are not to be modified for the tutor. If a future phase needs new V4 functionality, it must be added as a new export from the existing V4 module (additive, backward-compatible) or as a new V4 module — never by changing the signature of an existing export the tutor already consumes.

---

## 2. Integration Principles

1. **Read-only consumption.** The tutor reads V4 exports. It never writes, mutates, or extends them.
2. **`import type` boundary.** All cross-module type references use `import type` — zero runtime code from V4 is pulled into tutor modules at the type level.
3. **Re-export, don't re-define.** `src/lib/ai-tutor/types.ts` re-exports V4 types for convenience. Tutor consumers import from `@/lib/ai-tutor/types`, not directly from V4 modules.
4. **Additive-only V4 changes.** If a future tutor phase needs something V4 doesn't export, V4 gets a new export — existing exports are never re-signed or removed.
5. **No circular dependencies.** Tutor modules import FROM V4. V4 modules never import FROM tutor. This is a one-way dependency.

---

## 3. Consumed V4 Modules

### 3.1 `src/components/mercy-guide/types.ts`

**Frozen:** Shared types module consumed by all Mercy guide tabs.

| Export | Kind | Purpose | Tutor usage |
|---|---|---|---|
| `LearningSupportMode` | Type | Teaching support level | Mirrored as `TutorMode` |
| `MercyGuideTab` | Type | Tab identifiers | Tutor adds `'tutor'` variant (additive, future phase) |
| `TeacherMemorySummaryItem` | Type | Memory summary | Read to extract `lastFocus` for TutorContext |
| `StudentMercyMemory` | Type | Full learner memory | May be read in future phases |

**Tutor does NOT consume:** `MercyGuideProps`, `CheckInMessage`, `PathHint`, `StudentMercyMemoryUpdate`, `TroubleWordItem`.

### 3.2 `src/lib/mercy/progressContext.ts`

**Frozen:** Progress data pipeline.

| Export | Kind | Purpose |
|---|---|---|
| `ProgressContext` | Type | Populates `TutorContext.progress` |
| `buildProgressContext(userId)` | Async → `ProgressContext \| null` | Called at session start; null handled gracefully |
| `formatProgressContextForPrompt(ctx)` | Function → `string` | Future: attach to edge function requests |
| `MIN_WEEKLY_ATTEMPTS_FOR_CONTEXT` | Constant (`3`) | Tutor respects this threshold |

**Contract:** Read-only snapshot. Tutor does NOT write to cache, call `clearProgressContextCache()`, or modify returned objects.

### 3.3 `src/lib/mercy/userFacts.ts`

**Frozen:** Episodic memory layer.

| Export | Kind | Purpose |
|---|---|---|
| `UserFact` | Type | Populates `TutorContext.activeFacts` |
| `FactType` | Type | Filter facts by category (future) |
| `FactSource` | Type | Confidence weighting (future) |
| `getActiveFactsForUser(userId, factType?)` | Async → `UserFact[]` | Called at session start |

**Tutor does NOT consume (Phase A):** `addFact()`, `supersedeFact()`, `markFactReferenced()`, `decayUnusedFacts()`, `defaultConfidenceForSource()`.

### 3.4 `src/lib/teacher-mercy/persona.ts`

**Frozen:** Low-level persona identity.

| Export | Kind | Purpose |
|---|---|---|
| `MercyPersona` | Interface | Type reference |
| `MERCY_PERSONA` | Const | Greeting text, system prompt context |
| `FALLBACK_NAMES` | Const (`{ en, vi }`) | Greeting fallback: "Chào bạn hiền" |
| `TIER_LABELS` | Const | Not directly consumed |

### 3.5 `src/config/mercyPersona.ts`

**Frozen:** Centralized voice config.

| Export | Kind | Purpose |
|---|---|---|
| `MERCY_PERSONA_CONFIG` | Const | Greeting templates, encouragement phrasing, code-switch rules |
| `formatPersonaTemplate(template, name)` | Function | Personalize greeting with learner name |
| `pickAfterMistakeLine(lang, name, repeated)` | Function | Future: correction responses |
| `MercyPersonaConfig` | Type | Type reference |
| `MercyGreetingSet`, `MercyEncouragementMoment`, `MercyFillerKind` | Types | Type narrowing |

### 3.6 `src/components/mercy-guide/tabs/grammar-writing/types.ts`

**Frozen:** Grammar analysis pipeline types.

| Export | Kind | Purpose |
|---|---|---|
| `GrammarApiResponse` | Type | Type reference for `fix_grammar` routes |
| `GrammarWritingTeacherState` | Type | Extract `latestSubmittedText`, `currentWritingMode` |
| `WritingMode` | Type | Context for grammar edge function |
| `GrammarIssue` | Type | Mapped to `TutorResponse.grammarPoints` |
| `AnalyzeGrammarInput` | Type | Dispatch hook type reference |

**Tutor does NOT consume:** `PracticeTask*`, `TeachingDecision`, `LearnerMemory`, `PronunciationLaunchPayload`.

### 3.7 `src/lib/roomAudioResolver.ts`

**Frozen:** Audio key → URL pipeline. Phase A: not consumed. Future: `toAudioKey()`, `ResolvedAudio`.

### 3.8 `src/hooks/useAudioUrl.ts`

**Frozen:** Audio URL hook. Phase A: not consumed. Future: `useAudioUrl(filename)`.

### 3.9 `src/lib/supabaseClient.ts`

**Frozen:** Singleton Supabase client. Phase A: NOT imported. Future: profile reads, fact reads, conversation persistence. All queries read-only in early phases.

---

## 4. Types the Tutor Re-exports

```typescript
export type {
  LearningSupportMode,        // from @/components/mercy-guide/types
  ProgressContext,            // from @/lib/mercy/progressContext
  UserFact,                   // from @/lib/mercy/userFacts
  GrammarApiResponse,         // from @/components/mercy-guide/tabs/grammar-writing/types
  GrammarWritingTeacherState, // from @/components/mercy-guide/tabs/grammar-writing/types
};
```

All re-exports use `export type` — no runtime values.

---

## 5. What the Tutor Must NOT Touch

| Module | Why off-limits |
|---|---|
| `src/lib/placement/v5/*` | V5 is a separate concern |
| `src/lib/teacher-mercy/generateTeachingTurn.ts` | Internal to Teacher tab |
| `src/lib/teacher-mercy/greetings.ts` | Internal to greeting overlay |
| `src/components/mercy-guide/MercySpeakTab.tsx` | Delegation via action, not import |
| `src/components/mercy-guide/tabs/grammar-writing/GrammarWritingTab.tsx` | Delegation via action |
| `src/components/mercy-guide/EnglishLogicTab.tsx` | Delegation via action |
| `src/components/mercy/AIDisclosureModal.tsx` | Tutor reuses shared localStorage key, not the component |
| `supabase/functions/ai-chat/index.ts` | HTTP call, not import |
| `supabase/functions/guide-assistant/index.ts` | HTTP call, not import |

---

## 6. A7 Data Flow: Prompt Assembly & Redaction Pipeline (A7 §1-2, §6)

### 6.1 Data Flow Diagram

```
LEARNER INPUT
     │
     ▼
┌──────────────┐
│ INPUT FILTER  │  A7 §3: profanity, self-harm, PII stripping, prompt injection
│ (client-side) │
└──────┬───────┘
       │ safe input
       ▼
┌──────────────┐
│ ALLOWLIST     │  A7 §1: only TutorPromptAllowlistField fields included
│ ASSEMBLY      │  Any field not on the allowlist is excluded by default
└──────┬───────┘
       │ allowlisted context
       ▼
┌──────────────┐
│ PSEUDONYMIZE  │  Replace profileId → learnerKey (opaque hash)
│               │  Replace displayName → first-name-only
└──────┬───────┘
       │ pseudonymized prompt
       ▼
┌──────────────┐
│ PROVIDER CALL │  V4 providerRegistry selects provider
│               │  System prompt + history + context sent
└──────┬───────┘
       │ raw response
       ▼
┌──────────────┐
│ OUTPUT FILTER │  A7 §4: profanity, PII hallucination, model impersonation
│ (client-side) │  Disclaimer appending
└──────┬───────┘
       │ safe response
       ▼
┌──────────────┐
│ REDACTION     │  A7 §6: TUTOR_LOG_REDACTION_RULES applied
│ (logging)     │  Email → [EMAIL], Phone → [PHONE], JWT → [JWT], etc.
└──────┬───────┘
       │ redacted log
       ▼
   LOG STORAGE
   (console only; V5 provider_decisions logging is future-only — not a Phase A or Phase B dependency)
```

### 6.2 Allowlist Enforcement

The prompt assembly function MUST accept only fields from `TutorPromptAllowlistField`. Any field not in the allowlist is excluded — this is safer than maintaining a denylist that could miss new PII fields.

### 6.3 Redaction Before Logging

Every logging path (telemetry events, decision records, error reports, debug logs) must apply `TUTOR_LOG_REDACTION_RULES` before persistence. This extends V4's existing `SECRET_KEY_PATTERN` / `SECRET_VALUE_PATTERN` from `providerRegistry.ts`.

---

## 7. A8 Provider Registry Integration (A8 §1, §7)

### 7.1 Relationship to V4 providerRegistry

The AI Tutor uses V4's `providerRegistry` abstraction for provider selection. In Phase 1, there is a single configured provider (DeepSeek-V3). The V4 abstraction is used so that multi-provider failover can be activated in Phase 2 without code changes to the tutor.

**What the tutor consumes from V4 providerRegistry (future):**

| V4 export | Tutor usage |
|---|---|
| Provider descriptor shape | Matches `TutorProviderDescriptor` in `types.ts` |
| `selectPlacementV4Provider` pattern | Provider selection with capability `"ai-tutor"` |
| Trust scoring | Provider health evaluation |
| `redactSecrets()` | Extended by `TUTOR_LOG_REDACTION_RULES` |

**What Phase A does NOT consume:**

- `selectPlacementV4Provider` runtime calls (Phase 2)
- Provider failover logic (Phase 2)
- Provider health monitoring (Phase 2)

### 7.2 Cost Logging Integration (A8 §7)

Per-request cost metrics are logged to `console.log` in all Phase A/B implementations. V5 `provider_decisions` integration is future-only — not a Phase A or Phase B dependency. A1 must explicitly approve before any tutor code writes to V5 tables.

**Logged fields per request (A8 §7):**

| Field | Source | Purpose |
|---|---|---|
| `request_id` | Generated UUID | Correlation |
| `user_id` | Auth session | Per-user cost tracking |
| `feature` | `'ai-tutor'` | Feature cost allocation |
| `provider` | Provider descriptor | Provider cost comparison |
| `model` | Provider descriptor | Model cost comparison |
| `input_tokens` | Provider response | Cost calculation |
| `output_tokens` | Provider response | Cost calculation |
| `cache_hit` | boolean | Cache effectiveness |
| `duration_ms` | Measured | Latency tracking |
| `status` | `success\|timeout\|rate_limited\|error` | Reliability tracking |
| `error_code` | Provider or internal | Debugging |

**Contract:** Phase A defines the cost-logging contract only. Cost logging writes to `console.log` in all Phase A/B implementations. V5 `v4_provider_decisions` integration is a future concern — it is NOT a Phase A or Phase B dependency. V5_ENABLED remains false and V5 is parked. A1 must explicitly approve before any tutor code writes to V5 tables.

---

## 8. Future V4 Additions (Not Phase A)

| Potential future need | Why | Priority |
|---|---|---|
| Export `notebookService.saveItem()` type | Save phrases to notebook from chat | Low |
| Export conversation creation helper | Create `mercy_conversations` rows | Medium (Phase B) |
| `checkAiBudget` RPC type export | Client-side remaining turn check | Low |
| `profiles.tier` read helper | Canonical tier read | Low |

---

## 9. Boundary Safety Rules

1. **No import of a V4 module that writes.** Reject any import from a V4 module containing `insert`, `update`, `upsert`, `delete`, or `rpc` calls.
2. **No re-export of a V4 runtime value.** `export type` only in `types.ts`.
3. **No direct component imports from V4 tabs.** Tutor delegates via `TutorNextStepAction`.
4. **No V4 type extension.** Composition (`{ fact: UserFact }`), not inheritance (`extends UserFact`).
5. **No circular dependency.** `grep "from.*ai-tutor"` in V4 directories must return empty.

---

## 10. Validation

```
☐ All consumed exports exist at the listed paths
☐ All re-exports in types.ts use `export type`
☐ Zero runtime imports from V4 into src/lib/ai-tutor/types.ts
☐ `grep -r "from.*ai-tutor" src/components/ src/lib/ src/hooks/ src/config/` returns empty
☐ `grep -r "V5_ENABLED\|from.*placement/v5" src/lib/ai-tutor/` returns empty
☐ `grep -r "supabaseClient\|createClient" src/lib/ai-tutor/` returns empty (Phase A)
☐ `grep -r "openai\|gemini\|claude\|chat\.completions" src/lib/ai-tutor/` returns empty
☐ All consumed functions exist with documented signatures
☐ FALLBACK_NAMES.vi === "bạn hiền"
☐ LearningSupportMode values match TutorMode values
☐ A7: Data flow diagram documented (§6)
☐ A7: Allowlist enforcement rule documented
☐ A7: Log redaction rules extend V4 SECRET_KEY_PATTERN
☐ A8: Provider registry relationship documented (§7)
☐ A8: Cost logging contract defined (§7.2)
☐ A8: Phase 1 single-provider strategy documented
```

---

*This document is locked. V4 owners: do not change the signature or remove any export listed in §3 without a coordinated tutor update and A10/A6/A7/A8/A1 re-review.*
