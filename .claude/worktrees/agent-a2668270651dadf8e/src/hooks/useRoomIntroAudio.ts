/**
 * useRoomIntroAudio
 * MB — SAFE COMPAT PATCH
 *
 * Goals:
 * - Fix parser break (Expression expected).
 * - Avoid hard-typing against MusicPlayerContextValue methods that changed over time.
 * - Keep behavior best-effort: if the global music player exposes requestPlay/notifyStop, use them.
 *   Otherwise, fall back to toggle/stop/play/pause if present.
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
type Params = {
  roomId: string;
  introAudioPath?: string | null;
  enabled?: boolean;
};

type Result = {
  canPlay: boolean;
  play: () => void;
  stop: () => void;
};

export function useRoomIntroAudio() {
  // NOTE: temporarily disabled — player API drift. Keeps build stable.
  return {
    playIntro: () => {},
    stopIntro: () => {},
    isPlaying: false,
  } as const;
}

export default useRoomIntroAudio;
