// src/components/languages/__tests__/singleLanguageRender.smoke.test.tsx
//
// Single-language display guard (uilang-single-language campaign).
//
// Requirement: when uiLanguage is set, the lesson card shows ONLY that
// language's title — the other-language line is hidden. Users who want
// the other language switch modes via the global toggle. This was
// previously a simultaneous bilingual render (title.vi + title.en),
// inconsistent with the toggle's promise.
//
// What MUST be preserved (NOT UI-language duplication):
//   - title.native     (e.g. Chinese characters) — the target language
//   - title.romanization (e.g. pinyin)           — a pronunciation aid
// These always show regardless of uiLanguage.
//
// The Vietnamese-for-foreigners page passes dualTitle (its title.vi is
// an English title, title.en an English subtitle — both the learner's
// language, not a UI duplicate); that path keeps both lines.
//
// Probes are derived from real lesson data at runtime so the test does
// not hard-code content and stays green as the campaign evolves.

import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

import { LessonRenderer } from "@/components/languages/LessonRenderer";
import type { NormalizedLesson } from "@/components/languages/LessonRenderer.types";
import { lessonThemes } from "@/components/languages/lessonThemes";

import { lessons as japaneseB2 } from "@/languages/japanese/lessons-b2";
import { lessons as chineseC1 } from "@/languages/chinese/lessons-c1";
import { normalizeJapaneseLesson } from "@/languages/japanese/normalize";
import { normalizeChineseLesson } from "@/languages/chinese/normalize";

// First lesson whose normalized title.vi and title.en genuinely differ
// (post-#522 these are the authored bilingual titles).
function firstBilingualTitle(
  raw: readonly unknown[],
  normalize: (l: never) => NormalizedLesson,
): NormalizedLesson {
  for (const l of raw) {
    const n = normalize(l as never);
    if (n.title.vi && n.title.en && n.title.vi !== n.title.en) return n;
  }
  throw new Error("no lesson with distinct title.vi/title.en found");
}

const jaLesson = firstBilingualTitle(japaneseB2, normalizeJapaneseLesson);
// A Chinese lesson carries native (汉字) + romanization (pinyin) on the
// title — those must survive regardless of uiLanguage.
const zhLesson = (() => {
  for (const l of chineseC1) {
    const n = normalizeChineseLesson(l as never);
    if (n.title.native && n.title.romanization) return n;
  }
  throw new Error("no Chinese lesson with native + romanization found");
})();

beforeEach(() => cleanup());

describe("LessonRenderer — single-language title", () => {
  it("VI mode: shows title.vi only, hides title.en", () => {
    const { container } = render(
      <LessonRenderer
        lesson={jaLesson}
        theme={lessonThemes.japanese}
        uiLanguage="vi"
      />,
    );
    const text = container.textContent ?? "";
    expect(text).toContain(jaLesson.title.vi);
    expect(text).not.toContain(jaLesson.title.en);
  });

  it("EN mode: shows title.en only, hides title.vi", () => {
    const { container } = render(
      <LessonRenderer
        lesson={jaLesson}
        theme={lessonThemes.japanese}
        uiLanguage="en"
      />,
    );
    const text = container.textContent ?? "";
    expect(text).toContain(jaLesson.title.en);
    expect(text).not.toContain(jaLesson.title.vi);
  });

  it("dualTitle: shows BOTH (Vietnamese-for-foreigners guard)", () => {
    const { container } = render(
      <LessonRenderer
        lesson={jaLesson}
        theme={lessonThemes.japanese}
        uiLanguage="vi"
        dualTitle
      />,
    );
    const text = container.textContent ?? "";
    expect(text).toContain(jaLesson.title.vi);
    expect(text).toContain(jaLesson.title.en);
  });
});

describe("LessonRenderer — target language + aids preserved", () => {
  for (const ui of ["vi", "en"] as const) {
    it(`${ui} mode: native script + romanization always shown`, () => {
      const { container } = render(
        <LessonRenderer
          lesson={zhLesson}
          theme={lessonThemes.chinese}
          uiLanguage={ui}
        />,
      );
      const text = container.textContent ?? "";
      expect(text).toContain(zhLesson.title.native!);
      expect(text).toContain(zhLesson.title.romanization!);
    });
  }
});
