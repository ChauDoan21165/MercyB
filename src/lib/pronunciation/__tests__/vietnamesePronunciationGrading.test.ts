import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/audio/wavEncoder", () => ({
  blobToWavPcm16k: vi.fn(),
}));

import { blobToWavPcm16k } from "@/lib/audio/wavEncoder";
import {
  buildVietnamesePronunciationGrade,
  isScriptedTargetAligned,
  normalizeAzureVietnamesePronunciation,
  scoreVietnamesePronunciationV1,
  segmentVietnameseTarget,
} from "../vietnamesePronunciationGrading";
import {
  fallingPitchContour,
  levelPitchContour,
  lowVoicingPitchContour,
  risingPitchContour,
} from "../__fixtures__/vietnameseToneContourFixtures";

const blobToWavPcm16kMock = vi.mocked(blobToWavPcm16k);
const FAKE_WAV = new Blob([new Uint8Array(44 + 64)], { type: "audio/wav" });

beforeEach(() => {
  vi.clearAllMocks();
  blobToWavPcm16kMock.mockResolvedValue(FAKE_WAV);
});

describe("normalizeAzureVietnamesePronunciation", () => {
  it("normalizes Azure vi-VN word, phoneme, fluency, prosody, and timing data", () => {
    const result = normalizeAzureVietnamesePronunciation(
      {
        RecognitionStatus: "Success",
        DisplayText: "má đi",
        NBest: [
          {
            Display: "má đi",
            AccuracyScore: 87.6,
            FluencyScore: 78.2,
            ProsodyScore: 66.8,
            Words: [
              {
                Word: "má",
                Offset: 1_200_000,
                Duration: 3_400_000,
                AccuracyScore: 92.2,
                ErrorType: "None",
                Phonemes: [
                  { Phoneme: "m", AccuracyScore: 99.4 },
                  { Phoneme: "a", AccuracyScore: 84.1 },
                ],
              },
            ],
          },
        ],
      },
      "má đi",
    );

    expect(result.locale).toBe("vi-VN");
    expect(result.overallAccuracy).toBe(88);
    expect(result.fluency).toBe(78);
    expect(result.prosody).toBe(67);
    expect(result.words[0]).toMatchObject({
      word: "má",
      accuracy: 92,
      errorType: "None",
      offsetMs: 120,
      durationMs: 340,
    });
    expect(result.words[0].phonemes).toEqual([
      { phoneme: "m", accuracy: 99 },
      { phoneme: "a", accuracy: 84 },
    ]);
  });
});

describe("segmentVietnameseTarget", () => {
  it("maps scripted target syllables to the six Vietnamese tone categories", () => {
    expect(segmentVietnameseTarget("ma mà má mả mã mạ")).toMatchObject([
      { syllable: "ma", normalized: "ma", toneId: "ngang", toneName: "level" },
      { syllable: "mà", normalized: "ma", toneId: "huyen", toneName: "falling" },
      { syllable: "má", normalized: "ma", toneId: "sac", toneName: "rising" },
      { syllable: "mả", normalized: "ma", toneId: "hoi", toneName: "dipping" },
      { syllable: "mã", normalized: "ma", toneId: "nga", toneName: "broken-rising" },
      { syllable: "mạ", normalized: "ma", toneId: "nang", toneName: "heavy" },
    ]);
  });
});

