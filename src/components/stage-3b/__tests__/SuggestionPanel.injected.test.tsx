// @vitest-environment jsdom
//
// SuggestionPanel — injected mode (additive, for L4 wiring). Asserts the
// original derived-mode contract is untouched while the new
// `suggestion` + `onDismiss` props let an upstream producer route a
// ready suggestion through the same card chrome:
//   - Renders the injected suggestion's VI/EN text.
//   - Renders nothing when the injected suggestion is null.
//   - Dismiss delegates to the injected onDismiss (NOT the engine's
//     dismissSuggestion) and drops the card.

import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import SuggestionPanel from "../SuggestionPanel";
import type { Suggestion } from "@/lib/stage-3b/suggestionEngine";
import {
  clearDismissedSuggestions,
  getDismissedSuggestionIds,
  setSuggestionsDisabled,
} from "@/lib/stage-3b/suggestionState";

beforeEach(() => {
  cleanup();
  clearDismissedSuggestions();
  setSuggestionsDisabled(false);
});

function makeSuggestion(overrides: Partial<Suggestion> = {}): Suggestion {
  return {
    id: "stage4:vi_l1_past_ed",
    triggerReason: { kind: "repeated_l1_pattern", tag: "vi_l1_past_ed", count: 3 },
    suggestionText: {
      vi: "Câu tiếng Việt gợi ý",
      en: "English suggestion copy",
    },
    targetAction: { kind: "review_l1_pattern", tag: "vi_l1_past_ed" },
    dismissible: true,
    ...overrides,
  };
}

describe("SuggestionPanel — injected mode", () => {
  it("renders the injected suggestion's VI/EN text", () => {
    const s = makeSuggestion();
    render(<SuggestionPanel suggestion={s} onDismiss={() => {}} />);
    const card = screen.getByTestId("suggestion-card");
    expect(card.getAttribute("data-suggestion-id")).toBe("stage4:vi_l1_past_ed");
    expect(screen.getByText("Câu tiếng Việt gợi ý").getAttribute("lang")).toBe("vi");
    expect(screen.getByText("English suggestion copy").getAttribute("lang")).toBe("en");
  });

  it("renders nothing when the injected suggestion is null", () => {
    const { container } = render(
      <SuggestionPanel suggestion={null} onDismiss={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("delegates dismiss to the injected handler and drops the card", () => {
    const onDismiss = vi.fn();
    render(<SuggestionPanel suggestion={makeSuggestion()} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByTestId("suggestion-dismiss"));

    expect(onDismiss).toHaveBeenCalledWith("stage4:vi_l1_past_ed");
    expect(screen.queryByTestId("suggestion-card")).toBeNull();
    // Injected mode must NOT touch the engine's own dismissed set — the
    // producer owns persistence.
    expect(getDismissedSuggestionIds().has("stage4:vi_l1_past_ed")).toBe(false);
  });
});
