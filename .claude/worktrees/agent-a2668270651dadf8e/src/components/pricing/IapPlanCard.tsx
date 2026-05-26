// src/components/pricing/IapPlanCard.tsx
//
// iOS-only subscription purchase card. Rendered by Pricing.tsx in place
// of the Stripe monthly/yearly cards when getPlatform() === "ios".
//
// Responsibilities:
// - Fetch current offering from RevenueCat on mount
// - Surface loading / error / "IAP not configured" states
// - Render monthly + yearly purchase buttons with localized prices
// - Render Apple-required "Restore Purchases" button
// - Render compact subscription disclosure near the buy buttons
//   (duration, auto-renewal, cancel anytime, Terms/Privacy links) —
//   complements the full disclosure footer at the bottom of Pricing.tsx
//   which remains unchanged.
// - After successful purchase, show "Manage in Apple" link (user already
//   subscribed via IAP).

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  APPLE_MANAGE_SUBSCRIPTIONS_URL,
  getCurrentEntitlement,
  getIapOfferings,
  isIapReady,
  purchasePackageById,
  restorePurchases,
  type IapPackageSummary,
} from "@/lib/iap";
import IapStateBanner, { type IapBannerKind } from "./IapStateBanner";

type Kind = "monthly" | "yearly";

type Status =
  | { type: "loading_offerings" }
  | { type: "offerings_error"; message: string }
  | { type: "not_configured" }
  | { type: "ready"; monthly: IapPackageSummary | null; yearly: IapPackageSummary | null };

interface Banner {
  kind: IapBannerKind;
  en: string;
  vi: string;
}

interface IapPlanCardProps {
  /**
   * Called when a purchase or restore succeeds and the user holds an
   * active entitlement. Pricing.tsx uses this to refresh the server-side
   * entitlement (so trial banners, admin panels, etc. update) and/or to
   * navigate the user onward.
   */
  onEntitlementGranted?: () => void;
}

