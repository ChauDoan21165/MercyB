import process from "node:process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const TEST_EMAIL_RE = /^placement-v3-test-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}@mercyblade\.test$/i;

type Env = Record<string, string | undefined>;
type CoreDeps = Record<string, any>;
type PlacementV3Request = Record<string, any>;
type OrchestratorResponse =
  | { ok: true; action: string; session: Record<string, any>; prompt: Record<string, any> | null; profile: Record<string, any> | null; resumed?: boolean }
  | { ok: false; error: string; message: string; status: number };
type GraderInput = {
  modality: string;
  responseText: string;
};
type GraderResult = {
  ok: boolean;
  version: string;
  assessment: Record<string, any>;
};

type ValidationMode = "full" | "skip-speaking" | "speaking-only";

export type LiveValidationResult = {
  ok: true;
  dryRun: boolean;
  target: TargetClassification;
  learnerEmail: string;
  validationMode?: ValidationMode;
  learnerUserId?: string;
  sessionId?: string;
  responseCount?: number;
  profileCurrent?: boolean;
  mockedProviderVersions?: string[];
  mockedProviderMetadata?: {
    provider: string;
    fallbackValues: boolean[];
    retryCounts: number[];
    liveProviderCalled: boolean;
  };
  idempotencyBoundary?: string;
};

export type TargetClassification = {
  url: string | null;
  class: "missing" | "local" | "validation" | "production_like" | "unknown";
  reason: string;
};

export type LiveRuntime = {
  resolveTestLearner: (email: string) => Promise<{ id: string; email: string; created: boolean }>;
  createDeps: (userId: string) => Promise<CoreDeps>;
  run: (userId: string, request: PlacementV3Request, deps: CoreDeps) => Promise<OrchestratorResponse>;
};

export function hasFlag(args: string[], name: string): boolean {
  return args.includes(`--${name}`);
}

export function validationMode(args: string[]): ValidationMode {
  const speakingOnly = hasFlag(args, "speaking-only");
  const skipSpeaking = hasFlag(args, "skip-speaking");
  if (speakingOnly && skipSpeaking) {
    throw new Error("Refusing Placement V3 live validation: --speaking-only and --skip-speaking cannot be used together.");
  }
  if (speakingOnly) return "speaking-only";
  if (skipSpeaking) return "skip-speaking";
  return "full";
}

export function getEnv(env: Env, ...names: string[]): string | undefined {
  return names.map((name) => env[name]).find((value) => typeof value === "string" && value.trim());
}

export function validationEmail(env: Env, uuid: string = randomUUID()): string {
  return getEnv(env, "PLACEMENT_V3_TEST_LEARNER_EMAIL") ?? `placement-v3-test-${uuid}@mercyblade.test`;
}

export function assertTestLearnerEmail(email: string): void {
  if (!TEST_EMAIL_RE.test(email)) {
    throw new Error(
      `Refusing Placement V3 live validation: learner email must match placement-v3-test-<uuid>@mercyblade.test. Got ${email}`,
    );
  }
}

export function classifySupabaseTarget(rawUrl: string | undefined): TargetClassification {
  if (!rawUrl?.trim()) {
    return { url: null, class: "missing", reason: "No Supabase URL configured." };
  }
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { url: rawUrl, class: "unknown", reason: "Supabase URL is not parseable." };
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
    return { url: rawUrl, class: "local", reason: "Local Supabase target." };
  }
  if (
    host.includes("prod") ||
    host.includes("production") ||
    host === "mercyblade.com" ||
    host === "www.mercyblade.com" ||
    host === "mercyblade.supabase.co" ||
    host.startsWith("prod-")
  ) {
    return { url: rawUrl, class: "production_like", reason: "Supabase target appears production-like." };
  }
  if (/(test|staging|stage|sandbox|validation|validate|dev|preview)/i.test(host)) {
    return { url: rawUrl, class: "validation", reason: "Supabase target is explicitly marked as validation/test." };
  }
  return { url: rawUrl, class: "unknown", reason: "Supabase target is not explicitly marked as validation/test." };
}

export function isAllowedNonDryRunTarget(target: TargetClassification): boolean {
  if (!target.url) return false;
  let url: URL;
  try {
    url = new URL(target.url);
  } catch {
    return false;
  }
  const host = url.hostname.toLowerCase();
  return host === "localhost" ||
    host === "127.0.0.1" ||
    target.url === "https://placement-validation.supabase.co" ||
    host.endsWith("-validation.supabase.co");
}

