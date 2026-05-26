// src/lib/privateAudioResolver.ts
// MB-SAFE: installs optional resolver for "private:" audio keys.
// If not installed, TalkingFacePlayButton will just show Locked.

import { supabase } from "@/lib/supabaseClient"; // use your existing client import path

type Resolver = (srcKey: string) => Promise<string | null>;

export function installPrivateAudioResolver(resolver: Resolver) {
  if (typeof window === "undefined") return;
  (window as any).__mbResolveAudioSrc = resolver;
}

/**
 * Default resolver (Phase 1):
 * - Calls an Edge Function that returns a signed URL for the given storage path.
 * - Does NOT change any existing public audio behavior.
 */
export function installDefaultPrivateAudioResolver() {
  installPrivateAudioResolver(async (srcKey: string) => {
    try {
      if (!srcKey?.startsWith("private:")) return null;
      const storagePath = srcKey.slice("private:".length).replace(/^\/+/, "");
      if (!storagePath) return null;

      // Edge Function: /functions/v1/sign-audio?path=...
      const { data, error } = await supabase.functions.invoke("sign-audio", {
        body: { path: storagePath },
      });

      if (error) return null;
      const url = String((data as any)?.url || "").trim();
      return url || null;
    } catch {
      return null;
    }
  });
}
