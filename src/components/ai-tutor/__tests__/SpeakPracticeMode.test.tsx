import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SpeakPracticeMode, {
  type SpeakPronunciationResult,
} from "../SpeakPracticeMode";
import { getTutorCopy } from "@/lib/tutor/tutorCopy";

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
  }) => (
    supported ? (
      <button type="button" onClick={onToggle}>{active ? activeLabel : inactiveLabel}</button>
    ) : (
      <div role="status">{unavailableLabel}</div>
    )
  ),
}));

const baseProps = {
  targetSentence: "I bought a hat yesterday.",
  repeatInput: "I bought a hat yesterday.",
  micSupported: true,
  micListening: false,
  ttsSupported: true,
  ttsSpeaking: false,
  ttsPreparing: false,
  followUpPrompt: null,
  followUpIsPivot: false,
  onMicToggle: vi.fn(),
  onReadTarget: vi.fn(),
  onRepeatInputChange: vi.fn(),
  tutorCopy: getTutorCopy("en", "vi"),
};

function renderSpeak(
  pronunciationResult?: SpeakPronunciationResult | null,
  repeatInput = baseProps.repeatInput,
) {
  render(
    <SpeakPracticeMode
      {...baseProps}
      repeatInput={repeatInput}
      pronunciationResult={pronunciationResult}
    />,
  );
}

describe("SpeakPracticeMode pronunciation result display", () => {
  it("renders the target sentence and existing Speak controls", () => {
    renderSpeak(null, "");

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent(
      "I bought a hat yesterday.",
    );
    expect(screen.getByRole("button", { name: "Mercy đọc" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Nhập bằng giọng nói|Đọc câu thay vì gõ/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" })).toBeInTheDocument();
  });

  it("invokes the read-aloud handler from the Mercy đọc button", () => {
    const onReadTarget = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        repeatInput=""
        pronunciationResult={null}
        onReadTarget={onReadTarget}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mercy đọc" }));

    expect(onReadTarget).toHaveBeenCalledTimes(1);
  });

  it("shows a safe TTS fallback when device voice is unavailable", () => {
    render(
      <SpeakPracticeMode
        {...baseProps}
        repeatInput=""
        ttsSupported={false}
        pronunciationResult={null}
      />,
    );

    expect(screen.queryByRole("button", { name: "Mercy đọc" })).not.toBeInTheDocument();
    expect(screen.getByText(baseProps.tutorCopy.ui.ttsUnavailable)).toBeInTheDocument();
  });

  it("shows read-aloud progress and the safe TTS error message", () => {
    const onReadTarget = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        repeatInput=""
        pronunciationResult={null}
        ttsSpeaking
        ttsError="Nếu không nghe thấy, hãy kiểm tra âm lượng, tab Chrome có bị tắt tiếng không, hoặc thử Safari."
        onReadTarget={onReadTarget}
      />,
    );

    expect(screen.getByRole("button", { name: "Đang đọc…" })).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-tts-error")).toHaveTextContent(
      "Nếu không nghe thấy, hãy kiểm tra âm lượng, tab Chrome có bị tắt tiếng không, hoặc thử Safari.",
    );
    fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
    expect(onReadTarget).toHaveBeenCalledTimes(1);
  });

  it("keeps the text repeat fallback visible when the mic is unsupported", () => {
    render(
      <SpeakPracticeMode
        {...baseProps}
        repeatInput=""
        micSupported={false}
        pronunciationResult={null}
      />,
    );

    expect(screen.getByTestId("ai-tutor-speak-mic-fallback-message")).toHaveTextContent(
      "Không dùng được giọng nói",
    );
    expect(screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" })).toBeInTheDocument();
  });

  it("calls the repeat input change handler from the text fallback", () => {
    const onRepeatInputChange = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        repeatInput=""
        pronunciationResult={null}
        onRepeatInputChange={onRepeatInputChange}
      />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }), {
      target: { value: "I bought a hat yesterday." },
    });

    expect(onRepeatInputChange).toHaveBeenCalledWith("I bought a hat yesterday.");
  });

  it("shows Step 3 fallback wording only for local scoring", () => {
    renderSpeak({ mode: "local-fallback", provider: "local" });

    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Bạn nói giống câu mẫu khoảng 100%.");
    expect(score).toHaveTextContent(
      "Mercy đang nghe theo từ. Sẽ chấm phát âm chi tiết hơn sau.",
    );
    expect(score).not.toHaveTextContent(
      "Mercy đã chấm phát âm chi tiết hơn bằng từng âm.",
    );
    expect(screen.queryByTestId("ai-tutor-speak-word-detail")).not.toBeInTheDocument();
  });

  it("shows Step 7 wording and detail only for Azure batch phoneme evidence", () => {
    renderSpeak({
      mode: "azure-batch",
      provider: "azure",
      overallScore: 86.4,
      phonemeScores: [
        { phoneme: "b", accuracyScore: 96, word: "bought" },
        { phoneme: "ɔ", accuracyScore: 74.4, word: "bought" },
      ],
      words: [
        {
          word: "bought",
          accuracyScore: 82.2,
          phonemes: [
            { phoneme: "b", accuracyScore: 96 },
            { phoneme: "ɔ", accuracyScore: 74.4 },
          ],
        },
      ],
    });

    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent(
      "Mercy đã chấm phát âm chi tiết hơn bằng từng âm.",
    );
    expect(score).toHaveTextContent("Điểm tổng thể khoảng 86%.");
    expect(score).not.toHaveTextContent("Bạn nói giống câu mẫu khoảng");
    expect(score).not.toHaveTextContent("Mercy đang nghe theo từ");

    const detail = screen.getByTestId("ai-tutor-speak-word-detail");
    expect(within(detail).getByText("bought")).toBeInTheDocument();
    expect(detail).toHaveTextContent("82%");
    expect(detail).toHaveTextContent("/b/ 96%");
    expect(detail).toHaveTextContent("/ɔ/ 74%");
  });

  it("does not show phoneme detail when fallback result includes unsupported detail", () => {
    renderSpeak({
      mode: "local-fallback",
      provider: "local",
      overallScore: 91,
      words: [
        {
          word: "bought",
          phonemes: [{ phoneme: "b", accuracyScore: 96 }],
        },
      ],
    });

    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Bạn nói giống câu mẫu khoảng 100%.");
    expect(score).not.toHaveTextContent("bằng từng âm");
    expect(score).not.toHaveTextContent("/b/");
    expect(screen.queryByTestId("ai-tutor-speak-word-detail")).not.toBeInTheDocument();
  });

  it("degrades safely when Azure batch evidence has no phoneme detail", () => {
    renderSpeak({
      mode: "azure-batch",
      provider: "azure",
      overallScore: 78,
      words: [
        {
          word: "bought",
          accuracyScore: 76,
        },
      ],
    });

    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Mercy đã nhận kết quả luyện nói.");
    expect(score).toHaveTextContent("Điểm tổng thể khoảng 78%.");
    expect(score).not.toHaveTextContent("từng âm");
    expect(score).not.toHaveTextContent("chi tiết");
    const detail = screen.getByTestId("ai-tutor-speak-word-detail");
    expect(within(detail).getByText("bought")).toBeInTheDocument();
    expect(detail).toHaveTextContent("76%");
    expect(detail).not.toHaveTextContent("/");
  });
});
