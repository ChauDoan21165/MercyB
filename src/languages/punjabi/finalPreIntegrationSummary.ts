// src/languages/punjabi/finalPreIntegrationSummary.ts
//
// Wave 21 final pre-integration summary for Punjabi.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiPreIntegrationSummaryArea =
  | "exists"
  | "coverage"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_practical"
  | "deferred"
  | "forbidden_claim"
  | "exit_ticket"
  | "final_proof"
  | "final_qa";

export type PunjabiPreIntegrationSummaryStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalPreIntegrationSummaryItem = {
  id: string;
  area: PunjabiPreIntegrationSummaryArea;
  status: PunjabiPreIntegrationSummaryStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  summary_vi: string;
  summary_en: string;
  final_proof_vi: string;
  final_proof_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  modules: string[];
  proof_tags: string[];
  exit_ticket_vi?: string;
  exit_ticket_en?: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE = {
  wave: "Wave 21",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final pre-integration summary này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This final pre-integration summary uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_AREAS: PunjabiPreIntegrationSummaryArea[] = [
  "exists",
  "coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "deferred",
  "forbidden_claim",
  "exit_ticket",
  "final_proof",
  "final_qa",
];

export const PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY: PunjabiFinalPreIntegrationSummaryItem[] = [
  {
    id: "summary-what-exists",
    area: "exists",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੀ ਮੌਜੂਦ ਹੈ",
    romanization: "ki maujud hai",
    title_vi: "Những gì đã có",
    title_en: "What exists",
    summary_vi: "Punjabi có foundation, dialogues, course map, learning path, progression, checkpoints, indexes, QA, audit, handoff, navigation, manifest, smoke và evidence maps.",
    summary_en: "Punjabi has foundation, dialogues, course map, learning path, progression, checkpoints, indexes, QA, audit, handoff, navigation, manifest, smoke, and evidence maps.",
    final_proof_vi: "Các module chính là dữ liệu TypeScript có test riêng, không phải ghi chú rời.",
    final_proof_en: "Major modules are TypeScript data with their own tests, not loose notes.",
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    modules: ["index", "dialogues", "courseMap", "learningPath", "progressionMatrix", "finalNavigationMap", "finalContentManifest", "finalIntegrationEvidenceMap"],
    proof_tags: ["module-exists", "typescript-data", "tested"],
    exit_ticket_vi: "Reviewer có thể tìm module đại diện mà không đoán tên file.",
    exit_ticket_en: "A reviewer can find representative modules without guessing filenames.",
    learner_trap_vi: "Có module đầy đủ không đồng nghĩa đã native-reviewed.",
    learner_trap_en: "Complete modules do not mean native review is complete.",
  },
  {
    id: "summary-level-coverage",
    area: "coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ ਕਵਰੇਜ",
    romanization: "paddar coverage",
    title_vi: "Độ phủ A1-C2",
    title_en: "A1-C2 coverage",
    summary_vi: "A1-C2 xuất hiện trong route, can-do, quality gate, manifest, smoke và evidence.",
    summary_en: "A1-C2 appear in routes, can-do items, quality gates, manifest, smoke checklist, and evidence.",
    final_proof_vi: "Later A11 có thể route theo cấp mà không suy đoán coverage.",
    final_proof_en: "Later A11 can route by level without guessing coverage.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    modules: ["courseMap", "progressionMatrix", "finalCanDoIndex", "finalQualityGates", "finalSmokeChecklist"],
    proof_tags: ["A1-C2", "coverage", "readiness"],
    exit_ticket_vi: "A1, A2, B1, B2, C1 và C2 đều có bằng chứng.",
    exit_ticket_en: "A1, A2, B1, B2, C1, and C2 all have evidence.",
    learner_trap_vi: "A1-C2 ở đây không phải chứng chỉ chính thức.",
    learner_trap_en: "A1-C2 here is not official certification.",
  },
  {
    id: "summary-gurmukhi-first",
    area: "gurmukhi_first",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    summary_vi: "Gurmukhi là chữ chính trong title và sample; romanization hỗ trợ nhưng không thay thế.",
    summary_en: "Gurmukhi is primary in titles and samples; romanization supports but does not replace it.",
    final_proof_vi: "Scope và sample trong các wave cuối đều giữ Gurmukhi primary.",
    final_proof_en: "Scope and samples in the final waves keep Gurmukhi primary.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    modules: ["index", "lessons-a1", "dialogues", "finalNavigationMap", "finalIntegrationEvidenceMap"],
    proof_tags: ["gurmukhi-first", "script", "romanization-support"],
    exit_ticket_vi: "Later UI nên hiển thị Gurmukhi trước romanization.",
    exit_ticket_en: "Later UI should display Gurmukhi before romanization.",
    learner_trap_vi: "Romanization có thể che mất bật hơi và retroflex.",
    learner_trap_en: "Romanization can hide aspiration and retroflex contrasts.",
  },
  {
    id: "summary-shahmukhi-awareness",
    area: "deferred",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸ਼ਾਹਮੁਖੀ ਜਾਣਕਾਰੀ",
    romanization: "Shahmukhi jankari",
    title_vi: "Shahmukhi awareness",
    title_en: "Shahmukhi awareness",
    summary_vi: "Shahmukhi chỉ được nhắc để nhận biết, không phải full course.",
    summary_en: "Shahmukhi is mentioned only for awareness, not as a full course.",
    final_proof_vi: "Sample vẫn dùng Gurmukhi; không thêm bài dạy Shahmukhi.",
    final_proof_en: "Samples remain Gurmukhi; no Shahmukhi teaching lessons are added.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    modules: ["courseMap", "finalModuleRegistry", "finalContentManifest", "finalIntegrationEvidenceMap"],
    proof_tags: ["awareness-only", "not-full-course", "script-boundary"],
    exit_ticket_vi: "Later A11 phải giữ wording awareness-only.",
    exit_ticket_en: "Later A11 must keep awareness-only wording.",
    learner_trap_vi: "Biết tên Shahmukhi không đồng nghĩa học đọc hệ chữ đó.",
    learner_trap_en: "Knowing the name Shahmukhi does not mean learning to read that script.",
  },
  {
    id: "summary-vi-en-support",
    area: "learner_support",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    summary_vi: "Người học Việt và Anh có explanations trong goals, samples, readiness, traps và QA.",
    summary_en: "Vietnamese-speaking and English-speaking learners have explanations in goals, samples, readiness, traps, and QA.",
    final_proof_vi: "VI/EN fields xuất hiện trong dialogues, paths, indexes và các final review artifacts.",
    final_proof_en: "VI/EN fields appear in dialogues, paths, indexes, and final review artifacts.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    modules: ["dialogues", "learningPath", "contentIndex", "finalQaInventory", "finalSmokeChecklist"],
    proof_tags: ["vi-support", "en-support", "learner-traps"],
    exit_ticket_vi: "Không cần English-only fallback cho người học Việt.",
    exit_ticket_en: "No English-only fallback is needed for Vietnamese-speaking learners.",
    learner_trap_vi: "Bản dịch không thay thế trap note riêng cho người Việt.",
    learner_trap_en: "A translation does not replace a specific trap note for Vietnamese-speaking learners.",
  },
  {
    id: "summary-canada-survival-public",
    area: "canada_practical",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਸੇਵਾ",
    romanization: "Canada seva",
    title_vi: "Survival và dịch vụ công Canada",
    title_en: "Canada survival and public service",
    summary_vi: "Có route cho settlement, survival, phone, address, documents và public-service questions.",
    summary_en: "Routes exist for settlement, survival, phone, address, documents, and public-service questions.",
    final_proof_vi: "Dialogue, final can-do, navigation, manifest, smoke và evidence map đều có Canada-practical items.",
    final_proof_en: "Dialogues, final can-do, navigation, manifest, smoke, and evidence map all include Canada-practical items.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    modules: ["dialogues", "finalCanDoIndex", "finalNavigationMap", "finalContentManifest", "finalSmokeChecklist"],
    proof_tags: ["canada-practical", "survival", "public-service"],
    exit_ticket_vi: "Public-service content là language practice, không phải tư vấn pháp lý.",
    exit_ticket_en: "Public-service content is language practice, not legal advice.",
    learner_trap_vi: "ਕਿਹੜੇ là which; đừng lẫn với ਕਿੱਥੇ là where.",
    learner_trap_en: "Kihre means which; do not confuse it with kithe, where.",
    canada_practical: "Settlement forms, school offices, community counters, municipal services, and public service desks in Canada.",
  },
  {
    id: "summary-canada-work-health",
    area: "canada_practical",
    status: "manual_review_needed",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਅਤੇ ਸਿਹਤ",
    romanization: "kamm ate sehat",
    title_vi: "Công việc và y tế Canada",
    title_en: "Canada work and health",
    summary_vi: "Có route cho workplace register, ca làm và mô tả triệu chứng, kèm boundary không chẩn đoán.",
    summary_en: "Routes exist for workplace register, shifts, and symptom descriptions, with no-diagnosis boundaries.",
    final_proof_vi: "Work/health xuất hiện trong dialogues, can-do, navigation, quality gates, smoke và evidence.",
    final_proof_en: "Work/health appear in dialogues, can-do, navigation, quality gates, smoke, and evidence.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    modules: ["dialogues", "masteryCheckpoints", "finalCanDoIndex", "finalQualityGates", "finalIntegrationEvidenceMap"],
    proof_tags: ["canada-practical", "work", "health", "scope-boundary"],
    exit_ticket_vi: "Healthcare sentence chỉ là language practice.",
    exit_ticket_en: "Healthcare sentences are language practice only.",
    learner_trap_vi: "Một câu Punjabi đúng không phải chẩn đoán.",
    learner_trap_en: "A correct Punjabi sentence is not a diagnosis.",
    canada_practical: "Work schedules, workplace messages, clinic intake, pharmacy counters, and telehealth notes in Canada.",
  },
  {
    id: "summary-remediation",
    area: "exit_ticket",
    status: "manual_review_needed",
    levels: ["B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਰਾਹ",
    romanization: "murammat rah",
    title_vi: "Đường sửa lỗi",
    title_en: "Remediation route",
    summary_vi: "Remediation có traps và checkpoints cho politeness, grammar, reading và writing.",
    summary_en: "Remediation has traps and checkpoints for politeness, grammar, reading, and writing.",
    final_proof_vi: "Dependency graph, mastery checkpoints, can-do, navigation và smoke checklist đều trỏ tới remediation.",
    final_proof_en: "Dependency graph, mastery checkpoints, can-do, navigation, and smoke checklist all point to remediation.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਲਿਖੋ।", romanization: "kirpa karke ih dubara likho", vi: "Xin vui lòng viết lại điều này.", en: "Please write this again." },
    modules: ["skillDependencyGraph", "masteryCheckpoints", "finalCanDoIndex", "finalNavigationMap", "finalSmokeChecklist"],
    proof_tags: ["remediation", "learner-traps", "checkpoint"],
    exit_ticket_vi: "Sửa register trước khi mở task nâng cao.",
    exit_ticket_en: "Repair register before unlocking advanced tasks.",
    learner_trap_vi: "Thêm một marker lịch sự chưa đủ nếu register cả câu vẫn thô.",
    learner_trap_en: "Adding one politeness marker is not enough if the whole sentence remains blunt.",
  },
  {
    id: "summary-final-qa-proof",
    area: "final_proof",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ QA ਸਬੂਤ",
    romanization: "antim QA sabut",
    title_vi: "Bằng chứng final QA",
    title_en: "Final QA proof",
    summary_vi: "QA inventory, pre-MR audit, handoff, navigation, quality gates, manifest, smoke và evidence map tạo review trail.",
    summary_en: "QA inventory, pre-MR audit, handoff, navigation, quality gates, manifest, smoke, and evidence map form a review trail.",
    final_proof_vi: "Later A11 có thể đọc review trail trước khi tích hợp.",
    final_proof_en: "Later A11 can read the review trail before integration.",
    sample: { gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim janch", vi: "kiểm tra cuối", en: "final check" },
    modules: ["finalQaInventory", "preMrAuditChecklist", "preIntegrationHandoffMap", "finalNavigationMap", "finalQualityGates", "finalContentManifest", "finalSmokeChecklist", "finalIntegrationEvidenceMap"],
    proof_tags: ["final-QA", "review-trail", "final-proof"],
    exit_ticket_vi: "Final QA proof không tự chạy A11.",
    exit_ticket_en: "Final QA proof does not run A11 by itself.",
    learner_trap_vi: "Review trail không đồng nghĩa deploy.",
    learner_trap_en: "A review trail does not mean deploy.",
  },
  {
    id: "summary-final-qa-check",
    area: "final_qa",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "QA ਚੈਕ",
    romanization: "QA check",
    title_vi: "Kiểm final QA",
    title_en: "Final QA check",
    summary_vi: "Final QA nối module registry, coverage map, quality gates, smoke checklist và evidence map.",
    summary_en: "Final QA connects the module registry, coverage map, quality gates, smoke checklist, and evidence map.",
    final_proof_vi: "Các artifact review có route và test riêng để dùng trước A11 sau này.",
    final_proof_en: "Review artifacts have routes and their own tests for use before later A11.",
    sample: { gurmukhi: "ਅੰਤਿਮ QA", romanization: "antim QA", vi: "QA cuối", en: "final QA" },
    modules: ["finalModuleRegistry", "preIntegrationCoverageMap", "finalQualityGates", "finalSmokeChecklist", "finalIntegrationEvidenceMap"],
    proof_tags: ["final-QA", "test-backed", "review-route"],
    exit_ticket_vi: "QA check không chạy A11 integration.",
    exit_ticket_en: "QA check does not run A11 integration.",
    learner_trap_vi: "QA check là bằng chứng review, không phải release.",
    learner_trap_en: "A QA check is review evidence, not a release.",
  },
  {
    id: "summary-native-review-deferred",
    area: "deferred",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Native review hoãn",
    title_en: "Deferred native review",
    summary_vi: "Native review được hoãn; không tuyên bố completed native review.",
    summary_en: "Native review is deferred; completed native review is not claimed.",
    final_proof_vi: "Scope và các final artifacts giữ boundary này.",
    final_proof_en: "Scope and final artifacts preserve this boundary.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    modules: ["finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist", "finalQualityGates", "finalIntegrationEvidenceMap"],
    proof_tags: ["native-review-deferred", "not-claimed", "boundary"],
    exit_ticket_vi: "Không claim native-reviewed nếu chưa có review thật.",
    exit_ticket_en: "Do not claim native-reviewed without actual review.",
    learner_trap_vi: "Summary cuối không phải phê duyệt của người bản ngữ.",
    learner_trap_en: "A final summary is not native-speaker approval.",
  },
  {
    id: "summary-forbidden-claims",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨਾਹੀ ਦਾਅਵੇ",
    romanization: "manahi daave",
    title_vi: "Không claim bị cấm",
    title_en: "Forbidden claims",
    summary_vi: "Không audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    summary_en: "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    final_proof_vi: "Các final artifacts giữ text-only và boundary no-infra.",
    final_proof_en: "Final artifacts keep text-only and no-infrastructure boundaries.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    modules: ["finalQualityGates", "finalSmokeChecklist", "finalIntegrationEvidenceMap", "finalPreIntegrationSummary"],
    proof_tags: ["no-audio", "no-scoring", "no-Azure", "no-A11", "no-deploy"],
    exit_ticket_vi: "Later integration phải là task riêng.",
    exit_ticket_en: "Later integration must be separate work.",
    learner_trap_vi: "Text-only speaking practice không đánh giá phát âm.",
    learner_trap_en: "Text-only speaking practice does not evaluate pronunciation.",
  },
  {
    id: "summary-exit-ticket",
    area: "exit_ticket",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਐਗਜ਼ਿਟ ਟਿਕਟ",
    romanization: "exit ticket",
    title_vi: "Exit ticket trước tích hợp",
    title_en: "Pre-integration exit ticket",
    summary_vi: "Punjabi có đủ evidence để người phụ trách sau này mở A11 integration riêng.",
    summary_en: "Punjabi has enough evidence for a later owner to open separate A11 integration work.",
    final_proof_vi: "Exit ticket gồm coverage, Gurmukhi, VI/EN, Canada domains, deferred review và forbidden claims.",
    final_proof_en: "The exit ticket includes coverage, Gurmukhi, VI/EN, Canada domains, deferred review, and forbidden claims.",
    sample: { gurmukhi: "ਸੀਮਾ", romanization: "sima", vi: "ranh giới", en: "boundary" },
    modules: ["finalContentManifest", "finalSmokeChecklist", "finalIntegrationEvidenceMap", "finalPreIntegrationSummary"],
    proof_tags: ["exit-ticket", "later-a11", "not-integration"],
    exit_ticket_vi: "Wave 21 kết thúc summary; không push, deploy hoặc A11.",
    exit_ticket_en: "Wave 21 ends the summary; no push, no deploy, or A11.",
    learner_trap_vi: "Ready for later A11 không nghĩa là đã tích hợp UI chính.",
    learner_trap_en: "Ready for later A11 does not mean integrated into the main UI.",
  },
];

export const PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROUTES = [
  {
    id: "coverage-proof-route",
    vi: "Coverage proof: what exists -> A1-C2 -> Gurmukhi -> VI/EN.",
    en: "Coverage proof: what exists -> A1-C2 -> Gurmukhi -> VI/EN.",
    item_ids: ["summary-what-exists", "summary-level-coverage", "summary-gurmukhi-first", "summary-vi-en-support"],
  },
  {
    id: "canada-proof-route",
    vi: "Canada proof: survival/public service -> work/health -> remediation.",
    en: "Canada proof: survival/public service -> work/health -> remediation.",
    item_ids: ["summary-canada-survival-public", "summary-canada-work-health", "summary-remediation"],
  },
  {
    id: "boundary-exit-route",
    vi: "Boundary and exit: Shahmukhi awareness-only -> final QA -> native review deferred -> forbidden claims -> exit ticket.",
    en: "Boundary and exit: Shahmukhi awareness-only -> final QA -> native review deferred -> forbidden claims -> exit ticket.",
    item_ids: ["summary-shahmukhi-awareness", "summary-final-qa-proof", "summary-native-review-deferred", "summary-forbidden-claims", "summary-exit-ticket"],
  },
];

export const PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROOT = {
  scope: PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE,
  areas: PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_AREAS,
  items: PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY,
  routes: PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROUTES,
} as const;

export default PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROOT;
