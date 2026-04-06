/**
 * Path: src/components/mercy-guide/tabs/YourJourneyTab.tsx
 */

import React from 'react';
import type { CompanionProfile } from '@/services/companion';
import type { SuggestedItem } from '@/services/suggestions';
import type { StudyLogEntry } from '@/services/studyLog';
import { MercySuggestTab } from '@/components/mercy-guide/MercySuggestTab';
import { Button } from '@/components/ui/button';

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
  checkInMessage,
}: YourJourneyTabProps) {
  const displayName = 'friend';

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4 px-4 py-4 md:px-5">
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-lg font-semibold">Your journey</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back, {displayName}.
            </p>
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Today
              </p>
              <p className="mt-2 text-2xl font-semibold">{todayTotalMinutes} min</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Total study time logged today
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Mood support
              </p>
              <p className="mt-2 text-base font-semibold">
                {hasHeavyMoods ? 'Extra support recommended' : 'Steady progress'}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasHeavyMoods
                  ? 'A gentle reset may help before continuing.'
                  : 'You seem ready to keep building momentum.'}
              </p>
            </div>
          </section>

          {checkInMessage && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Check-in
              </p>
              <p className="mt-2 text-sm">{checkInMessage.en}</p>
              <p className="mt-2 text-sm text-muted-foreground">{checkInMessage.vi}</p>
            </section>
          )}

          {yesterdaySummary && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Yesterday
              </p>
              <div className="mt-2 text-sm text-muted-foreground">
                <pre className="whitespace-pre-wrap font-sans">
                  {JSON.stringify(yesterdaySummary, null, 2)}
                </pre>
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant={showBreathingScript ? 'default' : 'outline'}
                onClick={() => setShowBreathingScript((v) => !v)}
              >
                {showBreathingScript ? 'Hide breathing' : 'Show breathing'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setBreathingStep((step) => step + 1)}
              >
                Next breathing step
              </Button>

              <Button
                type="button"
                variant={showReframe ? 'default' : 'outline'}
                onClick={() => setShowReframe((v) => !v)}
              >
                {showReframe ? 'Hide reframe' : 'Show reframe'}
              </Button>
            </div>

            {showBreathingScript && (
              <p className="mt-3 text-sm text-muted-foreground">
                Breathing step: {breathingStep}
              </p>
            )}

            {showReframe && (
              <p className="mt-2 text-sm text-muted-foreground">
                Pause, notice what feels hard, and take the next smallest helpful step.
              </p>
            )}
          </section>

          <div className="border-t border-border/70 pt-4">
            <MercySuggestTab
              suggestions={suggestions}
              onNavigateSuggestion={onNavigateSuggestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default YourJourneyTab;