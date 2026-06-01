import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ShimmerSkeleton,
  RoomCardShimmer,
  ChatMessageShimmer,
  RoomGridShimmer,
} from "@/components/ui/shimmer-skeleton";

describe("ui/ShimmerSkeleton", () => {
  it("renders without crashing (default rectangular variant)", () => {
    const { container } = render(<ShimmerSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("is aria-hidden (screen-reader safe)", () => {
    const { container } = render(<ShimmerSkeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("applies rectangular class by default", () => {
    const { container } = render(<ShimmerSkeleton />);
    expect((container.firstChild as HTMLElement).className).toContain("rounded-md");
  });

  it("applies text variant class", () => {
    const { container } = render(<ShimmerSkeleton variant="text" />);
    expect((container.firstChild as HTMLElement).className).toContain("h-4");
    expect((container.firstChild as HTMLElement).className).toContain("rounded");
  });

  it("applies circular variant class", () => {
    const { container } = render(<ShimmerSkeleton variant="circular" />);
    expect((container.firstChild as HTMLElement).className).toContain("rounded-full");
  });

  it("applies numeric width and height as inline style", () => {
    const { container } = render(<ShimmerSkeleton width={80} height={40} />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("80px");
    expect(el.style.height).toBe("40px");
  });

  it("applies string width and height as inline style", () => {
    const { container } = render(<ShimmerSkeleton width="50%" height="2rem" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("50%");
    expect(el.style.height).toBe("2rem");
  });

  it("forwards custom className", () => {
    const { container } = render(<ShimmerSkeleton className="my-shimmer" />);
    expect((container.firstChild as HTMLElement).className).toContain("my-shimmer");
  });

  it("has bg-muted base class", () => {
    const { container } = render(<ShimmerSkeleton />);
    expect((container.firstChild as HTMLElement).className).toContain("bg-muted");
  });

  it("RoomCardShimmer renders without crashing", () => {
    const { container } = render(<RoomCardShimmer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("ChatMessageShimmer renders without crashing", () => {
    const { container } = render(<ChatMessageShimmer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("RoomGridShimmer renders the default count of 6 cards", () => {
    const { container } = render(<RoomGridShimmer />);
    // Each card is a .border element in RoomCardShimmer
    const cards = container.querySelectorAll(".border.rounded-lg");
    expect(cards.length).toBe(6);
  });

  it("RoomGridShimmer accepts a custom count", () => {
    const { container } = render(<RoomGridShimmer count={3} />);
    const cards = container.querySelectorAll(".border.rounded-lg");
    expect(cards.length).toBe(3);
  });
});
