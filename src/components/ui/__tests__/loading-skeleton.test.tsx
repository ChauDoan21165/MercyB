import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Skeleton,
  LoadingSkeleton,
  RoomGridSkeleton,
  ChatMessageSkeleton,
  ListSkeleton,
  SearchSkeleton,
} from "@/components/ui/loading-skeleton";

describe("Skeleton", () => {
  it("renders with animate-pulse class", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s").className).toContain("animate-pulse");
  });

  it("renders with rounded-md class", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s").className).toContain("rounded-md");
  });

  it("forwards custom className", () => {
    render(<Skeleton className="custom-sk" data-testid="s" />);
    expect(screen.getByTestId("s").className).toContain("custom-sk");
  });
});

describe("LoadingSkeleton variants", () => {
  it("renders page variant with heading skeleton", () => {
    const { container } = render(<LoadingSkeleton variant="page" />);
    // page variant renders multiple skeleton elements
    const skeletons = container.querySelectorAll("[class*='animate-pulse']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders card variant as a single skeleton", () => {
    const { container } = render(<LoadingSkeleton variant="card" />);
    const skeletons = container.querySelectorAll("[class*='animate-pulse']");
    expect(skeletons.length).toBe(1);
  });

  it("renders list variant with ListSkeleton", () => {
    const { container } = render(<LoadingSkeleton variant="list" />);
    const skeletons = container.querySelectorAll("[class*='animate-pulse']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders grid variant with multiple items", () => {
    const { container } = render(<LoadingSkeleton variant="grid" />);
    const skeletons = container.querySelectorAll("[class*='animate-pulse']");
    expect(skeletons.length).toBeGreaterThan(1);
  });
});

describe("RoomGridSkeleton", () => {
  it("renders 12 grid items by default", () => {
    const { container } = render(<RoomGridSkeleton />);
    // Each item is a div with border bg-card
    const items = container.querySelectorAll("[class*='bg-card']");
    expect(items.length).toBe(12);
  });

  it("renders custom count of grid items", () => {
    const { container } = render(<RoomGridSkeleton count={4} />);
    const items = container.querySelectorAll("[class*='bg-card']");
    expect(items.length).toBe(4);
  });
});

describe("ListSkeleton", () => {
  it("renders 5 items by default", () => {
    const { container } = render(<ListSkeleton />);
    const items = container.querySelectorAll("[class*='rounded-lg'][class*='border']");
    expect(items.length).toBe(5);
  });

  it("renders custom count", () => {
    const { container } = render(<ListSkeleton count={3} />);
    const items = container.querySelectorAll("[class*='rounded-lg'][class*='border']");
    expect(items.length).toBe(3);
  });
});

describe("ChatMessageSkeleton", () => {
  it("renders without error", () => {
    const { container } = render(<ChatMessageSkeleton />);
    const skeletons = container.querySelectorAll("[class*='animate-pulse']");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe("SearchSkeleton", () => {
  it("renders a full-width skeleton", () => {
    render(<SearchSkeleton data-testid="ss" />);
    // SearchSkeleton is a Skeleton with w-full class
    const { container } = render(<SearchSkeleton />);
    const sk = container.querySelector("[class*='w-full']");
    expect(sk).toBeInTheDocument();
  });
});
