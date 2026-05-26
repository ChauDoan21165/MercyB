# V5-004 Persistence Schema Plan

> Discovery draft — C2/C7 review required before implementation.
> No implementation until C1 explicitly approves V5-004 build PR.
> Schema design only. Preserves V5 feature flag disabled-by-default.

**Author:** C3 — V5 Product / UX Builder
**Date:** 2026-05-21
**Baseline:** origin/main `299ce6398` (V5-002 feature flag + harness skeleton landed)
**V4 baseline:** V4 stack complete (#968 + #988 + #989 + #991)

---

## 1. Proposed Files

### 1.1 Supabase Migrations

| File | Purpose |
|------|---------|
| `supabase/migrations/20260628000000_v5_learner_memory.sql` | `v4_learner_memory` table + indexes + RLS |
| `supabase/migrations/20260628000001_v5_telemetry_events.sql` | `v4_telemetry_events` append-only event log + RLS |
| `supabase/migrations/20260628000002_v5_orchestration_snapshots.sql` | `v4_orchestration_snapshots` FULL/COMPACT snapshots + RLS |
| `supabase/migrations/20260628000003_v5_provider_decisions.sql` | `v4_provider_decisions` decision records + RLS |
| `supabase/migrations/20260628000004_v5_curriculum_plans.sql` | `v4_curriculum_plans` generated plans + RLS |
| `supabase/migrations/20260628000005_v5_admin_views.sql` | Admin read-all views for C5 dashboard |

### 1.2 Application Code

| File | Purpose |
|------|---------|
| `src/lib/placement/v5/persistence.ts` | Typed Supabase client helpers for all 5 tables. All writes gated behind `V5_ENABLED`. |
| `src/lib/placement/v5/persistenceTypes.ts` | TypeScript types mirroring Postgres row shapes |
| `src/lib/placement/v5/__tests__/persistence.test.ts` | Unit tests for serialization round-trips, idempotency, RLS simulation |
| `src/lib/placement/v5/index.ts` | Updated barrel — add persistence exports (feature-gated) |

### 1.3 Documentation

| File | Purpose |
|------|---------|
| `docs/placement/v5/V5_PERSISTENCE_SCHEMA.md` | This document — consolidated schema reference |

---

## 2. Schema Purpose — Per Table

### 2.1 `v4_learner_memory`

**Purpose:** Store one serialized `LearnerMemory` per learner. This is the source of truth for longitudinal placement state — CEFR timeline, skill trends, lesson mastery, snapshots, and the append-only event log.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid primary key default gen_random_uuid()` | Row identifier |
| `user_id` | `uuid not null references auth.users(id)` | Owner — RLS scoping column |
| `learner_key` | `text not null` | Opaque learner identifier (FNV-1a hash of profile id) |
| `schema_version` | `text not null` | `placement-v4-learner-memory-v1` — schema version check on read |
| `payload` | `jsonb not null` | Serialized `LearnerMemory` (canonical JSON via `serializeLearnerMemory`) |
| `content_hash` | `text not null` | `fingerprintLearnerMemory(payload)` — cache invalidation + integrity |
| `event_count` | `integer not null default 0` | Number of events in the memory log — quick staleness check |
| `created_at` | `timestamptz not null default now()` | Row creation |
| `updated_at` | `timestamptz not null default now()` | Last write |

**Constraints:**
- `unique(user_id)` — one memory row per user
- `check (schema_version = 'placement-v4-learner-memory-v1')` — version guard
- `check (char_length(learner_key) <= 128)` — key length cap

**Idempotency:** Upsert on `user_id`. Writes use `content_hash` to skip no-op updates.

**RLS:**
- `using (auth.uid() = user_id)` — user reads/writes own memory
- Admin view: `using (get_admin_level(auth.uid()) >= 9)` — read all

### 2.2 `v4_telemetry_events`

**Purpose:** Append-only event log for all V4 telemetry events. Feeds aggregation, cohort analysis, and replay. Each row is one `TelemetryEvent`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid primary key default gen_random_uuid()` | Row identifier |
| `user_id` | `uuid not null references auth.users(id)` | Owner — RLS scoping column |
| `event_id` | `text not null` | Stable event identifier (`evt_<fnv1a-hash>`) — idempotency key |
| `event_type` | `text not null` | `TelemetryEventType` — lesson_start, lesson_complete, etc. |
| `occurred_at` | `timestamptz not null` | When the event happened (from `IngestionContext.nowMs`) |
| `session_id` | `text` | Opaque session identifier |
| `payload` | `jsonb not null` | Full `TelemetryEvent` serialized via `canonicalJSON` |
| `created_at` | `timestamptz not null default now()` | Row insertion time |

**Constraints:**
- `unique(user_id, event_id)` — idempotency: same event_id for same user = no-op
- `check (char_length(event_id) <= 128)` — event id length cap

**RLS:**
- `using (auth.uid() = user_id)` — user reads/writes own events
- Admin view: `using (get_admin_level(auth.uid()) >= 9)` — read all

**Retention:** Events older than 2 years (per `DEFAULT_EVENT_RETENTION_DAYS`) may be pruned. Pruning is handled by `pruneMemory()` in V4, not by a Postgres cron. The V4 pruning function emits a `memory_pruned` event in the log to preserve the audit trail.

### 2.3 `v4_orchestration_snapshots`

**Purpose:** Periodic FULL/COMPACT snapshots of `OrchestratorState`. Used for cross-device merge, offline sync, and replay verification. Each row is one `OrchestrationSnapshotFull` or `OrchestrationSnapshotCompact`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid primary key default gen_random_uuid()` | Row identifier |
| `user_id` | `uuid not null references auth.users(id)` | Owner — RLS scoping column |
| `snapshot_id` | `text not null` | Stable snapshot identifier |
| `snapshot_type` | `text not null check (snapshot_type in ('FULL', 'COMPACT'))` | FULL or COMPACT |
| `schema_version` | `text not null` | `placement-v4-orchestrator-v1` |
| `content_hash` | `text not null` | `snapshotContentHash(snapshot)` — integrity check |
| `payload` | `jsonb not null` | Serialized snapshot (canonical JSON) |
| `device_id` | `text` | Opaque device identifier (for cross-device merge) |
| `vector_clock` | `jsonb` | `VectorClock` — `{ [deviceId]: sequence }` |
| `event_count` | `integer not null default 0` | Number of events covered by this snapshot |
| `created_at` | `timestamptz not null default now()` | Snapshot time |

**Constraints:**
- `unique(user_id, snapshot_id)` — one snapshot per id per user
- `check (char_length(snapshot_id) <= 256)` — id length cap

**RLS:**
- `using (auth.uid() = user_id)` — user reads/writes own snapshots
- Admin view: `using (get_admin_level(auth.uid()) >= 9)` — read all

**Compact rebuild:** When a COMPACT snapshot is read and a FULL is needed, use `rebuildFullFromCompact(compact, eventLog)` — the event log is replayed to reconstruct the FULL snapshot. This is handled in the V5 persistence client, not in SQL.

### 2.4 `v4_provider_decisions`

**Purpose:** Audit trail for every provider selection decision. Each row is one `PlacementV4ProviderDecisionRecord`. Read-only for learners; admin dashboard consumes these for provider health monitoring.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid primary key default gen_random_uuid()` | Row identifier |
| `user_id` | `uuid not null references auth.users(id)` | Owner — RLS scoping column |
| `decision_id` | `text not null` | `hashProviderDecisionRecord(record)` — idempotency key |
| `capability` | `text not null` | `PlacementV4ProviderCapability` |
| `status` | `text not null check (status in ('selected', 'blocked'))` | Selection outcome |
| `selected_provider_id` | `text` | Provider selected, or null if blocked |
| `boundary_mode` | `text not null` | `PlacementV4BoundaryMode` — local/validation/staging/production |
| `trust_score` | `integer` | Total trust score (0–100) |
| `cost_estimate_cents` | `integer` | Estimated cost in cents |
| `rejection_reasons` | `jsonb` | Array of `PlacementV4FailoverReason` |
| `payload` | `jsonb not null` | Full `PlacementV4ProviderDecisionRecord` (redacted — no secrets) |
| `created_at` | `timestamptz not null default now()` | Decision time |

**Constraints:**
- `unique(decision_id)` — idempotency: same decision hash = no-op
- `check (char_length(decision_id) <= 64)` — hash length cap

**RLS:**
- `using (auth.uid() = user_id)` — user reads own decisions (rare — mostly admin)
- Admin view: `using (get_admin_level(auth.uid()) >= 9)` — read all

**Secrets redaction:** The `payload` column never contains API keys, tokens, or credentials. Redaction happens in V4 via `redactSecrets()` before serialization. The migration enforces this with a `check` constraint that rejects known secret patterns.

### 2.5 `v4_curriculum_plans`

**Purpose:** Store generated `CurriculumPlan` output. One row per plan generation. Used to display the study plan to the learner and to track plan version history for cohort analysis.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid primary key default gen_random_uuid()` | Row identifier |
| `user_id` | `uuid not null references auth.users(id)` | Owner — RLS scoping column |
| `plan_version` | `integer not null` | Monotonically increasing per user |
| `plan_length_days` | `integer not null check (plan_length_days in (7, 28, 90))` | 7, 28, or 90 |
| `generated_at` | `timestamptz not null` | When the plan was generated |
| `deterministic_key` | `text not null` | `CurriculumPlan.diagnostics.deterministicKey` — idempotency key |
| `fatigue_score` | `real not null check (fatigue_score >= 0 and fatigue_score <= 1)` | 0–1 |
| `focus_skills` | `jsonb` | Array of `CurriculumSkill` for the plan period |
| `payload` | `jsonb not null` | Full `CurriculumPlan` serialized |
| `superseded_at` | `timestamptz` | When a newer plan replaced this one |
| `created_at` | `timestamptz not null default now()` | Row creation |

**Constraints:**
- `unique(user_id, deterministic_key)` — same inputs produce same plan = no-op
- `check (plan_version >= 1)` — version starts at 1

**RLS:**
- `using (auth.uid() = user_id)` — user reads/writes own plans
- Admin view: `using (get_admin_level(auth.uid()) >= 9)` — read all

**Superseding:** When a new plan is generated with the same `plan_length_days`, the previous plan's `superseded_at` is set. Only one active plan per `plan_length_days` per user at a time.

---

## 3. Storage Boundary Assumptions

| Assumption | Detail |
|-----------|--------|
| **Existing Supabase project** | `buemdfxyhxunzpgdoqin.supabase.co` — no new project |
| **Existing `auth.users`** | All tables reference `auth.users(id)` — no new auth system |
| **Existing `get_admin_level()`** | RLS admin views use existing function — no new admin system |
| **JSONB payload limits** | Max payload ~10 MB per row (Postgres default). V4 memories with 1000+ events may approach 1–2 MB. Monitored, not enforced in migration. |
| **No new buckets** | All data is in Postgres tables — no Storage bucket needed |
| **No new extensions** | Uses existing `pgcrypto` (for `gen_random_uuid()`) — no new extensions |
| **Feature gated writes** | All `INSERT`/`UPDATE` calls from the V5 persistence client are gated behind `V5_ENABLED`. When disabled, the client returns no-ops. No data is written to these tables until V5 is enabled. |
| **No migration rollback** | Migrations are additive only. Tables can exist empty without causing issues. Rollback is achieved by disabling `V5_ENABLED`, not by dropping tables. |

---

## 4. Migration Decision

**Decision: Create new migrations — do not modify existing V3 placement tables.**

| Reason | Detail |
|--------|--------|
| **V3 isolation** | `placement_v3_sessions`, `placement_v3_responses`, `placement_v3_profiles` are V3-only. V5 tables are separate. No cross-contamination. |
| **Additive only** | New tables with `v4_` prefix. Existing V3 tables unchanged. V3 continues serving all users until V5 is enabled. |
| **Naming convention** | `v4_` prefix matches the V4 module namespace. Even though these are V5-managed tables, they store V4-shaped data. |
| **Timestamp convention** | `20260628HHMMSS` — follows existing `YYYYMMDDHHMMSS_description.sql` pattern |
| **Row-Level Security** | All tables have RLS enabled from creation. No interim period without RLS. |

---

## 5. Tests Needed

### 5.1 Unit Tests (`src/lib/placement/v5/__tests__/persistence.test.ts`)

| Test | Description |
|------|-------------|
| **Serialization round-trip** | `serializeLearnerMemory → INSERT → SELECT → deserializeLearnerMemory` produces identical memory |
| **Idempotent event insert** | Insert same `event_id` twice → second insert is no-op, row count unchanged |
| **Idempotent snapshot upsert** | Upsert same `snapshot_id` twice → second upsert is no-op |
| **Idempotent decision insert** | Insert same `decision_id` twice → second insert is no-op |
| **Idempotent plan upsert** | Upsert same `deterministic_key` twice → second upsert is no-op |
| **Content hash integrity** | Read `content_hash`, compare to `fingerprintLearnerMemory(deserialized)` → match |
| **RLS simulation** | User A cannot read User B's memory/events/snapshots/decisions/plans |
| **Admin read-all** | Admin user can read all rows across all users |
| **Feature gate** | When `V5_ENABLED = false`, all persistence writes return no-op |
| **Version guard** | Insert with wrong `schema_version` → constraint violation |
| **Superseded plan** | Generate new plan → old plan's `superseded_at` is set |
| **Compact rebuild** | Read COMPACT snapshot + events → `rebuildFullFromCompact` → matches FULL snapshot |

### 5.2 Integration Tests

| Test | Description |
|------|-------------|
| **End-to-end memory flow** | Placement → `createLearnerMemory` → persist → read back → append events → persist → read back → verify timeline |
| **Cross-device merge** | Device A snapshot + Device B snapshot → `mergeDeviceSnapshots` → persist → verify convergence |
| **Provider decision audit trail** | `selectPlacementV4Provider` → persist decision → admin reads all decisions → verify redaction |

---

## 6. Blockers

None. Schema design is ready for C2 (contract/type safety) and C7 (boundary/storage) review.

## 7. Next Route

**C2 REVIEW → C7 REVIEW → C1 APPROVAL → C3 IMPLEMENTATION**

1. C2 reviews: type compatibility between Postgres row shapes and `persistenceTypes.ts` TypeScript types. V4 contract immutability preserved.
2. C7 reviews: storage boundary rules satisfied. No network/runtime assumptions in schema. RLS correctly scoped.
3. C1 approves: greenlights V5-004 implementation PR.
4. C3 implements: creates migration files, `persistence.ts`, `persistenceTypes.ts`, tests.
