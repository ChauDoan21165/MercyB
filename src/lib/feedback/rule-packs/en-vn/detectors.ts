/**
 * EN→VN detector rule functions (Axis 2 Bar #4).
 *
 * These rules look for canonical English-L1 transfer patterns in
 * Vietnamese learner output. They are isolated from the existing
 * `l1-error-detector.ts` (which uses English-grammar helpers and is
 * Axis-1 specific). Per the dispatch, this PR ships the rule pack in
 * isolation — wiring an actual `detectEnVnError()` entry point into
 * the engine is a SEPARATE follow-up PR.
 *
 * Contract:
 *   - Each rule is an `L1Rule = (args: RuleArgs) => RuleHit | null`.
 *   - Tokens in `RuleArgs.userTokens` / `expectedTokens` are assumed to
 *     be the same shape the detector's `tokenize` function produces:
 *     lowercase whitespace-split + punctuation stripped (except `?`
 *     suffix). Vietnamese orthography is whitespace-separated at the
 *     syllable level, so the standard tokenizer works directly.
 *   - First-match-wins ordering is set by `rules.ts`, not here.
 *
 * Sourced from `src/lib/l1-profiles/en.ts` grammar families. The 8
 * rules below cover 8 of the 10 families (the 2 left unrules'd —
 * `pronoun_age_register_mismatch` and `sentence_final_particle_omission`
 * — are highly context-sensitive and need conversational context the
 * RuleArgs surface doesn't expose; deferred to a future dispatch).
 */

import type { L1Rule, RuleHit } from "../../rule-pack-types.js";

// ── Vietnamese word sets (small curated lists; expand as detector
// coverage grows). All lowercase to match tokenize() output. ──

const NUMERALS = new Set([
  "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười",
  "vài", "mấy", "nhiều",
]);

const CLASSIFIERS = new Set([
  "cái", "con", "chiếc", "cuốn", "quả", "trái", "tấm", "bộ",
  "bức", "ngôi", "ly", "cốc", "người", "đứa", "vị", "tờ",
]);

const NEED_CLASSIFIER_NOUNS = new Set([
  "sách", "bút", "ghế", "bàn", "xe", "ảnh", "áo", "nhẫn",
  "chó", "mèo", "cá", "tranh", "bóng", "tạp", // "tạp" catches "tạp chí" partial
]);

// Adjectives that predicate directly (no copula).
const PREDICATE_ADJECTIVES = new Set([
  "vui", "buồn", "đẹp", "xấu", "mệt", "khoẻ", "khỏe",
  "lạnh", "nóng", "ngon", "dở", "to", "nhỏ", "cao", "thấp",
  "khó", "dễ", "đói", "no", "mới", "cũ", "ốm", "giàu", "nghèo",
  "hay", "buồn", "chán", "vui vẻ",
]);

// Stative verbs — don't take progressive `đang`.
const STATIVE_VERBS = new Set([
  "biết", "hiểu", "có", "là", "muốn", "cần", "thích",
  "yêu", "ghét", "nhớ", "quên", "tin", "nghĩ",
]);

// Common color/size/quality adjectives for noun-modifier inversion.
const COLOR_SIZE_QUALITY_ADJ = new Set([
  "đỏ", "xanh", "vàng", "đen", "trắng", "tím", "hồng", "nâu",
  "nóng", "lạnh", "lớn", "to", "nhỏ", "tốt", "xấu",
  "dài", "ngắn", "đẹp", "mới", "cũ",
]);

// Single-token nouns most often inverted by EN→VN learners.
const COMMON_NOUNS_FOR_INVERSION = new Set([
  "sách", "áo", "tóc", "nhà", "phòng", "xe", "hoa", "bàn", "ghế",
  "cà", // partial — catches "cà phê" via first token
  "nhà",
]);

const PRONOUNS_FOR_QUESTION = new Set([
  "anh", "chị", "em", "ông", "bà", "cô", "chú", "cháu", "con",
  "tôi", "mình", "tớ", "bạn",
]);

function tokensHaveQuestion(text: string): boolean {
  return /\?\s*$/.test(text);
}

// ──────────────────────────────────────────────────────────────────────────
// Rule 1 — copula `là` before an adjective predicate.
// e.g. "Tôi là vui" → "Tôi vui".
// ──────────────────────────────────────────────────────────────────────────

export const ruleCopulaLaAdj: L1Rule = ({
  userTokens,
  rawExpected,
}): RuleHit | null => {
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (userTokens[i] === "là" && PREDICATE_ADJECTIVES.has(userTokens[i + 1])) {
      return {
        tag: "en_l1_copula_la_adj",
        replacements: {
          FIX: rawExpected,
          ADJ: userTokens[i + 1],
        },
      };
    }
  }
  return null;
};

// ──────────────────────────────────────────────────────────────────────────
// Rule 2 — classifier omission after a numeral.
// e.g. "Tôi mua một sách" → "Tôi mua một cuốn sách".
// Fires when NUMERAL is immediately followed by a NEED_CLASSIFIER_NOUN
// without a CLASSIFIER in between.
// ──────────────────────────────────────────────────────────────────────────

