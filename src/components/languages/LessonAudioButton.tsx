// src/components/languages/LessonAudioButton.tsx
//
// Small inline icon button used inside <LessonRenderer> to play a single
// audio clip (a sentence, vocab item, or dialogue line). Each lesson can
// render dozens of these, so this component is intentionally lightweight:
// no progress bar, no animated face, no label text.
//
// Behavior:
//   - Uses useAudioUrl(audioKey) for Supabase resolution.
//   - Click to play, click again to pause, ends → resets to play state.
//   - Single-instance playback: when one button starts, others receive a
//     window event and pause themselves. No global context needed.
//   - On 404 / load error: renders nothing (returns null). Phonics-skipped
//     units (Japanese A1 single-kana vocab, Korean A1 jamo) are gracefully
//     hidden rather than showing a broken icon.

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { useAudioUrl } from "@/hooks/useAudioUrl";

const PLAY_EVENT = "mb:lesson-audio-play";

type Props = {
  audioKey: string | null | undefined;
  ariaLabel: string;
  accent?: string;
};

export function LessonAudioButton({ audioKey, ariaLabel, accent }: Props) {
  const safeKey = (audioKey ?? "").trim();
  const { url, loading } = useAudioUrl(safeKey || null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  // Stable instance id so we can ignore our own broadcast events.
  const instanceIdRef = useRef<symbol>(Symbol("lesson-audio"));

  useEffect(() => {
    if (!url) return;
    const a = new Audio();
    a.preload = "none";
    a.src = url;
    audioRef.current = a;

    const onPlay = () => {
      setPlaying(true);
      try {
        window.dispatchEvent(
          new CustomEvent(PLAY_EVENT, { detail: { id: instanceIdRef.current } }),
        );
      } catch {}
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      a.currentTime = 0;
    };
    const onError = () => {
      // Treat any load/playback error as "no audio for this clip" — most
      // commonly a 404 for a phonics-skipped unit. Hide the button.
      setMissing(true);
      setPlaying(false);
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);

    return () => {
      a.pause();
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [url]);

  // Pause when another LessonAudioButton starts playing.
  useEffect(() => {
    function onOtherPlay(e: Event) {
      const detail = (e as CustomEvent).detail as { id?: symbol } | undefined;
      if (detail?.id === instanceIdRef.current) return;
      const a = audioRef.current;
      if (a && !a.paused) a.pause();
    }
    window.addEventListener(PLAY_EVENT, onOtherPlay as EventListener);
    return () =>
      window.removeEventListener(PLAY_EVENT, onOtherPlay as EventListener);
  }, []);

  if (!safeKey || missing) return null;

  const handleClick = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      const p = a.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Autoplay blocked or src failed mid-load — treat as missing.
          setMissing(true);
        });
      }
    } else {
      a.pause();
    }
  };

  const Icon = playing ? Pause : Play;
  const color = accent ?? "currentColor";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      disabled={loading || !url}
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      style={{ color }}
    >
      <Icon className="h-3 w-3" fill={playing ? color : "none"} />
    </button>
  );
}

export default LessonAudioButton;
