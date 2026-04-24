// src/lib/weakness/micro-lessons.ts
//
// Bilingual micro-lesson content for the highest-impact L1 tags.
// Consumed by the Learn-More flow (rendered by CC5 in a future task).
//
// Design goals — teacher-warm register, Vietnamese-first framing, every
// rule grounded in a **tiếng Việt mình / tiếng Anh** contrast so the
// learner can feel where the interference comes from. Every lesson has:
//   - title      → card header (short, the same surface as WEAKNESS_CATALOG.shortLabel)
//   - concept    → 2–3 sentence explanation with the contrast
//   - examples   → wrong → right pairs + optional bilingual note
//   - practice   → prompt sentence + answer (single string the learner types)
//   - tip        → one-line mnemonic / "remember this" line
//
// Inline `**bold**` markdown is the same convention as the catalog and
// is rendered by `renderInlineBold`. Prompts use `___` (three underscores)
// as the blank marker so CC5's renderer can target it.
//
// Adding a new micro-lesson:
//   1. The `tag` MUST exist in WEAKNESS_CATALOG.
//   2. Add an entry to MICRO_LESSONS keyed by tag.
//   3. The companion test `micro-lessons.test.ts` enforces required fields.

import type { WeaknessTag } from "./weakness-catalog";

export interface MicroLessonText {
  en: string;
  vi: string;
}

export interface MicroLessonExample {
  wrong: string;
  right: string;
  /** Optional bilingual note explaining *why* this pair changes. */
  note?: MicroLessonText;
}

export interface MicroLessonPractice {
  /** Sentence with `___` marking the blank the learner fills. */
  prompt: string;
  /** The single correct string that belongs in the blank. */
  answer: string;
}

export interface MicroLesson {
  /** Must match a tag in WEAKNESS_CATALOG. */
  tag: WeaknessTag;
  title: MicroLessonText;
  /** 2–3 sentence bilingual explanation of the rule. */
  concept: MicroLessonText;
  /** 3–5 wrong → right pairs. */
  examples: MicroLessonExample[];
  /** 5–8 practice items (prompt + answer). */
  practice: MicroLessonPractice[];
  /** One-line bilingual memory aid / mnemonic. */
  tip: MicroLessonText;
}

