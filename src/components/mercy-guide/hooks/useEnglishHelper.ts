import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { normalizeEnglishHelperResult, EnglishHelperResult } from '../shared';

interface UseEnglishHelperParams {
  roomId?: string;
  roomTitle?: string;
  contentEn?: string;
  englishLevel?: string | null;
}

export function useEnglishHelper({
  roomId,
  roomTitle,
  contentEn,
  englishLevel,
}: UseEnglishHelperParams) {
  const [isLoadingEnglish, setIsLoadingEnglish] = useState(false);
  const [englishResult, setEnglishResult] = useState<EnglishHelperResult | null>(null);

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
          englishLevel: englishLevel || 'beginner',
          sourceText: contentEn.slice(0, 1200),
          userQuestion: 'Teach me simple English from this room.',
        },
      });

      if (error || !data?.ok) {
        throw new Error(data?.error || 'Failed to get English help');
      }

      try {
        const result = normalizeEnglishHelperResult(
          JSON.parse(data.answer) as Partial<EnglishHelperResult>
        );
        setEnglishResult(result);
      } catch {
        setEnglishResult(
          normalizeEnglishHelperResult({
            intro_en: data.answer,
            intro_vi: '',
            items: [],
            encouragement_en: '',
            encouragement_vi: '',
          })
        );
      }
    } catch (err) {
      console.error('English helper error:', err);
      setEnglishResult(
        normalizeEnglishHelperResult({
          intro_en: 'Sorry, I could not help with English right now. Please try again.',
          intro_vi: 'Xin lỗi, mình không thể hỗ trợ tiếng Anh lúc này. Vui lòng thử lại.',
          items: [],
          encouragement_en: '',
          encouragement_vi: '',
        })
      );
    } finally {
      setIsLoadingEnglish(false);
    }
  }, [contentEn, isLoadingEnglish, roomId, roomTitle, englishLevel]);

  return {
    isLoadingEnglish,
    englishResult,
    handleLearnEnglish,
  };
}