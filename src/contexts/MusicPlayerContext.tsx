import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type MusicPlayerSnapshot = {
  isPlaying: boolean;
  currentTrackName?: string;
};

type MusicPlayerContextValue = {
  isPlaying: boolean;
  currentTrackName?: string;
  updateFromPlayer: (snapshot: MusicPlayerSnapshot) => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState<string | undefined>();

  const updateFromPlayer = useCallback((snapshot: MusicPlayerSnapshot) => {
    setIsPlaying(snapshot.isPlaying);
    setCurrentTrackName(snapshot.currentTrackName);
  }, []);

  return (
    <MusicPlayerContext.Provider value={{ isPlaying, currentTrackName, updateFromPlayer }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return ctx;
};
