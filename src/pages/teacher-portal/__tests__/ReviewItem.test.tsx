// ReviewItem tests — form validation + submit behavior.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ReviewItem from "../ReviewItem";

const fromMock = vi.fn();
const getUserMock = vi.fn();
const invokeMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
    auth: {
      getUser: () => getUserMock(),
    },
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
  },
}));

interface InsertResult {
  error: { message: string } | null;
}

function buildInsertBuilder(result: InsertResult) {
  const insert = vi.fn().mockResolvedValue({ data: null, ...result });
  return { insert };
}

function buildUpdateBuilder() {
  const eq2 = vi.fn().mockResolvedValue({ data: null, error: null });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const update = vi.fn().mockReturnValue({ eq: eq1 });
  return { update, eq1, eq2 };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  getUserMock.mockResolvedValue({
    data: { user: { id: "teacher-uid-1" } },
    error: null,
  });
  invokeMock.mockResolvedValue({ data: {}, error: null });

  // Stub fetch (used by ReviewItem only when content_type === 'room')
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function renderAt(itemId: string) {
  return render(
    <MemoryRouter initialEntries={[`/teacher/review/${itemId}`]}>
      <Routes>
        <Route path="/teacher/review/:itemId" element={<ReviewItem />} />
        <Route path="/teacher" element={<div>Queue page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ReviewItem", () => {
  it("blocks submit when no decision is selected", async () => {
    renderAt("ielts:ielts_speaking_part1_hometown");

    const submitBtn = await screen.findByRole("button", { name: /Gửi đánh giá/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toMatch(/Vui lòng chọn quyết định/);
    });
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("inserts a teacher_feedback row with the right fields on submit", async () => {
    const insertBuilder = buildInsertBuilder({ error: null });
    const updateBuilder = buildUpdateBuilder();
    let call = 0;
    fromMock.mockImplementation((table: string) => {
      call++;
      if (table === "teacher_feedback") return insertBuilder;
      if (table === "content_review_status") return updateBuilder;
      throw new Error(`unexpected table ${table} (call ${call})`);
    });

    renderAt("ielts:ielts_speaking_part1_hometown");

    // Choose "Approve" decision.
    const approveRadio = await screen.findByLabelText(/Duyệt/);
    fireEvent.click(approveRadio);

    fireEvent.click(screen.getByRole("button", { name: /Gửi đánh giá/i }));

    await waitFor(() => {
      expect(insertBuilder.insert).toHaveBeenCalledTimes(1);
    });
    const args = insertBuilder.insert.mock.calls[0][0];
    expect(args).toMatchObject({
      content_id: "ielts_speaking_part1_hometown",
      content_type: "ielts",
      reviewer_id: "teacher-uid-1",
      decision: "approve",
      severity: "3",
      status: "open",
    });
    expect(Array.isArray(args.issues)).toBe(true);
  });

  it("updates content_review_status with last_reviewed_at + reviewer_id on submit", async () => {
    const insertBuilder = buildInsertBuilder({ error: null });
    const updateBuilder = buildUpdateBuilder();
    fromMock.mockImplementation((table: string) => {
      if (table === "teacher_feedback") return insertBuilder;
      if (table === "content_review_status") return updateBuilder;
      throw new Error(`unexpected table ${table}`);
    });

    renderAt("vstep:vstep_topic_1");

    const needsRevisionRadio = await screen.findByLabelText(/Cần chỉnh sửa/);
    fireEvent.click(needsRevisionRadio);
    fireEvent.click(screen.getByRole("button", { name: /Gửi đánh giá/i }));

    await waitFor(() => {
      expect(updateBuilder.update).toHaveBeenCalledTimes(1);
    });
    const updateArgs = updateBuilder.update.mock.calls[0][0];
    expect(updateArgs.status).toBe("needs_revision");
    expect(typeof updateArgs.last_reviewed_at).toBe("string");
    expect(updateArgs.reviewer_id).toBe("teacher-uid-1");
  });
});
