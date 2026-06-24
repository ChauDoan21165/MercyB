// src/languages/punjabi/finalPreA11Seal.ts
//
// Wave 52 final pre-A11 seal for Punjabi.
// This is not A11 integration. Gurmukhi is primary; native review is deferred.
// Shahmukhi is awareness only, not a full course. No audio or scoring claims.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11SealArea =
  | "module_family_completeness"
  | "import_export_expectations"
  | "naming_consistency"
  | "duplicate_id_risk"
  | "a1_c2_coverage"
  | "gurmukhi_script_coverage"
  | "canada_survival_coverage"
  | "remediation_coverage"
  | "deferred_native_review"
  | "forbidden_claims";

export type PunjabiFinalPreA11SealStatus =
  | "ready_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalPreA11SealItem = {
  id: string;
  area: PunjabiFinalPreA11SealArea;
  status: PunjabiFinalPreA11SealStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  seal_question_vi: string;
  seal_question_en: string;
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

export const PUNJABI_FINAL_PRE_A11_SEAL_SCOPE = {
  wave: "Wave 52",
  not_a11_integration: true,
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  script_note_vi:
    "Final pre-A11 seal này dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa đầy đủ.",
  script_note_en:
    "This final pre-A11 seal uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
} as const;

export const PUNJABI_FINAL_PRE_A11_SEAL_AREAS: PunjabiFinalPreA11SealArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "a1_c2_coverage",
  "gurmukhi_script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "deferred_native_review",
  "forbidden_claims",
];

