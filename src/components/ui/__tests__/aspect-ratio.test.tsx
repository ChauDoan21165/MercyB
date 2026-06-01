import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

describe("AspectRatio", () => {
  it("renders children inside the container", () => {
    render(
      <AspectRatio ratio={16 / 9}>
        <img src="https://example.com/img.jpg" alt="Test image" />
      </AspectRatio>
    );
    expect(screen.getByRole("img", { name: "Test image" })).toBeInTheDocument();
  });

  it("renders without children", () => {
    const { container } = render(<AspectRatio ratio={1} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with text content", () => {
    render(
      <AspectRatio ratio={4 / 3}>
        <span>Aspect content</span>
      </AspectRatio>
    );
    expect(screen.getByText("Aspect content")).toBeInTheDocument();
  });

  it("forwards className to root", () => {
    const { container } = render(
      <AspectRatio ratio={1} className="custom-ar" />
    );
    // Radix AspectRatio wraps in a div; find any element with our class
    const el = container.querySelector("[class*='custom-ar']");
    expect(el).toBeInTheDocument();
  });
});
