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
  type PlacementHistoryEntryV3,
  type PlacementProfileSnapshotV3,
  type PlacementV3Profile,
  type PlacementV3Request,
  type PlacementV3Response,
  type PlacementV3Session,
  type PromptTask,
  type RespondInput,
} from "./types.ts";
import { isPlacementSyntheticMarkerValue } from "./syntheticMarker.ts";

const PLACEMENT_V3_BANK_VERSION = "placement-v3-session-v1";
const FALLBACK_STARTING_ROOM = "placement-v3:b1:grammar-foundation";

const DEFAULT_PAIR = { native: "vi", target: "en" };
const STALE_UNGRADED_RESPONSE_MS = 30_000;
const COMPLETION_RETRY_DELAYS_MS = [150, 450] as const;

export interface CoreDeps extends OrchestratorDeps {
  writingGrader?: WritingGraderClient;
}

export async function handleAction(args: {
  userId: string;
  request: PlacementV3Request;
  deps: CoreDeps;
}): Promise<OrchestratorResponse> {
  const { userId, request, deps } = args;
  if (!userId.trim()) {
    return error("auth_required", "Sign in to start placement.", 401);
  }
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
    isSynthetic: isPlacementSyntheticMarkerValue(input.syntheticMonitoring),
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
  if (duplicate && !isRecoverableUngradedResponse(duplicate, now)) {
    deps.log?.("placement_v3.response_duplicate_suppressed", {
      sessionId: session.id,
      taskIndex: input.taskIndex,
      graded: isResponseGraded(duplicate),
    });
    return duplicateResponse(session, userId, deps);
  }
  const prompt = currentPrompt(session);
  if (!prompt) return error("prompt_missing", "Session has no active prompt.", 409);
  const validation = validateResponse(input, prompt);
  if (validation) return validation;

  const response: PlacementV3Response = {
    session_id: session.id,
    task_index: input.taskIndex,
    modality: prompt.modality,
    prompt_id: prompt.id,
    prompt_text: prompt.promptText,
    user_response_text: normalizeResponseText(input.responseText ?? ""),
    audio_storage_path: input.audioStoragePath ?? null,
    response_duration_ms: input.responseDurationMs ?? null,
    ai_assessment: null,
    ai_assessment_version: null,
    graded_at: null,
    created_at: now,
  };
  const claim = duplicate
    ? { response: duplicate, inserted: false }
    : await deps.insertResponse(response);
  deps.log?.("placement_v3.response_slot_claim", {
    sessionId: session.id,
    taskIndex: input.taskIndex,
    inserted: claim.inserted,
    staleUngraded: !claim.inserted && isRecoverableUngradedResponse(claim.response, now),
  });
  if (!claim.inserted && !isRecoverableUngradedResponse(claim.response, now)) {
    deps.log?.("placement_v3.response_duplicate_suppressed", {
      sessionId: session.id,
      taskIndex: input.taskIndex,
      graded: isResponseGraded(claim.response),
    });
    return duplicateResponse(session, userId, deps);
  }
  if (!claim.inserted) {
    deps.log?.("placement_v3.response_slot_recovered", {
      sessionId: session.id,
      taskIndex: input.taskIndex,
    });
  }

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

  const savedResponse = await deps.updateResponse({
    ...claim.response,
    ai_assessment: grade.assessment,
    ai_assessment_version: grade.version,
    graded_at: now,
  });
  const allResponses = mergeResponseByTaskIndex(responses, savedResponse);
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
    const updated = await retryCompletionStep(
      deps,
      "completion.updateSession",
      input.taskIndex,
      () => deps.updateSession(completed),
    );
    const profile = await retryCompletionStep(
      deps,
      "completion.finalizeProfile",
      input.taskIndex,
      () => finalizeProfile(userId, updated.id, allResponses, now, deps),
    );
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
  const persisted = await deps.upsertProfile(profile);
  // Mirror v2's `profiles` snapshot write on completion so downstream
  // surfaces (FocusAreasCard, AccountPage) read the same columns
  // regardless of placement version. Compliant under the directional
  // carve-out of "no Placement writeback" (STRATEGY.md §12).
  await deps.writeProfileSnapshot(buildProfileSnapshot(persisted, now));
  return persisted;
}

