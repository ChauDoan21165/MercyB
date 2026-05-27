import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";

import LocalWeaknessMap from "../LocalWeaknessMap";
import type { LocalWeaknessMap as LocalWeaknessMapData } from "@/lib/stage-3a/aggregator";

beforeEach(() => {
  cleanup();
});

// ──────────────────────────────────────────────────────────────────────────
// Fixtures — pre-built `LocalWeaknessMapData` shapes injected via the
// component's `initialData` test seam (avoids touching localStorage).
// ──────────────────────────────────────────────────────────────────────────

function fullData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 7, lastSeen: Date.now() - 3_600_000 },
      { tag: "vi_l1_past_ed", count: 4, lastSeen: Date.now() - 86_400_000 },
    ],
    placementWeaknesses: [
      { tag: "vi_l1_missing_be", severity: "high" },
      { tag: "vi_l1_missing_article", severity: "medium" },
    ],
    topPronunciationPainPoints: [
      { axis: "TH_T", errorRate: 0.55, samples: 12 },
      { axis: "R_L", errorRate: 0.32, samples: 9 },
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

function l1OnlyData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 3, lastSeen: Date.now() - 600_000 },
    ],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: false,
    generatedAt: Date.now(),
  };
}

function pronunciationOnlyData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [
      { axis: "TH_T", errorRate: 0.6, samples: 10 },
    ],
    isEmpty: false,
    generatedAt: Date.now(),
  };
}

// ──────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────

describe("LocalWeaknessMap", () => {
  it("renders all three sections when aggregator returns full data", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    expect(screen.getByTestId("local-weakness-map")).toBeTruthy();
    expect(screen.getByTestId("local-weakness-l1")).toBeTruthy();
    expect(screen.getByTestId("local-weakness-placement")).toBeTruthy();
    expect(screen.getByTestId("local-weakness-pronunciation")).toBeTruthy();

    // Section headings are present (Vietnamese-first).
    expect(screen.getByText("Lỗi ngữ pháp hay gặp")).toBeTruthy();
    expect(screen.getByText("Kết quả kiểm tra trình độ")).toBeTruthy();
    expect(screen.getByText("Phát âm cần luyện")).toBeTruthy();
  });

  it("renders the global empty state when isEmpty === true", () => {
    render(<LocalWeaknessMap initialData={emptyData()} />);
    const empty = screen.getByTestId("local-weakness-empty");
    expect(empty).toBeTruthy();
    expect(empty.textContent).toContain(
      "Chưa có dữ liệu — hãy hoàn thành vài bài",
    );
    // The three populated-state sections are NOT rendered.
    expect(screen.queryByTestId("local-weakness-l1")).toBeNull();
    expect(screen.queryByTestId("local-weakness-placement")).toBeNull();
    expect(screen.queryByTestId("local-weakness-pronunciation")).toBeNull();
  });

  it("renders only populated sections when one bucket is empty (l1-only)", () => {
    render(<LocalWeaknessMap initialData={l1OnlyData()} />);
    expect(screen.getByTestId("local-weakness-l1")).toBeTruthy();
    expect(screen.queryByTestId("local-weakness-placement")).toBeNull();
    expect(screen.queryByTestId("local-weakness-pronunciation")).toBeNull();
  });

  it("renders only populated sections when one bucket is empty (pronunciation-only)", () => {
    render(<LocalWeaknessMap initialData={pronunciationOnlyData()} />);
    expect(screen.getByTestId("local-weakness-pronunciation")).toBeTruthy();
    expect(screen.queryByTestId("local-weakness-l1")).toBeNull();
    expect(screen.queryByTestId("local-weakness-placement")).toBeNull();
  });

  it("uses Vietnamese as primary text (above the English secondary)", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    const l1Section = screen.getByTestId("local-weakness-l1");
    // The 3rd-person-s row's primary text is the Vietnamese label.
    expect(
      within(l1Section).getByText("Hay quên thêm -s sau he, she, it."),
    ).toBeTruthy();
    // And the English secondary appears too.
    expect(
      within(l1Section).getByText("You often skip -s after he, she, it."),
    ).toBeTruthy();
  });

  it("contains no streak / XP / badge / score / level / fail / wrong / bad words anywhere", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    const root = screen.getByTestId("local-weakness-map");
    const text = root.textContent ?? "";
    // Gamification + shame vocab. Case-insensitive whole-word check.
    // Vietnamese: streak ~ chuỗi (skip — too generic), XP, level, badge,
    // điểm số, thất bại, sai, kém, dở.
    const banned = [
      /\bstreak\b/i,
      /\bxp\b/i,
      /\bbadge\b/i,
      /\blevel\b/i,
      /\bscore\b/i,
      /\bfail\b/i,
      /\bwrong\b/i,
      /\bbad\b/i,
      /\bweak(ness)?\b/i,
      /thất bại/i,
      /điểm số/i,
    ];
    for (const re of banned) {
      expect(re.test(text), `banned token matched: ${re} in "${text}"`).toBe(
        false,
      );
    }
  });

  it("tap-to-expand reveals exampleVi/exampleEn on an L1 row", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    const exampleTestId = "l1-example-vi_l1_3rd_person_s";

    // Collapsed by default.
    expect(screen.queryByTestId(exampleTestId)).toBeNull();

    // The first L1 row's button is the expander.
    const l1Section = screen.getByTestId("local-weakness-l1");
    const buttons = within(l1Section).getAllByRole("button");
    fireEvent.click(buttons[0]);

    // After tap, the example panel appears with both VI + EN content.
    const example = screen.getByTestId(exampleTestId);
    expect(example).toBeTruthy();
    expect(example.textContent).toContain("She go to school");
    expect(example.textContent).toContain("She goes to school");

    // Second tap collapses again.
    fireEvent.click(buttons[0]);
    expect(screen.queryByTestId(exampleTestId)).toBeNull();
  });

  it("placement row carries a severity dot with the right data-severity attr", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    const dots = screen.getAllByTestId("placement-severity-dot");
    expect(dots.length).toBe(2);
    expect(dots[0].getAttribute("data-severity")).toBe("high");
    expect(dots[1].getAttribute("data-severity")).toBe("medium");
  });

  it("pronunciation row rounds error rate to nearest 10 and shows sample count", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    const metas = screen.getAllByTestId("pronunciation-meta");
    // 0.55 → 60% (round-half-up via Math.round of 5.5), 12 samples
    expect(metas[0].textContent).toContain("~60%");
    expect(metas[0].textContent).toContain("12");
    // 0.32 → 30%, 9 samples
    expect(metas[1].textContent).toContain("~30%");
    expect(metas[1].textContent).toContain("9");
  });
});
