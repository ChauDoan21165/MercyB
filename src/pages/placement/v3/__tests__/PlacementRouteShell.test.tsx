// @vitest-environment jsdom

import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import PlacementRouteShell from "../PlacementRouteShell";

const reportRouteMountPerfMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/monitoring/routePerf", () => ({
  reportRouteMountPerf: reportRouteMountPerfMock,
}));

describe("PlacementRouteShell", () => {
  beforeEach(() => {
    reportRouteMountPerfMock.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders its children verbatim", () => {
    render(
      <PlacementRouteShell routeName="placement_welcome">
        <div data-testid="shell-child">child content</div>
      </PlacementRouteShell>,
    );

    const child = screen.getByTestId("shell-child");
    expect(child).toBeTruthy();
    expect(child.textContent).toBe("child content");
  });

  it("calls reportRouteMountPerf once per mount with the given routeName", () => {
    render(
      <PlacementRouteShell routeName="placement_test">
        <div />
      </PlacementRouteShell>,
    );

    expect(reportRouteMountPerfMock).toHaveBeenCalledTimes(1);
    const [routeName, durationMs] = reportRouteMountPerfMock.mock.calls[0]!;
    expect(routeName).toBe("placement_test");
    expect(typeof durationMs).toBe("number");
    expect(Number.isFinite(durationMs)).toBe(true);
    expect(durationMs).toBeGreaterThanOrEqual(0);
  });

  it("fires the perf signal with distinct routeNames across separate mounts", () => {
    const first = render(
      <PlacementRouteShell routeName="placement_welcome">
        <span />
      </PlacementRouteShell>,
    );
    expect(reportRouteMountPerfMock.mock.calls[0]![0]).toBe("placement_welcome");
    first.unmount();

    render(
      <PlacementRouteShell routeName="placement_results">
        <span />
      </PlacementRouteShell>,
    );

    expect(reportRouteMountPerfMock).toHaveBeenCalledTimes(2);
    expect(reportRouteMountPerfMock.mock.calls[1]![0]).toBe("placement_results");
  });

  it("does not mutate, wrap, or otherwise re-render its children", () => {
    const { container } = render(
      <PlacementRouteShell routeName="placement_who_for">
        <main data-testid="page">page body</main>
      </PlacementRouteShell>,
    );

    // The shell renders as a Fragment — the rendered DOM root is the
    // child element itself, not a wrapping <div>.
    expect(container.firstElementChild?.tagName).toBe("MAIN");
  });

  it("never throws when routeName is an empty string (still emits)", () => {
    expect(() =>
      render(
        <PlacementRouteShell routeName="">
          <span />
        </PlacementRouteShell>,
      ),
    ).not.toThrow();
    expect(reportRouteMountPerfMock).toHaveBeenCalledTimes(1);
    expect(reportRouteMountPerfMock.mock.calls[0]![0]).toBe("");
  });
});
