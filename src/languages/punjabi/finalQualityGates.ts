// src/languages/punjabi/finalQualityGates.ts
//
// Wave 17 final quality gates for Punjabi before later integration.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiQualityGateArea =
  | "content_coverage"
  | "gurmukhi_first"
  | "vi_en_support"
  | "canada_practical"
  | "native_review_deferred"
  | "forbidden_claims"
  | "remediation_readiness"
  | "later_integration_boundary";

export type PunjabiQualityGateStatus = "pass_ready" | "manual_review" | "deferred_boundary";

export type PunjabiFinalQualityGate = {
  id: string;
  area: PunjabiQualityGateArea;
  status: PunjabiQualityGateStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  gate_vi: string;
  gate_en: string;
  pass_signal_vi: string;
  pass_signal_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  modules_checked: string[];
  review_actions: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_FINAL_QUALITY_GATES_SCOPE = {
  wave: "Wave 17",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final quality gates này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "These final quality gates use Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_QUALITY_GATE_AREAS: PunjabiQualityGateArea[] = [
  "content_coverage",
  "gurmukhi_first",
  "vi_en_support",
  "canada_practical",
  "native_review_deferred",
  "forbidden_claims",
  "remediation_readiness",
  "later_integration_boundary",
];

export const PUNJABI_FINAL_QUALITY_GATES: PunjabiFinalQualityGate[] = [
  {
    id: "gate-content-files",
    area: "content_coverage",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸਮੱਗਰੀ ਕਵਰੇਜ",
    romanization: "samagri coverage",
    title_vi: "Cổng độ phủ nội dung",
    title_en: "Content coverage gate",
    gate_vi: "Xác nhận các artifact Punjabi chính có dữ liệu TypeScript app-consumable và test riêng.",
    gate_en: "Confirms major Punjabi artifacts have app-consumable TypeScript data and their own tests.",
    pass_signal_vi: "Foundation, dialogue, course map, learning path, progression, mastery, indexes, QA, audit, handoff và navigation đều có mặt.",
    pass_signal_en: "Foundation, dialogue, course map, learning path, progression, mastery, indexes, QA, audit, handoff, and navigation are present.",
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    modules_checked: ["index", "lessons", "dialogues", "courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints", "skillDependencyGraph", "contentIndex", "finalNavigationMap"],
    review_actions: ["verify module list", "verify matching tests", "verify A1-C2 coverage"],
    learner_trap_vi: "Có file đầy đủ không đồng nghĩa đã có native review.",
    learner_trap_en: "Complete files do not mean native review is complete.",
  },
  {
    id: "gate-a1-c2-readiness",
    area: "content_coverage",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਤਿਆਰੀ",
    romanization: "A1-C2 tiari",
    title_vi: "Sẵn sàng A1-C2",
    title_en: "A1-C2 readiness",
    gate_vi: "Xác nhận level coverage từ A1 đến C2 có route, can-do, checkpoint và review.",
    gate_en: "Confirms A1 through C2 level coverage has routes, can-do items, checkpoints, and review.",
    pass_signal_vi: "Course map, progression matrix, final can-do index và final navigation map đều bao phủ A1-C2.",
    pass_signal_en: "Course map, progression matrix, final can-do index, and final navigation map cover A1-C2.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    modules_checked: ["courseMap", "progressionMatrix", "finalCanDoIndex", "finalNavigationMap"],
    review_actions: ["scan levels", "scan routes", "scan readiness signals"],
    learner_trap_vi: "A1-C2 là cấu trúc học, không phải chứng chỉ chính thức.",
    learner_trap_en: "A1-C2 is learning structure, not official certification.",
  },
  {
    id: "gate-gurmukhi-primary",
    area: "gurmukhi_first",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Cổng Gurmukhi trước",
    title_en: "Gurmukhi-first gate",
    gate_vi: "Xác nhận Punjabi dùng Gurmukhi làm tín hiệu chính, romanization chỉ hỗ trợ.",
    gate_en: "Confirms Punjabi uses Gurmukhi as the primary signal, with romanization only as support.",
    pass_signal_vi: "Title và sample chính có Gurmukhi trong foundation, dialogue, navigation và can-do.",
    pass_signal_en: "Primary titles and samples include Gurmukhi in foundation, dialogue, navigation, and can-do data.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    modules_checked: ["index", "lessons-a1", "dialogues", "finalCanDoIndex", "finalNavigationMap"],
    review_actions: ["scan Gurmukhi samples", "scan romanization support", "scan script notes"],
    learner_trap_vi: "Romanization dễ che mất bật hơi và retroflex.",
    learner_trap_en: "Romanization can hide aspiration and retroflex contrasts.",
  },
  {
    id: "gate-shahmukhi-awareness",
    area: "gurmukhi_first",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸ਼ਾਹਮੁਖੀ ਸੀਮਾ",
    romanization: "Shahmukhi sima",
    title_vi: "Ranh giới Shahmukhi",
    title_en: "Shahmukhi boundary",
    gate_vi: "Xác nhận Shahmukhi chỉ được nhắc để nhận biết, không phải full course.",
    gate_en: "Confirms Shahmukhi is mentioned only for awareness, not as a full course.",
    pass_signal_vi: "Scope nói awareness-only và sample không dùng Shahmukhi script.",
    pass_signal_en: "Scope says awareness-only and samples do not use Shahmukhi script.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    modules_checked: ["courseMap", "finalModuleRegistry", "finalCanDoIndex", "preMrAuditChecklist", "finalNavigationMap"],
    review_actions: ["scan scope", "scan samples", "verify no full Shahmukhi course"],
    learner_trap_vi: "Biết tên Shahmukhi không đồng nghĩa học đọc hệ chữ đó.",
    learner_trap_en: "Knowing the name Shahmukhi does not mean learning to read that script.",
  },
  {
    id: "gate-vi-en-support",
    area: "vi_en_support",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Cổng hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support gate",
    gate_vi: "Xác nhận người học Việt và Anh có giải thích trong mục tiêu, readiness, trap và sample.",
    gate_en: "Confirms Vietnamese-speaking and English-speaking learners have explanations in goals, readiness, traps, and samples.",
    pass_signal_vi: "Các artifact chính dùng trường VI/EN thay vì ghi chú rời.",
    pass_signal_en: "Major artifacts use VI/EN fields instead of loose notes.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    modules_checked: ["dialogues", "learningPath", "contentIndex", "finalQaInventory", "finalNavigationMap"],
    review_actions: ["scan *_vi fields", "scan *_en fields", "scan learner trap fields"],
    learner_trap_vi: "Không dùng giải thích tiếng Anh thay thế giải thích tiếng Việt.",
    learner_trap_en: "Do not use English explanations as a substitute for Vietnamese explanations.",
  },
  {
    id: "gate-canada-survival-public",
    area: "canada_practical",
    status: "manual_review",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ",
    romanization: "Canada survival",
    title_vi: "Cổng survival và dịch vụ công Canada",
    title_en: "Canada survival and public-service gate",
    gate_vi: "Xác nhận survival, settlement và public-service có ví dụ Canada-practical.",
    gate_en: "Confirms survival, settlement, and public-service content has Canada-practical examples.",
    pass_signal_vi: "Có lời chào, số điện thoại, giấy tờ, địa chỉ và câu hỏi dịch vụ.",
    pass_signal_en: "Greetings, phone number, documents, address, and service questions are present.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    modules_checked: ["dialogues", "learningPath", "finalCanDoIndex", "finalNavigationMap"],
    review_actions: ["scan survival route", "scan settlement examples", "scan public-service route"],
    learner_trap_vi: "Public-service phrase practice không phải tư vấn pháp lý.",
    learner_trap_en: "Public-service phrase practice is not legal advice.",
    canada_practical: "Settlement forms, public service desks, community counters, school offices, and municipal services in Canada.",
  },
  {
    id: "gate-canada-work-health",
    area: "canada_practical",
    status: "manual_review",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਅਤੇ ਸਿਹਤ ਗੇਟ",
    romanization: "kamm ate sehat gate",
    title_vi: "Cổng công việc và y tế",
    title_en: "Work and health gate",
    gate_vi: "Xác nhận workplace và healthcare có ví dụ thực tế nhưng giữ giới hạn scope.",
    gate_en: "Confirms workplace and healthcare have practical examples while staying within scope.",
    pass_signal_vi: "Có ca làm, register lịch sự, mô tả triệu chứng và cảnh báo không chẩn đoán.",
    pass_signal_en: "Shift, polite register, symptom description, and no-diagnosis warnings are present.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    modules_checked: ["dialogues", "masteryCheckpoints", "finalCanDoIndex", "finalNavigationMap"],
    review_actions: ["scan workplace route", "scan healthcare route", "scan scope warning"],
    learner_trap_vi: "Một câu Punjabi đúng không phải chẩn đoán hoặc hướng dẫn điều trị.",
    learner_trap_en: "A correct Punjabi sentence is not diagnosis or treatment guidance.",
    canada_practical: "Work schedules, workplace messages, clinic intake, pharmacy counters, and telehealth notes in Canada.",
  },
  {
    id: "gate-remediation",
    area: "remediation_readiness",
    status: "manual_review",
    levels: ["B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਤਿਆਰੀ",
    romanization: "murammat tiari",
    title_vi: "Cổng sửa lỗi",
    title_en: "Remediation gate",
    gate_vi: "Xác nhận remediation route có trap, checkpoint và sửa lỗi politeness/grammar/reading/writing.",
    gate_en: "Confirms remediation routes have traps, checkpoints, and repairs for politeness, grammar, reading, and writing.",
    pass_signal_vi: "Dependency graph, mastery checkpoints, can-do index và navigation map đều chỉ rõ remediation.",
    pass_signal_en: "Dependency graph, mastery checkpoints, can-do index, and navigation map all identify remediation.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਲਿਖੋ।", romanization: "kirpa karke ih dubara likho", vi: "Xin vui lòng viết lại điều này.", en: "Please write this again." },
    modules_checked: ["skillDependencyGraph", "masteryCheckpoints", "finalCanDoIndex", "finalNavigationMap"],
    review_actions: ["scan traps", "scan checkpoints", "scan next steps"],
    learner_trap_vi: "Thêm một marker lịch sự chưa đủ nếu register cả câu vẫn thô.",
    learner_trap_en: "Adding one politeness marker is not enough if the whole sentence remains blunt.",
  },
  {
    id: "gate-native-review-deferred",
    area: "native_review_deferred",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Cổng native review hoãn",
    title_en: "Deferred native review gate",
    gate_vi: "Xác nhận không có tuyên bố native review đã hoàn tất.",
    gate_en: "Confirms there is no claim that native review is complete.",
    pass_signal_vi: "Scope nói native review deferred và completed native review is not claimed.",
    pass_signal_en: "Scope states native review is deferred and completed native review is not claimed.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    modules_checked: ["integrationReadinessChecklist", "finalModuleRegistry", "finalQaInventory", "preMrAuditChecklist", "finalNavigationMap"],
    review_actions: ["scan native review claims", "scan deferred scope", "scan overclaim language"],
    learner_trap_vi: "Quality gate pass không đồng nghĩa người bản ngữ đã phê duyệt.",
    learner_trap_en: "Passing quality gates does not mean native-speaker approval is complete.",
  },
  {
    id: "gate-no-audio-scoring",
    area: "forbidden_claims",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਆਡੀਓ ਨਹੀਂ",
    romanization: "audio nahin",
    title_vi: "Cổng không audio/scoring",
    title_en: "No audio/scoring gate",
    gate_vi: "Xác nhận không có audio, microphone, pronunciation scoring, Azure hoặc speech pipeline.",
    gate_en: "Confirms there is no audio, microphone, pronunciation scoring, Azure, or speech pipeline.",
    pass_signal_vi: "Speaking prompts giữ text-only; scope excluded nêu no audio và no pronunciation scoring.",
    pass_signal_en: "Speaking prompts stay text-only; excluded scope states no audio and no pronunciation scoring.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    modules_checked: ["masteryCheckpoints", "finalCanDoIndex", "finalQaInventory", "preMrAuditChecklist", "finalNavigationMap"],
    review_actions: ["scan audio claims", "scan scoring claims", "scan Azure mentions"],
    learner_trap_vi: "Text-only speaking practice không đánh giá phát âm.",
    learner_trap_en: "Text-only speaking practice does not evaluate pronunciation.",
  },
  {
    id: "gate-no-infra-claims",
    area: "forbidden_claims",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇਨਫਰਾ ਨਹੀਂ",
    romanization: "infra nahin",
    title_vi: "Cổng không hạ tầng",
    title_en: "No infrastructure gate",
    gate_vi: "Xác nhận Wave 17 không chạm auth, billing, RLS, Supabase, CI, push hoặc deploy.",
    gate_en: "Confirms Wave 17 does not touch auth, billing, RLS, Supabase, CI, push, or deploy.",
    pass_signal_vi: "Quality gates là dữ liệu review và test riêng, không phải thay đổi hạ tầng.",
    pass_signal_en: "Quality gates are review data with their own test, not infrastructure changes.",
    sample: { gurmukhi: "ਸੀਮਾ", romanization: "sima", vi: "ranh giới", en: "boundary" },
    modules_checked: ["finalQualityGates"],
    review_actions: ["scan forbidden paths", "scan scope", "verify no deploy"],
    learner_trap_vi: "Final quality gate không phải release hoặc deploy.",
    learner_trap_en: "A final quality gate is not a release or deploy.",
  },
  {
    id: "gate-later-integration-boundary",
    area: "later_integration_boundary",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A11 ਸੀਮਾ",
    romanization: "A11 sima",
    title_vi: "Ranh giới A11",
    title_en: "A11 boundary",
    gate_vi: "Xác nhận Wave 17 chuẩn bị review trước later integration nhưng không chạy A11 integration.",
    gate_en: "Confirms Wave 17 prepares review before later integration but does not run A11 integration.",
    pass_signal_vi: "Scope ghi not_a11_integration và dữ liệu chỉ phục vụ review.",
    pass_signal_en: "Scope says not_a11_integration and the data is only for review.",
    sample: { gurmukhi: "ਅੰਤਿਮ ਜਾਂਚ", romanization: "antim janch", vi: "kiểm tra cuối", en: "final check" },
    modules_checked: ["preIntegrationHandoffMap", "finalNavigationMap", "finalQualityGates"],
    review_actions: ["verify no A11 command", "verify no push", "verify no deploy"],
    learner_trap_vi: "Later integration boundary không có nghĩa đã tích hợp vào UI chính.",
    learner_trap_en: "A later integration boundary does not mean the main UI is integrated.",
  },
];

export const PUNJABI_FINAL_QUALITY_GATE_SEQUENCE = [
  {
    id: "coverage-script-support",
    vi: "Coverage pass: content -> A1-C2 -> Gurmukhi -> Shahmukhi awareness-only.",
    en: "Coverage pass: content -> A1-C2 -> Gurmukhi -> Shahmukhi awareness-only.",
    gate_ids: ["gate-content-files", "gate-a1-c2-readiness", "gate-gurmukhi-primary", "gate-shahmukhi-awareness"],
  },
  {
    id: "learner-canada-support",
    vi: "Learner pass: VI/EN support -> Canada survival/public service -> work/health -> remediation.",
    en: "Learner pass: VI/EN support -> Canada survival/public service -> work/health -> remediation.",
    gate_ids: ["gate-vi-en-support", "gate-canada-survival-public", "gate-canada-work-health", "gate-remediation"],
  },
  {
    id: "boundary-support",
    vi: "Boundary pass: native review deferred -> no audio/scoring -> no infrastructure -> no A11 integration.",
    en: "Boundary pass: native review deferred -> no audio/scoring -> no infrastructure -> no A11 integration.",
    gate_ids: ["gate-native-review-deferred", "gate-no-audio-scoring", "gate-no-infra-claims", "gate-later-integration-boundary"],
  },
];

export const PUNJABI_FINAL_QUALITY_GATES_ROOT = {
  scope: PUNJABI_FINAL_QUALITY_GATES_SCOPE,
  areas: PUNJABI_FINAL_QUALITY_GATE_AREAS,
  gates: PUNJABI_FINAL_QUALITY_GATES,
  sequence: PUNJABI_FINAL_QUALITY_GATE_SEQUENCE,
} as const;

export default PUNJABI_FINAL_QUALITY_GATES_ROOT;
