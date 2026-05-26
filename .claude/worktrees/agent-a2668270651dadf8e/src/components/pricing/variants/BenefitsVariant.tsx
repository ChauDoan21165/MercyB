// src/components/pricing/variants/BenefitsVariant.tsx
//
// Variant 2 — "Benefits". Lead with the concrete things the
// learner unlocks with premium, then the price. The hypothesis is
// that visitors who haven't decided what they're paying for need
// a feature itinerary first.

import {
  SHARED_GUARANTEE_VI,
  SHARED_PLANS,
} from "./sharedTierData";
import {
  CARD,
  PAGE_WRAP,
  PRIMARY_CTA,
  SECONDARY_CTA,
} from "./variantStyles";

const PREMIUM_BENEFITS_VI: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Toàn bộ 510+ phòng học",
    body: "Mở từng phòng theo chủ đề: việc làm, di trú, y tế, đời sống Mỹ.",
  },
  {
    title: "Cô Mercy đồng hành",
    body: "Cô giáo AI nói tiếng Việt giải thích lỗi L1, không phải app dịch.",
  },
  {
    title: "Phỏng vấn thử thực tế",
    body: "Năm kịch bản viết tay theo nghề người Việt: nail, nhà hàng, helpdesk…",
  },
  {
    title: "Sửa phát âm theo cặp âm Việt-Anh",
    body: "Bài tập đối xứng từ chính lỗi phát âm phổ biến của người Việt.",
  },
  {
    title: "Ghi nhớ điểm yếu",
    body: "Mercy nhớ lỗi nào lặp lại và đẩy bài tập đúng vào điểm còn yếu.",
  },
];

export type BenefitsVariantProps = {
  onSelectPlan: (key: "month" | "year") => void;
};

export default function BenefitsVariant({ onSelectPlan }: BenefitsVariantProps) {
  return (
    <div className={PAGE_WRAP}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-black/90">
          Premium mở khóa những gì?
        </h1>
        <p className="text-sm text-black/60 mt-1">
          Đây là những thứ Mercy chỉ làm được khi bạn nâng cấp.
        </p>
      </header>

      <ul className="space-y-3 mb-6">
        {PREMIUM_BENEFITS_VI.map((b) => (
          <li
            key={b.title}
            className="rounded-xl border border-black/10 bg-white p-4"
          >
            <div className="text-base font-semibold text-black/90">
              ✓ {b.title}
            </div>
            <div className="text-sm text-black/65 mt-1 leading-relaxed">
              {b.body}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-base font-bold text-black/90 mb-3">Chọn gói</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {SHARED_PLANS.map((plan) => (
          <article key={plan.key} className={CARD}>
            <div className="text-sm font-semibold text-black/85">
              {plan.title_vi}
            </div>
            <div className="text-xl font-bold text-black/95 mt-1">
              {plan.price_label}
            </div>
            <div className="text-xs text-black/55 mb-3">
              {plan.price_subtitle_vi}
            </div>
            <button
              type="button"
              onClick={() => onSelectPlan(plan.key)}
              className={plan.key === "year" ? PRIMARY_CTA : SECONDARY_CTA}
            >
              {plan.cta_vi}
            </button>
          </article>
        ))}
      </div>

      <p className="text-xs text-black/50 text-center">{SHARED_GUARANTEE_VI}</p>
    </div>
  );
}
