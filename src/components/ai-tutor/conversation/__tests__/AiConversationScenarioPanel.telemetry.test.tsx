import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the telemetry seam so this test verifies the PANEL WIRING (does it render
// the retention encouragement and end the capture session?) rather than the
// telemetry internals, which have their own unit tests in
// src/lib/tutor/__tests__/conversationTelemetry.test.ts.
const telemetryMocks = vi.hoisted(() => ({
  begin: vi.fn(),
  record: vi.fn(),
  end: vi.fn(),
}));

vi.mock("@/lib/tutor/conversationTelemetry", () => ({
  beginTelemetrySession: telemetryMocks.begin,
  recordTelemetryTurn: telemetryMocks.record,
  endTelemetrySession: telemetryMocks.end,
}));

import AiConversationScenarioPanel from "../AiConversationScenarioPanel";

const fakeSession = {
  userId: "user-1",
  sessionId: "session-1",
  consentAtStart: true,
  retentionEnabled: true,
  startedAt: "2026-06-10T00:00:00.000Z",
  sessionDate: "2026-06-10",
  scenarioId: "learner-led",
  scenarioLabel: "Mercy follows your words",
  turnCount: 0,
  endedAt: null,
  now: () => new Date("2026-06-10T00:00:00.000Z"),
};

beforeEach(() => {
  telemetryMocks.begin.mockReset().mockResolvedValue(fakeSession);
  telemetryMocks.record.mockReset().mockResolvedValue({
    encouragement: {
      tone: "encourage",
      vi: "Bạn nói tốt lắm rồi — mình chỉnh nhẹ một chút nhé.",
      en: "Nice work — just one small tidy-up.",
    },
    captured: true,
  });
  telemetryMocks.end.mockReset().mockResolvedValue({
    userId: "user-1",
    sessionId: "session-1",
    sessionDate: "2026-06-10",
    startedAt: "2026-06-10T00:00:00.000Z",
    endedAt: "2026-06-10T00:05:00.000Z",
    scenarioId: "learner-led",
    scenarioLabel: "Mercy follows your words",
    turnCount: 1,
  });
});

function renderPanel() {
  return render(
    <AiConversationScenarioPanel
      accessToken="token"
      hasPremium
      loadingAccess={false}
      userId="user-1"
      sendTurn={vi.fn().mockResolvedValue({
        reply: "You mentioned your commute. What happened on the bus?",
        correction: null,
        summary: null,
        cost: { totalTokens: 80, estimatedUsd: 0.0001 },
        provider: "openai",
        pronunciationAbstention: null,
      })}
    />,
  );
}

async function send(text: string) {
  await act(async () => {
    fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });
    fireEvent.click(screen.getByRole("button", { name: /send answer/i }));
  });
}

describe("AiConversationScenarioPanel telemetry wiring", () => {
  it("renders VN-first retention encouragement returned by the telemetry seam", async () => {
    renderPanel();
    // Let beginTelemetrySession resolve so the turn has an active session.
    await act(async () => {
      await Promise.resolve();
    });
    await send("This morning my bus was late.");

    const block = await screen.findByTestId("ai-conversation-encouragement");
    // Vietnamese is the primary line; English is secondary.
    expect(block).toHaveTextContent("Bạn nói tốt lắm rồi");
    expect(block).toHaveTextContent("Nice work");
    expect(telemetryMocks.record).toHaveBeenCalledTimes(1);
  });

  it("ends the telemetry session (emits the D1/D7 return-signal) on unmount", async () => {
    const { unmount } = renderPanel();
    // Let beginTelemetrySession resolve so the cleanup has a session to end.
    await act(async () => {
      await Promise.resolve();
    });
    unmount();
    await waitFor(() => expect(telemetryMocks.end).toHaveBeenCalledWith(fakeSession));
  });

  it("ends the prior session and starts fresh when the learner clicks New session", async () => {
    renderPanel();
    await act(async () => {
      await Promise.resolve();
    });
    expect(telemetryMocks.begin).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /new session/i }));
    });

    await waitFor(() => expect(telemetryMocks.end).toHaveBeenCalledWith(fakeSession));
    // A fresh telemetry session is opened for the restarted conversation.
    await waitFor(() => expect(telemetryMocks.begin).toHaveBeenCalledTimes(2));
  });
});
