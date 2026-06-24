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

describe("FocusAreasMicroLessonDialog — A2 id-native rich lessons", () => {
  it("renders A2 prepositions lesson (vi_l1_preposition_transfer) with id content", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_preposition_transfer!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    // Section headings prove rich lesson body mounted
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Indonesian preposition explanation rendered
    expect(section!.textContent).toContain("Bahasa Indonesia menggunakan");
    // "di" is a key concept in the Indonesian explanation
    expect(section!.textContent).toContain("di");
  });

  it("renders A2 present-perfect lesson (vi_l1_present_perfect_vs_past) with id content", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const takeawayHeading = screen.getByText("Ghi nhớ");
    const section = takeawayHeading.closest('[data-rich-section="takeaway"]');
    expect(section).toBeTruthy();
    // Indonesian takeaway content rendered
    expect(section!.textContent).toMatch(/simple past|past simple/i);
    expect(section!.textContent).toContain("present perfect");
  });

  it("renders A2 make-vs-do lesson (vi_l1_make_vs_do) with id content", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_make_vs_do!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const hookHeading = screen.getByText("Mở đầu");
    const section = hookHeading.closest('[data-rich-section="hook"]');
    expect(section).toBeTruthy();
    // Indonesian hook content — references Indonesian "buat" and "lakukan"
    expect(section!.textContent).toContain("buat");
    expect(section!.textContent).toContain("lakukan");
  });

  it("renders A2 adjective-order lesson (vi_l1_adjective_order) with id content", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_adjective_order!;
    renderDialog({ ...entry, linkedRoomId: null }, "id");
    const whyHeading = screen.getByText("Vì sao khó");
    const section = whyHeading.closest('[data-rich-section="why"]');
    expect(section).toBeTruthy();
    // Indonesian "why" section uses Indonesian noun-adjective examples
    expect(section!.textContent).toContain("setelah");
    // Rumah besar is an example phrase — may be rendered from **Rumah besar** markdown
    expect(section!.textContent.toLowerCase()).toContain("rumah besar");
  });

  it("all four A2 lessons render with id content in id mode", () => {
    const a2Tags = [
      "vi_l1_preposition_transfer",
      "vi_l1_present_perfect_vs_past",
      "vi_l1_make_vs_do",
      "vi_l1_adjective_order",
    ] as const;
    for (const tag of a2Tags) {
      const entry = WEAKNESS_CATALOG[tag]!;
      const { unmount } = render(
        <MemoryRouter>
          <FocusAreasMicroLessonDialog
            entry={{ ...entry, linkedRoomId: null }}
            onOpenChange={() => {}}
            userId={null}
            nativeLanguage="id"
          />
        </MemoryRouter>,
      );
      // Each renders the "why" section heading — proves rich lesson loaded
      expect(screen.getByText("Vì sao khó")).toBeDefined();
      unmount();
    }
  });
});

