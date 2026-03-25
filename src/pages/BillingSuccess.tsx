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

const POLL_INTERVAL_MS = 2500;
const MAX_POLL_ATTEMPTS = 20;

function env(name: string): string {
  return String((import.meta as any).env?.[name] ?? "").trim();
}

function pickEnv(...names: string[]): string {
  for (const name of names) {
    const value = env(name);
    if (value) return value;
  }
  return "";
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const record = payload as Record<string, unknown>;
  const error = typeof record.error === "string" ? record.error : "";
  const message = typeof record.message === "string" ? record.message : "";
  const detail = record.detail;

  if (error && message) return `${error}: ${message}`;
  if (error) return error;
  if (message) return message;

  if (detail && typeof detail === "object") {
    const detailRecord = detail as Record<string, unknown>;
    if (typeof detailRecord.message === "string") return detailRecord.message;
  }

  return fallback;
}

export default function BillingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const SUPABASE_URL = pickEnv("VITE_SUPABASE_URL");
  const SUPABASE_ANON_KEY = pickEnv("VITE_SUPABASE_ANON_KEY");

  const [entitlement, setEntitlement] = useState<EntitlementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing your subscription…");
  const [errorText, setErrorText] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  const trackedCheckoutComplete = useRef(false);
  const trackedEntitlementSuccess = useRef(false);

  const sessionId = searchParams.get("session_id") || "";
  const hasPremium = entitlement?.is_premium === true;

  useEffect(() => {
    if (trackedCheckoutComplete.current) return;

    trackCheckoutCompleted({
      session_id: sessionId || undefined,
      source: "billing_success",
    });

    trackedCheckoutComplete.current = true;
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;

    async function getAccessToken(): Promise<string> {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw new Error(error.message);
      }

      if (!session?.access_token) {
        navigate("/signin");
        throw new Error("Please sign in to continue.");
      }

      return session.access_token;
    }

    async function fetchEntitlement(
      accessToken: string,
    ): Promise<EntitlementResponse> {
      if (!SUPABASE_URL) {
        throw new Error("Supabase URL is missing.");
      }

      const response = await fetch(
        `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/me-entitlement`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(SUPABASE_ANON_KEY ? { apikey: SUPABASE_ANON_KEY } : {}),
          },
        },
      );

      const raw = await response.text();
      let payload: Record<string, unknown> = {};

      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Entitlement returned a non-JSON response.");
      }

      if (!response.ok) {
        throw new Error(
          extractErrorMessage(payload, `Entitlement failed (${response.status})`),
        );
      }

      return payload as EntitlementResponse;
    }

    async function pollEntitlement() {
      try {
        const accessToken = await getAccessToken();

        for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt += 1) {
          if (cancelled) return;

          setAttemptCount(attempt);

          const nextEntitlement = await fetchEntitlement(accessToken);

          if (cancelled) return;

          setEntitlement(nextEntitlement);

          if (nextEntitlement.is_premium === true) {
            setLoading(false);
            setErrorText("");
            setMessage("Your subscription is active.");

            if (!trackedEntitlementSuccess.current) {
              trackEntitlementSuccess({
                session_id: sessionId || undefined,
                status: nextEntitlement.status ?? undefined,
                source: nextEntitlement.source ?? undefined,
                expires_at: nextEntitlement.expires_at ?? undefined,
                attempts: attempt,
              });
              trackedEntitlementSuccess.current = true;
            }

            return;
          }

          setMessage("Processing your subscription…");

          if (attempt < MAX_POLL_ATTEMPTS) {
            await new Promise((resolve) =>
              window.setTimeout(resolve, POLL_INTERVAL_MS),
            );
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
          error instanceof Error
            ? error.message
            : "Unable to confirm subscription status.",
        );
      }
    }

    void pollEntitlement();

    return () => {
      cancelled = true;
    };
  }, [SUPABASE_ANON_KEY, SUPABASE_URL, navigate, sessionId]);

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 16px 56px",
      }}
    >
      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(15,23,42,0.08)",
          background: "linear-gradient(180deg,#f8fafc 0%, #eefbf7 100%)",
          padding: 24,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: hasPremium
              ? "rgba(16,185,129,0.14)"
              : "rgba(59,130,246,0.12)",
            color: hasPremium ? "#065f46" : "#1d4ed8",
            fontSize: 28,
            fontWeight: 900,
            marginBottom: 16,
          }}
        >
          {hasPremium ? "✓" : "…"}
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 950,
            color: "#111827",
          }}
        >
          {hasPremium
            ? "Your premium access is ready"
            : "Processing your subscription…"}
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#475569",
            lineHeight: 1.7,
            fontSize: 16,
          }}
        >
          {hasPremium
            ? "Your subscription is confirmed and premium access is now active."
            : message}
        </p>

        {loading ? (
          <div
            style={{
              marginTop: 18,
              padding: "12px 14px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(15,23,42,0.08)",
              color: "#334155",
              fontWeight: 700,
            }}
          >
            Checking access status
            {attemptCount > 0 ? ` • attempt ${attemptCount} of ${MAX_POLL_ATTEMPTS}` : ""}
          </div>
        ) : null}

        {errorText ? (
          <div
            style={{
              marginTop: 18,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(245,158,11,0.22)",
              background: "rgba(255,251,235,0.96)",
              color: "#92400e",
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          >
            {errorText}
          </div>
        ) : null}

        {entitlement ? (
          <div
            style={{
              marginTop: 18,
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(15,23,42,0.08)",
              background: "rgba(255,255,255,0.88)",
              color: "#334155",
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            <div><strong>Status:</strong> {entitlement.status || "unknown"}</div>
            <div><strong>Source:</strong> {entitlement.source || "unknown"}</div>
            <div>
              <strong>Expires:</strong> {entitlement.expires_at || "unknown"}
            </div>
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 20,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            style={{
              borderRadius: 14,
              minHeight: 46,
              padding: "12px 16px",
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#0f172a",
              color: "#fff",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Go to rooms
          </button>

          {!hasPremium ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                borderRadius: 14,
                minHeight: 46,
                padding: "12px 16px",
                border: "1px solid rgba(15,23,42,0.12)",
                background: "#fff",
                color: "#111827",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Refresh status
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}