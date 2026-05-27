import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";

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

// Render helper — wraps the list in a `MemoryRouter` because the
// component calls `useNavigate()` at the hook level. A sentinel
// renders ALONGSIDE the list (not on a separate route) so the
// asserted location reflects every navigation, including same-route
// query-string changes like `/weak-at?focus=…`.

function LocationSentinel() {
  const loc = useLocation();
  return (
    <div data-testid="sentinel-location">
      {loc.pathname}
      {loc.search}
    </div>
  );
}

function renderList(initialState: LocalWeaknessMapData) {
  return render(
    <MemoryRouter initialEntries={["/weak-at"]}>
      <LocationSentinel />
      <Routes>
        <Route
          path="*"
          element={<SuggestedPracticeList initialState={initialState} />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────

describe("SuggestedPracticeList", () => {
  it("renders three items when all three Stage 3A sources have a signal", () => {
    renderList(fullData());

    expect(screen.getByTestId("suggested-practice-list")).toBeTruthy();
    expect(screen.getByTestId("suggested-practice-item-l1")).toBeTruthy();
    expect(screen.getByTestId("suggested-practice-item-placement")).toBeTruthy();
    expect(
      screen.getByTestId("suggested-practice-item-pronunciation"),
    ).toBeTruthy();
  });

  it("renders one button per item, each a real <button type='button'>", () => {
    renderList(fullData());

    for (const kind of ["l1", "placement", "pronunciation"] as const) {
      const el = screen.getByTestId(`suggested-practice-item-${kind}`);
      expect(el.tagName).toBe("BUTTON");
      expect(el.getAttribute("type")).toBe("button");
    }
  });

  it("renders a calm empty state when no source has a signal", () => {
    renderList(emptyData());

    const empty = screen.getByTestId("suggested-practice-empty");
    expect(empty).toBeTruthy();
    // List itself must not render alongside the empty state.
    expect(screen.queryByTestId("suggested-practice-list")).toBeNull();
    // Empty copy is VI-primary, never frames the state as a failure.
    expect(empty.textContent ?? "").toMatch(/Chưa có gợi ý/);
  });

  it("rendered output contains no EN shame / gamification language", () => {
    const { container } = renderList(fullData());
    const text = container.textContent ?? "";

    // Required guard from the Stage 3A/3B invariants.
    expect(text).not.toMatch(/streak|xp|level|badge|score|fail|wrong|bad/i);
  });

  it("rendered output contains no VI shame language", () => {
    const { container } = renderList(fullData());
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/điểm số|hạng|sai|kém|tệ/i);
  });

  it("empty state also contains no shame language (EN or VI)", () => {
    const { container } = renderList(emptyData());
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/streak|xp|level|badge|score|fail|wrong|bad/i);
    expect(text).not.toMatch(/điểm số|hạng|sai|kém|tệ/i);
  });

  // ───── Click → navigate ─────

  it("clicking the L1 row navigates to /ai-tutor with the source tag in focus", () => {
    renderList(fullData());

    fireEvent.click(screen.getByTestId("suggested-practice-item-l1"));

    expect(screen.getByTestId("sentinel-location").textContent).toBe(
      "/ai-tutor?focus=vi_l1_3rd_person_s",
    );
  });

  it("clicking the placement row navigates to /placement/results", () => {
    renderList(fullData());

    fireEvent.click(screen.getByTestId("suggested-practice-item-placement"));

    expect(screen.getByTestId("sentinel-location").textContent).toBe(
      "/placement/results",
    );
  });

  it("clicking the pronunciation row (TH_T) navigates to /practice/phoneme/th", () => {
    renderList(fullData());

    fireEvent.click(screen.getByTestId("suggested-practice-item-pronunciation"));

    expect(screen.getByTestId("sentinel-location").textContent).toBe(
      "/practice/phoneme/th",
    );
  });

  it("data-route attribute matches the click destination for each kind", () => {
    renderList(fullData());

    expect(
      screen
        .getByTestId("suggested-practice-item-l1")
        .getAttribute("data-route"),
    ).toBe("/ai-tutor?focus=vi_l1_3rd_person_s");
    expect(
      screen
        .getByTestId("suggested-practice-item-placement")
        .getAttribute("data-route"),
    ).toBe("/placement/results");
    expect(
      screen
        .getByTestId("suggested-practice-item-pronunciation")
        .getAttribute("data-route"),
    ).toBe("/practice/phoneme/th");
  });

  it("pronunciation INTONATION (no drill pack) falls back to /weak-at?focus=…", () => {
    renderList({
      topL1Patterns: [],
      placementWeaknesses: [],
      topPronunciationPainPoints: [
        { axis: "INTONATION", errorRate: 0.5, samples: 4 },
      ],
      isEmpty: false,
      generatedAt: Date.now(),
    });

    fireEvent.click(screen.getByTestId("suggested-practice-item-pronunciation"));

    expect(screen.getByTestId("sentinel-location").textContent).toBe(
      "/weak-at?focus=pronunciation:INTONATION",
    );
  });
});
