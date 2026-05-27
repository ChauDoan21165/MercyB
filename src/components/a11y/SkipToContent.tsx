/**
 * SkipToContent — bilingual skip link.
 *
 * Renders as the first focusable element in the app shell so a
 * keyboard user can jump past the global header band straight to the
 * page's <main id="main-content"> landmark. Visually hidden until
 * focused (the standard skip-link pattern), then becomes a visible
 * fixed-position pill.
 *
 * Behavior:
 *   - On click / Enter, calls preventDefault on the anchor's default
 *     hash-jump (which would only scroll, not move focus) and
 *     instead `.focus()`-es the target element. The target must
 *     declare `tabIndex={-1}` to be programmatically focusable
 *     without entering the regular tab order.
 *   - Target id is sourced from `A11Y_CONFIG.skipToContentId` so the
 *     anchor + landmark stay synchronized via one constant.
 *   - If the target is missing (e.g. a page hasn't been updated yet),
 *     the link no-ops gracefully and lets the browser perform its
 *     default hash-jump as a fallback.
 *
 * Bilingual posture:
 *   - VI primary, EN secondary, each wrapped in its own `<span lang>`
 *     so screen-reader voices pronounce each language correctly.
 *   - The whole anchor carries an explicit `aria-label` (VI-first)
 *     so a VN screen-reader user hears a single phrase rather than
 *     reading both languages back-to-back.
 *
 * No external deps beyond React + the existing a11y config.
 */

import { useRef } from "react";
import { A11Y_CONFIG } from "@/config/a11y";

export default function SkipToContent() {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(A11Y_CONFIG.skipToContentId);
    if (!target) {
      // No target on this route — let the default hash-jump handle
      // it. The browser will at least scroll to top.
      return;
    }
    event.preventDefault();
    // Programmatic focus requires `tabIndex={-1}` on the target.
    // Don't add `preventScroll`: a sighted keyboard user expects the
    // viewport to actually move to the new focus.
    target.focus();
  };

  return (
    <a
      ref={ref}
      href={`#${A11Y_CONFIG.skipToContentId}`}
      onClick={handleClick}
      data-testid="skip-to-content"
      aria-label="Bỏ qua đến nội dung chính / Skip to main content"
      className={[
        "absolute left-3 top-3 z-[1000001]",
        "rounded-md px-3 py-2 text-sm font-semibold",
        "bg-violet-600 text-white shadow-lg",
        "transition-transform duration-150",
        "-translate-y-[150%] focus:translate-y-0 focus-visible:translate-y-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
      ].join(" ")}
    >
      <span lang="vi">Bỏ qua đến nội dung chính</span>
      <span aria-hidden className="mx-1.5 text-white/60">·</span>
      <span lang="en">Skip to main content</span>
    </a>
  );
}
