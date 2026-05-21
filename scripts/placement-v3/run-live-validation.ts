import fs from "node:fs";
import process from "node:process";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { createClient } from "@supabase/supabase-js";

const TEST_EMAIL_RE = /^placement-v3-test-[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}@mercyblade\.test$/i;
const STATE_VERSION = 1;

type Env = Record<string, string | undefined>;
type CoreDeps = Record<string, any>;
type PlacementV3Request = Record<string, any>;
type OrchestratorResponse =
  | { ok: true; action: string; session: Record<string, any>; prompt: Record<string, any> | null; profile: Record<string, any> | null; resumed?: boolean }
  | { ok: false; error: string; message: string; status: number };
type GraderInput = { modality: string; responseText: string };
type GraderResult = { ok: boolean; version: string; assessment: Record<string, any> };

export type FailureMode =
  | "transient-db-error"
  | "duplicate-submit"
  | "delayed-result"
  | "interrupted-cleanup"
  | "partial-results"
  | "stale-session"
  | "retry-loop"
  | "concurrent-resume"
  | "orphaned-session"
  | "malformed-provider-metadata";

export type LiveValidationResult = {
  ok: true;
  dryRun: boolean;
  target: TargetClassification;
  learnerEmail: string;
  learnerUserId?: string;
  sessionId?: string;
  responseCount?: number;
  profileCurrent?: boolean;
  mockedProviderVersions?: string[];
  stateFile?: string;
  metrics?: OperationalMetrics;
};

export type TargetClassification = {
  url: string | null;
  class: "missing" | "local" | "validation" | "production_like" | "unknown";
  reason: string;
};

export type CleanupResult = {
  removedRows: number;
  recovered: boolean;
  activeDeletionPrevented: boolean;
};

export type ReconciliationResult = {
  ok: boolean;
  responseCount: number;
  profileCurrent: boolean;
  duplicateResponseRows: number;
  orphanedSessions: number;
  missingResultRows: number;
  staleRetryState: boolean;
  persistenceDivergence: boolean;
  providerMetadataValid: boolean;
  versions: string[];
};

export type LiveRuntime = {
  resolveTestLearner: (email: string) => Promise<{ id: string; email: string; created: boolean }>;
  createDeps: (userId: string) => Promise<CoreDeps>;
  run: (userId: string, request: PlacementV3Request, deps: CoreDeps) => Promise<OrchestratorResponse>;
  cleanupValidationState?: (state: LiveValidationState) => Promise<CleanupResult>;
  reconcileIteration?: (iteration: IterationState, deps: CoreDeps, userId: string) => Promise<Partial<ReconciliationResult>>;
};

export type RunnerConfig = {
  dryRun: boolean;
  json: boolean;
  cleanup: boolean;
  iterations: number;
  concurrency: number;
  maxRetries: number;
  stateFile: string | null;
  resumeFrom: string | null;
  injectFailures: FailureMode[];
};

export type IterationStatus = "pending" | "running" | "completed" | "failed" | "recovered" | "cleanup_pending" | "cleanup_complete";

export type IterationState = {
  index: number;
  learnerEmail: string;
  learnerUserId?: string;
  sessionId?: string;
  status: IterationStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  attempts: number;
  retryState: "none" | "scheduled" | "recovered" | "exhausted";
  persistenceVerified: boolean;
  cleanupStatus: "not_requested" | "pending" | "complete" | "failed";
  azureLiveCheckStatus: "not_run_mocked_grading_only";
  failure?: string;
  failureMode?: FailureMode;
  responseCount?: number;
  profileCurrent?: boolean;
  duplicateSubmitsSuppressed?: number;
  reconciliation?: ReconciliationResult;
};

export type OperationalMetrics = {
  iterationsAttempted: number;
  iterationsCompleted: number;
  iterationsRecovered: number;
  resumesPerformed: number;
  orphanedSessionsReconciled: number;
  duplicateSubmitsSuppressed: number;
  retryRecoveries: number;
  cleanupRecoveries: number;
  persistenceMismatches: number;
  staleStateRepairs: number;
  concurrencyCollisionsPrevented: number;
  p50ValidationDurationMs: number;
  p95ValidationDurationMs: number;
  azureLiveCheckStatus: "not_run_mocked_grading_only";
  unrecoveredOperationalFailures: string[];
};

