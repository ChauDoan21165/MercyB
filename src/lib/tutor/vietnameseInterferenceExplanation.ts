// Step 007: Enrichment module — Vietnamese→English interference explanations
// that a skilled human teacher would provide.
//
// A real teacher doesn't just say "Vietnamese does X, English does Y."
// A real teacher explains WHY Vietnamese works that way, WHY English is different,
// and WHAT mental model the learner needs to switch.
//
// Organized by linguistic root cause, not by surface error pattern.
//
// Usage:
//   import { explainInterference, getInterferenceCategoryExplanation } from "./vietnameseInterferenceExplanation";
//   const explanation = explainInterference("missing_word");
//   // Returns the full teacher explanation for that category.

import type { VietlishInterferenceCategory } from "./vietlishLogicEngine";

export type VietnameseInterferenceExplanation = {
  category: VietlishInterferenceCategory;
  /** The Vietnamese linguistic root cause — what about Vietnamese makes this error happen. */
  vietnameseRootCause: string;
  /** The English system difference — what about English the learner needs to internalize. */
  englishSystemDifference: string;
  /** How a skilled teacher would explain this contrast to a Vietnamese learner. */
  teacherExplanation: string;
  /** A mental-model shift the learner needs to make (e.g. "stop thinking in word-by-word translation"). */
  mentalModelShift: string;
  /** Common Vietnamese sentences that demonstrate the correct Vietnamese pattern (for contrast). */
  vietnameseExamples: string[];
  /** The corresponding English sentences showing the different structure. */
  englishExamples: string[];
};

