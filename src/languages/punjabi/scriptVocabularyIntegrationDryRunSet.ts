// src/languages/punjabi/scriptVocabularyIntegrationDryRunSet.ts
//
// Punjabi script/vocabulary integration dry-run selector data.
// Native review is deferred.

export type PunjabiDryRunFocus =
  | "reading_ladder"
  | "vocabulary_deck"
  | "glossary"
  | "script_drills"
  | "romanization_boundaries"
  | "survival_signage"
  | "service_vocabulary"
  | "shahmukhi_awareness"
  | "final_readiness";

export type PunjabiDryRunUse = "dry_run" | "pre_integration" | "final_readiness" | "regression";

export type PunjabiScriptVocabularyIntegrationDryRunItem = {
  id: string;
  focus: PunjabiDryRunFocus;
  use: PunjabiDryRunUse;
  gurmukhi: string;
  romanization?: string;
  dryRun_vi: string;
  dryRun_en: string;
  selectWhen_vi: string;
  selectWhen_en: string;
  readiness_vi: string;
  readiness_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  preIntegration?: boolean;
  finalReady?: boolean;
};

export type PunjabiScriptVocabularyIntegrationDryRunSection = {
  focus: PunjabiDryRunFocus;
  title_vi: string;
  title_en: string;
  dryRunGoal_vi: string;
  dryRunGoal_en: string;
  items: ReadonlyArray<PunjabiScriptVocabularyIntegrationDryRunItem>;
};

