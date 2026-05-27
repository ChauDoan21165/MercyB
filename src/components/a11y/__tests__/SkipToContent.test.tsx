// @vitest-environment jsdom
//
// SkipToContent — unit tests.
//
// Covers the skip-link contract:
//   1. Renders an anchor with href pointing at A11Y_CONFIG.skipToContentId.
//   2. Renders bilingual VI + EN text with `lang` attributes.
//   3. Activation moves focus to the matching target element.
//   4. Activation is a no-op (no crash, no preventDefault override) when
//      the target is absent — the browser's default hash-jump remains
//      the fallback.

import { describe, expect, it, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import SkipToContent from "../SkipToContent";
import { A11Y_CONFIG } from "@/config/a11y";

afterEach(() => {
  cleanup();
});

describe("SkipToContent", () => {
  it("renders an anchor with href pointing at A11Y_CONFIG.skipToContentId", () => {
    render(<SkipToContent />);
    const link = screen.getByTestId("skip-to-content");
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe(`#${A11Y_CONFIG.skipToContentId}`);
  });

  it("exposes a VI-first bilingual aria-label", () => {
    render(<SkipToContent />);
    const link = screen.getByTestId("skip-to-content");
    const label = link.getAttribute("aria-label") ?? "";
    expect(label).toContain("Bỏ qua đến nội dung chính");
    expect(label).toContain("Skip to main content");
    // VI primary — VI text appears before EN in the aria-label.
    expect(label.indexOf("Bỏ qua")).toBeLessThan(label.indexOf("Skip"));
  });

  it("renders both VI and EN spans, each carrying its own lang attribute", () => {
    render(<SkipToContent />);
    const viSpan = screen.getByText("Bỏ qua đến nội dung chính");
    const enSpan = screen.getByText("Skip to main content");
    expect(viSpan.getAttribute("lang")).toBe("vi");
    expect(enSpan.getAttribute("lang")).toBe("en");
  });

  it("activation moves focus to the matching target element", () => {
    // Set up a target element with the expected id and tabIndex.
    const target = document.createElement("main");
    target.id = A11Y_CONFIG.skipToContentId;
    target.tabIndex = -1;
    document.body.appendChild(target);

    render(<SkipToContent />);
    const link = screen.getByTestId("skip-to-content");
    fireEvent.click(link);

    expect(document.activeElement).toBe(target);

    document.body.removeChild(target);
  });

  it("activation is a no-op (no crash) when the target is absent", () => {
    // Ensure the target id is NOT present in this test.
    const stray = document.getElementById(A11Y_CONFIG.skipToContentId);
    if (stray) stray.remove();

    render(<SkipToContent />);
    const link = screen.getByTestId("skip-to-content");

    // Should not throw. With no target, the click does NOT call
    // preventDefault — the browser's default hash-jump remains the
    // fallback behavior.
    expect(() => fireEvent.click(link)).not.toThrow();
  });
});
