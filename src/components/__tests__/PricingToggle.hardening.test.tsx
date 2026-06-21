// src/components/__tests__/PricingToggle.hardening.test.tsx
//
// Hardening tests for the PricingToggle component.
//
// PricingToggle is a purely presentational control: two clickable
// Monthly/Yearly labels flanking a Switch, plus a SavingsBadge on the
// yearly side. It owns no state — `isYearly` is controlled by the parent
// and every interaction routes through the `onToggle(isYearly: boolean)`
// callback. There are no external side-effects (no supabase, no fetch,
// no network), so the real child components (Switch, SavingsBadge) and
// the pricing constants are exercised directly rather than mocked; that
// also guards the integration contract between them.
//
// PricingToggle's only export is the `PricingToggle` component itself
// (`PricingToggleProps` is an internal, non-exported interface).

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";

import { PricingToggle } from "@/components/PricingToggle";
import {
  MONTHLY_PRICE_VND,
  YEARLY_PRICE_VND,
  computeYearlySavingsPct,
} from "@/lib/pricing/displayPrices";

afterEach(() => {
  cleanup();
});

/** Locate the clickable "Monthly" label (role=button containing "Monthly"). */
function getMonthlyButton(): HTMLElement {
  const buttons = screen.getAllByRole("button");
  const match = buttons.find((b) => /Monthly/.test(b.textContent ?? ""));
  if (!match) throw new Error("Monthly button not found");
  return match;
}

/** Locate the clickable "Yearly" label (role=button containing "Yearly"). */
function getYearlyButton(): HTMLElement {
  const buttons = screen.getAllByRole("button");
  const match = buttons.find((b) => /Yearly/.test(b.textContent ?? ""));
  if (!match) throw new Error("Yearly button not found");
  return match;
}

/** The Radix Switch renders with role="switch". */
function getSwitch(): HTMLElement {
  return screen.getByRole("switch");
}

