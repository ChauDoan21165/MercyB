// src/components/founder/FounderStoryCallout.tsx
//
// Full-width vignette block for landing-style pages. Surfaces a
// short founder beat (one struggle vignette) with a clear CTA into
// the about page. Used on Home/landing as the soft "Made by Chau"
// moment in mid-page.

import { Link } from "react-router-dom";

import { PRODUCT_CONFIG } from "@/config/product";
import {
  FOUNDER_STRUGGLES,
  type FounderStruggle,
} from "@/lib/founder/founderContent";

export type FounderStoryCalloutProps = {
  /** Optional struggle id to surface. Defaults to the canonical 'I am go' beat. */
  struggleId?: string;
};

function pickStruggle(id: string | undefined): FounderStruggle {
  if (id) {
    const match = FOUNDER_STRUGGLES.find((s) => s.id === id);
    if (match) return match;
  }
  // 'i-am-go' is the strongest hook for landing because it pairs a
  // universal Vietnamese-learner experience with a concrete moment.
  return FOUNDER_STRUGGLES[0];
}

export default function FounderStoryCallout({
  struggleId,
}: FounderStoryCalloutProps) {
  const struggle = pickStruggle(struggleId);

  return (
    <section className="rounded-2xl border border-black/10 bg-gradient-to-br from-emerald-50 to-white p-6 md:p-8">
      <div className="text-xs uppercase tracking-wide font-bold text-emerald-700 mb-2">
        Made by Chau
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-black/90 mb-3">
        {struggle.title_vi}
      </h2>
      <p className="text-[15px] text-black/85 leading-relaxed">
        {struggle.vi}
      </p>
      <p className="text-sm text-black/55 italic mt-3 leading-relaxed">
        {struggle.en}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link
          to="/about/chau"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold no-underline hover:bg-emerald-700 transition"
        >
          Đọc câu chuyện đầy đủ
        </Link>
        <span className="text-xs text-black/55">
          — {PRODUCT_CONFIG.founder.name},{" "}
          <span className="italic">{PRODUCT_CONFIG.founder.story}</span>
        </span>
      </div>
    </section>
  );
}
