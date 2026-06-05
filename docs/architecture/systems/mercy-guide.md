# Mercy Guide — Deep Dive

> **Sibling of** [system-overview.md §3](../system-overview.md#3-teacher-mercy-engine).
>
> The Mercy Guide is the floating, dockable panel that surfaces Teacher
> Mercy *inside a room or page* — the in-context tutor a learner opens
> to ask a question, request a grammar fix, request a pronunciation
> coaching prompt, or get a suggested next room. It is the most
> visible adult-side Mercy surface and the main consumer of the
> production `guide-assistant` edge function.
>
> This is **not** the Teacher Mercy engine itself (`src/lib/teacher-mercy/*` —
> persona, voice, memory, repetition guard, talk budget). It's the
> *content-pipeline-and-routing layer* that decides, for any user input
> typed into the floating panel:
>
> 1. **Which intent** the message represents (greeting, grammar fix,
>    speak request, room-context query, crisis, …).
> 2. **Which route** to dispatch to (prewritten reply library, edge
>    function, UI action, fallback copy).
> 3. **Which tab** of the panel renders the response (Teacher /
>    Suggest / Speak / Logic / Guide).
>
> **Read first:**
> - `src/components/mercy-guide/MercyGuidePanel.tsx` — entry shell.
> - `src/components/mercy-guide/UnifiedMercyChat.tsx` — the unified
>   chat surface that hosts the 5 tabs.
> - `src/components/mercy-guide/classifyGuideInput.ts` +
>   `guideRoutingSpec.ts` — classifier + route enum.
> - `src/components/mercy-guide/logic/routeMercyMessage.ts` +
>   `detectMercyIntent.ts` + `mercyPolicy.ts` — intent router + policy
>   replies for repair / toddler / crisis classes.
> - `src/components/mercy-guide/api/askMercyApi.ts` — the single
>   browser entry point into the `guide-assistant` edge function.
> - `supabase/functions/guide-assistant/index.ts` — the live
>   production tutor.
>
> Cross-refs of context: `CLAUDE.md` → "Mercy character / Speak tab
> dual invariant"; `docs/voice-guidelines-vn.md`; the AI Tutor deep
> dive (`./ai-tutor.md`) for the related-but-distinct conversational
> tutor surface.

---

## 1. What it does, and why it matters strategically

The Mercy Guide is the *in-context tutor panel*: a floating overlay
(can dock left/right or full-screen) that a learner opens from a CTA
inside any adult-side surface — most commonly inside a room. The
panel hosts five tabs (`MercyTeacherTab`, `MercySuggestTab`,
`MercySpeakTab`, an optional logic/diagnostic tab, and `MercyGuideTab`)
that together form a single conversational surface backed by the
`guide-assistant` edge function and a local prewritten-reply library.

A learner can:

- **Ask** a question in Vietnamese or English ("Câu này nghĩa là gì?",
  "Why does this sentence use *had been*?").
- **Request a grammar fix** for a sentence they type.
- **Request a pronunciation prompt** — Mercy proposes a target word /
  phrase and routes the user into the Speak tab.
- **Request a learning-path suggestion** — Mercy nominates the next
  room based on the current room's tier / domain.
- **Open a context-aware reply** — Mercy reads the current room's
  metadata (id, title, tier, tags) and tailors the answer.

Why it matters strategically:

- **§1 mission test** (*"the Vietnamese student publicly credits us"*)
  hinges on the perceived quality of Mercy's in-room replies. The
  Guide is the surface where most Mercy interactions actually happen
  — the standalone `/ai-tutor` route is the secondary surface, not
  the primary.
- **`CLAUDE.md` non-negotiable #2 (Kids mode is sacred).** The Guide
  is **adults-only**. Kids see `kids/*` pages, never the floating
  Guide panel. The `MercyGuidePanel` is not mounted in any kids
  route.
- **`CLAUDE.md` Mercy Speak-tab dual invariant.** The Speak tab has
  two distinct audio paths — pre-recorded ElevenLabs mp3 for the kids
  flow (not reachable from this panel today, but the code branch
  exists), and `window.speechSynthesis.speak()` for the adult flow.
  The chunked `speakViaTTS` + `chunkForTTS` helper exists in
  `MercySpeakTab.tsx` to work around Chrome quirks (utterances > 180
  chars get silently dropped).
- **`STRATEGY.md` (V3 — Competitive thesis) "AI chat" item** — the panel exists with a
  specific job (ask / fix / speak / suggest / context). It is not a
  generic chatbot. Adding free-form "chat with Mercy" capability
  without a specific learning job is on the explicit NOT-doing list.
- **Crisis safety.** The same `containsCrisisKeywords` /
  `SAFE_RESPONSE` path that protects `/ai-tutor` protects this surface
  — `askMercyApi` hits `guide-assistant`, which runs the crisis
  pre-gate *before* any LLM call. Self-harm and medical-emergency
  keywords short-circuit to a Vietnamese-first safety response.

---

## 2. The two reply paths — prewritten vs LLM

This is the single most important orientation point. Every user
message hits one of two reply paths, decided by the classifier:

### Path A — Prewritten reply library

`mercyGuideReplyLibrary.ts` ships a curated set of `MercyGuideReplyRecord`
entries — Vietnamese + English replies for intents the team has
pre-authored, including:

- `greeting`, `app_intro`, `app_usage`, `study_plan`, `room_usage`,
  `room_summary`
- `grammar_plan`, `reading_plan`, `reading_comprehension_plan`,
  `writing_plan`, `pronunciation_plan`, `speaking_plan`
- `explain_grammar_in_text`, `give_simple_patterns`, `summarize_text`,
  `reading_comprehension_questions`, `check_writing`, `rewrite_simpler`,
  `extract_vocabulary`
- `phonology_final_s`, `phonology_ed_suffix` (Vietnamese-specific
  pitfalls, fast-path replies)
- `workplace_english`, `ielts_speaking_p1`, `room_context`,
  `pronunciation_feedback`, `grammar_correction`, `fallback`

`resolveMercyGuideReply.ts` matches input → intent → record via
keyword/regex rules; on a hit, the reply is returned synchronously,
the panel shows it, and no network call is made. The Speak tab can be
nudged into focus via the optional `suggestSpeak` field on the
resolved reply.

**Why prewritten.** The Vietnamese voice quality and pedagogical
correctness of these high-frequency replies is part of the moat — the
team can guarantee tone, accuracy, and Vietnamese-first framing on
the top-N intents. The LLM path is the fallback for everything else.

### Path B — Live `guide-assistant` edge function

`askMercyApi` (the only call site is `MercyTeacherTab.tsx`) invokes
`supabase.functions.invoke('guide-assistant', { body })`. The edge
function:

1. **Rate-limits** — 20 req/min per IP (`_shared/rateLimit.ts`).
2. **Crisis pre-gate** — `containsCrisisKeywords(input)` runs *before*
   any LLM call. Hits short-circuit to `SAFE_RESPONSE`.
3. **AI-enabled checks** — `isAiEnabled` (global kill) +
   `isUserAiEnabled` (per-user). If disabled, return
   `aiDisabledResponse`.
4. **Tier-aware depth** — `TierDepth = "short" | "medium" | "high"`,
   gates response length by the requester's `pricing_tier`.
5. **Mode-aware prompt** — the `MercyApiMode` (`'general_guide' |
   'emotional_support' | 'learning_path' | 'english_explain'`) flows
   into the system prompt assembly.
6. **Optional `progressContext` injection** — when the chat layer's
   triggers (frustration, self-check, low recent score, practice ask)
   decide the moment is right, a `STUDENT_PROGRESS:` block is
   appended to the system prompt.
7. **OpenAI call** (`https://esm.sh/openai@4.56.0`).
8. **Privacy-safe logging** — `logAiUsage` records token + cost
   metadata; raw text is never persisted.
9. **`GuideAssistantResponse` shape** — `{ summary_vi, content_vi,
   summary_en, content_en, ... }` consumed by `MercyTeacherTab`.

**Why a separate edge function.** `/ai-tutor` uses `guide-assistant`
too (see `./ai-tutor.md` §2 layer 1) — the function is shared. The
mode/tier/progressContext shape lets one function serve both surfaces
with different system prompts and depth gates.

### How the classifier decides

`classifyGuideInput.ts` produces a `GuideClassification` with `route:
'prewritten' | 'api_tutor' | 'speak_route' | 'fallback'`. The two
content paths above are dispatched on this route:

- `prewritten` → `resolveMercyGuideReply` hits the library, returns
  synchronously.
- `api_tutor` → `askMercyApi` hits the edge function.
- `speak_route` → not a content reply — `routeMercyMessage` returns a
  UI `action: 'open_speak'` and the panel switches tabs.
- `fallback` → calm Vietnamese "Mình chưa hiểu, bạn nói lại nhé"-class
  copy, no network call.

The classifier looks at: language signals (VN-character detection +
keyword list), intent keywords (e.g. `'sửa câu'`, `'pronounce'`,
`'phòng nào'`), and payload patterns (`/sentence: ...$/`-style
delimiters extract the user's example sentence for `check_writing` /
`grammar_correction` flows).

---

## 3. Key files and their roles

### Panel shell + chat surface

- **`MercyGuidePanel.tsx`** (~200 lines) — the dockable panel chrome:
  drag-to-reposition handle, close / fullscreen toggle, Mercy avatar
  with AVIF/WEBP/PNG fallback chain, surrounding gradient. Hosts
  `UnifiedMercyChat`. Pure shell; no business logic.
- **`UnifiedMercyChat.tsx`** (~400 lines) — the 5-tab surface
  (Teacher / Suggest / Speak / [Logic] / Guide). Manages tab state,
  the `panelOpen` flag, deep-link routing into a specific tab from
  query params, and the shared message-list state.
- **`MercyTeacherTab.tsx`** (~1730 lines, the heavyweight) — the main
  "talk to Mercy" tab. Runs the classifier → router pipeline, calls
  `askMercyApi` for `api_tutor` routes, renders the bilingual reply
  cards (summary + body in VI + EN), exposes the "next steps" chips,
  and handles the `suggestSpeak` nudge into the Speak tab.
- **`MercySpeakTab.tsx`** (~2280 lines, the other heavyweight) — the
  pronunciation flow. Handles the `speakViaTTS` chunking (Chrome
  `speechSynthesis` workaround), TTS playback for the Vietnamese
  helper voice, the per-word-chip click → speak interaction, and the
  long history of `[#XX]` debug markers a contributor will read in the
  source.
- **`MercySuggestTab.tsx`** (~65 lines) — the "what should I do next?"
  tab. Currently a thin surface; the suggestion logic lives in the
  classifier (`learning_path` mode) and reply library
  (`study_plan`-class records).
- **`MercyGuideTab.tsx`** (~180 lines) — the app-navigation /
  app-explanation tab (`app_intro`, `app_usage`, `room_usage` intents
  primarily).
- **`MercyEnglishTab.tsx`** — the English-helper tab (alternative
  entry to the `english_explain` mode).

### Classifier + router

- **`guideRoutingSpec.ts`** (~50 lines) — the canonical type enums:
  `GuideRoute`, `GuideSkillIntent`, `GuideTaskIntent`,
  `GuideClassification`. Everything downstream typechecks against
  these.
- **`classifyGuideInput.ts`** (~250 lines) — the classifier.
  `detectGuideLanguage` (VN signals → VI), `extractGuidePayload`
  (sentence/paragraph delimiters), `classifyGuideInput` (top-level
  intent → `GuideClassification`).
- **`logic/detectMercyIntent.ts`** — second-pass intent detector for
  the Teacher tab (greeting, explain, correct, pronunciation,
  toddler-policy, repair-policy).
- **`logic/routeMercyMessage.ts`** — `MercyRouteResult` resolver.
  Returns `{ intent, reply?, action?, apiMode? }`. The `action` field
  is what triggers the cross-tab UI switch (`'open_speak'`,
  `'open_english'`).
- **`logic/mercyPolicy.ts`** — bilingual policy replies for the
  pronunciation-repair flow + the toddler-mode guardrail (asking
  Mercy to "speak like a toddler" returns a calm Vietnamese refusal,
  not an attempt).

### Prewritten reply library

- **`mercyGuideReplyLibrary.ts`** (~230 lines) — the library itself.
  `MercyGuideReplyRecord` shape (`{ id, intent, language, userInput,
  payload?, roomId?, roomTitle? }`) — note that records can be
  room-scoped (`roomId` set) for context-aware replies. v5
  ("Knowledge Base Hardened") added the room-context overrides and the
  Vietnamese-specific phonology fast paths.
- **`resolveMercyGuideReply.ts`** (~95 lines) — the resolver: match
  input → record. Returns `ResolvedReply { text, language,
  suggestSpeak }`. The `suggestSpeak` field is what wires the
  cross-tab Speak nudge.

### Edge function entry

- **`api/askMercyApi.ts`** (~85 lines) — the single supabase-functions
  `invoke('guide-assistant', { body })` call site. Wraps the request
  in `MercyApiRequest { input, mode, roomId?, roomTitle?, tier?,
  pathSlug?, tags?, englishLevel?, learningGoal?, progressContext?
  }`. Returns `{ data: GuideAssistantResponse | null, error: Error |
  null }`.

### Hooks

- **`hooks/useAITutor.ts`** — query hook for the AI Tutor entry inside
  the panel (the in-panel surface; not the standalone `/ai-tutor`
  route).
- **`hooks/useEnglishHelper.ts`** — query hook for the English-helper
  tab.
- **`hooks/useMercyMemory.ts`** — reads `mercy_user_facts` (see §4
  invariants — read-only consumer of the semantic memory).

### Supporting

- **`mercyGuide.constants.ts`** — UI constants (panel widths, tab IDs).
- **`mercyGuide.utils.ts`** — utility helpers (text normalization,
  preview slicing).
- **`mercyGuideClient.ts`** — outer-layer client glue (panel
  state + lifecycle).
- **`shared.ts`** — image asset constants for the Mercy avatar plus
  the `GuideAssistantResponse` shape.
- **`copy/mercyCopy.ts`** — UI copy (button labels, status strings).
  Vietnamese-first per `voice-guidelines-vn.md`.
- **`wordChips.ts`** — the "word-chip" model for tap-to-pronounce
  interactions inside the Speak tab.
- **`kidsDataLoader.ts`** + `kids/kidPage*Data.ts` — kid-page data
  loaders. **Read-only from this surface.** The Mercy Guide does
  NOT render the kids flow today; the data files are loaded for an
  unrelated cross-link. Kids mode lives at `kids/*` routes (CC2
  lane); the panel never mounts there.

### Tests

- **`__tests__/MercyTeacherTab.disclosure.test.tsx`** — disclosure
  pattern coverage (collapse/expand of long replies).
- **`__tests__/MercySpeakTab.isPage3LessonKey.test.ts`** — kids
  page-3 audio-key detection (relevant only for the kids-data shared
  loader path, NOT for the panel).
- Logic-folder tests cover the intent detector and route resolver.

---

## 4. Public API / surface contracts

### `askMercyApi` request

```ts
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
  progressContext?: ProgressContext | null;
}
```

The `mode` is the contract — the edge function picks a different
system prompt per mode. `roomId` + `roomTitle` + `tags` let the model
ground replies in the current learning context. `progressContext` is
sent only when the chat layer's triggers permit it (the cooldown
prevents flooding the model with progress data every turn).

