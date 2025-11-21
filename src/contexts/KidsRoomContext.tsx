import { createContext, useContext, useState, ReactNode } from 'react';

interface RoomEntry {
  slug: string;
  keywords_en: string[];
  keywords_vi: string[];
  copy: {
    en: string;
    vi: string;
  };
  tags: string[];
  audio: string;
  audio_vi: string;
}

interface RoomData {
  id: string;
  tier: string;
  title: {
    en: string;
    vi: string;
  };
  content: {
    en: string;
    vi: string;
    audio: string;
  };
  entries: RoomEntry[];
  meta: {
    age_range: string;
    level: string;
    entry_count: number;
    room_color: string;
  };
}

interface KidsRoomContextType {
  roomData: RoomData | null;
  loading: boolean;
  error: string | null;
  loadRoom: (roomId: string) => Promise<void>;
  refreshRoom: () => Promise<void>;
}

const KidsRoomContext = createContext<KidsRoomContextType | undefined>(undefined);

export const KidsRoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string>('');

  const loadRoom = async (roomId: string) => {
    setLoading(true);
    setError(null);
    setCurrentRoomId(roomId);
    
    try {
      const response = await fetch(`/data/${roomId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load room: ${response.statusText}`);
      }
      const data = await response.json();
      setRoomData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load room data';
      setError(errorMessage);
      console.error('Failed to load room data:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshRoom = async () => {
    if (currentRoomId) {
      await loadRoom(currentRoomId);
    }
  };

  return (
    <KidsRoomContext.Provider value={{ roomData, loading, error, loadRoom, refreshRoom }}>
      {children}
    </KidsRoomContext.Provider>
  );
};

export const useKidsRoomContext = () => {
  const context = useContext(KidsRoomContext);
  if (!context) {
    throw new Error('useKidsRoomContext must be used within KidsRoomProvider');
  }
  return context;
};
