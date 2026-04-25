/**
 * Vietnamese regional dialect detection + dialect-aware error rules.
 *
 * Step 10. Three dialects + their L1-transfer patterns into English:
 *
 *   - Northern (Hà Nội)  — gi / d / r merge to a [z]-like sound; tr/ch
 *                          merge to [tɕ]; /θ/ often goes to /t/ or
 *                          over-corrects to /s/. Final consonants
 *                          are preserved cleanly.
 *   - Southern (Sài Gòn) — tr (retroflex [tʂ]) distinct from ch;
 *                          /r/ is closer to English [ɹ] (advantage);
 *                          final stops /-t /-k /-d/ collapse to a
 *                          glottal or drop entirely; /-n/ vs /-ng/
 *                          partially merged.
 *   - Central (Huế)      — 6 tones with distinct contours; smaller
 *                          diaspora; we detect the *slot* but ship no
 *                          specific error rules tonight (would require
 *                          ground-truth Chau hasn't supplied).
 *
 * What this file is NOT:
 *   - Not a replacement for the L1 detector (`l1-error-detector.ts`).
 *     This file *extends* it: detection + 10 dialect-specific rules.
 *     The existing 60 L1 rules and `detectL1Error()` core logic are
 *     untouched.
 *   - Not authoritative dialectology. It is a HEURISTIC over the
 *     signals available at runtime (pronunciation events, spelling
 *     errors, optional self-report). Confidence is always exposed
 *     so callers can hide the badge when we're unsure.
 *
 * Linguistic claims tagged `needs_review: true` are the ones I'm
 * least confident about (older / colloquial / sociolect-bound) and
 * should be verified by Chau before they ship in user-facing copy.
 */

import type { L1VnExplanation } from "./l1-vn-explanations.js";

// ── Public types ──────────────────────────────────────────────────────────

export type VNDialect = "northern" | "southern" | "central" | "unknown";

export type VNRegionSelfReport =
  | "north"
  | "south"
  | "central"
  | "diaspora"
  | "unknown";

/**
 * Lightweight signal a caller passes in. We do not require speech_attempts
 * full payloads — most callers will hand us flattened markers from a
 * recent batch of pronunciation events / writing attempts.
 */
export type DialectSignals = {
  /**
   * Optional pronunciation samples — each item is a transcribed phoneme
   * fragment plus the target English word. The detector only needs
   * the heuristic-level features below; this type is intentionally
   * loose so callers can feed any source (speech_attempts.actual_text,
   * recognizer best-guess, etc.).
   */
  pronunciationSamples?: ReadonlyArray<{
    /** Lower-case ASCII rendering of what the speaker said. */
    spoken: string;
    /** The target English word. */
    target: string;
  }>;

  /**
   * Spelling errors the user wrote, lower-cased. Both the wrong and
   * intended forms are needed because the dialect signal is in the
   * substitution pattern (e.g. `right → zight` is Northern; `right →
   * righ` is Southern).
   */
  spellingErrors?: ReadonlyArray<{
    wrong: string;
    intended: string;
  }>;

  /** Profile self-report, when the user has provided one. */
  selfReportedRegion?: VNRegionSelfReport;
};

export type DialectDetectionResult = {
  dialect: VNDialect;
  /** [0, 1]. Caller should hide UI when below ~0.4. */
  confidence: number;
  /**
   * Per-dialect raw evidence count. Useful for the admin debug view
   * and for tests. Not surfaced in the user UI.
   */
  evidence: {
    northern: number;
    southern: number;
    central: number;
  };
};

// ── Dialect-specific error rule tags ──────────────────────────────────────

export type VNDialectErrorTag =
  // Northern (Hà Nội)
  | "vn_north_th_s_confusion"
  | "vn_north_r_to_z"
  | "vn_north_r_to_l"
  | "vn_north_gi_d_r_merge"
  | "vn_north_v_w_swap"
  // Southern (Sài Gòn)
  | "vn_south_final_t_drop"
  | "vn_south_final_d_drop"
  | "vn_south_final_k_drop"
  | "vn_south_n_ng_merge"
  | "vn_south_v_to_y";

export type VNDialectErrorRule = {
  tag: VNDialectErrorTag;
  dialect: Exclude<VNDialect, "unknown" | "central">;
  /** Regex applied to a written form to flag the error. */
  spellingPattern: RegExp;
  /** Pronunciation pattern: matches a (spoken, target) substitution. */
  pronunciationPattern?: {
    spoken: RegExp;
    target: RegExp;
  };
};