### `GuideAssistantResponse` (consumed by `MercyTeacherTab`)

```ts
interface GuideAssistantResponse {
  summary_vi: string;       // 1-line VI summary, always the lead
  content_vi: string;       // full VI body, optional structure
  summary_en?: string;      // 1-line EN summary (optional)
  content_en?: string;      // full EN body (optional)
  corrected?: string;       // grammar-fix output (when mode == 'english_explain')
  enhanced?: string;        // upgraded version of the user's sentence
  grammar_points?: string[];// bullet list
  practice?: string;        // suggested practice sentence
  next_steps?: Array<{ label_vi: string; label_en?: string; intent: string }>;
  follow_ups?: string[];    // chip suggestions
}
```

**Vietnamese-first.** `summary_vi` + `content_vi` are required; the EN
fields are optional secondary surface. A response without `summary_vi`
is treated as malformed.

### Classifier contract

```ts
interface GuideClassification {
  language: 'vi' | 'en';
  route: 'prewritten' | 'api_tutor' | 'speak_route' | 'fallback';
  skillIntent?: GuideSkillIntent;  // grammar | reading | … | speaking
  taskIntent?: GuideTaskIntent;    // explain_grammar_in_text | …
  hasPayload: boolean;
  payload?: string;                // extracted sentence / paragraph
}
```

