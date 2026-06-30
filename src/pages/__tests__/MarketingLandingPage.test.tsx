import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import MarketingLandingPage from "../MarketingLandingPage";

function renderHomepage() {
  return render(
    <MemoryRouter>
      <MarketingLandingPage />
    </MemoryRouter>,
  );
}

describe("Public homepage", () => {
  it("renders the approved inkwash homepage shell", () => {
    renderHomepage();

    const homepage = document.querySelector("[data-mercy-marketing-home='true']");
    expect(homepage).toBeInTheDocument();
    expect(homepage?.getAttribute("style") ?? "").toContain("/marketing/hero-a.png");

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toContain("Learn Any Language");
    expect(h1.textContent).toContain("From Your Language");
  });

  it("keeps the public brand and sign-in route", () => {
    renderHomepage();

    expect(screen.getByRole("link", { name: "MercyBlade home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/login");
  });

  it("starts the default Vietnamese to English learning route", () => {
    renderHomepage();

    const startLink = screen.getByRole("link", { name: /Start Learning/i });
    expect(startLink).toHaveAttribute("href", "/learn/vietnamese/english");
  });

  it("shows native and target language selectors", () => {
    renderHomepage();

    expect(screen.getByRole("button", { name: "Swap languages" })).toBeInTheDocument();

    const selectors = screen.getAllByRole("combobox");
    expect(selectors).toHaveLength(2);
    expect(selectors[0]).toHaveTextContent("Vietnamese");
    expect(selectors[1]).toHaveTextContent("English");
  });
});
