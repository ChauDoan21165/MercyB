import {
  detectL1Error,
  type L1DetectionInput,
  type L1DetectionResult,
} from "@/lib/feedback";

const ARTICLES = new Set(["a", "an", "the"]);

const SAFE_ARTICLE_NOUNS = new Set([
  "apple",
  "book",
  "car",
  "cat",
  "chair",
  "desk",
  "dog",
  "door",
  "friend",
  "house",
  "market",
  "movie",
  "pen",
  "phone",
  "room",
  "table",
  "teacher",
  "student",
  "doctor",
  "engineer",
  "nurse",
  "worker",
]);

const PLURAL_CUES = new Set([
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "many",
  "several",
  "few",
  "both",
]);

const UNCOUNTABLE_NOUNS = new Set([
  "advice",
  "equipment",
  "furniture",
  "homework",
  "information",
  "knowledge",
  "luggage",
  "money",
  "music",
  "news",
  "research",
  "water",
]);

const THIRD_PERSON_SUBJECTS = new Set(["he", "she", "it"]);
const SAFE_SVA_VERBS: Readonly<Record<string, string>> = {
  go: "goes",
  make: "makes",
  work: "works",
};
const PAST_TIME_CUES = new Set(["yesterday", "ago", "last"]);
const AUXILIARY_GUARDS = new Set([
  "am",
  "are",
  "can",
  "could",
  "did",
  "do",
  "does",
  "had",
  "has",
  "have",
  "is",
  "may",
  "might",
  "must",
  "shall",
  "should",
  "was",
  "were",
  "will",
  "would",
]);
const PREPOSITION_PATTERNS: ReadonlyArray<{
  user: readonly string[];
  expected: readonly string[];
}> = [
  { user: ["depend", "of"], expected: ["depend", "on"] },
  { user: ["interested", "with"], expected: ["interested", "in"] },
  { user: ["good", "in", "english"], expected: ["good", "at", "english"] },
  { user: ["listen", "music"], expected: ["listen", "to", "music"] },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,;:!"'()[\]{}]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function unmatched(): L1DetectionResult {
  return { matched: false, weaknessTag: null, feedback: null };
}

function isPluralCue(token: string): boolean {
  if (PLURAL_CUES.has(token)) return true;
  const numeric = Number(token);
  return Number.isFinite(numeric) && numeric >= 2;
}

function isRegularPluralOf(singular: string, plural: string): boolean {
  if (!singular || !plural || singular === plural) return false;
  if (UNCOUNTABLE_NOUNS.has(singular)) return false;
  if (plural === `${singular}s`) return true;
  if (plural === `${singular}es` && /(s|x|z|ch|sh)$/.test(singular)) return true;
  if (singular.endsWith("y") && plural === `${singular.slice(0, -1)}ies`) return true;
  return false;
}

function hasPastCue(tokens: string[]): boolean {
  return tokens.some((token) => PAST_TIME_CUES.has(token));
}

function isQuestionOrAuxiliaryContext(tokens: string[], subjectIndex: number): boolean {
  const firstToken = tokens[0];
  if (firstToken && AUXILIARY_GUARDS.has(firstToken)) return true;

  const previousToken = tokens[subjectIndex - 1];
  return Boolean(previousToken && AUXILIARY_GUARDS.has(previousToken));
}

function sameExcept(
  userTokens: string[],
  expectedTokens: string[],
  changedIndex: number,
): boolean {
  return userTokens.every((token, index) =>
    index === changedIndex ? true : token === expectedTokens[index],
  );
}

function replaceTokenSlice(
  tokens: string[],
  start: number,
  removeCount: number,
  replacement: readonly string[],
): string[] {
  return tokens
    .slice(0, start)
    .concat([...replacement], tokens.slice(start + removeCount));
}

function startsWithSequence(
  tokens: string[],
  start: number,
  sequence: readonly string[],
): boolean {
  return sequence.every((token, index) => tokens[start + index] === token);
}

function sameTokens(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((token, index) => token === right[index]);
}

function makeHit(
  weaknessTag:
    | "vi_l1_3rd_person_s"
    | "vi_l1_missing_article"
    | "vi_l1_plural_s"
    | "vi_l1_preposition_transfer",
  expectedAnswer: string,
  message: string,
): L1DetectionResult {
  return {
    matched: true,
    weaknessTag,
    feedback: {
      en: `${message} Try: *${expectedAnswer}*.`,
      vi: `${message} Thử: *${expectedAnswer}*.`,
    },
  };
}

