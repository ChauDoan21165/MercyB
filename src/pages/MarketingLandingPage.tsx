import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function InkWashBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,255,255,0.95),rgba(248,241,226,0.88)_42%,rgba(238,225,199,0.72)_100%)]" />

      {/* paper texture */}
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(60,45,28,0.18)_0.6px,transparent_0.6px)] [background-size:18px_18px]" />

      {/* low mist */}
      <div className="absolute bottom-[31%] left-0 right-0 h-40 bg-[linear-gradient(to_top,rgba(246,238,220,0.85),rgba(246,238,220,0.18),transparent)]" />

      {/* ink mountains left */}
      <div className="absolute left-[-6%] bottom-[34%] h-64 w-[48%] opacity-[0.18] blur-[0.2px]">
        <div className="absolute bottom-0 left-[8%] h-52 w-72 rotate-[-7deg] rounded-[55%_45%_0_0] bg-slate-700/45 [clip-path:polygon(0_100%,22%_42%,36%_58%,52%_18%,70%_65%,100%_100%)]" />
        <div className="absolute bottom-0 left-[30%] h-60 w-80 rotate-[3deg] rounded-[55%_45%_0_0] bg-slate-800/35 [clip-path:polygon(0_100%,18%_58%,32%_38%,45%_62%,60%_22%,76%_54%,100%_100%)]" />
      </div>

      {/* ink mountains right */}
      <div className="absolute right-[-8%] bottom-[35%] h-72 w-[50%] opacity-[0.16]">
        <div className="absolute bottom-0 right-[18%] h-64 w-96 rounded-[50%_50%_0_0] bg-slate-800/35 [clip-path:polygon(0_100%,16%_62%,31%_30%,48%_58%,62%_18%,80%_54%,100%_100%)]" />
      </div>

      {/* Statue of Liberty silhouette */}
      <div className="absolute right-[9%] top-[18%] h-72 w-28 opacity-[0.17]">
        <div className="absolute bottom-0 left-1/2 h-24 w-20 -translate-x-1/2 rounded-t-lg bg-slate-700/45" />
        <div className="absolute bottom-20 left-1/2 h-32 w-12 -translate-x-1/2 rounded-t-full bg-slate-700/45" />
        <div className="absolute bottom-48 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-slate-700/45" />
        <div className="absolute bottom-57 left-1/2 h-8 w-16 -translate-x-1/2 [clip-path:polygon(50%_0,60%_100%,50%_62%,40%_100%)] bg-slate-700/45" />
        <div className="absolute bottom-42 left-[62%] h-24 w-3 rotate-[-18deg] rounded-full bg-slate-700/45" />
        <div className="absolute bottom-64 left-[78%] h-10 w-2 rounded-full bg-amber-700/35" />
      </div>

      {/* Afen Town sign */}
      <div className="absolute right-[5%] bottom-[32%] rotate-[-3deg] rounded-sm border border-stone-500/20 bg-stone-100/45 px-5 py-3 text-center opacity-[0.34] shadow-sm">
        <div className="font-serif text-xl text-stone-800">Afen Town</div>
        <div className="mt-1 text-[9px] italic tracking-wide text-stone-600">Knowledge Connects People</div>
      </div>

      {/* cherry blossom left */}
      <div className="absolute left-[-3%] top-[12%] h-72 w-80 opacity-[0.45]">
        <div className="absolute left-8 top-16 h-[2px] w-72 rotate-[20deg] bg-stone-800/25" />
        <div className="absolute left-16 top-6 h-[2px] w-36 rotate-[58deg] bg-stone-800/18" />
        <div className="absolute left-28 top-28 h-[2px] w-32 rotate-[-18deg] bg-stone-800/18" />
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-3 w-3 rounded-full bg-rose-300/55 blur-[0.2px]"
            style={{
              left: `${18 + (i * 37) % 220}px`,
              top: `${16 + (i * 53) % 150}px`,
              transform: `scale(${0.6 + (i % 4) * 0.18})`,
            }}
          />
        ))}
      </div>

      {/* birds */}
      <div className="absolute right-[27%] top-[19%] text-stone-700/35">
        <span className="absolute text-lg">⌁</span>
        <span className="absolute left-10 top-5 text-sm">⌁</span>
        <span className="absolute left-20 top-1 text-base">⌁</span>
      </div>

      {/* red seal */}
      <div className="absolute right-[7%] bottom-[25%] grid h-9 w-9 place-items-center border border-red-800/25 text-[9px] font-bold leading-none text-red-800/35">
        學<br />道
      </div>
    </div>
  );
}

