import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  MbColorModeProvider,
  useMbColorMode,
} from "@/contexts/MbColorModeContext";

const STORAGE_KEY = "mb_color_mode";

function wrapper({ children }: { children: ReactNode }) {
  return <MbColorModeProvider>{children}</MbColorModeProvider>;
}

describe("MbColorModeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.mbMode;
  });

  it("throws when useMbColorMode is used outside the provider", () => {
    expect(() => renderHook(() => useMbColorMode())).toThrow(
      /must be used inside MbColorModeProvider/,
    );
  });

  it("defaults to rainbow and reflects it on <html data-mb-mode>", () => {
    const { result } = renderHook(() => useMbColorMode(), { wrapper });
    expect(result.current.mode).toBe("rainbow");
    expect(document.documentElement.dataset.mbMode).toBe("rainbow");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("rainbow");
  });

  it("hydrates a valid persisted mode on mount", () => {
    localStorage.setItem(STORAGE_KEY, "bw");
    const { result } = renderHook(() => useMbColorMode(), { wrapper });
    expect(result.current.mode).toBe("bw");
    expect(document.documentElement.dataset.mbMode).toBe("bw");
  });

  it("ignores an invalid persisted mode and stays rainbow", () => {
    localStorage.setItem(STORAGE_KEY, "neon");
    const { result } = renderHook(() => useMbColorMode(), { wrapper });
    expect(result.current.mode).toBe("rainbow");
  });

  it("toggle flips between rainbow and bw", () => {
    const { result } = renderHook(() => useMbColorMode(), { wrapper });

    act(() => result.current.toggle());
    expect(result.current.mode).toBe("bw");
    expect(document.documentElement.dataset.mbMode).toBe("bw");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("bw");

    act(() => result.current.toggle());
    expect(result.current.mode).toBe("rainbow");
    expect(document.documentElement.dataset.mbMode).toBe("rainbow");
  });

  it("setMode sets an explicit mode and persists it", () => {
    const { result } = renderHook(() => useMbColorMode(), { wrapper });

    act(() => result.current.setMode("bw"));
    expect(result.current.mode).toBe("bw");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("bw");
  });
});
