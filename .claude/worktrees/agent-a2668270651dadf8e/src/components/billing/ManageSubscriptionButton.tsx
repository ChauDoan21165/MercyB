// src/components/billing/ManageSubscriptionButton.tsx

import { useState } from "react";
import { openBillingPortal } from "@/lib/billingPortal";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    // Prevent duplicate clicks — once loading starts, ignore all further clicks
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      await openBillingPortal(`${window.location.origin}/settings/billing`);

      // Note: if openBillingPortal redirects via window.location.assign,
      // this line is never reached. Loading stays true until navigation completes.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      // Only reset loading on error so the button stays disabled during navigation
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60 transition-opacity"
      >
        {loading ? (
          <span className="flex flex-col items-start gap-0.5">
            <span>Opening billing portal…</span>
            <span className="text-xs font-normal opacity-60">Đang mở cổng thanh toán…</span>
          </span>
        ) : (
          <span className="flex flex-col items-start gap-0.5">
            <span>Manage subscription</span>
            <span className="text-xs font-normal opacity-60">Quản lý gói đăng ký</span>
          </span>
        )}
      </button>

      {error ? (
        <div className="space-y-0.5">
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-red-400">Có lỗi xảy ra. Vui lòng thử lại.</p>
        </div>
      ) : null}
    </div>
  );
}