// src/components/mercy-guide/__tests__/UnifiedMercyChat.test.tsx
//
// Component-level tests for the unified Mercy chat. We mock the
// Supabase session client so the component renders without auth and
// drive the UI through @testing-library/react. The reducer and intent
// classifier are real — these tests catch wiring regressions.

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

vi.mock("@/lib/mercy/sessionClient", () => ({
  loadSession: vi.fn(async () => null),
  setSessionType: vi.fn(async () => null),
  patchContext: vi.fn(async () => undefined),
  DEFAULT_SESSION_TYPE: "unified",
}));

import UnifiedMercyChat from "../UnifiedMercyChat";
import * as sessionClient from "@/lib/mercy/sessionClient";

beforeEach(() => {
  vi.clearAllMocks();
  // Most flow tests assume the AI disclosure modal is out of the way.
  // Seed localStorage so the modal is treated as previously accepted.
  // The disclosure-specific tests below clear/override this explicitly.
  window.localStorage.setItem("mercy_ai_disclosure_accepted", "1");
});

function type(text: string) {
  const input = screen.getByTestId("unified-mercy-input") as HTMLTextAreaElement;
  fireEvent.change(input, { target: { value: text } });
  return input;
}

function send() {
  fireEvent.click(screen.getByTestId("unified-mercy-send"));
}

describe("UnifiedMercyChat — first paint", () => {
  it("renders the empty-state greeting", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    expect(screen.getByTestId("unified-mercy-chat")).toBeInTheDocument();
    expect(screen.getByText(/Mercy ở đây/i)).toBeInTheDocument();
  });

  it("renders the input bar with mic + send", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    expect(screen.getByTestId("unified-mercy-input")).toBeInTheDocument();
    expect(screen.getByTestId("unified-mercy-mic")).toBeInTheDocument();
    expect(screen.getByTestId("unified-mercy-send")).toBeInTheDocument();
  });

  it("send is disabled while the draft is empty", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    expect(screen.getByTestId("unified-mercy-send")).toBeDisabled();
  });
});

describe("UnifiedMercyChat — message flow", () => {
  it("submitting a draft renders learner + Mercy bubbles", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Hi Mercy");
    send();
    expect(screen.getAllByTestId("unified-mercy-bubble-learner")).toHaveLength(
      1,
    );
    expect(screen.getAllByTestId("unified-mercy-bubble-mercy")).toHaveLength(1);
  });

  it("clears the draft after sending", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    const input = type("Hi Mercy") as HTMLTextAreaElement;
    send();
    expect(input.value).toBe("");
  });

  it("Enter (without shift) submits the draft", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    const input = type("How do I say rural?");
    fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
    expect(screen.getAllByTestId("unified-mercy-bubble-learner")).toHaveLength(
      1,
    );
  });

  it("Shift+Enter does NOT submit", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    const input = type("multi\nline");
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    expect(screen.queryByTestId("unified-mercy-bubble-learner")).not.toBeInTheDocument();
  });

  it("preserves history across multiple turns", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Hi");
    send();
    type("How are you");
    send();
    expect(screen.getAllByTestId("unified-mercy-bubble-learner")).toHaveLength(
      2,
    );
    expect(screen.getAllByTestId("unified-mercy-bubble-mercy")).toHaveLength(2);
  });
});

describe("UnifiedMercyChat — inline modes", () => {
  it("opens the pronunciation panel for 'how do I say X'", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("How do I say 'rural'?");
    send();
    expect(
      screen.getByTestId("unified-mercy-inline-pronunciation"),
    ).toBeInTheDocument();
  });

  it("opens the grammar panel for 'fix this sentence'", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Fix this sentence: I goes home");
    send();
    expect(
      screen.getByTestId("unified-mercy-inline-grammar"),
    ).toBeInTheDocument();
  });

  it("opens the lesson panel for 'next lesson'", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("What's the next lesson?");
    send();
    expect(
      screen.getByTestId("unified-mercy-inline-lesson"),
    ).toBeInTheDocument();
  });

  it("opens the encouragement bubble for 'I'm stuck'", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("I'm stuck on this exercise");
    send();
    expect(
      screen.getByTestId("unified-mercy-inline-encouragement"),
    ).toBeInTheDocument();
  });

  it("plain chat does NOT open any inline panel", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Hi Mercy, how are you");
    send();
    expect(
      screen.queryByTestId("unified-mercy-inline-pronunciation"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("unified-mercy-inline-grammar"),
    ).not.toBeInTheDocument();
  });

  it("dismiss button closes the inline panel", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("How do I say 'rural'?");
    send();
    fireEvent.click(screen.getByTestId("unified-mercy-inline-dismiss"));
    expect(
      screen.queryByTestId("unified-mercy-inline-pronunciation"),
    ).not.toBeInTheDocument();
  });
});

