import { Link } from "react-router-dom";
import AITutorCtaBanner from "@/components/languages/AITutorCtaBanner";
import { useUiLanguage } from "@/contexts/UiLanguageContext";
import * as Course from "@/languages/punjabi";

type UiLang = "vi" | "en";
type LessonLike = Record<string, unknown>;
type LevelId = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const FALLBACK_LESSONS: LessonLike[] = [
  { id: 'punjabi-starter-1', level: 'A1', titleVi: 'Chào hỏi Punjabi cơ bản', titleEn: 'Basic Punjabi greetings', descriptionVi: 'Bài đầu tiên dùng chữ Gurmukhi làm chính.', descriptionEn: 'The first lesson uses Gurmukhi as the primary script.' },
  { id: 'punjabi-starter-2', level: 'A2', titleVi: 'Câu Punjabi đời sống', titleEn: 'Everyday Punjabi sentences', descriptionVi: 'Mở rộng câu ngắn cho đời sống hằng ngày.', descriptionEn: 'Expand short sentences for daily life.' },
  { id: 'punjabi-starter-3', level: 'C2', titleVi: 'C2: Punjabi nâng cao', titleEn: 'C2: Advanced Punjabi', descriptionVi: 'Bài C2 mẫu bảo đảm cấp độ C2 luôn hiển thị nếu dữ liệu thật chưa tải.', descriptionEn: 'Sample C2 card so the C2 section remains visible if course data is not loaded.' }
];

