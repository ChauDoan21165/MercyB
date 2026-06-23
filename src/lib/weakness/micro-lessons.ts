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
  /** Optional Japanese-native English explanation — for ja-native learners. */
  ja?: string;
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
      en: "Add **-s** for he/she/it",
      vi: "Thêm **-s** cho he/she/it",
      ja: "he/she/it の動詞に **-s** をつける",
    },
    concept: {
      en: "Vietnamese verbs never change form. In English, we add **-s** (or **-es**) when the subject is he, she, or it.",
      vi: "Tiếng Việt động từ không đổi. Tiếng Anh phải thêm **-s** (hoặc **-es**) khi chủ ngữ là he, she, it.",
      ja: "日本語の動詞も「私は行く」「彼女は行く」のように主語が変わっても動詞は変わりません。しかし英語では、主語が **he / she / it**（三人称単数）のとき、動詞の最後に **-s** または **-es** をつけます。これは日本語話者が最初につまずくポイントです。",
    },
    examples: [
      {
        wrong: "She go to school every day.",
        right: "She goes to school every day.",
        note: {
          en: "**she** needs **goes**, not **go**.",
          vi: "**she** đi với **goes**, không phải **go**.",
          ja: "主語が **she** なので、動詞は **go** ではなく **goes**。",
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
          ja: "「私の父」は **he** と同じ扱い → 動詞に **-s** をつける。",
        },
      },
      {
        wrong: "The baby cry a lot.",
        right: "The baby cries a lot.",
        note: {
          en: "Verbs ending in consonant + **-y** change to **-ies**: **cry → cries**.",
          vi: "Động từ tận cùng phụ âm + **-y** đổi thành **-ies**: **cry → cries**.",
          ja: "子音 + **-y** で終わる動詞は **-ies** に変わる：**cry → cries**。",
        },
      },
      {
        wrong: "She don't like coffee.",
        right: "She doesn't like coffee.",
        note: {
          en: "Negative also follows the rule: **she / he / it → doesn't**.",
          vi: "Câu phủ định cũng vậy: **she / he / it → doesn't**.",
          ja: "否定文も同じルール：**she / he / it → doesn't** を使い、動詞は原形のまま。",
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
      en: "If you can replace the subject with 'he', remember to add **-s** to the verb.",
      vi: "Nếu thay chủ ngữ bằng 'he' được thì động từ phải thêm **-s**.",
      ja: "主語を「彼は」に置き換えられるなら、動詞に **-s** をつける。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 2. Past tense with -ed
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_past_ed: {
    tag: "vi_l1_past_ed",
    title: {
      en: "Past tense — change the verb",
      vi: "Quá khứ — phải đổi động từ",
      ja: "過去形 — 動詞を変える",
    },
    concept: {
      en: "Vietnamese often only needs a time word like 'hôm qua'. English **always** changes the verb for past tense.",
      vi: "Tiếng Việt mình hay chỉ cần từ chỉ thời gian như 'hôm qua'. Tiếng Anh **luôn phải đổi** động từ sang quá khứ.",
      ja: "日本語にも「〜ました／〜た」という過去形がありますが、英語はもっと厳格です。「yesterday」などの時間を表す言葉があっても、動詞は必ず過去形に変えます。「Yesterday I work」は絶対にダメ。「Yesterday I work**ed**」です。規則動詞は **-ed**、不規則動詞（go→went, eat→ate）は暗記が必要です。",
    },
    examples: [
      {
        wrong: "Yesterday I work late.",
        right: "Yesterday I worked late.",
        note: {
          en: "**yesterday** already says past — the verb still needs **-ed**.",
          vi: "**yesterday** đã chỉ quá khứ rồi — động từ vẫn phải có **-ed**.",
          ja: "**yesterday** があっても、動詞は必ず過去形（**-ed**）に。",
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
          ja: "**go** は不規則：**go → went**（**goed** ではない）。",
        },
      },
      {
        wrong: "He study English for three hours.",
        right: "He studied English for three hours.",
        note: {
          en: "Consonant + **-y** → change to **-ied**: **study → studied**.",
          vi: "Phụ âm + **-y** → đổi thành **-ied**: **study → studied**.",
          ja: "子音 + **-y** → **-ied**：**study → studied**。",
        },
      },
      {
        wrong: "I eat rice for lunch yesterday.",
        right: "I ate rice for lunch yesterday.",
        note: {
          en: "Irregular: **eat → ate**.",
          vi: "Bất quy tắc: **eat → ate**.",
          ja: "不規則：**eat → ate**。",
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
      en: "Time word alone is not enough in English. Always change the verb!",
      vi: "Chỉ có từ chỉ thời gian chưa đủ. Phải đổi động từ luôn nhé!",
      ja: "時間を表す言葉だけでは不十分。必ず動詞も過去形に。日本語の「〜ました／〜た」を付けるのと同じ習慣です。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 3. Plural nouns with -s
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_plural_s: {
    tag: "vi_l1_plural_s",
    title: {
      en: "Plural nouns — add **-s**",
      vi: "Danh từ số nhiều — thêm **-s**",
      ja: "複数形：名詞に **-s** — 日本語にない「数」の感覚",
    },
    concept: {
      en: "Vietnamese nouns usually stay the same. English nouns almost always add **-s** or **-es** in plural form.",
      vi: "Tiếng Việt danh từ ít khi đổi. Tiếng Anh hầu như luôn thêm **-s** hoặc **-es** khi số nhiều.",
      ja: "日本語では名詞の形で単数・複数を区別しません。「一冊の本」も「三冊の本」も「本」は「本」のまま。一方、英語は複数であればほぼ必ず名詞に -s または -es をつけます（one book → three books）。さらに many / some / a few のような数量を表す語が前につく場合も、後ろの名詞は複数形にする必要があります。この「数を名詞の形で表す」という発想そのものが日本語にはないため、B2でも会話中に -s を落としてしまうことは非常に多いです。",
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
      ja: "前の数が2以上なら（または many / some / a few のような語があれば）、名詞には必ず -s。日本語の「三つのリンゴ」の「リンゴ」が three apple ではなく three apples になる。数に敏感になることが第一歩です。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 4. Missing "to be"
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_missing_be: {
    tag: "vi_l1_missing_be",
    title: {
      en: "Don't forget **am / is / are**",
      vi: "Đừng quên **am / is / are**",
      ja: "**am / is / are** を忘れずに",
    },
    concept: {
      en: "Vietnamese often drops the verb 'to be'. English nearly always needs **am, is,** or **are**.",
      vi: "Tiếng Việt mình hay bỏ động từ 'to be'. Tiếng Anh gần như luôn cần **am, is, are**.",
      ja: "日本語も「彼女は先生です」のように「です」で文を終えますが、英語では **am / is / are** が必須の動詞として主語と補語の間に入ります。日本語の「〜は〜です」の「です」の位置に **am / is / are** が来ると考えてください。",
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
          ja: "**I → am**、**you / we / they → are**、**he / she / it → is**。",
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
          ja: "場所を表す文にも **be** が必要。",
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
      ja: "形容詞・名詞・場所の前には、ほぼ必ず **am / is / are**（過去なら **was / were**）が必要。動詞が聞こえなければ **be** を補う。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 5. Articles a / an / the
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_missing_article: {
    tag: "vi_l1_missing_article",
    title: {
      en: "Articles: **a / an / the**",
      vi: "Mạo từ: **a / an / the**",
      ja: "冠詞：**a / an / the** — 日本語にない最大の壁",
    },
    concept: {
      en: "Vietnamese has no articles. English requires **a / an** (general) or **the** (specific).",
      vi: "Tiếng Việt không có mạo từ. Tiếng Anh cần **a / an** (chung chung) hoặc **the** (xác định).",
      ja: "日本語には冠詞という概念そのものが存在しません。「本」と言えば a book なのか the book なのか、文脈で判断するしかない日本語と違い、英語はほぼ全ての単数可算名詞の前に a/an/the のどれかが必要です。これは日本人学習者にとって、B2レベルになっても会話の中で自然に使い分けるのが最も難しい文法項目の一つです。初出（聞き手が知らないもの）→ a/an、既出または特定できるもの → the、という基本ルールをまず徹底しましょう。",
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
      ja: "初めて話題に出すとき → **a / an**。その後、またはどの対象か明らかなとき → **the**。母音の「音」で始まる単語の前では **a** が **an** に変わります（an apple, an hour）。ただし文字ではなく「音」で判断する点に注意 — a university（/juː/ で始まるので a）、an hour（h を発音しないので an）。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 6. When to use "to + verb"
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_to_verb_confusion: {
    tag: "vi_l1_to_verb_confusion",
    title: {
      en: "**to + verb** (infinitive)",
      vi: "**to + động từ**",
      ja: "**to + 動詞**（不定詞）",
    },
    concept: {
      en: "Many English verbs must be followed by **to + verb** (want to learn, decide to go).",
      vi: "Nhiều động từ tiếng Anh phải theo sau bởi **to + V** (want to learn, decide to go).",
      ja: "日本語には不定詞がありません。英語では **want / need / plan / decide / hope** などの動詞の後ろは **to + 動詞の原形** にします。「want go」ではなく「want **to** go」。日本語の「〜したい」「〜するつもり」のような表現の後に、英語では必ず **to** が入ると覚えましょう。",
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
      ja: "**want / need / plan / decide / hope / try / would like** の後ろの動詞には必ず **to** を付けます。日本語にないルールなので、最初は意識して確認しましょう。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 7. Double past: one past marker, not two
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_double_past: {
    tag: "vi_l1_double_past",
    title: {
      en: "Don't use two past tenses",
      vi: "Không dùng hai thì quá khứ cùng lúc",
      ja: "過去形を二重に使わない",
    },
    concept: {
      en: "After 'did / was / were', use the base form of the verb (not past tense again).",
      vi: "Sau 'did / was / were', dùng dạng nguyên thể của động từ (không dùng thì quá khứ lần nữa).",
      ja: "**did / didn't** の後ろの動詞は必ず原形です。「didn't came」ではなく「didn't **come**」。「did」が過去を表しているので、動詞まで過去形にする必要はありません。これは日本語話者が特によく間違えるポイントです。",
    },
    examples: [
      {
        wrong: "I did worked late.",
        right: "I worked late.",
        note: {
          en: "Use **did** for emphasis (**I did work late**) or drop it — don't double-mark the past.",
          vi: "Dùng **did** để nhấn mạnh (**I did work late**) hoặc bỏ — không đánh dấu quá khứ hai lần.",
          ja: "**did** は強調の場合のみ（**I did work late**）で、普段は不要。過去の印を二重にしないこと。",
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
      ja: "**did / didn't** がすでに過去を表しています。その後ろは動詞の**原形**（**-ed** も不規則過去形も不要）。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 8. Comparatives: one form, not two
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_comparative_double: {
    tag: "vi_l1_comparative_double",
    title: {
      en: "Comparatives: more / -er (not both)",
      vi: "So sánh hơn: more / -er (không dùng cả hai)",
      ja: "比較級：more / -er（両方使わない）",
    },
    concept: {
      en: "Use either **more** or **-er**, not both at the same time.",
      vi: "Dùng **more** hoặc **-er**, không dùng cả hai cùng lúc.",
      ja: "比較級は **more** か **-er** のどちらか一方だけ。「more better」のように両方付けるのは間違いです。短い形容詞（1〜2音節）は **-er**（big→bigger）、長い形容詞（3音節以上）は **more**（more beautiful）。日本語の「もっと」に当たる部分を二重にしないように。",
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
          ja: "短い形容詞（1〜2音節）は **-er**。**more** は付けません。",
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
      ja: "短い形容詞 → **-er**。長い形容詞（3音節以上）→ **more**。どちらか一方だけ。「more better」は絶対にダメ。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 9. Everyone / everybody is singular
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_everyone_plural: {
    tag: "vi_l1_everyone_plural",
    title: {
      en: "**Everyone / Somebody** is singular",
      vi: "**Everyone / Somebody** là ngôi thứ ba số ít",
      ja: "**Everyone / Somebody** は単数扱い",
    },
    concept: {
      en: "Words like everyone, somebody, nobody are singular in English, even though they feel plural.",
      vi: "Các từ everyone, somebody, nobody là ngôi thứ ba số ít trong tiếng Anh, dù nghe có vẻ số nhiều.",
      ja: "日本語の「みんな」「誰か」「誰も」は意味的に複数をイメージしますが、英語の **everyone / everybody / someone / somebody / nobody** は文法的に**単数**です。動詞は **-s** を付けます：「Everyone **is** happy」（「Everyone are happy」ではない）。日本語話者もよく間違えるポイントです。",
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
      ja: "**every-** や **-one / -body / -thing** で終わる単語はすべて単数扱い。**he / she / it** と同じで、動詞に **-s** が付きます。「みんな」のイメージに引っ張られないように。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // 10. Make vs do
  // ────────────────────────────────────────────────────────────────────────

  vi_l1_make_vs_do: {
    tag: "vi_l1_make_vs_do",
    title: {
      en: "**Make** vs **Do**",
      vi: "**Make** vs **Do**",
      ja: "**Make** と **Do** の使い分け",
    },
    concept: {
      en: "English uses **make** and **do** differently. We **make** decisions / progress, we **do** homework / exercises.",
      vi: "Tiếng Anh dùng **make** và **do** khác nhau. Thường **make** decision / progress, **do** homework / exercise.",
      ja: "日本語ではどちらも「する」ですが、英語は **make**（作る・生み出す）と **do**（実行する・行う）を区別します。**make** = 何かを作り出す（make a cake, make a decision, make a mistake）、**do** = 活動・作業をする（do homework, do exercise, do the dishes）。日本語話者は「do a mistake」と間違えやすいので注意。",
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
      ja: "**Make** = 何かを作り出す・生み出す。**Do** = 活動を行う・完了する。迷ったら「作ったものが触れるか？」→ **make**。触れない活動 → **do**。",
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  // Round 5 expansion — 20 new lessons (CC5 / content/micro-lessons-new20)
  // Each lesson maps to an existing WEAKNESS_CATALOG tag. Topic distribution
  // approximated against the 35-tag catalog; see PR description for the
  // "should be re-tagged after CC3 merges" cleanup list.
  // ────────────────────────────────────────────────────────────────────────

  // 11. Do-support in questions
  vi_l1_question_no_aux: {
    tag: "vi_l1_question_no_aux",
    title: {
      en: "Questions need **do / does / did**",
      vi: "Câu hỏi cần **do / does / did**",
      ja: "疑問文には **do / does / did** が必要",
    },
    concept: {
      en: "Vietnamese turns any sentence into a question with **phải không?** or a rising tone. English puts **do**, **does**, or **did** at the front — and the main verb drops back to its plain form.",
      vi: "Tiếng Việt mình chỉ cần **phải không?** hoặc đổi ngữ điệu là thành câu hỏi. Tiếng Anh phải đặt **do / does / did** ở đầu câu, và động từ chính trở về dạng gốc.",
      ja: "日本語は「〜ですか？」を文末につければ疑問文になります。英語では **do / does / did** を文頭に置き、動詞は原形に戻します。語順が変わるのが日本語話者にとって大きなハードルです。",
    },
    examples: [
      {
        wrong: "You like coffee?",
        right: "Do you like coffee?",
      },
      {
        wrong: "She works in Hanoi?",
        right: "Does she work in Hanoi?",
        note: {
          en: "With **she / he / it**, use **does** and drop the **-s** from the verb.",
          vi: "Với **she / he / it**, dùng **does** và bỏ **-s** khỏi động từ.",
          ja: "**she / he / it** のときは **does** を使い、動詞の **-s** を取る。",
        },
      },
      {
        wrong: "You went to Da Nang last year?",
        right: "Did you go to Da Nang last year?",
        note: {
          en: "Past questions use **did** + plain verb — no **-ed** on **go**.",
          vi: "Câu hỏi quá khứ dùng **did** + động từ gốc — không có **-ed** sau **go**.",
          ja: "過去の疑問文は **did** + 動詞の原形 — **go** に **-ed** はつかない。",
        },
      },
      {
        wrong: "Where he lives?",
        right: "Where does he live?",
        note: {
          en: "Wh-questions still need **do/does/did** after the question word.",
          vi: "Câu hỏi Wh- vẫn cần **do/does/did** sau từ để hỏi.",
          ja: "Wh-疑問文でも疑問詞の後に **do/does/did** が必要。",
        },
      },
    ],
    practice: [
      { prompt: "___ you speak Vietnamese?", answer: "Do" },
      { prompt: "___ she live in Saigon?", answer: "Does" },
      { prompt: "___ they go to school yesterday?", answer: "Did" },
      { prompt: "Where ___ he work?", answer: "does" },
      { prompt: "What time ___ the train leave?", answer: "does" },
      { prompt: "Why ___ you call me last night?", answer: "did" },
    ],
    tip: {
      en: "Present + he/she/it → **does**. Present + I/you/we/they → **do**. Past → **did**. The main verb always goes back to plain form.",
      vi: "Hiện tại + he/she/it → **does**. Hiện tại + I/you/we/they → **do**. Quá khứ → **did**. Động từ chính luôn quay về dạng gốc.",
      ja: "現在 + he/she/it → **does**。現在 + I/you/we/they → **do**。過去 → **did**。主动詞は常に原形に戻る。",
    },
  },

  // 12. His vs her (owner's gender)
  vi_l1_possessive_gender: {
    tag: "vi_l1_possessive_gender",
    title: {
      en: "**His** / **her** — match the owner",
      vi: "**His** / **her** — theo người sở hữu",
      ja: "**His** / **her** — 持ち主の性別に合わせる",
    },
    concept: {
      en: "Vietnamese **của** doesn't care about gender. In English, **his** and **her** follow the **owner's** gender, not the object's — if the owner is a man, it's **his book**, even if the book is a woman's gift.",
      vi: "Tiếng Việt mình dùng **của** không phân biệt nam nữ. Tiếng Anh chọn **his** hay **her** theo giới tính của **người sở hữu**, không phải của đồ vật — chủ là đàn ông thì luôn là **his book**.",
      ja: "日本語の「彼の」「彼女の」と同じく、英語の **his** と **her** は**持ち主**の性別で決まります。物の性別ではありません。「彼の本」は本が何であろうと **his book** です。",
    },
    examples: [
      {
        wrong: "My mother reads his book.",
        right: "My mother reads her book.",
        note: {
          en: "The owner is **my mother** (female) → **her**.",
          vi: "Người sở hữu là **my mother** (nữ) → **her**.",
          ja: "持ち主が **my mother**（女性）→ **her**。",
        },
      },
      {
        wrong: "My brother loves her car.",
        right: "My brother loves his car.",
        note: {
          en: "**Brother** is male → **his**, no matter what the object is.",
          vi: "**Brother** là nam → **his**, bất kể đồ vật là gì.",
          ja: "**Brother** は男性 → 物が何でも **his**。",
        },
      },
      {
        wrong: "Lan forgot his phone at home.",
        right: "Lan forgot her phone at home.",
      },
      {
        wrong: "Tell Tuan to bring her passport.",
        right: "Tell Tuan to bring his passport.",
      },
    ],
    practice: [
      { prompt: "My sister left ___ bag on the bus.", answer: "her" },
      { prompt: "Hung is calling ___ mother.", answer: "his" },
      { prompt: "The boy dropped ___ ice cream.", answer: "his" },
      { prompt: "Did your aunt bring ___ passport?", answer: "her" },
      { prompt: "Mai is waiting for ___ husband.", answer: "her" },
      { prompt: "My uncle forgot ___ keys again.", answer: "his" },
    ],
    tip: {
      en: "Look at the **owner**, not the thing. Man → **his**. Woman → **her**. Forget what the object is.",
      vi: "Nhìn vào **người sở hữu**, không phải đồ vật. Nam → **his**. Nữ → **her**. Kệ đồ vật là gì.",
      ja: "物ではなく**持ち主**を見る。男性 → **his**。女性 → **her**。物は気にしない。",
    },
  },

  // 13. Prepositions — in/on/at for time & place
  vi_l1_preposition_transfer: {
    tag: "vi_l1_preposition_transfer",
    title: {
      en: "**In / on / at** — memorise, don't translate",
      vi: "**In / on / at** — học thuộc, đừng dịch",
      ja: "**In / on / at** — 日本語の助詞で考えない",
    },
    concept: {
      en: "Vietnamese prepositions don't map one-to-one onto English. English uses **in** for large chunks (months, years, cities), **on** for surfaces and specific days, **at** for precise points (times, addresses).",
      vi: "Giới từ tiếng Việt không dịch thẳng sang tiếng Anh. Tiếng Anh dùng **in** cho đơn vị lớn (tháng, năm, thành phố), **on** cho bề mặt và ngày cụ thể, **at** cho điểm chính xác (giờ, địa chỉ).",
      ja: "日本語の助詞（に、で、を）と英語の前置詞（in, on, at）は一対一で対応しません。特に in/on/at の使い分けは、日本語の「〜に」一語でカバーされる範囲が広いため、混乱しがちです。基本ルール：**in** は大きな時間・空間（月、年、都市、国）、**on** は面や特定の曜日・日付、**at** はピンポイントの時点や場所（時刻、住所、週末）。「月曜日に」は on Monday（× in Monday）、「7時に」は at 7 o'clock（× on 7 o'clock）。丸暗記が必要な部分もありますが、この三区分をまず体に染み込ませましょう。",
    },
    examples: [
      {
        wrong: "I see you in Monday.",
        right: "I see you on Monday.",
        note: {
          en: "Days of the week → **on**.",
          vi: "Ngày trong tuần → **on**.",
        },
      },
      {
        wrong: "The meeting is on 9 o'clock.",
        right: "The meeting is at 9 o'clock.",
        note: {
          en: "Clock times → **at**.",
          vi: "Giờ cụ thể → **at**.",
        },
      },
      {
        wrong: "I was born on 1998.",
        right: "I was born in 1998.",
        note: {
          en: "Years and months → **in**.",
          vi: "Năm, tháng → **in**.",
        },
      },
      {
        wrong: "She lives on Hanoi.",
        right: "She lives in Hanoi.",
        note: {
          en: "Cities and countries → **in**.",
          vi: "Thành phố, quốc gia → **in**.",
        },
      },
    ],
    practice: [
      { prompt: "My birthday is ___ June.", answer: "in" },
      { prompt: "The class starts ___ 8:30.", answer: "at" },
      { prompt: "We'll meet ___ Saturday.", answer: "on" },
      { prompt: "I grew up ___ Da Nang.", answer: "in" },
      { prompt: "The book is ___ the table.", answer: "on" },
      { prompt: "She'll arrive ___ the weekend.", answer: "at" },
    ],
    tip: {
      en: "Big block (year, month, country) → **in**. Surface or specific day → **on**. Point in time (o'clock, weekend) → **at**.",
      vi: "Khối lớn (năm, tháng, quốc gia) → **in**. Bề mặt hay ngày cụ thể → **on**. Điểm thời gian (giờ, cuối tuần) → **at**.",
      ja: "大きな塊（年、月、国）→ **in**。面や特定の日 → **on**。ピンポイントの時点 → **at**。日本語の「〜に」をそのまま訳さず、この三区分で考えてください。",
    },
  },

  // 14. Countable vs uncountable
  vi_l1_countable: {
    tag: "vi_l1_countable",
    title: {
      en: "Uncountable nouns — no **-s**, no **a/an**",
      vi: "Danh từ không đếm được — không **-s**, không **a/an**",
      ja: "不可算名詞：**-s** も **a/an** もつかない名詞たち",
    },
    concept: {
      en: "Vietnamese treats **advice**, **information**, **furniture** like any other noun. English treats them as uncountable masses — no plural **-s**, no **a** or **an**, and they take singular verbs.",
      vi: "Tiếng Việt mình coi **advice**, **information**, **furniture** như danh từ bình thường. Tiếng Anh coi chúng là khối không đếm được — không thêm **-s**, không có **a/an**, động từ số ít.",
      ja: "日本語では可算・不可算の区別が文法化されていません。「アドバイス」も「情報」も「家具」も、普通に数えられるように感じますが、英語ではこれらは不可算名詞として扱われます。複数形の -s はつけず、a/an も使えず、動詞は単数扱い。特に advice, information, furniture, homework, news, research, equipment, luggage は日本人がよく間違える不可算名詞なので要注意です。「一つのアドバイス」は an advice ではなく a piece of advice。「多くの情報」は many informations ではなく a lot of information / much information です。",
    },
    examples: [
      {
        wrong: "She gave me many advices.",
        right: "She gave me a lot of advice.",
        note: {
          en: "**Advice** is uncountable — say **some advice** or **a piece of advice**.",
          vi: "**Advice** không đếm được — nói **some advice** hoặc **a piece of advice**.",
        },
      },
      {
        wrong: "I need an information about the class.",
        right: "I need some information about the class.",
        note: {
          en: "**Information** has no plural and never takes **a/an**.",
          vi: "**Information** không có số nhiều và không đi với **a/an**.",
        },
      },
      {
        wrong: "We bought new furnitures last week.",
        right: "We bought new furniture last week.",
      },
      {
        wrong: "He gave me many homeworks.",
        right: "He gave me a lot of homework.",
      },
    ],
    practice: [
      { prompt: "Can I ask you for ___ advice?", answer: "some" },
      { prompt: "I have a lot of ___ to finish tonight.", answer: "homework" },
      { prompt: "They bought new ___ for the office.", answer: "furniture" },
      { prompt: "She gave me useful ___.", answer: "information" },
      { prompt: "I don't have much ___ today.", answer: "news" },
      { prompt: "We need more ___ before deciding.", answer: "research" },
    ],
    tip: {
      en: "**Advice, information, furniture, homework, news, research, equipment, luggage** — all uncountable. No **-s**, no **a/an**, singular verb.",
      vi: "**Advice, information, furniture, homework, news, research, equipment, luggage** — đều không đếm được. Không **-s**, không **a/an**, động từ số ít.",
      ja: "**advice, information, furniture, homework, news, research, equipment, luggage** — すべて不可算名詞。複数形の -s なし、a/an なし、動詞は単数形。数えたいときは a piece of advice / some information のように言い換えます。",
    },
  },

  // 15. Modal + plain verb (no "to")
  vi_l1_can_no_infinitive: {
    tag: "vi_l1_can_no_infinitive",
    title: {
      en: "**Can / must / should** + plain verb",
      vi: "**Can / must / should** + động từ gốc",
      ja: "**Can / must / should** + 動詞の原形",
    },
    concept: {
      en: "Vietnamese **có thể / phải / nên** sits right before the verb with nothing extra. English modals take the plain verb — never **to** in between, and never **-s** on the verb.",
      vi: "Tiếng Việt mình **có thể / phải / nên** đứng ngay trước động từ, không thêm gì. Tiếng Anh các modal đi với động từ gốc — không có **to** ở giữa, cũng không thêm **-s**.",
      ja: "日本語の「〜できる」「〜しなければならない」「〜すべき」は助動詞的に使いますが、英語の **can / must / should** の後ろは必ず**動詞の原形**です。「can to swim」ではなく「can **swim**」。「she should goes」ではなく「she should **go**」。**to** も **-s** も付けません。",
    },
    examples: [
      {
        wrong: "I can to swim.",
        right: "I can swim.",
      },
      {
        wrong: "You must to study harder.",
        right: "You must study harder.",
      },
      {
        wrong: "She should goes now.",
        right: "She should go now.",
        note: {
          en: "Even with **she**, no **-s** after a modal.",
          vi: "Dù chủ ngữ là **she**, sau modal cũng không thêm **-s**.",
          ja: "主語が **she** でも、modal の後の動詞に **-s** は付けません。",
        },
      },
      {
        wrong: "We might to leave early.",
        right: "We might leave early.",
      },
    ],
    practice: [
      { prompt: "I can ___ a little English.", answer: "speak" },
      { prompt: "You should ___ more water.", answer: "drink" },
      { prompt: "He must ___ the report today.", answer: "finish" },
      { prompt: "We might ___ to Hue tomorrow.", answer: "go" },
      { prompt: "She can ___ the piano beautifully.", answer: "play" },
      { prompt: "You shouldn't ___ so much coffee.", answer: "drink" },
    ],
    tip: {
      en: "Modal + **plain verb**. No **to**. No **-s**. Every time.",
      vi: "Modal + **động từ gốc**. Không **to**. Không **-s**. Luôn luôn.",
      ja: "Modal（can / must / should / might / will）+ **動詞の原形**。**to** も **-s** も付けない。これは絶対ルールです。",
    },
  },

  // 16. Possessive 's (Lan's book)
  vi_l1_possessive_s_missing: {
    tag: "vi_l1_possessive_s_missing",
    title: {
      en: "Possessive **'s**",
      vi: "Sở hữu với **'s**",
      ja: "所有の **'s**",
    },
    concept: {
      en: "Vietnamese shows possession with **của** between the two nouns — **sách của Lan**. English attaches **'s** to the owner and flips the order: **Lan's book**.",
      vi: "Tiếng Việt mình dùng **của** giữa hai danh từ — **sách của Lan**. Tiếng Anh thêm **'s** vào người sở hữu và đảo thứ tự: **Lan's book**.",
      ja: "日本語の「〜の」（Langの本）は英語の所有 **'s** と語順が似ていますが、英語の方がよりコンパクトです。「the book of Lan」ではなく「**Lan's book**」。所有者に **'s** を付けて、後ろに所有物を置きます。これは日本語の語順と同じなので、比較的理解しやすいポイントです。",
    },
    examples: [
      {
        wrong: "This is Lan book.",
        right: "This is Lan's book.",
      },
      {
        wrong: "My brother wife is a doctor.",
        right: "My brother's wife is a doctor.",
      },
      {
        wrong: "The dog of my friend is cute.",
        right: "My friend's dog is cute.",
        note: {
          en: "English speakers prefer **owner + 's + thing** for people and pets.",
          vi: "Người Anh hay nói **người sở hữu + 's + đồ vật** cho người và vật nuôi.",
        },
      },
      {
        wrong: "I saw the car of Tuan.",
        right: "I saw Tuan's car.",
      },
    ],
    practice: [
      { prompt: "This is ___ phone. (Hung)", answer: "Hung's" },
      { prompt: "Do you know ___ address? (Mai)", answer: "Mai's" },
      { prompt: "I like my ___ cooking. (mother)", answer: "mother's" },
      { prompt: "Where is ___ office? (your father)", answer: "your father's" },
      { prompt: "The ___ name is Tuki. (dog)", answer: "dog's" },
      { prompt: "I borrowed my ___ umbrella. (friend)", answer: "friend's" },
    ],
    tip: {
      en: "Owner first, then **'s**, then the thing. **Lan's book**, **my brother's wife**. Short and direct.",
      vi: "Người sở hữu trước, rồi **'s**, rồi đồ vật. **Lan's book**, **my brother's wife**. Ngắn gọn, trực tiếp.",
      ja: "所有者 → **'s** → 所有物。**Lan's book**（ランの本）、**my brother's wife**（兄の妻）。日本語の「〜の」と同じ語順で覚えやすいです。",
    },
  },

  // 17. Adjective before noun
  vi_l1_adjective_order: {
    tag: "vi_l1_adjective_order",
    title: {
      en: "Adjective **before** the noun",
      vi: "Tính từ đứng **trước** danh từ",
      ja: "形容詞は名詞の**前**に置く",
    },
    concept: {
      en: "Vietnamese places the adjective **after** the noun: **áo đỏ**. English flips it — adjective comes **before** the noun: **a red shirt**.",
      vi: "Tiếng Việt mình đặt tính từ **sau** danh từ: **áo đỏ**. Tiếng Anh đảo lại — tính từ đứng **trước** danh từ: **a red shirt**.",
      ja: "日本語も形容詞は名詞の前に置きます（「赤いシャツ」）が、英語の語順はさらに厳格です。英語では必ず **形容詞 → 名詞** の順。「a shirt red」ではなく「a **red** shirt」。また、形容詞を重ねるときは「意見 → サイズ → 年齢 → 形 → 色 → 起源 → 素材 → 目的」の順番があり、これは日本語の「小さくて赤い車」のような自然な順序感覚とは異なるので注意が必要です。",
    },
    examples: [
      {
        wrong: "I want a shirt red.",
        right: "I want a red shirt.",
      },
      {
        wrong: "She lives in a house big.",
        right: "She lives in a big house.",
      },
      {
        wrong: "I bought a car expensive.",
        right: "I bought an expensive car.",
        note: {
          en: "**Expensive** starts with a vowel sound → **an** (not **a**).",
          vi: "**Expensive** bắt đầu bằng nguyên âm → **an** (không phải **a**).",
          ja: "**Expensive** は母音で始まるので **an**（**a** ではない）。",
        },
      },
      {
        wrong: "We met a man old and kind.",
        right: "We met a kind old man.",
        note: {
          en: "When you stack adjectives, opinion comes before age: **kind old man**.",
          vi: "Khi có nhiều tính từ, ý kiến đứng trước tuổi: **kind old man**.",
          ja: "形容詞を重ねるときは「意見 → 年齢」の順：**kind old man**（親切で年老いた男性）。",
        },
      },
    ],
    practice: [
      { prompt: "She has a ___ dress.", answer: "beautiful" },
      { prompt: "I like ___ coffee.", answer: "strong" },
      { prompt: "He drives an ___ motorbike.", answer: "old" },
      { prompt: "They live in a ___ apartment.", answer: "small" },
      { prompt: "I bought a ___ phone last week.", answer: "new" },
      { prompt: "We had a ___ meal.", answer: "delicious" },
    ],
    tip: {
      en: "**Red shirt**, not **shirt red**. Adjective → noun, always in that order.",
      vi: "**Red shirt**, không phải **shirt red**. Tính từ → danh từ, luôn theo thứ tự đó.",
      ja: "**Red shirt**（赤いシャツ）。**shirt red** ではありません。形容詞 → 名詞、この順番は絶対です。日本語と同じ語順だと思うと覚えやすいですが、英語の方がより厳格です。",
    },
  },

  // 18. Very vs very much
  vi_l1_very_much_placement: {
    tag: "vi_l1_very_much_placement",
    title: {
      en: "**Very** with adjectives, **very much** with verbs",
      vi: "**Very** với tính từ, **very much** với động từ",
      ja: "**Very** は形容詞、**very much** は動詞と使う",
    },
    concept: {
      en: "Vietnamese **rất** sits right before any word — **rất thích**, **rất vui**. English splits: **very** goes with adjectives (**very happy**); with verbs, say **… very much** at the end (**I like it very much**).",
      vi: "Tiếng Việt **rất** đứng trước mọi từ — **rất thích**, **rất vui**. Tiếng Anh chia hai: **very** với tính từ (**very happy**); với động từ, dùng **… very much** ở cuối (**I like it very much**).",
      ja: "日本語の「とても」は形容詞にも動詞にも使えますが、英語は区別します。形容詞の前は **very**（**very** happy）、動詞の後ろは **very much**（I like it **very much**）。「I very like coffee」は間違いで、「I like coffee **very much**」が正解です。",
    },
    examples: [
      {
        wrong: "I very like coffee.",
        right: "I like coffee very much.",
      },
      {
        wrong: "She very loves her job.",
        right: "She loves her job very much.",
      },
      {
        wrong: "I am very much happy today.",
        right: "I am very happy today.",
        note: {
          en: "With adjectives, just **very** — no **much**.",
          vi: "Với tính từ, chỉ **very** — không **much**.",
        },
      },
      {
        wrong: "Thank you very.",
        right: "Thank you very much.",
        note: {
          en: "**Thank** is a verb → **very much**.",
          vi: "**Thank** là động từ → **very much**.",
        },
      },
    ],
    practice: [
      { prompt: "This soup is ___ hot.", answer: "very" },
      { prompt: "I enjoyed the movie ___.", answer: "very much" },
      { prompt: "She is ___ kind to me.", answer: "very" },
      { prompt: "We appreciate your help ___.", answer: "very much" },
      { prompt: "The weather is ___ cold today.", answer: "very" },
      { prompt: "I miss my family ___.", answer: "very much" },
    ],
    tip: {
      en: "Adjective → **very** before it. Verb → **very much** at the end. Never **very like**.",
      vi: "Tính từ → **very** đứng trước. Động từ → **very much** ở cuối. Không bao giờ **very like**.",
      ja: "形容詞 → 前に **very**。動詞 → 文末に **very much**。「very like」は絶対にダメ。「like ... very much」です。",
    },
  },

  // 19. There is vs there are
  vi_l1_there_are_singular: {
    tag: "vi_l1_there_are_singular",
    title: {
      en: "**There is** (one) vs **there are** (many)",
      vi: "**There is** (một) vs **there are** (nhiều)",
      ja: "**There is**（1つ）vs **there are**（複数）",
    },
    concept: {
      en: "Vietnamese **có** stays the same for one thing or many. English switches: **there is** for singular or uncountable; **there are** for two or more countable things.",
      vi: "Tiếng Việt mình **có** dùng cho cả một hay nhiều. Tiếng Anh đổi: **there is** cho số ít hoặc không đếm được; **there are** cho hai thứ trở lên đếm được.",
      ja: "日本語の「〜がある／いる」は数で形が変わりませんが、英語では**単数・不可算 → there is**、**複数 → there are** と使い分けます。",
    },
    examples: [
      {
        wrong: "There are one book on the table.",
        right: "There is one book on the table.",
      },
      {
        wrong: "There is many students in the class.",
        right: "There are many students in the class.",
      },
      {
        wrong: "There are some milk in the fridge.",
        right: "There is some milk in the fridge.",
        note: {
          en: "**Milk** is uncountable → **there is**.",
          vi: "**Milk** không đếm được → **there is**.",
          ja: "**milk** は不可算 → **there is**。",
        },
      },
      {
        wrong: "There is three people waiting.",
        right: "There are three people waiting.",
      },
    ],
    practice: [
      { prompt: "___ two cats in the garden.", answer: "There are" },
      { prompt: "___ a problem with my phone.", answer: "There is" },
      { prompt: "___ a lot of traffic today.", answer: "There is" },
      { prompt: "___ many reasons to learn English.", answer: "There are" },
      { prompt: "___ some rice left.", answer: "There is" },
      { prompt: "___ five students absent today.", answer: "There are" },
    ],
    tip: {
      en: "Count the thing right after. One or uncountable → **there is**. Two or more countable → **there are**.",
      vi: "Đếm danh từ ngay sau đó. Một hay không đếm được → **there is**. Hai trở lên đếm được → **there are**.",
      ja: "直後の名詞を数える。1つまたは不可算 → **there is**。2つ以上の可算名詞 → **there are**。",
    },
  },

  // 20. Tag questions
  vi_l1_tag_question: {
    tag: "vi_l1_tag_question",
    title: {
      en: "Tag questions — flip the auxiliary",
      vi: "Câu hỏi đuôi — đổi trợ động từ",
      ja: "付加疑問文 — 助動詞を反転させる",
    },
    concept: {
      en: "Vietnamese uses one invariant tag — **phải không?**. English flips the auxiliary AND the polarity: positive statement gets a negative tag (**You're Vietnamese, aren't you?**); negative gets a positive tag (**You don't smoke, do you?**).",
      vi: "Tiếng Việt mình chỉ cần **phải không?**. Tiếng Anh đổi cả trợ động từ và thể: khẳng định → đuôi phủ định (**You're Vietnamese, aren't you?**); phủ định → đuôi khẳng định (**You don't smoke, do you?**).",
      ja: "日本語の「〜ですね」「〜でしょう」は文の形に関わらず常に同じです。英語では肯定文には否定の付加疑問（**You're Vietnamese, aren't you?**）、否定文には肯定の付加疑問（**You don't smoke, do you?**）をつけます。助動詞をコピーして肯定・否定を反転させるのがポイントです。",
    },
    examples: [
      {
        wrong: "You are Vietnamese, you are?",
        right: "You are Vietnamese, aren't you?",
      },
      {
        wrong: "She likes coffee, phải không?",
        right: "She likes coffee, doesn't she?",
        note: {
          en: "Present with **she** → tag uses **doesn't**.",
          vi: "Thì hiện tại với **she** → đuôi dùng **doesn't**.",
          ja: "現在形で主語が **she** の場合、付加疑問は **doesn't** を使います。日本語話者は「〜ですね」の感覚で **isn't it?** を多用しがちなので注意。",
        },
      },
      {
        wrong: "You didn't call me, didn't you?",
        right: "You didn't call me, did you?",
        note: {
          en: "Negative statement → positive tag. Don't double the negative.",
          vi: "Câu phủ định → đuôi khẳng định. Không lặp phủ định.",
          ja: "否定文の付加疑問は肯定形にします。日本語にはこの反転のルールがないため、否定を重ねてしまう（**didn't you?**）のは典型的なミスです。",
        },
      },
      {
        wrong: "It's raining, is it?",
        right: "It's raining, isn't it?",
      },
    ],
    practice: [
      { prompt: "You like tea, ___?", answer: "don't you" },
      { prompt: "She's a teacher, ___?", answer: "isn't she" },
      { prompt: "They didn't come, ___?", answer: "did they" },
      { prompt: "We can leave now, ___?", answer: "can't we" },
      { prompt: "He hasn't finished, ___?", answer: "has he" },
      { prompt: "You won't tell anyone, ___?", answer: "will you" },
    ],
    tip: {
      en: "Positive statement → negative tag. Negative statement → positive tag. Copy the auxiliary (or use **do/does/did**), then flip.",
      vi: "Khẳng định → đuôi phủ định. Phủ định → đuôi khẳng định. Lặp lại trợ động từ (hoặc dùng **do/does/did**), rồi đổi thể.",
      ja: "肯定文→否定の付加疑問。否定文→肯定の付加疑問。助動詞をそのままコピーし（なければ **do/does/did** を使い）、肯定・否定を反転。日本語の「〜ね」のように一つの形で済ませないこと。",
    },
  },

  // 21. Past perfect (had + V3)
  vi_l1_past_perfect_missing: {
    tag: "vi_l1_past_perfect_missing",
    title: {
      en: "Past perfect — **had + V3** for the earlier past",
      vi: "Quá khứ hoàn thành — **had + V3** cho việc xảy ra trước",
      ja: "過去完了 — **had + 過去分詞** で「より前の過去」を表す",
    },
    concept: {
      en: "Vietnamese uses **trước đó** or time order to show one past event happened before another. English marks the earlier event with **had + past participle** — **I had already eaten when she called**.",
      vi: "Tiếng Việt mình dùng **trước đó** hay thứ tự thời gian. Tiếng Anh dùng **had + V3** cho việc xảy ra trước — **I had already eaten when she called** (Tôi đã ăn xong trước khi cô ấy gọi).",
      ja: "日本語では「〜していた」「〜してしまっていた」と文脈や助詞で前後関係を示しますが、専用の時制はありません。英語は過去の出来事が二つあるとき、より前に起きた方に **had + 過去分詞** を使います — **I had already eaten when she called**（彼女が電話してきたとき、私はすでに食事を済ませていた）。日本語話者はこの時制の使い分けを省略しがちです。",
    },
    examples: [
      {
        wrong: "When she called, I already ate.",
        right: "When she called, I had already eaten.",
      },
      {
        wrong: "The train left before we arrived.",
        right: "The train had left before we arrived.",
        note: {
          en: "Earlier past event (**left**) → **had left**.",
          vi: "Việc xảy ra trước (**left**) → **had left**.",
          ja: "より前に起きた出来事（**left**）→ **had left**。日本語では「着く前に電車は出発していた」のように「〜ていた」で表現しますが、英語では **had + 過去分詞** が必須です。",
        },
      },
      {
        wrong: "I was tired because I worked all day.",
        right: "I was tired because I had worked all day.",
      },
      {
        wrong: "She had eat lunch before class.",
        right: "She had eaten lunch before class.",
        note: {
          en: "After **had**, use V3 (past participle): **eat → eaten**.",
          vi: "Sau **had**, dùng V3 (phân từ quá khứ): **eat → eaten**.",
          ja: "**had** の後は過去分詞形（V3）を使います：**eat → eaten**。**had eat** は文法的に誤りです。",
        },
      },
    ],
    practice: [
      { prompt: "By 10pm, we ___ (finish) dinner.", answer: "had finished" },
      { prompt: "He ___ (leave) before I got there.", answer: "had left" },
      { prompt: "I ___ (not see) her since June.", answer: "had not seen" },
      { prompt: "She was sad because she ___ (lose) her phone.", answer: "had lost" },
      { prompt: "They ___ (already eat) when we arrived.", answer: "had already eaten" },
      { prompt: "The movie ___ (start) before we sat down.", answer: "had started" },
    ],
    tip: {
      en: "Two past events? The earlier one takes **had + V3**. The later one stays in simple past.",
      vi: "Hai việc quá khứ? Việc trước dùng **had + V3**. Việc sau giữ thì quá khứ đơn.",
      ja: "過去の出来事が二つ？より前に起きた方を **had + 過去分詞**、後の方を単純過去形に。日本語の「〜していた」と違い、英語では時制の使い分けが文法上必須です。",
    },
  },

  // 22. Reported speech (backshift)
  vi_l1_reported_speech: {
    tag: "vi_l1_reported_speech",
    title: {
      en: "Reported speech — shift the tense back",
      vi: "Câu tường thuật — lùi thì một bậc",
      ja: "間接話法 — 時制を一つ戻す",
    },
    concept: {
      en: "Vietnamese quotes directly or uses **nói rằng** without changing the verb. English shifts the tense one step back when reporting — present becomes past, past becomes past perfect.",
      vi: "Tiếng Việt mình nói lại lời người khác thường giữ nguyên thì, hoặc dùng **nói rằng**. Tiếng Anh lùi thì một bậc — hiện tại → quá khứ, quá khứ → quá khứ hoàn thành.",
      ja: "日本語の間接話法（〜と言った）では、引用部分の時制を変えません。「彼女は疲れていると言った」のようにそのまま伝えます。英語では時制を一つ戻します（バックシフト）— 現在形→過去形、過去形→過去完了形。**She said she was tired**（彼女は疲れていると言った）のように、**is** が **was** になります。",
    },
    examples: [
      {
        wrong: "She said she is tired.",
        right: "She said she was tired.",
        note: {
          en: "Present **is** → past **was** after **said**.",
          vi: "Hiện tại **is** → quá khứ **was** sau **said**.",
          ja: "現在形 **is** は **said** の後では過去形 **was** になります。日本語では「彼女は疲れていると言った」と現在形のままなので、このバックシフトは特に注意が必要です。",
        },
      },
      {
        wrong: "He told me he likes pho.",
        right: "He told me he liked pho.",
      },
      {
        wrong: "They said they will come tomorrow.",
        right: "They said they would come the next day.",
        note: {
          en: "**Will** → **would**; **tomorrow** → **the next day**.",
          vi: "**Will** → **would**; **tomorrow** → **the next day**.",
          ja: "**will** → **would**、**tomorrow** → **the next day**。時制だけでなく、時の表現も変わります。日本語の間接話法では「明日」が「翌日」に変わることはないので、この二重の変換は日本語話者にとって盲点です。",
        },
      },
      {
        wrong: "She said she saw him yesterday.",
        right: "She said she had seen him the day before.",
      },
    ],
    practice: [
      { prompt: "She said she ___ (be) hungry.", answer: "was" },
      { prompt: "He told me he ___ (work) in a bank.", answer: "worked" },
      { prompt: "They said they ___ (will visit) us soon.", answer: "would visit" },
      { prompt: "Mai said she ___ (can't come) to the party.", answer: "couldn't come" },
      { prompt: "He told us he ___ (finish) the report.", answer: "had finished" },
      { prompt: "She said she ___ (live) in Hanoi for five years.", answer: "had lived" },
    ],
    tip: {
      en: "After **said / told**, push every verb one tense backwards. **Tomorrow → the next day**, **yesterday → the day before**.",
      vi: "Sau **said / told**, lùi mọi động từ một bậc. **Tomorrow → the next day**, **yesterday → the day before**.",
      ja: "**said / told** の後は、すべての動詞を一時制戻す。**tomorrow → the next day**、**yesterday → the day before**。日本語話者は「〜と言った」の後も元の時制を維持しがちなので、バックシフトを習慣づけること。",
    },
  },

  // 23. Since vs for
  vi_l1_since_vs_for: {
    tag: "vi_l1_since_vs_for",
    title: {
      en: "**Since** (a moment) vs **for** (a duration)",
      vi: "**Since** (mốc) vs **for** (khoảng)",
      ja: "**since**（起点）vs **for**（期間）",
    },
    concept: {
      en: "Vietnamese **từ** covers both a starting point and a length of time. English splits: **since** points to a specific moment (**since 2020**, **since Monday**); **for** measures the length (**for three years**).",
      vi: "Tiếng Việt mình **từ** dùng cho cả mốc và khoảng. Tiếng Anh tách: **since** chỉ mốc (**since 2020**, **since Monday**); **for** chỉ độ dài (**for three years**).",
      ja: "日本語の「〜から」は起点、「〜間」は期間を表します。英語も同様に **since** は起点（**since 2020**、**since Monday**）、**for** は期間の長さ（**for three years**）と明確に分かれます。ただし現在完了形との組み合わせでは、日本語にない概念なので混乱しやすいポイントです。",
    },
    examples: [
      {
        wrong: "I have lived here since three years.",
        right: "I have lived here for three years.",
      },
      {
        wrong: "She has worked here for 2020.",
        right: "She has worked here since 2020.",
      },
      {
        wrong: "We have been friends since a long time.",
        right: "We have been friends for a long time.",
        note: {
          en: "**A long time** is a length → **for**.",
          vi: "**A long time** là khoảng → **for**.",
          ja: "**a long time** は期間の長さ→ **for**。日本語の「長い間」と同じ感覚で、期間を表す表現には **for** を使います。",
        },
      },
      {
        wrong: "I haven't seen him for Tet.",
        right: "I haven't seen him since Tet.",
        note: {
          en: "**Tet** is a moment → **since**.",
          vi: "**Tet** là mốc → **since**.",
          ja: "**Tet** は特定の時点（起点）→ **since**。祝日や日付など、カレンダー上の一点には **since** を使います。",
        },
      },
    ],
    practice: [
      { prompt: "I've been studying English ___ five years.", answer: "for" },
      { prompt: "She's lived in Hue ___ 2018.", answer: "since" },
      { prompt: "We've known each other ___ high school.", answer: "since" },
      { prompt: "He's been waiting ___ an hour.", answer: "for" },
      { prompt: "I haven't eaten ___ breakfast.", answer: "since" },
      { prompt: "They've been married ___ ten years.", answer: "for" },
    ],
    tip: {
      en: "Can you point to a moment on a calendar? → **since**. Can you count the time? → **for**.",
      vi: "Chỉ được một mốc trên lịch? → **since**. Đếm được khoảng thời gian? → **for**.",
      ja: "カレンダー上の一点を指せる？→ **since**。時間の長さを数えられる？→ **for**。日本語の「〜から」と「〜間」の区別と同じですが、現在完了形との組み合わせでは英語独自のルールです。",
    },
  },

  // 24. Much vs many (countable vs uncountable)
  vi_l1_countable_much: {
    tag: "vi_l1_countable_much",
    title: {
      en: "**Much** with uncountable, **many** with countable",
      vi: "**Much** với không đếm được, **many** với đếm được",
      ja: "**much** は不可算名詞、**many** は可算名詞",
    },
    concept: {
      en: "Vietnamese **nhiều** works with everything. English splits: **much** only pairs with uncountable (**much water**, **much time**); **many** pairs with plural countables (**many friends**, **many books**).",
      vi: "Tiếng Việt mình **nhiều** dùng với mọi danh từ. Tiếng Anh tách: **much** với không đếm được (**much water**, **much time**); **many** với danh từ đếm được số nhiều (**many friends**, **many books**).",
      ja: "日本語の「多くの」は可算・不可算を区別しませんが、英語では明確に分かれます。**much** は不可算名詞（**much water**「多くの水」、**much time**「多くの時間」）、**many** は可算名詞の複数形（**many friends**「多くの友達」、**many books**「多くの本」）に使います。日本語話者は **much friends** のように混同しやすいので注意が必要です。",
    },
    examples: [
      {
        wrong: "I have much friends here.",
        right: "I have many friends here.",
      },
      {
        wrong: "How many money do you need?",
        right: "How much money do you need?",
        note: {
          en: "**Money** is uncountable → **much**.",
          vi: "**Money** không đếm được → **much**.",
          ja: "**money**（お金）は不可算名詞→ **much**。日本語では「いくつ」と数えてしまいがちですが、英語では数えられないものとして扱います。",
        },
      },
      {
        wrong: "She doesn't have much books.",
        right: "She doesn't have many books.",
      },
      {
        wrong: "We don't have many time.",
        right: "We don't have much time.",
      },
    ],
    practice: [
      { prompt: "How ___ water should I drink?", answer: "much" },
      { prompt: "I don't have ___ friends in this city.", answer: "many" },
      { prompt: "There aren't ___ chairs in the room.", answer: "many" },
      { prompt: "She has too ___ work to do.", answer: "much" },
      { prompt: "How ___ students are in your class?", answer: "many" },
      { prompt: "We don't have ___ sugar left.", answer: "much" },
    ],
    tip: {
      en: "Can you count it? → **many**. Can't you count it (water, time, money)? → **much**.",
      vi: "Đếm được? → **many**. Không đếm được (water, time, money)? → **much**.",
      ja: "数えられる？→ **many**。数えられない（water, time, money）？→ **much**。日本語には可算・不可算の文法カテゴリーがないため、名詞ごとに覚える必要があります。",
    },
  },

  // 25. Some vs any
  vi_l1_some_vs_any: {
    tag: "vi_l1_some_vs_any",
    title: {
      en: "**Some** in positives, **any** in negatives/questions",
      vi: "**Some** trong khẳng định, **any** trong phủ định/câu hỏi",
      ja: "**some** は肯定文、**any** は否定文・疑問文",
    },
    concept: {
      en: "Vietnamese uses **một vài** or **chút** in every sentence. English switches: **some** in positive statements (**I have some questions**); **any** in negatives and most questions (**Do you have any questions?**).",
      vi: "Tiếng Việt mình dùng **một vài** hay **chút** cho mọi loại câu. Tiếng Anh đổi: **some** trong câu khẳng định (**I have some questions**); **any** trong phủ định và đa số câu hỏi (**Do you have any questions?**).",
      ja: "日本語では「いくつか」「少し」を肯定・否定・疑問の区別なく使います。英語は文の種類によって使い分けます：肯定文では **some**（**I have some questions**「質問がいくつかあります」）、否定文とほとんどの疑問文では **any**（**Do you have any questions?**「質問はありますか」）を使います。日本語話者は **Do you have some questions?** のように肯定形を疑問文でも使ってしまう傾向があります。",
    },
    examples: [
      {
        wrong: "Do you have some questions?",
        right: "Do you have any questions?",
      },
      {
        wrong: "I don't have some money.",
        right: "I don't have any money.",
      },
      {
        wrong: "There are any books on the shelf.",
        right: "There are some books on the shelf.",
        note: {
          en: "Positive statement → **some**.",
          vi: "Câu khẳng định → **some**.",
          ja: "肯定文 → **some**。日本語では「本棚に本がある」のように肯定でも特に限定詞を変えませんが、英語では **some** が必要です。",
        },
      },
      {
        wrong: "Would you like any tea?",
        right: "Would you like some tea?",
        note: {
          en: "Offers and polite requests use **some**, not **any**.",
          vi: "Câu mời hay đề nghị lịch sự dùng **some**, không dùng **any**.",
          ja: "勧める・依頼するときは疑問文でも **some** を使います。日本語の「お茶はいかがですか」のように、相手に「ある」ことを前提に尋ねる場合は **any** ではなく **some** が自然です。",
        },
      },
    ],
    practice: [
      { prompt: "I bought ___ apples at the market.", answer: "some" },
      { prompt: "Do you have ___ brothers or sisters?", answer: "any" },
      { prompt: "There isn't ___ milk in the fridge.", answer: "any" },
      { prompt: "Would you like ___ coffee?", answer: "some" },
      { prompt: "She doesn't have ___ free time today.", answer: "any" },
      { prompt: "I need ___ help with this homework.", answer: "some" },
    ],
    tip: {
      en: "Yes sentence → **some**. No / question → **any**. Offering something politely → **some** (even in a question).",
      vi: "Câu có → **some**. Câu không / câu hỏi → **any**. Lịch sự mời ai → **some** (dù là câu hỏi).",
      ja: "肯定文 → **some**。否定・疑問文 → **any**。丁寧に勧めるとき → 疑問文でも **some**。日本語話者は「何か」の感覚で **any** を多用しがちですが、英語では「存在を前提にするかどうか」が選択基準です。",
    },
  },

  // 26. Reflexive pronouns (myself, yourself, etc.)
  vi_l1_reflexive_missing: {
    tag: "vi_l1_reflexive_missing",
    title: {
      en: "Reflexive pronouns — **myself**, **yourself**, **herself**",
      vi: "Đại từ phản thân — **myself**, **yourself**, **herself**",
      ja: "再帰代名詞 — **myself**, **yourself**, **herself**",
    },
    concept: {
      en: "Vietnamese uses **tự** before the verb: **tự học**, **tự nấu**. English puts a reflexive pronoun after the verb — **I taught myself**, **she cooks for herself**.",
      vi: "Tiếng Việt mình đặt **tự** trước động từ: **tự học**, **tự nấu**. Tiếng Anh đặt đại từ phản thân sau động từ — **I taught myself**, **she cooks for herself**.",
      ja: "日本語では「自分で」を動詞の前に置きます：「自分で勉強する」「自分で料理する」。英語では再帰代名詞を動詞の後に置きます — **I taught myself**（自分で勉強した）、**she cooks for herself**（彼女は自分のために料理する）。主語と目的語が同一人物のとき、英語では専用の代名詞（**-self / -selves**）が必須で、目的格代名詞（**me / her / him**）だけでは不十分です。",
    },
    examples: [
      {
        wrong: "I taught English by me.",
        right: "I taught myself English.",
      },
      {
        wrong: "She hurt her.",
        right: "She hurt herself.",
        note: {
          en: "Same subject and object → reflexive. **Her** refers to someone else; **herself** refers back to the subject.",
          vi: "Chủ ngữ và tân ngữ là cùng người → phản thân. **Her** là người khác; **herself** là chính chủ ngữ.",
          ja: "主語と目的語が同一人物 → 再帰代名詞。**her** は別の女性を指し、**herself** は主語自身を指します。日本語の「彼女は彼女を傷つけた」では主語と目的語の関係が曖昧ですが、英語は再帰代名詞で明確に区別します。",
        },
      },
      {
        wrong: "We enjoyed at the party.",
        right: "We enjoyed ourselves at the party.",
        note: {
          en: "**Enjoy** needs an object — when you mean \"have fun\", use **enjoy + yourself/ourselves**.",
          vi: "**Enjoy** cần có tân ngữ — khi muốn nói \"chơi vui\", dùng **enjoy + yourself/ourselves**.",
          ja: "**enjoy** は目的語が必須です。「楽しむ」の意味で自動詞的に使うときは **enjoy + yourself/ourselves** と再帰代名詞を添えます。日本語の「楽しんだ」のように動詞だけで完結させられない点に注意。",
        },
      },
      {
        wrong: "He introduced him to the class.",
        right: "He introduced himself to the class.",
      },
    ],
    practice: [
      { prompt: "I cut ___ while cooking.", answer: "myself" },
      { prompt: "She's teaching ___ to play guitar.", answer: "herself" },
      { prompt: "We enjoyed ___ last weekend.", answer: "ourselves" },
      { prompt: "He looked at ___ in the mirror.", answer: "himself" },
      { prompt: "Be careful — don't hurt ___.", answer: "yourself" },
      { prompt: "The cat washed ___.", answer: "itself" },
    ],
    tip: {
      en: "Same subject and object → **-self / -selves**. **I**→**myself**, **you**→**yourself(ves)**, **he**→**himself**, **she**→**herself**, **we**→**ourselves**, **they**→**themselves**, **it**→**itself**.",
      vi: "Chủ ngữ và tân ngữ là cùng người → **-self / -selves**. **I**→**myself**, **you**→**yourself(ves)**, **he**→**himself**, **she**→**herself**, **we**→**ourselves**, **they**→**themselves**, **it**→**itself**.",
      ja: "主語＝目的語 → **-self / -selves**。**I**→**myself**、**you**→**yourself(yourselves)**、**he**→**himself**、**she**→**herself**、**we**→**ourselves**、**they**→**themselves**、**it**→**itself**。日本語の「自分」は主語に関係なく同じ形ですが、英語は主語の人称・数に合わせて形が変わります。",
    },
  },

  // 27. Conditionals — match the tenses
  vi_l1_conditional_mix: {
    tag: "vi_l1_conditional_mix",
    title: {
      en: "**If** sentences — match the tenses",
      vi: "Câu **If** — hợp thì",
      ja: "**if** 文 — 時制の一致",
    },
    concept: {
      en: "Vietnamese **nếu… thì…** keeps verbs unchanged. English pairs the tenses strictly: zero = **if + present, present**; first (real) = **if + present, will + V**; second (unreal) = **if + past, would + V**. Never mix past with **will**.",
      vi: "Tiếng Việt mình **nếu… thì…** không đổi động từ. Tiếng Anh ghép đôi chặt: zero = **if + hiện tại, hiện tại**; loại 1 (có thật) = **if + hiện tại, will + V**; loại 2 (không có thật) = **if + quá khứ, would + V**. Không trộn quá khứ với **will**.",
      ja: "日本語の「〜ば」「〜たら」「〜なら」は条件を表しますが、主節の時制や助動詞は文脈任せで、文法上のペア規則はありません。英語は条件文の種類ごとに時制の組み合わせが厳密に決まっています：ゼロ条件（常に真）＝ **if + 現在形, 現在形**；ファースト条件（現実的未来）＝ **if + 現在形, will + V**；セカンド条件（非現実）＝ **if + 過去形, would + V**。過去形と **will** を混ぜるのは誤りです。日本語話者は「もしお金があれば、車を買うだろう」を **If I had money, I will buy a car** としてしまう典型的なミスに注意。",
    },
    examples: [
      {
        wrong: "If I had money, I will buy a car.",
        right: "If I had money, I would buy a car.",
        note: {
          en: "Past in the **if** clause → **would** in the main clause.",
          vi: "Quá khứ ở mệnh đề **if** → **would** ở mệnh đề chính.",
          ja: "**if** 節が過去形なら、主節は **would**。日本語の「もしお金があったら、車を買うだろう」の感覚で **will** を使ってしまうのが日本語話者の典型的なエラーです。非現実の仮定では「時制の逆戻し（バックシフト）」が必須です。",
        },
      },
      {
        wrong: "If it rains tomorrow, I stayed home.",
        right: "If it rains tomorrow, I will stay home.",
      },
      {
        wrong: "If water boils, it became steam.",
        right: "If water boils, it becomes steam.",
        note: {
          en: "Zero conditional = always true → both present.",
          vi: "Zero conditional = chân lý luôn đúng → cả hai hiện tại.",
          ja: "ゼロ条件（常に真実）→ 両方とも現在形。科学的事実や一般的真理には **if + 現在形, 現在形** を使います。日本語の「水が沸騰すると蒸気になる」も現在形ですが、英語でも時制を変えずにそのまま現在形で表現します。",
        },
      },
      {
        wrong: "If I was you, I will take the job.",
        right: "If I were you, I would take the job.",
        note: {
          en: "Unreal present uses **were** for all subjects (formal/neutral).",
          vi: "Điều kiện không có thật dùng **were** cho mọi chủ ngữ (trang trọng).",
          ja: "非現実の現在仮定では、主語に関わらず **were** を使います（フォーマル・標準）。**If I were you** は「もし私があなたなら」の定型表現。日本語の仮定法にはこのような動詞の特別な形がないため、**was** との使い分けに注意が必要です。",
        },
      },
    ],
    practice: [
      { prompt: "If you ___ (study) harder, you'll pass.", answer: "study" },
      { prompt: "If I ___ (have) wings, I would fly.", answer: "had" },
      { prompt: "If it rains, the ground ___ (get) wet.", answer: "gets" },
      { prompt: "If she called me, I ___ (answer).", answer: "would answer" },
      { prompt: "If we leave now, we ___ (catch) the train.", answer: "will catch" },
      { prompt: "If I ___ (be) rich, I would travel the world.", answer: "were" },
    ],
    tip: {
      en: "Real future: **if + present, will + V**. Unreal present: **if + past, would + V**. Always true: **if + present, present**.",
      vi: "Tương lai có thật: **if + hiện tại, will + V**. Không có thật: **if + quá khứ, would + V**. Luôn đúng: **if + hiện tại, hiện tại**.",
      ja: "現実的未来：**if + 現在形, will + V**。非現実の仮定：**if + 過去形, would + V**。常に真実：**if + 現在形, 現在形**。日本語の「〜ば」「〜たら」はすべて同じ接続で済みますが、英語は仮定の現実性によって時制の組み合わせを切り替えます。",
    },
  },

  // 28. Gerund vs infinitive (-ing vs to + V)
  vi_l1_to_infinitive_after_ing: {
    tag: "vi_l1_to_infinitive_after_ing",
    title: {
      en: "**-ing** vs **to + verb** — which follows which?",
      vi: "**-ing** vs **to + verb** — theo động từ nào?",
      ja: "**-ing** と **to + 動詞** — 前の動詞で決まる",
    },
    concept: {
      en: "Vietnamese uses the plain verb everywhere. English picks the shape based on the first verb: **enjoy**, **finish**, **avoid**, **mind** take **-ing** (**I enjoy swimming**); **want**, **plan**, **decide**, **hope** take **to + verb** (**I want to swim**).",
      vi: "Tiếng Việt mình chỉ dùng động từ gốc. Tiếng Anh chọn dạng theo động từ đứng trước: **enjoy**, **finish**, **avoid**, **mind** đi với **-ing** (**I enjoy swimming**); **want**, **plan**, **decide**, **hope** đi với **to + verb** (**I want to swim**).",
      ja: "日本語では「泳ぐことを楽しむ」「泳ぎたい」のように、前の動詞によって後続の形が変わることはなく、常に動詞の原形（辞書形）を使います。英語では前の動詞によって後ろに来る動詞の形が決まります。**enjoy**、**finish**、**avoid**、**mind** の後は **-ing** 形（**I enjoy swimming**「泳ぐことを楽しむ」）。**want**、**plan**、**decide**、**hope** の後は **to + 動詞**（**I want to swim**「泳ぎたい」）。このグルーピングは理屈ではなく、動詞ごとに覚える必要があります。",
    },
    examples: [
      {
        wrong: "I enjoy to swim.",
        right: "I enjoy swimming.",
      },
      {
        wrong: "She wants going home.",
        right: "She wants to go home.",
      },
      {
        wrong: "We finished to eat.",
        right: "We finished eating.",
      },
      {
        wrong: "I decided studying abroad.",
        right: "I decided to study abroad.",
      },
    ],
    practice: [
      { prompt: "I enjoy ___ (listen) to music.", answer: "listening" },
      { prompt: "She plans ___ (move) to Saigon.", answer: "to move" },
      { prompt: "They finished ___ (clean) the house.", answer: "cleaning" },
      { prompt: "He wants ___ (become) a doctor.", answer: "to become" },
      { prompt: "I don't mind ___ (wait) a little.", answer: "waiting" },
      { prompt: "We hope ___ (see) you soon.", answer: "to see" },
    ],
    tip: {
      en: "**-ing** after: enjoy, finish, avoid, mind, keep, suggest. **to + V** after: want, plan, decide, hope, need, promise.",
      vi: "**-ing** sau: enjoy, finish, avoid, mind, keep, suggest. **to + V** sau: want, plan, decide, hope, need, promise.",
      ja: "**-ing** をとる動詞：enjoy, finish, avoid, mind, keep, suggest（「楽しむ」「終える」「避ける」など、動作の完了・回避・継続を表す動詞が多い）。**to + V** をとる動詞：want, plan, decide, hope, need, promise（「〜したい」「〜するつもり」など、未来志向の動詞が多い）。日本語にはこの区別がないため、動詞ごとにペアで覚えるのが確実です。",
    },
  },

  // 29. Passive voice needs be + V3
  vi_l1_passive_missing_be: {
    tag: "vi_l1_passive_missing_be",
    title: {
      en: "Passive voice needs **be + V3**",
      vi: "Bị động cần **be + V3**",
      ja: "受動態には **be + 過去分詞** が必要",
    },
    concept: {
      en: "Vietnamese marks the passive with **bị** or **được** before the verb. English needs a form of **be** (is / was / will be) plus the past participle — **The letter was written**, not **The letter written**.",
      vi: "Tiếng Việt mình dùng **bị** hoặc **được** trước động từ là thành bị động. Tiếng Anh cần **be** (is / was / will be) + V3 — **The letter was written**, không phải **The letter written**.",
      ja: "日本語の受動態は「書かれる」「作られる」のように、動詞の語尾に「〜れる／〜られる」を付けて一語で表現します。英語の受動態は **be動詞 + 過去分詞（V3）** の二語構造が必須です — **The letter was written**（手紙が書かれた）であって、**The letter written** では不完全文です。日本語話者は **be** を落としてしまう傾向があります。これは日本語の受身が助動詞を必要としないためです。",
    },
    examples: [
      {
        wrong: "The letter written yesterday.",
        right: "The letter was written yesterday.",
      },
      {
        wrong: "English speak all over the world.",
        right: "English is spoken all over the world.",
      },
      {
        wrong: "The house built in 1990.",
        right: "The house was built in 1990.",
      },
      {
        wrong: "The car will repair tomorrow.",
        right: "The car will be repaired tomorrow.",
        note: {
          en: "Future passive: **will be** + V3.",
          vi: "Bị động tương lai: **will be** + V3.",
          ja: "未来の受動態：**will be** + V3。日本語では「車は明日修理される」のように「〜される」で未来も現在も同じ受身表現を使えますが、英語では時制に応じて **be** の形を変える（**was**/**is**/**will be**）+ 過去分詞の組み合わせが必要です。",
        },
      },
    ],
    practice: [
      { prompt: "This book ___ (write) by Nguyen Du.", answer: "was written" },
      { prompt: "Rice ___ (grow) in many parts of Asia.", answer: "is grown" },
      { prompt: "The bridge ___ (build) last year.", answer: "was built" },
      { prompt: "The report ___ (finish) by tomorrow.", answer: "will be finished" },
      { prompt: "Vietnamese ___ (speak) by 95 million people.", answer: "is spoken" },
      { prompt: "My bike ___ (steal) last week.", answer: "was stolen" },
    ],
    tip: {
      en: "Passive = **be** (in the right tense) + **past participle (V3)**. Missing **be**? Not a complete sentence.",
      vi: "Bị động = **be** (đúng thì) + **V3**. Thiếu **be**? Chưa thành câu hoàn chỉnh.",
      ja: "受動態 = **be**（適切な時制で）+ **過去分詞（V3）**。**be** がないと不完全文。日本語の「〜れる／〜られる」は一語で完結するので、英語では必ず **be + 過去分詞** の二語セットで書く習慣をつけましょう。",
    },
  },

  // 30. Relative pronouns (who / which / that)
  vi_l1_relative_pronoun: {
    tag: "vi_l1_relative_pronoun",
    title: {
      en: "**Who** for people, **which** for things",
      vi: "**Who** cho người, **which** cho vật",
      ja: "**who** は人、**which** は物",
    },
    concept: {
      en: "Vietnamese joins clauses with **mà** for everything. English picks the pronoun by what it refers to: **who** for people, **which** for things, **that** works for both in defining clauses.",
      vi: "Tiếng Việt mình dùng **mà** nối câu cho mọi thứ. Tiếng Anh chọn theo đối tượng: **who** cho người, **which** cho vật, **that** cho cả hai ở mệnh đề xác định.",
      ja: "日本語は関係詞を使わず、連体修飾（「〜している人」「〜した本」）で名詞を修飾します。英語では、先行詞（修飾される名詞）が人の場合は **who**、物の場合は **which**、そして限定用法では両方に **that** が使えます。日本語話者はすべてを **which** にしてしまったり、関係詞自体を省略してしまう（**The man called you is here**）傾向があります。",
    },
    examples: [
      {
        wrong: "The man which called you is here.",
        right: "The man who called you is here.",
      },
      {
        wrong: "This is the book who I told you about.",
        right: "This is the book which I told you about.",
      },
      {
        wrong: "I have a friend which lives in Da Lat.",
        right: "I have a friend who lives in Da Lat.",
      },
      {
        wrong: "The car who my father bought is red.",
        right: "The car that my father bought is red.",
        note: {
          en: "**That** is the safe choice when you're not sure — it works for both people and things in defining clauses.",
          vi: "**That** là lựa chọn an toàn khi chưa chắc — dùng được cho cả người và vật ở mệnh đề xác định.",
          ja: "**that** は人にも物にも使える安全な選択肢です。限定用法（その名詞を特定するための修飾）では **that** が最も汎用的です。日本語話者はまず **that** に慣れ、その後 **who**/**which** の使い分けを習得するのが効率的です。",
        },
      },
    ],
    practice: [
      { prompt: "The woman ___ sells fruit is very kind.", answer: "who" },
      { prompt: "I lost the phone ___ I bought last month.", answer: "which" },
      { prompt: "Do you know the man ___ is sitting there?", answer: "who" },
      { prompt: "This is the song ___ I love.", answer: "which" },
      { prompt: "The student ___ won the prize is from Hue.", answer: "who" },
      { prompt: "The movie ___ we watched was boring.", answer: "that" },
    ],
    tip: {
      en: "Person → **who**. Thing → **which**. Unsure or mixed → **that**. Never **which** for a person.",
      vi: "Người → **who**. Vật → **which**. Chưa chắc hoặc lẫn lộn → **that**. Không bao giờ dùng **which** cho người.",
      ja: "人 → **who**。物 → **which**。迷ったら → **that**。人に **which** は使わない。日本語には関係代名詞という品詞自体が存在しないため、この区別はまったく新しい概念です。まず「名詞＋説明」のパターンで文を作る感覚に慣れましょう。",
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
