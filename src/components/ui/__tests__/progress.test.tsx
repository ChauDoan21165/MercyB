import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "@/components/ui/progress";

describe("ui/Progress", () => {
  it("renders a progressbar role element", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("applies the value as a translateX transform on the indicator", () => {
    const { container } = render(<Progress value={40} />);
    const indicator = container.querySelector("[style]") as HTMLElement;
    expect(indicator).not.toBeNull();
    // value=40 → translateX(-60%)
    expect(indicator.style.transform).toBe("translateX(-60%)");
  });

  it("handles value=0 correctly (fully hidden indicator)", () => {
    const { container } = render(<Progress value={0} />);
    const indicator = container.querySelector("[style]") as HTMLElement;
    expect(indicator.style.transform).toBe("translateX(-100%)");
  });

  it("handles value=100 correctly (fully visible indicator)", () => {
    const { container } = render(<Progress value={100} />);
    const indicator = container.querySelector("[style]") as HTMLElement;
    expect(indicator.style.transform).toBe("translateX(-0%)");
  });

  it("defaults to 0 transform when value is undefined", () => {
    const { container } = render(<Progress />);
    const indicator = container.querySelector("[style]") as HTMLElement;
    expect(indicator.style.transform).toBe("translateX(-100%)");
  });

  it("forwards className to the root element", () => {
    render(<Progress value={50} className="custom-progress" data-testid="prog" />);
    expect(screen.getByTestId("prog").className).toContain("custom-progress");
  });

  it("applies base classes for styling", () => {
    render(<Progress value={50} data-testid="prog2" />);
    const el = screen.getByTestId("prog2");
    expect(el.className).toContain("rounded-full");
  });
});
