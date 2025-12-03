import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircleQuestion, X, Send, BookOpen, User, Sparkles, ChevronRight, Loader2, Mic, Square, Volume2, GraduationCap, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMercyGuide, GuideArticle } from '@/hooks/useMercyGuide';
import { usePronunciationRecorder } from '@/hooks/usePronunciationRecorder';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { CompanionProfile, getCompanionProfile, markEnglishActivity } from '@/services/companion';
import { getSuggestionsForUser, SuggestedItem } from '@/services/suggestions';
import { getYesterdayAndTodaySummary, getRecentMoods, StudyLogEntry, MoodKey } from '@/services/studyLog';
import { BREATHING_SCRIPT_SHORT, POSITIVE_REFRAME_SHORT, COMPASSIONATE_HEAVY_MOOD_MESSAGE } from '@/data/breathing_scripts_en_vi';
import { MercyGuideProfileSettings } from './MercyGuideProfileSettings';
import { useNavigate } from 'react-router-dom';
import { 
  getMercyReply, 
  preloadMercyLibrary,
  getGreetingReplyId,
  getBreathingReplyId,
  getTeacherReplyId,
  getPraiseReplyId,
  buildMercyContext,
  type MercyReply,
  type MercyReplyId,
} from '@/mercy';

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

interface PronunciationFeedback {
  praise_en: string;
  praise_vi: string;
  focus_items: {
    word: string;
    tip_en: string;
    tip_vi: string;
  }[];
  encouragement_en: string;
  encouragement_vi: string;
}

interface PronunciationResult {
  targetText: string;
  transcribedText: string;
  score: number;
  feedback: PronunciationFeedback;
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

const FALLBACK_PRAISE = {
  en: "Thank you for trying. Speaking out loud is already a brave step.",
  vi: "Cảm ơn bạn đã thử. Dám nói ra thành tiếng đã là một bước rất can đảm rồi."
};

const MAX_SPEAK_ATTEMPTS = 20;
const SPEAK_SESSION_KEY = 'mb_speak_attempts';

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

function getSpeakProgressHint(profile: CompanionProfile): { en: string; vi: string } {
  const lastActivity = profile.last_english_activity;
  
  if (!lastActivity) {
    return {
      en: "This might be your first speaking practice here. Take it slow.",
      vi: "Có thể đây là lần đầu bạn luyện nói ở đây. Mình cứ đi thật chậm nhé."
    };
  }
  
  const now = Date.now();
  const daysSince = (now - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSince < 1) {
    return {
      en: "You already practiced speaking today. One more try is a bonus.",
      vi: "Hôm nay bạn đã luyện nói rồi. Thử thêm lần nữa chỉ là phần thưởng thôi."
    };
  }
  
  if (daysSince > 3) {
    return {
      en: "It has been a few days since we spoke together. Let's keep it light.",
      vi: "Mình đã vài ngày chưa luyện nói cùng nhau. Hôm nay mình làm thật nhẹ nhàng nhé."
    };
  }
  
  return {
    en: "You are doing well just by showing up here.",
    vi: "Chỉ cần bạn có mặt ở đây đã là rất tốt rồi."
  };
}

function extractFirstSentence(text: string): string {
  if (!text) return '';
  // Get first sentence, max ~80 chars
  const sentences = text.split(/[.!?]+/);
  const first = sentences[0]?.trim() || '';
  return first.length > 80 ? first.slice(0, 77) + '...' : first;
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
  
  // Teacher tab state
  const [yesterdaySummary, setYesterdaySummary] = useState<StudyLogEntry | undefined>();
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);
  const [hasHeavyMoods, setHasHeavyMoods] = useState(false);
  const [showBreathingScript, setShowBreathingScript] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [showReframe, setShowReframe] = useState(false);
  
  // Pronunciation coach state
  const [targetPhrase, setTargetPhrase] = useState('');
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [speakAttempts, setSpeakAttempts] = useState(0);
  const [speakLimitReached, setSpeakLimitReached] = useState(false);
  
