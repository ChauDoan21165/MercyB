import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import SuggestedPracticeList from "../SuggestedPracticeList";
import type { LocalWeaknessMap as LocalWeaknessMapData } from "@/lib/stage-3a/aggregator";

beforeEach(() => {
  cleanup();
});

// ──────────────────────────────────────────────────────────────────────────
// Fixtures — pre-built `LocalWeaknessMapData` shapes injected via the
// component's `initialState` test seam (avoids touching localStorage).
// ──────────────────────────────────────────────────────────────────────────

function fullData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 4, lastSeen: Date.now() - 600_000 },
    ],
    placementWeaknesses: [
      { tag: "th_stopping_and_fronting", severity: "medium" },
    ],
    topPronunciationPainPoints: [
      { axis: "TH_T", errorRate: 0.6, samples: 5 },
    ],
    isEmpty: false,
    generatedAt: Date.now(),
  };
}

function emptyData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: true,
    generatedAt: Date.now(),
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────

describe("SuggestedPracticeList", () => {
  it("renders three items when all three Stage 3A sources have a signal", () => {
    render(<SuggestedPracticeList initialState={fullData()} />);

    expect(screen.getByTestId("suggested-practice-list")).toBeTruthy();
    expect(screen.getByTestId("suggested-practice-item-l1")).toBeTruthy();
    expect(screen.getByTestId("suggested-practice-item-placement")).toBeTruthy();
    expect(
      screen.getByTestId("suggested-practice-item-pronunciation"),
    ).toBeTruthy();
  });

  it("renders one button per item, each a real <button type='button'>", () => {
    render(<SuggestedPracticeList initialState={fullData()} />);

    for (const kind of ["l1", "placement", "pronunciation"] as const) {
      const el = screen.getByTestId(`suggested-practice-item-${kind}`);
      expect(el.tagName).toBe("BUTTON");
      expect(el.getAttribute("type")).toBe("button");
    }
  });

  it("renders a calm empty state when no source has a signal", () => {
    render(<SuggestedPracticeList initialState={emptyData()} />);

    const empty = screen.getByTestId("suggested-practice-empty");
    expect(empty).toBeTruthy();
    // List itself must not render alongside the empty state.
    expect(screen.queryByTestId("suggested-practice-list")).toBeNull();
    // Empty copy is VI-primary, never frames the state as a failure.
    expect(empty.textContent ?? "").toMatch(/Chưa có gợi ý/);
  });

  it("rendered output contains no EN shame / gamification language", () => {
    const { container } = render(
      <SuggestedPracticeList initialState={fullData()} />,
    );
    const text = container.textContent ?? "";

    // Required guard from the Stage 3A/3B invariants.
    expect(text).not.toMatch(/streak|xp|level|badge|score|fail|wrong|bad/i);
  });

  it("rendered output contains no VI shame language", () => {
    const { container } = render(
      <SuggestedPracticeList initialState={fullData()} />,
    );
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/điểm số|hạng|sai|kém|tệ/i);
  });

  it("empty state also contains no shame language (EN or VI)", () => {
    const { container } = render(
      <SuggestedPracticeList initialState={emptyData()} />,
    );
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/streak|xp|level|badge|score|fail|wrong|bad/i);
    expect(text).not.toMatch(/điểm số|hạng|sai|kém|tệ/i);
  });
});
