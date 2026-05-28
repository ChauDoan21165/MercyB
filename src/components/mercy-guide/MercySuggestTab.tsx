// PATH: src/components/mercy-guide/MercySuggestTab.tsx

import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import type { SuggestedItem } from '@/services/suggestions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MercySuggestTabProps {
  suggestions: SuggestedItem[];
  onNavigateSuggestion: (item: SuggestedItem) => void;
}

export function MercySuggestTab({
  suggestions,
  onNavigateSuggestion,
}: MercySuggestTabProps) {
  return (
    <div className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-white px-4 py-3">
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Gợi ý cho em · Recommended for you
          </h4>

          {suggestions.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Chưa có gợi ý nào. Em vào vài phòng trước nhé.
              <span className="mt-1 block text-xs">
                No suggestions yet. Explore some rooms first!
              </span>
            </p>
          ) : (
            suggestions.map((item, idx) => (
              <div key={idx} className="space-y-2 rounded-lg bg-muted p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{item.title_en}</p>
                    <p className="text-xs text-muted-foreground">{item.title_vi}</p>
                  </div>

                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase text-secondary-foreground">
                    {item.type}
                  </span>
                </div>

                <p className="text-xs text-foreground/80">{item.reason_en}</p>
                <p className="text-xs text-muted-foreground">{item.reason_vi}</p>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-2 w-full"
                  onClick={() => onNavigateSuggestion(item)}
                >
                  <ChevronRight className="mr-1 h-3 w-3" />
                  {item.type === 'path' ? 'Vào lộ trình · Go to path' : 'Vào phòng học · Go to room'}
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default MercySuggestTab;