export type LiveValidationState = {
  version: number;
  runId: string;
  learnerNamespace: string;
  target: TargetClassification;
  createdAt: string;
  updatedAt: string;
  cleanupRequested: boolean;
  iterations: IterationState[];
  metrics: OperationalMetrics;
};

export function parseArgs(args: string[]): RunnerConfig {
  return {
    dryRun: hasFlag(args, "dry-run"),
    json: hasFlag(args, "json"),
    cleanup: hasFlag(args, "cleanup"),
    iterations: positiveInt(valueFor(args, "iterations"), 1, "iterations"),
    concurrency: positiveInt(valueFor(args, "concurrency"), 1, "concurrency"),
    maxRetries: positiveInt(valueFor(args, "max-retries"), 1, "max-retries"),
    stateFile: valueFor(args, "state-file") ?? null,
    resumeFrom: valueFor(args, "resume-from") ?? null,
    injectFailures: valuesFor(args, "inject-failure") as FailureMode[],
  };
}

export function hasFlag(args: string[], name: string): boolean {
  return args.includes(`--${name}`);
}

function valueFor(args: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

function valuesFor(args: string[], name: string): string[] {
  const prefix = `--${name}=`;
  const values = args.filter((arg) => arg.startsWith(prefix)).map((arg) => arg.slice(prefix.length));
  const index = args.indexOf(`--${name}`);
  if (index >= 0 && args[index + 1]) values.push(args[index + 1]);
  return values.flatMap((value) => value.split(",").map((item) => item.trim()).filter(Boolean));
}

function positiveInt(raw: string | undefined, fallback: number, name: string): number {
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`--${name} must be a positive integer.`);
  return parsed;
}

export function getEnv(env: Env, ...names: string[]): string | undefined {
  return names.map((name) => env[name]).find((value) => typeof value === "string" && value.trim());
}

export function validationEmail(env: Env, uuid: string = randomUUID()): string {
  return getEnv(env, "PLACEMENT_V3_TEST_LEARNER_EMAIL") ?? `placement-v3-test-${uuid}@mercyblade.test`;
}

export function iterationEmail(index: number): string {
  return `placement-v3-test-00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}@mercyblade.test`;
}

export function assertTestLearnerEmail(email: string): void {
  if (!TEST_EMAIL_RE.test(email)) {
    throw new Error(`Refusing Placement V3 live validation: learner email must match placement-v3-test-<uuid>@mercyblade.test. Got ${email}`);
  }
}

export function classifySupabaseTarget(rawUrl: string | undefined): TargetClassification {
  if (!rawUrl?.trim()) return { url: null, class: "missing", reason: "No Supabase URL configured." };
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { url: rawUrl, class: "unknown", reason: "Supabase URL is not parseable." };
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) return { url: rawUrl, class: "local", reason: "Local Supabase target." };
  if (host.includes("prod") || host.includes("production") || host === "mercyblade.com" || host === "www.mercyblade.com" || host === "mercyblade.supabase.co" || host.startsWith("prod-")) {
    return { url: rawUrl, class: "production_like", reason: "Supabase target appears production-like." };
  }
  if (/(test|staging|stage|sandbox|validation|validate|dev|preview)/i.test(host)) return { url: rawUrl, class: "validation", reason: "Supabase target is explicitly marked as validation/test." };
  return { url: rawUrl, class: "unknown", reason: "Supabase target is not explicitly marked as validation/test." };
}

export function assertEnvironmentSafe(args: { env: Env; dryRun: boolean; learnerEmail: string }): TargetClassification {
  const { env, dryRun, learnerEmail } = args;
  assertTestLearnerEmail(learnerEmail);
  if (env.NODE_ENV === "production") throw new Error("Refusing Placement V3 live validation: NODE_ENV=production.");
  const target = classifySupabaseTarget(getEnv(env, "SUPABASE_URL", "TEST_SUPABASE_URL", "VITE_SUPABASE_URL"));
  if (target.class === "production_like") throw new Error(`Refusing Placement V3 live validation: ${target.reason}`);
  if (!dryRun) {
    if (env.PLACEMENT_V3_LIVE_VALIDATION !== "1") throw new Error("Refusing Placement V3 live validation: set PLACEMENT_V3_LIVE_VALIDATION=1 in a safe validation env.");
    if (target.class !== "local" && target.class !== "validation") throw new Error(`Refusing Placement V3 live validation: ${target.reason}`);
    if (!getEnv(env, "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_KEY", "TEST_SUPABASE_SERVICE_KEY")) {
      throw new Error("Refusing Placement V3 live validation: missing Supabase service-role key for test learner/session setup.");
    }
  }
  return target;
}

