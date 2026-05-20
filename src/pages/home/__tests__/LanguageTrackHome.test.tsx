// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import React from "react";

const persistMock = vi.fn(async () => ({ ok: true }));
// A13-circle-8: usePairMutation moved to its own module to break a
// 3-hop cycle through AuthProvider. Mock the new path; leave the
// pure `languagePair` module alone (the test no longer depends on
// mocking anything in it).
vi.mock("@/lib/languagePair/usePairMutation", () => ({
  usePairMutation: () => ({ persist: persistMock }),
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return { ...actual, useNavigate: () => navigateMock };
});

import LanguageTrackHome, { TargetSwitcher } from "../LanguageTrackHome";

const wrap = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  persistMock.mockClear();
  navigateMock.mockClear();
});

describe("LanguageTrackHome (non-English primary)", () => {
  it("routes the primary CTA to the correct /languages slug", async () => {
    const user = userEvent.setup();
    wrap(
      <LanguageTrackHome
        nativeLanguage="vi"
        targets={["ja"]}
        primaryTarget="ja"
      />,
    );
    await user.click(
      screen.getByRole("button", { name: /Open Japanese track/i }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/languages/japanese");
  });

  it("keeps the pair-agnostic hero copy (no 'English for real life')", () => {
    wrap(
      <LanguageTrackHome
        nativeLanguage="vi"
        targets={["ko"]}
        primaryTarget="ko"
      />,
    );
    expect(screen.getByText(/Small Steps\./)).toBeInTheDocument();
    expect(screen.getByText(/Real progress\./)).toBeInTheDocument();
    expect(screen.queryByText(/English for real/i)).toBeNull();
  });
});

describe("TargetSwitcher", () => {
  it("is hidden when the user has fewer than 2 targets", () => {
    const { container } = wrap(
      <TargetSwitcher targets={["ja"]} primaryTarget="ja" />,
    );
    expect(container.querySelector("nav")).toBeNull();
  });

  it("reorders via withPrimary and persists when a non-primary is picked", async () => {
    const user = userEvent.setup();
    wrap(<TargetSwitcher targets={["en", "ja", "ko"]} primaryTarget="en" />);
    await user.click(screen.getByRole("button", { name: /Tiếng Hàn/ })); // ko
    expect(persistMock).toHaveBeenCalledWith({
      target_languages: ["ko", "en", "ja"], // chosen → index 0, order kept
    });
  });

  it("does nothing when the current primary is clicked again", async () => {
    const user = userEvent.setup();
    wrap(<TargetSwitcher targets={["en", "ja"]} primaryTarget="en" />);
    await user.click(screen.getByRole("button", { name: /Tiếng Anh/ })); // en (primary)
    expect(persistMock).not.toHaveBeenCalled();
  });
});
