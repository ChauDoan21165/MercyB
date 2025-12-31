// src/pages/SignIn.tsx
// MB-BLUE-98.3 — 2025-12-30 (+0700)
/**
 * SignIn (PLACEHOLDER)
 * Purpose: prevent Vite/prod crashes while auth UI is being finalized.
 * No Supabase logic here (yet).
 */

import React from "react";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl border bg-card/80 backdrop-blur p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a temporary page so routing stays stable while we wire the real auth UI.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/"
            className="rounded-2xl px-5 py-2.5 font-semibold bg-black text-white hover:bg-black/90"
          >
            Back to Home
          </Link>
          <Link
            to="/rooms"
            className="rounded-2xl px-5 py-2.5 font-semibold border bg-white hover:bg-gray-50"
          >
            Browse rooms
          </Link>
        </div>
      </div>
    </div>
  );
}
