import { fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
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

// Drive the shared SelfCompareRecorder's hook deterministically. Default is
// idle (only a record button renders) so the existing Speak tests are
// unaffected; individual tests override `recorderMock.current` to exercise the
// by-ear compare flow.
const recorderMock = vi.hoisted(() => ({
  current: null as unknown as Record<string, unknown>,
}));
const compareWithReference = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/usePronunciationRecorder", () => ({
  usePronunciationRecorder: () => recorderMock.current,
}));
const IDLE_RECORDER = {
  status: "idle",
  error: null,
  audioBlob: null,
  lastRecordedAudioUrl: null,
  isPlayingReference: false,
  isPlayingRecorded: false,
  isComparing: false,
  setError: () => {},
  startRecording: vi.fn(),
  stopRecording: vi.fn(),
  reset: () => {},
  clearRecordedAudio: vi.fn(),
  playReference: async () => {},
  playRecorded: vi.fn(),
  compareWithReference,
};

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
  onResetBoard: vi.fn(),
  tutorCopy: getTutorCopy("en", "vi"),
};

function followUpPrompt(en: string, vi = "Trả lời bằng tiếng Anh:") {
  return { vi, en };
}

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

beforeEach(() => {
  vi.clearAllMocks();
  recorderMock.current = { ...IDLE_RECORDER };
});

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
        followUpPrompt={followUpPrompt("Where did you buy it?")}
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

  it("does not render a TTS read-aloud button on the pivot close-out (navigation only)", () => {
    const onReadFollowUp = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt("Do you want to practice another sentence?", "Bạn muốn luyện câu khác không?")}
        followUpIsPivot
        followUpIsCloseOut
        onReadFollowUp={onReadFollowUp}
        onCheckInLogicTab={vi.fn()}
        onStartFreshSentence={vi.fn()}
      />,
    );

    const followUp = within(screen.getByTestId("ai-tutor-speak-follow-up"));
    expect(followUp.queryByRole("button", { name: "Mercy đọc" })).not.toBeInTheDocument();
    expect(onReadFollowUp).not.toHaveBeenCalled();
    // Close-out block present instead.
    expect(screen.getByTestId("ai-tutor-speak-close-out")).toBeInTheDocument();
  });

  it("renders read-aloud controls for the bilingual ask-repeat clarification", () => {
    const onReadFollowUp = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt(
          "I didn't catch that clearly. Can you say it again?",
          "Mercy chưa nghe rõ. Bạn nói lại câu đó nhé.",
        )}
        onReadFollowUp={onReadFollowUp}
      />,
    );

    const followUp = within(screen.getByTestId("ai-tutor-speak-follow-up"));
    fireEvent.click(followUp.getByRole("button", { name: "Mercy đọc" }));

    expect(onReadFollowUp).toHaveBeenCalledTimes(1);
  });

  it("offers an answer-by-voice mic on the follow-up and routes it through onMicToggle", () => {
    const onMicToggle = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt("Where did you buy it?")}
        onMicToggle={onMicToggle}
      />,
    );

    const followUp = within(screen.getByTestId("ai-tutor-speak-follow-up"));
    expect(screen.getByTestId("ai-tutor-speak-follow-up-answer")).toBeInTheDocument();
    // Distinct from the model-sentence mic so the learner can answer the
    // QUESTION by voice — the same toggle that advances the loop.
    fireEvent.click(followUp.getByRole("button", { name: "Trả lời bằng giọng nói" }));
    expect(onMicToggle).toHaveBeenCalledTimes(1);
  });

  it("shows a clear mic fallback on the follow-up when speech input is unsupported", () => {
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt("Where did you buy it?")}
        micSupported={false}
      />,
    );

    const followUp = within(screen.getByTestId("ai-tutor-speak-follow-up"));
    expect(followUp.getByTestId("ai-tutor-speak-follow-up-mic-fallback-message")).toHaveTextContent(
      "Không dùng được",
    );
    // Never a dead end — the typed-answer path is pointed to explicitly.
    expect(followUp.getByText(/gõ câu trả lời/i)).toBeInTheDocument();
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

  it("shows a scoped safe TTS error for the next follow-up question", () => {
    const onReadFollowUp = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt(
          "I didn't catch that clearly. Can you say it again?",
          "Mercy chưa nghe rõ. Bạn nói lại câu đó nhé.",
        )}
        ttsErrorScope="follow-up"
        ttsError="Không nghe thấy? Kiểm tra âm lượng hoặc thử bấm lại."
        onReadFollowUp={onReadFollowUp}
      />,
    );

    const followUp = within(screen.getByTestId("ai-tutor-speak-follow-up"));
    expect(followUp.getByTestId("ai-tutor-speak-follow-up-tts-error")).toHaveTextContent(
      "Không nghe thấy? Kiểm tra âm lượng hoặc thử bấm lại.",
    );
    fireEvent.click(followUp.getByRole("button", { name: "Thử lại" }));
    expect(onReadFollowUp).toHaveBeenCalledTimes(1);
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

  it("shows the warm cap message (and keeps by-ear compare) when the detailed-scoring cap is reached", () => {
    render(
      <SpeakPracticeMode
        {...baseProps}
        pronunciationResult={null}
        detailScoreCapReached
      />,
    );

    const cap = screen.getByTestId("ai-tutor-speak-detail-cap");
    expect(cap).toHaveTextContent("Bạn đã dùng hết lượt chấm chi tiết hôm nay");
    expect(cap).toHaveTextContent("nghe lại giọng của mình");
    // No fake number, and the score card is not shown alongside the cap notice.
    expect(cap.textContent ?? "").not.toMatch(/\d+%/);
    expect(screen.queryByTestId("ai-tutor-speak-score")).not.toBeInTheDocument();
    // The free by-ear self-compare loop stays available.
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
  });

  it("does not show the cap message by default", () => {
    renderSpeak(null, "");
    expect(screen.queryByTestId("ai-tutor-speak-detail-cap")).not.toBeInTheDocument();
  });

  it("renders the depth-cap close-out block (not the pivot text) when followUpIsCloseOut is true", () => {
    // followUpIsCloseOut replaces the question + mic block with two navigation buttons.
    render(
      <SpeakPracticeMode
        {...baseProps}
        repeatInput="I bought a hat yesterday."
        followUpPrompt={followUpPrompt("Do you want to practice another sentence?", "Bạn muốn luyện câu khác không?")}
        followUpIsPivot
        followUpIsCloseOut
        pronunciationResult={{ mode: "local-fallback", provider: "local" }}
        onCheckInLogicTab={vi.fn()}
        onStartFreshSentence={vi.fn()}
      />,
    );

    const followUp = screen.getByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("Đổi câu luyện");
    expect(screen.getByTestId("ai-tutor-speak-close-out")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-close-logic")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-close-fresh")).toBeInTheDocument();
  });

  it("shows two tappable close-out buttons when followUpIsCloseOut is true", () => {
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt("Do you want to practice another sentence?", "Bạn muốn luyện câu khác không?")}
        followUpIsPivot
        followUpIsCloseOut
        pronunciationResult={{ mode: "local-fallback", provider: "local" }}
        onCheckInLogicTab={vi.fn()}
        onStartFreshSentence={vi.fn()}
      />,
    );

    expect(screen.getByTestId("ai-tutor-speak-close-out")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-close-logic")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-close-fresh")).toBeInTheDocument();
    // Pivot close-out is a navigation affordance, not a Mercy reply — no mic.
    expect(screen.queryByTestId("ai-tutor-speak-follow-up-answer")).not.toBeInTheDocument();
  });

  it("fires onCheckInLogicTab when the Logic tab button is clicked", () => {
    const onCheckInLogicTab = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt("Do you want to practice another sentence?", "Bạn muốn luyện câu khác không?")}
        followUpIsPivot
        followUpIsCloseOut
        onCheckInLogicTab={onCheckInLogicTab}
        onStartFreshSentence={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("ai-tutor-speak-close-logic"));
    expect(onCheckInLogicTab).toHaveBeenCalledTimes(1);
  });

  it("fires onStartFreshSentence when the fresh sentence button is clicked", () => {
    const onStartFreshSentence = vi.fn();
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt("Do you want to practice another sentence?", "Bạn muốn luyện câu khác không?")}
        followUpIsPivot
        followUpIsCloseOut
        onCheckInLogicTab={vi.fn()}
        onStartFreshSentence={onStartFreshSentence}
      />,
    );

    fireEvent.click(screen.getByTestId("ai-tutor-speak-close-fresh"));
    expect(onStartFreshSentence).toHaveBeenCalledTimes(1);
  });

  it("close-out copy contains no canned praise (C6: affordance, not a reply)", () => {
    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt("Do you want to practice another sentence?", "Bạn muốn luyện câu khác không?")}
        followUpIsPivot
        followUpIsCloseOut
        onCheckInLogicTab={vi.fn()}
        onStartFreshSentence={vi.fn()}
      />,
    );

    const closeOut = screen.getByTestId("ai-tutor-speak-close-out");
    const text = closeOut.textContent ?? "";
    expect(text).not.toMatch(/great|well done|excellent|amazing|fantastic|perfect|bravo/i);
    // VI + EN affordance copy — navigation labels, not feedback.
    expect(closeOut).toHaveTextContent("Bắt đầu câu mới");
    expect(closeOut).toHaveTextContent("Kiểm tra câu trong tab Logic");
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
    // Qualitative cue only — no fabricated tone-score percent until the contour
    // scorer is native-validated (lane-c-vn-tone-validation-pending).
    expect(tone).not.toHaveTextContent("Điểm thanh điệu khoảng");
    expect(tone.textContent).not.toMatch(/\d+%/);
  });
});

