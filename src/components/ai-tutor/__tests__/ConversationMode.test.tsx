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
