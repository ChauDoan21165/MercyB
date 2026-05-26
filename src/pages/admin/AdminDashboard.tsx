// Path: src/pages/admin/AdminDashboard.tsx
// src/pages/admin/AdminDashboard.tsx
// MB-BLUE-101.6 → MB-BLUE-101.6a → MB-BLUE-101.7 → MB-BLUE-101.8 — 2026-01-14 (+0700)
//
// ✅ FIX (101.6a):
// - Stop blank /admin page.
// - Gate admin dashboard UI by useUserAccess().
// - If not admin: show clear message + sign-in link (never return null).
// - Keep existing multi-app context behavior unchanged.
//
// ✅ NaN hardening:
// - Sanitize access.adminLevel before comparisons / rendering.
// - Prevent "NaN" from leaking into UI.
//
// ✅ NEW (101.7):
// - Add an always-visible Security Health panel directly on /admin.
// - Show critical admin problems right away on open:
//   - browser offline
//   - insecure context
//   - missing Supabase env
//   - Supabase reachability
//   - missing / failing admin security edge feed
// - Auto-refresh the checks so the dashboard can surface problems quickly.
//
// ✅ NEW (101.8):
// - Add AI Usage & Costs panel directly onto /admin dashboard.
// - Keep change small and safe.
// - Do not add a new route here.
// - Surface existing admin destinations from the main dashboard.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import CostSummaryWidget from "@/components/admin/CostSummaryWidget";
import {
  getAppFromSearch,
  getAppFromStorage,
  setAdminAppId as persistApp,
  withApp,
} from "@/lib/adminAppContext";

type AdminTile = {
  title: string;
  desc: string;
  href?: string;
  badge?: string;
  disabled?: boolean;
};

type SecurityHealthState = "loading" | "ok" | "warn" | "critical";

type SecurityCheck = {
  key: string;
  label: string;
  state: Exclude<SecurityHealthState, "loading">;
  summary: string;
  detail?: string;
};

type EdgeSecurityFeedPayload = {
  status?: string;
  checkedAt?: string;
  checks?: Array<{
    key?: string;
    label?: string;
    state?: string;
    summary?: string;
    detail?: string;
  }>;
};

const SECURITY_REFRESH_MS = 20_000;

