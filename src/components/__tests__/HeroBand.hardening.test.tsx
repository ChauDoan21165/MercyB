// src/components/__tests__/HeroBand.hardening.test.tsx
//
// Hardening tests for src/components/HeroBand.tsx
//
// HeroBand is a locked-visual, brand-only presentational component:
//   - default export, no props, no external dependencies (no supabase/fetch/router)
//   - renders a <section data-mb-hero> with an inline <style>, a background div,
//     a haze div, and a centered two-line slogan:
//       "English & Knowledge" / "Colors of Life"
//
// These tests guard the structural + textual invariants that the source file
// documents as "LOCKED VISUAL". They are deterministic (no timers, no random,
// no network) and re-render fresh per test.

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import HeroBand from "../HeroBand";

afterEach(() => {
  cleanup();
});

// Small helper: the root <section> carries the data-mb-hero marker.
function renderHero() {
  const { container } = render(<HeroBand />);
  const section = container.querySelector("section[data-mb-hero]");
  return { container, section };
}

describe("HeroBand — exports", () => {
  it("exports a callable default React component", () => {
    expect(HeroBand).toBeTypeOf("function");
  });

  it("renders without throwing and produces a non-empty tree", () => {
    const { container } = render(<HeroBand />);
    expect(container.firstChild).not.toBeNull();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("is idempotent across repeated renders (same markup each time)", () => {
    const first = render(<HeroBand />).container.innerHTML;
    cleanup();
    const second = render(<HeroBand />).container.innerHTML;
    expect(first).toBe(second);
  });
});

describe("HeroBand — root structure", () => {
  it("root element is a <section> with the data-mb-hero marker", () => {
    const { section } = renderHero();
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe("SECTION");
  });

  it("root section carries the mb-6 spacing class", () => {
    const { section } = renderHero();
    expect(section?.className).toContain("mb-6");
  });

  it("renders exactly one hero section (no duplicate brand band)", () => {
    const { container } = renderHero();
    expect(container.querySelectorAll("section[data-mb-hero]")).toHaveLength(1);
  });

  it("renders the shell, background, haze, and inner layers", () => {
    const { section } = renderHero();
    expect(section?.querySelector(".mb-heroShell")).not.toBeNull();
    expect(section?.querySelector(".mb-heroBg")).not.toBeNull();
    expect(section?.querySelector(".mb-heroHaze")).not.toBeNull();
    expect(section?.querySelector(".mb-heroInner")).not.toBeNull();
  });

  it("nests background, haze, and inner inside the shell", () => {
    const { section } = renderHero();
    const shell = section?.querySelector(".mb-heroShell");
    expect(shell).not.toBeNull();
    expect(shell?.querySelector(".mb-heroBg")).not.toBeNull();
    expect(shell?.querySelector(".mb-heroHaze")).not.toBeNull();
    expect(shell?.querySelector(".mb-heroInner")).not.toBeNull();
  });
});

describe("HeroBand — slogan text (locked visual)", () => {
  it('renders the title "English & Knowledge" as an <h2>', () => {
    renderHero();
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).not.toBeNull();
    // &amp; in source decodes to a literal ampersand at runtime.
    expect(heading.textContent).toBe("English & Knowledge");
    expect(heading.className).toContain("mb-heroTitle");
  });

  it('renders the subtitle "Colors of Life"', () => {
    const { section } = renderHero();
    const sub = section?.querySelector(".mb-heroSub");
    expect(sub).not.toBeNull();
    expect(sub?.textContent).toBe("Colors of Life");
  });

  it("renders exactly one level-2 heading", () => {
    renderHero();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(1);
  });

  it("places both slogan lines inside the centered inner container", () => {
    const { section } = renderHero();
    const inner = section?.querySelector(".mb-heroInner");
    expect(inner).not.toBeNull();
    const scoped = within(inner as HTMLElement);
    expect(scoped.getByText("English & Knowledge")).not.toBeNull();
    expect(scoped.getByText("Colors of Life")).not.toBeNull();
  });

  it("orders the title before the subtitle in the DOM", () => {
    const { section } = renderHero();
    const title = section?.querySelector(".mb-heroTitle");
    const sub = section?.querySelector(".mb-heroSub");
    expect(title).not.toBeNull();
    expect(sub).not.toBeNull();
    const position = title!.compareDocumentPosition(sub!);
    // Subtitle should follow the title.
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("HeroBand — accessibility & decorative layers", () => {
  it("marks the background and haze layers as aria-hidden (decorative)", () => {
    const { section } = renderHero();
    expect(section?.querySelector(".mb-heroBg")?.getAttribute("aria-hidden")).toBe(
      "true",
    );
    expect(
      section?.querySelector(".mb-heroHaze")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("does not render the brand text as an image (text stays selectable/translatable)", () => {
    const { container } = renderHero();
    expect(container.querySelector("img")).toBeNull();
  });

  it("exposes no interactive controls inside the brand-only band", () => {
    const { container } = renderHero();
    expect(container.querySelectorAll("button, a, input")).toHaveLength(0);
  });
});

describe("HeroBand — styling contract", () => {
  it("ships an inline <style> block scoped to data-mb-hero", () => {
    const { section } = renderHero();
    const style = section?.querySelector("style");
    expect(style).not.toBeNull();
    expect(style?.textContent).toContain("[data-mb-hero]");
  });

  it("references the locked background image path", () => {
    const { section } = renderHero();
    const style = section?.querySelector("style");
    expect(style?.textContent).toContain("/hero/hero_band.jpg");
  });

  it("keeps rounded corners + border + shadow on the shell (locked visual)", () => {
    const { section } = renderHero();
    const css = section?.querySelector("style")?.textContent ?? "";
    expect(css).toContain("border-radius");
    expect(css).toContain("box-shadow");
  });

  it("retains a mobile media query for the 640px breakpoint", () => {
    const { section } = renderHero();
    const css = section?.querySelector("style")?.textContent ?? "";
    expect(css).toContain("max-width: 640px");
  });
});
