import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/**
 * P0-1 (WCAG 2.3.3, Animation from Interactions) regression guard.
 *
 * src/index.css ships always-on `infinite` keyframe animations on the Mercy
 * presence/halo/wings. The repo declares `enableReducedMotion: true` in
 * src/config/a11y.ts but the stylesheet previously never honored the OS
 * "reduce motion" setting (0 prefers-reduced-motion blocks). jsdom does not
 * apply stylesheets, so we assert on the stylesheet source: the guard exists
 * and disables every always-on animation class.
 */
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "../index.css"), "utf8");

const ALWAYS_ON_ANIMATION_CLASSES = [
  "animate-mercy-breathe",
  "animate-halo-pulse",
  "animate-wing-flutter-left",
  "animate-wing-flutter-right",
  "animate-wave-expand",
];

function reducedMotionBlock(source: string): string {
  const start = source.indexOf("@media (prefers-reduced-motion: reduce)");
  if (start === -1) return "";
  // Capture from the at-rule to its closing brace (single-level block).
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return source.slice(start);
}

describe("index.css — prefers-reduced-motion guard (WCAG 2.3.3)", () => {
  it("declares at least one prefers-reduced-motion: reduce block", () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });

  it("each always-on infinite animation class is gated by the guard", () => {
    const block = reducedMotionBlock(css);
    expect(block).not.toBe("");
    for (const cls of ALWAYS_ON_ANIMATION_CLASSES) {
      expect(block, `${cls} must be inside the reduced-motion block`).toContain(
        `.${cls}`,
      );
    }
    expect(block).toMatch(/animation:\s*none/);
  });

  it("the animation classes still ship their default (non-reduced) motion", () => {
    // The fix must not have deleted the base animations — only gated them.
    for (const cls of ALWAYS_ON_ANIMATION_CLASSES) {
      expect(css).toMatch(new RegExp(`\\.${cls}\\s*\\{[^}]*animation:`));
    }
  });
});
