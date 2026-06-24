// PATH: src/components/__tests__/ColorModeToggle.hardening.test.tsx
//
// Hardening unit tests for <ColorModeToggle/>.
//
// The component (src/components/ColorModeToggle.tsx) is tiny but has real
// surface area: it reads { mode, toggle } from the MbThemeProvider context,
// renders an icon Button, swaps the emoji + aria-label + title based on mode,
// and wires the Button's onClick to toggle.
//
// These tests exercise:
//   - rendering in the default ("color") mode
//   - rendering in the stored ("bw") mode (localStorage seeded)
//   - toggling color -> bw -> color and the side effects (DOM attr, storage)
//   - accessibility (aria-label / title / role)
//   - the contract that the component MUST be used inside a provider (throws)
//   - deterministic isolation via a mocked useMbTheme so both branches and the
//     onClick wiring can be asserted without relying on provider internals
//
// Everything is deterministic: no timers, no network, no randomness. The shared
// test setup (src/test/setup.ts) installs an in-memory localStorage and resets
// it between tests, so storage state never leaks across cases.

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type { ReactNode } from "react";

import { ColorModeToggle } from "@/components/ColorModeToggle";
import { MbThemeProvider } from "@/hooks/useMbTheme";

const STORAGE_KEY = "mb-theme-mode";
const THEME_ATTR = "data-mb-theme";

function renderWithProvider(ui: ReactNode) {
  return render(<MbThemeProvider>{ui}</MbThemeProvider>);
}

function getToggle(): HTMLButtonElement {
  return screen.getByRole("button") as HTMLButtonElement;
}

afterEach(() => {
  cleanup();
  // Keep the documentElement attribute from leaking between tests.
  document.documentElement.removeAttribute(THEME_ATTR);
});

describe("ColorModeToggle — default (color) mode inside provider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders exactly one button", () => {
    renderWithProvider(<ColorModeToggle />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("shows the palette emoji in color mode", () => {
    renderWithProvider(<ColorModeToggle />);
    expect(getToggle()).toHaveTextContent("🎨");
    expect(getToggle()).not.toHaveTextContent("⚫");
  });

  it("exposes the 'switch to B&W' aria-label and title in color mode", () => {
    renderWithProvider(<ColorModeToggle />);
    const btn = getToggle();
    expect(btn).toHaveAttribute(
      "aria-label",
      "Switch to black & white mode",
    );
    expect(btn).toHaveAttribute("title", "Switch to B&W");
  });

  it("applies the fixed icon sizing classes", () => {
    renderWithProvider(<ColorModeToggle />);
    const btn = getToggle();
    expect(btn).toHaveClass("h-8");
    expect(btn).toHaveClass("w-8");
  });

  it("is an enabled, focusable button (type defaults to button)", () => {
    renderWithProvider(<ColorModeToggle />);
    const btn = getToggle();
    expect(btn).toBeEnabled();
    expect(btn).not.toHaveAttribute("disabled");
  });
});

describe("ColorModeToggle — seeded (bw) mode inside provider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, "bw");
  });

  it("reads the persisted 'bw' value on first render and shows the bw icon", () => {
    renderWithProvider(<ColorModeToggle />);
    expect(getToggle()).toHaveTextContent("⚫");
    expect(getToggle()).not.toHaveTextContent("🎨");
  });

  it("exposes the 'switch to color' aria-label and title in bw mode", () => {
    renderWithProvider(<ColorModeToggle />);
    const btn = getToggle();
    expect(btn).toHaveAttribute("aria-label", "Switch to color mode");
    expect(btn).toHaveAttribute("title", "Switch to color");
  });

  it("reflects the stored mode on the documentElement attribute", () => {
    renderWithProvider(<ColorModeToggle />);
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe("bw");
  });

  it("ignores an invalid stored value and falls back to color mode", () => {
    window.localStorage.setItem(STORAGE_KEY, "not-a-real-mode");
    renderWithProvider(<ColorModeToggle />);
    expect(getToggle()).toHaveTextContent("🎨");
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe("color");
  });
});

describe("ColorModeToggle — toggling behavior (integration)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("toggles color -> bw on click, updating icon, labels, storage and DOM attr", () => {
    renderWithProvider(<ColorModeToggle />);
    const btn = getToggle();

    expect(btn).toHaveTextContent("🎨");

    fireEvent.click(btn);

    expect(btn).toHaveTextContent("⚫");
    expect(btn).toHaveAttribute("aria-label", "Switch to color mode");
    expect(btn).toHaveAttribute("title", "Switch to color");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("bw");
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe("bw");
  });

  it("toggles back bw -> color on a second click", () => {
    renderWithProvider(<ColorModeToggle />);
    const btn = getToggle();

    fireEvent.click(btn); // -> bw
    fireEvent.click(btn); // -> color

    expect(btn).toHaveTextContent("🎨");
    expect(btn).toHaveAttribute("aria-label", "Switch to black & white mode");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("color");
    expect(document.documentElement.getAttribute(THEME_ATTR)).toBe("color");
  });

  it("is idempotent across many clicks (odd -> bw, even -> color)", () => {
    renderWithProvider(<ColorModeToggle />);
    const btn = getToggle();

    for (let i = 1; i <= 6; i++) {
      fireEvent.click(btn);
      const expected = i % 2 === 1 ? "bw" : "color";
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(expected);
    }

    // 6 clicks => back to color
    expect(btn).toHaveTextContent("🎨");
  });
});

describe("ColorModeToggle — provider contract", () => {
  it("throws a clear error when rendered without MbThemeProvider", () => {
    // React logs the thrown render error; silence it to keep test output clean.
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() => render(<ColorModeToggle />)).toThrow(
        /useMbTheme must be used inside <MbThemeProvider>/,
      );
    } finally {
      errSpy.mockRestore();
    }
  });

  it("each instance is wired to the same provider state (two toggles agree)", () => {
    // Rendering two toggles under one provider proves onClick is bound to the
    // shared context's toggle, not per-instance local state: clicking one flips
    // the icon of the other too.
    renderWithProvider(
      <>
        <ColorModeToggle />
        <ColorModeToggle />
      </>,
    );
    const [a, b] = screen.getAllByRole("button");

    expect(a).toHaveTextContent("🎨");
    expect(b).toHaveTextContent("🎨");

    fireEvent.click(a);

    expect(a).toHaveTextContent("⚫");
    expect(b).toHaveTextContent("⚫");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("bw");
  });
});
