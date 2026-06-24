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
  | "vi_l1_3rd_person_s"
  | "vi_l1_past_ed"
  | "vi_l1_plural_s"
  | "vi_l1_missing_be"
  | "vi_l1_question_no_aux"
  | "vi_l1_missing_article"
  | "vi_l1_possessive_gender"
  | "vi_l1_preposition_transfer"
  | "vi_l1_countable"
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
  | "vi_l1_if_will"
  | "id_l1_present_perfect_vs_past"
  | "id_l1_conditional_unreal"
  | "id_l1_reported_speech"
  | "id_c2_inversion_emphasis"
  | "id_c2_cleft_focus"
  | "id_c2_mixed_conditional"
  | "id_c2_register_consistency"
  | "id_c2_hedging_academic"
  | "ar_l1_present_perfect_vs_past"
  | "ar_l1_conditional_unreal"
  | "ar_l1_reported_speech"
  | "ar_l1_relative_clauses"
  | "ar_l1_prepositions_in_on_at"
  | "ar_c2_inversion_emphasis"
  | "ar_c2_register_consistency"
  | "ar_c2_hedging_academic"
  | "ar_c2_cleft_focus";
  | "hi_l1_missing_article"
  | "hi_l1_preposition_postposition"
  | "hi_l1_wrong_word_order"
  | "hi_l1_since_for_confusion"
  | "hi_l1_continuous_overuse"
  | "hi_l1_present_perfect_vs_simple"
  | "hi_c2_reported_speech_tense"
  | "hi_c2_conditional_backshift"
  | "hi_c2_register_formality"
  | "hi_c2_academic_hedging";
  | "ur_l1_missing_be"
  | "ur_l1_missing_article"
  | "ur_l1_word_order"
  | "ur_l1_plural_s"
  | "ur_l1_past_ed"
  | "ur_l1_3rd_person_s"
  | "ur_l1_preposition"
  | "ur_l1_present_perfect_vs_past"
  | "ur_l1_conditional_mix"
  | "ur_c2_formal_register";
  | "ja_l1_subject_omission"
  | "ja_l1_article_missing"
  | "ja_l1_plural_s"
  | "ja_l1_third_person_s"
  | "ja_l1_missing_be"
  | "ja_l1_present_perfect_vs_past"
  | "ja_l1_conditional_mix"
  | "ja_l1_reported_speech"
  | "ja_c2_inversion_emphasis"
  | "ja_c2_cleft_focus"
  | "ja_c2_register_consistency"
  | "ja_c2_hedging_academic";
  // Korean-native English weakness tags
  | "ko_l1_3rd_person_s"
  | "ko_l1_missing_article"
  | "ko_l1_missing_be"
  | "ko_l1_plural_s"
  | "ko_l1_preposition_transfer"
  | "ko_l1_present_perfect_vs_past"
  | "ko_c2_inversion_emphasis"
  | "ko_c2_cleft_focus"
  | "ko_c2_mixed_conditional"
  | "ko_c2_register_consistency";

