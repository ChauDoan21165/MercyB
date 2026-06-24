// src/languages/punjabi/a2LedgerSamples.ts
//
// Punjabi A2 ledger samples for Vietnamese-speaking and English-speaking
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

export type PunjabiA2LedgerScenario = PunjabiA2SnapshotScenario;

export type PunjabiA2LedgerStyle =
  | "pre_a11_ledger"
  | "signoff"
  | "ledger_copy"
  | "pre_merge"
  | "qa"
  | "pre_integration"
  | "readiness_check";

export type PunjabiA2LedgerItem = {
  id: string;
  scenario: PunjabiA2LedgerScenario;
  style: PunjabiA2LedgerStyle;
  title_vi: string;
  title_en: string;
  ledger_goal_vi: string;
  ledger_goal_en: string;
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
  "Gurmukhi là chữ chính trong ledger samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these ledger samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2LedgerScenario, PunjabiA2LedgerStyle> = {
  daily_routines: "pre_a11_ledger",
  appointments: "signoff",
  transport: "ledger_copy",
  housing: "pre_merge",
  school: "qa",
  childcare: "pre_a11_ledger",
  workplace_small_talk: "signoff",
  forms: "pre_merge",
  short_messages: "ledger_copy",
  service_flow: "qa",
  polite_problem_descriptions: "pre_integration",
  interaction_repair: "readiness_check",
};

export const a2LedgerSamples: PunjabiA2LedgerItem[] = a2SnapshotSamples.map((item) => ({
  id: item.id.replace("pa_a2_snapshot_", "pa_a2_ledger_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `Ledger: ${item.title_vi.replace("Snapshot: ", "")}`,
  title_en: `Ledger: ${item.title_en.replace("Snapshot: ", "")}`,
  ledger_goal_vi: `Lưu ledger trước A11: ${item.snapshot_goal_vi}`,
  ledger_goal_en: `Ledger before A11: ${item.snapshot_goal_en}`,
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

export default a2LedgerSamples;

