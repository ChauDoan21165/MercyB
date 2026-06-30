import { readFileSync } from "node:fs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AiTutorPage from "../AiTutor";
import { SPEAK_FOLLOW_UP_DEPTH_CAP } from "@/lib/tutor/speakFollowups";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import { hasShownHint } from "@/lib/ai-tutor/detectorHint";
import { readL1RecentTags } from "@/lib/stage-3a/adapters/l1TagAdapter";
import {
  readAndClearPendingReflection,
  writePendingReflection,
} from "@/lib/ai-tutor/teacherMercyHandoff";
import type { SpeechRecognitionLike } from "@/types/speech-recognition";

const AI_TUTOR_TEST_PAIR_PATH = "/ai-tutor?native=vietnamese&target=english";

function seedAiTutorTestPair() {
  window.history.pushState({}, "", AI_TUTOR_TEST_PAIR_PATH);
  window.localStorage.setItem("mercyb:nativeLanguage", "vietnamese");
  window.localStorage.setItem("mercyb:targetLanguage", "english");
  window.localStorage.setItem("mercyb:selectedPair", JSON.stringify({ native: "vietnamese", target: "english" }));
  window.localStorage.setItem("mercyb:languagePair", JSON.stringify({ native: "vietnamese", target: "english" }));
  window.localStorage.setItem("mercyb:pair", JSON.stringify({ native: "vietnamese", target: "english" }));
}


const FORBIDDEN_STANCE_WORDING = /diagnosis|depressed|anxiety|trauma|therapy|mental health|clinical|disorder/i;
const FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE =
  "Mercy chưa sửa chắc câu này bằng bộ quy tắc hiện tại. Bạn có thể chỉnh lại câu ngắn hơn một chút rồi bấm Sửa câu này nhé.";
const CANNOT_CORRECT_NO_SESSION_MESSAGE =
  "Mercy cần đăng nhập để kiểm tra câu này. Bạn thử đăng nhập nhé.";

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
  fetchServerProfileInput,
  loadServerInterferenceTags,
  useAuthMock,
} = vi.hoisted(() => {
  type CloudTtsArgs = { text: string; language: "en" | "fr" | "zh" | "de" | "ja" | "ko" | "es" | "vi"; voiceIdOverride?: string };
  type CloudTtsResult = { audioUrl: string; cached: boolean; provider?: "azure" | "elevenlabs" };
  type AuthMockValue = {
    user: { id: string; user_metadata?: Record<string, unknown> } | null;
    session: { access_token: string } | null;
    isLoading: boolean;
  };
  return {
    putCorrection: vi.fn(async () => {}),
    getMemorySummary: vi.fn(async () => ({ ...EMPTY_SUMMARY })),
    markPracticed: vi.fn(async () => {}),
    fetchCloudTtsUrl: vi.fn(async (_args: CloudTtsArgs): Promise<CloudTtsResult | null> => null),
    fetchServerProfileInput: vi.fn(async () => ({ interferenceTagCounts: {}, sessionCount: 0 })),
    loadServerInterferenceTags: vi.fn(async () => [] as string[]),
    useAuthMock: vi.fn<() => AuthMockValue>(() => ({ user: null, session: null, isLoading: false })),
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

class MockEndingAudio {
  static last: MockEndingAudio | null = null;
  src = "";
  onplay: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();
  play = vi.fn(async () => {
    this.onplay?.();
    this.onended?.();
  });

  constructor(src?: string) {
    this.src = src ?? "";
    MockEndingAudio.last = this;
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

  emitInterimTranscript(text: string) {
    this.onresult?.({
      resultIndex: 0,
      results: [
        {
          isFinal: false,
          length: 1,
          0: { transcript: text },
        },
      ],
    } as unknown as Parameters<NonNullable<SpeechRecognitionLike["onresult"]>>[0]);
  }
}

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: useAuthMock,
}));

vi.mock("@/lib/ai-tutor/learningMemory", () => ({
  putCorrection,
  getMemorySummary,
  markPracticed,
}));

vi.mock("@/lib/ai-conversation/serverInterferenceMemory", () => ({
  fetchServerProfileInput,
  loadServerInterferenceTags,
  mergeRecallMemory: (serverTags: string[], summary: MemorySummary | null) => {
    const clientTags = summary?.commonMistakePatterns ?? [];
    const interferencePatterns = [...new Set([...serverTags, ...clientTags].filter(Boolean))].slice(0, 3);
    const recentFocus = summary?.lastPracticedTopic || summary?.nextRecommendedFocus || null;
    if (interferencePatterns.length === 0 && !recentFocus) return null;
    return { interferencePatterns, recentFocus };
  },
}));

vi.mock("@/lib/mercyVoice", () => ({
  fetchCloudTtsUrl,
}));

vi.mock("@/lib/placement/availability", () => ({
  isPlacementEntryRouteAvailable: vi.fn(() => false),
}));

function renderAiTutor(): RenderResult {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AiTutorPage />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  MockSpeechRecognition.last = null;
  window.localStorage.clear();
  window.sessionStorage.clear();
  seedAiTutorTestPair();
  window.localStorage.setItem("mercyblade.lessonUiLang", "vi");
  delete window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__;
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
  getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
  fetchServerProfileInput.mockResolvedValue({ interferenceTagCounts: {}, sessionCount: 0 });
  loadServerInterferenceTags.mockResolvedValue([]);
  fetchCloudTtsUrl.mockResolvedValue(null);
  useAuthMock.mockReturnValue({ user: null, session: null, isLoading: false });
  vi.unstubAllGlobals();
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: undefined,
  });
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    configurable: true,
    value: undefined,
  });
  Object.defineProperty(window, "Audio", {
    configurable: true,
    value: undefined,
  });
  MockEndingAudio.last = null;
});

async function correctSentence(input: string, expected: string) {
  await userEvent.type(
    screen.getByRole("textbox"),
    input,
  );
  await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
  await waitFor(() => expect(screen.getByText(expected)).toBeInTheDocument());
}

/** Correction is deferred (shy learner gate), expect the defer message instead. */
async function correctSentenceDeferred(input: string) {
  await userEvent.type(
    screen.getByRole("textbox"),
    input,
  );
  await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
  await waitFor(() =>
    expect(
      screen.getByText("Mercy ghi nhận câu này và sẽ gợi ý sau nhé."),
    ).toBeInTheDocument(),
  );
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

// A realistic single voice attempt: the mic streams interim partials while
// listening, then commits one final transcript on stop. Interim partials must
// NOT each count as a practice round (regression: they inflated turnsOnTopic).
async function speakWithInterims(interims: string[], finalTranscript: string) {
  await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói|Đọc câu thay vì gõ/i }));
  act(() => {
    for (const partial of interims) {
      MockSpeechRecognition.last?.emitInterimTranscript(partial);
    }
    MockSpeechRecognition.last?.emitFinalTranscript(finalTranscript);
    MockSpeechRecognition.last?.stop();
  });
}

// Answer the CURRENT follow-up question by voice, using the mic attached to the
// follow-up block itself (not the model-sentence mic). This is the affordance
// that keeps the conversation moving past the first sentence.
async function answerFollowUpByVoice(transcript: string) {
  const followUp = within(screen.getByTestId("ai-tutor-speak-follow-up"));
  await userEvent.click(
    followUp.getByRole("button", { name: /Trả lời câu hỏi bằng giọng nói|Dừng nghe/i }),
  );
  act(() => {
    MockSpeechRecognition.last?.emitFinalTranscript(transcript);
    MockSpeechRecognition.last?.stop();
  });
}


