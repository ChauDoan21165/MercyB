// src/languages/punjabi/gurmukhiConsistencyGuards.ts
//
// Punjabi Gurmukhi consistency guards for script and vocabulary content.
// Native review is deferred.

export type PunjabiConsistencyFocus =
  | "primary_script"
  | "romanization_bridge_limits"
  | "vowel_sign_awareness"
  | "addak_tippi_bindi_awareness"
  | "survival_signage"
  | "service_vocabulary"
  | "shahmukhi_awareness"
  | "quality_regression";

export type PunjabiConsistencySeverity = "blocker" | "warning" | "review" | "export";

export type PunjabiConsistencyGuard = {
  id: string;
  focus: PunjabiConsistencyFocus;
  severity: PunjabiConsistencySeverity;
  gurmukhi: string;
  romanization?: string;
  guard_vi: string;
  guard_en: string;
  pass_vi: string;
  pass_en: string;
  fix_vi: string;
  fix_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  exportReady?: boolean;
  regression?: boolean;
};

export type PunjabiConsistencyGuardSection = {
  focus: PunjabiConsistencyFocus;
  title_vi: string;
  title_en: string;
  purpose_vi: string;
  purpose_en: string;
  guards: ReadonlyArray<PunjabiConsistencyGuard>;
};

export const PUNJABI_GURMUKHI_CONSISTENCY_GUARDS_SCOPE = {
  vi: "Các guard này kiểm tra Gurmukhi là hệ chữ chính, romanization chỉ là cầu tạm thời, dấu nguyên âm và dấu nhỏ không bị bỏ qua, ví dụ Canada vẫn thực tế, và Shahmukhi chỉ là nhận biết. Native review được hoãn.",
  en: "These guards check that Gurmukhi stays primary, romanization remains a temporary bridge, vowel signs and small marks are not skipped, Canada examples stay practical, and Shahmukhi is awareness only. Native review is deferred.",
  integrationFree: true,
} as const;

