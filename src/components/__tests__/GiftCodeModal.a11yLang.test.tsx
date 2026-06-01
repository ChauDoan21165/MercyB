import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { GiftCodeModal } from "@/components/GiftCodeModal";

/**
 * P0-3 (WCAG 3.1.2, Language of Parts) — live gift-code modal (rendered from
 * AccountPage). Its VI/EN chrome previously rendered as single un-tagged text
 * nodes inside the lang="vi" document. Each language segment must now carry its
 * own `lang` (via the shared <Bilingual>) so screen readers switch voices.
 */
const renderModal = () =>
  render(
    <MemoryRouter>
      <GiftCodeModal open onOpenChange={() => {}} />
    </MemoryRouter>,
  );

describe("GiftCodeModal — per-part lang (WCAG 3.1.2)", () => {
  it("tags the bilingual title segments", () => {
    renderModal();
    expect(screen.getByText("Enter Gift Code")).toHaveAttribute("lang", "en");
    expect(screen.getByText("Nhập Mã Quà Tặng")).toHaveAttribute("lang", "vi");
  });

  it("tags the description's English and Vietnamese halves", () => {
    renderModal();
    expect(
      screen.getByText(/Enter your gift code to unlock/),
    ).toHaveAttribute("lang", "en");
    expect(
      screen.getByText("Nhập mã quà tặng để mở khóa quyền truy cập"),
    ).toHaveAttribute("lang", "vi");
  });

  it("tags the field label segments", () => {
    renderModal();
    expect(screen.getByText("Gift Code")).toHaveAttribute("lang", "en");
    expect(screen.getByText("Mã quà tặng")).toHaveAttribute("lang", "vi");
  });

  it("tags the redeem button segments", () => {
    renderModal();
    expect(screen.getByText("Redeem")).toHaveAttribute("lang", "en");
    expect(screen.getByText("Kích hoạt")).toHaveAttribute("lang", "vi");
  });
});
