/**
 * Stage 3A — Learner-Language Taxonomy.
 *
 * Engineer-tag → learner-language bilingual descriptions.
 *
 * The detector / placement / pronunciation layers speak in stable
 * machine identifiers (e.g. `vi_l1_3rd_person_s`, `final-ed`,
 * `r_l_w_position_confusion`). This module is the single source of
 * truth for turning those identifiers into short, kind, bilingual
 * copy that a Vietnamese learner of English can actually read.
 *
 * Design constraints (per dispatch):
 *   - Vietnamese-first (the reader is a VN-L1 English learner).
 *   - `shortVi` / `shortEn` are at most 12 words — they fit a chip /
 *     row title at 375px mobile width.
 *   - No shame-language. Patterns are framed as "you're still working
 *     on this", never "your weakness is …".
 *   - Unknown tags fall back to a generic, honest description —
 *     never throw. The Stage 3A read-path stays resilient when an
 *     upstream detector adds a new tag before this catalog ships an
 *     entry.
 *
 * Scope:
 *   - All 65 L1 detector tags (`L1WeaknessTag` union in
 *     `src/lib/feedback/l1-error-detector.ts`).
 *   - 6 pronunciation pain-point axes from `vn-phoneme-map.ts`
 *     (TH_T / R_L / ED_ENDINGS / S_PLURALS / STRESS / INTONATION).
 *   - Common `profiles.placement_weaknesses` tag-space — the 37
 *     `VN_L1_INTERFERENCE_PATTERNS[].id` strings emitted by
 *     placement-v3-session core, plus the legacy v1 vi_l1_* aliases.
 *
 * Consumers:
 *   - Day 4 Stage 3A "What I'm Weak At" UI — Local Weakness Map row
 *     copy, low-confidence chip context, empty-state messaging.
 */

import type { L1WeaknessTag } from "../feedback/l1-error-detector.js";

export type Severity = "low" | "medium" | "high";

export interface LearnerLanguage {
  /** Learner-friendly Vietnamese label or single sentence. ≤12 words. */
  shortVi: string;
  /** Learner-friendly English label or single sentence. ≤12 words. */
  shortEn: string;
  /** Optional concrete example sentence in Vietnamese. */
  exampleVi?: string;
  /** Optional concrete example sentence in English. */
  exampleEn?: string;
  severity: Severity;
}

// ──────────────────────────────────────────────────────────────────────────
// Fallback for unknown tags.
//
// Public describe* functions never throw. Unknown identifiers return this
// generic-but-honest entry so a row can still render kindly.
// ──────────────────────────────────────────────────────────────────────────

const FALLBACK: LearnerLanguage = {
  shortVi: "Một mẫu câu bạn còn đang luyện.",
  shortEn: "A pattern you're still working on.",
  severity: "low",
};

// ──────────────────────────────────────────────────────────────────────────
// L1 detector tag descriptions.
//
// Exhaustive `Record<L1WeaknessTag, …>` — TypeScript enforces that every
// tag in the detector's union has an entry. Adding a new tag to the
// detector without a description here is a compile error.
// ──────────────────────────────────────────────────────────────────────────

