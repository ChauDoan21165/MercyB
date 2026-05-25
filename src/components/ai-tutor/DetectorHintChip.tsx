// src/components/ai-tutor/DetectorHintChip.tsx
//
// Small pattern-awareness chip rendered below the AI Tutor correction
// response when the L1 detector fires on a high-severity Vietnamese
// transfer pattern. v1 is read-only — no dismiss / no report button,
// no session-spanning persistence. Session-dedup is in detectorHint.ts.

import { useEffect } from "react";

import {
  type DetectorHintContent,
  markHintShown,
} from "@/lib/ai-tutor/detectorHint";

interface Props {
  /** Chip content (null hides the chip — render-site does the gating). */
  content: DetectorHintContent | null;
}

export default function DetectorHintChip({ content }: Props) {
  useEffect(() => {
    if (content) markHintShown(content.tag);
  }, [content]);

  if (!content) return null;

  return (
    <aside
      data-testid="detector-hint-chip"
      data-tag={content.tag}
      className="rounded-[14px] border border-amber-200 bg-amber-50/70 p-3"
      aria-label="Vietnamese L1 pattern hint"
    >
      <div className="text-[11px] font-black uppercase tracking-wide text-amber-700">
        {content.nameEn}
      </div>
      <p className="mt-1 text-[13px] leading-relaxed text-slate-700">
        {content.rationaleVi}
      </p>
    </aside>
  );
}