export const PUNJABI_FINAL_PRE_A11_SEAL: PunjabiFinalPreA11SealItem[] = [
  {
    id: "seal-module-family",
    area: "module_family_completeness",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਪੂਰਨਤਾ",
    romanization: "module parivaar poornata",
    title_vi: "Độ đầy đủ của họ module",
    title_en: "Module family completeness",
    seal_question_vi: "Bộ Punjabi cuối có đủ family module cho review và later A11 không?",
    seal_question_en: "Does the final Punjabi set have enough family modules for review and later A11?",
    expected_evidence_vi: "Có course map, learning path, progression, checkpoints, QA, manifest, navigation và evidence.",
    expected_evidence_en: "Course map, learning path, progression, checkpoints, QA, manifest, navigation, and evidence exist.",
    sample: { gurmukhi: "ਪੰਜਾਬੀ ਦਾ ਢਾਂਚਾ ਮੌਜੂਦ ਹੈ।", romanization: "Punjabi da dhaancha maujud hai.", vi: "Cấu trúc Punjabi đã có.", en: "The Punjabi structure exists." },
    modules_checked: ["courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints", "finalQaInventory", "finalContentManifest", "finalNavigationMap", "finalIntegrationEvidenceMap"],
    checkpoint_vi: "Seal chỉ xác nhận family module có mặt; không chạy integration.",
    checkpoint_en: "The seal only confirms module-family presence; it does not run integration.",
    learner_trap_vi: "Có module family không có nghĩa là đã kết nối A11.",
    learner_trap_en: "Having the module family does not mean A11 integration is done.",
  },
  {
    id: "seal-import-export",
    area: "import_export_expectations",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਅਤੇ ਐਕਸਪੋਰਟ",
    romanization: "import ate export",
    title_vi: "Quy ước import/export",
    title_en: "Import/export expectations",
    seal_question_vi: "Export của data file có ổn cho app-consumable TypeScript không?",
    seal_question_en: "Is the export shape valid for app-consumable TypeScript data?",
    expected_evidence_vi: "Có named export và default export trỏ cùng một mảng dữ liệu.",
    expected_evidence_en: "Named export and default export point to the same data array.",
    sample: { gurmukhi: "ਇਹ ਇੱਕ ਐਕਸਪੋਰਟ ਹੈ।", romanization: "ih ik export hai.", vi: "Đây là một export.", en: "This is an export." },
    modules_checked: ["finalPreA11Seal", "__tests__/punjabiFinalPreA11Seal.test.ts"],
    checkpoint_vi: "Người review nên thấy dữ liệu dùng được ngay, không phải note rời.",
    checkpoint_en: "A reviewer should see immediately usable data, not loose notes.",
    learner_trap_vi: "Export đúng không đồng nghĩa nội dung đã được native review.",
    learner_trap_en: "Correct export shape does not mean native review is complete.",
  },
  {
    id: "seal-naming-consistency",
    area: "naming_consistency",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਦੀ ਇਕਸਾਰਤਾ",
    romanization: "naan di iksarta",
    title_vi: "Tính nhất quán tên gọi",
    title_en: "Naming consistency",
    seal_question_vi: "Tên file, tên export và tên item có nhất quán không?",
    seal_question_en: "Are file names, export names, and item names consistent?",
    expected_evidence_vi: "Tên seal, test và item đều theo cùng family pre-A11.",
    expected_evidence_en: "Seal, test, and item names all follow the same pre-A11 family.",
    sample: { gurmukhi: "ਨਾਮ ਇੱਕੋ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।", romanization: "naam iko rehna chahida hai.", vi: "Tên gọi nên nhất quán.", en: "Names should stay consistent." },
    modules_checked: ["finalPreA11Seal", "finalPreIntegrationSummary", "finalQaInventory", "finalModuleRegistry"],
    checkpoint_vi: "Không để naming drift làm reviewer hiểu lầm wave khác.",
    checkpoint_en: "Do not let naming drift make reviewers think this is another wave.",
    learner_trap_vi: "Tên khác nhau một chút có thể làm người đọc hiểu sai scope.",
    learner_trap_en: "Slightly different names can make readers misread scope.",
  },
  {
    id: "seal-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ",
    romanization: "duplicate ID jokhim",
    title_vi: "Rủi ro trùng ID",
    title_en: "Duplicate ID risk",
    seal_question_vi: "Có kiểm soát duplicate-id risk trong final set chưa?",
    seal_question_en: "Is duplicate-id risk controlled in the final set?",
    expected_evidence_vi: "Mỗi item có id riêng và test có thể quét trùng lặp.",
    expected_evidence_en: "Each item has a unique id and the test can scan for duplicates.",
    sample: { gurmukhi: "ਇੱਕ ID, ਇੱਕ ਮਾਲਕ।", romanization: "ik ID, ik malik.", vi: "Một ID, một chủ sở hữu.", en: "One ID, one owner." },
    modules_checked: ["finalPreA11Seal", "finalModuleRegistry", "finalContentManifest", "finalIntegrationEvidenceMap"],
    checkpoint_vi: "Seal cần cho thấy id không bị copy-paste trùng giữa items.",
    checkpoint_en: "The seal should show ids are not copy-pasted across items.",
    learner_trap_vi: "Trùng ID là lỗi dữ liệu, không phải lỗi dịch.",
    learner_trap_en: "Duplicate ids are a data error, not a translation issue.",
  },
  {
    id: "seal-a1-c2-coverage",
    area: "a1_c2_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਕਵਰੇਜ",
    romanization: "A1 ton C2 coverage",
    title_vi: "Độ phủ A1-C2",
    title_en: "A1-C2 coverage",
    seal_question_vi: "A1 đến C2 có dấu vết trong final artifacts chưa?",
    seal_question_en: "Do A1 through C2 appear in the final artifacts?",
    expected_evidence_vi: "Có route, can-do, progression, checkpoints và final review artifacts theo level.",
    expected_evidence_en: "Routes, can-do, progression, checkpoints, and final review artifacts exist by level.",
    sample: { gurmukhi: "ਹਰ ਪੱਧਰ ਦੀ ਥਾਂ ਮੌਜੂਦ ਹੈ।", romanization: "har padhar di thaan maujud hai.", vi: "Mỗi cấp đều có chỗ.", en: "Each level has a place." },
    modules_checked: ["courseMap", "progressionMatrix", "masteryCheckpoints", "finalCanDoIndex", "finalQaInventory"],
    checkpoint_vi: "Mỗi cấp cần ít nhất một dấu vết trong artifacts chính.",
    checkpoint_en: "Each level needs at least one trace in the main artifacts.",
    canada_practical: "Một reviewer ở Canada có thể theo level mà không nhảy cóc.",
    learner_trap_vi: "Có level trong dữ liệu không có nghĩa là roadmap đã hoàn chỉnh.",
    learner_trap_en: "Having levels in the data does not mean the roadmap is fully complete.",
  },
  {
    id: "seal-gurmukhi-coverage",
    area: "gurmukhi_script_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਕਵਰੇਜ",
    romanization: "Gurmukhi coverage",
    title_vi: "Phủ chữ Gurmukhi",
    title_en: "Gurmukhi coverage",
    seal_question_vi: "Final set có đủ tín hiệu Gurmukhi trong title, sample và review không?",
    seal_question_en: "Does the final set keep Gurmukhi in titles, samples, and reviews?",
    expected_evidence_vi: "Gurmukhi xuất hiện ở sample và title, romanization chỉ làm cầu nối.",
    expected_evidence_en: "Gurmukhi appears in samples and titles; romanization is only a bridge.",
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ ਲਿਪੀ", romanization: "Gurmukhi lipi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    modules_checked: ["dialogues", "lessons", "finalCanDoIndex", "finalPreIntegrationSummary"],
    checkpoint_vi: "Đừng để Latin lấn Gurmukhi trong nội dung chính.",
    checkpoint_en: "Do not let Latin displace Gurmukhi in primary content.",
    learner_trap_vi: "Romanization có thể che mất bật hơi và retroflex.",
    learner_trap_en: "Romanization can hide aspiration and retroflex contrasts.",
    canada_practical: "Biển, form, và quầy dịch vụ ở Canada đều nên giữ Gurmukhi là chính.",
  },
  {
    id: "seal-canada-survival",
    area: "canada_survival_coverage",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    title_pa: "ਕੈਨੇਡਾ ਬਚਾਅ ਕਵਰੇਜ",
    romanization: "Canada bacao coverage",
    title_vi: "Phủ survival Canada",
    title_en: "Canada survival coverage",
    seal_question_vi: "Có đủ ví dụ survival Canada cho clinic, school, workplace, housing và public service chưa?",
    seal_question_en: "Are there enough Canada-survival examples for clinic, school, workplace, housing, and public service?",
    expected_evidence_vi: "Có line về lịch làm, form, địa chỉ, giấy tờ, public-service và clinic.",
    expected_evidence_en: "There are lines for schedules, forms, addresses, documents, public service, and clinics.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu ih form bharan vich madad chahidi hai.", vi: "Tôi cần giúp điền mẫu đơn này.", en: "I need help filling out this form." },
    modules_checked: ["dialogues", "learningPath", "finalCanDoIndex", "finalNavigationMap", "finalContentManifest"],
    checkpoint_vi: "Canada-practical là bối cảnh học ngôn ngữ, không phải tư vấn pháp lý hay y tế.",
    checkpoint_en: "Canada-practical is language-learning context, not legal or medical advice.",
    learner_trap_vi: "Đừng biến survival text thành tư vấn chuyên môn.",
    learner_trap_en: "Do not turn survival text into professional advice.",
    canada_practical: "Clinic intake, school office, workplace schedule, rental notices, and city service desks in Canada.",
  },
  {
    id: "seal-remediation",
    area: "remediation_coverage",
    status: "ready_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਕਵਰੇਜ",
    romanization: "murammat coverage",
    title_vi: "Phủ remediation",
    title_en: "Remediation coverage",
    seal_question_vi: "Lỗi thường gặp có repair path và checkpoint đi kèm chưa?",
    seal_question_en: "Do common mistakes have repair paths and checkpoints attached?",
    expected_evidence_vi: "Traps, checkpoint và review items đều có cách sửa rõ ràng.",
    expected_evidence_en: "Traps, checkpoints, and review items all include clear repair paths.",
    sample: { gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ।", romanization: "mainu samajh nahin aai.", vi: "Tôi chưa hiểu.", en: "I did not understand." },
    modules_checked: ["finalQaInventory", "finalPreIntegrationSummary", "masteryCheckpoints", "finalCanDoIndex"],
    checkpoint_vi: "Nếu người học chưa hiểu, seal phải chỉ được đường sửa.",
    checkpoint_en: "If the learner did not understand, the seal must show how to repair it.",
    learner_trap_vi: "Remediation không phải sửa nội dung chuyên môn, chỉ là sửa đường học.",
    learner_trap_en: "Remediation is not expert-content editing; it is path repair.",
    canada_practical: "Tình huống sửa đường học có thể xảy ra ở trường, nơi làm, hoặc quầy dịch vụ Canada.",
  },
  {
    id: "seal-native-review",
    area: "deferred_native_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੂਲ-ਬੋਲਣ ਸਮੀਖਿਆ ਮੁਲਤਵੀ",
    romanization: "mool-bolan samikhia multavi",
    title_vi: "Native review hoãn",
    title_en: "Deferred native review",
    seal_question_vi: "Có tránh claim đã native-reviewed chưa?",
    seal_question_en: "Does the set avoid claiming completed native review?",
    expected_evidence_vi: "Scope nói rõ native review deferred và không claim đã duyệt bản ngữ.",
    expected_evidence_en: "The scope says native review is deferred and does not claim native approval.",
    sample: { gurmukhi: "ਸਮੀਖਿਆ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "samikhia aje baki hai.", vi: "Review vẫn còn đang chờ.", en: "Review is still pending." },
    modules_checked: ["finalPreA11Seal", "finalPreIntegrationSummary", "finalQaInventory", "finalModuleRegistry"],
    checkpoint_vi: "Seal pass không được viết thành native-reviewed.",
    checkpoint_en: "A passing seal must not be written as native-reviewed.",
    learner_trap_vi: "Ready không đồng nghĩa đã có kiểm duyệt bản ngữ.",
    learner_trap_en: "Ready does not mean native review is done.",
  },
  {
    id: "seal-forbidden-claims",
    area: "forbidden_claims",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਪਸੰਦ ਦਾਅਵੇ",
    romanization: "napasand daave",
    title_vi: "Khẳng định bị cấm",
    title_en: "Forbidden claims",
    seal_question_vi: "Artifact có tránh các claim bị cấm không?",
    seal_question_en: "Does the artifact avoid forbidden claims?",
    expected_evidence_vi: "Không có audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
    expected_evidence_en: "There is no audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
    sample: { gurmukhi: "ਇਹ ਸਿਰਫ਼ ਭਾਸ਼ਾ ਡਾਟਾ ਹੈ।", romanization: "ih sirf bhasha data hai.", vi: "Đây chỉ là dữ liệu ngôn ngữ.", en: "This is language data only." },
    modules_checked: ["finalPreA11Seal", "finalPreIntegrationSummary", "finalQaInventory"],
    checkpoint_vi: "Không thêm claim ngoài phạm vi seal.",
    checkpoint_en: "Do not add claims outside the seal scope.",
    learner_trap_vi: "Không được dùng seal để ngụ ý tích hợp A11.",
    learner_trap_en: "Do not use the seal to imply A11 integration.",
  },
];

export const PUNJABI_FINAL_PRE_A11_SEAL_ITEMS: ReadonlyArray<PunjabiFinalPreA11SealItem> =
  PUNJABI_FINAL_PRE_A11_SEAL;

export const punjabiFinalPreA11Seal = PUNJABI_FINAL_PRE_A11_SEAL;

export default punjabiFinalPreA11Seal;
