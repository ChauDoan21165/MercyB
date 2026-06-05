/**
 * Family-Bridge explainers — Vietnamese grammar families, A1–A2 pilot batch.
 *
 * PILOT — 10 of the 65 `vi_l1_*` tags. Scoped to the A1–A2 "parent-market
 * core": the highest-recognition foundational errors a Vietnamese adult
 * learner makes in English. Voice locked by Chau (2026-06-05).
 *
 * Voice rules (LOCKED 2026-06-05 — this batch is the template for all others):
 *  - Address the learner as `bạn` (adult learner) in EVERY field — never `con`.
 *  - `howToHelpVi` is learner-facing; the supporting family member is referred
 *    to in the third person as `người thân`. Keep the "repeat as agreement,
 *    not correction" support technique.
 *  - "tiếng Việt mình" phrasing kept; shame-free, identity-affirming framing.
 *
 * Status: VOICE LOCKED by Chau (2026-06-05). All 10 entries are
 * `validated: true` / `reviewStatus: "approved"` and render in the parent
 * view. Remaining grammar batches are authored in THIS voice at
 * validated:false until Chau signs each batch off.
 *
 * CEFR note: accepted as a heuristic (no authoritative per-tag CEFR table in
 * the repo — `taxonomy.ts` carries severity, not CEFR). Uncertain bands are
 * flagged in `reviewNote`.
 *
 * Anchor: each `tag` is an `L1WeaknessTag` from
 * `src/lib/feedback/l1-error-detector.ts`.
 */

import type { FamilyBridgeExplanation } from "./types.js";

