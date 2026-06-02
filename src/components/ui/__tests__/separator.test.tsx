import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("ui/Separator", () => {
  it("renders as a separator element (decorative)", () => {
    render(<Separator data-testid="sep" />);
    // decorative=true → role=none or role=presentation, not explicit separator
    const el = screen.getByTestId("sep");
    expect(el).toBeInTheDocument();
  });

  it("has horizontal classes by default", () => {
    render(<Separator data-testid="sep-h" />);
    const el = screen.getByTestId("sep-h");
    expect(el.className).toContain("h-[1px]");
    expect(el.className).toContain("w-full");
  });

  it("has vertical classes when orientation=vertical", () => {
    render(<Separator orientation="vertical" data-testid="sep-v" />);
    const el = screen.getByTestId("sep-v");
    expect(el.className).toContain("h-full");
    expect(el.className).toContain("w-[1px]");
  });

  it("non-decorative separator has role=separator", () => {
    render(<Separator decorative={false} aria-label="divider" data-testid="sep-nd" />);
    const el = screen.getByTestId("sep-nd");
    expect(el).toHaveAttribute("role", "separator");
  });

  it("forwards className", () => {
    render(<Separator className="my-sep" data-testid="sep-cls" />);
    expect(screen.getByTestId("sep-cls").className).toContain("my-sep");
  });

  it("always has bg-border base class", () => {
    render(<Separator data-testid="sep-bg" />);
    expect(screen.getByTestId("sep-bg").className).toContain("bg-border");
  });

  it("shrink-0 is applied for flex layout safety", () => {
    render(<Separator data-testid="sep-shrink" />);
    expect(screen.getByTestId("sep-shrink").className).toContain("shrink-0");
  });
});
