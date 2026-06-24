// Hardening tests for src/components/RoomCardSkeleton.tsx
//
// RoomCardSkeleton renders a single placeholder card; RoomGridSkeleton renders
// a responsive grid of N RoomCardSkeleton instances (default 24). Both are pure
// presentational components with no external dependencies (no supabase, fetch,
// network, or context) — so these tests exercise render output, the `count`
// prop contract (defaults, zero, large, negative/NaN), determinism, and the
// stable class hooks the layout relies on.

import { describe, it, expect } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { RoomCardSkeleton, RoomGridSkeleton } from "../RoomCardSkeleton";

afterEach(() => {
  cleanup();
});

// Each RoomCardSkeleton uses 4 Skeleton elements; the Skeleton primitive always
// carries the "animate-pulse" class, so counting them is a stable proxy for
// "how many skeleton cards rendered".
const SKELETONS_PER_CARD = 4;

function countSkeletons(container: HTMLElement): number {
  // The Skeleton primitive always carries "bg-muted" (the Card root does not),
  // so this is a stable count of skeleton placeholders regardless of how
  // tw-merge resolves the rounded-* utilities on individual skeletons.
  return container.querySelectorAll(".bg-muted").length;
}

function countCards(container: HTMLElement): number {
  // The Card root carries "bg-card"; the per-card wrapper carries "animate-pulse"
  // on the Card itself. Use bg-card which is unique to the Card primitive.
  return container.querySelectorAll(".bg-card").length;
}

describe("RoomCardSkeleton", () => {
  it("is exported as a function component", () => {
    expect(typeof RoomCardSkeleton).toBe("function");
  });

  it("renders a single card without throwing", () => {
    const { container } = render(<RoomCardSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders exactly one Card root", () => {
    const { container } = render(<RoomCardSkeleton />);
    expect(countCards(container)).toBe(1);
  });

  it("renders the expected number of inner Skeleton placeholders", () => {
    const { container } = render(<RoomCardSkeleton />);
    expect(countSkeletons(container)).toBe(SKELETONS_PER_CARD);
  });

  it("applies the pulse animation to the card root for the loading affordance", () => {
    const { container } = render(<RoomCardSkeleton />);
    const card = container.querySelector(".bg-card");
    expect(card).not.toBeNull();
    expect(card?.className).toContain("animate-pulse");
  });

  it("positions the status-badge skeleton absolutely in the top-right", () => {
    const { container } = render(<RoomCardSkeleton />);
    const badgeWrap = container.querySelector(".absolute.top-1.right-1");
    expect(badgeWrap).not.toBeNull();
    // The badge skeleton is a rounded-full circle.
    expect(badgeWrap?.querySelector(".rounded-full")).not.toBeNull();
  });

  it("ignores unexpected props gracefully (takes no props)", () => {
    // RoomCardSkeleton accepts no props; passing none is the only contract.
    const { container } = render(<RoomCardSkeleton />);
    expect(container.querySelectorAll(".bg-card").length).toBe(1);
  });

  it("renders deterministically across repeated mounts", () => {
    const first = render(<RoomCardSkeleton />).container.innerHTML;
    cleanup();
    const second = render(<RoomCardSkeleton />).container.innerHTML;
    expect(first).toBe(second);
  });

  it("renders no interactive or text content (pure placeholder)", () => {
    const { container } = render(<RoomCardSkeleton />);
    expect(container.textContent).toBe("");
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("a")).toBeNull();
  });
});

describe("RoomGridSkeleton", () => {
  it("is exported as a function component", () => {
    expect(typeof RoomGridSkeleton).toBe("function");
  });

  it("defaults to 24 cards when count is omitted", () => {
    const { container } = render(<RoomGridSkeleton />);
    expect(countCards(container)).toBe(24);
  });

  it("renders the default number of skeleton placeholders (24 * per-card)", () => {
    const { container } = render(<RoomGridSkeleton />);
    expect(countSkeletons(container)).toBe(24 * SKELETONS_PER_CARD);
  });

  it("renders exactly the requested count of cards", () => {
    const { container } = render(<RoomGridSkeleton count={7} />);
    expect(countCards(container)).toBe(7);
  });

  it("renders a single card when count is 1", () => {
    const { container } = render(<RoomGridSkeleton count={1} />);
    expect(countCards(container)).toBe(1);
  });

  it("renders no cards when count is 0", () => {
    const { container } = render(<RoomGridSkeleton count={0} />);
    expect(countCards(container)).toBe(0);
    expect(countSkeletons(container)).toBe(0);
  });

  it("still renders the grid container when count is 0", () => {
    const { container } = render(<RoomGridSkeleton count={0} />);
    const grid = container.querySelector(".grid");
    expect(grid).not.toBeNull();
    expect(grid?.children.length).toBe(0);
  });

  it("handles a large count without throwing", () => {
    const { container } = render(<RoomGridSkeleton count={120} />);
    expect(countCards(container)).toBe(120);
  });

  it("treats a negative count as zero (Array.from length clamps)", () => {
    // Array.from({ length: -1 }) yields an empty array, so no cards render.
    const { container } = render(<RoomGridSkeleton count={-5} />);
    expect(countCards(container)).toBe(0);
  });

  it("treats NaN count as zero (Array.from length coerces to 0)", () => {
    const { container } = render(<RoomGridSkeleton count={NaN} />);
    expect(countCards(container)).toBe(0);
  });

  it("truncates a fractional count toward zero", () => {
    // Array.from({ length: 3.9 }) produces 3 entries.
    const { container } = render(<RoomGridSkeleton count={3.9} />);
    expect(countCards(container)).toBe(3);
  });

  it("applies the responsive grid layout classes", () => {
    const { container } = render(<RoomGridSkeleton count={2} />);
    const grid = container.querySelector(".grid");
    expect(grid).not.toBeNull();
    const cls = grid?.className ?? "";
    expect(cls).toContain("grid-cols-2");
    expect(cls).toContain("sm:grid-cols-3");
    expect(cls).toContain("md:grid-cols-4");
    expect(cls).toContain("lg:grid-cols-5");
    expect(cls).toContain("xl:grid-cols-6");
    expect(cls).toContain("gap-3");
  });

  it("renders each card as a direct child of the grid", () => {
    const { container } = render(<RoomGridSkeleton count={4} />);
    const grid = container.querySelector(".grid");
    expect(grid?.children.length).toBe(4);
  });

  it("renders deterministically for a given count", () => {
    const first = render(<RoomGridSkeleton count={5} />).container.innerHTML;
    cleanup();
    const second = render(<RoomGridSkeleton count={5} />).container.innerHTML;
    expect(first).toBe(second);
  });

  it("produces no user-visible text content", () => {
    const { container } = render(<RoomGridSkeleton count={3} />);
    expect(container.textContent).toBe("");
  });
});
