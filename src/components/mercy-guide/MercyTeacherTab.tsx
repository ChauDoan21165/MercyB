import React from 'react';
import { Wind } from 'lucide-react';
import { CompanionProfile } from '@/services/companion';
import { SuggestedItem } from '@/services/suggestions';
import { StudyLogEntry } from '@/services/studyLog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  BREATHING_SCRIPT_SHORT,
  POSITIVE_REFRAME_SHORT,
  COMPASSIONATE_HEAVY_MOOD_MESSAGE,
} from '@/data/breathing_scripts_en_vi';

interface MercyTeacherTabProps {
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
}

export function MercyTeacherTab({
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
}: MercyTeacherTabProps) {
  return (
    <TabsContent value="teacher" className="m-0 flex-1 overflow-hidden">
      <ScrollArea className="h-full bg-white px-4 py-3">
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg bg-primary/5 p-3">
            <p className="text-sm font-medium text-foreground">
              {profile.preferred_name
                ? `Hi ${profile.preferred_name}, here is where we are.`
                : 'Hi, here is where we are.'}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile.preferred_name
                ? `Chào ${profile.preferred_name}, đây là chặng mình đang đi.`
                : 'Chào bạn, đây là chặng mình đang đi.'}
            </p>
          </div>

          <div className="space-y-1 rounded-lg bg-muted p-3">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Yesterday
            </p>

            {yesterdaySummary ? (
              <>
                <p className="text-sm">
                  You studied:{' '}
                  <span className="font-medium">{yesterdaySummary.topic_en}</span>{' '}
                  {yesterdaySummary.minutes &&
                    ` (about ${yesterdaySummary.minutes} minutes)`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hôm qua bạn đã học: {yesterdaySummary.topic_vi}
                  {yesterdaySummary.minutes &&
                    ` (khoảng ${yesterdaySummary.minutes} phút)`}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">
                  We don&apos;t have a study log from yesterday. That&apos;s okay.
                </p>
                <p className="text-xs text-muted-foreground">
                  Hôm qua mình không có ghi nhận buổi học nào. Không sao cả.
                </p>
              </>
            )}
          </div>

          <div className="space-y-1 rounded-lg bg-muted p-3">
            <p className="text-xs font-medium uppercase text-muted-foreground">Today</p>

            {todayTotalMinutes > 0 ? (
              <>
                <p className="text-sm">
                  You already spent about{' '}
                  <span className="font-medium">{todayTotalMinutes} minutes</span> here.
                </p>
                <p className="text-xs text-muted-foreground">
                  Hôm nay bạn đã ở đây khoảng {todayTotalMinutes} phút rồi.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">Today we can start with just 5–10 minutes.</p>
                <p className="text-xs text-muted-foreground">
                  Hôm nay mình chỉ cần bắt đầu với 5–10 phút thôi.
                </p>
              </>
            )}
          </div>

          {hasHeavyMoods && (
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-sm text-primary">
                {COMPASSIONATE_HEAVY_MOOD_MESSAGE.en}
              </p>
              <p className="mt-1 text-xs text-primary/70">
                {COMPASSIONATE_HEAVY_MOOD_MESSAGE.vi}
              </p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-2 rounded-lg bg-secondary/30 p-3">
              <p className="text-xs font-medium text-foreground">Suggested for today:</p>
              <div>
                <p className="text-sm font-medium">{suggestions[0].title_en}</p>
                <p className="text-xs text-muted-foreground">{suggestions[0].title_vi}</p>
              </div>
              <p className="text-xs text-foreground/80">{suggestions[0].reason_en}</p>
              <p className="text-xs text-muted-foreground">{suggestions[0].reason_vi}</p>

              <Button
                size="sm"
                className="mt-2 w-full"
                onClick={() => onNavigateSuggestion(suggestions[0])}
              >
                Study this today / Học cái này hôm nay
              </Button>
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Feeling heavy or stressed?
              </p>
              <p className="text-xs text-muted-foreground">
                Đang thấy nặng hay căng thẳng?
              </p>
            </div>

            {!showBreathingScript ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowBreathingScript(true);
                  setBreathingStep(0);
                  setShowReframe(false);
                }}
              >
                <Wind className="mr-2 h-4 w-4" />
                Guide me to breathe for 1 minute
              </Button>
            ) : (
              <div className="space-y-3">
                {!showReframe ? (
                  <>
                    <div className="space-y-2">
                      {BREATHING_SCRIPT_SHORT.en
                        .slice(0, breathingStep + 1)
                        .map((line, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'rounded p-2 transition-all',
                              idx === breathingStep ? 'bg-primary/10' : 'bg-muted/50'
                            )}
                          >
                            <p className="text-sm">{line}</p>
                            <p className="text-xs text-muted-foreground">
                              {BREATHING_SCRIPT_SHORT.vi[idx]}
                            </p>
                          </div>
                        ))}
                    </div>

                    {breathingStep < BREATHING_SCRIPT_SHORT.en.length - 1 ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        onClick={() => setBreathingStep((prev) => prev + 1)}
                      >
                        Next step / Bước tiếp
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => setShowReframe(true)}
                      >
                        Done / Xong
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="space-y-2 rounded-lg bg-primary/5 p-3">
                      {POSITIVE_REFRAME_SHORT.en.map((line, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-primary">{line}</p>
                          <p className="text-xs text-primary/70">
                            {POSITIVE_REFRAME_SHORT.vi[idx]}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowBreathingScript(false);
                        setBreathingStep(0);
                        setShowReframe(false);
                      }}
                    >
                      Close / Đóng
                    </Button>
                  </>
                )}
              </div>
            )}

            {!showBreathingScript && (
              <p className="text-center text-xs text-muted-foreground">
                Dẫn mình thở 1 phút
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </TabsContent>
  );
}