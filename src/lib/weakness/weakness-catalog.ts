// src/lib/weakness/weakness-catalog.ts
//
// Single source of truth for placement-test + L1-detector weakness tags.
//
// Every UI surface that consumes weakness tags (Home focus-areas card,
// micro-lesson dialog, grammar-writing L1 hint card, analytics) reads
// from this catalog. If a tag string changes, only this file changes —
// callers stay stable.
//
// Tag sources:
//   - src/lib/placement/engine.ts (CC3) emits
//     `EngineSnapshot.weaknessFlags: string[]` on placement-test
//     completion. Stored into profiles.placement_weaknesses + the
//     mb_user_weakness_profile table.
//   - src/lib/feedback/l1-error-detector.ts (CC1) emits
//     `L1DetectionResult.weaknessTag` when a known L1-transfer pattern
//     is detected in user-authored grammar writing. Delivered via
//     /api/mercy/grammar → GrammarApiResponse.l1Hint.
//
// Bilingual strings are Chau-reviewed drafts. Entries 1–3 (the original
// placement catalog) were reviewed 2026-04-23. Entries 4–20 were added
// in the 2026-04-24 expansion and will be locked on next review.
//
// Inline bolding: `**word**` markdown syntax. Rendered by
// `renderInlineBold` in this module. Plain strings stay portable for
// future translation-memory export.
//
// When adding a new tag:
//   1. Add it to the `WeaknessTag` union.
//   2. Add the matching entry to WEAKNESS_CATALOG.
//   3. Keep linkedRoomId null if no existing room covers it — CC4
//      handles the "no room yet" state in the Learn More flow. If you
//      set a roomId, the companion test asserts it exists in
//      public/data/.

export type WeaknessTag =
  // Placement-test catalog (original 3)
  | "vi_l1_3rd_person_s"
  | "vi_l1_past_ed"
  | "vi_l1_plural_s"
  // L1 detector rules shipped in PR #19 (detector-only until now)
  | "vi_l1_missing_be"
  | "vi_l1_question_no_aux"
  | "vi_l1_missing_article"
  | "vi_l1_possessive_gender"
  | "vi_l1_preposition_transfer"
  | "vi_l1_countable"
  // L1 detector expansion (CC1 feat/l1-rules-expansion) — placeholder
  // names; refresh from CC1's constants file when their branch merges.
  | "vi_l1_to_verb_confusion"
  | "vi_l1_can_no_infinitive"
  | "vi_l1_double_past"
  | "vi_l1_possessive_s_missing"
  | "vi_l1_comparative_double"
  | "vi_l1_adjective_order"
  | "vi_l1_very_much_placement"
  | "vi_l1_there_are_singular"
  | "vi_l1_everyone_plural"
  | "vi_l1_make_vs_do"
  | "vi_l1_tag_question";

export type BilingualText = {
  /** English surface — may contain `**word**` markdown bolding. */
  en: string;
  /** Vietnamese surface — may contain `**word**` markdown bolding. */
  vi: string;
};

export type WeaknessEntry = {
  /** Machine identifier. Must match the detector / engine emission exactly. */
  tag: WeaknessTag;
  /** 2–4 word bilingual badge/headline for cards and dialog headers. */
  shortLabel: BilingualText;
  /**
   * 1–2 sentence "why this is hard for Vietnamese speakers" explanation.
   * Teacher-warm register; `tiếng Việt mình…` framing is encouraged
   * where it reads naturally.
   */
  longDescription: BilingualText;
  /** Concrete wrong example a Vietnamese learner would typically write. */
  exampleWrong: string;
  /** The target-correct form. */
  exampleRight: string;
  /**
   * Id of a room that teaches this weakness. `null` when no existing
   * room is a good fit — the Learn More flow surfaces a
   * "coming soon" state for those. If non-null, the companion test
   * enforces that public/data/{id}.json exists.
   */
  linkedRoomId: string | null;
};

