// src/languages/punjabi/integrationReadinessChecklist.ts
//
// Punjabi readiness checklist for later A11 integration. This is data only:
// no A11 execution, no infrastructure work, no audio, and no native-review
// claim. Gurmukhi is primary; romanization is a learning aid.

import type { PunjabiCefrLevel } from "./lessons";

export type PunjabiReadinessArea =
  | "module_coverage"
  | "level_coverage"
  | "script_path"
  | "bilingual_support"
  | "canada_survival"
  | "workplace"
  | "healthcare"
  | "public_service"
  | "review_remediation"
  | "scope_honesty";

export type PunjabiReadinessStatus = "ready_for_later_integration" | "deferred" | "blocked_out_of_scope";

export type PunjabiReadinessChecklistItem = {
  id: string;
  area: PunjabiReadinessArea;
  status: PunjabiReadinessStatus;
  levels: PunjabiCefrLevel[];
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  check_vi: string;
  check_en: string;
  evidence_modules: string[];
  sample: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  learner_trap_vi?: string;
  learner_trap_en?: string;
  canada_practical?: boolean;
};

export const PUNJABI_INTEGRATION_SCOPE = {
  agent: "A1 Punjabi Foundation / Dialogue / Course Map",
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  integration_note_vi:
    "Checklist này chỉ chuẩn bị dữ liệu cho A11 sau này; không chạy A11 integration trong Wave 9.",
  integration_note_en:
    "This checklist only prepares data for later A11 work; Wave 9 does not run A11 integration.",
  shahmukhi_vi:
    "Shahmukhi chỉ được nhắc để nhận biết hệ chữ khác; không phải khóa học đầy đủ.",
  shahmukhi_en:
    "Shahmukhi is awareness-only as another script; it is not a full course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  forbidden_scope_vi:
    "Không có audio, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, CI, push hoặc deploy.",
  forbidden_scope_en:
    "No audio, pronunciation scoring, Azure, auth, billing, RLS, Supabase, CI, push, or deploy.",
};

export const PUNJABI_READINESS_AREAS: PunjabiReadinessArea[] = [
  "module_coverage",
  "level_coverage",
  "script_path",
  "bilingual_support",
  "canada_survival",
  "workplace",
  "healthcare",
  "public_service",
  "review_remediation",
  "scope_honesty",
];

