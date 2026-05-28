// @vitest-environment jsdom
//
// useStage4Suggestion — consumer hook tests.
//
// Asserts the hook reads the persisted buffer (it does NOT re-evaluate
// rules — Q9=B), applies the ≤1-per-session cap (Q7=A), honors TTL
// expiry, and dismisses permanently through Stage 3B's set (Q4=A).

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, renderHook } from "@testing-library/react";

import { getDismissedSuggestionIds } from "@/lib/stage-3b/suggestionState";
import {
  claimSessionOwner,
  writeStoredStage4Suggestion,
} from "@/lib/stage-4/store";
import type { Stage4Suggestion } from "@/lib/stage-4/types";

import { useStage4Suggestion } from "../useStage4Suggestion";

const NOW = 1_700_000_000_000;

function makeSuggestion(
  overrides: Partial<Stage4Suggestion> = {},
): Stage4Suggestion {
  return {
    id: "stage4:vi_l1_past_ed",
    ruleId: "vn-past-tense-marker",
    triggerReason: { kind: "repeated_l1_pattern", tag: "vi_l1_past_ed", count: 3 },
    targetAction: { kind: "review_l1_pattern", tag: "vi_l1_past_ed" },
    ttlMs: 7 * 24 * 60 * 60 * 1000,
    generatedAt: NOW,
    ...overrides,
  };
}

function reset() {
  window.localStorage.clear();
  window.sessionStorage.clear();
}

beforeEach(reset);
afterEach(() => {
  cleanup();
  reset();
});

describe("useStage4Suggestion", () => {
  it("surfaces the stored suggestion and claims the session slot", () => {
    writeStoredStage4Suggestion(makeSuggestion());
    const { result } = renderHook(() => useStage4Suggestion({ now: NOW }));
    expect(result.current.suggestion?.id).toBe("stage4:vi_l1_past_ed");
  });

  it("returns null when the buffer is empty", () => {
    const { result } = renderHook(() => useStage4Suggestion({ now: NOW }));
    expect(result.current.suggestion).toBeNull();
  });

  it("suppresses a different suggestion when the session slot is owned (Q7=A)", () => {
    claimSessionOwner("stage4:something-else");
    writeStoredStage4Suggestion(makeSuggestion());
    const { result } = renderHook(() => useStage4Suggestion({ now: NOW }));
    expect(result.current.suggestion).toBeNull();
  });

  it("does not surface a TTL-expired suggestion", () => {
    writeStoredStage4Suggestion(makeSuggestion({ generatedAt: NOW, ttlMs: 1 }));
    const { result } = renderHook(() =>
      useStage4Suggestion({ now: NOW + 1000 }),
    );
    expect(result.current.suggestion).toBeNull();
  });

  it("dismiss permanently records the id in Stage 3B's set and drops the card (Q4=A)", () => {
    writeStoredStage4Suggestion(makeSuggestion());
    const { result } = renderHook(() => useStage4Suggestion({ now: NOW }));
    act(() => {
      result.current.dismiss("stage4:vi_l1_past_ed");
    });
    expect(result.current.suggestion).toBeNull();
    expect(getDismissedSuggestionIds().has("stage4:vi_l1_past_ed")).toBe(true);
  });
});
