// @vitest-environment jsdom
//
// OnboardingPage — focus management on step transition.
//
// Pins the WCAG 2.4.3 fix shipped in `fix/a11y-onboarding-focus-management`:
// when the picker advances from one step to the next, focus moves to the
// new step's <h1>. Without the fix, focus stays on the dismissed button
// (now unmounted) and falls back to <body>, costing a keyboard user
// their place and an SR user the announcement.
//
// Mocks are deliberately minimal — we don't exercise Supabase or
// navigation here, just step transitions inside one mount. Reusing the
// project's existing pattern would pull in the whole OnboardingPage
// fixture set; this lean variant keeps the spec focused on the focus
// contract.

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// ── Mocks ────────────────────────────────────────────────────────────

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      update: () => ({ eq: async () => ({ error: null }) }),
    }),
  },
}));

const mockUseAuth = vi.fn(() => ({ user: { id: "user-uuid-focus" } }));
vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const real = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return { ...real, useNavigate: () => navigateMock };
});

// Spy on the live-region announcer so we can assert the heading text
// goes out polite-region alongside the focus move.
const announceMock = vi.fn();
vi.mock("@/lib/a11y/announcements", () => ({
  announce: (msg: string) => announceMock(msg),
}));

import OnboardingPage from "../OnboardingPage";

function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  qc.invalidateQueries = vi.fn(() =>
    Promise.resolve(),
  ) as unknown as typeof qc.invalidateQueries;
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/onboarding"]}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  navigateMock.mockClear();
  announceMock.mockClear();
  window.localStorage.clear();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OnboardingPage — focus management (WCAG 2.4.3)", () => {
  it("initial mount: focus is NOT auto-stolen to the heading", () => {
    renderPage();
    // The h1 is programmatically focusable (tabIndex={-1}) but on first
    // render we don't pull focus — a sighted keyboard user tabbing in
    // from the global header shouldn't be snapped to the h1.
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(document.activeElement).not.toBe(h1);
  });

  it("the step heading is programmatically focusable via tabIndex={-1}", () => {
    renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.getAttribute("tabindex")).toBe("-1");
  });

  it("after native pick → target step, focus moves to the new step's <h1>", async () => {
    const user = userEvent.setup();
    renderPage();

    // Pick Tiếng Việt to auto-advance to the target step.
    await user.click(screen.getByRole("radio", { name: /Tiếng Việt/ }));

    // New heading on the target step.
    const targetHeading = await screen.findByRole("heading", {
      level: 1,
      name: /Bạn muốn học ngôn ngữ nào/,
    });

    expect(document.activeElement).toBe(targetHeading);
    expect(targetHeading.getAttribute("tabindex")).toBe("-1");
  });

  it("announces the new step's heading text via the live region", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("radio", { name: /Tiếng Việt/ }));

    // Wait for the step transition to settle.
    await screen.findByRole("heading", {
      level: 1,
      name: /Bạn muốn học ngôn ngữ nào/,
    });

    // The announce() call should carry the new heading text — VI-first
    // because the target step renders chrome-language-conditional and
    // the just-chosen native is "vi".
    expect(announceMock).toHaveBeenCalled();
    const announced = announceMock.mock.calls.map((c) => c[0] as string);
    expect(announced.some((m) => /Bạn muốn học ngôn ngữ nào/.test(m))).toBe(
      true,
    );
  });

  it("English-native pick announces the target heading in English chrome", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("radio", { name: /Tiếng Anh|English/ }));

    const targetHeading = await screen.findByRole("heading", {
      level: 1,
      name: /What do you want to learn/i,
    });

    expect(document.activeElement).toBe(targetHeading);
    const announced = announceMock.mock.calls.map((c) => c[0] as string);
    expect(announced.some((m) => /What do you want to learn/.test(m))).toBe(
      true,
    );
  });

  it("VI-native target copy keeps VI labels and omits unavailable Spanish", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("radio", { name: /Tiếng Việt/ }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /Bạn muốn học ngôn ngữ nào/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Tiếng Nhật/ })).toBeInTheDocument();
    expect(screen.getAllByText(/Nội dung còn hạn chế/).length).toBeGreaterThan(0);
    expect(screen.queryByRole("checkbox", { name: /Spanish|Tây Ban Nha/ })).toBeNull();
    expect(screen.queryByText(/Limited content/)).toBeNull();
  });

  it("EN-native target copy keeps EN labels and readiness badges", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("radio", { name: /Tiếng Anh|English/ }));

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /What do you want to learn/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /Spanish/ })).toBeInTheDocument();
    expect(screen.getAllByText(/Limited content/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Nội dung còn hạn chế/)).toBeNull();
  });
});
