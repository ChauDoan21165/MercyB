// src/languages/punjabi/scriptVocabularyInventorySealSamples.ts
//
// Punjabi script/vocabulary inventory-seal samples for internal consistency.
// Native review is deferred.

export type PunjabiInventorySealFocus =
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

export type PunjabiInventorySealStage = "pre_a11_inventory_seal" | "catalog" | "bundle" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularyInventorySealSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiInventorySealFocus;
  stage: PunjabiInventorySealStage;
  gurmukhi: string;
  romanization?: string;
  inventorySeal_vi: string;
  inventorySeal_en: string;
  expected_vi: string;
  expected_en: string;
  inventorySealGuard_vi: string;
  inventorySealGuard_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  inventorySealCandidate?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularyInventorySealSection = {
  cell_id?: string;
  focus: PunjabiInventorySealFocus;
  title_vi: string;
  title_en: string;
  inventorySealGoal_vi: string;
  inventorySealGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyInventorySealSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_INVENTORY_SEAL_SCOPE = {
  vi: "Bộ inventory-seal này khóa dữ liệu Punjabi script/vocabulary sau inventory-seal và trước bước tích hợp sau: Gurmukhi là primary, romanization chỉ là bridge, vowel signs và addak/tippi/bindi được giữ, signage, service vocabulary, verbs, collocations và Shahmukhi awareness không vượt scope. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This inventory-seal set captures Punjabi script/vocabulary data after the inventory-seal pass and before a later integration step: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service vocabulary, verbs, collocations, and Shahmukhi awareness stay in scope. This is app-consumable TypeScript data; native review is deferred.",
  inventorySealDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyInventorySealSection> = [
  {
    focus: "gurmukhi_forms",
    title_vi: "Final-capture Gurmukhi forms",
    title_en: "Inventory Seal Gurmukhi Forms",
    inventorySealGoal_vi: "Khóa các form Gurmukhi làm anchor chính để Latin không thay thế ở bước sau.",
    inventorySealGoal_en: "Capture Gurmukhi forms as the main anchors so Latin text cannot replace them later.",
    samples: [
      { id: "pa-inventory-seal-gurmukhi-001", focus: "gurmukhi_forms", stage: "pre_a11_inventory_seal", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", inventorySeal_vi: "Khóa tên ngôn ngữ bằng Gurmukhi trước mọi variant Latin.", inventorySeal_en: "Capture the language name in Gurmukhi before any Latin variant.", expected_vi: "ਪੰਜਾਬੀ là form hiển thị chính trong acceptance sample.", expected_en: "ਪੰਜਾਬੀ is the primary display form in the acceptance sample.", inventorySealGuard_vi: "Bắt nội dung chỉ còn Punjabi/Panjabi.", inventorySealGuard_en: "Catches content reduced to Punjabi/Panjabi only.", learnerTrap: { vi: "Latin không cho thấy tippi trong ਪੰਜਾਬੀ.", en: "Latin does not show tippi in ਪੰਜਾਬੀ." }, inventorySealCandidate: true },
      { id: "pa-inventory-seal-gurmukhi-002", focus: "gurmukhi_forms", stage: "catalog", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", inventorySeal_vi: "Khóa prompt đọc để bắt đầu từ chữ Gurmukhi.", inventorySeal_en: "Capture the reading prompt so it begins from Gurmukhi script.", expected_vi: "Learner đọc ਪੜ੍ਹੋ trước khi nhìn romanization.", expected_en: "The learner reads ਪੜ੍ਹੋ before looking at romanization.", inventorySealGuard_vi: "Bắt prompt Latin-first trong final handoff.", inventorySealGuard_en: "Catches Latin-first prompts in final handoff.", preIntegration: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Final-capture romanization bridge",
    title_en: "Inventory Seal Romanization Bridge",
    inventorySealGoal_vi: "Khóa romanization như bridge phụ, không phải nguồn dữ liệu chính.",
    inventorySealGoal_en: "Capture romanization as a supporting bridge, not the main data source.",
    samples: [
      { id: "pa-inventory-seal-roman-001", focus: "romanization_bridge", stage: "pre_a11_inventory_seal", gurmukhi: "ਫਲ", romanization: "phal/fal", inventorySeal_vi: "Khóa ph/f như variant trỏ về cùng chữ ਫਲ.", inventorySeal_en: "Capture ph/f as variants pointing to the same ਫਲ form.", expected_vi: "Không tạo hai entry chỉ vì spelling Latin khác.", expected_en: "Does not create two entries only because Latin spelling differs.", inventorySealGuard_vi: "Bắt duplicate romanization-only.", inventorySealGuard_en: "Catches romanization-only duplicates.", learnerTrap: { vi: "ਫ mới là anchor, ph/f là cầu phụ.", en: "ਫ is the anchor; ph/f are helper bridges." }, inventorySealCandidate: true },
      { id: "pa-inventory-seal-roman-002", focus: "romanization_bridge", stage: "sanity", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", inventorySeal_vi: "Khóa v/w như bridge cho một form Gurmukhi.", inventorySeal_en: "Capture v/w as bridges for one Gurmukhi form.", expected_vi: "ਵੱਡਾ giữ addak và không bị tách thành hai từ Latin.", expected_en: "ਵੱਡਾ keeps addak and is not split into two Latin words.", inventorySealGuard_vi: "Bắt romanization làm rơi addak.", inventorySealGuard_en: "Catches romanization causing addak loss.", learnerTrap: { vi: "v/w không quyết định nghĩa riêng.", en: "v/w does not decide a separate meaning." } },
      { id: "pa-inventory-seal-roman-003", focus: "romanization_bridge", stage: "pre_integration", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", inventorySeal_vi: "Khóa ਸ਼ có dấu dưới để không trộn với ਸ.", inventorySeal_en: "Capture marked ਸ਼ so it is not merged with ਸ.", expected_vi: "Form Gurmukhi có dấu dưới vẫn được giữ trong dữ liệu.", expected_en: "The Gurmukhi form with the lower mark remains in the data.", inventorySealGuard_vi: "Bắt normalization sai của ਸ਼.", inventorySealGuard_en: "Catches incorrect normalization of ਸ਼.", learnerTrap: { vi: "ਸ਼ và ਸ không giống nhau.", en: "ਸ਼ and ਸ are not the same." }, preIntegration: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Final-capture vowel signs",
    title_en: "Inventory Seal Vowel Signs",
    inventorySealGoal_vi: "Khóa dấu nguyên âm để list view và card nhỏ không làm mất đối lập.",
    inventorySealGoal_en: "Capture vowel signs so list views and compact cards do not lose contrasts.",
    samples: [
      { id: "pa-inventory-seal-vowel-001", focus: "vowel_signs", stage: "catalog", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", inventorySeal_vi: "Khóa i ngắn/dài và rule ਿ viết trước đọc sau.", inventorySeal_en: "Capture short/long i and the rule that ਿ is written before but read after.", expected_vi: "ਕਿ và ਕੀ khác bằng dấu, không chỉ bằng Latin.", expected_en: "ਕਿ and ਕੀ differ by signs, not only Latin spelling.", inventorySealGuard_vi: "Bắt đọc visual-order của ਕਿ.", inventorySealGuard_en: "Catches visual-order reading of ਕਿ.", learnerTrap: { vi: "ਕਿ không đọc là ik.", en: "ਕਿ is not read as ik." }, inventorySealCandidate: true },
      { id: "pa-inventory-seal-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", inventorySeal_vi: "Khóa dấu dưới trong UI compact.", inventorySeal_en: "Capture under-letter signs in compact UI.", expected_vi: "ੁ và ੂ vẫn phân biệt khi render nhỏ.", expected_en: "ੁ and ੂ remain distinct when rendered small.", inventorySealGuard_vi: "Bắt fallback chỉ còn ku/kuu.", inventorySealGuard_en: "Catches fallback reduced to ku/kuu.", learnerTrap: { vi: "Dấu dưới rất dễ bị bỏ qua.", en: "Under-letter signs are easy to miss." }, preIntegration: true },
      { id: "pa-inventory-seal-vowel-003", focus: "vowel_signs", stage: "sanity", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", inventorySeal_vi: "Khóa ba dấu e, ai và au trong sample signage.", inventorySeal_en: "Capture e, ai, and au signs in signage samples.", expected_vi: "Không đổi ਕੈ thành ਕੇ hoặc ਕੌ.", expected_en: "Does not swap ਕੈ into ਕੇ or ਕੌ.", inventorySealGuard_vi: "Bắt swap vowel sign trước freeze.", inventorySealGuard_en: "Catches vowel-sign swaps before freeze.", inventorySealCandidate: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Final-capture small marks",
    title_en: "Inventory Seal Small Marks",
    inventorySealGoal_vi: "Khóa addak, tippi và bindi trong vocabulary có rủi ro mất dấu.",
    inventorySealGoal_en: "Capture addak, tippi, and bindi in vocabulary where small marks are easy to lose.",
    samples: [
      { id: "pa-inventory-seal-mark-001", focus: "addak_tippi_bindi", stage: "pre_a11_inventory_seal", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", inventorySeal_vi: "Khóa cụm bus stop Canada với addak ở cả hai từ.", inventorySeal_en: "Capture the Canadian bus-stop chunk with addak in both words.", expected_vi: "ਬੱਸ và ਅੱਡਾ đều giữ ੱ trong cụm transit.", expected_en: "ਬੱਸ and ਅੱਡਾ both keep ੱ in the transit chunk.", inventorySealGuard_vi: "Bắt normalization làm rơi addak.", inventorySealGuard_en: "Catches normalization that drops addak.", learnerTrap: { vi: "Addak không phải dấu trang trí.", en: "Addak is not decorative." }, canadaPractical: true, inventorySealCandidate: true },
      { id: "pa-inventory-seal-mark-002", focus: "addak_tippi_bindi", stage: "bundle", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", inventorySeal_vi: "Khóa bindi và tippi với giải thích vị trí dấu.", inventorySeal_en: "Capture bindi and tippi with mark-placement explanations.", expected_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", expected_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", inventorySealGuard_vi: "Bắt note nasal mark quá chung chung.", inventorySealGuard_en: "Catches overly generic nasal-mark notes.", learnerTrap: { vi: "Romanization không cho thấy vị trí dấu.", en: "Romanization does not show mark placement." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Final-capture survival signage",
    title_en: "Inventory Seal Survival Signage",
    inventorySealGoal_vi: "Khóa biển sinh tồn bằng chữ Gurmukhi và hành động Canada-practical.",
    inventorySealGoal_en: "Capture survival signs with Gurmukhi text and Canada-practical actions.",
    samples: [
      { id: "pa-inventory-seal-sign-001", focus: "survival_signage", stage: "bundle", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", inventorySeal_vi: "Khóa exit sign với hành động tìm lối ra.", inventorySeal_en: "Capture the exit sign with the action of finding an exit.", expected_vi: "Learner theo ਨਿਕਾਸ trong mall, clinic hoặc building.", expected_en: "Learner follows ਨਿਕਾਸ in a mall, clinic, or building.", inventorySealGuard_vi: "Bắt sample chỉ dịch exit mà thiếu action.", inventorySealGuard_en: "Catches samples that translate exit without action.", canadaPractical: true, inventorySealCandidate: true },
      { id: "pa-inventory-seal-sign-002", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", inventorySeal_vi: "Khóa emergency với context hospital hoặc clinic.", inventorySeal_en: "Capture emergency with hospital or clinic context.", expected_vi: "Gurmukhi đứng trước English loanword.", expected_en: "Gurmukhi appears before the English loanword.", inventorySealGuard_vi: "Bắt English thay thế Gurmukhi.", inventorySealGuard_en: "Catches English replacing Gurmukhi.", canadaPractical: true, preIntegration: true },
      { id: "pa-inventory-seal-sign-003", focus: "survival_signage", stage: "sanity", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", inventorySeal_vi: "Khóa pharmacy loanword để learner vẫn đọc script.", inventorySeal_en: "Capture the pharmacy loanword so the learner still reads script.", expected_vi: "ਫਾਰਮੇਸੀ đọc trước pharmacy/farmacy.", expected_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", inventorySealGuard_vi: "Bắt loanword làm người học bỏ qua script.", inventorySealGuard_en: "Catches loanwords causing script skipping.", learnerTrap: { vi: "Loanword quen không thay thế Gurmukhi.", en: "A familiar loanword does not replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Final-capture service vocabulary",
    title_en: "Inventory Seal Service Vocabulary",
    inventorySealGoal_vi: "Khóa từ dịch vụ với workflow thực tế để không chỉ còn glossary rời.",
    inventorySealGoal_en: "Capture service words with practical workflows so they are not isolated glossary items.",
    samples: [
      { id: "pa-inventory-seal-service-001", focus: "service_vocabulary", stage: "pre_a11_inventory_seal", gurmukhi: "ਦਵਾਈ", romanization: "davai", inventorySeal_vi: "Khóa medicine với pharmacy hoặc clinic context.", inventorySeal_en: "Capture medicine with pharmacy or clinic context.", expected_vi: "ਦਵਾਈ có script, romanization phụ và nghĩa thuốc.", expected_en: "ਦਵਾਈ has script, helper romanization, and medicine meaning.", inventorySealGuard_vi: "Bắt item chỉ còn English medicine.", inventorySealGuard_en: "Catches items that keep only English medicine.", canadaPractical: true, preIntegration: true },
      { id: "pa-inventory-seal-service-002", focus: "service_vocabulary", stage: "bundle", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", inventorySeal_vi: "Khóa rent với housing notice hoặc form.", inventorySeal_en: "Capture rent with a housing notice or form.", expected_vi: "ਕਿਰਾਇਆ giữ nghĩa tiền thuê trong context.", expected_en: "ਕਿਰਾਇਆ keeps the rent meaning in context.", inventorySealGuard_vi: "Bắt bản dịch rent thiếu Gurmukhi.", inventorySealGuard_en: "Catches rent translations missing Gurmukhi.", canadaPractical: true, inventorySealCandidate: true },
      { id: "pa-inventory-seal-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", inventorySeal_vi: "Khóa ID document như service chunk.", inventorySeal_en: "Capture ID document as a service chunk.", expected_vi: "Cụm giữ nguyên khi dùng ở service desk.", expected_en: "The phrase stays intact at a service desk.", inventorySealGuard_vi: "Bắt dịch từng từ làm mất workflow.", inventorySealGuard_en: "Catches word-by-word translation that loses workflow.", learnerTrap: { vi: "ਪੱਤਰ ở đây là document/paper.", en: "ਪੱਤਰ here means document/paper." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Final-capture high-frequency verbs",
    title_en: "Inventory Seal High-Frequency Verbs",
    inventorySealGoal_vi: "Khóa động từ lõi trong action chunks để learner không học rời.",
    inventorySealGoal_en: "Capture core verbs in action chunks so learners do not study them in isolation.",
    samples: [
      { id: "pa-inventory-seal-verb-001", focus: "high_frequency_verbs", stage: "bundle", gurmukhi: "ਕਰਨਾ", romanization: "karna", inventorySeal_vi: "Khóa ਕਰਨਾ cùng action như form hoặc correction.", inventorySeal_en: "Capture ਕਰਨਾ with actions such as forms or corrections.", expected_vi: "Verb được hiểu qua hành động cụ thể.", expected_en: "The verb is understood through a concrete action.", inventorySealGuard_vi: "Bắt verb card không có context.", inventorySealGuard_en: "Catches verb cards without context.", preIntegration: true },
      { id: "pa-inventory-seal-verb-002", focus: "high_frequency_verbs", stage: "pre_a11_inventory_seal", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", inventorySeal_vi: "Khóa ਲੈਣਾ trong clinic booking.", inventorySeal_en: "Capture ਲੈਣਾ in clinic booking.", expected_vi: "Cụm nghĩa là đặt/lấy lịch, không dịch ਲੈਣਾ rời.", expected_en: "The chunk means book/take an appointment, not isolated ਲੈਣਾ.", inventorySealGuard_vi: "Bắt tách verb khỏi appointment context.", inventorySealGuard_en: "Catches separating the verb from appointment context.", canadaPractical: true, inventorySealCandidate: true },
      { id: "pa-inventory-seal-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", inventorySeal_vi: "Khóa câu chưa hiểu với service support.", inventorySeal_en: "Capture the did-not-understand sentence with service support.", expected_vi: "Câu đầy đủ dùng được với nhân viên.", expected_en: "The full sentence can be used with staff.", inventorySealGuard_vi: "Bắt sample rút còn verb ਸਮਝਣਾ.", inventorySealGuard_en: "Catches samples reduced to ਸਮਝਣਾ.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Final-capture collocations",
    title_en: "Inventory Seal Collocations",
    inventorySealGoal_vi: "Khóa collocation như một đơn vị nghĩa trong workflow.",
    inventorySealGoal_en: "Capture collocations as meaning units inside workflows.",
    samples: [
      { id: "pa-inventory-seal-collocation-001", focus: "collocations", stage: "bundle", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", inventorySeal_vi: "Khóa câu cần giúp đỡ tại service counter.", inventorySeal_en: "Capture the help request at a service counter.", expected_vi: "Giữ cả câu, không rút còn ਮਦਦ.", expected_en: "Keeps the whole sentence, not reduced to ਮਦਦ.", inventorySealGuard_vi: "Bắt cắt collocation thành từ rời.", inventorySealGuard_en: "Catches splitting collocations into isolated words.", canadaPractical: true, inventorySealCandidate: true },
      { id: "pa-inventory-seal-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", inventorySeal_vi: "Khóa fill-out-a-form cho school, housing hoặc clinic paperwork.", inventorySeal_en: "Capture fill-out-a-form for school, housing, or clinic paperwork.", expected_vi: "Cụm là một hành động đầy đủ.", expected_en: "The chunk is one complete action.", inventorySealGuard_vi: "Bắt workflow chỉ còn vocabulary rời.", inventorySealGuard_en: "Catches workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-inventory-seal-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", inventorySeal_vi: "Khóa correction chunk với chữ ਠ trong ਠੀਕ.", inventorySeal_en: "Capture the correction chunk with ਠ in ਠੀਕ.", expected_vi: "ਠ được giữ và không đọc như English th.", expected_en: "ਠ is preserved and not read like English th.", inventorySealGuard_vi: "Bắt romanization che mất distinction của ਠ.", inventorySealGuard_en: "Catches romanization hiding the ਠ distinction.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Final-capture Shahmukhi awareness",
    title_en: "Inventory Seal Shahmukhi Awareness",
    inventorySealGoal_vi: "Khóa scope để Shahmukhi chỉ là awareness và Gurmukhi vẫn primary.",
    inventorySealGoal_en: "Capture scope so Shahmukhi remains awareness only and Gurmukhi stays primary.",
    samples: [
      { id: "pa-inventory-seal-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_a11_inventory_seal", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", inventorySeal_vi: "Khóa scope: Gurmukhi primary; Shahmukhi chỉ là awareness.", inventorySeal_en: "Capture scope: Gurmukhi primary; Shahmukhi is awareness only.", expected_vi: "Không biến thành khóa Shahmukhi đầy đủ.", expected_en: "Does not become a full Shahmukhi course.", inventorySealGuard_vi: "Bắt nội dung Shahmukhi vượt phạm vi.", inventorySealGuard_en: "Catches Shahmukhi content that exceeds scope.", inventorySealCandidate: true },
    ],
  },
  {
    focus: "pre_integration_verification",
    title_vi: "Final-capture pre-integration verification",
    title_en: "Inventory Seal Pre-Integration Verification",
    inventorySealGoal_vi: "Khóa kiểm tra cuối về field, scope và wording trước bước sau.",
    inventorySealGoal_en: "Capture final checks for fields, scope, and wording before a later step.",
    samples: [
      { id: "pa-inventory-seal-final-001", focus: "pre_integration_verification", stage: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਤਾਲਾ", romanization: "antim tala", inventorySeal_vi: "Khóa id, focus, stage, Gurmukhi và VI/EN.", inventorySeal_en: "Capture id, focus, stage, Gurmukhi, and VI/EN.", expected_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", expected_en: "Data is consumable TypeScript, not loose notes.", inventorySealGuard_vi: "Bắt thiếu field hoặc thiếu Gurmukhi primary.", inventorySealGuard_en: "Catches missing fields or missing Gurmukhi primary.", preIntegration: true, inventorySealCandidate: true },
      { id: "pa-inventory-seal-final-002", focus: "pre_integration_verification", stage: "sanity", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", inventorySeal_vi: "Khóa wording native-review và scope Punjabi script/vocabulary.", inventorySeal_en: "Capture native-review wording and Punjabi script/vocabulary scope.", expected_vi: "Native review được hoãn; không claim đã review.", expected_en: "Native review is deferred; no reviewed claim is made.", inventorySealGuard_vi: "Bắt scope drift ngoài Punjabi script/vocabulary.", inventorySealGuard_en: "Catches scope drift beyond Punjabi script/vocabulary.", preIntegration: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_INVENTORY_SEAL_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_INVENTORY_SEAL_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyInventorySealSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_INVENTORY_SEAL_SAMPLES;
