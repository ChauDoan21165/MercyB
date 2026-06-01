import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import TrialExpiredScreen from "@/components/TrialExpiredScreen";

/**
 * P0-3 (WCAG 3.1.2, Language of Parts) regression guard.
 *
 * The document is globally `lang="vi"` (index.html). This live trial-gate
 * screen mixes Vietnamese and English; without per-part `lang`, a Vietnamese
 * TTS engine mispronounces the English half. Each language segment must carry
 * its own `lang` so screen readers switch voices correctly.
 */
const renderScreen = () =>
  render(
    <MemoryRouter>
      <TrialExpiredScreen />
    </MemoryRouter>,
  );

describe("TrialExpiredScreen — per-part lang (WCAG 3.1.2)", () => {
  it("tags the Vietnamese heading and copy with lang='vi'", () => {
    renderScreen();
    expect(screen.getByText("Hết hạn dùng thử 3 ngày")).toHaveAttribute(
      "lang",
      "vi",
    );
    expect(
      screen.getByText(/Nâng cấp để tiếp tục học với Mercy/),
    ).toHaveAttribute("lang", "vi");
  });

  it("tags the English copy with lang='en'", () => {
    renderScreen();
    expect(
      screen.getByText("Your 3-day free trial has ended"),
    ).toHaveAttribute("lang", "en");
    expect(
      screen.getByText(/Upgrade to continue learning with Mercy/),
    ).toHaveAttribute("lang", "en");
  });

  it("splits the bilingual link labels into lang-tagged spans", () => {
    renderScreen();
    // "Xem gói / See plans"
    expect(screen.getByText("Xem gói")).toHaveAttribute("lang", "vi");
    expect(screen.getByText("See plans")).toHaveAttribute("lang", "en");
    // "Quay lại danh sách / Back to rooms"
    expect(screen.getByText("Quay lại danh sách")).toHaveAttribute(
      "lang",
      "vi",
    );
    expect(screen.getByText("Back to rooms")).toHaveAttribute("lang", "en");
  });

  it("hides the visual '/' separators from assistive tech", () => {
    const { container } = renderScreen();
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    // The two slash separators (icons also aria-hidden) — at least the two
    // bilingual separators are present and hidden.
    const slashes = Array.from(separators).filter(
      (el) => el.textContent === "/",
    );
    expect(slashes).toHaveLength(2);
  });

  it("keeps both languages visible in each link (no language dropped)", () => {
    renderScreen();
    const planLink = screen.getByRole("link", { name: /Xem gói.*See plans/ });
    expect(planLink).toHaveAttribute("href", "/pricing");
    const roomsLink = screen.getByRole("link", {
      name: /Quay lại danh sách.*Back to rooms/,
    });
    expect(roomsLink).toHaveAttribute("href", "/rooms");
  });
});
