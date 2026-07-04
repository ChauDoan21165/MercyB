import { en } from "./en";
import { fr } from "./fr";
import { zh } from "./zh";
import { de } from "./de";
import { ja } from "./ja";
import { ko } from "./ko";
import { es } from "./es";
import { vi } from "./vi";
import { tr } from "./tr";
import { ru } from "./ru";
import th from "./th";
import type { TutorLanguagePack, TutorTarget } from "../tutorCopyTypes";

export const TUTOR_LANGUAGE_PACKS: Record<TutorTarget, TutorLanguagePack> = {
  en,
  th,
  fr,
  zh,
  de,
  ja,
  ko,
  es,
  vi,
  tr,
  ru,
};

export { en, fr, zh, de, ja, ko, es, vi, tr, ru };
