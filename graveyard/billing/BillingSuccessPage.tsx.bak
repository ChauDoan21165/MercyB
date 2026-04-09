// src/pages/BillingSuccessPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/lib/useEntitlements";

function getStatusLabel(status: string | null | undefined): string {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "trialing":
      return "Đang dùng thử";
    case "grace_period":
      return "Đang trong thời gian gia hạn";
    case "past_due":
      return "Quá hạn thanh toán";
    case "paused":
      return "Đã tạm dừng";
    case "expired":
      return "Đã hết hạn";
    case "revoked":
      return "Đã bị thu hồi";
    case "inactive":
    default:
      return "Chưa kích hoạt";
  }
}

type VerifyCheckoutResponse = {
  ok?: boolean;
  message?: string;
  status?: string | null;
  source?: string | null;
  error?: string;
  detail?: unknown;
};

function extractErrorMessage(payload: VerifyCheckoutResponse | null | undefined): string {
  if (!payload) return "Không thể xác minh thanh toán.";
  if (typeof payload.detail === "string" && payload.detail.trim()) return payload.detail;
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;

  if (payload.detail && typeof payload.detail === "object") {
    const detail = payload.detail as Record<string, unknown>;
    if (typeof detail.message === "string" && detail.message.trim()) {
      return detail.message;
    }
    if (typeof detail.error === "string" && detail.error.trim()) {
      return detail.error;
    }
  }

  return "Không thể xác minh thanh toán.";
}

