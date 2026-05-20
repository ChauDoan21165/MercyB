#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { handleAction, type CoreDeps } from "../../supabase/functions/placement-v3-session/core.ts";
import { createHttpWritingGrader } from "../../supabase/functions/placement-v3-session/graderClient.ts";
import { makeSession, recommendLessons } from "../../supabase/functions/placement-v3-session/persistence.ts";
import type {
  GraderInput,
  OrchestratorResponse,
  PlacementV3Profile,
  PlacementV3Request,
  PlacementV3Response,
  PlacementV3Session,
  Recommendation,
} from "../../supabase/functions/placement-v3-session/types.ts";
import { classifyEnduranceFailure } from "../../src/lib/placement/v3/classifyEnduranceFailures.ts";

type Scenario =
  | "baseline"
  | "resume"
  | "abandon"
  | "duplicate_submission"
  | "retry_storm"
  | "browser_refresh"
  | "interrupted_persistence"
  | "delayed_grading"
  | "fallback_grading"
  | "partial_recommendation_failure"
  | "timeout_recovery"
  | "final_stability";

type Stored = {
  sessions: Map<string, PlacementV3Session>;
  responses: Map<string, PlacementV3Response[]>;
  profiles: Map<string, PlacementV3Profile>;
  persistenceWrites: Map<string, number>;
};

type RunMetric = {
  runId: string;
  iteration: number;
  scenario: Scenario;
  timestamp: string;
  durationMs: number;
  pass: boolean;
  memory: NodeJS.MemoryUsage;
  retries: number;
  fallbacks: number;
  timeouts: number;
  duplicateSubmissions: number;
  persistenceErrors: number;
  recommendationErrors: number;
  cefrOutcome: string | null;
  completionState: string | null;
  sessionId: string | null;
  responses: number;
  failures: Array<{
    category: string;
    severity: string;
    signature: string;
    reason: string;
    message: string;
  }>;
};

const LONG_ANSWER =
  "I use English at work to write emails, explain customer problems, and discuss plans with colleagues. I still make mistakes with articles, verb tense, and final consonants, but I can explain my goals clearly and give examples from daily work.";

function arg(name: string, fallback: string): string {
  const flag = `--${name}=`;
  return process.argv.find((value) => value.startsWith(flag))?.slice(flag.length) ?? fallback;
}

function boolArg(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function memoryMb(value: number): number {
  return Math.round((value / 1024 / 1024) * 100) / 100;
}

function scenarioFor(iteration: number, total: number): Scenario {
  if (iteration <= 10) return "baseline";
  if (iteration <= 35) return iteration % 7 === 0 ? "resume" : "baseline";
  if (iteration <= 60) return iteration % 9 === 0 ? "browser_refresh" : "baseline";
  if (iteration <= 75) {
    const scenarios: Scenario[] = [
      "abandon",
      "duplicate_submission",
      "retry_storm",
      "interrupted_persistence",
      "delayed_grading",
      "fallback_grading",
      "partial_recommendation_failure",
      "timeout_recovery",
      "resume",
      "browser_refresh",
    ];
    return scenarios[(iteration - 61) % scenarios.length];
  }
  if (iteration > Math.max(75, total - 25)) return "final_stability";
  return iteration % 10 === 0 ? "resume" : "baseline";
}

function createStored(): Stored {
  return {
    sessions: new Map(),
    responses: new Map(),
    profiles: new Map(),
    persistenceWrites: new Map(),
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function abortError(): Error {
  const err = new Error("The operation was aborted");
  err.name = "AbortError";
  return err;
}

async function delayWithAbort(ms: number, signal?: AbortSignal | null): Promise<void> {
  if (signal?.aborted) throw abortError();
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(abortError());
      },
      { once: true },
    );
  });
}

