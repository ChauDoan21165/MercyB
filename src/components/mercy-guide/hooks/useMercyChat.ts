import { useCallback, useState } from 'react';
import { GuideArticle } from '@/hooks/useMercyGuide';
import { supabase } from '@/lib/supabaseClient';
import {
  GUIDE_ASSISTANT_TIMEOUT_MS,
  GUIDE_GENERIC_ERROR,
  GUIDE_TIMEOUT_FALLBACK,
  GuideAssistantResponse,
  Message,
  PRONUNCIATION_ROUTE_REPLY,
  RATE_LIMIT_MESSAGE,
  SPEAK_LOCATION_REPLY,
  getAssistantVietnamese,
  getLocalMercyReply,
  isPronunciationIntent,
  isSpeakLocationIntent,
  looksIncompleteAssistantAnswer,
  sanitizeAssistantAnswer,
  splitBilingualAnswer,
} from '../shared';

interface UseMercyChatParams {
  articles: Record<string, GuideArticle> | undefined;
  canAskQuestion: () => boolean;
  incrementQuestionCount: () => void;
  roomId?: string;
  roomTitle?: string;
  tier?: string;
  pathSlug?: string;
  tags?: string[];
  englishLevel?: string | null;
  learningGoal?: string | null;
  onRequestSpeakTab: () => void;
}

export function useMercyChat({
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
}: UseMercyChatParams) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const handleQuickButton = useCallback(
    (key: string) => {
      if (!articles || !articles[key]) return;

      const article = articles[key] as GuideArticle;
      const newMessage: Message = {
        id: `article-${Date.now()}`,
        type: 'article',
        content: article.body_en,
        contentVi: article.body_vi,
      };

      appendMessage(newMessage);
    },
    [articles, appendMessage]
  );

  const handleAskQuestion = useCallback(async () => {
    const question = inputValue.trim();
    if (!question || isAsking) return;

    if (!canAskQuestion()) {
      appendMessage({
        id: `limit-${Date.now()}`,
        type: 'assistant',
        content: RATE_LIMIT_MESSAGE.en,
        contentVi: RATE_LIMIT_MESSAGE.vi,
      });
      return;
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: question,
    };

    appendMessage(userMsg);
    setInputValue('');

    const localReply = getLocalMercyReply(question);
    if (localReply) {
      appendMessage({
        id: `assistant-local-${Date.now()}`,
        type: 'assistant',
        content: localReply.en,
        contentVi: localReply.vi,
      });
      return;
    }

    if (isPronunciationIntent(question)) {
      appendMessage({
        id: `assistant-pronunciation-${Date.now()}`,
        type: 'assistant',
        content: PRONUNCIATION_ROUTE_REPLY.en,
        contentVi: PRONUNCIATION_ROUTE_REPLY.vi,
      });
      onRequestSpeakTab();
      return;
    }

    if (isSpeakLocationIntent(question)) {
      appendMessage({
        id: `assistant-speak-location-${Date.now()}`,
        type: 'assistant',
        content: SPEAK_LOCATION_REPLY.en,
        contentVi: SPEAK_LOCATION_REPLY.vi,
      });
      onRequestSpeakTab();
      return;
    }

    setIsAsking(true);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const invokePromise = supabase.functions.invoke<GuideAssistantResponse>(
        'guide-assistant',
        {
          body: {
            question,
            roomId,
            roomTitle,
            language: 'en_vi',
            responseMode: 'bilingual_en_vi',
            context: {
              tier: tier || 'Free',
              pathSlug,
              tags: tags || [],
              englishLevel,
              learningGoal,
            },
          },
        }
      );

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

      const splitAnswer = splitBilingualAnswer(data.answer);
      const cleanedAnswer = sanitizeAssistantAnswer(splitAnswer.en || data.answer);

      if (looksIncompleteAssistantAnswer(cleanedAnswer)) {
        throw new Error('Guide assistant returned incomplete answer');
      }

      const fallbackVi =
        getAssistantVietnamese(data, data.answer) ||
        splitAnswer.vi ||
        'Mình đang trả lời bằng tiếng Anh trước nhé.';

      appendMessage({
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: cleanedAnswer,
        contentVi: fallbackVi,
      });
    } catch (err) {
      console.error('Mercy assistant failed:', err);

      const isTimeoutOrIncomplete =
        err instanceof Error &&
        (err.message.includes('timeout') ||
          err.message.includes('incomplete') ||
          err.name === 'AbortError');

      appendMessage({
        id: `${isTimeoutOrIncomplete ? 'fallback' : 'error'}-${Date.now()}`,
        type: 'assistant',
        content: isTimeoutOrIncomplete
          ? GUIDE_TIMEOUT_FALLBACK.en
          : GUIDE_GENERIC_ERROR.en,
        contentVi: isTimeoutOrIncomplete
          ? GUIDE_TIMEOUT_FALLBACK.vi
          : GUIDE_GENERIC_ERROR.vi,
      });
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
    appendMessage,
    onRequestSpeakTab,
    roomId,
    roomTitle,
    tier,
    pathSlug,
    tags,
    englishLevel,
    learningGoal,
    incrementQuestionCount,
  ]);

  return {
    messages,
    inputValue,
    setInputValue,
    isAsking,
    handleQuickButton,
    handleAskQuestion,
  };
}