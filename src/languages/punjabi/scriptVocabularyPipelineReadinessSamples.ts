// src/languages/punjabi/scriptVocabularyPipelineReadinessSamples.ts
//
// Punjabi script/vocabulary pipeline-readiness samples.
// Native review is deferred.

export type PunjabiPipelineReadinessFocus =
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

export type PunjabiPipelineReadinessStage = "pipeline_readiness" | "ci_readiness" | "mr_readiness" | "pre_integration" | "sanity";

export type PunjabiScriptVocabularyPipelineReadinessSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiPipelineReadinessFocus;
  stage: PunjabiPipelineReadinessStage;
  gurmukhi: string;
  romanization?: string;
  check_vi: string;
  check_en: string;
  readyIf_vi: string;
  readyIf_en: string;
  guardrail_vi: string;
  guardrail_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  pipelineReady?: boolean;
  preIntegration?: boolean;
};

export type PunjabiScriptVocabularyPipelineReadinessSection = {
  cell_id?: string;
  focus: PunjabiPipelineReadinessFocus;
  title_vi: string;
  title_en: string;
  readinessGoal_vi: string;
  readinessGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyPipelineReadinessSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_PIPELINE_READINESS_SCOPE = {
  vi: "Bộ pipeline-readiness này kiểm Punjabi script/vocabulary trước bước sau: Gurmukhi là primary, romanization chỉ là bridge, vowel signs và addak/tippi/bindi được giữ, signage/service/verbs/collocations ổn định, Shahmukhi chỉ là awareness. Đây là TypeScript data app-consumable; native review được hoãn.",
  en: "This pipeline-readiness set checks Punjabi script/vocabulary before later work: Gurmukhi is primary, romanization is only a bridge, vowel signs and addak/tippi/bindi are preserved, signage/service/verbs/collocations stay stable, and Shahmukhi is awareness only. This is app-consumable TypeScript data; native review is deferred.",
  pipelineReadinessDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyPipelineReadinessSection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Pipeline Gurmukhi primary checks",
    title_en: "Pipeline Gurmukhi Primary Checks",
    readinessGoal_vi: "Pipeline giữ Gurmukhi làm nguồn chính trong prompt, answer và review text.",
    readinessGoal_en: "Pipeline keeps Gurmukhi as the primary source in prompts, answers, and review text.",
    samples: [
      { id: "pa-pipeline-gurmukhi-001", focus: "gurmukhi_primary", stage: "pipeline_readiness", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", check_vi: "Kiểm tên ngôn ngữ không rơi về Latin-only.", check_en: "Check that the language name does not fall back to Latin only.", readyIf_vi: "ਪੰਜਾਬੀ là form hiển thị chính cho learner.", readyIf_en: "ਪੰਜਾਬੀ is the main form shown to learners.", guardrail_vi: "Chặn sample chỉ còn Punjabi/Panjabi.", guardrail_en: "Blocks samples that keep only Punjabi/Panjabi.", learnerTrap: { vi: "Latin không cho thấy tippi trong ਪੰਜਾਬੀ.", en: "Latin does not show tippi in ਪੰਜਾਬੀ." }, pipelineReady: true },
      { id: "pa-pipeline-gurmukhi-002", focus: "gurmukhi_primary", stage: "sanity", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", check_vi: "Kiểm reading prompt vẫn bắt đầu bằng script.", check_en: "Check that the reading prompt still starts with script.", readyIf_vi: "Romanization chỉ là hint sau Gurmukhi.", readyIf_en: "Romanization is only a hint after Gurmukhi.", guardrail_vi: "Chặn prompt Latin-first.", guardrail_en: "Blocks Latin-first prompts.", preIntegration: true },
    ],
  },
  {
    focus: "romanization_bridge_limits",
    title_vi: "Pipeline romanization bridge checks",
    title_en: "Pipeline Romanization Bridge Checks",
    readinessGoal_vi: "Pipeline chấp nhận variant romanization nhưng không biến variant thành entry chính.",
    readinessGoal_en: "Pipeline accepts romanization variants without turning variants into primary entries.",
    samples: [
      { id: "pa-pipeline-roman-001", focus: "romanization_bridge_limits", stage: "ci_readiness", gurmukhi: "ਫਲ", romanization: "phal/fal", check_vi: "Kiểm ph/f cùng trỏ về ਫਲ.", check_en: "Check that ph/f both point back to ਫਲ.", readyIf_vi: "ਫਲ là canonical answer trong data.", readyIf_en: "ਫਲ is the canonical answer in data.", guardrail_vi: "Chặn duplicate chỉ khác ph/f.", guardrail_en: "Blocks duplicates that differ only by ph/f.", learnerTrap: { vi: "ਫ là anchor, Latin chỉ hỗ trợ.", en: "ਫ is the anchor; Latin only supports it." }, pipelineReady: true },
      { id: "pa-pipeline-roman-002", focus: "romanization_bridge_limits", stage: "mr_readiness", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", check_vi: "Kiểm v/w không tạo hai nghĩa.", check_en: "Check that v/w does not create two meanings.", readyIf_vi: "Một Gurmukhi form giữ meaning stable.", readyIf_en: "One Gurmukhi form keeps the meaning stable.", guardrail_vi: "Chặn answer key Latin-only.", guardrail_en: "Blocks Latin-only answer keys.", learnerTrap: { vi: "Spelling Latin khác không luôn là từ khác.", en: "Different Latin spellings are not always different words." } },
      { id: "pa-pipeline-roman-003", focus: "romanization_bridge_limits", stage: "sanity", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", check_vi: "Kiểm ਸ਼ có dấu dưới không bị đổi thành ਸ.", check_en: "Check that marked ਸ਼ is not changed to ਸ.", readyIf_vi: "Gurmukhi giữ distinction trước romanization.", readyIf_en: "Gurmukhi keeps the distinction before romanization.", guardrail_vi: "Chặn normalization làm mất marked letter.", guardrail_en: "Blocks normalization that removes the marked letter.", preIntegration: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Pipeline vowel sign checks",
    title_en: "Pipeline Vowel Sign Checks",
    readinessGoal_vi: "Pipeline giữ các dấu nguyên âm khác nhau khi render nhỏ và khi so sánh answer.",
    readinessGoal_en: "Pipeline preserves different vowel signs in compact rendering and answer comparison.",
    samples: [
      { id: "pa-pipeline-vowel-001", focus: "vowel_signs", stage: "pipeline_readiness", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", check_vi: "Kiểm i ngắn/dài bằng dấu, không chỉ bằng Latin.", check_en: "Check short/long i by marks, not only by Latin.", readyIf_vi: "Learner thấy ਿ và ੀ khác nhau.", readyIf_en: "Learner sees ਿ and ੀ as different.", guardrail_vi: "Chặn đọc ਕਿ theo thứ tự mắt nhìn.", guardrail_en: "Blocks reading ਕਿ by visual order.", learnerTrap: { vi: "ਕਿ không đọc là ik.", en: "ਕਿ is not read as ik." }, pipelineReady: true },
      { id: "pa-pipeline-vowel-002", focus: "vowel_signs", stage: "pre_integration", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", check_vi: "Kiểm dấu dưới không bị mất trong list.", check_en: "Check that under-letter signs are not lost in lists.", readyIf_vi: "ੁ và ੂ vẫn phân biệt rõ.", readyIf_en: "ੁ and ੂ remain clearly distinct.", guardrail_vi: "Chặn card chỉ còn ku/kuu.", guardrail_en: "Blocks cards reduced to ku/kuu.", preIntegration: true },
      { id: "pa-pipeline-vowel-003", focus: "vowel_signs", stage: "ci_readiness", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", check_vi: "Kiểm e, ai và au không bị swap.", check_en: "Check that e, ai, and au are not swapped.", readyIf_vi: "Ba forms có meaning/check riêng.", readyIf_en: "The three forms have separate meaning checks.", guardrail_vi: "Chặn swap vowel sign trong signage.", guardrail_en: "Blocks vowel-sign swaps in signage.", pipelineReady: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Pipeline small mark checks",
    title_en: "Pipeline Small Mark Checks",
    readinessGoal_vi: "Pipeline giữ addak, tippi và bindi qua transform và display.",
    readinessGoal_en: "Pipeline preserves addak, tippi, and bindi through transforms and display.",
    samples: [
      { id: "pa-pipeline-mark-001", focus: "addak_tippi_bindi", stage: "mr_readiness", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", check_vi: "Kiểm bus stop giữ addak trong cả hai từ.", check_en: "Check that bus stop keeps addak in both words.", readyIf_vi: "ਬੱਸ ਅੱਡਾ dùng được cho transit Canada.", readyIf_en: "ਬੱਸ ਅੱਡਾ is usable for Canadian transit.", guardrail_vi: "Chặn normalization rơi ੱ.", guardrail_en: "Blocks normalization that drops ੱ.", learnerTrap: { vi: "Addak không phải trang trí.", en: "Addak is not decoration." }, canadaPractical: true, pipelineReady: true },
      { id: "pa-pipeline-mark-002", focus: "addak_tippi_bindi", stage: "sanity", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", check_vi: "Kiểm bindi/tippi được gọi tên trong explanation.", check_en: "Check that bindi/tippi are named in explanations.", readyIf_vi: "Dấu nasal có vị trí cụ thể trong VI/EN.", readyIf_en: "Nasal marks have specific placement in VI/EN.", guardrail_vi: "Chặn note nasal quá chung chung.", guardrail_en: "Blocks overly generic nasal notes.", learnerTrap: { vi: "Romanization không chỉ vị trí dấu.", en: "Romanization does not show mark placement." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Pipeline survival signage checks",
    title_en: "Pipeline Survival Signage Checks",
    readinessGoal_vi: "Pipeline giữ signage gắn với hành động thực tế ở Canada.",
    readinessGoal_en: "Pipeline keeps signage tied to practical actions in Canada.",
    samples: [
      { id: "pa-pipeline-sign-001", focus: "survival_signage", stage: "pipeline_readiness", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", check_vi: "Kiểm exit sign dẫn đến hành động tìm lối ra.", check_en: "Check that exit sign leads to finding an exit.", readyIf_vi: "Learner theo sign trong mall, clinic hoặc office.", readyIf_en: "Learner follows the sign in a mall, clinic, or office.", guardrail_vi: "Chặn dịch từ thiếu action.", guardrail_en: "Blocks word translation without action.", canadaPractical: true, pipelineReady: true },
      { id: "pa-pipeline-sign-002", focus: "survival_signage", stage: "ci_readiness", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", check_vi: "Kiểm emergency vẫn Gurmukhi-first dù là loanword.", check_en: "Check that emergency stays Gurmukhi-first even as a loanword.", readyIf_vi: "Gurmukhi đứng trước English support.", readyIf_en: "Gurmukhi appears before English support.", guardrail_vi: "Chặn English thay thế script.", guardrail_en: "Blocks English replacing script.", canadaPractical: true },
      { id: "pa-pipeline-sign-003", focus: "survival_signage", stage: "pre_integration", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", check_vi: "Kiểm pharmacy loanword vẫn anchored vào ਫ.", check_en: "Check that the pharmacy loanword stays anchored to ਫ.", readyIf_vi: "Learner đọc ਫਾਰਮੇਸੀ trước Latin.", readyIf_en: "Learner reads ਫਾਰਮੇਸੀ before Latin.", guardrail_vi: "Chặn reliance vào English spelling.", guardrail_en: "Blocks reliance on English spelling.", learnerTrap: { vi: "Loanword quen dễ làm bỏ script.", en: "A familiar loanword can make learners skip script." }, canadaPractical: true, preIntegration: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Pipeline service vocabulary checks",
    title_en: "Pipeline Service Vocabulary Checks",
    readinessGoal_vi: "Pipeline giữ từ dịch vụ trong workflow form, clinic, housing và transit.",
    readinessGoal_en: "Pipeline keeps service vocabulary inside form, clinic, housing, and transit workflows.",
    samples: [
      { id: "pa-pipeline-service-001", focus: "service_vocabulary", stage: "mr_readiness", gurmukhi: "ਦਵਾਈ", romanization: "davai", check_vi: "Kiểm medicine trong pharmacy/clinic context.", check_en: "Check medicine in pharmacy/clinic context.", readyIf_vi: "ਦਵਾਈ có Gurmukhi, VI/EN và practical context.", readyIf_en: "ਦਵਾਈ has Gurmukhi, VI/EN, and practical context.", guardrail_vi: "Chặn item chỉ còn English medicine.", guardrail_en: "Blocks items that keep only English medicine.", canadaPractical: true, pipelineReady: true },
      { id: "pa-pipeline-service-002", focus: "service_vocabulary", stage: "ci_readiness", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", check_vi: "Kiểm rent trong housing notice hoặc form.", check_en: "Check rent in a housing notice or form.", readyIf_vi: "Meaning tiền thuê giữ ổn định.", readyIf_en: "The rent meaning stays stable.", guardrail_vi: "Chặn dịch rent thiếu Gurmukhi.", guardrail_en: "Blocks rent translations missing Gurmukhi.", canadaPractical: true },
      { id: "pa-pipeline-service-003", focus: "service_vocabulary", stage: "sanity", gurmukhi: "ਪਛਾਣ ਪੱਤਰ", romanization: "pachhan pattar", check_vi: "Kiểm ID document là service chunk.", check_en: "Check that ID document is a service chunk.", readyIf_vi: "Cụm không bị tách thành word list.", readyIf_en: "The phrase is not split into a word list.", guardrail_vi: "Chặn workflow mất nghĩa do dịch từng từ.", guardrail_en: "Blocks workflows losing meaning through word-by-word translation.", learnerTrap: { vi: "ਪੱਤਰ ở đây là document/paper.", en: "ਪੱਤਰ here means document/paper." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Pipeline high-frequency verb checks",
    title_en: "Pipeline High-Frequency Verb Checks",
    readinessGoal_vi: "Pipeline giữ verb lõi trong collocation và câu service.",
    readinessGoal_en: "Pipeline keeps core verbs inside collocations and service sentences.",
    samples: [
      { id: "pa-pipeline-verb-001", focus: "high_frequency_verbs", stage: "pipeline_readiness", gurmukhi: "ਕਰਨਾ", romanization: "karna", check_vi: "Kiểm ਕਰਨਾ gắn với action chunk.", check_en: "Check ਕਰਨਾ attached to an action chunk.", readyIf_vi: "Verb không chỉ là dictionary form.", readyIf_en: "The verb is not only a dictionary form.", guardrail_vi: "Chặn verb deck thiếu context.", guardrail_en: "Blocks verb decks without context.", preIntegration: true },
      { id: "pa-pipeline-verb-002", focus: "high_frequency_verbs", stage: "mr_readiness", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", check_vi: "Kiểm booking clinic giữ whole chunk.", check_en: "Check clinic booking keeps the whole chunk.", readyIf_vi: "ਲੈਣਾ hiểu trong nghĩa book/take appointment.", readyIf_en: "ਲੈਣਾ is understood in book/take appointment.", guardrail_vi: "Chặn tách verb khỏi appointment.", guardrail_en: "Blocks separating the verb from appointment.", canadaPractical: true, pipelineReady: true },
      { id: "pa-pipeline-verb-003", focus: "high_frequency_verbs", stage: "sanity", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", check_vi: "Kiểm câu chưa hiểu trong service support.", check_en: "Check the did-not-understand sentence in service support.", readyIf_vi: "Câu đầy đủ dùng được với staff.", readyIf_en: "The full sentence is usable with staff.", guardrail_vi: "Chặn rút còn verb ਸਮਝਣਾ.", guardrail_en: "Blocks reducing it to ਸਮਝਣਾ.", canadaPractical: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Pipeline collocation checks",
    title_en: "Pipeline Collocation Checks",
    readinessGoal_vi: "Pipeline giữ collocation như một đơn vị nghĩa để learner dùng ngay.",
    readinessGoal_en: "Pipeline keeps collocations as meaning units learners can use immediately.",
    samples: [
      { id: "pa-pipeline-collocation-001", focus: "collocations", stage: "ci_readiness", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", check_vi: "Kiểm help request giữ cả câu.", check_en: "Check that the help request keeps the full sentence.", readyIf_vi: "Câu dùng được ở service counter.", readyIf_en: "The sentence is usable at a service counter.", guardrail_vi: "Chặn cắt thành noun ਮਦਦ.", guardrail_en: "Blocks cutting it down to the noun ਮਦਦ.", canadaPractical: true, pipelineReady: true },
      { id: "pa-pipeline-collocation-002", focus: "collocations", stage: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", check_vi: "Kiểm fill-out-a-form trong paperwork.", check_en: "Check fill-out-a-form in paperwork.", readyIf_vi: "Cụm là một action đầy đủ.", readyIf_en: "The phrase is one complete action.", guardrail_vi: "Chặn workflow chỉ còn vocabulary rời.", guardrail_en: "Blocks workflows reduced to isolated vocabulary.", canadaPractical: true, preIntegration: true },
      { id: "pa-pipeline-collocation-003", focus: "collocations", stage: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", check_vi: "Kiểm correction chunk giữ ਠ trong ਠੀਕ.", check_en: "Check correction chunk keeps ਠ in ਠੀਕ.", readyIf_vi: "Romanization không che distinction của ਠ.", readyIf_en: "Romanization does not hide the ਠ distinction.", guardrail_vi: "Chặn đọc ਠ như English th.", guardrail_en: "Blocks reading ਠ like English th.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Pipeline Shahmukhi awareness check",
    title_en: "Pipeline Shahmukhi Awareness Check",
    readinessGoal_vi: "Pipeline giữ Shahmukhi là awareness, không mở rộng scope ngoài Gurmukhi-primary.",
    readinessGoal_en: "Pipeline keeps Shahmukhi as awareness, without expanding beyond Gurmukhi-primary scope.",
    samples: [
      { id: "pa-pipeline-shahmukhi-001", focus: "shahmukhi_awareness", stage: "mr_readiness", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", check_vi: "Kiểm scope note: Shahmukhi chỉ là awareness.", check_en: "Check scope note: Shahmukhi is awareness only.", readyIf_vi: "Không có lesson Shahmukhi đầy đủ.", readyIf_en: "There is no full Shahmukhi lesson.", guardrail_vi: "Chặn nội dung Shahmukhi vượt phạm vi.", guardrail_en: "Blocks Shahmukhi content beyond scope.", pipelineReady: true },
    ],
  },
  {
    focus: "pre_integration_readiness",
    title_vi: "Pipeline pre-integration readiness",
    title_en: "Pipeline Pre-Integration Readiness",
    readinessGoal_vi: "Pipeline xác nhận data đủ field, ổn định, và chưa claim native review.",
    readinessGoal_en: "Pipeline confirms data has required fields, is stable, and does not claim native review.",
    samples: [
      { id: "pa-pipeline-final-001", focus: "pre_integration_readiness", stage: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim jaanch", check_vi: "Kiểm id, focus, stage, Gurmukhi và VI/EN trước bước sau.", check_en: "Check id, focus, stage, Gurmukhi, and VI/EN before later work.", readyIf_vi: "Dataset là TypeScript consumable, không phải notes rời.", readyIf_en: "Dataset is consumable TypeScript, not loose notes.", guardrail_vi: "Chặn thiếu required field.", guardrail_en: "Blocks missing required fields.", pipelineReady: true, preIntegration: true },
      { id: "pa-pipeline-final-002", focus: "pre_integration_readiness", stage: "sanity", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", check_vi: "Kiểm wording native review deferred.", check_en: "Check wording that native review is deferred.", readyIf_vi: "Không có claim đã native review.", readyIf_en: "There is no claim of completed native review.", guardrail_vi: "Chặn scope drift ngoài Punjabi script/vocabulary.", guardrail_en: "Blocks scope drift beyond Punjabi script/vocabulary.", preIntegration: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_PIPELINE_READINESS_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_PIPELINE_READINESS_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyPipelineReadinessSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_PIPELINE_READINESS_SAMPLES;
