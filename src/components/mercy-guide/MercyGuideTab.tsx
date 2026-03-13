import React, { useCallback, useEffect, useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import { GuideArticle } from '@/hooks/useMercyGuide';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { QUICK_BUTTONS } from './shared';
import { useMercyChat } from './hooks/useMercyChat';

interface MercyGuideTabProps {
  articles: Record<string, GuideArticle> | undefined;
  canAskQuestion: () => boolean;
  incrementQuestionCount: () => void;
  getQuestionsRemaining: () => number;
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
  onRequestSpeakTab: () => void;
}

export function MercyGuideTab({
  articles,
  canAskQuestion,
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const guideScrollRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  const {
    messages,
    inputValue,
    setInputValue,
    isAsking,
    handleQuickButton,
    handleAskQuestion,
  } = useMercyChat({
    articles,
    canAskQuestion,
    incrementQuestionCount,
    roomId,
    roomTitle,
    tier,
    pathSlug,
    tags,
    englishLevel,
    learningGoal,
    onRequestSpeakTab,
  });

  const handleGuideScroll = useCallback(() => {
    const viewport = guideScrollRef.current;
    if (!viewport) return;

    const distanceFromBottom =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

    shouldAutoScrollRef.current = distanceFromBottom < 80;
  }, []);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isAsking]);

  const handleAskQuestionWithScroll = useCallback(async () => {
    shouldAutoScrollRef.current = true;
    await handleAskQuestion();
  }, [handleAskQuestion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleAskQuestionWithScroll();
    }
  };

  return (
    <TabsContent
      value="guide"
      className="m-0 flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex flex-wrap gap-1 border-b border-border bg-white px-3 py-2">
        {QUICK_BUTTONS.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleQuickButton(btn.key)}
            className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            {btn.label_en}
          </button>
        ))}
      </div>

      <div
        ref={guideScrollRef}
        onScroll={handleGuideScroll}
        className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-3"
      >
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Click a quick button or type a question below.
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'rounded-lg px-3 py-2 text-sm shadow-sm',
                msg.type === 'user'
                  ? 'ml-8 bg-primary text-primary-foreground'
                  : 'mr-8 border border-border bg-white text-foreground'
              )}
            >
              <p>{msg.content}</p>
              {msg.contentVi && (
                <p className="mt-1 border-t border-current/10 pt-1 text-xs opacity-80">
                  {msg.contentVi}
                </p>
              )}
            </div>
          ))}

          {isAsking && (
            <div className="mr-8 flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Mercy is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Mercy Guide..."
            className="h-9 flex-1 text-sm"
            disabled={isAsking}
          />

          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => void handleAskQuestionWithScroll()}
            disabled={!inputValue.trim() || isAsking}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-1 text-center text-xs text-muted-foreground">
          {getQuestionsRemaining()} questions remaining this hour
        </p>
      </div>
    </TabsContent>
  );
}