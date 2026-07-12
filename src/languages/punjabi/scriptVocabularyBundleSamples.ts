// src/languages/punjabi/scriptVocabularyBundleSamples.ts
//
// Punjabi script/vocabulary bundle samples for later app integration.
// Native review is deferred.

export type PunjabiBundleFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "bundle_closure";

export type PunjabiBundleStage = "pre_a11_bundle" | "receipt" | "ledger" | "pre_integration" | "regression";

export type PunjabiScriptVocabularyBundleSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiBundleFocus;
  stage: PunjabiBundleStage;
  gurmukhi: string;
  romanization?: string;
  bundle_vi: string;
  bundle_en: string;
  expected_vi: string;
  expected_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  bundleReady?: boolean;
};

export const PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SCOPE = {
  vi: "Bundle samples đóng gói Punjabi script/vocabulary trước A11: Gurmukhi primary, romanization chỉ là bridge có giới hạn, dấu nguyên âm và addak/tippi/bindi được giữ, signage, service vocabulary, verbs, collocations và Shahmukhi awareness không vượt phạm vi. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "Bundle samples package Punjabi script/vocabulary before A11: Gurmukhi is primary, romanization is only a limited bridge, vowel signs and addak/tippi/bindi are preserved, and signage, service vocabulary, verbs, collocations, and Shahmukhi awareness stay scoped. This is app-consumable TypeScript data; native review is deferred.",
  bundleDataOnly: true,
} as const;

