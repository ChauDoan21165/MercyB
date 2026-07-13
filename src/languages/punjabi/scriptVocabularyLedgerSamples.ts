// src/languages/punjabi/scriptVocabularyLedgerSamples.ts
//
// Punjabi script/vocabulary ledger samples for later app integration.
// Native review is deferred.

export type PunjabiLedgerFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "ledger_closure";

export type PunjabiLedgerStage = "pre_a11_ledger" | "archive" | "signoff" | "pre_integration" | "regression";

export type PunjabiScriptVocabularyLedgerSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiLedgerFocus;
  stage: PunjabiLedgerStage;
  gurmukhi: string;
  romanization?: string;
  ledger_vi: string;
  ledger_en: string;
  expected_vi: string;
  expected_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  ledgerReady?: boolean;
};

export const PUNJABI_SCRIPT_VOCABULARY_LEDGER_SCOPE = {
  vi: "Ledger samples ghi nhận Punjabi script/vocabulary trước A11: Gurmukhi primary, romanization chỉ là bridge có giới hạn, dấu nguyên âm và addak/tippi/bindi được giữ, signage, service vocabulary, verbs, collocations và Shahmukhi awareness không vượt phạm vi. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "Ledger samples record Punjabi script/vocabulary before A11: Gurmukhi is primary, romanization is only a limited bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service vocabulary, verbs, collocations, and Shahmukhi awareness stay in scope. This is app-consumable TypeScript data; native review is deferred.",
  ledgerDataOnly: true,
} as const;