describe("Vietnamese tone precision gate", () => {
  const azure = normalizeAzureVietnamesePronunciation(
    {
      RecognitionStatus: "Success",
      NBest: [{ AccuracyScore: 90, Words: [{ Word: "má", AccuracyScore: 92 }] }],
    },
    "má",
  );

  it("emits eligible diagnostic tone correctness for confident scripted alignment", () => {
    const result = buildVietnamesePronunciationGrade({
      targetText: "má",
      azure,
      syllableContours: { ma: risingPitchContour },
    });

    expect(result.learnerToneDisplayAllowed).toBe(false);
    expect(result.toneGrades[0]).toMatchObject({
      toneScore: 96,
      correct: true,
      reason: "contour_match",
      diagnosticOnly: true,
    });
  });

  it("suppresses tone score when voiced evidence is too low", () => {
    const result = buildVietnamesePronunciationGrade({
      targetText: "má",
      azure,
      syllableContours: { ma: lowVoicingPitchContour },
    });

    expect(result.toneGrades[0]).toMatchObject({
      toneScore: null,
      correct: null,
      reason: "low_voicing",
    });
  });

  it("suppresses contour-only scores for dipping, broken-rising, and heavy until native-ear validation", () => {
    const unsupportedAzure = normalizeAzureVietnamesePronunciation(
      {
        RecognitionStatus: "Success",
        NBest: [
          {
            AccuracyScore: 90,
            Words: [
              { Word: "mả", AccuracyScore: 92 },
              { Word: "mã", AccuracyScore: 92 },
              { Word: "mạ", AccuracyScore: 92 },
            ],
          },
        ],
      },
      "mả mã mạ",
    );

    const result = buildVietnamesePronunciationGrade({
      targetText: "mả mã mạ",
      azure: unsupportedAzure,
      syllableContours: {
        "syllable:0": fallingPitchContour,
        "syllable:1": fallingPitchContour,
        "syllable:2": fallingPitchContour,
      },
    });

    expect(result.toneGrades.map((grade) => grade.reason)).toEqual([
      "native_ear_validation_required",
      "native_ear_validation_required",
      "native_ear_validation_required",
    ]);
    expect(result.toneGrades.every((grade) => grade.toneScore === null)).toBe(true);
  });

  it("uses explicit syllable contour keys so minimal-tone targets do not collide", () => {
    const twoToneAzure = normalizeAzureVietnamesePronunciation(
      {
        RecognitionStatus: "Success",
        NBest: [
          {
            AccuracyScore: 90,
            Words: [
              { Word: "ma", AccuracyScore: 92 },
              { Word: "má", AccuracyScore: 92 },
            ],
          },
        ],
      },
      "ma má",
    );

    const result = buildVietnamesePronunciationGrade({
      targetText: "ma má",
      azure: twoToneAzure,
      syllableContours: {
        "syllable:0": levelPitchContour,
        "syllable:1": risingPitchContour,
      },
    });

    expect(result.toneGrades.map((grade) => grade.reason)).toEqual(["contour_match", "contour_match"]);
    expect(result.toneGrades.map((grade) => grade.correct)).toEqual([true, true]);
  });

  it("does not use an accent-stripped contour key when multiple marked target syllables share the same base", () => {
    const twoToneAzure = normalizeAzureVietnamesePronunciation(
      {
        RecognitionStatus: "Success",
        NBest: [
          {
            AccuracyScore: 90,
            Words: [
              { Word: "má", AccuracyScore: 92 },
              { Word: "mà", AccuracyScore: 92 },
            ],
          },
        ],
      },
      "má mà",
    );

    const result = buildVietnamesePronunciationGrade({
      targetText: "má mà",
      azure: twoToneAzure,
      syllableContours: { ma: risingPitchContour },
    });

    expect(result.toneGrades.map((grade) => grade.reason)).toEqual([
      "missing_pitch_contour",
      "missing_pitch_contour",
    ]);
  });
});

describe("scripted target alignment", () => {
  it("rejects tone grading when Azure words do not align to the scripted target", () => {
    const syllables = segmentVietnameseTarget("má đi");
    const azure = normalizeAzureVietnamesePronunciation(
      {
        RecognitionStatus: "Success",
        NBest: [
          {
            AccuracyScore: 91,
            Words: [{ Word: "má", AccuracyScore: 94 }],
          },
        ],
      },
      "má đi",
    );

    expect(isScriptedTargetAligned(azure, syllables)).toBe(false);

    const result = buildVietnamesePronunciationGrade({
      targetText: "má đi",
      azure,
      syllableContours: { ma: risingPitchContour, đi: levelPitchContour },
    });

    expect(result.toneGrades.map((grade) => grade.reason)).toEqual([
      "alignment_uncertain",
      "alignment_uncertain",
    ]);
  });

  it("rejects tone grading when Azure returns a different Vietnamese tone mark", () => {
    const syllables = segmentVietnameseTarget("má");
    const azure = normalizeAzureVietnamesePronunciation(
      {
        RecognitionStatus: "Success",
        NBest: [
          {
            AccuracyScore: 91,
            Words: [{ Word: "mã", AccuracyScore: 94 }],
          },
        ],
      },
      "má",
    );

    expect(isScriptedTargetAligned(azure, syllables)).toBe(false);

    const result = buildVietnamesePronunciationGrade({
      targetText: "má",
      azure,
      syllableContours: { ma: risingPitchContour },
    });

    expect(result.toneGrades[0]).toMatchObject({
      toneScore: null,
      correct: null,
      reason: "alignment_uncertain",
    });
  });
});

describe("scoreVietnamesePronunciationV1", () => {
  it("posts the standalone vi-VN Azure pronunciation request and returns normalized grades", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          score: 91,
          overall_score: 91,
          fluency_score: 88,
          prosody_score: 77,
          word_scores: [
            {
              word: "má",
              score: 91,
              offset: 0,
              duration: 2_000_000,
              error_type: "None",
              phonemes: [{ phoneme: "m", score: 92 }],
            },
          ],
        }),
        { status: 200 },
      ),
    );

    const result = await scoreVietnamesePronunciationV1({
      audioBlob: new Blob([new Uint8Array([1, 2, 3])]),
      targetText: "má",
      userJwt: "jwt",
      supabaseUrl: "https://example.supabase.co/",
      fetchImpl,
      syllableContours: { ma: risingPitchContour },
    });

    expect(result.azure.fluency).toBe(88);
    expect(result.azure.prosody).toBe(77);
    expect(result.toneGrades[0].correct).toBe(true);

    const [, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    const formData = init.body as FormData;
    expect(fetchImpl.mock.calls[0][0]).toBe("https://example.supabase.co/functions/v1/azure-phoneme");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer jwt");
    expect(formData.get("target_locale")).toBe("vi-VN");
    expect(formData.get("context")).toBe("tone-drill");
  });
});
