#!/usr/bin/env tsx
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

import { handleAction, type CoreDeps } from "../supabase/functions/placement-v3-session/core.ts";
import { fallbackAssessment } from "../supabase/functions/placement-v3-session/graderClient.ts";
import { makeSession, createPersistence } from "../supabase/functions/placement-v3-session/persistence.ts";
import { recommendLessonsStub } from "../supabase/functions/placement-v3-session/scoring.ts";
import type {
  GraderInput,
  GraderResult,
  OrchestratorResponse,
  PlacementV3Profile,
  PlacementV3Request,
  PlacementV3Response,
  PlacementV3Session,
} from "../supabase/functions/placement-v3-session/types.ts";
import {
  runLiveCheck,
  isProductionLikeSupabaseUrl,
  type LiveCheckSummary,
} from "./placement-v3-speaking-live-check.ts";

type Env = Record<string, string | undefined>;

export type LiveRunnerOptions = {
  dryRun: boolean;
  speakingOnly: boolean;
  skipSpeaking: boolean;
  cleanup: boolean;
};

export type LiveRunnerSummary = {
  ok: boolean;
  dry_run: boolean;
  learner: {
    email: string;
    user_id: string;
    created_or_resolved: "planned" | "resolved";
  };
  session_lifecycle: {
    session_id: string | null;
    started: boolean;
    completed: boolean;
    final_state: string | null;
  };
  persistence_verification: {
    mode: "dry_run" | "supabase" | "memory";
    session_persisted: boolean;
    response_count: number;
    profile_persisted: boolean;
    result_retrieval: boolean;
  };
  retry_idempotency: {
    duplicate_short_circuited: boolean;
    response_count_after_duplicate: number;
  };
  provider_metadata: {
    timeout_fallback_persisted: boolean;
    fallback_metadata: Record<string, unknown> | null;
  };
  azure_speaking: {
    status: "skipped" | "passed" | "failed";
    reason?: string;
    summary?: LiveCheckSummary;
  };
  skipped_validations: string[];
  blocking_failures: string[];
};

export function parseArgs(argv: string[]): LiveRunnerOptions {
  return {
    dryRun: argv.includes("--dry-run"),
    speakingOnly: argv.includes("--speaking-only"),
    skipSpeaking: argv.includes("--skip-speaking"),
    cleanup: argv.includes("--cleanup"),
  };
}

export function assertLiveRunnerSafety(env: Env, learnerEmail: string): { ok: true } | { ok: false; reason: string } {
  if (env.NODE_ENV === "production" || env.VERCEL_ENV === "production") {
    return { ok: false, reason: "Refusing Placement V3 live validation in production env." };
  }
  if (env.PLACEMENT_V3_LIVE_VALIDATION !== "1") {
    return { ok: false, reason: "Refusing live validation without PLACEMENT_V3_LIVE_VALIDATION=1." };
  }
  if (!env.PLACEMENT_V3_VALIDATION_ENV || !["local", "staging", "validation"].includes(env.PLACEMENT_V3_VALIDATION_ENV)) {
    return { ok: false, reason: "Refusing live validation without PLACEMENT_V3_VALIDATION_ENV=local|staging|validation." };
  }
  if (isProductionLikeSupabaseUrl(env.SUPABASE_URL)) {
    return { ok: false, reason: "Refusing production-like Supabase URL for Placement V3 live validation." };
  }
  if (!isValidationLearnerEmail(learnerEmail)) {
    return { ok: false, reason: "Refusing invalid validation learner namespace." };
  }
  return { ok: true };
}

export function isValidationLearnerEmail(email: string): boolean {
  return /^placement-v3-test-[a-f0-9-]+@mercyblade\.test$/.test(email);
}

