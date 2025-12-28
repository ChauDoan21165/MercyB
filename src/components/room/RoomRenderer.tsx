// src/components/room/RoomRenderer.tsx
// MB-BLUE-97.6 — 2025-12-29 (+0700)

import React, { useEffect, useMemo, useRef } from "react";
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

function pickIntro(room: AnyRoom) {
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
 * (Prevents filename + 0:00/1:01 + “ghost” UI from leaking into text.)
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

/**
 * Some rooms store text in many possible fields. Normalize ONCE.
 */
function normalizeEntryText(entry: any): string {
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
    entry?.text,
    entry?.body,
    entry?.content,
  ];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return stripImplicitAudioLines(c);
  }
  return "";
}

/**
 * Mercy Blade rainbow text:
 * - split each line into chunks of 3–5 words
 * - each chunk gets a different dark, colorful gradient
 */
function chunkWords(words: string[], startIndex: number) {
  const chunks: { text: string; idx: number }[] = [];
  let i = 0;
  let chunkIdx = 0;

  while (i < words.length) {
    const pick = 3 + ((startIndex + i + chunkIdx) % 3); // 3,4,5 stable
    const slice = words.slice(i, i + pick);
    chunks.push({ text: slice.join(" "), idx: chunkIdx });
    i += pick;
    chunkIdx++;
  }

  return chunks;
}

