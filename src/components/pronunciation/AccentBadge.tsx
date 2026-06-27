// src/components/pronunciation/AccentBadge.tsx
//
// Compact "current accent" pill with a tap-to-change popover. Designed
// to slot into the Speak tab + Mercy chat header without taking much
// vertical real estate.

import { useEffect, useRef, useState } from "react";

import AccentSelector from "./AccentSelector";
import {
  ACCENT_METADATA,
  type Accent,
} from "@/data/pronunciation/multiAccentReferences";

export type AccentBadgeProps = {
  accent: Accent;
  onChange: (next: Accent) => void;
  /** Optional aria-label override; defaults to a sensible bilingual one. */
  ariaLabel?: string;
};

export default function AccentBadge({
  accent,
  onChange,
  ariaLabel,
}: AccentBadgeProps) {
  const [open, setOpen] = useState(false);
  const meta = ACCENT_METADATA[accent];
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={popoverRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={
          ariaLabel ??
          `Đổi giọng phát âm — current: ${meta.label_vi} · ${meta.label_en}`
        }
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
      >
        <span aria-hidden="true">{meta.flag}</span>
        <span>{meta.label_vi}</span>
        <span className="opacity-50">▾</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Choose accent"
          className="absolute right-0 top-full z-20 mt-2 w-[280px] rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
        >
          <AccentSelector
            value={accent}
            onChange={(next) => {
              onChange(next);
              setOpen(false);
            }}
            size="sm"
            title="Giọng phát âm · Pronunciation accent"
          />
          <p className="mt-2 text-[10px] text-slate-600 leading-snug">
            Mercy sẽ đọc mẫu + chấm theo giọng này. ·{" "}
            <span className="italic">Mercy will speak references and score in this accent.</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
