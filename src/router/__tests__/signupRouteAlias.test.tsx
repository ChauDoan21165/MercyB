// src/router/__tests__/signupRouteAlias.test.tsx
//
// A79 D1 prod-smoke finding: mercyblade.com/signup rendered the in-SPA
// "404 — Không tìm thấy trang." No /signup route existed, so the
// path="*" catch-all (NotFound) swallowed the most-guessed account URL.
//
// This pins the ALIAS contract decided in a90/signup-route-alias:
//   - /signup renders LoginPage directly (NOT the 404 catch-all)
//   - the URL stays /signup (ALIAS, not a redirect to /signin) — a
//     redirect would rewrite the location, which is exactly what we
//     chose against so the route reads as "real" to the user
//   - /signin renders the same page (alias parity)

import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

// LoginPage pulls in the full auth/supabase graph — replace it with a
// sentinel so the test exercises the real <Routes> table, not the page.
vi.mock("@/pages/LoginPage", () => ({
  default: () => <div data-testid="login-page" />,
}));

// Always-rendered side widgets are irrelevant to routing and require
// auth/toast/certificate contexts — stub them to null.
vi.mock("@/components/FeedbackBar", () => ({ FeedbackBar: () => null }));
vi.mock("@/components/xp/LevelUpModal", () => ({ LevelUpModal: () => null }));
vi.mock("@/components/certificates/MilestoneObserver", () => ({
  MilestoneObserver: () => null,
}));
vi.mock("@/components/certificates/CertificateToast", () => ({
  CertificateToast: () => null,
}));

import AppRouter from "@/router/AppRouter";

function LocationProbe() {
  const { pathname } = useLocation();
  return <div data-testid="pathname">{pathname}</div>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LocationProbe />
      <AppRouter />
    </MemoryRouter>,
  );
}

describe("/signup route alias (A79 D1)", () => {
  it("renders LoginPage at /signup, not the 404 catch-all", async () => {
    renderAt("/signup");
    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByText(/Không tìm thấy trang/)).toBeNull();
  });

  it("keeps /signup in the URL (alias, not a redirect to /signin)", async () => {
    renderAt("/signup");
    await screen.findByTestId("login-page");
    expect(screen.getByTestId("pathname")).toHaveTextContent("/signup");
  });

  it("renders the same LoginPage at /signin (alias parity)", async () => {
    renderAt("/signin");
    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
    expect(screen.getByTestId("pathname")).toHaveTextContent("/signin");
  });
});
