# Data-Flywheel Loop — Monthly Mining Cycle

_Owner: C2 lane | Last updated: 2026-06-11 (A3, first-cycle run)_

---

## What this document covers

1. How the C2 conversation-capture pipeline works end-to-end.
2. The verified production state as of 2026-06-11 (first-cycle run).
3. The monthly mining loop design: captured errors → interference candidates → guard queue → live rules.
4. Runbook for executing each cycle manually until the loop is automated.

---

## 1. Pipeline architecture

```
[User consents]  →  mb-capture-consent=true (localStorage)
        ↓
AiConversationScenarioPanel
   beginTelemetrySession(userId, scenarioId)       # conversationTelemetry.ts:117
        ↓
   hasCaptureConsent() → true                      # captureConsent.ts:24
        ↓
   startSession(userId, themeId)                   # conversationCapture.ts:89
   → INSERT INTO public.conversations (id, user_id, theme_id, started_at)
        ↓
   per turn: recordTelemetryTurn(session, {errors, corrections})
        ↓
   logTurn(sessionId, turnNumber, learnerInput, aiResponse, errors, corrections)
   → INSERT INTO public.conversation_events (bulk rows per turn):
       · turn_completed    — learner_input + ai_response
       · error_detected    — one row per CapturedError in errors[]
       · correction_accepted / correction_rejected — one row per CapturedCorrection
        ↓
   endTelemetrySession(session, summary)
   → UPDATE public.conversations SET ended_at, turn_count, errors_detected,
       corrections_accepted, summary
```

**Consent contract** (`captureConsent.ts:4-12`):
- `hasCaptureConsent()` returns `false` by default (no stored choice = no capture).
- The `<ConsentModal />` component sets `mb-capture-consent=true|false` in localStorage on explicit learner decision.
- `conversationTelemetry.ts` re-checks consent on **every write** (start, each turn, end), so a mid-session revoke stops capture immediately.
- If consent is absent, `sessionId` is `null` and all capture calls no-op silently — the conversation is never affected.

**Fail-silent contract** (`conversationCapture.ts:19-27`):
- Every Supabase call is wrapped in try/catch with no re-throw.
- A dropped record is acceptable; a broken conversation is not.

**RLS contract** (`20260716000000_conversation_capture.sql`):
- `conversations`: self-owned (INSERT/SELECT/UPDATE own rows only, by `user_id = auth.uid()`).
- `conversation_events`: self-owned via parent FK join.
- Service-role bypasses RLS for analytics reads (the mining loop uses service-role).

---

## 2. Production state — first-cycle verification (2026-06-11)

### REST probes (service-role, read-only)

| Table | Probe result | Conclusion |
|---|---|---|
| `public.conversations` | HTTP 404 / PGRST205 | **Does not exist in prod** |
| `public.conversation_events` | HTTP 404 / PGRST205 | **Does not exist in prod** |
| `public.mercy_conversations` | HTTP 200 / content-range: */0 | Exists, 0 rows (different table — MercyGuide AI chat threads, not C2) |
| `public.learner_interaction_capture` | HTTP 404 / PGRST205 | Does not exist in prod (Track-2, separate) |
| `public.feature_outcome_events` | HTTP 200 / 5 rows (all `retention_loop`) | Exists, no AI-conversation events |

### Why the tables don't exist

Migration `supabase/migrations/20260716000000_conversation_capture.sql` is **dated 2026-07-16** — ~5 weeks ahead of today. The file exists in the repo but has not been applied to the live database. Per CLAUDE.md, migrations require human review and manual SQL Editor application (`supabase db p[u]sh` is never used).

### Why no sessions would exist even if the tables existed

`ConsentModal` (`src/components/ConsentModal.tsx:33`) is **defined but not mounted anywhere** in the app. No user can have `mb-capture-consent=true` in localStorage because the modal that sets it is never rendered. With `hasCaptureConsent()` returning `false` for all users, `beginTelemetrySession` always produces `sessionId=null`, and `logTurn` / `endSession` are never called.

### Code-level consent gate — pinned locations

| Gate | File | Line | Behavior |
|---|---|---|---|
| `hasCaptureConsent()` check at session start | `conversationTelemetry.ts` | 123 | `sessionId=null` if false → all subsequent writes are no-ops |
| `hasCaptureConsent()` check per turn | `conversationTelemetry.ts` | 162 | Even if session exists, turns skip capture after mid-session revoke |
| `hasCaptureConsent()` check at session end | `conversationTelemetry.ts` | 194 | Rollup write skipped without consent |
| Modal sets flag | `ConsentModal.tsx` | 25 (`setCaptureConsent`) | Only entry point to set `mb-capture-consent=true` |

### First-cycle result: N=0

**Conversations captured in prod: 0.** No error events, no correction events. Empty state.

The pipeline code is correct — consent gate and fail-silent behavior verified by code inspection and test suite (`src/lib/conversationCapture/__tests__/`). The empty state is caused by two infrastructure blockers, not a code bug.

---

## 3. Blockers to first real data

| # | Blocker | Action required | Owner |
|---|---|---|---|
| B1 | Migration not applied | Apply `20260716000000_conversation_capture.sql` via Supabase SQL Editor (human review + manual apply per CLAUDE.md) | Chau / C2 lane |
| B2 | ConsentModal not mounted | Mount `<ConsentModal />` in the AI conversation flow — show when `!hasCaptureConsentDecision()` — so users can opt in | Lane A |

