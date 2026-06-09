import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/conversationCapture/conversationCapture", () => ({
  startSession: vi.fn(async () => "sess-1"),
  logTurn: vi.fn(async () => {}),
  endSession: vi.fn(async () => {}),
}));
vi.mock("@/lib/conversationCapture/captureConsent", () => ({
  hasCaptureConsent: vi.fn(() => true),
}));
vi.mock("@/lib/retention/conversationHooks", () => ({
  getEncouragementForTurn: vi.fn(() => ({ tone: "momentum", vi: "Tốt lắm.", en: "Nice." })),
  awardConversationTurnXP: vi.fn(() => {}),
  getCurrentGeneralStreakDays: vi.fn(() => 4),
}));
vi.mock("@/lib/featureFlags", () => ({
  FEATURE_FLAGS: { CONVERSATION_RETENTION_HOOKS: true },
}));

import {
  startSession,
  logTurn,
  endSession,
} from "@/lib/conversationCapture/conversationCapture";
import { hasCaptureConsent } from "@/lib/conversationCapture/captureConsent";
import {
  awardConversationTurnXP,
  getEncouragementForTurn,
} from "@/lib/retention/conversationHooks";
import { FEATURE_FLAGS } from "@/lib/featureFlags";

import {
  beginTelemetrySession,
  endTelemetrySession,
  recordTelemetryTurn,
} from "@/lib/tutor/conversationTelemetry";

const FIXED_NOW = () => new Date("2026-06-09T10:00:00.000Z");

function turnInput(over: Partial<Parameters<typeof recordTelemetryTurn>[1]> = {}) {
  return {
    turnNumber: 1,
    learnerInput: "I go to work yesterday.",
    aiResponse: "Nice — you mean 'I went to work yesterday.'",
    ...over,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(hasCaptureConsent).mockReturnValue(true);
  vi.mocked(startSession).mockResolvedValue("sess-1");
  FEATURE_FLAGS.CONVERSATION_RETENTION_HOOKS = true;
});

describe("beginTelemetrySession", () => {
  it("starts a capture session when consent is present and a user id exists", async () => {
    const session = await beginTelemetrySession({
      userId: "user-1",
      scenarioId: "topic-banking-opening-account",
      scenarioLabel: "Mở tài khoản ngân hàng",
      now: FIXED_NOW,
    });
    expect(startSession).toHaveBeenCalledWith("user-1", "topic-banking-opening-account");
    expect(session.sessionId).toBe("sess-1");
    expect(session.sessionDate).toBe("2026-06-09");
    expect(session.startedAt).toBe("2026-06-09T10:00:00.000Z");
    expect(session.scenarioId).toBe("topic-banking-opening-account");
    expect(session.turnCount).toBe(0);
  });

  it("does NOT start a capture session without consent", async () => {
    vi.mocked(hasCaptureConsent).mockReturnValue(false);
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    expect(startSession).not.toHaveBeenCalled();
    expect(session.sessionId).toBeNull();
    // The return-signal seed is still computed (date + scenario), capture aside.
    expect(session.sessionDate).toBe("2026-06-09");
  });

  it("does NOT start a capture session without a user id even with consent", async () => {
    const session = await beginTelemetrySession({ userId: "  ", now: FIXED_NOW });
    expect(startSession).not.toHaveBeenCalled();
    expect(session.sessionId).toBeNull();
    expect(session.userId).toBeNull();
  });
});

