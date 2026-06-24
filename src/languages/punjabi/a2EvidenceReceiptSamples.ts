// src/languages/punjabi/a2EvidenceReceiptSamples.ts
//
// Punjabi A2 evidence-receipt samples for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred.
// This is not A11 integration.

import {
  a2CompletionRecordSamples,
  type PunjabiA2CompletionRecordScenario,
} from "@/languages/punjabi/a2CompletionRecordSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2EvidenceReceiptScenario = PunjabiA2CompletionRecordScenario;

export type PunjabiA2EvidenceReceiptStyle =
  | "pre_a11_evidence_receipt"
  | "completion_record_receipt"
  | "inventory_seal_receipt"
  | "catalog_receipt"
  | "bundle_receipt"
  | "pre_integration_receipt"
  | "readiness_receipt";

export type PunjabiA2EvidenceReceiptItem = {
  id: string;
  scenario: PunjabiA2EvidenceReceiptScenario;
  style: PunjabiA2EvidenceReceiptStyle;
  title_vi: string;
  title_en: string;
  evidence_receipt_goal_vi: string;
  evidence_receipt_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  evidence_note_vi: string;
  evidence_note_en: string;
  completion_record_reference_vi: string;
  completion_record_reference_en: string;
  inventory_seal_reference_vi: string;
  inventory_seal_reference_en: string;
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
  "Gurmukhi là chữ chính trong evidence-receipt samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these evidence-receipt samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2EvidenceReceiptScenario, PunjabiA2EvidenceReceiptStyle> = {
  daily_routines: "pre_a11_evidence_receipt",
  appointments: "completion_record_receipt",
  transport: "inventory_seal_receipt",
  housing: "catalog_receipt",
  school: "bundle_receipt",
  childcare: "pre_a11_evidence_receipt",
  workplace_small_talk: "completion_record_receipt",
  forms: "inventory_seal_receipt",
  short_messages: "catalog_receipt",
  service_flow: "bundle_receipt",
  polite_problem_descriptions: "pre_integration_receipt",
  interaction_repair: "readiness_receipt",
};

const evidenceNotes: Record<
  PunjabiA2EvidenceReceiptScenario,
  { vi: string; en: string }
> = {
  daily_routines: {
    vi: "Evidence receipt giữ bằng chứng rằng giờ, thứ tự hoạt động, và câu quá khứ ngắn đã ổn.",
    en: "Evidence receipt keeps proof that time, activity order, and the short past sentence are stable.",
  },
  appointments: {
    vi: "Evidence receipt giữ bằng chứng về ngày hẹn, giờ hẹn, giấy tờ, và câu đổi lịch.",
    en: "Evidence receipt keeps proof for appointment day, time, documents, and reschedule wording.",
  },
  transport: {
    vi: "Evidence receipt giữ bằng chứng về tuyến, điểm xuống, và số phút trễ trong đi lại.",
    en: "Evidence receipt keeps proof for route, stop, and delay minutes in transport.",
  },
  housing: {
    vi: "Evidence receipt giữ bằng chứng rằng vấn đề nhà ở và yêu cầu sửa vẫn lịch sự.",
    en: "Evidence receipt keeps proof that the housing issue and repair request stay polite.",
  },
  school: {
    vi: "Evidence receipt giữ bằng chứng về lý do vắng học và yêu cầu homework.",
    en: "Evidence receipt keeps proof for absence reason and homework request.",
  },
  childcare: {
    vi: "Evidence receipt giữ bằng chứng người đón thay và pickup list vẫn khớp.",
    en: "Evidence receipt keeps proof that alternate pickup person and pickup list still match.",
  },
  workplace_small_talk: {
    vi: "Evidence receipt giữ bằng chứng small talk nơi làm việc vẫn ngắn và đúng mức A2.",
    en: "Evidence receipt keeps proof that workplace small talk stays short and at A2 level.",
  },
  forms: {
    vi: "Evidence receipt giữ bằng chứng tên form, trường thiếu, và câu xin trợ giúp đã rõ.",
    en: "Evidence receipt keeps proof that form name, missing field, and help request are clear.",
  },
  short_messages: {
    vi: "Evidence receipt giữ bằng chứng tin nhắn ngắn giữ thời gian, lý do, và lời xin lỗi.",
    en: "Evidence receipt keeps proof that the short message preserves time, reason, and apology.",
  },
  service_flow: {
    vi: "Evidence receipt giữ bằng chứng thứ tự service flow không bị đảo.",
    en: "Evidence receipt keeps proof that service-flow order is not swapped.",
  },
  polite_problem_descriptions: {
    vi: "Evidence receipt giữ bằng chứng mô tả vấn đề lịch sự và đúng vật bị lỗi.",
    en: "Evidence receipt keeps proof that the problem description is polite and tied to the right item.",
  },
  interaction_repair: {
    vi: "Evidence receipt giữ bằng chứng câu hỏi lại, xác nhận, và xin nói chậm hơn đã sẵn sàng.",
    en: "Evidence receipt keeps proof that asking again, confirming, and requesting slower speech are ready.",
  },
};

export const a2EvidenceReceiptSamples: PunjabiA2EvidenceReceiptItem[] = a2CompletionRecordSamples.map((item) => ({
  id: item.id.replace("pa_a2_completion_record_", "pa_a2_evidence_receipt_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Evidence receipt: ${item.title_vi.replace("Completion record: ", "")}`,
  title_en: `Evidence receipt: ${item.title_en.replace("Completion record: ", "")}`,
  evidence_receipt_goal_vi: `Lưu evidence receipt trước A11: ${item.completion_record_goal_vi.replace("Ghi completion record trước A11: ", "")}`,
  evidence_receipt_goal_en: `Save evidence receipt before A11: ${item.completion_record_goal_en.replace("Record completion before A11: ", "")}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  evidence_note_vi: evidenceNotes[item.scenario].vi,
  evidence_note_en: evidenceNotes[item.scenario].en,
  completion_record_reference_vi: item.completion_note_vi,
  completion_record_reference_en: item.completion_note_en,
  inventory_seal_reference_vi: item.inventory_seal_reference_vi,
  inventory_seal_reference_en: item.inventory_seal_reference_en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));

export default a2EvidenceReceiptSamples;