export const WEAKNESS_CATALOG: Record<WeaknessTag, WeaknessEntry> = {
  // ────────────────────────────────────────────────────────────────────────
  // Placement-test catalog (Chau-reviewed 2026-04-23)
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_3rd_person_s: {
    tag: "vi_l1_3rd_person_s",
    shortLabel: {
      en: "Subject-verb agreement",
      vi: "Chia động từ theo chủ ngữ",
    },
    longDescription: {
      en: "Vietnamese verbs don't change form for person. English adds **-s** to the verb when the subject is **he**, **she**, or **it**.",
      vi: "Động từ tiếng Việt không thay đổi theo ngôi. Trong tiếng Anh, động từ thêm **-s** khi chủ ngữ là **he**, **she**, **it**.",
    },
    exampleWrong: "She go to school every day.",
    exampleRight: "She goes to school every day.",
    linkedRoomId: "english_a1_a107",
  },

  vi_l1_past_ed: {
    tag: "vi_l1_past_ed",
    shortLabel: {
      en: "Past tense with **-ed**",
      vi: "Thì quá khứ với **-ed**",
    },
    longDescription: {
      en: "Vietnamese shows past time with words like **hôm qua** or **đã** — the verb doesn't change. English changes the verb itself: **work → worked**.",
      vi: "Tiếng Việt diễn tả quá khứ bằng các từ như **hôm qua** hoặc **đã**, không đổi hình thức động từ. Tiếng Anh thay đổi chính động từ: **work → worked**.",
    },
    exampleWrong: "Yesterday I work late.",
    exampleRight: "Yesterday I worked late.",
    linkedRoomId: "english_a2_a206",
  },

  vi_l1_plural_s: {
    tag: "vi_l1_plural_s",
    shortLabel: {
      en: "Plural nouns with **-s**",
      vi: "Danh từ số nhiều với **-s**",
    },
    longDescription: {
      en: "Vietnamese nouns don't change when counting more than one — markers like **các** or **những** do the work. English adds **-s** to most nouns when there's more than one: **book → books**.",
      vi: "Danh từ tiếng Việt không đổi khi đếm nhiều hơn một — dấu hiệu số nhiều nằm ở các từ như **các** hoặc **những**. Tiếng Anh thêm **-s** vào hầu hết danh từ khi số lượng nhiều hơn một: **book → books**.",
    },
    exampleWrong: "I have two book.",
    exampleRight: "I have two books.",
    linkedRoomId: "english_a1_a109",
  },

  // ────────────────────────────────────────────────────────────────────────
  // L1 detector rules from PR #19 (draft strings — pending Chau review)
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_missing_be: {
    tag: "vi_l1_missing_be",
    shortLabel: {
      en: 'Missing "to be"',
      vi: 'Thiếu động từ "to be"',
    },
    longDescription: {
      en: "Vietnamese often skips the **to be** verb — **Cô ấy giáo viên** is a complete sentence. English always needs one: **She is a teacher**.",
      vi: "Tiếng Việt mình hay bỏ động từ **to be** — **Cô ấy giáo viên** là đủ câu. Tiếng Anh luôn cần có: **She is a teacher**.",
    },
    exampleWrong: "She a teacher.",
    exampleRight: "She is a teacher.",
    linkedRoomId: "english_a1_a104",
  },

  vi_l1_question_no_aux: {
    tag: "vi_l1_question_no_aux",
    shortLabel: {
      en: "Question structure",
      vi: "Cấu trúc câu hỏi",
    },
    longDescription: {
      en: "Vietnamese turns a sentence into a question just with **phải không?** or a rising tone. English adds **do / does / did** at the front: **Do you like coffee?**",
      vi: "Tiếng Việt mình chỉ cần thêm **phải không?** hoặc đổi ngữ điệu là thành câu hỏi. Tiếng Anh phải đặt **do / does / did** ở đầu câu: **Do you like coffee?**",
    },
    exampleWrong: "You like coffee?",
    exampleRight: "Do you like coffee?",
    linkedRoomId: "english_a1_a105",
  },

  vi_l1_missing_article: {
    tag: "vi_l1_missing_article",
    shortLabel: {
      en: "Articles **a / an / the**",
      vi: "Mạo từ **a / an / the**",
    },
    longDescription: {
      en: "Vietnamese has no articles — nouns stand alone. English almost always needs **a**, **an**, or **the** before a singular countable noun.",
      vi: "Tiếng Việt mình không có mạo từ — danh từ đứng một mình là được. Tiếng Anh gần như luôn cần **a**, **an**, hoặc **the** trước danh từ đếm được số ít.",
    },
    exampleWrong: "I have car.",
    exampleRight: "I have a car.",
    linkedRoomId: null,
  },

  vi_l1_possessive_gender: {
    tag: "vi_l1_possessive_gender",
    shortLabel: {
      en: "**His** vs **her**",
      vi: "**His** / **her**",
    },
    longDescription: {
      en: "Vietnamese possessive **của** doesn't mark gender. English picks **his** or **her** based on the **owner's** gender, not the object's.",
      vi: "Chữ **của** trong tiếng Việt không phân biệt giới tính. Tiếng Anh chọn **his** hoặc **her** theo giới tính của **người sở hữu**, không phải của đồ vật.",
    },
    exampleWrong: "My mother reads his book.",
    exampleRight: "My mother reads her book.",
    linkedRoomId: "english_a2_a208",
  },

  vi_l1_preposition_transfer: {
    tag: "vi_l1_preposition_transfer",
    shortLabel: {
      en: "Prepositions",
      vi: "Giới từ",
    },
    longDescription: {
      en: "Vietnamese prepositions don't map one-to-one onto English. Words like **on**, **in**, **at** have patterns you memorise, not translate: **on Monday**, **in June**, **at 7pm**.",
      vi: "Giới từ tiếng Việt không dịch thẳng sang tiếng Anh. Các từ **on**, **in**, **at** có quy tắc riêng cần nhớ, không dịch từng chữ được: **on Monday**, **in June**, **at 7pm**.",
    },
    exampleWrong: "I see you in Monday.",
    exampleRight: "I see you on Monday.",
    linkedRoomId: null,
  },

  vi_l1_countable: {
    tag: "vi_l1_countable",
    shortLabel: {
      en: "Countable / uncountable",
      vi: "Đếm được / không đếm được",
    },
    longDescription: {
      en: "Vietnamese doesn't split nouns into countable and uncountable — **nhiều tiền** and **nhiều bạn** both just use **nhiều**. English uses **many** for countable and **much** or **a lot of** for uncountable.",
      vi: "Tiếng Việt mình không chia danh từ đếm được / không đếm được — **nhiều tiền**, **nhiều bạn** đều dùng **nhiều**. Tiếng Anh dùng **many** với đếm được và **much** hoặc **a lot of** với không đếm được.",
    },
    exampleWrong: "I have many money.",
    exampleRight: "I have a lot of money.",
    linkedRoomId: null,
  },

  // ────────────────────────────────────────────────────────────────────────
  // L1 detector expansion (CC1 feat/l1-rules-expansion, 2026-04-24 round)
  // Placeholder tag names — refresh from CC1's constants on merge.
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_to_verb_confusion: {
    tag: "vi_l1_to_verb_confusion",
    shortLabel: {
      en: "When to use **to + verb**",
      vi: "Khi nào dùng **to + verb**",
    },
    longDescription: {
      en: "Vietnamese doesn't mark an infinitive. English uses **to + verb** after verbs like **want**, **need**, **plan** — but NOT after modals like **can** or **must**.",
      vi: "Tiếng Việt mình không có dạng động từ nguyên mẫu. Tiếng Anh dùng **to + verb** sau **want**, **need**, **plan**, nhưng KHÔNG dùng sau các modal như **can** hoặc **must**.",
    },
    exampleWrong: "I want go home.",
    exampleRight: "I want to go home.",
    linkedRoomId: "english_a1_a106",
  },

  vi_l1_can_no_infinitive: {
    tag: "vi_l1_can_no_infinitive",
    shortLabel: {
      en: "**Can / must** + plain verb",
      vi: "**Can / must** + động từ gốc",
    },
    longDescription: {
      en: "Vietnamese **có thể** / **phải** sits right before the verb with no extra word. English modals like **can** and **must** take the plain verb — no **to** in between.",
      vi: "Tiếng Việt mình chỉ cần **có thể** / **phải** rồi động từ. Tiếng Anh các modal như **can**, **must** đi với động từ gốc — không có **to** ở giữa.",
    },
    exampleWrong: "I can to swim.",
    exampleRight: "I can swim.",
    linkedRoomId: "english_a1_a106",
  },

  vi_l1_double_past: {
    tag: "vi_l1_double_past",
    shortLabel: {
      en: "One past marker, not two",
      vi: "Chỉ một dấu hiệu quá khứ",
    },
    longDescription: {
      en: "Vietnamese often stacks **đã** with a past time word. In English, once you use **did**, the main verb returns to its base form — only one past marker per verb.",
      vi: "Tiếng Việt mình hay ghép **đã** với cả trạng từ thời gian quá khứ. Tiếng Anh khi đã có **did**, động từ chính trở về dạng nguyên thể — chỉ một dấu hiệu quá khứ.",
    },
    exampleWrong: "I did worked late.",
    exampleRight: "I worked late.",
    linkedRoomId: "english_a2_a206",
  },

  vi_l1_possessive_s_missing: {
    tag: "vi_l1_possessive_s_missing",
    shortLabel: {
      en: "Possessive **'s**",
      vi: "Sở hữu với **'s**",
    },
    longDescription: {
      en: "Vietnamese puts **của** between two nouns — **sách của Lan**. English attaches **'s** to the owner instead: **Lan's book**.",
      vi: "Tiếng Việt mình đặt **của** giữa hai danh từ — **sách của Lan**. Tiếng Anh thêm **'s** vào người sở hữu: **Lan's book**.",
    },
    exampleWrong: "This is Lan book.",
    exampleRight: "This is Lan's book.",
    linkedRoomId: null,
  },

  vi_l1_comparative_double: {
    tag: "vi_l1_comparative_double",
    shortLabel: {
      en: "One comparative, not two",
      vi: "Chỉ một dấu hiệu so sánh",
    },
    longDescription: {
      en: "Vietnamese comfortably layers **hơn** with extra intensifiers. English picks ONE comparative form: **better** OR **more + adjective** — never **more better**.",
      vi: "Tiếng Việt mình dễ ghép **hơn** với nhiều từ nhấn mạnh. Tiếng Anh chọn MỘT dạng so sánh: **better** hoặc **more + tính từ** — không bao giờ **more better**.",
    },
    exampleWrong: "This is more better.",
    exampleRight: "This is better.",
    linkedRoomId: null,
  },

  vi_l1_adjective_order: {
    tag: "vi_l1_adjective_order",
    shortLabel: {
      en: "Adjective **before** noun",
      vi: "Tính từ đứng **trước** danh từ",
    },
    longDescription: {
      en: "Vietnamese places the adjective **after** the noun: **áo đỏ**. English flips it — adjective comes **before** the noun: **a red shirt**.",
      vi: "Tiếng Việt mình đặt tính từ **sau** danh từ: **áo đỏ**. Tiếng Anh đảo lại — tính từ đứng **trước** danh từ: **a red shirt**.",
    },
    exampleWrong: "I want a shirt red.",
    exampleRight: "I want a red shirt.",
    linkedRoomId: "english_a2_a203",
  },

  vi_l1_very_much_placement: {
    tag: "vi_l1_very_much_placement",
    shortLabel: {
      en: "**Very** vs **very much**",
      vi: "**Very** vs **very much**",
    },
    longDescription: {
      en: "Vietnamese **rất** sits right before the verb or adjective: **rất thích**. In English, **very** goes with adjectives (**very happy**) but with verbs you say **… very much** at the end.",
      vi: "Tiếng Việt **rất** đứng ngay trước động từ hay tính từ: **rất thích**. Tiếng Anh **very** dùng với tính từ (**very happy**), còn với động từ thì **… very much** ở cuối câu.",
    },
    exampleWrong: "I very like coffee.",
    exampleRight: "I like coffee very much.",
    linkedRoomId: null,
  },

  vi_l1_there_are_singular: {
    tag: "vi_l1_there_are_singular",
    shortLabel: {
      en: "**There is** vs **there are**",
      vi: "**There is** vs **there are**",
    },
    longDescription: {
      en: "Vietnamese **có** stays the same whether there's one thing or many. English switches: **there is** for one, **there are** for two or more.",
      vi: "Tiếng Việt mình dùng **có** cho cả một và nhiều. Tiếng Anh đổi: **there is** với một, **there are** với hai trở lên.",
    },
    exampleWrong: "There are one book on the table.",
    exampleRight: "There is one book on the table.",
    linkedRoomId: "english_a1_a109",
  },

  vi_l1_everyone_plural: {
    tag: "vi_l1_everyone_plural",
    shortLabel: {
      en: "**Everyone** is singular",
      vi: "**Everyone** là số ít",
    },
    longDescription: {
      en: "Vietnamese **mọi người** feels plural because it means many people. In English, **everyone** and **everybody** take a singular verb: **everyone is happy**.",
      vi: "Tiếng Việt mình **mọi người** nghe như số nhiều vì nói về nhiều người. Tiếng Anh **everyone** và **everybody** đi với động từ số ít: **everyone is happy**.",
    },
    exampleWrong: "Everyone are happy.",
    exampleRight: "Everyone is happy.",
    linkedRoomId: "english_a1_a103",
  },

  vi_l1_make_vs_do: {
    tag: "vi_l1_make_vs_do",
    shortLabel: {
      en: "**Make** vs **do**",
      vi: "**Make** vs **do**",
    },
    longDescription: {
      en: "Vietnamese **làm** covers both English verbs. English splits the work: **make** for creating (a cake, a decision, a mistake); **do** for activities (homework, the dishes, a job).",
      vi: "Tiếng Việt mình chỉ có một chữ **làm**. Tiếng Anh chia hai: **make** khi tạo ra (bánh, quyết định, sai lầm); **do** với hoạt động (bài tập, rửa bát, công việc).",
    },
    exampleWrong: "I did a mistake.",
    exampleRight: "I made a mistake.",
    linkedRoomId: null,
  },

  vi_l1_tag_question: {
    tag: "vi_l1_tag_question",
    shortLabel: {
      en: "Tag questions",
      vi: "Câu hỏi đuôi",
    },
    longDescription: {
      en: "Vietnamese uses one invariant tag — **phải không?**. English flips the auxiliary and polarity: a positive statement takes a negative tag — **You are Vietnamese, aren't you?**",
      vi: "Tiếng Việt mình chỉ cần **phải không?** là xong. Tiếng Anh đổi cả trợ động từ và thể (khẳng định ↔ phủ định): câu khẳng định dùng đuôi phủ định — **You are Vietnamese, aren't you?**",
    },
    exampleWrong: "You are Vietnamese, you are?",
    exampleRight: "You are Vietnamese, aren't you?",
    linkedRoomId: null,
  },
};

