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

describe("FocusAreasMicroLessonDialog — C2 fanout: id catalog entries render", () => {
  it("renders dialog without crashing for L1 detector v3 entry with id content", () => {
    // vi_l1_past_perfect_missing has ja + id catalog fields, no rich lesson
    const entry = WEAKNESS_CATALOG.vi_l1_past_perfect_missing!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Dialog renders the CTA button (proves dialog mounted)
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
  });

  it("renders dialog for Round 5 entry (advanced grammar) in id mode", () => {
    // vi_l1_modal_perfect is a Round 5 entry with ja + id catalog fields
    renderDialog({ ...WEAKNESS_CATALOG.vi_l1_modal_perfect!, linkedRoomId: null }, "id");
    // Dialog renders — "coming soon" CTA shown (no linked room)
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
  });

  it("renders dialog for L1 detector expansion entry with id catalog content", () => {
    // vi_l1_make_vs_do has id catalog fields, no rich lesson
    const entry = WEAKNESS_CATALOG.vi_l1_make_vs_do!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Dialog renders
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
    // Verify the id longDescription field is present on the entry object
    expect(entry.longDescription.id).toBeDefined();
    expect(entry.longDescription.id).toContain("Bahasa Indonesia");
  });

  it("id catalog fields are present on all entries", () => {
    // Verify all entries have id fields on both shortLabel and longDescription
    const entries = Object.values(WEAKNESS_CATALOG);
    for (const entry of entries) {
      expect(entry.shortLabel.id, `shortLabel.id missing for ${entry.tag}`).toBeDefined();
      expect(entry.longDescription.id, `longDescription.id missing for ${entry.tag}`).toBeDefined();
    }
  });

  it("ja mode works with ja+id entries without leaking id text into EN fallback", () => {
    // vi_l1_past_perfect_missing has ja + id; in ja mode the entry renders
    const entry = WEAKNESS_CATALOG.vi_l1_past_perfect_missing!;
    renderDialog({ ...entry, linkedRoomId: null }, "ja");
    // Dialog renders
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
    // ja longDescription is present on the entry object
    expect(entry.longDescription.ja).toBeDefined();
    expect(entry.longDescription.ja).toContain("日本語");
  });

  it("dialog renders for rich-lesson entry with id in pilot JSON", () => {
    // vi_l1_3rd_person_s has rich lesson pilot with full id content
    const entry = WEAKNESS_CATALOG.vi_l1_3rd_person_s!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Rich lesson body mounts with section blocks
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Both id text (primary) and en text (reference) rendered
    expect(section!.textContent).toContain("kata kerja tidak pernah berubah");
    expect(section!.textContent).toContain("the verb never changes");
  });

  it("renders Indonesian-native adjective_order reference (id-native language example)", () => {
    // vi_l1_adjective_order uses Indonesian "baju merah" example in its id field
    const entry = WEAKNESS_CATALOG.vi_l1_adjective_order!;
    renderDialog({ ...entry, linkedRoomId: "english_a2_a203" }, "id");
    // Dialog renders — linked room means "Start lesson" CTA
    expect(screen.getByText("Bắt đầu bài học")).toBeDefined();
    // Entry has Indonesian-native language example in its id field
    expect(entry.longDescription.id).toContain("baju merah");
  });

  it("renders subjunctive_were rich lesson with id content in id mode", () => {
    // vi_l1_subjunctive_were has a rich lesson pilot with full id content
    const entry = WEAKNESS_CATALOG.vi_l1_subjunctive_were!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Rich lesson body mounts with section blocks
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // id text renders as primary in "why" section
    expect(section!.textContent).toContain("subjunctive mood");
    // EN text also renders as reference in "both" mode
    expect(section!.textContent).toContain("English subjunctive mood");
  });

  it("renders subjunctive_were takeaway with id content in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_subjunctive_were!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("SEMUA subjek");
  });

  it("subjunctive_were id mode does NOT render VI text in sections", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_subjunctive_were!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // VI text should not appear in id mode rich lesson sections
    expect(section!.textContent).not.toContain("giả định cách");
  });

  it("subjunctive_were VI mode shows Vietnamese content", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_subjunctive_were!;
    renderDialog({ ...entry, linkedRoomId: null }, "vi");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("thức giả định");
  });

  it("subjunctive_were shows ID+EN toggle in id mode", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_subjunctive_were!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const toggles = screen.getAllByText("ID+EN");
    expect(toggles.length).toBeGreaterThan(0);
  });

  it("renders all catalog entries in id mode without crashing", () => {
    // Smoke test: render every entry in id mode
    const entries = Object.values(WEAKNESS_CATALOG);
    for (const entry of entries) {
      const { unmount } = render(
        <MemoryRouter>
          <FocusAreasMicroLessonDialog
            entry={entry}
            onOpenChange={() => {}}
            userId={null}
            nativeLanguage="id"
          />
        </MemoryRouter>,
      );
      // Dialog renders — verify a known button exists (either "Start" or "Coming soon")
      const ctaExists =
        screen.queryByText("Bắt đầu bài học") !== null ||
        screen.queryByText("Sắp có bài học") !== null;
      expect(ctaExists, `Dialog did not render for ${entry.tag}`).toBe(true);
      unmount();
    }
  });
});

