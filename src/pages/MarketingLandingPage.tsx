import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/providers/AuthProvider";
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
{ slug: "portuguese", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
{ slug: "russian", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
{ slug: "arabic", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
{ slug: "hindi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
{ slug: "urdu", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
{ slug: "punjabi", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
{ slug: "turkish", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
];
function courseHref(native: Lang, target: Lang) {
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
const { user, isLoading } = useAuth();
const [nativeSlug, setNativeSlug] = useState("vietnamese");
const [targetSlug, setTargetSlug] = useState("english");
const native = LANGUAGES.find((lang) => lang.slug === nativeSlug) ?? LANGUAGES[0];
const target =
LANGUAGES.find((lang) => lang.slug === targetSlug && lang.slug !== native.slug) ??
LANGUAGES.find((lang) => lang.slug !== native.slug)!;

// Remove the static hero shell (index.html LCP placeholder) so the
// painting-backed homepage is visible. Home.tsx does the same; this is
// needed because the MarketingLandingPage now renders at /.
useEffect(() => {
	const el = document.getElementById('mb-static-hero');
	if (!el) return;
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion) {
		el.remove();
	} else {
		el.style.opacity = '0';
		el.style.transition = 'opacity 150ms ease-out';
		const id = setTimeout(() => el.remove(), 150);
		return () => clearTimeout(id);
	}
}, []);

return (
<main
data-mercy-marketing-home="true"
className="relative min-h-screen overflow-hidden bg-[#f7efe0] text-slate-950"
style={{
backgroundImage: 'url("/marketing/hero-a.png")',
backgroundSize: "cover",
backgroundPosition: "center 28%",
backgroundRepeat: "no-repeat",
backgroundAttachment: "scroll",
}}
>
{/* ── Page content ── */}
<section className="relative min-h-screen">
<header className="relative mx-auto flex max-w-7xl items-center justify-between rounded-2xl bg-white/35 px-6 py-5">
<Link to="/" className="flex items-center gap-3" aria-label="MercyBlade home">
<img
src="/brand/mercy-blade-header.png"
alt="MercyBlade"
className="h-12 w-[180px] object-cover object-center"
draggable={false}
/>
</Link>
	{!isLoading && user ? (
	<Link
	to="/account"
	className="rounded-xl bg-[#8b7d5e] px-5 py-3 font-serif text-lg font-semibold text-white shadow-md hover:bg-[#7a6d50] transition-colors"
	>
	Account
	</Link>
	) : (
	<Link
	to="/login"
	className="rounded-xl bg-[#8b7d5e] px-5 py-3 font-serif text-lg font-semibold text-white shadow-md hover:bg-[#7a6d50] transition-colors"
	>
	Sign In
	</Link>
	)}
	</header>
<div className="relative mx-auto max-w-7xl px-6 pb-16 pt-16">
<div className="mx-auto max-w-4xl px-8 py-10 text-center [text-shadow:0_2px_12px_rgba(255,255,255,0.65)]">
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
</div>
</section>
</main>
);
}
