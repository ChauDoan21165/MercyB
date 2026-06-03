import { PROBLEM_PAIRS_STRESS } from "@/lib/pronunciation/vn-phoneme-map";

export type EnglishPronunciationFeedbackCategory =
  | "final_consonant_deletion"
  | "consonant_cluster"
  | "theta_sound"
  | "ending_s"
  | "ending_ed"
  | "word_stress";

export type EnglishPronunciationFeedbackStatus = "correct" | "try_again";

export type EnglishPronunciationFeedbackItem = {
  category: EnglishPronunciationFeedbackCategory;
  status: EnglishPronunciationFeedbackStatus;
  score: number;
  targetWord: string;
  titleVi: string;
  titleEn: string;
  guidanceVi: string;
  guidanceEn: string;
  evidence?: string;
};

export type EnglishPronunciationFeedbackDisplay = {
  items: EnglishPronunciationFeedbackItem[];
};

export type EnglishPronunciationWord = {
  word: string;
  accuracyScore?: number | null;
  phonemes?: Array<{
    phoneme: string;
    accuracyScore?: number | null;
  }>;
};

export type EnglishPronunciationScoreResult = {
  mode?: "local-fallback" | "azure-batch";
  provider?: "local" | "azure";
  overallScore?: number | null;
  words?: EnglishPronunciationWord[] | null;
  phonemeScores?: Array<{
    phoneme: string;
    accuracyScore?: number | null;
    word?: string | null;
  }> | null;
};

const SCORE_MATCH_THRESHOLD = 90;
const SCORE_TRY_AGAIN_THRESHOLD = 70;

const VOWEL_LIKE_PHONEMES = new Set([
  "a",
  "aa",
  "ae",
  "ah",
  "ao",
  "aw",
  "ay",
  "eh",
  "er",
  "ey",
  "ih",
  "iy",
  "ow",
  "oy",
  "uh",
  "uw",
  "ax",
  "ə",
  "æ",
  "ɑ",
  "ɛ",
  "ɪ",
  "ʊ",
  "i",
  "u",
  "o",
  "e",
]);

const INITIAL_CLUSTER_PREFIXES = [
  "bl",
  "br",
  "cl",
  "cr",
  "dr",
  "fl",
  "fr",
  "gl",
  "gr",
  "pl",
  "pr",
  "sl",
  "sm",
  "sn",
  "sp",
  "st",
  "sw",
  "tr",
  "tw",
  "scr",
  "shr",
  "spl",
  "spr",
  "str",
  "thr",
] as const;

const FINAL_CLUSTER_SUFFIXES = [
  "st",
  "sk",
  "sp",
  "nd",
  "nt",
  "ld",
  "ft",
  "mp",
  "lp",
  "lt",
  "ct",
  "pt",
  "xt",
  "nk",
  "rt",
  "rd",
  "rk",
  "rn",
  "rm",
  "lk",
] as const;

const STRESS_PHRASE_MAP: Array<{
  needle: string;
  word: string;
  titleEn: string;
  titleVi: string;
  guidanceEn: string;
  guidanceVi: string;
}> = PROBLEM_PAIRS_STRESS.map((pair) => {
  const lowerTarget = pair.target.toLowerCase();
  const focusWord = lowerTarget.split(/\s+/).at(-1) ?? "";
  return {
    needle: lowerTarget,
    word: focusWord,
    titleEn: "Word stress",
    titleVi: "Trọng âm từ",
    guidanceEn: "Focus on the stressed syllable in this phrase and keep the others lighter.",
    guidanceVi: pair.vnWhyConfused,
  };
});

function normalizeText(value: string): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[.,;:!?"'()\[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean);
}

