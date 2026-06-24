// src/languages/punjabi/finalQaInventory.ts
//
// Wave 13 final QA inventory for Punjabi pre-integration review.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiQaArea =
  | "level_coverage"
  | "skill_coverage"
  | "gurmukhi_first"
  | "learner_support"
  | "canada_domain"
  | "native_review_boundary"
  | "no_audio_claim"
  | "qa_checkpoint";

export type PunjabiQaStatus = "pass_ready" | "review_checkpoint" | "deferred_boundary";

export type PunjabiQaInventoryItem = {
  id: string;
  area: PunjabiQaArea;
  status: PunjabiQaStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  qa_question_vi: string;
  qa_question_en: string;
  expected_evidence_vi: string;
  expected_evidence_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  modules_checked: string[];
  checkpoint_vi?: string;
  checkpoint_en?: string;
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
};

export const PUNJABI_FINAL_QA_SCOPE = {
  wave: "Wave 13",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final QA inventory này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This final QA inventory uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_FINAL_QA_AREAS: PunjabiQaArea[] = [
  "level_coverage",
  "skill_coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_domain",
  "native_review_boundary",
  "no_audio_claim",
  "qa_checkpoint",
];

export const PUNJABI_FINAL_QA_INVENTORY: PunjabiQaInventoryItem[] = [
  {
    id: "qa-level-a1-c2",
    area: "level_coverage",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ ਕਵਰੇਜ",
    romanization: "paddar coverage",
    title_vi: "Độ phủ cấp độ",
    title_en: "Level coverage",
    qa_question_vi: "A1-C2 có đường học, checkpoint và can-do đủ rõ chưa?",
    qa_question_en: "Do A1-C2 have clear paths, checkpoints, and can-do evidence?",
    expected_evidence_vi: "Có course map, learning path, progression matrix, mastery checkpoint và final can-do index.",
    expected_evidence_en: "Course map, learning path, progression matrix, mastery checkpoints, and final can-do index exist.",
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn đang chờ.", en: "The summary is that the decision is still pending." },
    modules_checked: ["courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints", "finalCanDoIndex"],
    checkpoint_vi: "Mỗi cấp từ A1 đến C2 xuất hiện trong ít nhất một artifact.",
    checkpoint_en: "Each level from A1 through C2 appears in at least one artifact.",
    learner_trap_vi: "Có cấp độ không có nghĩa là có chứng chỉ chính thức.",
    learner_trap_en: "Having levels does not mean official certification.",
  },
  {
    id: "qa-core-skills",
    area: "skill_coverage",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਕੌਸ਼ਲ ਕਵਰੇਜ",
    romanization: "kaushal coverage",
    title_vi: "Độ phủ kỹ năng",
    title_en: "Skill coverage",
    qa_question_vi: "Script, từ vựng, ngữ pháp, đọc, viết, prompt nói dạng text, survival và remediation đã có mặt chưa?",
    qa_question_en: "Are script, vocabulary, grammar, reading, writing, text speaking prompts, survival, and remediation present?",
    expected_evidence_vi: "Final can-do index và content index liệt kê các domain chính để app đọc được.",
    expected_evidence_en: "The final can-do index and content index list the main app-readable domains.",
    sample: { gurmukhi: "ਕੀ ਕੋਈ ਹੋਰ ਵਿਕਲਪ ਹੈ?", romanization: "ki koi hor vikalp hai?", vi: "Có lựa chọn nào khác không?", en: "Is there another option?" },
    modules_checked: ["contentIndex", "masteryCheckpoints", "finalCanDoIndex"],
    checkpoint_vi: "Skill coverage có đủ miền học chính và không dựa vào ghi chú rời.",
    checkpoint_en: "Skill coverage includes the main learning domains and does not rely on loose notes.",
    learner_trap_vi: "Prompt nói ở đây là text-only, không phải ghi âm.",
    learner_trap_en: "Speaking prompts here are text-only, not recordings.",
  },
  {
    id: "qa-gurmukhi-primary",
    area: "gurmukhi_first",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pehlan",
    title_vi: "Gurmukhi trước",
    title_en: "Gurmukhi first",
    qa_question_vi: "Dữ liệu Punjabi có dùng Gurmukhi làm tín hiệu chính không?",
    qa_question_en: "Does Punjabi data use Gurmukhi as the primary signal?",
    expected_evidence_vi: "Mỗi artifact chính có title hoặc sample Gurmukhi, romanization chỉ hỗ trợ.",
    expected_evidence_en: "Each major artifact has Gurmukhi titles or samples; romanization is support only.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    modules_checked: ["index", "lessons", "dialogues", "courseMap", "finalModuleRegistry", "finalCanDoIndex"],
    checkpoint_vi: "Không để romanization thay thế chữ Gurmukhi trong nội dung chính.",
    checkpoint_en: "Do not let romanization replace Gurmukhi in primary content.",
    learner_trap_vi: "Chữ Latin dễ che mất phụ âm bật hơi và âm retroflex.",
    learner_trap_en: "Latin letters can hide aspiration and retroflex contrasts.",
  },
  {
    id: "qa-vi-en-support",
    area: "learner_support",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੋ-ਭਾਸ਼ੀ ਸਹਾਇਤਾ",
    romanization: "do-bhashi sahaita",
    title_vi: "Hỗ trợ Việt-Anh",
    title_en: "Vietnamese-English support",
    qa_question_vi: "Người học nói tiếng Việt và tiếng Anh đều có giải thích đủ rõ chưa?",
    qa_question_en: "Do Vietnamese-speaking and English-speaking learners both have clear explanations?",
    expected_evidence_vi: "Các artifact dùng trường VI/EN cho mục tiêu, bằng chứng, lỗi thường gặp và sample.",
    expected_evidence_en: "Artifacts use VI/EN fields for goals, evidence, common mistakes, and samples.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਦੱਸੋ।", romanization: "kirpa karke fir dasso", vi: "Xin vui lòng nói lại.", en: "Please say that again." },
    modules_checked: ["dialogues", "learningPath", "progressionMatrix", "masteryCheckpoints", "finalCanDoIndex"],
    checkpoint_vi: "Mỗi mục review phải có cả qa_question_vi và qa_question_en.",
    checkpoint_en: "Each review item must include both qa_question_vi and qa_question_en.",
    learner_trap_vi: "Không dùng giải thích tiếng Anh làm thay thế cho giải thích tiếng Việt.",
    learner_trap_en: "Do not use English explanations as a substitute for Vietnamese explanations.",
  },
  {
    id: "qa-canada-domains",
    area: "canada_domain",
    status: "review_checkpoint",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    title_pa: "ਕੈਨੇਡਾ ਵਰਤੋਂ",
    romanization: "Canada varton",
    title_vi: "Ứng dụng thực tế ở Canada",
    title_en: "Canada-practical use",
    qa_question_vi: "Settlement, survival, work, healthcare, school và public service có ví dụ thực tế chưa?",
    qa_question_en: "Do settlement, survival, work, healthcare, school, and public service have practical examples?",
    expected_evidence_vi: "Dialogue, learning path, content index và can-do index có ví dụ Canada-practical.",
    expected_evidence_en: "Dialogues, learning path, content index, and can-do index include Canada-practical examples.",
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han?", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    modules_checked: ["dialogues", "learningPath", "contentIndex", "finalCanDoIndex"],
    checkpoint_vi: "QA kiểm đủ work, clinic, school, public service và settlement.",
    checkpoint_en: "QA checks work, clinic, school, public service, and settlement.",
    learner_trap_vi: "Canada-practical là bối cảnh học ngôn ngữ, không phải tư vấn pháp lý hay y tế.",
    learner_trap_en: "Canada-practical is language-learning context, not legal or medical advice.",
    canada_practical: "Settlement agencies, clinics, school offices, workplaces, public service counters.",
  },
  {
    id: "qa-workplace-register",
    area: "canada_domain",
    status: "review_checkpoint",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਦੀ ਨਮਰਤਾ",
    romanization: "kamm di namarta",
    title_vi: "Lịch sự nơi làm việc",
    title_en: "Workplace politeness",
    qa_question_vi: "Workplace examples có register lịch sự và lỗi thường gặp chưa?",
    qa_question_en: "Do workplace examples include polite register and common learner traps?",
    expected_evidence_vi: "Có câu hỏi ca làm, sửa lỗi register và mẫu email formal.",
    expected_evidence_en: "Shift questions, register remediation, and formal email samples are present.",
    sample: { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai?", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
    modules_checked: ["dialogues", "masteryCheckpoints", "finalCanDoIndex"],
    checkpoint_vi: "Câu workplace tránh ra lệnh thô khi nói với quản lý hoặc đồng nghiệp.",
    checkpoint_en: "Workplace sentences avoid blunt commands with a manager or coworker.",
    learner_trap_vi: "Mượn từ như ਸ਼ਿਫਟ vẫn cần grammar Punjabi xung quanh.",
    learner_trap_en: "Loanwords like shift still need Punjabi grammar around them.",
    canada_practical: "Retail, warehouse, restaurant, childcare, and community jobs in Canada.",
  },
  {
    id: "qa-healthcare-boundary",
    area: "canada_domain",
    status: "review_checkpoint",
    levels: ["B1", "B2"],
    title_pa: "ਸਿਹਤ ਸੀਮਾ",
    romanization: "sehat sima",
    title_vi: "Ranh giới y tế",
    title_en: "Healthcare boundary",
    qa_question_vi: "Healthcare content có giúp mô tả triệu chứng mà không đưa lời khuyên y tế không?",
    qa_question_en: "Does healthcare content help describe symptoms without giving medical advice?",
    expected_evidence_vi: "Mẫu chỉ mô tả triệu chứng, thời gian và câu hỏi, không chẩn đoán.",
    expected_evidence_en: "Samples describe symptoms, duration, and questions, not diagnosis.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    modules_checked: ["dialogues", "progressionMatrix", "masteryCheckpoints", "finalCanDoIndex"],
    checkpoint_vi: "Healthcare QA kiểm câu ngôn ngữ, không kiểm nội dung y khoa.",
    checkpoint_en: "Healthcare QA checks language sentences, not medical content.",
    learner_trap_vi: "Một câu đúng Punjabi không phải là chẩn đoán hoặc hướng dẫn điều trị.",
    learner_trap_en: "A correct Punjabi sentence is not a diagnosis or treatment instruction.",
    canada_practical: "Clinic intake, pharmacy counter, telehealth note, and family doctor visit.",
  },
  {
    id: "qa-native-review-deferred",
    area: "native_review_boundary",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਲਤਵੀ ਸਮੀਖਿਆ",
    romanization: "multavi samikhia",
    title_vi: "Review bản ngữ hoãn",
    title_en: "Deferred native review",
    qa_question_vi: "Các artifact có tránh claim native review đã hoàn tất không?",
    qa_question_en: "Do artifacts avoid claiming completed native review?",
    expected_evidence_vi: "Scope nói rõ native review deferred và không claim kiểm duyệt bản ngữ.",
    expected_evidence_en: "Scope states native review is deferred and completed native review is not claimed.",
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    modules_checked: ["integrationReadinessChecklist", "preIntegrationCoverageMap", "finalModuleRegistry", "finalCanDoIndex"],
    checkpoint_vi: "Không dùng từ finalized theo nghĩa đã được người bản ngữ duyệt.",
    checkpoint_en: "Do not use finalized to mean reviewed by a native speaker.",
    learner_trap_vi: "QA inventory sẵn sàng không đồng nghĩa native review hoàn tất.",
    learner_trap_en: "QA inventory readiness does not mean native review is complete.",
  },
  {
    id: "qa-no-audio-scoring",
    area: "no_audio_claim",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਆਡੀਓ ਨਹੀਂ",
    romanization: "audio nahin",
    title_vi: "Không audio",
    title_en: "No audio",
    qa_question_vi: "Nội dung có tránh audio, microphone và pronunciation scoring không?",
    qa_question_en: "Does content avoid audio, microphone, and pronunciation scoring claims?",
    expected_evidence_vi: "Speaking prompt được mô tả là text-only; không có audio hoặc chấm phát âm.",
    expected_evidence_en: "Speaking prompts are described as text-only; there is no audio or pronunciation scoring.",
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    modules_checked: ["masteryCheckpoints", "finalCanDoIndex", "integrationReadinessChecklist"],
    checkpoint_vi: "Không thêm audio, scoring, Azure hoặc speech pipeline vào Wave 13.",
    checkpoint_en: "Do not add audio, scoring, Azure, or speech pipeline to Wave 13.",
    learner_trap_vi: "Text-only speaking practice không đánh giá phát âm.",
    learner_trap_en: "Text-only speaking practice does not assess pronunciation.",
  },
  {
    id: "qa-shahmukhi-awareness",
    area: "gurmukhi_first",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸ਼ਾਹਮੁਖੀ ਜਾਣਕਾਰੀ",
    romanization: "Shahmukhi jankari",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi awareness",
    qa_question_vi: "Shahmukhi chỉ được nhắc như nhận biết, không thành khóa riêng chưa?",
    qa_question_en: "Is Shahmukhi mentioned only for awareness, not as a separate course?",
    expected_evidence_vi: "Scope nói awareness-only và không có nội dung dạy Shahmukhi đầy đủ.",
    expected_evidence_en: "Scope says awareness-only and includes no full Shahmukhi teaching content.",
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    modules_checked: ["index", "courseMap", "finalModuleRegistry", "finalCanDoIndex"],
    checkpoint_vi: "Không thêm chữ Shahmukhi vào nội dung mẫu.",
    checkpoint_en: "Do not add Shahmukhi script to sample content.",
    learner_trap_vi: "Biết có Shahmukhi không đồng nghĩa học đọc Shahmukhi trong course này.",
    learner_trap_en: "Knowing Shahmukhi exists does not mean learning to read it in this course.",
  },
  {
    id: "qa-remediation-readiness",
    area: "qa_checkpoint",
    status: "review_checkpoint",
    levels: ["B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਤਿਆਰੀ",
    romanization: "murammat tiari",
    title_vi: "Sẵn sàng remediation",
    title_en: "Remediation readiness",
    qa_question_vi: "Có checkpoint để sửa lỗi lịch sự, grammar, reading và writing trước tích hợp sau này không?",
    qa_question_en: "Are there checkpoints to repair politeness, grammar, reading, and writing before later integration?",
    expected_evidence_vi: "Mastery, dependency graph, pre-integration map và final can-do index có trap/checkpoint.",
    expected_evidence_en: "Mastery, dependency graph, pre-integration map, and final can-do index include traps/checkpoints.",
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਲਿਖੋ।", romanization: "kirpa karke ih dubara likho", vi: "Xin vui lòng viết lại điều này.", en: "Please write this again." },
    modules_checked: ["skillDependencyGraph", "masteryCheckpoints", "preIntegrationCoverageMap", "finalCanDoIndex"],
    checkpoint_vi: "Remediation kiểm lỗi thường gặp, không claim đã có native review.",
    checkpoint_en: "Remediation checks common errors; it does not claim completed native review.",
    learner_trap_vi: "Thêm ਕਿਰਪਾ ਕਰਕੇ chưa đủ nếu register cả câu vẫn thô.",
    learner_trap_en: "Adding kirpa karke is not enough if the whole sentence still sounds blunt.",
  },
  {
    id: "qa-final-review-package",
    area: "qa_checkpoint",
    status: "pass_ready",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਅੰਤਿਮ ਜਾਂਚ ਪੈਕੇਜ",
    romanization: "antim janch package",
    title_vi: "Gói kiểm tra cuối",
    title_en: "Final review package",
    qa_question_vi: "Pre-integration review có đủ registry, coverage, can-do và QA inventory chưa?",
    qa_question_en: "Does pre-integration review have registry, coverage, can-do, and QA inventory data?",
    expected_evidence_vi: "Wave 10-13 tạo coverage map, registry, can-do index và QA inventory riêng.",
    expected_evidence_en: "Waves 10-13 create separate coverage map, registry, can-do index, and QA inventory data.",
    sample: { gurmukhi: "ਇਸ ਮਾਮਲੇ ਨੂੰ ਹੋਰ ਸਪਸ਼ਟ ਕਰੀਏ।", romanization: "is mamle nu hor spasht kariye", vi: "Hãy làm rõ thêm vấn đề này.", en: "Let us clarify this matter further." },
    modules_checked: ["preIntegrationCoverageMap", "finalModuleRegistry", "finalCanDoIndex", "finalQaInventory"],
    checkpoint_vi: "Wave 13 là QA inventory, không chạy A11 integration.",
    checkpoint_en: "Wave 13 is a QA inventory; it does not run A11 integration.",
    learner_trap_vi: "Pre-integration review không phải push, deploy hoặc thay đổi hạ tầng.",
    learner_trap_en: "Pre-integration review is not push, deploy, or infrastructure change.",
  },
];

export const PUNJABI_FINAL_QA_REVIEW_ORDER = [
  {
    id: "coverage-pass",
    vi: "Kiểm coverage: level -> skill -> Gurmukhi -> VI/EN.",
    en: "Coverage pass: level -> skill -> Gurmukhi -> VI/EN.",
    item_ids: ["qa-level-a1-c2", "qa-core-skills", "qa-gurmukhi-primary", "qa-vi-en-support"],
  },
  {
    id: "canada-pass",
    vi: "Kiểm Canada-practical: settlement, workplace, healthcare, school, public service.",
    en: "Canada-practical pass: settlement, workplace, healthcare, school, public service.",
    item_ids: ["qa-canada-domains", "qa-workplace-register", "qa-healthcare-boundary"],
  },
  {
    id: "boundary-pass",
    vi: "Kiểm ranh giới: native review deferred, no audio/scoring, Shahmukhi awareness-only, no A11.",
    en: "Boundary pass: native review deferred, no audio/scoring, Shahmukhi awareness-only, no A11.",
    item_ids: ["qa-native-review-deferred", "qa-no-audio-scoring", "qa-shahmukhi-awareness", "qa-final-review-package"],
  },
];

export const PUNJABI_FINAL_QA_INVENTORY_ROOT = {
  scope: PUNJABI_FINAL_QA_SCOPE,
  areas: PUNJABI_FINAL_QA_AREAS,
  items: PUNJABI_FINAL_QA_INVENTORY,
  review_order: PUNJABI_FINAL_QA_REVIEW_ORDER,
} as const;

export default PUNJABI_FINAL_QA_INVENTORY_ROOT;