export default function BillingSuccessPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { user, isLoading } = useAuth();
  const { ent, loading: entitlementLoading, refreshEntitlements } = useEntitlements();

  const [didRefresh, setDidRefresh] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string>("");
  const [verifyMessage, setVerifyMessage] = useState<string>("");

  const sessionId = params.get("session_id") ?? "";

  useEffect(() => {
    if (!isLoading && !user) {
      nav("/signin", { replace: true });
    }
  }, [isLoading, user, nav]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (didRefresh) return;
      if (!user) return;

      setDidRefresh(true);
      setVerifyError("");

      try {
        if (sessionId) {
          setIsVerifying(true);

          const { data, error } = await supabase.functions.invoke<VerifyCheckoutResponse>(
            "verify-checkout-session",
            {
              body: { session_id: sessionId },
            },
          );

          if (error) {
            throw new Error(error.message || "Không thể xác minh phiên thanh toán.");
          }

          if (!cancelled && data?.message) {
            setVerifyMessage(data.message);
          }
        }

        await refreshEntitlements();
      } catch (error) {
        if (!cancelled) {
          setVerifyError(
            error instanceof Error
              ? error.message
              : "Không thể đồng bộ quyền truy cập sau thanh toán.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsVerifying(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [didRefresh, refreshEntitlements, sessionId, user]);

  const isPremium = useMemo(() => ent?.is_premium === true, [ent]);

  const title = useMemo(() => {
    if (isVerifying) return "Đang xác nhận thanh toán…";
    if (entitlementLoading) return "Đang xác nhận quyền truy cập…";
    if (isPremium) return "Thanh toán thành công";
    return "Đã nhận thanh toán";
  }, [entitlementLoading, isPremium, isVerifying]);

  const subtitle = useMemo(() => {
    if (isVerifying) {
      return "Hệ thống đang xác minh phiên Stripe checkout và đồng bộ quyền truy cập của bạn.";
    }

    if (entitlementLoading) {
      return "Hệ thống đang đồng bộ quyền truy cập từ backend entitlement.";
    }

    if (isPremium) {
      return `Quyền truy cập của bạn đã được bật. Trạng thái hiện tại: ${getStatusLabel(
        ent?.status,
      )}.`;
    }

    return "Thanh toán đã hoàn tất. Nếu quyền truy cập chưa cập nhật ngay, hãy bấm làm mới quyền truy cập ở trang tài khoản.";
  }, [ent, entitlementLoading, isPremium, isVerifying]);

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "white",
  };

  const container: React.CSSProperties = {
    maxWidth: 860,
    margin: "0 auto",
    padding: "32px 16px 80px",
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 20,
    padding: 24,
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 34,
    fontWeight: 950,
    letterSpacing: -0.7,
    color: "rgba(0,0,0,0.88)",
  };

  const subtitleStyle: React.CSSProperties = {
    marginTop: 10,
    marginBottom: 0,
    fontSize: 15,
    lineHeight: 1.7,
    color: "rgba(0,0,0,0.64)",
    maxWidth: 680,
  };

  const bannerBase: React.CSSProperties = {
    marginTop: 16,
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 14,
    lineHeight: 1.6,
    border: "1px solid rgba(0,0,0,0.10)",
  };

  const infoBanner: React.CSSProperties = {
    ...bannerBase,
    background: "rgba(17,24,39,0.04)",
    color: "rgba(17,24,39,0.82)",
  };

  const errorBanner: React.CSSProperties = {
    ...bannerBase,
    background: "rgba(239,68,68,0.08)",
    color: "rgba(127,29,29,0.92)",
    border: "1px solid rgba(239,68,68,0.22)",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginTop: 18,
  };

  const panel: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 16,
    padding: 18,
    background: "#fff",
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "rgba(0,0,0,0.48)",
    marginBottom: 8,
  };

  const value: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 900,
    color: "rgba(0,0,0,0.88)",
  };

  const sub: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.60)",
  };

  const actions: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 18,
  };

  const buttonBase: React.CSSProperties = {
    borderRadius: 12,
    minHeight: 42,
    padding: "10px 14px",
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#fff",
    color: "#111827",
    fontWeight: 800,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const primaryButton: React.CSSProperties = {
    ...buttonBase,
    background: "#111827",
    color: "#fff",
    borderColor: "#111827",
  };

  async function handleRefreshAccess() {
    setVerifyError("");

    try {
      if (sessionId) {
        setIsVerifying(true);

        const { data, error } = await supabase.functions.invoke<VerifyCheckoutResponse>(
          "verify-checkout-session",
          {
            body: { session_id: sessionId },
          },
        );

        if (error) {
          throw new Error(error.message || "Không thể xác minh phiên thanh toán.");
        }

        if (data?.error || data?.ok === false) {
          throw new Error(extractErrorMessage(data));
        }

        setVerifyMessage(data?.message || "Đã đồng bộ quyền truy cập từ phiên thanh toán.");
      }

      await refreshEntitlements();
    } catch (error) {
      setVerifyError(
        error instanceof Error
          ? error.message
          : "Không thể làm mới quyền truy cập.",
      );
    } finally {
      setIsVerifying(false);
    }
  }

  if (!user && !isLoading) {
    return null;
  }

  return (
    <div style={wrap}>
      <div style={container}>
        <div style={card}>
          <h1 style={titleStyle}>{title}</h1>
          <p style={subtitleStyle}>{subtitle}</p>

          {verifyMessage ? <div style={infoBanner}>{verifyMessage}</div> : null}
          {verifyError ? <div style={errorBanner}>{verifyError}</div> : null}

          <div style={grid}>
            <div style={panel}>
              <div style={label}>Quyền truy cập hiện tại</div>
              <div style={value}>
                {entitlementLoading || isVerifying
                  ? "Đang tải…"
                  : isPremium
                    ? ent?.status === "trialing"
                      ? "Cao cấp (dùng thử)"
                      : "Cao cấp"
                    : "Miễn phí"}
              </div>
              <div style={sub}>
                Màn hình này tin backend entitlement, không tự suy đoán ở client.
              </div>
            </div>

            <div style={panel}>
              <div style={label}>Trạng thái entitlement</div>
              <div style={value}>
                {entitlementLoading || isVerifying
                  ? "Đang tải…"
                  : getStatusLabel(ent?.status)}
              </div>
              <div style={sub}>
                Raw status:{" "}
                <b>
                  {entitlementLoading || isVerifying ? "loading" : ent?.status || "inactive"}
                </b>
                <br />
                Source: <b>{ent?.source || "—"}</b>
              </div>
            </div>

            <div style={{ ...panel, gridColumn: "span 2" }}>
              <div style={label}>Chi tiết</div>
              <div style={sub}>
                Stripe checkout session: <b>{sessionId || "—"}</b>
                <br />
                Trang này sẽ tự thử xác minh checkout session và đồng bộ quyền truy cập.
                Nếu trạng thái chưa đổi ngay, hãy bấm <b>Refresh access</b>.
              </div>
            </div>
          </div>

          <div style={actions}>
            <button
              type="button"
              style={buttonBase}
              onClick={() => void handleRefreshAccess()}
              disabled={isVerifying}
            >
              {isVerifying ? "Đang xác minh…" : "Refresh access"}
            </button>

            <Link to="/account" style={primaryButton}>
              Đi tới tài khoản
            </Link>

            <Link to="/billing" style={buttonBase}>
              Billing
            </Link>

            <Link to="/pricing" style={buttonBase}>
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}