export function assertEnvironmentSafe(args: {
  env: Env;
  dryRun: boolean;
  learnerEmail: string;
}): TargetClassification {
  const { env, dryRun, learnerEmail } = args;
  assertTestLearnerEmail(learnerEmail);
  if (env.NODE_ENV === "production") {
    throw new Error("Refusing Placement V3 live validation: NODE_ENV=production.");
  }
  const target = classifySupabaseTarget(getEnv(env, "SUPABASE_URL", "TEST_SUPABASE_URL", "VITE_SUPABASE_URL"));
  if (target.class === "production_like") {
    throw new Error(`Refusing Placement V3 live validation: ${target.reason}`);
  }
  if (!dryRun) {
    if (env.PLACEMENT_V3_LIVE_VALIDATION !== "1") {
      throw new Error("Refusing Placement V3 live validation: set PLACEMENT_V3_LIVE_VALIDATION=1 in a safe validation env.");
    }
    if (target.class !== "local" && target.class !== "validation") {
      throw new Error(`Refusing Placement V3 live validation: ${target.reason}`);
    }
    if (!isAllowedNonDryRunTarget(target)) {
      throw new Error("Refusing Placement V3 live validation: SUPABASE_URL must be localhost, https://placement-validation.supabase.co, or *-validation.supabase.co.");
    }
    if (!getEnv(env, "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_KEY", "TEST_SUPABASE_SERVICE_KEY")) {
      throw new Error("Refusing Placement V3 live validation: missing Supabase service-role key for test learner/session setup.");
    }
  }
  return target;
}

export function buildDryRunPlan(env: Env, learnerEmail: string, args: string[] = []): Record<string, unknown> {
  const target = classifySupabaseTarget(getEnv(env, "SUPABASE_URL", "TEST_SUPABASE_URL", "VITE_SUPABASE_URL"));
  const mode = validationMode(args);
  return {
    mode: "dry-run",
    validationMode: mode,
    production_safe: false,
    placement_v3_enabled: false,
    live_provider_validated: false,
    idempotencyBoundary: "uses existing placement_v3_responses session_id/task_index claim-before-grade seam",
    supabaseTarget: target,
    validationLearnerNamespace: learnerEmail,
    steps: [
      "resolve_or_create_namespaced_test_learner",
      "create_or_resume_placement_v3_session",
      "submit_mocked_non_production_grading_responses",
      mode === "skip-speaking" ? "submit_speaking_skip_marker_without_live_provider_call" : null,
      mode === "speaking-only" ? "stop_after_mocked_speaking_response_without_claiming_full_results" : null,
      "verify_session_response_and_profile_persistence",
      "print_compact_test_only_result",
    ].filter(Boolean),
    cleanupOrOverwriteBehavior: "Only placement-v3-test-<uuid>@mercyblade.test users are allowed; repeated runs create/resume test-only sessions and never target real learner emails.",
  };
}

export async function runPlacementV3LiveValidation(options: {
  args?: string[];
  env?: Env;
  uuid?: string;
  runtime?: LiveRuntime;
  out?: Pick<Console, "log">;
} = {}): Promise<LiveValidationResult> {
  const args = options.args ?? process.argv.slice(2);
  const env = options.env ?? process.env;
  const dryRun = hasFlag(args, "dry-run");
  const mode = validationMode(args);
  const learnerEmail = validationEmail(env, options.uuid);
  const target = assertEnvironmentSafe({ env, dryRun, learnerEmail });

  if (dryRun) {
    const plan = buildDryRunPlan(env, learnerEmail, args);
    options.out?.log(JSON.stringify(plan, null, 2));
    return { ok: true, dryRun: true, target, learnerEmail, validationMode: mode };
  }

  const runtime = options.runtime ?? createSupabaseRuntime(env);
  const learner = await runtime.resolveTestLearner(learnerEmail);
  const deps = await runtime.createDeps(learner.id);
  const run = (request: PlacementV3Request) => runtime.run(learner.id, request, deps);

  const started = await mustOk(await run({
    action: "start",
    languagePair: { native: "vi", target: "en" },
    initialLevel: "A2",
  }), "start");

  let current = started;
  let submittedSpeaking = false;
  for (let i = 0; i < 12 && current.prompt; i += 1) {
    const session = current.session;
    const prompt = current.prompt;
    current = await mustOk(await run({
      action: "respond",
      response: {
        sessionId: session.id,
        taskIndex: session.current_task_index,
        promptId: prompt.id,
        responseText: answerFor(prompt.modality, mode),
        responseDurationMs: 45_000,
      },
    }), `respond:${prompt.modality}`);
    if (prompt.modality === "speaking") submittedSpeaking = true;
    if (mode === "speaking-only" && submittedSpeaking) break;
  }

  const status = await mustOk(await run({ action: "status", sessionId: current.session.id }), "status");
  const responses = await deps.loadResponses(status.session.id);
  const profile = await deps.loadCurrentProfile(status.session.id, learner.id);
  const versions = [...new Set(responses.map((response) => response.ai_assessment_version).filter(Boolean) as string[])];
  const metadata = responses.map((response) => response.ai_assessment?.metadata ?? {});

  if (mode === "speaking-only") {
    if (!submittedSpeaking) throw new Error("Placement V3 live validation failed: speaking-only mode did not reach a speaking prompt.");
    if (responses.length < 2) throw new Error("Placement V3 live validation failed: speaking-only mode did not persist enough response rows.");
  } else {
    if (status.session.flow_state !== "completed") throw new Error("Placement V3 live validation failed: session did not complete.");
    if (responses.length < 5) throw new Error("Placement V3 live validation failed: expected persisted response rows.");
    if (!profile?.is_current) throw new Error("Placement V3 live validation failed: current profile was not persisted.");
  }
  if (!responses.every((response) => response.ai_assessment?.metadata?.provider === "mock-placement-v3-live")) {
    throw new Error("Placement V3 live validation failed: mocked provider metadata missing from persisted responses.");
  }

  const result: LiveValidationResult = {
    ok: true,
    dryRun: false,
    target,
    learnerEmail,
    validationMode: mode,
    learnerUserId: testOnlyId(learner.id),
    sessionId: testOnlyId(status.session.id),
    responseCount: responses.length,
    profileCurrent: Boolean(profile?.is_current),
    mockedProviderVersions: versions,
    mockedProviderMetadata: {
      provider: "mock-placement-v3-live",
      fallbackValues: [...new Set(metadata.map((item) => Boolean(item.fallback)))],
      retryCounts: [...new Set(metadata.map((item) => Number(item.retryCount ?? 0)))],
      liveProviderCalled: metadata.some((item) => item.liveProviderCalled === true),
    },
    idempotencyBoundary: "placement_v3_responses session_id/task_index claim-before-grade",
  };
  options.out?.log(JSON.stringify(result, null, 2));
  return result;
}

