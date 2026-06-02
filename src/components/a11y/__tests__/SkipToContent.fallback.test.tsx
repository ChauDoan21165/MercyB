import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SkipToContent from "@/components/a11y/SkipToContent";
import { A11Y_CONFIG } from "@/config/a11y";

/**
 * P0-2 (WCAG 2.4.1, Bypass Blocks) regression guard.
 *
 * SkipToContent is mounted globally but used to silently no-op on every route
 * whose page did not declare its own <main id="main-content">. The fix:
 *   1. pages that DO declare #main-content still win (preferred target);
 *   2. the broad route set without one falls back to the AppHeroShell content
 *      region, marked [data-skip-fallback], so the link always lands somewhere.
 */
afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

function addTarget(attrs: Record<string, string>) {
  const el = document.createElement("div");
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  el.tabIndex = -1;
  el.textContent = "content";
  document.body.appendChild(el);
  return el;
}

describe("SkipToContent — target resolution (WCAG 2.4.1)", () => {
  it("focuses the per-page #main-content landmark when present", async () => {
    const main = addTarget({ id: A11Y_CONFIG.skipToContentId });
    render(<SkipToContent />);
    await userEvent.click(screen.getByTestId("skip-to-content"));
    expect(main).toHaveFocus();
  });

  it("falls back to [data-skip-fallback] when no #main-content exists", async () => {
    const fallback = addTarget({ "data-skip-fallback": "" });
    render(<SkipToContent />);
    await userEvent.click(screen.getByTestId("skip-to-content"));
    expect(fallback).toHaveFocus();
  });

  it("prefers #main-content over the fallback when both exist", async () => {
    const fallback = addTarget({ "data-skip-fallback": "" });
    const main = addTarget({ id: A11Y_CONFIG.skipToContentId });
    render(<SkipToContent />);
    await userEvent.click(screen.getByTestId("skip-to-content"));
    expect(main).toHaveFocus();
    expect(fallback).not.toHaveFocus();
  });

  it("no-ops gracefully (no crash) when neither target is on the page", async () => {
    render(<SkipToContent />);
    const link = screen.getByTestId("skip-to-content");
    await userEvent.click(link);
    // Nothing to focus; the link itself simply retains/returns focus.
    expect(link).toBeInTheDocument();
  });

  it("exposes a single bilingual aria-label and the configured href", () => {
    render(<SkipToContent />);
    const link = screen.getByTestId("skip-to-content");
    expect(link).toHaveAttribute("href", `#${A11Y_CONFIG.skipToContentId}`);
    expect(link).toHaveAttribute(
      "aria-label",
      expect.stringMatching(/Bỏ qua đến nội dung chính/),
    );
  });
});
