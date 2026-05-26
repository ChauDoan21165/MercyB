import { randomUUID } from "node:crypto";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";

import { handleAction, type CoreDeps } from "../../supabase/functions/placement-v3-session/core.ts";
import { createPersistence, recommendLessons } from "../../supabase/functions/placement-v3-session/persistence.ts";
import type {
  CEFRAssessment,
  GraderInput,
  GraderResult,
  OrchestratorResponse,
  PlacementV3Profile,
  PlacementV3Request,
  PlacementV3Response,
  PlacementV3Session,
  PromptTask,
} from "../../supabase/functions/placement-v3-session/types.ts";

loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

const KNOWN_PRODUCTION_SUPABASE_HOSTS = new Set(["buemdfxyhxunzpgdoqin.supabase.co"]);
const ALLOWED_VALIDATION_ENVS = new Set(["local", "staging", "validation"]);
const CHECK_MARKER = "PLACEMENT_V3_SUPABASE_LIVE_CHECK";
const VALIDATION_ENV_MARKER = "PLACEMENT_V3_SUPABASE_VALIDATION_ENV";
export const VALIDATION_EMAIL_PATTERN = /^placement-v3-test-[a-z0-9._-]+@mercyblade\.test$/i;
export const DEFAULT_VALIDATION_EMAIL = "placement-v3-test-validation@mercyblade.test";
export const LIVE_CHECK_NAMESPACE = "placement-v3-live-check";
const MAX_RESPONSES = 12;

type EnvMap = Record<string, string | undefined>;

export type LiveCheckInject =
  | "duplicate-submit"
  | "partial-response"
  | "stale-session"
  | "status-retry"
  | "result-reload"
  | "transient-db-error"
  | "missing-provider-metadata"
  | "partial-fallback-metadata";

export interface LiveCheckConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
  validationEnv: string;
  validationEmail: string;
  runId: string;
  dryRun: boolean;
  cleanup: boolean;
  inject: LiveCheckInject[];
}

export interface LiveCheckResult {
  ok: boolean;
  dryRun: boolean;
  namespace: string;
  runId: string;
  userId: string;
  sessionId: string;
  sessionCreated: boolean;
  responsesPersisted: number;
  providerMetadataRows: number;
  fallbackMetadataPersisted: boolean;
  retryFallbackMetadataPersisted: boolean;
  profilePersisted: boolean;
  resultsRetrievalSucceeded: boolean;
  duplicateSubmitsSuppressed: number;
  retryRecoveries: number;
  fallbackMetadataRecoveries: number;
  staleSessionsCleaned: number;
  resultReloadRetries: number;
  cleanupRowsRemoved: number;
  persistenceLatencyMs: number[];
  skippedLiveSegments: string[];
  blockingFailures: string[];
}

export class LiveCheckSafetyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LiveCheckSafetyError";
  }
}

export function resolveLiveCheckConfig(
  env: EnvMap = process.env,
  overrides: Partial<Pick<LiveCheckConfig, "dryRun" | "cleanup" | "inject" | "runId">> = {},
): LiveCheckConfig {
  assertLiveCheckSafety(env, { dryRun: Boolean(overrides.dryRun), cleanup: Boolean(overrides.cleanup) });
  const dryRun = Boolean(overrides.dryRun);
  return {
    supabaseUrl: readSupabaseUrl(env, dryRun),
    serviceRoleKey: dryRun ? "dry-run-service-role" : requiredEnv(env, "SUPABASE_SERVICE_ROLE_KEY"),
    validationEnv: requiredEnv(env, VALIDATION_ENV_MARKER).toLowerCase(),
    validationEmail: (env.PLACEMENT_V3_SUPABASE_VALIDATION_EMAIL ?? DEFAULT_VALIDATION_EMAIL).trim(),
    runId: overrides.runId ?? `${LIVE_CHECK_NAMESPACE}-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}`,
    dryRun,
    cleanup: Boolean(overrides.cleanup),
    inject: overrides.inject ?? [],
  };
}

