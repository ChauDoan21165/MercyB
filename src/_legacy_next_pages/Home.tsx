// src/_legacy_next_pages/Home.tsx — MB-BLUE-94.14.17 — 2025-12-25 (+0700)
/**
 * MercyBlade Blue — HOME (Baseline)
 * Path: src/_legacy_next_pages/Home.tsx
 * Version: MB-BLUE-94.14.17 — 2025-12-25 (+0700)
 *
 * GOAL (LOCKED):
 * - First landing route "/" always renders Homepage.
 * - Homepage must ALWAYS show a visible "Sign in" entry point (top-right).
 *
 * CHANGE:
 * - Single auth timeline via useAuth() ONLY (no local Supabase calls).
 * - When logged in, also show Rooms + Logout.
 */

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

export default function Home() {
  const { session, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Top-right entry (ALWAYS visible) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {/* ALWAYS show Sign in entry point */}
        <Button asChild variant="outline" size="sm">
          <Link to="/auth">Sign in</Link>
        </Button>

        {/* If logged in, also show Rooms + Logout */}
        {!isLoading && session ? (
          <>
            <Button asChild variant="outline" size="sm">
              <Link to="/rooms">Rooms</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/logout">Logout</Link>
            </Button>
          </>
        ) : null}
      </div>

      {/* Baseline content */}
      <div className="max-w-3xl px-8 py-16">
        <h1 className="text-6xl font-black tracking-tight">Mercy Blade — HOME OK</h1>
        <p className="mt-8 text-xl font-semibold">
          If you see this, React + routing are stable.
        </p>

        <p className="mt-8 text-gray-600">Home v2025-12-25-BASELINE</p>
      </div>
    </div>
  );
}
