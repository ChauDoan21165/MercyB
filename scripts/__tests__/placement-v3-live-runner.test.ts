import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  assertEnvironmentSafe,
  assertTestLearnerEmail,
  blockingFailure,
  buildDryRunPlan,
  classifySupabaseTarget,
  isAllowedNonDryRunTarget,
  runPlacementV3LiveValidation,
  type LiveRuntime,
} from "../placement-v3/run-live-validation.ts";
import type { CoreDeps } from "../../supabase/functions/placement-v3-session/core.ts";
import type {
  PlacementV3Profile,
  PlacementV3Response,
  PlacementV3Session,
  PlacementV3Modality,
  PromptTask,
} from "../../supabase/functions/placement-v3-session/types.ts";

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

  it("refuses VERCEL_ENV=production", () => {
    expect(() => assertEnvironmentSafe({
      env: { ...safeEnv, VERCEL_ENV: "production" },
      dryRun: false,
      learnerEmail: TEST_EMAIL,
    })).toThrow(/VERCEL_ENV=production/);
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

  it("refuses non-dry-run execution without a service-role key", () => {
    const { SUPABASE_SERVICE_ROLE_KEY: _key, ...env } = safeEnv;
    expect(() => assertEnvironmentSafe({
      env,
      dryRun: false,
      learnerEmail: TEST_EMAIL,
    })).toThrow(/missing Supabase service-role key/);
  });

  it("refuses non-namespaced learner emails", () => {
    expect(() => assertTestLearnerEmail("chau@mercyblade.com")).toThrow(/placement-v3-test/);
  });

  it("fails closed for conflicting speaking mode flags", async () => {
    await expect(runPlacementV3LiveValidation({
      args: ["--dry-run", "--speaking-only", "--skip-speaking"],
      env: safeEnv,
      uuid: TEST_UUID,
    })).rejects.toThrow(/cannot be used together/);
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

  it("keeps dry-run output deterministic when no learner email override is supplied", async () => {
    const first = await runPlacementV3LiveValidation({
      args: ["--dry-run", "--json"],
      env: { NODE_ENV: "test", SUPABASE_URL: "https://placement-validation.supabase.co" },
    });
    const second = await runPlacementV3LiveValidation({
      args: ["--dry-run", "--json"],
      env: { NODE_ENV: "test", SUPABASE_URL: "https://placement-validation.supabase.co" },
    });

    expect(first.learnerEmail).toBe("placement-v3-test-00000000-0000-4000-8000-000000000000@mercyblade.test");
    expect(second).toEqual(first);
  });

  it("stabilizes the dry-run JSON automation contract", () => {
    const plan = buildDryRunPlan(safeEnv, TEST_EMAIL, ["--json"]);

    expect(Object.keys(plan).sort()).toEqual([
      "cleanupOrOverwriteBehavior",
      "idempotencyBoundary",
      "live_provider_validated",
      "mode",
      "placement_v3_enabled",
      "production_safe",
      "steps",
      "supabaseTarget",
      "validationLearnerNamespace",
      "validationMode",
    ]);
    expect(plan).toMatchObject({
      mode: "dry-run",
      validationMode: "full",
      supabaseTarget: {
        class: "validation",
      },
      validationLearnerNamespace: TEST_EMAIL,
      idempotencyBoundary: "uses existing placement_v3_responses session_id/task_index claim-before-grade seam",
    });
  });

  it("returns structured blocking failures for --json automation", () => {
    expect(blockingFailure(new Error("Refusing Placement V3 live validation: test failure"))).toMatchObject({
      ok: false,
      blockingFailure: {
        reason: "Refusing Placement V3 live validation: test failure",
        failClosed: true,
        production_safe: false,
        placement_v3_enabled: false,
        placement_v3_enablement: "BLOCKED",
        live_provider_validated: false,
      },
    });
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
  const modalities: PlacementV3Modality[] = ["writing", "speaking", "reading", "listening", "conversation"];
  const prompts: PromptTask[] = modalities.map((modality, index) => ({
    id: `prompt-${modality}`,
    modality,
    cefr: "A2",
    promptText: `Answer this ${modality} prompt.`,
    expectedResponse: modality === "speaking" ? "audio" : "text",
    index,
  }));
  const sessions = new Map<string, PlacementV3Session>();
  const responses = new Map<string, PlacementV3Response[]>();
  const profiles = new Map<string, PlacementV3Profile>();

  return {
    resolveTestLearner: vi.fn(async (email) => ({ id: "user-test-live", email, created: true })),
    createDeps: vi.fn(async (): Promise<CoreDeps> => ({
      now: () => "2026-07-03T00:00:00.000Z",
      newId: () => "fake-placement-v3-id",
      loadLatestInProgress: async () => null,
      loadSession: async (sessionId: string) => sessions.get(sessionId) ?? null,
      loadResponses: async (sessionId: string) => responses.get(sessionId) ?? [],
      loadCurrentProfile: async (sessionId: string) => profiles.get(sessionId) ?? null,
      createSession: async () => {
        throw new Error("createSession is not used by fake runtime");
      },
      updateSession: async (session) => session,
      insertResponse: async (response) => ({ response, inserted: true }),
      updateResponse: async (response) => response,
      markProfilesNotCurrent: async () => undefined,
      upsertProfile: async (profile) => profile,
      writeProfileSnapshot: async () => undefined,
      grade: async () => ({
        ok: true,
        version: "mock-placement-v3-live-fake-grader-v1",
        assessment: {
          overallLevel: "A2",
          confidence: 0.62,
          metadata: {
            provider: "mock-placement-v3-live",
            fallback: false,
            retryCount: 0,
            liveProviderCalled: false,
          },
        },
      }),
      recommendLessons: async () => [],
    })),
    async run(userId, request) {
      if (request.action === "start") {
        const session: PlacementV3Session = {
          id: "placement-v3-live-session-1",
          user_id: userId,
          started_at: "2026-07-03T00:00:00.000Z",
          completed_at: null,
          abandoned_at: null,
          flow_state: "in_progress",
          current_task_index: 0,
          current_modality: "writing",
          total_tasks: prompts.length,
          language_pair: request.languagePair ?? { native: "vi", target: "en" },
          metadata: {},
          created_at: "2026-07-03T00:00:00.000Z",
          updated_at: "2026-07-03T00:00:00.000Z",
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
            modality: prompt.modality,
            prompt_id: prompt.id,
            prompt_text: prompt.promptText,
            user_response_text: request.response.responseText ?? null,
            audio_storage_path: request.response.audioStoragePath ?? null,
            response_duration_ms: request.response.responseDurationMs ?? null,
            ai_assessment_version: `mock-placement-v3-live-${prompt.modality}-grader-v1`,
            ai_assessment: {
              overallLevel: "A2",
              confidence: 0.62,
              metadata: {
                provider: "mock-placement-v3-live",
                nonProduction: true,
                fallback: false,
                retryCount: 0,
                liveProviderCalled: false,
              },
            },
            graded_at: "2026-07-03T00:00:01.000Z",
            created_at: "2026-07-03T00:00:01.000Z",
          },
        ]);
        const nextIndex = session.current_task_index + 1;
        if (nextIndex >= prompts.length) {
          const completed: PlacementV3Session = {
            ...session,
            flow_state: "completed",
            current_task_index: nextIndex,
            current_modality: null,
            completed_at: "2026-07-03T00:00:02.000Z",
            updated_at: "2026-07-03T00:00:02.000Z",
          };
          const profile: PlacementV3Profile = {
            session_id: session.id,
            user_id: userId,
            cefr_overall: "A2",
            cefr_overall_confidence: 0.62,
            cefr_per_skill: {},
            l1_interference_flags: [],
            strengths: [],
            gaps: [],
            recommended_lessons: [],
            computed_at: "2026-07-03T00:00:02.000Z",
            is_current: true,
          };
          sessions.set(session.id, completed);
          profiles.set(session.id, profile);
          return { ok: true, action: "respond", session: completed, prompt: null, profile };
        }
        const next: PlacementV3Session = {
          ...session,
          current_task_index: nextIndex,
          current_modality: prompts[nextIndex].modality,
          updated_at: "2026-07-03T00:00:01.000Z",
        };
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