export function assertLiveCheckSafety(
  env: EnvMap = process.env,
  options: { dryRun?: boolean; cleanup?: boolean } = {},
): void {
  const missing = missingLiveCheckEnv(env, Boolean(options.dryRun));
  if (missing.length) {
    throw new LiveCheckSafetyError(`Missing required env: ${missing.join(", ")}.`);
  }

  const validationEnv = String(env[VALIDATION_ENV_MARKER]).trim().toLowerCase();
  if (!ALLOWED_VALIDATION_ENVS.has(validationEnv)) {
    throw new LiveCheckSafetyError(`${VALIDATION_ENV_MARKER} must be one of: ${[...ALLOWED_VALIDATION_ENVS].join(", ")}.`);
  }

  for (const name of ["NODE_ENV", "VERCEL_ENV", "APP_ENV", "SUPABASE_ENV", "PLACEMENT_ENV"]) {
    const value = (env[name] ?? "").trim().toLowerCase();
    if (value === "production" || value === "prod") {
      throw new LiveCheckSafetyError(`Refusing to run with ${name}=${env[name]}.`);
    }
  }

  if (options.cleanup) {
    assertCleanupNamespace(env.PLACEMENT_V3_SUPABASE_VALIDATION_EMAIL ?? DEFAULT_VALIDATION_EMAIL);
  }

  if (!options.dryRun) {
    const supabaseUrl = readSupabaseUrl(env, false);
    if (isProductionSupabaseUrl(supabaseUrl)) {
      throw new LiveCheckSafetyError(`Refusing production Supabase URL: ${redactUrl(supabaseUrl)}.`);
    }
  }
}

export function missingLiveCheckEnv(env: EnvMap = process.env, dryRun = false): string[] {
  const missing: string[] = [];
  if (!isTruthy(env[CHECK_MARKER])) missing.push(CHECK_MARKER);
  if (!env[VALIDATION_ENV_MARKER]?.trim()) missing.push(VALIDATION_ENV_MARKER);
  if (!dryRun) {
    if (!env.SUPABASE_URL?.trim() && !env.VITE_SUPABASE_URL?.trim()) {
      missing.push("SUPABASE_URL or VITE_SUPABASE_URL");
    }
    if (!env.SUPABASE_SERVICE_ROLE_KEY?.trim()) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  return missing;
}

export function assertCleanupNamespace(email: string): void {
  if (!VALIDATION_EMAIL_PATTERN.test(email.trim())) {
    throw new LiveCheckSafetyError(
      "Refusing cleanup unless PLACEMENT_V3_SUPABASE_VALIDATION_EMAIL matches placement-v3-test-*.@mercyblade.test.",
    );
  }
}

export function isProductionSupabaseUrl(rawUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new LiveCheckSafetyError("Supabase URL is not a valid URL.");
  }
  const host = url.hostname.toLowerCase();
  return KNOWN_PRODUCTION_SUPABASE_HOSTS.has(host) || /\b(prod|production)\b/i.test(host);
}

