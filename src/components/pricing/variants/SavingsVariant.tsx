// src/components/pricing/variants/SavingsVariant.tsx
//
// Variant 4 — "Savings". Lead with the absolute and relative
// savings of the yearly plan vs the monthly plan, presented as the
// clear default. Monthly remains visible but visually de-prioritized.
//
// Hypothesis: price-sensitive visitors respond to a concrete dollar
// savings number more than to feature lists.

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

const SAVINGS_AMOUNT_VI = "400.000 VND";
const SAVINGS_PERCENT = "17%";
const SAVINGS_MONTHS_FREE = "gần 2 tháng miễn phí";

export type SavingsVariantProps = {
  onSelectPlan: (key: "month" | "year") => void;
};

export default function SavingsVariant({ onSelectPlan }: SavingsVariantProps) {
  const yearly = SHARED_PLANS.find((p) => p.key === "year")!;
  const monthly = SHARED_PLANS.find((p) => p.key === "month")!;

  return (
    <div className={PAGE_WRAP}>
      <header className="mb-5">
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 mb-4">
          <div className="text-xs uppercase tracking-wide font-bold text-amber-800 mb-1">
            Tiết kiệm khi chọn năm
          </div>
          <div className="text-3xl font-bold text-black/95">
            -{SAVINGS_AMOUNT_VI}
          </div>
          <div className="text-sm text-black/70 mt-1">
            Giảm {SAVINGS_PERCENT} so với gói tháng — {SAVINGS_MONTHS_FREE}.
          </div>
        </div>

        <h1 className="text-2xl font-bold text-black/90">
          Trả một lần, học cả năm
        </h1>
        <p className="text-sm text-black/60 mt-1">
          Bớt nỗi lo gia hạn, tập trung vào việc học.
        </p>
      </header>

      <section className={CARD_HIGHLIGHT + " mb-3"}>
        <div className="flex items-baseline gap-2">
          <h2 className="text-lg font-bold text-black/90">{yearly.title_vi}</h2>
          <span className="text-xs uppercase font-bold text-emerald-700">
            Tiết kiệm nhất
          </span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold text-black/95">
            {yearly.price_label}
          </span>
          <span className="text-sm text-black/55 line-through">
            {monthly.price_label} × 12
          </span>
        </div>
        <div className="text-xs text-black/60 mt-1">
          {yearly.price_subtitle_vi}
        </div>
        <button
          type="button"
          onClick={() => onSelectPlan("year")}
          className={PRIMARY_CTA + " mt-4"}
        >
          {yearly.cta_vi}
        </button>
      </section>

      <article className={CARD}>
        <div className="text-sm font-semibold text-black/85">
          {monthly.title_vi}
        </div>
        <div className="text-base text-black/85 mt-1">
          {monthly.price_label}{" "}
          <span className="text-xs text-black/55">/ tháng</span>
        </div>
        <button
          type="button"
          onClick={() => onSelectPlan("month")}
          className={SECONDARY_CTA + " mt-3"}
        >
          {monthly.cta_vi}
        </button>
      </article>

      <p className="text-xs text-black/50 text-center mt-6">
        {SHARED_GUARANTEE_VI}
      </p>
    </div>
  );
}
