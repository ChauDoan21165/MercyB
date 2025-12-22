// src/contexts/MusicPlayerContext.tsx — v2025-12-21-88.3-MUSIC-CONTEXT-HARDENED
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Snapshot sent from any AudioPlayer
 * Only ONE player is allowed to be "active" at a time
 */
type MusicPlayerSnapshot = {
  isPlaying: boolean;
  currentTrackName?: string;
};

/**
 * Context value
 */
type MusicPlayerContextValue = {
  isPlaying: boolean;
  currentTrackName?: string;
  /**
   * Called by AudioPlayer
   * Returns true if caller is allowed to play
   */
  requestPlay: (snapshot: MusicPlayerSnapshot) => boolean;
  /**
   * Notify stop / pause
   */
  notifyStop: () => void;
};

const MusicPlayerContext =
  createContext<MusicPlayerContextValue | undefined>(undefined);

/**
 * MusicPlayerProvider
 *
 * Guarantees:
 * - Only ONE audio plays at a time (global calm)
 * - Homepage sections do not overlap audio
 * - Safe for future rituals / background music
 */
export const MusicPlayerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState<
    string | undefined
  >();

  // Track ownership (who is currently allowed to play)
  const activeOwnerRef = useRef<string | null>(null);

  /**
   * AudioPlayer calls this BEFORE playing
   * If another track is active → deny
   */
  const requestPlay = useCallback(
    (snapshot: MusicPlayerSnapshot): boolean => {
      const name = snapshot.currentTrackName || "unknown";

      // No one playing → grant
      if (!activeOwnerRef.current) {
        activeOwnerRef.current = name;
        setIsPlaying(true);
        setCurrentTrackName(name);
        return true;
      }

      // Same owner resumes → grant
      if (activeOwnerRef.current === name) {
        setIsPlaying(snapshot.isPlaying);
        return true;
      }

      // Another audio is already playing → deny
      return false;
    },
    []
  );

  /**
   * AudioPlayer calls this when paused / ended
   */
  const notifyStop = useCallback(() => {
    activeOwnerRef.current = null;
    setIsPlaying(false);
    setCurrentTrackName(undefined);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        currentTrackName,
        requestPlay,
        notifyStop,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

/**
 * Hook
 */
export const useMusicPlayer = () => {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error(
      "useMusicPlayer must be used within a MusicPlayerProvider"
    );
  }
  return ctx;
};
