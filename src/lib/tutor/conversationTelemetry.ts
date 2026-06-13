import {
  startSession,
  logTurn,
  endSession,
  type CapturedCorrection,
  type CapturedError,
  type ConversationSessionSummary,
} from "@/lib/conversationCapture/conversationCapture";
import { hasCaptureConsent } from "@/lib/conversationCapture/captureConsent";
import {
  awardConversationTurnXP,
  getCurrentGeneralStreakDays,
  getEncouragementForTurn,
  type ConversationEncouragement,
} from "@/lib/retention/conversationHooks";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import type { ConversationPronunciationPromptSummary } from "@/lib/pronunciation/conversationPronunciation";
import type {
  ConversationMasteryEvidence,
  ConversationToneEvidence,
} from "@/lib/ai-conversation/learnerEvidence";

/**
 * Lane A telemetry adapter — the single seam between the conversation engine
 * and (1) C2 data capture and (2) D1 retention hooks. Two INDEPENDENT gates:
 *
 *  - CAPTURE is gated by `hasCaptureConsent()`. We re-check consent on every
 *    write, so a mid-session revoke immediately stops logging. With no consent
 *    nothing is sent to the capture pipeline.
 *  - RETENTION (encouragement copy + XP) is gated by the
 *    `CONVERSATION_RETENTION_HOOKS` feature flag (OFF in prod, ON in dev). It is
 *    NOT gated by capture consent: encouragement is warm UI copy and XP is the
 *    learner's own action, neither of which captures conversation content.
 *
 * The session carries the return-signal a later D1/D7 job needs to answer "did
 * this conversation user come back tomorrow?" — user/session id, the session
 * date, scenario/topic, turn count, and session end. No dashboard here; this
 * just guarantees the signal is emitted.
 *
 * Pure-ish adapter: it performs no DB writes itself (those live in the
 * conversationCapture module, outside the Study OS boundary) and keeps the
 * tutor layer honest.
 */

type Clock = () => Date;

const defaultNow: Clock = () => new Date();

function isoDate(date: Date): string {
  // Calendar date (YYYY-MM-DD) — the return-signal anchor for D1/D7 buckets.
  return date.toISOString().slice(0, 10);
}

export type TelemetrySessionInput = {
  /** Learner id; null/empty means no capture row can be written (RLS). */
  userId: string | null | undefined;
  /** Scenario/topic the learner picked, for the return signal. */
  scenarioId?: string | null;
  scenarioLabel?: string | null;
  /** Injectable clock for deterministic tests. Defaults to wall-clock. */
  now?: Clock;
};

export type TelemetrySession = {
  userId: string | null;
  /** Capture session id; null when consent was absent or there is no user. */
  sessionId: string | null;
  /** Consent state captured at session start (informational). */
  consentAtStart: boolean;
  /** Whether D1 retention hooks are active for this session. */
  retentionEnabled: boolean;
  /** ISO timestamp of session start. */
  startedAt: string;
  /** Calendar date of session start (YYYY-MM-DD) — D1/D7 anchor. */
  sessionDate: string;
  scenarioId: string | null;
  scenarioLabel: string | null;
  /** Turns recorded so far (incremented by recordTelemetryTurn). */
  turnCount: number;
  endedAt: string | null;
  now: Clock;
};

export type RecordTurnInput = {
  /** 1-based turn number within the session. */
  turnNumber: number;
  learnerInput: string;
  aiResponse: string;
  errors?: readonly CapturedError[];
  corrections?: readonly CapturedCorrection[];
  /**
   * Whether the learner accepted a correction this turn (drives the XP bump).
   * Defaults to true if any supplied correction is marked accepted.
   */
  correctionAccepted?: boolean;
  /**
   * Step-12: true when prior-session memory was injected into this turn's prompt
   * (the opener/correction referenced the learner's stored interference profile).
   * Recorded on the captured turn so telemetry proves the recall happened.
   */
  memoryRecalled?: boolean;
  pronunciationEvidence?: ConversationPronunciationPromptSummary | null;
  toneEvidence?: ConversationToneEvidence | null;
  masteryEvidence?: ConversationMasteryEvidence | null;
};

export type RecordTurnResult = {
  /** Warm, VN-first encouragement, or null when retention is disabled. */
  encouragement: ConversationEncouragement | null;
  /** True when this turn was logged to the capture pipeline. */
  captured: boolean;
  /** Step-12: echoes the input — true when prior-session memory was recalled this turn. */
  memoryRecalled: boolean;
};

