import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";

import { Bilingual } from "@/components/Bilingual";

export function ParentPaywallGate() {
  return (
    <section
      data-testid="parent-paywall"
      className="mx-auto w-full max-w-[560px] rounded-[20px] border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-white px-5 py-8 text-center shadow-[0_10px_28px_rgba(16,185,129,0.08)]"
    >
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Lock className="h-6 w-6 text-emerald-500" aria-hidden />
      </div>
      <Bilingual
        primary="vi"
        vi="Trang dành cho phụ huynh có trong gói Premium."
        en="The parent view is included with Premium."
        viClassName="text-base font-bold leading-snug text-slate-900"
        enClassName="mt-1 text-[13px] leading-snug text-slate-500"
      />
      <Link
        to="/pricing"
        className="mt-4 inline-block rounded-full bg-emerald-600 px-6 py-2 text-sm font-bold text-white"
      >
        <Bilingual
          primary="vi"
          vi="Xem gói Premium"
          en="See Premium"
          viAs="span"
          enAs="span"
          viClassName="text-sm font-bold text-white"
          enClassName="ml-1 text-[12px] text-white/80"
        />
      </Link>
    </section>
  );
}

export function ParentAccessSkeleton() {
  return (
    <div
      data-testid="parent-access-loading"
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-[560px] px-4 py-8 text-center text-sm text-slate-500"
    >
      <span lang="vi">Đang kiểm tra quyền truy cập…</span>
    </div>
  );
}

export function ParentDataSkeleton() {
  return (
    <div
      data-testid="parent-data-loading"
      role="status"
      aria-live="polite"
      aria-label="Đang tải tóm tắt tiến bộ"
      className="mx-auto w-full max-w-[560px] space-y-4 py-4"
    >
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-[20px] bg-slate-100" />
      ))}
    </div>
  );
}

export function ParentEmptyState() {
  return (
    <section
      data-testid="parent-empty"
      className="rounded-[20px] border border-slate-200/70 bg-gradient-to-br from-slate-50 to-white px-4 py-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
    >
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Sparkles className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>
      <Bilingual
        primary="vi"
        vi="Chưa có tóm tắt tuần này. Hãy luyện thêm vài buổi để phần này hiện rõ hơn."
        en="A few more practice sessions will fill this summary in."
        viClassName="text-sm font-semibold leading-snug text-slate-900"
        enClassName="mt-1 text-[12px] leading-snug text-slate-500"
      />
    </section>
  );
}
