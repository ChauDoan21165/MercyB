// src/languages/punjabi/scriptVocabularyReceiptSamples.ts
//
// Punjabi script/vocabulary receipt samples for later app integration.
// Native review is deferred.

export type PunjabiReceiptFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "receipt_closure";

export type PunjabiReceiptStage = "pre_a11_receipt" | "ledger" | "archive" | "pre_integration" | "regression";

export type PunjabiScriptVocabularyReceiptSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiReceiptFocus;
  stage: PunjabiReceiptStage;
  gurmukhi: string;
  romanization?: string;
  receipt_vi: string;
  receipt_en: string;
  expected_vi: string;
  expected_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  receiptReady?: boolean;
};

export const PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SCOPE = {
  vi: "Receipt samples xác nhận Punjabi script/vocabulary trước A11: Gurmukhi primary, romanization chỉ là bridge có giới hạn, dấu nguyên âm và addak/tippi/bindi được giữ, signage, service vocabulary, verbs, collocations và Shahmukhi awareness không vượt phạm vi. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "Receipt samples confirm Punjabi script/vocabulary before A11: Gurmukhi is primary, romanization is only a limited bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service vocabulary, verbs, collocations, and Shahmukhi awareness stay scoped. This is app-consumable TypeScript data; native review is deferred.",
  receiptDataOnly: true,
} as const;

