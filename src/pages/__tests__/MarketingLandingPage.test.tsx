// @vitest-environment jsdom
//
// Landing smoke + the two behaviors that matter for conversion:
//  - Vietnamese is the <h1> (visual primary, non-negotiable #1)
//  - hero CTAs route correctly (/onboarding and /onboarding?direction=vn)
//  - "Nói thử ngay" writes the default vi→en pair (so the `/` gate
//    renders Home) and navigates to /?trypron=1 (so Home auto-opens
//    the pronunciation trial)

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockWritePair = vi.fn();
vi.mock("@/lib/languagePair/anonymousPair", () => ({
  writeAnonymousPair: (...args: unknown[]) => mockWritePair(...args),
}));

import MarketingLandingPage from "../MarketingLandingPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <MarketingLandingPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockNavigate.mockReset();
  mockWritePair.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MarketingLandingPage", () => {
  it("Vietnamese positioning is the H1 (visual primary)", () => {
    renderPage();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveAttribute("lang", "vi");
    expect(h1.textContent).toContain("Ngoại ngữ cho người Việt");
  });

  it("primary CTA links to /onboarding", () => {
    renderPage();
    const links = screen.getAllByRole("link", { name: "Tôi học ngoại ngữ" });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((l) => expect(l).toHaveAttribute("href", "/onboarding"));
  });

  it("secondary CTA links to /onboarding?direction=vn", () => {
    renderPage();
    const links = screen.getAllByRole("link", {
      name: /I'm learning Vietnamese/i,
    });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((l) =>
      expect(l).toHaveAttribute("href", "/onboarding?direction=vn"),
    );
  });

  it("'Nói thử ngay' writes the default vi→en pair then navigates to /?trypron=1", () => {
    renderPage();
    fireEvent.click(
      screen.getByRole("button", { name: /Nói thử ngay/ }),
    );
    expect(mockWritePair).toHaveBeenCalledWith("vi", ["en"]);
    expect(mockNavigate).toHaveBeenCalledWith("/?trypron=1");
  });
});
