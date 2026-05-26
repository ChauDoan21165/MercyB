import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { UiLanguageProvider } from "@/contexts/UiLanguageContext";
import ChineseLessonsPage from "@/pages/languages/ChineseLessonsPage";
import FrenchLessonsPage from "@/pages/languages/FrenchLessonsPage";
import GermanLessonsPage from "@/pages/languages/GermanLessonsPage";
import JapaneseLessonsPage from "@/pages/languages/JapaneseLessonsPage";
import KoreanLessonsPage from "@/pages/languages/KoreanLessonsPage";
import LanguagesIndexPage from "@/pages/languages/LanguagesIndexPage";
import SpanishLessonsPage from "@/pages/languages/SpanishLessonsPage";
import VietnameseLessonsPage from "@/pages/languages/VietnameseLessonsPage";

const LANGUAGE_SURFACES = [
  { name: "/languages", Page: LanguagesIndexPage, href: "/ai-tutor?target=en" },
  { name: "/languages/chinese", Page: ChineseLessonsPage, href: "/ai-tutor?target=zh" },
  { name: "/languages/french", Page: FrenchLessonsPage, href: "/ai-tutor?target=fr" },
  { name: "/languages/german", Page: GermanLessonsPage, href: "/ai-tutor?target=de" },
  { name: "/languages/japanese", Page: JapaneseLessonsPage, href: "/ai-tutor?target=ja" },
  { name: "/languages/korean", Page: KoreanLessonsPage, href: "/ai-tutor?target=ko" },
  { name: "/languages/spanish", Page: SpanishLessonsPage, href: "/ai-tutor?target=es" },
  { name: "/languages/vietnamese", Page: VietnameseLessonsPage, href: "/ai-tutor?target=vi" },
] as const;

describe("FrenchLessonsPage AI Tutor CTA", () => {
  it("shows the AI Tutor CTA between the hero copy and level tabs and routes to French Tutor", () => {
    render(
      <MemoryRouter>
        <UiLanguageProvider>
          <FrenchLessonsPage />
        </UiLanguageProvider>
      </MemoryRouter>,
    );

    const cta = screen.getByRole("link", { name: /Luyện với AI Tutor/ });
    const levelTabs = screen.getByRole("navigation", { name: "Chọn cấp độ" });

    expect(screen.getByText("🤖 Luyện với AI Tutor / Practice with AI Tutor")).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/ai-tutor?target=fr");
    expect(cta.compareDocumentPosition(levelTabs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it.each(LANGUAGE_SURFACES)("$name shows the AI Tutor CTA and preserves target language", ({ Page, href }) => {
    render(
      <MemoryRouter>
        <UiLanguageProvider>
          <Page />
        </UiLanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Luyện với AI Tutor/ })).toHaveAttribute(
      "href",
      href,
    );
  });
});
