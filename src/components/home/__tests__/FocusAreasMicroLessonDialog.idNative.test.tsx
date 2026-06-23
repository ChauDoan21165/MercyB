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

describe("FocusAreasMicroLessonDialog — id content renders when authored", () => {
  it("renders Indonesian hook text in id mode (id slot is authored)", () => {
    // vi_l1_3rd_person_s has full id content in rich-lessons-pilot.json
    const entry = WEAKNESS_CATALOG.vi_l1_3rd_person_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // The "why" section heading proves rich lesson body mounted
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // In "both" mode (default), the Indonesian text is shown as primary
    expect(section!.textContent).toContain("kata kerja tidak pernah berubah");
    // English is also shown in "both" mode
    expect(section!.textContent).toContain("the verb never changes");
    // VI should NOT be present in id mode
    expect(section!.textContent).not.toContain("động từ không bao giờ đổi");
  });

  it("renders Indonesian takeaway text in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_3rd_person_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // The takeaway section should contain Indonesian text
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("kata kerja dapat");
  });

  it("renders Indonesian hook text in both mode as primary", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_3rd_person_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Hook section in "both" mode shows Indonesian as primary
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Pernah dengar?");
  });

  it("fallback still works when id slot is missing", () => {
    // vi_l1_plural_s has no matching rich lesson in pilot JSON
    // so the dialog falls back to showing catalog description
    const entry = WEAKNESS_CATALOG.vi_l1_plural_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Dialog still renders — the "why" section heading is present
    expect(screen.getByText("Vì sao khó")).toBeDefined();
  });
});

describe("FocusAreasMicroLessonDialog — C1 id content renders when authored", () => {
  it("renders Indonesian modal-perfect hook text in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_modal_perfect!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Indonesian primary text
    expect(section!.textContent).toContain("Bahasa Indonesia tidak punya struktur khusus");
    // English secondary text
    expect(section!.textContent).toContain("Vietnamese doesn't have a dedicated structure");
  });

  it("renders Indonesian subjunctive-were takeaway text in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_subjunctive_were!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Situasi tidak nyata");
  });

  it("renders Indonesian negative-inversion hook text in both mode as primary", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_negative_inversion!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Semua katanya bahasa Inggris");
  });

  it("renders Indonesian modal-perfect quiz content in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_modal_perfect!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Quiz section renders — check via dialog textContent
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    // Quiz questions are rendered with English text
    expect(dialog.textContent).toContain("I should ___ to her yesterday");
  });

  it("renders Indonesian negative-inversion pattern section in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_negative_inversion!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const patternHeading = screen.getByText("Quy tắc");
    const section = patternHeading.closest('[data-rich-section="pattern"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Kata keterangan negatif");
  });

  it("catalog-backed id entries render without crashing in id mode", () => {
    // vi_l1_embedded_question_order has id in catalog but no rich lesson.
    // The dialog fallback renders en/vi catalog description; id content
    // is available for other surfaces (HomePage focus cards, etc.).
    const entry = WEAKNESS_CATALOG.vi_l1_embedded_question_order!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Dialog renders successfully with catalog-backed content
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    // EN catalog description renders in fallback path
    expect(dialog.textContent).toContain("A question inside another sentence");
  });
});
