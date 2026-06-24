// src/languages/punjabi/preIntegrationCoverageMap.ts
//
// Punjabi pre-integration coverage map for later A11 planning. This is pure
// app-consumable data and does not run integration or touch infrastructure.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiCoverageDomain =
  | "module"
  | "skill"
  | "gurmukhi_path"
  | "vi_en_support"
  | "canada_survival"
  | "work"
  | "health"
  | "school"
  | "public_service"
  | "capstone"
  | "deferred_review";

export type PunjabiCoverageStatus = "covered" | "capstone_ready" | "deferred";

export type PunjabiCoverageMapItem = {
  id: string;
  domain: PunjabiCoverageDomain;
  status: PunjabiCoverageStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  coverage_vi: string;
  coverage_en: string;
  modules: string[];
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  checkpoint_vi?: string;
  checkpoint_en?: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: boolean;
};

export const PUNJABI_PRE_INTEGRATION_SCOPE = {
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  purpose_vi:
    "Bản đồ này gom độ phủ trước khi A11 sau này đọc dữ liệu. Wave 10 không chạy A11 integration.",
  purpose_en:
    "This map summarizes coverage before later A11 reads the data. Wave 10 does not run A11 integration.",
  shahmukhi_vi:
    "Shahmukhi chỉ được nhắc để nhận biết hệ chữ khác; không phải khóa học đầy đủ.",
  shahmukhi_en:
    "Shahmukhi is mentioned for awareness only as another script; it is not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  no_infra_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  no_infra_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_PRE_INTEGRATION_DOMAINS: PunjabiCoverageDomain[] = [
  "module",
  "skill",
  "gurmukhi_path",
  "vi_en_support",
  "canada_survival",
  "work",
  "health",
  "school",
  "public_service",
  "capstone",
  "deferred_review",
];

