import React from 'react';
import { CompanionProfile } from '@/services/companion';
import { MercySpeakTab } from '@/components/mercy-guide/MercySpeakTab';

interface PronunciationTabProps {
  roomId?: string;
  contentEn?: string;
  profile: CompanionProfile;
  troubleWords: string[];
  speakPractice: ReturnType<typeof import('@/components/mercy-guide/hooks/useSpeakPractice').useSpeakPractice>;
}

export function PronunciationTab({
  roomId,
  contentEn,
  profile,
  troubleWords,
  speakPractice,
}: PronunciationTabProps) {
  return (
    <MercySpeakTab
      roomId={roomId}
      contentEn={contentEn}
      profile={profile}
      troubleWords={troubleWords}
      speakPractice={speakPractice}
    />
  );
}
