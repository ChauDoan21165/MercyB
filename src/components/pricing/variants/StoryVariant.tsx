// src/components/pricing/variants/StoryVariant.tsx
//
// Variant 5 — "Story". Lead with a short note from Chau (the
// founder, an exiled Vietnamese journalist) explaining why
// MercyBlade exists. Hypothesis: visitors who respond to founder
// authenticity convert at a higher rate when the paywall doesn't
// feel transactional.
//
// The story copy in this shell is a teacher-warm draft — Chau
// will replace with his own voice before this variant ships to
// public traffic. The component renders fine either way.

import {
  SHARED_GUARANTEE_VI,
  SHARED_PLANS,
} from "./sharedTierData";
import {
  CARD,
  CARD_HIGHLIGHT,
  PAGE_WRAP,
  PRIMARY_CTA,
  SECONDARY_CTA,
} from "./variantStyles";

// Placeholder story — Chau to replace with his own voice.
const STORY_PARAGRAPHS_VI: ReadonlyArray<string> = [
  "[Đoạn 1 — về việc Chau là nhà báo Việt lưu vong, lý do anh xây MercyBlade. Một câu hook, một câu sự thật, không sáo rỗng.]",
  "[Đoạn 2 — vì sao Mercy phải hiểu lỗi tiếng Việt cụ thể, không phải app dịch chung chung. Liên kết với người Việt diaspora đang vật lộn với phỏng vấn, IELTS, công việc.]",
  "[Đoạn 3 — lời mời rõ ràng: nếu câu chuyện này chạm bạn, hãy đồng hành. Premium giúp dự án sống và mở rộng nội dung tiếng Việt.]",
];

const SIGN_OFF_VI = "— Chau, founder";

export type StoryVariantProps = {
  onSelectPlan: (key: "month" | "year") => void;
};

export default function StoryVariant({ onSelectPlan }: StoryVariantProps) {
  return (
    <div className={PAGE_WRAP}>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-wide font-bold text-emerald-700 mb-1">
          Lá thư từ founder
        </div>
        <h1 className="text-2xl font-bold text-black/90">
          Vì sao MercyBlade tồn tại
        </h1>
      </header>

      <section className="space-y-4 mb-6">
        {STORY_PARAGRAPHS_VI.map((p, i) => (
          <p key={i} className="text-[15px] text-black/85 leading-relaxed">
            {p}
          </p>
        ))}
        <p className="text-sm text-black/65 italic">{SIGN_OFF_VI}</p>
      </section>

      <h2 className="text-base font-bold text-black/90 mb-3">
        Đồng hành với dự án
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {SHARED_PLANS.map((plan) => {
          const cardClass = plan.key === "year" ? CARD_HIGHLIGHT : CARD;
          return (
            <article key={plan.key} className={cardClass}>
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
          );
        })}
      </div>

      <p className="text-xs text-black/50 text-center">{SHARED_GUARANTEE_VI}</p>
    </div>
  );
}
