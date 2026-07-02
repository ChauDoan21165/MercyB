import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { swahiliLessons } from "../SwahiliLessonsPage";

const repoRoot = resolve(__dirname, "../../../..");

describe("SwahiliLessonsPage", () => {
  it("uses local Swahili lesson content", () => {
    expect(swahiliLessons.length).toBeGreaterThan(0);
  });

  it("registers an explicit public Swahili route", () => {
    const router = readFileSync(resolve(repoRoot, "src/router/AppRouter.tsx"), "utf8");
    expect(router).toContain('path="/languages/swahili"');
    expect(router).toContain("SwahiliLessonsPage");
  });

  it("adds a static hub card for Swahili", () => {
    const hub = readFileSync(resolve(repoRoot, "src/pages/languages/LanguagesIndexPage.tsx"), "utf8");
    expect(hub).toContain("/languages/swahili");
    expect(hub).toContain("Swahili");
    expect(hub).toContain("Kiswahili");
  });

  it("does not use a Supabase loader for Swahili lessons", () => {
    const page = readFileSync(resolve(repoRoot, "src/pages/languages/SwahiliLessonsPage.tsx"), "utf8");
    expect(page).toContain("@/languages/swahili");
    expect(page).not.toMatch(/supabase|from\(["']@\/integrations\/supabase|createClient/i);
  });
});
