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
      className="mx-auto mb-5 grid w-full max-w-3xl gap-2 rounded-[16px] border border-slate-200 bg-white p-1 shadow-sm"
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
            className={`min-h-[44px] rounded-[12px] px-3 text-sm font-black transition ${
              selected ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