  // Cached reply state
  const [cachedGreeting, setCachedGreeting] = useState<MercyReply | null>(null);
  const [cachedBreathingIntro, setCachedBreathingIntro] = useState<MercyReply | null>(null);
  
  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { 
    articles, 
    isEnabled, 
    canAskQuestion, 
    incrementQuestionCount,
    getQuestionsRemaining 
  } = useMercyGuide();
  
  const recorder = usePronunciationRecorder();
  
  // Preload mercy reply library
  useEffect(() => {
    preloadMercyLibrary();
  }, []);

  // Load profile and suggestions when panel opens
  useEffect(() => {
    if (!isOpen) return;
    
    async function loadData() {
      try {
        const profileData = await getCompanionProfile();
        setProfile(profileData);
        
        // Load cached greeting based on context
        const ctx = buildMercyContext({
          lastActiveAt: profileData.last_english_activity,
          isFirstVisit: !profileData.last_english_activity,
        });
        const greetingId = getGreetingReplyId(ctx);
        const greetingReply = await getMercyReply(greetingId);
        if (greetingReply) {
          setCachedGreeting(greetingReply);
          setCheckInMessage({ en: greetingReply.text_en, vi: greetingReply.text_vi });
        } else {
          // Fallback to dynamic message
          const message = getCheckInMessage(
            profileData, 
            profileData.last_english_activity || undefined,
            profileData.last_english_activity || undefined
          );
          setCheckInMessage(message);
        }
        
        // Load cached breathing intro
        const breathingReply = await getMercyReply(getBreathingReplyId('intro'));
        if (breathingReply) setCachedBreathingIntro(breathingReply);
        
        // Load suggestions
        const suggestionsData = await getSuggestionsForUser({
          profile: profileData,
          lastRoomId: roomId,
          lastTags: tags,
        });
        setSuggestions(suggestionsData);
        
        // Load teacher tab data
        const summary = await getYesterdayAndTodaySummary();
        setYesterdaySummary(summary.yesterday);
        setTodayTotalMinutes(summary.todayTotalMinutes);
        
        // Check for heavy moods
        const recentMoods = await getRecentMoods(3);
        const heavyCount = recentMoods.filter(m => m === 'heavy' || m === 'anxious').length;
        setHasHeavyMoods(heavyCount >= 2);
      } catch (error) {
        console.error('Failed to load guide data:', error);
      }
    }
    
    loadData();
  }, [isOpen, roomId, tags]);
  
  // Set target phrase from room content
  useEffect(() => {
    if (contentEn && !targetPhrase) {
      setTargetPhrase(extractFirstSentence(contentEn));
    }
  }, [contentEn, targetPhrase]);
  
  // Load speak attempts from session
  useEffect(() => {
    const stored = sessionStorage.getItem(SPEAK_SESSION_KEY);
    if (stored) {
      const attempts = parseInt(stored, 10);
      setSpeakAttempts(attempts);
      setSpeakLimitReached(attempts >= MAX_SPEAK_ATTEMPTS);
    }
  }, []);

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
  
