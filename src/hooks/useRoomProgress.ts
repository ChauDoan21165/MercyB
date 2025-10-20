import { useState, useEffect } from 'react';

interface RoomVisit {
  roomId: string;
  timestamp: number;
  count: number;
}

interface ProgressData {
  visits: RoomVisit[];
  lastVisit: string | null;
  totalRooms: number;
  streak: number;
}

const STORAGE_KEY = 'room_progress';

export const useRoomProgress = (currentRoomId?: string) => {
  const [progress, setProgress] = useState<ProgressData>({
    visits: [],
    lastVisit: null,
    totalRooms: 0,
    streak: 0
  });

  useEffect(() => {
    // Load progress from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setProgress(data);
      } catch (e) {
        console.error('Failed to parse progress data', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentRoomId) return;

    // Update progress when entering a room
    const stored = localStorage.getItem(STORAGE_KEY);
    let data: ProgressData = progress;

    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch (e) {
        data = progress;
      }
    }

    const existingVisit = data.visits.find(v => v.roomId === currentRoomId);
    const now = Date.now();

    if (existingVisit) {
      existingVisit.count += 1;
      existingVisit.timestamp = now;
    } else {
      data.visits.push({
        roomId: currentRoomId,
        timestamp: now,
        count: 1
      });
    }

    data.totalRooms = new Set(data.visits.map(v => v.roomId)).size;
    data.lastVisit = currentRoomId;

    // Calculate streak (simplified: count unique days visited)
    const sortedVisits = [...data.visits].sort((a, b) => b.timestamp - a.timestamp);
    let streakCount = 1;
    let lastDate = new Date(sortedVisits[0]?.timestamp || now).toDateString();

    for (let i = 1; i < sortedVisits.length; i++) {
      const visitDate = new Date(sortedVisits[i].timestamp).toDateString();
      const dayDiff = Math.floor((new Date(lastDate).getTime() - new Date(visitDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streakCount++;
        lastDate = visitDate;
      } else if (dayDiff > 1) {
        break;
      }
    }
    data.streak = streakCount;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setProgress(data);
  }, [currentRoomId]);

  return progress;
};
