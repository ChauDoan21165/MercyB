import type { CEFRLevel, CEFRSubskill, PromptModality } from "../prompts";

export type CalibrationDifficulty = "clear" | "borderline" | "tricky";

export type CalibrationEntry = {
  id: string;
  promptId: string;
  modality: PromptModality;
  expectedLevel: CEFRLevel;
  expectedSubskills: Partial<Record<CEFRSubskill, CEFRLevel>>;
  expectedL1Flags: string[];
  userResponse: string;
  expertNotes: string;
  difficulty: CalibrationDifficulty;
};

export { WRITING_CALIBRATION_CORPUS } from "./writing-corpus";
export { SPEAKING_CALIBRATION_CORPUS } from "./speaking-corpus";
export { READING_CALIBRATION_CORPUS } from "./reading-corpus";
export { LISTENING_CALIBRATION_CORPUS } from "./listening-corpus";

import { LISTENING_CALIBRATION_CORPUS } from "./listening-corpus";
import { READING_CALIBRATION_CORPUS } from "./reading-corpus";
import { SPEAKING_CALIBRATION_CORPUS } from "./speaking-corpus";
import { WRITING_CALIBRATION_CORPUS } from "./writing-corpus";

export const PLACEMENT_V3_CALIBRATION_CORPUS = [
  ...WRITING_CALIBRATION_CORPUS,
  ...SPEAKING_CALIBRATION_CORPUS,
  ...READING_CALIBRATION_CORPUS,
  ...LISTENING_CALIBRATION_CORPUS,
] satisfies CalibrationEntry[];