export const PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES: ReadonlyArray<PunjabiScriptVocabularyBundleSample> = [
  { id: "pa-bundle-gurmukhi-001", focus: "gurmukhi_primary", stage: "pre_a11_bundle", gurmukhi: "ਗੁਰਮੁਖੀ ਪੈਕੇਟ", romanization: "gurmukhi packet", bundle_vi: "Bundle giữ Gurmukhi là trường chính trong gói pre-A11.", bundle_en: "Bundle keeps Gurmukhi as the main field in the pre-A11 packet.", expected_vi: "Bước sau đọc được mà không đảo sang Latin-first.", expected_en: "A later step can read it without switching to Latin-first.", bundleReady: true },
  { id: "pa-bundle-roman-001", focus: "romanization_bridge", stage: "receipt", gurmukhi: "ਲੂਣ", romanization: "loon/lun", bundle_vi: "Receipt bundle giữ variant Latin nhưng anchor vẫn là ਲੂਣ.", bundle_en: "Receipt bundle keeps Latin variants while the anchor remains ਲੂਣ.", expected_vi: "Romanization chỉ hỗ trợ bridge/search.", expected_en: "Romanization only supports bridge/search.", learnerTrap: { vi: "oo/u Latin không đủ để thay dấu Gurmukhi.", en: "Latin oo/u is not enough to replace the Gurmukhi mark." } },
  { id: "pa-bundle-vowel-001", focus: "vowel_signs", stage: "ledger", gurmukhi: "ਬੇ / ਬੈ", romanization: "be / bai", bundle_vi: "Ledger bundle giữ ੇ và ੈ tách biệt trong cặp nhìn gần.", bundle_en: "Ledger bundle keeps ੇ and ੈ distinct in a close-looking pair.", expected_vi: "Không gộp vowel signs khi đóng bundle.", expected_en: "Does not merge vowel signs when bundling.", learnerTrap: { vi: "Hai dấu trên chữ dễ bị nhìn như một nhóm.", en: "The two upper marks can be mistaken as one group." } },
  { id: "pa-bundle-smallmark-001", focus: "addak_tippi_bindi", stage: "regression", gurmukhi: "ਮਿੱਠਾ ਪਾਣੀ", romanization: "mittha paani", bundle_vi: "Regression bundle giữ tippi/addak và bindi trong cụm ngắn.", bundle_en: "Regression bundle keeps tippi/addak and bindi in a short chunk.", expected_vi: "Dấu nhỏ không bị mất khi gom gói.", expected_en: "Small marks are not lost while bundling.", learnerTrap: { vi: "Romanization không cho thấy vị trí dấu đủ rõ.", en: "Romanization does not show mark placement clearly." } },
  { id: "pa-bundle-sign-001", focus: "survival_signage", stage: "pre_a11_bundle", gurmukhi: "ਰੁਕੋ", romanization: "ruko", bundle_vi: "Bundle giữ biển stop cho đường, trường học hoặc quầy dịch vụ.", bundle_en: "Bundle keeps the stop sign for roads, schools, or service counters.", expected_vi: "Người học nhận đây là lệnh dừng.", expected_en: "Learner recognizes this as a stop command.", canadaPractical: true, bundleReady: true },
  { id: "pa-bundle-sign-002", focus: "survival_signage", stage: "receipt", gurmukhi: "ਇੱਥੇ ਉਡੀਕ ਕਰੋ", romanization: "itthe udeek karo", bundle_vi: "Receipt bundle ghi biển wait here trong văn phòng dịch vụ.", bundle_en: "Receipt bundle records wait here in service offices.", expected_vi: "Cụm hành động không bị rút còn one-word wait.", expected_en: "The action chunk is not reduced to one-word wait.", canadaPractical: true },
  { id: "pa-bundle-service-001", focus: "service_vocabulary", stage: "pre_integration", gurmukhi: "ਸਰਕਾਰੀ ਦਫ਼ਤਰ", romanization: "sarkari daftar", bundle_vi: "Pre-integration bundle giữ cụm government office cho dịch vụ Canada.", bundle_en: "Pre-integration bundle keeps government office for Canada services.", expected_vi: "Cụm đủ ngữ cảnh để dùng trong navigation.", expected_en: "The chunk has enough context for navigation.", canadaPractical: true, bundleReady: true },
  { id: "pa-bundle-service-002", focus: "service_vocabulary", stage: "ledger", gurmukhi: "ਫੀਸ ਭਰਨੀ", romanization: "fees bharni", bundle_vi: "Ledger bundle giữ cụm pay fee cho giấy tờ hoặc trường học.", bundle_en: "Ledger bundle keeps pay fee for paperwork or school.", expected_vi: "ਭਰਨੀ được hiểu trong collocation thanh toán.", expected_en: "ਭਰਨੀ is understood in the payment collocation.", canadaPractical: true },
  { id: "pa-bundle-verb-001", focus: "high_frequency_verbs", stage: "pre_a11_bundle", gurmukhi: "ਮੈਂ ਭੇਜਦਾ ਹਾਂ", romanization: "main bhejda haan", bundle_vi: "Bundle ghi verb send trong câu ngắn dùng được.", bundle_en: "Bundle records send in a usable short sentence.", expected_vi: "Không lưu verb như gloss rời.", expected_en: "Does not store the verb as an isolated gloss.", bundleReady: true },
  { id: "pa-bundle-verb-002", focus: "high_frequency_verbs", stage: "regression", gurmukhi: "ਉਹ ਲੱਭਦਾ ਹੈ", romanization: "oh labhda hai", bundle_vi: "Regression bundle giữ verb find/search với addak awareness.", bundle_en: "Regression bundle keeps find/search with addak awareness.", expected_vi: "Câu Gurmukhi đầy đủ vẫn là primary.", expected_en: "The full Gurmukhi sentence remains primary." },
  { id: "pa-bundle-collocation-001", focus: "collocations", stage: "receipt", gurmukhi: "ਕੰਮ ਲੱਭਣਾ", romanization: "kamm labhna", bundle_vi: "Receipt bundle giữ collocation tìm việc cho tình huống Canada.", bundle_en: "Receipt bundle keeps the find-work collocation for Canada situations.", expected_vi: "ਲੱਭਣਾ không tách khỏi noun ਕੰਮ.", expected_en: "ਲੱਭਣਾ is not detached from the noun ਕੰਮ.", learnerTrap: { vi: "Dịch từng chữ có thể làm cụm mất tự nhiên.", en: "Word-by-word translation can make the chunk unnatural." }, canadaPractical: true },
  { id: "pa-bundle-collocation-002", focus: "collocations", stage: "ledger", gurmukhi: "ਮਦਦ ਮੰਗਣਾ", romanization: "madad mangna", bundle_vi: "Ledger bundle giữ cụm xin giúp đỡ ở quầy dịch vụ.", bundle_en: "Ledger bundle keeps ask-for-help at a service counter.", expected_vi: "Collocation sẵn dùng cho nhu cầu thực tế.", expected_en: "The collocation is ready for practical needs.", canadaPractical: true },
  { id: "pa-bundle-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_integration", gurmukhi: "ਲਿਪੀ ਪੈਕੇਟ", romanization: "lipi packet", bundle_vi: "Pre-integration note: Gurmukhi primary; Shahmukhi chỉ là awareness.", bundle_en: "Pre-integration note: Gurmukhi is primary; Shahmukhi is awareness only.", expected_vi: "Không tạo bundle Shahmukhi đầy đủ.", expected_en: "Does not create a full Shahmukhi bundle." },
  { id: "pa-bundle-closure-001", focus: "bundle_closure", stage: "pre_a11_bundle", gurmukhi: "ਪੈਕੇਟ ਜਾਂਚ", romanization: "packet jaanch", bundle_vi: "Bundle closure kiểm id, focus, stage, VI/EN và Gurmukhi.", bundle_en: "Bundle closure checks id, focus, stage, VI/EN, and Gurmukhi.", expected_vi: "Dữ liệu sẵn cho bước sau nhưng chưa tích hợp A11.", expected_en: "Data is ready for a later step but not integrated with A11.", bundleReady: true },
  { id: "pa-bundle-closure-002", focus: "bundle_closure", stage: "regression", gurmukhi: "ਅੰਤਿਮ ਪੈਕੇਟ", romanization: "antim packet", bundle_vi: "Regression bundle bắt forbidden concepts và claim native review sai.", bundle_en: "Regression bundle catches forbidden concepts and false native review claims.", expected_vi: "Native review được hoãn rõ ràng.", expected_en: "Native review is explicitly deferred.", bundleReady: true },
];

export default PUNJABI_SCRIPT_VOCABULARY_BUNDLE_SAMPLES;
