// Regression guard for the screen-reader bug: `<html lang>` must track
// the active UI language so VI chrome/lessons aren't pronounced with an
// English voice. Before the fix, index.html's static `lang="en"`
// survived a VI toggle for the whole interactive app.

import { render, act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  UiLanguageProvider,
  useUiLanguage,
} from "@/contexts/UiLanguageContext";

const STORAGE_KEY = "mercyblade.lessonUiLang";

function Toggle() {
  const { uiLang, setUiLang } = useUiLanguage();
  return (
    <button onClick={() => setUiLang(uiLang === "vi" ? "en" : "vi")}>
      {uiLang}
    </button>
  );
}

describe("UiLanguageProvider — document lang sync", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("lang");
  });

  it("sets <html lang> to the default 'vi' on mount", () => {
    render(
      <UiLanguageProvider>
        <Toggle />
      </UiLanguageProvider>,
    );
    expect(document.documentElement.lang).toBe("vi");
  });

  it("seeds <html lang> from a stored 'en' choice (no vi flash)", () => {
    window.localStorage.setItem(STORAGE_KEY, "en");
    render(
      <UiLanguageProvider>
        <Toggle />
      </UiLanguageProvider>,
    );
    expect(document.documentElement.lang).toBe("en");
  });

  it("flips <html lang> reactively when the UI language toggles", () => {
    const { getByRole } = render(
      <UiLanguageProvider>
        <Toggle />
      </UiLanguageProvider>,
    );
    expect(document.documentElement.lang).toBe("vi");

    act(() => {
      getByRole("button").click();
    });
    expect(document.documentElement.lang).toBe("en");

    act(() => {
      getByRole("button").click();
    });
    expect(document.documentElement.lang).toBe("vi");
  });
});
