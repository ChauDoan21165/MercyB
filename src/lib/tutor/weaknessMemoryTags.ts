/**
 * Teacher Mercy — Learner Weakness Memory Tags
 *
 * Tags, ranks, and recalls persistent learner weaknesses across correction
 * events so Teacher Mercy can reference them naturally — like a human teacher
 * who remembers "anh hay quên 's' ở động từ ngôi thứ ba."
 *
 * This module feeds the Teacher Mercy contract (R5_REMEMBER_WEAKNESS in
 * teacherMercyContract.ts) and the learner_memory_use rubric dimension
 * (teacherMercyRubric.ts).
 *
 * This module does NOT:
 *   - Store/persist profiles (see learnerHistoryProfile.ts)
 *   - Validate whether a weakness was referenced (see teacherMercyContract.ts)
 *   - Generate tutor responses (upstream caller responsibility)
 *
 * Design principles:
 *   1. Pure functions — no I/O, no side effects, deterministic.
 *   2. Vietnamese-first — weakness categories reflect VN→EN L1 transfer.
 *   3. Recency-weighted — recent weaknesses rank higher than old ones.
 *   4. Pattern over instance — tag the category, not the raw text.
 *   5. One primary weakness — recall returns the single most relevant tag.
 *
 * Invariant: this module never stores raw learner text, PII, or transcripts.
 * Only safe category tags, aggregate counts, and anonymized exemplar patterns.
 */

import type { VietEnInterferenceTag } from "./learnerHistoryProfile";

// ─── Weakness Categories ──────────────────────────────────────────────────

/**
 * Weakness categories that Teacher Mercy can track.
 *
 * These align with VietEnInterferenceTag from learnerHistoryProfile.ts
 * but add broader categories (word_choice, sentence_structure, pronunciation)
 * that aren't strictly L1-interference patterns.
 */
export type WeaknessCategory =
  | VietEnInterferenceTag   // "missing-article" | "tense-omission" | ...
  | "word_choice"           // wrong word but meaning clear
  | "sentence_structure"    // awkward/clunky sentence construction
  | "pronunciation"         // systematic pronunciation issue
  | "politeness_register"   // too casual / too formal for context
  | (string & {});

// ─── Tag Types ────────────────────────────────────────────────────────────

/**
 * A single tagged weakness — one persistent error pattern.
 */
export type WeaknessTag = {
  /** The weakness category. */
  category: WeaknessCategory;
  /** Vietnamese label for display (e.g., "thiếu mạo từ"). */
  labelVi: string;
  /** English label for telemetry. */
  labelEn: string;
  /** Number of times this weakness has been observed. */
  count: number;
  /** Unix ms of first observation. */
  firstSeenAt: number;
  /** Unix ms of most recent observation. */
  lastSeenAt: number;
  /**
   * Anonymized exemplar pattern — the corrected form, NOT raw learner text.
   * Example: "I go → I went" (safe: no learner PII, no raw input).
   */
  exemplarPattern: string;
};

/**
 * Cumulative weakness memory for one learner.
 *
 * Persisted by learnerHistoryProfile.ts (localStorage key:
 * mercy.learnerHistoryProfile.v1.{product}.{language}).
 * This module is the intelligence layer that mutates the in-memory
 * representation; the caller is responsible for persistence.
 */
export type WeaknessMemory = {
  /** All tagged weaknesses, ordered by relevance (most relevant first). */
  tags: WeaknessTag[];
  /** Total number of correction events observed (for rate context). */
  totalCorrectionsObserved: number;
  /** Unix ms of last update. */
  updatedAt: number;
};

// ─── Input / Output Types ─────────────────────────────────────────────────

/**
 * Input for tagging a new weakness observation.
 */
export type WeaknessTagInput = {
  /** The error category from the correction engine. */
  errorCategory: string;
  /** A grammar point label, if known (e.g., "past_tense", "articles"). */
  grammarPoint?: string;
  /** The learner's L1 (default "vi"). */
  l1: string;
  /** Safe exemplar pattern (e.g., "I go → I went"). Never raw learner text. */
  exemplarPattern: string;
};

/**
 * Result of recalling a relevant weakness for the current turn.
 */
