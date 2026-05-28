// @vitest-environment jsdom
//
// SuggestionPanel — live consumer of getSuggestion. Asserts:
//   - Renders SuggestionCard when the engine returns a suggestion.
//   - Renders NOTHING when the engine returns null (empty weaknesses,
//     globally disabled, already-dismissed).
//   - Clicking dismiss persists via dismissSuggestion() AND immediately
//     drops the card from the DOM.
//   - After dismiss, re-rendering with the same event/weaknesses does
//     NOT bring the card back (engine respects the persisted id).

import React from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import SuggestionPanel from "../SuggestionPanel";
import type { LocalWeaknessMap } from "@/lib/stage-3a/aggregator";
import type { ActivityEvent } from "@/lib/stage-3b/suggestionEngine";
import {
  clearDismissedSuggestions,
  setSuggestionsDisabled,
  getDismissedSuggestionIds,
  __STAGE3B_KEYS_FOR_TESTS,
} from "@/lib/stage-3b/suggestionState";

beforeEach(() => {
  cleanup();
  // Clean every Stage 3B key the engine reads. Belt-and-braces: clear
  // through the public API AND remove the raw keys in case jsdom's
  // localStorage persisted from a previous test file's setup.
  clearDismissedSuggestions();
  setSuggestionsDisabled(false);
  try {
    window.localStorage.removeItem(__STAGE3B_KEYS_FOR_TESTS.DISMISSED_KEY);
    window.localStorage.removeItem(__STAGE3B_KEYS_FOR_TESTS.DISABLED_KEY);
  } catch {
    /* noop */
  }
});

function l1OnlyWeaknesses(): LocalWeaknessMap {
  return {
    topL1Patterns: [
      { tag: "vi_l1_3rd_person_s", count: 4, lastSeen: Date.now() - 600_000 },
    ],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: false,
    generatedAt: Date.now(),
  };
}

function emptyWeaknesses(): LocalWeaknessMap {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: true,
    generatedAt: Date.now(),
  };
}

const lessonEvent: ActivityEvent = {
  kind: "lesson_completed",
  ts: Date.now(),
};

describe("SuggestionPanel", () => {
  it("renders a SuggestionCard when the engine returns a suggestion", () => {
    render(
      <SuggestionPanel event={lessonEvent} weaknesses={l1OnlyWeaknesses()} />,
    );
    expect(screen.getByTestId("suggestion-card")).toBeTruthy();
    expect(screen.getByTestId("suggestion-dismiss")).toBeTruthy();
  });

  it("renders nothing when the weakness map is empty", () => {
    const { container } = render(
      <SuggestionPanel event={lessonEvent} weaknesses={emptyWeaknesses()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when suggestions are globally disabled", () => {
    setSuggestionsDisabled(true);
    const { container } = render(
      <SuggestionPanel event={lessonEvent} weaknesses={l1OnlyWeaknesses()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("dismiss removes the card AND persists the id via the state API", () => {
    render(
      <SuggestionPanel event={lessonEvent} weaknesses={l1OnlyWeaknesses()} />,
    );
    const card = screen.getByTestId("suggestion-card");
    const id = card.getAttribute("data-suggestion-id");
    expect(id).toBeTruthy();

    fireEvent.click(screen.getByTestId("suggestion-dismiss"));

    expect(screen.queryByTestId("suggestion-card")).toBeNull();
    expect(getDismissedSuggestionIds().has(id ?? "")).toBe(true);
  });

  it("after dismiss, a fresh render with the same inputs does NOT bring the card back", () => {
    const weaknesses = l1OnlyWeaknesses();
    const { unmount } = render(
      <SuggestionPanel event={lessonEvent} weaknesses={weaknesses} />,
    );
    fireEvent.click(screen.getByTestId("suggestion-dismiss"));
    unmount();

    const { container } = render(
      <SuggestionPanel event={lessonEvent} weaknesses={weaknesses} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
