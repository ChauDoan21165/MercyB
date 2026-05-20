import { describe, expect, it } from "vitest";
import {
  appendRecoverableError,
  canTransition,
  isExpired,
  markAbandoned,
  markCompleted,
  markError,
  recoverFromError,
} from "../state.ts";
import { freshSession, NOW } from "./fixtures/mock-sessions.ts";

describe("placement v3 state machine", () => {
  it("allows fresh in_progress session to respond", () => {
    expect(canTransition("in_progress", "respond")).toBe(true);
  });

  it("marks in_progress + abandon as abandoned terminal", () => {
    const abandoned = markAbandoned(freshSession(), NOW);
    expect(abandoned.flow_state).toBe("abandoned");
    expect(canTransition(abandoned.flow_state, "respond")).toBe(false);
  });

  it("marks completed as terminal but readable", () => {
    const completed = markCompleted(freshSession(), NOW);
    expect(completed.flow_state).toBe("completed");
    expect(canTransition("completed", "status")).toBe(true);
    expect(canTransition("completed", "respond")).toBe(true);
  });

  it("puts hard errors in error state", () => {
    const errored = markError(freshSession(), {
      at: NOW,
      code: "db_write_failed",
      message: "write failed",
      recoverable: false,
    });
    expect(errored.flow_state).toBe("error");
    expect(errored.metadata.errors?.[0].code).toBe("db_write_failed");
  });

  it("recovers error state on resume", () => {
    const recovered = recoverFromError(
      markError(freshSession(), {
        at: NOW,
        code: "grader_timeout",
        message: "timeout",
        recoverable: true,
      }),
      NOW,
    );
    expect(recovered.flow_state).toBe("in_progress");
  });

  it("records recoverable errors without changing state", () => {
    const session = appendRecoverableError(freshSession(), {
      at: NOW,
      code: "timeout",
      message: "fallback",
      recoverable: true,
    });
    expect(session.flow_state).toBe("in_progress");
    expect(session.metadata.errors).toHaveLength(1);
  });

  it("expires sessions after 24 hours since updated_at", () => {
    const session = { ...freshSession(), updated_at: "2026-05-19T10:00:00.000Z" };
    expect(isExpired(session, NOW)).toBe(true);
  });

  it("does not expire recent sessions", () => {
    const session = { ...freshSession(), updated_at: "2026-05-20T11:59:00.000Z" };
    expect(isExpired(session, NOW)).toBe(false);
  });
});

