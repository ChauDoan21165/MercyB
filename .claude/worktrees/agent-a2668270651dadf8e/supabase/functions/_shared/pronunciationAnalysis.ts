// supabase/functions/_shared/pronunciationAnalysis.ts

export type PronunciationCategory =
  | "ending_sound"
  | "vowel_length"
  | "word_stress"
  | "unknown";

export type AccentPattern =
  | "final_consonant_drop"
  | "vowel_confusion"
  | "stress_shift"
  | "consonant_substitution"
  | "unknown";

export type SubstitutedPair = {
  target: string;
  actual: string;
};

export type PhonemeSubstitution = {
  expected: string;
  actual: string;
};

export type PhonemeComparison = {
  similarityScore: number;
  missingPhonemes: string[];
  substitutedPhonemes: PhonemeSubstitution[];
};

export type AnalysisFocusItem = {
  word: string;
  category: PronunciationCategory;
  accentPattern: AccentPattern;
  phonemeComparison?: PhonemeComparison;
};

export type AccentPatternSummary = {
  final_consonant_drop: number;
  vowel_confusion: number;
  stress_shift: number;
  consonant_substitution: number;
};

export type ComparisonAnalysis = {
  normalizedTargetText: string;
  normalizedTranscriptText: string;
  targetTokens: string[];
  transcriptTokens: string[];
  missingWords: string[];
  extraWords: string[];
  substitutedPairs: SubstitutedPair[];
  candidateFocusWords: string[];
  closenessRatio: number;
  mismatchCount: number;
};

export type PronunciationEvidence = {
  targetText: string;
  transcribedText: string;
  inputDurationMs?: number;
};

export type PronunciationAnalysisResult = {
  analysis: ComparisonAnalysis;
  score: number;
  focusItems: AnalysisFocusItem[];
  expectedDurationMs: number;
  suggestedPractice: string[];
  accentPatterns: AccentPatternSummary;
};

const ENDING_SOUND_PATTERN = /[sdtkpgfz]$/i;
const VOWEL_PHONEMES = new Set([
  "a",
  "e",
  "i",
  "o",
  "u",
  "æ",
  "ʌ",
  "ə",
  "ɪ",
  "iː",
  "uː",
  "ɛ",
  "ɔ",
  "ɑ",
  "ɚ",
  "ɝ",
  "ɒ",
  "ʊ",
  "ai",
  "au",
  "oi",
]);
const SPECIAL_PHONEMES = new Set([
  "θ",
  "ʃ",
  "tʃ",
  "iː",
  "uː",
  "ŋ",
  "kw",
  "ai",
  "au",
  "oi",
]);

const substitutionMapCache = new WeakMap<ComparisonAnalysis, Map<string, SubstitutedPair>>();
const wordAnalysisCache = new WeakMap<
  ComparisonAnalysis,
  Map<string, { category: PronunciationCategory; accentPattern: AccentPattern }>
>();
const phonemeComparisonCache = new WeakMap<
  ComparisonAnalysis,
  Map<string, PhonemeComparison>
>();

