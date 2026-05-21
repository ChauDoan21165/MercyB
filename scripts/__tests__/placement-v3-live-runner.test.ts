import { describe, expect, it, vi } from "vitest";
import type fs from "node:fs";
import {
  assertEnvironmentSafe,
  assertTestLearnerEmail,
  buildDryRunPlan,
  classifySupabaseTarget,
  parseArgs,
  runPlacementV3LiveValidation,
  type LiveRuntime,
} from "../placement-v3/run-live-validation.ts";

const TEST_UUID = "123e4567-e89b-42d3-a456-426614174000";
const TEST_EMAIL = `placement-v3-test-${TEST_UUID}@mercyblade.test`;

const safeEnv = {
  NODE_ENV: "test",
  SUPABASE_URL: "https://placement-validation.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
  PLACEMENT_V3_LIVE_VALIDATION: "1",
};

describe("Placement V3 live validation runner safety", () => {
  it("prints a dry-run plan without resolving a learner or writing persistence", async () => {
    const resolveTestLearner = vi.fn();
    const out = { log: vi.fn() };

    const result = await runPlacementV3LiveValidation({
      args: ["--dry-run"],
      env: { NODE_ENV: "test", SUPABASE_URL: "https://placement-validation.supabase.co" },
      uuid: TEST_UUID,
      runtime: {
        resolveTestLearner,
        createDeps: vi.fn(),
        run: vi.fn(),
      } as unknown as LiveRuntime,
      out,
    });

    expect(result.dryRun).toBe(true);
    expect(resolveTestLearner).not.toHaveBeenCalled();
    expect(out.log).toHaveBeenCalledWith(expect.stringContaining("submit_mocked_non_production_grading_responses"));
  });

  it("refuses NODE_ENV=production", () => {
    expect(() => assertEnvironmentSafe({
      env: { ...safeEnv, NODE_ENV: "production" },
      dryRun: false,
      learnerEmail: TEST_EMAIL,
    })).toThrow(/NODE_ENV=production/);
  });

  it("refuses production-like Supabase URLs", () => {
    expect(classifySupabaseTarget("https://mercyblade.supabase.co").class).toBe("production_like");
    expect(() => assertEnvironmentSafe({
      env: { ...safeEnv, SUPABASE_URL: "https://mercyblade.supabase.co" },
      dryRun: false,
      learnerEmail: TEST_EMAIL,
    })).toThrow(/production-like/);
  });

  it("refuses non-dry-run execution without the explicit validation marker", () => {
    const { PLACEMENT_V3_LIVE_VALIDATION: _marker, ...env } = safeEnv;
    expect(() => assertEnvironmentSafe({
      env,
      dryRun: false,
      learnerEmail: TEST_EMAIL,
    })).toThrow(/PLACEMENT_V3_LIVE_VALIDATION=1/);
  });

  it("refuses non-namespaced learner emails", () => {
    expect(() => assertTestLearnerEmail("chau@mercyblade.com")).toThrow(/placement-v3-test/);
  });

  it("describes the exact dry-run validation plan", () => {
    const plan = buildDryRunPlan(safeEnv, TEST_EMAIL, parseArgs(["--dry-run", "--iterations=3", "--concurrency=2", "--cleanup"]));

    expect(plan).toMatchObject({
      mode: "dry-run",
      production_safe: false,
      placement_v3_enabled: false,
      iterations: 3,
      concurrency: 2,
      cleanup: true,
    });
    expect(plan.steps).toContain("verify_session_response_and_profile_persistence");
    expect(plan.steps).toContain("reconcile_local_state_with_persistence");
  });
});