export type WeaknessRecallResult = {
  /** The most relevant weakness to reference, or null if none found. */
  recalled: WeaknessTag | null;
  /** Human-readable reason for the recall decision, in English. */
  reason: string;
  /** Machine-readable reason code for telemetry. */
  reasonCode: string;
  /** Suggested Vietnamese phrase to naturally reference this weakness. */
  suggestedReferenceVi: string;
  /** Suggested English phrase (for telemetry / non-VN contexts). */
  suggestedReferenceEn: string;
  /** Whether the recalled weakness is strong enough to warrant mentioning. */
  shouldMention: boolean;
};

// ─── Category Catalog ─────────────────────────────────────────────────────

type WeaknessCategoryMeta = {
  category: WeaknessCategory;
  labelVi: string;
  labelEn: string;
  /** Vietnamese explanation of why this matters for VN learners. */
  whyVi: string;
  /** Typical Vietnamese L1 transfer explanation. */
  l1TransferNoteVi: string;
};

const WEAKNESS_CATEGORY_CATALOG: WeaknessCategoryMeta[] = [
  {
    category: "missing-article",
    labelVi: "thiếu mạo từ (a/an/the)",
    labelEn: "missing articles",
    whyVi: "Tiếng Việt không có mạo từ — người Việt thường bỏ qua a/an/the khi nói tiếng Anh.",
    l1TransferNoteVi: "Trong tiếng Việt không có 'cái', 'con', 'quyển' đi kèm danh từ như mạo từ tiếng Anh.",
  },
  {
    category: "tense-omission",
    labelVi: "thiếu thì (quá khứ / hiện tại / tương lai)",
    labelEn: "tense omission",
    whyVi: "Tiếng Việt dùng trạng từ chỉ thời gian (đã, đang, sẽ) thay vì chia động từ — người Việt thường quên chia thì.",
    l1TransferNoteVi: "Tiếng Việt không chia động từ theo thì — 'hôm qua tôi đi' chứ không phải 'hôm qua tôi đã đi'.",
  },
  {
    category: "subj-verb-agreement",
    labelVi: "thiếu hợp nhất chủ-động từ",
    labelEn: "subject-verb agreement",
    whyVi: "Động từ tiếng Việt không chia theo ngôi — người Việt thường quên thêm 's' cho ngôi thứ ba số ít.",
    l1TransferNoteVi: "Trong tiếng Việt, 'tôi đi', 'anh ấy đi', 'họ đi' đều dùng 'đi' — không có khái niệm chia động từ.",
  },
  {
    category: "preposition-calque",
    labelVi: "sai giới từ (in/on/at)",
    labelEn: "preposition errors",
    whyVi: "Người Việt thường dịch thẳng giới từ tiếng Việt sang tiếng Anh — 'vào buổi sáng' → 'at the morning' thay vì 'in the morning'.",
    l1TransferNoteVi: "Tiếng Việt dùng một giới từ cho nhiều ngữ cảnh — 'ở' có thể là 'in', 'at', 'on' tùy trường hợp.",
  },
  {
    category: "word-order",
    labelVi: "sai trật tự từ",
    labelEn: "word order errors",
    whyVi: "Tiếng Việt để tính từ SAU danh từ (áo đỏ) — người Việt đôi khi nói 'a shirt red' thay vì 'a red shirt'.",
    l1TransferNoteVi: "Trong tiếng Việt, từ bổ nghĩa đứng sau từ chính — 'áo đỏ' chứ không phải 'đỏ áo'.",
  },
  {
    category: "zero-copula",
    labelVi: "thiếu động từ 'to be'",
    labelEn: "missing copula",
    whyVi: "Người Việt thường bỏ 'là' trong câu — 'cô ấy đẹp' thay vì 'cô ấy là đẹp'. Thói quen này lan sang tiếng Anh: 'She beautiful'.",
    l1TransferNoteVi: "Tiếng Việt thường bỏ 'là' khi miêu tả — 'cô ấy đẹp' thay vì 'cô ấy là đẹp'.",
  },
  {
    category: "double-negation",
    labelVi: "phủ định kép",
    labelEn: "double negation",
    whyVi: "Tiếng Việt dùng phủ định kép ('không … không', 'chưa … không') — người Việt đôi khi nói 'I don't have no money'.",
    l1TransferNoteVi: "Tiếng Việt thường dùng hai từ phủ định trong một câu: 'không có gì không làm được'.",
  },
  {
    category: "word_choice",
    labelVi: "chọn từ chưa chuẩn",
    labelEn: "word choice",
    whyVi: "Người học dùng từ gần đúng nhưng chưa tự nhiên — 'big rain' thay vì 'heavy rain'.",
    l1TransferNoteVi: "Nhiều từ tiếng Việt có phạm vi nghĩa khác với từ tiếng Anh tương đương.",
  },
  {
    category: "sentence_structure",
    labelVi: "cấu trúc câu lủng củng",
    labelEn: "awkward sentence structure",
    whyVi: "Người học dịch từng từ một từ tiếng Việt sang tiếng Anh, tạo ra câu đúng ngữ pháp nhưng không tự nhiên.",
    l1TransferNoteVi: "Cấu trúc câu tiếng Việt khác tiếng Anh về cách sắp xếp mệnh đề và trạng ngữ.",
  },
  {
    category: "pronunciation",
    labelVi: "phát âm sai hệ thống",
    labelEn: "systematic pronunciation error",
    whyVi: "Người Việt thường gặp khó với âm cuối (ending sounds) và cụm phụ âm (consonant clusters).",
    l1TransferNoteVi: "Tiếng Việt không có âm cuối như /s/, /z/, /ʃ/, /tʃ/ và không có cụm phụ âm.",
  },
  {
    category: "politeness_register",
    labelVi: "chưa phù hợp văn cảnh",
    labelEn: "politeness register",
    whyVi: "Người Việt đôi khi nói quá thẳng trong tiếng Anh — 'Give me coffee' thay vì 'Could I have a coffee?'",
    l1TransferNoteVi: "Tiếng Việt có hệ thống xưng hô phức tạp, nhưng tiếng Anh dùng cấu trúc lịch sự thay vì đại từ.",
  },
];

