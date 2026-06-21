// src/components/__tests__/LessonUiLangToggle.hardening.test.tsx
//
// Hardening tests for the shared VI/EN lesson-explanation toggle.
//
// Covers both exports of src/components/LessonUiLangToggle.tsx:
//   - default `LessonUiLangToggle` (controlled presentational button group)
//   - `useLessonUiLang` (thin shim over the UiLanguageContext)
//
// The component's only "external dependency" is the app-wide
// UiLanguageProvider context (no supabase/fetch). We exercise the hook
// against the real provider so persistence + reactivity are verified
// end-to-end, and we mock localStorage failures via the canonical
// in-memory storage mock installed in src/test/setup.ts.

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
} from "@testing-library/react";
import type { ReactNode } from "react";

import LessonUiLangToggle, {
  useLessonUiLang,
} from "@/components/LessonUiLangToggle";
import {
  UiLanguageProvider,
  type UiLanguage,
} from "@/contexts/UiLanguageContext";
// Type-only import of the public `LessonUiLang` union to assert that the
// component contract still aligns with the shared lesson type.
import type { LessonUiLang } from "@/components/mercy-guide/tabs/LanguageLessonsView";

const STORAGE_KEY = "mercyblade.lessonUiLang";

function wrapper({ children }: { children: ReactNode }) {
  return <UiLanguageProvider>{children}</UiLanguageProvider>;
}

beforeEach(() => {
  // setup.ts resets storage between tests, but be explicit so these
  // tests are self-contained and deterministic.
  window.localStorage.clear();
});

