// src/languages/punjabi/finalIntegrationEvidenceMap.ts
//
// Wave 20 final evidence map for later A11 integration.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiIntegrationEvidenceArea =
  | "representative_module"
  | "level_coverage"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_practical"
  | "integration_sample"
  | "final_qa"
  | "deferred_review"
  | "forbidden_claim";

export type PunjabiIntegrationEvidenceStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalIntegrationEvidence = {
  id: string;
  area: PunjabiIntegrationEvidenceArea;
  status: PunjabiIntegrationEvidenceStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  evidence_vi: string;
  evidence_en: string;
  integration_sample_vi: string;
  integration_sample_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  representative_modules: string[];
  evidence_tags: string[];
  later_a11_note_vi: string;
  later_a11_note_en: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE = {
  wave: "Wave 20",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final integration evidence map này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This final integration evidence map uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_INTEGRATION_EVIDENCE_AREAS: PunjabiIntegrationEvidenceArea[] = [
  "representative_module",
  "level_coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "integration_sample",
  "final_qa",
  "deferred_review",
  "forbidden_claim",
];

export const PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP: PunjabiFinalIntegrationEvidence[] = [
  {
    id: "evidence-representative-modules",
    area: "representative_module",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੁਮਾਇੰਦਾ ਮੋਡੀਊਲ",
    romanization: "numainda module",
    title_vi: "Module đại diện",
    title_en: "Representative modules",
    evidence_vi: "Chọn foundation, dialogue, course map, can-do, navigation, manifest và smoke checklist làm mẫu tích hợp sau này.",
    evidence_en: "Selects foundation, dialogue, course map, can-do, navigation, manifest, and smoke checklist as later integration samples.",
    integration_sample_vi: "Later A11 có thể bắt đầu từ các module đại diện thay vì quét toàn bộ file rời.",
    integration_sample_en: "Later A11 can start from representative modules instead of scanning every loose file.",
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    representative_modules: ["index", "dialogues", "courseMap", "finalCanDoIndex", "finalNavigationMap", "finalContentManifest", "finalSmokeChecklist"],
    evidence_tags: ["representative-module", "later-a11", "integration-sample"],
    later_a11_note_vi: "Đây là bằng chứng cho later A11; Wave 20 không chạy A11.",
    later_a11_note_en: "This is evidence for later A11; Wave 20 does not run A11.",
    learner_trap_vi: "Representative sample không thay thế full review.",
    learner_trap_en: "Representative samples do not replace full review.",
  },
  {
    id: "evidence-level-coverage",
    area: "level_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ ਕਵਰੇਜ",
    romanization: "paddar coverage",
    title_vi: "Bằng chứng A1-C2",
    title_en: "A1-C2 evidence",
    evidence_vi: "A1-C2 xuất hiện trong course map, progression, final can-do, navigation, manifest và smoke checklist.",
    evidence_en: "A1-C2 appear in the course map, progression, final can-do, navigation, manifest, and smoke checklist.",
    integration_sample_vi: "Later integration có thể dùng levels để route và kiểm coverage.",
    integration_sample_en: "Later integration can use levels for routing and coverage checks.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    representative_modules: ["courseMap", "progressionMatrix", "finalCanDoIndex", "finalNavigationMap", "finalContentManifest", "finalSmokeChecklist"],
    evidence_tags: ["A1-C2", "level-coverage", "readiness"],
    later_a11_note_vi: "Level coverage là dữ liệu route, không phải chứng chỉ chính thức.",
    later_a11_note_en: "Level coverage is routing data, not official certification.",
    learner_trap_vi: "Đừng claim credential chỉ vì có A1-C2 labels.",
    learner_trap_en: "Do not claim credentials just because A1-C2 labels exist.",
  },
  {
    id: "evidence-gurmukhi-first",
    area: "gurmukhi_first",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਬੂਤ",
    romanization: "Gurmukhi sabut",
    title_vi: "Bằng chứng Gurmukhi trước",
    title_en: "Gurmukhi-first evidence",
    evidence_vi: "Title và samples dùng Gurmukhi primary; romanization chỉ hỗ trợ.",
    evidence_en: "Titles and samples use Gurmukhi primary; romanization is support only.",
    integration_sample_vi: "Later UI nên render Gurmukhi trước romanization.",
    integration_sample_en: "Later UI should render Gurmukhi before romanization.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    representative_modules: ["index", "lessons-a1", "dialogues", "finalNavigationMap", "finalContentManifest", "finalSmokeChecklist"],
    evidence_tags: ["gurmukhi-first", "script-support", "golden-sample"],
    later_a11_note_vi: "Shahmukhi awareness-only vẫn giữ ngoài path Gurmukhi chính.",
    later_a11_note_en: "Shahmukhi awareness-only remains outside the primary Gurmukhi path.",
    learner_trap_vi: "Romanization không thể hiện đầy đủ bật hơi và retroflex.",
    learner_trap_en: "Romanization cannot fully show aspiration and retroflex contrasts.",
  },
  {
    id: "evidence-shahmukhi-boundary",
    area: "gurmukhi_first",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸ਼ਾਹਮੁਖੀ ਸੀਮਾ",
    romanization: "Shahmukhi sima",
    title_vi: "Bằng chứng ranh giới Shahmukhi",
    title_en: "Shahmukhi boundary evidence",
    evidence_vi: "Scope nhắc Shahmukhi là awareness-only, không phải full course.",
    evidence_en: "Scope mentions Shahmukhi as awareness-only, not a full course.",
    integration_sample_vi: "Later integration không nên tạo route học Shahmukhi đầy đủ trong Punjabi Gurmukhi path.",
    integration_sample_en: "Later integration should not create a full Shahmukhi learning route inside the Punjabi Gurmukhi path.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    representative_modules: ["courseMap", "finalModuleRegistry", "finalContentManifest", "finalSmokeChecklist"],
    evidence_tags: ["script-boundary", "awareness-only", "not-full-course"],
    later_a11_note_vi: "A11 sau này phải giữ awareness-only wording.",
    later_a11_note_en: "Later A11 must preserve awareness-only wording.",
    learner_trap_vi: "Biết tên Shahmukhi không đồng nghĩa course này dạy đọc hệ chữ đó.",
    learner_trap_en: "Knowing the name Shahmukhi does not mean this course teaches reading that script.",
  },
  {
    id: "evidence-vi-en-support",
    area: "learner_support",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਬੂਤ",
    romanization: "do-bhashi sabut",
    title_vi: "Bằng chứng hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support evidence",
    evidence_vi: "Fields VI/EN xuất hiện trong mục tiêu, sample, readiness, trap, QA và route.",
    evidence_en: "VI/EN fields appear in goals, samples, readiness, traps, QA, and routes.",
    integration_sample_vi: "Later UI có thể dùng cùng dữ liệu để phục vụ người học Việt và Anh.",
    integration_sample_en: "Later UI can use the same data for Vietnamese-speaking and English-speaking learners.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    representative_modules: ["dialogues", "learningPath", "contentIndex", "finalQaInventory", "finalNavigationMap", "finalSmokeChecklist"],
    evidence_tags: ["vi-support", "en-support", "learner-support"],
    later_a11_note_vi: "Không dùng English-only fallback cho người học Việt.",
    later_a11_note_en: "Do not use English-only fallback for Vietnamese-speaking learners.",
    learner_trap_vi: "Người học Việt cần trap notes riêng, không chỉ bản dịch.",
    learner_trap_en: "Vietnamese-speaking learners need specific trap notes, not only translations.",
  },
  {
    id: "evidence-canada-survival-public",
    area: "canada_practical",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਸੇਵਾ ਸਬੂਤ",
    romanization: "Canada seva sabut",
    title_vi: "Bằng chứng survival và dịch vụ công Canada",
    title_en: "Canada survival and public-service evidence",
    evidence_vi: "Settlement, survival, phone, address, documents và public-service questions có sample thực tế.",
    evidence_en: "Settlement, survival, phone, address, documents, and public-service questions have practical samples.",
    integration_sample_vi: "Later integration có thể route từ survival sang public-service review.",
    integration_sample_en: "Later integration can route from survival into public-service review.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    representative_modules: ["dialogues", "learningPath", "finalCanDoIndex", "finalNavigationMap", "finalContentManifest"],
    evidence_tags: ["canada-practical", "survival", "settlement", "public-service"],
    later_a11_note_vi: "Public-service language là practice, không phải tư vấn pháp lý.",
    later_a11_note_en: "Public-service language is practice, not legal advice.",
    learner_trap_vi: "ਕਿਹੜੇ là which; đừng lẫn với ਕਿੱਥੇ là where.",
    learner_trap_en: "Kihre means which; do not confuse it with kithe, where.",
    canada_practical: "Settlement forms, school offices, community counters, municipal services, and public service desks in Canada.",
  },
  {
    id: "evidence-canada-work-health",
    area: "canada_practical",
    status: "manual_review_needed",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਸਿਹਤ ਸਬੂਤ",
    romanization: "kamm sehat sabut",
    title_vi: "Bằng chứng công việc và y tế Canada",
    title_en: "Canada work and health evidence",
    evidence_vi: "Workplace, shift, register và healthcare symptom language có sample, kèm boundary không chẩn đoán.",
    evidence_en: "Workplace, shift, register, and healthcare symptom language have samples, with no-diagnosis boundaries.",
    integration_sample_vi: "Later integration có thể tách route workplace và healthcare nhưng giữ cùng review Canada-practical.",
    integration_sample_en: "Later integration can separate workplace and healthcare routes while keeping Canada-practical review.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    representative_modules: ["dialogues", "masteryCheckpoints", "finalCanDoIndex", "finalQualityGates", "finalSmokeChecklist"],
    evidence_tags: ["canada-practical", "work", "health", "scope-boundary"],
    later_a11_note_vi: "Healthcare language không thay thế tư vấn y tế.",
    later_a11_note_en: "Healthcare language does not replace medical advice.",
    learner_trap_vi: "Một câu Punjabi đúng không phải chẩn đoán.",
    learner_trap_en: "A correct Punjabi sentence is not a diagnosis.",
    canada_practical: "Work schedules, workplace messages, clinic intake, pharmacy counters, and telehealth notes in Canada.",
  },
  {
    id: "evidence-integration-samples",
    area: "integration_sample",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਟੀਗ੍ਰੇਸ਼ਨ ਨਮੂਨੇ",
    romanization: "integration namune",
    title_vi: "Integration samples",
    title_en: "Integration samples",
    evidence_vi: "Golden samples bao gồm greeting, documents, health, decision, summary và final check.",
    evidence_en: "Golden samples include greeting, documents, health, decision, summary, and final check.",
    integration_sample_vi: "Later A11 có thể dùng các sample này để smoke test render Gurmukhi và VI/EN.",
    integration_sample_en: "Later A11 can use these samples to smoke test Gurmukhi rendering and VI/EN support.",
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    representative_modules: ["finalCanDoIndex", "finalNavigationMap", "finalContentManifest", "finalSmokeChecklist"],
    evidence_tags: ["integration-sample", "golden-sample", "render-check"],
    later_a11_note_vi: "Golden samples giúp smoke test, không thay native review.",
    later_a11_note_en: "Golden samples help smoke testing; they do not replace native review.",
    learner_trap_vi: "Sample đẹp không đồng nghĩa mọi câu đã được duyệt bản ngữ.",
    learner_trap_en: "A polished sample does not mean every sentence has native review.",
  },
  {
    id: "evidence-final-qa-trail",
    area: "final_qa",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ QA ਸਬੂਤ",
    romanization: "antim QA sabut",
    title_vi: "Bằng chứng final QA",
    title_en: "Final QA evidence",
    evidence_vi: "QA inventory, pre-MR audit, handoff, navigation, quality gates, manifest và smoke checklist tạo review trail.",
    evidence_en: "QA inventory, pre-MR audit, handoff, navigation, quality gates, manifest, and smoke checklist form a review trail.",
    integration_sample_vi: "Later A11 có thể đọc review trail trước khi tích hợp.",
    integration_sample_en: "Later A11 can read the review trail before integration.",
    sample: { gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim janch", vi: "kiểm tra cuối", en: "final check" },
    representative_modules: ["finalQaInventory", "preMrAuditChecklist", "preIntegrationHandoffMap", "finalNavigationMap", "finalQualityGates", "finalContentManifest", "finalSmokeChecklist"],
    evidence_tags: ["final-QA", "review-trail", "readiness"],
    later_a11_note_vi: "Review trail không tự động chạy A11.",
    later_a11_note_en: "The review trail does not automatically run A11.",
    learner_trap_vi: "Final QA pass không đồng nghĩa deploy.",
    learner_trap_en: "Final QA pass does not mean deploy.",
  },
  {
    id: "evidence-native-review-deferred",
    area: "deferred_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Bằng chứng native review hoãn",
    title_en: "Deferred native review evidence",
    evidence_vi: "Scope và review files nói native review deferred; không claim completed native review.",
    evidence_en: "Scope and review files state native review is deferred; completed native review is not claimed.",
    integration_sample_vi: "Later A11 phải giữ boundary này trong metadata hoặc UI.",
    integration_sample_en: "Later A11 must preserve this boundary in metadata or UI.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    representative_modules: ["finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist", "finalQualityGates", "finalSmokeChecklist"],
    evidence_tags: ["native-review-deferred", "not-claimed", "boundary"],
    later_a11_note_vi: "Không claim native-reviewed khi chưa có review thật.",
    later_a11_note_en: "Do not claim native-reviewed without actual review.",
    learner_trap_vi: "Evidence map không phải phê duyệt của người bản ngữ.",
    learner_trap_en: "An evidence map is not native-speaker approval.",
  },
  {
    id: "evidence-no-audio-azure",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਆਡੀਓ ਨਹੀਂ",
    romanization: "audio nahin",
    title_vi: "Bằng chứng không audio/Azure",
    title_en: "No audio/Azure evidence",
    evidence_vi: "Không audio, microphone, pronunciation scoring, Azure hoặc speech pipeline.",
    evidence_en: "No audio, microphone, pronunciation scoring, Azure, or speech pipeline.",
    integration_sample_vi: "Later A11 không được nối evidence map với speech pipeline.",
    integration_sample_en: "Later A11 must not connect this evidence map to a speech pipeline.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    representative_modules: ["masteryCheckpoints", "finalCanDoIndex", "finalQualityGates", "finalSmokeChecklist"],
    evidence_tags: ["no-audio", "no-pronunciation-scoring", "no-Azure", "text-only"],
    later_a11_note_vi: "Speaking prompts là text-only.",
    later_a11_note_en: "Speaking prompts are text-only.",
    learner_trap_vi: "Text-only speaking practice không đánh giá phát âm.",
    learner_trap_en: "Text-only speaking practice does not evaluate pronunciation.",
  },
  {
    id: "evidence-no-infra-a11",
    area: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A11 ਅਤੇ ਇਨਫਰਾ ਨਹੀਂ",
    romanization: "A11 ate infra nahin",
    title_vi: "Bằng chứng không A11/hạ tầng",
    title_en: "No A11/infrastructure evidence",
    evidence_vi: "Wave 20 không chạy A11 integration, không auth, billing, RLS, Supabase, CI, push hoặc deploy.",
    evidence_en: "Wave 20 does not run A11 integration and does not touch auth, billing, RLS, Supabase, CI, push, or deploy.",
    integration_sample_vi: "Later integration cần task riêng; evidence map chỉ là dữ liệu.",
    integration_sample_en: "Later integration needs separate work; the evidence map is data only.",
    sample: { gurmukhi: "ਸੀਮਾ", romanization: "sima", vi: "ranh giới", en: "boundary" },
    representative_modules: ["finalIntegrationEvidenceMap"],
    evidence_tags: ["no-A11", "no-infra", "no-push", "no-deploy"],
    later_a11_note_vi: "Không push, deploy hoặc chỉnh CI từ Wave 20.",
    later_a11_note_en: "Do not push, deploy, or edit CI from Wave 20.",
    learner_trap_vi: "Evidence ready không nghĩa là đã tích hợp vào UI chính.",
    learner_trap_en: "Evidence ready does not mean integrated into the main UI.",
  },
];

export const PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROUTES = [
  {
    id: "coverage-evidence-route",
    vi: "Coverage evidence: representative modules -> A1-C2 -> Gurmukhi -> VI/EN.",
    en: "Coverage evidence: representative modules -> A1-C2 -> Gurmukhi -> VI/EN.",
    evidence_ids: ["evidence-representative-modules", "evidence-level-coverage", "evidence-gurmukhi-first", "evidence-vi-en-support"],
  },
  {
    id: "canada-sample-evidence-route",
    vi: "Canada/sample evidence: survival/public service -> work/health -> integration samples -> final QA.",
    en: "Canada/sample evidence: survival/public service -> work/health -> integration samples -> final QA.",
    evidence_ids: ["evidence-canada-survival-public", "evidence-canada-work-health", "evidence-integration-samples", "evidence-final-qa-trail"],
  },
  {
    id: "boundary-evidence-route",
    vi: "Boundary evidence: Shahmukhi awareness-only -> native review deferred -> no audio/Azure -> no A11/infra.",
    en: "Boundary evidence: Shahmukhi awareness-only -> native review deferred -> no audio/Azure -> no A11/infra.",
    evidence_ids: ["evidence-shahmukhi-boundary", "evidence-native-review-deferred", "evidence-no-audio-azure", "evidence-no-infra-a11"],
  },
];

export const PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROOT = {
  scope: PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE,
  areas: PUNJABI_FINAL_INTEGRATION_EVIDENCE_AREAS,
  evidence: PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP,
  routes: PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROUTES,
} as const;

export default PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROOT;
