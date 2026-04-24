/**
 * Vietnamese L1-interference error detector.
 *
 * When a Vietnamese learner makes an English error that follows a known
 * L1-transfer pattern, return bilingual feedback that explains WHY using
 * the Vietnamese-English contrast — not a generic "wrong answer" string.
 *
 * Pure regex + rule-based. Deterministic. No LLM. No network.
 * Perf budget: < 5 ms per detectL1Error() call.
 *
 * Architecture:
 *   - Each rule is a pure function (userTokens, expectedTokens, ctx) => RuleHit | null.
 *   - Rules run in a fixed priority order (RULE_REGISTRY below).
 *   - First match wins — we never show more than one L1 message to a learner,
 *     even if multiple patterns could technically apply.
 *   - If no rule matches, return {matched:false, ...} so the caller can fall
 *     back to existing generic grammar feedback (graceful degradation —
 *     L1 detector enhances, never removes).
 *
 * Feedback strings are approved native-speaker drafts locked in RULE_STRINGS.
 * Do NOT edit them casually — changes need Chau's review (he is the Vietnamese
 * native speaker and sets the teacher voice).
 *
 * Single-detection priority order (v1.1 adds rules 11–21):
 *   1. vi_l1_3rd_person_s         structural
 *   2. vi_l1_past_ed              structural
 *   3. vi_l1_plural_s             structural
 *   4. vi_l1_missing_be           structural
 *   5. vi_l1_question_no_aux      structural
 *   6. vi_l1_missing_article      usage
 *   --- 7. vi_l1_tense_shift_compound  DEFERRED (too high FP risk) ---
 *   8. vi_l1_possessive_gender    usage
 *   9. vi_l1_preposition_transfer vocab
 *  10. vi_l1_countable            vocab
 *  11. vi_l1_to_verb_confusion    structural (v1.1)
 *  12. vi_l1_can_no_infinitive    structural (v1.1)
 *  13. vi_l1_double_past          structural (v1.1)
 *  14. vi_l1_possessive_s_missing usage      (v1.1)
 *  15. vi_l1_comparative_double   morphology (v1.1)
 *  16. vi_l1_adjective_order      structural (v1.1)
 *  17. vi_l1_very_much_placement  word-order (v1.1)
 *  18. vi_l1_there_are_singular   agreement  (v1.1)
 *  19. vi_l1_everyone_plural      agreement  (v1.1)
 *  20. vi_l1_make_vs_do           collocation(v1.1)
 *  21. vi_l1_tag_question         style      (v1.1)
 *  22. vi_l1_past_perfect_missing structural (v1.2)
 *  23. vi_l1_reported_speech      structural (v1.2)
 *  24. vi_l1_since_vs_for         usage      (v1.2)
 *  25. vi_l1_countable_much       agreement  (v1.2)
 *  26. vi_l1_some_vs_any          usage      (v1.2)
 *  27. vi_l1_reflexive_missing    usage      (v1.2)
 *  28. vi_l1_conditional_mix      structural (v1.2)
 *  29. vi_l1_to_infinitive_after_ing structural (v1.2)
 *  30. vi_l1_passive_missing_be   structural (v1.2)
 *  31. vi_l1_relative_pronoun     usage      (v1.2)
 *  32. vi_l1_used_to_vs_be_used_to usage     (v1.2)
 *  33. vi_l1_another_vs_other     usage      (v1.2)
 *  34. vi_l1_look_vs_see_vs_watch collocation(v1.2)
 *  35. vi_l1_by_vs_with           usage      (v1.2)
 *  36. vi_l1_time_expressions     usage      (v1.2)
 *
 *  Round 5 additions — rules 37–61 (25 new). Public IDs L1-036..L1-060
 *  are published in shared/l1-rule-ids-round5.md (coordination contract
 *  with CC1/CC2/CC4/CC5). All 25 are pattern-match only, low-FP bias.
 *
 *  37. vi_l1_present_perfect_vs_past  aspect       B1
 *  38. vi_l1_subjunctive_were         structural   B2
 *  39. vi_l1_embedded_question_order  word-order   B1
 *  40. vi_l1_do_support_3ps           agreement    A2
 *  41. vi_l1_subject_relative_omit    structural   B1
 *  42. vi_l1_gerund_after_verb        structural   B1
 *  43. vi_l1_modal_perfect            structural   B2
 *  44. vi_l1_phrasal_pronoun_order    word-order   B1
 *  45. vi_l1_comparative_more_long    morphology   A2
 *  46. vi_l1_many_with_uncount        agreement    A2
 *  47. vi_l1_geographical_article     usage        B1
 *  48. vi_l1_generic_plural           usage        A2
 *  49. vi_l1_double_negative          structural   A2
 *  50. vi_l1_negative_inversion       word-order   C1
 *  51. vi_l1_adverb_before_subject    word-order   A2
 *  52. vi_l1_make_let_bare            structural   B1
 *  53. vi_l1_too_vs_very              usage        A2
 *  54. vi_l1_a_vs_an_vowel            morphology   A1
 *  55. vi_l1_one_of_the_singular      agreement    B1
 *  56. vi_l1_each_singular            agreement    B1
 *  57. vi_l1_been_vs_gone             usage        B2
 *  58. vi_l1_tag_polarity             structural   B1
 *  59. vi_l1_no_article_generic       usage        A2
 *  60. vi_l1_superlative_the          usage        A2
 *  61. vi_l1_if_will                  structural   B1
 */

export type L1WeaknessTag =
  | 'vi_l1_3rd_person_s'
  | 'vi_l1_past_ed'
  | 'vi_l1_plural_s'
  | 'vi_l1_missing_be'
  | 'vi_l1_question_no_aux'
  | 'vi_l1_missing_article'
  | 'vi_l1_possessive_gender'
  | 'vi_l1_preposition_transfer'
  | 'vi_l1_countable'
  | 'vi_l1_to_verb_confusion'
  | 'vi_l1_can_no_infinitive'
  | 'vi_l1_double_past'
  | 'vi_l1_possessive_s_missing'
  | 'vi_l1_comparative_double'
  | 'vi_l1_adjective_order'
  | 'vi_l1_very_much_placement'
  | 'vi_l1_there_are_singular'
  | 'vi_l1_everyone_plural'
  | 'vi_l1_make_vs_do'
  | 'vi_l1_tag_question'
  // v1.2 — harder / less-common patterns
  | 'vi_l1_past_perfect_missing'
  | 'vi_l1_reported_speech'
  | 'vi_l1_since_vs_for'
  | 'vi_l1_countable_much'
  | 'vi_l1_some_vs_any'
  | 'vi_l1_reflexive_missing'
  | 'vi_l1_conditional_mix'
  | 'vi_l1_to_infinitive_after_ing'
  | 'vi_l1_passive_missing_be'
  | 'vi_l1_relative_pronoun'
  | 'vi_l1_used_to_vs_be_used_to'
  | 'vi_l1_another_vs_other'
  | 'vi_l1_look_vs_see_vs_watch'
  | 'vi_l1_by_vs_with'
  | 'vi_l1_time_expressions'
  // Round 5 — CC3 25-rule expansion (public IDs L1-036..L1-060)
  | 'vi_l1_present_perfect_vs_past'   // L1-036 B1
  | 'vi_l1_subjunctive_were'          // L1-037 B2
  | 'vi_l1_embedded_question_order'   // L1-038 B1
  | 'vi_l1_do_support_3ps'            // L1-039 A2
  | 'vi_l1_subject_relative_omit'     // L1-040 B1
  | 'vi_l1_gerund_after_verb'         // L1-041 B1
  | 'vi_l1_modal_perfect'             // L1-042 B2
  | 'vi_l1_phrasal_pronoun_order'     // L1-043 B1
  | 'vi_l1_comparative_more_long'     // L1-044 A2
  | 'vi_l1_many_with_uncount'         // L1-045 A2
  | 'vi_l1_geographical_article'      // L1-046 B1
  | 'vi_l1_generic_plural'            // L1-047 A2
  | 'vi_l1_double_negative'           // L1-048 A2
  | 'vi_l1_negative_inversion'        // L1-049 C1
  | 'vi_l1_adverb_before_subject'     // L1-050 A2
  | 'vi_l1_make_let_bare'             // L1-051 B1
  | 'vi_l1_too_vs_very'               // L1-052 A2
  | 'vi_l1_a_vs_an_vowel'             // L1-053 A1
  | 'vi_l1_one_of_the_singular'       // L1-054 B1
  | 'vi_l1_each_singular'             // L1-055 B1
  | 'vi_l1_been_vs_gone'              // L1-056 B2
  | 'vi_l1_tag_polarity'              // L1-057 B1
  | 'vi_l1_no_article_generic'        // L1-058 A2
  | 'vi_l1_superlative_the'           // L1-059 A2
  | 'vi_l1_if_will';                  // L1-060 B1

export type L1FeedbackText = {
  en: string;
  vi: string;
};

export type L1DetectionInput = {
  userAnswer: string;
  expectedAnswer: string;
  questionContext?: {
    subjectGender?: 'male' | 'female' | null;
    timeframe?: 'past' | 'present' | 'future' | null;
    isQuestion?: boolean;
  };
};

export type L1DetectionResult =
  | { matched: true; weaknessTag: L1WeaknessTag; feedback: L1FeedbackText }
  | { matched: false; weaknessTag: null; feedback: null };

// ────────────────────────────────────────────────────────────────────────────
// Feedback string registry — approved by Chau (native Vietnamese speaker)
// ────────────────────────────────────────────────────────────────────────────

type StringTemplate = {
  en: string;
  vi: string;
};