export const VN_DIALECT_RULES: ReadonlyArray<VNDialectErrorRule> = [
  // ── Northern ─────────────────────────────────────────────────────────────
  {
    // /θ/ overcorrected to /s/: "think → sink", "thin → sin", "thanks → sanks"
    tag: "vn_north_th_s_confusion",
    dialect: "northern",
    spellingPattern: /^(?:s)(ink|in|anks|ank|ought|ree|row|under|umb|umber)$/,
    pronunciationPattern: {
      spoken: /^s/,
      target: /^th/,
    },
  },
  {
    // English initial /r/ written as 'z' (Hanoi loan-word habit).
    tag: "vn_north_r_to_z",
    dialect: "northern",
    spellingPattern: /^z(ight|ain|ed|un|ock|ide|oad|ich)$/,
    pronunciationPattern: {
      spoken: /^z/,
      target: /^r/,
    },
  },
  {
    // English initial /r/ written or pronounced as 'l': "right → light".
    tag: "vn_north_r_to_l",
    dialect: "northern",
    spellingPattern: /^l(ight|ain|ed|un|ock|ide|oad)$/,
    pronunciationPattern: {
      spoken: /^l/,
      target: /^r/,
    },
  },
  {
    // gi / d / r conflated in Hanoi: "dim → gim", "year → dear" misspellings.
    // Lower confidence because the substitution is bidirectional.
    tag: "vn_north_gi_d_r_merge",
    dialect: "northern",
    spellingPattern: /^(?:gi|gy|j)(es|ear|im|own|oin|ust)$/,
  },
  {
    // English /w/ written as 'v' (no native /w/ in Northern phonology).
    // "want → vant", "water → vater". Marked uncertain.
    tag: "vn_north_v_w_swap",
    dialect: "northern",
    spellingPattern: /^v(ant|ater|ill|ay|hat|hen|here|ho|ork)$/,
    pronunciationPattern: {
      spoken: /^v/,
      target: /^w/,
    },
  },

  // ── Southern ─────────────────────────────────────────────────────────────
  {
    // Final /-t/ drop: "right → righ", "what → wha", "night → nigh".
    tag: "vn_south_final_t_drop",
    dialect: "southern",
    spellingPattern: /^(righ|wha|nigh|ligh|brigh|figh|tigh|las|tes|res|firs|jus|mos)$/,
  },
  {
    // Final /-d/ drop: "good → goo", "had → ha", "food → foo".
    tag: "vn_south_final_d_drop",
    dialect: "southern",
    spellingPattern: /^(goo|ha|foo|woo|loo|nee|fin|min|frien|secon|wor)$/,
  },
  {
    // Final /-k/ drop: "look → loo", "back → ba", "make → ma".
    // The 'loo' / 'foo' / 'goo' overlap with /-d/ list is intentional —
    // the same surface form can come from either drop pattern.
    tag: "vn_south_final_k_drop",
    dialect: "southern",
    spellingPattern: /^(loo|ba|wor|tal|wal|tha|brea|sno|chec|brac)$/,
  },
  {
    // /-n/ vs /-ng/ merge: "thing → thin", "long → lon", "wrong → wron".
    tag: "vn_south_n_ng_merge",
    dialect: "southern",
    spellingPattern: /^(thin|lon|wron|son|stron|amon|brin|han|youn|run)$/,
  },
  {
    // /v/ → /j/ in older Saigon speech: "very → yery". Marked uncertain;
    // less common in modern educated Saigon.
    tag: "vn_south_v_to_y",
    dialect: "southern",
    spellingPattern: /^y(ery|isit|ote|alley|iew|oice)$/,
    pronunciationPattern: {
      spoken: /^y/,
      target: /^v/,
    },
  },
];

// ── Dialect-specific VN explanations ──────────────────────────────────────
//
// Reuses L1VnExplanation. Adds the optional `dialect_note` so callers
// can prepend a region-aware sentence: "Nhiều bạn miền Nam mình hay
// quên âm cuối ở từ tiếng Anh — không sao, mình cùng luyện."

