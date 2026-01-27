// FILE: TierDetail.tsx
// PATH: src/pages/TierDetail.tsx
// MB-BLUE-98.9n-tierdetail-registry — 2026-01-25 (+0700)
//
// PURPOSE (LOCKED):
// - Tier detail page under /tier-map/:tierId
// - MUST show the SAME room list + counts for ALL users (free + VIP).
// - DO NOT depend on DB/RLS for display. DB can be used only for debug metadata.
//
// FIX:
// - Build tier/area room list from registry (roomDataMap) → always consistent.
// - Clicking a room still goes to /room/:id; RoomRenderer gate will upsell if locked.
// - Removes the misleading “No rooms in this tier” for free users caused by RLS.
//
// NOTE:
// - We keep existing visual vibe (light-blue background, rainbow headline).
// - Logic-only; no JSX in helpers; no new files.
//
// PATCH (2026-01-25):
// - UI: render rooms as GRID BOXES (not long list rows).
// - Gate UX: still SHOW SAME rooms for all users, but DISABLE OPEN if tier is locked
//   (RoomRenderer remains the hard gate).
//
// FIX (2026-01-25 vip4/5/6 visibility):
// - TierDetail MUST NOT use tierFromRoomId() for catalog grouping, because gating may coerce vip4-8 → vip9.
// - Here, catalog tier should be inferred *loosely* from the room ID itself (vip4/vip5/vip6 remain vip4/vip5/vip6),
//   so /tier-map/vip5 shows its rooms.
// - RoomRenderer still enforces access / safety.
//
// PATCH (2026-01-25 FREE layout):
// - In FREE tier, show 3 columns: English (LEFT, subtle blue hint) | Core (CENTER) | Life (RIGHT, subtle amber hint).
// - Keep area tabs; the 3-column view is the default when tier=free and area=core.
//
// PATCH (2026-01-26 payment UX):
// - If tier is locked AND tier is purchasable (vip1/vip3/vip9), clicking the card or LOCKED pill triggers checkout.
// - This fixes “nothing moves when click room card” (no network call) for locked tiers.
//
// PATCH (2026-01-27 checkout hardening):
// - DO NOT use supabase.functions.invoke() here because it can hide the real error body behind
//   “Edge Function returned a non-2xx status code”.
// - Use fetch() with explicit apikey + Bearer token so we can show the real JSON error
//   (Invalid API key vs Invalid JWT).

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import type { TierId } from "@/lib/tierRoomSource";
import { loadRoomsForTiers } from "@/lib/tierRoomSource";

import { roomDataMap } from "@/lib/roomDataImports";

import { rainbow } from "@/pages/tierMap/tierMapData";

import { useUserAccess } from "@/hooks/useUserAccess";
import { normalizeTier } from "@/lib/constants/tiers";

import { supabase } from "@/lib/supabaseClient";

type AreaKey = "core" | "english" | "kids" | "life";

function getAreaFromQs(search: string): AreaKey {
  try {
    const qs = new URLSearchParams(search || "");
    const a = String(qs.get("area") || "core").trim().toLowerCase();
    if (a === "english") return "english";
    if (a === "kids") return "kids";
    if (a === "life") return "life";
    return "core";
  } catch {
    return "core";
  }
}

function normalizeToken(input: unknown): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "_");
}

// tierId from route can be: vip9, VIP9, vip_9, kids_1, free...
function parseTierLoose(raw: unknown): TierId | null {
  const s = normalizeToken(raw);
  if (!s) return null;
  if (s === "free") return "free" as TierId;

  const mVip = s.match(/^vip_?(\d+)$/);
  if (mVip) return (`vip${Number(mVip[1])}` as unknown) as TierId;

  const mKids = s.match(/^kids_?(\d+)$/);
  if (mKids) return (`kids_${Number(mKids[1])}` as unknown) as TierId;

  return null;
}

// ✅ Catalog-tier inference from ID (do NOT coerce vip4-8 to vip9 here).
function parseTierFromIdLoose(idRaw: unknown): TierId | null {
  const s = normalizeToken(idRaw);
  if (!s) return null;

  // kids patterns inside id
  const kidsDirect = s.match(/(?:^|_)kids_?(\d+)(?:_|$)/);
  if (kidsDirect) return (`kids_${Number(kidsDirect[1])}` as unknown) as TierId;

  // vip patterns inside id: ..._vip5_bonus
  const vip = s.match(/(?:^|_)vip_?(\d+)(?:_|$)/);
  if (vip) return (`vip${Number(vip[1])}` as unknown) as TierId;

  // explicit free tag
  if (s.match(/(?:^|_)free(?:_|$)/)) return "free" as TierId;

  return null;
}

