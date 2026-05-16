// src/pages/languages/__tests__/uiChromeEn.smoke.test.tsx
//
// Headless smoke test (per #509 §8) for the EN-mode UI-chrome
// translation work (ui-chrome-en-translations branch, off #518).
//
// #517 toggled the hero + the inside-card LessonRenderer chrome, but the
// page-level chrome (CEFR level-tab labels, section header, lesson-count
// word, loading / empty copy, nav aria-label) stayed hardcoded
// Vietnamese on every language page — so EN-mode users still saw
// "A1 · Sơ cấp", "Chọn cấp độ", "Đang tải bài học …" throughout.
//
// This change centralizes the CEFR pill labels into a uiLang-aware
// `cefrPillLabel(level, uiLang)` (lessonThemes.ts) — EN values are
// byte-identical to the set SpanishLessonsPage already ships — and wires
// the remaining page strings to the global uiLanguage.
//
// As proven by heroSubtitle.smoke.test.tsx, each page's chrome (tabs,
// nav, section header, the lessons===null loading state) renders
// synchronously on first paint; the lesson fetch is a caught useEffect
// that does not block first render. So MemoryRouter + UiLanguageProvider
// is all that's needed headless — no network mock.
//
// Two guarantees asserted:
//   1. VI mode (provider default) is byte-identical — the exact prior
//      Vietnamese chrome strings are present, no English leaks in.
//   2. EN mode shows the English chrome end-to-end — and NO Vietnamese
//      chrome string (notably "Sơ cấp" / "Chọn cấp độ") survives.

import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { UiLanguageProvider } from "@/contexts/UiLanguageContext";
import {
  cefrPillLabel,
  cefrPillLabels,
  cefrPillLabelsEn,
} from "@/components/languages/lessonThemes";

import KoreanLessonsPage from "@/pages/languages/KoreanLessonsPage";
import JapaneseLessonsPage from "@/pages/languages/JapaneseLessonsPage";
import ChineseLessonsPage from "@/pages/languages/ChineseLessonsPage";
import FrenchLessonsPage from "@/pages/languages/FrenchLessonsPage";
import GermanLessonsPage from "@/pages/languages/GermanLessonsPage";
import LanguagesIndexPage from "@/pages/languages/LanguagesIndexPage";

const STORAGE_KEY = "mercyblade.lessonUiLang";

const LESSON_PAGES = [
  { name: "Korean", Page: KoreanLessonsPage },
  { name: "Japanese", Page: JapaneseLessonsPage },
  { name: "Chinese", Page: ChineseLessonsPage },
  { name: "French", Page: FrenchLessonsPage },
  { name: "German", Page: GermanLessonsPage },
] as const;

function renderPage(Page: React.ComponentType) {
  const utils = render(
    <MemoryRouter>
      <UiLanguageProvider>
        <Page />
      </UiLanguageProvider>
    </MemoryRouter>,
  );
  const { container } = utils;
  return {
    container,
    text: container.textContent ?? "",
    navAria:
      container.querySelector("nav[aria-label]")?.getAttribute("aria-label") ??
      "",
  };
}

describe("cefrPillLabel accessor (unit, #509 §8)", () => {
  const LEVELS = ["A1", "A1+", "A2", "B1", "B2", "C1", "C2"] as const;

  it("VI is byte-identical to the prior `cefrPillLabels[level] ?? level` map", () => {
    for (const lv of LEVELS) {
      expect(cefrPillLabel(lv, "vi")).toBe(cefrPillLabels[lv]);
    }
    // Unknown level degrades to the raw token (the old `?? level`).
    expect(cefrPillLabel("Z9", "vi")).toBe("Z9");
  });

  it("EN returns the English label for every level", () => {
    expect(cefrPillLabel("A1", "en")).toBe("A1 · Beginner");
    expect(cefrPillLabel("A1+", "en")).toBe("A1+ · Upper Beginner");
    expect(cefrPillLabel("A2", "en")).toBe("A2 · Elementary");
    expect(cefrPillLabel("B1", "en")).toBe("B1 · Intermediate");
    expect(cefrPillLabel("B2", "en")).toBe("B2 · Upper-Intermediate");
    expect(cefrPillLabel("C1", "en")).toBe("C1 · Advanced");
    expect(cefrPillLabel("C2", "en")).toBe("C2 · Mastery");
    for (const lv of LEVELS) {
      expect(cefrPillLabel(lv, "en")).toBe(cefrPillLabelsEn[lv]);
    }
  });

  it("EN degrades to the VI label then the raw token when the EN map lacks the level", () => {
    // Synthetic guard for the graceful-fallback chain in the helper.
    expect(cefrPillLabel("Z9", "en")).toBe("Z9");
  });
});

describe("language-page chrome — VI mode is byte-identical (#509 §8)", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  for (const { name, Page } of LESSON_PAGES) {
    it(`${name}: VI level tabs + nav aria unchanged, no English chrome leak`, () => {
      const { text, navAria } = renderPage(Page); // no stored value → "vi"
      // Level-tab + (KO/JA/ZH) section-header CEFR labels stay Vietnamese.
      expect(text).toContain("A1 · Sơ cấp");
      expect(text).toContain("C2 · Thuần thục");
      // Nav aria-label stays Vietnamese.
      expect(navAria).toBe("Chọn cấp độ");
      // The English labels must NOT appear in VI mode.
      expect(text).not.toContain("A1 · Beginner");
      expect(text).not.toContain("C2 · Mastery");
      expect(navAria).not.toBe("Choose level");
    });
  }

  it("Hub: VI blurbs + 'Bắt đầu học' CTA unchanged, no English blurb leak", () => {
    const { text } = renderPage(LanguagesIndexPage);
    expect(text).toContain("chào hỏi, số đếm, câu giao tiếp"); // a VI blurb
    expect(text).toContain("Bắt đầu học");
    expect(text).not.toContain("Start learning");
    expect(text).not.toContain(
      "greetings, numbers, everyday phrases, grammar, food",
    );
  });
});

describe("language-page chrome — EN mode is fully English (#509 §8)", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, "en");
  });

  for (const { name, Page } of LESSON_PAGES) {
    it(`${name}: EN level tabs + nav aria + loading copy, NO Vietnamese chrome`, () => {
      const { text, navAria } = renderPage(Page);
      // CEFR labels are English (tab row + KO/JA/ZH section header).
      expect(text).toContain("A1 · Beginner");
      expect(text).toContain("C2 · Mastery");
      // First render is the loading state (lessons === null); its copy
      // and the embedded level label are English on every page.
      expect(text).toContain("Loading A1 · Beginner lessons…");
      // Nav aria-label is English.
      expect(navAria).toBe("Choose level");
      // ZERO Vietnamese chrome may survive in EN mode.
      expect(text).not.toContain("Sơ cấp");
      expect(text).not.toContain("Thuần thục");
      expect(text).not.toContain("Đang tải bài học");
      expect(text).not.toContain("Chưa có bài học");
      expect(navAria).not.toBe("Chọn cấp độ");
    });
  }

  it("Hub: EN blurbs + 'Start learning' CTA, no Vietnamese blurb", () => {
    const { text } = renderPage(LanguagesIndexPage);
    expect(text).toContain(
      "greetings, numbers, everyday phrases, grammar, food",
    );
    expect(text).toContain("Start learning");
    expect(text).not.toContain("Bắt đầu học");
    expect(text).not.toContain("chào hỏi, số đếm, câu giao tiếp");
  });
});