export async function runPlacementV3Live(
  options: LiveRunnerOptions,
  env: Env = process.env,
): Promise<LiveRunnerSummary> {
  const learnerEmail = env.PLACEMENT_V3_VALIDATION_LEARNER_EMAIL ?? `placement-v3-test-${randomUUID()}@mercyblade.test`;
  const safety = assertLiveRunnerSafety(env, learnerEmail);
  if (!safety.ok) throw new Error(safety.reason);

  const skippedValidations: string[] = [];
  const blockingFailures: string[] = [];
  const userId = `validation-user:${learnerEmail}`;

  if (options.dryRun) {
    if (!env.AZURE_SPEECH_KEY) skippedValidations.push("azure_speaking_live_check_missing_key");
    return {
      ok: true,
      dry_run: true,
      learner: { email: learnerEmail, user_id: userId, created_or_resolved: "planned" },
      session_lifecycle: { session_id: null, started: false, completed: false, final_state: "planned" },
      persistence_verification: {
        mode: "dry_run",
        session_persisted: false,
        response_count: 0,
        profile_persisted: false,
        result_retrieval: false,
      },
      retry_idempotency: { duplicate_short_circuited: false, response_count_after_duplicate: 0 },
      provider_metadata: { timeout_fallback_persisted: false, fallback_metadata: null },
      azure_speaking: options.skipSpeaking
        ? { status: "skipped", reason: "skip_speaking" }
        : env.AZURE_SPEECH_KEY
          ? { status: "skipped", reason: "dry_run" }
          : { status: "skipped", reason: "missing_azure_speech_key" },
      skipped_validations: skippedValidations,
      blocking_failures: blockingFailures,
    };
  }

  if (options.speakingOnly) {
    if (options.skipSpeaking) skippedValidations.push("speaking_only_skipped_by_flag");
    const azureSpeaking = await resolveAzureSpeakingStatus(options, env, skippedValidations, blockingFailures);
    return {
      ok: blockingFailures.length === 0,
      dry_run: false,
      learner: { email: learnerEmail, user_id: userId, created_or_resolved: "resolved" },
      session_lifecycle: { session_id: null, started: false, completed: false, final_state: "speaking_only" },
      persistence_verification: {
        mode: "memory",
        session_persisted: false,
        response_count: 0,
        profile_persisted: false,
        result_retrieval: false,
      },
      retry_idempotency: { duplicate_short_circuited: false, response_count_after_duplicate: 0 },
      provider_metadata: { timeout_fallback_persisted: false, fallback_metadata: null },
      azure_speaking: azureSpeaking,
      skipped_validations: skippedValidations,
      blocking_failures: blockingFailures,
    };
  }

  const deps = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
    ? createSupabaseDeps(env)
    : createMemoryDeps();
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    skippedValidations.push("supabase_env_missing_using_memory_validation");
  }

  const start = await handleAction({
    userId,
    request: {
      action: "start",
      languagePair: { native: "vi", target: "en" },
      initialLevel: "A2",
    },
    deps,
  });
  if (!start.ok || !start.prompt) {
    throw new Error(`Placement V3 start failed: ${JSON.stringify(start)}`);
  }

  const firstResponse = await respondToPrompt(start, deps, userId);
  if (!firstResponse.ok) throw new Error(`Placement V3 response failed: ${JSON.stringify(firstResponse)}`);
  const duplicate = await respondToPrompt(start, deps, userId);
  if (!duplicate.ok) throw new Error(`Placement V3 duplicate response failed: ${JSON.stringify(duplicate)}`);
  const responsesAfterDuplicate = await deps.loadResponses(start.session.id);

  let finalState = firstResponse;
  for (let i = 0; i < 16 && finalState.ok && finalState.prompt; i += 1) {
    finalState = await respondToPrompt(finalState, deps, userId);
  }
  if (!finalState.ok) throw new Error(`Placement V3 completion failed: ${JSON.stringify(finalState)}`);

  const responses = await deps.loadResponses(start.session.id);
  const currentProfile = await deps.loadCurrentProfile(start.session.id, userId);
  const timeoutResponse = responses.find((row) => row.ai_assessment?.metadata?.errorCode === "timeout");
  const fallbackMetadata = timeoutResponse?.ai_assessment?.metadata ?? null;

  const azureSpeaking = await resolveAzureSpeakingStatus(options, env, skippedValidations, blockingFailures);

  const summary: LiveRunnerSummary = {
    ok: blockingFailures.length === 0,
    dry_run: false,
    learner: { email: learnerEmail, user_id: userId, created_or_resolved: "resolved" },
    session_lifecycle: {
      session_id: start.session.id,
      started: true,
      completed: finalState.session.flow_state === "completed",
      final_state: finalState.session.flow_state,
    },
    persistence_verification: {
      mode: env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "memory",
      session_persisted: Boolean(await deps.loadSession(start.session.id, userId)),
      response_count: responses.length,
      profile_persisted: Boolean(currentProfile),
      result_retrieval: Boolean(await deps.loadLatestInProgress(userId) || currentProfile || responses.length),
    },
    retry_idempotency: {
      duplicate_short_circuited: responsesAfterDuplicate.length === 1,
      response_count_after_duplicate: responsesAfterDuplicate.length,
    },
    provider_metadata: {
      timeout_fallback_persisted: Boolean(timeoutResponse),
      fallback_metadata: fallbackMetadata,
    },
    azure_speaking: azureSpeaking,
    skipped_validations: skippedValidations,
    blocking_failures: blockingFailures,
  };
  if (options.cleanup && deps.cleanup) await deps.cleanup(userId);
  return summary;
}

async function resolveAzureSpeakingStatus(
  options: LiveRunnerOptions,
  env: Env,
  skippedValidations: string[],
  blockingFailures: string[],
): Promise<LiveRunnerSummary["azure_speaking"]> {
  if (options.skipSpeaking) {
    return { status: "skipped", reason: "skip_speaking" };
  }
  if (!env.AZURE_SPEECH_KEY) {
    skippedValidations.push("azure_speaking_live_check_missing_key");
    return { status: "skipped", reason: "missing_azure_speech_key" };
  }
  try {
    const summary = await runLiveCheck({
      ...env,
      PLACEMENT_V3_SPEAKING_LIVE_CHECK: "1",
      PLACEMENT_V3_VALIDATION_ENV: env.PLACEMENT_V3_VALIDATION_ENV,
    });
    if (!summary.ok) blockingFailures.push("azure_speaking_live_check_failed");
    return { status: summary.ok ? "passed" : "failed", summary };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    blockingFailures.push(`azure_speaking_live_check_error:${reason}`);
    return { status: "failed", reason };
  }
}

