import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { UiLanguageProvider } from "@/contexts/UiLanguageContext";
import FrenchLessonsPage from "@/pages/languages/FrenchLessonsPage";

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
});
