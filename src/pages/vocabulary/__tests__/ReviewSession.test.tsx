import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ── Mocks ──────────────────────────────────────────────────────────────

const useAuthMock = vi.fn();
vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => useAuthMock(),
}));

const fetchDueQueueMock = vi.fn();
const fetchNextScheduledAtMock = vi.fn();
const recordReviewMock = vi.fn();
vi.mock("@/lib/vocabulary/repository", () => ({
  fetchDueQueue: (...args: unknown[]) => fetchDueQueueMock(...args),
  fetchNextScheduledAt: (...args: unknown[]) => fetchNextScheduledAtMock(...args),
  recordReview: (...args: unknown[]) => recordReviewMock(...args),
}));

import { ReviewSessionView } from "../ReviewSession";
import type { VocabularyEntry } from "@/lib/vocabulary/repository";

function entry(overrides: Partial<VocabularyEntry> = {}): VocabularyEntry {
  return {
    id: "v-1",
    user_id: "u-1",
    word: "ephemeral",
    ipa: "/ɪˈfemərəl/",
    definition_vi: "phù du, ngắn ngủi",
    definition_en: "lasting for a very short time",
    example_sentence: "Beauty is ephemeral.",
    source: "ielts:reading:passage_1",
    repetitions: 0,
    interval_days: 0,
    ease: 2.5,
    last_rating: null,
    next_review_at: new Date(0).toISOString(),
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    ...overrides,
  };
}

function renderWith(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

beforeEach(() => {
  useAuthMock.mockReset();
  fetchDueQueueMock.mockReset();
  fetchNextScheduledAtMock.mockReset();
  recordReviewMock.mockReset();
  useAuthMock.mockReturnValue({ user: { id: "u-1" }, isLoading: false });
});

afterEach(() => {
  cleanup();
});

// ── Tests ──────────────────────────────────────────────────────────────

describe("ReviewSession — anon user", () => {
  it("shows sign-in nudge when no user", () => {
    useAuthMock.mockReturnValue({ user: null, isLoading: false });
    renderWith(<ReviewSessionView />);
    expect(screen.getByText(/Bạn cần đăng nhập/i)).toBeInTheDocument();
  });
});

describe("ReviewSession — empty queue", () => {
  it("shows the celebration panel and a back-to-library link", async () => {
    fetchDueQueueMock.mockResolvedValue([]);
    fetchNextScheduledAtMock.mockResolvedValue(null);
    renderWith(<ReviewSessionView />);
    await waitFor(() => {
      expect(screen.getByTestId("review-done")).toBeInTheDocument();
    });
    expect(screen.getByText(/Hoàn thành/i)).toBeInTheDocument();
    expect(screen.getByText(/Về thư viện/i)).toBeInTheDocument();
  });

  it("formats next review in hours when due within 24h", async () => {
    fetchDueQueueMock.mockResolvedValue([]);
    const now = Date.now();
    const inFiveHours = new Date(now + 5 * 60 * 60 * 1000).toISOString();
    fetchNextScheduledAtMock.mockResolvedValue(inFiveHours);
    renderWith(<ReviewSessionView nowMs={now} />);
    await waitFor(() => {
      expect(screen.getByText(/Lần ôn tiếp theo sau ~5 giờ/i)).toBeInTheDocument();
    });
  });

  it("formats next review in days when due >= 24h out", async () => {
    fetchDueQueueMock.mockResolvedValue([]);
    const now = Date.now();
    const inThreeDays = new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString();
    fetchNextScheduledAtMock.mockResolvedValue(inThreeDays);
    renderWith(<ReviewSessionView nowMs={now} />);
    await waitFor(() => {
      expect(screen.getByText(/sau ~3 ngày/i)).toBeInTheDocument();
    });
  });
});

describe("ReviewSession — single card flow", () => {
  it("hides the definition until the user taps reveal", () => {
    renderWith(<ReviewSessionView initialQueue={[entry()]} />);
    expect(screen.queryByTestId("definition-vi")).toBeNull();
    expect(screen.getByTestId("reveal-btn")).toBeInTheDocument();
  });

  it("shows definitions + four rating buttons after reveal", () => {
    renderWith(<ReviewSessionView initialQueue={[entry()]} />);
    fireEvent.click(screen.getByTestId("reveal-btn"));
    expect(screen.getByTestId("definition-vi")).toHaveTextContent("phù du");
    expect(screen.getByTestId("rate-again")).toBeInTheDocument();
    expect(screen.getByTestId("rate-hard")).toBeInTheDocument();
    expect(screen.getByTestId("rate-good")).toBeInTheDocument();
    expect(screen.getByTestId("rate-easy")).toBeInTheDocument();
  });

  it("calls recordReview with rating 4 when 'Tốt' is tapped", async () => {
    recordReviewMock.mockResolvedValue(entry());
    fetchNextScheduledAtMock.mockResolvedValue(null);
    renderWith(<ReviewSessionView initialQueue={[entry()]} />);
    fireEvent.click(screen.getByTestId("reveal-btn"));
    fireEvent.click(screen.getByTestId("rate-good"));
    await waitFor(() => {
      expect(recordReviewMock).toHaveBeenCalledTimes(1);
    });
    const args = recordReviewMock.mock.calls[0][0];
    expect(args.rating).toBe(4);
    expect(args.entry.id).toBe("v-1");
  });

  it("advances to the next card after a rating", async () => {
    recordReviewMock.mockResolvedValue(entry());
    const queue = [entry({ id: "v-1", word: "first" }), entry({ id: "v-2", word: "second" })];
    renderWith(<ReviewSessionView initialQueue={queue} />);
    expect(screen.getByText("first")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("reveal-btn"));
    fireEvent.click(screen.getByTestId("rate-good"));
    await waitFor(() => {
      expect(screen.getByText("second")).toBeInTheDocument();
    });
  });

  it("shows celebration after the last card is rated", async () => {
    recordReviewMock.mockResolvedValue(entry());
    fetchNextScheduledAtMock.mockResolvedValue(null);
    renderWith(<ReviewSessionView initialQueue={[entry()]} />);
    fireEvent.click(screen.getByTestId("reveal-btn"));
    fireEvent.click(screen.getByTestId("rate-easy"));
    await waitFor(() => {
      expect(screen.getByTestId("review-done")).toBeInTheDocument();
    });
    expect(screen.getByText(/1 từ đã ôn lại/i)).toBeInTheDocument();
  });
});

describe("ReviewSession — progress + tone", () => {
  it("shows 'Đã ôn 0/N' progress at session start", () => {
    const queue = [entry({ id: "a" }), entry({ id: "b" }), entry({ id: "c" })];
    renderWith(<ReviewSessionView initialQueue={queue} />);
    expect(screen.getByText(/Đã ôn 0\/3/i)).toBeInTheDocument();
  });

  it("never displays shame copy on rating 0", async () => {
    recordReviewMock.mockResolvedValue(entry());
    renderWith(<ReviewSessionView initialQueue={[entry({ id: "a" }), entry({ id: "b" })]} />);
    fireEvent.click(screen.getByTestId("reveal-btn"));
    fireEvent.click(screen.getByTestId("rate-again"));
    await waitFor(() => {
      expect(screen.getByText("ephemeral")).toBeInTheDocument();
    });
    // No "học lại" / "fail" / "wrong" copy anywhere on the page.
    expect(screen.queryByText(/học lại/i)).toBeNull();
    expect(screen.queryByText(/wrong/i)).toBeNull();
  });
});
