import React, { createContext, useContext, ReactNode } from 'react';
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
}

const CompanionContext = createContext<CompanionContextValue | null>(null);

interface CompanionProviderProps {
  children: ReactNode;
  roomId: string;
  isPathDay?: boolean;
  dayIndex?: number;
}

/**
 * Provider component that wraps room/path pages with companion functionality
 */
export function CompanionProvider({
  children,
  roomId,
  isPathDay = false,
  dayIndex = 1,
}: CompanionProviderProps) {
  const companion = useCompanionIntegration({
    roomId,
    isPathDay,
    dayIndex,
  });

  const contextValue: CompanionContextValue = {
    onAudioPlay: companion.onAudioPlay,
    onAudioEnded: companion.onAudioEnded,
    onReflectionVisible: companion.onReflectionVisible,
    onReflectionSubmit: companion.onReflectionSubmit,
    onMoodSelect: companion.onMoodSelect,
    onDayComplete: companion.onDayComplete,
    canSpeak: companion.canSpeak,
  };

  return (
    <CompanionContext.Provider value={contextValue}>
      {children}
      {/* Bubble container - positioned relative to audio player */}
      <CompanionBubbleContainer
        text={companion.bubbleData.text}
        visible={companion.bubbleData.visible}
        onClose={companion.hideBubble}
      />
    </CompanionContext.Provider>
  );
}

/**
 * Hook to access companion context
 */
export function useCompanion() {
  const context = useContext(CompanionContext);
  if (!context) {
    // Return no-op functions if not in provider
    return {
      onAudioPlay: () => {},
      onAudioEnded: () => {},
      onReflectionVisible: () => {},
      onReflectionSubmit: async () => {},
      onMoodSelect: () => {},
      onDayComplete: () => {},
      canSpeak: () => false,
    };
  }
  return context;
}

/**
 * Bubble container that positions itself above the audio player
 */
function CompanionBubbleContainer({
  text,
  visible,
  onClose,
}: {
  text: string;
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible && !text) return null;

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
      style={{ maxWidth: '720px', width: '100%', pointerEvents: 'none' }}
    >
      <div className="relative flex justify-center" style={{ pointerEvents: 'auto' }}>
        <CompanionBubble text={text} visible={visible} onClose={onClose} />
      </div>
    </div>
  );
}

export default CompanionProvider;
