// src/languages/__tests__/normalizeTitle.test.ts
//
// Phase 1 plumbing guard (lesson-titles-vi campaign).
//
// Japanese + Chinese normalizers now read the authored bilingual
// `title_vi` / `title_en` fields and fall back to the legacy single
// field when they are absent. This test pins that behaviour so the
// ~200 already-authored-but-previously-dark B2/C1/C2 lessons stay lit
// and the A1/A2/B1 lessons keep their English fallback until authored.
//
// Probes are derived from real lesson data at runtime (a lesson that
// HAS the bilingual field, and one that does NOT), so the test does
// not hard-code content and stays green as the campaign authors more
// titles.

import { describe, it, expect } from "vitest";

import { lessons as japaneseA1 } from "@/languages/japanese/lessons-a1";
import { lessons as japaneseB2 } from "@/languages/japanese/lessons-b2";
import { lessons as chineseA1 } from "@/languages/chinese/lessons-a1";
import { lessons as chineseC1 } from "@/languages/chinese/lessons-c1";
import { normalizeJapaneseLesson } from "@/languages/japanese/normalize";
import { normalizeChineseLesson } from "@/languages/chinese/normalize";

describe("Japanese normalizer — title_vi/title_en pass-through", () => {
  it("surfaces authored title_vi/title_en when present", () => {
    const lesson = japaneseB2.find((l) => l.title_vi && l.title_en);
    expect(
      lesson,
      "expected at least one Japanese B2 lesson with authored bilingual title",
    ).toBeTruthy();

    const n = normalizeJapaneseLesson(lesson!);
    expect(n.title.vi).toBe(lesson!.title_vi);
    expect(n.title.en).toBe(lesson!.title_en);
  });

  it("falls back to the legacy `title` when bilingual fields are absent", () => {
    const lesson = japaneseA1.find((l) => !l.title_vi && !l.title_en);
    expect(
      lesson,
      "expected at least one Japanese A1 lesson without bilingual title",
    ).toBeTruthy();

    const n = normalizeJapaneseLesson(lesson!);
    expect(n.title.vi).toBe(lesson!.title);
    expect(n.title.en).toBe(lesson!.title);
  });
});

describe("Chinese normalizer — title_vi/title_en pass-through", () => {
  it("surfaces authored title_vi/title_en and preserves native/romanization", () => {
    const lesson = chineseC1.find((l) => l.title_vi && l.title_en);
    expect(
      lesson,
      "expected at least one Chinese C1 lesson with authored bilingual title",
    ).toBeTruthy();

    const n = normalizeChineseLesson(lesson!);
    expect(n.title.vi).toBe(lesson!.title_vi);
    expect(n.title.en).toBe(lesson!.title_en);
    // The Chinese-script title + pinyin must remain on the native line.
    expect(n.title.native).toBe(lesson!.title);
    expect(n.title.romanization).toBe(lesson!.pinyin);
  });

  it("falls back to the English `topic` when bilingual fields are absent", () => {
    const lesson = chineseA1.find((l) => !l.title_vi && !l.title_en);
    expect(
      lesson,
      "expected at least one Chinese A1 lesson without bilingual title",
    ).toBeTruthy();

    const n = normalizeChineseLesson(lesson!);
    expect(n.title.vi).toBe(lesson!.topic);
    expect(n.title.en).toBe(lesson!.topic);
    expect(n.title.native).toBe(lesson!.title);
    expect(n.title.romanization).toBe(lesson!.pinyin);
  });
});
