import type { TierId } from "@/lib/constants/tiers";

/** Remove trailing tier markers ONLY at the end: _vip1 ... _vip9, _free */
export function stripTierSuffix(id: string) {
  let s = String(id || "").trim();
  if (!s) return "";
  s = s.replace(/_(vip[1-9]|free)$/gi, "");
  s = s.replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  return s;
}

/** bipolar_support_vip1 -> "Bipolar Support" */
export function prettifyRoomIdEN(id: string): string {
  const core = stripTierSuffix(id).toLowerCase();
  if (!core) return "Untitled room";
  const words = core.split("_").filter(Boolean);
  const titled = words.map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
  return titled || "Untitled room";
}

/** ✅ Infer tier from room id suffix _vip1.._vip9 / _free (suffix-only) */
export function inferTierIdFromRoomId(effectiveRoomId: string): TierId | null {
  const s = String(effectiveRoomId || "").toLowerCase().trim();
  const m = s.match(/_(vip[1-9])$/);
  if (m?.[1]) return m[1] as TierId;
  if (/_free$/.test(s)) return "free";
  return null;
}

/**
 * Detect “bad” titles:
 * - equal to roomId (or equal after stripping tier suffix)
 * - snake_case-ish: has "_" and no spaces, mostly lowercase
 * - ends with _vipX/_free
 */
export function isBadAutoTitle(raw: string, effectiveRoomId: string) {
  const r = String(raw || "").trim();
  if (!r) return true;

  const rid = String(effectiveRoomId || "").trim();

  const rLow = r.toLowerCase();
  const ridLow = rid.toLowerCase();

  if (rLow === ridLow) return true;

  const rCore = stripTierSuffix(rLow);
  const idCore = stripTierSuffix(ridLow);
  if (rCore && idCore && rCore === idCore) return true;

  const looksSnake = /^[a-z0-9_]+$/.test(rLow) && rLow.includes("_") && !r.includes(" ");
  const hasTierSuffix = /_(vip[1-9]|free)$/i.test(r);

  return looksSnake || hasTierSuffix;
}
