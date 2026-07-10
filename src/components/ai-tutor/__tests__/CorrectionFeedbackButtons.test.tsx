import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import CorrectionFeedbackButtons from "../CorrectionFeedbackButtons";
import type { LearningEventInput } from "@/lib/tutor/learningEvents";

beforeEach(() => cleanup());

const RULE_ID = "en_l1_register_formal_opener_peer_ban";

describe("CorrectionFeedbackButtons — id gate (no id, no buttons)", () => {
  it.each([undefined, null, "", "   "])(
    "renders nothing when ruleOrDetectorId is %p",
    (id) => {
      const record = vi.fn();
      const { container } = render(
        <CorrectionFeedbackButtons ruleOrDetectorId={id as string | null | undefined} record={record} />,
      );
      expect(container).toBeEmptyDOMElement();
      expect(screen.queryByTestId("correction-feedback")).toBeNull();
      expect(screen.queryByTestId("correction-feedback-helpful")).toBeNull();
      expect(screen.queryByTestId("correction-feedback-not-helpful")).toBeNull();
    },
  );

  it("renders both thumbs when a rule/detector id is present", () => {
    render(<CorrectionFeedbackButtons ruleOrDetectorId={RULE_ID} record={vi.fn()} />);
    expect(screen.getByTestId("correction-feedback")).toHaveAttribute("data-rule-id", RULE_ID);
    expect(screen.getByTestId("correction-feedback-helpful")).toBeInTheDocument();
    expect(screen.getByTestId("correction-feedback-not-helpful")).toBeInTheDocument();
  });
});

describe("CorrectionFeedbackButtons — one tap per correction", () => {
  it("records exactly one feedback_helpful event carrying the non-optional id", () => {
    const record = vi.fn<(e: LearningEventInput) => null>(() => null);
    render(
      <CorrectionFeedbackButtons ruleOrDetectorId={RULE_ID} targetLanguage="en" record={record} />,
    );

    fireEvent.click(screen.getByTestId("correction-feedback-helpful"));

    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0][0]).toMatchObject({
      eventType: "feedback_helpful",
      product: "ai_tutor",
      targetLanguage: "en",
      ruleOrDetectorId: RULE_ID,
    });
  });

  it("records feedback_not_helpful for the thumbs-down", () => {
    const record = vi.fn<(e: LearningEventInput) => null>(() => null);
    render(<CorrectionFeedbackButtons ruleOrDetectorId={RULE_ID} record={record} />);

    fireEvent.click(screen.getByTestId("correction-feedback-not-helpful"));

    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0][0].eventType).toBe("feedback_not_helpful");
  });

  it("ignores every tap after the first — locked, no second event", () => {
    const record = vi.fn<(e: LearningEventInput) => null>(() => null);
    render(<CorrectionFeedbackButtons ruleOrDetectorId={RULE_ID} record={record} />);

    const helpful = screen.getByTestId("correction-feedback-helpful");
    const notHelpful = screen.getByTestId("correction-feedback-not-helpful");

    fireEvent.click(helpful);
    fireEvent.click(helpful); // repeat
    fireEvent.click(notHelpful); // switch attempt

    expect(record).toHaveBeenCalledTimes(1);
    expect(helpful).toBeDisabled();
    expect(notHelpful).toBeDisabled();
    expect(helpful).toHaveAttribute("aria-pressed", "true");
  });

  it("passes the trimmed id through when the caller supplies surrounding space", () => {
    const record = vi.fn<(e: LearningEventInput) => null>(() => null);
    render(<CorrectionFeedbackButtons ruleOrDetectorId={`  ${RULE_ID}  `} record={record} />);

    fireEvent.click(screen.getByTestId("correction-feedback-helpful"));

    expect(record.mock.calls[0][0].ruleOrDetectorId).toBe(RULE_ID);
  });
});
