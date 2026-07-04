import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { UiLanguageProvider } from "@/contexts/UiLanguageContext";
import { isTutorTargetLanguageSupported } from "@/lib/tutor/languageRegistry";
import {
  TURKISH_CATEGORIES,
  TURKISH_LESSONS_BY_LEVEL,
  TURKISH_TOTAL_LESSONS,
  TURKISH_VALIDATED_LEVELS,
} from "@/languages/turkish";
import TurkishLessonsPage from "@/pages/languages/TurkishLessonsPage";

const here = path.dirname(new URL(import.meta.url).pathname);
const pageSrc = fs.readFileSync(path.resolve(here, "../TurkishLessonsPage.tsx"), "utf8");
const hubSrc = fs.readFileSync(path.resolve(here, "../LanguagesIndexPage.tsx"), "utf8");
const routerSrc = fs.readFileSync(path.resolve(process.cwd(), "src/router/AppRouter.tsx"), "utf8");

describe("TurkishLessonsPage", () => {
  it("is a real page module wired to local Turkish content", () => {
    expect(typeof TurkishLessonsPage).toBe("function");
    expect(pageSrc).toContain('from "@/languages/turkish"');
    expect(pageSrc).toContain("TURKISH_CATEGORIES");
    expect(pageSrc).toContain("TURKISH_LESSONS_BY_LEVEL");
    expect(pageSrc).toContain("TURKISH_TOTAL_LESSONS");
    expect(pageSrc).toContain("TURKISH_VALIDATED_LEVELS");
    expect(pageSrc).toContain("normalizeTurkishLesson");
  });

  it("keeps the rendered page tied to the validated local Turkish level and category registry", () => {
    expect(TURKISH_VALIDATED_LEVELS).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    expect(TURKISH_TOTAL_LESSONS).toBe(TURKISH_CATEGORIES.length);
    expect(TURKISH_LESSONS_BY_LEVEL.A1[0].sentences[0].en).toContain("Hello");
    expect(TURKISH_LESSONS_BY_LEVEL.A1[0].sentences[0].tr).toContain("Merhaba");

    render(
      <MemoryRouter>
        <UiLanguageProvider>
          <TurkishLessonsPage />
        </UiLanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("button", { name: /A1/ })[0]).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Chào hỏi")).toBeInTheDocument();
    expect(screen.getByText("Hài hòa nguyên âm")).toBeInTheDocument();
  });

  it("does not use remote lessons or sound promise code", () => {
    expect(pageSrc).not.toMatch(/@\/lib\/supabase|supabase\.from|useLessonData|fetchLessonsBatch/);
    expect(pageSrc).not.toMatch(/new\s+Promise|Promise\.resolve|audioBase|playAudio|lessonAudio/i);
  });

  it("shows AI Tutor CTA only through the supported Turkish target gate", () => {
    expect(isTutorTargetLanguageSupported("tr")).toBe(true);
    expect(pageSrc).toContain("AITutorCtaBanner");
    expect(pageSrc).toContain('target="tr"');

    render(
      <MemoryRouter>
        <UiLanguageProvider>
          <TurkishLessonsPage />
        </UiLanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /Luyện với AI Tutor/ })).toHaveAttribute(
      "href",
      "/ai-tutor?target=tr",
    );
  });

  it("is linked from the language hub", () => {
    expect(hubSrc).toContain('slug: "turkish"');
    expect(hubSrc).toContain('href: "/languages/turkish"');
    expect(hubSrc).toContain("Tiếng Thổ Nhĩ Kỳ");
    expect(hubSrc).toContain("Turkish");
  });

  it("is lazy-loaded by AppRouter", () => {
    expect(routerSrc).toMatch(/const\s+TurkishLessonsPage\b/);
    expect(routerSrc).toContain('path="/languages/turkish"');
    expect(routerSrc).toMatch(/<TurkishLessonsPage\s*\/>/);
  });
});
