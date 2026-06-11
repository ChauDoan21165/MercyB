import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ConversationMode, {
  type ConversationMessage,
} from "../ConversationMode";
import type { ConversationPronunciationResult } from "@/lib/pronunciation/conversationPronunciation";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";

// Presentational mic control; mirror the SpeakPracticeMode test stub so we test only this file.
vi.mock("@/components/teacher-mercy/TeacherMercyVoiceControls", () => ({
  default: ({
    active,
    activeLabel,
    inactiveLabel,
    unavailableLabel,
    supported,
    onToggle,
  }: {
    active?: boolean;
    activeLabel: string;
    inactiveLabel: string;
    unavailableLabel: string;
    supported: boolean;
    onToggle: () => void;
  }) =>
    supported ? (
      <button type="button" onClick={onToggle}>
        {active ? activeLabel : inactiveLabel}
      </button>
    ) : (
      <div role="status">{unavailableLabel}</div>
    ),
}));

const tutorCopy = getTutorCopy("en", "vi");

function baseProps(overrides: Partial<React.ComponentProps<typeof ConversationMode>> = {}) {
  return {
    mode: "speak" as const,
    messages: [] as ConversationMessage[],
    input: "",
    setInput: vi.fn(),
    loading: false,
    micSupported: true,
    micListening: false,
    ttsSupported: true,
    ttsSpeaking: false,
    ttsPreparing: false,
    speakingMessageId: null,
    onSend: vi.fn(),
    onMicToggle: vi.fn(),
    onSpeak: vi.fn(),
    tutorCopy,
    ...overrides,
  };
}

function pronResult(over: Partial<ConversationPronunciationResult> = {}): ConversationPronunciationResult {
  return {
    provider: "azure",
    mode: "english-pronunciation-conversation",
    overallScore: 88,
    words: [],
    quality: "ok",
    confidence: "ok",
    shouldAskRetry: false,
    costCap: null,
    ...over,
  };
}

describe("ConversationMode — C6 no-canned-reply floor", () => {
  it("empty panel shows hint placeholder, not a Mercy speech bubble (C6)", () => {
    render(<ConversationMode {...baseProps()} />);

    expect(screen.getByTestId("ai-tutor-conversation")).toBeInTheDocument();
    // The empty-state copy renders as a grey hint div — not a Mercy reply bubble.
    expect(screen.getByText(tutorCopy.ui.conversationEmpty)).toBeInTheDocument();
    // CRITICAL: no "Teacher Mercy" speaker label appears (that label only lives
    // inside Mercy reply bubbles); presence would mean a canned opener shipped.
    expect(screen.queryByText(tutorCopy.speakerLabels.tutor)).not.toBeInTheDocument();
  });

  it("abstention redirect renders as a status affordance, not a canned Mercy turn (C6)", () => {
    render(
      <ConversationMode
        {...baseProps({ entitlement: { isPremium: true } })}
        abstentionRedirect={{
          redirectPrompt:
            "Mercy chưa chắc chắn về câu này. Thử câu tiếng Anh đơn giản hơn nhé.",
        }}
      />,
    );

    const redirect = screen.getByTestId("ai-tutor-conversation-abstention-redirect");
    expect(redirect).toBeInTheDocument();
    expect(redirect).toHaveTextContent("Mercy chưa chắc chắn");
    // It carries role="status" (screen-reader affordance), NOT a Mercy reply article.
    expect(redirect).toHaveAttribute("role", "status");
    // No Mercy speech bubble — the speaker label "Teacher Mercy" must be absent.
    expect(screen.queryByText(tutorCopy.speakerLabels.tutor)).not.toBeInTheDocument();
  });
});

