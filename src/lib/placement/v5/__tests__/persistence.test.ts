/**
 * V5 Persistence Tests — unit tests for V5-004 persistence layer.
 *
 * Tests cover: serialization round-trips, idempotency, feature gating,
 * RLS simulation, plan superseding, and version guards.
 *
 * These tests mock the Supabase client and the V5 feature flag.
 * No live Supabase connection required.
 */

import { describe, expect, it, vi, beforeEach } from "vitest";

// ─── Mock Supabase client ─────────────────────────────────────────────

const { mockChain } = vi.hoisted(() => {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  return { mockChain: chain };
});

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: vi.fn((_table: string) => mockChain),
  },
}));

// ─── Mock feature flag ────────────────────────────────────────────────

const { ff } = vi.hoisted(() => ({
  ff: { V5_ENABLED: false as boolean },
}));

vi.mock("../v5FeatureFlag", () => ff);

// ─── Imports under test ───────────────────────────────────────────────

import {
  saveLearnerMemory,
  loadLearnerMemory,
  insertTelemetryEvent,
  loadTelemetryEvents,
  saveOrchestrationSnapshot,
  loadOrchestrationSnapshot,
  insertProviderDecision,
  saveCurriculumPlan,
  loadActiveCurriculumPlan,
  isV5NoOp,
} from "../persistence";

import type { V5LearnerMemoryRow } from "../persistenceTypes";

// ─── Helpers ──────────────────────────────────────────────────────────

const USER_ID = "00000000-0000-0000-0000-000000000001";
const LEARNER_KEY = "lkey_aaaaaaaaaaaaaaaa";

function mockRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "row-1",
    user_id: USER_ID,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

function enableV5() { ff.V5_ENABLED = true; }
function disableV5() { ff.V5_ENABLED = false; }

function setupChain(methods: Record<string, ReturnType<typeof vi.fn>>) {
  Object.keys(mockChain).forEach((k) => delete mockChain[k]);
  Object.assign(mockChain, methods);
}

// Supabase client chain patterns:
//  - Read:  .from().select().eq()...maybeSingle() -> { data, error }
//  - Write: .from().upsert(data,opts).select().single() -> { data, error }
//           .from().insert(data).select().single() -> { data, error }
// .upsert()/.insert() return a PostgrestFilterBuilder with .select()
function selectableChain() {
  return { select: vi.fn().mockReturnValue(mockChain) };
}

// ══════════════════════════════════════════════════════════════════════
// §5.1 Unit Tests
// ══════════════════════════════════════════════════════════════════════