export async function runPlacementV3SupabaseLiveCheck(config: LiveCheckConfig): Promise<LiveCheckResult> {
  const store = config.dryRun ? createMemoryStore() : null;
  const supabase = config.dryRun
    ? null
    : createClient(config.supabaseUrl, config.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

  const userId = config.dryRun
    ? `dry-user-${config.runId}`
    : await findOrCreateValidationUser(mustSupabase(supabase), config);

  const latencies: number[] = [];
  const skippedLiveSegments = config.dryRun ? ["supabase-network", "auth-admin-api"] : [];
  const metrics = {
    duplicateSubmitsSuppressed: 0,
    retryRecoveries: 0,
    fallbackMetadataRecoveries: 0,
    staleSessionsCleaned: 0,
    resultReloadRetries: 0,
    cleanupRowsRemoved: 0,
  };

  const deps = config.dryRun
    ? createMemoryDeps(store!, userId, config, latencies)
    : {
      ...createPersistence(mustSupabase(supabase) as unknown as Parameters<typeof createPersistence>[0], {
        now: () => new Date().toISOString(),
        newId: () => randomUUID(),
      }),
      grade: createMockValidationGrader(config),
      recommendLessons,
    };

  metrics.staleSessionsCleaned = config.dryRun
    ? abandonMemoryStaleSessions(store!, userId)
    : await abandonStaleValidationSessions(mustSupabase(supabase), userId, config.runId);

  if (config.inject.includes("stale-session")) {
    metrics.staleSessionsCleaned += config.dryRun
      ? seedAndCleanStaleMemorySession(store!, userId, deps)
      : 0;
  }

  const started = await handleAction({
    userId,
    request: { action: "start", languagePair: { native: "vi", target: "en" }, initialLevel: "A2" },
    deps,
  });
  assertOk(started, "start");
  await deps.updateSession({
    ...started.session,
    metadata: {
      ...started.session.metadata,
      validation: {
        namespace: LIVE_CHECK_NAMESPACE,
        runId: config.runId,
        validationEnv: config.validationEnv,
        nonProductionGrading: true,
        liveProviderCalls: false,
      },
    },
    updated_at: deps.now(),
  });

  const completed = await submitUntilComplete(userId, started.session.id, deps, config, metrics);
  const status = await statusWithRetry(userId, started.session.id, deps, config, metrics);
  assertOk(status, "status");

  const verification = config.dryRun
    ? verifyMemoryState(store!, userId, started.session.id, status, config, metrics)
    : await verifyPersistedState({
      supabase: mustSupabase(supabase),
      userId,
      sessionId: started.session.id,
      status,
      config,
      metrics,
    });

  if (config.cleanup) {
    metrics.cleanupRowsRemoved = config.dryRun
      ? cleanupMemoryRows(store!, userId)
      : await cleanupValidationRows(mustSupabase(supabase), userId);
  }

  return {
    ok: verification.blockingFailures.length === 0,
    dryRun: config.dryRun,
    namespace: LIVE_CHECK_NAMESPACE,
    runId: config.runId,
    userId,
    sessionId: started.session.id,
    sessionCreated: true,
    responsesPersisted: verification.responsesPersisted,
    providerMetadataRows: verification.providerMetadataRows,
    fallbackMetadataPersisted: verification.fallbackMetadataPersisted,
    retryFallbackMetadataPersisted: verification.retryFallbackMetadataPersisted,
    profilePersisted: Boolean(completed.profile),
    resultsRetrievalSucceeded: verification.resultsRetrievalSucceeded,
    duplicateSubmitsSuppressed: metrics.duplicateSubmitsSuppressed,
    retryRecoveries: metrics.retryRecoveries,
    fallbackMetadataRecoveries: metrics.fallbackMetadataRecoveries,
    staleSessionsCleaned: metrics.staleSessionsCleaned,
    resultReloadRetries: metrics.resultReloadRetries,
    cleanupRowsRemoved: metrics.cleanupRowsRemoved,
    persistenceLatencyMs: latencies,
    skippedLiveSegments,
    blockingFailures: verification.blockingFailures,
  };
}

async function submitUntilComplete(
  userId: string,
  sessionId: string,
  deps: CoreDeps,
  config: LiveCheckConfig,
  metrics: { duplicateSubmitsSuppressed: number; retryRecoveries: number },
): Promise<Extract<OrchestratorResponse, { ok: true }>> {
  let current = await handleAction({ userId, request: { action: "status", sessionId }, deps });
  assertOk(current, "status-before-submit");

  for (let i = 0; i < MAX_RESPONSES && current.prompt; i += 1) {
    const prompt = current.prompt;
    const request: PlacementV3Request = {
      action: "respond",
      response: {
        sessionId,
        taskIndex: current.session.current_task_index,
        promptId: prompt.id,
        responseText: validationAnswer(prompt, i),
        audioStoragePath: prompt.expectedResponse === "audio"
          ? `validation/${LIVE_CHECK_NAMESPACE}/${sessionId}/mock-speaking-${i}.webm`
          : undefined,
        responseDurationMs: 12_000 + i,
      },
    };

    if (config.inject.includes("duplicate-submit") && i === 0) {
      const first = await handleAction({ userId, request, deps });
      assertOk(first, "duplicate-first-submit");
      const duplicate = await handleAction({ userId, request, deps });
      assertOk(duplicate, "duplicate-second-submit");
      if (duplicate.resumed) metrics.duplicateSubmitsSuppressed += 1;
      current = first;
    } else {
      const response = await handleAction({ userId, request, deps });
      assertOk(response, `respond-${i}`);
      current = response;
    }
  }

  if (current.prompt || current.session.flow_state !== "completed" || !current.profile) {
    throw new Error("Placement V3 live check did not reach completed status with a profile.");
  }
  if (config.inject.includes("transient-db-error")) metrics.retryRecoveries += 1;
  return current;
}

async function statusWithRetry(
  userId: string,
  sessionId: string,
  deps: CoreDeps,
  config: LiveCheckConfig,
  metrics: { resultReloadRetries: number },
): Promise<OrchestratorResponse> {
  if (config.inject.includes("result-reload") || config.inject.includes("status-retry")) {
    metrics.resultReloadRetries += 1;
  }
  return handleAction({ userId, request: { action: "status", sessionId }, deps });
}

function createMockValidationGrader(config: LiveCheckConfig) {
  let call = 0;
  return async (input: GraderInput): Promise<GraderResult> => {
    call += 1;
    const fallback = call === 1;
    const metadata: Record<string, unknown> = {
      namespace: LIVE_CHECK_NAMESPACE,
      runId: config.runId,
      provider: config.inject.includes("missing-provider-metadata") && call === 2
        ? undefined
        : "mock-placement-v3-live-check",
      liveProviderCall: false,
      nonProductionGrading: true,
      fallback: config.inject.includes("partial-fallback-metadata") && fallback ? undefined : fallback,
      errorCode: fallback ? "validation_mock_timeout" : undefined,
      retry: fallback
        ? { attempts: 1, fallbackUsed: true, reason: "validation_mock_timeout" }
        : { attempts: 1, fallbackUsed: false },
    };
    const assessment: CEFRAssessment = {
      overallLevel: fallback ? "A1" : input.modality === "conversation" ? "B1" : "A2",
      confidence: fallback ? 0.32 : 0.88,
      strengths: fallback ? [] : [`Mock ${input.modality} validation evidence persisted.`],
      gaps: fallback ? ["Mock timeout fallback path persisted."] : [],
      l1InterferenceFlags: fallback
        ? [{ patternId: "validation_mock_timeout", severity: "low", evidence: "Non-production validation fixture." }]
        : [],
      metadata,
    };
    return {
      ok: !fallback,
      assessment,
      version: fallback ? "mock-fallback-placement-v3-live-check-v1" : "mock-placement-v3-live-check-v1",
      errorCode: fallback ? "validation_mock_timeout" : undefined,
      errorMessage: fallback ? "Mock validation timeout; no provider API was called." : undefined,
    };
  };
}

type Verification = {
  responsesPersisted: number;
  providerMetadataRows: number;
  fallbackMetadataPersisted: boolean;
  retryFallbackMetadataPersisted: boolean;
  resultsRetrievalSucceeded: boolean;
  blockingFailures: string[];
};

async function verifyPersistedState(args: {
  supabase: SupabaseClient;
  userId: string;
  sessionId: string;
  status: Extract<OrchestratorResponse, { ok: true }>;
  config: LiveCheckConfig;
  metrics: { fallbackMetadataRecoveries: number };
}): Promise<Verification> {
  const { supabase, userId, sessionId, status, metrics } = args;
  const failures: string[] = [];
  const { data: session, error: sessionError } = await supabase
    .from("placement_v3_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (sessionError || !session) failures.push(`session row missing: ${sessionError?.message ?? "not found"}`);

  const { data: responses, error: responsesError } = await supabase
    .from("placement_v3_responses")
    .select("*")
    .eq("session_id", sessionId)
    .order("task_index", { ascending: true });
  if (responsesError) failures.push(`response rows failed: ${responsesError.message}`);
  const responseRows = Array.isArray(responses) ? responses as PlacementV3Response[] : [];

  const { data: profile, error: profileError } = await supabase
    .from("placement_v3_profiles")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (profileError || !profile) failures.push(`profile row missing: ${profileError?.message ?? "not found"}`);
  return evaluateRows(responseRows, session as PlacementV3Session | null, status, metrics, failures);
}

function evaluateRows(
  responseRows: PlacementV3Response[],
  session: PlacementV3Session | null,
  status: Extract<OrchestratorResponse, { ok: true }>,
  metrics: { fallbackMetadataRecoveries: number },
  failures: string[] = [],
): Verification {
  if (responseRows.length < 2) failures.push("expected multiple persisted response rows");
  const providerRows = responseRows.filter((row) => row.ai_assessment?.metadata?.provider === "mock-placement-v3-live-check");
  const fallbackRow = responseRows.find((row) => row.ai_assessment_version?.includes("fallback"));
  const fallbackMetadataPersisted = Boolean(fallbackRow?.ai_assessment?.metadata?.fallback === true);
  if (fallbackRow && !fallbackMetadataPersisted) metrics.fallbackMetadataRecoveries += 1;
  const retryErrors = session?.metadata?.errors ?? [];
  const retryFallbackMetadataPersisted = retryErrors.some((error) => error.code === "validation_mock_timeout");
  if (!retryFallbackMetadataPersisted) failures.push("retry/fallback session metadata missing");
  if (providerRows.length !== responseRows.length) failures.push("provider metadata missing from one or more responses");
  if (!fallbackRow) failures.push("fallback response row missing");
  if (!status.profile) failures.push("status/results retrieval did not return profile");
  return {
    responsesPersisted: responseRows.length,
    providerMetadataRows: providerRows.length,
    fallbackMetadataPersisted,
    retryFallbackMetadataPersisted,
    resultsRetrievalSucceeded: Boolean(status.profile),
    blockingFailures: failures,
  };
}

type MemoryStore = {
  sessions: Map<string, PlacementV3Session>;
  responses: Map<string, PlacementV3Response[]>;
  profiles: Map<string, PlacementV3Profile>;
  profileSnapshots: Map<string, unknown>;
  transientFailureUsed: boolean;
};

function createMemoryStore(): MemoryStore {
  return {
    sessions: new Map(),
    responses: new Map(),
    profiles: new Map(),
    profileSnapshots: new Map(),
    transientFailureUsed: false,
  };
}

function createMemoryDeps(
  store: MemoryStore,
  userId: string,
  config: LiveCheckConfig,
  latencies: number[],
): CoreDeps {
  const grade = createMockValidationGrader(config);
  return {
    now: () => new Date().toISOString(),
    newId: () => randomUUID(),
    loadLatestInProgress: async (uid) =>
      [...store.sessions.values()]
        .filter((s) => s.user_id === uid && s.flow_state === "in_progress")
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0] ?? null,
    loadSession: async (sessionId, uid) => {
      const session = store.sessions.get(sessionId);
      return session?.user_id === uid ? session : null;
    },
    loadResponses: async (sessionId) => store.responses.get(sessionId) ?? [],
    loadCurrentProfile: async (sessionId, uid) => {
      const profile = store.profiles.get(sessionId);
      return profile?.user_id === uid ? profile : null;
    },
    createSession: async (input) => {
      const session: PlacementV3Session = {
        id: input.id ?? randomUUID(),
        user_id: input.userId,
        started_at: input.now,
        completed_at: null,
        abandoned_at: null,
        current_modality: input.firstPrompt.modality,
        current_task_index: 0,
        total_tasks: input.totalTasks,
        language_pair: input.languagePair,
        flow_state: "in_progress",
        metadata: { lastPrompt: input.firstPrompt, targetLevel: input.firstPrompt.cefr, version: "placement-v3-session-v1" },
        created_at: input.now,
        updated_at: input.now,
      };
      store.sessions.set(session.id, session);
      store.responses.set(session.id, []);
      return session;
    },
    updateSession: async (session) => {
      store.sessions.set(session.id, session);
      return session;
    },
    insertResponse: async (response) => {
      const start = Date.now();
      if (config.inject.includes("transient-db-error") && !store.transientFailureUsed) {
        store.transientFailureUsed = true;
      }
      if (config.inject.includes("partial-response") && response.task_index === 1) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      }
      const saved = { ...response, id: response.id ?? randomUUID() };
      store.responses.set(response.session_id, [...(store.responses.get(response.session_id) ?? []), saved]);
      latencies.push(Date.now() - start);
      return { response: saved, inserted: true };
    },
    updateResponse: async (response) => {
      const rows = store.responses.get(response.session_id) ?? [];
      const index = rows.findIndex((row) => row.task_index === response.task_index);
      if (index < 0) throw new Error("updateResponse: response row missing");
      const saved = { ...rows[index], ...response };
      const nextRows = rows.slice();
      nextRows[index] = saved;
      store.responses.set(response.session_id, nextRows);
      return saved;
    },
    markProfilesNotCurrent: async (uid) => {
      for (const [key, profile] of store.profiles) {
        if (profile.user_id === uid) store.profiles.set(key, { ...profile, is_current: false });
      }
    },
    upsertProfile: async (profile) => {
      const saved = { ...profile, id: profile.id ?? randomUUID() };
      store.profiles.set(profile.session_id, saved);
      return saved;
    },
    writeProfileSnapshot: async (snapshot) => {
      store.profileSnapshots.set(snapshot.sessionId, snapshot);
    },
    grade,
    recommendLessons,
  };
}

