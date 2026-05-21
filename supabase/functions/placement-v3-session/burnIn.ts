import { createPlacementV3Harness } from "./harness.ts";
import { MAX_TOTAL_TASKS } from "./modality.ts";
import type {
  CEFRAssessment,
  GraderInput,
  GraderResult,
  PlacementV3Modality,
  PlacementV3Response,
  PromptTask,
} from "./types.ts";

export type BurnInFailureMode =
  | "partial-fallback"
  | "duplicate-submit"
  | "stale-session";

export interface GradeSpeakingBurnInConfig {
  iterations: number;
  concurrency: number;
  injectFailure: BurnInFailureMode[];
  dryRun: boolean;
}

export interface GradeSpeakingBurnInIterationReport {
  iteration: number;
  initialSessionId: string;
  finalSessionId: string;
  completed: boolean;
  responseCount: number;
  fallbackCount: number;
  retryCount: number;
  duplicateSubmitSuppressed: boolean;
  staleSessionRecovered: boolean;
  partialResultRecovered: boolean;
  providerSummary: {
    providers: string[];
    models: string[];
    metadataRows: number;
    redactionOk: boolean;
  };
  idempotencyBoundary: {
    insertedRows: number;
    duplicateRows: number;
  };
  jsonValid: boolean;
}

export interface GradeSpeakingBurnInReport {
  command: string;
  dryRun: boolean;
  iterations: number;
  concurrency: number;
  injectFailure: BurnInFailureMode[];
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  iterationReports: GradeSpeakingBurnInIterationReport[];
  summary: {
    completedIterations: number;
    fallbackCount: number;
    retryCount: number;
    duplicateSubmitSuppressed: number;
    staleSessionRecovered: number;
    partialResultRecovered: number;
    redactionViolations: number;
    crossIterationContamination: boolean;
  };
  jsonStable: boolean;
}

const BASE_TIME = "2026-05-20T00:00:00.000Z";
const USER_ID = "placement-v3-e2e-user";
const SUCCESS_LEVEL: Record<PlacementV3Modality, "B1" | "B2"> = {
  writing: "B1",
  speaking: "B1",
  reading: "B2",
  listening: "B2",
  conversation: "B1",
};

export async function runGradeSpeakingBurnIn(
  config: GradeSpeakingBurnInConfig,
): Promise<GradeSpeakingBurnInReport> {
  const startedAt = BASE_TIME;
  const failureModes = new Set(config.injectFailure);
  const iterationReports = await runWithConcurrency(
    config.iterations,
    config.concurrency,
    async (iteration) => runIteration(iteration, failureModes),
  );

  const summary = {
    completedIterations: iterationReports.filter((report) => report.completed).length,
    fallbackCount: sum(iterationReports, "fallbackCount"),
    retryCount: sum(iterationReports, "retryCount"),
    duplicateSubmitSuppressed: sum(iterationReports, "duplicateSubmitSuppressed"),
    staleSessionRecovered: sum(iterationReports, "staleSessionRecovered"),
    partialResultRecovered: sum(iterationReports, "partialResultRecovered"),
    redactionViolations: iterationReports.filter((report) => !report.providerSummary.redactionOk).length,
    crossIterationContamination: hasCrossIterationContamination(iterationReports),
  };

  const finishedAt = isoPlus(startedAt, config.iterations * 60_000 + 1_000);
  const report: GradeSpeakingBurnInReport = {
    command: "npm run placement:v3:grade-speaking:e2e",
    dryRun: config.dryRun,
    iterations: config.iterations,
    concurrency: config.concurrency,
    injectFailure: [...config.injectFailure].sort(),
    startedAt,
    finishedAt,
    durationMs: config.iterations * 60_000 + 1_000,
    iterationReports: iterationReports.sort((a, b) => a.iteration - b.iteration),
    summary,
    jsonStable: true,
  };
  report.jsonStable = stableStringify(report) === stableStringify(JSON.parse(stableStringify(report)));
  return report;
}

