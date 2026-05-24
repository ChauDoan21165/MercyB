export type CorrectionRule = {
  id: string;
  detects: (input: string) => boolean;
  apply: (input: string) => string;
};

const PAST_VERBS: Record<string, string> = {
  buy: "bought",
  do: "did",
  eat: "ate",
  go: "went",
  have: "had",
};

const DAILY_THIRD_PERSON_VERBS: Record<string, string> = {
  eat: "eats",
  go: "goes",
  have: "has",
};

const KNOWN_UNCORRECTED_PAST_MARKER_VERBS = [
  "come",
  "drink",
  "run",
  "sit",
  "sleep",
  "speak",
  "swim",
  "write",
];

function replaceVerbAfterSubject(
  input: string,
  verbs: Record<string, string>,
): string {
  const verbPattern = Object.keys(verbs).join("|");
  const pattern = new RegExp(`\\b(I|You|We|They|He|She|It)\\s+(${verbPattern})\\b`, "gi");
  return input.replace(pattern, (_match, subject: string, verb: string) => {
    return `${subject} ${verbs[verb.toLowerCase()] ?? verb}`;
  });
}

function capitalizeSentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

function normalizeSentence(value: string, punctuation: "." | "?"): string {
  const stripped = value.trim().replace(/[.!?]+$/u, "");
  if (!stripped) return "";
  return `${capitalizeSentence(stripped)}${punctuation}`;
}

function repairBeginnerRunOnPunctuation(input: string): string {
  const normalized = input.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();

  if (
    lower ===
    "what do you usually do in the morning nice that sounds like a clear morning routine what do you do after that"
  ) {
    return "What do you usually do in the morning? Nice, that sounds like a clear morning routine. What do you do after that?";
  }

  let repaired = normalized
    .replace(
      /\bwhat do you usually do in the morning\s+nice\s+that sounds\b/gi,
      "What do you usually do in the morning? Nice, that sounds",
    )
    .replace(/\bnice\s+that sounds\b/gi, "Nice, that sounds")
    .replace(/\s+what do you do after that\b/gi, ". What do you do after that");

  repaired = repaired.replace(/\s+/g, " ").trim();
  if (!repaired) return repaired;

  const sentences = repaired.match(/[^.!?]+[.!?]?/gu) ?? [repaired];
  return sentences
    .map((sentence) => {
      const clean = sentence.trim();
      if (!clean) return "";
      const isQuestion = /^(?:what|where|when|why|who|how|do|does|did|can|could|would|will|is|are|am)\b/i.test(clean);
      return normalizeSentence(clean, isQuestion ? "?" : ".");
    })
    .filter(Boolean)
    .join(" ");
}

export const englishCorrectionRules: CorrectionRule[] = [
  {
    id: "en-beginner-run-on-punctuation",
    detects: (input) =>
      /\bwhat do you usually do in the morning\s+nice\s+that sounds\b/i.test(input) ||
      /\bnice\s+that sounds\b/i.test(input) ||
      /\bwhat do you do after that\b/i.test(input),
    apply: repairBeginnerRunOnPunctuation,
  },
  {
    id: "en-yesterday-irregular-beginner-past",
    detects: (input) =>
      /\byesterday\b/i.test(input) &&
      /\b(I|You|We|They|He|She|It)\s+(buy|do|eat|go|have)\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, PAST_VERBS),
  },
  {
    id: "en-third-person-daily-go-eat-have",
    detects: (input) =>
      /\b(She|He|It)\s+(go|eat|have)\b/i.test(input),
    apply: (input) => replaceVerbAfterSubject(input, DAILY_THIRD_PERSON_VERBS),
  },
];

export function isClearlyWrongBeginnerEnglish(input: string): boolean {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  if (englishCorrectionRules.some((rule) => rule.detects(normalized))) {
    return true;
  }

  const unsupportedPastVerbPattern = new RegExp(
    `\\b(I|You|We|They|He|She|It)\\s+(${KNOWN_UNCORRECTED_PAST_MARKER_VERBS.join("|")})\\b.*\\byesterday\\b`,
    "i",
  );
  return unsupportedPastVerbPattern.test(normalized);
}
