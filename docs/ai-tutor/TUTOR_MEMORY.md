# AI Tutor M4 — Supabase Summary-Memory Contract

> **Document type:** Contract (planning-only — no sync authorized)
> **Date:** 2026-05-23
> **Author:** A2 — AI Tutor Foundation Contracts Owner
> **Status:** M4 safe summary-memory contract defined. No raw sync. No implementation authorized.

---

## 1. Scope

M4 defines the contract for uploading **aggregate-only** memory summaries to Supabase. No raw correction records, sentence text, PII, JWT payloads, or conversation history may leave the client.

---

## 2. What MAY Be Synced (Allowlist)

| Field | Type | Rationale |
|---|---|---|
| `totalCorrections` | `number` | Aggregate count — no text |
| `practicedCount` | `number` | Aggregate count |
| `strongestTopic` | `string` | Topic tag only — no sentence |
| `strongestTopicCount` | `number` | Count for topic |
| `topicNeedingReview` | `string` | Topic tag only |
| `topicNeedingReviewCount` | `number` | Count for topic |
| `lastPracticedTopic` | `string` | Topic tag only |
| `lastPracticedAt` | `number \| null` | Unix ms timestamp |
| `suggestedNextFocus` | `string` | Topic tag only |
| `syncedAt` | `number` | Unix ms of sync operation |
| `userId` | `string` (opaque UUID) | Required for row ownership — never exposed to provider |

All fields above are aggregate counts, topic tags, or timestamps. Zero raw text.

---

## 3. What MUST NEVER Be Synced (Denylist)

| Data | Reason |
|---|---|
| Raw `original` sentence text | Learner PII / private content |
| Raw `corrected` sentence text | Learner PII / private content |
| Full `CorrectionRecord[]` array | Contains raw text |
| JWT payloads or user claims | Auth secret |
| `profiles` table PII (email, phone, name) | PII |
| Placement scores or answers | Placement V3/V5 boundary |
| Conversation history | Private learner data |
| `CorrectionRecord.id` values | Internal ID — use opaque sync IDs |
| `cefr` level string | Redundant with topic — omit for safety |

---

## 4. Table Schema (Planning Draft)

```sql
CREATE TABLE IF NOT EXISTS tutor_memory_summaries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  payload     JSONB NOT NULL,
  synced_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE tutor_memory_summaries ENABLE ROW LEVEL SECURITY;

-- User can only read/write their own summary
CREATE POLICY "user_own_summary"
  ON tutor_memory_summaries
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

The `payload` column stores the JSON-serialized `MemorySummary` (allowlist fields only). Raw text fields are stripped client-side before upload.

---

## 5. Sync Protocol

1. Client calls `getMemorySummary()` → receives `MemorySummary`
2. Client strips any raw-text fields (already done by `getMemorySummary`)
3. Client calls Supabase `upsert` on `tutor_memory_summaries`
4. Server validates payload shape (no raw text fields present)
5. On read: client fetches summary, merges with local `getMemorySummary()` for freshness

Sync is triggered:
- After practice submission (debounced, 30s)
- On AiTutor page mount (fetch remote summary)
- Never during active provider call

---

## 6. Hard Blockers

| Blocker | Status |
|---|---|
| Raw text sync | BLOCKED |
| Full transcript sync | BLOCKED |
| Placement answer sync | BLOCKED |
| JWT / user claims in payload | BLOCKED |
| Sync during provider call | BLOCKED |
| Real provider execution | BLOCKED |

---

## 7. Authorization

No implementation authorized by this document. Sync requires:
- A1 authorization
- A7 safety/privacy review
- Supabase table + RLS migration approved
- `profiles` table foreign key validated
- Client-side strip-before-upload verified

---

Real provider execution remains BLOCKED.
