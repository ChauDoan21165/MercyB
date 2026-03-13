import React from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { VOCAB_VAULT_EMPTY, TroubleWord } from './shared';
import { useEnglishHelper } from './hooks/useEnglishHelper';

interface MercyEnglishTabProps {
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  englishLevel?: string | null;
  troubleWords: TroubleWord[];
  onVaultReplay: (word: string) => void;
}

export function MercyEnglishTab({
  roomId,
  roomTitle,
  contentEn,
  englishLevel,
  troubleWords,
  onVaultReplay,
}: MercyEnglishTabProps) {
  const { isLoadingEnglish, englishResult, handleLearnEnglish } = useEnglishHelper({
    roomId,
    roomTitle,
    contentEn,
    englishLevel,
  });

  return (
    <TabsContent value="english" className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-white px-4 py-3">
        {!contentEn && !roomId ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Open a room to learn English from its content.
          </p>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleLearnEnglish}
              disabled={isLoadingEnglish}
              className="w-full"
              variant="secondary"
            >
              {isLoadingEnglish ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BookOpen className="mr-2 h-4 w-4" />
              )}
              <span className="text-sm">Teach me simple English from this room</span>
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Dạy mình tiếng Anh đơn giản từ phòng này
            </p>

            {englishResult && (
              <div className="mt-4 space-y-4">
                {englishResult.intro_en && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-sm">{englishResult.intro_en}</p>
                    {englishResult.intro_vi && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {englishResult.intro_vi}
                      </p>
                    )}
                  </div>
                )}

                {englishResult.items.map((item, idx) => (
                  <div key={idx} className="space-y-2 rounded-lg bg-secondary/30 p-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-primary">{item.word}</span>
                      <span className="text-sm text-muted-foreground">
                        — {item.meaning_vi}
                      </span>
                    </div>

                    <div className="border-l-2 border-primary/30 pl-2 text-sm">
                      <p>{item.example_en}</p>
                      <p className="text-xs text-muted-foreground">{item.example_vi}</p>
                    </div>
                  </div>
                ))}

                {englishResult.encouragement_en && (
                  <div className="rounded-lg bg-primary/5 p-3 text-center">
                    <p className="text-sm text-primary">
                      {englishResult.encouragement_en}
                    </p>
                    {englishResult.encouragement_vi && (
                      <p className="text-xs text-primary/70">
                        {englishResult.encouragement_vi}
                      </p>
                    )}
                  </div>
                )}

                <p className="pt-2 text-center text-xs text-muted-foreground">
                  You can come back and practice again. / Bạn có thể quay lại luyện tiếp
                  lúc khác.
                </p>
              </div>
            )}

            <div className="rounded-lg border border-border bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  Vocabulary Vault
                </h4>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  {troubleWords.length} items
                </span>
              </div>

              {troubleWords.length === 0 ? (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  {VOCAB_VAULT_EMPTY.en}
                  <br />
                  {VOCAB_VAULT_EMPTY.vi}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {troubleWords.map((item, idx) => (
                    <button
                      key={`${item.word}-${idx}`}
                      onClick={() => onVaultReplay(item.word)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-left text-sm shadow-sm transition-all hover:scale-[1.01]',
                        item.lastScore < 50
                          ? 'border-rose-100 bg-rose-50 text-rose-700'
                          : item.lastScore < 80
                            ? 'border-amber-100 bg-amber-50 text-amber-700'
                            : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.word}</span>
                        <span className="text-[10px] opacity-70">x{item.count}</span>
                      </div>
                      <div className="mt-0.5 text-[10px] opacity-70">
                        Last {item.lastScore}/100
                      </div>
                      {item.tipEn && (
                        <div className="mt-1 text-[10px] opacity-75">{item.tipEn}</div>
                      )}
                      {item.tipVi && (
                        <div className="mt-0.5 text-[10px] opacity-65">{item.tipVi}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </TabsContent>
  );
}