export const PUNJABI_INTEGRATION_READINESS_CHECKLIST: PunjabiReadinessChecklistItem[] = [
  {
    id: "modules-foundation-through-index",
    area: "module_coverage",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਮੋਡੀਊਲ ਕਵਰੇਜ",
    romanization: "module coverage",
    title_vi: "Độ phủ module",
    title_en: "Module coverage",
    check_vi: "Foundation, dialogues, course map, learning path, progression, mastery, graph, content index đã có dữ liệu.",
    check_en: "Foundation, dialogues, course map, learning path, progression, mastery, graph, and content index have data.",
    evidence_modules: [
      "index",
      "lessons-a1",
      "dialogues",
      "courseMap",
      "learningPath",
      "progressionMatrix",
      "masteryCheckpoints",
      "skillDependencyGraph",
      "contentIndex",
    ],
    sample: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    learner_trap_vi: "Đây là checklist cho tích hợp sau, không phải chạy A11.",
    learner_trap_en: "This is a checklist for later integration, not an A11 run.",
  },
  {
    id: "levels-a1-c2-covered",
    area: "level_coverage",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਪੱਧਰ A1-C2",
    romanization: "paddhar A1-C2",
    title_vi: "Độ phủ A1-C2",
    title_en: "A1-C2 coverage",
    check_vi: "Các mốc A1-C2 có mục tiêu, checkpoint, review/remediation và ví dụ Gurmukhi.",
    check_en: "A1-C2 have goals, checkpoints, review/remediation, and Gurmukhi examples.",
    evidence_modules: ["courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints"],
    sample: { gurmukhi: "ਸਾਰ ਇਹ ਹੈ ਕਿ ਫੈਸਲਾ ਅਜੇ ਬਾਕੀ ਹੈ।", romanization: "sar ih hai ki faisla aje baki hai", vi: "Tóm lại là quyết định vẫn còn chờ.", en: "The summary is that the decision is still pending." },
    learner_trap_vi: "C2 là mốc học tập nội bộ, không phải chứng chỉ chính thức.",
    learner_trap_en: "C2 is an internal learning milestone, not official certification.",
  },
  {
    id: "gurmukhi-first-path",
    area: "script_path",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1"],
    title_pa: "ਗੁਰਮੁਖੀ ਪਹਿਲਾਂ",
    romanization: "Gurmukhi pahilan",
    title_vi: "Đường Gurmukhi-first",
    title_en: "Gurmukhi-first path",
    check_vi: "Metadata, bài A1, learning path, mastery và graph đều giữ Gurmukhi là tín hiệu chính.",
    check_en: "Metadata, A1 lesson, learning path, mastery, and graph keep Gurmukhi as the primary signal.",
    evidence_modules: ["index", "lessons-a1", "learningPath", "masteryCheckpoints", "skillDependencyGraph"],
    sample: { gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "Gurmukhi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    learner_trap_vi: "Phụ thuộc romanization quá lâu cần remediation.",
    learner_trap_en: "Long romanization dependence needs remediation.",
  },
  {
    id: "vi-en-learner-support",
    area: "bilingual_support",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਵੀਅਤਨਾਮੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਸਹਾਇਤਾ",
    romanization: "Vietnamese ate English sahaita",
    title_vi: "Hỗ trợ người học Việt/Anh",
    title_en: "Vietnamese and English learner support",
    check_vi: "Các module có giải thích tiếng Việt và tiếng Anh cho mục tiêu, ví dụ, lỗi thường gặp.",
    check_en: "Modules include Vietnamese and English for goals, examples, and common traps.",
    evidence_modules: ["lessons-a1", "dialogues", "courseMap", "contentIndex"],
    sample: { gurmukhi: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhannvaad ji", vi: "Cảm ơn ạ.", en: "Thank you respectfully." },
    learner_trap_vi: "Không dùng cùng một ghi chú cho cả hai nhóm nếu khác khó khăn phát âm/ngữ pháp.",
    learner_trap_en: "Do not reuse the same note for both audiences when their pronunciation/grammar issues differ.",
  },
  {
    id: "canada-survival-settlement",
    area: "canada_survival",
    status: "ready_for_later_integration",
    levels: ["A2", "B1"],
    title_pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਰਹਿਣਾ",
    romanization: "Canada vich rehna",
    title_vi: "Sinh tồn/định cư Canada",
    title_en: "Canada survival and settlement",
    check_vi: "Có mục địa chỉ, số điện thoại, mua sắm, biểu mẫu cơ bản và liên hệ.",
    check_en: "Address, phone number, shopping, basic forms, and contact items are present.",
    evidence_modules: ["learningPath", "contentIndex", "skillDependencyGraph", "masteryCheckpoints"],
    sample: { gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." },
    learner_trap_vi: "ਪਤਾ là địa chỉ, không phải ਪਿਤਾ là bố.",
    learner_trap_en: "Pata means address, not pita, father.",
    canada_practical: true,
  },
  {
    id: "workplace-readiness-check",
    area: "workplace",
    status: "ready_for_later_integration",
    levels: ["B1", "B2", "C1"],
    title_pa: "ਕੰਮ ਲਈ ਤਿਆਰੀ",
    romanization: "kamm lai tiari",
    title_vi: "Sẵn sàng nơi làm việc",
    title_en: "Workplace readiness",
    check_vi: "Có ca làm, hạn chót, xin nghỉ, bất đồng lịch sự và yêu cầu làm rõ.",
    check_en: "Shifts, deadlines, time off, polite disagreement, and clarification requests are covered.",
    evidence_modules: ["dialogues", "progressionMatrix", "masteryCheckpoints", "contentIndex"],
    sample: { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
    learner_trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; trong công việc cần xác nhận ngày.",
    learner_trap_en: "Kall can mean yesterday or tomorrow; confirm the date at work.",
    canada_practical: true,
  },
  {
    id: "healthcare-readiness-check",
    area: "healthcare",
    status: "ready_for_later_integration",
    levels: ["A2", "B1", "B2"],
    title_pa: "ਸਿਹਤ ਲਈ ਤਿਆਰੀ",
    romanization: "sehat lai tiari",
    title_vi: "Sẵn sàng y tế",
    title_en: "Healthcare readiness",
    check_vi: "Có lịch hẹn, triệu chứng, sốt/ho, thuốc, dị ứng và thời lượng bệnh.",
    check_en: "Appointments, symptoms, fever/cough, medicine, allergies, and duration are covered.",
    evidence_modules: ["dialogues", "learningPath", "progressionMatrix", "masteryCheckpoints"],
    sample: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    learner_trap_vi: "Trong y tế, nên dùng tên thuốc bằng chữ viết; romanization chỉ là hỗ trợ học.",
    learner_trap_en: "In healthcare, use written medicine names; romanization is only a learning aid.",
    canada_practical: true,
  },
  {
    id: "public-service-readiness-check",
    area: "public_service",
    status: "ready_for_later_integration",
    levels: ["A2", "B1", "C1"],
    title_pa: "ਸਰਕਾਰੀ ਸੇਵਾ ਤਿਆਰੀ",
    romanization: "sarkari seva tiari",
    title_vi: "Sẵn sàng dịch vụ công",
    title_en: "Public-service readiness",
    check_vi: "Có mẫu đơn, chữ ký, giấy tờ cần thiết và yêu cầu giải thích quyết định.",
    check_en: "Forms, signatures, required documents, and requests for decision reasons are covered.",
    evidence_modules: ["dialogues", "learningPath", "skillDependencyGraph", "contentIndex"],
    sample: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    learner_trap_vi: "Yêu cầu trong cơ quan công quyền nên dùng register lịch sự.",
    learner_trap_en: "Requests in public offices should use polite register.",
    canada_practical: true,
  },
  {
    id: "review-remediation-ready",
    area: "review_remediation",
    status: "ready_for_later_integration",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਦੁਹਰਾਈ ਅਤੇ ਸੁਧਾਰ",
    romanization: "duhrai ate sudhar",
    title_vi: "Ôn tập và sửa lỗi",
    title_en: "Review and remediation",
    check_vi: "Có checkpoint, remediation cho romanization, register, và cầu nối Canada-practical.",
    check_en: "Checkpoints and remediation exist for romanization, register, and Canada-practical bridging.",
    evidence_modules: ["progressionMatrix", "masteryCheckpoints", "skillDependencyGraph", "contentIndex"],
    sample: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "làm ơn", en: "please" },
    learner_trap_vi: "Không thêm nội dung mới nếu nền chữ hoặc register còn yếu.",
    learner_trap_en: "Do not add new content if script or register foundations are weak.",
  },
  {
    id: "scope-honesty-no-claims",
    area: "scope_honesty",
    status: "deferred",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    title_pa: "ਇਮਾਨਦਾਰ ਸੀਮਾ",
    romanization: "imandar sima",
    title_vi: "Giới hạn trung thực",
    title_en: "Honest scope boundaries",
    check_vi: "Native review hoãn; không audio/chấm phát âm; Shahmukhi awareness-only; không chứng chỉ chính thức.",
    check_en: "Native review deferred; no audio/scoring; Shahmukhi awareness-only; no official certification.",
    evidence_modules: ["courseMap", "learningPath", "progressionMatrix", "masteryCheckpoints", "contentIndex"],
    sample: { gurmukhi: "ਜੀ", romanization: "ji", vi: "từ lịch sự", en: "respect marker" },
    learner_trap_vi: "Không tuyên bố native review hoặc chứng chỉ khi dữ liệu chỉ là text-first.",
    learner_trap_en: "Do not claim native review or certification when the data is text-first.",
  },
  {
    id: "blocked-out-of-scope-systems",
    area: "scope_honesty",
    status: "blocked_out_of_scope",
    levels: ["A1"],
    title_pa: "ਸਿਸਟਮ ਸੀਮਾ",
    romanization: "system sima",
    title_vi: "Ranh giới hệ thống",
    title_en: "System boundary",
    check_vi: "A11 sau này phải giữ Wave 9 không chạm audio, auth, billing, Supabase, Azure, CI, push, deploy.",
    check_en: "Later A11 work must note Wave 9 did not touch audio, auth, billing, Supabase, Azure, CI, push, or deploy.",
    evidence_modules: ["integrationReadinessChecklist"],
    sample: { gurmukhi: "ਨਹੀਂ", romanization: "nahin", vi: "không", en: "no" },
    learner_trap_vi: "Checklist readiness không đồng nghĩa triển khai.",
    learner_trap_en: "Checklist readiness is not deployment.",
  },
];

export const PUNJABI_INTEGRATION_READINESS_SUMMARY = {
  ready_count: PUNJABI_INTEGRATION_READINESS_CHECKLIST.filter(
    (item) => item.status === "ready_for_later_integration",
  ).length,
  deferred_items: ["native_review", "audio", "pronunciation_scoring", "official_certification"],
  later_a11_note_vi:
    "A11 sau này có thể đọc checklist này để biết module nào sẵn sàng, nhưng Wave 9 không chạy A11.",
  later_a11_note_en:
    "Later A11 work can read this checklist to see which modules are ready, but Wave 9 does not run A11.",
} as const;

export const PUNJABI_INTEGRATION_READINESS = {
  scope: PUNJABI_INTEGRATION_SCOPE,
  areas: PUNJABI_READINESS_AREAS,
  checklist: PUNJABI_INTEGRATION_READINESS_CHECKLIST,
  summary: PUNJABI_INTEGRATION_READINESS_SUMMARY,
} as const;

export default PUNJABI_INTEGRATION_READINESS;
