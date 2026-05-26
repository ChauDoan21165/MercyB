// src/components/audio/EntryAudioButton.tsx — MB-BLUE-94.7 — 2025-12-24 (+0700)
/**
 * EntryAudioButton
 * RULE (LOCKED UI MOTIF):
 * - The play button is ALWAYS a small round face icon.
 * - Mouth OPEN while audio is playing, CLOSED when paused.
 */

import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

type Props = {
  file: string; // filename only, e.g. "english_writing_basics.mp3"
  title?: string;
};

function FaceIcon({ playing }: { playing: boolean }) {
  // Simple inline SVG: circle face + mouth open/closed.
  // (No extra deps; stable + predictable.)
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="block"
    >
      {/* face */}
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* eyes */}
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      {/* mouth */}
      {playing ? (
        <ellipse cx="12" cy="15" rx="2.3" ry="1.8" fill="currentColor" />
      ) : (
        <line
          x1="10"
          y1="15"
          x2="14"
          y2="15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function EntryAudioButton({ file, title }: Props) {
  const { play, stop, isPlaying, currentTrackName } = useMusicPlayer();

  const clean = String(file || "").trim();
  const isThisPlaying = Boolean(clean) && isPlaying && currentTrackName === clean;

  const handleClick = async () => {
    if (!clean) return;

    if (isThisPlaying) {
      stop();
    } else {
      await play(clean);
    }
  };

  const label = title || (isThisPlaying ? "Pause audio" : "Play audio");

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!clean}
      className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:bg-accent disabled:opacity-50"
      title={label}
      aria-label={label}
    >
      <FaceIcon playing={isThisPlaying} />
    </button>
  );
}
