// src/languages/punjabi/finalContentManifest.ts
//
// Wave 18 final content manifest for Punjabi before later integration.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiManifestDomain =
  | "level_map"
  | "module_inventory"
  | "skill_domain"
  | "gurmukhi_support"
  | "learner_support"
  | "canada_domain"
  | "golden_sample"
  | "final_qa"
  | "integration_readiness"
  | "forbidden_claim";

export type PunjabiManifestStatus = "ready_for_later_integration" | "manual_review_needed" | "deferred_boundary";

export type PunjabiFinalContentManifestEntry = {
  id: string;
  domain: PunjabiManifestDomain;
  status: PunjabiManifestStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  manifest_vi: string;
  manifest_en: string;
  integration_signal_vi: string;
  integration_signal_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  modules: string[];
  skill_domains: string[];
  review_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE = {
  wave: "Wave 18",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final content manifest này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This final content manifest uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_CONTENT_MANIFEST_DOMAINS: PunjabiManifestDomain[] = [
  "level_map",
  "module_inventory",
  "skill_domain",
  "gurmukhi_support",
  "learner_support",
  "canada_domain",
  "golden_sample",
  "final_qa",
  "integration_readiness",
  "forbidden_claim",
];

export const PUNJABI_FINAL_CONTENT_MANIFEST: PunjabiFinalContentManifestEntry[] = [
  {
    id: "manifest-level-map-a1-c2",
    domain: "level_map",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਨਕਸ਼ਾ",
    romanization: "A1-C2 naksha",
    title_vi: "Manifest cấp độ A1-C2",
    title_en: "A1-C2 level manifest",
    manifest_vi: "Liệt kê đường học từ foundation đến C2 review bằng dữ liệu có thể đọc trong app.",
    manifest_en: "Lists the path from foundation to C2 review as app-readable data.",
    integration_signal_vi: "Later integration có thể đọc levels để route course map, progression và final navigation.",
    integration_signal_en: "Later integration can read levels to route the course map, progression, and final navigation.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    modules: ["courseMap", "learningPath", "progressionMatrix", "finalCanDoIndex", "finalNavigationMap"],
    skill_domains: ["reading", "writing", "review", "navigation"],
    review_tags: ["level-coverage", "A1-C2", "readiness"],
    learner_trap_vi: "A1-C2 trong manifest là cấu trúc học, không phải chứng chỉ chính thức.",
    learner_trap_en: "A1-C2 in the manifest is learning structure, not official certification.",
  },
  {
    id: "manifest-module-inventory",
    domain: "module_inventory",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਸੂਚੀ",
    romanization: "module suchi",
    title_vi: "Danh mục module",
    title_en: "Module inventory",
    manifest_vi: "Tổng hợp foundation, dialogues, maps, indexes, QA, audit, handoff, navigation và quality gates.",
    manifest_en: "Summarizes foundation, dialogues, maps, indexes, QA, audit, handoff, navigation, and quality gates.",
    integration_signal_vi: "Later integration có danh sách module Punjabi rõ ràng, không phải đoán từ file rời.",
    integration_signal_en: "Later integration has a clear Punjabi module list instead of guessing from loose files.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    modules: [
      "index",
      "normalize",
      "lessons",
      "lessons-a1",
      "dialogues",
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "skillDependencyGraph",
      "contentIndex",
      "integrationReadinessChecklist",
      "preIntegrationCoverageMap",
      "finalModuleRegistry",
      "finalCanDoIndex",
      "finalQaInventory",
      "preMrAuditChecklist",
      "preIntegrationHandoffMap",
      "finalNavigationMap",
      "finalQualityGates",
      "finalContentManifest",
    ],
    skill_domains: ["module-registry", "coverage", "final-QA"],
    review_tags: ["module-inventory", "integration-readiness", "final-manifest"],
    learner_trap_vi: "Module inventory sẵn sàng không đồng nghĩa đã deploy.",
    learner_trap_en: "Module inventory readiness does not mean it is deployed.",
  },
  {
    id: "manifest-skill-domains",
    domain: "skill_domain",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੌਸ਼ਲ ਖੇਤਰ",
    romanization: "kaushal khetr",
    title_vi: "Miền kỹ năng",
    title_en: "Skill domains",
    manifest_vi: "Bao phủ script, vocabulary, grammar, reading, writing, text-only prompts, survival và remediation.",
    manifest_en: "Covers script, vocabulary, grammar, reading, writing, text-only prompts, survival, and remediation.",
    integration_signal_vi: "Skill domains liên kết final can-do, mastery checkpoints và navigation map.",
    integration_signal_en: "Skill domains link final can-do, mastery checkpoints, and navigation map.",
    sample: { gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" },
    modules: ["masteryCheckpoints", "skillDependencyGraph", "finalCanDoIndex", "finalNavigationMap"],
    skill_domains: ["script", "vocabulary", "grammar", "reading", "writing", "text_speaking_prompt", "survival", "remediation"],
    review_tags: ["skill-coverage", "can-do", "checkpoint"],
    learner_trap_vi: "Text-speaking prompt là thực hành hội thoại bằng text, không phải audio.",
    learner_trap_en: "A text-speaking prompt is text dialogue practice, not audio.",
  },
  {
    id: "manifest-gurmukhi-primary",
    domain: "gurmukhi_support",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    manifest_vi: "Gurmukhi là chữ chính trong title và golden samples; romanization hỗ trợ nhưng không thay thế.",
    manifest_en: "Gurmukhi is primary in titles and golden samples; romanization supports but does not replace it.",
    integration_signal_vi: "Later integration phải hiển thị Gurmukhi trước romanization.",
    integration_signal_en: "Later integration must display Gurmukhi before romanization.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    modules: ["index", "lessons-a1", "dialogues", "finalCanDoIndex", "finalNavigationMap"],
    skill_domains: ["script", "reading", "navigation"],
    review_tags: ["gurmukhi-first", "script-support", "golden-sample"],
    learner_trap_vi: "Romanization không thể hiện đầy đủ bật hơi và retroflex.",
    learner_trap_en: "Romanization cannot fully show aspiration and retroflex contrasts.",
  },
  {
    id: "manifest-vi-en-support",
    domain: "learner_support",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ người học Việt-Anh",
    title_en: "Vietnamese-English learner support",
    manifest_vi: "Các module chính có Vietnamese và English explanations cho mục tiêu, sample, readiness và traps.",
    manifest_en: "Major modules include Vietnamese and English explanations for goals, samples, readiness, and traps.",
    integration_signal_vi: "UI sau này có thể route người học Việt và Anh từ cùng dữ liệu manifest.",
    integration_signal_en: "Later UI can route Vietnamese-speaking and English-speaking learners from the same manifest data.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    modules: ["dialogues", "learningPath", "contentIndex", "finalQaInventory", "finalNavigationMap"],
    skill_domains: ["learner-support", "review", "navigation"],
    review_tags: ["vi-support", "en-support", "learner-traps"],
    learner_trap_vi: "Không dùng English explanation thay thế cho phần tiếng Việt.",
    learner_trap_en: "Do not use English explanations as a substitute for Vietnamese explanations.",
  },
  {
    id: "manifest-canada-survival-public",
    domain: "canada_domain",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਸੇਵਾ ਰਾਹ",
    romanization: "Canada seva rah",
    title_vi: "Survival và dịch vụ công Canada",
    title_en: "Canada survival and public service",
    manifest_vi: "Route survival, settlement, số điện thoại, giấy tờ, địa chỉ và public-service questions.",
    manifest_en: "Routes survival, settlement, phone number, documents, address, and public-service questions.",
    integration_signal_vi: "Canada domains có thể route từ dialogue sang final navigation và content index.",
    integration_signal_en: "Canada domains can route from dialogues into final navigation and content index.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    modules: ["dialogues", "learningPath", "contentIndex", "finalNavigationMap"],
    skill_domains: ["survival", "settlement", "public_service", "reading"],
    review_tags: ["canada-practical", "public-service", "settlement"],
    learner_trap_vi: "Public-service language practice không phải tư vấn pháp lý.",
    learner_trap_en: "Public-service language practice is not legal advice.",
    canada_practical: "Settlement forms, community counters, school offices, municipal services, and public service desks in Canada.",
  },
  {
    id: "manifest-canada-work-health",
    domain: "canada_domain",
    status: "manual_review_needed",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਅਤੇ ਸਿਹਤ ਰਾਹ",
    romanization: "kamm ate sehat rah",
    title_vi: "Công việc và y tế Canada",
    title_en: "Canada work and health",
    manifest_vi: "Route workplace, ca làm, register lịch sự, healthcare symptom language và no-medical-advice boundary.",
    manifest_en: "Routes workplace, shifts, polite register, healthcare symptom language, and no-medical-advice boundaries.",
    integration_signal_vi: "Later integration có thể tách workplace route khỏi healthcare route nhưng giữ chung Canada-practical review.",
    integration_signal_en: "Later integration can separate workplace from healthcare while keeping Canada-practical review.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    modules: ["dialogues", "masteryCheckpoints", "finalCanDoIndex", "finalQualityGates", "finalNavigationMap"],
    skill_domains: ["workplace", "healthcare", "speaking_text", "review"],
    review_tags: ["canada-practical", "work", "health", "scope-boundary"],
    learner_trap_vi: "Một câu Punjabi đúng không phải chẩn đoán hoặc hướng dẫn điều trị.",
    learner_trap_en: "A correct Punjabi sentence is not diagnosis or treatment guidance.",
    canada_practical: "Work schedules, workplace messages, clinic intake, pharmacy counters, and telehealth notes in Canada.",
  },
  {
    id: "manifest-golden-samples",
    domain: "golden_sample",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸੋਨੇ ਦੇ ਨਮੂਨੇ",
    romanization: "sone de namune",
    title_vi: "Golden samples",
    title_en: "Golden samples",
    manifest_vi: "Giữ một tập sample Gurmukhi nhỏ cho smoke review: greeting, documents, health, decision, summary.",
    manifest_en: "Keeps a small Gurmukhi sample set for smoke review: greeting, documents, health, decision, summary.",
    integration_signal_vi: "Later integration có thể dùng golden samples để kiểm render Gurmukhi và VI/EN.",
    integration_signal_en: "Later integration can use golden samples to check Gurmukhi rendering and VI/EN support.",
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    modules: ["dialogues", "finalCanDoIndex", "finalNavigationMap", "finalQualityGates"],
    skill_domains: ["golden-sample", "reading", "writing", "review"],
    review_tags: ["golden-sample", "render-check", "final-QA"],
    learner_trap_vi: "Golden sample giúp smoke review, không thay native review.",
    learner_trap_en: "A golden sample helps smoke review; it does not replace native review.",
  },
  {
    id: "manifest-final-qa",
    domain: "final_qa",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ ਜਾਂਚ",
    romanization: "antim janch",
    title_vi: "Final QA",
    title_en: "Final QA",
    manifest_vi: "Kết nối QA inventory, pre-MR audit, handoff map, final navigation và quality gates.",
    manifest_en: "Connects QA inventory, pre-MR audit, handoff map, final navigation, and quality gates.",
    integration_signal_vi: "Later integration có review trail trước khi map Punjabi vào registry chung.",
    integration_signal_en: "Later integration has a review trail before mapping Punjabi into a shared registry.",
    sample: { gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim janch", vi: "kiểm tra cuối", en: "final check" },
    modules: ["finalQaInventory", "preMrAuditChecklist", "preIntegrationHandoffMap", "finalNavigationMap", "finalQualityGates"],
    skill_domains: ["final-QA", "audit", "handoff", "quality-gates"],
    review_tags: ["final-QA", "pre-MR", "readiness"],
    learner_trap_vi: "Final QA readiness không đồng nghĩa đã merge hoặc deploy.",
    learner_trap_en: "Final QA readiness does not mean merged or deployed.",
  },
  {
    id: "manifest-integration-readiness",
    domain: "integration_readiness",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਟੀਗ੍ਰੇਸ਼ਨ ਤਿਆਰੀ",
    romanization: "integration tiari",
    title_vi: "Sẵn sàng tích hợp sau này",
    title_en: "Later integration readiness",
    manifest_vi: "Manifest chỉ chuẩn bị cho later integration bằng dữ liệu review, không chạy A11.",
    manifest_en: "The manifest only prepares for later integration through review data; it does not run A11.",
    integration_signal_vi: "Later owner có thể đọc scope, entries và sequence để mở work tích hợp riêng.",
    integration_signal_en: "A later owner can read scope, entries, and sequence to open separate integration work.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    modules: ["integrationReadinessChecklist", "preIntegrationCoverageMap", "preIntegrationHandoffMap", "finalNavigationMap", "finalContentManifest"],
    skill_domains: ["integration-readiness", "handoff", "review"],
    review_tags: ["later-integration", "not-A11", "handoff"],
    learner_trap_vi: "Readiness data không phải tích hợp UI chính.",
    learner_trap_en: "Readiness data is not main UI integration.",
  },
  {
    id: "manifest-native-review-boundary",
    domain: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ ਸੀਮਾ",
    romanization: "multavi samikhia sima",
    title_vi: "Ranh giới native review",
    title_en: "Native review boundary",
    manifest_vi: "Ghi rõ native review deferred; không claim đã có kiểm duyệt bản ngữ.",
    manifest_en: "States native review is deferred; completed native review is not claimed.",
    integration_signal_vi: "Later integration phải giữ boundary này trong UI hoặc metadata.",
    integration_signal_en: "Later integration must preserve this boundary in UI or metadata.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    modules: ["finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist", "finalQualityGates", "finalContentManifest"],
    skill_domains: ["review-boundary", "forbidden-claim"],
    review_tags: ["native-review-deferred", "not-claimed", "boundary"],
    learner_trap_vi: "Có manifest cuối không nghĩa là người bản ngữ đã phê duyệt.",
    learner_trap_en: "Having a final manifest does not mean native-speaker approval is complete.",
  },
  {
    id: "manifest-forbidden-claims",
    domain: "forbidden_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨਾਹੀ ਦਾਅਵੇ",
    romanization: "manahi daave",
    title_vi: "Các claim bị cấm",
    title_en: "Forbidden claims",
    manifest_vi: "Không audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy hoặc A11 integration.",
    manifest_en: "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, deploy, or A11 integration.",
    integration_signal_vi: "Later integration cần tách rõ content manifest khỏi hạ tầng và speech pipeline.",
    integration_signal_en: "Later integration must keep the content manifest separate from infrastructure and speech pipelines.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    modules: ["finalQualityGates", "finalNavigationMap", "finalContentManifest"],
    skill_domains: ["forbidden-claim", "boundary", "final-QA"],
    review_tags: ["no-audio", "no-scoring", "no-Azure", "no-push", "no-deploy", "no-A11"],
    learner_trap_vi: "Text-only practice không đánh giá phát âm và không dùng microphone.",
    learner_trap_en: "Text-only practice does not evaluate pronunciation and does not use a microphone.",
  },
];

export const PUNJABI_FINAL_CONTENT_MANIFEST_ROUTES = [
  {
    id: "content-coverage-route",
    vi: "Coverage: levels -> modules -> skills -> Gurmukhi support -> learner support.",
    en: "Coverage: levels -> modules -> skills -> Gurmukhi support -> learner support.",
    entry_ids: ["manifest-level-map-a1-c2", "manifest-module-inventory", "manifest-skill-domains", "manifest-gurmukhi-primary", "manifest-vi-en-support"],
  },
  {
    id: "canada-golden-route",
    vi: "Canada and samples: survival/public service -> work/health -> golden samples.",
    en: "Canada and samples: survival/public service -> work/health -> golden samples.",
    entry_ids: ["manifest-canada-survival-public", "manifest-canada-work-health", "manifest-golden-samples"],
  },
  {
    id: "final-readiness-boundary-route",
    vi: "Final readiness: QA -> later integration readiness -> native review deferred -> forbidden claims.",
    en: "Final readiness: QA -> later integration readiness -> native review deferred -> forbidden claims.",
    entry_ids: ["manifest-final-qa", "manifest-integration-readiness", "manifest-native-review-boundary", "manifest-forbidden-claims"],
  },
];

export const PUNJABI_FINAL_CONTENT_MANIFEST_ROOT = {
  scope: PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE,
  domains: PUNJABI_FINAL_CONTENT_MANIFEST_DOMAINS,
  entries: PUNJABI_FINAL_CONTENT_MANIFEST,
  routes: PUNJABI_FINAL_CONTENT_MANIFEST_ROUTES,
} as const;

export default PUNJABI_FINAL_CONTENT_MANIFEST_ROOT;
