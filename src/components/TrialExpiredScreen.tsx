import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

/**
 * Full-page replacement rendered when a free-tier user's 3-day trial
 * has ended. Shown INSTEAD of room content by the RequireTrialActive
 * guard in AppRouter. Vietnamese-first per CLAUDE.md #1.
 */
export default function TrialExpiredScreen() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white/90 p-6 shadow-sm dark:border-amber-800/50 dark:bg-slate-900/70">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
          <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" aria-hidden />
        </div>

        <h1
          lang="vi"
          className="text-center text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          Hết hạn dùng thử 3 ngày
        </h1>
        <p
          lang="en"
          className="mt-1 text-center text-sm text-slate-600 dark:text-slate-300"
        >
          Your 3-day free trial has ended
        </p>

        <p
          lang="vi"
          className="mt-4 text-center text-sm text-slate-700 dark:text-slate-300"
        >
          Nâng cấp để tiếp tục học với Mercy và mở khóa toàn bộ phòng học, Speak,
          và Grammar.
        </p>
        <p
          lang="en"
          className="mt-1 text-center text-xs text-slate-600 dark:text-slate-300"
        >
          Upgrade to continue learning with Mercy and unlock all rooms, Speak,
          and Grammar.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <span lang="vi">Xem gói</span>
            <span aria-hidden className="mx-1 opacity-70">/</span>
            <span lang="en">See plans</span>
          </Link>
          <Link
            to="/rooms"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span lang="vi">Quay lại danh sách</span>
            <span aria-hidden className="mx-1 opacity-70">/</span>
            <span lang="en">Back to rooms</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
