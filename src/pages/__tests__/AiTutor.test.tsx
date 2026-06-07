import { readFileSync } from "node:fs";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AiTutorPage from "../AiTutor";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import { hasShownHint } from "@/lib/ai-tutor/detectorHint";
import { readL1RecentTags } from "@/lib/stage-3a/adapters/l1TagAdapter";
import {
  readAndClearPendingReflection,
  writePendingReflection,
} from "@/lib/ai-tutor/teacherMercyHandoff";
import type { SpeechRecognitionLike } from "@/types/speech-recognition";

const FORBIDDEN_STANCE_WORDING = /diagnosis|depressed|anxiety|trauma|therapy|mental health|clinical|disorder/i;
const FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE =
  "Mercy chưa sửa chắc câu này bằng bộ quy tắc hiện tại. Bạn có thể chỉnh lại câu ngắn hơn một chút rồi bấm Sửa câu này nhé.";

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

  it("circles the same L1 weakness with a new-context follow-up, then offers to move on", async () => {
    render(<AiTutorPage />);

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

    // A clean turn → the loop offers to move on instead of another drill.
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("I like music.", "I like music.");
    expect(await screen.findByTestId("ai-tutor-l1-moveon")).toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-l1-followup")).not.toBeInTheDocument();
  });

  it("does not carry L1 focus across a remount (in-session only)", async () => {
    // Focus state lives in a per-mount ref (l1FocusRef), never in storage, so a
    // fresh mount — a new session / page reload — must RESTART the loop, not
    // resume the prior focus. A same-tag error on the second mount must show
    // context #1 again, not the context #2 the first mount had advanced toward.
    const first = render(<AiTutorPage />);
    await correctSentence("She go to school every day.", "She goes to school every day.");
    expect(await screen.findByTestId("ai-tutor-l1-followup")).toHaveTextContent("buổi sáng"); // #1

    first.unmount();

    render(<AiTutorPage />);
    await correctSentence("She go to school every day.", "She goes to school every day.");
    const afterRemount = await screen.findByTestId("ai-tutor-l1-followup");
    expect(afterRemount).toHaveTextContent("buổi sáng"); // context #1 AGAIN — focus reset
    expect(afterRemount).not.toHaveTextContent("làm nghề"); // did NOT resume at context #2
  });

  it("shows no follow-up for clean (low-confidence) input with no active focus", async () => {
    render(<AiTutorPage />);

    await correctSentence("I like music.", "I like music.");

    expect(screen.queryByTestId("ai-tutor-l1-followup")).not.toBeInTheDocument();
    expect(screen.queryByTestId("ai-tutor-l1-moveon")).not.toBeInTheDocument();
  });

  it("does not run the L1 follow-up loop on a non-English Correction target", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=vi");
    render(<AiTutorPage />);

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

    render(<AiTutorPage />);

    // Lands in Correction (grammar) mode with the reflection pre-filled.
    expect(screen.getByRole("textbox")).toHaveValue("Today I learn about my family.");
    // Single-use: the bridge is cleared on mount, so a later mount won't re-prefill.
    expect(readAndClearPendingReflection()).toBeNull();
  });

  it("shows an empty Correction input when there is no Teacher Mercy hand-off", () => {
    render(<AiTutorPage />);

    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("keeps L1 focus in-session only — it does not persist across a remount (invariant 5)", async () => {
    // Advance the focus within one session (context #1 → #2), then remount with
    // a fresh component tree. Storage is NOT cleared between the two renders
    // here (beforeEach only runs between tests), so if the loop had been
    // regressed to persist focus cross-session (localStorage/IndexedDB/etc.),
    // the same input would resume at context #2. An in-memory ref must reset on
    // remount and start over at context #1.
    const first = render(<AiTutorPage />);
    await correctSentence("She go to school every day.", "She goes to school every day.");
    expect(await screen.findByTestId("ai-tutor-l1-followup")).toHaveTextContent("buổi sáng");
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu khác" }));
    await correctSentence("He work in a bank.", "He works in a bank.");
    expect(await screen.findByTestId("ai-tutor-l1-followup")).toHaveTextContent("làm nghề");

    first.unmount();

    render(<AiTutorPage />);
    await correctSentence("She go to school every day.", "She goes to school every day.");
    // Fresh session → focus restarts at context #1, proving no cross-session write.
    expect(await screen.findByTestId("ai-tutor-l1-followup")).toHaveTextContent("buổi sáng");
  });

  it("commits final Grammar voice transcript into the correction input", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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

  it("clears stale correction errors when Grammar voice input starts", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await userEvent.type(screen.getByRole("textbox", { name: /Gõ câu tiếng Anh của bạn/i }), "I run yesterday.");
    await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
    expect(await screen.findByText(FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Nhập bằng giọng nói/ }));

    expect(screen.queryByText(FRIENDLY_CORRECTION_UNAVAILABLE_MESSAGE)).not.toBeInTheDocument();
  });

  it("shows a voice-specific message when Grammar voice input captures no transcript", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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

  it("moves the corrected sentence from Grammar to Speak and scores the repeated sentence honestly", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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

  it("keeps high-stakes Step 9 pivot behavior when Step 10 does not pause", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "Losing keys is stressful. Where did you last see them?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I lost my keys");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Losing keys is stressful. Where did you last see them?");
  });

  it("adds brief acknowledgment wording for mild emotional Speak content without diagnosis terms", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I don't understand");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Can you say that another way?");
    expect(window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__).not.toHaveBeenCalled();
  });

  it("asks for clarification instead of inventing nonsense follow-ups for unclear STT transcripts", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

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

  it("uses needs_pause wording and suppresses correction or pivot for one Speak turn", async () => {
    window.__MERCY_AI_TUTOR_MOCK_PIVOT_CANDIDATE__ = vi.fn(() => "That sounds scary. Are you safe now?");
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("she work here and it was hard");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("What made it hard?");
  });

  it("keeps neutral Speak follow-up behavior unchanged after a paused turn", async () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = MockSpeechRecognition;
    render(<AiTutorPage />);

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
    const { unmount } = render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I was scared");
    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("I’m sorry that happened.");

    unmount();
    MockSpeechRecognition.last = null;
    render(<AiTutorPage />);
    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await speakCurrentTarget("I bought a hat yesterday.");

    expect(await screen.findByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Where did you buy it?");
    expect(screen.getByTestId("ai-tutor-speak-follow-up")).not.toHaveTextContent("I’m sorry that happened.");
  });

  it("does not add storage writes for stance integration", () => {
    const source = readFileSync("src/pages/AiTutor.tsx", "utf8");

    expect(source).not.toMatch(/localStorage|sessionStorage|indexedDB/i);
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
    // The repeated mock pivot is rejected; the deterministic fallback now
    // follows the learner's own word ("fish") instead of reverting to the seed.
    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("fish");
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
    expect(score).toHaveTextContent("Đang nghe, chấm điểm chi tiết sẽ có sau.");
    expect(score).not.toHaveTextContent("Bạn nói giống câu mẫu");
    expect(score.textContent ?? "").not.toMatch(/\d+%/);
    expect(score).not.toHaveTextContent("Mercy đã chấm phát âm chi tiết hơn bằng từng âm.");

    const followUp = await screen.findByTestId("ai-tutor-speak-follow-up");
    expect(followUp).toHaveTextContent("Where did you buy it?");
    expect(followUp).not.toHaveTextContent("bằng từng âm");
  });

  it("keeps the self-compare recorder and shows the current Speak follow-up before scoring", async () => {
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);
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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.test/follow-up.mp3", cached: false });
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
    render(<AiTutorPage />);

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
    }));
    expect(MockEndingAudio.last?.src).toBe("https://example.test/follow-up.mp3");
    expect(MockEndingAudio.last?.play).toHaveBeenCalledTimes(1);
    expect(browserSpeak).not.toHaveBeenCalled();
  });

  it("uses the learner's latest typed Speak topic for the next follow-up", async () => {
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));

    await speakCurrentTarget("I bought a hat yesterday.");
    await speakCurrentTarget("I bought a red hat yesterday.");
    await speakCurrentTarget("I bought a blue hat yesterday.");
    await speakCurrentTarget("I bought a small hat yesterday.");
    await speakCurrentTarget("I bought another hat yesterday.");

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Do you want to practice another sentence?");
    });
    expect(
      within(screen.getByTestId("ai-tutor-speak-follow-up")).queryByRole("button", {
        name: "Mercy đọc câu hỏi tiếp theo",
      }),
    ).not.toBeInTheDocument();
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
      expect(screen.getByTestId("ai-tutor-speak-follow-up")).toHaveTextContent("Do you want to practice another sentence?");
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

  it("keeps Speak TTS scoped to the latest corrected practice target through Mercy audio first", async () => {
    const browserSpeak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onstart?.();
      utterance.onend?.();
    });
    fetchCloudTtsUrl.mockResolvedValue({ audioUrl: "https://example.test/target.mp3", cached: false });
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
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await userEvent.click(screen.getByRole("button", { name: "Mercy đọc câu đã sửa bằng giọng AI" }));

    await waitFor(() => expect(fetchCloudTtsUrl).toHaveBeenCalledWith({
      text: "I bought a hat yesterday.",
      language: "en",
    }));
    expect(MockEndingAudio.last?.src).toBe("https://example.test/target.mp3");
    expect(MockEndingAudio.last?.play).toHaveBeenCalledTimes(1);
    expect(browserSpeak).not.toHaveBeenCalled();
  });

  it("restarts Speak TTS cleanly on a second Mercy đọc click", async () => {
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
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await userEvent.click(screen.getByRole("button", { name: "Mercy đọc câu đã sửa bằng giọng AI" }));
    await waitFor(() => expect(browserSpeak).toHaveBeenCalledTimes(1));
    await userEvent.click(screen.getByRole("button", { name: "Mercy đọc câu đã sửa bằng giọng AI" }));

    await waitFor(() => expect(browserSpeak).toHaveBeenCalledTimes(2));
    expect(cancel).toHaveBeenCalled();
    expect(resume).toHaveBeenCalled();
    expect(browserSpeak.mock.calls[0][0]).not.toBe(browserSpeak.mock.calls[1][0]);
    expect((browserSpeak.mock.calls[1][0] as MockSpeechSynthesisUtterance).text).toBe("I bought a hat yesterday.");
  });

  it("shows the safe Speak TTS error when browser speech fails", async () => {
    const browserSpeak = vi.fn((utterance: MockSpeechSynthesisUtterance) => {
      utterance.onerror?.();
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
    render(<AiTutorPage />);

    await correctHatSentence();
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    await userEvent.click(screen.getByRole("button", { name: "Mercy đọc câu đã sửa bằng giọng AI" }));

    await waitFor(() => {
      expect(screen.getByTestId("ai-tutor-speak-tts-error")).toHaveTextContent(
        "Không nghe thấy? Kiểm tra âm lượng hoặc thử bấm lại.",
      );
    });
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

  it("updates Logic when the learner changes to a new corrected sentence", async () => {
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
    render(<AiTutorPage />);

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
});
