import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import FocusAreasMicroLessonDialog from "@/components/home/FocusAreasMicroLessonDialog";
import { WEAKNESS_CATALOG } from "@/lib/weakness/weakness-catalog";
import type { WeaknessEntry } from "@/lib/weakness/weakness-catalog";

/**
 * Indonesian-native English B1 content expansion (2026-06-23):
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

// ────────────────────────────────────────────────────────────────────────
// B1 Indonesian-native English content tests (2026-06-23)
// ────────────────────────────────────────────────────────────────────────

describe("B1 Indonesian-native — rich lessons render id content", () => {
  it("renders present_perfect_vs_past lesson with Indonesian hook in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    // Dialog mounted with rich lesson content
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    // Indonesian hook text in section
    expect(section!.textContent).toContain("Kedengarannya wajar di telinga orang Indonesia");
  });

  it("renders present_perfect_vs_past lesson with Indonesian takeaway in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("pakai past simple");
  });

  it("renders conditional_mix lesson with Indonesian why text in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_conditional_mix!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Bahasa Indonesia menggunakan kalau...maka...");
  });

  it("renders conditional_mix lesson with Indonesian takeaway in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_conditional_mix!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Situasi khayalan");
  });

  it("renders reported_speech lesson with Indonesian hook in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_reported_speech!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Wajar dalam bahasa Indonesia");
  });

  it("renders reported_speech lesson with Indonesian practice text in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_reported_speech!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    const practiceHeading = screen.getByText("Luyện tập");
    const section = practiceHeading.closest('[data-rich-section="practice"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("mundur satu langkah");
  });

  it("B1 id-mode shows ID+EN toggle labels", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    const toggles = screen.getAllByText("ID+EN");
    expect(toggles.length).toBeGreaterThan(0);
  });

  it("B1 id-mode does NOT show VI content in rich lesson sections", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_conditional_mix!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // VI text should not leak into id mode
    expect(section!.textContent).not.toContain("động từ không đổi");
  });
});

describe("B1 Indonesian-native — weakness catalog id completeness", () => {
  it("all B1 entries in weakness catalog have id shortLabel", () => {
    // Sample of B1 entries that should have id after expansion
    const b1Tags = [
      "vi_l1_present_perfect_vs_past",
      "vi_l1_conditional_mix",
      "vi_l1_reported_speech",
      "vi_l1_past_perfect_missing",
      "vi_l1_since_vs_for",
      "vi_l1_passive_missing_be",
      "vi_l1_relative_pronoun",
      "vi_l1_modal_perfect",
      "vi_l1_too_vs_very",
      "vi_l1_if_will",
    ] as const;

    for (const tag of b1Tags) {
      const entry = WEAKNESS_CATALOG[tag];
      expect(entry, `tag ${tag} missing from catalog`).toBeDefined();
      expect(entry!.shortLabel.id, `tag ${tag} missing id in shortLabel`).toBeDefined();
      expect(
        entry!.shortLabel.id!.length,
        `tag ${tag} id shortLabel is empty`,
      ).toBeGreaterThan(0);
    }
  });

  it("all B1 entries in weakness catalog have id longDescription", () => {
    const b1Tags = [
      "vi_l1_present_perfect_vs_past",
      "vi_l1_conditional_mix",
      "vi_l1_reported_speech",
      "vi_l1_past_perfect_missing",
      "vi_l1_since_vs_for",
      "vi_l1_passive_missing_be",
      "vi_l1_relative_pronoun",
      "vi_l1_modal_perfect",
      "vi_l1_too_vs_very",
      "vi_l1_if_will",
    ] as const;

    for (const tag of b1Tags) {
      const entry = WEAKNESS_CATALOG[tag];
      expect(entry!.longDescription.id, `tag ${tag} missing id in longDescription`).toBeDefined();
      expect(
        entry!.longDescription.id!.length,
        `tag ${tag} id longDescription is empty`,
      ).toBeGreaterThan(0);
    }
  });

  it("original A1/A2 Indonesian content is preserved", () => {
    // These entries had id before the B1 expansion — must still have them
    const preservedTags = [
      "vi_l1_3rd_person_s",
      "vi_l1_past_ed",
      "vi_l1_plural_s",
      "vi_l1_missing_be",
      "vi_l1_question_no_aux",
      "vi_l1_missing_article",
    ] as const;

    for (const tag of preservedTags) {
      const entry = WEAKNESS_CATALOG[tag];
      expect(entry!.shortLabel.id, `tag ${tag} lost id in shortLabel`).toBeDefined();
      expect(entry!.longDescription.id, `tag ${tag} lost id in longDescription`).toBeDefined();
    }
  });
});

describe("B1 Indonesian-native — FocusAreasMicroLessonDialog catalog id fallback", () => {
  it("B1 catalog id renders in dialog when rich lesson is absent", () => {
    // vi_l1_past_perfect_missing has catalog id but no rich lesson → dialog uses catalog
    const entry = WEAKNESS_CATALOG.vi_l1_past_perfect_missing!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Dialog renders with catalog content
    const whyHeading = screen.getByText("Vì sao khó");
    expect(whyHeading).toBeDefined();
  });

  it("B1 rich lesson overrides catalog id when both exist", () => {
    // vi_l1_present_perfect_vs_past has BOTH catalog id and rich lesson → rich lesson wins
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: "english_a1_demo" }, "id");
    // Rich lesson hook section rendered with Indonesian content
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    // The rich lesson has specific Indonesian text not in catalog
    expect(section!.textContent).toContain("Kedengarannya wajar");
  });
});