describe("ConversationMode — premium gate (Steps 8-10 conversation engine)", () => {
  it("shows a Vietnamese-primary premium gate for a non-premium learner and hides the conversation", () => {
    render(<ConversationMode {...baseProps({ entitlement: { isPremium: false } })} />);
    expect(screen.getByTestId("ai-tutor-conversation-premium-gate")).toBeInTheDocument();
    // Vietnamese-primary copy comes first.
    expect(screen.getByText(/Trò chuyện cùng Mercy là tính năng Premium/)).toBeInTheDocument();
    // The actual chat surface must not render behind the gate.
    expect(screen.queryByTestId("ai-tutor-conversation")).not.toBeInTheDocument();
  });

  it("renders the conversation for a premium learner", () => {
    render(<ConversationMode {...baseProps({ entitlement: { isPremium: true } })} />);
    expect(screen.getByTestId("ai-tutor-conversation")).toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-conversation-premium-gate")).not.toBeInTheDocument();
  });

  it("does not gate legacy callers that pass no entitlement prop", () => {
    render(<ConversationMode {...baseProps()} />);
    expect(screen.getByTestId("ai-tutor-conversation")).toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-conversation-premium-gate")).not.toBeInTheDocument();
  });

  it("fires onUpgrade from the gate without referencing any price_id", () => {
    const onUpgrade = vi.fn();
    const { container } = render(
      <ConversationMode {...baseProps({ entitlement: { isPremium: false }, onUpgrade })} />,
    );
    fireEvent.click(screen.getByTestId("ai-tutor-conversation-upgrade"));
    expect(onUpgrade).toHaveBeenCalledTimes(1);
    expect(container.innerHTML).not.toMatch(/price_id/i);
  });
});

describe("ConversationMode — 50-turn/session cap", () => {
  it("shows remaining turns below the cap", () => {
    render(
      <ConversationMode
        {...baseProps({ entitlement: { isPremium: true }, turnUsage: { used: 10, limit: 50 } })}
      />,
    );
    const cap = screen.getByTestId("ai-tutor-conversation-turn-cap");
    expect(cap).toHaveTextContent("40/50");
  });

  it("disables send and shows a cap-reached message at the limit, without dead-ending the screen", () => {
    render(
      <ConversationMode
        {...baseProps({
          entitlement: { isPremium: true },
          turnUsage: { used: 50, limit: 50 },
          input: "I want to keep going",
        })}
      />,
    );
    expect(screen.getByTestId("ai-tutor-conversation-turn-cap")).toHaveTextContent(/hết 50 lượt/);
    const send = screen.getByRole("button", { name: tutorCopy.ui.speakSend });
    expect(send).toBeDisabled();
    // The conversation surface itself remains rendered (not a dead-end).
    expect(screen.getByTestId("ai-tutor-conversation")).toBeInTheDocument();
  });
});

