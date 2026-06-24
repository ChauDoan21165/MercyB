import { Link } from "react-router-dom";
import { useUiLanguage } from "@/contexts/UiLanguageContext";
import * as Course from "@/languages/punjabi";

type UiLang = "vi" | "en";
type LessonLike = Record<string, unknown>;

const FALLBACK_LESSONS: LessonLike[] = [
  { id: 'punjabi-starter-1', level: 'A1', titleVi: 'Chào hỏi Punjabi cơ bản', titleEn: 'Basic Punjabi greetings', descriptionVi: 'Bài đầu tiên dùng chữ Gurmukhi làm chính.', descriptionEn: 'The first lesson uses Gurmukhi as the primary script.' },
  { id: 'punjabi-starter-2', level: 'A1', titleVi: 'Tên và giới thiệu', titleEn: 'Names and introductions', descriptionVi: 'Nói tên, quê quán, và câu lịch sự đơn giản.', descriptionEn: 'Say your name, where you are from, and simple polite phrases.' },
  { id: 'punjabi-starter-3', level: 'A1', titleVi: "Đại từ và 'là/ở'", titleEn: "Pronouns and 'to be'", descriptionVi: 'Tập câu ngắn cho giao tiếp căn bản.', descriptionEn: 'Practice short sentences for basic communication.' },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return undefined;
}

function chooseUiLang(api: unknown): UiLang {
  if (api === "en" || api === "english") return "en";
  if (api === "vi" || api === "vietnamese") return "vi";

  const record = isRecord(api) ? api : {};
  const candidates = [
    record.uiLang,
    record.language,
    record.lang,
    record.locale,
    record.currentLanguage,
    record.currentLocale,
    record.selectedLanguage,
    record.displayLanguage,
    record.translationLanguage,
    record.value,
  ];

  for (const candidate of candidates) {
    const value = textValue(candidate)?.toLowerCase();
    if (!value) continue;
    if (value === "en" || value.startsWith("en-") || value.includes("english")) return "en";
    if (value === "vi" || value.startsWith("vi-") || value.includes("vietnamese")) return "vi";
  }

  if (typeof window !== "undefined") {
    const storageKeys = [
      "uiLanguage",
      "uiLang",
      "language",
      "locale",
      "mercyblade-ui-language",
      "mercy-ui-language",
      "mb-ui-language",
    ];

    for (const key of storageKeys) {
      const value = window.localStorage.getItem(key)?.toLowerCase();
      if (!value) continue;
      if (value === "en" || value.startsWith("en-") || value.includes("english")) return "en";
      if (value === "vi" || value.startsWith("vi-") || value.includes("vietnamese")) return "vi";
    }
  }

  return "vi";
}

function looksLikeLesson(value: unknown): value is LessonLike {
  if (!isRecord(value)) return false;
  const keys = [
    "id",
    "slug",
    "level",
    "title",
    "titleVi",
    "titleEn",
    "name",
    "topic",
    "description",
    "descriptionVi",
    "descriptionEn",
    "summary",
    "objective",
    "phrases",
    "dialogue",
    "vocabulary",
  ];
  return keys.filter((key) => key in value).length >= 2;
}

function collectLessons(value: unknown, depth = 0, seen = new Set<unknown>()): LessonLike[] {
  if (depth > 4) return [];

  if (Array.isArray(value)) {
    const lessonRecords = value.filter(looksLikeLesson);
    if (lessonRecords.length > 0) return lessonRecords;
    return value.flatMap((item) => collectLessons(item, depth + 1, seen));
  }

  if (!isRecord(value) || seen.has(value)) return [];
  seen.add(value);

  return Object.entries(value)
    .filter(([key]) => !key.startsWith("__"))
    .flatMap(([, child]) => collectLessons(child, depth + 1, seen));
}

function pickText(lesson: LessonLike, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = textValue(lesson[key]);
    if (value) return value;
  }
  return fallback;
}

function dedupeLessons(lessons: LessonLike[]): LessonLike[] {
  const seen = new Set<string>();
  const out: LessonLike[] = [];

  for (const lesson of lessons) {
    const key = pickText(
      lesson,
      ["id", "slug", "title", "titleEn", "titleVi", "name", "topic"],
      `lesson-${out.length}`,
    );

    if (seen.has(key)) continue;
    seen.add(key);
    out.push(lesson);
  }

  return out;
}

const COURSE_LESSONS = dedupeLessons(collectLessons(Course as Record<string, unknown>));
const DISPLAY_LESSONS = (COURSE_LESSONS.length > 0 ? COURSE_LESSONS : FALLBACK_LESSONS).slice(0, 80);

export default function PunjabiLessonsPage() {
  const uiApi = useUiLanguage();
  const uiLang = chooseUiLang(uiApi);

  const intro = uiLang === "en" ? "Practical Punjabi lessons with Gurmukhi as the primary script and Canada survival context where useful." : "Bài học Punjabi thực dụng với Gurmukhi làm chữ chính, kèm ngữ cảnh sinh tồn Canada khi phù hợp.";
  const scriptNote = uiLang === "en" ? "Gurmukhi is the primary script; romanization is only a bridge. Shahmukhi is awareness-only unless a future full track is approved." : "Gurmukhi là chữ chính; romanization chỉ là cầu đọc. Shahmukhi chỉ để nhận biết nếu chưa có track đầy đủ.";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/languages" className="font-semibold text-blue-700 hover:text-blue-900">
        ← {uiLang === "en" ? "View other languages" : "Xem ngôn ngữ khác"} / {uiLang === "en" ? "Xem ngôn ngữ khác" : "View other languages"}
      </Link>

      <section className="mt-8 rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-blue-100">ਪੰਜਾਬੀ</p>
        <h1 className="mt-4 text-4xl font-black">Punjabi lessons</h1>
        <p className="mt-5 max-w-4xl text-xl leading-8 text-slate-100">{intro}</p>
        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">{scriptNote}</p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {DISPLAY_LESSONS.map((lesson, index) => {
          const title = uiLang === "en"
            ? pickText(lesson, ["titleEn", "title", "name", "topic", "slug", "id"], `Punjabi lesson`)
            : pickText(lesson, ["titleVi", "title", "name", "topic", "slug", "id"], `Bài học Punjabi`);

          const description = uiLang === "en"
            ? pickText(lesson, ["descriptionEn", "description", "summary", "objective"], scriptNote)
            : pickText(lesson, ["descriptionVi", "description", "summary", "objective"], scriptNote);

          const level = pickText(lesson, ["level", "cefr", "tier"], "A1");

          return (
            <article key={`${String(pickText(lesson, ["id", "slug"], "lesson"))}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">{level}</span>
              </div>
              <p className="mt-4 leading-7 text-slate-700">{description}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
