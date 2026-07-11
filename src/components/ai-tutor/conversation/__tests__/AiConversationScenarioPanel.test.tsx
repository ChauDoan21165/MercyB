import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AiConversationScenarioPanel from "../AiConversationScenarioPanel";
import { setCaptureConsent, hasCaptureConsent, hasCaptureConsentDecision } from "@/lib/conversationCapture/captureConsent";

const recordActiveDay = vi.hoisted(() => vi.fn());
vi.mock("@/lib/retention/recordActiveDay", () => ({ recordActiveDay }));

const putCorrection = vi.hoisted(() => vi.fn(async (_record: Record<string, unknown>) => {}));
vi.mock("@/lib/ai-tutor/learningMemory", () => ({ putCorrection }));

afterEach(() => {
  recordActiveDay.mockClear();
  putCorrection.mockClear();
  window.localStorage.clear();
});

describe("AiConversationScenarioPanel", () => {
  // All tests in this block start with consent already decided (true) so the
  // consent gate does not interrupt behaviour-under-test. Consent-gate tests
  // live in the dedicated describe block below.
  beforeEach(() => setCaptureConsent(true));
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

  // (a) Null profile + server-200: uncertain access must NOT gate client-side.
  // The server returned 200 → conversation proceeds, gate never shown.
  it("(a) profile=null + server-200: conversation proceeds, no client gate", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Good job! What else would you like to practice?",
      correction: null,
      summary: null,
      cost: { totalTokens: 80, estimatedUsd: 0.0001 },
      provider: "openai",
      pronunciationAbstention: null,
    });

    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium={false}
        loadingAccess={false}
        accessConfirmed={false}
        sendTurn={sendTurn}
      />,
    );

    // No gate shown — uncertain access shows conversation panel
    expect(screen.queryByTestId("ai-conversation-premium-gate")).not.toBeInTheDocument();
    expect(screen.getByTestId("ai-conversation-scenario-panel")).toBeInTheDocument();

    await send("I want to go to the beach.");

    // sendTurn was called (server reached), no gate shown
    expect(sendTurn).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("ai-conversation-premium-gate")).not.toBeInTheDocument();
    expect(await screen.findByText(/Good job!/)).toBeInTheDocument();
  });

  // (b) Confirmed free: gate shown immediately, server never called.
  it("(b) confirmed free: gate shown on send, server untouched", async () => {
    const sendTurn = vi.fn();

    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium={false}
        loadingAccess={false}
        accessConfirmed={true}
        sendTurn={sendTurn}
      />,
    );

    // Gate shows immediately on render for confirmed-free user
    expect(screen.getByTestId("ai-conversation-premium-gate")).toBeInTheDocument();
    expect(sendTurn).not.toHaveBeenCalled();
  });

  // (c) Loading state: no premature gate shown, loading spinner instead.
  it("(c) loading: spinner shown, no gate fires", () => {
    const sendTurn = vi.fn();

    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium={false}
        loadingAccess={true}
        accessConfirmed={false}
        sendTurn={sendTurn}
      />,
    );

    expect(screen.queryByTestId("ai-conversation-premium-gate")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-conversation-scenario-panel")).not.toBeInTheDocument();
    expect(screen.getByText(/Đang kiểm tra quyền Premium/)).toBeInTheDocument();
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
    // Step 10: a real conversation turn records the D1/D7 active day.
    expect(recordActiveDay).toHaveBeenCalledTimes(1);
    // Step 12 WRITE: the detected interference pattern is persisted to cross-session memory.
    expect(putCorrection).toHaveBeenCalledTimes(1);
    expect(putCorrection.mock.calls[0][0]).toMatchObject({
      topic: "Vietnamese transfer after want",
      tutorProduct: "ai-tutor",
      targetLanguage: "en",
    });
  });

  it("surfaces correction-memory write failures instead of swallowing the rejection", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    putCorrection.mockRejectedValueOnce(new Error("indexeddb unavailable"));
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Great, you would like to order food.",
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

    expect(putCorrection).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      "[ai-conversation] correction memory write failed",
      expect.any(Error),
    );
    warn.mockRestore();
  });

  it("passes learnerMemory into the turn request for cross-session recall (Step 12)", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Welcome back!", correction: null, summary: null,
      cost: {}, provider: "openai", pronunciationAbstention: null, memoryRecalled: true,
    });
    render(
      <AiConversationScenarioPanel
        accessToken="token" hasPremium loadingAccess={false} sendTurn={sendTurn}
        learnerMemory={{ interferencePatterns: ["article omission"], recentFocus: "tenses" }}
      />,
    );
    await send("Hello again.");
    expect(sendTurn).toHaveBeenCalledTimes(1);
    expect(sendTurn.mock.calls[0][0]).toMatchObject({
      learnerMemory: { interferencePatterns: ["article omission"], recentFocus: "tenses" },
    });
    // No correction this turn → no memory write.
    expect(putCorrection).not.toHaveBeenCalled();
  });

  it("records the D1/D7 active day on a successful turn, but NOT on the entitlement gate (Step 10)", async () => {
    const gated = vi.fn().mockResolvedValue({
      reply: "Premium required", correction: null, summary: null, cost: {},
      provider: "local-fallback", pronunciationAbstention: null, entitlementGate: true,
    });
    render(
      <AiConversationScenarioPanel accessToken="token" hasPremium loadingAccess={false} sendTurn={gated} />,
    );
    await send("I want order food.");
    // Entitlement gate fired → no engagement recorded.
    expect(recordActiveDay).not.toHaveBeenCalled();
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

// @vitest-environment jsdom
describe("AiConversationScenarioPanel — consent gate (M19)", () => {
  // localStorage is already cleared by the outer afterEach, so each test here
  // starts with no stored consent decision (hasCaptureConsentDecision() === false).

  it("modal is not shown on mount — only on first send attempt", () => {
    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium
        loadingAccess={false}
      />,
    );
    // No consent modal until the learner tries to send.
    expect(screen.queryByText("Cải thiện bài học của bạn")).not.toBeInTheDocument();
    expect(hasCaptureConsentDecision()).toBe(false);
  });

  it("modal appears on first send when no consent decision is stored", async () => {
    const sendTurn = vi.fn();
    render(
      <AiConversationScenarioPanel
        accessToken="token"
        hasPremium
        loadingAccess={false}
        sendTurn={sendTurn}
      />,
    );
    await act(async () => {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "I go to school." } });
      fireEvent.click(screen.getByRole("button", { name: /send answer/i }));
    });
    // Modal is visible — Dialog marks background aria-hidden so we query by text.
    expect(screen.getByText("Cải thiện bài học của bạn")).toBeInTheDocument();
    // No turn was submitted yet — the gate paused the send.
    expect(sendTurn).not.toHaveBeenCalled();
    expect(hasCaptureConsentDecision()).toBe(false);
  });

  it("after opt-in the send proceeds and the modal does not reappear", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Good job!",
      correction: null,
      summary: null,
      cost: { totalTokens: 50, estimatedUsd: 0.0001 },
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
    await act(async () => {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "I go to school." } });
      fireEvent.click(screen.getByRole("button", { name: /send answer/i }));
    });
    // Modal shown — click "Đồng ý" (agree).
    await act(async () => {
      fireEvent.click(screen.getByText(/Đồng ý/));
    });
    expect(hasCaptureConsent()).toBe(true);
    // sendTurn was called — the turn proceeded after opt-in.
    expect(sendTurn).toHaveBeenCalledTimes(1);
    // Modal is gone.
    expect(screen.queryByText("Cải thiện bài học của bạn")).not.toBeInTheDocument();
    // A second send does not re-show the modal.
    await send("Another sentence.");
    expect(screen.queryByText("Cải thiện bài học của bạn")).not.toBeInTheDocument();
  });

  it("after decline the send still proceeds (decline = no nag, not blocked)", async () => {
    const sendTurn = vi.fn().mockResolvedValue({
      reply: "Alright.",
      correction: null,
      summary: null,
      cost: { totalTokens: 50, estimatedUsd: 0.0001 },
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
    await act(async () => {
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "I go to school." } });
      fireEvent.click(screen.getByRole("button", { name: /send answer/i }));
    });
    // Click "Không, cảm ơn" (decline).
    await act(async () => {
      fireEvent.click(screen.getByText(/Không, cảm ơn/));
    });
    expect(hasCaptureConsent()).toBe(false);
    expect(hasCaptureConsentDecision()).toBe(true);
    // The turn still goes through (declining ≠ blocking the conversation).
    expect(sendTurn).toHaveBeenCalledTimes(1);
    // A second send does not re-show the modal.
    await send("Another sentence.");
    expect(screen.queryByText("Cải thiện bài học của bạn")).not.toBeInTheDocument();
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
