import type { NormalizedLesson } from "./LessonRenderer.types";

export type RuntimeLessonIdentity = {
  contentId: string;
  conceptId: string;
  assetId: string;
  targetLanguage: string;
  level: string;
};

export const RUNTIME_LESSON_IDENTITY_BY_MATCH: Record<string, RuntimeLessonIdentity> = {
  "A1|61|Ordering With Modifications": {
    contentId: "MB-SEN-0030953",
    conceptId: "MB-CON-0031698",
    assetId: "MB-SEN-0030953-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|62|Explaining Simple Problems": {
    contentId: "MB-SEN-0030959",
    conceptId: "MB-CON-0031704",
    assetId: "MB-SEN-0030959-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|63|Asking Follow-Up Questions": {
    contentId: "MB-SEN-0030965",
    conceptId: "MB-CON-0031710",
    assetId: "MB-SEN-0030965-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|64|Describing Places": {
    contentId: "MB-SEN-0030971",
    conceptId: "MB-CON-0031716",
    assetId: "MB-SEN-0030971-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|65|Simple Travel Conversations": {
    contentId: "MB-SEN-0030977",
    conceptId: "MB-CON-0031722",
    assetId: "MB-SEN-0030977-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|66|Asking For Recommendations": {
    contentId: "MB-SEN-0030983",
    conceptId: "MB-CON-0031728",
    assetId: "MB-SEN-0030983-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|67|Simple Social Conversations": {
    contentId: "MB-SEN-0030989",
    conceptId: "MB-CON-0031734",
    assetId: "MB-SEN-0030989-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|68|Everyday Polite Conversation Flow": {
    contentId: "MB-SEN-0030995",
    conceptId: "MB-CON-0031740",
    assetId: "MB-SEN-0030995-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|69|Visa And Immigration Office Basics": {
    contentId: "MB-SEN-0031001",
    conceptId: "MB-CON-0031746",
    assetId: "MB-SEN-0031001-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
  "A1|70|Bank Account And ATM Problems": {
    contentId: "MB-SEN-0031006",
    conceptId: "MB-CON-0031751",
    assetId: "MB-SEN-0031006-AUD-VI",
    targetLanguage: "vi",
    level: "A1",
  },
};

export function runtimeLessonIdentityAttrs(lesson: NormalizedLesson) {
  const title = lesson.title.vi ?? lesson.title.en ?? "";
  const identity = RUNTIME_LESSON_IDENTITY_BY_MATCH[`${lesson.level}|${lesson.id}|${title}`];

  if (!identity) return {};

  return {
    "data-testid": "lesson-card",
    "data-content-id": identity.contentId,
    "data-concept-id": identity.conceptId,
    "data-asset-id": identity.assetId,
    "data-target-language": identity.targetLanguage,
    "data-level": identity.level,
  };
}

export const RUNTIME_LESSON_IDENTITY_COUNT = Object.keys(RUNTIME_LESSON_IDENTITY_BY_MATCH).length;
