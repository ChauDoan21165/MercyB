// Component test: ShareStory page renders the eligibility-blocked
// state correctly. We mock the eligibility check and the AuthProvider
// hook so we can drive the page into the not-eligible branch and
// confirm the Vietnamese reason is shown verbatim (the spec calls this
// out specifically — UI must surface `reasonVi`).

import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: { id: "u-test", email: "a@b.test" }, isLoading: false }),
}));

vi.mock("@/lib/stories/eligibility", () => ({
  isUserEligibleToShareStory: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: "s-1" }, error: null }),
        }),
      }),
      update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: { id: "u-test" } } }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://x.test/p.jpg" } }),
      }),
    },
  },
}));

import { isUserEligibleToShareStory } from "@/lib/stories/eligibility";
import ShareStory from "../ShareStory";

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ShareStory page", () => {
  it("renders the not-eligible reason in Vietnamese when the gate fails", async () => {
    vi.mocked(isUserEligibleToShareStory).mockResolvedValue({
      eligible: false,
      reason: "tier < 1",
      reasonVi: "Tính năng chia sẻ câu chuyện hiện dành cho người dùng đã đăng ký gói trả phí.",
    });

    render(
      <MemoryRouter>
        <ShareStory />
      </MemoryRouter>,
    );

    // Async eligibility resolves on a microtask. waitFor lets us see it.
    await waitFor(() => {
      const el = screen.getByTestId("ineligible-panel");
      expect(el).toBeInTheDocument();
    });
    const reason = screen.getByTestId("reason-vi");
    expect(reason.textContent).toMatch(/trả phí/);
    // The form's submit button only renders on the eligible branch;
    // confirming its absence is a tight check that the form did NOT
    // render. (The page heading is shared by both branches, so a text
    // match on it would over-match.)
    expect(
      screen.queryByRole("button", { name: /Gửi câu chuyện/i }),
    ).not.toBeInTheDocument();
  });

  it("renders the form when the user is eligible", async () => {
    vi.mocked(isUserEligibleToShareStory).mockResolvedValue({ eligible: true });

    render(
      <MemoryRouter>
        <ShareStory />
      </MemoryRouter>,
    );

    await waitFor(() => {
      // Hits the form heading text
      expect(
        screen.getByRole("heading", { name: /Chia sẻ câu chuyện của bạn/i }),
      ).toBeInTheDocument();
    });
    // The submit button only renders inside the form branch
    expect(screen.getByRole("button", { name: /Gửi câu chuyện/i })).toBeInTheDocument();
  });
});
