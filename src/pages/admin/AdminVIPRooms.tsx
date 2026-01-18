// FILE: src/pages/admin/AdminVIPRooms.tsx
// MB-BLUE-101.14b — 2026-01-14 (+0700)
//
// ADMIN VIP ROOMS (CLEAN CANONICAL):
// - Replaces deleted legacy src/router/AdminVIPRooms.tsx
// - UI-only page for now (read-only).
// - 🔒 TEMP RULE: ONLY cd12536@gmail is admin (hard gate).
// - Keeps app context (?app=...) consistent with other admin pages.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { supabase } from "@/lib/supabaseClient";

const TEMP_ADMIN_EMAIL = "cd12536@gmail.com";

function getAppFromUrl(search: string) {
  try {
    return (new URLSearchParams(search).get("app") || "").trim();
  } catch {
    return "";
  }
}

function withApp(href: string, appId: string) {
  const cleaned = (appId || "").trim();
  if (!cleaned) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}app=${encodeURIComponent(cleaned)}`;
}

function normEmail(x: any) {
  return String(x || "").trim().toLowerCase();
}

export default function AdminVIPRooms() {
  const access = useUserAccess();
  const accessLoading = access.loading || access.isLoading;

  const location = useLocation();
  const appId = useMemo(() => getAppFromUrl(location.search) || "mercy_blade", [location.search]);

  // ✅ Robust email source: prefer access.email, fallback to Supabase auth user
  const [authEmail, setAuthEmail] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const fromAccess = normEmail((access as any)?.email);
    if (fromAccess) {
      setAuthEmail(fromAccess);
      return () => {
        mounted = false;
      };
    }

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        const e = normEmail(data?.user?.email);
        if (e) setAuthEmail(e);
      })
      .catch(() => {
        if (!mounted) return;
        // keep empty
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const e = normEmail(session?.user?.email);
      setAuthEmail(e);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔒 TEMP HARD GATE: only this email is admin, no exceptions.
  const isAdmin = useMemo(() => normEmail(authEmail) === normEmail(TEMP_ADMIN_EMAIL), [authEmail]);

  if (accessLoading) {
    return (
      <div style={{ padding: 18 }}>
        <div style={{ fontWeight: 900 }}>Loading…</div>
        <div style={{ opacity: 0.7, marginTop: 8 }}>Checking access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 18 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Admin only</div>
        <div style={{ opacity: 0.75, marginTop: 8, lineHeight: 1.6 }}>
          Allowed admin: <b>{TEMP_ADMIN_EMAIL}</b>
          <br />
          You are signed in as: <b>{authEmail || String((access as any)?.userId || "unknown")}</b>
          <br />
          (This is a temporary hard gate — we’ll switch back to profile-based admin flags later.)
        </div>

        <div style={{ marginTop: 14 }}>
          <Link
            to={withApp("/admin", appId)}
            style={{
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              fontWeight: 900,
              textDecoration: "none",
              color: "inherit",
              background: "white",
            }}
          >
            ← Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>VIP Rooms</div>
          <div style={{ opacity: 0.7, marginTop: 6, lineHeight: 1.6 }}>
            UI-only placeholder (read-only). This is the canonical page.
            <br />
            App context: <code>{appId}</code>
            <br />
            Admin email: <code>{TEMP_ADMIN_EMAIL}</code>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Link
            to={withApp("/admin", appId)}
            style={{
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.14)",
              fontWeight: 900,
              textDecoration: "none",
              color: "inherit",
              background: "white",
            }}
          >
            ← Back to Admin
          </Link>

          <span
            style={{
              border: "1px solid rgba(0,0,0,0.14)",
              borderRadius: 999,
              padding: "8px 10px",
              fontSize: 12,
              fontWeight: 900,
              background: "rgba(0,0,0,0.03)",
              opacity: 0.85,
            }}
            title="Safe: read-only"
          >
            SAFE • READ-ONLY
          </span>
        </div>
      </div>

      <hr style={{ border: 0, height: 1, background: "rgba(0,0,0,0.10)", margin: "16px 0" }} />

      <div
        style={{
          border: "1px solid rgba(0,0,0,0.10)",
          borderRadius: 18,
          padding: 16,
          background: "white",
          boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
          maxWidth: 920,
        }}
      >
        <div style={{ fontWeight: 900 }}>Next wiring (later)</div>
        <ul style={{ marginTop: 10, lineHeight: 1.7 }}>
          <li>List rooms where tier is VIP1/VIP3/VIP9 (from DB rooms table / view).</li>
          <li>Show counts by tier, plus “missing metadata” warnings.</li>
          <li>Link to open a room (preserving app context).</li>
        </ul>
      </div>
    </div>
  );
}

/** New thing to learn:
 * During cleanup, a temporary “hard gate” (email allowlist) is a fast safety net —
 * then you migrate back to role flags once profiles are stable. */
