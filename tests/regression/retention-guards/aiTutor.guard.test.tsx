// Retention surface guard — AiTutor study-completion seam (recordActiveDay), gated on
// activeTodayLesson && studySessionState. Plus dead-handler silence.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({ record: vi.fn() }));
vi.mock("@/lib/retention/recordActiveDay", () => ({ recordActiveDay: h.record }));
vi.mock("@/providers/AuthProvider", () => ({ useAuth: vi.fn(() => ({ user: null, isLoading: false })) }));
vi.mock("@/lib/ai-tutor/learningMemory", () => ({
  putCorrection: vi.fn(async () => {}),
  getMemorySummary: vi.fn(async () => ({
    tutorProduct: "ai-tutor", targetLanguage: "en", memoryKey: "ai-tutor:en", strengths: [], needsReview: [],
    commonMistakePatterns: [], nextRecommendedFocus: "", confidenceTrend: "not-enough-data", updatedAt: null,
    totalCorrections: 0, practicedCount: 0, strongestTopic: "", strongestTopicCount: 0, topicNeedingReview: "",
    topicNeedingReviewCount: 0, lastPracticedTopic: "", lastPracticedAt: null, suggestedNextFocus: "",
    topicCounts: {}, unpracticedCorrectionIds: [],
  })),
  markPracticed: vi.fn(async () => {}),
}));
vi.mock("@/lib/mercyVoice", () => ({ fetchCloudTtsUrl: vi.fn(async () => null) }));
vi.mock("@/lib/placement/availability", () => ({ isPlacementEntryRouteAvailable: vi.fn(() => false) }));

import AiTutorPage from "@/pages/AiTutor";
import { startStudySession } from "@/lib/tutor/studySessionState";

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.pushState({}, "", "/ai-tutor");
  window.localStorage.setItem("mercyblade.lessonUiLang", "vi");
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
  Object.defineProperty(window, "speechSynthesis", { configurable: true, value: undefined });
  Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: undefined });
  Object.defineProperty(window, "Audio", { configurable: true, value: undefined });
});

async function correctSentence(input: string, expected: string) {
  await userEvent.type(screen.getByRole("textbox"), input);
  await userEvent.click(screen.getByRole("button", { name: "Sửa câu này" }));
  await waitFor(() => expect(screen.getByText(expected)).toBeInTheDocument());
}

describe("retention guard — AiTutor study-completion seam", () => {
  it("POSITIVE (gate on): study completion with activeTodayLesson + studySessionState fires recordActiveDay once", async () => {
    // Seed a real study session — the mount effect loads it, setting BOTH gate states.
    startStudySession({ product: "ai-tutor", targetLanguage: "en" });
    render(<AiTutorPage />);
    await correctSentence("I buy a hat yesterday.", "I bought a hat yesterday.");
    await waitFor(() => expect(h.record).toHaveBeenCalledTimes(1));
  });

  it("GATE NEGATIVE (no study session): same submit abstains — recordActiveDay NOT fired", async () => {
    // No seeded session → loadStudySessionState returns null → gate (activeTodayLesson && studySessionState) is false.
    render(<AiTutorPage />);
    await correctSentence("I buy a hat yesterday.", "I bought a hat yesterday.");
    // give any async path a tick; assert still not called
    await new Promise((r) => setTimeout(r, 0));
    expect(h.record).not.toHaveBeenCalled();
  });
});

describe("retention guard — AiTutor dead handlers stay silent", () => {
  const src = readFileSync(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../src/pages/AiTutor.tsx"),
    "utf8",
  );
  it("recordActiveDay is called from exactly ONE seam (the study-completion gate)", () => {
    expect((src.match(/recordActiveDay\(\)/g) || []).length).toBe(1);
  });
  it("dead handlers handlePracticeSubmit / handleConversationSend are defined once and never wired (no live caller)", () => {
    // defined exactly once each
    expect((src.match(/const handlePracticeSubmit\s*=/g) || []).length).toBe(1);
    expect((src.match(/const handleConversationSend\s*=/g) || []).length).toBe(1);
    // never wired into JSX as a prop/handler (={handler}) -> no live caller
    expect(src.includes("={handlePracticeSubmit}")).toBe(false);
    expect(src.includes("={handleConversationSend}")).toBe(false);
  });
});
