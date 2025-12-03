import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  GUIDE_ENABLED: 'mb_mercy_guide_enabled',
  QUESTIONS_THIS_HOUR: 'mb_guide_questions_hour',
  HOUR_TIMESTAMP: 'mb_guide_hour_ts',
};

const MAX_QUESTIONS_PER_HOUR = 10;

export interface GuideArticle {
  title_en: string;
  title_vi: string;
  body_en: string;
  body_vi: string;
}

export type GuideArticles = Record<string, GuideArticle>;

let articlesCache: GuideArticles | null = null;

export function useMercyGuide() {
  const [articles, setArticles] = useState<GuideArticles | null>(articlesCache);
  const [isLoading, setIsLoading] = useState(!articlesCache);
  const [isEnabled, setIsEnabled] = useState(true);

  // Load articles
  useEffect(() => {
    if (articlesCache) {
      setArticles(articlesCache);
      setIsLoading(false);
      return;
    }

    fetch('/data/guide_articles_en_vi.json')
      .then(res => res.json())
      .then(data => {
        articlesCache = data;
        setArticles(data);
      })
      .catch(err => {
        console.error('Failed to load guide articles:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Load enabled state
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.GUIDE_ENABLED);
    if (stored !== null) {
      setIsEnabled(stored === 'true');
    }
  }, []);

  const setGuideEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
    localStorage.setItem(STORAGE_KEYS.GUIDE_ENABLED, String(enabled));
  }, []);

  const canAskQuestion = useCallback((): boolean => {
    const now = Date.now();
    const hourTs = localStorage.getItem(STORAGE_KEYS.HOUR_TIMESTAMP);
    const questionsStr = localStorage.getItem(STORAGE_KEYS.QUESTIONS_THIS_HOUR);

    // Reset if hour has passed
    if (!hourTs || now - parseInt(hourTs, 10) > 3600000) {
      localStorage.setItem(STORAGE_KEYS.HOUR_TIMESTAMP, String(now));
      localStorage.setItem(STORAGE_KEYS.QUESTIONS_THIS_HOUR, '0');
      return true;
    }

    const questions = parseInt(questionsStr || '0', 10);
    return questions < MAX_QUESTIONS_PER_HOUR;
  }, []);

  const incrementQuestionCount = useCallback(() => {
    const questionsStr = localStorage.getItem(STORAGE_KEYS.QUESTIONS_THIS_HOUR);
    const questions = parseInt(questionsStr || '0', 10);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS_THIS_HOUR, String(questions + 1));
  }, []);

  const getQuestionsRemaining = useCallback((): number => {
    const now = Date.now();
    const hourTs = localStorage.getItem(STORAGE_KEYS.HOUR_TIMESTAMP);

    if (!hourTs || now - parseInt(hourTs, 10) > 3600000) {
      return MAX_QUESTIONS_PER_HOUR;
    }

    const questionsStr = localStorage.getItem(STORAGE_KEYS.QUESTIONS_THIS_HOUR);
    const questions = parseInt(questionsStr || '0', 10);
    return Math.max(0, MAX_QUESTIONS_PER_HOUR - questions);
  }, []);

  return {
    articles,
    isLoading,
    isEnabled,
    setGuideEnabled,
    canAskQuestion,
    incrementQuestionCount,
    getQuestionsRemaining,
  };
}
