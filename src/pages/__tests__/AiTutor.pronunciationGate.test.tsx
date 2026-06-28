import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AiTutorPage from "../AiTutor";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";

const AI_TUTOR_TEST_PAIR_PATH = "/ai-tutor?native=vietnamese&target=english";

function seedAiTutorTestPair() {
  window.history.pushState({}, "", AI_TUTOR_TEST_PAIR_PATH);
  window.localStorage.setItem("mercyb:nativeLanguage", "vietnamese");
  window.localStorage.setItem("mercyb:targetLanguage", "english");
  window.localStorage.setItem("mercyb:selectedPair", JSON.stringify({ native: "vietnamese", target: "english" }));
  window.localStorage.setItem("mercyb:languagePair", JSON.stringify({ native: "vietnamese", target: "english" }));
  window.localStorage.setItem("mercyb:pair", JSON.stringify({ native: "vietnamese", target: "english" }));
}

beforeEach(() => {
  seedAiTutorTestPair();
});


const C4_CI_GATE_TIMEOUT_MS = 45_000;
vi.setConfig({ testTimeout: C4_CI_GATE_TIMEOUT_MS });
// Premium/trial detailed-scoring gate (Decisions 1 & 2) — runtime wiring proof.
// The gate flag is a compile-time constant, so we flip it ON for the whole file
// (a separate file keeps the default-OFF behavior of the main AiTutor suite
// intact) and mock the provider-free premium signal per test.

const premiumSignal = vi.hoisted(() => ({ current: false }));
vi.mock("@/hooks/useSpeakDetailEntitlement", () => ({
  useSpeakDetailEntitlement: () => premiumSignal.current,
}));

vi.mock("@/lib/featureFlags", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/featureFlags")>();
  return {
    ...actual,
    FEATURE_FLAGS: {
      ...actual.FEATURE_FLAGS,
      AI_TUTOR_PRONUNCIATION_PREMIUM_GATE_ENABLED: true,
    },
  };
});

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

const { getMemorySummary, putCorrection, markPracticed, fetchCloudTtsUrl } =
  vi.hoisted(() => ({
    getMemorySummary: vi.fn(async () => ({ ...EMPTY_SUMMARY })),
    putCorrection: vi.fn(async () => {}),
    markPracticed: vi.fn(async () => {}),
    fetchCloudTtsUrl: vi.fn(async () => null),
  }));

const useAuthMock = vi.hoisted(() => vi.fn());
vi.mock("@/providers/AuthProvider", () => ({ useAuth: useAuthMock }));
vi.mock("@/lib/ai-tutor/learningMemory", () => ({
  putCorrection,
  getMemorySummary,
  markPracticed,
}));
vi.mock("@/lib/mercyVoice", () => ({ fetchCloudTtsUrl }));
vi.mock("@/lib/placement/availability", () => ({
  isPlacementEntryRouteAvailable: vi.fn(() => false),
}));

function renderAiTutor() {
  seedAiTutorTestPair();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AiTutorPage />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  premiumSignal.current = false;
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.pushState({}, "", "/ai-tutor");
  window.localStorage.setItem("mercyblade.lessonUiLang", "vi");
  getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
  // Logged-in learner; premium/free is controlled by the entitlement mock.
  useAuthMock.mockReturnValue({
    user: { id: "00000000-0000-4000-8000-000000000001" },
    session: { access_token: "tok" },
    isLoading: false,
  });
});

async function openSpeakWithTarget() {
  await userEvent.type(screen.getByRole("textbox"), "I buy a hat yesterday.");
  await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
  await waitFor(() =>
    expect(
      screen.getAllByText("I bought a hat yesterday.").length
    ).toBeGreaterThan(0)
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Đưa câu này sang Luyện nói" })
  );
  expect(screen.getByTestId("ai-tutor-speak-target")).toHaveTextContent(
    "I bought a hat yesterday."
  );
}

describe("AiTutor — detailed-scoring premium gate (flag ON)", () => {
  it("free learner sees NO detailed score card (no fake number) but keeps by-ear compare", async () => {
    premiumSignal.current = false;
    renderAiTutor();
    await openSpeakWithTarget();

    // The free by-ear self-compare loop is present and usable.
    expect(screen.getByTestId("self-compare-recorder")).toBeInTheDocument();

    // Type a spoken-back attempt — this would normally drive the scorer.
    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I bought a hat yesterday."
    );
    // Wait past the scorer debounce; the gate must suppress the card entirely.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));
    });
    expect(
      screen.queryByTestId("ai-tutor-speak-score")
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+%/)).not.toBeInTheDocument();
  });

  it("premium learner is allowed through the gate (honest no-number card appears)", async () => {
    premiumSignal.current = true;
    renderAiTutor();
    await openSpeakWithTarget();

    await userEvent.type(
      screen.getByRole("textbox", { name: "Gõ câu bạn đọc lại" }),
      "I bought a hat yesterday."
    );

    // Gate allows → the scorer runs; with no Azure batch in test it lands the
    // honest local card (no percent), never a fake number.
    const card = await screen.findByTestId("ai-tutor-speak-score");
    expect(card).toHaveTextContent("Đang nghe, chấm điểm chi tiết sẽ có sau.");
    expect(card.textContent ?? "").not.toMatch(/\d+%/);
    expect(
      screen.queryByTestId("ai-tutor-speak-detail-cap")
    ).not.toBeInTheDocument();
  });
});
