// src/components/ai-tutor/TutorHeader.tsx
// Teacher Mercy avatar + greeting + target-language title.
// Extracted from AiTutor.tsx.

import type { TutorTarget, TutorTargetCopy, UiCopy } from "@/lib/ai-tutor/tutorUiCopy";

const AVATAR_SRC = "/teacher-mercy.webp";

type Props = {
  greetingName: string | undefined;
  target: TutorTarget;
  targetCopy: TutorTargetCopy;
  uiCopy: UiCopy;
};

export default function TutorHeader({ greetingName, target, targetCopy, uiCopy }: Props) {
  return (
    <section className="mx-auto mb-6 w-full max-w-3xl text-center" data-testid="ai-tutor-header">
      <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border border-indigo-100 bg-white p-1 shadow-sm sm:h-32 sm:w-32">
        <img
          src={AVATAR_SRC}
          alt="Teacher Mercy"
          className="h-full w-full rounded-full object-cover"
          data-testid="ai-tutor-mercy-avatar"
        />
      </div>
      <div className="mb-3 text-sm font-bold text-slate-600" data-testid="ai-tutor-greeting">
        {greetingName ? (
          <>Chào {greetingName} · Hi {greetingName}</>
        ) : (
          <>Chào bạn · Hi there</>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">
          {uiCopy.title(targetCopy, target)}
        </h1>
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase text-indigo-700">
          {targetCopy.eyebrow}
        </span>
        <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700">
          Mock
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-500" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
        {uiCopy.subtitle(targetCopy)}
      </p>
      <p className="mt-1 text-xs text-slate-400" style={{ overflowWrap: "break-word", wordBreak: "normal" }}>
        {uiCopy.helper(targetCopy)}
      </p>
    </section>
  );
}
