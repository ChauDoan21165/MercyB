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
      className="mx-auto min-h-[calc(100vh-72px)] w-full max-w-full px-4 py-6 sm:px-6 lg:px-8"
    >
      <section className="mx-auto mb-6 w-full max-w-3xl text-center" data-testid="teacher-mercy-shell-header">
        <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border border-indigo-100 bg-white p-1 shadow-sm sm:h-32 sm:w-32">
          <img
            src={AVATAR_SRC}
            alt="Teacher Mercy"
            className="h-full w-full rounded-full object-cover"
            data-testid={avatarTestId}
          />
        </div>
        <div className="mb-3 text-sm font-bold text-slate-600" data-testid={greetingTestId}>
          {greetingName ? (
            <>Chào {greetingName} · Hi {greetingName}</>
          ) : (
            <>Chào bạn · Hi there</>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
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
        <p className="mt-2 text-sm font-medium text-slate-500" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
          {subtitle}
        </p>
        {helper && (
          <p className="mt-1 text-xs text-slate-400" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
            {helper}
          </p>
        )}
      </section>

      {memorySlot}
      {reminderSlot}

      <TeacherMercyModeTabs
        tabs={modeTabs}
        activeMode={activeMode}
        onChange={onModeChange}
      />

      {children}

      {footer && (
        <footer className="mt-8 text-center text-[11px] font-medium text-slate-300">
          {footer}
        </footer>
      )}
    </main>
  );
}

const TeacherMercyLearningShell = forwardRef(TeacherMercyLearningShellInner) as <TMode extends string>(
  props: Props<TMode> & { ref?: ForwardedRef<HTMLElement> },
) => ReturnType<typeof TeacherMercyLearningShellInner>;

export default TeacherMercyLearningShell;
