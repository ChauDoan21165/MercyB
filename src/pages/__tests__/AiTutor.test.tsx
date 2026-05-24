// src/pages/__tests__/AiTutor.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AiTutorPage from "../AiTutor";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";

const EMPTY_SUMMARY: MemorySummary = {
  totalCorrections: 0, practicedCount: 0, strongestTopic: "", strongestTopicCount: 0,
  topicNeedingReview: "", topicNeedingReviewCount: 0,
  lastPracticedTopic: "", lastPracticedAt: null, suggestedNextFocus: "",
};

const POPULATED_SUMMARY: MemorySummary = {
  totalCorrections: 6, practicedCount: 4, strongestTopic: "present-simple", strongestTopicCount: 3,
  topicNeedingReview: "past-tense", topicNeedingReviewCount: 1,
  lastPracticedTopic: "articles", lastPracticedAt: Date.now(), suggestedNextFocus: "past-tense",
};

const { putCorrection, getMemorySummary, markPracticed } = vi.hoisted(() => ({
  putCorrection: vi.fn(async () => {}),
  getMemorySummary: vi.fn(async () => ({ ...EMPTY_SUMMARY })),
  markPracticed: vi.fn(async () => {}),
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: vi.fn(() => ({ user: null, isLoading: false })),
}));

vi.mock("@/lib/ai-tutor/learningMemory", () => ({
  putCorrection, getMemorySummary, markPracticed,
}));

beforeEach(() => {
  vi.clearAllMocks();
  window.history.pushState({}, "", "/ai-tutor");
  (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = undefined;
  (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition = undefined;
  getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
});

describe("AiTutor mock UI", () => {
  it("renders the mock badge", () => {
    render(<AiTutorPage />);
    expect(screen.getByText("Mock")).toBeInTheDocument();
  });

  it("keeps Teacher Mercy avatar and header visible after memory loads", async () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-mercy-avatar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Teacher Mercy AI Tutor/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByTestId("ai-tutor-mercy-avatar")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Teacher Mercy AI Tutor/ })).toBeInTheDocument();
  });

  it("shows microphone fallback when browser speech recognition is unavailable", () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-mic-fallback")).toHaveTextContent(/Microphone unavailable/);
  });

  it("shows microphone control when browser speech recognition is supported", () => {
    (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition = vi.fn();
    render(<AiTutorPage />);
    expect(screen.getByRole("button", { name: /Speak sentence/ })).toBeInTheDocument();
  });

  it("keeps French target copy after hydration", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=fr");
    render(<AiTutorPage />);
    expect(screen.getByRole("heading", { name: /French Tutor/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByText(/Pratique le français/)).toBeInTheDocument();
  });

  it("keeps Chinese target copy after hydration", async () => {
    window.history.pushState({}, "", "/ai-tutor?target=zh");
    render(<AiTutorPage />);
    expect(screen.getByRole("heading", { name: /Chinese Tutor/ })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByText(/练习中文/)).toBeInTheDocument();
  });

  it("defaults to floating-safe layout until the container is measured wide", () => {
    render(<AiTutorPage />);
    expect(screen.getByTestId("ai-tutor-shell")).toHaveAttribute("data-floating-shell", "true");
  });

  it("shows empty state before first submit", () => {
    render(<AiTutorPage />);
    expect(screen.getByText(/AI sẵn sàng sửa câu của bạn/)).toBeInTheDocument();
  });

  it("shows button disabled with empty input", () => {
    render(<AiTutorPage />);
    expect(screen.getByRole("button", { name: /Sửa câu này/ })).toBeDisabled();
  });

  it("enables button when input has text", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    expect(screen.getByRole("button", { name: /Sửa câu này/ })).toBeEnabled();
  });

  it("shows loading state after submit", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    expect(screen.getByText(/AI đang phân tích/)).toBeInTheDocument();
  });

  it("shows corrected sentence after loading", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "She go to school");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => {
      expect(screen.getByText("She goes to school every day.")).toBeInTheDocument();
    });
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
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
  });

  it("submit practice shows mock feedback", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
    const textareas = screen.getAllByRole("textbox");
    await userEvent.type(textareas[1], "my practice answer");
    await userEvent.click(screen.getByRole("button", { name: /Gửi câu trả lời/ }));
    await waitFor(() => expect(screen.getByText(/Nhận xét/)).toBeInTheDocument());
  });

  it("reset clears correction and practice state", async () => {
    render(<AiTutorPage />);
    await userEvent.type(screen.getByRole("textbox"), "test");
    await userEvent.click(screen.getByRole("button", { name: /Sửa câu này/ }));
    await waitFor(() => expect(screen.getByText(/Luyện tập/)).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /Làm mới/ }));
    expect(screen.getByText(/AI sẵn sàng sửa câu của bạn/)).toBeInTheDocument();
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
    const textareas = screen.getAllByRole("textbox");
    await userEvent.type(textareas[1], "my practice");
    await userEvent.click(screen.getByRole("button", { name: /Gửi câu trả lời/ }));
    await waitFor(() => expect(markPracticed).toHaveBeenCalledTimes(1));
  });

  // ── M3: Aggregate memory card ────────────────────────────────────

  it("M3: shows reminder card when memory exists", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-card")).toBeInTheDocument());
    expect(screen.getByText(/6 câu đã sửa/)).toBeInTheDocument();
    expect(screen.getByText(/4 đã luyện tập/)).toBeInTheDocument();
  });

  it("M3: shows strongest topic chip", async () => {
    getMemorySummary.mockResolvedValue({ ...POPULATED_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByText(/Mạnh nhất: present-simple/)).toBeInTheDocument());
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
    await waitFor(() => expect(screen.getByText(/Gợi ý tiếp theo: past-tense/)).toBeInTheDocument());
  });

  it("M3: shows empty memory state when no corrections", async () => {
    getMemorySummary.mockResolvedValue({ ...EMPTY_SUMMARY });
    render(<AiTutorPage />);
    await waitFor(() => expect(screen.getByTestId("ai-tutor-memory-empty")).toBeInTheDocument());
    expect(screen.getByText(/Chưa có lịch sử sửa câu/)).toBeInTheDocument();
  });

  it("M3: reminder card hidden when memory not yet loaded", () => {
    getMemorySummary.mockReturnValue(new Promise(() => {}));
    render(<AiTutorPage />);
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
