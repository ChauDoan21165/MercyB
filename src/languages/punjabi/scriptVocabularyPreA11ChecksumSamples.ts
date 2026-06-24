// src/languages/punjabi/scriptVocabularyPreA11ChecksumSamples.ts
//
// Punjabi script/vocabulary pre-A11-checksum samples.
// Native review is deferred.

export type PunjabiPreA11ChecksumFocus =
  | "gurmukhi_primary"
  | "romanization_bridge_limits"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "pre_integration_readiness";

export type PunjabiPreA11ChecksumStage = "pre_a11_checksum" | "pipeline_readiness" | "ci_readiness" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularyPreA11ChecksumSample = {
  id: string;
  focus: PunjabiPreA11ChecksumFocus;
  stage: PunjabiPreA11ChecksumStage;
  gurmukhi: string;
  romanization?: string;
  checksumCheck_vi: string;
  checksumCheck_en: string;
  passIf_vi: string;
  passIf_en: string;
  guardrail_vi: string;
  guardrail_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  checksumReady?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularyPreA11ChecksumSection = {
  focus: PunjabiPreA11ChecksumFocus;
  title_vi: string;
  title_en: string;
  checksumGoal_vi: string;
  checksumGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyPreA11ChecksumSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SCOPE = {
  vi: "Bộ pre-A11-checksum này kiểm Punjabi script/vocabulary cho automated tests: Gurmukhi là primary, romanization chỉ bridge, vowel signs và addak/tippi/bindi không rơi qua transform, signage/service/verbs/collocations dùng được, Shahmukhi chỉ là awareness. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This pre-A11-checksum set checks Punjabi script/vocabulary for automated tests: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi survive transforms, signage/service/verbs/collocations are usable, and Shahmukhi is awareness only. This is app-consumable TypeScript data; native review is deferred.",
  preA11ChecksumDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyPreA11ChecksumSection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Pre A11 checksum Gurmukhi primary checks",
    title_en: "Pre A11 checksum Gurmukhi Primary Checks",
    checksumGoal_vi: "Automated pre-A11 checksum xác nhận prompt và expected answer giữ Gurmukhi trước Latin.",
    checksumGoal_en: "Automated pre-A11 checksum confirms prompts and expected answers keep Gurmukhi before Latin.",
    samples: [
      { id: "pa-pre-a11-gurmukhi-001", focus: "gurmukhi_primary", stage: "pre_a11_checksum", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", checksumCheck_vi: "Pre A11 checksum kiểm tên ngôn ngữ không chuyển thành Latin-only.", checksumCheck_en: "Pre A11 checksum checks that the language name does not become Latin only.", passIf_vi: "ਪੰਜਾਬੀ là expected display chính.", passIf_en: "ਪੰਜਾਬੀ is the expected main display.", guardrail_vi: "Chặn fixture chỉ có Punjabi/Panjabi.", guardrail_en: "Blocks fixtures with only Punjabi/Panjabi.", learnerTrap: { vi: "Latin không hiện tippi trong ਪੰਜਾਬੀ.", en: "Latin does not show tippi in ਪੰਜਾਬੀ." }, checksumReady: true },
      { id: "pa-pre-a11-gurmukhi-002", focus: "gurmukhi_primary", stage: "sanity", gurmukhi: "ਲਿਖੋ", romanization: "likho", checksumCheck_vi: "Pre A11 checksum kiểm writing action vẫn bắt đầu bằng script.", checksumCheck_en: "Pre A11 checksum checks that the writing action still starts with script.", passIf_vi: "Romanization chỉ xuất hiện như support hint.", passIf_en: "Romanization appears only as a support hint.", guardrail_vi: "Chặn pre-A11 checksum snapshot Latin-first.", guardrail_en: "Blocks Latin-first pre-A11 checksum snapshots.", preIntegration: true },
    ],
  },
  {
    focus: "romanization_bridge_limits",
    title_vi: "Pre A11 checksum romanization bridge checks",
    title_en: "Pre A11 checksum Romanization Bridge Checks",
    checksumGoal_vi: "Pre A11 checksum chấp nhận variant romanization nhưng assert Gurmukhi là canonical.",
    checksumGoal_en: "Pre A11 checksum accepts romanization variants while asserting Gurmukhi as canonical.",
    samples: [
      { id: "pa-pre-a11-roman-001", focus: "romanization_bridge_limits", stage: "ci_readiness", gurmukhi: "ਫਲ", romanization: "phal/fal", checksumCheck_vi: "Pre A11 checksum map ph/f về một expected Gurmukhi.", checksumCheck_en: "Pre A11 checksum maps ph/f to one expected Gurmukhi form.", passIf_vi: "ਫਲ là canonical answer trong assertions.", passIf_en: "ਫਲ is the canonical answer in assertions.", guardrail_vi: "Chặn duplicate test chỉ khác ph/f.", guardrail_en: "Blocks duplicate tests differing only by ph/f.", learnerTrap: { vi: "ਫ là anchor; Latin chỉ bridge.", en: "ਫ is the anchor; Latin is only a bridge." }, checksumReady: true },
      { id: "pa-pre-a11-roman-002", focus: "romanization_bridge_limits", stage: "pre_a11_checksum", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", checksumCheck_vi: "Pre A11 checksum không coi v/w là hai concepts.", checksumCheck_en: "Pre A11 checksum does not treat v/w as two concepts.", passIf_vi: "Một Gurmukhi form giữ meaning stable.", passIf_en: "One Gurmukhi form keeps the meaning stable.", guardrail_vi: "Chặn answer key Latin-only.", guardrail_en: "Blocks Latin-only answer keys.", learnerTrap: { vi: "Spelling Latin khác không luôn là từ khác.", en: "Different Latin spellings are not always different words." } },
      { id: "pa-pre-a11-roman-003", focus: "romanization_bridge_limits", stage: "sanity", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", checksumCheck_vi: "Pre A11 checksum kiểm ਸ਼ có dấu dưới không bị normalize thành ਸ.", checksumCheck_en: "Pre A11 checksum checks that marked ਸ਼ is not normalized to ਸ.", passIf_vi: "Expected text giữ marked letter.", passIf_en: "Expected text keeps the marked letter.", guardrail_vi: "Chặn normalization làm mất distinction.", guardrail_en: "Blocks normalization that loses the distinction.", preIntegration: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Pre A11 checksum vowel sign checks",
    title_en: "Pre A11 checksum Vowel Sign Checks",
    checksumGoal_vi: "Pre A11 checksum giữ vowel signs khi so sánh render, fixtures và answer.",
    checksumGoal_en: "Pre A11 checksum preserves vowel signs when comparing render output, fixtures, and answers.",
    samples: [
      { id: "pa-pre-a11-vowel-001", focus: "vowel_signs", stage: "pre_a11_checksum", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", checksumCheck_vi: "Pre A11 checksum phân biệt i ngắn/dài bằng dấu Gurmukhi.", checksumCheck_en: "Pre A11 checksum distinguishes short/long i by Gurmukhi marks.", passIf_vi: "ਛੋਟੀ/ਲੰਬੀ vowel sign không bị swap.", passIf_en: "The short/long vowel signs are not swapped.", guardrail_vi: "Chặn đọc ਕਿ theo visual order.", guardrail_en: "Blocks reading ਕਿ by visual order.", learnerTrap: { vi: "ਕਿ không đọc là ik.", en: "ਕਿ is not read as ik." }, checksumReady: true },
      { id: "pa-pre-a11-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", checksumCheck_vi: "Pre A11 checksum kiểm dấu dưới survive snapshot/list rendering.", checksumCheck_en: "Pre A11 checksum checks that under-letter signs survive snapshot/list rendering.", passIf_vi: "ੁ và ੂ vẫn khác trong expected output.", passIf_en: "ੁ and ੂ remain different in expected output.", guardrail_vi: "Chặn card chỉ còn ku/kuu.", guardrail_en: "Blocks cards reduced to ku/kuu.", preIntegration: true },
      { id: "pa-pre-a11-vowel-003", focus: "vowel_signs", stage: "ci_readiness", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", checksumCheck_vi: "Pre A11 checksum kiểm e/ai/au không đổi chỗ.", checksumCheck_en: "Pre A11 checksum checks that e/ai/au are not swapped.", passIf_vi: "Ba forms có assertion riêng.", passIf_en: "The three forms have separate assertions.", guardrail_vi: "Chặn vowel-sign swap trong signage.", guardrail_en: "Blocks vowel-sign swaps in signage.", checksumReady: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Pre A11 checksum small mark checks",
    title_en: "Pre A11 checksum Small Mark Checks",
    checksumGoal_vi: "Pre A11 checksum giữ addak, tippi và bindi trong transform và comparison.",
    checksumGoal_en: "Pre A11 checksum preserves addak, tippi, and bindi in transforms and comparisons.",
    samples: [
      { id: "pa-pre-a11-mark-001", focus: "addak_tippi_bindi", stage: "pipeline_readiness", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", checksumCheck_vi: "Pre A11 checksum kiểm transit phrase giữ addak trong cả hai từ.", checksumCheck_en: "Pre A11 checksum checks that the transit phrase keeps addak in both words.", passIf_vi: "ਬੱਸ ਅੱਡਾ dùng được trong Canadian transit.", passIf_en: "ਬੱਸ ਅੱਡਾ is usable in Canadian transit.", guardrail_vi: "Chặn sanitizer làm rơi ੱ.", guardrail_en: "Blocks sanitizers that drop ੱ.", learnerTrap: { vi: "Addak không phải decoration.", en: "Addak is not decoration." }, canadaPractical: true, checksumReady: true },
      { id: "pa-pre-a11-mark-002", focus: "addak_tippi_bindi", stage: "sanity", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", checksumCheck_vi: "Pre A11 checksum kiểm bindi/tippi được nêu trong VI/EN.", checksumCheck_en: "Pre A11 checksum checks that bindi/tippi are named in VI/EN.", passIf_vi: "Nasal mark giữ vị trí cụ thể.", passIf_en: "Nasal marks keep specific placement.", guardrail_vi: "Chặn note nasal quá chung chung.", guardrail_en: "Blocks overly generic nasal notes.", learnerTrap: { vi: "Romanization không chỉ vị trí dấu.", en: "Romanization does not show mark placement." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Pre A11 checksum survival signage checks",
    title_en: "Pre A11 checksum Survival Signage Checks",
    checksumGoal_vi: "Pre A11 checksum giữ signage gắn với action thực tế trong Canada context.",
    checksumGoal_en: "Pre A11 checksum keeps signage tied to practical action in Canadian contexts.",
    samples: [
      { id: "pa-pre-a11-sign-001", focus: "survival_signage", stage: "pre_a11_checksum", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", checksumCheck_vi: "Pre A11 checksum kiểm exit sign dẫn tới action tìm lối ra.", checksumCheck_en: "Pre A11 checksum checks that exit signage leads to finding an exit.", passIf_vi: "Learner dùng sign trong mall, clinic hoặc office.", passIf_en: "Learner uses the sign in a mall, clinic, or office.", guardrail_vi: "Chặn dịch từ thiếu action.", guardrail_en: "Blocks word translation without action.", canadaPractical: true, checksumReady: true },
      { id: "pa-pre-a11-sign-002", focus: "survival_signage", stage: "ci_readiness", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", checksumCheck_vi: "Pre A11 checksum giữ loanword emergency ở Gurmukhi-first.", checksumCheck_en: "Pre A11 checksum keeps the emergency loanword Gurmukhi-first.", passIf_vi: "Gurmukhi đứng trước English support.", passIf_en: "Gurmukhi appears before English support.", guardrail_vi: "Chặn English thay thế script.", guardrail_en: "Blocks English replacing script.", canadaPractical: true },
      { id: "pa-pre-a11-sign-003", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", checksumCheck_vi: "Pre A11 checksum kiểm pharmacy loanword vẫn anchored vào ਫ.", checksumCheck_en: "Pre A11 checksum checks that the pharmacy loanword stays anchored to ਫ.", passIf_vi: "Learner đọc ਫਾਰਮੇਸੀ trước Latin.", passIf_en: "Learner reads ਫਾਰਮੇਸੀ before Latin.", guardrail_vi: "Chặn reliance vào English spelling.", guardrail_en: "Blocks reliance on English spelling.", learnerTrap: { vi: "Loanword quen dễ làm bỏ script.", en: "A familiar loanword can make learners skip script." }, canadaPractical: true, preIntegration: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Pre A11 checksum service vocabulary checks",
    title_en: "Pre A11 checksum Service Vocabulary Checks",
    checksumGoal_vi: "Pre A11 checksum giữ service vocabulary trong form, clinic, housing và transit workflows.",
    checksumGoal_en: "Pre A11 checksum keeps service vocabulary in form, clinic, housing, and transit workflows.",
    samples: [
      { id: "pa-pre-a11-service-001", focus: "service_vocabulary", stage: "pipeline_readiness", gurmukhi: "ਦਵਾਈ", romanization: "davai", checksumCheck_vi: "Pre A11 checksum kiểm medicine trong pharmacy/clinic context.", checksumCheck_en: "Pre A11 checksum checks medicine in pharmacy/clinic context.", passIf_vi: "ਦਵਾਈ có script, VI/EN và practical context.", passIf_en: "ਦਵਾਈ has script, VI/EN, and practical context.", guardrail_vi: "Chặn item chỉ còn English medicine.", guardrail_en: "Blocks items that keep only English medicine.", canadaPractical: true, checksumReady: true },
      { id: "pa-pre-a11-service-002", focus: "service_vocabulary", stage: "ci_readiness", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", checksumCheck_vi: "Pre A11 checksum kiểm rent trong housing notice hoặc form.", checksumCheck_en: "Pre A11 checksum checks rent in a housing notice or form.", passIf_vi: "Meaning tiền thuê giữ ổn định.", passIf_en: "The rent meaning stays stable.", guardrail_vi: "Chặn dịch rent thiếu Gurmukhi.", guardrail_en: "Blocks rent translations missing Gurmukhi.", canadaPractical: true },
      { id: "pa-pre-a11-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", checksumCheck_vi: "Pre A11 checksum kiểm ID document là service chunk.", checksumCheck_en: "Pre A11 checksum checks that ID document is a service chunk.", passIf_vi: "Cụm không bị tách thành word list.", passIf_en: "The phrase is not split into a word list.", guardrail_vi: "Chặn workflow mất nghĩa do dịch từng từ.", guardrail_en: "Blocks workflows losing meaning through word-by-word translation.", learnerTrap: { vi: "ਪੱਤਰ ở đây là document/paper.", en: "ਪੱਤਰ here means document/paper." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Pre A11 checksum high-frequency verb checks",
    title_en: "Pre A11 checksum High-Frequency Verb Checks",
    checksumGoal_vi: "Pre A11 checksum giữ verbs lõi trong collocation và service sentence.",
    checksumGoal_en: "Pre A11 checksum keeps core verbs inside collocations and service sentences.",
    samples: [
      { id: "pa-pre-a11-verb-001", focus: "high_frequency_verbs", stage: "pre_a11_checksum", gurmukhi: "ਕਰਨਾ", romanization: "karna", checksumCheck_vi: "Pre A11 checksum kiểm ਕਰਨਾ gắn với action chunk.", checksumCheck_en: "Pre A11 checksum checks ਕਰਨਾ attached to an action chunk.", passIf_vi: "Verb không chỉ là dictionary form.", passIf_en: "The verb is not only a dictionary form.", guardrail_vi: "Chặn verb deck thiếu context.", guardrail_en: "Blocks verb decks without context.", preIntegration: true },
      { id: "pa-pre-a11-verb-002", focus: "high_frequency_verbs", stage: "pipeline_readiness", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", checksumCheck_vi: "Pre A11 checksum kiểm booking clinic giữ whole chunk.", checksumCheck_en: "Pre A11 checksum checks that clinic booking keeps the whole chunk.", passIf_vi: "ਲੈਣਾ hiểu trong nghĩa book/take appointment.", passIf_en: "ਲੈਣਾ is understood in book/take appointment.", guardrail_vi: "Chặn tách verb khỏi appointment.", guardrail_en: "Blocks separating the verb from appointment.", canadaPractical: true, checksumReady: true },
      { id: "pa-pre-a11-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", checksumCheck_vi: "Pre A11 checksum kiểm câu chưa hiểu trong service support.", checksumCheck_en: "Pre A11 checksum checks the did-not-understand sentence in service support.", passIf_vi: "Câu đầy đủ dùng được với staff.", passIf_en: "The full sentence is usable with staff.", guardrail_vi: "Chặn rút còn verb ਸਮਝਣਾ.", guardrail_en: "Blocks reducing it to ਸਮਝਣਾ.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Pre A11 checksum collocation checks",
    title_en: "Pre A11 checksum Collocation Checks",
    checksumGoal_vi: "Pre A11 checksum giữ collocation như một unit nghĩa trong automated assertions.",
    checksumGoal_en: "Pre A11 checksum keeps collocations as meaning units in automated assertions.",
    samples: [
      { id: "pa-pre-a11-collocation-001", focus: "collocations", stage: "ci_readiness", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", checksumCheck_vi: "Pre A11 checksum kiểm help request giữ cả câu.", checksumCheck_en: "Pre A11 checksum checks that the help request keeps the full sentence.", passIf_vi: "Câu dùng được ở service counter.", passIf_en: "The sentence is usable at a service counter.", guardrail_vi: "Chặn cắt thành noun ਮਦਦ.", guardrail_en: "Blocks cutting it down to the noun ਮਦਦ.", canadaPractical: true, checksumReady: true },
      { id: "pa-pre-a11-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", checksumCheck_vi: "Pre A11 checksum kiểm fill-out-a-form trong paperwork.", checksumCheck_en: "Pre A11 checksum checks fill-out-a-form in paperwork.", passIf_vi: "Cụm là một action đầy đủ.", passIf_en: "The phrase is one complete action.", guardrail_vi: "Chặn workflow chỉ còn vocabulary rời.", guardrail_en: "Blocks workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-pre-a11-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", checksumCheck_vi: "Pre A11 checksum kiểm correction chunk giữ ਠ trong ਠੀਕ.", checksumCheck_en: "Pre A11 checksum checks that the correction chunk keeps ਠ in ਠੀਕ.", passIf_vi: "Romanization không che distinction của ਠ.", passIf_en: "Romanization does not hide the ਠ distinction.", guardrail_vi: "Chặn đọc ਠ như English th.", guardrail_en: "Blocks reading ਠ like English th.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Pre A11 checksum Shahmukhi awareness check",
    title_en: "Pre A11 checksum Shahmukhi Awareness Check",
    checksumGoal_vi: "Pre A11 checksum giữ Shahmukhi là awareness, không mở full course ngoài Gurmukhi-primary.",
    checksumGoal_en: "Pre A11 checksum keeps Shahmukhi as awareness, without opening a full course beyond Gurmukhi-primary scope.",
    samples: [
      { id: "pa-pre-a11-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pipeline_readiness", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", checksumCheck_vi: "Pre A11 checksum kiểm scope note: Shahmukhi chỉ là awareness.", checksumCheck_en: "Pre A11 checksum checks scope note: Shahmukhi is awareness only.", passIf_vi: "Không có lesson Shahmukhi đầy đủ.", passIf_en: "There is no full Shahmukhi lesson.", guardrail_vi: "Chặn nội dung Shahmukhi vượt phạm vi.", guardrail_en: "Blocks Shahmukhi content beyond scope.", checksumReady: true },
    ],
  },
  {
    focus: "pre_integration_readiness",
    title_vi: "Pre A11 checksum pre-integration readiness",
    title_en: "Pre A11 checksum Pre-Integration Readiness",
    checksumGoal_vi: "Pre A11 checksum xác nhận data đủ field, stable và chưa claim native review.",
    checksumGoal_en: "Pre A11 checksum confirms data has required fields, is stable, and does not claim native review.",
    samples: [
      { id: "pa-pre-a11-final-001", focus: "pre_integration_readiness", stage: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim jaanch", checksumCheck_vi: "Pre A11 checksum kiểm id, focus, stage, Gurmukhi và VI/EN trước bước sau.", checksumCheck_en: "Pre A11 checksum checks id, focus, stage, Gurmukhi, and VI/EN before later work.", passIf_vi: "Dataset là TypeScript consumable, không phải notes rời.", passIf_en: "Dataset is consumable TypeScript, not loose notes.", guardrail_vi: "Chặn thiếu required field.", guardrail_en: "Blocks missing required fields.", checksumReady: true, preIntegration: true },
      { id: "pa-pre-a11-final-002", focus: "pre_integration_readiness", stage: "sanity", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", checksumCheck_vi: "Pre A11 checksum kiểm wording native review deferred.", checksumCheck_en: "Pre A11 checksum checks wording that native review is deferred.", passIf_vi: "Không có claim đã native review.", passIf_en: "There is no claim of completed native review.", guardrail_vi: "Chặn scope drift ngoài Punjabi script/vocabulary.", guardrail_en: "Blocks scope drift beyond Punjabi script/vocabulary.", preIntegration: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyPreA11ChecksumSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_PRE_A11_CHECKSUM_SAMPLES;
