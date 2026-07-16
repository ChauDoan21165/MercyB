/**
 * Vietnamese teacher-voice explanations for every L1 rule.
 *
 * Additive — this file does NOT touch detection logic, the rule engine's
 * public API, or the inline bilingual `RULE_STRINGS` feedback used at
 * answer time. The fields here are consumed by longer-form UIs (rule
 * detail views, micro-lessons, admin dashboards) that need more space
 * than the short-answer bubble affords.
 *
 * Shape per tag (all 4 fields are required):
 *   - name_vi                    — rule name in Vietnamese, short, natural.
 *   - explanation_vi             — 2–4 sentences. Written Vietnamese-first
 *                                   (not translated from English). Tied to
 *                                   Vietnamese grammar patterns. Shame-free.
 *                                   Must fit ≤ 300 chars for mobile bubbles.
 *   - example_wrong_vi_gloss     — word-for-word gloss of the wrong English
 *                                   sentence showing the speaker's mental
 *                                   process (native-VN structure → direct
 *                                   transfer into English).
 *   - needs_review               — true when the VN grammar claim inside
 *                                   the explanation should be verified by
 *                                   Chau before shipping to production.
 *
 * Voice contract (from Round 5 CC4 brief):
 *   - Warm, patient, favorite-cô-giáo tone.
 *   - "Đây là lỗi rất phổ biến với người Việt" framing — never "this is
 *     wrong". Shame-free.
 *   - Everyday vocabulary, not academic linguistic jargon.
 *   - Hanoi-standard for written form; Saigon words only when natural.
 *   - No political content, no regional prejudice, no English jargon
 *     dropped into Vietnamese text.
 *
 * Current coverage: 35 rules (v1.0 + v1.1 + v1.2). The 25 Round 5
 * additions will land on top once CC3's rule IDs are published on
 * `shared/l1-rule-ids-round5` — see reports/cc4-vn-coverage.md for the
 * handoff plan.
 */

import type { L1WeaknessTag } from "./l1-error-detector.js";

export type L1VnExplanation = {
  /** Short, natural Vietnamese rule name. */
  name_vi: string;
  /** 2–4 sentences of teacher-voice Vietnamese. ≤ 300 characters. */
  explanation_vi: string;
  /** Word-for-word gloss showing the speaker's VN→EN transfer. */
  example_wrong_vi_gloss: string;
  /** Flip to true when the VN grammar claim needs Chau's verification. */
  needs_review: boolean;
  /**
   * Optional region-aware sentence prepended by the UI when the user's
   * detected dialect (see `dialect-detection.ts`) matches the rule's
   * dialect bias. Existing entries leave this undefined; only
   * dialect-specific rules in VN_DIALECT_EXPLANATIONS set it.
   */
  dialect_note?: string;
};

/** Mobile-display budget. Enforced by a test in __tests__/. */
export const L1_VN_EXPLANATION_MAX_CHARS = 300;

