import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import { BookOpenText, Brain, Mic, PenSquare } from "lucide-react";
import TeacherMercyModeTabs, { type TeacherMercyModeTab } from "./TeacherMercyModeTabs";

const AVATAR_SRC = "/teacher-mercy.webp";

export type TeacherMercyPillarId = "journey" | "grammar" | "speak" | "logic";

export type TeacherMercyPillarTab = {
  id: TeacherMercyPillarId;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

type Props<TMode extends string> = {
  greetingName?: string;
  title: string;
  subtitle: string;
  helper?: string;
  eyebrow: string;
  badge?: string;
  activeMode: TMode;
  modeTabs: TeacherMercyModeTab<TMode>[];
  onModeChange: (mode: TMode) => void;
  pillarTabs?: readonly TeacherMercyPillarTab[];
  memorySlot?: ReactNode;
  reminderSlot?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  floating?: boolean;
  testId?: string;
  avatarTestId?: string;
  greetingTestId?: string;
};

function TeacherMercyLearningShellInner<TMode extends string>(
  {
    greetingName,
    title,
    subtitle,
    helper,
    eyebrow,
    badge,
    activeMode,
    modeTabs,
    onModeChange,
    pillarTabs,
    memorySlot,
    reminderSlot,
    children,
    footer,
    floating = true,
    testId = "teacher-mercy-learning-shell",
    avatarTestId = "teacher-mercy-avatar",
    greetingTestId = "teacher-mercy-greeting",
  }: Props<TMode>,
  ref: ForwardedRef<HTMLElement>,
) {
  const resolvedPillarTabs: readonly TeacherMercyPillarTab[] =
    pillarTabs ??
    (modeTabs
      .filter((tab) => ["journey", "grammar", "speak", "logic"].includes(tab.id))
      .map((tab) => ({
        id: tab.id as TeacherMercyPillarId,
        label: tab.label,
        active: tab.id === activeMode,
        disabled: false,
        onClick: () => onModeChange(tab.id),
      })));

  return (
    <main
      ref={ref}
      data-testid={testId}
      data-floating-shell={floating ? "true" : "false"}
      className="min-h-[calc(100vh-72px)] w-full bg-gradient-to-br from-[#fff8f1] via-white to-[#f6f3ff] px-3 py-4 sm:px-5 sm:py-6"
    >
      <section
        className="relative mx-auto flex w-full max-w-[880px] flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/82 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur"
        data-testid="teacher-mercy-floating-box"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,159,122,0.16),_rgba(124,58,237,0.08)_42%,_transparent_76%)]" />

        <header
          className="relative z-10 border-b border-white/80 bg-white/72 px-4 py-4 backdrop-blur-md sm:px-5"
          data-testid="teacher-mercy-shell-header"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffd7c8] via-[#ffe6dc] to-[#dcc8ff] blur-sm opacity-85" />
              <img
                src={AVATAR_SRC}
                alt="Teacher Mercy"
                className="relative h-14 w-14 rounded-full border-2 border-white object-cover object-[50%_32%] shadow-[0_10px_22px_rgba(148,163,184,0.22)] sm:h-16 sm:w-16"
                data-testid={avatarTestId}
              />
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-rose-500">
                {eyebrow}
              </div>
              <h1 className="text-xl font-black leading-tight text-slate-950 sm:text-2xl">
                {title}
              </h1>
              <div className="mt-1 text-xs font-bold text-slate-500" data-testid={greetingTestId}>
                {greetingName ? (
                  <>Chào {greetingName} · Hi {greetingName}</>
                ) : (
                  <>Chào bạn · Hi there</>
                )}
              </div>
            </div>

            {badge && (
              <span className="shrink-0 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
                {badge}
              </span>
            )}
          </div>

          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
            {subtitle}
          </p>
          {helper && (
            <p className="mt-1 text-xs font-medium leading-5 text-slate-400" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
              {helper}
            </p>
          )}
        </header>

        {resolvedPillarTabs.length > 0 && (
          <nav
            className="relative z-10 grid grid-cols-4 gap-1.5 border-b border-white/80 bg-white/58 px-3 py-2 backdrop-blur-sm"
            aria-label="Teacher Mercy pillars"
            data-testid="teacher-mercy-pillar-tabs"
          >
            {resolvedPillarTabs.map((tab) => {
              const Icon =
                tab.id === "journey" ? Brain :
                  tab.id === "grammar" ? PenSquare :
                    tab.id === "speak" ? Mic : BookOpenText;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={tab.onClick}
                  disabled={tab.disabled || !tab.onClick}
                  aria-pressed={!!tab.active}
                  className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center transition ${
                    tab.active
                      ? "border-indigo-200 bg-indigo-50 text-indigo-800 shadow-[0_8px_18px_rgba(79,70,229,0.10)]"
                      : "border-white/70 bg-white/72 text-slate-600 hover:border-white hover:bg-white"
                  } disabled:cursor-default disabled:opacity-80`}
                >
                  <Icon className={`h-4 w-4 ${tab.active ? "text-indigo-600" : "text-slate-400"}`} aria-hidden />
                  <span className="text-[10px] font-black uppercase tracking-[0.1em] leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        <div className="relative z-10 border-b border-white/80 bg-white/44 px-3 py-3 sm:px-4">
          {memorySlot}
          {reminderSlot}
        </div>

        <div className="relative z-10 bg-white/36 px-3 py-3 sm:px-4">
          <TeacherMercyModeTabs
            tabs={modeTabs}
            activeMode={activeMode}
            onChange={onModeChange}
          />

          <div className="min-w-0">
            {children}
          </div>

          {footer && (
            <footer className="mt-6 text-center text-[11px] font-medium text-slate-400">
              {footer}
            </footer>
          )}
        </div>
      </section>
    </main>
  );
}

const TeacherMercyLearningShell = forwardRef(TeacherMercyLearningShellInner) as <TMode extends string>(
  props: Props<TMode> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof TeacherMercyLearningShellInner>;

export default TeacherMercyLearningShell;
