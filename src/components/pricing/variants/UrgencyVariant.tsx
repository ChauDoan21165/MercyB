// src/components/pricing/variants/UrgencyVariant.tsx
//
// Variant 1 — "Urgency". Lead with a 24-hour countdown framed as
// "your trial expires in N hours" so the visitor feels a real
// deadline. Trial mechanics live elsewhere; this variant only
// surfaces the existing trial expiration time as a countdown.
//
// Copy stance: never fake-urgent. The 24h is the trial window. If
// the visitor is already past trial, the countdown hides and the
// component falls back to a neutral CTA — we do not invent fake
// timers.

import { useEffect, useMemo, useState } from "react";

import {
  SHARED_GUARANTEE_VI,
  SHARED_PLANS,
} from "./sharedTierData";
import {
  BULLET_LIST,
  CARD_HIGHLIGHT,
  PAGE_WRAP,
  PRIMARY_CTA,
} from "./variantStyles";

export type UrgencyVariantProps = {
  /**
   * Trial-expiration ISO timestamp from `useUserAccess`. When
   * supplied AND in the future, the countdown renders. When null
   * or in the past, the urgency block is suppressed.
   */
  trialExpiresAt?: string | null;
  onSelectPlan: (key: "month" | "year") => void;
};

function formatRemaining(ms: number): string {
  if (ms <= 0) return "0:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function UrgencyVariant({
  trialExpiresAt,
  onSelectPlan,
}: UrgencyVariantProps) {
  const expiresAtMs = useMemo(() => {
    if (!trialExpiresAt) return null;
    const t = Date.parse(trialExpiresAt);
    return Number.isNaN(t) ? null : t;
  }, [trialExpiresAt]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (expiresAtMs === null) return;
    if (expiresAtMs <= Date.now()) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [expiresAtMs]);

  const remainingMs = expiresAtMs === null ? null : expiresAtMs - now;
  const showCountdown = remainingMs !== null && remainingMs > 0;

  const yearly = SHARED_PLANS.find((p) => p.key === "year")!;
  const monthly = SHARED_PLANS.find((p) => p.key === "month")!;

  return (
    <div className={PAGE_WRAP}>
      <header className="mb-5">
        {showCountdown ? (
          <div className="mb-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="text-xs uppercase tracking-wide font-bold mb-1">
              Còn lại
            </div>
            <div className="text-3xl font-mono font-bold">
              {formatRemaining(remainingMs!)}
            </div>
            <div className="text-xs mt-1 text-amber-800">
              Ưu đãi bản dùng thử kết thúc khi đồng hồ về 0.
            </div>
          </div>
        ) : null}

        <h1 className="text-2xl font-bold text-black/90">
          Mở khóa toàn bộ phòng premium hôm nay
        </h1>
        <p className="text-sm text-black/60 mt-1">
          Đừng để lịch học gián đoạn. Nâng cấp ngay để giữ đà.
        </p>
      </header>

      <section className={CARD_HIGHLIGHT + " mb-4"}>
        <div className="text-xs uppercase tracking-wide font-bold text-emerald-700 mb-1">
          Lựa chọn tốt nhất
        </div>
        <h2 className="text-lg font-bold text-black/90">{yearly.title_vi}</h2>
        <div className="text-2xl font-bold text-black/95 mt-1">
          {yearly.price_label}
        </div>
        <div className="text-xs text-black/60">{yearly.price_subtitle_vi}</div>

        <ul className={BULLET_LIST + " mt-3"}>
          {yearly.bullets_vi.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onSelectPlan("year")}
          className={PRIMARY_CTA + " mt-4"}
        >
          {yearly.cta_vi}
        </button>
      </section>

      <button
        type="button"
        onClick={() => onSelectPlan("month")}
        className="block w-full text-center text-sm text-black/65 hover:text-black/85 underline"
      >
        Hoặc chọn gói tháng — {monthly.price_label} / tháng
      </button>

      <p className="text-xs text-black/50 mt-6 text-center">
        {SHARED_GUARANTEE_VI}
      </p>
    </div>
  );
}
