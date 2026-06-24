// src/languages/punjabi/a2CatalogSamples.ts
//
// Punjabi A2 catalog samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2BundleSamples,
  type PunjabiA2BundleScenario,
} from "@/languages/punjabi/a2BundleSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2CatalogScenario = PunjabiA2BundleScenario;

export type PunjabiA2CatalogStyle =
  | "pre_a11_catalog"
  | "bundle_catalog"
  | "receipt_catalog"
  | "ledger_catalog"
  | "archive_catalog"
  | "pre_integration_catalog"
  | "readiness_catalog";

export type PunjabiA2CatalogItem = {
  id: string;
  scenario: PunjabiA2CatalogScenario;
  style: PunjabiA2CatalogStyle;
  title_vi: string;
  title_en: string;
  catalog_goal_vi: string;
  catalog_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  catalog_note_vi: string;
  catalog_note_en: string;
  bundle_reference_vi: string;
  bundle_reference_en: string;
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
  "Gurmukhi là chữ chính trong catalog samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these catalog samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2CatalogScenario, PunjabiA2CatalogStyle> = {
  daily_routines: "pre_a11_catalog",
  appointments: "bundle_catalog",
  transport: "receipt_catalog",
  housing: "ledger_catalog",
  school: "archive_catalog",
  childcare: "pre_a11_catalog",
  workplace_small_talk: "bundle_catalog",
  forms: "receipt_catalog",
  short_messages: "ledger_catalog",
  service_flow: "archive_catalog",
  polite_problem_descriptions: "pre_integration_catalog",
  interaction_repair: "readiness_catalog",
};

const catalogNotes: Record<
  PunjabiA2CatalogScenario,
  { vi: string; en: string }
> = {
  daily_routines: {
    vi: "Catalog đánh dấu mẫu thói quen hằng ngày với giờ, hành động, và một câu quá khứ ổn định.",
    en: "Catalog marks the daily-routine sample with stable time, action, and one past sentence.",
  },
  appointments: {
    vi: "Catalog giữ lịch hẹn, giấy tờ, và câu đổi lịch trong một entry dễ tìm.",
    en: "Catalog keeps appointment time, documents, and reschedule language in one findable entry.",
  },
  transport: {
    vi: "Catalog giữ entry đi lại cho bus, điểm xuống, và thông báo trễ ở Canada.",
    en: "Catalog keeps the transport entry for bus route, stop, and delay notice in Canada.",
  },
  housing: {
    vi: "Catalog giữ vấn đề nhà ở theo thứ tự: xin lỗi, mô tả, thời điểm, yêu cầu sửa.",
    en: "Catalog keeps the housing issue order: apology, description, timing, repair request.",
  },
  school: {
    vi: "Catalog giữ entry phụ huynh-trường học cho vắng học và homework.",
    en: "Catalog keeps the parent-school entry for absence and homework.",
  },
  childcare: {
    vi: "Catalog giữ childcare pickup với người đón thay và thông tin list.",
    en: "Catalog keeps childcare pickup with alternate pickup person and list information.",
  },
  workplace_small_talk: {
    vi: "Catalog giữ workplace small talk ngắn để không biến thành hội thoại B1 dài.",
    en: "Catalog keeps workplace small talk short so it does not become a longer B1 dialogue.",
  },
  forms: {
    vi: "Catalog giữ form entry cho tên form, trường thiếu, và câu hỏi trợ giúp.",
    en: "Catalog keeps the form entry for form name, missing field, and help request.",
  },
  short_messages: {
    vi: "Catalog giữ short-message entry với thời gian, lý do, và lời xin lỗi rõ.",
    en: "Catalog keeps the short-message entry with time, reason, and clear apology.",
  },
  service_flow: {
    vi: "Catalog giữ service-flow entry để thứ tự yêu cầu và xác nhận không bị đảo.",
    en: "Catalog keeps the service-flow entry so request and confirmation order is not swapped.",
  },
  polite_problem_descriptions: {
    vi: "Catalog giữ mô tả vấn đề lịch sự, đúng vật bị lỗi, và không phóng đại.",
    en: "Catalog keeps problem descriptions polite, tied to the correct item, and not exaggerated.",
  },
  interaction_repair: {
    vi: "Catalog giữ interaction repair cho hỏi lại, xác nhận, và xin nói chậm hơn.",
    en: "Catalog keeps interaction repair for asking again, confirming, and requesting slower speech.",
  },
};

export const a2CatalogSamples: PunjabiA2CatalogItem[] = a2BundleSamples.map((item) => ({
  id: item.id.replace("pa_a2_bundle_", "pa_a2_catalog_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Catalog: ${item.title_vi.replace("Bundle: ", "")}`,
  title_en: `Catalog: ${item.title_en.replace("Bundle: ", "")}`,
  catalog_goal_vi: `Ghi catalog trước A11: ${item.bundle_goal_vi.replace("Đóng gói bundle trước A11: ", "")}`,
  catalog_goal_en: `Catalog before A11: ${item.bundle_goal_en.replace("Package bundle before A11: ", "")}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  catalog_note_vi: catalogNotes[item.scenario].vi,
  catalog_note_en: catalogNotes[item.scenario].en,
  bundle_reference_vi: item.bundle_note_vi,
  bundle_reference_en: item.bundle_note_en,
  receipt_reference_vi: item.receipt_reference_vi,
  receipt_reference_en: item.receipt_reference_en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));

export default a2CatalogSamples;
