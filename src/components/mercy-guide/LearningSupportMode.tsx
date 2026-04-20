// src/components/mercy-guide/LearningSupportMode.tsx
import React from "react";

export type LearningSupportMode = "gentle" | "guided" | "immersion";
export type LearningSupportOption = { value: LearningSupportMode; label: string; shortLabel: string; description: string; icon: React.ReactNode; };

export const LEARNING_SUPPORT_OPTIONS: LearningSupportOption[] = [
  { value: "gentle",    label: "Gentle",    shortLabel: "🌱 Gentle",    description: "English + short Vietnamese support for key teaching moments.", icon: "🌱" },
  { value: "guided",    label: "Guided",    shortLabel: "🌿 Guided",    description: "Mostly English, with small bilingual hints when helpful.",     icon: "🌿" },
  { value: "immersion", label: "Immersion", shortLabel: "🌳 Immersion", description: "English only for learners ready to stay fully in English.",     icon: "🌳" },
];

const COLORS: Record<LearningSupportMode, { active: string; dot: string; bar: string }> = {
  gentle:    { active: "bg-[#FFF3ED] border-[#FFB39A] text-[#C05830]", dot: "bg-[#FF8A65]", bar: "bg-[#FF8A65]" },
  guided:    { active: "bg-[#EDF7F0] border-[#7CC9A0] text-[#1E7A4A]", dot: "bg-[#43C59E]", bar: "bg-[#43C59E]" },
  immersion: { active: "bg-[#EEF4FF] border-[#93B4F5] text-[#2A56C6]", dot: "bg-[#5B8DEF]", bar: "bg-[#5B8DEF]" },
};

export type LearningSupportModeProps = { value: LearningSupportMode; onChange: (value: LearningSupportMode) => void; className?: string; compact?: boolean; };

export function LearningSupportModePicker({ value, onChange, className = "" }: LearningSupportModeProps) {
  const [tooltip, setTooltip] = React.useState<LearningSupportMode | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdx = LEARNING_SUPPORT_OPTIONS.findIndex(o => o.value === value);
  function show(m: LearningSupportMode) { if (timerRef.current) clearTimeout(timerRef.current); setTooltip(m); }
  function hide() { timerRef.current = setTimeout(() => setTooltip(null), 150); }
  return (
    <div className={`relative flex flex-col gap-0.5 ${className}`}>
      <div className="flex h-9 items-stretch overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
        {LEARNING_SUPPORT_OPTIONS.map((opt, idx) => {
          const isActive = opt.value === value;
          const c = COLORS[opt.value];
          return (
            <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
              onMouseEnter={() => show(opt.value)} onMouseLeave={hide}
              className={["relative flex flex-1 items-center justify-center gap-1 px-2.5 text-xs font-semibold transition-all",
                isActive ? `${c.active} border` : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
                idx === 0 ? "rounded-l-full" : idx === 2 ? "rounded-r-full" : "border-x border-slate-100",
              ].join(" ")} aria-pressed={isActive}>
              <span className="text-[13px]">{opt.icon}</span>
              <span className="hidden sm:inline">{opt.label}</span>
              {isActive && <span className={`absolute bottom-1 left-1/2 h-1 w-3 -translate-x-1/2 rounded-full opacity-60 ${c.dot}`} />}
            </button>
          );
        })}
      </div>
      <div className="h-0.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full transition-all duration-300 ${COLORS[value].bar}`} style={{ width: `${((activeIdx + 1) / 3) * 100}%` }} />
      </div>
      {tooltip && (
        <div className="absolute top-11 left-1/2 z-50 w-56 -translate-x-1/2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs leading-5 text-slate-700 shadow-lg">
          <span className="font-semibold">{LEARNING_SUPPORT_OPTIONS.find(o => o.value === tooltip)?.label}: </span>
          {LEARNING_SUPPORT_OPTIONS.find(o => o.value === tooltip)?.description}
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-100 bg-white" />
        </div>
      )}
    </div>
  );
}