export const L1_DESCRIPTIONS: Record<L1WeaknessTag, LearnerLanguage> = {
  vi_l1_3rd_person_s: {
    shortVi: "Hay quên thêm -s sau he, she, it.",
    shortEn: "You often skip -s after he, she, it.",
    exampleVi: "She go to school → She goes to school.",
    exampleEn: "She goes to school every day.",
    severity: "high",
  },
  vi_l1_past_ed: {
    shortVi: "Hay quên -ed cho thì quá khứ.",
    shortEn: "You often skip -ed for past actions.",
    exampleVi: "Yesterday I work → Yesterday I worked.",
    exampleEn: "Yesterday I worked late.",
    severity: "high",
  },
  vi_l1_plural_s: {
    shortVi: "Hay quên -s cho danh từ số nhiều.",
    shortEn: "You often skip -s on plural nouns.",
    exampleVi: "two book → two books.",
    exampleEn: "I have two books.",
    severity: "high",
  },
  vi_l1_missing_be: {
    shortVi: "Hay quên động từ to be (am / is / are).",
    shortEn: "You sometimes drop am, is, are.",
    exampleVi: "She happy → She is happy.",
    exampleEn: "She is happy.",
    severity: "high",
  },
  vi_l1_question_no_aux: {
    shortVi: "Câu hỏi cần trợ động từ do / does / did.",
    shortEn: "Questions need do, does, or did up front.",
    exampleVi: "You like coffee? → Do you like coffee?",
    exampleEn: "Do you like coffee?",
    severity: "medium",
  },
  vi_l1_missing_article: {
    shortVi: "Hay quên mạo từ a, an, the.",
    shortEn: "You sometimes drop a, an, the.",
    exampleVi: "I bought book → I bought a book.",
    exampleEn: "I bought a book yesterday.",
    severity: "medium",
  },
  vi_l1_possessive_gender: {
    shortVi: "His và her phải theo giới của chủ sở hữu.",
    shortEn: "His and her match the owner's gender.",
    exampleVi: "My sister and his book → her book.",
    exampleEn: "My sister and her book.",
    severity: "medium",
  },
  vi_l1_preposition_transfer: {
    shortVi: "Chọn giới từ in / on / at cho đúng ngữ cảnh.",
    shortEn: "Pick the right preposition: in, on, at.",
    exampleVi: "in Monday → on Monday.",
    exampleEn: "I work on Monday.",
    severity: "medium",
  },
  vi_l1_countable: {
    shortVi: "Phân biệt danh từ đếm được và không đếm được.",
    shortEn: "Some nouns count one-by-one, some don't.",
    exampleVi: "many information → much information.",
    exampleEn: "I need a lot of information.",
    severity: "medium",
  },
  vi_l1_to_verb_confusion: {
    shortVi: "Sau một số động từ là to + động từ nguyên mẫu.",
    shortEn: "After some verbs you need to + verb.",
    exampleVi: "I want eat → I want to eat.",
    exampleEn: "I want to eat dinner.",
    severity: "medium",
  },
  vi_l1_can_no_infinitive: {
    shortVi: "Sau can là động từ nguyên mẫu, không to.",
    shortEn: "After can use the bare verb, no to.",
    exampleVi: "I can to swim → I can swim.",
    exampleEn: "I can swim well.",
    severity: "medium",
  },
  vi_l1_double_past: {
    shortVi: "Một câu chỉ cần một dấu hiệu quá khứ.",
    shortEn: "One past marker per clause is enough.",
    exampleVi: "I did went → I went.",
    exampleEn: "I went home early.",
    severity: "medium",
  },
  vi_l1_possessive_s_missing: {
    shortVi: "Sở hữu của người thêm 's vào tên.",
    shortEn: "Add 's to show who owns something.",
    exampleVi: "Mary book → Mary's book.",
    exampleEn: "Mary's book is on the desk.",
    severity: "medium",
  },
  vi_l1_comparative_double: {
    shortVi: "So sánh hơn: chọn -er hoặc more, không cả hai.",
    shortEn: "Use -er or more, not both at once.",
    exampleVi: "more bigger → bigger.",
    exampleEn: "This room is bigger.",
    severity: "low",
  },
  vi_l1_adjective_order: {
    shortVi: "Trật tự tính từ tiếng Anh: ý kiến, kích cỡ, màu.",
    shortEn: "English adjective order: opinion, size, then colour.",
    exampleVi: "a red big car → a big red car.",
    exampleEn: "She has a big red car.",
    severity: "low",
  },
  vi_l1_very_much_placement: {
    shortVi: "Very đi trước tính từ; much đi với động từ.",
    shortEn: "Very pairs with adjectives, much with verbs.",
    exampleVi: "I very like → I like it very much.",
    exampleEn: "I like it very much.",
    severity: "medium",
  },
  vi_l1_there_are_singular: {
    shortVi: "Số ít dùng there is, số nhiều there are.",
    shortEn: "Use there is for one, there are for many.",
    exampleVi: "There is two chairs → There are two chairs.",
    exampleEn: "There are two chairs in the room.",
    severity: "medium",
  },
  vi_l1_everyone_plural: {
    shortVi: "Everyone, somebody là số ít — động từ thêm -s.",
    shortEn: "Everyone, somebody take a singular verb.",
    exampleVi: "Everyone are happy → Everyone is happy.",
    exampleEn: "Everyone is happy today.",
    severity: "medium",
  },
  vi_l1_make_vs_do: {
    shortVi: "Make tạo ra; do là thực hiện việc gì đó.",
    shortEn: "Make creates a thing; do performs a task.",
    exampleVi: "do a cake → make a cake.",
    exampleEn: "I make breakfast every morning.",
    severity: "medium",
  },
  vi_l1_tag_question: {
    shortVi: "Câu hỏi đuôi đảo dấu so với câu chính.",
    shortEn: "Tag questions flip the main-clause polarity.",
    exampleVi: "You are tired, are you? → aren't you?",
    exampleEn: "You are tired, aren't you?",
    severity: "low",
  },
  vi_l1_past_perfect_missing: {
    shortVi: "Việc xảy ra trước trong quá khứ dùng had + V3.",
    shortEn: "For an earlier past event use had + past participle.",
    exampleVi: "When I arrived he left → he had left.",
    exampleEn: "When I arrived he had already left.",
    severity: "medium",
  },
  vi_l1_reported_speech: {
    shortVi: "Tường thuật lùi một bậc thì so với gốc.",
    shortEn: "Reported speech shifts the tense back one step.",
    exampleEn: "He said he was tired.",
    severity: "medium",
  },
  vi_l1_since_vs_for: {
    shortVi: "Since đi với mốc; for đi với khoảng thời gian.",
    shortEn: "Since takes a point in time; for takes a duration.",
    exampleVi: "since two years → for two years.",
    exampleEn: "I have lived here for two years.",
    severity: "medium",
  },
  vi_l1_countable_much: {
    shortVi: "Much đi với danh từ không đếm được.",
    shortEn: "Much goes with uncountable nouns only.",
    exampleVi: "much books → many books.",
    exampleEn: "I have many books at home.",
    severity: "medium",
  },
  vi_l1_some_vs_any: {
    shortVi: "Some cho câu khẳng định; any cho phủ định, hỏi.",
    shortEn: "Some for positive; any for questions and negatives.",
    exampleVi: "I don't have some money → any money.",
    exampleEn: "I don't have any money.",
    severity: "medium",
  },
  vi_l1_reflexive_missing: {
    shortVi: "Tự làm gì đó cần đại từ phản thân myself.",
    shortEn: "Action turned on yourself takes myself, yourself.",
    exampleVi: "I cut me → I cut myself.",
    exampleEn: "I cut myself by accident.",
    severity: "low",
  },
  vi_l1_conditional_mix: {
    shortVi: "Câu điều kiện loại 2 dùng would + nguyên mẫu.",
    shortEn: "Second conditional pairs if + past with would.",
    exampleVi: "If I have money, I will buy → I would buy.",
    exampleEn: "If I had money, I would buy a car.",
    severity: "medium",
  },
  vi_l1_to_infinitive_after_ing: {
    shortVi: "Sau enjoy, finish dùng V-ing, không to + V.",
    shortEn: "After enjoy, finish use -ing, not to + verb.",
    exampleVi: "I enjoy to read → I enjoy reading.",
    exampleEn: "I enjoy reading at night.",
    severity: "medium",
  },
  vi_l1_passive_missing_be: {
    shortVi: "Câu bị động cần be + V3.",
    shortEn: "Passive needs a form of be plus past participle.",
    exampleVi: "The book written by him → was written.",
    exampleEn: "The book was written by him.",
    severity: "medium",
  },
  vi_l1_relative_pronoun: {
    shortVi: "Người dùng who; vật dùng which / that.",
    shortEn: "Use who for people, which or that for things.",
    exampleVi: "the man which lives → who lives.",
    exampleEn: "The man who lives next door is kind.",
    severity: "medium",
  },
  vi_l1_used_to_vs_be_used_to: {
    shortVi: "Used to nói thói quen cũ; be used to nói đã quen.",
    shortEn: "Used to = past habit; be used to = now familiar.",
    exampleVi: "I used to live → I am used to living.",
    exampleEn: "I am used to living here.",
    severity: "medium",
  },
  vi_l1_another_vs_other: {
    shortVi: "Another đi với số ít; other với số nhiều.",
    shortEn: "Another for singular, other for plural.",
    exampleVi: "another books → other books.",
    exampleEn: "I want to read other books.",
    severity: "low",
  },
  vi_l1_look_vs_see_vs_watch: {
    shortVi: "See nhìn thấy; look nhìn vào; watch xem theo dõi.",
    shortEn: "See, look, watch all map to nhìn / xem.",
    exampleVi: "I see TV → I watch TV.",
    exampleEn: "I watch TV in the evening.",
    severity: "low",
  },
  vi_l1_by_vs_with: {
    shortVi: "By cho phương tiện; with cho công cụ.",
    shortEn: "By for transport, with for tools.",
    exampleVi: "cut with a knife — correct; go with bus → by bus.",
    exampleEn: "I go to work by bus.",
    severity: "medium",
  },
  vi_l1_time_expressions: {
    shortVi: "Tiếng Anh để trạng từ thời gian cuối câu.",
    shortEn: "Time expressions usually sit at the end.",
    exampleVi: "Yesterday I work late — ok; verb still needs -ed.",
    exampleEn: "I worked late yesterday.",
    severity: "low",
  },
  vi_l1_present_perfect_vs_past: {
    shortVi: "Đã có kinh nghiệm dùng have + V3, không quá khứ đơn.",
    shortEn: "For lifetime experience use have + past participle.",
    exampleVi: "I ate sushi before → I have eaten sushi.",
    exampleEn: "I have eaten sushi before.",
    severity: "medium",
  },
  vi_l1_subjunctive_were: {
    shortVi: "Điều kiện không thật dùng were cho mọi ngôi.",
    shortEn: "For unreal conditions use were for every subject.",
    exampleVi: "If I was you → If I were you.",
    exampleEn: "If I were you, I would rest.",
    severity: "low",
  },
  vi_l1_embedded_question_order: {
    shortVi: "Câu hỏi lồng giữ trật tự khẳng định, không đảo.",
    shortEn: "Embedded questions keep statement word order.",
    exampleVi: "I don't know where is he → where he is.",
    exampleEn: "I don't know where he is.",
    severity: "medium",
  },
  vi_l1_do_support_3ps: {
    shortVi: "Phủ định ngôi 3 số ít dùng doesn't + nguyên mẫu.",
    shortEn: "Negative for he, she, it uses doesn't + base verb.",
    exampleVi: "He don't like → He doesn't like.",
    exampleEn: "He doesn't like spicy food.",
    severity: "high",
  },
  vi_l1_subject_relative_omit: {
    shortVi: "Mệnh đề quan hệ chủ ngữ phải giữ who hoặc that.",
    shortEn: "Subject relative clauses keep who or that.",
    exampleVi: "The man lives next door → who lives next door.",
    exampleEn: "The man who lives next door is kind.",
    severity: "medium",
  },
  vi_l1_gerund_after_verb: {
    shortVi: "Sau avoid, suggest, mind dùng V-ing.",
    shortEn: "After avoid, suggest, mind use -ing.",
    exampleVi: "I avoid to eat → I avoid eating.",
    exampleEn: "I avoid eating late at night.",
    severity: "medium",
  },
  vi_l1_modal_perfect: {
    shortVi: "Suy đoán quá khứ dùng must / could have + V3.",
    shortEn: "Past speculation uses must have or could have.",
    exampleVi: "He must forgot → He must have forgotten.",
    exampleEn: "He must have forgotten the meeting.",
    severity: "medium",
  },
  vi_l1_phrasal_pronoun_order: {
    shortVi: "Phrasal verb với đại từ: đại từ đứng giữa.",
    shortEn: "With pronouns, phrasal verbs split around them.",
    exampleVi: "turn on it → turn it on.",
    exampleEn: "Please turn it on.",
    severity: "medium",
  },
  vi_l1_comparative_more_long: {
    shortVi: "Tính từ dài dùng more; tính từ ngắn dùng -er.",
    shortEn: "Long adjectives take more; short take -er.",
    exampleVi: "more big → bigger.",
    exampleEn: "This box is bigger than that one.",
    severity: "medium",
  },
  vi_l1_many_with_uncount: {
    shortVi: "Many đi với danh từ đếm được số nhiều.",
    shortEn: "Many goes with countable plurals only.",
    exampleVi: "many water → much water.",
    exampleEn: "I drink a lot of water.",
    severity: "medium",
  },
  vi_l1_geographical_article: {
    shortVi: "Tên quốc gia số ít không có the; châu lục cũng vậy.",
    shortEn: "Most country names take no article.",
    exampleVi: "the Vietnam → Vietnam.",
    exampleEn: "Vietnam is a beautiful country.",
    severity: "low",
  },
  vi_l1_generic_plural: {
    shortVi: "Nói chung chung dùng danh từ số nhiều, không the.",
    shortEn: "For general truths use bare plural, no the.",
    exampleVi: "I love the music → I love music.",
    exampleEn: "I love music.",
    severity: "medium",
  },
  vi_l1_double_negative: {
    shortVi: "Một câu tiếng Anh chỉ cần một phủ định.",
    shortEn: "One negative per clause is enough.",
    exampleVi: "I don't know nothing → I don't know anything.",
    exampleEn: "I don't know anything about it.",
    severity: "medium",
  },
  vi_l1_negative_inversion: {
    shortVi: "Trạng ngữ phủ định ở đầu câu đảo trợ động từ.",
    shortEn: "Negative adverb up front triggers inversion.",
    exampleVi: "Never I have seen → Never have I seen.",
    exampleEn: "Never have I seen such a sight.",
    severity: "low",
  },
  vi_l1_adverb_before_subject: {
    shortVi: "Trạng từ tần suất đứng giữa chủ ngữ và động từ.",
    shortEn: "Frequency adverbs sit between subject and verb.",
    exampleVi: "Always I go → I always go.",
    exampleEn: "I always go to bed early.",
    severity: "low",
  },
  vi_l1_make_let_bare: {
    shortVi: "Sau make, let dùng động từ nguyên mẫu, không to.",
    shortEn: "After make and let use the bare verb.",
    exampleVi: "He made me to wait → made me wait.",
    exampleEn: "He made me wait an hour.",
    severity: "medium",
  },
  vi_l1_too_vs_very: {
    shortVi: "Too mang nghĩa quá; very chỉ là rất.",
    shortEn: "Too means excess; very is just intensifier.",
    exampleVi: "This is too good — sounds negative; use very good.",
    exampleEn: "This coffee is very good.",
    severity: "medium",
  },
  vi_l1_a_vs_an_vowel: {
    shortVi: "Trước âm nguyên âm dùng an, không a.",
    shortEn: "Use an before a vowel sound, not a.",
    exampleVi: "a apple → an apple.",
    exampleEn: "I ate an apple.",
    severity: "low",
  },
  vi_l1_one_of_the_singular: {
    shortVi: "One of the + số nhiều + động từ số ít.",
    shortEn: "One of the + plural noun + singular verb.",
    exampleVi: "One of the boys are → One of the boys is.",
    exampleEn: "One of the boys is sick.",
    severity: "medium",
  },
  vi_l1_each_singular: {
    shortVi: "Each, every đi với động từ số ít.",
    shortEn: "Each and every take a singular verb.",
    exampleVi: "Each student have → Each student has.",
    exampleEn: "Each student has a book.",
    severity: "medium",
  },
  vi_l1_been_vs_gone: {
    shortVi: "Been là đã đi và đã về; gone là chưa quay lại.",
    shortEn: "Been means visited; gone means still away.",
    exampleVi: "She has gone to Paris (nay vẫn ở đó); has been (đã về).",
    exampleEn: "She has been to Paris.",
    severity: "low",
  },
  vi_l1_tag_polarity: {
    shortVi: "Câu khẳng định ⇒ tag phủ định; ngược lại tương tự.",
    shortEn: "Positive clause takes a negative tag, and vice versa.",
    exampleVi: "You are tired, are you → aren't you.",
    exampleEn: "You are tired, aren't you?",
    severity: "low",
  },
  vi_l1_no_article_generic: {
    shortVi: "Nói chung chung không có the.",
    shortEn: "General truths take no article.",
    exampleVi: "the life is hard → Life is hard.",
    exampleEn: "Life is hard sometimes.",
    severity: "medium",
  },
  vi_l1_superlative_the: {
    shortVi: "So sánh nhất cần the trước tính từ.",
    shortEn: "Superlatives need the in front.",
    exampleVi: "He is best → He is the best.",
    exampleEn: "He is the best student.",
    severity: "medium",
  },
  vi_l1_if_will: {
    shortVi: "Trong if dùng hiện tại, không will.",
    shortEn: "In the if-clause use present, not will.",
    exampleVi: "If it will rain → If it rains.",
    exampleEn: "If it rains, I will stay home.",
    severity: "medium",
  },
  vi_l1_no_aux_negation: {
    shortVi: "Phủ định cần don't, doesn't, didn't.",
    shortEn: "Negatives need don't, doesn't, or didn't.",
    exampleVi: "I no like → I don't like.",
    exampleEn: "I don't like spicy food.",
    severity: "high",
  },
  vi_l1_future_adverb_bare: {
    shortVi: "Tương lai cần will hoặc be going to, dù có ngày mai.",
    shortEn: "Future still needs will or be going to.",
    exampleVi: "Tomorrow I go → Tomorrow I will go.",
    exampleEn: "Tomorrow I will go shopping.",
    severity: "medium",
  },
  vi_l1_co_transfer: {
    shortVi: "Có trong tiếng Việt dịch sang have hoặc there is.",
    shortEn: "Vietnamese có maps to have or there is.",
    exampleVi: "have many people here → there are many people.",
    exampleEn: "There are many people here.",
    severity: "medium",
  },
  vi_l1_topic_comment_fronting: {
    shortVi: "Tiếng Anh thường giữ chủ ngữ ở đầu, không đảo chủ đề.",
    shortEn: "English keeps the subject up front, not the topic.",
    exampleVi: "This book I like — sounds odd → I like this book.",
    exampleEn: "I like this book.",
    severity: "low",
  },
  vi_l1_subject_gender: {
    shortVi: "Câu sau cần he hoặc she nhất quán với người đã nói.",
    shortEn: "Keep he or she consistent across sentences.",
    exampleVi: "My sister is here. He is tired → She is tired.",
    exampleEn: "My sister is here. She is tired.",
    severity: "medium",
  },
  vi_l1_profession_article_copula: {
    shortVi: "Nghề nghiệp cần be và a/an.",
    shortEn: "Jobs need be plus a or an.",
    exampleVi: "She teacher → She is a teacher.",
    exampleEn: "She is a teacher.",
    severity: "medium",
  },
  vi_l1_progressive_be_drop: {
    shortVi: "Thì tiếp diễn cần am, is, are.",
    shortEn: "Progressive verbs need am, is, are.",
    exampleVi: "I going → I am going.",
    exampleEn: "I am going to school.",
    severity: "high",
  },
  vi_l1_definite_article_remention: {
    shortVi: "Nhắc lại vật đã biết thường dùng the.",
    shortEn: "Known second mentions often need the.",
    exampleVi: "I read a book. Book → The book.",
    exampleEn: "The book is interesting.",
    severity: "medium",
  },
  vi_l1_noun_preposition_collocation: {
    shortVi: "Một số danh từ đi với giới từ cố định.",
    shortEn: "Some nouns take fixed prepositions.",
    exampleVi: "reason of → reason for.",
    exampleEn: "The reason for this problem.",
    severity: "low",
  },
  vi_l1_say_tell_argument_frame: {
    shortVi: "Say, tell, talk cần đúng khung tân ngữ.",
    shortEn: "Say, tell, talk need the right object frame.",
    exampleVi: "say me → tell me.",
    exampleEn: "She told me the truth.",
    severity: "medium",
  },
  vi_l1_learn_study_transfer: {
    shortVi: "Học có thể là learn, study, practice.",
    shortEn: "Học can mean learn, study, or practice.",
    exampleVi: "study how to cook → learn how to cook.",
    exampleEn: "I learn how to cook.",
    severity: "low",
  },
  vi_l1_know_meet_timeline: {
    shortVi: "Gặp lần đầu dùng met, không knew.",
    shortEn: "First meetings use met, not knew.",
    exampleVi: "I knew him yesterday → I met him yesterday.",
    exampleEn: "I met him yesterday.",
    severity: "medium",
  },
  vi_l1_verb_noun_collocation: {
    shortVi: "Thuốc đi với take medicine.",
    shortEn: "Medicine goes with take medicine.",
    exampleVi: "eat medicine → take medicine.",
    exampleEn: "I take medicine.",
    severity: "medium",
  },
  vi_l1_appliance_open_close_transfer: {
    shortVi: "Thiết bị điện dùng turn on/off.",
    shortEn: "Appliances use turn on or off.",
    exampleVi: "open the light → turn on the light.",
    exampleEn: "Turn on the light.",
    severity: "medium",
  },
  vi_l1_connector_stacking: {
    shortVi: "Không ghép because-so hoặc although-but.",
    shortEn: "Avoid because-so and although-but pairs.",
    exampleVi: "Because..., so... → Because....",
    exampleEn: "Because it rained, I stayed home.",
    severity: "medium",
  },
  vi_l1_elliptical_subject_transfer: {
    shortVi: "Mệnh đề tiếng Anh cần chủ ngữ rõ.",
    shortEn: "English clauses need clear subjects.",
    exampleVi: "Because busy → Because I was busy.",
    exampleEn: "Because I was busy.",
    severity: "high",
  },
};

