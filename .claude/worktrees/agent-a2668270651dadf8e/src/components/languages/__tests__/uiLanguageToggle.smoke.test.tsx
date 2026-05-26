// src/components/languages/__tests__/uiLanguageToggle.smoke.test.tsx
//
// Headless smoke test for the global uiLanguage toggle work
// (per #499 / #509 §8). Two concerns:
//
// 1. <LessonRenderer> still renders Vietnamese gloss content by default
//    (uiLanguage defaults to "vi") AND renders the campaign-authored
//    English siblings when uiLanguage="en" — verified on a real
//    normalized lesson from each of Korean, Japanese, Chinese (the
//    three modules wired in this PR). Korean only carries bilingual
//    gloss fields at B2+, so Korean/Japanese use lessons-b2 and Chinese
//    uses lessons-c1.
//
// 2. UiLanguageProvider defaults to "vi" and seeds synchronously from
//    localStorage so a stored "en" is reflected on the FIRST render
//    (no vi→en flash) and setUiLang persists.
//
// The probe is derived from the normalized object at runtime (the first
// register/cultural/tip field that has distinct vi+en values) so the
// test does not hard-code lesson content and stays green as the content
// campaign evolves.

import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";

import { LessonRenderer } from "@/components/languages/LessonRenderer";
import type { NormalizedLesson } from "@/components/languages/LessonRenderer.types";
import { lessonThemes } from "@/components/languages/lessonThemes";
import {
  UiLanguageProvider,
  useUiLanguage,
} from "@/contexts/UiLanguageContext";

import { lessons as koreanB2 } from "@/languages/korean/lessons-b2";
import { lessons as japaneseB2 } from "@/languages/japanese/lessons-b2";
import { lessons as chineseC1 } from "@/languages/chinese/lessons-c1";
import { normalizeKoreanLesson } from "@/languages/korean/normalize";
import { normalizeJapaneseLesson } from "@/languages/japanese/normalize";
import { normalizeChineseLesson } from "@/languages/chinese/normalize";

type Probe = { vi: string; en: string };

// Find a gloss field rendered through pick() (so exactly one language
// shows) with distinct, non-empty vi + en values.
function findProbe(n: NormalizedLesson): Probe | null {
  const pairs: Array<[unknown, unknown]> = [
    [n.registerNotesVi, n.registerNotesEn],
    [n.culturalNotesVi, n.culturalNotesEn],
    [n.tipAdviceVi, n.tipAdviceEn],
  ];
  for (const [vi, en] of pairs) {
    if (
      typeof vi === "string" &&
      typeof en === "string" &&
      vi.trim().length > 12 &&
      en.trim().length > 12 &&
      vi !== en
    ) {
      return { vi, en };
    }
  }
  return null;
}

function firstLessonWithProbe<T>(
  raw: readonly T[],
  normalize: (l: T) => NormalizedLesson,
): { lesson: NormalizedLesson; probe: Probe } {
  for (const l of raw) {
    let n: NormalizedLesson;
    try {
      n = normalize(l);
    } catch {
      continue;
    }
    const probe = findProbe(n);
    if (probe) return { lesson: n, probe };
  }
  throw new Error("no bilingual probe lesson found in fixture");
}

function expand(container: HTMLElement) {
  // LessonRenderer is collapsed by default; the section content
  // (register/cultural/tip) only mounts once expanded.
  const btn = container.querySelector<HTMLButtonElement>(
    "button[aria-expanded]",
  );
  if (!btn) throw new Error("expand button not found");
  fireEvent.click(btn);
}

const SLICE = 40;

const CASES = [
  {
    name: "Korean (B2)",
    ...firstLessonWithProbe(koreanB2, normalizeKoreanLesson),
    theme: lessonThemes.korean,
  },
  {
    name: "Japanese (B2)",
    ...firstLessonWithProbe(japaneseB2, normalizeJapaneseLesson),
    theme: lessonThemes.japanese,
  },
  {
    name: "Chinese (C1)",
    ...firstLessonWithProbe(chineseC1, normalizeChineseLesson),
    theme: lessonThemes.chinese,
  },
];

beforeEach(() => {
  cleanup();
});

describe("LessonRenderer uiLanguage gloss switching (smoke)", () => {
  for (const c of CASES) {
    const viSlice = c.probe.vi.slice(0, SLICE);
    const enSlice = c.probe.en.slice(0, SLICE);

    it(`${c.name}: default renders Vietnamese gloss, not English`, () => {
      // No uiLanguage prop → defaults to "vi" (existing behavior).
      const { container } = render(
        <LessonRenderer lesson={c.lesson} theme={c.theme} />,
      );
      expand(container);
      const text = container.textContent ?? "";
      expect(text).toContain(viSlice);
      expect(text).not.toContain(enSlice);
    });

    it(`${c.name}: uiLanguage="en" renders the authored English gloss`, () => {
      const { container } = render(
        <LessonRenderer
          lesson={c.lesson}
          theme={c.theme}
          uiLanguage="en"
        />,
      );
      expand(container);
      const text = container.textContent ?? "";
      expect(text).toContain(enSlice);
      expect(text).not.toContain(viSlice);
    });
  }
});

// ── UiLanguageProvider: default + synchronous seed (no flash) ────────

function LangProbe() {
  const { uiLang, setUiLang } = useUiLanguage();
  return (
    <button onClick={() => setUiLang("en")} data-testid="lang">
      {uiLang}
    </button>
  );
}

describe("UiLanguageProvider", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("defaults to vi when nothing is stored", () => {
    const { getByTestId } = render(
      <UiLanguageProvider>
        <LangProbe />
      </UiLanguageProvider>,
    );
    expect(getByTestId("lang").textContent).toBe("vi");
  });

  it("reflects a stored 'en' on the very first render (no vi→en flash)", () => {
    window.localStorage.setItem("mercyblade.lessonUiLang", "en");
    const { getByTestId } = render(
      <UiLanguageProvider>
        <LangProbe />
      </UiLanguageProvider>,
    );
    // Lazy useState initializer reads localStorage synchronously, so the
    // first committed render is already "en".
    expect(getByTestId("lang").textContent).toBe("en");
  });

  it("persists setUiLang to localStorage", () => {
    const { getByTestId } = render(
      <UiLanguageProvider>
        <LangProbe />
      </UiLanguageProvider>,
    );
    fireEvent.click(getByTestId("lang"));
    expect(getByTestId("lang").textContent).toBe("en");
    expect(window.localStorage.getItem("mercyblade.lessonUiLang")).toBe(
      "en",
    );
  });
});
