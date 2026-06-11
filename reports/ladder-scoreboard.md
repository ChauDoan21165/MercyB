# 20-Step Ladder — Scoreboard

Tracks formal CLOSED entries for the ladder in `STRATEGY.md`. Each entry
requires: code path evidence, prod-build trace (or equivalent reachability
check), and a telemetry signal for the hand-off.

---

## Step 9 — Conversation pivots on what the learner said

**Status:** CLOSED  
**Closed:** 2026-06-11  
**Closed by:** A2 (formal closure pass)

### DONE-WHEN check

**1. Seed flow reachable in prod**

The correction→conversation seed hand-off is live on the current `main` build.
Code path:

| # | File | Lines | What happens |
|---|------|-------|--------------|
| 1 | `src/pages/AiTutor.tsx` | 2074 | Grammar surface calls `setLatestCorrectedSeed({ correctedSentence: aiCorrected, sourceText: trimmed, updatedAt: Date.now() })` when the AI returns a corrected sentence |
| 2 | `src/pages/AiTutor.tsx` | 2666 | `correctionSeed={latestCorrectedSeed}` passed to `<AiConversationScenarioPanel>` |
| 3 | `src/components/ai-tutor/conversation/AiConversationScenarioPanel.tsx` | 113–114 | Seed extracted: `seedSentence = correctionSeed?.correctedSentence?.trim()`, `seedStamp = correctionSeed?.updatedAt` |
| 4 | `src/components/ai-tutor/conversation/AiConversationScenarioPanel.tsx` | 115–125 | `useEffect` keyed on `[seedSentence, seedStamp]` → switches to `LEARNER_LED_AI_CONVERSATION_SCENARIO_ID`, pre-fills input with corrected sentence, bumps `sessionEpoch` |
| 5 | `src/components/ai-tutor/conversation/AiConversationScenarioPanel.tsx` | 82–106 | `sessionEpoch` bump triggers the telemetry effect: `endTelemetrySession` on prior session, `beginTelemetrySession` with `scenarioId: "learner-led"` |

**2. Correction context carried into the seeded conversation**

The `seedSentence` (the AI-corrected version of the learner's original text) is
written directly into the `input` state via `setInput(seedSentence)`. When the
learner sends their first turn, `learnerText = input.trim()` (line ~138) is the
corrected sentence verbatim — Mercy replies to it live with no canned opener
(the "learner-led" scenario has no preset `openerText`; see
`src/lib/ai-conversation/scenarios.ts:74–112`).

The original (uncorrected) source is retained on the seed object
(`correctionSeed.sourceText`) but is not pre-filled — the learner speaks their
corrected sentence first.

### Telemetry

**Before this MR:** The telemetry adapter (`conversationTelemetry.ts`) recorded
a new "learner-led" session starting (via `beginTelemetrySession` with
`scenarioId: "learner-led"`) but had no event that explicitly recorded the
correction→conversation hand-off. A user switching manually to the learner-led
scenario was indistinguishable from a seed-triggered switch.

**Gap filled (this MR):** `AiConversationScenarioPanel.tsx` now fires:

```typescript
void emitFeatureOutcome("correction_seed_handoff", "engaged", {
  scenario: LEARNER_LED_AI_CONVERSATION_SCENARIO_ID,
});
```

inside the seed `useEffect`, immediately after the session epoch bump.

Gate: `emitFeatureOutcome` is consent-gated by (a) requiring an authenticated
user (`supabase.auth.getUser()`) and (b) the `RETENTION_OUTCOME_EVENTS` DB
feature flag (ships dark). Rows land in `public.feature_outcome_events` with
`feature_key = "correction_seed_handoff"` and `event = "engaged"`.

This event distinguishes seed-triggered learner-led sessions from
manually-switched ones and gives the D1/D7 analysis a first-party signal for
Step 9's activation rate.

### Evidence summary

- Code path: `AiTutor.tsx:2074` → `AiTutor.tsx:2666` → `AiConversationScenarioPanel.tsx:113–125`
- Telemetry: `feature_outcome_events` row with `feature_key = "correction_seed_handoff"` (dark until flag ON)
- STRATEGY.md ladder: Step 9 updated from `PLANNED` → `CLOSED`