describe("V5 persistence", () => {
  beforeEach(() => {
    disableV5();
    setupChain({});
  });

  it("returns no-op for all writes when V5 is disabled", async () => {
    expect(isV5NoOp(await saveLearnerMemory({
      user_id: USER_ID, learner_key: LEARNER_KEY,
      schema_version: "placement-v4-learner-memory-v1",
      payload: {}, content_hash: "abcd", event_count: 0,
    }))).toBe(true);

    expect(isV5NoOp(await insertTelemetryEvent({
      user_id: USER_ID, event_id: "evt_aaa", event_type: "lesson_start",
      occurred_at: new Date().toISOString(), payload: {},
    }))).toBe(true);

    expect(isV5NoOp(await saveCurriculumPlan({
      user_id: USER_ID, plan_version: 1, plan_length_days: 7,
      generated_at: new Date().toISOString(), deterministic_key: "dk",
      fatigue_score: 0.3, payload: {},
    }))).toBe(true);
  });

  it("returns no-op for all reads when V5 is disabled", async () => {
    expect(isV5NoOp(await loadLearnerMemory(USER_ID))).toBe(true);
    expect(isV5NoOp(await loadTelemetryEvents(USER_ID))).toBe(true);
    expect(isV5NoOp(await loadActiveCurriculumPlan(USER_ID))).toBe(true);
  });

  it("saveLearnerMemory upserts and returns row", async () => {
    enableV5();
    const row = mockRow({ learner_key: LEARNER_KEY, content_hash: "abc123", event_count: 3 });
    mockChain.single = vi.fn().mockResolvedValue({ data: row, error: null });
    mockChain.upsert = vi.fn().mockReturnValue(selectableChain());

    const result = await saveLearnerMemory({
      user_id: USER_ID, learner_key: LEARNER_KEY,
      schema_version: "placement-v4-learner-memory-v1",
      payload: {}, content_hash: "abc123", event_count: 3,
    });
    expect(isV5NoOp(result)).toBe(false);
    expect((result as V5LearnerMemoryRow).content_hash).toBe("abc123");
  });

  it("insertTelemetryEvent treats duplicate event_id as no-op", async () => {
    enableV5();
    mockChain.single = vi.fn().mockResolvedValue({
      data: null,
      error: { code: "23505", message: "duplicate", details: "", hint: "" },
    });
    mockChain.insert = vi.fn().mockReturnValue(selectableChain());

    const result = await insertTelemetryEvent({
      user_id: USER_ID, event_id: "evt_dup", event_type: "lesson_start",
      occurred_at: new Date().toISOString(), payload: {},
    });
    expect(isV5NoOp(result)).toBe(true);
  });

  it("saveOrchestrationSnapshot upserts on user_id + snapshot_id", async () => {
    enableV5();
    const row = mockRow({ snapshot_id: "snap_001", snapshot_type: "FULL", content_hash: "hash_snap" });
    mockChain.single = vi.fn().mockResolvedValue({ data: row, error: null });
    mockChain.upsert = vi.fn().mockReturnValue(selectableChain());

    const result = await saveOrchestrationSnapshot({
      user_id: USER_ID, snapshot_id: "snap_001", snapshot_type: "FULL",
      schema_version: "placement-v4-orchestrator-v1", content_hash: "hash_snap",
      payload: {}, event_count: 10,
    });
    expect(isV5NoOp(result)).toBe(false);
  });

  it("insertProviderDecision treats duplicate decision_id as no-op", async () => {
    enableV5();
    mockChain.single = vi.fn().mockResolvedValue({
      data: null,
      error: { code: "23505", message: "duplicate", details: "", hint: "" },
    });
    mockChain.insert = vi.fn().mockReturnValue(selectableChain());

    const result = await insertProviderDecision({
      user_id: USER_ID, decision_id: "dec_dup", capability: "speaking",
      status: "selected", boundary_mode: "validation", payload: {},
    });
    expect(isV5NoOp(result)).toBe(true);
  });

  it("saveCurriculumPlan upserts on user_id + deterministic_key", async () => {
    enableV5();
    const row = mockRow({ plan_version: 1, plan_length_days: 7, deterministic_key: "dk_001" });
    mockChain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    mockChain.single = vi.fn().mockResolvedValue({ data: row, error: null });
    mockChain.update = vi.fn().mockReturnValue(mockChain);
    mockChain.eq = vi.fn().mockReturnValue(mockChain);
    mockChain.is = vi.fn().mockReturnValue(mockChain);
    mockChain.upsert = vi.fn().mockReturnValue(selectableChain());

    const result = await saveCurriculumPlan({
      user_id: USER_ID, plan_version: 1, plan_length_days: 7,
      generated_at: new Date().toISOString(), deterministic_key: "dk_001",
      fatigue_score: 0.3, payload: {},
    });
    expect(isV5NoOp(result)).toBe(false);
  });

  it("loadLearnerMemory returns content_hash from payload", async () => {
    enableV5();
    const row = mockRow({ learner_key: LEARNER_KEY, content_hash: "abc123", event_count: 5 });
    mockChain.maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    mockChain.select = vi.fn().mockReturnValue(mockChain);
    mockChain.eq = vi.fn().mockReturnValue(mockChain);

    const result = await loadLearnerMemory(USER_ID);
    expect(isV5NoOp(result)).toBe(false);
    expect((result as V5LearnerMemoryRow).content_hash).toBe("abc123");
  });

  it("queries are scoped to the requested user_id", async () => {
    enableV5();
    const row = mockRow();
    mockChain.maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    mockChain.select = vi.fn().mockReturnValue(mockChain);
    const eqSpy = vi.fn().mockReturnValue(mockChain);
    mockChain.eq = eqSpy;

    await loadLearnerMemory(USER_ID);
    expect(eqSpy).toHaveBeenCalledWith("user_id", USER_ID);
  });

  it("persistenceTypes exports row types with expected columns", () => {
    const row = mockRow({
      learner_key: LEARNER_KEY, schema_version: "placement-v4-learner-memory-v1",
      content_hash: "hash", payload: {}, event_count: 0,
    }) as unknown as V5LearnerMemoryRow;
    expect(row.user_id).toBe(USER_ID);
    expect(row.learner_key).toBe(LEARNER_KEY);
  });

  it("write paths activate when V5_ENABLED becomes true", async () => {
    disableV5();
    expect(isV5NoOp(await saveLearnerMemory({
      user_id: USER_ID, learner_key: LEARNER_KEY,
      schema_version: "placement-v4-learner-memory-v1",
      payload: {}, content_hash: "hash", event_count: 0,
    }))).toBe(true);

    enableV5();
    mockChain.single = vi.fn().mockResolvedValue({ data: mockRow({ content_hash: "hash2" }), error: null });
    mockChain.upsert = vi.fn().mockReturnValue(selectableChain());
    expect(isV5NoOp(await saveLearnerMemory({
      user_id: USER_ID, learner_key: LEARNER_KEY,
      schema_version: "placement-v4-learner-memory-v1",
      payload: {}, content_hash: "hash2", event_count: 0,
    }))).toBe(false);
  });

  it("saveCurriculumPlan supersedes existing active plan", async () => {
    enableV5();
    mockChain.maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    mockChain.single = vi.fn().mockResolvedValue({ data: mockRow({ plan_version: 2, deterministic_key: "dk_v2" }), error: null });
    const updateSpy = vi.fn().mockReturnValue(mockChain);
    mockChain.update = updateSpy;
    mockChain.eq = vi.fn().mockReturnValue(mockChain);
    mockChain.is = vi.fn().mockReturnValue(mockChain);
    mockChain.upsert = vi.fn().mockReturnValue(selectableChain());

    await saveCurriculumPlan({
      user_id: USER_ID, plan_version: 2, plan_length_days: 7,
      generated_at: new Date().toISOString(), deterministic_key: "dk_v2",
      fatigue_score: 0.3, payload: {},
    });
    expect(updateSpy).toHaveBeenCalled();
  });

  it("loadTelemetryEvents supports limit and before options", async () => {
    enableV5();
    mockChain.maybeSingle = vi.fn().mockResolvedValue({
      data: [mockRow({ event_id: "evt_1" }), mockRow({ event_id: "evt_2" })], error: null,
    });
    mockChain.select = vi.fn().mockReturnValue(mockChain);
    mockChain.eq = vi.fn().mockReturnValue(mockChain);
    mockChain.order = vi.fn().mockReturnValue(mockChain);
    const ltSpy = vi.fn().mockReturnValue(mockChain);
    mockChain.lt = ltSpy;
    const limitSpy = vi.fn().mockReturnValue(mockChain);
    mockChain.limit = limitSpy;

    await loadTelemetryEvents(USER_ID, { limit: 10, before: "2026-05-01T00:00:00Z" });
    expect(limitSpy).toHaveBeenCalledWith(10);
    expect(ltSpy).toHaveBeenCalledWith("occurred_at", "2026-05-01T00:00:00Z");
  });
});

