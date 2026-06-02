import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

describe("ui/ScrollArea", () => {
  it("renders children inside the scroll area", () => {
    render(
      <ScrollArea>
        <p>Hello scroll</p>
      </ScrollArea>,
    );
    expect(screen.getByText("Hello scroll")).toBeInTheDocument();
  });

  it("forwards className to root element", () => {
    render(<ScrollArea className="custom-scroll" data-testid="sa">content</ScrollArea>);
    expect(screen.getByTestId("sa").className).toContain("custom-scroll");
  });

  it("renders multiple children", () => {
    render(
      <ScrollArea>
        <div data-testid="c1">Item 1</div>
        <div data-testid="c2">Item 2</div>
      </ScrollArea>,
    );
    expect(screen.getByTestId("c1")).toBeInTheDocument();
    expect(screen.getByTestId("c2")).toBeInTheDocument();
  });

  it("applies overflow-hidden class on root", () => {
    render(<ScrollArea data-testid="sa2">x</ScrollArea>);
    expect(screen.getByTestId("sa2").className).toContain("overflow-hidden");
  });

  it("ScrollBar renders inside ScrollArea without crashing (vertical)", () => {
    const { container } = render(
      <ScrollArea>
        <div style={{ height: 200 }}>content</div>
      </ScrollArea>,
    );
    // ScrollArea internally renders a ScrollBar (vertical by default)
    expect(container.firstChild).toBeInTheDocument();
  });

  it("explicit ScrollBar with horizontal orientation renders inside ScrollArea", () => {
    const { container } = render(
      <ScrollArea>
        <div style={{ width: 2000 }}>wide content</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
