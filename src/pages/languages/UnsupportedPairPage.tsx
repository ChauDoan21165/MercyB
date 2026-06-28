import { Link, useParams } from "react-router-dom";

type Lang = { slug: string; name: string; nativeName: string };

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

export default function UnsupportedPairPage() {
  const { nativeSlug, targetSlug } = useParams<{ nativeSlug: string; targetSlug: string }>();

  const native = LANGUAGES.find((l) => l.slug === nativeSlug);
  const target = LANGUAGES.find((l) => l.slug === targetSlug);

  const nativeName = native?.name ?? nativeSlug ?? "your language";
  const targetName = target?.name ?? targetSlug ?? "that language";

  if (nativeSlug === "vietnamese") {
    return (
      <main
        data-testid="unsupported-pair-page"
        className="flex min-h-screen items-center justify-center bg-[#f7efe0] px-6"
      >
        <div className="max-w-md text-center">
          <h1 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">
            Chúng tôi chưa có cặp ngôn ngữ này.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
            Hiện tại chưa có khóa {targetName} cho người nói {nativeName}.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              to="/"
              className="rounded-xl bg-[#8b7d5e] px-6 py-3 font-serif font-semibold text-white shadow-md hover:bg-[#7a6d50] transition-colors"
            >
              Về trang chủ
            </Link>
            <Link to="/languages" className="text-sm text-slate-600 underline hover:text-slate-700">
              Xem các ngôn ngữ khác
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      data-testid="unsupported-pair-page"
      className="flex min-h-screen items-center justify-center bg-[#f7efe0] px-6"
    >
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">
          This language pair is not available yet.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          We don&rsquo;t have a {targetName} course for {nativeName} speakers yet.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-[#8b7d5e] px-6 py-3 font-serif font-semibold text-white shadow-md hover:bg-[#7a6d50] transition-colors"
          >
            Back to Home
          </Link>
          <Link to="/languages" className="text-sm text-slate-600 underline hover:text-slate-700">
            Browse other languages
          </Link>
        </div>
      </div>
    </main>
  );
}
