import React, { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export default function AccountPage() {
  const nav = useNavigate();
  const auth = useAuth() as any;

  const user = auth?.user ?? auth?.session?.user ?? null;

  const email = useMemo(() => {
    const e = user?.email;
    if (typeof e === "string" && e.trim()) return e.trim();
    return user ? "Signed in" : "—";
  }, [user]);

  const onSignOut = useCallback(async () => {
    try {
      const fn = auth?.signOut ?? auth?.logout;
      if (typeof fn === "function") {
        await fn();
      }
    } catch {
      // ignore
    } finally {
      nav("/signin");
    }
  }, [auth, nav]);

  // Launch-safe: clear status without depending on extra hooks/data.
  const planLabel = user ? "Free" : "Signed out";
  const statusLabel = user ? "Active" : "Not signed in";

  const pill =
    "px-3 py-2 rounded-full border font-extrabold text-sm hover:bg-black/5 active:bg-black/10 transition";

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-6">
      {/* ✅ Do NOT use mb-card here (scoped in room styles). Use explicit utilities. */}
      <div className="rounded-2xl border bg-white/85 backdrop-blur p-5 md:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h1 className="text-xl font-black mb-1">Account</h1>
            <p className="opacity-80">Your identity and access.</p>
          </div>

          <div className="flex items-center gap-2">
            <Link className={pill} to="/upgrade">
              Upgrade
            </Link>
            <button
              type="button"
              className={pill}
              onClick={onSignOut}
              aria-label="Sign out"
              title="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-xl border bg-white/70 p-4">
            <div className="text-xs font-black opacity-70">EMAIL</div>
            <div className="mt-1 font-extrabold break-all">{email}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border bg-white/70 p-4">
              <div className="text-xs font-black opacity-70">PLAN</div>
              <div className="mt-1 font-extrabold">{planLabel}</div>
              <div className="mt-1 text-sm opacity-75">
                Keep it simple at launch. Upgrade anytime.
              </div>
            </div>

            <div className="rounded-xl border bg-white/70 p-4">
              <div className="text-xs font-black opacity-70">STATUS</div>
              <div className="mt-1 font-extrabold">{statusLabel}</div>
              <div className="mt-1 text-sm opacity-75">
                {user ? "You’re signed in and ready to learn." : "Please sign in to access your rooms."}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link className={pill} to="/tiers">
              Browse tiers
            </Link>
            <Link className={pill} to="/rooms">
              Browse rooms
            </Link>
            <Link className={pill} to="/">
              Home
            </Link>
          </div>

          <div className="pt-2 text-sm opacity-70">
            Mercy Blade is built for calm progress—small steps, every day.
          </div>
        </div>
      </div>
    </div>
  );
}

/* Teacher GPT – new thing to learn:
   If a class exists but its styling is scoped (e.g. .mb-room .mb-card),
   using it outside that scope will look “unstyled” even though Tailwind works. */