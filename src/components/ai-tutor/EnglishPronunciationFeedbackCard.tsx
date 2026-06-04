import type { EnglishPronunciationFeedbackDisplay } from "@/lib/pronunciation/englishPronunciationFeedback";

type Props = {
  enabled: boolean;
  feedback: EnglishPronunciationFeedbackDisplay | null;
};

export default function EnglishPronunciationFeedbackCard({ enabled, feedback }: Props) {
  if (!enabled || !feedback) return null;

  if (feedback.items.length === 0 && feedback.abstain) {
    return (
      <div
        className="mt-4 rounded-[16px] border border-sky-200 bg-sky-50 px-4 py-4"
        data-testid="english-pronunciation-feedback"
        role="status"
        aria-live="polite"
      >
        <div className="text-xs font-black uppercase text-sky-700">
          Luyện tiếp
        </div>
        <p className="mt-1 text-lg font-black leading-7 text-sky-950">
          {feedback.abstain.titleVi}
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-sky-900">
          {feedback.abstain.bodyVi}
        </p>
        <p className="mt-2 rounded-[12px] border border-sky-100 bg-white px-3 py-2 text-sm font-black leading-6 text-sky-950">
          {feedback.abstain.nextStepVi}
        </p>
      </div>
    );
  }

  if (feedback.items.length === 0) return null;

  const primary = feedback.items[0];
  const isCorrect = primary.status === "correct";

  return (
    <div
      className={`mt-4 rounded-[16px] border px-4 py-4 ${
        isCorrect
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50"
      }`}
      data-testid="english-pronunciation-feedback"
      role="status"
      aria-live="polite"
    >
      <div className={`text-xs font-black uppercase ${isCorrect ? "text-emerald-700" : "text-amber-700"}`}>
        English sound check
      </div>
      <p className="mt-1 text-lg font-black leading-7 text-slate-950">
        {isCorrect
          ? `Good — ${primary.titleEn} is coming through.`
          : `This sound is a good next practice: ${primary.titleEn}.`}
      </p>
      <p className={`mt-1 text-sm font-semibold leading-6 ${isCorrect ? "text-emerald-900" : "text-amber-900"}`}>
        {primary.guidanceVi}
      </p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">
        {primary.guidanceEn}
      </p>
      {!isCorrect && (
        <p className="mt-2 rounded-[12px] border border-amber-100 bg-white px-3 py-2 text-sm font-black leading-6 text-amber-950">
          Luyện chậm lại một lần nữa, chỉ tập trung âm này.
        </p>
      )}
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
