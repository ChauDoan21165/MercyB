// src/components/parent-view/ParentFamilyBridgeSection.tsx
//
// "Cùng học với con" — read-only render of curated Step-13 family-bridge
// scripts. Surfaces content from the f2 content-factory wave1 pack.
// Parent-facing: shows the real family conversation situations the learner
// is navigating, with VN cultural notes so the family member can follow.
//
// No engine wiring. No route. No Supabase. Pure static render.

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import wave1Raw from "@/content-factory/f2-family-bridge-scripts-wave1.json";

// Three scripts where the family member plays an active speaking role —
// most relevant to a parent reading their child's progress summary.
const CURATED_IDS = [
  "fb-s02-health-checkin",
  "fb-s01-explain-job",
  "fb-s05-asking-about-vietnam",
];

interface Exchange {
  family: { vi: string; en_gloss: string };
  learner: { en: string; viSupport?: string; bridgeNote?: string };
}

interface Wave1Script {
  id: string;
  titleVi: string;
  situationVi: string;
  culturalNoteVi: string;
  exchanges: Exchange[];
  closingWarmVi: string;
}

const SCRIPT_MAP = new Map<string, Wave1Script>(
  (wave1Raw.scripts as unknown as Wave1Script[]).map((s) => [s.id, s]),
);

export function ParentFamilyBridgeSection() {
  const curated = CURATED_IDS.flatMap((id) => {
    const s = SCRIPT_MAP.get(id);
    return s ? [s] : [];
  });

  if (curated.length === 0) return null;

  return (
    <section
      data-testid="parent-family-bridge-section"
      className="rounded-[20px] border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white px-5 py-6 shadow-[0_10px_28px_rgba(251,191,36,0.08)]"
    >
      <header className="mb-4">
        <h2 className="text-base font-bold text-slate-900" lang="vi">
          Cùng học với con
        </h2>
        <p className="mt-1 text-[13px] text-slate-500" lang="vi">
          Những tình huống thực tế giúp gia đình đồng hành cùng hành trình tiếng Anh.
        </p>
      </header>
      <ul className="space-y-3" role="list">
        {curated.map((script) => (
          <ScriptAccordion key={script.id} script={script} />
        ))}
      </ul>
    </section>
  );
}

function ScriptAccordion({ script }: { script: Wave1Script }) {
  const [open, setOpen] = useState(false);

  return (
    <li
      data-testid={`parent-family-bridge-script-${script.id}`}
      className="rounded-2xl border border-amber-100 bg-white shadow-[0_2px_8px_rgba(251,191,36,0.06)]"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-slate-800" lang="vi">
          {script.titleVi}
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0 text-amber-500" aria-hidden />
        )}
      </button>

      {open && (
        <div
          className="space-y-4 border-t border-amber-100 px-4 pb-4 pt-3"
          data-testid={`parent-family-bridge-body-${script.id}`}
        >
          <p
            className="rounded-lg bg-amber-50/60 px-3 py-2 text-[13px] leading-relaxed text-slate-700"
            lang="vi"
          >
            {script.culturalNoteVi}
          </p>
          <ul className="space-y-3">
            {script.exchanges.map((ex, i) => (
              <li key={i} className="space-y-1">
                <p className="text-[13px] text-slate-600" lang="vi">
                  <span className="font-medium text-slate-800">Gia đình: </span>
                  {ex.family.vi}
                </p>
                <p className="text-[13px] text-slate-700">
                  <span className="font-medium" lang="vi">Bạn: </span>
                  <span lang="en">{ex.learner.en}</span>
                </p>
                {ex.learner.viSupport && (
                  <p className="pl-2 text-[12px] italic text-slate-500" lang="vi">
                    → {ex.learner.viSupport}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <p
            className="border-t border-amber-100 pt-3 text-[13px] leading-relaxed text-amber-700"
            lang="vi"
          >
            {script.closingWarmVi}
          </p>
        </div>
      )}
    </li>
  );
}
