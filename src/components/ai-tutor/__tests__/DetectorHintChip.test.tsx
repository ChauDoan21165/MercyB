import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import DetectorHintChip from "../DetectorHintChip";
import {
  _resetHintDedupForTesting,
  getDetectorHint,
  hasShownHint,
  type DetectorHintContent,
} from "@/lib/ai-tutor/detectorHint";
import type {
  L1DetectionResult,
  L1WeaknessTag,
} from "@/lib/feedback/l1-error-detector";

beforeEach(() => {
  cleanup();
  _resetHintDedupForTesting();
});

const content: DetectorHintContent = {
  tag: "vi_l1_3rd_person_s",
  nameEn: "Third-person -s",
  rationaleVi:
    "Tiếng Việt mình không chia động từ theo chủ ngữ — 'anh ấy đi', 'cô ấy đi', 'chúng tôi đi' đều giữ nguyên động từ.",
};

describe("DetectorHintChip", () => {
  it("renders nothing when content is null", () => {
    const { container } = render(<DetectorHintChip content={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the English name and Vietnamese rationale when given content", () => {
    render(<DetectorHintChip content={content} />);
    const chip = screen.getByTestId("detector-hint-chip");
    expect(chip).toBeTruthy();
    expect(chip.getAttribute("data-tag")).toBe("vi_l1_3rd_person_s");
    expect(screen.getByText("Third-person -s")).toBeTruthy();
    expect(screen.getByText(/Tiếng Việt mình không chia động từ/)).toBeTruthy();
  });

  it("marks the tag as shown on mount (session dedup side effect)", () => {
    expect(hasShownHint("vi_l1_3rd_person_s")).toBe(false);
    render(<DetectorHintChip content={content} />);
    expect(hasShownHint("vi_l1_3rd_person_s")).toBe(true);
  });

  it("does not record dedup when content is null", () => {
    render(<DetectorHintChip content={null} />);
    expect(hasShownHint("vi_l1_3rd_person_s")).toBe(false);
  });

  it.each([
    ["article", "vi_l1_missing_article", "Missing a / an / the"],
    ["plural", "vi_l1_plural_s", "Plural -s"],
    ["subject-verb agreement", "vi_l1_3rd_person_s", "Third-person -s"],
    ["preposition", "vi_l1_preposition_transfer", "Wrong preposition"],
    ["past tense", "vi_l1_past_ed", "Past tense -ed"],
  ] as const)(
    "renders %s detector output through the correction chip",
    (_label, tag, nameEn) => {
      const detection: L1DetectionResult = {
        matched: true,
        weaknessTag: tag as L1WeaknessTag,
        feedback: { en: "Try the corrected phrase.", vi: "Thử câu đã sửa." },
      };
      const hint = getDetectorHint(detection);
      expect(hint, tag).not.toBeNull();

      render(<DetectorHintChip content={hint} />);

      const chip = screen.getByTestId("detector-hint-chip");
      expect(chip.getAttribute("data-tag")).toBe(tag);
      expect(screen.getByText(nameEn)).toBeTruthy();
    },
  );
});
