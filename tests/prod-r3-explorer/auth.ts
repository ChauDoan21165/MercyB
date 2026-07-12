import type { BrowserContext } from "@playwright/test";
import { GoTrueClient } from "@supabase/auth-js";

import {
  SYNTH_EMAIL,
  SYNTH_PASSWORD,
  SYNTH_SUPABASE_ANON_KEY,
  SYNTH_SUPABASE_URL,
} from "./env";

function projectRef(url: string): string {
  return new URL(url).host.split(".")[0];
}

export async function seedSyntheticSession(context: BrowserContext): Promise<void> {
  const key = `mb-supabase-auth-${projectRef(SYNTH_SUPABASE_URL)}`;
  const captured: Record<string, string> = {};
  const storage = {
    getItem: (k: string) => captured[k] ?? null,
    setItem: (k: string, v: string) => { captured[k] = v; },
    removeItem: (k: string) => { delete captured[k]; },
  };

  const auth = new GoTrueClient({
    url: `${SYNTH_SUPABASE_URL.replace(/\/$/, "")}/auth/v1`,
    headers: { apikey: SYNTH_SUPABASE_ANON_KEY },
    storage,
    storageKey: key,
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  });
  const { data, error } = await auth.signInWithPassword({
    email: SYNTH_EMAIL,
    password: SYNTH_PASSWORD,
  });
  if (error || !data.session) {
    const status = (error as { status?: number } | null)?.status ?? "?";
    throw new Error(`R3 synthetic direct auth failed: status=${status} ${error?.message ?? "no session"}`);
  }

  const blob = captured[key];
  if (!blob) throw new Error("R3 synthetic auth persisted no session blob");
  await context.addInitScript(
    ([sessionKey, sessionValue, pairKey, pairValue, nativeKey, nativeValue]) => {
      window.localStorage.setItem(sessionKey, sessionValue);
      window.localStorage.setItem(pairKey, pairValue);
      window.localStorage.setItem(nativeKey, nativeValue);
    },
    [
      key,
      blob,
      "mercyblade.languagePair",
      JSON.stringify({ native: "vi", targets: ["en"] }),
      "mercyblade.nativeLang",
      "vi",
    ] as const,
  );
}

