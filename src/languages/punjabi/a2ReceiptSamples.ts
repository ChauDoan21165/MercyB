// src/languages/punjabi/a2ReceiptSamples.ts
//
// Punjabi A2 receipt samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2LedgerSamples,
  type PunjabiA2LedgerScenario,
} from "@/languages/punjabi/a2LedgerSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2ReceiptScenario = PunjabiA2LedgerScenario;

export type PunjabiA2ReceiptStyle =
  | "pre_a11_receipt"
  | "ledger_receipt"
  | "archive_receipt"
  | "pre_integration_receipt"
  | "service_receipt"
  | "qa_receipt"
  | "readiness_receipt";

export type PunjabiA2ReceiptItem = {
  id: string;
  scenario: PunjabiA2ReceiptScenario;
  style: PunjabiA2ReceiptStyle;
  title_vi: string;
  title_en: string;
  receipt_goal_vi: string;
  receipt_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  receipt_note_vi: string;
  receipt_note_en: string;
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
  "Gurmukhi là chữ chính trong receipt samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these receipt samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2ReceiptScenario, PunjabiA2ReceiptStyle> = {
  daily_routines: "pre_a11_receipt",
  appointments: "ledger_receipt",
  transport: "archive_receipt",
  housing: "service_receipt",
  school: "qa_receipt",
  childcare: "pre_a11_receipt",
  workplace_small_talk: "ledger_receipt",
  forms: "archive_receipt",
  short_messages: "pre_integration_receipt",
  service_flow: "service_receipt",
  polite_problem_descriptions: "qa_receipt",
  interaction_repair: "readiness_receipt",
};

const receiptNotes: Record<
  PunjabiA2ReceiptScenario,
  { vi: string; en: string }
> = {
  daily_routines: {
    vi: "Biên nhận giữ giờ và thứ tự hoạt động để later A11 không đổi nghĩa thói quen sáng.",
    en: "Receipt keeps time and activity order so later A11 work does not change the morning-routine meaning.",
  },
  appointments: {
    vi: "Biên nhận giữ ngày, giờ, giấy tờ cần mang, và câu đổi lịch có điều kiện.",
    en: "Receipt keeps the day, time, required documents, and conditional reschedule line.",
  },
  transport: {
    vi: "Biên nhận giữ tuyến, điểm xuống, và số phút trễ cho tình huống đi lại ở Canada.",
    en: "Receipt keeps the route, stop, and delay length for Canada-practical transport situations.",
  },
  housing: {
    vi: "Biên nhận giữ vấn đề nhà ở, thời điểm bắt đầu, và yêu cầu sửa lịch sự.",
    en: "Receipt keeps the housing problem, start time, and polite repair request.",
  },
  school: {
    vi: "Biên nhận giữ lý do vắng học và yêu cầu gửi homework qua kênh trường.",
    en: "Receipt keeps the absence reason and homework request through a school channel.",
  },
  childcare: {
    vi: "Biên nhận giữ người đón thay và chi tiết pickup list cho childcare.",
    en: "Receipt keeps alternate pickup person and pickup-list details for childcare.",
  },
  workplace_small_talk: {
    vi: "Biên nhận giữ small talk ngắn, lịch ca, và ranh giới lịch sự ở nơi làm việc.",
    en: "Receipt keeps short small talk, shift timing, and polite workplace boundaries.",
  },
  forms: {
    vi: "Biên nhận giữ tên form, trường thông tin thiếu, và cách hỏi trợ giúp.",
    en: "Receipt keeps form name, missing field, and how to ask for help.",
  },
  short_messages: {
    vi: "Biên nhận giữ tin nhắn ngắn có lý do, thời gian, và lời xin lỗi vừa đủ.",
    en: "Receipt keeps short messages with reason, time, and a concise apology.",
  },
  service_flow: {
    vi: "Biên nhận giữ trình tự service flow: chào hỏi, yêu cầu, xác nhận, cảm ơn.",
    en: "Receipt keeps the service-flow order: greeting, request, confirmation, thanks.",
  },
  polite_problem_descriptions: {
    vi: "Biên nhận giữ mô tả vấn đề lịch sự, không phóng đại và không đổi vật bị lỗi.",
    en: "Receipt keeps polite problem description without exaggerating or changing the faulty item.",
  },
  interaction_repair: {
    vi: "Biên nhận giữ repair phrases để hỏi lại, xác nhận, và xin nói chậm hơn.",
    en: "Receipt keeps repair phrases for asking again, confirming, and requesting slower speech.",
  },
};

export const a2ReceiptSamples: PunjabiA2ReceiptItem[] = a2LedgerSamples.map((item) => ({
  id: item.id.replace("pa_a2_ledger_", "pa_a2_receipt_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Receipt: ${item.title_vi.replace("Ledger: ", "")}`,
  title_en: `Receipt: ${item.title_en.replace("Ledger: ", "")}`,
  receipt_goal_vi: `Xác nhận receipt trước A11: ${item.ledger_goal_vi.replace("Lưu ledger trước A11: ", "")}`,
  receipt_goal_en: `Confirm receipt before A11: ${item.ledger_goal_en.replace("Ledger before A11: ", "")}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  receipt_note_vi: receiptNotes[item.scenario].vi,
  receipt_note_en: receiptNotes[item.scenario].en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));

export default a2ReceiptSamples;
