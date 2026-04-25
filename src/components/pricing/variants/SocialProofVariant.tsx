// src/components/pricing/variants/SocialProofVariant.tsx
//
// Variant 3 — "Social proof". Lead with a usage stat + 2 short
// testimonials before the price. Hypothesis: visitors hesitating
// on price are persuaded by hearing from learners similar to
// themselves (Vietnamese diaspora context).
//
// Testimonials are placeholder shells — Chau will replace each
// `name` and `quote` with real, opt-in user voices before this
// variant goes live to public traffic. The component renders fine
// either way.

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

type Testimonial = {
  name: string;
  city: string;
  quote_vi: string;
};

// Placeholder shells — swap with opt-in user quotes before launch.
const TESTIMONIALS: ReadonlyArray<Testimonial> = [
  {
    name: "[Tên học viên]",
    city: "Houston, TX",
    quote_vi:
      "[Trích dẫn về kết quả thực tế — IELTS, công việc mới, cuộc phỏng vấn — sau khi học với Mercy.]",
  },
  {
    name: "[Tên học viên]",
    city: "Garden Grove, CA",
    quote_vi:
      "[Trích dẫn về việc Mercy hiểu lỗi tiếng Việt cụ thể, không phải app dịch chung chung.]",
  },
];

const ACTIVE_LEARNERS_LABEL = "Hơn 100 học viên người Việt đang học mỗi tuần";

export type SocialProofVariantProps = {
  onSelectPlan: (key: "month" | "year") => void;
};

export default function SocialProofVariant({
  onSelectPlan,
}: SocialProofVariantProps) {
  return (
    <div className={PAGE_WRAP}>
      <header className="mb-5">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 mb-3">
          <div className="text-xs uppercase tracking-wide font-bold text-emerald-800">
            Cộng đồng đang học
          </div>
          <div className="text-base font-semibold text-black/90 mt-1">
            {ACTIVE_LEARNERS_LABEL}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-black/90">
          Người Việt như mình đã học và đang dùng MercyBlade
        </h1>
      </header>

      <section className="space-y-3 mb-6">
        {TESTIMONIALS.map((t, i) => (
          <blockquote
            key={i}
            className="rounded-xl border border-black/10 bg-white p-4"
          >
            <p className="text-sm text-black/85 leading-relaxed italic">
              "{t.quote_vi}"
            </p>
            <footer className="text-xs text-black/55 mt-2">
              — {t.name} · {t.city}
            </footer>
          </blockquote>
        ))}
      </section>

      <h2 className="text-base font-bold text-black/90 mb-3">
        Tham gia cùng họ
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
