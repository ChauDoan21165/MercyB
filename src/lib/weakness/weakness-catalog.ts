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
  | "vi_l1_tag_question"
  // L1 detector v3 expansion (CC1 feat/l1-rules-v3-expansion, 2026-04-24+)
  | "vi_l1_past_perfect_missing"
  | "vi_l1_reported_speech"
  | "vi_l1_since_vs_for"
  | "vi_l1_countable_much"
  | "vi_l1_some_vs_any"
  | "vi_l1_reflexive_missing"
  | "vi_l1_conditional_mix"
  | "vi_l1_to_infinitive_after_ing"
  | "vi_l1_passive_missing_be"
  | "vi_l1_relative_pronoun"
  | "vi_l1_used_to_vs_be_used_to"
  | "vi_l1_another_vs_other"
  | "vi_l1_look_vs_see_vs_watch"
  | "vi_l1_by_vs_with"
  | "vi_l1_time_expressions"
  // Round 5 — CC3 25-rule expansion (public IDs L1-036..L1-060).
  // CC4 will backfill Vietnamese strings for every entry in a
  // subsequent PR. English + example fields are CC3-owned and
  // should stay stable.
  | "vi_l1_present_perfect_vs_past"
  | "vi_l1_subjunctive_were"
  | "vi_l1_embedded_question_order"
  | "vi_l1_do_support_3ps"
  | "vi_l1_subject_relative_omit"
  | "vi_l1_gerund_after_verb"
  | "vi_l1_modal_perfect"
  | "vi_l1_phrasal_pronoun_order"
  | "vi_l1_comparative_more_long"
  | "vi_l1_many_with_uncount"
  | "vi_l1_geographical_article"
  | "vi_l1_generic_plural"
  | "vi_l1_double_negative"
  | "vi_l1_negative_inversion"
  | "vi_l1_adverb_before_subject"
  | "vi_l1_make_let_bare"
  | "vi_l1_too_vs_very"
  | "vi_l1_a_vs_an_vowel"
  | "vi_l1_one_of_the_singular"
  | "vi_l1_each_singular"
  | "vi_l1_been_vs_gone"
  | "vi_l1_tag_polarity"
  | "vi_l1_no_article_generic"
  | "vi_l1_superlative_the"
  | "vi_l1_if_will";

