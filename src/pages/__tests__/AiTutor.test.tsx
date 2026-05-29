// src/pages/__tests__/AiTutor.test.tsx
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AiTutorPage from "../AiTutor";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import {
  getLearningEvents,
  getLearningEventsStorageKey,
  recordLearningEvent,
} from "@/lib/tutor/learningEvents";
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

const {
  putCorrection,
  getMemorySummary,
  markPracticed,
  fetchCloudTtsUrl,
  isPlacementEntryRouteAvailable,
} = vi.hoisted(() => {
  type CloudTtsArgs = { text: string; language: "en" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | "vi"; voiceIdOverride?: string };
  type CloudTtsResult = { audioUrl: string; cached: boolean };
  return {
    putCorrection: vi.fn(async () => {}),
    getMemorySummary: vi.fn(async () => ({ ...EMPTY_SUMMARY })),
    markPracticed: vi.fn(async () => {}),
    fetchCloudTtsUrl: vi.fn(async (_args: CloudTtsArgs): Promise<CloudTtsResult | null> => null),
    isPlacementEntryRouteAvailable: vi.fn(() => false),
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

vi.mock("@/lib/placement/availability", () => ({
  isPlacementEntryRouteAvailable,
}));

beforeEach(() => {
  vi.clearAllMocks();
  MockSpeechRecognition.last = null;
  window.localStorage.clear();
  window.history.pushState({}, "", "/ai-tutor");
  window.localStorage.setItem("mercyblade.lessonUiLang", "vi");
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
  getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
  fetchCloudTtsUrl.mockResolvedValue(null);
  isPlacementEntryRouteAvailable.mockReturnValue(false);
  MockAudioElement.last = null;
});

describe("AiTutor mock UI", () => {
  it("renders the clean Teacher Mercy shell without a mock badge", () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-shell")).toBeInTheDocument();
    expect(screen.queryByText("Mock")).not.toBeInTheDocument();
  });

  it("guards the clean four-mode Teacher Mercy AI Tutor foundation", async () => {
    render(<AiTutorPage />);

    const shell = screen.getByTestId("ai-tutor-shell");
    expect(shell).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-mercy-avatar")).toHaveAttribute("src", "/teacher-mercy.webp");
    expect(screen.getByRole("heading", { name: "Sửa tiếng Anh với Mercy" })).toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-mode-tabs")).toBeInTheDocument();
    const tabs = screen.getByTestId("teacher-mercy-mode-tabs");
    expect(within(tabs).getByRole("button", { name: "Lộ trình" })).toBeInTheDocument();
    expect(within(tabs).getByRole("button", { name: "Sửa câu" })).toHaveAttribute("aria-pressed", "true");
    expect(within(tabs).getByRole("button", { name: "Luyện nói" })).toBeInTheDocument();
    expect(within(tabs).getByRole("button", { name: "Logic" })).toBeInTheDocument();
    expect(screen.getByText(/Không lưu âm thanh thô hoặc toàn bộ transcript/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());

    expect(shell).not.toHaveTextContent(/\bMock\b/i);
    expect(shell).not.toHaveTextContent(/mock-only|local mock|demo tutor/i);
    expect(shell).not.toHaveTextContent(/\bAdult\b|adult learner/i);
  });

  it("puts mode tabs and Grammar input before dashboard cards", async () => {
    render(<AiTutorPage />);

    const todayLesson = await screen.findByTestId("ai-tutor-today-lesson");
    const modeTabs = screen.getByTestId("teacher-mercy-mode-tabs");
    const grammarPanel = screen.getByTestId("ai-tutor-layout");

    expect(todayLesson).toHaveTextContent("Bài hôm nay");
    expect(todayLesson).toHaveTextContent("6 phút");
    expect(screen.getByRole("button", { name: "Bắt đầu" })).toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-placement-cta")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-momentum-card")).not.toBeInTheDocument();
    expect(modeTabs.compareDocumentPosition(grammarPanel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(grammarPanel.compareDocumentPosition(todayLesson) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows the placement CTA only when the placement route is available", async () => {
    isPlacementEntryRouteAvailable.mockReturnValue(true);

    render(<AiTutorPage />);

    await screen.findByTestId("ai-tutor-today-lesson");
    expect(screen.getByTestId("ai-tutor-placement-cta")).toHaveAttribute("href", "/placement");
    expect(screen.getByText("Bạn mới học?")).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("ai-tutor-placement-cta"));

    expect(getLearningEvents({ eventType: "placement_cta_clicked" })).toEqual([
      expect.objectContaining({
        eventType: "placement_cta_clicked",
        product: "ai_tutor",
        targetLanguage: "en",
        safeTopicTag: "placement",
      }),
    ]);
  });

  it("starts the recommended Today Lesson mode from the dashboard", async () => {
    getMemorySummary.mockResolvedValue({
      ...POPULATED_SUMMARY,
      topicNeedingReview: "pronunciation",
      suggestedNextFocus: "pronunciation",
      needsReview: ["pronunciation"],
      confidenceTrend: "improving",
    });
    render(<AiTutorPage />);

    await screen.findByTestId("ai-tutor-today-lesson");
    await userEvent.click(screen.getByRole("button", { name: "Bắt đầu" }));

    expect(within(screen.getByTestId("teacher-mercy-mode-tabs")).getByRole("button", { name: "Luyện nói" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("ai-tutor-conversation")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-lesson-loop")).toHaveTextContent("Bài hôm nay · Luyện nói");
    expect(screen.getByTestId("ai-tutor-lesson-loop")).toHaveTextContent("Gợi ý: Type one clean EN sentence about pronunciation");
    expect(screen.getByTestId("ai-tutor-lesson-loop")).toHaveTextContent("Ôn tiếp: pronunciation");
    expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Bước 1");
    expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Thử lại 0");
    expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Đã xong 0");
    expect(window.localStorage.getItem("mercy.studySession.v1.ai-tutor.en")).toContain("pronunciation");
    expect(getLearningEvents()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        eventType: "lesson_started",
        product: "ai_tutor",
        targetLanguage: "en",
        mode: "speak",
        safeTopicTag: "pronunciation",
      }),
      expect.objectContaining({
        eventType: "next_focus_viewed",
        product: "ai_tutor",
        targetLanguage: "en",
        mode: "speak",
        safeTopicTag: "pronunciation",
      }),
    ]));
  });

  it("shows safe local Study OS momentum signals from local learning events", async () => {
    const now = Date.now() - 1000;
    recordLearningEvent({
      eventType: "lesson_completed",
      product: "ai_tutor",
      targetLanguage: "en",
      mode: "grammar",
      timestamp: now,
      count: 7,
      learnerText: "I buy a private ticket yesterday.",
      correctedText: "I bought a private ticket yesterday.",
      transcript: "full transcript",
      audioBlob: "raw audio",
      jwt: "secret-token",
    } as Parameters<typeof recordLearningEvent>[0] & Record<string, unknown>);
    recordLearningEvent({
      eventType: "mistake_retried",
      product: "ai_tutor",
      targetLanguage: "en",
      mode: "grammar",
      timestamp: now + 1,
      count: 2,
    });
    recordLearningEvent({
      eventType: "logic_insight_viewed",
      product: "ai_tutor",
      targetLanguage: "en",
      mode: "logic",
      timestamp: now + 2,
    });
    recordLearningEvent({
      eventType: "next_focus_viewed",
      product: "ai_tutor",
      targetLanguage: "en",
      mode: "logic",
      timestamp: now + 3,
    });

    render(<AiTutorPage />);

    const todayLesson = await screen.findByTestId("ai-tutor-today-lesson");
    const momentum = await screen.findByTestId("ai-tutor-momentum-card");

    expect(momentum).toHaveAccessibleName("Tiến bộ hôm nay");
    expect(momentum).toHaveTextContent("Hôm nay: 1 bài · 2 lần luyện lại");
    expect(momentum).toHaveTextContent("1");
    expect(momentum).toHaveTextContent("bài xong");
    expect(momentum).toHaveTextContent("2");
    expect(momentum).toHaveTextContent("luyện lại");
    expect(momentum).toHaveTextContent("1 lần");
    expect(momentum).toHaveTextContent("logic");
    expect(momentum).toHaveTextContent("ôn tiếp");
    expect(momentum).toHaveTextContent("Chế độ");
    expect(momentum).toHaveTextContent("Sửa câu 2");
    expect(momentum).toHaveTextContent("Logic 2");
    expect(todayLesson.compareDocumentPosition(momentum) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(momentum).not.toHaveTextContent("I buy a private ticket");
    expect(momentum).not.toHaveTextContent("I bought a private ticket");
    expect(momentum).not.toHaveTextContent("full transcript");
    expect(momentum).not.toHaveTextContent("raw audio");
    expect(momentum).not.toHaveTextContent("secret-token");
    expect(momentum).not.toHaveTextContent(/you should|streak|shame|score/i);
  });

  it("keeps Kids-only local events out of the AI Tutor momentum card", async () => {
    recordLearningEvent({
      eventType: "kids_picture_selected",
      product: "mercy_kids",
      targetLanguage: "en",
      safeTopicTag: "apple",
    });
    recordLearningEvent({
      eventType: "kids_speak_clicked",
      product: "mercy_kids",
      targetLanguage: "en",
      safeTopicTag: "apple",
    });

    render(<AiTutorPage />);

    await screen.findByTestId("ai-tutor-today-lesson");
    expect(screen.queryByTestId("ai-tutor-momentum-card")).not.toBeInTheDocument();
  });

  it("resumes a saved Today Lesson session and can restart it safely", async () => {
    window.localStorage.setItem("mercy.studySession.v1.ai-tutor.en", JSON.stringify({
      product: "ai-tutor",
      targetLanguage: "en",
      currentStep: 3,
      retryCount: 1,
      completedPromptsCount: 2,
      lastSafeTopicTag: "yesterday-present",
      suggestedNextFocus: "past-tense",
      recommendedMode: "grammar",
      updatedAt: 12345,
    }));

    render(<AiTutorPage />);

    const loop = await screen.findByTestId("ai-tutor-lesson-loop");
    expect(loop).toHaveTextContent("Tiếp tục bài hôm nay · Sửa câu");
    expect(loop).toHaveTextContent("Mercy đã lưu tiến độ trên máy này.");
    expect(loop).toHaveTextContent("Continue past tense today");
    expect(within(screen.getByTestId("teacher-mercy-mode-tabs")).getByRole("button", { name: "Sửa câu" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Bước 3");
    expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Thử lại 1");
    expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Đã xong 2");
    expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Chủ điểm yesterday-present");
    expect(getLearningEvents({ eventType: "lesson_resumed" })).toEqual([
      expect.objectContaining({
        eventType: "lesson_resumed",
        product: "ai_tutor",
        targetLanguage: "en",
        mode: "grammar",
        safeTopicTag: "yesterday-present",
        count: 2,
        value: 1,
      }),
    ]);

    await userEvent.click(screen.getByRole("button", { name: "Tiếp tục" }));
    expect(window.localStorage.getItem("mercy.studySession.v1.ai-tutor.en")).toContain("\"currentStep\":3");

    await userEvent.click(screen.getByRole("button", { name: "Làm lại bài" }));
    expect(window.localStorage.getItem("mercy.studySession.v1.ai-tutor.en")).toBeNull();
    expect(screen.queryByTestId("ai-tutor-lesson-loop")).not.toBeInTheDocument();
    expect(getLearningEvents({ eventType: "lesson_restarted" })).toEqual([
      expect.objectContaining({
        eventType: "lesson_restarted",
        product: "ai_tutor",
        targetLanguage: "en",
        mode: "grammar",
        safeTopicTag: "yesterday-present",
        count: 2,
        value: 1,
      }),
    ]);
  });

  it("guides Today's Lesson through prompt, feedback, retry, logic insight, and next focus", async () => {
    getMemorySummary.mockResolvedValue({
      ...POPULATED_SUMMARY,
      topicNeedingReview: "past tense",
      suggestedNextFocus: "past tense",
      needsReview: ["past tense"],
      commonMistakePatterns: ["past tense"],
      confidenceTrend: "needs-review",
    });
    render(<AiTutorPage />);

    await screen.findByTestId("ai-tutor-today-lesson");
    await userEvent.click(screen.getByRole("button", { name: "Bắt đầu" }));

    const loop = screen.getByTestId("ai-tutor-lesson-loop");
    expect(loop).toHaveTextContent("Bài hôm nay · Sửa câu");
    expect(loop).toHaveTextContent("Gợi ý: Write one sentence about yesterday");
    expect(loop).toHaveTextContent("Ôn tiếp: past tense");

    await userEvent.type(screen.getByRole("textbox"), "I buy a hat yesterday.");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));

    await waitFor(() => {
      expect(screen.getByText("I bought a hat yesterday.")).toBeInTheDocument();
      expect(loop).toHaveTextContent("2. Xem Mercy sửa");
      expect(loop).toHaveTextContent("Thử lại:");
      expect(loop).toHaveTextContent("Gợi ý logic: Yesterday points to the past");
      expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Bước 2");
      expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Đã xong 1");
    });

    const persistedAfterPrompt = window.localStorage.getItem("mercy.studySession.v1.ai-tutor.en") ?? "";
    expect(persistedAfterPrompt).toContain("yesterday-present");
    expect(persistedAfterPrompt).not.toContain("I buy a hat yesterday");
    expect(getLearningEvents()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        eventType: "logic_insight_viewed",
        product: "ai_tutor",
        targetLanguage: "en",
        mode: "grammar",
        safeTopicTag: "yesterday-present",
      }),
    ]));

    const textareas = screen.getAllByRole("textbox");
    await userEvent.type(textareas[1], "I bought a hat yesterday.");
    await userEvent.click(screen.getByRole("button", { name: /Gửi câu trả lời/ }));

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Bước 3");
      expect(screen.getByTestId("ai-tutor-study-session-state")).toHaveTextContent("Thử lại 1");
    });

    expect(getLearningEvents()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        eventType: "mistake_retried",
        product: "ai_tutor",
        targetLanguage: "en",
        mode: "grammar",
        safeTopicTag: "past-tense",
        count: 1,
      }),
      expect.objectContaining({
        eventType: "lesson_completed",
        product: "ai_tutor",
        targetLanguage: "en",
        mode: "grammar",
        safeTopicTag: "past-tense",
        count: 1,
        value: 1,
      }),
    ]));
    const serializedEvents = window.localStorage.getItem(getLearningEventsStorageKey()) ?? "";
    expect(serializedEvents).not.toContain("I buy a hat yesterday");
    expect(serializedEvents).not.toContain("I bought a hat yesterday");
    expect(serializedEvents).not.toContain("transcript");
    expect(serializedEvents).not.toContain("audio");
  });

  it("records safe mode_selected events for AI Tutor mode tabs", async () => {
    render(<AiTutorPage />);
    await screen.findByTestId("ai-tutor-today-lesson");

    await userEvent.click(screen.getByRole("button", { name: "Logic" }));

    expect(getLearningEvents({ eventType: "mode_selected" })).toEqual([
      expect.objectContaining({
        eventType: "mode_selected",
        product: "ai_tutor",
        targetLanguage: "en",
        mode: "logic",
      }),
    ]);
  });

  it("keeps Teacher Mercy avatar and header visible after memory loads", async () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-mercy-avatar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Sửa tiếng Anh với Mercy/ })).toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-mode-tabs")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lộ trình" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sửa câu" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Luyện nói" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logic" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByTestId("ai-tutor-mercy-avatar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Sửa tiếng Anh với Mercy/ })).toBeInTheDocument();
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
      expect(screen.getByTestId("ai-tutor-voice-draft")).toHaveTextContent("tôi buồn vì mất cái xe đạp");
    });
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("keeps Grammar STT as an explicit voice draft instead of appending to typed text", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.type(screen.getByRole("textbox"), "I buy a hat yesterday.");
    await userEvent.click(screen.getByRole("button", { name: /Nói câu của bạn/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("can I buy I had this today");
      MockSpeechRecognition.last?.stop();
    });

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-voice-draft")).toHaveTextContent("can I buy I had this today");
    });
    expect(screen.getByRole("textbox")).toHaveValue("I buy a hat yesterday.");
  });

  it("uses Grammar voice draft only after explicit user action", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: /Nói câu của bạn/ }));
    act(() => {
      MockSpeechRecognition.last?.emitInterimTranscript("tôi buồn vì mất cái xe đạp");
      MockSpeechRecognition.last?.emitInterimTranscript("tôi buồn vì mất cái xe đạp tôi buồn vì mất cái xe đạp");
    });

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-voice-draft")).toHaveTextContent("tôi buồn vì mất cái xe đạp");
    });
    expect(screen.getByRole("textbox")).toHaveValue("");

    await userEvent.click(screen.getByRole("button", { name: "Use this text" }));

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("tôi buồn vì mất cái xe đạp");
    });
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value.length).toBeLessThan(500);
  });

  it("collapses noisy repeated Vietnamese STT in the Grammar voice draft", async () => {
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
      expect(screen.getByTestId("ai-tutor-voice-draft")).toHaveTextContent("tôi buồn vì mất cái xe đạp");
    });
  });

  it("keeps Vietnamese UI with French target copy after hydration", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);
    expect(screen.getByRole("heading", { name: /Gia sư tiếng Pháp/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    await waitFor(() => expect(getMemorySummary).toHaveBeenCalledWith("ai-tutor", "fr"));
    expect(screen.getAllByText(/Gõ một câu tiếng Pháp/).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/gõ câu tiếng Pháp/)).toBeInTheDocument();
    expect(screen.getByText("Câu tiếng Pháp của bạn")).toBeInTheDocument();
    expect(screen.queryByText(/Write an English sentence/i)).not.toBeInTheDocument();
  });

  it("keeps Vietnamese UI with Chinese target copy after hydration", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=zh");
    render(<AiTutorPage />);
    expect(screen.getByRole("heading", { name: /Gia sư tiếng Trung/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    await waitFor(() => expect(getMemorySummary).toHaveBeenCalledWith("ai-tutor", "zh"));
    expect(screen.getAllByText(/Gõ một câu tiếng Trung/).length).toBeGreaterThan(0);
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

    await userEvent.click(screen.getByRole("button", { name: "Lộ trình" }));

    expect(screen.getByTestId("ai-tutor-conversation")).toBeInTheDocument();
    expect(screen.getByText("Mercy hỏi · Bạn trả lời")).toBeInTheDocument();
    expect(screen.getByText("Qu'est-ce que tu fais le matin ?")).toBeInTheDocument();
  });

  it("starts Conversation mode in Chinese when target=zh", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=zh");
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: "Lộ trình" }));

    expect(screen.getByText("你早上通常做什么？")).toBeInTheDocument();
  });

  it("keeps Logic mode explanation-only with no mic, speaker, or voice fallback UI", async () => {
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
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;

    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Logic" }));

    expect(screen.getByRole("heading", { name: "Giải thích logic tiếng Anh" })).toBeInTheDocument();
    expect(
      screen.getByText("Mercy giúp bạn hiểu vì sao tiếng Anh nói như vậy, để tránh dịch từng chữ từ tiếng Việt."),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Vì sao nói “I’m interested in English” mà không nói “I’m interesting in English”?")).toBeInTheDocument();
    });

    expect(screen.queryByText("What do you usually do in the morning?")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Mercy đọc|Read corrected sentence|Stop Mercy voice|Dừng đọc/ })).not.toBeInTheDocument();
    expect(screen.queryByText("Mercy voice unavailable. Using device voice.")).not.toBeInTheDocument();
    expect(screen.queryByText("Device voice fallback")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Nói câu của bạn/ })).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-conversation-mic-fallback")).not.toBeInTheDocument();

    await userEvent.type(
      screen.getByRole("textbox"),
      "I am interesting in English.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Giải thích logic" }));

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-logic-diagnosis")).toBeInTheDocument();
      expect(screen.getByText("Natural correction")).toBeInTheDocument();
      expect(screen.getByText("I am interested in English.")).toBeInTheDocument();
      expect(screen.getByText("Vietnamese-thinking cause")).toBeInTheDocument();
      expect(screen.getByText("Vietnamese often uses one feeling idea without changing the adjective form.")).toBeInTheDocument();
      expect(screen.getByText("English logic")).toBeInTheDocument();
      expect(screen.getByText("Interested describes your feeling; interesting describes the thing.")).toBeInTheDocument();
      expect(screen.getByText("Remember rule")).toBeInTheDocument();
      expect(screen.getByText("Use interested for the person who feels it; use interesting for the thing.")).toBeInTheDocument();
      expect(screen.getByText("Write one sentence with I am interested in + a topic.")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: /Mercy đọc|Read corrected sentence|Stop Mercy voice|Dừng đọc/ })).not.toBeInTheDocument();
    expect(screen.queryByText("Device voice fallback")).not.toBeInTheDocument();
    expect(speak).not.toHaveBeenCalled();
  });

  it("shows a safe Logic fallback when no Vietlish pattern matches", async () => {
    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Logic" }));

    await userEvent.type(screen.getByRole("textbox"), "This sentence is not in the beginner list.");
    await userEvent.click(screen.getByRole("button", { name: "Giải thích logic" }));

    await waitFor(() => {
      expect(screen.getByText(
        "Mercy can still explain the English logic. Try a common sentence like: I go school.",
      )).toBeInTheDocument();
      expect(screen.getByText("Try rewriting the sentence with one clear subject, verb, and time marker.")).toBeInTheDocument();
      expect(screen.getByText("English usually needs the relationship to be visible in the sentence.")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: /Mercy đọc|Read corrected sentence|Stop Mercy voice|Dừng đọc/ })).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-conversation-mic-fallback")).not.toBeInTheDocument();
  });

  it("sends a typed Conversation reply and shows correction plus one next question", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);

    await userEvent.click(screen.getByRole("button", { name: "Lộ trình" }));
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
    await userEvent.click(screen.getByRole("button", { name: "Lộ trình" }));
    await userEvent.click(screen.getByRole("button", { name: /Nói câu của bạn/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("I drink coffee");
      MockSpeechRecognition.last?.stop();
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue("I drink coffee");
    });

    await userEvent.click(screen.getByRole("button", { name: "Sửa câu" }));
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
    await userEvent.click(screen.getByRole("button", { name: "Lộ trình" }));

    const speakerButtons = screen.getAllByRole("button", { name: /Mercy đọc/ });
    await userEvent.click(speakerButtons[0]);

    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toContain("你早上通常做什么？");
    expect(utterance.lang).toBe("zh-CN");
  });

  it("starter question speaker reads only the clean question", async () => {
    const speak = vi.fn();
    fetchCloudTtsUrl.mockResolvedValue(null);
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

    window.localStorage.setItem("mercyblade.lessonUiLang", "en");
    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Journey" }));

    await userEvent.click(screen.getAllByRole("button", { name: /Read corrected sentence|Mercy đọc câu/ })[0]);

    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toBe("What do you usually do in the morning?");
    expect(utterance.text).not.toMatch(/Teacher Mercy|Natural reply|Câu trả lời tự nhiên|Giải thích/);
  });

  it("Speak speaker reads only the current assistant utterance after a learner answer", async () => {
    const speak = vi.fn();
    fetchCloudTtsUrl.mockResolvedValue(null);
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

    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Luyện nói" }));
    await userEvent.type(screen.getByRole("textbox"), "I drink coffee");
    await userEvent.click(within(screen.getByTestId("ai-tutor-conversation")).getByRole("button", { name: /Luyện nói|Send/ }));

    await waitFor(() => {
      expect(screen.getByText("Nice. That sounds like a clear morning routine.")).toBeInTheDocument();
      expect(screen.getByText("What do you do after that?")).toBeInTheDocument();
    });

    const speakerButtons = screen.getAllByRole("button", { name: /Mercy đọc/ });
    await userEvent.click(speakerButtons[speakerButtons.length - 1]);

    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toBe("Nice. That sounds like a clear morning routine. What do you do after that?");
    expect(utterance.text).not.toContain("What do you usually do in the morning?");
    expect(utterance.text).not.toContain("I drink coffee");
  });

  it("device fallback receives only the current Speak assistant utterance", async () => {
    const speak = vi.fn();
    fetchCloudTtsUrl.mockResolvedValue(null);
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

    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Luyện nói" }));
    await userEvent.type(screen.getByRole("textbox"), "I went to the market and buy food");
    await userEvent.click(within(screen.getByTestId("ai-tutor-conversation")).getByRole("button", { name: /Luyện nói|Send/ }));

    await waitFor(() => expect(screen.getByText("What do you do after that?")).toBeInTheDocument());

    const speakerButtons = screen.getAllByRole("button", { name: /Mercy đọc/ });
    await userEvent.click(speakerButtons[speakerButtons.length - 1]);

    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toBe("Nice. That sounds like a clear morning routine. What do you do after that?");
    expect(fetchCloudTtsUrl).toHaveBeenCalledWith(expect.objectContaining({
      text: "Nice. That sounds like a clear morning routine. What do you do after that?",
      language: "en",
    }));
    expect(utterance.text).not.toContain("I went to the market and buy food");
  });

  it("Speak does not explain a you-question as third-person singular", async () => {
    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Luyện nói" }));
    await userEvent.type(screen.getByRole("textbox"), "What do you usually do in the morning?");
    await userEvent.click(within(screen.getByTestId("ai-tutor-conversation")).getByRole("button", { name: /Luyện nói|Send/ }));

    await waitFor(() => expect(screen.getByText("What do you do after that?")).toBeInTheDocument());
    expect(screen.queryByText(/ngôi thứ ba số ít|she\/he\/it|third-person singular/i)).not.toBeInTheDocument();
  });

  it("Speak flags mixed tense without third-person singular explanation", async () => {
    render(<AiTutorPage />);
    await userEvent.click(screen.getByRole("button", { name: "Luyện nói" }));
    await userEvent.type(screen.getByRole("textbox"), "I went to the market and buy food");
    await userEvent.click(within(screen.getByTestId("ai-tutor-conversation")).getByRole("button", { name: /Luyện nói|Send/ }));

    await waitFor(() => {
      expect(screen.getByText(/giữ cùng một mốc thời gian/i)).toBeInTheDocument();
      expect(screen.getByText("What do you do after that?")).toBeInTheDocument();
    });
    expect(screen.queryByText(/ngôi thứ ba số ít|she\/he\/it|third-person singular/i)).not.toBeInTheDocument();
  });

  it.each([
    ["de", /Gia sư tiếng Đức/, /Gõ một câu tiếng Đức/, /gõ câu tiếng Đức/],
    ["ja", /Gia sư tiếng Nhật/, /Gõ một câu tiếng Nhật/, /gõ câu tiếng Nhật/],
    ["ko", /Gia sư tiếng Hàn/, /Gõ một câu tiếng Hàn/, /gõ câu tiếng Hàn/],
    ["es", /Gia sư tiếng Tây Ban Nha/, /Gõ một câu tiếng Tây Ban Nha/, /type your Spanish sentence/],
    ["vi", /Gia sư tiếng Việt/, /Gõ một câu tiếng Việt/, /gõ câu tiếng Việt/],
  ])("keeps %s target copy after hydration", async (target, heading, helper, placeholder) => {
    window.history.pushState({}, "", `/ai-tutor?target=${target}`);
    render(<AiTutorPage />);
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getAllByText(helper).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it("defaults to floating-safe layout until the container is measured wide", () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-shell")).toHaveAttribute("data-floating-shell", "true");
  });

  it("shows empty state before first submit", () => {
    render(<AiTutorPage />);
    expect(screen.getByText(/Sẵn sàng sửa câu/)).toBeInTheDocument();
  });

  it("shows button disabled with empty input", () => {
    render(<AiTutorPage />);
    expect(screen.getByRole("button", { name: /Sửa câu này/ })).toBeDisabled();
  });

  it("enables button when input has text", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    expect(screen.getByRole("button", { name: /Sửa câu này/ })).toBeEnabled();
  });

  it("shows loading state after submit", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    expect(screen.getByText(/Mercy đang sửa/)).toBeInTheDocument();
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

  it("explains yesterday past-tense correction without third-person singular copy", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "I buy a hat yesterday.");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));

    await waitFor(() => {
      expect(screen.getByText("I bought a hat yesterday.")).toBeInTheDocument();
      expect(screen.getByText(/Khi nói về việc đã xảy ra.*quá khứ/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/ngôi thứ ba số ít|she\/he\/it|third-person singular/i)).not.toBeInTheDocument();
  });

  it("does not turn a noisy mixed transcript into a fluent wrong correction", async () => {
    render(<AiTutorPage />);
    await userEvent.type(
      screen.getByRole("textbox"),
      "I buy a hat yesterday. can I buy I had this today",
    );
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));

    await waitFor(() => {
      expect(screen.getByText("I bought a hat yesterday.")).toBeInTheDocument();
      expect(screen.getByText(/transcript bị nhiễu|noisy transcript/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/can I bought I had this today/i)).not.toBeInTheDocument();
  });

  it("repairs run-on punctuation and speaker reads only natural corrected text", async () => {
    const speak = vi.fn();
    fetchCloudTtsUrl.mockResolvedValue(null);
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

    render(<AiTutorPage />);
    await userEvent.type(
      screen.getByRole("textbox"),
      "what do you usually do in the morning nice that sounds like a clear morning routine what do you do after that",
    );
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    const corrected = "What do you usually do in the morning? Nice, that sounds like a clear morning routine. What do you do after that?";
    await waitFor(() => expect(screen.getByText(corrected)).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /Mercy đọc/ }));

    await waitFor(() => expect(speak).toHaveBeenCalledTimes(1));
    const utterance = speak.mock.calls[0][0] as MockSpeechSynthesisUtterance;
    expect(utterance.text).toBe(corrected);
    expect(utterance.text).not.toMatch(/Teacher Mercy|Câu đã sửa|Giải thích|what do you usually do in the morning nice/);
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
      language: "fr",
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
    await userEvent.click(screen.getByRole("button", { name: "Lộ trình" }));
    await userEvent.type(screen.getByRole("textbox"), "Je suis aller au marché");
    await userEvent.click(screen.getByRole("button", { name: /Send|Gửi/ }));
    await waitFor(() => expect(screen.getByText("Je suis allé au marché.")).toBeInTheDocument());

    const speakerButtons = screen.getAllByRole("button", { name: /Mercy đọc/ });
    await userEvent.click(speakerButtons[speakerButtons.length - 1]);

    await waitFor(() => expect(browserSpeak).toHaveBeenCalledTimes(1));
    expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: expect.stringContaining("Qu'est-ce que tu fais après ça ?"),
      language: "fr",
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
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
  });

  it("submit practice shows mock feedback", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
    const textareas = screen.getAllByRole("textbox");
    await userEvent.type(textareas[1], "my practice answer");
    await userEvent.click(screen.getByRole("button", { name: /Gửi câu trả lời/ }));
    await waitFor(() => expect(screen.getByText(/Nhận xét/)).toBeInTheDocument());
  });

  it("reset clears correction and practice state", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /Làm mới/ }));
    expect(screen.getByText(/Sẵn sàng sửa câu/)).toBeInTheDocument();
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
    await waitFor(() => expect(screen.getByTestId("ai-tutor-today-lesson")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-card")).toBeInTheDocument());
    expect(screen.getByTestId("ai-tutor-today-lesson")).toHaveTextContent(/Bài hôm nay/i);
    expect(screen.getByText(/6 câu đã sửa/)).toBeInTheDocument();
    expect(screen.getByText(/4 đã luyện/)).toBeInTheDocument();
  });

  it("M3: shows safe Progress / Mastery summary signals", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);

    const progressCard = await screen.findByTestId("ai-tutor-memory-card");

    expect(progressCard).toHaveTextContent("Tiến bộ: 67%");
    expect(progressCard).toHaveTextContent("67%");
    expect(progressCard).toHaveTextContent("Mạnh: present-simple");
    expect(progressCard).toHaveTextContent("Cần ôn: past-tense");
    expect(progressCard).toHaveTextContent("Lỗi hay gặp: past-tense");
    expect(progressCard).toHaveTextContent("Ôn tiếp: past-tense");
    expect(screen.getByTestId("ai-tutor-progress-meter")).toHaveAttribute("aria-label", "Progress 67%");
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
    await waitFor(() => expect(screen.getByText(/Mạnh: gender-agreement/)).toBeInTheDocument());
    expect(screen.queryByText(/Mạnh: present-simple/)).not.toBeInTheDocument();
  });

  it("M3: shows strongest topic chip", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByText(/Mạnh: present-simple/)).toBeInTheDocument());
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
    await waitFor(() => expect(screen.getByText(/Ôn tiếp: past-tense/)).toBeInTheDocument());
  });

  it("M3: shows empty memory state when no corrections", async () => {
    getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByTestId("ai-tutor-today-lesson")).toBeInTheDocument());
    expect(screen.getByText(/Bài hôm nay/)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByText(/Tiến bộ: chưa có dữ liệu EN/)).toBeInTheDocument();
  });

  it("M3: reminder card hidden when memory not yet loaded", () => {
    getMemorySummary.mockReturnValue(new Promise(() => {}));
    render(<AiTutorPage />);
    expect(screen.queryByTestId("ai-tutor-today-lesson")).not.toBeInTheDocument();
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
