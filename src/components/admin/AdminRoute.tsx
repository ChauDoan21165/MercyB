// src/components/admin/AdminRoute.tsx
// MB-BLUE-100.10 — 2025-12-31 (+0700)
//
// ADMIN GUARD (LOCKED INTENT):
// - User MUST be signed in to access /admin/*
// - Admin is decided by allowlist email (fast + reliable)
// - Optional: fallback to profiles.is_admin if you add it later
//
// NOTE:
// - Set VITE_ADMIN_EMAILS="cd12536@gmail.com,another@email.com" in .env (and Vercel env)

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

function parseAllowlist(raw: string | undefined | null): string[] {
  return (raw || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const loc = useLocation();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const allowlist = useMemo(() => {
    // supports both Vite and older naming
    const envList =
      (import.meta as any)?.env?.VITE_ADMIN_EMAILS ??
      (import.meta as any)?.env?.VITE_ADMIN_EMAIL ??
      "";
    return parseAllowlist(envList);
  }, []);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getUser();
        const user = data?.user;

        if (error || !user) {
          // not signed in → go signin, preserve target
          if (!alive) return;
          setUserEmail(null);
          setIsAdmin(false);
          nav(`/signin`, { replace: true, state: { from: loc.pathname } });
          return;
        }

        const email = (user.email || "").trim().toLowerCase();
        if (!alive) return;
        setUserEmail(email);

        // ✅ Primary rule: allowlist by email
        if (email && allowlist.includes(email)) {
          setIsAdmin(true);
          return;
        }

        // Optional fallback (only works if you add public.profiles.is_admin later)
        try {
          const { data: prof } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .maybeSingle();

          if (!alive) return;
          setIsAdmin(Boolean((prof as any)?.is_admin));
        } catch {
          if (!alive) return;
          setIsAdmin(false);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [allowlist, loc.pathname, nav]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Loading…</h2>
        <div style={{ opacity: 0.7 }}>Checking admin session.</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Not authorized</h1>
        <p>Your account is signed in, but it does not have admin permissions.</p>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button onClick={() => nav("/")} style={{ padding: "6px 10px" }}>
            Go Home
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              nav("/", { replace: true });
            }}
            style={{ padding: "6px 10px" }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginTop: 14, fontFamily: "monospace", fontSize: 12 }}>
          <div>AdminRoute</div>
          <div>user: {userEmail || "(none)"}</div>
          <div>path: {loc.pathname}</div>
          <div>isAdmin: {String(isAdmin)}</div>
          <div>allowlist: {allowlist.length ? allowlist.join(", ") : "(empty)"}</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
