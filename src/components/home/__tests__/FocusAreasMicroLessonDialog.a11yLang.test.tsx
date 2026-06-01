import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import FocusAreasMicroLessonDialog from "@/components/home/FocusAreasMicroLessonDialog";
import { WEAKNESS_CATALOG } from "@/lib/weakness/weakness-catalog";
import type { WeaknessEntry } from "@/lib/weakness/weakness-catalog";

/**
 * P0-3 (WCAG 3.1.2, Language of Parts) — live focus-areas micro-lesson dialog
 * (Home → FocusAreasCard). Its CTA buttons mixed VI/EN as single text nodes
 * inside the lang="vi" document; each segment must now be lang-tagged via the
 * shared <Bilingual>.
 */
const base = Object.values(WEAKNESS_CATALOG)[0];

const renderDialog = (entry: WeaknessEntry) =>
  render(
    <MemoryRouter>
      <FocusAreasMicroLessonDialog
        entry={entry}
        onOpenChange={() => {}}
        userId={null}
      />
    </MemoryRouter>,
  );

describe("FocusAreasMicroLessonDialog — per-part lang (WCAG 3.1.2)", () => {
  it("tags the 'Start lesson' CTA segments when a room is linked", () => {
    renderDialog({ ...base, linkedRoomId: "english_a1_demo" });
    expect(screen.getByText("Start lesson")).toHaveAttribute("lang", "en");
    expect(screen.getByText("Bắt đầu bài học")).toHaveAttribute("lang", "vi");
  });

  it("tags the 'coming soon' CTA segments when no room is linked", () => {
    renderDialog({ ...base, linkedRoomId: null });
    expect(screen.getByText("Lesson coming soon")).toHaveAttribute(
      "lang",
      "en",
    );
    expect(screen.getByText("Sắp có bài học")).toHaveAttribute("lang", "vi");
  });

  it("tags the dismiss CTA segments", () => {
    renderDialog({ ...base, linkedRoomId: null });
    expect(screen.getByText("Not now")).toHaveAttribute("lang", "en");
    expect(screen.getByText("Để sau")).toHaveAttribute("lang", "vi");
  });
});
