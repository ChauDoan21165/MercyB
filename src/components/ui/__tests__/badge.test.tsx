import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default variant classes (bg-primary)", () => {
    render(<Badge data-testid="b">Default</Badge>);
    expect(screen.getByTestId("b").className).toContain("bg-primary");
  });

  it("applies secondary variant classes", () => {
    render(<Badge variant="secondary" data-testid="b">S</Badge>);
    expect(screen.getByTestId("b").className).toContain("bg-secondary");
  });

  it("applies destructive variant classes", () => {
    render(<Badge variant="destructive" data-testid="b">D</Badge>);
    expect(screen.getByTestId("b").className).toContain("bg-destructive");
  });

  it("applies outline variant classes (no bg-*)", () => {
    render(<Badge variant="outline" data-testid="b">O</Badge>);
    const el = screen.getByTestId("b");
    expect(el.className).toContain("text-foreground");
    expect(el.className).not.toContain("bg-primary");
  });

  it("forwards custom className", () => {
    render(<Badge className="extra-class" data-testid="b">X</Badge>);
    expect(screen.getByTestId("b").className).toContain("extra-class");
  });

  it("renders as a div element", () => {
    render(<Badge data-testid="b">X</Badge>);
    expect(screen.getByTestId("b").tagName).toBe("DIV");
  });
});
