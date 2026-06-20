import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MercyBladeThemeToggle } from "@/components/MercyBladeThemeToggle";

/**
 * Hardening tests for MercyBladeThemeToggle.
 *
 * The component is a thin presentational wrapper over the real
 * `useMercyBladeTheme` hook (localStorage-backed, jsdom-deterministic).
 * These tests exercise the rendered output and the wiring between the
 * hook's state (color/bw) and the button's attributes, label, icon, and
 * persistence side-effects. localStorage is reset between every test by
 * the canonical storage mock in src/test/setup.ts, so each case starts
 * from the "color" default unless it seeds a stored value first.
 */

const STORAGE_KEY = "mb_visual_mode";

function getToggleButton(): HTMLButtonElement {
  // The component renders exactly one <button>.
  return screen.getByRole("button") as HTMLButtonElement;
}

beforeEach(() => {
  // Ensure a clean baseline even though setup.ts also resets storage.
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
  delete document.documentElement.dataset.mbTheme;
});

afterEach(() => {
  cleanup();
});

describe("MercyBladeThemeToggle — default (color) rendering", () => {
  it("renders a single button", () => {
    render(<MercyBladeThemeToggle />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("defaults to color mode when no stored preference exists", () => {
    render(<MercyBladeThemeToggle />);
    const btn = getToggleButton();
    expect(btn).toHaveAttribute("data-theme-toggle", "color");
  });

  it("shows the color-mode aria-label in color mode", () => {
    render(<MercyBladeThemeToggle />);
    const btn = getToggleButton();
    // In color mode the action offered is switching TO black & white.
    expect(btn).toHaveAttribute("aria-label", "Switch to black & white mode");
  });

  it("shows the bilingual color-mode title", () => {
    render(<MercyBladeThemeToggle />);
    expect(getToggleButton()).toHaveAttribute(
      "title",
      "Switch to B&W / Chuyển sang Đen Trắng",
    );
  });

  it("renders the color-mode visible label text", () => {
    render(<MercyBladeThemeToggle />);
    expect(screen.getByText("Color / Màu")).toBeInTheDocument();
  });

  it("renders a decorative palette icon hidden from assistive tech", () => {
    const { container } = render(<MercyBladeThemeToggle />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("colors the icon with the primary theme token in color mode", () => {
    const { container } = render(<MercyBladeThemeToggle />);
    const svg = container.querySelector("svg")!;
    expect(svg.style.color).toBe("hsl(var(--primary))");
  });
});

describe("MercyBladeThemeToggle — stored preference hydration", () => {
  it("hydrates to bw mode when localStorage holds 'bw'", () => {
    localStorage.setItem(STORAGE_KEY, "bw");
    render(<MercyBladeThemeToggle />);
    const btn = getToggleButton();
    expect(btn).toHaveAttribute("data-theme-toggle", "bw");
    expect(btn).toHaveAttribute("aria-label", "Switch to color mode");
    expect(screen.getByText("B&W / Đen Trắng")).toBeInTheDocument();
  });

  it("hydrates to color mode when localStorage holds 'color'", () => {
    localStorage.setItem(STORAGE_KEY, "color");
    render(<MercyBladeThemeToggle />);
    expect(getToggleButton()).toHaveAttribute("data-theme-toggle", "color");
  });

  it("falls back to color mode when localStorage holds an invalid value", () => {
    localStorage.setItem(STORAGE_KEY, "not-a-real-mode");
    render(<MercyBladeThemeToggle />);
    expect(getToggleButton()).toHaveAttribute("data-theme-toggle", "color");
  });

  it("renders the bw icon color (#000000) when hydrated to bw", () => {
    localStorage.setItem(STORAGE_KEY, "bw");
    const { container } = render(<MercyBladeThemeToggle />);
    const svg = container.querySelector("svg")!;
    expect(svg.style.color).toBe("rgb(0, 0, 0)");
  });
});

describe("MercyBladeThemeToggle — toggle behavior", () => {
  it("switches from color to bw on click and updates every surface", () => {
    render(<MercyBladeThemeToggle />);
    const btn = getToggleButton();
    expect(btn).toHaveAttribute("data-theme-toggle", "color");

    fireEvent.click(btn);

    expect(btn).toHaveAttribute("data-theme-toggle", "bw");
    expect(btn).toHaveAttribute("aria-label", "Switch to color mode");
    expect(btn).toHaveAttribute(
      "title",
      "Switch to Color / Chuyển sang Màu",
    );
    expect(screen.getByText("B&W / Đen Trắng")).toBeInTheDocument();
    expect(screen.queryByText("Color / Màu")).not.toBeInTheDocument();
  });

  it("switches back from bw to color on a second click (round trip)", () => {
    localStorage.setItem(STORAGE_KEY, "bw");
    render(<MercyBladeThemeToggle />);
    const btn = getToggleButton();

    fireEvent.click(btn);
    expect(btn).toHaveAttribute("data-theme-toggle", "color");

    fireEvent.click(btn);
    expect(btn).toHaveAttribute("data-theme-toggle", "bw");
  });

  it("remains consistent across many alternating clicks", () => {
    render(<MercyBladeThemeToggle />);
    const btn = getToggleButton();

    const sequence = ["bw", "color", "bw", "color", "bw"];
    for (const expected of sequence) {
      fireEvent.click(btn);
      expect(btn).toHaveAttribute("data-theme-toggle", expected);
    }
  });

  it("updates the icon color when toggled", () => {
    const { container } = render(<MercyBladeThemeToggle />);
    const btn = getToggleButton();
    const svg = container.querySelector("svg")!;

    expect(svg.style.color).toBe("hsl(var(--primary))");
    fireEvent.click(btn);
    expect(svg.style.color).toBe("rgb(0, 0, 0)");
  });
});

describe("MercyBladeThemeToggle — persistence side-effects", () => {
  it("persists the new mode to localStorage on toggle", () => {
    render(<MercyBladeThemeToggle />);
    // Effect persists the initial mode synchronously after mount.
    expect(localStorage.getItem(STORAGE_KEY)).toBe("color");

    fireEvent.click(getToggleButton());
    expect(localStorage.getItem(STORAGE_KEY)).toBe("bw");
  });

  it("reflects the mode on the documentElement data attribute", () => {
    render(<MercyBladeThemeToggle />);
    expect(document.documentElement.dataset.mbTheme).toBe("color");

    fireEvent.click(getToggleButton());
    expect(document.documentElement.dataset.mbTheme).toBe("bw");
  });
});

describe("MercyBladeThemeToggle — prop forwarding", () => {
  it("applies the provided className alongside the base gap class", () => {
    render(<MercyBladeThemeToggle className="custom-class" />);
    const btn = getToggleButton();
    expect(btn.className).toContain("custom-class");
    expect(btn.className).toContain("gap-2");
  });

  it("works with an empty className default (no trailing breakage)", () => {
    render(<MercyBladeThemeToggle />);
    expect(getToggleButton().className).toContain("gap-2");
  });

  it("renders for each supported variant", () => {
    for (const variant of ["outline", "ghost", "default"] as const) {
      const { unmount } = render(<MercyBladeThemeToggle variant={variant} />);
      expect(getToggleButton()).toBeInTheDocument();
      unmount();
    }
  });

  it("renders for each supported size", () => {
    for (const size of ["sm", "default", "lg", "icon"] as const) {
      const { unmount } = render(<MercyBladeThemeToggle size={size} />);
      expect(getToggleButton()).toBeInTheDocument();
      unmount();
    }
  });

  it("forwards a non-default variant + size combination without error", () => {
    render(<MercyBladeThemeToggle variant="ghost" size="lg" className="x" />);
    const btn = getToggleButton();
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("x");
  });
});

describe("MercyBladeThemeToggle — click handler integrity", () => {
  it("invokes toggle exactly once per click (no double-fire)", () => {
    render(<MercyBladeThemeToggle />);
    const btn = getToggleButton();

    // color -> bw is a single transition; a double-fire would land on color.
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("data-theme-toggle", "bw");
  });

  it("does not throw when localStorage writes fail", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });
    // The hook wraps saveMode in try/catch, so render + toggle must survive.
    expect(() => {
      render(<MercyBladeThemeToggle />);
      fireEvent.click(getToggleButton());
    }).not.toThrow();
    // In-memory state still advances even though persistence failed.
    expect(getToggleButton()).toHaveAttribute("data-theme-toggle", "bw");
    spy.mockRestore();
  });
});
