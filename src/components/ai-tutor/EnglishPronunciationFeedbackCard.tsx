import type { EnglishPronunciationFeedbackDisplay } from "@/lib/pronunciation/englishPronunciationFeedback";

type Props = {
  enabled: boolean;
  feedback: EnglishPronunciationFeedbackDisplay | null;
};

export default function EnglishPronunciationFeedbackCard({ enabled, feedback }: Props) {
  if (!enabled || !feedback || feedback.items.length === 0) return null;

  const primary = feedback.items[0];

  return (
    <div
      className={`mt-4 rounded-[16px] border px-4 py-4 ${
        primary.status === "correct"
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50"
      }`}
      data-testid="english-pronunciation-feedback"
      role="status"
      aria-live="polite"
    >
      <div className={`text-xs font-black uppercase ${primary.status === "correct" ? "text-emerald-700" : "text-amber-700"}`}>
        English sound check
      </div>
      <p className="mt-1 text-lg font-black leading-7 text-slate-950">
        {primary.status === "correct"
          ? `Good — ${primary.titleEn} is coming through.`
          : `Try this sound again: ${primary.titleEn}.`}
      </p>
      <p className={`mt-1 text-sm font-semibold leading-6 ${primary.status === "correct" ? "text-emerald-900" : "text-amber-900"}`}>
        {primary.guidanceVi}
      </p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
        {primary.guidanceEn}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {feedback.items.map((item) => (
          <span
            key={item.category}
            className={`rounded-full border px-2 py-0.5 text-[11px] font-black uppercase ${
              item.status === "correct"
                ? "border-emerald-200 bg-white text-emerald-700"
                : "border-amber-200 bg-white text-amber-700"
            }`}
          >
            {item.titleVi}
          </span>
        ))}
      </div>
    </div>
  );
}
