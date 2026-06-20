import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

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

  it("does not use remote lessons, tutor CTA, or sound promise code", () => {
    expect(pageSrc).not.toMatch(/@\/lib\/supabase|supabase\.from|useLessonData|fetchLessonsBatch/);
    expect(pageSrc).not.toMatch(/AITutorCtaBanner|ai-tutor|target="id"/i);
    expect(pageSrc).not.toMatch(/new\s+Promise|Promise\.resolve|audioBase|playAudio|lessonAudio/i);
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