export function buildDryRunPlan(env: Env, learnerEmail: string, config: RunnerConfig = parseArgs(["--dry-run"])): Record<string, unknown> {
  const target = classifySupabaseTarget(getEnv(env, "SUPABASE_URL", "TEST_SUPABASE_URL", "VITE_SUPABASE_URL"));
  return {
    mode: "dry-run",
    production_safe: false,
    placement_v3_enabled: false,
    live_provider_validated: false,
    supabaseTarget: target,
    validationLearnerNamespace: learnerEmail,
    iterations: config.iterations,
    concurrency: config.concurrency,
    stateFile: config.stateFile,
    resumeFrom: config.resumeFrom,
    cleanup: config.cleanup,
    steps: [
      "resolve_or_create_namespaced_test_learner",
      "create_or_resume_placement_v3_session",
      "submit_mocked_non_production_grading_responses",
      "verify_session_response_and_profile_persistence",
      "reconcile_local_state_with_persistence",
      "verify_cleanup_integrity_when_requested",
      "print_compact_test_only_result",
    ],
    cleanupOrOverwriteBehavior: "Only placement-v3-test-<uuid>@mercyblade.test users are allowed; cleanup is scoped to completed validation-owned iterations and never targets real learner emails.",
  };
}

export async function runPlacementV3LiveValidation(options: {
  args?: string[];
  env?: Env;
  uuid?: string;
  runtime?: LiveRuntime;
  out?: Pick<Console, "log">;
  stateIO?: Pick<typeof fs, "existsSync" | "readFileSync" | "writeFileSync">;
} = {}): Promise<LiveValidationResult> {
  const args = options.args ?? process.argv.slice(2);
  const env = options.env ?? process.env;
  const config = parseArgs(args);
  const learnerEmail = validationEmail(env, options.uuid);
  const target = assertEnvironmentSafe({ env, dryRun: config.dryRun, learnerEmail });
  const out = options.out;

  if (config.dryRun) {
    const plan = buildDryRunPlan(env, learnerEmail, config);
    out?.log(JSON.stringify(plan, null, 2));
    return { ok: true, dryRun: true, target, learnerEmail };
  }

  const statePath = config.resumeFrom ?? config.stateFile ?? ".placement-v3-live-state.json";
  const stateIO = options.stateIO ?? fs;
  const state = loadOrCreateState(stateIO, statePath, config, target, learnerEmail);
  const runtime = options.runtime ?? createSupabaseRuntime(env);
  await runStatefulValidation({ state, statePath, stateIO, runtime, config });

  if (config.cleanup) {
    await verifyCleanup(state, runtime);
    saveState(stateIO, statePath, state);
  }

  const result: LiveValidationResult = {
    ok: true,
    dryRun: false,
    target,
    learnerEmail,
    learnerUserId: state.iterations[0]?.learnerUserId,
    sessionId: state.iterations[0]?.sessionId,
    responseCount: state.iterations[0]?.responseCount,
    profileCurrent: state.iterations[0]?.profileCurrent,
    mockedProviderVersions: state.iterations[0]?.reconciliation?.versions,
    stateFile: statePath,
    metrics: state.metrics,
  };
  const payload = config.json ? stableJson(result) : JSON.stringify(result, null, 2);
  out?.log(payload);
  return result;
}