The `route` discriminator is the dispatch key. Anything downstream
(library resolver, edge-fn caller, Speak-tab nudger) keys off it.

### Intent → reply contract

```ts
interface MercyGuideReplyRecord {
  id: string;
  intent: MercyGuideReplyIntent;
  language: 'vi' | 'en';
  userInput: string;       // canonical example user input that matches
  payload?: string;
  roomId?: string;         // room-context scope
  roomTitle?: string;
  reply: { vi: string; en?: string };
  suggestSpeak?: boolean;  // if true, panel nudges into Speak tab
}
```

Adding a new intent: add the discriminator to
`MercyGuideReplyIntent`, write the record(s) into the library,
update the classifier so the user-input patterns map to the new
intent. The TypeScript discriminated union catches missed-case
errors at compile time.

---

## 5. Invariants

### Crisis safety is non-negotiable

`containsCrisisKeywords` runs *before* the LLM in `guide-assistant`.
The keyword list covers VI + EN self-harm / medical-emergency
phrases. Hits return `SAFE_RESPONSE` (a Vietnamese-first calm
referral message). **Never bypass.** This guard was lost once in PR
#198 and restored from deployed prod v127 — the file header
`guide-assistant/index.ts` lines 9–24 carries that history note.

### No Mercy chat without a learning job

