// src/components/room/RoomRenderer.tsx
// MB-BLUE-97.8 — 2025-12-29 (+0700)

import React, { useEffect, useMemo, useRef, useState } from "react";
import { BilingualEssay } from "@/components/room/BilingualEssay";

// ✅ TALKING FACE PLAY BUTTON (AUTHORITATIVE UI MOTIF)
import TalkingFacePlayButton from "@/components/audio/TalkingFacePlayButton";

type AnyRoom = any;

function pickTitle(room: AnyRoom) {
  return (
    room?.title?.en ||
    room?.title_en ||
    room?.name?.en ||
    room?.name_en ||
    room?.id ||
    "Untitled room"
  );
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

function resolveEntries(room: AnyRoom): any[] {
  return firstNonEmptyArray(
    room?.entries,
    room?.content?.entries,
    room?.data?.entries,
    room?.payload?.entries,
    room?.items,
    room?.cards,
    room?.blocks,
    room?.steps,
    room?.lessons,
    room?.prompts,
    room?.content?.items,
    room?.content?.blocks,
    room?.content?.cards,
    room?.flatEntries
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
    room?.essayText?.en ||
    room?.essayText_en ||
    "";
  const vi =
    room?.essay?.vi ||
    room?.essay_vi ||
    room?.content?.essay?.vi ||
    room?.content?.essay_vi ||
    room?.essayText?.vi ||
    room?.essayText_vi ||
    "";
  return { en, vi };
}

/**
 * Normalize audio paths so we always feed TalkingFacePlayButton a valid URL.
 */
function normalizeAudioSrc(src: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  let p = s.replace(/^\/+/, "");

  // If someone passed a weird path but ends with mp3, keep leaf.
  if (
    p.includes("/") &&
    !p.startsWith("audio/") &&
    p.toLowerCase().endsWith(".mp3")
  ) {
    const leaf = p.split("/").pop() || p;
    p = leaf;
  }

  if (p.startsWith("audio/")) return `/${p}`;
  return `/audio/${p}`;
}

/**
 * Pick audio from MANY legacy schemas so TalkingFace appears everywhere.
 */
function pickAudio(entry: any): string {
  const candidates: any[] = [];

  candidates.push(entry?.audio);
  candidates.push(entry?.audio_en, entry?.audio_vi);
  candidates.push(entry?.audioRef, entry?.audio_ref);
  candidates.push(entry?.audioUrl, entry?.audio_url);
  candidates.push(entry?.mp3, entry?.mp3_en, entry?.mp3_vi);

  for (const c of candidates) {
    if (!c) continue;

    if (typeof c === "string") {
      const norm = normalizeAudioSrc(c);
      if (norm) return norm;
      continue;
    }

    if (typeof c === "object") {
      const s = String(c?.en || c?.vi || c?.src || c?.url || "").trim();
      const norm = normalizeAudioSrc(s);
      if (norm) return norm;
    }
  }

  return "";
}

function audioLabelFromSrc(src: string): string {
  const s = String(src || "").trim();
  if (!s) return "";
  return s.split("/").pop() || s;
}

/**
 * Remove ANY mp3 lines + common native-player artifact lines.
 */
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

  let joined = out.join("\n");
  joined = joined.replace(/\n{3,}/g, "\n\n").trim();
  return joined;
}

function normalizeEntryTextEN(entry: any): string {
  const candidates = [
    entry?.copy?.en,
    entry?.text?.en,
    entry?.body?.en,
    entry?.content?.en,
    entry?.description?.en,
    entry?.summary?.en,
    entry?.markdown?.en,
    entry?.copy_en,
    entry?.text_en,
    entry?.body_en,
    entry?.content_en,
    entry?.description_en,
    entry?.summary_en,
    entry?.markdown_en,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  // fallback (legacy single-field)
  if (typeof entry?.text === "string" && entry.text.trim())
    return stripImplicitAudioLines(entry.text);
  if (typeof entry?.body === "string" && entry.body.trim())
    return stripImplicitAudioLines(entry.body);
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
    entry?.markdown?.vi,
    entry?.copy_vi,
    entry?.text_vi,
    entry?.body_vi,
    entry?.content_vi,
    entry?.description_vi,
    entry?.summary_vi,
    entry?.markdown_vi,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  return "";
}

/**
 * KEYWORD HIGHLIGHTING (ONLY important words)
 * - Color is deterministic by keyword index.
 * - Same index color used for EN & VI lists → correspondence.
 */
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

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightByKeywordList(text: string, keywords: string[]) {
  const t = String(text || "");
  if (!t.trim()) return t;

  // Build: keyword -> class (first occurrence of keyword wins)
  const map = new Map<string, string>();
  keywords
    .map((k) => String(k || "").trim())
    .filter(Boolean)
    .forEach((k, idx) => {
      const key = k.toLowerCase();
      if (!map.has(key)) map.set(key, KW_CLASSES[idx % KW_CLASSES.length]);
    });

  if (map.size === 0) return t;

  // Replace longer keywords first to reduce partial overlaps
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

  // Preserve newlines nicely
  return (
    <span className="whitespace-pre-line leading-relaxed">{parts}</span>
  );
}

function pickEntryHeading(entry: any, index: number) {
  return (
    entry?.title?.en ||
    entry?.heading?.en ||
    entry?.title_en ||
    entry?.heading_en ||
    entry?.name?.en ||
    entry?.name_en ||
    entry?.slug ||
    entry?.id ||
    `Entry ${index + 1}`
  );
}

export default function RoomRenderer({
  room,
  roomId,
}: {
  room: AnyRoom;
  roomId: string | undefined;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // ✅ Safety net: if ANY native <audio controls> leaks into the room DOM, strip it.
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

  const title = useMemo(() => (room ? pickTitle(room) : ""), [room]);
  const introEN = useMemo(() => (room ? pickIntroEN(room) : ""), [room]);
  const introVI = useMemo(() => (room ? pickIntroVI(room) : ""), [room]);

  if (!room) {
    return (
      <div className="rounded-xl border p-6 text-muted-foreground">
        Room loaded state is empty.
        <div className="mt-2 text-xs">
          roomId: <code>{roomId || "missing"}</code>
        </div>
      </div>
    );
  }

  const sections = asArray(room?.sections);
  const flatEntries = resolveEntries(room);
  const kw = resolveKeywords(room);
  const essay = resolveEssay(room);

  // We show a single “active entry” only (per spec).
  const allEntries = useMemo(() => {
    if (sections.length > 0) {
      // flatten but keep label (section title)
      const out: { sectionTitle: string; entry: any; indexInSection: number }[] =
        [];
      sections.forEach((s: any) => {
        const st =
          s?.title?.en ||
          s?.title_en ||
          s?.name?.en ||
          s?.name_en ||
          s?.id ||
          "Section";
        const sentries = resolveSectionEntries(s);
        sentries.forEach((e: any, i: number) =>
          out.push({ sectionTitle: st, entry: e, indexInSection: i })
        );
      });
      return out;
    }
    return flatEntries.map((e: any, i: number) => ({
      sectionTitle: "",
      entry: e,
      indexInSection: i,
    }));
  }, [sections, flatEntries]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    // reset active when room changes / entry list changes
    setActiveIndex(0);
  }, [roomId, allEntries.length]);

  const active = allEntries[activeIndex]?.entry;

  // “Corresponding” keyword highlighting:
  // - Use EN keywords for EN text, VI keywords for VI text.
  // - If one side missing, still highlight using the other side’s list (best effort).
  const enKeywords = (kw.en.length ? kw.en : kw.vi).map(String);
  const viKeywords = (kw.vi.length ? kw.vi : kw.en).map(String);

  return (
    <div
      ref={rootRef}
      className="mb-room w-full max-w-none"
      data-mb-scope="room"
    >
      <style>{`
        /* Background: gentle rainbow wash */
        [data-mb-scope="room"].mb-room{
          position: relative;
          padding: 22px 14px 30px;
          border-radius: 24px;
          background:
            radial-gradient(1100px 650px at 10% 10%, rgba(255, 105, 180, 0.11), transparent 55%),
            radial-gradient(900px 520px at 90% 25%, rgba(0, 200, 255, 0.11), transparent 55%),
            radial-gradient(900px 520px at 30% 90%, rgba(140, 255, 120, 0.11), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.93), rgba(255,255,255,0.88));
          box-shadow: 0 18px 55px rgba(0,0,0,0.08);
          backdrop-filter: blur(8px);
        }

        /* Glass cards */
        [data-mb-scope="room"] .mb-card{
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }

        [data-mb-scope="room"] .mb-meta{
          color: rgba(0,0,0,0.60);
        }

        /* Keyword highlight palette (dark & readable) */
        [data-mb-scope="room"] .mb-kw{
          padding: 0 0.18rem;
          border-radius: 0.45rem;
          font-weight: 700;
          box-shadow: 0 1px 0 rgba(0,0,0,0.05);
        }
        [data-mb-scope="room"] .mb-kw-0{ background: rgba(255, 219, 88, 0.45); }
        [data-mb-scope="room"] .mb-kw-1{ background: rgba(120, 220, 255, 0.40); }
        [data-mb-scope="room"] .mb-kw-2{ background: rgba(180, 255, 140, 0.40); }
        [data-mb-scope="room"] .mb-kw-3{ background: rgba(255, 140, 200, 0.38); }
        [data-mb-scope="room"] .mb-kw-4{ background: rgba(170, 140, 255, 0.38); }
        [data-mb-scope="room"] .mb-kw-5{ background: rgba(255, 170, 120, 0.38); }
        [data-mb-scope="room"] .mb-kw-6{ background: rgba(120, 255, 210, 0.34); }
        [data-mb-scope="room"] .mb-kw-7{ background: rgba(255, 120, 120, 0.34); }

        /* Entry selector buttons */
        [data-mb-scope="room"] .mb-entry-btn{
          text-align: left;
          width: 100%;
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.75);
          border-radius: 16px;
          padding: 10px 12px;
          transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
        }
        [data-mb-scope="room"] .mb-entry-btn:hover{
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.06);
          border-color: rgba(0,0,0,0.18);
        }
        [data-mb-scope="room"] .mb-entry-btn[aria-current="true"]{
          border-color: rgba(0,0,0,0.26);
          box-shadow: 0 14px 30px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* BOX 1 (inside RoomPage header in your final layout) — Room title */}
      <header className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
          {title}
        </h1>
        <div className="mt-2 text-xs mb-meta">
          roomId: <code>{roomId}</code> • data.id: <code>{room?.id || "missing"}</code>
        </div>
      </header>

      {/* BOX 2 — Intro + keyword list (BILINGUAL) */}
      {(introEN || introVI || kw.en.length > 0 || kw.vi.length > 0) && (
        <section className="mb-card p-4 md:p-6 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-semibold mb-2 mb-meta">
                Introduction • Giới thiệu
              </div>

              {(introEN || introVI) && (
                <div className="space-y-3">
                  {introEN ? (
                    <p className="text-[15px] md:text-base leading-relaxed">
                      {highlightByKeywordList(introEN, enKeywords)}
                    </p>
                  ) : null}
                  {introVI ? (
                    <p className="text-[15px] md:text-base leading-relaxed">
                      {highlightByKeywordList(introVI, viKeywords)}
                    </p>
                  ) : null}
                </div>
              )}
            </div>

            <div className="shrink-0 text-right">
              <div className="text-xs mb-meta">
                Entries: <b>{allEntries.length}</b>
              </div>
              <div className="text-xs mb-meta">
                Keywords: <b>{Math.max(kw.en.length, kw.vi.length)}</b>
              </div>
              <div className="text-[11px] mb-meta mt-1">
                Click an entry below • Chọn mục bên dưới
              </div>
            </div>
          </div>

          {(kw.en.length > 0 || kw.vi.length > 0) && (
            <div className="mt-4 grid gap-2">
              <div className="text-xs font-semibold mb-meta">Keyword pairs</div>

              {Array.from({
                length: Math.max(kw.en.length, kw.vi.length),
              }).map((_, i) => {
                const en = String(kw.en[i] ?? "").trim();
                const vi = String(kw.vi[i] ?? "").trim();
                if (!en && !vi) return null;

                const cls = KW_CLASSES[i % KW_CLASSES.length];

                return (
                  <div
                    key={`kw-${i}`}
                    className="flex flex-wrap items-center gap-2 text-sm"
                  >
                    {en ? (
                      <span className={`mb-kw ${cls}`}>{en}</span>
                    ) : (
                      <span className="text-xs mb-meta">(EN missing)</span>
                    )}
                    <span className="text-xs mb-meta">•</span>
                    {vi ? (
                      <span className={`mb-kw ${cls}`}>{vi}</span>
                    ) : (
                      <span className="text-xs mb-meta">(VI missing)</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Essay stays bilingual; highlight only keywords (no rainbow-everything) */}
      {(essay.en || essay.vi) && (
        <div className="mb-card p-4 md:p-6 mb-5">
          <BilingualEssay
            title="Essay"
            en={essay.en || ""}
            vi={essay.vi || ""}
          />
          {/* NOTE: BilingualEssay internally renders text; keyword-only coloring is handled above for intro/entries.
             If you want the SAME keyword highlighting inside BilingualEssay too, we should update BilingualEssay.tsx
             to accept a "keywords" prop and apply highlight there. */}
        </div>
      )}

      {/* BOX 3 — Entry selector + single active entry (only one visible) */}
      {allEntries.length > 0 ? (
        <section className="space-y-4">
          <div className="mb-card p-4 md:p-6">
            <div className="text-xs font-semibold mb-3 mb-meta">
              Entries • Mục nội dung
            </div>

            <div className="grid gap-2">
              {allEntries.map((x, i) => {
                const heading = pickEntryHeading(x.entry, i);
                const sectionPrefix = x.sectionTitle ? `${x.sectionTitle} • ` : "";
                return (
                  <button
                    key={x.entry?.id || x.entry?.slug || i}
                    type="button"
                    className="mb-entry-btn"
                    onClick={() => setActiveIndex(i)}
                    aria-current={i === activeIndex}
                  >
                    <div className="text-xs mb-meta">#{i + 1}</div>
                    <div className="font-semibold">
                      {sectionPrefix}
                      {heading}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {active ? (
            <ActiveEntry
              entry={active}
              index={activeIndex}
              enKeywords={enKeywords}
              viKeywords={viKeywords}
            />
          ) : (
            <div className="mb-card p-6">
              <p className="mb-meta">No active entry.</p>
            </div>
          )}
        </section>
      ) : (
        <div className="mb-card p-6">
          <p className="mb-meta">This room has no renderable entries.</p>
          <p className="mt-1 text-xs mb-meta">
            Essay-only room, landing room, or content pending.
          </p>
        </div>
      )}

      {/* BOX 4 / CHAT BAR are owned by the global page layout, not RoomRenderer. */}
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
  const heading = pickEntryHeading(entry, index);

  const en = normalizeEntryTextEN(entry);
  const vi = normalizeEntryTextVI(entry);

  const audioSrc = pickAudio(entry);
  const audioLabel = audioLabelFromSrc(audioSrc);

  return (
    <div className="mb-card p-4 md:p-6">
      <div className="text-xs mb-meta">Active entry • Mục đang xem: #{index + 1}</div>
      <h3 className="text-2xl font-serif font-bold mt-1">{heading}</h3>

      {/* EN (top) */}
      {en ? (
        <div className="mt-4 text-[15px] md:text-base">
          {highlightByKeywordList(en, enKeywords)}
        </div>
      ) : (
        <div className="mt-4 text-sm mb-meta">EN: no text.</div>
      )}

      {/* AUDIO (middle) */}
      {audioSrc ? (
        <div className="mt-4 w-full max-w-none">
          <TalkingFacePlayButton
            src={audioSrc}
            label={audioLabel}
            className="w-full max-w-none"
            fullWidthBar
          />
        </div>
      ) : null}

      {/* VI (bottom) */}
      {vi ? (
        <div className="mt-4 text-[15px] md:text-base">
          {highlightByKeywordList(vi, viKeywords)}
        </div>
      ) : (
        <div className="mt-4 text-sm mb-meta">VI: chưa có.</div>
      )}
    </div>
  );
}

/** New thing to learn:
 * “Only one entry visible” massively reduces cognitive load—your users stop scanning and start remembering. */
