/**
 * MercyBlade — Debug JWT Helper
 * Path: src/debug/DebugJWT.tsx
 *
 * PURPOSE:
 * - Safely log the current Supabase access_token (JWT)
 * - Uses the SINGLE SOURCE OF TRUTH from AuthProvider
 *
 * IMPORTANT:
 * - DEBUG-ONLY TOOL
 * - UI MUST NEVER BE SHOWN TO NORMAL USERS
 */

import { useAuth } from "@/providers/AuthProvider";

function countDots(s: string) {
  let n = 0;
  for (let i = 0; i < s.length; i++) if (s[i] === ".") n++;
  return n;
}

export default function DebugJWT() {
  // 🔒 HARD KILL: never render UI
  // (keeps file, avoids breaking imports, zero user exposure)
  return null;

  // --- debug logic preserved below (dead code by design) ---

  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <button type="button" disabled style={{ opacity: 0.6 }}>
        Auth loading…
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        const token = session?.access_token || "";

        if (!token) {
          console.warn("[DebugJWT] No session or access_token");
          console.warn("[DebugJWT] session:", session);
          return;
        }

        const dots = countDots(token);

        console.log("[DebugJWT] access_token:", token);
        console.log("[DebugJWT] len:", token.length);
        console.log("[DebugJWT] dots:", dots);
        console.log(
          "[DebugJWT] looksLikeJWT:",
          dots === 2 && token.length > 50 ? "YES" : "NO"
        );

        if (dots !== 2) {
          console.warn(
            "[DebugJWT] Token is malformed (JWT must have exactly 2 dots)."
          );
        }
      }}
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        background: "#111",
        color: "#0f0",
        fontFamily: "monospace",
        border: "1px solid #333",
        cursor: "pointer",
      }}
      title="Logs access_token + length + dot count"
    >
      Log JWT to Console
    </button>
  );
}
