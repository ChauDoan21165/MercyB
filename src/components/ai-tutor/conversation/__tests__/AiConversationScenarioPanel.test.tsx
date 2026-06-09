import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import AiConversationScenarioPanel from "../AiConversationScenarioPanel";

describe("AiConversationScenarioPanel", () => {
  it("gates non-premium learners", () => {
    const sendTurn = vi.fn();

    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium={false}
        loadingAccess={false}
        sendTurn={sendTurn}
      />,
    );

    expect(screen.getByTestId("ai-conversation-premium-gate")).toHaveTextContent(
      "Mở luyện hội thoại AI nhiều lượt",
    );
    expect(screen.getByTestId("ai-conversation-gate-turn-count")).toHaveTextContent("Turn 0/50");
    expect(screen.queryByText("Mercy")).not.toBeInTheDocument();
    expect(sendTurn).not.toHaveBeenCalled();
  });

  it("renders a product gate and restores turn count when entitlement fails mid-submit", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Premium required",
      correction: null,
      summary: null,
      cost: {},
      provider: "local-fallback",
      pronunciationAbstention: null,
      entitlementGate: true,
    });

    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium
        loadingAccess={false}
        sendTurn={sendTurn}
      />,
    );

    await send("I want order food.");

    expect(await screen.findByTestId("ai-conversation-premium-gate")).toHaveTextContent(
      "Mở luyện hội thoại AI nhiều lượt",
    );
    expect(screen.getByTestId("ai-conversation-gate-turn-count")).toHaveTextContent("Turn 0/50");
    expect(screen.queryByText(/chỉ một chỗ nhỏ|one small thing/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Premium required")).not.toBeInTheDocument();
    expect(screen.queryByText("Mercy")).not.toBeInTheDocument();
    expect(sendTurn).toHaveBeenCalledTimes(1);
  });

  it("lets an entitled admin or premium learner complete a corrected conversation turn", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Great, you would like to order food. What drink would you like?",
      correction: {
        original: "I want order food.",
        corrected: "I want to order food.",
        explanationVi: "Tiếng Anh cần 'to' sau 'want' trước động từ.",
        interferencePattern: "Vietnamese transfer after want",
        confidence: "high",
      },
      summary: null,
      cost: { totalTokens: 90, estimatedUsd: 0.0001 },
      provider: "openai",
      pronunciationAbstention: null,
    });

    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium
        loadingAccess={false}
        sendTurn={sendTurn}
      />,
    );

    await send("I want order food.");

    expect(await screen.findByTestId("ai-conversation-correction")).toHaveTextContent(
      "I want to order food.",
    );
    expect(screen.getByText("Turn 1/50")).toBeInTheDocument();
    expect(screen.queryByTestId("ai-conversation-premium-gate")).not.toBeInTheDocument();
    expect(sendTurn).toHaveBeenCalledTimes(1);
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
    fireEvent.change(screen.getByPlaceholderText("Answer Mercy's question in English..."), {
      target: { value: text },
    });
    fireEvent.click(screen.getByRole("button", { name: /send answer/i }));
  });
}