function safeAdminLevel(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeState(value: unknown): Exclude<SecurityHealthState, "loading"> {
  const normalized = cleanText(value).toLowerCase();

  if (normalized === "critical") return "critical";
  if (normalized === "warn" || normalized === "warning") return "warn";
  return "ok";
}

function statePriority(value: SecurityHealthState): number {
  switch (value) {
    case "critical":
      return 3;
    case "warn":
      return 2;
    case "loading":
      return 1;
    default:
      return 0;
  }
}

function formatCheckedAt(value: string): string {
  const cleaned = cleanText(value);
  if (!cleaned) return "Never";

  const parsed = Date.parse(cleaned);
  if (Number.isNaN(parsed)) return cleaned;

  return new Date(parsed).toLocaleString();
}

function getTone(state: SecurityHealthState) {
  switch (state) {
    case "critical":
      return {
        border: "1px solid rgba(190,24,93,0.20)",
        bg: "rgba(255,241,242,0.92)",
        text: "rgba(159,18,57,0.96)",
        badgeBg: "rgba(255,255,255,0.88)",
      };
    case "warn":
      return {
        border: "1px solid rgba(217,119,6,0.20)",
        bg: "rgba(255,251,235,0.94)",
        text: "rgba(180,83,9,0.96)",
        badgeBg: "rgba(255,255,255,0.88)",
      };
    case "loading":
      return {
        border: "1px solid rgba(0,0,0,0.10)",
        bg: "rgba(0,0,0,0.03)",
        text: "rgba(0,0,0,0.75)",
        badgeBg: "rgba(255,255,255,0.88)",
      };
    default:
      return {
        border: "1px solid rgba(5,150,105,0.18)",
        bg: "rgba(236,253,245,0.92)",
        text: "rgba(6,95,70,0.96)",
        badgeBg: "rgba(255,255,255,0.88)",
      };
  }
}

async function timedFetch(
  url: string,
  init?: RequestInit,
  timeoutMs = 6_000,
): Promise<{ response: Response; responseMs: number }> {
  const controller = new AbortController();
  const startedAt =
    typeof performance !== "undefined" ? performance.now() : Date.now();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    const endedAt =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    return {
      response,
      responseMs: endedAt - startedAt,
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const location = useLocation();

  const access = useUserAccess();
  const accessLoading = access.loading || access.isLoading;
  const adminLevel = safeAdminLevel(access.adminLevel);
  const isAdmin = !!(access.isAdmin || access.isHighAdmin || adminLevel >= 9);

  const urlApp = useMemo(() => getAppFromSearch(location.search), [location.search]);

  const [appId, setAppId] = useState<string>(() => {
    const saved = getAppFromStorage();
    return (urlApp || saved || "mercy_blade").trim() || "mercy_blade";
  });

  const [appIdDraft, setAppIdDraft] = useState<string>(appId);

  const [securityLoading, setSecurityLoading] = useState<boolean>(true);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [securityCheckedAt, setSecurityCheckedAt] = useState<string>("");
  const [serverFeedCheckedAt, setServerFeedCheckedAt] = useState<string>("");

  useEffect(() => {
    if (urlApp && urlApp !== appId) {
      setAppId(urlApp);
      setAppIdDraft(urlApp);
      persistApp(urlApp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlApp]);

  function applyApp(next: string) {
    const cleaned = (next || "").trim();
    if (!cleaned) return;
    setAppId(cleaned);
    setAppIdDraft(cleaned);
    persistApp(cleaned);
  }

  const supabaseUrl = cleanText(import.meta.env.VITE_SUPABASE_URL);
  const supabaseAnonKey = cleanText(import.meta.env.VITE_SUPABASE_ANON_KEY);

  const supabaseSettingsUrl = useMemo(() => {
    if (!supabaseUrl) return "";
    return `${supabaseUrl.replace(/\/$/, "")}/auth/v1/settings`;
  }, [supabaseUrl]);

  const securityEdgeFeedUrl = useMemo(() => {
    if (!supabaseUrl) return "";
    return `${supabaseUrl.replace(/\/$/, "")}/functions/v1/admin-security-health`;
  }, [supabaseUrl]);

  const runSecurityChecks = useCallback(async () => {
    if (typeof window === "undefined") return;

    setSecurityLoading(true);

    const nextChecks: SecurityCheck[] = [];

    const pushCheck = (check: SecurityCheck) => {
      nextChecks.push(check);
    };

    pushCheck({
      key: "browser-online",
      label: "Browser network",
      state: navigator.onLine ? "ok" : "critical",
      summary: navigator.onLine ? "Browser is online." : "Browser is offline.",
      detail: navigator.onLine
        ? "Live admin checks can refresh normally."
        : "Any failures below may be caused by local offline state.",
    });

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    pushCheck({
      key: "secure-context",
      label: "Secure context",
      state: window.isSecureContext || isLocalhost ? "ok" : "warn",
      summary:
        window.isSecureContext || isLocalhost
          ? "App is running in a secure context."
          : "App is not running in a secure context.",
      detail:
        window.isSecureContext || isLocalhost
          ? "Mic, auth, and browser APIs are less likely to fail for browser-policy reasons."
          : "Some browser APIs may fail or act strangely outside HTTPS.",
    });

    pushCheck({
      key: "env-supabase-url",
      label: "VITE_SUPABASE_URL",
      state: supabaseUrl ? "ok" : "critical",
      summary: supabaseUrl ? "Supabase URL is present." : "Supabase URL is missing.",
      detail: supabaseUrl || "Missing VITE_SUPABASE_URL breaks auth/data reachability checks.",
    });

    pushCheck({
      key: "env-supabase-anon",
      label: "VITE_SUPABASE_ANON_KEY",
      state: supabaseAnonKey ? "ok" : "critical",
      summary: supabaseAnonKey
        ? "Supabase anon key is present."
        : "Supabase anon key is missing.",
      detail: supabaseAnonKey
        ? `${supabaseAnonKey.slice(0, 12)}...`
        : "Missing VITE_SUPABASE_ANON_KEY breaks public client auth/reachability checks.",
    });

    const speechRecognitionSupported = Boolean(
      (window as Window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition ||
        (window as Window & { SpeechRecognition?: unknown }).SpeechRecognition,
    );

    pushCheck({
      key: "speech-recognition",
      label: "Speech recognition API",
      state: speechRecognitionSupported ? "ok" : "warn",
      summary: speechRecognitionSupported
        ? "Speech recognition is available in this browser."
        : "Speech recognition is not available in this browser.",
      detail: speechRecognitionSupported
        ? "Voice flows can be tested here."
        : "This is a browser/runtime problem, not necessarily an attack.",
    });

    if (!supabaseSettingsUrl || !supabaseAnonKey) {
      pushCheck({
        key: "supabase-reachability",
        label: "Supabase reachability",
        state: "critical",
        summary: "Supabase reachability could not be tested.",
        detail: "Client env is incomplete, so the dashboard cannot verify Supabase health.",
      });
    } else {
      try {
        const { response, responseMs } = await timedFetch(
          supabaseSettingsUrl,
          {
            method: "GET",
            headers: {
              apikey: supabaseAnonKey,
            },
          },
          6_000,
        );

        const state: Exclude<SecurityHealthState, "loading"> =
          response.status >= 500
            ? "critical"
            : response.status >= 400 || responseMs > 2_500
              ? "warn"
              : "ok";

        pushCheck({
          key: "supabase-reachability",
          label: "Supabase reachability",
          state,
          summary:
            response.status >= 500
              ? "Supabase is failing."
              : response.status >= 400
                ? `Supabase returned ${response.status}.`
                : "Supabase responded.",
          detail: `GET ${supabaseSettingsUrl} · ${response.status} · ${Math.round(responseMs)} ms`,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Network error while checking Supabase.";

        pushCheck({
          key: "supabase-reachability",
          label: "Supabase reachability",
          state: "critical",
          summary: "Supabase did not respond.",
          detail: message,
        });
      }
    }

    if (!securityEdgeFeedUrl || !supabaseAnonKey) {
      pushCheck({
        key: "admin-security-feed",
        label: "Admin security edge feed",
        state: "warn",
        summary: "Security edge feed is not configured yet.",
        detail:
          "Create supabase/functions/admin-security-health and this panel will show real server-side security signals.",
      });
      setServerFeedCheckedAt("");
    } else {
      try {
        const { response, responseMs } = await timedFetch(
          securityEdgeFeedUrl,
          {
            method: "GET",
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${supabaseAnonKey}`,
            },
          },
          7_000,
        );

        if (response.status === 404) {
          pushCheck({
            key: "admin-security-feed",
            label: "Admin security edge feed",
            state: "warn",
            summary: "Security edge feed is not installed yet.",
            detail: `GET ${securityEdgeFeedUrl} returned 404.`,
          });
          setServerFeedCheckedAt("");
        } else if (!response.ok) {
          pushCheck({
            key: "admin-security-feed",
            label: "Admin security edge feed",
            state: "critical",
            summary: "Security edge feed failed.",
            detail: `GET ${securityEdgeFeedUrl} returned ${response.status} · ${Math.round(responseMs)} ms`,
          });
          setServerFeedCheckedAt("");
        } else {
          const payload = (await response.json()) as EdgeSecurityFeedPayload;
          const feedState = normalizeState(payload?.status);
          const feedChecks = Array.isArray(payload?.checks) ? payload.checks : [];

          const worstFeedState = feedChecks.reduce<Exclude<SecurityHealthState, "loading">>(
            (worst, item) => {
              const next = normalizeState(item?.state);
              return statePriority(next) > statePriority(worst) ? next : worst;
            },
            feedState,
          );

          pushCheck({
            key: "admin-security-feed",
            label: "Admin security edge feed",
            state: worstFeedState,
            summary:
              feedChecks.length > 0
                ? `${feedChecks.length} server-side security checks loaded.`
                : "Security edge feed responded.",
            detail: `GET ${securityEdgeFeedUrl} · ${Math.round(responseMs)} ms`,
          });

          setServerFeedCheckedAt(cleanText(payload?.checkedAt));

          feedChecks.forEach((item, index) => {
            nextChecks.push({
              key: cleanText(item?.key) || `edge-check-${index}`,
              label: cleanText(item?.label) || `Server security check ${index + 1}`,
              state: normalizeState(item?.state),
              summary: cleanText(item?.summary) || "No summary provided.",
              detail: cleanText(item?.detail),
            });
          });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Network error while checking security edge feed.";

        pushCheck({
          key: "admin-security-feed",
          label: "Admin security edge feed",
          state: "critical",
          summary: "Security edge feed could not be reached.",
          detail: message,
        });
        setServerFeedCheckedAt("");
      }
    }

    setSecurityChecks(nextChecks);
    setSecurityCheckedAt(new Date().toISOString());
    setSecurityLoading(false);
  }, [securityEdgeFeedUrl, supabaseAnonKey, supabaseSettingsUrl, supabaseUrl]);

  useEffect(() => {
    void runSecurityChecks();
  }, [runSecurityChecks]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const id = window.setInterval(() => {
      void runSecurityChecks();
    }, SECURITY_REFRESH_MS);

    return () => window.clearInterval(id);
  }, [runSecurityChecks]);

  const overallSecurityState = useMemo<SecurityHealthState>(() => {
    if (securityLoading) return "loading";

    return securityChecks.reduce<SecurityHealthState>((worst, check) => {
      return statePriority(check.state) > statePriority(worst) ? check.state : worst;
    }, "ok");
  }, [securityChecks, securityLoading]);

  const securityCounts = useMemo(() => {
    return {
      critical: securityChecks.filter((item) => item.state === "critical").length,
      warn: securityChecks.filter((item) => item.state === "warn").length,
      ok: securityChecks.filter((item) => item.state === "ok").length,
    };
  }, [securityChecks]);

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: "white",
    color: "black",
  };

  const frame: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "28px 16px 80px",
  };

  const topBar: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 44,
    letterSpacing: -1.2,
    fontWeight: 900,
    lineHeight: 1.05,
  };

  const subtitle: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 15,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.70)",
    maxWidth: 720,
  };

  const pillRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  };

  const pill: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 999,
    padding: "10px 14px",
    background: "white",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
    textDecoration: "none",
    color: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const smallTag: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(0,0,0,0.72)",
    background: "rgba(0,0,0,0.03)",
  };

  const hr: React.CSSProperties = {
    height: 1,
    border: 0,
    background: "rgba(0,0,0,0.10)",
    margin: "16px 0",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 14,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 16,
    background: "white",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  };

  const cardTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: -0.2,
  };

  const cardDesc: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.68)",
  };

  const cardFooter: React.CSSProperties = {
    marginTop: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  };

  const linkBtn: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.14)",
    background: "white",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 900,
    cursor: "pointer",
  };

  const badge: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 900,
    background: "rgba(0,0,0,0.03)",
    color: "rgba(0,0,0,0.72)",
  };

  const mono: React.CSSProperties = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
    color: "rgba(0,0,0,0.75)",
  };

  const input: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 900,
    minWidth: 260,
    outline: "none",
  };

  const securityHeaderTone = getTone(overallSecurityState);

  const securityPanel: React.CSSProperties = {
    ...card,
    padding: 14,
    marginBottom: 14,
    border: securityHeaderTone.border,
    background: securityHeaderTone.bg,
  };

  const securityGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 12,
    marginTop: 14,
  };

  const securityItemCard = (
    state: Exclude<SecurityHealthState, "loading">,
  ): React.CSSProperties => {
    const tone = getTone(state);

    return {
      border: tone.border,
      borderRadius: 16,
      padding: 14,
      background: tone.bg,
      boxShadow: "0 8px 18px rgba(0,0,0,0.03)",
      gridColumn: "span 6",
    };
  };

  const tiles: AdminTile[] = [
    { title: "Users", desc: "Who signed up, who's paying, who's churning.", href: "/admin/users", badge: "SAFE" },
    { title: "Subscriptions", desc: "Live Stripe subscription state with cancel / portal actions.", href: "/admin/subscriptions", badge: "SAFE" },
    { title: "Feedback", desc: "Read user feedback from rooms (read-only).", href: "/admin/feedback", badge: "READY" },
    { title: "Payments", desc: "Latest payment transactions.", href: "/admin/payments", badge: "SAFE" },
    { title: "Access Codes", desc: "Generate and manage redeem / access codes.", href: "/admin/access-codes", badge: "SAFE" },
    { title: "Audio Coverage", desc: "Coverage checks for room audio (read-only tools).", href: "/admin/audio-coverage", badge: "READY" },
    { title: "Feature Flags", desc: "Toggle global flags or add users to per-flag cohorts.", href: "/admin/feature-flags", badge: "SAFE" },
    { title: "Analytics", desc: "DAU, feature usage, funnel, and room popularity (Level 9+).", href: "/admin/analytics", badge: "READY" },
    { title: "Costs / Chi phí", desc: "Daily spend across OpenAI, ElevenLabs, Resend, Azure (Level 9+).", href: "/admin/cost-monitoring", badge: "READY" },
  ];

  function go(href?: string) {
    if (!href) return;
    nav(withApp(href, appId));
  }

  return (
    <div style={wrap}>
      <div style={frame}>
        {accessLoading ? (
          <div style={{ ...card, padding: 18 }}>
            <div style={{ fontWeight: 950, fontSize: 18 }}>Admin</div>
            <div style={{ marginTop: 8, opacity: 0.75, fontWeight: 800 }}>
              Checking access…
            </div>
          </div>
        ) : !isAdmin ? (
          <div style={{ ...card, padding: 18 }}>
            <div style={smallTag}>ADMIN • ACCESS REQUIRED</div>
            <h1 style={{ ...title, marginTop: 10 }}>Not admin</h1>
            <p style={subtitle}>
              This account does not have admin permissions.
              <br />
              Sign in as <b>cd12536@gmail.com</b> (admin_level = 9) and refresh.
            </p>

            <div
              style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}
            >
              <Link to="/signin" style={pill}>Go to Sign In</Link>
              <Link to="/" style={pill}>Back to Home</Link>
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "rgba(0,0,0,0.60)",
                fontWeight: 900,
              }}
            >
              Your tier: <span style={mono}>{String(access.tier || "level0")}</span> •
              {" "}admin_level: <span style={mono}>{String(adminLevel)}</span>
            </div>
          </div>
        ) : (
          <>
            <div style={topBar}>
              <div>
                <div style={smallTag}>ADMIN • CONTROL BOARD</div>
                <h1 style={title}>Admin</h1>
                <p style={subtitle}>
                  One place to operate your ecosystem: payments, access, audio coverage,
                  and truth screens.
                  <br />
                  <span style={{ color: "rgba(0,0,0,0.55)" }}>
                    Operator UI only — keep actions safe & explicit.
                  </span>
                </p>
              </div>

              <div style={pillRow}>
                <Link to="/" style={pill}>Back to Home</Link>
                <button
                  type="button"
                  style={pill}
                  onClick={() => nav("/rooms")}
                  aria-label="Open Rooms"
                >
                  Open Rooms
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 14, maxWidth: 320 }}>
              <CostSummaryWidget />
            </div>

            <div style={{ ...card, padding: 14, marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>App Context</div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(0,0,0,0.70)",
                      lineHeight: 1.6,
                    }}
                  >
                    Every admin page must show and filter by <span style={mono}>app_id</span>.
                    This prevents cross-app mistakes.
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span style={badge}>APP: <span style={mono}>{appId}</span></span>
                    <span style={badge}>RISK MODE: SAFE</span>
                    <span style={badge}>NO DESTRUCTIVE ACTIONS</span>
                  </div>
                </div>

                <div style={{ minWidth: 320 }}>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>Switch App</div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <input
                      value={appIdDraft}
                      onChange={(e) => setAppIdDraft(e.target.value)}
                      placeholder="app_id (e.g. mercy_blade)"
                      style={input}
                      aria-label="App ID"
                    />
                    <button
                      type="button"
                      style={{ ...linkBtn, padding: "10px 12px" }}
                      onClick={() => applyApp(appIdDraft)}
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      style={pill}
                      onClick={() => applyApp("mercy_blade")}
                    >
                      mercy_blade
                    </button>
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "rgba(0,0,0,0.55)",
                      fontWeight: 900,
                    }}
                  >
                    Shareable links: <span style={mono}>/admin?app=your_app_id</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={securityPanel}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      ...smallTag,
                      border: securityHeaderTone.border,
                      background: securityHeaderTone.badgeBg,
                      color: securityHeaderTone.text,
                    }}
                  >
                    SECURITY • {overallSecurityState.toUpperCase()}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 22,
                      fontWeight: 950,
                      letterSpacing: -0.4,
                    }}
                  >
                    Security Health
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(0,0,0,0.72)",
                      maxWidth: 760,
                    }}
                  >
                    Open admin and see the dangerous stuff right away: missing env,
                    broken Supabase reachability, offline browser, insecure runtime,
                    and missing or failing server security feed.
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span style={badge}>CRITICAL: {securityCounts.critical}</span>
                    <span style={badge}>WARN: {securityCounts.warn}</span>
                    <span style={badge}>OK: {securityCounts.ok}</span>
                    <span style={badge}>
                      Checked: <span style={mono}>{formatCheckedAt(securityCheckedAt)}</span>
                    </span>
                    {serverFeedCheckedAt ? (
                      <span style={badge}>
                        Server feed: <span style={mono}>{formatCheckedAt(serverFeedCheckedAt)}</span>
                      </span>
                    ) : null}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    style={{ ...linkBtn, opacity: securityLoading ? 0.7 : 1 }}
                    onClick={() => void runSecurityChecks()}
                    disabled={securityLoading}
                  >
                    {securityLoading ? "Refreshing…" : "Refresh Security"}
                  </button>
                </div>
              </div>

              <div style={securityGrid}>
                {securityChecks.map((item) => {
                  const tone = getTone(item.state);

                  return (
                    <div key={item.key} style={securityItemCard(item.state)}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 900,
                              fontSize: 15,
                              color: tone.text,
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              marginTop: 8,
                              fontSize: 14,
                              lineHeight: 1.6,
                              color: "rgba(0,0,0,0.82)",
                            }}
                          >
                            {item.summary}
                          </div>
                        </div>

                        <span
                          style={{
                            ...smallTag,
                            marginLeft: 8,
                            background: tone.badgeBg,
                            border: tone.border,
                            color: tone.text,
                            flexShrink: 0,
                          }}
                        >
                          {item.state.toUpperCase()}
                        </span>
                      </div>

                      {item.detail ? (
                        <div
                          style={{
                            marginTop: 10,
                            fontSize: 12,
                            lineHeight: 1.6,
                            color: "rgba(0,0,0,0.58)",
                          }}
                        >
                          {item.detail}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                ...card,
                marginBottom: 14,
                gridColumn: "span 12",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={smallTag}>AI • USAGE & COSTS</div>
                  <h2 style={{ ...cardTitle, marginTop: 10 }}>AI Usage & Costs</h2>
                  <p style={cardDesc}>
                    Keep the API meter visible on the main admin dashboard.
                    This gives you a direct home-page entry for AI usage without needing
                    a separate admin route first.
                  </p>

                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span style={badge}>APP: <span style={mono}>{appId}</span></span>
                    <span style={badge}>ENTRY: DASHBOARD</span>
                    <span style={badge}>SAFE READ VIEW</span>
                  </div>
                </div>

              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "repeat(12, 1fr)",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(0,0,0,0.10)",
                    borderRadius: 16,
                    padding: 14,
                    background: "rgba(0,0,0,0.02)",
                    gridColumn: "span 12",
                  }}
                >
                  <div style={{ ...mono, fontWeight: 900 }}>Dashboard note</div>
                  <div style={{ marginTop: 8, fontSize: 16, fontWeight: 900 }}>
                    Home visibility restored
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: "rgba(0,0,0,0.58)" }}>
                    The admin home now includes an AI Usage & Costs block directly.
                  </div>
                </div>
              </div>
            </div>

            <hr style={hr} />

            <div style={grid}>
              {tiles.map((t) => {
                const span =
                  t.title === "System Monitoring" || t.title === "Metrics" ? 12 : 6;
                const isDisabled = !!t.disabled;
                const hrefWithApp = t.href ? withApp(t.href, appId) : undefined;

                return (
                  <div
                    key={t.title}
                    style={{
                      ...card,
                      gridColumn: `span ${span}`,
                      opacity: isDisabled ? 0.55 : 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <h2 style={cardTitle}>{t.title}</h2>
                      {t.badge && <span style={badge}>{t.badge}</span>}
                    </div>

                    <p style={cardDesc}>{t.desc}</p>

                    <div style={cardFooter}>
                      <button
                        type="button"
                        style={{
                          ...linkBtn,
                          opacity: isDisabled ? 0.6 : 1,
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                        onClick={() => (!isDisabled ? go(t.href) : null)}
                        disabled={isDisabled}
                      >
                        Open
                      </button>

                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(0,0,0,0.55)",
                          fontWeight: 800,
                        }}
                      >
                        {hrefWithApp ? (
                          <>
                            Route: <span style={mono}>{hrefWithApp}</span>
                          </>
                        ) : (
                          "Route: —"
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr style={hr} />

            <div
              style={{
                fontSize: 12,
                color: "rgba(0,0,0,0.55)",
                fontWeight: 800,
                lineHeight: 1.6,
              }}
            >
              Tip: A strong admin console is mostly: context clarity, safety labeling,
              and fast navigation.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* New thing to learn:
   The #1 multi-app admin bug is “wrong context.”
   If app_id is not obvious on every screen, mistakes are guaranteed. */