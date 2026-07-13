// src/languages/punjabi/scriptVocabularyFinalSelectors.ts
//
// Punjabi script/vocabulary final selector data for later app integration.
// Native review is deferred.

export type PunjabiFinalSelectorFocus =
  | "reading_ladder"
  | "vocabulary_deck"
  | "search_glossary"
  | "script_drills"
  | "romanization_boundaries"
  | "survival_signage"
  | "service_vocabulary"
  | "shahmukhi_awareness"
  | "final_readiness";

export type PunjabiFinalSelectorUse = "selector" | "pre_integration" | "final_readiness" | "regression";

export type PunjabiScriptVocabularyFinalSelector = {
  cell_id?: string;
  id: string;
  focus: PunjabiFinalSelectorFocus;
  use: PunjabiFinalSelectorUse;
  gurmukhi: string;
  romanization?: string;
  selector_vi: string;
  selector_en: string;
  includeWhen_vi: string;
  includeWhen_en: string;
  readinessCheck_vi: string;
  readinessCheck_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  preIntegration?: boolean;
  finalReady?: boolean;
};

export type PunjabiScriptVocabularyFinalSelectorSection = {
  cell_id?: string;
  focus: PunjabiFinalSelectorFocus;
  title_vi: string;
  title_en: string;
  selectorGoal_vi: string;
  selectorGoal_en: string;
  selectors: ReadonlyArray<PunjabiScriptVocabularyFinalSelector>;
};

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS_SCOPE = {
  vi: "Bộ selector này chọn dữ liệu Punjabi script/vocabulary cho tích hợp sau: Gurmukhi reading ladder, vocabulary deck, search glossary, script drills, romanization boundaries, survival signage, service vocabulary và Shahmukhi awareness. Đây chỉ là dữ liệu TypeScript app-consumable; native review được hoãn.",
  en: "This selector set chooses Punjabi script/vocabulary data for later integration: Gurmukhi reading ladder, vocabulary deck, search glossary, script drills, romanization boundaries, survival signage, service vocabulary, and Shahmukhi awareness. This is app-consumable TypeScript data only; native review is deferred.",
  selectorDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyFinalSelectorSection> = [
  {
    focus: "reading_ladder",
    title_vi: "Reading ladder",
    title_en: "Reading Ladder",
    selectorGoal_vi: "Chọn mục đọc Gurmukhi theo độ khó tăng dần trước khi người học vào từ vựng thật.",
    selectorGoal_en: "Select Gurmukhi reading items by rising difficulty before learners enter real vocabulary.",
    selectors: [
      { id: "pa-selector-ladder-001", focus: "reading_ladder", use: "selector", gurmukhi: "ਕ / ਖ", romanization: "k / kh", selector_vi: "Chọn cặp chữ bật hơi để kiểm nền phụ âm.", selector_en: "Select the aspirated pair to check consonant foundation.", includeWhen_vi: "Dùng khi người học cần phân biệt một chữ Gurmukhi với romanization hai ký tự.", includeWhen_en: "Use when learners need to separate one Gurmukhi letter from two Latin characters.", readinessCheck_vi: "Người học nhận ra ਖ là một chữ, không phải k cộng h.", readinessCheck_en: "Learner recognizes ਖ as one letter, not k plus h.", learnerTrap: { vi: "kh trong Latin dễ gây hiểu nhầm.", en: "Latin kh can mislead learners." }, preIntegration: true },
      { id: "pa-selector-ladder-002", focus: "reading_ladder", use: "final_readiness", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", selector_vi: "Chọn cặp i ngắn/dài cho boundary dấu nguyên âm.", selector_en: "Select the short/long i pair for vowel-sign boundary work.", includeWhen_vi: "Dùng trước các mục có dấu ਿ viết trước phụ âm.", includeWhen_en: "Use before items with ਿ written before the consonant.", readinessCheck_vi: "Có ghi chú viết trước nhưng đọc sau phụ âm.", readinessCheck_en: "Includes the written-before but read-after-consonant note.", learnerTrap: { vi: "Thứ tự nhìn không phải thứ tự đọc.", en: "Visual order is not reading order." }, finalReady: true },
      { id: "pa-selector-ladder-003", focus: "reading_ladder", use: "regression", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", selector_vi: "Chọn ba dấu để kiểm không đổi dấu khi đọc nhanh.", selector_en: "Select three signs to check that fast reading does not swap marks.", includeWhen_vi: "Dùng trước survival signage hoặc service vocabulary.", includeWhen_en: "Use before survival signage or service vocabulary.", readinessCheck_vi: "Người học phân biệt e, ai/ae và au.", readinessCheck_en: "Learner separates e, ai/ae, and au.", finalReady: true },
    ],
  },
  {
    focus: "vocabulary_deck",
    title_vi: "Vocabulary deck",
    title_en: "Vocabulary Deck",
    selectorGoal_vi: "Chọn từ vựng Gurmukhi cốt lõi có thể tái dùng trong bài signage và service.",
    selectorGoal_en: "Select core Gurmukhi vocabulary reusable in signage and service lessons.",
    selectors: [
      { id: "pa-selector-vocab-001", focus: "vocabulary_deck", use: "selector", gurmukhi: "ਦਵਾਈ", romanization: "davai", selector_vi: "Chọn từ thuốc cho health/service deck.", selector_en: "Select medicine for the health/service deck.", includeWhen_vi: "Dùng khi bài cần từ phòng khám hoặc nhà thuốc ở Canada.", includeWhen_en: "Use when a lesson needs clinic or pharmacy vocabulary in Canada.", readinessCheck_vi: "Có nghĩa thuốc bằng Vietnamese và English.", readinessCheck_en: "Includes medicine meaning in Vietnamese and English.", canadaPractical: true, preIntegration: true },
      { id: "pa-selector-vocab-002", focus: "vocabulary_deck", use: "final_readiness", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", selector_vi: "Chọn từ tiền thuê cho housing/service context.", selector_en: "Select rent for housing/service context.", includeWhen_vi: "Dùng khi bài có form nhà ở hoặc tin thuê nhà.", includeWhen_en: "Use when a lesson has a housing form or rental notice.", readinessCheck_vi: "Giữ Gurmukhi chính và giải thích tiền thuê rõ.", readinessCheck_en: "Keeps Gurmukhi primary and explains rent clearly.", canadaPractical: true, finalReady: true },
      { id: "pa-selector-vocab-003", focus: "vocabulary_deck", use: "regression", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", selector_vi: "Chọn loanword school để kiểm Gurmukhi-first.", selector_en: "Select the school loanword to check Gurmukhi-first handling.", includeWhen_vi: "Dùng khi cần ví dụ trường học quen nhưng vẫn đọc script.", includeWhen_en: "Use when a familiar school example still needs script reading.", readinessCheck_vi: "English chỉ là meaning phụ, không thay ਸਕੂਲ.", readinessCheck_en: "English is supporting meaning, not a replacement for ਸਕੂਲ.", learnerTrap: { vi: "Từ quen dễ làm bỏ qua chữ Gurmukhi.", en: "A familiar word can make learners skip Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    focus: "search_glossary",
    title_vi: "Search glossary",
    title_en: "Search Glossary",
    selectorGoal_vi: "Chọn mục glossary giúp tìm bằng Gurmukhi và biến thể romanization có kiểm soát.",
    selectorGoal_en: "Select glossary items searchable by Gurmukhi and controlled romanization variants.",
    selectors: [
      { id: "pa-selector-glossary-001", focus: "search_glossary", use: "selector", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", selector_vi: "Chọn tên ngôn ngữ để search không mất tippi awareness.", selector_en: "Select the language name so search does not lose tippi awareness.", includeWhen_vi: "Dùng khi glossary hỗ trợ cả Punjabi và Panjabi.", includeWhen_en: "Use when glossary supports both Punjabi and Panjabi.", readinessCheck_vi: "Cả hai Latin variants trỏ về ਪੰਜਾਬੀ.", readinessCheck_en: "Both Latin variants point back to ਪੰਜਾਬੀ.", learnerTrap: { vi: "Latin không hiện rõ tippi.", en: "Latin does not show tippi clearly." }, preIntegration: true },
      { id: "pa-selector-glossary-002", focus: "search_glossary", use: "regression", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", selector_vi: "Chọn mục v/w để kiểm variants không tách nghĩa.", selector_en: "Select the v/w item to check variants do not split meaning.", includeWhen_vi: "Dùng khi search chấp nhận nhiều romanization.", includeWhen_en: "Use when search accepts multiple romanizations.", readinessCheck_vi: "vadda và wadda cùng trả về ਵੱਡਾ.", readinessCheck_en: "vadda and wadda both return ਵੱਡਾ.", learnerTrap: { vi: "Hai spelling Latin không luôn là hai từ.", en: "Two Latin spellings are not always two words." }, finalReady: true },
    ],
  },
  {
    focus: "script_drills",
    title_vi: "Script drills",
    title_en: "Script Drills",
    selectorGoal_vi: "Chọn drill ngắn để giữ dấu chữ và dấu nhỏ ổn định trước tích hợp.",
    selectorGoal_en: "Select short drills that keep letters and small marks stable before integration.",
    selectors: [
      { id: "pa-selector-drill-001", focus: "script_drills", use: "selector", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", selector_vi: "Chọn drill addak giao thông cho kiểm dấu nhỏ.", selector_en: "Select the transit addak drill for small-mark checking.", includeWhen_vi: "Dùng khi bài có transit hoặc biển trạm xe buýt.", includeWhen_en: "Use when a lesson has transit or bus-stop signage.", readinessCheck_vi: "Cả ਬੱਸ và ਅੱਡਾ giữ ੱ trong Gurmukhi.", readinessCheck_en: "Both ਬੱਸ and ਅੱਡਾ keep ੱ in Gurmukhi.", learnerTrap: { vi: "Addak nhỏ nhưng không được bỏ qua.", en: "Addak is small but should not be skipped." }, canadaPractical: true, finalReady: true },
      { id: "pa-selector-drill-002", focus: "script_drills", use: "regression", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", selector_vi: "Chọn drill phân biệt bindi và tippi.", selector_en: "Select the drill separating bindi and tippi.", includeWhen_vi: "Dùng khi mục có dấu nasal hoặc tên Punjab.", includeWhen_en: "Use when an item has nasal marks or the name Punjab.", readinessCheck_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", readinessCheck_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", learnerTrap: { vi: "Romanization không cho thấy vị trí dấu rõ.", en: "Romanization does not show mark placement clearly." }, preIntegration: true },
    ],
  },
  {
    focus: "romanization_boundaries",
    title_vi: "Romanization boundaries",
    title_en: "Romanization Boundaries",
    selectorGoal_vi: "Chọn dữ liệu boundary để romanization là cầu phụ, không phải nguồn chính.",
    selectorGoal_en: "Select boundary data so romanization is a supporting bridge, not the main source.",
    selectors: [
      { id: "pa-selector-roman-001", focus: "romanization_boundaries", use: "final_readiness", gurmukhi: "ਫਲ", romanization: "phal/fal", selector_vi: "Chọn boundary ph/f để ẩn romanization ở lượt cuối.", selector_en: "Select the ph/f boundary so romanization is hidden in the final round.", includeWhen_vi: "Dùng khi bài có biến thể ph/f hoặc loan spelling.", includeWhen_en: "Use when a lesson has ph/f variants or loan spelling.", readinessCheck_vi: "Lượt cuối chỉ hiện ਫਲ bằng Gurmukhi.", readinessCheck_en: "The final round shows only ਫਲ.", learnerTrap: { vi: "ਫ là anchor, ph/f chỉ là bridge.", en: "ਫ is the anchor; ph/f is only a bridge." }, finalReady: true },
      { id: "pa-selector-roman-002", focus: "romanization_boundaries", use: "regression", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", selector_vi: "Chọn boundary sh để kiểm chữ ਸ਼ trước Latin.", selector_en: "Select the sh boundary to check ਸ਼ before Latin.", includeWhen_vi: "Dùng khi có variant shahir/shehar.", includeWhen_en: "Use when shahir/shehar variants appear.", readinessCheck_vi: "Người học nhận ra ਸ਼ bằng dấu dưới.", readinessCheck_en: "Learner recognizes ਸ਼ by the lower mark.", learnerTrap: { vi: "Dấu dưới phân biệt ਸ਼ với ਸ.", en: "The lower mark separates ਸ਼ from ਸ." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Survival signage",
    title_en: "Survival Signage",
    selectorGoal_vi: "Chọn biển Gurmukhi ngắn có hành động thực tế ở Canada.",
    selectorGoal_en: "Select short Gurmukhi signs with practical actions in Canada.",
    selectors: [
      { id: "pa-selector-sign-001", focus: "survival_signage", use: "selector", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", selector_vi: "Chọn biển lối ra cho deck sinh tồn.", selector_en: "Select the exit sign for the survival deck.", includeWhen_vi: "Dùng trong tình huống tòa nhà, trường học hoặc clinic.", includeWhen_en: "Use in building, school, or clinic contexts.", readinessCheck_vi: "Người học biết đi theo biển để tìm lối ra.", readinessCheck_en: "Learner knows to follow the sign to find the exit.", canadaPractical: true, finalReady: true },
      { id: "pa-selector-sign-002", focus: "survival_signage", use: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", selector_vi: "Chọn biển emergency nhưng vẫn Gurmukhi-first.", selector_en: "Select the emergency sign while staying Gurmukhi-first.", includeWhen_vi: "Dùng trong bối cảnh bệnh viện hoặc clinic.", includeWhen_en: "Use in hospital or clinic contexts.", readinessCheck_vi: "Có chữ ਐਮਰਜੈਂਸੀ trước meaning English.", readinessCheck_en: "Shows ਐਮਰਜੈਂਸੀ before the English meaning.", canadaPractical: true, preIntegration: true },
      { id: "pa-selector-sign-003", focus: "survival_signage", use: "regression", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", selector_vi: "Chọn biển nhà thuốc để kiểm loanword không che chữ.", selector_en: "Select the pharmacy sign to check the loanword does not hide script.", includeWhen_vi: "Dùng khi lesson cần tìm nhà thuốc.", includeWhen_en: "Use when a lesson needs finding a pharmacy.", readinessCheck_vi: "Người học nhận ra ਫਾਰਮੇਸੀ trước pharmacy.", readinessCheck_en: "Learner recognizes ਫਾਰਮੇਸੀ before pharmacy.", learnerTrap: { vi: "Từ mượn quen dễ làm đọc lướt.", en: "A familiar loanword can cause skim reading." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Service vocabulary",
    title_en: "Service Vocabulary",
    selectorGoal_vi: "Chọn từ và cụm dịch vụ Canada-practical để chuẩn bị tích hợp sau.",
    selectorGoal_en: "Select Canada-practical service words and chunks for later integration.",
    selectors: [
      { id: "pa-selector-service-001", focus: "service_vocabulary", use: "selector", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", selector_vi: "Chọn cụm điền form cho service workflow.", selector_en: "Select the fill-out-a-form chunk for service workflows.", includeWhen_vi: "Dùng trong giấy tờ trường học, clinic hoặc housing.", includeWhen_en: "Use in school, clinic, or housing paperwork.", readinessCheck_vi: "Cụm được đọc như một hành động, không tách từng từ.", readinessCheck_en: "The chunk is read as one action, not separated word by word.", canadaPractical: true, finalReady: true },
      { id: "pa-selector-service-002", focus: "service_vocabulary", use: "pre_integration", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", selector_vi: "Chọn cụm đặt lịch cho clinic/service flow.", selector_en: "Select the appointment-booking chunk for clinic/service flow.", includeWhen_vi: "Dùng khi bài có đặt lịch ở phòng khám.", includeWhen_en: "Use when a lesson has booking a clinic appointment.", readinessCheck_vi: "ਲੈਣਾ được hiểu trong cụm đặt/lấy lịch.", readinessCheck_en: "ਲੈਣਾ is understood in the book/take appointment chunk.", canadaPractical: true, preIntegration: true },
      { id: "pa-selector-service-003", focus: "service_vocabulary", use: "regression", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", selector_vi: "Chọn câu cần giúp đỡ cho support phrase.", selector_en: "Select the I-need-help sentence for support phrases.", includeWhen_vi: "Dùng khi người học cần hỏi nhân viên dịch vụ.", includeWhen_en: "Use when learners need to ask service staff.", readinessCheck_vi: "Câu đầy đủ được giữ, không chỉ còn ਮਦਦ.", readinessCheck_en: "The full sentence is kept, not only ਮਦਦ.", canadaPractical: true, finalReady: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Shahmukhi awareness",
    title_en: "Shahmukhi Awareness",
    selectorGoal_vi: "Chọn một mục awareness để giữ phạm vi Shahmukhi rõ ràng.",
    selectorGoal_en: "Select one awareness item to keep Shahmukhi scope clear.",
    selectors: [
      { id: "pa-selector-shahmukhi-001", focus: "shahmukhi_awareness", use: "final_readiness", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", selector_vi: "Chọn note nói Gurmukhi là chính; Shahmukhi chỉ awareness.", selector_en: "Select the note saying Gurmukhi is primary and Shahmukhi is awareness only.", includeWhen_vi: "Dùng khi cần nhắc phạm vi trước tích hợp sau.", includeWhen_en: "Use when scope needs stating before later integration.", readinessCheck_vi: "Không biến thành khóa Shahmukhi đầy đủ.", readinessCheck_en: "Does not become a full Shahmukhi course.", finalReady: true },
    ],
  },
  {
    focus: "final_readiness",
    title_vi: "Final readiness",
    title_en: "Final Readiness",
    selectorGoal_vi: "Chọn guard cuối để dữ liệu sẵn sàng cho bước tích hợp sau mà chưa tích hợp.",
    selectorGoal_en: "Select final guards so data is ready for a later integration step without integrating now.",
    selectors: [
      { id: "pa-selector-final-001", focus: "final_readiness", use: "final_readiness", gurmukhi: "ਅੰਤਿਮ ਚੋਣ", romanization: "antim chon", selector_vi: "Chọn checklist cuối cho id, focus, Gurmukhi, VI/EN và readiness.", selector_en: "Select the final checklist for id, focus, Gurmukhi, VI/EN, and readiness.", includeWhen_vi: "Dùng trước khi module được xuất sang integration ở bước khác.", includeWhen_en: "Use before the module is handed to integration in another step.", readinessCheck_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", readinessCheck_en: "Data is consumable TypeScript, not loose notes.", preIntegration: true, finalReady: true },
      { id: "pa-selector-final-002", focus: "final_readiness", use: "regression", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", selector_vi: "Chọn regression để bắt Latin-first, thiếu dấu và scope drift.", selector_en: "Select regression to catch Latin-first order, missing marks, and scope drift.", includeWhen_vi: "Dùng khi selector mới được thêm hoặc sắp export.", includeWhen_en: "Use when a new selector is added or about to be exported.", readinessCheck_vi: "Không có claim native review và không mở rộng ngoài Punjabi script/vocabulary.", readinessCheck_en: "No native review claim and no expansion beyond Punjabi script/vocabulary.", finalReady: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS = sections;

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTOR_ITEMS: ReadonlyArray<PunjabiScriptVocabularyFinalSelector> =
  sections.flatMap((section) => section.selectors);

export default PUNJABI_SCRIPT_VOCABULARY_FINAL_SELECTORS;