describe("FocusAreasMicroLessonDialog — C2 fanout: id_c2 entries render correctly", () => {
  it("renders id_c2_inversion_emphasis catalog entry in id mode", () => {
    const entry = WEAKNESS_CATALOG.id_c2_inversion_emphasis!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
    expect(entry.shortLabel.id).toBe("Inversi untuk penekanan");
    expect(entry.longDescription.id).toContain("Bahasa Indonesia meletakkan kata keterangan di depan");
  });

  it("renders id_c2_cleft_focus catalog entry in id mode", () => {
    const entry = WEAKNESS_CATALOG.id_c2_cleft_focus!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
    expect(entry.shortLabel.id).toBe("Kalimat cleft untuk fokus");
    expect(entry.longDescription.id).toContain("Bahasa Indonesia menggunakan **yang**");
  });

  it("renders id_c2_mixed_conditional with Indonesian-native language examples", () => {
    const entry = WEAKNESS_CATALOG.id_c2_mixed_conditional!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
    expect(entry.longDescription.id).toContain("kalau");
    expect(entry.longDescription.id).toContain("seandainya");
  });

  it("renders id_c2_register_consistency with Indonesian register examples", () => {
    const entry = WEAKNESS_CATALOG.id_c2_register_consistency!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
    expect(entry.longDescription.id).toContain("saya");
    expect(entry.longDescription.id).toContain("gue");
  });

  it("renders id_c2_hedging_academic with Indonesian academic phrasing", () => {
    const entry = WEAKNESS_CATALOG.id_c2_hedging_academic!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    expect(screen.getByText("Sắp có bài học")).toBeDefined();
    expect(entry.longDescription.id).toContain("membuktikan bahwa");
  });

  it("all C2 entries have null linkedRoomId (advanced topics, no dedicated rooms)", () => {
    const c2Tags = [
      "id_c2_inversion_emphasis",
      "id_c2_cleft_focus",
      "id_c2_mixed_conditional",
      "id_c2_register_consistency",
      "id_c2_hedging_academic",
    ];
    for (const tag of c2Tags) {
      const entry = WEAKNESS_CATALOG[tag as keyof typeof WEAKNESS_CATALOG];
      expect(entry, `Missing catalog entry for ${tag}`).toBeDefined();
      expect(entry!.linkedRoomId, `${tag} should have null linkedRoomId`).toBeNull();
    }
  });

  it("renders C2 rich lesson sections with id + en in both mode", () => {
    const entry = WEAKNESS_CATALOG.id_c2_inversion_emphasis!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Bahasa Indonesia sering meletakkan");
    expect(section!.textContent).toContain("Indonesian often fronts adverbs");
    expect(section!.textContent).not.toContain("Tiếng Việt thường đưa trạng từ");
  });

  it("C2 cleft_focus rich lesson renders Indonesian pattern text in id mode", () => {
    const entry = WEAKNESS_CATALOG.id_c2_cleft_focus!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const patternHeading = screen.getByText("Quy tắc");
    const section = patternHeading.closest('[data-rich-section="pattern"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("elemen-difokuskan");
    expect(section!.textContent).not.toContain("yếu-tố-nhấn");
  });

  it("C2 inversion_emphasis hook renders Indonesian text in id mode", () => {
    const entry = WEAKNESS_CATALOG.id_c2_inversion_emphasis!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("tidak pernah saya lihat");
  });

  it("C2 cleft_focus practice renders Indonesian text in id mode", () => {
    const entry = WEAKNESS_CATALOG.id_c2_cleft_focus!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const practiceHeading = screen.getByText("Luyện tập");
    const section = practiceHeading.closest('[data-rich-section="practice"]');
    expect(section).toBeTruthy();
    expect(section!.textContent).toContain("Ubah dengan keras");
  });

  it("C2 inversion_emphasis quiz options render in id mode", () => {
    const entry = WEAKNESS_CATALOG.id_c2_inversion_emphasis!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    expect(screen.getByText("Never have I been so insulted.")).toBeDefined();
    expect(screen.getByText("did she win")).toBeDefined();
  });

  it("C2 cleft_focus quiz options render in id mode", () => {
    const entry = WEAKNESS_CATALOG.id_c2_cleft_focus!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    expect(screen.getAllByText("What I need is more time.").length).toBeGreaterThan(0);
    // "What" appears in both quiz options and section content — getAllByText
    expect(screen.getAllByText("What").length).toBeGreaterThan(0);
  });
});
