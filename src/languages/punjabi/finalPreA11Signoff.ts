// src/languages/punjabi/finalPreA11Signoff.ts
//
// Wave 53 final pre-A11 signoff for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11SignoffArea =
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

export type PunjabiFinalPreA11SignoffStatus =
  | "signed_for_later_a11"
  | "manual_review_needed"
  | "deferred_boundary";

export type PunjabiFinalPreA11SignoffItem = {
  id: string;
  area: PunjabiFinalPreA11SignoffArea;
  status: PunjabiFinalPreA11SignoffStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  signoff_vi: string;
  signoff_en: string;
  evidence_vi: string;
  evidence_en: string;
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  checked_modules: string[];
  signoff_tags: string[];
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE = {
  wave: "Wave 53",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  not_a11_integration: true,
  purpose_vi:
    "Final pre-A11 signoff này chỉ khóa trạng thái readiness cho later A11; nó không nối route, registry, UI hay runtime.",
  purpose_en:
    "This final pre-A11 signoff only records readiness for later A11; it does not wire routes, registries, UI, or runtime.",
  script_note_vi:
    "Gurmukhi là chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa học đầy đủ.",
  script_note_en:
    "Gurmukhi is the primary script. Shahmukhi is awareness-only, not a full course.",
  native_review_vi:
    "Native review được hoãn; artifact này không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this artifact does not claim completed native review.",
  excluded_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE_ALIAS =
  PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE;

export const PUNJABI_FINAL_PRE_A11_SIGNOFF_AREAS: PunjabiFinalPreA11SignoffArea[] = [
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

export const PUNJABI_FINAL_PRE_A11_SIGNOFF: PunjabiFinalPreA11SignoffItem[] = [
  {
    id: "signoff-module-family-completeness",
    area: "module_family_completeness",
    status: "signed_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਸਾਈਨਆਫ",
    romanization: "module parivaar signoff",
    title_vi: "Signoff độ đầy đủ của họ module",
    title_en: "Module-family completeness signoff",
    signoff_vi:
      "Ký nháy khi course map, learning path, progression, checkpoints, QA, manifest, navigation, readiness evidence và pre-A11 seal đã cùng một family.",
    signoff_en:
      "Sign off when course map, learning path, progression, checkpoints, QA, manifest, navigation, readiness evidence, and pre-A11 seal are one module family.",
    evidence_vi:
      "Các file family đã có dữ liệu TypeScript dùng được bởi app, không phải ghi chú rời.",
    evidence_en:
      "The family files contain app-consumable TypeScript data, not loose notes.",
    sample: {
      gurmukhi: "ਪੰਜਾਬੀ ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਤਿਆਰ ਹੈ।",
      romanization: "Punjabi module parivaar tiar hai",
      vi: "Họ module Punjabi đã sẵn sàng.",
      en: "The Punjabi module family is ready.",
    },
    checked_modules: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "finalQaInventory",
      "finalContentManifest",
      "finalNavigationMap",
      "finalIntegrationEvidenceMap",
      "finalPreA11Seal",
    ],
    signoff_tags: ["module-family", "pre-a11-signoff", "final-pre-a11-seal"],
    learner_trap_vi: "Signoff module family không có nghĩa A11 đã được tích hợp.",
    learner_trap_en: "Module-family signoff does not mean A11 has been integrated.",
  },
  {
    id: "signoff-import-export-expectations",
    area: "import_export_expectations",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਸਾਈਨਆਫ",
    romanization: "import export signoff",
    title_vi: "Signoff import/export",
    title_en: "Import/export expectations",
    signoff_vi:
      "Ký nháy khi named export, default export, item aliases và root object có tên ổn định cho later A11.",
    signoff_en:
      "Sign off when named exports, default export, item aliases, and root object have stable names for later A11.",
    evidence_vi: "Dữ liệu có thể import trực tiếp, không cần parse note thủ công.",
    evidence_en: "The data can be imported directly without parsing manual notes.",
    sample: {
      gurmukhi: "ਡਾਟਾ ਸਿੱਧਾ ਇੰਪੋਰਟ ਹੁੰਦਾ ਹੈ।",
      romanization: "data sidha import hunda hai",
      vi: "Dữ liệu được import trực tiếp.",
      en: "The data imports directly.",
    },
    checked_modules: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    signoff_tags: ["import", "export", "typescript-data", "pre-integration"],
    learner_trap_vi: "Tên label đẹp không thay thế được export identifier ổn định.",
    learner_trap_en: "A friendly label does not replace a stable export identifier.",
  },
  {
    id: "signoff-naming-consistency",
    area: "naming_consistency",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨਾਂ ਇਕਸਾਰਤਾ ਸਾਈਨਆਫ",
    romanization: "naam iksarta signoff",
    title_vi: "Signoff nhất quán tên gọi",
    title_en: "Naming consistency",
    signoff_vi:
      "Ký nháy khi file, export, id, route label và checklist label dùng cùng pattern Punjabi final pre-A11.",
    signoff_en:
      "Sign off when files, exports, ids, route labels, and checklist labels use the same Punjabi final pre-A11 pattern.",
    evidence_vi: "Tên không bị drift giữa snapshot, closure, checksum, seal và signoff.",
    evidence_en: "Names do not drift across snapshot, closure, checksum, seal, and signoff.",
    sample: {
      gurmukhi: "ਨਾਂ ਇਕੋ ਜਿਹਾ ਰੱਖੋ।",
      romanization: "naam iko jiha rakho",
      vi: "Giữ tên gọi nhất quán.",
      en: "Keep names consistent.",
    },
    checked_modules: [
      "finalPreA11Snapshot",
      "finalPreA11ClosurePacket",
      "finalPreA11Checksum",
      "finalPreA11Seal",
    ],
    signoff_tags: ["naming", "consistency", "pre-a11-signoff"],
    learner_trap_vi: "Tên gần giống có thể làm later A11 import nhầm artifact.",
    learner_trap_en: "Nearly matching names can make later A11 import the wrong artifact.",
  },
  {
    id: "signoff-duplicate-id-risk",
    area: "duplicate_id_risk",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਡੁਪਲੀਕੇਟ ID ਜੋਖਮ ਸਾਈਨਆਫ",
    romanization: "duplicate ID jokhim signoff",
    title_vi: "Signoff rủi ro trùng ID",
    title_en: "Duplicate-ID risk",
    signoff_vi:
      "Ký nháy khi item id, route id, module id và checklist id đều có chủ sở hữu rõ.",
    signoff_en:
      "Sign off when item ids, route ids, module ids, and checklist ids all have clear ownership.",
    evidence_vi: "Test có thể quét duplicate trong mảng signoff trước khi later A11 dùng dữ liệu.",
    evidence_en: "The test can scan duplicate ids in the signoff array before later A11 uses the data.",
    sample: {
      gurmukhi: "ਹਰ ID ਵੱਖਰਾ ਹੈ।",
      romanization: "har ID vakhra hai",
      vi: "Mỗi ID là riêng.",
      en: "Each ID is distinct.",
    },
    checked_modules: ["finalModuleRegistry", "finalContentManifest", "finalGoNoGoChecklist"],
    signoff_tags: ["duplicate-id", "registry-risk", "pre-a11-signoff"],
    learner_trap_vi: "Cùng topic không nhất thiết trùng; phải so toàn bộ id.",
    learner_trap_en: "The same topic is not necessarily a duplicate; compare the full id.",
  },
  {
    id: "signoff-a1-c2-coverage",
    area: "a1_c2_coverage",
    status: "signed_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "A1 ਤੋਂ C2 ਸਾਈਨਆਫ",
    romanization: "A1 ton C2 signoff",
    title_vi: "Signoff độ phủ A1-C2",
    title_en: "A1-C2 coverage",
    signoff_vi:
      "Ký nháy khi A1-C2 có trace trong course map, can-do, progression, checkpoints, QA và remediation.",
    signoff_en:
      "Sign off when A1-C2 has traceability in course map, can-do, progression, checkpoints, QA, and remediation.",
    evidence_vi: "Mỗi level có dấu vết học và dấu vết review cho Vietnamese và English learners.",
    evidence_en: "Each level has learning traces and review traces for Vietnamese and English learners.",
    sample: {
      gurmukhi: "ਹਰ ਪੱਧਰ ਲਈ ਰਾਹ ਹੈ।",
      romanization: "har padhar lai raah hai",
      vi: "Mỗi cấp đều có lộ trình.",
      en: "Every level has a path.",
    },
    checked_modules: ["courseMap", "finalCanDoIndex", "progressionMatrix", "masteryCheckpoints"],
    signoff_tags: ["a1-c2", "coverage", "learner-route"],
    learner_trap_vi: "A1-C2 coverage không phải claim chứng chỉ chính thức.",
    learner_trap_en: "A1-C2 coverage is not an official certification claim.",
  },
  {
    id: "signoff-gurmukhi-script-coverage",
    area: "gurmukhi_script_coverage",
    status: "signed_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਗੁਰਮੁਖੀ ਲਿਪੀ ਸਾਈਨਆਫ",
    romanization: "Gurmukhi lipi signoff",
    title_vi: "Signoff chữ Gurmukhi",
    title_en: "Gurmukhi script coverage",
    signoff_vi:
      "Ký nháy khi title, sample, learner trap và Canada-practical lines giữ Gurmukhi là chính.",
    signoff_en:
      "Sign off when titles, samples, learner traps, and Canada-practical lines keep Gurmukhi primary.",
    evidence_vi: "Romanization hỗ trợ đọc, nhưng không thay thế Gurmukhi.",
    evidence_en: "Romanization supports reading but does not replace Gurmukhi.",
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ ਆਉਂਦੀ ਹੈ।",
      romanization: "Gurmukhi pehlan aundi hai",
      vi: "Gurmukhi xuất hiện trước.",
      en: "Gurmukhi comes first.",
    },
    checked_modules: ["lessons", "dialogues", "finalCanDoIndex", "finalPreIntegrationSummary"],
    signoff_tags: ["gurmukhi-primary", "script-awareness", "shahmukhi-awareness-only"],
    learner_trap_vi: "Romanization có thể làm người học bỏ qua bật hơi và retroflex.",
    learner_trap_en: "Romanization can make learners miss aspiration and retroflex contrasts.",
  },
  {
    id: "signoff-canada-survival-coverage",
    area: "canada_survival_coverage",
    status: "manual_review_needed",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    title_pa: "ਕੈਨੇਡਾ ਸਰਵਾਈਵਲ ਸਾਈਨਆਫ",
    romanization: "Canada survival signoff",
    title_vi: "Signoff survival Canada",
    title_en: "Canada survival coverage",
    signoff_vi:
      "Ký nháy khi nội dung có tình huống clinic, school, workplace, housing, transit và public service ở Canada.",
    signoff_en:
      "Sign off when content includes Canada scenarios for clinics, schools, workplaces, housing, transit, and public service.",
    evidence_vi: "Ví dụ là language practice, không phải tư vấn pháp lý, y tế hay định cư.",
    evidence_en: "Examples are language practice, not legal, medical, or immigration advice.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਕਲਿਨਿਕ ਦਾ ਪਤਾ ਚਾਹੀਦਾ ਹੈ।",
      romanization: "mainu clinic da pata chahida hai",
      vi: "Tôi cần địa chỉ phòng khám.",
      en: "I need the clinic address.",
    },
    checked_modules: ["dialogues", "learningPath", "finalCanDoIndex", "finalNavigationMap"],
    signoff_tags: ["canada", "clinic", "school", "workplace", "housing", "public-service"],
    canada_practical:
      "Clinic intake, school office forms, workplace schedule changes, rental notices, transit help, and city service desks in Canada.",
    learner_trap_vi: "Survival phrase không được biến thành lời khuyên chuyên môn.",
    learner_trap_en: "A survival phrase must not become professional advice.",
  },
  {
    id: "signoff-remediation-coverage",
    area: "remediation_coverage",
    status: "signed_for_later_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੁਰੰਮਤ ਰਾਹ ਸਾਈਨਆਫ",
    romanization: "murammat raah signoff",
    title_vi: "Signoff đường remediation",
    title_en: "Remediation coverage",
    signoff_vi:
      "Ký nháy khi common learner traps có repair path, review checkpoint và ví dụ sửa lỗi.",
    signoff_en:
      "Sign off when common learner traps have repair paths, review checkpoints, and correction examples.",
    evidence_vi: "Remediation gồm script confusion, romanization overuse, word order, postpositions và Canada form-reading.",
    evidence_en: "Remediation covers script confusion, romanization overuse, word order, postpositions, and Canada form-reading.",
    sample: {
      gurmukhi: "ਮੈਨੂੰ ਫਿਰ ਸਮਝਾਓ ਜੀ।",
      romanization: "mainu phir samjhao ji",
      vi: "Vui lòng giải thích lại cho tôi.",
      en: "Please explain it to me again.",
    },
    checked_modules: ["finalQaInventory", "masteryCheckpoints", "finalCanDoIndex", "finalQualityGates"],
    signoff_tags: ["remediation", "repair-path", "review", "learner-traps"],
    learner_trap_vi: "Repair path là sửa đường học, không phải claim native review.",
    learner_trap_en: "A repair path fixes the learning route; it does not claim native review.",
    canada_practical: "Người học có thể dùng repair phrase khi hỏi lại ở trường, nơi làm, hoặc quầy dịch vụ Canada.",
  },
  {
    id: "signoff-deferred-native-review",
    area: "deferred_native_review",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੂਲ ਸਮੀਖਿਆ ਮੁਲਤਵੀ ਸਾਈਨਆਫ",
    romanization: "mool samikhia multavi signoff",
    title_vi: "Signoff native review hoãn",
    title_en: "Deferred native review",
    signoff_vi:
      "Ký nháy boundary rằng native review is deferred và chưa có claim hoàn tất.",
    signoff_en:
      "Sign off the boundary that native review is deferred and no completion claim is made.",
    evidence_vi: "Artifact chỉ nói readiness trước later A11; native review nằm ở bước sau.",
    evidence_en: "The artifact only states readiness before later A11; native review remains a later step.",
    sample: {
      gurmukhi: "ਸਮੀਖਿਆ ਅਜੇ ਬਾਕੀ ਹੈ।",
      romanization: "samikhia aje baki hai",
      vi: "Review vẫn còn lại.",
      en: "Review is still pending.",
    },
    checked_modules: ["finalPreA11Snapshot", "finalPreA11ClosurePacket", "finalPreA11Seal"],
    signoff_tags: ["native-review-deferred", "boundary", "pre-a11-signoff"],
    must_not_claim_vi: "Không nói đã được native review hoặc được người bản ngữ duyệt.",
    must_not_claim_en: "Do not say completed native review or native approval.",
    learner_trap_vi: "Ready for later A11 không đồng nghĩa review bản ngữ đã xong.",
    learner_trap_en: "Ready for later A11 does not mean native review is done.",
  },
  {
    id: "signoff-forbidden-claims",
    area: "forbidden_claims",
    status: "deferred_boundary",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨਾਹੀ ਦਾਅਵੇ ਸਾਈਨਆਫ",
    romanization: "manahi daave signoff",
    title_vi: "Signoff claim bị cấm",
    title_en: "Forbidden claims",
    signoff_vi:
      "Ký nháy rằng artifact không thêm audio, scoring, infra, auth, billing, RLS, Supabase, push, deploy, .local hay A11 integration.",
    signoff_en:
      "Sign off that the artifact adds no audio, scoring, infrastructure, auth, billing, RLS, Supabase, push, deploy, .local, or A11 integration.",
    evidence_vi: "Phạm vi là dữ liệu TypeScript cho content signoff, không phải thay đổi hệ thống.",
    evidence_en: "The scope is TypeScript data for content signoff, not system changes.",
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਸਾਈਨਆਫ ਡਾਟਾ ਹੈ।",
      romanization: "ih sirf signoff data hai",
      vi: "Đây chỉ là dữ liệu signoff.",
      en: "This is signoff data only.",
    },
    checked_modules: ["finalPreA11Seal", "finalPreA11Snapshot", "finalGoNoGoChecklist"],
    signoff_tags: ["forbidden-claims", "no-a11-integration", "no-push", "no-deploy"],
    must_not_claim_vi:
      "Không claim native review, official certification, A11 integration, push, deploy hoặc production readiness.",
    must_not_claim_en:
      "Do not claim native review, official certification, A11 integration, push, deploy, or production readiness.",
    learner_trap_vi: "Một signoff pass không được hiểu là deploy-ready.",
    learner_trap_en: "A passing signoff must not be read as deploy-ready.",
  },
];

