// src/languages/punjabi/a2BundleSamples.ts
//
// Punjabi A2 bundle samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2ReceiptSamples,
  type PunjabiA2ReceiptScenario,
} from "@/languages/punjabi/a2ReceiptSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2BundleScenario = PunjabiA2ReceiptScenario;

export type PunjabiA2BundleStyle =
  | "pre_a11_bundle"
  | "receipt_bundle"
  | "ledger_bundle"
  | "archive_bundle"
  | "pre_integration_bundle"
  | "service_bundle"
  | "readiness_bundle";

export type PunjabiA2BundleItem = {
  id: string;
  scenario: PunjabiA2BundleScenario;
  style: PunjabiA2BundleStyle;
  title_vi: string;
  title_en: string;
  bundle_goal_vi: string;
  bundle_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  bundle_note_vi: string;
  bundle_note_en: string;
  receipt_reference_vi: string;
  receipt_reference_en: string;
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
  "Gurmukhi là chữ chính trong bundle samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these bundle samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2BundleScenario, PunjabiA2BundleStyle> = {
  daily_routines: "pre_a11_bundle",
  appointments: "receipt_bundle",
  transport: "ledger_bundle",
  housing: "archive_bundle",
  school: "service_bundle",
  childcare: "pre_a11_bundle",
  workplace_small_talk: "receipt_bundle",
  forms: "ledger_bundle",
  short_messages: "archive_bundle",
  service_flow: "service_bundle",
  polite_problem_descriptions: "pre_integration_bundle",
  interaction_repair: "readiness_bundle",
};

const bundleNotes: Record<
  PunjabiA2BundleScenario,
  { vi: string; en: string }
> = {
  daily_routines: {
    vi: "Bundle giữ cụm thói quen sáng, thời gian, và câu quá khứ ngắn để dùng lại sau này.",
    en: "Bundle keeps the morning routine, time details, and short past sentence reusable later.",
  },
  appointments: {
    vi: "Bundle gom lịch hẹn, giấy tờ, và câu đổi lịch có điều kiện thành một mẫu ổn định.",
    en: "Bundle groups appointment time, documents, and conditional rescheduling into one stable sample.",
  },
  transport: {
    vi: "Bundle giữ tuyến đi lại, trạm xuống, và thông báo trễ theo ngữ cảnh Canada.",
    en: "Bundle keeps transport route, stop, and delay notice in a Canada-practical context.",
  },
  housing: {
    vi: "Bundle giữ opener lịch sự, sự cố nhà ở, thời điểm bắt đầu, và yêu cầu sửa.",
    en: "Bundle keeps polite opener, housing issue, start time, and repair request.",
  },
  school: {
    vi: "Bundle giữ tin nhắn phụ huynh với lý do vắng học và yêu cầu homework.",
    en: "Bundle keeps the parent message with absence reason and homework request.",
  },
  childcare: {
    vi: "Bundle giữ chi tiết childcare pickup để không nhầm người đón và thời gian.",
    en: "Bundle keeps childcare pickup details so pickup person and time are not confused.",
  },
  workplace_small_talk: {
    vi: "Bundle giữ small talk nơi làm việc ở mức A2: ngắn, lịch sự, và thực tế.",
    en: "Bundle keeps A2 workplace small talk short, polite, and practical.",
  },
  forms: {
    vi: "Bundle giữ câu hỏi về form, thông tin còn thiếu, và cách xin trợ giúp.",
    en: "Bundle keeps form questions, missing information, and help request language.",
  },
  short_messages: {
    vi: "Bundle giữ tin nhắn ngắn có lý do rõ và thời gian không bị đổi.",
    en: "Bundle keeps short messages with clear reasons and unchanged time details.",
  },
  service_flow: {
    vi: "Bundle giữ thứ tự service flow để learner có thể dùng trong quầy dịch vụ.",
    en: "Bundle keeps service-flow order so learners can use it at a service counter.",
  },
  polite_problem_descriptions: {
    vi: "Bundle giữ mô tả vấn đề lịch sự, cụ thể, và không đổi đồ vật bị lỗi.",
    en: "Bundle keeps problem descriptions polite, specific, and tied to the same faulty item.",
  },
  interaction_repair: {
    vi: "Bundle giữ câu repair để hỏi lại, xác nhận, và xin người khác nói chậm hơn.",
    en: "Bundle keeps repair phrases for asking again, confirming, and requesting slower speech.",
  },
};

export const a2BundleSamples: PunjabiA2BundleItem[] = a2ReceiptSamples.map((item) => ({
  id: item.id.replace("pa_a2_receipt_", "pa_a2_bundle_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Bundle: ${item.title_vi.replace("Receipt: ", "")}`,
  title_en: `Bundle: ${item.title_en.replace("Receipt: ", "")}`,
  bundle_goal_vi: `Đóng gói bundle trước A11: ${item.receipt_goal_vi.replace("Xác nhận receipt trước A11: ", "")}`,
  bundle_goal_en: `Package bundle before A11: ${item.receipt_goal_en.replace("Confirm receipt before A11: ", "")}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  bundle_note_vi: bundleNotes[item.scenario].vi,
  bundle_note_en: bundleNotes[item.scenario].en,
  receipt_reference_vi: item.receipt_note_vi,
  receipt_reference_en: item.receipt_note_en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));

export default a2BundleSamples;
