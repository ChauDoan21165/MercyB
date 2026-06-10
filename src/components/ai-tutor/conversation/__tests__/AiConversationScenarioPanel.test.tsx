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

  it("fails closed without a canned Mercy reply when the turn falls back to local-fallback (Contract C6)", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      // The client returns a canned local-fallback reply on transport failure;
      // the panel must NOT render it as a Mercy turn.
      reply: "Mercy chưa lấy được câu trả lời AI an toàn, nên mình không đoán lỗi của bạn.",
      correction: null,
      summary: null,
      cost: {},
      provider: "local-fallback",
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

    // No canned Mercy bubble; the preset reply text is never shown.
    expect(screen.queryByText("Mercy")).not.toBeInTheDocument();
    expect(screen.queryByText(/không đoán lỗi của bạn/)).not.toBeInTheDocument();
    // Explicit VN-first retry surface instead, input restored, turn count unchanged.
    expect(screen.getByText(/Mercy chưa lấy được câu trả lời\. Bạn thử lại/)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("I want order food.");
    expect(screen.getByText("Turn 0/50")).toBeInTheDocument();
    expect(sendTurn).toHaveBeenCalledTimes(1);
  });

  it("starts learner-led with no preset Mercy opening and sends the learner's words as the seed", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "You mentioned your morning commute. What happened on the bus?",
      correction: null,
      summary: null,
      cost: { totalTokens: 80, estimatedUsd: 0.0001 },
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

    expect(screen.getByTestId("ai-conversation-scenario-panel")).toHaveTextContent(
      "Mercy follows your words",
    );
    expect(screen.queryByText("Mercy")).not.toBeInTheDocument();

    await send("This morning my bus was late and I felt nervous.");

    expect(sendTurn).toHaveBeenCalledWith(expect.objectContaining({
      scenarioId: "learner-led",
      learnerText: "This morning my bus was late and I felt nervous.",
      history: [],
      turnCount: 0,
    }));
  });

  it("shows a chosen preset scenario as a starter hint, not a canned Mercy turn, and sends live with empty history (Contract C6)", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Good start. What role are you applying for?",
      correction: null,
      summary: null,
      cost: { totalTokens: 80, estimatedUsd: 0.0001 },
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

    fireEvent.change(screen.getByRole("combobox", { name: "Choose conversation scenario" }), {
      target: { value: "topic-work" },
    });

    expect(screen.getByTestId("ai-conversation-scenario-panel")).toHaveTextContent(
      "Work",
    );
    // C6: the scenario's opening prompt is a non-transcript starter hint, never a
    // canned Mercy assistant turn — so no "Mercy" bubble appears before the model replies.
    expect(screen.getByTestId("ai-conversation-starter-hint")).toBeInTheDocument();
    expect(screen.queryByText("Mercy")).not.toBeInTheDocument();

    await send("I want a customer service job.");

    expect(sendTurn).toHaveBeenCalledWith(expect.objectContaining({
      scenarioId: "topic-work",
      learnerText: "I want a customer service job.",
      history: [],
      turnCount: 0,
    }));
  });

  it("seeds a learner-led live conversation from a 'Sửa câu' correction without a canned opener", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Nice — you fixed that. Where do you want to go this weekend?",
      correction: null,
      summary: null,
      cost: { totalTokens: 70, estimatedUsd: 0.0001 },
      provider: "openai",
      pronunciationAbstention: null,
    });

    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium
        loadingAccess={false}
        correctionSeed={{
          correctedSentence: "I want to go to the beach.",
          sourceText: "I want go to the beach.",
          updatedAt: 1,
        }}
        sendTurn={sendTurn}
      />,
    );

    // Learner-led (no canned opener), seeded with the learner's corrected words.
    expect(screen.getByTestId("ai-conversation-scenario-panel")).toHaveTextContent(
      "Mercy follows your words",
    );
    expect(screen.queryByText("Mercy")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("I want to go to the beach.");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /send answer/i }));
    });

    expect(sendTurn).toHaveBeenCalledWith(expect.objectContaining({
      scenarioId: "learner-led",
      learnerText: "I want to go to the beach.",
      history: [],
      turnCount: 0,
    }));
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
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: text },
    });
    fireEvent.click(screen.getByRole("button", { name: /send answer/i }));
  });
}
