import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircleQuestion, X, Send, BookOpen, User, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMercyGuide, GuideArticle } from '@/hooks/useMercyGuide';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { CompanionProfile, getCompanionProfile } from '@/services/companion';
import { getSuggestionsForUser, SuggestedItem } from '@/services/suggestions';
import { MercyGuideProfileSettings } from './MercyGuideProfileSettings';
import { useNavigate } from 'react-router-dom';

interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string; // Room content for English helper
}

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'article' | 'english';
  content: string;
  contentVi?: string;
}

interface EnglishHelperResult {
  intro_en: string;
  intro_vi: string;
  items: {
    word: string;
    meaning_vi: string;
    example_en: string;
    example_vi: string;
  }[];
  encouragement_en: string;
  encouragement_vi: string;
}

const QUICK_BUTTONS = [
  { key: 'what_is_room', label_en: 'What is a room?', label_vi: 'Phòng là gì?' },
  { key: 'how_to_use_room', label_en: 'How to use?', label_vi: 'Cách sử dụng?' },
  { key: 'how_to_use_paths', label_en: 'What is a path?', label_vi: 'Path là gì?' },
  { key: 'where_to_start', label_en: 'Where to start?', label_vi: 'Bắt đầu từ đâu?' },
  { key: 'language_switch', label_en: 'EN & VI', label_vi: 'EN & VI' },
];

const RATE_LIMIT_MESSAGE = {
  en: "Let us pause a bit. You can ask more questions later.",
  vi: "Mình tạm dừng một chút nhé. Bạn có thể hỏi thêm sau."
};

