// @vitest-environment jsdom
//
// SuggestionsDisableToggle — global suggestions-off switch. Asserts:
//   - Initial checked state mirrors isSuggestionsDisabled().
//   - Toggling on calls setSuggestionsDisabled(true) — verified by
//     reading back through the public API on the next tick.
//   - Toggling off calls setSuggestionsDisabled(false).
//   - The optional onChange callback fires with the new value.
//   - The label copy is bilingual VI-primary with per-side lang attrs.

import React from "react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import SuggestionsDisableToggle from "../SuggestionsDisableToggle";
import {
  isSuggestionsDisabled,
  setSuggestionsDisabled,
  __STAGE3B_KEYS_FOR_TESTS,
} from "@/lib/stage-3b/suggestionState";

beforeEach(() => {
  cleanup();
  setSuggestionsDisabled(false);
  try {
    window.localStorage.removeItem(__STAGE3B_KEYS_FOR_TESTS.DISABLED_KEY);
  } catch {
    /* noop */
  }
});

describe("SuggestionsDisableToggle", () => {
  it("starts unchecked when isSuggestionsDisabled is false", () => {
    render(<SuggestionsDisableToggle />);
    const input = screen.getByTestId(
      "suggestions-disable-toggle-input",
    ) as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it("starts checked when isSuggestionsDisabled is true", () => {
    setSuggestionsDisabled(true);
    render(<SuggestionsDisableToggle />);
    const input = screen.getByTestId(
      "suggestions-disable-toggle-input",
    ) as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("clicking the toggle persists the new value through the state API", () => {
    render(<SuggestionsDisableToggle />);
    const input = screen.getByTestId(
      "suggestions-disable-toggle-input",
    ) as HTMLInputElement;

    fireEvent.click(input);
    expect(input.checked).toBe(true);
    expect(isSuggestionsDisabled()).toBe(true);

    fireEvent.click(input);
    expect(input.checked).toBe(false);
    expect(isSuggestionsDisabled()).toBe(false);
  });

  it("fires the optional onChange callback with the new value", () => {
    const onChange = vi.fn();
    render(<SuggestionsDisableToggle onChange={onChange} />);
    fireEvent.click(
      screen.getByTestId("suggestions-disable-toggle-input"),
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);

    fireEvent.click(
      screen.getByTestId("suggestions-disable-toggle-input"),
    );
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("renders bilingual VI-primary label with per-side lang attrs", () => {
    render(<SuggestionsDisableToggle />);
    const vi = screen.getByText("Tắt gợi ý từ Mercy");
    const en = screen.getByText("Turn off Mercy's suggestions");
    expect(vi.getAttribute("lang")).toBe("vi");
    expect(en.getAttribute("lang")).toBe("en");
  });
});
