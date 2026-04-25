// PATH: src/components/mercy-guide/DailyCoachCard.tsx

/**
 * Path: src/components/mercy-guide/DailyCoachCard.tsx
 */

import React from "react";
import { CheckCircle2, RefreshCw, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CompanionProfile } from "@/services/companion";
import type { TroubleWord } from "./shared";
import type { UseSpeakPracticeResult } from "./hooks/useSpeakPractice";
import { useDailyCoach } from "./hooks/useDailyCoach";
import { DAILY_COACH_COPY } from "./hooks/dailyCoachCopy";

interface DailyCoachCardProps {
  profile: CompanionProfile;
  contentEn?: string;
  troubleWords: TroubleWord[] | any[];
  speakPractice: UseSpeakPracticeResult;
  onOpenSpeak: () => void;
  /**
   * Authenticated user id. When supplied, the card surfaces today's
   * daily challenge + XP earned. Guests/unauthenticated views can omit
   * this and the challenge sub-card is hidden.
   */
  userId?: string | null;
}

export function DailyCoachCard({
  profile,
  contentEn,
  troubleWords,
  speakPractice,
  onOpenSpeak,
  userId,
}: DailyCoachCardProps) {
  const coach = useDailyCoach({
    profile: {
      ...profile,
      preferred_name: profile.preferred_name ?? undefined,
      learning_goal: profile.learning_goal ?? undefined,
      english_level: profile.english_level ?? undefined,
    },
    contentEn,
    troubleWords: troubleWords as any,
    speakPractice: speakPractice as any,
    onOpenSpeak,
    userId,
  });

  const challengeVisible = userId && coach.challenge !== null;
  const challengeKindBadge =
    coach.challenge?.challenge_kind ?? null;
  const challengePromptVi =
    (coach.challenge?.challenge_payload as { prompt_vi?: string } | null)?.prompt_vi ?? null;

  return (
    <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
      {challengeVisible && (
        <div className="mb-3 rounded-lg border border-primary/15 bg-white/80 p-3">
          <div className="flex items-start gap-2">
            <Trophy className="mt-0.5 h-4 w-4 text-primary" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {DAILY_COACH_COPY.challengeHeading.vi}
                </p>
                {challengeKindBadge && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                    {challengeKindBadge}
                  </span>
                )}
              </div>

              {coach.challengeUiState === "loading" && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {DAILY_COACH_COPY.loading.vi}
                </p>
              )}

              {coach.challengeUiState !== "loading" && challengePromptVi && (
                <p className="mt-1 text-sm font-medium text-foreground">
                  {challengePromptVi}
                </p>
              )}

              {coach.challengeUiState === "pending" && (
                <>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {DAILY_COACH_COPY.pendingHint.vi}
                  </p>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => void coach.markChallengeDone()}
                  >
                    {DAILY_COACH_COPY.markDoneCta.vi}
                  </Button>
                </>
              )}

              {coach.challengeUiState === "in-progress" && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {DAILY_COACH_COPY.inProgressLabel.vi}
                </p>
              )}

              {coach.challengeUiState === "done" && (
                <div className="mt-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium text-primary">
                    {DAILY_COACH_COPY.doneLabel.vi}
                    {coach.challengeXpAwarded > 0 && (
                      <>
                        {" · "}
                        {DAILY_COACH_COPY.earnedXp(coach.challengeXpAwarded).vi}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white/80 p-2 shadow-sm">
          {coach.state === "complete" ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <Sparkles className="h-5 w-5 text-primary" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {coach.state === "idle" && (
            <>
              <div className="mt-2 rounded-lg border border-primary/10 bg-white/80 p-3">
                <p className="text-xs font-medium text-muted-foreground">Mercy</p>
                <p className="mt-1 text-sm text-foreground">{coach.personalLine}</p>
              </div>

              <div className="mt-3 rounded-lg bg-white/80 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Today&apos;s phrase
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {coach.phrase}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Say it out loud once.
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={coach.startSpeaking}>Try this phrase</Button>
                <Button variant="ghost" onClick={coach.changePhrase}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Change phrase
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                You only need to say it once.
              </p>
            </>
          )}

          {coach.state === "intro" && (
            <>
              <div className="mt-2 rounded-lg border border-primary/10 bg-white/80 p-3">
                <p className="text-xs font-medium text-muted-foreground">Mercy</p>
                <p className="mt-1 text-sm text-foreground">First, listen once.</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No need to be perfect. Just try once.
                </p>
              </div>

              <div className="mt-3 rounded-lg bg-white/80 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Practice phrase
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {coach.phrase}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={onOpenSpeak}>Record now</Button>
                <Button variant="ghost" onClick={coach.changePhrase}>
                  Change phrase
                </Button>
              </div>
            </>
          )}

          {coach.state === "feedback" && (
            <>
              <div className="mt-2 rounded-lg border border-primary/10 bg-white/80 p-3">
                <p className="text-xs font-medium text-muted-foreground">Mercy</p>
                <p className="mt-1 text-sm text-foreground">
                  {coach.score >= 85 ? "Nice work." : "You did it."}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Clarity: {coach.score}/100
                </p>
              </div>

              <div className="mt-3 rounded-lg bg-white/80 p-3">
                <p className="text-sm text-foreground">{coach.praise}</p>

                {coach.focusWord ? (
                  <>
                    <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                      Today&apos;s word
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {coach.focusWord}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {coach.focusTip}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    That was a strong try.
                  </p>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  onClick={coach.tryOnceMore}
                  disabled={!coach.canRetry}
                  className={cn(!coach.canRetry && "opacity-60")}
                >
                  Try once more
                </Button>
                <Button variant="ghost" onClick={coach.finishToday}>
                  Finish today
                </Button>
              </div>
            </>
          )}

          {coach.state === "complete" && (
            <>
              <div className="mt-2 rounded-lg border border-primary/10 bg-white/80 p-3">
                <p className="text-xs font-medium text-muted-foreground">Mercy</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Nice work today.
                </p>
                <p className="mt-2 text-sm text-foreground">
                  One phrase practiced.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Come back tomorrow for the next one.
                </p>

                {coach.focusWord && (
                  <p className="mt-3 text-sm text-foreground">
                    Focus word today: {coach.focusWord}
                  </p>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="ghost" disabled>
                  Come back tomorrow
                </Button>
                <Button onClick={coach.practiceAnother}>
                  Practice another phrase
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}