type Lang = { slug: string; name: string; nativeName: string; flag: string };

const LANGUAGES: Lang[] = [
  { slug: "vietnamese", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { slug: "english", name: "English", nativeName: "English", flag: "🇬🇧" },
  { slug: "thai", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { slug: "indonesian", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { slug: "chinese", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { slug: "japanese", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { slug: "korean", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { slug: "spanish", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { slug: "french", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { slug: "german", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { slug: "italian", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { slug: "portuguese", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { slug: "russian", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { slug: "arabic", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { slug: "hindi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { slug: "urdu", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { slug: "punjabi", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { slug: "turkish", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { slug: "swahili", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
];

function courseHref(native: Lang, target: Lang) {
  if (target.slug === "english") return `/${native.slug}-english/`;
  return `/learn/${native.slug}/${target.slug}`;
}

function SelectBox({
  title,
  subtitle,
  value,
  onChange,
  exclude,
}: {
  title: string;
  subtitle: string;
  value: string;
  onChange: (slug: string) => void;
  exclude?: string;
}) {
  return (
    <label className="block">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-2xl">{title === "I SPEAK" ? "👤" : "📖"}</span>
        <span>
          <span className="block font-serif text-lg font-semibold tracking-wide text-slate-950">{title}</span>
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-600">{subtitle}</span>
        </span>
      </div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-16 w-full rounded-xl border border-stone-300 bg-white/85 px-4 text-xl font-semibold text-slate-950 shadow-sm outline-none focus:border-[#8b7d5e] focus:ring-2 focus:ring-[#8b7d5e]/25"
      >
        {LANGUAGES.filter((lang) => lang.slug !== exclude).map((lang) => (
          <option key={lang.slug} value={lang.slug}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function MarketingLandingPage() {
  const [nativeSlug, setNativeSlug] = useState("vietnamese");
  const [targetSlug, setTargetSlug] = useState("english");

  const native = LANGUAGES.find((lang) => lang.slug === nativeSlug) ?? LANGUAGES[0];
  const target =
    LANGUAGES.find((lang) => lang.slug === targetSlug && lang.slug !== native.slug) ??
    LANGUAGES.find((lang) => lang.slug !== native.slug)!;

  const popular = useMemo(
    () =>
      ["english", "spanish", "french", "japanese", "korean", "chinese", "german"]
        .map((slug) => LANGUAGES.find((lang) => lang.slug === slug))
        .filter(Boolean) as Lang[],
    [],
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7efe0] text-slate-950">
      <InkWashBackdrop />

      {/* ── Page content ── */}
      <section className="relative min-h-screen">
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
          <Link to="/" className="flex items-center gap-3">
            {/* Old gold "M" logo */}
            <span className="select-none font-serif text-5xl font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-800">
              M
            </span>
            <span className="font-serif text-3xl font-semibold tracking-tight text-slate-900">MercyBlade</span>
          </Link>

          <nav className="hidden items-center gap-9 font-serif text-lg md:flex">
            <Link to="/languages" className="text-slate-800 hover:text-slate-600 transition-colors">Courses</Link>
            <Link to="/ai-tutor" className="text-slate-800 hover:text-slate-600 transition-colors">AI Tutor</Link>
            <Link to="/pronunciation" className="text-slate-800 hover:text-slate-600 transition-colors">Pronunciation</Link>
            <Link to="/pricing" className="text-slate-800 hover:text-slate-600 transition-colors">Pricing</Link>
            <Link to="/community" className="text-slate-800 hover:text-slate-600 transition-colors">Community</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden items-center gap-2 font-serif text-lg text-slate-800 md:flex">🌐 English⌄</button>
            <Link
              to="/login"
              className="rounded-xl bg-[#8b7d5e] px-5 py-3 font-serif text-lg font-semibold text-white shadow-md hover:bg-[#7a6d50] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-16">
          <div className="mx-auto max-w-4xl text-center">
            {/* Decorative Chinese ink-brush separator */}
            <p className="mb-6 select-none text-2xl tracking-[0.35em] text-stone-400">⌁  ⌁  ⌁</p>
            <h1 className="font-serif text-5xl font-semibold leading-tight text-[#1a221d] md:text-7xl">
              Learn Any Language
              <br />
              From Your Language
            </h1>
            <p className="mx-auto mt-6 max-w-3xl font-serif text-2xl text-stone-600">
              AI-powered learning. Speak confidently. Connect the world.
            </p>
          </div>

          {/* Language selector card */}
          <section className="relative mx-auto mt-20 max-w-4xl rounded-3xl border border-stone-300/70 bg-[#fbf7ee]/90 p-8 shadow-2xl shadow-stone-900/8 backdrop-blur">
            <button
              onClick={() => {
                setNativeSlug(target.slug);
                setTargetSlug(native.slug);
              }}
              className="absolute -top-9 left-1/2 grid h-18 w-18 -translate-x-1/2 place-items-center rounded-full border border-stone-300 bg-[#fbf7ee] text-3xl shadow-lg hover:bg-[#f3edd8] transition-colors"
              aria-label="Swap languages"
            >
              ⇄
            </button>

            <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <SelectBox
                title="I SPEAK"
                subtitle="Native language"
                value={native.slug}
                onChange={(slug) => {
                  setNativeSlug(slug);
                  if (slug === target.slug) setTargetSlug("english");
                }}
                exclude={target.slug}
              />
              <div className="hidden pb-5 text-3xl font-light text-stone-400 md:block">×</div>
              <SelectBox
                title="I WANT TO LEARN"
                subtitle="Target language"
                value={target.slug}
                onChange={setTargetSlug}
                exclude={native.slug}
              />
            </div>

            <Link
              to={courseHref(native, target)}
              className="mt-8 block rounded-xl bg-[#8b7d5e] px-6 py-5 text-center font-serif text-2xl font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#7a6d50]"
            >
              Start Learning →
            </Link>
          </section>

          {/* Popular target languages */}
          <section className="mt-12">
            <h2 className="font-serif text-lg font-semibold text-slate-800">Popular target languages</h2>
            <div className="mt-4 flex flex-wrap gap-4">
              {popular.map((lang) => (
                <button
                  key={lang.slug}
                  onClick={() => lang.slug !== native.slug && setTargetSlug(lang.slug)}
                  className="rounded-xl border border-stone-300 bg-white/70 px-5 py-3 font-serif text-lg shadow-sm hover:bg-white hover:shadow-md transition-all"
                >
                  <span className="mr-2">{lang.flag}</span>{lang.name}
                </button>
              ))}
              <Link
                to="/choose-language"
                className="rounded-xl border border-stone-300 bg-white/70 px-5 py-3 font-serif text-lg shadow-sm hover:bg-white hover:shadow-md transition-all"
              >
                ⋯ More
              </Link>
            </div>
          </section>

          {/* Stats row */}
          <section className="mt-10 grid gap-5 rounded-2xl border border-stone-300/80 bg-white/45 p-6 font-serif shadow-sm md:grid-cols-4">
            <div><div className="text-4xl font-semibold text-slate-900">10M+</div><div className="text-stone-600">Learners Worldwide</div></div>
            <div><div className="text-4xl font-semibold text-slate-900">100+</div><div className="text-stone-600">Languages</div></div>
            <div><div className="text-4xl font-semibold text-slate-900">500K+</div><div className="text-stone-600">5-Star Reviews</div></div>
            <div><div className="text-4xl font-semibold text-slate-900">AI-Powered</div><div className="text-stone-600">Personalized Learning</div></div>
          </section>

          {/* Feature cards */}
          <section className="mt-10 grid gap-6 md:grid-cols-5">
            {[
              ["AI Tutor", "Get personalized lessons and feedback from your advanced AI tutor.", "👨🏻‍🏫"],
              ["Speak Confidently", "Practice speaking with AI and improve your pronunciation.", "🎙️"],
              ["Learn Your Way", "Lessons tailored to your level, goals, and learning pace.", "📖"],
              ["Track Progress", "Stay motivated with achievements and detailed progress tracking.", "⛰️"],
              ["Anytime, Anywhere", "Learn on any device, anytime. Your journey never stops.", "◯"],
            ].map(([title, body, icon]) => (
              <article key={title} className="rounded-2xl border border-stone-300/80 bg-white/55 p-6 text-center shadow-sm hover:shadow-md hover:bg-white/70 transition-all">
                <div className="text-5xl">{icon}</div>
                <h3 className="mt-5 font-serif text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{body}</p>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