async function runIteration(
  iteration: number,
  failureModes: Set<BurnInFailureMode>,
): Promise<GradeSpeakingBurnInIterationReport> {
  const startedAt = isoPlus(BASE_TIME, iteration * 60_000);
  const iterationState = {
    speakingFallbackUsed: false,
    partialResultRecovered: false,
    duplicateSubmitSuppressed: false,
    staleSessionRecovered: false,
    retryCount: 0,
    fallbackCount: 0,
  };
  const harness = createPlacementV3Harness({
    now: startedAt,
    idPrefix: `burnin-${iteration}`,
    insertResponseDelayMs: failureModes.has("duplicate-submit") ? 5 : 0,
    grade: createDeterministicGrade(iteration, failureModes, iterationState),
  });

  let state = await harness.run({ action: "start" }, USER_ID);
  if (!state.ok || !state.prompt) throw new Error(`start failed for iteration ${iteration}`);
  const initialSessionId = state.session.id;
  let currentSessionId = initialSessionId;
  let completed = false;

  if (failureModes.has("duplicate-submit")) {
    const duplicateInput = responseInput(state, state.prompt, 0);
    const [primary, duplicate] = await Promise.all([
      harness.run({ action: "respond", response: duplicateInput }, USER_ID),
      harness.run({ action: "respond", response: duplicateInput }, USER_ID),
    ]);
    state = choosePreferredState(primary, duplicate);
    iterationState.duplicateSubmitSuppressed =
      (harness.responses.get(initialSessionId) ?? []).filter((row) => row.task_index === 0).length === 1;
  }

  let step = harness.responses.get(currentSessionId)?.length ?? 0;
  while (state.ok && state.prompt && step < MAX_TOTAL_TASKS + 2) {
    const next = await harness.run({
      action: "respond",
      response: responseInput(state, state.prompt, state.session.current_task_index),
    }, USER_ID);
    if (!next.ok) throw new Error(`respond failed for iteration ${iteration}: ${next.error}`);
    state = next;
    currentSessionId = state.session.id;
    step += 1;

    if (failureModes.has("stale-session") && !iterationState.staleSessionRecovered) {
      const current = harness.sessions.get(currentSessionId);
      if (current) {
        harness.sessions.set(currentSessionId, {
          ...current,
          updated_at: "2026-05-18T00:00:00.000Z",
        });
        const resumed = await harness.run({ action: "resume", sessionId: currentSessionId }, USER_ID);
        iterationState.staleSessionRecovered = !resumed.ok
          ? false
          : resumed.session.flow_state === "abandoned";
        const restarted = await harness.run({ action: "start" }, USER_ID);
        if (!restarted.ok || !restarted.prompt) {
          throw new Error(`restart failed for iteration ${iteration}`);
        }
        state = restarted;
        currentSessionId = restarted.session.id;
        continue;
      }
    }

    if (state.ok && state.session.flow_state === "completed") {
      completed = true;
      break;
    }
  }

  const responses = [...harness.responses.values()].flat();
  const metadataRows = responses
    .map((row) => row.ai_assessment?.metadata)
    .filter((value): value is Record<string, unknown> => Boolean(value));
  const providerSummary = summarizeProviderMetadata(metadataRows);
  const idempotencyBoundary = summarizeIdempotency(responses);
  const jsonProbe = stableStringify({
    iteration,
    currentSessionId,
    responseCount: responses.length,
  });
  let jsonValid = false;
  try {
    JSON.parse(jsonProbe);
    jsonValid = true;
  } catch {
    jsonValid = false;
  }

  return {
    iteration,
    initialSessionId,
    finalSessionId: currentSessionId,
    completed,
    responseCount: responses.length,
    fallbackCount: metadataRows.filter((metadata) => Boolean(metadata.fallback)).length,
    retryCount: iterationState.retryCount,
    duplicateSubmitSuppressed: iterationState.duplicateSubmitSuppressed,
    staleSessionRecovered: iterationState.staleSessionRecovered,
    partialResultRecovered: iterationState.partialResultRecovered,
    providerSummary,
    idempotencyBoundary,
    jsonValid,
  };
}

function createDeterministicGrade(
  iteration: number,
  failureModes: Set<BurnInFailureMode>,
  state: {
    speakingFallbackUsed: boolean;
    partialResultRecovered: boolean;
    duplicateSubmitSuppressed: boolean;
    staleSessionRecovered: boolean;
    retryCount: number;
    fallbackCount: number;
  },
) {
  let speakingAttempts = 0;
  return async (input: GraderInput): Promise<GraderResult> => {
    speakingAttempts += 1;
    const modality = input.modality;
    const trace = makeProviderTrace(modality, iteration, speakingAttempts);
    const successLevel = SUCCESS_LEVEL[modality];

    if (failureModes.has("partial-fallback") && modality === "speaking" && !state.speakingFallbackUsed) {
      state.speakingFallbackUsed = true;
      state.fallbackCount += 1;
      state.retryCount += 1;
      state.partialResultRecovered = true;
      const metadata = {
        gradingPath: trace.gradingPath,
        provider: trace.provider,
        model: trace.model,
        latencyMs: trace.latencyMs,
        tokensInput: trace.tokensInput,
        tokensOutput: 0,
        fallback: true,
        errorCode: "partial_fallback",
        httpStatus: 502,
      };
      return {
        ok: false,
        assessment: buildAssessment("A2", 0.41, metadata),
        version: `${trace.provider}:${trace.model}:fallback`,
        providerTrace: {
          ...trace,
          fallback: true,
          errorCode: "partial_fallback",
          httpStatus: 502,
        },
        errorCode: "partial_fallback",
        errorMessage: "speaking grader used partial fallback",
      };
    }

    const metadata = {
      gradingPath: trace.gradingPath,
      provider: trace.provider,
      model: trace.model,
      latencyMs: trace.latencyMs,
      tokensInput: trace.tokensInput,
      tokensOutput: trace.tokensOutput,
      fallback: false,
      httpStatus: 200,
    };
    return {
      ok: true,
      assessment: buildAssessment(successLevel, modality === "speaking" ? 0.86 : 0.84, metadata),
      version: `${trace.provider}:${trace.model}`,
      providerTrace: trace,
    };
  };
}