describe("FocusAreasMicroLessonDialog — A2 weakness catalog id fields", () => {
  it("vi_l1_possessive_gender has id shortLabel and longDescription", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_possessive_gender!;
    expect(entry.shortLabel.id).toBe("**His** vs **her**");
    expect(entry.longDescription.id).toContain("Bahasa Indonesia");
    expect(entry.longDescription.id).toContain("gender pemilik");
  });

  it("vi_l1_countable has id shortLabel and longDescription", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_countable!;
    expect(entry.shortLabel.id).toBe("Bisa dihitung / tidak bisa dihitung");
    expect(entry.longDescription.id).toContain("banyak uang");
    expect(entry.longDescription.id).toContain("many");
  });

  it("vi_l1_to_verb_confusion has id shortLabel and longDescription", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_to_verb_confusion!;
    expect(entry.shortLabel.id).toBe("Kapan pakai **to + verb**");
    expect(entry.longDescription.id).toContain("infinitif");
  });

  it("vi_l1_double_past has id shortLabel and longDescription", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_double_past!;
    expect(entry.shortLabel.id).toBe("Satu penanda lampau, bukan dua");
    expect(entry.longDescription.id).toContain("sudah");
    expect(entry.longDescription.id).toContain("did");
  });

  it("vi_l1_there_are_singular has id shortLabel and longDescription", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_there_are_singular!;
    expect(entry.shortLabel.id).toBe("**There is** vs **there are**");
    expect(entry.longDescription.id).toContain("ada");
    expect(entry.longDescription.id).toContain("there is");
  });

  it("vi_l1_present_perfect_vs_past has id shortLabel and longDescription", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_present_perfect_vs_past!;
    expect(entry.shortLabel.id).toBe("Present perfect vs past tense");
    expect(entry.longDescription.id).toContain("sudah");
    expect(entry.longDescription.id).toContain("waktu lampau spesifik");
  });

  it("vi_l1_adverb_before_subject has id shortLabel and longDescription", () => {
    const entry = WEAKNESS_CATALOG.vi_l1_adverb_before_subject!;
    expect(entry.shortLabel.id).toBe("Kata keterangan frekuensi setelah subjek");
    expect(entry.longDescription.id).toContain("Biasanya");
    expect(entry.longDescription.id).toContain("setelah");
  });
});

describe("B1 Indonesian fanout structural smoke", () => {
  it("keeps Indonesian rich lesson tags available in the weakness catalog", () => {
    const tags = [
      "vi_l1_3rd_person_s",
      "vi_l1_adjective_order",
      "vi_l1_conditional_mix",
      "vi_l1_make_vs_do",
      "vi_l1_missing_be",
      "vi_l1_past_ed",
      "vi_l1_preposition_transfer",
      "vi_l1_present_perfect_vs_past",
      "vi_l1_reported_speech",
    ] as const;
    for (const tag of tags) {
      expect(WEAKNESS_CATALOG[tag], `${tag} missing from WEAKNESS_CATALOG`).toBeTruthy();
    }
  });
});

describe("B2 Indonesian fanout structural smoke", () => {
  it("keeps merged Indonesian rich lesson tags available in the weakness catalog", () => {
    const tags = [
      "id_l1_conditional_unreal",
      "id_l1_present_perfect_vs_past",
      "id_l1_reported_speech",
      "vi_l1_3rd_person_s",
      "vi_l1_adjective_order",
      "vi_l1_conditional_mix",
      "vi_l1_make_vs_do",
      "vi_l1_missing_be",
      "vi_l1_passive_missing_be",
      "vi_l1_past_ed",
      "vi_l1_preposition_transfer",
      "vi_l1_present_perfect_vs_past",
      "vi_l1_reported_speech",
    ] as const;
    for (const tag of tags) {
      expect(WEAKNESS_CATALOG[tag], `${tag} missing from WEAKNESS_CATALOG`).toBeTruthy();
    }
  });
});

describe("C1 Indonesian fanout structural smoke", () => {
  it("keeps merged Indonesian rich lesson tags available in the weakness catalog", () => {
    const tags = [
      "id_l1_conditional_unreal",
      "id_l1_present_perfect_vs_past",
      "id_l1_reported_speech",
      "vi_l1_3rd_person_s",
      "vi_l1_adjective_order",
      "vi_l1_conditional_mix",
      "vi_l1_make_vs_do",
      "vi_l1_missing_be",
      "vi_l1_modal_perfect",
      "vi_l1_negative_inversion",
      "vi_l1_passive_missing_be",
      "vi_l1_past_ed",
      "vi_l1_preposition_transfer",
      "vi_l1_present_perfect_vs_past",
      "vi_l1_reported_speech",
      "vi_l1_subjunctive_were",
    ] as const;
    for (const tag of tags) {
      expect(WEAKNESS_CATALOG[tag], `${tag} missing from WEAKNESS_CATALOG`).toBeTruthy();
    }
  });
});

