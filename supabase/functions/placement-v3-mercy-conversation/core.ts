import { appendMercyTurn, appendUserTurn, createConversationState, hydrateConversationState } from "./conversationState";
import { gradeConversation } from "./conversationGrader";
import { generateMercyTurn } from "./turnGenerator";
import { extractSignalsFromTurn, summarizeSignals } from "./signalExtractor";
import type { Deps, GradeResponse, StartResponse, TurnResponse } from "./types";

export type { Deps } from "./types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function handleRequest(req: Request, deps: Deps): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const user = await deps.getUserFromAuthHeader(req);
  if (!user) {
    return json({
      error: "auth_required",
      message: "Sign in to use Mercy conversation placement.",
      message_vi: "Vui lòng đăng nhập để làm bài xếp lớp hội thoại với Mercy.",
    }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json() as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const action = typeof body.action === "string" ? body.action : "turn";
  if (action === "start") return handleStart(body, deps);
  if (action === "turn") return handleTurn(body, deps);
  if (action === "grade") return handleGrade(body);
  return json({ error: "unknown_action" }, 400);
}

async function handleStart(body: Record<string, unknown>, deps: Deps): Promise<Response> {
  const now = deps.now?.() ?? new Date();
  let state = createConversationState({
    sessionId: deps.makeSessionId?.() ?? crypto.randomUUID(),
    now,
    targetTurnPairs: typeof body.targetTurnPairs === "number" ? body.targetTurnPairs : undefined,
  });
  const mercyTurn = await generateMercyTurn({
    history: state.history,
    phase: state.phase,
    targetTurnPairs: state.targetTurnPairs,
    learnerName: typeof body.learnerName === "string" ? body.learnerName : undefined,
  }, deps.callAi);
  state = appendMercyTurn(state, mercyTurn.text, mercyTurn.phase, now);
  return json({ ok: true, state, mercyTurn } satisfies StartResponse);
}

async function handleTurn(body: Record<string, unknown>, deps: Deps): Promise<Response> {
  const state = hydrateConversationState(body.state);
  if (!state) return json({ error: "invalid_state" }, 400);
  const text = typeof body.text === "string" ? body.text : "";
  if (!text.trim()) return json({ error: "empty_turn" }, 400);

  const now = deps.now?.() ?? new Date();
  const lastMercy = state.history.slice().reverse().find((t) => t.speaker === "mercy");
  const userSignal = extractSignalsFromTurn(text, lastMercy?.text ?? "");
  const withUser = appendUserTurn(state, text, userSignal, now);
  const signalSummary = summarizeSignals(withUser.signals);
  const mercyTurn = await generateMercyTurn({
    history: withUser.history,
    phase: withUser.phase,
    signals: signalSummary,
    targetTurnPairs: withUser.targetTurnPairs,
  }, deps.callAi);
  const nextState = appendMercyTurn(withUser, mercyTurn.text, mercyTurn.phase, now);
  return json({ ok: true, state: nextState, userSignal, mercyTurn } satisfies TurnResponse);
}

function handleGrade(body: Record<string, unknown>): Response {
  const state = hydrateConversationState(body.state);
  const transcript = Array.isArray(body.transcript) ? body.transcript : state?.history;
  if (!Array.isArray(transcript)) return json({ error: "invalid_transcript" }, 400);
  const assessment = gradeConversation(transcript);
  return json({ ok: true, assessment } satisfies GradeResponse);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
