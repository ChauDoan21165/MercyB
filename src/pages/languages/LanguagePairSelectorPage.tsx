import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Lang = {
  slug: string;
  name: string;
  nativeName: string;
};

const LANGUAGES: Lang[] = [
  { slug: "vietnamese", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { slug: "english", name: "English", nativeName: "English" },
  { slug: "thai", name: "Thai", nativeName: "ไทย" },
  { slug: "indonesian", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { slug: "chinese", name: "Chinese", nativeName: "中文" },
  { slug: "japanese", name: "Japanese", nativeName: "日本語" },
  { slug: "korean", name: "Korean", nativeName: "한국어" },
  { slug: "spanish", name: "Spanish", nativeName: "Español" },
  { slug: "french", name: "French", nativeName: "Français" },
  { slug: "german", name: "German", nativeName: "Deutsch" },
  { slug: "italian", name: "Italian", nativeName: "Italiano" },
  { slug: "portuguese", name: "Portuguese", nativeName: "Português" },
  { slug: "russian", name: "Russian", nativeName: "Русский" },
  { slug: "arabic", name: "Arabic", nativeName: "العربية" },
  { slug: "hindi", name: "Hindi", nativeName: "हिन्दी" },
  { slug: "urdu", name: "Urdu", nativeName: "اردو" },
  { slug: "punjabi", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { slug: "turkish", name: "Turkish", nativeName: "Türkçe" },
  { slug: "swahili", name: "Swahili", nativeName: "Kiswahili" },
];

function courseHref(native: Lang, target: Lang): string {
  return `/learn/${native.slug}/${target.slug}`;
}

export default function LanguagePairSelectorPage() {
  const { nativeSlug: paramNative, targetSlug: paramTarget } = useParams<{ nativeSlug: string; targetSlug: string }>();
  const [nativeSlug, setNativeSlug] = useState(paramNative ?? "vietnamese");
  const [query, setQuery] = useState("");

  const native = LANGUAGES.find((l) => l.slug === nativeSlug) ?? LANGUAGES[0];
  const targetFromParam = paramTarget ? LANGUAGES.find((l) => l.slug === paramTarget && l.slug !== native.slug) : undefined;

  const targets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LANGUAGES.filter((l) => l.slug !== native.slug).filter((l) => {
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.slug.includes(q)
      );
    });
  }, [native.slug, query]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {paramNative && paramTarget && targetFromParam && (
        <div className="border-b border-white/10 bg-white/5 px-6 py-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Selected language pair</p>
          <h2 className="mt-1 font-serif text-2xl font-bold">
            <span className="text-cyan-300">{native.name}</span>
            <span className="mx-3 text-slate-500">→</span>
            <span className="text-emerald-300">{targetFromParam.name}</span>
          </h2>
          <Link
            to={courseHref(native, targetFromParam)}
            className="mt-3 inline-block rounded-full bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-400 transition"
          >
            Start {native.name} → {targetFromParam.name}
          </Link>
        </div>
      )}
      {paramNative && paramTarget && !targetFromParam && (
        <div className="border-b border-white/10 bg-white/5 px-6 py-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Language pair not found</p>
          <p className="mt-1 text-slate-400">
            "{paramNative}" → "{paramTarget}" is not a supported pair. Choose below.
          </p>
        </div>
      )}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            I speak
          </p>
          <h1 className="mt-2 text-3xl font-bold">Choose native language</h1>
          <div className="mt-6 space-y-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.slug}
                onClick={() => setNativeSlug(lang.slug)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  native.slug === lang.slug
                    ? "border-cyan-300 bg-cyan-300/15"
                    : "border-white/10 bg-slate-900 hover:border-white/30"
                }`}
              >
                <div className="font-semibold">{lang.name}</div>
                <div className="text-sm text-slate-300">{lang.nativeName}</div>
              </button>
            ))}
          </div>
        </aside>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            I want to learn
          </p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-bold">Pick a target language</h2>
              <p className="mt-2 text-slate-300">
                Course pair: {native.name} → target language. This scales to every new language.
              </p>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search target language..."
              className="w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-slate-950 md:max-w-sm"
            />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {targets.map((target) => (
              <Link
                key={target.slug}
                to={courseHref(native, target)}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-white/10"
              >
                <div className="text-sm text-slate-300">{native.name} speakers learn</div>
                <div className="mt-2 text-2xl font-bold">{target.name}</div>
                <div className="mt-1 text-lg text-slate-300">{target.nativeName}</div>
                <div className="mt-5 rounded-full bg-emerald-400 px-4 py-2 text-center font-bold text-slate-950">
                  Start {native.name} → {target.name}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