function createSupabaseRuntime(env: Env): LiveRuntime {
  const url = getEnv(env, "SUPABASE_URL", "TEST_SUPABASE_URL", "VITE_SUPABASE_URL")!;
  const serviceKey = getEnv(env, "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_KEY", "TEST_SUPABASE_SERVICE_KEY")!;
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return {
    resolveTestLearner: (email) => resolveTestLearner(admin, email),
    async createDeps() {
      const { createPersistence, recommendLessons } = await import("../../supabase/functions/placement-v3-session/persistence.ts");
      return {
        ...createPersistence(admin as any, {
          now: () => new Date().toISOString(),
          newId: () => `placement-v3-live-${randomUUID()}`,
          log: () => undefined,
        }),
        grade: mockGrade,
        recommendLessons,
      };
    },
    async run(userId, request, deps) {
      const { handleAction } = await import("../../supabase/functions/placement-v3-session/core.ts");
      return handleAction({ userId, request: request as any, deps: deps as any });
    },
  };
}

async function resolveTestLearner(admin: any, email: string): Promise<{ id: string; email: string; created: boolean }> {
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data?.users?.find((user: { email?: string }) => user.email?.toLowerCase() === email.toLowerCase());
    if (hit?.id) return { id: hit.id, email, created: false };
    if (!data?.users || data.users.length < 1000) break;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: `placement-v3-test-${randomUUID()}`,
    email_confirm: true,
    user_metadata: {
      placement_v3_live_validation: true,
      non_production_test_user: true,
    },
  });
  if (error) throw error;
  if (!data?.user?.id) throw new Error("Supabase did not return a created test learner id.");
  return { id: data.user.id, email, created: true };
}

async function mustOk(response: OrchestratorResponse, step: string): Promise<Extract<OrchestratorResponse, { ok: true }>> {
  if (!response.ok) {
    const errorResponse = response as Extract<OrchestratorResponse, { ok: false }>;
    throw new Error(`Placement V3 live validation ${step} failed: ${errorResponse.error} ${errorResponse.message}`);
  }
  return response;
}

async function mockGrade(input: GraderInput): Promise<GraderResult> {
  const words = input.responseText.trim().split(/\s+/).filter(Boolean).length;
  return {
    ok: true,
    version: `mock-placement-v3-live-${input.modality}-grader-v1`,
    assessment: {
      overallLevel: words > 20 ? "B1" : "A2",
      confidence: 0.62,
      strengths: ["Responds with enough English for non-production validation."],
      gaps: ["Validation uses mocked grading; provider-live readiness is not claimed."],
      l1InterferenceFlags: [],
      metadata: {
        provider: "mock-placement-v3-live",
        nonProduction: true,
        fallback: false,
        retryCount: 0,
        liveProviderCalled: false,
      },
    },
  };
}

function answerFor(modality: string, mode: ValidationMode): string {
  if (mode === "skip-speaking" && modality === "speaking") {
    return "Speaking validation skipped by explicit runner flag. This still exercises the mocked non production persistence path and does not call a live speech provider.";
  }
  return `This is a non production Placement V3 validation answer for ${modality}. I can explain my goals, describe work tasks, answer follow up questions, and keep enough detail for the mocked grader path without calling any live AI provider.`;
}

function testOnlyId(id: string): string {
  return id.startsWith("placement-v3-") ? `${id} (test-only)` : `${id.slice(0, 8)}... (test-only)`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPlacementV3LiveValidation({ out: console }).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
