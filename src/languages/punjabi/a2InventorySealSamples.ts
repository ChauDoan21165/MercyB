// src/languages/punjabi/a2InventorySealSamples.ts
//
// Punjabi A2 inventory-seal samples for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred.
// This is not A11 integration.

import {
  a2CatalogSamples,
  type PunjabiA2CatalogScenario,
} from "@/languages/punjabi/a2CatalogSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2InventorySealScenario = PunjabiA2CatalogScenario;

export type PunjabiA2InventorySealStyle =
  | "pre_a11_inventory_seal"
  | "catalog_seal"
  | "bundle_seal"
  | "receipt_seal"
  | "ledger_seal"
  | "pre_integration_seal"
  | "readiness_seal";

export type PunjabiA2InventorySealItem = {
  id: string;
  scenario: PunjabiA2InventorySealScenario;
  style: PunjabiA2InventorySealStyle;
  title_vi: string;
  title_en: string;
  inventory_seal_goal_vi: string;
  inventory_seal_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
  seal_note_vi: string;
  seal_note_en: string;
  catalog_reference_vi: string;
  catalog_reference_en: string;
  bundle_reference_vi: string;
  bundle_reference_en: string;
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
  "Gurmukhi là chữ chính trong inventory-seal samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these inventory-seal samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2InventorySealScenario, PunjabiA2InventorySealStyle> = {
  daily_routines: "pre_a11_inventory_seal",
  appointments: "catalog_seal",
  transport: "bundle_seal",
  housing: "receipt_seal",
  school: "ledger_seal",
  childcare: "pre_a11_inventory_seal",
  workplace_small_talk: "catalog_seal",
  forms: "bundle_seal",
  short_messages: "receipt_seal",
  service_flow: "ledger_seal",
  polite_problem_descriptions: "pre_integration_seal",
  interaction_repair: "readiness_seal",
};

const sealNotes: Record<
  PunjabiA2InventorySealScenario,
  { vi: string; en: string }
> = {
  daily_routines: {
    vi: "Inventory seal khóa giờ, thứ tự hoạt động, và câu quá khứ ngắn trước A11.",
    en: "Inventory seal locks time, activity order, and the short past sentence before A11.",
  },
  appointments: {
    vi: "Inventory seal khóa ngày hẹn, giờ hẹn, giấy tờ, và câu đổi lịch có điều kiện.",
    en: "Inventory seal locks appointment day, time, documents, and conditional reschedule wording.",
  },
  transport: {
    vi: "Inventory seal khóa tuyến, điểm xuống, và số phút trễ trong tình huống đi lại.",
    en: "Inventory seal locks route, stop, and delay minutes in the transport scenario.",
  },
  housing: {
    vi: "Inventory seal khóa vấn đề nhà ở, thời điểm bắt đầu, và yêu cầu sửa lịch sự.",
    en: "Inventory seal locks housing issue, start time, and polite repair request.",
  },
  school: {
    vi: "Inventory seal khóa lý do vắng học và yêu cầu homework qua email.",
    en: "Inventory seal locks absence reason and homework-by-email request.",
  },
  childcare: {
    vi: "Inventory seal khóa người đón thay và pickup list để không đổi vai.",
    en: "Inventory seal locks alternate pickup person and pickup list so roles do not shift.",
  },
  workplace_small_talk: {
    vi: "Inventory seal khóa small talk ngắn, lịch sự, và đúng mức A2.",
    en: "Inventory seal locks short, polite small talk at the A2 level.",
  },
  forms: {
    vi: "Inventory seal khóa tên form, trường còn thiếu, và câu xin trợ giúp.",
    en: "Inventory seal locks form name, missing field, and help request.",
  },
  short_messages: {
    vi: "Inventory seal khóa tin nhắn ngắn với thời gian, lý do, và lời xin lỗi.",
    en: "Inventory seal locks the short message with time, reason, and apology.",
  },
  service_flow: {
    vi: "Inventory seal khóa thứ tự service flow: yêu cầu, xác nhận, và cảm ơn.",
    en: "Inventory seal locks service-flow order: request, confirmation, and thanks.",
  },
  polite_problem_descriptions: {
    vi: "Inventory seal khóa mô tả vấn đề lịch sự và đúng vật bị lỗi.",
    en: "Inventory seal locks the polite problem description and the correct faulty item.",
  },
  interaction_repair: {
    vi: "Inventory seal khóa câu hỏi lại, xác nhận, và xin nói chậm hơn.",
    en: "Inventory seal locks asking again, confirming, and requesting slower speech.",
  },
};

export const a2InventorySealSamples: PunjabiA2InventorySealItem[] = a2CatalogSamples.map((item) => ({
  id: item.id.replace("pa_a2_catalog_", "pa_a2_inventory_seal_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Inventory seal: ${item.title_vi.replace("Catalog: ", "")}`,
  title_en: `Inventory seal: ${item.title_en.replace("Catalog: ", "")}`,
  inventory_seal_goal_vi: `Niêm phong inventory trước A11: ${item.catalog_goal_vi.replace("Ghi catalog trước A11: ", "")}`,
  inventory_seal_goal_en: `Seal inventory before A11: ${item.catalog_goal_en.replace("Catalog before A11: ", "")}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  seal_note_vi: sealNotes[item.scenario].vi,
  seal_note_en: sealNotes[item.scenario].en,
  catalog_reference_vi: item.catalog_note_vi,
  catalog_reference_en: item.catalog_note_en,
  bundle_reference_vi: item.bundle_reference_vi,
  bundle_reference_en: item.bundle_reference_en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));

export default a2InventorySealSamples;
