// src/components/mercy-guide/tabs/__tests__/LanguageLessonsView.test.tsx
//
// Guards the #523 single-language rule and the vocab-gloss fallback for
// the Mercy-guide French/German lessons view. Before this fix the
// category count badge prepended the *inactive*-language title (VI text
// while in EN mode, and vice-versa), and the side-panel vocab VI gloss
// had no EN fallback (the lone asymmetric bilingual pick in the file).
//
// LanguageLessonsView is rendered only by GermanLessonsTab /
// FrenchLessonsTab; both feed a LanguageLessonsConfig, so the view is
// exercised here directly with a synthetic config — no per-language
// loaders or network.

import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import type { NormalizedLesson } from "@/components/languages/LessonRenderer.types";
import LanguageLessonsView, {
  type LanguageLessonsConfig,
} from "../LanguageLessonsView";

// `category` is read off the lesson via a structural cast in the view
// (it is not on NormalizedLesson); mirror that here in the fixture.
function lesson(
  id: number,
  category: string,
  titleVi: string,
  titleEn: string,
): NormalizedLesson {
  return {
    id,
    level: "A1",
    title: { vi: titleVi, en: titleEn },
    sentences: [{ native: "Bonjour", vi: "Xin chào", en: "Hello" }],
    category,
  } as unknown as NormalizedLesson;
}

function makeConfig(
  lessons: NormalizedLesson[],
  vocab: LanguageLessonsConfig["vocab"] = [],
): LanguageLessonsConfig {
  return {
    label: "French",
    labelVi: "Tiếng Pháp",
    flag: "🇫🇷",
    accent: "blue",
    vocab,
    categories: [
      { id: "greetings", title_vi: "Chào hỏi", title_en: "Greetings" },
    ],
    loadLessonsForLevel: async () => lessons,
  };
}

describe("LanguageLessonsView — #523 single-language category badge", () => {
  it("EN mode shows only the EN category title + count (no VI title)", async () => {
    render(
      <LanguageLessonsView
        config={makeConfig([
          lesson(1, "greetings", "Bài 1", "Lesson 1"),
          lesson(2, "greetings", "Bài 2", "Lesson 2"),
        ])}
        uiLang="en"
      />,
    );

    expect(
      await screen.findByRole("heading", { level: 3, name: "Greetings" }),
    ).toBeInTheDocument();
    // Count only, EN units, NO Vietnamese category title leaking in.
    expect(screen.getByText("2 lessons")).toBeInTheDocument();
    expect(screen.queryByText(/Chào hỏi/)).not.toBeInTheDocument();
  });

  it("VI mode shows only the VI category title + count (no EN title)", async () => {
    render(
      <LanguageLessonsView
        config={makeConfig([
          lesson(1, "greetings", "Bài 1", "Lesson 1"),
          lesson(2, "greetings", "Bài 2", "Lesson 2"),
        ])}
        uiLang="vi"
      />,
    );

    expect(
      await screen.findByRole("heading", { level: 3, name: "Chào hỏi" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2 bài")).toBeInTheDocument();
    expect(screen.queryByText(/Greetings/)).not.toBeInTheDocument();
  });

  it("singular vs plural count units (EN)", async () => {
    render(
      <LanguageLessonsView
        config={makeConfig([lesson(1, "greetings", "Bài 1", "Lesson 1")])}
        uiLang="en"
      />,
    );
    expect(await screen.findByText("1 lesson")).toBeInTheDocument();
  });
});

describe("LanguageLessonsView — vocab gloss fallback", () => {
  it("VI gloss falls back to EN when entry.vi is missing", async () => {
    render(
      <LanguageLessonsView
        config={makeConfig(
          [lesson(1, "greetings", "Bài 1", "Lesson 1")],
          [
            { word: "bonjour", vi: "xin chào", en: "hello" },
            // vi intentionally absent → must fall back to en ("thanks")
            { word: "merci", vi: undefined as unknown as string, en: "thanks" },
          ],
        )}
        uiLang="vi"
      />,
    );

    const toggle = await screen.findByRole("button", {
      name: /50 từ vựng/,
    });
    fireEvent.click(toggle);

    expect(screen.getByText("merci")).toBeInTheDocument();
    expect(screen.getByText("thanks")).toBeInTheDocument(); // EN fallback
    expect(screen.getByText("xin chào")).toBeInTheDocument(); // VI when present
  });

  it("EN gloss still falls back to VI when entry.en is missing (regression guard)", async () => {
    render(
      <LanguageLessonsView
        config={makeConfig(
          [lesson(1, "greetings", "Bài 1", "Lesson 1")],
          [{ word: "au revoir", vi: "tạm biệt" }],
        )}
        uiLang="en"
      />,
    );

    const toggle = await screen.findByRole("button", {
      name: /50 vocab words/,
    });
    fireEvent.click(toggle);

    expect(screen.getByText("au revoir")).toBeInTheDocument();
    expect(screen.getByText("tạm biệt")).toBeInTheDocument(); // VI fallback
  });
});
