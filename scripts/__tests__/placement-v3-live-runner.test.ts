import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  assertEnvironmentSafe,
  assertTestLearnerEmail,
  buildDryRunPlan,
  classifySupabaseTarget,
  isAllowedNonDryRunTarget,
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

describe("Placement V3 live validation clean checkout wiring", () => {
  it("exposes placement:v3:live and resolves the runner file from a clean checkout", () => {
    const root = process.cwd();
    const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

    expect(pkg.scripts["placement:v3:live"]).toBe("tsx scripts/placement-v3/run-live-validation.ts");
    expect(fs.existsSync(path.join(root, "scripts/placement-v3/run-live-validation.ts"))).toBe(true);
  });
});

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

  it("allows non-dry-run only for localhost, placement-validation, or *-validation Supabase targets", () => {
    expect(isAllowedNonDryRunTarget(classifySupabaseTarget("https://placement-validation.supabase.co"))).toBe(true);
    expect(isAllowedNonDryRunTarget(classifySupabaseTarget("https://branch-validation.supabase.co"))).toBe(true);
    expect(isAllowedNonDryRunTarget(classifySupabaseTarget("http://localhost:54321"))).toBe(true);
    expect(isAllowedNonDryRunTarget(classifySupabaseTarget("https://staging.supabase.co"))).toBe(false);
    expect(() => assertEnvironmentSafe({
      env: { ...safeEnv, SUPABASE_URL: "https://staging.supabase.co" },
      dryRun: false,
      learnerEmail: TEST_EMAIL,
    })).toThrow(/SUPABASE_URL must be localhost/);
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
    const plan = buildDryRunPlan(safeEnv, TEST_EMAIL, []);

    expect(plan).toMatchObject({
      mode: "dry-run",
      validationMode: "full",
      production_safe: false,
      placement_v3_enabled: false,
    });
    expect(plan.steps).toContain("verify_session_response_and_profile_persistence");
    expect(plan).toHaveProperty("idempotencyBoundary");
  });

  it("keeps --speaking-only and --skip-speaking dry-run plans coherent", () => {
    const speakingOnly = buildDryRunPlan(safeEnv, TEST_EMAIL, ["--speaking-only"]);
    const skipSpeaking = buildDryRunPlan(safeEnv, TEST_EMAIL, ["--skip-speaking"]);

    expect(speakingOnly).toMatchObject({ validationMode: "speaking-only" });
    expect(speakingOnly.steps).toContain("stop_after_mocked_speaking_response_without_claiming_full_results");
    expect(skipSpeaking).toMatchObject({ validationMode: "skip-speaking" });
    expect(skipSpeaking.steps).toContain("submit_speaking_skip_marker_without_live_provider_call");
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
    expect(result.mockedProviderMetadata).toMatchObject({
      provider: "mock-placement-v3-live",
      liveProviderCalled: false,
    });
    expect(result.idempotencyBoundary).toContain("claim-before-grade");
  });

  it("supports speaking-only validation without claiming full Placement V3 results", async () => {
    const runtime = createFakeRuntime();

    const result = await runPlacementV3LiveValidation({
      args: ["--speaking-only"],
      env: safeEnv,
      uuid: TEST_UUID,
      runtime,
    });

    expect(result.ok).toBe(true);
    expect(result.validationMode).toBe("speaking-only");
    expect(result.responseCount).toBe(2);
    expect(result.profileCurrent).toBe(false);
  });
});

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
    resolveTestLearner: vi.fn(async (email) => ({ id: "user-test-live", email, created: true })),
    createDeps: vi.fn(async () => ({
      loadResponses: async (sessionId: string) => responses.get(sessionId) ?? [],
      loadCurrentProfile: async (sessionId: string) => profiles.get(sessionId) ?? null,
    })),
    async run(userId, request) {
      if (request.action === "start") {
        const session = {
          id: "placement-v3-live-session-1",
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
            ai_assessment_version: `mock-placement-v3-live-${prompt.modality}-grader-v1`,
            ai_assessment: {
              metadata: {
                provider: "mock-placement-v3-live",
                nonProduction: true,
                fallback: false,
                retryCount: 0,
                liveProviderCalled: false,
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
