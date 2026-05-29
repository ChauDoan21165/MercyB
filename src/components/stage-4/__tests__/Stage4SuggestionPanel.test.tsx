// @vitest-environment jsdom
//
// Stage4SuggestionPanel — unit. Verifies the L4 → Stage 3B adapter and
// that a buffered L4 suggestion routes through SuggestionPanel with
// composed VI/EN copy, and that dismiss persists via Stage 3B's set
// (Q4=A).

import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { getDismissedSuggestionIds } from "@/lib/stage-3b/suggestionState";
import { writeStoredStage4Suggestion } from "@/lib/stage-4/store";
import type { Stage4Suggestion } from "@/lib/stage-4/types";
import type { L1WeaknessTag } from "@/lib/feedback/l1-error-detector";

import { composeStage4Reason } from "../composeStage4Reason";
import Stage4SuggestionPanel, {
  toStage3BSuggestion,
} from "../Stage4SuggestionPanel";

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

describe("toStage3BSuggestion", () => {
  it("adapts an L4 suggestion into the Stage 3B shape with composed copy", () => {
    const s = makeSuggestion();
    const adapted = toStage3BSuggestion(s);
    expect(adapted.id).toBe(s.id);
    expect(adapted.triggerReason).toEqual(s.triggerReason);
    expect(adapted.targetAction).toEqual(s.targetAction);
    expect(adapted.dismissible).toBe(true);
    expect(adapted.suggestionText).toEqual(composeStage4Reason(s.triggerReason));
  });
});

describe("Stage4SuggestionPanel", () => {
  it("renders the buffered L4 suggestion through SuggestionPanel with composed VI/EN copy", () => {
    writeStoredStage4Suggestion(makeSuggestion());
    const text = composeStage4Reason(makeSuggestion().triggerReason);

    render(<Stage4SuggestionPanel now={NOW} />);

    expect(screen.getByTestId("suggestion-panel")).toBeTruthy();
    expect(screen.getByText(text.vi).getAttribute("lang")).toBe("vi");
    expect(screen.getByText(text.en).getAttribute("lang")).toBe("en");
  });

  it("renders nothing when the buffer is empty", () => {
    const { container } = render(<Stage4SuggestionPanel now={NOW} />);
    expect(container.firstChild).toBeNull();
  });

  it.each([
    ["article", "vi_l1_missing_article"],
    ["plural", "vi_l1_plural_s"],
    ["subject-verb agreement", "vi_l1_3rd_person_s"],
    ["preposition", "vi_l1_preposition_transfer"],
    ["past tense", "vi_l1_past_ed"],
  ] as const)(
    "renders %s L1 output through the shared SuggestionPanel card",
    (_label, tag) => {
      const suggestion = makeSuggestion({
        id: `stage4:${tag}`,
        triggerReason: {
          kind: "repeated_l1_pattern",
          tag: tag as L1WeaknessTag,
          count: 3,
        },
        targetAction: {
          kind: "review_l1_pattern",
          tag: tag as L1WeaknessTag,
        },
      });
      const text = composeStage4Reason(suggestion.triggerReason);
      writeStoredStage4Suggestion(suggestion);

      render(<Stage4SuggestionPanel now={NOW} />);

      const card = screen.getByTestId("suggestion-card");
      expect(card.getAttribute("data-suggestion-id")).toBe(`stage4:${tag}`);
      expect(screen.getByText(text.vi).getAttribute("lang")).toBe("vi");
      expect(screen.getByText(text.en).getAttribute("lang")).toBe("en");
    },
  );

  it("dismiss drops the card AND persists the id in Stage 3B's set (Q4=A)", () => {
    writeStoredStage4Suggestion(makeSuggestion());
    render(<Stage4SuggestionPanel now={NOW} />);

    fireEvent.click(screen.getByTestId("suggestion-dismiss"));

    expect(screen.queryByTestId("suggestion-card")).toBeNull();
    expect(getDismissedSuggestionIds().has("stage4:vi_l1_past_ed")).toBe(true);
  });
});
