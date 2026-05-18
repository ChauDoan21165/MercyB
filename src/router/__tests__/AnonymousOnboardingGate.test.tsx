// @vitest-environment jsdom
//
// Guards the locked #14 invariant: the picker fires for a first-time
// anonymous visitor, but must NEVER bounce a signed-in user or a
// returning anonymous visitor (who already picked) into it.

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
