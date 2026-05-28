// @vitest-environment jsdom
//
// Stage 4 (L4) → Stage 3B — end-to-end wiring integration.
//
// Exercises the exact pipeline GrammarWritingTab wires: a placement
// snapshot flags past tense, then the L1 detector's `recordL1Tag` fires
// (the same call GrammarWritingTab makes after each analysis). The
// signal-change recompute (Q9=B) updates L4's buffer, and the mounted
// Stage4SuggestionPanel — routing through Stage 3B's SuggestionPanel —
// renders the past-tense suggestion as a dismissible card with the
// composed VI/EN copy. Dismissing it persists via Stage 3B's set (Q4=A)
// and a further signal does not re-surface it.

import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

import { recordL1Tag } from "@/lib/stage-3a/adapters/l1TagAdapter";
import { recordPlacementSnapshot } from "@/lib/stage-3a/adapters/placementSnapshotAdapter";
import { getDismissedSuggestionIds } from "@/lib/stage-3b/suggestionState";
import {
  PAST_TENSE_INTERVENTION_MIN_COUNT,
  PAST_TENSE_L1_TAG,
  PAST_TENSE_PLACEMENT_TAG,
} from "@/lib/stage-4/rules";

import { composeStage4Reason } from "../composeStage4Reason";
import Stage4SuggestionPanel from "../Stage4SuggestionPanel";

function reset() {
  window.localStorage.clear();
  window.sessionStorage.clear();
}

function seedPlacementPastTense() {
  recordPlacementSnapshot({
    cefr: "A2",
    weaknesses: [PAST_TENSE_PLACEMENT_TAG],
    completedAt: Date.now() - 1000,
    sessionId: "integration-session",
  });
}

/** Fire the past-tense L1 tag enough times to clear the threshold,
 *  wrapped in act() so the panel's signal-change state updates flush. */
function fireTriggeringSignal() {
  const base = Date.now();
  act(() => {
    for (let i = 0; i < PAST_TENSE_INTERVENTION_MIN_COUNT; i += 1) {
      recordL1Tag(PAST_TENSE_L1_TAG, base - i * 60_000);
    }
  });
}

const EXPECTED = composeStage4Reason({
  kind: "repeated_l1_pattern",
  tag: PAST_TENSE_L1_TAG,
  count: PAST_TENSE_INTERVENTION_MIN_COUNT,
});

beforeEach(reset);
afterEach(() => {
  cleanup();
  reset();
});

describe("L4 → Stage 3B wiring (integration)", () => {
  it("renders nothing before a triggering signal", () => {
    seedPlacementPastTense();
    const { container } = render(<Stage4SuggestionPanel />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the past-tense suggestion via SuggestionPanel once the L1 signal fires", () => {
    seedPlacementPastTense();
    render(<Stage4SuggestionPanel />);

    fireTriggeringSignal();

    expect(screen.getByTestId("suggestion-panel")).toBeTruthy();
    const card = screen.getByTestId("suggestion-card");
    expect(card.getAttribute("data-suggestion-id")).toBe(
      `stage4:${PAST_TENSE_L1_TAG}`,
    );
    // Correct VI/EN copy, composed from the structured reason (Q5=B).
    expect(screen.getByText(EXPECTED.vi).getAttribute("lang")).toBe("vi");
    expect(screen.getByText(EXPECTED.en).getAttribute("lang")).toBe("en");
  });

  it("does not fire without placement corroboration (Q6=A live+stale pair)", () => {
    // No placement snapshot — live L1 alone must not trigger.
    render(<Stage4SuggestionPanel />);
    fireTriggeringSignal();
    expect(screen.queryByTestId("suggestion-card")).toBeNull();
  });

  it("dismiss persists in Stage 3B's set and does not re-surface on a later signal (Q4=A)", () => {
    seedPlacementPastTense();
    render(<Stage4SuggestionPanel />);

    fireTriggeringSignal();
    expect(screen.getByTestId("suggestion-card")).toBeTruthy();

    fireEvent.click(screen.getByTestId("suggestion-dismiss"));
    expect(screen.queryByTestId("suggestion-card")).toBeNull();
    expect(getDismissedSuggestionIds().has(`stage4:${PAST_TENSE_L1_TAG}`)).toBe(
      true,
    );

    // A further triggering signal must NOT bring the dismissed card back.
    fireTriggeringSignal();
    expect(screen.queryByTestId("suggestion-card")).toBeNull();
  });
});