`STRATEGY.md` (V3 — Competitive thesis) explicit NOT-doing item. The Guide exists with
specific intents (ask / fix / speak / suggest / context). Adding a
generic "free chat" intent is a strategy edit, not a feature add.

### Vietnamese-first replies

`summary_vi` is required in `GuideAssistantResponse`. The reply
library's `language: 'vi'` records are the primary entries; `'en'`
records are translations of the same content, not independent
copy. `voice-guidelines-vn.md` is the source for tone.

### No `mercy_user_facts` writes from this surface

The Guide is a **read-only** consumer of `mercy_user_facts` via
`useMercyMemory`. The Teacher Mercy engine (`src/lib/teacher-mercy/*`)
is the only writer. The Guide can READ a memory fact (e.g. to
greet the learner by name); it must not write.

### Kids surface boundary

The Guide never mounts in any `/kids/*` route. The `kids/kidPage*Data.ts`
files in this directory are imported by a shared loader for an
unrelated cross-link; they do not turn the panel into a kid surface.
A future PR that mounts `MercyGuidePanel` inside a kids route
violates CLAUDE.md non-negotiable #2.

### Speak-tab dual-audio invariant (CLAUDE.md)

`MercySpeakTab` has two audio paths: pre-recorded ElevenLabs mp3 for
the historical kids flow + browser `speechSynthesis` for the adult
flow. The current panel mounts only the adult path. The chunking
helper (`speakViaTTS` + `chunkForTTS`) handles Chrome's silent drop
of utterances > ~250 chars / > ~15 s. Do NOT "simplify" it.

