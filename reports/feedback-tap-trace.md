# Feedback-tap trace — Sửa câu "Có ích / Chưa ích" thumbs (A1)

**Symptom:** Chau tapped 👍 (Có ích) on the Sửa câu grammar-fix widget at
`mercyblade.com/ai-tutor` and reports it "not working."

**Bottom line:** the wire in **code** is correct and IS connected to the sink path.
The reason nothing lands in `learning_events` is that the **durable sink is
disabled in the live web bundle** — `VITE_LEARNING_EVENT_SINK_ENABLED` is baked
**false**, so `main.tsx` never creates/starts the sink, so every tap queues to
localStorage and **never drains to Supabase**. This is silent (no UI signal).
Trace only — no fixes pushed.

---

## 1. Component that renders the Có ích / Chưa ích buttons
- **File:** `src/components/ai-tutor/CorrectionFeedbackButtons.tsx`
  - `Có ích` (👍) button: **line 102** (`onClick` → `vote("helpful")`, line 94)
  - `Chưa ích` (👎) button: **line 117** (`onClick` → `vote("not_helpful")`, line 109)
- **Rendered by (the Sửa câu surface):** `src/components/ai-tutor/CorrectionMode.tsx:310`
  passing `ruleOrDetectorId={correctionRuleId}` (line 311).
  - `correctionRuleId` resolved at `CorrectionMode.tsx:85`:
    `registerTag ?? detectorHint?.tag ?? null`. Null → the component returns
    `null` and **no buttons render** (`CorrectionFeedbackButtons.tsx:59`). Chau
    seeing/tapping the buttons means a non-null id was present.

## 2. Does the tap handler write to the learning_events sink? — YES (wired), via a different module than named
- Tap handler `vote(next)` — `CorrectionFeedbackButtons.tsx:61–74`. It calls
  `record({...})`, where `record` defaults to **`recordLearningEvent`**
  (`src/lib/tutor/learningEvents.ts:121`), imported at
  `CorrectionFeedbackButtons.tsx:26`.
