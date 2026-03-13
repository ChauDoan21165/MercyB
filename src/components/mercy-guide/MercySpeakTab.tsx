import React from 'react';
import { Loader2, Mic, Play, Square, Volume2 } from 'lucide-react';
import { CompanionProfile } from '@/services/companion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  FALLBACK_PRAISE,
  MAX_SPEAK_ATTEMPTS,
  TroubleWord,
  getSpeakProgressHint,
} from './shared';
import { UseSpeakPracticeResult } from './hooks/useSpeakPractice';

interface MercySpeakTabProps {
  roomId?: string;
  contentEn?: string;
  profile: CompanionProfile;
  troubleWords: TroubleWord[];
  shouldShowWithoutRoom?: boolean;
  speakPractice: UseSpeakPracticeResult;
}

export function MercySpeakTab({
  roomId,
  contentEn,
  profile,
  troubleWords,
  shouldShowWithoutRoom = true,
  speakPractice,
}: MercySpeakTabProps) {
  const speakProgressHint = getSpeakProgressHint(profile);

  const {
    recorder,
    targetPhrase,
    setTargetPhrase,
    isPlayingTarget,
    pronunciationResult,
    isEvaluating,
    speakAttempts,
    speakLimitReached,
    isComparing,
    lastRecordedAudioUrl,
    handlePlayTarget,
    handlePlaySlow,
    handleShadowCompare,
    handleTroubleWordPractice,
    handleRecordToggle,
  } = speakPractice;

  const primaryFocusItem = pronunciationResult?.feedback?.focus_items?.[0];
  const secondaryFocusItems = pronunciationResult?.feedback?.focus_items?.slice(1) || [];

  return (
    <TabsContent value="speak" className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-white px-4 py-3">
        {speakLimitReached ? (
          <div className="space-y-2 py-8 text-center">
            <p className="text-sm text-foreground">Let&apos;s rest your voice a bit.</p>
            <p className="text-xs text-muted-foreground">You can practice more later.</p>
            <p className="mt-4 text-xs text-muted-foreground">
              Mình cho giọng bạn nghỉ một chút nhé. Lát nữa luyện tiếp cũng được.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-2 text-center">
              <p className="text-xs text-muted-foreground">{speakProgressHint.en}</p>
              <p className="text-xs text-muted-foreground/70">{speakProgressHint.vi}</p>
            </div>

            {shouldShowWithoutRoom && !contentEn && !roomId && (
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                <p className="text-sm text-foreground">
                  You can practice here even without opening a room.
                </p>
                <p className="text-xs text-muted-foreground">
                  Bạn vẫn có thể luyện nói ở đây dù chưa mở room.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Practice this phrase:
              </label>
              <Input
                value={targetPhrase}
                onChange={(e) => setTargetPhrase(e.target.value.slice(0, 120))}
                placeholder="Enter a phrase to practice..."
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Luyện cụm từ này:</p>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePlayTarget}
                disabled={!targetPhrase || isPlayingTarget}
              >
                {isPlayingTarget ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Volume2 className="mr-2 h-4 w-4" />
                )}
                Listen / Nghe
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handlePlaySlow}
                disabled={!targetPhrase || isPlayingTarget}
              >
                {isPlayingTarget ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Listen Slow / Nghe chậm
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Listen once or twice before you speak. / Hãy nghe một hai lần trước khi
                nói.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                variant={recorder.status === 'recording' ? 'destructive' : 'default'}
                className="w-full"
                onClick={handleRecordToggle}
                disabled={!targetPhrase || isEvaluating || recorder.status === 'processing'}
              >
                {isEvaluating || recorder.status === 'processing' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Evaluating...
                  </>
                ) : recorder.status === 'recording' ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Tap to stop / Nhấn để dừng
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Tap to record / Nhấn để thu
                  </>
                )}
              </Button>

              {recorder.error && (
                <div className="rounded-lg bg-destructive/10 p-2">
                  <p className="whitespace-pre-line text-xs text-destructive">
                    {recorder.error}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    If you can&apos;t use the mic, you can still read the phrase out loud
                    to yourself. That still helps.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Nếu chưa dùng được micro, bạn vẫn có thể tự đọc câu này thành tiếng.
                    Vậy vẫn có ích lắm.
                  </p>
                </div>
              )}
            </div>

            {pronunciationResult && (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="rounded-lg bg-primary/10 p-3 text-center">
                  <p className="text-sm font-medium text-primary">
                    {pronunciationResult.feedback?.praise_en || FALLBACK_PRAISE.en}
                  </p>
                  <p className="mt-1 text-xs text-primary/70">
                    {pronunciationResult.feedback?.praise_vi || FALLBACK_PRAISE.vi}
                  </p>
                </div>

                <div className="flex justify-center">
                  <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                    Pronunciation clarity: {pronunciationResult.score}/100
                  </span>
                </div>

                {pronunciationResult.transcribedText && (
                  <div className="rounded-lg bg-muted p-2">
                    <p className="mb-1 text-xs text-muted-foreground">I heard:</p>
                    <p className="text-sm">{pronunciationResult.transcribedText}</p>
                  </div>
                )}

                {primaryFocusItem && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-primary">
                      Main thing to notice / Điều chính cần chú ý
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {primaryFocusItem.word}
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {primaryFocusItem.tip_en}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {primaryFocusItem.tip_vi}
                    </p>
                  </div>
                )}

                {secondaryFocusItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground">
                      More to practice / Luyện thêm:
                    </p>
                    {secondaryFocusItems.map((item, idx) => (
                      <div key={idx} className="rounded-lg bg-secondary/30 p-2">
                        <p className="text-sm font-semibold text-primary">{item.word}</p>
                        <p className="mt-1 text-xs text-foreground">{item.tip_en}</p>
                        <p className="text-xs text-muted-foreground">{item.tip_vi}</p>
                      </div>
                    ))}
                  </div>
                )}

                {lastRecordedAudioUrl && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShadowCompare}
                    disabled={isComparing}
                  >
                    {isComparing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Comparing voices... / Đang so sánh giọng...
                      </>
                    ) : (
                      <>
                        <Volume2 className="mr-2 h-4 w-4" />
                        Hear the Difference / Nghe sự khác biệt
                      </>
                    )}
                  </Button>
                )}

                {pronunciationResult.feedback?.encouragement_en && (
                  <div className="rounded-lg bg-primary/5 p-3 text-center">
                    <p className="text-sm text-primary">
                      {pronunciationResult.feedback.encouragement_en}
                    </p>
                    {pronunciationResult.feedback?.encouragement_vi && (
                      <p className="text-xs text-primary/70">
                        {pronunciationResult.feedback.encouragement_vi}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {troubleWords.length > 0 && (
              <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Trouble Words / Từ cần luyện thêm
                  </p>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                    {troubleWords.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {troubleWords.map((item, idx) => (
                    <button
                      key={`${item.word}-${idx}`}
                      type="button"
                      onClick={() => handleTroubleWordPractice(item.word)}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs transition-colors',
                        item.lastScore < 50
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : item.lastScore < 80
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      )}
                      title={
                        item.tipEn
                          ? `${item.tipEn}${item.tipVi ? ` — ${item.tipVi}` : ''}`
                          : undefined
                      }
                    >
                      {item.word} ×{item.count}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Tap a word to practice it again. / Chạm vào từ để luyện lại.
                </p>
              </div>
            )}

            <p className="pt-2 text-center text-xs text-muted-foreground">
              {MAX_SPEAK_ATTEMPTS - speakAttempts} attempts remaining this session
            </p>
          </div>
        )}
      </ScrollArea>
    </TabsContent>
  );
}