### Tier-aware response depth

`TierDepth` gating in `guide-assistant` is a budget mechanism, not a
quality mechanism. A free-tier user gets short replies (cost
control); a paid user gets longer ones. **Never** gate intent
availability by tier — every tier sees the same intents, just
different verbosity.

### Prewritten library does not call the network

The prewritten path is synchronous. A "library hit triggers a logging
fetch" change would break the panel's offline-friendliness (the
panel works without network for prewritten intents) and slow down
the perceived response time. Keep the library path zero-network.

---

## 6. Known gotchas / pitfalls

### `MercyTeacherTab.tsx` is ~1730 lines — the megafile

The panel's main tab is a single large file with embedded sub-components
(disclosure cards, follow-up chips, error states). It accreted over
multiple iterations. Two recurring traps:

- **Editing the classifier wiring without reading the file's
  `routeMercyMessage` → `MercyRouteResult` plumbing.** The same
  message can hit a library reply AND set a `suggestSpeak` AND queue
  a UI action — all three flow through the same return value.
- **Adding a new intent without updating the disclosure-collapse
  thresholds.** Long bilingual replies fold above a character
  budget; new intents that emit longer bodies need the threshold
  bumped or they look truncated.

### `MercySpeakTab.tsx` is ~2280 lines with `[#XX]` debug markers

