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
 * Status: the first 10 (A1–A2 pilot) are VOICE-LOCKED by Chau (2026-06-05) —
 * `validated:true` / `approved`, rendered in the parent view. Batch 2a (the
 * next 13 A1–A2 tags) is appended below at `validated:false` / `needs_chau`,
 * authored in the SAME locked voice, awaiting Chau's sign-off. B1–C1 batches
 * are HELD pending a CEO scope call.
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

  // ════════════════════════════════════════════════════════════════════
  // BATCH 2a — remaining A1–A2 core (13). validated:false / needs_chau.
  // Same locked voice as the pilot above. Awaiting Chau's sign-off.
  // ════════════════════════════════════════════════════════════════════
  {
    tag: "vi_l1_there_are_singular",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "“There is” đi với số ít, “There are” đi với số nhiều",
    patternLabelEn: "There is / There are agreement",
    parentSummaryVi:
      "Bạn đang học phân biệt “There is” cho một thứ và “There are” cho nhiều thứ — tiếng Việt mình chỉ cần “có” cho cả hai.",
    whyVi:
      "Tiếng Việt mình dùng một chữ “có” cho mọi trường hợp: “có một quyển sách”, “có ba quyển sách” — không đổi gì. Tiếng Anh lại tách ra: “There is a book” (một) và “There are three books” (nhiều). Nên bạn hay nói “There is three books”, vì theo thói quen tiếng Việt, một chữ “có” là đủ. Đây là điều rất nhiều người Việt mình gặp khi mới học.",
    howToHelpVi:
      "Khi luyện cùng người thân, thử trò đếm đồ trong nhà: một thứ thì “There is…”, nhiều thứ thì “There are…”. Nếu bạn nói nhầm, nhờ người thân nhắc lại câu đúng một cách tự nhiên — “Yes, there are three books!” — thay vì sửa lỗi.",
    encouragementVi:
      "Nhầm “is” với “are” không làm sai ý của bạn — người nghe vẫn hiểu ngay có mấy thứ. Chỉ cần nghe quen vài lần là tai bạn tự chọn đúng.",
    example: {
      learnerSays: "There is two cats in the garden.",
      naturalForm: "There are two cats in the garden.",
      glossVi:
        "“Có hai con mèo trong vườn” — tiếng Việt chỉ một chữ “có”, nên bạn để “There is” cho cả số nhiều.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_a_vs_an_vowel",
    source: "grammar_rule",
    cefr: "A1",
    patternNameVi: "Dùng “a” trước phụ âm, “an” trước nguyên âm",
    patternLabelEn: "a vs an",
    parentSummaryVi:
      "Bạn đang học chọn “a” hay “an” theo âm đầu của từ — chi tiết này tiếng Việt mình không có vì mình không dùng mạo từ.",
    whyVi:
      "Tiếng Việt mình không có mạo từ, nên chọn “a” hay “an” là điều hoàn toàn mới. Quy tắc đi theo ÂM THANH, không theo chữ viết: “a” trước âm phụ âm (a book), “an” trước âm nguyên âm (an apple). Nên bạn hay nói “a apple” hoặc “an book”. Đây là lỗi nhỏ rất phổ biến, không có gì đáng ngại.",
    howToHelpVi:
      "Bạn có thể chơi cùng người thân: chỉ vào đồ vật và đọc to “an apple, an egg, a book, a pen” cho quen cảm giác. Khi bạn đọc nhầm, nhờ người thân nhắc lại tự nhiên — “an apple, yes!” — chứ không cần dừng lại sửa.",
    encouragementVi:
      "Đây là một trong những lỗi dễ chỉnh nhất — chỉ cần để ý âm đầu của từ. Nghe và đọc nhiều, bạn sẽ tự chọn đúng mà không phải nghĩ.",
    example: {
      learnerSays: "I ate a apple.",
      naturalForm: "I ate an apple.",
      glossVi:
        "“Tôi ăn một quả táo” — tiếng Việt không phân biệt a/an, nên bạn để “a” trước “apple”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_possessive_gender",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "“His” cho nam, “her” cho nữ — theo giới của người sở hữu",
    patternLabelEn: "his / her by owner's gender",
    parentSummaryVi:
      "Bạn đang học đổi “his / her” theo giới của người sở hữu — tiếng Việt mình dùng “của anh ấy / của cô ấy”, cấu trúc giống nhau.",
    whyVi:
      "Tiếng Việt mình nói “của anh ấy”, “của cô ấy” — cùng một kiểu, chỉ đổi “anh/cô”. Tiếng Anh lại đổi hẳn từ sở hữu theo giới của người chủ: “his” cho nam, “her” cho nữ. Nên khi định nói “mẹ của cô ấy”, bạn hay nói “his mother”. Đây là điều rất nhiều người Việt mình lẫn lúc đầu.",
    howToHelpVi:
      "Khi kể chuyện gia đình bằng tiếng Anh với người thân, để ý người sở hữu là nam hay nữ. Nếu bạn dùng nhầm, nhờ người thân nhắc lại nhẹ nhàng — “her mother, right?” — như đang xác nhận, không phải sửa.",
    encouragementVi:
      "Lẫn his/her là chuyện thường vì tiếng Việt không buộc phân biệt. Khi quen nếp “người sở hữu là ai”, bạn sẽ tự chọn đúng rất nhanh.",
    example: {
      learnerSays: "My sister loves his teacher.",
      naturalForm: "My sister loves her teacher.",
      glossVi:
        "“Chị tôi quý cô giáo của chị ấy” — tiếng Việt cùng kiểu “của…”, nên bạn chưa đổi sang “her”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_preposition_transfer",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Chọn giới từ in / on / at cho đúng ngữ cảnh",
    patternLabelEn: "Preposition choice (in/on/at)",
    parentSummaryVi:
      "Bạn đang học chọn đúng in / on / at — tiếng Việt mình thường chỉ cần một chữ “ở” hay “vào” cho nhiều trường hợp.",
    whyVi:
      "Tiếng Việt mình khá thoáng: “ở nhà”, “vào thứ Hai”, “lúc 7 giờ” — không có quy tắc cứng. Tiếng Anh chia rõ theo loại: “in” (in the morning), “on” (on Monday), “at” (at 7). Nên bạn hay nói “in Monday”. Giới từ là phần khó với hầu hết người Việt mình, cần thời gian mới ngấm.",
    howToHelpVi:
      "Đừng học thuộc từng quy tắc. Khi nghe nhạc hay xem phim tiếng Anh cùng người thân, để ý cách họ nói “on Monday”, “at night”. Nếu bạn nói nhầm, nhờ người thân nhắc lại tự nhiên — “yes, on Monday!”.",
    encouragementVi:
      "Giới từ sai gần như không bao giờ làm người nghe hiểu lầm. Đây là phần mài dần qua nghe và đọc, không phải phần phải lo lắng.",
    example: {
      learnerSays: "I will meet you in Monday.",
      naturalForm: "I will meet you on Monday.",
      glossVi:
        "“Tôi sẽ gặp bạn vào thứ Hai” — tiếng Việt dùng “vào”, nên bạn chọn “in” thay vì “on”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_countable",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Một số danh từ tiếng Anh không đếm được",
    patternLabelEn: "Uncountable nouns",
    parentSummaryVi:
      "Bạn đang học rằng vài danh từ tiếng Anh (advice, information…) không thêm “-s” và không dùng “a” — tiếng Việt mình đếm bình thường.",
    whyVi:
      "Tiếng Việt mình đếm được gần như mọi thứ: “một lời khuyên”, “hai thông tin”. Tiếng Anh lại coi một số từ là không đếm được — advice, information, furniture, news — nên không có “a” và không thêm “-s”. Nên bạn hay nói “an advice” hay “informations”. Đây là điểm khác lạ mà rất nhiều người Việt mình phải làm quen.",
    howToHelpVi:
      "Không cần nhớ hết danh sách. Khi gặp những từ này lúc đọc cùng người thân, để ý chúng không bao giờ có “-s”. Nếu bạn nói “informations”, nhờ người thân nhắc lại tự nhiên — “a lot of information, yes”.",
    encouragementVi:
      "Đây chỉ là một nhóm nhỏ các từ đặc biệt — gặp nhiều lần là bạn nhớ. Nói nhầm cũng không sao, người nghe vẫn hiểu trọn ý.",
    example: {
      learnerSays: "She gave me many advices.",
      naturalForm: "She gave me a lot of advice.",
      glossVi:
        "“Cô ấy cho tôi nhiều lời khuyên” — tiếng Việt đếm được, nên bạn thêm “-s” vào “advice”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_double_past",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Quá khứ chỉ đánh dấu một lần (sau did/didn’t, động từ giữ nguyên)",
    patternLabelEn: "Double past marking",
    parentSummaryVi:
      "Bạn đang học rằng khi đã có “did / didn’t”, động từ chính giữ nguyên — “I didn’t go”, không phải “I didn’t went”.",
    whyVi:
      "Đây thường là lỗi của người đã học khá nhiều — bạn nhớ phải chia quá khứ nên chia luôn cả hai chỗ: “didn’t went”. Thật ra tiếng Anh chỉ đánh dấu quá khứ một lần: “did/didn’t” đã là quá khứ rồi nên động từ sau nó về dạng gốc. Đây là dấu hiệu cho thấy bạn đang tiến bộ, chỉ cần chỉnh một chút.",
    howToHelpVi:
      "Một mẹo vui khi luyện cùng người thân: “đã có did rồi thì động từ nghỉ ngơi”. Nếu bạn nói “didn’t went”, nhờ người thân nhắc lại tự nhiên — “you didn’t go, got it”.",
    encouragementVi:
      "Lỗi này cho thấy bạn đã nắm được thì quá khứ — chỉ là áp dụng hơi thừa một chút. Rất dễ chỉnh.",
    example: {
      learnerSays: "I didn't went to school.",
      naturalForm: "I didn't go to school.",
      glossVi:
        "Bạn nhớ chia quá khứ nên chia cả “did” lẫn “go”, nhưng tiếng Anh chỉ cần một lần.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_possessive_s_missing",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Thêm ’s để chỉ sở hữu (mother’s house)",
    patternLabelEn: "Possessive 's",
    parentSummaryVi:
      "Bạn đang học dùng ’s để chỉ sở hữu — tiếng Việt mình ghép hai danh từ là đủ (“nhà mẹ”).",
    whyVi:
      "Tiếng Việt mình ghép thẳng: “nhà của mẹ” hoặc gọn hơn “nhà mẹ” — hai danh từ đứng cạnh nhau là hiểu. Tiếng Anh thêm “’s” vào giữa: “my mother’s house”. Nên bạn hay nói “my mother house”. Đây là cấu trúc mới, rất tự nhiên khi chưa quen.",
    howToHelpVi:
      "Khi nói về đồ của ai trong nhà, thử thêm “’s”: “Mom’s phone”, “Dad’s car”. Nếu bạn quên, nhờ người thân nhắc lại tự nhiên — “oh, Mom’s phone?” — như đang hỏi cho rõ.",
    encouragementVi:
      "Thiếu “’s” không làm câu khó hiểu, người nghe vẫn biết là của ai. Quen tai vài lần là “’s” sẽ tự bật ra.",
    example: {
      learnerSays: "This is my mother house.",
      naturalForm: "This is my mother's house.",
      glossVi: "“Đây là nhà mẹ tôi” — tiếng Việt ghép thẳng, nên bạn bỏ “’s”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_comparative_double",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Dùng “more” HOẶC đuôi “-er”, không dùng cả hai",
    patternLabelEn: "Double comparative",
    parentSummaryVi:
      "Bạn đang học rằng so sánh hơn chỉ cần “more” hoặc “-er”, không dùng cả hai — “better”, không phải “more better”.",
    whyVi:
      "Tiếng Việt mình hay nhấn mạnh bằng cách thêm chữ — “tốt hơn nhiều”, “hơn hẳn”. Mang thói quen đó sang, bạn hay nói “more better”, “more faster” cho chắc ý. Tiếng Anh chỉ cần một dấu hiệu so sánh: hoặc “more”, hoặc “-er”. Đây là lỗi của người muốn diễn đạt cho thật rõ — đáng quý, chỉ cần giản lược một chút.",
    howToHelpVi:
      "Một mẹo gọn khi luyện cùng người thân: “chọn một thôi — more hay -er”. Nếu bạn nói “more better”, nhờ người thân nhắc lại tự nhiên — “yes, better!”.",
    encouragementVi:
      "Lỗi này đến từ việc bạn muốn nói cho thật nhấn — một ý tốt. Chỉ cần nhớ tiếng Anh thích gọn là xong.",
    example: {
      learnerSays: "This phone is more better.",
      naturalForm: "This phone is better.",
      glossVi:
        "Bạn thêm “more” cho chắc, nhưng “better” tự nó đã là so sánh hơn rồi.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_comparative_more_long",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Tính từ dài (2+ âm tiết) dùng “more”, không thêm “-er”",
    patternLabelEn: "Long-adjective comparative",
    parentSummaryVi:
      "Bạn đang học rằng tính từ dài dùng “more” (more beautiful), còn tính từ ngắn thì thêm “-er” (taller).",
    whyVi:
      "Tiếng Việt mình so sánh kiểu nào cũng như nhau: “đẹp hơn”, “cao hơn” — chỉ thêm “hơn”. Tiếng Anh lại chia theo độ dài của tính từ: ngắn thì “-er” (taller), dài thì “more” (more beautiful). Nên bạn hay nói “beautifuler”. Đây là điểm khác biệt nhỏ, ai cũng cần thời gian để quen tai.",
    howToHelpVi:
      "Quy tắc dễ nhớ khi luyện cùng người thân: “từ dài thì để more đứng trước”. Nếu bạn nói “beautifuler”, nhờ người thân nhắc lại tự nhiên — “more beautiful, yes”.",
    encouragementVi:
      "Bạn đã biết dùng so sánh hơn — rất tốt. Việc còn lại chỉ là cảm nhận từ nào ngắn, từ nào dài, và điều đó đến dần qua nghe.",
    example: {
      learnerSays: "She is beautifuler than me.",
      naturalForm: "She is more beautiful than me.",
      glossVi:
        "“Cô ấy đẹp hơn tôi” — tiếng Việt chỉ thêm “hơn”, nên bạn gắn “-er” vào “beautiful”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_many_with_uncount",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Danh từ không đếm được dùng “much” / “a lot of”, không dùng “many”",
    patternLabelEn: "many with uncountable nouns",
    parentSummaryVi:
      "Bạn đang học rằng thứ không đếm được (water, money…) dùng “much” hoặc “a lot of”, không dùng “many”.",
    whyVi:
      "Tiếng Việt mình dùng một chữ “nhiều” cho tất cả: “nhiều nước”, “nhiều sách”. Tiếng Anh lại tách ra: “many” cho thứ đếm được, “much / a lot of” cho thứ không đếm được (water, money, advice). Nên bạn hay nói “many water”. Đây là điều rất nhiều người Việt mình phải làm quen vì tiếng mình gộp chung.",
    howToHelpVi:
      "Mẹo gọn khi luyện cùng người thân: “rót ra cốc được thì không đếm — dùng a lot of”. Nếu bạn nói “many water”, nhờ người thân nhắc lại tự nhiên — “a lot of water, right”.",
    encouragementVi:
      "Nhầm many/much không làm sai ý “nhiều” của bạn chút nào. Gặp vài lần là bạn tự phân biệt được.",
    example: {
      learnerSays: "I drink many water.",
      naturalForm: "I drink a lot of water.",
      glossVi:
        "“Tôi uống nhiều nước” — tiếng Việt một chữ “nhiều”, nên bạn dùng “many” cho “water”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_countable_much",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Danh từ đếm được dùng “many” / “a lot of”, không dùng “much”",
    patternLabelEn: "much with countable nouns",
    parentSummaryVi:
      "Bạn đang học rằng thứ đếm được (books, friends…) dùng “many” hoặc “a lot of”, không dùng “much”.",
    whyVi:
      "Tiếng Việt mình dùng “nhiều” cho mọi thứ nên rất tự nhiên khi bạn gắn “much” vào đâu cũng được: “much books”. Tiếng Anh lại giữ “much” cho thứ không đếm được; với danh từ đếm được số nhiều thì dùng “many” hoặc “a lot of”. Đây là mặt còn lại của cùng một thói quen “nhiều” trong tiếng Việt mình.",
    howToHelpVi:
      "Khi luyện cùng người thân, nhớ: “đếm được từng cái (sách, bạn, ngày) thì dùng many”. Nếu bạn nói “much books”, nhờ người thân nhắc lại tự nhiên — “many books, yes”.",
    encouragementVi:
      "Đây chỉ là hai mặt của một quy tắc — khi bạn nắm được “đếm được hay không”, cả much lẫn many đều tự đúng.",
    example: {
      learnerSays: "I have much friends.",
      naturalForm: "I have many friends.",
      glossVi:
        "“Tôi có nhiều bạn” — tiếng Việt một chữ “nhiều”, nên bạn dùng “much” cho “friends”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_some_vs_any",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "“some” trong câu khẳng định, “any” trong câu phủ định và câu hỏi",
    patternLabelEn: "some vs any",
    parentSummaryVi:
      "Bạn đang học dùng “some” trong câu khẳng định và “any” trong câu phủ định, câu hỏi — tiếng Việt mình dùng “một ít / nào” thoải mái hơn.",
    whyVi:
      "Tiếng Việt mình dùng “một ít”, “chút”, “nào” khá thoải mái cho cả câu khẳng định lẫn phủ định. Tiếng Anh có quy tắc rõ hơn: “some” khi khẳng định (I have some money), “any” khi phủ định hoặc hỏi (I don’t have any money). Nên bạn hay nói “I don’t have some money”. Đây là điểm nhỏ mà nhiều người Việt mình quen dần qua nghe.",
    howToHelpVi:
      "Mẹo gọn khi luyện cùng người thân: “có thì some, không hay hỏi thì any”. Nếu bạn nói nhầm, nhờ người thân nhắc lại tự nhiên — “you don’t have any money, I see”.",
    encouragementVi:
      "Nhầm some/any rất hiếm khi gây hiểu lầm. Nghe quen mẫu câu vài lần là bạn tự chọn đúng.",
    example: {
      learnerSays: "I don't have some money.",
      naturalForm: "I don't have any money.",
      glossVi:
        "“Tôi không có chút tiền nào” — tiếng Việt dùng “chút/nào” thoải mái, nên bạn để “some” trong câu phủ định.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
  {
    tag: "vi_l1_do_support_3ps",
    source: "grammar_rule",
    cefr: "A2",
    patternNameVi: "Với he / she / it dùng “doesn’t”, không phải “don’t”",
    patternLabelEn: "doesn't for he/she/it",
    parentSummaryVi:
      "Bạn đang học rằng với he / she / it thì phủ định dùng “doesn’t” — và động từ chính giữ nguyên.",
    whyVi:
      "Tiếng Việt mình phủ định chỉ một kiểu “không” cho mọi chủ ngữ: “anh ấy không thích”, “tôi không thích”. Tiếng Anh lại đổi trợ động từ theo chủ ngữ: “I don’t” nhưng “he doesn’t”. Nên bạn hay nói “He don’t like”. Đây là họ hàng gần với quy tắc thêm “-s” cho he/she/it — rất nhiều người Việt mình gặp.",
    howToHelpVi:
      "Mẹo gọn khi luyện cùng người thân: “he, she, it đi với doesn’t”. Nếu bạn nói “he don’t”, nhờ người thân nhắc lại tự nhiên — “he doesn’t, right?”.",
    encouragementVi:
      "Nếu bạn đã quen thêm “-s” cho he/she/it, thì “doesn’t” chỉ là người anh em của quy tắc đó — nắm một cái là cái kia theo sau.",
    example: {
      learnerSays: "He don't like coffee.",
      naturalForm: "He doesn't like coffee.",
      glossVi:
        "“Anh ấy không thích cà phê” — tiếng Việt một chữ “không”, nên bạn dùng “don’t” cho “he”.",
    },
    validated: false,
    reviewStatus: "needs_chau",
    version: "0.1.0",
  },
];

export default VI_GRAMMAR_FAMILY_BRIDGE;