const EXPLANATIONS: Record<VietlishInterferenceCategory, VietnameseInterferenceExplanation> = {
  missing_word: {
    category: "missing_word",
    vietnameseRootCause:
      "Tiếng Việt là ngôn ngữ đơn lập (isolating language): từ không biến đổi hình thái, " +
      "và quan hệ ngữ pháp được thể hiện qua trật tự từ + ngữ cảnh, không qua các từ chức năng " +
      "(function words) như mạo từ, giới từ, trợ động từ. Người Việt không có thói quen 'chèn' " +
      "các từ nhỏ như a/an/the, to, of, do/does vào câu vì tiếng Việt không cần chúng để câu có nghĩa.",
    englishSystemDifference:
      "Tiếng Anh là ngôn ngữ biến hình một phần (partially inflectional): nó dùng cả biến đổi " +
      "hình thái từ (thì, số nhiều) và từ chức năng (articles, prepositions, auxiliaries) để " +
      "tạo nghĩa. Trong tiếng Anh, các từ chức năng KHÔNG phải là 'tùy chọn' — chúng là một phần " +
      "bắt buộc của cấu trúc ngữ pháp. Thiếu a/an trước danh từ đếm được số ít cũng sai như " +
      "thiếu dấu trong tiếng Việt vậy.",
    teacherExplanation:
      "Tiếng Việt mình không cần a/an/the mà câu vẫn đủ nghĩa — " +
      "người nghe tự hiểu qua ngữ cảnh. Nhưng tiếng Anh bắt buộc phải có những từ nhỏ này: " +
      "thiếu a/an trước danh từ đếm được cũng sai như thiếu dấu trong tiếng Việt vậy. " +
      "Cô Mercy mách: mỗi lần viết danh từ, dừng một giây tự hỏi \"có cần a/an/the không?\" " +
      "— lặp lại 20 lần là thành thói quen.",
    mentalModelShift:
      "Từ tư duy 'câu = ý nghĩa' (tiếng Việt) sang tư duy 'câu = cấu trúc + ý nghĩa' (tiếng Anh). " +
      "Trong tiếng Anh, cấu trúc ngữ pháp không phải là 'trang trí' — nó là một phần của nghĩa.",
    vietnameseExamples: [
      "Tôi đi chợ.",
      "Cô ấy là giáo viên.",
      "Tôi mua mũ hôm qua.",
    ],
    englishExamples: [
      "I go to the market. (cần 'to' và 'the')",
      "She is a teacher. (cần 'a')",
      "I bought a hat yesterday. (cần 'a')",
    ],
  },
  extra_word: {
    category: "extra_word",
    vietnameseRootCause:
      "Tiếng Việt có thói quen dùng các từ nối như 'về', 'với', 'cho' sau động từ " +
      "để chỉ hướng hoặc đối tượng. Khi dịch sang tiếng Anh, người Việt dịch từng thành phần: " +
      "động từ + giới từ, tạo ra các cặp như 'discuss about', 'mention about', 'contact with'. " +
      "Nhưng nhiều động từ tiếng Anh đã 'nuốt' giới từ vào trong nghĩa của chúng — " +
      "chúng là ngoại động từ (transitive verbs), nhận tân ngữ trực tiếp.",
    englishSystemDifference:
      "Tiếng Anh phân biệt ngoại động từ (transitive — nhận tân ngữ trực tiếp) và nội động từ " +
      "(intransitive — cần giới từ trước tân ngữ). Discuss, mention, contact, marry, research " +
      "đều là ngoại động từ. Người bản xứ không 'cảm thấy' cần thêm about/with sau chúng vì " +
      "nghĩa đã trọn vẹn. Đây là một phần của 'cảm giác ngôn ngữ' (Sprachgefühl) — thứ chỉ có " +
      "được qua tiếp xúc nhiều, không thể suy luận từ tiếng Việt.",
    teacherExplanation:
      "Một số động từ tiếng Anh như discuss, contact, marry — chúng đi thẳng vào tân ngữ, " +
      "không cần about/with đi kèm. Lỗi này đến từ thói quen dịch từng chữ: " +
      "\"thảo luận về\" → \"discuss about\" (sai). Cô Mercy khuyên: học nguyên cụm " +
      "\"discuss something\", \"contact someone\" — đừng tách từ ra rồi dịch riêng.",
    mentalModelShift:
      "Từ tư duy 'dịch từng thành phần' (động từ + giới từ riêng lẻ) sang tư duy 'học nguyên cụm' " +
      "(collocation). Không nghĩ 'discuss = thảo luận, about = về' mà nghĩ 'discuss something = thảo luận cái gì đó'.",
    vietnameseExamples: [
      "Chúng tôi thảo luận về kế hoạch.",
      "Cô ấy kết hôn với bạn cùng lớp.",
      "Hãy liên hệ với quản lý.",
    ],
    englishExamples: [
      "We discussed the plan. (không có about)",
      "She married her classmate. (không có with)",
      "Please contact the manager. (không có with)",
    ],
  },
  word_order: {
    category: "word_order",
    vietnameseRootCause:
      "Tiếng Việt là ngôn ngữ 'chủ đề nổi bật' (topic-prominent): thông tin quan trọng nhất " +
      "(chủ đề) có thể được đưa lên đầu câu, tiếp theo là phần bình luận về chủ đề đó. " +
      "'Cuốn sách này tôi thích' là hoàn toàn tự nhiên. Ngoài ra, tiếng Việt có trật tự từ " +
      "khá linh hoạt — trạng từ có thể đứng ở nhiều vị trí khác nhau mà vẫn đúng ngữ pháp.",
    englishSystemDifference:
      "Tiếng Anh là ngôn ngữ 'chủ ngữ nổi bật' (subject-prominent): câu cơ bản luôn theo trật tự " +
      "Subject + Verb + Object. Trạng từ có vị trí cố định tùy loại: tần suất (always, usually) " +
      "đứng trước động từ chính; thời gian (in the morning, every day) đứng cuối câu. " +
      "Đây không phải là 'phong cách' — đây là quy tắc ngữ pháp cứng.",
    teacherExplanation:
      "Tiếng Anh có trật tự cứng: Chủ ngữ → Động từ → Tân ngữ — khác với tiếng Việt " +
      "mình có thể đảo \"Cuốn sách này tôi thích\" mà vẫn tự nhiên. Cô Mercy nhắc: " +
      "khi viết tiếng Anh, luôn mở đầu bằng chủ ngữ (ai làm), rồi động từ (làm gì), " +
      "rồi mới đến các chi tiết khác. Sai trật tự là lỗi người Việt mắc nhiều nhất " +
      "— tập đúng thứ tự này trước khi nghĩ đến chuyện \"phá cách\".",
    mentalModelShift:
      "Từ tư duy 'ý quan trọng đặt trước' (tiếng Việt) sang tư duy 'chủ ngữ + động từ + tân ngữ' " +
      "(tiếng Anh). Khi viết câu tiếng Anh, không nghĩ bằng tiếng Việt rồi dịch — " +
      "mà nghĩ thẳng bằng cấu trúc SVO.",
    vietnameseExamples: [
      "Cuốn sách này tôi thích.",
      "Sáng nào tôi cũng uống cà phê.",
      "Tiếng Anh tôi học mỗi ngày.",
    ],
    englishExamples: [
      "I like this book. (S + V + O)",
      "I usually drink coffee in the morning. (S + adv + V + O + time)",
      "I study English every day. (S + V + O + time)",
    ],
  },
  verb_form: {
    category: "verb_form",
    vietnameseRootCause:
      "Tiếng Việt KHÔNG biến hình động từ. 'Hôm qua tôi đi' và 'Ngày mai tôi đi' dùng cùng một " +
      "từ 'đi'. Thời gian được thể hiện qua từ chỉ thời gian (hôm qua, ngày mai, đã, sẽ, đang), " +
      "không qua biến đổi hình thái của động từ. Đây là đặc điểm cốt lõi của ngôn ngữ đơn lập. " +
      "Vì vậy, não người Việt không có 'mạch' tự động chia thì — đó là một thao tác hoàn toàn mới.",
    englishSystemDifference:
      "Tiếng Anh có hệ thống thì (tense) phức tạp: 12 thì cơ bản, mỗi thì đánh dấu thời gian " +
      "và khía cạnh (aspect) khác nhau. Động từ biến đổi hình thái để thể hiện thì: " +
      "go → went → have gone → had gone... Đối với người bản xứ, việc chia thì là tự động. " +
      "Đối với người Việt, đây là một 'phần mềm' hoàn toàn mới cần cài vào não.",
    teacherExplanation:
      "Tiếng Việt dùng \"hôm qua\", \"ngày mai\" để chỉ thời gian, còn động từ giữ nguyên — " +
      "\"hôm qua đi\" và \"ngày mai đi\" cùng một từ \"đi\". Tiếng Anh thì chính động từ " +
      "phải thay đổi: go → went, buy → bought. Cô Mercy nói: tập phản xạ như tập võ — " +
      "thấy \"yesterday\" là tay tự động gõ \"bought\", lặp đi lặp lại đến khi không cần nghĩ.",
    mentalModelShift:
      "Từ tư duy 'thời gian = từ riêng' (tiếng Việt) sang tư duy 'thời gian = từ riêng + dạng động từ' " +
      "(tiếng Anh). Coi cặp 'yesterday + V2' như một công thức khóa-chìa không thể tách rời.",
    vietnameseExamples: [
      "Hôm qua tôi đi chợ.",
      "Tuần trước tôi mua một cái mũ.",
      "Tôi đã ăn sáng rồi.",
    ],
    englishExamples: [
      "I went to the market yesterday. (went, không phải go)",
      "I bought a hat last week. (bought, không phải buy)",
      "I have already eaten breakfast. (have eaten, không phải eat)",
    ],
  },
  word_choice: {
    category: "word_choice",
    vietnameseRootCause:
      "Tiếng Việt có xu hướng dùng một từ bao phủ nhiều nghĩa. 'Mở' có thể là open (cửa), " +
      "turn on (đèn), start (máy). 'Nói' có thể là say, tell, speak, talk. 'Thích' có thể " +
      "là like, love, enjoy, prefer. Khi chuyển sang tiếng Anh, người Việt chọn một từ tiếng Anh " +
      "và áp dụng cho mọi ngữ cảnh — nhưng tiếng Anh phân biệt từng từ rất tinh tế.",
    englishSystemDifference:
      "Tiếng Anh có vốn từ vựng rất lớn và phân biệt nghĩa tinh tế giữa các từ gần nghĩa. " +
      "Say ≠ tell ≠ speak ≠ talk. Open ≠ turn on ≠ start. Like ≠ love ≠ enjoy ≠ prefer. " +
      "Mỗi từ có một 'vùng phủ sóng' riêng, và dùng sai từ có thể làm câu mất tự nhiên " +
      "hoặc sai nghĩa hoàn toàn. Người bản xứ học những phân biệt này từ nhỏ qua tiếp xúc.",
    teacherExplanation:
      "Tiếng Việt một từ dùng được nhiều chỗ: \"mở\" vừa là open (cửa) vừa là turn on (đèn). " +
      "Tiếng Anh phân biệt rất tinh: open the door nhưng turn on the light — mỗi từ có một " +
      "\"vùng phủ sóng\" riêng. Cô Mercy khuyên: đừng học từ đơn lẻ, hãy học nguyên cặp " +
      "(collocation) như \"turn on the light\", \"tell someone something\" — nhớ cả cụm thì " +
      "không bao giờ chọn sai từ.",
    mentalModelShift:
      "Từ tư duy 'một-từ-Việt-cho-nhiều-nghĩa' sang tư duy 'học-từ-theo-cụm-và-ngữ-cảnh'. " +
      "Khi học từ mới, luôn học cả collocation (từ đi kèm) và ngữ cảnh sử dụng.",
    vietnameseExamples: [
      "Mở cửa / mở đèn / mở máy lạnh (cùng một từ 'mở')",
      "Cô ấy nói với tôi / Cô ấy nói tiếng Anh (cùng một từ 'nói')",
      "Tôi rất thích / Tôi thích hơn (cùng một từ 'thích')",
    ],
    englishExamples: [
      "Open the door / turn on the light / turn on the AC (ba từ khác nhau)",
      "She told me / She speaks English (hai từ khác nhau cho 'nói')",
      "I really like it / I prefer it (hai từ khác nhau)",
    ],
  },
  noun_form: {
    category: "noun_form",
    vietnameseRootCause:
      "Tiếng Việt không có phạm trù số nhiều trên danh từ và không phân biệt danh từ đếm được/không đếm được. " +
      "'Hai quyển sách' — danh từ 'sách' không thay đổi. 'Một lời khuyên', 'hai lời khuyên' — " +
      "cùng một dạng. Số lượng được thể hiện qua từ chỉ số lượng và bộ phân loại (classifier), " +
      "không qua biến đổi hình thái của danh từ. Đây là một khái niệm ngữ pháp không tồn tại " +
      "trong tiếng Việt, nên người học phải xây dựng nó từ đầu.",
    englishSystemDifference:
      "Tiếng Anh phân biệt: (1) danh từ đếm được số ít/số nhiều (a book → books), " +
      "(2) danh từ không đếm được (advice, information, furniture — không có a/an, không có -s). " +
      "Đây là hai hệ thống phân loại danh từ mà người bản xứ dùng tự động nhưng người Việt " +
      "phải học một cách có ý thức. Đặc biệt, danh từ không đếm được trong tiếng Anh " +
      "thường là những từ mà tiếng Việt coi là đếm được (một lời khuyên = an advice → sai).",
    teacherExplanation:
      "Tiếng Việt không phân biệt danh từ đếm được / không đếm được — \"một lời khuyên\" " +
      "và \"hai lời khuyên\" dùng cùng một từ \"khuyên\". Nhưng tiếng Anh thì advice, information, " +
      "furniture, homework là không đếm được: không có a/an, không thêm -s. Cô Mercy dặn: " +
      "khi học một danh từ mới, luôn nhớ kèm \"đếm được hay không?\" — sai cái này là lỗi " +
      "người Việt mắc hoài, vì tiếng mình không có khái niệm này.",
    mentalModelShift:
      "Từ tư duy 'danh từ = một khối không phân biệt' (tiếng Việt) sang tư duy 'mỗi danh từ có " +
      "một kiểu đếm riêng' (tiếng Anh). Học danh từ mới luôn kèm với: đếm được hay không? " +
      "Nếu đếm được, dạng số nhiều là gì?",
    vietnameseExamples: [
      "Một quyển sách / Hai quyển sách (cùng một từ 'sách')",
      "Một lời khuyên / Nhiều lời khuyên (cùng một từ 'khuyên')",
      "Một thông tin / Nhiều thông tin (cùng một từ 'thông tin')",
    ],
    englishExamples: [
      "One book / Two books (thêm -s)",
      "Some advice / A piece of advice (không đếm được!)",
      "Some information (không đếm được!)",
    ],
  },
  other: {
    category: "other",
    vietnameseRootCause:
      "Có những lỗi không thuộc về một phạm trù ngữ pháp cụ thể, mà đến từ sự khác biệt " +
      "tổng thể giữa hai hệ thống ngôn ngữ: đơn lập vs biến hình, âm tiết mở vs âm tiết đóng, " +
      "thanh điệu vs trọng âm. Những khác biệt này ảnh hưởng đến cả phát âm, ngữ điệu, " +
      "và cách tổ chức thông tin trong câu.",
    englishSystemDifference:
      "Tiếng Anh có nhiều đặc điểm không tồn tại trong tiếng Việt: trọng âm từ (word stress), " +
      "ngữ điệu câu (sentence intonation), âm cuối (final consonants), nối âm (connected speech). " +
      "Những đặc điểm này không chỉ ảnh hưởng đến phát âm mà còn ảnh hưởng đến ngữ pháp và " +
      "cách người bản xứ hiểu câu.",
    teacherExplanation:
      "Không phải lỗi nào cũng rơi vào một nguyên nhân rõ ràng. Nhưng hầu hết lỗi " +
      "của người Việt học tiếng Anh đều có chung một gốc rễ: tiếng Việt thiếu thứ gì đó " +
      "(thì, mạo từ, trật tự cứng…) → tiếng Anh bắt buộc có thứ đó. Cô Mercy khuyên: " +
      "mỗi lần sai, đừng chỉ sửa rồi quên — dừng lại hỏi \"Tại sao tiếng Việt mình không " +
      "có cái này?\" thì lần sau sẽ nhớ lâu hơn.",
    mentalModelShift:
      "Chấp nhận rằng một số khía cạnh của tiếng Anh không có 'bản dịch' sang cách nghĩ tiếng Việt. " +
      "Học như một đứa trẻ: tiếp nhận, bắt chước, và dần dần có 'cảm giác' đúng/sai.",
    vietnameseExamples: [],
    englishExamples: [],
  },
};

