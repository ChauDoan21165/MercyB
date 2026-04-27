// src/pages/auth/ConvertAccount.tsx
//
// Route: /auth/save-progress (auth-required, anon-only)
// Lets the visitor convert their anonymous session to a permanent
// account WITHOUT losing speech_attempts, streaks, leaderboard
// position, mercy_user_facts.

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import {
  convertWithEmail,
  mergeAnonIntoPermanent,
  type ConvertEmailResult,
} from "@/lib/auth/conversion";
import { buildLossAversionMessage } from "@/lib/auth/conversionTriggers";

interface AnonSnapshot {
  practiceCount: number;
  streakCurrent: number;
  weeklyRank: number | null;
  isAnonymous: boolean;
}

type Mode = "menu" | "email" | "submitting";

export default function ConvertAccount(): React.ReactElement {
  const navigate = useNavigate();
  const [snap, setSnap] = useState<AnonSnapshot | null>(null);
  const [mode, setMode] = useState<Mode>("menu");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{ vi: string; en: string } | null>(null);
  const [success, setSuccess] = useState(false);

  // Pull progress snapshot for the loss-aversion line.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/", { replace: true });
        return;
      }
      const isAnonymous =
        (user as { is_anonymous?: boolean | null }).is_anonymous === true;
      if (!isAnonymous) {
        // Not anon — nothing to convert. Redirect home.
        navigate("/", { replace: true });
        return;
      }

      const [practiceRes, profileRes] = await Promise.all([
        supabase
          .from("speech_attempts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("profiles")
          .select("streak_current")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      if (cancelled) return;
      const practiceCount = practiceRes.count ?? 0;
      const profileRow = (profileRes.data ?? null) as { streak_current?: number | null } | null;
      setSnap({
        practiceCount,
        streakCurrent: profileRow?.streak_current ?? 0,
        weeklyRank: null, // Read from leaderboard later if available.
        isAnonymous: true,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const lossLine = useMemo(
    () =>
      snap
        ? buildLossAversionMessage({
            practiceCount: snap.practiceCount,
            streakCurrent: snap.streakCurrent,
            weeklyRank: snap.weeklyRank,
          })
        : null,
    [snap],
  );

  if (!snap) {
    return (
      <main className="px-4 py-12 max-w-md mx-auto text-sm text-black/55">
        Đang tải / Loading…
      </main>
    );
  }

  if (success) {
    return (
      <main className="px-4 py-12 max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">Tài khoản đã lưu!</h1>
        <p className="text-xs italic text-black/55 mb-4">Account saved!</p>
        <p className="text-sm text-black/75 mb-6">
          Tiến độ luyện tập, streak, và mọi điểm đã được giữ.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
        >
          Về trang chủ / Continue to home
        </button>
      </main>
    );
  }

  const handleEmailSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);
    setMode("submitting");
    const result: ConvertEmailResult = await convertWithEmail(email, password);
    if (result.kind === "ok") {
      setSuccess(true);
      return;
    }
    if (result.kind === "error") {
      setError({ vi: result.messageVi, en: result.messageEn });
      setMode("email");
      return;
    }
    setError({
      vi: "Mạng lỗi. Vui lòng thử lại.",
      en: "Network error. Please try again.",
    });
    setMode("email");
  };

  const handleOAuth = async (provider: "google" | "apple"): Promise<void> => {
    setError(null);
    // Step 1: kick off OAuth. The redirect-back path handles the merge
    // call (the new permanent user_id arrives in the post-OAuth session).
    // For now we redirect to a /-rooted callback and the AuthProvider
    // can detect a pending conversion by storing a sentinel in
    // sessionStorage.
    try {
      sessionStorage.setItem(
        "mb:anon-merge-pending",
        JSON.stringify({ source: provider, attemptedAt: Date.now() }),
      );
    } catch {
      // ignore
    }
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/save-progress` },
    });
    if (oauthError) {
      setError({
        vi: "Không khởi động được đăng nhập. Vui lòng thử lại.",
        en: "Could not start sign-in. Please try again.",
      });
    }
  };

  // After an OAuth round-trip, sessionStorage tells us to fire the merge.
  useEffect(() => {
    let cancelled = false;
    const raw = sessionStorage.getItem("mb:anon-merge-pending");
    if (!raw) return;
    void (async () => {
      try {
        const { source } = JSON.parse(raw) as { source: "google" | "apple" };
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        // After OAuth, supabase-js has already swapped to the new
        // permanent user. Take that user.id as the merge target.
        const result = await mergeAnonIntoPermanent(user.id, source);
        sessionStorage.removeItem("mb:anon-merge-pending");
        if (result.kind === "ok") setSuccess(true);
        else if (result.kind === "error")
          setError({ vi: result.messageVi, en: result.messageEn });
      } catch {
        sessionStorage.removeItem("mb:anon-merge-pending");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="px-4 py-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Lưu tiến độ học của bạn</h1>
      <p className="text-xs italic text-black/55 mb-4">Save your learning progress</p>

      {lossLine ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5 text-sm">
          <p className="font-semibold text-amber-900">{lossLine.vi}</p>
          <p className="text-xs italic text-amber-800/80 mt-1">{lossLine.en}</p>
        </section>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm mb-4"
        >
          <p className="text-rose-800 font-medium">{error.vi}</p>
          <p className="text-xs italic text-rose-700/80">{error.en}</p>
        </div>
      ) : null}

      {mode === "menu" ? (
        <div className="space-y-2">
          <button
            onClick={() => setMode("email")}
            className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
          >
            Email + mật khẩu / Email + password
          </button>
          <button
            onClick={() => void handleOAuth("google")}
            className="w-full px-4 py-3 rounded-lg border border-black/15 text-sm font-semibold bg-white"
          >
            Tiếp tục với Google / Continue with Google
          </button>
          <button
            onClick={() => void handleOAuth("apple")}
            className="w-full px-4 py-3 rounded-lg border border-black/15 text-sm font-semibold bg-white"
          >
            Tiếp tục với Apple / Continue with Apple
          </button>
        </div>
      ) : null}

      {mode === "email" || mode === "submitting" ? (
        <form onSubmit={handleEmailSubmit} className="space-y-3" data-testid="convert-email-form">
          <div>
            <label
              htmlFor="convert-email"
              className="block text-xs font-medium text-black/70 mb-1"
            >
              Email
            </label>
            <input
              id="convert-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/15 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="convert-password"
              className="block text-xs font-medium text-black/70 mb-1"
            >
              Mật khẩu / Password
            </label>
            <input
              id="convert-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/15 text-sm"
            />
            <p className="text-[11px] text-black/50 mt-1">
              Ít nhất 8 ký tự, có chữ và số. / At least 8 chars, with letters and digits.
            </p>
          </div>
          <button
            type="submit"
            disabled={mode === "submitting"}
            className="w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
          >
            {mode === "submitting"
              ? "Đang lưu… / Saving…"
              : "Lưu tài khoản / Save account"}
          </button>
          <button
            type="button"
            onClick={() => setMode("menu")}
            className="w-full px-4 py-2 rounded-lg text-xs text-black/55"
          >
            ← Quay lại lựa chọn khác / Back to other options
          </button>
        </form>
      ) : null}
    </main>
  );
}
