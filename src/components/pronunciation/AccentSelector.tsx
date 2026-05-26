// src/components/pronunciation/AccentSelector.tsx
//
// Pronunciation-training accent picker (US/UK/AU/CA). Bilingual VN-first.
// Renders four buttons in a row with flag + bilingual label.
// Used by the AccentBadge popover and the Mock Interview pre-flight
// screen. Stateless — caller owns the selected value (typically via
// useAccentPreference).

import {
  ACCENT_METADATA,
  ALL_ACCENTS,
  type Accent,
} from "@/data/pronunciation/multiAccentReferences";

export type AccentSelectorProps = {
  value: Accent;
  onChange: (next: Accent) => void;
  /** Render small (badge popover) or default (settings panel). */
  size?: "sm" | "md";
  /** Optional title shown above the row. */
  title?: string;
};

export default function AccentSelector({
  value,
  onChange,
  size = "md",
  title,
}: AccentSelectorProps) {
  const isSm = size === "sm";

  return (
    <div className={isSm ? "space-y-2" : "space-y-3"}>
      {title ? (
        <div className={`text-${isSm ? "[11px]" : "sm"} font-semibold text-slate-700`}>
          {title}
        </div>
      ) : null}
      <div
        role="radiogroup"
        aria-label="Pronunciation accent"
        className="flex flex-wrap gap-2"
      >
        {ALL_ACCENTS.map((accent) => {
          const meta = ACCENT_METADATA[accent];
          const active = accent === value;
          return (
            <button
              key={accent}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(accent)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 ${
                isSm ? "py-1 text-[11px]" : "py-1.5 text-xs"
              } font-semibold transition ${
                active
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span aria-hidden="true">{meta.flag}</span>
              <span>{meta.label_vi}</span>
              <span className="opacity-60 italic">· {meta.label_en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
