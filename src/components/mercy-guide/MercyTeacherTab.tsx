// PATH: src/components/mercy-guide/MercyTeacherTab.tsx

import React, { useMemo } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mic, PenSquare } from 'lucide-react';
import type { GrammarWritingTeacherState, GrammarApiResponse } from './types';

interface Props {
  latestTeacherWritingState?: GrammarWritingTeacherState;
  onOpenPronunciation?: () => void;
  onOpenWriting?: () => void;
}

type TeacherDisplayResult = {
  correctedText?: string;
  enhancedText?: string;
  explanation?: string;
  grammarPoints: string[];
  tense?: string;
};

function mapResult(value?: GrammarApiResponse | null): TeacherDisplayResult | null {
  if (!value) return null;

  return {
    correctedText: value.correctedText,
    enhancedText: value.enhancedText,
    explanation: value.explanation,
    grammarPoints: value.grammarPoints ?? [],
    tense: value.tenseAnalysis?.likelyMainTense ?? undefined,
  };
}

export function MercyTeacherTab({
  latestTeacherWritingState,
  onOpenPronunciation,
  onOpenWriting,
}: Props) {
  const result = useMemo(
    () => mapResult(latestTeacherWritingState?.latestAnalysisResult),
    [latestTeacherWritingState]
  );

  if (!result) {
    return (
      <TabsContent value="teacher" className="m-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full bg-white p-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">API ONLY TEACHER ACTIVE</h2>
            <p className="text-sm text-muted-foreground">
              Submit writing to see grammar analysis from the API.
            </p>

            <div className="flex gap-2">
              <Button onClick={onOpenWriting}>
                <PenSquare className="mr-2 h-4 w-4" />
                Open writing
              </Button>

              <Button variant="outline" onClick={onOpenPronunciation}>
                <Mic className="mr-2 h-4 w-4" />
                Pronunciation
              </Button>
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="teacher" className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-white p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            <h2 className="text-lg font-semibold">API ONLY TEACHER ACTIVE</h2>
          </div>

          {result.correctedText && (
            <section>
              <p className="mb-1 text-xs font-semibold">Corrected text</p>
              <p className="text-sm">{result.correctedText}</p>
            </section>
          )}

          {result.enhancedText && (
            <section>
              <p className="mb-1 text-xs font-semibold">Enhanced version</p>
              <p className="text-sm">{result.enhancedText}</p>
            </section>
          )}

          {result.grammarPoints.length > 0 && (
            <section>
              <p className="mb-1 text-xs font-semibold">Grammar points</p>
              <ul className="list-disc pl-4 text-sm">
                {result.grammarPoints.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </section>
          )}

          {result.tense && (
            <section>
              <p className="mb-1 text-xs font-semibold">Main tense</p>
              <p className="text-sm">{result.tense}</p>
            </section>
          )}

          {result.explanation && (
            <section>
              <p className="mb-1 text-xs font-semibold">Explanation</p>
              <p className="whitespace-pre-line text-sm">{result.explanation}</p>
            </section>
          )}

          <div className="flex gap-2 pt-2">
            <Button onClick={onOpenWriting}>Revise</Button>

            <Button variant="outline" onClick={onOpenPronunciation}>
              <Mic className="mr-2 h-4 w-4" />
              Pronunciation
            </Button>
          </div>
        </div>
      </ScrollArea>
    </TabsContent>
  );
}

export default MercyTeacherTab;