// @vitest-environment jsdom
//
// LocalWeaknessMap — bilingual `lang` attributes on taxonomy strings (W2).
//
// Pins the !64 audit's W2 fix: the component renders Vietnamese
// taxonomy strings (`shortVi`, plus VI metadata + empty-state copy)
// alongside English siblings (`shortEn`) without `lang` attributes,
// so a VI screen-reader voice phoneticises EN using Vietnamese
// phonemes (and the EN-voice mirrors the inverse). WCAG 3.1.2.
//
// Contract under test (post-fix):
//   - Every VI taxonomy paragraph carries `lang="vi"`.
//   - Every EN taxonomy paragraph carries `lang="en"`.
//   - Section headings (h3 + EN subtitle), L1 row, placement row,
//     pronunciation row + meta, empty state — all covered.

import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import LocalWeaknessMap from "../LocalWeaknessMap";
import type { LocalWeaknessMap as LocalWeaknessMapData } from "@/lib/stage-3a/aggregator";

beforeEach(() => {
  cleanup();
});

function fullData(): LocalWeaknessMapData {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 7, lastSeen: Date.now() - 3_600_000 },
    ],
    placementWeaknesses: [{ tag: "vi_l1_missing_be", severity: "high" }],
    topPronunciationPainPoints: [
      { axis: "TH_T", errorRate: 0.55, samples: 12 },
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

describe("LocalWeaknessMap — bilingual lang attrs (W2)", () => {
  it("L1 section heading: VI h3 lang='vi', EN subtitle lang='en'", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    const viH3 = screen.getByRole("heading", { name: "Lỗi ngữ pháp hay gặp", level: 3 });
    expect(viH3.getAttribute("lang")).toBe("vi");
    const enSubtitle = screen.getByText("Common grammar patterns");
    expect(enSubtitle.getAttribute("lang")).toBe("en");
  });

  it("L1 row: VI shortVi lang='vi' + EN shortEn lang='en'", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    // shortVi for vi_l1_3rd_person_s: "Hay quên thêm -s sau he, she, it."
    const vi = screen.getByText(/Hay quên thêm -s sau he, she, it/);
    expect(vi.getAttribute("lang")).toBe("vi");
    // shortEn: "You often skip -s after he, she, it."
    const en = screen.getByText(/You often skip -s after he, she, it/);
    expect(en.getAttribute("lang")).toBe("en");
  });

  it("Pronunciation row: VI shortVi + EN shortEn + VI meta all tagged", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    // TH_T shortVi: "Âm th tiếng Anh hay bị nhầm thành t."
    const vi = screen.getByText(/Âm th tiếng Anh hay bị nhầm thành t/);
    expect(vi.getAttribute("lang")).toBe("vi");
    // TH_T shortEn: "The English th often comes out as t."
    const en = screen.getByText(/The English th often comes out as t/);
    expect(en.getAttribute("lang")).toBe("en");
    // Meta line carries VI text ("chưa chính xác · lần luyện").
    const meta = screen.getByTestId("pronunciation-meta");
    expect(meta.getAttribute("lang")).toBe("vi");
  });

  it("Placement row: VI shortVi lang='vi' + EN shortEn lang='en'", () => {
    render(<LocalWeaknessMap initialData={fullData()} />);
    // vi_l1_missing_be shortVi: "Hay quên động từ to be (am / is / are)."
    const vi = screen.getByText(/Hay quên động từ to be/);
    expect(vi.getAttribute("lang")).toBe("vi");
    const en = screen.getByText(/You sometimes drop am, is, are/);
    expect(en.getAttribute("lang")).toBe("en");
  });

  it("Global empty state: VI lang='vi' + EN lang='en'", () => {
    render(<LocalWeaknessMap initialData={emptyData()} />);
    const vi = screen.getByText(/Chưa có dữ liệu/);
    expect(vi.getAttribute("lang")).toBe("vi");
    const en = screen.getByText("Complete a few lessons to see your weakness map.");
    expect(en.getAttribute("lang")).toBe("en");
  });

  it("every taxonomy <p> with VI text carries lang='vi' (sweep)", () => {
    const { container } = render(<LocalWeaknessMap initialData={fullData()} />);
    // Heuristic: VI shortVi / shortEn strings show distinct Vietnamese
    // diacritics. Walk every <p> with the taxonomy classes and assert
    // it has a `lang` attribute (either vi or en). Catches any future
    // taxonomy site that forgets the lang attr.
    const paragraphs = Array.from(
      container.querySelectorAll<HTMLParagraphElement>("p"),
    );
    // The component renders many <p> elements — but only the ones
    // emitted by the taxonomy lookups (shortVi/shortEn/exampleVi/
    // exampleEn) need this guarantee. The fixture above seeds an L1
    // tag (vi_l1_3rd_person_s) whose example strings start with
    // "She go to school" / "She goes to school every day"; assert
    // these carry lang attrs if rendered.
    expect(paragraphs.length).toBeGreaterThan(0);
    for (const p of paragraphs) {
      const t = (p.textContent ?? "").trim();
      if (t.length === 0) continue;
      // The fixture's rendered taxonomy paragraphs always carry a
      // `lang` attr after the W2 fix. Other <p> tags (e.g.
      // QuietMeta) also carry `lang="vi"` because their content is
      // Vietnamese. So: every non-empty <p> in this fixture must
      // declare a language.
      expect(
        p.getAttribute("lang"),
        `<p>"${t.slice(0, 40)}…" has no lang attr — taxonomy regression?`,
      ).toMatch(/^(vi|en)$/);
    }
  });
});
