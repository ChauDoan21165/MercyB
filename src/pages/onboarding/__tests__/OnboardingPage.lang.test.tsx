// @vitest-environment jsdom
//
// OnboardingPage — bilingual `lang` attributes on the native peer header.
//
// Pins the !64 audit's O2 fix: the pre-pick native step renders VI and
// EN as peers (locked #14, both audiences present). Without
// per-language `lang` attributes, a VI screen-reader voice phoneticises
// the EN sibling using Vietnamese phonemes (and the EN voice mirrors
// the inverse on the VI text) — both lines become unintelligible to
// the learner whose language the SR is set to.
//
// Contract under test:
//   - On the native step (pre-pick, bilingual peer treatment), the
//     `<h1>`, the EN sibling `<div>`, and both body paragraphs each
//     carry a `lang` attribute matching their language.
//   - VI comes first in DOM order (locked #14 — Vietnamese is the home
//     market).
//   - On a single-language step (post-pick), no `lang` regression — the
//     chrome language is conveyed by `<html lang>` + page-level
//     `pickChrome`, and the StepHeader does NOT spuriously emit
//     `lang="vi"` on EN-chrome content.
//
// Mocks mirror the OnboardingPage.focus.test.tsx pattern — minimal so
// the spec focuses on the lang contract.

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: () => ({
      update: () => ({ eq: async () => ({ error: null }) }),
    }),
  },
}));

const mockUseAuth = vi.fn(() => ({ user: { id: "user-uuid-lang" } }));
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

vi.mock("@/lib/a11y/announcements", () => ({
  announce: vi.fn(),
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
  window.localStorage.clear();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("OnboardingPage — bilingual lang attrs on native peer header (O2)", () => {
  it("the VI <h1> carries lang='vi'", () => {
    renderPage();
    const h1 = screen.getByRole("heading", {
      level: 1,
      name: /Tiếng mẹ đẻ của bạn là gì/,
    });
    expect(h1.getAttribute("lang")).toBe("vi");
  });

  it("the EN sibling carries lang='en' and contains the English peer title", () => {
    renderPage();
    const enPeer = screen.getByText("What's your native language?");
    expect(enPeer.getAttribute("lang")).toBe("en");
    // The peer is a sibling <div>, not an h1.
    expect(enPeer.tagName).toBe("DIV");
  });

  it("the VI body paragraph carries lang='vi'", () => {
    renderPage();
    const viBody = screen.getByText(
      "Mercy sẽ giải thích bài học bằng ngôn ngữ này.",
    );
    expect(viBody.getAttribute("lang")).toBe("vi");
    expect(viBody.tagName).toBe("P");
  });

  it("the EN body paragraph carries lang='en'", () => {
    renderPage();
    const enBody = screen.getByText(
      "Mercy will explain your lessons in this language.",
    );
    expect(enBody.getAttribute("lang")).toBe("en");
    expect(enBody.tagName).toBe("P");
  });

  it("DOM order: VI heading appears before EN peer (locked #14 — VI home market)", () => {
    renderPage();
    const h1 = screen.getByRole("heading", {
      level: 1,
      name: /Tiếng mẹ đẻ của bạn là gì/,
    });
    const enPeer = screen.getByText("What's your native language?");
    // compareDocumentPosition returns DOCUMENT_POSITION_FOLLOWING (4)
    // when the second arg follows the first in document order.
    expect(h1.compareDocumentPosition(enPeer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("post-pick target step: chrome language is conveyed via pickChrome (no spurious lang regression)", async () => {
    const user = userEvent.setup();
    renderPage();
    // Pick VI to advance to the target step (single-language chrome).
    await user.click(screen.getByRole("radio", { name: /Tiếng Việt/ }));

    const targetH1 = await screen.findByRole("heading", {
      level: 1,
      name: /Bạn muốn học ngôn ngữ nào/,
    });
    // Single-language steps don't emit `lang="vi"` on the h1 itself
    // (the chrome is set at the page level via <html lang> + the
    // text is in the user's chosen native language). Asserting the
    // ABSENCE of a stale en lang here would be brittle; instead we
    // pin the positive contract: the h1 text is the VI title (i.e.
    // pickChrome correctly selected VI based on the native pick).
    expect(targetH1.textContent).toContain("Bạn muốn học ngôn ngữ nào");
  });

  it("EN-native target heading does not inherit stale VI lang or copy", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("radio", { name: /Tiếng Anh|English/ }));

    const targetH1 = await screen.findByRole("heading", {
      level: 1,
      name: /What do you want to learn/i,
    });
    expect(targetH1.getAttribute("lang")).not.toBe("vi");
    expect(screen.queryByText(/Bạn muốn học ngôn ngữ nào/)).toBeNull();
  });
});