- **There is NO `correctionFeedback.ts` file** (the task's premise). The real
  path is:
  `vote()` → `recordLearningEvent()` (learningEvents.ts:121) → append + prune →
  `writeStoredEvents()` (localStorage queue) → **drained by**
  `src/lib/learning/eventSink.ts` `flush()` → `supabase.from("learning_events").insert()`.
- `rule_or_detector_id` is carried end-to-end: passed as `ruleOrDetectorId`
  (CorrectionFeedbackButtons.tsx:70) and mapped to the row at
  `eventSink.ts:97`. The UI hard-gates on it (returns null without an id,
  line 59), so it is effectively non-optional at the surface — matching the DB
  CHECK constraint.
- **So the button IS wired to the sink path.** The failure is not the wiring;
  it is the sink being disabled (§ root cause).

## 3. Which surfaces are actually wired to the sink
| Surface | File | Renders feedback buttons? | Wired to sink? |
|---|---|---|---|
| **Sửa câu (grammar-fix / CorrectionMode)** | `src/components/ai-tutor/CorrectionMode.tsx:310` | **Yes** | **Yes** (via recordLearningEvent) |
| Tutor CHAT / conversation | `src/components/ai-tutor/ConversationMode.tsx`, `src/components/ai-tutor/conversation/AiConversationScenarioPanel.tsx` | **No** | **No** |
| (anywhere else) | — | `CorrectionFeedbackButtons` is imported ONLY by `CorrectionMode.tsx` | — |

`CorrectionFeedbackButtons` has exactly one non-test importer: `CorrectionMode.tsx`.
The chat/conversation surfaces contain **no** `CorrectionFeedbackButtons` and no
`feedback_helpful` / `feedback_not_helpful` producer. **Only the Sửa câu surface
is wired.**

## 4. localStorage dedupe — can a prior vote silently swallow the tap?
- **No localStorage content-dedupe exists.** `pruneEvents`
  (`learningEvents.ts:317–327`) filters by **age** (`maxAgeDays`) and caps by
  **count** (`slice(-maxEvents)`) only — it never dedupes by event content, so a
  distinct vote is never silently dropped from the queue.
- The only "one vote" gate is **in-memory, per component instance**:
  `CorrectionFeedbackButtons.tsx:64` `if (choice) return;`. After the first tap
  the pair **locks** (buttons `disabled`, lines 93 & 108) and the chosen button
  changes color (emerald/rose). This is intended one-vote-per-correction and is
  **visible** (disabled + color), not a silent swallow. It resets when the
  component remounts (a new correction).
- Caveat on visibility: the only *textual* "recorded" confirmation is
  `sr-only` (`CorrectionFeedbackButtons.tsx:121`) — invisible to sighted users.
  So the sole sighted feedback is the color/disabled change; a user may read that
  as "nothing happened."

## 5. Auth requirement + failure behavior (silent or visible?)
- **Requires an authenticated session.** `eventSink.ts` `flush()` calls
  `getUserId()` (`defaultGetUserId`, lines 110–118 → `supabase.auth.getUser()`).
  **Signed out → `{ flushed: 0, skipped: "signed_out" }` (line 171)** — the event
  stays queued and is **never inserted**.
- **Failure is silent.** On insert error → `backoff()` + keep queued + retry
  (lines 175–178). If the flag is off → `skipped: "disabled"` (line 161). None of
  these surface to the UI — the sink runs on a background `setInterval`
  (lines 199–200), fully decoupled from the tap. The tap always updates the button
  locally regardless of the DB outcome.

## ROOT CAUSE — the sink is disabled in the live web bundle
`main.tsx:706–709` only starts the sink when the flag is on:
```
if (isLearningEventSinkEnabled()) {   // VITE_LEARNING_EVENT_SINK_ENABLED === "true"
  const learningEventSink = createLearningEventSink();  // 707
  learningEventSink.start();                            // 708
}
```
`isLearningEventSinkEnabled()` (`eventSink.ts:68–74`) returns
`import.meta.env.VITE_LEARNING_EVENT_SINK_ENABLED === "true"`, baked at **build**.

**In the CURRENT live bundle (`/assets/index-Dys1ZTp7.js`) the flag is baked
FALSE:** the string `VITE_LEARNING_EVENT_SINK_ENABLED)==="true"` appears
**unreplaced** — had it been baked `"true"`, Vite would have inlined
`"true"==="true"` and the minifier folded it away; its survival means the value
resolves to `undefined` → `false`. So on prod: `isLearningEventSinkEnabled()` is
false → **no sink object, no timer** (main.tsx guard never entered) → taps queue
to localStorage and **never drain**. Every 👍/👎 is recorded locally and lost.

(Auth §5 is moot until the flag is on — the sink never starts to even check auth.)

## Verification commands
Live-bundle flag (the root cause) — prints `SINK DISABLED IN PROD` if the flag is
baked false:
```sh
JS=$(curl -s https://mercyblade.com/ | grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' | head -1)
curl -s "https://mercyblade.com$JS" \
  | grep -q 'VITE_LEARNING_EVENT_SINK_ENABLED)==="true"' \
  && echo "SINK DISABLED IN PROD (flag baked false → sink never starts)" \
  || echo "flag folded away — check whether it baked true"
```
Code-level wiring (confirms the surface is correctly connected):
```sh
grep -n "CorrectionFeedbackButtons" src/components/ai-tutor/CorrectionMode.tsx   # render site: line 310
grep -n "recordLearningEvent" src/components/ai-tutor/CorrectionFeedbackButtons.tsx  # writes via the queue: line 26/66
grep -n "isLearningEventSinkEnabled" src/main.tsx                                # sink gate: line 706
grep -rn "CorrectionFeedbackButtons" src/components/ai-tutor/ConversationMode.tsx || echo "chat surface: NOT wired"
```

## Fix directions (NOT applied — trace only)
1. **Primary:** bake `VITE_LEARNING_EVENT_SINK_ENABLED=true` into the **Cloudflare
   Pages web build** and redeploy (this is the web bundle, separate from the edge
   functions). Until then feedback cannot reach `learning_events` from prod
   regardless of correct wiring or an authed session.
2. Secondary (UX, optional): the post-tap confirmation is `sr-only`
   (CorrectionFeedbackButtons.tsx:121); consider a visible "Đã ghi nhận" so a tap
   reads as acknowledged.
3. Note (coverage): only the Sửa câu surface is wired; the chat surface is not —
   confirm that's intended.
