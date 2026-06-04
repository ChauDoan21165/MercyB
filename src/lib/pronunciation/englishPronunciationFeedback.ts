import { PROBLEM_PAIRS_STRESS } from "@/lib/pronunciation/vn-phoneme-map";

export type EnglishPronunciationFeedbackCategory =
  | "final_consonant_deletion"
  | "final_t_d_deletion"
  | "final_p_deletion"
  | "final_b_deletion"
  | "final_k_deletion"
  | "final_g_deletion"
  | "consonant_cluster"
  | "theta_sound"
  | "sh_s_contrast"
  | "z_s_contrast"
  | "zh_sound"
  | "r_l_contrast"
  | "v_w_contrast"
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
  abstain?: {
    reason: "no_azure_phoneme_evidence" | "no_high_confidence_feedback";
    titleVi: string;
    titleEn: string;
    bodyVi: string;
    bodyEn: string;
    nextStepVi: string;
    nextStepEn: string;
  };
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
  "sk",
  "skw",
  "sp",
  "squ",
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

const FINAL_T_D_PHONEMES = new Set(["t", "d"]);
const FINAL_P_PHONEMES = new Set(["p"]);
const FINAL_B_PHONEMES = new Set(["b"]);
const FINAL_K_PHONEMES = new Set(["k"]);
const FINAL_G_PHONEMES = new Set(["g"]);

const SH_PHONEMES = ["sh", "ʃ"];
const S_PHONEMES = ["s"];
const Z_PHONEMES = ["z"];
const ZH_PHONEMES = ["zh", "ʒ"];
const R_PHONEMES = ["r", "ɹ"];
const L_PHONEMES = ["l"];
const V_PHONEMES = ["v"];
const W_PHONEMES = ["w"];

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

function isFinalTDPhoneme(symbol: string): boolean {
  return FINAL_T_D_PHONEMES.has(symbol.toLowerCase());
}

function isFinalPPhoneme(symbol: string): boolean {
  return FINAL_P_PHONEMES.has(symbol.toLowerCase());
}

function isFinalBPhoneme(symbol: string): boolean {
  return FINAL_B_PHONEMES.has(symbol.toLowerCase());
}

function isFinalKPhoneme(symbol: string): boolean {
  return FINAL_K_PHONEMES.has(symbol.toLowerCase());
}

function isFinalGPhoneme(symbol: string): boolean {
  return FINAL_G_PHONEMES.has(symbol.toLowerCase());
}

