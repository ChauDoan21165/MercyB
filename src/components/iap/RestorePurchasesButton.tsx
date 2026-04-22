// src/components/iap/RestorePurchasesButton.tsx
//
// iOS-only drop-in button that lets a user restore subscriptions made
// under the current Apple ID. Apple requires a visible "Restore
// Purchases" control. The primary instance lives inside IapPlanCard on
// the Pricing screen; this component is a self-contained secondary
// instance suitable for the Account page.
//
// Design: zero props, zero refs, mirrors the IapStateBanner palette and
// button styling already used in IapPlanCard so the two surfaces look
// consistent. Renders null on web and Android — safe to import from any
// shared layout without extra platform branching at the call site.

import React, { useCallback, useState } from "react";
import { getPlatform } from "@/lib/platform";
import { restorePurchases } from "@/lib/iap";
import IapStateBanner, {
  type IapBannerKind,
} from "@/components/pricing/IapStateBanner";

type Banner = { kind: IapBannerKind; en: string; vi: string } | null;

export default function RestorePurchasesButton() {
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  const handleClick = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setBanner(null);

    const result = await restorePurchases();

    if (result.ok) {
      setBanner(
        result.hasEntitlement
          ? {
              kind: "success",
              en: "Your purchases were restored.",
              vi: "Đã khôi phục các gói đã mua trước đây.",
            }
          : {
              kind: "info",
              en: "No previous purchase was found for this Apple ID.",
              vi: "Không tìm thấy gói đã mua trước đây trên Apple ID này.",
            },
      );
    } else {
      setBanner({
        kind: "error",
        en: "Restore failed. Please try again.",
        vi: "Khôi phục không thành công. Vui lòng thử lại.",
      });
    }

    setBusy(false);
  }, [busy]);

  if (getPlatform() !== "ios") return null;

  return (
    <div>
      {banner ? (
        <IapStateBanner kind={banner.kind} en={banner.en} vi={banner.vi} />
      ) : null}
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={busy}
        style={{
          borderRadius: 12,
          minHeight: 42,
          padding: "10px 14px",
          border: "1px solid rgba(15,23,42,0.18)",
          background: "#ffffff",
          color: "#0f172a",
          fontWeight: 800,
          fontSize: 13,
          cursor: busy ? "wait" : "pointer",
          width: "100%",
          opacity: busy ? 0.7 : 1,
        }}
      >
        {busy ? "Restoring… / Đang khôi phục…" : "Restore Purchases / Khôi phục"}
      </button>
    </div>
  );
}