describe("SpeakPracticeMode — by-ear self-compare panel (no score)", () => {
  it("renders the self-compare recorder with a labelled record control", () => {
    renderSpeak(null, "");
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Thu âm giọng của bạn/i }),
    ).toBeInTheDocument();
  });

  it("lets the learner compare by ear against the model sentence", () => {
    // A recording exists → play-back + compare-by-ear controls appear.
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };
    renderSpeak(null, "");
    expect(screen.getByTestId("self-compare-play")).toBeInTheDocument();
    const byEar = screen.getByTestId("self-compare-by-ear");
    fireEvent.click(byEar);
    // Compares against the model sentence the learner just heard.
    expect(compareWithReference).toHaveBeenCalledWith("I bought a hat yesterday.");
  });

  it("does not advance or mutate the Speak follow-up when compare-by-ear is clicked", () => {
    const onMicToggle = vi.fn();
    const onRepeatInputChange = vi.fn();
    const onReadFollowUp = vi.fn();
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };

    render(
      <SpeakPracticeMode
        {...baseProps}
        followUpPrompt={followUpPrompt("Where did you buy it?")}
        pronunciationResult={null}
        onMicToggle={onMicToggle}
        onRepeatInputChange={onRepeatInputChange}
        onReadFollowUp={onReadFollowUp}
      />,
    );

    fireEvent.click(screen.getByTestId("self-compare-by-ear"));

    expect(compareWithReference).toHaveBeenCalledWith("I bought a hat yesterday.");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(onMicToggle).not.toHaveBeenCalled();
    expect(onRepeatInputChange).not.toHaveBeenCalled();
    expect(onReadFollowUp).not.toHaveBeenCalled();
  });

  it("surfaces a mic-denied message without breaking the rest of Speak", () => {
    recorderMock.current = {
      ...IDLE_RECORDER,
      error: "Microphone access was denied in your browser.",
    };
    renderSpeak(null, "");
    const panel = screen.getByTestId("self-compare-recorder");
    expect(panel.textContent).toMatch(/Microphone access was denied/i);
    // Rest of Speak still usable: model sentence + Mercy đọc still present.
    expect(screen.getByTestId("ai-tutor-speak-target")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mercy đọc" })).toBeInTheDocument();
  });

  it("the self-compare panel shows no percent / score", () => {
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };
    renderSpeak(null, "");
    const panel = screen.getByTestId("self-compare-recorder");
    expect(panel.textContent ?? "").not.toMatch(/\d+\s*%/);
    expect(panel.textContent ?? "").toMatch(/không có điểm số|không chấm điểm/i);
  });

  it("uses the clearer replay / compare labels", () => {
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };
    renderSpeak(null, "");
    expect(screen.getByTestId("self-compare-play")).toHaveTextContent(
      /Nghe bản thu của bạn/,
    );
    expect(screen.getByTestId("self-compare-by-ear")).toHaveTextContent(
      /Nghe mẫu rồi nghe bạn/,
    );
  });

  it("wires the model playback (same path as Mercy đọc) into the compare button", async () => {
    const onPlayModel = vi.fn(async () => true);
    recorderMock.current = { ...IDLE_RECORDER, lastRecordedAudioUrl: "blob:rec" };
    render(
      <SpeakPracticeMode {...baseProps} onPlayModel={onPlayModel} pronunciationResult={null} />,
    );
    screen.getByTestId("self-compare-by-ear").click();
    await waitFor(() => expect(onPlayModel).toHaveBeenCalledTimes(1));
  });

  it("keeps the Speak follow-up visible alongside the recorder", () => {
    render(
      <SpeakPracticeMode
        {...baseProps}
        repeatInput="I bought a hat yesterday."
        followUpPrompt={followUpPrompt("Where did you buy it?")}
        pronunciationResult={null}
      />,
    );
    // The recorder addition must not hide the follow-up flow.
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
      "Where did you buy it?",
    );
  });
});