The Speak tab carries `[#01]`, `[#02]`, … numbered debug-thread
markers in source. These are intentional breadcrumbs from a long
diagnostic session; they document the order in which the
`speechSynthesis` quirks were discovered. Do NOT remove them —
they are part of the file's debugging history and inform the
chunking logic. A future "cleanup" PR that strips them loses
context.

### The classifier is regex-driven and brittle to copy edits

VN-language detection in `detectGuideLanguage` is a keyword list
(`'mình'`, `'bạn'`, `'giúp'`, …). A user whose message contains
only English words but is replying to a Vietnamese prompt is
classified as `'en'`. The fix is the room-context override — pass
`roomTitle` + `tags`, which the API call uses to choose VI as a
tie-breaker. **Don't "fix" the classifier by piling more keywords.**

### `progressContext` injection has cooldown semantics

The cooldown lives in the chat layer (the caller of `askMercyApi`),
not in the edge function. The edge function unconditionally appends
the progress block when present. If the chat layer's cooldown is
miswired, every turn will ship `STUDENT_PROGRESS:` to the model and
the system prompt budget will balloon. Audit the trigger logic
before changing the field shape.

### `MercySuggestTab.tsx` is a thin shell — the suggestion logic is
elsewhere

The 65-line file is mostly chrome. Suggestion content comes from the
classifier's `learning_path` mode + the reply library's `study_plan`
records. A bug "Suggest tab returns wrong room" almost certainly
lives in the classifier or the library, not in the tab file.

### `MercyGuidePanel.tsx` is a chrome-only file — no business logic

Don't add classification, routing, or content logic to the panel
file. It's purely the dockable shell. New logic goes in
`UnifiedMercyChat.tsx` (cross-tab state) or in the relevant tab
file.

### Library duplicates the LLM contract for top-N intents

Editing a prewritten record changes the user-visible reply for that
intent — even when the LLM would have produced a better reply. If
you "improve" Mercy's reply for `greeting` by changing the library
record, the LLM never gets a chance to do the same job. Decide
deliberately: keep the intent in the library (curated voice) or
remove the record (let the LLM handle it).

### `useMercyMemory` is read-only — writes go through the Teacher
Mercy engine

A PR that adds `setMercyMemory` to this hook is a strategy edit. The
semantic-memory writer lives at `src/lib/teacher-mercy/memory.ts`.
Calling that from the Guide path would couple two surfaces that
`study-os-stage-3.md` "Study OS Summary Boundary" keeps deliberately separated (semantic person
memory vs. behavioral signal layer; see `study-os-stage-3.md` for
the Study OS Summary Boundary).

### The rate limit is per-IP, not per-user

`_shared/rateLimit.ts` keys on `getClientIP(req)`. Users behind the
same NAT (school, café, corporate VPN) share the 20 req/min budget.
The error surface is `429` → `aiDisabledResponse`. A "Mercy is
unresponsive" report from a school deployment is almost certainly
this, not a real outage.

---

## 7. Cross-references

- **`./ai-tutor.md`** — the standalone `/ai-tutor` route. Shares the
  `guide-assistant` edge function. Different system prompt + depth
  gating. The two surfaces coexist (Guide is in-context, AI Tutor is
  full-page).
- **`./study-os-stage-3.md`** — the Stage 3 Study OS. Stage 3A's
  `mercy_user_facts` invariant is the boundary the Guide must
  respect (read-only consumer).
- **`./billing-entitlement.md`** — tier gating on response depth
  consults the same entitlement derivation. Never gate on
  `profiles.tier` directly.
- **`../system-overview.md` §3** — Teacher Mercy engine high-level.
- **`../system-overview.md` §17** — Email lifecycle (Mercy's email
  voice is a separate but related surface).
- **`CLAUDE.md`** — "Mercy character / Speak tab dual invariant" is
  the canonical short reference; this doc is the long form.
