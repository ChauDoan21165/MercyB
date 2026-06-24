// Punjabi B1 signoff samples for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization supports recognition. Shahmukhi
// is awareness only, not a full course. Native review is deferred. This is
// not A11 integration.

import {
  punjabiB1SealSamples,
  type PunjabiB1SealCard,
  type PunjabiB1SealFocus,
  type PunjabiSealCheck,
  type PunjabiSealLine,
  type PunjabiSealTrap,
} from "@/languages/punjabi/b1SealSamples";

export type PunjabiB1SignoffStyle =
  | "pre_a11_signoff"
  | "pre_a11_seal"
  | "pre_a11_snapshot"
  | "pre_merge"
  | "qa"
  | "pre_integration"
  | "readiness_check";

export type PunjabiSignoffCheck = {
  signoffPrompt_en: string;
  signoffPrompt_vi: string;
  sampleLine: PunjabiSealLine;
  signoffSignals_en: string[];
  signoffSignals_vi: string[];
};

export type PunjabiB1SignoffCard = {
  id: string;
  level: "B1";
  focus: PunjabiB1SealFocus;
  style: PunjabiB1SignoffStyle;
  title_en: string;
  title_vi: string;
  scenario_en: string;
  scenario_vi: string;
  canadaContext: string;
  preA11SignoffCheck: PunjabiSignoffCheck;
  commonTraps: PunjabiSealTrap[];
  runnerReadinessNote_en: string;
  runnerReadinessNote_vi: string;
  preIntegrationRoute_en: string;
  preIntegrationRoute_vi: string;
};

const styleByFocus: Record<PunjabiB1SealFocus, PunjabiB1SignoffStyle> = {
  situation_explanation: "pre_a11_signoff",
  event_retelling: "pre_a11_snapshot",
  clarification: "pre_a11_seal",
  service_recovery: "pre_merge",
  issue_resolution: "qa",
  follow_up_message: "pre_a11_signoff",
  workplace_task: "pre_integration",
  housing_school_community: "pre_a11_snapshot",
  register_safe_repair: "readiness_check",
};

const titlePrefixEn = "Signoff";
const titlePrefixVi = "Xác nhận";

function toSignoffCheck(check: PunjabiSealCheck): PunjabiSignoffCheck {
  return {
    signoffPrompt_en: check.sealPrompt_en,
    signoffPrompt_vi: check.sealPrompt_vi,
    sampleLine: check.sampleLine,
    signoffSignals_en: check.sealSignals_en,
    signoffSignals_vi: check.sealSignals_vi,
  };
}

export const punjabiB1SignoffSamples: PunjabiB1SignoffCard[] = punjabiB1SealSamples.map(
  (card: PunjabiB1SealCard) => ({
    id: card.id.replace("b1-seal-", "b1-signoff-"),
    level: "B1",
    focus: card.focus,
    style: styleByFocus[card.focus],
    title_en: `${titlePrefixEn} ${card.title_en.replace("Seal ", "")}`,
    title_vi: `${titlePrefixVi}: ${card.title_vi.replace("con dấu", "xác nhận")}`,
    scenario_en: card.scenario_en,
    scenario_vi: card.scenario_vi,
    canadaContext: card.canadaContext,
    preA11SignoffCheck: toSignoffCheck(card.preA11SealCheck),
    commonTraps: card.commonTraps,
    runnerReadinessNote_en: card.runnerReadinessNote_en.replace("seal", "signoff"),
    runnerReadinessNote_vi: card.runnerReadinessNote_vi.replace("con dấu", "xác nhận"),
    preIntegrationRoute_en: card.preIntegrationRoute_en,
    preIntegrationRoute_vi: card.preIntegrationRoute_vi,
  }),
);

export default punjabiB1SignoffSamples;
