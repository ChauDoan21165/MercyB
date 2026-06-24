import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

// ---------------------------------------------------------------------------
// PointsDisplay only consumes the `usePoints` hook. The hook itself reaches
// into Supabase + the auth provider, so we mock the hook boundary to keep
// these tests deterministic and free of external dependencies (no network,
// no Supabase client, no React context wiring required).
// ---------------------------------------------------------------------------

const mockUsePoints = vi.fn();

vi.mock("@/hooks/usePoints", () => ({
  usePoints: () => mockUsePoints(),
}));

import { PointsDisplay } from "../PointsDisplay";

// Convenience helper: configure the mocked hook's return value.
const setHook = (value: { totalPoints?: number; isLoading?: boolean }) => {
  mockUsePoints.mockReturnValue({
    totalPoints: value.totalPoints ?? 0,
    isLoading: value.isLoading ?? false,
    // Extra fields the real hook returns; the component ignores them but we
    // include them so the mock matches the production shape.
    awardPoints: vi.fn(),
    refreshPoints: vi.fn(),
  });
};

beforeEach(() => {
  mockUsePoints.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("PointsDisplay — loading state", () => {
  it("renders a loading indicator while isLoading is true", () => {
    setHook({ isLoading: true });
    render(<PointsDisplay />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("does not render the points label while loading", () => {
    setHook({ isLoading: true, totalPoints: 999 });
    render(<PointsDisplay />);

    expect(screen.queryByText(/Your Points/)).not.toBeInTheDocument();
    // The numeric value must not leak through during the loading branch.
    expect(screen.queryByText("999")).not.toBeInTheDocument();
  });

  it("renders an animated star icon in the loading branch", () => {
    setHook({ isLoading: true });
    const { container } = render(<PointsDisplay />);

    const animated = container.querySelector(".animate-pulse");
    expect(animated).not.toBeNull();
  });
});

describe("PointsDisplay — loaded state", () => {
  it("renders the bilingual points label once loaded", () => {
    setHook({ isLoading: false, totalPoints: 0 });
    render(<PointsDisplay />);

    expect(
      screen.getByText("Your Points / Điểm Của Bạn")
    ).toBeInTheDocument();
  });

  it("does not render the loading text once loaded", () => {
    setHook({ isLoading: false, totalPoints: 42 });
    render(<PointsDisplay />);

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders zero points", () => {
    setHook({ isLoading: false, totalPoints: 0 });
    render(<PointsDisplay />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders a small positive point total", () => {
    setHook({ isLoading: false, totalPoints: 5 });
    render(<PointsDisplay />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

describe("PointsDisplay — number formatting (toLocaleString)", () => {
  it("formats a four-digit total with a grouping separator", () => {
    setHook({ isLoading: false, totalPoints: 1234 });
    render(<PointsDisplay />);

    // Compute the expected formatted string the same way the component does,
    // so the assertion is locale-agnostic across CI environments.
    expect(screen.getByText((1234).toLocaleString())).toBeInTheDocument();
  });

  it("formats a large total (millions)", () => {
    setHook({ isLoading: false, totalPoints: 1_000_000 });
    render(<PointsDisplay />);

    expect(
      screen.getByText((1_000_000).toLocaleString())
    ).toBeInTheDocument();
  });

  it("renders a negative total without crashing", () => {
    setHook({ isLoading: false, totalPoints: -50 });
    render(<PointsDisplay />);

    expect(screen.getByText((-50).toLocaleString())).toBeInTheDocument();
  });

  it("renders a fractional total via toLocaleString", () => {
    setHook({ isLoading: false, totalPoints: 1234.5 });
    render(<PointsDisplay />);

    expect(screen.getByText((1234.5).toLocaleString())).toBeInTheDocument();
  });
});

describe("PointsDisplay — structure & re-render behavior", () => {
  it("renders inside a single card container", () => {
    setHook({ isLoading: false, totalPoints: 10 });
    const { container } = render(<PointsDisplay />);

    // The component always renders exactly one root Card element.
    expect(container.firstElementChild).not.toBeNull();
  });

  it("reflects updated point totals on re-render", () => {
    setHook({ isLoading: false, totalPoints: 100 });
    const { rerender } = render(<PointsDisplay />);
    expect(screen.getByText("100")).toBeInTheDocument();

    setHook({ isLoading: false, totalPoints: 250 });
    rerender(<PointsDisplay />);

    expect(screen.queryByText("100")).not.toBeInTheDocument();
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("transitions from the loading branch to the loaded branch", () => {
    setHook({ isLoading: true });
    const { rerender } = render(<PointsDisplay />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    setHook({ isLoading: false, totalPoints: 7 });
    rerender(<PointsDisplay />);

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("calls the usePoints hook on render", () => {
    setHook({ isLoading: false, totalPoints: 0 });
    render(<PointsDisplay />);

    expect(mockUsePoints).toHaveBeenCalled();
  });
});
