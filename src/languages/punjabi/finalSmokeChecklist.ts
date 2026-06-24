// src/languages/punjabi/finalSmokeChecklist.ts
//
// Wave 19 final smoke checklist for Punjabi before later integration.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiSmokeCheckArea =
  | "a1_c2_coverage"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_practical"
  | "golden_sample"
  | "final_qa"
  | "integration_readiness"
  | "forbidden_claim";

export type PunjabiSmokeCheckStatus = "pass_ready" | "manual_review" | "deferred_boundary";

export type PunjabiFinalSmokeCheck = {
  id: string;
  area: PunjabiSmokeCheckArea;
  status: PunjabiSmokeCheckStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  smoke_check_vi: string;
  smoke_check_en: string;
  pass_signal_vi: string;
  pass_signal_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  modules_checked: string[];
  smoke_steps: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_FINAL_SMOKE_SCOPE = {
  wave: "Wave 19",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final smoke checklist này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This final smoke checklist uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_SMOKE_AREAS: PunjabiSmokeCheckArea[] = [
  "a1_c2_coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "golden_sample",
  "final_qa",
  "integration_readiness",
  "forbidden_claim",
];

export const PUNJABI_FINAL_SMOKE_CHECKLIST: PunjabiFinalSmokeCheck[] = [
  {
    id: "smoke-a1-c2-route",
    area: "a1_c2_coverage",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਰਾਹ",
    romanization: "A1-C2 rah",
    title_vi: "Smoke route A1-C2",
    title_en: "A1-C2 smoke route",
    smoke_check_vi: "Mở manifest, navigation, can-do và progression để xác nhận A1-C2 đều xuất hiện.",
    smoke_check_en: "Open manifest, navigation, can-do, and progression to confirm A1-C2 all appear.",
    pass_signal_vi: "Có level coverage, route học, checkpoint và readiness cho tất cả cấp.",
    pass_signal_en: "Level coverage, learner routes, checkpoints, and readiness exist for every level.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    modules_checked: ["courseMap", "progressionMatrix", "finalCanDoIndex", "finalNavigationMap", "finalContentManifest"],
    smoke_steps: ["scan levels", "scan routes", "scan readiness"],
    learner_trap_vi: "A1-C2 là cấu trúc học, không phải chứng chỉ chính thức.",
    learner_trap_en: "A1-C2 is learning structure, not official certification.",
  },
  {
    id: "smoke-gurmukhi-primary",
    area: "gurmukhi_first",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Smoke Gurmukhi trước",
    title_en: "Gurmukhi-first smoke check",
    smoke_check_vi: "Kiểm title_pa và sample.gurmukhi trước romanization trong dữ liệu chính.",
    smoke_check_en: "Check title_pa and sample.gurmukhi before romanization in primary data.",
    pass_signal_vi: "Punjabi content dùng Gurmukhi primary và romanization chỉ hỗ trợ.",
    pass_signal_en: "Punjabi content uses Gurmukhi primary and romanization only as support.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    modules_checked: ["index", "lessons-a1", "dialogues", "finalNavigationMap", "finalContentManifest"],
    smoke_steps: ["scan title_pa", "scan sample.gurmukhi", "scan romanization support"],
    learner_trap_vi: "Đừng để chữ Latin trở thành tín hiệu chính.",
    learner_trap_en: "Do not let Latin letters become the primary signal.",
  },
  {
    id: "smoke-shahmukhi-boundary",
    area: "gurmukhi_first",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸ਼ਾਹਮੁਖੀ ਸੀਮਾ",
    romanization: "Shahmukhi sima",
    title_vi: "Smoke ranh giới Shahmukhi",
    title_en: "Shahmukhi boundary smoke check",
    smoke_check_vi: "Kiểm Shahmukhi chỉ là awareness-only trong scope, không có khóa đầy đủ.",
    smoke_check_en: "Check Shahmukhi is awareness-only in scope, with no full course.",
    pass_signal_vi: "Scope nêu awareness-only và sample vẫn là Gurmukhi.",
    pass_signal_en: "Scope states awareness-only and samples remain Gurmukhi.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    modules_checked: ["courseMap", "finalModuleRegistry", "finalContentManifest", "finalSmokeChecklist"],
    smoke_steps: ["scan script note", "scan samples", "verify no full Shahmukhi course"],
    learner_trap_vi: "Biết Shahmukhi tồn tại không đồng nghĩa course này dạy đọc hệ chữ đó.",
    learner_trap_en: "Knowing Shahmukhi exists does not mean this course teaches reading that script.",
  },
  {
    id: "smoke-vi-en-support",
    area: "learner_support",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Smoke hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English smoke check",
    smoke_check_vi: "Kiểm mỗi route chính có Vietnamese và English explanations.",
    smoke_check_en: "Check each major route has Vietnamese and English explanations.",
    pass_signal_vi: "Fields VI/EN xuất hiện trong goal, sample, trap, readiness và QA.",
    pass_signal_en: "VI/EN fields appear in goals, samples, traps, readiness, and QA.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    modules_checked: ["dialogues", "learningPath", "contentIndex", "finalQaInventory", "finalNavigationMap"],
    smoke_steps: ["scan Vietnamese fields", "scan English fields", "scan learner traps"],
    learner_trap_vi: "Không dùng tiếng Anh thay thế phần giải thích tiếng Việt.",
    learner_trap_en: "Do not use English as a substitute for Vietnamese explanations.",
  },
  {
    id: "smoke-canada-survival-public",
    area: "canada_practical",
    status: "manual_review",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ",
    romanization: "Canada survival",
    title_vi: "Smoke survival và dịch vụ công Canada",
    title_en: "Canada survival and public-service smoke check",
    smoke_check_vi: "Kiểm greeting, phone, address, documents và public-service questions.",
    smoke_check_en: "Check greetings, phone, address, documents, and public-service questions.",
    pass_signal_vi: "Có câu thực tế cho settlement, school office, community counter và public service.",
    pass_signal_en: "Practical sentences exist for settlement, school office, community counter, and public service.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    modules_checked: ["dialogues", "learningPath", "finalCanDoIndex", "finalNavigationMap", "finalContentManifest"],
    smoke_steps: ["scan survival route", "scan settlement examples", "scan public-service examples"],
    learner_trap_vi: "Public-service language practice không phải tư vấn pháp lý.",
    learner_trap_en: "Public-service language practice is not legal advice.",
    canada_practical: "Settlement forms, school offices, community counters, municipal services, and public service desks in Canada.",
  },
  {
    id: "smoke-canada-work-health",
    area: "canada_practical",
    status: "manual_review",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਅਤੇ ਸਿਹਤ",
    romanization: "kamm ate sehat",
    title_vi: "Smoke công việc và y tế Canada",
    title_en: "Canada work and health smoke check",
    smoke_check_vi: "Kiểm ca làm, workplace register, symptom description và no-medical-advice boundary.",
    smoke_check_en: "Check shifts, workplace register, symptom description, and no-medical-advice boundary.",
    pass_signal_vi: "Có mẫu workplace và healthcare nhưng không chẩn đoán hoặc hướng dẫn điều trị.",
    pass_signal_en: "Workplace and healthcare samples exist without diagnosis or treatment guidance.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    modules_checked: ["dialogues", "masteryCheckpoints", "finalCanDoIndex", "finalNavigationMap", "finalQualityGates"],
    smoke_steps: ["scan workplace route", "scan healthcare route", "scan scope boundary"],
    learner_trap_vi: "Một câu Punjabi đúng không phải là chẩn đoán.",
    learner_trap_en: "A correct Punjabi sentence is not a diagnosis.",
    canada_practical: "Work schedules, workplace messages, clinic intake, pharmacy counters, and telehealth notes in Canada.",
  },
  {
    id: "smoke-golden-samples",
    area: "golden_sample",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸੋਨੇ ਦੇ ਨਮੂਨੇ",
    romanization: "sone de namune",
    title_vi: "Smoke golden samples",
    title_en: "Golden sample smoke check",
    smoke_check_vi: "Kiểm một bộ sample nhỏ để render Gurmukhi, romanization, VI và EN.",
    smoke_check_en: "Check a small sample set for Gurmukhi, romanization, VI, and EN rendering.",
    pass_signal_vi: "Greeting, documents, health, decision, summary và final check đều có sample.",
    pass_signal_en: "Greeting, documents, health, decision, summary, and final check all have samples.",
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    modules_checked: ["dialogues", "finalCanDoIndex", "finalNavigationMap", "finalContentManifest"],
    smoke_steps: ["render Gurmukhi", "render romanization", "render VI/EN"],
    learner_trap_vi: "Golden sample là smoke check, không thay native review.",
    learner_trap_en: "A golden sample is a smoke check, not a replacement for native review.",
  },
  {
    id: "smoke-final-qa",
    area: "final_qa",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ QA",
    romanization: "antim QA",
    title_vi: "Smoke final QA",
    title_en: "Final QA smoke check",
    smoke_check_vi: "Kiểm QA inventory, pre-MR audit, handoff, navigation, quality gates và manifest.",
    smoke_check_en: "Check QA inventory, pre-MR audit, handoff, navigation, quality gates, and manifest.",
    pass_signal_vi: "Review trail có đủ final-QA, audit, handoff, navigation và content manifest.",
    pass_signal_en: "Review trail includes final QA, audit, handoff, navigation, and content manifest.",
    sample: { gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim janch", vi: "kiểm tra cuối", en: "final check" },
    modules_checked: ["finalQaInventory", "preMrAuditChecklist", "preIntegrationHandoffMap", "finalNavigationMap", "finalQualityGates", "finalContentManifest"],
    smoke_steps: ["scan QA entries", "scan audit entries", "scan manifest routes"],
    learner_trap_vi: "Final QA pass không đồng nghĩa deploy hoặc merge.",
    learner_trap_en: "Final QA pass does not mean deploy or merge.",
  },
  {
    id: "smoke-remediation-readiness",
    area: "integration_readiness",
    status: "manual_review",
    levels: ["B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਤਿਆਰੀ",
    romanization: "murammat tiari",
    title_vi: "Smoke remediation readiness",
    title_en: "Remediation readiness smoke check",
    smoke_check_vi: "Kiểm lỗi politeness, grammar, reading và writing có đường sửa trước integration sau này.",
    smoke_check_en: "Check politeness, grammar, reading, and writing errors have repair paths before later integration.",
    pass_signal_vi: "Dependency graph, mastery checkpoints, can-do và navigation đều có remediation route.",
    pass_signal_en: "Dependency graph, mastery checkpoints, can-do, and navigation all have remediation routes.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਲਿਖੋ।", romanization: "kirpa karke ih dubara likho", vi: "Xin vui lòng viết lại điều này.", en: "Please write this again." },
    modules_checked: ["skillDependencyGraph", "masteryCheckpoints", "finalCanDoIndex", "finalNavigationMap"],
    smoke_steps: ["scan learner traps", "scan checkpoints", "scan next steps"],
    learner_trap_vi: "Thêm một marker lịch sự chưa đủ nếu register cả câu vẫn thô.",
    learner_trap_en: "Adding one politeness marker is not enough if the whole sentence remains blunt.",
  },
  {
    id: "smoke-native-review-deferred",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Smoke native review hoãn",
    title_en: "Deferred native review smoke check",
    smoke_check_vi: "Kiểm không có tuyên bố native review đã hoàn tất.",
    smoke_check_en: "Check there is no claim that native review is complete.",
    pass_signal_vi: "Scope nói native review deferred và completed native review is not claimed.",
    pass_signal_en: "Scope states native review is deferred and completed native review is not claimed.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    modules_checked: ["finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist", "finalQualityGates", "finalContentManifest"],
    smoke_steps: ["scan native-review text", "scan overclaim language", "scan scope"],
    learner_trap_vi: "Smoke pass không đồng nghĩa người bản ngữ đã phê duyệt.",
    learner_trap_en: "Smoke pass does not mean native-speaker approval is complete.",
  },
  {
    id: "smoke-no-audio-azure",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਆਡੀਓ ਨਹੀਂ",
    romanization: "audio nahin",
    title_vi: "Smoke không audio/Azure",
    title_en: "No audio/Azure smoke check",
    smoke_check_vi: "Kiểm không audio, microphone, pronunciation scoring, Azure hoặc speech pipeline.",
    smoke_check_en: "Check there is no audio, microphone, pronunciation scoring, Azure, or speech pipeline.",
    pass_signal_vi: "Speaking prompts giữ text-only và không có pronunciation scoring.",
    pass_signal_en: "Speaking prompts remain text-only and have no pronunciation scoring.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    modules_checked: ["masteryCheckpoints", "finalCanDoIndex", "finalQualityGates", "finalContentManifest"],
    smoke_steps: ["scan audio claims", "scan scoring claims", "scan Azure claims"],
    learner_trap_vi: "Text-only speaking practice không đánh giá phát âm.",
    learner_trap_en: "Text-only speaking practice does not evaluate pronunciation.",
  },
  {
    id: "smoke-no-a11-infra",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A11 ਅਤੇ ਇਨਫਰਾ ਨਹੀਂ",
    romanization: "A11 ate infra nahin",
    title_vi: "Smoke không A11/hạ tầng",
    title_en: "No A11/infrastructure smoke check",
    smoke_check_vi: "Kiểm Wave 19 không chạy A11 integration, không auth, billing, RLS, Supabase, CI, push hoặc deploy.",
    smoke_check_en: "Check Wave 19 does not run A11 integration and does not touch auth, billing, RLS, Supabase, CI, push, or deploy.",
    pass_signal_vi: "Checklist là dữ liệu smoke và test riêng, không phải hạ tầng hoặc release.",
    pass_signal_en: "Checklist is smoke data with its own test, not infrastructure or release work.",
    sample: { gurmukhi: "ਸੀਮਾ", romanization: "sima", vi: "ranh giới", en: "boundary" },
    modules_checked: ["finalSmokeChecklist"],
    smoke_steps: ["verify no A11 command", "verify no push", "verify no deploy"],
    learner_trap_vi: "Smoke checklist sẵn sàng không nghĩa là đã tích hợp UI chính.",
    learner_trap_en: "Smoke checklist readiness does not mean the main UI is integrated.",
  },
];

export const PUNJABI_FINAL_SMOKE_SEQUENCE = [
  {
    id: "coverage-smoke",
    vi: "Coverage smoke: A1-C2 -> Gurmukhi -> Shahmukhi awareness-only -> VI/EN.",
    en: "Coverage smoke: A1-C2 -> Gurmukhi -> Shahmukhi awareness-only -> VI/EN.",
    check_ids: ["smoke-a1-c2-route", "smoke-gurmukhi-primary", "smoke-shahmukhi-boundary", "smoke-vi-en-support"],
  },
  {
    id: "canada-sample-smoke",
    vi: "Canada smoke: survival/public service -> work/health -> golden samples -> remediation.",
    en: "Canada smoke: survival/public service -> work/health -> golden samples -> remediation.",
    check_ids: ["smoke-canada-survival-public", "smoke-canada-work-health", "smoke-golden-samples", "smoke-remediation-readiness"],
  },
  {
    id: "boundary-smoke",
    vi: "Boundary smoke: final QA -> native review deferred -> no audio/Azure -> no A11/infrastructure.",
    en: "Boundary smoke: final QA -> native review deferred -> no audio/Azure -> no A11/infrastructure.",
    check_ids: ["smoke-final-qa", "smoke-native-review-deferred", "smoke-no-audio-azure", "smoke-no-a11-infra"],
  },
];

export const PUNJABI_FINAL_SMOKE_CHECKLIST_ROOT = {
  scope: PUNJABI_FINAL_SMOKE_SCOPE,
  areas: PUNJABI_FINAL_SMOKE_AREAS,
  checks: PUNJABI_FINAL_SMOKE_CHECKLIST,
  sequence: PUNJABI_FINAL_SMOKE_SEQUENCE,
} as const;

export default PUNJABI_FINAL_SMOKE_CHECKLIST_ROOT;