describe("Placement V3 live validation runner persistence path", () => {
  it("runs mocked/non-production grading through the Placement V3 orchestrator with test doubles", async () => {
    const runtime = createFakeRuntime();

    const result = await runPlacementV3LiveValidation({
      args: [],
      env: safeEnv,
      uuid: TEST_UUID,
      runtime,
    });

    expect(result.ok).toBe(true);
    expect(result.dryRun).toBe(false);
    expect(result.learnerEmail).toBe(TEST_EMAIL);
    expect(result.responseCount).toBeGreaterThanOrEqual(5);
    expect(result.profileCurrent).toBe(true);
    expect(result.mockedProviderVersions).toContain("mock-placement-v3-live-writing-grader-v1");
  });

  it("runs repeated concurrent validation iterations with isolated namespaces", async () => {
    const runtime = createFakeRuntime();
    const out = { log: vi.fn() };

    const result = await runPlacementV3LiveValidation({
      args: ["--iterations=4", "--concurrency=2", "--json"],
      env: safeEnv,
      uuid: TEST_UUID,
      runtime,
      stateIO: memoryStateIO(),
      out,
    });

    expect(result.metrics?.iterationsCompleted).toBe(4);
    expect(result.metrics?.concurrencyCollisionsPrevented).toBeGreaterThan(0);
    expect(result.metrics?.unrecoveredOperationalFailures).toEqual([]);
    expect(out.log).toHaveBeenCalledWith(expect.stringContaining('"iterationsCompleted": 4'));
  });

  it("resumes an interrupted run and repairs stale running state", async () => {
    const runtime = createFakeRuntime();
    const stateIO = memoryStateIO({
      "state.json": JSON.stringify({
        version: 1,
        runId: "interrupted",
        learnerNamespace: TEST_EMAIL,
        target: classifySupabaseTarget(safeEnv.SUPABASE_URL),
        createdAt: "2026-05-20T12:00:00.000Z",
        updatedAt: "2026-05-20T12:00:00.000Z",
        cleanupRequested: false,
        metrics: {
          iterationsAttempted: 0,
          iterationsCompleted: 0,
          iterationsRecovered: 0,
          resumesPerformed: 0,
          orphanedSessionsReconciled: 0,
          duplicateSubmitsSuppressed: 0,
          retryRecoveries: 0,
          cleanupRecoveries: 0,
          persistenceMismatches: 0,
          staleStateRepairs: 0,
          concurrencyCollisionsPrevented: 0,
          p50ValidationDurationMs: 0,
          p95ValidationDurationMs: 0,
          azureLiveCheckStatus: "not_run_mocked_grading_only",
          unrecoveredOperationalFailures: [],
        },
        iterations: [{
          index: 0,
          learnerEmail: TEST_EMAIL,
          status: "running",
          attempts: 0,
          retryState: "none",
          persistenceVerified: false,
          cleanupStatus: "not_requested",
          azureLiveCheckStatus: "not_run_mocked_grading_only",
        }],
      }),
    });

    const result = await runPlacementV3LiveValidation({
      args: ["--resume-from=state.json", "--json"],
      env: safeEnv,
      runtime,
      stateIO,
    });

    expect(result.metrics?.resumesPerformed).toBe(1);
    expect(result.metrics?.staleStateRepairs).toBe(1);
    expect(result.metrics?.iterationsCompleted).toBe(1);
  });

  it("fails closed on corrupted local state files", async () => {
    await expect(runPlacementV3LiveValidation({
      args: ["--resume-from=bad.json"],
      env: safeEnv,
      runtime: createFakeRuntime(),
      stateIO: memoryStateIO({ "bad.json": "{ not json" }),
    })).rejects.toThrow();
  });

  it("recovers a transient injected failure without duplicating persistence", async () => {
    const result = await runPlacementV3LiveValidation({
      args: ["--inject-failure=transient-db-error", "--max-retries=2", "--json"],
      env: safeEnv,
      uuid: TEST_UUID,
      runtime: createFakeRuntime(),
      stateIO: memoryStateIO(),
    });

    expect(result.metrics?.retryRecoveries).toBe(1);
    expect(result.metrics?.iterationsRecovered).toBe(1);
    expect(result.metrics?.persistenceMismatches).toBe(0);
  });

  it("detects reconciliation divergence and exits as an unrecovered failure", async () => {
    await expect(runPlacementV3LiveValidation({
      args: ["--inject-failure=partial-results", "--max-retries=1"],
      env: safeEnv,
      uuid: TEST_UUID,
      runtime: createFakeRuntime(),
      stateIO: memoryStateIO(),
    })).rejects.toThrow(/persistence reconciliation failed/);
  });

  it("verifies cleanup idempotency through the runtime cleanup hook", async () => {
    const runtime = createFakeRuntime();
    const cleanup = vi.fn(async () => ({ removedRows: 5, recovered: true, activeDeletionPrevented: true }));
    runtime.cleanupValidationState = cleanup;

    const result = await runPlacementV3LiveValidation({
      args: ["--cleanup", "--iterations=2"],
      env: safeEnv,
      uuid: TEST_UUID,
      runtime,
      stateIO: memoryStateIO(),
    });

    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(result.metrics?.cleanupRecoveries).toBe(1);
  });

  it("detects duplicate persistence rows after resume/retry corruption", async () => {
    const runtime = createFakeRuntime();
    runtime.reconcileIteration = async () => ({ duplicateResponseRows: 1 });

    await expect(runPlacementV3LiveValidation({
      args: [],
      env: safeEnv,
      uuid: TEST_UUID,
      runtime,
      stateIO: memoryStateIO(),
    })).rejects.toThrow(/persistence reconciliation failed/);
  });
});

