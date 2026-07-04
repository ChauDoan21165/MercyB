import { Link } from "react-router-dom";
import * as SwahiliContent from "@/languages/swahili";

type SwahiliLessonCard = {
  id?: string;
  title?: string;
  level?: string;
  english?: string;
  swahili?: string;
  native?: string;
  translation?: string;
  prompt?: string;
  text?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const looksLikeLesson = (value: unknown): value is SwahiliLessonCard => {
  if (!isRecord(value)) return false;
  return [
    value.id,
    value.title,
    value.english,
    value.swahili,
    value.native,
    value.translation,
    value.prompt,
    value.text,
  ].some((field) => typeof field === "string" && field.length > 0);
};

const collectLessons = (value: unknown, seen = new Set<unknown>()): SwahiliLessonCard[] => {
  if (typeof value === "object" && value !== null) {
    if (seen.has(value)) return [];
    seen.add(value);
  }

  if (Array.isArray(value)) {
    const directLessons = value.filter(looksLikeLesson);
    if (directLessons.length > 0) return directLessons;
    return value.flatMap((item) => collectLessons(item, seen));
  }

  if (isRecord(value)) {
    return Object.values(value).flatMap((item) => collectLessons(item, seen));
  }

  return [];
};

const lessonKey = (lesson: SwahiliLessonCard, index: number) =>
  lesson.id ?? `${lesson.level ?? "sw"}-${lesson.title ?? lesson.english ?? index}`;

export const swahiliLessons = collectLessons(SwahiliContent);

export default function SwahiliLessonsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8" data-testid="swahili-lessons-page">
      <nav className="mb-6 text-sm">
        <Link className="text-blue-700 hover:underline" to="/languages">
          Back to languages
        </Link>
      </nav>

      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Kiswahili</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Swahili Lessons</h1>
        <p className="mt-3 text-slate-700">
          Browse locally bundled Swahili lesson content from the MercyB language curriculum.
        </p>
        <p className="mt-2 text-sm text-slate-600">{swahiliLessons.length} local lessons available</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Swahili lesson samples">
        {swahiliLessons.slice(0, 24).map((lesson, index) => (
          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={lessonKey(lesson, index)}>
            <p className="text-xs font-semibold uppercase text-emerald-700">{lesson.level ?? "Swahili"}</p>
            <h2 className="mt-1 font-semibold text-slate-950">
              {lesson.title ?? lesson.english ?? lesson.swahili ?? `Swahili lesson ${index + 1}`}
            </h2>
            {lesson.swahili ? <p className="mt-2 text-sm text-slate-700">{lesson.swahili}</p> : null}
            {lesson.english ? <p className="mt-1 text-sm text-slate-600">{lesson.english}</p> : null}
          </article>
        ))}
      </section>
    </main>
  );
}
