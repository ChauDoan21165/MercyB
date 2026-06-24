// src/languages/punjabi/a2TraceabilitySamples.ts
//
// Punjabi A2 traceability samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2EvidenceReceiptSamples,
  type PunjabiA2EvidenceReceiptScenario,
} from "@/languages/punjabi/a2EvidenceReceiptSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2TraceabilityScenario = PunjabiA2EvidenceReceiptScenario;

export type PunjabiA2TraceabilityStyle =
  | "pre_a11_traceability"
  | "evidence_receipt_trace"
  | "completion_record_trace"
  | "inventory_seal_trace"
  | "catalog_trace"
  | "pre_integration_trace"
  | "readiness_trace";

export type PunjabiA2TraceabilityItem = {
  id: string;
  scenario: PunjabiA2TraceabilityScenario;
  style: PunjabiA2TraceabilityStyle;
  title_vi: string;
  title_en: string;
  traceability_goal_vi: string;
  traceability_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  trace_note_vi: string;
  trace_note_en: string;
  evidence_receipt_reference_vi: string;
  evidence_receipt_reference_en: string;
  completion_record_reference_vi: string;
  completion_record_reference_en: string;
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
  "Gurmukhi là chữ chính trong traceability samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these traceability samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2TraceabilityScenario, PunjabiA2TraceabilityStyle> = {
  daily_routines: "pre_a11_traceability",
  appointments: "evidence_receipt_trace",
  transport: "completion_record_trace",
  housing: "inventory_seal_trace",
  school: "catalog_trace",
  childcare: "pre_a11_traceability",
  workplace_small_talk: "evidence_receipt_trace",
  forms: "completion_record_trace",
  short_messages: "inventory_seal_trace",
  service_flow: "catalog_trace",
  polite_problem_descriptions: "pre_integration_trace",
  interaction_repair: "readiness_trace",
};

const traceNotes: Record<
  PunjabiA2TraceabilityScenario,
  { vi: string; en: string }
> = {
  daily_routines: {
    vi: "Traceability nối mẫu thói quen hằng ngày với mục tiêu giữ giờ, thứ tự, và câu quá khứ ngắn.",
    en: "Traceability links the daily-routine sample to the goal of preserving time, order, and the short past sentence.",
  },
  appointments: {
    vi: "Traceability nối lịch hẹn với mục tiêu giữ ngày, giờ, giấy tờ, và câu đổi lịch.",
    en: "Traceability links appointments to the goal of preserving day, time, documents, and reschedule wording.",
  },
  transport: {
    vi: "Traceability nối tình huống đi lại với mục tiêu giữ tuyến, điểm xuống, và số phút trễ.",
    en: "Traceability links transport to the goal of preserving route, stop, and delay minutes.",
  },
  housing: {
    vi: "Traceability nối nhà ở với mục tiêu giữ opener lịch sự, vấn đề, thời điểm, và yêu cầu sửa.",
    en: "Traceability links housing to the goal of preserving polite opener, issue, timing, and repair request.",
  },
  school: {
    vi: "Traceability nối trường học với mục tiêu giữ lý do vắng học và yêu cầu homework.",
    en: "Traceability links school to the goal of preserving absence reason and homework request.",
  },
  childcare: {
    vi: "Traceability nối childcare với mục tiêu giữ người đón thay và pickup list.",
    en: "Traceability links childcare to the goal of preserving alternate pickup person and pickup list.",
  },
  workplace_small_talk: {
    vi: "Traceability nối workplace small talk với mục tiêu giữ lời nói ngắn, lịch sự, đúng mức A2.",
    en: "Traceability links workplace small talk to the goal of keeping it short, polite, and A2-level.",
  },
  forms: {
    vi: "Traceability nối forms với mục tiêu giữ tên form, trường thiếu, và câu xin trợ giúp.",
    en: "Traceability links forms to the goal of preserving form name, missing field, and help request.",
  },
  short_messages: {
    vi: "Traceability nối short messages với mục tiêu giữ thời gian, lý do, và lời xin lỗi.",
    en: "Traceability links short messages to the goal of preserving time, reason, and apology.",
  },
  service_flow: {
    vi: "Traceability nối service flow với mục tiêu giữ đúng thứ tự yêu cầu, xác nhận, và cảm ơn.",
    en: "Traceability links service flow to the goal of preserving request, confirmation, and thanks order.",
  },
  polite_problem_descriptions: {
    vi: "Traceability nối mô tả vấn đề với mục tiêu giữ cách nói lịch sự và đúng vật bị lỗi.",
    en: "Traceability links problem descriptions to the goal of staying polite and tied to the correct faulty item.",
  },
  interaction_repair: {
    vi: "Traceability nối interaction repair với mục tiêu giữ câu hỏi lại, xác nhận, và xin nói chậm hơn.",
    en: "Traceability links interaction repair to the goal of preserving asking again, confirming, and requesting slower speech.",
  },
};

export const a2TraceabilitySamples: PunjabiA2TraceabilityItem[] = a2EvidenceReceiptSamples.map((item) => ({
  id: item.id.replace("pa_a2_evidence_receipt_", "pa_a2_traceability_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Traceability: ${item.title_vi.replace("Evidence receipt: ", "")}`,
  title_en: `Traceability: ${item.title_en.replace("Evidence receipt: ", "")}`,
  traceability_goal_vi: `Nối traceability trước A11: ${item.evidence_receipt_goal_vi.replace("Lưu evidence receipt trước A11: ", "")}`,
  traceability_goal_en: `Connect traceability before A11: ${item.evidence_receipt_goal_en.replace("Save evidence receipt before A11: ", "")}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  trace_note_vi: traceNotes[item.scenario].vi,
  trace_note_en: traceNotes[item.scenario].en,
  evidence_receipt_reference_vi: item.evidence_note_vi,
  evidence_receipt_reference_en: item.evidence_note_en,
  completion_record_reference_vi: item.completion_record_reference_vi,
  completion_record_reference_en: item.completion_record_reference_en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));

export default a2TraceabilitySamples;
