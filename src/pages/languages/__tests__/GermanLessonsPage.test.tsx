import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ComponentType } from "react";

import * as PageModule from "../GermanLessonsPage";
import * as LanguageContent from "../../../languages/german";
import { UiLanguageProvider } from "../../../contexts/UiLanguageContext";

const repoRoot = resolve(process.cwd());
const pageSource = readFileSync(resolve(repoRoot, "src/pages/languages/GermanLessonsPage.tsx"), "utf8");
const routerSource = readFileSync(resolve(repoRoot, "src/router/AppRouter.tsx"), "utf8");
const languagesIndexSource = readFileSync(resolve(repoRoot, "src/pages/languages/LanguagesIndexPage.tsx"), "utf8");

const GermanLessonsPage = (
  (PageModule as { default?: ComponentType; GermanLessonsPage?: ComponentType }).default ??
  (PageModule as { default?: ComponentType; GermanLessonsPage?: ComponentType }).GermanLessonsPage
) as ComponentType;

const identityLabels = ["German", "Deutsch"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const collectStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (isRecord(value)) return Object.values(value).flatMap(collectStrings);
  return [];
};

const localLessonTextCandidates = Object.values(LanguageContent)
  .flatMap((value) => (Array.isArray(value) ? value.slice(0, 8) : []))
  .flatMap(collectStrings)
  .map((value) => value.trim())
  .filter((value) => value.length >= 4 && value.length <= 100)
  .filter((value) => !/^[A-Z0-9_-]+$/.test(value));

const renderPage = () =>
  render(
    <UiLanguageProvider>
      <MemoryRouter>
        <GermanLessonsPage />
      </MemoryRouter>
    </UiLanguageProvider>,
  );

describe("GermanLessonsPage", () => {
  it("renders a public page backed by local German lesson arrays", () => {
    expect(localLessonTextCandidates.length).toBeGreaterThan(0);
    expect(pageSource.toLowerCase()).toContain("languages/german");

    renderPage();

    const renderedText = document.body.textContent ?? "";
    expect(renderedText.length).toBeGreaterThan(0);
    expect(identityLabels.some((label) => renderedText.includes(label))).toBe(true);
  });

  it("is registered as a public language route", () => {
    expect(routerSource).toContain("GermanLessonsPage");
    expect(routerSource).toContain('path="/languages/german"');
    expect(routerSource).toMatch(/<GermanLessonsPage\s*\/>/);
  });

  it("has a hub card/link on the languages index", () => {
    expect(languagesIndexSource).toContain("German");
    expect(languagesIndexSource).toContain('slug: "german"');
    expect(languagesIndexSource).toContain('href: "/languages/german"');
  });

  it("does not fake audio, AI tutor, or local lesson promises", () => {
    const source = pageSource.toLowerCase();

    expect(source).not.toContain("promise.resolve");
    expect(source).not.toContain("fake audio");
    expect(source).not.toContain("fakeaudio");
    expect(source).not.toContain("fake ai");
    expect(source).not.toContain("fake tutor");
    expect(source).not.toContain("fakeaitutor");
  });
});