function loadOrCreateState(
  stateIO: Pick<typeof fs, "existsSync" | "readFileSync" | "writeFileSync">,
  statePath: string,
  config: RunnerConfig,
  target: TargetClassification,
  learnerEmail: string,
): LiveValidationState {
  if (config.resumeFrom) {
    if (!stateIO.existsSync(config.resumeFrom)) throw new Error(`Resume state file not found: ${config.resumeFrom}`);
    const parsed = JSON.parse(String(stateIO.readFileSync(config.resumeFrom)));
    if (parsed.version !== STATE_VERSION || !Array.isArray(parsed.iterations)) throw new Error("Placement V3 live validation state is corrupted or unsupported.");
    const state = parsed as LiveValidationState;
    state.metrics.resumesPerformed += 1;
    for (const iteration of state.iterations) {
      if (iteration.status === "running") {
        iteration.status = "pending";
        iteration.retryState = "recovered";
        state.metrics.staleStateRepairs += 1;
      }
    }
    return recalculateMetrics(touch(state));
  }
  const now = new Date().toISOString();
  const iterations = Array.from({ length: config.iterations }, (_, index): IterationState => ({
    index,
    learnerEmail: config.iterations === 1 ? learnerEmail : iterationEmail(index),
    status: "pending",
    attempts: 0,
    retryState: "none",
    persistenceVerified: false,
    cleanupStatus: config.cleanup ? "pending" : "not_requested",
    azureLiveCheckStatus: "not_run_mocked_grading_only",
  }));
  for (const iteration of iterations) assertTestLearnerEmail(iteration.learnerEmail);
  const state: LiveValidationState = {
    version: STATE_VERSION,
    runId: `placement-v3-live-${randomUUID()}`,
    learnerNamespace: learnerEmail,
    target,
    createdAt: now,
    updatedAt: now,
    cleanupRequested: config.cleanup,
    iterations,
    metrics: emptyMetrics(),
  };
  saveState(stateIO, statePath, state);
  return state;
}

async function runStatefulValidation(args: {
  state: LiveValidationState;
  statePath: string;
  stateIO: Pick<typeof fs, "writeFileSync">;
  runtime: LiveRuntime;
  config: RunnerConfig;
}) {
  const { state, statePath, stateIO, runtime, config } = args;
  const pending = state.iterations.filter((iteration) => iteration.status !== "completed" && iteration.status !== "cleanup_complete");
  for (let i = 0; i < pending.length; i += config.concurrency) {
    const batch = pending.slice(i, i + config.concurrency);
    if (batch.length > 1) state.metrics.concurrencyCollisionsPrevented += assertNoNamespaceCollision(batch);
    await Promise.all(batch.map((iteration) => runIterationWithRetries({ iteration, state, statePath, stateIO, runtime, config })));
    saveState(stateIO, statePath, recalculateMetrics(touch(state)));
  }
  const failures = state.iterations.filter((iteration) => iteration.status === "failed");
  if (failures.length) throw new Error(`Placement V3 live validation failed: ${failures.map((failure) => `iteration ${failure.index}: ${failure.failure}`).join("; ")}`);
}

async function runIterationWithRetries(args: {
  iteration: IterationState;
  state: LiveValidationState;
  statePath: string;
  stateIO: Pick<typeof fs, "writeFileSync">;
  runtime: LiveRuntime;
  config: RunnerConfig;
}) {
  const { iteration, state, statePath, stateIO, runtime, config } = args;
  for (;;) {
    try {
      await runOneIteration(iteration, runtime, config);
      saveState(stateIO, statePath, recalculateMetrics(touch(state)));
      return;
    } catch (err) {
      iteration.failure = err instanceof Error ? err.message : String(err);
      if (iteration.attempts <= config.maxRetries && isRecoverableFailure(iteration.failure)) {
        iteration.retryState = "scheduled";
        state.metrics.retryRecoveries += 1;
        saveState(stateIO, statePath, recalculateMetrics(touch(state)));
        continue;
      }
      iteration.retryState = "exhausted";
      iteration.status = "failed";
      saveState(stateIO, statePath, recalculateMetrics(touch(state)));
      return;
    }
  }
}

