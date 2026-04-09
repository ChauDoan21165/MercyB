// src/components/mercy-guide/LearningSupportMode.tsx
import React from "react";
import { Check, ChevronDown, Sprout, Leaf, Trees } from "lucide-react";

export type LearningSupportMode = "gentle" | "guided" | "immersion";

export type LearningSupportOption = {
  value: LearningSupportMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ReactNode;
};

export const LEARNING_SUPPORT_OPTIONS: LearningSupportOption[] = [
  {
    value: "gentle",
    label: "Gentle",
    shortLabel: "🌱 Gentle",
    description: "English + short Vietnamese support for key teaching moments.",
    icon: <Sprout className="h-4 w-4" />,
  },
  {
    value: "guided",
    label: "Guided",
    shortLabel: "🌿 Guided",
    description: "Mostly English, with small bilingual hints only when helpful.",
    icon: <Leaf className="h-4 w-4" />,
  },
  {
    value: "immersion",
    label: "Full immersion",
    shortLabel: "🌳 Immersion",
    description: "English only for learners ready to stay fully in the language.",
    icon: <Trees className="h-4 w-4" />,
  },
];

function getModeStyles(mode: LearningSupportMode) {
  switch (mode) {
    case "gentle":
      return {
        trigger:
          "border-mercy-journey-300 bg-mercy-journey-50 text-mercy-journey-700 hover:bg-mercy-journey-100",
        dot: "bg-mercy-journey-500",
      };
    case "guided":
      return {
        trigger:
          "border-mercy-speak-300 bg-mercy-speak-50 text-mercy-speak-700 hover:bg-mercy-speak-100",
        dot: "bg-mercy-speak-500",
      };
    case "immersion":
    default:
      return {
        trigger:
          "border-mercy-logic-300 bg-mercy-logic-50 text-mercy-logic-700 hover:bg-mercy-logic-100",
        dot: "bg-mercy-logic-500",
      };
  }
}

export type LearningSupportModeProps = {
  value: LearningSupportMode;
  onChange: (value: LearningSupportMode) => void;
  className?: string;
};

export function LearningSupportModePicker({
  value,
  onChange,
  className = "",
}: LearningSupportModeProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selected =
    LEARNING_SUPPORT_OPTIONS.find((option) => option.value === value) ??
    LEARNING_SUPPORT_OPTIONS[0];

  const styles = getModeStyles(selected.value);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-mercy-text-secondary">
        Learning support
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "flex min-h-[44px] w-full items-center justify-between gap-3 rounded-mercy-2xl border px-3 py-2.5 text-left shadow-mercy-soft transition",
          styles.trigger,
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0">{selected.icon}</span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{selected.shortLabel}</div>
            <div className="truncate text-xs opacity-80">{selected.description}</div>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-[320px] rounded-mercy-3xl border border-mercy-bg-border bg-mercy-bg-card p-2 shadow-mercy-card"
          role="listbox"
          aria-label="Learning support mode"
        >
          {LEARNING_SUPPORT_OPTIONS.map((option) => {
            const isActive = option.value === value;
            const optionStyles = getModeStyles(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-start gap-3 rounded-mercy-2xl px-3 py-3 text-left transition",
                  isActive
                    ? "bg-mercy-bg"
                    : "hover:bg-mercy-bg",
                ].join(" ")}
                role="option"
                aria-selected={isActive}
              >
                <div className="mt-0.5 shrink-0">{option.icon}</div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-mercy-text-primary">
                      {option.label}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${optionStyles.dot}`} />
                  </div>
                  <div className="mt-1 text-xs leading-5 text-mercy-text-secondary">
                    {option.description}
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  {isActive ? (
                    <Check className="h-4 w-4 text-mercy-brand-600" />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}