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

import type { L1WeaknessTag } from "./l1-error-detector";

export type L1VnExplanation = {
  /** Short, natural Vietnamese rule name. */
  name_vi: string;
  /** 2–4 sentences of teacher-voice Vietnamese. ≤ 300 characters. */
  explanation_vi: string;
  /** Word-for-word gloss showing the speaker's VN→EN transfer. */
  example_wrong_vi_gloss: string;
  /** Flip to true when the VN grammar claim needs Chau's verification. */
  needs_review: boolean;
};

/** Mobile-display budget. Enforced by a test in __tests__/. */
export const L1_VN_EXPLANATION_MAX_CHARS = 300;

export const L1_VN_EXPLANATIONS: Partial<Record<L1WeaknessTag, L1VnExplanation>> = {
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