export const PUNJABI_PRE_INTEGRATION_COVERAGE: PunjabiCoverageMapItem[] = [
  {
    id: "module-stack-a1-foundation",
    domain: "module",
    status: "covered",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਸਟੈਕ",
    romanization: "module stack",
    title_vi: "Chồng module",
    title_en: "Module stack",
    coverage_vi: "Foundation, dialogue, map, path, progression, mastery, graph, index và readiness đã có dữ liệu.",
    coverage_en: "Foundation, dialogue, map, path, progression, mastery, graph, index, and readiness data exist.",
    modules: [
      "index",
      "lessons-a1",
      "dialogues",
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "skillDependencyGraph",
      "contentIndex",
      "integrationReadinessChecklist",
    ],
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    checkpoint_vi: "A11 sau này có thể tìm module theo tên mà không đoán cấu trúc.",
    checkpoint_en: "Later A11 can find modules by name without guessing the structure.",
  },
  {
    id: "level-map-a1-c2",
    domain: "module",
    status: "covered",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ ਕਵਰੇਜ",
    romanization: "paddhar coverage",
    title_vi: "Độ phủ cấp độ",
    title_en: "Level coverage",
    coverage_vi: "A1-C2 có mục tiêu, ví dụ, checkpoint, review, capstone nội bộ.",
    coverage_en: "A1-C2 have goals, examples, checkpoints, review, and internal capstones.",
    modules: ["courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints"],
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn chờ.", en: "The summary is that the decision is still pending." },
    learner_trap_vi: "C2 trong dữ liệu là mốc học tập, không phải chứng chỉ chính thức.",
    learner_trap_en: "C2 in the data is a learning milestone, not official certification.",
  },
  {
    id: "gurmukhi-primary-route",
    domain: "gurmukhi_path",
    status: "covered",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਰਾਹ",
    romanization: "Gurmukhi rah",
    title_vi: "Đường Gurmukhi",
    title_en: "Gurmukhi route",
    coverage_vi: "Metadata và các module học đều dùng Gurmukhi trước romanization.",
    coverage_en: "Metadata and learning modules use Gurmukhi before romanization.",
    modules: ["index", "lessons-a1", "learningPath", "skillDependencyGraph", "contentIndex"],
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "Gurmukhi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    checkpoint_vi: "Người học phải nhận diện chữ trước khi dựa vào romanization.",
    checkpoint_en: "Learners should recognize script before relying on romanization.",
    learner_trap_vi: "Nếu đọc được romanization nhưng không đọc Gurmukhi, dùng remediation path.",
    learner_trap_en: "If learners read romanization but not Gurmukhi, use the remediation path.",
  },
  {
    id: "vi-en-support-route",
    domain: "vi_en_support",
    status: "covered",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "dobhashi sahaita",
    title_vi: "Hỗ trợ song ngữ Việt/Anh",
    title_en: "Vietnamese/English support",
    coverage_vi: "Các ví dụ, mục tiêu, trap và checklist có tiếng Việt và tiếng Anh.",
    coverage_en: "Examples, goals, traps, and checklists include Vietnamese and English.",
    modules: ["lessons-a1", "dialogues", "courseMap", "contentIndex", "integrationReadinessChecklist"],
    sample: { gurmukhi: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhannvaad ji", vi: "Cảm ơn ạ.", en: "Thank you respectfully." },
    learner_trap_vi: "Người Việt và người nói tiếng Anh có lỗi khác nhau; không gom mọi lưu ý thành một.",
    learner_trap_en: "Vietnamese and English speakers have different error patterns; do not flatten notes into one.",
  },
  {
    id: "skills-script-vocab-grammar-register",
    domain: "skill",
    status: "covered",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    title_pa: "ਕੌਸ਼ਲ ਖੇਤਰ",
    romanization: "kaushal khetr",
    title_vi: "Miền kỹ năng",
    title_en: "Skill domains",
    coverage_vi: "Script, từ vựng, ngữ pháp, register, review/remediation đều có liên kết.",
    coverage_en: "Script, vocabulary, grammar, register, and review/remediation are linked.",
    modules: ["progressionMatrix", "masteryCheckpoints", "skillDependencyGraph"],
    sample: { gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." },
    checkpoint_vi: "A11 sau này có thể dùng graph để biết kỹ năng nào mở khóa kỹ năng nào.",
    checkpoint_en: "Later A11 can use the graph to see which skills unlock others.",
    learner_trap_vi: "ਮੈਨੂੰ và ਮੈਂ không thay thế cho nhau.",
    learner_trap_en: "Mainu and main are not interchangeable.",
  },
  {
    id: "canada-survival-coverage",
    domain: "canada_survival",
    status: "covered",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਜੀਵਨ",
    romanization: "Canada jivan",
    title_vi: "Sinh tồn ở Canada",
    title_en: "Canada survival",
    coverage_vi: "Địa chỉ, số điện thoại, mua sắm, lịch hẹn, biểu mẫu và liên hệ cơ bản có dữ liệu.",
    coverage_en: "Address, phone number, shopping, appointments, forms, and contact basics have data.",
    modules: ["learningPath", "contentIndex", "skillDependencyGraph", "integrationReadinessChecklist"],
    sample: { gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." },
    checkpoint_vi: "Capstone A2: điền thông tin cá nhân cơ bản và hỏi một câu dịch vụ.",
    checkpoint_en: "A2 capstone: fill basic personal information and ask one service question.",
    learner_trap_vi: "ਪਤਾ là địa chỉ; không nhầm với ਪਿਤਾ là bố.",
    learner_trap_en: "Pata means address; do not confuse it with pita, father.",
    canada_practical: true,
  },
  {
    id: "work-coverage",
    domain: "work",
    status: "covered",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਕਵਰੇਜ",
    romanization: "kamm coverage",
    title_vi: "Độ phủ công việc",
    title_en: "Work coverage",
    coverage_vi: "Ca làm, hạn chót, xin nghỉ, làm rõ lý do, bất đồng lịch sự.",
    coverage_en: "Shifts, deadlines, time off, reason clarification, and polite disagreement.",
    modules: ["dialogues", "progressionMatrix", "masteryCheckpoints", "contentIndex"],
    sample: { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
    checkpoint_vi: "Capstone B1/B2: viết tin nhắn hỏi lịch và giải thích trễ hạn.",
    checkpoint_en: "B1/B2 capstone: write a message asking schedule and explaining a delay.",
    learner_trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; xác nhận ngày cụ thể.",
    learner_trap_en: "Kall can mean yesterday or tomorrow; confirm the exact date.",
    canada_practical: true,
  },
  {
    id: "health-coverage",
    domain: "health",
    status: "covered",
    levels: ["A2", "B1", "B2"],
    title_pa: "ਸਿਹਤ ਕਵਰੇਜ",
    romanization: "sehat coverage",
    title_vi: "Độ phủ y tế",
    title_en: "Health coverage",
    coverage_vi: "Đặt lịch, đau, sốt, ho, dị ứng, thuốc, thời lượng triệu chứng.",
    coverage_en: "Appointments, pain, fever, cough, allergy, medicine, and symptom duration.",
    modules: ["dialogues", "learningPath", "progressionMatrix", "masteryCheckpoints"],
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    checkpoint_vi: "Capstone B2: viết ghi chú phòng khám với triệu chứng, thời lượng, thuốc.",
    checkpoint_en: "B2 capstone: write a clinic note with symptoms, duration, and medicine.",
    learner_trap_vi: "Tên thuốc nên có dạng chữ viết; romanization không đủ an toàn trong y tế.",
    learner_trap_en: "Medicine names should be written; romanization is not safe enough in healthcare.",
    canada_practical: true,
  },
  {
    id: "school-coverage",
    domain: "school",
    status: "covered",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਸਕੂਲ ਕਵਰੇਜ",
    romanization: "school coverage",
    title_vi: "Độ phủ trường học",
    title_en: "School coverage",
    coverage_vi: "Có lớp học, phòng học, xin nhắc lại, nộp bài muộn trong dialogue batch.",
    coverage_en: "Class, classroom, asking for repetition, and late homework exist in the dialogue batch.",
    modules: ["dialogues", "contentIndex"],
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke phir dasso", vi: "Làm ơn nói lại.", en: "Please say it again." },
    checkpoint_vi: "Capstone B1: giải thích bài tập nộp muộn một ngày.",
    checkpoint_en: "B1 capstone: explain homework will be one day late.",
    learner_trap_vi: "ਦੱਸੋ lịch sự hơn ਦੱਸ khi nói với giáo viên.",
    learner_trap_en: "Dasso is more polite than dass when speaking to a teacher.",
    canada_practical: true,
  },
  {
    id: "public-service-coverage",
    domain: "public_service",
    status: "covered",
    levels: ["A2", "B1", "C1"],
    title_pa: "ਸਰਕਾਰੀ ਸੇਵਾ ਕਵਰੇਜ",
    romanization: "sarkari seva coverage",
    title_vi: "Độ phủ dịch vụ công",
    title_en: "Public-service coverage",
    coverage_vi: "Mẫu đơn, chữ ký, giấy tờ cần thiết, lý do quyết định, yêu cầu làm rõ.",
    coverage_en: "Forms, signatures, required documents, decision reasons, and clarification requests.",
    modules: ["dialogues", "learningPath", "skillDependencyGraph", "integrationReadinessChecklist"],
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    checkpoint_vi: "Capstone C1: hỏi lý do quyết định bằng register lịch sự.",
    checkpoint_en: "C1 capstone: ask for a decision reason using polite register.",
    learner_trap_vi: "Yêu cầu quá trực tiếp trong cơ quan công quyền có thể nghe gắt.",
    learner_trap_en: "Overly direct public-office requests can sound harsh.",
    canada_practical: true,
  },
  {
    id: "capstone-checkpoints",
    domain: "capstone",
    status: "capstone_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੈਪਸਟੋਨ ਚੈਕਪੋਇੰਟ",
    romanization: "capstone checkpoint",
    title_vi: "Checkpoint capstone",
    title_en: "Capstone checkpoints",
    coverage_vi: "Có capstone nội bộ: đọc chữ, điền thông tin, lịch làm, ghi chú y tế, dịch vụ công, tóm tắt.",
    coverage_en: "Internal capstones exist: script reading, personal info, work schedule, clinic note, public service, summary.",
    modules: ["masteryCheckpoints", "progressionMatrix", "integrationReadinessChecklist"],
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    checkpoint_vi: "C2 capstone: tóm tắt và đánh dấu phần cần native review sau.",
    checkpoint_en: "C2 capstone: summarize and flag areas for later native review.",
    learner_trap_vi: "Capstone không phải chứng chỉ chính thức.",
    learner_trap_en: "A capstone is not official certification.",
  },
  {
    id: "deferred-native-review",
    domain: "deferred_review",
    status: "deferred",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review bản ngữ hoãn",
    title_en: "Deferred native review",
    coverage_vi: "Native review, audio, chấm phát âm, chứng chỉ chính thức và Shahmukhi đầy đủ đều không nằm trong phạm vi.",
    coverage_en: "Native review, audio, pronunciation scoring, official certification, and full Shahmukhi are out of scope.",
    modules: ["courseMap", "learningPath", "contentIndex", "integrationReadinessChecklist"],
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    checkpoint_vi: "A11 sau này phải giữ cảnh báo này hiển thị nếu tích hợp.",
    checkpoint_en: "Later A11 should preserve this warning if integrating.",
    learner_trap_vi: "Không tuyên bố native review khi nó đã được hoãn.",
    learner_trap_en: "Do not claim native review when it is deferred.",
  },
];

export const PUNJABI_PRE_INTEGRATION_SUMMARY = {
  covered_domains: PUNJABI_PRE_INTEGRATION_DOMAINS,
  all_levels: ["A1", "A2", "B1", "B2", "C1", "C2"] as const,
  deferred: ["native_review", "audio", "pronunciation_scoring", "official_certification", "full_shahmukhi"] as const,
  later_a11_vi: "A11 sau này có thể đọc bản đồ này, nhưng Wave 10 không chạy A11.",
  later_a11_en: "Later A11 can read this map, but Wave 10 does not run A11.",
} as const;

export const PUNJABI_PRE_INTEGRATION_COVERAGE_MAP = {
  scope: PUNJABI_PRE_INTEGRATION_SCOPE,
  domains: PUNJABI_PRE_INTEGRATION_DOMAINS,
  coverage: PUNJABI_PRE_INTEGRATION_COVERAGE,
  summary: PUNJABI_PRE_INTEGRATION_SUMMARY,
} as const;

export default PUNJABI_PRE_INTEGRATION_COVERAGE_MAP;
