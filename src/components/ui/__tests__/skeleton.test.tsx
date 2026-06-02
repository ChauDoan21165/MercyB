import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";

describe("ui/Skeleton", () => {
  it("renders a div", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("has animate-pulse class", () => {
    const { container } = render(<Skeleton />);
    expect((container.firstChild as HTMLElement).className).toContain("animate-pulse");
  });

  it("has rounded-md class", () => {
    const { container } = render(<Skeleton />);
    expect((container.firstChild as HTMLElement).className).toContain("rounded-md");
  });

  it("has bg-muted class", () => {
    const { container } = render(<Skeleton />);
    expect((container.firstChild as HTMLElement).className).toContain("bg-muted");
  });

  it("forwards custom className", () => {
    const { container } = render(<Skeleton className="w-32 h-8" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("w-32");
    expect(el.className).toContain("h-8");
  });

  it("can be used as a data-testid'd container", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toBeInTheDocument();
  });

  it("renders children when provided", () => {
    render(<Skeleton>Loading...</Skeleton>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("multiple skeletons render independently", () => {
    const { container } = render(
      <div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>,
    );
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(3);
  });
});
