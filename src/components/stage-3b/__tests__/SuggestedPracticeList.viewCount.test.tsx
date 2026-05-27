import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import SuggestedPracticeList from "../SuggestedPracticeList";
import {
  VIEW_COUNT_KEY,
  readSuggestedPracticeViewCount,
} from "@/stage-3b/viewCount";
import type { LocalWeaknessMap as LocalWeaknessMapData } from "@/lib/stage-3a/aggregator";

function fullData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 4, lastSeen: 1_000 },
    ],
    placementWeaknesses: [
      { tag: "th_stopping_and_fronting", severity: "medium" },
    ],
    topPronunciationPainPoints: [
      { axis: "TH_T", errorRate: 0.6, samples: 5 },
    ],
    isEmpty: false,
    generatedAt: 0,
  };
}

function emptyData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: true,
    generatedAt: 0,
  };
}

function renderList(initialState: LocalWeaknessMapData) {
  return render(
    <MemoryRouter initialEntries={["/weak-at"]}>
      <Routes>
        <Route
          path="*"
          element={<SuggestedPracticeList initialState={initialState} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("SuggestedPracticeList — local view counter (mb.stage3b.viewCount)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("empty render leaves the counter at 0 (key never written)", () => {
    expect(readSuggestedPracticeViewCount()).toBe(0);

    renderList(emptyData());

    expect(localStorage.getItem(VIEW_COUNT_KEY)).toBe(null);
    expect(readSuggestedPracticeViewCount()).toBe(0);
  });

  it("first non-empty render bumps the counter 0 → 1", () => {
    expect(readSuggestedPracticeViewCount()).toBe(0);

    renderList(fullData());

    expect(readSuggestedPracticeViewCount()).toBe(1);
    expect(localStorage.getItem(VIEW_COUNT_KEY)).toBe("1");
  });

  it("a second non-empty render bumps 1 → 2", () => {
    const first = renderList(fullData());
    expect(readSuggestedPracticeViewCount()).toBe(1);
    first.unmount();

    renderList(fullData());

    expect(readSuggestedPracticeViewCount()).toBe(2);
    expect(localStorage.getItem(VIEW_COUNT_KEY)).toBe("2");
  });

  it("does not bump again on a re-render of the same instance with the same items", () => {
    const { rerender } = renderList(fullData());
    expect(readSuggestedPracticeViewCount()).toBe(1);

    rerender(
      <MemoryRouter initialEntries={["/weak-at"]}>
        <Routes>
          <Route
            path="*"
            element={<SuggestedPracticeList initialState={fullData()} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    // Same `hasItems` (true), so the gated effect does not re-fire.
    expect(readSuggestedPracticeViewCount()).toBe(1);
  });

  it("an empty render in between does NOT increment, then next non-empty bumps to 2", () => {
    renderList(fullData());
    expect(readSuggestedPracticeViewCount()).toBe(1);
    cleanup();

    renderList(emptyData());
    expect(readSuggestedPracticeViewCount()).toBe(1);
    cleanup();

    renderList(fullData());
    expect(readSuggestedPracticeViewCount()).toBe(2);
  });
});
