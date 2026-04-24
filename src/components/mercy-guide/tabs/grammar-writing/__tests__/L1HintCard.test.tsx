// src/components/mercy-guide/tabs/grammar-writing/__tests__/L1HintCard.test.tsx
//
// Unit tests for the L1 hint card. Exercises:
//   - Both EN + VI strings render when hint is populated.
//   - Short badge label comes from WEAKNESS_CATALOG for every known
//     detector tag, and falls back to a prettified identifier only
//     when the detector emits a tag the catalog doesn't have yet.
//   - renderInlineBold wires through — **word** segments become <strong>.
//   - Returns nothing for null / undefined / empty feedback.
//   - Learn more →:
//       * Active link navigates to /room/:linkedRoomId for tags whose
//         catalog entry has a roomId.
//       * Disabled "No lesson yet" state for tags without a catalog entry.
//       * Click fires l1_hint_learn_more_clicked analytics with the
//         expected payload.
//
// This component does NOT consume useFeatureFlag directly — the caller
// (GrammarWritingTab) gates rendering. So no flag mocking needed here.

import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const mockTrackEvent = vi.fn();
vi.mock("@/lib/analytics", () => ({
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

import L1HintCard from "../L1HintCard";
import type { L1HintPayload } from "../types";

function makeHint(
  overrides: Partial<L1HintPayload> & { feedback?: Partial<L1HintPayload["feedback"]> } = {},
): L1HintPayload {
  return {
    weaknessTag: overrides.weaknessTag ?? "vi_l1_3rd_person_s",
    feedback: {
      en:
        overrides.feedback?.en ??
        "In English, verbs change after **she**, **he**, or **it**.",
      vi:
        overrides.feedback?.vi ??
        "Trong tiếng Anh, động từ đi với **she** / **he** / **it** cần thêm **-s**.",
    },
  };
}

function renderCard(hint: L1HintPayload | null | undefined) {
  return render(
    <MemoryRouter initialEntries={["/grammar"]}>
      <Routes>
        <Route path="/grammar" element={<L1HintCard hint={hint} />} />
        <Route
          path="/room/:roomId"
          element={<div data-testid="room-route" />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  cleanup();
  mockTrackEvent.mockReset();
});

describe("L1HintCard", () => {
  it("renders both English and Vietnamese feedback when a hint is provided", () => {
    renderCard(makeHint());

    expect(screen.getByText(/In English, verbs change after/)).toBeDefined();
    expect(screen.getByText(/Trong tiếng Anh, động từ đi với/)).toBeDefined();
  });

  it("renders the 'Pattern noticed' framing label (warm, not alarming)", () => {
    renderCard(makeHint());
    expect(screen.getByText(/Pattern noticed/i)).toBeDefined();
  });

  it("uses the WEAKNESS_CATALOG short label when the tag is in the catalog", () => {
    renderCard(makeHint({ weaknessTag: "vi_l1_3rd_person_s" }));
    expect(screen.getByText(/Subject-verb agreement/)).toBeDefined();
    expect(screen.getByText(/Chia động từ theo chủ ngữ/)).toBeDefined();
  });

  it("uses the catalog short label for detector tags that live in the catalog", () => {
    // vi_l1_missing_be is now in WEAKNESS_CATALOG (post-expansion) and
    // should render the catalog's canonical EN + VI strings.
    renderCard(makeHint({ weaknessTag: "vi_l1_missing_be" }));
    expect(screen.getByText(/Missing "to be"/)).toBeDefined();
    expect(screen.getByText(/Thiếu động từ "to be"/)).toBeDefined();
  });

  it("falls back to a prettified tag identifier when the tag is fully unknown", () => {
    renderCard(makeHint({ weaknessTag: "vi_l1_some_new_pattern" }));
    const matches = screen.getAllByText(/some new pattern/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("wraps **bold** segments in <strong> via renderInlineBold", () => {
    const { container } = renderCard(makeHint());
    const html = container.innerHTML;
    expect(html).not.toContain("**she**");
    expect(html).toContain("<strong>she</strong>");
    expect(html).toContain("<strong>he</strong>");
  });

  it("renders nothing when hint is null", () => {
    const { container } = renderCard(null);
    // MemoryRouter renders the Routes wrapper; the matched route renders
    // L1HintCard, which returns null. Confirm the routes wrapper is empty
    // of card markup (no amber section).
    expect(container.querySelector('[aria-label="Vietnamese learner hint"]')).toBeNull();
  });

  it("renders nothing when hint is undefined", () => {
    const { container } = renderCard(undefined);
    expect(container.querySelector('[aria-label="Vietnamese learner hint"]')).toBeNull();
  });

  it("renders nothing when both feedback strings are empty", () => {
    const { container } = renderCard(
      makeHint({ feedback: { en: "", vi: "" } }),
    );
    expect(container.querySelector('[aria-label="Vietnamese learner hint"]')).toBeNull();
  });

  it("renders when only English feedback is present", () => {
    renderCard(makeHint({ feedback: { en: "English only hint.", vi: "" } }));
    expect(screen.getByText(/English only hint/)).toBeDefined();
  });

  it("renders when only Vietnamese feedback is present", () => {
    renderCard(makeHint({ feedback: { en: "", vi: "Chỉ có tiếng Việt." } }));
    expect(screen.getByText(/Chỉ có tiếng Việt/)).toBeDefined();
  });
});

describe("L1HintCard — Learn more navigation", () => {
  it("renders an active link for a tag whose catalog entry has a roomId", () => {
    renderCard(makeHint({ weaknessTag: "vi_l1_3rd_person_s" }));
    const link = screen.getByTestId("l1-hint-learn-more-link") as HTMLAnchorElement;
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/room/english_a1_a107");
    expect(link.textContent).toMatch(/Learn more/);
  });

  it("clicking the link navigates to /room/:linkedRoomId", () => {
    renderCard(makeHint({ weaknessTag: "vi_l1_past_ed" }));
    const link = screen.getByTestId("l1-hint-learn-more-link");
    fireEvent.click(link);
    expect(screen.getByTestId("room-route")).toBeDefined();
  });

  it("fires l1_hint_learn_more_clicked with {tag, linked_room_id, source: grammar_writing}", () => {
    renderCard(makeHint({ weaknessTag: "vi_l1_plural_s" }));
    fireEvent.click(screen.getByTestId("l1-hint-learn-more-link"));
    expect(mockTrackEvent).toHaveBeenCalledWith("l1_hint_learn_more_clicked", {
      tag: "vi_l1_plural_s",
      linked_room_id: "english_a1_a109",
      source: "grammar_writing",
    });
  });

  it("shows 'No lesson yet' disabled state for catalog tags without a linkedRoomId", () => {
    // vi_l1_missing_article is in WEAKNESS_CATALOG but has
    // linkedRoomId: null — no existing room teaches articles yet.
    renderCard(makeHint({ weaknessTag: "vi_l1_missing_article" }));
    expect(screen.queryByTestId("l1-hint-learn-more-link")).toBeNull();
    const disabled = screen.getByTestId("l1-hint-learn-more-disabled");
    expect(disabled.getAttribute("aria-disabled")).toBe("true");
    expect(disabled.textContent).toMatch(/No lesson yet/);
    expect(disabled.textContent).toMatch(/Chưa có bài học/);
  });

  it("shows 'No lesson yet' disabled state for tags with no catalog entry", () => {
    renderCard(makeHint({ weaknessTag: "vi_l1_ghost_tag" }));
    expect(screen.queryByTestId("l1-hint-learn-more-link")).toBeNull();
    expect(screen.getByTestId("l1-hint-learn-more-disabled")).toBeDefined();
  });

  it("disabled state does NOT fire analytics when clicked", () => {
    renderCard(makeHint({ weaknessTag: "vi_l1_unknown_thing" }));
    const disabled = screen.getByTestId("l1-hint-learn-more-disabled");
    fireEvent.click(disabled);
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });
});
