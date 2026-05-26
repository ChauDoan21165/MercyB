// src/lib/tracking/__tests__/clarity.test.ts

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __clarityInitializedForTests,
  __resetClarityForTests,
  initClarity,
} from "../clarity";

beforeEach(() => {
  __resetClarityForTests();
  vi.unstubAllEnvs();
});

afterEach(() => {
  __resetClarityForTests();
  vi.unstubAllEnvs();
});

describe("Microsoft Clarity — env-gated load", () => {
  it("does NOT initialize when VITE_CLARITY_PROJECT_ID is empty", () => {
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", "");
    expect(initClarity()).toBe(false);
    expect(__clarityInitializedForTests()).toBe(false);
    expect(window.clarity).toBeUndefined();
    expect(document.querySelector('script[data-mb-clarity="1"]')).toBeNull();
  });

  it("does NOT initialize when env var is missing entirely", () => {
    expect(initClarity()).toBe(false);
    expect(window.clarity).toBeUndefined();
  });

  it("initializes and injects the Clarity tag when project ID is present", () => {
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", "abcd1234");
    expect(initClarity()).toBe(true);
    expect(__clarityInitializedForTests()).toBe(true);
    expect(typeof window.clarity).toBe("function");
    const script = document.querySelector(
      'script[data-mb-clarity="1"]',
    ) as HTMLScriptElement | null;
    expect(script?.src).toContain("clarity.ms/tag/");
    expect(script?.async).toBe(true);
  });

  it("queues calls on the window.clarity shim before the tag loads", () => {
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", "abcd1234");
    initClarity();
    expect(() => window.clarity?.("set", "k", "v")).not.toThrow();
  });

  it("is idempotent — calling twice does not duplicate the script tag", () => {
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", "abcd1234");
    initClarity();
    initClarity();
    expect(
      document.querySelectorAll('script[data-mb-clarity="1"]').length,
    ).toBe(1);
  });

  it("__resetClarityForTests clears state and removes the tag", () => {
    vi.stubEnv("VITE_CLARITY_PROJECT_ID", "abcd1234");
    initClarity();
    __resetClarityForTests();
    expect(__clarityInitializedForTests()).toBe(false);
    expect(window.clarity).toBeUndefined();
    expect(document.querySelector('script[data-mb-clarity="1"]')).toBeNull();
  });
});