// ─── Classification: Error Signal → Weakness Category ─────────────────────

/**
 * Classification rules: maps error-category keywords and grammar-point
 * signals to a concrete WeaknessCategory.
 *
 * Each rule is evaluated in order; first match wins. Rules are designed
 * to be deterministic — same input always produces the same category.
 */
type ClassificationRule = {
  /** Pattern to match against errorCategory or grammarPoint. */
  match: (input: WeaknessTagInput) => boolean;
  /** The weakness category to assign. */
  category: WeaknessCategory;
};

const CLASSIFICATION_RULES: ClassificationRule[] = [
  // ── Article-related ──
  {
    match: (i) =>
      /article|a\b.*\ban\b|\ban\b.*\ba\b|mạo từ/.test(i.errorCategory + " " + (i.grammarPoint ?? "")),
    category: "missing-article",
  },
  // ── Tense-related ──
  {
    match: (i) =>
      /tense|past|present|future|thì|quá khứ|hiện tại|tương lai|verb.form|irregular/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "tense-omission",
  },
  // ── Subject-verb agreement ──
  {
    match: (i) =>
      /agreement|subj.*verb|verb.*subj|third.person|ngôi thứ|hợp nhất|chia động từ|s\b.*es\b/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "subj-verb-agreement",
  },
  // ── Prepositions ──
  {
    match: (i) =>
      /preposition|prep\b|giới từ|in\b.*\bon\b.*\bat\b|\bat\b.*\bin\b|\bon\b.*\bin\b/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "preposition-calque",
  },
  // ── Word order ──
  {
    match: (i) =>
      /word.order|trật tự|adjective.order|noun.*modifier|modifier.*noun/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "word-order",
  },
  // ── Copula / to-be ──
  {
    match: (i) =>
      /copula|to.be|be.verb|linking.verb|động từ to be|thiếu.*be|missing.*be\b/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "zero-copula",
  },
  // ── Negation ──
  {
    match: (i) =>
      /negation|negative|double.neg|phủ định/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "double-negation",
  },
  // ── Pronunciation ──
  {
    match: (i) =>
      /pronunc|phát âm|ending.sound|final.consonant|cluster/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "pronunciation",
  },
  // ── Politeness / register ──
  {
    match: (i) =>
      /politeness|register|formal|informal|too.direct|lịch sự|văn cảnh/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "politeness_register",
  },
  // ── Sentence structure ──
  {
    match: (i) =>
      /structure|sentence|wordy|awkward|redundant|cấu trúc|lủng củng/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "sentence_structure",
  },
  // ── Word choice (catch-all for unknown grammar/vocab errors) ──
  {
    match: (i) =>
      /word.choice|vocab|từ vựng|chọn từ|wrong.word|unnatural/.test(
        i.errorCategory + " " + (i.grammarPoint ?? ""),
      ),
    category: "word_choice",
  },
];

