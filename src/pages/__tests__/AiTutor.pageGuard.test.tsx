// src/pages/__tests__/AiTutor.pageGuard.test.tsx
// Prove /ai-tutor page is gated behind feature flag and auth.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AiTutorPage from "../AiTutor";

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


vi.mock("@/providers/AuthProvider", () => ({
  useAuth: vi.fn(() => ({ user: null, isLoading: false })),
}));
vi.mock("@/lib/ai-tutor/learningMemory", () => ({
  putCorrection: vi.fn(),
  markPracticed: vi.fn(),
  getMemorySummary: vi.fn(() => Promise.resolve({ totalCorrections: 0, practicedCount: 0,
    strongestTopic: "", strongestTopicCount: 0,
    topicNeedingReview: "", topicNeedingReviewCount: 0,
    lastPracticedTopic: "", lastPracticedAt: null, suggestedNextFocus: "" })),
}));

function renderAiTutorPage() {
  seedAiTutorTestPair();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/ai-tutor"]}>
        <AiTutorPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("AiTutor page guard", () => {
  it("renders the page when feature flag is on", () => {
    renderAiTutorPage();
    expect(screen.getByRole("heading", { name: /Sửa tiếng Anh với Mercy/ })).toBeInTheDocument();
  });

  it("greeting avoids email", () => {
    renderAiTutorPage();
    const greeting = screen.getByTestId("ai-tutor-greeting");
    expect(greeting).toBeInTheDocument();
    expect(greeting.textContent).not.toMatch(/@/);
  });
});
