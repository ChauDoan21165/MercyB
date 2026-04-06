import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  User,
  ChevronDown,
  Sparkles,
  MessageCircle,
  Mic,
  Brain,
} from 'lucide-react';
import { MercyTeacherTab } from './MercyTeacherTab';
import { GrammarWritingTab } from './tabs/grammar-writing/GrammarWritingTab';
import PronunciationTab from './tabs/PronunciationTab';
import EnglishLogicTab from './tabs/EnglishLogicTab';

type MercyTabType = 'teacher' | 'grammar' | 'pronunciation' | 'logic';

type FixedMercyGuidePanelProps = {
  isOpen: boolean;
  onClose?: () => void;
  activeTab?: string;
  latestTeacherWritingState?: unknown;
  onTeacherOpenPronunciation?: () => void;
  onTeacherOpenWriting?: () => void;
  onGrammarAnalyze?: (...args: any[]) => void;
  isGrammarAnalyzing?: boolean;
  pathHint?: string | null;

  setActiveTab?: (value: string) => void;
  onCloseGuide?: () => void;
  onCollapseGuide?: () => void;
  onPanelDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onAvatarError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onUpdateInteraction?: () => void;

  roomId?: string;
  contentEn?: string;
  roomTitle?: string;
  profile?: unknown;
  troubleWords?: unknown[];
  speakPractice?: unknown;
  pendingPronunciationPayload?: unknown;
};

const MercyTeacherTabView = MercyTeacherTab as React.ComponentType<any>;
const GrammarWritingTabView = GrammarWritingTab as React.ComponentType<any>;
const PronunciationTabView = PronunciationTab as React.ComponentType<any>;
const EnglishLogicTabView = EnglishLogicTab as React.ComponentType<any>;

function normalizeTab(value: string | undefined): MercyTabType {
  switch (value) {
    case 'teacher':
    case 'grammar':
    case 'pronunciation':
    case 'logic':
      return value;
    case 'english':
      return 'logic';
    case 'speak':
      return 'pronunciation';
    case 'suggest':
      return 'teacher';
    default:
      return 'teacher';
  }
}

export const MercyGuidePanel: React.FC<FixedMercyGuidePanelProps> = ({
  isOpen,
  onClose,
  activeTab: initialTab = 'teacher',
  latestTeacherWritingState,
  onTeacherOpenPronunciation,
  onTeacherOpenWriting,
  onGrammarAnalyze,
  isGrammarAnalyzing = false,
  pathHint,

  setActiveTab,
  onCloseGuide,
  onCollapseGuide,
  onPanelDragStart,
  onAvatarError,
  onUpdateInteraction,

  roomId,
  contentEn,
  roomTitle,
  profile,
  troubleWords,
  speakPractice,
  pendingPronunciationPayload,
}) => {
  const [activeTab, setLocalActiveTab] = useState<MercyTabType>(
    normalizeTab(initialTab)
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalActiveTab(normalizeTab(initialTab));
  }, [initialTab]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const tabs = [
    { id: 'teacher' as const, label: 'Your Journey', icon: Brain },
    { id: 'grammar' as const, label: 'Grammar & Writing', icon: Sparkles },
    { id: 'pronunciation' as const, label: 'Pronunciation', icon: Mic },
    { id: 'logic' as const, label: 'English Logic', icon: MessageCircle },
  ];

  const handleTabChange = (tabId: MercyTabType) => {
    setLocalActiveTab(tabId);
    onUpdateInteraction?.();

    if (setActiveTab) {
      const outgoing =
        tabId === 'logic'
          ? 'english'
          : tabId === 'pronunciation'
            ? 'speak'
            : tabId;

      setActiveTab(outgoing);
    }
  };

  const handleClose = () => {
    if (onCloseGuide) {
      onCloseGuide();
      return;
    }

    onClose?.();
  };

  const handleCollapse = () => {
    if (onCollapseGuide) {
      onCollapseGuide();
      return;
    }

    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="relative flex h-full flex-col border-l border-gray-200 bg-white shadow-2xl">
      <div
        className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white p-4"
        onPointerDown={onPanelDragStart}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/mercy-avatar.png"
              alt="Teacher Mercy"
              className="h-10 w-10 rounded-full border-2 border-purple-100"
              onError={
                onAvatarError
                  ? onAvatarError
                  : (e) => {
                      (e.target as HTMLImageElement).src =
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=mercy';
                    }
              }
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold leading-tight text-gray-800">
              Mercy
            </h2>
            <p className="text-xs text-gray-500">Teacher Mercy</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <User size={20} />
          </button>

          <button
            type="button"
            onClick={handleCollapse}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ChevronDown size={20} />
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {pathHint ? (
        <div className="border-b border-gray-100 bg-purple-50/60 px-4 py-2 text-xs text-purple-700">
          {pathHint}
        </div>
      ) : null}

      <div className="flex gap-1 border-b border-gray-100 bg-gray-50/50 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-all duration-200 ${
                isActive
                  ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-purple-500' : ''} />
              <span className="text-center text-[10px] font-semibold uppercase leading-tight tracking-tight">
                {tab.label.split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    {word}
                    {i === 0 && tab.label.includes(' ') && <br />}
                  </React.Fragment>
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-white">
        <div className="min-h-full p-4">
          {activeTab === 'teacher' && (
            <MercyTeacherTabView
              profile={profile}
              latestTeacherWritingState={latestTeacherWritingState}
              onOpenPronunciation={onTeacherOpenPronunciation}
              onOpenWriting={onTeacherOpenWriting}
            />
          )}

          {activeTab === 'grammar' && (
            <GrammarWritingTabView
              onAnalyze={onGrammarAnalyze}
              isAnalyzing={isGrammarAnalyzing}
              latestState={latestTeacherWritingState}
            />
          )}

          {activeTab === 'pronunciation' && (
            <PronunciationTabView
              roomId={roomId}
              contentEn={contentEn}
              profile={profile}
              troubleWords={troubleWords ?? []}
              speakPractice={speakPractice}
              launchPayload={pendingPronunciationPayload}
            />
          )}

          {activeTab === 'logic' && (
            <EnglishLogicTabView
              roomId={roomId}
              roomTitle={roomTitle}
              contentEn={contentEn}
              troubleWords={troubleWords ?? []}
              onVaultReplay={() => {}}
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-3 text-[10px] text-gray-400">
        <div className="flex gap-4">
          <button
            type="button"
            className="flex items-center gap-1 font-bold uppercase transition-colors hover:text-purple-600"
          >
            <Sparkles size={12} /> Hướng dẫn
          </button>
          <button
            type="button"
            className="flex items-center gap-1 font-bold uppercase transition-colors hover:text-purple-600"
          >
            <Brain size={12} /> Cần giúp?
          </button>
        </div>
        <div className="font-medium">Advisor Standard v4.8</div>
      </div>
    </div>
  );
};

export default MercyGuidePanel;