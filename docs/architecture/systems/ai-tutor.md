# AI Tutor — Deep Dive

> **Sibling of** [system-overview.md §9](../system-overview.md#9-ai-tutor).
>
> The AI Tutor surface today is **two layers stacked**: a live
> `guide-assistant` edge-function path that produces production tutor
> responses, and a dark Phase B pure-function library
> (`src/lib/ai-tutor/`) that ships the *next-generation* tutor with
> `AI_TUTOR_ENABLED = false` (tree-shaken in production). This doc
> covers both — what is in production, what is gated, where the L1
> profile is injected (§15 Bar #3 closure), and where the safety /
> cost / privacy rails live.
>
> **Read first:**
> - `src/lib/ai-tutor/types.ts` (file head + the `AI_TUTOR_ENABLED`
>   flag + the privacy allowlist/denylist enums)
> - `src/lib/ai-tutor/promptAssembly.ts:32, :270, :295` (L1 injection,
>   §15 Axis 1 Bar #3)
> - `supabase/functions/guide-assistant/index.ts` (the live
>   production tutor)
> - `docs/ai-tutor/TUTOR_CONTRACT.md`,
>   `docs/ai-tutor/AI_TUTOR_AGENT_PROMPTING_PRINCIPLES.md`,
>   `docs/ai-tutor/TUTOR_V4_INTEGRATION.md`

---

## 1. What it does, and why it matters strategically

The AI Tutor is the conversational surface where Mercy *teaches*. A
learner can:

- **Ask** a free-text question about English.
- **Fix grammar** by sending a sentence for correction.
- **Speak** to practice pronunciation (pronunciation coaching mode).
- **Resume** a previous lesson / room.
- **Open** the tutor directly from a Home CTA.

The tutor produces a structured Vietnamese response (with English
reference, optional corrected/enhanced sentence, optional grammar
points, optional practice sentence, and "next steps" chips for
follow-up actions).

Why it matters strategically:

- **§15 Axis 1 Bar #3 — CLOSED.** The tutor consumes the Vietnamese
  L1 profile. `promptAssembly.ts:32` imports `vietnameseL1Profile`;
  lines 295–297 inject *"Lưu ý các lỗi tiếng Việt thường gặp ở trình
  độ này: …"* into the system prompt. Without this, the tutor is
  generic English-language coaching — with it, it's the Vietnamese
  L1-aware tutor the §1 mission test calls for.
- **§5 product strategy item 2** — *"A consistent AI teacher
  (Mercy)"*. The tutor is the most visible surface where Mercy's
  persona shows up. Voice consistency is part of the moat.
- **`CLAUDE.md` non-negotiable #2 (Kids mode is sacred).** Kids do
  **not** see AI Tutor — PR #1205 removed the entry from the
  launcher modal. The tutor surface is *adults only*.
- **`STRATEGY.md` §12 "AI chat" item** — *"Add 'AI chat' without a
  specific learning job to do"* is on the explicit NOT-doing list.
  The tutor exists with a specific job (ask / fix / speak / resume /
  direct), not as a generic chatbot.

---

## 2. The two layers — what's live, what's dark

This is the single most important orientation point for a new agent.

### Layer 1 — Live production tutor (the "guide-assistant" path)

Every tutor response a user sees in production today comes from
**`supabase/functions/guide-assistant/index.ts`**. The browser
invokes it via:

```ts
// src/components/mercy-guide/api/askMercyApi.ts:53
const { data, error } = await supabase.functions.invoke(
  'guide-assistant',
  { body: request, /* … */ },
);
```

The edge function:

1. **Crisis-keyword pre-gate.** `containsCrisisKeywords(input)` runs
   *before* any LLM call. Hits return a `SAFE_RESPONSE`
   (`../_shared/crisisResponse.ts`) immediately. Keywords cover both
   English and Vietnamese (`suicide`, `tự tử`, `medication`, `thuốc`,
   …).
2. **Rate limit.** 20 req/min per IP via
   `_shared/rateLimit.ts:checkRateLimit`.
3. **AI-enabled checks.** `isAiEnabled` (global kill switch) +
   `isUserAiEnabled` (per-user). If disabled, return
   `aiDisabledResponse`.
4. **Tier-aware depth.** `TierDepth = "short" | "medium" | "high"` —
   gates how long the response can be by `pricing_tier`.
5. **Prompt assembly** with `progressContext` if the chat layer
   decides the moment is right (frustration, self-check, practice
   ask, low recent score) — assembled inline in the edge function.
6. **OpenAI call** (`https://esm.sh/openai@4.56.0`).
7. **Logging** via `logAiUsage` (`_shared/aiUsage.ts`) — privacy-safe
   token/cost metadata; no raw text.
8. **Response shaped to `GuideAssistantResponse`** for the chat UI.

Related edge functions on the same family:

- `guide-english-helper` — a related helper surface.
- `guide-pronunciation-coach` — pronunciation-specific coaching
  responses.
- `ai-chat` — older free-form chat endpoint.
- `ai-reasoning` — chain-of-thought reasoning endpoint.
- `mercy-guide` — Mercy guide surface (separate from the tutor tab).

### Layer 2 — Phase B (dark) AI Tutor library

`src/lib/ai-tutor/*` is the **next-generation** AI Tutor: a set of
pure functions that produce *effect descriptors* the caller executes,
with full state-machine semantics, safety rails, cost/rate/token
budgets, and provider abstraction. The library is **dark**:

```ts
// src/lib/ai-tutor/types.ts:37
export const AI_TUTOR_ENABLED: boolean = false;
```

When `AI_TUTOR_ENABLED` is false, the bundler tree-shakes the entire
library out of production. The Phase B modules exist on `main` —
fully typed, fully tested — but **do not affect production behavior**
until the flag flips.

Phase B's intent is to **replace** the inline assembly in
`guide-assistant` with a pure, deterministic, testable orchestration
layer. The L1 profile injection (§15 Bar #3) was implemented in the
Phase B `promptAssembly.ts` — so the closure of Bar #3 is, today, a
**dark** feature. The live tutor still uses the older inline
assembly. The Bar tick recorded the *code shipped*; the production
behavior change happens when the flag flips.

This dual-layer reality is intentional and conservative: the live
tutor stays unchanged until Phase B has been smoke-tested behind the
flag.

---

## 3. Key files and their roles

### 3a. Live tutor (Layer 1)

| File                                                              | Role                                                                                                  |
|-------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| `supabase/functions/guide-assistant/index.ts`                     | The live tutor edge function. Crisis gate + rate limit + AI checks + tier depth + OpenAI call + log. |
| `supabase/functions/_shared/crisisResponse.ts`                    | `SAFE_RESPONSE` — Vietnamese crisis-redirect copy in Mercy's canonical informal register.            |
| `supabase/functions/_shared/aiUsage.ts`                           | `isAiEnabled`, `isUserAiEnabled`, `logAiUsage`. Per-request audit + global / per-user kill switches.  |
| `supabase/functions/_shared/rateLimit.ts`                         | `checkRateLimit`, `getClientIP`, `rateLimitResponse`. Shared IP-based limiter.                       |
| `src/components/mercy-guide/api/askMercyApi.ts`                   | Browser-side `invoke('guide-assistant', …)` caller. Maps the chat-layer state to the edge function payload. |
| `src/lib/mercy/progressContext.ts`                                | Builds the `ProgressContext` snapshot the chat layer optionally injects.                              |
| `src/components/mercy-guide/api/progressTriggers.ts`              | Heuristics that decide *when* to inject progress (frustration, self-check, practice ask, low score). |

### 3b. Phase B dark library (`src/lib/ai-tutor/`)

| File                       | Role                                                                                                              |
|----------------------------|-------------------------------------------------------------------------------------------------------------------|
| `types.ts`                 | **865 lines.** All types + the `AI_TUTOR_ENABLED` flag + the privacy allowlist/denylist + log-redaction rules + tier/budget/timeout constants + Phase A validation checklist. Type-only — zero runtime side effects. |
| `promptAssembly.ts`        | **Pure** prompt assembly. Imports `vietnameseL1Profile`; `getHighSeverityL1Patterns(cefrLevel)` returns short-description strings filtered by severity + CEFR; the assembly injects those into the Vietnamese teacher-voice block (lines ~270, ~295). |
| `sessionRuntime.ts`        | **Pure** reducer/state machine. Produces `TutorEffect` descriptors that the caller executes. Never executes effects itself. |
| `safety.ts`                | **Pure** safety/privacy guardrails — input sanitization, output moderation, PII detection, crisis detection, profanity, hate-speech, prompt-injection, self-harm, off-topic, hallucinated-PII, model-impersonation. Regex/pattern matching only. |
| `costLimits.ts`            | **Pure** cost/rate/token limit enforcement against `TUTOR_TIER_LIMITS` and `TUTOR_TOKEN_BUDGETS`.                  |
| `aiTutorService.ts`        | **Pure** orchestration. Composes promptAssembly + sessionRuntime + safety + costLimits + mockProvider into one `executeTutorTurn`. Returns effect descriptors. |
| `mockProvider.ts`          | Deterministic mock provider for tests and dark-flag UI integration. No real network.                              |
| `detectorHint.ts`          | Bridges a single L1 detector firing (`L1DetectionResult`) into a chip rendered below the tutor correction.  Per-tag content from `L1_VN_EXPLANATIONS` + per-session dedup via `sessionStorage`. |
| `learningMemory.ts`        | Tutor's session-scoped learning memory.                                                                            |
| `tutorUiCopy.ts`           | Static Vietnamese copy used by tutor UI surfaces.                                                                  |
| `useBrowserStt.ts`         | Browser SpeechRecognition hook used by speak-entry modes.                                                          |
| `useTtsSpeaker.ts`         | Browser SpeechSynthesis hook used to speak responses back.                                                         |
| `__tests__/`               | Per-module unit tests. The library compiles + tests pass on every CI run regardless of flag state.                |

### 3c. UI consumers

| File                                                         | Role                                                                                                       |
|--------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `src/pages/AiTutor.tsx`                                      | The page route for `/ai-tutor`.                                                                            |
| `src/components/mercy-guide/MercyGuidePanel`                 | The four-tab panel (Journey / Grammar / Speak / Logic). Tutor lives behind the Grammar/Logic tabs.         |
| `src/components/mercy-guide/tabs/AITutorTab.tsx`             | The AI Tutor tab. Imports `TutorTier` from the dark library.                                               |
| `src/components/mercy-guide/hooks/useAITutor.ts`             | React hook that drives the (dark) tutor turn. Calls `executeTutorTurn`. UI-only state — no localStorage, no Supabase, no persistence; no raw learner text logging; no real provider calls. |
| `src/components/ai-tutor/`                                   | UI components for the tutor surface.                                                                       |

### 3d. L1 profile & detector wiring (the §15 Bar #3 path)

| File                                            | Role                                                                                                       |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `src/lib/l1-profiles/vi.ts`                     | `vietnameseL1Profile` — interference patterns with severity + CEFR levels + Vietnamese short-descriptions. |
| `src/lib/feedback/l1-error-detector.ts`         | `detectErrors(turn, expected)` — per-turn detector that produces `L1DetectionResult` with `weaknessTag`.   |
| `src/lib/feedback/rule-packs/vi/`               | VN rule pack consumed by the detector.                                                                     |
| `src/lib/feedback/l1-vn-explanations.ts`        | `L1_VN_EXPLANATIONS` — tag → ≤300-char Vietnamese explanation. Used by `detectorHint.ts` for the chip.     |
| `src/lib/ai-tutor/promptAssembly.ts:32`         | `import { vietnameseL1Profile } from "@/lib/l1-profiles/vi"`                                              |
| `src/lib/ai-tutor/promptAssembly.ts:52`         | `getHighSeverityL1Patterns(cefrLevel: string \| null): string[]` — severity=high AND CEFR-in-observed filter. |
| `src/lib/ai-tutor/promptAssembly.ts:~295`       | Injects *"Lưu ý các lỗi tiếng Việt thường gặp ở trình độ này: {patterns.join(' ')}"* into the system prompt. |

---

## 4. Public API / surface contracts

### 4a. Live tutor request (browser → edge function)

```ts
// src/components/mercy-guide/api/askMercyApi.ts
interface MercyApiRequest {
  input: string;
  mode: 'general_guide' | 'emotional_support' | 'learning_path' | 'english_explain';
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
  progressContext?: ProgressContext;  // optional, gated by progressTriggers
}
```

Response: `GuideAssistantResponse` (defined in `mercy-guide/shared`).

### 4b. Phase B tutor turn (the future contract)

```ts
// src/lib/ai-tutor/aiTutorService.ts
interface TutorTurnRequest {
  session: TutorSession;
  userMessage: string;
  entryPoint: TutorEntryPoint | null;
  tier: TutorTier;
  isKidsMode: boolean;
  nowMs: number;        // injected — no Date.now()
  mockProvider: MockProvider;
  requestId: string;
  requestsThisMinute: number;
  requestsToday: number;
  runningDailyCostUsd: number;
}

function executeTutorTurn(req: TutorTurnRequest): TutorTurnResult;
```

`TutorTurnResult` carries the updated session, an array of effect
descriptors for the caller to execute (network, persistence,
analytics), and a metrics payload.

### 4c. Conversation modes (Phase B)

```ts
type TutorConversationMode =
  | 'general_chat'
  | 'sentence_correction'
  | 'writing_feedback'
  | 'pronunciation_coaching'
  | 'lesson_guidance';

// EntryPoint → ConversationMode is pure:
function entryPointToMode(entryPoint: TutorEntryPoint): TutorConversationMode;
```

Each mode has a distinct prompt overlay, output format, and `nextSteps`
chip set. See `MODE_OVERLAYS` in `promptAssembly.ts`.

### 4d. Tutor response shape (Phase B)

```ts
type TutorResponse = {
  vi: string;                  // Mercy's Vietnamese commentary — always present
  en?: string;                 // English reference; omitted when vi_only
  correctedSentence?: string;  // populated by sentence_correction
  enhancedSentence?: string;
  grammarPoints?: string[];    // max 6
  transferErrorNote?: string;
  detailedExplanation?: string;
  nextSteps: TutorNextStep[];  // max 3 chips
  saveTargets: TutorSaveTarget[];
  practiceSentence?: string;
};
```

### 4e. Privacy allowlist / denylist (Phase B — load-bearing)

`src/lib/ai-tutor/types.ts:600-637` defines the canonical lists. Every
piece of learner data the tutor touches falls into one of two
categories:

**Allowlist (MAY be sent to the AI model):**

```text
learnerKey            (opaque hash, not PII)
cefrLevel             (overall + per-skill)
l1InterferenceFlags   (pattern IDs only, not full L1 profile)
currentPracticeText
correctionTarget
pronunciationScore
recentLessonIds       (lesson IDs only)
troubleWords
grammarQuestion
selectedTopic
curriculumFocus
conversationHistory   (last N messages, current session only)
conversationMode
learnerDisplayName    (display name, not real name)
```

**Denylist (MUST NEVER be sent):**

```text
email
fullName
phoneNumber
profileId             (raw UUID; use learnerKey)
ipAddress
deviceId
sessionToken
serviceRoleKey
apiKey
paymentData
subscriptionTier
adminLevel
otherLearnerData
fullConversationHistory  (beyond current session)
rawAudioRecording
```

The prompt assembly enforces these by construction (it builds the
prompt from a known set of fields). The safety module *also* runs
PII patterns over the constructed prompt as a belt-and-braces check.

### 4f. Logging redaction rules

`src/lib/ai-tutor/types.ts:662-669`:

```ts
TUTOR_LOG_REDACTION_RULES = [
  { pattern: '<email regex>',      replacement: '[EMAIL]',   label: 'email' },
  { pattern: '<vn phone regex>',   replacement: '[PHONE]',   label: 'phone_vn' },
  { pattern: '<intl phone regex>', replacement: '[PHONE]',   label: 'phone_intl' },
  { pattern: 'eyJ[a-zA-Z0-9_-]{8,}', replacement: '[JWT]',   label: 'jwt' },
  { pattern: 'sk-[a-zA-Z0-9_-]{8,}', replacement: '[API_KEY]', label: 'api_key' },
  { pattern: '<ip regex>',         replacement: '[IP]',      label: 'ip' },
];
```

Every logging path (telemetry, decision records, error reports) must
apply these before persistence. The billing layer borrows these rules
too — they are the canonical set.

### 4g. Tier limits (Phase B)

```ts
TUTOR_TIER_LIMITS = {
  free: { requestsPerMinute: 3,  requestsPerDay: 30,  tokensPerDay: 15_000,  maxCostPerDayUsd: 0.05 },
  paid: { requestsPerMinute: 10, requestsPerDay: 200, tokensPerDay: 100_000, maxCostPerDayUsd: 0.50 },
};
```

`free` vs `paid` derives from billing entitlement (see
[`billing-entitlement.md`](./billing-entitlement.md)). Today, the live
tutor uses the older `TierDepth` ("short" / "medium" / "high") gated
inline in `guide-assistant/index.ts` — Phase B's tier-limit
structure is the upgrade target.

### 4h. Token budgets per request type (Phase B)

```ts
TUTOR_TOKEN_BUDGETS = {
  grammar_correction:    { maxInputTokens: 500,  maxOutputTokens: 300,  maxTotalTokens: 800  },
  speaking_practice:     { maxInputTokens: 200,  maxOutputTokens: 400,  maxTotalTokens: 600  },
  translation:           { maxInputTokens: 1000, maxOutputTokens: 1000, maxTotalTokens: 2000 },
  tutoring_explanation:  { maxInputTokens: 800,  maxOutputTokens: 600,  maxTotalTokens: 1400 },
  pronunciation_feedback:{ maxInputTokens: 300,  maxOutputTokens: 200,  maxTotalTokens: 500  },
  lesson_generation:     { maxInputTokens: 2000, maxOutputTokens: 1500, maxTotalTokens: 3500 },
  general_chat:          { maxInputTokens: 1000, maxOutputTokens: 800,  maxTotalTokens: 1800 },
};
```

### 4i. Phase 1 provider (Phase B)

```ts
TUTOR_PHASE1_PROVIDER = {
  provider: 'deepseek',
  model: 'deepseek-v3',
  inputPricePer1M: 0.14,
  outputPricePer1M: 0.28,
  latencyMsP50: 1500,
  vietnameseQuality: 'excellent',
};
```

The live tutor today uses OpenAI (per `guide-assistant/index.ts`).
The Phase B recommendation is DeepSeek for Phase 1 — the flag flip
will involve a provider swap.

---

## 5. Invariants

### 5a. Live tutor (Layer 1)

- **Crisis gate before LLM.** `containsCrisisKeywords(input)` runs
  pre-LLM. Hits short-circuit to `SAFE_RESPONSE`. Do not remove this
  pre-gate.
- **`isAiEnabled` is the global kill switch.** When false, every
  tutor request returns `aiDisabledResponse` without invoking the
  provider. This is the operator's emergency stop.
- **`isUserAiEnabled` is the per-user kill switch.** Backed by
  `profiles.ai_enabled`. Lets ops kill AI access for a specific user
  (abuse / payment failure / etc.) without bringing down the system.
- **Crisis copy is Vietnamese-native, not translated.** Per the
  file-head note: *"the VI is now native (not a translation) in
  Mercy's canonical informal register."*
- **`logAiUsage` is metadata-only.** Tokens, cost, request id —
  never raw learner text, never the model's response text.
- **Rate limit is per-IP, 20/min.** Restored from prod v127 (lost in
  PR #198). Do not lower this without a coordinated change to the
  per-user limit too.

### 5b. Phase B (Layer 2)

- **`AI_TUTOR_ENABLED = false` in production.** Default. Tree-shaking
  removes the entire library when false.
- **All Phase B modules are pure.** No `Date.now()`, no
  `Math.random()`, no `fetch`, no Supabase client, no
  `localStorage` writes. Every dependency is injected.
- **No real provider calls.** `mockProvider.ts` is the only provider
  surface inside the library. When the flag flips, the caller (a
  future thin wrapper) will swap in a real provider.
- **No persistence inside the library.** `useAITutor.ts` is React
  state only. Phase A's `TutorSession` is an in-memory construct;
  persistence will reuse `mercy_conversations` (V4, frozen) in a
  future phase.
- **No V5 imports.** Per `types.ts` line 21 — *"This module must not
  import from V5. V5 is a separate concern."*
- **V4 consumption is `import type` only.** No runtime coupling.
- **No circular imports.** This library imports types from V4, never
  vice versa.
- **TypeScript compiles when the flag is false.** Every PR. CI's
  `typecheck:ci` enforces.

### 5c. Privacy / safety invariants (apply to both layers)

- **Denylist enforcement is structural, not best-effort.** The prompt
  is built from an allowlist, not by filtering a denylist out. New
  denylist additions are *additional* belt-and-braces guards, not
  the primary safeguard.
- **Crisis keywords are case-insensitive, bilingual, and pre-LLM.**
  Don't move the check after the LLM call — that defeats the whole
  point.
- **No raw learner text logging.** Anywhere. Including error logs.
  `createCostLogEntry` in `costLimits.ts` is explicitly designed to
  emit *only* inert metadata.
- **No `mercy_user_facts` write from the tutor.** The teacher-mercy
  engine owns that table; tutor sessions feed into it through
  explicit, audited write paths only (V4 frozen scope).
- **Off-topic redirect, not refusal.** When a learner asks about
  non-English topics, the tutor redirects politely
  (*"Mình tập trung học tiếng Anh nhé"*), not refuses.
- **Never share the system prompt.** When asked, the tutor responds
  *"Tôi là Mercy, trợ lý học tiếng Anh của bạn."*
- **Never roleplay as a real person.** Hard rule in the base prompt.

### 5d. Tutor / Stage 3A boundary

The tutor turn produces an `L1HintPayload` per turn. That payload is
**also** what populates the Stage 3A `l1TagAdapter` buffer (see
[`study-os-stage-3.md`](./study-os-stage-3.md) §4b). The tutor reads
the L1 profile for *prompt injection*; Stage 3A reads the detector
output for *behavioral signal mirroring*. The two paths share the
detector but **not** the buffer — the tutor doesn't read the Stage 3A
buffer; Stage 3A doesn't read the tutor's prompt context. Keep them
decoupled.

### 5e. Kids mode boundary

`isKidsModeAllowed` (in `safety.ts`) and the Kids launcher modal
(PR #1205 removed the AI Tutor entry) jointly enforce the *kids do
not see AI Tutor* invariant. **Do not re-add the AI Tutor entry to
the kids launcher.** It is a `CLAUDE.md` non-negotiable.

---

## 6. Known gotchas / pitfalls

### 6a. The L1 injection ships, but Bar #3 closure means *code*, not *behavior*

`STRATEGY.md` §15 Axis 1 Bar #3 is ticked because PR #1131 landed the
L1 injection in `promptAssembly.ts`. **But the live tutor today does
not use `promptAssembly.ts`** — it uses the inline prompt assembly in
`guide-assistant/index.ts`, which has its own (older) injection.

When asked "is the live tutor consuming the L1 profile?" the honest
answer is: the Phase B tutor *will* via `promptAssembly.ts:295`; the
live tutor *does* via its own inline path. Both are real; they are
not the same code path. Don't conflate them.

### 6b. `entryPointToMode` is total, not partial

```ts
function entryPointToMode(entryPoint: TutorEntryPoint): TutorConversationMode {
  switch (entryPoint) {
    case 'ask':           return 'general_chat';
    case 'fix_grammar':   return 'sentence_correction';
    case 'speak':         return 'pronunciation_coaching';
    case 'resume':        return 'lesson_guidance';
    case 'direct':        return 'general_chat';
  }
}
```

There are 5 entry points and 5 conversation modes. The function is
exhaustive — TypeScript enforces the exhaustiveness because
`TutorEntryPoint` is a string literal union. Add a new entry point
→ TS will fail the build until you add a case here. Don't add a
default branch; the type error is the feature.

### 6c. The `canceled + future expiry → "active"` rule applies here too

Tutor tier (`free` vs `paid`) derives from billing entitlement. Per
[`billing-entitlement.md` §5a](./billing-entitlement.md#5a-the-canceled--future-expiry--active-rule),
a `canceled` Stripe row with a future `current_period_end` is
**still entitling**. The user should see `paid` tutor limits until
the expiry passes. If the tutor shows free-tier limits to a user
whose subscription was canceled-but-still-active, you have a
billing-entitlement read bug, not a tutor bug.

### 6d. CEFR null → no L1 injection

`getHighSeverityL1Patterns(cefrLevel)` returns `[]` when `cefrLevel`
is null or unrecognised. The downstream assembly skips the L1 line
entirely when the array is empty. This is **correct** behavior — we
don't speculate-coach a learner whose level we don't know.

When debugging "the tutor isn't mentioning my Vietnamese transfer
errors", check (1) is `cefrLevel` set on the user (placement
completed?), (2) is the level recognised
(`VALID_CEFR_LEVELS` = `{A1,A2,B1,B2,C1,C2}`; A0 is **not** in this
set), (3) does the L1 profile actually carry high-severity patterns
at that level.

### 6e. `progressContext` is optional and trigger-gated

The chat layer's `progressTriggers` decides whether to inject the
progress snapshot. Without a trigger (low recent score, frustration,
self-check, practice ask), the request goes without it. The edge
function **unconditionally** appends `STUDENT_PROGRESS:…` when present,
so the gate is at the client side, not the server side.

If you want progress always-on for a specific surface, the right edit
is in `progressTriggers.ts`, not in the edge function.

### 6f. Phase B's mockProvider is deterministic — don't expect realistic responses

`mockProvider.ts` returns canned responses keyed on the request shape.
This is intentional for testing. If you find yourself confused that
the dark tutor "doesn't reply intelligently in the test harness",
that's because there's no real provider behind it. The flag flip
swaps in the real provider; until then, the mock is the truth.

### 6g. Token budgets are a soft cap on input, hard cap on total

`checkTokenBudget` returns `{ allowed: false }` when `estimatedTokens`
exceeds the budget. The caller is expected to *truncate* — typically
by dropping older conversation history — and retry. Returning the
budget error to the user is the failure mode (`TutorErrorKind:
"budget_exceeded"` system event), not the happy path.

### 6h. Crisis gate doesn't catch every phrasing

The crisis keyword list is finite (English + Vietnamese, fewer than 20
phrases). It will miss creative phrasings, indirect references, and
non-Vietnamese non-English requests. The fallback is the safety
module's `getCrisisResource()` which runs against the LLM output.
Both gates exist because either alone misses real cases.

If the tutor responds to a clear crisis input without redirecting,
**that is a bug** — add a phrasing to the keyword list AND tighten the
safety patterns.

### 6i. The `mercy_user_facts` table is V4-frozen scope

The future tutor will reuse `mercy_user_facts` for persistence in a
future phase (per `types.ts` line 31). Today, the tutor does **not**
write to it. The semantic person memory is owned by the teacher-mercy
engine; the tutor borrows the *type* (`UserFact`) read-only, not the
write path.

If you find yourself thinking "the tutor should remember X for next
session", that's a future-phase concern, not a current-PR scope.

### 6j. Mock provider tests pass; production calls cost money

`AI_TUTOR_ENABLED=false` keeps the dark library out of production
**but** the cost rails (`TUTOR_TIER_LIMITS.free.maxCostPerDayUsd =
$0.05`) reflect Phase 1 economics. If you flip the flag without
re-tuning, expect a tighter cost ceiling than the live tutor has
today. The flip should be paired with an explicit cost-budget review.

---

## 7. Cross-references

- **[system-overview.md §9](../system-overview.md#9-ai-tutor)** — the
  one-paragraph version.
- **[data-flow.md §1](../data-flow.md#1-learner-signal-flow-anon--stage-3a--stage-3b--practice)**
  — where tutor turns feed Stage 3A's L1 ring buffer.
- **`docs/ai-tutor/TUTOR_CONTRACT.md`** — older living contract doc.
- **`docs/ai-tutor/AI_TUTOR_AGENT_PROMPTING_PRINCIPLES.md`** —
  prompting-side principles from the Phase A planning.
- **`docs/ai-tutor/TUTOR_V4_INTEGRATION.md`** — Phase B / V4 boundary
  notes.
- **`CLAUDE.md`** — Mercy character / Speak tab dual invariant (chunking
  for Chrome `speechSynthesis`).
- **`STRATEGY.md`** §5 item 2 (consistent AI teacher), §12 (no
  generic AI chat), §15 Axis 1 Bar #3 (L1 injection).
- **Sibling deep-dives:**
  - [`billing-entitlement.md`](./billing-entitlement.md) — tutor tier
    derives from entitlement; budget rails depend on the same status
    + expiry rule.
  - [`study-os-stage-3.md`](./study-os-stage-3.md) — Stage 3A's L1
    buffer is populated by the same detector output the tutor
    consumes for prompt injection. Decoupled paths, same source.

---

## 8. How to extend this — checklist

### 8a. Adding a tutor mode (Phase B)

- [ ] Add the mode to `TutorConversationMode` in `types.ts`.
- [ ] Add an entry to `MODE_OVERLAYS` in `promptAssembly.ts` with the
      mode-specific prompt overlay.
- [ ] If a new entry point should trigger this mode, add to
      `TutorEntryPoint` and update `entryPointToMode` exhaustively.
- [ ] Add response-shape fields to `TutorResponse` if the new mode
      produces structurally new output (e.g. a phoneme-breakdown
      block).
- [ ] Add `TutorErrorKind` if the mode introduces new failure modes.
- [ ] Tests under `__tests__/promptAssembly.test.ts` and
      `sessionRuntime.test.ts`.

### 8b. Adding a privacy field (allowlist or denylist)

- [ ] Decide which list. If you're unsure, default to **denylist**.
- [ ] Add to `TutorPromptAllowlistField` or `TutorPromptDenylistField`
      in `types.ts`.
- [ ] If allowlist: update the assembly function to populate the
      field from the appropriate source.
- [ ] If denylist: ensure the assembly *cannot* populate it (positive
      construction); add a safety-module regex if it could appear in
      free text.
- [ ] Add to `TUTOR_LOG_REDACTION_RULES` if the field could land in
      logs.

### 8c. Tightening a safety rail

- [ ] Identify which rail: input (`sanitizeInput`), output
      (`moderateOutput`), PII (`detectPii`), crisis
      (`getCrisisResource`), profanity, hate-speech, prompt-injection,
      self-harm, off-topic, hallucinated-PII, model-impersonation.
- [ ] Add the pattern to the appropriate regex array in `safety.ts`.
- [ ] Add a test case that the old patterns missed.
- [ ] Verify the live tutor's crisis-keyword list in
      `guide-assistant/index.ts` is also updated if the rail applies
      pre-LLM (crisis keywords *do* run pre-LLM in the live tutor;
      profanity and the rest run post-LLM).

### 8d. Wiring Phase B into a UI surface (when AI_TUTOR_ENABLED is dark)

- [ ] Hook the UI through `useAITutor`.
- [ ] Inject a `nowMs` (use `Date.now()` at the hook site, not in
      the library).
- [ ] Inject a `mockProvider` (use `createMockProvider()` until the
      flag flips).
- [ ] Inject the running counters (`requestsThisMinute`,
      `requestsToday`, `runningDailyCostUsd`) — for the dark flag,
      stub at 0 / 0 / 0.
- [ ] Render `TutorEffect` descriptors at the UI layer: dispatch
      network calls (none in dark mode), persistence (none), analytics
      (none). The reducer NEVER executes effects.

### 8e. The flag-flip (when it happens)

This is **not** a one-PR change. Expect a sequence:

- [ ] Prerequisite: Real provider adapter (DeepSeek per
      `TUTOR_PHASE1_PROVIDER`).
- [ ] Prerequisite: Persistence path through `mercy_conversations`
      (V4 frozen scope unfreeze, owner-gated).
- [ ] Prerequisite: Cost rails actively enforced (today the live
      tutor uses tier-depth as a proxy; the flip swaps in the
      token/cost cap).
- [ ] Prerequisite: Smoke-test surface (the dark UI in tab form,
      behind a developer-only flag).
- [ ] Flip `AI_TUTOR_ENABLED = true` in `types.ts`.
- [ ] **Don't** delete `guide-assistant/index.ts` in the same PR.
      Keep it as the rollback path for at least one release.

### 8f. Modifying the live tutor (Layer 1)

- [ ] Identify whether the change is **operational** (rate limit,
      crisis keyword, depth gate, log shape) or **prompting**
      (system prompt, mode overlay, response shape). The two have
      different review thresholds.
- [ ] If prompting: the change applies to live behavior immediately
      on deploy. Pair with an A/B observation window.
- [ ] If operational: deploy + monitor the rate-limit / cost
      metrics for 24h before declaring done.
- [ ] **Both layers must stay in parity for any safety rail.** If
      you add a crisis keyword to `guide-assistant`, add the
      equivalent regex to `safety.ts:CRISIS_KEYWORDS_VI` in the same
      PR.

---

## 9. The two-line summary

> The AI Tutor today is two layers stacked: a live
> `guide-assistant` edge function (rate-limited, crisis-gated,
> tier-depth-aware, OpenAI-backed) that powers the production tutor
> tab, and a dark Phase B pure-function library under
> `src/lib/ai-tutor/` (gated by `AI_TUTOR_ENABLED=false`) that
> implements the next-generation tutor — state machine,
> conversation modes, structured response, full safety/cost/privacy
> rails, and the §15 Bar #3 L1-profile injection. Live behavior
> changes only when the flag flips; until then, the dark library is
> a typed-and-tested artifact riding on every CI run.

If you ever need to explain the tutor in two sentences, those are
them.
