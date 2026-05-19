// @vitest-environment jsdom
//
// Two contracts:
//  1. Legacy fallback (no `firstTimeAnonymous` prop): a first-time
//     anonymous visitor still redirects to the picker; a signed-in or
//     returning anonymous visitor must NEVER be bounced there.
//  2. Marketing-landing contract (Chau-directed 2026-05-18): when
//     `firstTimeAnonymous` is supplied (the `/` route), a first-time
//     anonymous visitor sees THAT (the landing) instead of the
//     /onboarding redirect — while signed-in / returning visitors are
//     still routed to Home, unchanged.

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

const mockUseAuth = vi.fn();
vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

import { AnonymousOnboardingGate } from "../AnonymousOnboardingGate";

function renderGate() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <AnonymousOnboardingGate>
              <div>HOME</div>
            </AnonymousOnboardingGate>
          }
        />
        <Route path="/onboarding" element={<div>PICKER</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
  mockUseAuth.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AnonymousOnboardingGate", () => {
  it("first-time anonymous (no user, no stored pair) → picker", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    renderGate();
    expect(screen.getByText("PICKER")).toBeInTheDocument();
    expect(screen.queryByText("HOME")).toBeNull();
  });

  it("returning anonymous (stored pair) → Home, never the picker", () => {
    window.localStorage.setItem(
      "mercyblade.languagePair",
      JSON.stringify({ native: "vi", targets: ["en"] }),
    );
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    renderGate();
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("PICKER")).toBeNull();
  });

  it("signed-in user with no stored pair → Home (Home's own gate owns onboarding)", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "u1" },
      isLoading: false,
    });
    renderGate();
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("PICKER")).toBeNull();
  });

  it("auth still loading on first paint → render Home, do not bounce", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: true });
    renderGate();
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("PICKER")).toBeNull();
  });
});

function renderGateWithLanding() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <AnonymousOnboardingGate
              firstTimeAnonymous={<div>LANDING</div>}
            >
              <div>HOME</div>
            </AnonymousOnboardingGate>
          }
        />
        <Route path="/onboarding" element={<div>PICKER</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("AnonymousOnboardingGate — marketing landing contract", () => {
  it("first-time anonymous → landing, NOT the /onboarding redirect", () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    renderGateWithLanding();
    expect(screen.getByText("LANDING")).toBeInTheDocument();
    expect(screen.queryByText("PICKER")).toBeNull();
    expect(screen.queryByText("HOME")).toBeNull();
  });

  it("returning anonymous (stored pair) → Home, never the landing", () => {
    window.localStorage.setItem(
      "mercyblade.languagePair",
      JSON.stringify({ native: "vi", targets: ["en"] }),
    );
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });
    renderGateWithLanding();
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("LANDING")).toBeNull();
  });

  it("signed-in user → Home, never the landing", () => {
    mockUseAuth.mockReturnValue({ user: { id: "u1" }, isLoading: false });
    renderGateWithLanding();
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.queryByText("LANDING")).toBeNull();
  });
});
