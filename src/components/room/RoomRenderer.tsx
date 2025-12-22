// src/components/room/RoomRenderer.tsx
// PHASE I — 79.6 — MB-BLUE-15.4 — 2025-12-21
// STAGE: Phase I viewer — prove loaded JSON shows keywords/audio/entries in UI (no business logic)

/**
 * RoomRenderer (read-only viewer)
 * Purpose (Phase I):
 * - Prove the loaded JSON is present in UI (keywords/audio/entries visibility)
 * - Zero business logic (no resolver rules, no routing rules)
 * - Be tolerant of multiple room JSON shapes
 */

import React from "react";

type AnyRoom = any;

function isNonEmptyString(x: any): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

function asStringArray(x: any): string[] {
  if (Array.isArray(x)) return x.filter(isNonEmptyString);
  return [];
}

function pickText(room: AnyRoom, key: string): { en?: string; vi?: string } {
  const v = room?.[key];
  if (!v) return {};
  if (typeof v === "string") return { en: v };
  if (typeof v === "object") {
    return {
      en: isNonEmptyString(v.en) ? v.en : undefined,
      vi: isNonEmptyString(v.vi) ? v.vi : undefined,
    };
  }
  return {};
}

function sectionTitle(title: string) {
  return (
    <h3 className="text-sm font-semibold text-foreground mt-6 mb-2">
      {title}
    </h3>
  );
}

export default function RoomRenderer({ room }: { room: AnyRoom }) {
  if (!room) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No room data.
      </div>
    );
  }

  const id = isNonEmptyString(room?.id) ? room.id : "";
  const tier = isNonEmptyString(room?.tier) ? room.tier : "";
  const domain = isNonEmptyString(room?.domain) ? room.domain : "";

  // Many rooms use title.{en,vi}; some older use description.{en,vi}
  const title = pickText(room, "title");
  const description = pickText(room, "description");
  const roomEssay = pickText(room, "room_essay");

  const keywords = asStringArray(room?.keywords);

  // Audio may exist in different shapes; show something if we can find it
  // Examples we might see:
  // - room.audio: string
  // - room.audio_files: string[]
  // - room.audio: { files: string[] }
  const audioSingle = isNonEmptyString(room?.audio) ? room.audio : "";
  const audioFiles =
    asStringArray(room?.audio_files).length > 0
      ? asStringArray(room?.audio_files)
      : asStringArray(room?.audio?.files);

  const entries = Array.isArray(room?.entries) ? room.entries : [];

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{id || "Room"}</h1>

        {(title.en || title.vi) && (
          <div className="mt-3 space-y-1">
            {title.en && <div className="text-base text-foreground">{title.en}</div>}
            {title.vi && <div className="text-base text-muted-foreground">{title.vi}</div>}
          </div>
        )}

        {!title.en && !title.vi && (description.en || description.vi) && (
          <div className="mt-3 space-y-1">
            {description.en && (
              <div className="text-base text-foreground">{description.en}</div>
            )}
            {description.vi && (
              <div className="text-base text-muted-foreground">{description.vi}</div>
            )}
          </div>
        )}

        {(tier || domain) && (
          <div className="mt-3 text-xs text-muted-foreground">
            {tier && <span>Tier: {tier}</span>}
            {tier && domain && <span className="mx-2">•</span>}
            {domain && <span>Domain: {domain}</span>}
          </div>
        )}
      </div>

      {(description.en || description.vi) && (
        <>
          {sectionTitle("Description")}
          <div className="space-y-3 leading-7">
            {description.en && <p className="text-foreground">{description.en}</p>}
            {description.vi && <p className="text-muted-foreground">{description.vi}</p>}
          </div>
        </>
      )}

      {keywords.length > 0 && (
        <>
          {sectionTitle("Keywords")}
          <div className="flex flex-wrap gap-2">
            {keywords.map((k: string) => (
              <span
                key={k}
                className="rounded-full border px-3 py-1 text-xs text-foreground/90"
              >
                {k}
              </span>
            ))}
          </div>
        </>
      )}

      {(audioSingle || audioFiles.length > 0) && (
        <>
          {sectionTitle("Audio")}
          <div className="space-y-2 text-sm">
            {audioSingle && (
              <div className="text-muted-foreground">
                audio: <code className="text-foreground">{audioSingle}</code>
              </div>
            )}

            {audioFiles.length > 0 && (
              <ul className="list-disc pl-5 text-muted-foreground">
                {audioFiles.map((f: string) => (
                  <li key={f}>
                    <code className="text-foreground">{f}</code>
                  </li>
                ))}
              </ul>
            )}

            <div className="text-xs text-muted-foreground">
              (Phase I viewer: showing filenames only — player wiring later.)
            </div>
          </div>
        </>
      )}

      {(roomEssay.en || roomEssay.vi) && (
        <>
          {sectionTitle("Room essay")}
          <div className="space-y-3 leading-7">
            {roomEssay.en && <p className="text-foreground">{roomEssay.en}</p>}
            {roomEssay.vi && <p className="text-muted-foreground">{roomEssay.vi}</p>}
          </div>
        </>
      )}

      {entries.length > 0 && (
        <>
          {sectionTitle(`Entries (${entries.length})`)}
          <div className="rounded-lg border p-3 text-xs text-muted-foreground overflow-auto">
            <pre className="whitespace-pre-wrap">{JSON.stringify(entries, null, 2)}</pre>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            (Phase I viewer: raw entries dump — proper rendering later.)
          </div>
        </>
      )}

      {/* Debug: top-level keys */}
      {sectionTitle("Debug: top keys")}
      <div className="rounded-lg border p-3 text-xs text-muted-foreground overflow-auto">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(Object.keys(room || {}).sort(), null, 2)}
        </pre>
      </div>
    </div>
  );
}
