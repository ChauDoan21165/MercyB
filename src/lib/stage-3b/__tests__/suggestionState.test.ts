/**
 * Stage 3B — suggestionState localStorage round-trip tests.
 *
 * Mirrors the resilience contract of the Stage 3A adapter tests:
 * verifies the disabled flag + dismissed set persist correctly,
 * tolerate corrupted JSON, and never throw on a denied/absent
 * storage backend.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  __STAGE3B_KEYS_FOR_TESTS,
  clearDismissedSuggestions,
  dismissSuggestion,
  getDismissedSuggestionIds,
  isSuggestionsDisabled,
  setSuggestionsDisabled,
} from "../suggestionState";

const { DISABLED_KEY, DISMISSED_KEY } = __STAGE3B_KEYS_FOR_TESTS;

function resetStorage() {
  window.localStorage.removeItem(DISABLED_KEY);
  window.localStorage.removeItem(DISMISSED_KEY);
}

describe("suggestionState — disabled flag", () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it("returns false when the key is absent", () => {
    expect(isSuggestionsDisabled()).toBe(false);
  });

  it("round-trips a true value through setSuggestionsDisabled", () => {
    setSuggestionsDisabled(true);
    expect(isSuggestionsDisabled()).toBe(true);
    expect(window.localStorage.getItem(DISABLED_KEY)).toBe("1");
  });

  it("removes the key when disabled is set back to false", () => {
    setSuggestionsDisabled(true);
    setSuggestionsDisabled(false);
    expect(isSuggestionsDisabled()).toBe(false);
    expect(window.localStorage.getItem(DISABLED_KEY)).toBeNull();
  });

  it("treats any non-'1' value as not-disabled", () => {
    window.localStorage.setItem(DISABLED_KEY, "true");
    expect(isSuggestionsDisabled()).toBe(false);
  });
});

describe("suggestionState — dismissed set", () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it("returns an empty set when the key is absent", () => {
    expect(getDismissedSuggestionIds().size).toBe(0);
  });

  it("adds an id and reads it back", () => {
    dismissSuggestion("stage3b:l1:vi_l1_3rd_person_s");
    const set = getDismissedSuggestionIds();
    expect(set.has("stage3b:l1:vi_l1_3rd_person_s")).toBe(true);
    expect(set.size).toBe(1);
  });

  it("does not duplicate when the same id is dismissed twice", () => {
    dismissSuggestion("stage3b:l1:vi_l1_3rd_person_s");
    dismissSuggestion("stage3b:l1:vi_l1_3rd_person_s");
    expect(getDismissedSuggestionIds().size).toBe(1);
  });

  it("accumulates multiple distinct ids", () => {
    dismissSuggestion("stage3b:l1:a");
    dismissSuggestion("stage3b:phoneme:TH_T");
    dismissSuggestion("stage3b:placement:b");
    expect(getDismissedSuggestionIds().size).toBe(3);
  });

  it("clearDismissedSuggestions empties the set", () => {
    dismissSuggestion("stage3b:l1:a");
    dismissSuggestion("stage3b:l1:b");
    clearDismissedSuggestions();
    expect(getDismissedSuggestionIds().size).toBe(0);
    expect(window.localStorage.getItem(DISMISSED_KEY)).toBeNull();
  });

  it("ignores an empty-string id (defensive)", () => {
    dismissSuggestion("");
    expect(getDismissedSuggestionIds().size).toBe(0);
  });
});

describe("suggestionState — tolerates corrupted storage", () => {
  beforeEach(resetStorage);
  afterEach(resetStorage);

  it("returns an empty set when DISMISSED_KEY contains invalid JSON", () => {
    window.localStorage.setItem(DISMISSED_KEY, "{not json");
    expect(getDismissedSuggestionIds().size).toBe(0);
  });

  it("returns an empty set when DISMISSED_KEY contains a non-array value", () => {
    window.localStorage.setItem(DISMISSED_KEY, JSON.stringify({ x: 1 }));
    expect(getDismissedSuggestionIds().size).toBe(0);
  });

  it("filters out non-string entries inside the array", () => {
    window.localStorage.setItem(
      DISMISSED_KEY,
      JSON.stringify(["valid", 42, null, "", "also-valid"]),
    );
    const set = getDismissedSuggestionIds();
    expect(set.size).toBe(2);
    expect(set.has("valid")).toBe(true);
    expect(set.has("also-valid")).toBe(true);
  });
});

describe("suggestionState — tolerates denied storage", () => {
  it("does not throw when localStorage.getItem rejects (private mode)", () => {
    const original = window.localStorage.getItem.bind(window.localStorage);
    window.localStorage.getItem = () => {
      throw new Error("denied");
    };
    try {
      expect(isSuggestionsDisabled()).toBe(false);
      expect(getDismissedSuggestionIds().size).toBe(0);
    } finally {
      window.localStorage.getItem = original;
    }
  });

  it("does not throw when localStorage.setItem rejects (quota)", () => {
    const original = window.localStorage.setItem.bind(window.localStorage);
    window.localStorage.setItem = () => {
      throw new Error("quota");
    };
    try {
      // Both writers must swallow the error silently.
      expect(() => setSuggestionsDisabled(true)).not.toThrow();
      expect(() => dismissSuggestion("stage3b:l1:a")).not.toThrow();
    } finally {
      window.localStorage.setItem = original;
    }
  });

  it("does not throw when localStorage.removeItem rejects", () => {
    const original = window.localStorage.removeItem.bind(window.localStorage);
    window.localStorage.removeItem = () => {
      throw new Error("denied");
    };
    try {
      expect(() => setSuggestionsDisabled(false)).not.toThrow();
      expect(() => clearDismissedSuggestions()).not.toThrow();
    } finally {
      window.localStorage.removeItem = original;
    }
  });

  it("returns defaults and no-ops when localStorage is unavailable", () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: undefined,
    });
    try {
      expect(isSuggestionsDisabled()).toBe(false);
      expect(getDismissedSuggestionIds().size).toBe(0);
      expect(() => setSuggestionsDisabled(true)).not.toThrow();
      expect(() => dismissSuggestion("stage3b:l1:a")).not.toThrow();
      expect(() => clearDismissedSuggestions()).not.toThrow();
    } finally {
      if (descriptor) Object.defineProperty(window, "localStorage", descriptor);
    }
  });

  it("returns defaults and no-ops when window is absent", () => {
    const originalWindow = window;
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: undefined,
    });
    try {
      expect(isSuggestionsDisabled()).toBe(false);
      expect(getDismissedSuggestionIds().size).toBe(0);
      expect(() => setSuggestionsDisabled(true)).not.toThrow();
      expect(() => dismissSuggestion("stage3b:l1:a")).not.toThrow();
      expect(() => clearDismissedSuggestions()).not.toThrow();
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, "window", descriptor);
      } else {
        Object.defineProperty(globalThis, "window", {
          configurable: true,
          value: originalWindow,
        });
      }
    }
  });

  it("returns defaults and no-ops when accessing localStorage throws", () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });
    try {
      expect(isSuggestionsDisabled()).toBe(false);
      expect(getDismissedSuggestionIds().size).toBe(0);
      expect(() => setSuggestionsDisabled(true)).not.toThrow();
      expect(() => dismissSuggestion("stage3b:l1:a")).not.toThrow();
      expect(() => clearDismissedSuggestions()).not.toThrow();
    } finally {
      if (descriptor) Object.defineProperty(window, "localStorage", descriptor);
    }
  });
});
