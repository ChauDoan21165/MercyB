// @vitest-environment jsdom
//
// SuggestionCard — pure presentation. Asserts:
//   - VI + EN copy renders with per-side lang attrs (WCAG 3.1.2).
//   - Dismiss control is always visible and ARIA-labelled.
//   - Clicking dismiss invokes the onDismiss callback with the
//     suggestion id.
//   - The chrome this component adds carries no streak / XP / shame /
//     daily-requirement framing (engine guarantees the suggestion text
//     itself; this test guards the wrapper-added copy).

import React from "react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import SuggestionCard from "../SuggestionCard";
import type { Suggestion } from "@/lib/stage-3b/suggestionEngine";

beforeEach(() => {
  cleanup();
});

function makeSuggestion(overrides: Partial<Suggestion> = {}): Suggestion {
  return {
    id: "stage3b:l1:vi_l1_3rd_person_s",
    triggerReason: {
      kind: "repeated_l1_pattern",
      tag: "vi_l1_3rd_person_s",
      count: 3,
    },
    suggestionText: {
      vi: 'Mercy thấy em vẫn đang luyện "ngôi thứ ba số ít — thêm s". Thử thêm một chút nhé?',
      en: 'Mercy noticed you\'re still working on "third-person singular -s". Want to try a bit more?',
    },
    targetAction: { kind: "review_l1_pattern", tag: "vi_l1_3rd_person_s" },
    dismissible: true,
    ...overrides,
  };
}

describe("SuggestionCard", () => {
  it("renders the VI and EN suggestion text with per-side lang attrs", () => {
    const s = makeSuggestion();
    render(<SuggestionCard suggestion={s} onDismiss={() => {}} />);

    const vi = screen.getByText(s.suggestionText.vi);
    const en = screen.getByText(s.suggestionText.en);
    expect(vi.getAttribute("lang")).toBe("vi");
    expect(en.getAttribute("lang")).toBe("en");
  });

  it("always shows a dismiss control with an ARIA label", () => {
    render(
      <SuggestionCard suggestion={makeSuggestion()} onDismiss={() => {}} />,
    );
    const btn = screen.getByTestId("suggestion-dismiss");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("aria-label")).toMatch(/dismiss/i);
  });

  it("invokes onDismiss with the suggestion id on click", () => {
    const onDismiss = vi.fn();
    const s = makeSuggestion({ id: "stage3b:phoneme:TH_T" });
    render(<SuggestionCard suggestion={s} onDismiss={onDismiss} />);

    fireEvent.click(screen.getByTestId("suggestion-dismiss"));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith("stage3b:phoneme:TH_T");
  });

  it("renders the suggestion id as a data attribute for downstream wiring", () => {
    const s = makeSuggestion({ id: "stage3b:placement:th_stopping_and_fronting" });
    render(<SuggestionCard suggestion={s} onDismiss={() => {}} />);
    const card = screen.getByTestId("suggestion-card");
    expect(card.getAttribute("data-suggestion-id")).toBe(
      "stage3b:placement:th_stopping_and_fronting",
    );
  });

  it("does NOT add streak / XP / shame / daily-requirement framing in the wrapper chrome", () => {
    // The engine guarantees the suggestion text passes FORBIDDEN_PHRASES.
    // This test guards the chrome this component ADDS on top of that.
    const s = makeSuggestion({
      // Deliberately bland inner text so any forbidden hit comes from chrome.
      suggestionText: { vi: "vi-payload", en: "en-payload" },
    });
    const { container } = render(
      <SuggestionCard suggestion={s} onDismiss={() => {}} />,
    );
    const text = container.textContent?.toLowerCase() ?? "";
    const forbidden = [
      "streak",
      "chuỗi",
      "xp",
      "điểm kinh nghiệm",
      "you must",
      "bạn phải",
      "em phải",
      "don't miss",
      "đừng bỏ lỡ",
      "you failed",
      "thất bại",
      "every day",
      "mỗi ngày",
    ];
    for (const phrase of forbidden) {
      expect(text).not.toContain(phrase);
    }
  });
});