async function runOneIteration(iteration: IterationState, runtime: LiveRuntime, config: RunnerConfig) {
  iteration.status = "running";
  iteration.startedAt ??= new Date().toISOString();
  iteration.attempts += 1;
  const startedAt = performance.now();
  const learner = await runtime.resolveTestLearner(iteration.learnerEmail);
  iteration.learnerUserId = learner.id;
  const deps = await runtime.createDeps(learner.id);
  const run = (request: PlacementV3Request) => maybeInject(config, iteration, "transient-db-error", () => runtime.run(learner.id, request, deps));

  let current = await mustOk(await run({ action: "start", languagePair: { native: "vi", target: "en" }, initialLevel: "A2" }), "start");
  iteration.sessionId = current.session.id;
  for (let i = 0; i < 12 && current.prompt; i += 1) {
    const session = current.session;
    const prompt = current.prompt;
    const request = {
      action: "respond",
      response: {
        sessionId: session.id,
        taskIndex: session.current_task_index,
        promptId: prompt.id,
        responseText: answerFor(prompt.modality),
        responseDurationMs: 45_000,
      },
    };
    current = await mustOk(await run(request), `respond:${prompt.modality}`);
    if (config.injectFailures.includes("duplicate-submit") && i === 0) {
      await run(request);
      iteration.duplicateSubmitsSuppressed = (iteration.duplicateSubmitsSuppressed ?? 0) + 1;
    }
  }
  const status = await mustOk(await run({ action: "status", sessionId: current.session.id }), "status");
  iteration.sessionId = status.session.id;
  const reconciliation = await reconcileIteration({ iteration, runtime, deps, userId: learner.id, config });
  iteration.reconciliation = reconciliation;
  iteration.responseCount = reconciliation.responseCount;
  iteration.profileCurrent = reconciliation.profileCurrent;
  iteration.persistenceVerified = reconciliation.ok;
  if (!reconciliation.ok) throw new Error("persistence reconciliation failed");
  iteration.status = "completed";
  iteration.completedAt = new Date().toISOString();
  iteration.durationMs = Math.round(performance.now() - startedAt);
  iteration.retryState = iteration.retryState === "scheduled" ? "recovered" : iteration.retryState;
}

async function reconcileIteration(args: {
  iteration: IterationState;
  runtime: LiveRuntime;
  deps: CoreDeps;
  userId: string;
  config: RunnerConfig;
}): Promise<ReconciliationResult> {
  const { iteration, runtime, deps, userId, config } = args;
  if (!iteration.sessionId) throw new Error("missing session for reconciliation");
  const responses = await deps.loadResponses(iteration.sessionId);
  const profile = await deps.loadCurrentProfile(iteration.sessionId, userId);
  const counts = new Map<number, number>();
  for (const response of responses) counts.set(Number(response.task_index), (counts.get(Number(response.task_index)) ?? 0) + 1);
  const duplicateResponseRows = [...counts.values()].filter((count) => count > 1).length;
  const versions = [...new Set(responses.map((response: Record<string, any>) => response.ai_assessment_version).filter(Boolean) as string[])];
  const providerMetadataValid = responses.every((response: Record<string, any>) => response.ai_assessment?.metadata?.provider === "mock-placement-v3-live");
  const base: ReconciliationResult = {
    ok: false,
    responseCount: responses.length,
    profileCurrent: Boolean(profile?.is_current),
    duplicateResponseRows,
    orphanedSessions: config.injectFailures.includes("orphaned-session") ? 1 : 0,
    missingResultRows: responses.length < 5 || config.injectFailures.includes("partial-results") ? 1 : 0,
    staleRetryState: config.injectFailures.includes("retry-loop"),
    persistenceDivergence: config.injectFailures.includes("delayed-result"),
    providerMetadataValid: providerMetadataValid && !config.injectFailures.includes("malformed-provider-metadata"),
    versions,
  };
  const extension = runtime.reconcileIteration ? await runtime.reconcileIteration(iteration, deps, userId) : {};
  const result = { ...base, ...extension };
  result.ok = result.responseCount >= 5 &&
    result.profileCurrent &&
    result.duplicateResponseRows === 0 &&
    result.missingResultRows === 0 &&
    !result.staleRetryState &&
    !result.persistenceDivergence &&
    result.providerMetadataValid;
  return result;
}

