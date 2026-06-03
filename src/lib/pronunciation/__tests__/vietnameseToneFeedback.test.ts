import { describe, expect, it } from "vitest";

import { buildVietnameseToneFeedbackDisplay, resolveVietnameseTonePracticeTarget } from "../vietnameseToneFeedback";
import type { ToneScoreResult } from "../scoreTone";

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
    });
  });

  it("returns null for unsupported tones and unavailable results", () => {
    const unsupported = resolveVietnameseTonePracticeTarget("mã");
    expect(unsupported).not.toBeNull();
    expect(
      buildVietnameseToneFeedbackDisplay({
        target: unsupported!,
        result: { bucket: "pass", score: 90, reason: null } as ToneScoreResult,
      }),
    ).toBeNull();

    const supported = resolveVietnameseTonePracticeTarget("má");
    expect(supported).not.toBeNull();
    expect(
      buildVietnameseToneFeedbackDisplay({
        target: supported!,
        result: { bucket: "unavailable", score: null, reason: "timeout" } as ToneScoreResult,
      }),
    ).toBeNull();
  });
});
