// src/languages/punjabi/a2PreA11ChecksumSamples.ts
//
// Punjabi A2 pre-A11 checksum samples for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary. Romanization is a practical
// reading aid, not a phonetic standard. Shahmukhi is mentioned only for
// awareness; this is not a Shahmukhi course. Native review is deferred.
// This is not A11 integration.

import {
  a2RunnerReadinessSamples,
  type PunjabiA2RunnerReadinessLine,
  type PunjabiA2RunnerReadinessScenario,
  type PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2PreA11ChecksumScenario = PunjabiA2RunnerReadinessScenario;

export type PunjabiA2PreA11ChecksumStyle =
  | "pre_a11_checksum"
  | "runner_readiness"
  | "pipeline_readiness"
  | "pre_integration";

export type PunjabiA2PreA11ChecksumItem = {
  id: string;
  scenario: PunjabiA2PreA11ChecksumScenario;
  style: PunjabiA2PreA11ChecksumStyle;
  title_vi: string;
  title_en: string;
  checksum_goal_vi: string;
  checksum_goal_en: string;
  stable_signal_vi: string;
  stable_signal_en: string;
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
  "Gurmukhi là chữ chính trong pre-A11 checksum samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these pre-A11 checksum samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2PreA11ChecksumScenario, PunjabiA2PreA11ChecksumStyle> = {
  daily_routines: "pre_a11_checksum",
  appointments: "runner_readiness",
  transport: "pipeline_readiness",
  housing: "pre_integration",
  school: "pre_a11_checksum",
  childcare: "runner_readiness",
  workplace_small_talk: "pipeline_readiness",
  forms: "pre_integration",
  short_messages: "pre_a11_checksum",
  service_flow: "runner_readiness",
  polite_problem_descriptions: "pipeline_readiness",
  interaction_repair: "pre_integration",
};

const scenarioTitles: Record<PunjabiA2PreA11ChecksumScenario, { vi: string; en: string }> = {
  daily_routines: { vi: "thói quen hằng ngày", en: "daily routines" },
  appointments: { vi: "lịch hẹn", en: "appointments" },
  transport: { vi: "đi lại", en: "transport" },
  housing: { vi: "nhà ở", en: "housing" },
  school: { vi: "trường học", en: "school" },
  childcare: { vi: "childcare pickup", en: "childcare pickup" },
  workplace_small_talk: { vi: "small talk nơi làm", en: "workplace small talk" },
  forms: { vi: "forms", en: "forms" },
  short_messages: { vi: "tin nhắn ngắn", en: "short messages" },
  service_flow: { vi: "luồng dịch vụ", en: "service flow" },
  polite_problem_descriptions: { vi: "mô tả vấn đề lịch sự", en: "polite problem descriptions" },
  interaction_repair: { vi: "sửa chữa tương tác", en: "interaction repair" },
};

export const a2PreA11ChecksumSamples: PunjabiA2PreA11ChecksumItem[] = a2RunnerReadinessSamples.map((item) => {
  const title = scenarioTitles[item.scenario];
  return {
    id: item.id.replace("pa_a2_runner_", "pa_a2_pre_a11_checksum_"),
    scenario: item.scenario,
    style: stylesByScenario[item.scenario],
    title_vi: `Pre-A11 checksum: ${title.vi}`,
    title_en: `Pre-A11 checksum: ${title.en}`,
    checksum_goal_vi: `Chốt checksum trước A11: ${item.runner_goal_vi}`,
    checksum_goal_en: `Pre-A11 checksum lock: ${item.runner_goal_en}`,
    stable_signal_vi: item.stable_signal_vi,
    stable_signal_en: item.stable_signal_en,
    script_awareness_vi: scriptAwarenessVi,
    script_awareness_en: scriptAwarenessEn,
    canada_practical_vi: item.canada_practical_vi,
    canada_practical_en: item.canada_practical_en,
    lines: item.lines,
    checks: item.checks,
    traps: item.traps,
  };
});
