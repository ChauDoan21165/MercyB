import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AiTutorPage from "../AiTutor";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import { hasShownHint } from "@/lib/ai-tutor/detectorHint";
import { readL1RecentTags } from "@/lib/stage-3a/adapters/l1TagAdapter";
import type { SpeechRecognitionLike } from "@/types/speech-recognition";

const EMPTY_SUMMARY: MemorySummary = {
  tutorProduct: "ai-tutor",
  targetLanguage: "en",
  memoryKey: "ai-tutor:en",
  strengths: [],
  needsReview: [],
  commonMistakePatterns: [],
  nextRecommendedFocus: "",
  confidenceTrend: "not-enough-data",
  updatedAt: null,
  totalCorrections: 0,
  practicedCount: 0,
  strongestTopic: "",
  strongestTopicCount: 0,
  topicNeedingReview: "",
  topicNeedingReviewCount: 0,
  lastPracticedTopic: "",
  lastPracticedAt: null,
  suggestedNextFocus: "",
  topicCounts: {},
  unpracticedCorrectionIds: [],
};

const {
  putCorrection,
  getMemorySummary,
  markPracticed,
  fetchCloudTtsUrl,
} = vi.hoisted(() => {
  type CloudTtsArgs = { text: string; language: "en" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | "vi"; voiceIdOverride?: string };
  type CloudTtsResult = { audioUrl: string; cached: boolean };
  return {
    putCorrection: vi.fn(async () => {}),
    getMemorySummary: vi.fn(async () => ({ ...EMPTY_SUMMARY })),
    markPracticed: vi.fn(async () => {}),
    fetchCloudTtsUrl: vi.fn(async (_args: CloudTtsArgs): Promise<CloudTtsResult | null> => null),
  };
});

class MockSpeechSynthesisUtterance {
  text: string;
  lang = "";
  rate = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

class MockSpeechRecognition extends EventTarget implements SpeechRecognitionLike {
  static last: MockSpeechRecognition | null = null;
  continuous = false;
  interimResults = false;
  lang = "";
  onstart: (() => void) | null = null;
  onresult: SpeechRecognitionLike["onresult"] = null;
  onerror: SpeechRecognitionLike["onerror"] = null;
  onend: (() => void) | null = null;

  constructor() {
    super();
    MockSpeechRecognition.last = this;
  }

  start() {
    this.onstart?.();
  }

  stop() {
    this.onend?.();
  }

  emitFinalTranscript(text: string) {
    this.onresult?.({
      resultIndex: 0,
      results: [
        {
          isFinal: true,
          length: 1,
          0: { transcript: text },
        },
      ],
    } as unknown as Parameters<NonNullable<SpeechRecognitionLike["onresult"]>>[0]);
  }
}

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: vi.fn(() => ({ user: null, isLoading: false })),
}));

vi.mock("@/lib/ai-tutor/learningMemory", () => ({
  putCorrection,
  getMemorySummary,
  markPracticed,
}));

vi.mock("@/lib/mercyVoice", () => ({
  fetchCloudTtsUrl,
}));

vi.mock("@/lib/placement/availability", () => ({
  isPlacementEntryRouteAvailable: vi.fn(() => false),
}));

beforeEach(() => {
  vi.clearAllMocks();
  MockSpeechRecognition.last = null;
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.pushState({}, "", "/ai-tutor");
  window.localStorage.setItem("mercyblade.lessonUiLang", "vi");
  delete window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__;
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
  getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
  fetchCloudTtsUrl.mockResolvedValue(null);
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: undefined,
  });
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    configurable: true,
    value: undefined,
  });
});

async function correctSentence(input: string, expected: string) {
  await userEvent.type(
    screen.getByRole("textbox"),
    input,
  );
  await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
  await waitFor(() => expect(screen.getByText(expected)).toBeInTheDocument());
}

function recentL1Tags() {
  return readL1RecentTags().map((entry) => entry.tag);
}

async function correctHatSentence() {
  await correctSentence("I buy a hat yesterday.", "I bought a hat yesterday.");
}

async function openTab(name: string) {
  await userEvent.click(within(screen.getByTestId("teacher-mercy-mode-tabs")).getByRole("button", { name }));
}

async function speakCurrentTarget(transcript: string) {
  await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói|Đọc câu thay vì gõ/i }));
  act(() => {
    MockSpeechRecognition.last?.emitFinalTranscript(transcript);
    MockSpeechRecognition.last?.stop();
  });
}

