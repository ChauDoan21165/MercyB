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
  { name: "/languages", Page: LanguagesIndexPage },
  { name: "/languages/chinese", Page: ChineseLessonsPage },
  { name: "/languages/french", Page: FrenchLessonsPage },
  { name: "/languages/german", Page: GermanLessonsPage },
  { name: "/languages/japanese", Page: JapaneseLessonsPage },
  { name: "/languages/korean", Page: KoreanLessonsPage },
  { name: "/languages/spanish", Page: SpanishLessonsPage },
  { name: "/languages/vietnamese", Page: VietnameseLessonsPage },
] as const;

describe("FrenchLessonsPage AI Tutor CTA", () => {
  it("shows the AI Tutor CTA between the hero copy and level tabs and routes to /ai-tutor", () => {
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
    expect(cta).toHaveAttribute("href", "/ai-tutor");
    expect(cta.compareDocumentPosition(levelTabs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it.each(LANGUAGE_SURFACES)("$name shows the AI Tutor CTA and routes to /ai-tutor", ({ Page }) => {
    render(
      <MemoryRouter>
        <UiLanguageProvider>
          <Page />
        </UiLanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Luyện với AI Tutor/ })).toHaveAttribute(
      "href",
      "/ai-tutor",
    );
  });
});
