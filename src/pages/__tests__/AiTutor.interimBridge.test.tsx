// AI Tutor — interim English bridge routing (Thai) + Vietnamese-default regression.
//
// Covers the four scenarios from the fix brief:
//   1. Thai STORED pair + no native param  → Thai-native bridge surface (the bug repro).
//   2. Thai via explicit ?native=th        → bridge surface (unchanged behavior).
//   3. Vietnamese stored pair + no native   → default VN flow (regression guard).
//   4. The "coming soon" note renders on the bridge surface only.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AiTutorPage from "../AiTutor";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";

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

function storePair(native: string, targets: string[]) {
  window.localStorage.setItem("mercyblade.languagePair", JSON.stringify({ native, targets }));
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
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

afterEach(() => {
  window.history.pushState({}, "", "/ai-tutor");
});

describe("AI Tutor — Thai stored pair, no native param (the bug repro)", () => {
  it("routes to the Thai-native bridge surface with the coming-soon note", async () => {
    storePair("th", ["en"]);
    // No native param — the exact URL the CTA / Home nav produces.
    window.history.pushState({}, "", "/ai-tutor?target=en");

    renderAiTutor();

    const surface = await screen.findByTestId("thai-native-ai-tutor");
    expect(surface).toHaveAttribute("data-bridge-native", "th");
    expect(screen.getByText(/Teacher Mercy for Thai-speaking English learners/)).toBeInTheDocument();

    // Scenario 4 — the honest note is present on the bridge surface.
    expect(screen.getByTestId("interim-bridge-coming-soon-note")).toHaveTextContent(
      "English coaching — a Thai-specific tutor is coming.",
    );
  });
});

describe("AI Tutor — Thai via explicit ?native=th (unchanged)", () => {
  it("routes to the bridge surface from the URL native param", async () => {
    // No stored pair at all — URL alone must be sufficient, as today.
    window.history.pushState({}, "", "/ai-tutor?native=th&target=en");

    renderAiTutor();

    expect(await screen.findByTestId("thai-native-ai-tutor")).toBeInTheDocument();
    expect(screen.getByTestId("interim-bridge-coming-soon-note")).toBeInTheDocument();
  });
});

describe("AI Tutor — Vietnamese default is unchanged (regression guard)", () => {
  it("a VN stored pair with no native param never reaches the bridge surface", async () => {
    storePair("vi", ["en"]);
    window.history.pushState({}, "", "/ai-tutor?target=en");

    renderAiTutor();

    // The default tutor mounts…
    await waitFor(() => {
      expect(
        screen.queryByTestId("thai-native-ai-tutor") ??
          screen.queryByTestId("teacher-mercy-mode-tabs"),
      ).toBeTruthy();
    });
    // …and it is NOT the Thai bridge, and carries no coming-soon note.
    expect(screen.queryByTestId("thai-native-ai-tutor")).not.toBeInTheDocument();
    expect(screen.queryByTestId("interim-bridge-coming-soon-note")).not.toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-mode-tabs")).toBeInTheDocument();
  });
});