describe("AiTutor four-tab seed flow", () => {
  it("renders the Teacher Mercy shell with four tabs", () => {
    render(<AiTutorPage />);

    expect(screen.getByTestId("ai-tutor-shell")).toBeInTheDocument();
    const tabs = screen.getByTestId("teacher-mercy-mode-tabs");
    expect(within(tabs).getByRole("button", { name: "Lộ trình" })).toBeInTheDocument();
    expect(within(tabs).getByRole("button", { name: "Sửa câu" })).toHaveAttribute("aria-pressed", "true");
    expect(within(tabs).getByRole("button", { name: "Luyện nói" })).toBeInTheDocument();
    expect(within(tabs).getByRole("button", { name: "Logic" })).toBeInTheDocument();
  });

  it("keeps Lộ trình static and links only to Grammar", async () => {
    render(<AiTutorPage />);

    await openTab("Lộ trình");
    const journey = screen.getByTestId("ai-tutor-journey-path");

    expect(within(journey).getByRole("heading", { name: "Lộ trình học hôm nay" })).toBeInTheDocument();
    expect(journey).toHaveTextContent("1. Sửa một câu");
    expect(journey).toHaveTextContent("2. Luyện nói câu đó");
    expect(journey).toHaveTextContent("3. Hiểu vì sao tiếng Anh nói vậy");
    expect(within(journey).queryByRole("textbox")).not.toBeInTheDocument();
    expect(within(journey).queryByRole("button", { name: /Mercy đọc|micro|Nhập bằng giọng nói/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-memory-card")).not.toBeInTheDocument();

    await userEvent.click(within(journey).getByRole("button", { name: "Bắt đầu sửa câu" }));
    expect(within(screen.getByTestId("teacher-mercy-mode-tabs")).getByRole("button", { name: "Sửa câu" })).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps Sửa câu focused on writing and correction", async () => {
    render(<AiTutorPage />);

    const grammar = screen.getByTestId("ai-tutor-layout");
    expect(within(grammar).getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i })).toHaveFocus();
    expect(within(grammar).getByRole("button", { name: "Sửa câu này" })).toBeDisabled();
    expect(within(grammar).getByText("Đọc câu thay vì gõ")).toBeInTheDocument();
    expect(within(grammar).queryByRole("button", { name: /Mercy đọc/ })).not.toBeInTheDocument();

    await correctHatSentence();

    expect(screen.getByText(/Khi nói về việc đã xảy ra/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" })).toBeInTheDocument();
    expect(screen.queryByText(/Bạn nói giống câu mẫu/)).not.toBeInTheDocument();
  });

  it("shows a Step 5 article omission hint in Correction", async () => {
    render(<AiTutorPage />);

    await correctSentence("She is teacher.", "She is a teacher.");

    const chip = await screen.findByTestId("detector-hint-chip");
    expect(chip).toHaveAttribute("data-tag", "vi_l1_missing_article");
    expect(chip).toHaveTextContent("Missing a / an / the");
    expect(recentL1Tags()).toEqual(["vi_l1_missing_article"]);
  });

  it("shows a Step 5 plural omission hint in Correction", async () => {
    render(<AiTutorPage />);

    await correctSentence("I have two book.", "I have two books.");

    const chip = await screen.findByTestId("detector-hint-chip");
    expect(chip).toHaveAttribute("data-tag", "vi_l1_plural_s");
    expect(chip).toHaveTextContent("Plural -s");
    expect(recentL1Tags()).toEqual(["vi_l1_plural_s"]);
  });

  it("keeps the existing past-tense omission hint in Correction", async () => {
    render(<AiTutorPage />);

    await correctHatSentence();

    const chip = await screen.findByTestId("detector-hint-chip");
    expect(chip).toHaveAttribute("data-tag", "vi_l1_past_ed");
    expect(chip).toHaveTextContent("Past tense -ed");
    expect(recentL1Tags()).toEqual(["vi_l1_past_ed"]);
  });

  it("does not show a Step 5 hint for safe Correction input", async () => {
    render(<AiTutorPage />);

    await correctSentence("I like music.", "I like music.");

    expect(screen.queryByTestId("detector-hint-chip")).not.toBeInTheDocument();
    expect(recentL1Tags()).toEqual([]);
  });

  it("does not record duplicate L1 tags for the same already-shown hint", async () => {
    render(<AiTutorPage />);

    await correctSentence("She is teacher.", "She is a teacher.");
    expect(await screen.findByTestId("detector-hint-chip")).toHaveAttribute(
      "data-tag",
      "vi_l1_missing_article",
    );
    await waitFor(() => expect(hasShownHint("vi_l1_missing_article")).toBe(true));

    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("She is teacher.", "She is a teacher.");

    expect(screen.queryByTestId("detector-hint-chip")).not.toBeInTheDocument();
    expect(recentL1Tags()).toEqual(["vi_l1_missing_article"]);
  });

  it("does not record VN-to-EN L1 tags for non-English Correction targets", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=vi");
    render(<AiTutorPage />);

    await correctSentence("She is teacher.", "She is teacher.");

    expect(screen.queryByTestId("detector-hint-chip")).not.toBeInTheDocument();
    expect(recentL1Tags()).toEqual([]);
  });

  it("supports voice draft confirmation in Grammar without making mic primary", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("I buy a hat yesterday.");
      MockSpeechRecognition.last?.stop();
    });

    expect(await screen.findByTestId("ai-tutor-voice-draft")).toHaveTextContent("I buy a hat yesterday");
    await userEvent.click(screen.getByRole("button", { name: "Dùng câu này" }));
    expect(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i })).toHaveValue("I buy a hat yesterday");
  });

  it("moves the corrected sentence from Grammar to Speak and scores the repeated sentence honestly", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("I bought a hat yesterday.");
    await speakCurrentTarget("I bought a hat yesterday.");

    expect(await screen.findByTestId("ai-tutor-speak-score")).toHaveTextContent("Bạn nói giống câu mẫu khoảng 100%.");
    expect(screen.getByTestId("ai-tutor-speak-score")).toHaveTextContent("Mercy đang nghe theo từ. Sẽ chấm phát âm chi tiết hơn sau.");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.queryByText(/pronunciation score|phát âm score/i)).not.toBeInTheDocument();
  });

  it("keeps deterministic Step 8 Speak follow-up when no salience is found", async () => {
    const mockPivot = vi.fn(() => "This should not be used. What happened?");
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = mockPivot;
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought a hat yesterday.");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(mockPivot).not.toHaveBeenCalled();
  });

  it("uses a valid mocked content-aware pivot for English salience in Speak", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "The fish burned. What did you eat instead?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife burned the fish");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("The fish burned. What did you eat instead?");
  });

  it("uses a valid mocked content-aware pivot for VN salience in Speak", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "Your wife is skilled. What is she good at?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife rất giỏi");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Your wife is skilled. What is she good at?");
  });

  it("lets high-stakes salience override the local correction path in Speak", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "That sounds scary. Are you safe now?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I was scared because she go every day");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("That sounds scary. Are you safe now?");
  });

  it("does not let ordinary salience override the local L4 correction path in Speak", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "That hard detail matters. What made it hard?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("she work here and it was hard");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("What made it hard?");
  });

  it("falls back to deterministic Step 8 follow-up for invalid mocked pivot candidates", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "Nice, the fish burned. What did you eat?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife burned the fish");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("Nice");
  });

  it("falls back to deterministic Step 8 follow-up for mocked pivot timeout or failure", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => ({ failed: true }));
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife burned the fish");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
  });

  it("rejects repeated mocked assistant pivots and uses deterministic Step 8 fallback", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "The fish burned. What did you eat instead?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife burned the fish");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("The fish burned. What did you eat instead?");

    await speakCurrentTarget("my wife burned the fish again");
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    });
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("The fish burned. What did you eat instead?");
  });

  it("scores the typed Speak repeat fallback honestly without phoneme evidence", async () => {
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I bought a hat yesterday.",
    );

    const score = await screen.findByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Bạn nói giống câu mẫu khoảng 100%.");
    expect(score).toHaveTextContent("Mercy đang nghe theo từ. Sẽ chấm phát âm chi tiết hơn sau.");
    expect(score).not.toHaveTextContent("Mercy đã chấm phát âm chi tiết hơn bằng từng âm.");
  });

  it("does not repeat Speak follow-up templates for the same corrected sentence", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await speakCurrentTarget("I bought a hat yesterday.");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");

    await speakCurrentTarget("I bought a hat yesterday again.");
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("What kind of hat was it?");
    });
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("Where did you buy it?");
  });

  it("offers a graceful pivot after four Speak follow-up turns on the same topic", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await speakCurrentTarget("I bought a hat yesterday.");
    await speakCurrentTarget("I bought a red hat yesterday.");
    await speakCurrentTarget("I bought a blue hat yesterday.");
    await speakCurrentTarget("I bought a small hat yesterday.");
    await speakCurrentTarget("I bought another hat yesterday.");

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Bạn muốn luyện thêm câu khác không?");
    });
  });

  it("uses the learner's latest spoken topic instead of drifting back to the corrected seed", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("I bought a hat yesterday.");
    await speakCurrentTarget("I had dinner with my family.");

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("What did you eat?");
    expect(followUp).not.toHaveTextContent("Where did you buy it?");
    expect(followUp).not.toHaveTextContent(/morning|work/i);
  });

  it("keeps dinner and family follow-ups on topic for four turns without repeated questions", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    const questions: string[] = [];
    for (const transcript of [
      "I had dinner with my family.",
      "It was very good.",
      "We talked for a long time.",
      "I felt happy.",
    ]) {
      const previousQuestion = questions.at(-1);
      await speakCurrentTarget(transcript);
      await waitFor(() => {
        const text = screen.getByTestId("ai-tutor-speak-follow-up").textContent ?? "";
        expect(text).not.toMatch(/Bạn muốn luyện thêm câu khác không/);
        if (previousQuestion) expect(text).not.toBe(previousQuestion);
      });
      const text = screen.getByTestId("ai-tutor-speak-follow-up").textContent ?? "";
      expect(text).not.toMatch(/Where did you buy it|What kind of hat was it|morning|work/i);
      questions.push(text);
    }

    expect(new Set(questions).size).toBe(questions.length);

    await speakCurrentTarget("It was a nice time.");
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Bạn muốn luyện thêm câu khác không?");
    });
  });

  it("falls back to the generic Speak prompt when no corrected sentence exists", async () => {
    render(<AiTutorPage />);

    await openTab("Luyện nói");

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("What do you usually do in the morning?");
    expect(screen.getByTestId("ai-tutor-speak-generic-prompt")).toHaveTextContent("Chưa có câu đã sửa");
    expect(screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" })).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-conversation-mic-fallback")).toBeInTheDocument();
  });

  it("keeps Speak TTS scoped to the latest corrected practice target", async () => {
    const browserSpeak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onstart?.();
      utterance.onend?.();
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: browserSpeak,
        cancel: vi.fn(),
        getVoices: vi.fn(() => []),
        resume: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await userEvent.click(screen.getByRole("button", { name: /Mercy đọc/ }));

    await waitFor(() => expect(browserSpeak).toHaveBeenCalledTimes(1));
    expect(fetchCloudTtsUrl).not.toHaveBeenCalled();
    const utterance = browserSpeak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toBe("I bought a hat yesterday.");
    expect(utterance.lang).toBe("en-US");
    expect(utterance.text).not.toContain("I buy a hat yesterday");
  });

  it("updates Speak target when Grammar corrects a new sentence", async () => {
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await userEvent.type(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i }), "She go to school every day.");
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    await waitFor(() => expect(screen.getByText("She goes to school every day.")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("She goes to school every day.");
  });

  it("renders curated Logic explanations and uses fallback only for unmatched free text", async () => {
    render(<AiTutorPage />);

    await openTab("Logic");
    expect(screen.getByTestId("ai-tutor-logic-curated-explanation")).toHaveTextContent(
      "Tiếng Việt không dùng mạo từ như a/an/the",
    );
    expect(screen.getByTestId("ai-tutor-logic-curated-explanation")).toHaveTextContent("I bought a hat yesterday.");
    expect(screen.getByTestId("ai-tutor-logic-curated-explanation")).toHaveTextContent("I bought hat yesterday.");

    await userEvent.type(screen.getByRole("textbox", { name: /Hoặc nhập câu muốn giải thích/i }), "My project feels ready but strange.");
    await userEvent.click(screen.getByRole("button", { name: "Giải thích câu này" }));

    expect(screen.getByTestId("ai-tutor-logic-llm-fallback")).toHaveTextContent("Mercy chưa có thẻ logic cố định cho câu này");
  });

  it("lets Logic read the latest corrected sentence", async () => {
    render(<AiTutorPage />);

    await correctHatSentence();
    await openTab("Logic");

    const logic = screen.getByTestId("ai-tutor-logic-mode");
    expect(within(logic).getByText("Câu đã sửa mới nhất")).toBeInTheDocument();
    expect(within(logic).getAllByText("I bought a hat yesterday.").length).toBeGreaterThan(0);
  });
});
