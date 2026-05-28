// @vitest-environment jsdom
//
// SuggestedPracticeList — bilingual `lang` attributes (W2 cont'd).
//
// Pins the !64 audit's W2 fix for the Stage-3B side of /weak-at: the
// list heading ("Gợi ý luyện tập" / "Suggested practice"), each
// item's viLabel/enLabel, the VI rationale, and the empty-state copy
// all carry per-language `lang` attributes after the fix.

import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import SuggestedPracticeList from "../SuggestedPracticeList";
import type { LocalWeaknessMap as LocalWeaknessMapData } from "@/lib/stage-3a/aggregator";

beforeEach(() => {
  cleanup();
});

function fullData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 4, lastSeen: Date.now() - 600_000 },
    ],
    placementWeaknesses: [{ tag: "th_stopping_and_fronting", severity: "medium" }],
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

function renderList(initialState: LocalWeaknessMapData) {
  return render(
    <MemoryRouter initialEntries={["/weak-at"]}>
      <SuggestedPracticeList initialState={initialState} />
    </MemoryRouter>,
  );
}

describe("SuggestedPracticeList — bilingual lang attrs (W2)", () => {
  it("list heading: VI h3 lang='vi' + EN subtitle lang='en'", () => {
    renderList(fullData());
    const h3 = screen.getByRole("heading", { name: "Gợi ý luyện tập", level: 3 });
    expect(h3.getAttribute("lang")).toBe("vi");
    const en = screen.getByText("Suggested practice");
    expect(en.getAttribute("lang")).toBe("en");
  });

  it("L1 item: VI viLabel lang='vi' + EN enLabel lang='en' + VI rationale lang='vi'", () => {
    renderList(fullData());
    // vi_l1_3rd_person_s viLabel: "Hay quên thêm -s sau he, she, it."
    const vi = screen.getByText(/Hay quên thêm -s sau he, she, it/);
    expect(vi.getAttribute("lang")).toBe("vi");
    // enLabel: "You often skip -s after he, she, it."
    const en = screen.getByText(/You often skip -s after he, she, it/);
    expect(en.getAttribute("lang")).toBe("en");
    // Rationale carries VI text — engine produces "Bạn đã gặp mẫu này 4
    // lần gần đây." for an L1 item with count=4.
    const rationale = screen.getByText(/Bạn đã gặp mẫu này 4 lần gần đây/);
    expect(rationale.getAttribute("lang")).toBe("vi");
  });

  it("pronunciation item: viLabel + enLabel + VI rationale all tagged", () => {
    renderList(fullData());
    const vi = screen.getByText(/Âm th tiếng Anh hay bị nhầm thành t/);
    expect(vi.getAttribute("lang")).toBe("vi");
    const en = screen.getByText(/The English th often comes out as t/);
    expect(en.getAttribute("lang")).toBe("en");
    // Rationale: "Khoảng 60% chưa chính xác trong 5 lần luyện gần đây." (VI)
    const rationale = screen.getByText(/Khoảng \d+% chưa chính xác/);
    expect(rationale.getAttribute("lang")).toBe("vi");
  });

  it("empty state: VI lang='vi' + EN lang='en'", () => {
    renderList(emptyData());
    const vi = screen.getByText(/Chưa có gợi ý/);
    expect(vi.getAttribute("lang")).toBe("vi");
    const en = screen.getByText("Suggestions appear after a few lessons.");
    expect(en.getAttribute("lang")).toBe("en");
  });

  it("every <p> with text inside the list section declares a lang attribute (sweep)", () => {
    renderList(fullData());
    const section = screen.getByTestId("suggested-practice-list");
    const paragraphs = Array.from(
      section.querySelectorAll<HTMLParagraphElement>("p"),
    );
    expect(paragraphs.length).toBeGreaterThan(0);
    for (const p of paragraphs) {
      const t = (p.textContent ?? "").trim();
      if (t.length === 0) continue;
      expect(
        p.getAttribute("lang"),
        `<p>"${t.slice(0, 40)}…" has no lang attr — taxonomy regression?`,
      ).toMatch(/^(vi|en)$/);
    }
  });
});
