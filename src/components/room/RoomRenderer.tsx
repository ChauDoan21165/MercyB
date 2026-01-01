// src/components/room/RoomRenderer.tsx
// MB-BLUE-99.6 — 2026-01-01 (+0700)
/**
 * ROOM 5-BOX SPEC (LOCKED)
 * BOX 2: Title row (tier left, title centered, fav+refresh right) — ONE ROW
 * BOX 3: Welcome line (bilingual in ONE ROW separated by " / ") + keyword buttons
 * BOX 4: EMPTY space until keyword chosen; then EN → TalkingFace → VI
 * BOX 5: Feedback bar pushed to bottom of room (no header line)
 *
 * ✅ FIX (MB-BLUE-99.3):
 * - Title HARDENING: ignore “bad” titles that look like room id (snake_case / _vipX / equals id)
 * - Standardize welcome to use the same cleaned title (no “Topic:” line, no “mood-management” header spam)
 *
 * ✅ FIX (MB-BLUE-99.4):
 * - HARD CLAMP the *ROOM ENTRY* TalkingFacePlayButton so it can NEVER paint past the card edge.
 * - This is the “sticking out” you showed (range focus ring / inner control paint).
 * - We do NOT touch BottomMusicBar here.
 *
 * ✅ FIX (MB-BLUE-99.6):
 * - Zoom ACTUALLY works: Box 4 uses transform scale driven by --mb-essay-zoom.
 *   Why: Tailwind font sizes are rem/px and ignore parent font-size scaling.
 *   Transform scaling affects everything (rem/px included), without touching BottomMusicBar.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BilingualEssay } from "@/components/room/BilingualEssay";
import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";

type AnyRoom = any;

function asArray(x: any) {
  return Array.isArray(x) ? x : [];
}
function firstNonEmptyArray(...candidates: any[]): any[] {
  for (const c of candidates) {
    const arr = asArray(c);
    if (arr.length > 0) return arr;
  }
  return [];
}

function pickTitleENRaw(room: AnyRoom) {
  return (
    room?.title?.en ||
    room?.title_en ||
    room?.name?.en ||
    room?.name_en ||
    ""
  );
}
function pickTitleVIRaw(room: AnyRoom) {
  return (
    room?.title?.vi ||
    room?.title_vi ||
    room?.name?.vi ||
    room?.name_vi ||
    ""
  );
}

/** Remove trailing tier markers: _vip1 ... _vip9, _free */
function stripTierSuffix(id: string) {
  let s = String(id || "").trim();
  if (!s) return "";
  s = s.replace(/_(vip[1-9]|free)\b/gi, "");
  s = s.replace(/_+/g, "_").replace(/^_+|_+$/g, "");
  return s;
}

/** bipolar_support_vip1 -> "Bipolar Support" */
function prettifyRoomIdEN(id: string): string {
  const core = stripTierSuffix(id).toLowerCase();
  if (!core) return "Untitled room";
  const words = core.split("_").filter(Boolean);
  const titled = words
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
  return titled || "Untitled room";
}

/**
 * Detect “bad” titles:
 * - equal to roomId (or equal after stripping tier suffix)
 * - snake_case-ish: has "_" and no spaces, mostly lowercase
 * - ends with _vipX/_free
 */
function isBadAutoTitle(raw: string, effectiveRoomId: string) {
  const r = String(raw || "").trim();
  if (!r) return true;

  const rid = String(effectiveRoomId || "").trim();

  const rLow = r.toLowerCase();
  const ridLow = rid.toLowerCase();

  if (rLow === ridLow) return true;

  const rCore = stripTierSuffix(rLow);
  const idCore = stripTierSuffix(ridLow);
  if (rCore && idCore && rCore === idCore) return true;

  const looksSnake =
    /^[a-z0-9_]+$/.test(rLow) && rLow.includes("_") && !r.includes(" ");
  const hasTierSuffix = /_(vip[1-9]|free)\b/i.test(r);

  if (looksSnake || hasTierSuffix) return true;
  return false;
}

function pickIntroEN(room: AnyRoom) {
  return (
    room?.intro?.en ||
    room?.description?.en ||
    room?.intro_en ||
    room?.description_en ||
    room?.summary?.en ||
    room?.summary_en ||
    ""
  );
}
function pickIntroVI(room: AnyRoom) {
  return (
    room?.intro?.vi ||
    room?.description?.vi ||
    room?.intro_vi ||
    room?.description_vi ||
    room?.summary?.vi ||
    room?.summary_vi ||
    ""
  );
}

