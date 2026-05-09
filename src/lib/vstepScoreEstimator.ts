// src/lib/vstepScoreEstimator.ts
//
// Pure-function VSTEP score estimator.
// Input: raw scores per skill.
// Output: estimated overall band, per-skill bands, and summaries.
//
// VSTEP scoring model (simplified from official MoET guidelines):
//   Listening: max 35 questions → raw = correct answers
//   Reading:   max 40 questions  → raw = correct answers
//   Writing:   max 10 points     → raw = examiner score (0–10)
//   Speaking:  max 10 points     → raw = examiner score (0–10)
//
// Band thresholds:
//   Below B1: overall < 4.0
//   B1:       4.0 – 5.5
//   B2:       6.0 – 8.0
//   C1:       8.5 – 10.0

import type { VstepSkillScore, VstepEstimatedResult } from "../types/vstep";

export interface VstepEstimatorInput {
  listening: VstepSkillScore;
  reading: VstepSkillScore;
  writing: VstepSkillScore;
  speaking: VstepSkillScore;
}

export interface VstepSkillConfig {
  label: string;
  label_vi: string;
  maxRaw: number;
}

export const VSTEP_SKILL_CONFIGS: Record<keyof VstepEstimatorInput, VstepSkillConfig> = {
  listening: { label: "Listening", label_vi: "Nghe", maxRaw: 35 },
  reading: { label: "Reading", label_vi: "Đọc", maxRaw: 40 },
  writing: { label: "Writing", label_vi: "Viết", maxRaw: 10 },
  speaking: { label: "Speaking", label_vi: "Nói", maxRaw: 10 },
};

function rawToBand(raw: number, maxRaw: number): "B1" | "B2" | "C1" | null {
  const normalized = (raw / maxRaw) * 10;

  if (normalized >= 8.5) return "C1";
  if (normalized >= 6.0) return "B2";
  if (normalized >= 4.0) return "B1";
  return null;
}

function bandToNumber(band: "B1" | "B2" | "C1" | null): number {
  switch (band) {
    case "C1": return 8.5;
    case "B2": return 7.0;
    case "B1": return 5.0;
    default: return 3.0;
  }
}

function numberToOverallBand(score: number): "B1" | "B2" | "C1" | null {
  if (score >= 8.5) return "C1";
  if (score >= 6.0) return "B2";
  if (score >= 4.0) return "B1";
  return null;
}

const BAND_LABELS: Record<string, { en: string; vi: string }> = {
  C1: { en: "C1 (Advanced)", vi: "C1 (Nâng cao)" },
  B2: { en: "B2 (Upper-Intermediate)", vi: "B2 (Trung cấp trên)" },
  B1: { en: "B1 (Intermediate)", vi: "B1 (Trung cấp)" },
};

export function estimateVstepScore(input: VstepEstimatorInput): VstepEstimatedResult {
  const skills = {
    listening: rawToBand(input.listening.raw, VSTEP_SKILL_CONFIGS.listening.maxRaw),
    reading: rawToBand(input.reading.raw, VSTEP_SKILL_CONFIGS.reading.maxRaw),
    writing: rawToBand(input.writing.raw, VSTEP_SKILL_CONFIGS.writing.maxRaw),
    speaking: rawToBand(input.speaking.raw, VSTEP_SKILL_CONFIGS.speaking.maxRaw),
  };

  // Overall is the average of per-skill numeric equivalents
  const skillBands = [skills.listening, skills.reading, skills.writing, skills.speaking];
  const avgScore = skillBands.reduce((sum, b) => sum + bandToNumber(b), 0) / skillBands.length;
  const overallBand = numberToOverallBand(avgScore);

  // Build summaries
  const skillLabels: string[] = [];
  for (const key of ["listening", "reading", "writing", "speaking"] as const) {
    const band = skills[key];
    const config = VSTEP_SKILL_CONFIGS[key];
    const label = band ? BAND_LABELS[band]!.en : "Below B1";
    skillLabels.push(`${config.label}: ${label}`);
  }

  const overallLabel = overallBand ? BAND_LABELS[overallBand]!.en : "Below B1";
  const summary_en = `Estimated overall: ${overallLabel}. Skills: ${skillLabels.join("; ")}.`;
  const summary_vi = `Ước tính tổng thể: ${overallBand ? BAND_LABELS[overallBand]!.vi : "Dưới B1"}. Kỹ năng: ${skillLabels.join("; ")}.`;

  return {
    overallBand,
    skills,
    summary_en,
    summary_vi,
  };
}
