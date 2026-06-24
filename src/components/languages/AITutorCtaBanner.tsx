// src/components/languages/AITutorCtaBanner.tsx
// Thin AI Tutor CTA banner for language lesson pages.
// Vietnamese-first bilingual; gated behind FEATURE_FLAGS.AI_TUTOR_UI_ENABLED.

import { Link } from "react-router-dom";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import {
  isTutorTargetLanguageSupported,
  resolveTutorTargetLanguage,
  type TutorLanguageCode,
} from "@/lib/tutor/languageRegistry";

type AITutorCtaBannerProps = {
  uiLang: string;
  target?: TutorLanguageCode;
};

export default function AITutorCtaBanner({ uiLang, target = "en" }: AITutorCtaBannerProps) {
  if (!FEATURE_FLAGS.AI_TUTOR_UI_ENABLED) return null;
  if (!isTutorTargetLanguageSupported(target)) return null;

  const title =
    uiLang === "en"
      ? "🤖 Practice with AI Tutor"
      : "🤖 Luyện với AI Tutor / Practice with AI Tutor";
  const subtitle =
    uiLang === "en"
      ? "Real AI correction · memory · review"
      : "Sửa lỗi bằng AI thật · ghi nhớ · ôn tập";
  const tutorHref = `/ai-tutor?target=${resolveTutorTargetLanguage(target)}`;

  return (
    <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
      <Link
        to={tutorHref}
        className="block rounded-lg px-2 py-1 transition hover:bg-indigo-100/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <span className="block text-sm font-black text-indigo-800">
          {title}
        </span>
        <span className="mt-1 block text-[11px] font-semibold leading-snug text-indigo-600">
          {subtitle}
        </span>
      </Link>
    </div>
  );
}
