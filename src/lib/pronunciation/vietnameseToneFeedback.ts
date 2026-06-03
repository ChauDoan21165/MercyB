import type { ToneScoreResult } from "./scoreTone";
import type {
  VietnameseToneTarget,
} from "./vietnameseToneScorer";

export type VietnameseToneFeedbackTone = "sac" | "huyen" | "ngang";
type VietnameseToneId = VietnameseToneTarget["tone"];

export type VietnameseToneFeedbackDisplay = {
  tone: VietnameseToneFeedbackTone;
  toneLabelVi: "sắc" | "huyền" | "ngang";
  directionLabelVi: "đi lên" | "đi xuống" | "giữ ngang";
  status: "correct" | "try_again";
  score: number;
};

type ToneParseResult = VietnameseToneTarget & {
  supported: boolean;
  toneLabelVi: "sắc" | "huyền" | "ngang" | "hỏi" | "ngã" | "nặng";
  directionLabelVi: "đi lên" | "đi xuống" | "giữ ngang";
};

const TONE_MARK_TO_TONE: Record<string, VietnameseToneId> = {
  "\u0301": "sac",
  "\u0300": "huyen",
  "\u0309": "hoi",
  "\u0303": "nga",
  "\u0323": "nang",
};

const TONE_LABELS: Record<VietnameseToneId, ToneParseResult["toneLabelVi"]> = {
  sac: "sắc",
  huyen: "huyền",
  ngang: "ngang",
  hoi: "hỏi",
  nga: "ngã",
  nang: "nặng",
};

const DIRECTION_LABELS: Record<VietnameseToneFeedbackTone, ToneParseResult["directionLabelVi"]> = {
  sac: "đi lên",
  huyen: "đi xuống",
  ngang: "giữ ngang",
};

export function resolveVietnameseTonePracticeTarget(rawText: string): ToneParseResult | null {
  const trimmed = String(rawText ?? "").trim();
  if (!trimmed) return null;

  const tokens = trimmed
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
  if (tokens.length !== 1) return null;

  const syllable = tokens[0].replace(/^[^A-Za-zÀ-ỹĐđ]+|[^A-Za-zÀ-ỹĐđ]+$/gu, "");
  if (!syllable) return null;
  const tone = detectTone(syllable);
  const supported = tone === "sac" || tone === "huyen" || tone === "ngang";

  return {
    syllable,
    tone,
    supported,
    expectedContour: supported ? DIRECTION_TO_CONTOUR[tone] : "unsupported",
    toneLabelVi: TONE_LABELS[tone],
    directionLabelVi: supported ? DIRECTION_LABELS[tone] : "giữ ngang",
  };
}

export function buildVietnameseToneFeedbackDisplay(input: {
  target: ToneParseResult;
  result: ToneScoreResult;
}): VietnameseToneFeedbackDisplay | null {
  if (!input.target.supported || !isSupportedTone(input.target.tone)) return null;
  if (input.result.bucket === "unavailable") return null;

  const score = clampScore(input.result.score);
  const status = input.result.bucket === "retry" ? "try_again" : "correct";
  const toneLabelVi = getSupportedToneLabel(input.target.tone);
  const directionLabelVi = getSupportedToneDirection(input.target.tone);

  return {
    tone: input.target.tone,
    toneLabelVi,
    directionLabelVi,
    status,
    score,
  };
}

function detectTone(syllable: string): ToneParseResult["tone"] {
  const nfd = syllable.normalize("NFD");
  for (const character of nfd) {
    if (character in TONE_MARK_TO_TONE) {
      return TONE_MARK_TO_TONE[character];
    }
  }
  return "ngang";
}

function isSupportedTone(tone: VietnameseToneId): tone is VietnameseToneFeedbackTone {
  return tone === "sac" || tone === "huyen" || tone === "ngang";
}

function getSupportedToneLabel(tone: VietnameseToneFeedbackTone): VietnameseToneFeedbackDisplay["toneLabelVi"] {
  if (tone === "sac") return "sắc";
  if (tone === "huyen") return "huyền";
  return "ngang";
}

function getSupportedToneDirection(tone: VietnameseToneFeedbackTone): VietnameseToneFeedbackDisplay["directionLabelVi"] {
  if (tone === "sac") return "đi lên";
  if (tone === "huyen") return "đi xuống";
  return "giữ ngang";
}

const DIRECTION_TO_CONTOUR: Record<VietnameseToneFeedbackTone, VietnameseToneTarget["expectedContour"]> = {
  sac: "rising",
  huyen: "falling",
  ngang: "level",
};

function clampScore(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
