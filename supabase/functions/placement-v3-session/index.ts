import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { getUserFromAuthHeader } from "../_shared/security.ts";
import { wrapHandler } from "../_shared/sentry.ts";
import { createPlacementForensicLogger } from "../_shared/placementForensicLogger.ts";

import { handleAction } from "./core.ts";
import { createHttpWritingGrader } from "./graderClient.ts";
import { createPersistence, recommendLessons } from "./persistence.ts";
import type {
  OrchestratorResponse,
  PlacementV3Request,
  PlacementV3Session,
} from "./types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Untyped on purpose: placement_v3_* may be on an unmerged migration branch
// when this function is developed locally. persistence.ts owns row mapping.
// deno-lint-ignore no-explicit-any
const db: any = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const writingGrader = createHttpWritingGrader({
  functionBaseUrl: `${supabaseUrl}/functions/v1`,
  serviceRoleKey,
});
const forensicLogger = createPlacementForensicLogger(db, {
  source: "placement-v3-session",
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function progress(session: PlacementV3Session) {
  return {
    current: session.current_task_index,
    total: session.total_tasks ?? 0,
    state: session.flow_state,
  };
}

function publicResult(result: OrchestratorResponse): unknown {
  if (!result.ok) return result;
  if (result.action === "start") {
    return {
      sessionId: result.session.id,
      currentTask: result.prompt,
      totalTasks: result.session.total_tasks ?? 0,
      progress: progress(result.session),
      resumed: result.resumed ?? false,
    };
  }
  if (result.action === "respond") {
    if (result.profile) {
      return {
        type: "session_complete",
        profile: result.profile,
        recommendations: result.profile.recommended_lessons,
      };
    }
    if (result.prompt && result.session.metadata.lastCompletedModality) {
      return {
        type: "modality_complete",
        nextModality: result.prompt.modality,
        currentTask: result.prompt,
        progress: progress(result.session),
      };
    }
    return {
      type: "next_task",
      currentTask: result.prompt,
      progress: progress(result.session),
    };
  }
  if (result.action === "abandon") return { status: "abandoned" };
  if (result.action === "resume") {
    if (result.session.flow_state === "abandoned") {
      return { type: "expired", lastActivity: result.session.updated_at };
    }
    return {
      type: "resumed",
      sessionId: result.session.id,
      currentTask: result.prompt,
      progress: progress(result.session),
    };
  }
  return {
    sessionState: result.session.flow_state,
    currentModality: result.session.current_modality,
    currentTask: result.prompt,
    progress: progress(result.session),
    profile: result.profile,
  };
}

serve(
  wrapHandler("placement-v3-session", async (req) => {
    const correlationId = req.headers.get("x-correlation-id") ?? crypto.randomUUID();
    let sequence = 0;
    const nextSequence = () => {
      sequence += 1;
      return sequence;
    };
    const fallbackSessionId = `pending:${correlationId}`;
    const featureFlags = {
      source: "edge-runtime",
      flags: {
        placement_v3_forensics: true,
        placement_v3_ui_enabled: Deno.env.get("PLACEMENT_V3_UI_ENABLED") ?? null,
        placement_v3_test_enabled: Deno.env.get("PLACEMENT_TEST_ENABLED") ?? null,
      },
    };

    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

    const user = await getUserFromAuthHeader(req);
    if (!user) {
      await forensicLogger.logEvent({
        sessionId: fallbackSessionId,
        correlationId,
        sequence: nextSequence(),
        type: "session_event",
        severity: "warn",
        step: "auth",
        message: "Placement V3 request rejected because authentication was missing.",
        sessionState: "failed",
        featureFlags,
      });
      return json({
        ok: false,
        error: "auth_required",
        message: "Sign in to start placement.",
      }, 401);
    }

    let body: PlacementV3Request;
    try {
      body = await req.json() as PlacementV3Request;
    } catch {
      await forensicLogger.logEvent({
        sessionId: fallbackSessionId,
        correlationId,
        sequence: nextSequence(),
        type: "session_event",
        severity: "warn",
        step: "request.parse",
        message: "Placement V3 request body was invalid JSON.",
        sessionState: "failed",
        featureFlags,
      });
      return json({ ok: false, error: "invalid_json", message: "Invalid JSON." }, 400);
    }
    if (!body || typeof body.action !== "string") {
      return json({ ok: false, error: "action_required", message: "Action is required." }, 400);
    }
    const requestSessionId =
      "sessionId" in body && typeof body.sessionId === "string"
        ? body.sessionId
        : body.action === "respond" && typeof body.response?.sessionId === "string"
          ? body.response.sessionId
          : fallbackSessionId;

    await forensicLogger.logEvent({
      sessionId: requestSessionId,
      correlationId,
      sequence: nextSequence(),
      type: "session_event",
      severity: "info",
      step: "request.received",
      message: `Placement V3 ${body.action} request received.`,
      sessionState: "in_progress",
      featureFlags,
      metadata: { action: body.action, userId: user.id },
    });
    await forensicLogger.logEvent({
      sessionId: requestSessionId,
      correlationId,
      sequence: nextSequence(),
      type: "feature_flag_snapshot",
      severity: "info",
      step: "flags.snapshot",
      message: "Placement V3 runtime feature flags captured.",
      featureFlags,
    });

    const persistence = createPersistence(db, {
      now: () => new Date().toISOString(),
      newId: () => crypto.randomUUID(),
      log: (event, meta) => {
        console.log(JSON.stringify({ event, ...meta, correlationId }));
        if (event === "placement_v3.transition") {
          void forensicLogger.logEvent({
            sessionId: String(meta?.sessionId ?? requestSessionId),
            correlationId,
            sequence: nextSequence(),
            type: "orchestration_transition",
            severity: "info",
            step: "orchestrator.transition",
            message: "Placement V3 orchestration transition recorded.",
            fromState: String(meta?.from ?? "unknown"),
            toState: String(meta?.to ?? "unknown"),
            action: String(meta?.action ?? "unknown"),
            featureFlags,
          });
        }
      },
    });

    let result: OrchestratorResponse;
    try {
      const authToken = (req.headers.get("Authorization") ?? "")
        .replace(/^Bearer\s+/i, "")
        .trim();
      result = await handleAction({
        userId: user.id,
        authToken,
        request: body,
        deps: {
          ...persistence,
          grade: (input) => writingGrader.gradeWriting(input),
          writingGrader: {
            ...writingGrader,
            async gradeWriting(input) {
              const started = Date.now();
              const grade = await writingGrader.gradeWriting(input);
              const latencyMs = Date.now() - started;
              await forensicLogger.logEvent({
                sessionId: input.sessionId,
                correlationId,
                sequence: nextSequence(),
                type: "provider_event",
                severity: grade.ok ? "info" : "warn",
                step: "grader.writing",
                message: grade.ok
                  ? "Writing grader returned an assessment."
                  : "Writing grader returned a fallback assessment.",
                provider: "placement-v3-grade-writing",
                model: grade.version,
                attempt: 1,
                status: grade.ok
                  ? "success"
                  : grade.errorCode === "timeout"
                    ? "timeout"
                    : grade.errorCode === "malformed_json"
                      ? "parse_error"
                      : "error",
                latencyMs,
                featureFlags,
                failureSnapshot: grade.ok ? undefined : {
                  errorCode: grade.errorCode ?? "grader_error",
                  errorMessage: grade.errorMessage ?? "Grader fallback used.",
                  deterministic: grade.errorCode === "malformed_json" ? true : "unknown",
                  recoverable: "degraded_safe",
                  safeUserOutcome: "degraded",
                },
              });
              await forensicLogger.logEvent({
                sessionId: input.sessionId,
                correlationId,
                sequence: nextSequence(),
                type: "latency_event",
                severity: latencyMs > 12_000 ? "warn" : "info",
                step: "grader.writing.latency",
                message: "Writing grader latency recorded.",
                latencyMs,
                budgetMs: 12_000,
                exceededBudget: latencyMs > 12_000,
                featureFlags,
              });
              if (!grade.ok) {
                await forensicLogger.logEvent({
                  sessionId: input.sessionId,
                  correlationId,
                  sequence: nextSequence(),
                  type: "degraded_result",
                  severity: "warn",
                  step: "grader.writing.fallback",
                  message: "Placement V3 continued with a low-confidence fallback grade.",
                  marker: "heuristic_grade",
                  userVisible: true,
                  featureFlags,
                });
              }
              return grade;
            },
            async gradeConversation(input) {
              const started = Date.now();
              const grade = writingGrader.gradeConversation
                ? await writingGrader.gradeConversation(input)
                : await writingGrader.gradeWriting(input);
              const latencyMs = Date.now() - started;
              await forensicLogger.logEvent({
                sessionId: input.sessionId,
                correlationId,
                sequence: nextSequence(),
                type: "provider_event",
                severity: grade.ok ? "info" : "warn",
                step: "grader.conversation",
                message: grade.ok
                  ? "Conversation grader returned an assessment."
                  : "Conversation grader returned a fallback assessment.",
                provider: "placement-v3-mercy-conversation",
                model: grade.version,
                attempt: 1,
                status: grade.ok ? "success" : "error",
                latencyMs,
                featureFlags,
              });
              return grade;
            },
          },
          async recommendLessons(profile) {
            try {
              const recommendations = await recommendLessons(profile);
              await forensicLogger.logEvent({
                sessionId: profile.session_id,
                correlationId,
                sequence: nextSequence(),
                type: "recommendation_event",
                severity: recommendations.length ? "info" : "warn",
                step: "recommendations",
                message: "Placement V3 recommendation path completed.",
                status: recommendations.length ? "selected" : "fallback",
                recommendationCount: recommendations.length,
                featureFlags,
              });
              return recommendations;
            } catch (err) {
              await forensicLogger.logFailureSnapshot({
                sessionId: profile.session_id,
                correlationId,
                sequence: nextSequence(),
                type: "recommendation_event",
                severity: "error",
                step: "recommendations",
                message: "Placement V3 recommendation path failed.",
                status: "failed",
                recommendationCount: 0,
                featureFlags,
              }, {
                errorCode: "recommendation_failed",
                errorMessage: err instanceof Error ? err.message : String(err),
                deterministic: "unknown",
                recoverable: "degraded_safe",
                safeUserOutcome: "degraded",
              });
              throw err;
            }
          },
        },
      });
    } catch (err) {
      await forensicLogger.logFailureSnapshot({
        sessionId: requestSessionId,
        correlationId,
        sequence: nextSequence(),
        type: "recoverability_state",
        severity: "fatal",
        step: "orchestrator.exception",
        message: "Placement V3 session handler threw before producing a public response.",
        state: "unknown",
        reason: "unhandled exception",
        featureFlags,
      }, {
        errorCode: "orchestrator_exception",
        errorMessage: err instanceof Error ? err.message : String(err),
        deterministic: "unknown",
        recoverable: "unknown",
        safeUserOutcome: "unknown",
      });
      throw err;
    }
    const resultSessionId = result.ok ? result.session.id : requestSessionId;
    await forensicLogger.logEvent({
      sessionId: resultSessionId,
      correlationId,
      sequence: nextSequence(),
      type: "session_event",
      severity: result.ok ? "info" : "error",
      step: "response.ready",
      message: result.ok
        ? `Placement V3 ${body.action} response completed.`
        : `Placement V3 ${body.action} response failed.`,
      sessionState: result.ok ? result.session.flow_state : "failed",
      featureFlags,
      failureSnapshot: result.ok ? undefined : {
        errorCode: result.error,
        errorMessage: result.message,
        deterministic: "unknown",
        recoverable: "unknown",
        safeUserOutcome: "blocked",
      },
    });
    if (!result.ok && body.action === "resume" && result.error === "session_not_found") {
      return json({ type: "no_session" }, 200);
    }
    return json(publicResult(result), result.ok ? 200 : result.status);
  }),
);
