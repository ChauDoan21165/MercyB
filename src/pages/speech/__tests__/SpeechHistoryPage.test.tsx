import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// ── Mocks ─────────────────────────────────────────────────────────────

const useFeatureFlagMock = vi.fn();
vi.mock("@/hooks/useFeatureFlag", () => ({
  useFeatureFlag: (...args: unknown[]) => useFeatureFlagMock(...args),
}));

const getUserStatsMock = vi.fn();
const getAttemptsMock = vi.fn();
// Full stub — importActual would load the real service, which imports
// the Supabase client and blows up in the test env (no VITE_SUPABASE_*).
vi.mock("@/services/speechHistory", () => ({
  getUserStats: (...args: unknown[]) => getUserStatsMock(...args),
  getAttempts: (...args: unknown[]) => getAttemptsMock(...args),
  EMPTY_STATS: {
    attempts_7d: 0,
    attempts_30d: 0,
    attempts_90d: 0,
    avg_score_7d: null,
    avg_score_30d: null,
    avg_score_90d: null,
    last_attempt_at: null,
    median_elapsed_ms_90d: null,
  },
}));

import SpeechHistoryPage from "../SpeechHistoryPage";

function renderWith() {
  return render(
    <MemoryRouter initialEntries={["/speech/history"]}>
      <Routes>
        <Route path="/speech/history" element={<SpeechHistoryPage />} />
        <Route
          path="/"
          element={<div data-testid="home-landing">HOME</div>}
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  useFeatureFlagMock.mockReset();
  getUserStatsMock.mockReset();
  getAttemptsMock.mockReset();
  cleanup();
});

// ── Tests ─────────────────────────────────────────────────────────────

describe("SpeechHistoryPage — flag gating", () => {
  it("renders a loading placeholder while the flag is resolving", () => {
    useFeatureFlagMock.mockReturnValue({ enabled: false, loading: true });
    renderWith();
    expect(screen.getByText(/Loading/i)).toBeTruthy();
    expect(screen.queryByTestId("home-landing")).toBeNull();
  });

  it("redirects to / when flag is off", async () => {
    useFeatureFlagMock.mockReturnValue({ enabled: false, loading: false });
    renderWith();
    await waitFor(() => {
      expect(screen.getByTestId("home-landing")).toBeTruthy();
    });
  });
});

describe("SpeechHistoryPage — happy path", () => {
  beforeEach(() => {
    useFeatureFlagMock.mockReturnValue({ enabled: true, loading: false });
  });

  it("renders the big average score + window cells after data loads", async () => {
    getUserStatsMock.mockResolvedValueOnce({
      attempts_7d: 4,
      attempts_30d: 12,
      attempts_90d: 30,
      avg_score_7d: 82,
      avg_score_30d: 78,
      avg_score_90d: 75,
      last_attempt_at: "2026-04-25T10:00:00Z",
      median_elapsed_ms_90d: 3200,
    });
    getAttemptsMock.mockResolvedValueOnce([
      {
        id: "a1",
        target_text: "The word is water.",
        transcript: "the word is water",
        overall_score: 88,
        word_scores: [
          { word: "the", score: 95 },
          { word: "water", score: 80 },
        ],
        attempted_at: new Date(Date.now() - 3_600_000).toISOString(), // 1 hour ago
        elapsed_ms: 2400,
        context: null,
        room_id: null,
      },
    ]);

    renderWith();

    await waitFor(() => {
      // big average score renders
      expect(screen.getByLabelText(/Average score 75 out of 100/i)).toBeTruthy();
    });
    // window labels
    expect(screen.getByText(/Last 7 days/)).toBeTruthy();
    expect(screen.getByText(/7 ngày gần nhất/)).toBeTruthy();
    // attempt rendered
    expect(screen.getByText(/The word is water/i)).toBeTruthy();
  });

  it("shows the trend as Improving when 7d avg is >3 above 30d avg", async () => {
    getUserStatsMock.mockResolvedValueOnce({
      attempts_7d: 5,
      attempts_30d: 20,
      attempts_90d: 50,
      avg_score_7d: 85,
      avg_score_30d: 70,
      avg_score_90d: 65,
      last_attempt_at: null,
      median_elapsed_ms_90d: null,
    });
    getAttemptsMock.mockResolvedValueOnce([]);

    renderWith();
    await waitFor(() => {
      expect(screen.getByLabelText(/Trend: Improving/i)).toBeTruthy();
    });
  });

  it("renders the empty state when the user has no attempts", async () => {
    getUserStatsMock.mockResolvedValueOnce({
      attempts_7d: 0,
      attempts_30d: 0,
      attempts_90d: 0,
      avg_score_7d: null,
      avg_score_30d: null,
      avg_score_90d: null,
      last_attempt_at: null,
      median_elapsed_ms_90d: null,
    });
    getAttemptsMock.mockResolvedValueOnce([]);

    renderWith();

    await waitFor(() => {
      expect(screen.getByTestId("speech-history-empty")).toBeTruthy();
    });
    expect(
      screen.getByText(/You haven't practiced pronunciation yet/i),
    ).toBeTruthy();
    expect(
      screen.getByText(/Bạn chưa luyện phát âm lần nào/i),
    ).toBeTruthy();
  });

  it("expands a row on click to show the word-by-word breakdown", async () => {
    getUserStatsMock.mockResolvedValueOnce({
      attempts_7d: 1,
      attempts_30d: 1,
      attempts_90d: 1,
      avg_score_7d: 70,
      avg_score_30d: 70,
      avg_score_90d: 70,
      last_attempt_at: new Date().toISOString(),
      median_elapsed_ms_90d: 3000,
    });
    getAttemptsMock.mockResolvedValueOnce([
      {
        id: "a1",
        target_text: "Hello world.",
        transcript: "hello word",
        overall_score: 70,
        word_scores: [
          { word: "Hello", score: 95, status: "correct" },
          { word: "world", score: 35, status: "approx" },
        ],
        attempted_at: new Date().toISOString(),
        elapsed_ms: 2100,
        context: null,
        room_id: null,
      },
    ]);

    renderWith();

    const toggle = await waitFor(() =>
      screen.getByTestId("attempt-row-toggle"),
    );
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    // Before expand: word pills not in document
    expect(screen.queryByText(/Hello · 95/)).toBeNull();

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(/Hello · 95/i)).toBeTruthy();
    expect(screen.getByText(/world · 35/i)).toBeTruthy();
    expect(screen.getByText(/Heard:/i)).toBeTruthy();
  });

  it("surfaces load errors in a visible alert", async () => {
    getUserStatsMock.mockRejectedValueOnce(new Error("boom"));
    getAttemptsMock.mockResolvedValueOnce([]);
    renderWith();
    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toMatch(/boom/);
    });
  });
});