/**
 * Classify an error observation into a weakness category.
 *
 * Pure function — deterministic, no side effects.
 *
 * @returns The classified WeaknessCategory, or null if no rule matches.
 */
export function classifyWeakness(input: WeaknessTagInput): WeaknessCategory | null {
  for (const rule of CLASSIFICATION_RULES) {
    if (rule.match(input)) {
      return rule.category;
    }
  }
  // No rule matched — uncategorized. The caller can still track this
  // as a custom string category via the (string & {}) union member.
  return null;
}

// ─── Category Metadata Lookup ─────────────────────────────────────────────

function getCategoryMeta(category: WeaknessCategory): WeaknessCategoryMeta | undefined {
  return WEAKNESS_CATEGORY_CATALOG.find((c) => c.category === category);
}

// ─── Memory Operations ────────────────────────────────────────────────────

/**
 * Create an empty weakness memory.
 *
 * Pure function — deterministic, no side effects.
 */
export function createEmptyWeaknessMemory(now = Date.now()): WeaknessMemory {
  return {
    tags: [],
    totalCorrectionsObserved: 0,
    updatedAt: now,
  };
}

/**
 * Tag a new weakness observation into the memory.
 *
 * If the category already exists, increments count and updates recency.
 * If new, creates a fresh tag. Tags are re-sorted by relevance after update.
 *
 * Pure function — deterministic given the same inputs.
 *
 * @param memory — the current weakness memory (immutable — returns new copy)
 * @param input — the observation to tag
 * @param now — current timestamp (injectable for testing)
 * @returns A new WeaknessMemory with the observation recorded
 */
export function tagWeakness(
  memory: WeaknessMemory,
  input: WeaknessTagInput,
  now = Date.now(),
): WeaknessMemory {
  const category = classifyWeakness(input);
  const meta = category ? getCategoryMeta(category) : undefined;

  // If uncategorized, still increment the observation counter but don't tag
  if (!category || !meta) {
    return {
      ...memory,
      totalCorrectionsObserved: memory.totalCorrectionsObserved + 1,
      updatedAt: now,
    };
  }

  const existingIndex = memory.tags.findIndex((t) => t.category === category);

  let updatedTags: WeaknessTag[];

  if (existingIndex >= 0) {
    // Update existing tag
    updatedTags = memory.tags.map((t, i) =>
      i === existingIndex
        ? {
            ...t,
            count: t.count + 1,
            lastSeenAt: now,
            // Only update exemplar if the new one is different (avoid churn)
            exemplarPattern:
              input.exemplarPattern !== t.exemplarPattern
                ? input.exemplarPattern
                : t.exemplarPattern,
          }
        : t,
    );
  } else {
    // Create new tag
    const newTag: WeaknessTag = {
      category,
      labelVi: meta.labelVi,
      labelEn: meta.labelEn,
      count: 1,
      firstSeenAt: now,
      lastSeenAt: now,
      exemplarPattern: input.exemplarPattern,
    };
    updatedTags = [...memory.tags, newTag];
  }

  // Re-sort by relevance (most relevant first)
  updatedTags = sortByRelevance(updatedTags, now);

  return {
    tags: updatedTags,
    totalCorrectionsObserved: memory.totalCorrectionsObserved + 1,
    updatedAt: now,
  };
}

/**
 * Recall the most relevant weakness for a given error context.
 *
 * Given the current error being corrected, this finds the most relevant
 * past weakness to reference. If the current error matches a tracked
 * weakness category, that tag is surfaced with a natural reference phrase.
 *
 * Pure function — deterministic, no side effects.
 *
 * @param memory — the weakness memory
 * @param currentError — the error context for the current turn
 * @param now — current timestamp (injectable for testing)
 * @returns WeaknessRecallResult with the best tag to reference
 */
