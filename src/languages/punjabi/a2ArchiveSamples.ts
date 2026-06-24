// src/languages/punjabi/a2ArchiveSamples.ts
//
// Punjabi A2 archive samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary. Romanization is a practical reading aid, not
// a phonetic standard. Shahmukhi is awareness only, not a full course. Native
// review is deferred. This is not A11 integration.

import {
  a2SnapshotSamples,
  type PunjabiA2SnapshotScenario,
} from "@/languages/punjabi/a2SnapshotSamples";
import type {
  PunjabiA2RunnerReadinessLine,
  PunjabiA2RunnerReadinessTrap,
} from "@/languages/punjabi/a2RunnerReadinessSamples";

export type PunjabiA2ArchiveScenario = PunjabiA2SnapshotScenario;

export type PunjabiA2ArchiveStyle =
  | "pre_a11_archive"
  | "signoff"
  | "archive_copy"
  | "pre_merge"
  | "qa"
  | "pre_integration"
  | "readiness_check";

export type PunjabiA2ArchiveItem = {
  id: string;
  scenario: PunjabiA2ArchiveScenario;
  style: PunjabiA2ArchiveStyle;
  title_vi: string;
  title_en: string;
  archive_goal_vi: string;
  archive_goal_en: string;
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
  "Gurmukhi là chữ chính trong archive samples; Shahmukhi chỉ được nhắc để nhận biết, không phải khóa riêng.";
const scriptAwarenessEn =
  "Gurmukhi is the main script in these archive samples; Shahmukhi is mentioned only for awareness, not as a separate course.";

const stylesByScenario: Record<PunjabiA2ArchiveScenario, PunjabiA2ArchiveStyle> = {
  daily_routines: "pre_a11_archive",
  appointments: "signoff",
  transport: "archive_copy",
  housing: "pre_merge",
  school: "qa",
  childcare: "pre_a11_archive",
  workplace_small_talk: "signoff",
  forms: "pre_merge",
  short_messages: "archive_copy",
  service_flow: "qa",
  polite_problem_descriptions: "pre_integration",
  interaction_repair: "readiness_check",
};

const titlePrefixVi = "Archive";
const titlePrefixEn = "Archive";

export const a2ArchiveSamples: PunjabiA2ArchiveItem[] = a2SnapshotSamples.map((item) => ({
  id: item.id.replace("pa_a2_snapshot_", "pa_a2_archive_"),
  scenario: item.scenario,
  style: stylesByScenario[item.scenario],
  title_vi: `${titlePrefixVi}: ${item.title_vi.replace("Snapshot: ", "")}`,
  title_en: `${titlePrefixEn}: ${item.title_en.replace("Snapshot: ", "")}`,
  archive_goal_vi: `Lưu archive trước A11: ${item.snapshot_goal_vi}`,
  archive_goal_en: `Archive before A11: ${item.snapshot_goal_en}`,
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

export default a2ArchiveSamples;