describe("UnifiedMercyChat — Vietnamese inputs", () => {
  it("VI pronunciation cue opens the pronunciation panel", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Phát âm 'thirsty' sao em?");
    send();
    expect(
      screen.getByTestId("unified-mercy-inline-pronunciation"),
    ).toBeInTheDocument();
  });

  it("VI grammar cue opens the grammar panel", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Câu 'I am tired' đúng chưa em?");
    send();
    expect(
      screen.getByTestId("unified-mercy-inline-grammar"),
    ).toBeInTheDocument();
  });

  it("Mercy reply uses Vietnamese when learner writes Vietnamese", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Khó quá em ơi");
    send();
    const mercyBubble = screen.getByTestId("unified-mercy-bubble-mercy");
    expect(mercyBubble.textContent ?? "").toMatch(/Mercy/);
    expect(mercyBubble.textContent ?? "").not.toMatch(/^Mercy here/);
  });
});

describe("UnifiedMercyChat — settings + classic toggle", () => {
  it("settings button toggles the settings pane", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    fireEvent.click(screen.getByTestId("unified-mercy-settings"));
    expect(
      screen.getByTestId("unified-mercy-settings-panel"),
    ).toBeInTheDocument();
  });

  it("classic toggle calls setSessionType('classic') and onRequestClassic", async () => {
    const onRequestClassic = vi.fn();
    render(
      <UnifiedMercyChat
        initialSessionType="unified"
        onRequestClassic={onRequestClassic}
      />,
    );
    fireEvent.click(screen.getByTestId("unified-mercy-settings"));
    fireEvent.click(screen.getByTestId("unified-mercy-classic-toggle"));

    // Wait one microtask for the async handler.
    await Promise.resolve();
    await Promise.resolve();

    expect(sessionClient.setSessionType).toHaveBeenCalledWith("classic");
    expect(onRequestClassic).toHaveBeenCalled();
  });

  it("reset button clears the message stream", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Hi");
    send();
    expect(
      screen.getAllByTestId("unified-mercy-bubble-learner"),
    ).toHaveLength(1);
    fireEvent.click(screen.getByTestId("unified-mercy-reset"));
    expect(
      screen.queryByTestId("unified-mercy-bubble-learner"),
    ).not.toBeInTheDocument();
  });
});

describe("UnifiedMercyChat — context persistence", () => {
  it("calls patchContext after a learner turn", () => {
    render(<UnifiedMercyChat initialSessionType="unified" />);
    type("Teach me past perfect");
    send();
    expect(sessionClient.patchContext).toHaveBeenCalledWith(
      expect.objectContaining({
        lastIntent: "lesson_request",
        lastSentence: "Teach me past perfect",
      }),
    );
  });
});

describe("UnifiedMercyChat — snapshot", () => {
  it("first paint snapshot", () => {
    const { container } = render(
      <UnifiedMercyChat initialSessionType="unified" />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("learner-message snapshot", () => {
    const { container } = render(
      <UnifiedMercyChat initialSessionType="unified" />,
    );
    type("Teach me past perfect");
    send();
    const stream = within(screen.getByTestId("unified-mercy-stream"));
    expect(stream.getAllByTestId("unified-mercy-bubble-learner")[0]).toMatchSnapshot();
  });
});

describe("UnifiedMercyChat — AI disclosure (Apple 5.1.1)", () => {
  it("renders the disclosure modal on first visit (no localStorage flag)", () => {
    window.localStorage.removeItem("mercy_ai_disclosure_accepted");
    render(<UnifiedMercyChat initialSessionType="unified" />);
    expect(screen.getByTestId("mercy-ai-disclosure")).toBeInTheDocument();
    expect(screen.getByText(/Giáo viên Mercy dùng AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Teacher Mercy uses AI/i)).toBeInTheDocument();
  });

  it("blocks send until the user accepts the disclosure", () => {
    window.localStorage.removeItem("mercy_ai_disclosure_accepted");
    render(<UnifiedMercyChat initialSessionType="unified" />);
    // Type a message, then click send — nothing should happen because
    // the send button is disabled by the disclosure gate.
    type("Hi Mercy");
    expect(screen.getByTestId("unified-mercy-send")).toBeDisabled();
    // No bubbles rendered yet.
    expect(screen.queryByTestId("unified-mercy-bubble-learner")).toBeNull();
  });

  it("accepting the disclosure unlocks send and persists to localStorage", () => {
    window.localStorage.removeItem("mercy_ai_disclosure_accepted");
    render(<UnifiedMercyChat initialSessionType="unified" />);
    fireEvent.click(screen.getByTestId("mercy-ai-disclosure-accept"));
    expect(screen.queryByTestId("mercy-ai-disclosure")).toBeNull();
    expect(window.localStorage.getItem("mercy_ai_disclosure_accepted")).toBe("1");
    // Now the send flow works.
    type("Hi Mercy");
    send();
    expect(screen.getAllByTestId("unified-mercy-bubble-learner")).toHaveLength(1);
  });

  it("does not show the modal when localStorage flag is already set", () => {
    window.localStorage.setItem("mercy_ai_disclosure_accepted", "1");
    render(<UnifiedMercyChat initialSessionType="unified" />);
    expect(screen.queryByTestId("mercy-ai-disclosure")).toBeNull();
  });
});