const RULE_STRINGS: Record<L1WeaknessTag, StringTemplate> = {
  vi_l1_3rd_person_s: {
    en: 'In English, verbs change after **she**, **he**, or **it** — we add **-s**. Vietnamese keeps the verb the same. Try: *{FIX}*.',
    vi: 'Trong tiếng Anh, động từ đi với **she / he / it** phải thêm **-s**. Tiếng Việt mình không có quy tắc này. Thử: *{FIX}*.',
  },
  vi_l1_past_ed: {
    en: 'When you use a past-time word like **yesterday** or **last week**, English also changes the verb — add **-ed**. Vietnamese leaves the verb alone. *work* → *worked*. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình chỉ cần nói **hôm qua** là đủ. Tiếng Anh còn phải thêm **-ed** vào động từ. *work* → *worked*. Thử: *{FIX}*.',
  },
  vi_l1_plural_s: {
    en: 'English marks plurals on the noun itself — add **-s**. In tư duy Việt, \'hai quyển sách\' lets the number do the work, so the noun stays the same. English needs both. Try: *{FIX}*.',
    vi: 'Trong tư duy Việt, \'hai quyển sách\' là đủ — danh từ không đổi. Tiếng Anh phải thêm **-s** vào chính danh từ. Thử: *{FIX}*.',
  },
  vi_l1_missing_be: {
    en: "Vietnamese says 'tôi mệt' — adjective alone is fine. English needs a **be**-verb: **am / is / are**. Try: *{FIX}*.",
    vi: "Tiếng Việt mình nói 'tôi mệt' là xong. Tiếng Anh cần thêm **am / is / are** giữa chủ ngữ và tính từ. Thử: *{FIX}*.",
  },
  vi_l1_question_no_aux: {
    en: 'Vietnamese makes a question by adding **không** at the end. English moves a helper verb — **do**, **does**, or **did** — to the front. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình thêm **không** cuối câu là thành câu hỏi. Tiếng Anh phải đưa **do / does / did** lên đầu. Thử: *{FIX}*.',
  },
  vi_l1_missing_article: {
    en: 'Vietnamese has no articles. English usually needs **a**, **an**, or **the** before a noun. Example: **the book** (a specific one), **a book** (any one). Try: *{FIX}*.',
    vi: 'Tiếng Việt mình không có mạo từ. Tiếng Anh thường cần **a / an / the** trước danh từ. Ví dụ: **the book** (cuốn sách đó), **a book** (một cuốn sách). Thử: *{FIX}*.',
  },
  vi_l1_possessive_gender: {
    en: 'Vietnamese uses **của anh ấy** or **của cô ấy** — same structure regardless of the owner. English changes the possessive word itself: **his** for a man, **her** for a woman. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình dùng **của anh ấy** hoặc **của cô ấy** — cấu trúc giống nhau. Tiếng Anh đổi từ sở hữu theo giới tính: **his** cho nam, **her** cho nữ. Thử: *{FIX}*.',
  },
  vi_l1_preposition_transfer: {
    en: "English prepositions don't translate one-to-one from Vietnamese. Here, swap **{USER_PREP}** for **{FIX_PREP}**. Try: *{FIX}*.",
    vi: 'Mỗi giới từ tiếng Anh có cách dùng riêng, không dịch trực tiếp từ tiếng Việt được. Chỗ này đổi **{USER_PREP}** thành **{FIX_PREP}**. Thử: *{FIX}*.',
  },
  vi_l1_countable: {
    en: "In English some nouns don't count — **advice**, **information**, **furniture**, **news**. No **a / an** and no plural **-s**. Vietnamese counts them normally. Try: *{FIX}*.",
    vi: 'Tiếng Anh có những danh từ không đếm được — **advice**, **information**, **furniture**, **news**. Không dùng **a / an**, không thêm **-s**. Tiếng Việt mình đếm bình thường. Thử: *{FIX}*.',
  },

  // ── v1.1 rules ─────────────────────────────────────────────────────────

  vi_l1_to_verb_confusion: {
    en: "After verbs like **want**, **need**, **try**, **hope**, English inserts **to** before the next verb. Tiếng Việt mình nói 'tôi muốn đi' — một mạch. English takes the extra step. Try: *{FIX}*.",
    vi: "Sau các động từ như **want / need / try / hope**, tiếng Anh cần **to** trước động từ tiếp theo. Tiếng Việt mình nói 'tôi muốn đi' thẳng một mạch — tiếng Anh cần thêm bước. Thử: *{FIX}*.",
  },
  vi_l1_can_no_infinitive: {
    en: 'After a modal — **can**, **could**, **will**, **should** — English keeps the next verb in its bare form. No **-s**, no **-ed**, no **-ing**. Vietnamese keeps verbs unchanged too, so let the modal carry the meaning. Try: *{FIX}*.',
    vi: 'Sau trợ động từ **can / could / will / should**, tiếng Anh giữ động từ ở dạng gốc — không thêm **-s**, **-ed**, **-ing**. Tiếng Việt mình cũng để động từ nguyên. Thử: *{FIX}*.',
  },
  vi_l1_double_past: {
    en: "English marks past tense **once**. If you already said **did** or **didn't**, the main verb stays bare. *I didn't went* → *I didn't go*. Try: *{FIX}*.",
    vi: "Tiếng Anh chỉ đánh dấu quá khứ **một lần**. **did / didn't** đã là quá khứ rồi, nên động từ chính giữ nguyên dạng gốc. *I didn't went* → *I didn't go*. Thử: *{FIX}*.",
  },
  vi_l1_possessive_s_missing: {
    en: "Vietnamese says 'nhà của mẹ' or just 'nhà mẹ' — two nouns can touch. English puts **'s** between them: *my mother's house*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình nói 'nhà của mẹ' hoặc 'nhà mẹ' — hai danh từ ghép được. Tiếng Anh thêm **'s** vào giữa: *my mother's house*. Thử: *{FIX}*.",
  },
  vi_l1_comparative_double: {
    en: 'Use **more** OR the **-er** ending — never both. *more better* → *better*. *more faster* → *faster*. Try: *{FIX}*.',
    vi: 'Tiếng Anh dùng **more** HOẶC đuôi **-er**, không dùng cả hai cùng lúc. *more better* → *better*. *more faster* → *faster*. Thử: *{FIX}*.',
  },
  vi_l1_adjective_order: {
    en: "In English, adjectives come **before** the noun — *red car*, not *car red*. Tiếng Việt mình đặt tính từ sau danh từ ('xe đỏ'); English flips the order. Try: *{FIX}*.",
    vi: "Trong tiếng Anh, tính từ đứng **trước** danh từ — *red car*, không phải *car red*. Tiếng Việt mình đặt tính từ sau ('xe đỏ'), tiếng Anh đảo ngược lại. Thử: *{FIX}*.",
  },
  vi_l1_very_much_placement: {
    en: 'In English, **very much** usually comes after the verb or object, not before it. *I very much like it* → *I like it very much*. Try: *{FIX}*.',
    vi: 'Trong tiếng Anh, **very much** thường đứng sau động từ hoặc tân ngữ, không đứng trước. *I very much like it* → *I like it very much*. Thử: *{FIX}*.',
  },
  vi_l1_there_are_singular: {
    en: '**There is** goes with singular — *a book*, *an apple*, *one cat*. **There are** is only for plural. Try: *{FIX}*.',
    vi: '**There is** đi với số ít — *a book*, *an apple*, *one cat*. **There are** chỉ dùng cho số nhiều. Thử: *{FIX}*.',
  },
  vi_l1_everyone_plural: {
    en: "Words like **everyone**, **someone**, **nobody** look plural but take a **singular** verb in English — *everyone **is** here*, not *are*. Try: *{FIX}*.",
    vi: "Các từ **everyone / someone / nobody** nghe như số nhiều nhưng tiếng Anh đi với động từ **số ít** — *everyone **is** here*, không phải *are*. Thử: *{FIX}*.",
  },
  vi_l1_make_vs_do: {
    en: "**Make** and **do** both translate to **làm** in Vietnamese, but English picks one based on the noun. Here, **{WRONG}** should be **{RIGHT}**. Try: *{FIX}*.",
    vi: "**Make** và **do** đều dịch là **làm** trong tiếng Việt, nhưng tiếng Anh chọn từ nào tùy danh từ đi kèm. Chỗ này **{WRONG}** → **{RIGHT}**. Thử: *{FIX}*.",
  },
  vi_l1_tag_question: {
    en: "Vietnamese tags a question with 'không?' at the end. English builds a **tag question** that mirrors the main verb: *you like coffee, **don't you**?* Try: *{FIX}*.",
    vi: "Tiếng Việt mình thêm 'không?' cuối câu để hỏi lại. Tiếng Anh dùng **tag question** khớp với động từ chính: *you like coffee, **don't you**?* Thử: *{FIX}*.",
  },

  // ── v1.2 strings ─────────────────────────────────────────────────────

  vi_l1_past_perfect_missing: {
    en: "Vietnamese often uses **đã** or **trước đó** to mark past. English uses **had + past participle** when one past action happened before another. *When she called, I already ate* → *When she called, I **had** already eaten*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay dùng **đã** hoặc **trước đó**. Tiếng Anh dùng **had + V3** khi một việc xảy ra trước một việc khác trong quá khứ. *When she called, I already ate* → *… I **had** already eaten*. Thử: *{FIX}*.",
  },
  vi_l1_reported_speech: {
    en: "Vietnamese often keeps the original tense or uses **nói rằng**. English **backshifts** the tense after a past reporting verb. *She said she **is** tired* → *She said she **was** tired*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay giữ nguyên thì hoặc dùng **nói rằng**. Tiếng Anh phải **lùi thì** sau động từ tường thuật ở quá khứ. *She said she **was** tired*. Thử: *{FIX}*.",
  },
  vi_l1_since_vs_for: {
    en: "Vietnamese **từ** covers both a starting point and a length of time. English splits them: **since** + point in time, **for** + length of time. Swap **{USER_WORD}** → **{FIX_WORD}**. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **từ** cho cả mốc thời gian lẫn khoảng thời gian. Tiếng Anh tách rõ: **since** + mốc, **for** + độ dài. Đổi **{USER_WORD}** → **{FIX_WORD}**. Thử: *{FIX}*.",
  },
  vi_l1_countable_much: {
    en: "Vietnamese **nhiều** works with everything. English **much** is only for uncountable nouns; use **many** or **a lot of** for countable plurals. *much books* → *many books*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **nhiều** với mọi danh từ. Tiếng Anh **much** chỉ đi với danh từ không đếm được; danh từ đếm được dùng **many** hoặc **a lot of**. *much books* → *many books*. Thử: *{FIX}*.",
  },
  vi_l1_some_vs_any: {
    en: "Vietnamese **một số / chút** works in both positive and negative sentences. English has a clearer rule: **some** in positives, **any** in negatives and questions. *I don't have **some** money* → *I don't have **any** money*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **một số / chút** cho cả khẳng định lẫn phủ định. Tiếng Anh có quy tắc rõ: **some** trong khẳng định, **any** trong phủ định và câu hỏi. *I don't have **some** money* → *I don't have **any** money*. Thử: *{FIX}*.",
  },
  vi_l1_reflexive_missing: {
    en: "Vietnamese often omits the reflexive. English needs **myself / yourself / himself …** when the subject acts on itself. *I hurt me* → *I hurt **myself***. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay bỏ qua. Tiếng Anh cần **myself / yourself / himself …** khi chủ ngữ và tân ngữ là một. *I hurt me* → *I hurt **myself***. Thử: *{FIX}*.",
  },
  vi_l1_conditional_mix: {
    en: "Vietnamese conditionals are flexible. English has strict forms — never use **will** inside the **if**-clause. *If I **will** have time* → *If I **have** time, I will come*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng câu điều kiện linh hoạt. Tiếng Anh có quy tắc rõ: **không** dùng **will** trong mệnh đề **if**. *If I **will** have time* → *If I **have** time*. Thử: *{FIX}*.",
  },
  vi_l1_to_infinitive_after_ing: {
    en: "Some English verbs are followed by **to + infinitive** (*decide to go*, *want to learn*). Vietnamese uses a simpler structure. *I want **going*** → *I want **to go***. Try: *{FIX}*.",
    vi: "Một số động từ tiếng Anh theo sau bởi **to + động từ nguyên mẫu** (*decide to go*, *want to learn*). Tiếng Việt mình dùng cấu trúc đơn giản hơn. *I want **going*** → *I want **to go***. Thử: *{FIX}*.",
  },
  vi_l1_passive_missing_be: {
    en: "Vietnamese passive uses **bị / được**. English passive always needs **be + past participle**. *This house built in 1990* → *This house **was built** in 1990*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay dùng **bị / được**. Tiếng Anh thể bị động luôn cần **be + V3**. *This house built in 1990* → *This house **was built** in 1990*. Thử: *{FIX}*.",
  },
  vi_l1_relative_pronoun: {
    en: "Vietnamese uses one word **mà** for both. English splits: **who** for people, **which / that** for things. *The man **which** came* → *The man **who** came*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình nối ý bằng một từ **mà** cho cả người lẫn vật. Tiếng Anh phân biệt: **who** cho người, **which / that** cho vật. *The man **which** came* → *The man **who** came*. Thử: *{FIX}*.",
  },
  vi_l1_used_to_vs_be_used_to: {
    en: "Vietnamese **thường** covers both 'past habit' and 'accustomed to'. English separates them: **used to + bare verb** = past habit; **be used to + -ing / noun** = accustomed. *I am used to smoke* → *I **used to** smoke*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **thường** cho cả 'thói quen cũ' và 'đã quen với'. Tiếng Anh tách rõ: **used to + V** (thói quen quá khứ) và **be used to + V-ing / danh từ** (đã quen). *I am used to smoke* → *I **used to** smoke*. Thử: *{FIX}*.",
  },
  vi_l1_another_vs_other: {
    en: "Vietnamese **khác** is used broadly. English: **another** = one more (singular), **other** = the rest / additional. *I need **other** pen* → *I need **another** pen*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **khác** khá linh hoạt. Tiếng Anh phân biệt: **another** (một cái nữa, số ít), **other** (còn lại / khác). *I need **other** pen* → *I need **another** pen*. Thử: *{FIX}*.",
  },
  vi_l1_look_vs_see_vs_watch: {
    en: "Vietnamese **nhìn** covers many situations. English has three different verbs: **look at** (direct attention), **see** (perceive), **watch** (follow movement). Here **{WRONG}** → **{RIGHT}**. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **nhìn** cho nhiều tình huống. Tiếng Anh có ba động từ riêng biệt: **look at** (hướng mắt tới), **see** (trông thấy), **watch** (theo dõi chuyển động). Chỗ này **{WRONG}** → **{RIGHT}**. Thử: *{FIX}*.",
  },
  vi_l1_by_vs_with: {
    en: "Vietnamese **bằng** works for both. English splits: **by** = method / agent (*by car*, *written **by** Chau*), **with** = tool / accompaniment (*written **with** a pen*). *{WRONG}* → *{RIGHT}*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay dùng **bằng** cho cả hai. Tiếng Anh phân biệt rõ: **by** (phương tiện / tác nhân), **with** (công cụ / đi cùng). *{WRONG}* → *{RIGHT}*. Thử: *{FIX}*.",
  },
  vi_l1_time_expressions: {
    en: "Vietnamese time expressions are simpler. English picks the preposition by category: **in** the morning, **on** Monday, **at** 7 o'clock. *{USER_PREP}* → *{FIX_PREP}*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình đơn giản hơn. Tiếng Anh có quy tắc rõ: **in** buổi sáng, **on** thứ Hai, **at** 7 giờ. *{USER_PREP}* → *{FIX_PREP}*. Thử: *{FIX}*.",
  },

  // ── Round 5 additions (L1-036..L1-060) ────────────────────────────────
  // EN strings are CC3 placeholders. CC4 will author the VN strings
  // for all 25 in a separate PR; the VN string here is a minimal
  // stub (English key + [VI TBD]) so the type contract holds and
  // tests can assert a non-empty VN string length.
  vi_l1_present_perfect_vs_past: {
    en: "When you point to a specific past time — **yesterday**, **last week**, **in 1990** — English uses simple past, not present perfect. *I have eaten it yesterday* → *I ate it yesterday*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Dùng quá khứ đơn với mốc thời gian cụ thể. Thử: *{FIX}*.",
  },
  vi_l1_subjunctive_were: {
    en: "After **if** or **wish**, use **were** for every subject when you're imagining something not real. *If I was you* → *If I **were** you*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Sau **if / wish** ở tình huống giả định, dùng **were** cho mọi chủ ngữ. Thử: *{FIX}*.",
  },
  vi_l1_embedded_question_order: {
    en: "Once a question sits inside another sentence, English drops the question word order. *I don't know what **is this*** → *I don't know what **this is***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Câu hỏi lồng trong câu khác không giữ trật tự câu hỏi. Thử: *{FIX}*.",
  },
  vi_l1_do_support_3ps: {
    en: "After **he**, **she**, or **it**, the helper is **doesn't** — not **don't**. The **-s** already lives on the helper, so the main verb stays bare. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Với **he / she / it** phải dùng **doesn't**, không phải **don't**. Thử: *{FIX}*.",
  },
  vi_l1_subject_relative_omit: {
    en: "English can't drop the **subject** relative pronoun. *The man came yesterday is my uncle* → *The man **who** came yesterday is my uncle*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Không thể bỏ đại từ quan hệ làm chủ ngữ. Thử: *{FIX}*.",
  },
  vi_l1_gerund_after_verb: {
    en: "After **enjoy / avoid / finish / keep / mind / suggest / practise**, English wants **-ing**, not **to + V**. *I enjoy **to swim*** → *I enjoy **swimming***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Sau enjoy/avoid/finish/keep/mind, dùng V-ing thay vì to V. Thử: *{FIX}*.",
  },
  vi_l1_modal_perfect: {
    en: "To talk about the past with a modal, English uses **modal + have + past participle** — not modal + past verb. *I should **did** it* → *I should **have done** it*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Modal quá khứ dùng **modal + have + V3**. Thử: *{FIX}*.",
  },
  vi_l1_phrasal_pronoun_order: {
    en: "When the object of a separable phrasal verb is a pronoun, it goes **between** the verb and the particle. *I picked up **him*** → *I picked **him** up*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Với phrasal verb tách được, đại từ chen vào giữa. Thử: *{FIX}*.",
  },
  vi_l1_comparative_more_long: {
    en: "Two-or-more-syllable adjectives take **more** — not an **-er** ending. *more beautifuler* / *beautifuler* → **more beautiful**. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Tính từ dài 2+ âm tiết dùng **more**, không thêm **-er**. Thử: *{FIX}*.",
  },
  vi_l1_many_with_uncount: {
    en: "Use **much** (not **many**) with uncountable nouns — **water**, **money**, **advice**, **music**. *many water* → **much water**. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Dùng **much** với danh từ không đếm được. Thử: *{FIX}*.",
  },
  vi_l1_geographical_article: {
    en: "Most country names take **no article**, but a few plural-sounding ones do — **the Philippines**, **the USA**, **the Netherlands**. *the Vietnam* → *Vietnam*; *Philippines* → *the Philippines*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Hầu hết tên quốc gia không có **the**; vài nước ngoại lệ (the Philippines, the USA...). Thử: *{FIX}*.",
  },
  vi_l1_generic_plural: {
    en: "To talk about something in general, English uses the **plural** without **the**. *I like dog* → *I like **dogs***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Nói khái quát trong tiếng Anh dùng số nhiều không **the**. Thử: *{FIX}*.",
  },
  vi_l1_double_negative: {
    en: "English uses only **one** negative in a clause. *I don't have **no** money* → *I don't have **any** money*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Tiếng Anh chỉ dùng một phủ định trong một mệnh đề. Thử: *{FIX}*.",
  },
  vi_l1_negative_inversion: {
    en: "When a negative word like **never**, **seldom**, **rarely** starts the sentence, English flips the subject and auxiliary. *Never I have seen it* → *Never **have I** seen it*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Khi câu mở đầu bằng **never / seldom / rarely**, đảo chủ ngữ và trợ động từ. Thử: *{FIX}*.",
  },
  vi_l1_adverb_before_subject: {
    en: "Frequency adverbs like **always**, **usually**, **sometimes** go **after** the subject, not before it. *Always I go* → *I **always** go*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Trạng từ tần suất đi sau chủ ngữ, không đứng trước. Thử: *{FIX}*.",
  },
  vi_l1_make_let_bare: {
    // NOTE FOR CC4: the causative "had + obj + bare verb" (e.g., "I had
    // my friend drive me") is rarer than make/let in the wild. Keep the
    // VN explanation focused on make / made / let. Per CC7 peer review.
    en: "After **make**, **let**, or **have** in this meaning, English uses the **bare verb** — no **to**. *She made me **to cry*** → *She made me **cry***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Sau **make / let / have** (sai khiến), dùng động từ nguyên mẫu không **to**. Thử: *{FIX}*.",
  },
  vi_l1_too_vs_very: {
    en: "**Too** means excessive (there's a problem). For a simple strong intensifier, use **very**. *I am **too** happy to see you* → *I am **very** happy to see you*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] **Too** nghĩa là quá mức (tiêu cực). Muốn nhấn mạnh tích cực, dùng **very**. Thử: *{FIX}*.",
  },
  vi_l1_a_vs_an_vowel: {
    en: "Use **a** before a consonant **sound**, **an** before a vowel **sound** — listen, don't just look. *a apple* → *an apple*; *an book* → *a book*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Dùng **a** trước phụ âm, **an** trước nguyên âm — theo âm thanh, không phải chữ. Thử: *{FIX}*.",
  },
  vi_l1_one_of_the_singular: {
    en: "After **one of the / my / her / their**, the noun is **plural** even though the whole phrase refers to one item. *one of the student* → *one of the **students***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Sau **one of the / my / ...** dùng danh từ số nhiều. Thử: *{FIX}*.",
  },
  vi_l1_each_singular: {
    en: "**Each** and **every** always take a **singular** noun and a **singular** verb. *Each **students are** happy* → *Each **student is** happy*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] **Each / every** đi với danh từ số ít và động từ số ít. Thử: *{FIX}*.",
  },
  vi_l1_been_vs_gone: {
    en: "**Gone to** = went there and hasn't come back. **Been to** = visited, came back. *He has **gone** to Paris three times* → *He has **been** to Paris three times*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] **gone to** = đi chưa về; **been to** = đã từng ghé qua. Thử: *{FIX}*.",
  },
  vi_l1_tag_polarity: {
    en: "Tag questions flip polarity: positive statement + negative tag, negative statement + positive tag. *You like it, **do you***? → *You like it, **don't you***? Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Câu hỏi đuôi đảo dấu: mệnh đề khẳng định + đuôi phủ định (và ngược lại). Thử: *{FIX}*.",
  },
  vi_l1_no_article_generic: {
    en: "Abstract nouns and generic plurals usually take **no** article in English. *The life is hard* → *Life is hard*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Danh từ trừu tượng nói chung không dùng **the**. Thử: *{FIX}*.",
  },
  vi_l1_superlative_the: {
    en: "Superlatives (**best**, **tallest**, **most beautiful**) almost always come with **the**. *She is best student* → *She is **the best** student*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Trước cấp cao nhất gần như luôn dùng **the**. Thử: *{FIX}*.",
  },
  vi_l1_if_will: {
    en: "In a 1st-conditional **if**-clause, English uses **present simple** — not **will**. *If I **will go** tomorrow, I will tell you* → *If I **go** tomorrow, I will tell you*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Mệnh đề **if** (điều kiện loại 1) dùng hiện tại đơn, không dùng **will**. Thử: *{FIX}*.",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Tokenization + tiny utilities
// ────────────────────────────────────────────────────────────────────────────

/**
 * Collapse common negation / auxiliary contractions into single-token forms
 * so downstream rules can treat "didn't", "doesn't", "isn't", etc. as one
 * unit instead of the apostrophe getting stripped into two tokens. Applied
 * once at entry; every rule sees the normalised text.
 *
 * Also handles curly apostrophes (’ vs ') because ASR output and copy-paste
 * from iOS tend to inject them silently.
 */
function normalizeContractions(s: string): string {
  return s
    .replace(/\bdidn[’']t\b/gi, 'didnt')
    .replace(/\bdoesn[’']t\b/gi, 'doesnt')
    .replace(/\bdon[’']t\b/gi, 'dont')
    .replace(/\bcan[’']t\b/gi, 'cant')
    .replace(/\bwon[’']t\b/gi, 'wont')
    .replace(/\bshouldn[’']t\b/gi, 'shouldnt')
    .replace(/\bwouldn[’']t\b/gi, 'wouldnt')
    .replace(/\bcouldn[’']t\b/gi, 'couldnt')
    .replace(/\bisn[’']t\b/gi, 'isnt')
    .replace(/\baren[’']t\b/gi, 'arent')
    .replace(/\bwasn[’']t\b/gi, 'wasnt')
    .replace(/\bweren[’']t\b/gi, 'werent')
    .replace(/\bhasn[’']t\b/gi, 'hasnt')
    .replace(/\bhaven[’']t\b/gi, 'havent')
    .replace(/\bhadn[’']t\b/gi, 'hadnt');
}

function tokenize(s: string): string[] {
  // Lowercase, keep trailing "?" so question detection works, strip other punctuation.
  return s
    .toLowerCase()
    .replace(/[.,;:!"'()[\]{}]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function stripTrailingQmark(tokens: string[]): string[] {
  if (tokens.length === 0) return tokens;
  const last = tokens[tokens.length - 1];
  if (last === '?' || last.endsWith('?')) {
    return [...tokens.slice(0, -1), last.replace(/\?+$/, '')].filter(Boolean);
  }
  return tokens;
}

function hasQuestionMark(s: string): boolean {
  return /\?\s*$/.test(s);
}

function fillTemplate(
  template: StringTemplate,
  replacements: Record<string, string>,
): L1FeedbackText {
  const apply = (s: string) =>
    Object.entries(replacements).reduce(
      (acc, [k, v]) => acc.split(`{${k}}`).join(v),
      s,
    );
  return { en: apply(template.en), vi: apply(template.vi) };
}

// ────────────────────────────────────────────────────────────────────────────
// Morphology helpers
// ────────────────────────────────────────────────────────────────────────────

const THIRD_PERSON_SUBJECTS = new Set(['she', 'he', 'it']);

/** Returns true if `plus` is a valid 3rd-person-s form of `base` (heuristic). */
function isThirdPersonSForm(base: string, plus: string): boolean {
  if (!base || !plus || base === plus) return false;
  if (plus === base + 's') return true;            // work → works
  if (plus === base + 'es') return true;           // go → goes, watch → watches
  if (base.endsWith('y') && plus === base.slice(0, -1) + 'ies') return true; // study → studies
  // Irregular "has" from "have"
  if (base === 'have' && plus === 'has') return true;
  // Irregular "does" / "goes" already covered by +es
  return false;
}

const PAST_TIME_MARKERS = new Set([
  'yesterday',
  'ago',
  'last',  // "last week/month/year/night/Monday..."
]);

/** True if tokens contain a past-time marker. Checks whole-word membership. */
function hasPastTimeMarker(tokens: string[]): boolean {
  return tokens.some((t) => PAST_TIME_MARKERS.has(t));
}

const IRREGULAR_PAST: Record<string, string> = {
  go: 'went',
  eat: 'ate',
  see: 'saw',
  come: 'came',
  take: 'took',
  give: 'gave',
  buy: 'bought',
  think: 'thought',
  say: 'said',
  tell: 'told',
  make: 'made',
  have: 'had',
  get: 'got',
  drink: 'drank',
  find: 'found',
  know: 'knew',
  run: 'ran',
  write: 'wrote',
  read: 'read',
};

/** True if `past` is a valid past-tense form of `base` (regular OR irregular). */
function isPastForm(base: string, past: string): boolean {
  if (!base || !past || base === past) return false;
  if (past === base + 'ed') return true;                                 // work → worked
  if (past === base + 'd') return true;                                  // live → lived
  if (base.endsWith('y') && past === base.slice(0, -1) + 'ied') return true; // try → tried
  if (IRREGULAR_PAST[base] === past) return true;
  return false;
}

const NUMBER_WORDS_GT1 = new Set([
  'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'many', 'several', 'few', 'some', 'both',
]);

function isPluralQuantifier(token: string): boolean {
  if (NUMBER_WORDS_GT1.has(token)) return true;
  // Numeric literal > 1
  const n = Number(token);
  if (Number.isFinite(n) && n >= 2) return true;
  return false;
}

/** True if `plural` is a valid plural form of `singular` (heuristic). */
function isPluralForm(singular: string, plural: string): boolean {
  if (!singular || !plural || singular === plural) return false;
  if (plural === singular + 's') return true;
  if (plural === singular + 'es') return true;
  if (singular.endsWith('y') && plural === singular.slice(0, -1) + 'ies') return true;
  // Irregular plurals — whitelist common ones
  const IRREGULAR_PLURAL: Record<string, string> = {
    child: 'children',
    man: 'men',
    woman: 'women',
    person: 'people',
    foot: 'feet',
    tooth: 'teeth',
    mouse: 'mice',
  };
  return IRREGULAR_PLURAL[singular] === plural;
}

const BE_VERBS = new Set(['am', 'is', 'are', 'was', 'were']);

const AUX_QUESTION_STARTERS = new Set([
  'do', 'does', 'did',
  'dont', 'doesnt', 'didnt',                            // normalised contractions
  'is', 'am', 'are', 'was', 'were',
  'isnt', 'arent', 'wasnt', 'werent',
  'can', 'could', 'will', 'would', 'should', 'shall', 'may', 'might', 'must',
  'cant', 'couldnt', 'wouldnt', 'shouldnt', 'wont',
  'have', 'has', 'had',
  'hasnt', 'havent', 'hadnt',
  'where', 'when', 'why', 'who', 'whom', 'whose', 'what', 'which', 'how',
]);

const ARTICLES = new Set(['a', 'an', 'the']);

const POSSESSIVE_GENDERED = new Set(['his', 'her']);

/**
 * Small curated table of Vietnamese L1 → English preposition mismatches.
 * Each pair is (wrong-choice learners often make, correct-choice).
 * Context-specific — these aren't universal swaps, but are high-frequency
 * errors in the Vietnamese → English transfer.
 */
const PREPOSITION_MISMATCHES: Array<{ wrong: string; right: string }> = [
  { wrong: 'in',     right: 'on' },        // "in Monday" → "on Monday"
  { wrong: 'on',     right: 'in' },        // "on Hanoi" → "in Hanoi"
  { wrong: 'at',     right: 'in' },        // "at Vietnam" → "in Vietnam"
  { wrong: 'in',     right: 'at' },        // "in school" → "at school"
  { wrong: 'listen', right: 'listen to' }, // "listen music" — treated specially
  { wrong: 'wait',   right: 'wait for' },
  { wrong: 'look',   right: 'look at' },
];

const UNCOUNTABLE_NOUNS = new Set([
  'advice',
  'information',
  'furniture',
  'news',
  'equipment',
  'homework',
  'luggage',
  'baggage',
  'research',
  'knowledge',
  'music',
  'money',
]);

// ── v1.1 data ───────────────────────────────────────────────────────────────

/** Verbs that take a bare infinitive marker `to` before the next verb. */
const TO_TRIGGER_VERBS = new Set([
  'want', 'need', 'try', 'decide', 'hope', 'plan', 'learn',
  'like', 'love', 'hate', 'start', 'begin', 'continue',
  'offer', 'refuse', 'forget', 'prefer', 'choose', 'agree',
  'manage', 'afford', 'promise', 'intend', 'expect',
]);

/**
 * True if `token` is any conjugation of a TO_TRIGGER_VERBS base
 * (she "wants" / "wanted" / "wanting" all count). Lets rule 11 stay on
 * bare forms while rule 29 picks up inflections too.
 */
function isTriggerVerbForm(token: string): boolean {
  if (TO_TRIGGER_VERBS.has(token)) return true;
  if (token.endsWith('s') && TO_TRIGGER_VERBS.has(token.slice(0, -1))) return true;
  if (token.endsWith('es') && TO_TRIGGER_VERBS.has(token.slice(0, -2))) return true;
  if (token.endsWith('ed')) {
    const strip2 = token.slice(0, -2);
    if (TO_TRIGGER_VERBS.has(strip2)) return true;
    // Consonant-doubled forms: "planned" → "plan", "preferred" → "prefer".
    if (
      strip2.length >= 2 &&
      strip2[strip2.length - 1] === strip2[strip2.length - 2] &&
      TO_TRIGGER_VERBS.has(strip2.slice(0, -1))
    ) {
      return true;
    }
  }
  if (token.endsWith('d') && TO_TRIGGER_VERBS.has(token.slice(0, -1))) return true;
  if (token.endsWith('ing')) {
    const stem = token.slice(0, -3);
    if (TO_TRIGGER_VERBS.has(stem)) return true;
    if (TO_TRIGGER_VERBS.has(stem + 'e')) return true; // hoping → hope
    // Consonant-doubled: "planning" → "plan", "beginning" → "begin"
    if (
      stem.length >= 2 &&
      stem[stem.length - 1] === stem[stem.length - 2] &&
      TO_TRIGGER_VERBS.has(stem.slice(0, -1))
    ) {
      return true;
    }
  }
  if (token.endsWith('ied')) {
    const stem = token.slice(0, -3) + 'y';
    if (TO_TRIGGER_VERBS.has(stem)) return true;
  }
  return false;
}

/** Modals after which the main verb must stay bare. */
const MODAL_VERBS = new Set([
  'can', 'could', 'will', 'would', 'should', 'shall',
  'may', 'might', 'must',
]);

/** do-support auxiliaries that mark tense / polarity — main verb must then stay bare. */
const DO_AUX_SET = new Set([
  'do', 'does', 'did',
  'dont', 'doesnt', 'didnt',
]);

/** Tight list of English adjectives we trust enough to flag order errors. */
const COMMON_ADJECTIVES = new Set([
  'red', 'blue', 'green', 'yellow', 'black', 'white', 'brown', 'pink', 'purple', 'orange',
  'big', 'small', 'tall', 'short', 'long', 'wide', 'narrow', 'thick', 'thin',
  'new', 'old', 'young', 'modern', 'ancient',
  'happy', 'sad', 'angry', 'tired', 'hungry',
  'beautiful', 'ugly', 'nice', 'pretty', 'cute',
  'good', 'bad', 'great', 'terrible',
  'hot', 'cold', 'warm', 'cool',
  'fast', 'slow', 'quiet', 'loud',
  'heavy', 'light', 'cheap', 'expensive',
]);

/** Matching tight-set of nouns for rule 16. Kept small to limit FPs. */
const COMMON_NOUNS = new Set([
  'car', 'house', 'book', 'dress', 'shirt', 'bag', 'phone', 'computer',
  'table', 'chair', 'flower', 'dog', 'cat', 'bird', 'pen', 'fish',
  'girl', 'boy', 'man', 'woman', 'baby', 'teacher', 'student', 'doctor',
  'city', 'room', 'tree', 'ball', 'cup', 'plate', 'window', 'door',
]);

/** Indefinite pronouns that look plural but take a singular verb. */
const INDEF_PRONOUNS = new Set([
  'everyone', 'everybody', 'someone', 'somebody',
  'anyone', 'anybody', 'nobody',
  'everything', 'something', 'anything', 'nothing',
]);

/** Irregular comparatives for rule 15 (double-comparative detection). */
const IRREGULAR_COMPARATIVES = new Set(['better', 'worse', 'further', 'farther', 'elder']);

/**
 * Make / do / have collocations that Vietnamese learners commonly confuse
 * because all three translate to `làm` (or near-variants). Each pair is
 * (wrong VERB choice, right VERB choice, REST of the phrase). The rule
 * walks the learner's text through every conjugation of the wrong verb
 * (make → made/makes/making, do → did/does/doing/done) so past-tense and
 * progressive mistakes get caught too.
 */
const MAKE_FORMS = ['make', 'made', 'makes', 'making'];
const DO_FORMS   = ['do', 'did', 'does', 'doing', 'done'];
const HAVE_FORMS = ['have', 'had', 'has', 'having'];

function verbForms(verb: 'make' | 'do' | 'have'): readonly string[] {
  if (verb === 'make') return MAKE_FORMS;
  if (verb === 'do') return DO_FORMS;
  return HAVE_FORMS;
}

const MAKE_DO_COLLOCATIONS: Array<{
  wrongVerb: 'make' | 'do' | 'have';
  rightVerb: 'make' | 'do' | 'have';
  rest: string;
}> = [
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'a mistake' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'mistake' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'homework' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'a homework' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'a decision' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'exercise' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'exercises' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'sport' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'sports' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'business' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'an effort' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'effort' },
  { wrongVerb: 'do',   rightVerb: 'make', rest: 'a plan' },
  { wrongVerb: 'make', rightVerb: 'do',   rest: 'research' },
  { wrongVerb: 'do',   rightVerb: 'have', rest: 'a party' },
];

// ── v1.2 data ───────────────────────────────────────────────────────────────

/**
 * Common irregular past participles — used by rules 22 and 30 to spot
 * "had + pp" and passive-voice "be + pp" constructions. Regular -ed
 * participles are handled separately (they need a `by` agent to confirm
 * passive intent, otherwise they could be adjectives like "tired").
 */
const IRREGULAR_PARTICIPLES = new Set([
  'been', 'gone', 'done', 'seen', 'left', 'taken', 'given', 'written',
  'spoken', 'eaten', 'drunk', 'sung', 'run', 'come', 'become', 'broken',
  'chosen', 'fallen', 'forgotten', 'known', 'met', 'paid', 'put', 'read',
  'said', 'sold', 'sent', 'set', 'shown', 'stood', 'thought', 'understood',
  'worn', 'won', 'got', 'gotten', 'found', 'made', 'had', 'kept',
  'felt', 'caught', 'brought', 'bought', 'taught', 'told',
  'slept', 'heard', 'held', 'led', 'lost', 'meant',
  // Additional common passive participles
  'stolen', 'built', 'torn', 'flown', 'blown', 'grown', 'drawn',
  'driven', 'ridden', 'hidden', 'beaten', 'lit', 'fed', 'bled',
  'spent', 'swept', 'swung', 'hit', 'burst', 'cut', 'shut', 'cost',
  'struck', 'arisen', 'awoken', 'forgiven', 'frozen',
]);

/**
 * Returns true when tokens[idx] genuinely looks like a past participle
 * *in a passive context* — either it's in the irregular set, or it's
 * an -ed form that has a `by` agent downstream (canonical passive).
 *
 * This is narrower than "ends with -ed" because many adjectives end
 * in -ed (tired, bored, excited) and we don't want rule 30 to fire on
 * them, nor rule 4's guard to over-skip.
 */
function looksLikePassiveParticiple(tokens: string[], idx: number): boolean {
  const word = tokens[idx];
  if (!word) return false;
  if (IRREGULAR_PARTICIPLES.has(word)) return true;
  if (word.endsWith('ed') && word.length > 3) {
    for (let j = idx + 1; j < tokens.length; j++) {
      if (tokens[j] === 'by') return true;
    }
  }
  return false;
}

/** Indicator words that strongly imply a past-perfect context (rule 22). */
const PAST_PERFECT_CONTEXT_WORDS = new Set([
  'when', 'before', 'after', 'already', 'just', 'by',
]);

/** Present-form verbs that shift back one tense when reported (rule 23). */
const REPORTED_SHIFT: Record<string, string[]> = {
  is:      ['was'],
  are:     ['were'],
  am:      ['was'],
  has:     ['had'],
  have:    ['had'],
  do:      ['did'],
  does:    ['did'],
  will:    ['would'],
  can:     ['could'],
  may:     ['might'],
};

/** Reflexive-requiring verbs (subject acts on itself). */
const REFLEXIVE_VERBS = new Set([
  'enjoy', 'enjoyed', 'enjoys', 'enjoying',
  'behave', 'behaved', 'behaves', 'behaving',
  'hurt', 'hurts', 'hurting',
  'introduce', 'introduced', 'introduces', 'introducing',
  'pride', 'prided', 'prides',
  'cut', 'cuts', 'cutting',
  'help', 'helps', 'helped', 'helping',
]);

const REFLEXIVE_PRONOUNS = new Set([
  'myself', 'yourself', 'himself', 'herself', 'itself',
  'ourselves', 'yourselves', 'themselves',
]);

/**
 * Look / see / watch collocation confusions. Each entry is
 * (wrongVerbPhrase, rightVerbPhrase, rest) so the rule can walk
 * verb conjugations at match time. `rest` is the object phrase.
 */
const LOOK_SEE_WATCH_COLLOCATIONS: Array<{
  wrongVerb: 'look' | 'see' | 'watch';
  rightVerb: 'look' | 'see' | 'watch' | 'look at';
  rest: string;
}> = [
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'tv' },
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'television' },
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'a movie' },
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'movies' },
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'the match' },
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'football' },
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'the game' },
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'a video' },
  { wrongVerb: 'watch', rightVerb: 'look at', rest: 'the picture' },
  { wrongVerb: 'watch', rightVerb: 'look at', rest: 'the photo' },
  { wrongVerb: 'watch', rightVerb: 'look at', rest: 'the scenery' },
  { wrongVerb: 'watch', rightVerb: 'see',     rest: 'the doctor' },
  { wrongVerb: 'look',  rightVerb: 'see',     rest: 'a doctor' },
  { wrongVerb: 'look',  rightVerb: 'watch',   rest: 'tv' },
  { wrongVerb: 'look',  rightVerb: 'watch',   rest: 'a movie' },
  { wrongVerb: 'look',  rightVerb: 'watch',   rest: 'movies' },
  { wrongVerb: 'see',   rightVerb: 'look at', rest: 'the map' },
  { wrongVerb: 'see',   rightVerb: 'look at', rest: 'this' },
  { wrongVerb: 'watch', rightVerb: 'see',     rest: 'the point' },
  { wrongVerb: 'see',   rightVerb: 'watch',   rest: 'the sunset' },
];

/** by / with transport + instrument swaps. */
const BY_WITH_MISMATCHES: Array<{ wrong: string; right: string }> = [
  { wrong: 'with car',   right: 'by car' },
  { wrong: 'with bus',   right: 'by bus' },
  { wrong: 'with train', right: 'by train' },
  { wrong: 'with plane', right: 'by plane' },
  { wrong: 'with bike',  right: 'by bike' },
  { wrong: 'by foot',    right: 'on foot' },
  { wrong: 'with foot',  right: 'on foot' },
  { wrong: 'by pen',     right: 'with a pen' },
  { wrong: 'by pencil',  right: 'with a pencil' },
  { wrong: 'by hand',    right: 'by hand' }, // correct; excluded below
];

/** Time-preposition mismatches beyond the weekday case rule 9 already handles. */
const TIME_PREP_MISMATCHES: Array<{ wrong: string; right: string }> = [
  { wrong: 'on 2020',  right: 'in 2020' },
  { wrong: 'on 2021',  right: 'in 2021' },
  { wrong: 'on 2022',  right: 'in 2022' },
  { wrong: 'on 2023',  right: 'in 2023' },
  { wrong: 'on 2024',  right: 'in 2024' },
  { wrong: 'on 2025',  right: 'in 2025' },
  { wrong: 'on 2026',  right: 'in 2026' },
  { wrong: 'at morning',   right: 'in the morning' },
  { wrong: 'at afternoon', right: 'in the afternoon' },
  { wrong: 'at evening',   right: 'in the evening' },
  { wrong: 'on night',     right: 'at night' },
  { wrong: 'in night',     right: 'at night' },
  { wrong: 'at weekend',   right: 'on the weekend' },
  { wrong: 'in weekend',   right: 'on the weekend' },
  { wrong: 'in monday',    right: 'on monday' },
  { wrong: 'in tuesday',   right: 'on tuesday' },
  { wrong: 'in wednesday', right: 'on wednesday' },
  { wrong: 'in thursday',  right: 'on thursday' },
  { wrong: 'in friday',    right: 'on friday' },
  { wrong: 'in saturday',  right: 'on saturday' },
  { wrong: 'in sunday',    right: 'on sunday' },
];

// ────────────────────────────────────────────────────────────────────────────
// Rule implementations (pure functions — no I/O, no side effects)
// ────────────────────────────────────────────────────────────────────────────

type RuleHit = {
  tag: L1WeaknessTag;
  replacements: Record<string, string>;
};

type Rule = (args: {
  userTokens: string[];
  expectedTokens: string[];
  /** Contraction-normalised user text (apostrophes stripped). */
  userText: string;
  /** Contraction-normalised expected text. */
  expectedText: string;
  /** ORIGINAL user input before normalisation — prefer for display. */
  rawUser: string;
  /** ORIGINAL expected answer before normalisation — use in FIX replacements. */
  rawExpected: string;
  ctx: NonNullable<L1DetectionInput['questionContext']>;
}) => RuleHit | null;

/** 1. Missing third-person -s. */
const ruleThirdPersonS: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 1; i < len; i++) {
    const prev = userTokens[i - 1];
    if (!THIRD_PERSON_SUBJECTS.has(prev)) continue;
    const userVerb = userTokens[i];
    const expectedVerb = expectedTokens[i];
    if (isThirdPersonSForm(userVerb, expectedVerb)) {
      return {
        tag: 'vi_l1_3rd_person_s',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 2. Missing past -ed when a past-time marker is present. */
const rulePastEd: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (!hasPastTimeMarker(userTokens) && !hasPastTimeMarker(expectedTokens)) {
    return null;
  }
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 0; i < len; i++) {
    if (isPastForm(userTokens[i], expectedTokens[i])) {
      return { tag: 'vi_l1_past_ed', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 3. Plural -s missing after a plural quantifier. */
const rulePluralS: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 1; i < len; i++) {
    const prev = userTokens[i - 1];
    if (!isPluralQuantifier(prev)) continue;
    if (isPluralForm(userTokens[i], expectedTokens[i])) {
      return { tag: 'vi_l1_plural_s', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 4. Missing be-verb between subject and adjective/NP. */
const ruleMissingBe: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (expectedTokens.length !== userTokens.length + 1) return null;

  for (let i = 0; i < expectedTokens.length; i++) {
    if (!BE_VERBS.has(expectedTokens[i])) continue;

    // Guard: defer to rule 30 (passive_missing_be) when the token AFTER the
    // be-verb is a REAL past participle (irregular set, or -ed with a
    // downstream `by` agent). Bare -ed adjectives like "tired" / "bored"
    // stay here in rule 4.
    if (looksLikePassiveParticiple(expectedTokens, i + 1)) continue;
    // Guard: defer to rule 32 (used_to_vs_be_used_to) when we're inside the
    // "be used to …" construction (accustomed meaning).
    const next = expectedTokens[i + 1];
    if (next === 'used' && expectedTokens[i + 2] === 'to') continue;

    const withoutBe = expectedTokens.slice(0, i).concat(expectedTokens.slice(i + 1));
    if (
      withoutBe.length === userTokens.length &&
      withoutBe.every((t, j) => t === userTokens[j])
    ) {
      return { tag: 'vi_l1_missing_be', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 5. Question formed without fronted auxiliary. */
const ruleQuestionNoAux: Rule = ({ userText, rawExpected, userTokens, expectedTokens, ctx }) => {
  const isQuestion = ctx.isQuestion === true || hasQuestionMark(userText);
  if (!isQuestion) return null;

  const firstUser = stripTrailingQmark(userTokens)[0];
  const firstExpected = stripTrailingQmark(expectedTokens)[0];
  if (!firstUser || !firstExpected) return null;
  if (AUX_QUESTION_STARTERS.has(firstUser)) return null;
  if (!AUX_QUESTION_STARTERS.has(firstExpected)) return null;

  return { tag: 'vi_l1_question_no_aux', replacements: { FIX: rawExpected } };
};

/** 6. Missing article (a/an/the). */
const ruleMissingArticle: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const userArticleCount = userTokens.filter((t) => ARTICLES.has(t)).length;
  const expectedArticleCount = expectedTokens.filter((t) => ARTICLES.has(t)).length;
  if (expectedArticleCount <= userArticleCount) return null;
  if (expectedTokens.length - userTokens.length < 1) return null;
  return { tag: 'vi_l1_missing_article', replacements: { FIX: rawExpected } };
};

/** 8. Possessive gender swap (his/her). */
const rulePossessiveGender: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 0; i < len; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    if (POSSESSIVE_GENDERED.has(u) && POSSESSIVE_GENDERED.has(e) && u !== e) {
      return { tag: 'vi_l1_possessive_gender', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 9. Preposition transfer. */
const rulePrepositionTransfer: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const len = Math.min(userTokens.length, expectedTokens.length);

  for (let i = 0; i < len; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    for (const m of PREPOSITION_MISMATCHES) {
      if (m.wrong.includes(' ')) continue;
      if (u === m.wrong && e === m.right) {
        return {
          tag: 'vi_l1_preposition_transfer',
          replacements: { FIX: rawExpected, USER_PREP: m.wrong, FIX_PREP: m.right },
        };
      }
    }
  }

  const userJoined = userTokens.join(' ');
  const expectedJoined = expectedTokens.join(' ');
  for (const m of PREPOSITION_MISMATCHES) {
    if (!m.right.includes(' ')) continue;
    const wrongPhrase = m.wrong;
    const rightPhrase = m.right;
    if (userJoined.includes(wrongPhrase) && expectedJoined.includes(rightPhrase)) {
      const extraPrep = rightPhrase.slice(wrongPhrase.length).trim();
      if (
        extraPrep &&
        !userJoined.includes(` ${extraPrep} `) &&
        !userJoined.endsWith(` ${extraPrep}`)
      ) {
        return {
          tag: 'vi_l1_preposition_transfer',
          replacements: {
            FIX: rawExpected,
            USER_PREP: wrongPhrase,
            FIX_PREP: rightPhrase,
          },
        };
      }
    }
  }
  return null;
};

/** 10. Uncountable noun used with a/an or with plural -s. */
const ruleCountable: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  for (let i = 0; i < userTokens.length; i++) {
    const raw = userTokens[i];

    let lemma = raw;
    if (raw.endsWith('es') && UNCOUNTABLE_NOUNS.has(raw.slice(0, -2))) {
      lemma = raw.slice(0, -2);
    } else if (raw.endsWith('s') && UNCOUNTABLE_NOUNS.has(raw.slice(0, -1))) {
      lemma = raw.slice(0, -1);
    }
    if (!UNCOUNTABLE_NOUNS.has(lemma)) continue;

    const prev = i > 0 ? userTokens[i - 1] : '';
    const userHasA = prev === 'a' || prev === 'an';
    const userHasS = raw !== lemma;

    if (!userHasA && !userHasS) continue;

    const expectedHas = expectedTokens.includes(lemma);
    if (!expectedHas) continue;
    const expectedIdx = expectedTokens.indexOf(lemma);
    const expectedPrev = expectedIdx > 0 ? expectedTokens[expectedIdx - 1] : '';
    const expectedIsCorrect =
      expectedPrev !== 'a' &&
      expectedPrev !== 'an' &&
      !expectedTokens.includes(lemma + 's') &&
      !expectedTokens.includes(lemma + 'es');
    if (!expectedIsCorrect) continue;

    return { tag: 'vi_l1_countable', replacements: { FIX: rawExpected } };
  }
  return null;
};

// ── v1.1 rules ─────────────────────────────────────────────────────────────

/** 11. Missing `to` between a trigger verb and the following verb. */
const ruleToVerbConfusion: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  // Expected must be exactly one token longer (the extra `to`).
  if (expectedTokens.length !== userTokens.length + 1) return null;

  for (let i = 0; i < expectedTokens.length; i++) {
    if (expectedTokens[i] !== 'to') continue;
    if (i === 0) continue;
    const prev = expectedTokens[i - 1];
    if (!TO_TRIGGER_VERBS.has(prev)) continue;

    // Confirm that removing the `to` at this position matches the user exactly.
    const withoutTo = expectedTokens.slice(0, i).concat(expectedTokens.slice(i + 1));
    if (
      withoutTo.length === userTokens.length &&
      withoutTo.every((t, j) => t === userTokens[j])
    ) {
      return { tag: 'vi_l1_to_verb_confusion', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 12. Inflected verb after a modal (should be bare). */
const ruleCanNoInfinitive: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (userTokens.length !== expectedTokens.length) return null;
  for (let i = 1; i < userTokens.length; i++) {
    const prev = userTokens[i - 1];
    if (!MODAL_VERBS.has(prev)) continue;
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    // user inflected, expected bare
    if (
      isThirdPersonSForm(e, u) ||
      isPastForm(e, u) ||
      u === e + 'ing'
    ) {
      return { tag: 'vi_l1_can_no_infinitive', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 13. Double past marking — do-support + past-form verb.
 *  Scans up to 4 tokens AFTER the do-auxiliary because in questions the
 *  subject sits between ("does he likes" → "does he like"). */
const ruleDoublePast: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (userTokens.length !== expectedTokens.length) return null;
  for (let auxIdx = 0; auxIdx < userTokens.length; auxIdx++) {
    if (!DO_AUX_SET.has(userTokens[auxIdx])) continue;
    const scanEnd = Math.min(userTokens.length, auxIdx + 5);
    for (let i = auxIdx + 1; i < scanEnd; i++) {
      const u = userTokens[i];
      const e = expectedTokens[i];
      if (u === e) continue;
      if (isPastForm(e, u) || isThirdPersonSForm(e, u)) {
        return { tag: 'vi_l1_double_past', replacements: { FIX: rawExpected } };
      }
    }
  }
  return null;
};

/** 14. Possessive 's missing. Regex-on-raw-text since tokenize strips apostrophes. */
const rulePossessiveSMissing: Rule = ({ userText, rawExpected, expectedText }) => {
  const expectedMatch = /\b(\w+)[’']s\s+(\w+)/i.exec(expectedText);
  if (!expectedMatch) return null;
  const possessor = expectedMatch[1];
  const possessed = expectedMatch[2];
  // User has the two words side-by-side WITHOUT 's — and NOT with 's.
  const userHasPair = new RegExp(
    `\\b${possessor}\\s+${possessed}\\b`,
    'i',
  ).test(userText);
  const userHasPossessive = new RegExp(
    `\\b${possessor}[’']s\\s+${possessed}\\b`,
    'i',
  ).test(userText);
  if (userHasPair && !userHasPossessive) {
    return { tag: 'vi_l1_possessive_s_missing', replacements: { FIX: rawExpected } };
  }
  return null;
};

/** 15. Double comparative: `more` + comparative form. */
const ruleComparativeDouble: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  // User has exactly one extra token (the redundant "more").
  if (userTokens.length !== expectedTokens.length + 1) return null;
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (userTokens[i] !== 'more') continue;
    const next = userTokens[i + 1];
    const looksComparative =
      (next.endsWith('er') && next.length > 3) || IRREGULAR_COMPARATIVES.has(next);
    if (!looksComparative) continue;
    // Confirm removing this "more" yields the expected tokens.
    const withoutMore = userTokens.slice(0, i).concat(userTokens.slice(i + 1));
    if (
      withoutMore.length === expectedTokens.length &&
      withoutMore.every((t, j) => t === expectedTokens[j])
    ) {
      return { tag: 'vi_l1_comparative_double', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 16. Adjective order — noun + adjective swapped to adjective + noun. */
const ruleAdjectiveOrder: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (userTokens.length !== expectedTokens.length) return null;
  for (let i = 0; i < userTokens.length - 1; i++) {
    const u1 = userTokens[i];
    const u2 = userTokens[i + 1];
    const e1 = expectedTokens[i];
    const e2 = expectedTokens[i + 1];
    if (
      COMMON_NOUNS.has(u1) &&
      COMMON_ADJECTIVES.has(u2) &&
      COMMON_ADJECTIVES.has(e1) &&
      COMMON_NOUNS.has(e2) &&
      e1 === u2 &&
      e2 === u1
    ) {
      return { tag: 'vi_l1_adjective_order', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 17. "very much" placed before a verb instead of after it. */
const ruleVeryMuchPlacement: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const findVeryMuch = (tokens: string[]): number => {
    for (let i = 0; i < tokens.length - 1; i++) {
      if (tokens[i] === 'very' && tokens[i + 1] === 'much') return i;
    }
    return -1;
  };
  const userIdx = findVeryMuch(userTokens);
  if (userIdx < 0) return null;
  const expectedIdx = findVeryMuch(expectedTokens);
  if (expectedIdx < 0) return null;

  // "very much" appears earlier in the user answer than in the expected
  // answer → misplaced toward the beginning (the classic VN pattern).
  if (userIdx < expectedIdx) {
    return { tag: 'vi_l1_very_much_placement', replacements: { FIX: rawExpected } };
  }
  return null;
};

/** 18. "there are" used with a singular (a/an/one). */
const ruleThereAreSingular: Rule = ({ userText, rawExpected, expectedText }) => {
  if (!/\bthere\s+are\s+(a|an|one)\b/i.test(userText)) return null;
  if (!/\bthere\s+is\s+(a|an|one)\b/i.test(expectedText)) return null;
  return { tag: 'vi_l1_there_are_singular', replacements: { FIX: rawExpected } };
};

/** 19. Indefinite pronoun + plural-looking verb. */
const ruleEveryonePlural: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  if (userTokens.length !== expectedTokens.length) return null;
  const PLURAL_TO_SINGULAR: Record<string, string[]> = {
    are:  ['is'],
    were: ['was'],
    have: ['has'],
    do:   ['does'],
  };
  for (let i = 0; i < userTokens.length - 1; i++) {
    if (!INDEF_PRONOUNS.has(userTokens[i])) continue;
    const u = userTokens[i + 1];
    const e = expectedTokens[i + 1];
    if (u === e) continue;
    const accept = PLURAL_TO_SINGULAR[u];
    if (accept && accept.includes(e)) {
      return { tag: 'vi_l1_everyone_plural', replacements: { FIX: rawExpected } };
    }
    // Bare verb → -s form (e.g. "everyone like" → "everyone likes").
    if (isThirdPersonSForm(u, e)) {
      return { tag: 'vi_l1_everyone_plural', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 20. Make / do / have collocation confusion — walks verb conjugations. */
const ruleMakeVsDo: Rule = ({ userText, rawExpected, expectedText }) => {
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();

  for (const pair of MAKE_DO_COLLOCATIONS) {
    const wrongForms = verbForms(pair.wrongVerb);
    const rightForms = verbForms(pair.rightVerb);

    // Find the first wrong-form + rest that appears in user.
    let userHit: { form: string } | null = null;
    for (const f of wrongForms) {
      if (userLower.includes(`${f} ${pair.rest}`)) {
        userHit = { form: f };
        break;
      }
    }
    if (!userHit) continue;

    // Expected must show a matching right-form + rest.
    let expectedHit: { form: string } | null = null;
    for (const f of rightForms) {
      if (expectedLower.includes(`${f} ${pair.rest}`)) {
        expectedHit = { form: f };
        break;
      }
    }
    if (!expectedHit) continue;

    return {
      tag: 'vi_l1_make_vs_do',
      replacements: {
        FIX: rawExpected,
        WRONG: `${userHit.form} ${pair.rest}`,
        RIGHT: `${expectedHit.form} ${pair.rest}`,
      },
    };
  }
  return null;
};

/** 21. Tag question rendered as ", no?" / ", yes?". */
const ruleTagQuestion: Rule = ({ userText, rawExpected, expectedText }) => {
  if (!/,\s*(no|yes)\s*\?\s*$/i.test(userText)) return null;
  // Guard: if the expected answer also ends with ", no?", this is evidently
  // the target form — don't flag it.
  if (/,\s*(no|yes)\s*\?\s*$/i.test(expectedText)) return null;
  return { tag: 'vi_l1_tag_question', replacements: { FIX: rawExpected } };
};

// ── v1.2 rules ─────────────────────────────────────────────────────────────

/**
 * 22. Past perfect missing — expected has `had + past-participle` at a
 * position where user has just the bare past. Gated by a past-perfect
 * context word (when / before / after / already / just) in either side
 * to keep the false-positive rate low.
 */
const rulePastPerfectMissing: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  if (expectedTokens.length !== userTokens.length + 1) return null;

  const hasContext =
    userTokens.some((t) => PAST_PERFECT_CONTEXT_WORDS.has(t)) ||
    expectedTokens.some((t) => PAST_PERFECT_CONTEXT_WORDS.has(t));
  if (!hasContext) return null;

  for (let i = 0; i < expectedTokens.length - 1; i++) {
    if (expectedTokens[i] !== 'had') continue;
    const next = expectedTokens[i + 1];
    const isPp =
      (next.endsWith('ed') && next.length > 3) ||
      IRREGULAR_PARTICIPLES.has(next);
    if (!isPp) continue;
    // Confirm: expected with this `had` removed equals user.
    const withoutHad = expectedTokens.slice(0, i).concat(expectedTokens.slice(i + 1));
    if (
      withoutHad.length === userTokens.length &&
      withoutHad.every((t, j) => t === userTokens[j])
    ) {
      return {
        tag: 'vi_l1_past_perfect_missing',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/**
 * 23. Reported speech — after `said`, present-tense verbs should shift
 * one step back. User keeps present; expected has past.
 */
const ruleReportedSpeech: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  if (userTokens.length !== expectedTokens.length) return null;
  const saidIdx = userTokens.indexOf('said');
  if (saidIdx < 0) return null;

  for (let i = saidIdx + 1; i < userTokens.length; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    const targets = REPORTED_SHIFT[u];
    if (targets && targets.includes(e)) {
      return { tag: 'vi_l1_reported_speech', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/**
 * 24. Since vs for — user says "for YYYY" (year-as-duration) or "since
 * N years" (duration-as-start-point). Swap.
 */
const ruleSinceVsFor: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  const len = Math.min(userTokens.length, expectedTokens.length);
  for (let i = 0; i < len; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    if ((u === 'for' && e === 'since') || (u === 'since' && e === 'for')) {
      return {
        tag: 'vi_l1_since_vs_for',
        replacements: {
          FIX: rawExpected,
          USER_WORD: u,
          FIX_WORD: e,
        },
      };
    }
  }
  return null;
};

/**
 * 25. many / much confusion — user pairs `much` with a plural, or `many`
 * with an uncountable. Expected swaps the quantifier.
 */
const ruleCountableMuch: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  if (userTokens.length !== expectedTokens.length) return null;
  for (let i = 0; i < userTokens.length - 1; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    if (!((u === 'much' && e === 'many') || (u === 'many' && e === 'much'))) {
      continue;
    }
    const nextU = userTokens[i + 1];
    const nextE = expectedTokens[i + 1];
    if (nextU !== nextE) continue; // noun unchanged — just the quantifier is wrong

    // Extra guard: the noun should actually support the swap direction.
    const nounLooksPlural = nextU.endsWith('s') && !UNCOUNTABLE_NOUNS.has(nextU);
    const nounLooksUncount = UNCOUNTABLE_NOUNS.has(nextU);
    if (u === 'much' && e === 'many' && nounLooksPlural) {
      return { tag: 'vi_l1_countable_much', replacements: { FIX: rawExpected } };
    }
    if (u === 'many' && e === 'much' && nounLooksUncount) {
      return { tag: 'vi_l1_countable_much', replacements: { FIX: rawExpected } };
    }
  }
  return null;
};

/** 26. Some → any in questions / negatives. */
const ruleSomeVsAny: Rule = ({
  userTokens, expectedTokens, userText, rawExpected,
}) => {
  if (userTokens.length !== expectedTokens.length) return null;
  const isQuestionLike =
    /\?\s*$/.test(userText) ||
    userTokens.includes('not') ||
    userTokens.some((t) => DO_AUX_SET.has(t));
  if (!isQuestionLike) return null;

  for (let i = 0; i < userTokens.length; i++) {
    if (userTokens[i] !== 'some') continue;
    if (expectedTokens[i] !== 'any') continue;
    return { tag: 'vi_l1_some_vs_any', replacements: { FIX: rawExpected } };
  }
  return null;
};

/** 27. Reflexive pronoun missing after a reflexive-requiring verb. */
const ruleReflexiveMissing: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  // Expected is exactly one token longer — the missing reflexive pronoun.
  if (expectedTokens.length !== userTokens.length + 1) return null;
  for (let i = 0; i < expectedTokens.length; i++) {
    if (!REFLEXIVE_PRONOUNS.has(expectedTokens[i])) continue;
    if (i === 0) continue;
    // The reflexive must follow a reflexive-requiring verb within 2 positions.
    const ctxStart = Math.max(0, i - 3);
    let verbFound = false;
    for (let j = ctxStart; j < i; j++) {
      if (REFLEXIVE_VERBS.has(expectedTokens[j])) { verbFound = true; break; }
    }
    if (!verbFound) continue;

    const withoutPronoun = expectedTokens.slice(0, i).concat(expectedTokens.slice(i + 1));
    if (
      withoutPronoun.length === userTokens.length &&
      withoutPronoun.every((t, j) => t === userTokens[j])
    ) {
      return {
        tag: 'vi_l1_reflexive_missing',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 28. `will` appearing inside an if-clause. */
const ruleConditionalMix: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  const ifIdx = userTokens.indexOf('if');
  if (ifIdx < 0) return null;

  // Scan the stretch from `if` up to the next comma-ish boundary for `will`.
  // We approximate "clause" as the next ~6 tokens after `if`.
  const clauseEnd = Math.min(userTokens.length, ifIdx + 6);
  for (let i = ifIdx + 1; i < clauseEnd; i++) {
    if (userTokens[i] !== 'will') continue;
    // Expected must NOT contain `will` at the same index.
    if (expectedTokens[i] === 'will') continue;
    return {
      tag: 'vi_l1_conditional_mix',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 29. -ing form after `want/need/hope` (should be bare infinitive with `to`). */
const ruleToInfinitiveAfterIng: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  for (let i = 1; i < userTokens.length; i++) {
    const prev = userTokens[i - 1];
    // Accept any conjugated form of a trigger verb ("needs", "wanted", …)
    if (!isTriggerVerbForm(prev)) continue;
    const u = userTokens[i];
    if (!u.endsWith('ing') || u.length <= 4) continue;
    const baseGuess = u.slice(0, -3);
    // Expected should have `to + baseGuess` somewhere downstream.
    const idx = expectedTokens.indexOf('to');
    if (idx < 0) return null;
    if (expectedTokens[idx + 1] !== baseGuess && expectedTokens[idx + 1] !== baseGuess + 'e') {
      continue;
    }
    return {
      tag: 'vi_l1_to_infinitive_after_ing',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 30. Passive voice missing `be` before the past participle. */
const rulePassiveMissingBe: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  // Expected inserts a be-verb (was/were/is/are) that user lacks.
  if (expectedTokens.length !== userTokens.length + 1) return null;

  for (let i = 0; i < expectedTokens.length - 1; i++) {
    if (!BE_VERBS.has(expectedTokens[i])) continue;
    // Guard: "be used to" is idiomatic — defer to rule 32.
    const next = expectedTokens[i + 1];
    if (next === 'used' && expectedTokens[i + 2] === 'to') continue;

    if (!looksLikePassiveParticiple(expectedTokens, i + 1)) continue;

    const withoutBe = expectedTokens.slice(0, i).concat(expectedTokens.slice(i + 1));
    if (
      withoutBe.length === userTokens.length &&
      withoutBe.every((t, j) => t === userTokens[j])
    ) {
      return {
        tag: 'vi_l1_passive_missing_be',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 31. `which` used where `who` is correct (people antecedent). */
const ruleRelativePronoun: Rule = ({
  userTokens, expectedTokens, rawExpected,
}) => {
  const PEOPLE_NOUNS = new Set([
    'man', 'woman', 'boy', 'girl', 'teacher', 'student', 'doctor',
    'friend', 'brother', 'sister', 'mother', 'father', 'child',
    'people', 'person', 'neighbor', 'boss', 'colleague', 'guy',
  ]);
  if (userTokens.length !== expectedTokens.length) return null;
  for (let i = 1; i < userTokens.length; i++) {
    const u = userTokens[i];
    const e = expectedTokens[i];
    if (u === e) continue;
    if (u === 'which' && e === 'who') {
      // Prev token should be a person noun (and the/a/an before it).
      const prev1 = userTokens[i - 1];
      const prev2 = i >= 2 ? userTokens[i - 2] : '';
      if (PEOPLE_NOUNS.has(prev1) || PEOPLE_NOUNS.has(prev2)) {
        return {
          tag: 'vi_l1_relative_pronoun',
          replacements: { FIX: rawExpected },
        };
      }
    }
  }
  return null;
};

/** 32. used to vs be used to confusion (two distinct patterns). */
const ruleUsedToVsBeUsedTo: Rule = ({
  userTokens, expectedTokens, userText, rawExpected,
}) => {
  // Pattern A: user has "am/is/are used to + bare verb"; expected has
  //            "used to + bare verb" (past habit).
  // Pattern B: user has "used to + -ing / noun"; expected has
  //            "am/is/are used to + -ing" (accustomed).
  const userLower = userText.toLowerCase();
  const expectedLower = (expectedTokens || []).join(' ');

  // Pattern A: "(am|is|are) used to <bareVerb>"
  const aMatch = /\b(am|is|are)\s+used\s+to\s+(\w+)/i.exec(userLower);
  if (aMatch) {
    const afterTo = aMatch[2];
    if (!afterTo.endsWith('ing')) {
      // Expected should have "used to <same bare verb>" without the be-verb.
      if (new RegExp(`\\bused\\s+to\\s+${afterTo}\\b`, 'i').test(expectedLower)) {
        return {
          tag: 'vi_l1_used_to_vs_be_used_to',
          replacements: { FIX: rawExpected },
        };
      }
    }
  }

  // Pattern B: "used to <-ing>" — expected has "(am|is|are) used to <-ing>"
  const bMatch = /\bused\s+to\s+(\w+ing)\b/i.exec(userLower);
  if (bMatch) {
    const gerund = bMatch[1];
    if (new RegExp(`\\b(am|is|are)\\s+used\\s+to\\s+${gerund}\\b`, 'i').test(expectedLower)) {
      return {
        tag: 'vi_l1_used_to_vs_be_used_to',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 33. `other` where `another` is correct. */
const ruleAnotherVsOther: Rule = ({
  userText, userTokens, expectedTokens, rawExpected,
}) => {
  const userLower = userText.toLowerCase();
  // User says "other one more", "one other", "other one" in a singular slot.
  if (!/\bother\b/.test(userLower)) return null;

  // Expected has "another" where user has "other".
  if (userTokens.length !== expectedTokens.length) return null;
  for (let i = 0; i < userTokens.length; i++) {
    if (userTokens[i] === 'other' && expectedTokens[i] === 'another') {
      return {
        tag: 'vi_l1_another_vs_other',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 34. look / see / watch collocation confusion. Walks verb conjugations. */
const ruleLookSeeWatch: Rule = ({ userText, rawExpected, expectedText }) => {
  const LOOK_FORMS  = ['look', 'looks', 'looked', 'looking'];
  const SEE_FORMS   = ['see', 'sees', 'saw', 'seen', 'seeing'];
  const WATCH_FORMS = ['watch', 'watches', 'watched', 'watching'];
  const formsOf = (v: 'look' | 'see' | 'watch' | 'look at'): readonly string[] => {
    if (v === 'look') return LOOK_FORMS;
    if (v === 'see') return SEE_FORMS;
    if (v === 'watch') return WATCH_FORMS;
    return LOOK_FORMS.map((f) => `${f} at`);
  };

  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();

  for (const pair of LOOK_SEE_WATCH_COLLOCATIONS) {
    const wrongForms = formsOf(pair.wrongVerb);
    const rightForms = formsOf(pair.rightVerb);

    let userHit: { form: string } | null = null;
    for (const f of wrongForms) {
      if (userLower.includes(`${f} ${pair.rest}`)) {
        userHit = { form: f };
        break;
      }
    }
    if (!userHit) continue;

    let expectedHit: { form: string } | null = null;
    for (const f of rightForms) {
      if (expectedLower.includes(`${f} ${pair.rest}`)) {
        expectedHit = { form: f };
        break;
      }
    }
    if (!expectedHit) continue;

    return {
      tag: 'vi_l1_look_vs_see_vs_watch',
      replacements: {
        FIX: rawExpected,
        WRONG: `${userHit.form} ${pair.rest}`,
        RIGHT: `${expectedHit.form} ${pair.rest}`,
      },
    };
  }
  return null;
};

/** 35. by / with confusion on transport / instrument. */
const ruleByVsWith: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();
  for (const m of BY_WITH_MISMATCHES) {
    if (m.wrong === m.right) continue; // skip the correct-entry guard
    if (userLower.includes(m.wrong) && expectedLower.includes(m.right)) {
      return {
        tag: 'vi_l1_by_vs_with',
        replacements: {
          FIX: rawExpected,
          WRONG: m.wrong,
          RIGHT: m.right,
        },
      };
    }
  }
  return null;
};

/** 36. Time preposition mismatches (year, parts of day, weekday). */
const ruleTimeExpressions: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();
  for (const m of TIME_PREP_MISMATCHES) {
    if (userLower.includes(m.wrong) && expectedLower.includes(m.right)) {
      // Extract a short USER_PREP / FIX_PREP pair for the feedback template.
      const userPrep = m.wrong.split(/\s+/)[0];
      const fixPrep = m.right.split(/\s+/)[0];
      return {
        tag: 'vi_l1_time_expressions',
        replacements: {
          FIX: rawExpected,
          USER_PREP: userPrep,
          FIX_PREP: fixPrep,
        },
      };
    }
  }
  return null;
};

// ────────────────────────────────────────────────────────────────────────────
// Round 5 additions — rules 37–61. Shared constants + rule bodies.
// Pattern-match only. Low-FP bias: when unsure, return null.
// ────────────────────────────────────────────────────────────────────────────

// Irregular past-participle forms paired with the simple-past form the
// learner "meant" when they point to a specific past time. Keys are
// forms that might appear after "have/has/had" in the user's sentence.
const PAST_PARTICIPLES_TO_SIMPLE = new Map<string, string>([
  ['been', 'was'],
  ['done', 'did'],
  ['gone', 'went'],
  ['eaten', 'ate'],
  ['seen', 'saw'],
  ['taken', 'took'],
  ['written', 'wrote'],
  ['spoken', 'spoke'],
  ['broken', 'broke'],
  ['chosen', 'chose'],
  ['forgotten', 'forgot'],
  ['given', 'gave'],
  ['gotten', 'got'],
  ['known', 'knew'],
  ['met', 'met'],
  ['read', 'read'],
  ['said', 'said'],
  ['told', 'told'],
  ['thought', 'thought'],
  ['bought', 'bought'],
  ['caught', 'caught'],
  ['brought', 'brought'],
  ['drunk', 'drank'],
  ['sung', 'sang'],
  ['swum', 'swam'],
  ['run', 'ran'],
  ['flown', 'flew'],
  ['driven', 'drove'],
  ['made', 'made'],
  ['found', 'found'],
  ['left', 'left'],
  ['felt', 'felt'],
  ['heard', 'heard'],
]);

// Verbs that REQUIRE a gerund complement in modern English. Using
// "to + V" after these is the classic VN-learner pattern.
const GERUND_REQUIRING_VERBS = new Set([
  'enjoy', 'enjoys', 'enjoyed',
  'avoid', 'avoids', 'avoided',
  'finish', 'finishes', 'finished',
  'keep', 'keeps', 'kept',
  'mind', 'minds', 'minded',
  'suggest', 'suggests', 'suggested',
  'consider', 'considers', 'considered',
  'practise', 'practises', 'practised',
  'practice', 'practices', 'practiced',
  'quit', 'quits', 'quitted',
  'admit', 'admits', 'admitted',
]);

// Past-tense or past-participle forms that should not sit directly
// after a modal like "should". Paired with "modal + have + V3" fix.
const PAST_ISH_AFTER_MODAL = new Set([
  'did', 'went', 'saw', 'took', 'gave', 'made', 'knew', 'brought',
  'bought', 'taught', 'thought', 'caught', 'told', 'said', 'ate',
  'drove', 'wrote', 'sang', 'ran', 'came', 'had', 'got', 'got-ten',
  'became', 'began', 'broke', 'chose', 'drew', 'forgot', 'grew',
  'heard', 'kept', 'left', 'lost', 'met', 'paid', 'read', 'sat',
  'slept', 'spoke', 'spent', 'stood', 'stole', 'swam', 'threw',
  'understood', 'wore', 'won',
]);

// Subset of modals for the "modal + past → modal + have + V3" rule.
// (The full MODAL_VERBS set lives above; this one is scoped to rule 43.)
const MODAL_PERFECT_MODALS = new Set(['should', 'could', 'would', 'might', 'must']);

// Separable-phrasal-verb particles. (We don't claim to cover all English
// particles — just the high-frequency separable ones.)
const PHRASAL_PARTICLES = new Set([
  'up', 'out', 'on', 'off', 'in', 'away', 'back', 'over', 'down',
  'around', 'about', 'across',
]);

// Verbs that take those particles in their separable sense.
const SEPARABLE_PHRASAL_VERBS = new Set([
  'pick', 'picks', 'picked', 'picking',
  'put', 'puts', 'putting',
  'turn', 'turns', 'turned', 'turning',
  'take', 'takes', 'took', 'taken', 'taking',
  'give', 'gives', 'gave', 'given', 'giving',
  'call', 'calls', 'called', 'calling',
  'hand', 'hands', 'handed', 'handing',
  'bring', 'brings', 'brought', 'bringing',
  'wake', 'wakes', 'woke', 'woken', 'waking',
  'shut', 'shuts', 'shutting',
  'switch', 'switches', 'switched', 'switching',
  'throw', 'throws', 'threw', 'thrown', 'throwing',
  'try', 'tries', 'tried', 'trying',
  'figure', 'figures', 'figured', 'figuring',
  'fill', 'fills', 'filled', 'filling',
  'write', 'writes', 'wrote', 'written', 'writing',
]);

const OBJECT_PRONOUNS = new Set(['him', 'her', 'it', 'them', 'me', 'us', 'you']);

// Multi-syllable adjectives mistakenly given an -er or -est ending.
const LONG_ADJECTIVES = [
  'beautiful', 'important', 'difficult', 'interesting', 'wonderful',
  'expensive', 'dangerous', 'careful', 'comfortable', 'delicious',
  'terrible', 'horrible', 'useful', 'powerful', 'successful',
  'popular', 'possible', 'impossible', 'modern', 'famous',
  'generous',
];

const UNCOUNTABLE_FOR_MANY = new Set([
  'water', 'money', 'advice', 'information', 'furniture', 'news',
  'music', 'rice', 'bread', 'sugar', 'coffee', 'milk', 'time',
  'homework', 'work', 'luggage', 'equipment', 'traffic', 'weather',
]);

// Country names where "the" is WRONG.
const COUNTRIES_NO_THE = new Set([
  'vietnam', 'japan', 'china', 'korea', 'france', 'germany',
  'england', 'italy', 'spain', 'russia', 'canada', 'australia',
  'brazil', 'mexico', 'india', 'thailand', 'singapore', 'malaysia',
  'indonesia', 'laos', 'cambodia',
]);

// Country names where "the" is REQUIRED.
const COUNTRIES_WITH_THE = new Set([
  'philippines', 'netherlands', 'usa', 'uk',
]);

// Generic singular countable nouns that learners drop the plural on.
const GENERIC_SINGULAR_NOUNS = new Set([
  'dog', 'cat', 'book', 'apple', 'banana', 'car', 'horse', 'child',
  'flower', 'song', 'movie', 'student', 'computer',
]);

// Adjectives that are positive / neutral enough that "too X" is
// almost certainly a misuse of "too" for "very".
const POSITIVE_ADJECTIVES_FOR_TOO = new Set([
  'happy', 'beautiful', 'good', 'nice', 'kind', 'clever',
  'interesting', 'exciting', 'delicious', 'wonderful', 'lovely',
  'smart',
]);

// Singular nouns frequently placed after "one of the / my / her".
const COMMON_SINGULAR_NOUNS_AFTER_ONE_OF = new Set([
  'student', 'book', 'friend', 'boy', 'girl', 'man', 'woman',
  'teacher', 'doctor', 'child', 'apple', 'car', 'house', 'room',
  'dog', 'cat', 'movie', 'song', 'problem', 'question',
]);

// Countable nouns that should be PLURAL-ised as a wrong form after "each".
const WRONG_EACH_PLURALS = new Set([
  'students', 'books', 'friends', 'boys', 'girls', 'men', 'women',
  'teachers', 'doctors', 'children', 'people', 'cats', 'dogs',
]);

// Abstract / generic nouns frequently preceded by an incorrect "the"
// when they're meant generically.
const ABSTRACT_GENERIC_NOUNS = new Set([
  'life', 'love', 'music', 'art', 'nature', 'time', 'happiness',
  'history', 'science', 'knowledge', 'freedom', 'peace', 'money',
  'friendship',
]);

// Regular superlative spellings + common irregulars.
const IRREGULAR_SUPERLATIVES = new Set(['best', 'worst', 'least', 'most']);

// Helper: does the word look like a regular "-est" superlative?
function isRegularSuperlative(word: string): boolean {
  if (word.length < 5) return false;
  if (!word.endsWith('est')) return false;
  // Filter out common false positives ("west", "test", "rest", etc. already
  // filtered by length + are also excluded by the earlier "-est suffix" check
  // of 3 letters; here we guard a few common false friends).
  const stopset = new Set(['test', 'rest', 'west', 'best', 'chest', 'guest', 'nest']);
  if (stopset.has(word)) return false;
  return true;
}

// Helper: is `word` a simple vowel-initial word (AEIOU)? Conservative — we
// skip known silent-h / y-consonant exceptions to keep FPs down.
const SILENT_H_WORDS = new Set(['hour', 'honest', 'honor', 'honour', 'heir']);
const U_CONSONANT_SOUND = new Set([
  'university', 'user', 'useful', 'unique', 'uniform', 'unit', 'one',
  'euro', 'european', 'useless',
]);
function startsWithVowelSound(word: string): boolean {
  if (!word) return false;
  const w = word.toLowerCase();
  if (SILENT_H_WORDS.has(w)) return true;
  if (U_CONSONANT_SOUND.has(w)) return false;
  return /^[aeiou]/.test(w);
}

function joinTokens(tokens: string[]): string {
  return tokens.join(' ');
}

/** 37. Present perfect used with a specific past-time marker — B1. */
const rulePresentPerfectVsPast: Rule = ({
  userTokens,
  expectedTokens,
  userText,
  expectedText,
  rawExpected,
}) => {
  // Must: user has "have/has" + past-participle AND a past-time marker,
  //       expected does NOT use have/has in the same slot.
  if (!/\b(have|has)\s+\w+/.test(userText)) return null;
  if (!hasPastTimeMarker(userTokens)) return null;
  // Expected should use simple past (no have/has + participle form).
  if (/\b(have|has)\s+\w+/.test(expectedText)) return null;
  // Scan the user tokens for a "have/has + PP" pair.
  for (let i = 1; i < userTokens.length; i++) {
    const aux = userTokens[i - 1];
    if (aux !== 'have' && aux !== 'has') continue;
    const next = userTokens[i];
    if (PAST_PARTICIPLES_TO_SIMPLE.has(next)) {
      return {
        tag: 'vi_l1_present_perfect_vs_past',
        replacements: { FIX: rawExpected },
      };
    }
    // Regular -ed participle form.
    if (/^\w+ed$/.test(next) && expectedTokens.includes(next)) {
      return {
        tag: 'vi_l1_present_perfect_vs_past',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 38. "if/wish + subject + was" → "were" — B2. */
const ruleSubjunctiveWere: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();
  if (!/\b(if|wish)\s+(i|he|she|it)\s+was\b/.test(userLower)) return null;
  if (!/\b(if|wish)\s+(i|he|she|it)\s+were\b/.test(expectedLower)) return null;
  return {
    tag: 'vi_l1_subjunctive_were',
    replacements: { FIX: rawExpected },
  };
};

/** 39. Embedded-question inverted word order — B1. */
const ruleEmbeddedQuestionOrder: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();
  // The wrong side is distinctive enough on its own: a reporting verb
  // ("tell me", "I don't know", "wonder") followed later by
  // wh + aux + subject — i.e., question-inversion inside the embedded
  // clause.
  const reportingVerbs = '(know|wonder|tell|ask|understand|remember|see|explain|find\\s+out)';
  const whWords = '(what|where|when|why|how|who|which)';
  const auxes = '(is|are|was|were|do|does|did|can|could|will|would|has|have|had)';
  const subjects = '(this|that|these|those|he|she|it|they|we|i|you)';
  const wrongPattern = new RegExp(
    `\\b${reportingVerbs}.*\\b${whWords}\\s+${auxes}\\s+${subjects}\\b`,
  );
  const m = wrongPattern.exec(userLower);
  if (!m) return null;
  // Sanity: the expected contains the same wh-word but does NOT have
  // the aux immediately following it (i.e., inversion is removed).
  // m[2] here is the wh-word group (reportingVerbs is group 1).
  const whWord = m[2];
  if (!expectedLower.includes(whWord)) return null;
  // Reject if the expected still has `wh + aux` — that would mean both
  // sides are inverted and this isn't the L1 pattern we're looking for.
  const stillInverted = new RegExp(`\\b${whWord}\\s+${auxes}\\s+${subjects}\\b`);
  if (stillInverted.test(expectedLower)) return null;
  return {
    tag: 'vi_l1_embedded_question_order',
    replacements: { FIX: rawExpected },
  };
};

/** 40. "she/he/it don't" → "doesn't" — A2. */
const ruleDoSupport3ps: Rule = ({ userText, expectedText, rawExpected }) => {
  // normalizeContractions already collapses don't → dont, doesn't → doesnt.
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();
  if (!/\b(she|he|it)\s+dont\b/.test(userLower)) return null;
  if (!/\b(she|he|it)\s+doesnt\b/.test(expectedLower)) return null;
  return {
    tag: 'vi_l1_do_support_3ps',
    replacements: { FIX: rawExpected },
  };
};

/** 41. Missing subject relative pronoun (who/which/that) — B1. */
const ruleSubjectRelativeOmit: Rule = ({ userText, expectedText, rawExpected }) => {
  const expectedLower = expectedText.toLowerCase();
  const userLower = userText.toLowerCase();
  // Expected must carry a subject relative after a noun.
  const relHeads = '(man|woman|person|people|boy|girl|student|teacher|friend|book|car|house|thing|dog|cat|movie|song)';
  const pattern = new RegExp(
    `\\b${relHeads}\\s+(who|which|that)\\s+\\w+`,
  );
  if (!pattern.test(expectedLower)) return null;
  // User version drops the relative.
  const stripped = expectedLower.replace(/\b(who|which|that)\s+/g, '');
  // If user roughly matches the "stripped" variant and DOES NOT carry any
  // relative pronoun, flag.
  if (/\b(who|which|that)\b/.test(userLower)) return null;
  // Cheap similarity check: user shares at least 4 consecutive tokens with
  // the stripped expected. Keeps FPs down on totally unrelated sentences.
  const userStripped = userLower.replace(/\s+/g, ' ');
  const pieces = stripped.split(/\s+/).filter(Boolean);
  for (let i = 0; i + 3 < pieces.length; i++) {
    const chunk = pieces.slice(i, i + 4).join(' ');
    if (userStripped.includes(chunk)) {
      return {
        tag: 'vi_l1_subject_relative_omit',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 42. Gerund required after enjoy/avoid/finish/keep/mind/... — B1. */
const ruleGerundAfterVerb: Rule = ({ userTokens, expectedText, rawExpected }) => {
  // Look for the wrong pattern directly: <gerund-verb> <to> <verb>.
  // Expected must contain an -ing form whose stem overlaps with the
  // user's bare verb. We accept three common English -ing shapes:
  //   take + ing → taking        (drop trailing 'e')
  //   swim + ing → swimming      (double final consonant, CVC)
  //   walk + ing → walking       (plain append)
  // A permissive check that also catches irregulars like "lie → lying"
  // falls back to "expected has an -ing word whose first 3 letters
  // match the user's verb".
  const expLower = expectedText.toLowerCase();
  for (let i = 0; i + 2 < userTokens.length; i++) {
    const v = userTokens[i];
    if (!GERUND_REQUIRING_VERBS.has(v)) continue;
    if (userTokens[i + 1] !== 'to') continue;
    const next = userTokens[i + 2];
    if (!/^[a-z]+$/.test(next)) continue;
    const candidates = new Set<string>();
    candidates.add(next + 'ing');
    if (next.endsWith('e')) candidates.add(next.slice(0, -1) + 'ing');
    candidates.add(next + next[next.length - 1] + 'ing');
    let matched = false;
    for (const c of candidates) {
      if (expLower.includes(c)) { matched = true; break; }
    }
    if (!matched && next.length >= 3) {
      // Fallback: any -ing word in expected whose first 3 letters match.
      const prefix = next.slice(0, 3);
      const ingRe = new RegExp(`\\b${prefix}\\w*ing\\b`);
      if (ingRe.test(expLower)) matched = true;
    }
    if (!matched) continue;
    return {
      tag: 'vi_l1_gerund_after_verb',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 43. "modal + past-tense verb" → "modal + have + V3" — B2. */
const ruleModalPerfect: Rule = ({ userTokens, expectedText, rawExpected }) => {
  for (let i = 1; i < userTokens.length; i++) {
    if (!MODAL_PERFECT_MODALS.has(userTokens[i - 1])) continue;
    const next = userTokens[i];
    if (!PAST_ISH_AFTER_MODAL.has(next)) continue;
    // Expected should include "have" right after the modal.
    const modalHavePattern = new RegExp(`\\b${userTokens[i - 1]}\\s+have\\b`, 'i');
    if (!modalHavePattern.test(expectedText)) continue;
    return {
      tag: 'vi_l1_modal_perfect',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 44. Separable phrasal verb + particle + pronoun → pronoun between — B1. */
const rulePhrasalPronounOrder: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  // Wrong: <verb> <particle> <pronoun>
  // Right: <verb> <pronoun> <particle>
  for (let i = 0; i + 2 < userTokens.length; i++) {
    if (!SEPARABLE_PHRASAL_VERBS.has(userTokens[i])) continue;
    if (!PHRASAL_PARTICLES.has(userTokens[i + 1])) continue;
    if (!OBJECT_PRONOUNS.has(userTokens[i + 2])) continue;
    // Sanity: expected flips the particle and pronoun.
    for (let j = 0; j + 2 < expectedTokens.length; j++) {
      if (expectedTokens[j] !== userTokens[i]) continue;
      if (expectedTokens[j + 1] !== userTokens[i + 2]) continue;
      if (expectedTokens[j + 2] !== userTokens[i + 1]) continue;
      return {
        tag: 'vi_l1_phrasal_pronoun_order',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 45. "more {beautifuler / importanter / …}" or bare "beautifuler" — A2. */
const ruleComparativeMoreLong: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();
  for (const adj of LONG_ADJECTIVES) {
    // Wrong form: "adj + er" (e.g., beautifuler).
    const wrongEr = new RegExp(`\\b${adj}er\\b`);
    if (wrongEr.test(userLower) && expectedLower.includes(`more ${adj}`)) {
      return {
        tag: 'vi_l1_comparative_more_long',
        replacements: { FIX: rawExpected },
      };
    }
    // Wrong form: "more + adj + er" (doubled).
    const wrongMoreEr = new RegExp(`\\bmore ${adj}er\\b`);
    if (wrongMoreEr.test(userLower) && expectedLower.includes(`more ${adj}`)) {
      return {
        tag: 'vi_l1_comparative_more_long',
        replacements: { FIX: rawExpected },
      };
    }
  }
  return null;
};

/** 46. "many {water/money/...}" → "much" — A2. */
const ruleManyWithUncount: Rule = ({ userTokens, expectedText, rawExpected }) => {
  for (let i = 0; i + 1 < userTokens.length; i++) {
    if (userTokens[i] !== 'many') continue;
    const next = userTokens[i + 1];
    if (!UNCOUNTABLE_FOR_MANY.has(next)) continue;
    if (!expectedText.toLowerCase().includes(`much ${next}`)) continue;
    return {
      tag: 'vi_l1_many_with_uncount',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 47. Wrong article with geographical names — B1. */
const ruleGeographicalArticle: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  // (a) "the <bare-country-name>" in user but expected drops "the".
  for (let i = 0; i + 1 < userTokens.length; i++) {
    if (userTokens[i] !== 'the') continue;
    if (!COUNTRIES_NO_THE.has(userTokens[i + 1])) continue;
    // Expected must have the bare country without preceding "the".
    const idx = expectedTokens.indexOf(userTokens[i + 1]);
    if (idx < 0) continue;
    if (idx > 0 && expectedTokens[idx - 1] === 'the') continue;
    return {
      tag: 'vi_l1_geographical_article',
      replacements: { FIX: rawExpected },
    };
  }
  // (b) Missing "the" before a plural-sounding country.
  for (let i = 0; i < userTokens.length; i++) {
    if (!COUNTRIES_WITH_THE.has(userTokens[i])) continue;
    if (i > 0 && userTokens[i - 1] === 'the') continue;
    // Expected must have the "the".
    const expIdx = expectedTokens.indexOf(userTokens[i]);
    if (expIdx <= 0) continue;
    if (expectedTokens[expIdx - 1] !== 'the') continue;
    return {
      tag: 'vi_l1_geographical_article',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 48. Generic statements should use plural — "I like dog" → "dogs" — A2. */
const ruleGenericPlural: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const feelVerbs = new Set(['like', 'love', 'enjoy', 'hate', 'prefer']);
  const subjectSet = new Set(['i', 'we', 'they', 'you']);
  for (let i = 0; i + 2 < userTokens.length; i++) {
    if (!subjectSet.has(userTokens[i])) continue;
    if (!feelVerbs.has(userTokens[i + 1])) continue;
    const noun = userTokens[i + 2];
    if (!GENERIC_SINGULAR_NOUNS.has(noun)) continue;
    // Expected must have the plural.
    const plural = noun + 's';
    if (!expectedTokens.includes(plural)) continue;
    return {
      tag: 'vi_l1_generic_plural',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 49. Double negative in a clause — A2. */
const ruleDoubleNegative: Rule = ({ userText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  // Collapse contractions are already handled. Look for "<negation-aux>
  // ... <no|nothing|never>" in a short window.
  const pattern = /\b(dont|doesnt|didnt|cant|wont|shouldnt|wouldnt|couldnt|isnt|arent|wasnt|werent|hasnt|havent|hadnt|not)\b[^.?!]{0,40}\b(no|nothing|nobody|never|none)\b/;
  if (!pattern.test(userLower)) return null;
  return {
    tag: 'vi_l1_double_negative',
    replacements: { FIX: rawExpected },
  };
};

/** 50. Fronted negative adverbial without inversion — C1. */
const ruleNegativeInversion: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase().trim();
  const expectedLower = expectedText.toLowerCase().trim();
  // User starts with negative adverbial but keeps SVO order.
  const wrongHead = /^(never|seldom|rarely|hardly|not only|little)\s+(i|he|she|we|they|you|it)\s+(have|has|had|am|is|are|was|were|do|does|did|can|could|will|would)\b/;
  if (!wrongHead.test(userLower)) return null;
  // Expected starts with the adverbial followed by the auxiliary (inverted).
  const rightHead = /^(never|seldom|rarely|hardly|not only|little)\s+(have|has|had|am|is|are|was|were|do|does|did|can|could|will|would)\s+(i|he|she|we|they|you|it)\b/;
  if (!rightHead.test(expectedLower)) return null;
  return {
    tag: 'vi_l1_negative_inversion',
    replacements: { FIX: rawExpected },
  };
};

/** 51. Frequency adverb placed before the subject — A2. */
const ruleAdverbBeforeSubject: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  const freq = new Set(['always', 'usually', 'sometimes', 'often', 'rarely', 'never']);
  const subjects = new Set(['i', 'he', 'she', 'we', 'they', 'you', 'it']);
  if (userTokens.length < 3) return null;
  if (!freq.has(userTokens[0])) return null;
  if (!subjects.has(userTokens[1])) return null;
  // Expected should start with the subject and have the adverb after it.
  if (expectedTokens[0] !== userTokens[1]) return null;
  if (!expectedTokens.includes(userTokens[0])) return null;
  return {
    tag: 'vi_l1_adverb_before_subject',
    replacements: { FIX: rawExpected },
  };
};

/** 52. "make/let/had + obj + to V" → bare verb — B1. */
const ruleMakeLetBare: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  const pattern = /\b(make|makes|made|let|lets|had)\s+(me|him|her|us|them|you|it)\s+to\s+(\w+)/;
  const m = pattern.exec(userLower);
  if (!m) return null;
  const verb = m[3];
  if (!expectedText.toLowerCase().includes(`${m[1]} ${m[2]} ${verb}`)) return null;
  return {
    tag: 'vi_l1_make_let_bare',
    replacements: { FIX: rawExpected },
  };
};

/** 53. "too + positive adjective" where expected uses "very" — A2. */
const ruleTooVsVery: Rule = ({ userTokens, expectedText, rawExpected }) => {
  for (let i = 0; i + 1 < userTokens.length; i++) {
    if (userTokens[i] !== 'too') continue;
    const adj = userTokens[i + 1];
    if (!POSITIVE_ADJECTIVES_FOR_TOO.has(adj)) continue;
    // Expected must use "very + adj".
    if (!expectedText.toLowerCase().includes(`very ${adj}`)) continue;
    // Skip the legitimate "too X to Y" construction.
    const following = joinTokens(userTokens.slice(i + 2));
    if (/^to\s+\w+/.test(following) && !expectedText.toLowerCase().includes(`very ${adj} to`)) {
      continue;
    }
    return {
      tag: 'vi_l1_too_vs_very',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 54. "a" before vowel sound / "an" before consonant sound — A1. */
const ruleAvsAnVowel: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  for (let i = 0; i + 1 < userTokens.length; i++) {
    const art = userTokens[i];
    if (art !== 'a' && art !== 'an') continue;
    const next = userTokens[i + 1];
    if (!/^[a-z]+$/.test(next)) continue;
    const isVowel = startsWithVowelSound(next);
    const wrong = (art === 'a' && isVowel) || (art === 'an' && !isVowel);
    if (!wrong) continue;
    // Expected must have the right article paired with the same word.
    const correctArt = isVowel ? 'an' : 'a';
    for (let j = 0; j + 1 < expectedTokens.length; j++) {
      if (expectedTokens[j] === correctArt && expectedTokens[j + 1] === next) {
        return {
          tag: 'vi_l1_a_vs_an_vowel',
          replacements: { FIX: rawExpected },
        };
      }
    }
  }
  return null;
};

/** 55. "one of the + singular noun" → plural — B1. */
const ruleOneOfTheSingular: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  const determiners = '(the|my|his|her|your|our|their)';
  const pattern = new RegExp(`\\bone of ${determiners}\\s+(\\w+)`);
  const m = pattern.exec(userLower);
  if (!m) return null;
  const noun = m[2];
  if (!COMMON_SINGULAR_NOUNS_AFTER_ONE_OF.has(noun)) return null;
  const plural = /(s|x|z|ch|sh)$/.test(noun) ? noun + 'es' : noun + 's';
  if (!expectedText.toLowerCase().includes(plural)) return null;
  return {
    tag: 'vi_l1_one_of_the_singular',
    replacements: { FIX: rawExpected },
  };
};

/** 56. "each + plural noun" → singular — B1. */
const ruleEachSingular: Rule = ({ userTokens, expectedText, rawExpected }) => {
  for (let i = 0; i + 1 < userTokens.length; i++) {
    if (userTokens[i] !== 'each' && userTokens[i] !== 'every') continue;
    const next = userTokens[i + 1];
    if (!WRONG_EACH_PLURALS.has(next)) continue;
    // Expected should have the singular form.
    const singular = next === 'children' ? 'child'
      : next === 'people' ? 'person'
      : next === 'women' ? 'woman'
      : next === 'men' ? 'man'
      : next.endsWith('s') ? next.slice(0, -1)
      : next;
    if (!expectedText.toLowerCase().includes(`${userTokens[i]} ${singular}`)) continue;
    return {
      tag: 'vi_l1_each_singular',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 57. "have/has/had + gone to X" in a "visited" context — B2. */
const ruleBeenVsGone: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  // Allow up to 3 intervening words between the auxiliary and the
  // participle, so "have you ever gone", "has he never gone", etc.
  // all match alongside the simpler "have gone".
  const userGone = /\b(have|has|had)(?:\s+\w+){0,3}\s+gone\b/;
  if (!userGone.test(userLower)) return null;
  // Visit-ish cues: "times", "before", "ever", "never" — imply the person
  // came back, so "been to" is correct.
  const visitCue = /\b(times|before|ever|never|twice|once|many times|several times)\b/;
  if (!visitCue.test(userLower)) return null;
  const expBeenTo = /\b(have|has|had)(?:\s+\w+){0,3}\s+been\s+to\b/;
  if (!expBeenTo.test(expectedText.toLowerCase())) return null;
  return {
    tag: 'vi_l1_been_vs_gone',
    replacements: { FIX: rawExpected },
  };
};

/** 58. Tag question with same-polarity tag — B1. */
const ruleTagPolarity: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase().replace(/\?\s*$/, '').trim();
  const expectedLower = expectedText.toLowerCase().replace(/\?\s*$/, '').trim();
  // Last comma splits the main clause and tag.
  const commaIdx = userLower.lastIndexOf(',');
  if (commaIdx < 0) return null;
  const mainClause = userLower.slice(0, commaIdx).trim();
  const tag = userLower.slice(commaIdx + 1).trim();
  if (!tag) return null;
  const mainIsNeg = /\b(dont|doesnt|didnt|cant|wont|shouldnt|isnt|arent|wasnt|werent|not)\b/.test(mainClause);
  const tagIsNeg = /\b(dont|doesnt|didnt|cant|wont|shouldnt|isnt|arent|wasnt|werent|not)\b/.test(tag);
  // Same polarity both ways = wrong. Matches the VN-L1 pattern.
  if (mainIsNeg !== tagIsNeg) return null;
  // Expected must differ: expected tag flips polarity vs main.
  const expCommaIdx = expectedLower.lastIndexOf(',');
  if (expCommaIdx < 0) return null;
  const expMain = expectedLower.slice(0, expCommaIdx).trim();
  const expTag = expectedLower.slice(expCommaIdx + 1).trim();
  const expMainNeg = /\b(dont|doesnt|didnt|cant|wont|shouldnt|isnt|arent|wasnt|werent|not)\b/.test(expMain);
  const expTagNeg = /\b(dont|doesnt|didnt|cant|wont|shouldnt|isnt|arent|wasnt|werent|not)\b/.test(expTag);
  if (expMainNeg === expTagNeg) return null;
  return {
    tag: 'vi_l1_tag_polarity',
    replacements: { FIX: rawExpected },
  };
};

/** 59. "the" before an abstract / generic noun that should be bare — A2. */
const ruleNoArticleGeneric: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  for (let i = 0; i + 1 < userTokens.length; i++) {
    if (userTokens[i] !== 'the') continue;
    const noun = userTokens[i + 1];
    if (!ABSTRACT_GENERIC_NOUNS.has(noun)) continue;
    // Expected must have the noun WITHOUT preceding "the".
    const idx = expectedTokens.indexOf(noun);
    if (idx < 0) continue;
    if (idx > 0 && expectedTokens[idx - 1] === 'the') continue;
    return {
      tag: 'vi_l1_no_article_generic',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 60. Missing "the" before a superlative — A2. */
const ruleSuperlativeThe: Rule = ({ userTokens, expectedTokens, rawExpected }) => {
  for (let i = 0; i < userTokens.length; i++) {
    const w = userTokens[i];
    const isSuper =
      IRREGULAR_SUPERLATIVES.has(w) ||
      isRegularSuperlative(w) ||
      (w === 'most' && i + 1 < userTokens.length && userTokens[i + 1] !== 'of');
    if (!isSuper) continue;
    // If user already has "the" (or "my / her / his / their") before, skip.
    if (i > 0) {
      const prev = userTokens[i - 1];
      if (['the', 'my', 'his', 'her', 'your', 'our', 'their'].includes(prev)) continue;
    }
    // Expected must include "the <super>".
    const expIdx = expectedTokens.indexOf(w);
    if (expIdx <= 0) continue;
    if (expectedTokens[expIdx - 1] !== 'the') continue;
    return {
      tag: 'vi_l1_superlative_the',
      replacements: { FIX: rawExpected },
    };
  }
  return null;
};

/** 61. "If + subject + will" → present simple in the if-clause — B1. */
const ruleIfWill: Rule = ({ userText, expectedText, rawExpected }) => {
  const userLower = userText.toLowerCase();
  const expectedLower = expectedText.toLowerCase();
  if (!/\bif\s+(i|he|she|we|they|you|it)\s+will\s+\w+/.test(userLower)) return null;
  // Expected has "if + subject + (present simple)" (no "will" in the
  // if-clause). Conservative test: expected has "if + subject" NOT followed
  // by "will" within 2 tokens.
  const m = /\bif\s+(i|he|she|we|they|you|it)\s+(\w+)/.exec(expectedLower);
  if (!m) return null;
  if (m[2] === 'will') return null;
  return {
    tag: 'vi_l1_if_will',
    replacements: { FIX: rawExpected },
  };
};

// ────────────────────────────────────────────────────────────────────────────
// Registry — fixed priority order. First match wins.
// ────────────────────────────────────────────────────────────────────────────

const RULE_REGISTRY: Rule[] = [
  ruleThirdPersonS,          // 1
  rulePastEd,                // 2
  rulePluralS,               // 3
  // 30 runs BEFORE 4 so "the cake eaten" → "the cake was eaten" lands
  // on passive-voice feedback instead of generic missing-be.
  rulePassiveMissingBe,      // 30
  ruleMissingBe,             // 4
  ruleQuestionNoAux,         // 5
  // 35 + 36 run BEFORE 6 + 9 so specific by/with and time-preposition
  // patterns win over the general "missing article" / "preposition swap"
  // rules when there's an overlap.
  ruleByVsWith,              // 35
  ruleTimeExpressions,       // 36
  // Round 5: run geographical-article + superlative-the before the
  // generic missing_article so learners get the more specific teaching
  // message when both rules could fire.
  ruleGeographicalArticle,   // 47
  ruleSuperlativeThe,        // 60
  ruleMissingArticle,        // 6
  rulePossessiveGender,      // 8
  rulePrepositionTransfer,   // 9
  ruleCountable,             // 10
  ruleToVerbConfusion,       // 11
  ruleCanNoInfinitive,       // 12
  ruleDoublePast,            // 13
  rulePossessiveSMissing,    // 14
  ruleComparativeDouble,     // 15
  ruleAdjectiveOrder,        // 16
  ruleVeryMuchPlacement,     // 17
  ruleThereAreSingular,      // 18
  ruleEveryonePlural,        // 19
  ruleMakeVsDo,              // 20
  ruleTagQuestion,           // 21
  rulePastPerfectMissing,    // 22
  ruleReportedSpeech,        // 23
  ruleConditionalMix,        // 28
  ruleToInfinitiveAfterIng,  // 29
  ruleReflexiveMissing,      // 27
  ruleUsedToVsBeUsedTo,      // 32
  ruleRelativePronoun,       // 31
  ruleSomeVsAny,             // 26
  ruleCountableMuch,         // 25
  ruleSinceVsFor,            // 24
  ruleAnotherVsOther,        // 33
  ruleLookSeeWatch,          // 34

  // ── Round 5 additions (rules 37–61). Placed after the v1.2 block so
  //    existing feedback strings keep winning on shared patterns. Within
  //    the new block: structural / morphological patterns (more specific)
  //    run before usage / agreement patterns.
  rulePresentPerfectVsPast,  // 37
  ruleSubjunctiveWere,       // 38
  ruleEmbeddedQuestionOrder, // 39
  ruleDoSupport3ps,          // 40
  ruleSubjectRelativeOmit,   // 41
  ruleGerundAfterVerb,       // 42
  ruleModalPerfect,          // 43
  rulePhrasalPronounOrder,   // 44
  ruleComparativeMoreLong,   // 45
  ruleManyWithUncount,       // 46
  ruleNegativeInversion,     // 50 — run before 51 (adverb before subject)
  ruleAdverbBeforeSubject,   // 51
  ruleMakeLetBare,           // 52
  ruleTooVsVery,             // 53
  ruleAvsAnVowel,            // 54
  ruleOneOfTheSingular,      // 55
  ruleEachSingular,          // 56
  ruleBeenVsGone,            // 57
  ruleTagPolarity,           // 58
  // ruleGeographicalArticle and ruleSuperlativeThe are registered
  // higher up (before ruleMissingArticle) so their specific feedback
  // wins over the generic missing-article message.
  ruleNoArticleGeneric,      // 59
  ruleIfWill,                // 61
  ruleGenericPlural,         // 48 — last: loses to plural_s (existing) by design
  ruleDoubleNegative,        // 49 — last among A2 structural
];

// ────────────────────────────────────────────────────────────────────────────
// Public entry point
// ────────────────────────────────────────────────────────────────────────────

export function detectL1Error(input: L1DetectionInput): L1DetectionResult {
  const rawUser = String(input.userAnswer ?? '').trim();
  const rawExpected = String(input.expectedAnswer ?? '').trim();
  const ctx = input.questionContext ?? {};

  if (!rawUser || !rawExpected) {
    return { matched: false, weaknessTag: null, feedback: null };
  }

  // Normalise common contractions so tokenizer doesn't split "didn't" into
  // ["didn", "t"]. Applied once at entry — every rule sees the same shape.
  const userText = normalizeContractions(rawUser);
  const expectedText = normalizeContractions(rawExpected);

  if (userText.toLowerCase() === expectedText.toLowerCase()) {
    return { matched: false, weaknessTag: null, feedback: null };
  }

  const userTokens = tokenize(userText);
  const expectedTokens = tokenize(expectedText);

  for (const rule of RULE_REGISTRY) {
    const hit = rule({
      userTokens,
      expectedTokens,
      userText,
      expectedText,
      rawUser,
      rawExpected,
      ctx,
    });
    if (hit) {
      return {
        matched: true,
        weaknessTag: hit.tag,
        feedback: fillTemplate(RULE_STRINGS[hit.tag], hit.replacements),
      };
    }
  }
  return { matched: false, weaknessTag: null, feedback: null };
}