// ──────────────────────────────────────────────────────────────────────────
// Phoneme axis descriptions.
//
// Axis identifiers mirror the `PROBLEM_PAIRS_*` constant suffixes in
// `vn-phoneme-map.ts`. The describePhonemeAxis() accessor is
// case-insensitive on the axis key.
// ──────────────────────────────────────────────────────────────────────────

export const PHONEME_AXIS_KEYS = [
  "TH_T",
  "R_L",
  "ED_ENDINGS",
  "S_PLURALS",
  "STRESS",
  "INTONATION",
] as const;

export type PhonemeAxisKey = (typeof PHONEME_AXIS_KEYS)[number];

export const PHONEME_DESCRIPTIONS: Record<PhonemeAxisKey, LearnerLanguage> = {
  TH_T: {
    shortVi: "Âm th tiếng Anh hay bị nhầm thành t.",
    shortEn: "The English th often comes out as t.",
    exampleVi: "three nghe thành tree.",
    exampleEn: "three vs tree",
    severity: "high",
  },
  R_L: {
    shortVi: "Âm r và l tiếng Anh hay bị trộn lẫn.",
    shortEn: "English r and l often blend together.",
    exampleVi: "rice nghe thành lice.",
    exampleEn: "rice vs lice",
    severity: "high",
  },
  ED_ENDINGS: {
    shortVi: "Đuôi -ed quá khứ hay bị nuốt mất.",
    shortEn: "The past-tense -ed ending often gets dropped.",
    exampleVi: "worked nghe thành work.",
    exampleEn: "worked vs work",
    severity: "high",
  },
  S_PLURALS: {
    shortVi: "Đuôi -s số nhiều hay bị nuốt mất.",
    shortEn: "The plural -s ending often disappears.",
    exampleVi: "books nghe thành book.",
    exampleEn: "books vs book",
    severity: "high",
  },
  STRESS: {
    shortVi: "Trọng âm tiếng Anh đổi nghĩa của từ.",
    shortEn: "English stress can change the meaning.",
    exampleVi: "REcord (danh từ) khác reCORD (động từ).",
    exampleEn: "REcord (noun) vs reCORD (verb)",
    severity: "medium",
  },
  INTONATION: {
    shortVi: "Câu hỏi tiếng Anh cần ngữ điệu lên cao cuối câu.",
    shortEn: "English yes/no questions rise at the end.",
    exampleVi: "She is here? phát giọng đi lên.",
    exampleEn: "She is here? (rising)",
    severity: "medium",
  },
};

