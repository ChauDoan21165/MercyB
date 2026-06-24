// src/languages/punjabi/finalPreA11AuditTrail.ts
//
// Wave 63 final pre-A11 audit trail for Punjabi.
// This is app-consumable readiness data only. It does not perform A11 integration.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiFinalPreA11AuditTrailArea =
  | "module_family_to_level_trace"
  | "skill_coverage_trace"
  | "gurmukhi_script_trace"
  | "canada_domain_trace"
  | "remediation_trace"
  | "bilingual_support_trace"
  | "pre_a11_evidence_chain"
  | "import_export_boundary"
  | "deferred_native_review"
  | "forbidden_claims";

export type PunjabiFinalPreA11AuditTrailStatus =
  | "strict_ready_for_a11"
  | "pre_a11_audit_trail"
  | "traceability"
  | "evidence_receipt"
  | "pre_integration";

export type PunjabiFinalPreA11AuditTrailEntry = {
  id: string;
  area: PunjabiFinalPreA11AuditTrailArea;
  status: PunjabiFinalPreA11AuditTrailStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  audit_vi: string;
  audit_en: string;
  evidence_refs: string[];
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  must_not_claim_vi?: string;
  must_not_claim_en?: string;
};

export const PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE = {
  wave: "Wave 63",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  strict_ready_for_a11: true,
  ready_for_a11_label: "READY_FOR_A11=true",
  not_a11_integration: true,
  purpose_vi:
    "Audit trail này ghi strict READY_FOR_A11=true cho handoff sau này; nó không nối route, registry, UI hoặc runtime.",
  purpose_en:
    "This audit trail records strict READY_FOR_A11=true for later handoff; it does not wire routes, registries, UI, or runtime.",
  script_policy_vi:
    "Gurmukhi là chữ chính. Romanization hỗ trợ đọc. Shahmukhi chỉ là nhận biết, không phải khóa học đầy đủ.",
  script_policy_en:
    "Gurmukhi is primary. Romanization supports reading. Shahmukhi is awareness only, not a full course.",
  native_review_vi:
    "Native review được hoãn; audit trail này không tuyên bố đã được kiểm duyệt bản ngữ.",
  native_review_en:
    "Native review is deferred; this audit trail does not claim completed native review.",
  excluded_vi:
    "Không tạo audio, không chấm điểm phát âm, không Azure, auth, billing, RLS, Supabase, CI config, push, deploy hoặc .local.",
  excluded_en:
    "No audio creation, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI config, push, deploy, or .local.",
} as const;

export const PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_AREAS: PunjabiFinalPreA11AuditTrailArea[] = [
  "module_family_to_level_trace",
  "skill_coverage_trace",
  "gurmukhi_script_trace",
  "canada_domain_trace",
  "remediation_trace",
  "bilingual_support_trace",
  "pre_a11_evidence_chain",
  "import_export_boundary",
  "deferred_native_review",
  "forbidden_claims",
];

