import React from 'react';
import { ArrowRight, BrainCircuit, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MercyEnglishTab } from '@/components/mercy-guide/MercyEnglishTab';

interface EnglishLogicTabProps {
  roomTitle?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
  englishLevel?: string | null;
  troubleWords: string[];
  onVaultReplay: (word: string) => void;
}

const PATTERNS = [
  {
    vi: 'vừa...vừa...',
    en: 'both ... and ... / at the same time',
    tip: 'English usually chooses a direct structure instead of repeating the Vietnamese pattern.',
  },
  {
    vi: 'dù...nhưng...',
    en: 'although / even though',
    tip: 'In English, “although” usually replaces “but” in the same sentence.',
  },
  {
    vi: 'em thấy / tôi feel that',
    en: 'I think / I feel / it seems',
    tip: 'Choose the English verb based on meaning, not a word-for-word translation.',
  },
];

export function EnglishLogicTab({
  roomTitle,
  pathSlug,
  tags,
  contentEn,
  englishLevel,
  troubleWords,
  onVaultReplay,
}: EnglishLogicTabProps) {
  const contextLabel = roomTitle || pathSlug || tags?.[0] || 'this lesson';

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 md:px-5">
        <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-pink-100 p-2 text-pink-700">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">English Logic</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Use this space to bridge Vietnamese thinking and natural English for {contextLabel}.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {PATTERNS.map((pattern) => (
            <div key={pattern.vi} className="rounded-xl border border-border/70 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-pink-700">
                <Languages className="h-3.5 w-3.5" /> Logic bridge
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">{pattern.vi}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
                <span>{pattern.en}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{pattern.tip}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border/70 bg-muted/20 p-3">
          <p className="text-sm font-medium text-foreground">Need a sentence fix right now?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The analyzer below is still available here so learners can test the logic bridge with real text.
          </p>
        </div>

        <div className="mt-4">
          <MercyEnglishTab
            roomId={roomTitle}
            contentEn={contentEn}
            englishLevel={englishLevel}
            troubleWords={troubleWords}
            onVaultReplay={onVaultReplay}
            onRequestGuideTab={() => undefined}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" className="rounded-full text-xs font-semibold">
            More logic patterns soon
          </Button>
        </div>
      </div>
    </div>
  );
}
