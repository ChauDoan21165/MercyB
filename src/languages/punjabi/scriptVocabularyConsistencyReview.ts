// src/languages/punjabi/scriptVocabularyConsistencyReview.ts
//
// Punjabi script and vocabulary consistency review.
// Native review is deferred.

export type PunjabiConsistencyReviewFocus =
  | "gurmukhi_primary"
  | "romanization_bridge_limits"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_words"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "final_guardrails";

export type PunjabiConsistencyReviewMode = "consistency" | "guardrail" | "readiness" | "regression";

export type PunjabiScriptVocabularyConsistencyReviewItem = {
  id: string;
  focus: PunjabiConsistencyReviewFocus;
  mode: PunjabiConsistencyReviewMode;
  gurmukhi: string;
  romanization?: string;
  review_vi: string;
  review_en: string;
  expected_vi: string;
  expected_en: string;
  fix_vi: string;
  fix_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  appReady?: boolean;
  finalGuardrail?: boolean;
};

export type PunjabiScriptVocabularyConsistencyReviewSection = {
  focus: PunjabiConsistencyReviewFocus;
  title_vi: string;
  title_en: string;
  consistencyGoal_vi: string;
  consistencyGoal_en: string;
  items: ReadonlyArray<PunjabiScriptVocabularyConsistencyReviewItem>;
};