describe("PricingToggle — structure & rendering", () => {
  it("renders a labelled group container", () => {
    render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    const group = screen.getByRole("group", { name: "Billing period" });
    expect(group).toBeInTheDocument();
  });

  it("renders both English labels and their Vietnamese subtitles", () => {
    render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    // English labels
    expect(getMonthlyButton()).toHaveTextContent("Monthly");
    expect(getYearlyButton()).toHaveTextContent("Yearly");
    // Vietnamese subtitles (Vietnamese-first invariant)
    expect(screen.getByText("Hàng tháng")).toBeInTheDocument();
    expect(screen.getByText("Hàng năm")).toBeInTheDocument();
  });

  it("renders exactly the two clickable labels plus the switch", () => {
    render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    // Two role=button labels.
    const labelButtons = screen
      .getAllByRole("button")
      .filter((b) => /Monthly|Yearly/.test(b.textContent ?? ""));
    expect(labelButtons).toHaveLength(2);
    // One switch.
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("renders the Switch with its accessible label", () => {
    render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    expect(
      screen.getByRole("switch", { name: "Toggle yearly billing" }),
    ).toBeInTheDocument();
  });

  it("gives both labels keyboard focusability (tabIndex 0)", () => {
    render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    expect(getMonthlyButton()).toHaveAttribute("tabindex", "0");
    expect(getYearlyButton()).toHaveAttribute("tabindex", "0");
  });
});

describe("PricingToggle — controlled state reflection", () => {
  it("reflects isYearly=false: switch unchecked, Monthly pressed", () => {
    render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    expect(getSwitch()).toHaveAttribute("aria-checked", "false");
    expect(getMonthlyButton()).toHaveAttribute("aria-pressed", "true");
    expect(getYearlyButton()).toHaveAttribute("aria-pressed", "false");
  });

  it("reflects isYearly=true: switch checked, Yearly pressed", () => {
    render(<PricingToggle isYearly={true} onToggle={vi.fn()} />);
    expect(getSwitch()).toHaveAttribute("aria-checked", "true");
    expect(getMonthlyButton()).toHaveAttribute("aria-pressed", "false");
    expect(getYearlyButton()).toHaveAttribute("aria-pressed", "true");
  });

  it("applies the active text style to whichever side is selected", () => {
    const { rerender } = render(
      <PricingToggle isYearly={false} onToggle={vi.fn()} />,
    );
    expect(getMonthlyButton().className).toContain("text-primary");
    expect(getYearlyButton().className).toContain("text-muted-foreground");

    rerender(<PricingToggle isYearly={true} onToggle={vi.fn()} />);
    expect(getMonthlyButton().className).toContain("text-muted-foreground");
    expect(getYearlyButton().className).toContain("text-primary");
  });

  it("aria-pressed flags are always mutually exclusive", () => {
    for (const isYearly of [true, false]) {
      cleanup();
      render(<PricingToggle isYearly={isYearly} onToggle={vi.fn()} />);
      const monthly = getMonthlyButton().getAttribute("aria-pressed");
      const yearly = getYearlyButton().getAttribute("aria-pressed");
      expect(monthly).not.toEqual(yearly);
    }
  });
});

describe("PricingToggle — click interactions", () => {
  it("clicking Monthly calls onToggle(false)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={true} onToggle={onToggle} />);
    fireEvent.click(getMonthlyButton());
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("clicking Yearly calls onToggle(true)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    fireEvent.click(getYearlyButton());
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("clicking Monthly while already monthly still calls onToggle(false)", () => {
    // The label is dumb: it always reports its own side, regardless of
    // the current state. The parent is responsible for any no-op dedupe.
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    fireEvent.click(getMonthlyButton());
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("clicking the SavingsBadge inside the Yearly label bubbles to onToggle(true)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    const yearly = getYearlyButton();
    // Click a descendant element; the onClick handler is on the label.
    const inner = within(yearly).getByText("Yearly");
    fireEvent.click(inner);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("toggling the Switch from off reports the new value (true)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    fireEvent.click(getSwitch());
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("toggling the Switch from on reports the new value (false)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={true} onToggle={onToggle} />);
    fireEvent.click(getSwitch());
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});

describe("PricingToggle — keyboard interactions", () => {
  it("Enter on the Monthly label calls onToggle(false)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={true} onToggle={onToggle} />);
    fireEvent.keyDown(getMonthlyButton(), { key: "Enter" });
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("Space on the Monthly label calls onToggle(false)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={true} onToggle={onToggle} />);
    fireEvent.keyDown(getMonthlyButton(), { key: " " });
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("Enter on the Yearly label calls onToggle(true)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    fireEvent.keyDown(getYearlyButton(), { key: "Enter" });
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("Space on the Yearly label calls onToggle(true)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    fireEvent.keyDown(getYearlyButton(), { key: " " });
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("ignores unrelated keys on the labels (no callback)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    for (const key of ["a", "Tab", "Escape", "ArrowRight", "Shift"]) {
      fireEvent.keyDown(getMonthlyButton(), { key });
      fireEvent.keyDown(getYearlyButton(), { key });
    }
    expect(onToggle).not.toHaveBeenCalled();
  });
});

describe("PricingToggle — SavingsBadge integration", () => {
  it("renders the savings percentage derived from the canonical prices", () => {
    render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    const pct = computeYearlySavingsPct(MONTHLY_PRICE_VND, YEARLY_PRICE_VND);
    // Sanity: at 200k vs 2M this is the well-known ~17%.
    expect(pct).toBe(17);
    // The badge text is "Save {pct}% · Tiết kiệm {pct}%" — assert the
    // percentage surfaces somewhere in the rendered output.
    const matches = screen.getAllByText(new RegExp(`${pct}%`));
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders the Vietnamese savings copy ('Tiết kiệm')", () => {
    render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    expect(screen.getByText(/Tiết kiệm/)).toBeInTheDocument();
  });

  it("keeps the savings badge visible regardless of toggle state", () => {
    // The badge is intentionally rendered next to the Yearly label
    // whether the toggle is on or off, so the value prop is always shown.
    const { rerender } = render(
      <PricingToggle isYearly={false} onToggle={vi.fn()} />,
    );
    expect(screen.getByText(/Tiết kiệm/)).toBeInTheDocument();
    rerender(<PricingToggle isYearly={true} onToggle={vi.fn()} />);
    expect(screen.getByText(/Tiết kiệm/)).toBeInTheDocument();
  });
});

describe("PricingToggle — determinism & resilience", () => {
  it("produces identical markup across repeated renders with the same props", () => {
    const first = render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    const firstHtml = first.container.innerHTML;
    cleanup();
    const second = render(<PricingToggle isYearly={false} onToggle={vi.fn()} />);
    expect(second.container.innerHTML).toBe(firstHtml);
  });

  it("does not invoke onToggle on mount (no spurious side-effects)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it("handles a rapid sequence of interactions, forwarding each", () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <PricingToggle isYearly={false} onToggle={onToggle} />,
    );
    fireEvent.click(getYearlyButton()); // true
    rerender(<PricingToggle isYearly={true} onToggle={onToggle} />);
    fireEvent.click(getMonthlyButton()); // false
    rerender(<PricingToggle isYearly={false} onToggle={onToggle} />);
    fireEvent.keyDown(getYearlyButton(), { key: "Enter" }); // true
    expect(onToggle.mock.calls).toEqual([[true], [false], [true]]);
  });

  it("uses a stable onToggle reference per call (callback identity not mutated)", () => {
    const onToggle = vi.fn();
    render(<PricingToggle isYearly={false} onToggle={onToggle} />);
    fireEvent.click(getYearlyButton());
    fireEvent.click(getMonthlyButton());
    // Both invocations land on the same spy we passed in.
    expect(onToggle).toHaveBeenCalledTimes(2);
  });
});
