// src/languages/punjabi/gurmukhiMasteryReview.ts
//
// Final Gurmukhi mastery review data for Punjabi script and vocabulary.
// Native review is deferred.

export type PunjabiMasteryFocus =
  | "letters"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_bridge_reduction"
  | "shahmukhi_awareness"
  | "export_readiness";

export type PunjabiMasteryLevel = "review" | "hardening" | "regression" | "exit";

export type PunjabiMasteryReviewItem = {
  id: string;
  focus: PunjabiMasteryFocus;
  level: PunjabiMasteryLevel;
  gurmukhi: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  task_vi: string;
  task_en: string;
  successCriteria_vi: string;
  successCriteria_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  reduceRomanization?: boolean;
  exportReady?: boolean;
};

export type PunjabiMasteryReviewSection = {
  focus: PunjabiMasteryFocus;
  title_vi: string;
  title_en: string;
  reviewGoal_vi: string;
  reviewGoal_en: string;
  items: ReadonlyArray<PunjabiMasteryReviewItem>;
};

export const PUNJABI_GURMUKHI_MASTERY_REVIEW_SCOPE = {
  vi: "Bộ review này củng cố Gurmukhi làm hệ chữ chính: chữ cái, dấu nguyên âm, addak/tippi/bindi, biển sinh tồn, từ dịch vụ, động từ tần suất cao, collocation, giảm romanization và kiểm tra xuất bản. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This review keeps Gurmukhi as the primary script across letters, vowel signs, addak/tippi/bindi, survival signs, service vocabulary, high-frequency verbs, collocations, romanization reduction, and export checks. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiMasteryReviewSection> = [
  {
    focus: "letters",
    title_vi: "Chữ cái lõi",
    title_en: "Core Letters",
    reviewGoal_vi: "Xác nhận người học phân biệt chữ Gurmukhi dễ nhầm trước khi đọc từ thật.",
    reviewGoal_en: "Confirm learners can separate commonly confused Gurmukhi letters before reading real words.",
    items: [
      { id: "pa-mastery-letter-001", focus: "letters", level: "review", gurmukhi: "ਕ / ਖ", romanization: "k / kh", meaning_vi: "cặp không bật hơi và bật hơi", meaning_en: "unaspirated and aspirated pair", task_vi: "Chọn ਖ trong từ ਖਾਣਾ rồi đọc lại không dùng English kh.", task_en: "Choose ਖ in ਖਾਣਾ, then reread without treating kh as English letters.", successCriteria_vi: "Nhận ra ਖ là một chữ Gurmukhi riêng.", successCriteria_en: "Recognizes ਖ as one separate Gurmukhi letter.", learnerTrap: { vi: "kh không phải k cộng h trong chữ Gurmukhi.", en: "kh is not k plus h in Gurmukhi." }, exportReady: true },
      { id: "pa-mastery-letter-002", focus: "letters", level: "review", gurmukhi: "ਤ / ਟ", romanization: "t / tt", meaning_vi: "t răng và t quặt lưỡi", meaning_en: "dental t and retroflex t", task_vi: "Đánh dấu chữ trong ਟਿਕਟ khi đọc biển/quầy dịch vụ.", task_en: "Mark the letter in ਟਿਕਟ when reading a sign or service counter.", successCriteria_vi: "Không gộp ਤ và ਟ thành một chữ Latin t.", successCriteria_en: "Does not collapse ਤ and ਟ into one Latin t.", learnerTrap: { vi: "Romanization có thể che mất khác biệt hình chữ.", en: "Romanization can hide the script distinction." }, canadaPractical: true },
      { id: "pa-mastery-letter-003", focus: "letters", level: "regression", gurmukhi: "ਸ / ਸ਼", romanization: "s / sh", meaning_vi: "s thường và sh có dấu dưới", meaning_en: "plain s and lower-mark sh", task_vi: "Đọc ਸ਼ਹਿਰ trước khi xem shahir/shehar.", task_en: "Read ਸ਼ਹਿਰ before seeing shahir/shehar.", successCriteria_vi: "Nhận ra ਸ਼ bằng dấu dưới, không đoán từ Latin.", successCriteria_en: "Recognizes ਸ਼ by the lower mark, not by guessing from Latin.", learnerTrap: { vi: "Dấu nhỏ dưới chữ vẫn là tín hiệu quan trọng.", en: "The small lower mark is still a key signal." }, reduceRomanization: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Dấu nguyên âm",
    title_en: "Vowel Signs",
    reviewGoal_vi: "Ôn các dấu nguyên âm có khả năng đảo mắt đọc hoặc nhầm độ dài.",
    reviewGoal_en: "Review vowel signs that can cause visual order or length confusion.",
    items: [
      { id: "pa-mastery-vowel-001", focus: "vowel_signs", level: "hardening", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", meaning_vi: "i ngắn và i dài", meaning_en: "short i and long ii", task_vi: "Nói dấu ਿ viết trước nhưng đọc sau phụ âm.", task_en: "State that ਿ is written before but read after the consonant.", successCriteria_vi: "Không đọc ਕਿ như ik khi gặp từ thật.", successCriteria_en: "Does not read ਕਿ as ik in real words.", learnerTrap: { vi: "Vị trí viết không phải thứ tự đọc.", en: "Written position is not reading order." }, exportReady: true },
      { id: "pa-mastery-vowel-002", focus: "vowel_signs", level: "review", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", meaning_vi: "u ngắn và u dài", meaning_en: "short u and long uu", task_vi: "So sánh dấu dưới trong hai âm tiết rồi đọc chậm.", task_en: "Compare the under-letter signs in both syllables and read slowly.", successCriteria_vi: "Phân biệt ੁ và ੂ trong chữ thật.", successCriteria_en: "Separates ੁ and ੂ in real script." },
      { id: "pa-mastery-vowel-003", focus: "vowel_signs", level: "exit", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", meaning_vi: "e, ai/ae và au", meaning_en: "e, ai/ae, and au", task_vi: "Đọc ba dạng này trước khi vào bài biển hiệu.", task_en: "Read all three forms before entering signage review.", successCriteria_vi: "Không đổi dấu khi đọc nhanh.", successCriteria_en: "Does not swap signs during fast reading.", learnerTrap: { vi: "ai/ae có thể khác theo nguồn romanization.", en: "ai/ae can vary by romanization source." }, exportReady: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi",
    reviewGoal_vi: "Kiểm tra dấu nhỏ làm thay đổi cách nhận diện từ và tên riêng.",
    reviewGoal_en: "Check small marks that affect word and name recognition.",
    items: [
      { id: "pa-mastery-mark-001", focus: "addak_tippi_bindi", level: "hardening", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", meaning_vi: "trạm xe buýt", meaning_en: "bus stop", task_vi: "Chỉ ra addak trong cả ਬੱਸ và ਅੱਡਾ.", task_en: "Point out addak in both ਬੱਸ and ਅੱਡਾ.", successCriteria_vi: "Không bỏ qua ੱ khi đọc biển giao thông.", successCriteria_en: "Does not skip ੱ when reading transit signs.", learnerTrap: { vi: "Addak nhỏ nhưng không phải trang trí.", en: "Addak is small but not decorative." }, canadaPractical: true, exportReady: true },
      { id: "pa-mastery-mark-002", focus: "addak_tippi_bindi", level: "review", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", meaning_vi: "mẹ / Punjab", meaning_en: "mother / Punjab", task_vi: "Phân biệt bindi trong ਮਾਂ và tippi trong ਪੰਜਾਬ.", task_en: "Separate bindi in ਮਾਂ from tippi in ਪੰਜਾਬ.", successCriteria_vi: "Gọi đúng dấu thay vì chỉ nhớ dạng Latin.", successCriteria_en: "Names the mark correctly instead of relying on Latin." },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Biển sinh tồn",
    title_en: "Survival Signage",
    reviewGoal_vi: "Đảm bảo người học đọc được biển ngắn có hành động thực tế ở Canada.",
    reviewGoal_en: "Ensure learners can read short signs with practical actions in Canada.",
    items: [
      { id: "pa-mastery-sign-001", focus: "survival_signage", level: "exit", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", meaning_vi: "lối ra", meaning_en: "exit", task_vi: "Chọn hướng đi khi thấy biển này trong tòa nhà.", task_en: "Choose the direction to go when seeing this sign in a building.", successCriteria_vi: "Liên kết chữ với hành động tìm lối ra.", successCriteria_en: "Links the script to the action of finding the exit.", canadaPractical: true, exportReady: true },
      { id: "pa-mastery-sign-002", focus: "survival_signage", level: "review", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", meaning_vi: "cấp cứu/khẩn cấp", meaning_en: "emergency", task_vi: "Nhận ra từ này ở bệnh viện hoặc phòng khám.", task_en: "Recognize this word in a hospital or clinic.", successCriteria_vi: "Không cần English để hiểu tình huống khẩn cấp.", successCriteria_en: "Does not need English to understand the urgent context.", canadaPractical: true },
      { id: "pa-mastery-sign-003", focus: "survival_signage", level: "hardening", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", meaning_vi: "nhà thuốc", meaning_en: "pharmacy", task_vi: "Đọc chữ ਫ trước khi dựa vào từ mượn English.", task_en: "Read ਫ before leaning on the English loanword.", successCriteria_vi: "Ưu tiên Gurmukhi dù từ quen trong English.", successCriteria_en: "Prioritizes Gurmukhi even when the English word is familiar.", learnerTrap: { vi: "Từ mượn không thay thế kỹ năng đọc chữ.", en: "Loanwords do not replace script reading." }, canadaPractical: true, reduceRomanization: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Từ dịch vụ",
    title_en: "Service Vocabulary",
    reviewGoal_vi: "Ôn từ thường gặp trong phòng khám, nhà ở, trường học và giấy tờ.",
    reviewGoal_en: "Review common words for clinics, housing, school, and paperwork.",
    items: [
      { id: "pa-mastery-service-001", focus: "service_vocabulary", level: "review", gurmukhi: "ਦਵਾਈ", romanization: "davai", meaning_vi: "thuốc", meaning_en: "medicine", task_vi: "Xếp từ này vào tình huống hỏi thuốc ở pharmacy.", task_en: "Place this word in a pharmacy medicine request.", successCriteria_vi: "Đọc chữ và nhớ nghĩa y tế cơ bản.", successCriteria_en: "Reads the script and recalls the basic health meaning.", canadaPractical: true },
      { id: "pa-mastery-service-002", focus: "service_vocabulary", level: "hardening", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", meaning_vi: "tiền thuê", meaning_en: "rent", task_vi: "Dùng từ này khi xem form nhà ở hoặc tin thuê nhà.", task_en: "Use this word when viewing a housing form or rental notice.", successCriteria_vi: "Nhận diện trong ngữ cảnh nhà ở Canada.", successCriteria_en: "Recognizes it in Canadian housing contexts.", canadaPractical: true },
      { id: "pa-mastery-service-003", focus: "service_vocabulary", level: "regression", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", meaning_vi: "trường học", meaning_en: "school", task_vi: "Đọc bằng Gurmukhi thay vì chỉ nhìn chữ English quen.", task_en: "Read through Gurmukhi instead of only seeing familiar English.", successCriteria_vi: "Giữ Gurmukhi là nguồn chính.", successCriteria_en: "Keeps Gurmukhi as the primary source.", learnerTrap: { vi: "Loanword quen vẫn cần kiểm tra chữ.", en: "A familiar loanword still needs script checking." }, canadaPractical: true, reduceRomanization: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Động từ tần suất cao",
    title_en: "High-Frequency Verbs",
    reviewGoal_vi: "Xác nhận động từ lõi hoạt động trong cụm hành động thực tế.",
    reviewGoal_en: "Confirm core verbs work inside practical action chunks.",
    items: [
      { id: "pa-mastery-verb-001", focus: "high_frequency_verbs", level: "review", gurmukhi: "ਕਰਨਾ", romanization: "karna", meaning_vi: "làm", meaning_en: "do/make", task_vi: "Ghép với ਫਾਰਮ để tạo ਫਾਰਮ ਭਰਨਾ hoặc việc giấy tờ tương tự.", task_en: "Combine with paperwork context, such as forms and service tasks.", successCriteria_vi: "Hiểu động từ lõi qua cụm, không học rời.", successCriteria_en: "Understands the core verb through chunks, not in isolation." },
      { id: "pa-mastery-verb-002", focus: "high_frequency_verbs", level: "exit", gurmukhi: "ਲੈਣਾ", romanization: "laina", meaning_vi: "lấy/đặt trong cụm", meaning_en: "take/book in chunks", task_vi: "Đọc ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ như hành động đặt lịch.", task_en: "Read ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ as booking an appointment.", successCriteria_vi: "Dùng được trong phòng khám ở Canada.", successCriteria_en: "Usable in Canadian clinic settings.", canadaPractical: true, exportReady: true },
      { id: "pa-mastery-verb-003", focus: "high_frequency_verbs", level: "hardening", gurmukhi: "ਸਮਝਣਾ", romanization: "samajhna", meaning_vi: "hiểu", meaning_en: "understand", task_vi: "Liên kết với ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ khi cần trợ giúp.", task_en: "Link it with ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ when asking for support.", successCriteria_vi: "Nhận ra động từ trong câu hỗ trợ.", successCriteria_en: "Recognizes the verb inside a support sentence.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Collocation",
    title_en: "Collocations",
    reviewGoal_vi: "Đọc cụm cố định như một đơn vị nghĩa thay vì dịch từng chữ.",
    reviewGoal_en: "Read fixed chunks as meaning units instead of translating word by word.",
    items: [
      { id: "pa-mastery-collocation-001", focus: "collocations", level: "exit", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", meaning_vi: "tôi cần giúp đỡ", meaning_en: "I need help", task_vi: "Đọc cả câu khi hỏi nhân viên dịch vụ.", task_en: "Read the whole sentence when asking service staff.", successCriteria_vi: "Hiểu và dùng như câu hỗ trợ đầy đủ.", successCriteria_en: "Understands and uses it as a complete support sentence.", canadaPractical: true, exportReady: true },
      { id: "pa-mastery-collocation-002", focus: "collocations", level: "hardening", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", meaning_vi: "điền mẫu đơn", meaning_en: "fill out a form", task_vi: "Ghép cụm này với giấy tờ trường học hoặc clinic.", task_en: "Pair this chunk with school or clinic paperwork.", successCriteria_vi: "Không dịch ਭਰਨਾ một cách rời rạc.", successCriteria_en: "Does not translate ਭਰਨਾ in isolation.", canadaPractical: true },
      { id: "pa-mastery-collocation-003", focus: "collocations", level: "regression", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", meaning_vi: "sửa lỗi", meaning_en: "correct a mistake", task_vi: "Tìm ਠ rồi đọc cụm sửa lỗi trong bài regression.", task_en: "Find ਠ and read the correction chunk in regression review.", successCriteria_vi: "Không đọc ਠ như English th.", successCriteria_en: "Does not read ਠ as English th.", learnerTrap: { vi: "ਠ là chữ Punjabi riêng, không phải th tiếng Anh.", en: "ਠ is a Punjabi letter, not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "romanization_bridge_reduction",
    title_vi: "Giảm cầu romanization",
    title_en: "Romanization Bridge Reduction",
    reviewGoal_vi: "Chuyển romanization thành gợi ý tạm thời và giữ Gurmukhi là dữ liệu chính.",
    reviewGoal_en: "Treat romanization as a temporary hint while keeping Gurmukhi primary.",
    items: [
      { id: "pa-mastery-roman-001", focus: "romanization_bridge_reduction", level: "hardening", gurmukhi: "ਫਲ", romanization: "phal/fal", meaning_vi: "trái cây", meaning_en: "fruit", task_vi: "Lượt 1 xem romanization, lượt 2 chỉ xem Gurmukhi.", task_en: "Round one shows romanization; round two shows only Gurmukhi.", successCriteria_vi: "Nhớ chữ ਫ thay vì chỉ nhớ phal/fal.", successCriteria_en: "Remembers ਫ instead of only phal/fal.", learnerTrap: { vi: "Romanization là cầu, không phải đáp án chính.", en: "Romanization is a bridge, not the main answer." }, reduceRomanization: true, exportReady: true },
      { id: "pa-mastery-roman-002", focus: "romanization_bridge_reduction", level: "exit", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", meaning_vi: "lớn", meaning_en: "big", task_vi: "Ẩn vadda/wadda rồi chọn đúng dạng Gurmukhi.", task_en: "Hide vadda/wadda and choose the correct Gurmukhi form.", successCriteria_vi: "Không tách thành hai từ vì v/w khác nhau.", successCriteria_en: "Does not split it into two words because v/w varies.", learnerTrap: { vi: "v/w khác nguồn không nhất thiết đổi nghĩa.", en: "v/w variation by source does not necessarily change meaning." }, reduceRomanization: true, exportReady: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    reviewGoal_vi: "Nhắc phạm vi: bài này dạy Gurmukhi chính, Shahmukhi chỉ để nhận biết.",
    reviewGoal_en: "Clarify scope: this review teaches Gurmukhi primary, with Shahmukhi awareness only.",
    items: [
      { id: "pa-mastery-shahmukhi-001", focus: "shahmukhi_awareness", level: "review", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", meaning_vi: "hệ chữ chính trong bộ này", meaning_en: "the primary script in this set", task_vi: "Xác nhận không biến mục này thành khóa Shahmukhi.", task_en: "Confirm this item does not become a Shahmukhi course.", successCriteria_vi: "Nêu rõ Shahmukhi chỉ là awareness.", successCriteria_en: "States that Shahmukhi is awareness only.", exportReady: true },
    ],
  },
  {
    focus: "export_readiness",
    title_vi: "Sẵn sàng xuất bản",
    title_en: "Export Readiness",
    reviewGoal_vi: "Đóng gói các kiểm tra cuối để dữ liệu dùng được trong app và regression.",
    reviewGoal_en: "Package final checks so the data can be consumed by the app and regression tests.",
    items: [
      { id: "pa-mastery-export-001", focus: "export_readiness", level: "exit", gurmukhi: "ਅੰਤਿਮ ਸਮੀਖਿਆ", romanization: "antim samikhia", meaning_vi: "review cuối", meaning_en: "final review", task_vi: "Kiểm tra id, focus, Gurmukhi, giải thích VI/EN và trap trước khi export.", task_en: "Check ids, focus, Gurmukhi, VI/EN explanations, and traps before export.", successCriteria_vi: "Dữ liệu là TypeScript consumable, không phải ghi chú rời.", successCriteria_en: "Data is consumable TypeScript, not loose notes.", exportReady: true },
      { id: "pa-mastery-export-002", focus: "export_readiness", level: "regression", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", meaning_vi: "kiểm tra lại", meaning_en: "regression check", task_vi: "Chạy lại bộ review để bắt lỗi romanization, dấu nhỏ và nội dung ngoài phạm vi.", task_en: "Rerun the review to catch romanization, small-mark, and out-of-scope issues.", successCriteria_vi: "Không có claim native-review hoặc dịch vụ ngoài phạm vi.", successCriteria_en: "No native-review claim or unrelated service work.", exportReady: true },
    ],
  },
];

export const PUNJABI_GURMUKHI_MASTERY_REVIEW = sections;

export const PUNJABI_GURMUKHI_MASTERY_REVIEW_ITEMS: ReadonlyArray<PunjabiMasteryReviewItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_GURMUKHI_MASTERY_REVIEW;
