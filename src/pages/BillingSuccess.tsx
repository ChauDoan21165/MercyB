// src/pages/BillingSuccess.tsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  trackCheckoutCompleted,
  trackEntitlementSuccess,
} from "@/lib/analytics";

type EntitlementResponse = {
  is_premium?: boolean;
  status?: string | null;
  source?: string | null;
  expires_at?: string | null;
};

const POLL_INTERVAL_MS  = 2500;
const MAX_POLL_ATTEMPTS = 20;

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const record = payload as Record<string, unknown>;
  const error   = typeof record.error   === "string" ? record.error   : "";
  const message = typeof record.message === "string" ? record.message : "";

  if (error && message) return `${error}: ${message}`;
  if (error)   return error;
  if (message) return message;

  if (record.detail && typeof record.detail === "object") {
    const d = record.detail as Record<string, unknown>;
    if (typeof d.message === "string") return d.message;
  }

  return fallback;
}

const viStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 400,
  color: "#94a3b8",
  marginTop: 3,
  lineHeight: 1.5,
};

export default function BillingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [entitlement, setEntitlement]   = useState<EntitlementResponse | null>(null);
  const [loading, setLoading]           = useState(true);
  const [message, setMessage]           = useState("Processing your subscription…");
  const [errorText, setErrorText]       = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  const trackedCheckoutComplete   = useRef(false);
  const trackedEntitlementSuccess = useRef(false);

  const sessionId  = searchParams.get("session_id") || "";
  const hasPremium = entitlement?.is_premium === true;

  useEffect(() => {
    if (trackedCheckoutComplete.current) return;
    trackCheckoutCompleted({ session_id: sessionId || undefined, source: "billing_success" });
    trackedCheckoutComplete.current = true;
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;

    async function ensureSignedIn() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      if (!session?.access_token) {
        navigate("/signin");
        throw new Error("Please sign in to continue.");
      }
    }

    async function fetchEntitlement(): Promise<EntitlementResponse> {
      const { data, error } = await supabase.functions.invoke("me-entitlement", { method: "GET" });
      if (error) {
        throw new Error(extractErrorMessage(error, "Unable to confirm subscription status."));
      }
      return (data ?? {}) as EntitlementResponse;
    }

    async function pollEntitlement() {
      try {
        await ensureSignedIn();

        for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt += 1) {
          if (cancelled) return;

          setAttemptCount(attempt);

          const next = await fetchEntitlement();
          if (cancelled) return;

          setEntitlement(next);

          if (next.is_premium === true) {
            setLoading(false);
            setErrorText("");
            setMessage("Your subscription is active.");

            if (!trackedEntitlementSuccess.current) {
              trackEntitlementSuccess({
                session_id: sessionId || undefined,
                status: next.status ?? undefined,
                source: next.source ?? undefined,
                expires_at: next.expires_at ?? undefined,
                attempts: attempt,
              });
              trackedEntitlementSuccess.current = true;
            }

            return;
          }

          setMessage("Processing your subscription…");

          if (attempt < MAX_POLL_ATTEMPTS) {
            await new Promise((resolve) => window.setTimeout(resolve, POLL_INTERVAL_MS));
          }
        }

        if (cancelled) return;

        setLoading(false);
        setMessage("Your payment was received, but access is still updating.");
        setErrorText(
          "Please refresh in a moment or open the app again to recheck your billing status.",
        );
      } catch (error) {
        if (cancelled) return;
        setLoading(false);
        setErrorText(
          error instanceof Error ? error.message : "Unable to confirm subscription status.",
        );
      }
    }

    void pollEntitlement();
    return () => { cancelled = true; };
  }, [navigate, sessionId]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px 56px" }}>
      <div style={{
        borderRadius: 20,
        border: "1px solid rgba(15,23,42,0.08)",
        background: "linear-gradient(180deg,#f8fafc 0%, #eefbf7 100%)",
        padding: 24,
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          display: "grid", placeItems: "center",
          background: hasPremium ? "rgba(16,185,129,0.14)" : "rgba(59,130,246,0.12)",
          color: hasPremium ? "#065f46" : "#1d4ed8",
          fontSize: 28, fontWeight: 900, marginBottom: 16,
        }}>
          {hasPremium ? "✓" : "…"}
        </div>

        <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, fontWeight: 950, color: "#111827" }}>
          {hasPremium ? "Your premium access is ready" : "Processing your subscription…"}
        </h1>
        <span style={viStyle}>
          {hasPremium ? "Quyền truy cập premium của bạn đã sẵn sàng" : "Đang xử lý gói đăng ký của bạn…"}
        </span>

        <p style={{ margin: "12px 0 0", color: "#475569", lineHeight: 1.7, fontSize: 16 }}>
          {hasPremium
            ? "Your subscription is confirmed and premium access is now active."
            : message}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
          {hasPremium
            ? "Gói đăng ký đã được xác nhận và quyền premium đang hoạt động."
            : "Vui lòng chờ trong giây lát…"}
        </p>

        {loading ? (
          <div style={{
            marginTop: 18, padding: "12px 14px", borderRadius: 14,
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(15,23,42,0.08)",
            color: "#334155", fontWeight: 700,
          }}>
            Checking access status
            {attemptCount > 0 ? ` • attempt ${attemptCount} of ${MAX_POLL_ATTEMPTS}` : ""}
            <span style={viStyle}>Đang kiểm tra trạng thái quyền truy cập…</span>
          </div>
        ) : null}

        {errorText ? (
          <div style={{
            marginTop: 18, padding: "12px 14px", borderRadius: 14,
            border: "1px solid rgba(245,158,11,0.22)",
            background: "rgba(255,251,235,0.96)",
            color: "#92400e", fontWeight: 700, lineHeight: 1.6,
          }}>
            {errorText}
            <span style={{ ...viStyle, color: "#b45309" }}>
              Vui lòng làm mới trang hoặc mở lại ứng dụng để kiểm tra lại.
            </span>
          </div>
        ) : null}

        {hasPremium ? (
          <div style={{
            marginTop: 18, padding: "12px 14px", borderRadius: 14,
            border: "1px solid rgba(16,185,129,0.20)",
            background: "rgba(236,253,245,0.95)",
            color: "#065f46", fontWeight: 700, lineHeight: 1.6,
          }}>
            Premium access is now active.
            <span style={{ ...viStyle, color: "#047857" }}>
              Quyền truy cập premium đang hoạt động.
            </span>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
          <button type="button" onClick={() => navigate("/rooms")}
            style={{ borderRadius: 14, minHeight: 46, padding: "12px 16px",
              border: "1px solid rgba(15,23,42,0.12)", background: "#0f172a",
              color: "#fff", fontWeight: 900, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center" }}>
            Go to rooms
            <span style={{ ...viStyle, color: "rgba(255,255,255,0.65)" }}>Vào phòng học</span>
          </button>

          {!hasPremium ? (
            <button type="button" onClick={() => window.location.reload()}
              style={{ borderRadius: 14, minHeight: 46, padding: "12px 16px",
                border: "1px solid rgba(15,23,42,0.12)", background: "#fff",
                color: "#111827", fontWeight: 900, cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center" }}>
              Refresh status
              <span style={{ ...viStyle, color: "#94a3b8" }}>Kiểm tra lại</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}