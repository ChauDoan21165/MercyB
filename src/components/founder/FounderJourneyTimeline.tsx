// src/components/founder/FounderJourneyTimeline.tsx
//
// Vertical timeline rendering FOUNDER_MILESTONES on the about page.
// Bilingual; no specific dates beyond what PRODUCT_CONFIG and the
// existing public blog post already disclose.

import { FOUNDER_MILESTONES } from "@/lib/founder/founderContent";

export default function FounderJourneyTimeline() {
  return (
    <ol className="relative border-l-2 border-emerald-200 pl-6 space-y-6">
      {FOUNDER_MILESTONES.map((m) => (
        <li key={m.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[34px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow"
          />
          <div className="text-xs uppercase tracking-wide font-bold text-emerald-700">
            {m.when_vi}
          </div>
          <div className="text-[10px] uppercase tracking-wide font-medium text-black/45">
            {m.when_en}
          </div>
          <p className="text-sm text-black/85 mt-2 leading-relaxed">{m.vi}</p>
          <p className="text-xs text-black/55 italic mt-1 leading-relaxed">
            {m.en}
          </p>
        </li>
      ))}
    </ol>
  );
}