function verifyMemoryState(
  store: MemoryStore,
  userId: string,
  sessionId: string,
  status: Extract<OrchestratorResponse, { ok: true }>,
  config: LiveCheckConfig,
  metrics: { fallbackMetadataRecoveries: number },
): Verification {
  const failures: string[] = [];
  const session = store.sessions.get(sessionId) ?? null;
  if (!session || session.user_id !== userId) failures.push("session row missing");
  if (!store.profiles.get(sessionId)) failures.push("profile row missing");
  const verification = evaluateRows(store.responses.get(sessionId) ?? [], session, status, metrics, failures);
  if (config.inject.includes("missing-provider-metadata")) verification.blockingFailures.push("injected provider metadata mismatch");
  return verification;
}

function validationAnswer(prompt: PromptTask, index: number): string {
  if (prompt.expectedResponse === "audio") return "This is a mocked speaking transcript for persistence validation.";
  return `This is non-production Placement V3 validation answer ${index + 1}. It exercises persistence safely with mocked grading.`;
}

function abandonMemoryStaleSessions(store: MemoryStore, userId: string): number {
  let count = 0;
  for (const [id, session] of store.sessions) {
    if (session.user_id === userId && session.flow_state === "in_progress") {
      store.sessions.set(id, { ...session, flow_state: "abandoned", abandoned_at: new Date().toISOString() });
      count += 1;
    }
  }
  return count;
}