export default function IapPlanCard({ onEntitlementGranted }: IapPlanCardProps) {
  const [status, setStatus] = useState<Status>({ type: "loading_offerings" });
  const [busy, setBusy] = useState<Kind | "restore" | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const loadOfferings = useCallback(async () => {
    if (!isIapReady()) {
      setStatus({ type: "not_configured" });
      return;
    }
    setStatus({ type: "loading_offerings" });
    const result = await getIapOfferings();
    if (!result.ok) {
      setStatus({ type: "offerings_error", message: result.error });
      return;
    }
    setStatus({ type: "ready", monthly: result.monthly, yearly: result.yearly });
  }, []);

  const loadEntitlement = useCallback(async () => {
    const snap = await getCurrentEntitlement();
    setAlreadySubscribed(snap.hasEntitlement);
  }, []);

  useEffect(() => {
    void loadOfferings();
    void loadEntitlement();
  }, [loadOfferings, loadEntitlement]);

  const handleBuy = useCallback(
    async (kind: Kind) => {
      if (busy) return;
      if (status.type !== "ready") return;
      const pkg = kind === "monthly" ? status.monthly : status.yearly;
      if (!pkg) return;

      setBusy(kind);
      setBanner(null);

      const result = await purchasePackageById(pkg.packageId);

      if (result.ok) {
        setBanner({
          kind: "success",
          en: "Purchase successful. You now have full access.",
          vi: "Đã mua thành công. Bạn đã có toàn quyền truy cập.",
        });
        setAlreadySubscribed(result.hasEntitlement);
        if (result.hasEntitlement) onEntitlementGranted?.();
      } else if (result.cancelled) {
        // Apple UX norm: no banner on cancel
        setBanner(null);
      } else {
        setBanner(bannerForPurchaseError(result.error));
      }

      setBusy(null);
    },
    [busy, status, onEntitlementGranted],
  );

  const handleRestore = useCallback(async () => {
    if (busy) return;
    setBusy("restore");
    setBanner(null);

    const result = await restorePurchases();

    if (result.ok) {
      if (result.hasEntitlement) {
        setAlreadySubscribed(true);
        setBanner({
          kind: "success",
          en: "Your purchases were restored.",
          vi: "Đã khôi phục các gói đã mua trước đây.",
        });
        onEntitlementGranted?.();
      } else {
        setBanner({
          kind: "info",
          en: "No previous purchase was found for this Apple ID.",
          vi: "Không tìm thấy gói đã mua trước đây trên Apple ID này.",
        });
      }
    } else {
      setBanner({
        kind: "error",
        en: "Restore failed. Please try again.",
        vi: "Khôi phục không thành công. Vui lòng thử lại.",
      });
    }

    setBusy(null);
  }, [busy, onEntitlementGranted]);

  const openAppleManage = useCallback(() => {
    try {
      window.open(APPLE_MANAGE_SUBSCRIPTIONS_URL, "_blank", "noopener,noreferrer");
    } catch {
      window.location.href = APPLE_MANAGE_SUBSCRIPTIONS_URL;
    }
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  if (status.type === "loading_offerings") {
    return <ShellCard><LoadingBlock /></ShellCard>;
  }

  if (status.type === "not_configured") {
    return (
      <ShellCard>
        <IapStateBanner
          kind="info"
          en="In-app purchases are not configured for this build."
          vi="Mua trong ứng dụng chưa được cấu hình cho bản dựng này."
        />
      </ShellCard>
    );
  }

  if (status.type === "offerings_error") {
    return (
      <ShellCard>
        <IapStateBanner
          kind="error"
          en="We couldn't load pricing. Please try again."
          vi="Không thể tải gói. Vui lòng thử lại."
        />
        <button type="button" onClick={() => void loadOfferings()} style={secondaryBtnStyle}>
          Try again / Thử lại
        </button>
      </ShellCard>
    );
  }

  const { monthly, yearly } = status;
  const monthlyBusy = busy === "monthly";
  const yearlyBusy = busy === "yearly";
  const restoreBusy = busy === "restore";

  return (
    <ShellCard>
      {banner ? <IapStateBanner kind={banner.kind} en={banner.en} vi={banner.vi} /> : null}

      {alreadySubscribed ? (
        <div style={alreadySubscribedBoxStyle}>
          <div style={{ fontWeight: 900 }}>
            You already have Mercy Blade Pro on this Apple ID.
          </div>
          <div style={{ fontSize: 12, color: "#5eead4", marginTop: 2 }}>
            Bạn đã có Mercy Blade Pro trên Apple ID này.
          </div>
          <button type="button" onClick={openAppleManage} style={{ ...primaryBtnStyle, marginTop: 12 }}>
            Manage in Apple / Quản lý qua Apple
          </button>
        </div>
      ) : (
        <>
          <PlanRow
            titleEn="Premium — Monthly"
            titleVi="Premium — Hàng tháng"
            pkg={monthly}
            busy={monthlyBusy}
            disabled={yearlyBusy || restoreBusy}
            onBuy={() => void handleBuy("monthly")}
            ctaEnIdle="Subscribe monthly"
            ctaViIdle="Đăng ký hàng tháng"
            ctaEnBusy="Opening Apple sheet…"
            ctaViBusy="Đang mở Apple…"
          />
          <PlanRow
            titleEn="Premium — Yearly"
            titleVi="Premium — Hàng năm"
            highlight
            pkg={yearly}
            busy={yearlyBusy}
            disabled={monthlyBusy || restoreBusy}
            onBuy={() => void handleBuy("yearly")}
            ctaEnIdle="Subscribe yearly"
            ctaViIdle="Đăng ký hàng năm"
            ctaEnBusy="Opening Apple sheet…"
            ctaViBusy="Đang mở Apple…"
          />
        </>
      )}

      <button
        type="button"
        onClick={() => void handleRestore()}
        disabled={restoreBusy || monthlyBusy || yearlyBusy}
        style={{ ...restoreBtnStyle, opacity: restoreBusy ? 0.7 : 1 }}
      >
        {restoreBusy ? "Restoring… / Đang khôi phục…" : "Restore Purchases / Khôi phục"}
      </button>

      <InlineDisclosure />
    </ShellCard>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function ShellCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        gridColumn: "span 2",
        minHeight: 460,
        borderRadius: 18,
        border: "1px solid rgba(15,23,42,0.10)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        background: "#ffffff",
        boxShadow: "0 6px 20px rgba(15,23,42,0.05)",
      }}
    >
      <div>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: "#111827" }}>
          Mercy Blade Pro
        </h3>
        <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
          Toàn quyền truy cập / Full access
        </div>
      </div>
      {children}
    </div>
  );
}

function LoadingBlock() {
  return (
    <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
      Loading plans… / Đang tải gói…
    </div>
  );
}

function PlanRow(props: {
  titleEn: string;
  titleVi: string;
  pkg: IapPackageSummary | null;
  busy: boolean;
  disabled: boolean;
  onBuy: () => void;
  ctaEnIdle: string;
  ctaViIdle: string;
  ctaEnBusy: string;
  ctaViBusy: string;
  highlight?: boolean;
}) {
  const { titleEn, titleVi, pkg, busy, disabled, onBuy, ctaEnIdle, ctaViIdle, ctaEnBusy, ctaViBusy, highlight } = props;
  return (
    <div
      style={{
        borderRadius: 14,
        border: highlight ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(15,23,42,0.08)",
        background: highlight
          ? "linear-gradient(180deg, rgba(236,253,245,0.98) 0%, rgba(240,253,250,0.96) 100%)"
          : "#fafafa",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 900, color: "#111827" }}>{titleEn}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{titleVi}</div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#111827" }}>
        {pkg ? pkg.priceString : "—"}
      </div>
      <button
        type="button"
        onClick={onBuy}
        disabled={!pkg || busy || disabled}
        style={{
          ...primaryBtnStyle,
          cursor: !pkg || busy || disabled ? "not-allowed" : "pointer",
          opacity: !pkg || disabled ? 0.6 : busy ? 0.85 : 1,
          marginTop: 4,
        }}
      >
        <span style={{ display: "block" }}>
          {busy ? ctaEnBusy : ctaEnIdle}
          <span style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.78)", marginTop: 2 }}>
            {busy ? ctaViBusy : ctaViIdle}
          </span>
        </span>
      </button>
    </div>
  );
}

