import React from "react";
import { Link, useParams } from "react-router-dom";
import { Sparkles, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

// Lazy imports for each language's lesson module
const lessonLoaders: Record<
  string,
  () => Promise<{ default: any[] }>
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
    heroVi: "Tiếng Hàn cho người Việt — từ hangul đến ngữ pháp nền tảng.",
    heroEn: "Korean for Vietnamese learners — from hangul to foundational grammar.",
    accent: "#8B5CF6",
  },
};

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

function LessonList({ lang, accent }: { lang: string; accent: string }) {
  const [LessonsModule, setLessonsModule] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const loader = lessonLoaders[lang];
    if (!loader) return;
    loader()
      .then((mod) => {
        if (!cancelled) setLessonsModule(mod.default ?? []);
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

  return (
    <div className="space-y-3">
      {lessons.map((lesson: any, i: number) => (
        <LessonTile
          key={lesson.id ?? i}
          lesson={lesson}
          index={i}
          accent={accent}
        />
      ))}
    </div>
  );
}

function LessonTile({
  lesson,
  index,
  accent,
}: {
  lesson: any;
  index: number;
  accent: string;
}) {
  const [open, setOpen] = React.useState(false);
  const sentences: any[] = Array.isArray(lesson.sentences) ? lesson.sentences : [];

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
            {lesson.title_vi ?? lesson.title_en ?? `Lesson ${index + 1}`}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">
            {lesson.title_en ?? ""}
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

          <ul className="space-y-2">
            {sentences.map((s: any, si: number) => (
              <li
                key={si}
                className="flex items-start gap-2 p-2 rounded-lg bg-slate-50"
              >
                <Sparkles size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900">
                    {s.chinese ?? s.japanese ?? s.korean ?? ""}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {s.pinyin ?? s.romaji ?? s.romanized ?? ""}
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
        </div>
      )}
    </div>
  );
}