export const VI_GRAMMAR_FAMILY_BRIDGE: FamilyBridgeExplanation[] = [
  {
    tag: "vi_l1_3rd_person_s",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "Quên thêm “-s” sau he / she / it",
    patternLabelEn: "Third-person -s",
    parentSummaryVi:
      "Bạn đang làm quen với việc thêm “-s” vào động từ khi nói về anh ấy, cô ấy, nó — một thói quen mà tiếng Việt mình không có.",
    whyVi:
      "Tiếng Việt mình không đổi động từ theo chủ ngữ: “anh ấy đi”, “cô ấy đi”, “tôi đi” — chữ “đi” giữ nguyên. Vì vậy khi nói tiếng Anh, bạn hay quên rằng he / she / it cần thêm “-s” vào động từ (she go → she goes). Đây gần như là điều ai học tiếng Anh từ tiếng Việt cũng gặp, không phải do bạn kém hay thiếu cố gắng — chỉ là phản xạ chưa kịp hình thành.",
    howToHelpVi:
      "Bạn không cần ép mình nói đúng từng chữ. Khi trò chuyện với người thân, hãy nhờ họ nhắc lại câu của bạn một cách tự nhiên như đang đồng tình — “Yes, she goes to school!” — chứ không phải chỉ ra lỗi. Cách nghe lại nhẹ nhàng này giúp “-s” dần thành phản xạ.",
    encouragementVi:
      "Quên “-s” không có nghĩa là bạn dở tiếng Anh — nghĩa là bạn đang dịch rất nhanh từ tiếng Việt sang. Chỉ cần luyện thêm ít lần là nó thành phản xạ tự nhiên.",
    example: {
      learnerSays: "My sister go to school every day.",
      naturalForm: "My sister goes to school every day.",
      glossVi:
        "“Chị tôi + đi + tới trường mỗi ngày” — bạn dịch thẳng từ tiếng Việt nên quên “-s” ở “go”.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_past_ed",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "Quên thêm “-ed” cho động từ ở quá khứ",
    patternLabelEn: "Past tense -ed",
    parentSummaryVi:
      "Bạn đang tập thêm “-ed” vào động từ khi kể chuyện đã xảy ra — tiếng Việt mình chỉ cần nói “hôm qua” là đủ.",
    whyVi:
      "Tiếng Việt mình báo hiệu quá khứ bằng “đã” hoặc bằng từ chỉ thời gian như “hôm qua”, “năm ngoái” — còn động từ thì giữ nguyên: “hôm qua tôi làm”. Tiếng Anh lại phải đổi chính động từ: work → worked. Nên bạn hay nói “Yesterday I work”, vì với cách nghĩ tiếng Việt, “yesterday” đã đủ rồi. Đây là một trong những lỗi phổ biến nhất, gần như ai cũng đi qua giai đoạn này.",
    howToHelpVi:
      "Khi kể với người thân hôm nay bạn đi đâu, làm gì bằng tiếng Anh, hãy nhờ họ lắng nghe và hỏi thêm thay vì bắt lỗi. Nếu muốn nhắc, họ chỉ cần nói lại câu của bạn một cách tự nhiên — “Oh, you played football yesterday?” — và bạn sẽ tự nghe thấy chữ “-ed”.",
    encouragementVi:
      "Việc bạn dám kể chuyện quá khứ bằng tiếng Anh đã là một bước lớn. Chữ “-ed” chỉ là một thói quen nhỏ, luyện ít lâu là thành quen.",
    example: {
      learnerSays: "Yesterday I watch a movie.",
      naturalForm: "Yesterday I watched a movie.",
      glossVi:
        "“Hôm qua + tôi + xem phim” — bạn thấy “hôm qua” là đủ nên để “watch” nguyên dạng.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_plural_s",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "Quên thêm “-s” cho danh từ số nhiều",
    patternLabelEn: "Plural -s",
    parentSummaryVi:
      "Bạn đang quen với việc thêm “-s” vào danh từ khi có nhiều — tiếng Việt mình để con số làm việc đó.",
    whyVi:
      "Tiếng Việt mình nói “hai quyển sách” — đã có số “hai” thì danh từ “sách” không đổi. Tiếng Anh lại thêm “-s” vào chính danh từ: “two books”. Vì vậy bạn hay nói “two book”, vì trong đầu, số “two” đã nói lên là nhiều rồi. Cách nghĩ này rất hợp lý — chỉ là tiếng Anh làm thêm một bước nữa thôi.",
    howToHelpVi:
      "Bạn có thể biến việc đếm thành thói quen vui khi ở cùng người thân — đếm đồ vật quanh nhà bằng tiếng Anh: “one apple, two apples”. Nếu nói thiếu “-s”, hãy nhờ người thân nhắc lại nhẹ nhàng dạng đầy đủ thay vì sửa. Nghe nhiều lần, “-s” sẽ tự xuất hiện.",
    encouragementVi:
      "Quên “-s” không làm câu của bạn khó hiểu — người nghe vẫn hiểu ngay. Đây là chi tiết nhỏ sẽ tự hoàn thiện khi bạn nghe và đọc nhiều hơn.",
    example: {
      learnerSays: "I have two book.",
      naturalForm: "I have two books.",
      glossVi:
        "“Tôi có hai quyển sách” — số “hai” đã đủ với tiếng Việt nên bạn để “book” nguyên.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_missing_be",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "Quên động từ “to be” (am / is / are)",
    patternLabelEn: "Missing be-verb",
    parentSummaryVi:
      "Bạn đang học thêm “is / am / are” vào câu — tiếng Việt mình nói “tôi mệt” là đủ, không cần từ nối.",
    whyVi:
      "Tiếng Việt mình ghép thẳng chủ ngữ với tính từ: “tôi mệt”, “cô ấy đẹp” — không cần từ nối. Tiếng Anh thì cần một động từ “to be” ở giữa: “I am tired”, “She is beautiful”. Nên bạn hay nói “She happy”, vì theo tiếng Việt thế là đủ ý. Đây là điều gần như người Việt nào mới học cũng gặp.",
    howToHelpVi:
      "Khi luyện cùng người thân, nếu bạn nói “She happy”, hãy nhờ họ mỉm cười nhắc lại đầy đủ “Yes, she is happy!” như đang đồng tình với bạn, chứ không phải đang sửa. Nghe lại nhiều lần, bạn sẽ tự thêm “is” vào.",
    encouragementVi:
      "Bạn đã diễn đạt đúng ý rồi, chỉ thiếu một chữ nối nhỏ. Khi nghe tiếng Anh nhiều hơn, chữ “is / am / are” sẽ tự bật ra.",
    example: {
      learnerSays: "My mother very kind.",
      naturalForm: "My mother is very kind.",
      glossVi: "“Mẹ tôi rất tốt bụng” — tiếng Việt nối thẳng nên bạn quên “is”.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_question_no_aux",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "Câu hỏi cần trợ động từ “do / does / did”",
    patternLabelEn: "Questions need do/does/did",
    parentSummaryVi:
      "Bạn đang học cách mở đầu câu hỏi bằng “do / does / did” — tiếng Việt mình chỉ thêm “không” cuối câu.",
    whyVi:
      "Tiếng Việt mình tạo câu hỏi rất gọn: thêm “không” ở cuối — “Bạn thích cà phê không?”. Tiếng Anh lại phải đưa một trợ động từ “do / does / did” lên đầu câu: “Do you like coffee?”. Nên bạn hay hỏi “You like coffee?”, vì theo tiếng Việt thế đã là câu hỏi rồi. Cách nói này vẫn hiểu được, chỉ chưa đúng kiểu Anh thôi.",
    howToHelpVi:
      "Khi chơi hỏi–đáp với người thân bằng tiếng Anh, hãy cùng nhau bắt đầu mọi câu hỏi bằng “Do you…?” cho thành quen: “Do you like…?”, “Do you want…?”. Biến nó thành trò chơi, bạn sẽ nhớ rất nhanh.",
    encouragementVi:
      "Bạn dám hỏi bằng tiếng Anh là điều đáng khen nhất. Cấu trúc “do / does / did” chỉ cần lặp vài lần là thành phản xạ.",
    example: {
      learnerSays: "You like coffee?",
      naturalForm: "Do you like coffee?",
      glossVi:
        "“Bạn thích cà phê không?” — bạn bỏ “không” cuối câu nhưng chưa thêm “Do” đầu câu.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_missing_article",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Quên mạo từ “a / an / the” trước danh từ",
    patternLabelEn: "Missing article (a/an/the)",
    parentSummaryVi:
      "Bạn đang làm quen với “a / an / the” trước danh từ — tiếng Việt mình hoàn toàn không có những từ này.",
    whyVi:
      "Tiếng Việt mình không có mạo từ: “tôi mua sách” là đủ. Tiếng Anh thì gần như danh từ nào cũng cần “a”, “an” hoặc “the” đứng trước: “I bought a book”. Vì trong tiếng Việt không có khái niệm này, bạn rất dễ bỏ quên — đây là dấu hiệu rõ nhất của người Việt học tiếng Anh, và ai cũng mất một thời gian mới quen.",
    howToHelpVi:
      "Đây là phần cần thời gian, đừng ép mình. Cách tốt nhất là đọc truyện hoặc nghe truyện tiếng Anh — bạn sẽ “ngấm” dần khi nào dùng “a”, khi nào dùng “the”. Khi luyện với người thân, hãy nhờ họ nhắc lại câu đầy đủ một cách tự nhiên thay vì sửa lỗi.",
    encouragementVi:
      "Mạo từ là một trong những thứ khó nhất với người Việt, nên bạn chưa thạo là hoàn toàn bình thường — kể cả người giỏi tiếng Anh cũng từng vất vả với nó. Cứ đọc và nghe đều, bạn sẽ tiến bộ.",
    example: {
      learnerSays: "I want to be teacher.",
      naturalForm: "I want to be a teacher.",
      glossVi:
        "“Tôi muốn làm giáo viên” — tiếng Việt không có chỗ cho “a” nên bạn bỏ trống.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_can_no_infinitive",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "Sau “can” dùng động từ nguyên mẫu, không có “to”",
    patternLabelEn: "Bare verb after 'can'",
    parentSummaryVi:
      "Bạn đang học rằng sau “can” thì động từ để nguyên — “I can swim”, không phải “I can to swim”.",
    whyVi:
      "Khi mới học, bạn biết rằng nhiều khi tiếng Anh cần “to” trước động từ (như “want to go”), nên bạn áp dụng luôn cho “can”: “I can to swim”. Thật ra sau “can / could / will / should” thì động từ giữ nguyên dạng gốc, không thêm “to”. Đây là lỗi của một người đang học rất chăm — bạn đang cố áp dụng quy tắc, chỉ là quy tắc này có ngoại lệ.",
    howToHelpVi:
      "Một câu thần chú vui khi luyện cùng người thân: “can + làm gì luôn”, không có “to”. “I can swim”, “I can cook”, “I can run”. Nói vài lần thành nhịp là bạn nhớ.",
    encouragementVi:
      "Việc bạn tự thêm “to” cho thấy bạn đang tư duy theo quy tắc — đó là cách học rất tốt. Chỉ cần nhớ thêm một ngoại lệ nhỏ là xong.",
    example: {
      learnerSays: "She can to drive.",
      naturalForm: "She can drive.",
      glossVi:
        "Bạn đem thói quen “to + động từ” đặt sau “can”, nhưng ở đây không cần “to”.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_to_verb_confusion",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Sau một số động từ cần “to” trước động từ tiếp theo",
    patternLabelEn: "Missing 'to' before verb",
    parentSummaryVi:
      "Bạn đang học rằng sau “want, need, try, hope” cần “to” — “I want to eat”, không phải “I want eat”.",
    whyVi:
      "Tiếng Việt mình nói liền một mạch: “tôi muốn ăn” — “muốn” và “ăn” đứng cạnh nhau. Tiếng Anh lại chèn thêm “to” vào giữa: “I want to eat”. Nên bạn hay nói “I want eat”, vì theo tiếng Việt thế là tự nhiên. Cách nói này dễ hiểu, chỉ thiếu một chữ nối nhỏ.",
    howToHelpVi:
      "Khi bạn nói “I want eat”, hãy nhờ người thân vui vẻ nhắc lại trọn câu “Ah, you want to eat!”. Nghe đủ nhiều, bạn sẽ tự thêm “to” — không cần dừng lại giảng giải giữa chừng.",
    encouragementVi:
      "Đây là chi tiết nhỏ trong một câu vốn đã đúng ý. Bạn càng nói nhiều, chữ “to” sẽ càng tự nhiên.",
    example: {
      learnerSays: "I want eat now.",
      naturalForm: "I want to eat now.",
      glossVi: "“Tôi muốn ăn bây giờ” — tiếng Việt nói liền nên bạn bỏ “to”.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_adjective_order",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "Tính từ đứng trước danh từ trong tiếng Anh",
    patternLabelEn: "Adjective before noun",
    parentSummaryVi:
      "Bạn đang học đảo thứ tự: tiếng Anh nói “red car”, còn tiếng Việt mình nói “xe đỏ”.",
    whyVi:
      "Tiếng Việt mình đặt tính từ sau danh từ: “xe đỏ”, “áo mới”. Tiếng Anh thì ngược lại, tính từ đứng trước: “red car”, “new shirt”. Nên bạn hay nói “car red”, vì bạn đang sắp xếp theo trật tự tiếng Việt. Đây là một thói quen rất tự nhiên khi mình suy nghĩ bằng tiếng mẹ đẻ.",
    howToHelpVi:
      "Một trò vui khi ở cùng người thân: chỉ vào đồ vật quanh nhà và gọi tên bằng tiếng Anh theo kiểu “màu trước, vật sau” — “red apple”, “big dog”, “new book”. Lặp lại vài lần là bạn quen thứ tự mới.",
    encouragementVi:
      "Bạn dùng đúng cả tính từ lẫn danh từ, chỉ là thứ tự khác. Khi nghe tiếng Anh nhiều, tai bạn sẽ tự thấy “red car” nghe “xuôi” hơn.",
    example: {
      learnerSays: "I have a car red.",
      naturalForm: "I have a red car.",
      glossVi:
        "“Tôi có một chiếc xe đỏ” — bạn giữ thứ tự “danh từ + tính từ” của tiếng Việt.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_no_aux_negation",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Câu phủ định cần “don’t / doesn’t / didn’t”",
    patternLabelEn: "Negation needs do-support",
    parentSummaryVi:
      "Bạn đang học rằng để nói “không” trong tiếng Anh cần “don’t / doesn’t” — không đặt “no” thẳng trước động từ.",
    whyVi:
      "Tiếng Việt mình phủ định rất gọn: thêm “không” trước động từ — “tôi không thích”. Tiếng Anh lại cần trợ động từ “do/does/did” đi cùng “not”: “I don’t like”. Nên bạn hay nói “I no like” hoặc “He not come”, vì bạn dịch thẳng chữ “không” của tiếng Việt. Ý của bạn hoàn toàn rõ, chỉ là tiếng Anh cần thêm một bước.",
    howToHelpVi:
      "Bạn có thể tập một mẫu quen thuộc: “I don’t…”, “I don’t like…”, “I don’t want…”. Khi bạn nói “I no like”, hãy nhờ người thân nhắc lại nhẹ nhàng “You don’t like it?”. Bạn sẽ dần quen với “don’t”.",
    encouragementVi:
      "Bạn đang diễn đạt được cả ý phủ định bằng tiếng Anh — điều đó rất đáng khen. Cấu trúc “don’t / doesn’t” chỉ cần luyện ít lần là vào.",
    example: {
      learnerSays: "I no like fish.",
      naturalForm: "I don't like fish.",
      glossVi:
        "“Tôi không thích cá” — bạn dịch thẳng “không” thành “no”, chưa dùng “don’t”.",
    },
    validated: true,
    reviewStatus: "approved",
    version: "0.1.0",
  },
];

export default VI_GRAMMAR_FAMILY_BRIDGE;