export const PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES: ReadonlyArray<PunjabiScriptVocabularyLedgerSample> = [
  { id: "pa-ledger-gurmukhi-001", focus: "gurmukhi_primary", stage: "pre_a11_ledger", gurmukhi: "ਗੁਰਮੁਖੀ ਰਿਕਾਰਡ", romanization: "gurmukhi record", ledger_vi: "Ledger ghi Gurmukhi là trường primary trước romanization.", ledger_en: "Ledger records Gurmukhi as the primary field before romanization.", expected_vi: "App sau có thể render Gurmukhi trước.", expected_en: "A later app can render Gurmukhi first.", ledgerReady: true },
  { id: "pa-ledger-roman-001", focus: "romanization_bridge", stage: "archive", gurmukhi: "ਚਾਹ", romanization: "chaah/chah", ledger_vi: "Archive ledger cho variant Latin nhưng anchor vẫn là ਚਾਹ.", ledger_en: "Archive ledger allows Latin variants while the anchor remains ਚਾਹ.", expected_vi: "Romanization dùng cho bridge/search, không làm primary.", expected_en: "Romanization supports bridge/search and does not become primary.", learnerTrap: { vi: "ch không phải hai chữ riêng trong Gurmukhi.", en: "ch is not two separate Gurmukhi letters." } },
  { id: "pa-ledger-vowel-001", focus: "vowel_signs", stage: "signoff", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", ledger_vi: "Signoff ledger giữ ੁ và ੂ trong cặp dễ nhầm.", ledger_en: "Signoff ledger keeps ੁ and ੂ in an easily confused pair.", expected_vi: "Không mất dấu nguyên âm khi snapshot.", expected_en: "Vowel signs are not lost in the snapshot.", learnerTrap: { vi: "Dấu dưới chữ nhỏ nhưng đổi nhận diện.", en: "The below-letter sign is small but changes recognition." } },
  { id: "pa-ledger-smallmark-001", focus: "addak_tippi_bindi", stage: "regression", gurmukhi: "ਪੱਕਾ ਕੰਮ", romanization: "pakka kamm", ledger_vi: "Regression ledger giữ addak và tippi trong cụm ngắn.", ledger_en: "Regression ledger keeps addak and tippi in a short chunk.", expected_vi: "Dấu nhỏ không bị strip khi xuất dữ liệu.", expected_en: "Small marks are not stripped during export.", learnerTrap: { vi: "Romanization kk/mm không thay thế được dấu.", en: "Romanized kk/mm does not replace the marks." } },
  { id: "pa-ledger-sign-001", focus: "survival_signage", stage: "pre_a11_ledger", gurmukhi: "ਅੱਗ", romanization: "agg", ledger_vi: "Ledger giữ từ fire cho biển cảnh báo trong tòa nhà.", ledger_en: "Ledger keeps the fire word for warning signs in buildings.", expected_vi: "Người học nhận đây là tín hiệu nguy hiểm.", expected_en: "Learner recognizes this as a danger signal.", canadaPractical: true, ledgerReady: true },
  { id: "pa-ledger-sign-002", focus: "survival_signage", stage: "archive", gurmukhi: "ਦਾਖਲਾ", romanization: "dakhala", ledger_vi: "Archive ledger ghi biển entrance cho trường học hoặc văn phòng.", ledger_en: "Archive ledger records an entrance sign for schools or offices.", expected_vi: "Không nhầm với ਨਿਕਾਸ trong signage.", expected_en: "Does not confuse it with ਨਿਕਾਸ in signage.", canadaPractical: true },
  { id: "pa-ledger-service-001", focus: "service_vocabulary", stage: "pre_integration", gurmukhi: "ਡਾਕਟਰ ਨੂੰ ਮਿਲਣਾ", romanization: "doctor nu milna", ledger_vi: "Pre-integration ledger giữ cụm gặp bác sĩ trong clinic.", ledger_en: "Pre-integration ledger keeps the see-a-doctor chunk in a clinic.", expected_vi: "ਮਿਲਣਾ được hiểu theo ngữ cảnh service.", expected_en: "ਮਿਲਣਾ is understood in the service context.", canadaPractical: true, ledgerReady: true },
  { id: "pa-ledger-service-002", focus: "service_vocabulary", stage: "signoff", gurmukhi: "ਪਤੇ ਦਾ ਸਬੂਤ", romanization: "pate da sabut", ledger_vi: "Signoff ledger ghi proof of address cho giấy tờ Canada.", ledger_en: "Signoff ledger records proof of address for Canada paperwork.", expected_vi: "Cụm đủ dài để dùng ở quầy dịch vụ.", expected_en: "The chunk is complete enough for a service counter.", canadaPractical: true },
  { id: "pa-ledger-verb-001", focus: "high_frequency_verbs", stage: "pre_a11_ledger", gurmukhi: "ਮੈਂ ਲੈਂਦਾ ਹਾਂ", romanization: "main lainda haan", ledger_vi: "Ledger ghi verb ਲੈਣਾ trong câu ngắn thay vì từ rời.", ledger_en: "Ledger records ਲੈਣਾ in a short sentence instead of an isolated word.", expected_vi: "Người học thấy verb trong pattern dùng được.", expected_en: "Learner sees the verb in a usable pattern.", ledgerReady: true },
  { id: "pa-ledger-verb-002", focus: "high_frequency_verbs", stage: "regression", gurmukhi: "ਉਹ ਦਿੰਦਾ ਹੈ", romanization: "oh dinda hai", ledger_vi: "Regression ledger giữ verb ਦੇਣਾ với câu Gurmukhi đầy đủ.", ledger_en: "Regression ledger keeps ਦੇਣਾ inside a full Gurmukhi sentence.", expected_vi: "Không rút còn gloss English cho give.", expected_en: "Does not reduce to an English gloss for give." },
  { id: "pa-ledger-collocation-001", focus: "collocations", stage: "archive", gurmukhi: "ਫੈਸਲਾ ਕਰਨਾ", romanization: "faisla karna", ledger_vi: "Archive ledger giữ collocation make a decision như một chunk.", ledger_en: "Archive ledger keeps make-a-decision as one chunk.", expected_vi: "ਕਰਨਾ không bị dịch tách khỏi ਫੈਸਲਾ.", expected_en: "ਕਰਨਾ is not translated apart from ਫੈਸਲਾ.", learnerTrap: { vi: "Dịch từng chữ làm cụm kém tự nhiên.", en: "Word-by-word translation makes the chunk unnatural." } },
  { id: "pa-ledger-collocation-002", focus: "collocations", stage: "signoff", gurmukhi: "ਮੁਲਾਕਾਤ ਕਰਨੀ", romanization: "mulakat karni", ledger_vi: "Signoff ledger giữ cụm appointment/meeting cho dịch vụ.", ledger_en: "Signoff ledger keeps the appointment/meeting chunk for services.", expected_vi: "Collocation sẵn dùng cho đặt lịch.", expected_en: "The collocation is ready for booking contexts.", canadaPractical: true },
  { id: "pa-ledger-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_integration", gurmukhi: "ਲਿਪੀ ledger", romanization: "lipi ledger", ledger_vi: "Pre-integration note: Gurmukhi primary; Shahmukhi chỉ là awareness.", ledger_en: "Pre-integration note: Gurmukhi is primary; Shahmukhi is awareness only.", expected_vi: "Không tạo course Shahmukhi đầy đủ.", expected_en: "Does not create a full Shahmukhi course." },
  { id: "pa-ledger-closure-001", focus: "ledger_closure", stage: "pre_a11_ledger", gurmukhi: "ਖਾਤਾ ਜਾਂਚ", romanization: "khata jaanch", ledger_vi: "Ledger closure kiểm id, focus, stage, VI/EN và Gurmukhi.", ledger_en: "Ledger closure checks id, focus, stage, VI/EN, and Gurmukhi.", expected_vi: "Dữ liệu sẵn cho bước sau nhưng chưa tích hợp A11.", expected_en: "Data is ready for a later step but not integrated with A11.", ledgerReady: true },
  { id: "pa-ledger-closure-002", focus: "ledger_closure", stage: "regression", gurmukhi: "ਅੰਤਿਮ ਖਾਤਾ", romanization: "antim khata", ledger_vi: "Regression ledger bắt forbidden concepts và claim native review sai.", ledger_en: "Regression ledger catches forbidden concepts and false native review claims.", expected_vi: "Native review được hoãn rõ ràng.", expected_en: "Native review is explicitly deferred.", ledgerReady: true },
];

export default PUNJABI_SCRIPT_VOCABULARY_LEDGER_SAMPLES;
