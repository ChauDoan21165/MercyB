// src/pages/__tests__/AiTutor.test.tsx
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AiTutorPage from "../AiTutor";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import type { SpeechRecognitionLike } from "@/types/speech-recognition";

const EMPTY_SUMMARY: MemorySummary = {
  tutorProduct: "ai-tutor", targetLanguage: "en", memoryKey: "ai-tutor:en",
  strengths: [], needsReview: [], commonMistakePatterns: [],
  nextRecommendedFocus: "", confidenceTrend: "not-enough-data", updatedAt: null,
  totalCorrections: 0, practicedCount: 0, strongestTopic: "", strongestTopicCount: 0,
  topicNeedingReview: "", topicNeedingReviewCount: 0,
  lastPracticedTopic: "", lastPracticedAt: null, suggestedNextFocus: "",
  topicCounts: {}, unpracticedCorrectionIds: [],
};

const POPULATED_SUMMARY: MemorySummary = {
  tutorProduct: "ai-tutor", targetLanguage: "en", memoryKey: "ai-tutor:en",
  strengths: ["present-simple"], needsReview: ["past-tense"], commonMistakePatterns: ["present-simple", "past-tense"],
  nextRecommendedFocus: "past-tense", confidenceTrend: "improving", updatedAt: Date.now(),
  totalCorrections: 6, practicedCount: 4, strongestTopic: "present-simple", strongestTopicCount: 3,
  topicNeedingReview: "past-tense", topicNeedingReviewCount: 1,
  lastPracticedTopic: "articles", lastPracticedAt: Date.now(), suggestedNextFocus: "past-tense",
  topicCounts: { "present-simple": 3, "past-tense": 1 }, unpracticedCorrectionIds: [],
};

const { putCorrection, getMemorySummary, markPracticed, fetchCloudTtsUrl } = vi.hoisted(() => {
  type CloudTtsArgs = { text: string; language: "en" | "vi"; voiceIdOverride?: string };
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
    this.emitTranscript(text, true);
  }

  emitInterimTranscript(text: string) {
    this.emitTranscript(text, false);
  }

  emitTranscript(text: string, isFinal: boolean) {
    this.onresult?.({
      resultIndex: 0,
      results: [
        {
          isFinal,
          length: 1,
          0: { transcript: text },
        },
      ],
    } as unknown as Parameters<NonNullable<SpeechRecognitionLike["onresult"]>>[0]);
  }
}

class MockAudioElement {
  static last: MockAudioElement | null = null;
  src: string;
  onplay: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();

  constructor(src: string) {
    this.src = src;
    MockAudioElement.last = this;
  }

  async play() {
    this.onplay?.();
    this.onended?.();
  }
}

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: vi.fn(() => ({ user: null, isLoading: false })),
}));

vi.mock("@/lib/ai-tutor/learningMemory", () => ({
  putCorrection, getMemorySummary, markPracticed,
}));

vi.mock("@/lib/mercyVoice", () => ({
  fetchCloudTtsUrl,
}));

beforeEach(() => {
  vi.clearAllMocks();
  MockSpeechRecognition.last = null;
  window.history.pushState({}, "", "/ai-tutor");
  window.localStorage.setItem("mercyblade.lessonUiLang", "vi");
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
  getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
  fetchCloudTtsUrl.mockResolvedValue(null);
  MockAudioElement.last = null;
});

