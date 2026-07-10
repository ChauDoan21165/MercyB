// Residual-error promotion gate — page-level regression guard.
//
// INVARIANT
//   A correction the engine reports as "corrected" (confident) but which is STILL
//   ungrammatical must never reach the speaking-practice model slot
//   (`ai-tutor-speak-target`), because the learner reads that sentence aloud and
//   imitates it.
//
// This asserts BOTH directions, because the dangerous regression is the second one:
//   1. the five reproduced confident-but-wrong outputs are withheld, and
//   2. clean, genuinely-correct corrections still promote exactly as before.
//
// Companion to the unit tests in src/lib/tutor/__tests__/residualErrorCheck.test.ts.
//
// NOTE — this test intentionally does not depend on the SL-001 `e2e-sim/` harness,
// which is not on main (see MR !2565). When that harness lands, its
// softFailPromotion.test.tsx fixture should be extended with the same five
// sentences; this file is the main-native guard in the meantime.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AiTutorPage from "../AiTutor";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";

const CORRECTION_UNAVAILABLE_MESSAGE =
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
  fetchServerProfileInput,
  loadServerInterferenceTags,
  useAuthMock,
} = vi.hoisted(() => ({
  putCorrection: vi.fn(async () => {}),
  getMemorySummary: vi.fn(async () => ({})),
  markPracticed: vi.fn(async () => {}),
  fetchCloudTtsUrl: vi.fn(async () => null),
  fetchServerProfileInput: vi.fn(async () => ({ interferenceTagCounts: {}, sessionCount: 0 })),
  loadServerInterferenceTags: vi.fn(async () => [] as string[]),
  useAuthMock: vi.fn(() => ({ user: null, session: null, isLoading: false })),
}));

vi.mock("@/providers/AuthProvider", () => ({ useAuth: useAuthMock }));
vi.mock("@/lib/ai-tutor/learningMemory", () => ({ putCorrection, getMemorySummary, markPracticed }));
vi.mock("@/lib/mercyVoice", () => ({ fetchCloudTtsUrl }));
vi.mock("@/lib/placement/availability", () => ({
  isPlacementEntryRouteAvailable: vi.fn(() => false),
}));
vi.mock("@/lib/ai-conversation/serverInterferenceMemory", () => ({
  fetchServerProfileInput,
  loadServerInterferenceTags,
  mergeRecallMemory: () => null,
}));

function renderAiTutor() {
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
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.pushState({}, "", "/ai-tutor?native=vietnamese&target=english");
  window.localStorage.setItem("mercyb:nativeLanguage", "vietnamese");
  window.localStorage.setItem("mercyb:targetLanguage", "english");
  window.localStorage.setItem("mercyblade.lessonUiLang", "vi");
  getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY } as never);
  fetchServerProfileInput.mockResolvedValue({ interferenceTagCounts: {}, sessionCount: 0 });
  loadServerInterferenceTags.mockResolvedValue([]);
  fetchCloudTtsUrl.mockResolvedValue(null as never);
  useAuthMock.mockReturnValue({ user: null, session: null, isLoading: false });
  Object.defineProperty(window, "speechSynthesis", { configurable: true, value: undefined });
  Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: undefined });
  Object.defineProperty(window, "Audio", { configurable: true, value: undefined });
});

async function submitForCorrection(sentence: string) {
  await userEvent.type(screen.getByRole("textbox"), sentence);
  await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Sửa câu này" })).toBeEnabled());
}

async function openSpeakTab() {
  await userEvent.click(
    within(screen.getByTestId("teacher-mercy-mode-tabs")).getByRole("button", { name: "Luyện nói" }),
  );
}

/**
 * Learner input → the confident-but-ungrammatical sentence the engine produced and
 * promoted on main. Each is annotated with the residual error the engine left behind.
 */
const CONFIDENT_BUT_WRONG: Array<{ input: string; promotedOnMain: string; residual: string }> = [
  {
    input: "Yesterday I go to school and I no have book.",
    promotedOnMain: "Yesterday I went to school and I no have book.",
    residual: "uncorrected negation: 'I no have'",
  },
  {
    input: "He go to work by bus everyday and he no late.",
    promotedOnMain: "He goes to work by bus everyday and he no late.",
    residual: "uncorrected negation: 'he no late'",
  },
  {
    input: "My father he is teacher and he teach math at school.",
    promotedOnMain: "My father he is a teacher and he teach math at school.",
    residual: "subject-verb agreement: 'he teach'",
  },
  {
    input: "There have many people in the party yesterday.",
    promotedOnMain: "There are many people in the party yesterday there.",
    residual: "doubled token: trailing 'there'",
  },
  {
    input: "Because I am tired, so I go sleep early.",
    promotedOnMain: "Because I am tired, I go sleep early.",
    residual: "bare infinitive after motion verb: 'go sleep'",
  },
];

describe("residual-error gate — confident-but-wrong corrections never reach the model slot", () => {
  it.each(CONFIDENT_BUT_WRONG)(
    "withholds $residual",
    async ({ input, promotedOnMain }) => {
      renderAiTutor();
      await submitForCorrection(input);

      // The broken sentence is never shown as a correction…
      expect(screen.queryByText(promotedOnMain)).not.toBeInTheDocument();
      // …the learner gets the same safe message the soft-fail path uses…
      expect(await screen.findByText(CORRECTION_UNAVAILABLE_MESSAGE)).toBeInTheDocument();
      // …and the send-to-speak affordance never appears.
      expect(
        screen.queryByRole("button", { name: "Đưa câu này sang Luyện nói" }),
      ).not.toBeInTheDocument();

      // Hard assertion: the speak-practice model slot never carries it.
      await openSpeakTab();
      const slot = await screen.findByTestId("ai-tutor-speak-target");
      expect(slot).not.toHaveTextContent(promotedOnMain);
      expect(screen.getByTestId("ai-tutor-speak-generic-prompt")).toBeInTheDocument();
    },
  );
});

/**
 * PRECISION GATE — load-bearing. Withholding a good correction is the failure mode
 * this change must not introduce. These promote today and must keep promoting.
 */
const CLEAN_CORRECTIONS: Array<{ input: string; corrected: string }> = [
  { input: "She go to school every day.", corrected: "She goes to school every day." },
  { input: "He go to work by bus.", corrected: "He goes to work by bus." },
];

describe("precision gate — genuinely-correct corrections still promote unchanged", () => {
  it.each(CLEAN_CORRECTIONS)("promotes $corrected", async ({ input, corrected }) => {
    renderAiTutor();
    await submitForCorrection(input);

    // The correction is shown, not withheld.
    expect(await screen.findByText(corrected)).toBeInTheDocument();
    expect(screen.queryByText(CORRECTION_UNAVAILABLE_MESSAGE)).not.toBeInTheDocument();

    // And it reaches the speak-practice model slot, exactly as before this change.
    await userEvent.click(screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" }));
    expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent(corrected);
  });
});
