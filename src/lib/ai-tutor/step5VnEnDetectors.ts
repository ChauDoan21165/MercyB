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

function makeHit(
  weaknessTag: "vi_l1_missing_article" | "vi_l1_plural_s",
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

export function detectStep5VnEnError(input: L1DetectionInput): L1DetectionResult {
  const baseline = detectL1Error(input);
  if (
    baseline.matched &&
    baseline.weaknessTag !== "vi_l1_missing_article" &&
    baseline.weaknessTag !== "vi_l1_plural_s"
  ) {
    return baseline;
  }

  const userTokens = tokenize(input.userAnswer);
  const expectedTokens = tokenize(input.expectedAnswer);

  return (
    detectSafeArticleOmission(userTokens, expectedTokens, input.expectedAnswer) ??
    detectSafePluralOmission(userTokens, expectedTokens, input.expectedAnswer) ??
    unmatched()
  );
}
