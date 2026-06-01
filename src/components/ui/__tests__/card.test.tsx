import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card body</Card>);
    expect(screen.getByText("Card body")).toBeInTheDocument();
  });

  it("applies card base classes", () => {
    render(<Card data-testid="c">X</Card>);
    const el = screen.getByTestId("c");
    expect(el.className).toContain("rounded-lg");
    expect(el.className).toContain("border");
    expect(el.className).toContain("bg-card");
  });

  it("forwards custom className on Card", () => {
    render(<Card className="my-class" data-testid="c">X</Card>);
    expect(screen.getByTestId("c").className).toContain("my-class");
  });

  it("CardHeader renders with p-6 class", () => {
    render(<CardHeader data-testid="h">H</CardHeader>);
    expect(screen.getByTestId("h").className).toContain("p-6");
  });

  it("CardTitle renders as h3", () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByText("My Title").tagName).toBe("H3");
  });

  it("CardTitle applies semibold class", () => {
    render(<CardTitle data-testid="t">T</CardTitle>);
    expect(screen.getByTestId("t").className).toContain("font-semibold");
  });

  it("CardDescription renders as p", () => {
    render(<CardDescription>Desc</CardDescription>);
    expect(screen.getByText("Desc").tagName).toBe("P");
  });

  it("CardContent applies p-6 pt-0", () => {
    render(<CardContent data-testid="cc">C</CardContent>);
    const el = screen.getByTestId("cc");
    expect(el.className).toContain("p-6");
    expect(el.className).toContain("pt-0");
  });

  it("CardFooter applies flex items-center", () => {
    render(<CardFooter data-testid="f">F</CardFooter>);
    const el = screen.getByTestId("f");
    expect(el.className).toContain("flex");
    expect(el.className).toContain("items-center");
  });

  it("composes full card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>A description</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("A description")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
