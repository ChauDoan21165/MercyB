import { forwardRef, type ForwardedRef, type ReactNode } from "react";
import TeacherMercyModeTabs, { type TeacherMercyModeTab } from "./TeacherMercyModeTabs";

const AVATAR_SRC = "/teacher-mercy.webp";

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
  return (
    <main
      ref={ref}
      data-testid={testId}
      data-floating-shell={floating ? "true" : "false"}
      className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-full bg-slate-100/70 px-3 py-4 sm:px-6 sm:py-6 lg:px-8"
    >
      <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
        <header className="border-b border-slate-100 bg-gradient-to-b from-white to-indigo-50/45 px-4 py-4 sm:px-6" data-testid="teacher-mercy-shell-header">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-indigo-100 bg-white p-1 shadow-sm sm:h-24 sm:w-24">
                <img
                  src={AVATAR_SRC}
                  alt="Teacher Mercy"
                  className="h-full w-full rounded-full object-cover"
                  data-testid={avatarTestId}
                />
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-indigo-500">
                  Teacher Mercy
                </div>
                <div className="text-sm font-bold text-slate-600" data-testid={greetingTestId}>
                  {greetingName ? (
                    <>Chào {greetingName}</>
                  ) : (
                    <>Chào bạn</>
                  )}
                </div>
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:text-right">
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <h1 className="min-w-0 text-xl font-black text-slate-950 sm:text-2xl">
                  {title}
                </h1>
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase text-indigo-700">
                  {eyebrow}
                </span>
                {badge && (
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
                    {badge}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
                {subtitle}
              </p>
              {helper && (
                <p className="mt-1 text-xs font-medium leading-5 text-slate-500" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
                  {helper}
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="px-4 pt-4 sm:px-6">
          <TeacherMercyModeTabs
            tabs={modeTabs}
            activeMode={activeMode}
            onChange={onModeChange}
          />

          <div className="pb-5">
            {children}
          </div>

          {memorySlot}
          {reminderSlot}
        </div>

        {footer && (
          <footer className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-center text-[11px] font-medium text-slate-500">
            {footer}
          </footer>
        )}
      </section>
    </main>
  );
}

const TeacherMercyLearningShell = forwardRef(TeacherMercyLearningShellInner) as <TMode extends string>(
  props: Props<TMode> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof TeacherMercyLearningShellInner>;

export default TeacherMercyLearningShell;