export const VN_DIALECT_EXPLANATIONS: Record<VNDialectErrorTag, L1VnExplanation> = {
  // ── Northern ───────────────────────────────────────────────────────────
  vn_north_th_s_confusion: {
    name_vi: "Lẫn /th/ và /s/ kiểu Hà Nội",
    explanation_vi:
      "Nhiều bạn miền Bắc mình phát âm /θ/ giữa hai răng thành /s/, viết 'sink' thay vì 'think'. Mẹo: đặt đầu lưỡi giữa hai răng, thổi nhẹ — 'th' của tiếng Anh giống tiếng gió thoát ra.",
    example_wrong_vi_gloss: "I sink so → 'Tôi nghĩ vậy' (think → sink, đẩy /θ/ thành /s/)",
    needs_review: false,
    dialect_note:
      "Nhiều bạn miền Bắc hay đổi /th/ thành /s/ — không sao, đây là chuyển đổi tự nhiên từ tiếng Việt mình.",
  },
  vn_north_r_to_z: {
    name_vi: "Phát âm /r/ tiếng Anh thành /z/",
    explanation_vi:
      "Trong giọng Hà Nội, các âm gi / d / r đều phát âm gần giống /z/. Khi gặp /r/ tiếng Anh, mình hay viết hoặc đọc thành 'z'. Mẹo: cong nhẹ đầu lưỡi về phía vòm miệng, không chạm — đó là /r/ tiếng Anh.",
    example_wrong_vi_gloss: "Zight here → 'Đúng/Phải đây' (right → zight)",
    needs_review: false,
    dialect_note:
      "Bạn miền Bắc hay viết 'z' thay cho 'r' — chuyện thường, mình luyện riêng phần này nhé.",
  },
  vn_north_r_to_l: {
    name_vi: "Đôi khi /r/ thành /l/",
    explanation_vi:
      "Một số bạn miền Bắc đổi /r/ tiếng Anh thành /l/ — 'right' thành 'light'. Đầu lưỡi đặt sau răng cửa cho /l/, cong về sau cho /r/.",
    example_wrong_vi_gloss: "Light now → 'Đúng/Phải bây giờ' (right → light)",
    needs_review: true,
    dialect_note: "Đặc trưng giọng một số vùng miền Bắc — không phổ biến với tất cả.",
  },
  vn_north_gi_d_r_merge: {
    name_vi: "Lẫn /gi/, /d/, /r/ trong tiếng Anh",
    explanation_vi:
      "Trong giọng Hà Nội, /gi/, /d/, /r/ trong tiếng Việt mình gần như đồng âm. Khi viết tiếng Anh, mình dễ thay 'd' bằng 'gi' hoặc 'j', ví dụ 'just' → 'giust'.",
    example_wrong_vi_gloss: "Giust me → 'Chỉ mình tôi' (just → giust)",
    needs_review: true,
    dialect_note: "Rất phổ biến với người Hà Nội học tiếng Anh — mình cùng tách rõ ba âm này.",
  },
  vn_north_v_w_swap: {
    name_vi: "Lẫn /w/ và /v/",
    explanation_vi:
      "Tiếng Việt mình không có âm /w/ rõ rệt, miền Bắc lại có /v/ mạnh — nên 'want' đôi khi viết thành 'vant'. /w/ tiếng Anh: chu môi tròn rồi tách ra, không đụng răng.",
    example_wrong_vi_gloss: "Vant some water → 'Muốn chút nước' (want → vant)",
    needs_review: true,
    dialect_note: "Đặc trưng giọng miền Bắc — luyện chu môi cho /w/ là nhanh nhất.",
  },

  // ── Southern ───────────────────────────────────────────────────────────
  vn_south_final_t_drop: {
    name_vi: "Bỏ âm /-t/ cuối từ",
    explanation_vi:
      "Nhiều bạn miền Nam mình quen bỏ âm cuối /-t/ — 'right' đọc thành 'rye', viết thiếu chữ t cuối. Tiếng Anh giữ âm cuối rất rõ; nhịp đặt nhẹ đầu lưỡi sau răng để khép lại.",
    example_wrong_vi_gloss: "Righ now → 'Đúng bây giờ' (bỏ /-t/ cuối)",
    needs_review: false,
    dialect_note:
      "Nhiều bạn miền Nam mình hay quên âm cuối ở từ tiếng Anh — không sao, mình cùng luyện.",
  },
  vn_south_final_d_drop: {
    name_vi: "Bỏ âm /-d/ cuối từ",
    explanation_vi:
      "Giọng miền Nam thường bỏ âm /-d/ cuối — 'good' thành 'goo', 'had' thành 'ha'. Khép lưỡi sau răng cho /d/, có rung nhẹ ở cổ họng.",
    example_wrong_vi_gloss: "Goo morning → 'Chào buổi sáng' (good → goo)",
    needs_review: false,
    dialect_note:
      "Đặc trưng giọng miền Nam — bỏ âm cuối là thói quen tự nhiên, mình luyện riêng phần khép âm.",
  },
  vn_south_final_k_drop: {
    name_vi: "Bỏ âm /-k/ cuối từ",
    explanation_vi:
      "Giọng miền Nam đôi khi bỏ /-k/ cuối — 'look' thành 'loo', 'back' thành 'ba'. /k/ tiếng Anh có một hơi bật nhẹ ở cuống họng.",
    example_wrong_vi_gloss: "Loo at it → 'Nhìn xem' (look → loo)",
    needs_review: false,
    dialect_note:
      "Bạn miền Nam mình quen bỏ âm cuối — luyện hơi bật nhẹ cuống họng cho /k/ rất nhanh quen.",
  },
  vn_south_n_ng_merge: {
    name_vi: "Lẫn /-n/ và /-ng/ cuối từ",
    explanation_vi:
      "Trong giọng miền Nam, /-n/ và /-ng/ cuối thường gần nhau — 'thing' viết thành 'thin', hoặc ngược lại. /-ng/ là âm mũi sâu, khẩu hình mở rộng hơn /-n/.",
    example_wrong_vi_gloss: "Some thin → 'Vài thứ' (thing → thin, mất /-g/)",
    needs_review: false,
    dialect_note: "Đặc trưng giọng miền Nam — tách rõ /-n/ và /-ng/ là bước thiết yếu.",
  },
  vn_south_v_to_y: {
    name_vi: "/v/ thành /y/ (giọng Sài Gòn truyền thống)",
    explanation_vi:
      "Một số bạn lớn tuổi miền Nam đổi /v/ thành /y/ — 'very' nghe như 'yery'. Đặt răng trên chạm môi dưới cho /v/, có rung.",
    example_wrong_vi_gloss: "Yery good → 'Rất tốt' (very → yery)",
    needs_review: true,
    dialect_note:
      "Đặc trưng giọng Sài Gòn xưa — không phải bạn miền Nam nào cũng có, nhưng là dấu vết rõ.",
  },
};

