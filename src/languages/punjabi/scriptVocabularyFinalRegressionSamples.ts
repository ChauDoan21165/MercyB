// src/languages/punjabi/scriptVocabularyFinalRegressionSamples.ts
//
// Punjabi script/vocabulary final regression samples.
// Native review is deferred.

export type PunjabiFinalRegressionFocus =
  | "gurmukhi_primary"
  | "romanization_bridge"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "shahmukhi_awareness"
  | "pre_integration_sanity";

export type PunjabiFinalRegressionMode = "final_regression" | "sanity" | "pre_integration" | "readiness";

export type PunjabiScriptVocabularyFinalRegressionSample = {
  cell_id?: string;
  id: string;
  focus: PunjabiFinalRegressionFocus;
  mode: PunjabiFinalRegressionMode;
  gurmukhi: string;
  romanization?: string;
  scenario_vi: string;
  scenario_en: string;
  expected_vi: string;
  expected_en: string;
  regressionCheck_vi: string;
  regressionCheck_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  preIntegration?: boolean;
  finalRegression?: boolean;
};

export type PunjabiScriptVocabularyFinalRegressionSection = {
  cell_id?: string;
  focus: PunjabiFinalRegressionFocus;
  title_vi: string;
  title_en: string;
  regressionGoal_vi: string;
  regressionGoal_en: string;
  samples: ReadonlyArray<PunjabiScriptVocabularyFinalRegressionSample>;
};

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SCOPE = {
  vi: "Bộ final regression này kiểm tra Punjabi script/vocabulary trước bước tích hợp sau: Gurmukhi là chính, romanization là cầu phụ, dấu nguyên âm và dấu nhỏ được giữ, biển sinh tồn, từ dịch vụ, động từ, collocation và Shahmukhi awareness. Đây chỉ là TypeScript data app-consumable; native review được hoãn.",
  en: "This final regression set checks Punjabi script/vocabulary before a later integration step: Gurmukhi stays primary, romanization is a supporting bridge, vowel signs and small marks are preserved, survival signs, service words, verbs, collocations, and Shahmukhi awareness. This is app-consumable TypeScript data only; native review is deferred.",
  regressionDataOnly: true,
} as const;

