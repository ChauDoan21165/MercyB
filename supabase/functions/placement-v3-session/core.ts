import { gradeWithClient, type WritingGraderClient } from "./graderClient.ts";
import {
  currentPrompt,
  MAX_TOTAL_TASKS,
  nextPromptAfterAssessment,
  selectPrompt,
} from "./modality.ts";
import {
  appendRecoverableError,
  canTransition,
  isExpired,
  markAbandoned,
  markCompleted,
  recoverFromError,
} from "./state.ts";
import { aggregateProfile } from "./scoring.ts";
import {
  type OrchestratorDeps,
  type OrchestratorResponse,
  type PlacementV3Profile,
  type PlacementV3Request,
  type PlacementV3Response,
  type PlacementV3Session,
  type PromptTask,
  type RespondInput,
} from "./types.ts";

const DEFAULT_PAIR = { native: "vi", target: "en" };

export interface CoreDeps extends OrchestratorDeps {
  writingGrader?: WritingGraderClient;
}

export async function handleAction(args: {
  userId: string;
  request: PlacementV3Request;
  deps: CoreDeps;
}): Promise<OrchestratorResponse> {
  const { userId, request, deps } = args;
  deps.log?.("placement_v3.request", { action: request.action, userId });
  switch (request.action) {
    case "start":
      return startSession(userId, request, deps);
    case "respond":
      return respond(userId, request.response, deps);
    case "abandon":
      return abandon(userId, request.sessionId, deps);
    case "resume":
      return resume(userId, request.sessionId, deps);
    case "status":
      return status(userId, request.sessionId, deps);
  }
}

async function startSession(
  userId: string,
  input: Extract<PlacementV3Request, { action: "start" }>,
  deps: CoreDeps,
): Promise<OrchestratorResponse> {
  const now = deps.now();
  const existing = await deps.loadLatestInProgress(userId);
  if (existing && !isExpired(existing, now)) {
    return {
      ok: true,
      action: "start",
      session: existing,
      prompt: currentPrompt(existing),
      profile: null,
      resumed: true,
    };
  }
  if (existing) {
    await deps.updateSession(markAbandoned(existing, now));
    deps.log?.("placement_v3.session_abandoned_expired", {
      sessionId: existing.id,
    });
  }
  const targetLevel = input.initialLevel ?? "A2";
  const firstPrompt = selectPrompt({
    modality: "writing",
    targetLevel,
    responses: [],
  });
  const session = await deps.createSession({
    userId,
    languagePair: input.languagePair ?? DEFAULT_PAIR,
    firstPrompt,
    now,
    totalTasks: MAX_TOTAL_TASKS,
    id: deps.newId(),
  });
  deps.log?.("placement_v3.transition", {
    from: "none",
    to: "in_progress",
    action: "start",
    sessionId: session.id,
  });
  return { ok: true, action: "start", session, prompt: firstPrompt, profile: null };
}

async function respond(
  userId: string,
  input: RespondInput,
  deps: CoreDeps,
): Promise<OrchestratorResponse> {
  const now = deps.now();
  const session = await deps.loadSession(input.sessionId, userId);
  if (!session) return error("session_not_found", "Placement session was not found.", 404);
  if (!canTransition(session.flow_state, "respond")) {
    return error("invalid_transition", "This session cannot accept a response.", 409);
  }
  if (session.flow_state === "completed") {
    return completedResponse(session, deps, userId);
  }
  if (session.flow_state === "abandoned") {
    return error("session_abandoned", "This placement session was abandoned.", 409);
  }
  if (isExpired(session, now)) {
    const abandoned = await deps.updateSession(markAbandoned(session, now));
    return {
      ok: true,
      action: "respond",
      session: abandoned,
      prompt: null,
      profile: null,
    };
  }
  if (input.taskIndex < 0 || !Number.isInteger(input.taskIndex)) {
    return error("invalid_task_index", "Task index is invalid.", 400);
  }
  const responses = await deps.loadResponses(session.id);
  const duplicate = responses.find((r) => r.task_index === input.taskIndex);
  if (duplicate) {
    return {
      ok: true,
      action: "respond",
      session,
      prompt: currentPrompt(session),
      profile: null,
      resumed: true,
    };
  }
  const prompt = currentPrompt(session);
  if (!prompt) return error("prompt_missing", "Session has no active prompt.", 409);
  const validation = validateResponse(input, prompt);
  if (validation) return validation;

  const graderInput = {
    userId,
    sessionId: session.id,
    modality: prompt.modality,
    prompt,
    responseText: normalizeResponseText(input.responseText ?? ""),
    audioStoragePath: input.audioStoragePath,
    responseDurationMs: input.responseDurationMs,
  };
  const grade = deps.writingGrader
    ? await gradeWithClient(graderInput, deps.writingGrader)
    : await deps.grade(graderInput);
  deps.log?.("placement_v3.grader_call", {
    sessionId: session.id,
    modality: prompt.modality,
    ok: grade.ok,
    version: grade.version,
    errorCode: grade.errorCode,
  });

  let working = session;
  if (!grade.ok) {
    working = appendRecoverableError(working, {
      at: now,
      code: grade.errorCode ?? "grader_error",
      message: grade.errorMessage ?? "Grader fallback used.",
      recoverable: true,
    });
  }
  if (working.flow_state === "error") working = recoverFromError(working, now);

  const response: PlacementV3Response = {
    session_id: session.id,
    task_index: input.taskIndex,
    modality: prompt.modality,
    prompt_id: prompt.id,
    prompt_text: prompt.promptText,
    user_response_text: normalizeResponseText(input.responseText ?? ""),
    audio_storage_path: input.audioStoragePath ?? null,
    response_duration_ms: input.responseDurationMs ?? null,
    ai_assessment: grade.assessment,
    ai_assessment_version: grade.version,
    graded_at: now,
    created_at: now,
  };
  const savedResponse = await deps.insertResponse(response);
  const allResponses = [...responses, savedResponse];
  const next = nextPromptAfterAssessment({
    session: working,
    responses: allResponses,
    assessment: grade.assessment,
  });

  if (!next.prompt || allResponses.length >= MAX_TOTAL_TASKS) {
    const completed = markCompleted(
      {
        ...working,
        metadata: next.metadata,
        current_task_index: allResponses.length,
        current_modality: null,
      },
      now,
    );
    const updated = await deps.updateSession(completed);
    const profile = await finalizeProfile(userId, updated.id, allResponses, now, deps);
    deps.log?.("placement_v3.transition", {
      from: "in_progress",
      to: "completed",
      action: "respond",
      sessionId: updated.id,
    });
    return { ok: true, action: "respond", session: updated, prompt: null, profile };
  }

  const updated = await deps.updateSession({
    ...working,
    current_modality: next.prompt.modality,
    current_task_index: allResponses.length,
    metadata: next.metadata,
    updated_at: now,
  });
  deps.log?.("placement_v3.transition", {
    from: prompt.modality,
    to: next.prompt.modality,
    action: "respond",
    sessionId: updated.id,
  });
  return { ok: true, action: "respond", session: updated, prompt: next.prompt, profile: null };
}

