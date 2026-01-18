// FILE: src/components/room/roomRenderer/helpers.ts
// MB-BLUE-99.11v-split-helpers — 2026-01-19 (+0700)

import { prettifyRoomIdEN, isBadAutoTitle } from "@/components/room/roomIdUtils";
import { normalizeTextForKwMatch } from "@/components/room/RoomRendererUI";
import type { TierId } from "@/lib/constants/tiers";
import { normalizeTier } from "@/lib/constants/tiers";

export type AnyRoom = any;

// ---------- title / intro / tier pickers ----------
export function pickTitleENRaw(room: AnyRoom) {
  return room?.title?.en || room?.title_en || room?.name?.en || room?.name_en || "";
}
export function pickTitleVIRaw(room: AnyRoom) {
  return room?.title?.vi || room?.title_vi || room?.name?.vi || room?.name_vi || "";
}
export function pickIntroEN(room: AnyRoom) {
  return (
    room?.intro?.en ||
    room?.description?.en ||
    room?.intro_en ||
    room?.description_en ||
    room?.summary?.en ||
    room?.summary_en ||
    room?.description ||
    ""
  );
}
export function pickIntroVI(room: AnyRoom) {
  return (
    room?.intro?.vi ||
    room?.description?.vi ||
    room?.intro_vi ||
    room?.description_vi ||
    room?.summary?.vi ||
    room?.summary_vi ||
    room?.description_vi ||
    ""
  );
}
export function pickTier(room: AnyRoom): string {
  // IMPORTANT: do NOT default missing tier to "free" here.
  return String(room?.tier ?? room?.meta?.tier ?? "").toLowerCase();
}
export function normalizeRoomTierToTierId(roomTier: string): TierId | null {
  const t = String(roomTier || "").trim();
  if (!t) return null;
  return normalizeTier(t);
}

// ---------- labels ----------
export function shortEmailLabel(email: string) {
  const e = String(email || "").trim();
  if (!e) return "SIGNED IN";
  const [name, domain] = e.split("@");
  if (!domain) return e.toUpperCase();
  const head = name.length <= 3 ? name : `${name.slice(0, 3)}…`;
  return `${head}@${domain}`.toUpperCase();
}
export function shortUserId(id: string) {
  const s = String(id || "").trim();
  if (!s) return "USER";
  return (s.slice(0, 6) + "…" + s.slice(-4)).toUpperCase();
}

// ---------- host context ----------
export function dispatchHostContext(detail: Record<string, any>) {
  try {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("mb:host-context", { detail }));
  } catch {
    // ignore
  }
}

// trailing-only suffix remover: _vip1.._vip9 or _free (ONLY at end)
export function coreRoomIdFromEffective(effectiveRoomId: string) {
  const id = String(effectiveRoomId || "").trim();
  if (!id) return id;
  return id.replace(/_(vip[1-9]|free)$/i, "");
}

// ---------- DB “stub” detection ----------
function hasMeaningfulText(e: any) {
  const en = String(e?.content?.en ?? "").trim();
  const vi = String(e?.content?.vi ?? "").trim();
  const en2 = String(e?.copy?.en ?? "").trim();
  const vi2 = String(e?.copy?.vi ?? "").trim();
  return en.length + vi.length + en2.length + vi2.length > 0;
}
function hasMeaningfulAudio(e: any) {
  const a = String(e?.audio_en ?? e?.audio ?? "").trim();
  return !!a;
}
function isLegacyStubEntry(e: any) {
  const slug = String(e?.slug ?? "").trim();
  const id = String(e?.id ?? "").trim();
  return (
    slug.endsWith("__legacy") ||
    slug.includes("__legacy") ||
    id.endsWith("__legacy") ||
    id.includes("__legacy")
  );
}
export function isMeaningfulEntry(e: any) {
  if (!e || typeof e !== "object") return false;
  if (isLegacyStubEntry(e)) return false;
  return (
    hasMeaningfulText(e) ||
    hasMeaningfulAudio(e) ||
    Array.isArray(e?.keywords_en) ||
    Array.isArray(e?.keywords_vi) ||
    Array.isArray(e?.keywords) ||
    Array.isArray(e?.tags)
  );
}

// ---------- legacy coercion (JSON / mixed schemas) ----------
export function coerceLegacyEntryShape(entry: any) {
  if (!entry || typeof entry !== "object") return entry;

  const e: any = { ...entry };

  // 1) copy{} -> content{}
  if (!e.content && e.copy && typeof e.copy === "object") {
    e.content = e.copy;
  }

  // 2) audio(string) -> audio_en
  if (typeof e.audio === "string" && e.audio.trim()) {
    if (!e.audio_en) e.audio_en = e.audio.trim();
  }

  // 2b) normalize audio filenames to a usable public path
  if (typeof e.audio_en === "string" && e.audio_en.trim()) {
    const a = e.audio_en.trim();
    const isUrl = /^https?:\/\//i.test(a);
    if (!isUrl) {
      if (a.startsWith("/")) {
        // ok
      } else if (a.startsWith("audio/")) {
        e.audio_en = `/${a}`;
      } else if (!a.includes("/")) {
        e.audio_en = `/audio/${a}`;
      } else {
        // leave as-is
      }
    }
  }

  // 3) merge keywords/tags -> keywords[] (normalized) so entryMatchesKeyword() works
  const bag: string[] = [];
  const pushMany = (arr: any) => {
    if (!Array.isArray(arr)) return;
    for (const x of arr) {
      const s = String(x ?? "").trim();
      if (s) bag.push(s);
    }
  };

  pushMany(e.keywords);
  pushMany(e.keywords_en);
  pushMany(e.keywords_vi);
  pushMany(e.tags);

  const slug = String(e.slug ?? "").trim();
  if (slug) bag.push(slug);

  const title = String(e.title ?? "").trim();
  if (title) bag.push(title);

  const seen = new Set<string>();
  const merged = bag
    .map((s) => normalizeTextForKwMatch(s))
    .filter(Boolean)
    .filter((s) => {
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });

  if (merged.length) e.keywords = merged;

  return e;
}

export function entryKey(e: any) {
  const slug = String(e?.slug ?? "").trim();
  const id = String(e?.id ?? "").trim();
  const audio = String(e?.audio_en ?? e?.audio ?? "").trim();
  const tEn = String(e?.content?.en ?? e?.copy?.en ?? "").trim().slice(0, 40);
  if (slug) return `slug:${slug}`;
  if (id) return `id:${id}`;
  if (audio) return `audio:${audio}`;
  if (tEn) return `text:${tEn}`;
  return `obj:${Object.prototype.toString.call(e)}`;
}

// ---------- title finalization ----------
export function finalizeTitleEN(rawEN: string, effectiveRoomId: string) {
  const r = String(rawEN || "").trim();
  if (!r) return prettifyRoomIdEN(effectiveRoomId);
  if (isBadAutoTitle(r, effectiveRoomId)) return prettifyRoomIdEN(effectiveRoomId);
  return r;
}