- **`docs/voice-guidelines-vn.md`** — Vietnamese voice + tone rules.
- **`docs/ai-tutor/TUTOR_CONTRACT.md`** — the tutor-response shape
  contract; `guide-assistant` shares this surface.

---

## 8. How to extend this — checklist

When you add a new tab, intent, or reply path:

### Adding a new tab to the panel

1. Add the tab component file under `src/components/mercy-guide/`
   (follow the `MercyTeacherTab.tsx` / `MercySpeakTab.tsx` pattern,
   but **keep it under 500 lines** — split sub-components into
   sibling files).
2. Register the tab in `UnifiedMercyChat.tsx`'s tab list.
3. If the tab needs a new query hook, add it under
   `src/components/mercy-guide/hooks/`.
4. Add a `data-testid="mercy-guide-tab-<name>"` anchor for E2E /
   marketing-screenshot specs.
5. Do **NOT** wire the tab into any `/kids/*` route.
6. Confirm `npm run typecheck:ci` + `npm run lint` green.
7. Add at least one unit test under `__tests__/`.

### Adding a new intent (prewritten library path)

1. Add the discriminator to `MercyGuideReplyIntent` in
   `mercyGuideReplyLibrary.ts`.
2. Write the `MercyGuideReplyRecord` entries (VI + EN, plus
   room-scoped variants if needed).
3. Update `classifyGuideInput.ts` so the user-input patterns route
   to the new intent (and choose `route: 'prewritten'`).
4. Update `resolveMercyGuideReply.ts` if the match needs custom
   logic beyond the default keyword/regex resolver.
5. Smoke-test in the panel: type the canonical user inputs, confirm
   the right reply renders, confirm no network call fires (DevTools
   Network tab).

### Adding a new intent (LLM path via `guide-assistant`)

1. If a new `MercyApiMode` is needed, add it to the union in
   `askMercyApi.ts` AND in `supabase/functions/guide-assistant/index.ts`'s
   prompt selector. Both sides must agree.
2. Update `classifyGuideInput.ts` so the user-input patterns route to
   `'api_tutor'` with the right `skillIntent` / `taskIntent`.
3. If the new prompt needs a depth different from the existing
   tier-aware gate, decide whether to gate it (cost) or let it ride
   on the default budget.
4. Deploy the edge function (`supabase functions deploy
   guide-assistant`) — note that PR #669's edge-fn deploy pipeline
   is the in-flight way to do this in CI; ad-hoc deploys still work.
5. Run `vitest` + `playwright` on the surface specs that hit the
   tab.

### Adding a new safety keyword (crisis pre-gate)

1. Add the keyword to `CRISIS_KEYWORDS` in `guide-assistant/index.ts`.
2. **Add the Vietnamese translation** in the same edit. The list
   carries both EN + VI; an EN-only addition is a half-fix.
3. Deploy the function.
4. Smoke-test via the panel with the new phrase — confirm the
   short-circuit returns `SAFE_RESPONSE` and no LLM call fires.

### Modifying the tier-depth gate

1. The mapping is in `guide-assistant/index.ts`. Read `CURRENT-STATE.md`
   §15 + `./billing-entitlement.md` before changing it — tier
   semantics changes are billing/strategy edits.
2. The client side reads `tier` from the request body. Do not
   short-circuit on the client; the edge function is the
   authoritative gate.

### Removing a prewritten intent (delegating to the LLM)

1. Delete the record(s) from `mercyGuideReplyLibrary.ts`.
2. Update `classifyGuideInput.ts` so the input pattern routes to
   `'api_tutor'` with the right `MercyApiMode`.
3. Smoke-test: the same input that used to hit the library should
   now make a network call to `guide-assistant`.
4. Watch the cost dashboard for a week — top-N intents are the ones
   the library exists to absorb; moving them to the LLM increases
   per-day cost.

---

## 9. The two-line summary

The Mercy Guide is the floating in-room tutor panel; every user
message hits a classifier that dispatches to one of four routes
(prewritten library, `guide-assistant` edge function, Speak-tab UI
nudge, calm fallback). The hard rails are the crisis-keyword
pre-gate, the Vietnamese-first reply contract, the kids-boundary
(panel never mounts in `/kids/*`), and the `mercy_user_facts`
read-only contract.
