import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import FocusAreasMicroLessonDialog from "@/components/home/FocusAreasMicroLessonDialog";
import { WEAKNESS_CATALOG } from "@/lib/weakness/weakness-catalog";
import type { WeaknessEntry } from "@/lib/weakness/weakness-catalog";

/**
 * Indonesian-native English schema/foundation (2026-06-23):
 * Tests that the FocusAreasMicroLessonDialog renders id content
 * when nativeLanguage="id" is passed, with id → en → vi fallback.
 *
 * Note: Radix Dialog renders content into a portal (document.body),
 * so use screen (not container) for DOM queries.
 */

const base: WeaknessEntry = Object.values(WEAKNESS_CATALOG)[0];

const renderDialog = (
  entry: WeaknessEntry,
  nativeLanguage: "vi" | "en" | "ja" | "id" = "vi",
) =>
  render(
    <MemoryRouter>
      <FocusAreasMicroLessonDialog
        entry={entry}
        onOpenChange={() => {}}
        userId={null}
        nativeLanguage={nativeLanguage}
      />
    </MemoryRouter>,
  );

describe("FocusAreasMicroLessonDialog — nativeLanguage='id'", () => {
  it("renders without crashing and shows dialog content", () => {
    renderDialog({ ...base, linkedRoomId: "english_a1_demo" }, "id");
    // Dialog renders CTA button
    expect(screen.getByText("Bắt đầu bài học")).toBeDefined();
  });

  it("falls back to en when id slot is not authored", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_plural_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // The "why" section heading rendered — proves rich lesson body mounted
    expect(screen.getByText("Vì sao khó")).toBeDefined();
    // EN text is rendered as id fallback — check via section textContent
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("nouns usually stay the same");
  });

  it("shows the language toggle with ID option in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_plural_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Multiple section blocks — each toggle says ID+EN in id mode
    const toggles = screen.getAllByText("ID+EN");
    expect(toggles.length).toBeGreaterThan(0);
  });

  it("renders sections with id-native fallback when id slot is missing", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_plural_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // The "why" section heading exists — proves rich lesson body mounted
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // In id mode with no id content:
    // - EN text is shown as primary (id → en fallback)
    // - EN text is also shown as explicit reference
    // - VI text is NOT shown (Indonesian learners don't need Vietnamese)
    expect(section!.textContent).toContain("nouns usually stay the same");
    // VI should NOT be present in id mode
    expect(section!.textContent).not.toContain("danh từ ít khi đổi");
  });
});

describe("FocusAreasMicroLessonDialog — id → en → vi fallback", () => {
  it("when id slot is missing and en is present, renders en as primary", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_plural_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // EN concept text rendered in the "why" section
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("nouns usually stay the same");
  });
});

describe("FocusAreasMicroLessonDialog — vi/en/ja unchanged with id prop", () => {
  it("vi mode still works and shows VI concept text", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_plural_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "vi");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("danh từ ít khi đổi");
  });
});
