import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ENGINE_SLOW_THRESHOLD_MS,
  PERF_BREADCRUMB_CATEGORY,
  UI_MOUNT_SLOW_THRESHOLD_MS,
  reportUiMountPerf,
  selectSuggestedPracticeInstrumented,
} from "../perfInstrumentation";
import type { Stage3AState } from "../suggestedPractice";

const addBreadcrumbMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/monitoring/captureException", () => ({
  addBreadcrumb: addBreadcrumbMock,
}));

const NON_EMPTY_STATE: Stage3AState = {
  topL1Patterns: [
    { tag: "vi_l1_3rd_person_s", count: 4, lastSeen: 1_000 },
    { tag: "vi_l1_past_ed", count: 2, lastSeen: 900 },
  ],
  placementWeaknesses: [{ tag: "vi_l1_plural_s", severity: "medium" }],
  topPronunciationPainPoints: [
    { axis: "TH_T", errorRate: 0.4, samples: 5 },
  ],
  isEmpty: false,
  generatedAt: 0,
};

const EMPTY_STATE: Stage3AState = {
  topL1Patterns: [],
  placementWeaknesses: [],
  topPronunciationPainPoints: [],
  isEmpty: true,
  generatedAt: 0,
};

function mockPerfNowSeq(values: number[]): void {
  let i = 0;
  vi.spyOn(performance, "now").mockImplementation(() => {
    const t = values[Math.min(i, values.length - 1)]!;
    i += 1;
    return t;
  });
}

describe("Stage 3B perf — selectSuggestedPracticeInstrumented", () => {
  beforeEach(() => {
    addBreadcrumbMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the same items as the pure engine for non-empty state", () => {
    mockPerfNowSeq([0, 1]);
    const items = selectSuggestedPracticeInstrumented(NON_EMPTY_STATE);

    expect(items).toHaveLength(3);
    expect(items.map((i) => i.kind)).toEqual([
      "l1",
      "placement",
      "pronunciation",
    ]);
  });

  it("emits a counts-only breadcrumb when the engine exceeds the threshold", () => {
    mockPerfNowSeq([0, ENGINE_SLOW_THRESHOLD_MS + 12]);

    selectSuggestedPracticeInstrumented(NON_EMPTY_STATE);

    expect(addBreadcrumbMock).toHaveBeenCalledTimes(1);
    const crumb = addBreadcrumbMock.mock.calls[0]![0]!;
    expect(crumb.category).toBe(PERF_BREADCRUMB_CATEGORY.engine);
    expect(crumb.level).toBe("warning");
    expect(crumb.data.durationMs).toBeGreaterThan(ENGINE_SLOW_THRESHOLD_MS);
    expect(crumb.data.itemCount).toBe(3);
    expect(crumb.data.l1Count).toBe(1);
    expect(crumb.data.placementCount).toBe(1);
    expect(crumb.data.pronunciationCount).toBe(1);
  });

  it("does NOT emit a breadcrumb when the engine is fast", () => {
    mockPerfNowSeq([100, 102]); // 2 ms, well under threshold

    selectSuggestedPracticeInstrumented(NON_EMPTY_STATE);

    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("passes through empty results and stays quiet when fast", () => {
    mockPerfNowSeq([0, 1]);

    const items = selectSuggestedPracticeInstrumented(EMPTY_STATE);

    expect(items).toEqual([]);
    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("breadcrumb payload carries counts only — no source tags or rationale", () => {
    mockPerfNowSeq([0, ENGINE_SLOW_THRESHOLD_MS + 5]);

    selectSuggestedPracticeInstrumented(NON_EMPTY_STATE);

    const crumb = addBreadcrumbMock.mock.calls[0]![0]!;
    const dataKeys = Object.keys(crumb.data).sort();
    expect(dataKeys).toEqual([
      "durationMs",
      "itemCount",
      "l1Count",
      "placementCount",
      "pronunciationCount",
    ]);

    const serialized = JSON.stringify(crumb);
    expect(serialized).not.toContain("vi_l1_3rd_person_s");
    expect(serialized).not.toContain("vi_l1_past_ed");
    expect(serialized).not.toContain("vi_l1_plural_s");
    expect(serialized).not.toContain("TH_T");
  });
});

describe("Stage 3B perf — reportUiMountPerf", () => {
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

  it("stays quiet at or under the UI threshold", () => {
    reportUiMountPerf(UI_MOUNT_SLOW_THRESHOLD_MS);
    reportUiMountPerf(10);
    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });

  it("ignores NaN and negative durations without throwing", () => {
    expect(() => reportUiMountPerf(Number.NaN)).not.toThrow();
    expect(() => reportUiMountPerf(-1)).not.toThrow();
    // NaN must not emit; negative is finite and ≤ threshold so also silent.
    expect(addBreadcrumbMock).not.toHaveBeenCalled();
  });
});
