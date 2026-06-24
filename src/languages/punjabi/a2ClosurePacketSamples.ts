// src/languages/punjabi/a2ClosurePacketSamples.ts
//
// Punjabi A2 closure packet samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2PreMergeSamples,
  type PunjabiA2PreMergeScenario,
} from "@/languages/punjabi/a2PreMergeSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2ClosurePacketScenario = PunjabiA2PreMergeScenario;

export type PunjabiA2ClosurePacketStyle =
  | "pre_a11_closure"
  | "pre_merge"
  | "ci_readiness"
  | "pre_integration";

export type PunjabiA2ClosurePacketItem = {
  id: string;
  scenario: PunjabiA2ClosurePacketScenario;
  style: PunjabiA2ClosurePacketStyle;
  title_vi: string;
  title_en: string;
  closure_goal_vi: string;
  closure_goal_en: string;
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
  "Gurmukhi là chữ chính trong closure packet samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these closure packet samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2ClosurePacketScenario, PunjabiA2ClosurePacketStyle> = {
  daily_routines: "pre_a11_closure",
  appointments: "pre_merge",
  transport: "ci_readiness",
  housing: "pre_integration",
  school: "pre_a11_closure",
  childcare: "pre_merge",
  workplace_small_talk: "ci_readiness",
  forms: "pre_integration",
  short_messages: "pre_a11_closure",
  service_flow: "pre_merge",
  polite_problem_descriptions: "ci_readiness",
  interaction_repair: "pre_integration",
};

const titlePrefixVi = "Closure packet";
const titlePrefixEn = "Closure packet";

export const a2ClosurePacketSamples: PunjabiA2ClosurePacketItem[] = a2PreMergeSamples.map((item) => ({
  id: item.id.replace("pa_a2_pre_merge_", "pa_a2_closure_packet_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `${titlePrefixVi}: ${item.title_vi.replace("Pre-merge: ", "")}`,
  title_en: `${titlePrefixEn}: ${item.title_en.replace("Pre-merge: ", "")}`,
  closure_goal_vi: `Khóa lại trước A11: ${item.merge_goal_vi}`,
  closure_goal_en: `Close out before A11: ${item.merge_goal_en}`,
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
