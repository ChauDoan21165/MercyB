import type { VietnameseToneFeedbackDisplay } from "@/lib/pronunciation/vietnameseToneFeedback";

type Props = {
  enabled: boolean;
  feedback: VietnameseToneFeedbackDisplay | null;
};

export default function VietnameseToneFeedbackCard({ enabled, feedback }: Props) {
  if (!enabled || !feedback) return null;

  const isCorrect = feedback.status === "correct";
  const isTryAgain = feedback.status === "try_again";
  const isAbstain = feedback.status === "unsupported" || feedback.status === "unclear";
  const toneLabel = `Thanh ${feedback.toneLabelVi}`;
  const headline = isAbstain
    ? feedback.status === "unsupported"
      ? `${toneLabel}: Mercy chưa chấm chắc thanh này.`
      : "Mercy chưa nghe rõ đường giọng."
    : isCorrect
      ? `${toneLabel} đúng rồi.`
      : `${toneLabel} đang gần hơn rồi.`;
  const guidance = isAbstain
    ? feedback.practicePromptVi
    : isCorrect
      ? `Giọng của bạn đang ${feedback.directionLabelVi} giống câu mẫu.`
      : `Thử thêm một lần: ${feedback.directionLabelVi} rõ hơn một chút.`;
  const toneClasses = isCorrect
    ? "border-emerald-200 bg-emerald-50 text-emerald-950"
    : isTryAgain
      ? "border-amber-200 bg-amber-50 text-amber-950"
      : "border-sky-200 bg-sky-50 text-sky-950";
  const accentClasses = isCorrect
    ? "text-emerald-700"
    : isTryAgain
      ? "text-amber-700"
      : "text-sky-700";
  const bodyClasses = isCorrect
    ? "text-emerald-900"
    : isTryAgain
      ? "text-amber-900"
      : "text-sky-900";

  return (
    <section
      data-testid="vietnamese-tone-feedback"
      role="status"
      aria-live="polite"
      className={`mt-4 rounded-[16px] border px-4 py-4 ${toneClasses}`}
    >
      <div className={`text-xs font-black uppercase ${accentClasses}`}>
        {isCorrect ? "Đúng thanh điệu" : isTryAgain ? "Luyện thêm" : "Nghe chưa đủ chắc"}
      </div>
      <p className="mt-1 text-sm font-black leading-6">
        {headline}
      </p>
      <p className={`mt-1 text-sm font-semibold leading-6 ${bodyClasses}`}>
        {guidance}
      </p>
      {typeof feedback.score === "number" ? (
        <p className={`mt-1 text-xs font-semibold ${isCorrect ? "text-emerald-800" : "text-amber-800"}`}>
          Điểm thanh điệu khoảng {feedback.score}%.
        </p>
      ) : (
        <p className="mt-1 text-xs font-semibold text-sky-800">
          Không hiện điểm khi bằng chứng chưa đủ chắc.
        </p>
      )}
    </section>
  );
}
