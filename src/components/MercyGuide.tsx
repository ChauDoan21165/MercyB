import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircleQuestion, X, Send, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMercyGuide, GuideArticle } from '@/hooks/useMercyGuide';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
}

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'article';
  content: string;
  contentVi?: string;
}

const QUICK_BUTTONS = [
  { key: 'what_is_room', label_en: 'What is a room?', label_vi: 'Phòng là gì?' },
  { key: 'how_to_use_room', label_en: 'How to use?', label_vi: 'Cách sử dụng?' },
  { key: 'how_to_use_paths', label_en: 'What is a path?', label_vi: 'Path là gì?' },
  { key: 'where_to_start', label_en: 'Where to start?', label_vi: 'Bắt đầu từ đâu?' },
  { key: 'language_switch', label_en: 'EN & VI', label_vi: 'EN & VI' },
];

const WELCOME_BACK_MESSAGE = {
  en: "Welcome back. We can start from where you are today.",
  vi: "Chào mừng bạn quay lại. Mình sẽ bắt đầu từ chỗ bạn đang đứng hôm nay."
};

const RATE_LIMIT_MESSAGE = {
  en: "Let us pause a bit. You can ask more questions later.",
  vi: "Mình tạm dừng một chút nhé. Bạn có thể hỏi thêm sau."
};

export function MercyGuide({ roomId, roomTitle, tier, pathSlug, tags }: MercyGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  const { 
    articles, 
    isEnabled, 
    canAskQuestion, 
    incrementQuestionCount,
    getQuestionsRemaining 
  } = useMercyGuide();

  // Check for welcome back message on mount
  useEffect(() => {
    if (!isOpen) return;
    
    const lastActiveStr = localStorage.getItem('mb_last_active_at');
    if (lastActiveStr) {
      const lastActive = parseInt(lastActiveStr, 10);
      const daysSince = (Date.now() - lastActive) / (1000 * 60 * 60 * 24);
      if (daysSince > 7) {
        setShowWelcomeBack(true);
      }
    }
  }, [isOpen]);

  const handleQuickButton = useCallback((key: string) => {
    if (!articles || !articles[key]) return;
    
    const article = articles[key] as GuideArticle;
    const newMessage: Message = {
      id: `article-${Date.now()}`,
      type: 'article',
      content: article.body_en,
      contentVi: article.body_vi,
    };
    
    setMessages(prev => [...prev.slice(-4), newMessage]);
  }, [articles]);

  const handleAskQuestion = useCallback(async () => {
    const question = inputValue.trim();
    if (!question || isAsking) return;

    if (!canAskQuestion()) {
      setMessages(prev => [...prev.slice(-4), {
        id: `limit-${Date.now()}`,
        type: 'assistant',
        content: RATE_LIMIT_MESSAGE.en,
        contentVi: RATE_LIMIT_MESSAGE.vi,
      }]);
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question,
    };
    setMessages(prev => [...prev.slice(-4), userMsg]);
    setInputValue('');
    setIsAsking(true);

    try {
      const { data, error } = await supabase.functions.invoke('guide-assistant', {
        body: {
          question,
          roomId,
          roomTitle,
          language: 'en', // Could detect from user preference
          context: {
            tier: tier || 'Free',
            pathSlug,
            tags: tags || [],
          },
        },
      });

      incrementQuestionCount();

      if (error || !data?.ok) {
        throw new Error(data?.error || 'Failed to get response');
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: data.answer,
      };
      setMessages(prev => [...prev.slice(-4), assistantMsg]);

    } catch (err) {
      console.error('Guide assistant error:', err);
      setMessages(prev => [...prev.slice(-4), {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'Sorry, I could not answer that. Please try again.',
        contentVi: 'Xin lỗi, mình không thể trả lời câu đó. Vui lòng thử lại.',
      }]);
    } finally {
      setIsAsking(false);
    }
  }, [inputValue, isAsking, canAskQuestion, incrementQuestionCount, roomId, roomTitle, tier, pathSlug, tags]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
          aria-label="Open Mercy Guide"
        >
          <MessageCircleQuestion className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Need a guide?</span>
        </button>
      )}

      {/* Guide panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[min(360px,calc(100vw-2rem))] max-h-[70vh] bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div>
              <h3 className="font-semibold text-foreground">Mercy Guide</h3>
              <p className="text-xs text-muted-foreground">Ask how to use this app</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Welcome back banner */}
          {showWelcomeBack && (
            <div className="px-4 py-2 bg-primary/10 border-b border-primary/20">
              <p className="text-sm text-primary">{WELCOME_BACK_MESSAGE.en}</p>
              <p className="text-xs text-primary/70">{WELCOME_BACK_MESSAGE.vi}</p>
            </div>
          )}

          {/* Quick buttons */}
          <div className="px-3 py-2 border-b border-border flex flex-wrap gap-1">
            {QUICK_BUTTONS.map(btn => (
              <button
                key={btn.key}
                onClick={() => handleQuickButton(btn.key)}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {btn.label_en}
              </button>
            ))}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Click a quick button or type a question below.
                </p>
              )}
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    msg.type === 'user' 
                      ? "bg-primary text-primary-foreground ml-8" 
                      : "bg-muted text-foreground mr-8"
                  )}
                >
                  <p>{msg.content}</p>
                  {msg.contentVi && (
                    <p className="mt-1 text-xs opacity-80 border-t border-current/10 pt-1">
                      {msg.contentVi}
                    </p>
                  )}
                </div>
              ))}
              {isAsking && (
                <div className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm mr-8 animate-pulse">
                  Thinking...
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="px-3 py-2 border-t border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Mercy Guide..."
                className="flex-1 text-sm h-9"
                disabled={isAsking}
              />
              <Button
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={handleAskQuestion}
                disabled={!inputValue.trim() || isAsking}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {getQuestionsRemaining()} questions remaining this hour
            </p>
          </div>
        </div>
      )}
    </>
  );
}