describe("ConversationMode — pronunciation honesty (trust floor)", () => {
  const userMessage: ConversationMessage = { id: "u1", role: "user", text: "I go to school" };

  it("renders a real percent only when a measured score exists", () => {
    render(
      <ConversationMode
        {...baseProps({
          entitlement: { isPremium: true },
          messages: [userMessage],
          pronunciationByMessageId: { u1: pronResult({ overallScore: 88 }) },
        })}
      />,
    );
    expect(screen.getByTestId("ai-tutor-conversation-pron-score")).toHaveTextContent("88%");
    expect(screen.queryByTestId("ai-tutor-conversation-pron-retry")).not.toBeInTheDocument();
  });

  it("never fabricates a percent on a null score / no-audio turn", () => {
    render(
      <ConversationMode
        {...baseProps({
          entitlement: { isPremium: true },
          messages: [userMessage],
          pronunciationByMessageId: {
            u1: pronResult({ overallScore: null, quality: "no_audio", shouldAskRetry: true }),
          },
        })}
      />,
    );
    expect(screen.getByTestId("ai-tutor-conversation-pron-retry")).toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-conversation-pron-score")).not.toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it("treats low_confidence as no-score (asks for a retry, shows no number)", () => {
    render(
      <ConversationMode
        {...baseProps({
          entitlement: { isPremium: true },
          messages: [userMessage],
          pronunciationByMessageId: {
            u1: pronResult({ overallScore: 42, quality: "low_confidence", confidence: "low" }),
          },
        })}
      />,
    );
    expect(screen.getByTestId("ai-tutor-conversation-pron-retry")).toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-conversation-pron-score")).not.toBeInTheDocument();
  });

  it("renders no pronunciation surface for text-only turns (no result supplied)", () => {
    render(
      <ConversationMode
        {...baseProps({ entitlement: { isPremium: true }, messages: [userMessage] })}
      />,
    );
    expect(screen.queryByTestId("ai-tutor-conversation-pron-score")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-conversation-pron-retry")).not.toBeInTheDocument();
  });
});

describe("ConversationMode — abstention redirect (never dead-end)", () => {
  it("renders the engine redirect prompt and keeps the input usable", () => {
    render(
      <ConversationMode
        {...baseProps({
          entitlement: { isPremium: true },
          input: "ok",
          abstentionRedirect: { redirectPrompt: "Mình chưa chắc câu này. Thử kể về ngày của bạn nhé!" },
        })}
      />,
    );
    expect(screen.getByTestId("ai-tutor-conversation-abstention-redirect")).toHaveTextContent(
      "Thử kể về ngày của bạn",
    );
    // Redirect must not block the learner from continuing.
    expect(screen.getByRole("button", { name: tutorCopy.ui.speakSend })).not.toBeDisabled();
  });
});

describe("ConversationMode — recording clear/reset (product bug 4)", () => {
  it("renders the Vietnamese-primary 'Làm lại' control when a clear handler + recording exist", () => {
    render(
      <ConversationMode
        {...baseProps({ entitlement: { isPremium: true }, onClearRecording: vi.fn(), hasRecording: true })}
      />,
    );
    const reset = screen.getByTestId("ai-tutor-conversation-reset-recording");
    expect(reset).toBeInTheDocument();
    expect(reset).toHaveTextContent("Làm lại"); // VN primary
    expect(reset.getAttribute("aria-label")).toMatch(/Start over/); // EN secondary
    expect(reset).not.toBeDisabled();
  });

  it("clears the audio buffer (parent handler) and the textarea without submitting", () => {
    const onClearRecording = vi.fn();
    const setInput = vi.fn();
    const onSend = vi.fn();
    render(
      <ConversationMode
        {...baseProps({
          entitlement: { isPremium: true },
          input: "half a sentence",
          hasRecording: true,
          onClearRecording,
          setInput,
          onSend,
        })}
      />,
    );
    fireEvent.click(screen.getByTestId("ai-tutor-conversation-reset-recording"));
    expect(onClearRecording).toHaveBeenCalledTimes(1); // parent discards stale audio
    expect(setInput).toHaveBeenCalledWith(""); // textarea reset
    expect(onSend).not.toHaveBeenCalled(); // never submits stale audio
  });

  it("enables reset while mic is live so a recording can be discarded mid-capture", () => {
    render(
      <ConversationMode
        {...baseProps({
          entitlement: { isPremium: true },
          micListening: true,
          input: "",
          hasRecording: false,
          onClearRecording: vi.fn(),
        })}
      />,
    );
    expect(screen.getByTestId("ai-tutor-conversation-reset-recording")).not.toBeDisabled();
  });

  it("disables reset when there is nothing to discard (no audio, no input, mic idle)", () => {
    render(
      <ConversationMode
        {...baseProps({
          entitlement: { isPremium: true },
          micListening: false,
          input: "",
          hasRecording: false,
          onClearRecording: vi.fn(),
        })}
      />,
    );
    expect(screen.getByTestId("ai-tutor-conversation-reset-recording")).toBeDisabled();
  });

  it("does not render the reset control for legacy callers (no clear handler)", () => {
    render(<ConversationMode {...baseProps({ entitlement: { isPremium: true }, input: "hi" })} />);
    expect(screen.queryByTestId("ai-tutor-conversation-reset-recording")).not.toBeInTheDocument();
  });

  it("does not render the reset control in logic mode (no speech recording there)", () => {
    render(
      <ConversationMode
        {...baseProps({ mode: "logic", input: "x", hasRecording: true, onClearRecording: vi.fn() })}
      />,
    );
    expect(screen.queryByTestId("ai-tutor-conversation-reset-recording")).not.toBeInTheDocument();
  });
});