export function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeText(input: string): string {
  return safeString(input)
    .toLowerCase()
    .replace(/n't/g, " not")
    .replace(/'m/g, " am")
    .replace(/'re/g, " are")
    .replace(/'s/g, " is")
    .replace(/'ll/g, " will")
    .replace(/'ve/g, " have")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(input: string): string[] {
  const normalized = normalizeText(input);
  return normalized ? normalized.split(" ").filter(Boolean) : [];
}

export function dedupeStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const cleaned = safeString(value);
    const key = normalizeText(cleaned);
    if (!cleaned || !key || seen.has(key)) continue;
    seen.add(key);
    result.push(cleaned);
  }

  return result;
}

export function longestCommonSubsequenceIndices(a: string[], b: string[]) {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0)
  );

  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      if (a[i] === b[j]) {
        dp[i][j] = dp[i + 1][j + 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const matches: Array<{ i: number; j: number }> = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      matches.push({ i, j });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }

  return { matches, lcsLength: dp[0][0] };
}

export function approximatePhonemeTokens(word: string): string[] {
  let normalized = normalizeText(word);
  if (!normalized) return [];

  const replacements: Array<[RegExp, string]> = [
    [/ph/g, " f "],
    [/th/g, " θ "],
    [/sh/g, " ʃ "],
    [/ch/g, " tʃ "],
    [/ee/g, " iː "],
    [/oo/g, " uː "],
    [/ea/g, " iː "],
    [/ck/g, " k "],
    [/ng/g, " ŋ "],
    [/qu/g, " kw "],
    [/igh/g, " ai "],
    [/ou/g, " au "],
    [/oi/g, " oi "],
  ];

  for (const [pattern, replacement] of replacements) {
    normalized = normalized.replace(pattern, replacement);
  }

  normalized = normalized
    .replace(/a/g, " a ")
    .replace(/e/g, " e ")
    .replace(/i/g, " i ")
    .replace(/o/g, " o ")
    .replace(/u/g, " u ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = normalized.split(" ").filter(Boolean);

  return tokens.flatMap((token) =>
    token.length > 1 &&
        !SPECIAL_PHONEMES.has(token) &&
        !VOWEL_PHONEMES.has(token)
      ? token.split("")
      : [token]
  );
}

function looksLikeVowelSubstitution(targetWord: string, actualWord: string): boolean {
  const targetPhonemes = approximatePhonemeTokens(targetWord);
  const actualPhonemes = approximatePhonemeTokens(actualWord);

  if (
    targetPhonemes.length === 0 ||
    actualPhonemes.length === 0 ||
    targetPhonemes.length !== actualPhonemes.length
  ) {
    return false;
  }

  let differences = 0;
  let vowelDifference = false;

  for (let i = 0; i < targetPhonemes.length; i++) {
    if (targetPhonemes[i] !== actualPhonemes[i]) {
      differences++;
      if (
        VOWEL_PHONEMES.has(targetPhonemes[i]) ||
        VOWEL_PHONEMES.has(actualPhonemes[i])
      ) {
        vowelDifference = true;
      }
    }
  }

  return differences > 0 && differences <= 2 && vowelDifference;
}

function looksLikeConsonantSubstitution(targetWord: string, actualWord: string): boolean {
  const targetPhonemes = approximatePhonemeTokens(targetWord);
  const actualPhonemes = approximatePhonemeTokens(actualWord);

  if (
    targetPhonemes.length === 0 ||
    actualPhonemes.length === 0 ||
    targetPhonemes.length !== actualPhonemes.length
  ) {
    return false;
  }

  let differences = 0;
  let consonantDifference = false;

  for (let i = 0; i < targetPhonemes.length; i++) {
    if (targetPhonemes[i] !== actualPhonemes[i]) {
      differences++;
      const targetIsVowel = VOWEL_PHONEMES.has(targetPhonemes[i]);
      const actualIsVowel = VOWEL_PHONEMES.has(actualPhonemes[i]);
      if (!targetIsVowel && !actualIsVowel) {
        consonantDifference = true;
      }
    }
  }

  return differences > 0 && differences <= 2 && consonantDifference;
}

function looksLikeDroppedEndingSound(targetWord: string, actualWord: string): boolean {
  const normalizedTarget = normalizeText(targetWord);
  const normalizedActual = normalizeText(actualWord);

  if (!normalizedTarget || !normalizedActual) return false;
  if (!ENDING_SOUND_PATTERN.test(normalizedTarget)) return false;
  if (normalizedTarget.length <= normalizedActual.length) return false;
  if (!normalizedTarget.startsWith(normalizedActual)) return false;

  const lengthDifference = normalizedTarget.length - normalizedActual.length;
  if (lengthDifference < 1 || lengthDifference > 2) return false;

  const droppedPart = normalizedTarget.slice(normalizedActual.length);
  if (!droppedPart) return false;

  if (lengthDifference === 1) {
    return /[sdtkpgfz]$/i.test(droppedPart);
  }

  if (droppedPart === "ed") {
    return true;
  }

  const fullEnding = normalizedTarget.slice(-2);
  if (fullEnding === "st" && droppedPart === "t") return true;
  if (fullEnding === "sk" && droppedPart === "k") return true;
  if (fullEnding === "sp" && droppedPart === "p") return true;
  if (fullEnding === "nd" && droppedPart === "d") return true;
  if (fullEnding === "nt" && droppedPart === "t") return true;
  if (fullEnding === "ld" && droppedPart === "d") return true;
  if (fullEnding === "lf" && droppedPart === "f") return true;
  if (fullEnding === "ft" && droppedPart === "t") return true;
  if (fullEnding === "kt" && droppedPart === "t") return true;
  if (fullEnding === "pt" && droppedPart === "t") return true;
  if (fullEnding === "rd" && droppedPart === "d") return true;
  if (fullEnding === "rk" && droppedPart === "k") return true;
  if (fullEnding === "mp" && droppedPart === "p") return true;
  if (fullEnding === "nz" && droppedPart === "z") return true;
  if (fullEnding === "ts" && droppedPart === "s") return true;

  return false;
}

function areMissingPhonemesAtWordEnd(
  targetWord: string,
  spokenWord: string,
  comparison: PhonemeComparison,
): boolean {
  if (comparison.missingPhonemes.length === 0) return false;
  if (comparison.similarityScore < 0.75) return false;
  if (comparison.substitutedPhonemes.length > 0) return false;

  const targetPhonemes = approximatePhonemeTokens(targetWord);
  const spokenPhonemes = approximatePhonemeTokens(spokenWord);

  if (targetPhonemes.length === 0 || spokenPhonemes.length === 0) return false;
  if (targetPhonemes.length <= spokenPhonemes.length) return false;

  const missingCount = targetPhonemes.length - spokenPhonemes.length;
  if (missingCount < 1 || missingCount > 2) return false;

  const expectedPrefix = targetPhonemes.slice(0, targetPhonemes.length - missingCount);
  if (expectedPrefix.length !== spokenPhonemes.length) return false;

  for (let i = 0; i < spokenPhonemes.length; i++) {
    if (spokenPhonemes[i] !== expectedPrefix[i]) return false;
  }

  const missingSuffix = targetPhonemes.slice(-missingCount);
  if (missingSuffix.length !== comparison.missingPhonemes.length) return false;

  return missingSuffix.every((phoneme, index) =>
    phoneme === comparison.missingPhonemes[index]
  );
}

function createSubstitutionMap(
  analysis: ComparisonAnalysis,
): Map<string, SubstitutedPair> {
  const cached = substitutionMapCache.get(analysis);
  if (cached) return cached;

  const map = new Map<string, SubstitutedPair>();

  for (const pair of analysis.substitutedPairs) {
    const key = normalizeText(pair.target);
    if (key && !map.has(key)) {
      map.set(key, pair);
    }
  }

  substitutionMapCache.set(analysis, map);
  return map;
}

function getAnalysisPhonemeComparisonGetter(
  analysis: ComparisonAnalysis,
): (targetWord: string, actualWord: string) => PhonemeComparison {
  let perAnalysis = phonemeComparisonCache.get(analysis);
  if (!perAnalysis) {
    perAnalysis = new Map<string, PhonemeComparison>();
    phonemeComparisonCache.set(analysis, perAnalysis);
  }

  return (targetWord: string, actualWord: string): PhonemeComparison => {
    const key = `${normalizeText(targetWord)}__${normalizeText(actualWord)}`;
    const cached = perAnalysis.get(key);
    if (cached) return cached;

    const comparison = comparePhonemes(targetWord, actualWord);
    perAnalysis.set(key, comparison);
    return comparison;
  };
}

function hasLikelyDroppedEndingByPhoneme(
  targetWord: string,
  actualWord: string,
  getComparison: (targetWord: string, actualWord: string) => PhonemeComparison,
): boolean {
  if (looksLikeVowelSubstitution(targetWord, actualWord)) return false;
  if (looksLikeConsonantSubstitution(targetWord, actualWord)) return false;

  const comparison = getComparison(targetWord, actualWord);
  return areMissingPhonemesAtWordEnd(targetWord, actualWord, comparison);
}

function isLikelyEndingSoundIssueInternal(input: {
  normalizedWord: string;
  analysis: ComparisonAnalysis;
  substitution?: SubstitutedPair;
  getComparison: (targetWord: string, actualWord: string) => PhonemeComparison;
}): boolean {
  const { normalizedWord, analysis, substitution, getComparison } = input;
  if (!normalizedWord) return false;

  const isMissing = analysis.missingWords.some((w) => normalizeText(w) === normalizedWord);
  if (isMissing && ENDING_SOUND_PATTERN.test(normalizedWord)) {
    return true;
  }

  if (!substitution) return false;

  if (looksLikeDroppedEndingSound(substitution.target, substitution.actual)) {
    return true;
  }

  // Conservative backup signal only when the simpler string rule did not match.
  return hasLikelyDroppedEndingByPhoneme(
    substitution.target,
    substitution.actual,
    getComparison,
  );
}

function detectPronunciationCategoryInternal(input: {
  normalizedWord: string;
  analysis: ComparisonAnalysis;
  substitution?: SubstitutedPair;
  getComparison: (targetWord: string, actualWord: string) => PhonemeComparison;
}): PronunciationCategory {
  const { normalizedWord, analysis, substitution, getComparison } = input;
  if (!normalizedWord) return "unknown";

  if (
    isLikelyEndingSoundIssueInternal({
      normalizedWord,
      analysis,
      substitution,
      getComparison,
    })
  ) {
    return "ending_sound";
  }

  if (substitution && looksLikeVowelSubstitution(substitution.target, substitution.actual)) {
    return "vowel_length";
  }

  if (substitution && normalizedWord.length >= 7) {
    return "word_stress";
  }

  return "unknown";
}

function detectAccentPatternInternal(input: {
  normalizedWord: string;
  analysis: ComparisonAnalysis;
  substitution?: SubstitutedPair;
  getComparison: (targetWord: string, actualWord: string) => PhonemeComparison;
}): AccentPattern {
  const { normalizedWord, analysis, substitution, getComparison } = input;
  if (!normalizedWord) return "unknown";

  if (
    isLikelyEndingSoundIssueInternal({
      normalizedWord,
      analysis,
      substitution,
      getComparison,
    })
  ) {
    return "final_consonant_drop";
  }

  if (!substitution) {
    return "unknown";
  }

  if (looksLikeVowelSubstitution(substitution.target, substitution.actual)) {
    return "vowel_confusion";
  }

  if (normalizedWord.length >= 7) {
    return "stress_shift";
  }

  if (looksLikeConsonantSubstitution(substitution.target, substitution.actual)) {
    return "consonant_substitution";
  }

  return "unknown";
}

function getCachedWordAnalysis(
  normalizedWord: string,
  analysis: ComparisonAnalysis,
): { category: PronunciationCategory; accentPattern: AccentPattern } {
  let perAnalysis = wordAnalysisCache.get(analysis);
  if (!perAnalysis) {
    perAnalysis = new Map<string, {
      category: PronunciationCategory;
      accentPattern: AccentPattern;
    }>();
    wordAnalysisCache.set(analysis, perAnalysis);
  }

  const cached = perAnalysis.get(normalizedWord);
  if (cached) return cached;

  const substitution = createSubstitutionMap(analysis).get(normalizedWord);
  const getComparison = getAnalysisPhonemeComparisonGetter(analysis);

  const result = {
    category: detectPronunciationCategoryInternal({
      normalizedWord,
      analysis,
      substitution,
      getComparison,
    }),
    accentPattern: detectAccentPatternInternal({
      normalizedWord,
      analysis,
      substitution,
      getComparison,
    }),
  };

  perAnalysis.set(normalizedWord, result);
  return result;
}

export function comparePhonemes(
  targetWord: string,
  spokenWord: string,
): PhonemeComparison {
  const targetPhonemes = approximatePhonemeTokens(targetWord);
  const spokenPhonemes = approximatePhonemeTokens(spokenWord);

  const { matches, lcsLength } = longestCommonSubsequenceIndices(
    targetPhonemes,
    spokenPhonemes,
  );

  const matchedTarget = new Set(matches.map((m) => m.i));
  const missingPhonemes = targetPhonemes.filter((_, i) => !matchedTarget.has(i));

  const substitutedPhonemes: PhonemeSubstitution[] = [];
  let prevTargetStart = 0;
  let prevSpokenStart = 0;
  const sentinelMatches = [
    ...matches,
    { i: targetPhonemes.length, j: spokenPhonemes.length },
  ];

  for (const match of sentinelMatches) {
    const targetGap = targetPhonemes.slice(prevTargetStart, match.i);
    const spokenGap = spokenPhonemes.slice(prevSpokenStart, match.j);
    const pairCount = Math.min(targetGap.length, spokenGap.length);

    for (let k = 0; k < pairCount; k++) {
      if (targetGap[k] !== spokenGap[k]) {
        substitutedPhonemes.push({
          expected: targetGap[k],
          actual: spokenGap[k],
        });
      }
    }

    prevTargetStart = match.i + 1;
    prevSpokenStart = match.j + 1;
  }

  const denominator = Math.max(targetPhonemes.length, spokenPhonemes.length, 1);

  return {
    similarityScore: clamp(lcsLength / denominator, 0, 1),
    missingPhonemes,
    substitutedPhonemes,
  };
}

export function detectPronunciationCategory(
  word: string,
  analysis: ComparisonAnalysis,
): PronunciationCategory {
  const normalizedWord = normalizeText(word);
  return getCachedWordAnalysis(normalizedWord, analysis).category;
}

export function detectAccentPattern(
  word: string,
  analysis: ComparisonAnalysis,
): AccentPattern {
  const normalizedWord = normalizeText(word);
  return getCachedWordAnalysis(normalizedWord, analysis).accentPattern;
}

export function estimateSpeechTiming(text: string): number {
  return tokenize(text).length * 450;
}

export function suggestPracticeWords(analysis: ComparisonAnalysis): string[] {
  const getComparison = getAnalysisPhonemeComparisonGetter(analysis);

  // Rank likely ending-sound issues slightly earlier without changing analysis shape.
  const prioritizedEndingDropWords = analysis.substitutedPairs
    .filter((pair) =>
      looksLikeDroppedEndingSound(pair.target, pair.actual) ||
      hasLikelyDroppedEndingByPhoneme(pair.target, pair.actual, getComparison)
    )
    .map((pair) => pair.target);

  return dedupeStrings([
    ...prioritizedEndingDropWords,
    ...analysis.candidateFocusWords,
    ...analysis.missingWords,
    ...analysis.substitutedPairs.map((pair) => pair.target),
  ]).slice(0, 3);
}

export function summarizeAccentPatterns(
  focusItems: Array<{ accentPattern: AccentPattern }>,
): AccentPatternSummary {
  const summary: AccentPatternSummary = {
    final_consonant_drop: 0,
    vowel_confusion: 0,
    stress_shift: 0,
    consonant_substitution: 0,
  };

  for (const item of focusItems) {
    if (item.accentPattern !== "unknown") {
      summary[item.accentPattern] += 1;
    }
  }

  return summary;
}

export function compareTexts(
  targetText: string,
  transcribedText: string,
): ComparisonAnalysis {
  const targetTokens = tokenize(targetText);
  const transcriptTokens = tokenize(transcribedText);

  const { matches, lcsLength } = longestCommonSubsequenceIndices(
    targetTokens,
    transcriptTokens,
  );

  const matchedTarget = new Set(matches.map((m) => m.i));
  const matchedTranscript = new Set(matches.map((m) => m.j));

  const missingWords = targetTokens.filter((_, i) => !matchedTarget.has(i));
  const extraWords = transcriptTokens.filter((_, i) => !matchedTranscript.has(i));

  const substitutedPairs: SubstitutedPair[] = [];
  const candidateFocusWords: string[] = [];

  let prevTargetStart = 0;
  let prevTranscriptStart = 0;
  const sentinelMatches = [
    ...matches,
    { i: targetTokens.length, j: transcriptTokens.length },
  ];

  for (const match of sentinelMatches) {
    const targetGap = targetTokens.slice(prevTargetStart, match.i);
    const transcriptGap = transcriptTokens.slice(prevTranscriptStart, match.j);
    const pairCount = Math.min(targetGap.length, transcriptGap.length);

    for (let k = 0; k < pairCount; k++) {
      const targetWord = targetGap[k];
      const actualWord = transcriptGap[k];

      if (targetWord && actualWord && targetWord !== actualWord) {
        substitutedPairs.push({ target: targetWord, actual: actualWord });
        candidateFocusWords.push(targetWord);
      }
    }

    if (targetGap.length > pairCount) {
      candidateFocusWords.push(...targetGap.slice(pairCount));
    }

    prevTargetStart = match.i + 1;
    prevTranscriptStart = match.j + 1;
  }

  const difficultWords = targetTokens.filter((word) => word.length >= 7);

  const combinedFocusWords = dedupeStrings([
    ...missingWords,
    ...candidateFocusWords,
    ...substitutedPairs.map((pair) => pair.target),
    ...difficultWords.filter((word) =>
      missingWords.includes(word) ||
      substitutedPairs.some((pair) => pair.target === word)
    ),
  ]).slice(0, 5);

  const denominator = Math.max(targetTokens.length, transcriptTokens.length, 1);
  const closenessRatio = lcsLength / denominator;
  const mismatchCount =
    missingWords.length + extraWords.length + substitutedPairs.length;

  return {
    normalizedTargetText: normalizeText(targetText),
    normalizedTranscriptText: normalizeText(transcribedText),
    targetTokens,
    transcriptTokens,
    missingWords,
    extraWords,
    substitutedPairs,
    candidateFocusWords: combinedFocusWords,
    closenessRatio: clamp(closenessRatio, 0, 1),
    mismatchCount,
  };
}

export function calculateScore(analysis: ComparisonAnalysis): number {
  if (analysis.targetTokens.length === 0) return 0;
  if (analysis.transcriptTokens.length === 0) return 0;

  let score = 100;
  score -= analysis.missingWords.length * 20;
  score -= analysis.substitutedPairs.length * 15;
  score -= analysis.extraWords.length * 5;

  const mismatchPressure = 1 - analysis.closenessRatio;
  if (mismatchPressure >= 0.35) {
    score -= 10;
  } else if (mismatchPressure >= 0.18) {
    score -= 5;
  }

  if (analysis.normalizedTargetText === analysis.normalizedTranscriptText) {
    score = 100;
  }

  return clamp(Math.round(score), 0, 100);
}

export function estimateStreamingFeedback(
  evidence: PronunciationEvidence,
): Pick<
  PronunciationAnalysisResult,
  "analysis" | "score" | "focusItems" | "expectedDurationMs" | "suggestedPractice" | "accentPatterns"
> {
  return buildPronunciationAnalysisResult(evidence);
}

export function buildPronunciationAnalysisResult(
  evidence: PronunciationEvidence,
): PronunciationAnalysisResult {
  const analysis = compareTexts(evidence.targetText, evidence.transcribedText);
  const score = calculateScore(analysis);
  const suggestedPractice = suggestPracticeWords(analysis);
  const substitutionMap = createSubstitutionMap(analysis);
  const getComparison = getAnalysisPhonemeComparisonGetter(analysis);

  const focusItems: AnalysisFocusItem[] = suggestedPractice.map((word) => {
    const normalizedWord = normalizeText(word);
    const substitution = substitutionMap.get(normalizedWord);

    return {
      word,
      category: detectPronunciationCategoryInternal({
        normalizedWord,
        analysis,
        substitution,
        getComparison,
      }),
      accentPattern: detectAccentPatternInternal({
        normalizedWord,
        analysis,
        substitution,
        getComparison,
      }),
      phonemeComparison: substitution
        ? getComparison(substitution.target, substitution.actual)
        : undefined,
    };
  });

  return {
    analysis,
    score,
    focusItems,
    expectedDurationMs: estimateSpeechTiming(evidence.targetText),
    suggestedPractice,
    accentPatterns: summarizeAccentPatterns(focusItems),
  };
}