export const PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES: ReadonlyArray<PunjabiScriptVocabularyReceiptSample> = [
  { id: "pa-receipt-gurmukhi-001", focus: "gurmukhi_primary", stage: "pre_a11_receipt", gurmukhi: "ਗੁਰਮੁਖੀ ਰਸੀਦ", romanization: "gurmukhi rasid", receipt_vi: "Receipt ghi nhận Gurmukhi là nội dung chính trước Latin.", receipt_en: "Receipt records Gurmukhi as the main content before Latin.", expected_vi: "Bước sau có bằng chứng Gurmukhi-first.", expected_en: "A later step has proof of Gurmukhi-first ordering.", receiptReady: true },
  { id: "pa-receipt-roman-001", focus: "romanization_bridge", stage: "ledger", gurmukhi: "ਦੁੱਧ", romanization: "duddh/dudh", receipt_vi: "Ledger receipt giữ Latin variant nhưng anchor vẫn là ਦੁੱਧ.", receipt_en: "Ledger receipt keeps Latin variants while the anchor remains ਦੁੱਧ.", expected_vi: "Romanization không thay thế addak trong chữ chính.", expected_en: "Romanization does not replace addak in the main script.", learnerTrap: { vi: "ddh là cue Latin, không thể thay dấu Gurmukhi.", en: "ddh is a Latin cue and cannot replace the Gurmukhi mark." } },
  { id: "pa-receipt-vowel-001", focus: "vowel_signs", stage: "archive", gurmukhi: "ਤਿ / ਤੀ", romanization: "ti / tii", receipt_vi: "Archive receipt giữ ਿ và ੀ tách biệt trong cặp ngắn.", receipt_en: "Archive receipt keeps ਿ and ੀ distinct in a short pair.", expected_vi: "Không rơi dấu nguyên âm trong dữ liệu receipt.", expected_en: "Vowel signs are not dropped in receipt data.", learnerTrap: { vi: "Vị trí của ਿ dễ làm đọc ngược.", en: "The position of ਿ can trigger reversed reading." } },
  { id: "pa-receipt-smallmark-001", focus: "addak_tippi_bindi", stage: "regression", gurmukhi: "ਸੱਚ ਬੋਲਣਾ", romanization: "sach bolna", receipt_vi: "Regression receipt giữ addak trong cụm nói thật.", receipt_en: "Regression receipt keeps addak in the tell-the-truth chunk.", expected_vi: "Dấu ੱ không bị strip khi lưu receipt.", expected_en: "The ੱ mark is not stripped when storing the receipt.", learnerTrap: { vi: "Romanization sach không thể hiện đủ dấu.", en: "Romanization sach does not fully show the mark." } },
  { id: "pa-receipt-sign-001", focus: "survival_signage", stage: "pre_a11_receipt", gurmukhi: "ਬੰਦ", romanization: "band", receipt_vi: "Receipt ghi biển closed cho cửa hàng hoặc văn phòng.", receipt_en: "Receipt records the closed sign for stores or offices.", expected_vi: "Người học nhận trạng thái không vào được.", expected_en: "Learner recognizes the unavailable-entry state.", canadaPractical: true, receiptReady: true },
  { id: "pa-receipt-sign-002", focus: "survival_signage", stage: "ledger", gurmukhi: "ਖੁੱਲ੍ਹਾ", romanization: "khullha", receipt_vi: "Ledger receipt ghi biển open như cặp với ਬੰਦ.", receipt_en: "Ledger receipt records open as the pair for ਬੰਦ.", expected_vi: "Không gộp hai trạng thái signage trái nghĩa.", expected_en: "Does not merge opposite signage states.", canadaPractical: true },
  { id: "pa-receipt-service-001", focus: "service_vocabulary", stage: "pre_integration", gurmukhi: "ਰਸੀਦ ਚਾਹੀਦੀ ਹੈ", romanization: "rasid chahidi hai", receipt_vi: "Pre-integration receipt giữ câu xin receipt trong mua bán.", receipt_en: "Pre-integration receipt keeps the ask-for-a-receipt sentence in purchases.", expected_vi: "ਚਾਹੀਦੀ ਹੈ được giữ như pattern cần thiết.", expected_en: "ਚਾਹੀਦੀ ਹੈ remains a need/request pattern.", canadaPractical: true, receiptReady: true },
  { id: "pa-receipt-service-002", focus: "service_vocabulary", stage: "archive", gurmukhi: "ਭੁਗਤਾਨ ਮਸ਼ੀਨ", romanization: "bhugtan machine", receipt_vi: "Archive receipt ghi cụm payment machine cho quầy dịch vụ.", receipt_en: "Archive receipt records payment machine for service counters.", expected_vi: "Loanword machine vẫn nằm sau Gurmukhi primary.", expected_en: "The machine loanword remains behind Gurmukhi primary.", canadaPractical: true },
  { id: "pa-receipt-verb-001", focus: "high_frequency_verbs", stage: "pre_a11_receipt", gurmukhi: "ਮੈਂ ਖਰੀਦਦਾ ਹਾਂ", romanization: "main kharidda haan", receipt_vi: "Receipt ghi verb buy trong câu ngắn có chủ ngữ.", receipt_en: "Receipt records buy in a short sentence with a subject.", expected_vi: "Không lưu verb như gloss rời.", expected_en: "Does not store the verb as an isolated gloss.", receiptReady: true },
  { id: "pa-receipt-verb-002", focus: "high_frequency_verbs", stage: "regression", gurmukhi: "ਮੈਂ ਦਿਖਾਉਂਦਾ ਹਾਂ", romanization: "main dikhaounda haan", receipt_vi: "Regression receipt giữ verb show trong tình huống giấy tờ.", receipt_en: "Regression receipt keeps show in a paperwork situation.", expected_vi: "Câu đầy đủ vẫn Gurmukhi-primary.", expected_en: "The full sentence remains Gurmukhi-primary.", canadaPractical: true },
  { id: "pa-receipt-collocation-001", focus: "collocations", stage: "ledger", gurmukhi: "ਪੈਸੇ ਦੇਣਾ", romanization: "paise dena", receipt_vi: "Ledger receipt giữ cụm trả tiền như một collocation.", receipt_en: "Ledger receipt keeps pay-money as a collocation.", expected_vi: "ਦੇਣਾ không tách khỏi ngữ cảnh thanh toán.", expected_en: "ਦੇਣਾ is not separated from the payment context.", learnerTrap: { vi: "Dịch từng chữ làm cụm kém tự nhiên.", en: "Word-by-word translation makes the chunk unnatural." }, canadaPractical: true },
  { id: "pa-receipt-collocation-002", focus: "collocations", stage: "archive", gurmukhi: "ਦਸਤਖ਼ਤ ਕਰਨਾ", romanization: "dastkhat karna", receipt_vi: "Archive receipt giữ cụm ký tên cho form hoặc receipt.", receipt_en: "Archive receipt keeps the sign-name chunk for forms or receipts.", expected_vi: "ਕਰਨਾ được hiểu trong collocation hành chính.", expected_en: "ਕਰਨਾ is understood in an administrative collocation.", canadaPractical: true },
  { id: "pa-receipt-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_integration", gurmukhi: "ਲਿਪੀ ਰਸੀਦ", romanization: "lipi rasid", receipt_vi: "Pre-integration note: Gurmukhi primary; Shahmukhi chỉ là awareness.", receipt_en: "Pre-integration note: Gurmukhi is primary; Shahmukhi is awareness only.", expected_vi: "Không tạo module Shahmukhi đầy đủ.", expected_en: "Does not create a full Shahmukhi module." },
  { id: "pa-receipt-closure-001", focus: "receipt_closure", stage: "pre_a11_receipt", gurmukhi: "ਰਸੀਦ ਜਾਂਚ", romanization: "rasid jaanch", receipt_vi: "Receipt closure kiểm id, focus, stage, VI/EN và Gurmukhi.", receipt_en: "Receipt closure checks id, focus, stage, VI/EN, and Gurmukhi.", expected_vi: "Dữ liệu sẵn cho bước sau nhưng chưa tích hợp A11.", expected_en: "Data is ready for a later step but not integrated with A11.", receiptReady: true },
  { id: "pa-receipt-closure-002", focus: "receipt_closure", stage: "regression", gurmukhi: "ਅੰਤਿਮ ਰਸੀਦ", romanization: "antim rasid", receipt_vi: "Regression receipt bắt forbidden concepts và claim native review sai.", receipt_en: "Regression receipt catches forbidden concepts and false native review claims.", expected_vi: "Native review được hoãn rõ ràng.", expected_en: "Native review is explicitly deferred.", receiptReady: true },
];

export default PUNJABI_SCRIPT_VOCABULARY_RECEIPT_SAMPLES;