const sections: ReadonlyArray<PunjabiConsistencyGuardSection> = [
  {
    focus: "primary_script",
    title_vi: "Gurmukhi là chính",
    title_en: "Gurmukhi Primary",
    purpose_vi: "Chặn nội dung dùng Latin làm nguồn chính thay vì chữ Gurmukhi.",
    purpose_en: "Block content that makes Latin text the main source instead of Gurmukhi script.",
    guards: [
      { id: "pa-guard-primary-001", focus: "primary_script", severity: "blocker", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", guard_vi: "Mỗi mục học phải có Gurmukhi trước phần Latin.", guard_en: "Every learning item must show Gurmukhi before Latin text.", pass_vi: "Gurmukhi xuất hiện trong trường chính và không bị thay bằng romanization.", pass_en: "Gurmukhi appears in the primary field and is not replaced by romanization.", fix_vi: "Chuyển chữ Gurmukhi vào trường chính rồi để romanization thành gợi ý phụ.", fix_en: "Move Gurmukhi into the primary field and keep romanization as a supporting hint.", learnerTrap: { vi: "Latin dễ làm người học bỏ qua chữ thật.", en: "Latin text can make learners skip the real script." }, exportReady: true },
      { id: "pa-guard-primary-002", focus: "primary_script", severity: "warning", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", guard_vi: "Tên ngôn ngữ phải giữ chữ ਪੰਜਾਬੀ khi có giải thích song ngữ.", guard_en: "The language name must keep ਪੰਜਾਬੀ when bilingual explanations appear.", pass_vi: "Có ਪੰਜਾਬੀ, Vietnamese explanation và English explanation trong cùng object.", pass_en: "Includes ਪੰਜਾਬੀ, Vietnamese explanation, and English explanation in the same object.", fix_vi: "Thêm trường Gurmukhi thay vì chỉ để Punjabi bằng Latin.", fix_en: "Add a Gurmukhi field instead of leaving only Latin Punjabi.", learnerTrap: { vi: "Punjab/Punjabi bằng Latin không hiển thị tippi rõ.", en: "Latin Punjab/Punjabi does not clearly show tippi." }, exportReady: true },
      { id: "pa-guard-primary-003", focus: "primary_script", severity: "export", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", guard_vi: "Lệnh đọc trong review phải trỏ về chữ Gurmukhi thật.", guard_en: "Reading prompts in review must point back to real Gurmukhi script.", pass_vi: "Prompt yêu cầu đọc ਪੜ੍ਹੋ hoặc từ Gurmukhi trước khi xem gợi ý.", pass_en: "The prompt asks learners to read ਪੜ੍ਹੋ or another Gurmukhi word before hints.", fix_vi: "Đổi prompt Latin-first thành prompt Gurmukhi-first.", fix_en: "Change any Latin-first prompt into a Gurmukhi-first prompt.", exportReady: true, regression: true },
    ],
  },
  {
    focus: "romanization_bridge_limits",
    title_vi: "Giới hạn romanization",
    title_en: "Romanization Limits",
    purpose_vi: "Giữ romanization là cầu nối ngắn hạn, không phải đáp án chính.",
    purpose_en: "Keep romanization as a short-term bridge, not the main answer.",
    guards: [
      { id: "pa-guard-roman-001", focus: "romanization_bridge_limits", severity: "review", gurmukhi: "ਫਲ", romanization: "phal/fal", guard_vi: "Nếu có phal/fal, phải có bước đọc ਫਲ không cần Latin.", guard_en: "If phal/fal appears, include a step that reads ਫਲ without Latin.", pass_vi: "Bài có hoạt động giảm gợi ý romanization.", pass_en: "The item includes a romanization-reduction activity.", fix_vi: "Thêm lượt thứ hai chỉ hiển thị Gurmukhi.", fix_en: "Add a second round that shows only Gurmukhi.", learnerTrap: { vi: "ph/f thay đổi theo nguồn, chữ ਫ ổn định hơn.", en: "ph/f varies by source, while ਫ is steadier." }, exportReady: true, regression: true },
      { id: "pa-guard-roman-002", focus: "romanization_bridge_limits", severity: "warning", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", guard_vi: "v/w trong romanization không được tạo thành hai mục nghĩa rời.", guard_en: "v/w romanization must not create two separate meaning entries.", pass_vi: "Cả vadda và wadda trỏ về cùng dạng Gurmukhi ਵੱਡਾ.", pass_en: "Both vadda and wadda point back to the same Gurmukhi form ਵੱਡਾ.", fix_vi: "Gộp biến thể Latin và làm rõ Gurmukhi là chuẩn trong app.", fix_en: "Merge Latin variants and clarify that Gurmukhi is the app standard.", learnerTrap: { vi: "Hai cách Latin không luôn là hai từ khác.", en: "Two Latin spellings are not always two different words." }, regression: true },
      { id: "pa-guard-roman-003", focus: "romanization_bridge_limits", severity: "export", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", guard_vi: "Không để shahir/shehar thay thế nhận diện chữ ਸ਼.", guard_en: "Do not let shahir/shehar replace recognition of ਸ਼.", pass_vi: "Mục yêu cầu đọc ਸ਼ਹਿਰ trước khi xem romanization.", pass_en: "The item asks learners to read ਸ਼ਹਿਰ before seeing romanization.", fix_vi: "Đảo thứ tự hiển thị để Gurmukhi xuất hiện trước.", fix_en: "Change display order so Gurmukhi appears first.", exportReady: true },
    ],
  },
  {
    focus: "vowel_sign_awareness",
    title_vi: "Dấu nguyên âm",
    title_en: "Vowel Signs",
    purpose_vi: "Bắt lỗi nội dung bỏ qua dấu nguyên âm hoặc giải thích sai thứ tự đọc.",
    purpose_en: "Catch content that skips vowel signs or explains reading order incorrectly.",
    guards: [
      { id: "pa-guard-vowel-001", focus: "vowel_sign_awareness", severity: "blocker", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", guard_vi: "Cặp ਿ và ੀ phải được giải thích bằng thứ tự đọc thật.", guard_en: "The ਿ and ੀ pair must be explained with real reading order.", pass_vi: "Có ghi chú rằng ਿ viết trước nhưng đọc sau phụ âm.", pass_en: "Includes the note that ਿ is written before but read after the consonant.", fix_vi: "Thêm trap về vị trí viết và thứ tự đọc.", fix_en: "Add a trap about written position and reading order.", learnerTrap: { vi: "Người học hay đọc ਕਿ theo thứ tự mắt nhìn.", en: "Learners often read ਕਿ in visual order." }, exportReady: true },
      { id: "pa-guard-vowel-002", focus: "vowel_sign_awareness", severity: "review", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", guard_vi: "Cặp u ngắn/dài cần có phân biệt dấu dưới phụ âm.", guard_en: "The short/long u pair needs under-letter sign contrast.", pass_vi: "Mục gọi rõ ੁ và ੂ, không chỉ viết ku/kuu.", pass_en: "The item names ੁ and ੂ, not only ku/kuu.", fix_vi: "Thêm ví dụ Gurmukhi với dấu dưới.", fix_en: "Add a Gurmukhi example with under-letter signs.", regression: true },
      { id: "pa-guard-vowel-003", focus: "vowel_sign_awareness", severity: "export", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", guard_vi: "Trước bài biển hiệu phải có kiểm tra e, ai/ae và au.", guard_en: "Before signage work, include an e, ai/ae, and au check.", pass_vi: "Ba dạng này xuất hiện cùng tiêu chí không đổi dấu.", pass_en: "All three forms appear with a criterion against sign swapping.", fix_vi: "Thêm guard regression cho ba dấu này.", fix_en: "Add a regression guard for these three signs.", exportReady: true },
    ],
  },
  {
    focus: "addak_tippi_bindi_awareness",
    title_vi: "Addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi",
    purpose_vi: "Bảo đảm dấu nhỏ được dạy như tín hiệu đọc thật.",
    purpose_en: "Ensure small marks are taught as real reading signals.",
    guards: [
      { id: "pa-guard-mark-001", focus: "addak_tippi_bindi_awareness", severity: "blocker", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", guard_vi: "Nội dung giao thông phải giữ addak trong ਬੱਸ và ਅੱਡਾ.", guard_en: "Transit content must keep addak in ਬੱਸ and ਅੱਡਾ.", pass_vi: "Cả hai từ có ੱ và giải thích không bỏ qua dấu.", pass_en: "Both words include ੱ and explain not to skip the mark.", fix_vi: "Sửa lại chữ Gurmukhi và thêm cảnh báo addak nhỏ.", fix_en: "Correct the Gurmukhi and add a small-addak warning.", learnerTrap: { vi: "Bỏ addak làm mất tín hiệu đọc quan trọng.", en: "Skipping addak loses an important reading signal." }, canadaPractical: true, exportReady: true },
      { id: "pa-guard-mark-002", focus: "addak_tippi_bindi_awareness", severity: "review", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", guard_vi: "Bindi và tippi không được gom thành một ghi chú mơ hồ.", guard_en: "Bindi and tippi must not be collapsed into one vague note.", pass_vi: "Mục phân biệt ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", pass_en: "The item separates ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", fix_vi: "Tách ví dụ hoặc viết rõ từng dấu.", fix_en: "Split the examples or label each mark clearly.", learnerTrap: { vi: "Latin không cho thấy vị trí dấu rõ ràng.", en: "Latin text does not show mark placement clearly." }, regression: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Biển sinh tồn",
    title_en: "Survival Signs",
    purpose_vi: "Giữ biển hiệu ngắn, thực tế và có hành động rõ cho người học ở Canada.",
    purpose_en: "Keep signs short, practical, and tied to clear actions for learners in Canada.",
    guards: [
      { id: "pa-guard-sign-001", focus: "survival_signage", severity: "export", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", guard_vi: "Biển lối ra phải có hành động đi theo biển, không chỉ dịch nghĩa.", guard_en: "The exit sign must include the action of following it, not only a translation.", pass_vi: "Có nghĩa lối ra và tình huống trong tòa nhà.", pass_en: "Includes exit meaning and a building context.", fix_vi: "Thêm tiêu chí hành động tìm lối ra.", fix_en: "Add an action criterion for finding the exit.", canadaPractical: true, exportReady: true },
      { id: "pa-guard-sign-002", focus: "survival_signage", severity: "review", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", guard_vi: "Từ khẩn cấp phải liên kết với bệnh viện hoặc phòng khám.", guard_en: "Emergency wording must link to a hospital or clinic context.", pass_vi: "Có ví dụ nhận diện trong tình huống y tế.", pass_en: "Includes recognition in a health setting.", fix_vi: "Thêm ngữ cảnh phòng khám Canada.", fix_en: "Add a Canadian clinic context.", canadaPractical: true },
      { id: "pa-guard-sign-003", focus: "survival_signage", severity: "warning", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", guard_vi: "Từ mượn pharmacy không được làm mất chữ ਫ.", guard_en: "The pharmacy loanword must not hide ਫ.", pass_vi: "Mục yêu cầu đọc ਫਾਰਮੇਸੀ bằng Gurmukhi trước English.", pass_en: "The item asks learners to read ਫਾਰਮੇਸੀ in Gurmukhi before English.", fix_vi: "Thêm bước đọc chữ trước nghĩa quen.", fix_en: "Add a script-first step before the familiar meaning.", learnerTrap: { vi: "Từ mượn quen dễ làm bỏ qua chữ.", en: "A familiar loanword can make learners skip script." }, canadaPractical: true, regression: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Từ dịch vụ",
    title_en: "Service Vocabulary",
    purpose_vi: "Kiểm tra từ dịch vụ gắn với phòng khám, nhà ở, trường học và giấy tờ.",
    purpose_en: "Check service words tied to clinics, housing, school, and paperwork.",
    guards: [
      { id: "pa-guard-service-001", focus: "service_vocabulary", severity: "review", gurmukhi: "ਦਵਾਈ", romanization: "davai", guard_vi: "Từ thuốc cần có ngữ cảnh hỏi ở pharmacy hoặc clinic.", guard_en: "Medicine vocabulary needs a pharmacy or clinic request context.", pass_vi: "Có nghĩa thuốc và ví dụ dịch vụ thực tế.", pass_en: "Includes medicine meaning and a practical service example.", fix_vi: "Thêm câu hỏi thuốc ngắn trong bối cảnh Canada.", fix_en: "Add a short medicine-request context in Canada.", canadaPractical: true },
      { id: "pa-guard-service-002", focus: "service_vocabulary", severity: "export", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", guard_vi: "Từ tiền thuê phải được kiểm tra trong form nhà ở.", guard_en: "Rent vocabulary must be checked in housing-form context.", pass_vi: "Có nghĩa tiền thuê và bối cảnh thuê nhà.", pass_en: "Includes rent meaning and rental-housing context.", fix_vi: "Thêm ví dụ form hoặc tin thuê nhà.", fix_en: "Add a form or rental listing example.", canadaPractical: true, exportReady: true },
      { id: "pa-guard-service-003", focus: "service_vocabulary", severity: "warning", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", guard_vi: "Loanword trường học vẫn phải đọc bằng Gurmukhi.", guard_en: "The school loanword still must be read through Gurmukhi.", pass_vi: "Có tiêu chí không chỉ dựa vào English.", pass_en: "Includes a criterion against relying only on English.", fix_vi: "Đưa ਸਕੂਲ vào trường Gurmukhi chính.", fix_en: "Put ਸਕੂਲ in the primary Gurmukhi field.", learnerTrap: { vi: "Từ quen trong English vẫn cần guard chữ.", en: "A familiar English word still needs a script guard." }, canadaPractical: true, regression: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    purpose_vi: "Giữ Shahmukhi ở mức nhận biết phạm vi, không chuyển thành khóa học riêng.",
    purpose_en: "Keep Shahmukhi at scope-awareness level, not as a separate course.",
    guards: [
      { id: "pa-guard-shahmukhi-001", focus: "shahmukhi_awareness", severity: "blocker", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", guard_vi: "Mục Shahmukhi phải nói rõ Gurmukhi là chính.", guard_en: "A Shahmukhi item must state that Gurmukhi is primary.", pass_vi: "Nêu Shahmukhi chỉ là awareness, không phải khóa đầy đủ.", pass_en: "Says Shahmukhi is awareness only, not a full course.", fix_vi: "Rút gọn thành ghi chú phạm vi nếu nội dung đi quá sâu.", fix_en: "Reduce it to a scope note if the content goes too deep.", exportReady: true },
    ],
  },
  {
    focus: "quality_regression",
    title_vi: "Quality và regression",
    title_en: "Quality and Regression",
    purpose_vi: "Đóng gói guard cuối cho export, nội dung song ngữ và giới hạn phạm vi.",
    purpose_en: "Package final guards for export, bilingual content, and scope boundaries.",
    guards: [
      { id: "pa-guard-quality-001", focus: "quality_regression", severity: "export", gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim jaanch", guard_vi: "Mỗi guard phải có id, focus, Gurmukhi, giải thích VI/EN và fix rõ.", guard_en: "Every guard needs an id, focus, Gurmukhi, VI/EN explanations, and a clear fix.", pass_vi: "Object TypeScript dùng được trong app và test regression.", pass_en: "The TypeScript object is usable by the app and regression tests.", fix_vi: "Bổ sung trường thiếu thay vì viết ghi chú rời.", fix_en: "Add missing fields instead of writing loose notes.", exportReady: true, regression: true },
      { id: "pa-guard-quality-002", focus: "quality_regression", severity: "blocker", gurmukhi: "ਹੱਦਾਂ", romanization: "haddan", guard_vi: "Không thêm chủ đề ngoài phạm vi Punjabi script/vocabulary.", guard_en: "Do not add topics outside Punjabi script and vocabulary.", pass_vi: "Nội dung chỉ xoay quanh Gurmukhi, từ vựng và guard chất lượng.", pass_en: "Content stays around Gurmukhi, vocabulary, and quality guards.", fix_vi: "Xóa hoặc chuyển phần ngoài phạm vi khỏi dữ liệu này.", fix_en: "Remove or move out-of-scope content out of this data.", exportReady: true, regression: true },
    ],
  },
];

export const PUNJABI_GURMUKHI_CONSISTENCY_GUARDS = sections;

export const PUNJABI_GURMUKHI_CONSISTENCY_GUARD_ITEMS: ReadonlyArray<PunjabiConsistencyGuard> =
  sections.flatMap((section) => section.guards);

export default PUNJABI_GURMUKHI_CONSISTENCY_GUARDS;