// ── Detection ─────────────────────────────────────────────────────────────

const NORTHERN_TAGS = new Set<VNDialectErrorTag>([
  "vn_north_th_s_confusion",
  "vn_north_r_to_z",
  "vn_north_r_to_l",
  "vn_north_gi_d_r_merge",
  "vn_north_v_w_swap",
]);

const SOUTHERN_TAGS = new Set<VNDialectErrorTag>([
  "vn_south_final_t_drop",
  "vn_south_final_d_drop",
  "vn_south_final_k_drop",
  "vn_south_n_ng_merge",
  "vn_south_v_to_y",
]);

/**
 * Tag a single (wrong, intended) spelling pair against the dialect rule
 * pack. Returns the rule that matches, or null. Exported for tests.
 */
export function classifyDialectSpellingError(
  wrong: string,
  intended: string,
): VNDialectErrorRule | null {
  const lowerWrong = wrong.toLowerCase().trim();
  if (!lowerWrong) return null;
  for (const rule of VN_DIALECT_RULES) {
    if (!rule.spellingPattern.test(lowerWrong)) continue;
    // For final-consonant-drop rules, the intended word should be the
    // wrong word + missing letter; we don't strictly enforce here, but
    // the regex banks above are tight enough to keep false-positives
    // low. Callers wanting tighter bias can compare lengths.
    if (rule.dialect === "southern" && intended.length > 0) {
      // Sanity: intended should be longer (extra final consonant) or
      // differ by a single character substitution (n/ng).
      if (intended.toLowerCase() === lowerWrong) continue;
    }
    return rule;
  }
  return null;
}

/**
 * Tag a single pronunciation sample. Returns the rule that matches.
 */
export function classifyDialectPronunciation(
  spoken: string,
  target: string,
): VNDialectErrorRule | null {
  const s = spoken.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  if (!s || !t) return null;
  for (const rule of VN_DIALECT_RULES) {
    if (!rule.pronunciationPattern) continue;
    if (
      rule.pronunciationPattern.spoken.test(s) &&
      rule.pronunciationPattern.target.test(t)
    ) {
      return rule;
    }
  }
  return null;
}

