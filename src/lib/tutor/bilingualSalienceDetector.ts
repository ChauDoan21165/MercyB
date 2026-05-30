export type BilingualSalienceSignalType =
  | "high_stakes"
  | "ordinary_salience"
  | "contradiction";

export type BilingualSaliencePivot = {
  signalType: BilingualSalienceSignalType;
  matchedText: string;
  priority: number;
  confidence: number;
  highStakes: boolean;
};

type SaliencePattern = {
  phrase: string;
  signalType: BilingualSalienceSignalType;
  priority: number;
  confidence: number;
  highStakes: boolean;
};

const HIGH_STAKES_EN = [
  "passed away",
  "family problem",
  "died",
  "sick",
  "lost",
  "scared",
  "afraid",
  "hurt",
  "accident",
  "problem",
];

const HIGH_STAKES_VI = [
  "tai nạn",
  "vấn đề",
  "mất",
  "chết",
  "bệnh",
  "ốm",
  "sợ",
  "đau",
  "buồn",
  "lo",
];

const ORDINARY_EN = [
  "burned",
  "tired",
  "expensive",
  "delicious",
  "scary",
  "fun",
  "boring",
  "lucky",
  "hard",
  "easy",
];

const ORDINARY_VI = [
  "vui",
  "mệt",
  "giỏi",
  "hay",
  "dở",
  "thích",
  "ghét",
];

const CONTRADICTION_MARKERS = [
  "not really",
  "actually",
  "but",
  "không",
  "nhưng",
];

const PATTERNS: SaliencePattern[] = [
  ...HIGH_STAKES_EN.map((phrase) => highStakesPattern(phrase)),
  ...HIGH_STAKES_VI.map((phrase) => highStakesPattern(phrase)),
  ...CONTRADICTION_MARKERS.map((phrase) => ({
    phrase,
    signalType: "contradiction" as const,
    priority: 70,
    confidence: 0.78,
    highStakes: false,
  })),
  ...ORDINARY_EN.map((phrase) => ordinaryPattern(phrase)),
  ...ORDINARY_VI.map((phrase) => ordinaryPattern(phrase)),
];

function highStakesPattern(phrase: string): SaliencePattern {
  return {
    phrase,
    signalType: "high_stakes",
    priority: 100,
    confidence: 0.95,
    highStakes: true,
  };
}

function ordinaryPattern(phrase: string): SaliencePattern {
  return {
    phrase,
    signalType: "ordinary_salience",
    priority: 50,
    confidence: 0.72,
    highStakes: false,
  };
}

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseRegex(phrase: string): RegExp {
  const body = escapeRegExp(normalizeText(phrase)).replace(/\\ /g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])`, "u");
}

function findMatch(text: string, phrase: string): string | null {
  const match = text.match(phraseRegex(phrase));
  return match?.[0] ?? null;
}

export function detectBilingualSaliencePivot(
  learnerReply: string,
): BilingualSaliencePivot | null {
  const normalized = normalizeText(learnerReply);
  if (!normalized) return null;

  let best: BilingualSaliencePivot | null = null;
  for (const pattern of PATTERNS) {
    const matchedText = findMatch(normalized, pattern.phrase);
    if (!matchedText) continue;

    const candidate: BilingualSaliencePivot = {
      signalType: pattern.signalType,
      matchedText,
      priority: pattern.priority,
      confidence: pattern.confidence,
      highStakes: pattern.highStakes,
    };

    if (!best || candidate.priority > best.priority) {
      best = candidate;
    }
  }

  return best;
}