const sections: ReadonlyArray<PunjabiScriptVocabularyFinalRegressionSection> = [
  {
    focus: "gurmukhi_primary",
    title_vi: "Gurmukhi primary sanity",
    title_en: "Gurmukhi Primary Sanity",
    regressionGoal_vi: "Bắt lỗi bất kỳ sample nào để Latin lên làm nguồn chính thay vì chữ Gurmukhi.",
    regressionGoal_en: "Catch any sample that promotes Latin text as primary instead of Gurmukhi script.",
    samples: [
      { id: "pa-final-regression-gurmukhi-001", focus: "gurmukhi_primary", mode: "sanity", gurmukhi: "ਪੰਜਾਬੀ", romanization: "panjabi/punjabi", scenario_vi: "Sample tên ngôn ngữ cần giữ ਪੰਜਾਬੀ là primary.", scenario_en: "The language-name sample needs ਪੰਜਾਬੀ as primary.", expected_vi: "Người học thấy Gurmukhi trước mọi biến thể Latin.", expected_en: "Learners see Gurmukhi before any Latin variant.", regressionCheck_vi: "Không có mục chỉ dùng Punjabi/Panjabi làm đáp án chính.", regressionCheck_en: "No item uses only Punjabi/Panjabi as the main answer.", learnerTrap: { vi: "Latin không hiển thị tippi rõ.", en: "Latin does not show tippi clearly." }, preIntegration: true },
      { id: "pa-final-regression-gurmukhi-002", focus: "gurmukhi_primary", mode: "readiness", gurmukhi: "ਪੜ੍ਹੋ", romanization: "parho", scenario_vi: "Prompt đọc phải bắt đầu từ chữ Gurmukhi.", scenario_en: "The reading prompt must start from Gurmukhi script.", expected_vi: "ਪੜ੍ਹੋ hoặc từ Gurmukhi liên quan xuất hiện trước hint.", expected_en: "ਪੜ੍ਹੋ or a related Gurmukhi word appears before hints.", regressionCheck_vi: "Bắt Latin-first prompt trước handoff.", regressionCheck_en: "Catches Latin-first prompts before handoff.", finalRegression: true },
    ],
  },
  {
    focus: "romanization_bridge",
    title_vi: "Romanization bridge",
    title_en: "Romanization Bridge",
    regressionGoal_vi: "Kiểm romanization là cầu tạm thời và không tách nghĩa sai.",
    regressionGoal_en: "Check that romanization is temporary support and does not split meaning incorrectly.",
    samples: [
      { id: "pa-final-regression-roman-001", focus: "romanization_bridge", mode: "final_regression", gurmukhi: "ਫਲ", romanization: "phal/fal", scenario_vi: "Sample ph/f cần ẩn Latin ở lượt cuối.", scenario_en: "The ph/f sample needs Latin hidden in the final round.", expected_vi: "Lượt cuối chỉ hiện ਫਲ bằng Gurmukhi.", expected_en: "The final round shows only ਫਲ in Gurmukhi.", regressionCheck_vi: "Bắt mục vẫn yêu cầu phal/fal làm đáp án chính.", regressionCheck_en: "Catches items still requiring phal/fal as the main answer.", learnerTrap: { vi: "ਫ là anchor, ph/f chỉ là bridge.", en: "ਫ is the anchor; ph/f is only a bridge." }, finalRegression: true },
      { id: "pa-final-regression-roman-002", focus: "romanization_bridge", mode: "sanity", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", scenario_vi: "Sample v/w không được tách thành hai nghĩa.", scenario_en: "The v/w sample must not split into two meanings.", expected_vi: "vadda và wadda cùng trỏ về ਵੱਡਾ.", expected_en: "vadda and wadda both point to ਵੱਡਾ.", regressionCheck_vi: "Bắt duplicate entry chỉ khác v/w.", regressionCheck_en: "Catches duplicate entries that differ only by v/w.", learnerTrap: { vi: "Hai spelling Latin không luôn là hai từ.", en: "Two Latin spellings are not always two words." }, preIntegration: true },
      { id: "pa-final-regression-roman-003", focus: "romanization_bridge", mode: "readiness", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", scenario_vi: "Sample shahir/shehar phải kiểm chữ ਸ਼ trước Latin.", scenario_en: "The shahir/shehar sample must check ਸ਼ before Latin.", expected_vi: "Người học nhận ra ਸ਼ bằng dấu dưới.", expected_en: "Learner recognizes ਸ਼ by the lower mark.", regressionCheck_vi: "Bắt sample bỏ qua distinction ਸ਼/ਸ.", regressionCheck_en: "Catches samples that skip the ਸ਼/ਸ distinction.", learnerTrap: { vi: "Dấu dưới phân biệt ਸ਼ với ਸ.", en: "The lower mark separates ਸ਼ from ਸ." }, finalRegression: true },
    ],
  },
  {
    focus: "vowel_signs",
    title_vi: "Vowel signs",
    title_en: "Vowel Signs",
    regressionGoal_vi: "Bắt lỗi dấu nguyên âm bị romanization che mất hoặc đọc sai thứ tự.",
    regressionGoal_en: "Catch vowel-sign errors hidden by romanization or incorrect reading order.",
    samples: [
      { id: "pa-final-regression-vowel-001", focus: "vowel_signs", mode: "final_regression", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", scenario_vi: "Sample i ngắn/dài kiểm rule ਿ viết trước đọc sau.", scenario_en: "The short/long i sample checks the rule that ਿ is written before but read after.", expected_vi: "Có ghi chú rõ về thứ tự đọc thật.", expected_en: "Includes a clear note about real reading order.", regressionCheck_vi: "Bắt sample đọc ਕਿ theo thứ tự mắt nhìn.", regressionCheck_en: "Catches samples that read ਕਿ by visual order.", learnerTrap: { vi: "ਕਿ không đọc như ik.", en: "ਕਿ is not read as ik." }, finalRegression: true },
      { id: "pa-final-regression-vowel-002", focus: "vowel_signs", mode: "sanity", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", scenario_vi: "Sample u ngắn/dài kiểm dấu dưới phụ âm.", scenario_en: "The short/long u sample checks under-consonant signs.", expected_vi: "Người học phân biệt ੁ và ੂ trước đọc nhanh.", expected_en: "Learner separates ੁ and ੂ before fast reading.", regressionCheck_vi: "Bắt mục chỉ ghi ku/kuu mà thiếu Gurmukhi dấu.", regressionCheck_en: "Catches items with only ku/kuu and no Gurmukhi signs.", learnerTrap: { vi: "Dấu dưới dễ bị bỏ qua khi nhìn romanization.", en: "Under-letter signs are easy to skip when looking at romanization." }, preIntegration: true },
      { id: "pa-final-regression-vowel-003", focus: "vowel_signs", mode: "readiness", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", scenario_vi: "Sample ba dấu kiểm không đổi dấu trong signage.", scenario_en: "The three-sign sample checks no sign swapping in signage.", expected_vi: "e, ai/ae và au giữ riêng khi đọc biển.", expected_en: "e, ai/ae, and au remain separate while reading signs.", regressionCheck_vi: "Bắt lỗi đổi ਕੈ thành ਕੇ hoặc ਕੌ.", regressionCheck_en: "Catches swaps from ਕੈ to ਕੇ or ਕੌ.", finalRegression: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi",
    regressionGoal_vi: "Kiểm dấu nhỏ không bị rơi khỏi sample giao thông, gia đình và tên Punjab.",
    regressionGoal_en: "Check that small marks are not dropped from transit, family, and Punjab samples.",
    samples: [
      { id: "pa-final-regression-mark-001", focus: "addak_tippi_bindi", mode: "final_regression", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", scenario_vi: "Sample bus stop phải giữ addak trong cả hai từ.", scenario_en: "The bus-stop sample must keep addak in both words.", expected_vi: "ਬੱਸ và ਅੱਡਾ đều giữ ੱ trong Gurmukhi.", expected_en: "ਬੱਸ and ਅੱਡਾ both keep ੱ in Gurmukhi.", regressionCheck_vi: "Bắt sample giao thông bỏ addak.", regressionCheck_en: "Catches transit samples that drop addak.", learnerTrap: { vi: "Addak nhỏ nhưng không phải trang trí.", en: "Addak is small but not decoration." }, canadaPractical: true, finalRegression: true },
      { id: "pa-final-regression-mark-002", focus: "addak_tippi_bindi", mode: "sanity", gurmukhi: "ਮਾਂ / ਪੰਜਾਬ", romanization: "maan / panjab", scenario_vi: "Sample bindi/tippi phải nêu rõ vị trí dấu.", scenario_en: "The bindi/tippi sample must name mark placement clearly.", expected_vi: "Nêu ਂ trong ਮਾਂ và ੰ trong ਪੰਜਾਬ.", expected_en: "Names ਂ in ਮਾਂ and ੰ in ਪੰਜਾਬ.", regressionCheck_vi: "Bắt ghi chú mơ hồ về nasal mark.", regressionCheck_en: "Catches vague notes about nasal marks.", learnerTrap: { vi: "Romanization không hiển thị vị trí dấu rõ.", en: "Romanization does not show mark placement clearly." }, preIntegration: true },
    ],
  },
  {
    focus: "survival_signage",
    title_vi: "Survival signage",
    title_en: "Survival Signage",
    regressionGoal_vi: "Kiểm biển sinh tồn Gurmukhi-first có hành động thực tế ở Canada.",
    regressionGoal_en: "Check Gurmukhi-first survival signs with practical actions in Canada.",
    samples: [
      { id: "pa-final-regression-sign-001", focus: "survival_signage", mode: "final_regression", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", scenario_vi: "Sample lối ra cần action tìm lối ra.", scenario_en: "The exit sample needs the action of finding the exit.", expected_vi: "Người học biết đi theo ਨਿਕਾਸ trong tòa nhà.", expected_en: "Learner knows to follow ਨਿਕਾਸ in a building.", regressionCheck_vi: "Bắt sample chỉ dịch exit mà thiếu hành động.", regressionCheck_en: "Catches samples that only translate exit without action.", canadaPractical: true, finalRegression: true },
      { id: "pa-final-regression-sign-002", focus: "survival_signage", mode: "pre_integration", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", scenario_vi: "Sample emergency vẫn phải đọc Gurmukhi trước English.", scenario_en: "The emergency sample still must read Gurmukhi before English.", expected_vi: "Có context bệnh viện hoặc clinic ở Canada.", expected_en: "Includes hospital or clinic context in Canada.", regressionCheck_vi: "Bắt sample để English emergency thay chữ.", regressionCheck_en: "Catches samples where English emergency replaces script.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-regression-sign-003", focus: "survival_signage", mode: "sanity", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", scenario_vi: "Sample pharmacy kiểm loanword không che chữ ਫ.", scenario_en: "The pharmacy sample checks that the loanword does not hide ਫ.", expected_vi: "ਫਾਰਮੇਸੀ được đọc trước pharmacy/farmacy.", expected_en: "ਫਾਰਮੇਸੀ is read before pharmacy/farmacy.", regressionCheck_vi: "Bắt sample chỉ dựa vào English spelling.", regressionCheck_en: "Catches samples that rely only on English spelling.", learnerTrap: { vi: "Từ mượn quen dễ làm đọc lướt.", en: "A familiar loanword can cause skim reading." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_vocabulary",
    title_vi: "Service vocabulary",
    title_en: "Service Vocabulary",
    regressionGoal_vi: "Kiểm từ dịch vụ Canada-practical vẫn Gurmukhi-first và có ngữ cảnh.",
    regressionGoal_en: "Check Canada-practical service words remain Gurmukhi-first and contextualized.",
    samples: [
      { id: "pa-final-regression-service-001", focus: "service_vocabulary", mode: "sanity", gurmukhi: "ਦਵਾਈ", romanization: "davai", scenario_vi: "Sample thuốc cần context pharmacy hoặc clinic.", scenario_en: "The medicine sample needs pharmacy or clinic context.", expected_vi: "Có ਦਵਾਈ, nghĩa thuốc và giải thích VI/EN.", expected_en: "Includes ਦਵਾਈ, medicine meaning, and VI/EN explanation.", regressionCheck_vi: "Bắt từ dịch vụ chỉ học rời không ngữ cảnh.", regressionCheck_en: "Catches isolated service words without context.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-regression-service-002", focus: "service_vocabulary", mode: "final_regression", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", scenario_vi: "Sample tiền thuê cần housing form hoặc rental notice.", scenario_en: "The rent sample needs housing form or rental notice context.", expected_vi: "ਕਿਰਾਇਆ giữ Gurmukhi chính và nghĩa tiền thuê.", expected_en: "ਕਿਰਾਇਆ stays primary and means rent.", regressionCheck_vi: "Bắt sample chỉ ghi rent bằng English.", regressionCheck_en: "Catches samples that only write rent in English.", canadaPractical: true, finalRegression: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "High-frequency verbs",
    title_en: "High-Frequency Verbs",
    regressionGoal_vi: "Kiểm động từ lõi xuất hiện trong cụm hành động, không chỉ học rời.",
    regressionGoal_en: "Check core verbs appear in action chunks, not only as isolated vocabulary.",
    samples: [
      { id: "pa-final-regression-verb-001", focus: "high_frequency_verbs", mode: "sanity", gurmukhi: "ਕਰਨਾ", romanization: "karna", scenario_vi: "Sample ਕਰਨਾ cần ghép với hành động hoặc giấy tờ.", scenario_en: "The ਕਰਨਾ sample needs pairing with an action or paperwork.", expected_vi: "Động từ được hiểu qua cụm, không học rời.", expected_en: "The verb is understood through a chunk, not in isolation.", regressionCheck_vi: "Bắt sample verb deck không có context.", regressionCheck_en: "Catches verb-deck samples without context.", preIntegration: true },
      { id: "pa-final-regression-verb-002", focus: "high_frequency_verbs", mode: "final_regression", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", scenario_vi: "Sample ਲੈਣਾ cần hiểu là đặt/lấy lịch ở clinic.", scenario_en: "The ਲੈਣਾ sample needs to mean booking/taking an appointment at a clinic.", expected_vi: "Người học hiểu cụm như hành động đặt lịch.", expected_en: "Learner understands the chunk as appointment booking.", regressionCheck_vi: "Bắt sample dịch ਲੈਣਾ rời khỏi context.", regressionCheck_en: "Catches samples translating ਲੈਣਾ outside context.", canadaPractical: true, finalRegression: true },
      { id: "pa-final-regression-verb-003", focus: "high_frequency_verbs", mode: "readiness", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", scenario_vi: "Sample ਸਮਝਣਾ cần câu báo chưa hiểu.", scenario_en: "The ਸਮਝਣਾ sample needs a sentence for not understanding.", expected_vi: "Câu hỗ trợ đầy đủ được giữ trong service context.", expected_en: "The full support sentence remains in service context.", regressionCheck_vi: "Bắt sample chỉ còn động từ ਸਮਝਣਾ rời.", regressionCheck_en: "Catches samples reduced to isolated ਸਮਝਣਾ.", canadaPractical: true, finalRegression: true },
    ],
  },
  {
    focus: "collocations",
    title_vi: "Collocations",
    title_en: "Collocations",
    regressionGoal_vi: "Kiểm collocation được giữ như đơn vị nghĩa trong tình huống dịch vụ.",
    regressionGoal_en: "Check collocations remain meaning units in service situations.",
    samples: [
      { id: "pa-final-regression-collocation-001", focus: "collocations", mode: "final_regression", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", scenario_vi: "Sample cần giúp đỡ phải giữ câu đầy đủ.", scenario_en: "The I-need-help sample must keep the full sentence.", expected_vi: "Người học dùng được câu khi hỏi nhân viên dịch vụ.", expected_en: "Learner can use the sentence when asking service staff.", regressionCheck_vi: "Bắt sample rút gọn chỉ còn ਮਦਦ.", regressionCheck_en: "Catches samples reduced to only ਮਦਦ.", canadaPractical: true, finalRegression: true },
      { id: "pa-final-regression-collocation-002", focus: "collocations", mode: "pre_integration", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", scenario_vi: "Sample điền form cần context giấy tờ.", scenario_en: "The fill-out-a-form sample needs paperwork context.", expected_vi: "Cụm được đọc như một hành động đầy đủ.", expected_en: "The chunk is read as one complete action.", regressionCheck_vi: "Bắt sample dịch từng từ không có workflow.", regressionCheck_en: "Catches word-by-word samples without workflow.", canadaPractical: true, preIntegration: true },
      { id: "pa-final-regression-collocation-003", focus: "collocations", mode: "sanity", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", scenario_vi: "Sample sửa lỗi cần giữ chữ ਠ.", scenario_en: "The correction sample needs to keep ਠ.", expected_vi: "Không đọc ਠ như English th.", expected_en: "Does not read ਠ as English th.", regressionCheck_vi: "Bắt romanization làm mất distinction ਠ.", regressionCheck_en: "Catches romanization hiding the ਠ distinction.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, finalRegression: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Shahmukhi awareness",
    title_en: "Shahmukhi Awareness",
    regressionGoal_vi: "Kiểm Shahmukhi chỉ là awareness phạm vi và Gurmukhi vẫn là chính.",
    regressionGoal_en: "Check Shahmukhi is scope awareness only and Gurmukhi remains primary.",
    samples: [
      { id: "pa-final-regression-shahmukhi-001", focus: "shahmukhi_awareness", mode: "readiness", gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", scenario_vi: "Sample awareness nói rõ Gurmukhi là chính.", scenario_en: "The awareness sample states clearly that Gurmukhi is primary.", expected_vi: "Shahmukhi chỉ là awareness, không phải khóa đầy đủ.", expected_en: "Shahmukhi is awareness only, not a full course.", regressionCheck_vi: "Bắt nội dung Shahmukhi vượt phạm vi.", regressionCheck_en: "Catches Shahmukhi content that exceeds scope.", finalRegression: true },
    ],
  },
  {
    focus: "pre_integration_sanity",
    title_vi: "Pre-integration sanity",
    title_en: "Pre-Integration Sanity",
    regressionGoal_vi: "Kiểm sample cuối là TypeScript data app-consumable và không mở rộng ngoài phạm vi.",
    regressionGoal_en: "Check final samples are app-consumable TypeScript data and do not expand scope.",
    samples: [
      { id: "pa-final-regression-sanity-001", focus: "pre_integration_sanity", mode: "pre_integration", gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim jaanch", scenario_vi: "Sample checklist cuối kiểm id, focus, Gurmukhi và VI/EN.", scenario_en: "The final checklist sample checks id, focus, Gurmukhi, and VI/EN.", expected_vi: "Dữ liệu dùng được trong app, không phải notes rời.", expected_en: "Data is usable by the app, not loose notes.", regressionCheck_vi: "Bắt thiếu field hoặc thiếu Gurmukhi primary.", regressionCheck_en: "Catches missing fields or missing Gurmukhi primary.", preIntegration: true, finalRegression: true },
      { id: "pa-final-regression-sanity-002", focus: "pre_integration_sanity", mode: "final_regression", gurmukhi: "ਮੁੜ ਜਾਂਚ", romanization: "mur jaanch", scenario_vi: "Sample regression cuối kiểm scope và native-review claim.", scenario_en: "The final regression sample checks scope and native-review claims.", expected_vi: "Không claim native review và chỉ tập trung Punjabi script/vocabulary.", expected_en: "No native review claim and only Punjabi script/vocabulary focus.", regressionCheck_vi: "Bắt scope drift trước pre-integration.", regressionCheck_en: "Catches scope drift before pre-integration.", finalRegression: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLES = sections;

export const PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLE_ITEMS: ReadonlyArray<PunjabiScriptVocabularyFinalRegressionSample> =
  sections.flatMap((section) => section.samples);

export default PUNJABI_SCRIPT_VOCABULARY_FINAL_REGRESSION_SAMPLES;
