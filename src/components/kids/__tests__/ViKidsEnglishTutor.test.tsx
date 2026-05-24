import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ViKidsEnglishTutor from "../ViKidsEnglishTutor";

const { fetchCloudTtsUrl } = vi.hoisted(() => ({
  fetchCloudTtsUrl: vi.fn(async () => null),
}));

const { getMemorySummary } = vi.hoisted(() => ({
  getMemorySummary: vi.fn(async () => ({
    tutorProduct: "vi-kids-english",
    targetLanguage: "en",
    memoryKey: "vi-kids-english:en",
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
  })),
}));

vi.mock("@/lib/mercyVoice", () => ({
  fetchCloudTtsUrl,
}));

vi.mock("@/lib/ai-tutor/learningMemory", () => ({
  getMemorySummary,
}));

beforeEach(() => {
  vi.clearAllMocks();
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
});

describe("ViKidsEnglishTutor", () => {
  it("uses the shared Teacher Mercy shell with Việt Kids English copy", async () => {
    render(<ViKidsEnglishTutor />);

    expect(screen.getByTestId("vi-kids-english-tutor")).toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-avatar")).toHaveAttribute("src", "/teacher-mercy.webp");
    expect(screen.getByRole("heading", { name: "Teacher Mercy · English for Việt Kids" })).toBeInTheDocument();
    expect(screen.getByText(/Giải thích tiếng Việt/)).toBeInTheDocument();
    await waitFor(() => expect(getMemorySummary).toHaveBeenCalledWith("vi-kids-english", "en"));
    expect(screen.getByRole("button", { name: "Journey" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Grammar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Speak" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logic" })).toBeInTheDocument();
    expect(screen.getByText("Kids-safe practice")).toBeInTheDocument();
  });

  it("keeps English-only practice with Vietnamese-first explanation", async () => {
    render(<ViKidsEnglishTutor />);

    await userEvent.click(screen.getByRole("button", { name: "Grammar" }));

    expect(screen.getByText("She goes to school every day.")).toBeInTheDocument();
    expect(screen.getByText(/Với she\/he\/it/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/She go to school every day/)).toBeInTheDocument();
  });

  it("does not render disabled product modes", () => {
    render(<ViKidsEnglishTutor />);

    expect(screen.queryByRole("button", { name: "Correction" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Correct one sentence" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Start realtime voice" })).not.toBeInTheDocument();
  });
});
