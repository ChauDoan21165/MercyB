import * as ItalianContent from "@/languages/italian";

type LessonRecord = Record<string, unknown>;

export type ItalianLessonCard = {
  key: string;
  title: string;
  level: string;
  description?: string;
};

const isRecord = (value: unknown): value is LessonRecord =>
  typeof value === "object" && value !== null;

const textValue = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

const collectRawLessonItems = (value: unknown, seen = new Set<unknown>()): unknown[] => {
  if (!value || seen.has(value)) return [];
  if (typeof value === "object") seen.add(value);

  if (Array.isArray(value)) {
    return value.length > 0 ? value : [];
  }

  if (!isRecord(value)) return [];

  return Object.values(value).flatMap((item) => collectRawLessonItems(item, seen));
};

const cardFromRecord = (record: LessonRecord, index: number): ItalianLessonCard => ({
  key: textValue(record.id, record.slug, record.lessonId, record.contentId, record.key) ?? `italian-lesson-${index}`,
  title:
    textValue(
      record.title,
      record.name,
      record.label,
      record.prompt,
      record.italian,
      record.italianText,
      record.nativeText,
      record.text,
      record.sentence,
      record.phrase,
      record.question,
      record.english,
      record.englishText,
      record.translation,
    ) ?? `Italian lesson ${index + 1}`,
  level: textValue(record.level, record.cefr, record.unit, record.stage, record.category) ?? "Italian",
  description: textValue(
    record.description,
    record.summary,
    record.english,
    record.englishText,
    record.translation,
    record.answer,
    record.gloss,
  ),
});

const toCard = (item: unknown, index: number): ItalianLessonCard | null => {
  if (typeof item === "string" && item.trim().length > 0) {
    return { key: `italian-text-${index}`, title: item, level: "Italian" };
  }

  if (!isRecord(item)) return null;
  return cardFromRecord(item, index);
};

export const italianLessons = collectRawLessonItems(ItalianContent)
  .map(toCard)
  .filter((lesson): lesson is ItalianLessonCard => lesson !== null);

export default function ItalianLessonsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6" data-testid="italian-lessons-page">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Italian</p>
        <h1 className="text-2xl font-bold text-slate-950">Italian lessons</h1>
        <p className="mt-2 text-sm text-slate-700">
          Local Italian lesson content is loaded from the bundled language curriculum.
        </p>
      </header>

      <section aria-label="Italian lesson list" className="grid gap-3">
        {italianLessons.map((lesson) => (
          <article key={lesson.key} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{lesson.level}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">{lesson.title}</h2>
            {lesson.description ? <p className="mt-2 text-sm text-slate-600">{lesson.description}</p> : null}
          </article>
        ))}
      </section>
    </main>
  );
}
