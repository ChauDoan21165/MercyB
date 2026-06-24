// src/languages/punjabi/a2SnapshotSamples.ts
//
// Punjabi A2 snapshot samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is mentioned only for awareness; this is not
// a Shahmukhi course. Native review is deferred. This is not A11 integration.

import {
  a2ClosurePacketSamples,
  type PunjabiA2ClosurePacketScenario,
} from "@/languages/punjabi/a2ClosurePacketSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2SnapshotScenario = PunjabiA2ClosurePacketScenario;

export type PunjabiA2SnapshotStyle =
  | "pre_a11_snapshot"
  | "pre_a11_closure"
  | "pre_merge"
  | "ci_readiness"
  | "pre_integration";

export type PunjabiA2SnapshotItem = {
  id: string;
  scenario: PunjabiA2SnapshotScenario;
  style: PunjabiA2SnapshotStyle;
  title_vi: string;
  title_en: string;
  snapshot_goal_vi: string;
  snapshot_goal_en: string;
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
  "Gurmukhi là chữ chính trong snapshot samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these snapshot samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2SnapshotScenario, PunjabiA2SnapshotStyle> = {
  daily_routines: "pre_a11_snapshot",
  appointments: "pre_a11_closure",
  transport: "pre_merge",
  housing: "ci_readiness",
  school: "pre_a11_snapshot",
  childcare: "pre_a11_closure",
  workplace_small_talk: "pre_merge",
  forms: "ci_readiness",
  short_messages: "pre_a11_snapshot",
  service_flow: "pre_a11_closure",
  polite_problem_descriptions: "pre_merge",
  interaction_repair: "pre_integration",
};

const titlePrefixVi = "Snapshot";
const titlePrefixEn = "Snapshot";

export const a2SnapshotSamples: PunjabiA2SnapshotItem[] = a2ClosurePacketSamples.map((item) => ({
  id: item.id.replace("pa_a2_closure_packet_", "pa_a2_snapshot_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `${titlePrefixVi}: ${item.title_vi.replace("Closure packet: ", "")}`,
  title_en: `${titlePrefixEn}: ${item.title_en.replace("Closure packet: ", "")}`,
  snapshot_goal_vi: `Chụp snapshot trước A11: ${item.closure_goal_vi}`,
  snapshot_goal_en: `Capture snapshot before A11: ${item.closure_goal_en}`,
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