function findTargetWordIndex(
  targetWords: string[],
  candidateWord: string,
  preferredIndex: number,
  usedIndexes: Set<number>,
): number | null {
  const lowerCandidate = candidateWord.toLowerCase();
  const exactIndex = targetWords.findIndex(
    (word, index) => !usedIndexes.has(index) && word.toLowerCase() === lowerCandidate,
  );
  if (exactIndex >= 0) return exactIndex;

  if (preferredIndex >= 0 && preferredIndex < targetWords.length && !usedIndexes.has(preferredIndex)) {
    return preferredIndex;
  }

  const fallbackIndex = targetWords.findIndex((_, index) => !usedIndexes.has(index));
  return fallbackIndex >= 0 ? fallbackIndex : null;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function clampScore(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function phonemeScoreMap(word: EnglishPronunciationWord): Map<string, number> {
  const map = new Map<string, number>();
  for (const phoneme of word.phonemes ?? []) {
    const symbol = String(phoneme.phoneme ?? "").trim().toLowerCase();
    const score = toFiniteNumber(phoneme.accuracyScore);
    if (!symbol || score === null) continue;
    map.set(symbol, score);
  }
  return map;
}

function findPhonemeScore(
  word: EnglishPronunciationWord,
  phonemeNames: string[],
): number | null {
  const map = phonemeScoreMap(word);
  for (const phonemeName of phonemeNames) {
    const score = map.get(phonemeName.toLowerCase());
    if (score !== undefined) return score;
  }
  return null;
}

function hasStrongConfidence(score: number | null | undefined): boolean {
  return typeof score === "number" && score >= SCORE_MATCH_THRESHOLD;
}

function hasLowConfidence(score: number | null | undefined): boolean {
  return typeof score === "number" && score <= SCORE_TRY_AGAIN_THRESHOLD;
}

function isVowelLikeSymbol(symbol: string): boolean {
  return VOWEL_LIKE_PHONEMES.has(symbol.toLowerCase());
}

function isInitialCluster(word: string): boolean {
  return INITIAL_CLUSTER_PREFIXES.some((prefix) => word.startsWith(prefix));
}

function isFinalCluster(word: string): boolean {
  return FINAL_CLUSTER_SUFFIXES.some((suffix) => word.endsWith(suffix));
}

function createItem(input: {
  category: EnglishPronunciationFeedbackCategory;
  status: EnglishPronunciationFeedbackStatus;
  score: number;
  targetWord: string;
  titleEn: string;
  titleVi: string;
  guidanceEn: string;
  guidanceVi: string;
  evidence?: string;
}): EnglishPronunciationFeedbackItem {
  return {
    category: input.category,
    status: input.status,
    score: clampScore(input.score),
    targetWord: input.targetWord,
    titleEn: input.titleEn,
    titleVi: input.titleVi,
    guidanceEn: input.guidanceEn,
    guidanceVi: input.guidanceVi,
    ...(input.evidence ? { evidence: input.evidence } : {}),
  };
}

function stressMatchForWord(
  targetWord: string,
  targetSentence: string,
  score: number,
): EnglishPronunciationFeedbackItem | null {
  const normalizedSentence = normalizeText(targetSentence);
  const normalizedWord = targetWord.toLowerCase();

  const phraseMatch = STRESS_PHRASE_MAP.find((entry) => normalizedSentence.includes(entry.needle));
  if (phraseMatch) {
    if (score >= SCORE_MATCH_THRESHOLD) {
      return createItem({
        category: "word_stress",
        status: "correct",
        score,
        targetWord: phraseMatch.word,
        titleEn: phraseMatch.titleEn,
        titleVi: phraseMatch.titleVi,
        guidanceEn: "Great — the stress pattern is landing.",
        guidanceVi: "Tốt — trọng âm đang vào đúng chỗ.",
        evidence: phraseMatch.needle,
      });
    }
    if (score <= SCORE_TRY_AGAIN_THRESHOLD) {
      return createItem({
        category: "word_stress",
        status: "try_again",
        score,
        targetWord: phraseMatch.word,
        titleEn: phraseMatch.titleEn,
        titleVi: phraseMatch.titleVi,
        guidanceEn: phraseMatch.guidanceEn,
        guidanceVi: phraseMatch.guidanceVi,
        evidence: phraseMatch.needle,
      });
    }
    return null;
  }

  if (
    /(?:tion|sion|cian|ture|sure|ity|ic|eer|ee|ese|ette|graphy|ology)$/i.test(normalizedWord)
  ) {
    if (score >= SCORE_MATCH_THRESHOLD) {
      return createItem({
        category: "word_stress",
        status: "correct",
        score,
        targetWord: normalizedWord,
        titleEn: "Word stress",
        titleVi: "Trọng âm từ",
        guidanceEn: "Great — the stress pattern is landing.",
        guidanceVi: "Tốt — trọng âm đang vào đúng chỗ.",
      });
    }
    if (score <= SCORE_TRY_AGAIN_THRESHOLD) {
      return createItem({
        category: "word_stress",
        status: "try_again",
        score,
        targetWord: normalizedWord,
        titleEn: "Word stress",
        titleVi: "Trọng âm từ",
        guidanceEn: "Word stress may be off. Make one syllable stronger and the others lighter.",
        guidanceVi: "Có thể trọng âm chưa đúng. Hãy làm một âm tiết mạnh hơn, các âm còn lại nhẹ hơn.",
      });
    }
    return null;
  }

  return null;
}

function classifyWordTarget(
  targetWord: string,
  word: EnglishPronunciationWord,
): EnglishPronunciationFeedbackItem | null {
  const lowerWord = targetWord.toLowerCase();
  const score = clampScore(word.accuracyScore);
  const phonemes = word.phonemes ?? [];
  const phonemeCount = phonemes.length;
  const lastPhoneme = phonemes[phonemeCount - 1]?.phoneme?.toLowerCase() ?? "";
  const lastScore = toFiniteNumber(phonemes[phonemeCount - 1]?.accuracyScore);
  const firstTwoScores = phonemes.slice(0, 2).map((p) => toFiniteNumber(p.accuracyScore)).filter((n): n is number => n !== null);
  const finalTwoScores = phonemes.slice(-2).map((p) => toFiniteNumber(p.accuracyScore)).filter((n): n is number => n !== null);

  const isThetaWord = /th/.test(lowerWord);
  if (isThetaWord) {
    const thScore = findPhonemeScore(word, ["th", "dh", "θ", "ð"]);
    if (hasStrongConfidence(thScore) || hasLowConfidence(thScore) || hasLowConfidence(score)) {
      return createItem({
        category: "theta_sound",
        status: hasStrongConfidence(thScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: thScore ?? score,
        targetWord,
        titleEn: "TH sound",
        titleVi: "/th/ âm tiếng Anh",
        guidanceEn: hasStrongConfidence(thScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Nice — the TH sound is coming through."
          : "Try this sound again: put your tongue lightly between your teeth for TH.",
        guidanceVi: hasStrongConfidence(thScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm TH đã khá rõ."
          : "Thử lại âm này: đặt đầu lưỡi nhẹ giữa hai hàm răng cho âm TH.",
        evidence: `ph:${thScore ?? "n/a"}`,
      });
    }
    return null;
  }

  if (lowerWord.endsWith("s") && !/(ss|us|is|as|os)$/.test(lowerWord)) {
    const sScore = findPhonemeScore(word, ["s", "z"]);
    if (hasStrongConfidence(sScore) || hasLowConfidence(sScore) || hasLowConfidence(score)) {
      return createItem({
        category: "ending_s",
        status: hasStrongConfidence(sScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: sScore ?? score,
        targetWord,
        titleEn: "Final -s",
        titleVi: "Âm -s cuối",
        guidanceEn: hasStrongConfidence(sScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Good — the final -s is clear."
          : "Try this sound again: keep the plural -s clear at the end.",
        guidanceVi: hasStrongConfidence(sScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm -s cuối đã rõ."
          : "Thử lại âm này: giữ âm số nhiều -s thật rõ ở cuối.",
        evidence: `ph:${sScore ?? "n/a"}`,
      });
    }
    return null;
  }

  if (lowerWord.endsWith("ed") && lowerWord.length > 3) {
    const edScore = findPhonemeScore(word, ["t", "d", "ed", "əd", "ɪd"]);
    if (hasStrongConfidence(edScore) || hasLowConfidence(edScore) || hasLowConfidence(score)) {
      return createItem({
        category: "ending_ed",
        status: hasStrongConfidence(edScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: edScore ?? score,
        targetWord,
        titleEn: "Final -ed",
        titleVi: "Âm -ed cuối",
        guidanceEn: hasStrongConfidence(edScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Good — the past-tense ending is clear."
          : "Try this sound again: keep the -ed ending audible for past tense.",
        guidanceVi: hasStrongConfidence(edScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — đuôi -ed của thì quá khứ đã rõ."
          : "Thử lại âm này: giữ đuôi -ed của thì quá khứ rõ hơn.",
        evidence: `ph:${edScore ?? "n/a"}`,
      });
    }
    return null;
  }

  if (isInitialCluster(lowerWord) || isFinalCluster(lowerWord)) {
    const clusterScores = [
      ...phonemes.slice(0, 2).map((phoneme) => toFiniteNumber(phoneme.accuracyScore)),
      ...phonemes.slice(-2).map((phoneme) => toFiniteNumber(phoneme.accuracyScore)),
    ].filter((n): n is number => n !== null);
    const weakClusterScore = clusterScores.find((n) => n <= SCORE_TRY_AGAIN_THRESHOLD) ?? null;
    if (weakClusterScore !== null || hasLowConfidence(score)) {
      return createItem({
        category: "consonant_cluster",
        status: weakClusterScore !== null && score <= SCORE_TRY_AGAIN_THRESHOLD ? "try_again" : "try_again",
        score: weakClusterScore ?? score,
        targetWord,
        titleEn: "Consonant cluster",
        titleVi: "Cụm phụ âm",
        guidanceEn: "Try this sound again: keep every consonant in the cluster.",
        guidanceVi: "Thử lại âm này: giữ đủ từng phụ âm trong cụm.",
        evidence: `word:${targetWord}`,
      });
    }
    return null;
  }

  const finalConsonantScore = lastPhoneme && !isVowelLikeSymbol(lastPhoneme) ? lastScore : null;
  if (
    finalConsonantScore !== null &&
    (hasLowConfidence(finalConsonantScore) || hasLowConfidence(score)) &&
    !isThetaWord &&
    !lowerWord.endsWith("s") &&
    !lowerWord.endsWith("ed")
  ) {
    return createItem({
      category: "final_consonant_deletion",
      status: "try_again",
      score: finalConsonantScore,
      targetWord,
      titleEn: "Final consonant",
      titleVi: "Âm cuối",
      guidanceEn: "Try this sound again: keep the final consonant clear.",
      guidanceVi: "Thử lại âm này: giữ âm cuối thật rõ.",
      evidence: `ph:${lastPhoneme}`,
    });
  }

  return null;
}

export function buildEnglishPronunciationFeedbackDisplay(input: {
  targetSentence: string;
  result: EnglishPronunciationScoreResult | null | undefined;
}): EnglishPronunciationFeedbackDisplay | null {
  const result = input.result;
  if (
    !result ||
    result.mode !== "azure-batch" ||
    result.provider !== "azure" ||
    !Array.isArray(result.words) ||
    result.words.length === 0
  ) {
    return null;
  }

  const overallScore = clampScore(result.overallScore);
  if (overallScore < 60) return null;

  const targetWords = tokenize(input.targetSentence);
  if (targetWords.length === 0) return null;

  const items: EnglishPronunciationFeedbackItem[] = [];
  const usedTargetIndexes = new Set<number>();
  for (const [index, word] of result.words.entries()) {
    const targetIndex = findTargetWordIndex(targetWords, word.word, index, usedTargetIndexes);
    if (targetIndex === null) continue;
    usedTargetIndexes.add(targetIndex);
    const targetWord = targetWords[targetIndex];
    const item = classifyWordTarget(targetWord, word);
    if (item) items.push(item);
    if (items.length >= 2) break;
  }

  if (items.length === 0) {
    const stressWord = result.words.find((word) =>
      targetWords.some((targetWord) => targetWord.toLowerCase() === word.word.toLowerCase()),
    );
    const stressItem = stressMatchForWord(
      stressWord?.word ?? targetWords[0] ?? "",
      input.targetSentence,
      clampScore(stressWord?.accuracyScore),
    );
    return stressItem ? { items: [stressItem] } : null;
  }

  const unique = new Map<EnglishPronunciationFeedbackCategory, EnglishPronunciationFeedbackItem>();
  for (const item of items) {
    if (!unique.has(item.category)) unique.set(item.category, item);
  }

  const normalizedItems = Array.from(unique.values()).filter((item) => {
    if (item.status === "correct") return item.score >= SCORE_MATCH_THRESHOLD;
    return item.score <= SCORE_TRY_AGAIN_THRESHOLD;
  });

  if (normalizedItems.length === 0) return null;
  return { items: normalizedItems.slice(0, 2) };
}

export function englishPronunciationFeedbackCopy(category: EnglishPronunciationFeedbackCategory): {
  titleEn: string;
  titleVi: string;
  guidanceEn: string;
  guidanceVi: string;
} {
  switch (category) {
    case "theta_sound":
      return {
        titleEn: "TH sound",
        titleVi: "/th/ âm tiếng Anh",
        guidanceEn: "Put your tongue lightly between your teeth for TH.",
        guidanceVi: "Đặt đầu lưỡi nhẹ giữa hai hàm răng cho âm TH.",
      };
    case "ending_s":
      return {
        titleEn: "Final -s",
        titleVi: "Âm -s cuối",
        guidanceEn: "Keep the plural -s clear at the end.",
        guidanceVi: "Giữ âm số nhiều -s thật rõ ở cuối.",
      };
    case "ending_ed":
      return {
        titleEn: "Final -ed",
        titleVi: "Âm -ed cuối",
        guidanceEn: "Keep the -ed ending audible for past tense.",
        guidanceVi: "Giữ đuôi -ed của thì quá khứ rõ hơn.",
      };
    case "consonant_cluster":
      return {
        titleEn: "Consonant cluster",
        titleVi: "Cụm phụ âm",
        guidanceEn: "Keep every consonant in the cluster.",
        guidanceVi: "Giữ đủ từng phụ âm trong cụm.",
      };
    case "final_consonant_deletion":
      return {
        titleEn: "Final consonant",
        titleVi: "Âm cuối",
        guidanceEn: "Keep the final consonant clear.",
        guidanceVi: "Giữ âm cuối thật rõ.",
      };
    case "word_stress":
      return {
        titleEn: "Word stress",
        titleVi: "Trọng âm từ",
        guidanceEn: "Make one syllable stronger and the others lighter.",
        guidanceVi: "Nhấn mạnh một âm tiết và làm các âm còn lại nhẹ hơn.",
      };
  }
}
