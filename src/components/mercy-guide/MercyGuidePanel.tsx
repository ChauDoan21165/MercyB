// PATH: src/components/mercy-guide/MercyGuidePanel.tsx

import React from 'react';
import {
  ChevronDown,
  GraduationCap,
  GripHorizontal,
  HelpCircle,
  LifeBuoy,
  Mic,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { CompanionProfile } from '@/services/companion';
import type { SuggestedItem } from '@/services/suggestions';
import type { StudyLogEntry } from '@/services/studyLog';
import { MercyGuideProfileSettings } from '../MercyGuideProfileSettings';
import { MercyTeacherTab } from './MercyTeacherTab';
import { MercySpeakTab } from './MercySpeakTab';
import { MercySuggestTab } from './MercySuggestTab';
import { GrammarWritingTab } from './tabs/grammar-writing/GrammarWritingTab';
import type {
  GrammarWritingTeacherState,
  PronunciationLaunchPayload,
  TeacherWritingTask,
} from './tabs/grammar-writing/types';
import {
  CORNER_HANDLE_SIZE,
  EDGE_HANDLE_THICKNESS,
  MERCY_BLUE_PATH_FORWARD,
  MIN_PANEL_HEIGHT,
  MIN_PANEL_MARGIN,
  MIN_PANEL_WIDTH,
  SIZE_PRESETS,
} from './mercyGuide.constants';
import { getPanelHeightPolicy, getPanelWidthPolicy } from './mercyGuide.utils';
import { MERCY_HOST_IMAGE_SRC } from './shared';
import type { GrammarApiResponse, PathHint } from './types';

type HintKey = keyof typeof MERCY_BLUE_PATH_FORWARD;
type ResizeDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

type MercyGuidePanelProps = {
  isOpen: boolean;
  isGhosted: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
  showSettings: boolean;
  setShowSettings: (value: boolean) => void;
  pathHint: PathHint | null;
  setPathHint: (value: PathHint | null) => void;
  panelRect: { width: number; height: number; right: number; bottom: number };
  bubblePos: { right: number; bottom: number };
  hasEnglishContext: boolean;
  guideTabBottomBuffer: number;
  journeyTitle: string;
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  profile: CompanionProfile;
  suggestions: SuggestedItem[];
  yesterdaySummary?: StudyLogEntry;
  todayTotalMinutes: number;
  hasHeavyMoods: boolean;
  showBreathingScript: boolean;
  breathingStep: number;
  showReframe: boolean;
  setShowBreathingScript: React.Dispatch<React.SetStateAction<boolean>>;
  setBreathingStep: React.Dispatch<React.SetStateAction<number>>;
  setShowReframe: React.Dispatch<React.SetStateAction<boolean>>;
  troubleWords: any[];
  speakPractice: any;
  latestAnalysisResult: GrammarApiResponse | null;
  pendingPronunciationPayload: PronunciationLaunchPayload | null;
  activeTeacherTask: TeacherWritingTask | null;
  latestTeacherWritingState: GrammarWritingTeacherState | null;
  onUpdateInteraction: () => void;
  onOpenGuideFromBubble: () => void;
  onBubblePointerDown: React.PointerEventHandler<HTMLDivElement>;
  onPanelDragStart: React.PointerEventHandler<HTMLDivElement>;
  onResizePointerDown: (
    direction: ResizeDirection,
  ) => React.PointerEventHandler<HTMLDivElement>;
  onSetSizePreset: (size: keyof typeof SIZE_PRESETS) => void;
  onCollapseGuide: () => void;
  onCloseGuide: () => void;
  onTriggerBilingualHint: (hintKey: HintKey) => void;
  onAvatarError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onNavigateSuggestion: (item: SuggestedItem) => void;
  onAnalysisResult: (result: GrammarApiResponse | null) => void;
  onPracticePronunciation: (payload: PronunciationLaunchPayload) => void;
  onTeacherOpenPronunciation: () => void;
  onTeacherOpenWriting: () => void;
  onTeacherWritingStateChange: (state: GrammarWritingTeacherState) => void;
  onSubmitTeacherRevision?: (payload: {
    previousText: string;
    newText: string;
    isRevision: boolean;
    taskType?: string;
    focus?: string;
  }) => Promise<GrammarApiResponse | null>;
  onSaveProfile: (newProfile: Partial<CompanionProfile>) => void;
};

export function MercyGuidePanel({
  isOpen,
  isGhosted,
  activeTab,
  setActiveTab,
  showSettings,
  setShowSettings,
  pathHint,
  setPathHint,
  panelRect,
  bubblePos,
  hasEnglishContext,
  guideTabBottomBuffer,
  journeyTitle,
  roomId,
  roomTitle,
  contentEn,
  profile,
  suggestions,
  yesterdaySummary,
  todayTotalMinutes,
  hasHeavyMoods,
  showBreathingScript,
  breathingStep,
  showReframe,
  setShowBreathingScript,
  setBreathingStep,
  setShowReframe,
  troubleWords,
  speakPractice,
  latestAnalysisResult,
  pendingPronunciationPayload,
  activeTeacherTask,
  latestTeacherWritingState,
  onUpdateInteraction,
  onOpenGuideFromBubble,
  onBubblePointerDown,
  onPanelDragStart,
  onResizePointerDown,
  onSetSizePreset,
  onCollapseGuide,
  onCloseGuide,
  onTriggerBilingualHint,
  onAvatarError,
  onNavigateSuggestion,
  onAnalysisResult,
  onPracticePronunciation,
  onTeacherOpenPronunciation,
  onTeacherOpenWriting,
  onTeacherWritingStateChange,
  onSubmitTeacherRevision,
  onSaveProfile,
}: MercyGuidePanelProps) {
  const widthPolicy = getPanelWidthPolicy();
  const heightPolicy = getPanelHeightPolicy();

  return (
    <>
      {!isOpen && (
        <div
          className="fixed z-40 select-none"
          onPointerDown={onUpdateInteraction}
          style={{
            right: bubblePos.right,
            bottom: bubblePos.bottom,
            touchAction: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
          }}
        >
          <div className="flex flex-col items-center">
            <div
              role="button"
              tabIndex={0}
              onPointerDown={onBubblePointerDown}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenGuideFromBubble();
                }
              }}
              aria-label="Open Mercy Guide"
              className="relative z-10 h-16 w-16 cursor-grab rounded-full bg-pink-200 p-[3px] shadow-xl ring-2 ring-white active:cursor-grabbing"
            >
              <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-b from-pink-100 to-rose-100">
                <img
                  src={MERCY_HOST_IMAGE_SRC}
                  alt="Teacher Mercy"
                  className="pointer-events-none h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  onError={onAvatarError}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full bg-white/10" />
            </div>

            <div className="mt-3 rounded-full bg-white/90 px-4 py-1.5 shadow-md ring-1 ring-black/5">
              <p className="text-[14px] font-extrabold tracking-tight text-black">
                Teacher Mercy
              </p>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className={cn(
            'fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-2xl transition-all duration-300',
            isGhosted ? 'pointer-events-none opacity-40' : 'opacity-100',
          )}
          onPointerDown={onUpdateInteraction}
          style={{
            width: panelRect.width,
            height: panelRect.height,
            right: panelRect.right,
            bottom: panelRect.bottom,
            minWidth: Math.min(MIN_PANEL_WIDTH, panelRect.width),
            minHeight: Math.min(MIN_PANEL_HEIGHT, panelRect.height),
            maxWidth: `min(${widthPolicy.maxWidth}px, calc(100vw - ${MIN_PANEL_MARGIN * 2}px))`,
            maxHeight: `min(${heightPolicy.maxHeight}px, calc(100vh - ${MIN_PANEL_MARGIN * 2}px))`,
          }}
        >
          <div
            className="flex cursor-move flex-col border-b border-border bg-muted/20 px-4 py-3"
            onPointerDown={onPanelDragStart}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-6 items-center justify-center rounded-md text-muted-foreground/70">
                  <GripHorizontal className="h-4 w-4" />
                </div>

                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-pink-100 ring-2 ring-pink-200">
                  <img
                    src={MERCY_HOST_IMAGE_SRC}
                    alt="Mercy Host"
                    className="h-full w-full object-cover object-center"
                    loading="eager"
                    decoding="async"
                    onError={onAvatarError}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-foreground md:text-[20px]">
                    Mercy
                  </h3>
                  <p className="truncate text-sm text-muted-foreground md:text-base">
                    {journeyTitle}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Hồ sơ"
                >
                  <User className="h-4.5 w-4.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={onCollapseGuide}
                  title="Thu gọn"
                >
                  <ChevronDown className="h-4.5 w-4.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={onCloseGuide}
                  title="Đóng"
                >
                  <X className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {(['S', 'M', 'L', 'XL'] as const).map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'h-7 w-9 rounded-md text-[10px] font-bold transition-all',
                    panelRect.width === SIZE_PRESETS[s].width
                      ? 'border-pink-300 bg-pink-100 text-pink-700 shadow-inner'
                      : 'bg-white text-muted-foreground',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetSizePreset(s);
                  }}
                >
                  {s}
                </Button>
              ))}

              <span className="ml-2 text-[10px] font-medium italic text-muted-foreground">
                Drag handles to resize
              </span>
            </div>
          </div>

          {showSettings && (
            <MercyGuideProfileSettings
              onClose={() => setShowSettings(false)}
              onSaved={onSaveProfile}
            />
          )}

          {!showSettings && (
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v);
                onTriggerBilingualHint('switching');
              }}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="shrink-0 px-3 pt-3 md:px-4 md:pt-4">
                <TabsList className="flex h-[58px] w-full items-stretch gap-2 rounded-xl border border-border/60 bg-muted/50 p-1.5 shadow-sm md:h-[62px] md:p-2">
                  <TabsTrigger value="teacher" className={tabClassName('teacher')}>
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <span className="block text-center leading-tight">
                      Your
                      <br />
                      Journey
                    </span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="english"
                    className={tabClassName('english', hasEnglishContext)}
                  >
                    <span className="block text-center leading-tight">
                      Grammar &amp;
                      <br />
                      Writing
                    </span>
                  </TabsTrigger>

                  <TabsTrigger value="speak" className={tabClassName('speak')}>
                    <Mic className="h-4 w-4 shrink-0" />
                    <span className="block text-center leading-tight">Pronunciation</span>
                  </TabsTrigger>

                  <TabsTrigger value="suggest" className={tabClassName('suggest')}>
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="block text-center leading-tight">
                      English
                      <br />
                      Logic
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div
                className="relative min-h-0 flex-1 overflow-hidden"
                style={{
                  paddingBottom: `calc(${guideTabBottomBuffer}px + env(safe-area-inset-bottom, 0px))`,
                }}
              >
                {pathHint && (
                  <div className="absolute inset-x-4 top-4 z-[100] animate-in fade-in slide-in-from-top-2 rounded-lg border border-pink-100 bg-pink-50/95 p-3 shadow-md backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2">
                        <HelpCircle className="h-5 w-5 text-pink-600" />
                        <div>
                          <p className="text-sm font-bold leading-tight text-pink-900">
                            {pathHint.en}
                          </p>
                          <p className="mt-1 text-xs font-light italic text-pink-700">
                            {pathHint.vi}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setPathHint(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'teacher' && (
                  <MercyTeacherTab
                    profile={profile}
                    yesterdaySummary={yesterdaySummary}
                    todayTotalMinutes={todayTotalMinutes}
                    hasHeavyMoods={hasHeavyMoods}
                    suggestions={suggestions}
                    showBreathingScript={showBreathingScript}
                    breathingStep={breathingStep}
                    showReframe={showReframe}
                    setShowBreathingScript={setShowBreathingScript}
                    setBreathingStep={setBreathingStep}
                    setShowReframe={setShowReframe}
                    onNavigateSuggestion={onNavigateSuggestion}
                    decision={latestAnalysisResult?.decision}
                    practice={latestAnalysisResult?.practice}
                    writingMode={latestAnalysisResult?.writingMode}
                    paragraphAnalysis={latestAnalysisResult?.paragraphAnalysis}
                    memory={latestAnalysisResult?.memory}
                    teacherTask={activeTeacherTask ?? undefined}
                    latestTeacherWritingState={latestTeacherWritingState ?? undefined}
                    onOpenPronunciation={onTeacherOpenPronunciation}
                    onOpenWriting={onTeacherOpenWriting}
                    onSubmitTeacherRevision={onSubmitTeacherRevision}
                  />
                )}

                {activeTab === 'english' && (
                  <GrammarWritingTab
                    roomId={roomId}
                    roomTitle={roomTitle}
                    contentEn={contentEn}
                    englishLevel={profile.english_level}
                    onAnalysisResult={onAnalysisResult}
                    onPracticePronunciation={onPracticePronunciation}
                    teacherTask={activeTeacherTask ?? undefined}
                    onTeacherWritingStateChange={onTeacherWritingStateChange}
                  />
                )}

                {activeTab === 'speak' && (
                  <MercySpeakTab
                    roomId={roomId}
                    contentEn={contentEn}
                    profile={profile}
                    troubleWords={troubleWords}
                    speakPractice={speakPractice}
                    launchPayload={pendingPronunciationPayload}
                  />
                )}

                {activeTab === 'suggest' && (
                  <MercySuggestTab
                    suggestions={suggestions}
                    onNavigateSuggestion={onNavigateSuggestion}
                  />
                )}
              </div>
            </Tabs>
          )}

          {!showSettings && (
            <div className="flex items-center justify-between border-t bg-muted/10 px-4 py-2.5">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-pink-200 bg-white text-[10px] font-bold"
                  onClick={() => onTriggerBilingualHint('navigation')}
                >
                  <Sparkles className="mr-1.5 h-3 w-3" />
                  Hướng dẫn
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-blue-200 bg-white text-[10px] font-bold"
                  onClick={() => onTriggerBilingualHint('idle')}
                >
                  <LifeBuoy className="mr-1.5 h-3 w-3" />
                  Cần giúp?
                </Button>
              </div>

              <p className="text-[10px] font-medium text-muted-foreground">
                Advisor Standard v4.8
              </p>
            </div>
          )}

          <HandleDecorations onResizePointerDown={onResizePointerDown} />
        </div>
      )}
    </>
  );
}