async function respondToPrompt(
  start: Extract<OrchestratorResponse, { ok: true }>,
  deps: CoreDeps,
  userId: string,
) {
  if (!start.prompt) throw new Error("Missing prompt for validation response.");
  return handleAction({
    userId,
    request: {
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: start.session.current_task_index,
        promptId: start.prompt.id,
        responseText: "I study English every day because I want to communicate better at work.",
        responseDurationMs: 1_000,
      },
    },
    deps,
  });
}

type LiveDeps = CoreDeps & { cleanup?: (userId: string) => Promise<void> };

function createSupabaseDeps(env: Env): LiveDeps {
  const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  return {
    ...createPersistence(supabase as never, {
      now: () => new Date().toISOString(),
      newId: () => randomUUID(),
      log: () => undefined,
    }),
    grade: validationGrade,
    recommendLessons: async (profile) => recommendLessonsStub(profile),
  };
}

function createMemoryDeps(): LiveDeps {
  const sessions = new Map<string, PlacementV3Session>();
  const responses = new Map<string, PlacementV3Response[]>();
  const profiles = new Map<string, PlacementV3Profile>();
  const inFlightClaims = new Set<string>();
  return {
    now: () => new Date().toISOString(),
    newId: () => randomUUID(),
    log: () => undefined,
    loadLatestInProgress: async (userId) =>
      [...sessions.values()]
        .filter((session) => session.user_id === userId && session.flow_state === "in_progress")
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0] ?? null,
    loadSession: async (sessionId, userId) => {
      const session = sessions.get(sessionId);
      return session?.user_id === userId ? session : null;
    },
    loadResponses: async (sessionId) => responses.get(sessionId) ?? [],
    loadCurrentProfile: async (sessionId, userId) => {
      const profile = profiles.get(sessionId);
      return profile?.user_id === userId ? profile : null;
    },
    createSession: async (input) => {
      const session = makeSession({
        id: input.id ?? randomUUID(),
        userId: input.userId,
        now: input.now,
        prompt: input.firstPrompt,
        languagePair: input.languagePair,
      });
      sessions.set(session.id, session);
      responses.set(session.id, []);
      return session;
    },
    updateSession: async (session) => {
      sessions.set(session.id, session);
      return session;
    },
    insertResponse: async (response) => {
      const key = `${response.session_id}:${response.task_index}`;
      while (inFlightClaims.has(key)) await new Promise((resolve) => setTimeout(resolve, 1));
      const existing = (responses.get(response.session_id) ?? []).find(
        (row) => row.task_index === response.task_index,
      );
      if (existing) return { response: existing, inserted: false };
      inFlightClaims.add(key);
      try {
        const latestExisting = (responses.get(response.session_id) ?? []).find(
          (row) => row.task_index === response.task_index,
        );
        if (latestExisting) return { response: latestExisting, inserted: false };
        const saved = { ...response, id: response.id ?? randomUUID() };
        responses.set(response.session_id, [...(responses.get(response.session_id) ?? []), saved]);
        return { response: saved, inserted: true };
      } finally {
        inFlightClaims.delete(key);
      }
    },
    updateResponse: async (response) => {
      const current = responses.get(response.session_id) ?? [];
      const updated = current.map((row) =>
        row.task_index === response.task_index ? { ...row, ...response } : row
      );
      const saved = updated.find((row) => row.task_index === response.task_index);
      if (!saved) throw new Error("missing response to update");
      responses.set(response.session_id, updated);
      return saved;
    },
    markProfilesNotCurrent: async (userId) => {
      for (const [key, profile] of profiles) {
        if (profile.user_id === userId) profiles.set(key, { ...profile, is_current: false });
      }
    },
    upsertProfile: async (profile) => {
      const saved = { ...profile, id: profile.id ?? randomUUID() };
      profiles.set(profile.session_id, saved);
      return saved;
    },
    grade: validationGrade,
    recommendLessons: async (profile) => recommendLessonsStub(profile),
    cleanup: async (userId) => {
      for (const [key, session] of sessions) {
        if (session.user_id === userId) {
          sessions.delete(key);
          responses.delete(key);
          profiles.delete(key);
        }
      }
    },
  };
}

async function validationGrade(input: GraderInput): Promise<GraderResult> {
  const result = fallbackAssessment(input, "timeout", `Validation timeout fallback for ${input.modality}.`);
  return {
    ...result,
    assessment: {
      ...result.assessment,
      metadata: {
        ...(result.assessment.metadata ?? {}),
        providerTimeout: true,
        retryable: true,
        recoverable: true,
      },
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runPlacementV3Live(parseArgs(process.argv.slice(2)))
    .then((summary) => {
      console.log(JSON.stringify(summary, null, 2));
      if (!summary.ok) process.exitCode = 1;
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    });
}
