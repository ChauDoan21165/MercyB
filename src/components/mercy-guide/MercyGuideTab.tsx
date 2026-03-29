import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Send, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { getMercyGuideAnswer } from './mercyGuideAnswers';
import {
  detectGuideLanguage,
  resolveMercyGuideReply,
  type GuideArticle,
} from './resolveMercyGuideReply';

interface MercyGuideTabProps {
  articles?: GuideArticle[];
  canAskQuestion?: boolean;
  incrementQuestionCount?: () => void;
  getQuestionsRemaining?: () => number;
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
  onRequestSpeakTab?: () => void;
}

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  language: 'vi' | 'en';
  suggestSpeak?: boolean;
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function cleanText(value?: string | null) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function buildStarterMessage(): ChatMessage {
  return {
    id: makeId(),
    role: 'assistant',
    text: getMercyGuideAnswer('greeting', 'vi'),
    language: 'vi',
    suggestSpeak: false,
  };
}

export function MercyGuideTab({
  articles = [],
  canAskQuestion = true,
  incrementQuestionCount,
  getQuestionsRemaining,
  roomId,
  roomTitle,
  tier,
  pathSlug,
  tags,
  englishLevel,
  learningGoal,
  onRequestSpeakTab,
}: MercyGuideTabProps) {
  const roomKey = useMemo(
    () => [roomId, roomTitle, tier, pathSlug].map((v) => cleanText(v)).join('|'),
    [roomId, roomTitle, tier, pathSlug]
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => [buildStarterMessage()]);
  const [draft, setDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previousRoomKeyRef = useRef(roomKey);
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (previousRoomKeyRef.current !== roomKey) {
      previousRoomKeyRef.current = roomKey;
      setMessages([buildStarterMessage()]);
      setDraft('');
      setIsSubmitting(false);
    }
  }, [roomKey]);

  useEffect(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isSubmitting]);

  const submitMessage = useCallback(() => {
    const input = cleanText(draft);
    if (!input || isSubmitting) return;

    const userLanguage = detectGuideLanguage(input);

    if (!canAskQuestion) {
      const remaining = getQuestionsRemaining?.();

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'user',
          text: input,
          language: userLanguage,
        },
        {
          id: makeId(),
          role: 'assistant',
          text:
            userLanguage === 'vi'
              ? typeof remaining === 'number' && remaining >= 0
                ? `Bạn đã chạm giới hạn câu hỏi hiện tại của Guide. Số lượt còn lại: ${remaining}. Hãy thử lại sau nhé.`
                : 'Bạn đã chạm giới hạn câu hỏi hiện tại của Guide. Hãy thử lại sau nhé.'
              : typeof remaining === 'number' && remaining >= 0
                ? `You have reached the current Guide question limit. Remaining: ${remaining}. Please try again later.`
                : 'You have reached the current Guide question limit. Please try again later.',
          language: userLanguage,
          suggestSpeak: false,
        },
      ]);
      setDraft('');
      return;
    }

    incrementQuestionCount?.();
    setIsSubmitting(true);

    const resolved = resolveMercyGuideReply({
      input,
      roomId,
      roomTitle,
      tier,
      pathSlug,
      tags,
      articles,
      englishLevel,
      learningGoal,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: 'user',
        text: input,
        language: userLanguage,
      },
      {
        id: makeId(),
        role: 'assistant',
        text: resolved.text,
        language: resolved.language,
        suggestSpeak: resolved.suggestSpeak,
      },
    ]);

    setDraft('');
    setIsSubmitting(false);

    if (resolved.suggestSpeak && typeof window !== 'undefined') {
      window.setTimeout(() => {
        onRequestSpeakTab?.();
      }, 250);
    }

    window.setTimeout(() => {
      inputRef.current?.focus();
      const el = messagesScrollRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  }, [
    draft,
    isSubmitting,
    canAskQuestion,
    incrementQuestionCount,
    getQuestionsRemaining,
    roomId,
    roomTitle,
    tier,
    pathSlug,
    tags,
    articles,
    englishLevel,
    learningGoal,
    onRequestSpeakTab,
  ]);

  return (
    <TabsContent
      value="guide"
      className="m-0 flex h-full min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
        <div
          ref={messagesScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-4"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
          }}
        >
          <div
            className="space-y-3"
            style={{
              paddingBottom: 'calc(88px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === 'user'
                    ? 'ml-8 rounded-2xl bg-primary px-4 py-3 text-primary-foreground'
                    : 'mr-8 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-foreground'
                }
              >
                <p className="whitespace-pre-line text-base leading-7">{message.text}</p>

                {message.role === 'assistant' && message.suggestSpeak && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onRequestSpeakTab?.()}
                      className="gap-2 text-sm"
                    >
                      <Volume2 className="h-4 w-4" />
                      Mở Speak
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {isSubmitting && (
              <div className="mr-8 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-foreground">
                <p className="text-base leading-7 text-muted-foreground">
                  Mercy đang nghĩ...
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className="relative z-10 shrink-0 border-t border-border bg-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
          style={{
            paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submitMessage();
                }
              }}
              placeholder="Bạn muốn Mercy giúp gì?"
              className="h-11 min-w-0 flex-1 text-base text-foreground"
              disabled={isSubmitting}
            />

            <Button
              type="button"
              onClick={submitMessage}
              className="h-11 shrink-0 gap-2 px-4 text-base"
              disabled={!cleanText(draft) || isSubmitting}
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Gửi</span>
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}