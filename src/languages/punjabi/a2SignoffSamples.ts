// src/languages/punjabi/a2SignoffSamples.ts
//
// Punjabi A2 signoff samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2SealSamples,
  type PunjabiA2SealScenario,
} from "@/languages/punjabi/a2SealSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2SignoffScenario = PunjabiA2SealScenario;

export type PunjabiA2SignoffStyle =
  | "pre_a11_signoff"
  | "pre_a11_seal"
  | "pre_a11_snapshot"
  | "pre_merge"
  | "ci_readiness"
  | "pre_integration";

export type PunjabiA2SignoffItem = {
  id: string;
  scenario: PunjabiA2SignoffScenario;
  style: PunjabiA2SignoffStyle;
  title_vi: string;
  title_en: string;
  signoff_goal_vi: string;
  signoff_goal_en: string;
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
  "Gurmukhi là chữ chính trong signoff samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these signoff samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2SignoffScenario, PunjabiA2SignoffStyle> = {
  daily_routines: "pre_a11_signoff",
  appointments: "pre_a11_seal",
  transport: "pre_a11_snapshot",
  housing: "pre_merge",
  school: "ci_readiness",
  childcare: "pre_a11_signoff",
  workplace_small_talk: "pre_a11_seal",
  forms: "pre_a11_snapshot",
  short_messages: "pre_merge",
  service_flow: "ci_readiness",
  polite_problem_descriptions: "pre_integration",
  interaction_repair: "pre_a11_signoff",
};

const titlePrefixVi = "Signoff";
const titlePrefixEn = "Signoff";

export const a2SignoffSamples: PunjabiA2SignoffItem[] = a2SealSamples.map((item) => ({
  id: item.id.replace("pa_a2_seal_", "pa_a2_signoff_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `${titlePrefixVi}: ${item.title_vi.replace("Seal: ", "")}`,
  title_en: `${titlePrefixEn}: ${item.title_en.replace("Seal: ", "")}`,
  signoff_goal_vi: `Ký xác nhận A2: ${item.seal_goal_vi}`,
  signoff_goal_en: `Sign off A2: ${item.seal_goal_en}`,
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
