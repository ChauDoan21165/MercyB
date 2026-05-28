import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  DEFAULT_PARENT_LOCALE,
  persistParentLocale,
  resolveParentLocale,
} from "../parentLocale";

const KEY = "mb.l6.parent.locale";

describe("resolveParentLocale (Q2=C — detect at signup, VI fallback)", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("defaults to Vietnamese", () => {
    expect(DEFAULT_PARENT_LOCALE).toBe("vi");
  });

  it("honors an explicit override outright", () => {
    expect(resolveParentLocale("en")).toBe("en");
    expect(resolveParentLocale("en-US")).toBe("en");
    expect(resolveParentLocale("vi")).toBe("vi");
  });

  it("falls back to VI for any non-English override", () => {
    expect(resolveParentLocale("fr-CA")).not.toBe("en");
  });

  it("prefers a persisted signup-detected locale over the browser", () => {
    persistParentLocale("en");
    expect(localStorage.getItem(KEY)).toBe("en");
    expect(resolveParentLocale()).toBe("en");
  });

  it("detects English from the browser when nothing is stored", () => {
    vi.spyOn(navigator, "language", "get").mockReturnValue("en-GB");
    expect(resolveParentLocale()).toBe("en");
  });

  it("resolves a non-English browser locale to VI (non-negotiable #1)", () => {
    vi.spyOn(navigator, "language", "get").mockReturnValue("fr-FR");
    expect(resolveParentLocale()).toBe("vi");
  });

  it("ignores invalid locales on persist", () => {
    persistParentLocale("zz");
    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
