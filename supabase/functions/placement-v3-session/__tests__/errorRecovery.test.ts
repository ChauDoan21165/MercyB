import { describe, expect, it } from "vitest";
import {
  canClientRetry,
  classifyFailure,
  recoverGraderFailure,
  sessionErrorFromDecision,
} from "../errorRecovery.ts";
import { makeSession } from "../persistence.ts";
import { FIRST_PROMPT } from "./fixtures/mock-sessions.ts";
import type { GraderInput } from "../types.ts";

function input(): GraderInput {
  return {
    userId: "user-1",
    sessionId: "session-1",
    modality: "writing",
    prompt: FIRST_PROMPT,
    responseText: "I study English because it helps my work.",
  };
}

describe("placement v3 error recovery", () => {
  it("grader timeout is recoverable and retryable on the first attempt", () => {
    const decision = classifyFailure("grader_timeout", 1);
    expect(decision).toMatchObject({ recoverable: true, retry: true, continueSession: true });
  });

  it("grader malformed JSON falls back without retry", () => {
    const recovered = recoverGraderFailure(input(), "grader_malformed_json");
    expect(recovered.ok).toBe(false);
    expect(recovered.errorCode).toBe("malformed_json");
    expect(recovered.assessment.confidence).toBe(0.35);
  });

  it("database write failure is not recoverable in client state", () => {
    expect(classifyFailure("db_write_failed")).toMatchObject({
      recoverable: false,
      continueSession: false,
      status: 500,
    });
  });

  it("auth failure maps to 401 and does not continue", () => {
    expect(classifyFailure("auth_failed")).toMatchObject({
      recoverable: false,
      status: 401,
      code: "auth_required",
    });
  });

  it("rate limit uses fail-soft fallback scoring", () => {
    const recovered = recoverGraderFailure(input(), "grader_rate_limited");
    expect(recovered.errorCode).toBe("rate_limited");
    expect(recovered.assessment.metadata?.fallback).toBe(true);
  });

  it("turns recovery decisions into session error metadata", () => {
    const error = sessionErrorFromDecision(
      classifyFailure("grader_timeout"),
      "2026-05-20T12:00:00.000Z",
    );
    expect(error).toMatchObject({ code: "timeout", recoverable: true });
  });

  it("does not allow retry once a session is terminal", () => {
    const session = {
      ...makeSession({
        id: "session-1",
        userId: "user-1",
        now: "2026-05-20T12:00:00.000Z",
        prompt: FIRST_PROMPT,
      }),
      flow_state: "completed" as const,
    };
    expect(canClientRetry(session, "grader_timeout")).toBe(false);
  });
});

