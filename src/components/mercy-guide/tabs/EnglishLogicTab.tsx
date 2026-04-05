/**
 * Path: src/components/mercy-guide/tabs/EnglishLogicTab.tsx
 */

import React, { useMemo } from 'react';
import { ArrowRight, BrainCircuit, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MercyEnglishTab } from '@/components/mercy-guide/MercyEnglishTab';
import type { TroubleWord } from '@/components/mercy-guide/shared';

interface EnglishLogicTabProps {
  roomId?: string;
  roomTitle?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
  englishLevel?: string | null;
  troubleWords: Array<string | TroubleWord>;
  onVaultReplay: (word: string) => void;
  onRequestGuideTab?: () => void;
}

type LogicPattern = {
  vi: string;
  en: string;
  tip: string;
};

const PATTERNS: LogicPattern[] = [
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

function getContextLabel(
  roomTitle?: string,
  pathSlug?: string,
  tags?: string[]
): string {
  const firstTag =
    Array.isArray(tags) && typeof tags[0] === 'string' ? tags[0].trim() : '';

  return roomTitle?.trim() || pathSlug?.trim() || firstTag || 'this lesson';
}

function normalizeTroubleWords(
  troubleWords: Array<string | TroubleWord>
): TroubleWord[] {
  return troubleWords
    .map((item) => {
      if (typeof item === 'string') {
        const word = item.trim();

        if (!word) {
          return null;
        }

        return {
          word,
          count: 0,
          lastScore: 0,
          bestScore: 0,
        } satisfies TroubleWord;
      }

      if (!item || typeof item.word !== 'string' || !item.word.trim()) {
        return null;
      }

      return {
        word: item.word.trim(),
        count: typeof item.count === 'number' ? item.count : 0,
        lastScore: typeof item.lastScore === 'number' ? item.lastScore : 0,
        bestScore: typeof item.bestScore === 'number' ? item.bestScore : 0,
        updatedAt: item.updatedAt,
        tipEn: item.tipEn,
        tipVi: item.tipVi,
      } satisfies TroubleWord;
    })
    .filter((item): item is TroubleWord => item !== null);
}

export function EnglishLogicTab({
  roomId,
  roomTitle,
  pathSlug,
  tags,
  contentEn,
  englishLevel,
  troubleWords,
  onVaultReplay,
  onRequestGuideTab,
}: EnglishLogicTabProps) {
  const contextLabel = getContextLabel(roomTitle, pathSlug, tags);
  const normalizedTroubleWords = useMemo(
    () => normalizeTroubleWords(troubleWords),
    [troubleWords]
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 md:px-5">
        <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-pink-100 p-2 text-pink-700">
              <BrainCircuit className="h-5 w-5" />
            </div>

            <div>
              <h4 className="text-base font-semibold text-foreground">
                English Logic
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Use this space to bridge Vietnamese thinking and natural English
                for {contextLabel}.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {PATTERNS.map((pattern) => (
            <div
              key={pattern.vi}
              className="rounded-xl border border-border/70 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-pink-700">
                <Languages className="h-3.5 w-3.5" />
                <span>Logic bridge</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-foreground">
                {pattern.vi}
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="h-4 w-4" />
                <span>{pattern.en}</span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {pattern.tip}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-border/70 bg-muted/20 p-3">
          <p className="text-sm font-medium text-foreground">
            Need a sentence fix right now?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            The analyzer below is still available here so learners can test the
            logic bridge with real text.
          </p>
        </div>

        <div className="mt-4">
          <MercyEnglishTab
            roomId={roomId}
            roomTitle={roomTitle}
            contentEn={contentEn}
            englishLevel={englishLevel}
            troubleWords={normalizedTroubleWords}
            onVaultReplay={onVaultReplay}
            onRequestGuideTab={onRequestGuideTab ?? (() => undefined)}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-semibold"
          >
            More logic patterns soon
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EnglishLogicTab;