export function recallRelevantWeakness(
  memory: WeaknessMemory,
  currentError: {
    errorCategory: string;
    grammarPoint?: string;
    l1: string;
  },
  now = Date.now(),
): WeaknessRecallResult {
  // If no tags at all, nothing to recall
  if (memory.tags.length === 0) {
    return {
      recalled: null,
      reason: "No weaknesses have been tracked yet.",
      reasonCode: "no_tags",
      suggestedReferenceVi: "",
      suggestedReferenceEn: "",
      shouldMention: false,
    };
  }

  const currentCategory = classifyWeakness({
    errorCategory: currentError.errorCategory,
    grammarPoint: currentError.grammarPoint,
    l1: currentError.l1,
    exemplarPattern: "",
  });

  // If the current error matches a tracked weakness, recall that exact tag
  if (currentCategory) {
    const matchingTag = memory.tags.find((t) => t.category === currentCategory);
    if (matchingTag) {
      const ref = getSuggestedReferencePhrase(matchingTag, currentError.l1, "repeat");
      return {
        recalled: matchingTag,
        reason: `Current error category "${currentCategory}" matches tracked weakness "${matchingTag.labelVi}" (seen ${matchingTag.count} times).`,
        reasonCode: "exact_match",
        suggestedReferenceVi: ref.vi,
        suggestedReferenceEn: ref.en,
        shouldMention: matchingTag.count >= 2,
      };
    }
  }

  // No direct match — recall the most relevant (top-ranked) weakness
  const topTag = memory.tags[0];

  // Only mention if it's been seen recently (within 7 days) or frequently (≥ 3 times)
  const DAY_MS = 24 * 60 * 60 * 1000;
  const isRecent = now - topTag.lastSeenAt <= 7 * DAY_MS;
  const isFrequent = topTag.count >= 3;
  const shouldMention = isRecent || isFrequent;

  const ref = getSuggestedReferencePhrase(topTag, currentError.l1, "general");

  return {
    recalled: topTag,
    reason: `No exact match for "${currentError.errorCategory}". Recalling top weakness "${topTag.labelVi}" (${topTag.count}x, last seen ${Math.round((now - topTag.lastSeenAt) / DAY_MS)}d ago).`,
    reasonCode: "top_ranked",
    suggestedReferenceVi: ref.vi,
    suggestedReferenceEn: ref.en,
    shouldMention,
  };
}

// ─── Weakness Ranking ─────────────────────────────────────────────────────

/**
 * Get the top N weaknesses, ranked by relevance.
 *
 * Relevance = recency_weight × frequency_weight
 *   - recency_weight: 1.0 (today) → 0.1 (90+ days ago), linear decay
 *   - frequency_weight: min(count / 5, 1.0) — saturates at 5 occurrences
 *
 * Pure function — deterministic.
 */
export function getTopWeaknesses(
  memory: WeaknessMemory,
  count = 3,
  now = Date.now(),
): WeaknessTag[] {
  const sorted = sortByRelevance([...memory.tags], now);
  return sorted.slice(0, count);
}

/**
 * Compute a relevance score for a single tag.
 *
 * Score = recency_weight × frequency_weight × 100
 *
 *   recency_weight  = max(0.1, 1.0 − days_since / 90)
 *     → 1.0 today, ~0.5 at 45 days, 0.1 at 90+ days
 *   frequency_weight = min(count / 5, 1.0)
 *     → 0.2 for 1st occurrence, 1.0 for 5+
 *
 * This means a tag seen 1 time today scores ~20, while a tag seen 5+ times
 * today scores 100. A tag seen 1 time 90 days ago scores ~2.
 */
export function computeRelevanceScore(tag: WeaknessTag, now = Date.now()): number {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const daysSince = Math.max(0, (now - tag.lastSeenAt) / DAY_MS);

  const recencyWeight = Math.max(0.1, 1.0 - daysSince / 90);
  const frequencyWeight = Math.min(tag.count / 5, 1.0);

  return Math.round(recencyWeight * frequencyWeight * 100);
}

function sortByRelevance(tags: WeaknessTag[], now: number): WeaknessTag[] {
  return tags
    .map((t) => ({ tag: t, score: computeRelevanceScore(t, now) }))
    .sort((a, b) => b.score - a.score)
    .map(({ tag }) => tag);
}