function memoryStateIO(seed: Record<string, string> = {}) {
  const files = new Map(Object.entries(seed));
  return {
    existsSync: (path: fs.PathLike) => files.has(String(path)),
    readFileSync: (path: fs.PathOrFileDescriptor) => {
      const hit = files.get(String(path));
      if (hit === undefined) throw new Error(`missing ${String(path)}`);
      return hit;
    },
    writeFileSync: (path: fs.PathOrFileDescriptor, value: string | NodeJS.ArrayBufferView) => {
      files.set(String(path), String(value));
    },
  };
}

function createFakeRuntime(): LiveRuntime {
  const prompts = ["writing", "speaking", "reading", "listening", "conversation"].map((modality, index) => ({
    id: `prompt-${modality}`,
    modality,
    cefr: "A2",
    promptText: `Answer this ${modality} prompt.`,
    expectedResponse: modality === "speaking" ? "audio" : "text",
    index,
  }));
  const sessions = new Map<string, Record<string, any>>();
  const responses = new Map<string, Array<Record<string, any>>>();
  const profiles = new Map<string, Record<string, any>>();

  return {
    resolveTestLearner: vi.fn(async (email) => ({ id: email.replace(/[^a-z0-9]/gi, "-"), email, created: true })),
    createDeps: vi.fn(async () => ({
      loadResponses: async (sessionId: string) => responses.get(sessionId) ?? [],
      loadCurrentProfile: async (sessionId: string) => profiles.get(sessionId) ?? null,
    })),
    async run(userId, request) {
      if (request.action === "start") {
        const session = {
          id: `placement-v3-live-session-${userId}`,
          user_id: userId,
          flow_state: "in_progress",
          current_task_index: 0,
          current_modality: "writing",
        };
        sessions.set(session.id, session);
        responses.set(session.id, []);
        return { ok: true, action: "start", session, prompt: prompts[0], profile: null };
      }

      if (request.action === "respond") {
        const session = sessions.get(request.response.sessionId)!;
        const prompt = prompts[session.current_task_index];
        responses.set(session.id, [
          ...(responses.get(session.id) ?? []),
          {
            id: `response-${session.current_task_index}`,
            session_id: session.id,
            task_index: session.current_task_index,
            ai_assessment_version: `mock-placement-v3-live-${prompt.modality}-grader-v1`,
            ai_assessment: {
              metadata: {
                provider: "mock-placement-v3-live",
                nonProduction: true,
                fallback: false,
                retryCount: 0,
              },
            },
          },
        ]);
        const nextIndex = session.current_task_index + 1;
        if (nextIndex >= prompts.length) {
          const completed = { ...session, flow_state: "completed", current_task_index: nextIndex, current_modality: null };
          const profile = { session_id: session.id, user_id: userId, is_current: true };
          sessions.set(session.id, completed);
          profiles.set(session.id, profile);
          return { ok: true, action: "respond", session: completed, prompt: null, profile };
        }
        const next = { ...session, current_task_index: nextIndex, current_modality: prompts[nextIndex].modality };
        sessions.set(session.id, next);
        return { ok: true, action: "respond", session: next, prompt: prompts[nextIndex], profile: null };
      }

      if (request.action === "status") {
        const session = sessions.get(request.sessionId)!;
        return { ok: true, action: "status", session, prompt: null, profile: profiles.get(session.id) ?? null };
      }

      return { ok: false, status: 400, error: "unsupported", message: "Unsupported fake action." };
    },
  };
}