describe("AiTutor four-tab seed flow", () => {
  it("renders the recommender top result as the first bootstrap lesson card", async () => {
    useAuthMock.mockReturnValue({
      user: { id: "550e8400-e29b-41d4-a716-446655440014" },
      session: { access_token: "test-token" },
      isLoading: false,
    });
    fetchServerProfileInput.mockResolvedValue({
      interferenceTagCounts: {
        "missing-article": 5,
        "tense-omission": 3,
        "subj-verb-agreement": 1,
      },
      sessionCount: 12,
    });

    renderAiTutor();

    const card = await screen.findByTestId("ai-tutor-today-lesson");
    await waitFor(() => {
      expect(within(card).getByTestId("ai-tutor-today-lesson-title")).toHaveTextContent(
        "Master English articles: a, an, and the",
      );
    });
    expect(within(card).getByText(/missing-article/)).toBeInTheDocument();
    expect(fetchServerProfileInput).toHaveBeenCalled();
  });

  it("renders the Teacher Mercy shell with four tabs", () => {
    renderAiTutor();

    expect(screen.getByTestId("ai-tutor-shell")).toBeInTheDocument();
    const tabs = screen.getByTestId("teacher-mercy-mode-tabs");
    expect(within(tabs).getByRole("button", { name: "Lộ trình" })).toBeInTheDocument();
    expect(within(tabs).getByRole("button", { name: "Sửa câu" })).toHaveAttribute("aria-pressed", "true");
    expect(within(tabs).getByRole("button", { name: "Luyện nói" })).toBeInTheDocument();
    expect(within(tabs).getByRole("button", { name: "Logic" })).toBeInTheDocument();
  });

  it("keeps Lộ trình static and links only to Grammar", async () => {
    renderAiTutor();

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
    renderAiTutor();

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
    renderAiTutor();

    // "She is teacher." is 3 words → classified as shy learner → correction deferred.
    // Use a longer equivalent that triggers the same article-insertion rule.
    await correctSentence("She is teacher here.", "She is a teacher here.");

    const chip = await screen.findByTestId("detector-hint-chip");
    expect(chip).toHaveAttribute("data-tag", "vi_l1_missing_article");
    expect(chip).toHaveTextContent("Missing a / an / the");
    expect(recentL1Tags()).toEqual(["vi_l1_missing_article"]);
  });

  it("shows a Step 5 plural omission hint in Correction", async () => {
    renderAiTutor();

    await correctSentence("I have two book.", "I have two books.");

    const chip = await screen.findByTestId("detector-hint-chip");
    expect(chip).toHaveAttribute("data-tag", "vi_l1_plural_s");
    expect(chip).toHaveTextContent("Plural -s");
    expect(recentL1Tags()).toEqual(["vi_l1_plural_s"]);
  });

  it("keeps the existing past-tense omission hint in Correction", async () => {
    renderAiTutor();

    await correctHatSentence();

    const chip = await screen.findByTestId("detector-hint-chip");
    expect(chip).toHaveAttribute("data-tag", "vi_l1_past_ed");
    expect(chip).toHaveTextContent("Past tense -ed");
    expect(recentL1Tags()).toEqual(["vi_l1_past_ed"]);
  });

  it("does not show a Step 5 hint for safe Correction input", async () => {
    renderAiTutor();

    // Unchanged (already-correct) sentences without a session show an honest
    // message instead of a correction card. No L1 error tag → no detector hint.
    await userEvent.type(
      screen.getByRole("textbox"),
      "Where did you go yesterday",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    // The unchanged path shows either CANNOT_CORRECT or FRIENDLY_CORRECTION_UNAVAILABLE
    await waitFor(() => {
      const errorSection = document.querySelector(".text-rose-600, .text-rose-700");
      expect(errorSection).toBeTruthy();
    });

    expect(screen.queryByTestId("detector-hint-chip")).not.toBeInTheDocument();
    expect(recentL1Tags()).toEqual([]);
  });

  it("does not record duplicate L1 tags for the same already-shown hint", async () => {
    renderAiTutor();

    // "She is teacher here." is 4 words (normal confidence) — triggers the same
    // article-insertion rule but avoids the shy-learner defer gate.
    await correctSentence("She is teacher here.", "She is a teacher here.");
    expect(await screen.findByTestId("detector-hint-chip")).toHaveAttribute(
      "data-tag",
      "vi_l1_missing_article",
    );
    await waitFor(() => expect(hasShownHint("vi_l1_missing_article")).toBe(true));

    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("She is teacher here.", "She is a teacher here.");

    expect(screen.queryByTestId("detector-hint-chip")).not.toBeInTheDocument();
    expect(recentL1Tags()).toEqual(["vi_l1_missing_article"]);
  });

  it("does not record VN-to-EN L1 tags for non-English Correction targets", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=vi");
    renderAiTutor();

    await correctSentence("She is teacher.", "She is teacher.");

    expect(screen.queryByTestId("detector-hint-chip")).not.toBeInTheDocument();
    expect(recentL1Tags()).toEqual([]);
  });

  it("circles the same L1 weakness with a new-context follow-up, then offers to move on", async () => {
    renderAiTutor();

    // Turn 1 — a high-confidence 3rd-person-s error starts a focus and shows a
    // same-tag follow-up in a NEW context (not the corrected sentence).
    await correctSentence("She go to school every day.", "She goes to school every day.");
    const followUp1 = await screen.findByTestId("ai-tutor-l1-followup");
    expect(followUp1).toHaveTextContent("buổi sáng"); // context #1

    // Next sentence, same weakness → continue the focus with a DIFFERENT context.
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("He work in a bank.", "He works in a bank.");
    const followUp2 = await screen.findByTestId("ai-tutor-l1-followup");
    expect(followUp2).toHaveTextContent("làm nghề"); // context #2
    expect(followUp2).not.toHaveTextContent("buổi sáng"); // never the same context twice

    // Third turn — same SVA weakness, new context. The sticky L1 focus continues.
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("She make a cake here.", "She makes a cake here.");
    const followUp3 = await screen.findByTestId("ai-tutor-l1-followup");
    expect(followUp3).not.toHaveTextContent("buổi sáng");
    expect(followUp3).not.toHaveTextContent("làm nghề");
    // After L1_FOCUS_DEPTH_CAP turns, the fourth SVA error triggers move-on.
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("He make a sandwich there.", "He makes a sandwich there.");
    expect(await screen.findByTestId("ai-tutor-l1-moveon")).toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-l1-followup")).not.toBeInTheDocument();
  });

  it("does not carry L1 focus across a remount (in-session only)", async () => {
    // Focus state lives in a per-mount ref (l1FocusRef), never in storage, so a
    // fresh mount — a new session / page reload — must RESTART the loop, not
    // resume the prior focus. A same-tag error on the second mount must show
    // context #1 again, not the context #2 the first mount had advanced toward.
    const first = renderAiTutor();
    await correctSentence("She go to school every day.", "She goes to school every day.");
    expect(await screen.findByTestId("ai-tutor-l1-followup")).toHaveTextContent("buổi sáng"); // #1

    first.unmount();

    renderAiTutor();
    await correctSentence("She go to school every day.", "She goes to school every day.");
    const afterRemount = await screen.findByTestId("ai-tutor-l1-followup");
    expect(afterRemount).toHaveTextContent("buổi sáng"); // context #1 AGAIN — focus reset
    expect(afterRemount).not.toHaveTextContent("làm nghề"); // did NOT resume at context #2
  });

  it("shows no follow-up for clean (low-confidence) input with no active focus", async () => {
    renderAiTutor();

    // Unchanged (already-correct) sentences without a session trigger an error
    // message — no follow-up or move-on elements appear.
    await userEvent.type(
      screen.getByRole("textbox"),
      "Where did you go yesterday",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    await waitFor(() => {
      const errorSection = document.querySelector(".text-rose-600");
      expect(errorSection).toBeTruthy();
    });

    expect(screen.queryByTestId("ai-tutor-l1-followup")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-l1-moveon")).not.toBeInTheDocument();
  });

  it("does not run the L1 follow-up loop on a non-English Correction target", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=vi");
    renderAiTutor();

    await correctSentence("She go to school every day.", "She go to school every day.");

    expect(screen.queryByTestId("ai-tutor-l1-followup")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-l1-moveon")).not.toBeInTheDocument();
  });

  it("prefills the Correction input from a Teacher Mercy room hand-off and consumes it", () => {
    writePendingReflection({
      roomId: "english_a1_intro",
      roomTitle: "Intro / Giới thiệu",
      keyword: "hello",
      reflectionText: "Today I learn about my family.",
    });

    renderAiTutor();

    // Lands in Correction (grammar) mode with the reflection pre-filled.
    expect(screen.getByRole("textbox")).toHaveValue("Today I learn about my family.");
    // Single-use: the bridge is cleared on mount, so a later mount won't re-prefill.
    expect(readAndClearPendingReflection()).toBeNull();
  });

  it("shows an empty Correction input when there is no Teacher Mercy hand-off", () => {
    renderAiTutor();

    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("keeps L1 focus in-session only — it does not persist across a remount (invariant 5)", async () => {
    // Advance the focus within one session (context #1 → #2), then remount with
    // a fresh component tree. Storage is NOT cleared between the two renders
    // here (beforeEach only runs between tests), so if the loop had been
    // regressed to persist focus cross-session (localStorage/IndexedDB/etc.),
    // the same input would resume at context #2. An in-memory ref must reset on
    // remount and start over at context #1.
    const first = renderAiTutor();
    await correctSentence("She go to school every day.", "She goes to school every day.");
    expect(await screen.findByTestId("ai-tutor-l1-followup")).toHaveTextContent("buổi sáng");
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("He work in a bank.", "He works in a bank.");
    expect(await screen.findByTestId("ai-tutor-l1-followup")).toHaveTextContent("làm nghề");

    first.unmount();

    renderAiTutor();
    await correctSentence("She go to school every day.", "She goes to school every day.");
    // Fresh session → focus restarts at context #1, proving no cross-session write.
    expect(await screen.findByTestId("ai-tutor-l1-followup")).toHaveTextContent("buổi sáng");
  });

  it("commits final Grammar voice transcript into the correction input", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    expect(screen.getByRole("button", { name: "Sửa câu này" })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("She go to school every day.");
      MockSpeechRecognition.last?.stop();
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i })).toHaveValue(
        "She go to school every day",
      );
    });
    expect(screen.queryByTestId("ai-tutor-voice-draft")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sửa câu này" })).toBeEnabled();
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    expect(await screen.findByText("She goes to school every day.")).toBeInTheDocument();
  });

  it("shows friendly copy when the correction engine is unavailable and does not leave listening stuck", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("I run yesterday.");
      MockSpeechRecognition.last?.stop();
    });

    expect(await screen.findByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i })).toHaveValue(
      "I run yesterday",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    expect(await screen.findByText(FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(/Mercy needs the AI correction engine/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Đang nghe giọng của bạn...")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i })).toHaveValue(
      "I run yesterday",
    );
  });

  it("golden unsupported Grammar uncertainty never exposes the engine error to learners", async () => {
    renderAiTutor();

    await userEvent.type(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i }), "I run yesterday.");
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));

    expect(await screen.findByText(FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText("Mercy needs the AI correction engine for this one.")).not.toBeInTheDocument();
  });

  it("clears stale correction errors when Grammar voice input starts", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await userEvent.type(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i }), "I run yesterday.");
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    expect(await screen.findByText(FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói/ }));

    expect(screen.queryByText(FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE)).not.toBeInTheDocument();
  });

  it("shows a voice-specific message when Grammar voice input captures no transcript", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói/ }));
    act(() => {
      MockSpeechRecognition.last?.stop();
    });

    expect(await screen.findByTestId("ai-tutor-voice-message")).toHaveTextContent(
      "Mercy chưa nghe rõ. Bạn thử nói lại hoặc gõ câu vào ô nhé.",
    );
    expect(screen.queryByText("Mercy needs the AI correction engine for this one.")).not.toBeInTheDocument();
  });

  it("reset clears Grammar voice transcript and friendly correction error", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói/ }));
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("I run yesterday.");
      MockSpeechRecognition.last?.stop();
    });
    expect(await screen.findByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i })).toHaveValue(
      "I run yesterday",
    );

    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    expect(await screen.findByText(FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Làm mới" }));

    expect(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i })).toHaveValue("");
    expect(screen.queryByText(FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE)).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-voice-message")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sửa câu này" })).toBeDisabled();
  });

  it("golden reset clears Grammar, Speak, and Logic learner state", async () => {
    renderAiTutor();

    await correctSentence("She go to school every day.", "She goes to school every day.");
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("She goes to school every day.");

    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I had dinner with my family.",
    );
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("What did you eat?");

    await openTab("Logic");
    expect(screen.getByTestId("ai-tutor-logic-mode")).toHaveTextContent("She goes to school every day.");

    await openTab("Sửa câu");
    await userEvent.click(screen.getByRole("button", { name: "Làm mới" }));

    expect(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i })).toHaveValue("");
    expect(screen.queryByText("She goes to school every day.")).not.toBeInTheDocument();

    await openTab("Luyện nói");
    expect(screen.getByTestId("ai-tutor-speak-target")).not.toHaveTextContent("She goes to school every day.");
    expect(screen.queryByTestId("ai-tutor-speak-follow-up")).not.toBeInTheDocument();

    await openTab("Logic");
    expect(screen.getByTestId("ai-tutor-logic-empty-board")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-logic-mode")).not.toHaveTextContent("She goes to school every day.");
  });

  it("moves the corrected sentence from Grammar to Speak and scores the repeated sentence honestly", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("I bought a hat yesterday.");
    await speakCurrentTarget("I bought a hat yesterday.");

    const honestScore = await screen.findByTestId("ai-tutor-speak-score");
    expect(honestScore).toHaveTextContent("Đang nghe, chấm điểm chi tiết sẽ có sau.");
    expect(honestScore).not.toHaveTextContent("Bạn nói giống câu mẫu");
    expect(honestScore.textContent ?? "").not.toMatch(/\d+%/);
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.queryByText(/pronunciation score|phát âm score/i)).not.toBeInTheDocument();
  });

  it("counts a voice attempt with interim transcripts as a SINGLE round (no premature 'another sentence?')", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    // One spoken sentence the mic streams as growing partials over a few seconds,
    // with gaps wider than the 350ms record debounce (as a real browser does).
    // Before the fix, each partial was recorded as its own round, so a single
    // sentence raced to the cap and offered "another sentence?" after one round.
    await userEvent.click(
      screen.getByRole("button", { name: /Nhập bằng giọng nói|Đọc câu thay vì gõ/i }),
    );
    act(() => MockSpeechRecognition.last?.emitInterimTranscript("I bought a"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });
    act(() => MockSpeechRecognition.last?.emitInterimTranscript("I bought a hat yester"));
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });
    act(() => {
      MockSpeechRecognition.last?.emitFinalTranscript("I bought a hat yesterday.");
      MockSpeechRecognition.last?.stop();
    });

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    // Round 1 — the FIRST topic question, never a later question or the pivot.
    expect(followUp).toHaveTextContent("Where did you buy it?");
    expect(followUp).not.toHaveTextContent("Do you want to practice another sentence?");
  });

  it("continues for multiple rounds and only offers another sentence after the round cap", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    // Round 1 — first topic question.
    await speakCurrentTarget("I bought a hat yesterday.");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");

    // Round 2 — a NEW topic question, still not the pivot (regression made this
    // jump straight to "another sentence?").
    await speakCurrentTarget("I bought it at the market downtown.");
    await waitFor(() => {
      const followUp = screen.getByTestId("ai-tutor-speak-follow-up");
      expect(followUp).not.toHaveTextContent("Where did you buy it?");
      expect(followUp).not.toHaveTextContent("Do you want to practice another sentence?");
    });

    // Round 3 — still a question, not the pivot.
    await speakCurrentTarget("I need it for the sunny summer days.");
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent(
        "Do you want to practice another sentence?",
      );
    });
  });

  // ── C1: the follow-up answer recording loop ──
  // The learner must be able to ANSWER each follow-up by voice from the
  // follow-up block, have that answer captured as the current spoken response,
  // and get the NEXT follow-up — without the by-ear SelfCompareRecorder trapping
  // Speak on the first sentence.
  it("captures a spoken follow-up answer and advances to the next follow-up", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    // The by-ear self-compare recorder is present for the first sentence...
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();

    // Round 1 — first follow-up question appears.
    await speakCurrentTarget("I bought a hat yesterday.");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
      "Where did you buy it?",
    );

    // The learner answers the follow-up BY VOICE from the follow-up block.
    await answerFollowUpByVoice("I bought it at the market downtown.");

    // The spoken answer becomes the current spoken response (Speak state).
    // (Punctuation is normalized away by the STT transcript cleaner, so match
    // on substance, not the trailing period.)
    await waitFor(() => {
      const repeatBox = screen.getByTestId("ai-tutor-speak-repeat-input") as HTMLTextAreaElement;
      expect(repeatBox.value).toContain("I bought it at the market downtown");
    });

    // ...and the next follow-up appears (no longer the first question, not the
    // pivot — the loop did NOT stall on the first sentence).
    await waitFor(() => {
      const followUp = screen.getByTestId("ai-tutor-speak-follow-up");
      expect(followUp).not.toHaveTextContent("Where did you buy it?");
      expect(followUp).not.toHaveTextContent("Do you want to practice another sentence?");
    });

    // The self-compare recorder is still mounted/usable — never replaced.
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    // No score / percent / ML judgment surfaced by the follow-up answer.
    const followUp = screen.getByTestId("ai-tutor-speak-follow-up");
    expect(followUp.textContent ?? "").not.toMatch(/\d+%/);
    expect(followUp).not.toHaveTextContent("Bạn nói giống câu mẫu");
  });

  it("shows a clear fallback (no stall) when speech input is unsupported and lets the learner type follow-up answers", async () => {
    // SpeechRecognition stays undefined (unsupported), so the only way forward
    // is the typed path — it must keep producing follow-ups, never dead-end.
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    // Round 1 via typing.
    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I bought a hat yesterday.",
    );
    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("Where did you buy it?");

    // The follow-up surfaces a clear unsupported-mic message instead of a silent
    // dead mic — and points to the typed-answer path.
    expect(
      within(followUp).getByTestId("ai-tutor-speak-follow-up-mic-fallback-message"),
    ).toHaveTextContent("Không dùng được");

    // Typing a follow-up answer advances to the next question.
    const repeat = screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" });
    await userEvent.clear(repeat);
    await userEvent.type(repeat, "I bought it at the market downtown.");
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent(
        "Where did you buy it?",
      );
    });
  });

  // ── Depth cap + close-out UI ──
  // The pivot fires when turnsOnTopic >= DEPTH_CAP; since the counter increments
  // AFTER each round, the close-out appears on the (DEPTH_CAP + 1)-th round.
  it("shows the depth-cap close-out UI after the round limit is reached via voice", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    // Vary the sentence slightly each round so the same-sentence dedup guard
    // doesn't short-circuit, but keep it hat-related to hold the same topic.
    // DEPTH_CAP + 1 rounds needed because the counter increments AFTER each round.
    const ROUND_SENTENCES = [
      "I bought a hat yesterday.",
      "I bought a red hat yesterday.",
      "I bought a blue hat yesterday.",
      "I bought a small hat yesterday.",
      "I bought another hat yesterday.",
    ];
    for (let i = 0; i < SPEAK_FOLLOW_UP_DEPTH_CAP + 1; i++) {
      await speakCurrentTarget(ROUND_SENTENCES[i]);
      await screen.findByTestId("ai-tutor-speak-follow-up");
    }

    // At or past the cap, the close-out block must appear.
    await waitFor(() => {
      expect(screen.queryByTestId("ai-tutor-speak-close-out")).toBeInTheDocument();
    });
    // The mic answer block must be absent — close-out is a choice, not a round.
    expect(screen.queryByTestId("ai-tutor-speak-follow-up-answer")).not.toBeInTheDocument();
    // Both affordance buttons present.
    expect(screen.getByTestId("ai-tutor-speak-close-logic")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-close-fresh")).toBeInTheDocument();
  });

  it("shows the depth-cap close-out UI when rounds accumulate via the typed path", async () => {
    // Voice unavailable — typed path only. turnsOnTopic must still increment.
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    const repeatBox = screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" });

    const TYPED_SENTENCES = [
      "I bought a hat yesterday.",
      "I bought a red hat yesterday.",
      "I bought a blue hat yesterday.",
      "I bought a small hat yesterday.",
      "I bought another hat yesterday.",
    ];
    for (let i = 0; i < SPEAK_FOLLOW_UP_DEPTH_CAP + 1; i++) {
      await userEvent.clear(repeatBox);
      await userEvent.type(repeatBox, TYPED_SENTENCES[i]);
      await screen.findByTestId("ai-tutor-speak-follow-up");
    }

    await waitFor(() => {
      expect(screen.queryByTestId("ai-tutor-speak-close-out")).toBeInTheDocument();
    });
  });

  it("switches to Logic tab when learner taps the Logic close-out button", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    const LOGIC_TEST_SENTENCES = [
      "I bought a hat yesterday.",
      "I bought a red hat yesterday.",
      "I bought a blue hat yesterday.",
      "I bought a small hat yesterday.",
      "I bought another hat yesterday.",
    ];
    for (let i = 0; i < SPEAK_FOLLOW_UP_DEPTH_CAP + 1; i++) {
      await speakCurrentTarget(LOGIC_TEST_SENTENCES[i]);
      await screen.findByTestId("ai-tutor-speak-follow-up");
    }

    await waitFor(() => expect(screen.queryByTestId("ai-tutor-speak-close-logic")).toBeInTheDocument());
    await userEvent.click(screen.getByTestId("ai-tutor-speak-close-logic"));

    expect(await screen.findByTestId("ai-tutor-logic-mode")).toBeInTheDocument();
  });

  it("keeps deterministic Step 8 Speak follow-up when no salience is found", async () => {
    const mockPivot = vi.fn(() => "This should not be used. What happened?");
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = mockPivot;
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought a hat yesterday.");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(mockPivot).not.toHaveBeenCalled();
  });

  it("uses a valid mocked content-aware pivot for English salience in Speak", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "The fish burned. What did you eat instead?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife burned the fish");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("The fish burned. What did you eat instead?");
  });

  it("uses a valid mocked content-aware pivot for VN salience in Speak", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "Your wife is skilled. What is she good at?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife rất giỏi");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Your wife is skilled. What is she good at?");
  });

  it("keeps high-stakes Step 9 pivot behavior when Step 10 does not pause", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "Losing keys is stressful. Where did you last see them?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I lost my keys");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Losing keys is stressful. Where did you last see them?");
  });

  it("adds brief acknowledgment wording for mild emotional Speak content without diagnosis terms", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought a hat yesterday and I feel happy");

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("I hear you. Where did you buy it?");
    expect(followUp).not.toHaveTextContent(FORBIDDEN_STANCE_WORDING);
  });

  it("asks one simple clarification for unclear Speak replies", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "This pivot should not be used. What happened?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I don't understand");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Can you say that another way?");
    expect(window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__).not.toHaveBeenCalled();
  });

  it("asks for clarification instead of inventing nonsense follow-ups for unclear STT transcripts", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();

    await speakCurrentTarget("I bought ahead yesterday we got this summer I'm going to buy a lot");

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("I didn't catch that clearly. Can you say it again?");
    expect(followUp).not.toHaveTextContent("Why do you want to buy the i'm?");
    expect(followUp).not.toHaveTextContent("What size or color works for the canada?");
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("I bought a hat yesterday.");

    const score = screen.queryByTestId("ai-tutor-speak-score");
    expect(score?.textContent ?? "").not.toMatch(/\d+%/);
    expect(score?.textContent ?? "").not.toMatch(/score|ML judgment/i);
  });

  it("uses the authenticated DeepSeek Speak path for clear learner transcripts", async () => {
    useAuthMock.mockReturnValue({
      user: { id: "user-1", user_metadata: {} },
      session: { access_token: "session-jwt" },
      isLoading: false,
    });
    const fetchMock = vi.fn<typeof fetch>(async (_url, init) => {
      return new Response(JSON.stringify({ question: "What do you like to do in summer?" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I like summer because I can swim and wear shorts.");

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
        "What do you like to do in summer?",
      );
    });
    const apiCall = fetchMock.mock.calls.find(([url]) => url === "/api/mercy-ai");
    if (!apiCall) {
      throw new Error("Expected /api/mercy-ai fetch call");
    }
    const [, init] = apiCall;
    if (!init) {
      throw new Error("Expected /api/mercy-ai fetch init");
    }
    const body = JSON.parse(String(init.body ?? "{}")) as {
      mode?: string;
      transcript?: string;
      context?: { currentTopic?: string; learnerLevel?: string };
    };
    expect(body.mode).toBe("speak-follow-up");
    expect(body.transcript).toBe("I like summer because I can swim and wear shorts");
    expect(body.context?.learnerLevel).toBe("beginner");
    expect(init.headers).toMatchObject({ Authorization: "Bearer session-jwt" });
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
  });

  it("asks for clarification when the DeepSeek Speak path fails", async () => {
    useAuthMock.mockReturnValue({
      user: { id: "user-1", user_metadata: {} },
      session: { access_token: "session-jwt" },
      isLoading: false,
    });
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 503 })));
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I like summer because it is sunny.");

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
        "Mercy chưa nghe rõ. Bạn nói lại câu đó nhé.",
      );
    });
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("Why did you choose");
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
  });

  it("asks for a clearer repeat when the learner says the follow-up makes no sense", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "Can you say that another way?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought a hat yesterday.");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");

    await answerFollowUpByVoice("That question does not make sense.");

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("Mercy chưa nghe rõ. Bạn nói lại câu đó nhé.");
    expect(followUp).toHaveTextContent("I didn't catch that clearly. Can you say it again?");
    expect(followUp).not.toHaveTextContent("Can you say that another way?");
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-follow-up-answer")).toBeInTheDocument();

    const score = screen.queryByTestId("ai-tutor-speak-score");
    expect(score?.textContent ?? "").not.toMatch(/\d+%/);
    expect(score?.textContent ?? "").not.toMatch(/score|ML judgment/i);
  });

  it("keeps clear Speak follow-up answers advancing the round by voice", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought a hat yesterday.");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");

    await answerFollowUpByVoice("I bought it at a second-hand shop.");

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("What do you like about the shop?");
    });
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
  });

  it("uses needs_pause wording and suppresses correction or pivot for one Speak turn", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "That sounds scary. Are you safe now?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I was scared because she go every day");

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("I’m sorry that happened. Let’s pause correction for a moment. Are you okay to continue?");
    expect(followUp).not.toHaveTextContent("That sounds scary. Are you safe now?");
    expect(followUp).not.toHaveTextContent(FORBIDDEN_STANCE_WORDING);
    expect(window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__).not.toHaveBeenCalled();
  });

  it("does not let ordinary salience override the local L4 correction path in Speak", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "That hard detail matters. What made it hard?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("she work here and it was hard");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("What made it hard?");
  });

  it("keeps neutral Speak follow-up behavior unchanged after a paused turn", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I was scared");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("I’m sorry that happened.");

    await speakCurrentTarget("I bought a hat yesterday.");
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    });
  });

  it("does not preserve emotional stance across remounts", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    const { unmount } = renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I was scared");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("I’m sorry that happened.");

    unmount();
    MockSpeechRecognition.last = null;
    renderAiTutor();
    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought a hat yesterday.");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("I’m sorry that happened.");
  });

  it("does not add storage writes for stance integration", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const source = readFileSync(join(process.cwd(), "src/pages/AiTutor.tsx"), "utf8");

    const stanceLines = source
      .split("\n")
      .filter((line) => line.includes("classifyResponseStance("));

    expect(stanceLines.length).toBeGreaterThan(0);
    for (const line of stanceLines) {
      expect(line).not.toMatch(/\b(?:localStorage|sessionStorage|indexedDB)\b/i);
    }
  });

  it("falls back to deterministic Step 8 follow-up for invalid mocked pivot candidates", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "Nice, the fish burned. What did you eat?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife burned the fish");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("Nice");
  });

  it("falls back to deterministic Step 8 follow-up for mocked pivot timeout or failure", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => ({ failed: true }));
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife burned the fish");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
  });

  it("rejects repeated mocked assistant pivots and uses deterministic Step 8 fallback", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "The fish burned. What did you eat instead?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("my wife burned the fish");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("The fish burned. What did you eat instead?");

    await speakCurrentTarget("my wife burned the fish again");
    // The repeated mock pivot is rejected; the deterministic fallback now
    // follows the learner's own word ("fish") instead of reverting to the seed.
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("fish");
    });
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("The fish burned. What did you eat instead?");
  });

  it("scores the typed Speak repeat fallback honestly without phoneme evidence", async () => {
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I bought a hat yesterday.",
    );

    const score = await screen.findByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Đang nghe, chấm điểm chi tiết sẽ có sau.");
    expect(score).not.toHaveTextContent("Bạn nói giống câu mẫu");
    expect(score.textContent ?? "").not.toMatch(/\d+%/);
    expect(score).not.toHaveTextContent("Mercy đã chấm phát âm chi tiết hơn bằng từng âm.");

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("Where did you buy it?");
    expect(followUp).not.toHaveTextContent("bằng từng âm");
  });

  it("keeps the self-compare recorder and shows the current Speak follow-up before scoring", async () => {
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("I bought a hat yesterday.");
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" })).toBeInTheDocument();

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("Câu hỏi tiếp theo");
    expect(followUp).toHaveTextContent("Where did you buy it?");
    expect(screen.queryByTestId("ai-tutor-speak-score")).not.toBeInTheDocument();
    expect(screen.getByTestId("self-compare-recorder").textContent ?? "").not.toMatch(/\d+\s*%/);
  });

  it("replaces the seeded Speak follow-up for a new corrected sentence", async () => {
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");

    await openTab("Sửa câu");
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("She go to school every day.", "She goes to school every day.");
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("She goes to school every day.");
    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).not.toHaveTextContent("Where did you buy it?");
    expect(followUp.textContent?.toLowerCase() ?? "").toMatch(/school|class/);
  });

  it("clears the old Speak follow-up when the learner resets for a new sentence", async () => {
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");

    await userEvent.click(screen.getByRole("button", { name: "Xóa bảng để nhập câu mới" }));

    expect(screen.queryByTestId("ai-tutor-speak-follow-up")).not.toBeInTheDocument();
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("What do you usually do in the morning?");
  });

  it("clears an unclear-transcript clarification when the learner resets for a new sentence", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought ahead yesterday we got this summer I'm going to buy a lot");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
      "I didn't catch that clearly. Can you say it again?",
    );

    await userEvent.click(screen.getByRole("button", { name: "Xóa bảng để nhập câu mới" }));

    expect(screen.queryByTestId("ai-tutor-speak-follow-up")).not.toBeInTheDocument();
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
  });

  it("offers a deterministic follow-up in Speak even without a corrected sentence", async () => {
    renderAiTutor();

    // Reach Speak directly — no grammar correction, so there is no seed.
    await openTab("Luyện nói");
    expect(screen.getByTestId("ai-tutor-speak-generic-prompt")).toBeInTheDocument();

    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I had dinner with my family.",
    );

    // The round must not silently end: a follow-up question appears.
    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("What did you eat?");

    // And still no fake audio percent on the no-seed path.
    const score = screen.getByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Đang nghe, chấm điểm chi tiết sẽ có sau.");
    expect(score.textContent ?? "").not.toMatch(/\d+%/);
  });

  it("follows an arbitrary (non-bucket) Speak topic for 4 rounds using the learner's own words", async () => {
    renderAiTutor();
    await openTab("Luyện nói");

    const box = screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" });
    // Arbitrary, non-scripted topics; each answer introduces a new salient word.
    const rounds: Array<{ text: string; keyword: string }> = [
      { text: "The weather is nice today.", keyword: "weather" },
      { text: "My garden has many flowers.", keyword: "garden" },
      { text: "I painted the fence blue.", keyword: "fence" },
      { text: "I sold the camera afterwards.", keyword: "camera" },
    ];

    const askedQuestions: string[] = [];
    for (const round of rounds) {
      await userEvent.clear(box);
      await userEvent.type(box, round.text);
      const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
      await waitFor(() => {
        expect(followUp.textContent?.toLowerCase() ?? "").toContain(round.keyword);
      });
      const question = followUp.textContent ?? "";
      // The conversation follows the learner — never the premature dead-end pivot.
      expect(question).not.toMatch(/Do you want to practice another sentence/);
      // And it does not repeat a previous follow-up.
      expect(askedQuestions).not.toContain(question);
      askedQuestions.push(question);
    }

    expect(new Set(askedQuestions).size).toBe(askedQuestions.length); // 4 distinct
  });

  it("sustains a scripted-seed Speak conversation for 3+ rounds, following the learner's answers (Chau's hat scenario)", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    // Round 1 (off the seed): the scripted lead-in question.
    await speakCurrentTarget("I bought a hat yesterday.");
    const f1 = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(f1).toHaveTextContent("Where did you buy it?");
    expect(f1).not.toHaveTextContent("Do you want to practice another sentence?");

    // Round 2: follows the learner's answer ("beach"), not canned hat trivia.
    await speakCurrentTarget("I will wear it at the beach.");
    await waitFor(() => {
      const text = screen.getByTestId("ai-tutor-speak-follow-up").textContent ?? "";
      expect(text.toLowerCase()).toContain("beach");
      expect(text).not.toMatch(/Do you want to practice another sentence/);
    });

    // Round 3: still following the learner ("friends") — no premature move-on
    // after only one or two answers.
    await speakCurrentTarget("I will go with my friends.");
    await waitFor(() => {
      const text = screen.getByTestId("ai-tutor-speak-follow-up").textContent ?? "";
      expect(text.toLowerCase()).toContain("friends");
      expect(text).not.toMatch(/Do you want to practice another sentence/);
    });
  });

  it("sustains the hat/sun scenario with Chau's exact learner answer (FU2 + FU3, never a one-answer move-on)", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    // Seed is the coherent summer sentence; only the tense was fixed.
    await correctSentence(
      "I buy a hat yesterday because summer is coming and it is going to be very sunny.",
      "I bought a hat yesterday because summer is coming and it is going to be very sunny.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    // Follow-up 1 — the scripted lead-in off the seed.
    await speakCurrentTarget(
      "I bought a hat yesterday because summer is coming and it is going to be very sunny.",
    );
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
      "Why do you need the hat?",
    );

    // Learner answers with Chau's EXACT sentence → Follow-up 2, NOT a move-on
    // and NOT the unclear-sentence clarification.
    await speakCurrentTarget(
      "I need a hat because in the summer the sun is very strong with sunlight so it may burn my skin",
    );
    await waitFor(() => {
      const text = screen.getByTestId("ai-tutor-speak-follow-up").textContent ?? "";
      expect(text).not.toMatch(/Do you want to practice another sentence/);
      expect(text).not.toMatch(/That sentence is hard to follow/);
      expect(text).not.toBe("Why do you need the hat?");
    });

    // Another answer → Follow-up 3, still not a move-on.
    await speakCurrentTarget("I will wear it at the beach with my friends.");
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent(
        "Do you want to practice another sentence?",
      );
    });
  });

  it("asks for a simpler sentence when the Speak seed is a garbled grammar-only fix (Issue 1)", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    // Only buy→bought is fixed; the corrected sample is still word-salad.
    await correctSentence(
      "I buy a pet yesterday bike around a lot.",
      "I bought a pet yesterday bike around a lot.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    // Learner echoes the garbled model back → Mercy asks for a clearer sentence
    // instead of drilling it with on-topic trivia.
    await speakCurrentTarget("I bought a pet yesterday bike around a lot.");
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
        "That sentence is hard to follow.",
      );
    });

    // Escape hatch: once the learner says a CLEAR sentence, the conversation
    // follows their words again (the gate needs BOTH seed and reply unclear).
    await speakCurrentTarget("I bought a dog at the shop.");
    await waitFor(() => {
      const text = screen.getByTestId("ai-tutor-speak-follow-up").textContent ?? "";
      expect(text).not.toMatch(/That sentence is hard to follow/);
      expect(text.toLowerCase()).toMatch(/dog|shop/);
    });
  });

  it("sends a non-canned hat-biking correction into Speak and asks an English follow-up", async () => {
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockEndingAudio,
    });
    renderAiTutor();

    await correctSentence(
      "I buy a hat yesterday because I will bike a lot.",
      "I bought a hat yesterday because I will bike a lot.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent(
      "I bought a hat yesterday because I will bike a lot.",
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I bought a hat yesterday because I will bike a lot.",
    );

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent(/Why do you need the hat|How often do you bike in the summer|Is it very sunny where you live/);
    expect(followUp).not.toHaveTextContent("Bạn muốn luyện thêm câu khác không?");
    expect(within(followUp).getByRole("button", { name: "Mercy đọc câu hỏi tiếp theo" })).toBeInTheDocument();
  });

  it("reads the next Speak follow-up question aloud", async () => {
    const browserSpeak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onstart?.();
      utterance.onend?.();
    });
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.test/follow-up.mp3", cached: false, provider: "azure" });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: browserSpeak,
        cancel: vi.fn(),
        getVoices: vi.fn(() => [{ lang: "en-US" }]),
        resume: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockEndingAudio,
    });
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I bought a hat yesterday.",
    );

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("Where did you buy it?");
    await userEvent.click(within(followUp).getByRole("button", { name: "Mercy đọc câu hỏi tiếp theo" }));

    await waitFor(() => expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: "Where did you buy it?",
      language: "en",
      requiredProvider: "azure",
    }));
    expect(MockEndingAudio.last?.src).toBe("https://example.test/follow-up.mp3");
    expect(MockEndingAudio.last?.play).toHaveBeenCalledTimes(1);
    expect(browserSpeak).not.toHaveBeenCalled();
  });

  it("shows the bilingual VI clarification but reads only the English segment", async () => {
    const clarificationVi = "Mercy chưa nghe rõ. Bạn nói lại câu đó nhé.";
    const clarificationEn = "I didn't catch that clearly. Can you say it again?";
    const browserSpeak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onstart?.();
      utterance.onend?.();
    });
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.test/clarification.mp3", cached: false, provider: "azure" });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: browserSpeak,
        cancel: vi.fn(),
        getVoices: vi.fn(() => [{ lang: "vi-VN" }, { lang: "en-US" }]),
        resume: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockEndingAudio,
    });
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought a hat yesterday.");
    await answerFollowUpByVoice("That question does not make sense.");

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(within(followUp).getByText(clarificationVi)).toBeInTheDocument();
    expect(within(followUp).getByText(clarificationEn)).toBeInTheDocument();
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-follow-up-answer")).toBeInTheDocument();

    // Bilingual display stays visible, but the speech path must receive English only.
    fetchCloudTtsUrl.mockClear();
    await userEvent.click(within(followUp).getByRole("button", { name: "Mercy đọc câu hỏi tiếp theo" }));

    await waitFor(() => expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: clarificationEn,
      language: "en",
      requiredProvider: "azure",
    }));
    expect(browserSpeak).not.toHaveBeenCalled();
    expect(within(screen.getByTestId("ai-tutor-speak-follow-up")).getByText(clarificationVi)).toBeInTheDocument();
    expect(within(screen.getByTestId("ai-tutor-speak-follow-up")).getByText(clarificationEn)).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-speak-follow-up-answer")).toBeInTheDocument();
  });

  it("uses the learner's latest typed Speak topic for the next follow-up", async () => {
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I had dinner with my family.",
    );

    const score = await screen.findByTestId("ai-tutor-speak-score");
    expect(score).toHaveTextContent("Đang nghe, chấm điểm chi tiết sẽ có sau.");
    expect(score.textContent ?? "").not.toMatch(/\d+%/);

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("What did you eat?");
    expect(followUp).not.toHaveTextContent("Where did you buy it?");
    expect(followUp).not.toHaveTextContent(/morning|work/i);
  });

  it("does not repeat Speak follow-up templates for the same corrected sentence", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await speakCurrentTarget("I bought a hat yesterday.");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");

    await speakCurrentTarget("I bought a hat yesterday again.");
    // Second turn follows the learner's word ("hat") and never repeats the first.
    await waitFor(() => {
      const text = screen.getByTestId("ai-tutor-speak-follow-up").textContent ?? "";
      expect(text).toContain("hat");
      expect(text).not.toMatch(/Where did you buy it/);
    });
  });

  it("offers a graceful pivot after four Speak follow-up turns on the same topic", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await speakCurrentTarget("I bought a hat yesterday.");
    await speakCurrentTarget("I bought a red hat yesterday.");
    await speakCurrentTarget("I bought a blue hat yesterday.");
    await speakCurrentTarget("I bought a small hat yesterday.");
    await speakCurrentTarget("I bought another hat yesterday.");

    // After the depth cap, the follow-up block becomes the close-out affordance
    // (two navigation buttons) instead of another open-ended question.
    await waitFor(() => {
      expect(screen.queryByTestId("ai-tutor-speak-close-out")).toBeInTheDocument();
    });
    expect(
      within(screen.getByTestId("ai-tutor-speak-follow-up")).queryByRole("button", {
        name: "Mercy đọc câu hỏi tiếp theo",
      }),
    ).not.toBeInTheDocument();
  });

  it("uses the learner's latest spoken topic instead of drifting back to the corrected seed", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    renderAiTutor();

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
    renderAiTutor();

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
        expect(text).not.toMatch(/Do you want to practice another sentence/);
        if (previousQuestion) expect(text).not.toBe(previousQuestion);
      });
      const text = screen.getByTestId("ai-tutor-speak-follow-up").textContent ?? "";
      expect(text).not.toMatch(/Where did you buy it|Why do you need the hat|morning|work/i);
      questions.push(text);
    }

    expect(new Set(questions).size).toBe(questions.length);

    await speakCurrentTarget("It was a nice time.");
    await waitFor(() => {
      expect(screen.queryByTestId("ai-tutor-speak-close-out")).toBeInTheDocument();
    });
  });

  it("falls back to the generic Speak prompt when no corrected sentence exists", async () => {
    renderAiTutor();

    await openTab("Luyện nói");

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("What do you usually do in the morning?");
    expect(screen.getByTestId("ai-tutor-speak-generic-prompt")).toHaveTextContent("Chưa có câu đã sửa");
    expect(screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" })).toBeInTheDocument();
    expect(screen.getByTestId("ai-tutor-conversation-mic-fallback")).toBeInTheDocument();
  });

  it("keeps Speak TTS scoped to the latest corrected practice target through Mercy audio first", async () => {
    const browserSpeak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onstart?.();
      utterance.onend?.();
    });
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.test/target.mp3", cached: false, provider: "azure" });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: browserSpeak,
        cancel: vi.fn(),
        getVoices: vi.fn(() => [{ lang: "en-US" }]),
        resume: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, "Audio", {
      configurable: true,
      value: MockEndingAudio,
    });
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await userEvent.click(screen.getByRole("button", { name: "Mercy đọc câu đã sửa bằng giọng AI" }));

    await waitFor(() => expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: "I bought a hat yesterday.",
      language: "en",
      requiredProvider: "azure",
    }));
    expect(MockEndingAudio.last?.src).toBe("https://example.test/target.mp3");
    expect(MockEndingAudio.last?.play).toHaveBeenCalledTimes(1);
    expect(browserSpeak).not.toHaveBeenCalled();
  });

  it("does not silently fall back to browser speech when Azure voice is unavailable", async () => {
    const cancel = vi.fn();
    const resume = vi.fn();
    const browserSpeak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onstart?.();
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: browserSpeak,
        cancel,
        getVoices: vi.fn(() => [{ lang: "en-US" }]),
        resume,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await userEvent.click(screen.getByRole("button", { name: "Mercy đọc câu đã sửa bằng giọng AI" }));
    await waitFor(() => expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: "I bought a hat yesterday.",
      language: "en",
      requiredProvider: "azure",
    }));

    expect(browserSpeak).not.toHaveBeenCalled();
    expect(cancel).toHaveBeenCalled();
    expect(resume).not.toHaveBeenCalled();
    expect(screen.getByTestId("ai-tutor-speak-tts-error")).toHaveTextContent(
      "Mercy sẽ không tự chuyển sang giọng trình duyệt",
    );
  });

  it("rejects non-Azure cloud audio for Speak TTS", async () => {
    const browserSpeak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onerror?.();
    });
    fetchCloudTtsUrl.mockResolvedValue({
      audioUrl: "https://example.test/elevenlabs.mp3",
      cached: false,
      provider: "elevenlabs",
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: browserSpeak,
        cancel: vi.fn(),
        getVoices: vi.fn(() => [{ lang: "en-US" }]),
        resume: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: MockSpeechSynthesisUtterance,
    });
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await userEvent.click(screen.getByRole("button", { name: "Mercy đọc câu đã sửa bằng giọng AI" }));

    await waitFor(() => {
      expect(browserSpeak).not.toHaveBeenCalled();
      expect(screen.getByTestId("ai-tutor-speak-tts-error")).toHaveTextContent(
        "Mercy sẽ không tự chuyển sang giọng trình duyệt",
      );
    });
  });

  it("updates Speak target when Grammar corrects a new sentence", async () => {
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await userEvent.type(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i }), "She go to school every day.");
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    await waitFor(() => expect(screen.getByText("She goes to school every day.")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent("She goes to school every day.");
  });

  it("renders curated Logic explanations and uses fallback only for unmatched free text", async () => {
    renderAiTutor();

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
    renderAiTutor();

    await correctHatSentence();
    await openTab("Logic");

    const logic = screen.getByTestId("ai-tutor-logic-mode");
    expect(within(logic).getByText("Câu đã sửa mới nhất")).toBeInTheDocument();
    expect(within(logic).getAllByText("I bought a hat yesterday.").length).toBeGreaterThan(0);
  });

  it("updates Logic when the learner changes to a new corrected sentence", async () => {
    renderAiTutor();

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("She go to school every day.", "She goes to school every day.");
    await openTab("Logic");

    const logic = screen.getByTestId("ai-tutor-logic-mode");
    expect(within(logic).getByText("Câu đã sửa mới nhất")).toBeInTheDocument();
    expect(within(logic).getByText("She goes to school every day.")).toBeInTheDocument();
    expect(within(logic).queryByText("I bought a hat yesterday.")).not.toBeInTheDocument();
  });

  it("clears stale corrected sentence and Logic explanation on board reset", async () => {
    renderAiTutor();

    await correctSentence("She go to school every day.", "She goes to school every day.");
    await openTab("Logic");
    expect(screen.getByTestId("ai-tutor-logic-mode")).toHaveTextContent("She goes to school every day.");

    await openTab("Sửa câu");
    await userEvent.click(screen.getByRole("button", { name: "Làm mới" }));
    await openTab("Logic");

    const logic = screen.getByTestId("ai-tutor-logic-mode");
    expect(within(logic).queryByText("Câu đã sửa mới nhất")).not.toBeInTheDocument();
    expect(within(logic).queryByText("She goes to school every day.")).not.toBeInTheDocument();
    expect(within(logic).queryByText("She go to school every day.")).not.toBeInTheDocument();
  });

  it("keeps Speak read-back text from poisoning Logic state", async () => {
    renderAiTutor();

    await correctSentence("She go to school every day.", "She goes to school every day.");
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I bought a hat yesterday.",
    );
    await openTab("Logic");

    const logic = screen.getByTestId("ai-tutor-logic-mode");
    expect(within(logic).getByText("She goes to school every day.")).toBeInTheDocument();
    expect(within(logic).queryByText("I bought a hat yesterday.")).not.toBeInTheDocument();
  });

  // ── Directive V2 regression pins (post-!807) ─────────────────────────────
  // Explicit pins for the four invariants that !807 introduced. One describe
  // block so future contributors know exactly what they're protecting.
  describe("Directive V2 regression pins", () => {
    // Run DEPTH_CAP+1 distinct voice rounds to trigger the close-out pivot.
    const DEPTH_SENTENCES = [
      "I bought a hat yesterday.",
      "I bought a red hat yesterday.",
      "I bought a blue hat yesterday.",
      "I bought a small hat yesterday.",
      "I bought another hat yesterday.",
    ] as const;

    async function speakToCloseOut() {
      for (let i = 0; i < SPEAK_FOLLOW_UP_DEPTH_CAP + 1; i++) {
        await speakCurrentTarget(DEPTH_SENTENCES[i]);
        await screen.findByTestId("ai-tutor-speak-follow-up");
      }
      await waitFor(() =>
        expect(screen.getByTestId("ai-tutor-speak-close-out")).toBeInTheDocument(),
      );
    }

    it("[pin-a] identical final transcript does not advance turnsOnTopic a second time", async () => {
      (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
      renderAiTutor();

      await correctHatSentence();
      await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

      // Round 1 — scripted topic question for the hat sentence.
      await speakCurrentTarget("I bought a hat yesterday.");
      expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
        "Where did you buy it?",
      );

      // Submit the SAME final transcript a second time. The dedup guard
      // (lastRecordedSpeakAttemptRef) must fire and keep turnsOnTopic at 1.
      // If the counter advanced to 2, the question would shift away from the
      // round-1 canned line — the assertion below would fail.
      await speakCurrentTarget("I bought a hat yesterday.");
      await waitFor(() =>
        expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
          "Where did you buy it?",
        ),
      );
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent(
        "Do you want to practice another sentence?",
      );
    });

    it("[pin-b] close-out fires at SPEAK_FOLLOW_UP_DEPTH_CAP with both tappable actions rendered", async () => {
      (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
      renderAiTutor();

      await correctHatSentence();
      await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

      await speakToCloseOut();

      // Both affordances must be rendered — neither alone satisfies the learner.
      expect(screen.getByTestId("ai-tutor-speak-close-logic")).toBeInTheDocument();
      expect(screen.getByTestId("ai-tutor-speak-close-fresh")).toBeInTheDocument();
      // Close-out is a navigation choice, not a conversational round: no mic answer block.
      expect(screen.queryByTestId("ai-tutor-speak-follow-up-answer")).not.toBeInTheDocument();
    });

    it("[pin-c] choosing 'fresh sentence' clears the board and lets the next practice start at round 1", async () => {
      (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
      renderAiTutor();

      await correctHatSentence();
      await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

      await speakToCloseOut();

      // Tap "Bắt đầu câu mới" — the 'fresh sentence' affordance.
      await userEvent.click(screen.getByTestId("ai-tutor-speak-close-fresh"));

      // Board must be clean: close-out gone, no lingering follow-up from the
      // old session. If clearSpeakBoardState() were missing from handleClear(),
      // currentIsPivot would stay true and the close-out block would remain.
      expect(screen.queryByTestId("ai-tutor-speak-close-out")).not.toBeInTheDocument();
      expect(screen.queryByTestId("ai-tutor-speak-follow-up")).not.toBeInTheDocument();

      // Correct and practice a fresh sentence. The first voice round must land
      // on the round-1 topic question — never the pivot — proving the session
      // counter is back at zero.
      await openTab("Sửa câu");
      await correctHatSentence();
      await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
      await speakCurrentTarget("I bought a hat yesterday.");
      expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent(
        "Where did you buy it?",
      );
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent(
        "Do you want to practice another sentence?",
      );
    });

    it("[pin-d] Logic close-out button navigates to Logic tab and carries the practiced sentence", async () => {
      (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
      renderAiTutor();

      await correctHatSentence();
      await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

      await speakToCloseOut();

      // Tap "Kiểm tra câu trong tab Logic".
      await userEvent.click(screen.getByTestId("ai-tutor-speak-close-logic"));

      // Logic tab must be active AND contain the sentence that was just practiced.
      // latestCorrectedSeed is NOT cleared by handleModeChange, so it carries over.
      expect(await screen.findByTestId("ai-tutor-logic-current-board")).toHaveTextContent(
        "I bought a hat yesterday.",
      );
    });
  });
});

