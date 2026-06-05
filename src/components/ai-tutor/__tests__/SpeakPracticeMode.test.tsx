import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SpeakPracticeMode, {
  type SpeakPronunciationResult,
} from "../SpeakPracticeMode";
import type { EnglishPronunciationFeedbackDisplay } from "@/lib/pronunciation/englishPronunciationFeedback";
import type { VietnameseToneFeedbackDisplay } from "@/lib/pronunciation/vietnameseToneFeedback";
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
  followUpTtsSpeaking: false,
  followUpTtsPreparing: false,
  onMicToggle: vi.fn(),
  onReadTarget: vi.fn(),
  onReadFollowUp: vi.fn(),
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
      englishPronunciationFeedbackEnabled={false}
      englishPronunciationFeedback={null}
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

  it("renders read-aloud controls for the next follow-up question", () => {
    const onReadTarget = vi.fn();
    const onReadFollowUp = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt="Where did you buy it?"
        onReadTarget={onReadTarget}
        onReadFollowUp={onReadFollowUp}
      />,
    );

    expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    const followUp = within(screen.getByTestId("ai-tutor-speak-follow-up"));
    fireEvent.click(followUp.getByRole("button", { name: "Mercy đọc" }));

    expect(onReadFollowUp).toHaveBeenCalledTimes(1);
    expect(onReadTarget).not.toHaveBeenCalled();
  });

  it("does not render follow-up read-aloud controls for Vietnamese helper text", () => {
    const onReadFollowUp = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt="Bạn muốn luyện thêm câu khác không?"
        followUpIsPivot
        onReadFollowUp={onReadFollowUp}
      />,
    );

    const followUp = within(screen.getByTestId("ai-tutor-speak-follow-up"));
    expect(followUp.getByText("Bạn muốn luyện thêm câu khác không?")).toBeInTheDocument();
    expect(followUp.queryByRole("button", { name: "Mercy đọc" })).not.toBeInTheDocument();
    expect(onReadFollowUp).not.toHaveBeenCalled();
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

  it("shows only the honest no-number line for local (non-Azure) scoring", () => {
    renderSpeak({ mode: "local-fallback", provider: "local" });

    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Đang nghe, chấm điểm chi tiết sẽ có sau.");
    // No fake percent, no text-match confidence presented as an audio score.
    expect(score).not.toHaveTextContent("Bạn nói giống câu mẫu");
    expect(score.textContent ?? "").not.toMatch(/\d+%/);
    expect(score).not.toHaveTextContent(
      "Mercy đã chấm phát âm chi tiết hơn bằng từng âm.",
    );
    expect(screen.queryByTestId("ai-tutor-speak-word-detail")).not.toBeInTheDocument();
  });

  it("does not show any percent for typed text with no audio-gated result", () => {
    // Learner typed the target verbatim — a 100% text overlap — but with no
    // Azure result the surface must never present a number.
    renderSpeak(null, "I bought a hat yesterday.");

    expect(screen.queryByTestId("ai-tutor-speak-score")).not.toBeInTheDocument();
    expect(screen.queryByText(/Bạn nói giống câu mẫu/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
  });

  it("does not surface a score card from stale/typed repeatInput alone", () => {
    // Stale transcript text in the box, but no scorer result has landed.
    renderSpeak(undefined, "I buy a hat");

    expect(screen.queryByTestId("ai-tutor-speak-score")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-speak-listening-note")).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
  });

  it("renders the parent-supplied 'another sentence' offer as a pivot round", () => {
    // The deterministic second-round offer is owned by the parent (AiTutor);
    // the component must render it as a pivot ("Đổi câu luyện") offer.
    render(
      <SpeakPracticeMode
        {...baseProps}
        repeatInput="I bought a hat yesterday."
        followUpPrompt="Bạn muốn luyện thêm một câu nữa không?"
        followUpIsPivot
        pronunciationResult={{ mode: "local-fallback", provider: "local" }}
      />,
    );

    const followUp = screen.getByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("Bạn muốn luyện thêm một câu nữa không?");
    expect(followUp).toHaveTextContent("Đổi câu luyện");
  });

  it("does not render a follow-up section when the parent supplies none", () => {
    renderSpeak(null, "");

    expect(screen.queryByTestId("ai-tutor-speak-follow-up")).not.toBeInTheDocument();
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
    expect(score).toHaveTextContent("Đang nghe, chấm điểm chi tiết sẽ có sau.");
    expect(score.textContent ?? "").not.toMatch(/\d+%/);
    expect(score).not.toHaveTextContent("bằng từng âm");
    expect(score).not.toHaveTextContent("/b/");
    expect(screen.queryByTestId("ai-tutor-speak-word-detail")).not.toBeInTheDocument();
  });

  it("renders tone contour match wording", () => {
    renderSpeak({
      mode: "local-fallback",
      provider: "local",
      toneContour: {
        bucket: "match",
        score: 88,
        confidence: 0.78,
        expectedContour: "rising",
      },
    });

    const tone = screen.getByTestId("ai-tutor-speak-tone-contour");
    expect(tone).toHaveTextContent(
      "Đường cao độ có vẻ đúng: giọng đi lên như câu mẫu.",
    );
    expect(tone).toHaveTextContent(
      "Mercy chỉ đang xem đường giọng, không thay thế nhận xét âm riêng lẻ.",
    );
    expect(tone).not.toHaveTextContent(/pronunciation score|chấm phát âm|từng âm/i);
  });

  it("renders tone contour mismatch wording", () => {
    renderSpeak({
      mode: "local-fallback",
      provider: "local",
      toneContour: {
        bucket: "mismatch",
        score: 28,
        confidence: 0.81,
        expectedContour: "falling",
      },
    });

    const tone = screen.getByTestId("ai-tutor-speak-tone-contour");
    expect(tone).toHaveTextContent(
      "Đường cao độ có vẻ chưa khớp: câu này nên đi xuống.",
    );
    expect(tone).toHaveTextContent(
      "Mercy chỉ đang xem đường giọng, không thay thế nhận xét âm riêng lẻ.",
    );
    expect(tone).not.toHaveTextContent(/pronunciation score|chấm phát âm|từng âm/i);
  });

  it("renders no tone contour feedback when no tone contour evidence exists", () => {
    renderSpeak({ mode: "local-fallback", provider: "local" });

    expect(screen.queryByTestId("ai-tutor-speak-tone-contour")).not.toBeInTheDocument();
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

  it("renders English pronunciation feedback when enabled", () => {
    const englishFeedback: EnglishPronunciationFeedbackDisplay = {
      items: [
        {
          category: "theta_sound",
          status: "try_again",
          score: 58,
          targetWord: "think",
          titleEn: "TH sound",
          titleVi: "/th/ âm tiếng Anh",
          guidanceEn: "Put your tongue lightly between your teeth for TH.",
          guidanceVi: "Đặt đầu lưỡi nhẹ giữa hai hàm răng cho âm TH.",
        },
      ],
    };

    render(
      <SpeakPracticeMode
        {...baseProps}
        pronunciationResult={null}
        englishPronunciationFeedbackEnabled
        englishPronunciationFeedback={englishFeedback}
      />,
    );

    const card = screen.getByTestId("english-pronunciation-feedback");
    expect(card).toHaveTextContent("This sound is a good next practice");
    expect(card).toHaveTextContent("/th/ âm tiếng Anh");
  });

  it("renders Vietnamese tone feedback when enabled", () => {
    const toneFeedback: VietnameseToneFeedbackDisplay = {
      tone: "sac",
      toneLabelVi: "sắc",
      directionLabelVi: "đi lên",
      status: "correct",
      score: 92,
      practicePromptVi: "Tốt rồi. Lặp lại một lần nữa để giữ cảm giác đường giọng.",
      practicePromptEn: "Good. Repeat once more to keep the tone shape steady.",
    };

    render(
      <SpeakPracticeMode
        {...baseProps}
        vietnameseToneFeedbackEnabled
        vietnameseToneFeedback={toneFeedback}
        pronunciationResult={null}
      />,
    );

    const tone = screen.getByTestId("vietnamese-tone-feedback");
    expect(tone).toHaveTextContent("Thanh sắc đúng rồi.");
    expect(tone).toHaveTextContent("Điểm thanh điệu khoảng 92%.");
  });
});
