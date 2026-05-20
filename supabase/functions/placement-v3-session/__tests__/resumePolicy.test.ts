import { describe, expect, it } from "vitest";
import { selectPrompt } from "../modality.ts";
import { makeSession } from "../persistence.ts";
import {
  decideResumePolicy,
  shouldOfferFreshStartAfterExpiry,
} from "../resumePolicy.ts";

function session(updatedAt: string) {
  const prompt = selectPrompt({
    modality: "writing",
    targetLevel: "A2",
    responses: [],
  });
  return {
    ...makeSession({
      id: "session-1",
      userId: "user-1",
      now: updatedAt,
      prompt,
    }),
    updated_at: updatedAt,
  };
}

describe("placement v3 resume policy", () => {
  it("returns no_session when nothing is active", () => {
    expect(decideResumePolicy(null, "2026-05-20T12:00:00.000Z").type).toBe("no_session");
  });

  it("resumes same-day in-progress sessions", () => {
    const s = session("2026-05-20T10:00:00.000Z");
    expect(decideResumePolicy(s, "2026-05-20T12:00:00.000Z")).toMatchObject({
      type: "resume_same_session",
      reason: "recent_in_progress",
    });
  });

  it("expires sessions after 24 hours of inactivity", () => {
    const s = session("2026-05-19T10:00:00.000Z");
    expect(decideResumePolicy(s, "2026-05-20T12:00:00.000Z")).toMatchObject({
      type: "expired",
      lastActivity: "2026-05-19T10:00:00.000Z",
    });
  });

  it("treats completed sessions as terminal", () => {
    const s = { ...session("2026-05-20T10:00:00.000Z"), flow_state: "completed" as const };
    expect(decideResumePolicy(s, "2026-05-20T12:00:00.000Z")).toMatchObject({
      type: "terminal",
      reason: "completed",
    });
  });

  it("treats abandoned sessions as terminal", () => {
    const s = { ...session("2026-05-20T10:00:00.000Z"), flow_state: "abandoned" as const };
    expect(decideResumePolicy(s, "2026-05-20T12:00:00.000Z")).toMatchObject({
      type: "terminal",
      reason: "abandoned",
    });
  });

  it("offers a fresh start hint after 7 days", () => {
    const s = session("2026-05-13T11:59:59.000Z");
    expect(shouldOfferFreshStartAfterExpiry(s, "2026-05-20T12:00:00.000Z")).toBe(true);
  });
});

