import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import {
  LowDataModeProvider,
  useLowDataMode,
} from "@/contexts/LowDataModeContext";

const LOW_DATA_MODE_KEY = "low-data-mode";

function wrapper({ children }: { children: ReactNode }) {
  return <LowDataModeProvider>{children}</LowDataModeProvider>;
}

describe("LowDataModeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("low-data-mode");
  });

  it("throws when useLowDataMode is used outside the provider", () => {
    expect(() => renderHook(() => useLowDataMode())).toThrow(
      /must be used within LowDataModeProvider/,
    );
  });

  it("defaults to false when nothing is persisted", () => {
    const { result } = renderHook(() => useLowDataMode(), { wrapper });
    expect(result.current.isLowDataMode).toBe(false);
  });

  it("seeds initial state from localStorage='true'", () => {
    localStorage.setItem(LOW_DATA_MODE_KEY, "true");
    const { result } = renderHook(() => useLowDataMode(), { wrapper });
    expect(result.current.isLowDataMode).toBe(true);
  });

  it("toggles state and persists the new value to localStorage", () => {
    const { result } = renderHook(() => useLowDataMode(), { wrapper });

    act(() => result.current.toggleLowDataMode());
    expect(result.current.isLowDataMode).toBe(true);
    expect(localStorage.getItem(LOW_DATA_MODE_KEY)).toBe("true");

    act(() => result.current.toggleLowDataMode());
    expect(result.current.isLowDataMode).toBe(false);
    expect(localStorage.getItem(LOW_DATA_MODE_KEY)).toBe("false");
  });

  it("adds/removes the low-data-mode class on <html> when toggled", () => {
    const { result } = renderHook(() => useLowDataMode(), { wrapper });
    expect(
      document.documentElement.classList.contains("low-data-mode"),
    ).toBe(false);

    act(() => result.current.toggleLowDataMode());
    expect(
      document.documentElement.classList.contains("low-data-mode"),
    ).toBe(true);

    act(() => result.current.toggleLowDataMode());
    expect(
      document.documentElement.classList.contains("low-data-mode"),
    ).toBe(false);
  });
});