export const MICRO_LESSONS: Partial<Record<WeaknessTag, MicroLesson>> = {
  // ────────────────────────────────────────────────────────────────────────
  // 1. Subject-verb agreement: the **-s** on he / she / it verbs
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_3rd_person_s: {
    tag: "vi_l1_3rd_person_s",
    title: {
      en: "Add **-s** after he, she, it",
      vi: "Thêm **-s** sau he, she, it",
    },
    concept: {
      en: "Vietnamese verbs don't change by person — **tôi đi**, **cô ấy đi** both use the same verb. In English, when the subject is **he**, **she**, or **it**, the present-tense verb takes an **-s**: **he goes**, **she works**, **it runs**.",
      vi: "Động từ tiếng Việt không đổi theo ngôi — **tôi đi**, **cô ấy đi** cùng một động từ. Trong tiếng Anh, khi chủ ngữ là **he**, **she**, **it**, động từ ở thì hiện tại phải thêm **-s**: **he goes**, **she works**, **it runs**.",
    },
    examples: [
      {
        wrong: "She go to school every day.",
        right: "She goes to school every day.",
        note: {
          en: "**she** needs **goes**, not **go**.",
          vi: "**she** đi với **goes**, không phải **go**.",
        },
      },
      {
        wrong: "He work in a bank.",
        right: "He works in a bank.",
      },
      {
        wrong: "My father drive a taxi.",
        right: "My father drives a taxi.",
        note: {
          en: "**My father** = **he** → verb adds **-s**.",
          vi: "**My father** = **he** → động từ thêm **-s**.",
        },
      },
      {
        wrong: "The baby cry a lot.",
        right: "The baby cries a lot.",
        note: {
          en: "Verbs ending in consonant + **-y** change to **-ies**: **cry → cries**.",
          vi: "Động từ tận cùng phụ âm + **-y** đổi thành **-ies**: **cry → cries**.",
        },
      },
      {
        wrong: "She don't like coffee.",
        right: "She doesn't like coffee.",
        note: {
          en: "Negative also follows the rule: **she / he / it → doesn't**.",
          vi: "Câu phủ định cũng vậy: **she / he / it → doesn't**.",
        },
      },
    ],
    practice: [
      { prompt: "She ___ (work) in Hanoi.", answer: "works" },
      { prompt: "My brother ___ (play) football every Sunday.", answer: "plays" },
      { prompt: "The train ___ (leave) at six.", answer: "leaves" },
      { prompt: "He ___ (not / like) spicy food.", answer: "doesn't like" },
      { prompt: "Lan ___ (watch) TV after dinner.", answer: "watches" },
      { prompt: "It ___ (rain) a lot in July.", answer: "rains" },
      { prompt: "My mother ___ (teach) English.", answer: "teaches" },
    ],
    tip: {
      en: "**He / She / It → verb + s.** If you can swap the subject for **he**, the verb needs an **-s**.",
      vi: "**He / She / It → động từ + s.** Nếu đổi chủ ngữ được sang **he**, động từ phải có **-s**.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 2. Past tense with -ed
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_past_ed: {
    tag: "vi_l1_past_ed",
    title: {
      en: "Past tense: add **-ed**",
      vi: "Quá khứ: thêm **-ed**",
    },
    concept: {
      en: "Vietnamese shows past time with words like **hôm qua** or **đã** — the verb itself stays the same. In English the verb changes: **work → worked**, **watch → watched**. Irregular verbs change shape: **go → went**, **see → saw**.",
      vi: "Tiếng Việt mình diễn tả quá khứ bằng các từ như **hôm qua** hoặc **đã** — động từ không đổi. Tiếng Anh chính động từ đổi: **work → worked**, **watch → watched**. Động từ bất quy tắc đổi hẳn: **go → went**, **see → saw**.",
    },
    examples: [
      {
        wrong: "Yesterday I work late.",
        right: "Yesterday I worked late.",
        note: {
          en: "**yesterday** already says past — the verb still needs **-ed**.",
          vi: "**yesterday** đã chỉ quá khứ rồi — động từ vẫn phải có **-ed**.",
        },
      },
      {
        wrong: "She call me last night.",
        right: "She called me last night.",
      },
      {
        wrong: "We go to Hanoi last summer.",
        right: "We went to Hanoi last summer.",
        note: {
          en: "**go** is irregular: **go → went** (not **goed**).",
          vi: "**go** bất quy tắc: **go → went** (không phải **goed**).",
        },
      },
      {
        wrong: "He study English for three hours.",
        right: "He studied English for three hours.",
        note: {
          en: "Consonant + **-y** → change to **-ied**: **study → studied**.",
          vi: "Phụ âm + **-y** → đổi thành **-ied**: **study → studied**.",
        },
      },
      {
        wrong: "I eat rice for lunch yesterday.",
        right: "I ate rice for lunch yesterday.",
        note: {
          en: "Irregular: **eat → ate**.",
          vi: "Bất quy tắc: **eat → ate**.",
        },
      },
    ],
    practice: [
      { prompt: "Yesterday I ___ (watch) a movie.", answer: "watched" },
      { prompt: "She ___ (visit) her grandmother last weekend.", answer: "visited" },
      { prompt: "They ___ (go) to the beach in July.", answer: "went" },
      { prompt: "I ___ (see) a good film last night.", answer: "saw" },
      { prompt: "He ___ (study) very hard for the test.", answer: "studied" },
      { prompt: "We ___ (eat) pho for breakfast.", answer: "ate" },
      { prompt: "My friend ___ (not / come) to the party.", answer: "didn't come" },
    ],
    tip: {
      en: "Past in Vietnamese = a time word. Past in English = change the verb. **Always** change the verb, even when the time word is already there.",
      vi: "Quá khứ trong tiếng Việt = từ chỉ thời gian. Quá khứ trong tiếng Anh = đổi động từ. **Luôn** đổi động từ, kể cả khi đã có từ chỉ thời gian.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 3. Plural nouns with -s
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_plural_s: {
    tag: "vi_l1_plural_s",
    title: {
      en: "Plural nouns: add **-s**",
      vi: "Danh từ số nhiều: thêm **-s**",
    },
    concept: {
      en: "Vietnamese nouns don't change for number — **một cuốn sách** and **ba cuốn sách** use the same word **sách**. English adds **-s** to most nouns when there's more than one: **book → books**, **friend → friends**.",
      vi: "Danh từ tiếng Việt không đổi theo số — **một cuốn sách**, **ba cuốn sách** đều là **sách**. Tiếng Anh thêm **-s** vào hầu hết danh từ khi có nhiều hơn một: **book → books**, **friend → friends**.",
    },
    examples: [
      {
        wrong: "I have two book.",
        right: "I have two books.",
      },
      {
        wrong: "She bought three apple.",
        right: "She bought three apples.",
      },
      {
        wrong: "Many student study English.",
        right: "Many students study English.",
        note: {
          en: "**many** always takes a plural noun.",
          vi: "**many** luôn đi với danh từ số nhiều.",
        },
      },
      {
        wrong: "I have many childs.",
        right: "I have many children.",
        note: {
          en: "Irregular plural: **child → children**, not **childs**.",
          vi: "Số nhiều bất quy tắc: **child → children**, không phải **childs**.",
        },
      },
      {
        wrong: "There are two box on the table.",
        right: "There are two boxes on the table.",
        note: {
          en: "Nouns ending in **-s / -sh / -ch / -x** add **-es**: **box → boxes**.",
          vi: "Danh từ tận cùng **-s / -sh / -ch / -x** thêm **-es**: **box → boxes**.",
        },
      },
    ],
    practice: [
      { prompt: "I have three ___ (brother).", answer: "brothers" },
      { prompt: "She bought five ___ (orange).", answer: "oranges" },
      { prompt: "There are many ___ (student) in the class.", answer: "students" },
      { prompt: "We need two ___ (box) for the books.", answer: "boxes" },
      { prompt: "My parents have four ___ (child).", answer: "children" },
      { prompt: "The ___ (woman) are teachers.", answer: "women" },
      { prompt: "He cleaned his ___ (tooth).", answer: "teeth" },
    ],
    tip: {
      en: "If the number in front is more than one (or a word like **many / some / a few**), the noun needs **-s**.",
      vi: "Nếu phía trước là số nhiều hơn một (hoặc các từ như **many / some / a few**), danh từ phải có **-s**.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 4. Missing "to be"
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_missing_be: {
    tag: "vi_l1_missing_be",
    title: {
      en: 'Every sentence needs a verb: use **"to be"**',
      vi: 'Mọi câu cần có động từ: dùng **"to be"**',
    },
    concept: {
      en: "Vietnamese often leaves out the **to be** verb — **Cô ấy giáo viên** is a complete sentence. English always needs one: **am / is / are** for present, **was / were** for past. Without it, the sentence isn't finished.",
      vi: "Tiếng Việt mình hay bỏ động từ **to be** — **Cô ấy giáo viên** là đủ. Tiếng Anh luôn cần có: **am / is / are** cho hiện tại, **was / were** cho quá khứ. Thiếu nó là câu chưa xong.",
    },
    examples: [
      {
        wrong: "She a teacher.",
        right: "She is a teacher.",
      },
      {
        wrong: "I tired.",
        right: "I am tired.",
        note: {
          en: "**I → am**, **you / we / they → are**, **he / she / it → is**.",
          vi: "**I → am**, **you / we / they → are**, **he / she / it → is**.",
        },
      },
      {
        wrong: "They at home.",
        right: "They are at home.",
      },
      {
        wrong: "My book on the table.",
        right: "My book is on the table.",
        note: {
          en: "Location sentences also need **be**.",
          vi: "Câu chỉ vị trí cũng cần **be**.",
        },
      },
      {
        wrong: "He very kind.",
        right: "He is very kind.",
      },
    ],
    practice: [
      { prompt: "She ___ (be) a doctor.", answer: "is" },
      { prompt: "I ___ (be) happy today.", answer: "am" },
      { prompt: "They ___ (be) in Hanoi now.", answer: "are" },
      { prompt: "He ___ (be) tired yesterday.", answer: "was" },
      { prompt: "My parents ___ (be) at work.", answer: "are" },
      { prompt: "The weather ___ (be) cold this morning.", answer: "was" },
      { prompt: "You ___ (be) my best friend.", answer: "are" },
    ],
    tip: {
      en: "Before an adjective, a noun, or a place, you almost always need **am / is / are** (or past **was / were**). If you can't hear the verb, add **be**.",
      vi: "Trước tính từ, danh từ, hay nơi chốn, gần như luôn cần **am / is / are** (hoặc quá khứ **was / were**). Nếu không nghe thấy động từ, thêm **be**.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 5. Articles a / an / the
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_missing_article: {
    tag: "vi_l1_missing_article",
    title: {
      en: "Use **a / an / the** before singular nouns",
      vi: "Dùng **a / an / the** trước danh từ số ít",
    },
    concept: {
      en: "Vietnamese has no articles — nouns stand alone. English almost always needs one before a singular countable noun: **a** before a consonant sound (**a car**), **an** before a vowel sound (**an apple**), **the** when both speaker and listener know which one (**the car over there**).",
      vi: "Tiếng Việt mình không có mạo từ — danh từ đứng một mình là được. Tiếng Anh gần như luôn cần một từ đi trước danh từ đếm được số ít: **a** trước phụ âm (**a car**), **an** trước nguyên âm (**an apple**), **the** khi cả hai người đều biết cái nào (**the car over there**).",
    },
    examples: [
      {
        wrong: "I have car.",
        right: "I have a car.",
      },
      {
        wrong: "She is teacher.",
        right: "She is a teacher.",
        note: {
          en: "Job titles need **a / an** when singular.",
          vi: "Nghề nghiệp cần **a / an** khi số ít.",
        },
      },
      {
        wrong: "I eat a apple every day.",
        right: "I eat an apple every day.",
        note: {
          en: "**apple** starts with a vowel sound → **an**, not **a**.",
          vi: "**apple** bắt đầu bằng nguyên âm → **an**, không phải **a**.",
        },
      },
      {
        wrong: "Please close door.",
        right: "Please close the door.",
        note: {
          en: "Both of you know which door — use **the**.",
          vi: "Cả hai đều biết cánh cửa nào — dùng **the**.",
        },
      },
      {
        wrong: "Sun rises in the east.",
        right: "The sun rises in the east.",
        note: {
          en: "Unique things (**sun**, **moon**, **sky**) take **the**.",
          vi: "Những thứ duy nhất (**sun**, **moon**, **sky**) đi với **the**.",
        },
      },
    ],
    practice: [
      { prompt: "I have ___ new phone.", answer: "a" },
      { prompt: "She is ___ engineer.", answer: "an" },
      { prompt: "Please open ___ window.", answer: "the" },
      { prompt: "We saw ___ elephant at the zoo.", answer: "an" },
      { prompt: "He is reading ___ book I gave him.", answer: "the" },
      { prompt: "There is ___ cat on the roof.", answer: "a" },
      { prompt: "___ moon is very bright tonight.", answer: "The" },
    ],
    tip: {
      en: "First time you mention it → **a / an**. After that, or if it's obvious which one → **the**. Before a vowel *sound*, **a** becomes **an**.",
      vi: "Lần đầu nhắc đến → **a / an**. Sau đó, hoặc khi đã rõ cái nào → **the**. Trước *âm* nguyên âm, **a** đổi thành **an**.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 6. When to use "to + verb"
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_to_verb_confusion: {
    tag: "vi_l1_to_verb_confusion",
    title: {
      en: "After **want / need / plan** → use **to + verb**",
      vi: "Sau **want / need / plan** → dùng **to + verb**",
    },
    concept: {
      en: "Vietnamese doesn't mark an infinitive — **tôi muốn đi** has just a plain verb. In English, verbs like **want**, **need**, **plan**, **decide**, **hope**, **try** take **to + verb**: **I want to go**, not **I want go**.",
      vi: "Tiếng Việt mình không có dạng động từ nguyên mẫu — **tôi muốn đi** chỉ dùng động từ gốc. Tiếng Anh, các verb như **want**, **need**, **plan**, **decide**, **hope**, **try** đi với **to + verb**: **I want to go**, không phải **I want go**.",
    },
    examples: [
      {
        wrong: "I want go home.",
        right: "I want to go home.",
      },
      {
        wrong: "She plans visit her family.",
        right: "She plans to visit her family.",
      },
      {
        wrong: "We need buy some food.",
        right: "We need to buy some food.",
      },
      {
        wrong: "He hopes find a new job.",
        right: "He hopes to find a new job.",
      },
      {
        wrong: "They decided not come.",
        right: "They decided not to come.",
        note: {
          en: "Negative keeps **to**: **not to come**.",
          vi: "Phủ định vẫn giữ **to**: **not to come**.",
        },
      },
    ],
    practice: [
      { prompt: "I want ___ (learn) English.", answer: "to learn" },
      { prompt: "She plans ___ (travel) next year.", answer: "to travel" },
      { prompt: "We need ___ (leave) early.", answer: "to leave" },
      { prompt: "He decided ___ (stay) at home.", answer: "to stay" },
      { prompt: "They hope ___ (pass) the exam.", answer: "to pass" },
      { prompt: "I try ___ (speak) English every day.", answer: "to speak" },
      { prompt: "She would like ___ (help) you.", answer: "to help" },
    ],
    tip: {
      en: "If you see **want / need / plan / decide / hope / try / would like**, the next verb needs **to** in front of it.",
      vi: "Thấy **want / need / plan / decide / hope / try / would like** là động từ tiếp theo cần **to** ở trước.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 7. Double past: one past marker, not two
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_double_past: {
    tag: "vi_l1_double_past",
    title: {
      en: "Past tense: one marker per verb, not two",
      vi: "Quá khứ: chỉ một dấu hiệu cho mỗi động từ",
    },
    concept: {
      en: "Vietnamese often stacks **đã** together with a past time word. In English, once you use **did** (for questions or negatives), the main verb goes back to its base form: **Did you eat?**, not **Did you ate?** — **I didn't go**, not **I didn't went**.",
      vi: "Tiếng Việt mình hay ghép **đã** với trạng từ thời gian quá khứ. Tiếng Anh khi có **did** (trong câu hỏi hoặc phủ định), động từ chính trở về dạng nguyên thể: **Did you eat?**, không phải **Did you ate?** — **I didn't go**, không phải **I didn't went**.",
    },
    examples: [
      {
        wrong: "I did worked late.",
        right: "I worked late.",
        note: {
          en: "Use **did** for emphasis (**I did work late**) or drop it — don't double-mark the past.",
          vi: "Dùng **did** để nhấn mạnh (**I did work late**) hoặc bỏ — không đánh dấu quá khứ hai lần.",
        },
      },
      {
        wrong: "Did you went there?",
        right: "Did you go there?",
      },
      {
        wrong: "She didn't came to class.",
        right: "She didn't come to class.",
      },
      {
        wrong: "I didn't saw him yesterday.",
        right: "I didn't see him yesterday.",
      },
      {
        wrong: "Where did he went?",
        right: "Where did he go?",
      },
    ],
    practice: [
      { prompt: "Did she ___ (visit) her family?", answer: "visit" },
      { prompt: "I didn't ___ (watch) the film.", answer: "watch" },
      { prompt: "Where did you ___ (go) last night?", answer: "go" },
      { prompt: "He didn't ___ (eat) breakfast today.", answer: "eat" },
      { prompt: "Did they ___ (finish) the project?", answer: "finish" },
      { prompt: "She didn't ___ (know) the answer.", answer: "know" },
      { prompt: "What time did you ___ (leave)?", answer: "leave" },
    ],
    tip: {
      en: "**did / didn't** already carries the past. After them, use the **base verb** (no **-ed**, no irregular past form).",
      vi: "**did / didn't** đã mang nghĩa quá khứ rồi. Sau chúng, dùng **động từ gốc** (không **-ed**, không dạng quá khứ bất quy tắc).",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 8. Comparatives: one form, not two
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_comparative_double: {
    tag: "vi_l1_comparative_double",
    title: {
      en: "Comparative: **-er** OR **more**, never both",
      vi: "So sánh: **-er** HOẶC **more**, không dùng cả hai",
    },
    concept: {
      en: "Vietnamese layers **hơn** with intensifiers freely. English picks **one** comparative form: short adjectives take **-er** (**bigger**, **faster**); longer adjectives take **more** (**more beautiful**). Irregulars like **better** and **worse** stand alone — never **more better**.",
      vi: "Tiếng Việt mình ghép **hơn** với nhiều từ nhấn mạnh tự nhiên. Tiếng Anh chọn **một** dạng so sánh: tính từ ngắn thêm **-er** (**bigger**, **faster**); tính từ dài dùng **more** (**more beautiful**). Bất quy tắc như **better**, **worse** đứng một mình — không bao giờ **more better**.",
    },
    examples: [
      {
        wrong: "This is more better.",
        right: "This is better.",
      },
      {
        wrong: "She is more smarter than him.",
        right: "She is smarter than him.",
      },
      {
        wrong: "Today is more hotter than yesterday.",
        right: "Today is hotter than yesterday.",
      },
      {
        wrong: "The red one is more cheaper.",
        right: "The red one is cheaper.",
      },
      {
        wrong: "This road is more longer than that one.",
        right: "This road is longer than that one.",
        note: {
          en: "Short adjectives (1–2 syllables) use **-er**, not **more**.",
          vi: "Tính từ ngắn (1–2 âm tiết) dùng **-er**, không dùng **more**.",
        },
      },
    ],
    practice: [
      { prompt: "My house is ___ (big) than yours.", answer: "bigger" },
      { prompt: "This book is ___ (interesting) than that one.", answer: "more interesting" },
      { prompt: "Today is ___ (good) than yesterday.", answer: "better" },
      { prompt: "He runs ___ (fast) than me.", answer: "faster" },
      { prompt: "The new phone is ___ (expensive) than the old one.", answer: "more expensive" },
      { prompt: "Her English is ___ (bad) than mine.", answer: "worse" },
      { prompt: "This exercise is ___ (easy) than the last one.", answer: "easier" },
    ],
    tip: {
      en: "Short adjective → **-er**. Long adjective (3+ syllables) → **more**. Pick one — **never** both in the same word.",
      vi: "Tính từ ngắn → **-er**. Tính từ dài (3+ âm tiết) → **more**. Chọn một — **không bao giờ** cả hai.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 9. Everyone / everybody is singular
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_everyone_plural: {
    tag: "vi_l1_everyone_plural",
    title: {
      en: "**Everyone / everybody** takes a singular verb",
      vi: "**Everyone / everybody** đi với động từ số ít",
    },
    concept: {
      en: "Vietnamese **mọi người** feels plural because it talks about many people. In English, **everyone**, **everybody**, **someone**, **nobody** all count as singular: the verb takes the **he / she / it** form — **everyone is**, not **everyone are**.",
      vi: "Tiếng Việt mình **mọi người** nghe như số nhiều vì chỉ nhiều người. Tiếng Anh, **everyone**, **everybody**, **someone**, **nobody** đều tính là số ít: động từ chia theo **he / she / it** — **everyone is**, không phải **everyone are**.",
    },
    examples: [
      {
        wrong: "Everyone are happy.",
        right: "Everyone is happy.",
      },
      {
        wrong: "Everybody have a phone now.",
        right: "Everybody has a phone now.",
      },
      {
        wrong: "Someone are knocking on the door.",
        right: "Someone is knocking on the door.",
      },
      {
        wrong: "Nobody were at home.",
        right: "Nobody was at home.",
        note: {
          en: "Past tense: **nobody / everyone → was**, not **were**.",
          vi: "Quá khứ: **nobody / everyone → was**, không phải **were**.",
        },
      },
      {
        wrong: "Everyone know the answer.",
        right: "Everyone knows the answer.",
        note: {
          en: "Present tense also takes the **-s** form: **everyone knows**.",
          vi: "Hiện tại cũng chia dạng **-s**: **everyone knows**.",
        },
      },
    ],
    practice: [
      { prompt: "Everyone ___ (be) ready for the test.", answer: "is" },
      { prompt: "Nobody ___ (know) the answer.", answer: "knows" },
      { prompt: "Someone ___ (be) at the door.", answer: "is" },
      { prompt: "Everybody ___ (have) a favorite song.", answer: "has" },
      { prompt: "Everyone ___ (want) to be happy.", answer: "wants" },
      { prompt: "Nobody ___ (be) perfect.", answer: "is" },
      { prompt: "Everybody ___ (love) a good story.", answer: "loves" },
    ],
    tip: {
      en: "**Every-** and **-one / -body / -thing** words are singular. Treat them like **he / she / it** — verb takes the **-s** form.",
      vi: "Các từ **every-** và **-one / -body / -thing** đều số ít. Coi như **he / she / it** — động từ chia dạng **-s**.",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 10. Make vs do
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_make_vs_do: {
    tag: "vi_l1_make_vs_do",
    title: {
      en: "**Make** for creating, **do** for activities",
      vi: "**Make** để tạo ra, **do** để làm hoạt động",
    },
    concept: {
      en: "Vietnamese **làm** covers every kind of doing. English splits: **make** is for creating or producing something (**make a cake**, **make a decision**, **make a mistake**); **do** is for activities, tasks, jobs (**do homework**, **do the dishes**, **do exercise**).",
      vi: "Tiếng Việt mình chỉ cần **làm** cho mọi thứ. Tiếng Anh chia hai: **make** khi tạo ra / sản xuất (**make a cake**, **make a decision**, **make a mistake**); **do** cho hoạt động, công việc, nhiệm vụ (**do homework**, **do the dishes**, **do exercise**).",
    },
    examples: [
      {
        wrong: "I did a mistake.",
        right: "I made a mistake.",
        note: {
          en: "**Mistake** is something you create → **make**.",
          vi: "**Mistake** là thứ bạn tạo ra → **make**.",
        },
      },
      {
        wrong: "She made her homework last night.",
        right: "She did her homework last night.",
        note: {
          en: "**Homework** is an activity → **do**.",
          vi: "**Homework** là hoạt động → **do**.",
        },
      },
      {
        wrong: "Can you do me a favor?",
        right: "Can you do me a favor?",
        note: {
          en: "Trick one — **do a favor** is correct (a service rendered).",
          vi: "Câu bẫy — **do a favor** là đúng (hành động phục vụ).",
        },
      },
      {
        wrong: "He makes exercise every morning.",
        right: "He does exercise every morning.",
      },
      {
        wrong: "She did a cake for my birthday.",
        right: "She made a cake for my birthday.",
      },
    ],
    practice: [
      { prompt: "I need to ___ my homework.", answer: "do" },
      { prompt: "She ___ a delicious dinner last night.", answer: "made" },
      { prompt: "Please ___ the dishes after dinner.", answer: "do" },
      { prompt: "He ___ a big mistake yesterday.", answer: "made" },
      { prompt: "Can you ___ me a favor?", answer: "do" },
      { prompt: "They ___ a decision this morning.", answer: "made" },
      { prompt: "I try to ___ exercise every day.", answer: "do" },
    ],
    tip: {
      en: "**Make** = build / create something new. **Do** = perform / complete an activity. When in doubt: can you *hold* what you made? → **make**.",
      vi: "**Make** = tạo ra / dựng nên. **Do** = thực hiện / hoàn thành hoạt động. Nếu do dự: cầm được thứ vừa làm không? → **make**.",
    },
  },
};

/** Ordered list of all tags that have a micro-lesson. */
export const MICRO_LESSON_TAGS: readonly WeaknessTag[] = Object.freeze(
  Object.keys(MICRO_LESSONS) as WeaknessTag[],
);

/**
 * Look up a micro-lesson by tag. Returns null when no lesson exists for
 * the tag (the catalog is the superset — micro-lessons cover the
 * highest-impact subset).
 */
export function getMicroLesson(tag: string): MicroLesson | null {
  return (MICRO_LESSONS as Record<string, MicroLesson | undefined>)[tag] ?? null;
}
