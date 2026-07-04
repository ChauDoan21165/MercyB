import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliLessonsPage, { swahiliLessons } from "../SwahiliLessonsPage";

const repoRoot = resolve(__dirname, "../../../..");

describe("SwahiliLessonsPage", () => {
  it("uses local Swahili lesson content", () => {
    expect(swahiliLessons.length).toBeGreaterThan(0);
    expect(
      swahiliLessons.some((lesson) =>
        Object.values(lesson).some((value) => typeof value === "string" && value.trim().length > 0),
      ),
    ).toBe(true);
  });

  it("renders local Swahili lesson samples and a languages backlink", () => {
    render(
      <MemoryRouter>
        <SwahiliLessonsPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("swahili-lessons-page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Swahili Lessons" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to languages/i })).toHaveAttribute("href", "/languages");
    expect(screen.getByText(new RegExp(`${swahiliLessons.length} local lessons available`))).toBeInTheDocument();
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