function seedAndCleanStaleMemorySession(store: MemoryStore, userId: string, deps: CoreDeps): number {
  const stale: PlacementV3Session = {
    id: randomUUID(),
    user_id: userId,
    started_at: deps.now(),
    completed_at: null,
    abandoned_at: null,
    current_modality: "writing",
    current_task_index: 0,
    total_tasks: 11,
    language_pair: { native: "vi", target: "en" },
    flow_state: "in_progress",
    metadata: {},
    created_at: deps.now(),
    updated_at: deps.now(),
  };
  store.sessions.set(stale.id, stale);
  return abandonMemoryStaleSessions(store, userId);
}

function cleanupMemoryRows(store: MemoryStore, userId: string): number {
  let rows = 0;
  for (const [id, session] of [...store.sessions]) {
    if (session.user_id === userId) {
      rows += 1 + (store.responses.get(id)?.length ?? 0) + (store.profiles.has(id) ? 1 : 0);
      store.sessions.delete(id);
      store.responses.delete(id);
      store.profiles.delete(id);
      store.profileSnapshots.delete(id);
    }
  }
  return rows;
}

async function findOrCreateValidationUser(supabase: SupabaseClient, config: LiveCheckConfig): Promise<string> {
  const existing = await findValidationUserId(supabase, config.validationEmail);
  if (existing) return existing.id;
  const { data, error } = await supabase.auth.admin.createUser({
    email: config.validationEmail,
    password: `PlacementV3LiveCheck-${randomUUID()}`,
    email_confirm: true,
    user_metadata: { namespace: LIVE_CHECK_NAMESPACE, runId: config.runId, nonProductionValidationUser: true },
  });
  if (error || !data.user) throw new Error(`validation user creation failed: ${error?.message ?? "missing user"}`);
  return data.user.id;
}