function tabClassName(
  tab: 'teacher' | 'english' | 'speak' | 'suggest',
  hasEnglishContext = true,
) {
  const base =
    'flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 font-semibold transition-all';
  const size =
    tab === 'english' || tab === 'suggest'
      ? 'text-[10px] md:text-[11px]'
      : 'text-[11px] md:text-[12px]';
  const state =
    tab === 'english' && !hasEnglishContext
      ? 'border-transparent text-muted-foreground/70 opacity-70'
      : 'border-transparent text-muted-foreground opacity-80';

  return cn(
    base,
    size,
    state,
    'data-[state=active]:border-border data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:opacity-100 data-[state=active]:shadow-sm',
    'data-[state=inactive]:hover:bg-white/80 data-[state=inactive]:hover:text-foreground',
  );
}

function HandleDecorations({
  onResizePointerDown,
}: {
  onResizePointerDown: (
    direction: ResizeDirection,
  ) => React.PointerEventHandler<HTMLDivElement>;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-3 z-[85] flex justify-center">
        <div className="h-1.5 w-20 rounded-full bg-gray-400/80 shadow-sm" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[85] flex justify-center">
        <div className="h-1.5 w-20 rounded-full bg-gray-400/80 shadow-sm" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-3 z-[85] flex items-center">
        <div className="h-20 w-1.5 rounded-full bg-gray-400/80 shadow-sm" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-3 z-[85] flex items-center">
        <div className="h-20 w-1.5 rounded-full bg-gray-400/80 shadow-sm" />
      </div>

      <div
        className="absolute inset-x-3 top-0 z-[70] touch-none"
        style={{ height: EDGE_HANDLE_THICKNESS, cursor: 'n-resize' }}
        onPointerDown={onResizePointerDown('top')}
      />
      <div
        className="absolute inset-x-3 bottom-0 z-[70] touch-none"
        style={{ height: EDGE_HANDLE_THICKNESS, cursor: 's-resize' }}
        onPointerDown={onResizePointerDown('bottom')}
      />
      <div
        className="absolute inset-y-3 left-0 z-[70] touch-none"
        style={{ width: EDGE_HANDLE_THICKNESS, cursor: 'w-resize' }}
        onPointerDown={onResizePointerDown('left')}
      />
      <div
        className="absolute inset-y-3 right-0 z-[70] touch-none"
        style={{ width: EDGE_HANDLE_THICKNESS, cursor: 'e-resize' }}
        onPointerDown={onResizePointerDown('right')}
      />

      <CornerHandle direction="top-left" onResizePointerDown={onResizePointerDown} />
      <CornerHandle direction="top-right" onResizePointerDown={onResizePointerDown} />
      <CornerHandle direction="bottom-left" onResizePointerDown={onResizePointerDown} />
      <CornerHandle direction="bottom-right" onResizePointerDown={onResizePointerDown} />
    </>
  );
}

