import React from 'react';
import {
  Loader2,
  Mic,
  Play,
  Square,
  Volume2,
  Languages,
  Repeat2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { CompanionProfile } from '@/services/companion';
import { cn } from '@/lib/utils';

import { UseSpeakPracticeResult } from './hooks/useSpeakPractice';
import {
  FALLBACK_PRAISE,
  MAX_SPEAK_ATTEMPTS,
  TroubleWord,
  getSpeakProgressHint,
} from './shared';

interface MercySpeakTabProps {
  roomId?: string;
  contentEn?: string;
  profile: CompanionProfile;
  troubleWords: TroubleWord[];
  shouldShowWithoutRoom?: boolean;
  speakPractice: UseSpeakPracticeResult;
}

function clampScore(value: unknown): number | null {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function getScoreBand(score: number | null) {
  if (score === null) return null;
  if (score >= 90) return 'Rất tốt';
  if (score >= 75) return 'Khá tốt';
  if (score >= 60) return 'Đang tiến bộ';
  return 'Cần luyện thêm';
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
    trimmedTargetPhrase,
    canRecord,
    recordDisabledReason,
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

  const maybeExtended =
    speakPractice as UseSpeakPracticeResult & {
      evaluationError?: string | null;
      activePlaybackMode?: 'normal' | 'slow' | null;
      isNormalPlaybackActive?: boolean;
      isSlowPlaybackActive?: boolean;
    };

  const evaluationError = maybeExtended.evaluationError ?? null;
  const activePlaybackMode = maybeExtended.activePlaybackMode ?? null;

  const isNormalPlaybackActive =
    typeof maybeExtended.isNormalPlaybackActive === 'boolean'
      ? maybeExtended.isNormalPlaybackActive
      : isPlayingTarget && activePlaybackMode === 'normal';

  const isSlowPlaybackActive =
    typeof maybeExtended.isSlowPlaybackActive === 'boolean'
      ? maybeExtended.isSlowPlaybackActive
      : isPlayingTarget && activePlaybackMode === 'slow';

  const effectivePhrase =
    typeof trimmedTargetPhrase === 'string'
      ? trimmedTargetPhrase
      : targetPhrase.trim();

  const primaryFocusItem = pronunciationResult?.feedback?.focus_items?.[0];
  const secondaryFocusItems =
    pronunciationResult?.feedback?.focus_items?.slice(1) || [];
  const hasPhrase = Boolean(effectivePhrase);

  const displayedTroubleWords = React.useMemo(() => {
    const troubleWordMap = new Map(
      troubleWords.map((word) => [word.word.toLowerCase(), word] as const)
    );

    const latestFocusWords =
      pronunciationResult?.feedback?.focus_items
        ?.map((item) => troubleWordMap.get(item.word.toLowerCase()))
        .filter((item): item is TroubleWord => Boolean(item)) || [];

    if (latestFocusWords.length === 0) {
      return troubleWords.slice(0, 8);
    }

    const seen = new Set<string>();
    const merged: TroubleWord[] = [];

    latestFocusWords.forEach((item) => {
      const key = item.word.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(item);
    });

    troubleWords.forEach((item) => {
      const key = item.word.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(item);
    });

    return merged.slice(0, 8);
  }, [troubleWords, pronunciationResult]);

  const canShowCompareButton =
    Boolean(lastRecordedAudioUrl) && Boolean(effectivePhrase);

  const isRecordDisabled =
    typeof canRecord === 'boolean'
      ? !canRecord && recorder.status !== 'recording'
      : isEvaluating || recorder.status === 'processing';

  const realScore = clampScore(pronunciationResult?.score);
  const scoreBand = getScoreBand(realScore);

  const praiseEn =
    pronunciationResult?.feedback?.praise_en || FALLBACK_PRAISE.en;
  const praiseVi =
    pronunciationResult?.feedback?.praise_vi || FALLBACK_PRAISE.vi;

  return (
    <TabsContent value="speak" className="m-0 h-full flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto bg-white px-5 py-4">
        {speakLimitReached ? (
          <div className="space-y-3 py-10 text-center">
            <p className="text-base font-medium text-foreground">
              Let&apos;s rest your voice a bit.
            </p>
            <p className="text-sm text-muted-foreground">
              You can practice more later.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Mình cho giọng bạn nghỉ một chút nhé. Lát nữa luyện tiếp cũng được.
            </p>
          </div>
        ) : (
          <div className="space-y-5 pb-5">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-base font-semibold text-foreground">Start here</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Type or paste a word or short sentence, then tap Record and say
                it out loud. / Nhập một từ hoặc câu ngắn, rồi nhấn Record và nói
                thành tiếng.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-primary/20 bg-white p-4 shadow-sm">
              <label className="text-base font-medium text-foreground">
                Type or paste a word or short sentence
              </label>

              <Input
                value={targetPhrase}
                onChange={(e) => setTargetPhrase(e.target.value.slice(0, 120))}
                placeholder="Example: I would like a cup of tea"
                className="h-11 text-base"
              />

              <p className="text-sm text-muted-foreground">
                Paste one short phrase here first. / Dán hoặc nhập một câu ngắn ở
                đây trước nhé.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-base font-medium text-foreground">
                {hasPhrase
                  ? 'Now tap Record and say the phrase out loud.'
                  : 'After you enter a phrase above, tap Record and say it out loud.'}
              </p>

              <p className="text-sm text-muted-foreground">
                Speak one short phrase at a time. / Mỗi lần mình nói một cụm ngắn
                thôi nhé.
              </p>

              <Button
                variant={
                  recorder.status === 'recording' ? 'destructive' : 'default'
                }
                className="h-12 w-full text-base"
                onClick={handleRecordToggle}
                disabled={isRecordDisabled}
                title={isRecordDisabled ? recordDisabledReason || undefined : undefined}
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

              {!hasPhrase && (
                <p className="text-center text-sm text-muted-foreground">
                  Add a word or short sentence above to start recording. / Nhập
                  từ hoặc câu ngắn ở trên để bắt đầu thu âm.
                </p>
              )}

              {recordDisabledReason &&
                !recorder.error &&
                isRecordDisabled &&
                recorder.status !== 'recording' && (
                  <p className="text-center text-sm text-muted-foreground">
                    {recordDisabledReason}
                  </p>
                )}

              {recorder.status === 'recording' && (
                <p className="text-center text-sm text-emerald-600">
                  Recording now... speak clearly. / Đang thu âm... nói rõ nhé.
                </p>
              )}

              {recorder.error && (
                <div className="rounded-lg bg-destructive/10 p-3">
                  <p className="whitespace-pre-line text-sm text-destructive">
                    {recorder.error}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    If you can&apos;t use the mic, you can still read the phrase
                    out loud to yourself. That still helps.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Nếu chưa dùng được micro, bạn vẫn có thể tự đọc câu này thành
                    tiếng. Vậy vẫn có ích lắm.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-muted/40 p-3 text-center">
              <p className="text-sm text-muted-foreground">
                {speakProgressHint.en}
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                {speakProgressHint.vi}
              </p>
            </div>

            {shouldShowWithoutRoom && !contentEn && !roomId && (
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                <p className="text-base text-foreground">
                  You can practice here even without opening a room.
                </p>
                <p className="text-sm text-muted-foreground">
                  Bạn vẫn có thể luyện nói ở đây dù chưa mở room.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                Optional: tap Listen first if you want to hear the phrase. / Bạn
                có thể nhấn Listen trước nếu muốn nghe mẫu.
              </p>

              <Button
                variant="outline"
                className="h-11 w-full text-base"
                onClick={() => void handlePlayTarget()}
                disabled={!hasPhrase || isPlayingTarget}
              >
                {isNormalPlaybackActive ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Volume2 className="mr-2 h-4 w-4" />
                )}
                Listen / Nghe
              </Button>

              <Button
                variant="outline"
                className="h-11 w-full text-base"
                onClick={() => void handlePlaySlow()}
                disabled={!hasPhrase || isPlayingTarget}
              >
                {isSlowPlaybackActive ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Listen Slow / Nghe chậm
              </Button>

              <Button
                variant="outline"
                className="h-11 w-full text-base"
                onClick={() => void handleShadowCompare()}
                disabled={!canShowCompareButton || isComparing}
              >
                {isComparing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing Host vs You... / Đang so sánh Host và bạn...
                  </>
                ) : (
                  <>
                    <Repeat2 className="mr-2 h-4 w-4" />
                    Compare Host vs You / So sánh Host và bạn
                  </>
                )}
              </Button>

              {!canShowCompareButton && (
                <p className="text-center text-sm text-muted-foreground">
                  Record one phrase first to compare your voice with the Host. /
                  Hãy thu một câu trước để so sánh giọng của bạn với Host.
                </p>
              )}
            </div>

            {evaluationError && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-base font-medium text-amber-800">
                  Pronunciation score is temporarily unavailable
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  The comparison tools still work, but the server did not return a
                  valid clarity score for this attempt.
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  Chức năng so sánh vẫn dùng được, nhưng máy chủ chưa trả về điểm
                  rõ âm hợp lệ cho lần này.
                </p>
              </div>
            )}

            {pronunciationResult && !evaluationError && (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="rounded-lg bg-primary/10 p-4 text-center">
                  <p className="text-base font-medium text-primary">
                    {praiseEn}
                  </p>
                  <p className="mt-1 text-sm text-primary/70">
                    {praiseVi}
                  </p>
                </div>

                {realScore !== null && (
                  <div className="flex justify-center">
                    <div className="rounded-xl bg-secondary px-4 py-3 text-center text-secondary-foreground">
                      <p className="text-xs uppercase tracking-wide opacity-70">
                        Accuracy
                      </p>
                      <p className="text-xl font-semibold">
                        {realScore}/100
                      </p>
                      {scoreBand && (
                        <p className="text-sm opacity-80">{scoreBand}</p>
                      )}
                    </div>
                  </div>
                )}

                {pronunciationResult.transcribedText && (
                  <div className="rounded-lg bg-muted p-3">
                    <p className="mb-1 text-sm text-muted-foreground">I heard:</p>
                    <p className="text-base">
                      {pronunciationResult.transcribedText}
                    </p>
                  </div>
                )}

                {primaryFocusItem && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-medium uppercase tracking-wide text-primary">
                      Main thing to notice / Điều chính cần chú ý
                    </p>
                    <p className="mt-2 text-base font-semibold text-foreground">
                      {primaryFocusItem.word}
                    </p>
                    {primaryFocusItem.tip_en && (
                      <p className="mt-2 text-base text-foreground">
                        {primaryFocusItem.tip_en}
                      </p>
                    )}
                    {primaryFocusItem.tip_vi && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {primaryFocusItem.tip_vi}
                      </p>
                    )}
                  </div>
                )}

                {secondaryFocusItems.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">
                      More to practice / Luyện thêm:
                    </p>

                    {secondaryFocusItems.map((item, idx) => (
                      <div key={idx} className="rounded-lg bg-secondary/30 p-3">
                        <p className="text-base font-semibold text-primary">
                          {item.word}
                        </p>
                        {item.tip_en && (
                          <p className="mt-1 text-sm text-foreground">
                            {item.tip_en}
                          </p>
                        )}
                        {item.tip_vi && (
                          <p className="text-sm text-muted-foreground">
                            {item.tip_vi}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {pronunciationResult.feedback?.encouragement_en && (
                  <div className="rounded-lg bg-primary/5 p-4 text-center">
                    <p className="text-base text-primary">
                      {pronunciationResult.feedback.encouragement_en}
                    </p>
                    {pronunciationResult.feedback?.encouragement_vi && (
                      <p className="mt-1 text-sm text-primary/70">
                        {pronunciationResult.feedback.encouragement_vi}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {troubleWords.length > 0 && (
              <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    Trouble Words / Từ cần luyện thêm
                  </p>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                    {troubleWords.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {displayedTroubleWords.map((item, idx) => (
                    <button
                      key={`${item.word}-${idx}`}
                      type="button"
                      onClick={() => void handleTroubleWordPractice(item.word)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-3 py-2 text-sm transition-colors',
                        'hover:shadow-sm active:scale-[0.99]',
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
                      <Languages className="h-3.5 w-3.5" />
                      <span>{item.word}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pb-2 text-center">
              <p className="text-sm text-muted-foreground">
                {speakAttempts}/{MAX_SPEAK_ATTEMPTS} attempts used
              </p>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
}