// @vitest-environment jsdom
//
// Regression guard (A85, from A79's AppRouter audit): the logged-out
// "Đăng ký để tham gia" CTA on the referral leaderboard must point at
// the canonical auth route `/signin` (LoginPage handles both sign-in
// and email-OTP account creation). It used to link to `/auth/signup`,
// which has NO registered route in AppRouter.tsx and dumped the user
// on the SPA catch-all "404 — Không tìm thấy trang" page.

import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("@/lib/referral/leaderboardClient", () => ({
  getMonthlyTop: async () => [],
  getAllTimeTop: async () => [],
  monthStartIso: () => "2026-05-01",
  lastMonthStartIso: () => "2026-04-01",
}));

vi.mock("@/lib/referral/leaderboardOptIn", () => ({
  getOptInStatus: async () => ({ optedIn: false }),
}));

import MonthlyReferralLeaderboard from "../MonthlyReferralLeaderboard";

describe("MonthlyReferralLeaderboard — logged-out signup CTA route", () => {
  it("links the signup CTA to /signin, never the unrouted /auth/signup", async () => {
    render(
      <MemoryRouter initialEntries={["/leaderboard/referral"]}>
        <MonthlyReferralLeaderboard />
      </MemoryRouter>,
    );

    const cta = await screen.findByRole("link", {
      name: "Đăng ký để tham gia",
    });
    expect(cta).toHaveAttribute("href", "/signin");

    // Hard guard against any regression back to the dead path.
    await waitFor(() =>
      expect(document.querySelector('a[href="/auth/signup"]')).toBeNull(),
    );
  });
});