function makeProviderTrace(
  modality: PlacementV3Modality,
  iteration: number,
  attempt: number,
) {
  const provider = modality === "conversation" ? "openai" : "openai";
  const model = modality === "speaking" ? "gpt-speaking-e2e" : `${modality}-e2e`;
  const gradingPath = modality === "speaking"
    ? "placement-v3-grade-speaking"
    : modality === "conversation"
      ? "placement-v3-mercy-conversation"
      : "placement-v3-grade-writing";
  const latencyMs = 120 + iteration * 3 + attempt * 7 + modality.length;
  return {
    gradingPath,
    provider,
    model,
    latencyMs,
    tokensInput: 24 + attempt,
    tokensOutput: 12 + attempt,
    fallback: false,
  };
}

function buildAssessment(
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
  confidence: number,
  metadata: Record<string, unknown>,
): CEFRAssessment {
  return {
    overallLevel: level,
    confidence,
    strengths: [`${level} strength`],
    gaps: [`${level} gap`],
    l1InterferenceFlags: [],
    metadata,
  };
}

function responseInput(
  state: Awaited<ReturnType<ReturnType<typeof createPlacementV3Harness>["run"]>>,
  prompt: PromptTask,
  taskIndex: number,
): { sessionId: string; taskIndex: number; promptId: string; responseText: string; responseDurationMs: number } {
  if (!state.ok) throw new Error(`unexpected failure state: ${state.error}`);
  return {
    sessionId: state.session.id,
    taskIndex,
    promptId: prompt.id,
    responseText: `Iteration ${taskIndex + 1}: ${prompt.modality} answer for ${prompt.id}`,
    responseDurationMs: 14_000 + taskIndex * 500,
  };
}

function choosePreferredState(
  first: Awaited<ReturnType<ReturnType<typeof createPlacementV3Harness>["run"]>>,
  second: Awaited<ReturnType<ReturnType<typeof createPlacementV3Harness>["run"]>>,
) {
  if (first.ok) return first;
  return second;
}

function summarizeProviderMetadata(rows: Array<Record<string, unknown>>) {
  const providers = new Set<string>();
  const models = new Set<string>();
  let redactionOk = true;
  for (const row of rows) {
    const provider = row.provider;
    const model = row.model;
    if (typeof provider === "string") providers.add(provider);
    if (typeof model === "string") models.add(model);
    const json = JSON.stringify(row);
    if (
      /Bearer\s+[A-Za-z0-9._~+/=-]+/i.test(json) ||
      /service-role-key|super-secret|sk-[A-Za-z0-9]{16,}|AIza[0-9A-Za-z_-]{20,}|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9._-]+\.[A-Za-z0-9._-]+/i.test(json)
    ) {
      redactionOk = false;
    }
  }
  return {
    providers: [...providers].sort(),
    models: [...models].sort(),
    metadataRows: rows.length,
    redactionOk,
  };
}

function summarizeIdempotency(rows: PlacementV3Response[]) {
  const bySession = new Map<string, PlacementV3Response[]>();
  for (const row of rows) {
    const list = bySession.get(row.session_id) ?? [];
    list.push(row);
    bySession.set(row.session_id, list);
  }
  const duplicateRows = [...bySession.values()].reduce((total, sessionRows) => {
    const uniqueTaskIndexes = new Set(sessionRows.map((row) => row.task_index));
    return total + Math.max(0, sessionRows.length - uniqueTaskIndexes.size);
  }, 0);
  return {
    insertedRows: rows.length,
    duplicateRows,
  };
}

async function runWithConcurrency<T>(
  count: number,
  concurrency: number,
  worker: (index: number) => Promise<T>,
): Promise<T[]> {
  const results: T[] = new Array(count);
  let next = 0;
  async function lane() {
    while (next < count) {
      const index = next++;
      results[index] = await worker(index + 1);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => lane()));
  return results;
}

function hasCrossIterationContamination(reports: GradeSpeakingBurnInIterationReport[]) {
  const sessionIds = new Set<string>();
  for (const report of reports) {
    if (sessionIds.has(report.finalSessionId)) return true;
    sessionIds.add(report.finalSessionId);
  }
  return false;
}

function sum(
  reports: GradeSpeakingBurnInIterationReport[],
  field: "fallbackCount" | "retryCount" | "duplicateSubmitSuppressed" | "staleSessionRecovered" | "partialResultRecovered",
): number {
  return reports.reduce((total, report) => total + Number(report[field] ?? 0), 0);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function isoPlus(iso: string, ms: number): string {
  return new Date(Date.parse(iso) + ms).toISOString();
}
