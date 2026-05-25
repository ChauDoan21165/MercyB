/**
 * Vietnamese rule-pack: bilingual short-form feedback strings.
 *
 * One entry per L1 rule. The `en` and `vi` strings are surfaced
 * verbatim by the UI after token substitution. Approved native-speaker
 * drafts — do NOT edit casually; changes need Chau's review.
 *
 * Long-form teacher-voice copy (rule names, paragraph-length
 * explanations, wrong-VN gloss, review flags) lives in
 * `src/lib/feedback/l1-vn-explanations.ts` and is consumed by detail
 * UIs, not by the answer-time bubble.
 *
 * Refactor note (Step 10): this is the data block formerly inlined in
 * `l1-error-detector.ts` as `RULE_STRINGS`. Format converted from
 * `Record<tag, {en,vi}>` to `Array<{tag,en,vi}>` to match the
 * cross-language `L1Explanation[]` shape.
 */

import type { L1Explanation } from '../../rule-pack-types.js';

export const VN_EXPLANATIONS: L1Explanation[] = [
  {
    tag: 'vi_l1_3rd_person_s',
    en: 'In English, verbs change after **she**, **he**, or **it** — we add **-s**. Vietnamese keeps the verb the same. Try: *{FIX}*.',
    vi: 'Trong tiếng Anh, động từ đi với **she / he / it** phải thêm **-s**. Tiếng Việt mình không có quy tắc này. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_past_ed',
    en: 'When you use a past-time word like **yesterday** or **last week**, English also changes the verb — add **-ed**. Vietnamese leaves the verb alone. *work* → *worked*. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình chỉ cần nói **hôm qua** là đủ. Tiếng Anh còn phải thêm **-ed** vào động từ. *work* → *worked*. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_plural_s',
    en: 'English marks plurals on the noun itself — add **-s**. In tư duy Việt, \'hai quyển sách\' lets the number do the work, so the noun stays the same. English needs both. Try: *{FIX}*.',
    vi: 'Trong tư duy Việt, \'hai quyển sách\' là đủ — danh từ không đổi. Tiếng Anh phải thêm **-s** vào chính danh từ. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_missing_be',
    en: "Vietnamese says 'tôi mệt' — adjective alone is fine. English needs a **be**-verb: **am / is / are**. Try: *{FIX}*.",
    vi: "Tiếng Việt mình nói 'tôi mệt' là xong. Tiếng Anh cần thêm **am / is / are** giữa chủ ngữ và tính từ. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_question_no_aux',
    en: 'Vietnamese makes a question by adding **không** at the end. English moves a helper verb — **do**, **does**, or **did** — to the front. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình thêm **không** cuối câu là thành câu hỏi. Tiếng Anh phải đưa **do / does / did** lên đầu. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_missing_article',
    en: 'Vietnamese has no articles. English usually needs **a**, **an**, or **the** before a noun. Example: **the book** (a specific one), **a book** (any one). Try: *{FIX}*.',
    vi: 'Tiếng Việt mình không có mạo từ. Tiếng Anh thường cần **a / an / the** trước danh từ. Ví dụ: **the book** (cuốn sách đó), **a book** (một cuốn sách). Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_possessive_gender',
    en: 'Vietnamese uses **của anh ấy** or **của cô ấy** — same structure regardless of the owner. English changes the possessive word itself: **his** for a man, **her** for a woman. Try: *{FIX}*.',
    vi: 'Tiếng Việt mình dùng **của anh ấy** hoặc **của cô ấy** — cấu trúc giống nhau. Tiếng Anh đổi từ sở hữu theo giới tính: **his** cho nam, **her** cho nữ. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_preposition_transfer',
    en: "English prepositions don't translate one-to-one from Vietnamese. Here, swap **{USER_PREP}** for **{FIX_PREP}**. Try: *{FIX}*.",
    vi: 'Mỗi giới từ tiếng Anh có cách dùng riêng, không dịch trực tiếp từ tiếng Việt được. Chỗ này đổi **{USER_PREP}** thành **{FIX_PREP}**. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_countable',
    en: "In English some nouns don't count — **advice**, **information**, **furniture**, **news**. No **a / an** and no plural **-s**. Vietnamese counts them normally. Try: *{FIX}*.",
    vi: 'Tiếng Anh có những danh từ không đếm được — **advice**, **information**, **furniture**, **news**. Không dùng **a / an**, không thêm **-s**. Tiếng Việt mình đếm bình thường. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_to_verb_confusion',
    en: "After verbs like **want**, **need**, **try**, **hope**, English inserts **to** before the next verb. Tiếng Việt mình nói 'tôi muốn đi' — một mạch. English takes the extra step. Try: *{FIX}*.",
    vi: "Sau các động từ như **want / need / try / hope**, tiếng Anh cần **to** trước động từ tiếp theo. Tiếng Việt mình nói 'tôi muốn đi' thẳng một mạch — tiếng Anh cần thêm bước. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_can_no_infinitive',
    en: 'After a modal — **can**, **could**, **will**, **should** — English keeps the next verb in its bare form. No **-s**, no **-ed**, no **-ing**. Vietnamese keeps verbs unchanged too, so let the modal carry the meaning. Try: *{FIX}*.',
    vi: 'Sau trợ động từ **can / could / will / should**, tiếng Anh giữ động từ ở dạng gốc — không thêm **-s**, **-ed**, **-ing**. Tiếng Việt mình cũng để động từ nguyên. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_double_past',
    en: "English marks past tense **once**. If you already said **did** or **didn't**, the main verb stays bare. *I didn't went* → *I didn't go*. Try: *{FIX}*.",
    vi: "Tiếng Anh chỉ đánh dấu quá khứ **một lần**. **did / didn't** đã là quá khứ rồi, nên động từ chính giữ nguyên dạng gốc. *I didn't went* → *I didn't go*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_possessive_s_missing',
    en: "Vietnamese says 'nhà của mẹ' or just 'nhà mẹ' — two nouns can touch. English puts **'s** between them: *my mother's house*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình nói 'nhà của mẹ' hoặc 'nhà mẹ' — hai danh từ ghép được. Tiếng Anh thêm **'s** vào giữa: *my mother's house*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_comparative_double',
    en: 'Use **more** OR the **-er** ending — never both. *more better* → *better*. *more faster* → *faster*. Try: *{FIX}*.',
    vi: 'Tiếng Anh dùng **more** HOẶC đuôi **-er**, không dùng cả hai cùng lúc. *more better* → *better*. *more faster* → *faster*. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_adjective_order',
    en: "In English, adjectives come **before** the noun — *red car*, not *car red*. Tiếng Việt mình đặt tính từ sau danh từ ('xe đỏ'); English flips the order. Try: *{FIX}*.",
    vi: "Trong tiếng Anh, tính từ đứng **trước** danh từ — *red car*, không phải *car red*. Tiếng Việt mình đặt tính từ sau ('xe đỏ'), tiếng Anh đảo ngược lại. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_very_much_placement',
    en: 'In English, **very much** usually comes after the verb or object, not before it. *I very much like it* → *I like it very much*. Try: *{FIX}*.',
    vi: 'Trong tiếng Anh, **very much** thường đứng sau động từ hoặc tân ngữ, không đứng trước. *I very much like it* → *I like it very much*. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_there_are_singular',
    en: '**There is** goes with singular — *a book*, *an apple*, *one cat*. **There are** is only for plural. Try: *{FIX}*.',
    vi: '**There is** đi với số ít — *a book*, *an apple*, *one cat*. **There are** chỉ dùng cho số nhiều. Thử: *{FIX}*.',
  },
  {
    tag: 'vi_l1_everyone_plural',
    en: "Words like **everyone**, **someone**, **nobody** look plural but take a **singular** verb in English — *everyone **is** here*, not *are*. Try: *{FIX}*.",
    vi: "Các từ **everyone / someone / nobody** nghe như số nhiều nhưng tiếng Anh đi với động từ **số ít** — *everyone **is** here*, không phải *are*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_make_vs_do',
    en: "**Make** and **do** both translate to **làm** in Vietnamese, but English picks one based on the noun. Here, **{WRONG}** should be **{RIGHT}**. Try: *{FIX}*.",
    vi: "**Make** và **do** đều dịch là **làm** trong tiếng Việt, nhưng tiếng Anh chọn từ nào tùy danh từ đi kèm. Chỗ này **{WRONG}** → **{RIGHT}**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_tag_question',
    en: "Vietnamese tags a question with 'không?' at the end. English builds a **tag question** that mirrors the main verb: *you like coffee, **don't you**?* Try: *{FIX}*.",
    vi: "Tiếng Việt mình thêm 'không?' cuối câu để hỏi lại. Tiếng Anh dùng **tag question** khớp với động từ chính: *you like coffee, **don't you**?* Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_past_perfect_missing',
    en: "Vietnamese often uses **đã** or **trước đó** to mark past. English uses **had + past participle** when one past action happened before another. *When she called, I already ate* → *When she called, I **had** already eaten*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay dùng **đã** hoặc **trước đó**. Tiếng Anh dùng **had + V3** khi một việc xảy ra trước một việc khác trong quá khứ. *When she called, I already ate* → *… I **had** already eaten*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_reported_speech',
    en: "Vietnamese often keeps the original tense or uses **nói rằng**. English **backshifts** the tense after a past reporting verb. *She said she **is** tired* → *She said she **was** tired*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay giữ nguyên thì hoặc dùng **nói rằng**. Tiếng Anh phải **lùi thì** sau động từ tường thuật ở quá khứ. *She said she **was** tired*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_since_vs_for',
    en: "Vietnamese **từ** covers both a starting point and a length of time. English splits them: **since** + point in time, **for** + length of time. Swap **{USER_WORD}** → **{FIX_WORD}**. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **từ** cho cả mốc thời gian lẫn khoảng thời gian. Tiếng Anh tách rõ: **since** + mốc, **for** + độ dài. Đổi **{USER_WORD}** → **{FIX_WORD}**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_countable_much',
    en: "Vietnamese **nhiều** works with everything. English **much** is only for uncountable nouns; use **many** or **a lot of** for countable plurals. *much books* → *many books*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **nhiều** với mọi danh từ. Tiếng Anh **much** chỉ đi với danh từ không đếm được; danh từ đếm được dùng **many** hoặc **a lot of**. *much books* → *many books*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_some_vs_any',
    en: "Vietnamese **một số / chút** works in both positive and negative sentences. English has a clearer rule: **some** in positives, **any** in negatives and questions. *I don't have **some** money* → *I don't have **any** money*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **một số / chút** cho cả khẳng định lẫn phủ định. Tiếng Anh có quy tắc rõ: **some** trong khẳng định, **any** trong phủ định và câu hỏi. *I don't have **some** money* → *I don't have **any** money*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_reflexive_missing',
    en: "Vietnamese often omits the reflexive. English needs **myself / yourself / himself …** when the subject acts on itself. *I hurt me* → *I hurt **myself***. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay bỏ qua. Tiếng Anh cần **myself / yourself / himself …** khi chủ ngữ và tân ngữ là một. *I hurt me* → *I hurt **myself***. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_conditional_mix',
    en: "Vietnamese conditionals are flexible. English has strict forms — never use **will** inside the **if**-clause. *If I **will** have time* → *If I **have** time, I will come*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng câu điều kiện linh hoạt. Tiếng Anh có quy tắc rõ: **không** dùng **will** trong mệnh đề **if**. *If I **will** have time* → *If I **have** time*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_to_infinitive_after_ing',
    en: "Some English verbs are followed by **to + infinitive** (*decide to go*, *want to learn*). Vietnamese uses a simpler structure. *I want **going*** → *I want **to go***. Try: *{FIX}*.",
    vi: "Một số động từ tiếng Anh theo sau bởi **to + động từ nguyên mẫu** (*decide to go*, *want to learn*). Tiếng Việt mình dùng cấu trúc đơn giản hơn. *I want **going*** → *I want **to go***. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_passive_missing_be',
    en: "Vietnamese passive uses **bị / được**. English passive always needs **be + past participle**. *This house built in 1990* → *This house **was built** in 1990*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay dùng **bị / được**. Tiếng Anh thể bị động luôn cần **be + V3**. *This house built in 1990* → *This house **was built** in 1990*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_relative_pronoun',
    en: "Vietnamese uses one word **mà** for both. English splits: **who** for people, **which / that** for things. *The man **which** came* → *The man **who** came*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình nối ý bằng một từ **mà** cho cả người lẫn vật. Tiếng Anh phân biệt: **who** cho người, **which / that** cho vật. *The man **which** came* → *The man **who** came*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_used_to_vs_be_used_to',
    en: "Vietnamese **thường** covers both 'past habit' and 'accustomed to'. English separates them: **used to + bare verb** = past habit; **be used to + -ing / noun** = accustomed. *I am used to smoke* → *I **used to** smoke*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **thường** cho cả 'thói quen cũ' và 'đã quen với'. Tiếng Anh tách rõ: **used to + V** (thói quen quá khứ) và **be used to + V-ing / danh từ** (đã quen). *I am used to smoke* → *I **used to** smoke*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_another_vs_other',
    en: "Vietnamese **khác** is used broadly. English: **another** = one more (singular), **other** = the rest / additional. *I need **other** pen* → *I need **another** pen*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **khác** khá linh hoạt. Tiếng Anh phân biệt: **another** (một cái nữa, số ít), **other** (còn lại / khác). *I need **other** pen* → *I need **another** pen*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_look_vs_see_vs_watch',
    en: "Vietnamese **nhìn** covers many situations. English has three different verbs: **look at** (direct attention), **see** (perceive), **watch** (follow movement). Here **{WRONG}** → **{RIGHT}**. Try: *{FIX}*.",
    vi: "Tiếng Việt mình dùng **nhìn** cho nhiều tình huống. Tiếng Anh có ba động từ riêng biệt: **look at** (hướng mắt tới), **see** (trông thấy), **watch** (theo dõi chuyển động). Chỗ này **{WRONG}** → **{RIGHT}**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_by_vs_with',
    en: "Vietnamese **bằng** works for both. English splits: **by** = method / agent (*by car*, *written **by** Chau*), **with** = tool / accompaniment (*written **with** a pen*). *{WRONG}* → *{RIGHT}*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay dùng **bằng** cho cả hai. Tiếng Anh phân biệt rõ: **by** (phương tiện / tác nhân), **with** (công cụ / đi cùng). *{WRONG}* → *{RIGHT}*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_time_expressions',
    en: "Vietnamese time expressions are simpler. English picks the preposition by category: **in** the morning, **on** Monday, **at** 7 o'clock. *{USER_PREP}* → *{FIX_PREP}*. Try: *{FIX}*.",
    vi: "Tiếng Việt mình đơn giản hơn. Tiếng Anh có quy tắc rõ: **in** buổi sáng, **on** thứ Hai, **at** 7 giờ. *{USER_PREP}* → *{FIX_PREP}*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_present_perfect_vs_past',
    en: "When you point to a specific past time — **yesterday**, **last week**, **in 1990** — English uses simple past, not present perfect. *I have eaten it yesterday* → *I ate it yesterday*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Dùng quá khứ đơn với mốc thời gian cụ thể. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_subjunctive_were',
    en: "After **if** or **wish**, use **were** for every subject when you're imagining something not real. *If I was you* → *If I **were** you*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Sau **if / wish** ở tình huống giả định, dùng **were** cho mọi chủ ngữ. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_embedded_question_order',
    en: "Once a question sits inside another sentence, English drops the question word order. *I don't know what **is this*** → *I don't know what **this is***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Câu hỏi lồng trong câu khác không giữ trật tự câu hỏi. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_do_support_3ps',
    en: "After **he**, **she**, or **it**, the helper is **doesn't** — not **don't**. The **-s** already lives on the helper, so the main verb stays bare. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Với **he / she / it** phải dùng **doesn't**, không phải **don't**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_subject_relative_omit',
    en: "English can't drop the **subject** relative pronoun. *The man came yesterday is my uncle* → *The man **who** came yesterday is my uncle*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Không thể bỏ đại từ quan hệ làm chủ ngữ. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_gerund_after_verb',
    en: "After **enjoy / avoid / finish / keep / mind / suggest / practise**, English wants **-ing**, not **to + V**. *I enjoy **to swim*** → *I enjoy **swimming***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Sau enjoy/avoid/finish/keep/mind, dùng V-ing thay vì to V. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_modal_perfect',
    en: "To talk about the past with a modal, English uses **modal + have + past participle** — not modal + past verb. *I should **did** it* → *I should **have done** it*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Modal quá khứ dùng **modal + have + V3**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_phrasal_pronoun_order',
    en: "When the object of a separable phrasal verb is a pronoun, it goes **between** the verb and the particle. *I picked up **him*** → *I picked **him** up*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Với phrasal verb tách được, đại từ chen vào giữa. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_comparative_more_long',
    en: "Two-or-more-syllable adjectives take **more** — not an **-er** ending. *more beautifuler* / *beautifuler* → **more beautiful**. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Tính từ dài 2+ âm tiết dùng **more**, không thêm **-er**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_many_with_uncount',
    en: "Use **much** (not **many**) with uncountable nouns — **water**, **money**, **advice**, **music**. *many water* → **much water**. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Dùng **much** với danh từ không đếm được. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_geographical_article',
    en: "Most country names take **no article**, but a few plural-sounding ones do — **the Philippines**, **the USA**, **the Netherlands**. *the Vietnam* → *Vietnam*; *Philippines* → *the Philippines*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Hầu hết tên quốc gia không có **the**; vài nước ngoại lệ (the Philippines, the USA...). Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_generic_plural',
    en: "To talk about something in general, English uses the **plural** without **the**. *I like dog* → *I like **dogs***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Nói khái quát trong tiếng Anh dùng số nhiều không **the**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_double_negative',
    en: "English uses only **one** negative in a clause. *I don't have **no** money* → *I don't have **any** money*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Tiếng Anh chỉ dùng một phủ định trong một mệnh đề. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_negative_inversion',
    en: "When a negative word like **never**, **seldom**, **rarely** starts the sentence, English flips the subject and auxiliary. *Never I have seen it* → *Never **have I** seen it*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Khi câu mở đầu bằng **never / seldom / rarely**, đảo chủ ngữ và trợ động từ. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_adverb_before_subject',
    en: "Frequency adverbs like **always**, **usually**, **sometimes** go **after** the subject, not before it. *Always I go* → *I **always** go*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Trạng từ tần suất đi sau chủ ngữ, không đứng trước. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_make_let_bare',
    // NOTE FOR CC4: the causative "had + obj + bare verb" (e.g., "I had
    // my friend drive me") is rarer than make/let in the wild. Keep the
    // VN explanation focused on make / made / let. Per CC7 peer review.
    en: "After **make**, **let**, or **have** in this meaning, English uses the **bare verb** — no **to**. *She made me **to cry*** → *She made me **cry***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Sau **make / let / have** (sai khiến), dùng động từ nguyên mẫu không **to**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_too_vs_very',
    en: "**Too** means excessive (there's a problem). For a simple strong intensifier, use **very**. *I am **too** happy to see you* → *I am **very** happy to see you*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] **Too** nghĩa là quá mức (tiêu cực). Muốn nhấn mạnh tích cực, dùng **very**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_a_vs_an_vowel',
    en: "Use **a** before a consonant **sound**, **an** before a vowel **sound** — listen, don't just look. *a apple* → *an apple*; *an book* → *a book*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Dùng **a** trước phụ âm, **an** trước nguyên âm — theo âm thanh, không phải chữ. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_one_of_the_singular',
    en: "After **one of the / my / her / their**, the noun is **plural** even though the whole phrase refers to one item. *one of the student* → *one of the **students***. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Sau **one of the / my / ...** dùng danh từ số nhiều. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_each_singular',
    en: "**Each** and **every** always take a **singular** noun and a **singular** verb. *Each **students are** happy* → *Each **student is** happy*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] **Each / every** đi với danh từ số ít và động từ số ít. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_been_vs_gone',
    en: "**Gone to** = went there and hasn't come back. **Been to** = visited, came back. *He has **gone** to Paris three times* → *He has **been** to Paris three times*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] **gone to** = đi chưa về; **been to** = đã từng ghé qua. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_tag_polarity',
    en: "Tag questions flip polarity: positive statement + negative tag, negative statement + positive tag. *You like it, **do you***? → *You like it, **don't you***? Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Câu hỏi đuôi đảo dấu: mệnh đề khẳng định + đuôi phủ định (và ngược lại). Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_no_article_generic',
    en: "Abstract nouns and generic plurals usually take **no** article in English. *The life is hard* → *Life is hard*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Danh từ trừu tượng nói chung không dùng **the**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_superlative_the',
    en: "Superlatives (**best**, **tallest**, **most beautiful**) almost always come with **the**. *She is best student* → *She is **the best** student*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Trước cấp cao nhất gần như luôn dùng **the**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_if_will',
    en: "In a 1st-conditional **if**-clause, English uses **present simple** — not **will**. *If I **will go** tomorrow, I will tell you* → *If I **go** tomorrow, I will tell you*. Try: *{FIX}*.",
    vi: "[VI TBD — CC4] Mệnh đề **if** (điều kiện loại 1) dùng hiện tại đơn, không dùng **will**. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_no_aux_negation',
    en: "English negates verbs with **do/does/did + not** (or the contractions **don't / doesn't / didn't**), not by placing **no** or **not** straight on the verb. *I **no** want coffee* → *I **don't** want coffee*; *He **not** come yesterday* → *He **didn't** come yesterday*. Try: *{FIX}*.",
    vi: "Tiếng Việt phủ định bằng cách thêm 'không' trước động từ — gọn và đứng độc lập. Tiếng Anh cần trợ động từ **do / does / did** đi cùng **not** (hoặc dạng rút gọn **don't / doesn't / didn't**) — không thể đặt 'no' hay 'not' trực tiếp trước động từ thường. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_co_transfer',
    en: "Vietnamese **có** maps to several English structures — not just **has**. For \"a place contains X,\" use **There is / There are**: *In my house **has** three bedrooms* → ***There are** three bedrooms in my house*. For \"X is qualified Y,\" use **is / are**: *My city **has** very beautiful* → *My city **is** very beautiful*. Try: *{FIX}*.",
    vi: "Tiếng Việt 'có' đa năng. Khi nói nơi nào có gì, tiếng Anh dùng **There is / There are** — không phải 'has'. *In my house has three bedrooms* → ***There are** three bedrooms in my house*. Khi mô tả tính chất, dùng **is / are** — không phải 'has'. *My city has very beautiful* → *My city **is** very beautiful*. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_topic_comment_fronting',
    en: "Vietnamese fronts the topic with a comma (*My family, they live in Hue* / *This job, I don't like it*). English usually rewrites to plain subject-verb-object — drop the comma and the resumptive pronoun. Try: *{FIX}*.",
    vi: "Tiếng Việt mình hay đẩy chủ đề lên đầu câu, ngắt phẩy rồi nhắc lại bằng đại từ (*My family, they live in Hue* / *This job, I don't like it*). Tiếng Anh viết thẳng theo **chủ ngữ + động từ + tân ngữ**, bỏ phẩy và đại từ nhắc lại. Thử: *{FIX}*.",
  },
  {
    tag: 'vi_l1_future_adverb_bare',
    en: "When you talk about the future with **tomorrow**, **next week**, **soon**, or **in 2 hours**, English needs **will** before the verb. Vietnamese just adds the time word — *Mai tôi đi* — and the verb stays the same. Try: *{FIX}*.",
    vi: "Khi nói về tương lai với **tomorrow**, **next week**, **soon**, hay **in 2 hours**, tiếng Anh cần **will** trước động từ. Tiếng Việt mình chỉ cần thêm từ chỉ thời gian — *Mai tôi đi* — động từ không đổi. Thử: *{FIX}*.",
  },
];