function assessment(input: GraderInput, fallback = false) {
  const words = input.responseText.trim().split(/\s+/).filter(Boolean).length;
  return {
    overallLevel: words > 30 ? "B1" as const : "A2" as const,
    confidence: fallback ? 0.35 : 0.76,
    strengths: ["Provides enough language for a repeated-run diagnosis."],
    gaps: fallback ? ["Fallback grading path used."] : ["Article and final consonant control need practice."],
    l1InterferenceFlags: input.modality === "speaking"
      ? [{ patternId: "final-consonants", severity: "high" as const, evidence: "Typed speaking transcript." }]
      : [],
    metadata: fallback ? { fallback: true, endurance: true } : { endurance: true },
  };
}

function createDeps(stored: Stored, metric: RunMetric): CoreDeps {
  let id = metric.iteration * 1000;
  let persistenceFaultUsed = false;
  const writingGrader = createHttpWritingGrader({
    functionBaseUrl: "https://placement-edge.test/functions/v1",
    serviceRoleKey: "service-role-test",
    timeoutMs: metric.scenario === "timeout_recovery" ? 1 : 12_000,
    fetchImpl: async (input, init) => {
      const url = String(input);
      if (metric.scenario === "delayed_grading") await delayWithAbort(75, init?.signal);
      if (metric.scenario === "timeout_recovery") {
        metric.timeouts += 1;
        await delayWithAbort(25, init?.signal);
      }
      if (metric.scenario === "fallback_grading" && url.includes("placement-v3-grade-writing")) {
        metric.fallbacks += 1;
        return jsonResponse({ error: "forced fallback" }, 503);
      }
      if (metric.scenario === "retry_storm" && metric.retries < 5) {
        metric.retries += 1;
        metric.fallbacks += 1;
        return jsonResponse({ error: "rate limited" }, 429);
      }
      const body = JSON.parse(String(init?.body ?? "{}"));
      if (url.includes("placement-v3-mercy-conversation")) {
        return jsonResponse({
          assessment: {
            cefr: "B1",
            confidence: 0.72,
            strengths: ["Conversation response stayed on topic."],
            gaps: [],
            recommendedFocus: [],
            l1Interference: [],
            perSkill: { conversation: { cefr: "B1", score: 0.72, confidence: 0.72 } },
          },
        });
      }
      return jsonResponse({
        assessment: {
          overallLevel: "B1",
          confidence: 0.78,
          strengths: ["Clear work context."],
          gaps: ["Article control."],
          l1InterferenceFlags: [],
          metadata: { modelTrace: { latencyMs: 240 }, promptId: body.promptId },
        },
        modelTrace: { provider: "local", model: "endurance-fixture", latencyMs: 240 },
      });
    },
  });

  return {
    now: () => new Date(Date.UTC(2026, 4, 20, 13, metric.iteration, id % 60)).toISOString(),
    newId: () => `a33-${metric.iteration}-${id++}`,
    loadLatestInProgress: async (userId) =>
      [...stored.sessions.values()].find((s) => s.user_id === userId && s.flow_state === "in_progress") ?? null,
    loadSession: async (sessionId, userId) => {
      const session = stored.sessions.get(sessionId);
      return session?.user_id === userId ? session : null;
    },
    loadResponses: async (sessionId) => stored.responses.get(sessionId) ?? [],
    loadCurrentProfile: async (sessionId, userId) => {
      const profile = stored.profiles.get(sessionId);
      return profile?.user_id === userId ? profile : null;
    },
    createSession: async (input) => {
      const session = makeSession({
        id: input.id ?? `a33-session-${metric.iteration}-${id++}`,
        userId: input.userId,
        now: input.now,
        prompt: input.firstPrompt,
        languagePair: input.languagePair,
      });
      stored.sessions.set(session.id, { ...session, total_tasks: input.totalTasks });
      stored.responses.set(session.id, []);
      stored.persistenceWrites.set(`session:${session.id}:create`, 1);
      return stored.sessions.get(session.id) ?? session;
    },
    updateSession: async (session) => {
      stored.sessions.set(session.id, session);
      const key = `session:${session.id}:update:${session.flow_state}:${session.current_task_index}`;
      stored.persistenceWrites.set(key, (stored.persistenceWrites.get(key) ?? 0) + 1);
      return session;
    },
    insertResponse: async (response) => {
      if (metric.scenario === "interrupted_persistence" && !persistenceFaultUsed) {
        persistenceFaultUsed = true;
        metric.persistenceErrors += 1;
        throw new Error("forced interrupted persistence");
      }
      const saved = { ...response, id: response.id ?? `a33-response-${metric.iteration}-${id++}` };
      const existing = stored.responses.get(response.session_id) ?? [];
      if (existing.some((r) => r.task_index === saved.task_index)) metric.duplicateSubmissions += 1;
      stored.responses.set(response.session_id, [...existing, saved]);
      const key = `response:${saved.session_id}:${saved.task_index}`;
      stored.persistenceWrites.set(key, (stored.persistenceWrites.get(key) ?? 0) + 1);
      return saved;
    },
    markProfilesNotCurrent: async (userId) => {
      for (const [key, profile] of stored.profiles) {
        if (profile.user_id === userId) stored.profiles.set(key, { ...profile, is_current: false });
      }
    },
    upsertProfile: async (profile) => {
      const saved = { ...profile, id: profile.id ?? `a33-profile-${metric.iteration}-${id++}` };
      stored.profiles.set(profile.session_id, saved);
      return saved;
    },
    grade: async (input) => ({ ok: true, assessment: assessment(input), version: `local-${input.modality}` }),
    writingGrader,
    recommendLessons: async (profile) => {
      if (metric.scenario === "partial_recommendation_failure") {
        metric.recommendationErrors += 1;
        return [{
          lessonId: "placement-v3:fallback:recommendation",
          reason: "Fallback recommendation used after forced partial failure.",
          priority: 1,
        }];
      }
      return (await recommendLessons(profile)).slice(0, 6).map((lesson, index): Recommendation => ({
        lessonId: lesson.lessonId,
        reason: lesson.reason,
        priority: lesson.priority || 1 - index * 0.1,
      }));
    },
    log: () => undefined,
  };
}

