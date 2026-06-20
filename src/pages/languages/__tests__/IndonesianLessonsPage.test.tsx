import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

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