export type BilingualText = {
  /** English surface — may contain `**word**` markdown bolding. */
  en: string;
  /** Vietnamese surface — may contain `**word**` markdown bolding. */
  vi: string;
  /** Japanese-native English explanation — optional, for ja-native learners. */
  ja?: string;
  /** Indonesian-native English explanation — optional, for id-native learners. */
  id?: string;
  th?: string;};

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
      id: "Kesesuaian subjek-kata kerja",
    },
    longDescription: {
      en: "Vietnamese verbs don't change form for person. English adds **-s** to the verb when the subject is **he**, **she**, or **it**.",
      vi: "Động từ tiếng Việt không thay đổi theo ngôi. Trong tiếng Anh, động từ thêm **-s** khi chủ ngữ là **he**, **she**, **it**.",
      id: "Kata kerja bahasa Indonesia tidak berubah bentuk untuk orang. Bahasa Inggris menambahkan **-s** ke kata kerja saat subjeknya **he**, **she**, atau **it**.",
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
      id: "Past tense dengan **-ed**",
    },
    longDescription: {
      en: "Vietnamese shows past time with words like **hôm qua** or **đã** — the verb doesn't change. English changes the verb itself: **work → worked**.",
      vi: "Tiếng Việt diễn tả quá khứ bằng các từ như **hôm qua** hoặc **đã**, không đổi hình thức động từ. Tiếng Anh thay đổi chính động từ: **work → worked**.",
      id: "Bahasa Indonesia menunjukkan waktu lampau dengan kata seperti **kemarin** atau **sudah** — kata kerjanya tidak berubah. Bahasa Inggris mengubah kata kerjanya sendiri: **work → worked**.",
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
      id: "Kata benda jamak dengan **-s**",
    },
    longDescription: {
      en: "Vietnamese nouns don't change when counting more than one — markers like **các** or **những** do the work. English adds **-s** to most nouns when there's more than one: **book → books**.",
      vi: "Danh từ tiếng Việt không đổi khi đếm nhiều hơn một — dấu hiệu số nhiều nằm ở các từ như **các** hoặc **những**. Tiếng Anh thêm **-s** vào hầu hết danh từ khi số lượng nhiều hơn một: **book → books**.",
      id: "Kata benda bahasa Indonesia tidak berubah saat menghitung lebih dari satu — penanda seperti **para** atau **beberapa** yang melakukan tugas itu. Bahasa Inggris menambahkan **-s** ke sebagian besar kata benda saat jumlahnya lebih dari satu: **book → books**.",
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
      id: 'Kehilangan "to be"',
    },
    longDescription: {
      en: "Vietnamese often skips the **to be** verb — **Cô ấy giáo viên** is a complete sentence. English always needs one: **She is a teacher**.",
      vi: "Tiếng Việt mình hay bỏ động từ **to be** — **Cô ấy giáo viên** là đủ câu. Tiếng Anh luôn cần có: **She is a teacher**.",
      id: "Bahasa Indonesia sering melewatkan kata kerja **to be** — **Dia guru** adalah kalimat lengkap. Bahasa Inggris selalu membutuhkannya: **She is a teacher**.",
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
      id: "Struktur pertanyaan",
    },
    longDescription: {
      en: "Vietnamese turns a sentence into a question just with **phải không?** or a rising tone. English adds **do / does / did** at the front: **Do you like coffee?**",
      vi: "Tiếng Việt mình chỉ cần thêm **phải không?** hoặc đổi ngữ điệu là thành câu hỏi. Tiếng Anh phải đặt **do / does / did** ở đầu câu: **Do you like coffee?**",
      id: "Bahasa Indonesia mengubah kalimat menjadi pertanyaan hanya dengan **kan?** atau nada naik. Bahasa Inggris menambahkan **do / does / did** di depan: **Do you like coffee?**",
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
      id: "Artikel **a / an / the**",
    },
    longDescription: {
      en: "Vietnamese has no articles — nouns stand alone. English almost always needs **a**, **an**, or **the** before a singular countable noun.",
      vi: "Tiếng Việt mình không có mạo từ — danh từ đứng một mình là được. Tiếng Anh gần như luôn cần **a**, **an**, hoặc **the** trước danh từ đếm được số ít.",
      id: "Bahasa Indonesia tidak memiliki artikel — kata benda berdiri sendiri. Bahasa Inggris hampir selalu membutuhkan **a**, **an**, atau **the** sebelum kata benda tunggal yang bisa dihitung.",
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
      id: "**His** vs **her**",
    },
    longDescription: {
      en: "Vietnamese possessive **của** doesn't mark gender. English picks **his** or **her** based on the **owner's** gender, not the object's.",
      vi: "Chữ **của** trong tiếng Việt không phân biệt giới tính. Tiếng Anh chọn **his** hoặc **her** theo giới tính của **người sở hữu**, không phải của đồ vật.",
      id: "Bahasa Indonesia menggunakan **dia** atau **-nya** tanpa membedakan gender pemilik. Bahasa Inggris memilih **his** atau **her** berdasarkan gender **pemiliknya**, bukan bendanya.",
    },
    exampleWrong: "My mother reads his book.",
    exampleRight: "My mother reads her book.",
    linkedRoomId: "english_a2_a208",
  },

  vi_l1_preposition_transfer: {
    tag: "vi_l1_preposition_transfer",
    shortLabel: {
      en: "Prepositions **in / on / at**",
      vi: "Giới từ **in / on / at**",
      id: "Preposisi **in / on / at**",
    },
    longDescription: {
      en: "Vietnamese prepositions don't map one-to-one onto English. Words like **on**, **in**, **at** have patterns you memorise, not translate: **on Monday**, **in June**, **at 7pm**.",
      vi: "Giới từ tiếng Việt không dịch thẳng sang tiếng Anh. Các từ **on**, **in**, **at** có quy tắc riêng cần nhớ, không dịch từng chữ được: **on Monday**, **in June**, **at 7pm**.",
      id: "Bahasa Indonesia menggunakan **di** untuk lokasi dan waktu — satu kata untuk semuanya. Bahasa Inggris membagi menjadi **in** (ruang tertutup / periode besar), **on** (permukaan / hari), dan **at** (titik spesifik). Tidak bisa diterjemahkan langsung — harus dihafal per pola: **on Monday**, **in June**, **at 7pm**.",
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
      id: "Bisa dihitung / tidak bisa dihitung",
    },
    longDescription: {
      en: "Vietnamese doesn't split nouns into countable and uncountable — **nhiều tiền** and **nhiều bạn** both just use **nhiều**. English uses **many** for countable and **much** or **a lot of** for uncountable.",
      vi: "Tiếng Việt mình không chia danh từ đếm được / không đếm được — **nhiều tiền**, **nhiều bạn** đều dùng **nhiều**. Tiếng Anh dùng **many** với đếm được và **much** hoặc **a lot of** với không đếm được.",
      id: "Bahasa Indonesia tidak membagi kata benda — **banyak uang** dan **banyak teman** sama-sama pakai **banyak**. Bahasa Inggris menggunakan **many** untuk yang bisa dihitung dan **much** atau **a lot of** untuk yang tidak bisa dihitung.",
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
      id: "Kapan pakai **to + verb**",
    },
    longDescription: {
      en: "Vietnamese doesn't mark an infinitive. English uses **to + verb** after verbs like **want**, **need**, **plan** — but NOT after modals like **can** or **must**.",
      vi: "Tiếng Việt mình không có dạng động từ nguyên mẫu. Tiếng Anh dùng **to + verb** sau **want**, **need**, **plan**, nhưng KHÔNG dùng sau các modal như **can** hoặc **must**.",
      id: "Bahasa Indonesia tidak menandai infinitif. Bahasa Inggris menggunakan **to + verb** setelah kata kerja seperti **want**, **need**, **plan** — tapi TIDAK setelah modal seperti **can** atau **must**.",
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
      id: "**Can / must** + kata kerja dasar",
    },
    longDescription: {
      en: "Vietnamese **có thể** / **phải** sits right before the verb with no extra word. English modals like **can** and **must** take the plain verb — no **to** in between.",
      vi: "Tiếng Việt mình chỉ cần **có thể** / **phải** rồi động từ. Tiếng Anh các modal như **can**, **must** đi với động từ gốc — không có **to** ở giữa.",
      id: "Bahasa Indonesia **bisa** / **harus** langsung di depan kata kerja tanpa kata tambahan. Modal bahasa Inggris seperti **can** dan **must** diikuti kata kerja dasar — tanpa **to** di antaranya.",
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
      id: "Satu penanda lampau, bukan dua",
    },
    longDescription: {
      en: "Vietnamese often stacks **đã** with a past time word. In English, once you use **did**, the main verb returns to its base form — only one past marker per verb.",
      vi: "Tiếng Việt mình hay ghép **đã** với cả trạng từ thời gian quá khứ. Tiếng Anh khi đã có **did**, động từ chính trở về dạng nguyên thể — chỉ một dấu hiệu quá khứ.",
      id: "Bahasa Indonesia sering menggabungkan **sudah** dengan kata waktu lampau. Dalam bahasa Inggris, begitu kamu pakai **did**, kata kerja utama kembali ke bentuk dasar — hanya satu penanda lampau per kata kerja.",
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
      id: "Kepunyaan dengan **'s**",
    },
    longDescription: {
      en: "Vietnamese puts **của** between two nouns — **sách của Lan**. English attaches **'s** to the owner instead: **Lan's book**.",
      vi: "Tiếng Việt mình đặt **của** giữa hai danh từ — **sách của Lan**. Tiếng Anh thêm **'s** vào người sở hữu: **Lan's book**.",
      id: "Bahasa Indonesia meletakkan **milik** di antara dua kata benda — **buku milik Lan**. Bahasa Inggris menempelkan **'s** ke pemiliknya: **Lan's book**.",
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
      id: "Satu pembanding, bukan dua",
    },
    longDescription: {
      en: "Vietnamese comfortably layers **hơn** with extra intensifiers. English picks ONE comparative form: **better** OR **more + adjective** — never **more better**.",
      vi: "Tiếng Việt mình dễ ghép **hơn** với nhiều từ nhấn mạnh. Tiếng Anh chọn MỘT dạng so sánh: **better** hoặc **more + tính từ** — không bao giờ **more better**.",
      id: "Bahasa Indonesia dengan mudah melapis **lebih** dengan penguat tambahan. Bahasa Inggris memilih SATU bentuk perbandingan: **better** ATAU **more + kata sifat** — jangan pernah **more better**.",
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
      id: "Kata sifat **sebelum** kata benda",
    },
    longDescription: {
      en: "Vietnamese places the adjective **after** the noun: **áo đỏ**. English flips it — adjective comes **before** the noun: **a red shirt**.",
      vi: "Tiếng Việt mình đặt tính từ **sau** danh từ: **áo đỏ**. Tiếng Anh đảo lại — tính từ đứng **trước** danh từ: **a red shirt**.",
      id: "Bahasa Indonesia menempatkan kata sifat **setelah** kata benda: **baju merah**. Bahasa Inggris membaliknya — kata sifat di **depan** kata benda: **a red shirt**.",
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
      id: "**Very** vs **very much**",
    },
    longDescription: {
      en: "Vietnamese **rất** sits right before the verb or adjective: **rất thích**. In English, **very** goes with adjectives (**very happy**) but with verbs you say **… very much** at the end.",
      vi: "Tiếng Việt **rất** đứng ngay trước động từ hay tính từ: **rất thích**. Tiếng Anh **very** dùng với tính từ (**very happy**), còn với động từ thì **… very much** ở cuối câu.",
      id: "Bahasa Indonesia **sangat** duduk tepat sebelum kata kerja atau kata sifat: **sangat suka**. Dalam bahasa Inggris, **very** dipakai dengan kata sifat (**very happy**) tapi dengan kata kerja kamu bilang **… very much** di akhir kalimat.",
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
      id: "**There is** vs **there are**",
    },
    longDescription: {
      en: "Vietnamese **có** stays the same whether there's one thing or many. English switches: **there is** for one, **there are** for two or more.",
      vi: "Tiếng Việt mình dùng **có** cho cả một và nhiều. Tiếng Anh đổi: **there is** với một, **there are** với hai trở lên.",
      id: "Bahasa Indonesia menggunakan **ada** untuk satu maupun banyak benda. Bahasa Inggris berganti: **there is** untuk satu, **there are** untuk dua atau lebih.",
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
      id: "**Everyone** itu tunggal",
    },
    longDescription: {
      en: "Vietnamese **mọi người** feels plural because it means many people. In English, **everyone** and **everybody** take a singular verb: **everyone is happy**.",
      vi: "Tiếng Việt mình **mọi người** nghe như số nhiều vì nói về nhiều người. Tiếng Anh **everyone** và **everybody** đi với động từ số ít: **everyone is happy**.",
      id: "Bahasa Indonesia **semua orang** terasa jamak karena artinya banyak orang. Dalam bahasa Inggris, **everyone** dan **everybody** memakai kata kerja tunggal: **everyone is happy**.",
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
      id: "**Make** vs **do**",
    },
    longDescription: {
      en: "Vietnamese **làm** covers both English verbs. English splits the work: **make** for creating (a cake, a decision, a mistake); **do** for activities (homework, the dishes, a job).",
      vi: "Tiếng Việt mình chỉ có một chữ **làm**. Tiếng Anh chia hai: **make** khi tạo ra (bánh, quyết định, sai lầm); **do** với hoạt động (bài tập, rửa bát, công việc).",
      id: "Bahasa Indonesia **buat** atau **lakukan** mencakup keduanya. Bahasa Inggris membagi: **make** untuk menciptakan atau menghasilkan sesuatu (kesalahan, keputusan, uang); **do** untuk aktivitas atau tugas (PR, cuci piring, pekerjaan).",
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
      id: "Pertanyaan ekor",
    },
    longDescription: {
      en: "Vietnamese uses one invariant tag — **phải không?**. English flips the auxiliary and polarity: a positive statement takes a negative tag — **You are Vietnamese, aren't you?**",
      vi: "Tiếng Việt mình chỉ cần **phải không?** là xong. Tiếng Anh đổi cả trợ động từ và thể (khẳng định ↔ phủ định): câu khẳng định dùng đuôi phủ định — **You are Vietnamese, aren't you?**",
      id: "Bahasa Indonesia menggunakan satu tambahan tetap — **kan?**. Bahasa Inggris membalik kata bantu dan polaritasnya: kalimat positif pakai ekor negatif — **You are Vietnamese, aren't you?**",
    },
    exampleWrong: "You are Vietnamese, you are?",
    exampleRight: "You are Vietnamese, aren't you?",
    linkedRoomId: null,
  },

  // ────────────────────────────────────────────────────────────────────────
  // L1 detector v3 expansion (CC1 feat/l1-rules-v3-expansion, 2026-04-24)
  // All 15 entries are draft strings pending Chau review. linkedRoomId is
  // null across the board — these are B1+ grammar topics and the current
  // room catalog is general-fluency, not topic-dedicated. Revisit when
  // content adds dedicated grammar rooms.
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_past_perfect_missing: {
    tag: "vi_l1_past_perfect_missing",
    shortLabel: {
      en: "Past perfect (**had + V3**)",
      vi: "Quá khứ hoàn thành (**had + V3**)",
      ja: "過去完了（**had + 過去分詞**）",
      id: "Past perfect (**had + V3**)",
    },
    longDescription: {
      en: "Vietnamese stacks time words like **trước đó** to show one past event happened before another. English uses **had + past participle** — **I had already eaten when she called**.",
      vi: "Tiếng Việt mình dùng **trước đó** để chỉ việc nào xảy ra trước. Tiếng Anh dùng **had + V3** — **I had already eaten when she called** (Tôi đã ăn xong trước khi cô ấy gọi).",
      ja: "日本語は「〜していた」「〜してしまっていた」に「前に」「時点で」などの語を添えて出来事の前後関係を表します。英語では、過去のある時点より前に起こったことを **had + 過去分詞** で明示します。**I had already eaten when she called**（彼女が電話してきた時には、私はすでに食事を終えていた）。",
      id: "Bahasa Indonesia menggunakan kata seperti **sebelumnya** untuk menunjukkan satu kejadian lampau terjadi sebelum yang lain. Bahasa Inggris menggunakan **had + V3** — **I had already eaten when she called** (Saya sudah makan ketika dia menelepon).",
    },
    exampleWrong: "When she called, I already ate.",
    exampleRight: "When she called, I had already eaten.",
    linkedRoomId: null,
  },

  vi_l1_reported_speech: {
    tag: "vi_l1_reported_speech",
    shortLabel: {
      en: "Reported speech",
      vi: "Câu tường thuật",
      ja: "間接話法（時制の一致）",
      id: "Kalimat tidak langsung",
    },
    longDescription: {
      en: "Vietnamese often quotes directly or uses **nói rằng** without shifting the verb. English backshifts the tense: **She said she was tired** — not **she is tired**.",
      vi: "Tiếng Việt mình nói lại lời người khác thường giữ nguyên thì, hoặc dùng **nói rằng**. Tiếng Anh lùi thì một bậc: **She said she was tired**, không phải **she is tired**.",
      ja: "日本語は「〜と言いました」とそのまま引用するか、時制を変えずに伝えることができます。英語では、伝える内容の時制を一つ過去にずらします（時制の一致）。**She said she was tired**（彼女は疲れていると言った）— 直接話法の **is** を間接話法では **was** にします。",
      id: "Bahasa Indonesia sering mengutip langsung atau menggunakan **bilang bahwa** tanpa mengubah kata kerja. Bahasa Inggris memundurkan tenses: **She said she was tired** — bukan **she is tired**.",
    },
    exampleWrong: "She said she is tired.",
    exampleRight: "She said she was tired.",
    linkedRoomId: null,
  },

  vi_l1_since_vs_for: {
    tag: "vi_l1_since_vs_for",
    shortLabel: {
      en: "**Since** vs **for**",
      vi: "**Since** vs **for**",
      ja: "**since**（起点）vs **for**（期間）",
      id: "**Since** vs **for**",
    },
    longDescription: {
      en: "Vietnamese **từ** covers both a starting point and a duration. English splits: **since** points to a moment (**since 2020**); **for** measures length (**for three years**).",
      vi: "Tiếng Việt mình **từ** dùng cho cả điểm bắt đầu lẫn khoảng thời gian. Tiếng Anh tách ra: **since** chỉ mốc (**since 2020**); **for** chỉ độ dài (**for three years**).",
      ja: "日本語の「〜から」は起点（「3時から」）と期間（「3時間から」とは言わないが）の両方に近い用法があります。英語は厳密に区別し、**since** は特定の時点（**since 2020**「2020年から」）、**for** は期間の長さ（**for three years**「3年間」）を表します。日本語話者は「〜から」の感覚で **since three years** と言ってしまいがちです。",
      id: "Bahasa Indonesia **sejak** mencakup titik awal dan durasi. Bahasa Inggris memisahkan: **since** menunjuk ke momen (**since 2020**); **for** mengukur panjang waktu (**for three years**).",
    },
    exampleWrong: "I have lived here since three years.",
    exampleRight: "I have lived here for three years.",
    linkedRoomId: null,
  },

  vi_l1_countable_much: {
    tag: "vi_l1_countable_much",
    shortLabel: {
      en: "**Much** with uncountable only",
      vi: "**Much** chỉ đi với không đếm được",
      id: "**Much** hanya dengan yang tidak bisa dihitung",
    },
    longDescription: {
      en: "Vietnamese **nhiều** works with anything — **nhiều bạn**, **nhiều nước**. English **much** only pairs with uncountable nouns: **much water**, **much time** — but NOT **much friends** (use **many** or **a lot of**).",
      vi: "Tiếng Việt mình dùng **nhiều** với mọi danh từ. Tiếng Anh **much** chỉ đi với danh từ không đếm được: **much water**, **much time** — KHÔNG dùng **much friends** (phải là **many** hoặc **a lot of**).",
      id: "Bahasa Indonesia **banyak** berlaku untuk semuanya — **banyak teman**, **banyak air**. Bahasa Inggris **much** hanya berpasangan dengan kata benda yang tidak bisa dihitung: **much water**, **much time** — tapi BUKAN **much friends** (pakai **many** atau **a lot of**).",
    },
    exampleWrong: "I have much friends here.",
    exampleRight: "I have many friends here.",
    linkedRoomId: null,
  },

  vi_l1_some_vs_any: {
    tag: "vi_l1_some_vs_any",
    shortLabel: {
      en: "**Some** vs **any**",
      vi: "**Some** vs **any**",
      id: "**Some** vs **any**",
    },
    longDescription: {
      en: "Vietnamese uses **một vài** or **chút** in every sentence type. English switches: **some** in positives (**I have some questions**); **any** in negatives and most questions (**Do you have any questions?**).",
      vi: "Tiếng Việt mình dùng **một vài** hay **chút** cho mọi loại câu. Tiếng Anh đổi: **some** cho câu khẳng định (**I have some questions**); **any** cho phủ định và đa số câu hỏi (**Do you have any questions?**).",
      id: "Bahasa Indonesia menggunakan **beberapa** atau **sedikit** di semua jenis kalimat. Bahasa Inggris berganti: **some** di kalimat positif (**I have some questions**); **any** di kalimat negatif dan kebanyakan pertanyaan (**Do you have any questions?**).",
    },
    exampleWrong: "Do you have some questions?",
    exampleRight: "Do you have any questions?",
    linkedRoomId: null,
  },

  vi_l1_reflexive_missing: {
    tag: "vi_l1_reflexive_missing",
    shortLabel: {
      en: "Reflexive pronouns (**myself**)",
      vi: "Đại từ phản thân (**myself**)",
      id: "Kata ganti refleksif (**myself**)",
    },
    longDescription: {
      en: "Vietnamese uses **tự** before the verb: **tự học**. English needs a reflexive pronoun after the verb: **I taught myself**, **she hurt herself**.",
      vi: "Tiếng Việt mình đặt **tự** trước động từ: **tự học**. Tiếng Anh cần đại từ phản thân sau động từ: **I taught myself**, **she hurt herself**.",
      id: "Bahasa Indonesia menggunakan **diri** sebelum kata kerja: **belajar sendiri**. Bahasa Inggris perlu kata ganti refleksif setelah kata kerja: **I taught myself**, **she hurt herself**.",
    },
    exampleWrong: "I taught English by me.",
    exampleRight: "I taught myself English.",
    linkedRoomId: null,
  },

  vi_l1_conditional_mix: {
    tag: "vi_l1_conditional_mix",
    shortLabel: {
      en: "**If** clauses — match the tenses",
      vi: "Câu **If** — hợp thì",
      ja: "**if**節の時制の組み合わせ",
      id: "Klausa **If** — cocokkan tensesnya",
    },
    longDescription: {
      en: "Vietnamese **nếu… thì…** keeps verbs unchanged. English matches the pattern: real = **If + present, will + V**; unreal = **If + past, would + V** — never mix past with **will**.",
      vi: "Tiếng Việt mình **nếu… thì…** không đổi động từ. Tiếng Anh ghép đôi: có thật = **If + hiện tại, will + V**; không có thật = **If + quá khứ, would + V** — không trộn quá khứ với **will**.",
      ja: "日本語の「〜たら」「〜ば」は現実的条件でも非現実的条件でも動詞の形が変わりません。英語では、実現可能な条件は **If + 現在形, will + 動詞の原形**、現実に反する仮定は **If + 過去形, would + 動詞の原形** と時制を組み合わせます。日本語話者は「もしお金があれば買う」の感覚で **If I had money, I will buy** と時制を混ぜてしまうことが多いので注意が必要です。",
      id: "Bahasa Indonesia **kalau… maka…** tidak mengubah kata kerja. Bahasa Inggris mencocokkan polanya: nyata = **If + present, will + V**; tidak nyata = **If + past, would + V** — jangan campur past dengan **will**.",
    },
    exampleWrong: "If I had money, I will buy a car.",
    exampleRight: "If I had money, I would buy a car.",
    linkedRoomId: null,
  },

  vi_l1_to_infinitive_after_ing: {
    tag: "vi_l1_to_infinitive_after_ing",
    shortLabel: {
      en: "**-ing** vs **to + verb**",
      vi: "**-ing** vs **to + verb**",
      ja: "動名詞（**-ing**）vs 不定詞（**to + 動詞**）",
      id: "**-ing** vs **to + verb**",
    },
    longDescription: {
      en: "Vietnamese uses the plain verb everywhere. English picks one: verbs like **enjoy**, **finish**, **avoid** take **-ing** (**I enjoy swimming**); verbs like **want**, **plan**, **decide** take **to + verb** (**I want to swim**).",
      vi: "Tiếng Việt mình chỉ dùng động từ gốc. Tiếng Anh chia hai: các verb như **enjoy**, **finish**, **avoid** đi với **-ing** (**I enjoy swimming**); **want**, **plan**, **decide** đi với **to + verb** (**I want to swim**).",
      ja: "日本語では動詞の後ろに置く形が「〜すること」の一通りしかないため、英語の **-ing** と **to + 動詞** の使い分けは日本語話者にとって難しいポイントです。**enjoy**、**finish**、**avoid**、**mind**、**suggest** などは後ろに **-ing** のみをとり、**want**、**plan**、**decide**、**hope**、**promise** などは **to + 動詞** をとります。",
      id: "Bahasa Indonesia menggunakan kata kerja dasar di mana-mana. Bahasa Inggris memilih salah satu: kata kerja seperti **enjoy**, **finish**, **avoid** diikuti **-ing** (**I enjoy swimming**); kata kerja seperti **want**, **plan**, **decide** diikuti **to + verb** (**I want to swim**).",
    },
    exampleWrong: "I enjoy to swim.",
    exampleRight: "I enjoy swimming.",
    linkedRoomId: null,
  },

  vi_l1_passive_missing_be: {
    tag: "vi_l1_passive_missing_be",
    shortLabel: {
      en: "Passive needs **be + V3**",
      vi: "Bị động cần **be + V3**",
      ja: "受動態には **be + 過去分詞** が必要",
      id: "Pasif perlu **be + V3**",
    },
    longDescription: {
      en: "Vietnamese marks the passive with **bị** or **được** before the verb. English needs a form of **be** plus the past participle: **The letter was written**, not **The letter written**.",
      vi: "Tiếng Việt mình dùng **bị** hoặc **được** trước động từ là thành bị động. Tiếng Anh cần dạng **be** + V3: **The letter was written**, không phải **The letter written**.",
      ja: "日本語の受身（「〜れる」「〜られる」）は動詞の語尾変化で表します。英語の受動態は **be動詞 + 過去分詞** の組み合わせで作り、**be動詞** を省略することはできません。**The letter was written**（その手紙は書かれた）— 日本語の「書かれた」だけの感覚で **The letter written** としてしまう誤りがよくあります。",
      id: "Bahasa Indonesia menandai pasif dengan **di-** di depan kata kerja. Bahasa Inggris perlu bentuk **be** ditambah V3: **The letter was written**, bukan **The letter written**.",
    },
    exampleWrong: "The letter written yesterday.",
    exampleRight: "The letter was written yesterday.",
    linkedRoomId: null,
  },

  vi_l1_relative_pronoun: {
    tag: "vi_l1_relative_pronoun",
    shortLabel: {
      en: "**Who / which / that**",
      vi: "**Who / which / that**",
      ja: "関係代名詞 **who / which / that**",
      id: "**Who / which / that**",
    },
    longDescription: {
      en: "Vietnamese joins clauses with **mà** for everything. English picks the relative pronoun by what it refers to: **who** for people, **which** for things, **that** for both in defining clauses.",
      vi: "Tiếng Việt mình dùng **mà** nối câu cho mọi thứ. Tiếng Anh chọn đại từ theo đối tượng: **who** cho người, **which** cho vật, **that** cho cả hai ở mệnh đề xác định.",
      ja: "日本語は動詞の連体形で直接名詞を修飾します（「昨日来た人」「私が買った本」）。英語は関係代名詞で節をつなぎ、**who** は人、**which** は物・動物、**that** は両方に使えます。日本語話者は「〜した人」の語順のまま **The man called you is here** と関係代名詞を落としてしまうことが多いです。",
      id: "Bahasa Indonesia menggabungkan klausa dengan **yang** untuk semuanya. Bahasa Inggris memilih kata ganti relatif berdasarkan apa yang dirujuk: **who** untuk orang, **which** untuk benda, **that** untuk keduanya di klausa penentu.",
    },
    exampleWrong: "The man which called you is here.",
    exampleRight: "The man who called you is here.",
    linkedRoomId: null,
  },

  vi_l1_used_to_vs_be_used_to: {
    tag: "vi_l1_used_to_vs_be_used_to",
    shortLabel: {
      en: "**Used to** vs **be used to**",
      vi: "**Used to** vs **be used to**",
      ja: "**used to**（過去の習慣）vs **be used to**（〜に慣れている）",
      id: "**Used to** vs **be used to**",
    },
    longDescription: {
      en: "Two English patterns look alike but mean different things. **Used to + V** = a past habit that stopped (**I used to smoke**). **Be used to + V-ing** = now familiar with (**I'm used to waking up early**).",
      vi: "Hai cấu trúc tiếng Anh nhìn giống nhau nhưng khác nghĩa. **Used to + V** = thói quen cũ đã bỏ (**I used to smoke**). **Be used to + V-ing** = giờ đã quen với (**I'm used to waking up early**).",
      ja: "この2つは形が似ていますが意味が異なります。**used to + 動詞の原形** は「昔は〜していた（今はもうしていない）」という過去の習慣を表します。例：**I used to smoke**（昔はタバコを吸っていた）。一方、**be used to + 動名詞（〜ing）** は「〜に慣れている」という現在の状態を表します。例：**I'm used to waking up early**（早起きに慣れている）。日本語話者はこの2つを混同しやすいので注意してください。",
      id: "Dua pola bahasa Inggris terlihat mirip tapi beda arti. **Used to + V** = kebiasaan lama yang sudah berhenti (**I used to smoke**). **Be used to + V-ing** = sekarang sudah terbiasa (**I'm used to waking up early**).",
    },
    exampleWrong: "I am used to smoke, but I stopped.",
    exampleRight: "I used to smoke, but I stopped.",
    linkedRoomId: null,
  },

  vi_l1_another_vs_other: {
    tag: "vi_l1_another_vs_other",
    shortLabel: {
      en: "**Another** vs **other / others**",
      vi: "**Another** vs **other / others**",
      id: "**Another** vs **other / others**",
    },
    longDescription: {
      en: "Vietnamese **khác** serves every case. English splits: **another** + singular noun (**another book**); **other** + plural (**other books**); **others** stands alone (**I have others**).",
      vi: "Tiếng Việt mình chỉ cần **khác**. Tiếng Anh chia ba: **another** + danh từ số ít (**another book**); **other** + số nhiều (**other books**); **others** đứng một mình (**I have others**).",
      id: "Bahasa Indonesia **lain** berlaku untuk semua kasus. Bahasa Inggris membagi: **another** + kata benda tunggal (**another book**); **other** + jamak (**other books**); **others** berdiri sendiri (**I have others**).",
    },
    exampleWrong: "I need another books.",
    exampleRight: "I need other books.",
    linkedRoomId: null,
  },

  vi_l1_look_vs_see_vs_watch: {
    tag: "vi_l1_look_vs_see_vs_watch",
    shortLabel: {
      en: "**Look / see / watch**",
      vi: "**Look / see / watch**",
      id: "**Look / see / watch**",
    },
    longDescription: {
      en: "Vietnamese **nhìn** / **xem** covers all three. English separates: **look (at)** = direct your eyes on purpose; **see** = notice, perceive; **watch** = follow something moving over time (a film, a game).",
      vi: "Tiếng Việt mình **nhìn** / **xem** dùng chung. Tiếng Anh tách ra: **look (at)** = chủ động hướng mắt; **see** = nhận thấy, thấy; **watch** = theo dõi thứ gì đó đang chuyển động (phim, trận đấu).",
      id: "Bahasa Indonesia **lihat** / **tonton** mencakup ketiganya. Bahasa Inggris memisahkan: **look (at)** = mengarahkan mata dengan sengaja; **see** = menyadari, menangkap dengan mata; **watch** = mengikuti sesuatu yang bergerak seiring waktu (film, pertandingan).",
    },
    exampleWrong: "I looked a movie last night.",
    exampleRight: "I watched a movie last night.",
    linkedRoomId: null,
  },

  vi_l1_by_vs_with: {
    tag: "vi_l1_by_vs_with",
    shortLabel: {
      en: "**By** vs **with**",
      vi: "**By** vs **with**",
      id: "**By** vs **with**",
    },
    longDescription: {
      en: "Vietnamese **bằng** covers both means of transport and tools. English splits: **by** for method or transport (**by bus**, **by email**); **with** for the tool held (**cut with a knife**, **write with a pen**).",
      vi: "Tiếng Việt mình **bằng** dùng cho cả phương tiện và công cụ. Tiếng Anh tách ra: **by** cho phương thức hay phương tiện (**by bus**, **by email**); **with** cho dụng cụ cầm trong tay (**cut with a knife**, **write with a pen**).",
      id: "Bahasa Indonesia **dengan** mencakup alat transportasi dan perkakas. Bahasa Inggris memisahkan: **by** untuk metode atau transportasi (**by bus**, **by email**); **with** untuk alat yang dipegang (**cut with a knife**, **write with a pen**).",
    },
    exampleWrong: "I cut the bread by a knife.",
    exampleRight: "I cut the bread with a knife.",
    linkedRoomId: null,
  },

  vi_l1_time_expressions: {
    tag: "vi_l1_time_expressions",
    shortLabel: {
      en: "Time words: **ago / last / in**",
      vi: "Từ chỉ thời gian: **ago / last / in**",
      id: "Kata waktu: **ago / last / in**",
    },
    longDescription: {
      en: "Vietnamese can stack **cách đây**, **trước** freely. English chooses: **ago** after a duration from now (**two days ago**); **last** before a period (**last Monday**); **in** for future gaps (**in two hours**).",
      vi: "Tiếng Việt mình ghép **cách đây**, **trước** tự nhiên. Tiếng Anh chọn: **ago** sau khoảng thời gian tính từ bây giờ (**two days ago**); **last** trước kỳ gần nhất (**last Monday**); **in** cho khoảng tương lai (**in two hours**).",
      id: "Bahasa Indonesia bisa menumpuk **yang lalu**, **sebelum** dengan bebas. Bahasa Inggris memilih: **ago** setelah durasi dari sekarang (**two days ago**); **last** sebelum periode (**last Monday**); **in** untuk jarak masa depan (**in two hours**).",
    },
    exampleWrong: "I saw him before two days.",
    exampleRight: "I saw him two days ago.",
    linkedRoomId: null,
  },

  // ────────────────────────────────────────────────────────────────────────
  // Round 5 entries — CC3 seeded English + examples. CC4 will fill the
  // Vietnamese strings (shortLabel.vi / longDescription.vi) in a
  // subsequent PR. The "[VI TBD — CC4]" marker makes unreviewed rows
  // easy to spot.
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_present_perfect_vs_past: {
    tag: "vi_l1_present_perfect_vs_past",
    shortLabel: {
      en: "Present perfect vs past",
      vi: "[VI TBD — CC4]",
      ja: "現在完了 vs 過去形",
      id: "Present perfect vs past tense",
    },
    longDescription: {
      en: "Vietnamese has no perfect aspect. When a sentence names a specific past time (**yesterday**, **last week**, **in 1990**), English requires simple past — not **have/has + past participle**.",
      vi: "[VI TBD — CC4]",
      ja: "日本語の「〜た」は「昨日食べた」（過去の一点）も「もう食べた」（完了）も同じ形で表せます。英語では、**yesterday**、**last week**、**in 1990** など特定の過去の時点を表す語があるときは、必ず**過去形**を使い、現在完了（**have + 過去分詞**）は使えません。**I ate pho yesterday**（昨日フォーを食べた）— **I have eaten pho yesterday** とは言いません。",
      id: "Bahasa Indonesia menggunakan **sudah**, **pernah**, **belum** dengan kata kerja yang sama — tidak ada perubahan tense. Bahasa Inggris membedakan: kalau ada kata waktu lampau spesifik (**yesterday**, **last week**, **in 1990**), harus pakai simple past — bukan **have/has + V3**.",
    },
    exampleWrong: "I have eaten pho yesterday.",
    exampleRight: "I ate pho yesterday.",
    linkedRoomId: null,
  },

  vi_l1_subjunctive_were: {
    tag: "vi_l1_subjunctive_were",
    shortLabel: {
      en: "Subjunctive **were**",
      vi: "[VI TBD — CC4]",
      ja: "仮定法の **were**",
      id: "Subjunctive **were**",
    },
    longDescription: {
      en: "After **if** or **wish**, English uses **were** for every subject in unreal / imagined situations — *If I **were** you*, not *If I **was** you*.",
      vi: "[VI TBD — CC4]",
      ja: "日本語では「もし私があなたなら」のように、非現実の仮定でも動詞は変わりません。英語では、**if** や **wish** の後の現実に反する仮定では、主語に関係なく **were** を使います。**If I were you, I would take the job**（もし私があなたなら、その仕事を引き受けるのに）— 口語では **was** も使われますが、フォーマルな英語・試験では **were** が正解です。",
      id: "Setelah **if** atau **wish**, bahasa Inggris menggunakan **were** untuk setiap subjek di situasi yang tidak nyata / khayalan — *If I **were** you*, bukan *If I **was** you*.",
    },
    exampleWrong: "If I was you, I would take the job.",
    exampleRight: "If I were you, I would take the job.",
    linkedRoomId: null,
  },

  vi_l1_embedded_question_order: {
    tag: "vi_l1_embedded_question_order",
    shortLabel: {
      en: "Embedded-question order",
      vi: "[VI TBD — CC4]",
      ja: "間接疑問文の語順",
      id: "Urutan pertanyaan tidak langsung",
    },
    longDescription: {
      en: "A question inside another sentence drops the question word order — subject comes before the auxiliary.",
      vi: "[VI TBD — CC4]",
      ja: "日本語では「これが何かわからない」のように、疑問の部分をそのまま文中に埋め込めます。英語では、文中に埋め込まれた疑問文（間接疑問）は**平叙文の語順**（主語 → 動詞）になります。**I don't know what this is**（これが何かわからない）— 疑問文の語順 **what is this** をそのまま埋め込めません。",
      id: "Pertanyaan di dalam kalimat lain menghilangkan urutan kata tanya — subjek datang sebelum kata bantu.",
    },
    exampleWrong: "I don't know what is this.",
    exampleRight: "I don't know what this is.",
    linkedRoomId: null,
  },

  vi_l1_do_support_3ps: {
    tag: "vi_l1_do_support_3ps",
    shortLabel: {
      en: "**doesn't** for he / she / it",
      vi: "[VI TBD — CC4]",
      id: "**doesn't** untuk he / she / it",
    },
    longDescription: {
      en: "In the present simple, the helper with **he**, **she**, or **it** is **doesn't** — not **don't**. The **-s** rides on the helper, so the main verb stays bare.",
      vi: "[VI TBD — CC4]",
      id: "Dalam present simple, kata bantu untuk **he**, **she**, atau **it** adalah **doesn't** — bukan **don't**. Akhiran **-s** menempel di kata bantu, jadi kata kerja utama tetap bentuk dasar.",
    },
    exampleWrong: "She don't know the answer.",
    exampleRight: "She doesn't know the answer.",
    linkedRoomId: null,
  },

  vi_l1_subject_relative_omit: {
    tag: "vi_l1_subject_relative_omit",
    shortLabel: {
      en: "Subject **who / which / that**",
      vi: "[VI TBD — CC4]",
      id: "Subjek **who / which / that**",
    },
    longDescription: {
      en: "English cannot drop a **subject** relative pronoun. Use **who** for people and **which / that** for things.",
      vi: "[VI TBD — CC4]",
      id: "Bahasa Inggris tidak bisa menghilangkan kata ganti relatif **subjek**. Gunakan **who** untuk orang dan **which / that** untuk benda.",
    },
    exampleWrong: "The man came yesterday is my uncle.",
    exampleRight: "The man who came yesterday is my uncle.",
    linkedRoomId: null,
  },

  vi_l1_gerund_after_verb: {
    tag: "vi_l1_gerund_after_verb",
    shortLabel: {
      en: "Gerund after **enjoy / avoid / finish**",
      vi: "[VI TBD — CC4]",
      id: "Gerund setelah **enjoy / avoid / finish**",
    },
    longDescription: {
      en: "Verbs like **enjoy**, **avoid**, **finish**, **keep**, **mind**, **suggest**, and **practise** are followed by **-ing**, not **to + verb**.",
      vi: "[VI TBD — CC4]",
      id: "Kata kerja seperti **enjoy**, **avoid**, **finish**, **keep**, **mind**, **suggest**, dan **practise** diikuti oleh **-ing**, bukan **to + verb**.",
    },
    exampleWrong: "I enjoy to swim in the morning.",
    exampleRight: "I enjoy swimming in the morning.",
    linkedRoomId: null,
  },

  vi_l1_modal_perfect: {
    tag: "vi_l1_modal_perfect",
    shortLabel: {
      en: "Modal + **have** + V3",
      vi: "[VI TBD — CC4]",
      ja: "助動詞 + **have** + 過去分詞",
      id: "Modal + **have** + V3",
    },
    longDescription: {
      en: "To talk about a past possibility, regret, or conclusion with a modal, English uses **modal + have + past participle** — not the past-tense verb directly.",
      vi: "[VI TBD — CC4]",
      ja: "日本語の「〜すべきだった」「〜したかもしれない」は、助動詞の過去形や「〜たかもしれない」で表します。英語では、過去の可能性・後悔・推量を表すときは **助動詞 + have + 過去分詞** の形を使い、動詞の過去形を直接助動詞の後ろに置くことはできません。**I should have done it**（やっておくべきだった）— **I should did it** とは言いません。",
      id: "Untuk membicarakan kemungkinan, penyesalan, atau kesimpulan lampau dengan modal, bahasa Inggris menggunakan **modal + have + V3** — bukan kata kerja past tense langsung.",
    },
    exampleWrong: "I should did it yesterday.",
    exampleRight: "I should have done it yesterday.",
    linkedRoomId: null,
  },

  vi_l1_phrasal_pronoun_order: {
    tag: "vi_l1_phrasal_pronoun_order",
    shortLabel: {
      en: "Pronoun splits phrasal verb",
      vi: "[VI TBD — CC4]",
      id: "Kata ganti memisahkan phrasal verb",
    },
    longDescription: {
      en: "With separable phrasal verbs, pronoun objects go **between** the verb and the particle: *picked **him** up*, not *picked up **him***.",
      vi: "[VI TBD — CC4]",
      id: "Dengan phrasal verb yang bisa dipisah, objek kata ganti diletakkan **di antara** kata kerja dan partikelnya: *picked **him** up*, bukan *picked up **him***.",
    },
    exampleWrong: "I picked up him from the airport.",
    exampleRight: "I picked him up from the airport.",
    linkedRoomId: null,
  },

  vi_l1_comparative_more_long: {
    tag: "vi_l1_comparative_more_long",
    shortLabel: {
      en: "**more** with long adjectives",
      vi: "[VI TBD — CC4]",
      ja: "長い形容詞の比較級は **more**",
      id: "**more** dengan kata sifat panjang",
    },
    longDescription: {
      en: "Adjectives with two or more syllables take **more** — *more beautiful*, *more important* — not an **-er** ending.",
      vi: "[VI TBD — CC4]",
      ja: "日本語の「〜より」はすべての形容詞に同じように使えます。英語では、2音節以上の長い形容詞の比較級は **-er** ではなく **more** で作ります。**more beautiful**（より美しい）、**more important**（より重要）— **beautifuler** や **importanter** とは言いません。短い形容詞（**tall → taller**、**big → bigger**）と長い形容詞でルールが異なることに注意してください。",
      id: "Kata sifat dengan dua suku kata atau lebih menggunakan **more** — *more beautiful*, *more important* — bukan akhiran **-er**.",
    },
    exampleWrong: "This is beautifuler than that one.",
    exampleRight: "This is more beautiful than that one.",
    linkedRoomId: null,
  },

  vi_l1_many_with_uncount: {
    tag: "vi_l1_many_with_uncount",
    shortLabel: {
      en: "**much** with uncountables",
      vi: "[VI TBD — CC4]",
      id: "**much** dengan yang tidak bisa dihitung",
    },
    longDescription: {
      en: "Uncountable nouns (**water**, **money**, **advice**, **music**) take **much**, not **many**. *Many* is only for countable plurals.",
      vi: "[VI TBD — CC4]",
      id: "Kata benda yang tidak bisa dihitung (**water**, **money**, **advice**, **music**) menggunakan **much**, bukan **many**. *Many* hanya untuk kata benda jamak yang bisa dihitung.",
    },
    exampleWrong: "How many water do you drink?",
    exampleRight: "How much water do you drink?",
    linkedRoomId: null,
  },

  vi_l1_geographical_article: {
    tag: "vi_l1_geographical_article",
    shortLabel: {
      en: "**the** with country names",
      vi: "[VI TBD — CC4]",
      id: "**the** dengan nama negara",
    },
    longDescription: {
      en: "Most country names take no article (**Vietnam**, **Japan**), but a few plural-sounding ones do (**the Philippines**, **the USA**, **the Netherlands**).",
      vi: "[VI TBD — CC4]",
      id: "Kebanyakan nama negara tidak memakai artikel (**Vietnam**, **Japan**), tapi beberapa yang terdengar jamak memakainya (**the Philippines**, **the USA**, **the Netherlands**).",
    },
    exampleWrong: "I live in the Vietnam.",
    exampleRight: "I live in Vietnam.",
    linkedRoomId: null,
  },

  vi_l1_generic_plural: {
    tag: "vi_l1_generic_plural",
    shortLabel: {
      en: "Generic = plural",
      vi: "[VI TBD — CC4]",
      id: "Umum = jamak",
    },
    longDescription: {
      en: "To talk about something in general, English uses the bare plural — *I like **dogs***, not *I like dog*.",
      vi: "[VI TBD — CC4]",
      id: "Untuk membicarakan sesuatu secara umum, bahasa Inggris menggunakan bentuk jamak tanpa artikel — *I like **dogs***, bukan *I like dog*.",
    },
    exampleWrong: "I like dog.",
    exampleRight: "I like dogs.",
    linkedRoomId: null,
  },

  vi_l1_double_negative: {
    tag: "vi_l1_double_negative",
    shortLabel: {
      en: "One negative per clause",
      vi: "[VI TBD — CC4]",
      id: "Satu negatif per klausa",
    },
    longDescription: {
      en: "Standard English uses only **one** negative word per clause. *I don't have **no** money* → *I don't have **any** money*.",
      vi: "[VI TBD — CC4]",
      id: "Bahasa Inggris standar hanya menggunakan **satu** kata negatif per klausa. *I don't have **no** money* → *I don't have **any** money*.",
    },
    exampleWrong: "I don't have no money.",
    exampleRight: "I don't have any money.",
    linkedRoomId: null,
  },

  vi_l1_negative_inversion: {
    tag: "vi_l1_negative_inversion",
    shortLabel: {
      en: "Negative inversion",
      vi: "[VI TBD — CC4]",
      id: "Inversi negatif",
    },
    longDescription: {
      en: "When a negative adverbial like **never**, **seldom**, **rarely**, or **not only** opens the sentence, the subject and auxiliary invert — *Never **have I** seen…*",
      vi: "[VI TBD — CC4]",
      id: "Saat kata keterangan negatif seperti **never**, **seldom**, **rarely**, atau **not only** membuka kalimat, subjek dan kata bantu dibalik — *Never **have I** seen…*",
    },
    exampleWrong: "Never I have seen such a view.",
    exampleRight: "Never have I seen such a view.",
    linkedRoomId: null,
  },

  vi_l1_adverb_before_subject: {
    tag: "vi_l1_adverb_before_subject",
    shortLabel: {
      en: "Frequency adverb after subject",
      vi: "[VI TBD — CC4]",
      id: "Kata keterangan frekuensi setelah subjek",
    },
    longDescription: {
      en: "Frequency adverbs like **always**, **usually**, **sometimes** come **after** the subject in English — *I **always** go*, not *Always I go*.",
      vi: "[VI TBD — CC4]",
      id: "Bahasa Indonesia sering menempatkan kata keterangan di awal kalimat: **Biasanya saya pergi**. Bahasa Inggris menempatkan kata keterangan frekuensi **setelah** subjek: **I usually go** — bukan **Usually I go**.",
    },
    exampleWrong: "Always I go to school by bus.",
    exampleRight: "I always go to school by bus.",
    linkedRoomId: null,
  },

  // NOTE FOR CC4: causative "had + obj + bare verb" is rare in
  // everyday English — weight the VN explanation toward make / made /
  // let. Detector accepts "had" too, but the teaching message should
  // reflect frequency. Per CC7 peer review.
  vi_l1_make_let_bare: {
    tag: "vi_l1_make_let_bare",
    shortLabel: {
      en: "**make / let** + bare verb",
      vi: "[VI TBD — CC4]",
      id: "**make / let** + kata kerja dasar",
    },
    longDescription: {
      en: "After **make**, **let**, and causative **have**, English uses the **bare verb** — no **to**. *She made me **cry***, not *She made me to cry*.",
      vi: "[VI TBD — CC4]",
      id: "Setelah **make**, **let**, dan kausatif **have**, bahasa Inggris menggunakan **kata kerja dasar** — tanpa **to**. *She made me **cry***, bukan *She made me to cry*.",
    },
    exampleWrong: "She made me to cry.",
    exampleRight: "She made me cry.",
    linkedRoomId: null,
  },

  vi_l1_too_vs_very: {
    tag: "vi_l1_too_vs_very",
    shortLabel: {
      en: "**too** vs **very**",
      vi: "[VI TBD — CC4]",
      ja: "**too**（〜すぎる）vs **very**（とても）",
      id: "**too** vs **very**",
    },
    longDescription: {
      en: "**Too** implies excess (there's a problem). For a simple strong intensifier, use **very**. *I am **very** happy to see you*, not *too happy*.",
      vi: "[VI TBD — CC4]",
      ja: "日本語の「とても」は単純な強調にも過剰にも使えます。英語の **too** は「〜すぎる（問題がある）」という否定的な過剰を意味します。単なる「とても」の強調には **very** を使います。**I am very happy to see you**（お会いできてとても嬉しいです）— **too happy** は「嬉しすぎて問題がある」という含みになり不自然です。",
      id: "**Too** mengandung arti berlebihan (ada masalah). Untuk penguat biasa, gunakan **very**. *I am **very** happy to see you*, bukan *too happy*.",
    },
    exampleWrong: "I am too happy to see you.",
    exampleRight: "I am very happy to see you.",
    linkedRoomId: null,
  },

  vi_l1_a_vs_an_vowel: {
    tag: "vi_l1_a_vs_an_vowel",
    shortLabel: {
      en: "**a** vs **an** by sound",
      vi: "[VI TBD — CC4]",
      id: "**a** vs **an** berdasarkan bunyi",
    },
    longDescription: {
      en: "Use **a** before a consonant **sound** and **an** before a vowel **sound**. Listen, don't just look at the letter — *an **h**our* (silent h), *a **u**niversity* (starts with a y-sound).",
      vi: "[VI TBD — CC4]",
      id: "Gunakan **a** sebelum bunyi **konsonan** dan **an** sebelum bunyi **vokal**. Dengarkan, jangan hanya lihat hurufnya — *an **h**our* (h tidak bersuara), *a **u**niversity* (diawali bunyi y).",
    },
    exampleWrong: "I ate a apple for lunch.",
    exampleRight: "I ate an apple for lunch.",
    linkedRoomId: null,
  },

  vi_l1_one_of_the_singular: {
    tag: "vi_l1_one_of_the_singular",
    shortLabel: {
      en: "**one of the + plural**",
      vi: "[VI TBD — CC4]",
      id: "**one of the + jamak**",
    },
    longDescription: {
      en: "After **one of the / my / her / his / their**, the noun is plural — even though the whole phrase refers to one item.",
      vi: "[VI TBD — CC4]",
      id: "Setelah **one of the / my / her / his / their**, kata bendanya jamak — meskipun seluruh frasa merujuk ke satu benda.",
    },
    exampleWrong: "She is one of the student in my class.",
    exampleRight: "She is one of the students in my class.",
    linkedRoomId: null,
  },

  vi_l1_each_singular: {
    tag: "vi_l1_each_singular",
    shortLabel: {
      en: "**each / every** + singular",
      vi: "[VI TBD — CC4]",
      id: "**each / every** + tunggal",
    },
    longDescription: {
      en: "**Each** and **every** always take a singular noun and a singular verb — *each **student is***, not *each students are*.",
      vi: "[VI TBD — CC4]",
      id: "**Each** dan **every** selalu diikuti kata benda tunggal dan kata kerja tunggal — *each **student is***, bukan *each students are*.",
    },
    exampleWrong: "Each students are happy.",
    exampleRight: "Each student is happy.",
    linkedRoomId: null,
  },

  vi_l1_been_vs_gone: {
    tag: "vi_l1_been_vs_gone",
    shortLabel: {
      en: "**been to** vs **gone to**",
      vi: "[VI TBD — CC4]",
      id: "**been to** vs **gone to**",
    },
    longDescription: {
      en: "**gone to** = went there and is still away. **been to** = visited and came back. A sentence with **times**, **before**, or **ever** almost always needs **been to**.",
      vi: "[VI TBD — CC4]",
      id: "**gone to** = pergi ke sana dan masih di sana. **been to** = pernah ke sana dan sudah kembali. Kalimat dengan **times**, **before**, atau **ever** hampir selalu perlu **been to**.",
    },
    exampleWrong: "He has gone to Paris three times.",
    exampleRight: "He has been to Paris three times.",
    linkedRoomId: null,
  },

  vi_l1_tag_polarity: {
    tag: "vi_l1_tag_polarity",
    shortLabel: {
      en: "Tag-question polarity",
      vi: "[VI TBD — CC4]",
      ja: "付加疑問文の極性反転",
      id: "Polaritas pertanyaan ekor",
    },
    longDescription: {
      en: "Tag questions flip polarity: positive statement → negative tag, negative statement → positive tag. *You like it, **don't you**?* — not *do you?*",
      vi: "[VI TBD — CC4]",
      ja: "日本語の「〜ね」「〜よね」は肯定文にも否定文にも同じ形で付けられます。英語の付加疑問文は、肯定文には否定の付加疑問、否定文には肯定の付加疑問と、**極性を反転**させます。**You like it, don't you?**（好きですよね？）— **do you?** ではありません。**You don't smoke, do you?**（タバコは吸わないですよね？）— **don't you?** ではありません。",
      id: "Pertanyaan ekor membalik polaritas: kalimat positif → ekor negatif, kalimat negatif → ekor positif. *You like it, **don't you**?* — bukan *do you?*",
    },
    exampleWrong: "You like it, do you?",
    exampleRight: "You like it, don't you?",
    linkedRoomId: null,
  },

  vi_l1_no_article_generic: {
    tag: "vi_l1_no_article_generic",
    shortLabel: {
      en: "No **the** with generic nouns",
      vi: "[VI TBD — CC4]",
      id: "Tanpa **the** untuk kata benda umum",
    },
    longDescription: {
      en: "Abstract and generic nouns (**life**, **love**, **music**, **nature**) usually take no article when they mean the concept in general.",
      vi: "[VI TBD — CC4]",
      id: "Kata benda abstrak dan umum (**life**, **love**, **music**, **nature**) biasanya tidak memakai artikel saat bermakna konsep secara umum.",
    },
    exampleWrong: "The life is hard sometimes.",
    exampleRight: "Life is hard sometimes.",
    linkedRoomId: null,
  },

  vi_l1_superlative_the: {
    tag: "vi_l1_superlative_the",
    shortLabel: {
      en: "**the** + superlative",
      vi: "[VI TBD — CC4]",
      id: "**the** + superlatif",
    },
    longDescription: {
      en: "Superlatives (**best**, **tallest**, **most beautiful**) almost always sit inside a **the + superlative + noun** pattern.",
      vi: "[VI TBD — CC4]",
      id: "Superlatif (**best**, **tallest**, **most beautiful**) hampir selalu berada dalam pola **the + superlatif + kata benda**.",
    },
    exampleWrong: "She is best student in our class.",
    exampleRight: "She is the best student in our class.",
    linkedRoomId: null,
  },

  vi_l1_if_will: {
    tag: "vi_l1_if_will",
    shortLabel: {
      en: "No **will** in the **if**-clause",
      vi: "[VI TBD — CC4]",
      id: "Tanpa **will** di klausa **if**",
    },
    longDescription: {
      en: "In a first-conditional **if**-clause, English uses the present simple — **will** only appears in the main clause.",
      vi: "[VI TBD — CC4]",
      id: "Dalam klausa **if** kondisional tipe pertama, bahasa Inggris menggunakan present simple — **will** hanya muncul di klausa utama.",
    },
    exampleWrong: "If I will go tomorrow, I will tell you.",
    exampleRight: "If I go tomorrow, I will tell you.",
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
