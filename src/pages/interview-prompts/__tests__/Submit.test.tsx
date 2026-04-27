// Component tests for SubmitInterviewPrompt page. Mirrors the
// ShareStory test pattern.
//
// Two main cases:
//   1. Not-eligible user sees the Vietnamese reason verbatim.
//   2. Eligible user sees the form; the submit button stays disabled
//      while question_text_en is below the 5-char minimum.

import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({
    user: { id: "u-test", email: "a@b.test" },
    isLoading: false,
  }),
}));

vi.mock("@/lib/interviewPrompts/eligibility", () => ({
  canSubmitInterviewPrompt: vi.fn(),
}));

vi.mock("@/lib/interviewPrompts/telemetry", () => ({
  trackPromptSubmitted: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
    }),
  },
}));

import { canSubmitInterviewPrompt } from "@/lib/interviewPrompts/eligibility";
import SubmitInterviewPrompt from "../Submit";

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SubmitInterviewPrompt page", () => {
  it("renders the not-eligible Vietnamese reason when the gate fails", async () => {
    vi.mocked(canSubmitInterviewPrompt).mockResolvedValue({
      eligible: false,
      reason: "mock_interview_sessions completed < 3",
      reasonVi:
        "Hãy hoàn thành ít nhất 3 phỏng vấn thử trước khi đóng góp câu hỏi cho cộng đồng.",
    });

    render(
      <MemoryRouter>
        <SubmitInterviewPrompt />
      </MemoryRouter>,
    );

    await waitFor(() => {
      const panel = screen.getByTestId("submit-prompt-ineligible-panel");
      expect(panel).toBeInTheDocument();
      expect(panel.textContent).toContain("3 phỏng vấn");
    });

    expect(
      screen.queryByTestId("submit-prompt-form"),
    ).not.toBeInTheDocument();
  });

  it("disables the submit button when question_text_en is shorter than 5 characters", async () => {
    vi.mocked(canSubmitInterviewPrompt).mockResolvedValue({ eligible: true });

    render(
      <MemoryRouter>
        <SubmitInterviewPrompt />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("submit-prompt-form")).toBeInTheDocument();
    });

    const submitBtn = screen.getByTestId(
      "submit-prompt-button",
    ) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);

    const enField = screen.getByLabelText(
      /Câu hỏi \(tiếng Anh\)/i,
    ) as HTMLTextAreaElement;
    fireEvent.change(enField, { target: { value: "abcd" } }); // 4 chars
    expect(submitBtn.disabled).toBe(true);

    fireEvent.change(enField, {
      target: { value: "Tell me about a time you handled a hard customer." },
    });
    expect(submitBtn.disabled).toBe(false);
  });
});