function getCheckInMessage(profile: CompanionProfile, lastActiveAt?: string, lastEnglishActivity?: string): { en: string; vi: string } | null {
  const name = profile.preferred_name || 'friend';
  const now = Date.now();
  
  // Check last active
  if (lastActiveAt) {
    const daysSinceActive = (now - new Date(lastActiveAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActive > 7) {
      return {
        en: `${name}, it has been a little while. We can start with something very small today.`,
        vi: `${name} ơi, cũng khá lâu rồi. Hôm nay mình bắt đầu bằng một điều rất nhỏ thôi nhé.`
      };
    }
  }
  
  // Check last English activity
  if (lastEnglishActivity) {
    const daysSinceEnglish = (now - new Date(lastEnglishActivity).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceEnglish > 3) {
      return {
        en: "We have not practiced English together for a few days. One short phrase today is already good.",
        vi: "Mình đã vài ngày chưa luyện tiếng Anh cùng nhau. Chỉ một cụm ngắn hôm nay cũng đã là tốt rồi."
      };
    }
  }
  
  // Default encouraging message
  return {
    en: "You are doing well just by showing up here.",
    vi: "Chỉ cần bạn có mặt ở đây đã là rất tốt rồi."
  };
}

export function MercyGuide({ roomId, roomTitle, tier, pathSlug, tags, contentEn }: MercyGuideProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('guide');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<CompanionProfile>({});
  const [checkInMessage, setCheckInMessage] = useState<{ en: string; vi: string } | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const [isLoadingEnglish, setIsLoadingEnglish] = useState(false);
  const [englishResult, setEnglishResult] = useState<EnglishHelperResult | null>(null);

  const { 
    articles, 
    isEnabled, 
    canAskQuestion, 
    incrementQuestionCount,
    getQuestionsRemaining 
  } = useMercyGuide();

  // Load profile and suggestions when panel opens
  useEffect(() => {
    if (!isOpen) return;
    
    async function loadData() {
      try {
        const profileData = await getCompanionProfile();
        setProfile(profileData);
        
        // Generate check-in message
        const message = getCheckInMessage(
          profileData, 
          profileData.last_english_activity || undefined,
          profileData.last_english_activity || undefined
        );
        setCheckInMessage(message);
        
        // Load suggestions
        const suggestionsData = await getSuggestionsForUser({
          profile: profileData,
          lastRoomId: roomId,
          lastTags: tags,
        });
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Failed to load guide data:', error);
      }
    }
    
    loadData();
  }, [isOpen, roomId, tags]);

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
          language: 'en',
          context: {
            tier: tier || 'Free',
            pathSlug,
            tags: tags || [],
            englishLevel: profile.english_level,
            learningGoal: profile.learning_goal,
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
  }, [inputValue, isAsking, canAskQuestion, incrementQuestionCount, roomId, roomTitle, tier, pathSlug, tags, profile]);

  const handleLearnEnglish = useCallback(async () => {
    if (!contentEn || isLoadingEnglish) return;
    
    setIsLoadingEnglish(true);
    setEnglishResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('guide-english-helper', {
        body: {
          roomId,
          roomTitle,
          language: 'en',
          englishLevel: profile.english_level || 'beginner',
          sourceText: contentEn.slice(0, 1200),
          userQuestion: 'Teach me simple English from this room.',
        },
      });

      if (error || !data?.ok) {
        throw new Error(data?.error || 'Failed to get English help');
      }

      // Parse the JSON response
      try {
        const result = JSON.parse(data.answer) as EnglishHelperResult;
        setEnglishResult(result);
      } catch {
        // If parsing fails, show raw response
        setEnglishResult({
          intro_en: data.answer,
          intro_vi: '',
          items: [],
          encouragement_en: '',
          encouragement_vi: '',
        });
      }
    } catch (err) {
      console.error('English helper error:', err);
      setEnglishResult({
        intro_en: 'Sorry, I could not help with English right now. Please try again.',
        intro_vi: 'Xin lỗi, mình không thể hỗ trợ tiếng Anh lúc này. Vui lòng thử lại.',
        items: [],
        encouragement_en: '',
        encouragement_vi: '',
      });
    } finally {
      setIsLoadingEnglish(false);
    }
  }, [contentEn, isLoadingEnglish, roomId, roomTitle, profile.english_level]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const greeting = profile.preferred_name 
    ? { en: `Hi, ${profile.preferred_name}. How can I help?`, vi: `Chào ${profile.preferred_name}. Mình giúp gì được cho bạn?` }
    : { en: 'Hi! How can I help?', vi: 'Chào bạn! Mình giúp gì được?' };

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
        <div className="fixed bottom-20 right-4 z-50 w-[min(380px,calc(100vw-2rem))] max-h-[75vh] bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div>
              <h3 className="font-semibold text-foreground">Mercy Guide</h3>
              <p className="text-xs text-muted-foreground">{greeting.en}</p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSettings(!showSettings)}
                title="Settings"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Settings panel (overlay) */}
          {showSettings && (
            <MercyGuideProfileSettings 
              onClose={() => setShowSettings(false)}
              onSaved={(newProfile) => setProfile(prev => ({ ...prev, ...newProfile }))}
            />
          )}

          {/* Main content */}
          {!showSettings && (
            <>
              {/* Check-in message */}
              {checkInMessage && (
                <div className="px-4 py-2 bg-primary/5 border-b border-primary/10">
                  <p className="text-sm text-foreground">{checkInMessage.en}</p>
                  <p className="text-xs text-muted-foreground">{checkInMessage.vi}</p>
                </div>
              )}

              {/* Tell me your name link */}
              {!profile.preferred_name && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-xs text-primary hover:underline text-left border-b border-border"
                >
                  Tell me your name →
                </button>
              )}

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid grid-cols-3 mx-3 mt-2">
                  <TabsTrigger value="guide" className="text-xs">
                    <MessageCircleQuestion className="h-3 w-3 mr-1" />
                    Guide
                  </TabsTrigger>
                  <TabsTrigger value="english" className="text-xs" disabled={!contentEn && !roomId}>
                    <BookOpen className="h-3 w-3 mr-1" />
                    English
                  </TabsTrigger>
                  <TabsTrigger value="suggest" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    For You
                  </TabsTrigger>
                </TabsList>

                {/* Guide Tab */}
                <TabsContent value="guide" className="flex-1 flex flex-col overflow-hidden m-0">
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
                </TabsContent>

                {/* English Tab */}
                <TabsContent value="english" className="flex-1 overflow-hidden m-0">
                  <ScrollArea className="h-full px-4 py-3">
                    {!contentEn && !roomId ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Open a room to learn English from its content.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <Button
                          onClick={handleLearnEnglish}
                          disabled={isLoadingEnglish}
                          className="w-full"
                          variant="secondary"
                        >
                          {isLoadingEnglish ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <BookOpen className="h-4 w-4 mr-2" />
                          )}
                          <span className="text-sm">Teach me simple English from this room</span>
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Dạy mình tiếng Anh đơn giản từ phòng này
                        </p>

                        {englishResult && (
                          <div className="space-y-4 mt-4">
                            {/* Intro */}
                            {englishResult.intro_en && (
                              <div className="p-3 bg-muted rounded-lg">
                                <p className="text-sm">{englishResult.intro_en}</p>
                                {englishResult.intro_vi && (
                                  <p className="text-xs text-muted-foreground mt-1">{englishResult.intro_vi}</p>
                                )}
                              </div>
                            )}

                            {/* Items */}
                            {englishResult.items.map((item, idx) => (
                              <div key={idx} className="p-3 bg-secondary/30 rounded-lg space-y-2">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-semibold text-primary">{item.word}</span>
                                  <span className="text-sm text-muted-foreground">— {item.meaning_vi}</span>
                                </div>
                                <div className="text-sm pl-2 border-l-2 border-primary/30">
                                  <p>{item.example_en}</p>
                                  <p className="text-xs text-muted-foreground">{item.example_vi}</p>
                                </div>
                              </div>
                            ))}

                            {/* Encouragement */}
                            {englishResult.encouragement_en && (
                              <div className="p-3 bg-primary/5 rounded-lg text-center">
                                <p className="text-sm text-primary">{englishResult.encouragement_en}</p>
                                {englishResult.encouragement_vi && (
                                  <p className="text-xs text-primary/70">{englishResult.encouragement_vi}</p>
                                )}
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground text-center pt-2">
                              You can come back and practice again. / Bạn có thể quay lại luyện tiếp lúc khác.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                {/* Suggestions Tab */}
                <TabsContent value="suggest" className="flex-1 overflow-hidden m-0">
                  <ScrollArea className="h-full px-4 py-3">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Recommended for you
                      </h4>
                      
                      {suggestions.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No suggestions yet. Explore some rooms first!
                        </p>
                      ) : (
                        suggestions.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="p-3 bg-muted rounded-lg space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-sm">{item.title_en}</p>
                                <p className="text-xs text-muted-foreground">{item.title_vi}</p>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground uppercase">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/80">{item.reason_en}</p>
                            <p className="text-xs text-muted-foreground">{item.reason_vi}</p>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full mt-2"
                              onClick={() => {
                                const url = item.type === 'path' 
                                  ? `/paths/${item.slug}`
                                  : `/room/${item.slug}`;
                                navigate(url);
                                setIsOpen(false);
                              }}
                            >
                              <ChevronRight className="h-3 w-3 mr-1" />
                              {item.type === 'path' ? 'Go to path' : 'Go to room'}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      )}
    </>
  );
}
