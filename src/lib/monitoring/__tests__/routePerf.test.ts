import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ROUTE_MOUNT_SLOW_THRESHOLD_MS,
  ROUTE_PERF_BREADCRUMB_CATEGORY,
  reportRouteMountPerf,
} from "../routePerf";

const addBreadcrumbMock = vi.hoisted(() => vi.fn());

vi.mock("../captureException", () => ({
  addBreadcrumb: addBreadcrumbMock,
}));

describe("routePerf — reportRouteMountPerf", () => {
  beforeEach(() => {
    addBreadcrumbMock.mockReset();
  });

  it("emits a breadcrumb above the threshold with routeName + durationMs", () => {
    reportRouteMountPerf("home", ROUTE_MOUNT_SLOW_THRESHOLD_MS + 73);

    expect(addBreadcrumbMock).toHaveBeenCalledTimes(1);
    const crumb = addBreadcrumbMock.mock.calls[0]![0]!;
    expect(crumb.category).toBe(ROUTE_PERF_BREADCRUMB_CATEGORY);
    expect(crumb.level).toBe("warning");
    expect(crumb.data.routeName).toBe("home");
    expect(crumb.data.durationMs).toBeGreaterThan(ROUTE_MOUNT_SLOW_THRESHOLD_MS);
  });

  it("stays quiet at or under the threshold", () => {
    reportRouteMountPerf("home", ROUTE_MOUNT_SLOW_THRESHOLD_MS);
    reportRouteMountPerf("home", 50);
    reportRouteMountPerf("home", 0);
    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("ignores NaN and negative durations without throwing", () => {
    expect(() => reportRouteMountPerf("home", Number.NaN)).not.toThrow();
    expect(() => reportRouteMountPerf("home", -1)).not.toThrow();
    // NaN is non-finite → silent; negative is finite and ≤ threshold → silent.
    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("payload shape is counts-only — exactly { routeName, durationMs }", () => {
    reportRouteMountPerf("ai_tutor", ROUTE_MOUNT_SLOW_THRESHOLD_MS + 5);

    const crumb = addBreadcrumbMock.mock.calls[0]![0]!;
    const dataKeys = Object.keys(crumb.data).sort();
    expect(dataKeys).toEqual(["durationMs", "routeName"]);
  });

  it("round-trips distinct routeNames across separate calls", () => {
    reportRouteMountPerf("home", ROUTE_MOUNT_SLOW_THRESHOLD_MS + 10);
    reportRouteMountPerf("ai_tutor", ROUTE_MOUNT_SLOW_THRESHOLD_MS + 20);
    reportRouteMountPerf("practice_phoneme_drill", ROUTE_MOUNT_SLOW_THRESHOLD_MS + 30);

    expect(addBreadcrumbMock).toHaveBeenCalledTimes(3);
    expect(addBreadcrumbMock.mock.calls[0]![0]!.data.routeName).toBe("home");
    expect(addBreadcrumbMock.mock.calls[1]![0]!.data.routeName).toBe("ai_tutor");
    expect(addBreadcrumbMock.mock.calls[2]![0]!.data.routeName).toBe(
      "practice_phoneme_drill",
    );
  });

  it("breadcrumb carries no other fields beyond routeName + durationMs", () => {
    reportRouteMountPerf("home", ROUTE_MOUNT_SLOW_THRESHOLD_MS + 5);

    const crumb = addBreadcrumbMock.mock.calls[0]![0]!;
    const serialized = JSON.stringify(crumb.data);
    // Defensive: no PII / no random other keys snuck in.
    expect(serialized).not.toMatch(/userId|user_id|email|token|sessionId/i);
  });
});