describe("AiTutor mock UI", () => {
  it("renders the mock badge", () => {
    render(<AiTutorPage />);
    expect(screen.getByText("Mock")).toBeInTheDocument();
  });

  it("keeps Teacher Mercy avatar and header visible after memory loads", async () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-mercy-avatar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Teacher Mercy AI Tutor/ })).toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-mode-tabs")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Journey" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Grammar" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Speak" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logic" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByTestId("ai-tutor-mercy-avatar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Teacher Mercy AI Tutor/ })).toBeInTheDocument();
  });

  it("shows microphone fallback when browser speech recognition is unavailable", () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-mic-fallback")).toHaveTextContent(/Không dùng được micro/);
  });

  it("shows microphone control when browser speech recognition is supported", () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = vi.fn();
    render(<AiTutorPage />);
    expect(screen.getByRole("button", { name: /Nói câu của bạn/ })).toBeInTheDocument();
    expect(
      screen.getByText("Mercy sẽ chuyển giọng nói của bạn thành câu để sửa."),
    ).toBeInTheDocument();
  });

  it("labels listening state as user voice input, not playback", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    expect(screen.queryByRole("button", { name: /Mercy đọc/ })).not.toBeInTheDocument();

    const micButton = screen.getByRole("button", { name: /Nói câu của bạn/ });
    await userEvent.click(micButton);

    expect(screen.getByRole("button", { name: /Dừng nghe/ })).toHaveTextContent(
      "Đang nghe giọng của bạn...",
    );
    expect(screen.queryByText("Đang nghe...")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Mercy đọc/ })).not.toBeInTheDocument();
  });

  it("does not duplicate repeated STT final transcript events", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: /Nói câu của bạn/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("tôi buồn vì mất cái xe đạp");
      MockSpeechRecognition.last?.emitFinalTranscript("tôi buồn vì mất cái xe đạp");
      MockSpeechRecognition.last?.stop();
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("tôi buồn vì mất cái xe đạp");
    });
  });

  it("does not append a matching STT transcript to existing textarea text", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.type(screen.getByRole("textbox"), "tôi buồn vì mất cái xe đạp");
    await userEvent.click(screen.getByRole("button", { name: /Nói câu của bạn/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("tôi buồn vì mất cái xe đạp");
      MockSpeechRecognition.last?.stop();
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("tôi buồn vì mất cái xe đạp");
    });
  });

  it("previews repeated STT interim transcripts without multiplying textarea text", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: /Nói câu của bạn/ }));
    act(() => {
      MockSpeechRecognition.last?.emitInterimTranscript("tôi buồn vì mất cái xe đạp");
      MockSpeechRecognition.last?.emitInterimTranscript("tôi buồn vì mất cái xe đạp tôi buồn vì mất cái xe đạp");
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("tôi buồn vì mất cái xe đạp");
    });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value.length).toBeLessThan(500);
  });

  it("collapses noisy repeated Vietnamese STT into one clean utterance", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: /Nói câu của bạn/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript(
        "tôi buồn vì mất cái xe đạp tôi buồn vì mất cái xe đạp ok ok chương trình nó chạy xong",
      );
      MockSpeechRecognition.last?.stop();
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("tôi buồn vì mất cái xe đạp");
    });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value.length).toBeLessThan(500);
  });

  it("keeps Vietnamese UI with French target copy after hydration", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);
    expect(screen.getByRole("heading", { name: /Gia sư tiếng Pháp/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByText(/Viết một câu tiếng Pháp/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/gõ câu tiếng Pháp/)).toBeInTheDocument();
    expect(screen.getByText("Câu tiếng Pháp của bạn")).toBeInTheDocument();
    expect(screen.queryByText(/Write an English sentence/i)).not.toBeInTheDocument();
  });

  it("keeps Vietnamese UI with Chinese target copy after hydration", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=zh");
    render(<AiTutorPage />);
    expect(screen.getByRole("heading", { name: /Gia sư tiếng Trung/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByText(/Viết một câu tiếng Trung/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/gõ câu tiếng Trung/)).toBeInTheDocument();
    expect(screen.queryByText(/Write an English sentence/i)).not.toBeInTheDocument();
  });

  it("keeps English UI explanation separate from French target copy", () => {
    window.localStorage.setItem("mercyblade.lessonUiLang", "en");
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);

    expect(screen.getByRole("heading", { name: /Teacher Mercy · (French Tutor|Gia sư tiếng Pháp)/ })).toBeInTheDocument();
    expect(screen.getByText(/Practice French with Mercy/)).toBeInTheDocument();
    expect(screen.getByText("Your French sentence")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/gõ câu tiếng Pháp/)).toBeInTheDocument();
  });

  it("starts Conversation mode in French when target=fr", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: "Journey" }));

    expect(screen.getByTestId("ai-tutor-conversation")).toBeInTheDocument();
    expect(screen.getByText("Mercy hỏi · Bạn trả lời")).toBeInTheDocument();
    expect(screen.getByText("Qu'est-ce que tu fais le matin ?")).toBeInTheDocument();
  });

  it("starts Conversation mode in Chinese when target=zh", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=zh");
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: "Journey" }));

    expect(screen.getByText("你早上通常做什么？")).toBeInTheDocument();
  });

  it("sends a typed Conversation reply and shows correction plus one next question", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: "Journey" }));
    await userEvent.type(screen.getByRole("textbox"), "Je suis aller au marché");
    await userEvent.click(screen.getByRole("button", { name: /Send|Gửi/ }));

    expect(screen.getByText("Je suis aller au marché")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Câu đã sửa")).toBeInTheDocument();
      expect(screen.getByText("Je suis allé au marché.")).toBeInTheDocument();
      expect(screen.getByText("Qu'est-ce que tu fais après ça ?")).toBeInTheDocument();
    });
    expect(putCorrection).toHaveBeenCalledWith(
      expect.objectContaining({
        topic: "conversation-fr",
        practiced: true,
      }),
    );
  });

  it("mic fills Conversation input without touching correction mode input", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: "Journey" }));
    await userEvent.click(screen.getByRole("button", { name: /Nói câu của bạn/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("I drink coffee");
      MockSpeechRecognition.last?.stop();
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("I drink coffee");
    });

    await userEvent.click(screen.getByRole("button", { name: "Grammar" }));
    expect(screen.getByRole("textbox")).toHaveValue("She go to school");
  });

  it("speaker reads Mercy Conversation reply in the target language", async () => {
    const speak = vi.fn();
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: vi.fn(),
        getVoices: vi.fn(() => []),
        resume: vi.fn(),
        speak,
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });

    window.history.pushState({}, "", "/ai-tutor?target=zh");
    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Journey" }));

    const speakerButtons = screen.getAllByRole("button", { name: /Mercy đọc/ });
    await userEvent.click(speakerButtons[0]);

    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toContain("你早上通常做什么？");
    expect(utterance.lang).toBe("zh-CN");
  });

  it.each([
    ["de", /Gia sư tiếng Đức/, /Viết một câu tiếng Đức/, /gõ câu tiếng Đức/],
    ["ja", /Gia sư tiếng Nhật/, /Viết một câu tiếng Nhật/, /gõ câu tiếng Nhật/],
    ["ko", /Gia sư tiếng Hàn/, /Viết một câu tiếng Hàn/, /gõ câu tiếng Hàn/],
    ["es", /Gia sư tiếng Tây Ban Nha/, /Viết một câu tiếng Tây Ban Nha/, /type your Spanish sentence/],
    ["vi", /Gia sư tiếng Việt/, /Viết một câu tiếng Việt/, /gõ câu tiếng Việt/],
  ])("keeps %s target copy after hydration", async (target, heading, helper, placeholder) => {
    window.history.pushState({}, "", `/ai-tutor?target=${target}`);
    render(<AiTutorPage />);
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByText(helper)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it("defaults to floating-safe layout until the container is measured wide", () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-shell")).toHaveAttribute("data-floating-shell", "true");
  });

  it("shows empty state before first submit", () => {
    render(<AiTutorPage />);
    expect(screen.getByText(/AI sẵn sàng sửa câu của bạn/)).toBeInTheDocument();
  });

  it("shows button disabled with empty input", () => {
    render(<AiTutorPage />);
    expect(screen.getByRole("button", { name: /Sửa câu này/ })).toBeDisabled();
  });

  it("enables button when input has text", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    expect(screen.getByRole("button", { name: /Sửa câu này/ })).toBeEnabled();
  });

  it("shows loading state after submit", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    expect(screen.getByText(/AI đang phân tích/)).toBeInTheDocument();
  });

  it("shows corrected sentence after loading", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("She goes to school.")).toBeInTheDocument();
    });
  });

  it("corrects common English past-tense beginner errors before showing the result", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "I buy a hat yesterday.");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("I bought a hat yesterday.")).toBeInTheDocument();
    });
  });

  it("corrects third-person and past-tense English examples deterministically", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "He eat rice yesterday.");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("He ate rice yesterday.")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Làm mới/ }));
    await userEvent.type(screen.getByRole("textbox"), "She go to school every day.");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("She goes to school every day.")).toBeInTheDocument();
    });
  });

  it("shows safe fallback instead of unchanged wrong correction when local rules cannot correct", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "I run yesterday.");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));

    await waitFor(() => {
      expect(
        screen.getByText("Mercy needs the AI correction engine for this one."),
      ).toBeInTheDocument();
    });
    expect(screen.queryByText("Câu đã sửa")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Mercy đọc/ })).not.toBeInTheDocument();
    expect(putCorrection).not.toHaveBeenCalled();
  });

  it("corrects French target in French and explains in Vietnamese", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "Toute lecture neuve d'un texte canonique paraît hérétique");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText(/Toute lecture nouvelle d'un texte canonique/)).toBeInTheDocument();
    });
    expect(screen.queryByText("She goes to school every day.")).not.toBeInTheDocument();
    expect(screen.queryByText("She goes to school every morning.")).not.toBeInTheDocument();
    expect(screen.getByText("Câu đã sửa")).toBeInTheDocument();
    expect(screen.getByText("Giải thích")).toBeInTheDocument();
    expect(screen.getByText(/Câu vẫn giữ ý gốc bằng tiếng Pháp/)).toBeInTheDocument();
  });

  it("corrects Vietnamese target based on the submitted meaning", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=vi");
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "Tôi buồn vì mất cái mũ đẹp.");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(
        screen.getByText("Tôi buồn vì đã làm mất chiếc mũ đẹp của mình."),
      ).toBeInTheDocument();
    });
    expect(screen.queryByText("Hôm qua tôi đi chợ.")).not.toBeInTheDocument();
  });

  it("corrects Vietnamese bicycle loss without placeholder output", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=vi");
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "tôi buồn vì mất cái xe đạp");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("Tôi buồn vì đã làm mất chiếc xe đạp.")).toBeInTheDocument();
    });
    expect(screen.queryByText("Hôm qua tôi đi chợ.")).not.toBeInTheDocument();
    expect(screen.getByText(/Tôi buồn vì đã làm mất chiếc xe đạp/)).toBeInTheDocument();
  });

  it("corrects noisy repeated Vietnamese input to the intended main sentence", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=vi");
    render(<AiTutorPage />);
    await userEvent.type(
      screen.getByRole("textbox"),
      "Tôi buồn vì mất cái chiếc xe đạp Tôi buồn vì đã làm mất cái chiếc xe đạp chương trình nó chạy xong Ok Ok",
    );
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("Tôi buồn vì đã làm mất chiếc xe đạp.")).toBeInTheDocument();
    });
    expect(screen.queryByText("Hôm qua tôi đi chợ.")).not.toBeInTheDocument();
  });

  it("cleans repeated Vietnamese STT fragments and duplicate classifiers before correcting", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=vi");
    render(<AiTutorPage />);
    await userEvent.type(
      screen.getByRole("textbox"),
      "Tôi buồn vì mất chiếc cái mũ tôi buồn tôi buồn mất",
    );
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    let correctedText = "";
    await waitFor(() => {
      const corrected = screen.getByText("Tôi buồn vì đã làm mất chiếc mũ đẹp của mình.");
      expect(corrected).toBeInTheDocument();
      correctedText = corrected.textContent ?? "";
    });
    expect(correctedText).not.toMatch(/tôi buồn tôi buồn/i);
    expect(correctedText).not.toMatch(/chiếc cái/i);
  });

  it("does not return unrelated Japanese placeholder corrections", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=ja");
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "今日は雨です");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("今日は雨です。")).toBeInTheDocument();
    });
    expect(screen.queryByText("私は昨日店に行きました。")).not.toBeInTheDocument();
  });

  it("corrects Chinese target in Chinese and explains in Vietnamese", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=zh");
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "我昨天去商店");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("我昨天去了商店。")).toBeInTheDocument();
    });
    expect(screen.getByText(/Câu tiếng Trung cần thêm/)).toBeInTheDocument();
  });

  it("shows one Mercy speaker after French correction and speaks French text", async () => {
    const speak = vi.fn();
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: vi.fn(),
        getVoices: vi.fn(() => []),
        resume: vi.fn(),
        speak,
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });

    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);
    expect(screen.queryByRole("button", { name: /Mercy đọc/ })).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole("textbox"), "Toute lecture neuve d'un texte canonique paraît hérétique");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Toute lecture nouvelle/)).toBeInTheDocument());

    const speakerButtons = screen.getAllByRole("button", { name: /Mercy đọc/ });
    expect(speakerButtons).toHaveLength(1);
    await userEvent.click(speakerButtons[0]);

    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toMatch(/Toute lecture nouvelle/);
    expect(utterance.lang).toBe("fr-FR");
  });

  it("uses cloud Mercy voice first for multilingual corrections and shows Mercy voice", async () => {
    const browserSpeak = vi.fn();
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.com/mercy.mp3", cached: false });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockAudioElement,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: vi.fn(),
        getVoices: vi.fn(() => []),
        resume: vi.fn(),
        speak: browserSpeak,
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });

    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "Toute lecture neuve d'un texte canonique paraît hérétique");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Toute lecture nouvelle/)).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /Mercy đọc/ }));

    await waitFor(() => expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: expect.stringMatching(/Toute lecture nouvelle/),
      language: "en",
    }));
    expect(browserSpeak).not.toHaveBeenCalled();
    expect(MockAudioElement.last?.src).toBe("https://example.com/mercy.mp3");
    expect(await screen.findByText("Mercy voice")).toBeInTheDocument();
  });

  it("sends the corrected English sentence to Mercy voice instead of the raw mistake", async () => {
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.com/grammar.mp3", cached: false });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockAudioElement,
    });

    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "I buy a hat yesterday.");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText("I bought a hat yesterday.")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /Mercy đọc/ }));

    await waitFor(() => {
      expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
        text: "I bought a hat yesterday.",
        language: "en",
      });
    });
    expect(fetchCloudTtsUrl).not.toHaveBeenCalledWith(expect.objectContaining({
      text: "I buy a hat yesterday.",
    }));
  });

  it("uses registry TTS locale for Conversation replies without reading raw user input", async () => {
    const browserSpeak = vi.fn();
    fetchCloudTtsUrl.mockResolvedValue(null);
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockAudioElement,
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel: vi.fn(),
        getVoices: vi.fn(() => []),
        resume: vi.fn(),
        speak: browserSpeak,
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });

    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Journey" }));
    await userEvent.type(screen.getByRole("textbox"), "Je suis aller au marché");
    await userEvent.click(screen.getByRole("button", { name: /Send|Gửi/ }));
    await waitFor(() => expect(screen.getByText("Je suis allé au marché.")).toBeInTheDocument());

    const speakerButtons = screen.getAllByRole("button", { name: /Mercy đọc/ });
    await userEvent.click(speakerButtons[speakerButtons.length - 1]);

    await waitFor(() => expect(browserSpeak).toHaveBeenCalledTimes(1));
    expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: expect.stringContaining("Qu'est-ce que tu fais après ça ?"),
      language: "en",
    });
    expect(await screen.findByText("Device voice fallback")).toBeInTheDocument();
    const utterance = browserSpeak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.lang).toBe("fr-FR");
    const spokenText = utterance.text;
    expect(spokenText).toContain("Qu'est-ce que tu fais après ça ?");
    expect(spokenText).not.toContain("Je suis aller au marché");
  });

  it("marks the result layout expanded", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-layout")).toHaveAttribute("data-expanded", "true");
    });
  });

  it("shows practice section after correction", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
  });

  it("submit practice shows mock feedback", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
    const textareas = screen.getAllByRole("textbox");
    await userEvent.type(textareas[1], "my practice answer");
    await userEvent.click(screen.getByRole("button", { name: /Gửi câu trả lời/ }));
    await waitFor(() => expect(screen.getByText(/Nhận xét/)).toBeInTheDocument());
  });

  it("reset clears correction and practice state", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /Làm mới/ }));
    expect(screen.getByText(/AI sẵn sàng sửa câu của bạn/)).toBeInTheDocument();
  });

  it("no fetch call is made", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("caps input at 500 characters", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "a".repeat(600));
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(500);
  });

  it("M3: calls putCorrection on submit and markPracticed on practice", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(putCorrection).toHaveBeenCalledTimes(1));
    expect(putCorrection).toHaveBeenCalledWith(expect.objectContaining({
      tutorProduct: "ai-tutor",
      targetLanguage: "en",
    }));
    const textareas = screen.getAllByRole("textbox");
    await userEvent.type(textareas[1], "my practice");
    await userEvent.click(screen.getByRole("button", { name: /Gửi câu trả lời/ }));
    await waitFor(() => expect(markPracticed).toHaveBeenCalledTimes(1));
    expect(markPracticed).toHaveBeenCalledWith(expect.any(String), "ai-tutor", "en");
  });

  // ── M3: Aggregate memory card ────────────────────────────────────

  it("M3: shows reminder card when memory exists", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-card")).toBeInTheDocument());
    expect(screen.getByText(/6 câu đã sửa/)).toBeInTheDocument();
    expect(screen.getByText(/4 đã luyện tập/)).toBeInTheDocument();
  });

  it("A7: loads French memory separately from English memory", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY, targetLanguage: "fr", memoryKey: "ai-tutor:fr" });
    render(<AiTutorPage />);
    await waitFor(() => expect(getMemorySummary).toHaveBeenCalledWith("ai-tutor", "fr"));
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toHaveTextContent("FR"));
  });

  it("A7: does not display English-only memory on French target", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    getMemorySummary.mockResolvedValue({
      ...POPULATED_SUMMARY,
      targetLanguage: "fr",
      memoryKey: "ai-tutor:fr",
      strongestTopic: "gender-agreement",
      topicNeedingReview: "articles-fr",
      lastPracticedTopic: "gender-agreement",
      suggestedNextFocus: "articles-fr",
    });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByText(/Mạnh nhất: gender-agreement/)).toBeInTheDocument());
    expect(screen.queryByText(/Mạnh nhất: present-simple/)).not.toBeInTheDocument();
  });

  it("M3: shows strongest topic chip", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByText(/Mạnh nhất: present-simple/)).toBeInTheDocument());
  });

  it("M3: shows topic needing review chip", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByText(/Cần ôn: past-tense/)).toBeInTheDocument());
  });

  it("M3: shows last practiced topic chip", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByText(/Gần nhất: articles/)).toBeInTheDocument());
  });

  it("M3: shows suggested next focus", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByText(/Gợi ý tiếp theo: past-tense/)).toBeInTheDocument());
  });

  it("M3: shows empty memory state when no corrections", async () => {
    getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByText(/Chưa có lịch sử sửa câu/)).toBeInTheDocument();
  });

  it("M3: reminder card hidden when memory not yet loaded", () => {
    getMemorySummary.mockReturnValue(new Promise(() => {}));
    render(<AiTutorPage />);
    expect(screen.queryByTestId("ai-tutor-memory-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-memory-empty")).not.toBeInTheDocument();
  });

  // ── Greeting tests ──────────────────────────────────────────────
  it("greeting shows nickname when user has one", async () => {
    const { useAuth } = await import("@/providers/AuthProvider");
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { user_metadata: { nickname: "Mai" } },
      isLoading: false,
    });
    render(<AiTutorPage />);
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-greeting")).toHaveTextContent("Chào Mai");
    });
  });

  it("greeting shows fallback when user has no nickname", async () => {
    const { useAuth } = await import("@/providers/AuthProvider");
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { user_metadata: {} },
      isLoading: false,
    });
    render(<AiTutorPage />);
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-greeting")).toHaveTextContent("Chào bạn");
    });
  });

  it("greeting never shows email", async () => {
    const { useAuth } = await import("@/providers/AuthProvider");
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { email: "test@mercyblade.com", user_metadata: { nickname: "Lan" } },
      isLoading: false,
    });
    render(<AiTutorPage />);
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-greeting")).toHaveTextContent("Chào Lan");
      expect(screen.getByTestId("ai-tutor-greeting")).not.toHaveTextContent("test@mercyblade.com");
    });
  });
});
