export type TeacherMercyModeTab<TMode extends string = string> = {
  id: TMode;
  label: string;
};

type Props<TMode extends string> = {
  tabs: TeacherMercyModeTab<TMode>[];
  activeMode: TMode;
  onChange: (mode: TMode) => void;
  ariaLabel?: string;
};

export default function TeacherMercyModeTabs<TMode extends string>({
  tabs,
  activeMode,
  onChange,
  ariaLabel = "Teacher Mercy learning modes",
}: Props<TMode>) {
  return (
    <div
      className="mx-auto mb-5 grid w-full max-w-3xl gap-1 rounded-[18px] border border-slate-200 bg-slate-100 p-1 shadow-inner"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      aria-label={ariaLabel}
      data-testid="teacher-mercy-mode-tabs"
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeMode;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(tab.id)}
            className={`min-h-[46px] rounded-[14px] px-3 text-sm font-black transition ${
              selected ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:bg-white/70"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
