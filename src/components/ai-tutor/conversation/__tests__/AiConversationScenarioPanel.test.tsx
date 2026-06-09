import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import AiConversationScenarioPanel from "../AiConversationScenarioPanel";

describe("AiConversationScenarioPanel", () => {
  it("gates non-premium learners", () => {
    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium={false}
        loadingAccess={false}
      />,
    );

    expect(screen.getByTestId("ai-conversation-premium-gate")).toHaveTextContent("Premium-only");
  });

  it("runs a coherent 4-turn job interview proof and renders correction plus summary", async () => {
    const sendTurn = vi.fn()
      .mockResolvedValueOnce({
        reply: "You said you want a customer service role. What did you do in your last job?",
        correction: null,
        summary: null,
        cost: { totalTokens: 100, estimatedUsd: 0.0001 },
        provider: "openai",
      })
      .mockResolvedValueOnce({
        reply: "You mentioned reports. What kind of reports were you responsible for?",
        correction: {
          original: "I responsible for",
          corrected: "I am responsible for",
          explanationVi: "Tiếng Anh cần 'am' trước responsible vì tiếng Việt thường bỏ 'to be'.",
          interferencePattern: "missing be from Vietnamese transfer",
          confidence: "high",
        },
        summary: null,
        cost: { totalTokens: 110, estimatedUsd: 0.0001 },
        provider: "openai",
      })
      .mockResolvedValueOnce({
        reply: "You said you worked with customers. Tell me about a difficult customer.",
        correction: null,
        summary: null,
        cost: { totalTokens: 120, estimatedUsd: 0.0001 },
        provider: "openai",
      })
      .mockResolvedValueOnce({
        reply: "You handled that calmly. Why should this company hire you?",
        correction: null,
        summary: {
          practiced: ["job interview answers", "answer-specific follow-up questions"],
          errorsCaught: ["missing be from Vietnamese transfer"],
          progressNote: "You completed a coherent interview sequence.",
        },
        cost: { totalTokens: 130, estimatedUsd: 0.0001 },
        provider: "openai",
      });

    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium
        loadingAccess={false}
        sendTurn={sendTurn}
      />,
    );

    await send("I want a customer service job.");
    await screen.findByText(/What did you do in your last job/);
    await send("I responsible for daily reports.");
    await screen.findByTestId("ai-conversation-correction");
    await send("I worked with customers in a cafe.");
    await screen.findByText(/difficult customer/);
    await send("I stayed calm and listened first.");

    await screen.findByTestId("ai-conversation-summary");
    expect(screen.getByText(/You completed a coherent interview sequence/)).toBeInTheDocument();
    expect(sendTurn).toHaveBeenCalledTimes(4);
    expect(sendTurn.mock.calls[1][0].history.some((turn: { text: string }) =>
      turn.text.includes("customer service role"),
    )).toBe(true);
  });
});

async function send(text: string) {
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText("Answer Mercy's interview question in English..."), {
      target: { value: text },
    });
    fireEvent.click(screen.getByRole("button", { name: /send answer/i }));
  });
}
