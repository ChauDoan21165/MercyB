/**
 * File: MercyGuide.tsx
 * Path: src/components/MercyGuide.tsx
 * Version: v2026-03-09-vi-pronunciation-fix-01
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircleQuestion, X, Send, BookOpen, User, Sparkles, ChevronRight, Loader2, Mic, Square, Volume2, GraduationCap, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMercyGuide, GuideArticle } from '@/hooks/useMercyGuide';
import { usePronunciationRecorder } from '@/hooks/usePronunciationRecorder';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { CompanionProfile, getCompanionProfile, markEnglishActivity } from '@/services/companion';
import { getSuggestionsForUser, SuggestedItem } from '@/services/suggestions';
import { getYesterdayAndTodaySummary, getRecentMoods, StudyLogEntry } from '@/services/studyLog';
import { BREATHING_SCRIPT_SHORT, POSITIVE_REFRAME_SHORT, COMPASSIONATE_HEAVY_MOOD_MESSAGE } from '@/data/breathing_scripts_en_vi';
import { MercyGuideProfileSettings } from './MercyGuideProfileSettings';
import { useNavigate } from 'react-router-dom';
import {
  getMercyReply,
  preloadMercyLibrary,
  getGreetingReplyId,
  getBreathingReplyId,
  buildMercyContext,
  type MercyReply,
} from '@/mercy';

interface MercyGuideProps {
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  contentEn?: string;
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
  en: 'Let us pause a bit. You can ask more questions later.',
  vi: 'Mình tạm dừng một chút nhé. Bạn có thể hỏi thêm sau.',
};

const FALLBACK_PRAISE = {
  en: 'Thank you for trying. Speaking out loud is already a brave step.',
  vi: 'Cảm ơn bạn đã thử. Dám nói ra thành tiếng đã là một bước rất can đảm rồi.',
};

const GUIDE_TIMEOUT_FALLBACK = {
  en: "Let's keep it simple for now. Try a shorter question, or open Speak if you want pronunciation help.",
  vi: 'Mình tạm làm đơn giản nhé. Bạn thử hỏi ngắn hơn, hoặc mở tab Speak nếu muốn luyện phát âm.',
};

const GUIDE_GENERIC_ERROR = {
  en: 'Sorry, I could not answer that. Please try again.',
  vi: 'Xin lỗi, mình không thể trả lời câu đó. Vui lòng thử lại.',
};

const PRONUNCIATION_ROUTE_REPLY = {
  en: 'For pronunciation, please open the Speak tab. I can listen there and help you practice one phrase at a time.',
  vi: 'Với phát âm, bạn mở tab Speak nhé. Ở đó mình có thể nghe và giúp bạn luyện từng cụm ngắn.',
};

const MAX_SPEAK_ATTEMPTS = 20;
const SPEAK_SESSION_KEY = 'mb_speak_attempts';
const GUIDE_ASSISTANT_TIMEOUT_MS = 12000;
const MERCY_HOST_IMAGE_SRC = '/mercy-host.jpg?v=3';
const MERCY_HOST_IMAGE_FALLBACK = '/mercy-host.png?v=3';

function getCheckInMessage(profile: CompanionProfile, lastActiveAt?: string, lastEnglishActivity?: string): { en: string; vi: string } | null {
  const name = profile.preferred_name || 'friend';
  const now = Date.now();

  if (lastActiveAt) {
    const daysSinceActive = (now - new Date(lastActiveAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActive > 7) {
      return {
        en: `${name}, it has been a little while. We can start with something very small today.`,
        vi: `${name} ơi, cũng khá lâu rồi. Hôm nay mình bắt đầu bằng một điều rất nhỏ thôi nhé.`,
      };
    }
  }

  if (lastEnglishActivity) {
    const daysSinceEnglish = (now - new Date(lastEnglishActivity).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceEnglish > 3) {
      return {
        en: 'We have not practiced English together for a few days. One short phrase today is already good.',
        vi: 'Mình đã vài ngày chưa luyện tiếng Anh cùng nhau. Chỉ một cụm ngắn hôm nay cũng đã là tốt rồi.',
      };
    }
  }

  return {
    en: 'You are doing well just by showing up here.',
    vi: 'Chỉ cần bạn có mặt ở đây đã là rất tốt rồi.',
  };
}

function getSpeakProgressHint(profile: CompanionProfile): { en: string; vi: string } {
  const lastActivity = profile.last_english_activity;

  if (!lastActivity) {
    return {
      en: 'This might be your first speaking practice here. Take it slow.',
      vi: 'Có thể đây là lần đầu bạn luyện nói ở đây. Mình cứ đi thật chậm nhé.',
    };
  }

  const now = Date.now();
  const daysSince = (now - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);

  if (daysSince < 1) {
    return {
      en: 'You already practiced speaking today. One more try is a bonus.',
      vi: 'Hôm nay bạn đã luyện nói rồi. Thử thêm lần nữa chỉ là phần thưởng thôi.',
    };
  }

  if (daysSince > 3) {
    return {
      en: "It has been a few days since we spoke together. Let's keep it light.",
      vi: 'Mình đã vài ngày chưa luyện nói cùng nhau. Hôm nay mình làm thật nhẹ nhàng nhé.',
    };
  }

  return {
    en: 'You are doing well just by showing up here.',
    vi: 'Chỉ cần bạn có mặt ở đây đã là rất tốt rồi.',
  };
}

function extractFirstSentence(text: string): string {
  if (!text) return '';
  const sentences = text.split(/[.!?]+/);
  const first = sentences[0]?.trim() || '';
  return first.length > 80 ? `${first.slice(0, 77)}...` : first;
}

function normalizeMercyInput(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function getLocalMercyReply(question: string): { en: string; vi?: string } | null {
  const q = normalizeMercyInput(question);

  if (/^(hi|hello|hey)/.test(q)) {
    return {
      en: "Hi. I'm here with you.",
      vi: 'Chào bạn. Mình ở đây với bạn.',
    };
  }

  if (q.includes('help')) {
    return {
      en: 'Ask me something small and we begin there.',
      vi: 'Bạn hỏi một điều nhỏ thôi nhé.',
    };
  }

  if (q.includes('start')) {
    return {
      en: 'Start with one small room.',
      vi: 'Mình bắt đầu bằng một room nhỏ nhé.',
    };
  }

  if (q.includes('tired') || q.includes('stress')) {
    return {
      en: 'Then we keep it light today.',
      vi: 'Hôm nay mình làm nhẹ thôi nhé.',
    };
  }

  return null;
}

function isPronunciationIntent(question: string): boolean {
  const q = normalizeMercyInput(question);
  return (
    q.includes('pronunciation') ||
    q.includes('pronounce') ||
    q.includes('fix my pronunciation') ||
    q.includes('correct my pronunciation') ||
    q.includes('speak better') ||
    q.includes('listen to my voice') ||
    q.includes('how do i say') ||
    q.includes('how to say') ||
    q.includes('phát âm') ||
    q.includes('sua phat am') ||
    q.includes('sửa phát âm') ||
    q.includes('chỉnh phát âm') ||
    q.includes('luyện phát âm') ||
    q.includes('giúp phát âm') ||
    q.includes('nghe phát âm') ||
    q.includes('nói đúng') ||
    q.includes('speak tab')
  );
}

function sanitizeAssistantAnswer(answer: string): string {
  return answer.replace(/\s+/g, ' ').trim();
}

function looksIncompleteAssistantAnswer(answer: string): boolean {
  const cleaned = sanitizeAssistantAnswer(answer);
  if (!cleaned) return true;

  const words = cleaned.split(' ');
  if (words.length < 4) return false;

  const lastChar = cleaned.slice(-1);
  const hasEndingPunctuation = /[.!?]"?$/.test(cleaned);
  const badTailPattern =
    /\b(is|are|was|were|am|to|for|with|about|on|in|and|or|but|that|this|your|my|the|a|an|of)\s*$/i;

  return !hasEndingPunctuation || badTailPattern.test(cleaned) || lastChar === ',';
}

export function MercyGuide({ roomId, roomTitle, tier, pathSlug, tags, contentEn }: MercyGuideProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('guide');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [profile, setProfile] = useState<CompanionProfile>({});
  const [checkInMessage, setCheckInMessage] = useState<{ en: string; vi: string } | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  const [isLoadingEnglish, setIsLoadingEnglish] = useState(false);
  const [englishResult, setEnglishResult] = useState<EnglishHelperResult | null>(null);

  const [yesterdaySummary, setYesterdaySummary] = useState<StudyLogEntry | undefined>();
  const [todayTotalMinutes, setTodayTotalMinutes] = useState(0);
  const [hasHeavyMoods, setHasHeavyMoods] = useState(false);
  const [showBreathingScript, setShowBreathingScript] = useState(false);
  const [breathingStep, setBreathingStep] = useState(0);
  const [showReframe, setShowReframe] = useState(false);

  const [targetPhrase, setTargetPhrase] = useState('');
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [speakAttempts, setSpeakAttempts] = useState(0);
  const [speakLimitReached, setSpeakLimitReached] = useState(false);

  const [cachedGreeting, setCachedGreeting] = useState<MercyReply | null>(null);
  const [cachedBreathingIntro, setCachedBreathingIntro] = useState<MercyReply | null>(null);

  const audioRef = useRef<SpeechSynthesisUtterance | null>(null);

  const {
    articles,
    isEnabled,
    canAskQuestion,
    incrementQuestionCount,
    getQuestionsRemaining,
  } = useMercyGuide();

  const recorder = usePronunciationRecorder();

  const handleAvatarError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.dataset.fallbackApplied) {
      img.dataset.fallbackApplied = 'true';
      img.src = MERCY_HOST_IMAGE_FALLBACK;
      return;
    }

    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.classList.add('flex', 'items-center', 'justify-center');
      parent.innerHTML = '<span class="text-xs font-semibold text-rose-700">MH</span>';
    }
  }, []);

  useEffect(() => {
    preloadMercyLibrary();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      try {
        const profileData = await getCompanionProfile();
        setProfile(profileData);

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
          const message = getCheckInMessage(
            profileData,
            profileData.last_english_activity || undefined,
            profileData.last_english_activity || undefined,
          );
          setCheckInMessage(message);
        }

        const breathingReply = await getMercyReply(getBreathingReplyId('intro'));
        if (breathingReply) setCachedBreathingIntro(breathingReply);

        const suggestionsData = await getSuggestionsForUser({
          profile: profileData,
          lastRoomId: roomId,
          lastTags: tags,
        });
        setSuggestions(suggestionsData);

        const summary = await getYesterdayAndTodaySummary();
        setYesterdaySummary(summary.yesterday);
        setTodayTotalMinutes(summary.todayTotalMinutes);

        const recentMoods = await getRecentMoods(3);
        const heavyCount = recentMoods.filter(m => m === 'heavy' || m === 'anxious').length;
        setHasHeavyMoods(heavyCount >= 2);
      } catch (error) {
        console.error('Failed to load guide data:', error);
      }
    }

    loadData();
  }, [isOpen, roomId, tags]);

  useEffect(() => {
    if (contentEn && !targetPhrase) {
      setTargetPhrase(extractFirstSentence(contentEn));
    }
  }, [contentEn, targetPhrase]);

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
      setMessages(prev => [
        ...prev.slice(-4),
        {
          id: `limit-${Date.now()}`,
          type: 'assistant',
          content: RATE_LIMIT_MESSAGE.en,
          contentVi: RATE_LIMIT_MESSAGE.vi,
        },
      ]);
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question,
    };

    setMessages(prev => [...prev.slice(-4), userMsg]);
    setInputValue('');

    const localReply = getLocalMercyReply(question);

    if (localReply) {
      setMessages(prev => [
        ...prev.slice(-4),
        {
          id: `assistant-local-${Date.now()}`,
          type: 'assistant',
          content: localReply.en,
          contentVi: localReply.vi,
        },
      ]);
    }

    if (isPronunciationIntent(question)) {
      setMessages(prev => [
        ...prev.slice(-4),
        {
          id: `assistant-pronunciation-${Date.now()}`,
          type: 'assistant',
          content: PRONUNCIATION_ROUTE_REPLY.en,
          contentVi: PRONUNCIATION_ROUTE_REPLY.vi,
        },
      ]);
      return;
    }

    setIsAsking(true);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const invokePromise = supabase.functions.invoke('guide-assistant', {
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

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Guide assistant timeout'));
        }, GUIDE_ASSISTANT_TIMEOUT_MS);
      });

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]);

      incrementQuestionCount();

      if (error || !data?.ok || !data?.answer) {
        throw new Error(data?.error || 'Failed to get response');
      }

      const cleanedAnswer = sanitizeAssistantAnswer(data.answer);

      if (looksIncompleteAssistantAnswer(cleanedAnswer)) {
        throw new Error('Guide assistant returned incomplete answer');
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: cleanedAnswer,
      };

      setMessages(prev => [...prev.slice(-4), assistantMsg]);
    } catch (err) {
      console.error('Mercy assistant failed:', err);

      const isTimeoutOrIncomplete =
        err instanceof Error &&
        (err.message.includes('timeout') || err.message.includes('incomplete') || err.name === 'AbortError');

      setMessages(prev => [
        ...prev.slice(-4),
        {
          id: `${isTimeoutOrIncomplete ? 'fallback' : 'error'}-${Date.now()}`,
          type: 'assistant',
          content: isTimeoutOrIncomplete ? GUIDE_TIMEOUT_FALLBACK.en : GUIDE_GENERIC_ERROR.en,
          contentVi: isTimeoutOrIncomplete ? GUIDE_TIMEOUT_FALLBACK.vi : GUIDE_GENERIC_ERROR.vi,
        },
      ]);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsAsking(false);
    }
  }, [
    inputValue,
    isAsking,
    canAskQuestion,
    incrementQuestionCount,
    roomId,
    roomTitle,
    tier,
    pathSlug,
    tags,
    profile,
  ]);

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

      try {
        const result = JSON.parse(data.answer) as EnglishHelperResult;
        setEnglishResult(result);
      } catch {
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

  const handlePlayTarget = useCallback(() => {
    if (!targetPhrase || isPlayingTarget) return;

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

  const handleRecordToggle = useCallback(async () => {
    if (recorder.status === 'recording') {
      await recorder.stopRecording();
    } else {
      setPronunciationResult(null);
      await recorder.startRecording();
    }
  }, [recorder]);

  const evaluatePronunciation = useCallback(async () => {
    if (!recorder.audioBlob || !targetPhrase) return;

    if (speakAttempts >= MAX_SPEAK_ATTEMPTS) {
      setSpeakLimitReached(true);
      return;
    }

    setIsEvaluating(true);

    try {
      const arrayBuffer = await recorder.audioBlob.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
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

      const newAttempts = speakAttempts + 1;
      setSpeakAttempts(newAttempts);
      sessionStorage.setItem(SPEAK_SESSION_KEY, String(newAttempts));

      if (newAttempts >= MAX_SPEAK_ATTEMPTS) {
        setSpeakLimitReached(true);
      }

      markEnglishActivity();
    } catch (err) {
      console.error('Pronunciation evaluation error:', err);
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
  }, [recorder.audioBlob, targetPhrase, profile, speakAttempts, recorder]);

  useEffect(() => {
    if (recorder.audioBlob && recorder.status === 'idle' && targetPhrase && !isEvaluating) {
      evaluatePronunciation();
    }
  }, [recorder.audioBlob, recorder.status, targetPhrase, isEvaluating, evaluatePronunciation]);

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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 z-40 group"
          aria-label="Open Mercy Guide"
        >
          <div className="relative flex items-end justify-end">
            <div className="absolute -left-20 top-2 z-0 rotate-[-20deg] rounded-[24px] bg-white px-3 py-2.5 shadow-xl ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-[1.02]">
              <div className="leading-none">
                <p className="text-[16px] font-extrabold tracking-tight text-black">
                  Mercy Host
                </p>
                <p className="mt-1 text-[11px] font-medium text-black/70">
                  Need a guide?
                </p>
              </div>
            </div>

            <div className="relative z-10 h-28 w-28 rounded-full bg-pink-200 p-[6px] shadow-2xl ring-4 ring-white transition-transform duration-200 group-hover:scale-[1.03]">
              <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-b from-pink-100 to-rose-100">
                <img
                  src={MERCY_HOST_IMAGE_SRC}
                  alt="Mercy Host"
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  onError={handleAvatarError}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full bg-white/10" />
            </div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 flex max-h-[75vh] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-pink-100 ring-2 ring-pink-200">
                <img
                  src={MERCY_HOST_IMAGE_SRC}
                  alt="Mercy Host"
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                  onError={handleAvatarError}
                />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Mercy Guide</h3>
                <p className="text-xs text-muted-foreground">{greeting.en}</p>
              </div>
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

          {showSettings && (
            <MercyGuideProfileSettings
              onClose={() => setShowSettings(false)}
              onSaved={(newProfile) => setProfile(prev => ({ ...prev, ...newProfile }))}
            />
          )}

          {!showSettings && (
            <>
              {checkInMessage && (
                <div className="border-b border-primary/10 bg-primary/5 px-4 py-2">
                  <p className="text-sm text-foreground">{checkInMessage.en}</p>
                  <p className="text-xs text-muted-foreground">{checkInMessage.vi}</p>
                </div>
              )}

              {!profile.preferred_name && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="border-b border-border px-4 py-2 text-left text-xs text-primary hover:underline"
                >
                  Tell me your name →
                </button>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
                <TabsList className="mx-3 mt-2 grid grid-cols-5">
                  <TabsTrigger value="guide" className="text-xs">
                    <MessageCircleQuestion className="mr-1 h-3 w-3" />
                    Guide
                  </TabsTrigger>
                  <TabsTrigger value="teacher" className="text-xs">
                    <GraduationCap className="mr-1 h-3 w-3" />
                    Teacher
                  </TabsTrigger>
                  <TabsTrigger value="english" className="text-xs" disabled={!contentEn && !roomId}>
                    <BookOpen className="mr-1 h-3 w-3" />
                    English
                  </TabsTrigger>
                  <TabsTrigger value="speak" className="text-xs" disabled={!contentEn && !roomId}>
                    <Mic className="mr-1 h-3 w-3" />
                    Speak
                  </TabsTrigger>
                  <TabsTrigger value="suggest" className="text-xs">
                    <Sparkles className="mr-1 h-3 w-3" />
                    For You
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="guide" className="m-0 flex flex-1 flex-col overflow-hidden">
                  <div className="flex flex-wrap gap-1 border-b border-border px-3 py-2">
                    {QUICK_BUTTONS.map(btn => (
                      <button
                        key={btn.key}
                        onClick={() => handleQuickButton(btn.key)}
                        className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground transition-colors hover:bg-secondary/80"
                      >
                        {btn.label_en}
                      </button>
                    ))}
                  </div>

                  <ScrollArea className="flex-1 px-4 py-3">
                    <div className="space-y-3">
                      {messages.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          Click a quick button or type a question below.
                        </p>
                      )}
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={cn(
                            'rounded-lg px-3 py-2 text-sm',
                            msg.type === 'user'
                              ? 'ml-8 bg-primary text-primary-foreground'
                              : 'mr-8 bg-muted text-foreground',
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
                        <div className="mr-8 flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Mercy is thinking...
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="border-t border-border bg-muted/30 px-3 py-2">
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
                        onClick={handleAskQuestion}
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

                <TabsContent value="teacher" className="m-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-full px-4 py-3">
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
                        <p className="text-xs font-medium uppercase text-muted-foreground">Yesterday</p>
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
                            <p className="text-sm">We don&apos;t have a study log from yesterday. That&apos;s okay.</p>
                            <p className="text-xs text-muted-foreground">Hôm qua mình không có ghi nhận buổi học nào. Không sao cả.</p>
                          </>
                        )}
                      </div>

                      <div className="space-y-1 rounded-lg bg-muted p-3">
                        <p className="text-xs font-medium uppercase text-muted-foreground">Today</p>
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

                      {hasHeavyMoods && (
                        <div className="rounded-lg bg-primary/10 p-3 text-center">
                          <p className="text-sm text-primary">{COMPASSIONATE_HEAVY_MOOD_MESSAGE.en}</p>
                          <p className="mt-1 text-xs text-primary/70">{COMPASSIONATE_HEAVY_MOOD_MESSAGE.vi}</p>
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
                            Guide me to breathe for 1 minute
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            {!showReframe ? (
                              <>
                                <div className="space-y-2">
                                  {BREATHING_SCRIPT_SHORT.en.slice(0, breathingStep + 1).map((line, idx) => (
                                    <div
                                      key={idx}
                                      className={cn(
                                        'rounded p-2 transition-all',
                                        idx === breathingStep ? 'bg-primary/10' : 'bg-muted/50',
                                      )}
                                    >
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
                                <div className="space-y-2 rounded-lg bg-primary/5 p-3">
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
                          <p className="text-center text-xs text-muted-foreground">
                            Dẫn mình thở 1 phút
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="english" className="m-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-full px-4 py-3">
                    {!contentEn && !roomId ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
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
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <BookOpen className="mr-2 h-4 w-4" />
                          )}
                          <span className="text-sm">Teach me simple English from this room</span>
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                          Dạy mình tiếng Anh đơn giản từ phòng này
                        </p>

                        {englishResult && (
                          <div className="mt-4 space-y-4">
                            {englishResult.intro_en && (
                              <div className="rounded-lg bg-muted p-3">
                                <p className="text-sm">{englishResult.intro_en}</p>
                                {englishResult.intro_vi && (
                                  <p className="mt-1 text-xs text-muted-foreground">{englishResult.intro_vi}</p>
                                )}
                              </div>
                            )}

                            {englishResult.items.map((item, idx) => (
                              <div key={idx} className="space-y-2 rounded-lg bg-secondary/30 p-3">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-semibold text-primary">{item.word}</span>
                                  <span className="text-sm text-muted-foreground">— {item.meaning_vi}</span>
                                </div>
                                <div className="border-l-2 border-primary/30 pl-2 text-sm">
                                  <p>{item.example_en}</p>
                                  <p className="text-xs text-muted-foreground">{item.example_vi}</p>
                                </div>
                              </div>
                            ))}

                            {englishResult.encouragement_en && (
                              <div className="rounded-lg bg-primary/5 p-3 text-center">
                                <p className="text-sm text-primary">{englishResult.encouragement_en}</p>
                                {englishResult.encouragement_vi && (
                                  <p className="text-xs text-primary/70">{englishResult.encouragement_vi}</p>
                                )}
                              </div>
                            )}

                            <p className="pt-2 text-center text-xs text-muted-foreground">
                              You can come back and practice again. / Bạn có thể quay lại luyện tiếp lúc khác.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="speak" className="m-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-full px-4 py-3">
                    {!contentEn && !roomId ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        Open a room to practice speaking English.
                      </p>
                    ) : speakLimitReached ? (
                      <div className="space-y-2 py-8 text-center">
                        <p className="text-sm text-foreground">Let&apos;s rest your voice a bit.</p>
                        <p className="text-xs text-muted-foreground">You can practice more later.</p>
                        <p className="mt-4 text-xs text-muted-foreground">Mình cho giọng bạn nghỉ một chút nhé. Lát nữa luyện tiếp cũng được.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="rounded-lg bg-muted/50 p-2 text-center">
                          <p className="text-xs text-muted-foreground">{speakProgressHint.en}</p>
                          <p className="text-xs text-muted-foreground/70">{speakProgressHint.vi}</p>
                        </div>

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

                        <div className="space-y-1">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={handlePlayTarget}
                            disabled={!targetPhrase || isPlayingTarget}
                          >
                            {isPlayingTarget ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Volume2 className="mr-2 h-4 w-4" />
                            )}
                            Listen / Nghe
                          </Button>
                          <p className="text-center text-xs text-muted-foreground">
                            Listen once or twice before you speak. / Hãy nghe một hai lần trước khi nói.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Button
                            variant={recorder.status === 'recording' ? 'destructive' : 'default'}
                            className="w-full"
                            onClick={handleRecordToggle}
                            disabled={!targetPhrase || isEvaluating || recorder.status === 'processing'}
                          >
                            {isEvaluating || recorder.status === 'processing' ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Evaluating...
                              </>
                            ) : recorder.status === 'recording' ? (
                              <>
                                <Square className="mr-2 h-4 w-4" />
                                Tap to stop / Nhấn để dừng
                              </>
                            ) : (
                              <>
                                <Mic className="mr-2 h-4 w-4" />
                                Tap to record / Nhấn để thu
                              </>
                            )}
                          </Button>

                          {recorder.error && (
                            <div className="rounded-lg bg-destructive/10 p-2">
                              <p className="whitespace-pre-line text-xs text-destructive">{recorder.error}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                If you can&apos;t use the mic, you can still read the phrase out loud to yourself. That still helps.
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Nếu chưa dùng được micro, bạn vẫn có thể tự đọc câu này thành tiếng. Vậy vẫn có ích lắm.
                              </p>
                            </div>
                          )}
                        </div>

                        {pronunciationResult && (
                          <div className="space-y-4 border-t border-border pt-4">
                            <div className="rounded-lg bg-primary/10 p-3 text-center">
                              <p className="text-sm font-medium text-primary">{pronunciationResult.feedback.praise_en}</p>
                              <p className="mt-1 text-xs text-primary/70">{pronunciationResult.feedback.praise_vi}</p>
                            </div>

                            <div className="flex justify-center">
                              <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                                Pronunciation clarity: {pronunciationResult.score}/100
                              </span>
                            </div>

                            {pronunciationResult.transcribedText && (
                              <div className="rounded-lg bg-muted p-2">
                                <p className="mb-1 text-xs text-muted-foreground">I heard:</p>
                                <p className="text-sm">{pronunciationResult.transcribedText}</p>
                              </div>
                            )}

                            {pronunciationResult.feedback.focus_items.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-medium text-foreground">Focus on:</p>
                                {pronunciationResult.feedback.focus_items.map((item, idx) => (
                                  <div key={idx} className="rounded-lg bg-secondary/30 p-2">
                                    <p className="text-sm font-semibold text-primary">{item.word}</p>
                                    <p className="mt-1 text-xs text-foreground">{item.tip_en}</p>
                                    <p className="text-xs text-muted-foreground">{item.tip_vi}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {pronunciationResult.feedback.encouragement_en && (
                              <div className="rounded-lg bg-primary/5 p-3 text-center">
                                <p className="text-sm text-primary">{pronunciationResult.feedback.encouragement_en}</p>
                                {pronunciationResult.feedback.encouragement_vi && (
                                  <p className="text-xs text-primary/70">{pronunciationResult.feedback.encouragement_vi}</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        <p className="pt-2 text-center text-xs text-muted-foreground">
                          {MAX_SPEAK_ATTEMPTS - speakAttempts} attempts remaining this session
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="suggest" className="m-0 flex-1 overflow-hidden">
                  <ScrollArea className="h-full px-4 py-3">
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-medium">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Recommended for you
                      </h4>

                      {suggestions.length === 0 ? (
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          No suggestions yet. Explore some rooms first!
                        </p>
                      ) : (
                        suggestions.map((item, idx) => (
                          <div
                            key={idx}
                            className="space-y-2 rounded-lg bg-muted p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">{item.title_en}</p>
                                <p className="text-xs text-muted-foreground">{item.title_vi}</p>
                              </div>
                              <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase text-secondary-foreground">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/80">{item.reason_en}</p>
                            <p className="text-xs text-muted-foreground">{item.reason_vi}</p>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="mt-2 w-full"
                              onClick={() => {
                                const url = item.type === 'path'
                                  ? `/paths/${item.slug}`
                                  : `/room/${item.slug}`;
                                navigate(url);
                                setIsOpen(false);
                              }}
                            >
                              <ChevronRight className="mr-1 h-3 w-3" />
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