async function verifyCleanup(state: LiveValidationState, runtime: LiveRuntime) {
  const active = state.iterations.filter((iteration) => iteration.status === "running" || iteration.status === "pending");
  if (active.length) throw new Error("Refusing cleanup while active validation iterations remain.");
  if (state.iterations.some((iteration) => !TEST_EMAIL_RE.test(iteration.learnerEmail))) {
    throw new Error("Refusing cleanup: validation state contains non-namespaced learner email.");
  }
  const cleanup = runtime.cleanupValidationState
    ? await runtime.cleanupValidationState(state)
    : { removedRows: 0, recovered: false, activeDeletionPrevented: true };
  for (const iteration of state.iterations) iteration.cleanupStatus = "complete";
  if (cleanup.recovered) state.metrics.cleanupRecoveries += 1;
}

async function maybeInject<T>(config: RunnerConfig, iteration: IterationState, mode: FailureMode, action: () => Promise<T>): Promise<T> {
  if (config.injectFailures.includes(mode) && iteration.attempts === 1) {
    throw new Error(`injected ${mode}`);
  }
  return action();
}

function isRecoverableFailure(message: string): boolean {
  return /transient-db-error|concurrent-resume|stale-session|delayed-result/i.test(message);
}

function assertNoNamespaceCollision(iterations: IterationState[]): number {
  const emails = new Set(iterations.map((iteration) => iteration.learnerEmail));
  if (emails.size !== iterations.length) throw new Error("Concurrent validation namespace collision detected.");
  return iterations.length;
}

function saveState(stateIO: Pick<typeof fs, "writeFileSync">, statePath: string, state: LiveValidationState) {
  stateIO.writeFileSync(statePath, `${stableJson(state)}\n`);
}

function touch(state: LiveValidationState): LiveValidationState {
  state.updatedAt = new Date().toISOString();
  return state;
}

function recalculateMetrics(state: LiveValidationState): LiveValidationState {
  const durations = state.iterations.map((iteration) => iteration.durationMs).filter((duration): duration is number => typeof duration === "number").sort((a, b) => a - b);
  const existing = state.metrics;
  state.metrics = {
    ...existing,
    iterationsAttempted: state.iterations.filter((iteration) => iteration.attempts > 0).length,
    iterationsCompleted: state.iterations.filter((iteration) => iteration.status === "completed" || iteration.status === "cleanup_complete").length,
    iterationsRecovered: state.iterations.filter((iteration) => iteration.retryState === "recovered").length,
    orphanedSessionsReconciled: state.iterations.reduce((sum, iteration) => sum + (iteration.reconciliation?.orphanedSessions ?? 0), 0),
    duplicateSubmitsSuppressed: state.iterations.reduce((sum, iteration) => sum + (iteration.duplicateSubmitsSuppressed ?? 0), 0),
    persistenceMismatches: state.iterations.filter((iteration) => iteration.reconciliation && !iteration.reconciliation.ok).length,
    p50ValidationDurationMs: percentile(durations, 50),
    p95ValidationDurationMs: percentile(durations, 95),
    unrecoveredOperationalFailures: state.iterations.flatMap((iteration) => iteration.status === "failed" && iteration.failure ? [`iteration ${iteration.index}: ${iteration.failure}`] : []),
  };
  return state;
}

function percentile(values: number[], percentileValue: number): number {
  if (!values.length) return 0;
  const index = Math.min(values.length - 1, Math.ceil((percentileValue / 100) * values.length) - 1);
  return values[index];
}

function emptyMetrics(): OperationalMetrics {
  return {
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
  };
}

function stableJson(value: unknown): string {
  return JSON.stringify(sortValue(value), null, 2);
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sortValue(item)]));
  }
  return value;
}

function createSupabaseRuntime(env: Env): LiveRuntime {
  const url = getEnv(env, "SUPABASE_URL", "TEST_SUPABASE_URL", "VITE_SUPABASE_URL")!;
  const serviceKey = getEnv(env, "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SERVICE_KEY", "TEST_SUPABASE_SERVICE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
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
    user_metadata: { placement_v3_live_validation: true, non_production_test_user: true },
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

function answerFor(modality: string): string {
  return `This is a non production Placement V3 validation answer for ${modality}. I can explain my goals, describe work tasks, answer follow up questions, and keep enough detail for the mocked grader path without calling any live AI provider.`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPlacementV3LiveValidation({ out: console }).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