export const L1_VN_EXPLANATIONS: Record<L1WeaknessTag, L1VnExplanation> = {
  // ── v1.0 core structural ───────────────────────────────────────────────
  vi_l1_3rd_person_s: {
    name_vi: "Quên thêm -s sau he / she / it",
    explanation_vi:
      "Tiếng Việt mình không chia động từ theo chủ ngữ — 'anh ấy đi', 'cô ấy đi', 'chúng tôi đi' đều giữ nguyên động từ. Tiếng Anh thêm **-s** khi chủ ngữ là **he / she / it** ở thì hiện tại. Mẹo nhớ đơn giản: he/she/it → động từ thêm -s.",
    example_wrong_vi_gloss:
      "She go to school → 'Cô ấy + đi + tới trường' (mình dịch thẳng từ tiếng Việt, quên -s)",
    needs_review: false,
  },
  vi_l1_past_ed: {
    name_vi: "Quên thêm -ed cho động từ quá khứ",
    explanation_vi:
      "Trong tiếng Việt, thì quá khứ được báo hiệu bằng 'đã' hoặc trạng ngữ như 'hôm qua', 'năm ngoái' — động từ giữ nguyên. Tiếng Anh phải thêm **-ed** vào chính động từ. Nếu câu nói về quá khứ, đừng quên biến đổi: work → worked, play → played.",
    example_wrong_vi_gloss:
      "Yesterday I work → 'Hôm qua + tôi + làm việc' (mình thấy 'hôm qua' là đủ, quên đổi work → worked)",
    needs_review: false,
  },
  vi_l1_plural_s: {
    name_vi: "Quên thêm -s cho danh từ số nhiều",
    explanation_vi:
      "Tiếng Việt mình nói 'hai quyển sách' — con số đã làm nhiệm vụ, danh từ không đổi. Tiếng Anh phải thêm **-s** vào chính danh từ: book → books. Kể cả khi đã có 'two', 'many', 'some', danh từ số nhiều vẫn phải mang -s.",
    example_wrong_vi_gloss:
      "I have two book → 'Tôi có + hai + quyển sách' (đã có 'hai' rồi, mình thấy không cần thêm gì nữa)",
    needs_review: false,
  },
  vi_l1_missing_be: {
    name_vi: "Thiếu động từ 'to be' trước tính từ",
    explanation_vi:
      "Tiếng Việt nói 'tôi mệt', 'anh ấy vui' là đủ — chủ ngữ ghép thẳng với tính từ, không cần động từ nối. Tiếng Anh cần **am / is / are** ở giữa: I am tired, he is happy. Công thức: chủ ngữ + be + tính từ.",
    example_wrong_vi_gloss:
      "I tired → 'Tôi + mệt' (mình nói như tiếng Việt, quên chèn 'am')",
    needs_review: false,
  },
  vi_l1_question_no_aux: {
    name_vi: "Câu hỏi thiếu 'do / does / did'",
    explanation_vi:
      "Tiếng Việt mình thêm 'không?' hoặc 'à?' ở cuối câu là thành câu hỏi — trật tự từ không đổi. Tiếng Anh phải đưa trợ động từ **do / does / did** lên đầu, trước chủ ngữ. You like coffee? → Do you like coffee?",
    example_wrong_vi_gloss:
      "You like coffee? → 'Bạn + thích + cà phê + không?' (mình chỉ thêm dấu hỏi, quên 'do')",
    needs_review: false,
  },
  vi_l1_missing_article: {
    name_vi: "Thiếu mạo từ a / an / the",
    explanation_vi:
      "Tiếng Việt không có mạo từ — danh từ đứng một mình là xong. Tiếng Anh hầu như luôn cần **a / an** (một cái bất kỳ) hoặc **the** (cái cụ thể) trước danh từ đếm được số ít. I have dog → I have a dog.",
    example_wrong_vi_gloss:
      "I have dog → 'Tôi có + chó' (tiếng Việt không có mạo từ, mình dịch thẳng)",
    needs_review: false,
  },
  vi_l1_possessive_gender: {
    name_vi: "Nhầm his / her theo giới tính",
    explanation_vi:
      "Tiếng Việt dùng 'của anh ấy' cho nam, 'của cô ấy' cho nữ — cấu trúc giống nhau, chỉ đổi 'anh/cô'. Tiếng Anh đổi chính từ sở hữu: **his** cho nam, **her** cho nữ. Quy tắc: nam → his, nữ → her.",
    example_wrong_vi_gloss:
      "She loves his mother → 'Cô ấy + yêu + mẹ + của cô ấy' (chủ ngữ là nữ, nên phải là 'her mother' chứ không phải 'his mother')",
    needs_review: false,
  },
  vi_l1_preposition_transfer: {
    name_vi: "Dùng sai giới từ theo lối tiếng Việt",
    explanation_vi:
      "Mỗi giới từ tiếng Anh có cách dùng riêng, không dịch một-đối-một từ tiếng Việt. Từ 'ở' có thể là **in**, **on**, hoặc **at** tùy ngữ cảnh: at school (tại trường), in Vietnam (ở Việt Nam), on the table (trên bàn).",
    example_wrong_vi_gloss:
      "I live in number 12 street → 'Tôi sống + ở + số 12 đường' (dịch 'ở' thành 'in'; địa chỉ phố phải là 'on')",
    needs_review: false,
  },
  vi_l1_countable: {
    name_vi: "Danh từ không đếm được (advice, information...)",
    explanation_vi:
      "Tiếng Việt đếm mọi thứ được — 'một lời khuyên', 'hai thông tin'. Tiếng Anh có những danh từ **không đếm**: advice, information, furniture, news, water. Không dùng **a / an**, không thêm **-s**. Muốn đếm thì nói 'a piece of advice'.",
    example_wrong_vi_gloss:
      "She gave me two advices → 'Cô ấy cho tôi + hai + lời khuyên' (tiếng Việt đếm được, tiếng Anh thì không)",
    needs_review: false,
  },

  // ── v1.1 structural + word-order + collocation ────────────────────────
  vi_l1_to_verb_confusion: {
    name_vi: "Thiếu 'to' giữa hai động từ",
    explanation_vi:
      "Sau **want / need / try / hope / decide**, tiếng Anh cần **to** trước động từ tiếp theo. Tiếng Việt mình nói 'tôi muốn đi' một mạch, không cần từ nối. I want go → I want to go. Nhớ: want/need/try/hope + to + động từ.",
    example_wrong_vi_gloss:
      "I want go home → 'Tôi + muốn + đi + về nhà' (mình ghép thẳng hai động từ như tiếng Việt)",
    needs_review: false,
  },
  vi_l1_can_no_infinitive: {
    name_vi: "Sau can / will / should phải là động từ nguyên mẫu",
    explanation_vi:
      "Sau trợ động từ **can / could / will / would / should / must**, động từ chính giữ ở **dạng gốc** — không -s, không -ed, không -ing. Tiếng Việt mình cũng không đổi động từ, nên để trợ động từ gánh hết nghĩa. She can sings → She can sing.",
    example_wrong_vi_gloss:
      "She can sings well → 'Cô ấy + có thể + hát + giỏi' (tự động thêm -s vì chủ ngữ là 'she', quên quy tắc modal)",
    needs_review: false,
  },
  vi_l1_double_past: {
    name_vi: "Đánh dấu quá khứ hai lần",
    explanation_vi:
      "Tiếng Anh chỉ đánh dấu quá khứ **một lần**. Khi đã có **did / didn't**, động từ chính phải về dạng gốc. I didn't went → I didn't go. 'Did' đã gánh quá khứ, phần còn lại giữ nguyên mẫu.",
    example_wrong_vi_gloss:
      "I didn't went → 'Tôi + đã không + đi (quá khứ)' (mình nhấn quá khứ hai lần: cả 'did' lẫn 'went')",
    needs_review: false,
  },
  vi_l1_possessive_s_missing: {
    name_vi: "Quên 's để chỉ sở hữu",
    explanation_vi:
      "Tiếng Việt nói 'cái xe của anh Nam' — chữ 'của' làm rõ sở hữu, danh từ không đổi. Tiếng Anh thêm **'s** vào người/vật sở hữu: Nam's car, my friend's house. Công thức: người sở hữu + 's + vật được sở hữu.",
    example_wrong_vi_gloss:
      "This is Nam car → 'Đây là + Nam + xe' (mình bỏ 'của' và quên luôn 's)",
    needs_review: false,
  },
  vi_l1_comparative_double: {
    name_vi: "Dùng 'more' và '-er' cùng lúc",
    explanation_vi:
      "So sánh hơn trong tiếng Anh chỉ dùng **một** trong hai: hoặc **-er** (tính từ ngắn: taller, faster) hoặc **more** (tính từ dài: more beautiful). Không dùng cả hai. More taller → taller. Tiếng Việt mình chỉ cần 'hơn'.",
    example_wrong_vi_gloss:
      "He is more taller → 'Anh ấy + hơn + cao hơn' (mình cảm giác cần nhấn 'hơn' hai lần cho rõ)",
    needs_review: true,
  },
  vi_l1_adjective_order: {
    name_vi: "Sai thứ tự tính từ đứng trước danh từ",
    explanation_vi:
      "Tiếng Việt đặt tính từ **sau** danh từ: 'cái áo đỏ đẹp'. Tiếng Anh đặt tính từ **trước** danh từ và có thứ tự cố định — cỡ → tuổi → màu → chất liệu → danh từ. A red beautiful shirt → a beautiful red shirt.",
    example_wrong_vi_gloss:
      "A red beautiful shirt → 'Một + áo + đỏ + đẹp' (mình dịch theo thứ tự tiếng Việt: danh từ rồi đến màu)",
    needs_review: false,
  },
  vi_l1_very_much_placement: {
    name_vi: "Đặt sai vị trí 'very' và 'much'",
    explanation_vi:
      "Tiếng Việt 'rất' đứng **trước** tính từ: 'rất đẹp'. Tiếng Anh **very** cũng đứng trước tính từ (very beautiful), nhưng **much** lại đứng **sau** động từ: I like it very much. Đừng nói 'I very like' — phải là 'I like it very much'.",
    example_wrong_vi_gloss:
      "I very like coffee → 'Tôi + rất + thích + cà phê' (mình dịch 'rất' thành 'very' và đặt trước động từ)",
    needs_review: false,
  },
  vi_l1_there_are_singular: {
    name_vi: "Chia sai 'there is / there are'",
    explanation_vi:
      "Tiếng Việt nói 'có một người', 'có ba người' đều dùng chung một từ 'có'. Tiếng Anh chia theo số lượng: một → **there is**, nhiều hơn một → **there are**. There is three people → there are three people.",
    example_wrong_vi_gloss:
      "There is three people → 'Có + ba + người' (mình quen dùng 'có' cho cả số ít và số nhiều)",
    needs_review: false,
  },
  vi_l1_everyone_plural: {
    name_vi: "'Everyone / everybody' luôn là số ít",
    explanation_vi:
      "Tiếng Việt 'mọi người' nghe là số nhiều — 'mọi người đều đi'. Nhưng trong tiếng Anh, **everyone / everybody / everything** lại là **số ít**: everyone is here, chứ không phải 'are'. Ngược với trực giác tiếng Việt, nhưng quen dần sẽ nhớ.",
    example_wrong_vi_gloss:
      "Everyone are here → 'Mọi người + đều + ở đây' (cảm giác là số nhiều nên mình chọn 'are')",
    needs_review: false,
  },
  vi_l1_make_vs_do: {
    name_vi: "Nhầm 'make' và 'do'",
    explanation_vi:
      "Tiếng Việt chỉ có một từ 'làm' bao quát nhiều nghĩa. Tiếng Anh tách ra: **make** là tạo ra cái mới (make a cake, make a decision); **do** là thực hiện một việc (do homework, do the dishes). Phải nhớ theo cụm, không dịch trực tiếp.",
    example_wrong_vi_gloss:
      "I did a cake → 'Tôi + làm + một cái + bánh' (một chữ 'làm' trong tiếng Việt → mình chọn nhầm 'did')",
    needs_review: false,
  },
  vi_l1_tag_question: {
    name_vi: "Câu hỏi đuôi (tag question)",
    explanation_vi:
      "Tiếng Việt thêm 'phải không?' hoặc 'đúng không?' — một hình thức cho mọi câu. Tiếng Anh đổi đuôi theo thì và chủ ngữ: He's tired, isn't he?; She likes it, doesn't she? Câu khẳng định → đuôi phủ định; câu phủ định → đuôi khẳng định.",
    example_wrong_vi_gloss:
      "You are tired, no? → 'Bạn + mệt + đúng không?' (mình dịch 'đúng không' trực tiếp thành 'no')",
    needs_review: false,
  },

  // ── v1.2 harder / less-common patterns ────────────────────────────────
  vi_l1_past_perfect_missing: {
    name_vi: "Thiếu quá khứ hoàn thành (had + V3)",
    explanation_vi:
      "Khi một việc xảy ra **trước** một việc khác trong quá khứ, tiếng Anh dùng **had + V3**: When I arrived, she had left. Tiếng Việt mình chỉ cần 'đã' hoặc trạng ngữ. Hai việc quá khứ có thứ tự trước-sau → việc trước dùng had + V3.",
    example_wrong_vi_gloss:
      "When I arrived, she left → 'Khi + tôi đến + cô ấy + đi rồi' (dùng past simple cho cả hai, mất thứ tự)",
    needs_review: false,
  },
  vi_l1_reported_speech: {
    name_vi: "Lùi thì trong câu gián tiếp",
    explanation_vi:
      "Khi kể lại lời ai đó, tiếng Anh **lùi thì** một bậc: 'I am happy' → He said he was happy. Tiếng Việt chỉ cần thêm 'rằng / là', động từ không đổi. Nhớ: said/told ở quá khứ → động từ phía sau cũng lùi về quá khứ.",
    example_wrong_vi_gloss:
      "He said he is tired → 'Anh ấy + nói + rằng + anh ấy + mệt' (tiếng Việt không lùi thì; tiếng Anh phải đổi 'is' → 'was')",
    needs_review: false,
  },
  vi_l1_since_vs_for: {
    name_vi: "Nhầm 'since' và 'for'",
    explanation_vi:
      "Tiếng Việt 'từ' và 'trong' đôi khi dùng thay nhau. Tiếng Anh tách rõ: **since** + mốc thời gian (since 2020, since Monday); **for** + khoảng thời gian (for 3 years, for two hours). Mốc điểm → since; khoảng dài → for.",
    example_wrong_vi_gloss:
      "I've lived here for 2020 → 'Tôi + sống ở đây + từ + 2020' ('từ 2020' là mốc điểm → đúng là 'since 2020')",
    needs_review: false,
  },
  vi_l1_countable_much: {
    name_vi: "Dùng 'much' với danh từ đếm được",
    explanation_vi:
      "Tiếng Việt 'nhiều' đi với mọi thứ — 'nhiều sách', 'nhiều nước'. Tiếng Anh tách: **many** + danh từ đếm được (many books); **much** + danh từ không đếm được (much water). Đếm được → many; không đếm được → much.",
    example_wrong_vi_gloss:
      "I have much books → 'Tôi có + nhiều + sách' (mình dịch 'nhiều' thành 'much'; 'books' đếm được → phải 'many')",
    needs_review: false,
  },
  vi_l1_some_vs_any: {
    name_vi: "Nhầm 'some' và 'any'",
    explanation_vi:
      "Tiếng Việt 'một ít / vài' dùng cho mọi loại câu. Tiếng Anh tách: **some** cho câu khẳng định (I have some money); **any** cho câu phủ định và nghi vấn (I don't have any money; Do you have any?). Khẳng định → some; phủ định / hỏi → any.",
    example_wrong_vi_gloss:
      "I don't have some money → 'Tôi không có + một ít + tiền' (câu phủ định → phải là 'any')",
    needs_review: false,
  },
  vi_l1_reflexive_missing: {
    name_vi: "Thiếu đại từ phản thân (myself, yourself...)",
    explanation_vi:
      "Với động từ phản thân như **enjoy, hurt, teach**, tiếng Anh cần đại từ phản thân **myself / yourself / himself...** khi chủ ngữ và tân ngữ là cùng một người. Tiếng Việt chỉ cần 'tự' hoặc không cần gì: 'tôi tự học' → I teach myself.",
    example_wrong_vi_gloss:
      "I enjoy at the party → 'Tôi + vui vẻ + ở bữa tiệc' (mình quên 'myself': I enjoy myself at the party)",
    needs_review: false,
  },
  vi_l1_conditional_mix: {
    name_vi: "Nhầm thì trong câu điều kiện",
    explanation_vi:
      "Câu điều kiện loại 2 tiếng Anh có cấu trúc cố định: If + past simple, would + V (If I had money, I would buy it). Tiếng Việt mình nói 'nếu có tiền thì tôi mua' — động từ không đổi. Vế 'if' → quá khứ, vế kia → would.",
    example_wrong_vi_gloss:
      "If I have money, I will buy → 'Nếu + tôi có tiền + tôi sẽ mua' (dịch 'nếu có' thành 'if I have' thay vì 'if I had')",
    needs_review: false,
  },
  vi_l1_to_infinitive_after_ing: {
    name_vi: "Sau một số động từ phải dùng -ing, không dùng 'to'",
    explanation_vi:
      "Sau **enjoy, finish, avoid, keep, mind, suggest**, tiếng Anh cần **V-ing** chứ không phải 'to + V': I enjoy swimming. Tiếng Việt chỉ có một cách nối động từ, nên người Việt hay mặc định chọn 'to'. Nhớ nhóm -ing này như một danh sách cần học thuộc.",
    example_wrong_vi_gloss:
      "I enjoy to swim → 'Tôi + thích + bơi' (mình quen thấy 'to', nhưng 'enjoy' thuộc nhóm phải dùng V-ing)",
    needs_review: true,
  },
  vi_l1_passive_missing_be: {
    name_vi: "Thiếu 'be' trong câu bị động",
    explanation_vi:
      "Câu bị động tiếng Anh cần **be + V3**: The book was written by her. Tiếng Việt mình chỉ cần 'được / bị' trước động từ là đủ. Bỏ quên 'be' là lỗi rất phổ biến. Công thức: chủ ngữ + be (am/is/are/was/were) + past participle.",
    example_wrong_vi_gloss:
      "The book written by her → 'Cuốn sách + được viết + bởi cô ấy' (dịch 'được viết' → 'written', quên luôn 'was')",
    needs_review: false,
  },
  vi_l1_relative_pronoun: {
    name_vi: "Chọn sai đại từ quan hệ (who / which / that)",
    explanation_vi:
      "Tiếng Việt dùng 'mà' cho mọi đối tượng — người hay vật đều như nhau. Tiếng Anh tách: **who** cho người, **which** cho vật, **that** dùng được cho cả hai nhưng không thay thế trong mệnh đề có dấu phẩy. The man which came → the man who came.",
    example_wrong_vi_gloss:
      "The man which came → 'Người đàn ông + mà + đến' (tiếng Việt 'mà' dùng chung; tiếng Anh đổi theo đối tượng: người → who)",
    needs_review: false,
  },
  vi_l1_used_to_vs_be_used_to: {
    name_vi: "Nhầm 'used to' và 'be used to'",
    explanation_vi:
      "Hai cụm trông giống nhau nhưng khác hẳn: **used to + V** = thói quen trong quá khứ không còn (I used to smoke); **be used to + V-ing/N** = đã quen với, hiện tại vẫn đúng (I'm used to waking up early). Có 'be' → đang quen; không 'be' → xưa kia từng.",
    example_wrong_vi_gloss:
      "I used to waking up early → Muốn nói 'đã quen dậy sớm' nhưng thiếu 'be': đúng là 'I'm used to waking up early'",
    needs_review: true,
  },
  vi_l1_another_vs_other: {
    name_vi: "Nhầm 'another' và 'other'",
    explanation_vi:
      "Tiếng Việt 'khác' dùng cho mọi trường hợp. Tiếng Anh tách: **another** + danh từ số ít (another book = một cuốn khác); **other** + danh từ số nhiều hoặc không đếm được (other books, other information). Số ít → another; số nhiều → other.",
    example_wrong_vi_gloss:
      "I want other book → 'Tôi muốn + khác + quyển sách' (danh từ số ít → phải dùng 'another book')",
    needs_review: false,
  },
  vi_l1_look_vs_see_vs_watch: {
    name_vi: "Nhầm 'look / see / watch'",
    explanation_vi:
      "Tiếng Việt 'xem / nhìn' dùng chung. Tiếng Anh tách ba: **see** = thấy (không chủ động); **look (at)** = chủ động nhìn vào cái gì trong chốc lát; **watch** = xem trong thời gian dài (watch TV, watch a movie). Look TV → watch TV.",
    example_wrong_vi_gloss:
      "I like to look TV → 'Tôi thích + xem + TV' (dịch 'xem' thành 'look'; xem TV phải là 'watch')",
    needs_review: false,
  },
  vi_l1_by_vs_with: {
    name_vi: "Nhầm 'by' và 'with'",
    explanation_vi:
      "Tiếng Việt 'bằng' dùng chung cho phương tiện và công cụ. Tiếng Anh tách: **by** cho phương tiện di chuyển (by bus, by car); **with** cho công cụ dùng tay (cut with a knife, write with a pen). Di chuyển → by; cầm tay → with.",
    example_wrong_vi_gloss:
      "I cut the bread by a knife → 'Tôi cắt bánh mì + bằng + dao' (một chữ 'bằng' → dịch nhầm 'by' thay vì 'with')",
    needs_review: false,
  },
  vi_l1_time_expressions: {
    name_vi: "Giới từ thời gian (in / on / at)",
    explanation_vi:
      "Tiếng Việt 'vào / lúc' dùng chung cho mọi thời điểm. Tiếng Anh có quy tắc rõ: **at** cho giờ (at 6pm); **on** cho ngày (on Monday, on July 5th); **in** cho tháng / năm / thế kỷ (in May, in 2024). Giờ → at; ngày → on; khoảng dài → in.",
    example_wrong_vi_gloss:
      "I'll see you in Monday → 'Tôi sẽ gặp bạn + vào + thứ Hai' (ngày cụ thể → phải là 'on Monday', không phải 'in')",
    needs_review: false,
  },

  // ── Round 5 — CC3's 25-rule expansion (L1-036..L1-060) ──────────────────
  vi_l1_present_perfect_vs_past: {
    name_vi: "Có 'yesterday' / 'last week' phải dùng quá khứ đơn",
    explanation_vi:
      "Tiếng Việt mình chỉ có một cách báo quá khứ — chữ 'đã' hoặc trạng ngữ thời gian. Tiếng Anh tách rõ: trong câu có mốc cụ thể như **yesterday**, **last week**, **in 1990**, phải dùng **quá khứ đơn**, không dùng **have + V3**. Mốc cụ thể → past simple.",
    example_wrong_vi_gloss:
      "I have eaten it yesterday → 'Tôi + đã ăn + nó + hôm qua' (thấy 'đã' nên chọn 'have eaten'; có 'yesterday' rồi thì phải là 'I ate it yesterday')",
    needs_review: false,
  },
  vi_l1_subjunctive_were: {
    name_vi: "If / wish giả định dùng 'were' cho mọi chủ ngữ",
    explanation_vi:
      "Tiếng Việt mình nói 'Nếu tôi là bạn' — không phân biệt thật hay giả định. Tiếng Anh có quy tắc đặc biệt: sau **if** hoặc **wish** ở tình huống không có thật, dùng **were** cho **tất cả** chủ ngữ — kể cả I, he, she, it. *If I **were** you*.",
    example_wrong_vi_gloss:
      "If I was you → 'Nếu + tôi + là + bạn' (mình quen 'I was' ở quá khứ; câu giả định phải dùng 'were' bất kể chủ ngữ là gì)",
    needs_review: false,
  },
  vi_l1_embedded_question_order: {
    name_vi: "Câu hỏi lồng trong câu — bỏ trật tự câu hỏi",
    explanation_vi:
      "Tiếng Việt mình nói 'Tôi không biết cái này là gì' — trật tự không đổi dù câu hỏi hay câu lồng. Tiếng Anh khi đưa câu hỏi vào trong câu khác, đổi về trật tự câu kể: **chủ ngữ trước, động từ sau**. *what is this* → *what this is*.",
    example_wrong_vi_gloss:
      "I don't know what is this → 'Tôi không biết + cái gì là + cái này' (giữ nguyên 'what is this' của câu hỏi gốc; phải đổi thành 'what this is')",
    needs_review: false,
  },
  vi_l1_do_support_3ps: {
    name_vi: "He / she / it dùng 'doesn't', không phải 'don't'",
    explanation_vi:
      "Tiếng Việt mình không chia động từ — 'cô ấy không biết', 'tôi không biết' giống nhau. Tiếng Anh hiện tại đơn, sau **he / she / it** phải dùng **doesn't**, không phải **don't**. **-s** đã ở 'doesn't' rồi, nên động từ chính giữ nguyên dạng gốc.",
    example_wrong_vi_gloss:
      "She don't know → 'Cô ấy + không + biết' (dịch 'không' thành 'don't' cho mọi chủ ngữ; với 'she' phải đổi thành 'doesn't know')",
    needs_review: false,
  },
  vi_l1_subject_relative_omit: {
    name_vi: "Không bỏ được đại từ quan hệ làm chủ ngữ",
    explanation_vi:
      "Tiếng Việt mình hay bỏ 'mà' khi nghe vẫn rõ: 'người đàn ông đến hôm qua'. Tiếng Anh khi đại từ quan hệ làm **chủ ngữ** của mệnh đề (who / which / that) thì **không bỏ được**. *The man came* → *The man **who** came*. Đại từ quan hệ làm tân ngữ thì mới bỏ được.",
    example_wrong_vi_gloss:
      "The man came yesterday is my uncle → 'Người đàn ông + đến + hôm qua + là + chú tôi' (bỏ 'mà' như tiếng Việt; tiếng Anh phải có 'who came')",
    needs_review: false,
  },
  vi_l1_gerund_after_verb: {
    name_vi: "Sau enjoy / avoid / finish dùng V-ing, không 'to V'",
    explanation_vi:
      "Tiếng Việt mình chỉ có một cách nối hai động từ — 'thích bơi', 'tránh đi'. Tiếng Anh sau **enjoy / avoid / finish / keep / mind / suggest / practise** phải dùng **V-ing**, không dùng **to + V**. *I enjoy **swimming***. Đây là nhóm cần học thuộc — không suy ra theo công thức được.",
    example_wrong_vi_gloss:
      "I enjoy to swim → 'Tôi + thích + bơi' (quen công thức 'verb + to + V' từ 'want to'; 'enjoy' lại thuộc nhóm cần V-ing)",
    needs_review: false,
  },
  vi_l1_modal_perfect: {
    name_vi: "Modal nói về quá khứ: should/could/would + have + V3",
    explanation_vi:
      "Tiếng Việt mình nói 'đáng lẽ tôi đã làm' — ghép thẳng modal với động từ quá khứ. Tiếng Anh phải dùng cấu trúc **modal + have + V3** để nói về quá khứ: *should have done*, *could have gone*, *would have known*. Sau modal vẫn là 'have' nguyên mẫu, không phải 'had'.",
    example_wrong_vi_gloss:
      "I should did it → 'Tôi + đáng lẽ + đã làm + nó' (ghép 'should' với 'did' vì cả hai mang ý quá khứ; đúng là 'should have done it')",
    needs_review: false,
  },
  vi_l1_phrasal_pronoun_order: {
    name_vi: "Phrasal verb tách được: đại từ chen vào giữa",
    explanation_vi:
      "Tiếng Việt mình nói 'đón anh ấy', 'gọi cô ấy' — động từ liền tân ngữ. Tiếng Anh có **phrasal verb tách được** (pick up, call back, turn off): khi tân ngữ là **đại từ** (him / her / it / them), phải chen vào **giữa** động từ và phụ từ. *I picked **him** up*.",
    example_wrong_vi_gloss:
      "I picked up him → 'Tôi + đón + anh ấy' (giữ 'pick up' liền nhau như cụm; tiếng Anh phải tách ra: 'pick him up')",
    needs_review: false,
  },
  vi_l1_comparative_more_long: {
    name_vi: "Tính từ 2+ âm tiết dùng 'more', không thêm '-er'",
    explanation_vi:
      "Tiếng Việt mình dùng 'hơn' cho tất cả: 'đẹp hơn', 'thông minh hơn'. Tiếng Anh chia hai loại: tính từ ngắn (1 âm tiết) thêm **-er** (taller, faster); tính từ dài (2+ âm tiết) dùng **more** (more beautiful, more intelligent). Không thêm **-er** vào tính từ dài.",
    example_wrong_vi_gloss:
      "She is beautifuler → 'Cô ấy + đẹp + hơn' (thấy 'beautiful' rồi thêm '-er' theo công thức ngắn; 'beautiful' dài → phải là 'more beautiful')",
    needs_review: false,
  },
  vi_l1_many_with_uncount: {
    name_vi: "Danh từ không đếm được dùng 'much', không 'many'",
    explanation_vi:
      "Tiếng Việt mình nói 'nhiều' cho mọi thứ — 'nhiều sách', 'nhiều nước'. Tiếng Anh tách rõ: **many** đi với danh từ đếm được (many books); **much** đi với danh từ không đếm được (much water, much money, much advice). Đếm được → many; không đếm được → much.",
    example_wrong_vi_gloss:
      "She drinks many water → 'Cô ấy + uống + nhiều + nước' (quen dùng 'nhiều' cho cả 'water'; nước không đếm được → phải là 'much water')",
    needs_review: false,
  },
  vi_l1_geographical_article: {
    name_vi: "Tên quốc gia: hầu hết không có 'the'",
    explanation_vi:
      "Tiếng Việt mình không có mạo từ trước tên nước. Tiếng Anh đa số tên quốc gia cũng **không** có **the** (Vietnam, France, Japan), trừ vài nước nghe như số nhiều hoặc có 'United / Kingdom': **the Philippines**, **the United States**, **the Netherlands**, **the UK**.",
    example_wrong_vi_gloss:
      "I live in the Vietnam → 'Tôi sống + ở + Việt Nam' (học 'the' xong cẩn thận thêm vào tên nước; Vietnam thuộc nhóm không cần 'the')",
    needs_review: false,
  },
  vi_l1_generic_plural: {
    name_vi: "Nói khái quát dùng số nhiều, không 'the'",
    explanation_vi:
      "Tiếng Việt mình nói 'tôi thích chó' — danh từ giữ nguyên. Tiếng Anh khi nói khái quát về cả loài, dùng **danh từ số nhiều, không kèm 'the'**. *I like dogs*, *Cats are clever*. Đừng nói 'I like dog' (chỉ một con) hay 'I like the dog' (con cụ thể).",
    example_wrong_vi_gloss:
      "I like dog → 'Tôi + thích + chó' (dịch trực tiếp; nói khái quát 'chó nói chung' phải là số nhiều: 'dogs')",
    needs_review: false,
  },
  vi_l1_double_negative: {
    name_vi: "Một mệnh đề tiếng Anh chỉ có một phủ định",
    explanation_vi:
      "Tiếng Việt mình hay dùng phủ định kép cho nhấn mạnh: 'tôi không có tiền nào cả'. Tiếng Anh chỉ dùng **một** từ phủ định trong một mệnh đề. Đã có **don't / doesn't / didn't** rồi thì thay 'no' bằng **any**. *I don't have **any** money*, không phải 'no money'.",
    example_wrong_vi_gloss:
      "I don't have no money → 'Tôi + không có + không + tiền' (nhấn 'không' hai lần như tiếng Việt; tiếng Anh chỉ một phủ định: don't + any)",
    needs_review: false,
  },
  vi_l1_negative_inversion: {
    name_vi: "Mở đầu bằng 'never / seldom / rarely' — đảo ngữ",
    explanation_vi:
      "Tiếng Việt mình hay đẩy 'chưa bao giờ', 'hiếm khi' lên đầu câu — chủ ngữ vẫn đứng sau bình thường. Tiếng Anh khi mở đầu câu bằng **never / seldom / rarely / hardly**, phải đảo trợ động từ lên trước chủ ngữ. *Never **have I** seen it*. Đây là cách viết trang trọng.",
    example_wrong_vi_gloss:
      "Never I have seen it → 'Chưa bao giờ + tôi + đã thấy + nó' (giữ chủ ngữ đứng trước trợ động từ như tiếng Việt; phải đảo: 'Never have I seen')",
    needs_review: false,
  },
  vi_l1_adverb_before_subject: {
    name_vi: "Trạng từ tần suất đứng sau chủ ngữ",
    explanation_vi:
      "Tiếng Việt mình đặt 'luôn luôn', 'thường', 'đôi khi' linh hoạt — đầu câu hay giữa câu đều được. Tiếng Anh trong câu thông thường, các trạng từ này đứng **sau chủ ngữ, trước động từ chính**: *I **always** go*, *She **usually** comes late*. Đừng đặt trước chủ ngữ.",
    example_wrong_vi_gloss:
      "Always I go to school early → 'Luôn luôn + tôi + đi học sớm' (đẩy 'luôn luôn' lên đầu như tiếng Việt; tiếng Anh phải là 'I always go')",
    needs_review: false,
  },
  vi_l1_make_let_bare: {
    name_vi: "Sau make / let / have (sai khiến) dùng động từ nguyên mẫu",
    explanation_vi:
      "Tiếng Việt mình nói 'khiến tôi khóc', 'cho tôi đi' — không có từ nối. Tiếng Anh sau **make / let / have** (theo nghĩa sai khiến) cần **động từ nguyên mẫu không 'to'**. *She made me **cry***, không phải *to cry*. Khác với 'want / need / try' phải có 'to'.",
    example_wrong_vi_gloss:
      "She made me to cry → 'Cô ấy + làm + tôi + khóc' (quen công thức 'verb + to + V' từ 'want to'; 'make' thuộc nhóm bare verb)",
    needs_review: false,
  },
  vi_l1_too_vs_very: {
    name_vi: "'Too' là tiêu cực (quá mức), 'very' là tích cực",
    explanation_vi:
      "Tiếng Việt 'quá' dùng được cả nghĩa tích cực ('quá vui') lẫn tiêu cực ('quá nóng, không chịu được'). Tiếng Anh tách: **very** = rất (tích cực, trung tính); **too** = quá mức gây vấn đề. *I am **very** happy* — vui ơi là vui; *I am too happy* nghe lạ vì hàm ý có vấn đề.",
    example_wrong_vi_gloss:
      "I am too happy to see you → 'Tôi + quá + vui + được gặp bạn' (dịch 'quá' thành 'too'; ý chỉ là 'rất vui' → phải dùng 'very happy')",
    needs_review: false,
  },
  vi_l1_a_vs_an_vowel: {
    name_vi: "Nguyên âm dùng 'an', phụ âm dùng 'a' — theo âm đọc",
    explanation_vi:
      "Tiếng Việt mình không có mạo từ. Tiếng Anh dùng **a** trước âm phụ âm, **an** trước âm nguyên âm — nghe theo **âm**, không nhìn theo **chữ**. *an apple*, *an hour* (h câm), *a university* ('y' đọc như 'you'). Quy tắc: tránh hai nguyên âm va vào nhau khi đọc.",
    example_wrong_vi_gloss:
      "I want a apple → 'Tôi muốn + một + quả táo' (mặc định 'a' cho tất cả; 'apple' bắt đầu nguyên âm → phải là 'an apple')",
    needs_review: false,
  },
  vi_l1_one_of_the_singular: {
    name_vi: "Sau 'one of the / my / her' dùng danh từ số nhiều",
    explanation_vi:
      "Tiếng Việt mình nói 'một trong các học sinh' — chữ 'các' đã làm số nhiều. Tiếng Anh sau **one of the / my / her / their** phải có **danh từ số nhiều**, dù cả cụm chỉ một người: *one of the **students***, *one of my **friends***. Cụm chỉ một, danh từ vẫn số nhiều.",
    example_wrong_vi_gloss:
      "She is one of the student → 'Cô ấy là + một + trong + học sinh' (thấy 'một' nên giữ 'student' số ít; sau 'one of the' phải là 'students')",
    needs_review: false,
  },
  vi_l1_each_singular: {
    name_vi: "Sau 'each / every' dùng danh từ và động từ số ít",
    explanation_vi:
      "Tiếng Việt mình nói 'mỗi học sinh đều vui' — 'mỗi' chỉ ra từng người trong nhiều. Tiếng Anh **each / every** đi với **danh từ số ít** và **động từ số ít**: *Each **student is** happy*, *Every **child has** a book*. Dù nói về nhiều người, ngữ pháp vẫn số ít.",
    example_wrong_vi_gloss:
      "Each students are happy → 'Mỗi + các học sinh + đều + vui' (cảm giác 'mỗi' = nhiều người nên dùng 'students are'; phải số ít: 'student is')",
    needs_review: false,
  },
  vi_l1_been_vs_gone: {
    name_vi: "Đã từng ghé qua: 'been to', không phải 'gone to'",
    explanation_vi:
      "Tiếng Việt mình nói 'đã đi Paris' cho cả nghĩa 'từng tới đó' lẫn 'đang trên đường'. Tiếng Anh tách: **been to** = đã từng tới và quay về; **gone to** = đi rồi chưa về. Khi nói số lần ghé qua (*three times*, *before*, *ever*), phải dùng **been to**.",
    example_wrong_vi_gloss:
      "He has gone to Paris three times → 'Anh ấy + đã đi + Paris + ba lần' (dịch 'đã đi' → 'has gone'; nói số lần ghé qua phải là 'has been to')",
    needs_review: false,
  },
  vi_l1_tag_polarity: {
    name_vi: "Câu hỏi đuôi: đảo dấu so với mệnh đề chính",
    explanation_vi:
      "Tiếng Việt mình thêm 'phải không' / 'đúng không' cho mọi câu — không phân biệt khẳng định hay phủ định. Tiếng Anh đuôi câu hỏi phải **đảo dấu**: câu khẳng định + đuôi phủ định (*you like it, **don't you**?*); câu phủ định + đuôi khẳng định (*you don't like it, **do you**?*).",
    example_wrong_vi_gloss:
      "You like it, do you? → 'Bạn + thích + nó + đúng không?' (dịch 'đúng không' thành 'do you'; câu khẳng định phải có đuôi phủ định: 'don't you')",
    needs_review: false,
  },
  vi_l1_no_article_generic: {
    name_vi: "Danh từ trừu tượng nói khái quát không 'the'",
    explanation_vi:
      "Tiếng Việt mình nói 'Cuộc đời thì khó', 'Tình yêu là tuyệt vời' — danh từ đứng trần. Tiếng Anh nói khái quát về **danh từ trừu tượng** (life, love, music, time, money, happiness) cũng **không dùng 'the'**: *Life is hard*, không phải *The life is hard*.",
    example_wrong_vi_gloss:
      "The life is hard → 'Cuộc đời + thì + khó' (học 'the' xong cẩn thận thêm vào; danh từ trừu tượng nói khái quát không cần 'the')",
    needs_review: false,
  },
  vi_l1_superlative_the: {
    name_vi: "Trước cấp cao nhất phải có 'the'",
    explanation_vi:
      "Tiếng Việt mình nói 'học sinh giỏi nhất' — không cần mạo từ. Tiếng Anh trước **cấp cao nhất** (best, tallest, most beautiful) gần như **luôn có 'the'**: *She is **the** best student*, *Mount Everest is **the** highest mountain*. Cấp cao nhất là duy nhất → phải dùng 'the'.",
    example_wrong_vi_gloss:
      "She is best student → 'Cô ấy là + giỏi nhất + học sinh' (dịch trực tiếp; cấp cao nhất 'best' phải có 'the' đứng trước)",
    needs_review: false,
  },
  vi_l1_if_will: {
    name_vi: "Mệnh đề 'if' (điều kiện loại 1) không dùng 'will'",
    explanation_vi:
      "Tiếng Việt mình nói 'Nếu mai tôi đi' hoặc 'Nếu tôi sẽ đi' — đều được. Tiếng Anh trong mệnh đề **if** (điều kiện loại 1) dùng **hiện tại đơn**, không dùng **will** — dù ý nói tương lai. *If I **go** tomorrow, I will tell you*. 'Will' chỉ ở mệnh đề chính.",
    example_wrong_vi_gloss:
      "If I will go tomorrow, I will tell you → 'Nếu + tôi + sẽ đi + ngày mai...' (dịch 'sẽ' thành 'will' cho cả hai mệnh đề; mệnh đề 'if' phải dùng 'go')",
    needs_review: false,
  },
  vi_l1_no_aux_negation: {
    name_vi: "Phủ định 'no / not' phải đi cùng do/does/did",
    explanation_vi:
      "Tiếng Việt phủ định bằng 'không' trước động từ — gọn. Tiếng Anh cần **do / does / did** đi cùng **not** (rút gọn: **don't / doesn't / didn't**) — không đặt 'no' hay 'not' thẳng trước động từ. *I no want* → *I **don't** want*; *He not come* → *He **didn't** come*.",
    example_wrong_vi_gloss:
      "I no want coffee → 'Tôi + không + muốn + cà phê' (dịch 'không' thẳng thành 'no'; tiếng Anh phải có 'don't')",
    needs_review: false,
  },
  vi_l1_subject_gender: {
    name_vi: "Đại từ chủ ngữ he / she phải theo giới tính",
    explanation_vi:
      "Tiếng Việt dùng anh / chị / em / ông / bà theo quan hệ — không buộc theo giới tính. Tiếng Anh **he / she** phải khớp giới tính của danh từ vừa nhắc. *My mother is a teacher. **He** works...* → *...**She** works...*. Mẹ / chị / vợ → **she**; bố / anh / chồng → **he**.",
    example_wrong_vi_gloss:
      "My mother is a teacher. He works at a primary school → 'Mẹ tôi là giáo viên. + Anh ấy / Cô ấy làm việc...' (tiếng Việt dùng một đại từ; tiếng Anh phải chia 'she' cho mẹ)",
    needs_review: false,
  },
  vi_l1_co_transfer: {
    name_vi: "'Có' không phải lúc nào cũng là 'has' — dùng there is/are hoặc is/are",
    explanation_vi:
      "Tiếng Việt 'có' đa năng. Khi nói nơi nào có gì, dùng **There is / There are** — không phải 'has'. *In my house has three bedrooms* → *There are three bedrooms in my house*. Khi mô tả tính chất, dùng **is / are** — không phải 'has'. *My city has very beautiful* → *My city **is** very beautiful*.",
    example_wrong_vi_gloss:
      "In my house has three bedrooms → 'Trong nhà tôi + có + ba phòng ngủ' (dịch 'có' thẳng thành 'has'; tiếng Anh phải mở đầu bằng 'There are')",
    needs_review: false,
  },
  vi_l1_topic_comment_fronting: {
    name_vi: "Đảo chủ đề lên trước câu (topic-comment)",
    explanation_vi:
      "Tiếng Việt hay nói 'Gia đình tôi, họ sống ở Huế' hoặc 'Việc này, tôi không thích nó' — đặt chủ đề lên đầu, ngắt phẩy, rồi nhắc lại bằng đại từ. Tiếng Anh viết thẳng theo **chủ ngữ + động từ + tân ngữ**, bỏ phẩy và đại từ nhắc lại: *My family lives in Hue*.",
    example_wrong_vi_gloss:
      "My family, they live in Hue → 'Gia đình tôi, họ sống ở Huế' (mình giữ nguyên cấu trúc tiếng Việt; tiếng Anh đổi thành 'My family lives in Hue')",
    needs_review: false,
  },
  vi_l1_future_adverb_bare: {
    name_vi: "Quên 'will' khi nói về tương lai",
    explanation_vi:
      "Tiếng Việt mình nói 'Mai tôi đi' hay 'Tuần sau tôi bắt đầu' — chỉ cần trạng ngữ chỉ thời gian là đủ, động từ giữ nguyên. Tiếng Anh phải thêm **will** trước động từ chính: *Tomorrow I **will** go*. Nhớ: có 'tomorrow / next week / soon / in 2 hours' → cần 'will'.",
    example_wrong_vi_gloss:
      "Tomorrow I go → 'Ngày mai + tôi + đi' (mình thấy 'tomorrow' là đủ, quên 'will' trước 'go')",
    needs_review: false,
  },
  vi_l1_profession_article_copula: {
    name_vi: "Nghề nghiệp cần be và a/an",
    explanation_vi:
      "Tiếng Việt nói 'ba tôi bác sĩ' rất tự nhiên. Tiếng Anh khi nói nghề nghiệp thường cần **be** và **a/an**: *My father is a doctor*. Đừng bỏ một trong hai phần này.",
    example_wrong_vi_gloss:
      "My father doctor → 'Ba tôi + bác sĩ' (dịch thẳng từ tiếng Việt; tiếng Anh cần 'is a doctor')",
    needs_review: false,
  },
  vi_l1_progressive_be_drop: {
    name_vi: "Thiếu be trong thì tiếp diễn",
    explanation_vi:
      "Tiếng Việt có thể nói 'tôi đang đi' mà không chia trợ động từ. Tiếng Anh dùng **be + V-ing**: *I am going*, *she is cooking*. Có V-ing thì kiểm tra am/is/are.",
    example_wrong_vi_gloss:
      "I going to school → 'Tôi + đang đi học' (mình quên 'am' trước going)",
    needs_review: false,
  },
  vi_l1_definite_article_remention: {
    name_vi: "Nhắc lại vật đã nói cần the",
    explanation_vi:
      "Sau khi đã nhắc một vật/người, tiếng Anh thường dùng **the** ở lần nhắc sau vì người nghe biết mình nói cái nào. Tiếng Việt không có mạo từ nên rất dễ bỏ phần này.",
    example_wrong_vi_gloss:
      "I read a book. Book is interesting → 'Tôi đọc một cuốn sách. Sách hay' (lần hai cần 'the book')",
    needs_review: false,
  },
  vi_l1_noun_preposition_collocation: {
    name_vi: "Cụm danh từ đi với giới từ cố định",
    explanation_vi:
      "Một số cụm học thuật trong tiếng Anh phải đi với giới từ cố định, như **reason for** hoặc **demand for**. Không thể dịch từng chữ từ tiếng Việt sang 'of/about' tùy ý.",
    example_wrong_vi_gloss:
      "reason of this problem → 'lý do của vấn đề này' (tiếng Anh tự nhiên là 'reason for')",
    needs_review: false,
  },
  vi_l1_say_tell_argument_frame: {
    name_vi: "Say / tell / talk có khung tân ngữ khác nhau",
    explanation_vi:
      "Tiếng Việt dùng 'nói với / kể cho' khá linh hoạt. Tiếng Anh tách rõ: **tell someone**, **say to someone**, **talk to someone**. Chọn sai khung sẽ nghe rất lạ.",
    example_wrong_vi_gloss:
      "She said me the truth → 'Cô ấy nói tôi sự thật' (tiếng Anh cần 'told me')",
    needs_review: false,
  },
  vi_l1_learn_study_transfer: {
    name_vi: "Học có thể là learn, study hoặc practice",
    explanation_vi:
      "Tiếng Việt dùng **học** cho nhiều nghĩa. Tiếng Anh chọn theo ngữ cảnh: **study** ở trường/tài liệu, **learn** để tiếp thu, **practice** để luyện kỹ năng.",
    example_wrong_vi_gloss:
      "I study how to cook → 'Tôi học cách nấu ăn' (ngữ cảnh này tự nhiên hơn là 'learn')",
    needs_review: false,
  },
  vi_l1_know_meet_timeline: {
    name_vi: "Gặp lần đầu dùng met, không dùng knew",
    explanation_vi:
      "Tiếng Việt có thể nói 'biết anh ấy hôm qua' theo nghĩa mới gặp. Tiếng Anh dùng **met** cho lần gặp đầu; **knew** nghĩa là đã quen/biết từ trước.",
    example_wrong_vi_gloss:
      "I knew him yesterday → 'Tôi biết anh ấy hôm qua' (ý là gặp lần đầu nên dùng 'met')",
    needs_review: false,
  },
  vi_l1_verb_noun_collocation: {
    name_vi: "Medicine đi với take",
    explanation_vi:
      "Tiếng Việt nói uống/ăn thuốc tùy thói quen nói. Tiếng Anh dùng cụm cố định **take medicine**. Không nói *eat medicine* hay *drink medicine*.",
    example_wrong_vi_gloss:
      "I eat medicine → 'Tôi ăn/uống thuốc' (tiếng Anh tự nhiên là 'take medicine')",
    needs_review: false,
  },
  vi_l1_appliance_open_close_transfer: {
    name_vi: "Thiết bị điện dùng turn on/off",
    explanation_vi:
      "Tiếng Việt hay nói mở/tắt đèn, mở TV. Tiếng Anh với đèn, TV, quạt, máy lạnh dùng **turn on / turn off**, không dùng open/close.",
    example_wrong_vi_gloss:
      "Open the light → 'Mở đèn' (tiếng Anh là 'turn on the light')",
    needs_review: false,
  },
  vi_l1_connector_stacking: {
    name_vi: "Không dùng cặp because-so / although-but",
    explanation_vi:
      "Tiếng Việt dùng cặp liên từ khá tự nhiên: vì... nên..., mặc dù... nhưng.... Tiếng Anh thường chọn một: **because** không đi với **so**, **although** không đi với **but**.",
    example_wrong_vi_gloss:
      "Because it rained, so I stayed home → 'Vì trời mưa nên tôi ở nhà' (tiếng Anh bỏ 'so')",
    needs_review: false,
  },
  vi_l1_elliptical_subject_transfer: {
    name_vi: "Mệnh đề tiếng Anh cần chủ ngữ rõ",
    explanation_vi:
      "Tiếng Việt có thể lược chủ ngữ khi ai cũng hiểu. Tiếng Anh trong mệnh đề hữu hạn thường cần chủ ngữ rõ: *Because I was busy*, *When he arrived*.",
    example_wrong_vi_gloss:
      "Because busy, I didn't go → 'Vì bận nên tôi không đi' (tiếng Anh cần 'I was busy')",
    needs_review: false,
  },
  vi_l1_modal_overinflection: {
    name_vi: "Trợ động từ không thêm -s",
    explanation_vi:
      "Tiếng Anh không chia **can / should / will** theo ngôi. Dù chủ ngữ là he/she/it, trợ động từ vẫn giữ nguyên, rồi động từ chính cũng ở dạng gốc.",
    example_wrong_vi_gloss:
      "He cans speak English → 'Anh ấy có thể nói tiếng Anh' (tiếng Anh dùng 'can', không phải 'cans')",
    needs_review: false,
  },
  vi_l1_phrasal_verb_transfer: {
    name_vi: "Cụm động từ đời thường không dịch từng chữ",
    explanation_vi:
      "Một số nghĩa rất đời thường trong tiếng Anh dùng cụm động từ như **get up**, **put on**, **look after**. Dịch thẳng động từ tiếng Việt dễ nghe cứng hoặc sai nghĩa.",
    example_wrong_vi_gloss:
      "I wake at six → 'Tôi thức lúc sáu giờ' (ngữ cảnh này tự nhiên là 'get up at six')",
    needs_review: false,
  },
  vi_l1_very_verb_calque: {
    name_vi: "Very không đứng ngay trước động từ",
    explanation_vi:
      "Tiếng Việt có thể nói 'rất thích'. Tiếng Anh không nói **very like**; với động từ thường dùng **really like** hoặc **like ... very much**.",
    example_wrong_vi_gloss:
      "I very like this song → 'Tôi rất thích bài này' (tiếng Anh tự nhiên là 'really like')",
    needs_review: false,
  },
  vi_l1_overexplicit_reference: {
    name_vi: "Không lặp tên người ở mọi câu",
    explanation_vi:
      "Tiếng Việt có thể lặp tên/chủ đề để giữ rõ mạch. Tiếng Anh sau lần nhắc đầu thường chuyển sang đại từ **he/she/they** để câu văn mượt hơn.",
    example_wrong_vi_gloss:
      "Lan is my friend. Lan works with me. Lan is kind → lặp 'Lan' quá nhiều; tiếng Anh dùng 'She'",
    needs_review: false,
  },
  vi_l1_time_reference_overmarking: {
    name_vi: "Không lặp mốc thời gian ở từng câu",
    explanation_vi:
      "Khi kể một chuỗi việc cùng mốc thời gian, tiếng Anh thường nêu mốc một lần rồi kể tiếp. Lặp **yesterday/today/tomorrow** ở mọi câu nghe nặng.",
    example_wrong_vi_gloss:
      "Yesterday I went... Yesterday I met... Yesterday I came... → nêu 'yesterday' một lần là đủ",
    needs_review: false,
  },
};

/**
 * Lookup helper. Returns null for tags not yet covered so callers can
 * gracefully fall back to the shorter `RULE_STRINGS` feedback while
 * CC3's 25 new rules land.
 */
export function getL1VnExplanation(
  tag: L1WeaknessTag | string,
): L1VnExplanation | null {
  if (!tag) return null;
  const entry = (L1_VN_EXPLANATIONS as Record<string, L1VnExplanation>)[tag];
  return entry ?? null;
}

/** All covered tags — stable order matches the L1WeaknessTag union. */
export function listCoveredVnTags(): string[] {
  return Object.keys(L1_VN_EXPLANATIONS);
}