export const PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL: PunjabiFinalPreA11AuditTrailEntry[] = [
  {
    id: "audit-trail-module-family-to-level-trace",
    area: "module_family_to_level_trace",
    status: "strict_ready_for_a11",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਪਰਿਵਾਰ ਤੋਂ ਪੱਧਰ ਆਡਿਟ",
    romanization: "module parivaar ton padar audit",
    title_vi: "Audit họ module đến cấp độ",
    title_en: "Module-family to level audit",
    audit_vi:
      "Ghi audit trail cho courseMap, learningPath, progressionMatrix, masteryCheckpoints và contentIndex qua A1-C2 trước later A11.",
    audit_en:
      "Records the audit trail for courseMap, learningPath, progressionMatrix, masteryCheckpoints, and contentIndex across A1-C2 before later A11.",
    evidence_refs: [
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "contentIndex",
    ],
    sample: {
      gurmukhi: "ਸਾਰੇ ਪੱਧਰ ਆਡਿਟ ਟ੍ਰੇਲ ਵਿੱਚ ਹਨ।",
      romanization: "sare padar audit trail vich han",
      vi: "Tất cả cấp độ nằm trong audit trail.",
      en: "All levels are in the audit trail.",
    },
    learner_trap_vi: "Audit trail không có nghĩa A11 integration đã chạy.",
    learner_trap_en: "The audit trail does not mean A11 integration has run.",
  },
  {
    id: "audit-trail-skill-coverage-trace",
    area: "skill_coverage_trace",
    status: "traceability",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਸਕਿਲ ਕਵਰੇਜ ਆਡਿਟ",
    romanization: "skill coverage audit",
    title_vi: "Audit coverage kỹ năng",
    title_en: "Skill coverage audit",
    audit_vi:
      "Trace listening-free content data cho reading, writing, grammar, vocabulary, dialogue, discourse và academic skills mà không tạo audio.",
    audit_en:
      "Traces listening-free content data for reading, writing, grammar, vocabulary, dialogue, discourse, and academic skills without creating audio.",
    evidence_refs: [
      "finalCanDoIndex",
      "finalCoverageVerificationPack",
      "finalModuleRegistry",
    ],
    sample: {
      gurmukhi: "ਸਕਿਲ ਕਵਰੇਜ ਡਾਟਾ ਵਜੋਂ ਤਿਆਰ ਹੈ।",
      romanization: "skill coverage data vajon tiar hai",
      vi: "Coverage kỹ năng sẵn sàng dưới dạng dữ liệu.",
      en: "Skill coverage is ready as data.",
    },
  },
  {
    id: "audit-trail-gurmukhi-script-trace",
    area: "gurmukhi_script_trace",
    status: "pre_a11_audit_trail",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਸਕ੍ਰਿਪਟ ਆਡਿਟ",
    romanization: "Gurmukhi script audit",
    title_vi: "Audit chữ Gurmukhi",
    title_en: "Gurmukhi script audit",
    audit_vi:
      "Confirms Gurmukhi primary, romanization support và Shahmukhi awareness-only note; Shahmukhi không phải full course.",
    audit_en:
      "Confirms Gurmukhi primary, romanization support, and Shahmukhi awareness-only note; Shahmukhi is not a full course.",
    evidence_refs: ["lessons", "lessonsA1", "gurmukhiReadingLadder", "scriptBasics"],
    sample: {
      gurmukhi: "ਗੁਰਮੁਖੀ ਮੁੱਖ ਲਿਪੀ ਹੈ।",
      romanization: "Gurmukhi mukh lipi hai",
      vi: "Gurmukhi là chữ chính.",
      en: "Gurmukhi is the primary script.",
    },
    learner_trap_vi: "Romanization hỗ trợ đọc, nhưng không thay thế Gurmukhi.",
    learner_trap_en: "Romanization supports reading, but it does not replace Gurmukhi.",
  },
  {
    id: "audit-trail-canada-domain-trace",
    area: "canada_domain_trace",
    status: "evidence_receipt",
    levels: ["A1", "A2", "B1", "B2"],
    title_pa: "ਕੈਨੇਡਾ ਡੋਮੇਨ ਆਡਿਟ",
    romanization: "Canada domain audit",
    title_vi: "Audit domain Canada",
    title_en: "Canada domain audit",
    audit_vi:
      "Records evidence for clinic, school, workplace, housing, transit, banking và public service situations for practical Canada use.",
    audit_en:
      "Records evidence for clinic, school, workplace, housing, transit, banking, and public service situations for practical Canada use.",
    evidence_refs: ["canadaSurvivalProofPack", "healthcareCanada", "publicServicesCanada"],
    sample: {
      gurmukhi: "ਮੈਂ ਸਰਵਿਸ ਕੈਨੇਡਾ ਵਿੱਚ ਮਦਦ ਮੰਗਦਾ ਹਾਂ।",
      romanization: "main Service Canada vich madad mangda han",
      vi: "Tôi xin giúp đỡ ở Service Canada.",
      en: "I ask for help at Service Canada.",
    },
    canada_practical_vi: "Dùng cho clinic desk, school office, landlord, workplace form hoặc service counter.",
    canada_practical_en:
      "Use for a clinic desk, school office, landlord, workplace form, or service counter.",
  },
  {
    id: "audit-trail-remediation-trace",
    area: "remediation_trace",
    status: "traceability",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਰੀਮੀਡੀਏਸ਼ਨ ਆਡਿਟ",
    romanization: "remediation audit",
    title_vi: "Audit remediation",
    title_en: "Remediation audit",
    audit_vi:
      "Traces repair coverage for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, register và discourse repair.",
    audit_en:
      "Traces repair coverage for Gurmukhi confusion, romanization dependence, postpositions, agreement, word order, register, and discourse repair.",
    evidence_refs: ["learnerErrorPatterns", "remediationBank", "masteryCheckpoints"],
    sample: {
      gurmukhi: "ਗਲਤੀ ਲਈ ਰੀਪੇਅਰ ਰਾਹ ਆਡਿਟ ਵਿੱਚ ਹੈ।",
      romanization: "galti lai repair rah audit vich hai",
      vi: "Đường sửa lỗi nằm trong audit.",
      en: "The repair path is in the audit.",
    },
    learner_trap_vi: "Common trap: chỉ đưa câu đúng mà không ghi tín hiệu lỗi.",
    learner_trap_en: "Common trap: giving only the correct sentence without recording the error signal.",
  },
  {
    id: "audit-trail-bilingual-support-trace",
    area: "bilingual_support_trace",
    status: "pre_a11_audit_trail",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੁਭਾਸ਼ੀ ਸਹਾਇਤਾ ਆਡਿਟ",
    romanization: "dubhashi sahaita audit",
    title_vi: "Audit hỗ trợ song ngữ",
    title_en: "Bilingual support audit",
    audit_vi:
      "Verifies Vietnamese explanations, English explanations, Gurmukhi examples và romanization fields are present in major pre-A11 artifacts.",
    audit_en:
      "Verifies Vietnamese explanations, English explanations, Gurmukhi examples, and romanization fields are present in major pre-A11 artifacts.",
    evidence_refs: ["finalCanDoIndex", "finalPreA11TraceabilityMatrix", "finalPreA11EvidenceReceipt"],
    sample: {
      gurmukhi: "ਵਿਆਖਿਆ ਵੀਅਤਨਾਮੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਹੈ।",
      romanization: "viakhia Vietnamese ate English vich hai",
      vi: "Giải thích có tiếng Việt và tiếng Anh.",
      en: "The explanation is in Vietnamese and English.",
    },
  },
  {
    id: "audit-trail-pre-a11-evidence-chain",
    area: "pre_a11_evidence_chain",
    status: "evidence_receipt",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪ੍ਰੀ-A11 ਏਵੀਡੈਂਸ ਚੇਨ",
    romanization: "pre-A11 evidence chain",
    title_vi: "Chuỗi evidence pre-A11",
    title_en: "Pre-A11 evidence chain",
    audit_vi:
      "Links pre-A11 audit trail, traceability, evidence receipt, completion record, inventory seal, catalog và bundle manifest as data evidence only.",
    audit_en:
      "Links pre-A11 audit trail, traceability, evidence receipt, completion record, inventory seal, catalog, and bundle manifest as data evidence only.",
    evidence_refs: [
      "finalPreA11TraceabilityMatrix",
      "finalPreA11EvidenceReceipt",
      "finalPreA11CompletionRecord",
      "finalPreA11InventorySeal",
      "finalPreA11BundleManifest",
    ],
    sample: {
      gurmukhi: "ਏਵੀਡੈਂਸ ਚੇਨ ਡਾਟਾ ਵਿੱਚ ਹੈ।",
      romanization: "evidence chain data vich hai",
      vi: "Chuỗi evidence nằm trong dữ liệu.",
      en: "The evidence chain is in the data.",
    },
  },
  {
    id: "audit-trail-import-export-boundary",
    area: "import_export_boundary",
    status: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇੰਪੋਰਟ ਐਕਸਪੋਰਟ ਬਾਊਂਡਰੀ",
    romanization: "import export boundary",
    title_vi: "Boundary import/export",
    title_en: "Import/export boundary",
    audit_vi:
      "Confirms named exports, default root, item aliases và helper filters are ready for later import without editing registry or runtime integration.",
    audit_en:
      "Confirms named exports, default root, item aliases, and helper filters are ready for later import without editing registry or runtime integration.",
    evidence_refs: ["finalImportReadinessMap", "finalExportReadiness", "finalModuleRegistry"],
    sample: {
      gurmukhi: "ਡਾਟਾ ਇੰਪੋਰਟ ਲਈ ਤਿਆਰ ਹੈ।",
      romanization: "data import lai tiar hai",
      vi: "Dữ liệu sẵn sàng để import.",
      en: "The data is ready to import.",
    },
    learner_trap_vi: "Pre-integration readiness không có nghĩa đã nối registry.",
    learner_trap_en: "Pre-integration readiness does not mean the registry has been wired.",
  },
  {
    id: "audit-trail-deferred-native-review",
    area: "deferred_native_review",
    status: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਨੇਟਿਵ ਰਿਵਿਊ ਮੁਲਤਵੀ ਆਡਿਟ",
    romanization: "native review multavi audit",
    title_vi: "Audit native review được hoãn",
    title_en: "Deferred native review audit",
    audit_vi:
      "Records that native review is deferred; strict READY_FOR_A11=true is technical readiness, not a completed native-review claim.",
    audit_en:
      "Records that native review is deferred; strict READY_FOR_A11=true is technical readiness, not a completed native-review claim.",
    evidence_refs: ["finalOwnerReviewPacket", "finalPreA11Signoff", "finalPreA11TraceabilityMatrix"],
    sample: {
      gurmukhi: "ਨੇਟਿਵ ਰਿਵਿਊ ਬਾਅਦ ਲਈ ਹੈ।",
      romanization: "native review baad lai hai",
      vi: "Native review để giai đoạn sau.",
      en: "Native review is for a later stage.",
    },
    must_not_claim_vi: "Không claim native reviewed hoặc native-approved.",
    must_not_claim_en: "Do not claim native reviewed or native-approved.",
  },
  {
    id: "audit-trail-forbidden-claims",
    area: "forbidden_claims",
    status: "pre_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮਨ੍ਹਾ ਦਾਅਵੇ ਆਡਿਟ",
    romanization: "manha daave audit",
    title_vi: "Audit claim bị cấm",
    title_en: "Forbidden claims audit",
    audit_vi:
      "Records forbidden claims: do not claim A11 has run, do not claim native reviewed, and do not claim push, deploy, audio, Azure, Supabase or .local work.",
    audit_en:
      "Records forbidden claims: do not claim A11 has run, do not claim native reviewed, and do not claim push, deploy, audio, Azure, Supabase, or .local work.",
    evidence_refs: ["finalIntegrationGuardrails", "finalGoNoGoChecklist", "finalPreA11Seal"],
    sample: {
      gurmukhi: "ਇਹ ਸਿਰਫ਼ ਆਡਿਟ ਟ੍ਰੇਲ ਹੈ।",
      romanization: "ih sirf audit trail hai",
      vi: "Đây chỉ là audit trail.",
      en: "This is only an audit trail.",
    },
    must_not_claim_vi: "Không claim đã chạy A11, đã push, đã deploy, hoặc đã review bản ngữ.",
    must_not_claim_en: "Do not claim A11 has run, pushed, deployed, or completed native review.",
  },
];

