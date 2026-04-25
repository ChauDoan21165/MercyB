// Premium gate for TOEIC prep mode.
//
// Mirrors PaywallProfessionPackGate: while access is loading we render
// nothing; if the user has premium access, children render unchanged;
// otherwise an inline upgrade prompt with a /pricing CTA.

import { Link } from "react-router-dom";

import { useUserAccess } from "@/hooks/useUserAccess";

export type TOEICPaywallGateProps = {
  children: React.ReactNode;
};

export default function TOEICPaywallGate({ children }: TOEICPaywallGateProps) {
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
      <div className="rounded-2xl border-2 border-indigo-300 bg-indigo-50 p-6">
        <div className="text-xs uppercase tracking-wide font-bold text-indigo-700 mb-2">
          Tính năng Premium
        </div>
        <h2 className="text-2xl font-bold text-black/90">
          TOEIC prep mở khóa với Premium
        </h2>
        <p className="text-sm text-black/70 mt-3 leading-relaxed">
          Luyện thi TOEIC theo đúng cấu trúc thi thật — 7 phần, đồng hồ
          đếm ngược, ước tính điểm 10–990, và phân tích lỗi theo lỗi
          phổ biến của người Việt. Dành cho định cư, công việc, và phỏng vấn.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/pricing"
            className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold no-underline hover:bg-indigo-700 transition"
          >
            Xem gói Premium
          </Link>
          <Link to="/" className="text-sm text-black/60 hover:text-black/85 underline">
            ← Về trang chủ
          </Link>
        </div>
      </div>
      <p className="text-xs text-black/45 mt-4 text-center">
        Đề luyện TOEIC nguyên bản — không phải đề thi thật, viết riêng cho học viên Việt.
      </p>
    </div>
  );
}
