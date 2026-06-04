import type { ToneScoreResult } from "./scoreTone";
import {
  scoreVietnameseToneAttempt,
  type ExtractedPitchContour,
  type VietnameseToneTarget,
} from "./vietnameseToneScorer";

export type VietnameseToneFeedbackTone = "sac" | "huyen" | "ngang";
type VietnameseToneId = VietnameseToneTarget["tone"];
type SupportedVietnameseTone = VietnameseToneFeedbackTone;
type UnsupportedVietnameseTone = "hoi" | "nga" | "nang";
type VietnameseToneFeedbackKind = "correct" | "try_again" | "unsupported" | "unclear";

export type VietnameseToneFeedbackDisplay = {
  tone: VietnameseToneId;
  toneLabelVi: ToneParseResult["toneLabelVi"];
  directionLabelVi: "đi lên" | "đi xuống" | "giữ ngang";
  status: "correct" | "try_again" | "unsupported" | "unclear";
  score: number | null;
  practicePromptVi: string;
  practicePromptEn: string;
};

export interface VietnameseToneFeedback {
  kind: VietnameseToneFeedbackKind;
  tone: VietnameseToneTarget["tone"];
  titleVi: string;
  bodyVi: string;
  titleEn: string;
  bodyEn: string;
}

type ToneParseResult = VietnameseToneTarget & {
  supported: boolean;
  toneLabelVi: "sắc" | "huyền" | "ngang" | "hỏi" | "ngã" | "nặng";
  directionLabelVi: "đi lên" | "đi xuống" | "giữ ngang";
};

const SUPPORTED_TONES = new Set<VietnameseToneId>(["sac", "huyen", "ngang"]);

const TONE_LABELS: Record<VietnameseToneId, ToneParseResult["toneLabelVi"]> = {
  sac: "sắc",
  huyen: "huyền",
  ngang: "ngang",
  hoi: "hỏi",
  nga: "ngã",
  nang: "nặng",
};

const DIRECTION_LABELS: Record<SupportedVietnameseTone, ToneParseResult["directionLabelVi"]> = {
  sac: "đi lên",
  huyen: "đi xuống",
  ngang: "giữ ngang",
};

const TARGET_CONTOUR: Record<SupportedVietnameseTone, VietnameseToneTarget["expectedContour"]> = {
  sac: "rising",
  huyen: "falling",
  ngang: "level",
};

const TONE_MARK_TO_TONE: Record<string, VietnameseToneId> = {
  "\u0301": "sac",
  "\u0300": "huyen",
  "\u0309": "hoi",
  "\u0303": "nga",
  "\u0323": "nang",
};

const DIRECTION_COPY: Record<SupportedVietnameseTone, { vi: string; en: string }> = {
  sac: {
    vi: "Thử lại: đẩy đường giọng đi lên rõ hơn ở cuối âm.",
    en: "Try again: let the tone shape rise more clearly at the end.",
  },
  huyen: {
    vi: "Thử lại: hạ đường giọng xuống nhẹ và đều hơn.",
    en: "Try again: let the tone shape fall gently and steadily.",
  },
  ngang: {
    vi: "Thử lại: giữ đường giọng đều, đừng kéo lên hoặc rơi xuống quá rõ.",
    en: "Try again: keep the tone shape steady, without a clear rise or fall.",
  },
};

const MARKED_TONE_PATTERNS: Array<{ tone: Exclude<VietnameseToneId, "ngang">; pattern: RegExp }> = [
  { tone: "sac", pattern: /[áắấéếíóốớúứýÁẮẤÉẾÍÓỐỚÚỨÝ]/u },
  { tone: "huyen", pattern: /[àằầèềìòồờùừỳÀẰẦÈỀÌÒỒỜÙỪỲ]/u },
  { tone: "hoi", pattern: /[ảẳẩẻểỉỏổởủửỷẢẲẨẺỂỈỎỔỞỦỬỶ]/u },
  { tone: "nga", pattern: /[ãẵẫẽễĩõỗỡũữỹÃẴẪẼỄĨÕỖỠŨỮỸ]/u },
  { tone: "nang", pattern: /[ạặậẹệịọộợụựỵẠẶẬẸỆỊỌỘỢỤỰỴ]/u },
];

const VIETNAMESE_BASE_PATTERN = /[ăâđêôơưĂÂĐÊÔƠƯ]/u;

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
  const supported = isSupportedTone(tone);

  return {
    syllable,
    tone,
    supported,
    expectedContour: expectedContourFor(tone),
    toneLabelVi: TONE_LABELS[tone],
    directionLabelVi: supported ? DIRECTION_LABELS[tone] : "giữ ngang",
  };
}