Neither blocker requires changing the capture or telemetry code. The pipeline is ready; it is waiting for the DB and the UI gate.

---

## 4. Monthly mining loop design

Once B1 and B2 are cleared and sessions accumulate, run this loop on the first Monday of each month.

### Stage 1 — Harvest raw errors

**Input:** `public.conversation_events` (service-role, read-only).

**Query:**

```sql
SELECT
  ce.error_details ->> 'errorType'           AS error_type,
  ce.error_details ->> 'learnerText'         AS learner_text,
  ce.error_details ->> 'correctedText'       AS corrected_text,
  ce.error_details ->> 'explanation'         AS explanation,
  ce.created_at,
  c.theme_id,
  c.user_id
FROM public.conversation_events ce
JOIN public.conversations c ON c.id = ce.conversation_id
WHERE ce.event_type = 'error_detected'
  AND ce.created_at >= now() - interval '30 days'
ORDER BY ce.created_at DESC;
```

Also pull correction acceptance rates:

```sql
SELECT
  ce.error_details ->> 'errorType'           AS error_type,
  COUNT(*) FILTER (WHERE ce.event_type = 'correction_accepted')  AS accepted,
  COUNT(*) FILTER (WHERE ce.event_type = 'correction_rejected')  AS rejected
FROM public.conversation_events ce
WHERE ce.event_type IN ('correction_accepted', 'correction_rejected')
  AND ce.created_at >= now() - interval '30 days'
GROUP BY error_type
ORDER BY (accepted + rejected) DESC;
```

### Stage 2 — Candidate extraction

**Frequency threshold: ≥5 distinct learner texts** for the same `error_type` within the window. Below this threshold: file in the "watch list" but don't promote to candidates.

Candidate record (one per `error_type`):

```
error_type:         <string>
occurrences:        <N>
unique_learners:    <M>   ← important: 1 learner × 100 turns is noise; 5 learners × 1 turn is signal
acceptance_rate:    <corrected / total corrections for this type>
sample_errors:      up to 3 representative (learner_text, corrected_text) pairs
theme_distribution: top 3 theme_ids where this error appeared
```

Reject candidates where `unique_learners < 3` regardless of total count.

### Stage 3 — Guard queue

For each candidate, check whether an interference rule already covers it:

```bash
grep -r "error_type_string" src/lib/interference/ src/lib/tutor/
```

If a rule exists: mark `already_covered`. If only partially covered: mark `gap`.

Queue output: a CSV/markdown table with columns:
`error_type | occurrences | unique_learners | acceptance_rate | coverage_status | action`

Where `action` is one of:
- `SKIP` — already covered, acceptance rate ≥ 50%
- `TUNE` — rule exists but acceptance rate < 40% (rule may be wrong or confusingly explained)
- `NEW` — no rule, occurrences ≥ 5, unique_learners ≥ 3 → promote to authoring queue
- `WATCH` — occurrences 3-4 or unique_learners 2 → wait for next cycle

### Stage 4 — Live rules

For each `NEW` candidate:

1. Author a new interference pattern entry in the appropriate `src/lib/interference/` module or lesson `.ts` file.
2. Add at least 2 example pairs (learner text → corrected text) from the `sample_errors`.
3. Write a unit test in the adjacent `__tests__/` directory.
4. Open a small PR (one interference pattern per PR is preferred for reviewability).
5. On merge, the lesson sync pipeline auto-publishes to prod (per `project_lessons_autosync_prod.md` memory — `.ts` merges auto-sync via `sync-lessons.yml`).

For each `TUNE` candidate: open a PR to update the existing rule's explanation text or example pairs. Target: acceptance rate ≥ 50% in the next cycle.

---

## 5. Monthly cadence

| Day | Action |
|---|---|
| Cycle day 1 (first Monday) | Run Stage 1 SQL queries against prod (read-only, service-role). Export to `/private/tmp/flywheel-YYYY-MM.csv`. |
| Cycle day 1-2 | Run Stage 2 candidate extraction (script or manual pivot). |
| Cycle day 2-3 | Run Stage 3 guard-queue check. Publish markdown table to `/private/tmp/flywheel-guard-YYYY-MM.md`. |
| Cycle day 3-7 | Author `NEW` PRs. Tune `TUNE` entries. |
| End of cycle | Append cycle summary to this doc under §6. |

---

## 6. Cycle log

### Cycle 2026-06 (first cycle — 2026-06-11)

**Run by:** A3 (headless)  
**Window:** N/A (no data)  
**Stage 1 result:** 0 rows — `public.conversations` and `public.conversation_events` do not exist in prod.  
**Candidates promoted:** 0  
**Guard-queue entries:** 0  
**PRs opened:** 0 (this design doc only)  
**Status:** Empty-state documented. Pipeline blocked by B1 (migration) + B2 (consent modal not mounted). No mining possible until both blockers are cleared. Verify by re-running Stage 1 query after B1+B2 land.

**Next cycle trigger:** After B1 is applied and B2 is merged. Re-run Stage 1 to confirm rows exist before scheduling the first real mining cycle.