// roomDataMap entries can have wrong tier field; ID must win when it implies VIP/Kids.
function parseTierFromRegistryRoom(v: any): TierId {
  const id = String(v?.id || "").trim();

  // ✅ IMPORTANT: use catalog ID parsing, not tierFromRoomId() (gating may coerce vip4-8).
  const fromId = parseTierFromIdLoose(id);

  const field = parseTierLoose(v?.tier);

  // If ID implies non-free, never allow a mistaken "free" to override.
  if (fromId && fromId !== ("free" as TierId) && field === ("free" as TierId)) return fromId;

  // If registry field is explicitly non-free, allow it.
  if (field && field !== ("free" as TierId)) return field;

  return fromId || (("free" as unknown) as TierId);
}

function normalizeAreaFromRegistryRoom(v: any): AreaKey | null {
  // IMPORTANT: only return an area if the registry explicitly provides it.
  // Otherwise return null so we can infer from id.
  const raw = String(v?.area || "").trim();
  if (!raw) return null;

  const a = raw.toLowerCase();
  if (a === "english") return "english";
  if (a === "kids") return "kids";
  if (a === "life") return "life";
  if (a === "core") return "core";
  return null;
}

// Heuristic fallback when registry lacks area:
// - kids tiers always in english path
// - survival/resilience rooms are life
function inferAreaFromIdFallback(id: string, tier: TierId): AreaKey {
  const s = String(id || "").toLowerCase();

  // kids content shows up under the "English path" side in Tier Map marketing.
  if (String(tier).startsWith("kids_")) return "english";

  // English signals
  if (
    s.startsWith("english_") ||
    s.startsWith("english-") ||
    s.includes("english_a1_") ||
    s.includes("english_a2_") ||
    s.includes("english_b1_") ||
    s.includes("english_b2_") ||
    s.includes("english_c1_") ||
    s.includes("english_c2_") ||
    s.includes("grammar_") ||
    s.includes("pronunciation") ||
    s.includes("vocabulary") ||
    s.includes("phonics") ||
    s.includes("spelling") ||
    s.includes("ielts") ||
    s.includes("toefl")
  ) {
    return "english";
  }

  // Life signals
  if (
    s.includes("survival") ||
    s.includes("resilience") ||
    s.includes("life-skill") ||
    s.includes("life_skill") ||
    s.includes("life_skills") ||
    s.includes("public_speaking") ||
    s.includes("debate") ||
    s.includes("discipline") ||
    s.includes("martial")
  ) {
    return "life";
  }

  // kids system ids (if present in id)
  if (
    s.startsWith("kids_") ||
    s.startsWith("kids-") ||
    s.includes("_kids_l1") ||
    s.includes("_kids_l2") ||
    s.includes("_kids_l3") ||
    s.includes("_kidslevel1") ||
    s.includes("_kidslevel2") ||
    s.includes("_kidslevel3")
  ) {
    return "english";
  }

  return "core";
}

type RegistryRoomLite = {
  id: string;
  tier: TierId;
  area: AreaKey;
  title_en: string;
  title_vi: string;
};

function buildRegistryRooms(): RegistryRoomLite[] {
  const out: RegistryRoomLite[] = [];
  const values = Object.values(roomDataMap as any);

  for (const v of values) {
    if (!v) continue;
    if ((v as any).hasData === false) continue;

    const id = String((v as any).id || "").trim();
    if (!id) continue;

    const tier = parseTierFromRegistryRoom(v);

    const areaFromRegistry = normalizeAreaFromRegistryRoom(v);
    const area = areaFromRegistry ?? inferAreaFromIdFallback(id, tier);

    const title_en = String((v as any).title_en || (v as any).title || id);
    const title_vi = String((v as any).title_vi || "");

    out.push({ id, tier, area, title_en, title_vi });
  }

  // stable sort
  out.sort((a, b) => a.id.localeCompare(b.id));
  return out;
}