function hasAnyPhonemeScore(word: EnglishPronunciationWord, phonemeNames: string[]): boolean {
  return findPhonemeScore(word, phonemeNames) !== null;
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
  const finalConsonantScore = lastPhoneme && !isVowelLikeSymbol(lastPhoneme) ? lastScore : null;
  const hasClusterTarget = isInitialCluster(lowerWord) || isFinalCluster(lowerWord);

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

  const shScore = findPhonemeScore(word, SH_PHONEMES);
  if (hasAnyPhonemeScore(word, SH_PHONEMES) && /sh/.test(lowerWord)) {
    if ((hasStrongConfidence(shScore) && score >= SCORE_MATCH_THRESHOLD) || hasLowConfidence(shScore)) {
      return createItem({
        category: "sh_s_contrast",
        status: hasStrongConfidence(shScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: shScore ?? score,
        targetWord,
        titleEn: "SH sound",
        titleVi: "Âm SH",
        guidanceEn: hasStrongConfidence(shScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Nice — the SH sound is clear."
          : "Try this sound again: make SH longer and softer than S.",
        guidanceVi: hasStrongConfidence(shScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm SH đã rõ."
          : "Thử lại âm này: kéo âm SH dài và mềm hơn âm S.",
        evidence: `ph:${shScore ?? "n/a"}`,
      });
    }
  }

  const sScore = findPhonemeScore(word, S_PHONEMES);
  if (
    hasAnyPhonemeScore(word, S_PHONEMES) &&
    lowerWord.startsWith("s") &&
    !/sh/.test(lowerWord) &&
    !isInitialCluster(lowerWord)
  ) {
    if (hasLowConfidence(sScore)) {
      return createItem({
        category: "sh_s_contrast",
        status: "try_again",
        score: sScore ?? score,
        targetWord,
        titleEn: "S sound",
        titleVi: "Âm S",
        guidanceEn: "Try this sound again: keep S short and clear, not like SH.",
        guidanceVi: "Thử lại âm này: giữ âm S ngắn và rõ, không kéo thành SH.",
        evidence: `ph:${sScore ?? "n/a"}`,
      });
    }
  }

  const vScore = findPhonemeScore(word, V_PHONEMES);
  if (hasAnyPhonemeScore(word, V_PHONEMES) && /v/.test(lowerWord)) {
    if ((hasStrongConfidence(vScore) && score >= SCORE_MATCH_THRESHOLD) || hasLowConfidence(vScore)) {
      return createItem({
        category: "v_w_contrast",
        status: hasStrongConfidence(vScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: vScore ?? score,
        targetWord,
        titleEn: "V sound",
        titleVi: "Âm V",
        guidanceEn: hasStrongConfidence(vScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Nice — the V sound is clear."
          : "Try this sound again: use your top teeth and lower lip for V.",
        guidanceVi: hasStrongConfidence(vScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm V đã rõ."
          : "Thử lại âm này: dùng răng trên chạm nhẹ môi dưới cho âm V.",
        evidence: `ph:${vScore ?? "n/a"}`,
      });
    }
  }

  const wScore = findPhonemeScore(word, W_PHONEMES);
  if (hasAnyPhonemeScore(word, W_PHONEMES) && /w/.test(lowerWord)) {
    if ((hasStrongConfidence(wScore) && score >= SCORE_MATCH_THRESHOLD) || hasLowConfidence(wScore)) {
      return createItem({
        category: "v_w_contrast",
        status: hasStrongConfidence(wScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: wScore ?? score,
        targetWord,
        titleEn: "W sound",
        titleVi: "Âm W",
        guidanceEn: hasStrongConfidence(wScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Nice — the W sound is clear."
          : "Try this sound again: round your lips first for W.",
        guidanceVi: hasStrongConfidence(wScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm W đã rõ."
          : "Thử lại âm này: tròn môi trước khi phát âm W.",
        evidence: `ph:${wScore ?? "n/a"}`,
      });
    }
  }

  const zhScore = findPhonemeScore(word, ZH_PHONEMES);
  if (hasAnyPhonemeScore(word, ZH_PHONEMES)) {
    if ((hasStrongConfidence(zhScore) && score >= SCORE_MATCH_THRESHOLD) || hasLowConfidence(zhScore)) {
      return createItem({
        category: "zh_sound",
        status: hasStrongConfidence(zhScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: zhScore ?? score,
        targetWord,
        titleEn: "ZH sound",
        titleVi: "Âm ZH",
        guidanceEn: hasStrongConfidence(zhScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Nice — the ZH sound is clear."
          : "Try this sound again: make the middle sound voiced, like the sound in measure.",
        guidanceVi: hasStrongConfidence(zhScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm ZH đã rõ."
          : "Thử lại âm này: làm âm giữa có rung, giống âm trong measure.",
        evidence: `ph:${zhScore ?? "n/a"}`,
      });
    }
    return null;
  }

  const zScore = findPhonemeScore(word, Z_PHONEMES);
  if (hasAnyPhonemeScore(word, Z_PHONEMES) && !lowerWord.endsWith("s")) {
    if ((hasStrongConfidence(zScore) && score >= SCORE_MATCH_THRESHOLD) || hasLowConfidence(zScore)) {
      return createItem({
        category: "z_s_contrast",
        status: hasStrongConfidence(zScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: zScore ?? score,
        targetWord,
        titleEn: "Z sound",
        titleVi: "Âm Z",
        guidanceEn: hasStrongConfidence(zScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Nice — the Z sound is clear."
          : "Try this sound again: keep your voice on for Z, not quiet like S.",
        guidanceVi: hasStrongConfidence(zScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm Z đã rõ."
          : "Thử lại âm này: bật giọng rung cho âm Z, không đọc nhẹ như S.",
        evidence: `ph:${zScore ?? "n/a"}`,
      });
    }
    return null;
  }

  const rScore = findPhonemeScore(word, R_PHONEMES);
  if (hasAnyPhonemeScore(word, R_PHONEMES) && !hasClusterTarget && /^r/.test(lowerWord)) {
    if ((hasStrongConfidence(rScore) && score >= SCORE_MATCH_THRESHOLD) || hasLowConfidence(rScore)) {
      return createItem({
        category: "r_l_contrast",
        status: hasStrongConfidence(rScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: rScore ?? score,
        targetWord,
        titleEn: "R sound",
        titleVi: "Âm R",
        guidanceEn: hasStrongConfidence(rScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Nice — the R sound is clear."
          : "Try this sound again: hold R without touching the tongue to the roof of your mouth.",
        guidanceVi: hasStrongConfidence(rScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm R đã rõ."
          : "Thử lại âm này: giữ âm R, không chạm lưỡi lên vòm miệng.",
        evidence: `ph:${rScore ?? "n/a"}`,
      });
    }
    return null;
  }

  const lScore = findPhonemeScore(word, L_PHONEMES);
  if (hasAnyPhonemeScore(word, L_PHONEMES) && !hasClusterTarget && /^(?:l)|(?:l|ll|le)$/.test(lowerWord)) {
    if ((hasStrongConfidence(lScore) && score >= SCORE_MATCH_THRESHOLD) || hasLowConfidence(lScore)) {
      return createItem({
        category: "r_l_contrast",
        status: hasStrongConfidence(lScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
        score: lScore ?? score,
        targetWord,
        titleEn: "L sound",
        titleVi: "Âm L",
        guidanceEn: hasStrongConfidence(lScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Nice — the L sound is clear."
          : "Try this sound again: touch the tongue tip lightly for L.",
        guidanceVi: hasStrongConfidence(lScore) && score >= SCORE_MATCH_THRESHOLD
          ? "Tốt — âm L đã rõ."
          : "Thử lại âm này: chạm nhẹ đầu lưỡi cho âm L.",
        evidence: `ph:${lScore ?? "n/a"}`,
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

  if (
    finalConsonantScore !== null &&
    isFinalTDPhoneme(lastPhoneme) &&
    !lowerWord.endsWith("ed") &&
    !isFinalCluster(lowerWord) &&
    ((hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD) ||
      hasLowConfidence(finalConsonantScore))
  ) {
    return createItem({
      category: "final_t_d_deletion",
      status: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
      score: finalConsonantScore,
      targetWord,
      titleEn: "Final /t/ or /d/",
      titleVi: "Âm /t/ hoặc /d/ cuối",
      guidanceEn: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Good — the final stop sound is clear."
        : "Try this sound again: close the final /t/ or /d/ cleanly.",
      guidanceVi: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Tốt — âm chặn cuối đã rõ."
        : "Thử lại âm này: khép âm /t/ hoặc /d/ cuối thật gọn.",
      evidence: `ph:${lastPhoneme}`,
    });
  }

  if (
    finalConsonantScore !== null &&
    isFinalPPhoneme(lastPhoneme) &&
    !isFinalCluster(lowerWord) &&
    ((hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD) ||
      hasLowConfidence(finalConsonantScore))
  ) {
    return createItem({
      category: "final_p_deletion",
      status: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
      score: finalConsonantScore,
      targetWord,
      titleEn: "Final /p/",
      titleVi: "Âm /p/ cuối",
      guidanceEn: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Good — the final /p/ sound is clear."
        : "Try this sound again: close both lips for the final /p/.",
      guidanceVi: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Tốt — âm /p/ cuối đã rõ."
        : "Thử lại âm này: khép hai môi cho âm /p/ cuối.",
      evidence: `ph:${lastPhoneme}`,
    });
  }

  if (
    finalConsonantScore !== null &&
    isFinalBPhoneme(lastPhoneme) &&
    !isFinalCluster(lowerWord) &&
    ((hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD) ||
      hasLowConfidence(finalConsonantScore))
  ) {
    return createItem({
      category: "final_b_deletion",
      status: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
      score: finalConsonantScore,
      targetWord,
      titleEn: "Final /b/",
      titleVi: "Âm /b/ cuối",
      guidanceEn: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Good — the final /b/ sound is clear."
        : "Try this sound again: close both lips and keep the final /b/ voiced.",
      guidanceVi: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Tốt — âm /b/ cuối đã rõ."
        : "Thử lại âm này: khép hai môi và giữ âm /b/ cuối có rung.",
      evidence: `ph:${lastPhoneme}`,
    });
  }

  if (
    finalConsonantScore !== null &&
    isFinalKPhoneme(lastPhoneme) &&
    !isFinalCluster(lowerWord) &&
    ((hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD) ||
      hasLowConfidence(finalConsonantScore))
  ) {
    return createItem({
      category: "final_k_deletion",
      status: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
      score: finalConsonantScore,
      targetWord,
      titleEn: "Final /k/",
      titleVi: "Âm /k/ cuối",
      guidanceEn: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Good — the final /k/ sound is clear."
        : "Try this sound again: keep the final /k/ short but audible.",
      guidanceVi: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Tốt — âm /k/ cuối đã rõ."
        : "Thử lại âm này: giữ âm /k/ cuối ngắn nhưng nghe được.",
      evidence: `ph:${lastPhoneme}`,
    });
  }

  if (
    finalConsonantScore !== null &&
    isFinalGPhoneme(lastPhoneme) &&
    !isFinalCluster(lowerWord) &&
    ((hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD) ||
      hasLowConfidence(finalConsonantScore))
  ) {
    return createItem({
      category: "final_g_deletion",
      status: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD ? "correct" : "try_again",
      score: finalConsonantScore,
      targetWord,
      titleEn: "Final /g/",
      titleVi: "Âm /g/ cuối",
      guidanceEn: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Good — the final /g/ sound is clear."
        : "Try this sound again: keep the back of the tongue closed for final /g/.",
      guidanceVi: hasStrongConfidence(finalConsonantScore) && score >= SCORE_MATCH_THRESHOLD
        ? "Tốt — âm /g/ cuối đã rõ."
        : "Thử lại âm này: giữ phần sau lưỡi khép cho âm /g/ cuối.",
      evidence: `ph:${lastPhoneme}`,
    });
  }

  if (hasClusterTarget) {
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

export function buildEnglishPronunciationAbstainFeedbackDisplay(
  reason: "no_azure_phoneme_evidence" | "no_high_confidence_feedback",
): EnglishPronunciationFeedbackDisplay {
  if (reason === "no_high_confidence_feedback") {
    return {
      items: [],
      abstain: {
        reason,
        titleVi: "Mercy chưa thấy điểm âm nào đủ chắc.",
        titleEn: "I do not have a strong sound signal yet.",
        bodyVi: "Không sao. Câu của bạn vẫn được ghi nhận, nhưng Mercy chưa nên đoán âm nào cần sửa.",
        bodyEn: "That is okay. I recorded the attempt, but I should not guess which sound to fix.",
        nextStepVi: "Nghe câu mẫu một lần, rồi đọc lại chậm hơn.",
        nextStepEn: "Listen once, then repeat a little more slowly.",
      },
    };
  }

  return {
    items: [],
    abstain: {
      reason,
      titleVi: "Mercy đang nghe theo câu, chưa chấm từng âm.",
      titleEn: "I am matching the sentence, not grading each sound yet.",
      bodyVi: "Bạn vẫn có thể luyện tiếp. Khi có bằng chứng âm rõ hơn, Mercy sẽ góp ý cụ thể.",
      bodyEn: "You can keep practicing. When sound evidence is clearer, I will give a specific tip.",
      nextStepVi: "Đọc lại câu mẫu một lần nữa, rõ âm cuối hơn.",
      nextStepEn: "Repeat the model sentence once more and keep the ending sounds clear.",
    },
  };
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
    case "sh_s_contrast":
      return {
        titleEn: "SH / S contrast",
        titleVi: "Phân biệt SH / S",
        guidanceEn: "Make SH longer and softer than S; keep S short and clear.",
        guidanceVi: "Kéo âm SH dài và mềm hơn S; giữ âm S ngắn và rõ.",
      };
    case "z_s_contrast":
      return {
        titleEn: "Z / S contrast",
        titleVi: "Phân biệt Z / S",
        guidanceEn: "Keep your voice on for Z; keep S quiet and clear.",
        guidanceVi: "Âm Z có rung giọng; âm S nhẹ và rõ.",
      };
    case "zh_sound":
      return {
        titleEn: "ZH sound",
        titleVi: "Âm ZH",
        guidanceEn: "Make the middle sound voiced, like the sound in measure.",
        guidanceVi: "Làm âm giữa có rung, giống âm trong measure.",
      };
    case "r_l_contrast":
      return {
        titleEn: "R / L contrast",
        titleVi: "Phân biệt R / L",
        guidanceEn: "Hold R without tongue contact; touch the tongue tip lightly for L.",
        guidanceVi: "Âm R không chạm lưỡi; âm L chạm nhẹ đầu lưỡi.",
      };
    case "v_w_contrast":
      return {
        titleEn: "V / W contrast",
        titleVi: "Phân biệt V / W",
        guidanceEn: "Use teeth and lip for V; round your lips first for W.",
        guidanceVi: "Âm V dùng răng và môi; âm W tròn môi trước.",
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
    case "final_t_d_deletion":
      return {
        titleEn: "Final /t/ or /d/",
        titleVi: "Âm /t/ hoặc /d/ cuối",
        guidanceEn: "Close the final /t/ or /d/ cleanly.",
        guidanceVi: "Khép âm /t/ hoặc /d/ cuối thật gọn.",
      };
    case "final_p_deletion":
      return {
        titleEn: "Final /p/",
        titleVi: "Âm /p/ cuối",
        guidanceEn: "Close both lips for the final /p/.",
        guidanceVi: "Khép hai môi cho âm /p/ cuối.",
      };
    case "final_b_deletion":
      return {
        titleEn: "Final /b/",
        titleVi: "Âm /b/ cuối",
        guidanceEn: "Close both lips and keep the final /b/ voiced.",
        guidanceVi: "Khép hai môi và giữ âm /b/ cuối có rung.",
      };
    case "final_k_deletion":
      return {
        titleEn: "Final /k/",
        titleVi: "Âm /k/ cuối",
        guidanceEn: "Keep the final /k/ short but audible.",
        guidanceVi: "Giữ âm /k/ cuối ngắn nhưng nghe được.",
      };
    case "final_g_deletion":
      return {
        titleEn: "Final /g/",
        titleVi: "Âm /g/ cuối",
        guidanceEn: "Keep the back of the tongue closed for final /g/.",
        guidanceVi: "Giữ phần sau lưỡi khép cho âm /g/ cuối.",
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