/** Ordered list of all tags (stable for tests + exhaustiveness checks). */
export const ALL_WEAKNESS_TAGS: readonly WeaknessTag[] = Object.freeze(
  Object.keys(WEAKNESS_CATALOG) as WeaknessTag[],
);

/**
 * Type-guard: narrows an arbitrary string to a known weakness tag.
 * Callers should filter unknown tags (from the detector or engine
 * emitting new tags before the catalog catches up) rather than crash.
 */
export function isKnownWeaknessTag(value: unknown): value is WeaknessTag {
  return typeof value === "string" && value in WEAKNESS_CATALOG;
}

/**
 * Look up an entry by tag string. Returns null for unknown tags so the
 * UI can skip rather than throw. Prefer this over direct record access
 * when the tag comes from an external source (DB, edge function).
 */
export function getWeaknessEntry(tag: string): WeaknessEntry | null {
  if (!isKnownWeaknessTag(tag)) return null;
  return WEAKNESS_CATALOG[tag];
}

/**
 * Map an array of raw tag strings (e.g. from profiles.placement_weaknesses
 * or mb_user_weakness_profile.key_pattern) to catalog entries. Preserves
 * input order, drops unknown tags, deduplicates by tag.
 */
export function resolveWeaknessTags(rawTags: readonly string[]): WeaknessEntry[] {
  const seen = new Set<string>();
  const out: WeaknessEntry[] = [];
  for (const raw of rawTags) {
    if (seen.has(raw)) continue;
    const entry = getWeaknessEntry(raw);
    if (entry) {
      out.push(entry);
      seen.add(raw);
    }
  }
  return out;
}