export function buildVietnameseToneFeedbackDisplay(input: {
  target: ToneParseResult;
  result: ToneScoreResult;
}): VietnameseToneFeedbackDisplay | null {
  if (!input.target.supported || !isSupportedTone(input.target.tone)) {
    return {
      tone: input.target.tone,
      toneLabelVi: input.target.toneLabelVi,
      directionLabelVi: input.target.directionLabelVi,
      status: "unsupported",
      score: null,
      practicePromptVi: "Mercy chưa chấm chắc thanh này. Mình luyện chậm lại một lần nữa, rồi chuyển sang má / mà / ma nhé.",
      practicePromptEn: "I can't assess this tone yet. Try one slow repeat, then practice má / mà / ma.",
    };
  }
  if (input.result.bucket === "unavailable") {
    return {
      tone: input.target.tone,
      toneLabelVi: supportedToneLabel(input.target.tone),
      directionLabelVi: DIRECTION_LABELS[input.target.tone],
      status: "unclear",
      score: null,
      practicePromptVi: "Mercy chưa nghe rõ đường giọng. Thử lại chậm hơn và kéo nguyên âm rõ hơn nhé.",
      practicePromptEn: "I couldn't hear the tone shape clearly. Try again more slowly with a clearer vowel.",
    };
  }

  const score = clampScore(input.result.score);
  const status = input.result.bucket === "retry" ? "try_again" : "correct";

  return {
    tone: input.target.tone,
    toneLabelVi: supportedToneLabel(input.target.tone),
    directionLabelVi: DIRECTION_LABELS[input.target.tone],
    status,
    score,
    practicePromptVi: status === "correct"
      ? "Tốt rồi. Lặp lại một lần nữa để giữ cảm giác đường giọng."
      : "Không sao. Thử lại chậm hơn một lần, tập trung vào hướng đường giọng.",
    practicePromptEn: status === "correct"
      ? "Good. Repeat once more to keep the tone shape steady."
      : "No problem. Try once more slowly and focus on the tone direction.",
  };
}

export function inferVietnameseToneTarget(
  text: string,
  options: { allowUnmarkedNgang?: boolean } = {},
): VietnameseToneTarget | null {
  const syllable = firstToken(text);
  if (!syllable) return null;

  for (const entry of MARKED_TONE_PATTERNS) {
    if (entry.pattern.test(syllable)) {
      return {
        syllable,
        tone: entry.tone,
        expectedContour: expectedContourFor(entry.tone),
      };
    }
  }

  if (options.allowUnmarkedNgang || VIETNAMESE_BASE_PATTERN.test(syllable)) {
    return {
      syllable,
      tone: "ngang",
      expectedContour: "level",
    };
  }

  return null;
}

export function buildVietnameseToneFeedback(input: {
  target: VietnameseToneTarget;
  contour: ExtractedPitchContour | null | undefined;
}): VietnameseToneFeedback {
  const { target, contour } = input;

  if (!isSupportedTone(target.tone)) {
    return unsupportedFeedback(target.tone as UnsupportedVietnameseTone);
  }

  if (!contour) {
    return unclearFeedback(target.tone);
  }

  const score = scoreVietnameseToneAttempt({ contour, target });
  if (score.bucket === "close") {
    return {
      kind: "correct",
      tone: target.tone,
      titleVi: `Thanh ${TONE_LABELS[target.tone]} nghe khá đúng.`,
      bodyVi: "Đường giọng nhìn gần với mẫu. Mình luyện thêm một lần nữa cho chắc nhé.",
      titleEn: `${TONE_LABELS[target.tone]} tone shape looks close.`,
      bodyEn: "The pitch contour is close to the model. Try one more slow repeat.",
    };
  }

  if (score.bucket === "not_close") {
    const copy = DIRECTION_COPY[target.tone];
    return {
      kind: "try_again",
      tone: target.tone,
      titleVi: `Thanh ${TONE_LABELS[target.tone]} chưa rõ.`,
      bodyVi: copy.vi,
      titleEn: `${TONE_LABELS[target.tone]} tone shape is not close yet.`,
      bodyEn: copy.en,
    };
  }

  return unclearFeedback(target.tone);
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

function expectedContourFor(tone: VietnameseToneId): VietnameseToneTarget["expectedContour"] {
  return isSupportedTone(tone) ? TARGET_CONTOUR[tone] : "unsupported";
}

function isSupportedTone(tone: VietnameseToneId): tone is SupportedVietnameseTone {
  return SUPPORTED_TONES.has(tone);
}

function clampScore(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function supportedToneLabel(tone: SupportedVietnameseTone): VietnameseToneFeedbackDisplay["toneLabelVi"] {
  if (tone === "sac") return "sắc";
  if (tone === "huyen") return "huyền";
  return "ngang";
}

function unsupportedFeedback(tone: UnsupportedVietnameseTone): VietnameseToneFeedback {
  return {
    kind: "unsupported",
    tone,
    titleVi: `Mercy chưa chấm chắc thanh ${TONE_LABELS[tone]} được.`,
    bodyVi: "Mercy chưa chấm được thanh này một cách chắc chắn. Mình luyện lại chậm hơn nhé.",
    titleEn: `I can't assess ${TONE_LABELS[tone]} yet.`,
    bodyEn: "I can't assess this tone yet. Let's keep practicing slowly.",
  };
}

function unclearFeedback(tone: VietnameseToneId): VietnameseToneFeedback {
  return {
    kind: "unclear",
    tone,
    titleVi: "Mercy chưa nghe rõ đường giọng.",
    bodyVi: "Mình thử lại chậm hơn, rõ nguyên âm hơn nhé.",
    titleEn: "I couldn't hear the tone shape clearly.",
    bodyEn: "Try again more slowly with a clearer vowel.",
  };
}

function firstToken(text: string): string {
  return String(text || "")
    .normalize("NFC")
    .split(/\s+/u)
    .map((token) => token.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ""))
    .find(Boolean) ?? "";
}
