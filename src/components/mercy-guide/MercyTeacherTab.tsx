// src/components/mercy-guide/MercyTeacherTab.tsx

import React, { useState, useEffect } from 'react';
import { Wind, Mic, MicOff, Sparkles, Volume2, Ear } from 'lucide-react';
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
import { 
  findApprovedMercyGuideReplies, 
  MercyGuideReplyRecord,
  MercyGuideReplyIntent 
} from './mercyGuideReplyLibrary';

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
  // --- Phonology & Teacher State ---
  const [isRecording, setIsRecording] = useState(false);
  const [activeCorrection, setActiveCorrection] = useState<MercyGuideReplyRecord | null>(null);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(15).fill(0));

  // Visualizer Animation Logic
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setVisualizerBars(prev => prev.map(() => Math.floor(Math.random() * 100)));
      }, 100);
    } else {
      setVisualizerBars(new Array(15).fill(0));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const triggerPhonologyCorrection = (intent: MercyGuideReplyIntent) => {
    const replies = findApprovedMercyGuideReplies(intent, 'vi');
    if (replies.length > 0) {
      setActiveCorrection(replies[0]);
    }
    setIsRecording(false);
  };

  return (
    <TabsContent value="teacher" className="m-0 flex-1 overflow-hidden flex flex-col">
      <ScrollArea className="flex-1 bg-white px-4 py-3">
        <div className="space-y-4">
          
          {/* 1. Header & Greeting */}
          <div className="space-y-2 rounded-lg bg-primary/5 p-3">
            <p className="text-sm font-medium text-foreground">
              {profile.preferred_name
                ? `Hi ${profile.preferred_name}, Teacher Mercy is here for you.`
                : 'Hi, Teacher Mercy is here for you.'}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {profile.preferred_name
                ? `Chào ${profile.preferred_name}, Mercy đang nghe đây.`
                : 'Chào bạn, Mercy đang nghe đây.'}
            </p>
          </div>

          {/* 2. Phonology Correction Display (The Soul) */}
          {activeCorrection && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Teacher's Coaching</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {activeCorrection.reply}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => setActiveCorrection(null)}>
                    Got it / Đã hiểu
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Quick Practice Targets */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Final S/T', intent: 'phonology_final_consonants' as MercyGuideReplyIntent },
              { label: 'Rhythm', intent: 'phonology_schwa' as MercyGuideReplyIntent },
              { label: 'Vowels', intent: 'phonology_diphthongs' as MercyGuideReplyIntent }
            ].map((target) => (
              <button 
                key={target.label}
                onClick={() => triggerPhonologyCorrection(target.intent)}
                className="flex flex-col items-center justify-center rounded-lg border border-muted p-2 hover:bg-muted/50 transition-colors"
              >
                <Ear className="h-4 w-4 mb-1 text-muted-foreground" />
                <span className="text-[10px] font-medium">{target.label}</span>
              </button>
            ))}
          </div>

          {/* 4. Progress Summary (Yesterday/Today) */}
          <div className="space-y-2">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Progress Tracking</p>
              {yesterdaySummary ? (
                <p className="text-sm mt-1">Yesterday you studied <span className="font-medium">{yesterdaySummary.topic_en}</span>.</p>
              ) : (
                <p className="text-sm mt-1">No log from yesterday, let&apos;s build one today!</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {todayTotalMinutes > 0 ? `You spent ${todayTotalMinutes} mins here today.` : "Let's start with 5–10 minutes."}
              </p>
            </div>
          </div>

          {/* 5. Compassion & Heavy Mood Logic */}
          {hasHeavyMoods && (
            <div className="rounded-lg bg-primary/10 p-3 text-center">
              <p className="text-sm text-primary">{COMPASSIONATE_HEAVY_MOOD_MESSAGE.en}</p>
              <p className="mt-1 text-xs text-primary/70">{COMPASSIONATE_HEAVY_MOOD_MESSAGE.vi}</p>
            </div>
          )}

          {/* 6. Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-2 rounded-lg bg-secondary/30 p-3">
              <p className="text-xs font-medium text-foreground">Suggested for today:</p>
              <p className="text-sm font-medium">{suggestions[0].title_en}</p>
              <p className="text-xs text-muted-foreground">{suggestions[0].reason_en}</p>
              <Button size="sm" className="mt-2 w-full" onClick={() => onNavigateSuggestion(suggestions[0])}>
                Study this now / Học cái này ngay
              </Button>
            </div>
          )}

          {/* 7. Breathing & Wellness (Integrated) */}
          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Feeling heavy or stressed?</p>
              <p className="text-xs text-muted-foreground">Đang thấy nặng hay căng thẳng?</p>
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
                Breathe for 1 minute / Thở 1 phút
              </Button>
            ) : (
              <div className="space-y-3">
                {!showReframe ? (
                  <>
                    <div className="space-y-2">
                      {BREATHING_SCRIPT_SHORT.en.slice(0, breathingStep + 1).map((line, idx) => (
                        <div key={idx} className={cn('rounded p-2', idx === breathingStep ? 'bg-primary/10' : 'bg-muted/50')}>
                          <p className="text-sm">{line}</p>
                          <p className="text-xs text-muted-foreground">{BREATHING_SCRIPT_SHORT.vi[idx]}</p>
                        </div>
                      ))}
                    </div>
                    {breathingStep < BREATHING_SCRIPT_SHORT.en.length - 1 ? (
                      <Button size="sm" variant="secondary" className="w-full" onClick={() => setBreathingStep(prev => prev + 1)}>
                        Next step / Bước tiếp
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full" onClick={() => setShowReframe(true)}>Done / Xong</Button>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2 rounded-lg bg-primary/5 p-3">
                      {POSITIVE_REFRAME_SHORT.en.map((line, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-primary">{line}</p>
                          <p className="text-xs text-primary/70">{POSITIVE_REFRAME_SHORT.vi[idx]}</p>
                        </div>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => {
                      setShowBreathingScript(false);
                      setShowReframe(false);
                    }}>Close / Đóng</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* 8. Recording Control & Visualizer (Fixed at Bottom) */}
      <div className="border-t bg-white p-4 pb-8">
        <div className="mb-4 flex items-end justify-center gap-1 h-8">
          {visualizerBars.map((height, i) => (
            <div 
              key={i} 
              className={cn("w-1 rounded-full bg-primary transition-all duration-100", isRecording ? "opacity-100" : "opacity-20")}
              style={{ height: `${isRecording ? Math.max(15, height) : 10}%` }}
            />
          ))}
        </div>

        <Button 
          className={cn(
            "w-full h-14 rounded-2xl text-lg font-bold shadow-lg transition-all",
            isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-primary hover:bg-primary/90"
          )}
          onClick={() => setIsRecording(!isRecording)}
        >
          {isRecording ? <><MicOff className="mr-2 h-6 w-6" /> Stop Listening</> : <><Mic className="mr-2 h-6 w-6" /> Start Speaking</>}
        </Button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          {isRecording ? "Mercy is coaching your rhythm..." : "Tap to practice your pronunciation"}
        </p>
      </div>
    </TabsContent>
  );
}

// Done