// ─── Bug fix: unchanged-echo correction and session-hydration race ────────────

describe("AiTutor Grammar submit — unchanged sentence + session handling", () => {
  it("[fix-b] no token + unchanged sentence: shows honest message, never renders correction card", async () => {
    // Default: useAuthMock returns session: null (no token). supabase.auth.getSession()
    // also returns null (jsdom localStorage is empty). Submitting a grammatically correct
    // sentence (unchanged by the engine) must NOT show a correction card — only the
    // honest cannot-verify message.
    renderAiTutor();

    await userEvent.type(
      screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i }),
      "I went to school.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));

    expect(await screen.findByText(CANNOT_CORRECT_NO_SESSION_MESSAGE)).toBeInTheDocument();
    // No correction card: "Sửa câu khác" button only appears after a successful correction.
    expect(screen.queryByRole("button", { name: "Sửa câu khác" })).not.toBeInTheDocument();
  });

  it("[fix-c] with token + unchanged sentence: AI path is called (not local echo)", async () => {
    // With a session token, the AI API must be invoked for unchanged sentences.
    // The ?? fallback picks up session.access_token from useAuthMock because
    // supabase.auth.getSession() returns null from jsdom localStorage.
    useAuthMock.mockReturnValue({
      user: { id: "user-1", user_metadata: {} },
      session: { access_token: "session-jwt" },
      isLoading: false,
    });
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(
        JSON.stringify({ confident: false, corrected: "", explanation: "câu đúng rồi", grammarTip: "" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    renderAiTutor();

    await userEvent.type(
      screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i }),
      "I went to school.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));

    await waitFor(() => {
      const aiCall = fetchMock.mock.calls.find(([url]) => String(url).includes("/api/mercy-ai"));
      expect(aiCall).toBeDefined();
    });
    // AI is called with the session token in the Authorization header.
    const aiCall = fetchMock.mock.calls.find(([url]) => String(url).includes("/api/mercy-ai"));
    if (!aiCall) {
      throw new Error("Expected /api/mercy-ai fetch call");
    }
    const [, init] = aiCall;
    expect(init?.headers).toMatchObject({ Authorization: "Bearer session-jwt" });
  });
});