function publicFailure(metric: RunMetric, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  const classification = classifyEnduranceFailure({
    scenario: metric.scenario,
    message,
    retries: metric.retries,
    fallbacks: metric.fallbacks,
    timeouts: metric.timeouts,
    duplicateSubmissions: metric.duplicateSubmissions,
    persistenceErrors: metric.persistenceErrors,
    recommendationErrors: metric.recommendationErrors,
    memoryGrowthMb: memoryMb(metric.memory.heapUsed),
  });
  metric.failures.push({ ...classification, message });
}

async function completeSession(userId: string, deps: CoreDeps, metric: RunMetric): Promise<OrchestratorResponse> {
  let result = await handleAction({
    userId,
    request: { action: "start", languagePair: { native: "vi", target: "en" }, initialLevel: "A2" },
    deps,
  });
  if (!result.ok) throw new Error(result.error);
  let session = result.session;
  let prompt = result.prompt;

  if (metric.scenario === "resume") {
    result = await handleAction({ userId, request: { action: "resume", sessionId: session.id }, deps });
    if (!result.ok) throw new Error(result.error);
    session = result.session;
    prompt = result.prompt;
  }

  if (metric.scenario === "abandon") {
    result = await handleAction({ userId, request: { action: "abandon", sessionId: session.id }, deps });
    return result;
  }

  let guard = 0;
  while (prompt && guard < 14) {
    const response = {
      sessionId: session.id,
      taskIndex: session.current_task_index,
      promptId: prompt.id,
      responseText: LONG_ANSWER,
      responseDurationMs: 45_000,
    };
    try {
      result = await handleAction({ userId, request: { action: "respond", response }, deps });
    } catch (err) {
      if (metric.scenario === "interrupted_persistence") {
        metric.retries += 1;
        result = await handleAction({ userId, request: { action: "respond", response }, deps });
      } else {
        throw err;
      }
    }
    if (!result.ok) throw new Error(result.error);
    if (metric.scenario === "duplicate_submission" && guard === 0) {
      metric.duplicateSubmissions += 1;
      await handleAction({ userId, request: { action: "respond", response }, deps });
    }
    if (metric.scenario === "browser_refresh" && guard === 1) {
      result = await handleAction({ userId, request: { action: "resume", sessionId: session.id }, deps });
      if (!result.ok) throw new Error(result.error);
    }
    session = result.session;
    prompt = result.prompt;
    guard += 1;
  }
  return result;
}