  // Play target phrase using browser TTS
  const handlePlayTarget = useCallback(() => {
    if (!targetPhrase || isPlayingTarget) return;
    
    // Stop any existing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsPlayingTarget(true);
    utterance.onend = () => setIsPlayingTarget(false);
    utterance.onerror = () => setIsPlayingTarget(false);
    
    audioRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [targetPhrase, isPlayingTarget]);
  
  // Handle recording toggle
  const handleRecordToggle = useCallback(async () => {
    if (recorder.status === 'recording') {
      await recorder.stopRecording();
    } else {
      setPronunciationResult(null);
      await recorder.startRecording();
    }
  }, [recorder]);
  
  // Evaluate pronunciation when recording stops
  useEffect(() => {
    if (recorder.audioBlob && recorder.status === 'idle' && targetPhrase && !isEvaluating) {
      evaluatePronunciation();
    }
  }, [recorder.audioBlob, recorder.status]);
  
  const evaluatePronunciation = useCallback(async () => {
    if (!recorder.audioBlob || !targetPhrase) return;
    
    // Check attempt limit
    if (speakAttempts >= MAX_SPEAK_ATTEMPTS) {
      setSpeakLimitReached(true);
      return;
    }
    
    setIsEvaluating(true);
    
    try {
      // Convert blob to base64
      const arrayBuffer = await recorder.audioBlob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      const { data, error } = await supabase.functions.invoke('guide-pronunciation-coach', {
        body: {
          audioBase64: base64,
          targetText: targetPhrase.slice(0, 120),
          englishLevel: profile.english_level || 'beginner',
          preferredName: profile.preferred_name,
        },
      });
      
      if (error || !data?.ok) {
        throw new Error(data?.error || 'Failed to evaluate pronunciation');
      }
      
      setPronunciationResult(data as PronunciationResult);
      
      // Update attempts
      const newAttempts = speakAttempts + 1;
      setSpeakAttempts(newAttempts);
      sessionStorage.setItem(SPEAK_SESSION_KEY, String(newAttempts));
      
      if (newAttempts >= MAX_SPEAK_ATTEMPTS) {
        setSpeakLimitReached(true);
      }
      
      // Mark English activity
      markEnglishActivity();
      
    } catch (err) {
      console.error('Pronunciation evaluation error:', err);
      // Show fallback praise
      setPronunciationResult({
        targetText: targetPhrase,
        transcribedText: '',
        score: 0,
        feedback: {
          praise_en: FALLBACK_PRAISE.en,
          praise_vi: FALLBACK_PRAISE.vi,
          focus_items: [],
          encouragement_en: '',
          encouragement_vi: '',
        },
      });
    } finally {
      setIsEvaluating(false);
      recorder.reset();
    }
  }, [recorder.audioBlob, targetPhrase, profile, speakAttempts]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  const greeting = profile.preferred_name 
    ? { en: `Hi, ${profile.preferred_name}. How can I help?`, vi: `Chào ${profile.preferred_name}. Mình giúp gì được cho bạn?` }
    : { en: 'Hi! How can I help?', vi: 'Chào bạn! Mình giúp gì được?' };
    
  const speakProgressHint = getSpeakProgressHint(profile);

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
                <TabsList className="grid grid-cols-5 mx-3 mt-2">
                  <TabsTrigger value="guide" className="text-xs">
                    <MessageCircleQuestion className="h-3 w-3 mr-1" />
                    Guide
                  </TabsTrigger>
                  <TabsTrigger value="teacher" className="text-xs">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Teacher
                  </TabsTrigger>
                  <TabsTrigger value="english" className="text-xs" disabled={!contentEn && !roomId}>
                    <BookOpen className="h-3 w-3 mr-1" />
                    English
                  </TabsTrigger>
                  <TabsTrigger value="speak" className="text-xs" disabled={!contentEn && !roomId}>
                    <Mic className="h-3 w-3 mr-1" />
                    Speak
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

                {/* Teacher Tab */}
                <TabsContent value="teacher" className="flex-1 overflow-hidden m-0">
                  <ScrollArea className="h-full px-4 py-3">
                    <div className="space-y-4">
                      {/* Greeting with name + yesterday/today */}
                      <div className="p-3 bg-primary/5 rounded-lg space-y-2">
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

                      {/* Yesterday summary */}
                      <div className="p-3 bg-muted rounded-lg space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Yesterday</p>
                        {yesterdaySummary ? (
                          <>
                            <p className="text-sm">
                              You studied: <span className="font-medium">{yesterdaySummary.topic_en}</span>
                              {yesterdaySummary.minutes && ` (about ${yesterdaySummary.minutes} minutes)`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Hôm qua bạn đã học: {yesterdaySummary.topic_vi}
                              {yesterdaySummary.minutes && ` (khoảng ${yesterdaySummary.minutes} phút)`}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm">We don't have a study log from yesterday. That's okay.</p>
                            <p className="text-xs text-muted-foreground">Hôm qua mình không có ghi nhận buổi học nào. Không sao cả.</p>
                          </>
                        )}
                      </div>

                      {/* Today summary */}
                      <div className="p-3 bg-muted rounded-lg space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Today</p>
                        {todayTotalMinutes > 0 ? (
                          <>
                            <p className="text-sm">You already spent about <span className="font-medium">{todayTotalMinutes} minutes</span> here.</p>
                            <p className="text-xs text-muted-foreground">Hôm nay bạn đã ở đây khoảng {todayTotalMinutes} phút rồi.</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm">Today we can start with just 5–10 minutes.</p>
                            <p className="text-xs text-muted-foreground">Hôm nay mình chỉ cần bắt đầu với 5–10 phút thôi.</p>
                          </>
                        )}
                      </div>

                      {/* Heavy mood compassion message */}
                      {hasHeavyMoods && (
                        <div className="p-3 bg-primary/10 rounded-lg text-center">
                          <p className="text-sm text-primary">{COMPASSIONATE_HEAVY_MOOD_MESSAGE.en}</p>
                          <p className="text-xs text-primary/70 mt-1">{COMPASSIONATE_HEAVY_MOOD_MESSAGE.vi}</p>
                        </div>
                      )}

                      {/* Today's suggestion */}
                      {suggestions.length > 0 && (
                        <div className="p-3 bg-secondary/30 rounded-lg space-y-2">
                          <p className="text-xs font-medium text-foreground">Suggested for today:</p>
                          <div>
                            <p className="font-medium text-sm">{suggestions[0].title_en}</p>
                            <p className="text-xs text-muted-foreground">{suggestions[0].title_vi}</p>
                          </div>
                          <p className="text-xs text-foreground/80">{suggestions[0].reason_en}</p>
                          <p className="text-xs text-muted-foreground">{suggestions[0].reason_vi}</p>
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => {
                              const url = suggestions[0].type === 'path' 
                                ? `/paths/${suggestions[0].slug}`
                                : `/room/${suggestions[0].slug}`;
                              navigate(url);
                              setIsOpen(false);
                            }}
                          >
                            Study this today / Học cái này hôm nay
                          </Button>
                        </div>
                      )}

                      {/* Stress relief mini block */}
                      <div className="p-3 border border-border rounded-lg space-y-3">
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
                            <Wind className="h-4 w-4 mr-2" />
                            Guide me to breathe for 1 minute
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            {!showReframe ? (
                              <>
                                {/* Breathing steps */}
                                <div className="space-y-2">
                                  {BREATHING_SCRIPT_SHORT.en.slice(0, breathingStep + 1).map((line, idx) => (
                                    <div key={idx} className={cn(
                                      "p-2 rounded transition-all",
                                      idx === breathingStep ? "bg-primary/10" : "bg-muted/50"
                                    )}>
                                      <p className="text-sm">{line}</p>
                                      <p className="text-xs text-muted-foreground">{BREATHING_SCRIPT_SHORT.vi[idx]}</p>
                                    </div>
                                  ))}
                                </div>
                                
                                {breathingStep < BREATHING_SCRIPT_SHORT.en.length - 1 ? (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => setBreathingStep(prev => prev + 1)}
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
                                {/* Positive reframe */}
                                <div className="space-y-2 p-3 bg-primary/5 rounded-lg">
                                  {POSITIVE_REFRAME_SHORT.en.map((line, idx) => (
                                    <div key={idx}>
                                      <p className="text-sm text-primary">{line}</p>
                                      <p className="text-xs text-primary/70">{POSITIVE_REFRAME_SHORT.vi[idx]}</p>
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
                          <p className="text-xs text-muted-foreground text-center">
                            Dẫn mình thở 1 phút
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
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

                {/* Speak Tab - Pronunciation Coach */}
                <TabsContent value="speak" className="flex-1 overflow-hidden m-0">
                  <ScrollArea className="h-full px-4 py-3">
                    {!contentEn && !roomId ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Open a room to practice speaking English.
                      </p>
                    ) : speakLimitReached ? (
                      <div className="text-center py-8 space-y-2">
                        <p className="text-sm text-foreground">Let's rest your voice a bit.</p>
                        <p className="text-xs text-muted-foreground">You can practice more later.</p>
                        <p className="text-xs text-muted-foreground mt-4">Mình cho giọng bạn nghỉ một chút nhé. Lát nữa luyện tiếp cũng được.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Progress hint */}
                        <div className="p-2 bg-muted/50 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">{speakProgressHint.en}</p>
                          <p className="text-xs text-muted-foreground/70">{speakProgressHint.vi}</p>
                        </div>
                        
                        {/* Target phrase */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-foreground">
                            Practice this phrase:
                          </label>
                          <Input
                            value={targetPhrase}
                            onChange={(e) => setTargetPhrase(e.target.value.slice(0, 120))}
                            placeholder="Enter a phrase to practice..."
                            className="text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Luyện cụm từ này:
                          </p>
                        </div>
                        
                        {/* Listen button */}
                        <div className="space-y-1">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={handlePlayTarget}
                            disabled={!targetPhrase || isPlayingTarget}
                          >
                            {isPlayingTarget ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Volume2 className="h-4 w-4 mr-2" />
                            )}
                            Listen / Nghe
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">
                            Listen once or twice before you speak. / Hãy nghe một hai lần trước khi nói.
                          </p>
                        </div>
                        
                        {/* Record button */}
                        <div className="space-y-2">
                          <Button
                            variant={recorder.status === 'recording' ? 'destructive' : 'default'}
                            className="w-full"
                            onClick={handleRecordToggle}
                            disabled={!targetPhrase || isEvaluating || recorder.status === 'processing'}
                          >
                            {isEvaluating || recorder.status === 'processing' ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Evaluating...
                              </>
                            ) : recorder.status === 'recording' ? (
                              <>
                                <Square className="h-4 w-4 mr-2" />
                                Tap to stop / Nhấn để dừng
                              </>
                            ) : (
                              <>
                                <Mic className="h-4 w-4 mr-2" />
                                Tap to record / Nhấn để thu
                              </>
                            )}
                          </Button>
                          
                          {recorder.error && (
                            <div className="p-2 bg-destructive/10 rounded-lg">
                              <p className="text-xs text-destructive whitespace-pre-line">{recorder.error}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                If you can't use the mic, you can still read the phrase out loud to yourself. That still helps.
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Nếu chưa dùng được micro, bạn vẫn có thể tự đọc câu này thành tiếng. Vậy vẫn có ích lắm.
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Pronunciation results */}
                        {pronunciationResult && (
                          <div className="space-y-4 pt-4 border-t border-border">
                            {/* Praise */}
                            <div className="p-3 bg-primary/10 rounded-lg text-center">
                              <p className="text-sm font-medium text-primary">{pronunciationResult.feedback.praise_en}</p>
                              <p className="text-xs text-primary/70 mt-1">{pronunciationResult.feedback.praise_vi}</p>
                            </div>
                            
                            {/* Score - soft presentation */}
                            <div className="flex justify-center">
                              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                                Pronunciation clarity: {pronunciationResult.score}/100
                              </span>
                            </div>
                            
                            {/* What was heard */}
                            {pronunciationResult.transcribedText && (
                              <div className="p-2 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">I heard:</p>
                                <p className="text-sm">{pronunciationResult.transcribedText}</p>
                              </div>
                            )}
                            
                            {/* Focus items */}
                            {pronunciationResult.feedback.focus_items.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-foreground">Focus on:</p>
                                {pronunciationResult.feedback.focus_items.map((item, idx) => (
                                  <div key={idx} className="p-2 bg-secondary/30 rounded-lg">
                                    <p className="font-semibold text-sm text-primary">{item.word}</p>
                                    <p className="text-xs text-foreground mt-1">{item.tip_en}</p>
                                    <p className="text-xs text-muted-foreground">{item.tip_vi}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Encouragement */}
                            {pronunciationResult.feedback.encouragement_en && (
                              <div className="p-3 bg-primary/5 rounded-lg text-center">
                                <p className="text-sm text-primary">{pronunciationResult.feedback.encouragement_en}</p>
                                {pronunciationResult.feedback.encouragement_vi && (
                                  <p className="text-xs text-primary/70">{pronunciationResult.feedback.encouragement_vi}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Attempts remaining */}
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          {MAX_SPEAK_ATTEMPTS - speakAttempts} attempts remaining this session
                        </p>
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