export type BilingualText = {
  /** English surface — may contain `**word**` markdown bolding. */
  en: string;
  /** Vietnamese surface — may contain `**word**` markdown bolding. */
  vi: string;
  /** Japanese-native English explanation — optional, for ja-native learners. */
  ja?: string;
  /** Indonesian-native English explanation — optional, for id-native learners. */
  id?: string;
  /** Thai-native English explanation — optional, for th-native learners. */
  th?: string;
  /** Arabic-native English explanation — optional, for ar-native learners. */
  ar?: string;
  /** Hindi-native English explanation — optional, for hi-native learners. */
  hi?: string;
  /** Urdu-native English explanation — optional, for ur-native learners. */
  ur?: string;
  /** Korean-native English explanation — optional, for ko-native learners. */
  ko?: string;
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
  vi_l1_3rd_person_s: {
      tag: "vi_l1_3rd_person_s",
      shortLabel: {
        en: "Subject-verb agreement",
        vi: "Chia động từ theo chủ ngữ",
        th: "เติม -s กับ he/she/it",
        id: "Kesesuaian subjek-kata kerja",
      },
      longDescription: {
        en: "Vietnamese verbs don't change form for person. English adds **-s** to the verb when the subject is **he**, **she**, or **it**.",
        vi: "Động từ tiếng Việt không thay đổi theo ngôi. Trong tiếng Anh, động từ thêm **-s** khi chủ ngữ là **he**, **she**, **it**.",
        th: "ภาษาไทยไม่เปลี่ยนรูปกริยาตามประธาน แต่ภาษาอังกฤษ A1 ต้องเติม **-s** หรือ **-es** เมื่อประธานเป็น **he**, **she**, หรือ **it** เช่น **She goes**.",
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
        th: "อดีตด้วย **-ed**",
        id: "Past tense dengan **-ed**",
      },
      longDescription: {
        en: "Vietnamese shows past time with words like **hôm qua** or **đã** — the verb doesn't change. English changes the verb itself: **work → worked**.",
        vi: "Tiếng Việt diễn tả quá khứ bằng các từ như **hôm qua** hoặc **đã**, không đổi hình thức động từ. Tiếng Anh thay đổi chính động từ: **work → worked**.",
        th: "ภาษาไทยใช้คำบอกเวลาอย่าง **เมื่อวาน** หรือ **แล้ว** เพื่อบอกอดีต แต่ภาษาอังกฤษ A1 ต้องเปลี่ยนกริยาเอง เช่น **work → worked**.",
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
        th: "คำนามหลายชิ้นเติม **-s**",
        id: "Kata benda jamak dengan **-s**",
      },
      longDescription: {
        en: "Vietnamese nouns don't change when counting more than one — markers like **các** or **những** do the work. English adds **-s** to most nouns when there's more than one: **book → books**.",
        vi: "Danh từ tiếng Việt không đổi khi đếm nhiều hơn một — dấu hiệu số nhiều nằm ở các từ như **các** hoặc **những**. Tiếng Anh thêm **-s** vào hầu hết danh từ khi số lượng nhiều hơn một: **book → books**.",
        th: "ภาษาไทยมักไม่เปลี่ยนรูปคำนามเมื่อมีหลายชิ้น แต่ภาษาอังกฤษ A1 เติม **-s** หรือ **-es** กับคำนามพหูพจน์ เช่น **book → books**.",
        id: "Kata benda bahasa Indonesia tidak berubah saat menghitung lebih dari satu — penanda seperti **para** atau **beberapa** yang melakukan tugas itu. Bahasa Inggris menambahkan **-s** ke sebagian besar kata benda saat jumlahnya lebih dari satu: **book → books**.",
      },
      exampleWrong: "I have two book.",
      exampleRight: "I have two books.",
      linkedRoomId: "english_a1_a109",
    },
  vi_l1_missing_be: {
      tag: "vi_l1_missing_be",
      shortLabel: {
        en: 'Missing "to be"',
        vi: 'Thiếu động từ "to be"',
        th: "อย่าลืม **am / is / are**",
        id: 'Kehilangan "to be"',
      },
      longDescription: {
        en: "Vietnamese often skips the **to be** verb — **Cô ấy giáo viên** is a complete sentence. English always needs one: **She is a teacher**.",
        vi: "Tiếng Việt mình hay bỏ động từ **to be** — **Cô ấy giáo viên** là đủ câu. Tiếng Anh luôn cần có: **She is a teacher**.",
        th: "ภาษาไทยพูดว่า **เขาเหนื่อย** ได้โดยไม่ต้องมี verb be แต่ภาษาอังกฤษต้องมี **am**, **is**, หรือ **are** เช่น **She is tired**.",
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
        th: "คำถามใช้ **do / does / did**",
        id: "Struktur pertanyaan",
      },
      longDescription: {
        en: "Vietnamese turns a sentence into a question just with **phải không?** or a rising tone. English adds **do / does / did** at the front: **Do you like coffee?**",
        vi: "Tiếng Việt mình chỉ cần thêm **phải không?** hoặc đổi ngữ điệu là thành câu hỏi. Tiếng Anh phải đặt **do / does / did** ở đầu câu: **Do you like coffee?**",
        th: "ภาษาไทยทำคำถามด้วยน้ำเสียงหรือคำท้ายประโยคได้ แต่ภาษาอังกฤษ A1 มักต้องใส่ **do**, **does**, หรือ **did** หน้า câu เช่น **Do you like coffee?**.",
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
        th: "ใช้ **a / an / the**",
        id: "Artikel **a / an / the**",
      },
      longDescription: {
        en: "Vietnamese has no articles — nouns stand alone. English almost always needs **a**, **an**, or **the** before a singular countable noun.",
        vi: "Tiếng Việt mình không có mạo từ — danh từ đứng một mình là được. Tiếng Anh gần như luôn cần **a**, **an**, hoặc **the** trước danh từ đếm được số ít.",
        th: "ภาษาไทยไม่มี article แบบอังกฤษ แต่ภาษาอังกฤษ A1 มักต้องมี **a**, **an**, หรือ **the** หน้าคำนามนับได้เอกพจน์ เช่น **a book**, **an apple**.",
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
  vi_l1_to_verb_confusion: {
      tag: "vi_l1_to_verb_confusion",
      shortLabel: {
        en: "When to use **to + verb**",
        vi: "Khi nào dùng **to + verb**",
        th: "ใช้ **want to** + verb",
        id: "Kapan pakai **to + verb**",
      },
      longDescription: {
        en: "Vietnamese doesn't mark an infinitive. English uses **to + verb** after verbs like **want**, **need**, **plan** — but NOT after modals like **can** or **must**.",
        vi: "Tiếng Việt mình không có dạng động từ nguyên mẫu. Tiếng Anh dùng **to + verb** sau **want**, **need**, **plan**, nhưng KHÔNG dùng sau các modal như **can** hoặc **must**.",
        th: "ภาษาไทยพูดว่า **อยากไป** ได้ตรง ๆ แต่ภาษาอังกฤษใช้ **want to + verb** เช่น **I want to go** ไม่ใช่ **I want go**.",
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
        th: "หลัง **can** ไม่ใช้ **to**",
        id: "**Can / must** + kata kerja dasar",
      },
      longDescription: {
        en: "Vietnamese **có thể** / **phải** sits right before the verb with no extra word. English modals like **can** and **must** take the plain verb — no **to** in between.",
        vi: "Tiếng Việt mình chỉ cần **có thể** / **phải** rồi động từ. Tiếng Anh các modal như **can**, **must** đi với động từ gốc — không có **to** ở giữa.",
        th: "ภาษาอังกฤษ A1 ใช้ **can + กริยารูปธรรมดา** โดยไม่ใส่ **to** และไม่เติม **-s** เช่น **She can swim**.",
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
        th: "ใช้ **There is / There are**",
        id: "**There is** vs **there are**",
      },
      longDescription: {
        en: "Vietnamese **có** stays the same whether there's one thing or many. English switches: **there is** for one, **there are** for two or more.",
        vi: "Tiếng Việt mình dùng **có** cho cả một và nhiều. Tiếng Anh đổi: **there is** với một, **there are** với hai trở lên.",
        th: "ภาษาไทยใช้ **มี** ได้ทั้งหนึ่งสิ่งและหลายสิ่ง แต่ภาษาอังกฤษต้องเลือก **There is** สำหรับหนึ่งสิ่ง และ **There are** สำหรับหลายสิ่ง.",
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
        th: "**everyone** ใช้กริยาเอกพจน์",
        id: "**Everyone** itu tunggal",
      },
      longDescription: {
        en: "Vietnamese **mọi người** feels plural because it means many people. In English, **everyone** and **everybody** take a singular verb: **everyone is happy**.",
        vi: "Tiếng Việt mình **mọi người** nghe như số nhiều vì nói về nhiều người. Tiếng Anh **everyone** và **everybody** đi với động từ số ít: **everyone is happy**.",
        th: "**everyone** หมายถึงทุกคน แต่ในไวยากรณ์อังกฤษถือเป็นเอกพจน์ จึงใช้ **is** หรือกริยาเติม **-s** เช่น **Everyone likes it**.",
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
  id_l1_present_perfect_vs_past: {
      tag: "id_l1_present_perfect_vs_past",
      shortLabel: {
        en: "Present perfect vs past simple",
        vi: "Present perfect vs past simple",
        id: "Present perfect vs past simple",
        hi: "Present perfect और past simple",
      },
      longDescription: {
        en: "Indonesian **sudah** covers both 'I ate' and 'I have eaten.' English splits them: use **past simple** when a specific past time is named (**yesterday**, **last week**, **this morning**); use **present perfect** for past actions with present relevance and no specific time.",
        vi: "Tiếng Indonesia dùng **sudah** cho cả 'I ate' và 'I have eaten.' Tiếng Anh phân biệt: dùng **past simple** khi có thời gian cụ thể trong quá khứ; dùng **present perfect** khi hành động quá khứ còn liên quan đến hiện tại và không có thời gian cụ thể.",
        id: "Bahasa Indonesia menggunakan **sudah** untuk 'I ate' dan 'I have eaten.' Bahasa Inggris membedakannya: gunakan **past simple** saat waktu lampau spesifik disebutkan (**yesterday**, **last week**, **this morning**); gunakan **present perfect** untuk tindakan lampau yang masih relevan sekarang tanpa waktu spesifik.",
        hi: "हिंदी की तरह Indonesian में भी **sudah** 'I ate' और 'I have eaten' दोनों को cover करता है। English इन्हें अलग करता है: जब कोई specific past time बताया गया हो तब **past simple**; जब past action का present से संबंध हो और कोई specific time न बताया गया हो, तब **present perfect**।",
      },
      exampleWrong: "I have eaten breakfast this morning.",
      exampleRight: "I ate breakfast this morning.",
      linkedRoomId: null,
    },
  id_l1_conditional_unreal: {
      tag: "id_l1_conditional_unreal",
      shortLabel: {
        en: "Unreal conditionals (Type 2)",
        vi: "Câu điều kiện không có thật (Type 2)",
        id: "Pengandaian tidak nyata (Type 2)",
        hi: "Unreal conditional (Type 2)",
      },
      longDescription: {
        en: "Indonesian **kalau… maka…** uses the same structure for real and unreal conditions. English marks unreal / hypothetical conditions with **If + past tense, would + base verb** — never mix past with **will**.",
        vi: "Tiếng Indonesia **kalau… maka…** dùng cùng cấu trúc cho cả điều kiện thật và không thật. Tiếng Anh đánh dấu điều kiện không thật bằng **If + quá khứ, would + động từ gốc** — không trộn quá khứ với **will**.",
        id: "Bahasa Indonesia menggunakan **kalau… maka…** dengan struktur yang sama untuk kondisi nyata dan tidak nyata. Bahasa Inggris menandai kondisi tidak nyata/hipotetis dengan **If + past tense, would + kata kerja dasar** — jangan campur past dengan **will**.",
        hi: "हिंदी की तरह Indonesian का **kalau… maka…** real और unreal दोनों conditions के लिए एक जैसी संरचना रखता है। English में unreal/hypothetical conditions के लिए **If + past tense, would + base verb** अनिवार्य है — past के साथ **will** कभी न मिलाएँ।",
      },
      exampleWrong: "If I had money, I will buy a car.",
      exampleRight: "If I had money, I would buy a car.",
      linkedRoomId: null,
    },
  id_l1_reported_speech: {
      tag: "id_l1_reported_speech",
      shortLabel: {
        en: "Reported speech tense shift",
        vi: "Lùi thì trong câu tường thuật",
        id: "Pergeseran tenses di kalimat tidak langsung",
        hi: "Reported speech में tense बदलना",
      },
      longDescription: {
        en: "Indonesian reports speech without changing the verb tense — **Dia bilang dia lapar** keeps present tense. English backshifts the tense: **She said she was hungry**, not **she is hungry**.",
        vi: "Tiếng Indonesia tường thuật không đổi thì động từ — **Dia bilang dia lapar** giữ nguyên thì hiện tại. Tiếng Anh lùi thì: **She said she was hungry**, không phải **she is hungry**.",
        id: "Bahasa Indonesia melaporkan ucapan tanpa mengubah tense kata kerja — **Dia bilang dia lapar** tetap menggunakan present tense. Bahasa Inggris menggeser tense ke belakang: **She said she was hungry**, bukan **she is hungry**.",
        hi: "हिंदी की तरह Indonesian में भी reported speech में verb tense नहीं बदलता — **Dia bilang dia lapar** में present tense जस का तस रहता है। English में tense backshift ज़रूरी है: **She said she was hungry**, न कि **she is hungry**।",
      },
      exampleWrong: "She said she is tired.",
      exampleRight: "She said she was tired.",
      linkedRoomId: null,
    },
  id_c2_inversion_emphasis: {
        tag: "id_c2_inversion_emphasis",
        shortLabel: {
          en: "Inversion for emphasis",
          vi: "Đảo ngữ nhấn mạnh",
          id: "Inversi untuk penekanan",
          hi: "ज़ोर देने के लिए inversion",
        },
        longDescription: {
          en: "Indonesian fronts adverbs without changing word order (**Mungkin dia sudah pergi** keeps subject-verb intact). English inverts subject and auxiliary after negative/restrictive adverbials like **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances**. Inversion signals emphasis and formality — a C2 feature that separates proficient from native-like writing.",
          vi: "Tiếng Việt đưa trạng từ lên đầu câu mà không đảo trật tự từ (**Có lẽ anh ấy đã đi rồi** giữ nguyên chủ ngữ-động từ). Tiếng Anh đảo chủ ngữ và trợ động từ sau các trạng từ phủ định/hạn chế như **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances**. Đảo ngữ là dấu hiệu nhấn mạnh và trang trọng — kỹ năng cấp C2 phân biệt người thành thạo với người viết như bản ngữ.",
          id: "Bahasa Indonesia meletakkan kata keterangan di depan tanpa mengubah urutan kata (**Mungkin dia sudah pergi** tetap subjek-kata kerja). Bahasa Inggris membalik subjek dan kata bantu setelah kata keterangan negatif/restriktif seperti **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances**. Inversi menandakan penekanan dan formalitas — fitur level C2 yang membedakan penulis mahir dari penulis seperti penutur asli.",
          hi: "हिंदी और Indonesian दोनों में क्रिया विशेषण को आगे लाने पर शब्द क्रम नहीं बदलता। English में **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances** जैसे negative/restrictive adverbials के बाद subject और auxiliary की अदला-बदली (inversion) होती है। Inversion ज़ोर और औपचारिकता का संकेत है — यह C2 स्तर की विशेषता है।",
        },
        exampleWrong: "Never I have seen such dedication.",
        exampleRight: "Never have I seen such dedication.",
        linkedRoomId: null,
      },
  id_c2_cleft_focus: {
        tag: "id_c2_cleft_focus",
        shortLabel: {
          en: "Cleft sentences for focus",
          vi: "Câu chẻ nhấn mạnh",
          id: "Kalimat cleft untuk fokus",
          hi: "फ़ोकस के लिए cleft sentences",
        },
        longDescription: {
          en: "Indonesian uses **yang** to highlight (**Yang memecahkan jendela itu John**). English has a richer system: **It-clefts** (**It was John who broke the window**) pull one element into focus; **Wh-clefts** (**What I need is more time**) package a whole idea as the subject. At C2, choosing the right cleft structure controls what the reader notices first.",
          vi: "Tiếng Việt dùng **chính… là…** để nhấn mạnh (**Chính John là người làm vỡ cửa sổ**). Tiếng Anh có hệ thống phong phú hơn: **It-cleft** (**It was John who broke the window**) kéo một yếu tố vào tiêu điểm; **Wh-cleft** (**What I need is more time**) đóng gói cả một ý thành chủ ngữ. Ở cấp C2, chọn đúng cấu trúc cleft cho phép bạn kiểm soát chính xác điều người đọc chú ý đầu tiên.",
          id: "Bahasa Indonesia menggunakan **yang** untuk menyoroti (**Yang memecahkan jendela itu John**). Bahasa Inggris punya sistem yang lebih kaya: **It-cleft** (**It was John who broke the window**) menarik satu elemen ke fokus; **Wh-cleft** (**What I need is more time**) mengemas seluruh ide sebagai subjek. Di level C2, memilih struktur cleft yang tepat memungkinkan kamu mengontrol persis apa yang pertama kali pembaca perhatikan.",
          hi: "हिंदी में **ही** या **जो… वह** ज़ोर देने के लिए इस्तेमाल होता है। English में दो मुख्य cleft structures हैं: **It-cleft** (**It was John who broke the window**) एक तत्व पर फ़ोकस खींचता है; **Wh-cleft** (**What I need is more time**) पूरे विचार को subject बना देता है। C2 स्तर पर, सही cleft structure चुनना पाठक का ध्यान नियंत्रित करता है।",
        },
        exampleWrong: "What I need it is more time.",
        exampleRight: "What I need is more time.",
        linkedRoomId: null,
      },
  id_c2_mixed_conditional: {
        tag: "id_c2_mixed_conditional",
        shortLabel: {
          en: "Mixed conditionals",
          vi: "Câu điều kiện hỗn hợp",
          id: "Conditional campuran",
        },
        longDescription: {
          en: "Indonesian expresses hypotheticals with **kalau** or **seandainya** without tense shifts. English mixed conditionals combine past condition with present result (**If I had studied, I would be a doctor now**) or present condition with past result (**If I were taller, I would have joined the team**). Matching the tense pair is a C2 hallmark.",
          vi: "Tiếng Việt diễn tả giả định với **nếu** hoặc **giá như** không cần lùi thì. Câu điều kiện hỗn hợp trong tiếng Anh kết hợp điều kiện quá khứ với kết quả hiện tại (**If I had studied, I would be a doctor now**) hoặc điều kiện hiện tại với kết quả quá khứ (**If I were taller, I would have joined the team**). Ghép đúng cặp thì là dấu ấn của trình độ C2.",
          id: "Bahasa Indonesia mengungkapkan pengandaian dengan **kalau** atau **seandainya** tanpa pergeseran tenses. Conditional campuran dalam bahasa Inggris menggabungkan syarat lampau dengan hasil sekarang (**If I had studied, I would be a doctor now**) atau syarat sekarang dengan hasil lampau (**If I were taller, I would have joined the team**). Mencocokkan pasangan tense dengan tepat adalah ciri khas level C2.",
        },
        exampleWrong: "If I had studied harder at school, I will be a doctor now.",
        exampleRight: "If I had studied harder at school, I would be a doctor now.",
        linkedRoomId: null,
      },
  id_c2_register_consistency: {
        tag: "id_c2_register_consistency",
        shortLabel: {
          en: "Register consistency",
          vi: "Nhất quán văn phong",
          id: "Konsistensi register",
        },
        longDescription: {
          en: "Indonesian switches between formal and informal registers more freely than English (**saya** → **gue** mid-conversation). In English, mixing **gonna** with **furthermore**, or **kids** with **offspring**, in the same paragraph sounds jarring. C2 writers maintain one register throughout a text.",
          vi: "Tiếng Việt chuyển đổi giữa văn phong trang trọng và thân mật tự do hơn tiếng Anh (**tôi** → **tao** giữa câu chuyện). Trong tiếng Anh, pha trộn **gonna** với **furthermore**, hoặc **kids** với **offspring**, trong cùng một đoạn nghe rất chói tai. Người viết C2 duy trì một văn phong nhất quán xuyên suốt văn bản.",
          id: "Bahasa Indonesia berganti antara register formal dan informal lebih bebas daripada bahasa Inggris (**saya** → **gue** di tengah percakapan). Dalam bahasa Inggris, mencampur **gonna** dengan **furthermore**, atau **kids** dengan **offspring**, dalam paragraf yang sama terdengar janggal. Penulis C2 menjaga satu register konsisten di seluruh teks.",
        },
        exampleWrong: "The aforementioned findings are super interesting and you're gonna love them.",
        exampleRight: "The aforementioned findings are highly compelling and readers will find them valuable.",
        linkedRoomId: null,
      },
  id_c2_hedging_academic: {
        tag: "id_c2_hedging_academic",
        shortLabel: {
          en: "Academic hedging",
          vi: "Giảm nhẹ học thuật",
          id: "Hedging akademik",
        },
        longDescription: {
          en: "Indonesian academic writing often states claims directly (**hal ini membuktikan bahwa…**). English academic convention softens claims with hedging: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**. At C2, knowing when and how to hedge is as important as knowing the grammar.",
          vi: "Văn học thuật tiếng Việt thường nêu nhận định trực tiếp (**điều này chứng minh rằng…**). Quy ước học thuật tiếng Anh làm mềm nhận định bằng giảm nhẹ: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**. Ở cấp C2, biết khi nào và cách giảm nhẹ cũng quan trọng như biết ngữ pháp.",
          id: "Tulisan akademik bahasa Indonesia sering menyatakan klaim secara langsung (**hal ini membuktikan bahwa…**). Konvensi akademik bahasa Inggris melembutkan klaim dengan hedging: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**. Di level C2, tahu kapan dan bagaimana melakukan hedging sama pentingnya dengan tahu tata bahasa.",
        },
        exampleWrong: "This proves that social media causes depression in teenagers.",
        exampleRight: "This suggests that social media may contribute to depressive symptoms in some teenagers.",
        linkedRoomId: null,
      },

  // ── Arabic-native English ───────────────────────────────────────────

  ar_l1_present_perfect_vs_past: {
      tag: "ar_l1_present_perfect_vs_past",
      shortLabel: {
        en: "Present perfect vs past simple",
        vi: "Present perfect vs past simple",
        ar: "المضارع التام مقابل الماضي البسيط",
      },
      longDescription: {
        en: "Arabic expresses past actions with a single past tense (الماضي). English splits them: use **past simple** when a specific past time is named (**yesterday**, **last week**, **this morning**); use **present perfect** for past actions with present relevance and no specific time.",
        vi: "Tiếng Ả Rập dùng thì quá khứ (الماضي) cho mọi hành động quá khứ. Tiếng Anh phân biệt: dùng **past simple** khi có thời gian cụ thể trong quá khứ; dùng **present perfect** khi hành động quá khứ còn liên quan đến hiện tại và không có thời gian cụ thể.",
        ar: "تستخدم اللغة العربية زمن الماضي لكل الأفعال الماضية. أما الإنجليزية فتفصل بينهما: استخدم **past simple** عند وجود زمن محدد في الماضي (**yesterday**, **last week**, **this morning**)؛ واستخدم **present perfect** للأفعال الماضية المرتبطة بالحاضر دون زمن محدد.",
  ur_l1_missing_be: {
      tag: "ur_l1_missing_be",
        en: "Missing \"to be\"",
        vi: "Thiếu động từ \"to be\"",
        ur: "\"to be\" کا استعمال ضروری ہے",
        en: "Urdu can drop the copula **hai** (**ہے**) when the meaning is clear — **میں خوش** (main khush) is common for 'I am happy.' English always needs **am**, **is**, or **are** before an adjective, noun, or location. Leaving out the verb sounds incomplete.",
        vi: "Tiếng Urdu có thể bỏ động từ nối **hai** (**ہے**) khi nghĩa rõ ràng — **میں خوش** (main khush) là cách nói phổ biến nghĩa 'tôi vui.' Tiếng Anh luôn cần **am**, **is**, hoặc **are** trước tính từ, danh từ, hoặc địa điểm. Bỏ động từ làm câu nghe chưa hoàn chỉnh.",
        ur: "اردو میں جب معنی واضح ہو تو فعل ناقص **ہے** کو چھوڑا جا سکتا ہے — **میں خوش** عام ہے۔ انگریزی میں ہمیشہ **am**، **is**، یا **are** صفت، اسم یا مقام سے پہلے درکار ہوتا ہے۔ فعل کا چھوڑنا جملے کو نامکمل بناتا ہے۔",
      exampleWrong: "She very happy today.",
      exampleRight: "She is very happy today.",
      linkedRoomId: null,
    },
  ur_l1_missing_article: {
      tag: "ur_l1_missing_article",
        en: "Articles **a / an / the**",
        vi: "Mạo từ **a / an / the**",
        ur: "حروف تعریف **a / an / the**",
        en: "Urdu has no definite or indefinite articles. A noun like **کتاب** (kitaab) can mean either 'a book' or 'the book' depending on context. English almost always requires **a**, **an**, or **the** before a singular countable noun — especially the first time you mention something.",
        vi: "Tiếng Urdu không có mạo từ xác định hay không xác định. Một danh từ như **کتاب** (kitaab) có thể mang nghĩa 'một cuốn sách' hoặc 'cuốn sách đó' tuỳ ngữ cảnh. Tiếng Anh hầu như luôn cần **a**, **an**, hoặc **the** trước danh từ đếm được số ít — đặc biệt là lần đầu nhắc đến một vật.",
        ur: "اردو میں حروف تعریف (articles) نہیں ہوتے۔ ایک اسم جیسے **کتاب** سیاق و سباق کے مطابق 'ایک کتاب' یا 'وہ کتاب' دونوں معنی دے سکتا ہے۔ انگریزی میں تقریباً ہمیشہ واحد قابل شمار اسم سے پہلے **a**، **an**، یا **the** کی ضرورت ہوتی ہے، خاص طور پر جب پہلی بار کسی چیز کا ذکر کریں۔",
      exampleWrong: "I bought car yesterday.",
      exampleRight: "I bought a car yesterday.",
  ur_l1_word_order: {
      tag: "ur_l1_word_order",
        en: "Word order: Subject → Verb → Object",
        vi: "Trật tự từ: Chủ ngữ → Động từ → Tân ngữ",
        ur: "ترتیب کلمات: فاعل → فعل → مفعول",
        en: "Urdu is a Subject-Object-Verb (SOV) language — **میں کتاب پڑھتا ہوں** (I book read). English is Subject-Verb-Object (SVO) — **I read a book**. The verb moves before the object in English. This deep structural difference means Urdu speakers naturally place the verb at the end, which sounds wrong in English.",
        vi: "Tiếng Urdu là ngôn ngữ Chủ ngữ-Tân ngữ-Động từ (SOV) — **میں کتاب پڑھتا ہوں** (tôi sách đọc). Tiếng Anh là Chủ ngữ-Động từ-Tân ngữ (SVO) — **I read a book**. Động từ chuyển lên trước tân ngữ trong tiếng Anh. Sự khác biệt cấu trúc sâu này khiến người nói tiếng Urdu tự nhiên đặt động từ ở cuối, và điều đó nghe sai trong tiếng Anh.",
        ur: "اردو ایک فاعل-مفعول-فعل (SOV) زبان ہے — **میں کتاب پڑھتا ہوں**۔ انگریزی فاعل-فعل-مفعول (SVO) ہے — **I read a book**۔ فعل مفعول سے پہلے آتا ہے۔ یہ گہرا ساختی فرق اردو بولنے والوں کو فطری طور پر فعل کو آخر میں رکھنے پر مجبور کرتا ہے، جو انگریزی میں غلط لگتا ہے۔",
      exampleWrong: "I a book read yesterday.",
      exampleRight: "I read a book yesterday.",
  ur_l1_plural_s: {
      tag: "ur_l1_plural_s",
        en: "Plural nouns with **-s**",
        vi: "Danh từ số nhiều với **-s**",
        ur: "جمع اسماء **-s** سے",
        en: "Urdu marks plurals with suffixes like **-یں** (-ein), **-ات** (-aat), or internal changes — **کتابیں** (kitaabein), **مرد** → **مرد** (mard — mardon). None of these map to English's simple **-s**. English adds **-s** or **-es** to most nouns: **book → books**, **box → boxes**. A number like **two** already signals plural, so the noun must also change.",
        vi: "Tiếng Urdu đánh dấu số nhiều bằng hậu tố như **-یں** (-ein), **-ات** (-aat), hoặc biến đổi bên trong — **کتابیں** (kitaabein). Không có cách nào khớp với **-s** đơn giản của tiếng Anh. Tiếng Anh thêm **-s** hoặc **-es** vào hầu hết danh từ: **book → books**.",
        ur: "اردو میں جمع کے لیے لاحقے جیسے **-یں**، **-ات**، یا داخلی تبدیلیاں استعمال ہوتی ہیں — **کتابیں**، **مرد** سے **مردوں**۔ ان میں سے کوئی بھی انگریزی کے سادہ **-s** سے مطابقت نہیں رکھتا۔ انگریزی میں اکثر اسماء کے آخر میں **-s** یا **-es** لگایا جاتا ہے: **book → books**, **box → boxes**۔",
      exampleWrong: "I have two dog.",
      exampleRight: "I have two dogs.",
  ur_l1_past_ed: {
      tag: "ur_l1_past_ed",
        en: "Past tense with **-ed**",
        vi: "Thì quá khứ với **-ed**",
        ur: "فعل ماضی **-ed** کے ساتھ",
        en: "Urdu shows past time by changing the verb into a perfective participle that agrees with the subject's gender — **میں نے کام کیا** (maine kaam kiya — masculine) vs **میں نے کام کیا** (maine kaam ki — feminine). English adds **-ed** to regular verbs regardless of gender: **work → worked**. Irregular verbs must be memorised: **go → went**, **eat → ate**.",
        vi: "Tiếng Urdu diễn tả quá khứ bằng cách chuyển động từ thành phân từ hoàn thành có chia theo giống của chủ ngữ — giống đực so với giống cái. Tiếng Anh thêm **-ed** vào động từ thường bất kể giống: **work → worked**. Động từ bất quy tắc phải học thuộc lòng: **go → went**, **eat → ate**.",
        ur: "اردو میں ماضی کے لیے فعل کو اسم مفعول کامل میں بدلا جاتا ہے جو فاعل کی جنس سے مطابقت رکھتا ہے — **میں نے کام کیا** (مذکر) بمقابلہ **میں نے کام کیا** (مونث)۔ انگریزی میں جنس سے قطع نظر **-ed** لگایا جاتا ہے: **work → worked**۔ غیر قاعدہ افعال یاد کرنے پڑتے ہیں: **go → went**, **eat → ate**۔",
      exampleWrong: "Yesterday I work late.",
      exampleRight: "Yesterday I worked late.",
  ur_l1_3rd_person_s: {
      tag: "ur_l1_3rd_person_s",
        en: "Subject-verb agreement (he/she/it + **-s**)",
        vi: "Chia động từ ngôi thứ ba số ít (he/she/it + **-s**)",
        ur: "فاعل فعل مطابقت (وہ + **-s**)",
        en: "Urdu verbs agree with the subject's **gender and number**, not person. **وہ جاتا ہے** (woh jata hai — 'he goes') and **وہ جاتی ہے** (woh jati hai — 'she goes') differ by gender, and there is no **-s** ending for third-person singular. English adds **-s** to the verb when the subject is **he**, **she**, or **it**: **he goes**, **she runs**.",
        vi: "Động từ tiếng Urdu chia theo **giống và số** của chủ ngữ, không theo ngôi. Không có đuôi **-s** cho ngôi thứ ba số ít. Tiếng Anh thêm **-s** vào động từ khi chủ ngữ là **he**, **she**, hoặc **it**: **he goes**, **she runs**.",
        ur: "اردو میں فعل فاعل کی جنس اور عدد کے مطابق بدلتا ہے، شخص کے مطابق نہیں۔ **وہ جاتا ہے** اور **وہ جاتی ہے** جنس میں مختلف ہیں، اور غائب واحد کے لیے کوئی **-s** کا اضافہ نہیں ہوتا۔ انگریزی میں جب فاعل **he**، **she**، یا **it** ہو تو فعل کے آخر میں **-s** لگایا جاتا ہے: **he goes**, **she runs**۔",
      exampleWrong: "She go to school every day.",
      exampleRight: "She goes to school every day.",
  ur_l1_preposition: {
      tag: "ur_l1_preposition",
        en: "Prepositions **in / on / at**",
        vi: "Giới từ **in / on / at**",
        ur: "حروف جار **in / on / at**",
        en: "Urdu uses **postpositions** — particles that come **after** the noun: **میز پر** (meez par — table **on**), **گھر میں** (ghar **mein** — house **in**), **ساڑھے تین بجے** (saadhe teen **baje** — half three **at** ). English uses **prepositions** before the noun: **on** the table, **in** the house, **at** 3:30. The placement is flipped, and English splits the work across three words where Urdu uses different postpositions for each context.",
        vi: "Tiếng Urdu dùng **hậu giới từ** — tiểu từ đứng **sau** danh từ: **میز پر** (meez par — bàn **trên**). Tiếng Anh dùng tiền giới từ **trước** danh từ: **on** the table. Vị trí bị đảo ngược và tiếng Anh chia ba (**in / on / at**) trong khi tiếng Urdu có các hậu giới từ riêng.",
        ur: "اردو میں **حروف جار** اسم کے **بعد** آتے ہیں: **میز پر**، **گھر میں**، **تین بجے**۔ انگریزی میں یہ اسم سے **پہلے** آتے ہیں: **on** the table، **in** the house، **at** 3 o'clock۔ مقام الٹ ہے، اور انگریزی اس کام کو تین لفظوں میں تقسیم کرتی ہے (**in / on / at**) جبکہ اردو میں ہر سیاق کے لیے الگ حرف جار ہے۔",
      exampleWrong: "I will meet you in Monday.",
      exampleRight: "I will meet you on Monday.",
  ur_l1_present_perfect_vs_past: {
      tag: "ur_l1_present_perfect_vs_past",
        vi: "Hiện tại hoàn thành vs quá khứ đơn",
        ur: "ماضی قریب بمقابلہ ماضی مطلق",
        en: "Urdu uses the perfective aspect — **میں نے کھایا** (maine khaaya) — to talk about any completed action, whether yesterday or just now. English splits: **simple past** for actions at a specific finished time (**I ate pho yesterday**), and **present perfect** for actions with present relevance or no specific time (**I have eaten pho before**). The Urdu perfective covers both.",
        vi: "Tiếng Urdu dùng thể hoàn thành — **میں نے کھایا** (maine khaaya) — để nói về bất kỳ hành động nào đã hoàn thành. Tiếng Anh phân chia: **quá khứ đơn** cho hành động ở thời điểm cụ thể trong quá khứ, và **hiện tại hoàn thành** cho hành động còn liên quan đến hiện tại hoặc không có thời gian cụ thể.",
        ur: "اردو میں فعل ماضی کامل — **میں نے کھایا** — کسی بھی مکمل ہونے والی کارروائی کے لیے استعمال ہوتا ہے، چاہے وہ کل ہوئی ہو یا ابھی۔ انگریزی میں تقسیم ہے: **ماضی مطلق** ماضی کے مخصوص وقت پر، اور **ماضی قریب** حال سے تعلق رکھنے والی کارروائیوں کے لیے۔ اردو کا فعل ماضی کامل دونوں صورتوں پر محیط ہے۔",
      exampleWrong: "I have eaten breakfast this morning.",
      exampleRight: "I ate breakfast this morning.",
  ar_l1_conditional_unreal: {
      tag: "ar_l1_conditional_unreal",
        en: "Unreal conditionals (Type 2)",
        vi: "Câu điều kiện không có thật (Type 2)",
        ar: "الجمل الشرطية غير الحقيقية",
        en: "Arabic uses **لو** + past for both real and unreal conditions. English marks unreal / hypothetical conditions with **If + past tense, would + base verb** — never mix past with **will**.",
        vi: "Tiếng Ả Rập dùng **لو** + quá khứ cho cả điều kiện thật và không thật. Tiếng Anh đánh dấu điều kiện không thật bằng **If + quá khứ, would + động từ gốc** — không trộn quá khứ với **will**.",
        ar: "تستخدم العربية **لو** مع الفعل الماضي للشرط الحقيقي وغير الحقيقي على حد سواء. أما الإنجليزية فتميز الشرط غير الحقيقي بـ **If + past tense, would + فعل أساسي** — ولا تخلط الماضي مع **will** أبداً.",
      exampleWrong: "If I had money, I will buy a car.",
      exampleRight: "If I had money, I would buy a car.",
  ar_l1_reported_speech: {
      tag: "ar_l1_reported_speech",
        en: "Reported speech tense shift",
        vi: "Lùi thì trong câu tường thuật",
        ar: "نقل الكلام وتغيير الزمن",
        en: "Arabic often keeps the original tense in reported speech (**قال إنه متعب** stays present). English backshifts the tense: **He said he was tired**, not **he is tired**.",
        vi: "Tiếng Ả Rập thường giữ nguyên thì trong câu tường thuật (**قال إنه متعب** giữ thì hiện tại). Tiếng Anh lùi thì: **He said he was tired**, không phải **he is tired**.",
        ar: "كثيراً ما تبقي العربية على الزمن الأصلي في الكلام المنقول (**قال إنه متعب** يبقى في الحاضر). أما الإنجليزية فتزيح الزمن إلى الماضي: **He said he was tired**، وليس **he is tired**.",
      exampleWrong: "She said she is tired.",
      exampleRight: "She said she was tired.",
  ar_l1_relative_clauses: {
      tag: "ar_l1_relative_clauses",
        en: "Relative clauses (who/which/that)",
        vi: "Mệnh đề quan hệ (who/which/that)",
        ar: "جمل الوصل (who/which/that)",
        en: "Arabic relative clauses use a resumptive pronoun that English drops: **الرجل الذي رأيته** (lit. 'the man who I saw him'). English omits the object pronoun entirely: **the man who I saw** — adding **him** is a common Arabic-speaker error.",
        vi: "Mệnh đề quan hệ tiếng Ả Rập dùng đại từ nối mà tiếng Anh lược bỏ: **الرجل الذي رأيته** (dịch sát: 'the man who I saw him'). Tiếng Anh bỏ hẳn đại từ tân ngữ: **the man who I saw** — thêm **him** là lỗi phổ biến của người học gốc Ả Rập.",
        ar: "تستخدم جمل الوصل في العربية ضميراً عائداً تحذفه الإنجليزية: **الرجل الذي رأيته** (حرفياً: 'the man who I saw him'). أما الإنجليزية فتحذف ضمير المفعول تماماً: **the man who I saw** — وإضافة **him** خطأ شائع لدى المتعلمين العرب.",
      exampleWrong: "The man who I saw him is my teacher.",
      exampleRight: "The man who I saw is my teacher.",
  ar_l1_prepositions_in_on_at: {
      tag: "ar_l1_prepositions_in_on_at",
        en: "Prepositions in / on / at",
        vi: "Giới từ in / on / at",
        ar: "حروف الجر in / on / at",
        en: "Arabic uses **في** for most spatial and temporal relations where English splits across **in** (enclosed/large), **on** (surface/day), and **at** (point/time). Arabic speakers often default to **in** for everything.",
        vi: "Tiếng Ả Rập dùng **في** cho hầu hết quan hệ không gian và thời gian, trong khi tiếng Anh chia ra **in** (không gian kín/lớn), **on** (bề mặt/ngày), và **at** (điểm/thời gian cụ thể). Người học gốc Ả Rập thường mặc định dùng **in** cho mọi thứ.",
        ar: "تستخدم العربية **في** لمعظم العلاقات المكانية والزمانية، بينما تفرق الإنجليزية بين **in** (للمساحات المغلقة/الكبيرة)، و**on** (للأسطح/الأيام)، و**at** (للنقاط/الأوقات المحددة). ويميل المتعلمون العرب لاستخدام **in** في كل الحالات.",
      exampleWrong: "I will meet you in Monday in the bus stop.",
      exampleRight: "I will meet you on Monday at the bus stop.",
  ar_c2_inversion_emphasis: {
        tag: "ar_c2_inversion_emphasis",
        shortLabel: {
          en: "Inversion for emphasis",
          vi: "Đảo ngữ nhấn mạnh",
          ar: "العكس للتأكيد",
        },
        longDescription: {
          en: "Arabic fronts adverbials without structural change (**أبداً لم أرَ شيئاً كهذا** keeps the sentence flexible). English inverts subject and auxiliary after negative/restrictive adverbials like **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances**. Inversion signals emphasis and formality — a C2 feature that separates proficient from native-like writing.",
          vi: "Tiếng Ả Rập đưa trạng từ lên đầu câu mà không thay đổi cấu trúc. Tiếng Anh đảo chủ ngữ và trợ động từ sau các trạng từ phủ định/hạn chế như **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances**. Đảo ngữ là dấu hiệu nhấn mạnh và trang trọng — kỹ năng cấp C2.",
          ar: "تقدم العربية الظروف إلى بداية الجملة دون تغيير هيكلي (**أبداً لم أرَ شيئاً كهذا**). أما الإنجليزية فتعكس الفاعل والفعل المساعد بعد الظروف النافية/المقيدة مثل **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances**. العكس علامة تأكيد ورسمية — وهي مهارة مستوى C2.",
        exampleWrong: "Never I have seen such dedication.",
        exampleRight: "Never have I seen such dedication.",
        linkedRoomId: null,
  ar_c2_register_consistency: {
        tag: "ar_c2_register_consistency",
          en: "Register consistency",
          vi: "Nhất quán văn phong",
          ar: "اتساق المستوى اللغوي",
          en: "Arabic moves naturally between formal (فصحى) and colloquial (عامية) registers, often within the same text. In English, mixing **gonna** with **furthermore**, or **kids** with **offspring**, in the same paragraph sounds jarring. C2 writers maintain one register throughout a text.",
          vi: "Tiếng Ả Rập chuyển đổi tự nhiên giữa văn phong trang trọng (فصحى) và thân mật (عامية), thường trong cùng một văn bản. Trong tiếng Anh, pha trộn **gonna** với **furthermore**, hoặc **kids** với **offspring**, trong cùng một đoạn nghe rất chói tai. Người viết C2 duy trì một văn phong nhất quán.",
          ar: "تنتقل العربية بطبيعتها بين الفصحى والعامية، وغالباً في النص الواحد. أما في الإنجليزية، فخلط **gonna** مع **furthermore**، أو **kids** مع **offspring**، في نفس الفقرة يبدو نشازاً. كتّاب مستوى C2 يحافظون على مستوى لغوي واحد متسق في كامل النص.",
        exampleWrong: "The aforementioned findings are super interesting and you're gonna love them.",
        exampleRight: "The aforementioned findings are highly compelling and readers will find them valuable.",
  ar_c2_hedging_academic: {
        tag: "ar_c2_hedging_academic",
          en: "Academic hedging",
          vi: "Giảm nhẹ học thuật",
          ar: "التحفظ الأكاديمي",
          en: "Arabic academic writing, especially in the humanities, often states conclusions directly (**هذا يثبت أن…**). English academic convention softens claims with hedging: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**. At C2, knowing when and how to hedge is as important as knowing the grammar.",
          vi: "Văn học thuật tiếng Ả Rập thường nêu kết luận trực tiếp (**هذا يثبت أن…**). Quy ước học thuật tiếng Anh làm mềm nhận định bằng giảm nhẹ: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**. Ở cấp C2, biết khi nào và cách giảm nhẹ cũng quan trọng như biết ngữ pháp.",
          ar: "كثيراً ما تذكر الكتابة الأكاديمية العربية الاستنتاجات مباشرة (**هذا يثبت أن…**). أما الأعراف الأكاديمية الإنجليزية فتلطف الادعاءات بالتحفظ: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**. في مستوى C2، معرفة متى وكيف تتحفظ لا تقل أهمية عن معرفة القواعد.",
        exampleWrong: "This proves that social media causes depression in teenagers.",
        exampleRight: "This suggests that social media may contribute to depressive symptoms in some teenagers.",
  ar_c2_cleft_focus: {
        tag: "ar_c2_cleft_focus",
          en: "Cleft sentences for focus",
          vi: "Câu chẻ nhấn mạnh",
          ar: "الجمل المشقوقة للبؤرة",
          en: "Arabic uses word order and particles like **إنّ** for emphasis. English has a richer system: **It-clefts** (**It was John who broke the window**) pull one element into focus; **Wh-clefts** (**What I need is more time**) package a whole idea as the subject. At C2, choosing the right cleft structure controls what the reader notices first.",
          vi: "Tiếng Ả Rập dùng trật tự từ và tiểu từ như **إنّ** để nhấn mạnh. Tiếng Anh có hệ thống phong phú hơn: **It-cleft** (**It was John who broke the window**) kéo một yếu tố vào tiêu điểm; **Wh-cleft** (**What I need is more time**) đóng gói cả một ý thành chủ ngữ. Ở cấp C2, chọn đúng cấu trúc cleft cho phép bạn kiểm soát chính xác điều người đọc chú ý đầu tiên.",
          ar: "تستخدم العربية ترتيب الكلمات وأدوات مثل **إنّ** للتأكيد. أما الإنجليزية فتملك نظاماً أغنى: **It-cleft** (**It was John who broke the window**) تسحب عنصراً واحداً إلى البؤرة؛ و**Wh-cleft** (**What I need is more time**) تغلف فكرة كاملة كفاعل. في مستوى C2، اختيار بنية cleft الصحيحة يمكنك من التحكم في أول ما يلاحظه القارئ.",
        exampleWrong: "What I need it is more time.",
        exampleRight: "What I need is more time.",
  hi_l1_missing_article: {
      tag: "hi_l1_missing_article",
        en: "Missing articles (a/an/the)",
        vi: "Thiếu mạo từ (a/an/the)",
        hi: "Articles (a/an/the) का प्रयोग न करना",
        en: "Hindi has no articles — **एक लड़की** (ek ladki, 'a girl') is grammatical without any article. In English, singular countable nouns must carry **a**, **an**, or **the**. Hindi speakers often drop articles entirely because their native grammar has no equivalent category.",
        vi: "Tiếng Hindi không có mạo từ — **एक लड़की** (ek ladki, 'một cô gái') đúng ngữ pháp mà không cần mạo từ. Trong tiếng Anh, danh từ đếm được số ít bắt buộc có **a**, **an**, hoặc **the**. Người nói tiếng Hindi thường bỏ mạo từ hoàn toàn vì ngữ pháp mẹ đẻ không có phạm trù tương đương.",
        hi: "हिंदी में articles (a/an/the) नहीं होते — **एक लड़की** बिना किसी article के व्याकरणिक रूप से सही है। English में singular countable noun के साथ **a**, **an**, या **the** लगाना अनिवार्य है। Hindi speakers अक्सर articles को पूरी तरह छोड़ देते हैं क्योंकि उनकी मातृभाषा के व्याकरण में यह श्रेणी मौजूद ही नहीं है।",
      exampleWrong: "She is doctor and works in hospital.",
      exampleRight: "She is a doctor and works in a hospital.",
  hi_l1_preposition_postposition: {
      tag: "hi_l1_preposition_postposition",
        en: "Preposition vs postposition",
        vi: "Giới từ và hậu từ",
        hi: "Preposition और postposition का फ़र्क",
        en: "Hindi uses **postpositions** that come after the noun — **मेज़ पर** (mez par, literally 'table on'). English uses **prepositions** before the noun — **on the table**. This reversed word order causes Hindi speakers to misplace prepositions or use the wrong one, especially in complex sentences.",
        vi: "Tiếng Hindi dùng **hậu từ** đứng sau danh từ — **मेज़ पर** (mez par, nghĩa đen 'bàn trên'). Tiếng Anh dùng **giới từ** trước danh từ — **on the table**. Trật tự từ đảo ngược này khiến người nói tiếng Hindi đặt sai vị trí giới từ hoặc dùng sai giới từ, đặc biệt trong câu phức tạp.",
        hi: "हिंदी में संबंध सूचक शब्द (**postpositions**) संज्ञा के बाद आते हैं — **मेज़ पर** (mez par, शाब्दिक अर्थ 'table on')। English में **prepositions** संज्ञा से पहले आते हैं — **on the table**। यह उल्टा शब्द क्रम Hindi speakers को गलत जगह preposition डालने या गलत preposition चुनने पर मजबूर कर देता है, खासकर लंबे वाक्यों में।",
      exampleWrong: "I am going market to.",
      exampleRight: "I am going to the market.",
  hi_l1_wrong_word_order: {
      tag: "hi_l1_wrong_word_order",
        en: "Subject-Object-Verb transfer",
        vi: "Nhầm trật tự SOV → SVO",
        hi: "SOV से SVO क्रम की गलती",
        en: "Hindi's basic word order is **Subject-Object-Verb** (SOV) — **मैंने खाना खाया** (I food ate). English is **Subject-Verb-Object** (SVO) — **I ate food**. Hindi speakers, especially at lower levels, may place the verb at the end of English sentences, creating structures like 'I food ate' or 'She book is reading.'",
        vi: "Trật tự từ cơ bản của tiếng Hindi là **Chủ ngữ - Tân ngữ - Động từ** (SOV) — **मैंने खाना खाया** (tôi thức ăn đã ăn). Tiếng Anh là **Chủ ngữ - Động từ - Tân ngữ** (SVO) — **I ate food**. Người nói tiếng Hindi, đặc biệt ở trình độ thấp, thường đặt động từ cuối câu tiếng Anh, tạo ra cấu trúc như 'I food ate' hoặc 'She book is reading.'",
        hi: "हिंदी का मूल वाक्य क्रम **Subject-Object-Verb** (SOV) है — **मैंने खाना खाया** (मैंने-खाना-खाया)। English **Subject-Verb-Object** (SVO) है — **I ate food** (मैंने-खाया-खाना)। Hindi speakers, खासकर शुरुआती स्तर पर, अक्सर English वाक्यों के अंत में verb रख देते हैं, जिससे 'I food ate' या 'She book is reading' जैसी संरचनाएँ बन जाती हैं।",
      exampleWrong: "She her homework is doing.",
      exampleRight: "She is doing her homework.",
  hi_l1_since_for_confusion: {
      tag: "hi_l1_since_for_confusion",
        en: '"Since" vs "for" confusion',
        vi: 'Nhầm "since" và "for"',
        hi: '"Since" और "for" में अंतर',
        en: "Hindi uses **से** (se) for both 'since' and 'for' — **दो घंटे से** can mean 'for two hours' or 'since two [o\'clock].' English splits this: **since** + point in time (since Monday, since 3pm), **for** + duration (for two hours, for three days). Hindi speakers often default to 'since' everywhere because it feels like the more literal translation of से.",
        vi: "Tiếng Hindi dùng **से** (se) cho cả 'since' và 'for' — **दो घंटे से** có thể nghĩa là 'for two hours' hoặc 'since two [o\'clock].' Tiếng Anh phân biệt: **since** + mốc thời gian (since Monday, since 3pm), **for** + khoảng thời gian (for two hours, for three days). Người nói tiếng Hindi thường mặc định dùng 'since' cho mọi trường hợp vì nó cảm giác như bản dịch sát nghĩa hơn của từ से.",
        hi: "हिंदी में **से** (se) 'since' और 'for' दोनों के लिए इस्तेमाल होता है — **दो घंटे से** का मतलब 'for two hours' या 'since two [o\'clock]' दोनों हो सकता है। English इसे अलग करता है: **since** + समय बिंदु (since Monday, since 3pm), **for** + अवधि (for two hours, for three days)। Hindi speakers अक्सर हर जगह 'since' लगा देते हैं क्योंकि यह 'से' का ज़्यादा शाब्दिक अनुवाद लगता है।",
      exampleWrong: "I have been waiting since two hours.",
      exampleRight: "I have been waiting for two hours.",
  hi_l1_continuous_overuse: {
      tag: "hi_l1_continuous_overuse",
        en: "Continuous tense overuse",
        vi: "Lạm dụng thì tiếp diễn",
        hi: "Continuous tense का अति प्रयोग",
        en: "Hindi uses continuous/progressive forms more freely than English — stative verbs like **जानना** (jaanna, 'to know') routinely appear in continuous (**मैं जान रहा हूँ**, 'I am knowing'). English restricts the continuous to dynamic actions; 'I am knowing,' 'I am understanding,' 'I am wanting' are all ungrammatical. The correct forms are **I know**, **I understand**, **I want**.",
        vi: "Tiếng Hindi dùng thì tiếp diễn tự do hơn tiếng Anh — động từ trạng thái như **जानना** (jaanna, 'biết') thường xuyên xuất hiện ở dạng tiếp diễn (**मैं जान रहा हूँ**, 'I am knowing'). Tiếng Anh giới hạn thì tiếp diễn cho hành động động; 'I am knowing,' 'I am understanding,' 'I am wanting' đều sai ngữ pháp. Dạng đúng là **I know**, **I understand**, **I want**.",
        hi: "हिंदी में continuous/progressive tense का प्रयोग English से कहीं ज़्यादा खुले रूप में होता है — **जानना** जैसे stative verbs भी अक्सर continuous में आते हैं (**मैं जान रहा हूँ**)। English में continuous सिर्फ dynamic actions के लिए है; 'I am knowing,' 'I am understanding,' 'I am wanting' सब अव्याकरणिक हैं। सही रूप हैं **I know**, **I understand**, **I want**।",
      exampleWrong: "I am not understanding this problem.",
      exampleRight: "I don't understand this problem.",
  hi_l1_present_perfect_vs_simple: {
      tag: "hi_l1_present_perfect_vs_simple",
        vi: "Hiện tại hoàn thành và quá khứ đơn",
        hi: "Present perfect और past simple का फ़र्क",
        en: "Hindi uses a single structure (**मैंने खाना खा लिया**) that can convey both 'I ate' and 'I have eaten.' English splits them: use **past simple** when a specific past time is named (**yesterday**, **last week**, **at 3pm**); use **present perfect** for past actions with present relevance and no specific time marker.",
        vi: "Tiếng Hindi dùng một cấu trúc duy nhất (**मैंने खाना खा लिया**) để diễn tả cả 'I ate' và 'I have eaten.' Tiếng Anh phân biệt: dùng **past simple** khi có thời gian cụ thể trong quá khứ (**yesterday**, **last week**, **at 3pm**); dùng **present perfect** khi hành động quá khứ còn liên quan đến hiện tại và không có mốc thời gian cụ thể.",
        hi: "हिंदी में एक ही संरचना (**मैंने खाना खा लिया**) 'I ate' और 'I have eaten' दोनों का भाव दे सकती है। English इन्हें अलग करता है: जब कोई specific past time बताया गया हो (**yesterday**, **last week**, **at 3pm**) तब **past simple**; जब past action का present से संबंध हो और कोई specific time न बताया गया हो, तब **present perfect**।",
      exampleWrong: "I have eaten breakfast at 7am this morning.",
      exampleRight: "I ate breakfast at 7am this morning.",
  hi_c2_reported_speech_tense: {
      tag: "hi_c2_reported_speech_tense",
        en: "Reported speech — no tense backshift",
        vi: "Câu tường thuật — không lùi thì",
        hi: "Reported speech में tense बदलना",
        en: "Hindi keeps the original tense in reported speech — **उसने कहा कि वह बीमार है** (she said that she is sick, present tense stays present). English backshifts the tense: **She said she was sick**, not 'she is sick.' At C2, failing to backshift in formal and academic writing signals non-native proficiency.",
        vi: "Tiếng Hindi giữ nguyên thì trong câu tường thuật — **उसने कहा कि वह बीमार है** (cô ấy nói rằng cô ấy đang ốm, thì hiện tại giữ nguyên). Tiếng Anh lùi thì: **She said she was sick**, không phải 'she is sick.' Ở cấp C2, không lùi thì trong văn viết trang trọng và học thuật là dấu hiệu của người không phải bản ngữ.",
        hi: "हिंदी में reported speech में tense वही रहता है — **उसने कहा कि वह बीमार है** (present tense, 'है' जस का तस)। English में tense backshift होता है: **She said she was sick**, न कि 'she is sick।' C2 स्तर पर, औपचारिक और शैक्षणिक लेखन में backshift न करना non-native proficiency का संकेत है।",
      exampleWrong: "The minister stated that the economy is improving rapidly.",
      exampleRight: "The minister stated that the economy was improving rapidly.",
  hi_c2_conditional_backshift: {
      tag: "hi_c2_conditional_backshift",
        en: "Conditional tense backshift",
        vi: "Lùi thì trong câu điều kiện",
        hi: "Conditional में tense backshift",
        en: "Hindi conditionals use the same tense pattern for real and unreal conditions — **अगर मेरे पास पैसे होते, तो मैं खरीदता** (if I had money, I would buy, using past subjunctive but without the English-style would+have structure). English marks unreal conditions with **If + past tense, would + base verb** — and **never** mixes past with **will**. At C2, mixed conditionals (past condition → present result) add another layer Hindi speakers must consciously learn.",
        vi: "Câu điều kiện tiếng Hindi dùng cùng mẫu thì cho cả điều kiện thật và không thật — **अगर मेरे पास पैसे होते, तो मैं खरीदता** (nếu tôi có tiền, tôi sẽ mua, dùng quá khứ giả định nhưng không có cấu trúc would+have kiểu tiếng Anh). Tiếng Anh đánh dấu điều kiện không thật bằng **If + quá khứ, would + động từ gốc** — và **không bao giờ** trộn quá khứ với **will**. Ở cấp C2, câu điều kiện hỗn hợp (điều kiện quá khứ → kết quả hiện tại) thêm một lớp phức tạp mà người nói tiếng Hindi phải học có ý thức.",
        hi: "हिंदी में conditional sentences में real और unreal दोनों के लिए एक जैसा tense pattern इस्तेमाल होता है — **अगर मेरे पास पैसे होते, तो मैं खरीदता** (past subjunctive, पर English के would+have जैसी संरचना के बिना)। English में unreal conditions के लिए **If + past tense, would + base verb** का नियम है — और past के साथ **will** कभी नहीं मिलता। C2 स्तर पर, mixed conditionals (past condition → present result) एक और परत जोड़ते हैं जिसे Hindi speakers को conscious effort से सीखना पड़ता है।",
      exampleWrong: "If I had more time, I will learn Hindi.",
      exampleRight: "If I had more time, I would learn Hindi.",
  hi_c2_register_formality: {
      tag: "hi_c2_register_formality",
        en: "Register and formality transfer",
        vi: "Chuyển đổi văn phong trang trọng",
        hi: "Formality और register का अंतर",
        en: "Hindi has a three-tier formality system — **आप** (formal), **तुम** (familiar), **तू** (intimate) — all mapping to English 'you.' Hindi speakers often overcompensate in English by adding extra polite phrases (**kindly do the needful**, **please revert back**) that sound unnatural to native ears. English formality comes from sentence structure and word choice, not from stacking politeness markers.",
        vi: "Tiếng Hindi có hệ thống ba cấp độ lịch sự — **आप** (trang trọng), **तुम** (thân mật), **तू** (thân thiết) — tất cả đều dịch thành 'you' trong tiếng Anh. Người nói tiếng Hindi thường bù đắp quá mức trong tiếng Anh bằng cách thêm các cụm từ lịch sự thừa (**kindly do the needful**, **please revert back**) nghe không tự nhiên với người bản ngữ. Sự trang trọng trong tiếng Anh đến từ cấu trúc câu và lựa chọn từ, không phải từ việc xếp chồng các dấu hiệu lịch sự.",
        hi: "हिंदी में formality के तीन स्तर हैं — **आप** (औपचारिक), **तुम** (परिचित), **तू** (अंतरंग) — और ये सब English के 'you' में समा जाते हैं। Hindi speakers अक्सर English में ज़रूरत से ज़्यादा polite phrases जोड़कर क्षतिपूर्ति करते हैं (**kindly do the needful**, **please revert back**) जो native speakers को unnatural लगती हैं। English में formality वाक्य संरचना और शब्द चयन से आती है, politeness markers की तह लगाने से नहीं।",
      exampleWrong: "Kindly do the needful and revert back at the earliest.",
      exampleRight: "Please take care of this and let me know as soon as you can.",
  hi_c2_academic_hedging: {
      tag: "hi_c2_academic_hedging",
        en: "Academic hedging",
        vi: "Giảm nhẹ học thuật",
        hi: "शैक्षणिक लेखन में hedging",
        en: "Hindi academic tradition often states claims directly — **यह सिद्ध करता है कि…** (this proves that…). English academic convention softens claims with hedging: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**. At C2, knowing when and how to hedge is essential — direct claims in English are seen as overconfident rather than authoritative.",
        vi: "Truyền thống học thuật tiếng Hindi thường nêu nhận định trực tiếp — **यह सिद्ध करता है कि…** (điều này chứng minh rằng…). Quy ước học thuật tiếng Anh làm mềm nhận định bằng hedging: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**. Ở cấp C2, biết khi nào và cách hedging là thiết yếu — nhận định trực tiếp trong tiếng Anh bị coi là quá tự tin hơn là có thẩm quyền.",
        hi: "हिंदी की शैक्षणिक परंपरा में दावे अक्सर सीधे कहे जाते हैं — **यह सिद्ध करता है कि…** (this proves that…)। English academic convention में hedging के ज़रिए दावों को नरम किया जाता है: **this suggests that…**, **it could be argued that…**, **the data appear to indicate…**। C2 स्तर पर, कब और कैसे hedging करनी है यह जानना अनिवार्य है — English में सीधे दावे authoritative नहीं, overconfident माने जाते हैं।",
      exampleWrong: "This proves that bilingual education improves cognitive development.",
      exampleRight: "This suggests that bilingual education may contribute to improved cognitive development.",
  ur_l1_conditional_mix: {
      tag: "ur_l1_conditional_mix",
        en: "**If** clauses — match the tenses",
        vi: "Câu **If** — hợp thì",
        ur: "شرطی جملے — زمانی مطابقت",
        en: "Urdu conditional sentences use **اگر… تو** (agar… to) and don't change the verb tense based on real vs unreal meaning. English enforces a strict pattern: real condition → **If + present, will + V**; unreal condition → **If + past, would + V**. Never mix past tense with **will** in the same sentence.",
        vi: "Câu điều kiện tiếng Urdu dùng **اگر… تو** (agar… to) và không đổi thì động từ dựa trên nghĩa thật hay giả. Tiếng Anh có quy tắc nghiêm ngặt: điều kiện có thật → **If + hiện tại, will + V**; điều kiện không thật → **If + quá khứ, would + V**. Không bao giờ trộn quá khứ với **will** trong cùng câu.",
        ur: "اردو میں شرطی جملے **اگر… تو** استعمال کرتے ہیں اور حقیقت یا فرض کی بنیاد پر فعل کا زمانہ نہیں بدلتے۔ انگریزی میں سخت قاعدہ ہے: حقیقت → **If + حال, will + فعل**؛ فرض → **If + ماضی, would + فعل**۔ ایک جملے میں ماضی کو **will** کے ساتھ نہ ملائیں۔",
      exampleWrong: "If I had money, I will buy a house.",
      exampleRight: "If I had money, I would buy a house.",
  ur_c2_formal_register: {
      tag: "ur_c2_formal_register",
        en: "Register consistency",
        vi: "Nhất quán văn phong",
        ur: "انداز بیان کی یکسانیت",
        en: "Urdu makes sharp distinctions between formal and informal address — **آپ** (aap, formal), **تم** (tum, familiar), **تو** (tu, intimate). Urdu speakers may carry this register-sensitivity into English, but the markers are different. English formal register avoids contractions, uses Latinate vocabulary, and maintains consistent tone. Mixing **gonna** with **furthermore** in the same paragraph feels jarring — a C2 writer keeps one register throughout.",
        vi: "Tiếng Urdu phân biệt rõ giữa xưng hô trang trọng và thân mật — **آپ** (aap, trang trọng), **تم** (tum, thân thiết), **تو** (tu, thân mật). Người Urdu có thể mang sự nhạy cảm này sang tiếng Anh. Văn phong trang trọng tiếng Anh tránh viết tắt, dùng từ vựng gốc Latinh, và duy trì giọng điệu nhất quán.",
        ur: "اردو میں رسمی اور غیر رسمی خطاب میں تیز فرق ہے — **آپ** (رسمی)، **تم** (مانوس)، **تو** (بے تکلف)۔ اردو بولنے والے اس حساسیت کو انگریزی میں بھی لا سکتے ہیں۔ انگریزی رسمی انداز مخففات سے گریز کرتا ہے، لاطینی نژاد الفاظ استعمال کرتا ہے، اور یکساں لہجہ برقرار رکھتا ہے — C2 مصنف پوری تحریر میں ایک ہی انداز رکھتا ہے۔",
      exampleWrong: "The aforementioned findings are super interesting and you're gonna love them.",
      exampleRight: "The aforementioned findings are highly compelling and readers will find them valuable.",
  ja_l1_subject_omission: {
      tag: "ja_l1_subject_omission",
        en: "Missing subject",
        vi: "Thiếu chủ ngữ",
        ja: "主語の欠落",
        en: "Japanese routinely drops subjects when they are clear from context — 今日は学校に行く is a complete sentence. English almost always needs an explicit subject. A sentence like **Is raining** or **Went to store** is grammatically incomplete in English, even though the Japanese equivalent feels perfectly natural.",
        vi: "Tiếng Nhật thường xuyên lược bỏ chủ ngữ khi đã rõ từ ngữ cảnh — 今日は学校に行く là một câu hoàn chỉnh. Tiếng Anh hầu như luôn cần chủ ngữ rõ ràng. Một câu như **Is raining** hoặc **Went to store** là không hoàn chỉnh về mặt ngữ pháp trong tiếng Anh, dù câu tương đương trong tiếng Nhật nghe hoàn toàn tự nhiên.",
        ja: "日本語は文脈から明らかな主語を日常的に省略します。「今日は学校に行く」は完全な文です。しかし英語はほぼ常に明示的な主語が必要です。**Is raining** や **Went to store** のような文は英語では文法的に不完全ですが、日本語の相当表現は完全に自然に聞こえるため、日本語話者はこの誤りを犯しがちです。",
      exampleWrong: "Is very hot today.",
      exampleRight: "It is very hot today.",
  ja_l1_article_missing: {
      tag: "ja_l1_article_missing",
        ja: "冠詞 **a / an / the**",
        en: "Japanese has no articles — nouns stand alone with particle markers doing different work. English almost always needs **a**, **an**, or **the** before a singular countable noun. Japanese learners commonly drop articles entirely or use them inconsistently, because the concept of 'article as a required grammar word' doesn't exist in the native language.",
        vi: "Tiếng Nhật không có mạo từ — danh từ đứng một mình và trợ từ đảm nhiệm vai trò khác. Tiếng Anh hầu như luôn cần **a**, **an**, hoặc **the** trước danh từ đếm được số ít. Người Nhật thường bỏ hẳn mạo từ hoặc dùng không nhất quán, vì khái niệm 'mạo từ là từ ngữ pháp bắt buộc' không tồn tại trong tiếng mẹ đẻ.",
        ja: "日本語には冠詞がありません。名詞は単独で立ち、助詞が別の役割を担います。英語では、可算名詞の単数形の前にはほぼ常に **a**、**an**、または **the** が必要です。日本語話者は冠詞を完全に省略したり、一貫性なく使用したりすることがよくあります。母語に「冠詞が必須の文法語」という概念自体が存在しないからです。",
      exampleWrong: "I have car. Car is red.",
      exampleRight: "I have a car. The car is red.",
  ja_l1_plural_s: {
      tag: "ja_l1_plural_s",
        ja: "複数形の **-s**",
        en: "Japanese nouns don't change form for quantity — 本 can mean 'book' or 'books' depending on context. Counters like 三冊 (three books) do the work. English adds **-s** to most nouns when there's more than one. Japanese learners often omit the plural **-s** because their native grammar handles number without changing the noun itself.",
        vi: "Danh từ tiếng Nhật không thay đổi hình thức theo số lượng — 本 có thể là 'quyển sách' hoặc 'những quyển sách' tùy ngữ cảnh. Các từ đếm như 三冊 (ba quyển sách) đảm nhiệm việc đó. Tiếng Anh thêm **-s** vào hầu hết danh từ khi có nhiều hơn một. Người Nhật thường bỏ **-s** số nhiều vì ngữ pháp tiếng mẹ đẻ xử lý số lượng mà không thay đổi bản thân danh từ.",
        ja: "日本語の名詞は数量によって形が変わりません。「本」は文脈によって「book」にも「books」にもなります。「三冊」のような助数詞が数量を表します。英語は複数ある場合、ほとんどの名詞に **-s** を付けます。日本語話者は複数の **-s** を省略しがちです。母語の文法が名詞そのものを変えずに数量を処理するからです。",
      exampleWrong: "I have three book.",
      exampleRight: "I have three books.",
  ja_l1_third_person_s: {
      tag: "ja_l1_third_person_s",
        en: "Subject-verb agreement",
        vi: "Chia động từ theo chủ ngữ",
        ja: "三人称単数現在の **-s**",
        en: "Japanese verbs don't change form for person — 食べる (taberu) is the same for 'I eat,' 'you eat,' and 'she eats.' Politeness level (食べる vs 食べます) is about register, not person. English adds **-s** to the verb when the subject is **he**, **she**, or **it** in present tense. This extra **-s** has no equivalent in Japanese grammar.",
        vi: "Động từ tiếng Nhật không thay đổi theo ngôi — 食べる (taberu) giống nhau cho 'tôi ăn,' 'bạn ăn,' và 'cô ấy ăn.' Mức độ lịch sự (食べる vs 食べます) là về văn phong, không phải ngôi. Tiếng Anh thêm **-s** vào động từ khi chủ ngữ là **he**, **she**, hoặc **it** ở thì hiện tại. **-s** này không có tương đương trong ngữ pháp tiếng Nhật.",
        ja: "日本語の動詞は人称によって形が変わりません。「食べる」は「I eat」「you eat」「she eats」すべてに同じ形です。丁寧体（食べる vs 食べます）は文体の違いであり、人称による変化ではありません。英語では、現在形で主語が **he**、**she**、**it** の場合、動詞に **-s** を付けます。この **-s** は日本語の文法に相当するものがないため、習得が難しいポイントです。",
      exampleWrong: "She eat breakfast every morning.",
      exampleRight: "She eats breakfast every morning.",
  ja_l1_missing_be: {
      tag: "ja_l1_missing_be",
        en: 'Missing "to be"',
        vi: 'Thiếu động từ "to be"',
        ja: 'be動詞の欠落',
        en: "Japanese uses だ or です at the end of noun+adjective sentences — but it can be dropped in casual speech (いい天気ね = 'nice weather'). English always requires **am**, **is**, or **are** in present-tense equative and descriptive sentences. Japanese learners often drop **to be** because the copula pattern works differently in Japanese, especially in casual or shorthand writing.",
        vi: "Tiếng Nhật dùng だ hoặc です ở cuối câu danh từ+tính từ — nhưng có thể bỏ trong văn nói thân mật (いい天気ね = 'thời tiết đẹp nhỉ'). Tiếng Anh luôn cần **am**, **is**, hoặc **are** trong câu miêu tả và đồng nhất ở hiện tại. Người Nhật thường bỏ **to be** vì trợ từ trong tiếng Nhật hoạt động khác, nhất là trong văn viết thân mật hoặc viết tắt.",
        ja: "日本語は名詞＋形容詞の文の最後に「だ」や「です」を使いますが、日常会話では省略されることがよくあります（「いい天気ね」）。英語は現在形の等位文や記述文では常に **am**、**is**、**are** が必要です。日本語話者は **to be** を省略しがちです。日本語のコピュラの働きが異なり、特にカジュアルな会話や短い書き言葉では省略が自然だからです。",
      exampleWrong: "She very tired.",
      exampleRight: "She is very tired.",
  ja_l1_present_perfect_vs_past: {
      tag: "ja_l1_present_perfect_vs_past",
        ja: "現在完了 vs 過去形",
        en: "Japanese た-form covers both 'I ate' (過去形) and 'I have eaten' (現在完了). The distinction is expressed through context or adjuncts, not verb form. English splits them: use **past simple** when a specific past time is named; use **present perfect** for past actions with present relevance and no specific time. Japanese speakers commonly overuse present perfect for past events or use past simple when present perfect is needed.",
        vi: "Dạng た trong tiếng Nhật bao hàm cả 'tôi đã ăn' (quá khứ) và 'tôi đã ăn' (hiện tại hoàn thành). Sự phân biệt được thể hiện qua ngữ cảnh hoặc từ bổ trợ, không phải hình thái động từ. Tiếng Anh phân biệt: dùng **past simple** khi có thời gian cụ thể; dùng **present perfect** cho hành động quá khứ còn liên quan hiện tại và không có thời gian cụ thể.",
        ja: "日本語の「た形」は「昨日食べた」（過去形）と「もう食べた」（現在完了）の両方をカバーします。区別は文脈や副詞によって表現され、動詞の形では区別しません。英語では、特定の過去の時点が明示されている場合は **過去形**、特定の時点がなく過去の動作が現在に関連している場合は **現在完了 (have + 過去分詞)** を使い分けます。日本語話者はこの区別に苦労し、過去の出来事に現在完了を過剰に使ったり、逆に現在完了が必要な場面で過去形を使ってしまうことがよくあります。",
      exampleWrong: "I have visited Kyoto last year.",
      exampleRight: "I visited Kyoto last year.",
  ja_l1_conditional_mix: {
      tag: "ja_l1_conditional_mix",
        en: "Conditional tense mixing",
        vi: "Trộn thì câu điều kiện",
        ja: "条件節の時制の混同",
        en: "Japanese conditionals (〜たら、〜ば、〜なら、〜と) don't change verb form to distinguish real from unreal situations — the conditional marker itself carries the meaning. English marks the difference directly: real conditions use **If + present, will + verb**; unreal/hypothetical conditions use **If + past, would + verb**. Japanese speakers commonly use **will** after a past-tense **if** clause, producing errors like **If I had money, I will buy it**.",
        vi: "Câu điều kiện tiếng Nhật (〜たら、〜ば、〜なら、〜と) không thay đổi hình thái động từ để phân biệt tình huống thật và không thật — bản thân từ nối điều kiện mang ý nghĩa. Tiếng Anh đánh dấu sự khác biệt trực tiếp: điều kiện thật dùng **If + hiện tại, will + động từ**; điều kiện không thật dùng **If + quá khứ, would + động từ**. Người Nhật thường dùng **will** sau mệnh đề **if** ở quá khứ, tạo lỗi như **If I had money, I will buy it**.",
        ja: "日本語の条件表現（〜たら、〜ば、〜なら、〜と）は、現実の条件と非現実の仮定を動詞の形で区別しません。条件の接続詞自体が意味を担います。英語は直接的に区別します：実現可能な条件は **If + 現在形, will + 動詞の原形**、現実に反する仮定は **If + 過去形, would + 動詞の原形** です。日本語話者は、過去形の **if** 節の後に **will** を使ってしまい、「If I had money, I will buy it」のような誤りをよく犯します。これは日本語の「もしお金があったら買う」が時制混在のように聞こえないためです。",
  ja_l1_reported_speech: {
      tag: "ja_l1_reported_speech",
        ja: "間接話法の時制の一致",
        en: "Japanese reports speech using と言った (to itta = 'said') without changing the tense of the quoted content — 彼女は疲れていると言った keeps present tense inside. English backshifts the tense: **She said she was tired**, not **She said she is tired**. The absence of backshifting in Japanese makes this a persistent error even at B2 level.",
        vi: "Tiếng Nhật tường thuật lời nói bằng と言った (to itta = 'đã nói') mà không thay đổi thì của nội dung được trích dẫn — 彼女は疲れていると言った giữ nguyên thì hiện tại. Tiếng Anh lùi thì: **She said she was tired**, không phải **she said she is tired**. Việc thiếu lùi thì trong tiếng Nhật khiến lỗi này kéo dài ngay cả ở trình độ B2.",
        ja: "日本語は「と言った」を使って発言を伝える際、引用される内容の時制を変えません。「彼女は疲れていると言った」は中身の現在形を保持します。英語は時制を一つ過去にずらします（時制の一致）。**She said she was tired** が正しく、**She said she is tired** は誤りです。日本語に時制の一致の概念がないため、この誤りは B2 レベルでも続く傾向があります。",
  ja_c2_inversion_emphasis: {
      tag: "ja_c2_inversion_emphasis",
        en: "Inversion for emphasis",
        vi: "Đảo ngữ nhấn mạnh",
        ja: "倒置による強調",
        en: "Japanese marks emphasis through particles (は、こそ) and word order flexibility without changing the subject-verb sequence. English inverts subject and auxiliary after negative/restrictive adverbials like **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances**. Inversion signals emphasis and formality — a C2 feature that separates proficient from native-like writing. Japanese learners often keep normal word order because Japanese emphasis doesn't require syntactic inversion.",
        vi: "Tiếng Nhật đánh dấu nhấn mạnh qua trợ từ (は、こそ) và trật tự từ linh hoạt mà không thay đổi trình tự chủ ngữ-động từ. Tiếng Anh đảo chủ ngữ và trợ động từ sau các trạng từ phủ định/hạn chế như **never**, **rarely**, **not only**, **hardly**, **no sooner**, **under no circumstances**. Đảo ngữ là dấu hiệu nhấn mạnh và trang trọng — kỹ năng C2. Người Nhật thường giữ nguyên trật tự từ vì tiếng Nhật nhấn mạnh mà không cần đảo ngữ cú pháp.",
        ja: "日本語は助詞（は、こそ）や語順の柔軟性によって強調を表し、主語と動詞の順序は変わりません。英語では、**never**、**rarely**、**not only**、**hardly**、**no sooner**、**under no circumstances** などの否定的・制限的な副詞が文頭に来ると、主語と助動詞を倒置します。この倒置は強調と形式張った文体を示す C2 レベルの特徴です。日本語話者は、日本語の強調が統語的倒置を必要としないため、通常の語順を維持しがちです。",
      exampleWrong: "Never I have seen such a beautiful temple.",
      exampleRight: "Never have I seen such a beautiful temple.",
  ja_c2_cleft_focus: {
      tag: "ja_c2_cleft_focus",
        en: "Cleft sentences for focus",
        vi: "Câu chẻ nhấn mạnh",
        ja: "分裂文による焦点化",
        en: "Japanese uses のは〜だ structure to highlight an element — 窓を割ったのはジョンだ (It was John who broke the window). English cleft sentences follow a different syntactic pattern: **It-clefts** (**It was John who broke the window**) and **Wh-clefts** (**What I need is more time**). While Japanese has a similar concept, the English syntax is different enough that learners produce errors like **What I need it is more time** (adding an extra pronoun).",
        vi: "Tiếng Nhật dùng cấu trúc のは〜だ để nhấn mạnh một yếu tố — 窓を割ったのはジョンだ (Chính John là người làm vỡ cửa sổ). Câu chẻ tiếng Anh tuân theo cú pháp khác: **It-cleft** và **Wh-cleft**. Mặc dù tiếng Nhật có khái niệm tương tự, cú pháp tiếng Anh đủ khác để người học tạo ra lỗi như **What I need it is more time** (thêm đại từ thừa).",
        ja: "日本語は「〜のは〜だ」という構造で要素を焦点化します。「窓を割ったのはジョンだ」（It was John who broke the window）。英語の分裂文は異なる構文パターンに従います。**It-cleft**（**It was John who broke the window**）と **Wh-cleft**（**What I need is more time**）です。日本語にも似た概念はありますが、英語の構文は十分に異なるため、学習者は **What I need it is more time**（余分な代名詞を挿入）のような誤りを犯します。",
      exampleWrong: "What I need it is more time.",
      exampleRight: "What I need is more time.",
  ja_c2_register_consistency: {
      tag: "ja_c2_register_consistency",
        ja: "文体の一貫性",
        en: "Japanese has clear register markers through 敬語 (honorific language) — です・ます体 vs だ体 — and speakers consciously switch between them. However, English register is more subtle: informal contractions and slang vs. formal academic vocabulary don't have clear 'shift' markers. Japanese speakers may mix registers unintentionally in English — using **gonna** in an academic essay or **moreover** in a casual text — because English lacks the explicit register-marking system Japanese has.",
        vi: "Tiếng Nhật có dấu hiệu văn phong rõ ràng qua 敬語 (kính ngữ) — thể です・ます vs thể だ — và người nói có ý thức chuyển đổi giữa chúng. Tuy nhiên, văn phong tiếng Anh tinh tế hơn: các từ rút gọn thân mật và từ vựng học thuật trang trọng không có dấu hiệu 'chuyển đổi' rõ ràng. Người Nhật có thể pha trộn văn phong một cách vô ý trong tiếng Anh.",
        ja: "日本語は敬語を通じて明確な文体の区別があります（です・ます体 vs だ体）。話者は意識的にこれらを切り替えます。しかし、英語の文体はより微妙です。くだけた短縮形やスラングとフォーマルな学術語彙の間には、日本語のような明確な「切り替え標識」がありません。そのため、日本語話者はアカデミックエッセイで **gonna** を使ったり、カジュアルな文章で **moreover** を使うなど、意図せず文体を混在させてしまうことがあります。",
      exampleWrong: "The aforementioned methodology is super cool and you're gonna love it.",
      exampleRight: "The aforementioned methodology is highly effective and yields compelling results.",
  ja_c2_hedging_academic: {
      tag: "ja_c2_hedging_academic",
        ja: "学術的緩和表現",
        en: "Japanese academic writing has its own hedging conventions (〜と考えられる, 〜と思われる), but the stylistic mapping to English is imprecise. Japanese speakers may state claims too directly in English academic writing, mirroring the certainty expressed by Japanese academic particles — or over-hedging by using tentative expressions too frequently. At C2, knowing when and how to hedge in English — **this suggests that…**, **it could be argued that…**, **the data appear to indicate…** — is as important as knowing the grammar.",
        vi: "Văn học thuật tiếng Nhật có quy ước giảm nhẹ riêng (〜と考えられる, 〜と思われる), nhưng ánh xạ phong cách sang tiếng Anh không chính xác. Người Nhật có thể nêu nhận định quá trực tiếp trong văn học thuật tiếng Anh, hoặc ngược lại dùng quá nhiều biểu đạt dè dặt. Ở trình độ C2, biết khi nào và cách giảm nhẹ trong tiếng Anh cũng quan trọng như biết ngữ pháp.",
        ja: "日本語の学術文章にも緩和表現の慣習があります（〜と考えられる、〜と思われる）が、英語への文体マッピングは正確ではありません。日本語話者は、英語の学術文章で主張を直接的に述べすぎたり（日本語の学術助詞が伝える確実性を映して）、逆に tentative な表現を過剰に使ってしまうことがあります。C2レベルでは、**this suggests that…**、**it could be argued that…**、**the data appear to indicate…** など、いつどのように緩和表現を使うかを知ることが、文法知識と同じくらい重要です。",
      exampleWrong: "This experiment proves that the hypothesis is correct.",
      exampleRight: "The results of this experiment suggest that the hypothesis may be correct.",
  // ── Korean-native English ────────────────────────────────────────────
  ko_l1_3rd_person_s: {
      tag: "ko_l1_3rd_person_s",
        ko: "주어-동사 수일치",
        en: "Korean verbs don't change form for person — **가다** stays the same for I, you, he, she. English adds **-s** when the subject is **he**, **she**, or **it**: **she goes**, **he eats**. Forgetting this **-s** is the most common A1 error for Korean learners.",
        vi: "Động từ tiếng Hàn không thay đổi theo ngôi — **가다** giữ nguyên cho tôi, bạn, anh ấy, cô ấy. Tiếng Anh thêm **-s** khi chủ ngữ là **he**, **she**, **it**: **she goes**, **he eats**. Quên **-s** này là lỗi A1 phổ biến nhất của người Hàn.",
        ko: "한국어 동사는 주어에 따라 형태가 변하지 않습니다 — **가다**는 나, 너, 그, 그녀 모두에 그대로 쓰입니다. 하지만 영어는 주어가 **he**, **she**, **it**일 때 동사에 **-s**를 붙입니다: **she goes**, **he eats**. 이 **-s**를 빼먹는 것이 한국인 학습자가 가장 흔히 하는 A1 수준의 실수입니다.",
  ko_l1_missing_article: {
      tag: "ko_l1_missing_article",
        ko: "관사 **a / an / the**",
        en: "Korean has no articles — **책** can mean 'book' or 'a book' or 'the book.' English almost always marks singular countable nouns with **a**, **an**, or **the**. Korean learners frequently drop them because the concept doesn't exist in the native language.",
        vi: "Tiếng Hàn không có mạo từ — **책** có thể là 'book' hoặc 'a book' hoặc 'the book.' Tiếng Anh gần như luôn đánh dấu danh từ đếm được số ít bằng **a**, **an** hoặc **the**. Người Hàn thường bỏ mạo từ vì khái niệm này không tồn tại trong tiếng mẹ đẻ.",
        ko: "한국어에는 관사가 없습니다 — **책** 하나로 'book', 'a book', 'the book'을 모두 표현할 수 있습니다. 하지만 영어는 셀 수 있는 단수 명사 앞에 거의 항상 **a**, **an**, **the**를 붙여야 합니다. 한국인 학습자는 모국어에 없는 개념이기 때문에 관사를 자주 빼먹습니다.",
      exampleWrong: "I have car.",
      exampleRight: "I have a car.",
  ko_l1_missing_be: {
      tag: "ko_l1_missing_be",
        en: "Missing **to be**",
        vi: "Thiếu động từ **to be**",
        ko: "**be동사** 누락",
        en: "Korean can form a complete sentence with a noun + **이다** pattern — **나는 학생** is natural without an explicit 'is.' English always needs a form of **be**: **I am a student**. Korean learners often say 'She busy' instead of 'She is busy.'",
        vi: "Tiếng Hàn có thể tạo câu hoàn chỉnh với danh từ + **이다** — **나는 학생** là tự nhiên mà không cần 'is' rõ ràng. Tiếng Anh luôn cần một dạng của **be**: **I am a student**. Người Hàn thường nói 'She busy' thay vì 'She is busy'.",
        ko: "한국어는 명사 + **이다** 패턴으로 완전한 문장을 만들 수 있습니다 — **나는 학생**이라고 해도 'is' 없이 자연스럽습니다. 하지만 영어는 항상 **be동사**가 필요합니다: **I am a student**. 한국인 학습자는 'She busy'처럼 **be동사**를 빼고 말하는 경우가 많습니다.",
      exampleWrong: "She a teacher.",
      exampleRight: "She is a teacher.",
  ko_l1_plural_s: {
      tag: "ko_l1_plural_s",
        ko: "복수 명사에 **-s** 붙이기",
        en: "Korean doesn't require plural marking when context makes the number clear — **책 세 권** (three book) has no plural marker on the noun. English adds **-s** to most countable nouns when there's more than one: **book → books**. Korean learners often skip the plural **-s**.",
        vi: "Tiếng Hàn không bắt buộc đánh dấu số nhiều khi ngữ cảnh đã rõ số lượng — **책 세 권** (ba sách) không có dấu số nhiều trên danh từ. Tiếng Anh thêm **-s** vào hầu hết danh từ đếm được khi nhiều hơn một: **book → books**. Người Hàn thường bỏ **-s** số nhiều.",
        ko: "한국어는 문맥상 수가 분명하면 복수 표시를 하지 않아도 됩니다 — **책 세 권**에서 명사 '책' 자체에는 복수 표시가 없습니다. 하지만 영어는 하나 이상일 때 대부분의 셀 수 있는 명사에 **-s**를 붙입니다: **book → books**. 한국인 학습자는 이 복수 **-s**를 자주 빼먹습니다.",
      exampleWrong: "I have two book.",
      exampleRight: "I have two books.",
  ko_l1_preposition_transfer: {
      tag: "ko_l1_preposition_transfer",
        ko: "전치사 **in / on / at**",
        en: "Korean uses particles — **에** and **에서** — attached to nouns to show location and time. English uses separate prepositions **in**, **on**, **at** with specific patterns that don't map neatly from Korean. The **에** particle alone maps to all three English prepositions depending on context, which causes confusion.",
        vi: "Tiếng Hàn dùng tiểu từ — **에** và **에서** — gắn vào danh từ để chỉ vị trí và thời gian. Tiếng Anh dùng các giới từ riêng **in**, **on**, **at** với quy tắc cụ thể không khớp hoàn toàn với tiếng Hàn. Riêng tiểu từ **에** có thể tương ứng với cả ba giới từ tiếng Anh tùy theo ngữ cảnh, gây nhầm lẫn.",
        ko: "한국어는 조사 — **에**와 **에서** — 를 명사에 붙여 위치와 시간을 나타냅니다. 영어는 **in**, **on**, **at**이라는 별도의 전치사를 쓰는데, 한국어 조사와 일대일로 대응되지 않습니다. 특히 조사 **에** 하나로 영어 전치사 세 개를 모두 표현할 수 있어서 한국인 학습자에게 혼란을 줍니다.",
      exampleWrong: "I will see you in Monday.",
      exampleRight: "I will see you on Monday.",
  ko_l1_present_perfect_vs_past: {
      tag: "ko_l1_present_perfect_vs_past",
        ko: "현재완료 vs 과거시제",
        en: "Korean uses **-었다/았다** for all completed actions regardless of relevance — the same past suffix covers 'I ate' and 'I have eaten.' English splits them: use **simple past** when a specific past time is named (**yesterday**, **last week**), and **present perfect** when the past action still matters now and no specific time is given.",
        vi: "Tiếng Hàn dùng **-었다/았다** cho mọi hành động đã hoàn thành bất kể mức độ liên quan — cùng một đuôi quá khứ cho cả 'I ate' và 'I have eaten.' Tiếng Anh phân biệt: dùng **simple past** khi có thời gian cụ thể, và **present perfect** khi hành động quá khứ vẫn còn ảnh hưởng đến hiện tại.",
        ko: "한국어는 과거의 모든 동작을 **-었다/았다**로 표현합니다 — 'I ate'와 'I have eaten'을 구분하지 않고 같은 과거형을 씁니다. 하지만 영어는 특정 과거 시점(**yesterday**, **last week**)이 있으면 **단순과거(simple past)**를 쓰고, 과거의 일이 지금도 영향을 미치며 특정 시점이 언급되지 않으면 **현재완료(present perfect)**를 씁니다.",
  ko_c2_inversion_emphasis: {
      tag: "ko_c2_inversion_emphasis",
        ko: "도치를 이용한 강조",
        en: "Korean places adverbs freely without changing word order — **결코 나는 본 적이 없다** keeps subject-verb intact. English inverts subject and auxiliary after negative/restrictive adverbials like **never**, **rarely**, **not only**, **hardly**, **no sooner**. Inversion signals emphasis and formality — a C2 feature that separates proficient from native-like writing.",
        vi: "Tiếng Hàn đặt trạng từ tự do mà không đảo trật tự từ — **결코 나는 본 적이 없다** giữ nguyên chủ ngữ-động từ. Tiếng Anh đảo chủ ngữ và trợ động từ sau các trạng từ phủ định/hạn chế. Đảo ngữ là dấu hiệu nhấn mạnh và trang trọng — kỹ năng cấp C2.",
        ko: "한국어는 부사를 자유롭게 두면서도 어순이 바뀌지 않습니다 — **결코 나는 본 적이 없다**에서 주어-동사 순서는 그대로입니다. 하지만 영어는 **never**, **rarely**, **not only** 같은 부정/제한 부사가 문두에 오면 주어와 조동사의 순서를 뒤집습니다. 이런 도치는 강조와 격식을 나타내며, 유창함과 원어민 수준의 글쓰기를 가르는 C2 수준의 기술입니다.",
      exampleWrong: "Never I have seen such dedication.",
      exampleRight: "Never have I seen such dedication.",
  ko_c2_cleft_focus: {
      tag: "ko_c2_cleft_focus",
        ko: "분열문으로 초점 맞추기",
        en: "Korean uses **은/는** and **이/가** particles to mark focus — **존이 창문을 깼어요** (It was John who broke the window). English uses cleft sentences: **It-clefts** (**It was John who broke the window**) and **Wh-clefts** (**What I need is more time**). At C2, choosing the right cleft structure controls what the reader notices first.",
        vi: "Tiếng Hàn dùng tiểu từ **은/는** và **이/가** để đánh dấu trọng tâm. Tiếng Anh dùng câu chẻ: **It-cleft** và **Wh-cleft**. Ở cấp C2, chọn đúng cấu trúc cleft kiểm soát điều người đọc chú ý đầu tiên.",
        ko: "한국어는 **은/는**과 **이/가** 조사로 초점을 표시합니다 — **존이 창문을 깼어요**에서 '존'에 초점이 있습니다. 영어는 분열문을 사용합니다: **It-cleft**(**It was John who broke the window**)와 **Wh-cleft**(**What I need is more time**). C2 수준에서 적절한 분열문을 선택하면 독자가 가장 먼저 주목하는 부분을 정확히 통제할 수 있습니다.",
  ko_c2_mixed_conditional: {
      tag: "ko_c2_mixed_conditional",
        en: "Mixed conditionals",
        vi: "Câu điều kiện hỗn hợp",
        ko: "혼합 가정문",
        en: "Korean expresses hypotheticals with **-았/었다면** without distinguishing time-mix. English mixed conditionals combine past condition with present result (**If I had studied, I would be a doctor now**) or present condition with past result (**If I were taller, I would have joined the team**). Matching the tense pair correctly is a C2 hallmark.",
        vi: "Tiếng Hàn diễn tả giả định với **-았/었다면** mà không phân biệt hỗn hợp thời gian. Câu điều kiện hỗn hợp tiếng Anh kết hợp điều kiện quá khứ với kết quả hiện tại hoặc ngược lại. Ghép đúng cặp thì là dấu ấn C2.",
        ko: "한국어는 **-았/었다면**으로 가정을 표현하며 시간의 혼합을 따로 구분하지 않습니다. 하지만 영어의 혼합 가정문은 과거 조건과 현재 결과(**If I had studied, I would be a doctor now**) 또는 현재 조건과 과거 결과(**If I were taller, I would have joined the team**)를 결합합니다. 시제 쌍을 정확히 맞추는 것은 C2 수준의 특징입니다.",
      exampleWrong: "If I had studied harder at school, I will be a doctor now.",
      exampleRight: "If I had studied harder at school, I would be a doctor now.",
  ko_c2_register_consistency: {
      tag: "ko_c2_register_consistency",
        ko: "격식체 일관성 유지",
        en: "Korean has a grammatically marked honorific system (해요체/해체/합쇼체) that forces register choices at every sentence. English relies on vocabulary and structure — mixing **gonna** with **furthermore**, or **kids** with **offspring**, in the same paragraph sounds jarring. C2 writers maintain one register throughout a text.",
        vi: "Tiếng Hàn có hệ thống kính ngữ được đánh dấu ngữ pháp bắt buộc chọn văn phong từng câu. Tiếng Anh dựa vào từ vựng và cấu trúc — pha trộn **gonna** với **furthermore** trong cùng đoạn văn nghe rất chói tai. Người viết C2 duy trì một văn phong nhất quán.",
        ko: "한국어는 문법적으로 표시되는 높임말 체계(해요체/해체/합쇼체)가 있어 모든 문장에서 격식 수준을 선택해야 합니다. 반면 영어는 어휘와 구조에 의존합니다 — 같은 문단에서 **gonna**와 **furthermore**를 섞어 쓰거나 **kids**와 **offspring**을 혼용하면 어색하게 들립니다. C2 작가는 전체 글에서 일관된 격식체를 유지합니다.",
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
