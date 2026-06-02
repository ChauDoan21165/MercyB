import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  LanguageProgressProvider,
  useLanguageProgress,
  TOTAL_LESSONS_PER_LANGUAGE,
} from "@/store/languageProgress";

const LS_COMPLETED = "mb.completedLessons";
const LS_SELECTED = "mb.selectedLearningLanguage";

function wrapper({ children }: { children: ReactNode }) {
  return <LanguageProgressProvider>{children}</LanguageProgressProvider>;
}

function setup() {
  return renderHook(() => useLanguageProgress(), { wrapper });
}

describe("languageProgress store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("throws when the hook is used outside the provider", () => {
    expect(() => renderHook(() => useLanguageProgress())).toThrow(
      /must be used within <LanguageProgressProvider>/,
    );
  });

  it("starts with no selected language and empty progress", () => {
    const { result } = setup();
    expect(result.current.selectedLanguage).toBeNull();
    expect(result.current.getCompletedCount("korean")).toBe(0);
    expect(result.current.getProgressPercent("korean")).toBe(0);
    expect(result.current.isLessonCompleted("korean", 1)).toBe(false);
  });

  it("selectLanguage updates state and persists the selection", () => {
    const { result } = setup();
    act(() => result.current.selectLanguage("japanese"));
    expect(result.current.selectedLanguage).toBe("japanese");
    expect(localStorage.getItem(LS_SELECTED)).toBe("japanese");
  });

  it("hydrates the selected language from localStorage", () => {
    localStorage.setItem(LS_SELECTED, "chinese");
    const { result } = setup();
    expect(result.current.selectedLanguage).toBe("chinese");
  });

  it("ignores an invalid persisted selection", () => {
    localStorage.setItem(LS_SELECTED, "klingon");
    const { result } = setup();
    expect(result.current.selectedLanguage).toBeNull();
  });

  it("toggleLesson marks a lesson complete and persists it", () => {
    const { result } = setup();
    act(() => result.current.toggleLesson("korean", 3));

    expect(result.current.isLessonCompleted("korean", 3)).toBe(true);
    expect(result.current.getCompletedCount("korean")).toBe(1);

    const saved = JSON.parse(localStorage.getItem(LS_COMPLETED)!);
    expect(saved.korean).toEqual([3]);
  });

  it("toggleLesson un-marks an already-completed lesson", () => {
    const { result } = setup();
    act(() => result.current.toggleLesson("korean", 3));
    act(() => result.current.toggleLesson("korean", 3));

    expect(result.current.isLessonCompleted("korean", 3)).toBe(false);
    expect(result.current.getCompletedCount("korean")).toBe(0);
  });

  it("keeps completed ids sorted ascending", () => {
    const { result } = setup();
    act(() => result.current.toggleLesson("korean", 5));
    act(() => result.current.toggleLesson("korean", 2));
    act(() => result.current.toggleLesson("korean", 9));

    const saved = JSON.parse(localStorage.getItem(LS_COMPLETED)!);
    expect(saved.korean).toEqual([2, 5, 9]);
  });

  it("ignores lesson ids out of the 1..N range", () => {
    const { result } = setup();
    act(() => result.current.toggleLesson("korean", 0));
    act(() =>
      result.current.toggleLesson("korean", TOTAL_LESSONS_PER_LANGUAGE + 1),
    );
    expect(result.current.getCompletedCount("korean")).toBe(0);
  });

  it("getProgressPercent rounds count/total to a percentage", () => {
    const { result } = setup();
    act(() => result.current.toggleLesson("korean", 1));
    // 1 / 50 = 2%
    expect(result.current.getProgressPercent("korean")).toBe(2);
  });

  it("hydrates and validates completed lessons from localStorage", () => {
    localStorage.setItem(
      LS_COMPLETED,
      JSON.stringify({ korean: [1, 2, 999, "x"] }),
    );
    const { result } = setup();
    // 999 and "x" are dropped by validateIds
    expect(result.current.getCompletedCount("korean")).toBe(2);
    expect(result.current.isLessonCompleted("korean", 1)).toBe(true);
    expect(result.current.isLessonCompleted("korean", 999)).toBe(false);
  });

  it("tracks progress independently per language", () => {
    const { result } = setup();
    act(() => result.current.toggleLesson("korean", 1));
    act(() => result.current.toggleLesson("japanese", 2));

    expect(result.current.getCompletedCount("korean")).toBe(1);
    expect(result.current.getCompletedCount("japanese")).toBe(1);
    expect(result.current.isLessonCompleted("korean", 2)).toBe(false);
  });
});