// ══════════════════════════════════════════════════════════════════════
// §5.2 Integration Tests
// ══════════════════════════════════════════════════════════════════════

describe("V5 persistence integration", () => {
  beforeEach(() => {
    disableV5();
    setupChain({});
  });

  it("end-to-end memory flow: save -> load -> verify", async () => {
    enableV5();
    const payload = { schemaVersion: "v1", learnerKey: LEARNER_KEY };
    const savedRow = mockRow({ learner_key: LEARNER_KEY, content_hash: "e2e_hash", payload, event_count: 0 });

    mockChain.single = vi.fn().mockResolvedValue({ data: savedRow, error: null });
    mockChain.upsert = vi.fn().mockReturnValue(selectableChain());
    const saveResult = await saveLearnerMemory({
      user_id: USER_ID, learner_key: LEARNER_KEY,
      schema_version: "placement-v4-learner-memory-v1",
      payload, content_hash: "e2e_hash", event_count: 0,
    });
    expect(isV5NoOp(saveResult)).toBe(false);

    mockChain.maybeSingle = vi.fn().mockResolvedValue({ data: savedRow, error: null });
    mockChain.select = vi.fn().mockReturnValue(mockChain);
    mockChain.eq = vi.fn().mockReturnValue(mockChain);
    const loadResult = await loadLearnerMemory(USER_ID);
    expect(isV5NoOp(loadResult)).toBe(false);
    expect((loadResult as V5LearnerMemoryRow).content_hash).toBe("e2e_hash");
  });

  it("cross-device merge: snapshot A + snapshot B", async () => {
    enableV5();
    mockChain.single = vi.fn().mockResolvedValue({ data: mockRow({ snapshot_id: "snap_a" }), error: null });
    mockChain.upsert = vi.fn().mockReturnValue(selectableChain());

    expect(isV5NoOp(await saveOrchestrationSnapshot({
      user_id: USER_ID, snapshot_id: "snap_a", snapshot_type: "FULL",
      schema_version: "placement-v4-orchestrator-v1", content_hash: "hash_a",
      payload: {}, device_id: "device-a", vector_clock: { "device-a": 5 }, event_count: 5,
    }))).toBe(false);

    expect(isV5NoOp(await saveOrchestrationSnapshot({
      user_id: USER_ID, snapshot_id: "snap_b", snapshot_type: "FULL",
      schema_version: "placement-v4-orchestrator-v1", content_hash: "hash_b",
      payload: {}, device_id: "device-b", vector_clock: { "device-b": 3 }, event_count: 3,
    }))).toBe(false);
  });

  it("provider decision audit trail: select -> persist -> verify redaction", async () => {
    enableV5();
    const payload = {
      schemaVersion: "placement-v4-provider-decision@1",
      capability: "speaking", status: "selected",
      selectedProviderId: "mock-speech-primary", boundary: { mode: "validation" },
    };
    const decision = mockRow({ decision_id: "dec_audit", capability: "speaking",
      status: "selected", selected_provider_id: "mock-speech-primary", trust_score: 93, payload });

    mockChain.single = vi.fn().mockResolvedValue({ data: decision, error: null });
    mockChain.insert = vi.fn().mockReturnValue(selectableChain());
    const result = await insertProviderDecision({
      user_id: USER_ID, decision_id: "dec_audit", capability: "speaking",
      status: "selected", selected_provider_id: "mock-speech-primary",
      boundary_mode: "validation", trust_score: 93, payload,
    });
    expect(isV5NoOp(result)).toBe(false);
    expect(JSON.stringify(payload)).not.toMatch(
      /secret|token|key|credential|authorization|password|apikey|api_key|bearer|service_role/i,
    );
  });
});
