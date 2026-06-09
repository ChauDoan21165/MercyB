import { describe, expect, it } from "vitest";
import {
  AI_CONVERSATION_MAX_TURNS,
  buildAiConversationSummary,
  canSendAiConversationTurn,
  createAiConversationSession,
} from "../session";

describe("AI conversation session foundation", () => {
  it("enforces the 50-turn cap", () => {
    const session = createAiConversationSession("job-interview");
    expect(canSendAiConversationTurn(session)).toBe(true);

    const capped = {
      ...session,
      learnerTurnCount: AI_CONVERSATION_MAX_TURNS,
    };

    expect(canSendAiConversationTurn(capped)).toBe(false);
  });

  it("shapes a summary for cross-session memory later", () => {
    const summary = buildAiConversationSummary([
      { id: "l1", role: "learner", text: "I responsible for reports." },
      {
        id: "a1",
        role: "assistant",
        text: "You said you handle reports. What kind of reports?",
        correction: {
          original: "I responsible for",
          corrected: "I am responsible for",
          explanationVi: "Tiếng Anh cần 'am' trước responsible.",
          interferencePattern: "missing be from Vietnamese transfer",
          confidence: "high",
        },
      },
    ]);

    expect(summary.practiced).toContain("job interview answers");
    expect(summary.errorsCaught).toEqual(["missing be from Vietnamese transfer"]);
    expect(summary.progressNote).toContain("Continue");
  });
});