function detectSafeArticleOmission(
  userTokens: string[],
  expectedTokens: string[],
  expectedAnswer: string,
): L1DetectionResult | null {
  if (expectedTokens.length !== userTokens.length + 1) return null;

  for (let i = 0; i < expectedTokens.length; i++) {
    if (!ARTICLES.has(expectedTokens[i])) continue;
    const noun = expectedTokens[i + 1];
    if (!noun || !SAFE_ARTICLE_NOUNS.has(noun)) continue;

    const withoutArticle = expectedTokens
      .slice(0, i)
      .concat(expectedTokens.slice(i + 1));
    if (!withoutArticle.every((token, index) => token === userTokens[index])) continue;

    return makeHit(
      "vi_l1_missing_article",
      expectedAnswer,
      "English often needs a small article before one concrete thing or one job word.",
    );
  }

  return null;
}

function detectSafePluralOmission(
  userTokens: string[],
  expectedTokens: string[],
  expectedAnswer: string,
): L1DetectionResult | null {
  if (expectedTokens.length !== userTokens.length) return null;

  for (let i = 1; i < userTokens.length; i++) {
    if (!isPluralCue(userTokens[i - 1])) continue;
    if (!isRegularPluralOf(userTokens[i], expectedTokens[i])) continue;

    return makeHit(
      "vi_l1_plural_s",
      expectedAnswer,
      "After a number word like two or many, English still marks the noun as plural.",
    );
  }

  return null;
}

function detectSafeSvaOmission(
  userTokens: string[],
  expectedTokens: string[],
  expectedAnswer: string,
): L1DetectionResult | null {
  if (expectedTokens.length !== userTokens.length) return null;
  if (hasPastCue(userTokens)) return null;

  for (let i = 0; i < userTokens.length - 1; i++) {
    if (!THIRD_PERSON_SUBJECTS.has(userTokens[i])) continue;
    if (isQuestionOrAuxiliaryContext(userTokens, i)) continue;

    const userVerb = userTokens[i + 1];
    const expectedVerb = expectedTokens[i + 1];
    if (SAFE_SVA_VERBS[userVerb] !== expectedVerb) continue;
    if (!sameExcept(userTokens, expectedTokens, i + 1)) continue;

    return makeHit(
      "vi_l1_3rd_person_s",
      expectedAnswer,
      "With he, she, or it in the present simple, English often adds -s to the verb.",
    );
  }

  return null;
}

function detectSafePrepositionTransfer(
  userTokens: string[],
  expectedTokens: string[],
  expectedAnswer: string,
): L1DetectionResult | null {
  for (const pattern of PREPOSITION_PATTERNS) {
    for (let i = 0; i <= userTokens.length - pattern.user.length; i++) {
      if (!startsWithSequence(userTokens, i, pattern.user)) continue;

      const repaired = replaceTokenSlice(
        userTokens,
        i,
        pattern.user.length,
        pattern.expected,
      );
      if (!sameTokens(repaired, expectedTokens)) continue;

      return makeHit(
        "vi_l1_preposition_transfer",
        expectedAnswer,
        "Some English phrases need a fixed preposition.",
      );
    }
  }

  return null;
}

export function detectStep5VnEnError(input: L1DetectionInput): L1DetectionResult {
  const baseline = detectL1Error(input);
  if (
    baseline.matched &&
    baseline.weaknessTag !== "vi_l1_3rd_person_s" &&
    baseline.weaknessTag !== "vi_l1_missing_article" &&
    baseline.weaknessTag !== "vi_l1_plural_s" &&
    baseline.weaknessTag !== "vi_l1_preposition_transfer"
  ) {
    return baseline;
  }

  const userTokens = tokenize(input.userAnswer);
  const expectedTokens = tokenize(input.expectedAnswer);

  return (
    detectSafeArticleOmission(userTokens, expectedTokens, input.expectedAnswer) ??
    detectSafePluralOmission(userTokens, expectedTokens, input.expectedAnswer) ??
    detectSafeSvaOmission(userTokens, expectedTokens, input.expectedAnswer) ??
    detectSafePrepositionTransfer(userTokens, expectedTokens, input.expectedAnswer) ??
    unmatched()
  );
}
