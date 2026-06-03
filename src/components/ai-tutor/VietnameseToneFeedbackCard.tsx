import type { VietnameseToneFeedbackDisplay } from "@/lib/pronunciation/vietnameseToneFeedback";

type Props = {
  enabled: boolean;
  feedback: VietnameseToneFeedbackDisplay | null;
};

export default function VietnameseToneFeedbackCard({ enabled, feedback }: Props) {
  if (!enabled || !feedback) return null;

  const isCorrect = feedback.status === "correct";
  const toneLabel = `Thanh ${feedback.toneLabelVi}`;
  const headline = isCorrect
    ? `${toneLabel} đúng rồi.`
    : `${toneLabel} chưa khớp.`;
  const guidance = isCorrect
    ? `Giọng của bạn đang ${feedback.directionLabelVi} giống câu mẫu.`
    : `Hãy thử ${feedback.directionLabelVi} rõ hơn một chút.`;

  return (
    <section
      data-testid="vietnamese-tone-feedback"
      role="status"
      aria-live="polite"
      className={`mt-4 rounded-[16px] border px-4 py-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}
    >
      <div className={`text-xs font-black uppercase ${isCorrect ? "text-emerald-700" : "text-amber-700"}`}>
        {isCorrect ? "Đúng thanh điệu" : "Thử lại"}
      </div>
      <p className={`mt-1 text-sm font-black leading-6 ${isCorrect ? "text-emerald-950" : "text-amber-950"}`}>
        {headline}
      </p>
      <p className={`mt-1 text-sm font-semibold leading-6 ${isCorrect ? "text-emerald-900" : "text-amber-900"}`}>
        {guidance}
      </p>
      <p className={`mt-1 text-xs font-semibold ${isCorrect ? "text-emerald-800" : "text-amber-800"}`}>
        Điểm thanh điệu khoảng {feedback.score}%.
      </p>
    </section>
  );
}
