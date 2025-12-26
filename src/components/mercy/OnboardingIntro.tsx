// src/components/mercy/OnboardingIntro.tsx — MB-BLUE-94.11 — 2025-12-24 (+0700)
/**
 * MercyBlade Blue — OnboardingIntro
 * File: src/components/mercy/OnboardingIntro.tsx
 * Version: MB-BLUE-94.11 — 2025-12-24 (+0700)
 *
 * LOCK:
 * - MUST export: OnboardingIntro (named) because src/components/mercy/index.ts re-exports it.
 * - Also export default for safety (some legacy imports may use default).
 * - FAIL-OPEN: onboarding must not crash if Supabase/session calls fail.
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

type Step = {
  id: string;
  title: string;
  body: string;
};

const STORAGE_HAS_SEEN = "mb_has_seen_onboarding";
const STORAGE_REDIRECT = "mb_redirect_after_onboarding";

const safeRedirectTarget = (raw: string | null | undefined) => {
  const val = String(raw || "").trim();
  if (!val) return "/";
  if (!val.startsWith("/")) return "/";
  if (val.startsWith("//")) return "/";
  return val;
};

export function useOnboardingCheck() {
  const hasSeen = useMemo(() => {
    return localStorage.getItem(STORAGE_HAS_SEEN) === "true";
  }, []);
  return { hasSeen };
}

export function OnboardingIntro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authedEmail, setAuthedEmail] = useState<string | null>(null);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "welcome",
        title: "Welcome to Mercy Blade",
        body: "This is room-based learning. You can go to /rooms or open a direct /room/{roomId} link.",
      },
      {
        id: "audio",
        title: "Audio-first UI",
        body: "Guidance is delivered through audio. Tap the small face icon to play/pause.",
      },
      {
        id: "privacy",
        title: "Privacy & safety",
        body: "Onboarding is fail-open: if any admin/security tables aren’t ready, you still proceed normally.",
      },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        setAuthedEmail(data?.session?.user?.email ?? null);
      } catch {
        if (!mounted) return;
        setAuthedEmail(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_HAS_SEEN, "true");
    } catch {}

    const rawTarget = localStorage.getItem(STORAGE_REDIRECT);
    const target = safeRedirectTarget(rawTarget);

    try {
      localStorage.removeItem(STORAGE_REDIRECT);
    } catch {}

    navigate(target, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-muted-foreground">
        Preparing onboarding…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Onboarding</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick setup so you can start rooms immediately.
              </p>
              {authedEmail ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Signed in as: <span className="font-medium">{authedEmail}</span>
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Not signed in (that’s okay — onboarding still works).
                </p>
              )}
            </div>

            <Button onClick={finish}>Finish</Button>
          </div>
        </Card>

        <div className="grid gap-3">
          {steps.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="font-semibold">{s.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.body}</div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/", { replace: true })}>
            Back to Home
          </Button>
          <Button onClick={finish}>Finish</Button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingIntro;
