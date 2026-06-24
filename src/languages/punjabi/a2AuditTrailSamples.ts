// src/languages/punjabi/a2AuditTrailSamples.ts
//
// Punjabi A2 audit-trail samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2TraceabilitySamples,
  type PunjabiA2TraceabilityScenario,
} from "@/languages/punjabi/a2TraceabilitySamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2AuditTrailScenario = PunjabiA2TraceabilityScenario;

export type PunjabiA2AuditTrailStyle =
  | "pre_a11_audit_trail"
  | "traceability_audit"
  | "evidence_receipt_audit"
  | "completion_record_audit"
  | "inventory_seal_audit"
  | "pre_integration_audit"
  | "readiness_audit";

export type PunjabiA2AuditTrailItem = {
  id: string;
  scenario: PunjabiA2AuditTrailScenario;
  style: PunjabiA2AuditTrailStyle;
  title_vi: string;
  title_en: string;
  audit_trail_goal_vi: string;
  audit_trail_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  audit_note_vi: string;
  audit_note_en: string;
  traceability_reference_vi: string;
  traceability_reference_en: string;
  evidence_receipt_reference_vi: string;
  evidence_receipt_reference_en: string;
  script_awareness_vi: string;
  script_awareness_en: string;
  canada_practical_vi?: string;
  canada_practical_en?: string;
  lines: PunjabiA2RunnerReadinessLine[];
  checks: {
    q_vi: string;
    q_en: string;
    answer_pa: string;
    answer_romanization: string;
    answer_vi: string;
    answer_en: string;
  }[];
  traps: PunjabiA2RunnerReadinessTrap[];
};

const scriptAwarenessVi =
  "Gurmukhi là chữ chính trong audit-trail samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these audit-trail samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2AuditTrailScenario, PunjabiA2AuditTrailStyle> = {
  daily_routines: "pre_a11_audit_trail",
  appointments: "traceability_audit",
  transport: "evidence_receipt_audit",
  housing: "completion_record_audit",
  school: "inventory_seal_audit",
  childcare: "pre_a11_audit_trail",
  workplace_small_talk: "traceability_audit",
  forms: "evidence_receipt_audit",
  short_messages: "completion_record_audit",
  service_flow: "inventory_seal_audit",
  polite_problem_descriptions: "pre_integration_audit",
  interaction_repair: "readiness_audit",
};

const auditNotes: Record<
  PunjabiA2AuditTrailScenario,
  { vi: string; en: string }
> = {
  daily_routines: {
    vi: "Audit trail xác nhận mẫu thói quen hằng ngày có đường nối từ nội dung tới mục tiêu trước A11.",
    en: "Audit trail confirms the daily-routine sample has a path from content to goal before A11.",
  },
  appointments: {
    vi: "Audit trail xác nhận lịch hẹn nối được tới ngày, giờ, giấy tờ, và câu đổi lịch.",
    en: "Audit trail confirms appointments trace to day, time, documents, and reschedule wording.",
  },
  transport: {
    vi: "Audit trail xác nhận tình huống đi lại nối được tới tuyến, điểm xuống, và số phút trễ.",
    en: "Audit trail confirms transport traces to route, stop, and delay minutes.",
  },
  housing: {
    vi: "Audit trail xác nhận nhà ở nối được tới vấn đề, thời điểm, và yêu cầu sửa lịch sự.",
    en: "Audit trail confirms housing traces to issue, timing, and polite repair request.",
  },
  school: {
    vi: "Audit trail xác nhận trường học nối được tới lý do vắng học và yêu cầu homework.",
    en: "Audit trail confirms school traces to absence reason and homework request.",
  },
  childcare: {
    vi: "Audit trail xác nhận childcare nối được tới người đón thay và pickup list.",
    en: "Audit trail confirms childcare traces to alternate pickup person and pickup list.",
  },
  workplace_small_talk: {
    vi: "Audit trail xác nhận workplace small talk nối được tới mục tiêu ngắn, lịch sự, đúng A2.",
    en: "Audit trail confirms workplace small talk traces to a short, polite, A2-level goal.",
  },
  forms: {
    vi: "Audit trail xác nhận forms nối được tới tên form, trường thiếu, và câu xin trợ giúp.",
    en: "Audit trail confirms forms trace to form name, missing field, and help request.",
  },
  short_messages: {
    vi: "Audit trail xác nhận short messages nối được tới thời gian, lý do, và lời xin lỗi.",
    en: "Audit trail confirms short messages trace to time, reason, and apology.",
  },
  service_flow: {
    vi: "Audit trail xác nhận service flow nối được tới đúng thứ tự yêu cầu, xác nhận, và cảm ơn.",
    en: "Audit trail confirms service flow traces to the correct request, confirmation, and thanks order.",
  },
  polite_problem_descriptions: {
    vi: "Audit trail xác nhận mô tả vấn đề nối được tới cách nói lịch sự và đúng vật bị lỗi.",
    en: "Audit trail confirms problem descriptions trace to polite wording and the correct faulty item.",
  },
  interaction_repair: {
    vi: "Audit trail xác nhận interaction repair nối được tới hỏi lại, xác nhận, và xin nói chậm hơn.",
    en: "Audit trail confirms interaction repair traces to asking again, confirming, and requesting slower speech.",
  },
};

export const a2AuditTrailSamples: PunjabiA2AuditTrailItem[] = a2TraceabilitySamples.map((item) => ({
  id: item.id.replace("pa_a2_traceability_", "pa_a2_audit_trail_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Audit trail: ${item.title_vi.replace("Traceability: ", "")}`,
  title_en: `Audit trail: ${item.title_en.replace("Traceability: ", "")}`,
  audit_trail_goal_vi: `Ghi audit trail trước A11: ${item.traceability_goal_vi.replace("Nối traceability trước A11: ", "")}`,
  audit_trail_goal_en: `Record audit trail before A11: ${item.traceability_goal_en.replace("Connect traceability before A11: ", "")}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  audit_note_vi: auditNotes[item.scenario].vi,
  audit_note_en: auditNotes[item.scenario].en,
  traceability_reference_vi: item.trace_note_vi,
  traceability_reference_en: item.trace_note_en,
  evidence_receipt_reference_vi: item.evidence_receipt_reference_vi,
  evidence_receipt_reference_en: item.evidence_receipt_reference_en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));

export default a2AuditTrailSamples;
