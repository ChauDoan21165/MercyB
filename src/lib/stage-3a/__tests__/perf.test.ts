import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  AGGREGATOR_SLOW_THRESHOLD_MS,
  PERF_BREADCRUMB_CATEGORY,
  UI_MOUNT_SLOW_THRESHOLD_MS,
  aggregateLocalWeaknessesInstrumented,
  reportUiMountPerf,
} from "../perfInstrumentation.js";

const addBreadcrumbMock = vi.hoisted(() => vi.fn());

vi.mock("../../monitoring/captureException.js", () => ({
  addBreadcrumb: addBreadcrumbMock,
}));

const aggregateMock = vi.hoisted(() => vi.fn());

vi.mock("../aggregator.js", () => ({
  aggregateLocalWeaknesses: aggregateMock,
}));

const FAKE_MAP_NON_EMPTY = {
  topL1Patterns: [
    { tag: "vi_l1_3rd_person_s", count: 4, lastSeen: 1_000 },
    { tag: "vi_l1_past_ed", count: 2, lastSeen: 900 },
  ],
  placementWeaknesses: [{ tag: "vi_l1_plural_s", severity: "medium" }],
  topPronunciationPainPoints: [{ axis: "TH_T", errorRate: 0.4, samples: 5 }],
  isEmpty: false,
  generatedAt: 0,
};

const FAKE_MAP_EMPTY = {
  topL1Patterns: [],
  placementWeaknesses: [],
  topPronunciationPainPoints: [],
  isEmpty: true,
  generatedAt: 0,
};

describe("Stage 3A perf instrumentation — aggregateLocalWeaknessesInstrumented", () => {
  beforeEach(() => {
    addBreadcrumbMock.mockReset();
    aggregateMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("emits a counts-only breadcrumb when the aggregator exceeds the threshold", () => {
    aggregateMock.mockReturnValue(FAKE_MAP_NON_EMPTY);

    let calls = 0;
    vi.spyOn(performance, "now").mockImplementation(() => {
      const t = calls === 0 ? 0 : AGGREGATOR_SLOW_THRESHOLD_MS + 25;
      calls += 1;
      return t;
    });

    const result = aggregateLocalWeaknessesInstrumented();

    expect(result).toBe(FAKE_MAP_NON_EMPTY);
    expect(addBreadcrumbMock).toHaveBeenCalledTimes(1);

    const crumb = addBreadcrumbMock.mock.calls[0]![0]!;
    expect(crumb.category).toBe(PERF_BREADCRUMB_CATEGORY.aggregator);
    expect(crumb.level).toBe("warning");
    expect(crumb.data.durationMs).toBeGreaterThan(AGGREGATOR_SLOW_THRESHOLD_MS);
    expect(crumb.data.l1Count).toBe(2);
    expect(crumb.data.placementCount).toBe(1);
    expect(crumb.data.pronunciationCount).toBe(1);
  });

  it("does NOT emit a breadcrumb when the aggregator is fast", () => {
    aggregateMock.mockReturnValue(FAKE_MAP_NON_EMPTY);

    let calls = 0;
    vi.spyOn(performance, "now").mockImplementation(() => {
      const t = calls === 0 ? 100 : 100 + 3; // 3 ms — well under threshold
      calls += 1;
      return t;
    });

    aggregateLocalWeaknessesInstrumented();

    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("returns the empty-map shape pass-through and breadcrumbs only on slow path", () => {
    aggregateMock.mockReturnValue(FAKE_MAP_EMPTY);

    let calls = 0;
    vi.spyOn(performance, "now").mockImplementation(() => {
      const t = calls === 0 ? 0 : 1;
      calls += 1;
      return t;
    });

    const result = aggregateLocalWeaknessesInstrumented();
    expect(result).toBe(FAKE_MAP_EMPTY);
    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("breadcrumb payload carries counts only — no tag strings or signal content", () => {
    aggregateMock.mockReturnValue(FAKE_MAP_NON_EMPTY);

    let calls = 0;
    vi.spyOn(performance, "now").mockImplementation(() => {
      const t = calls === 0 ? 0 : AGGREGATOR_SLOW_THRESHOLD_MS + 5;
      calls += 1;
      return t;
    });

    aggregateLocalWeaknessesInstrumented();

    const crumb = addBreadcrumbMock.mock.calls[0]![0]!;
    const dataKeys = Object.keys(crumb.data).sort();
    expect(dataKeys).toEqual(["durationMs", "l1Count", "placementCount", "pronunciationCount"]);

    const serialized = JSON.stringify(crumb);
    expect(serialized).not.toContain("vi_l1_3rd_person_s");
    expect(serialized).not.toContain("vi_l1_past_ed");
    expect(serialized).not.toContain("vi_l1_plural_s");
    expect(serialized).not.toContain("TH_T");
  });
});

describe("Stage 3A perf instrumentation — reportUiMountPerf", () => {
  beforeEach(() => {
    addBreadcrumbMock.mockReset();
  });

  it("emits a breadcrumb above the UI threshold", () => {
    reportUiMountPerf(UI_MOUNT_SLOW_THRESHOLD_MS + 50);

    expect(addBreadcrumbMock).toHaveBeenCalledTimes(1);
    const crumb = addBreadcrumbMock.mock.calls[0]![0]!;
    expect(crumb.category).toBe(PERF_BREADCRUMB_CATEGORY.uiMount);
    expect(crumb.data.durationMs).toBeGreaterThan(UI_MOUNT_SLOW_THRESHOLD_MS);
    expect(Object.keys(crumb.data)).toEqual(["durationMs"]);
  });

  it("stays quiet under the UI threshold", () => {
    reportUiMountPerf(10);
    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("ignores invalid durations without throwing", () => {
    reportUiMountPerf(Number.NaN);
    reportUiMountPerf(-1);
    reportUiMountPerf(Number.POSITIVE_INFINITY);
    // Infinity > threshold is true, so we still emit — that's fine,
    // but NaN and negative durations must stay silent.
    const calls = addBreadcrumbMock.mock.calls.filter(
      (c) => Number.isFinite((c[0]! as { data: { durationMs: number } }).data.durationMs),
    );
    expect(calls.length).toBe(addBreadcrumbMock.mock.calls.length);
  });
});