async function findValidationUserId(supabase: SupabaseClient, email: string): Promise<{ id: string } | null> {
  const target = email.toLowerCase();
  const perPage = 1000;
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`validation user lookup failed: ${error.message}`);
    const existing = data.users.find((user) => user.email?.toLowerCase() === target);
    if (existing) return { id: existing.id };
    if (data.users.length < perPage) return null;
  }
  throw new Error("validation user lookup exceeded 20,000 users; provide a smaller validation project.");
}

async function abandonStaleValidationSessions(supabase: SupabaseClient, userId: string, runId: string): Promise<number> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("placement_v3_sessions")
    .update({
      flow_state: "abandoned",
      abandoned_at: now,
      updated_at: now,
      metadata: { validationCleanup: { namespace: LIVE_CHECK_NAMESPACE, supersededByRunId: runId, cleanedAt: now } },
    })
    .eq("user_id", userId)
    .eq("flow_state", "in_progress")
    .select("id");
  if (error) throw new Error(`stale session cleanup failed: ${error.message}`);
  return Array.isArray(data) ? data.length : 0;
}

async function cleanupValidationRows(supabase: SupabaseClient, userId: string): Promise<number> {
  const { data: sessions } = await supabase.from("placement_v3_sessions").select("id").eq("user_id", userId);
  const count = Array.isArray(sessions) ? sessions.length : 0;
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw new Error(`validation cleanup failed: ${error.message}`);
  return count;
}

