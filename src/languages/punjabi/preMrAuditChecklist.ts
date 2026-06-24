// src/languages/punjabi/preMrAuditChecklist.ts
//
// Wave 14 pre-MR audit checklist for Punjabi integration readiness.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiPreMrAuditArea =
  | "file_coverage"
  | "level_coverage"
  | "bilingual_support"
  | "gurmukhi_first_path"
  | "canada_practical_domain"
  | "native_review_boundary"
  | "no_audio_pronunciation_claim"
  | "routing_readiness";

export type PunjabiPreMrAuditStatus = "ready_for_review" | "needs_manual_review" | "deferred_boundary";

export type PunjabiPreMrAuditChecklistItem = {
  id: string;
  area: PunjabiPreMrAuditArea;
  status: PunjabiPreMrAuditStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  audit_question_vi: string;
  audit_question_en: string;
  pass_signal_vi: string;
  pass_signal_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  files_or_modules: string[];
  review_route: string[];
  checkpoint_vi?: string;
  checkpoint_en?: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_PRE_MR_AUDIT_SCOPE = {
  wave: "Wave 14",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Pre-MR audit checklist này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This pre-MR audit checklist uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_PRE_MR_AUDIT_AREAS: PunjabiPreMrAuditArea[] = [
  "file_coverage",
  "level_coverage",
  "bilingual_support",
  "gurmukhi_first_path",
  "canada_practical_domain",
  "native_review_boundary",
  "no_audio_pronunciation_claim",
  "routing_readiness",
];

export const PUNJABI_PRE_MR_AUDIT_CHECKLIST: PunjabiPreMrAuditChecklistItem[] = [
  {
    id: "audit-file-coverage",
    area: "file_coverage",
    status: "ready_for_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਫਾਈਲ ਕਵਰੇਜ",
    romanization: "file coverage",
    title_vi: "Độ phủ file",
    title_en: "File coverage",
    audit_question_vi: "Các artifact Punjabi chính đã có dữ liệu TypeScript app-consumable và test tương ứng chưa?",
    audit_question_en: "Do the main Punjabi artifacts have app-consumable TypeScript data and matching tests?",
    pass_signal_vi: "Foundation, dialogues, course map, learning path, progression, checkpoints, indexes, registry, QA và audit đều có file riêng.",
    pass_signal_en: "Foundation, dialogues, course map, learning path, progression, checkpoints, indexes, registry, QA, and audit each have dedicated files.",
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    files_or_modules: [
      "index",
      "lessons",
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
    ],
    review_route: ["git status", "test file", "commit review"],
    checkpoint_vi: "MR reviewer có thể đi từ checklist đến từng module mà không đoán tên file.",
    checkpoint_en: "An MR reviewer can move from the checklist to each module without guessing filenames.",
    learner_trap_vi: "File có mặt không đồng nghĩa mọi câu đã qua native review.",
    learner_trap_en: "A present file does not mean every sentence has completed native review.",
  },
  {
    id: "audit-level-coverage-a1-c2",
    area: "level_coverage",
    status: "ready_for_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1-C2 ਪੱਧਰ",
    romanization: "A1-C2 paddar",
    title_vi: "Cấp độ A1-C2",
    title_en: "A1-C2 levels",
    audit_question_vi: "A1-C2 có đủ đường học, can-do, checkpoint và readiness evidence chưa?",
    audit_question_en: "Do A1-C2 have learning paths, can-do items, checkpoints, and readiness evidence?",
    pass_signal_vi: "Course map, progression matrix, mastery checkpoints, final can-do index và QA inventory đều bao phủ A1-C2.",
    pass_signal_en: "Course map, progression matrix, mastery checkpoints, final can-do index, and QA inventory cover A1-C2.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    files_or_modules: ["courseMap", "progressionMatrix", "masteryCheckpoints", "finalCanDoIndex", "finalQaInventory"],
    review_route: ["level scan", "checkpoint scan", "can-do scan"],
    checkpoint_vi: "Audit kiểm đủ A1, A2, B1, B2, C1 và C2.",
    checkpoint_en: "Audit checks A1, A2, B1, B2, C1, and C2.",
    learner_trap_vi: "A1-C2 ở đây là tổ chức học, không phải chứng chỉ chính thức.",
    learner_trap_en: "A1-C2 here is learning organization, not official certification.",
  },
  {
    id: "audit-vi-en-learners",
    area: "bilingual_support",
    status: "ready_for_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਵੀਅਤਨਾਮੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਸਹਾਇਤਾ",
    romanization: "Vietnamese ate English sahaita",
    title_vi: "Hỗ trợ người học Việt và Anh",
    title_en: "Vietnamese and English learner support",
    audit_question_vi: "Mỗi artifact chính có giải thích tiếng Việt và tiếng Anh đủ rõ chưa?",
    audit_question_en: "Does each major artifact include clear Vietnamese and English explanations?",
    pass_signal_vi: "Các trường *_vi và *_en xuất hiện trong mục tiêu, evidence, trap, sample và route.",
    pass_signal_en: "The *_vi and *_en fields appear in goals, evidence, traps, samples, and routes.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    files_or_modules: ["dialogues", "learningPath", "contentIndex", "finalCanDoIndex", "finalQaInventory"],
    review_route: ["VI field scan", "EN field scan", "sample scan"],
    checkpoint_vi: "Không để tiếng Anh thay thế phần giải thích tiếng Việt.",
    checkpoint_en: "Do not let English replace Vietnamese explanations.",
    learner_trap_vi: "Người học Việt cần cảnh báo lỗi riêng, không chỉ bản dịch.",
    learner_trap_en: "Vietnamese-speaking learners need specific trap notes, not only translations.",
  },
  {
    id: "audit-gurmukhi-first-route",
    area: "gurmukhi_first_path",
    status: "ready_for_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਰਾਹ",
    romanization: "Gurmukhi pehlan rah",
    title_vi: "Lộ trình Gurmukhi trước",
    title_en: "Gurmukhi-first route",
    audit_question_vi: "Nội dung có đặt Gurmukhi làm chữ chính và romanization làm hỗ trợ không?",
    audit_question_en: "Does content place Gurmukhi as primary and romanization as support?",
    pass_signal_vi: "Punjabi titles và samples có Gurmukhi; romanization xuất hiện để hỗ trợ đọc.",
    pass_signal_en: "Punjabi titles and samples include Gurmukhi; romanization appears as reading support.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    files_or_modules: ["index", "lessons-a1", "dialogues", "courseMap", "finalCanDoIndex"],
    review_route: ["Gurmukhi sample scan", "romanization support scan", "script boundary scan"],
    checkpoint_vi: "Người review thấy chữ Gurmukhi trước khi thấy romanization trong sample chính.",
    checkpoint_en: "A reviewer sees Gurmukhi before romanization in primary samples.",
    learner_trap_vi: "Romanization không thể hiện đầy đủ phụ âm bật hơi và retroflex.",
    learner_trap_en: "Romanization cannot fully show aspiration and retroflex contrasts.",
  },
  {
    id: "audit-shahmukhi-boundary",
    area: "gurmukhi_first_path",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸ਼ਾਹਮੁਖੀ ਸੀਮਾ",
    romanization: "Shahmukhi sima",
    title_vi: "Ranh giới Shahmukhi",
    title_en: "Shahmukhi boundary",
    audit_question_vi: "Shahmukhi chỉ được nhắc như awareness, không thành course đầy đủ chưa?",
    audit_question_en: "Is Shahmukhi mentioned only as awareness, not as a full course?",
    pass_signal_vi: "Scope nói awareness-only và sample không dùng chữ Shahmukhi.",
    pass_signal_en: "Scope says awareness-only and samples do not use Shahmukhi script.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    files_or_modules: ["index", "courseMap", "finalModuleRegistry", "finalCanDoIndex", "finalQaInventory"],
    review_route: ["scope scan", "sample script scan", "no full-course scan"],
    checkpoint_vi: "Không thêm nội dung dạy Shahmukhi vào Wave 14.",
    checkpoint_en: "Do not add Shahmukhi teaching content in Wave 14.",
    learner_trap_vi: "Biết có Shahmukhi không có nghĩa là course này dạy đọc Shahmukhi.",
    learner_trap_en: "Knowing Shahmukhi exists does not mean this course teaches reading it.",
  },
  {
    id: "audit-canada-settlement-public",
    area: "canada_practical_domain",
    status: "needs_manual_review",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਸੈਟਲਮੈਂਟ ਅਤੇ ਸੇਵਾ",
    romanization: "settlement ate seva",
    title_vi: "Định cư và dịch vụ công",
    title_en: "Settlement and public service",
    audit_question_vi: "Settlement và public-service có câu hỏi giấy tờ, địa chỉ và thông tin cá nhân chưa?",
    audit_question_en: "Do settlement and public-service areas include documents, address, and personal information?",
    pass_signal_vi: "Có mẫu địa chỉ, số điện thoại, giấy tờ cần thiết và câu hỏi dịch vụ.",
    pass_signal_en: "Address, phone number, required documents, and service questions are present.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    files_or_modules: ["dialogues", "learningPath", "contentIndex", "finalCanDoIndex"],
    review_route: ["settlement scan", "public service scan", "document phrase scan"],
    checkpoint_vi: "Mẫu Canada-practical là học ngôn ngữ, không phải tư vấn pháp lý.",
    checkpoint_en: "Canada-practical samples are language learning, not legal advice.",
    learner_trap_vi: "ਦਸਤਾਵੇਜ਼ là documents; đừng lẫn với địa điểm hoặc thời gian.",
    learner_trap_en: "Dastavez means documents; do not confuse it with place or time.",
    canada_practical: "Settlement agency, school office, municipal counter, and public service desk in Canada.",
  },
  {
    id: "audit-canada-work-health-school",
    area: "canada_practical_domain",
    status: "needs_manual_review",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਸਿਹਤ ਸਕੂਲ",
    romanization: "kamm sehat school",
    title_vi: "Công việc, y tế, trường học",
    title_en: "Work, health, school",
    audit_question_vi: "Workplace, healthcare và school có ví dụ thực tế nhưng không vượt phạm vi không?",
    audit_question_en: "Do workplace, healthcare, and school examples stay practical without overreaching?",
    pass_signal_vi: "Có câu ca làm, triệu chứng, thông báo trường/lớp và register lịch sự.",
    pass_signal_en: "Shift, symptom, school/class notice, and polite-register examples are present.",
    sample: { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai?", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
    files_or_modules: ["dialogues", "progressionMatrix", "masteryCheckpoints", "finalCanDoIndex", "finalQaInventory"],
    review_route: ["work scan", "health scan", "school scan", "register scan"],
    checkpoint_vi: "Healthcare chỉ mô tả triệu chứng, không chẩn đoán.",
    checkpoint_en: "Healthcare only describes symptoms; it does not diagnose.",
    learner_trap_vi: "Câu workplace đúng nghĩa vẫn có thể thiếu lịch sự nếu register quá trực tiếp.",
    learner_trap_en: "A workplace sentence can be meaningful but still too blunt in register.",
    canada_practical: "Work schedules, clinic intake, school office notes, and community workplace messages in Canada.",
  },
  {
    id: "audit-native-review-deferred",
    area: "native_review_boundary",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Native review hoãn",
    title_en: "Deferred native review",
    audit_question_vi: "Pre-MR checklist có tránh tuyên bố native review đã hoàn tất không?",
    audit_question_en: "Does the pre-MR checklist avoid claiming completed native review?",
    pass_signal_vi: "Scope và boundary items nói native review deferred và not claimed.",
    pass_signal_en: "Scope and boundary items state native review is deferred and not claimed.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਲਿਖੋ।", romanization: "kirpa karke ih dubara likho", vi: "Xin vui lòng viết lại điều này.", en: "Please write this again." },
    files_or_modules: ["integrationReadinessChecklist", "preIntegrationCoverageMap", "finalModuleRegistry", "finalQaInventory"],
    review_route: ["native review phrase scan", "overclaim scan", "deferred boundary scan"],
    checkpoint_vi: "Không ghi approved by native speaker hoặc native-reviewed.",
    checkpoint_en: "Do not write approved by native speaker or native-reviewed.",
    learner_trap_vi: "Review readiness không đồng nghĩa kiểm duyệt bản ngữ đã xong.",
    learner_trap_en: "Review readiness does not mean native review is complete.",
  },
  {
    id: "audit-no-audio-pronunciation",
    area: "no_audio_pronunciation_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਆਡੀਓ ਅਤੇ ਸਕੋਰਿੰਗ ਨਹੀਂ",
    romanization: "audio ate scoring nahin",
    title_vi: "Không audio và scoring",
    title_en: "No audio or scoring",
    audit_question_vi: "Checklist có tránh thêm audio, microphone, Azure hoặc pronunciation scoring không?",
    audit_question_en: "Does the checklist avoid adding audio, microphone, Azure, or pronunciation scoring?",
    pass_signal_vi: "Speaking prompt được giữ text-only; excluded scope nêu no audio và no pronunciation scoring.",
    pass_signal_en: "Speaking prompts remain text-only; excluded scope states no audio and no pronunciation scoring.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    files_or_modules: ["masteryCheckpoints", "finalCanDoIndex", "finalQaInventory", "preMrAuditChecklist"],
    review_route: ["audio claim scan", "scoring claim scan", "text-only scan"],
    checkpoint_vi: "Không chạm audio, scoring, Azure hoặc speech pipeline.",
    checkpoint_en: "Do not touch audio, scoring, Azure, or speech pipeline.",
    learner_trap_vi: "Text-speaking prompt là bài viết hội thoại, không phải đánh giá phát âm.",
    learner_trap_en: "A text-speaking prompt is written dialogue practice, not pronunciation evaluation.",
  },
  {
    id: "audit-routing-readiness",
    area: "routing_readiness",
    status: "ready_for_review",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੂਟਿੰਗ ਤਿਆਰੀ",
    romanization: "routing tiari",
    title_vi: "Sẵn sàng routing",
    title_en: "Routing readiness",
    audit_question_vi: "Artifacts có route/review order để reviewer và app chọn đường học không?",
    audit_question_en: "Do artifacts include routes or review order so reviewers and the app can choose paths?",
    pass_signal_vi: "Learning path, registry, can-do index, QA inventory và audit checklist có route hoặc review order.",
    pass_signal_en: "Learning path, registry, can-do index, QA inventory, and audit checklist include routes or review order.",
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    files_or_modules: ["learningPath", "finalModuleRegistry", "finalCanDoIndex", "finalQaInventory", "preMrAuditChecklist"],
    review_route: ["new learner route", "Canada route", "boundary route"],
    checkpoint_vi: "Routing là dữ liệu review, không phải deploy hoặc A11 integration.",
    checkpoint_en: "Routing is review data, not deploy or A11 integration.",
    learner_trap_vi: "Có review route không có nghĩa là đã tích hợp vào UI chính.",
    learner_trap_en: "Having review routes does not mean the main UI is integrated.",
  },
  {
    id: "audit-final-mr-boundary",
    area: "routing_readiness",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "MR ਸੀਮਾ",
    romanization: "MR sima",
    title_vi: "Ranh giới MR",
    title_en: "MR boundary",
    audit_question_vi: "Wave 14 có giữ vai trò pre-MR audit, không chạy A11 integration không?",
    audit_question_en: "Does Wave 14 remain a pre-MR audit and avoid running A11 integration?",
    pass_signal_vi: "Scope ghi not A11 integration, checklist chỉ là dữ liệu review và test riêng.",
    pass_signal_en: "Scope states not A11 integration; the checklist is review data with its own test.",
    sample: { gurmukhi: "ਤਿਆਰੀ", romanization: "tiari", vi: "sự sẵn sàng", en: "readiness" },
    files_or_modules: ["preMrAuditChecklist"],
    review_route: ["scope scan", "allowed file scan", "test-only scan"],
    checkpoint_vi: "Không push, deploy, chỉnh CI hoặc chạy A11 integration.",
    checkpoint_en: "Do not push, deploy, edit CI, or run A11 integration.",
    learner_trap_vi: "Pre-MR audit là bước chuẩn bị, không phải merge hoặc release.",
    learner_trap_en: "Pre-MR audit is preparation, not merge or release.",
  },
];

export const PUNJABI_PRE_MR_AUDIT_REVIEW_ROUTES = [
  {
    id: "coverage-review",
    vi: "Coverage review: file coverage -> A1-C2 -> VI/EN support -> Gurmukhi-first path.",
    en: "Coverage review: file coverage -> A1-C2 -> VI/EN support -> Gurmukhi-first path.",
    item_ids: ["audit-file-coverage", "audit-level-coverage-a1-c2", "audit-vi-en-learners", "audit-gurmukhi-first-route"],
  },
  {
    id: "canada-review",
    vi: "Canada review: settlement/public service -> work/health/school -> scope boundaries.",
    en: "Canada review: settlement/public service -> work/health/school -> scope boundaries.",
    item_ids: ["audit-canada-settlement-public", "audit-canada-work-health-school"],
  },
  {
    id: "boundary-review",
    vi: "Boundary review: Shahmukhi awareness-only -> native review deferred -> no audio/scoring -> no A11.",
    en: "Boundary review: Shahmukhi awareness-only -> native review deferred -> no audio/scoring -> no A11.",
    item_ids: ["audit-shahmukhi-boundary", "audit-native-review-deferred", "audit-no-audio-pronunciation", "audit-final-mr-boundary"],
  },
];

export const PUNJABI_PRE_MR_AUDIT_CHECKLIST_ROOT = {
  scope: PUNJABI_PRE_MR_AUDIT_SCOPE,
  areas: PUNJABI_PRE_MR_AUDIT_AREAS,
  items: PUNJABI_PRE_MR_AUDIT_CHECKLIST,
  review_routes: PUNJABI_PRE_MR_AUDIT_REVIEW_ROUTES,
} as const;

export default PUNJABI_PRE_MR_AUDIT_CHECKLIST_ROOT;
