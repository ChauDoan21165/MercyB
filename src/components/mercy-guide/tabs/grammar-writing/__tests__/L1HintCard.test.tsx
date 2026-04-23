// src/components/mercy-guide/tabs/grammar-writing/__tests__/L1HintCard.test.tsx
//
// Unit tests for the L1 hint card. Exercises:
//   - Both EN + VI strings render when hint is populated.
//   - Short badge label comes from WEAKNESS_CATALOG for the three
//     catalog tags, falls back to local map for detector-only tags,
//     and to a prettified identifier for fully unknown tags.
//   - renderInlineBold wires through — **word** segments become <strong>.
//   - Returns nothing for null / undefined / empty feedback.
//
// This component does NOT consume useFeatureFlag directly — the caller
// (GrammarWritingTab) gates rendering. So no flag mocking needed here.

import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

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

describe("L1HintCard", () => {
  it("renders both English and Vietnamese feedback when a hint is provided", () => {
    render(<L1HintCard hint={makeHint()} />);

    // EN body
    expect(screen.getByText(/In English, verbs change after/)).toBeDefined();
    // VI body
    expect(screen.getByText(/Trong tiếng Anh, động từ đi với/)).toBeDefined();
  });

  it("renders the 'Pattern noticed' framing label (warm, not alarming)", () => {
    render(<L1HintCard hint={makeHint()} />);
    expect(screen.getByText(/Pattern noticed/i)).toBeDefined();
  });

  it("uses the WEAKNESS_CATALOG short label when the tag is in the catalog", () => {
    // vi_l1_3rd_person_s is in the catalog → "Subject-verb agreement" /
    // "Chia động từ theo chủ ngữ" (Chau-approved strings).
    render(<L1HintCard hint={makeHint({ weaknessTag: "vi_l1_3rd_person_s" })} />);
    expect(screen.getByText(/Subject-verb agreement/)).toBeDefined();
    expect(screen.getByText(/Chia động từ theo chủ ngữ/)).toBeDefined();
  });

  it("uses the local short-label map for detector-only tags not yet in the catalog", () => {
    render(<L1HintCard hint={makeHint({ weaknessTag: "vi_l1_missing_be" })} />);
    expect(screen.getByText(/Missing "be"/)).toBeDefined();
    expect(screen.getByText(/Thiếu động từ "be"/)).toBeDefined();
  });

  it("falls back to a prettified tag identifier when the tag is fully unknown", () => {
    render(<L1HintCard hint={makeHint({ weaknessTag: "vi_l1_some_new_pattern" })} />);
    // Fallback is the same string in both EN and VI slots because we
    // don't have separate translations for an unknown tag.
    const matches = screen.getAllByText(/some new pattern/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("wraps **bold** segments in <strong> via renderInlineBold", () => {
    const { container } = render(<L1HintCard hint={makeHint()} />);
    const html = container.innerHTML;
    // The raw ** markers must NOT appear — they got converted to tags.
    expect(html).not.toContain("**she**");
    expect(html).toContain("<strong>she</strong>");
    expect(html).toContain("<strong>he</strong>");
  });

  it("renders nothing when hint is null", () => {
    const { container } = render(<L1HintCard hint={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when hint is undefined", () => {
    const { container } = render(<L1HintCard hint={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when both feedback strings are empty", () => {
    const { container } = render(
      <L1HintCard hint={makeHint({ feedback: { en: "", vi: "" } })} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders when only English feedback is present", () => {
    const { container } = render(
      <L1HintCard
        hint={makeHint({ feedback: { en: "English only hint.", vi: "" } })}
      />,
    );
    expect(container.firstChild).not.toBeNull();
    expect(screen.getByText(/English only hint/)).toBeDefined();
  });

  it("renders when only Vietnamese feedback is present", () => {
    const { container } = render(
      <L1HintCard
        hint={makeHint({ feedback: { en: "", vi: "Chỉ có tiếng Việt." } })}
      />,
    );
    expect(container.firstChild).not.toBeNull();
    expect(screen.getByText(/Chỉ có tiếng Việt/)).toBeDefined();
  });
});