/** The minimal return-signal a later D1/D7 analysis needs. */
export type ConversationReturnSignal = {
  userId: string | null;
  sessionId: string | null;
  sessionDate: string;
  startedAt: string;
  endedAt: string | null;
  scenarioId: string | null;
  scenarioLabel: string | null;
  turnCount: number;
};

/**
 * Open a telemetry session. Starts a capture session only when consent is
 * present and a user id exists; always computes the return-signal seed so the
 * caller has session date + scenario even if capture is off.
 */
export async function beginTelemetrySession(
  input: TelemetrySessionInput,
): Promise<TelemetrySession> {
  const now = input.now ?? defaultNow;
  const startedAtDate = now();
  const userId = normalizeId(input.userId);
  const consentAtStart = hasCaptureConsent();

  let sessionId: string | null = null;
  if (consentAtStart && userId) {
    sessionId = await startSession(userId, input.scenarioId ?? null);
  }

  return {
    userId,
    sessionId,
    consentAtStart,
    retentionEnabled: FEATURE_FLAGS.CONVERSATION_RETENTION_HOOKS,
    startedAt: startedAtDate.toISOString(),
    sessionDate: isoDate(startedAtDate),
    scenarioId: input.scenarioId ?? null,
    scenarioLabel: input.scenarioLabel ?? null,
    turnCount: 0,
    endedAt: null,
    now,
  };
}

/**
 * Record one conversation turn. Logs to capture only when consent is still
 * present and a session exists (re-checked each turn). Returns retention
 * encouragement when the flag is on; awards conversation XP the same way.
 */
export async function recordTelemetryTurn(
  session: TelemetrySession,
  input: RecordTurnInput,
): Promise<RecordTurnResult> {
  const errors = input.errors ?? [];
  const corrections = input.corrections ?? [];
  const correctionAccepted =
    input.correctionAccepted ?? corrections.some((correction) => correction?.accepted === true);

  session.turnCount += 1;

  const memoryRecalled = input.memoryRecalled === true;

  let captured = false;
  if (session.sessionId && hasCaptureConsent()) {
    await logTurn(
      session.sessionId,
      input.turnNumber,
      input.learnerInput,
      input.aiResponse,
      errors,
      corrections,
      {
        memoryRecalled,
        pronunciationEvidence: input.pronunciationEvidence ?? null,
        toneEvidence: input.toneEvidence ?? null,
        masteryEvidence: input.masteryEvidence
          ? {
              interactions: input.masteryEvidence.interactions,
              topicMastery: input.masteryEvidence.topicMastery,
              abstainedReason: input.masteryEvidence.abstainedReason,
              recommendationRule: input.masteryEvidence.recommendation?.ruleFired ?? null,
              recommendationTarget: input.masteryEvidence.recommendation?.targetSkill ?? null,
            }
          : null,
      },
    );
    captured = true;
  }

  let encouragement: ConversationEncouragement | null = null;
  if (session.retentionEnabled) {
    const streak = getCurrentGeneralStreakDays();
    encouragement = getEncouragementForTurn(input.turnNumber, errors.length, streak);
    awardConversationTurnXP(input.turnNumber, correctionAccepted);
  }

  return { encouragement, captured, memoryRecalled };
}

/**
 * Close the telemetry session. Writes the capture rollup/summary when consent
 * is present, and returns the final return-signal for D1/D7 analysis.
 */
export async function endTelemetrySession(
  session: TelemetrySession,
  summary?: string | ConversationSessionSummary,
): Promise<ConversationReturnSignal> {
  session.endedAt = session.now().toISOString();

  if (session.sessionId && hasCaptureConsent()) {
    await endSession(session.sessionId, summary ?? { turnCount: session.turnCount });
  }

  return buildReturnSignal(session);
}

/** Build the return-signal snapshot from a session (pure; testable). */
export function buildReturnSignal(session: TelemetrySession): ConversationReturnSignal {
  return {
    userId: session.userId,
    sessionId: session.sessionId,
    sessionDate: session.sessionDate,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    scenarioId: session.scenarioId,
    scenarioLabel: session.scenarioLabel,
    turnCount: session.turnCount,
  };
}

function normalizeId(value: string | null | undefined): string | null {
  const clean = String(value ?? "").trim();
  return clean.length > 0 ? clean : null;
}
