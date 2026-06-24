// src/languages/punjabi/a2PreMergeSamples.ts
//
// Punjabi A2 pre-merge samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2PreA11ChecksumSamples,
  type PunjabiA2PreA11ChecksumScenario,
} from "@/languages/punjabi/a2PreA11ChecksumSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2PreMergeScenario = PunjabiA2PreA11ChecksumScenario;

export type PunjabiA2PreMergeStyle =
  | "pre_merge"
  | "pre_a11_checksum"
  | "runner_readiness"
  | "pre_integration";

export type PunjabiA2PreMergeItem = {
  id: string;
  scenario: PunjabiA2PreMergeScenario;
  style: PunjabiA2PreMergeStyle;
  title_vi: string;
  title_en: string;
  merge_goal_vi: string;
  merge_goal_en: string;
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
  "Gurmukhi là chữ chính trong pre-merge samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these pre-merge samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2PreMergeScenario, PunjabiA2PreMergeStyle> = {
  daily_routines: "pre_merge",
  appointments: "pre_a11_checksum",
  transport: "runner_readiness",
  housing: "pre_integration",
  school: "pre_merge",
  childcare: "pre_a11_checksum",
  workplace_small_talk: "runner_readiness",
  forms: "pre_integration",
  short_messages: "pre_merge",
  service_flow: "pre_a11_checksum",
  polite_problem_descriptions: "runner_readiness",
  interaction_repair: "pre_integration",
};

export const a2PreMergeSamples: PunjabiA2PreMergeItem[] = a2PreA11ChecksumSamples.map((item) => ({
  id: item.id.replace("pa_a2_pre_a11_checksum_", "pa_a2_pre_merge_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: item.title_vi.replace("Pre-A11 checksum", "Pre-merge"),
  title_en: item.title_en.replace("Pre-A11 checksum", "Pre-merge"),
  merge_goal_vi: `Chốt trước merge: ${item.checksum_goal_vi}`,
  merge_goal_en: `Pre-merge lock: ${item.checksum_goal_en}`,
  stable_signal_vi: item.stable_signal_vi,
  stable_signal_en: item.stable_signal_en,
  script_awareness_vi: scriptAwarenessVi,
  script_awareness_en: scriptAwarenessEn,
  canada_practical_vi: item.canada_practical_vi,
  canada_practical_en: item.canada_practical_en,
  lines: item.lines,
  checks: item.checks,
  traps: item.traps,
}));