export const PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SCOPE = {
  vi: "Bộ dry-run này chỉ chọn dữ liệu Punjabi script/vocabulary cho tích hợp sau: Gurmukhi reading ladder, vocabulary deck, glossary, script drills, romanization boundaries, survival signage, service vocabulary và Shahmukhi awareness. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This dry-run set only selects Punjabi script/vocabulary data for later integration: Gurmukhi reading ladder, vocabulary deck, glossary, script drills, romanization boundaries, survival signage, service vocabulary, and Shahmukhi awareness. This is app-consumable TypeScript data; native review is deferred.",
  dryRunDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyIntegrationDryRunSection> = [
  {
    focus: "reading_ladder",
    title_vi: "Reading ladder dry run",
    title_en: "Reading Ladder Dry Run",
    dryRunGoal_vi: "Chọn các bước đọc Gurmukhi nền để kiểm thứ tự học trước khi ghép vào module sau.",
    dryRunGoal_en: "Select foundational Gurmukhi reading steps to check learning order before later module wiring.",
    items: [
      { id: "pa-dryrun-ladder-001", focus: "reading_ladder", use: "dry_run", gurmukhi: "ਕ / ਖ", romanization: "k / kh", dryRun_vi: "Dry-run cặp phụ âm bật hơi để kiểm Gurmukhi trước romanization.", dryRun_en: "Dry-run the aspirated consonant pair to check Gurmukhi before romanization.", selectWhen_vi: "Chọn khi bài cần phân biệt một chữ Gurmukhi với hai ký tự Latin.", selectWhen_en: "Select when the lesson needs to separate one Gurmukhi letter from two Latin characters.", readiness_vi: "ਖ được nhận diện là một chữ riêng trước khi xem kh.", readiness_en: "ਖ is recognized as a separate letter before seeing kh.", learnerTrap: { vi: "kh không phải k cộng h trong Gurmukhi.", en: "kh is not k plus h in Gurmukhi." }, preIntegration: true },
      { id: "pa-dryrun-ladder-002", focus: "reading_ladder", use: "final_readiness", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", dryRun_vi: "Dry-run cặp i ngắn/dài để kiểm quy tắc dấu nguyên âm.", dryRun_en: "Dry-run the short/long i pair to check vowel-sign rules.", selectWhen_vi: "Chọn trước khi bài có từ dùng ਿ hoặc ੀ.", selectWhen_en: "Select before a lesson has words using ਿ or ੀ.", readiness_vi: "Có ghi chú ਿ viết trước nhưng đọc sau phụ âm.", readiness_en: "Includes the note that ਿ is written before but read after the consonant.", learnerTrap: { vi: "Thứ tự mắt nhìn không phải thứ tự đọc.", en: "Visual order is not reading order." }, finalReady: true },
      { id: "pa-dryrun-ladder-003", focus: "reading_ladder", use: "regression", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", dryRun_vi: "Dry-run ba dấu e, ai/ae và au trước signage.", dryRun_en: "Dry-run the e, ai/ae, and au signs before signage.", selectWhen_vi: "Chọn khi cần kiểm người học không đổi dấu trong đọc nhanh.", selectWhen_en: "Select when checking that learners do not swap signs during fast reading.", readiness_vi: "Người học phân biệt đủ ba dạng Gurmukhi.", readiness_en: "Learner separates all three Gurmukhi forms.", finalReady: true },
    ],
  },
  {
    focus: "vocabulary_deck",
    title_vi: "Vocabulary deck dry run",
    title_en: "Vocabulary Deck Dry Run",
    dryRunGoal_vi: "Chọn từ vựng lõi có khả năng tái dùng trong signage, service và glossary.",
    dryRunGoal_en: "Select core vocabulary that can be reused across signage, service, and glossary surfaces.",
    items: [
      { id: "pa-dryrun-vocab-001", focus: "vocabulary_deck", use: "dry_run", gurmukhi: "ਦਵਾਈ", romanization: "davai", dryRun_vi: "Dry-run từ thuốc cho deck sức khỏe và dịch vụ.", dryRun_en: "Dry-run medicine for health and service decks.", selectWhen_vi: "Chọn khi lesson có pharmacy hoặc clinic ở Canada.", selectWhen_en: "Select when a lesson has pharmacy or clinic context in Canada.", readiness_vi: "Có Gurmukhi, romanization phụ, nghĩa VI và nghĩa EN.", readiness_en: "Includes Gurmukhi, supporting romanization, VI meaning, and EN meaning.", canadaPractical: true, preIntegration: true },
      { id: "pa-dryrun-vocab-002", focus: "vocabulary_deck", use: "pre_integration", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", dryRun_vi: "Dry-run từ tiền thuê cho bối cảnh housing.", dryRun_en: "Dry-run rent vocabulary for housing context.", selectWhen_vi: "Chọn khi bài có form nhà ở hoặc tin thuê nhà.", selectWhen_en: "Select when a lesson has a housing form or rental notice.", readiness_vi: "ਕਿਰਾਇਆ giữ Gurmukhi chính và giải thích tiền thuê rõ.", readiness_en: "ਕਿਰਾਇਆ keeps Gurmukhi primary and explains rent clearly.", canadaPractical: true, finalReady: true },
      { id: "pa-dryrun-vocab-003", focus: "vocabulary_deck", use: "regression", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", dryRun_vi: "Dry-run loanword school để kiểm vẫn đọc bằng Gurmukhi.", dryRun_en: "Dry-run the school loanword to check it is still read through Gurmukhi.", selectWhen_vi: "Chọn khi người học có thể dựa quá nhiều vào English.", selectWhen_en: "Select when learners may lean too heavily on English.", readiness_vi: "ਸਕੂਲ là trường chính; English chỉ là meaning phụ.", readiness_en: "ਸਕੂਲ is primary; English is only supporting meaning.", learnerTrap: { vi: "Từ quen dễ làm bỏ qua script.", en: "A familiar word can make learners skip script." }, canadaPractical: true },
    ],
  },
  {
    focus: "glossary",
    title_vi: "Glossary dry run",
    title_en: "Glossary Dry Run",
    dryRunGoal_vi: "Chọn mục glossary kiểm Gurmukhi chính và variant romanization có kiểm soát.",
    dryRunGoal_en: "Select glossary entries that check Gurmukhi primary data and controlled romanization variants.",
    items: [
      { id: "pa-dryrun-glossary-001", focus: "glossary", use: "dry_run", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", dryRun_vi: "Dry-run tên Punjabi để glossary không mất tippi awareness.", dryRun_en: "Dry-run the Punjabi name so glossary does not lose tippi awareness.", selectWhen_vi: "Chọn khi search hỗ trợ cả Panjabi và Punjabi.", selectWhen_en: "Select when search supports both Panjabi and Punjabi.", readiness_vi: "Cả hai variant Latin trỏ về ਪੰਜਾਬੀ.", readiness_en: "Both Latin variants point back to ਪੰਜਾਬੀ.", learnerTrap: { vi: "Latin không hiện rõ tippi.", en: "Latin does not show tippi clearly." }, preIntegration: true },
      { id: "pa-dryrun-glossary-002", focus: "glossary", use: "regression", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", dryRun_vi: "Dry-run v/w để variant Latin không tách nghĩa.", dryRun_en: "Dry-run v/w so Latin variants do not split meaning.", selectWhen_vi: "Chọn khi glossary nhận nhiều spelling Latin.", selectWhen_en: "Select when glossary accepts multiple Latin spellings.", readiness_vi: "vadda và wadda cùng trả về ਵੱਡਾ.", readiness_en: "vadda and wadda both return ਵੱਡਾ.", learnerTrap: { vi: "Hai spelling Latin không luôn là hai từ.", en: "Two Latin spellings are not always two words." }, finalReady: true },
    ],
  },
  {
    focus: "script_drills",
    title_vi: "Script drills dry run",
    title_en: "Script Drills Dry Run",
    dryRunGoal_vi: "Chọn drill ngắn để kiểm chữ, dấu nguyên âm và dấu nhỏ không bị rơi.",
    dryRunGoal_en: "Select short drills to check letters, vowel signs, and small marks are not dropped.",
    items: [
      { id: "pa-dryrun-drill-001", focus: "script_drills", use: "pre_integration", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", dryRun_vi: "Dry-run addak trong cụm trạm xe buýt.", dryRun_en: "Dry-run addak in the bus-stop chunk.", selectWhen_vi: "Chọn khi bài có transit hoặc biển xe buýt ở Canada.", selectWhen_en: "Select when a lesson has transit or bus signage in Canada.", readiness_vi: "Cả ਬੱਸ và ਅੱਡਾ giữ ੱ trong Gurmukhi.", readiness_en: "Both ਬੱਸ and ਅੱਡਾ keep ੱ in Gurmukhi.", learnerTrap: { vi: "Addak nhỏ nhưng không phải trang trí.", en: "Addak is small but not decoration." }, canadaPractical: true, finalReady: true },
      { id: "pa-dryrun-drill-002", focus: "script_drills", use: "regression", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", dryRun_vi: "Dry-run bindi và tippi để kiểm vị trí dấu.", dryRun_en: "Dry-run bindi and tippi to check mark placement.", selectWhen_vi: "Chọn khi bài có tên Punjab hoặc từ gia đình.", selectWhen_en: "Select when a lesson has the name Punjab or a family word.", readiness_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", readiness_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", learnerTrap: { vi: "Romanization không hiển thị vị trí dấu rõ.", en: "Romanization does not show mark placement clearly." }, preIntegration: true },
    ],
  },
  {
    focus: "romanization_boundaries",
    title_vi: "Romanization boundary dry run",
    title_en: "Romanization Boundary Dry Run",
    dryRunGoal_vi: "Chọn boundary để romanization là cầu tạm thời, không phải dữ liệu chính.",
    dryRunGoal_en: "Select boundaries where romanization is a temporary bridge, not the primary data.",
    items: [
      { id: "pa-dryrun-roman-001", focus: "romanization_boundaries", use: "final_readiness", gurmukhi: "ਫਲ", romanization: "phal/fal", dryRun_vi: "Dry-run ph/f để kiểm lượt cuối chỉ còn Gurmukhi.", dryRun_en: "Dry-run ph/f to check the final round keeps only Gurmukhi.", selectWhen_vi: "Chọn khi item có variant ph/f.", selectWhen_en: "Select when an item has ph/f variants.", readiness_vi: "Lượt cuối chỉ hiện ਫਲ bằng Gurmukhi.", readiness_en: "The final round shows only ਫਲ in Gurmukhi.", learnerTrap: { vi: "ਫ là anchor, ph/f chỉ là bridge.", en: "ਫ is the anchor; ph/f is only a bridge." }, finalReady: true },
      { id: "pa-dryrun-roman-002", focus: "romanization_boundaries", use: "regression", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", dryRun_vi: "Dry-run shahir/shehar để kiểm chữ ਸ਼ trước Latin.", dryRun_en: "Dry-run shahir/shehar to check ਸ਼ before Latin.", selectWhen_vi: "Chọn khi bài có city/town hoặc lower-mark distinction.", selectWhen_en: "Select when a lesson has city/town or lower-mark distinction.", readiness_vi: "Người học nhận ra ਸ਼ bằng dấu dưới.", readiness_en: "Learner recognizes ਸ਼ by the lower mark.", learnerTrap: { vi: "Dấu dưới phân biệt ਸ਼ với ਸ.", en: "The lower mark separates ਸ਼ from ਸ." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Survival signage dry run",
    title_en: "Survival Signage Dry Run",
    dryRunGoal_vi: "Chọn biển sinh tồn ngắn có Gurmukhi chính và hành động thực tế.",
    dryRunGoal_en: "Select short survival signs with Gurmukhi primary data and practical actions.",
    items: [
      { id: "pa-dryrun-sign-001", focus: "survival_signage", use: "dry_run", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", dryRun_vi: "Dry-run biển lối ra cho tình huống tòa nhà.", dryRun_en: "Dry-run the exit sign for building contexts.", selectWhen_vi: "Chọn khi lesson cần hành động tìm lối ra.", selectWhen_en: "Select when a lesson needs the action of finding an exit.", readiness_vi: "Người học biết đi theo ਨਿਕਾਸ để tìm lối ra.", readiness_en: "Learner knows to follow ਨਿਕਾਸ to find the exit.", canadaPractical: true, finalReady: true },
      { id: "pa-dryrun-sign-002", focus: "survival_signage", use: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", dryRun_vi: "Dry-run emergency nhưng giữ Gurmukhi trước English.", dryRun_en: "Dry-run emergency while keeping Gurmukhi before English.", selectWhen_vi: "Chọn khi bối cảnh là bệnh viện hoặc clinic.", selectWhen_en: "Select when the context is a hospital or clinic.", readiness_vi: "ਐਮਰਜੈਂਸੀ xuất hiện trước meaning English.", readiness_en: "ਐਮਰਜੈਂਸੀ appears before the English meaning.", canadaPractical: true, preIntegration: true },
      { id: "pa-dryrun-sign-003", focus: "survival_signage", use: "regression", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", dryRun_vi: "Dry-run pharmacy để từ mượn không che chữ ਫ.", dryRun_en: "Dry-run pharmacy so the loanword does not hide ਫ.", selectWhen_vi: "Chọn khi bài cần tìm nhà thuốc.", selectWhen_en: "Select when a lesson needs finding a pharmacy.", readiness_vi: "ਫਾਰਮੇਸੀ được đọc trước pharmacy/farmacy.", readiness_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", learnerTrap: { vi: "Từ mượn quen dễ làm đọc lướt.", en: "A familiar loanword can cause skim reading." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Service vocabulary dry run",
    title_en: "Service Vocabulary Dry Run",
    dryRunGoal_vi: "Chọn cụm dịch vụ để kiểm workflow Canada-practical trước tích hợp sau.",
    dryRunGoal_en: "Select service chunks to check Canada-practical workflows before later integration.",
    items: [
      { id: "pa-dryrun-service-001", focus: "service_vocabulary", use: "dry_run", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", dryRun_vi: "Dry-run cụm điền form cho workflow giấy tờ.", dryRun_en: "Dry-run the fill-out-a-form chunk for paperwork workflows.", selectWhen_vi: "Chọn khi bài có giấy tờ trường học, clinic hoặc housing.", selectWhen_en: "Select when a lesson has school, clinic, or housing paperwork.", readiness_vi: "Cụm được đọc như một hành động đầy đủ.", readiness_en: "The chunk is read as one complete action.", canadaPractical: true, finalReady: true },
      { id: "pa-dryrun-service-002", focus: "service_vocabulary", use: "pre_integration", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", dryRun_vi: "Dry-run cụm đặt lịch cho service/clinic flow.", dryRun_en: "Dry-run the appointment-booking chunk for service/clinic flow.", selectWhen_vi: "Chọn khi bài có đặt lịch phòng khám.", selectWhen_en: "Select when a lesson has booking a clinic appointment.", readiness_vi: "ਲੈਣਾ được hiểu trong cụm đặt/lấy lịch.", readiness_en: "ਲੈਣਾ is understood inside the book/take appointment chunk.", canadaPractical: true, preIntegration: true },
      { id: "pa-dryrun-service-003", focus: "service_vocabulary", use: "final_readiness", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", dryRun_vi: "Dry-run câu cần giúp đỡ cho support phrase.", dryRun_en: "Dry-run the I-need-help sentence for support phrases.", selectWhen_vi: "Chọn khi người học cần hỏi nhân viên dịch vụ.", selectWhen_en: "Select when learners need to ask service staff.", readiness_vi: "Giữ câu đầy đủ, không rút gọn còn ਮਦਦ.", readiness_en: "Keeps the full sentence, not reduced to ਮਦਦ.", canadaPractical: true, finalReady: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Shahmukhi awareness dry run",
    title_en: "Shahmukhi Awareness Dry Run",
    dryRunGoal_vi: "Chọn một note phạm vi để Shahmukhi chỉ là awareness trong dry run.",
    dryRunGoal_en: "Select one scope note so Shahmukhi remains awareness only in the dry run.",
    items: [
      { id: "pa-dryrun-shahmukhi-001", focus: "shahmukhi_awareness", use: "final_readiness", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", dryRun_vi: "Dry-run note Gurmukhi là chính; Shahmukhi chỉ awareness.", dryRun_en: "Dry-run the note that Gurmukhi is primary and Shahmukhi is awareness only.", selectWhen_vi: "Chọn khi cần nhắc phạm vi trước tích hợp sau.", selectWhen_en: "Select when scope needs stating before later integration.", readiness_vi: "Không biến thành khóa Shahmukhi đầy đủ.", readiness_en: "Does not become a full Shahmukhi course.", finalReady: true },
    ],
  },
  {
    focus: "final_readiness",
    title_vi: "Final readiness dry run",
    title_en: "Final Readiness Dry Run",
    dryRunGoal_vi: "Chọn guard cuối để dry-run data sẵn sàng cho bước tích hợp sau mà không tích hợp.",
    dryRunGoal_en: "Select final guards so dry-run data is ready for later integration without integrating now.",
    items: [
      { id: "pa-dryrun-final-001", focus: "final_readiness", use: "final_readiness", gurmukhi: "ਅੰਤਿਮ ਸੁੱਕਾ ਟੈਸਟ", romanization: "antim sukka test", dryRun_vi: "Dry-run checklist cuối cho id, focus, Gurmukhi, VI/EN và readiness.", dryRun_en: "Dry-run the final checklist for id, focus, Gurmukhi, VI/EN, and readiness.", selectWhen_vi: "Chọn trước khi dữ liệu được giao cho bước tích hợp khác.", selectWhen_en: "Select before data is handed to a separate integration step.", readiness_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", readiness_en: "Data is consumable TypeScript, not loose notes.", preIntegration: true, finalReady: true },
      { id: "pa-dryrun-final-002", focus: "final_readiness", use: "regression", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", dryRun_vi: "Dry-run regression để bắt Latin-first, thiếu dấu và scope drift.", dryRun_en: "Dry-run regression to catch Latin-first order, missing marks, and scope drift.", selectWhen_vi: "Chọn khi thêm selector mới hoặc chuẩn bị export.", selectWhen_en: "Select when adding a new selector or preparing export.", readiness_vi: "Không claim native review và không mở rộng ngoài Punjabi script/vocabulary.", readiness_en: "No native review claim and no expansion beyond Punjabi script/vocabulary.", finalReady: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SET = sections;

export const PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_ITEMS: ReadonlyArray<PunjabiScriptVocabularyIntegrationDryRunItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_VOCABULARY_INTEGRATION_DRY_RUN_SET;