describe("LessonUiLangToggle — presentational component", () => {
  it("renders a labelled group with both VI and EN buttons", () => {
    render(<LessonUiLangToggle value="vi" onChange={() => {}} />);

    const group = screen.getByRole("group", { name: "Ngôn ngữ giải thích" });
    expect(group).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "VI" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
  });

  it('marks the VI button pressed when value is "vi"', () => {
    render(<LessonUiLangToggle value="vi" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: "VI" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it('marks the EN button pressed when value is "en"', () => {
    render(<LessonUiLangToggle value="en" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "VI" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("applies the active styling to the selected button only", () => {
    const { rerender } = render(
      <LessonUiLangToggle value="vi" onChange={() => {}} />,
    );

    const vi = screen.getByRole("button", { name: "VI" });
    const en = screen.getByRole("button", { name: "EN" });
    expect(vi.className).toContain("bg-slate-900");
    expect(en.className).not.toContain("bg-slate-900");

    rerender(<LessonUiLangToggle value="en" onChange={() => {}} />);
    expect(en.className).toContain("bg-slate-900");
    expect(vi.className).not.toContain("bg-slate-900");
  });

  it("buttons are type=button so they never submit a surrounding form", () => {
    render(<LessonUiLangToggle value="vi" onChange={() => {}} />);
    for (const name of ["VI", "EN"]) {
      expect(screen.getByRole("button", { name })).toHaveAttribute(
        "type",
        "button",
      );
    }
  });

  it('calls onChange("vi") when VI is clicked', () => {
    const onChange = vi.fn();
    render(<LessonUiLangToggle value="en" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "VI" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("vi");
  });

  it('calls onChange("en") when EN is clicked', () => {
    const onChange = vi.fn();
    render(<LessonUiLangToggle value="vi" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("en");
  });

  it("fires onChange even when clicking the already-active language (idempotent re-selection)", () => {
    const onChange = vi.fn();
    render(<LessonUiLangToggle value="vi" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "VI" }));
    expect(onChange).toHaveBeenCalledWith("vi");
  });

  it("fires a distinct onChange per click across repeated toggles", () => {
    const onChange = vi.fn();
    render(<LessonUiLangToggle value="vi" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    fireEvent.click(screen.getByRole("button", { name: "VI" }));
    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange.mock.calls.map((c) => c[0])).toEqual(["en", "vi", "en"]);
  });

  it("is a controlled component: clicking does not change its own rendered state without a value update", () => {
    const onChange = vi.fn();
    render(<LessonUiLangToggle value="vi" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    // value prop unchanged → VI still the pressed button.
    expect(screen.getByRole("button", { name: "VI" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("type contract: the component value accepts the shared LessonUiLang union", () => {
    // Compile-time guard surfaced as a runtime assertion. If LessonUiLang
    // ever diverges from "vi" | "en" this stops type-checking.
    const values: LessonUiLang[] = ["vi", "en"];
    expect(values).toEqual(["vi", "en"]);
  });
});

describe("useLessonUiLang — context shim", () => {
  it("throws a clear error when used outside UiLanguageProvider", () => {
    // Suppress React's error boundary noise for the expected throw.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useLessonUiLang())).toThrow(
      "useUiLanguage must be used inside UiLanguageProvider",
    );
    spy.mockRestore();
  });

  it('defaults to "vi" with no stored value', () => {
    const { result } = renderHook(() => useLessonUiLang(), { wrapper });
    expect(result.current[0]).toBe("vi");
  });

  it('hydrates "en" from a pre-existing localStorage value', () => {
    window.localStorage.setItem(STORAGE_KEY, "en");
    const { result } = renderHook(() => useLessonUiLang(), { wrapper });
    expect(result.current[0]).toBe("en");
  });

  it('falls back to "vi" for an unrecognized stored value', () => {
    window.localStorage.setItem(STORAGE_KEY, "fr");
    const { result } = renderHook(() => useLessonUiLang(), { wrapper });
    expect(result.current[0]).toBe("vi");
  });

  it("returns a tuple [lang, setLang] matching the original hook signature", () => {
    const { result } = renderHook(() => useLessonUiLang(), { wrapper });
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(2);
    expect(typeof result.current[1]).toBe("function");
  });

  it("setLang updates the returned language reactively", () => {
    const { result } = renderHook(() => useLessonUiLang(), { wrapper });

    act(() => result.current[1]("en"));
    expect(result.current[0]).toBe("en");

    act(() => result.current[1]("vi"));
    expect(result.current[0]).toBe("vi");
  });

  it("setLang persists the choice to localStorage", () => {
    const { result } = renderHook(() => useLessonUiLang(), { wrapper });

    act(() => result.current[1]("en"));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("en");

    act(() => result.current[1]("vi"));
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("vi");
  });

  it("does not throw when localStorage.setItem fails (private mode / quota)", () => {
    const setItem = vi
      .spyOn(window.localStorage, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

    const { result } = renderHook(() => useLessonUiLang(), { wrapper });

    expect(() => act(() => result.current[1]("en"))).not.toThrow();
    // In-memory state still advances even though persistence failed.
    expect(result.current[0]).toBe("en");

    setItem.mockRestore();
  });

  it('hydrates "vi" when localStorage.getItem throws on read', () => {
    const getItem = vi
      .spyOn(window.localStorage, "getItem")
      .mockImplementation(() => {
        throw new DOMException("SecurityError");
      });

    const { result } = renderHook(() => useLessonUiLang(), { wrapper });
    expect(result.current[0]).toBe("vi");

    getItem.mockRestore();
  });
});

describe("LessonUiLangToggle wired to useLessonUiLang", () => {
  function Harness() {
    const [lang, setLang] = useLessonUiLang();
    return (
      <div>
        <span data-testid="active">{lang}</span>
        <LessonUiLangToggle value={lang} onChange={setLang} />
      </div>
    );
  }

  it("drives context state and persistence through real UI clicks", () => {
    render(<Harness />, { wrapper });

    expect(screen.getByTestId("active")).toHaveTextContent("vi");

    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByTestId("active")).toHaveTextContent("en");
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("en");

    fireEvent.click(screen.getByRole("button", { name: "VI" }));
    expect(screen.getByTestId("active")).toHaveTextContent("vi");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("vi");
  });

  it("reflects cross-tab updates pushed via the storage event", () => {
    render(<Harness />, { wrapper });
    expect(screen.getByTestId("active")).toHaveTextContent("vi");

    act(() => {
      window.localStorage.setItem(STORAGE_KEY, "en");
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: "en",
        }),
      );
    });

    expect(screen.getByTestId("active")).toHaveTextContent("en");
  });

  it("ignores storage events for unrelated keys", () => {
    render(<Harness />, { wrapper });

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "some.other.key",
          newValue: "en",
        }),
      );
    });

    expect(screen.getByTestId("active")).toHaveTextContent("vi");
  });

  it("keeps document.documentElement.lang in sync with the active language", () => {
    render(<Harness />, { wrapper });
    expect(document.documentElement.lang).toBe("vi");

    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(document.documentElement.lang).toBe("en");
  });
});

describe("UiLanguage type guard", () => {
  it("UiLanguage and LessonUiLang describe the same vi|en union", () => {
    const ui: UiLanguage[] = ["vi", "en"];
    const lesson: LessonUiLang[] = ui;
    expect(lesson).toEqual(["vi", "en"]);
  });
});
