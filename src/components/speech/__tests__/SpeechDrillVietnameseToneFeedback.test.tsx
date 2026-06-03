import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/featureFlags", () => ({
  FEATURE_FLAGS: {
    VIETNAMESE_TONE_FEEDBACK_MVP_ENABLED: true,
  },
}));

vi.mock("@/lib/pronunciation/recognizer", () => ({
  isSpeechRecognitionSupported: vi.fn(() => true),
  recognizeOnce: vi.fn(),
}));

vi.mock("@/lib/pronunciation/scorer", () => ({
  scorePronunciation: vi.fn(),
}));

import { recognizeOnce } from "@/lib/pronunciation/recognizer";
import { scorePronunciation, type ScoreResult } from "@/lib/pronunciation/scorer";
import type { ExtractedPitchContour, VietnameseToneTarget } from "@/lib/pronunciation/vietnameseToneScorer";

import { SpeechDrill } from "../SpeechDrill";

beforeEach(() => {
  vi.mocked(recognizeOnce).mockReset();
  vi.mocked(scorePronunciation).mockReset();
});

describe("SpeechDrill Vietnamese tone feedback", () => {
  it("shows supported-tone correct feedback when flag is on and contour matches", async () => {
    await runDrill({
      target: toneTarget("sac", "rising"),
      contour: contour([180, 194, 210, 228]),
    });

    const card = await screen.findByLabelText("Vietnamese tone feedback");
    expect(card).toHaveAttribute("data-tone-feedback-kind", "correct");
    expect(screen.getByText(/Thanh sắc nghe khá đúng/)).toBeInTheDocument();
    expect(screen.getByText(/Tone shape/)).toBeInTheDocument();
  });

  it("shows supported-tone direction guidance when contour mismatches", async () => {
    await runDrill({
      target: toneTarget("huyen", "falling"),
      contour: contour([180, 194, 210, 228]),
    });

    const card = await screen.findByLabelText("Vietnamese tone feedback");
    expect(card).toHaveAttribute("data-tone-feedback-kind", "try_again");
    expect(screen.getByText(/Thanh huyền chưa rõ/)).toBeInTheDocument();
    expect(screen.getByText(/hạ đường giọng/)).toBeInTheDocument();
  });

  it("shows unsupported-tone redirect copy without confident feedback", async () => {
    await runDrill({
      target: toneTarget("nga", "unsupported"),
      contour: contour([180, 194, 210, 228]),
    });

    const card = await screen.findByLabelText("Vietnamese tone feedback");
    expect(card).toHaveAttribute("data-tone-feedback-kind", "unsupported");
    expect(screen.getByText(/chưa chấm chắc thanh ngã/)).toBeInTheDocument();
    expect(screen.getByText(/Mình luyện lại chậm hơn nhé/)).toBeInTheDocument();
  });

  it("abstains when supported-tone contour evidence is missing", async () => {
    await runDrill({
      target: toneTarget("ngang", "level"),
      contour: null,
    });

    const card = await screen.findByLabelText("Vietnamese tone feedback");
    expect(card).toHaveAttribute("data-tone-feedback-kind", "unclear");
    expect(screen.getByText(/chưa nghe rõ đường giọng/)).toBeInTheDocument();
  });
});

async function runDrill(input: {
  target: VietnameseToneTarget;
  contour: ExtractedPitchContour | null;
}) {
  vi.mocked(recognizeOnce).mockResolvedValue({
    transcript: "ma",
    confidence: 0.9,
    wordTimings: [],
    durationSec: 1,
  });
  vi.mocked(scorePronunciation).mockReturnValue(scoreResult());

  const user = userEvent.setup();
  render(
    <SpeechDrill
      targetSentence={input.target.syllable}
      vietnameseToneAssessment={{
        target: input.target,
        contour: input.contour,
      }}
    />,
  );

  await user.click(screen.getByRole("button", { name: /start recording/i }));
  await screen.findByLabelText(/overall score 82/i);
}

function scoreResult(): ScoreResult {
  return {
    overallScore: 82,
    wordScores: [{ word: "ma", heard: "ma", score: 82, status: "correct" }],
    feedback: {
      en: "Clear enough for practice.",
      vi: "Đủ rõ để luyện tiếp.",
    },
    phonemeFeedback: [],
  };
}

function toneTarget(
  tone: VietnameseToneTarget["tone"],
  expectedContour: VietnameseToneTarget["expectedContour"],
): VietnameseToneTarget {
  return {
    syllable: "ma",
    tone,
    expectedContour,
  };
}

function contour(values: number[]): ExtractedPitchContour {
  return {
    samples: values.map((f0Hz, index) => ({
      timeMs: index * 80,
      f0Hz,
      confidence: 0.9,
    })),
    durationMs: values.length * 80,
    voicedRatio: 1,
    medianF0Hz: median(values),
    extractionConfidence: 0.9,
    reason: "ok",
  };
}

function median(values: number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[midpoint - 1] + sorted[midpoint]) / 2
    : sorted[midpoint];
}
