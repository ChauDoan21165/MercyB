// TeacherFeedbackTriage tests — admin actions on teacher feedback.

import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import TeacherFeedbackTriage from "../TeacherFeedbackTriage";

const fromMock = vi.fn();
const invokeMock = vi.fn();
let warnSpy: MockInstance<typeof console.warn> | null = null;
let errorSpy: MockInstance<typeof console.error> | null = null;
let promptSpy: MockInstance<typeof window.prompt> | null = null;

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
  },
}));

interface FeedbackRow {
  id: string;
  content_id: string;
  content_type: string;
  reviewer_id: string;
  severity: string;
  issues: Array<{ category: string; note?: string }>;
  suggested_correction: string | null;
  decision: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  resolved_at: string | null;
}

function buildFeedbackBuilder(rows: FeedbackRow[]) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
  const order = vi.fn().mockReturnValue({ limit });
  const eq = vi.fn().mockReturnValue({ order });
  const select = vi.fn().mockReturnValue({ eq });
  return { select };
}

function buildProfilesBuilder(profiles: Array<{ id: string; preferred_name: string | null; email: string | null }>) {
  const inFn = vi.fn().mockResolvedValue({ data: profiles, error: null });
  const select = vi.fn().mockReturnValue({ in: inFn });
  return { select };
}

function buildFeedbackUpdateBuilder() {
  const eq = vi.fn().mockResolvedValue({ data: null, error: null });
  const update = vi.fn().mockReturnValue({ eq });
  return { update, eq };
}

function buildContentStatusUpdateBuilder() {
  const eq2 = vi.fn().mockResolvedValue({ data: null, error: null });
  const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
  const update = vi.fn().mockReturnValue({ eq: eq1 });
  return { update, eq1, eq2 };
}

const sampleRow: FeedbackRow = {
  id: "fb-1",
  content_id: "ielts_speaking_part1_hometown",
  content_type: "ielts",
  reviewer_id: "reviewer-1",
  severity: "3",
  issues: [{ category: "grammar", note: "Tense flat" }],
  suggested_correction: "Replace 'I go yesterday' with 'I went yesterday'.",
  decision: "needs_revision",
  status: "open",
  admin_response: null,
  created_at: "2026-04-27T00:00:00Z",
  resolved_at: null,
};

beforeEach(() => {
  fromMock.mockReset();
  invokeMock.mockReset();
  warnSpy?.mockRestore();
  errorSpy?.mockRestore();
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  invokeMock.mockResolvedValue({ data: {}, error: null });
});

afterEach(() => {
  cleanup();
  promptSpy?.mockRestore();
  promptSpy = null;
  warnSpy?.mockRestore();
  warnSpy = null;
  errorSpy?.mockRestore();
  errorSpy = null;
});

function renderTriage() {
  return render(
    <MemoryRouter>
      <TeacherFeedbackTriage />
    </MemoryRouter>,
  );
}

describe("TeacherFeedbackTriage", () => {
  it("Reject feedback requires admin_response and is a no-op without it", async () => {
    const feedbackBuilder = buildFeedbackBuilder([sampleRow]);
    const profilesBuilder = buildProfilesBuilder([
      { id: "reviewer-1", preferred_name: "Cô Lan", email: "lan@example.com" },
    ]);
    const updateBuilder = buildFeedbackUpdateBuilder();
    let call = 0;
    fromMock.mockImplementation((table: string) => {
      call++;
      if (call === 1 && table === "teacher_feedback") return feedbackBuilder;
      if (call === 2 && table === "profiles") return profilesBuilder;
      if (table === "teacher_feedback") return updateBuilder;
      throw new Error(`unexpected from(${table}) on call ${call}`);
    });

    // Stub window.prompt — return null (admin canceled).
    promptSpy = vi.spyOn(window, "prompt").mockReturnValue(null);

    renderTriage();

    const rejectBtn = await screen.findByRole("button", { name: /Từ chối phản hồi/i });
    fireEvent.click(rejectBtn);

    expect(promptSpy).toHaveBeenCalled();
    // No update issued because the user canceled the prompt.
    expect(updateBuilder.update).not.toHaveBeenCalled();
  });

  it("Reject feedback proceeds when admin supplies a response", async () => {
    const feedbackBuilder = buildFeedbackBuilder([sampleRow]);
    const profilesBuilder = buildProfilesBuilder([]);
    const updateBuilder = buildFeedbackUpdateBuilder();
    let call = 0;
    fromMock.mockImplementation((table: string) => {
      call++;
      if (call === 1 && table === "teacher_feedback") return feedbackBuilder;
      if (call === 2 && table === "profiles") return profilesBuilder;
      if (table === "teacher_feedback") return updateBuilder;
      throw new Error(`unexpected from(${table}) on call ${call}`);
    });

    promptSpy = vi
      .spyOn(window, "prompt")
      .mockReturnValue("Phản hồi không đúng — nội dung gốc đúng rồi");

    renderTriage();

    const rejectBtn = await screen.findByRole("button", { name: /Từ chối phản hồi/i });
    fireEvent.click(rejectBtn);

    await waitFor(() => {
      expect(updateBuilder.update).toHaveBeenCalledTimes(1);
    });
    const args = updateBuilder.update.mock.calls[0][0];
    expect(args).toMatchObject({
      status: "rejected_by_admin",
      admin_response: "Phản hồi không đúng — nội dung gốc đúng rồi",
    });
    expect(typeof args.resolved_at).toBe("string");
  });

  it("Apply correction sets feedback status + content status", async () => {
    const feedbackBuilder = buildFeedbackBuilder([sampleRow]);
    const profilesBuilder = buildProfilesBuilder([]);
    const feedbackUpdate = buildFeedbackUpdateBuilder();
    const contentUpdate = buildContentStatusUpdateBuilder();
    let call = 0;
    fromMock.mockImplementation((table: string) => {
      call++;
      if (call === 1 && table === "teacher_feedback") return feedbackBuilder;
      if (call === 2 && table === "profiles") return profilesBuilder;
      if (table === "teacher_feedback") return feedbackUpdate;
      if (table === "content_review_status") return contentUpdate;
      throw new Error(`unexpected from(${table}) on call ${call}`);
    });

    renderTriage();

    const applyBtn = await screen.findByRole("button", { name: /Áp dụng chỉnh sửa/i });
    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(feedbackUpdate.update).toHaveBeenCalledTimes(1);
    });
    const fbArgs = feedbackUpdate.update.mock.calls[0][0];
    expect(fbArgs).toMatchObject({ status: "correction_applied" });
    expect(typeof fbArgs.resolved_at).toBe("string");

    expect(contentUpdate.update).toHaveBeenCalledTimes(1);
    const csArgs = contentUpdate.update.mock.calls[0][0];
    expect(csArgs).toMatchObject({ status: "approved" });

    // Notification fired.
    expect(invokeMock).toHaveBeenCalledWith(
      "teacher-notifications",
      expect.objectContaining({
        body: expect.objectContaining({ action: "content_updated" }),
      }),
    );
  });
});