function resolveEntries(room: AnyRoom): any[] {
  return firstNonEmptyArray(
    room?.entries,
    room?.content?.entries,
    room?.data?.entries,
    room?.payload?.entries,
    room?.items,
    room?.cards,
    room?.blocks,
    room?.steps
  );
}
function resolveSectionEntries(section: any): any[] {
  return firstNonEmptyArray(
    section?.entries,
    section?.content?.entries,
    section?.items,
    section?.cards,
    section?.blocks,
    section?.steps
  );
}
function resolveKeywords(room: AnyRoom) {
  const en = firstNonEmptyArray(
    room?.keywords_en,
    room?.keywords?.en,
    room?.meta?.keywords_en
  );
  const vi = firstNonEmptyArray(
    room?.keywords_vi,
    room?.keywords?.vi,
    room?.meta?.keywords_vi
  );
  return { en, vi };
}
function resolveEssay(room: AnyRoom) {
  const en =
    room?.essay?.en ||
    room?.essay_en ||
    room?.content?.essay?.en ||
    room?.content?.essay_en ||
    "";
  const vi =
    room?.essay?.vi ||
    room?.essay_vi ||
    room?.content?.essay?.vi ||
    room?.content?.essay_vi ||
    "";
  return { en, vi };
}
function pickTier(room: AnyRoom): string {
  return String(room?.tier || room?.meta?.tier || "free").toLowerCase();
}

function normalizeAudioSrc(src: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  let p = s.replace(/^\/+/, "");
  if (p.startsWith("audio/")) return `/${p}`;
  return `/audio/${p.split("/").pop() || p}`;
}
function pickAudio(entry: any): string {
  const candidates: any[] = [];
  candidates.push(entry?.audio, entry?.audio_en, entry?.audio_vi);
  candidates.push(entry?.audioRef, entry?.audio_ref);
  candidates.push(entry?.audioUrl, entry?.audio_url);
  candidates.push(entry?.mp3, entry?.mp3_en, entry?.mp3_vi);

  for (const c of candidates) {
    if (!c) continue;
    if (typeof c === "string") {
      const norm = normalizeAudioSrc(c);
      if (norm) return norm;
    } else if (typeof c === "object") {
      const s = String(c?.en || c?.vi || c?.src || c?.url || "").trim();
      const norm = normalizeAudioSrc(s);
      if (norm) return norm;
    }
  }
  return "";
}
function audioLabelFromSrc(src: string): string {
  const s = String(src || "").trim();
  return s ? s.split("/").pop() || s : "";
}

