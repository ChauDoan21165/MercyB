// src/languages/punjabi/scriptVocabularyClosureValidationSamples.ts
//
// Punjabi script/vocabulary closure validation samples for internal consistency.
// Native review is deferred.

export type PunjabiClosureValidationFocus =
  | "gurmukhi_forms"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "pre_integration_verification";

export type PunjabiClosureValidationStage = "closure_validation" | "final_cross_check" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularyClosureValidationSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiClosureValidationFocus;
  stage: PunjabiClosureValidationStage;
  gurmukhi: string;
  romanization?: string;
  closureValidation_vi: string;
  closureValidation_en: string;
  expected_vi: string;
  expected_en: string;
  consistencyGuard_vi: string;
  consistencyGuard_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  verification?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularyClosureValidationSection = {
  cell_id?: string;
  focus: PunjabiClosureValidationFocus;
  title_vi: string;
  title_en: string;
  verificationGoal_vi: string;
  verificationGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyClosureValidationSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_CLOSURE_VALIDATION_SCOPE = {
  vi: "Bộ closure-validation này kiểm tính nhất quán nội bộ của Punjabi script/vocabulary: Gurmukhi là primary, romanization chỉ là bridge, vowel signs và addak/tippi/bindi được giữ, signage, service vocabulary, verbs và collocations khớp nhau, Shahmukhi chỉ là awareness. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This closure-validation set verifies internal consistency for Punjabi script/vocabulary: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are preserved, signage, service vocabulary, verbs, and collocations align, and Shahmukhi is awareness only. This is app-consumable TypeScript data; native review is deferred.",
  closureValidationDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyClosureValidationSection> = [
  {
    focus: "gurmukhi_forms",
    title_vi: "Gurmukhi form closure validation checks",
    title_en: "Gurmukhi Form Closure Validation Checks",
    verificationGoal_vi: "Đối chiếu dạng chữ Gurmukhi với meaning và prompt để Latin không thành nguồn chính.",
    verificationGoal_en: "Validate Gurmukhi forms against meaning and prompts so Latin never becomes primary.",
    samples: [
      { id: "pa-closure-validation-gurmukhi-001", focus: "gurmukhi_forms", stage: "closure_validation", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", closureValidation_vi: "Đối chiếu tên ngôn ngữ với glossary và reading prompt.", closureValidation_en: "Validate the language name against glossary and reading prompts.", expected_vi: "ਪੰਜਾਬੀ là form chính; Panjabi/Punjabi chỉ là variant hỗ trợ.", expected_en: "ਪੰਜਾਬੀ is the primary form; Panjabi/Punjabi are supporting variants.", consistencyGuard_vi: "Bắt item chỉ có Latin và bỏ tippi trong ਪੰਜਾਬੀ.", consistencyGuard_en: "Catches items with only Latin text that drop tippi in ਪੰਜਾਬੀ.", learnerTrap: { vi: "Latin không hiện vị trí tippi.", en: "Latin does not show tippi placement." }, verification: true },
      { id: "pa-closure-validation-gurmukhi-002", focus: "gurmukhi_forms", stage: "sanity", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", closureValidation_vi: "Đối chiếu prompt đọc với action thật là đọc chữ.", closureValidation_en: "Validate the reading prompt with the real action of reading script.", expected_vi: "Prompt bắt đầu bằng Gurmukhi và chỉ dùng romanization như hint.", expected_en: "Prompt starts with Gurmukhi and uses romanization only as a hint.", consistencyGuard_vi: "Bắt prompt Latin-first trong sample đọc.", consistencyGuard_en: "Catches Latin-first prompts in reading samples.", preIntegration: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Romanization bridge closure validation checks",
    title_en: "Romanization Bridge Closure Validation Checks",
    verificationGoal_vi: "Đối chiếu variant romanization với một form Gurmukhi ổn định, tránh duplicate sai.",
    verificationGoal_en: "Validate romanization variants against one stable Gurmukhi form to avoid false duplicates.",
    samples: [
      { id: "pa-closure-validation-roman-001", focus: "romanization_bridge", stage: "final_cross_check", gurmukhi: "ਫਲ", romanization: "phal/fal", closureValidation_vi: "Đối chiếu ph/f với chữ ਫ để không biến thành hai mục.", closureValidation_en: "Validate ph/f against ਫ so they do not become two entries.", expected_vi: "Cả phal và fal đều trỏ về form Gurmukhi ਫਲ.", expected_en: "Both phal and fal point back to ਫਲ.", consistencyGuard_vi: "Bắt đáp án chính chỉ là phal/fal.", consistencyGuard_en: "Catches main answers that are only phal/fal.", learnerTrap: { vi: "ਫ là anchor, ph/f chỉ là bridge.", en: "ਫ is the anchor; ph/f are only bridges." }, verification: true },
      { id: "pa-closure-validation-roman-002", focus: "romanization_bridge", stage: "closure_validation", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", closureValidation_vi: "Đối chiếu v/w với cùng một Gurmukhi form.", closureValidation_en: "Validate v/w with the same Gurmukhi form.", expected_vi: "Không tạo hai nghĩa riêng vì hai spelling Latin.", expected_en: "Does not create two meanings because of two Latin spellings.", consistencyGuard_vi: "Bắt duplicate chỉ khác v/w.", consistencyGuard_en: "Catches duplicates differing only by v/w.", learnerTrap: { vi: "Hai spelling Latin không luôn là hai từ.", en: "Two Latin spellings are not always two words." }, preIntegration: true },
      { id: "pa-closure-validation-roman-003", focus: "romanization_bridge", stage: "sanity", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", closureValidation_vi: "Đối chiếu ਸ਼ có dấu dưới với romanization sh.", closureValidation_en: "Validate marked ਸ਼ with sh romanization.", expected_vi: "Dấu dưới của ਸ਼ được giữ trong mọi sample.", expected_en: "The lower mark in ਸ਼ is preserved in every sample.", consistencyGuard_vi: "Bắt nhầm ਸ਼ với ਸ trong dữ liệu romanization.", consistencyGuard_en: "Catches confusing ਸ਼ with ਸ.", learnerTrap: { vi: "ਸ਼ và ਸ không cùng một chữ.", en: "ਸ਼ and ਸ are not the same letter." }, verification: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Vowel sign closure validation checks",
    title_en: "Vowel Sign Closure Validation Checks",
    verificationGoal_vi: "Đối chiếu dấu nguyên âm với romanization và thứ tự đọc thật.",
    verificationGoal_en: "Validate vowel signs against romanization and real reading order.",
    samples: [
      { id: "pa-closure-validation-vowel-001", focus: "vowel_signs", stage: "closure_validation", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", closureValidation_vi: "Đối chiếu i ngắn/dài và rule ਿ viết trước đọc sau.", closureValidation_en: "Validate short/long i and the rule that ਿ is written before but read after.", expected_vi: "ਕਿ và ਕੀ khác nhau bằng dấu, không chỉ bằng Latin.", expected_en: "ਕਿ and ਕੀ differ by signs, not only by Latin text.", consistencyGuard_vi: "Bắt đọc ਕਿ theo thứ tự mắt nhìn.", consistencyGuard_en: "Catches reading ਕਿ by visual order.", learnerTrap: { vi: "ਕਿ không đọc là ik.", en: "ਕਿ is not read as ik." }, verification: true },
      { id: "pa-closure-validation-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", closureValidation_vi: "Đối chiếu dấu dưới trong card nhỏ và list view.", closureValidation_en: "Validate under-letter signs in compact cards and list views.", expected_vi: "ੁ và ੂ vẫn phân biệt khi render nhỏ.", expected_en: "ੁ and ੂ remain distinct in compact rendering.", consistencyGuard_vi: "Bắt sample chỉ còn ku/kuu.", consistencyGuard_en: "Catches samples reduced to ku/kuu.", learnerTrap: { vi: "Dấu dưới dễ bị bỏ qua.", en: "Under-letter signs are easy to miss." }, preIntegration: true },
      { id: "pa-closure-validation-vowel-003", focus: "vowel_signs", stage: "final_cross_check", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", closureValidation_vi: "Đối chiếu ba dấu e, ai/ae và au trong signage.", closureValidation_en: "Validate e, ai/ae, and au signs in signage.", expected_vi: "Không đổi ਕੈ thành ਕੇ hoặc ਕੌ.", expected_en: "Does not swap ਕੈ into ਕੇ or ਕੌ.", consistencyGuard_vi: "Bắt lỗi swap vowel sign trong signage.", consistencyGuard_en: "Catches vowel-sign swaps in signage.", verification: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Small mark closure validation checks",
    title_en: "Small Mark Closure Validation Checks",
    verificationGoal_vi: "Đối chiếu addak, tippi và bindi giữa vocabulary, signage và explanation.",
    verificationGoal_en: "Validate addak, tippi, and bindi across vocabulary, signage, and explanations.",
    samples: [
      { id: "pa-closure-validation-mark-001", focus: "addak_tippi_bindi", stage: "closure_validation", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", closureValidation_vi: "Đối chiếu cụm bus stop trong transit Canada.", closureValidation_en: "Validate the bus stop chunk in Canadian transit context.", expected_vi: "Cả ਬੱਸ và ਅੱਡਾ đều giữ addak.", expected_en: "Both ਬੱਸ and ਅੱਡਾ keep addak.", consistencyGuard_vi: "Bắt normalization làm rơi ੱ.", consistencyGuard_en: "Catches normalization that drops ੱ.", learnerTrap: { vi: "Addak không phải trang trí.", en: "Addak is not decoration." }, canadaPractical: true, verification: true },
      { id: "pa-closure-validation-mark-002", focus: "addak_tippi_bindi", stage: "sanity", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", closureValidation_vi: "Đối chiếu bindi/tippi với giải thích vị trí dấu.", closureValidation_en: "Validate bindi/tippi with mark-placement explanations.", expected_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", expected_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", consistencyGuard_vi: "Bắt note nasal mark quá mơ hồ.", consistencyGuard_en: "Catches overly vague nasal-mark notes.", learnerTrap: { vi: "Romanization không cho thấy vị trí dấu.", en: "Romanization does not show mark placement." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Survival signage closure validation checks",
    title_en: "Survival Signage Closure Validation Checks",
    verificationGoal_vi: "Đối chiếu biển sinh tồn với hành động thực tế và nghĩa English/VI.",
    verificationGoal_en: "Validate survival signs with practical actions and English/Vietnamese meaning.",
    samples: [
      { id: "pa-closure-validation-sign-001", focus: "survival_signage", stage: "closure_validation", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", closureValidation_vi: "Đối chiếu exit sign với hành động tìm lối ra.", closureValidation_en: "Validate the exit sign with the action of finding an exit.", expected_vi: "Learner theo ਨਿਕਾਸ trong tòa nhà, mall hoặc clinic.", expected_en: "Learner follows ਨਿਕਾਸ in a building, mall, or clinic.", consistencyGuard_vi: "Bắt sample chỉ dịch exit mà thiếu action.", consistencyGuard_en: "Catches samples that translate exit without an action.", canadaPractical: true, verification: true },
      { id: "pa-closure-validation-sign-002", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", closureValidation_vi: "Đối chiếu emergency với hospital hoặc clinic ở Canada.", closureValidation_en: "Validate emergency with hospital or clinic context in Canada.", expected_vi: "Gurmukhi đứng trước English loanword.", expected_en: "Gurmukhi appears before the English loanword.", consistencyGuard_vi: "Bắt English thay thế chữ Gurmukhi.", consistencyGuard_en: "Catches English replacing Gurmukhi script.", canadaPractical: true, preIntegration: true },
      { id: "pa-closure-validation-sign-003", focus: "survival_signage", stage: "sanity", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", closureValidation_vi: "Đối chiếu pharmacy loanword với chữ ਫ.", closureValidation_en: "Validate the pharmacy loanword with the letter ਫ.", expected_vi: "ਫਾਰਮੇਸੀ được đọc trước pharmacy/farmacy.", expected_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", consistencyGuard_vi: "Bắt người học chỉ dựa vào English spelling.", consistencyGuard_en: "Catches learner reliance on English spelling.", learnerTrap: { vi: "Loanword quen dễ làm bỏ qua script.", en: "A familiar loanword can cause script skipping." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Service vocabulary closure validation checks",
    title_en: "Service Vocabulary Closure Validation Checks",
    verificationGoal_vi: "Đối chiếu từ dịch vụ với context Canada-practical và cụm hành động.",
    verificationGoal_en: "Validate service vocabulary with Canada-practical context and action chunks.",
    samples: [
      { id: "pa-closure-validation-service-001", focus: "service_vocabulary", stage: "closure_validation", gurmukhi: "ਦਵਾਈ", romanization: "davai", closureValidation_vi: "Đối chiếu medicine với pharmacy hoặc clinic context.", closureValidation_en: "Validate medicine with pharmacy or clinic context.", expected_vi: "ਦਵਾਈ có Gurmukhi, romanization phụ và nghĩa thuốc.", expected_en: "ਦਵਾਈ has Gurmukhi, supporting romanization, and medicine meaning.", consistencyGuard_vi: "Bắt item chỉ còn English medicine.", consistencyGuard_en: "Catches items that keep only English medicine.", canadaPractical: true, preIntegration: true },
      { id: "pa-closure-validation-service-002", focus: "service_vocabulary", stage: "final_cross_check", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", closureValidation_vi: "Đối chiếu rent với housing form hoặc notice.", closureValidation_en: "Validate rent with housing forms or notices.", expected_vi: "ਕਿਰਾਇਆ giữ nghĩa tiền thuê trong context.", expected_en: "ਕਿਰਾਇਆ keeps the rent meaning in context.", consistencyGuard_vi: "Bắt dịch rent thiếu Gurmukhi.", consistencyGuard_en: "Catches rent translations missing Gurmukhi.", canadaPractical: true, verification: true },
      { id: "pa-closure-validation-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", closureValidation_vi: "Đối chiếu ID document với service desk ở Canada.", closureValidation_en: "Validate ID document with service desks in Canada.", expected_vi: "Cụm được giữ là service chunk, không tách rời.", expected_en: "The phrase stays as a service chunk, not isolated words.", consistencyGuard_vi: "Bắt dịch từng từ làm mất workflow.", consistencyGuard_en: "Catches word-by-word translation that loses workflow.", learnerTrap: { vi: "ਪੱਤਰ trong cụm này là document/paper.", en: "ਪੱਤਰ in this chunk means document/paper." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "High-frequency verb closure validation checks",
    title_en: "High-Frequency Verb Closure Validation Checks",
    verificationGoal_vi: "Đối chiếu động từ lõi với collocation hoặc câu service, không học rời.",
    verificationGoal_en: "Validate core verbs with collocations or service sentences, not isolated study.",
    samples: [
      { id: "pa-closure-validation-verb-001", focus: "high_frequency_verbs", stage: "closure_validation", gurmukhi: "ਕਰਨਾ", romanization: "karna", closureValidation_vi: "Đối chiếu ਕਰਨਾ với action chunk như form hoặc correction.", closureValidation_en: "Validate ਕਰਨਾ with action chunks such as forms or corrections.", expected_vi: "Verb được hiểu qua hành động cụ thể.", expected_en: "The verb is understood through a concrete action.", consistencyGuard_vi: "Bắt verb deck không có context.", consistencyGuard_en: "Catches verb-deck items without context.", preIntegration: true },
      { id: "pa-closure-validation-verb-002", focus: "high_frequency_verbs", stage: "final_cross_check", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", closureValidation_vi: "Đối chiếu ਲੈਣਾ trong clinic booking.", closureValidation_en: "Validate ਲੈਣਾ in clinic booking.", expected_vi: "Cụm có nghĩa đặt/lấy lịch, không dịch ਲੈਣਾ rời.", expected_en: "The chunk means book/take an appointment, not isolated ਲੈਣਾ.", consistencyGuard_vi: "Bắt tách verb khỏi context appointment.", consistencyGuard_en: "Catches separating the verb from appointment context.", canadaPractical: true, verification: true },
      { id: "pa-closure-validation-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", closureValidation_vi: "Đối chiếu câu chưa hiểu với service support.", closureValidation_en: "Validate the did-not-understand sentence with service support.", expected_vi: "Câu đầy đủ được giữ để nói với nhân viên.", expected_en: "The full sentence is kept for speaking with staff.", consistencyGuard_vi: "Bắt sample chỉ còn verb ਸਮਝਣਾ rời.", consistencyGuard_en: "Catches samples reduced to ਸਮਝਣਾ.", canadaPractical: true, verification: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Collocation closure validation checks",
    title_en: "Collocation Closure Validation Checks",
    verificationGoal_vi: "Đối chiếu collocation như một đơn vị nghĩa với service workflow.",
    verificationGoal_en: "Validate collocations as meaning units with service workflows.",
    samples: [
      { id: "pa-closure-validation-collocation-001", focus: "collocations", stage: "closure_validation", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", closureValidation_vi: "Đối chiếu câu cần giúp đỡ với service counter.", closureValidation_en: "Validate the help request with a service counter.", expected_vi: "Giữ cả câu, không rút còn ਮਦਦ.", expected_en: "Keeps the whole sentence, not reduced to ਮਦਦ.", consistencyGuard_vi: "Bắt cắt collocation thành từ rời.", consistencyGuard_en: "Catches splitting collocations into isolated words.", canadaPractical: true, verification: true },
      { id: "pa-closure-validation-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", closureValidation_vi: "Đối chiếu fill-out-a-form với paperwork ở school, housing hoặc clinic.", closureValidation_en: "Validate fill-out-a-form with school, housing, or clinic paperwork.", expected_vi: "Cụm là một hành động đầy đủ.", expected_en: "The chunk is one complete action.", consistencyGuard_vi: "Bắt workflow chỉ còn vocabulary rời.", consistencyGuard_en: "Catches workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-closure-validation-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", closureValidation_vi: "Đối chiếu correction chunk với chữ ਠ trong ਠੀਕ.", closureValidation_en: "Validate the correction chunk with ਠ in ਠੀਕ.", expected_vi: "ਠ được giữ và không đọc như English th.", expected_en: "ਠ is preserved and not read like English th.", consistencyGuard_vi: "Bắt romanization che mất distinction của ਠ.", consistencyGuard_en: "Catches romanization hiding the ਠ distinction.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Shahmukhi awareness closure-validation",
    title_en: "Shahmukhi Awareness Closure Validation",
    verificationGoal_vi: "Đối chiếu scope để Shahmukhi chỉ là awareness và Gurmukhi vẫn primary.",
    verificationGoal_en: "Validate scope so Shahmukhi remains awareness only and Gurmukhi stays primary.",
    samples: [
      { id: "pa-closure-validation-shahmukhi-001", focus: "shahmukhi_awareness", stage: "final_cross_check", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", closureValidation_vi: "Đối chiếu note scope: Gurmukhi primary; Shahmukhi chỉ là awareness.", closureValidation_en: "Validate scope note: Gurmukhi primary; Shahmukhi is awareness only.", expected_vi: "Không biến thành khóa Shahmukhi đầy đủ.", expected_en: "Does not become a full Shahmukhi course.", consistencyGuard_vi: "Bắt nội dung Shahmukhi vượt phạm vi.", consistencyGuard_en: "Catches Shahmukhi content that exceeds scope.", verification: true },
    ],
  },
  {
    focus: "pre_integration_verification",
    title_vi: "Pre-integration verification",
    title_en: "Pre-Integration Verification",
    verificationGoal_vi: "Đối chiếu cuối để data đủ field, nhất quán nội bộ và không mở rộng scope.",
    verificationGoal_en: "Final validation that data has required fields, internal consistency, and no scope expansion.",
    samples: [
      { id: "pa-closure-validation-final-001", focus: "pre_integration_verification", stage: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim jaanch", closureValidation_vi: "Đối chiếu id, focus, stage, Gurmukhi và VI/EN trước bước sau.", closureValidation_en: "Validate id, focus, stage, Gurmukhi, and VI/EN before a later step.", expected_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", expected_en: "Data is consumable TypeScript, not loose notes.", consistencyGuard_vi: "Bắt thiếu field hoặc thiếu Gurmukhi primary.", consistencyGuard_en: "Catches missing fields or missing Gurmukhi primary.", preIntegration: true, verification: true },
      { id: "pa-closure-validation-final-002", focus: "pre_integration_verification", stage: "sanity", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", closureValidation_vi: "Đối chiếu scope và native-review wording trong data.", closureValidation_en: "Validate scope and native-review wording in the data.", expected_vi: "Native review được hoãn; không claim đã review.", expected_en: "Native review is deferred; no reviewed claim is made.", consistencyGuard_vi: "Bắt scope drift ngoài Punjabi script/vocabulary.", consistencyGuard_en: "Catches scope drift beyond Punjabi script/vocabulary.", verification: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_CLOSURE_VALIDATION_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_CLOSURE_VALIDATION_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyClosureValidationSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_CLOSURE_VALIDATION_SAMPLES;
