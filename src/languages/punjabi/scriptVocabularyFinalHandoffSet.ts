// src/languages/punjabi/scriptVocabularyFinalHandoffSet.ts
//
// Punjabi script/vocabulary final handoff data for later app integration.
// Native review is deferred.

export type PunjabiFinalHandoffFocus =
  | "reading_ladder"
  | "vocabulary_deck"
  | "glossary"
  | "script_drills"
  | "romanization_boundaries"
  | "survival_signage"
  | "service_vocabulary"
  | "shahmukhi_awareness"
  | "final_readiness";

export type PunjabiFinalHandoffUse = "final_handoff" | "pre_integration" | "final_readiness" | "regression";

export type PunjabiScriptVocabularyFinalHandoffItem = {
  id: string;
  focus: PunjabiFinalHandoffFocus;
  use: PunjabiFinalHandoffUse;
  gurmukhi: string;
  romanization?: string;
  handoff_vi: string;
  handoff_en: string;
  includeWhen_vi: string;
  includeWhen_en: string;
  finalCheck_vi: string;
  finalCheck_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  preIntegration?: boolean;
  finalReady?: boolean;
};

export type PunjabiScriptVocabularyFinalHandoffSection = {
  focus: PunjabiFinalHandoffFocus;
  title_vi: string;
  title_en: string;
  handoffGoal_vi: string;
  handoffGoal_en: string;
  items: ReadonlyArray<PunjabiScriptVocabularyFinalHandoffItem>;
};

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SCOPE = {
  vi: "Bộ final handoff này đóng gói dữ liệu Punjabi script/vocabulary đại diện cho bước tích hợp sau: Gurmukhi reading ladder, vocabulary deck, glossary, script drills, romanization boundaries, survival signage, service vocabulary và Shahmukhi awareness. Đây chỉ là TypeScript data app-consumable; native review được hoãn.",
  en: "This final handoff set packages representative Punjabi script/vocabulary data for a later integration step: Gurmukhi reading ladder, vocabulary deck, glossary, script drills, romanization boundaries, survival signage, service vocabulary, and Shahmukhi awareness. This is app-consumable TypeScript data only; native review is deferred.",
  handoffDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyFinalHandoffSection> = [
  {
    focus: "reading_ladder",
    title_vi: "Reading ladder handoff",
    title_en: "Reading Ladder Handoff",
    handoffGoal_vi: "Chuyển giao các bước đọc Gurmukhi nền theo thứ tự ổn định trước khi học từ thật.",
    handoffGoal_en: "Hand off foundational Gurmukhi reading steps in a stable order before real vocabulary.",
    items: [
      { id: "pa-handoff-ladder-001", focus: "reading_ladder", use: "final_handoff", gurmukhi: "ਕ / ਖ", romanization: "k / kh", handoff_vi: "Handoff cặp bật hơi để giữ Gurmukhi trước romanization.", handoff_en: "Hand off the aspirated pair to keep Gurmukhi before romanization.", includeWhen_vi: "Dùng khi bài cần phân biệt ਇੱਕ chữ Gurmukhi với hai ký tự Latin.", includeWhen_en: "Use when a lesson needs to separate one Gurmukhi letter from two Latin characters.", finalCheck_vi: "ਖ được nhận diện là một chữ riêng trước khi xem kh.", finalCheck_en: "ਖ is recognized as a separate letter before seeing kh.", learnerTrap: { vi: "kh không phải k cộng h trong Gurmukhi.", en: "kh is not k plus h in Gurmukhi." }, preIntegration: true },
      { id: "pa-handoff-ladder-002", focus: "reading_ladder", use: "final_readiness", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", handoff_vi: "Handoff cặp i ngắn/dài để giữ quy tắc dấu nguyên âm.", handoff_en: "Hand off the short/long i pair to preserve vowel-sign rules.", includeWhen_vi: "Dùng trước các từ có ਿ hoặc ੀ.", includeWhen_en: "Use before words with ਿ or ੀ.", finalCheck_vi: "Có ghi chú ਿ viết trước nhưng đọc sau phụ âm.", finalCheck_en: "Includes the note that ਿ is written before but read after the consonant.", learnerTrap: { vi: "Thứ tự mắt nhìn không phải thứ tự đọc.", en: "Visual order is not reading order." }, finalReady: true },
      { id: "pa-handoff-ladder-003", focus: "reading_ladder", use: "regression", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", handoff_vi: "Handoff ba dấu e, ai/ae và au để tránh đổi dấu khi đọc nhanh.", handoff_en: "Hand off e, ai/ae, and au signs to prevent swapping during fast reading.", includeWhen_vi: "Dùng trước survival signage hoặc service vocabulary.", includeWhen_en: "Use before survival signage or service vocabulary.", finalCheck_vi: "Người học phân biệt đủ ba dạng Gurmukhi.", finalCheck_en: "Learner separates all three Gurmukhi forms.", finalReady: true },
    ],
  },
  {
    focus: "vocabulary_deck",
    title_vi: "Vocabulary deck handoff",
    title_en: "Vocabulary Deck Handoff",
    handoffGoal_vi: "Chuyển giao từ vựng cốt lõi có thể tái dùng trong signage, service và glossary.",
    handoffGoal_en: "Hand off core vocabulary reusable across signage, service, and glossary surfaces.",
    items: [
      { id: "pa-handoff-vocab-001", focus: "vocabulary_deck", use: "final_handoff", gurmukhi: "ਦਵਾਈ", romanization: "davai", handoff_vi: "Handoff từ thuốc cho deck sức khỏe và dịch vụ.", handoff_en: "Hand off medicine for health and service decks.", includeWhen_vi: "Dùng khi lesson có pharmacy hoặc clinic ở Canada.", includeWhen_en: "Use when a lesson has pharmacy or clinic context in Canada.", finalCheck_vi: "Có Gurmukhi, romanization phụ, nghĩa VI và nghĩa EN.", finalCheck_en: "Includes Gurmukhi, supporting romanization, VI meaning, and EN meaning.", canadaPractical: true, preIntegration: true },
      { id: "pa-handoff-vocab-002", focus: "vocabulary_deck", use: "pre_integration", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", handoff_vi: "Handoff từ tiền thuê cho bối cảnh housing.", handoff_en: "Hand off rent vocabulary for housing context.", includeWhen_vi: "Dùng khi bài có form nhà ở hoặc tin thuê nhà.", includeWhen_en: "Use when a lesson has a housing form or rental notice.", finalCheck_vi: "ਕਿਰਾਇਆ giữ Gurmukhi chính và giải thích tiền thuê rõ.", finalCheck_en: "ਕਿਰਾਇਆ keeps Gurmukhi primary and explains rent clearly.", canadaPractical: true, finalReady: true },
      { id: "pa-handoff-vocab-003", focus: "vocabulary_deck", use: "regression", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", handoff_vi: "Handoff loanword school nhưng vẫn đọc bằng Gurmukhi.", handoff_en: "Hand off the school loanword while still reading through Gurmukhi.", includeWhen_vi: "Dùng khi người học có thể dựa quá nhiều vào English.", includeWhen_en: "Use when learners may lean too heavily on English.", finalCheck_vi: "ਸਕੂਲ là trường chính; English chỉ là meaning phụ.", finalCheck_en: "ਸਕੂਲ is primary; English is only supporting meaning.", learnerTrap: { vi: "Từ quen dễ làm bỏ qua script.", en: "A familiar word can make learners skip script." }, canadaPractical: true },
    ],
  },
  {
    focus: "glossary",
    title_vi: "Glossary handoff",
    title_en: "Glossary Handoff",
    handoffGoal_vi: "Chuyển giao glossary với Gurmukhi chính và variant romanization có kiểm soát.",
    handoffGoal_en: "Hand off glossary entries with Gurmukhi primary data and controlled romanization variants.",
    items: [
      { id: "pa-handoff-glossary-001", focus: "glossary", use: "final_handoff", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", handoff_vi: "Handoff tên Punjabi để glossary không mất tippi awareness.", handoff_en: "Hand off the Punjabi name so glossary does not lose tippi awareness.", includeWhen_vi: "Dùng khi search hỗ trợ cả Panjabi và Punjabi.", includeWhen_en: "Use when search supports both Panjabi and Punjabi.", finalCheck_vi: "Cả hai variant Latin trỏ về ਪੰਜਾਬੀ.", finalCheck_en: "Both Latin variants point back to ਪੰਜਾਬੀ.", learnerTrap: { vi: "Latin không hiện rõ tippi.", en: "Latin does not show tippi clearly." }, preIntegration: true },
      { id: "pa-handoff-glossary-002", focus: "glossary", use: "regression", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", handoff_vi: "Handoff v/w để variant Latin không tách nghĩa.", handoff_en: "Hand off v/w so Latin variants do not split meaning.", includeWhen_vi: "Dùng khi glossary nhận nhiều spelling Latin.", includeWhen_en: "Use when glossary accepts multiple Latin spellings.", finalCheck_vi: "vadda và wadda cùng trả về ਵੱਡਾ.", finalCheck_en: "vadda and wadda both return ਵੱਡਾ.", learnerTrap: { vi: "Hai spelling Latin không luôn là hai từ.", en: "Two Latin spellings are not always two words." }, finalReady: true },
    ],
  },
  {
    focus: "script_drills",
    title_vi: "Script drills handoff",
    title_en: "Script Drills Handoff",
    handoffGoal_vi: "Chuyển giao drill ngắn để kiểm chữ, dấu nguyên âm và dấu nhỏ không bị rơi.",
    handoffGoal_en: "Hand off short drills that check letters, vowel signs, and small marks are not dropped.",
    items: [
      { id: "pa-handoff-drill-001", focus: "script_drills", use: "pre_integration", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", handoff_vi: "Handoff addak trong cụm trạm xe buýt.", handoff_en: "Hand off addak in the bus-stop chunk.", includeWhen_vi: "Dùng khi bài có transit hoặc biển xe buýt ở Canada.", includeWhen_en: "Use when a lesson has transit or bus signage in Canada.", finalCheck_vi: "Cả ਬੱਸ và ਅੱਡਾ giữ ੱ trong Gurmukhi.", finalCheck_en: "Both ਬੱਸ and ਅੱਡਾ keep ੱ in Gurmukhi.", learnerTrap: { vi: "Addak nhỏ nhưng không phải trang trí.", en: "Addak is small but not decoration." }, canadaPractical: true, finalReady: true },
      { id: "pa-handoff-drill-002", focus: "script_drills", use: "regression", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", handoff_vi: "Handoff bindi và tippi để kiểm vị trí dấu.", handoff_en: "Hand off bindi and tippi to check mark placement.", includeWhen_vi: "Dùng khi bài có tên Punjab hoặc từ gia đình.", includeWhen_en: "Use when a lesson has the name Punjab or a family word.", finalCheck_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", finalCheck_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", learnerTrap: { vi: "Romanization không hiển thị vị trí dấu rõ.", en: "Romanization does not show mark placement clearly." }, preIntegration: true },
    ],
  },
  {
    focus: "romanization_boundaries",
    title_vi: "Romanization boundary handoff",
    title_en: "Romanization Boundary Handoff",
    handoffGoal_vi: "Chuyển giao boundary để romanization là cầu tạm thời, không phải dữ liệu chính.",
    handoffGoal_en: "Hand off boundaries where romanization is a temporary bridge, not primary data.",
    items: [
      { id: "pa-handoff-roman-001", focus: "romanization_boundaries", use: "final_readiness", gurmukhi: "ਫਲ", romanization: "phal/fal", handoff_vi: "Handoff ph/f để kiểm lượt cuối chỉ còn Gurmukhi.", handoff_en: "Hand off ph/f to check the final round keeps only Gurmukhi.", includeWhen_vi: "Dùng khi item có variant ph/f.", includeWhen_en: "Use when an item has ph/f variants.", finalCheck_vi: "Lượt cuối chỉ hiện ਫਲ bằng Gurmukhi.", finalCheck_en: "The final round shows only ਫਲ in Gurmukhi.", learnerTrap: { vi: "ਫ là anchor, ph/f chỉ là bridge.", en: "ਫ is the anchor; ph/f is only a bridge." }, finalReady: true },
      { id: "pa-handoff-roman-002", focus: "romanization_boundaries", use: "regression", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", handoff_vi: "Handoff shahir/shehar để kiểm chữ ਸ਼ trước Latin.", handoff_en: "Hand off shahir/shehar to check ਸ਼ before Latin.", includeWhen_vi: "Dùng khi bài có city/town hoặc lower-mark distinction.", includeWhen_en: "Use when a lesson has city/town or lower-mark distinction.", finalCheck_vi: "Người học nhận ra ਸ਼ bằng dấu dưới.", finalCheck_en: "Learner recognizes ਸ਼ by the lower mark.", learnerTrap: { vi: "Dấu dưới phân biệt ਸ਼ với ਸ.", en: "The lower mark separates ਸ਼ from ਸ." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Survival signage handoff",
    title_en: "Survival Signage Handoff",
    handoffGoal_vi: "Chuyển giao biển sinh tồn ngắn có Gurmukhi chính và hành động thực tế.",
    handoffGoal_en: "Hand off short survival signs with Gurmukhi primary data and practical actions.",
    items: [
      { id: "pa-handoff-sign-001", focus: "survival_signage", use: "final_handoff", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", handoff_vi: "Handoff biển lối ra cho tình huống tòa nhà.", handoff_en: "Hand off the exit sign for building contexts.", includeWhen_vi: "Dùng khi lesson cần hành động tìm lối ra.", includeWhen_en: "Use when a lesson needs the action of finding an exit.", finalCheck_vi: "Người học biết đi theo ਨਿਕਾਸ để tìm lối ra.", finalCheck_en: "Learner knows to follow ਨਿਕਾਸ to find the exit.", canadaPractical: true, finalReady: true },
      { id: "pa-handoff-sign-002", focus: "survival_signage", use: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", handoff_vi: "Handoff emergency nhưng giữ Gurmukhi trước English.", handoff_en: "Hand off emergency while keeping Gurmukhi before English.", includeWhen_vi: "Dùng khi bối cảnh là bệnh viện hoặc clinic.", includeWhen_en: "Use when the context is a hospital or clinic.", finalCheck_vi: "ਐਮਰਜੈਂਸੀ xuất hiện trước meaning English.", finalCheck_en: "ਐਮਰਜੈਂਸੀ appears before the English meaning.", canadaPractical: true, preIntegration: true },
      { id: "pa-handoff-sign-003", focus: "survival_signage", use: "regression", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", handoff_vi: "Handoff pharmacy để từ mượn không che chữ ਫ.", handoff_en: "Hand off pharmacy so the loanword does not hide ਫ.", includeWhen_vi: "Dùng khi bài cần tìm nhà thuốc.", includeWhen_en: "Use when a lesson needs finding a pharmacy.", finalCheck_vi: "ਫਾਰਮੇਸੀ được đọc trước pharmacy/farmacy.", finalCheck_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", learnerTrap: { vi: "Từ mượn quen dễ làm đọc lướt.", en: "A familiar loanword can cause skim reading." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Service vocabulary handoff",
    title_en: "Service Vocabulary Handoff",
    handoffGoal_vi: "Chuyển giao cụm dịch vụ để kiểm workflow Canada-practical trước tích hợp sau.",
    handoffGoal_en: "Hand off service chunks that check Canada-practical workflows before later integration.",
    items: [
      { id: "pa-handoff-service-001", focus: "service_vocabulary", use: "final_handoff", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", handoff_vi: "Handoff cụm điền form cho workflow giấy tờ.", handoff_en: "Hand off the fill-out-a-form chunk for paperwork workflows.", includeWhen_vi: "Dùng khi bài có giấy tờ trường học, clinic hoặc housing.", includeWhen_en: "Use when a lesson has school, clinic, or housing paperwork.", finalCheck_vi: "Cụm được đọc như một hành động đầy đủ.", finalCheck_en: "The chunk is read as one complete action.", canadaPractical: true, finalReady: true },
      { id: "pa-handoff-service-002", focus: "service_vocabulary", use: "pre_integration", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", handoff_vi: "Handoff cụm đặt lịch cho service/clinic flow.", handoff_en: "Hand off the appointment-booking chunk for service/clinic flow.", includeWhen_vi: "Dùng khi bài có đặt lịch phòng khám.", includeWhen_en: "Use when a lesson has booking a clinic appointment.", finalCheck_vi: "ਲੈਣਾ được hiểu trong cụm đặt/lấy lịch.", finalCheck_en: "ਲੈਣਾ is understood inside the book/take appointment chunk.", canadaPractical: true, preIntegration: true },
      { id: "pa-handoff-service-003", focus: "service_vocabulary", use: "final_readiness", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", handoff_vi: "Handoff câu cần giúp đỡ cho support phrase.", handoff_en: "Hand off the I-need-help sentence for support phrases.", includeWhen_vi: "Dùng khi người học cần hỏi nhân viên dịch vụ.", includeWhen_en: "Use when learners need to ask service staff.", finalCheck_vi: "Giữ câu đầy đủ, không rút gọn còn ਮਦਦ.", finalCheck_en: "Keeps the full sentence, not reduced to ਮਦਦ.", canadaPractical: true, finalReady: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Shahmukhi awareness handoff",
    title_en: "Shahmukhi Awareness Handoff",
    handoffGoal_vi: "Chuyển giao một note phạm vi để Shahmukhi chỉ là awareness trong handoff.",
    handoffGoal_en: "Hand off one scope note so Shahmukhi remains awareness only in the handoff.",
    items: [
      { id: "pa-handoff-shahmukhi-001", focus: "shahmukhi_awareness", use: "final_readiness", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", handoff_vi: "Handoff note Gurmukhi là chính; Shahmukhi chỉ awareness.", handoff_en: "Hand off the note that Gurmukhi is primary and Shahmukhi is awareness only.", includeWhen_vi: "Dùng khi cần nhắc phạm vi trước tích hợp sau.", includeWhen_en: "Use when scope needs stating before later integration.", finalCheck_vi: "Không biến thành khóa Shahmukhi đầy đủ.", finalCheck_en: "Does not become a full Shahmukhi course.", finalReady: true },
    ],
  },
  {
    focus: "final_readiness",
    title_vi: "Final readiness handoff",
    title_en: "Final Readiness Handoff",
    handoffGoal_vi: "Chuyển giao guard cuối để data sẵn sàng cho bước tích hợp sau mà không tích hợp.",
    handoffGoal_en: "Hand off final guards so data is ready for later integration without integrating now.",
    items: [
      { id: "pa-handoff-final-001", focus: "final_readiness", use: "final_readiness", gurmukhi: "ਅੰਤਿਮ ਹਵਾਲਗੀ", romanization: "antim hawalgi", handoff_vi: "Handoff checklist cuối cho id, focus, Gurmukhi, VI/EN và readiness.", handoff_en: "Hand off the final checklist for id, focus, Gurmukhi, VI/EN, and readiness.", includeWhen_vi: "Dùng trước khi dữ liệu được giao cho bước tích hợp khác.", includeWhen_en: "Use before data is handed to a separate integration step.", finalCheck_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", finalCheck_en: "Data is consumable TypeScript, not loose notes.", preIntegration: true, finalReady: true },
      { id: "pa-handoff-final-002", focus: "final_readiness", use: "regression", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", handoff_vi: "Handoff regression để bắt Latin-first, thiếu dấu và scope drift.", handoff_en: "Hand off regression to catch Latin-first order, missing marks, and scope drift.", includeWhen_vi: "Dùng khi thêm handoff item mới hoặc chuẩn bị export.", includeWhen_en: "Use when adding a new handoff item or preparing export.", finalCheck_vi: "Không claim native review và không mở rộng ngoài Punjabi script/vocabulary.", finalCheck_en: "No native review claim and no expansion beyond Punjabi script/vocabulary.", finalReady: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SET = sections;

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_ITEMS: ReadonlyArray<PunjabiScriptVocabularyFinalHandoffItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_VOCABULARY_FINAL_HANDOFF_SET;
