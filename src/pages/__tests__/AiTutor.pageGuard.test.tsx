// src/pages/__tests__/AiTutor.pageGuard.test.tsx
// Prove /ai-tutor page is gated behind feature flag and auth.
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AiTutorPage from "../AiTutor";

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

describe("AiTutor page guard", () => {
  it("renders the page when feature flag is on", () => {
    render(
      <MemoryRouter initialEntries={["/ai-tutor"]}>
        <AiTutorPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /Sửa tiếng Anh với Mercy/ })).toBeInTheDocument();
  });

  it("greeting avoids email", () => {
    render(
      <MemoryRouter initialEntries={["/ai-tutor"]}>
        <AiTutorPage />
      </MemoryRouter>,
    );
    const greeting = screen.getByTestId("ai-tutor-greeting");
    expect(greeting).toBeInTheDocument();
    expect(greeting.textContent).not.toMatch(/@/);
  });
});