function buildProfileSnapshot(
  profile: PlacementV3Profile,
  now: string,
): PlacementProfileSnapshotV3 {
  const startingRoom =
    profile.recommended_lessons[0]?.lessonId ?? FALLBACK_STARTING_ROOM;
  const weaknessTags = collectWeaknessTags(profile);
  const historyEntry: PlacementHistoryEntryV3 = {
    ts: now,
    bankVersion: PLACEMENT_V3_BANK_VERSION,
    theta: null,
    se: null,
    cefr: profile.cefr_overall,
    perSkill: {},
    l1Top: profile.l1_interference_flags
      .slice(0, 3)
      .map((flag) => flag.patternId),
    sessionId: profile.session_id,
    source: "v3",
  };
  return {
    userId: profile.user_id,
    sessionId: profile.session_id,
    cefr: profile.cefr_overall,
    startingRoom,
    completedAt: now,
    weaknessTags,
    historyEntry,
  };
}

function collectWeaknessTags(profile: PlacementV3Profile): string[] {
  // Prefer L1 interference patternIds (stable, snake_case, cross-link
  // anchors). Fall back to free-form `gaps` strings when no L1 flags
  // fired (e.g. an unusually strong session). Deduped, capped at 8.
  const seen = new Set<string>();
  const out: string[] = [];
  for (const flag of profile.l1_interference_flags) {
    if (!flag.patternId || seen.has(flag.patternId)) continue;
    seen.add(flag.patternId);
    out.push(flag.patternId);
    if (out.length >= 8) return out;
  }
  for (const gap of profile.gaps) {
    if (!gap || seen.has(gap)) continue;
    seen.add(gap);
    out.push(gap);
    if (out.length >= 8) return out;
  }
  return out;
}

async function retryCompletionStep<T>(
  deps: CoreDeps,
  operation: string,
  taskIndex: number,
  run: () => Promise<T>,
): Promise<T> {
  for (let attempt = 0; attempt <= COMPLETION_RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await run();
    } catch (err) {
      if (!isTransientCompletionError(err) || attempt >= COMPLETION_RETRY_DELAYS_MS.length) {
        throw err;
      }
      deps.log?.("placement_v3.completion_retry", {
        operation,
        attempt: attempt + 1,
        taskIndex,
        error: errorMessage(err),
      });
      await delay(COMPLETION_RETRY_DELAYS_MS[attempt]);
    }
  }
  throw new Error(`Retry loop exhausted for ${operation}`);
}

function isTransientCompletionError(err: unknown): boolean {
  const message = errorMessage(err).toLowerCase();
  return /\b(500|502|503|504|timeout|timed out|temporar|connection|network|fetch failed|econnreset|etimedout|und_err)\b/
    .test(message);
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message.slice(0, 240);
  return String(err).slice(0, 240);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function duplicateResponse(
  session: PlacementV3Session,
  userId: string,
  deps: CoreDeps,
): Promise<OrchestratorResponse> {
  const latest = await deps.loadSession(session.id, userId);
  if (!latest) return error("session_not_found", "Placement session was not found.", 404);
  if (latest.flow_state === "completed") {
    return completedResponse(latest, deps, userId);
  }
  return {
    ok: true,
    action: "respond",
    session: latest,
    prompt: currentPrompt(latest),
    profile: null,
    resumed: true,
  };
}

function mergeResponseByTaskIndex(
  responses: PlacementV3Response[],
  savedResponse: PlacementV3Response,
): PlacementV3Response[] {
  const replaced = responses.some((row) => row.task_index === savedResponse.task_index);
  const merged = replaced
    ? responses.map((row) =>
      row.task_index === savedResponse.task_index ? savedResponse : row
    )
    : [...responses, savedResponse];
  return merged.sort((a, b) => a.task_index - b.task_index);
}

function isResponseGraded(response: PlacementV3Response): boolean {
  return response.graded_at !== null || response.ai_assessment !== null;
}

function isRecoverableUngradedResponse(
  response: PlacementV3Response,
  nowIso: string,
): boolean {
  if (isResponseGraded(response)) return false;
  const createdAt = Date.parse(response.created_at);
  const now = Date.parse(nowIso);
  if (!Number.isFinite(createdAt) || !Number.isFinite(now)) return false;
  return now - createdAt >= STALE_UNGRADED_RESPONSE_MS;
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
