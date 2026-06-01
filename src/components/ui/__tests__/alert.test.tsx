import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

describe("Alert", () => {
  it("renders with role=alert", () => {
    render(<Alert>Content</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Alert data-testid="a">Content</Alert>);
    const el = screen.getByTestId("a");
    expect(el.className).toContain("bg-background");
    expect(el.className).toContain("text-foreground");
  });

  it("applies destructive variant classes", () => {
    render(<Alert variant="destructive" data-testid="a">Content</Alert>);
    const el = screen.getByTestId("a");
    expect(el.className).toContain("text-destructive");
  });

  it("forwards custom className", () => {
    render(<Alert className="my-custom" data-testid="a">Content</Alert>);
    expect(screen.getByTestId("a").className).toContain("my-custom");
  });

  it("renders AlertTitle as h5", () => {
    render(<Alert><AlertTitle>Title here</AlertTitle></Alert>);
    const heading = screen.getByText("Title here");
    expect(heading.tagName).toBe("H5");
  });

  it("renders AlertDescription", () => {
    render(<Alert><AlertDescription>Desc text</AlertDescription></Alert>);
    expect(screen.getByText("Desc text")).toBeInTheDocument();
  });

  it("AlertTitle forwards className", () => {
    render(<Alert><AlertTitle className="extra-class" data-testid="t">T</AlertTitle></Alert>);
    expect(screen.getByTestId("t").className).toContain("extra-class");
  });

  it("AlertDescription forwards className", () => {
    render(<Alert><AlertDescription className="desc-class" data-testid="d">D</AlertDescription></Alert>);
    expect(screen.getByTestId("d").className).toContain("desc-class");
  });
});
