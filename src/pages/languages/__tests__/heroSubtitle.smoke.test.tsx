// src/pages/languages/__tests__/heroSubtitle.smoke.test.tsx
//
// Headless smoke test (per #509 §8) for the EN-mode hero-subtitle fix
// (en-mode-subtitle-fix branch, off #517).
//
// Bug #517 left: each per-language page made the hero *subtitle* a
// language SWAP — `{uiLang === "en" ? HERO_VI : HERO_EN}` — so in EN
// mode the subtitle rendered the Vietnamese "… cho người Việt" line
// directly under the de-narrowed English title.
//
// SUPERSEDED by the single-language requirement (uilang-single-language):
// the hero now shows ONLY the active uiLanguage in BOTH modes. #518's
// asymmetry (VI mode kept the EN secondary line) is gone — the secondary
// <p> was deleted entirely. This test renders all five affected pages in
// both modes and asserts a single-language, audience-appropriate hero.
//
// Each page's hero <header> renders synchronously; the lesson fetch is
// in a caught useEffect and does not block (or crash) first render, so
// a MemoryRouter + UiLanguageProvider is all the page needs headless.

import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { UiLanguageProvider } from "@/contexts/UiLanguageContext";

import KoreanLessonsPage from "@/pages/languages/KoreanLessonsPage";
import JapaneseLessonsPage from "@/pages/languages/JapaneseLessonsPage";
import ChineseLessonsPage from "@/pages/languages/ChineseLessonsPage";
import FrenchLessonsPage from "@/pages/languages/FrenchLessonsPage";
import GermanLessonsPage from "@/pages/languages/GermanLessonsPage";
import PortugueseLessonsPage from "@/pages/languages/PortugueseLessonsPage";
import TurkishLessonsPage from "@/pages/languages/TurkishLessonsPage";

// The exclusionary fragment that must never reach an EN-mode user.
const EXCLUSIONARY = "cho người Việt";

const PAGES = [
  { name: "Korean", Page: KoreanLessonsPage, viTitle: "Tiếng Hàn cho người Việt", enTitle: "real-life lessons, explained clearly" },
  { name: "Japanese", Page: JapaneseLessonsPage, viTitle: "Tiếng Nhật cho người Việt", enTitle: "real-life lessons, explained clearly" },
  { name: "Chinese", Page: ChineseLessonsPage, viTitle: "Tiếng Trung cho người Việt", enTitle: "real-life lessons, explained clearly" },
  { name: "French", Page: FrenchLessonsPage, viTitle: "Tiếng Pháp cho người Việt", enTitle: "real-life lessons, explained clearly" },
  { name: "German", Page: GermanLessonsPage, viTitle: "Tiếng Đức cho người Việt", enTitle: "real-life lessons, explained clearly" },
  {
    name: "Portuguese",
    Page: PortugueseLessonsPage,
    viTitle: "Tiếng Bồ Đào Nha Brazil cho người Việt",
    enTitle: "real-life lessons, explained clearly",
  },
  {
    name: "Turkish",
    Page: TurkishLessonsPage,
    viTitle: "Tiếng Thổ Nhĩ Kỳ cho người Việt",
    enTitle: "practical local lessons",
  },
] as const;

const STORAGE_KEY = "mercyblade.lessonUiLang";

function renderPage(Page: React.ComponentType) {
  return render(
    <MemoryRouter>
      <UiLanguageProvider>
        <Page />
      </UiLanguageProvider>
    </MemoryRouter>,
  );
}

describe("language-page hero subtitle (smoke, #509 §8)", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  for (const { name, Page, viTitle, enTitle } of PAGES) {
    it(`${name}: VI mode (default) — VI title only, NO EN secondary line`, () => {
      // No stored value → provider defaults to "vi" (existing behavior).
      const { container } = renderPage(Page);
      const text = container.textContent ?? "";
      // VI title still present (Vietnamese-first, untouched).
      expect(text).toContain(viTitle);
      // The EN secondary line is now GONE in VI mode too (single
      // language — supersedes #518's asymmetry).
      expect(text).not.toContain(enTitle);
    });

    it(`${name}: EN mode — de-narrowed EN title, NO exclusionary VI subtitle`, () => {
      // Provider seeds synchronously from localStorage (no vi→en flash).
      window.localStorage.setItem(STORAGE_KEY, "en");
      const { container } = renderPage(Page);
      const text = container.textContent ?? "";
      // De-narrowed English title is shown.
      expect(text).toContain(enTitle);
      // The exclusionary Vietnamese line is gone entirely.
      expect(text).not.toContain(EXCLUSIONARY);
      expect(text).not.toContain(viTitle);
    });
  }
});