async function finalizeProfile(
  userId: string,
  sessionId: string,
  responses: PlacementV3Response[],
  now: string,
  deps: CoreDeps,
): Promise<PlacementV3Profile> {
  let profile = aggregateProfile({ userId, sessionId, responses, now });
  const recommendations = await deps.recommendLessons(profile);
  profile = { ...profile, recommended_lessons: recommendations };
  await deps.markProfilesNotCurrent(userId);
  return deps.upsertProfile(profile);
}

async function abandon(
  userId: string,
  sessionId: string,
  deps: CoreDeps,
): Promise<OrchestratorResponse> {
  const session = await deps.loadSession(sessionId, userId);
  if (!session) return error("session_not_found", "Placement session was not found.", 404);
  if (session.flow_state === "completed") {
    return completedResponse(session, deps, userId);
  }
  const abandoned = await deps.updateSession(markAbandoned(session, deps.now()));
  return { ok: true, action: "abandon", session: abandoned, prompt: null, profile: null };
}

async function resume(
  userId: string,
  sessionId: string | undefined,
  deps: CoreDeps,
): Promise<OrchestratorResponse> {
  const session = sessionId
    ? await deps.loadSession(sessionId, userId)
    : await deps.loadLatestInProgress(userId);
  if (!session) return error("session_not_found", "No placement session to resume.", 404);
  if (session.flow_state === "completed") return completedResponse(session, deps, userId);
  if (session.flow_state === "abandoned") {
    return error("session_abandoned", "Abandoned sessions are terminal; start a new placement.", 409);
  }
  const now = deps.now();
  if (isExpired(session, now)) {
    const abandoned = await deps.updateSession(markAbandoned(session, now));
    return { ok: true, action: "resume", session: abandoned, prompt: null, profile: null };
  }
  const recovered = session.flow_state === "error"
    ? await deps.updateSession(recoverFromError(session, now))
    : session;
  return {
    ok: true,
    action: "resume",
    session: recovered,
    prompt: currentPrompt(recovered),
    profile: null,
    resumed: true,
  };
}

async function status(
  userId: string,
  sessionId: string | undefined,
  deps: CoreDeps,
): Promise<OrchestratorResponse> {
  const session = sessionId
    ? await deps.loadSession(sessionId, userId)
    : await deps.loadLatestInProgress(userId);
  if (!session) return error("session_not_found", "No placement session found.", 404);
  const profile = session.flow_state === "completed"
    ? await deps.loadCurrentProfile(session.id, userId)
    : null;
  return {
    ok: true,
    action: "status",
    session,
    prompt: currentPrompt(session),
    profile,
  };
}

async function completedResponse(
  session: PlacementV3Session,
  deps: CoreDeps,
  userId: string,
): Promise<OrchestratorResponse> {
  return {
    ok: true,
    action: "respond",
    session,
    prompt: null,
    profile: await deps.loadCurrentProfile(session.id, userId),
  };
}

function validateResponse(
  input: RespondInput,
  prompt: PromptTask,
): OrchestratorResponse | null {
  if (input.promptId && input.promptId !== prompt.id) {
    return error("prompt_mismatch", "Response does not match the active prompt.", 409);
  }
  const text = normalizeResponseText(input.responseText ?? "");
  if (prompt.expectedResponse !== "audio" && text.length === 0) {
    return error("empty_response", "Please answer before continuing.", 400);
  }
  if (text.split(/\s+/).length > 10_000) {
    return error("response_too_long", "Response is too long for placement.", 413);
  }
  if (text.length > 0 && isMostlyNonEnglish(text)) {
    return error("wrong_language", "Please answer in English for this placement.", 400);
  }
  return null;
}

function normalizeResponseText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function isMostlyNonEnglish(text: string): boolean {
  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length < 4) return false;
  const ascii = text.match(/[A-Za-z]/g) ?? [];
  const vietnameseMarks = text.match(/[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/gi) ?? [];
  if (vietnameseMarks.length >= 3 && ascii.length / letters.length < 0.75) {
    return true;
  }
  return ascii.length / letters.length < 0.35;
}

function error(errorCode: string, message: string, status: number): OrchestratorResponse {
  return { ok: false, error: errorCode, message, status };
}
