// src/languages/punjabi/a2CompletionRecordSamples.ts
//
// Punjabi A2 completion-record samples for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred.
// This is not A11 integration.

import {
  a2InventorySealSamples,
  type PunjabiA2InventorySealScenario,
} from "@/languages/punjabi/a2InventorySealSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2CompletionRecordScenario = PunjabiA2InventorySealScenario;

export type PunjabiA2CompletionRecordStyle =
  | "pre_a11_completion_record"
  | "inventory_seal_record"
  | "catalog_record"
  | "bundle_record"
  | "receipt_record"
  | "pre_integration_record"
  | "readiness_record";

export type PunjabiA2CompletionRecordItem = {
  id: string;
  scenario: PunjabiA2CompletionRecordScenario;
  style: PunjabiA2CompletionRecordStyle;
  title_vi: string;
  title_en: string;
  completion_record_goal_vi: string;
  completion_record_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  completion_note_vi: string;
  completion_note_en: string;
  inventory_seal_reference_vi: string;
  inventory_seal_reference_en: string;
  catalog_reference_vi: string;
  catalog_reference_en: string;
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
  "Gurmukhi là chữ chính trong completion-record samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these completion-record samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2CompletionRecordScenario, PunjabiA2CompletionRecordStyle> = {
  daily_routines: "pre_a11_completion_record",
  appointments: "inventory_seal_record",
  transport: "catalog_record",
  housing: "bundle_record",
  school: "receipt_record",
  childcare: "pre_a11_completion_record",
  workplace_small_talk: "inventory_seal_record",
  forms: "catalog_record",
  short_messages: "bundle_record",
  service_flow: "receipt_record",
  polite_problem_descriptions: "pre_integration_record",
  interaction_repair: "readiness_record",
};

const completionNotes: Record<
  PunjabiA2CompletionRecordScenario,
  { vi: string; en: string }
> = {
  daily_routines: {
    vi: "Completion record xác nhận giờ, thứ tự hoạt động, và câu quá khứ ngắn đã ổn trước A11.",
    en: "Completion record confirms time, activity order, and the short past sentence are stable before A11.",
  },
  appointments: {
    vi: "Completion record xác nhận ngày hẹn, giờ hẹn, giấy tờ, và câu đổi lịch có điều kiện.",
    en: "Completion record confirms appointment day, time, documents, and conditional reschedule wording.",
  },
  transport: {
    vi: "Completion record xác nhận tuyến, điểm xuống, và số phút trễ cho tình huống đi lại ở Canada.",
    en: "Completion record confirms route, stop, and delay minutes for the Canada transport scenario.",
  },
  housing: {
    vi: "Completion record xác nhận vấn đề nhà ở và yêu cầu sửa vẫn lịch sự, cụ thể.",
    en: "Completion record confirms the housing issue and repair request stay polite and specific.",
  },
  school: {
    vi: "Completion record xác nhận lý do vắng học và yêu cầu homework không bị đổi vai.",
    en: "Completion record confirms absence reason and homework request do not shift roles.",
  },
  childcare: {
    vi: "Completion record xác nhận người đón thay và pickup list vẫn khớp nhau.",
    en: "Completion record confirms alternate pickup person and pickup list still match.",
  },
  workplace_small_talk: {
    vi: "Completion record xác nhận small talk nơi làm việc vẫn ngắn và đúng mức A2.",
    en: "Completion record confirms workplace small talk stays short and at A2 level.",
  },
  forms: {
    vi: "Completion record xác nhận tên form, trường thiếu, và câu xin trợ giúp đã rõ.",
    en: "Completion record confirms form name, missing field, and help request are clear.",
  },
  short_messages: {
    vi: "Completion record xác nhận tin nhắn ngắn giữ thời gian, lý do, và lời xin lỗi.",
    en: "Completion record confirms the short message keeps time, reason, and apology.",
  },
  service_flow: {
    vi: "Completion record xác nhận thứ tự service flow không bị đảo trước A11.",
    en: "Completion record confirms service-flow order is not swapped before A11.",
  },
  polite_problem_descriptions: {
    vi: "Completion record xác nhận mô tả vấn đề lịch sự, đúng vật bị lỗi, và không phóng đại.",
    en: "Completion record confirms problem description is polite, tied to the right item, and not exaggerated.",
  },
  interaction_repair: {
    vi: "Completion record xác nhận câu hỏi lại, xác nhận, và xin nói chậm hơn sẵn sàng dùng.",
    en: "Completion record confirms asking again, confirming, and requesting slower speech are ready to use.",
  },
};

export const a2CompletionRecordSamples: PunjabiA2CompletionRecordItem[] = a2InventorySealSamples.map((item) => ({
  id: item.id.replace("pa_a2_inventory_seal_", "pa_a2_completion_record_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Completion record: ${item.title_vi.replace("Inventory seal: ", "")}`,
  title_en: `Completion record: ${item.title_en.replace("Inventory seal: ", "")}`,
  completion_record_goal_vi: `Ghi completion record trước A11: ${item.inventory_seal_goal_vi.replace("Niêm phong inventory trước A11: ", "")}`,
  completion_record_goal_en: `Record completion before A11: ${item.inventory_seal_goal_en.replace("Seal inventory before A11: ", "")}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  completion_note_vi: completionNotes[item.scenario].vi,
  completion_note_en: completionNotes[item.scenario].en,
  inventory_seal_reference_vi: item.seal_note_vi,
  inventory_seal_reference_en: item.seal_note_en,
  catalog_reference_vi: item.catalog_reference_vi,
  catalog_reference_en: item.catalog_reference_en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));

export default a2CompletionRecordSamples;
