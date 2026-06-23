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

describe("FocusAreasMicroLessonDialog — B2 Indonesian-native rich lessons", () => {
  it("renders B2 present-perfect-vs-past with Indonesian content in id mode", () => {
    // vi_l1_present_perfect_vs_past has a B2 rich lesson with full id content
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // The "why" section heading proves rich lesson body mounted
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Indonesian text rendered
    expect(section!.textContent).toContain("Bahasa Indonesia tidak memisahkan");
    // English also shown in "both" mode
    expect(section!.textContent).toContain("doesn't separate");
    // VI should NOT be present in id mode
    expect(section!.textContent).not.toContain("Tiếng Việt không tách bạch");
  });

  it("renders B2 present-perfect-vs-past hook with Indonesian text", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Kedengarannya hampir benar");
  });

  it("renders B2 present-perfect-vs-past takeaway with Indonesian text", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Ada kata waktu lampau spesifik");
  });

  it("renders B2 conditional-mix with Indonesian content in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_conditional_mix!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Indonesian why text rendered
    expect(section!.textContent).toContain("Bahasa Indonesia menggunakan");
    // VI should NOT be present in id mode
    expect(section!.textContent).not.toContain("Tiếng Việt mình nếu");
  });

  it("renders B2 conditional-mix takeaway with Indonesian text", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_conditional_mix!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Nyata =");
    expect(section!.textContent).toContain("Khayalan =");
  });

  it("renders B2 passive-missing-be with Indonesian content in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_passive_missing_be!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Indonesian why text rendered
    expect(section!.textContent).toContain("Bahasa Indonesia membentuk pasif dengan awalan");
    // VI should NOT be present
    expect(section!.textContent).not.toContain("Tiếng Việt mình dùng bị");
  });

  it("renders B2 passive-missing-be hook with Indonesian text", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_passive_missing_be!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Hampir semua pelajar Indonesia");
  });

  it("renders B2 passive-missing-be takeaway with Indonesian text", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_passive_missing_be!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Pasif =");
    expect(section!.textContent).toContain("tidak pernah opsional");
  });

  it("renders B2 past-perfect-missing entry with en fallback (no rich lesson)", () => {
    // past_perfect_missing has no rich lesson — falls back to micro-lesson en text
    const entry = WEAKNESS_CATALOG.vi_l1_past_perfect_missing!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // The "why" section heading is present
    const whyHeading = screen.getByText("Vì sao khó");
    expect(whyHeading).toBeDefined();
    // Micro-lesson EN text renders as fallback (no id in micro-lessons yet)
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("had + past participle");
  });

  it("renders B2 reported-speech entry with en fallback (no rich lesson)", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_reported_speech!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Micro-lesson EN text renders as fallback
    expect(section!.textContent).toContain("without changing the verb");
  });
});

describe("FocusAreasMicroLessonDialog — B2 id_l1_* content rendering", () => {
  it("renders B2 present-perfect-vs-past lesson with id content", () => {
    const entry = WEAKNESS_CATALOG.id_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Indonesian primary content
    expect(section!.textContent).toContain("Bahasa Indonesia menggunakan");
    // English also shown in "both" mode
    expect(section!.textContent).toContain("Indonesian uses");
    // VI should NOT be present in id mode
    expect(section!.textContent).not.toContain("Tiếng Indonesia dùng");
  });

  it("renders B2 conditional-unreal lesson with id content", () => {
    const entry = WEAKNESS_CATALOG.id_l1_conditional_unreal!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    // Indonesian hook text
    expect(section!.textContent).toContain("Pernah dengar?");
    expect(section!.textContent).toContain("kalau");
    // English also shown
    expect(section!.textContent).toContain("Sound familiar?");
  });

  it("renders B2 reported-speech lesson with id content", () => {
    const entry = WEAKNESS_CATALOG.id_l1_reported_speech!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    // Indonesian takeaway text
    expect(section!.textContent).toContain("Kata kerja pelapor");
    expect(section!.textContent).toContain("geser");
  });

  it("renders B2 lesson with ID+EN toggle in id mode", () => {
    const entry = WEAKNESS_CATALOG.id_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const toggles = screen.getAllByText("ID+EN");
    expect(toggles.length).toBeGreaterThan(0);
  });
});
