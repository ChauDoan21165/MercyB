// src/components/profession-packs/PaywallProfessionPackGate.tsx
//
// Premium gate for profession packs (Step 10 — VN moat depth).
//
// Profession packs (nail tech, restaurant, helpdesk, …) are paid-tier
// features. This component:
//   1. Reads the user's effective access via `useUserAccess`.
//   2. While loading, renders nothing (avoids a flash of "upgrade").
//   3. If the user has premium access, renders children unchanged.
//   4. Otherwise, renders an inline upgrade prompt with a CTA to /pricing.
//
// Why a component, not a route guard:
//   - The pack pages have an attractive preview section (vocabulary
//     count, scenario titles) that renders fine for unpaid users —
//     it's a soft paywall. Free users see the value, then hit the
//     upgrade CTA when they try to open a lesson.
//   - Component-level gating lets each page choose how much to
//     reveal vs lock. Route-level gating would force "all-or-nothing".

import { Link } from "react-router-dom";

import { useUserAccess } from "@/hooks/useUserAccess";

export type PaywallProfessionPackGateProps = {
  /** What renders when the user has premium access. */
  children: React.ReactNode;
  /** Localized name shown in the upgrade prompt. */
  packTitleVi: string;
};

export default function PaywallProfessionPackGate({
  children,
  packTitleVi,
}: PaywallProfessionPackGateProps) {
  const { isLoading, hasPremium } = useUserAccess();

  if (isLoading) {
    return (
      <div className="px-4 py-12 text-center text-sm text-black/40">
        Đang kiểm tra quyền truy cập…
      </div>
    );
  }

  if (hasPremium) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6">
        <div className="text-xs uppercase tracking-wide font-bold text-emerald-700 mb-2">
          Tính năng Premium
        </div>
        <h2 className="text-2xl font-bold text-black/90">
          {packTitleVi} mở khóa với Premium
        </h2>
        <p className="text-sm text-black/70 mt-3 leading-relaxed">
          Bộ tiếng Anh chuyên ngành dành cho người Việt làm nghề nail —
          từ vựng tiệm, câu giao tiếp với khách, kịch bản role-play,
          và lỗi phát âm hay gặp. Học theo những gì thật sự nói ở tiệm.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/pricing"
            className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold no-underline hover:bg-emerald-700 transition"
          >
            Xem gói Premium
          </Link>
          <Link
            to="/"
            className="text-sm text-black/60 hover:text-black/85 underline"
          >
            ← Về trang chủ
          </Link>
        </div>
      </div>

      <p className="text-xs text-black/45 mt-4 text-center">
        Có một bộ tiếng Anh chuyên ngành — không phải tiếng Anh ESL chung chung.
      </p>
    </div>
  );
}
