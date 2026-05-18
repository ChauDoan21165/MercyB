import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Button, buttonVariants } from "@/components/ui/button";
import { touchTarget } from "@/design-system/tokens";

// Regression guard for the mobile-audit Category 2 fix: the shared
// button primitive previously shipped sub-44px sizes (sm 36px,
// default/icon 40px). jsdom can't measure rendered pixels, so we assert
// on the emitted class contract instead — that every touch-spec size
// carries the shared 44px-minimum token, and that the explicit opt-out
// does not.

const TOUCH_SPEC_SIZES = ["default", "sm", "lg", "icon"] as const;

describe("ui/Button — touch-target sizing", () => {
  it("the shared token is the 44px minimum we expect", () => {
    expect(touchTarget).toContain("min-h-[44px]");
    expect(touchTarget).toContain("min-w-[44px]");
  });

  it.each(TOUCH_SPEC_SIZES)(
    "size=%s meets the ≥44px touch target (min-h/min-w floor present)",
    (size) => {
      const cls = buttonVariants({ size });
      expect(cls, `size=${size}`).toContain("min-h-[44px]");
      expect(cls, `size=${size}`).toContain("min-w-[44px]");
    },
  );

  it("does not regress to the old sub-spec fixed heights", () => {
    for (const size of TOUCH_SPEC_SIZES) {
      const cls = buttonVariants({ size });
      // Old values were h-9 (sm 36px) and h-10 (default/icon 40px).
      expect(cls).not.toMatch(/\bh-9\b/);
      expect(cls).not.toMatch(/\bh-10\b/);
      expect(cls).not.toMatch(/\bw-10\b/);
    }
  });

  it("compact is a documented opt-out: explicitly NOT touch-compliant", () => {
    const cls = buttonVariants({ size: "compact" });
    expect(cls).not.toContain("min-h-[44px]");
    expect(cls).toContain("h-8"); // intentionally 32px, pointer-only
  });

  it("defaults to the `default` size (which is now touch-compliant)", () => {
    expect(buttonVariants()).toContain("min-h-[44px]");
  });

  // Backward-compat: public API unchanged.
  it("renders a <button> by default and forwards props", () => {
    render(
      <Button type="button" data-testid="b" aria-label="Save">
        Save
      </Button>,
    );
    const btn = screen.getByTestId("b");
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("aria-label", "Save");
    expect(btn.className).toContain("min-h-[44px]");
  });

  it("asChild still renders the child element (Slot), not a button", () => {
    render(
      <Button asChild>
        <a href="/x" data-testid="link">
          Go
        </a>
      </Button>,
    );
    const link = screen.getByTestId("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/x");
    expect(link.className).toContain("min-h-[44px]");
  });

  it("a consumer className still composes (variant/size API intact)", () => {
    render(
      <Button size="icon" variant="ghost" className="rounded-full" data-testid="i">
        ★
      </Button>,
    );
    const btn = screen.getByTestId("i");
    expect(btn.className).toContain("rounded-full");
    expect(btn.className).toContain("min-h-[44px]"); // floor preserved
  });
});
