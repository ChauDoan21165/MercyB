// Reactive chrome-language hooks: useChromeLanguage + useChromeT, driven
// through NativeLanguageProvider. (The pure pickChrome selector is
// covered separately in chromeLanguage.test.ts — these tests add the
// provider-reactive + persistence coverage.)
//
// SINGLE-LANGUAGE-UI RULE: the VI/EN axis renders ONLY the active
// language string — never both side by side. These tests prove a
// consuming component renders exactly one language and re-renders to the
// new one when the native language switches.

import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  useChromeLanguage,
  useChromeT,
} from "@/lib/i18n/chromeLanguage";
import {
  NativeLanguageProvider,
  useNativeLanguage,
} from "@/contexts/NativeLanguageContext";

// NativeLanguageContext hydrates from the profile via useAuth +
// useProfileQuery; stub both so no auth/query/Supabase wiring is needed
// and the provider falls back to the localStorage cache / default.
vi.mock("@/providers/AuthProvider", () => ({
  useAuth: () => ({ user: null }),
}));
vi.mock("@/lib/queries/useProfileQuery", () => ({
  useProfileQuery: () => ({ data: null }),
}));

const STORAGE_KEY = "mercyblade.nativeLang";

function ChromeLabel() {
  const lang = useChromeLanguage();
  const t = useChromeT();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="label">{t({ vi: "Trang chủ", en: "Home" })}</span>
    </div>
  );
}

function Switcher() {
  const { setNativeLang } = useNativeLanguage();
  return (
    <>
      <ChromeLabel />
      <button onClick={() => setNativeLang("en")}>to-en</button>
      <button onClick={() => setNativeLang("vi")}>to-vi</button>
    </>
  );
}

describe("useChromeLanguage / useChromeT — reactive to native choice", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to 'vi' and renders the VI chrome string only", () => {
    render(
      <NativeLanguageProvider>
        <ChromeLabel />
      </NativeLanguageProvider>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("vi");
    expect(screen.getByTestId("label")).toHaveTextContent("Trang chủ");
    expect(screen.getByTestId("label")).not.toHaveTextContent("Home");
  });

  it("seeds from a stored 'en' native choice (no vi flash)", () => {
    window.localStorage.setItem(STORAGE_KEY, "en");
    render(
      <NativeLanguageProvider>
        <ChromeLabel />
      </NativeLanguageProvider>,
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("label")).toHaveTextContent("Home");
    expect(screen.getByTestId("label")).not.toHaveTextContent("Trang chủ");
  });

  it("re-renders consuming chrome to the new language on switch", () => {
    render(
      <NativeLanguageProvider>
        <Switcher />
      </NativeLanguageProvider>,
    );
    expect(screen.getByTestId("label")).toHaveTextContent("Trang chủ");

    act(() => {
      screen.getByText("to-en").click();
    });
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("label")).toHaveTextContent("Home");
    expect(screen.getByTestId("label")).not.toHaveTextContent("Trang chủ");

    act(() => {
      screen.getByText("to-vi").click();
    });
    expect(screen.getByTestId("lang")).toHaveTextContent("vi");
    expect(screen.getByTestId("label")).toHaveTextContent("Trang chủ");
  });

  it("persists the switched choice to localStorage", () => {
    render(
      <NativeLanguageProvider>
        <Switcher />
      </NativeLanguageProvider>,
    );
    act(() => {
      screen.getByText("to-en").click();
    });
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("en");
  });
});