function stripImplicitAudioLines(text: string): string {
  if (!text) return "";
  const lines = String(text).split("\n");
  const out: string[] = [];
  const timeLine = /^\s*\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const t = raw.trim();
    if (t.toLowerCase().includes(".mp3")) {
      const next = (lines[i + 1] ?? "").trim();
      if (timeLine.test(next)) i++;
      continue;
    }
    if (timeLine.test(t)) continue;
    out.push(raw);
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function normalizeEntryTextEN(entry: any): string {
  const candidates = [
    entry?.copy?.en,
    entry?.text?.en,
    entry?.body?.en,
    entry?.content?.en,
    entry?.description?.en,
    entry?.summary?.en,
    entry?.copy_en,
    entry?.text_en,
    entry?.body_en,
    entry?.content_en,
    entry?.description_en,
    entry?.summary_en,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  if (typeof entry?.text === "string" && entry.text.trim())
    return stripImplicitAudioLines(entry.text);
  if (typeof entry?.content === "string" && entry.content.trim())
    return stripImplicitAudioLines(entry.content);
  return "";
}
function normalizeEntryTextVI(entry: any): string {
  const candidates = [
    entry?.copy?.vi,
    entry?.text?.vi,
    entry?.body?.vi,
    entry?.content?.vi,
    entry?.description?.vi,
    entry?.summary?.vi,
    entry?.copy_vi,
    entry?.text_vi,
    entry?.body_vi,
    entry?.content_vi,
    entry?.description_vi,
    entry?.summary_vi,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  return "";
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const KW_CLASSES = [
  "mb-kw-0",
  "mb-kw-1",
  "mb-kw-2",
  "mb-kw-3",
  "mb-kw-4",
  "mb-kw-5",
  "mb-kw-6",
  "mb-kw-7",
] as const;

function highlightByKeywordList(text: string, keywords: string[]) {
  const t = String(text || "");
  if (!t.trim()) return t;

  const map = new Map<string, string>();
  keywords
    .map((k) => String(k || "").trim())
    .filter(Boolean)
    .forEach((k, idx) => {
      const key = k.toLowerCase();
      if (!map.has(key)) map.set(key, KW_CLASSES[idx % KW_CLASSES.length]);
    });

  if (map.size === 0) return t;

  const ordered = Array.from(map.keys()).sort((a, b) => b.length - a.length);
  const pattern = ordered.map((k) => escapeRegExp(k)).join("|");
  if (!pattern) return t;

  const re = new RegExp(`\\b(${pattern})\\b`, "gi");
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(t))) {
    const start = m.index;
    const match = m[0] || "";
    const end = start + match.length;

    if (start > last) parts.push(t.slice(last, start));

    const cls = map.get(match.toLowerCase()) || KW_CLASSES[0];
    parts.push(
      <span key={`${start}-${end}`} className={`mb-kw ${cls}`}>
        {match}
      </span>
    );

    last = end;
  }

  if (last < t.length) parts.push(t.slice(last));
  return <span className="whitespace-pre-line leading-relaxed">{parts}</span>;
}

function pickEntryHeading(entry: any, index: number) {
  return (
    entry?.title?.en ||
    entry?.heading?.en ||
    entry?.title_en ||
    entry?.heading_en ||
    entry?.name?.en ||
    entry?.name_en ||
    "" ||
    `Entry ${index + 1}`
  );
}

/** Hide “ugly headings” like slugs/ids */
function isUglyHeading(h: string) {
  const s = String(h || "").trim();
  if (!s) return true;
  const looksSlug =
    /^[a-z0-9_-]+$/.test(s) && (s.includes("-") || s.includes("_"));
  const tooIdLike = /_(vip[1-9]|free)\b/i.test(s);
  return looksSlug || tooIdLike;
}

function entryMatchesKeyword(entry: any, kw: string): boolean {
  const k = String(kw || "").toLowerCase().trim();
  if (!k) return false;

  const title = String(
    entry?.title?.en ||
      entry?.title_en ||
      entry?.heading?.en ||
      entry?.heading_en ||
      entry?.id ||
      entry?.slug ||
      ""
  )
    .toLowerCase()
    .trim();

  const en = normalizeEntryTextEN(entry).toLowerCase();
  const vi = normalizeEntryTextVI(entry).toLowerCase();

  return title.includes(k) || en.includes(k) || vi.includes(k);
}

export default function RoomRenderer({
  room,
  roomId,
  roomSpec,
}: {
  room: AnyRoom;
  roomId: string | undefined;
  roomSpec?: { use_color_theme?: boolean };
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const useColorThemeSafe = roomSpec?.use_color_theme !== false;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const killControls = () => {
      root.querySelectorAll("audio").forEach((a) => {
        if (a.hasAttribute("controls")) a.removeAttribute("controls");
      });
    };

    killControls();
    const obs = new MutationObserver(() => killControls());
    obs.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["controls"],
    });

    return () => obs.disconnect();
  }, []);

  if (!room) {
    return (
      <div className="rounded-xl border p-6 text-muted-foreground">
        Room loaded state is empty.
      </div>
    );
  }

  const tier = useMemo(() => pickTier(room), [room]);
  const effectiveRoomId = String(room?.id || roomId || "");

  // ✅ TITLE HARDENING
  const rawEN = useMemo(() => String(pickTitleENRaw(room) || ""), [room]);
  const rawVI = useMemo(() => String(pickTitleVIRaw(room) || ""), [room]);

  const titleEN = useMemo(() => {
    const r = rawEN.trim();
    if (!r) return prettifyRoomIdEN(effectiveRoomId);
    if (isBadAutoTitle(r, effectiveRoomId))
      return prettifyRoomIdEN(effectiveRoomId);
    return r;
  }, [rawEN, effectiveRoomId]);

  const titleVI = useMemo(() => String(rawVI || "").trim(), [rawVI]);

  const introEN = useMemo(() => pickIntroEN(room), [room]);
  const introVI = useMemo(() => pickIntroVI(room), [room]);

  const kw = useMemo(() => resolveKeywords(room), [room]);
  const essay = useMemo(() => resolveEssay(room), [room]);

  const sections = asArray(room?.sections);
  const flatEntries = resolveEntries(room);

  const allEntries = useMemo(() => {
    if (sections.length > 0) {
      const out: { entry: any }[] = [];
      sections.forEach((s: any) => {
        const sentries = resolveSectionEntries(s);
        sentries.forEach((e: any) => out.push({ entry: e }));
      });
      return out;
    }
    return flatEntries.map((e: any) => ({ entry: e }));
  }, [sections, flatEntries]);

  const enKeywords = (kw.en.length ? kw.en : kw.vi).map(String);
  const viKeywords = (kw.vi.length ? kw.vi : kw.en).map(String);

  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

  useEffect(() => {
    setActiveKeyword(null);
  }, [roomId]);

  const activeEntry = useMemo(() => {
    if (!activeKeyword) return null;
    const found = allEntries.find((x) =>
      entryMatchesKeyword(x.entry, activeKeyword)
    );
    return found?.entry || null;
  }, [activeKeyword, allEntries]);

  const activeEntryIndex = useMemo(() => {
    if (!activeEntry) return -1;
    return allEntries.findIndex((x) => x.entry === activeEntry);
  }, [activeEntry, allEntries]);

  const welcomeEN =
    introEN?.trim() || `Welcome to ${titleEN}, please click a keyword to start`;
  const welcomeVI =
    introVI?.trim() ||
    `Chào mừng bạn đến với phòng ${
      titleVI || titleEN
    }, vui lòng nhấp vào từ khóa để bắt đầu`;

  const ROOM_CSS = useMemo(
    () => `
      [data-mb-scope="room"].mb-room{
        position: relative;
        padding: 18px 14px 16px;
        border-radius: 24px;
        background:
          radial-gradient(1100px 650px at 10% 10%, rgba(255, 105, 180, 0.11), transparent 55%),
          radial-gradient(900px 520px at 90% 25%, rgba(0, 200, 255, 0.11), transparent 55%),
          radial-gradient(900px 520px at 30% 90%, rgba(140, 255, 120, 0.11), transparent 55%),
          linear-gradient(180deg, rgba(255,255,255,0.93), rgba(255,255,255,0.88));
        box-shadow: 0 18px 55px rgba(0,0,0,0.08);
        backdrop-filter: blur(8px);
        display:flex;
        flex-direction: column;
        min-height: 72vh;
      }
      [data-mb-scope="room"][data-mb-theme="bw"].mb-room{
        background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92));
      }

      [data-mb-scope="room"] .mb-card{
        border: 1px solid rgba(0,0,0,0.10);
        background: rgba(255,255,255,0.74);
        backdrop-filter: blur(10px);
        border-radius: 24px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      }

      [data-mb-scope="room"] .mb-titleRow{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap: 10px;
        flex-wrap: nowrap;
        min-width:0;
        margin-bottom: 10px;
      }
      [data-mb-scope="room"] .mb-titleLeft,
      [data-mb-scope="room"] .mb-titleRight{
        display:flex;
        align-items:center;
        gap: 8px;
        flex: 0 0 auto;
      }
      [data-mb-scope="room"] .mb-titleCenter{
        flex: 1 1 auto;
        min-width: 0;
        text-align:center;
      }
      [data-mb-scope="room"] .mb-tier{
        font-size: 12px;
        font-weight: 900;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.9);
        text-transform: uppercase;
      }
      [data-mb-scope="room"] .mb-iconBtn{
        width: 34px;
        height: 34px;
        border-radius: 12px;
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.9);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size: 14px;
      }
      [data-mb-scope="room"] .mb-roomTitle{
        font-size: 38px;
        line-height: 1.1;
        font-weight: 900;
        letter-spacing: -0.02em;
        text-transform: none;
      }
      @media (max-width: 560px){
        [data-mb-scope="room"] .mb-roomTitle{ font-size: 30px; }
      }

      [data-mb-scope="room"] .mb-welcomeLine{
        padding: 10px 12px;
        font-size: 15px;
        line-height: 1.45;
        text-align: center;
      }

      [data-mb-scope="room"] .mb-keyRow{
        display:flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content:center;
        margin-top: 14px;
        padding: 4px 10px 2px;
      }
      [data-mb-scope="room"] .mb-keyBtn{
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.78);
        border-radius: 999px;
        padding: 9px 14px;
        font-weight: 850;
        font-size: 14px;
        transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease;
      }
      [data-mb-scope="room"] .mb-keyBtn:hover{
        transform: translateY(-1px);
        box-shadow: 0 10px 24px rgba(0,0,0,0.06);
        background: rgba(255,255,255,0.90);
        border-color: rgba(0,0,0,0.22);
      }
      [data-mb-scope="room"] .mb-keyBtn[data-active="true"]{
        background: rgba(255,255,255,0.98);
        border-color: rgba(0,0,0,0.30);
        box-shadow: 0 14px 30px rgba(0,0,0,0.08);
      }

      [data-mb-scope="room"] .mb-kw{
        padding: 0 0.18rem;
        border-radius: 0.45rem;
        font-weight: 800;
      }
      [data-mb-scope="room"] .mb-kw-0{ background: rgba(255, 219, 88, 0.45); }
      [data-mb-scope="room"] .mb-kw-1{ background: rgba(120, 220, 255, 0.40); }
      [data-mb-scope="room"] .mb-kw-2{ background: rgba(180, 255, 140, 0.40); }
      [data-mb-scope="room"] .mb-kw-3{ background: rgba(255, 140, 200, 0.38); }
      [data-mb-scope="room"] .mb-kw-4{ background: rgba(170, 140, 255, 0.38); }
      [data-mb-scope="room"] .mb-kw-5{ background: rgba(255, 170, 120, 0.38); }
      [data-mb-scope="room"] .mb-kw-6{ background: rgba(120, 255, 210, 0.34); }
      [data-mb-scope="room"] .mb-kw-7{ background: rgba(255, 120, 120, 0.34); }

      [data-mb-scope="room"] .mb-feedback{
        border: 1px solid rgba(0,0,0,0.12);
        background: rgba(255,255,255,0.70);
        border-radius: 18px;
        padding: 8px 10px;
        display: flex;
        gap: 10px;
        align-items: center;
      }
      [data-mb-scope="room"] .mb-feedback input{
        flex: 1 1 auto;
        background: transparent;
        outline: none;
        font-size: 14px;
      }
      [data-mb-scope="room"] .mb-feedback button{
        flex: 0 0 auto;
        width: 38px;
        height: 38px;
        border-radius: 14px;
        border: 1px solid rgba(0,0,0,0.14);
        background: rgba(255,255,255,0.85);
        display:flex;
        align-items:center;
        justify-content:center;
      }

      /* ✅ MB-BLUE-99.4 — HARD CLAMP FOR ROOM ENTRY AUDIO BAR (NO STICK-OUT) */
      [data-mb-scope="room"] .mb-audioClamp{
        width: 100%;
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
        border-radius: 18px;
        clip-path: inset(0 round 18px);
      }
      [data-mb-scope="room"] .mb-audioClamp *{
        max-width: 100%;
        box-sizing: border-box;
        min-width: 0;
      }

      /* ✅ Zoom wrapper: scale content but preserve layout width (inverse width trick) */
      [data-mb-scope="room"] .mb-zoomWrap{
        --mbz: calc(var(--mb-essay-zoom, 100) / 100);
        transform: scale(var(--mbz));
        transform-origin: top left;
        width: calc(100% / var(--mbz));
      }
    `,
    []
  );

  return (
    <div
      ref={rootRef}
      className="mb-room w-full max-w-none"
      data-mb-scope="room"
      data-mb-theme={useColorThemeSafe ? "color" : "bw"}
    >
      <style>{ROOM_CSS}</style>

      {/* BOX 2 */}
      <div className="mb-titleRow">
        <div className="mb-titleLeft">
          <span className="mb-tier">{tier}</span>
        </div>

        <div className="mb-titleCenter">
          <div className="mb-roomTitle">
            {titleVI ? `${titleEN} / ${titleVI}` : titleEN}
          </div>
        </div>

        <div className="mb-titleRight">
          <button
            type="button"
            className="mb-iconBtn"
            title="Favorite (UI shell)"
            onClick={() => {}}
          >
            ♡
          </button>
          <button
            type="button"
            className="mb-iconBtn"
            title="Refresh"
            onClick={() => window.location.reload()}
          >
            ↻
          </button>
        </div>
      </div>

      {/* BOX 3 */}
      <section className="mb-card p-5 md:p-6 mb-5">
        <div className="mb-welcomeLine">
          <span>
            {highlightByKeywordList(welcomeEN, enKeywords)} <b>/</b>{" "}
            {highlightByKeywordList(welcomeVI, viKeywords)}
          </span>
        </div>

        {Math.max(kw.en.length, kw.vi.length) > 0 ? (
          <div className="mb-keyRow">
            {Array.from({ length: Math.max(kw.en.length, kw.vi.length) }).map(
              (_, i) => {
                const en = String(kw.en[i] ?? "").trim();
                const vi = String(kw.vi[i] ?? "").trim();
                if (!en && !vi) return null;

                const label = en && vi ? `${en} / ${vi}` : en || vi;
                const next = en || vi;
                const isActive = activeKeyword === next;

                return (
                  <button
                    key={`kw-${i}`}
                    type="button"
                    className={`mb-keyBtn mb-kw ${KW_CLASSES[i % KW_CLASSES.length]}`}
                    data-active={isActive ? "true" : "false"}
                    onClick={() =>
                      setActiveKeyword((cur) => (cur === next ? null : next))
                    }
                    title={label}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>
        ) : null}
      </section>

      {/* Optional essay block stays */}
      {(essay.en || essay.vi) && (
        <div className="mb-card p-4 md:p-6 mb-5">
          <BilingualEssay title="Essay" en={essay.en || ""} vi={essay.vi || ""} />
        </div>
      )}

      {/* BOX 4 stage (zoomed content wrapper) */}
      <section className="mb-card p-5 md:p-6 mb-5" style={{ flex: "1 1 auto" }}>
        <div className="mb-zoomWrap">
          {!activeKeyword ? (
            <div className="min-h-[420px]" />
          ) : activeEntry ? (
            <ActiveEntry
              entry={activeEntry}
              index={activeEntryIndex >= 0 ? activeEntryIndex : 0}
              enKeywords={enKeywords}
              viKeywords={viKeywords}
            />
          ) : (
            <div className="min-h-[240px] flex items-center justify-center text-center">
              <div>
                <div className="text-sm opacity-70 font-semibold">
                  No entry matches keyword: <b>{activeKeyword}</b>
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-full text-sm font-bold border bg-white"
                    onClick={() => setActiveKeyword(null)}
                  >
                    Clear keyword
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BOX 5 feedback pushed to bottom */}
      <div style={{ marginTop: "auto" }}>
        <div className="mb-card p-3 md:p-4">
          <div className="mb-feedback">
            <input placeholder="Feedback / Phản Hồi…" aria-label="Feedback" />
            <button type="button" title="Send feedback" onClick={() => {}}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveEntry({
  entry,
  index,
  enKeywords,
  viKeywords,
}: {
  entry: any;
  index: number;
  enKeywords: string[];
  viKeywords: string[];
}) {
  const rawHeading = pickEntryHeading(entry, index);
  const heading = isUglyHeading(rawHeading) ? "" : rawHeading;

  const en = normalizeEntryTextEN(entry);
  const vi = normalizeEntryTextVI(entry);

  const audioSrc = pickAudio(entry);
  const audioLabel = audioLabelFromSrc(audioSrc);

  return (
    <div>
      {heading ? (
        <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 leading-tight">
          {heading}
        </h3>
      ) : null}

      {en ? (
        <div className="mt-4 text-[15px] md:text-base">
          {highlightByKeywordList(en, enKeywords)}
        </div>
      ) : null}

      {audioSrc ? (
        <div className="mt-4 mb-audioClamp">
          <TalkingFacePlayButton
            src={audioSrc}
            label={audioLabel}
            className="w-full"
            fullWidthBar
          />
        </div>
      ) : null}

      {vi ? (
        <div className="mt-4 text-[15px] md:text-base">
          {highlightByKeywordList(vi, viKeywords)}
        </div>
      ) : null}
    </div>
  );
}

/** New thing to learn:
 * If your UI uses rem/px typography (Tailwind), scaling font-size won’t work.
 * Use a zoom wrapper with transform: scale + inverse width to scale everything safely. */