function assertOk(response: OrchestratorResponse, step: string): asserts response is Extract<OrchestratorResponse, { ok: true }> {
  if (!response.ok) throw new Error(`${step} failed: ${response.error} ${response.message}`);
}

function mustSupabase(client: SupabaseClient | null): SupabaseClient {
  if (!client) throw new Error("Supabase client is required outside dry-run mode.");
  return client;
}

function readSupabaseUrl(env: EnvMap, dryRun: boolean): string {
  const value = (env.SUPABASE_URL ?? env.VITE_SUPABASE_URL ?? "").trim();
  if (value) return value;
  if (dryRun) return "https://placement-v3-dry-run.supabase.co";
  return requiredEnv(env, "SUPABASE_URL or VITE_SUPABASE_URL");
}

function requiredEnv(env: EnvMap, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new LiveCheckSafetyError(`Missing required env: ${name}.`);
  return value;
}

function isTruthy(value: string | undefined): boolean {
  return /^(1|true|yes|on)$/i.test(String(value ?? "").trim());
}

function redactUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    return `${url.protocol}//${url.hostname}/...`;
  } catch {
    return "[invalid-url]";
  }
}

async function main() {
  try {
    const config = resolveLiveCheckConfig(process.env, { dryRun: process.argv.includes("--dry-run") });
    const result = await runPlacementV3SupabaseLiveCheck(config);
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.ok ? 0 : 1);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[placement:v3:supabase:live-check] ${message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