export const ruleClassifierOmission: L1Rule = ({
  userTokens,
  rawExpected,
}): RuleHit | null => {
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (!NUMERALS.has(userTokens[i])) continue;
    const next = userTokens[i + 1];
    if (CLASSIFIERS.has(next)) continue; // numeral + classifier is correct
    if (NEED_CLASSIFIER_NOUNS.has(next)) {
      return {
        tag: "en_l1_classifier_omission",
        replacements: {
          FIX: rawExpected,
          NUMERAL: userTokens[i],
          NOUN: next,
        },
      };
    }
  }
  return null;
};

// ──────────────────────────────────────────────────────────────────────────
// Rule 3 — `đang` (progressive) on a stative verb.
// e.g. "Tôi đang muốn ăn phở" → "Tôi muốn ăn phở".
// ──────────────────────────────────────────────────────────────────────────

export const ruleAspectOveruseStative: L1Rule = ({
  userTokens,
  rawExpected,
}): RuleHit | null => {
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (userTokens[i] === "đang" && STATIVE_VERBS.has(userTokens[i + 1])) {
      return {
        tag: "en_l1_aspect_overuse_stative",
        replacements: {
          FIX: rawExpected,
          VERB: userTokens[i + 1],
        },
      };
    }
  }
  return null;
};

// ──────────────────────────────────────────────────────────────────────────
// Rule 4 — noun-modifier inversion (English ADJ+N order).
// e.g. "Đỏ sách rất đẹp" → "Sách đỏ rất đẹp".
// ──────────────────────────────────────────────────────────────────────────

export const ruleNounModifierInversion: L1Rule = ({
  userTokens,
  rawExpected,
}): RuleHit | null => {
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (
      COLOR_SIZE_QUALITY_ADJ.has(userTokens[i]) &&
      COMMON_NOUNS_FOR_INVERSION.has(userTokens[i + 1])
    ) {
      return {
        tag: "en_l1_noun_modifier_inversion",
        replacements: {
          FIX: rawExpected,
          ADJ: userTokens[i],
          NOUN: userTokens[i + 1],
        },
      };
    }
  }
  return null;
};

// ──────────────────────────────────────────────────────────────────────────
// Rule 5 — plural-marker redundancy after a numeral.
// e.g. "Tôi mua ba những cuốn sách" → "Tôi mua ba cuốn sách".
// ──────────────────────────────────────────────────────────────────────────

export const rulePluralMarkerRedundancy: L1Rule = ({
  userTokens,
  rawExpected,
}): RuleHit | null => {
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (!NUMERALS.has(userTokens[i])) continue;
    if (userTokens[i + 1] === "những" || userTokens[i + 1] === "các") {
      return {
        tag: "en_l1_plural_marker_redundancy",
        replacements: {
          FIX: rawExpected,
          MARKER: userTokens[i + 1],
        },
      };
    }
  }
  return null;
};

// ──────────────────────────────────────────────────────────────────────────
// Rule 6 — `không là` (negating identity without `phải`).
// e.g. "Cô ấy không là sinh viên" → "Cô ấy không phải là sinh viên".
// ──────────────────────────────────────────────────────────────────────────

export const ruleNegationLaMissingPhai: L1Rule = ({
  userTokens,
  rawExpected,
}): RuleHit | null => {
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (userTokens[i] === "không" && userTokens[i + 1] === "là") {
      return {
        tag: "en_l1_negation_la_missing_phai",
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

// ──────────────────────────────────────────────────────────────────────────
// Rule 7 — direct-translation calque: "lấy nó dễ dàng" (take it easy).
// Matches the canonical English calque exactly; future calque rules
// can be added as separate detectors.
// ──────────────────────────────────────────────────────────────────────────

export const ruleCalqueTakeItEasy: L1Rule = ({
  userText,
  rawExpected,
}): RuleHit | null => {
  if (userText.includes("lấy nó dễ dàng")) {
    return {
      tag: "en_l1_calque_take_it_easy",
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

// ──────────────────────────────────────────────────────────────────────────
// Rule 8 — question inversion: sentence starts with `là <pronoun>` and
// ends with `?`. e.g. "Là anh mệt?" → "Anh có mệt không?".
// ──────────────────────────────────────────────────────────────────────────

export const ruleQuestionInversionLaFront: L1Rule = ({
  userTokens,
  rawUser,
  rawExpected,
}): RuleHit | null => {
  if (userTokens.length < 2) return null;
  if (userTokens[0] !== "là") return null;
  if (!PRONOUNS_FOR_QUESTION.has(userTokens[1])) return null;
  if (!tokensHaveQuestion(rawUser)) return null;
  return {
    tag: "en_l1_question_inversion_la_front",
    replacements: { FIX: rawExpected, PRONOUN: userTokens[1] },
  };
};
