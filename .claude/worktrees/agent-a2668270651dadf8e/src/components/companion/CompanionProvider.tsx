import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useCompanionIntegration } from '@/hooks/useCompanionIntegration';
import { CompanionBubble } from './CompanionBubble';

interface CompanionContextValue {
  onAudioPlay: () => void;
  onAudioEnded: () => void;
  onReflectionVisible: () => void;
  onReflectionSubmit: (text: string) => Promise<void>;
  onMoodSelect: (mood: string) => void;
  onDayComplete: () => void;
  canSpeak: () => boolean;
  isRoomMuted: boolean;
  muteRoom: () => void;
  unmuteRoom: () => void;
  visitCount: number;
}

const CompanionContext = createContext<CompanionContextValue | null>(null);

export function CompanionProvider({
  children,
  roomId,
  isPathDay = false,
  dayIndex = 1,
}: {
  children: ReactNode;
  roomId: string;
  isPathDay?: boolean;
  dayIndex?: number;
}) {
  const c = useCompanionIntegration({ roomId, isPathDay, dayIndex });

  // Ensure onReflectionSubmit always matches (text) => Promise<void>
  const onReflectionSubmit: CompanionContextValue['onReflectionSubmit'] = async (text: string) => {
    // If the integration returns void, this wrapper still returns Promise<void>.
    // If it already returns a Promise, awaiting preserves behavior.
    await c.onReflectionSubmit(text as any);
  };

  const ctx: CompanionContextValue = useMemo(
    () => ({
      onAudioPlay: c.onAudioPlay,
      onAudioEnded: c.onAudioEnded,
      onReflectionVisible: c.onReflectionVisible,
      onReflectionSubmit,
      onMoodSelect: c.onMoodSelect,
      onDayComplete: c.onDayComplete,
      canSpeak: c.canSpeak,
      isRoomMuted: c.isRoomMuted,
      muteRoom: c.muteRoom,
      unmuteRoom: c.unmuteRoom,
      visitCount: c.visitCount,
    }),
    [
      c.onAudioPlay,
      c.onAudioEnded,
      c.onReflectionVisible,
      onReflectionSubmit,
      c.onMoodSelect,
      c.onDayComplete,
      c.canSpeak,
      c.isRoomMuted,
      c.muteRoom,
      c.unmuteRoom,
      c.visitCount,
    ]
  );

  return (
    <CompanionContext.Provider value={ctx}>
      {children}
      <CompanionBubble
        text={c.bubbleData.text}
        visible={c.bubbleData.visible}
        onClose={c.hideBubble}
        title="Mercy"
        onMuteRoom={c.muteRoom}
        showMuteOption={c.visitCount > 1}
      />
    </CompanionContext.Provider>
  );
}

export function useCompanion(): CompanionContextValue {
  const ctx = useContext(CompanionContext);
  return (
    ctx || {
      onAudioPlay: () => {},
      onAudioEnded: () => {},
      onReflectionVisible: () => {},
      onReflectionSubmit: async () => {},
      onMoodSelect: () => {},
      onDayComplete: () => {},
      canSpeak: () => false,
      isRoomMuted: false,
      muteRoom: () => {},
      unmuteRoom: () => {},
      visitCount: 0,
    }
  );
}

export default CompanionProvider;