const LEVELS: Array<{ id: LevelId; vi: string; en: string }> = [
  { id: "A1", vi: "A1 · Sơ cấp", en: "A1 · Beginner" },
  { id: "A2", vi: "A2 · Cơ bản", en: "A2 · Elementary" },
  { id: "B1", vi: "B1 · Trung cấp", en: "B1 · Intermediate" },
  { id: "B2", vi: "B2 · Trung cao", en: "B2 · Upper-Intermediate" },
  { id: "C1", vi: "C1 · Cao cấp", en: "C1 · Advanced" },
  { id: "C2", vi: "C2 · Thuần thục", en: "C2 · Mastery" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return undefined;
}

function looksLikeLesson(value: unknown): value is LessonLike {
  if (!isRecord(value)) return false;

  const keys = [
    "id",
    "slug",
    "level",
    "cefr",
    "tier",
    "title",
    "titleVi",
    "titleEn",
    "title_vi",
    "title_en",
    "name",
    "topic",
    "description",
    "descriptionVi",
    "descriptionEn",
    "description_vi",
    "description_en",
    "intro",
    "introVi",
    "introEn",
    "intro_vi",
    "intro_en",
    "summary",
    "objective",
    "sentences",
    "examples",
    "phrases",
    "dialogue",
    "vocabulary",
    "exercises",
  ];

  return keys.filter((key) => key in value).length >= 2;
}

function collectLessons(value: unknown, depth = 0, seen = new Set<unknown>()): LessonLike[] {
  if (depth > 5) return [];

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

function lessonLevel(lesson: LessonLike): LevelId {
  const raw = pickText(lesson, ["level", "cefr", "tier"], "A1").toUpperCase();
  const found = LEVELS.find((level) => raw.includes(level.id));
  return found?.id ?? "A1";
}

function levelRank(level: LevelId): number {
  return LEVELS.findIndex((item) => item.id === level);
}

function lessonTitle(lesson: LessonLike, uiLang: UiLang, fallback: string): string {
  return uiLang === "en"
    ? pickText(lesson, ["titleEn", "title_en", "title", "name", "topic", "slug", "id"], fallback)
    : pickText(lesson, ["titleVi", "title_vi", "title", "name", "topic", "slug", "id"], fallback);
}

function lessonDescription(lesson: LessonLike, uiLang: UiLang, fallback: string): string {
  return uiLang === "en"
    ? pickText(lesson, ["descriptionEn", "description_en", "introEn", "intro_en", "description", "intro", "summary", "objective"], fallback)
    : pickText(lesson, ["descriptionVi", "description_vi", "introVi", "intro_vi", "description", "intro", "summary", "objective"], fallback);
}

function dedupeLessons(lessons: LessonLike[]): LessonLike[] {
  const seen = new Set<string>();
  const out: LessonLike[] = [];

  for (const lesson of lessons) {
    const key = pickText(
      lesson,
      ["id", "slug", "title", "titleEn", "title_en", "titleVi", "title_vi", "name", "topic"],
      `lesson-${out.length}`,
    );

    if (seen.has(key)) continue;
    seen.add(key);
    out.push(lesson);
  }

  return out;
}

function sortLessons(lessons: LessonLike[]): LessonLike[] {
  return [...lessons].sort((a, b) => {
    const levelDelta = levelRank(lessonLevel(a)) - levelRank(lessonLevel(b));
    if (levelDelta !== 0) return levelDelta;
    return lessonTitle(a, "en", "").localeCompare(lessonTitle(b, "en", ""));
  });
}

function countValue(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (!isRecord(value)) return 0;

  const directArray = Object.values(value).find(Array.isArray);
  if (Array.isArray(directArray)) return directArray.length;

  return 0;
}

function countFirst(lesson: LessonLike, keys: string[]): number {
  for (const key of keys) {
    const count = countValue(lesson[key]);
    if (count > 0) return count;
  }
  return 0;
}

function lessonMeta(lesson: LessonLike, uiLang: UiLang): string[] {
  const vocab = countFirst(lesson, ["vocabulary", "vocab", "words"]);
  const sentences = countFirst(lesson, ["sentences", "sentenceBank", "examples", "phrases"]);
  const dialogues = countFirst(lesson, ["dialogue", "dialogues"]);
  const exercises = countFirst(lesson, ["exercises", "practice", "drills"]);

  const labels: string[] = [];
  if (vocab) labels.push(uiLang === "en" ? `${vocab} vocab` : `${vocab} từ vựng`);
  if (sentences) labels.push(uiLang === "en" ? `${sentences} sentences` : `${sentences} câu`);
  if (dialogues) labels.push(uiLang === "en" ? `${dialogues} dialogues` : `${dialogues} hội thoại`);
  if (exercises) labels.push(uiLang === "en" ? `${exercises} exercises` : `${exercises} bài tập`);

  return labels;
}

function flattenStrings(value: unknown, limit = 8, out: string[] = []): string[] {
  if (out.length >= limit) return out;

  if (typeof value === "string") {
    const clean = value.trim();
    if (clean.length > 2) out.push(clean);
    return out;
  }

  if (typeof value === "number") {
    out.push(String(value));
    return out;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      flattenStrings(item, limit, out);
      if (out.length >= limit) break;
    }
    return out;
  }

  if (isRecord(value)) {
    const preferred = [
      "native",
      "target",
      "russian",
      "punjabi",
      "en",
      "vi",
      "text",
      "meaning",
      "translation",
      "prompt",
      "answer",
      "note",
    ];

    for (const key of preferred) {
      flattenStrings(value[key], limit, out);
      if (out.length >= limit) return out;
    }

    for (const child of Object.values(value)) {
      flattenStrings(child, limit, out);
      if (out.length >= limit) break;
    }
  }

  return out;
}

function detailSnippets(lesson: LessonLike): string[] {
  const chunks = [
    lesson.sentences,
    lesson.examples,
    lesson.phrases,
    lesson.dialogue,
    lesson.vocabulary,
    lesson.exercises,
    lesson.notes,
    lesson.cultural_notes_vi,
    lesson.cultural_notes_en,
    lesson.tip_advice_vi,
    lesson.tip_advice_en,
  ];

  const out: string[] = [];
  for (const chunk of chunks) {
    flattenStrings(chunk, 10, out);
    if (out.length >= 10) break;
  }

  return Array.from(new Set(out)).slice(0, 8);
}

const COURSE_LESSONS = sortLessons(dedupeLessons(collectLessons(Course as Record<string, unknown>)));
const DISPLAY_LESSONS = COURSE_LESSONS.length > 0 ? COURSE_LESSONS : FALLBACK_LESSONS;

export default function PunjabiLessonsPage() {
  const { uiLang: activeUiLang } = useUiLanguage();
  const uiLang: UiLang = activeUiLang === "en" ? "en" : "vi";

  const headline = uiLang === "en" ? "Punjabi — real-life lessons, explained clearly. From Gurmukhi to daily conversation." : "Punjabi cho người Việt — từ Gurmukhi đến giao tiếp đời sống.";
  const languageMeta = uiLang === "en" ? "Practical Punjabi lessons with Gurmukhi as the primary script and Canada survival context where useful." : "Bài học Punjabi thực dụng với Gurmukhi làm chữ chính, kèm ngữ cảnh sinh tồn Canada khi phù hợp.";
  const scriptNote = uiLang === "en" ? "Gurmukhi is the primary script; romanization is only a bridge. Shahmukhi is awareness-only unless a future full track is approved." : "Gurmukhi là chữ chính; romanization chỉ là cầu đọc. Shahmukhi chỉ để nhận biết nếu chưa có track đầy đủ.";

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <section className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white via-purple-50 to-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-purple-600">
          🇮🇳 · ਪੰਜਾਬੀ · PUNJABI
        </p>

        <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950">
          {headline}
        </h1>

        <p className="mt-3 text-sm font-bold text-purple-600">
          {DISPLAY_LESSONS.length} {uiLang === "en" ? "lessons" : "bài học"}
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {languageMeta}
        </p>

        <Link to="/languages" className="mt-3 inline-block text-sm font-semibold text-purple-700 underline">
          {uiLang === "en" ? "View other languages" : "Xem ngôn ngữ khác"} / {uiLang === "en" ? "Xem ngôn ngữ khác" : "View other languages"}
        </Link>

        <div className="mt-4">
          <AITutorCtaBanner uiLang={uiLang} />
        </div>
      </section>

      <nav className="mt-6 flex flex-wrap gap-2">
        {LEVELS.map((level) => {
          const count = DISPLAY_LESSONS.filter((lesson) => lessonLevel(lesson) === level.id).length;
          return (
            <a
              key={level.id}
              href={`#level-${level.id}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700"
            >
              {uiLang === "en" ? level.en : level.vi}
              <span className="ml-1 text-slate-500">({count})</span>
            </a>
          );
        })}
      </nav>

      {LEVELS.map((level) => {
        const sectionLessons = DISPLAY_LESSONS.filter((lesson) => lessonLevel(lesson) === level.id);

        return (
          <section key={level.id} id={`level-${level.id}`} className="scroll-mt-24 pt-7">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="text-lg font-black text-slate-950">
                {uiLang === "en" ? level.en : level.vi}
              </h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                {sectionLessons.length} {uiLang === "en" ? "lessons" : "bài"}
              </span>
            </div>

            {sectionLessons.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                {uiLang === "en"
                  ? `${level.id} lessons are not attached yet.`
                  : `Chưa gắn bài ${level.id}.`}
              </div>
            ) : (
              <div className="space-y-2">
                {sectionLessons.map((lesson, index) => {
                  const title = lessonTitle(lesson, uiLang, "Punjabi lesson");
                  const description = lessonDescription(lesson, uiLang, scriptNote);
                  const meta = lessonMeta(lesson, uiLang);
                  const snippets = detailSnippets(lesson);

                  return (
                    <details
                      key={`${level.id}-${index}-${title}`}
                      className="group rounded-xl border border-slate-200 bg-white shadow-sm open:border-purple-300 open:shadow-md"
                    >
                      <summary className="grid cursor-pointer list-none grid-cols-[2.4rem_1fr_auto] items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-black text-white">
                          {index + 1}
                        </span>

                        <span className="min-w-0">
                          <span className="block text-base font-black text-slate-950 group-hover:text-purple-700">
                            {title}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700">
                              {level.id} · {uiLang === "en" ? level.en.split("· ")[1] : level.vi.split("· ")[1]}
                            </span>
                            {meta.map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </span>
                        </span>

                        <span className="text-purple-600 transition-transform group-open:rotate-180">⌄</span>
                      </summary>

                      <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                        <p className="text-sm leading-7 text-slate-700">{description}</p>

                        {snippets.length > 0 ? (
                          <ul className="mt-3 space-y-2">
                            {snippets.map((snippet, snippetIndex) => (
                              <li
                                key={`${title}-${snippetIndex}`}
                                className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700"
                              >
                                {snippet}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
                            {scriptNote}
                          </p>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}
