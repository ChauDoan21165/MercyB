import { en } from "./en";
import { fr } from "./fr";
import { zh } from "./zh";
import { de } from "./de";
import { ja } from "./ja";
import { ko } from "./ko";
import { es } from "./es";
import { vi } from "./vi";
import type { TutorLanguagePack, TutorTarget } from "../tutorCopy";

export const TUTOR_LANGUAGE_PACKS: Record<TutorTarget, TutorLanguagePack> = {
  en,
  fr,
  zh,
  de,
  ja,
  ko,
  es,
  vi,
};

export { en, fr, zh, de, ja, ko, es, vi };
