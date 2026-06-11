import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { FamilyShareSection } from "../ShareProgressPage";

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const VI_DIACRITIC = /[À-ỹ]/u;

function renderSection(streak = 0) {
  return render(
    <MemoryRouter>
      <FamilyShareSection streak={streak} />
    </MemoryRouter>,
  );
}

describe("FamilyShareSection", () => {
  it("renders the parent template at streak=0", () => {
    renderSection(0);
    expect(
      screen.getByTestId("family-share-template-family-share-parent"),
    ).toBeInTheDocument();
  });

  it("does not render the streak template at streak=0", () => {
    renderSection(0);
    expect(
      screen.queryByTestId("family-share-template-family-share-streak"),
    ).not.toBeInTheDocument();
  });

  it("renders the streak template when streak > 0", () => {
    renderSection(14);
    expect(
      screen.getByTestId("family-share-template-family-share-streak"),
    ).toBeInTheDocument();
  });

  it("interpolates streak value into the streak template", () => {
    renderSection(7);
    const item = screen.getByTestId("family-share-template-family-share-streak");
    expect(item.textContent).toContain("7");
    expect(item.textContent).not.toContain("{streak}");
  });

  it("parent template message uses Vietnamese diacritics", () => {
    renderSection(0);
    const item = screen.getByTestId("family-share-template-family-share-parent");
    expect(item.textContent).toMatch(VI_DIACRITIC);
  });

  it("copy button label uses Vietnamese diacritics", () => {
    renderSection(0);
    const item = screen.getByTestId("family-share-template-family-share-parent");
    expect(item.querySelector("button")?.textContent).toMatch(VI_DIACRITIC);
  });
});
