// src/languages/punjabi/a2SealSamples.ts
//
// Punjabi A2 seal samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2SnapshotSamples,
  type PunjabiA2SnapshotScenario,
} from "@/languages/punjabi/a2SnapshotSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2SealScenario = PunjabiA2SnapshotScenario;

export type PunjabiA2SealStyle =
  | "pre_a11_seal"
  | "pre_a11_snapshot"
  | "pre_a11_closure"
  | "pre_merge"
  | "ci_readiness"
  | "pre_integration";

export type PunjabiA2SealItem = {
  id: string;
  scenario: PunjabiA2SealScenario;
  style: PunjabiA2SealStyle;
  title_vi: string;
  title_en: string;
  seal_goal_vi: string;
  seal_goal_en: string;
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
  "Gurmukhi là chữ chính trong seal samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these seal samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2SealScenario, PunjabiA2SealStyle> = {
  daily_routines: "pre_a11_seal",
  appointments: "pre_a11_snapshot",
  transport: "pre_a11_closure",
  housing: "pre_merge",
  school: "ci_readiness",
  childcare: "pre_a11_seal",
  workplace_small_talk: "pre_a11_snapshot",
  forms: "pre_a11_closure",
  short_messages: "pre_merge",
  service_flow: "ci_readiness",
  polite_problem_descriptions: "pre_integration",
  interaction_repair: "pre_a11_seal",
};

const titlePrefixVi = "Seal";
const titlePrefixEn = "Seal";

export const a2SealSamples: PunjabiA2SealItem[] = a2SnapshotSamples.map((item) => ({
  id: item.id.replace("pa_a2_snapshot_", "pa_a2_seal_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `${titlePrefixVi}: ${item.title_vi.replace("Snapshot: ", "")}`,
  title_en: `${titlePrefixEn}: ${item.title_en.replace("Snapshot: ", "")}`,
  seal_goal_vi: `Niêm phong trước A11: ${item.snapshot_goal_vi}`,
  seal_goal_en: `Seal before A11: ${item.snapshot_goal_en}`,
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
