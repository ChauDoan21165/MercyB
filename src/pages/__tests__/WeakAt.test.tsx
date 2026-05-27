// @vitest-environment jsdom
//
// Tests for src/pages/WeakAt.tsx (Stage-3A /weak-at route page) and
// its wire-in points in src/router/AppRouter.tsx + src/pages/Home.tsx.
//
// Pure presentational page; no providers / hooks / Supabase. Tested
// directly by rendering, plus two file-level assertions that the
// route and Home discovery link are wired correctly. Avoids the
// provider-mock sprawl of full Home/AppRouter integration tests.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import WeakAt from "../WeakAt";

const REPO_ROOT = join(__dirname, "..", "..", "..");

// SuggestedPracticeList (Day 6 wire-in) calls `useNavigate()` at the
// hook level, so WeakAt requires a router context to render. The
// MemoryRouter wrapper keeps these tests provider-light while
// satisfying that requirement.
function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/weak-at"]}>
      <WeakAt />
    </MemoryRouter>,
  );
}

describe("WeakAt page (/weak-at)", () => {
  it("renders the LocalWeaknessMap component", () => {
    renderPage();
    const inMain = screen.getByRole("main");
    expect(inMain).toBeTruthy();
    // The shipped LocalWeaknessMap renders one of two top-level testids
    // depending on whether the local snapshot is empty (see
    // src/components/stage-3a/LocalWeaknessMap.tsx). Either is wiring-
    // proof; jsdom's empty localStorage will pick the empty state.
    const populated = screen.queryByTestId("local-weakness-map");
    const empty = screen.queryByTestId("local-weakness-empty");
    const loading = screen.queryByTestId("local-weakness-loading");
    expect(populated || empty || loading).toBeTruthy();
  });

  it("renders the SuggestedPracticeList below the weakness map", () => {
    renderPage();
    // Same posture as the LocalWeaknessMap assertion — either the
    // populated list or its empty state proves the wiring.
    const list = screen.queryByTestId("suggested-practice-list");
    const empty = screen.queryByTestId("suggested-practice-empty");
    const loading = screen.queryByTestId("suggested-practice-loading");
    expect(list || empty || loading).toBeTruthy();
  });

  it("renders bilingual title — VI primary, EN secondary", () => {
    renderPage();
    const vi = screen.getByTestId("weak-at-title-vi");
    const en = screen.getByTestId("weak-at-title-en");
    expect(vi.textContent).toBe("Điểm yếu của bạn");
    expect(en.textContent).toBe("What you're working on");
    // VI is an h1 (the primary heading); EN is descriptive text below.
    expect(vi.tagName).toBe("H1");
  });

  it("renders a one-line source note explaining the local-only posture", () => {
    renderPage();
    // Source-note framing is critical for trust: users must know the
    // signal doesn't leave the device. Assert the VN phrasing is
    // present (matches docs/stage-3a/local-weakness-map-design.md §7).
    const body = screen.getByRole("main").textContent ?? "";
    expect(body).toContain("không gửi lên server");
  });

  it("does not assert any auth gate (anon-viewable, matches /progress posture)", () => {
    // WeakAt itself doesn't read useAuth or useUserAccess — the
    // empty-state in LocalWeaknessMap covers signed-out callers.
    // This test pins the absence by rendering with only a router
    // wrapper (no AuthProvider). Router-only is the floor — the
    // SuggestedPracticeList wire-in uses `useNavigate()`, which is
    // why the bare-render variant is no longer viable.
    expect(() => renderPage()).not.toThrow();
  });
});

describe("Route + Home wire-in (file-level)", () => {
  it("AppRouter registers /weak-at → WeakAtPage", () => {
    const appRouter = readFileSync(
      join(REPO_ROOT, "src", "router", "AppRouter.tsx"),
      "utf8",
    );
    // Lazy-loaded page reference.
    expect(appRouter).toContain('lazyWithRetry(() => import("@/pages/WeakAt"))');
    // Route declaration.
    expect(appRouter).toMatch(/<Route\s+path="\/weak-at"/);
    // Mounted inside LazyPage wrapper (matches /progress posture).
    expect(appRouter).toMatch(/path="\/weak-at"[\s\S]*?<LazyPage>[\s\S]*?<WeakAtPage \/>/);
  });

  it("Home includes a discoverable link that navigates to /weak-at", () => {
    const home = readFileSync(
      join(REPO_ROOT, "src", "pages", "Home.tsx"),
      "utf8",
    );
    // Navigation target.
    expect(home).toContain('nav("/weak-at")');
    // Test-id on the link element so future Home tests can locate it.
    expect(home).toContain('data-testid="home-weak-at-link"');
    // Bilingual copy per the dispatch.
    expect(home).toContain("Xem điểm bạn cần luyện");
    expect(home).toContain("See what you're working on");
  });
});