/**
 * Returns the full teacher-quality explanation for a given Vietnamese→English
 * interference category. Use this to enrich UI explanations, generate learning
 * tips, or build teacher-adaptation logic.
 */
export function getInterferenceCategoryExplanation(
  category: VietlishInterferenceCategory,
): VietnameseInterferenceExplanation {
  return EXPLANATIONS[category] ?? EXPLANATIONS.other;
}

/**
 * Convenience: returns just the teacher explanation string for a category.
 */
export function explainInterference(
  category: VietlishInterferenceCategory,
): string {
  return getInterferenceCategoryExplanation(category).teacherExplanation;
}

/**
 * Returns all categories with their Vietnamese root cause (for analytics/UI).
 */
export function getAllInterferenceExplanations(): VietnameseInterferenceExplanation[] {
  return Object.values(EXPLANATIONS);
}

/**
 * Returns a brief (≤ 100 char) Vietnamese label for each category,
 * suitable for UI badges or filter chips.
 */
export function getCategoryLabelVi(category: VietlishInterferenceCategory): string {
  const labels: Record<VietlishInterferenceCategory, string> = {
    missing_word: "Thiếu từ (a/an/the/to/...)",
    extra_word: "Thừa từ (about/with/...)",
    word_order: "Trật tự từ",
    verb_form: "Dạng động từ / Thì",
    word_choice: "Chọn từ",
    noun_form: "Dạng danh từ / Số nhiều",
    other: "Khác",
  };
  return labels[category] ?? labels.other;
}