describe("recordTelemetryTurn — capture gating", () => {
  it("logs the turn when consent + session are present", async () => {
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    const result = await recordTelemetryTurn(session, turnInput({ turnNumber: 2 }));
    expect(logTurn).toHaveBeenCalledTimes(1);
    expect(result.captured).toBe(true);
    expect(session.turnCount).toBe(1);
  });

  it("does NOT log when there is no consented session", async () => {
    vi.mocked(hasCaptureConsent).mockReturnValue(false);
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    const result = await recordTelemetryTurn(session, turnInput());
    expect(logTurn).not.toHaveBeenCalled();
    expect(result.captured).toBe(false);
    // Turn count still advances for the return signal.
    expect(session.turnCount).toBe(1);
  });

  it("stops logging when consent is revoked mid-session", async () => {
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    await recordTelemetryTurn(session, turnInput({ turnNumber: 1 }));
    vi.mocked(hasCaptureConsent).mockReturnValue(false);
    const second = await recordTelemetryTurn(session, turnInput({ turnNumber: 2 }));
    expect(logTurn).toHaveBeenCalledTimes(1);
    expect(second.captured).toBe(false);
  });
});

describe("recordTelemetryTurn — retention gating", () => {
  it("returns encouragement and awards XP when the flag is ON", async () => {
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    const result = await recordTelemetryTurn(
      session,
      turnInput({ turnNumber: 3, corrections: [{ accepted: true }] }),
    );
    expect(result.encouragement).not.toBeNull();
    expect(getEncouragementForTurn).toHaveBeenCalledWith(3, 0, 4);
    expect(awardConversationTurnXP).toHaveBeenCalledWith(3, true);
  });

  it("returns NO encouragement and does NOT award XP when the flag is OFF", async () => {
    FEATURE_FLAGS.CONVERSATION_RETENTION_HOOKS = false;
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    const result = await recordTelemetryTurn(session, turnInput({ turnNumber: 2 }));
    expect(result.encouragement).toBeNull();
    expect(getEncouragementForTurn).not.toHaveBeenCalled();
    expect(awardConversationTurnXP).not.toHaveBeenCalled();
  });

  it("runs retention even without capture consent (independent gates)", async () => {
    vi.mocked(hasCaptureConsent).mockReturnValue(false);
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    const result = await recordTelemetryTurn(session, turnInput({ turnNumber: 2 }));
    expect(result.captured).toBe(false);
    expect(result.encouragement).not.toBeNull();
    expect(awardConversationTurnXP).toHaveBeenCalled();
  });

  it("passes the detected error count to the encouragement hook", async () => {
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    await recordTelemetryTurn(
      session,
      turnInput({ turnNumber: 4, errors: [{ errorType: "tense" }, { errorType: "article" }] }),
    );
    expect(getEncouragementForTurn).toHaveBeenCalledWith(4, 2, 4);
  });
});

describe("endTelemetrySession + return signal", () => {
  it("ends the capture session and returns the D1/D7 return signal", async () => {
    const session = await beginTelemetrySession({
      userId: "user-1",
      scenarioId: "topic-nail-technician-client-consultation",
      scenarioLabel: "Tư vấn khách làm móng",
      now: FIXED_NOW,
    });
    await recordTelemetryTurn(session, turnInput({ turnNumber: 1 }));
    await recordTelemetryTurn(session, turnInput({ turnNumber: 2 }));
    const signal = await endTelemetrySession(session);

    expect(endSession).toHaveBeenCalledTimes(1);
    expect(signal).toEqual({
      userId: "user-1",
      sessionId: "sess-1",
      sessionDate: "2026-06-09",
      startedAt: "2026-06-09T10:00:00.000Z",
      endedAt: "2026-06-09T10:00:00.000Z",
      scenarioId: "topic-nail-technician-client-consultation",
      scenarioLabel: "Tư vấn khách làm móng",
      turnCount: 2,
    });
  });

  it("does NOT call endSession without consent but still returns a signal", async () => {
    vi.mocked(hasCaptureConsent).mockReturnValue(false);
    const session = await beginTelemetrySession({ userId: "user-1", now: FIXED_NOW });
    await recordTelemetryTurn(session, turnInput());
    const signal = await endTelemetrySession(session);
    expect(endSession).not.toHaveBeenCalled();
    expect(signal.turnCount).toBe(1);
    expect(signal.sessionId).toBeNull();
    expect(signal.sessionDate).toBe("2026-06-09");
  });
});