function InlineDisclosure() {
  return (
    <div
      style={{
        marginTop: 4,
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "#f8fafc",
        fontSize: 12,
        lineHeight: 1.55,
        color: "#475569",
      }}
    >
      <p style={{ margin: 0 }}>
        <strong>Auto-renewing subscription.</strong> Billed through your Apple ID.
        Subscription automatically renews for the same duration and price unless
        cancelled at least 24 hours before the renewal date. Manage or cancel any
        time in Settings → Apple ID → Subscriptions.
      </p>
      <p style={{ margin: "6px 0 0", color: "#64748b" }}>
        Gói tự động gia hạn. Thanh toán qua Apple ID của bạn. Tự động gia hạn
        với cùng thời hạn và giá trừ khi hủy ít nhất 24 giờ trước ngày gia hạn.
        Quản lý hoặc hủy trong Cài đặt → Apple ID → Đăng ký.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
        <a href="/terms" target="_blank" rel="noopener noreferrer" style={linkStyle}>
          Terms (EULA) / Điều khoản
        </a>
        <a href="/privacy" target="_blank" rel="noopener noreferrer" style={linkStyle}>
          Privacy / Quyền riêng tư
        </a>
      </div>
    </div>
  );
}

// ── Error → banner mapping ──────────────────────────────────────────────────

function bannerForPurchaseError(code: string): Banner {
  switch (code) {
    case "store_problem":
      return {
        kind: "error",
        en: "Please make sure you're signed into your Apple ID and try again.",
        vi: "Vui lòng đăng nhập Apple ID và thử lại.",
      };
    case "purchase_not_allowed":
      return {
        kind: "error",
        en: "Purchases are not allowed on this device.",
        vi: "Thiết bị này không cho phép thanh toán trong ứng dụng.",
      };
    case "product_not_available":
      return {
        kind: "error",
        en: "This plan is not available right now. Please try again later.",
        vi: "Gói này hiện không khả dụng. Vui lòng thử lại sau.",
      };
    case "already_purchased":
      return {
        kind: "info",
        en: "You already have this subscription on this Apple ID. Try Restore Purchases.",
        vi: "Bạn đã có gói này trên Apple ID này. Hãy bấm Khôi phục.",
      };
    case "receipt_in_use_other":
      return {
        kind: "error",
        en: "This subscription belongs to another account. Sign in with that Apple ID to restore.",
        vi: "Gói này thuộc về tài khoản khác. Đăng nhập Apple ID đó để khôi phục.",
      };
    case "network":
    case "offline":
      return {
        kind: "error",
        en: "Network error. Check your connection and try again.",
        vi: "Lỗi mạng. Kiểm tra kết nối và thử lại.",
      };
    case "operation_in_progress":
      return {
        kind: "pending",
        en: "Another purchase is already in progress.",
        vi: "Đang có một giao dịch khác đang xử lý.",
      };
    case "payment_pending":
      return {
        kind: "pending",
        en: "Your purchase is waiting for approval (Ask to Buy).",
        vi: "Giao dịch đang chờ phê duyệt (Ask to Buy).",
      };
    default:
      return {
        kind: "error",
        en: "Purchase failed. Please try again.",
        vi: "Mua không thành công. Vui lòng thử lại.",
      };
  }
}

// ── Inline styles ───────────────────────────────────────────────────────────

const primaryBtnStyle: React.CSSProperties = {
  borderRadius: 12,
  minHeight: 46,
  padding: "10px 16px",
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#0f172a",
  color: "#ffffff",
  fontWeight: 900,
  fontSize: 14,
  cursor: "pointer",
  width: "100%",
  textAlign: "center",
};

const secondaryBtnStyle: React.CSSProperties = {
  borderRadius: 12,
  minHeight: 42,
  padding: "8px 14px",
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#ffffff",
  color: "#0f172a",
  fontWeight: 800,
  fontSize: 13,
  cursor: "pointer",
  marginTop: 8,
};

const restoreBtnStyle: React.CSSProperties = {
  borderRadius: 12,
  minHeight: 42,
  padding: "10px 14px",
  border: "1px solid rgba(15,23,42,0.18)",
  background: "#ffffff",
  color: "#0f172a",
  fontWeight: 800,
  fontSize: 13,
  cursor: "pointer",
  width: "100%",
  marginTop: 4,
};

const alreadySubscribedBoxStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(13,148,136,0.22)",
  background: "rgba(240,253,250,0.96)",
  color: "#115e59",
};

const linkStyle: React.CSSProperties = {
  color: "#2563eb",
  textDecoration: "underline",
  fontSize: 12,
};
