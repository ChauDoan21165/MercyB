import React from "react";
import { Link, useParams } from "react-router-dom";
import { Sparkles, Lightbulb, ChevronDown, ChevronUp, BookOpen, MessageCircle, PenLine } from "lucide-react";

const lessonLoaders: Record<
  string,
  () => Promise<{ default?: any[]; lessons?: any[] }>
> = {
  chinese: () => import("@/languages/chinese/lessons"),
  japanese: () => import("@/languages/japanese/lessons"),
  korean: () => import("@/languages/korean/lessons"),
};

const META: Record<string, { flag: string; nameVi: string; nameEn: string; heroVi: string; heroEn: string; accent: string }> = {
  chinese: {
    flag: "🇨🇳",
    nameVi: "Tiếng Trung",
    nameEn: "Chinese",
    heroVi: "Tiếng Trung cho người Việt — từ bính âm đến chữ Hán.",
    heroEn: "Chinese for Vietnamese learners — from pinyin to hanzi.",
    accent: "#DC2626",
  },
  japanese: {
    flag: "🇯🇵",
    nameVi: "Tiếng Nhật",
    nameEn: "Japanese",
    heroVi: "Tiếng Nhật cho người Việt — từ hiragana đến mẫu câu cơ bản.",
    heroEn: "Japanese for Vietnamese learners — from hiragana to basic patterns.",
    accent: "#F59E0B",
  },
  korean: {
    flag: "🇰🇷",
    nameVi: "Tiếng Hàn",
    nameEn: "Korean",
    heroVi: "Tiếng Hàn cho người Việt — 50 bài từ hangul đến ngữ pháp nền tảng.",
    heroEn: "Korean for Vietnamese learners — 50 lessons from hangul to foundational grammar.",
    accent: "#8B5CF6",
  },
};

function isKorean(lang: string) {
  return lang === "korean";
}

export default function LanguageLessonsPage() {
  const { lang } = useParams<{ lang: string }>();
  const meta = lang ? META[lang] : undefined;

  if (!meta || !lessonLoaders[lang ?? ""]) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center">
        <p className="text-slate-500">Language not found.</p>
        <Link to="/languages" className="mt-3 inline-block text-sm font-medium text-blue-700 underline">
          Back to languages
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <header
        className="mb-6 rounded-2xl border p-5"
        style={{
          borderColor: `${meta.accent}33`,
          background: `linear-gradient(135deg, ${meta.accent}0A, ${meta.accent}05)`,
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: meta.accent }}
        >
          {meta.flag} {meta.nameVi} · {meta.nameEn}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 leading-tight">
          {meta.heroVi}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-600">{meta.heroEn}</p>
        <p className="mt-2 text-sm font-bold" style={{ color: meta.accent }}>
          50 bài · 50 lessons
        </p>
        <p className="mt-3 text-xs text-slate-500">
          <Link
            to="/languages"
            className="font-medium underline"
            style={{ color: meta.accent }}
          >
            ← All languages
          </Link>
        </p>
      </header>

      <React.Suspense
        fallback={
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse"
              >
                <div className="h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        }
      >
        <LessonList lang={lang!} accent={meta.accent} />
      </React.Suspense>
    </div>
  );
}

const LEVELS: Record<string, { label: string; start: number; end: number }[]> = {
  korean: [
    { label: "Sơ cấp · Beginner", start: 1, end: 20 },
    { label: "Trung cấp · Intermediate", start: 21, end: 40 },
    { label: "Cao cấp · Advanced", start: 41, end: 50 },
  ],
  chinese: [
    { label: "Sơ cấp · Beginner", start: 1, end: 20 },
    { label: "Trung cấp · Intermediate", start: 21, end: 35 },
    { label: "Cao cấp · Advanced", start: 36, end: 50 },
  ],
};

