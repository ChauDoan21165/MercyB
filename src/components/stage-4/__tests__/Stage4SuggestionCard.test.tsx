// @vitest-environment jsdom
//
// Stage4SuggestionCard — pure presentation. Asserts:
//   - VI + EN copy renders (composed from the structured reason, Q5=B)
//     with per-side lang attrs (WCAG 3.1.2).
//   - Dismiss control is always visible, ARIA-labelled, and invokes
//     onDismiss with the suggestion id (Q4=A wiring lives in the caller).

import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { composeStage4Reason } from "../composeStage4Reason";
import Stage4SuggestionCard from "../Stage4SuggestionCard";
import type { Stage4Suggestion } from "@/lib/stage-4/types";

beforeEach(() => {
  cleanup();
});

function makeSuggestion(
  overrides: Partial<Stage4Suggestion> = {},
): Stage4Suggestion {
  return {
    id: "stage4:vi_l1_past_ed",
    ruleId: "vn-past-tense-marker",
    triggerReason: { kind: "repeated_l1_pattern", tag: "vi_l1_past_ed", count: 3 },
    targetAction: { kind: "review_l1_pattern", tag: "vi_l1_past_ed" },
    ttlMs: 7 * 24 * 60 * 60 * 1000,
    generatedAt: 1_700_000_000_000,
    ...overrides,
  };
}

describe("Stage4SuggestionCard", () => {
  it("renders composed VI/EN copy with per-side lang attrs", () => {
    const s = makeSuggestion();
    const text = composeStage4Reason(s.triggerReason);
    render(<Stage4SuggestionCard suggestion={s} onDismiss={() => {}} />);

    const vi = screen.getByText(text.vi);
    const en = screen.getByText(text.en);
    expect(vi.getAttribute("lang")).toBe("vi");
    expect(en.getAttribute("lang")).toBe("en");
  });

  it("exposes the suggestion and rule ids as data attributes", () => {
    render(<Stage4SuggestionCard suggestion={makeSuggestion()} onDismiss={() => {}} />);
    const card = screen.getByTestId("stage4-suggestion-card");
    expect(card.getAttribute("data-suggestion-id")).toBe("stage4:vi_l1_past_ed");
    expect(card.getAttribute("data-rule-id")).toBe("vn-past-tense-marker");
  });

  it("invokes onDismiss with the suggestion id when dismissed", () => {
    const onDismiss = vi.fn();
    render(<Stage4SuggestionCard suggestion={makeSuggestion()} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByTestId("stage4-suggestion-dismiss"));
    expect(onDismiss).toHaveBeenCalledWith("stage4:vi_l1_past_ed");
  });
});
