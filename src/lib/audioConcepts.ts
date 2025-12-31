// src/lib/audioConcepts.ts
// MB-BLUE-99.3 — 2025-12-31 (+0700)
/**
 * AUDIO CONCEPTS (LOCKED)
 * - "Lesson Audio" = audio attached to learning content (TalkingFacePlayButton)
 * - "Music"        = entertainment only (MusicDock)
 *
 * Rule: NEVER render Music inside lesson/content pages. Music lives ONLY in MusicDock.
 */

export const AUDIO_CONCEPT = {
  LESSON: "lesson_audio",
  MUSIC: "music_only",
} as const;

export type AudioConcept = (typeof AUDIO_CONCEPT)[keyof typeof AUDIO_CONCEPT];

export function stripAudioArtifacts(text: string): string {
  // Removes mp3 filename lines + common native-player artifacts (0:00, 1x, etc.)
  if (!text) return "";

  const lines = String(text).split("\n");
  const out: string[] = [];

  const timeLineA = /^\s*\d{1,2}:\d{2}\s*$/; // 0:00
  const timeLineB = /^\s*\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}\s*$/; // 0:00 / 0:43
  const speedLine = /^\s*(0\.5x|0\.75x|1x|1\.0x|1\.25x|1\.5x|2x)\s*$/i;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i] ?? "";
    const t = raw.trim();

    // any mp3-like artifact line
    if (/\.(mp3|wav|m4a)\b/i.test(t)) {
      // also skip the next 1–3 lines if they look like player UI
      for (let k = 1; k <= 3; k++) {
        const nxt = (lines[i + k] ?? "").trim();
        if (timeLineA.test(nxt) || timeLineB.test(nxt) || speedLine.test(nxt)) i++;
        else break;
      }
      continue;
    }

    if (timeLineA.test(t) || timeLineB.test(t) || speedLine.test(t)) continue;

    out.push(raw);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