function RainbowText({ text }: { text: string }) {
  const lines = String(text || "").split("\n");

  return (
    <span className="mb-rainbow-block">
      {lines.map((line, li) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={`br-${li}`} />;

        // Keep punctuation as-is; simple word split is fine for our UI vibe
        const words = trimmed.split(/\s+/).filter(Boolean);
        const chunks = chunkWords(words, li);

        return (
          <span key={`line-${li}`} className="mb-rainbow-line">
            {chunks.map((c, ci) => (
              <span
                key={`c-${li}-${ci}`}
                className={`mb-rainbow-chunk mb-rainbow-${(li + ci) % 6}`}
              >
                {c.text}
                {ci < chunks.length - 1 ? " " : ""}
              </span>
            ))}
            {li < lines.length - 1 ? <br /> : null}
          </span>
        );
      })}
    </span>
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
  const intro = useMemo(() => (room ? pickIntro(room) : ""), [room]);

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
  const entries = resolveEntries(room);
  const kw = resolveKeywords(room);
  const essay = resolveEssay(room);

  return (
    <div
      ref={rootRef}
      className="mb-room w-full max-w-none"
      data-mb-scope="room"
    >
      {/* Mercy Blade ROOM THEME (local, scoped) */}
      <style>{`
        /* Background: vague, light color wash */
        [data-mb-scope="room"].mb-room{
          position: relative;
          padding: 28px 18px 38px;
          border-radius: 24px;
          background:
            radial-gradient(1200px 600px at 10% 10%, rgba(255, 105, 180, 0.10), transparent 55%),
            radial-gradient(900px 500px at 90% 20%, rgba(0, 200, 255, 0.10), transparent 55%),
            radial-gradient(900px 500px at 30% 90%, rgba(140, 255, 120, 0.10), transparent 55%),
            linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88));
          box-shadow: 0 18px 55px rgba(0,0,0,0.08);
          backdrop-filter: blur(8px);
        }

        /* Center header title */
        [data-mb-scope="room"] .mb-room-header{
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 18px;
        }

        /* Dark, colorful rainbow text chunks */
        [data-mb-scope="room"] .mb-rainbow-chunk{
          font-weight: 650;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 0 rgba(0,0,0,0); /* keep crisp */
        }

        [data-mb-scope="room"] .mb-rainbow-0{ background-image: linear-gradient(90deg,#ff3b3b,#ffb300,#00d084); }
        [data-mb-scope="room"] .mb-rainbow-1{ background-image: linear-gradient(90deg,#00c2ff,#6f5bff,#ff4fd8); }
        [data-mb-scope="room"] .mb-rainbow-2{ background-image: linear-gradient(90deg,#ff7a18,#af002d,#319197); }
        [data-mb-scope="room"] .mb-rainbow-3{ background-image: linear-gradient(90deg,#12c2e9,#c471ed,#f64f59); }
        [data-mb-scope="room"] .mb-rainbow-4{ background-image: linear-gradient(90deg,#00ffa3,#00c2ff,#8a2be2); }
        [data-mb-scope="room"] .mb-rainbow-5{ background-image: linear-gradient(90deg,#ffd700,#ff4dff,#4d7cff); }

        /* Cards: soft glass */
        [data-mb-scope="room"] .mb-card{
          border: 1px solid rgba(0,0,0,0.10);
          background: rgba(255,255,255,0.70);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }

        [data-mb-scope="room"] .mb-meta{
          color: rgba(0,0,0,0.55);
        }
      `}</style>

      <header className="mb-room-header">
        <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
          <RainbowText text={title} />
        </h1>

        {intro ? (
          <p className="leading-relaxed text-base md:text-lg">
            <RainbowText text={intro} />
          </p>
        ) : null}

        <div className="text-xs mb-meta">
          roomId: <code>{roomId}</code> • data.id:{" "}
          <code>{room?.id || "missing"}</code>
        </div>

        {(kw.en.length > 0 || kw.vi.length > 0) && (
          <div className="mb-card p-4 text-left max-w-3xl mx-auto w-full">
            <div className="text-xs font-semibold mb-2 mb-meta">Keywords</div>

            {kw.en.length > 0 && (
              <div className="mb-2">
                <div className="text-xs mb-meta mb-1">EN</div>
                <div className="flex flex-wrap gap-2">
                  {kw.en.map((k: string, i: number) => (
                    <span key={i} className="text-xs rounded-full border px-3 py-1 bg-white/70">
                      <RainbowText text={k} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            {kw.vi.length > 0 && (
              <div>
                <div className="text-xs mb-meta mb-1">VI</div>
                <div className="flex flex-wrap gap-2">
                  {kw.vi.map((k: string, i: number) => (
                    <span key={i} className="text-xs rounded-full border px-3 py-1 bg-white/70">
                      <RainbowText text={k} />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {(essay.en || essay.vi) && (
        <div className="mb-card p-4 md:p-6">
          <BilingualEssay title="Essay" en={essay.en || ""} vi={essay.vi || ""} />
        </div>
      )}

      {sections.length > 0 ? (
        <div className="space-y-8">
          {sections.map((s: any, idx: number) => {
            const st =
              s?.title?.en ||
              s?.title_en ||
              s?.name?.en ||
              s?.name_en ||
              s?.id ||
              `Section ${idx + 1}`;
            const sentries = resolveSectionEntries(s);

            return (
              <section key={s?.id || idx} className="mb-card p-6 space-y-4 w-full max-w-none">
                <h2 className="text-xl font-semibold">
                  <RainbowText text={st} />
                </h2>

                {sentries.length > 0 ? (
                  <ol className="space-y-4">
                    {sentries.map((e: any, i: number) => (
                      <EntryCard key={e?.id || e?.slug || i} entry={e} index={i} />
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm mb-meta">This section has no entries.</p>
                )}
              </section>
            );
          })}
        </div>
      ) : entries.length > 0 ? (
        <ol className="space-y-4">
          {entries.map((e: any, i: number) => (
            <EntryCard key={e?.id || e?.slug || i} entry={e} index={i} />
          ))}
        </ol>
      ) : (
        <div className="mb-card p-6">
          <p className="mb-meta">This room has no renderable entries.</p>
          <p className="mt-1 text-xs mb-meta">
            Essay-only room, landing room, or content pending.
          </p>
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry, index }: { entry: any; index: number }) {
  const heading =
    entry?.title?.en ||
    entry?.heading?.en ||
    entry?.title_en ||
    entry?.heading_en ||
    entry?.name?.en ||
    entry?.name_en ||
    entry?.slug ||
    entry?.id ||
    `Entry ${index + 1}`;

  const body = normalizeEntryText(entry);

  const audioSrc = pickAudio(entry);
  const audioLabel = audioLabelFromSrc(audioSrc);

  return (
    <li className="mb-card p-6 space-y-3 w-full max-w-none">
      <div className="text-sm mb-meta">#{index + 1}</div>

      <h3 className="text-lg font-semibold">
        <RainbowText text={heading} />
      </h3>

      {body ? (
        <p className="leading-relaxed whitespace-pre-line text-[15px] md:text-base">
          <RainbowText text={body} />
        </p>
      ) : (
        <p className="text-sm mb-meta">No copy text.</p>
      )}

      {audioSrc ? (
        <div className="mt-3 w-full max-w-none">
          <TalkingFacePlayButton
            src={audioSrc}
            label={audioLabel}
            className="w-full max-w-none"
            fullWidthBar
          />
        </div>
      ) : null}
    </li>
  );
}

/** New thing to learn: Chunked gradient text (3–5 words per chunk) looks “alive” without destroying readability—because the eye still tracks word groups, not every single colored letter. */