export const PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROUTES = [
  {
    id: "audit-trail-readiness-route",
    vi: "Route dữ liệu cho strict READY_FOR_A11=true, module family, skill coverage và pre-A11 evidence chain.",
    en: "Data route for strict READY_FOR_A11=true, module family, skill coverage, and the pre-A11 evidence chain.",
    entry_ids: [
      "audit-trail-module-family-to-level-trace",
      "audit-trail-skill-coverage-trace",
      "audit-trail-pre-a11-evidence-chain",
    ],
  },
  {
    id: "audit-trail-coverage-route",
    vi: "Route dữ liệu cho Gurmukhi, Canada, remediation và bilingual support.",
    en: "Data route for Gurmukhi, Canada, remediation, and bilingual support.",
    entry_ids: [
      "audit-trail-gurmukhi-script-trace",
      "audit-trail-canada-domain-trace",
      "audit-trail-remediation-trace",
      "audit-trail-bilingual-support-trace",
    ],
  },
  {
    id: "audit-trail-boundary-route",
    vi: "Route dữ liệu cho import/export boundary, native review deferred và forbidden claims.",
    en: "Data route for import/export boundary, deferred native review, and forbidden claims.",
    entry_ids: [
      "audit-trail-import-export-boundary",
      "audit-trail-deferred-native-review",
      "audit-trail-forbidden-claims",
    ],
  },
] as const;

export const PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROOT = {
  scope: PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE,
  areas: PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_AREAS,
  entries: PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL,
  routes: PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROUTES,
} as const;

export const PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ITEMS =
  PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL;

export const punjabiFinalPreA11AuditTrailByArea = (
  area: PunjabiFinalPreA11AuditTrailArea,
) => PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.filter((entry) => entry.area === area);

export default PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROOT;