function tierLabel(tier: TierId): string {
  const s = String(tier);
  if (s === "free") return "Free";
  if (s.startsWith("vip")) return s.toUpperCase();
  if (s.startsWith("kids_")) return `Kids ${s.split("_")[1] || ""}`.trim();
  return s;
}

function isPurchasableTier(tier: TierId): tier is "vip1" | "vip3" | "vip9" {
  return tier === "vip1" || tier === "vip3" || tier === "vip9";
}

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = String(token || "").split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const json = atob(b64 + pad);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function extractProjectRefFromIss(iss: unknown): string {
  try {
    const s = String(iss || "");
    const m = s.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/i);
    return m?.[1] || "";
  } catch {
    return "";
  }
}

function getEnvSupabaseRef(): string {
  try {
    const u = new URL(String(import.meta.env.VITE_SUPABASE_URL || ""));
    // https://<ref>.supabase.co
    return u.host.split(".")[0] || "";
  } catch {
    return "";
  }
}

export default function TierDetail() {
  const nav = useNavigate();
  const { tierId } = useParams<{ tierId: string }>();
  const loc = useLocation();

  const requestedTier = useMemo(() => {
    const t = parseTierLoose(tierId);
    return (t || ("free" as TierId)) as TierId;
  }, [tierId]);

  const area = useMemo(() => getAreaFromQs(loc.search), [loc.search]);

  // Registry rooms are the display truth for ALL users.
  const registryRooms = useMemo(() => buildRegistryRooms(), []);

  // Filtered list for this page (non-free standard view)
  const roomsInTierArea = useMemo(() => {
    return registryRooms.filter((r) => {
      if (r.tier !== requestedTier) return false;

      if (area === "core") return r.area === "core";
      if (area === "english") return r.area === "english";
      if (area === "kids")
        return r.area === "kids" || (String(r.tier).startsWith("kids_") && r.area === "english");
      if (area === "life") return r.area === "life";

      return true;
    });
  }, [registryRooms, requestedTier, area]);

  // FREE tier split columns (default when area=core)
  const freeColumns = useMemo(() => {
    if (requestedTier !== "free") return null;

    const freeAll = registryRooms.filter((r) => r.tier === "free");

    const english = freeAll.filter((r) => r.area === "english");
    const life = freeAll.filter((r) => r.area === "life");
    const core = freeAll.filter((r) => r.area === "core");

    return { english, core, life };
  }, [registryRooms, requestedTier]);

  const showFreeSplit = requestedTier === "free" && area === "core" && !!freeColumns;

  // Access (for disabling OPEN only; NEVER changes list/counts)
  const access = useUserAccess();

  const tierRankOf = (t?: string) => {
    const n = normalizeTier(String(t || "free"));
    if (n === "vip9") return 9;
    if (n === "vip3") return 3;
    if (n === "vip1") return 1;
    return 0;
  };

  const requiredRank = useMemo(() => {
    const t = String(requestedTier || "free").toLowerCase();
    if (t === "vip9") return 9;
    if (t === "vip3") return 3;
    if (t === "vip1") return 1;

    // VIP4/5/6/7/8 catalog pages exist, but product ladder does not.
    // Keep OPEN locked for non-admin (RoomRenderer is the hard gate anyway).
    if (t.startsWith("vip")) return 9;

    if (t.startsWith("kids_")) return 99;
    return 0;
  }, [requestedTier]);

  const canOpenRooms = useMemo(() => {
    if ((access as any)?.isHighAdmin || (access as any)?.isAdmin) return true;
    if (requiredRank >= 99) return false;
    return tierRankOf((access as any)?.tier) >= requiredRank;
  }, [access, requiredRank]);

  // ✅ Checkout for locked tiers (vip1/vip3/vip9 only).
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  const startCheckoutForTier = useCallback(
    async (tier: TierId) => {
      if (!isPurchasableTier(tier)) return;
      if (checkoutBusy) return;

      try {
        setCheckoutBusy(true);

        // ✅ SAFER THAN always refresh:
        // Only refresh if the current session is close to expiring.
        const now = Math.floor(Date.now() / 1000);

        const { data: s0, error: s0Err } = await supabase.auth.getSession();
        if (s0Err) throw s0Err;

        const expiresAt0 = Number(s0?.session?.expires_at || 0);
        if (expiresAt0 && expiresAt0 - now < 60) {
          try {
            await supabase.auth.refreshSession();
          } catch {
            // ignore; we’ll just re-read session
          }
        }

        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        const accessToken = String(sessionData?.session?.access_token || "");
        const userId = String(sessionData?.session?.user?.id || "");
        if (!accessToken) {
          alert("Please sign in before purchasing.");
          nav("/signin");
          return;
        }

        const supaUrl = String(import.meta.env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
        const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || "");
        if (!supaUrl || !anonKey) {
          alert(
            [
              "Checkout error: missing env.",
              "",
              "Need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (then restart `npm run dev`).",
            ].join("\n"),
          );
          return;
        }

        const endpoint = `${supaUrl}/functions/v1/create-checkout-session`;

        // ✅ helper: make a request with a chosen Authorization header value.
        const doRequest = async (authorizationValue: string) => {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              apikey: anonKey,
              Authorization: authorizationValue,
              // ✅ escape hatch: raw token in separate header (server can use this if it botches Authorization parsing)
              "x-mb-user-jwt": accessToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tier: String(tier), app_key: "mercy_blade" }),
          });

          const j = await res.json().catch(() => ({} as any));
          return { res, j };
        };

        // ✅ NEW STRATEGY:
        // Many server-side bugs come from passing "Bearer <token>" straight into getUser().
        // So try RAW first, then fallback to Bearer once (covers both server implementations).
        let { res, j } = await doRequest(accessToken);

        if (!res.ok && res.status === 401) {
          // fallback to standard scheme
          ({ res, j } = await doRequest(`Bearer ${accessToken}`));
        }

        if (!res.ok) {
          const msg = String(j?.error || j?.message || `Checkout failed (${res.status})`);

          // 401 Invalid API key => URL/anon mismatch OR Vite not restarted
          if (res.status === 401 && /api key/i.test(msg)) {
            alert(
              [
                "Checkout error (401): Invalid API key.",
                "",
                "Most common causes:",
                "1) VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are from DIFFERENT Supabase projects.",
                "2) You changed .env.local but DID NOT restart `npm run dev`.",
                "",
                "Fix: copy BOTH Project URL + anon key from the SAME Supabase project, then restart Vite.",
              ].join("\n"),
            );
            return;
          }

          // 401 Invalid JWT (after raw + Bearer attempts)
          if (res.status === 401 && /invalid jwt/i.test(msg)) {
            const payload = decodeJwtPayload(accessToken);
            const tokenRef = extractProjectRefFromIss(payload?.iss);
            const urlRef = getEnvSupabaseRef();
            const aud = String(payload?.aud || "");
            const sub = String(payload?.sub || "");
            const exp = Number(payload?.exp || 0);

            alert(
              [
                "Checkout error (401): Invalid JWT.",
                "Client token looks like a real user session token, but the server still rejects it.",
                "",
                `Detected: tokenRef=${tokenRef || "(unknown)"} | urlRef=${urlRef || "(unknown)"}`,
                `aud=${aud || "(unknown)"} | sub=${sub || "(unknown)"} | userId=${userId || "(unknown)"}`,
                exp ? `exp=${exp} (unix)` : "exp=(unknown)",
                "",
                "We already tried BOTH header formats:",
                "1) Authorization: <token> (raw) + x-mb-user-jwt",
                "2) Authorization: Bearer <token> + x-mb-user-jwt",
                "",
                "Conclusion: Edge Function must fix token extraction (strip 'Bearer ').",
              ].join("\n"),
            );
            return;
          }

          throw new Error(msg);
        }

        const url = j?.checkout_url || j?.url;
        if (!url || typeof url !== "string") {
          console.error("[TierDetail] Missing checkout_url from function:", j);
          alert("Checkout failed: missing checkout URL.");
          return;
        }

        window.location.assign(url);
      } catch (e: any) {
        console.error("[TierDetail] startCheckoutForTier error:", e);
        alert(`Checkout error: ${String(e?.message || e)}`);
      } finally {
        setCheckoutBusy(false);
      }
    },
    [checkoutBusy, nav],
  );

  const canStartCheckout = useMemo(() => {
    if (canOpenRooms) return false;
    if ((access as any)?.isHighAdmin || (access as any)?.isAdmin) return false;
    return isPurchasableTier(requestedTier);
  }, [access, canOpenRooms, requestedTier]);

  // Optional DB debug only (do NOT drive UI)
  const [dbMeta, setDbMeta] = useState<{ source: string; dbRooms: number } | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await loadRoomsForTiers();
        if (!alive) return;

        const n = Array.isArray((res as any)?.rooms) ? (res as any).rooms.length : 0;
        const src = String((res as any)?.source || "db");
        setDbMeta({ source: src, dbRooms: n });
      } catch {
        // ignore
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    background: "rgb(221, 244, 255)",
    padding: "24px 16px 90px",
  };

  const container: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
  };

  const hero: React.CSSProperties = {
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    padding: "18px 18px",
  };

  const h1: React.CSSProperties = {
    margin: 0,
    fontSize: 44,
    fontWeight: 950,
    letterSpacing: -1.1,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  const meta: React.CSSProperties = {
    marginTop: 6,
    color: "rgba(0,0,0,0.55)",
    fontSize: 13,
    lineHeight: 1.5,
    wordBreak: "break-word",
  };

  // ✅ GRID BOXES
  const grid: React.CSSProperties = {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 12,
    alignItems: "stretch",
  };

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
    minHeight: 108,
  };

  const cardTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 20,
    fontWeight: 950,
    letterSpacing: -0.2,
    color: "rgba(0,0,0,0.82)",
    lineHeight: 1.15,
  };

  const cardSubtitle: React.CSSProperties = {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
    wordBreak: "break-word",
  };

  const openBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 14px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.78)",
    fontSize: 13,
    fontWeight: 900,
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };

  const lockedBtn: React.CSSProperties = {
    ...openBtn,
    background: "rgba(0,0,0,0.06)",
    color: "rgba(0,0,0,0.55)",
    border: "1px solid rgba(0,0,0,0.16)",
    cursor: "not-allowed",
    opacity: 0.9,
  };

  const lockedCheckoutBtn: React.CSSProperties = {
    ...openBtn,
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.80)",
    border: "1px solid rgba(0,0,0,0.20)",
    cursor: checkoutBusy ? "wait" : "pointer",
    opacity: checkoutBusy ? 0.75 : 1,
  };

  const topRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  };

  const topLink: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 900,
    color: "rgba(0,0,0,0.70)",
    textDecoration: "underline",
  };

  // FREE split columns styling (subtle hints)
  const splitGrid: React.CSSProperties = {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "1fr 1.12fr 1fr",
    gap: 12,
    alignItems: "start",
  };

  const splitColBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    padding: 12,
    minWidth: 0,
  };

  const splitHeader: React.CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  };

  const splitTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 950,
    letterSpacing: -0.2,
    color: "rgba(0,0,0,0.78)",
  };

  const splitCountPill: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 950,
    padding: "4px 10px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.9)",
    color: "rgba(0,0,0,0.65)",
    whiteSpace: "nowrap",
  };

  const englishHint: React.CSSProperties = {
    borderLeft: "6px solid rgba(40, 120, 255, 0.28)",
    background: "rgba(40, 120, 255, 0.06)",
  };

  const lifeHint: React.CSSProperties = {
    borderRight: "6px solid rgba(255, 170, 0, 0.28)",
    background: "rgba(255, 170, 0, 0.06)",
  };

  const coreHint: React.CSSProperties = {
    background: "rgba(255,255,255,0.84)",
  };

  const roomCount = showFreeSplit
    ? (freeColumns?.core.length || 0) +
      (freeColumns?.english.length || 0) +
      (freeColumns?.life.length || 0)
    : roomsInTierArea.length;

  const renderRoomCard = (r: RegistryRoomLite) => {
    const cardClickable = !canOpenRooms && canStartCheckout;

    const cardStyle: React.CSSProperties = {
      ...card,
      cursor: cardClickable ? (checkoutBusy ? "wait" : "pointer") : "default",
      userSelect: cardClickable ? "none" : "auto",
    };

    return (
      <div
        key={r.id}
        style={cardStyle}
        role={cardClickable ? "button" : undefined}
        tabIndex={cardClickable ? 0 : -1}
        aria-label={cardClickable ? `Locked ${r.id}. Click to unlock.` : `Room ${r.id}`}
        onClick={() => {
          if (!cardClickable) return;
          void startCheckoutForTier(requestedTier);
        }}
        onKeyDown={(e) => {
          if (!cardClickable) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            void startCheckoutForTier(requestedTier);
          }
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={cardTitle}>
            {r.title_en}
            {r.title_vi ? ` — ${r.title_vi}` : ""}
          </div>
          <div style={cardSubtitle}>
            <span style={{ fontWeight: 900 }}>id:</span> {r.id}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {canOpenRooms ? (
            <Link
              to={`/room/${r.id}`}
              style={openBtn}
              aria-label={`Open ${r.id}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              OPEN
            </Link>
          ) : canStartCheckout ? (
            <button
              type="button"
              style={lockedCheckoutBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void startCheckoutForTier(requestedTier);
              }}
              aria-label={`Unlock ${requestedTier} to access rooms`}
              disabled={checkoutBusy}
            >
              {checkoutBusy ? "LOADING…" : "LOCKED"}
            </button>
          ) : (
            <button type="button" style={lockedBtn} disabled aria-label={`Locked ${r.id}`}>
              LOCKED
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={wrap}>
      <div style={container}>
        <div style={hero}>
          <div style={topRow}>
            <div style={h1}>
              {tierLabel(requestedTier)} / Cấp {tierLabel(requestedTier)}
            </div>

            <Link to="/tier-map" style={topLink}>
              Back to Tier Map
            </Link>
          </div>

          <div style={{ marginTop: 10, fontSize: 18, fontWeight: 900, color: "rgba(0,0,0,0.75)" }}>
            Rooms in this tier ({area.toUpperCase()}): {roomCount}
          </div>

          <div style={meta}>
            source=REGISTRY | registry rooms={registryRooms.length}
            {dbMeta ? ` | dbSource=${dbMeta.source} | dbRooms=${dbMeta.dbRooms}` : ""}
            {" | "}
            tip: Same list for all users; OPEN is disabled when tier is locked.
            {canStartCheckout ? " Click a card/LOCKED to checkout." : ""}
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              style={{ ...openBtn, cursor: "pointer" }}
              onClick={() => {
                if (window.history.length > 1) nav(-1);
                else nav("/tier-map");
              }}
            >
              ← Back
            </button>

            <Link to={`/tier-map/${requestedTier}?area=core`} style={openBtn}>
              Core
            </Link>
            <Link to={`/tier-map/${requestedTier}?area=english`} style={openBtn}>
              English
            </Link>
            <Link to={`/tier-map/${requestedTier}?area=life`} style={openBtn}>
              Life
            </Link>
          </div>
        </div>

        {showFreeSplit && freeColumns ? (
          <div style={splitGrid} aria-label="Free tier split columns">
            <div style={{ ...splitColBase, ...englishHint }}>
              <div style={splitHeader}>
                <h3 style={splitTitle}>English (Left)</h3>
                <span style={splitCountPill}>{freeColumns.english.length}</span>
              </div>
              <div style={grid}>{freeColumns.english.map(renderRoomCard)}</div>
            </div>

            <div style={{ ...splitColBase, ...coreHint }}>
              <div style={splitHeader}>
                <h3 style={splitTitle}>Core (Center)</h3>
                <span style={splitCountPill}>{freeColumns.core.length}</span>
              </div>
              <div style={grid}>{freeColumns.core.map(renderRoomCard)}</div>
            </div>

            <div style={{ ...splitColBase, ...lifeHint }}>
              <div style={splitHeader}>
                <h3 style={splitTitle}>Life skills (Right)</h3>
                <span style={splitCountPill}>{freeColumns.life.length}</span>
              </div>
              <div style={grid}>{freeColumns.life.map(renderRoomCard)}</div>
            </div>
          </div>
        ) : (
          <div style={grid} aria-label="Tier rooms grid">
            {roomsInTierArea.map(renderRoomCard)}
          </div>
        )}
      </div>
    </div>
  );
}

/* teacher GPT — new thing to learn:
   If the server mistakenly feeds "Bearer <token>" into getUser(), client-side RAW Authorization can bypass it.
   But the real fix is server-side: strip /^Bearer\s+/ before calling supabaseAdmin.auth.getUser(token). */
