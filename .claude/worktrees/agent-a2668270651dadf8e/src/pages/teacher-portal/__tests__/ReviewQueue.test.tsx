// ReviewQueue tests — empty state per tab + filtering by content_type.
//
// We mock the supabase singleton with a chained-builder shape that
// matches the call:
//   supabase.from("content_review_status")
//           .select("*")
//           .in("status", [...])
//           .order(...)
//           .limit(...)

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ReviewQueue from "../ReviewQueue";

const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

interface QueueRow {
  content_id: string;
  content_type: string;
  status: string;
  marked_for_review_at: string | null;
  last_reviewed_at: string | null;
  reviewer_id: string | null;
}

function buildBuilder(rows: QueueRow[]) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
  const order = vi.fn().mockReturnValue({ limit });
  const inFn = vi.fn().mockReturnValue({ order });
  const select = vi.fn().mockReturnValue({ in: inFn });
  return { select };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderQueue() {
  return render(
    <MemoryRouter>
      <ReviewQueue />
    </MemoryRouter>,
  );
}

describe("ReviewQueue", () => {
  it("shows the per-tab empty state when no rows exist for the active tab", async () => {
    fromMock.mockReturnValue(buildBuilder([]));

    renderQueue();

    // Default tab is VSTEP. Match the Vietnamese empty-state text.
    await waitFor(() => {
      expect(screen.getByText(/Không có mục nào cần duyệt cho VSTEP/i)).toBeInTheDocument();
    });
  });

  it("filters rows by content_type for the active tab", async () => {
    const rows: QueueRow[] = [
      {
        content_id: "ielts_speaking_part1_hometown",
        content_type: "ielts",
        status: "in_review",
        marked_for_review_at: "2026-04-27T00:00:00Z",
        last_reviewed_at: null,
        reviewer_id: null,
      },
      {
        content_id: "vstep_topic_1",
        content_type: "vstep",
        status: "in_review",
        marked_for_review_at: "2026-04-27T00:00:00Z",
        last_reviewed_at: null,
        reviewer_id: null,
      },
    ];
    fromMock.mockReturnValue(buildBuilder(rows));

    renderQueue();

    // VSTEP tab is default — should show the vstep row, not the ielts one.
    await waitFor(() => {
      expect(screen.getByText("vstep_topic_1")).toBeInTheDocument();
    });
    expect(screen.queryByText("ielts_speaking_part1_hometown")).not.toBeInTheDocument();
  });

  it("renders a tab-count badge that reflects rows for that content_type", async () => {
    const rows: QueueRow[] = [
      {
        content_id: "ielts_a",
        content_type: "ielts",
        status: "in_review",
        marked_for_review_at: null,
        last_reviewed_at: null,
        reviewer_id: null,
      },
      {
        content_id: "ielts_b",
        content_type: "ielts",
        status: "in_review",
        marked_for_review_at: null,
        last_reviewed_at: null,
        reviewer_id: null,
      },
    ];
    fromMock.mockReturnValue(buildBuilder(rows));

    renderQueue();

    // The IELTS tab should show a "2" count badge.
    await waitFor(() => {
      const ieltsButton = screen.getByRole("button", { name: /IELTS/i });
      expect(ieltsButton.textContent).toMatch(/2/);
    });
  });
});
