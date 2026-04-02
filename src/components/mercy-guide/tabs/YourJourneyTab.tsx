import React from 'react';
import { CompanionProfile } from '@/services/companion';
import { SuggestedItem } from '@/services/suggestions';
import { StudyLogEntry } from '@/services/studyLog';
import { MercyTeacherTab } from '@/components/mercy-guide/MercyTeacherTab';
import { MercySuggestTab } from '@/components/mercy-guide/MercySuggestTab';

interface YourJourneyTabProps {
  profile: CompanionProfile;
  yesterdaySummary?: StudyLogEntry;
  todayTotalMinutes: number;
  hasHeavyMoods: boolean;
  suggestions: SuggestedItem[];
  showBreathingScript: boolean;
  breathingStep: number;
  showReframe: boolean;
  setShowBreathingScript: React.Dispatch<React.SetStateAction<boolean>>;
  setBreathingStep: React.Dispatch<React.SetStateAction<number>>;
  setShowReframe: React.Dispatch<React.SetStateAction<boolean>>;
  onNavigateSuggestion: (item: SuggestedItem) => void;
  checkInMessage?: {
    en: string;
    vi: string;
  } | null;
}

export function YourJourneyTab({
  profile,
  yesterdaySummary,
  todayTotalMinutes,
  hasHeavyMoods,
  suggestions,
  showBreathingScript,
  breathingStep,
  showReframe,
  setShowBreathingScript,
  setBreathingStep,
  setShowReframe,
  onNavigateSuggestion,
}: YourJourneyTabProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <MercyTeacherTab
          profile={profile}
          yesterdaySummary={yesterdaySummary}
          todayTotalMinutes={todayTotalMinutes}
          hasHeavyMoods={hasHeavyMoods}
          suggestions={suggestions}
          showBreathingScript={showBreathingScript}
          breathingStep={breathingStep}
          showReframe={showReframe}
          setShowBreathingScript={setShowBreathingScript}
          setBreathingStep={setBreathingStep}
          setShowReframe={setShowReframe}
          onNavigateSuggestion={onNavigateSuggestion}
        />

        <div className="px-4 pb-4 pt-2 md:px-5">
          <div className="mb-3 border-t border-border/70" />
          <MercySuggestTab suggestions={suggestions} onNavigateSuggestion={onNavigateSuggestion} />
        </div>
      </div>
    </div>
  );
}