async function runOne(runId: string, iteration: number, total: number, outDir: string): Promise<RunMetric> {
  const scenario = scenarioFor(iteration, total);
  const metric: RunMetric = {
    runId,
    iteration,
    scenario,
    timestamp: new Date().toISOString(),
    durationMs: 0,
    pass: false,
    memory: process.memoryUsage(),
    retries: 0,
    fallbacks: 0,
    timeouts: 0,
    duplicateSubmissions: 0,
    persistenceErrors: 0,
    recommendationErrors: 0,
    cefrOutcome: null,
    completionState: null,
    sessionId: null,
    responses: 0,
    failures: [],
  };
  const started = performance.now();
  const stored = createStored();
  const userId = `a33-user-${iteration}`;
  const deps = createDeps(stored, metric);
  try {
    const result = await completeSession(userId, deps, metric);
    if (!result.ok) throw new Error(result.error);
    metric.sessionId = result.session.id;
    metric.completionState = result.session.flow_state;
    metric.responses = stored.responses.get(result.session.id)?.length ?? 0;
    const profile = stored.profiles.get(result.session.id);
    metric.cefrOutcome = profile?.cefr_overall ?? null;
    metric.pass = result.session.flow_state === "completed" || scenario === "abandon";
    if (!metric.pass) publicFailure(metric, new Error(`unexpected_state:${result.session.flow_state}`));
  } catch (err) {
    publicFailure(metric, err);
  } finally {
    metric.durationMs = Math.round(performance.now() - started);
    metric.memory = process.memoryUsage();
  }

  const logPath = path.join(outDir, `${String(iteration).padStart(4, "0")}-${scenario}.json`);
  fs.writeFileSync(logPath, JSON.stringify(metric, null, 2));
  return metric;
}

async function main(): Promise<void> {
  const iterations = Number(arg("iterations", "100"));
  const outRoot = arg("out", "docs/placement-v3/endurance/raw-runs");
  const runId = arg("run-id", `a33-${new Date().toISOString().replace(/[:.]/g, "-")}`);
  const outDir = path.join(outRoot, runId);
  ensureDir(outDir);
  const startAt = new Date().toISOString();
  const metrics: RunMetric[] = [];

  for (let i = 1; i <= iterations; i += 1) {
    const metric = await runOne(runId, i, iterations, outDir);
    metrics.push(metric);
    if (i % 10 === 0 || i === iterations) {
      const partial = summarize(runId, startAt, metrics);
      fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(partial, null, 2));
      if (boolArg("stop-on-failure") && partial.failed > 0) break;
    }
  }

  const summary = summarize(runId, startAt, metrics);
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

function summarize(runId: string, startedAt: string, metrics: RunMetric[]) {
  const passed = metrics.filter((m) => m.pass).length;
  const failed = metrics.length - passed;
  const durations = metrics.map((m) => m.durationMs);
  const heaps = metrics.map((m) => memoryMb(m.memory.heapUsed));
  return {
    runId,
    startedAt,
    completedAt: new Date().toISOString(),
    total: metrics.length,
    passed,
    failed,
    durationMs: durations.reduce((a, b) => a + b, 0),
    p50Ms: percentile(durations, 0.5),
    p95Ms: percentile(durations, 0.95),
    heapStartMb: heaps[0] ?? null,
    heapEndMb: heaps.at(-1) ?? null,
    retries: metrics.reduce((sum, m) => sum + m.retries, 0),
    fallbacks: metrics.reduce((sum, m) => sum + m.fallbacks, 0),
    timeouts: metrics.reduce((sum, m) => sum + m.timeouts, 0),
    failures: metrics.flatMap((m) => m.failures),
    scenarios: Object.fromEntries(
      [...new Set(metrics.map((m) => m.scenario))].map((scenario) => [
        scenario,
        metrics.filter((m) => m.scenario === scenario).length,
      ]),
    ),
  };
}

function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
