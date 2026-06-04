import { describe, expect, it } from "vitest";

import {
  buildVietnameseToneFeedback,
  buildVietnameseToneFeedbackDisplay,
  inferVietnameseToneTarget,
  resolveVietnameseTonePracticeTarget,
} from "../vietnameseToneFeedback";
import type { ToneScoreResult } from "../scoreTone";
import type { ExtractedPitchContour, VietnameseToneTarget } from "../vietnameseToneScorer";

describe("resolveVietnameseTonePracticeTarget", () => {
  it("resolves supported tones from single-syllable practice targets", () => {
    expect(resolveVietnameseTonePracticeTarget("má")).toMatchObject({
      syllable: "má",
      tone: "sac",
      supported: true,
      directionLabelVi: "đi lên",
    });
    expect(resolveVietnameseTonePracticeTarget("mà")).toMatchObject({
      syllable: "mà",
      tone: "huyen",
      supported: true,
      directionLabelVi: "đi xuống",
    });
    expect(resolveVietnameseTonePracticeTarget("ma")).toMatchObject({
      syllable: "ma",
      tone: "ngang",
      supported: true,
      directionLabelVi: "giữ ngang",
    });
  });

  it("marks unsupported tones as unsupported for the MVP", () => {
    expect(resolveVietnameseTonePracticeTarget("mả")).toMatchObject({
      syllable: "mả",
      tone: "hoi",
      supported: false,
    });
    expect(resolveVietnameseTonePracticeTarget("mã")).toMatchObject({
      syllable: "mã",
      tone: "nga",
      supported: false,
    });
    expect(resolveVietnameseTonePracticeTarget("mạ")).toMatchObject({
      syllable: "mạ",
      tone: "nang",
      supported: false,
    });
  });

  it("returns null for multi-word practice text", () => {
    expect(resolveVietnameseTonePracticeTarget("má hôm nay")).toBeNull();
  });
});

describe("buildVietnameseToneFeedbackDisplay", () => {
  it("builds a correct feedback card for supported matches", () => {
    const target = resolveVietnameseTonePracticeTarget("má");
    expect(target).not.toBeNull();

    const feedback = buildVietnameseToneFeedbackDisplay({
      target: target!,
      result: { bucket: "pass", score: 91, reason: null } as ToneScoreResult,
    });

    expect(feedback).toEqual({
      tone: "sac",
      toneLabelVi: "sắc",
      directionLabelVi: "đi lên",
      status: "correct",
      score: 91,
      practicePromptVi: "Tốt rồi. Lặp lại một lần nữa để giữ cảm giác đường giọng.",
      practicePromptEn: "Good. Repeat once more to keep the tone shape steady.",
    });
  });

  it("builds a try-again card for supported mismatches", () => {
    const target = resolveVietnameseTonePracticeTarget("mà");
    expect(target).not.toBeNull();

    const feedback = buildVietnameseToneFeedbackDisplay({
      target: target!,
      result: { bucket: "retry", score: 42, reason: null } as ToneScoreResult,
    });

    expect(feedback).toEqual({
      tone: "huyen",
      toneLabelVi: "huyền",
      directionLabelVi: "đi xuống",
      status: "try_again",
      score: 42,
      practicePromptVi: "Không sao. Thử lại chậm hơn một lần, tập trung vào hướng đường giọng.",
      practicePromptEn: "No problem. Try once more slowly and focus on the tone direction.",
    });
  });

  it("returns practice-forward abstention displays for unsupported tones and unavailable results", () => {
    const unsupported = resolveVietnameseTonePracticeTarget("mã");
    expect(unsupported).not.toBeNull();
    expect(
      buildVietnameseToneFeedbackDisplay({
        target: unsupported!,
        result: { bucket: "pass", score: 90, reason: null } as ToneScoreResult,
      }),
    ).toMatchObject({
      tone: "nga",
      toneLabelVi: "ngã",
      status: "unsupported",
      score: null,
    });

    const supported = resolveVietnameseTonePracticeTarget("má");
    expect(supported).not.toBeNull();
    expect(
      buildVietnameseToneFeedbackDisplay({
        target: supported!,
        result: { bucket: "unavailable", score: null, reason: "timeout" } as ToneScoreResult,
      }),
    ).toMatchObject({
      tone: "sac",
      toneLabelVi: "sắc",
      status: "unclear",
      score: null,
    });
  });
});

describe("inferVietnameseToneTarget", () => {
  it("detects marked supported tones", () => {
    expect(inferVietnameseToneTarget("má")?.tone).toBe("sac");
    expect(inferVietnameseToneTarget("mà")?.tone).toBe("huyen");
  });

  it("detects unsupported marked tones without making them scorable", () => {
    expect(inferVietnameseToneTarget("mả")?.expectedContour).toBe("unsupported");
    expect(inferVietnameseToneTarget("mã")?.expectedContour).toBe("unsupported");
    expect(inferVietnameseToneTarget("mạ")?.expectedContour).toBe("unsupported");
  });

  it("only treats unmarked text as ngang when explicitly allowed", () => {
    expect(inferVietnameseToneTarget("ma")).toBeNull();
    expect(inferVietnameseToneTarget("ma", { allowUnmarkedNgang: true })).toMatchObject({
      tone: "ngang",
      expectedContour: "level",
    });
  });
});

describe("buildVietnameseToneFeedback", () => {
  it("returns correct feedback for supported tone contour matches", () => {
    const feedback = buildVietnameseToneFeedback({
      target: target("sac", "rising"),
      contour: contour([180, 190, 205, 222]),
    });

    expect(feedback.kind).toBe("correct");
    expect(feedback.titleVi).toContain("Thanh sắc");
    expect(feedback.bodyEn).toContain("pitch contour is close");
  });

  it("returns simple direction guidance for supported tone mismatches", () => {
    const feedback = buildVietnameseToneFeedback({
      target: target("huyen", "falling"),
      contour: contour([180, 195, 210, 230]),
    });

    expect(feedback.kind).toBe("try_again");
    expect(feedback.bodyVi).toContain("hạ đường giọng");
    expect(feedback.bodyEn).toContain("fall gently");
  });

  it("never gives confident feedback for unsupported tones", () => {
    for (const tone of ["hoi", "nga", "nang"] as const) {
      const feedback = buildVietnameseToneFeedback({
        target: target(tone, "unsupported"),
        contour: contour([180, 190, 205, 222]),
      });

      expect(feedback.kind).toBe("unsupported");
      expect(feedback.bodyVi).toContain("chưa chấm được thanh này");
      expect(feedback.bodyEn).toContain("can't assess this tone yet");
    }
  });

  it("abstains when supported tone evidence is missing or unclear", () => {
    expect(
      buildVietnameseToneFeedback({
        target: target("ngang", "level"),
        contour: null,
      }).kind,
    ).toBe("unclear");

    expect(
      buildVietnameseToneFeedback({
        target: target("ngang", "level"),
        contour: {
          ...contour([180, 181, 182, 181]),
          extractionConfidence: 0.2,
          reason: "insufficient-voicing",
        },
      }).kind,
    ).toBe("unclear");
  });
});

function target(
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
