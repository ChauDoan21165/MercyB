/**
 * Stage 4 (L4) — store tests.
 *
 * localStorage round-trip + TTL expiry for the suggestion buffer, the
 * pure ≤1-per-session cap (Q7=A), and that dismissal honors Stage 3B's
 * deterministic dismissed-id set (Q4=A) rather than a private one.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  __STAGE3B_KEYS_FOR_TESTS,
  getDismissedSuggestionIds,
} from "@/lib/stage-3b/suggestionState";

import {
  __STAGE4_KEYS_FOR_TESTS,
  applySessionCap,
  claimSessionOwner,
  dismissStage4Suggestion,
  readSessionOwnerId,
  readStage4Gate,
  readStoredStage4Suggestion,
  writeStoredStage4Suggestion,
} from "../store";
import type { Stage4Suggestion } from "../types";

const { SUGGESTION_KEY, SESSION_OWNER_KEY } = __STAGE4_KEYS_FOR_TESTS;
const { DISABLED_KEY, DISMISSED_KEY } = __STAGE3B_KEYS_FOR_TESTS;

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
  window.localStorage.removeItem(SUGGESTION_KEY);
  window.localStorage.removeItem(DISABLED_KEY);
  window.localStorage.removeItem(DISMISSED_KEY);
  window.sessionStorage.removeItem(SESSION_OWNER_KEY);
}

beforeEach(reset);
afterEach(reset);

describe("suggestion buffer round-trip + TTL", () => {
  it("round-trips a written suggestion", () => {
    const s = makeSuggestion();
    writeStoredStage4Suggestion(s);
    expect(readStoredStage4Suggestion(NOW)).toEqual(s);
  });

  it("clears the buffer when written null", () => {
    writeStoredStage4Suggestion(makeSuggestion());
    writeStoredStage4Suggestion(null);
    expect(readStoredStage4Suggestion(NOW)).toBeNull();
  });

  it("returns null and clears storage when the TTL has expired", () => {
    const s = makeSuggestion({ generatedAt: NOW, ttlMs: 1000 });
    writeStoredStage4Suggestion(s);
    expect(readStoredStage4Suggestion(NOW + 1001)).toBeNull();
    expect(window.localStorage.getItem(SUGGESTION_KEY)).toBeNull();
  });

  it("still returns a suggestion exactly at the TTL boundary minus one", () => {
    const s = makeSuggestion({ generatedAt: NOW, ttlMs: 1000 });
    writeStoredStage4Suggestion(s);
    expect(readStoredStage4Suggestion(NOW + 999)).toEqual(s);
  });

  it("returns null on corrupted JSON without throwing", () => {
    window.localStorage.setItem(SUGGESTION_KEY, "{not json");
    expect(readStoredStage4Suggestion(NOW)).toBeNull();
  });

  it("returns null on a structurally-invalid blob", () => {
    window.localStorage.setItem(SUGGESTION_KEY, JSON.stringify({ id: 1 }));
    expect(readStoredStage4Suggestion(NOW)).toBeNull();
  });
});

describe("session cap (Q7=A)", () => {
  it("an unclaimed slot surfaces the candidate and reports the claim id", () => {
    const s = makeSuggestion();
    expect(applySessionCap(s, null)).toEqual({ surfaced: s, claimId: s.id });
  });

  it("the same suggestion refreshing surfaces and does not re-claim", () => {
    const s = makeSuggestion();
    expect(applySessionCap(s, s.id)).toEqual({ surfaced: s, claimId: null });
  });

  it("a DIFFERENT suggestion is suppressed once the slot is owned", () => {
    const s = makeSuggestion({ id: "stage4:other" });
    expect(applySessionCap(s, "stage4:vi_l1_past_ed")).toEqual({
      surfaced: null,
      claimId: null,
    });
  });

  it("null candidate surfaces nothing", () => {
    expect(applySessionCap(null, null)).toEqual({ surfaced: null, claimId: null });
  });

  it("claimSessionOwner persists to sessionStorage and reads back", () => {
    expect(readSessionOwnerId()).toBeNull();
    claimSessionOwner("stage4:vi_l1_past_ed");
    expect(readSessionOwnerId()).toBe("stage4:vi_l1_past_ed");
  });
});

describe("dismiss honors Stage 3B's dismissed-id set (Q4=A)", () => {
  it("writes the id into the shared Stage 3B set and clears the buffer", () => {
    const s = makeSuggestion();
    writeStoredStage4Suggestion(s);
    dismissStage4Suggestion(s.id);
    expect(getDismissedSuggestionIds().has(s.id)).toBe(true);
    expect(readStoredStage4Suggestion(NOW)).toBeNull();
  });
});

describe("readStage4Gate", () => {
  it("reflects the Stage 3B disable flag and dismissed set", () => {
    const gate = readStage4Gate();
    expect(gate.disabled).toBe(false);
    expect(gate.dismissedIds.size).toBe(0);
  });
});