function LessonList({ lang, accent }: { lang: string; accent: string }) {
  const [LessonsModule, setLessonsModule] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const loader = lessonLoaders[lang];
    if (!loader) return;
    loader()
      .then((mod) => {
        if (!cancelled) setLessonsModule(mod.default ?? mod.lessons ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">Could not load lessons: {error}</p>
      </div>
    );
  }

  if (!LessonsModule) return null;

  const lessons: any[] = Array.isArray(LessonsModule) ? LessonsModule : [];
  const levels = LEVELS[lang] ?? [];

  if (levels.length === 0) {
    // No level grouping — flat list (for Japanese, though Japanese has its own dedicated page)
    return (
      <div className="space-y-3">
        {lessons.map((lesson: any, i: number) => (
          <LessonTile
            key={lesson.id ?? i}
            lesson={lesson}
            index={i}
            accent={accent}
            lang={lang}
          />
        ))}
      </div>
    );
  }

  // Grouped by level
  return (
    <div className="space-y-6">
      {levels.map((level) => {
        const group = lessons.filter(
          (l: any) => l.id >= level.start && l.id <= level.end
        );
        if (group.length === 0) return null;
        return (
          <div key={level.label}>
            <h2
              className="mb-3 text-sm font-bold uppercase tracking-wide"
              style={{ color: accent }}
            >
              {level.label} — {group.length} bài
            </h2>
            <div className="space-y-3">
              {group.map((lesson: any, i: number) => (
                <LessonTile
                  key={lesson.id ?? i}
                  lesson={lesson}
                  index={lesson.id - 1}
                  accent={accent}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LessonTile({
  lesson,
  index,
  accent,
  lang,
}: {
  lesson: any;
  index: number;
  accent: string;
  lang: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ko = isKorean(lang);
  const sentences: any[] = Array.isArray(lesson.sentences) ? lesson.sentences : [];
  // Accept either lesson.vocabulary (new schema) or lesson.vocab (legacy Chinese schema)
  const vocab: any[] = Array.isArray(lesson.vocabulary)
    ? lesson.vocabulary
    : (Array.isArray(lesson.vocab) ? lesson.vocab : []);
  const dialogue: any[] = Array.isArray(lesson.dialogue) ? lesson.dialogue : [];
  const exercises: any[] = Array.isArray(lesson.exercises) ? lesson.exercises : [];
  const vocabCount = vocab.length;
  const sentCount = sentences.length;
  const dialCount = dialogue.length;
  const exerCount = exercises.length;

  return (
    <div
      className="rounded-xl border bg-white overflow-hidden"
      style={{ borderColor: `${accent}22` }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm font-bold text-white"
          style={{ background: accent }}
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-slate-900">
            {lesson.title_vi ?? lesson.title_en ?? lesson.title ?? `Lesson ${index + 1}`}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">
            {lesson.title_en ?? ""}
          </div>
          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-400">
            {vocabCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <BookOpen size={10} /> {vocabCount} từ vựng
              </span>
            )}
            {sentCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <MessageCircle size={10} /> {sentCount} câu
              </span>
            )}
            {dialCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <span className="text-[10px]">💬</span> {dialCount} hội thoại
              </span>
            )}
            {exerCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <PenLine size={10} /> {exerCount} bài tập
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-slate-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t" style={{ borderColor: `${accent}11` }}>
          {lesson.intro_vi && (
            <div className="flex items-start gap-2 mt-3 mb-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <Lightbulb size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-900 leading-relaxed">
                {lesson.intro_vi}
              </p>
            </div>
          )}

          {/* Sentences */}
          <ul className="space-y-2">
            {sentences.map((s: any, si: number) => (
              <li
                key={si}
                className="flex items-start gap-2 p-2 rounded-lg bg-slate-50"
              >
                <Sparkles size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900">
                    {ko && s.korean ? s.korean : (s.chinese ?? s.japanese ?? s.korean ?? "")}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {ko && s.romanized ? s.romanized : (s.pinyin ?? s.romaji ?? s.romanized ?? "")}
                  </div>
                  <div className="text-xs font-medium text-slate-700 mt-0.5">
                    {s.en ?? ""}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {s.vi ?? ""}
                  </div>
                  {s.note_vi && (
                    <div className="text-xs text-slate-400 italic mt-1">
                      {s.note_vi}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Vocabulary */}
          {vocab.length > 0 && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <BookOpen className="h-3 w-3" />
                Từ vựng · Vocabulary
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {vocab.map((v: any, vi: number) => (
                  <div key={vi} className="text-xs text-slate-700">
                    {ko ? (
                      <>
                        <span className="font-semibold">{v.hangul}</span>
                        <span className="text-slate-400 ml-2">{v.meaning}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">{v.chinese}</span>
                        <span className="text-slate-400 ml-1">{v.pinyin}</span>
                        <span className="text-slate-500 ml-2">{v.english}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dialogue */}
          {dialogue.length > 0 && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                <MessageCircle className="h-3 w-3" />
                Hội thoại · Dialogue
              </p>
              {dialogue.map((d: any, di: number) => (
                <div key={di} className="text-xs mb-1.5">
                  <span className="font-bold" style={{ color: accent }}>{d.speaker}:</span>{" "}
                  {ko ? (
                    <>
                      <span className="text-slate-900 font-medium">{d.hangul}</span>
                      <div className="text-slate-500 ml-5">{d.meaning}</div>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-900 font-medium">{d.chinese}</span>
                      <span className="text-slate-400 ml-1">({d.pinyin})</span>
                      <div className="text-slate-500 ml-5">{d.english}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Exercises */}
          {exercises.length > 0 && (
            <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/60 p-3">
              <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">
                <PenLine className="h-3 w-3" />
                Bài tập · Exercises
              </p>
              <ol className="space-y-2">
                {exercises.map((ex: any, ei: number) => (
                  <li key={ei} className="text-xs">
                    {ex.type === "fill-blank" && (
                      <div>
                        <span className="text-slate-500">Điền vào chỗ trống: </span>
                        <span className="text-slate-700">{ex.question}</span>
                        <span className="text-green-600 font-semibold ml-2">→ {ex.answer}</span>
                      </div>
                    )}
                    {ex.type === "translation" && (
                      <div>
                        <span className="text-slate-500">Dịch: </span>
                        <span className="text-slate-700 italic">"{ex.vietnamese}"</span>
                        <span className="text-green-600 font-semibold ml-2">
                          → {ko ? ex.hangul : ex.chinese}
                        </span>
                        {!ko && ex.pinyin && (
                          <span className="text-slate-400 ml-1">({ex.pinyin})</span>
                        )}
                      </div>
                    )}
                    {ex.type === "matching" && (
                      <div>
                        <span className="text-slate-500">Ghép: {ex.instruction} </span>
                        <span className="text-slate-700">
                          {ex.pairs?.map((p: any, pi: number) => (
                            <span key={pi} className="mr-3">
                              {ko
                                ? `${p.hangul}=${p.meaning}`
                                : `${p.chinese}=${p.english}`}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}