export const PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_SCOPE = {
  vi: "Bộ consistency review này kiểm tra Gurmukhi là chính, romanization chỉ là cầu phụ, dấu nguyên âm và dấu nhỏ được giữ đúng, từ vựng sinh tồn/dịch vụ/động từ/collocation nhất quán, và Shahmukhi chỉ là awareness. Native review được hoãn.",
  en: "This consistency review checks that Gurmukhi stays primary, romanization remains a supporting bridge, vowel signs and small marks are preserved, survival/service/verb/collocation vocabulary stays consistent, and Shahmukhi is awareness only. Native review is deferred.",
  appDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyConsistencyReviewSection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Gurmukhi là chính",
    title_en: "Gurmukhi Primary",
    consistencyGoal_vi: "Kiểm mọi mục từ để chữ Gurmukhi luôn là nguồn chính trước Latin.",
    consistencyGoal_en: "Check every vocabulary item so Gurmukhi remains the primary source before Latin.",
    items: [
      { id: "pa-consistency-gurmukhi-001", focus: "gurmukhi_primary", mode: "guardrail", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", review_vi: "Mục tên ngôn ngữ phải giữ ਪੰਜਾਬੀ làm dạng chính.", review_en: "The language-name item must keep ਪੰਜਾਬੀ as the primary form.", expected_vi: "Có Gurmukhi trước romanization và giải thích VI/EN rõ.", expected_en: "Gurmukhi appears before romanization with clear VI/EN explanations.", fix_vi: "Đưa ਪੰਜਾਬੀ vào trường chính nếu chỉ còn Punjabi Latin.", fix_en: "Put ਪੰਜਾਬੀ in the primary field if only Latin Punjabi remains.", learnerTrap: { vi: "Latin Punjabi không cho thấy tippi.", en: "Latin Punjabi does not show tippi." }, appReady: true, finalGuardrail: true },
      { id: "pa-consistency-gurmukhi-002", focus: "gurmukhi_primary", mode: "consistency", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", review_vi: "Prompt đọc phải bắt đầu bằng chữ Gurmukhi, không bắt đầu bằng Latin.", review_en: "Reading prompts must start with Gurmukhi script, not Latin text.", expected_vi: "Người học đọc ਪੜ੍ਹੋ hoặc từ Gurmukhi trước gợi ý phụ.", expected_en: "Learners read ਪੜ੍ਹੋ or another Gurmukhi word before supporting hints.", fix_vi: "Đảo thứ tự prompt để Gurmukhi xuất hiện đầu tiên.", fix_en: "Reorder the prompt so Gurmukhi appears first.", appReady: true },
      { id: "pa-consistency-gurmukhi-003", focus: "gurmukhi_primary", mode: "readiness", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", review_vi: "Scope note phải nói Gurmukhi là hệ chữ chính của bộ dữ liệu.", review_en: "The scope note must state that Gurmukhi is the primary script of this data set.", expected_vi: "Không có mục chỉ dùng romanization làm đáp án chính.", expected_en: "No item uses romanization as the main answer.", fix_vi: "Thêm trường Gurmukhi và chuyển Latin thành bridge.", fix_en: "Add a Gurmukhi field and make Latin a bridge.", finalGuardrail: true },
    ],
  },
  {
    focus: "romanization_bridge_limits",
    title_vi: "Giới hạn cầu romanization",
    title_en: "Romanization Bridge Limits",
    consistencyGoal_vi: "Giữ romanization hữu ích nhưng không để nó thay thế nhận diện chữ.",
    consistencyGoal_en: "Keep romanization helpful without letting it replace script recognition.",
    items: [
      { id: "pa-consistency-roman-001", focus: "romanization_bridge_limits", mode: "regression", gurmukhi: "ਫਲ", romanization: "phal/fal", review_vi: "phal/fal phải được xem là bridge tạm thời cho ਫਲ.", review_en: "phal/fal must be treated as a temporary bridge for ਫਲ.", expected_vi: "Có bước cuối chỉ hiển thị Gurmukhi.", expected_en: "A final step shows only Gurmukhi.", fix_vi: "Thêm lượt ẩn romanization sau lượt hướng dẫn.", fix_en: "Add a round that hides romanization after guided review.", learnerTrap: { vi: "ph/f thay đổi theo nguồn, chữ ਫ ổn định hơn.", en: "ph/f varies by source, while ਫ is steadier." }, finalGuardrail: true },
      { id: "pa-consistency-roman-002", focus: "romanization_bridge_limits", mode: "consistency", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", review_vi: "vadda/wadda không được tạo hai mục nghĩa riêng.", review_en: "vadda/wadda must not create two separate meaning entries.", expected_vi: "Cả hai biến thể Latin trỏ về cùng Gurmukhi ਵੱਡਾ.", expected_en: "Both Latin variants point to the same Gurmukhi ਵੱਡਾ.", fix_vi: "Gộp biến thể Latin và giữ Gurmukhi làm khóa chính.", fix_en: "Merge Latin variants and keep Gurmukhi as the main key.", learnerTrap: { vi: "Hai spelling Latin không luôn là hai từ.", en: "Two Latin spellings are not always two words." }, appReady: true },
      { id: "pa-consistency-roman-003", focus: "romanization_bridge_limits", mode: "readiness", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", review_vi: "shahir/shehar chỉ hỗ trợ sau khi người học nhìn ਸ਼ਹਿਰ.", review_en: "shahir/shehar only supports after the learner sees ਸ਼ਹਿਰ.", expected_vi: "Mục kiểm chữ ਸ਼ trước biến thể Latin.", expected_en: "The item checks ਸ਼ before Latin variants.", fix_vi: "Đặt ਸ਼ਹਿਰ trước romanization và thêm trap dấu dưới.", fix_en: "Place ਸ਼ਹਿਰ before romanization and add the lower-mark trap.", learnerTrap: { vi: "Dấu dưới phân biệt ਸ਼ với ਸ.", en: "The lower mark separates ਸ਼ from ਸ." }, finalGuardrail: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Dấu nguyên âm",
    title_en: "Vowel Signs",
    consistencyGoal_vi: "Đảm bảo romanization không che mất dấu nguyên âm hoặc thứ tự đọc.",
    consistencyGoal_en: "Ensure romanization does not hide vowel signs or reading order.",
    items: [
      { id: "pa-consistency-vowel-001", focus: "vowel_signs", mode: "guardrail", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", review_vi: "Cặp i ngắn/dài phải được kiểm bằng dấu Gurmukhi.", review_en: "The short/long i pair must be checked through Gurmukhi signs.", expected_vi: "Có ghi chú ਿ viết trước nhưng đọc sau phụ âm.", expected_en: "Includes the note that ਿ is written before but read after the consonant.", fix_vi: "Thêm cảnh báo không đọc theo thứ tự mắt nhìn.", fix_en: "Add a warning not to read by visual order.", learnerTrap: { vi: "ਕਿ dễ bị đọc như ik nếu theo mắt nhìn.", en: "ਕਿ can be misread as ik by visual order." }, finalGuardrail: true },
      { id: "pa-consistency-vowel-002", focus: "vowel_signs", mode: "consistency", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", review_vi: "Cặp u ngắn/dài phải nêu rõ ੁ và ੂ.", review_en: "The short/long u pair must explicitly show ੁ and ੂ.", expected_vi: "Người học phân biệt dấu dưới trước khi đọc nhanh.", expected_en: "Learners separate the under-letter signs before fast reading.", fix_vi: "Thêm so sánh dấu dưới chữ trong tiêu chí.", fix_en: "Add under-letter sign comparison to the criteria.", appReady: true },
      { id: "pa-consistency-vowel-003", focus: "vowel_signs", mode: "regression", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", review_vi: "Ba dấu e, ai/ae, au cần giữ nhất quán trước bài signage.", review_en: "The e, ai/ae, and au signs need consistency before signage work.", expected_vi: "Không đổi dấu khi chuyển sang biển thực tế.", expected_en: "Does not swap signs when moving into real signs.", fix_vi: "Thêm regression ngắn cho ba dạng này.", fix_en: "Add a short regression for these three forms.", finalGuardrail: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi",
    consistencyGoal_vi: "Kiểm dấu nhỏ như tín hiệu đọc thật, không phải trang trí.",
    consistencyGoal_en: "Check small marks as real reading signals, not decoration.",
    items: [
      { id: "pa-consistency-mark-001", focus: "addak_tippi_bindi", mode: "guardrail", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", review_vi: "Từ giao thông phải giữ addak trong ਬੱਸ và ਅੱਡਾ.", review_en: "Transit words must keep addak in ਬੱਸ and ਅੱਡਾ.", expected_vi: "Cả hai từ có ੱ và giải thích ngắn về addak.", expected_en: "Both words include ੱ and a short addak explanation.", fix_vi: "Sửa chữ thiếu addak và thêm learner trap.", fix_en: "Correct missing addak and add a learner trap.", learnerTrap: { vi: "Addak nhỏ nhưng không được bỏ qua.", en: "Addak is small but should not be skipped." }, canadaPractical: true, finalGuardrail: true },
      { id: "pa-consistency-mark-002", focus: "addak_tippi_bindi", mode: "regression", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", review_vi: "Bindi trong ਮਾਂ và tippi trong ਪੰਜਾਬ phải được phân biệt.", review_en: "Bindi in ਮਾਂ and tippi in ਪੰਜਾਬ must be separated.", expected_vi: "Có nhãn cho ਂ và ੰ thay vì ghi chú mơ hồ.", expected_en: "Labels ਂ and ੰ instead of using a vague note.", fix_vi: "Tách ví dụ hoặc thêm nhãn từng dấu.", fix_en: "Split examples or add a label for each mark.", learnerTrap: { vi: "Latin không hiển thị vị trí dấu rõ.", en: "Latin text does not show mark placement clearly." }, appReady: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Biển sinh tồn",
    title_en: "Survival Signage",
    consistencyGoal_vi: "Giữ biển ngắn, Gurmukhi-first và gắn với hành động thực tế ở Canada.",
    consistencyGoal_en: "Keep signs short, Gurmukhi-first, and tied to practical actions in Canada.",
    items: [
      { id: "pa-consistency-sign-001", focus: "survival_signage", mode: "readiness", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", review_vi: "Biển lối ra cần hành động theo biển, không chỉ dịch nghĩa.", review_en: "The exit sign needs an action of following the sign, not only translation.", expected_vi: "Người học biết tìm lối ra khi thấy ਨਿਕਾਸ.", expected_en: "Learners know to find the exit when seeing ਨਿਕਾਸ.", fix_vi: "Thêm Canada-practical action vào expected result.", fix_en: "Add a Canada-practical action to the expected result.", canadaPractical: true, appReady: true },
      { id: "pa-consistency-sign-002", focus: "survival_signage", mode: "consistency", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", review_vi: "Loanword emergency vẫn cần nhận diện bằng Gurmukhi.", review_en: "The emergency loanword still needs Gurmukhi recognition.", expected_vi: "Có ngữ cảnh bệnh viện hoặc clinic và chữ ਐਮਰਜੈਂਸੀ.", expected_en: "Includes a hospital or clinic context and ਐਮਰਜੈਂਸੀ.", fix_vi: "Đưa Gurmukhi trước nghĩa English quen thuộc.", fix_en: "Place Gurmukhi before the familiar English meaning.", canadaPractical: true },
      { id: "pa-consistency-sign-003", focus: "survival_signage", mode: "regression", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", review_vi: "pharmacy/farmacy không được thay thế việc đọc ਫਾਰਮੇਸੀ.", review_en: "pharmacy/farmacy must not replace reading ਫਾਰਮੇਸੀ.", expected_vi: "Mục yêu cầu nhận ra ਫ trước khi dùng nghĩa quen.", expected_en: "The item asks learners to recognize ਫ before using the familiar meaning.", fix_vi: "Thêm bước script-first cho biển nhà thuốc.", fix_en: "Add a script-first step for the pharmacy sign.", learnerTrap: { vi: "Từ mượn quen dễ làm bỏ qua chữ.", en: "A familiar loanword can make learners skip script." }, canadaPractical: true, finalGuardrail: true },
    ],
  },
  {
    focus: "service_words",
    title_vi: "Từ dịch vụ",
    title_en: "Service Words",
    consistencyGoal_vi: "Kiểm từ phòng khám, nhà ở, trường học và giấy tờ ở dạng Gurmukhi.",
    consistencyGoal_en: "Check clinic, housing, school, and paperwork words in Gurmukhi form.",
    items: [
      { id: "pa-consistency-service-001", focus: "service_words", mode: "consistency", gurmukhi: "ਦਵਾਈ", romanization: "davai", review_vi: "Từ thuốc phải gắn với tình huống hỏi ở pharmacy hoặc clinic.", review_en: "Medicine vocabulary must connect to a pharmacy or clinic request.", expected_vi: "Có ਦਵਾਈ, nghĩa thuốc, và giải thích VI/EN.", expected_en: "Includes ਦਵਾਈ, medicine meaning, and VI/EN explanation.", fix_vi: "Thêm ví dụ dịch vụ Canada nếu mục chỉ có nghĩa rời.", fix_en: "Add a Canadian service example if the item only has isolated meaning.", canadaPractical: true },
      { id: "pa-consistency-service-002", focus: "service_words", mode: "readiness", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", review_vi: "Từ tiền thuê cần nhất quán trong bối cảnh form nhà ở.", review_en: "Rent vocabulary needs consistency in housing-form context.", expected_vi: "Có ਕਿਰਾਇਆ và nghĩa tiền thuê trong ngữ cảnh nhà ở.", expected_en: "Includes ਕਿਰਾਇਆ and rent meaning in housing context.", fix_vi: "Thêm context form hoặc tin thuê nhà.", fix_en: "Add a form or rental-notice context.", canadaPractical: true, appReady: true },
      { id: "pa-consistency-service-003", focus: "service_words", mode: "regression", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", review_vi: "Loanword school/skul phải giữ ਸਕੂਲ ở trường chính.", review_en: "The school/skul loanword must keep ਸਕੂਲ in the primary field.", expected_vi: "English là nghĩa phụ, không thay chữ Gurmukhi.", expected_en: "English is supporting meaning, not a replacement for Gurmukhi.", fix_vi: "Đưa ਸਕੂਲ lên trước nếu mục bắt đầu bằng school.", fix_en: "Move ਸਕੂਲ first if the item starts with school.", learnerTrap: { vi: "Từ quen ở Canada vẫn cần đọc Gurmukhi.", en: "A familiar Canadian word still needs Gurmukhi reading." }, canadaPractical: true, finalGuardrail: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Động từ tần suất cao",
    title_en: "High-Frequency Verbs",
    consistencyGoal_vi: "Đảm bảo động từ lõi xuất hiện trong cụm hành động, không học rời.",
    consistencyGoal_en: "Ensure core verbs appear in action chunks, not only as isolated forms.",
    items: [
      { id: "pa-consistency-verb-001", focus: "high_frequency_verbs", mode: "consistency", gurmukhi: "ਕਰਨਾ", romanization: "karna", review_vi: "ਕਰਨਾ cần được kiểm trong cụm việc làm/hành động.", review_en: "ਕਰਨਾ needs checking inside do/make action chunks.", expected_vi: "Có ví dụ ghép với danh từ hoặc giấy tờ.", expected_en: "Includes an example combined with a noun or paperwork.", fix_vi: "Thêm cụm hành động thay vì chỉ giữ động từ rời.", fix_en: "Add an action chunk instead of keeping only the isolated verb." },
      { id: "pa-consistency-verb-002", focus: "high_frequency_verbs", mode: "readiness", gurmukhi: "ਲੈਣਾ", romanization: "laina", review_vi: "ਲੈਣਾ phải nhất quán trong ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ.", review_en: "ਲੈਣਾ must stay consistent in ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ.", expected_vi: "Hiểu cụm này như đặt/lấy lịch ở clinic.", expected_en: "Understands this chunk as booking/taking an appointment at a clinic.", fix_vi: "Thêm context clinic Canada nếu chỉ có nghĩa lấy.", fix_en: "Add Canadian clinic context if only take is listed.", canadaPractical: true, appReady: true },
      { id: "pa-consistency-verb-003", focus: "high_frequency_verbs", mode: "guardrail", gurmukhi: "ਸਮਝਣਾ", romanization: "samajhna", review_vi: "ਸਮਝਣਾ cần liên kết với câu báo chưa hiểu.", review_en: "ਸਮਝਣਾ needs linking to a sentence for not understanding.", expected_vi: "Có ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ như câu hỗ trợ.", expected_en: "Includes ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ as a support sentence.", fix_vi: "Thêm câu đầy đủ để tránh học động từ rời.", fix_en: "Add the full sentence to avoid isolated verb study.", canadaPractical: true, finalGuardrail: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Collocation",
    title_en: "Collocations",
    consistencyGoal_vi: "Kiểm cụm cố định như đơn vị nghĩa cho tình huống dịch vụ.",
    consistencyGoal_en: "Check fixed chunks as meaning units for service situations.",
    items: [
      { id: "pa-consistency-collocation-001", focus: "collocations", mode: "readiness", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", review_vi: "Câu cần giúp đỡ phải giữ nguyên cụm Gurmukhi đầy đủ.", review_en: "The help-needed sentence must keep the full Gurmukhi chunk.", expected_vi: "Người học dùng được câu này khi hỏi nhân viên dịch vụ.", expected_en: "Learners can use this sentence when asking service staff.", fix_vi: "Khôi phục cụm đầy đủ nếu chỉ còn ਮਦਦ.", fix_en: "Restore the full chunk if only ਮਦਦ remains.", canadaPractical: true, appReady: true },
      { id: "pa-consistency-collocation-002", focus: "collocations", mode: "consistency", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", review_vi: "ਫਾਰਮ ਭਰਨਾ phải được đọc như hành động điền form.", review_en: "ਫਾਰਮ ਭਰਨਾ must be read as the action of filling out a form.", expected_vi: "Có context giấy tờ trường học, clinic hoặc dịch vụ.", expected_en: "Includes school, clinic, or service paperwork context.", fix_vi: "Thêm context giấy tờ nếu chỉ dịch từng từ.", fix_en: "Add paperwork context if the item only translates word by word.", canadaPractical: true },
      { id: "pa-consistency-collocation-003", focus: "collocations", mode: "regression", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", review_vi: "Cụm sửa lỗi phải giữ chữ ਠ và meaning sửa lỗi.", review_en: "The correction chunk must keep ਠ and the meaning of correcting a mistake.", expected_vi: "Không đọc ਠ như English th.", expected_en: "Does not read ਠ as English th.", fix_vi: "Thêm trap về ਠ nếu romanization gây nhầm.", fix_en: "Add a trap for ਠ if romanization causes confusion.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true, finalGuardrail: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    consistencyGoal_vi: "Giữ Shahmukhi là awareness phạm vi, không phát triển thành khóa riêng.",
    consistencyGoal_en: "Keep Shahmukhi as scope awareness, not a separate course.",
    items: [
      { id: "pa-consistency-shahmukhi-001", focus: "shahmukhi_awareness", mode: "guardrail", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", review_vi: "Mọi nhắc tới Shahmukhi phải xác nhận Gurmukhi là chính.", review_en: "Every Shahmukhi mention must confirm that Gurmukhi is primary.", expected_vi: "Shahmukhi chỉ là awareness, không phải khóa đầy đủ.", expected_en: "Shahmukhi is awareness only, not a full course.", fix_vi: "Rút phần Shahmukhi sâu thành ghi chú phạm vi.", fix_en: "Reduce deep Shahmukhi content into a scope note.", finalGuardrail: true },
    ],
  },
  {
    focus: "final_guardrails",
    title_vi: "Guardrail cuối",
    title_en: "Final Guardrails",
    consistencyGoal_vi: "Đóng gói kiểm tra cuối cho dữ liệu TypeScript, song ngữ và app-ready.",
    consistencyGoal_en: "Package final checks for TypeScript data, bilingual text, and app readiness.",
    items: [
      { id: "pa-consistency-final-001", focus: "final_guardrails", mode: "readiness", gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim jaanch", review_vi: "Mỗi item cần id, focus, mode, Gurmukhi, VI/EN và fix rõ.", review_en: "Every item needs id, focus, mode, Gurmukhi, VI/EN text, and a clear fix.", expected_vi: "Dữ liệu dùng được trong app, không phải ghi chú rời.", expected_en: "Data is app-consumable, not loose notes.", fix_vi: "Bổ sung trường thiếu trước khi export.", fix_en: "Add missing fields before export.", appReady: true, finalGuardrail: true },
      { id: "pa-consistency-final-002", focus: "final_guardrails", mode: "regression", gurmukhi: "ਮੁੜ ਸਮੀਖਿਆ", romanization: "mur samikhia", review_vi: "Regression phải bắt Latin-first, dấu thiếu, trap thiếu và scope drift.", review_en: "Regression must catch Latin-first order, missing marks, missing traps, and scope drift.", expected_vi: "Nội dung chỉ xoay quanh Punjabi script và vocabulary.", expected_en: "Content stays within Punjabi script and vocabulary.", fix_vi: "Sửa item sai phạm vi thay vì mở rộng sang chủ đề khác.", fix_en: "Repair out-of-scope items instead of expanding into another topic.", finalGuardrail: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW = sections;

export const PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW_ITEMS: ReadonlyArray<PunjabiScriptVocabularyConsistencyReviewItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_VOCABULARY_CONSISTENCY_REVIEW;