function CornerHandle({
  direction,
  onResizePointerDown,
}: {
  direction: Extract<
    ResizeDirection,
    'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  >;
  onResizePointerDown: (
    direction: ResizeDirection,
  ) => React.PointerEventHandler<HTMLDivElement>;
}) {
  const isTop = direction.startsWith('top');
  const isLeft = direction.endsWith('left');
  const cursorMap = {
    'top-left': 'nw-resize',
    'top-right': 'ne-resize',
    'bottom-left': 'sw-resize',
    'bottom-right': 'se-resize',
  } as const;

  return (
    <div
      className={cn(
        'absolute z-[80] flex touch-none',
        isTop ? 'top-0 items-start' : 'bottom-0 items-end',
        isLeft ? 'left-0 justify-start' : 'right-0 justify-end',
      )}
      style={{
        width: CORNER_HANDLE_SIZE,
        height: CORNER_HANDLE_SIZE,
        cursor: cursorMap[direction],
      }}
      onPointerDown={onResizePointerDown(direction)}
    >
      <div
        className={cn(
          'h-2.5 w-2.5 rounded-full border border-border/70 bg-background shadow-sm',
          isTop ? 'mt-1' : 'mb-1',
          isLeft ? 'ml-1' : 'mr-1',
        )}
      />
    </div>
  );
}