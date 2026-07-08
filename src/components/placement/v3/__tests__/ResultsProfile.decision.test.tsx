import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { buildAssessmentRationale, ResultsProfile } from "../ResultsProfile";
import type { PlacementV3Results } from "@/lib/placement/v3/types";

const T = "2026-07-03T00:00:00.000Z";

/** Clean, complete result: valid placement, every skill counted. */
function validResults(): PlacementV3Results {
  return {
    sessionId: "placement-valid",
    completedAt: T,
    overallCefr: "B1",
    overallConfidence: 0.72,
    overallSummary: { en: "Solid B1.", vi: "B1 vững." },
    skills: [
      { modality: "listening", cefr: "B1", confidence: 0.7, summary: { en: "L", vi: "L" }, scoreEligible: true },
      { modality: "speaking", cefr: "B1", confidence: 0.68, summary: { en: "S", vi: "S" }, scoreEligible: true },
    ],
    l1Flags: [],
    recommendations: [],
    strengths: [],
    gaps: [],
    questionCount: 6,
    placementValidity: "valid",
    runtimeDecision: {
      excludeListeningScore: false,
      excludeSpeakingScore: false,
      placementValidity: "valid",
      offers: { listeningRetest: false, speakingTextFallback: false, micRetry: false, confidenceFollowUp: false },
      recommendationActions: [],
    },
  };
}

/**
 * Reference result — exact shape emitted by applyPlacementRuntimeDecision when
 * the listening audio was unplayable AND answers looked like rapid guessing
 * (verified by dumping the real runtime object).
 */
function referenceResults(): PlacementV3Results {
  return {
    sessionId: "placement-ref",
    completedAt: T,
    overallCefr: "A2",
    overallConfidence: 0.6,
    overallSummary: { en: "A2 placement.", vi: "Xếp trình độ A2." },
    skills: [
      {
        modality: "listening",
        cefr: "A2",
        confidence: 0.58,
        summary: { en: "L", vi: "L" },
        scoreEligible: false,
        runtimeExclusionReason: "product_failure_audio",
      },
      { modality: "speaking", cefr: "A2", confidence: 0.61, summary: { en: "S", vi: "S" }, scoreEligible: true },
    ],
    l1Flags: [],
    recommendations: [],
    strengths: [],
    gaps: [],
    questionCount: 5,
    placementValidity: "questionable",
    runtimeDecision: {
      excludeListeningScore: true,
      excludeSpeakingScore: false,
      placementValidity: "questionable",
      offers: { listeningRetest: true, speakingTextFallback: false, micRetry: false, confidenceFollowUp: true },
      recommendationActions: [
        "exclude_listening_score_and_offer_retest",
        "pause_assessment_ask_confidence_check_and_do_not_lower_placement",
      ],
    },
  };
}

describe("buildAssessmentRationale (pure derivation)", () => {
  it("valid result → not a reference, ends with the reliability reassurance", () => {
    const { isReference, notes } = buildAssessmentRationale(validResults());
    expect(isReference).toBe(false);
    expect(notes[0].en).toMatch(/estimated your level/i);
    expect(notes.some((n) => /complete and reliable/i.test(n.en))).toBe(true);
    // No product-failure or reference caution lines when everything counted.
    expect(notes.some((n) => /did not count/i.test(n.en))).toBe(false);
    expect(notes.some((n) => /reference result/i.test(n.en))).toBe(false);
  });

  it("audio failure + rapid guessing → reference, honest product-failure + retest + do-not-lower notes", () => {
    const { isReference, notes } = buildAssessmentRationale(referenceResults());
    expect(isReference).toBe(true);
    const en = notes.map((n) => n.en).join(" | ");
    expect(en).toMatch(/did not count your Listening score because the audio did not play/i);
    expect(en).toMatch(/not a reflection of your ability/i);
    expect(en).toMatch(/retake the Listening section/i);
    expect(en).toMatch(/we did not lower your level/i);
    // Reassurance must NOT appear on a reference result.
    expect(en).not.toMatch(/complete and reliable/i);
    // Both VI and EN present on every note (bilingual convention).
    expect(notes.every((n) => n.en.length > 0 && n.vi.length > 0)).toBe(true);
  });
});

describe("ResultsProfile — flag OFF (default)", () => {
  it("renders the existing summary but NOT the rationale section", () => {
    const { container } = render(<ResultsProfile results={referenceResults()} />);
    // Existing surface still renders.
    expect(screen.getByText("A2 placement.")).toBeInTheDocument();
    // The new section is entirely absent — output is byte-identical to before.
    expect(container.querySelector('[data-testid="assessment-rationale"]')).toBeNull();
    expect(container.textContent).not.toMatch(/How we assessed you/i);
  });
});

describe("ResultsProfile — flag ON", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  async function renderWithFlagOn(results: PlacementV3Results) {
    vi.stubEnv("VITE_PLACEMENT_DECISION_VISIBLE", "true");
    vi.resetModules();
    const { ResultsProfile: ResultsProfileOn } = await import("../ResultsProfile");
    return render(<ResultsProfileOn results={results} />);
  }

  it("renders the rationale section with a reference badge from a fixture reference result", async () => {
    const { container } = await renderWithFlagOn(referenceResults());
    expect(container.querySelector('[data-testid="assessment-rationale"]')).not.toBeNull();
    expect(screen.getByText("How we assessed you")).toBeInTheDocument();
    expect(screen.getByText("Cách chúng tôi đánh giá bạn")).toBeInTheDocument();
    expect(screen.getByText("Reference result")).toBeInTheDocument();
    expect(screen.getByText("Kết quả tham khảo")).toBeInTheDocument();
    expect(
      screen.getByText(/did not count your Listening score because the audio did not play/i),
    ).toBeInTheDocument();
  });

  it("renders the section without a reference badge for a valid result", async () => {
    const { container } = await renderWithFlagOn(validResults());
    expect(container.querySelector('[data-testid="assessment-rationale"]')).not.toBeNull();
    expect(screen.getByText("How we assessed you")).toBeInTheDocument();
    expect(screen.queryByText("Reference result")).toBeNull();
    expect(screen.getByText(/complete and reliable/i)).toBeInTheDocument();
  });
});
