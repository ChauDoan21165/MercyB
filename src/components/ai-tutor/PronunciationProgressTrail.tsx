import type { PronunciationProgressDisplay } from "@/lib/pronunciation/pronunciationProgressTrail";

type Props = {
  enabled: boolean;
  display: PronunciationProgressDisplay | null;
};

/**
 * Step 7 warmth UX: a small, low-shame "you're moving" trail shown only when
 * the learner has at least two supported, scored attempts in the session.
 * Abstained attempts never reach this component, so it never implies progress
 * on weak evidence. It renders nothing when the flag is off or there is no
 * display — feedback cards keep their own redirect copy in that case.
 */
export default function PronunciationProgressTrail({ enabled, display }: Props) {
  if (!enabled || !display) return null;

  const isPositive = display.trend !== "keep_going";
  const containerClasses = isPositive
    ? "border-emerald-200 bg-emerald-50"
    : "border-sky-200 bg-sky-50";
  const accentClasses = isPositive ? "text-emerald-700" : "text-sky-700";
  const headlineClasses = isPositive ? "text-emerald-950" : "text-sky-950";
  const bodyClasses = isPositive ? "text-emerald-900" : "text-sky-900";
  const label =
    display.trend === "improving"
      ? "Tiến bộ"
      : display.trend === "steady"
        ? "Giữ phong độ"
        : "Cứ luyện tiếp";

  return (
    <section
      data-testid="pronunciation-progress-trail"
      role="status"
      aria-live="polite"
      className={`mt-4 rounded-[16px] border px-4 py-4 ${containerClasses}`}
    >
      <div className={`text-xs font-black uppercase ${accentClasses}`}>
        {label}
      </div>
      <p className={`mt-1 text-sm font-black leading-6 ${headlineClasses}`}>
        {display.headlineVi}
      </p>
      <p className={`mt-1 text-xs font-semibold leading-5 ${bodyClasses}`}>
        {display.headlineEn}
      </p>
      <div
        className="mt-3 flex items-center gap-1.5"
        data-testid="pronunciation-progress-dots"
        aria-hidden="true"
      >
        {display.entries.map((entry, index) => {
          const isLatest = index === display.entries.length - 1;
          const dotColor =
            entry.status === "correct" ? "bg-emerald-500" : "bg-amber-400";
          return (
            <span
              key={index}
              className={`h-2.5 w-2.5 rounded-full ${dotColor} ${
                isLatest ? "ring-2 ring-slate-300 ring-offset-1" : ""
              }`}
            />
          );
        })}
      </div>
      <p className={`mt-2 text-[11px] font-semibold ${bodyClasses}`}>
        {display.supportiveVi}
      </p>
    </section>
  );
}
