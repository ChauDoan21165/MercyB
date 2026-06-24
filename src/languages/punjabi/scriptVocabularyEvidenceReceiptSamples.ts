// src/languages/punjabi/scriptVocabularyEvidenceReceiptSamples.ts
//
// Punjabi script/vocabulary evidence-receipt samples for internal consistency.
// Native review is deferred.

export type PunjabiEvidenceReceiptFocus =
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

export type PunjabiEvidenceReceiptStage = "pre_a11_evidence_receipt" | "completion_record" | "inventory_seal" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularyEvidenceReceiptSample = {
  id: string;
  focus: PunjabiEvidenceReceiptFocus;
  stage: PunjabiEvidenceReceiptStage;
  gurmukhi: string;
  romanization?: string;
  evidenceReceipt_vi: string;
  evidenceReceipt_en: string;
  expected_vi: string;
  expected_en: string;
  evidenceReceiptGuard_vi: string;
  evidenceReceiptGuard_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  evidenceReceiptCandidate?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularyEvidenceReceiptSection = {
  focus: PunjabiEvidenceReceiptFocus;
  title_vi: string;
  title_en: string;
  evidenceReceiptGoal_vi: string;
  evidenceReceiptGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyEvidenceReceiptSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_EVIDENCE_RECEIPT_SCOPE = {
  vi: "Bộ evidence-receipt này khóa dữ liệu Punjabi script/vocabulary sau evidence-receipt và trước bước tích hợp sau: Gurmukhi là primary, romanization chỉ là bridge, vowel signs và addak/tippi/bindi được giữ, signage, service vocabulary, verbs, collocations và Shahmukhi awareness không vượt scope. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This evidence-receipt set captures Punjabi script/vocabulary data after the evidence-receipt pass and before a later integration step: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service vocabulary, verbs, collocations, and Shahmukhi awareness stay in scope. This is app-consumable TypeScript data; native review is deferred.",
  evidenceReceiptDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyEvidenceReceiptSection> = [
  {
    focus: "gurmukhi_forms",
    title_vi: "Final-capture Gurmukhi forms",
    title_en: "Evidence Receipt Gurmukhi Forms",
    evidenceReceiptGoal_vi: "Khóa các form Gurmukhi làm anchor chính để Latin không thay thế ở bước sau.",
    evidenceReceiptGoal_en: "Capture Gurmukhi forms as the main anchors so Latin text cannot replace them later.",
    samples: [
      { id: "pa-evidence-receipt-gurmukhi-001", focus: "gurmukhi_forms", stage: "pre_a11_evidence_receipt", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", evidenceReceipt_vi: "Khóa tên ngôn ngữ bằng Gurmukhi trước mọi variant Latin.", evidenceReceipt_en: "Capture the language name in Gurmukhi before any Latin variant.", expected_vi: "ਪੰਜਾਬੀ là form hiển thị chính trong acceptance sample.", expected_en: "ਪੰਜਾਬੀ is the primary display form in the acceptance sample.", evidenceReceiptGuard_vi: "Bắt nội dung chỉ còn Punjabi/Panjabi.", evidenceReceiptGuard_en: "Catches content reduced to Punjabi/Panjabi only.", learnerTrap: { vi: "Latin không cho thấy tippi trong ਪੰਜਾਬੀ.", en: "Latin does not show tippi in ਪੰਜਾਬੀ." }, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-gurmukhi-002", focus: "gurmukhi_forms", stage: "completion_record", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", evidenceReceipt_vi: "Khóa prompt đọc để bắt đầu từ chữ Gurmukhi.", evidenceReceipt_en: "Capture the reading prompt so it begins from Gurmukhi script.", expected_vi: "Learner đọc ਪੜ੍ਹੋ trước khi nhìn romanization.", expected_en: "The learner reads ਪੜ੍ਹੋ before looking at romanization.", evidenceReceiptGuard_vi: "Bắt prompt Latin-first trong final handoff.", evidenceReceiptGuard_en: "Catches Latin-first prompts in final handoff.", preIntegration: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Final-capture romanization bridge",
    title_en: "Evidence Receipt Romanization Bridge",
    evidenceReceiptGoal_vi: "Khóa romanization như bridge phụ, không phải nguồn dữ liệu chính.",
    evidenceReceiptGoal_en: "Capture romanization as a supporting bridge, not the main data source.",
    samples: [
      { id: "pa-evidence-receipt-roman-001", focus: "romanization_bridge", stage: "pre_a11_evidence_receipt", gurmukhi: "ਫਲ", romanization: "phal/fal", evidenceReceipt_vi: "Khóa ph/f như variant trỏ về cùng chữ ਫਲ.", evidenceReceipt_en: "Capture ph/f as variants pointing to the same ਫਲ form.", expected_vi: "Không tạo hai entry chỉ vì spelling Latin khác.", expected_en: "Does not create two entries only because Latin spelling differs.", evidenceReceiptGuard_vi: "Bắt duplicate romanization-only.", evidenceReceiptGuard_en: "Catches romanization-only duplicates.", learnerTrap: { vi: "ਫ mới là anchor, ph/f là cầu phụ.", en: "ਫ is the anchor; ph/f are helper bridges." }, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-roman-002", focus: "romanization_bridge", stage: "sanity", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", evidenceReceipt_vi: "Khóa v/w như bridge cho một form Gurmukhi.", evidenceReceipt_en: "Capture v/w as bridges for one Gurmukhi form.", expected_vi: "ਵੱਡਾ giữ addak và không bị tách thành hai từ Latin.", expected_en: "ਵੱਡਾ keeps addak and is not split into two Latin words.", evidenceReceiptGuard_vi: "Bắt romanization làm rơi addak.", evidenceReceiptGuard_en: "Catches romanization causing addak loss.", learnerTrap: { vi: "v/w không quyết định nghĩa riêng.", en: "v/w does not decide a separate meaning." } },
      { id: "pa-evidence-receipt-roman-003", focus: "romanization_bridge", stage: "pre_integration", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", evidenceReceipt_vi: "Khóa ਸ਼ có dấu dưới để không trộn với ਸ.", evidenceReceipt_en: "Capture marked ਸ਼ so it is not merged with ਸ.", expected_vi: "Form Gurmukhi có dấu dưới vẫn được giữ trong dữ liệu.", expected_en: "The Gurmukhi form with the lower mark remains in the data.", evidenceReceiptGuard_vi: "Bắt normalization sai của ਸ਼.", evidenceReceiptGuard_en: "Catches incorrect normalization of ਸ਼.", learnerTrap: { vi: "ਸ਼ và ਸ không giống nhau.", en: "ਸ਼ and ਸ are not the same." }, preIntegration: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Final-capture vowel signs",
    title_en: "Evidence Receipt Vowel Signs",
    evidenceReceiptGoal_vi: "Khóa dấu nguyên âm để list view và card nhỏ không làm mất đối lập.",
    evidenceReceiptGoal_en: "Capture vowel signs so list views and compact cards do not lose contrasts.",
    samples: [
      { id: "pa-evidence-receipt-vowel-001", focus: "vowel_signs", stage: "completion_record", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", evidenceReceipt_vi: "Khóa i ngắn/dài và rule ਿ viết trước đọc sau.", evidenceReceipt_en: "Capture short/long i and the rule that ਿ is written before but read after.", expected_vi: "ਕਿ và ਕੀ khác bằng dấu, không chỉ bằng Latin.", expected_en: "ਕਿ and ਕੀ differ by signs, not only Latin spelling.", evidenceReceiptGuard_vi: "Bắt đọc visual-order của ਕਿ.", evidenceReceiptGuard_en: "Catches visual-order reading of ਕਿ.", learnerTrap: { vi: "ਕਿ không đọc là ik.", en: "ਕਿ is not read as ik." }, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", evidenceReceipt_vi: "Khóa dấu dưới trong UI compact.", evidenceReceipt_en: "Capture under-letter signs in compact UI.", expected_vi: "ੁ và ੂ vẫn phân biệt khi render nhỏ.", expected_en: "ੁ and ੂ remain distinct when rendered small.", evidenceReceiptGuard_vi: "Bắt fallback chỉ còn ku/kuu.", evidenceReceiptGuard_en: "Catches fallback reduced to ku/kuu.", learnerTrap: { vi: "Dấu dưới rất dễ bị bỏ qua.", en: "Under-letter signs are easy to miss." }, preIntegration: true },
      { id: "pa-evidence-receipt-vowel-003", focus: "vowel_signs", stage: "sanity", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", evidenceReceipt_vi: "Khóa ba dấu e, ai và au trong sample signage.", evidenceReceipt_en: "Capture e, ai, and au signs in signage samples.", expected_vi: "Không đổi ਕੈ thành ਕੇ hoặc ਕੌ.", expected_en: "Does not swap ਕੈ into ਕੇ or ਕੌ.", evidenceReceiptGuard_vi: "Bắt swap vowel sign trước freeze.", evidenceReceiptGuard_en: "Catches vowel-sign swaps before freeze.", evidenceReceiptCandidate: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Final-capture small marks",
    title_en: "Evidence Receipt Small Marks",
    evidenceReceiptGoal_vi: "Khóa addak, tippi và bindi trong vocabulary có rủi ro mất dấu.",
    evidenceReceiptGoal_en: "Capture addak, tippi, and bindi in vocabulary where small marks are easy to lose.",
    samples: [
      { id: "pa-evidence-receipt-mark-001", focus: "addak_tippi_bindi", stage: "pre_a11_evidence_receipt", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", evidenceReceipt_vi: "Khóa cụm bus stop Canada với addak ở cả hai từ.", evidenceReceipt_en: "Capture the Canadian bus-stop chunk with addak in both words.", expected_vi: "ਬੱਸ và ਅੱਡਾ đều giữ ੱ trong cụm transit.", expected_en: "ਬੱਸ and ਅੱਡਾ both keep ੱ in the transit chunk.", evidenceReceiptGuard_vi: "Bắt normalization làm rơi addak.", evidenceReceiptGuard_en: "Catches normalization that drops addak.", learnerTrap: { vi: "Addak không phải dấu trang trí.", en: "Addak is not decorative." }, canadaPractical: true, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-mark-002", focus: "addak_tippi_bindi", stage: "inventory_seal", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", evidenceReceipt_vi: "Khóa bindi và tippi với giải thích vị trí dấu.", evidenceReceipt_en: "Capture bindi and tippi with mark-placement explanations.", expected_vi: "Nêu rõ ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", expected_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", evidenceReceiptGuard_vi: "Bắt note nasal mark quá chung chung.", evidenceReceiptGuard_en: "Catches overly generic nasal-mark notes.", learnerTrap: { vi: "Romanization không cho thấy vị trí dấu.", en: "Romanization does not show mark placement." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Final-capture survival signage",
    title_en: "Evidence Receipt Survival Signage",
    evidenceReceiptGoal_vi: "Khóa biển sinh tồn bằng chữ Gurmukhi và hành động Canada-practical.",
    evidenceReceiptGoal_en: "Capture survival signs with Gurmukhi text and Canada-practical actions.",
    samples: [
      { id: "pa-evidence-receipt-sign-001", focus: "survival_signage", stage: "inventory_seal", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", evidenceReceipt_vi: "Khóa exit sign với hành động tìm lối ra.", evidenceReceipt_en: "Capture the exit sign with the action of finding an exit.", expected_vi: "Learner theo ਨਿਕਾਸ trong mall, clinic hoặc building.", expected_en: "Learner follows ਨਿਕਾਸ in a mall, clinic, or building.", evidenceReceiptGuard_vi: "Bắt sample chỉ dịch exit mà thiếu action.", evidenceReceiptGuard_en: "Catches samples that translate exit without action.", canadaPractical: true, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-sign-002", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", evidenceReceipt_vi: "Khóa emergency với context hospital hoặc clinic.", evidenceReceipt_en: "Capture emergency with hospital or clinic context.", expected_vi: "Gurmukhi đứng trước English loanword.", expected_en: "Gurmukhi appears before the English loanword.", evidenceReceiptGuard_vi: "Bắt English thay thế Gurmukhi.", evidenceReceiptGuard_en: "Catches English replacing Gurmukhi.", canadaPractical: true, preIntegration: true },
      { id: "pa-evidence-receipt-sign-003", focus: "survival_signage", stage: "sanity", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", evidenceReceipt_vi: "Khóa pharmacy loanword để learner vẫn đọc script.", evidenceReceipt_en: "Capture the pharmacy loanword so the learner still reads script.", expected_vi: "ਫਾਰਮੇਸੀ đọc trước pharmacy/farmacy.", expected_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", evidenceReceiptGuard_vi: "Bắt loanword làm người học bỏ qua script.", evidenceReceiptGuard_en: "Catches loanwords causing script skipping.", learnerTrap: { vi: "Loanword quen không thay thế Gurmukhi.", en: "A familiar loanword does not replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Final-capture service vocabulary",
    title_en: "Evidence Receipt Service Vocabulary",
    evidenceReceiptGoal_vi: "Khóa từ dịch vụ với workflow thực tế để không chỉ còn glossary rời.",
    evidenceReceiptGoal_en: "Capture service words with practical workflows so they are not isolated glossary items.",
    samples: [
      { id: "pa-evidence-receipt-service-001", focus: "service_vocabulary", stage: "pre_a11_evidence_receipt", gurmukhi: "ਦਵਾਈ", romanization: "davai", evidenceReceipt_vi: "Khóa medicine với pharmacy hoặc clinic context.", evidenceReceipt_en: "Capture medicine with pharmacy or clinic context.", expected_vi: "ਦਵਾਈ có script, romanization phụ và nghĩa thuốc.", expected_en: "ਦਵਾਈ has script, helper romanization, and medicine meaning.", evidenceReceiptGuard_vi: "Bắt item chỉ còn English medicine.", evidenceReceiptGuard_en: "Catches items that keep only English medicine.", canadaPractical: true, preIntegration: true },
      { id: "pa-evidence-receipt-service-002", focus: "service_vocabulary", stage: "inventory_seal", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", evidenceReceipt_vi: "Khóa rent với housing notice hoặc form.", evidenceReceipt_en: "Capture rent with a housing notice or form.", expected_vi: "ਕਿਰਾਇਆ giữ nghĩa tiền thuê trong context.", expected_en: "ਕਿਰਾਇਆ keeps the rent meaning in context.", evidenceReceiptGuard_vi: "Bắt bản dịch rent thiếu Gurmukhi.", evidenceReceiptGuard_en: "Catches rent translations missing Gurmukhi.", canadaPractical: true, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", evidenceReceipt_vi: "Khóa ID document như service chunk.", evidenceReceipt_en: "Capture ID document as a service chunk.", expected_vi: "Cụm giữ nguyên khi dùng ở service desk.", expected_en: "The phrase stays intact at a service desk.", evidenceReceiptGuard_vi: "Bắt dịch từng từ làm mất workflow.", evidenceReceiptGuard_en: "Catches word-by-word translation that loses workflow.", learnerTrap: { vi: "ਪੱਤਰ ở đây là document/paper.", en: "ਪੱਤਰ here means document/paper." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Final-capture high-frequency verbs",
    title_en: "Evidence Receipt High-Frequency Verbs",
    evidenceReceiptGoal_vi: "Khóa động từ lõi trong action chunks để learner không học rời.",
    evidenceReceiptGoal_en: "Capture core verbs in action chunks so learners do not study them in isolation.",
    samples: [
      { id: "pa-evidence-receipt-verb-001", focus: "high_frequency_verbs", stage: "inventory_seal", gurmukhi: "ਕਰਨਾ", romanization: "karna", evidenceReceipt_vi: "Khóa ਕਰਨਾ cùng action như form hoặc correction.", evidenceReceipt_en: "Capture ਕਰਨਾ with actions such as forms or corrections.", expected_vi: "Verb được hiểu qua hành động cụ thể.", expected_en: "The verb is understood through a concrete action.", evidenceReceiptGuard_vi: "Bắt verb card không có context.", evidenceReceiptGuard_en: "Catches verb cards without context.", preIntegration: true },
      { id: "pa-evidence-receipt-verb-002", focus: "high_frequency_verbs", stage: "pre_a11_evidence_receipt", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", evidenceReceipt_vi: "Khóa ਲੈਣਾ trong clinic booking.", evidenceReceipt_en: "Capture ਲੈਣਾ in clinic booking.", expected_vi: "Cụm nghĩa là đặt/lấy lịch, không dịch ਲੈਣਾ rời.", expected_en: "The chunk means book/take an appointment, not isolated ਲੈਣਾ.", evidenceReceiptGuard_vi: "Bắt tách verb khỏi appointment context.", evidenceReceiptGuard_en: "Catches separating the verb from appointment context.", canadaPractical: true, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", evidenceReceipt_vi: "Khóa câu chưa hiểu với service support.", evidenceReceipt_en: "Capture the did-not-understand sentence with service support.", expected_vi: "Câu đầy đủ dùng được với nhân viên.", expected_en: "The full sentence can be used with staff.", evidenceReceiptGuard_vi: "Bắt sample rút còn verb ਸਮਝਣਾ.", evidenceReceiptGuard_en: "Catches samples reduced to ਸਮਝਣਾ.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Final-capture collocations",
    title_en: "Evidence Receipt Collocations",
    evidenceReceiptGoal_vi: "Khóa collocation như một đơn vị nghĩa trong workflow.",
    evidenceReceiptGoal_en: "Capture collocations as meaning units inside workflows.",
    samples: [
      { id: "pa-evidence-receipt-collocation-001", focus: "collocations", stage: "inventory_seal", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", evidenceReceipt_vi: "Khóa câu cần giúp đỡ tại service counter.", evidenceReceipt_en: "Capture the help request at a service counter.", expected_vi: "Giữ cả câu, không rút còn ਮਦਦ.", expected_en: "Keeps the whole sentence, not reduced to ਮਦਦ.", evidenceReceiptGuard_vi: "Bắt cắt collocation thành từ rời.", evidenceReceiptGuard_en: "Catches splitting collocations into isolated words.", canadaPractical: true, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", evidenceReceipt_vi: "Khóa fill-out-a-form cho school, housing hoặc clinic paperwork.", evidenceReceipt_en: "Capture fill-out-a-form for school, housing, or clinic paperwork.", expected_vi: "Cụm là một hành động đầy đủ.", expected_en: "The chunk is one complete action.", evidenceReceiptGuard_vi: "Bắt workflow chỉ còn vocabulary rời.", evidenceReceiptGuard_en: "Catches workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-evidence-receipt-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", evidenceReceipt_vi: "Khóa correction chunk với chữ ਠ trong ਠੀਕ.", evidenceReceipt_en: "Capture the correction chunk with ਠ in ਠੀਕ.", expected_vi: "ਠ được giữ và không đọc như English th.", expected_en: "ਠ is preserved and not read like English th.", evidenceReceiptGuard_vi: "Bắt romanization che mất distinction của ਠ.", evidenceReceiptGuard_en: "Catches romanization hiding the ਠ distinction.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Final-capture Shahmukhi awareness",
    title_en: "Evidence Receipt Shahmukhi Awareness",
    evidenceReceiptGoal_vi: "Khóa scope để Shahmukhi chỉ là awareness và Gurmukhi vẫn primary.",
    evidenceReceiptGoal_en: "Capture scope so Shahmukhi remains awareness only and Gurmukhi stays primary.",
    samples: [
      { id: "pa-evidence-receipt-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_a11_evidence_receipt", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", evidenceReceipt_vi: "Khóa scope: Gurmukhi primary; Shahmukhi chỉ là awareness.", evidenceReceipt_en: "Capture scope: Gurmukhi primary; Shahmukhi is awareness only.", expected_vi: "Không biến thành khóa Shahmukhi đầy đủ.", expected_en: "Does not become a full Shahmukhi course.", evidenceReceiptGuard_vi: "Bắt nội dung Shahmukhi vượt phạm vi.", evidenceReceiptGuard_en: "Catches Shahmukhi content that exceeds scope.", evidenceReceiptCandidate: true },
    ],
  },
  {
    focus: "pre_integration_verification",
    title_vi: "Final-capture pre-integration verification",
    title_en: "Evidence Receipt Pre-Integration Verification",
    evidenceReceiptGoal_vi: "Khóa kiểm tra cuối về field, scope và wording trước bước sau.",
    evidenceReceiptGoal_en: "Capture final checks for fields, scope, and wording before a later step.",
    samples: [
      { id: "pa-evidence-receipt-final-001", focus: "pre_integration_verification", stage: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਤਾਲਾ", romanization: "antim tala", evidenceReceipt_vi: "Khóa id, focus, stage, Gurmukhi và VI/EN.", evidenceReceipt_en: "Capture id, focus, stage, Gurmukhi, and VI/EN.", expected_vi: "Dữ liệu là TypeScript consumable, không phải notes rời.", expected_en: "Data is consumable TypeScript, not loose notes.", evidenceReceiptGuard_vi: "Bắt thiếu field hoặc thiếu Gurmukhi primary.", evidenceReceiptGuard_en: "Catches missing fields or missing Gurmukhi primary.", preIntegration: true, evidenceReceiptCandidate: true },
      { id: "pa-evidence-receipt-final-002", focus: "pre_integration_verification", stage: "sanity", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", evidenceReceipt_vi: "Khóa wording native-review và scope Punjabi script/vocabulary.", evidenceReceipt_en: "Capture native-review wording and Punjabi script/vocabulary scope.", expected_vi: "Native review được hoãn; không claim đã review.", expected_en: "Native review is deferred; no reviewed claim is made.", evidenceReceiptGuard_vi: "Bắt scope drift ngoài Punjabi script/vocabulary.", evidenceReceiptGuard_en: "Catches scope drift beyond Punjabi script/vocabulary.", preIntegration: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_EVIDENCE_RECEIPT_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_EVIDENCE_RECEIPT_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyEvidenceReceiptSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_EVIDENCE_RECEIPT_SAMPLES;
