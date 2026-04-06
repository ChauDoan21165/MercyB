/**
 * Path: src/components/mercy-guide/tabs/PronunciationTab.tsx
 */

import React from 'react';
import type { CompanionProfile } from '@/services/companion';
import { MercySpeakTab } from '@/components/mercy-guide/MercySpeakTab';
import type { useSpeakPractice } from '@/components/mercy-guide/hooks/useSpeakPractice';
import type { TroubleWord } from '../shared';

interface PronunciationTabProps {
  roomId?: string;
  contentEn?: string;
  profile: CompanionProfile;
  troubleWords: string[];
  speakPractice: ReturnType<typeof useSpeakPractice>;
}

const MercySpeakTabView = MercySpeakTab as React.ComponentType<any>;

export function PronunciationTab({
  roomId,
  contentEn,
  profile,
  troubleWords,
  speakPractice,
}: PronunciationTabProps) {
  const normalizedTroubleWords: TroubleWord[] = troubleWords.map((word) => ({
    word,
    count: 0,
    lastScore: 0,
    bestScore: 0,
  }));

  return (
    <MercySpeakTabView
      roomId={roomId}
      contentEn={contentEn}
      profile={profile}
      troubleWords={normalizedTroubleWords}
      speakPractice={speakPractice}
    />
  );
}

export default PronunciationTab;