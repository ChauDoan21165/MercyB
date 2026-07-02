import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import * as ItalianContent from "@/languages/italian";
import { italianLessons } from "../ItalianLessonsPage";

const readSource = (path: string) => readFileSync(path, "utf8");

const italianSourceFiles = (dir = "src/languages/italian"): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return italianSourceFiles(path);
    return path.endsWith(".ts") || path.endsWith(".tsx") ? [path] : [];
  });

describe("ItalianLessonsPage", () => {
  it("uses local Italian language content", () => {
    expect(Object.keys(ItalianContent).length).toBeGreaterThan(0);
    expect(italianSourceFiles().length).toBeGreaterThan(0);
    expect(italianLessons.length).toBeGreaterThan(0);

    const pageSource = readSource("src/pages/languages/ItalianLessonsPage.tsx");
    expect(pageSource).toContain('from "@/languages/italian"');
    expect(pageSource).not.toMatch(/supabase/i);
  });

  it("registers an explicit public Italian route", () => {
    const routerSource = readSource("src/router/AppRouter.tsx");
    expect(routerSource).toContain("ItalianLessonsPage");
    expect(routerSource).toContain('path="/languages/italian"');
  });

  it("adds an Italian hub card", () => {
    const hubSource = readSource("src/pages/languages/LanguagesIndexPage.tsx");
    expect(hubSource).toContain("/languages/italian");
    expect(hubSource).toContain("Italian");
    expect(hubSource).toContain("Italiano");
  });

  it("does not add a Supabase loader or fake feature promise", () => {
    const pageSource = readSource("src/pages/languages/ItalianLessonsPage.tsx");
    expect(pageSource).not.toMatch(/supabase|ai tutor|audio|voice|speech/i);
  });
});