// ──────────────────────────────────────────────────────────────────────────
// Placement weakness tag descriptions.
//
// `profiles.placement_weaknesses` carries two flavours of identifier
// depending on which placement engine emitted the snapshot:
//   - v1 engine: a vi_l1_* tag (vi_l1_3rd_person_s, vi_l1_past_ed,
//     vi_l1_plural_s) — these resolve via L1_DESCRIPTIONS.
//   - v3 engine: a VN_L1_INTERFERENCE_PATTERNS[].id (e.g.
//     "th_stopping_and_fronting"). These resolve via the table below.
// describePlacementWeakness() dispatches between the two.
// ──────────────────────────────────────────────────────────────────────────

export const PLACEMENT_DESCRIPTIONS: Record<string, LearnerLanguage> = {
  // Phonology cluster
  final_consonant_cluster_reduction: {
    shortVi: "Hay nuốt nhóm phụ âm cuối từ trong tiếng Anh.",
    shortEn: "Final consonant clusters often get reduced.",
    exampleVi: "tests nghe thành tes.",
    exampleEn: "tests vs tes",
    severity: "high",
  },
  voiced_final_stop_devoicing: {
    shortVi: "Âm cuối có rung b, d, g hay bị mất rung.",
    shortEn: "Final voiced stops often lose their voicing.",
    exampleVi: "bag nghe thành back.",
    exampleEn: "bag vs back",
    severity: "medium",
  },
  th_stopping_and_fronting: {
    shortVi: "Âm th hay bị thay bằng t hoặc f.",
    shortEn: "th often becomes t or f.",
    exampleVi: "think nghe thành tink hoặc fink.",
    exampleEn: "think vs tink / fink",
    severity: "high",
  },
  inflectional_s_ed_inaudible: {
    shortVi: "Đuôi -s, -ed hay bị nuốt trong nói tự nhiên.",
    shortEn: "The -s and -ed endings often get swallowed.",
    exampleVi: "She walked nhanh nghe thành She walk.",
    exampleEn: "walked vs walk",
    severity: "high",
  },
  word_stress_even_timing: {
    shortVi: "Tiếng Anh nhấn một âm tiết, không đều.",
    shortEn: "English stresses one syllable per word.",
    exampleVi: "comPUter, không com-pu-ter đều nhau.",
    exampleEn: "comPUter (one stress)",
    severity: "medium",
  },
  diphthong_monophthong_reduction: {
    shortVi: "Nguyên âm đôi tiếng Anh hay bị rút thành đơn.",
    shortEn: "English diphthongs often flatten to one vowel.",
    exampleVi: "boat nghe thành bot.",
    exampleEn: "boat vs bot",
    severity: "medium",
  },
  r_l_w_position_confusion: {
    shortVi: "Âm r, l, w hay bị trộn theo vị trí.",
    shortEn: "r, l, and w get mixed up by position.",
    exampleVi: "very nghe thành vewy.",
    exampleEn: "very vs vewy",
    severity: "high",
  },
  flat_english_intonation: {
    shortVi: "Câu tiếng Anh hay được nói với ngữ điệu phẳng.",
    shortEn: "English sentences often come out too flat.",
    exampleVi: "Are you ok nghe như câu kể.",
    exampleEn: "Are you ok? (needs rising)",
    severity: "medium",
  },
  // Morphology + syntax cluster
  missing_subject_verb_agreement: {
    shortVi: "Động từ phải hợp với chủ ngữ về số và ngôi.",
    shortEn: "The verb has to match the subject.",
    exampleVi: "She go → She goes.",
    exampleEn: "She goes to school.",
    severity: "high",
  },
  past_tense_unmarked: {
    shortVi: "Hành động quá khứ cần dấu hiệu trên động từ.",
    shortEn: "Past actions need a past-tense verb form.",
    exampleVi: "I work yesterday → I worked.",
    exampleEn: "I worked yesterday.",
    severity: "high",
  },
  plural_s_omission: {
    shortVi: "Hay quên -s khi đếm nhiều hơn một.",
    shortEn: "You often skip -s for more than one.",
    exampleVi: "two book → two books.",
    exampleEn: "two books",
    severity: "high",
  },
  possessive_s_avoidance: {
    shortVi: "Sở hữu của người dùng 's, không of.",
    shortEn: "Person-owners take 's, not of.",
    exampleVi: "the book of Mary → Mary's book.",
    exampleEn: "Mary's book",
    severity: "medium",
  },
  comparative_superlative_mixing: {
    shortVi: "So sánh hơn dùng -er hoặc more, không cả hai.",
    shortEn: "Comparatives use -er or more, not both.",
    exampleVi: "more bigger → bigger.",
    exampleEn: "bigger",
    severity: "low",
  },
  modal_verb_inflection: {
    shortVi: "Sau modal là nguyên mẫu, không thêm -s hay -ed.",
    shortEn: "After modal verbs keep the bare verb.",
    exampleVi: "She can goes → She can go.",
    exampleEn: "She can go.",
    severity: "medium",
  },
  missing_articles: {
    shortVi: "Hay quên a, an, the trước danh từ.",
    shortEn: "Articles a, an, the are often dropped.",
    exampleVi: "I see cat → I see a cat.",
    exampleEn: "I see a cat.",
    severity: "medium",
  },
  copula_be_omission: {
    shortVi: "Câu mô tả cần am, is, are.",
    shortEn: "Descriptive sentences need am, is, or are.",
    exampleVi: "He happy → He is happy.",
    exampleEn: "He is happy.",
    severity: "high",
  },
  question_word_order_transfer: {
    shortVi: "Câu hỏi tiếng Anh thường đảo trợ động từ lên trước.",
    shortEn: "English questions front the helper verb.",
    exampleVi: "You like coffee? → Do you like coffee?",
    exampleEn: "Do you like coffee?",
    severity: "medium",
  },
  relative_clause_transfer: {
    shortVi: "Mệnh đề quan hệ cần who, which, that.",
    shortEn: "Relative clauses need who, which, or that.",
    exampleVi: "the man lives here → the man who lives here.",
    exampleEn: "the man who lives here",
    severity: "medium",
  },
  negation_no_not_placement: {
    shortVi: "Phủ định tiếng Anh cần don't, doesn't, didn't.",
    shortEn: "English negatives use don't, doesn't, didn't.",
    exampleVi: "I no go → I don't go.",
    exampleEn: "I don't go.",
    severity: "high",
  },
  there_is_co_transfer: {
    shortVi: "Có trong tiếng Việt dịch là there is hoặc have.",
    shortEn: "Vietnamese có maps to there is or have.",
    exampleVi: "Have many people here → There are many people.",
    exampleEn: "There are many people here.",
    severity: "medium",
  },
  topic_comment_fronting: {
    shortVi: "Tiếng Anh giữ chủ ngữ ở đầu, không đảo chủ đề.",
    shortEn: "English keeps the subject up front.",
    exampleVi: "This book I like → I like this book.",
    exampleEn: "I like this book.",
    severity: "low",
  },
  // Lexicon cluster
  literal_vietnamese_calques: {
    shortVi: "Dịch sát từng chữ từ tiếng Việt nghe không tự nhiên.",
    shortEn: "Word-for-word translation can sound unnatural.",
    exampleVi: "ăn cơm → eat rice (đôi khi chỉ là eat).",
    exampleEn: "have a meal (not always eat rice)",
    severity: "medium",
  },
  polysemy_one_vietnamese_many_english: {
    shortVi: "Một từ tiếng Việt có nhiều bản tiếng Anh khác nhau.",
    shortEn: "One Vietnamese word maps to several English ones.",
    exampleVi: "biết = know / can, tuỳ ngữ cảnh.",
    exampleEn: "know vs can",
    severity: "medium",
  },
  preposition_selection_transfer: {
    shortVi: "Chọn in / on / at đúng theo ngữ cảnh tiếng Anh.",
    shortEn: "Pick in, on, at by English context, not Vietnamese.",
    exampleVi: "in Monday → on Monday.",
    exampleEn: "on Monday",
    severity: "medium",
  },
  phrasal_verb_avoidance: {
    shortVi: "Tiếng Anh đời thường dùng phrasal verb rất nhiều.",
    shortEn: "Everyday English leans on phrasal verbs.",
    exampleVi: "investigate → look into.",
    exampleEn: "look into",
    severity: "medium",
  },
  false_friend_loanword_overreach: {
    shortVi: "Từ mượn nghe quen có thể đổi nghĩa trong tiếng Anh.",
    shortEn: "Loanwords can shift meaning in English.",
    exampleVi: "sentimental ≠ tình cảm trong mọi ngữ cảnh.",
    exampleEn: "sentimental ≠ tình cảm always",
    severity: "low",
  },
  idiom_literal_interpretation: {
    shortVi: "Thành ngữ Anh không dịch sát từng chữ.",
    shortEn: "English idioms aren't literal.",
    exampleVi: "It's raining cats and dogs ≠ mưa mèo chó.",
    exampleEn: "It's raining cats and dogs",
    severity: "low",
  },
  // Discourse cluster
  over_explicit_pronoun_reference: {
    shortVi: "Tiếng Anh dùng đại từ thay tên đã nhắc.",
    shortEn: "English uses pronouns for names already mentioned.",
    exampleVi: "Lặp Mary 5 lần → dùng she sau lần đầu.",
    exampleEn: "Mary said she would …",
    severity: "low",
  },
  topic_comment_paragraph_shape: {
    shortVi: "Đoạn văn tiếng Anh đặt ý chính lên đầu.",
    shortEn: "English paragraphs lead with the main point.",
    exampleVi: "Ý chính ở đầu, chi tiết theo sau.",
    exampleEn: "Topic sentence first, support after.",
    severity: "low",
  },
  connector_overuse_and_stacking: {
    shortVi: "Tiếng Anh thường chỉ dùng một liên từ mỗi mệnh đề.",
    shortEn: "English usually uses one connector per clause.",
    exampleVi: "Although … but … → Although ….",
    exampleEn: "Although it rained, I went.",
    severity: "low",
  },
  time_reference_overmarking: {
    shortVi: "Đã chia thì rồi không cần lặp lại đã, vẫn, rồi.",
    shortEn: "Once the tense is marked, don't repeat the time cue.",
    exampleVi: "Yesterday I have worked → Yesterday I worked.",
    exampleEn: "Yesterday I worked.",
    severity: "low",
  },
  indirect_main_point_delay: {
    shortVi: "Email tiếng Anh nên nói ý chính sớm.",
    shortEn: "English emails state the main point early.",
    exampleVi: "Mở đầu lịch sự ngắn, rồi vào ý.",
    exampleEn: "Open briefly, then the ask.",
    severity: "low",
  },
  // Pragmatics cluster
  direct_request_transfer: {
    shortVi: "Yêu cầu tiếng Anh kèm please và could you.",
    shortEn: "English requests soften with please / could you.",
    exampleVi: "Send me the file → Could you send me the file?",
    exampleEn: "Could you send me the file?",
    severity: "medium",
  },
  formality_calibration: {
    shortVi: "Chọn từ trang trọng đúng với tình huống.",
    shortEn: "Pick the register that fits the situation.",
    exampleVi: "Hi vs Dear theo người nhận.",
    exampleEn: "Hi vs Dear …",
    severity: "low",
  },
  apology_explanation_before_responsibility: {
    shortVi: "Xin lỗi tiếng Anh nhận trách nhiệm trước, giải thích sau.",
    shortEn: "English apologies own the action before explaining.",
    exampleVi: "I'm sorry I was late. Traffic was bad.",
    exampleEn: "I'm sorry I was late.",
    severity: "low",
  },
  refusal_softening_gap: {
    shortVi: "Từ chối tiếng Anh kèm cảm ơn và lời tiếc.",
    shortEn: "English refusals soften with thanks and regret.",
    exampleVi: "No → Thank you, but I can't this time.",
    exampleEn: "Thank you, but I can't this time.",
    severity: "low",
  },
  greeting_small_talk_transfer: {
    shortVi: "Mở đầu tiếng Anh bằng câu hỏi xã giao ngắn.",
    shortEn: "English opens with brief small-talk questions.",
    exampleVi: "How are you? rồi vào việc.",
    exampleEn: "How are you? Then the topic.",
    severity: "low",
  },
};

// ──────────────────────────────────────────────────────────────────────────
// Public accessors.
//
// All three accessors are total: an unknown identifier returns the
// neutral FALLBACK entry rather than throwing.
// ──────────────────────────────────────────────────────────────────────────

export function describeL1Tag(tag: L1WeaknessTag | string): LearnerLanguage {
  const entry = (L1_DESCRIPTIONS as Record<string, LearnerLanguage>)[tag];
  return entry ?? FALLBACK;
}

export function describePhonemeAxis(axis: string): LearnerLanguage {
  const key = axis.toUpperCase() as PhonemeAxisKey;
  return PHONEME_DESCRIPTIONS[key] ?? FALLBACK;
}

export function describePlacementWeakness(tag: string): LearnerLanguage {
  if (tag.startsWith("vi_l1_")) return describeL1Tag(tag);
  return PLACEMENT_DESCRIPTIONS[tag] ?? FALLBACK;
}