// ─── Reference Phrase Generation ──────────────────────────────────────────

/**
 * Get a natural-sounding reference phrase for a weakness tag.
 *
 * These phrases are what a human teacher would say when noticing
 * a recurring error pattern. They are designed to be face-saving
 * and encouraging, never shaming.
 *
 * @param tag — the weakness to reference
 * @param l1 — the learner's native language (for language-appropriate phrasing)
 * @param context — "repeat" if this exact category is recurring now,
 *                  "general" if recalling a top weakness without direct match
 */
export function getSuggestedReferencePhrase(
  tag: WeaknessTag,
  l1: string,
  context: "repeat" | "general" = "repeat",
): { vi: string; en: string } {
  const isVietnamese = l1 === "vi";

  if (context === "repeat") {
    return getRepeatReferencePhrase(tag, isVietnamese);
  }
  return getGeneralReferencePhrase(tag, isVietnamese);
}

function getRepeatReferencePhrase(
  tag: WeaknessTag,
  isVietnamese: boolean,
): { vi: string; en: string } {
  // Pick a varied phrase based on count to avoid sounding robotic
  const phraseIndex = Math.min(tag.count - 1, REPEAT_PHRASES_BY_CATEGORY.length - 1);
  const phrases = REPEAT_PHRASES_BY_CATEGORY[phraseIndex] ?? REPEAT_PHRASES_BY_CATEGORY[0];

  const vi = phrases.vi.replace("{label}", tag.labelVi);
  const en = phrases.en.replace("{label}", tag.labelEn);

  return { vi, en };
}

function getGeneralReferencePhrase(
  tag: WeaknessTag,
  isVietnamese: boolean,
): { vi: string; en: string } {
  const phraseIndex = Math.min(tag.count - 1, GENERAL_PHRASES_BY_CATEGORY.length - 1);
  const phrases = GENERAL_PHRASES_BY_CATEGORY[phraseIndex] ?? GENERAL_PHRASES_BY_CATEGORY[0];

  const vi = phrases.vi.replace("{label}", tag.labelVi);
  const en = phrases.en.replace("{label}", tag.labelEn);

  return { vi, en };
}

/**
 * Reference phrases for when the current error matches a tracked weakness.
 * Varied by occurrence count so Mercy doesn't sound like a broken record.
 */
const REPEAT_PHRASES_BY_CATEGORY: Array<{ vi: string; en: string }> = [
  {
    vi: "Mình để ý đây cũng là điểm {label} mà mình đang theo dõi.",
    en: "I notice this relates to {label}, which I've been tracking.",
  },
  {
    vi: "Giống như lần trước, {label} vẫn là điểm mình muốn bạn chú ý.",
    en: "Like last time, {label} is still something I want you to watch for.",
  },
  {
    vi: "Lại gặp {label} — đây là điểm mình thấy xuất hiện nhiều lần rồi.",
    en: "{label} again — this is a pattern I've noticed several times now.",
  },
  {
    vi: "Mình đã lưu ý {label} vài lần — tiếp tục luyện điểm này nhé.",
    en: "I've noted {label} a few times — let's keep practicing this.",
  },
  {
    vi: "{label} là điểm mình đã theo dõi từ lâu — đây là lần thứ {count} rồi.",
    en: "{label} is something I've been tracking for a while — this is occurrence #{count}.",
  },
];

/**
 * General reference phrases for recalling a top weakness without direct match.
 */
const GENERAL_PHRASES_BY_CATEGORY: Array<{ vi: string; en: string }> = [
  {
    vi: "Nhân đây, mình muốn nhắc lại điểm {label} mà bạn đang cải thiện.",
    en: "While we're here, I want to mention {label}, which you've been working on.",
  },
  {
    vi: "Bạn đang tiến bộ với {label} — mình chỉ muốn nhắc lại để bạn tiếp tục chú ý.",
    en: "You're making progress with {label} — just a reminder to keep an eye on it.",
  },
  {
    vi: "Một điểm mình vẫn theo dõi cho bạn là {label}.",
    en: "One thing I'm still tracking for you is {label}.",
  },
];