// Self-report → dialect mapping. Diaspora and unknown collapse to
// "unknown" because we can't know without phonetic evidence.
function selfReportToDialect(report: VNRegionSelfReport): VNDialect {
  switch (report) {
    case "north":
      return "northern";
    case "south":
      return "southern";
    case "central":
      return "central";
    default:
      return "unknown";
  }
}

/**
 * Detect the user's likely dialect from runtime signals.
 *
 * Confidence is computed in two layers:
 *   1. Self-report alone gives a confidence floor of 0.65 (the user
 *      told us, but they may be wrong about themselves; we still
 *      want phonetic signal to push it higher).
 *   2. Phonetic evidence is rated by *purity*: evidenceForWinner /
 *      totalEvidence, scaled by signal volume. With no signals at
 *      all and no self-report, we return "unknown" at confidence 0.
 *
 * Conflicting signals (e.g. "north" self-report + 6 southern markers)
 * trust the markers over self-report — diaspora users often grew up
 * speaking one dialect and were taught another. Confidence drops to
 * ~0.55 in that case so the UI can degrade gracefully.
 */
export function detectVNDialect(
  signals: DialectSignals,
): DialectDetectionResult {
  let northern = 0;
  let southern = 0;
  const central = 0; // we have no central error rules tonight

  for (const sample of signals.pronunciationSamples ?? []) {
    const hit = classifyDialectPronunciation(sample.spoken, sample.target);
    if (!hit) continue;
    if (NORTHERN_TAGS.has(hit.tag)) northern += 1;
    else if (SOUTHERN_TAGS.has(hit.tag)) southern += 1;
  }

  for (const err of signals.spellingErrors ?? []) {
    const hit = classifyDialectSpellingError(err.wrong, err.intended);
    if (!hit) continue;
    if (NORTHERN_TAGS.has(hit.tag)) northern += 1;
    else if (SOUTHERN_TAGS.has(hit.tag)) southern += 1;
  }

  const total = northern + southern + central;
  const evidence = { northern, southern, central };

  // Self-report path — used when signals are silent OR to break ties.
  const reported = signals.selfReportedRegion
    ? selfReportToDialect(signals.selfReportedRegion)
    : "unknown";

  // No signals at all.
  if (total === 0) {
    if (reported !== "unknown") {
      return { dialect: reported, confidence: 0.65, evidence };
    }
    return { dialect: "unknown", confidence: 0, evidence };
  }

  // Signals present — pick the dialect with most evidence.
  let winner: VNDialect = "unknown";
  let winnerCount = 0;
  if (northern > southern && northern > central) {
    winner = "northern";
    winnerCount = northern;
  } else if (southern > northern && southern > central) {
    winner = "southern";
    winnerCount = southern;
  } else if (central > northern && central > southern) {
    winner = "central";
    winnerCount = central;
  } else {
    // Tie → unknown with a low confidence reflecting the conflict.
    return {
      dialect: reported !== "unknown" ? reported : "unknown",
      confidence: reported !== "unknown" ? 0.5 : 0.3,
      evidence,
    };
  }

  // Purity: how dominant is the winner among all evidence?
  const purity = winnerCount / total;

  // Volume scaling: with only 1 hit we cap confidence at 0.55, with 5+
  // hits we let it reach 0.95. Linear interpolation in between.
  const volumeFactor =
    total >= 5 ? 1 : 0.55 + (Math.min(total, 5) - 1) * 0.1;

  let confidence = purity * volumeFactor;

  // Self-report agrees with markers → small confidence bump.
  if (reported === winner) {
    confidence = Math.min(0.97, confidence + 0.1);
  } else if (reported !== "unknown" && reported !== winner) {
    // Self-report disagrees with markers — diaspora-likely; trust
    // markers but don't claim certainty.
    confidence = Math.min(confidence, 0.55);
  }

  // Floor for any non-tie: never below 0.4 if evidence exists, so
  // callers can use a single threshold for "show the badge."
  confidence = Math.max(0.4, Math.min(0.97, Number(confidence.toFixed(2))));

  return { dialect: winner, confidence, evidence };
}

// ── Helper for UI surfaces ────────────────────────────────────────────────

/**
 * Returns the dialect-aware note for a given dialect-error tag, or
 * undefined if the tag has no dialect note. Useful when the UI wants
 * to prepend a single sentence to the existing L1 explanation card.
 */
export function getDialectAwareNote(tag: VNDialectErrorTag): string | undefined {
  return VN_DIALECT_EXPLANATIONS[tag]?.dialect_note;
}
