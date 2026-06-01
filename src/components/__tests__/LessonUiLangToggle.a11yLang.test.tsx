import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import LessonUiLangToggle from "@/components/LessonUiLangToggle";

/**
 * P0-3 (WCAG 3.1.2) — aria-label variant.
 *
 * The group label is a single attribute string and cannot carry per-segment
 * `lang`. Under the document's `lang="vi"`, a mixed "VI / EN" value is read by
 * a Vietnamese TTS voice and mispronounces the English half. The label must be
 * single-language (Vietnamese-first, the product default).
 */
describe("LessonUiLangToggle — single-language group label (WCAG 3.1.2)", () => {
  it("labels the group in Vietnamese only (no mixed-language string)", () => {
    render(<LessonUiLangToggle value="vi" onChange={() => {}} />);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-label", "Ngôn ngữ giải thích");
    const label = group.getAttribute("aria-label") ?? "";
    expect(label).not.toContain("/");
    expect(label).not.toMatch(/Explanation/i);
  });

  it("still exposes both VI and EN toggle buttons", () => {
    render(<LessonUiLangToggle value="vi" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "VI" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
  });
});