// ─── Merge Helpers ────────────────────────────────────────────────────────

/**
 * Merge two weakness memories (e.g., combining local + server-side data).
 *
 * Tags with the same category are combined: counts sum, timestamps
 * take the min/max, and the exemplar from the more recent tag wins.
 *
 * Pure function — deterministic.
 */
export function mergeWeaknessMemories(
  a: WeaknessMemory,
  b: WeaknessMemory,
  now = Date.now(),
): WeaknessMemory {
  const tagMap = new Map<WeaknessCategory, WeaknessTag>();

  for (const tag of [...a.tags, ...b.tags]) {
    const existing = tagMap.get(tag.category);
    if (existing) {
      tagMap.set(tag.category, {
        category: tag.category,
        labelVi: tag.labelVi,
        labelEn: tag.labelEn,
        count: existing.count + tag.count,
        firstSeenAt: Math.min(existing.firstSeenAt, tag.firstSeenAt),
        lastSeenAt: Math.max(existing.lastSeenAt, tag.lastSeenAt),
        exemplarPattern:
          tag.lastSeenAt > existing.lastSeenAt
            ? tag.exemplarPattern
            : existing.exemplarPattern,
      });
    } else {
      tagMap.set(tag.category, { ...tag });
    }
  }

  const tags = sortByRelevance([...tagMap.values()], now);

  return {
    tags,
    totalCorrectionsObserved: a.totalCorrectionsObserved + b.totalCorrectionsObserved,
    updatedAt: now,
  };
}

// ─── Pruning ──────────────────────────────────────────────────────────────

/**
 * Prune stale weaknesses older than `maxAgeDays` days.
 *
 * A stale weakness is one whose lastSeenAt is older than the cutoff.
 * Weaknesses that have been seen frequently (≥ 5 times) are preserved
 * even if stale — they represent persistent patterns worth remembering.
 *
 * Pure function — deterministic.
 */
export function pruneStaleWeaknesses(
  memory: WeaknessMemory,
  maxAgeDays = 60,
  now = Date.now(),
): WeaknessMemory {
  const cutoff = now - maxAgeDays * 24 * 60 * 60 * 1000;

  const kept = memory.tags.filter(
    (t) => t.lastSeenAt >= cutoff || t.count >= 5,
  );

  return {
    ...memory,
    tags: kept,
    updatedAt: now,
  };
}

/**
 * Get a weakness-memory summary suitable for the contract's
 * `trackedWeakness` field. Returns the label of the top-ranked weakness,
 * or null if no weaknesses are tracked.
 *
 * This bridges the weakness memory layer to the contract validation layer.
 */
export function getTrackedWeaknessLabel(memory: WeaknessMemory): string | null {
  if (memory.tags.length === 0) return null;
  return memory.tags[0].labelVi;
}

// ─── Catalog ──────────────────────────────────────────────────────────────

export const WEAKNESS_MEMORY_TAGS_CATALOG = WEAKNESS_CATEGORY_CATALOG;

export const WEAKNESS_MEMORY_DIMENSIONS = [
  {
    id: "classification" as const,
    titleVi: "Phân loại điểm yếu",
    titleEn: "Weakness classification",
    descriptionVi: "Tự động phân loại lỗi của người học vào danh mục điểm yếu dựa trên tín hiệu từ bộ sửa lỗi.",
  },
  {
    id: "ranking" as const,
    titleVi: "Xếp hạng điểm yếu",
    titleEn: "Weakness ranking",
    descriptionVi: "Xếp hạng điểm yếu theo độ mới (recency) và tần suất — điểm nào mới và thường xuyên nhất sẽ được ưu tiên.",
  },
  {
    id: "recall" as const,
    titleVi: "Gợi nhớ điểm yếu",
    titleEn: "Weakness recall",
    descriptionVi: "Khi người học mắc lỗi, tự động tìm điểm yếu liên quan nhất để Mercy có thể nhắc đến tự nhiên.",
  },
  {
    id: "phrasing" as const,
    titleVi: "Cụm từ gợi nhớ",
    titleEn: "Reference phrasing",
    descriptionVi: "Cung cấp cụm từ tiếng Việt tự nhiên để Mercy dùng khi nhắc điểm yếu — giữ thể diện, không trách móc.",
  },
];