export const PUNJABI_FINAL_PRE_A11_SIGNOFF_ITEMS: ReadonlyArray<PunjabiFinalPreA11SignoffItem> =
  PUNJABI_FINAL_PRE_A11_SIGNOFF;

export const PUNJABI_FINAL_PRE_A11_SIGNOFF_ROUTES = [
  {
    id: "signoff-readiness-route",
    vi: "Route readiness cho module-family, import/export, naming và duplicate-ID.",
    en: "Readiness route for module-family, import/export, naming, and duplicate-ID.",
    item_ids: [
      "signoff-module-family-completeness",
      "signoff-import-export-expectations",
      "signoff-naming-consistency",
      "signoff-duplicate-id-risk",
    ],
  },
  {
    id: "signoff-coverage-route",
    vi: "Route coverage cho A1-C2, Gurmukhi, Canada survival và remediation.",
    en: "Coverage route for A1-C2, Gurmukhi, Canada survival, and remediation.",
    item_ids: [
      "signoff-a1-c2-coverage",
      "signoff-gurmukhi-script-coverage",
      "signoff-canada-survival-coverage",
      "signoff-remediation-coverage",
    ],
  },
  {
    id: "signoff-boundary-route",
    vi: "Route boundary cho native review deferred và forbidden claims.",
    en: "Boundary route for deferred native review and forbidden claims.",
    item_ids: ["signoff-deferred-native-review", "signoff-forbidden-claims"],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_SIGNOFF_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE,
  scope_alias: PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE_ALIAS,
  areas: PUNJABI_FINAL_PRE_A11_SIGNOFF_AREAS,
  items: PUNJABI_FINAL_PRE_A11_SIGNOFF,
  routes: PUNJABI_FINAL_PRE_A11_SIGNOFF_ROUTES,
};

export const punjabiFinalPreA11Signoff = PUNJABI_FINAL_PRE_A11_SIGNOFF_ROOT;

export default punjabiFinalPreA11Signoff;
