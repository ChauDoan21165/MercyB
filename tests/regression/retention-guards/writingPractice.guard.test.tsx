// Retention surface guard — WritingPracticeSessionPage submit seam (recordActiveDay).
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  record: vi.fn(),
  PROMPT: {
    id: "p1", category: "workplace_email", difficulty: "easy",
    title_en: "Email", title_vi: "Email", scenario_en: "Write an email.", scenario_vi: "Viết email.",
    target_words_min: 1, target_words_max: 500,
  },
}));
vi.mock("@/lib/retention/recordActiveDay", () => ({ recordActiveDay: h.record }));
vi.mock("@/providers/AuthProvider", () => ({ useAuth: () => ({ user: { id: "u1" } }) }));
vi.mock("@/lib/supabaseClient", () => ({
  supabase: { auth: { getSession: vi.fn(async () => ({ data: { session: { access_token: "jwt-1" } } })) } },
}));
vi.mock("@/data/writing-prompts/prompts", () => ({ getWritingPromptById: vi.fn(() => h.PROMPT), WRITING_PROMPTS: [h.PROMPT] }));
vi.mock("@/lib/writing/feedbackClient", () => {
  class WritingFeedbackError extends Error { reason = "unknown"; }
  return { requestWritingFeedback: vi.fn(async () => ({ score: 80, summary_vi: "Tốt", summary_en: "Good", corrections: [], vocabulary: [], grammar: [], cultural_notes_vi: [], cultural_notes_en: [] })), WritingFeedbackError };
});
vi.mock("@/lib/writing/submissions", () => ({ recordSubmission: vi.fn(async () => undefined) }));
vi.mock("@/components/feedback/MercyAnswerFeedback", () => ({ MercyAnswerFeedback: () => <div data-testid="feedback" /> }));

import WritingPracticeSessionPage from "@/pages/writing/WritingPracticeSessionPage";
function renderPage() {
  return render(<MemoryRouter initialEntries={["/w/p1"]}><Routes><Route path="/w/:promptId" element={<WritingPracticeSessionPage />} /></Routes></MemoryRouter>);
}

describe("retention guard — WritingPracticeSessionPage submit", () => {
  beforeEach(() => { h.record.mockClear(); });

  it("POSITIVE: submitting a writing piece fires recordActiveDay exactly once", async () => {
    renderPage();
    fireEvent.change(await screen.findByRole("textbox", { name: "Writing submission" }), { target: { value: "This is my writing submission for feedback." } });
    fireEvent.click(screen.getByRole("button", { name: /Gửi bài · Submit/i }));
    await waitFor(() => expect(h.record).toHaveBeenCalledTimes(1));
  });

  it("NEGATIVE: typing a draft without submitting does NOT fire recordActiveDay", async () => {
    renderPage();
    fireEvent.change(await screen.findByRole("textbox", { name: "Writing submission" }), { target: { value: "draft text only" } });
    await screen.findByRole("button", { name: /Gửi bài · Submit/i });
    expect(h.record).not.toHaveBeenCalled();
  });
});
