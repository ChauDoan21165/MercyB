import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { UiLanguageProvider } from "@/contexts/UiLanguageContext";
import {
  INDONESIAN_CATEGORIES,
  INDONESIAN_LESSONS_BY_LEVEL,
  INDONESIAN_TOTAL_LESSONS,
  INDONESIAN_VALIDATED_LEVELS,
} from "@/languages/indonesian";
import IndonesianLessonsPage from "@/pages/languages/IndonesianLessonsPage";

const here = path.dirname(new URL(import.meta.url).pathname);
const pageSrc = fs.readFileSync(path.resolve(here, "../IndonesianLessonsPage.tsx"), "utf8");
const hubSrc = fs.readFileSync(path.resolve(here, "../LanguagesIndexPage.tsx"), "utf8");
const routerSrc = fs.readFileSync(path.resolve(process.cwd(), "src/router/AppRouter.tsx"), "utf8");

describe("IndonesianLessonsPage", () => {
  it("is a real page module wired to local Indonesian content", () => {
    expect(typeof IndonesianLessonsPage).toBe("function");
    expect(pageSrc).toContain('from "@/languages/indonesian"');
    expect(pageSrc).toContain("INDONESIAN_LESSONS_BY_LEVEL");
    expect(pageSrc).toContain("normalizeIndonesianLesson");
  });

  it("keeps the rendered page tied to the validated local Indonesian level and category registry", () => {
    expect(INDONESIAN_VALIDATED_LEVELS).toEqual(["A1", "A2", "B1", "B2", "C1", "C2"]);
    expect(INDONESIAN_TOTAL_LESSONS).toBe(INDONESIAN_CATEGORIES.length);
    expect(INDONESIAN_LESSONS_BY_LEVEL.A1[0].sentences[0].en).toContain("Good morning");
    expect(INDONESIAN_LESSONS_BY_LEVEL.A1[0].vocabulary?.[0].word).toContain("selamat");

    render(
      <MemoryRouter>
        <UiLanguageProvider>
          <IndonesianLessonsPage />
        </UiLanguageProvider>
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("button", { name: /A1/ })[0]).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Chào hỏi")).toBeInTheDocument();
    expect(screen.getAllByText("Giới thiệu bản thân").length).toBeGreaterThan(0);
  });

  it("does not use remote lessons, audio promises, or AI Tutor CTA", () => {
    expect(pageSrc).not.toMatch(/@\/lib\/supabase|supabase\.from|useLessonData|fetchLessonsBatch/);
    expect(pageSrc).not.toMatch(/AITutorCtaBanner|ai-tutor|target="id"/i);
    expect(pageSrc).not.toMatch(/new\s+Promise|Promise\.resolve|audioBase|playAudio|lessonAudio/i);
  });

  it("is linked from the language hub", () => {
    expect(hubSrc).toContain('slug: "indonesian"');
    expect(hubSrc).toContain('href: "/languages/indonesian"');
    expect(hubSrc).toContain("Tiếng Indonesia");
  });

  it("is lazy-loaded by AppRouter", () => {
    expect(routerSrc).toMatch(/const\s+IndonesianLessonsPage\b/);
    expect(routerSrc).toContain('path="/languages/indonesian"');
    expect(routerSrc).toMatch(/<IndonesianLessonsPage\s*\/>/);
  });
});
