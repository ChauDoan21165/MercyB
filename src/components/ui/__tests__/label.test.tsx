import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

describe("Label", () => {
  it("renders children text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders as a <label> element", () => {
    render(<Label data-testid="l">Name</Label>);
    expect(screen.getByTestId("l").tagName).toBe("LABEL");
  });

  it("applies text-sm and font-medium classes", () => {
    render(<Label data-testid="l">X</Label>);
    const el = screen.getByTestId("l");
    expect(el.className).toContain("text-sm");
    expect(el.className).toContain("font-medium");
  });

  it("forwards htmlFor attribute", () => {
    render(<Label htmlFor="email-input" data-testid="l">Email</Label>);
    expect(screen.getByTestId("l")).toHaveAttribute("for", "email-input");
  });

  it("forwards custom className", () => {
    render(<Label className="my-label" data-testid="l">X</Label>);
    expect(screen.getByTestId("l").className).toContain("my-label");
  });
});
