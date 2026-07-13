// src/languages/punjabi/scriptVocabularySnapshotSamples.ts
//
// Punjabi script/vocabulary snapshot samples.
// Native review is deferred.

export type PunjabiSnapshotFocus =
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

export type PunjabiSnapshotStage = "pre_a11_snapshot" | "pre_merge" | "closure_packet" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularySnapshotSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiSnapshotFocus;
  stage: PunjabiSnapshotStage;
  gurmukhi: string;
  romanization?: string;
  snapshotCheck_vi: string;
  snapshotCheck_en: string;
  passIf_vi: string;
  passIf_en: string;
  guardrail_vi: string;
  guardrail_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  snapshotReady?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularySnapshotSection = {
  cell_id?: string;
  focus: PunjabiSnapshotFocus;
  title_vi: string;
  title_en: string;
  snapshotGoal_vi: string;
  snapshotGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularySnapshotSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_SNAPSHOT_SCOPE = {
  vi: "Bộ snapshot này kiểm Punjabi script/vocabulary cho automated tests: Gurmukhi là primary, romanization chỉ bridge, vowel signs và addak/tippi/bindi không rơi qua transform, signage/service/verbs/collocations dùng được, Shahmukhi chỉ là awareness. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This snapshot set checks Punjabi script/vocabulary for automated tests: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi survive transforms, signage/service/verbs/collocations are usable, and Shahmukhi is awareness only. This is app-consumable TypeScript data; native review is deferred.",
  snapshotDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularySnapshotSection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Snapshot Gurmukhi primary checks",
    title_en: "Snapshot Gurmukhi Primary Checks",
    snapshotGoal_vi: "Automated snapshot xác nhận prompt và expected answer giữ Gurmukhi trước Latin.",
    snapshotGoal_en: "Automated snapshot confirms prompts and expected answers keep Gurmukhi before Latin.",
    samples: [
      { id: "pa-snapshot-gurmukhi-001", focus: "gurmukhi_primary", stage: "pre_a11_snapshot", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", snapshotCheck_vi: "Snapshot kiểm tên ngôn ngữ không chuyển thành Latin-only.", snapshotCheck_en: "Snapshot checks that the language name does not become Latin only.", passIf_vi: "ਪੰਜਾਬੀ là expected display chính.", passIf_en: "ਪੰਜਾਬੀ is the expected main display.", guardrail_vi: "Chặn fixture chỉ có Punjabi/Panjabi.", guardrail_en: "Blocks fixtures with only Punjabi/Panjabi.", learnerTrap: { vi: "Latin không hiện tippi trong ਪੰਜਾਬੀ.", en: "Latin does not show tippi in ਪੰਜਾਬੀ." }, snapshotReady: true },
      { id: "pa-snapshot-gurmukhi-002", focus: "gurmukhi_primary", stage: "sanity", gurmukhi: "ਲਿਖੋ", romanization: "likho", snapshotCheck_vi: "Snapshot kiểm writing action vẫn bắt đầu bằng script.", snapshotCheck_en: "Snapshot checks that the writing action still starts with script.", passIf_vi: "Romanization chỉ xuất hiện như support hint.", passIf_en: "Romanization appears only as a support hint.", guardrail_vi: "Chặn snapshot Latin-first.", guardrail_en: "Blocks Latin-first snapshots.", preIntegration: true },
    ],
  },
  {
    focus: "romanization_bridge_limits",
    title_vi: "Snapshot romanization bridge checks",
    title_en: "Snapshot Romanization Bridge Checks",
    snapshotGoal_vi: "Snapshot chấp nhận variant romanization nhưng assert Gurmukhi là canonical.",
    snapshotGoal_en: "Snapshot accepts romanization variants while asserting Gurmukhi as canonical.",
    samples: [
      { id: "pa-snapshot-roman-001", focus: "romanization_bridge_limits", stage: "closure_packet", gurmukhi: "ਫਲ", romanization: "phal/fal", snapshotCheck_vi: "Snapshot map ph/f về một expected Gurmukhi.", snapshotCheck_en: "Snapshot maps ph/f to one expected Gurmukhi form.", passIf_vi: "ਫਲ là canonical answer trong assertions.", passIf_en: "ਫਲ is the canonical answer in assertions.", guardrail_vi: "Chặn duplicate test chỉ khác ph/f.", guardrail_en: "Blocks duplicate tests differing only by ph/f.", learnerTrap: { vi: "ਫ là anchor; Latin chỉ bridge.", en: "ਫ is the anchor; Latin is only a bridge." }, snapshotReady: true },
      { id: "pa-snapshot-roman-002", focus: "romanization_bridge_limits", stage: "pre_a11_snapshot", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", snapshotCheck_vi: "Snapshot không coi v/w là hai concepts.", snapshotCheck_en: "Snapshot does not treat v/w as two concepts.", passIf_vi: "Một Gurmukhi form giữ meaning stable.", passIf_en: "One Gurmukhi form keeps the meaning stable.", guardrail_vi: "Chặn answer key Latin-only.", guardrail_en: "Blocks Latin-only answer keys.", learnerTrap: { vi: "Spelling Latin khác không luôn là từ khác.", en: "Different Latin spellings are not always different words." } },
      { id: "pa-snapshot-roman-003", focus: "romanization_bridge_limits", stage: "sanity", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", snapshotCheck_vi: "Snapshot kiểm ਸ਼ có dấu dưới không bị normalize thành ਸ.", snapshotCheck_en: "Snapshot checks that marked ਸ਼ is not normalized to ਸ.", passIf_vi: "Expected text giữ marked letter.", passIf_en: "Expected text keeps the marked letter.", guardrail_vi: "Chặn normalization làm mất distinction.", guardrail_en: "Blocks normalization that loses the distinction.", preIntegration: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Snapshot vowel sign checks",
    title_en: "Snapshot Vowel Sign Checks",
    snapshotGoal_vi: "Snapshot giữ vowel signs khi so sánh render, fixtures và answer.",
    snapshotGoal_en: "Snapshot preserves vowel signs when comparing render output, fixtures, and answers.",
    samples: [
      { id: "pa-snapshot-vowel-001", focus: "vowel_signs", stage: "pre_a11_snapshot", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", snapshotCheck_vi: "Snapshot phân biệt i ngắn/dài bằng dấu Gurmukhi.", snapshotCheck_en: "Snapshot distinguishes short/long i by Gurmukhi marks.", passIf_vi: "ਛੋਟੀ/ਲੰਬੀ vowel sign không bị swap.", passIf_en: "The short/long vowel signs are not swapped.", guardrail_vi: "Chặn đọc ਕਿ theo visual order.", guardrail_en: "Blocks reading ਕਿ by visual order.", learnerTrap: { vi: "ਕਿ không đọc là ik.", en: "ਕਿ is not read as ik." }, snapshotReady: true },
      { id: "pa-snapshot-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", snapshotCheck_vi: "Snapshot kiểm dấu dưới survive snapshot/list rendering.", snapshotCheck_en: "Snapshot checks that under-letter signs survive snapshot/list rendering.", passIf_vi: "ੁ và ੂ vẫn khác trong expected output.", passIf_en: "ੁ and ੂ remain different in expected output.", guardrail_vi: "Chặn card chỉ còn ku/kuu.", guardrail_en: "Blocks cards reduced to ku/kuu.", preIntegration: true },
      { id: "pa-snapshot-vowel-003", focus: "vowel_signs", stage: "closure_packet", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", snapshotCheck_vi: "Snapshot kiểm e/ai/au không đổi chỗ.", snapshotCheck_en: "Snapshot checks that e/ai/au are not swapped.", passIf_vi: "Ba forms có assertion riêng.", passIf_en: "The three forms have separate assertions.", guardrail_vi: "Chặn vowel-sign swap trong signage.", guardrail_en: "Blocks vowel-sign swaps in signage.", snapshotReady: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Snapshot small mark checks",
    title_en: "Snapshot Small Mark Checks",
    snapshotGoal_vi: "Snapshot giữ addak, tippi và bindi trong transform và comparison.",
    snapshotGoal_en: "Snapshot preserves addak, tippi, and bindi in transforms and comparisons.",
    samples: [
      { id: "pa-snapshot-mark-001", focus: "addak_tippi_bindi", stage: "pre_merge", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", snapshotCheck_vi: "Snapshot kiểm transit phrase giữ addak trong cả hai từ.", snapshotCheck_en: "Snapshot checks that the transit phrase keeps addak in both words.", passIf_vi: "ਬੱਸ ਅੱਡਾ dùng được trong Canadian transit.", passIf_en: "ਬੱਸ ਅੱਡਾ is usable in Canadian transit.", guardrail_vi: "Chặn sanitizer làm rơi ੱ.", guardrail_en: "Blocks sanitizers that drop ੱ.", learnerTrap: { vi: "Addak không phải decoration.", en: "Addak is not decoration." }, canadaPractical: true, snapshotReady: true },
      { id: "pa-snapshot-mark-002", focus: "addak_tippi_bindi", stage: "sanity", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", snapshotCheck_vi: "Snapshot kiểm bindi/tippi được nêu trong VI/EN.", snapshotCheck_en: "Snapshot checks that bindi/tippi are named in VI/EN.", passIf_vi: "Nasal mark giữ vị trí cụ thể.", passIf_en: "Nasal marks keep specific placement.", guardrail_vi: "Chặn note nasal quá chung chung.", guardrail_en: "Blocks overly generic nasal notes.", learnerTrap: { vi: "Romanization không chỉ vị trí dấu.", en: "Romanization does not show mark placement." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Snapshot survival signage checks",
    title_en: "Snapshot Survival Signage Checks",
    snapshotGoal_vi: "Snapshot giữ signage gắn với action thực tế trong Canada context.",
    snapshotGoal_en: "Snapshot keeps signage tied to practical action in Canadian contexts.",
    samples: [
      { id: "pa-snapshot-sign-001", focus: "survival_signage", stage: "pre_a11_snapshot", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", snapshotCheck_vi: "Snapshot kiểm exit sign dẫn tới action tìm lối ra.", snapshotCheck_en: "Snapshot checks that exit signage leads to finding an exit.", passIf_vi: "Learner dùng sign trong mall, clinic hoặc office.", passIf_en: "Learner uses the sign in a mall, clinic, or office.", guardrail_vi: "Chặn dịch từ thiếu action.", guardrail_en: "Blocks word translation without action.", canadaPractical: true, snapshotReady: true },
      { id: "pa-snapshot-sign-002", focus: "survival_signage", stage: "closure_packet", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", snapshotCheck_vi: "Snapshot giữ loanword emergency ở Gurmukhi-first.", snapshotCheck_en: "Snapshot keeps the emergency loanword Gurmukhi-first.", passIf_vi: "Gurmukhi đứng trước English support.", passIf_en: "Gurmukhi appears before English support.", guardrail_vi: "Chặn English thay thế script.", guardrail_en: "Blocks English replacing script.", canadaPractical: true },
      { id: "pa-snapshot-sign-003", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", snapshotCheck_vi: "Snapshot kiểm pharmacy loanword vẫn anchored vào ਫ.", snapshotCheck_en: "Snapshot checks that the pharmacy loanword stays anchored to ਫ.", passIf_vi: "Learner đọc ਫਾਰਮੇਸੀ trước Latin.", passIf_en: "Learner reads ਫਾਰਮੇਸੀ before Latin.", guardrail_vi: "Chặn reliance vào English spelling.", guardrail_en: "Blocks reliance on English spelling.", learnerTrap: { vi: "Loanword quen dễ làm bỏ script.", en: "A familiar loanword can make learners skip script." }, canadaPractical: true, preIntegration: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Snapshot service vocabulary checks",
    title_en: "Snapshot Service Vocabulary Checks",
    snapshotGoal_vi: "Snapshot giữ service vocabulary trong form, clinic, housing và transit workflows.",
    snapshotGoal_en: "Snapshot keeps service vocabulary in form, clinic, housing, and transit workflows.",
    samples: [
      { id: "pa-snapshot-service-001", focus: "service_vocabulary", stage: "pre_merge", gurmukhi: "ਦਵਾਈ", romanization: "davai", snapshotCheck_vi: "Snapshot kiểm medicine trong pharmacy/clinic context.", snapshotCheck_en: "Snapshot checks medicine in pharmacy/clinic context.", passIf_vi: "ਦਵਾਈ có script, VI/EN và practical context.", passIf_en: "ਦਵਾਈ has script, VI/EN, and practical context.", guardrail_vi: "Chặn item chỉ còn English medicine.", guardrail_en: "Blocks items that keep only English medicine.", canadaPractical: true, snapshotReady: true },
      { id: "pa-snapshot-service-002", focus: "service_vocabulary", stage: "closure_packet", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", snapshotCheck_vi: "Snapshot kiểm rent trong housing notice hoặc form.", snapshotCheck_en: "Snapshot checks rent in a housing notice or form.", passIf_vi: "Meaning tiền thuê giữ ổn định.", passIf_en: "The rent meaning stays stable.", guardrail_vi: "Chặn dịch rent thiếu Gurmukhi.", guardrail_en: "Blocks rent translations missing Gurmukhi.", canadaPractical: true },
      { id: "pa-snapshot-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", snapshotCheck_vi: "Snapshot kiểm ID document là service chunk.", snapshotCheck_en: "Snapshot checks that ID document is a service chunk.", passIf_vi: "Cụm không bị tách thành word list.", passIf_en: "The phrase is not split into a word list.", guardrail_vi: "Chặn workflow mất nghĩa do dịch từng từ.", guardrail_en: "Blocks workflows losing meaning through word-by-word translation.", learnerTrap: { vi: "ਪੱਤਰ ở đây là document/paper.", en: "ਪੱਤਰ here means document/paper." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Snapshot high-frequency verb checks",
    title_en: "Snapshot High-Frequency Verb Checks",
    snapshotGoal_vi: "Snapshot giữ verbs lõi trong collocation và service sentence.",
    snapshotGoal_en: "Snapshot keeps core verbs inside collocations and service sentences.",
    samples: [
      { id: "pa-snapshot-verb-001", focus: "high_frequency_verbs", stage: "pre_a11_snapshot", gurmukhi: "ਕਰਨਾ", romanization: "karna", snapshotCheck_vi: "Snapshot kiểm ਕਰਨਾ gắn với action chunk.", snapshotCheck_en: "Snapshot checks ਕਰਨਾ attached to an action chunk.", passIf_vi: "Verb không chỉ là dictionary form.", passIf_en: "The verb is not only a dictionary form.", guardrail_vi: "Chặn verb deck thiếu context.", guardrail_en: "Blocks verb decks without context.", preIntegration: true },
      { id: "pa-snapshot-verb-002", focus: "high_frequency_verbs", stage: "pre_merge", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", snapshotCheck_vi: "Snapshot kiểm booking clinic giữ whole chunk.", snapshotCheck_en: "Snapshot checks that clinic booking keeps the whole chunk.", passIf_vi: "ਲੈਣਾ hiểu trong nghĩa book/take appointment.", passIf_en: "ਲੈਣਾ is understood in book/take appointment.", guardrail_vi: "Chặn tách verb khỏi appointment.", guardrail_en: "Blocks separating the verb from appointment.", canadaPractical: true, snapshotReady: true },
      { id: "pa-snapshot-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", snapshotCheck_vi: "Snapshot kiểm câu chưa hiểu trong service support.", snapshotCheck_en: "Snapshot checks the did-not-understand sentence in service support.", passIf_vi: "Câu đầy đủ dùng được với staff.", passIf_en: "The full sentence is usable with staff.", guardrail_vi: "Chặn rút còn verb ਸਮਝਣਾ.", guardrail_en: "Blocks reducing it to ਸਮਝਣਾ.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Snapshot collocation checks",
    title_en: "Snapshot Collocation Checks",
    snapshotGoal_vi: "Snapshot giữ collocation như một unit nghĩa trong automated assertions.",
    snapshotGoal_en: "Snapshot keeps collocations as meaning units in automated assertions.",
    samples: [
      { id: "pa-snapshot-collocation-001", focus: "collocations", stage: "closure_packet", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", snapshotCheck_vi: "Snapshot kiểm help request giữ cả câu.", snapshotCheck_en: "Snapshot checks that the help request keeps the full sentence.", passIf_vi: "Câu dùng được ở service counter.", passIf_en: "The sentence is usable at a service counter.", guardrail_vi: "Chặn cắt thành noun ਮਦਦ.", guardrail_en: "Blocks cutting it down to the noun ਮਦਦ.", canadaPractical: true, snapshotReady: true },
      { id: "pa-snapshot-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", snapshotCheck_vi: "Snapshot kiểm fill-out-a-form trong paperwork.", snapshotCheck_en: "Snapshot checks fill-out-a-form in paperwork.", passIf_vi: "Cụm là một action đầy đủ.", passIf_en: "The phrase is one complete action.", guardrail_vi: "Chặn workflow chỉ còn vocabulary rời.", guardrail_en: "Blocks workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-snapshot-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", snapshotCheck_vi: "Snapshot kiểm correction chunk giữ ਠ trong ਠੀਕ.", snapshotCheck_en: "Snapshot checks that the correction chunk keeps ਠ in ਠੀਕ.", passIf_vi: "Romanization không che distinction của ਠ.", passIf_en: "Romanization does not hide the ਠ distinction.", guardrail_vi: "Chặn đọc ਠ như English th.", guardrail_en: "Blocks reading ਠ like English th.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Snapshot Shahmukhi awareness check",
    title_en: "Snapshot Shahmukhi Awareness Check",
    snapshotGoal_vi: "Snapshot giữ Shahmukhi là awareness, không mở full course ngoài Gurmukhi-primary.",
    snapshotGoal_en: "Snapshot keeps Shahmukhi as awareness, without opening a full course beyond Gurmukhi-primary scope.",
    samples: [
      { id: "pa-snapshot-shahmukhi-001", focus: "shahmukhi_awareness", stage: "pre_merge", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", snapshotCheck_vi: "Snapshot kiểm scope note: Shahmukhi chỉ là awareness.", snapshotCheck_en: "Snapshot checks scope note: Shahmukhi is awareness only.", passIf_vi: "Không có lesson Shahmukhi đầy đủ.", passIf_en: "There is no full Shahmukhi lesson.", guardrail_vi: "Chặn nội dung Shahmukhi vượt phạm vi.", guardrail_en: "Blocks Shahmukhi content beyond scope.", snapshotReady: true },
    ],
  },
  {
    focus: "pre_integration_readiness",
    title_vi: "Snapshot pre-integration readiness",
    title_en: "Snapshot Pre-Integration Readiness",
    snapshotGoal_vi: "Snapshot xác nhận data đủ field, stable và chưa claim native review.",
    snapshotGoal_en: "Snapshot confirms data has required fields, is stable, and does not claim native review.",
    samples: [
      { id: "pa-snapshot-final-001", focus: "pre_integration_readiness", stage: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim jaanch", snapshotCheck_vi: "Snapshot kiểm id, focus, stage, Gurmukhi và VI/EN trước bước sau.", snapshotCheck_en: "Snapshot checks id, focus, stage, Gurmukhi, and VI/EN before later work.", passIf_vi: "Dataset là TypeScript consumable, không phải notes rời.", passIf_en: "Dataset is consumable TypeScript, not loose notes.", guardrail_vi: "Chặn thiếu required field.", guardrail_en: "Blocks missing required fields.", snapshotReady: true, preIntegration: true },
      { id: "pa-snapshot-final-002", focus: "pre_integration_readiness", stage: "sanity", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", snapshotCheck_vi: "Snapshot kiểm wording native review deferred.", snapshotCheck_en: "Snapshot checks wording that native review is deferred.", passIf_vi: "Không có claim đã native review.", passIf_en: "There is no claim of completed native review.", guardrail_vi: "Chặn scope drift ngoài Punjabi script/vocabulary.", guardrail_en: "Blocks scope drift beyond Punjabi script/vocabulary.", preIntegration: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_SNAPSHOT_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_SNAPSHOT_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularySnapshotSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_SNAPSHOT_SAMPLES;
